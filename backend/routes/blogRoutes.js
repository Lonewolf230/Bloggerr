const express=require('express')
const {createBlog,getBlog,getBlogs,deleteBlog,likeBlog,unlikeBlog,undislikeblog, getHomeBlogs, dislikeBlog, rewriteSection, recommendSimilar}=require('../controllers/blogController')
const {verifyToken,checkBlogOwnership}=require("../middleware/authMiddleware")
const router=express.Router()

router.post('/postblog',verifyToken,createBlog)
router.get('/getblog/:id',verifyToken,getBlog)
router.get('/getblogs/:author',verifyToken,getBlogs)
router.delete('/deleteblog/:id',verifyToken,checkBlogOwnership,deleteBlog)    
router.put('/like/:id',verifyToken,likeBlog)
router.put('/dislike/:id',verifyToken,dislikeBlog)
router.put('/unlike/:id',verifyToken,unlikeBlog)
router.put('/undislike/:id',verifyToken,undislikeblog)
router.get('/getHomeBlogs',verifyToken,getHomeBlogs)
router.post('/rewriteSection',verifyToken,rewriteSection)
router.post('/recommendSimilar',verifyToken,recommendSimilar)

module.exports=router