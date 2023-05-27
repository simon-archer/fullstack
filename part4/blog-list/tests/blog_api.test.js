const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
})

test('All blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then(response => {
            expect(response.body.length).toBe(0)
        })

})

test('The id has been generated', async () => {
    const payload = {
        'title': 'Brisket',
        'author': 'Zuccy',
        'url': 'https://www.meta.com',
        'likes': 3
    }
    const response = await api
        .post('/api/blogs')
        .set('Content-Type', 'application/json')
        .send(payload)
        .expect(201)

    expect(response.body.id).toBeDefined()
})

test('Created a new blog post', async () => {
    const payload = {
        'title': 'Brisket',
        'author': 'Zuccy',
        'url': 'https://www.meta.com',
        'likes': 3
    }
    await api
        .post('/api/blogs')
        .set('Content-Type', 'application/json')
        .send(payload)
        .expect(201)
})

test('Defaulted likes to 0', async () => {
    const payload = {
        'title': 'Brisket',
        'author': 'Zuccy',
        'url': 'https://www.meta.com',
    }
    const response = await api
        .post('/api/blogs')
        .set('Content-Type', 'application/json')
        .send(payload)
        .expect(201)

    expect(response.body.likes).toBe(0)
})

test('400 error on missing request data', async () => {
    const payload = {
        'author': 'Zuccy',
        'likes': 4
    }
    await api
        .post('/api/blogs')
        .send(payload)
        .set('Content-Type', 'application/json')
        .expect(400)
})

describe('DELETE /api/blogs/:id', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})

        const blog = new Blog({
            title: 'Meat',
            author: 'ZuccyMarky',
            url: 'http://meta.com',
            likes: 0
        })

        await blog.save()
    })

    test('deletes the blog post with the given id', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await Blog.find({})

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const contents = blogsAtEnd.map(r => r.id)

        expect(contents).not.toContain(blogToDelete.id)
    })
})

describe('UPDATE /api/blogs/:id', () => {
    let savedBlog

    beforeEach(async () => {
        await Blog.deleteMany({})

        let blog = new Blog({
            title: 'Meata',
            author: 'ZuccyMark',
            url: 'http://meata.com',
            likes: 0
        })

        savedBlog = await blog.save()
    })

    test('updates the likes of the blog post with the given id', async () => {
        const newLikes = savedBlog.likes + 1

        const updatedBlog = await api
            .put(`/api/blogs/${savedBlog.id}`)
            .send({ likes: newLikes })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(updatedBlog.body.likes).toBe(newLikes)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})
