import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

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
      type: new GraphQLList(
        new GraphQLInputObjectType({
          name: 'bridgeUpdateControllerInputType',
          description: 'Input type for registering a controller on a bridge',
          fields: {
            manufacturer: {
              type: GraphQLString
            },
            model: {
              type: GraphQLString
            },
            serial: {
              type: GraphQLString
            }
          }
        })
      )
    }
  }
})

export default bridgeUpdateInputType
