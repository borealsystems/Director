import {
  GraphQLInputObjectType,
  GraphQLString
} from 'graphql'

const controllerRegisterInputType = new GraphQLInputObjectType({
  name: 'controllerRegisterInputType',
  description: 'A Stack is a group of actions that can be triggered at once or sequentially by a controller',
  fields: {
    manufacturer: {
      type: GraphQLString
    },
    model: {
      type: GraphQLString
    },
    serialNumber: {
      type: GraphQLString
    }
  }
})

export default controllerRegisterInputType
