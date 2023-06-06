import React, { useState } from 'react'

const BlogForm = ({ addBlog }) => {
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

    const handleSubmit = (event) => {
        event.preventDefault()

        const blogObject = {
            title,
            author,
            url,
        }

        addBlog(blogObject)

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                Title:
                <input type="text" value={title} onChange={handleTitleChange} />
            </div>
            <div>
                Author:
                <input type="text" value={author} onChange={handleAuthorChange} />
            </div>
            <div>
                Url:
                <input type="text" value={url} onChange={handleUrlChange} />
            </div>
            <button type="submit">create</button>
        </form>
    )
}

export default BlogForm