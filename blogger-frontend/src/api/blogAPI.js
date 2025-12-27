
import api from "./config.js";

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/auth/check")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);



export const blogAPI = {
  getBlog: async (id) => {
    const response = await api.get(`/blog/getBlog/${id}`)
    return response.data
  },
  getBlogs: async (author) => {
    const response = await api.get(`/blog/getBlogs/${author}`)
    return response.data
  },
  // getHomeBlogs:async({toFetchStats})=>{
  //     const response=await api.get(`/blog/getHomeBlogs?toFetchStats=${toFetchStats}`)
  //     return response.data
  // },
  // Update your existing getHomeBlogs method to support pagination:

  getHomeBlogs: async (options = {}) => {
    const {
      page = 0,
      limit = 5,
      toFetchStats = false
    } = options;

    const response = await api.get(`/blog/getHomeBlogs`, {
      params: {
        page,
        limit,
        toFetchStats
      }
    });
    return response.data;
  },
  deleteBlog: async (blogId) => {
    const response = await api.delete(`/blog/deleteblog/${blogId}`)
    return response.data
  },
  likeBlog: async (blogId) => {
    const response = await api.put(`/blog/like/${blogId}`)
    return response.data
  },
  dislikeBlog: async (blogId) => {
    const response = await api.put(`/blog/dislike/${blogId}`)
    return response.data
  },
  unlike: async (blogId) => {
    const response = await api.put(`/blog/unlike/${blogId}`)
    return response.data
  },
  undislike: async (blogId) => {
    const response = await api.put(`/blog/undislike/${blogId}`)
    return response.data
  },
  addComment: async (blogId, username, content, parentId) => {
    if (!parentId) {
      parentId = null
    }
    const response = await api.post('/comment/postcomment', { blogId, username, content, parentId })
    return response.data

  },
  getBlogComments: async (blogId) => {
    const response = await api.get(`/comment/getcomments/${blogId}`)
    return response.data
  },
  rewriteSection: async (selectedText, mode) => {
    const response = await api.post('/blog/rewriteSection', { selectedText, mode })
    return response.data
  },
  recommendSimilar: async (blog, userId) => {
    const response = await api.post('/blog/recommendSimilar', { blog, userId })
    return response.data
  }
}