import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

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


    const addBlog = (blogObject) => {
        blogService
            .create(blogObject)
            .then((returnedBlog) => {
                setBlogs(blogs.concat(returnedBlog))
                setUserMessage(`A new blog: ${returnedBlog.title} by ${returnedBlog.author} added`)
                setMessageType('userMessage')
                setTimeout(() => {
                    setUserMessage(null)
                }, 5000)
            })
            .catch((error) => {
                setErrorMessage(`An error occurred: ${error.message}. Failed to add a new blog`)
                setMessageType('errorMessage')
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            })
    }

    const removeBlog = async (id) => {
        try {
            await blogService.deleteBlog(id)
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id))
        } catch (error) {
            console.error('Failed to delete blog:', error)
        }
    }


    return (
        <div>
            <h2>Blogs</h2>
            <Notification message={userMessage || errorMessage} type={messageType} />
            {!user &&
                <Togglable buttonLabel="login">
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                </Togglable>
            }
            {user && (
                <>
                    <div>
                        <p>{user.name} logged in</p>
                        <button onClick={handleLogout}>logout</button>
                    </div>
                    <Togglable buttonLabel="create">
                        <BlogForm addBlog={addBlog} />
                    </Togglable>
                    <div>
                        {blogs.sort((a, b) => b.likes - a.likes).map((blog) => (
                            <Blog key={blog.id} blog={blog} username={user.username} removeBlog={removeBlog} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default App
