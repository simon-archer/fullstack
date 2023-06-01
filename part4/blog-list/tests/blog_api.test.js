const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/test_helper')
const bcrypt = require('bcrypt')


const api = supertest(app)
let token

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = {
        username: 'testing',
        password: 'password',
    }

    await api.post('/api/users').send(newUser)

    const loginResponse = await api.post('/api/login').send(newUser)
    token = loginResponse.body.token
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(201)
})

test('Returns 401 unauthorized when token is not provided', async () => {
    const payload = {
        'title': 'Brisket',
        'author': 'Zuccy',
        'url': 'https://www.meta.com',
        'likes': 3
    }
    await api
        .post('/api/blogs')
        .send(payload)
        .expect(401)
})

test('Defaulted likes to 0', async () => {
    const payload = {
        'title': 'Brisket',
        'author': 'Zuccy',
        'url': 'https://www.meta.com',
    }
    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(400)
})

describe('DELETE /api/blogs/:id', () => {
    let createdBlogId
    let userToken

    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        const newUser = {
            username: 'testuser',
            password: 'password'
        }

        const userResponse = await api
            .post('/api/users')
            .send(newUser)

        const userId = userResponse.body.id

        const loginResponse = await api
            .post('/api/login')
            .send(newUser)
        userToken = loginResponse.body.token

        const payload = {
            title: 'Sample Blog',
            author: 'Test User',
            url: 'http://sampleblog.com',
            likes: 0,
            user: userId
        }

        const blogResponse = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${userToken}`)
            .send(payload)

        createdBlogId = blogResponse.body.id
    })

    test('deletes the blog post with the given id', async () => {
        await api
            .delete(`/api/blogs/${createdBlogId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(204)

        const blogsAtEnd = await Blog.find({})
        const blogIds = blogsAtEnd.map(blog => blog.id)

        expect(blogIds).not.toContain(createdBlogId)
    })
})

describe('UPDATE /api/blogs/:id', () => {
    let savedBlog

    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        const newUser = {
            username: 'testing',
            password: 'password',
        }

        await api.post('/api/users').send(newUser)

        const loginResponse = await api.post('/api/login').send(newUser)
        token = loginResponse.body.token

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
            .set('Authorization', `Bearer ${token}`)
            .send({ likes: newLikes })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(updatedBlog.body.likes).toBe(newLikes)
    })

})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Username must be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})
