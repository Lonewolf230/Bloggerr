const blogModel=require('../models/blogModel')

exports.createBlog=async(req,res)=>{
    const {blogId,email,content,imgIds,vidIds,ytIds}=req.body
    try{
        const result=await blogModel.createBlog(blogId,email.split('@')[0],content,imgIds,vidIds,ytIds)
        if(result.success===false){
            return res.status(500).json({message:"Blog creation failed", error:result.message})
        }
        return res.status(200).json({message:"Blog created successfully:",result})

    }
    catch(err){
        return res.status(500).json({message:"Blog creation failed",error:err.message})
    }
}

exports.getBlog=async(req,res)=>{

    const blogId=req.params.id
    try{
        const result=await blogModel.getBlog(blogId)
        if(result.success===false){
            return res.status(500).json({message:"Blog retrieval failed", error:result.message})
        }
        return res.status(200).json({message:"Blog retrieved successfully:",result})

    }
    catch(err){
        return res.status(500).json({message:"Blog retrieval failed",error:err.message})
    }
}

exports.getBlogs=async(req,res)=>{
    const author=req.params.author
    console.log("Author: ",author);
    
    try{
        const result=await blogModel.getBlogs(author)
        if(result.success===false){
            return res.status(500).json({message:"Blogs retrieval failed", error:result.message})
        }
        return res.status(200).json({message:"Blogs retrieved successfully:",result})

    }
    catch(err){
        return res.status(500).json({message:"Blogs retrieval failed",error:err.message})
    }
}

exports.getHomeBlogs=async(req,res)=>{
    const username=req.user.username
    try{
        const result=await blogModel.getHomeblogs(username)
        if(result.success===false){
            return res.status(500).json({message:"Home Blogs retrieval failed", error:result.message})
        }
        return res.status(200).json({message:"Home Blogs retrieved successfully:",result})
    }
    catch(err){
        return res.status(500).json({message:"Home Blogs retrieval failed",error:err.message})
    }
}

exports.deleteBlog=async(req,res)=>{
    const blogId=req.params.id
    try{
        const result=await blogModel.deleteBlog(blogId)
        if(result.success===false){
            return res.status(500).json({message:"Blog deletion failed", error:result.message})
        }
        return res.status(200).json({message:"Blog deleted successfully:",result})

    }
    catch(err){
        return res.status(500).json({message:"Blog deletion failed",error:err.message})
    }
}

exports.likeBlog=async (req,res)=>{
    const id=req.params.id
    const username=req.user.username
    try{
        const result=await blogModel.like(id,username)
        if(!result.success){
            return res.status(400).json({
                message:"Blog liking failed",
                error:result.message
            })
        }

        return res.status(200).json({
            message:"Blog liked successfully",
            result
        })
    }
    catch(err){
        return res.status(500).json({
            message:"Unexpected error in liking blog",
            error:err.message
        })
    }
}

exports.unlikeBlog=async(req,res)=>{
    const id=req.params.id
    const username=req.user.username
    try{
        const result=await blogModel.unlike(id,username)
        if(!result.success){
            return res.status(400).json({
                message:"Blog unlike failed",
                error:result.message
            })
        }
        return res.status(200).json({
            message:"Blog unliked successfully",
            result
        })
    }
    catch(err){
        return res.status(500).json({
            message:"Unexpected error in unliking blog",
            error:err.message
        })
    }
}

exports.dislikeBlog = async (req, res) => {
    const id = req.params.id;
    const username = req.user.username;
    try {
        const result = await blogModel.dislike(id,username);
        
        if (!result.success) {
            return res.status(400).json({
                message: "Blog unlike failed", 
                error: result.message
            });
        }
        
        return res.status(200).json({
            message: "Blog disliked successfully",
            result
        });
    } catch (err) {
        return res.status(500).json({
            message: "Unexpected error in disliking blog",
            error: err.message
        });
    }
};

exports.undislikeblog = async (req, res) => {
    const id = req.params.id;
    const username = req.user.username;
    try {
        const result = await blogModel.undislike(id, username);
        
        if (!result.success) {
            return res.status(400).json({
                message: "Blog undislike failed", 
                error: result.message
            });
        }
        
        return res.status(200).json({
            message: "Blog undisliked successfully",
            result
        });
    } catch (err) {
        return res.status(500).json({
            message: "Unexpected error in undisliking blog",
            error: err.message
        });
    }
}