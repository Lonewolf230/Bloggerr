const express=require('express')
const {signup,login,verifyUser,logout, deleteUser,getCurrentUser,checkAuth, signupTestUser, deleteTestUser}=require('../controllers/authController')
const {followUser,unfollowUser, editUserProfile, getProfile, getProfileByUsername, editTags}=require('../controllers/userController')
const {verifyToken}=require('../middleware/authMiddleware')
const router=express.Router()
const {ScanCommand}=require('@aws-sdk/client-dynamodb')
const {Upload}=require('@aws-sdk/lib-storage')
const {upload}=require('../middleware/upload')
const docClient=require('../config/dynamoDBconfig')
const {v4:uuidv4}=require("uuid")
const {s3Client}=require('../config/s3Client')

router.post('/signup',signup)
router.post('/login',login)
router.post('/verify',verifyUser)
router.post('/logout',logout)
router.post('/delete',deleteUser)

router.post('/follow/:targetUsername',verifyToken,followUser)
router.post('/unfollow/:targetUsername',verifyToken,unfollowUser)

router.put('/editProfile',verifyToken,editUserProfile)

router.get('/getProfile',verifyToken,getProfile)
router.get('/getProfileByUsername/:username', verifyToken, getProfileByUsername)
router.put('/editTags',verifyToken,editTags)

router.get('/me', verifyToken, getCurrentUser);
router.get("/check", verifyToken, (req, res) => {
  res.json({
    isAuthenticated: true,
    user: { username: req.user.username, email: req.user.email }
  });
});

router.post('/signupTestUser',signupTestUser)
router.delete('/deleteTestUser',deleteTestUser)


const searchRateLimit = new Map();

const rateLimit = (req, res, next) => {
    const userKey = req.user.email;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 30; // 30 requests per minute

    if (!searchRateLimit.has(userKey)) {
        searchRateLimit.set(userKey, { count: 1, resetTime: now + windowMs });
        return next();
    }

    const userLimit = searchRateLimit.get(userKey);
    
    if (now > userLimit.resetTime) {
        searchRateLimit.set(userKey, { count: 1, resetTime: now + windowMs });
        return next();
    }

    if (userLimit.count >= maxRequests) {
        return res.status(429).json({
            success: false,
            message: 'Too many search requests. Please try again later.'
        });
    }

    userLimit.count++;
    next();
};

router.get('/users', verifyToken, rateLimit, async (req, res) => {
    try {
        const { q: searchTerm, limit = 10 } = req.query;
        
        if (!searchTerm || searchTerm.length < 1) {
            return res.json({
                success: true,
                users: []
            });
        }

        if (searchTerm.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Search term too long'
            });
        }

        const command = new ScanCommand({
            TableName: 'users',
            FilterExpression: 'begins_with(username, :searchTerm)',
            ExpressionAttributeValues: {
                ':searchTerm': {S:searchTerm.toLowerCase()}
            },
            Limit: Math.min(parseInt(limit), 20) 
        });

        const response = await docClient.send(command);

        const users = (response.Items || []).map(user => ({
            username: user.username.S,
            profilePic: user.profilePic? user.profilePic.S : null
        }))

        res.json({
            success: true,
            users
        });

    } catch (error) {
        console.error('User search error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Search failed', 
            error: error.message 
        });
    }
});


router.post('/profile-picture', 
    verifyToken, 
    upload.single('profilePic'), 
    async (req, res) => {
        try {
            const { username } = req.body;
            
            if (!username) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Username is required' 
                });
            }

            if (!req.file) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Profile picture file is required' 
                });
            }

            if (req.user.username !== username) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only upload your own profile picture'
                });
            }

            const fileExtension = req.file.originalname.split('.').pop();
            const key = `profilePics/${username}_${Date.now()}.${fileExtension}`;

            const upload = new Upload({
                client: s3Client,
                params: {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: key,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                    Metadata: {
                        uploadedBy: req.user.email,
                        username: username
                    }
                }
            });

            await upload.done();
            
            const profilePicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.REGION}.amazonaws.com/${key}`;
            
            res.json({
                success: true,
                message: 'Profile picture uploaded successfully',
                profilePicUrl
            });

        } catch (error) {
            console.error('Profile picture upload error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Profile picture upload failed', 
                error: error.message 
            });
        }
    }
);

router.post('/blog-media', 
    verifyToken, 
    upload.array('files', 10), 
    async (req, res) => {
        try {
            const { blogId } = req.body;
            
            if (!blogId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Blog ID is required' 
                });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'No files provided' 
                });
            }

            const uploadPromises = req.files.map(async (file, index) => {
                const fileExtension = file.originalname.split('.').pop();
                const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
                const uniqueId = uuidv4();
                const key = `${fileType}s/${blogId}_${uniqueId}_${Date.now()}.${fileExtension}`;

                const upload = new Upload({
                    client: s3Client,
                    params: {
                        Bucket: process.env.AWS_S3_BUCKET,
                        Key: key,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                        Metadata: {
                            uploadedBy: req.user.email,
                            blogId: blogId
                        }
                    }
                });

                await upload.done();
                
                return {
                    originalName: file.originalname,
                    type: fileType,
                    size: file.size,
                    url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.REGION}.amazonaws.com/${key}`
                };
            });

            const uploadResults = await Promise.all(uploadPromises);
            
            res.json({
                success: true,
                message: 'Files uploaded successfully',
                uploads: uploadResults
            });

        } catch (error) {
            console.error('Blog media upload error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Upload failed', 
                error: error.message 
            });
        }
    }
);

module.exports=router
