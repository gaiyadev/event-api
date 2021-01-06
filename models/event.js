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
    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        ref:'User'
    },
    date: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('Event', EventSchema);;

//FUNCTION TO CREATE
module.exports.newEvent = async (createdEvent, callback) => {
  await  createdEvent.save(callback); //create New Event
}


