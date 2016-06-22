// Require the express dependencies to help build routes
var express = require('express');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('trail.db');

// Initializing SQLite3 database
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='trail'",
       function(err, rows) {
  if(err !== null) {
    console.log(err);
  }
  else if(rows === undefined) {
    db.run('CREATE TABLE "trail" ' +
           '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"trail_name" VARCHAR(150), ' +
           '"lat" FLOAT,' +
           '"long" FLOAT,' +
           '"description" TEXT,' +
           '"review" TEXT,' +
           '"username" VARCHAR(25))', function(err) {
      if(err !== null) {
        console.log(err);
      }
      else {
        console.log("SQL Table 'trail' initialized.");
      }
    });
  }
  else {
    console.log("SQL Table 'trail' already initialized.");
  }
});
// Declaring other variables
// The var port is set to list to to the port specified in the ENV variable or on 8080
var port = process.env.PORT || 8080;


// Create an express app using an instance of express
var app = express();

// Tell express to serve the files within the public folder - ie. CSS and JS
app.use(express.static(__dirname + "/public"));

// Create an express route to the home page
app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname + "/public" + "/index.html"));
  });


// Start the server
app.listen(port);
// Console log that the server is started!
console.log("Magic is happening on port 8080");
