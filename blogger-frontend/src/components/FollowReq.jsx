import { FaCheck } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { RiAccountCircleFill } from "react-icons/ri";
import './Follow.css'
export default function FollowReq(){

    return(
        <>
            <main className="follow-main">
                <div className="follow-body">
                    <div className="follow-info">
                        <span>
                            <strong>UserName</strong>
                            <br />
                            has requested to follow you
                            <br />
                            **Time Stamp**
                        </span>
                        <div className="follow-image">
                            <RiAccountCircleFill size={40} color="blue"/>
                        </div>
                    </div>
                    <div className="follow-buttons">
                        <button className="accept"><FaCheck/></button>
                        <button className="delete"><MdDelete/></button>
                    </div>
                </div>
            </main>
        </>
    )
}