const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({});
});

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
        .send(payload)
        .set('Content-Type', 'application/json/')
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
        .send(payload)
        .set('Content-Type', 'application/json/')
        .expect(201)
})

afterAll(async () => {
    await mongoose.connection.close()
})
