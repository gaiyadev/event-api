const mongoose = require('mongoose');
require('../database/db');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
});

// const Event = mongoose.model('Event', EventSchema);
module.exports = mongoose.model('Event', EventSchema);;

//FUNCTION TO CREATE
module.exports.newEvent = async (createdEvent, callback) => {
  await  createdEvent.save(callback); //create New Event
}


