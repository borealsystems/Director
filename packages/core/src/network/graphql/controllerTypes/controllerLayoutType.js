import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql'

const controllerLayoutType = new GraphQLObjectType({
  name: 'controllerLayoutType',
  description: 'Controller Layout Type for both hardware and virtual controllers',
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

export default controllerLayoutType
