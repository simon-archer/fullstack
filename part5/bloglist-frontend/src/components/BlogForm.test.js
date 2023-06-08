import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from '@testing-library/react'

import BlogForm from './BlogForm'

test('Blog form calls correct eventhandler', () => {
    const addBlog = jest.fn()

    render(
        <BlogForm addBlog={addBlog} />
    )

    const titleInput = screen.getByPlaceholderText('Title:')
    const authorInput = screen.getByPlaceholderText('Author:')
    const urlInput = screen.getByPlaceholderText('Url:')

    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    fireEvent.change(authorInput, { target: { value: 'Test Author' } })
    fireEvent.change(urlInput, { target: { value: 'Test Url' } })

    const form = screen.getByTestId('form')
    fireEvent.submit(form)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0].title).toBe('Test Title')
    expect(addBlog.mock.calls[0][0].author).toBe('Test Author')
    expect(addBlog.mock.calls[0][0].url).toBe('Test Url')

})

