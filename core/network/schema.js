const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    launches: [Launch]!
    launch(id: ID!): Launch
    # Queries for the current user
    me: User
  } 
`

module.exports = typeDefs
