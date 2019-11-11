import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from './schema'

const debug = require('debug')('BorealDirector:core/libs/network')

const app = express()
const dev = process.env.NODE_ENV === 'development'

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: dev
}))

app.use('/', (req, res) => {
  res.json('Go to /graphql to test your queries and mutations!')
})

const server = app.listen(3001, () => {
  const { port } = server.address()
  debug(`Express listen at http://localhost:${port}`)
})
