import axios from 'axios';

var serverURL = null

switch (process.env.NODE_ENV) {
  case 'development':
    serverURL = 'http://localhost:5000'
    break
  default:
    serverURL = 'https://peak-performance-backend-394f316db343.herokuapp.com/'
}

const apiClient = axios.create({
  baseURL: serverURL
});

export default apiClient;
