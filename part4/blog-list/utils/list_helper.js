const blog = require('../models/blog')

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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}