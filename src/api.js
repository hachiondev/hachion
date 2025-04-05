// api.js
import axios from 'axios';

// Retrieve the token from localStorage or your preferred storage
const token = localStorage.getItem('authToken');

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

export default api;
