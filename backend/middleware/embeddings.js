const pinecone=require('@pinecone-database/pinecone')
const openai=require('openai')

const openAI= new openai.OpenAI({
    apiKey:process.env.OPEN_AI_KEY
})
const pc=new pinecone.Pinecone({
    apiKey:process.env.PINECONE_API_KEY
})
const index=pc.Index('blogs')

exports.indexBlog=async(blog)=>{
    const embedding= await openAI.embeddings.create({
        model:"text-embedding-3-small",
        input:blog.plaintext,
        dimensions:512,

    })

    await index.upsert([
        {
            id:blog.blogId,
            values:embedding.data[0].embedding,
            metadata:{
                blogId:blog.blogId,
                author:blog.author,
                tags:blog.tags,
                createdAt:blog.createdAt
            }
        }
    ])
}

exports.recommendSimilar=async(currentBlog,userId,topK=3)=>{

    const inputText=`${currentBlog.plaintext}+\n+\n+Tags:${currentBlog.tags.join(", ")}`
    const embedding=await openAI.embeddings.create({
        model:"text-embedding-3-small",
        input:inputText,
        dimensions:512
    })
    const vector=embedding.data[0].embedding

    const result=await index.query({
        vector,
        topK,
        includeMetadata:true,
        filter:{
            blogId:{$ne:currentBlog.blogId},
            author:{$ne:userId}
        }
    })
    console.log(result.matches.map((match)=>({
        id:match.id,
        score:match.score,
        ...match.metadata
    })));
    
    return result.matches.map((match)=>(match.id))
}


