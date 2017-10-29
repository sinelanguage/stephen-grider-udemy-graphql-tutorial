const graphql = require('graphql')
const axios = require('axios')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema, // takes in RootQuery and returns a schema,
  GraphQLList,
  GraphQLNonNull
} = graphql

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id:           { type: GraphQLString },
    name:         { type: GraphQLString },
    description:  { type: GraphQLString },
    users:        {
      type: new GraphQLList(UserType), // needed to wrap UserType in a GraphQLList constructor to tell CompanyType that users is a list
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data)
      }
    }
  })
})

// used to construct a graphQL object type, not the object itself
const UserType = new GraphQLObjectType({
  name: 'User', // required property: String Cap
  fields: () => ({
    id:         { type: GraphQLString }, // each field gets a 'type' Object
    firstName:  { type: GraphQLString },
    age:        { type: GraphQLInt },
    company:    { // its important that this key is a different name from the data models key "companyId", this tells graphQL to run the resolve fn
      type: CompanyType, // GraphQL doesn't care if its built in or custom
      resolve(parentValue, args){
        console.log(parentValue, args)
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data)
      }
    }
    // We have to teach GraphQL how to associate a user with a company
  }) // field is a required property: type Object
  // in order for circular dependencies on a type declared after this type, to work, we need to wrap the fields object in a fn
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
    },

    company: {
      type: CompanyType,
      args: {id: {type: GraphQLString}},
      resolve( parentValue, args ) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(resp => resp.data)
      }
    }
  }
})

// the fields of a mutation describe the operations that will be performed on the data
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: { // name of field should be the purpose of the mutation
      type: UserType, // the type bring returned from the operation
      args: {
        firstName:    { type: new GraphQLNonNull( GraphQLString ) },  // GraphQLNonNull is a helper to assert that a value is required
        age:          { type: new GraphQLNonNull( GraphQLInt ) },
        description:  { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }){ // destructured firstName and age off args object as its passed in

        return axios.post('http://localhost:3000/users', { firstName, age })
          .then(res => res.data)
      }
    }
  }
})

// finally export the schema, pass in a config object with property query = RootQuery
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation // root mutation property is called 'mutation'
})
