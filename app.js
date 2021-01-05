var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {buildSchema } = require('graphql');
const {graphqlHTTP} = require('express-graphql');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const events = [];
 
app.use(
    '/graphql', graphqlHTTP({
      schema: buildSchema(`
      type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
            schema {
                query: RootQuery
                mutation: RootMutation
            }
      `),

      rootValue:{
        events: () => {
            return events;
        },
        createEvent: (args)=> {
            console.log(args)

            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event);
            return event;

            // const eventName = args.name;
            // return eventName;

        }
      },
      graphiql: true,
    }),
  );




module.exports = app;
