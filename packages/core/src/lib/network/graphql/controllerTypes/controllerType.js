import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import panelType from '../panelTypes/panelType'

const controllerType = new GraphQLObjectType({
  name: 'controllerType',
  description: 'Controller Type for both hardware and bridged controllers',
  fields: {
    manufacturer: {
      type: GraphQLString
    },
    model: {
      type: GraphQLString
    },
    serial: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    panel: {
      type: panelType
    },
    id: {
      type: GraphQLString
    },
    status: {
      type: GraphQLString
    }
  }
})

export default controllerType
