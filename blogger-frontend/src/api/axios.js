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
//   (response) => response,
//   async (error) => {
//       const originalRequest = error.config;

//       if (error.response && error.response.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;
//           try {
//               Cookies.remove('accessToken');
//               Cookies.remove('refreshToken');
//               Cookies.remove('idToken');
              
//               window.location.href = '/';
//               return Promise.reject(error);
//           } catch (refreshError) {
//               return Promise.reject(refreshError);
//           }
//       }
//       return Promise.reject(error);
//   }
// );

// export const authAPI = {
//     signup: async (email, password) => {
//       const response = await api.post('/auth/signup', { email, password });
//       return response.data;
//     },
    
//     verify: async (email, code) => {
//       const response = await api.post('/auth/verify', { email, code });
//       return response.data;
//     },
    
//     login: async (email, password) => {
//       const response = await api.post('/auth/login', { email, password });
      
//       if (response.data.token) {
//         const { IdToken, AccessToken, RefreshToken, ExpiresIn } = response.data.token;
        
//         Cookies.set('accessToken', AccessToken, { expires: ExpiresIn / 86400, }); 
//         Cookies.set('refreshToken', RefreshToken, { expires: 30 });
//         Cookies.set('idToken', IdToken, { expires: ExpiresIn / 86400 });
//       }
      
//       return response.data;
//     },
    
//     logout: async () => {
//       const accessToken = Cookies.get('accessToken');
//       const response = await api.post('/auth/logout', { accessToken });
      
//       Cookies.remove('accessToken');
//       Cookies.remove('refreshToken');
//       Cookies.remove('idToken');
      
//       return response.data;
//     },
    
//     deleteAccount: async () => {
//       const accessToken = Cookies.get('accessToken');
//       const response = await api.post('/auth/delete', { accessToken });
      
//       Cookies.remove('accessToken');
//       Cookies.remove('refreshToken');
//       Cookies.remove('idToken');
      
//       return response.data;
//     },
    
//     isAuthenticated: () => {
//       return !!Cookies.get('accessToken');
//     }
//   };
  
//   export const followAPI = {
//     followUser: async (targetUsername) => {
//       const response = await api.post(`/auth/follow/${targetUsername}`);
//       return response.data;
//     },
    
//     unfollowUser: async (targetUsername) => {
//       const response = await api.post(`/auth/unfollow/${targetUsername}`);
//       return response.data;
//     },
    
//   };


// export default api

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


export const authAPI = {
    signup: async (email, password) => {
        const response = await api.post('/auth/signup', { email, password });
        return response.data;
    },

    verify: async (email, code) => {
        const response = await api.post('/auth/verify', { email, code });
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    deleteAccount: async () => {
        const response = await api.post('/auth/delete');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    checkAuth: async () => {
        const response = await api.get('/auth/check');
        return response.data;
    }
};

export const followAPI = {
    followUser: async (targetUsername) => {
        const response = await api.post(`/auth/follow/${targetUsername}`);
        return response.data;
    },

    unfollowUser: async (targetUsername) => {
        const response = await api.post(`/auth/unfollow/${targetUsername}`);
        return response.data;
    },
};

export default api