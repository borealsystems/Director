import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const stackPanelColourType = new GraphQLObjectType({
  name: 'stackPanelColourType',
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

export default stackPanelColourType
