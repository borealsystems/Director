import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from './schema'
import path from 'path'
const cors = require('cors')

const debug = require('debug')('BorealDirector:core/libs/network')

const app = express()
const dev = process.env.NODE_ENV === 'development'

app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: dev
}))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/ui/dist/index.html'))
})

const server = app.listen(3001, () => {
  const { port } = server.address()
  debug(`Express listen at http://localhost:${port}`)
})
