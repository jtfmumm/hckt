HCKT
===============
Hexacontakaitetratet 

A node.js-based multi-level collaborative sequencer.  

(This is a work-in-progress.  This is description has not been completely implemented yet.)

When players log on to a session, they are assigned a "role" corresponding to an 8-fader sequencer.  
These sequencers are organized in a hierarchical fashion.  At the lowest level, they correspond to
"sections" of the song composed of "phrases" which can be selected by the faders.  The phrases can
be algorithmically generated or can consist of precomposed material.  

At the middle level, there are sequencers whose faders are each connected to a single section below.  These faders control
parameters such as the local root tone and tone density of the corresponding section.  

At the highest level is the "conductor", who chooses (and alters in real-time) the tempo, base key signature, dynamics,
and other global parameters.

HCKT began as a project for the Monthly Music Hackathon in NYC 12.7.2013.
 

ROLES
===============

## Top
* Global Root
  * [1, 11]
  * random value from range 1-11 set once and only once on login
  * starts the value of I,II,...VI
  * never changes once set
* Tempo
  * [110, 130]
  * starts at 120
  * BPM (beats per minute)
  * small range
  * logarithmic range
* Scale
  * starts at major
  * Toggle between "major" and "minor"


### Want this to change easily
* Scale Degree Adventurousness
  * [0, 15]
  * start randomized
  * For each fader there is a button which is a lock
    * randomly chooses scale degree on each fader iteration
    * locked --> store previously created scale degree and do not auto generate
    * unlocked --> randomly generate new scale degrees

* Lead Envelope & Bass Envelope (two faders)
  * Attack --> how fast does a note start sounding
    * [0, 15]
  * Sustain --> how long does a note sustain    
    * [0, 15]





## Middle
* Note Density 
  * [0, 15]
  * What is the probablity a note will be played
* Chord Density
  * [0, 15]
  * How likely a chord is going to change
* Dynamics
  * [0, 15]
  * start off at 7
  * What is the loudest and quietest sound 





## Bottom
* 2 sets of 8 faders
  * LEAD
    * [0, 23]
  * BASS
    * [0, 15]
  * start randomized