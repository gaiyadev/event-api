const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const bcrypt = require("bcrypt");
const consola = require("consola");
const {dateToString}= require('../../helpers/date')

const transformedEvent = event=> {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator),
  };
}

const transformedBooking = booking=> {
  return {
    ...booking._doc,
    _id: booking.id,
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event)
  };
}

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then((events) => {
      return events.map((event) => {
        return  transformedEvent(event);
      });
    })
    .catch((err) => {
      throw err;
    });
};

const user = (userId) => {
  return User.findById(userId)
    .then((user) => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    })
    .catch((err) => {
      throw err;
    });
};

const singleEvent = async eventId => {
    try {
      const event =  Event.findOne({_id: eventId});
      return transformedEvent(event)
    } catch (err) {
        throw err;
    }
}


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
  bookings: async () => {
    try {
      const bookings = await Booking.find();

      return bookings.map((booking) => {
        return transformedBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    const fetchEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      eventId: fetchEvent,
      user: "600015b97e666a1224dfe08c",
    });
    const result = await booking.save();
    return transformedBooking(result)
  },
  cancelBooking: async args => {
        try {
          const booking  = await Booking.findById(args.bookingId).populate('event');

          const event = transformedEvent(booking.event)
          consola.log(event)   

          await Booking.deleteOne({_id: args.bookingId});
          return event;
        } catch (err) {
          throw err;
        }
  }
};
