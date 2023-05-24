const listHelper = require('../utils/list_helper')

const blogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Statement',
        author: 'Edsger ',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 4,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Harmful',
        author: ' W.',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 4,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go',
        author: 'Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 12,
        __v: 0
    }
]

test('dummy returns one', () => {
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

test('Upvotes should return 8', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(20)
})

test('Should return title: Go, Author: Dijkstra, Likes: 12', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
        title: 'Go',
        author: 'Dijkstra',
        likes: 12
    })
})