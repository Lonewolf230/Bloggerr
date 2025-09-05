// import './Post.css'
// import { MdOutlineReport } from "react-icons/md";
// import { LuBookmark } from "react-icons/lu";
// import { Link } from 'react-router-dom';
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { CgProfile } from "react-icons/cg";

// import { useState, useRef, useEffect } from 'react';
// export default function Post({blog}){
//     const [showDropdown, setShowDropdown] = useState(false);
//     const dropdownRef = useRef(null);
//     const formatDate = () => {
//         const dateString = blog.createdAt?.S || blog.createdAt;
//         if (!dateString) return "Unknown date";
        
//         try {
//             const date = new Date(dateString);
//             return date.toLocaleDateString();
//         } catch (e) {
//             return dateString;
//         }
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowDropdown(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const getTitle = () => {
//         const content = blog.content?.S || blog.content;
//         if (!content) return "Untitled Blog";
        
//         const titleMatch = content.match(/# (.*?)(\n|$)/);
//         if (titleMatch) return titleMatch[1];
        
//         return getBlogId(blog) || "Untitled Blog";
//     };

//     function getBlogId(blog) {
//         return blog.blogId?.S || (typeof blog.blogId === 'string' ? blog.blogId : JSON.stringify(blog.blogId));
//     }

//     const handleToggleDropdown = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setShowDropdown(!showDropdown);
//     };

//     const handleReportAuthor = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setShowDropdown(false);
//         // Add your report logic here
//         console.log(`Reporting ${blog.author}`);
//     };

//     function extractTextContent(mixedContent) {
//         let withoutHtml = mixedContent.replace(/<[^>]*>/g, '');
//         withoutHtml = withoutHtml.replace(/!\[.*?\]\(.*?\)/g, '');
//         withoutHtml = withoutHtml.replace(/\[.*?\]\(.*?\)/g, '$1');
//         withoutHtml = withoutHtml.replace(/https?:\/\/\S+/g, '');
//         withoutHtml = withoutHtml.replace(/^#+\s+(.*?)$/gm, '$1');
//         withoutHtml = withoutHtml.replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1');
//         withoutHtml = withoutHtml.replace(/```[\s\S]*?```/g, '');
//         withoutHtml = withoutHtml.replace(/`(.*?)`/g, '$1');
//         withoutHtml = withoutHtml.replace(/\s+/g, ' ').trim();
        
//         return withoutHtml;
//       }

//     const showThumbnail=()=>{
//         let imgUrl=blog.imgIds[0]
//         return imgUrl
//     }

//     return(
//         <>
//             <Link to={`/blog/${blog.blogId}`} style={{"textDecoration":"none"}}>
//                 <main id='post' >
//                     <span style={{"display":"flex","gap":"20px"}}>
//                         <img src={`https://bloggers3bucket.s3.ap-south-1.amazonaws.com/profilePics/${blog.author}.jpg`} alt="" style={{ width: 50, height: 50, borderRadius: '50%' }} />
//                         <p>{blog.author}</p>
//                         <div className="author-options-container" style={{ position: 'relative', marginLeft: 'auto' }} ref={dropdownRef}>
//                                 <div 
//                                     className="dropdown-toggle" 
//                                     style={{ cursor: 'pointer', padding: '5px' }} 
//                                     onClick={handleToggleDropdown}
//                                 >
//                                     <BsThreeDotsVertical />
//                                 </div>
//                                 {showDropdown && (
//                                     <div className="dropdown-menu" style={{ 
//                                         position: 'absolute', 
//                                         right: 0, 
//                                         backgroundColor: 'white', 
//                                         boxShadow: '0 2px 5px rgba(0,0,0,0.2)', 
//                                         borderRadius: '4px', 
//                                         padding: '8px 0', 
//                                         minWidth: '150px',
//                                         zIndex: 10 
//                                     }}>
//                                         <Link 
//                                             to={`/otherProfile/${blog.author}`} 
//                                             style={{ 
//                                                 display: 'block', 
//                                                 padding: '8px 15px', 
//                                                 textDecoration: 'none', 
//                                                 color: '#333'
//                                             }}
//                                             onClick={(e) => e.stopPropagation()}
//                                         >
//                                             <CgProfile style={{ marginRight: '8px' }}/> See Profile
//                                         </Link>
//                                         <div 
//                                             className="dropdown-item" 
//                                             style={{ 
//                                                 display: 'block', 
//                                                 padding: '8px 15px', 
//                                                 cursor: 'pointer', 
//                                                 color: '#dd3333'
//                                             }} 
//                                             onClick={handleReportAuthor}
//                                         >
//                                             <MdOutlineReport style={{ marginRight: '8px' }}/> Report Author
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                     </span>
//                     <section className='post-main'>
//                         <div className='post-left'>
//                             <h2>{getTitle()}</h2>
//                             <p>{extractTextContent(blog.content)}</p>
//                             <div className='post-foot-left'>
//                                 <p>Posted On: {formatDate()}</p>
//                             </div>
//                         </div>
//                         <div className='post-right'>
//                             <img src={showThumbnail()||'https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg'} alt="" height={150} width={200} />
//                             <div className='post-foot-right'>
//                                 <p><MdOutlineReport/></p>
//                                 <p><LuBookmark/></p>
//                             </div>
//                         </div>
//                     </section>
//                     <hr />
//                 </main>
//             </Link>
//         </>
//     )
// }

import './Post.css'
import { MdOutlineReport } from "react-icons/md";
import { Link } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { BiTime } from "react-icons/bi";
import { useState, useRef, useEffect } from 'react';

export default function Post({ blog }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const dropdownRef = useRef(null);

    const formatDate = () => {
        const dateString = blog.createdAt?.S || blog.createdAt;
        if (!dateString) return "Unknown date";
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) return "Yesterday";
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
            if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
            
            return date.toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };

    const calculateReadingTime = (content) => {
        if (!content) return 1;
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return Math.max(1, minutes);
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
        console.log(`Reporting ${blog.author}`);
    };

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsBookmarked(!isBookmarked);
    };

    function extractTextContent(mixedContent) {
        if (!mixedContent) return "No content available...";
        
        let withoutHtml = mixedContent.replace(/<[^>]*>/g, '');
        withoutHtml = withoutHtml.replace(/!\[.*?\]\(.*?\)/g, '');
        withoutHtml = withoutHtml.replace(/\[.*?\]\(.*?\)/g, '$1');
        withoutHtml = withoutHtml.replace(/https?:\/\/\S+/g, '');
        withoutHtml = withoutHtml.replace(/^#+\s+(.*?)$/gm, '$1');
        withoutHtml = withoutHtml.replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1');
        withoutHtml = withoutHtml.replace(/```[\s\S]*?```/g, '');
        withoutHtml = withoutHtml.replace(/`(.*?)`/g, '$1');
        withoutHtml = withoutHtml.replace(/\s+/g, ' ').trim();
        
        return withoutHtml || "No preview available...";
    }

    const showThumbnail = () => {
        const imgUrl = blog.imgIds && blog.imgIds[0];
        return imgUrl || 'https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg';
    }

    const content = blog.content?.S || blog.content;
    const readingTime = calculateReadingTime(content);

    return (
        <Link to={`/blog/${getBlogId(blog)}`} style={{ textDecoration: "none" }} state={blog}>
            <article id='post'>
                <header className="post-author-section">
                    <img 
                        src={`https://bloggers3bucket.s3.ap-south-1.amazonaws.com/profilePics/${blog.author}.jpg`} 
                        alt={`${blog.author}'s profile`}
                        className="post-author-avatar"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${blog.author}&background=0077cc&color=fff&size=48`;
                        }}
                    />
                    <p className="post-author-name">{blog.author}</p>
                    
                    <div className="author-options-container" ref={dropdownRef}>
                        <div 
                            className="dropdown-toggle" 
                            onClick={handleToggleDropdown}
                            role="button"
                            aria-label="More options"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleToggleDropdown(e);
                                }
                            }}
                        >
                            <BsThreeDotsVertical />
                        </div>
                        
                        {showDropdown && (
                            <div className="dropdown-menu" role="menu">
                                <Link 
                                    to={`/otherProfile/${blog.author}`} 
                                    onClick={(e) => e.stopPropagation()}
                                    role="menuitem"
                                >
                                    <CgProfile style={{ marginRight: '8px' }} /> 
                                    View Profile
                                </Link>
                                <div 
                                    className="dropdown-item report" 
                                    onClick={handleReportAuthor}
                                    role="menuitem"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleReportAuthor(e);
                                        }
                                    }}
                                >
                                    <MdOutlineReport style={{ marginRight: '8px' }} /> 
                                    Report Author
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <section className='post-main'>
                    <div className='post-left'>
                        <h2>{getTitle()}</h2>
                        <p>{extractTextContent(content)}</p>
                        
                        <footer className='post-foot-left'>
                            <p>{formatDate()}</p>
                            <span style={{ color: '#e2e8f0', margin: '0 8px' }}>•</span>
                            <p className="reading-time">
                                <BiTime style={{ marginRight: '4px', fontSize: '0.9rem' }} />
                                {readingTime} min read
                            </p>
                        </footer>
                    </div>
                    
                    <div className='post-right'>
                        <img 
                            src={showThumbnail()} 
                            alt="Blog thumbnail" 
                            className="post-thumbnail"
                            loading="lazy"
                        />
                        
                    </div>
                </section>
            </article>
        </Link>
    );
}