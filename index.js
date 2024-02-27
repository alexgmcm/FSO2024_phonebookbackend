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



app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id).then(note => {
    response.json(note)
  }).catch(err=>next(err))
  }) 

  app.put("/api/persons/:id", (request, response, next) => {

    const body = request.body
    const person = {
      name: body.name,
      number: body.number
    }
    Person.findByIdAndUpdate(request.params.id,person, {new:true}).then(updatedPerson =>{
      response.json(updatedPerson)
    }).catch(err=>next(err))
  })

  app.get('/api/persons/', (request, response,next) => {
    Person.find({}).then(persons => {
      response.json(persons)
    } ).catch(err=>next(err))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
    })
    .catch(err => next(err))
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
      return response.status(400).json({ error: 'name missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)