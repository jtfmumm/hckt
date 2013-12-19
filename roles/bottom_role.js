function BottomRole() {
  this.state = {
    lead: [],
    bass: []
  }

  for (var i=0, len=8; i<len; i++) {
    this.state.lead[i] = Math.floor(Math.random() * 24);
    this.state.bass[i] = Math.floor(Math.random() * 16);
  }
}


module.exports = BottomRole;
