import {
  GraphQLObjectType,
  GraphQLString 
} from 'graphql'

import globalColourType from '../coreTypes/globalColourType'

const tagType = new GraphQLObjectType({
  name: 'tagType',
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
      type: globalColourType
    }
  }
})

export default tagType