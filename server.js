// Require the express dependencies to help build routes
var express = require('express');

// Declaring other variables
// The var port is set to list to to the port specified in the ENV variable or on 8080
var port = process.env.PORT || 8080;


// Create an express app
var app = express();


// Create an express route to the home page
app.get('/', function(req,res) {
  res.sendfile('index.html');
});

// Start the server
app.listen(port);
// Console log that the server is started!
console.log("Magic is happening on port 8080");
