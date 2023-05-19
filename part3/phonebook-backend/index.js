const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let people = [
  {
    "name": "Arto Hellas",
    "number": "39-44-5323523",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "Sine",
    "number": "1234567890",
    "id": 5
  }
]

app.get('/', (req, res) => {
  res.send('<h1>phonebook backend</h1>')
})

app.get('/api/people', (req, res) => {
  res.json(people)
})

const generateId = () => {
  const maxId = people.length > 0
    ? Math.max(...people.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/people', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  people = people.concat(person)

  response.json(person)
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

app.delete('/api/people/:id', (request, response) => {
  const id = Number(request.params.id)
  people = people.filter(person => person.id !== id)

  response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})