const {DescribeTableCommand}=require("@aws-sdk/client-dynamodb")
const {UpdateCommand,GetCommand}=require("@aws-sdk/lib-dynamodb")
const {DescribeUserPoolCommand}=require("@aws-sdk/client-cognito-identity-provider")
const dynamoDB=require('../config/dynamoDBconfig')
const client=require('../config/awsConfig.js')
require('dotenv').config()
exports.getHomeStats=async()=>{
    try {
        const blogResult=await dynamoDB.send(new DescribeTableCommand({
                TableName:"blogs",
        }))
        const userResult=await client.send(new DescribeUserPoolCommand({
            UserPoolId:process.env.USER_POOL_ID
        }))

        const userCount=userResult.UserPool.EstimatedNumberOfUsers
        const blogCount=blogResult.Table.ItemCount
        console.log(userCount,blogCount)
        return {userCount,blogCount}
    } catch (error) {
        console.error("Error generating stats: ",error)
        throw error;   
    }
}

exports.setFirstTime=async(username)=>{
    try {
        console.log("Setting firstTime to false")
        await dynamoDB.send(new UpdateCommand({
            TableName:"users",
            Key:{username},
            UpdateExpression:"SET firstTime = :val",
            ExpressionAttributeValues:{
                ":val":false
            }
        }))
    } catch (error) {
        console.log("Error setting firstTime to false",error)
        throw error
    }
}

exports.getFirstTime=async (username)=>{
    try {
        const res=await dynamoDB.send(new GetCommand({
            TableName:"users",
            Key:{username},
            ProjectionExpression:"firstTime"
        }))
        console.log("First Time",res);
        
        return res.Item?.firstTime ?? true;
    } catch (error) {
        console.error("Error retrieving firstTime:",error)
        throw error;
    }
}