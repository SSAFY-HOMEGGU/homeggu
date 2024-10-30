import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://i11b206.p.ssafy.io/api/', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;


