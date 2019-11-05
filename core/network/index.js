import express from 'express'
import graphqlHTTP from 'express-graphql'
var { buildSchema } = require('graphql')
var cors = require('cors')

const port = 3001
const app = express()
const debug = require('debug')('BorealDirector:src/core/network/network')

app.use(cors())

var schema = buildSchema(`
  type Query {
    status: String
    statusMessage: String
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  status: () => {
    return 'good'
  },
  statusMessage: () => {
    return 'System Is Functioning Normally'
  }
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.use(express.static('./ui/public'))
app.use('/dist', express.static('./ui/dist'))

// eslint-disable-next-line no-unused-vars
const server = app.listen(port, () => {
  debug(`Express listen at http://localhost:${port}`)
})
