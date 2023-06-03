import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [userMessage, setUserMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessageType('errorMessage')
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
        setUserMessage(`A new blog: ${title} by ${author} added`)
        setMessageType('userMessage')
        setTimeout(() => {
          setUserMessage(null)
        }, 5000)
      })
  }

  const blogForm = (setUserMessage, setMessageType) => (
    <form onSubmit={addBlog}>
      <div>
        Title:
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        Author:
        <input
          type="text"
          value={author}
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        Url:
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={userMessage || errorMessage} type={messageType} />
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>Log out</button>
        {blogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
      }
    </div>
  )
}

export default App