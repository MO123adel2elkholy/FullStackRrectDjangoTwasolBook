import axios from 'axios';

  const server_url = import.meta.VITE_API_BASE_URL||'http://127.0.0.1:8000'


const axiosInstance = axios.create({
    baseURL: server_url,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

export default axiosInstance;