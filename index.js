const express = require('express')
const app = express()

app.use(express.json())


let persons = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

const dataAtual = new Date();

app.get("/info", (request, response) => {
    response.send(`
    <h1>O Fonebook têm informação de ${persons.length} pessoas!</h1>
    ${dataAtual}
    `)
  })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number (request.params.id)
  const person = persons.find(person => person.id === id)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({ 
      error: 'Nome não informado' 
    })
  }
    if (!body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
  }
  const personexistent = persons.filter(person => person.name === body.name)
  console.log (personexistent)

  if (personexistent.name!=="") {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
}

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(persons)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
