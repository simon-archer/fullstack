const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})


const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogRouter.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.titl,
        author: body.title,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
})

// blogRouter.post('/', async (request, response) => {
//     if (!request.body.title || !request.body.url) {
//         return response.status(400).send({ error: 'title or url missing' })
//     } else {

//         const blog = new Blog(request.body)
//         const savedBlog = await blog.save()

//         response.status(201).json(savedBlog)

//     }

// })

blogRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (error) {
        response.status(400).send({ error: 'invalid id' })
    }
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
