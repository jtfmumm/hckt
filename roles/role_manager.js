TopRole = require("./top_role.js");
MidRole = require("./middle_role.js");
BottomRole = require("./bottom_role.js");

var NUM_TOPS = 1;
var NUM_MIDS = 2;
var NUM_BOTTOMS = 4;

var NUM_PLAYERS = NUM_BOTTOMS + NUM_MIDS + NUM_TOPS;

function RoleManager(){

  this.tops = [];
  this.mids = [];
  this.bottoms = [];

  for (var i=0; i<NUM_PLAYERS; i++) {
    if (i < NUM_TOPS) { this.tops.push({id: -1, role: new TopRole});}
    if (i < NUM_MIDS) { this.mids.push({id: -1, role: new MidRole});}
    if (i < NUM_BOTTOMS) { this.bottoms.push({id: -1, role: new BottomRole});}
  }
}

RoleManager.prototype.assign = function(socketId) {
  var role;
  if (!this.isTopFull()) {
    this.addTop(socketId);
    role = "topRole"
    return;
  } else if (!this.isMidFull()) {
    this.addMid(socketId);
    role = "midRole"
    return;
  } else if (!this.isBottomFull()) {
    this.addBottom(socketId);
    role = "bottomRole"
    return;
  } else {
    // Tell the user that there are no spots left. Sorry!!
  }
  return role;
}

RoleManager.prototype.unassign = function(socketId) {

  for (var i=0; i<this.tops.length; i++) {
    if(this.tops[i] && this.tops[i].id === socketId) {
      this.tops[i] = null;
      return;
    }
  }
  for (var i=0; i<this.mids.length; i++) {
    if(this.mids[i] && this.mids[i].id === socketId) {
      this.mids[i] = null;
      return;
    }
  }
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
  var state = {
    tops: [],
    mids: [],
    bottoms: []
  };

  for (var i=0; i<NUM_TOPS; i++ ) {
    if (this.tops[i]) {
      state.tops[i] = this.tops[i].role.state;
    }
  }
  for (var i=0; i<NUM_MIDS; i++ ) { 
    if (this.mids[i]) {
      state.mids[i] = this.mids[i].role.state;
    }
  }
  for (var i=0; i<NUM_BOTTOMS; i++ ) { 
    if (this.bottoms[i]) {
      state.bottoms[i] = this.bottoms[i].role.state;
    }
  }
  return state;
}

RoleManager.prototype.isTopFull = function() {
  for (var i; i < NUM_TOPS; i++) {
    if (this.tops[i].id === -1) {
      return false;
    }
    return true;
  }
}

RoleManager.prototype.isMidFull = function() {
  for (var i; i < NUM_MIDS; i++) {
    if (this.mids[i].id === -1) {
      return false;
    }
    return true;
  }
}

RoleManager.prototype.isBottomFull = function() {
  for (var i; i < NUM_BOTTOMS; i++) {
    if (this.bottoms[i].id === -1) {
      return false;
    }
    return true;
  }
}

RoleManager.prototype.addTop = function(id) {
  console.log("IN ADD TOP");
  for (var i=0, len=this.tops.length; i<len; i++) {
    if (!this.tops[i].role.isHuman) {
      this.tops[i] = {id: id, role: new TopRole()};
      break;
    }
  }
}

RoleManager.prototype.addMid = function(id) {
  for (var i=0, len=this.mids.length; i<len; i++) {
    if (!this.mids[i].role.isHuman) {
      this.mids[i] = {id: id, role: new MidRole()};
      break;
    }
  }
}

RoleManager.prototype.addBottom = function(id) {
  for (var i=0, len=this.bottoms.length; i<len; i++) {
    if (!this.bottoms[i].role.isHuman) {
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

RoleManager.prototype.printUsers = function() {
  console.log("TOP");
  for (var i=0; i<this.tops.length; i++) {
    console.log(i + ": " + this.tops[i]);
  }
  console.log("MID");
  for (var i=0; i<this.mids.length; i++) {
    console.log(i + ": " + this.mids[i]);
  }
  console.log("BOTTOMS");
  for (var i=0; i<this.bottoms.length; i++) {
    console.log(i + ": " + this.bottoms[i]);
  }
}

module.exports = RoleManager;
