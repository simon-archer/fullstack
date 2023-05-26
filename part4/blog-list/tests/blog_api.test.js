const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../models/blog')

const api = supertest(app)

test('All blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then(response => {
            expect(response.body.length).toBe(5)
        })

})

test('The id has been generated', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
    response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
    })

})

afterAll(async () => {
    await mongoose.connection.close()
})