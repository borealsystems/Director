import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import panelType from '../panelTypes/panelType'
import controllerLayoutType from './controllerLayoutType'

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
    layout: {
      type: controllerLayoutType
    },
    type: {
      type: new GraphQLObjectType({
        name: 'controllerLayoutTypeType',
        fields: {
          id: {
            type: GraphQLString
          },
          label: {
            type: GraphQLString
          }
        }
      })
    },
    id: {
      type: GraphQLString
    },
    status: {
      type: GraphQLString
    },
    core: {
      type: GraphQLString
    },
    realm: {
      type: GraphQLString
    }
  }
})

export default controllerType
