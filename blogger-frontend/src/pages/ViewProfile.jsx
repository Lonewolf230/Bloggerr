    import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
    import './EditProfile.css';
    import { RiAccountCircleFill } from 'react-icons/ri';
    import Bio from '../components/Bio.jsx';
    import { useEffect, useState, useCallback } from 'react';
    import { Bars } from 'react-loader-spinner';
    import { blogAPI } from '../api/blogAPI.js';
    import { userAPI } from '../api/userAPI.js';
    import { useAuth } from '../misc/AuthContext.jsx';
    import { followAPI } from '../api/axios.js';
    import { useSnackbar } from '../misc/SnackBarManager.jsx';
    
    export default function ViewProfile() {
        const { currentUser } = useAuth();
        const navigate = useNavigate();
        const [loading, setLoading] = useState({
            logout: false,
            delete: false,
            data: true,
            followAction: false
        });
        const [userData, setUserData] = useState(null);
        const [userBlogs, setUserBlogs] = useState([]);
        const [userStats, setUserStats] = useState({
            followers: 0,
            following: 0,
            blogPosts: 0,
            mostLikes: 0
        });
        const [refreshTrigger, setRefreshTrigger] = useState(0);
        const { username } = useParams();
        const { showSnackbar } = useSnackbar();
        console.log("Viewing profile:", username);
        
        // Memoize the fetchUserData function to prevent unnecessary re-renders
        const fetchUserData = useCallback(async () => {
            if (!username) return;
            
            setLoading(prev => ({ ...prev, data: true }));
            try {
                // Fetch blogs
                const blogResponse = await blogAPI.getBlogs(username);
                if (blogResponse && blogResponse.result && blogResponse.result.blogs) {
                    setUserBlogs(blogResponse.result.blogs);
                    
                    // Update the number of blogs in stats
                    setUserStats(prev => ({
                        ...prev,
                        blogPosts: blogResponse.result.blogs.length || 0
                    }));
                }
                
                // Fetch user profile data
                try {
                    const userResponse = await userAPI.getOtherProfile(username);
                    console.log("User profile data:", userResponse);
                    setUserData(userResponse);
                    
                    if (userResponse && userResponse.user) {
                        setUserStats(prev => ({
                            ...prev,
                            followers: userResponse.user.followers?.length || 0,
                            following: userResponse.user.following?.length || 0,
                        }));
                    }
                } catch (err) {
                    console.warn("Could not fetch user profile:", err);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            } finally {
                setLoading(prev => ({ ...prev, data: false }));
            }
        }, [username]);
    
        const toggleFollow = async () => {
            if (!userData?.user || !currentUser?.username) return;
            
            try {
                setLoading(prev => ({ ...prev, followAction: true }));
                
                // For safety, ensure followers array exists
                const followers = userData.user.followers || [];
                // Check if the current user is following the profile user
                const isCurrentlyFollowing = followers.includes(currentUser.username);
                
                let response;
                if (isCurrentlyFollowing) {
                    console.log(`Attempting to unfollow ${userData.user.username}`);
                    response = await followAPI.unfollowUser(userData.user.username);
                } else {
                    console.log(`Attempting to follow ${userData.user.username}`);
                    response = await followAPI.followUser(userData.user.username);
                }
    
                console.log("Follow API Response:", response);
    
                if (response.result.success) {
                    console.log("Follow/unfollow successful, refreshing data");
                    // Trigger a refresh by incrementing the refresh counter
                    setRefreshTrigger(prev => prev + 1);
                    const userName=userData.user.username
                    showSnackbar({
                        message: `${userData.user.username} ${isCurrentlyFollowing?'unfollowed':'followed'} successfully`,
                        type: 'success',
                        duration: 3000
                      });
                } else {
                    console.error("Follow/unfollow API returned failure", response);
                    alert("Failed to update follow status. Please try again.");
                }
            } catch (error) {
                console.error("Error toggling follow status:", error);
                alert("An error occurred. Please try again.");
            } finally {
                setLoading(prev => ({ ...prev, followAction: false }));
            }
        };
    
        // Initial data fetch and refresh when needed
        useEffect(() => {
            console.log("Fetching data for:", username);
            fetchUserData();
        }, [username, refreshTrigger, fetchUserData]); // Added refreshTrigger as dependency
    
        return (
            <>
                <main>
                    <div className='edit-main'>
                        <div className='edit-profile'>
                            {loading.data ? (
                                <div className="loading-container">
                                    <Bars
                                        height="50"
                                        width="50"
                                        color="#0077cc"
                                        ariaLabel="loading-indicator"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                        visible={true}
                                    />
                                    <p>Loading user data...</p>
                                </div>
                            ) : (
                                <>
                                    <div className='user-profile-pic-data'>
                                        {userData?.user ? (
                                            <img 
                                                src={userData.user.profilePic} 
                                                alt="Profile" 
                                                className="user-profile-pic" 
                                                style={{ width: 50, height: 50, borderRadius: '50%' }}
                                            />
                                        ) : (
                                            <RiAccountCircleFill size={50} />
                                        )}
                                        <div className='username-date'>
                                            <strong>{username}</strong>
                                            <br />
                                            <p>from {userData?.user?.createdAt ? new Date(userData.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'April 2024'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className='edit-stats'>
                                        <NavLink style={{ "textDecoration": "none", 'color': "black" }} to={`followers/${username}`}>
                                            <div className='edit-stat'>
                                                <strong>{userStats.followers}</strong>
                                                <br />
                                                <strong>Followers</strong>
                                            </div>
                                        </NavLink>
                                        
                                        <NavLink style={{ "textDecoration": "none", 'color': "black" }} to={`following/${username}`}>
                                            <div className='edit-stat'>
                                                <strong>{userStats.following}</strong>
                                                <br />
                                                <strong>Following</strong>
                                            </div>   
                                        </NavLink>
    
                                        <NavLink style={{ "textDecoration": "none", 'color': "black" }} to={`posts/${username}`}>
                                            <div className='edit-stat'>
                                                <strong>{userStats.blogPosts}</strong>
                                                <br />
                                                <strong>Blog Posts</strong>
                                            </div>   
                                        </NavLink>
                                    </div>
                                    
                                    <Bio 
                                        aboutText={userData?.user?.about || "No bio available yet"} 
                                    />
    
                                    <div className='auth-buttons'>
                                        {userData?.user && currentUser?.username && currentUser.username !== userData.user.username && (
                                            <button 
                                                onClick={toggleFollow}
                                                disabled={loading.followAction}
                                            >
                                                {loading.followAction ? 'Processing...' : 
                                                 (userData.user.followers || []).includes(currentUser.username) ? "Unfollow" : "Follow"}
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
    
                        <div className='edit-charts'>
                            <Outlet />
                        </div>
                    </div>
                </main>
            </> 
        );
    }