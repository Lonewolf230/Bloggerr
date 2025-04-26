const {createComment,getCommentsByBlogId,getComment}=require('../controllers/commentController')
const {verifyToken}=require('../middleware/authMiddleware')
const express=require("express")

const router=express.Router()

router.post('/postcomment',verifyToken,createComment)
router.get('/getcomments/:blogId',verifyToken,getCommentsByBlogId)
router.get('/getcomment/:commentId',verifyToken,getComment)


module.exports=router