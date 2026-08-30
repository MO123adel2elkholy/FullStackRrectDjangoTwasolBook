// ...existing code...
import React, { useEffect, useState } from 'react'
import axiosInstance from './axios'
import Posts from './components/post/Posts'
import PostDataLoading from './components/post/PostDataLoading'
import PostError from './components/post/PostError'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get('post') // uses axios instance (auth + refresh)
      setPosts(res.data)
    } catch (err) {
      setError({
        status: err.response?.status || err?.status || 500
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div>
      {error && <PostError error={error} />}
      <PostDataLoading loading={loading} />
      {!loading && !error && <Posts posts={posts} />}
    </div>
  )
}

export default App
// ...existing code...