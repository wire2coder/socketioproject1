// make an Express web server

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.sendFile('index.html');
});

io.on('connection', function (socket) {
    console.log('a user is connected');
});



server.listen(3000);
console.log('Server started on port 3000');


