import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

import { GraphQLJSONObject } from 'graphql-type-json'

const providerFunctionType = new GraphQLObjectType({
  name: 'providerFunction',
  fields: {
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    parameters: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'functionParameter',
          fields: {
            label: {
              type: GraphQLString
            },
            id: {
              type: GraphQLString
            },
            inputType: {
              type: GraphQLString
            },
            regex: {
              type: GraphQLString
            },
            items: {
              type: new GraphQLList(
                GraphQLJSONObject
              )
            }
          }
        })
      )
    }
  }
})

export default providerFunctionType
