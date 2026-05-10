import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;

// Export API_URL for use in components
export { API_URL };
