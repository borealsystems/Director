import { GraphQLJSONObject } from 'graphql-type-json'
import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString } from 'graphql'

import { definitions } from '../libs/sharedVars'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: {
      definitions: { // Device Definitions
        type: new GraphQLList(GraphQLJSONObject),
        resolve: () => { return definitions }
      },
      definitionNames: { // Device Definitions
        type: new GraphQLList(GraphQLString),
        resolve: () => definitions.map((key, index) => { return definitions[index].name })
      },
      status: { // Status Slug
        type: GraphQLString,
        resolve: () => { return 'good' }
      },
      statusMessage: { // Status Message
        type: GraphQLString,
        resolve: () => { return 'System Operating As Intended' }
      }
    }
  })
})
