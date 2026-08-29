// ...existing code...
import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/';

const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token') || localStorage.getItem('refresh');

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: getAccessToken() ? 'Bearer ' + getAccessToken() : undefined,
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}
function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      alert('A server/network error occurred. Check the backend/CORS.');
      return Promise.reject(error);
    }

    // If refresh endpoint failed -> force login
    if (
      error.response.status === 401 &&
      originalRequest &&
      originalRequest.url &&
      originalRequest.url.includes('token/refresh')
    ) {
      window.location.href = '/login';
      return Promise.reject(error);
    }

    const responseData = error.response.data || {};

    if (responseData.code === 'token_not_valid' && error.response.status === 401) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // decode refresh token safely
      let tokenParts;
      try {
        tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
      } catch (e) {
        console.error('Failed to parse refresh token', e);
        window.location.href = '/login';
        return Promise.reject(error);
      }

      const now = Math.floor(Date.now() / 1000);
      if (tokenParts.exp <= now) {
        console.log('Refresh token expired');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            if (!token) {
              reject(error);
              return;
            }
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axiosInstance.post('token/refresh/', {
          refresh: refreshToken,
        });

        const newAccess = refreshResponse.data.access;
        const newRefresh = refreshResponse.data.refresh || refreshToken;

        localStorage.setItem('access_token', newAccess);
        localStorage.setItem('refresh_token', newRefresh);

        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccess;
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;

        onRefreshed(newAccess);
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error('Refresh token request failed', refreshErr);
        onRefreshed(null);
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
// ...existing code...