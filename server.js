var express = require("express")
  , http = require("http")
  , socketio = require("socket.io")
  , hbs = require("hbs")
  , _ = require("underscore");

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

// HBS TEMPLATE VARIABLE
var blocks = {};



//STATE UTILS
var setTempo = function(tempo) {
  state.tempo = tempo;
};

var generateSection = function() {
  return _.range(8);
};

var generateSections = function() {
  for(var i=0, len=8; i<len; i++) {
    state.sections.push(generateSection());
  };
};


// GLOBAL STATE
var availablePhrases = _.range(15);

var state = {};
state.tempo = null;
state.sections = [];

setTempo(120);
generateSections();

console.log(JSON.stringify(state));


// CONFIG
app.configure(function() {
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.engine('html', hbs.__express);
  app.use(express.static(__dirname + '/static'));
  app.use(express.bodyParser());
});


// TEMPLATE CONFIG
hbs.registerHelper('extend', function(name, context) {
  var block = blocks[name];
  if(!block) {
    block = blocks[name] = [];
  }
  block.push(context.fn(this));
});

hbs.registerHelper('block', function(name){
  var val = (blocks[name] || [].join('\n'));
  //clear block
  blocks[name] = [];
  return val;
});

hbs.registerHelper('safe', function(name) {
  var val = (blocks[name] || [].join('\n'));
  blocks[name] = [];
  return hbs.handlebars.SafeString(val);
});


// ROUTES
app.get('/', function (req, res, next) {
  return res.render('index', {});
});
app.get('/test', function (req, res, next) {
  return res.render('test', {});
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