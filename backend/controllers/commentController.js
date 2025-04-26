const commentModel=require('../models/commentModel');

exports.createComment=async(req,res)=>{
    const {blogId,content,parentId}=req.body
    const username=req.user.username
    try{
        const result=await commentModel.createComment(blogId,username,content,parentId)
        if(result.success===false){
            return res.status(500).json(
                {
                    message:"Comment creation failed", 
                    error:result.message
                }
            )
        }
        return res.status(200).json(
            {
                message:"Comment created successfully:",result
            }
        )

    }
    catch(err){
        return res.status(500).json(
            {
                message:"Comment creation failed",
                error:err.message
            }
        )
    }
}

exports.getCommentsByBlogId=async(req,res)=>{
    const blogId=req.params.blogId
    try{
        const result=await commentModel.getCommentsByBlogId(blogId)
        if(!result.success){
            return res.status(400).json({
                message:"Error getting comments",
                error:result.message
            })
        }

        return res.status(200).json({
            message:"Comments retrieved successfully",
            result   
        })
    }
    catch(err){
        return res.status(500).json({
            message:"Error getting comments",
            error:err.message
        })
    }
}

exports.getComment=async(req,res)=>{
    const commentId=req.params.commentId
    try{
        const result=await commentModel.getComment(commentId)
        if(!result.success){
            return res.status(400).json({
                message:"Error getting comment",
                error:result.message
            })
        }

        return res.status(200).json({
            message:"Comment retrieved successfully",
            result   
        })
    }
    catch(err){
        return res.status(500).json({
            message:"Error getting comment",
            error:err.message
        })
    }
}