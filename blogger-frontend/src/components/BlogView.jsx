import { Link, useParams, useOutletContext } from "react-router-dom";
import './BlogView.css';
import { useAuth } from "../misc/AuthContext";
import { useEffect, useState } from "react";
import { blogAPI } from "../api/blogAPI";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { InfinitySpin } from "react-loader-spinner";
import ConfirmBox from "./ConfirmBox";

function BlogList({other=false}) {
    const { currentUser } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const updateParentStats = useOutletContext();
    let { username } = useParams();
    
    if (username === "" || username === undefined) {
        username = currentUser.username;
    }

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            console.log("Current User: ", currentUser);
            const blogResponse = await blogAPI.getBlogs(username);
            const fetchedblogs = blogResponse.result.blogs;
            setBlogs(fetchedblogs);

            if (updateParentStats) {
                updateParentStats(fetchedblogs.length);
            }
            console.log("Fetched blogs:", blogResponse.result.blogs);
        } catch (err) {
            console.error("Error fetching blogs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [username, currentUser]);

    const handleDelete = (blogId, e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedBlog(blogId);
        setConfirm(true);
    };

    const confirmBlogDelete = async () => {
        try {
            await blogAPI.deleteBlog(selectedBlog);
            fetchBlogs();
            setConfirm(false);
        } catch (err) {
            console.error("Error deleting blog:", err);
            setConfirm(false);
        }
    };

    if (loading) {
        return (
            <div className="blog-loading-state">
                <InfinitySpin color="#0077cc" />
            </div>
        );
    }

    if (!blogs || blogs.length === 0) {
        return (
            <div className="blog-list-container">
                <h2 className="blog-list-title">{other?`${username}'s`:'My'} Recent Blogs</h2>
                <div className="blog-empty-state">
                    {other?`No blogs written by ${username}`:`No blogs found. Start writing some`}
                </div>
            </div>
        );
    }

    return (
        <div className="blog-list-container">
            <h2 className="blog-list-title">{other?`${username}'s`:'My'} Recent Blogs ({blogs.length})</h2>
            <div className="blog-list-scroll">
                {blogs.map((blog, index) => (
                    <Link 
                        key={getBlogId(blog) || index} 
                        to={`/blog/${getBlogId(blog)}`} 
                        className="blog-link"
                        style={{ 
                            animationDelay: `${index * 0.1}s` 
                        }}
                    >
                        <BlogTile 
                            blog={blog} 
                            other={other}
                            onDelete={(e) => handleDelete(getBlogId(blog), e)}
                        />
                    </Link>
                ))}
            </div>

            {confirm && (
                <ConfirmBox 
                    text="delete this blog?"
                    confirmFunction={confirmBlogDelete} 
                    cancelFunction={() => setConfirm(false)} 
                />
            )}
        </div>
    );
}

// Helper function to extract blog ID consistently
function getBlogId(blog) {
    return blog.blogId?.S || (typeof blog.blogId === 'string' ? blog.blogId : JSON.stringify(blog.blogId));
}

function BlogTile({ blog, onDelete,other=false }) {
    const getTitle = () => {
        const content = blog.content?.S || blog.content;
        if (!content) return "Untitled Blog";
        
        const titleMatch = content.match(/# (.*?)(\n|$)/);
        if (titleMatch) return titleMatch[1];
        
        return getBlogId(blog) || "Untitled Blog";
    };
        
    const formatDate = () => {
        const dateString = blog.createdAt?.S || blog.createdAt;
        if (!dateString) return "Unknown date";
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch (e) {
            return dateString;
        }
    };

    const getPreview = () => {
        const content = blog.content?.S || blog.content;
        if (!content) return "";
        
        // Remove markdown headers and get first few words
        const cleanContent = content.replace(/^#.*$/gm, '').trim();
        const words = cleanContent.split(' ').slice(0, 15).join(' ');
        return words.length > 0 ? words + (cleanContent.split(' ').length > 15 ? '...' : '') : '';
    };

    return (
        <div className="blog-tile">
            <div className="blog-tile-content">
                <div className="blog-tile-main">
                    <h5 className="blog-tile-title">{getTitle()}</h5>
                    <p className="blog-tile-date">Posted on {formatDate()}</p>
                </div>
                 {!other && <div className="blog-tile-actions">
                    <div 
                        className="blog-delete-btn" 
                        onClick={onDelete}
                        title="Delete blog"
                    >
                        <MdOutlineDeleteOutline className="blog-delete-icon" />
                    </div>
                </div>}
            </div>
        </div>
    );
}

export { BlogList, BlogTile };