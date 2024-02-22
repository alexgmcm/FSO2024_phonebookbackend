const mongoose = require('mongoose')
if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
const password = encodeURIComponent(process.argv[2])

const url=`mongodb+srv://fullstack:${password}@fso2024.rcemcjg.mongodb.net/?retryWrites=true&w=majority&appName=FSO2024`
mongoose.set('strictQuery',false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length<5) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
  }
else {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}
 