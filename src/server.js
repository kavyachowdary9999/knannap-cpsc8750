const fetch = require('node-fetch');
// use the express library
const express = require('express');

// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

let nextVisitorId = 1;
const cookieParser = require('cookie-parser');
// ... snipped out code ...

app.use(cookieParser());

app.get("/trivia", async (req, res) => {
    // fetch the data
    const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

    // fail if bad response
    if (!response.ok) {
        res.status(500);
        res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
        return;
    }

    // interpret the body as json
    const content = await response.json();

    // fail if db failed
    if (content.response_code !== 0) {
        res.status(500);
        res.send(`Open Trivia Database failed with internal response code ${content.response_code}`);
        return;
    }

    const respvalue = content.results[0]
    var final_answers = []
    final_answers.push(respvalue.correct_answer);
    correct_and_wrong_answers = final_answers.concat(respvalue.incorrect_answers);

    let all_answers = correct_and_wrong_answers
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    const answerLinks = all_answers.map(answer => {
        return `<a href="javascript:alert('${answer === respvalue.correct_answer ? 'Correct!' : 'Incorrect, Please Try Again!'
            }')">${answer}</a>`
    })
    console.log(correct_and_wrong_answers);

    // respond to the browser
    // TODO: make proper html
    res.render('trivia', {
        question: respvalue.question,
        category: respvalue.category,
        difficulty: respvalue.difficulty,
        answers: answerLinks
    })


});

app.get('/', (req, res) => {

    if (isNaN(req.cookies['visitorId'])) {
        nextVisitorId++;
    }
    res.cookie('visitorId', nextVisitorId);


    var last_visit = "";
    var last_tried = req.cookies['visited'];
    var lstTime = Math.floor((Date.now() - last_tried) / 1000);
    if (isNaN(lstTime)) {
        last_visit = "You have never visited";
    }
    else {
        last_visit = "It has been " + lstTime + " seconds since your last visit";
    }
    res.cookie('visited', Date.now());
    res.render('welcome', {
        name: req.query.name || "World!!",
        last_tried: new Date().toLocaleString() || "10/9/2022 , 00:00:00 AM",
        how_long: `${last_visit}`,
        id: req.cookies['visitorId'] || nextVisitorId
    });
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");

// To tell about public folder
app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');
