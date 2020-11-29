import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

import parameterType from '../parameterTypes/parameterType'

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
      type: new GraphQLList(parameterType)
    }
  }
})

export default providerFunctionType
