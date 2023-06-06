import { useState } from 'react'
import PropTypes from 'prop-types'

import blogService from '../services/blogs'

const Blog = ({ blog, username, removeBlog }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    }

    const [showDetails, setShowDetails] = useState(false)
    const [likes, setLikes] = useState(blog.likes)

    const ToggleDetails = () => {
        setShowDetails(!showDetails)
    }

    const BlogDetails = ({ blog, username }) => {

        const handleLike = async () => {
            const updatedBlog = await blogService.updateBlog({ ...blog, likes: likes + 1 })
            setLikes(updatedBlog.likes)
        }

        const handleDelete = async (blog) => {
            if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
                try {
                    removeBlog(blog.id)
                } catch (error) {
                    console.error('Failed to delete blog:', error)
                }
            }
        }

        return (
            <div>
                <p>{blog.url}</p>
                <div>
                    <span>{likes}</span>
                    <button onClick={handleLike}>like</button>
                </div>
                <p>{username}</p>
                <button onClick={() => { handleDelete(blog) }}>delete</button>
            </div >
        )
    }

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <button onClick={ToggleDetails}>
                    {showDetails ? 'hide' : 'view'}
                </button>
                {showDetails && <BlogDetails blog={blog} username={username} removeBlog={removeBlog} />}
            </div>

        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    removeBlog: PropTypes.func.isRequired,
}

export default Blog