// import axios from "axios"
// import Cookies from 'js-cookie'
// const api=axios.create({
//     baseURL:import.meta.env.VITE_REACT_APP_API_URL || '/api',
//     withCredentials:true,
//     headers:{
//         'Content-Type':'application/json'
//     }
// })

// api.interceptors.request.use(
//     (config)=>{
//         const token=Cookies.get('accessToken')
//         if(token){
//             config.headers.Authorization=`Bearer ${token}`
//         }
//         return config
//     },
//     (error)=>Promise.reject(error)
// )

// api.interceptors.response.use(
//     (response)=>response,
//     async(error)=>{
//         const originalRequest=error.config

//         if(error.response.status === 401 && !originalRequest._retry){
//             originalRequest._retry=true
//             try{
//                 Cookies.remove('accessToken')
//                 Cookies.remove('refreshToken')
//                 window.location.href='/'
//             }
//             catch(refreshError){
//             }
//             return Promise.reject(error)
//         }
//     }
// )

import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL || '/api',
    withCredentials: true, // This ensures cookies are sent with requests
    headers: {
        'Content-Type': 'application/json'
    }
})

// No need for request interceptor since cookies are handled automatically
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response && error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
            
//             // Redirect to login page on authentication failure
//             window.location.href = '/';
//             return Promise.reject(error);
//         }
//         return Promise.reject(error);
//     }
// );

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip redirect for checkAuth to avoid loops
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