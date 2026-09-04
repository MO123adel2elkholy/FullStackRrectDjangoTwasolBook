import React, { useEffect, useState } from 'react';
import './App.css';
import PostDataLoading from './components/post/PostDataLoading.jsx';
import Posts from './components/admin/posts.jsx';
import axiosInstance from './axios';

function Admin() {
  const [appState, setAppState] = useState({
    loading: true,
    posts: [],
    error: '',
  });

  useEffect(() => {
    let isMounted = true;

    axiosInstance
      .get('post/')
      .then((res) => {
        if (!isMounted) return;

        setAppState({
          loading: false,
          posts: res.data || [],
          error: '',
        });
      })
      .catch((err) => {
        if (!isMounted) return;

        setAppState({
          loading: false,
          posts: [],
          error: err.response?.data?.detail || 'Failed to load posts.',
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="App">
      <h1>Latest Posts</h1>

      {appState.error ? (
        <p style={{ color: 'red', marginBottom: '16px' }}>{appState.error}</p>
      ) : null}

      {appState.loading ? (
        <PostDataLoading loading={appState.loading} />
      ) : (
        <Posts posts={appState.posts} />
      )}
    </div>
  );
}

export default Admin;