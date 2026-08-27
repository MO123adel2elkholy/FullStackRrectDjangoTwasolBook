import { useEffect, useState } from 'react'
import './App.css'
import Posts from './components/Posts'
import PostDataLoading from './components/PostDataLoading'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/post')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPosts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div>

      {error && <p>Error: {error}</p>}

      <PostDataLoading loading={loading} />

      {!loading && !error && <Posts posts={posts} />}
    </div>
  )
}

export default App