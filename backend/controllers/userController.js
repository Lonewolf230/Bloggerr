const userModel=require('../models/userModel')

exports.followUser=async(req,res)=>{
    const currentUsername=req.user.username
    const {targetUsername}=req.params
    try{
        const result=await userModel.followUser(currentUsername,targetUsername)
        if(result.success==false){
            return res.status(500).json({
                message:"User follow failed",
                error:result.message
            })
        }
        return res.status(200).json({
          message:"User followed successfully",
          result:result  
        })
    }
    catch(err){
        return res.status(500).json({message:"User follow failed",error:err.message})
    }
}

exports.unfollowUser=async(req,res)=>{
    const currentUsername=req.user.username
    const {targetUsername}=req.params
    try{
        const result=await userModel.unfollowUser(currentUsername,targetUsername)
        if(result.success==false){
            return res.status(500).json({
                message:"User unfollow failed",
                error:result.message
            })
        }
        return res.status(200).json({
          message:"User unfollowed successfully",
          result:result  
        })
    }
    catch(err){
        return res.status(500).json({message:"User unfollow failed",error:err.message})
    }
}

exports.editUserProfile=async(req,res)=>{
    const username=req.user.username
    const profilePic=req.body.profilePic
    const about=req.body.about

    console.log(username,profilePic,about)

    try{
        const result=await userModel.editUser(username,profilePic,about)
        if(result.success==false){
            return res.status(500).json({
                message:"Profile update failed",
                error:result.message
            })
        }
        return res.status(200).json({
            message:"Profile updated successfully",
            error:result
        })
    }
    catch(err){
        return res.status(500).json({message:"User profile update failed",error:err.message})
    }
}

exports.getProfile=async(req,res)=>{
    const username=req.user.username
    try{
        const result=await userModel.getProfile(username)
        if(result.success==false){
            return res.status(500).json({
                message:"User not found",
                error:result.message
            })
        }
        return res.status(200).json({
            message:"User found",
            user:result.user
        })
    }
    catch(err){
        return res.status(500).json({message:"User not found",error:err.message})
    }
}

exports.getProfileByUsername=async(req, res)=>{
    const username=req.params.username
    try{
        const result=await userModel.getProfile(username)
        if(result.success==false){
            return res.status(500).json({
                message:"User not found",
                error:result.message
            })
        }
        return res.status(200).json({
            message:"User found",
            user:result.user
        })
    }
    catch(err){
        return res.status(500).json({message:"User not found", error:err.message})
    }
}