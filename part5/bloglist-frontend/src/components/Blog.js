import { useState } from 'react'

const Blog = ({ blog, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [showDetails, setShowDetails] = useState(false);


  const ToggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const BlogDetails = ({ blog, username }) => {
    return (
      <div>
        <p>{blog.url}</p>
        <div>
          <span>{blog.likes}</span>
          <button>Like</button>
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