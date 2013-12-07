function Roles(numSections) {
  this.master = null;
  this.sections = [];
  
  for(var i=0; i<numSections; i++) {
    this.sections[i] = null;
  }
};

Roles.prototype.isMasterUnassigned = function() {
  return this.master === null;
};

Roles.prototype.isSectionUnassigned = function(index) {
  if (!(index >=0 && index <= this.sections.length)) {
    throw "index is out of bounds";
  }
  
  return this.sections[index] === null;
};

Roles.prototype.assignRole = function(socket) {
  console.log(this.isMasterUnassigned());
  
  if (this.isMasterUnassigned()) {
    this.master = socket;
    return {
      type: 'master'
    }
  }
  
  for(var i=0, len=this.sections.length; i<len; i++) {
    if(this.isSectionUnassigned(i)) {
      this.sections[i] = socket;
      return {
        type: 'section',
        index: i
      }
    }
  }
  
  return false;
};

Roles.prototype.print = function(){
  if(this.isMasterUnassigned()) {
    console.log('master=null');
  }
  else {
    console.log('master=' + this.master.id);
  }
  
  for(var i=0, len=this.sections.length; i<len; i++) {
    if(this.isSectionUnassigned(i)) {
      console.log('section['+ i +']=null');
    }
    else {
      console.log('section['+ i +']=' + this.sections[i].id);
    }
  }
};


Roles.prototype.unassignRole = function(socketId) {
  if (!this.isMasterUnassigned()) {
    if(this.master.id === socketId) {
      this.master = null;
      return;
    }
  }
  
  for(var i=0, len=this.sections.length; i<len; i++) {
    if(!this.isSectionUnassigned(i)) {
      if(this.sections[i].id === socketId) {
        this.sections[i] = null;
        return;
      }
    }
  }
};


module.exports = Roles;