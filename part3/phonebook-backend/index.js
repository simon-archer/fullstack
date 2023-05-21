const Contacts = require('./models/contact')
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

let people = [

]

app.get('/', (req, res) => {
  res.send('<h1>phonebook backend</h1>')
})

app.get('/api/people', (request, response) => {
  Contacts.find({})
    .then(people => {
      console.log('Fetched people:', people)
      response.json(people)
    })
    .catch(error => {
      console.log('Error fetching people:', error)
      response.status(500).json({ error: 'Failed to fetch people' })
    })
})

const generateId = () => {
  const maxId = people.length > 0
    ? Math.max(...people.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/people', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Contacts({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/api/people/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = people.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

  response.json(person)
})

app.use(unknownEndpoint)

app.delete('/api/people/:id', (request, response) => {
  const id = Number(request.params.id)
  people = people.filter(person => person.id !== id)

  response.status(204).end()
})