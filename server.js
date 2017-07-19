// Require the express dependencies to help build routes
var express = require('express');
var somethingsession = require('client-sessions');
var path = require('path');
var bodyParser = require('body-parser');

// The var port is set to list to to the port specified in the ENV variable or on 8080
var port = process.env.PORT || 8080;

// Create an express app using an instance of express
var app = express();

var trails = require('./routes/trails');

require('dotenv').config();

// Tell express to serve the files within the public folder - ie. CSS and JS
app.use('/', trails);
app.use(express.static(__dirname + "/public"));

// parse application/json
app.use(bodyParser.json());

// Start the server
app.listen(port, function() {
  // Console log that the server is started!
  console.log("Magic is happening on port 8080");
});
