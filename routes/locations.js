var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Locations = require('../models/locations');



// GET location by song id
router.get('/:id', function(req, res, next) {
    Locations.findOne({song: (req.params.id)},function (err,locations) {
        if(err)
        {
            res.send(err);
        }
        res.json(locations);
    });

});
// GET all locations
router.get('/', function(req, res, next) {
    Locations.find(function (err,locations) {
        if(err)
        {
            res.send(err);
        }
        res.json(locations);
    });

});

module.exports = router;


