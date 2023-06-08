import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'

import Blog from './Blog'
import blogService from '../services/blogs'

jest.mock('../services/blogs')

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

test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
        title: 'Title',
        author: 'Author',
        url: 'Url',
        likes: 1
    }

    const updatedBlog = {
        ...blog,
        likes: blog.likes + 1
    }

    const username = 'simon'

    const removeBlog = jest.fn()

    blogService.updateBlog = jest.fn().mockResolvedValue(updatedBlog)

    render(
        <Blog blog={blog} username={username} removeBlog={removeBlog} />
    )

    const viewButton = screen.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    await waitFor(() => {
        expect(blogService.updateBlog.mock.calls).toHaveLength(2)
    })
})

