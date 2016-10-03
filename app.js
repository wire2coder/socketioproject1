// make an Express web server
var express = require('express');
var app = express();
var server = require('http').createServer(app);

var mongo = require('mongodb').MongoClient;

// creating a socket instance
var socket = require('socket.io')(server);

var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

mongo.connect('mongodb://localhost/mongochat', function (err, db) {
    if (err) { throw err; }
    console.log('Connected the Mongo');

    socket.on('connection', function (client) {
        console.log('Server: client is connected');

        var chat = db.collection('chats');
        chat.find().limit(100).toArray(function (err, response) {
            console.log(response);

            // send data to the client on the channel 'output'
            console.log('Server: sending response to the client');
            client.emit('output', response);
        });

        client.on('input', function (data) {
            var name = data.name;
            var message = data.message;

            if(name === '' || message =='') {
                // make user insert name and messages
                client.emit('status', 'Please enter a name and a message');

            } else {
                // insert name and messages into MongoDB
                //chat.insert({name: name, message: message}, function () {
                //    console.log('Server: stuff inserted');
                //});

                client.emit('output', [data])
            }

        });


        // Listening for event on 'message'
        client.on('message', function (data) {
            console.log('Server: Received message from client!', data);
        });
    }); // socket.on('connection'
}); // mongo.connect

server.listen(3000);
console.log('Server running on port 3000');