const {PutCommand, GetCommand, UpdateCommand}=require("@aws-sdk/lib-dynamodb")
const dynamoDB=require('../config/dynamoDBconfig')

exports.createUser=async (email,about='',profilePic='')=>{
    const params={
        TableName:"users",
        Item:{
            username:email.split('@')[0],
            createdAt:new Date().toISOString(),
            numBlogs:0,
            followers:[],
            following:[],
            blogIds:[],
            profilePic,
            about,
            verified:false,
            interests:[],
            firstTime:true
        }
    }

    try{
        const command=new PutCommand(params)
        const result= await dynamoDB.send(command)
        console.log("User added successfully:",result)
        return result;
    }
    catch(err){
        console.error("Error creating user:",err)
        throw err
    }
}


exports.editUser = async (currentUsername, profilePic, about) => {

    const updateFields = [];
    const expressionAttributeValues = {};

    if (profilePic) {
        updateFields.push("profilePic = :profilePic");
        expressionAttributeValues[":profilePic"] = profilePic;
    }

    if (about) {
        updateFields.push("about = :about");
        expressionAttributeValues[":about"] = about;
    }

    if (updateFields.length === 0) {
        return {
            success: false,
            message: "No valid fields provided for update"
        };
    }

    const params = {
        TableName: "users",
        Key: { username: currentUsername },
        UpdateExpression: `SET ${updateFields.join(", ")}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW"
    };

    console.log(params)

    try {
        const result = await dynamoDB.send(new UpdateCommand(params))
        return {
            success: true,
            message: "Profile updated successfully",
            updatedUser: result.Attributes
        };
    } catch (error) {
        return {
            success: false,
            message: "Error updating profile",
            error: error.message
        };
    }
};



exports.followUser = async (currentUsername, targetUsername) => {
    if (currentUsername === targetUsername) {
        return {
            success: false,
            message: "You cannot follow yourself"
        }
    }

    const params = {
        TableName: "users",
        Key: { username: targetUsername }
    }

    try {
        const getUserCommand = new GetCommand(params)
        const userResult = await dynamoDB.send(getUserCommand)

        if (!userResult.Item) {
            return {
                success: false,
                message: "User not found"
            }
        }

        const getCurrentUserCommand = new GetCommand({
            TableName: "users",
            Key: { username: currentUsername }
        })
        const currentUserResult = await dynamoDB.send(getCurrentUserCommand)

        const currentUserFollowing = currentUserResult.Item?.following || []
        if (currentUserFollowing.includes(targetUsername)) {
            return {
                success: false,
                message: "You are already following this user"
            }
        }

        const updateTargetParams = {
            TableName: "users",
            Key: { username: targetUsername },
            UpdateExpression: "SET followers = list_append(if_not_exists(followers, :empty_list), :currentUser)",
            ExpressionAttributeValues: {
                ":currentUser": [currentUsername],
                ":empty_list": []
            },
            ReturnValues: "UPDATED_NEW"
        }

        const updateCurrentParams = {
            TableName: "users",
            Key: { username: currentUsername },
            UpdateExpression: "SET following = list_append(if_not_exists(following, :empty_list), :targetUser)",
            ExpressionAttributeValues: {
                ":targetUser": [targetUsername],
                ":empty_list": []
            },
            ReturnValues: "UPDATED_NEW"
        }

        const [targetUserResult, currentUserResult2] = await Promise.all([
            dynamoDB.send(new UpdateCommand(updateTargetParams)),
            dynamoDB.send(new UpdateCommand(updateCurrentParams))
        ])

        return {
            success: true,
            message: "Followed user successfully",
            updatedFollowers: targetUserResult.Attributes.followers,
            updatedFollowing:currentUserResult2.Attributes.following
        }
    } catch (err) {
        console.error("Error following user:", err)
        return {
            success: false,
            message: err.message
        }
    }
}

exports.unfollowUser=async(currentUsername,targetUsername)=>{
    if(currentUsername===targetUsername){
        return{
            success:false,
            message:"You cannot unfollow yourself"
        }
    }
    try{
        const getUserCommand=new GetCommand({
            TableName:"users",
            Key:{username:targetUsername}
        })
        const userResult=await dynamoDB.send(getUserCommand)
        if(!userResult.Item){
            return{
                success:false,
                message:"User not found"
            }
        }
        const getCurrentUserCommand=new GetCommand({
            TableName:"users",
            Key:{username:currentUsername}
        })
        const currentUserResult=await dynamoDB.send(getCurrentUserCommand)

        const currentUserFollowing=currentUserResult.Item?.following || []
        if(!currentUserFollowing.includes(targetUsername)){
            return{
                success:false,
                message:"You are not following this user"
            }
        }
        const updateTargetParams={
            TableName:"users",
            Key:{username:targetUsername},
            UpdateExpression:"SET followers = :updatedFollowers",
            ExpressionAttributeValues:{
                ":updatedFollowers":(userResult.Item.followers || [])
                .filter(username=> username !== currentUsername)
            },
            ReturnValues:"UPDATED_NEW"
        }
        const updateCurrentParams={
            TableName:"users",
            Key:{username:currentUsername},
            UpdateExpression:"SET following = :updatedFollowing",
            ExpressionAttributeValues:{
                ":updatedFollowing":currentUserFollowing.
                                        filter(username=>username!==targetUsername)
            },
            ReturnValues:"UPDATED_NEW"
        }

        const [targetUserResult,currentUserResult2]=await Promise.all([
            dynamoDB.send(new UpdateCommand(updateTargetParams)),
            dynamoDB.send(new UpdateCommand(updateCurrentParams))
        ])
        return{
            success:true,
            message:"Unfollowed user successfully",
            updatedFollowers:targetUserResult.Attributes.followers,
            updatedFollowing:currentUserResult2.Attributes.following
        }
    }
    catch(err){
        console.error("Error unfollowing user:",err)
        return{
            success:false,
            message:err.message
        }
    }
}

exports.getProfile=async(username)=>{
    const params={
        TableName:"users",
        Key:{username}
    }
    try{
        const command=new GetCommand(params)
        const result=await dynamoDB.send(command)
        return{
            success:true,
            user:result.Item
        }
    }
    catch(err){
        console.error("Error fetching profile:",err)
        return{
            success:false,
            message:err.message
        }
    }
}

exports.getOtherProfile=async(username)=>{
    const params={
        TableName:"users",
        Key:{username}
    }
    try{
        const command=new GetCommand(params)
        const result=await dynamoDB.send(command)
        if(!result.Item){
            return{
                success:false,
                message:"User not found"
            }
        }
        return{
            success:true,
            user:result.Item
        }
    }
    catch(err){
        console.error("Error fetching profile:",err)
        return{
            success:false,
            message:err.message
        }
    }
}