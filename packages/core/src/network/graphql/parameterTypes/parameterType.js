import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

const parameterType = new GraphQLObjectType({
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
        GraphQLJSON
      )
    },
    placeholder: {
      type: GraphQLString
    },
    required: {
      type: GraphQLBoolean
    },
    tooltip: {
      type: GraphQLString
    },
    invalidText: {
      type: GraphQLString
    },
    min: {
      type: GraphQLInt
    },
    max: {
      type: GraphQLInt
    }
  }
})

export default parameterType
