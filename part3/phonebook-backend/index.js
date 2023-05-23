const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Contacts = require('./models/contact')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(e => e.message).join(", ")
    return response.status(400).json({ error: messages })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

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

app.post('/api/people', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Contacts({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.get('/api/people/:id', (request, response, next) => {
  Contacts.findById(request.params.id)
    .then(result => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).json({ error: 'Entry not found' })
      }
    })
    .catch(error => next(error))
})

app.delete('/api/people/:id', (request, response, next) => {
  console.log(request.params)
  Contacts.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/people/:id', (request, response, next) => {
  const body = request.body
  console.log('Request Params:', request.params)

  const person = {
    name: body.name,
    number: body.number
  }

  Contacts.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})