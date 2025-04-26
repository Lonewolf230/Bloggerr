import './Home.css'
import Post from '../components/Post.jsx';
import AuthProfSumm from '../components/AuthorProfSumm.jsx';
import { useAuth } from '../misc/AuthContext.jsx';
import { useEffect,useState } from 'react';
import { blogAPI } from '../api/blogAPI.js';
import {InfinitySpin} from 'react-loader-spinner'

export default function Home(){
    const {currentUser,isAuthenticated}=useAuth()
    const [loading,setLoading]=useState(false)
    const [homeBlogs,setHomeBlogs]=useState([])

    useEffect(()=>{
        console.log(currentUser,isAuthenticated)
        const fetchHomeBlogs=async()=>{
            setLoading(true)
            try {
                const response=await blogAPI.getHomeBlogs()
                console.log(response)
                setHomeBlogs(response.result.blogs)
            } catch (error) {
                console.error("Error fetching home blogs:", error)
            }
            finally{
                setLoading(false)
            }
        }
        if(currentUser && currentUser.username){
            fetchHomeBlogs()
        
        }
    },[])


    return(
        <>
            
            <main id='home-main'>
                <section className='main-posts'>
                    <div>
                        {loading && <div style={{display:"flex",justifyContent:"center",
                            alignItems:"center",
                            height:"100vh"}}>
                                <InfinitySpin color='blue'/>
                            </div>}
                        {homeBlogs.map((blog)=><Post key={blog.blogId} blog={blog}/>)}
                    </div>
                    <div>
                        <AuthProfSumm/>
                    </div>
                </section>
            </main>
        </>
    )
}