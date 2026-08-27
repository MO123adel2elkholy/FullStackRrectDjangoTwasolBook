import { useEffect, useState } from 'react'
import './App.css'
import Posts from './components/Posts'
import PostDataLoading from './components/PostDataLoading'
import PostError from './components/PostError'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/post')

      if (!response.ok) {
        throw { status: response.status }
      }

      const data = await response.json()
      setPosts(data)
    } catch (err) {
      setError({
        status: err?.status || err?.response?.status || 500
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