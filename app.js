var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);




const config = require('./config/database');

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Connect to mongoDB
mongoose.connect(config.database, function(err) {
    if (err){
        console.log("error connecting to db...")
    }
    console.log("connected to database...");
});

var routeIndex = require('./routes/index');
var routeSongs = require('./routes/songs');
var routeUsers = require('./routes/users');
var routeLocations = require('./routes/locations');

var router = express.Router();


// Set Static Folder
app.use(express.static(path.join(__dirname, '/client/dist')));

//AUTH



app.use(logger('dev'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//cookieParser Middleware
app.use(cookieParser());

//Cors Middleware
app.use(cors());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


app.use('/', routeIndex);
app.use('/songs', routeSongs);
app.use('/users', routeUsers);
app.use('/locations', routeLocations);


// Index Route
app.get('/', (req, res) => {
    res.send('invaild endpoint');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/dist/index.html'));
});



io.sockets.on('connection', (socket) => {

    console.log('user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('add-message', (message) => {
        io.sockets.emit('message', { type: 'new-message', text: message });

    });

});

const port =3000;
//Start Server
http.listen(port, function () {
    console.log('Server listening at port %d', port);
});


module.exports = app;
