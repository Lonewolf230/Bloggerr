import { userAPI } from "../api/userAPI";
import Follower from "./Follower";
import { useState,useEffect } from "react";
import { useAuth } from "../misc/AuthContext";
import { Link, useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";

export default function FollowingList(){

    const [usernames,setUsernames]=useState([])
    const [loading,setLoading]=useState(true)
    const {currentUser}=useAuth()
    let {username}=useParams()

    
    useEffect(()=>{
        async function fetchFollowing(){
            
            setLoading(true)
            try{
                console.log(username)
                let userResponse;
                if(username){
                    userResponse=await userAPI.getOtherProfile(username)
                }
                else{
                    userResponse=await userAPI.getProfile()
                }
                console.log(userResponse.user.following)
                setUsernames(userResponse.user.following)
                console.log(usernames)
            }
            catch(err){
                console.warn("Could not fetch user data: ", err)
            }          
            finally{
                setLoading(false)
            }
        }
        fetchFollowing()
    },[])

    if(loading){
        return <div style={{display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    height:"100vh"}}><InfinitySpin/></div>
    }

    if(usernames.length==0){
        return  <h2>Not following anyone</h2>
    }

    return(
        <>  
            <div style={{"overflowY":"scroll","scrollbarWidth":"none",
                        "height":"70vh",borderRadius:"8px"}}>
                    <h2>Following</h2>                
                {usernames.map((username)=>(
                    <Link key={username} 
                          style={{textDecoration:"none",color:"black"}}
                          to={`/otherProfile/${username}`}>
                        <Follower username={username} />
                    </Link>
                ))}
                
            </div>
        </>
    )
}