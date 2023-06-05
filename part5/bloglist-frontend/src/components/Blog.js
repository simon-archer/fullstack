import { useState } from 'react'

const Blog = ({ blog }) => {
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

  const BlogDetails = ({ blog }) => {
    return (
      <div>
        <p>{blog.url}</p>
        <div>
          <span>{blog.likes}</span>
          <button>Like</button>
        </div>
        <p>{blog.author}</p>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={ToggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
        {showDetails && <BlogDetails blog={blog} />}
      </div>

    </div>
  )
}

export default Blog