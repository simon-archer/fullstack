const blog = require('../models/blog')
const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((max, blog) =>
        max.likes > blog.likes ? max : blog, blogs[0])
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    const authorCounts = lodash.countBy(blogs, 'author')
    const authorWithMostBlogs = lodash.maxBy(
        lodash.keys(authorCounts),
        (author) => authorCounts[author]
    )

    return {
        author: authorWithMostBlogs,
        blogs: authorCounts[authorWithMostBlogs]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}