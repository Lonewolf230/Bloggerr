const { fetchRecommendedBlogs } = require('../middleware/bulkFetch')
const { recommendSimilar } = require('../middleware/embeddings')
const blogModel = require('../models/blogModel')
const misc = require('../models/misc')
const OpenAI = require('openai')
exports.createBlog = async (req, res) => {
    const { blogId, email, content,plaintext, imgIds, vidIds, ytIds ,tags} = req.body
    try {
        const result = await blogModel.createBlog(blogId, email.split('@')[0], content,plaintext, imgIds, vidIds, ytIds,tags)
        if (result.success === false) {
            return res.status(500).json({ message: "Blog creation failed", error: result.message })
        }
        return res.status(200).json({ message: "Blog created successfully:", result })
    }
    catch (err) {
        return res.status(500).json({ message: "Blog creation failed", error: err.message })
    }
}

exports.getBlog = async (req, res) => {

    const blogId = req.params.id
    try {
        const result = await blogModel.getBlog(blogId)
        if (result.success === false) {
            return res.status(500).json({ message: "Blog retrieval failed", error: result.message })
        }
        return res.status(200).json({ message: "Blog retrieved successfully:", result })

    }
    catch (err) {
        return res.status(500).json({ message: "Blog retrieval failed", error: err.message })
    }
}

exports.getBlogs = async (req, res) => {
    const author = req.params.author
    console.log("Author: ", author);

    try {
        const result = await blogModel.getBlogs(author)
        if (result.success === false) {
            return res.status(500).json({ message: "Blogs retrieval failed", error: result.message })
        }
        return res.status(200).json({ message: "Blogs retrieved successfully:", result })

    }
    catch (err) {
        return res.status(500).json({ message: "Blogs retrieval failed", error: err.message })
    }
}


exports.getHomeBlogs = async (req, res) => {
    const username = req.user.username;
    
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const toFetch = String(req.query.toFetchStats).toLowerCase() === 'true';

    try {
        console.log(`Getting home blogs for ${username}, page: ${page}, limit: ${limit}, toFetch: ${toFetch}`);
        
        const result = await blogModel.getHomeBlogs(username, {
            page,
            limit,
            toFetchStats: toFetch
        });

        console.log("Result from model:", result);
        console.log(result.result.blogs.length)
        result.result.blogs.forEach(blog => {
            console.log(`Blog ID: ${blog.blogId}`);
        })
        
        if (result.success === false) {
            return res.status(500).json({ 
                message: "Home Blogs retrieval failed",
                success: false, 
                error: result.message 
            });
        }

        return res.status(200).json({ 
            message: "Home Blogs retrieved successfully", 
            success: true,
            result: result.result 
        });
    } catch (err) {
        console.error("Error in getHomeBlogs controller:", err);
        return res.status(500).json({ 
            success: false,
            message: "Home Blogs retrieval failed", 
            error: err.message 
        });
    }
};

exports.deleteBlog = async (req, res) => {
    const blogId = req.params.id
    try {
        const result = await blogModel.deleteBlog(blogId)
        if (result.success === false) {
            return res.status(500).json({ message: "Blog deletion failed", error: result.message })
        }
        return res.status(200).json({ message: "Blog deleted successfully:", result })

    }
    catch (err) {
        return res.status(500).json({ message: "Blog deletion failed", error: err.message })
    }
}

exports.likeBlog = async (req, res) => {
    const id = req.params.id
    const username = req.user.username
    try {
        const result = await blogModel.like(id, username)
        if (!result.success) {
            return res.status(400).json({
                message: "Blog liking failed",
                error: result.message
            })
        }

        return res.status(200).json({
            message: "Blog liked successfully",
            result
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Unexpected error in liking blog",
            error: err.message
        })
    }
}

exports.unlikeBlog = async (req, res) => {
    const id = req.params.id
    const username = req.user.username
    try {
        const result = await blogModel.unlike(id, username)
        if (!result.success) {
            return res.status(400).json({
                message: "Blog unlike failed",
                error: result.message
            })
        }
        return res.status(200).json({
            message: "Blog unliked successfully",
            result
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Unexpected error in unliking blog",
            error: err.message
        })
    }
}

exports.dislikeBlog = async (req, res) => {
    const id = req.params.id;
    const username = req.user.username;
    try {
        const result = await blogModel.dislike(id, username);


        if (!result.success) {
            return res.status(400).json({
                message: "Blog unlike failed",
                error: result.message
            });
        }

        return res.status(200).json({
            message: "Blog disliked successfully",
            result
        });
    } catch (err) {
        return res.status(500).json({
            message: "Unexpected error in disliking blog",

            error: err.message
        });
    }
};

exports.undislikeblog = async (req, res) => {
    const id = req.params.id;
    const username = req.user.username;
    try {
        const result = await blogModel.undislike(id, username);

        if (!result.success) {
            return res.status(400).json({
                message: "Blog undislike failed",
                error: result.message
            });
        }

        return res.status(200).json({
            message: "Blog undisliked successfully",
            result
        });
    } catch (err) {
        return res.status(500).json({
            message: "Unexpected error in undisliking blog",
            error: err.message
        });
    }
}

exports.rewriteSection = async (req, res) => {
    const sectionBody = req.body.selectedText;
    const mode = req.body.mode;
    try {
        const openAI = new OpenAI({
            apiKey: process.env.OPEN_AI_KEY,
        });

        const chatCompletion = await openAI.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a rewriting assistant. Rewrite text in the requested tone while keeping all facts, places, links, and details intact. Do not omit or invent info."
                },
                {
                    role: "user",
                    content: `Tone: ${mode}\n\nHere is the section to rewrite:\n\n${sectionBody}`
                }
            ]
        });


        const markdownResult = chatCompletion.choices[0].message.content;

        res.status(200).json({
            message: "Section rewritten successfully",
            result: markdownResult,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Section rewriting failed",
            error: error.message,
        });
    }
};

exports.recommendSimilar=async(req,res)=>{
    const blog=req.body.blog;
    const userId=req.body.userId
    try {
        console.log(blog);
        
        const blogIds=await recommendSimilar(blog,userId)
        console.log(blogIds)
        const blogs=await fetchRecommendedBlogs(blogIds)
        return res.status(200).json({message:"Similar blogs fetched", result:blogs})
    } catch (error) {
        return res.status(500).json({message:"Similar blogs fetching failed", error:error.message})
    }
}