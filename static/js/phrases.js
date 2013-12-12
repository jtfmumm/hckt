// PAYLOAD FORMAT
/*
var settings = {
  tempo: 120,
  scale: "majorScale"
  trebleDensity: 80,
  bassDensity: 
  sections: [
    {"globalRoot":
     "localRootValue": 
     "phrases": [...]}, phraseIndex values 0-23
     "bassPhrases": [...]}, bassPhraseIndex values 0-15 
    ...
    }, ...]
}
*/

var settings = null;
var role = null;
var stopFlag = false;

var scales = {
  "majorScale": [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19],
  "minorScale": [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19]
}

var getScaleName = function(localRootValue) {
  switch(localRootValue) {
    case 1:
      return 'majorScale';
      break;
    case 5:      
      return 'majorScale';
      break;
    case 4:
      return 'majorScale';
      break;
    case 3:
      return 'majorScale';
      break;
    case 6:
      return 'minorScale';
      break;
    case 2:
      return 'minorScale';
      break;
    default:
      return 'majorScale';
      break;
  }
}

var getNoteNumber = function(scaleDegree, localRootValue, range) {
  var noteNumber, newDegree = null;
  var scaleName = getScaleName(localRootValue);
  var curScale = scales[scaleName];

  console.log(scaleName);

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
}

var semiTone = Math.pow(2, 1/12);

var ctx = new webkitAudioContext();

var getPhrase = function(notes) {
  var tempPhrase = [];
  var note = null;
  for (var i = 0; i < notes.length; i++) {
    note = new Note(notes[i][0], notes[i][1]);
    tempPhrase.push(note);
  }
  return new Phrase(tempPhrase);
}

//Representing relative notes as scale degrees 1-7
var phrases = [
  getPhrase([[5, 4], [1, 4]]),
  getPhrase([[1, 8], [5, 8], [8, 8], [5, 8]]),
  getPhrase([[1, 8], [3, 8], [5, 8], [3, 8]]),
  getPhrase([[1, 8], [2, 8], [3, 8], [5, 8]]),

  getPhrase([[1, 8], [2, 8], [3, 8], [4, 8]]),
  getPhrase([[5, 8], [6, 8], [7, 8], [8, 8]]),
  getPhrase([[8, 8], [7, 8], [6, 8], [5, 8]]),
  getPhrase([[4, 8], [3, 8], [2, 8], [1, 8]]),

  getPhrase([[1, 16], [2, 16], [3, 16], [4, 16], [5, 16], [4, 16], [3, 16], [4, 16]]),
  getPhrase([[1, 16], [-2, 16], [-3, 16], [-2, 16], [-3, 16], [-4, 16], [5, 16], [3, 16]]),
  getPhrase([[5, 4], [8, 16], [7, 16], [6, 16], [3, 16]]),
  getPhrase([[5, 4], [8, 16], [6, 16], [7, 16], [5, 16]]),

  getPhrase([[5, 8], [3, 16], [6, 16], [4, 8], [2, 16], [7, 16]]),
  getPhrase([[8, 16], [1, 16], [7, 16], [2, 16], [6, 16], [3, 16], [5, 16], [4, 16]]),
  getPhrase([[4, 8], [5, 16], [6, 16], [2, 16], [3, 16], [1, 8]]),
  getPhrase([[4, 8], [3, 16], [2, 16], [4, 8], [3, 16], [2, 16]]),

  getPhrase([[3, 16], [5, 16], [8, 16], [10, 16], [9, 16], [8, 16], [7, 16], [6, 16]]),
  getPhrase([[3, 16], [-3, 8], [2, 16], [-4, 16], [2, 8], [-3, 16]]),
  getPhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),
  getPhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),

  getPhrase([[1, 16], [-2, 16], [1, 16], [-2, 16], [1, 16], [-2, 16], [1, 16], [-2, 16]]),
  getPhrase([[6, 16], [3, 16], [6, 16], [3, 16], [5, 16], [2, 16], [5, 16], [2, 16]]),

  getPhrase([[2, 8], [5, 8], [-3, 4]]),
  getPhrase([[2, 8], [5, 8], [1, 4]]),
];


//Representing relative notes as scale degrees 1-7
var bassPhrases = [
  getPhrase([[1, 2]]),
  getPhrase([[1, 2]]),
  getPhrase([[1, 2]]),
  getPhrase([[5, 2]]),

  getPhrase([[5, 2]]),
  getPhrase([[4, 2]]),
  getPhrase([[5, 4], [1, 4]]),
  getPhrase([[1, 4], [5, 4]]),

  getPhrase([[4, 8], [5, 8], [1, 4]]),
  getPhrase([[1, 8], [4, 8], [5, 4]]),
  getPhrase([[1, 8], [2, 8], [3, 8], [4, 8]]),
  getPhrase([[5, 8], [6, 8], [7, 8], [8, 8]]),

  getPhrase([[3, 8], [6, 8], [2, 8], [5, 8]]),
  getPhrase([[3, 2]]),
  getPhrase([[5, 8], [4, 8], [3, 8], [2, 8]]),	
  getPhrase([[1, 8], [1, 16], [2, 16], [3, 16], [5, 16], [6, 16], [8, 16]]), //sunshine
];



//Note numbering: A1 = 0, A#1 = 1, B1 = 2, C2 = 3.... 
var getTones = function() {
  var tones = [];
  for (var i = 0, len=76; i<len; i++) {
    if (i === 0) {
      tones.push(55);
    }
    else {
      tones.push(tones[i - 1] * semiTone);
    }
  }
  return tones;
}

var _tonesTable = getTones();

//Phrase representation: tone: -4 - 12, schedule: 0 - 7}]

var playOsc = function(freq, dur, startTime) {
  osc = ctx.createOscillator();
  osc.frequency.value = freq;
  osc.type = "square";
  osc.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + dur);
}

function Note(tone, noteValue) {
  this.tone = tone;
  this.noteValue = noteValue;
}

function Phrase(notes) {
  this.notes = notes;
}



var playPhrase = function(section, phrasePosition, range) {
  var startTime = ctx.currentTime;
  var density = settings.density;
  var phraseRoot = settings["sections"][section]["localRootValue"];
  var phraseIndex = 0;
  var beatValue, toneLookup, freq, duration, roll = null;

  console.log(phraseRoot);
  
  if (range === "treble") {
    phraseIndex = settings["sections"][section]["phrases"][phrasePosition];
    phrase = phrases[phraseIndex];
  } 
  else if (range === "bass") {
    phraseIndex = settings["sections"][section]["bassPhrases"][phrasePosition];		
    phrase = bassPhrases[phraseIndex];
    bassTransform = (100 - density) / 2; 
    density = density + bassTransform; 
  }

  for (var i = 0; i < phrase.notes.length; i++) {
    beatValue = (1 / (settings.tempo / 60)) * 4; 
    toneLookup = getNoteNumber(phrase.notes[i].tone, phraseRoot, range);
    freq = _tonesTable[toneLookup];
    duration = beatValue / phrase.notes[i].noteValue;
    roll = (Math.random() * 100);
    
    if (roll < settings.density) {
      playOsc(freq, duration, startTime);
    }
    
    startTime = startTime + duration;
  }
}

var getDuration = function() {
  var beatValue = (1 / (settings.tempo / 60));
  var duration = (2 * beatValue) * 1000; //Convert to ms for setTimeout
  return duration; 
}

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
}

var scheduler = function(section, phrasePosition) {
  var duration = getDuration();
  var nextPhraseObj = getNextPhrase(section, phrasePosition);
  
  playPhrase(section, phrasePosition, "treble");
  playPhrase(section, phrasePosition, "bass");
  
  if (!stopFlag) {
    setTimeout(function() { 
      scheduler(nextPhraseObj["section"], nextPhraseObj["phrase"]);
    }, duration);
  }
}

var stopSong = function() { 
  stopFlag = true; 
};
var restartSong = function() { 
  scheduler(0,0); 
};



socket.on("init", function(data) {
  settings = data.state;
  role = data.role;

  setTimeout(function() {
    scheduler(0, 0);
  }, 1000);
});

socket.on("state.change", function(data) {
  settings = data;
});



