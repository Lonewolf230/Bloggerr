// import './Home.css'
// import Post from '../components/Post.jsx';
// import AuthProfSumm from '../components/AuthorProfSumm.jsx';
// import { useAuth } from '../misc/AuthContext.jsx';
// import { useEffect,useState } from 'react';
// import { blogAPI } from '../api/blogAPI.js';
// import {InfinitySpin} from 'react-loader-spinner'

// export default function Home(){
//     const {currentUser,isAuthenticated}=useAuth()
//     const [loading,setLoading]=useState(false)
//     const [homeBlogs,setHomeBlogs]=useState([])

//     useEffect(()=>{
//         console.log(currentUser,isAuthenticated)
//         const fetchHomeBlogs=async()=>{
//             setLoading(true)
//             try {
//                 const response=await blogAPI.getHomeBlogs()
//                 console.log(response)
//                 setHomeBlogs(response.result.blogs)
//             } catch (error) {
//                 console.error("Error fetching home blogs:", error)
//             }
//             finally{
//                 setLoading(false)
//             }
//         }
//         if(currentUser && currentUser.username){
//             fetchHomeBlogs()
//         }
//     },[])


//     return(
//         <>
            
//             <main id='home-main'>
//                 <section className='main-posts'>
//                     <div>
//                         {loading && <div style={{display:"flex",justifyContent:"center",
//                             alignItems:"center",
//                             height:"100vh"}}>
//                                 <InfinitySpin color='blue'/>
//                             </div>}
//                         {homeBlogs.map((blog)=><Post key={blog.blogId} blog={blog}/>)}
//                     </div>
//                     <div>
//                         <AuthProfSumm/>
//                     </div>
//                 </section>
//             </main>
//         </>
//     )
// }

import './Home.css'
import Post from '../components/Post.jsx';
import { useAuth } from '../misc/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { blogAPI } from '../api/blogAPI.js';
import { InfinitySpin } from 'react-loader-spinner'

function EnhancedSidebar() {
    const trendingTopics = [
        "Web Development",
        "Artificial Intelligence",
        "React Best Practices",
        "JavaScript Tips",
        "UI/UX Design",
        "DevOps Tools",
        "Machine Learning",
        "Mobile Development"
    ];

    const recommendedAuthors = [
        { name: "Sarah Chen", posts: 24, avatar: "sarah" },
        { name: "Mike Johnson", posts: 18, avatar: "mike" },
        { name: "Elena Rodriguez", posts: 31, avatar: "elena" },
        { name: "David Kim", posts: 15, avatar: "david" }
    ];

    const writingTips = [
        { icon: "✍️", text: "Start with a compelling hook to grab readers' attention" },
        { icon: "📝", text: "Use subheadings to break up long content" },
        { icon: "🎯", text: "Focus on one main idea per paragraph" },
        { icon: "🔍", text: "Always proofread before publishing" }
    ];

    return (
        <aside className="sidebar">
            {/* Trending Topics */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">🔥 Trending Topics</h3>
                <ul className="trending-list">
                    {trendingTopics.slice(0, 6).map((topic, index) => (
                        <li key={index} className="trending-item">
                            <span className="trending-number">{index + 1}</span>
                            <span className="trending-topic">{topic}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recommended Authors */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">👥 Suggested Authors</h3>
                <div className="author-list">
                    {recommendedAuthors.map((author, index) => (
                        <div key={index} className="author-item">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${author.name}&background=0077cc&color=fff&size=36`}
                                alt={`${author.name}'s avatar`}
                                className="author-avatar"
                            />
                            <div className="author-info">
                                <h4 className="author-name">{author.name}</h4>
                                <p className="author-posts">{author.posts} posts</p>
                            </div>
                            <button className="follow-btn">Follow</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Writing Tips */}
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

            {/* Quick Stats */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">📊 Community Stats</h3>
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">2.5K</div>
                        <div className="stat-label">Active Users</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">15K</div>
                        <div className="stat-label">Published Posts</div>
                    </div>
                    {/* <div className="stat-item">
                        <div className="stat-number">50K</div>
                        <div className="stat-label">Monthly Readers</div>
                    </div> */}
                </div>
            </div>
        </aside>
    );
}

export default function Home() {
    const { currentUser, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [homeBlogs, setHomeBlogs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(currentUser, isAuthenticated);
        localStorage.removeItem('firstTime')
        const fetchHomeBlogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await blogAPI.getHomeBlogs();
                console.log(response);
                setHomeBlogs(response.result.blogs || []);
            } catch (error) {
                console.error("Error fetching home blogs:", error);
                setError("Failed to load blogs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && currentUser.username) {
            fetchHomeBlogs();
        }
    }, [currentUser, isAuthenticated]);

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
                    <Post 
                        key={blog.blogId || index} 
                        blog={blog}
                    />
                ))}
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