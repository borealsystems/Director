import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

import controllerInputType from '../controllerTypes/controllerInputType'

const bridgeUpdateInputType = new GraphQLInputObjectType({
  name: 'bridgeUpdateInputType',
  description: 'Input type for registering a bridge',
  fields: {
    type: {
      type: GraphQLString
    },
    version: {
      type: GraphQLString
    },
    controllers: {
      type: new GraphQLList(controllerInputType)
    }
  }
})

export default bridgeUpdateInputType
