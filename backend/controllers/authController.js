// const {SignUpCommand,InitiateAuthCommand,
//         ConfirmSignUpCommand,GlobalSignOutCommand,
//         DeleteUserCommand
// }=require("@aws-sdk/client-cognito-identity-provider")
// const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");

// const dynamoDB=require('../config/dynamoDBconfig')
// const cognito=require('../config/awsConfig')
// const userModel=require('../models/userModel')
// const misc=require('../models/misc.js')
// require('dotenv').config()

// exports.signup=async (req,res)=>{
//     const {email,password}=req.body

//     const params={
//         ClientId:process.env.CLIENT_ID,
//         Username:email.split('@')[0],
//         Password:password,
//         UserAttributes:[
//             {
//                 Name:"email",
//                 Value:email
//             }
//         ]
//     }
//     try{
//         const command=new SignUpCommand(params)
//         const data=await cognito.send(command)
//         try{
//             await userModel.createUser(email.split('@')[0])
//             res.status(200).json({message:"User created successfully",data})
//         }
//         catch(err){
//             console.error("Dynamo DB creation error",err)
//         }
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).json({message:"User creation failed",error:err.message})
//     }
// }

// exports.login=async (req,res)=>{
//     const {email,password}=req.body

//     const params={
//         AuthFlow:"USER_PASSWORD_AUTH",
//         ClientId:process.env.CLIENT_ID,
//         AuthParameters:{
//             USERNAME:email,
//             PASSWORD:password
//         }
//     }
//     try{
//         const command=new InitiateAuthCommand(params)
//         const data=await cognito.send(command)
//         const firstTime=await misc.getFirstTime(email.split("@")[0])
//         if(firstTime) await misc.setFirstTime(email.split("@")[0])
//         console.log("Data",data)
//         console.log("First Time:",firstTime)
//         res.status(200).json({token:data.AuthenticationResult,firstTime})
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).json({message:"Login failed",error:err.message})
//     }
// }

// exports.verifyUser=async (req,res)=>{
//     const {email,code}=req.body
//     const params={
//         ClientId:process.env.CLIENT_ID,
//         Username:email.split('@')[0],
//         ConfirmationCode:code
//     }

//     try{
//         const username=email.split('@')[0]
//         const command=new ConfirmSignUpCommand(params)
//         const updateCommand=new UpdateCommand({
//             TableName:"users",
//             Key:{
//                 username
//             },
//             UpdateExpression:"set verified = :verifyStatus",
//             ExpressionAttributeValues:{
//                 ":verifyStatus":true
//             }
//         })
//         await cognito.send(command)
//         await dynamoDB.send(updateCommand)
//         res.status(200).json({message:"User verified Successfully"})
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).json({message:"User unverified",error:err.message})
//     }
// }

// exports.logout = async (req, res) => {
//     const accessToken = (req.body && req.body.accessToken) || 
//                        (req.cookies && req.cookies.accessToken) ||
//                        (req.headers.authorization && req.headers.authorization.split(' ')[1]);

//     if (!accessToken) {
//         return res.status(400).json({ message: "No access token provided" });
//     }

//     const params = {
//         AccessToken: accessToken
//     };

//     try {
//         const command = new GlobalSignOutCommand(params);
//         await cognito.send(command);

//         // Clear cookies on server side too
//         res.clearCookie('accessToken');
//         res.clearCookie('refreshToken');
//         res.clearCookie('idToken');

//         res.status(200).json({ message: "Logged Out successfully" });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: "Logout Failed", error: err.message });
//     }
// };

// exports.deleteUser=async (req,res)=>{
//     const {accessToken}=req.body
//     const params={
//         AccessToken:accessToken
//     }
//     try{
//         const command=new DeleteUserCommand(params)
//         await cognito.send(command)
//         res.status(200).json({message:"User deleted successfully"})
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).json({message:"User deletion failed",error:err.message})
//     }
// }

const { SignUpCommand, InitiateAuthCommand,
    ConfirmSignUpCommand, GlobalSignOutCommand,
    DeleteUserCommand
} = require("@aws-sdk/client-cognito-identity-provider")
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const dynamoDB = require('../config/dynamoDBconfig')
const cognito = require('../config/awsConfig')
const userModel = require('../models/userModel')
const misc = require('../models/misc.js')
require('dotenv').config()

exports.signup = async (req, res) => {
    const { email, password } = req.body

    const params = {
        ClientId: process.env.CLIENT_ID,
        Username: email.split('@')[0],
        Password: password,
        UserAttributes: [
            {
                Name: "email",
                Value: email
            }
        ]
    }
    try {
        const command = new SignUpCommand(params)
        const data = await cognito.send(command)
        try {
            await userModel.createUser(email.split('@')[0])
            res.status(200).json({ message: "User created successfully", data })
        }
        catch (err) {
            console.error("Dynamo DB creation error", err)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "User creation failed", error: err.message })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    const params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.CLIENT_ID,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    }
    try {
        const command = new InitiateAuthCommand(params)
        const data = await cognito.send(command)
        const firstTime = await misc.getFirstTime(email.split("@")[0])
        if (firstTime) await misc.setFirstTime(email.split("@")[0])
        const isProduction = process.env.NODE_ENV === 'production';
        console.log("Is Production:", isProduction);

        res.cookie('accessToken', data.AuthenticationResult.AccessToken, {
            httpOnly: true,
            secure: isProduction,                        
            sameSite: isProduction ? "none" : "lax",     // none for cross-site prod, lax for local dev
            domain: isProduction ? ".yourdomain.com" : "localhost",
            maxAge: data.AuthenticationResult.ExpiresIn * 1000  
        });

        res.cookie('refreshToken', data.AuthenticationResult.RefreshToken, {
            httpOnly: true,
            secure: isProduction,                        
            sameSite: isProduction ? "none" : "lax",     // none for cross-site prod, lax for local dev
            domain: isProduction ? ".yourdomain.com" : "localhost",
            maxAge: 3 * 24 * 60 * 60 * 1000             // 30 days
        });

        res.cookie('idToken', data.AuthenticationResult.IdToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",     // none for cross-site prod, lax for local dev
            domain: isProduction ? ".yourdomain.com" : "localhost",
            maxAge: data.AuthenticationResult.ExpiresIn * 1000
        });

        console.log("Data", data)
        console.log("First Time:", firstTime)
        res.status(200).json({
            message: "Login successful",
            user: {
                username: email.split('@')[0],
                email: email,
                firstTime: firstTime
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Login failed", error: err.message })
    }
}

exports.verifyUser = async (req, res) => {
    const { email, code } = req.body
    const params = {
        ClientId: process.env.CLIENT_ID,
        Username: email.split('@')[0],
        ConfirmationCode: code
    }

    try {
        const username = email.split('@')[0]
        const command = new ConfirmSignUpCommand(params)
        const updateCommand = new UpdateCommand({
            TableName: "users",
            Key: {
                username
            },
            UpdateExpression: "set verified = :verifyStatus",
            ExpressionAttributeValues: {
                ":verifyStatus": true
            }
        })
        await cognito.send(command)
        await dynamoDB.send(updateCommand)
        res.status(200).json({ message: "User verified Successfully" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "User unverified", error: err.message })
    }
}

exports.logout = async (req, res) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(400).json({ message: "No access token found" });
    }

    const params = {
        AccessToken: accessToken
    };

    try {
        const command = new GlobalSignOutCommand(params);
        await cognito.send(command);

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.clearCookie('idToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ message: "Logged Out successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Logout Failed", error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({ message: "No access token found" });
    }

    const params = {
        AccessToken: accessToken
    }
    try {
        const command = new DeleteUserCommand(params)
        await cognito.send(command)

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.clearCookie('idToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ message: "User deleted successfully" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "User deletion failed", error: err.message })
    }
}

exports.getCurrentUser = async (req, res) => {
    const idToken = req.cookies.idToken;

    if (!idToken) {
        return res.status(401).json({ message: "No authentication found" });
    }

    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(idToken);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        if (decoded.exp * 1000 < Date.now()) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.clearCookie('idToken');
            return res.status(401).json({ message: "Token expired" });
        }

        const username = decoded['cognito:username'] || decoded.username;
        const email = decoded.email;

        const firstTime = await misc.getFirstTime(username);

        res.status(200).json({
            user: {
                username: username,
                email: email,
                firstTime: firstTime
            }
        });
    } catch (error) {
        console.error("Get current user error:", error);
        res.status(401).json({ message: "Authentication failed" });
    }
}

exports.checkAuth = async (req, res) => {
    const idToken = req.cookies.idToken;

    if (!idToken) {
        return res.status(401).json({ isAuthenticated: false });
    }

    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(idToken);

        if (!decoded || decoded.exp * 1000 < Date.now()) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.clearCookie('idToken');
            return res.status(401).json({ isAuthenticated: false });
        }

        const username = decoded['cognito:username'] || decoded.username;
        const email = decoded.email;

        res.status(200).json({
            isAuthenticated: true,
            user: {
                username: username,
                email: email
            }
        });
    } catch (error) {
        console.error("Check auth error:", error);
        res.status(401).json({ isAuthenticated: false });
    }
}