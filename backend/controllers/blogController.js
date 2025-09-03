const { fetchRecommendedBlogs } = require('../middleware/bulkFetch')
const { recommendSimilar } = require('../middleware/embeddings')
const blogModel = require('../models/blogModel')
const misc = require('../models/misc')
const openai = require('openai')
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
    const username = req.user.username
    const toFetch = String(req.body.toFetchStats).toLowerCase() === 'true';

    try {
        console.log("to fetch: ", toFetch)
        const result = await blogModel.getHomeblogs(username)
        if (toFetch) {
            const { userCount, blogCount } = await misc.getHomeStats()
            result.userCount = userCount
            result.blogCount = blogCount
        }
        if (result.success === false) {
            return res.status(500).json({ message: "Home Blogs retrieval failed", error: result.message })
        }
        return res.status(200).json({ message: "Home Blogs retrieved successfully:", result })
    }
    catch (err) {
        return res.status(500).json({ message: "Home Blogs retrieval failed", error: err.message })
    }
}

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
        const openAI = new openai.OpenAI({
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


// exports.rewriteSection=async(req,res)=>{
//     const sectionBody=req.body.selectedText
//     const mode=req.body.mode
//     try {
//         // const openAI=new openai.OpenAI({
//         //     apiKey:process.env.OPEN_AI_KEY
//         // })
//         // const chatCompletion=await openAI.chat.completions.create({
//         //     messages:[{role:"user", content:` Rewrite the following section of a blog in ${mode} manner while maintaining the overall meaning. Also make sure the markdown syntax is maintained. The content: ${sectionBody}`}],
//         //     model:"gpt-3.5-turbo"
//         // })
//         console.log(sectionBody);
        
//         const content='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
//         res.status(200).json({message:"Section rewritten successfully", result:content})
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message:"Section rewriting failed", error:error.message})
//     }
// }

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