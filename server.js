var express = require("express")
  , http = require("http")
  , socketio = require("socket.io");

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);


// GLOBAL STATE
var state = {};


// CONFIG
app.configure(function() {
    app.use(express.static(__dirname + '/static'));
});


// ROUTES
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


// SOCKETS
io.sockets.on('connection', function (socket) {
  console.log('socket connected!');   
  socket.emit('state.current', state);
  socket.on('state.change', function(data) {
    socket.broadcast.emit('state.change', state);
  });
});



server.listen(8080, '0.0.0.0');


console.log("starting server!");
