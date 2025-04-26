import './Profile.css'
import { FaBookOpen } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import { useAuth } from '../misc/AuthContext';
import { userAPI } from '../api/userAPI';
import { InfinitySpin } from 'react-loader-spinner';
export default function AuthProfSumm(){

    const {currentUser}=useAuth()
    const [loading,setLoading]=useState(false)
    const [user,setUser]=useState({})
    useEffect(()=>{
        const fetchProfile=async()=>{
            console.log("Current User: ",currentUser)
            setLoading(true)
            try{
                const response=await userAPI.getProfile()
                console.log("Prof Summary: ",response)
                setUser(response)
                console.log("State var: ",response)
            }
            catch(err){
    
            }
            finally{
                setLoading(false)
            }
        }
        fetchProfile()
    },[])
    
    if(loading){
        return(
            <div style={{display:"flex",justifyContent:"center",height:"100vh",alignItems:"center"}}><InfinitySpin color='blue'/></div>
        )
    }

    const followers = user?.user?.followers?.length || 0;
    const following = user?.user?.following?.length || 0;
    const numBlogs = user?.user?.numBlogs || 0;

    return(
        <>
            <main style={{backgroundColor:"azure",borderRadius:"10px"}}>
                <h2 style={{alignSelf:"center"}}>My Profile</h2>
                <section className="profile-pic">
                    <div>
                        <img src={`https://bloggers3bucket.s3.ap-south-1.amazonaws.com/profilePics/${currentUser.username}.jpg`} alt="" style={{height:"50px",width:"50px",borderRadius:"50%"}} />
                        <p style={{color:"blue",fontWeight:"600"}}>{currentUser.username}</p>
                    </div>
                </section>
                <section className="stats">
                    <div className="stat">
                        <p>{followers}</p>
                        <p>Followers</p>
                    </div>
                    <div className="stat">
                        <p>{following}</p>
                        <p>Following</p>
                    </div>
                    <div className="stat">
                        <p>{numBlogs}</p>
                        <p>Posts</p>
                    </div>

                </section>
                <section className="recents">
                    <p><FaBookOpen/> Recent Posts</p>
                    <ol>
                        <li>Intro to React Hooks</li>
                        <li>Intro to React Hooks</li>
                        <li>Intro to React Hooks</li>
                    </ol>
                </section>
            </main>
        </>
    )
}