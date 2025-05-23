// import { Outlet, NavLink, useNavigate } from 'react-router-dom'
// import { authAPI } from '../api/axios.js'
// import './EditProfile.css'
// import { RiAccountCircleFill } from 'react-icons/ri'
// import { CiEdit } from "react-icons/ci";
// import Bio from '../components/Bio.jsx'
// import { useEffect, useState } from 'react'
// import { Bars } from 'react-loader-spinner'
// import ConfirmBox from '../components/ConfirmBox.jsx'
// import { useAuth } from '../misc/AuthContext.jsx'
// import { blogAPI } from '../api/blogAPI.js'
// import EditProfileForm from './EditProfileForm.jsx';

// export default function EditProfile(){
//     const navigate = useNavigate()
//     const [confirm,setConfirm]=useState(false)
//     const [loading, setLoading] = useState({
//         logout: false,
//         delete: false
//     })
//     const [showForm,setShowForm]=useState(false)
//     const {currentUser}=useAuth()

//     useEffect(()=>{
//         const fetchData=async()=>{
//             try{
//                 const response=await blogAPI.getBlogs(currentUser.username)
//                 console.log(response)
//                 console.log(response.result.blogs)
//             }
//             catch(err){

//             }
//         }
//         fetchData()
//     },[currentUser])

//     const handleLogout = async () => {
//         try {
//             setLoading({...loading, logout: true})
//             await authAPI.logout()
//             // Navigate after successful logout
//             navigate('/')
//         } catch (error) {
//             console.error("Logout failed:", error)
//             alert("Logout failed. Please try again.")
//         } finally {
//             setLoading({...loading, logout: false})
//         }
//     }

//     const handleDeleteAccount=()=>{
//         setConfirm(true)
//     }
    
//     const confirmDeleteAccount = async () => {
//         // Add confirmation dialog
             
//             try {
//                 setLoading({...loading, delete: true})
//                 await authAPI.deleteAccount()
//                 navigate('/')
//             } catch (error) {
//                 console.error("Account deletion failed:", error)
//                 alert("Account deletion failed. Please try again.")
//             } finally {
//                 setLoading({...loading, delete: false})
//                 setConfirm(false)
//             }
        
//     }

//     return(
//         <>
//             {showForm && <EditProfileForm showForm={showForm} 
//                         setShowForm={setShowForm} 
//                         username={currentUser.username}
//                         onUpdateSuccess={handleProfileUpdateSuccess}/>}
//             <main>
//                 <div className='edit-main'>
//                     <div className='edit-profile'>
//                         <div className='user-profile-pic-data'>
//                             <RiAccountCircleFill size={50}/>
//                             <div className='username-date'>
//                                 <strong>{currentUser.username}</strong>
//                                 <br />
//                                 <p>from April 2024</p>
//                             </div>
//                             <button className='edit-button' onClick={()=>setShowForm(true)}>
//                                 <span>
//                                     <CiEdit color='white' size={30} />
//                                 </span>
//                             </button>
//                         </div>
                        
//                         <div className='edit-stats'>
//                             <NavLink style={{"textDecoration":"none",'color':"black"}} to={'followers'}>
//                                 <div className='edit-stat'>
//                                     <strong>50</strong>
//                                     <br />
//                                     <strong>Following</strong>
//                                 </div>
//                             </NavLink>
                            
//                             <NavLink style={{"textDecoration":"none",'color':"black"}} to={'following'}>
//                                 <div className='edit-stat'>
//                                     <strong>29</strong>
//                                     <br />
//                                     <strong>Following</strong>
//                                 </div>   
//                             </NavLink>

//                             <NavLink style={{"textDecoration":"none",'color':"black"}} to={'posts'}>
//                                 <div className='edit-stat'>
//                                     <strong>100</strong>
//                                     <br />
//                                     <strong>Blog Posts</strong>
//                                 </div>   
//                             </NavLink>

//                             <NavLink style={{"textDecoration":"none",'color':"black"}} to={''}>
//                                 <div className='edit-stat'>
//                                     <strong>29</strong>
//                                     <br />
//                                     <strong>Most Likes</strong>
//                                 </div>   
//                             </NavLink>
                                                                         
//                         </div>
//                         <Bio/>

//                         <div className='auth-buttons'>
//                             <button 
//                                 onClick={handleLogout} 
//                                 disabled={loading.logout}
//                             >
//                                 {loading.logout ? 
//                                         <Bars
//                                         height="20"
//                                         width="20"
//                                         color="white"
//                                         ariaLabel="bars-loading"
//                                         wrapperStyle={{}}
//                                         wrapperClass=""
//                                         visible={true}
//                                         />                                              
//                                 :<p>Log Out</p>}
//                             </button>
//                             <button 
//                                 onClick={handleDeleteAccount}
//                                 disabled={loading.delete}
//                             >
//                                 {loading.delete ? 'Deleting...' : 'Delete Account'}
//                             </button>
//                         </div>
//                     </div>

//                     <div className='edit-charts'>
//                         <Outlet/>
//                     </div>
//                 </div>
//             </main>

//             {confirm && (
//                 <ConfirmBox 
//                     text="delete your account?"
//                     confirmFunction={confirmDeleteAccount} 
//                     cancelFunction={()=>setConfirm(false)} 
//                 />
//             )}
//         </> 
//     )
// }

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/axios.js';
import './EditProfile.css';
import { RiAccountCircleFill } from 'react-icons/ri';
import { CiEdit } from "react-icons/ci";
import Bio from '../components/Bio.jsx';
import { useEffect, useState } from 'react';
import { Bars } from 'react-loader-spinner';
import ConfirmBox from '../components/ConfirmBox.jsx';
import { useAuth } from '../misc/AuthContext.jsx';
import { blogAPI } from '../api/blogAPI.js';
import EditProfileForm from './EditProfileForm.jsx';
import { userAPI } from '../api/userAPI.js';

export default function EditProfile() {
    const navigate = useNavigate();
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState({
        logout: false,
        delete: false,
        data: true
    });
    const [showForm, setShowForm] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userBlogs, setUserBlogs] = useState([]);
    const [userStats, setUserStats] = useState({
        followers: 0,
        following: 0,
        blogPosts: 0,
        mostLikes: 0
    });
    const {logout,currentUser,refreshUserData}=useAuth()
    // Function to fetch user data and blogs
    const fetchUserData = async () => {
        if (!currentUser || !currentUser.username) return;
        
        setLoading(prev => ({ ...prev, data: true }));
        try {
            // Fetch blogs
            const blogResponse = await blogAPI.getBlogs(currentUser.username);
            console.log("Fetched blogs:", blogResponse);
            if (blogResponse && blogResponse.result && blogResponse.result.blogs) {
                setUserBlogs(blogResponse.result.blogs);
                
                // Update the number of blogs in stats
                setUserStats(prev => ({
                    ...prev,
                    blogPosts: blogResponse.result.blogs.length || 0
                }));
            }
            
            // Fetch user profile data if you have such an API
            try {
                const userResponse = await userAPI.getProfile();
                console.log(userResponse)
                setUserData(userResponse);
                console.log("User response:", userResponse);
                // Update user stats if available in response
                if (userResponse) {
                    setUserStats(prev => ({
                        ...prev,
                        followers: userResponse.user.followers?.length || 0,
                        following: userResponse.user.following?.length || 0,
                        // Other stats if available
                    }));
                }
            } catch (err) {
                console.warn("Could not fetch user profile:", err);
                // If this fails, we still have the blogs data
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        } finally {
            setLoading(prev => ({ ...prev, data: false }));
        }
    };

    // Initial data fetch
    useEffect(() => {
        if (currentUser && currentUser.username) {
            fetchUserData();
        }
    }, []);

    // Handler for when profile is updated successfully
    const handleProfileUpdateSuccess = () => {
        // Refresh user data in auth context
        refreshUserData();
        // Re-fetch blogs and other user data
        fetchUserData();
    };

    // const handleLogout = async () => {
    //     try {
    //         setLoading({ ...loading, logout: true });
    //         await authAPI.logout();
    //         // Navigate after successful logout
    //         navigate('/');
    //     } catch (error) {
    //         console.error("Logout failed:", error);
    //         alert("Logout failed. Please try again.");
    //     } finally {
    //         setLoading({ ...loading, logout: false });
    //     }
    // };
    const handleLogout = async () => {
        try {
            setLoading({ ...loading, logout: true });
            await logout();
            // The navigate should take effect now without infinite loops
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        } finally {
            setLoading({ ...loading, logout: false });
        }
    };

    const handleDeleteAccount = () => {
        setConfirm(true);
    };
    
    const confirmDeleteAccount = async () => {
        try {
            setLoading({ ...loading, delete: true });
            await authAPI.deleteAccount();
            navigate('/');
        } catch (error) {
            console.error("Account deletion failed:", error);
            alert("Account deletion failed. Please try again.");
        } finally {
            setLoading({ ...loading, delete: false });
            setConfirm(false);
        }
    };

    return (
        <>
            {showForm && (
                <EditProfileForm 
                    showForm={showForm} 
                    setShowForm={setShowForm} 
                    username={currentUser.username}
                    onUpdateSuccess={handleProfileUpdateSuccess}
                />
            )}
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
                                        <strong>{currentUser.username}</strong>
                                        <br />
                                        <p>from {userData?.user.createdAt ? new Date(userData.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'April 2024'}</p>
                                    </div>
                                    <button className='edit-button' onClick={() => setShowForm(true)}>
                                        <span>
                                            <CiEdit color='white' size={30} />
                                        </span>
                                    </button>
                                </div>
                                
                                <div className='edit-stats'>
                                    <NavLink style={{ "textDecoration": "none", 'color': "black" }} to={'followers'}>
                                        <div className='edit-stat'>
                                            <strong>{userStats.followers}</strong>
                                            <br />
                                            <strong>Followers</strong>
                                        </div>
                                    </NavLink>
                                    
                                    <NavLink style={{ "textDecoration": "none", 'color': "black" }} to={'following'}>
                                        <div className='edit-stat'>
                                            <strong>{userStats.following}</strong>
                                            <br />
                                            <strong>Following</strong>
                                        </div>   
                                    </NavLink>

                                    <NavLink style={{ "textDecoration": "none", 'color': "black" }} to={'posts'}>
                                        <div className='edit-stat'>
                                            <strong>{userStats.blogPosts}</strong>
                                            <br />
                                            <strong>Blog Posts</strong>
                                        </div>   
                                    </NavLink>


                                </div>
                                
                                <Bio 
                                    aboutText={userData?.user?.about || "No bio available yet. Click edit to add information about yourself."} 
                                />

                                <div className='auth-buttons'>
                                    <button 
                                        onClick={handleLogout} 
                                        disabled={loading.logout}
                                    >
                                        {loading.logout ? 
                                            <Bars
                                                height="20"
                                                width="20"
                                                color="white"
                                                ariaLabel="bars-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                                visible={true}
                                            />                                              
                                        : <p>Log Out</p>}
                                    </button>
                                    <button 
                                        onClick={handleDeleteAccount}
                                        disabled={loading.delete}
                                    >
                                        {loading.delete ? 'Deleting...' : 'Delete Account'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className='edit-charts'>
                        <Outlet context={(blogCount)=>{
                            setUserStats(prev=>({
                                ...prev,
                                blogPosts:blogCount
                            }))
                        }} />
                    </div>
                </div>
            </main>

            {confirm && (
                <ConfirmBox 
                    text="delete your account?"
                    confirmFunction={confirmDeleteAccount} 
                    cancelFunction={() => setConfirm(false)} 
                />
            )}
        </> 
    );
}