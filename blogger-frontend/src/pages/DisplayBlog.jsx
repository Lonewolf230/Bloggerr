

import { useParams } from "react-router-dom";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import remarkBreaks from "remark-breaks";
import './Display.css';
import CommentThread from "../components/BlogViewComponents.jsx";
import { blogAPI } from "../api/blogAPI.js";
import { useState, useEffect } from "react";
import { useAuth } from "../misc/AuthContext.jsx";
import { userAPI } from "../api/userAPI.js";
import { InfinitySpin } from "react-loader-spinner";
import PaywallGradientOverlay from "../components/Paywall.jsx";

export default function DisplayBlog() {
    const { blogId } = useParams(); 
    const [blogData, setBlogData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState([]);
    const { currentUser } = useAuth();
    const [blogStats, setBlogStats] = useState({
        likes: 0,
        dislikes: 0,
        comments: 0,
        userLiked: false,
        userDisliked: false
    });

    // Centralized state update method
    const updateBlogStats = (updates) => {
        setBlogStats(prevStats => ({
            ...prevStats,
            ...updates
        }));

        // Optionally update blogData to reflect changes
        setBlogData(prevData => ({
            ...prevData,
            ...updates
        }));
    };

    const getUserData = async () => {
        try {
            const userResponse = await userAPI.getProfile();
            setUserData(userResponse.user.following);
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    };
    
    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const data = await blogAPI.getBlog(blogId);
                const blog = data.result.blog;
                
                // Check if current user has liked or disliked the blog
                const userLiked = blog.likes?.includes(currentUser.username) || false;
                const userDisliked = blog.dislikes?.includes(currentUser.username) || false;

                setBlogData(blog);
                
                // Initialize blog stats with like/dislike state
                setBlogStats({
                    likes: blog.likes?.length || 0,
                    dislikes: blog.dislikes?.length || 0,
                    comments: blog.comments?.length || 0,
                    commentList: blog.comments || [],
                    userLiked,
                    userDisliked
                });
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blog:", err);
                setError("Failed to load blog");
                setLoading(false);
            }
        };

        getUserData();
        if (blogId) {
            fetchBlog();
        }
    }, [blogId, currentUser.username]);


        // Handle different states
        if (loading) return (
            <div style={{
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100vh"
            }}>
                <InfinitySpin color="blue"/>
            </div>
        );
    
        if (error) return <div className="error">{error}</div>;
        if (!blogData || !blogData.content) return <div className="error">Blog not found</div>;
    
        // Paywall check
        if (currentUser.username !== blogData.author && !userData.includes(blogData.author)) {
            return <PaywallGradientOverlay username={blogData.author}/>;
        }
    
        // For DynamoDB format support
        const content = blogData.content?.S || blogData.content;
    

    return (
        <>
            <div>
                <div className="markdown-container">
                    <Markdown 
                        children={content}
                        remarkPlugins={[remarkGfm, remarkBreaks]} 
                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                    />
                </div>

                <CommentThread 
                    blogId={blogId} 
                    blogStats={blogStats} 
                    blog={blogData} 
                    updateBlogStats={updateBlogStats}
                />
            </div>
        </>
    );
}