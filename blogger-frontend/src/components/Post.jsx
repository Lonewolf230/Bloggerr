import './Post.css'
import { MdOutlineReport } from "react-icons/md";
import { LuBookmark } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

import { useState, useRef, useEffect } from 'react';
export default function Post({blog}){
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const formatDate = () => {
        const dateString = blog.createdAt?.S || blog.createdAt;
        if (!dateString) return "Unknown date";
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getTitle = () => {
        const content = blog.content?.S || blog.content;
        if (!content) return "Untitled Blog";
        
        const titleMatch = content.match(/# (.*?)(\n|$)/);
        if (titleMatch) return titleMatch[1];
        
        return getBlogId(blog) || "Untitled Blog";
    };

    function getBlogId(blog) {
        return blog.blogId?.S || (typeof blog.blogId === 'string' ? blog.blogId : JSON.stringify(blog.blogId));
    }

    const handleToggleDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    const handleReportAuthor = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDropdown(false);
        // Add your report logic here
        console.log(`Reporting ${blog.author}`);
    };

    function extractTextContent(mixedContent) {
        let withoutHtml = mixedContent.replace(/<[^>]*>/g, '');
        withoutHtml = withoutHtml.replace(/!\[.*?\]\(.*?\)/g, '');
        withoutHtml = withoutHtml.replace(/\[.*?\]\(.*?\)/g, '$1');
        withoutHtml = withoutHtml.replace(/https?:\/\/\S+/g, '');
        withoutHtml = withoutHtml.replace(/^#+\s+(.*?)$/gm, '$1');
        withoutHtml = withoutHtml.replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1');
        withoutHtml = withoutHtml.replace(/```[\s\S]*?```/g, '');
        withoutHtml = withoutHtml.replace(/`(.*?)`/g, '$1');
        withoutHtml = withoutHtml.replace(/\s+/g, ' ').trim();
        
        return withoutHtml;
      }

    const showThumbnail=()=>{
        let imgUrl=blog.imgIds[0]
        return imgUrl
    }

    return(
        <>
            <Link to={`/blog/${blog.blogId}`} style={{"textDecoration":"none"}}>
                <main id='post' >
                    <span style={{"display":"flex","gap":"20px"}}>
                        <img src={`https://bloggers3bucket.s3.ap-south-1.amazonaws.com/profilePics/${blog.author}.jpg`} alt="" style={{ width: 50, height: 50, borderRadius: '50%' }} />
                        <p>{blog.author}</p>
                        <div className="author-options-container" style={{ position: 'relative', marginLeft: 'auto' }} ref={dropdownRef}>
                                <div 
                                    className="dropdown-toggle" 
                                    style={{ cursor: 'pointer', padding: '5px' }} 
                                    onClick={handleToggleDropdown}
                                >
                                    <BsThreeDotsVertical />
                                </div>
                                {showDropdown && (
                                    <div className="dropdown-menu" style={{ 
                                        position: 'absolute', 
                                        right: 0, 
                                        backgroundColor: 'white', 
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)', 
                                        borderRadius: '4px', 
                                        padding: '8px 0', 
                                        minWidth: '150px',
                                        zIndex: 10 
                                    }}>
                                        <Link 
                                            to={`/otherProfile/${blog.author}`} 
                                            style={{ 
                                                display: 'block', 
                                                padding: '8px 15px', 
                                                textDecoration: 'none', 
                                                color: '#333'
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <CgProfile style={{ marginRight: '8px' }}/> See Profile
                                        </Link>
                                        <div 
                                            className="dropdown-item" 
                                            style={{ 
                                                display: 'block', 
                                                padding: '8px 15px', 
                                                cursor: 'pointer', 
                                                color: '#dd3333'
                                            }} 
                                            onClick={handleReportAuthor}
                                        >
                                            <MdOutlineReport style={{ marginRight: '8px' }}/> Report Author
                                        </div>
                                    </div>
                                )}
                            </div>

                    </span>
                    <section className='post-main'>
                        <div className='post-left'>
                            <h2>{getTitle()}</h2>
                            <p>{extractTextContent(blog.content)}</p>
                            <div className='post-foot-left'>
                                <p>Posted On: {formatDate()}</p>
                            </div>
                        </div>
                        <div className='post-right'>
                            <img src={showThumbnail()||'https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg'} alt="" height={150} width={200} />
                            <div className='post-foot-right'>
                                <p><MdOutlineReport/></p>
                                <p><LuBookmark/></p>
                            </div>
                        </div>
                    </section>
                    <hr />
                </main>
            </Link>
        </>
    )
}