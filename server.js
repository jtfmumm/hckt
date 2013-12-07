var express = require("express")
  , http = require("http")
  , socketio = require("socket.io")
  , hbs = require("hbs")
  , _ = require("underscore");

var phraseRange = 24;
var sectionLength = 8;
var phraseLength = 8;

var rolesLength = 8;


var Roles = require("./roles.js");
var roles = new Roles(rolesLength);

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

// HBS TEMPLATE VARIABLE
var blocks = {};



//STATE UTILS
var setScale = function(scale) {
  state.scale = scale;
}

var setDensity = function(density) {
  state.density = density;
}

var setTempo = function(tempo) {
  state.tempo = tempo;
}


var generateRootValue = function(phraseRange) {
  var rand = Math.floor(Math.random() * 100);
  var phrase = null;
  
  if(rand < 50) {
    return 30;
  }
  else if (rand < 80) {
    return 37;
  }
  else if (rand < 95) {
    return 35;
  }
  else {
    return 34;
  }
  
  return phrase;
}

var generatePhrase = function(range) {
  return _.random(0, range);
}

var generateSection = function() {
  var phrases = [];
  var phrase = null;
  
  for(var i=0; i<phraseLength; i++){
    phrase = generatePhrase(phraseRange);
    phrases.push(phrase);
  }
  
  return {
    root: generateRootValue(),
    phrases: phrases
  };
};


var generateSections = function() {
  for(var i=0, len=sectionLength; i<len; i++) {
    state.sections.push(generateSection());
  };
};


// GLOBAL STATE
var state = {};
state.tempo = null;
state.sections = [];

setDensity(80);
setTempo(120);
setScale('majorScale');
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
app.get('/master', function (req, res, next) {
  return res.render('master', {});
});
app.get('/section', function (req, res, next) {
  return res.render('section', {});
});


// SOCKETS
io.sockets.on('connection', function (socket) {
  var assignedRole = roles.assignRole(socket);
  
  console.log('assignedRole:' + JSON.stringify(assignedRole));
  console.log('socketId = ' + socket.id);
  
  roles.print();
  
  socket.emit('init', {
    state: state,
    role: assignedRole
  });
  
  socket.on('state.change', function(data) {
    socket.broadcast.emit('state.change', state);
  });
  
  socket.on('disconnect', function() {
    roles.unassignRole(this.id);
    console.log('disconnect detected for id=' + this.id);
    roles.print();
  });
});


server.listen(8080, '0.0.0.0');
console.log("starting server!");