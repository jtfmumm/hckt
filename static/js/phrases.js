var majorScale = [0, 2, 4, 5, 7, 9, 11];

var semiTone = Math.pow(2, 1/12);

var ctx = new webkitAudioContext();

var settings = {
	tempo: 120
}

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
	osc = ctx.createOscillator();
	osc.frequency.value = freq;
	osc.type = "square";
	osc.connect(ctx.destination);
	osc.start(startTime);
	osc.stop(startTime + dur);
}

var playPhrase = function(phraseStartTime, phraseRoot, phrase) {
	var startTime = phraseStartTime;
	for (var i = 0; i < phrase.notes.length; i++) {
		var beatValue = (1 / (settings.tempo / 60)) * 4; 
		var toneLookup = phraseRoot + phrase.notes[i].tone;
		var freq = _tonesTable[toneLookup];
    	var duration = beatValue / phrase.notes[i].noteValue;

		console.log(startTime);
		console.log(duration);

    	playOsc(freq, duration, startTime);
		var startTime = startTime + duration;
	}
}

function Note(tone, noteValue) {
	this.tone = tone;
	this.noteValue = noteValue;
}

function Phrase(notes) {
	this.notes = notes;
}

var theNotes = [new Note(0, 8), new Note(5, 8), new Note(8, 8), new Note(-4, 8)];

var aPhrase = new Phrase(theNotes);

playPhrase(0, 15, aPhrase);




