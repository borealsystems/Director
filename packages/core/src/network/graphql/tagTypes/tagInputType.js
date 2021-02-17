import {
  GraphQLInputObjectType,
  GraphQLString 
} from 'graphql'

import globalColourInputType from '../coreTypes/globalColourInputType'

const tagInputType = new GraphQLInputObjectType({
  name: 'tagInputType',
  fields: {
    core: {
      type: GraphQLString
    },
    realm: {
      type: GraphQLString
    },
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    colour: {
      type: globalColourInputType
    }
  }
})

export default tagInputType