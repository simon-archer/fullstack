import { useState } from 'react'

import blogService from '../services/blogs'

const Blog = ({ blog, username }) => {
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

    return (
      <div>
        <p>{blog.url}</p>
        <div>
          <span>{likes}</span>
          <button onClick={handleLike}>Like</button>
        </div>
        <p>{username}</p>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={ToggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
        {showDetails && <BlogDetails blog={blog} username={username} />}
      </div>

    </div>
  )
}

export default Blog