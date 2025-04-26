import { userAPI } from "../api/userAPI";
import Follower from "./Follower";
import { useState,useEffect } from "react";
import { useAuth } from "../misc/AuthContext";
import { useParams,Link } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";

export default function FollowersList(){

    const [usernames,setUsernames]=useState([])
    const [loading,setLoading]=useState(true)
    let { username}=useParams()

    
    useEffect(()=>{
        async function fetchFollowers(){
            setLoading(true)
            try{
                let userResponse
                console.log(username)
                if(username){
                    userResponse=await userAPI.getOtherProfile(username)
                }
                else{
                    userResponse=await userAPI.getProfile()
                }
                console.log(userResponse.user.followers)
                setUsernames(userResponse.user.followers)
                console.log(usernames)
            }
            catch(err){
                console.warn("Could not fetch user data: ", err)
            }          
            finally{
                setLoading(false)
            }
        }
        fetchFollowers()
    },[])

    if(loading){
        return <div style={{display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    height:"100vh"}}><InfinitySpin color="blue"/></div>
    }

    if(usernames.length==0){
        return  <h2>No one is following you</h2>
    }

    return(
        <>  
            <div style={{"overflowY":"scroll",
                "scrollbarWidth":"none",
                "height":"70vh",
                
                borderRadius:"8px",
                padding:"5px 10px"}}>
                    <h2>Followers</h2>                
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