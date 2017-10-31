**Course Order of Setup**

1. Create express server, middleware
2. Create schema file
3. Give GraphQL a root query (entry point to start traversing the data)
4. RootQuery houses the parameters to travers each data type 'ie UserType'
5. RESOLVE function is a required property of field you're asking graphql to traverse, takes in parentValue and args arguments. This fn actually grabs the data.  parentValue is pretty much useless but required
6. Pass RootQuery to GraphQLSchema
7. Export the schema
8. Import schema into server.js and use it in expressGraphQL options Object
9. Setup relationships between types
10. Convert fields object to a fn that returns a field obj in order for circular dependencies to work via closure scopes

```
# GraphQL Operations from graphiql UI in browser

{
  user(id:"23"){
    firstName
    age
    company {
      ...companyInfo
      users {
        id
        firstName
      }
    }
  }

  company(id: "2"){
		...companyInfo
    users {
      id
    }
  }
}

# fragments for company id name and desc

fragment companyInfo on Company {
    id
    name
    description
}

# mutation
# the body of the fn is the props you want back from the server after the resolve function finishes
mutation {
  addUser(
    firstName: "Roxie",
    age: 8
  ) {
    id
    firstName
  }
}

mutation {
  deleteUser(
		id: "rylycaQA-"
  ) {
    id
  }
}
```
