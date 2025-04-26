import FollowReq from '../components/FollowReq.jsx'
import Notification from '../components/Notification.jsx'
import './Notifs.css'
export default function Notifications(){
    return (
        <>
            <main className='notifs-main'>
                <div className='notifs-main-div'>
                    <div className='notifs'>
                        <h1>Notifications</h1>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>
                        <Notification/>                    
                    </div>
                    <div className='follows'>
                        <h1>Follow Activity</h1>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>  
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>
                        <FollowReq/>                                   
                    </div>
                </div>
            </main>
        </>
    )
}