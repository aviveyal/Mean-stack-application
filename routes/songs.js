var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var SongSchema = require('../models/songs');


// GET all songs
router.get('/', function(req, res, next) {
mongoose.model('songs').find(function (err,songs) {
    if(err)
    {
     res.send(err);
    }
    res.json(songs);
});

});

// Get Single Song
router.get('/:id', function(req, res, next){
    mongoose.model('songs').findOne({_id: (req.params.id)}, function(err, song){
        if(err){
        res.send(err);
        }
        res.json(song);
    });
});
// Get Songs by user ID
router.get('/user/:artistID', function(req, res, next){
    mongoose.model('songs').find({artistID: (req.params.artistID)}, function(err, song){
        if(err){
            res.send(err);
        }
        res.json(song);
    });
});
// Add Single Song
router.post('/' , function (req,res,next){
   var song = new SongSchema({
       album : req.body.album ,
       artistID : req.body.artistID ,
       length : req.body.length ,
       name :req.body.name ,
       songImage: req.body.songImage
   });

    //const data = SongSchema (req.body);
    song.save(function(err,song) {
        if (err){
          res.sendfile(err);
        }
        console.log('song saved successfully!');
        res.json(song);
    });

});
// Update Single Song
router.put('/update' , function (req,res,next){
    var song = req.body;
    var updSong = {};

    if(song.album){
        updSong.album = song.album;
    }
    if(song.length){
        updSong.length = song.length;
    }
    if(song.name){
        updSong.name = song.name;
    }
    if(song.songImage){
        updSong.songImage = song.songImage;
    }


    if(!updSong){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    }
    else {
        mongoose.model('songs').update({_id: (req.body._id)},updSong, {}, function(err, task){
            if(err){
                res.send(err);
            }
            res.json(song);
        });
    }

});

// Delete Single Song
router.delete('/delete/:id' , function (req,res,next){
    mongoose.model('songs').remove({_id: (req.params.id)}, function(err, song){
        if(err){
            res.send(err);
        }
        res.json(song);
        console.log(song);
    });

});

router.post('/search', function(req, res, next){
    const song = {
        name: req.body.songName,
        album: req.body.album,
        length: req.body.length
    };
    mongoose.model('songs').find({
        name:{"$regex" : song.name, "$options" : "i"},
        album:{"$regex" : song.album, "$options" : "i"},
        length:{"$regex" : song.length, "$options" : "i"}
    },function(err, songs){
        if(err){
            res.send(err);
        }
        res.json(songs);
    });
});

//get all songs group by artist ID

router.get('/users/topuploader', function(req, res, next){
    mongoose.model('songs').aggregate(
        [
            { "$group": {
                "_id": "$artistID",
                "uploadingCount": {"$sum": 1}
            }},
            {"$sort" : { "uploadingCount": -1 }},
            { "$limit" : 3 }
        ],function (err, result) {
            if (err) throw err;

            res.json(result);
        }

    )

});

//

router.get('/users/topPlayed', function(req, res, next){
    mongoose.model('songs').aggregate(
        [
            { "$group": {
                    "_id": "$artistID",
                    "songID" : { $first: '$_id' },
                    "MaxPlayedCount": { $max: "$PlayedCount"}
                }},
        ],function (err, result) {
            if (err) throw err;

            res.json(result);
        }

    )
});

module.exports = router;
