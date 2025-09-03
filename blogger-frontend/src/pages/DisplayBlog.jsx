import { Link, useParams } from "react-router-dom";
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
import { InfinitySpin, Oval } from "react-loader-spinner";
import PaywallGradientOverlay from "../components/Paywall.jsx";
import GenLoader from "../components/GenLoader.jsx";
import { LoaderCircleIcon } from "lucide-react";

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
    const [loadingSimilar, setLoadingSimilar] = useState(false);
    const [recommendedBlogs, setRecommendedBlogs] = useState([])

    const similarBlogs = [
        {
            id: 1,
            title: "Understanding React Hooks: A Complete Guide",
            author: "john_developer",
            excerpt: "Dive deep into React Hooks and learn how to use useState, useEffect, and custom hooks to build powerful React applications...",
            readTime: "8 min read",
            likes: 127,
            publishedDate: "2024-03-15"
        },
        {
            id: 2,
            title: "Modern CSS Techniques for Better Web Design",
            author: "sarah_designer",
            excerpt: "Explore the latest CSS features including Grid, Flexbox, and CSS Variables to create stunning responsive layouts...",
            readTime: "6 min read",
            likes: 89,
            publishedDate: "2024-03-12"
        },
        {
            id: 3,
            title: "JavaScript Performance Optimization Tips",
            author: "mike_coder",
            excerpt: "Learn essential techniques to optimize your JavaScript code for better performance and user experience in web applications...",
            readTime: "10 min read",
            likes: 203,
            publishedDate: "2024-03-10"
        }
    ];

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

    useEffect(() => {
        if ((currentUser.username !== blogData.author &&
            !userData.includes(blogData.author))
        ) return;
        if (blogData?.blogId) {
            const fetchSimilar = async () => {
                setLoadingSimilar(true);
                try {
                    console.log(currentUser.username);

                    const response = await blogAPI.recommendSimilar(blogData, currentUser.username);
                    setRecommendedBlogs(response.result);
                    console.log(response.result);

                } catch (err) {
                    console.error("Error fetching similar blogs:", err);
                } finally {
                    setLoadingSimilar(false);
                }
            };
            fetchSimilar();
        }
    }, [blogData, currentUser.username, userData]);



    // Handle different states
    if (loading) {
        return (
            <div className="blog-loading-state">
                <InfinitySpin
                    width="200"
                    color="#0077cc"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="display-blog-container">
                <div className="error">
                    {error}
                </div>
            </div>
        );
    }

    if (!blogData || !blogData.content) {
        return (
            <div className="display-blog-container">
                <div className="error">
                    Blog not found
                </div>
            </div>
        );
    }

    if (currentUser.username !== blogData.author && !userData.includes(blogData.author)) {
        return (
            <div className="display-blog-container">
                <PaywallGradientOverlay username={blogData.author} />
            </div>
        );
    }
    const content = blogData.content?.S || blogData.content;

    return (
        <div className="display-blog-container">
            <div className="markdown-container">
                <Markdown
                    children={content}
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                />
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <CommentThread
                    blogId={blogId}
                    blogStats={blogStats}
                    blog={blogData}
                    updateBlogStats={updateBlogStats}
                />
            </div>

            <div className="similar-blogs-section">
                <h2 className="similar-blogs-title">Similar Blogs</h2>
                {loadingSimilar ? (
                    <div style={{"display":"flex", "flexDirection":"column","alignItems":"center"}}>
                        <Oval color="#0077cc" height={40} width={40} />
                        <p style={{"textAlign":"center"}}>Fetching Similar Blogs</p>
                    </div>
                ) : (
                    <div className="similar-blogs-grid">
                        {recommendedBlogs.map((blog) => (
                            <Link to={`../blog/${blog.blogId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div key={blog.blogId} className="similar-blog-card">
                                    <div className="blog-card-header">
                                        <div className="blog-card-meta">
                                            <span className="blog-card-author">@{blog.author}</span>
                                            <span className="blog-card-date">{blog.createdAt.split("T")[0]}</span>
                                        </div>
                                        <div className="blog-card-stats">
                                            <span className="blog-card-likes">❤️ {blog.likes.length}</span>
                                        </div>
                                    </div>
                                    <h3 className="blog-card-title">
                                        {blog.content?.split("\n")[0].replace(/^#\s*/, "")}
                                    </h3>

                                    <p className="blog-card-excerpt">{blog.plaintext.substring(0, 200)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}