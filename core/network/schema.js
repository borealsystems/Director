import { definitions, ProviderRequirements } from '../libs/globals'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import { find } from 'lodash'

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      // definitions: { // Device Definitions
      //   type: new GraphQLList(new GraphQLObjectType({
      //     fields: {
      //       name: {
      //         type: GraphQLString!,
      //         resolve: () => { 'Ross Carbonite Black' }
      //       }
      //       manufacturer: {
      //         type: GraphQLString!,
      //         resolve: () => { 'Ross Video' }
      //       }
      //       product: {
      //         type: GraphQLString!,
      //         resolve: () => { 'Carbonite Black' }
      //       }
      //     }
      //   }))
      // },
      definition: { // Full Device Definition
        type: GraphQLJSONObject,
        args: {
          definitionName: { type: GraphQLString }
        },
        resolve: (obj, args, context, info) => { return find(definitions, { name: args.definitionName }) }
      },
      providerRequirements: { // Provider Requirements
        type: GraphQLJSONObject,
        args: {
          provider: { type: GraphQLString }
        },
        resolve: (obj, args, context, info) => { return find(ProviderRequirements, args.provider) }
      },
      definitionNames: { // Device Definition Listing
        type: new GraphQLList(GraphQLString),
        resolve: () => definitions.map((key, index) => { return definitions[index].name })
      },
      status: { // Status Slug
        type: GraphQLString,
        resolve: () => { return 'good' }
      },
      statusMessage: { // Status Message
        type: GraphQLString,
        resolve: () => { return 'System Operating As Intended' }
      }
    }
  })
})

export { schema }
