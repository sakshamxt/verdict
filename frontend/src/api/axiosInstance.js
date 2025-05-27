import axios from 'axios';

// Retrieve the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor to handle global errors (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., clear token and redirect to login
      // This could also be handled within AuthContext
      localStorage.removeItem('authToken');
      // Potentially dispatch a logout action or redirect
      // window.location.href = '/login'; // Can be abrupt, better to use React Router's navigate
      console.error("Unauthorized access - 401");
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;