var SCALES_MAJOR = 0;
var SCALES_MINOR = 1; 

function TopRole(id) {
  this.id = id;
  this.globalRoot = 30;
  this.tempo = 120;
  this.scale = SCALES_MAJOR;
  this.adventurousness = [];
  this.leadEnvelope = {
    attack: 7,
    sustain: 7
  };
  this.bassEnvelope = {
    attack: 7,
    sustain: 7
  }
;

  for (var i=0, len=8; i<len; i++) {
    this.adventurousness[i] = Math.floor(Math.rand() * 15);
  }
}

module.exports = TopRole;
