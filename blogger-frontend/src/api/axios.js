import axios from "axios"
import Cookies from 'js-cookie'
const api=axios.create({
    baseURL:import.meta.env.VITE_REACT_APP_API_URL || '/api',
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
})

api.interceptors.request.use(
    (config)=>{
        const token=Cookies.get('accessToken')
        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
      const originalRequest = error.config;

      // Check if response exists before accessing status property
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
              // Clear cookies
              Cookies.remove('accessToken');
              Cookies.remove('refreshToken');
              Cookies.remove('idToken');
              
              // Redirect to login page
              window.location.href = '/';
              return Promise.reject(error);
          } catch (refreshError) {
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
      
      // Store tokens in cookies
      if (response.data.token) {
        const { IdToken, AccessToken, RefreshToken, ExpiresIn } = response.data.token;
        
        // Set cookies with expiration
        Cookies.set('accessToken', AccessToken, { expires: ExpiresIn / 86400 }); // Convert seconds to days
        Cookies.set('refreshToken', RefreshToken, { expires: 30 }); // Store refresh token for 30 days
        Cookies.set('idToken', IdToken, { expires: ExpiresIn / 86400 });
      }
      
      return response.data;
    },
    
    logout: async () => {
      const accessToken = Cookies.get('accessToken');
      const response = await api.post('/auth/logout', { accessToken });
      
      // Remove cookies
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('idToken');
      
      return response.data;
    },
    
    deleteAccount: async () => {
      const accessToken = Cookies.get('accessToken');
      const response = await api.post('/auth/delete', { accessToken });
      
      // Remove cookies
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('idToken');
      
      return response.data;
    },
    
    isAuthenticated: () => {
      return !!Cookies.get('accessToken');
    }
  };
  
  // User API calls
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