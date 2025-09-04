const {v4:uuidv4} = require("uuid");
const { PutCommand, UpdateCommand, GetCommand,DeleteCommand,ScanCommand,QueryCommand,BatchGetCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDB = require('../config/dynamoDBconfig');
const {}=require('@aws-sdk/client-dynamodb');
const indexBlog = require("../middleware/embeddings");
const OpenAI=require('openai')
const pinecone=require('@pinecone-database/pinecone')
const pc=new pinecone.Pinecone({
    apiKey:process.env.PINECONE_API_KEY
})
const index=pc.Index('blogs')

const openAI= new OpenAI({
    apiKey:process.env.OPEN_AI_KEY
})
exports.createBlog = async (blogId,username,content,plaintext,imgIds,vidIds,ytIds,tags) => {
    try {
        const getUserCommand = new GetCommand({
            TableName: "users",
            Key: { username }
        });

        const userResponse = await dynamoDB.send(getUserCommand);
        
        if (!userResponse.Item) {
            return {
                success: false,
                message: "Please create an account first"
            };
        }

        const blogParams = {
            TableName: "blogs",
            Item: {
                blogId,
                author: username,
                createdAt: new Date().toISOString(),
                content,
                plaintext,
                likes: [],
                dislikes: [],
                comments: 0,
                imgIds,
                vidIds,
                ytIds,
                tags
            }
        };

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
        await indexBlog(blogParams.Item)        

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

exports.getHomeBlogs = async (username, options = {}) => {
    if (!username) {
        throw new Error("Username is required");
    }

    const {
        page = 0,
        limit = 5,
        toFetchStats = false
    } = options;

    console.log(`Loading blogs for ${username}, page ${page}, limit ${limit}`);

    let userInterests = [];
    let followingUsers = [];
    let userData = null;

    try {
        const userParams = {
            TableName: "users",
            Key: { username }
        };
        userData = await dynamoDB.send(new GetCommand(userParams));
        
        if (userData.Item) {
            followingUsers = userData.Item.following || [];
            userInterests = userData.Item.interests || userData.Item.tags || [];
        }
    } catch (error) {
        console.error("Error getting user data:", error);
        throw new Error("Error getting user data");
    }

    try {
        let allBlogs = [];
        let stats = null;

        // For page 0, get mix of recent + following + interest-based + stats
        if (page === 0) {
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
            const recentBlogsParams = {
                TableName: "blogs",
                FilterExpression: "createdAt >= :timeAgo AND author <> :username",
                ExpressionAttributeValues: {
                    ":timeAgo": twentyFourHoursAgo.toISOString(),
                    ":username": username
                }
            };
            
            const recentBlogsCommand = new ScanCommand(recentBlogsParams);
            const recentBlogsData = await dynamoDB.send(recentBlogsCommand);
            const recentBlogs = recentBlogsData.Items || [];

            // Get following blogs if user follows anyone
            let followingBlogs = [];
            if (followingUsers.length > 0) {
                const followingBlogsPromises = followingUsers.slice(0, 10).map(async (author) => {
                    const params = {
                        TableName: "blogs",
                        IndexName: "author-index",
                        KeyConditionExpression: "author = :author",
                        ExpressionAttributeValues: { ":author": author },
                        ScanIndexForward: false,
                        Limit: 10
                    };
                    const result = await dynamoDB.send(new QueryCommand(params));
                    return result.Items || [];
                });

                const followingResults = await Promise.all(followingBlogsPromises);
                followingBlogs = followingResults.flat();
            }

            const blogMap = new Map();
            
            // Add recent blogs
            recentBlogs.forEach(blog => {
                if (!blogMap.has(blog.blogId)) {
                    blogMap.set(blog.blogId, { ...blog, source: 'recent' });
                }
            });

            // Add following blogs (these get priority)
            followingBlogs.forEach(blog => {
                if (!blogMap.has(blog.blogId)) {
                    blogMap.set(blog.blogId, { ...blog, source: 'following' });
                }
            });

            allBlogs = Array.from(blogMap.values());

            if (toFetchStats) {
                const [blogCountResult, userCountResult] = await Promise.all([
                    dynamoDB.send(new ScanCommand({
                        TableName: "blogs",
                        Select: "COUNT"
                    })),
                    dynamoDB.send(new ScanCommand({
                        TableName: "users",
                        Select: "COUNT"
                    }))
                ]);

                stats = {
                    blogCount: blogCountResult.Count || 0,
                    userCount: userCountResult.Count || 0
                };
            }
        } else {
            // For subsequent pages, use the new simplified strategy
            allBlogs = await getPersonalizedContent(username, userInterests, page, limit);
        }

        allBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        let paginatedBlogs = allBlogs;
        let hasMore = false;

        if (page === 0) {
            const startIndex = page * limit;
            const endIndex = startIndex + limit;
            paginatedBlogs = allBlogs.slice(startIndex, endIndex);
            hasMore = endIndex < allBlogs.length || allBlogs.length === limit;
        } else {
            hasMore = allBlogs.length === limit;
        }

        const result = {
            blogs: paginatedBlogs,
            hasMore,
            totalCount: paginatedBlogs.length
        };

        if (stats) {
            result.blogCount = stats.blogCount;
            result.userCount = stats.userCount;
        }

        return {
            success: true,
            result
        };

    } catch (err) {
        console.error("Error fetching blogs:", err);
        return {
            success: false,
            message: err.message
        };
    }
};

async function fetchBlogsByIds(blogIds) {
    if (!blogIds || blogIds.length === 0) return [];

    const keys = blogIds.map(id => ({ blogId: id }));

    const params = {
        RequestItems: {
            blogs: {
                Keys: keys
            }
        }
    };

    const result = await dynamoDB.send(new BatchGetCommand(params));
    return result.Responses.blogs || [];
}

async function getBlogsByInterests(username, interests, page, neededCount) {
    try {
        if (!interests || interests.length === 0) return [];

        const queryText = interests.join(", ");
        const embeddingRes = await openAI.embeddings.create({
            model: "text-embedding-3-small",
            input: queryText,
            dimensions: 512
        });

        const userVector = embeddingRes.data[0].embedding;
        
        const fetchCount = (page + 1) * neededCount * 3; 
        
        const pineconeRes = await index.query({
            vector: userVector,
            topK: Math.min(fetchCount, 100),
            includeMetadata: true
        });

        const blogIds = (pineconeRes.matches || [])
            .filter(match => match.metadata && match.metadata.author !== username)
            .map(match => match.metadata.blogId)
            .filter(blogId => !!blogId);

        const startIndex = page * neededCount;
        const paginatedIds = blogIds.slice(startIndex, startIndex + neededCount);
        
        return await fetchBlogsByIds(paginatedIds);

    } catch (error) {
        console.error("Error getting interest-based blogs:", error);
        return [];
    }
}

async function getRandomBlogs(username, page, neededCount) {
    try {
        const params = {
            TableName: "blogs",
            FilterExpression: "author <> :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        };

        const command = new ScanCommand(params);
        const result = await dynamoDB.send(command);
        const allBlogs = result.Items || [];

        const shuffled = allBlogs.sort(() => 0.5 - Math.random());
        const startIndex = page * neededCount;
        
        return shuffled.slice(startIndex, startIndex + neededCount);
    } catch (error) {
        console.error("Error getting random blogs:", error);
        return [];
    }
}

async function getPersonalizedContent(username, userInterests, page, limit) {
    try {
        const interestBlogsPromise = getBlogsByInterests(username, userInterests, page, 3);
        const randomBlogsPromise = getRandomBlogs(username, page, 2);

        const [interestBlogs, randomBlogs] = await Promise.all([
            interestBlogsPromise,
            randomBlogsPromise
        ]);

        const allBlogs = [
            ...interestBlogs.map(blog => ({ ...blog, source: 'interest' })),
            ...randomBlogs.map(blog => ({ ...blog, source: 'random' }))
        ];

        const blogMap = new Map();
        allBlogs.forEach(blog => {
            if (!blogMap.has(blog.blogId)) {
                blogMap.set(blog.blogId, blog);
            }
        });

        const uniqueBlogs = Array.from(blogMap.values());
        
        return uniqueBlogs.slice(0, limit);

    } catch (error) {
        console.error("Error in getPersonalizedContent:", error);
        return [];
    }
}