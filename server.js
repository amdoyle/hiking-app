// Require the express dependencies to help build routes
var express = require('express');
var Sessions = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
// The var port is set to list to to the port specified in the ENV variable or on 8080
var port = process.env.PORT || 8080;
var trails = require('./routes/trails');
// var session = require('express-session');

// Create an express app using an instance of express
var app = express();
require('dotenv').config();

// app.use(require('flash')());
// app.use(function (req, res) {
//   // flash a message
//   req.flash('info', 'hello!');
//   next();
// })

// Tell express to serve the files within the public folder - ie. CSS and JS
app.use('/', trails);
app.use(express.static(__dirname + "/public"));

// additional middleware for passport and sessions
// Figure out the correct app.configure function for Express 4
  // app.use(express.static('public'));
  // app.use(express.cookieParser());
  // app.use(express.bodyParser());
  // app.use(express.session({ secret: 'keyboard cat' }));
  // app.use(passport.initialize());
  // app.use(passport.session());
  // app.use(app.router);

// parse application/json
app.use(bodyParser.json());

// Start the server
app.listen(port, function() {
  // Console log that the server is started!
  console.log("Magic is happening on port 8080");
});
