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

  // initialize roles. if the id == -1, then the role is not a human.
  
  for(var i=0; i<NUM_TOPS; i++) {
    this.tops.push({
        id: -1, 
        role: new TopRole()
    });
  }
  
  for(var i=0; i<NUM_MIDS; i++) {
    this.mids.push({
        id: -1, 
        role: new MidRole()
    });
  }
  
  for(var i=0; i<NUM_BOTTOMS; i++) {
    this.bottoms.push({
      id: -1, 
      role: new BottomRole()
    });
  }
}

RoleManager.prototype.assign = function(socketId) {
  var role = null;
    
  if (!this.isTopFull()) {
    var pos = this.addTop(socketId);
    return {position: pos, role: "TopRole"};
  } else if (!this.isMidFull()) {
    var pos = this.addMid(socketId);
    return {position: pos, role: "MidRole"};
  } else if (!this.isBottomFull()) {
    var pos = this.addBottom(socketId);
    return {position: pos, role: "BottomRole"};
  } else {
    return null;
    // Tell the user that there are no spots left. Sorry!!
  }
}

RoleManager.prototype.unassign = function(socketId) {
  for (var i=0; i<this.tops.length; i++) {
    if(this.tops[i].id === socketId) {
      this.tops[i] = {id: -1, role: new TopRole} ;
      return;
    }
  }
  for (var i=0; i<this.mids.length; i++) {
    if(this.mids[i] && this.mids[i].id === socketId) {
      this.mids[i] = {id: -1, role: new MidRole} ;
      return;
    }
  }
  for (var i=0; i<this.bottoms.length; i++) {
    if(this.bottoms[i].id === socketId) {
      this.bottoms[i] = {id: -1, role: new BottomRole} ;
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
  for (var i=0; i < NUM_TOPS; i++) {
    if (this.tops[i].id === -1) {
      return false;
    }
  }
  
  return true;
}

RoleManager.prototype.isMidFull = function() {
  for (var i=0; i < NUM_MIDS; i++) {
    if (this.mids[i].id === -1) {
      return false;
    }
  }
  
  return true;
}

RoleManager.prototype.isBottomFull = function() {
  for (var i=0; i < NUM_BOTTOMS; i++) {
    if (this.bottoms[i].id === -1) {
      return false;
    }
  }
  
  return true;
}

RoleManager.prototype.addTop = function(id) {
  console.log("IN ADD TOP");
  for (var i=0, len=this.tops.length; i<len; i++) {
    if (this.tops[i].id === -1) {
      this.tops[i] = {id: id, role: new TopRole()};
      return i;
    }
  }
}

RoleManager.prototype.addMid = function(id) {
  for (var i=0, len=this.mids.length; i<len; i++) {
    if (this.mids[i].id === -1) {
      this.mids[i] = {id: id, role: new MidRole()};
      return i;
    }
  }
}

RoleManager.prototype.addBottom = function(id) {
  for (var i=0, len=this.bottoms.length; i<len; i++) {
    if (this.bottoms[i].id === -1) {
      this.bottoms[i] = {id: id, role: new BottomRole()};
      return i;
    }
  }
}

RoleManager.prototype.getUser = function(id) {
  for (var i=0; i<this.tops.length; i++) {
    if(this.tops[i].id === id) {
      return this.tops[i];
    }
  }

  for (var i=0; i<this.mids.length; i++) { 
    if(this.mids[i].id === id) {
      return this.mids[i];
    }
  }

  for (var i=0; i<this.bottoms.length; i++) {
    if(this.bottoms[i].id === id) {
      return this.bottoms[i];
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
