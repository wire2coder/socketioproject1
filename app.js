// make an Express web server

var mongo = require('mongodb').MongoClient;

var express = require('express');
var app = express();
var server = require('http').createServer(app);

// creating a socket instance
var socket = require('socket.io')(server);

var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

mongo.connect('mongodb://localhost/mongochat', function (err, db) {
    if(err) {
        throw err;
    }

    // Add a connect listener
    socket.on('connection', function(socket) {

        // Success! Now listen to messages to be received

        var chat = db.collection('chats');
        chat.find().limit(100).sort({_id: 1}).toArray(function (err, res) {
            if (err) {
                throw err;
            }
        });
    }); // socket.on
});

/*
app.get('/', function(req, res) {
    res.sendFile('index.html');
});
*/

server.listen(3000);
console.log('Server started on port 3000');


