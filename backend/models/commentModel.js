const { v4: uuidv4 } = require("uuid");
const { PutCommand, UpdateCommand, GetCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDB = require('../config/dynamoDBconfig');

exports.createComment = async (blogId,username,content, parentId = null) => {
    try {
        // Check if blog exists
        const getBlogCommand = new GetCommand({
            TableName: "blogs",
            Key: { blogId }
        });

        const blogResponse = await dynamoDB.send(getBlogCommand);
        
        if (!blogResponse.Item) {
            return {
                success: false,
                message: "Blog not found"
            };
        }

        if(parentId){
            const getParentCommentCommand=new GetCommand({
                TableName:"comments",
                Key:{commentId:parentId}
            })
            try {
                const parentCommentResponse = await dynamoDB.send(getParentCommentCommand);
                if (!parentCommentResponse.Item) {
                    return{
                        success: false,
                        message: "Parent comment not found"
                    };
                }
            } catch (err) {
                console.error("Error checking parent comment:", err);
                return {
                    success: false,
                    message: "Error checking parent comment"
                };
            }
        }



        const commentId = uuidv4();
        const commentParams = {
            TableName: "comments",
            Item: {
                commentId,
                blogId,
                author: username,
                content,
                timestamp: new Date().toISOString(),
                parentId:parentId || null
            }
        };

        // Update blog's comment count
        const updateBlogParams = {
            TableName: "blogs",
            Key: { blogId },
            UpdateExpression: "SET comments = if_not_exists(comments, :zero) + :inc",
            ExpressionAttributeValues: {
                ":inc": 1,
                ":zero": 0
            }
        };

        await dynamoDB.send(new PutCommand(commentParams));
        await dynamoDB.send(new UpdateCommand(updateBlogParams));

        return {
            success: true,
            message: "Comment created successfully",
            comment: commentParams.Item
        };

    } catch (err) {
        console.error("Error creating comment:", err);
        return {
            success: false,
            message: err.message
        };
    }
};

exports.getCommentsByBlogId = async (blogId) => {
    const params = {
        TableName: "comments",
        IndexName: "blogId-index",
        KeyConditionExpression: "blogId = :blogId",
        ExpressionAttributeValues: {
            ":blogId": blogId
        }
    };

    try {
        const command = new QueryCommand(params);
        const result = await dynamoDB.send(command);
        return {
            success: true,
            comments: result.Items || []
        };
    } catch (err) {
        console.error("Error getting comments:", err);
        return {
            success: false,
            message: err.message
        };
    }
};

exports.getComment = async (commentId) => {
    const params = {
        TableName: "comments",
        Key: { commentId }
    };

    try {
        const command = new GetCommand(params);
        const result = await dynamoDB.send(command);
        
        if (!result.Item) {
            return {
                success: false,
                message: "Comment not found"
            };
        }

        return {
            success: true,
            comment: result.Item
        };
    } catch (err) {
        console.error("Error getting comment:", err);
        return {
            success: false,
            message: err.message
        };
    }
};