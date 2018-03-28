const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const LocationsSchema = new Schema({
    endLatitude:{
        type: String,
        required: true
    },
    endLongitude:{
        type: String,
        required: true
    },
    song:{
        type : Schema.Types.ObjectId,
        ref : 'songs'
    },
    startLatitude:{
        type: String,
        required: true
    },
    startLongitude:{
        type: String,
        required: true
    }
});

var Location = mongoose.model('locations', LocationsSchema);

module.exports = Location;