**Course Order of Setup**

1. Create express server, middleware
2. Create schema file
3. Give GraphQL a root query (entry point to start traversing the data)
4. RootQuery houses the parameters to travers each data type 'ie UserType'
5. RESOLVE function is a required property of field you're asking graphql to traverse, takes in parentValue and args arguments. This fn actually grabs the data.  parentValue is pretty much useless but required
6. Pass RootQuery to GraphQLSchema
7. Export the schema
8. Import schema into server.js and use it in expressGraphQL options Object
