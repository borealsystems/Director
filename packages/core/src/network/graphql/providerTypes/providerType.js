import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql'

import { GraphQLJSONObject } from 'graphql-type-json'

const providerType = new GraphQLObjectType({
  name: 'Provider',
  fields: {
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    manufacturer: {
      type: GraphQLString
    },
    protocol: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    category: {
      type: GraphQLString
    },
    parameters: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'parameter',
          fields: {
            inputType: {
              type: GraphQLString
            },
            required: {
              type: GraphQLBoolean
            },
            id: {
              type: GraphQLString
            },
            label: {
              type: GraphQLString
            },
            regex: {
              type: GraphQLString
            },
            tooltip: {
              type: GraphQLString
            },
            placeholder: {
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
    },
    defaults: {
      type: new GraphQLList(GraphQLString)
    }
  }
})

export default providerType
