import {
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType
} from 'graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

const deviceUpdateInputType = new GraphQLInputObjectType({
  name: 'deviceUpdate',
  fields: {
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    status: {
      type: GraphQLString
    },
    realm: {
      type: GraphQLString
    },
    core: {
      type: GraphQLString
    },
    provider: {
      type: new GraphQLInputObjectType({
        name: 'deviceProviderDetailInputType',
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
    configuration: {
      type: new GraphQLList(
        GraphQLJSONObject
      )
    }
  }
})

export default deviceUpdateInputType
