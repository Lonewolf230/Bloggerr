const {CognitoIdentityProviderClient}=require("@aws-sdk/client-cognito-identity-provider")
const {fromEnv}=require("@aws-sdk/credential-providers")
const { NodeHttpHandler }=require("@aws-sdk/node-http-handler")
require("dotenv").config()


const client=new CognitoIdentityProviderClient({
    region:process.env.REGION,
    credentials:fromEnv(),
    maxAttempts:3,
    requestHandler: new NodeHttpHandler({
        connectionTimeout:50000,
        requestTimeout:50000
    })
})

module.exports=client