const { BatchGetItemCommand } = require("@aws-sdk/client-dynamodb")
const { marshall,unmarshall } = require("@aws-sdk/util-dynamodb")
const docClient = require("../config/dynamoDBconfig")

exports.fetchRecommendedBlogs = async (blogIds) => {
    const command = new BatchGetItemCommand({
        RequestItems: {
            blogs: {
                Keys: blogIds.map((id) => ({
                    blogId: { S: id }
                }))
            }
        }
    })
    const response = await docClient.send(command)
    console.log(response.Responses?.blogs);
    
    const blogs = response.Responses?.blogs?.map((item) => unmarshall(item)) || [];
    return blogs
}