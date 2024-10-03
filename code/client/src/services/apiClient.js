import axios from 'axios';

// console.log("API Base URL:", process.env.REACT_APP_BASE_URL);

// const apiClient = axios.create({
//   baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000', // Default to localhost for development
// });

const apiClient = axios.create({
  baseURL: 'https://peak-performance-backend-394f316db343.herokuapp.com/', // Default to localhost for development
});

export default apiClient;