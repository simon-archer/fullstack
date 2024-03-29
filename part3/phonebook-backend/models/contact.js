const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [3, 'Name must be at least 3 characters long']
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                const numberRegex = /^(\d{2,3})-(\d{5,})$/;
                const match = v.match(numberRegex);
                return (match !== null && (match[1].length + match[2].length >= 8));
            },
            message: props => `Number ${props.value} is not valid! Number must have 8 digitits and be in a XX-XXXXXX or XXX-XXXXX format`
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contacts', personSchema)
