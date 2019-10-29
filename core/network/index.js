import express from 'express'
import schema from './schema'
import graphqlHTTP from 'express-graphql'

const port = 3001
const app = express()
const debug = require('debug')('BorealDirector:src/core/network/network')

app.use('/graphql', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,  Authorization, Content-Length, X-Requested-With')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.use(express.static('./ui/public'))
app.use('/dist', express.static('./ui/dist'))

// eslint-disable-next-line no-unused-vars
const server = app.listen(port, () => {
  debug(`Express listen at http://localhost:${port}`)
})
