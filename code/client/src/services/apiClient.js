import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL
});

export default apiClient;