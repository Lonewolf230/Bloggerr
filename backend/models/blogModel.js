const {v4:uuidv4} = require("uuid");
const { PutCommand, UpdateCommand, GetCommand,DeleteCommand,ScanCommand,QueryCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDB = require('../config/dynamoDBconfig');
const {}=require('@aws-sdk/client-dynamodb')

exports.createBlog = async (blogId,username,content,imgIds,vidIds,ytIds) => {
    try {
        // First check if user exists
        const getUserCommand = new GetCommand({
            TableName: "users",
            Key: { username }
        });

        const userResponse = await dynamoDB.send(getUserCommand);
        
        // If user doesn't exist in the users table
        if (!userResponse.Item) {
            return {
                success: false,
                message: "Please create an account first"
            };
        }

        // If user exists, proceed with blog creation
        const blogParams = {
            TableName: "blogs",
            Item: {
                blogId,
                author: username,
                createdAt: new Date().toISOString(),
                content,
                likes: [],
                dislikes: [],
                comments: 0,
                imgIds,
                vidIds,
                ytIds,
                relevantTags:[]
            }
        };

        // Create blog and update user in a transaction
        const updateUserParams = {
            TableName: "users",
            Key: { username },
            UpdateExpression: "SET numBlogs = if_not_exists(numBlogs, :zero) + :inc, blogIds = list_append(if_not_exists(blogIds, :empty_list), :blogId)",
            ExpressionAttributeValues: {
                ":inc": 1,
                ":zero": 0,
                ":blogId": [blogId],
                ":empty_list": []
            }
        };

        await dynamoDB.send(new PutCommand(blogParams));
        await dynamoDB.send(new UpdateCommand(updateUserParams));

        return {
            success: true,
            message: "Blog created successfully",
            blogId: blogId
        };

    } catch (err) {
        console.error("Error creating blog:", err);
        throw err;
    }
};

exports.getBlog=async (blogId)=>{

    const params={
        TableName:"blogs",
        Key:{
            blogId
        }
    }
    try{
        const command=new GetCommand(params)
        const result=await dynamoDB.send(command)
        return {
            success:true,
            blog:result.Item
        }
    }
    catch(err){
        console.error("Error getting blog:",err)
        return {
            success:false,
            message:err.message
        }
    }
}

// exports.getBlogs = async (author) => {
//     console.log(author)
//     if(!author){
//         throw new Error("Author name is required")
//     }
//     const params = {
//         TableName: "blogs",
//         IndexName: "author-index",
//         KeyConditionExpression: "#author = :author",
//         ExpressionAttributeNames: {
//             "#author": "author"
//         },
//         ExpressionAttributeValues: {
//             ":author": { S: author }
//         }
//     };

//     try {
//         const command = new QueryCommand(params);
//         const result = await dynamoDB.send(command);
//         console.log("Retrieved blogs:", result.Items);
//         const items=result.Items || []
//         return {success:true,blogs:items};
//     } catch (err) {
//         console.error("Error getting blogs:", err);
//         return {success:false,message:err.message}
//     }
// };

exports.getBlogs = async (author) => {
    console.log(author);
    if(!author){
        throw new Error("Author name is required");
    }
    
    const params = {
        TableName: "blogs",
        IndexName: "author-index",
        KeyConditionExpression: "author = :author",
        ExpressionAttributeValues: {
            ":author": author
        }
    };

    try {
        const command = new QueryCommand(params);
        const result = await dynamoDB.send(command);
        console.log("Retrieved blogs:", result.Items);
        const items = result.Items || [];
        return {success: true, blogs: items};
    } catch (err) {
        console.error("Error getting blogs:", err);
        return {success: false, message: err.message};
    }
};

// exports.getHomeblogs=async(username)=>{
//     if(!username){
//         throw new Error("Username is required")
//     }
//     const fiveHoursAgo=new Date()
//     fiveHoursAgo.setHours(fiveHoursAgo.getHours()-5)
//     const fiveHoursAgoISOString=fiveHoursAgo.toISOString()
//     const params={
//         TableName:"blogs",

//     }
//     let followingUsers=[]
//     try {
//         const userParams={
//             TableName:"users",
//             Key:{username}
//         }
//         const userData=await dynamoDB.send(new GetCommand(userParams))
//         if(userData.Item && userData.Item.following){
//             followingUsers=userData.Item.following || []
//         }
//     }
//     catch (error) {
//         console.error("Error getting user data:",error)
//         throw new Error("Error getting user data")
//     }

//     try{
//         const recentBlogsParams={
//             TableName:"blogs",
//             FilterExpression:"createdAt >= :timeAgo",
//             ExpressionAttributeValues:{
//                 ":timeAgo":fiveHoursAgoISOString
//             }
//         }
//         const recentBlogsData=await dynamoDB.send(new QueryCommand(recentBlogsParams))
//         const recentBlogs=recentBlogsData.Items || []
//         if(followingUsers.length===0){
//             return recentBlogs
//         }
//         const followingBlogsParams={
//             TableName:"blogs",
//             FilterExpression:"author IN (:authors)",
//             ExpressionAttributeValues:{
//                 ":authors":followingUsers
//             }
//         }
//         let followingBlogs=[]
//         if(followingUsers.length>0){
//             followingBlogs=await
//         }
//     }
//     catch(err){
        
//     }
// }

// exports.getHomeblogs = async (username) => {
//     if (!username) {
//         throw new Error("Username is required");
//     }
//     console.log(username)
    
//     const fiveHoursAgo = new Date();
//     fiveHoursAgo.setHours(fiveHoursAgo.getHours() - 5);
//     const fiveHoursAgoISOString = fiveHoursAgo.toISOString();
    
//     let followingUsers = [];
//     try {
//         const userParams = {
//             TableName: "users",
//             Key: { username }
//         };
//         const userData = await dynamoDB.send(new GetCommand(userParams));
//         if (userData.Item && userData.Item.following) {
//             followingUsers = userData.Item.following || [];
//         }
//     } catch (error) {
//         console.error("Error getting user data:", error);
//         throw new Error("Error getting user data");
//     }

//     try {
//         // Get recent blogs (last 5 hours)
//         const recentBlogsParams = {
//             TableName: "blogs",
//             FilterExpression: "createdAt >= :timeAgo",
//             ExpressionAttributeValues: {
//                 ":timeAgo": fiveHoursAgoISOString
//             }
//         };
        
//         // Use ScanCommand instead of QueryCommand for filtering by date
//         const recentBlogsCommand = new ScanCommand(recentBlogsParams);
//         const recentBlogsData = await dynamoDB.send(recentBlogsCommand);
//         const recentBlogs = recentBlogsData.Items || [];
        
//         // If user doesn't follow anyone, just return recent blogs
//         if (followingUsers.length === 0) {
//             return {
//                 success: true,
//                 blogs: recentBlogs
//             };
//         }
        
//         // Get blogs from followed users
//         let followingBlogs = [];
//         if (followingUsers.length > 0) {
//             // Since DynamoDB doesn't directly support IN operator with multiple values efficiently,
//             // we'll run separate queries for each followed user and combine results
//             followingBlogs = await Promise.all(followingUsers.map(async (followedUser) => {
//                 const followingBlogsParams = {
//                     TableName: "blogs",
//                     IndexName: "author-index",
//                     KeyConditionExpression: "#author = :author",
//                     ExpressionAttributeNames: {
//                         "#author": "author"
//                     },
//                     ExpressionAttributeValues: {
//                         ":author": { S: followedUser }
//                     }
//                 };
                
//                 const followingBlogsCommand = new QueryCommand(followingBlogsParams);
//                 const result = await dynamoDB.send(followingBlogsCommand);
//                 return result.Items || [];
//             }));
            
//             // Flatten the array of arrays
//             followingBlogs = followingBlogs.flat();
//         }
        
//         // Combine both sets of blogs and remove duplicates
//         const allBlogs = [...recentBlogs];
        
//         followingBlogs.forEach(blog => {
//             // Convert DynamoDB format to regular JavaScript object if needed
//             const processedBlog = blog.blogId ? blog : {
//                 blogId: blog.blogId.S,
//                 author: blog.author.S,
//                 createdAt: blog.createdAt.S,
//                 content: blog.content.S,
//                 likes: blog.likes ? parseInt(blog.likes.N, 10) : 0,
//                 dislikes: blog.dislikes ? parseInt(blog.dislikes.N, 10) : 0,
//                 comments: blog.comments ? parseInt(blog.comments.N, 10) : 0
//             };
            
//             // Skip if this blog is already in recentBlogs
//             const isDuplicate = recentBlogs.some(recentBlog => 
//                 recentBlog.blogId === processedBlog.blogId
//             );
            
//             if (!isDuplicate) {
//                 allBlogs.push(processedBlog);
//             }
//         });
        
//         // Sort blogs by createdAt (newest first)
//         allBlogs.sort((a, b) => {
//             const dateA = new Date(a.createdAt);
//             const dateB = new Date(b.createdAt);
//             return dateB - dateA;
//         });
        
//         return {
//             success: true,
//             blogs: allBlogs
//         };
//     } catch (err) {
//         console.error("Error fetching blogs:", err);
//         return {
//             success: false,
//             message: err.message
//         };
//     }
// };

exports.getHomeblogs = async (username) => {
    if (!username) {
        throw new Error("Username is required");
    }
    console.log(username)
    
    const fiveHoursAgo = new Date();
    fiveHoursAgo.setHours(fiveHoursAgo.getHours() - 5);
    const fiveHoursAgoISOString = fiveHoursAgo.toISOString();
    
    let followingUsers = [];
    try {
        const userParams = {
            TableName: "users",
            Key: { username }
        };
        const userData = await dynamoDB.send(new GetCommand(userParams));
        if (userData.Item && userData.Item.following) {
            followingUsers = userData.Item.following || [];
        }
    } catch (error) {
        console.error("Error getting user data:", error);
        throw new Error("Error getting user data");
    }

    try {
        // Get recent blogs (last 5 hours)
        const recentBlogsParams = {
            TableName: "blogs",
            FilterExpression: "createdAt >= :timeAgo",
            ExpressionAttributeValues: {
                ":timeAgo": fiveHoursAgoISOString
            }
        };
        
        const recentBlogsCommand = new ScanCommand(recentBlogsParams);
        const recentBlogsData = await dynamoDB.send(recentBlogsCommand);
        const recentBlogs = recentBlogsData.Items || [];
        
        // If user doesn't follow anyone, just return recent blogs
        if (followingUsers.length === 0) {
            return {
                success: true,
                blogs: recentBlogs
            };
        }
        
        // Get blogs from followed users
        let followingBlogs = [];
        if (followingUsers.length > 0) {
            // We need to use a different approach for each author
            
            // Create a function to get blogs for a single author
            const getBlogsForAuthor = async (author) => {
                const followingBlogsParams = {
                    TableName: "blogs",
                    IndexName: "author-index",
                    KeyConditionExpression: "author = :author",
                    ExpressionAttributeValues: {
                        ":author": author
                    }
                };
                
                const followingBlogsCommand = new QueryCommand(followingBlogsParams);
                const result = await dynamoDB.send(followingBlogsCommand);
                return result.Items || [];
            };
            
            // Get blogs for each followed user
            const followingBlogsResults = await Promise.all(
                followingUsers.map(author => getBlogsForAuthor(author))
            );
            
            // Flatten the array of arrays
            followingBlogs = followingBlogsResults.flat();
        }
        
        // Combine both sets of blogs and remove duplicates
        const allBlogs = [...recentBlogs];
        
        followingBlogs.forEach(blog => {
            // Skip if this blog is already in recentBlogs
            const isDuplicate = recentBlogs.some(recentBlog => 
                recentBlog.blogId === blog.blogId
            );
            
            if (!isDuplicate) {
                allBlogs.push(blog);
            }
        });
        
        // Sort blogs by createdAt (newest first)
        allBlogs.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
        });
        
        return {
            success: true,
            blogs: allBlogs
        };
    } catch (err) {
        console.error("Error fetching blogs:", err);
        return {
            success: false,
            message: err.message
        };
    }
};


exports.deleteBlog=async(blogId)=>{

    const params={
        TableName:"blogs",
        Key:{
            blogId
        }
    }
    try{
        const command=new DeleteCommand(params)
        const result=await dynamoDB.send(command)
        return result
    }
    catch(err){
        console.error("Error deleting blog:", err)
        throw err
    }
}


exports.like = async (blogId, username) => {
    const params = {
        TableName: "blogs",
        Key: { blogId }
    };

    try {
        const getBlogCommand = new GetCommand(params);
        const blogResult = await dynamoDB.send(getBlogCommand);
        if (!blogResult.Item) {
            return {
                success: false,
                message: "Blog Not found"
            };
        }

        // Check if user already liked the blog
        const likes = blogResult.Item.likes || [];
        if (likes.includes(username)) {
            return {
                success: false,
                message: "You have already liked this blog"
            };
        }


        //
        const dislikes=blogResult.Item.dislikes||[]
        const userDislikeIndex=dislikes.indexOf(username)
        let updateParams

        if(userDislikeIndex!==-1){
            updateParams = {
                TableName: "blogs",
                Key: { blogId },
                UpdateExpression: "SET likes = list_append(if_not_exists(likes, :emptyList), :newLike) REMOVE dislikes[" + userDislikeIndex + "]",
                ExpressionAttributeValues: {
                    ":newLike": [username],
                    ":emptyList": []
                },
                ReturnValues: "UPDATED_NEW"
            };
        }
        else{
            updateParams = {
                TableName: "blogs",
                Key: { blogId },
                UpdateExpression: "SET likes = list_append(if_not_exists(likes, :emptyList), :newLike)",
                ExpressionAttributeValues: {
                    ":newLike": [username],
                    ":emptyList": []
                },
                ReturnValues: "UPDATED_NEW"
            };
        }

        const result = await dynamoDB.send(new UpdateCommand(updateParams));
        console.log("Update result:", result);
        return {
            success: true,
            message: "Blog liked successfully",
            updatedLikes: result?.Attributes?.likes || [] ,
            updatedDislikes:result?.Attributes?.dislikes || []
        };
    }
    catch (err) {
        console.error("Error liking blog:", err);
        return {
            success: false,
            message: err.message
        };
    }
};

exports.unlike = async (blogId, username) => {
    const params = {
        TableName: "blogs",
        Key: { blogId }
    };
    try {
        const getBlogCommand = new GetCommand(params);
        const blogResult = await dynamoDB.send(getBlogCommand);
        if (!blogResult.Item) {
            return {
                success: false,
                message: "Blog not found"
            };
        }
        
        const likes = blogResult.Item.likes || [];
        const userIndex = likes.indexOf(username);
        
        if (userIndex === -1) {
            return {
                success: false,
                message: "User has not liked this blog"
            };
        }
        
        const updateParams = {
            TableName: "blogs",
            Key: { blogId },
            UpdateExpression: `REMOVE likes[${userIndex}]`,
            ReturnValues: "UPDATED_NEW"
        };
        const result = await dynamoDB.send(new UpdateCommand(updateParams));
        console.log("Update result:", result);
        return {
            success: true,
            message: "Blog unliked successfully",
            updatedLikes: result?.Attributes?.likes||[]
        };
    }
    catch (err) {
        console.error("Error unliking blog:", err);
        return {
            success: false,
            message: err.message
        };
    }
};

exports.dislike = async (blogId, username) => {
    try {
        // Check if blog exists
        const getBlogParams = {
            TableName: "blogs",
            Key: { blogId }
        };
        const getBlogCommand = new GetCommand(getBlogParams);
        const blogResult = await dynamoDB.send(getBlogCommand);

        if (!blogResult.Item) {
            return {
                success: false,
                message: "Blog not found"
            };
        }

        // Check if user already disliked the blog
        const dislikes = blogResult.Item.dislikes || [];
        if (dislikes.includes(username)) {
            return {
                success: false,
                message: "You have already disliked this blog"
            };
        }

        const likes=blogResult.Item.likes||[]
        const userLikeIndex=likes.indexOf(username)
        let updateParams;

        // Update blog dislikes
        if(userLikeIndex !==-1){
            updateParams = {
                TableName: "blogs",
                Key: { blogId },
                UpdateExpression: "SET dislikes = list_append(if_not_exists(dislikes, :emptyList), :newDislike) REMOVE likes[" + userLikeIndex + "]",
                ExpressionAttributeValues: {
                    ":newDislike": [username],
                    ":emptyList": []
                },
                ReturnValues: "UPDATED_NEW"
            };
        }
        else{
            updateParams = {
                TableName: "blogs",
                Key: { blogId },
                UpdateExpression: "SET dislikes = list_append(if_not_exists(dislikes, :emptyList), :newDislike)",
                ExpressionAttributeValues: {
                    ":newDislike": [username],
                    ":emptyList": []
                },
                ReturnValues: "UPDATED_NEW"
            };
        }
        const result = await dynamoDB.send(new UpdateCommand(updateParams));

        return {
            success: true,
            message: "Blog disliked successfully",
            updatedDislikes: result?.Attributes?.dislikes||[] ,
            updatedLikes:result?.Attributes?.likes ||[]
        };
    } catch (err) {
        console.error("Error disliking blog:", err);
        return {
            success: false,
            message: err.message
        };
    }
};

exports.undislike = async (blogId, username) => {
    const params = {
        TableName: "blogs",
        Key: { blogId }
    };
    try {
        const getBlogCommand = new GetCommand(params);
        const blogResult = await dynamoDB.send(getBlogCommand);
        if (!blogResult.Item) {
            return {
                success: false,
                message: "Blog not found"
            };
        }

        const dislikes = blogResult.Item.dislikes || [];
        const userIndex = dislikes.indexOf(username);

        if (userIndex === -1) {
            return {
                success: false,
                message: "User has not disliked this blog"
            };
        }

        const updateParams = {
            TableName: "blogs",
            Key: { blogId },
            UpdateExpression: `REMOVE dislikes[${userIndex}]`,
            ReturnValues: "UPDATED_NEW"
        };
        const result = await dynamoDB.send(new UpdateCommand(updateParams));
        return {
            success: true,
            message: "Blog undisliked successfully",
            updatedDislikes: result?.Attributes?.dislikes || []
        };
    }
    catch (err) {
        console.error("Error undisliking blog:", err);
        return {
            success: false,
            message: err.message
        };
    }
};