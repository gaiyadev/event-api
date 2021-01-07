var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const consola = require("consola");
require("dotenv").config();
const Event = require("./models/event");
const User = require("./models/user");
const bcrypt = require("bcrypt");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const events = [];

app.use(
  "/graphql",
  graphqlHTTP({
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

    rootValue: {
      // Fetching all events
      events: () => {
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc, _id: event.id  };
            });
          })
          .catch((err) => {
            consola.error(new Error(err));
          });
      },

      // creating new event
      createEvent: (args) => {
        const { title, description, date, price } = args.eventInput;
        const event = new Event({
          title: title,
          description: description,
          price: +price,
          date: new Date(date),
          creator: "5ff59359fc93c140fa28de47",
        });

        Event.newEvent(event, (err) => {
          if (err) return err;
          consola.success("event added successfully");
          events.push(event);
        });
        return event;
      },
      // create User
      createUser: (args) => {
        const { email, password } = args.userInput;
        return User.findOne({ email: email })
          .then((user) => {
            if (user) {
              throw new Error("User already exist.");
            } else {
              return bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                  const newUser = new User({
                    email: email,
                    password: hashedPassword,
                  });
                  return newUser.save();
                })
                .then((result) => {
                  consola.success("User added successfully");
                  return { ...result._doc, password: null };
                })
                .catch((err) => {
                  throw err;
                });
            }
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

module.exports = app;
