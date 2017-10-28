const graphql = require('graphql')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = graphql

// used to construct a graphQL object type, not the object itself
const UserType = new GraphQLObjectType({
  name: 'User', // required property: String Cap
  fields: {
    id: { type: GraphQLString}, // each field gets a 'type' Object
    firstName: { type: GraphQLString},
    age: { type: GraphQLInt},
  } // required property: Object
})
