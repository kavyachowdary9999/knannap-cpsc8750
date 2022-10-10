// use the express library
const express = require('express');



// create a new server application
const app = express();


app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
let nextVisitorId = 1;
// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

function lastAccessed(lastAccessedTime) {
    var time = Date.now() - lastAccessedTime;
    var total = time / 1000;
    var sec = Math.floor(total);
    return sec;
}

// The main page of our website
app.get('/', (req, res) => {
    if (isNaN(req.cookies['visitorId'])) {
        nextVisitorId++;
    }

    res.cookie('visitorId', nextVisitorId)

    // To check for first time
    var data = "";
    if (isNaN(lastAccessed(req.cookies['visited']))) {
        data = "Welcome to this website";
    } else {
        data = "It has been " + lastAccessed(req.cookies['visited']) + " seconds since your last visit";
    }

    res.cookie('visited', Date.now().toString());
  res.render('welcome', {
      name: req.query.name || "World",
      last_accessed: new Date().toLocaleString() || "10/09/2022, 00:00:00 PM",
      visitorNumber: `${data}`,
      id: req.cookies['visitorId'] || nextVisitorId
  });
    console.log(req.headers.cookie);
});


// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");