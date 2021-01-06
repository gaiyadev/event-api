var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {buildSchema } = require('graphql');
const {graphqlHTTP} = require('express-graphql');
const consola = require('consola')
require('dotenv').config()
const Event =require('./models/event')
const User = require('./models/user')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const events = [];
 let createdUser;
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

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input UserInput {
        email: String!
        password: String!
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
            createUser(userInput: UserInput): User
        }
            schema {
                query: RootQuery
                mutation: RootMutation
            }
      `),

      rootValue:{
        // Fetching all events
        events: () => {
         return  Event.find().then(events=> {
              return  events.map(event => {
                return {...event._doc }
              });
            }).catch(err => {
              consola.error(new Error(err));

            });
        },

        // creating new event
        createEvent: (args)=> {
          const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price, 
            date: new Date(args.eventInput.date),
            creator: '5ff59359fc93c140fa28de47'
          }); 

           Event.newEvent(event, (err) => {   
            if (err) return err; 
            consola.success('event added successfully');
               events.push(event);
             }); 
            return event;     
        },
        // create User
        createUser: args => {
         User.getUserByEmail ( args.userInput.email, (err, isUser) => {
            if (err) throw err;
            if (isUser) {
                  consola.error('User  already exist')  
               throw new Error('User  already exist')
            }else {
              const user = new User({
                email: args.userInput.email,
                password: args.userInput.password,
              }); 
    
              User.newUser(user, (err, user) => {   
                if (err) return err; 
                createdUser = user;
              });
            }
          })       
          return createdUser;

        }
      },
      graphiql: true,
    }),
  );




module.exports = app;
