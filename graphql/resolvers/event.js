const {dateToString}= require('../../helpers/date')
const Event = require("../../models/event");
const User = require('../../models/user')
const {transformedEvent } =require('./merge')




module.exports = {
    // Fetching all events
    events: () => {
      return Event.find()
        .then((events) => {
          return events.map((event) => {
            return transformedEvent(event)
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
        creator: "600015b97e666a1224dfe08c",
      });
      let createdEvent;
      return event
        .save()
        .then((result) => {
          createdEvent = transformedEvent(result)
          consola.success("event added successfully");
          return User.findById("600015b97e666a1224dfe08c");
        })
        .then((user) => {
          if (!user) {
            throw new Error("User not found.");
          } else {
            user.createdEvents.push(event);
            return user.save();
          }
        })
        .then(() => {
          return createdEvent;
        })
        .catch((err) => {
          throw err;
        });
    },
  };
  