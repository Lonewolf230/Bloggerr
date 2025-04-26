const {SignUpCommand,InitiateAuthCommand,
        ConfirmSignUpCommand,GlobalSignOutCommand,
        DeleteUserCommand
}=require("@aws-sdk/client-cognito-identity-provider")

const cognito=require('../config/awsConfig')
const userModel=require('../models/userModel')
require('dotenv').config()

exports.signup=async (req,res)=>{
    const {email,password}=req.body

    const params={
        ClientId:process.env.CLIENT_ID,
        Username:email.split('@')[0],
        Password:password,
        UserAttributes:[
            {
                Name:"email",
                Value:email
            }
        ]
    }
    try{
        const command=new SignUpCommand(params)
        const data=await cognito.send(command)
        try{
            await userModel.createUser(email.split('@')[0])
            res.status(200).json({message:"User created successfully",data})
        }
        catch(err){
            console.error("Dynamo DB creation error",err)
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"User creation failed",error:err.message})
    }
}

exports.login=async (req,res)=>{
    const {email,password}=req.body

    const params={
        AuthFlow:"USER_PASSWORD_AUTH",
        ClientId:process.env.CLIENT_ID,
        AuthParameters:{
            USERNAME:email,
            PASSWORD:password
        }
    }
    try{
        const command=new InitiateAuthCommand(params)
        const data=await cognito.send(command)
        res.status(200).json({token:data.AuthenticationResult})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Login failed",error:err.message})
    }
}

exports.verifyUser=async (req,res)=>{
    const {email,code}=req.body
    const params={
        ClientId:process.env.CLIENT_ID,
        Username:email.split('@')[0],
        ConfirmationCode:code
    }
    try{
        const command=new ConfirmSignUpCommand(params)
        await cognito.send(command)
        res.status(200).json({message:"User verified Successfully"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"User unverified",error:err.message})
    }
}

exports.logout = async (req, res) => {
    // Fixed the syntax error in your token extraction
    const accessToken = (req.body && req.body.accessToken) || 
                       (req.cookies && req.cookies.accessToken) ||
                       (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!accessToken) {
        return res.status(400).json({ message: "No access token provided" });
    }
    
    const params = {
        AccessToken: accessToken
    };
    
    try {
        const command = new GlobalSignOutCommand(params);
        await cognito.send(command);
        
        // Clear cookies on server side too
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('idToken');
        
        res.status(200).json({ message: "Logged Out successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Logout Failed", error: err.message });
    }
};

exports.deleteUser=async (req,res)=>{
    const {accessToken}=req.body
    const params={
        AccessToken:accessToken
    }
    try{
        const command=new DeleteUserCommand(params)
        await cognito.send(command)
        res.status(200).json({message:"User deleted successfully"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"User deletion failed",error:err.message})
    }
}