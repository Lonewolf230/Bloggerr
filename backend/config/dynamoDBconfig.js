const {DynamoDBClient}=require("@aws-sdk/client-dynamodb")
const {DynamoDBDocumentClient}=require("@aws-sdk/lib-dynamodb")
const {fromEnv}=require("@aws-sdk/credential-providers")
require("dotenv").config()

const client=new DynamoDBClient({
    region:process.env.REGION || 'ap-south-1',
    credentials:fromEnv()
})

const docClient=DynamoDBDocumentClient.from(client,{
    marshallOptions:{
        removeUndefinedValues:true
    }
})
module.exports=docClient