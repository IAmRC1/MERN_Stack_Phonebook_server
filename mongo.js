const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://full_stack_user:${password}@fullstackcluster-r3oyj.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person(
  {
    name: process.argv[3],
    number: process.argv[4],
  }
)

if(process.argv[3] && process.argv[4]){
  person.save().then(response => {
    console.log(`added ${response.name} number ${response.number} to phonebook`)
    mongoose.connection.close()
  })
}

if(!process.argv[3] && !process.argv[4]){
  Person
    .find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => console.log(`${person.name} ${person.number}`))
      return mongoose.connection.close()
  })
}