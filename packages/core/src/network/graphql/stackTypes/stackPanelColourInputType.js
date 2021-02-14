import {
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql'

const stackPanelColourInputType = new GraphQLInputObjectType({
  name: 'stackPanelColourInputType',
  description: 'A Colour',
  fields: {
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    }
  }
})

export default stackPanelColourInputType
