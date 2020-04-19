const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    name: "Rishabh Singh",
    number: "9456957997",
    id: 1
  },
  {
    name: "Rajshree Singh",
    number: "9456233227",
    id: 2
  },
  {
    name: "Anushree Gupta",
    number: "9443453497",
    id: 3
  },
]
// const app = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'application/json' })
//   res.end(JSON.stringify(notes))
// })

app.get('/info', (req, res) => {
  const date = new Date()
  const info = `
  <h1>Phonebook has info for ${persons.length} people</h1>
  <br/>
  <h1>${date}</h1>
  `
  res.send(info)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})


app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const id = persons.length > 0 ? Math.floor(Math.random() * 1000) : 0
  return id
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name && !body.number) {
    return res.status(400).json({ 
      error: 'name or number missing' 
    })
  }
  if(persons.find(person => person.name == body.name)){
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
    persons = persons.concat(person)
    res.json(person)
  })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})