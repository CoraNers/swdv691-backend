// Set up
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');
var app = express();

// Configuration
mongoose.connect('mongodb+srv://dbUser:dbPassword@capstone-cluster.trqpg.mongodb.net/capstone?retryWrites=true&w=majority')

 .then(() => {
    console.log('Connected to database');
    var port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
    });
  });

  app.use(bodyParser.urlencoded({'extended': 'true'}));
  app.use(bodyParser.json());
  app.use(bodyParser.json({type: 'application/vnd.api+json'}));
  app.use(methodOverride());
  app.use(cors());
  
  app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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

// root route
app.get('/', (request, response) => {
    response.json({ info: 'Let\'s Multiply backend server successfully loaded.' });
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
    GameData.create({
        userId: req.body.userId,
        problemsAndAnswers: req.body.problemsAndAnswers,
        mode: req.body.mode,
        category: req.body.category,
        date: req.body.date,
        questionsAttempted: req.body.questionsAttempted,
        questionsCorrect: req.body.questionsCorrect,
        lengthOfTime: req.body.lengthOfTime
    }, function (err, gamedata) {
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

// Get user history (all GameData models for a particular userId)
app.get('/history/:userId', function (req, res) {
    GameData.find({userId: req.params.userId}, function (err, gamedataDocuments) {
        if (err) {
            // some kind of error happened.  
            res.status(400).send('Something went wrong. Please try again.');
            console.log(err);
        } else {
            if (gamedataDocuments) {
                // gamedata has been found for the userId. send it back.
                res.status(200).json(gamedataDocuments);
            } else {
                // query worked but something went wrong?
                res.status(400).send('Something went wrong. Please try again.');
            }
        }
    });
});

// Start app and listen on port 8080  
console.log('Let\'s Multiply! server listening on port  - ', (process.env.PORT || 8080));