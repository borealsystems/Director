import { logs } from '../../globals'
import db from '../db'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
  // GraphQLBoolean,
  // GraphQLInt,
  // GraphQLNonNull
} from 'graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      // Status and Logs
      getStatus: { // Status Slug
        type: new GraphQLList(
          GraphQLString
        ),
        resolve: () => {
          return db.get('status')
        }
      },

      getLogs: { // Status Message
        type: new GraphQLList(
          GraphQLJSONObject
        ),
        resolve: () => { return logs }
      }
    }
  })

  // mutation: new GraphQLObjectType({
  //   name: 'RootMutationType',
  //   fields: {}
  // })
})

export { schema }
