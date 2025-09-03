import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useNavigate } from 'react-router-dom'
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from '../../s3config';
import { v4 as uuidv4 } from 'uuid';
import './WritePost.css';
import GenLoader from '../components/GenLoader.jsx'
import { useToast } from '../misc/ToastManager.jsx'
import { useAuth } from "../misc/AuthContext.jsx";
import { blogAPI } from "../api/blogAPI.js";
import RemoveMarkdown from "remove-markdown";
import ExpandableTagSelectionScreen from "./ExpandableTagSelectionScreen.jsx";

export default function WritePost() {
    const [value, setValue] = useState("");
    const [mediaUploads, setMediaUploads] = useState(new Map());
    const [ytIds, setYtIds] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [blogId] = useState(uuidv4())
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { currentUser } = useAuth()
    const [textAreaEl, setTextAreaEl] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef(null);
    const [lastEdit, setLastEdit] = useState(null)
    const [rewriting, setRewriting] = useState(false)
    const countRef = useRef(0);
    const [userSelectedTags, setUserSelectedTags] = useState(new Set());


    const createPreviewUrl = useCallback((file) => {
        return URL.createObjectURL(file);
    }, []);

    const handleMediaUpload = useCallback(async (event, mediaType) => {
        const file = event.target.files[0];
        if (file) {
            const uploadId = uuidv4();
            const previewUrl = createPreviewUrl(file);

            setMediaUploads(prev => new Map(prev).set(uploadId, {
                file,
                previewUrl,
                type: mediaType,
                uploaded: false
            }));

            let contentToAdd = '';
            if (mediaType === 'image') {
                contentToAdd = `<div style="display: flex; justify-content: center; width: 100%;">
                <img src="${previewUrl}" alt="${file.name}" style="max-width: 600px; height: auto;" />
            </div>`
            } else if (mediaType === 'video') {
                contentToAdd = `<div style="display: flex; justify-content: center;">
    <video width="500" height="360" controls>
        <source src="${previewUrl}" type="video/mp4" />
        <source src="${previewUrl}" type="video/quicktime" />
        Your browser does not support the video tag.
    </video>
</div>`;
            }

            setValue(prev => `${prev}\n${contentToAdd}\n`);
        }
    }, [createPreviewUrl]);

    const handleYouTubeEmbed = useCallback(() => {
        const videoId = prompt("Enter YouTube Video ID:");
        if (videoId) {
            const embedCode = `<div style="display: flex; justify-content: center;">
    <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube-nocookie.com/embed/${videoId}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</div>`;
            setValue(prev => `${prev}\n${embedCode}\n`);
            setYtIds(prev => [...prev, videoId]);
        }
    }, []);

    const uploadToS3 = async (file, fileType, index) => {
        const fileExtension = file.name.split('.').pop();
        const key = `${fileType}s/${blogId}_${index}.${fileExtension}`;

        try {
            const upload = new Upload({
                client: s3Client,
                params: {
                    Bucket: import.meta.env.VITE_BUCKET,
                    Key: key,
                    Body: file,
                    ContentType: file.type
                }
            });

            await upload.done();
            return `https://${import.meta.env.VITE_BUCKET}.s3.${import.meta.env.VITE_REGION}.amazonaws.com/${key}`;
        } catch (err) {
            console.error('Error uploading to S3:', err);
            throw err;
        }
    };

    const handlePostBlog = async () => {
        setIsUploading(true);
        let updatedContent = value;

        try {
            let imageUploads = [];
            let videoUploads = [];

            let index = 0;
            for (const [uploadId, upload] of mediaUploads.entries()) {
                if (!upload.uploaded) {
                    const s3Url = await uploadToS3(upload.file, upload.type, index++);
                    updatedContent = updatedContent.replace(upload.previewUrl, s3Url);

                    if (upload.type === 'image') {
                        imageUploads.push(s3Url);
                    } else if (upload.type === 'video') {
                        videoUploads.push(s3Url);
                    }

                    setMediaUploads(prev => {
                        const newMap = new Map(prev);
                        newMap.set(uploadId, { ...upload, uploaded: true, url: s3Url });
                        return newMap;
                    });
                }
            }
            const plaintext = RemoveMarkdown(updatedContent);
            console.log("Printing plaintext");

            console.log(plaintext)
            console.log(userSelectedTags);
            const tagsArray = Array.from(userSelectedTags);
            console.log("tags Array",tagsArray)
            
            const blogPost = {
                blogId,
                email: currentUser.email,
                content: updatedContent,
                plaintext,
                imgIds: imageUploads,
                vidIds: videoUploads,
                ytIds: ytIds,
                tags:tagsArray
            };

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/blog/postblog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(blogPost)
            });

            if (!response.ok) {
                throw new Error('Failed to save blog post');
            }

            setValue("");
            setMediaUploads(new Map());
            setYtIds([]);
            showToast('Blog post published successfully!', 'success');
            navigate('/home')

        } catch (error) {
            showToast('Blog post publish failed!', 'error');
            console.error('Error publishing blog post:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleContextMenu = (e) => {
        const selection = window.getSelection()?.toString();
        if (selection && selection.trim().length > 0) {
            e.preventDefault();
            setMenuPosition({ x: e.pageX, y: e.pageY });
            setMenuVisible(true);
        }
        else setMenuVisible(false);
    }

    useEffect(() => {
        const editor = menuRef.current;
        if (editor) editor.addEventListener("contextmenu", handleContextMenu);
        return () => {
            if (editor) editor.removeEventListener("contextmenu", handleContextMenu);
        }
    }, [])

    useEffect(() => {
        const close = () => {
            setMenuVisible(false);
        }
        document.addEventListener("click", close);
        return () => {
            document.removeEventListener("click", close);
        };
    }, []);

    useEffect(() => {
        if (menuRef.current) {
            const textarea = menuRef.current.querySelector(
                ".w-md-editor-text-input"
            )
            setTextAreaEl(textarea);
        }
    }, [menuRef.current]);

    const generateAlternateContent = async (mode) => {
        if (countRef.current == 5) {
            showToast("You have reached the maximum limit of 5 rewrites per session", 'error')
            return;
        }
        countRef.current += 1;
        if (!textAreaEl) return;

        const start = textAreaEl.selectionStart;
        const end = textAreaEl.selectionEnd;

        if (start === end) {
            showToast('Please select some text', 'info')
            return;
        }

        const selectedText = value.slice(start, end);
        console.log("Selected text: ", selectedText)
        try {
            setRewriting(true)
            const response = await blogAPI.rewriteSection(selectedText, mode)
            console.log(response.result)
            setLastEdit({ oldText: selectedText, newText: response.result, start, end });

            const newValue = value.slice(0, start) + response.result + '\n' + value.slice(end);
            setValue(newValue);
        } catch (error) {
            console.log(error.message)
            showToast("Oops coudn't generate content", 'error')
        }
        finally {
            setRewriting(false)
        }
    }
    const revertLastEdit = () => {
        if (!lastEdit) return;

        const { oldText, start, end, newText } = lastEdit;

        const revertedValue =
            value.slice(0, start) + oldText + value.slice(start + newText.length);
        setValue(revertedValue);

        setLastEdit(null);
    };
    useEffect(() => {
        if (rewriting) {
            showToast('Rewriting your content...', 'info');
        }
    }, [rewriting]);

    const handleTagsChange = (newTags) => {
        setUserSelectedTags(new Set(newTags));
        console.log('Tags updated in parent:', newTags);
    };

    const handleSaveTags = () => {
        const tagsArray = Array.from(userSelectedTags);
        console.log('Saving tags to backend:', tagsArray);
    };


    return (
        <div className="container">
            {isUploading && <GenLoader text='Uploading blog...' />}

            <h1 className="header">Start writing your blog</h1>

            <div style={{ marginBottom: "10px" }}>
                <button className="options" style={{ marginRight: "10px" }}>
                    <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
                        Upload Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        style={{ display: "none" }}
                        onChange={(e) => handleMediaUpload(e, 'image')}
                    />
                </button>

                <button className="options" style={{ marginRight: "10px" }}>
                    <label htmlFor="video-upload" style={{ cursor: "pointer" }}>
                        Upload Video
                    </label>
                    <input
                        type="file"
                        accept="video/*"
                        id="video-upload"
                        style={{ display: "none" }}
                        onChange={(e) => handleMediaUpload(e, 'video')}
                    />
                </button>

                <button
                    className="options"
                    onClick={handleYouTubeEmbed}
                >
                    Embed YouTube Video
                </button>

                {lastEdit && <button onClick={revertLastEdit} className="options" style={{ "backgroundColor": "red", "color": "white" }}>🪄 Revert Your Changes</button>}

            </div>

            <div ref={menuRef}>
                <MDEditor
                    value={value}
                    onChange={(val) => setValue(val || "")}
                    visibleDragbar={true}
                    height={600}
                    preview="edit"
                    commands={commands.getCommands().filter(cmd => cmd.name !== 'image')}
                />
            </div>

            {menuVisible && (
                <div
                    style={{ top: menuPosition.y, left: menuPosition.x }}
                    className="popup-menu-x9 absolute"
                >
                    <h4 style={{ "textAlign": 'center', "color": "blue" }}>Rewrite</h4>
                    <button className="popup-btn-x9" onClick={() => generateAlternateContent("simple")}>Simple</button>
                    <button className="popup-btn-x9" onClick={() => generateAlternateContent("academic")}>Academic</button>
                    <button className="popup-btn-x9" onClick={() => generateAlternateContent("genz lingo")}>Gen Z</button>
                    <button className="popup-btn-x9" onClick={() => generateAlternateContent("formal")}>Formal</button>
                    <button className="popup-btn-x9" onClick={() => generateAlternateContent("standard")}>Standard</button>
                </div>
            )}

            <button
                className="options"
                onClick={handlePostBlog}
                disabled={isUploading}
                style={{ marginTop: "20px" }}
            >
                {isUploading ? 'Publishing...' : 'Post blog'}
            </button>

            <ExpandableTagSelectionScreen onTagsChange={handleTagsChange} initialSelectedTags={userSelectedTags} />

        </div>
    );
}