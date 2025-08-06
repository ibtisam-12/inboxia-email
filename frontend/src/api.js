import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // or your deployed backend URL
});
export default api;