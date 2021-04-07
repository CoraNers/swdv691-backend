// Set up
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect("mongodb+srv://dbUser:dbPassword@capstone-cluster.trqpg.mongodb.net/capstone?retryWrites=true&w=majority"
 || "mongodb://192.168.0.24:27017/capstone")
 .then(() => {
    console.log('Connected to database');
    var port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
    });
  });

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(methodOverride());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var UserData = mongoose.model('UserData', {
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    isStudent: Boolean, // field not used for MVP
    isParent: Boolean, // field not used for MVP
    isTeacher: Boolean // field not used for MVP
});

var GameData = mongoose.model('GameData', {
    userId: String,
    rowId: Number,
    problemsAndAnswers: Array,
    mode: String,
    category: String,
    date: String,
    questionsAttempted: Number,
    questionsCorrect: Number,
    lengthOfTime: String,
});


// Authenticate user
app.get('/login', function (req, res) {

    UserData.findOne({ 
        username: req.query.username,
        password: req.query.password
    }, function (err, userDataDocument) {
        if (err) {
            // some kind of error happened.  
            res.status(400).send('Something went wrong. Please try again.');
            console.log(err);
        } else {
            if (userDataDocument) {
                // user is found in the db by username/password. send it back
                res.status(200).json(userDataDocument);
            } else {
                // query worked but credentials could not be verified in the db.  send back unauthorized.
                res.status(401).send('User is not authorized. Please try again.');
            }
        }
    });
});

// Save gameplay data to database
app.post('/play/completed', function (req, res) {
    console.log('Attemping to save gameplay data..............!');
    // console.log(req.body);

    GameData.create({
        userId: req.body.userId,
        problemsAndAnswers: req.body.problemsAndAnswers,
        mode: req.body.mode,
        category: req.body.category,
        date: "04/07/21 6:28 pm", // TODO proper date
        questionsAttempted: req.body.questionsAttempted,
        questionsCorrect: req.body.questionsCorrect,
        lengthOfTime: undefined // TODO if evaluation mode this should not be undefined
    }, function (err, gamedata) {
        console.log('---------------------------------------- mongoose !!!!');
        console.log(gamedata);
        if (err) {
            // some kind of error happened.  
            res.status(400).send('Something went wrong. Please try again.');
            console.log(err);
        } else {
            // once successfully persisted - return that one JSON document for UI display
            res.status(201).json(gamedata);
        }
    });
});

// Start app and listen on port 8080  
console.log("Let's Multiply! server listening on port  - ", (process.env.PORT || 8080));