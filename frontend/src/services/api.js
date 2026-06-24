// Centralized Axios client for all backend API requests.
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically attach the stored JWT to every request.
api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('smartflashcard_auth');

  if (storedAuth) {
    try {
      const parsedAuth = JSON.parse(storedAuth);
      if (parsedAuth?.token) {
        config.headers.Authorization = `Bearer ${parsedAuth.token}`;
      }
    } catch (error) {
      localStorage.removeItem('smartflashcard_auth');
    }
  }

  return config;
});

export default api;
