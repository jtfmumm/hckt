function BottomRole() {
  this.lead = [];
  this.bass = [];

  for (var i=0, len=8; i<len; i++) {
    this.lead[i] = Math.floor(Math.rand() * 24);
    this.bass[i] = Math.floor(Math.rand() * 16);
  }

  
  

}


module.exports = BottomRole;
