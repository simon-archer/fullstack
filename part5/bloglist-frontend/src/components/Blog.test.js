import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

import Blog from './Blog'

test('renders content', () => {
    const blog = {
        title: 'Title',
        author: 'Author',
        url: 'Url',
        likes: 5
    }

    const username = 'simon'

    const removeBlog = () => {
        console.log()
    }

    render(<Blog blog={blog} username={username} removeBlog={removeBlog} />)

    expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeDefined()

    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(blog.likes)).toBeNull()

})