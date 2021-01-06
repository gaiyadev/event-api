const mongoose = require('mongoose');
require('../database/db');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdEvents: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Event'
        }
    ],
    reg_date: {
        type: Date,
        default: Date.now
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.newUser = async (newUser, callback) => {
    await bcrypt.hash(newUser.password, 12, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;  //set hash password
        newUser.save(callback); //create New User
    });
}


// Compare Curent password and new password of user
module.exports.comparePassword = async (password, hash, callback) => {
    await bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        return callback(null, isMatch);
    });
}


// Find the user by Its email
module.exports.getUserByEmail = async (email, callback) =>{
    const query = {
        email: email
    } 
  await  User.findOne(query, callback);
}

// Find the user by ID
module.exports.getUserById =  (id, callback) =>{
    User.findById(id, callback);
}