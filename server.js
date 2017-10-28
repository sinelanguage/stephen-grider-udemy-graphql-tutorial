const express = require('express')
const expressGraphQL = require('express-graphql')
const schema = require('./schema/schema')

const app = express()
const PORT = 4000

app.use('/graphql', expressGraphQL({
  schema, // imported above
  graphiql: true // use in dev mode
}))

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`)
})
