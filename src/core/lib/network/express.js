import log from '../log'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import path from 'path'
import { schema } from './graphql/schema'
import cors from 'cors'

const app = express()
const dev = process.env.NODE_ENV === 'development'

app.use(cors())

app.use('/gql', graphqlHTTP({
  schema: schema,
  graphiql: dev
}))

app.get('/dist/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../ui/dist/bundle.js'))
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../ui/public/index.html'))
})

app.listen(3001, () => {
  log('info', 'core/lib/network/express', 'Director UI Available on http://localhost:3001')
})