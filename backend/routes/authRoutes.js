const express=require('express')
const {signup,login,verifyUser,logout, deleteUser}=require('../controllers/authController')
const {followUser,unfollowUser, editUserProfile, getProfile, getProfileByUsername}=require('../controllers/userController')
const {verifyToken}=require('../middleware/authMiddleware')
const router=express.Router()

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

module.exports=router