import { useState, useEffect } from 'react'
import './App.css'

// Change this accordingly
const API_URL = 'https://project-3-abc-backend-production.up.railway.app'

function App() {
  // Post state
  const [posts, setPosts] = useState([])

  // Sign up states
  const [signupUsername, setSignupUsername] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupStatus, setSignupStatus] = useState('')

  // Log in states
  const [currentUser, setCurrentUser] = useState(null)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginStatus, setLoginStatus] = useState('Not logged in')

  // Create post state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')


  // Load on page load
  useEffect(() => {
    loadPosts()
  }, [])


  // GET request
  function loadPosts() {
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err))
  }

  // POST request
  function signup() {
    fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: signupUsername, password: signupPassword }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        setSignupStatus(ok ? `Account created for ${data.username} - you can log in now` : data.error)
      })
      .catch((err) => console.error(err))
  }

  // POST request
  function login() {
    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUsername, password: loginPassword }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setCurrentUser(data)
          setLoginStatus(`Logged in as ${data.username}`)
        } else {
          setCurrentUser(null)
          setLoginStatus(data.error)
        }
      })
      .catch((err) => console.error(err))
  }

  // POST request
  function createPost() {
    if (!currentUser) return
    fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, user_id: currentUser.id }),
    })
      .then((res) => {
        if (res.ok) {
          setTitle('')
          setContent('')
          loadPosts()
        }
      })
      .catch((err) => console.error(err))
  }


  return (
    <div className="container">
      <h1>ABC (All-Blog-Center)</h1>


      <section className="card">
        <h2>Sign up</h2>
        <input
          placeholder="username"
          value={signupUsername}
          onChange={(e) => setSignupUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
        />
        <button onClick={signup}>Sign up</button>
        <p className="status">{signupStatus}</p>
      </section>


      <section className="card">
        <h2>Log in</h2>
        <input
          placeholder="username"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={login}>Log in</button>
        <p className="status">{loginStatus}</p>
      </section>


      <section className="card">
        <h2>New Post</h2>
        {currentUser ? (
          <>
            <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea
              placeholder="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={createPost}>Post</button>
          </>
        ) : (
          <p className="status">Log in first to post</p>
        )}
      </section>


      <section className="card">
        <h2>All Posts</h2>
        {posts.map((p) => (
          <div className="post" key={p.id}>
            <h3>{p.title}</h3>
            <p className="author">by {p.author}</p>
            <p>{p.content}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default App