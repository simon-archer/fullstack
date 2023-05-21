const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://simonarcher:${password}@cluster0.npm2bkv.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Contact', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

if (process.argv.length < 4) {
    Person.find({}).then(persons => {
        console.log('Phonebook:')
        persons.forEach(person => {
            console.log(person.name + ' ' + person.number)
        })
        mongoose.connection.close()
    })
} else {
    person.save().then(result => {
        console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}