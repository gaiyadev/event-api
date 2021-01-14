const User = require("../../models/user");
const Event = require('../../models/event')
const {dateToString} =require('../../helpers/date')

const transformedEvent = event=> {
    return {
      ...event._doc,
      _id: event.id,
      date: dateToString(event._doc.date),
      creator: user.bind(this, event._doc.creator),
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
  

  //exports.user =user;
//   exports.events = events;
 // exports.singleEvent =singleEvent;
  exports.transformedEvent = transformedEvent
  exports.transformedBooking =transformedBooking
