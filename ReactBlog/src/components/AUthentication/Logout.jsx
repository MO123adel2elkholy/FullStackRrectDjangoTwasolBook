// ...existing code...
import React, { useEffect } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        const refresh = localStorage.getItem('refresh_token') || localStorage.getItem('refresh');
        if (refresh) {
          await axiosInstance.post('user/logout/blacklist/', { refresh_token: refresh });
        }
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        // remove common token keys
        ['access_token', 'refresh_token', 'access', 'refresh', 'token', 'auth_token'].forEach((k) =>
          localStorage.removeItem(k)
        );
        // clear axios auth header
        if (axiosInstance.defaults.headers) {
          delete axiosInstance.defaults.headers['Authorization'];
          if (axiosInstance.defaults.headers.common) delete axiosInstance.defaults.headers.common['Authorization'];
        }
        navigate('/login', { replace: true });
      }
    };

    doLogout();
  }, [navigate]);

  return <div>Logging out…</div>;
}
