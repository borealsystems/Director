import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

const bridgeType = new GraphQLObjectType({
  name: 'bridgeRegisterInputType',
  description: 'Input type for registering a bridge',
  fields: {
    type: {
      type: GraphQLString
    },
    address: {
      type: GraphQLString
    },
    version: {
      type: GraphQLString
    },
    controllers: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'bridgeRegisterControllerInputType',
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

export default bridgeType
