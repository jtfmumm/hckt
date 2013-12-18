var NUM_TOPS = 1;
var NUM_MIDS = 2;
var NUM_BOTTOMS = 4;

var NUM_PLAYERS = NUM_BOTTOMS + NUM_MIDS + NUM_TOPS;

function RoleManager(){

  this.top = [];
  this.mids = [];
  this.bottoms = [];

  for (var i=0; i<NUM_PLAYERS; i++) {
    if (i < NUM_TOPS) { this.tops.push(null);}
    if (i < NUM_MIDS) { this.mids.push(null);}
    if (i < NUM_BOTTOMS) { this.bottoms.push(null);}
  }
}

RoleManager.prototype.assign = function(socketId) {
  if (!this.isTopFull()) {
    this.top = { id: socketId, role: new TopRole() };
  } else if (!this.isMiddleFull()) {
    this.addMid();
  } else if (!this.isBottomFull()) {
    this.addBottom();
  } else {
    // Tell the user that there are no spots left. Sorry!!
  }
}

RoleManager.prototype.unassign = function(socketId) {
  var users = this.getAllUsers;
  for (var i=0; i<NUM_PLAYERS; i++) {
    if (users[i].id === socketId) {
      users[i] = null;
    }
  }
}

RoleManager.prototype.updateRoleState = function(socketId, state) {
  var user = getUser(socketId);
  if (user.role instanceof TopRole){
    setTopState(user, state);
  } else if (user.role instanceof MiddleRole){
    setMiddleState(user, state);
  } else { // user.role instanceof  BottomRole
    setBottomState(user, state);
  }
}

RoleManager.prototype.setTopState = function(user, state) {
  user.role.globalRoot = state.globalRoot;
  user.role.tempo = state.tempo;
  user.role.scale = state.scale;
  user.role.adventurousness = state.adventurousness;
  user.role.leadEnvelope = state.leadEnvelope;
  user.role.bassEnvelope = state.bassEnvelope;
  user.role.adventurousness = state.adventurousness;
}

RoleManager.prototype.setMiddleState = function(user, state) {
  user.role.noteDensity = state.noteDensity;
  user.role.chordDensity = state.chordDensity;
  user.role.dynamics = state.dynamics;
}

RoleManager.prototype.setBottomState = function(user, state) {
  user.role.lead = state.lead;
  user.role.bass = state.bass;
}

RoleManager.prototype.translate = function() {
  var state = {};
  for (var i=0; i<NUM_TOPS; i++ ) { 
    state["tops"][i] = this.tops[i];
  }
  for (var i=0; i<NUM_MIDS; i++ ) { 
    state["mids"][i] = this.mids[i];
  }
  for (var i=0; i<NUM_BOTTOMS; i++ ) { 
    state["bottoms"][i] = this.bottoms[i];
  }
  return state;
}

RoleManager.prototype.isTopFull = function() {
  return this.top.length === NUM_TOPS;
}

RoleManager.prototype.isMidFull = function() {
  return this.mids.length === NUM_MIDS;
}

RoleManager.prototype.isBottomFull = function() {
  return this.bottoms.length === NUM_BOTTOMS;
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
  return this.bottoms.concat(this.mids).concat(this.top);
}

RoleManager.prototype.getUser = function(id) {
  var users = this.allUsers;
  for (var i=0, len=users; i<len; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
}
