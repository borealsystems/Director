import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql'

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
      type: new GraphQLInputObjectType({
        name: 'controllerPanelInputType',
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
        name: 'controllerLayoutInputType',
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
    type: {
      type: new GraphQLInputObjectType({
        name: 'controllerLayoutTypeInputType',
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
