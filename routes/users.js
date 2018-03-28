var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/users');
var Songs = require('../models/songs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        artistName : req.body.artistName,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg:'Failed to register user'});
        } else {
            res.json({success: true, msg:'User registered'});
        }
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 604800
                })

                res.json({
                    success: true,
                    token: 'Bearer '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        artistName : user.artistName,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

// router.get('/songscount', (req, res, next) => {
//   var usersSongsCount = [] ;
//   var count = 0;
//       User.find((err, users) => {
//       if(err){} //do something...
//             users.map(user => {
//                 Songs.count({artistID: (user._id)},function(err, count){
//                     if(err){
//                         res.send(err);
//                     }
//                     console.log("found");
//                     var data ={
//                         user: user.artistName,
//                         count : count
//                     };
//                     usersSongsCount.push(data) ;
//                     console.log(JSON.stringify(data));
//                     });
//                 }).then(res.json(usersSongsCount));
//              });
//       });


router.get('/validation/username/:username', function(req, res, next){

    User.findOne({username: (req.params.username)}, function(err, user){
        if(err){
            res.send(err);
        }
        else{
            res.json(user);
        }

    });
});
router.get('/validation/email/:email', function(req, res, next){

    User.findOne({email: (req.params.email)}, function(err, user){
        if(err){
            res.send(err);
        }
        else{
            res.json(user);
        }
    });
});

router.get('/validation/:artistName/:email/:username', function(req, res, next){

    User.findOne({$or:[ {artistName: (req.params.artistName)},{email: (req.params.email)},{username: (req.params.username)} ]}, function(err, user){
       res.json(user);
    });
});

router.get('/:id', function(req, res, next){
    User.findOne({_id: (req.params.id)}, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});
// get all users
router.get('/', function(req, res, next){
    User.find(function (err,songs) {
        if(err)
        {
            res.send(err);
        }
        res.json(songs);
    });
});

router.post('/search', function(req, res, next){
    const user = {
        name: req.body.name,
        artistName: req.body.artistName,
        email: req.body.email
    };
    User.find({
        name:{"$regex" : user.name, "$options" : "i"},
        artistName:{"$regex" : user.artistName, "$options" : "i"},
        email:{"$regex" : user.email, "$options" : "i"}
    },function(err, users){
        if(err){
            res.send(err);
        }

        res.json(users);
    });
});
module.exports = router;