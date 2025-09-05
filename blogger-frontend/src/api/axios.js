import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL || '/api',
    withCredentials: true, // send cookies
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