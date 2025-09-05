import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
})


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


export const userAPI={
    editProfile:async (body)=>{
        const response=await api.put(`/auth/editProfile`,body)
        return response.data
    },
    getProfile:async()=>{
        const response=await api.get('/auth/getProfile')
        return response.data
    },
    getOtherProfile:async(username)=>{
        const response=await api.get(`/auth/getProfileByUsername/${username}`)
        return response?.data
    },
    editTags:async(tagsToAdd,tagsToRemove)=>{
        const response=await api.put('/auth/editTags',{tagsToAdd,tagsToRemove})
        console.log("Res",response);
        return response.data
    }

}