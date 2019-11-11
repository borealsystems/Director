import { GraphQLJSONObject } from 'graphql-type-json'
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'

import { definitions } from '../libs/sharedVars'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: {
      definitionList: {
        type: GraphQLJSONObject,
        resolve: () => { return definitions[0] }
      },
      status: {
        type: GraphQLString,
        resolve: () => { return 'good' }
      },
      statusMessage: {
        type: GraphQLString,
        resolve: () => { return 'System Operating As Intended' }
      }
    }
  })
})
