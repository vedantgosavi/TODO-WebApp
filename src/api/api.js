
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5239' 
});

export default api;
