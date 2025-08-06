import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header dynamically
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const blogAPI={
    getBlog:async(id)=>{
        const response=await api.get(`/blog/getBlog/${id}`)
        return response.data
    },
    getBlogs:async(author)=>{
        const response=await api.get(`/blog/getBlogs/${author}`)
        return response.data
    },
    getHomeBlogs:async({toFetchStats})=>{
        const response=await api.get(`/blog/getHomeBlogs?toFetchStats=${toFetchStats}`)
        return response.data
    },
    deleteBlog:async(blogId)=>{
      const response=await api.delete(`/blog/deleteblog/${blogId}`)
      return response.data
    },
    likeBlog:async(blogId)=>{
      const response=await api.put(`/blog/like/${blogId}`)
      return response.data
    },
    dislikeBlog:async(blogId)=>{
      const response=await api.put(`/blog/dislike/${blogId}`)
      return response.data
    },
    unlike:async(blogId)=>{
      const response=await api.put(`/blog/unlike/${blogId}`)
      return response.data
    },
    undislike:async(blogId)=>{
      const response=await api.put(`/blog/undislike/${blogId}`)
      return response.data
    },
    addComment:async(blogId,username,content,parentId)=>{
      if(!parentId){
        parentId=null
      }
      const response=await api.post('/comment/postcomment',{blogId,username,content,parentId})
      return response.data       
      
    },
    getBlogComments:async(blogId)=>{
      const response=await api.get(`/comment/getcomments/${blogId}`)
      return response.data
    }
}