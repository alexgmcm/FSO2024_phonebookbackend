const express = require('express')
const app = express()
app.use(express.json())

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

    const id = Number(request.params.id)
    const person = data.find(x => x.id === id)
    if (person){
    response.json(person)
    }
    else {
        response.status(404).end()
    }
  }) 


  app.get('/api/persons/', (request, response) => {
    response.json(data)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    data = data.filter(x => x.id !== id)
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
  const person = request.body
  if (!(person.name && person.number)){
    response.status(422).json({"error":"required field missing"})
    }
    else if (data.filter(x => x.name===person.name).length > 0){
    response.status(400).json({"error":"name already in phonebook"})
    } 
 else {
  person.id = Math.floor(Math.random()*10000000)
  data = data.concat(person)
  response.json(person)
  }
  })

  app.get('/info', (request, response) => {
    console.log(request)
    const now = new Date()
    const content = `Phonebook has info for ${data.length} people <br/> ${now.toUTCString()}`
    response.send(content)
  })

  const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})