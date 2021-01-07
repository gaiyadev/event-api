var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { graphqlHTTP } = require("express-graphql");
require("dotenv").config();
var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const graphQlSchema = require("./graphql/schema/index");
const graphQLResolvers = require("./graphql/resolvers/index");

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQLResolvers,
    graphiql: true,
  })
);

module.exports = app;
