import axios from "axios";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://todo-app.pioneeralpha.com";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token?: string) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

// Add request interceptor to ensure token is always included
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage (check both possible keys)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || localStorage.getItem("todo_token");
      if (token && !config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    
    // If data is FormData, remove Content-Type header to let axios set it automatically with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
