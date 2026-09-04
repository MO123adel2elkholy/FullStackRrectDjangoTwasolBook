import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/';

const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token') || localStorage.getItem('refresh');

// safe JWT parser (handles base64url and non-ASCII)
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT', e);
    return null;
  }
}

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// set Authorization header on every request from current localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = 'Bearer ' + token;
  } else {
    if (config.headers) delete config.headers.Authorization;
  }
  return config;
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

    // if refresh endpoint itself failed -> force login
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

      const tokenParts = parseJwt(refreshToken);
      if (!tokenParts) {
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
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = 'Bearer ' + token;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // use plain axios (no interceptors) to avoid recursion
        const refreshResponse = await axios.post(baseURL + 'token/refresh/', {
          refresh: refreshToken,
        });

        const newAccess = refreshResponse.data.access;
        const newRefresh = refreshResponse.data.refresh || refreshToken;

        localStorage.setItem('access_token', newAccess);
        localStorage.setItem('refresh_token', newRefresh);

        // update defaults and original request header
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccess;
        originalRequest.headers = originalRequest.headers || {};
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