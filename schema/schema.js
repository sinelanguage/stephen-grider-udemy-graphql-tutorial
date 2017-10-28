const graphql = require('graphql')
const axios = require('axios')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema, // takes in RootQuery and returns a schema
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

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: { // tell graph ql that if i want a user, i can find the user based keys on the args property
      type: UserType,
      args: { id: {type: GraphQLString}},
      resolve( parentValue, args ) { // required params, required fn on field object: this fn actually grabs the data
        // parentValue is pretty much useless but required

        return axios.get(`http://localhost:3000/users/${args.id}`) // resolve can handle a promise which is what axios returns
                .then(resp => resp.data) // this is axios specific as the response is always an object on the data property of axios which is what we don't want, we just want raw json data

      }
    }
  }
})

// finally export the schema, pass in a config object with property query = RootQuery
module.exports = new GraphQLSchema({
  query: RootQuery
})
