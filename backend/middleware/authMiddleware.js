const jwt = require('jsonwebtoken');
const axios=require('axios')
const jwkToPem=require('jwk-to-pem')
const blogModel=require('../models/blogModel')
require('dotenv').config()

let jwks=null
const region=process.env.REGION
const userPoolId=process.env.USER_POOL_ID

const getJwks=async ()=>{
    if(jwks) return jwks

    try{
        const url=`https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
        const response=await axios.get(url)
        jwks=response.data.keys
        return jwks
    }
    catch(err){
        console.error("Error fetching jwks:",err)
    }
}

// exports.verifyToken = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) {
//             return res.status(401).json({ error: "No token provided" });
//         }

//         // Decode token to get kid
//         const decodedToken = jwt.decode(token, { complete: true });
//         if (!decodedToken) {
//             return res.status(401).json({ error: "Invalid token format" });
//         }

//         const { kid } = decodedToken.header;
//         const jwks = await getJwks();
//         const jwk = jwks.find(key => key.kid === kid);
        
//         if (!jwk) {
//             return res.status(401).json({ error: "Invalid token - Key not found" });
//         }
//         const pem = jwkToPem(jwk);
//         // Verify token and check if the token's username matches the requested author
//         jwt.verify(token, pem, { algorithms: ['RS256'] }, (err, decoded) => {
//             if (err) {
//                 return res.status(401).json({ error: "Invalid token" });
//             }
//             // Get the username from the token
//             const tokenUsername = decoded.username || decoded['cognito:username'];
//             // Get the requested author from params
//             const requestedAuthor = req.params.author;
//             // Check if the token username matches the requested author
//             if (tokenUsername !== requestedAuthor) {
//                 return res.status(403).json({ 
//                     error: "Unauthorized - You can only access your own blogs" 
//                 });
//             }
//             req.user = decoded;
//             next();
//         });
//     } catch (error) {
//         console.error('Token verification error:', error);
//         return res.status(401).json({ error: "Token verification failed" });
//     }
// };


exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decodedToken = jwt.decode(token, { complete: true });
        if (!decodedToken) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        const { kid } = decodedToken.header;
        const jwks = await getJwks();
        const jwk = jwks.find(key => key.kid === kid);
        
        if (!jwk) {
            return res.status(401).json({ error: "Invalid token - Key not found" });
        }

        const pem = jwkToPem(jwk);

        jwt.verify(token, pem, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid token" });
            }

            // Normalize username (remove @domain.com if present)
            const tokenUsername = decoded.username || decoded['cognito:username'];
            req.user = {
                ...decoded,
                username: tokenUsername.includes('@') ? tokenUsername.split('@')[0] : tokenUsername
            };
            
            next();
        });
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: "Token verification failed" });
    }
};

// Ownership check middleware
exports.checkBlogOwnership = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const blogResult = await blogModel.getBlog(blogId);
        
        if (!blogResult.success || !blogResult.blog) {
            return res.status(404).json({
                message: "Blog not found",
                error: "Blog does not exist"
            });
        }

        if (blogResult.blog.author !== req.user.username) {
            return res.status(403).json({
                message: "Unauthorized",
                error: "You can only modify your own blogs"
            });
        }

        req.blog = blogResult.blog;
        next();
    } catch (err) {
        return res.status(500).json({
            message: "Authorization check failed",
            error: err.message
        });
    }
};

