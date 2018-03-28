const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Schema = mongoose.Schema;

// User Schema
const UserSchema =  new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    artistName:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

var User  = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
    newUser.password = hash;
    newUser.save(callback);
});
});
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err){};
        callback(null, isMatch);
    });
}