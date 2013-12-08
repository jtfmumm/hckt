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
 