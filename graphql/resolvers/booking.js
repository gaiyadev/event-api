const Booking = require("../../models/booking");
const Event = require('../../models/event')
const User = require('../../models/user')
const consola = require("consola");
const {transformedBooking, transformedEvent}=require('./merge')




module.exports = {
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
