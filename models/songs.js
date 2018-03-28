const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SongsSchema = new Schema({
    album:{
        type: String,
        required: true
    },
    artistID:{
        type: Schema.Types.ObjectId ,
        ref : 'users'
        // type: String,
        // required: true
    },
    length:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    songImage:{
        type: String,
        required: true
    },
    PlayedCount:{
        type: Number,
        required: false,
        default: 0
    }
});

var Song = mongoose.model('songs', SongsSchema);

module.exports = Song;

