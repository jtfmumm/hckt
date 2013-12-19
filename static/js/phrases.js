// PAYLOAD FORMAT
/*
{
  tops: [],
  mids: [],
  bottoms: []
}
*/

var DEFAULT_AMP = 0.4;
var SEMI_TONE = Math.pow(2, 1/12);
var SCALES = {
  "majorScale": [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19],
  "minorScale": [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19]
};

var _stopFlag = false;

var settings = null;
var role = null;


//Phrase representation: tone: -4 - 12, schedule: 0 - 7}]
//Representing relative notes as scale degrees 1-7
var phrases = [
  [[5, 4], [1, 4]],
  [[1, 8], [5, 8], [8, 8], [5, 8]],
  [[1, 8], [3, 8], [5, 8], [3, 8]],
  [[1, 8], [2, 8], [3, 8], [5, 8]],

  [[1, 8], [2, 8], [3, 8], [4, 8]],
  [[5, 8], [6, 8], [7, 8], [8, 8]],
  [[8, 8], [7, 8], [6, 8], [5, 8]],
  [[4, 8], [3, 8], [2, 8], [1, 8]],

  [[1, 16], [2, 16], [3, 16], [4, 16], [5, 16], [4, 16], [3, 16], [4, 16]],
  [[1, 16], [-2, 16], [-3, 16], [-2, 16], [-3, 16], [-4, 16], [5, 16], [3, 16]],
  [[5, 4], [8, 16], [7, 16], [6, 16], [3, 16]],
  [[5, 4], [8, 16], [6, 16], [7, 16], [5, 16]],

  [[5, 8], [3, 16], [6, 16], [4, 8], [2, 16], [7, 16]],
  [[8, 16], [1, 16], [7, 16], [2, 16], [6, 16], [3, 16], [5, 16], [4, 16]],
  [[4, 8], [5, 16], [6, 16], [2, 16], [3, 16], [1, 8]],
  [[4, 8], [3, 16], [2, 16], [4, 8], [3, 16], [2, 16]],

  [[3, 16], [5, 16], [8, 16], [10, 16], [9, 16], [8, 16], [7, 16], [6, 16]],
  [[3, 16], [-3, 8], [2, 16], [-4, 16], [2, 8], [-3, 16]],
  [[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]],
  [[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]],

  [[1, 16], [-2, 16], [1, 16], [-2, 16], [1, 16], [-2, 16], [1, 16], [-2, 16]],
  [[6, 16], [3, 16], [6, 16], [3, 16], [5, 16], [2, 16], [5, 16], [2, 16]],

  [[2, 8], [5, 8], [-3, 4]],
  [[2, 8], [5, 8], [1, 4]]
];


//Representing relative notes as scale degrees 1-7
var bassPhrases = [
  [[1, 2]],
  [[1, 2]],
  [[1, 2]],
  [[5, 2]],

  [[5, 2]],
  [[4, 2]],
  [[5, 4], [1, 4]],
  [[1, 4], [5, 4]],

  [[4, 8], [5, 8], [1, 4]],
  [[1, 8], [4, 8], [5, 4]],
  [[1, 8], [2, 8], [3, 8], [4, 8]],
  [[5, 8], [6, 8], [7, 8], [8, 8]],

  [[3, 8], [6, 8], [2, 8], [5, 8]],
  [[3, 2]],
  [[5, 8], [4, 8], [3, 8], [2, 8]],
  [[1, 8], [1, 16], [2, 16], [3, 16], [5, 16], [6, 16], [8, 16]] //sunshine
];


// Audio context
var ctx = new webkitAudioContext();


function Note(tone, noteValue) {
  this.tone = tone;
  this.noteValue = noteValue;
};


function Phrase(notes) {
  this.notes = notes;
};


var getScaleType = function(localRootValue) {
  if (localRootValue === 2 || 
      localRootValue === 6) {
    return 'minorScale';
  }

  return 'majorScale';
};

// TODO @paul -- this function needs to be broken up/explained
var getNoteNumber = function(scaleDegree, localRootValue, range) {
  var noteNumber, newDegree = null;
  var scaleName = getScaleType(localRootValue);
  var curScale = SCALES[scaleName];

  //Check for invalid input
  if (scaleDegree === 0 || scaleDegree === -1) {
    scaleDegree = 1;  //With invalid input, just play root tone
  } 
  else if (scaleDegree > 0) {
    newDegree = scaleDegree - 1;
    noteNumber = (settings.globalRoot + localRootValue) + curScale[newDegree];
  } 
  else {
    newDegree = curScale.length + (scaleDegree - 1);
    noteNumber = (settings.globalRoot - 12 + localRootValue) + curScale[newDegree];
  }

  if (range === "bass") { 
    noteNumber = noteNumber - 24; 
  }

  return noteNumber;
};


var getPhrase = function(notes) {
  var tempPhrase = [];
  var note = null;
  for (var i = 0; i < notes.length; i++) {
    note = new Note(notes[i][0], notes[i][1]);
    tempPhrase.push(note);
  }
  return new Phrase(tempPhrase);
};


//Note numbering: A1 = 0, A#1 = 1, B1 = 2, C2 = 3....
var getTonesTable = function() {
  var tones = [];
  for (var i = 0, len=76; i<len; i++) {
    if (i === 0) {
      tones.push(55);
    }
    else {
      tones.push(tones[i - 1] * SEMI_TONE);
    }
  }
  return tones;
};


var playOsc = function(freq, dur, startTime, attack, release) {
  osc = ctx.createOscillator();
  gainNode = ctx.createGain();

  osc.frequency.value = freq;
  osc.type = "square";
  
  //Connect nodes
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  //Play osc through envelope
  osc.start(startTime);
  gainNode.gain.value = 0;
  gainNode.gain.linearRampToValueAtTime(DEFAULT_AMP, startTime + attack); //Attack
  gainNode.gain.linearRampToValueAtTime(DEFAULT_AMP, startTime + attack + (dur - attack)); //Sustain
  gainNode.gain.linearRampToValueAtTime(0.0, startTime + attack + (dur - attack) + release); //Release
};


// TODO @paul -- this function needs to be broken up
var playPhrase = function(section, phrasePosition, range) {
  var startTime = ctx.currentTime;
  var density = settings.density;
  var section = settings["sections"][section]
  var phraseRoot = section["localRootValue"];
  var phraseIndex = 0;
  var beatValue, toneLookup, freq, duration, roll = null;
  var tonesTable = getTonesTable();

  if (range === "treble") {
    phraseIndex = section["phrases"][phrasePosition];
    phrase = getPhrase(phrases[phraseIndex]);
  } 
  else if (range === "bass") {
    phraseIndex = section["bassPhrases"][phrasePosition];		
    phrase = getPhrase(bassPhrases[phraseIndex]);
    bassTransform = (100 - density) / 2; 
    density = density + bassTransform; 
  }

  for (var i = 0; i < phrase.notes.length; i++) {
    beatValue = (1 / (settings.tempo / 60)) * 4; 
    toneLookup = getNoteNumber(phrase.notes[i].tone, phraseRoot, range);
    freq = tonesTable[toneLookup];
    duration = beatValue / phrase.notes[i].noteValue;
    roll = (Math.random() * 100);
    
    if (roll < settings.density) {
      playOsc(freq, duration, startTime);
    }
    
    startTime = startTime + duration;
  }
};


var getDuration = function() {
  var beatValue = (1 / (settings.tempo / 60));
  var duration = (2 * beatValue) * 1000; //Convert to ms for setTimeout
  return duration; 
};


var getNextPhrase = function(section, phrasePosition) {
  if (phrasePosition + 1 > 7) {
    section = (section + 1) % 4;
    phrasePosition = 0;
  } 
  else {
    phrasePosition++;
  }
  return { 
    "section": section,
    "phrase": phrasePosition 
  }
};


var schedulePhrase = function(section, phrasePosition) {
  var duration = getDuration();
  var nextPhraseObj = getNextPhrase(section, phrasePosition);
  
  if(_stopFlag) {
    return;
  }
  
  playPhrase(section, phrasePosition, "treble");
  playPhrase(section, phrasePosition, "bass");

  setTimeout(function() { 
    schedulePhrase(nextPhraseObj["section"], nextPhraseObj["phrase"]);
  }, duration);
};


var stopSong = function() { 
  _stopFlag = true;
};

var restartSong = function() { 
  _stopFlag = false;
  schedulePhrase(0,0);
};



socket.on("init", function(data) {
  settings = data.state;
  role = data.role;

  setTimeout(function() {
    schedulePhrase(0, 0);
  }, 1000);
});

socket.on("state.change", function(data) {
  settings = data;
});