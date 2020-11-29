import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import providerType from '../providerTypes/providerType'

const deviceType = new GraphQLObjectType({
  name: 'Device',
  fields: {
    label: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    id: {
      type: GraphQLString
    },
    realm: {
      type: GraphQLString
    },
    core: {
      type: GraphQLString
    },
    provider: {
      type: providerType
    },
    status: {
      type: GraphQLString
    },
    configuration: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'deviceConfigurationObject',
          fields: {
            id: {
              type: GraphQLString
            },
            value: {
              type: GraphQLJSON
            }
          }
        })
      )
    }
  }
})

export default deviceType
