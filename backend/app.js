require('dotenv').config()
const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const bodyParser=require('body-parser')
const authRoutes=require('./routes/authRoutes')
const blogRoutes=require('./routes/blogRoutes')
const commentRoutes=require('./routes/commentRoutes')

const app=express()

app.use(cors({
    origin:process.env.REACT_URL || 'http://localhost:5173',
    credentials:true,
    
}))
app.set('trust proxy',true) 
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api/auth',authRoutes)
app.use('/api/blog',blogRoutes)
app.use('/api/comment',commentRoutes)
const PORT=process.env.PORT || 8080;

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`Server running on port ${PORT}`)
})