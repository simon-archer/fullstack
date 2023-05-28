const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/test_helper')
const bcrypt = require('bcrypt')


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

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    }, 10000)
})


afterAll(async () => {
    await mongoose.connection.close()
})
