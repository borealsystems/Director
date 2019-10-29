import find from 'lodash/find'
import filter from 'lodash/filter'
import sumBy from 'lodash/sumBy'
import {
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema
} from 'graphql'

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Users in company',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    first_name: { type: new GraphQLNonNull(GraphQLString) },
    last_name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString },
    gender: { type: GraphQLString },
    department: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    todo_count: {
      type: GraphQLInt,
      resolve: (user) => {
        return sumBy(
          Todos, todo => todo.userId === user.id ? 1 : 0
        )
      }
    },
    todos: {
      type: new GraphQLList(TodoType),
      resolve: (user, args) => {
        return filter(
          Todos, todo => todo.userId === user.id
        )
      }
    }
  })
})

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  description: 'Task for user',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLString },
    completed: { type: new GraphQLNonNull(GraphQLBoolean) },
    user: {
      type: UserType,
      resolve: (todo, args) => {
        return find(Users, user => user.id === todo.userId)
      }
    }
  })
})

const TodoQueryRootType = new GraphQLObjectType({
  name: 'TodoAppSchema',
  description: 'Root Todo App Schema',
  fields: () => ({
    users: {
      args: {
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        department: { type: GraphQLString },
        country: { type: GraphQLString }
      },
      type: new GraphQLList(UserType),
      description: 'List of Users',
      resolve: (parent, args) => {
        if (Object.keys(args).length) {
          return filter(Users, args)
        }
        return Users
      }
    },
    todos: {
      args: {
        userId: { type: GraphQLInt },
        completed: { type: GraphQLBoolean }
      },
      type: new GraphQLList(TodoType),
      description: 'List of Todos',
      resolve: (parent, args) => {
        if (Object.keys(args).length) {
          return filter(Todos, args)
        }
        return Todos
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: TodoQueryRootType
})
export default schema
