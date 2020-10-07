import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql'

import stackType from '../stackTypes/stackType'

const panelType = new GraphQLObjectType({
  name: 'panelType',
  description: 'A Panel is a virtual abstraction of a control interface',
  fields: {
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    realm: {
      type: GraphQLString
    },
    core: {
      type: GraphQLString
    },
    layoutType: {
      type: new GraphQLObjectType({
        name: 'panelLayoutTypeType',
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
    layout: {
      type: new GraphQLObjectType({
        name: 'panelLayoutType',
        fields: {
          id: {
            type: GraphQLString
          },
          label: {
            type: GraphQLString
          },
          rows: {
            type: GraphQLInt
          },
          columns: {
            type: GraphQLInt
          }
        }
      })
    },
    buttons: {
      type: new GraphQLList(
        new GraphQLList(
          new GraphQLObjectType({
            name: 'panelButtonType',
            fields: {
              row: {
                type: GraphQLInt
              },
              column: {
                type: GraphQLInt
              },
              stack: {
                type: stackType
              }
            }
          })
        )
      )
    }
  }
})

export default panelType
