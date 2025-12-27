import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_||"/api",
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

export default api;