TopRole = require("./bottom_role.js");
MidRole = require("./middle_role.js");
BottomRole = require("./top_role.js");

var NUM_TOPS = 1;
var NUM_MIDS = 2;
var NUM_BOTTOMS = 4;

var NUM_PLAYERS = NUM_BOTTOMS + NUM_MIDS + NUM_TOPS;

function RoleManager(){

  this.tops = [];
  this.mids = [];
  this.bottoms = [];

  for (var i=0; i<NUM_PLAYERS; i++) {
    if (i < NUM_TOPS) { this.tops.push(null);}
    if (i < NUM_MIDS) { this.mids.push(null);}
    if (i < NUM_BOTTOMS) { this.bottoms.push(null);}
  }
}

RoleManager.prototype.printUsers = function() {
  console.log("TOP");
  for (var i=0; i<this.tops.length; i++) {
    console.log("i: " + this.tops[i]);
  }
  console.log("MID");
  for (var i=0; i<this.mids.length; i++) {
    console.log("i: " + this.mids[i]);
  }
  console.log("BOTTOMS");
  for (var i=0; i<this.bottoms.length; i++) {
    console.log("i: " + this.bottoms[i]);
  }
}

RoleManager.prototype.assign = function(socketId) {
  var role;
  if (!this.isTopFull()) {
    this.addTop(socketId);
    role = "top role"
  } else if (!this.isMidFull()) {
    this.addMid(socketId);
    role = "mid role"
  } else if (!this.isBottomFull()) {
    this.addBottom(socketId);
    role = "bottom role"
  } else {
    // Tell the user that there are no spots left. Sorry!!
  }
  return role;
}

RoleManager.prototype.unassign = function(socketId) {
  var users = this.allUsers();

  for (var i=0; i<this.tops.length; i++) {
    if(this.tops[i] && this.tops[i].id === socketId) {
      this.tops[i] = null;
      return;
    }
  }
  console.log("MID");
  for (var i=0; i<this.mids.length; i++) {
    if(this.mids[i] && this.mids[i].id === socketId) {
      this.mids[i] = null;
      return;
    }
  }
  console.log("BOTTOMS");
  for (var i=0; i<this.bottoms.length; i++) {
    if(this.bottoms[i] && this.bottoms[i].id === socketId) {
      this.bottoms[i] = null;
      return;
    }
  }
}

RoleManager.prototype.updateRoleState = function(socketId, state) {
  var user = getUser(socketId);
  user.role.state = state;
}


RoleManager.prototype.translate = function() {
  var state = {};
  for (var i=0; i<NUM_TOPS; i++ ) { 
    state["tops"][i] = this.tops[i].state;
  }
  for (var i=0; i<NUM_MIDS; i++ ) { 
    state["mids"][i] = this.mids[i].state;
  }
  for (var i=0; i<NUM_BOTTOMS; i++ ) { 
    state["bottoms"][i] = this.bottoms[i].state;
  }
  return state;
}

RoleManager.prototype.isTopFull = function() {
  console.log(this.tops)
  return this.tops.indexOf(null) === -1 ;
}

RoleManager.prototype.isMidFull = function() {
  return this.mids.indexOf(null) === -1 ;
}

RoleManager.prototype.isBottomFull = function() {
  return this.bottoms.indexOf(null) === -1 ;
}

RoleManager.prototype.addTop = function(id) {
  for (var i=0, len=this.tops.length; i<len; i++) {
    if (this.tops[i] == null) {
      this.tops[i] = {id: id, role: new TopRole()};
      break;
    }
  }
}


RoleManager.prototype.addMid = function(id) {
  for (var i=0, len=this.mids.length; i<len; i++) {
    if (this.mids[i] == null) {
      this.mids[i] = {id: id, role: new MidRole()};
      break;
    }
  }
}

RoleManager.prototype.addBottom = function(id) {
  for (var i=0, len=this.bottoms.length; i<len; i++) {
    if (this.bottoms[i] == null) {
      this.bottoms[i] = {id: id, role: new BottomRole()};
      break;
    }
  }
}

RoleManager.prototype.allUsers = function() {
  return this.bottoms.concat(this.mids).concat(this.tops);
}

RoleManager.prototype.getUser = function(id) {
  var users = this.allUsers;
  for (var i=0, len=users; i<len; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
}

module.exports = RoleManager;
