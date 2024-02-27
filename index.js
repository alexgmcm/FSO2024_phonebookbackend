const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', function (req, res) { return req.method==="POST" ?  JSON.stringify(req.body) : "" })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))


let data = [
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


app.get('/api/persons/:id', (request, response) => {

  Person.findById(request.params.id).then(note => {
    response.json(note)
  })
  }) 


  app.get('/api/persons/', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    } )
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    data = data.filter(x => x.id !== id)
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log("POST STARTED")

    if (body.name === undefined) {
      return response.status(400).json({ error: 'name missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number
    })

    console.log(person)
    person.save().then(savedPerson => {
      console.log(`saving ${JSON.stringify(savedPerson)}`)
      response.json(savedPerson)
    }).catch(err => console.log(err.message))
  })

  app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
      const now = new Date()
    const content = `Phonebook has info for ${persons.length} people <br/> ${now.toUTCString()}`
    response.send(content)
    } )
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})