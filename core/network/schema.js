import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import definitions from '../libs/sharedVars'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'definitionList',
    fields: {
      definitionList: {
        type: GraphQLString,
        resolve: () => {
          return JSON.stringify(definitions.arr)
        }
      }
    }
  })
})
