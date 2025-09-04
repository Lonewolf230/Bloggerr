const express=require('express')
const {signup,login,verifyUser,logout, deleteUser,getCurrentUser,checkAuth}=require('../controllers/authController')
const {followUser,unfollowUser, editUserProfile, getProfile, getProfileByUsername, editTags}=require('../controllers/userController')
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
router.put('/editTags',verifyToken,editTags)

router.get('/me', verifyToken, getCurrentUser);
router.get("/check", verifyToken, (req, res) => {
  res.json({
    isAuthenticated: true,
    user: { username: req.user.username, email: req.user.email }
  });
});





module.exports=router
