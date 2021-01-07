const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require("bcrypt");
const consola = require("consola");

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}}).then(events=> {
      return events.map(event=> {
        return {
          ...event._doc,
           _id: event.id,
            creator: user.bind(this, event.creator)
        }
      })
    }).catch(err=> {
      throw err;
    })
  }
  
  const user = userId => {
    return User.findById(userId).then(user => {
      return {
        ...user._doc, 
        _id: user.id, 
        createdEvents: events.bind(this, user._doc.createdEvents)
      }
    }).catch(err => {
      throw err;
    });
  };

module.exports = {
    // Fetching all events
    events: () => {
      return Event.find()
        .then((events) => {
          return events.map((event) => {
            return {
                 ...event._doc,
                  _id: event.id,
                  date: new Date(event._doc.date).toISOString(),
              creator: user.bind(this, event._doc.creator)
            };
          });
        })
        .catch((err) => {
          consola.error(new Error(err));
        });
    },

    // creating new event
    createEvent: args => {
      const { title, description, date, price } = args.eventInput;
      const event = new Event({
        title: title,
        description: description,
        price: +price,
        date: new Date(date),
        creator: "5ff784f09c441239e33d52cf",
      });
      let createdEvent;
      return  event.save().then(result => {
        createdEvent =  {
          ...result._doc, 
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, result._doc.creator)
        };
          consola.success("event added successfully");
       return User.findById('5ff784f09c441239e33d52cf')
        }).then(user=> {
          if (!user) { 
            throw new Error("User not found.");
          }else {
            user.createdEvents.push(event);
            return user.save();
          }
        }).then(() => {
           return createdEvent; 

        })
        .catch(err=> {
          throw err;
        });
    },
    // create User
    createUser: args => {
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
  }