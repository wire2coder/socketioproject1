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
        console.log('a client is connected');

        var chat = db.collection('chats');

        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err
            }

            res.forEach(function (asdf) {
                // console.log(asdf.name + ': ' + asdf.message);
                // var x = asdf.name + ': ' + asdf.message;
                client.emit('chat', {name: asdf.name, message: asdf.message});
            });

        });


        client.on('disconnect', function () {
            console.log(' a client is DISCONNECTED');
        });


        client.on('chat message', function (data) {

            chat.insert({name: data.name, message: data.message}, function () {
                console.log('Server: stuff inserted');

                client.broadcast.emit('chat', data);
                client.emit('chat', data);
            });

        });

        client.on('clear', function (data) {
            console.log('Server: clear');

            chat.remove({}, function (err) {
                if (err) {
                    throw err;
                }

                console.log('Server: I cleared chat collections');
            });
        });

    });

}); // mongo.connect






server.listen(3000);
console.log('Server running on port 3000');