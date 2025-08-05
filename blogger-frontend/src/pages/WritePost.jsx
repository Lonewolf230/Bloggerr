import { useState, useCallback } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import {useNavigate} from 'react-router-dom'
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from '../../s3config';
import { v4 as uuidv4 } from 'uuid';
import './WritePost.css';
import GenLoader from '../components/GenLoader.jsx'
import {useToast} from '../misc/ToastManager.jsx'
import { useAuth } from "../misc/AuthContext.jsx";

export default function WritePost() {
    const [value, setValue] = useState("");
    const [mediaUploads, setMediaUploads] = useState(new Map());
    const [ytIds, setYtIds] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [blogId]=useState(uuidv4())
    const navigate=useNavigate()
    const {showToast}=useToast()
    const {currentUser}=useAuth()

    const createPreviewUrl = useCallback((file) => {
        return URL.createObjectURL(file);
    }, []);

    const handleMediaUpload = useCallback(async (event, mediaType) => {
        const file = event.target.files[0];
        if (file) {
            const uploadId = uuidv4();
            const previewUrl = createPreviewUrl(file);
            
            // Add to uploads map
            setMediaUploads(prev => new Map(prev).set(uploadId, {
                file,
                previewUrl,
                type: mediaType,
                uploaded: false
            }));

            // Insert appropriate markdown/HTML based on media type
            let contentToAdd = '';
            if (mediaType === 'image') {
                contentToAdd = `<div style="display: flex; justify-content: center; width: 100%;">
                <img src="${previewUrl}" alt="${file.name}" style="max-width: 600px; height: auto;" />
            </div>`
            } else if (mediaType === 'video') {
                contentToAdd = `
<div style="display: flex; justify-content: center;">
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
            const embedCode = `
<div style="display: flex; justify-content: center;">
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

    const uploadToS3 = async (file, fileType,index) => {
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
            
            // Upload all files and replace URLs
            let index = 0;
            for (const [uploadId, upload] of mediaUploads.entries()) {
                if (!upload.uploaded) {
                    const s3Url = await uploadToS3(upload.file, upload.type, index++);
                    updatedContent = updatedContent.replace(upload.previewUrl, s3Url);
                    
                    // Store the URL in the appropriate array
                    if (upload.type === 'image') {
                        imageUploads.push(s3Url);
                    } else if (upload.type === 'video') {
                        videoUploads.push(s3Url);
                    }
                    
                    // Mark as uploaded
                    setMediaUploads(prev => {
                        const newMap = new Map(prev);
                        newMap.set(uploadId, { ...upload, uploaded: true, url: s3Url });
                        return newMap;
                    });
                }
            }

            // Prepare blog post data
            const blogPost = {
                blogId,
                email: currentUser.email,
                content: updatedContent,
                imgIds: imageUploads,
                vidIds: videoUploads,
                ytIds: ytIds
            };

            // Send to your backend
            const response = await fetch('http://localhost:5000/api/blog/postblog', {
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

            // Clear form
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
    
    return(
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
            </div>

            <MDEditor
                value={value}
                onChange={setValue}
                visibleDragbar={true}
                height={600}
                preview="edit"
                commands={commands.getCommands().filter(cmd => cmd.name !== 'image')}
            />
            
            <button 
                className="options" 
                onClick={handlePostBlog}
                disabled={isUploading}
                style={{ marginTop: "20px" }}
            >
                {isUploading ? 'Publishing...' : 'Post blog'}
            </button>
        </div>
    );
}