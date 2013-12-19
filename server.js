var express = require("express")
  , http = require("http")
  , socketio = require("socket.io")
  , hbs = require("hbs")
  , _ = require("underscore");

var phraseRange = 23;
var bassPhraseRange = 15;
var sectionLength = 4;
var phraseLength = 8;

var rolesLength = 8;

var RoleManager = require("./roles/role_manager.js");
var roleManager = new RoleManager();

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

var setGlobalRoot = function(globalRoot) {
  state.globalRoot = globalRoot;
}

var generateLocalRootValue = function() {
  var rand = Math.floor(Math.random() * 100);
  var localRoot = null;
  
  if(rand < 50) {
    return 1;
  }
  else if (rand < (50 + 20)) {
    return 5;
  }
  else if(rand < (50 + 20 + 20)) {
    return 4;
  }
  else {
    return 3;
  }  
  
  if(rand < 45) {
    return 1;
  }
  else if (rand < (45 + 19)) {
    return 5;
  }
  else if(rand < (45 + 19 + 15)) {
    return 4;
  }
  else if(rand < (45 + 19 + 15 + 7)) {
    return 3;
  }
  else if(rand < (45 + 19 + 15 + 7 + 7)) {
    return 6;
  }
  else {
    return 2;
  }
  
  return localRoot;
}

var generatePhrase = function(range) {
  return _.random(0, range);
}

var generateSection = function() {
  var phrases = [];
  var bassPhrases = [];
  var phrase = null;
  
  for(var i=0; i<phraseLength; i++){
    phrase = generatePhrase(phraseRange);
    phrases.push(phrase);
    
    bassPhrase = generatePhrase(bassPhraseRange);
    bassPhrases.push(bassPhrase);
  }
  
  return {
    localRootValue: generateLocalRootValue(),
    bassPhrases: bassPhrases,
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

setDensity(85);
setTempo(120);
setGlobalRoot(30);
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
app.get('/middle', function (req, res, next) {
  return res.render('middle', {});
});
app.get('/bottom', function (req, res, next) {
  return res.render('bottom', {});
});


// SOCKETS
io.sockets.on('connection', function (socket) {
  
  assignedRole = roleManager.assign(socket.id);
  state = roleManager.translate();
  
  socket.emit('init', {
    state: state,
    role: assignedRole
  });
  
  console.log(roleManager.translate());

  socket.on('state.change', function(data) {
    socket.broadcast.emit('state.change', state);
  });
  
  socket.on('disconnect', function() {
    roleManager.unassign(this.id);
    console.log('disconnect detected for id=' + this.id);
    console.log(roleManager.translate());
  });
});


server.listen(8080, '0.0.0.0');
console.log("starting server!");
