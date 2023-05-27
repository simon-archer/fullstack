const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

async function connectToDatabase() {
    try {
        await mongoose.connect(url)
        console.log('connected to MongoDB')
    } catch (error) {
        console.log('error connecting to MongoDB:', error.message)
    }
}

connectToDatabase()

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        default: null,
    },
    author: String,
    url: {
        type: String,
        default: null,
    },
    likes: {
        type: Number,
        default: 0
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)