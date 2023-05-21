require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const url = process.env.MONGODB_URI
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

let notes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: true
  },
  {
    content: "Browser can execute only JavaScript",
    date: new Date(),
    important: false,
  },
  {
    content: "GET and POST are the most important methods of HTTP protocol",
    date: new Date(),
    important: true
  }
]

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }

  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const body = request.body
  const note = notes.find(note => note.id === id)

  if (note) {
    const updatedNote = {
      ...note,
      important: body.important
    }

    notes = notes.map(n => n.id !== id ? n : updatedNote)

    response.json(updatedNote)
  } else {
    response.status(404).end()
  }
})