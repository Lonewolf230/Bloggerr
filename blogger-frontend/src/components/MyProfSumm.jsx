import './Profile.css'
import { FaBookOpen } from "react-icons/fa6";
export default function MyProfSumm(){

    return(
        <>
            <main>
                <section className="profile-pic">
                    <div>
                        <img src="https://static.vecteezy.com/system/resources/previews/021/079/672/original/user-account-icon-for-your-design-only-free-png.png" alt="" height={50} width={50} />
                        <p>Web and App Dev</p>
                    </div>
                </section>
                <section className="stats">
                    <div className="stat">
                        <p>100</p>
                        <p>Followers</p>
                    </div>
                    <div className="stat">
                        <p>29</p>
                        <p>Following</p>
                    </div>
                    <div className="stat">
                        <p>10</p>
                        <p>Posts</p>
                    </div>
                    <div className="stat">
                        <p>500</p>
                        <p>Most Liked</p>
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