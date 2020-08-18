import {
  GraphQLInputObjectType,
  GraphQLString
} from 'graphql'

import panelUpdateInputType from '../panelTypes/panelUpdateInputType'

const controllerType = new GraphQLInputObjectType({
  name: 'controllerInputType',
  description: 'Controller Input Type for both hardware and bridged controllers',
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
      type: panelUpdateInputType
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
