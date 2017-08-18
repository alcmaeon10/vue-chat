var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 5000;

var io = require('socket.io')(server);

server.listen(port, function () {
    console.log('Listening on port: ' + port)
});

app.use(express.static(__dirname));

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html')
});

app.get('/onlineusers', function (request, response) {
    response.send(io.sockets.adapter.rooms)
});

io.on('connection', function (socket) {

    //Tell all clients that someone connected
    io.emit('user joined', socket.id)

    // The client sends 'chat.message' event to server
    socket.on('chat.message', function (message) {
        //emit this event to all clients connected to it
        io.emit('chat.message', message)
    })

    socket.on('disconnect', function () {
        console.log('User: ' + socket.id + ' disconnected')
        //Tell all clients that someone disconnected
        socket.broadcast.emit('user left', socket.id)
    })
});