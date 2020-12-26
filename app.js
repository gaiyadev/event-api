var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {buildSchema } = require('graphql');
const {graphqlHTTP} = require('express-graphql');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
    type RootQuery {
        events: [String!]!
    }

    type RootMutation {
        createEvent(name: String): String
    }

    schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    graphiql: true,
    rootValue:{
        events: ()=> {
            return ['romance', 'war', 'love'];
        }
    },
    createEvent: (args) => {
        const eventName = args.name; 
        return eventName;
    }
},

));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;
