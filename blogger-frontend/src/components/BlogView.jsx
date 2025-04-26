import { Link, useParams , useOutletContext } from "react-router-dom"
import './BlogView.css'
import { useAuth } from "../misc/AuthContext"
import { useEffect, useState } from "react"
import { blogAPI } from "../api/blogAPI"
import { MdOutlineDeleteOutline } from "react-icons/md";
import { InfinitySpin } from "react-loader-spinner"
import ConfirmBox from "./ConfirmBox"

function BlogList(){
    const {currentUser} = useAuth()
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [confirm, setConfirm] = useState(false)
    const [selectedBlog, setSelectedBlog] = useState(null)
    const updateParentStats=useOutletContext()
    let {username}=useParams()
    console.log("Username: ", username)
    if(username==="" || username===undefined){
        username=currentUser.username
    }
    const fetchBlogs = async() => {
        setLoading(true)
        try {
            console.log("Current User: ",currentUser)
            const blogResponse = await blogAPI.getBlogs(username)
            const fetchedblogs=blogResponse.result.blogs
            setBlogs(fetchedblogs)

            if(updateParentStats){
                updateParentStats(fetchedblogs.length)
            }
            console.log("Fetched blogs:", blogResponse.result.blogs)
            console.log("State variable", blogs)
        }
        catch(err) {
            console.error("Error fetching blogs:", err)
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {  
        fetchBlogs()
    }, [username,currentUser]) 

    const handleDelete = (blogId, e) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedBlog(blogId)
        setConfirm(true)
    }

    const confirmBlogDelete=async ()=>{
        try{
            await blogAPI.deleteBlog(selectedBlog)
            fetchBlogs()
            setConfirm(false)
        }
        catch(err){
            console.error("Error deleting blog:", err)
            setConfirm(false)
        }

    }

    if(loading) {
        return <div style={{display:"flex",
            justifyContent:"center",
            alignItems:"center",
            height:"100vh"}}><InfinitySpin/></div>
    }
    if(!blogs || blogs.length === 0) {
        return <p>No Blogs Found</p>
    }
    
    return(
        <>
            <h2>My Recent Blogs</h2>
            <div style={{"overflowY":"scroll","scrollbarWidth":"none","height":"70vh"}}>
                {blogs.map((blog, index) => (
                    <Link key={getBlogId(blog) || index} to={`/blog/${getBlogId(blog)}`} style={{textDecoration:"none",color:"black"}}>
                        <BlogTile 
                        blog={blog} 
                        onDelete={(e)=>handleDelete(getBlogId(blog),e)}
                        />
                    </Link>
                ))}
            </div>

            {confirm && (
                <ConfirmBox 
                    text="delete this blog?"
                    confirmFunction={confirmBlogDelete} 
                    cancelFunction={() => setConfirm(false)} 
                    
                />
            )}
        </>
    )
}

// Helper function to extract blog ID consistently
function getBlogId(blog) {
    return blog.blogId?.S || (typeof blog.blogId === 'string' ? blog.blogId : JSON.stringify(blog.blogId));
}

function BlogTile({blog,onDelete}){
    const getTitle = () => {
        const content = blog.content?.S || blog.content;
        if (!content) return "Untitled Blog";
        
        const titleMatch = content.match(/# (.*?)(\n|$)/);
        if (titleMatch) return titleMatch[1];
        
        return getBlogId(blog) || "Untitled Blog";
    };
        
    const formatDate = () => {
        const dateString = blog.createdAt?.S || blog.createdAt;
        if (!dateString) return "Unknown date";
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };

    // Get blog ID for the link
    const blogId = getBlogId(blog);

    return(
        <>
                <div style={{"color":"black"}} className="blog-tile">
                    <div style={{"display":"flex",
                        "justifyContent":"space-evenly",
                        "alignItems":"center",}}>
                        <h5>{getTitle()}</h5>
                        <div style={{padding:"0 15px"}} onClick={onDelete} ><MdOutlineDeleteOutline/></div>
                        <p style={{"fontWeight":"200"}}>Posted on {formatDate()}</p>
                    </div>
                </div>
        </>
    )
}

export {BlogList, BlogTile}