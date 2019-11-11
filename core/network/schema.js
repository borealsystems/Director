import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'
import { GraphQLSchema, GraphQLObjectType } from 'graphql'

import { definitions } from '../libs/sharedVars'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'definitionList',
    fields: {
      definitionList: {
        type: GraphQLJSONObject,
        resolve: () => { return definitions[0] }
      }
    }
  })
})
