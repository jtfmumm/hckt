var settings = null;
var role = null;

// var settings = {
// 	tempo: 120,
// 	scale: "majorScale"
//  sections: [
		// [[0, 30], [4, 50], [14, 40], [13, 20]...], [phraseIndex, rootValue] pairs 
		// ...
		// ]
// }

var scales = {
	"majorScale": [0, 2, 4, 5, 7, 9, 11, 12]
}

var getNoteNumber = function(scaleDegree, rootValue) {
	var noteNumber, newDegree = null;
	var curScale = scales[settings.scale];

	//Check for invalid input
	if (scaleDegree === 0 || scaleDegree === -1) {
		scaleDegree = 1;  //With invalid input, just play root tone
	} 

	if (scaleDegree > 0) {
		newDegree = scaleDegree - 1;
		noteNumber = rootValue + curScale[newDegree];
	} else {
		newDegree = curScale.length + (scaleDegree - 1);
		noteNumber = (rootValue - 12) + curScale[newDegree];
	}
	return noteNumber;
}

var semiTone = Math.pow(2, 1/12);

var ctx = new webkitAudioContext();

//Note numbering: A1 = 0, A#1 = 1, B1 = 2, C2 = 3.... 
var generateTones = function() {
	var tones = [];
	tones[0] = 55;
	for (var i = 1; i < 77; i++) {
		tones.push(tones[i - 1] * semiTone);
 	}
 	return tones;
}

var _tonesTable = generateTones();

//Phrase representation: tone: -4 - 12, schedule: 0 - 7}]

var playOsc = function(freq, dur, startTime) {
	console.log("Hi");
	osc = ctx.createOscillator();
	osc.frequency.value = freq;
	osc.type = "square";
	osc.connect(ctx.destination);
	osc.start(startTime);
	osc.stop(startTime + dur);
}

//Representing relative notes as scale degrees 1-7
var phrases = [
	makePhrase([[1, 2]]),
	makePhrase([[5, 4], [1, 4]]),
	makePhrase([[1, 8], [5, 8], [8, 8], [5, 8]]),
	makePhrase([[1, 8], [3, 8], [5, 8], [3, 8]]),
	makePhrase([[1, 8], [2, 8], [3, 8], [5, 8]]),
	makePhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),
	makePhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),
	makePhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),
	makePhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),
	makePhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),
	makePhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),
	makePhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),
	makePhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),
	makePhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),
	makePhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]]),
	makePhrase([[1, 8], [3, 16], [-4, 16], [5, 16], [-3, 16], [6, 16], [-2, 16]])
	//makePhrase([[1, 8], [3, 8], [5, 8], [3, 8]]),
	//makePhrase([[1, 8], [3, 8], [5, 8], [3, 8]]),
	//makePhrase([[1, 8], [3, 8], [5, 8], [3, 8]])
]

function Note(tone, noteValue) {
	this.tone = tone;
	this.noteValue = noteValue;
}

function Phrase(notes) {
	this.notes = notes;
}

function makePhrase(notes) {
	tempPhrase = [];
	for (var i = 0; i < notes.length; i++) {
		var thisNote = new Note(notes[i][0], notes[i][1]);
		tempPhrase.push(thisNote);
	}
	return new Phrase(tempPhrase);
}

var playPhrase = function(section, phrasePosition) {
	console.log("playPhrase");
	console.log("section " + section + " phrase " + phrase);
	var startTime = ctx.currentTime;
	var phraseRoot = settings["sections"][section][phrasePosition][1];
	var phraseIndex = settings["sections"][section][phrasePosition][0];
	phrase = phrases[phraseIndex];//settings["sections"][section][phrase][0];
	for (var i = 0; i < phrase.notes.length; i++) {
		var beatValue = (1 / (settings.tempo / 60)) * 4; 
		var toneLookup = getNoteNumber(phrase.notes[i].tone, phraseRoot);
		var freq = _tonesTable[toneLookup];
    	var duration = beatValue / phrase.notes[i].noteValue;
    	playOsc(freq, duration, startTime);
		var startTime = startTime + duration;
	}
}

var getDuration = function() {
	var beatValue = (1 / (settings.tempo / 60));
	var duration = (2 * beatValue) * 1000; //Convert to ms for setTimeout
	return duration; 
}

var getNextPhrase = function(section, phrasePosition) {
	if (++phrasePosition > 7) {
		section = (section + 1) % 8;
		phrasePosition = 0;
	} 
	return { 
		"section": section,
		"phrase": phrasePosition 
	}
}

var scheduler = function(section, phrasePosition) {
	var duration = getDuration();
	var nextPhraseObj = getNextPhrase(section, phrasePosition);
	playPhrase(section, phrasePosition);
	setTimeout(function() { 
		scheduler(nextPhraseObj["section"], nextPhraseObj["phrase"]); 
	}, duration);
}

//playPhrase schedules next phrase


//playPhrase(0, 15, aPhrase);

//playPhrase(0, 15, phrases[0]);
//playPhrases(phrases);

socket.on("init", function(data) {
    settings = data.state;
    role = data.role;
});

socket.on("state.change", function(data) {
	settings = data;
});

setTimeout(function() {
	scheduler(0, 0);
}, 1000);

// var playPhrases = function(phrases) {
// 	var startTime = ctx.currentTime;
// 	var beatValue = (1 / (settings.tempo / 60)) * 4;
// 	for (var i = 0; i < phrases.length; i++) {
// 		playPhrase(startTime, 15, phrases[i]);
// 		startTime = startTime + (beatValue / 2);
// 	}
// }
