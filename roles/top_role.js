var SCALES_MAJOR = 0;
var SCALES_MINOR = 1; 

function TopRole() {
  this.state = {
    globalRoot: 30,
    tempo: 120,
    scale: "major",
    adventurousness: [],
    leadEnvelope: {
      attack: 7,
      sustain: 7
    },
    bassEnvelope: {
      attack: 7,
      sustain: 7
    }
  };

  for (var i=0, len=8; i<len; i++) {
    this.state.adventurousness[i] = Math.floor(Math.random() * 15);
  }
}

module.exports = TopRole;



