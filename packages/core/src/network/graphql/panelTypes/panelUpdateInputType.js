import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql'

import stackUpdateInputType from '../stackTypes/stackUpdateInputType'

const panelUpdateInputType = new GraphQLInputObjectType({
  name: 'panelUpdateInputType',
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
    layoutType: {
      type: new GraphQLInputObjectType({
        name: 'panelUpdateLayoutTypeInputType',
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
      type: new GraphQLInputObjectType({
        name: 'panelUpdateLayoutInputType',
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
          new GraphQLInputObjectType({
            name: 'panelUpdateButtonInputType',
            fields: {
              row: {
                type: GraphQLInt
              },
              column: {
                type: GraphQLInt
              },
              stack: {
                type: stackUpdateInputType
              }
            }
          })
        )
      )
    }
  }
})

export default panelUpdateInputType
