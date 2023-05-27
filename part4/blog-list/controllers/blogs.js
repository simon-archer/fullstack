const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400).send({ error: 'title or url missing' })
    } else {

        const blog = new Blog(request.body)
        const savedBlog = await blog.save()

        response.status(201).json(savedBlog)

    }

})

blogRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (error) {
        response.status(400).send({ error: 'invalid id' })
    }
})


module.exports = blogRouter
