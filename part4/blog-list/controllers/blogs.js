const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 }) // Add this line to populate user info
    response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    if (!user || !user._id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    if (!body.title || !body.url) {
        return response.status(400).json({ message: 'Missing request data' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

    response.status(201).json(populatedBlog)

})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user

    if (!user || !user._id) {
        return response.status(401).json({ error: 'user token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user.id) {
        return response.status(403).json({ error: 'only the creator can delete blogs' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})


blogRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})


module.exports = blogRouter
