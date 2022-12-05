// route for GraphQL 
const expressGraphQL = require('express-graphql').graphqlHTTP
const {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull} = require('graphql')
var { buildSchema } = require('graphql');

// GraphQL schema
/*
var schema = buildSchema(`
    type Query {
        message: String
    }
`);*/

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Root resolver
var root = {
    message: () => 'Hello World!'
};

module.exports = function(app){

    app.use('/graphql', expressGraphQL({
        schema: schema,
        rootValue: root,
        graphiql: true // UI to access graphQL
    }));

    /*
    app.get("/graphql", function(req, res){
        res.send("hello")
    });*/

}