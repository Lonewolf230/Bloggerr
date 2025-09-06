const {CognitoIdentityProviderClient}=require("@aws-sdk/client-cognito-identity-provider")
const {fromEnv}=require("@aws-sdk/credential-providers")
require("dotenv").config()


const client=new CognitoIdentityProviderClient({
    region:process.env.REGION,
    credentials:fromEnv(),
    
})

module.exports=client