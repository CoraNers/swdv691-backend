// Set up
var express = require('express');
// var app = express();
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
//   .use(bearerToken())
  .use(methodOverride());

// app.use(bodyParser.urlencoded({'extended': 'true'}));
// app.use(bodyParser.json());
// app.use(bodyParser.json({type: 'application/vnd.api+json'}));
// app.use(methodOverride());
// app.use(cors());

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


// Authenticate user
app.get('/login', function (req, res) {

    console.log('inside server side login');
    console.log('username!!!!! ' + req.query.username);
    console.log('password!!!!! ' + req.query.password);

    UserData.findOne({ 
        username: req.query.username,
        password: req.query.password
    }, function (err, userDataDocument) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
            console.log('error');
            console.log(err);
        } 
            console.log('new **************************');
            console.log(userDataDocument);
            res.json(userDataDocument); // return document with userData from MongoDB
    });
});

// Start app and listen on port 8080  
// app.listen(process.env.PORT || 8080);
console.log("Let's Multiply! server listening on port  - ", (process.env.PORT || 8080));