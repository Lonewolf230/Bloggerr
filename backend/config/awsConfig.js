const {CognitoIdentityProviderClient}=require("@aws-sdk/client-cognito-identity-provider")
const {fromEnv}=require("@aws-sdk/credential-providers")
const { NodeHttpHandler }=require("@aws-sdk/node-http-handler")
require("dotenv").config()


const client=new CognitoIdentityProviderClient({
    region:process.env.REGION,
    credentials:fromEnv(),
    maxAttempts:3,
    requestHandler: new NodeHttpHandler({
        connectionTimeout:5000,
        requestTimeout:8000
    })
})

module.exports=client