import './Notif.css'
import { RiAccountCircleFill } from "react-icons/ri";

export default function Notification(){

    return (
        <>
            <main className="notif">
                    <div className='notif-div'>
                        <div className='notif-left'>
                            <span>
                                <strong>From person</strong>
                                <br />
                                **action name**
                                regarding the blog post **Post Name**
                                <br />
                                **Date or time based on Relevance**
                            </span>
                        </div>
                        <div className='notif-image'>
                            <RiAccountCircleFill size={40} color='blue'/>
                        </div>
                    </div>
                    
            </main>
        </>
    )
}