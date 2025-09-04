import './Home.css'
import Post from '../components/Post.jsx';
import { useAuth } from '../misc/AuthContext.jsx';
import { useEffect, useState, useCallback, useRef } from 'react';
import { blogAPI } from '../api/blogAPI.js';
import { InfinitySpin } from 'react-loader-spinner'

function EnhancedSidebar() {

    const writingTips = [
        { icon: "✍️", text: "Start with a compelling hook to grab readers' attention" },
        { icon: "📝", text: "Use subheadings to break up long content" },
        { icon: "🎯", text: "Focus on one main idea per paragraph" },
        { icon: "🔍", text: "Always proofread before publishing" }
    ];

    const tips = [
        { icon: "🪄", text: "Select a section and right click to utilise AI to rewrite your blog" },
        { icon: "✨", text: "Choose tags that best define your interests to personalise your feed better" },
        { icon: "🔐", text: "Keep your credentials safe" },
    ];
    
    const homeStatsRaw = sessionStorage.getItem('homeStats');
    const homeStats = homeStatsRaw ? JSON.parse(homeStatsRaw) : null;

    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <h3 className="sidebar-title">💡 General Tips</h3>
                <div className="tips-list">
                    {tips.map((tip, index) => (
                        <div key={index} className="tip-item">
                            <span className="tip-icon">{tip.icon}</span>
                            <p className="tip-text">{tip.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sidebar-section">
                <h3 className="sidebar-title">💡 Writing Tips</h3>
                <div className="tips-list">
                    {writingTips.map((tip, index) => (
                        <div key={index} className="tip-item">
                            <span className="tip-icon">{tip.icon}</span>
                            <p className="tip-text">{tip.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sidebar-section">
                <h3 className="sidebar-title">📊 Community Stats</h3>
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">{homeStats?.userCount || '0'}</div>
                        <div className="stat-label">Active Users</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{homeStats?.blogCount || '0'}</div>
                        <div className="stat-label">Published Posts</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default function Home() {
    const { currentUser, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [homeBlogs, setHomeBlogs] = useState([]);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const observerRef = useRef();

    // Intersection Observer callback for infinite scroll
    const lastBlogElementRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observerRef.current) observerRef.current.disconnect();
        
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        
        if (node) observerRef.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    useEffect(() => {
        if (currentUser && currentUser.username) {
            localStorage.removeItem('firstTime');
            loadInitialBlogs();
        }
    }, [currentUser, isAuthenticated]);

    useEffect(() => {
        if (page > 0) {
            loadMoreBlogs();
        }
    }, [page]);

    const loadInitialBlogs = async () => {
        setLoading(true);
        setError(null);
        setPage(0);
        setHomeBlogs([]);

        try {
            const shouldFetch = shouldFetchStats();
            const response = await blogAPI.getHomeBlogs({
                page: 0,
                limit: 5,
                toFetchStats: shouldFetch
            });
            console.log("Response: ", response );
            if (response.success) {
                setHomeBlogs(response.result.blogs || []);
                setHasMore(response.result.hasMore || false);

                if (shouldFetch) {
                    const stats = {
                        blogCount: response.result.blogCount || 0,
                        userCount: response.result.userCount || 0
                    };
                    cacheStats(stats);
                    setFetchStatsTTL();
                }
            } else {
                throw new Error(response.message || 'Failed to load blogs');
            }
        } catch (error) {
            console.error("Error fetching initial blogs:", error);
            setError("Failed to load blogs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const loadMoreBlogs = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        try {
            const response = await blogAPI.getHomeBlogs({
                page,
                limit: 5,
                toFetchStats: false
            });

            if (response.success) {
                const newBlogs = response.result.blogs || [];
                
                const uniqueNewBlogs = newBlogs.filter(newBlog => 
                    !homeBlogs.some(existingBlog => existingBlog.blogId === newBlog.blogId)
                );

                setHomeBlogs(prev => [...prev, ...uniqueNewBlogs]);
                setHasMore(newBlogs.length === 5);
            }
        } catch (error) {
            console.error("Error loading more blogs:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <InfinitySpin 
                        width="200"
                        color="#0077cc"
                    />
                </div>
            );
        }

        if (error) {
            return (
                <div className="empty-state">
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button onClick={loadInitialBlogs} className="retry-btn">
                        Try Again
                    </button>
                </div>
            );
        }

        if (!homeBlogs || homeBlogs.length === 0) {
            return (
                <div className="empty-state">
                    <h3>No posts yet</h3>
                    <p>Be the first to share your thoughts with the community!</p>
                </div>
            );
        }

        return (
            <div className="main-post-scroll">
                {homeBlogs.map((blog, index) => (
                    <div
                        key={blog.blogId || index}
                        ref={index === homeBlogs.length - 1 ? lastBlogElementRef : null}
                    >
                        <Post blog={blog} />
                    </div>
                ))}
                
                {loadingMore && (
                    <div className="loading-more">
                        <InfinitySpin 
                            width="100"
                            color="#0077cc"
                        />
                        <p>Loading more posts...</p>
                    </div>
                )}
                
                {!hasMore && homeBlogs.length > 0 && (
                    <div className="end-message">
                        <p>You've reached the end! 🎉</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <main id='home-main'>
            <section className='main-posts'>
                <div className="posts-container">
                    {renderContent()}
                </div>
                <EnhancedSidebar />
            </section>
        </main>
    );
}

function shouldFetchStats() {
    const item = sessionStorage.getItem('toFetchStats');
    if (!item) return true; 

    try {
        const { expiresAt } = JSON.parse(item);
        return Date.now() > expiresAt; 
    } catch {
        return true; 
    }
}

function setFetchStatsTTL(hours = 3) {
    const ttl = hours * 60 * 60 * 1000; 
    const expiresAt = Date.now() + ttl;
    sessionStorage.setItem('toFetchStats', JSON.stringify({ expiresAt }));
}

function cacheStats(stats) {
    sessionStorage.setItem('homeStats', JSON.stringify(stats));
}
