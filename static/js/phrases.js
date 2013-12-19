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
  "majorScale": [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19], //, 21, 23, 24, 26, 28, 29, 31, 33, 35, 36, 38, 40, 41, 43],
  "minorScale": [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19] //, 20, 22, 24, 26, 27, 29, 31, 32, 34, 36, 38, 39, 41, 43]
};

var _stopFlag = false;

var settings = null;
var role = null;

var LOCAL_ROOT_VALUES = [1, 5, 3, 6]; 
var lastChord = 7;

//Reporting
var _reportFlag = true;
var report = function(msg) {
  if (_reportFlag) console.log(msg);
};
var killReports = function() {
  _reportFlag = false;
};

var pickRandRange = function(low, high) {
  return (Math.random() * (high - low)) + low;
};

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

var chordMatrix = [
//          1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12
//          I      II     III  IV       V      VI
/* 1 */  [  0,  0, 15,  0,  5, 25,  0, 45,  0, 10,  0,  0], // 1    I
/* 2 */  [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // 2    
/* 3 */  [ 15,  0,  0,  0, 25, 10,  0, 45,  0,  5,  0,  0], // 3    II
/* 4 */  [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // 4
/* 5 */  [  5,  0, 15,  0,  0, 10,  0, 25,  0, 45,  0,  0], // 5    III
/* 6 */  [ 25,  0,  5,  0, 15,  0,  0, 45,  0, 10,  0,  0], // 6    IV
/* 7 */  [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // 7
/* 8 */  [ 45,  0,  5,  0, 15, 25,  0,  0,  0, 10,  0,  0], // 8    V
/* 9 */  [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // 9
/*10 */  [ 45,  0,  5,  0, 10, 15,  0, 25,  0,  0,  0,  0], // 10   VI
/*11 */  [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // 11
/*12 */  [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]  // 12
//          1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12
  ]

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
  curScale = settings.tops[0].scale;
  oppScale = (curScale === 'majorScale') ? 'minorScale' : 'majorScale';

  if (localRootValue === 2 || 
      localRootValue === 6) {
    return oppScale;
  }

  return curScale;
};

// TODO @paul -- this function needs to be broken up/explained
var getNoteNumber = function(scaleDegree, localRootValue, range) {
  var noteNumber, newDegree = null;
  var scaleName = settings.tops[0].scale; //getScaleType(localRootValue);
  var curScale = SCALES[scaleName];

  //Check for invalid input
  if (scaleDegree === 0 || scaleDegree === -1) {
    scaleDegree = 1;  //With invalid input, just play root tone
  } 
  else if (scaleDegree > 0) {
    newDegree = scaleDegree - 1;
    noteNumber = (settings.tops[0].globalRoot + localRootValue) + curScale[newDegree];
  } 
  else {
    newDegree = curScale.length + (scaleDegree - 1);
    noteNumber = (settings.tops[0].globalRoot - 12 + localRootValue) + curScale[newDegree];
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

var getEnvelopeValue = function(value) {
  return value / 100;
};

var getAmp = function() {

};

var playOsc = function(freq, dur, startTime, attack, release, amp) {
  attack = getEnvelopeValue(attack);
  release = getEnvelopeValue(release);

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
  gainNode.gain.linearRampToValueAtTime(0, startTime); //Attack
  gainNode.gain.linearRampToValueAtTime(amp, startTime + attack); //Attack
  gainNode.gain.linearRampToValueAtTime(amp, startTime + dur + attack); //Sustain
  gainNode.gain.linearRampToValueAtTime(0.0, startTime + dur + attack + release); //Release
};

var getNoteDensity = function(value) {
  //Values from 60-94
  return (value + 80);
};

var getDynamics = function(value) {
  //Values from [0.4, 0.4] to [0.25, 0.55]
  newValue = value / 100;
  return [(DEFAULT_AMP - newValue), (DEFAULT_AMP + newValue)];
};

var getChordDensity = function(value) {
  return null;
};

var getNextChord = function(phrasePosition) {
  if (phrasePosition === 0 || phrasePosition === 4) {
    var curRow = chordMatrix[lastChord];
    var rowTotal = curRow.reduce(function(a, b) { return a + b; }, 0);
    var runningTotal = 0;
    var roll = Math.floor(Math.random() * 100);

    for (var i = 0; i < curRow.length; i++) {
      runningTotal += curRow[i];
      if (roll <= runningTotal) {
        lastChord = i;
        return i;
      }
    }
  } else return lastChord;
};

// TODO @paul -- this function needs to be broken up
var playPhrase = function(section, phrasePosition, range) {
  var attack, release;
  var startTime = ctx.currentTime;

  //Mid players control 2 sections each
  var midPlayer = section % 2;
  //Each density setting corresponds to 2 phrases
  //and corresponds to an index in the appropriate midPlayer's settings array 
  var midPosition = (midPlayer + 1) * Math.floor(phrasePosition / 2);  
  var densitySetting = settings.mids[midPlayer].noteDensity[midPosition];
  var density = getNoteDensity(densitySetting);
  var dynamicsSetting = settings.mids[midPlayer].dynamics[midPosition];
  var dynamics = getDynamics(dynamicsSetting);
  var amp = pickRandRange(dynamics[0], dynamics[1]);

//  var phraseRoot = getNextChord(phrasePosition);
  var phraseRoot = LOCAL_ROOT_VALUES[section];
  var phraseIndex = 0;
  var beatValue, toneLookup, freq, duration, roll = null;
  var tonesTable = getTonesTable();

  if (range === "lead") {
    phraseIndex = settings.bottoms[section].lead[phrasePosition];
    phrase = getPhrase(phrases[phraseIndex]);
    attack = settings.tops[0].leadEnvelope.attack;
    release = settings.tops[0].leadEnvelope.release;
  } 
  else if (range === "bass") {
    phraseIndex = settings.bottoms[section].bass[phrasePosition];		
    phrase = getPhrase(bassPhrases[phraseIndex]);
    bassTransform = (100 - density) / 2; 
    density = density + bassTransform; 
    attack = settings.tops[0].bassEnvelope.attack;
    release = settings.tops[0].bassEnvelope.release;
  }

  for (var i = 0; i < phrase.notes.length; i++) {
    beatValue = (1 / (settings.tops[0].tempo / 60)) * 4; 
    toneLookup = getNoteNumber(phrase.notes[i].tone, phraseRoot, range);
    freq = tonesTable[toneLookup];
    duration = beatValue / phrase.notes[i].noteValue;
    roll = (Math.random() * 100);
    
    if (roll < density) {
      playOsc(freq, duration, startTime, attack, release, amp);
    }
    
    startTime = startTime + duration;
  }
};


var getDuration = function() {
  var beatValue = (1 / (settings.tops[0].tempo / 60));
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
  
  playPhrase(section, phrasePosition, "lead");
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
  console.log("State: " + data.state);
  settings = data.state;
  role = data.role;

  setTimeout(function() {
    schedulePhrase(0, 0);
  }, 1000);
});

socket.on("state.change", function(data) {
  console.log(data)
  settings = data;
});