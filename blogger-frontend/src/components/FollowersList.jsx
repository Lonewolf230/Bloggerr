import { userAPI } from "../api/userAPI";
import Follower from "./Follower";
import { useState, useEffect } from "react";
import { useAuth } from "../misc/AuthContext";
import { Link, useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";

export default function FollowingList({other=false}) {
    const [usernames, setUsernames] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    let { username } = useParams();


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

 if (usernames.length === 0) {
        return (
            <div className="following-container">
                <h2 className="following-title">Followers</h2>
                <div className="empty-state">
                    No one is following {other?`${username}`:'you'} yet
                </div>
            </div>
        );
    }

    return (
        <div className="following-container">
            <h2 className="following-title">Followers ({usernames.length})</h2>
            {usernames.map((username, index) => (
                <Link
                    key={username}
                    className="follower-card"
                    to={`/otherProfile/${username}`}
                    style={{ 
                        textDecoration: "none", 
                        color: "inherit",
                        animationDelay: `${index * 0.1}s`
                    }}
                >
                    <Follower username={username} />
                </Link>
            ))}
        </div>
    );
}