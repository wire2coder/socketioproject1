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

socket.on('connection', function (client) {
    console.log('Server: client is connected');

    // Listening for event on 'message'
    client.on('message', function (data) {
        console.log('Received message from client!', data.m1);


    });

    client.emit('message', 'jimjim');

});


server.listen(3000);
console.log('Server running on port 3000');