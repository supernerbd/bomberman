/*
sound.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var game = game || {};

game.sound = (function(){ //init sound and set sound vars (return)
	//vars
	var background0="background0";
	var background1="background1";
	var background2="background2";
	var background3="background3";
	var explosion="explosion";
	var ticking="ticking";
	var walking="walking";
	var backgroundSound;
	
	function init(){ //registers sounds for soundJS
		 createjs.Sound.registerSound("media/8406__freed__170404a.mp3", background0);
		 createjs.Sound.registerSound("media/128633__bigjoedrummer__drums-straight-backbeat-ska.mp3", background1);
		 createjs.Sound.registerSound("media/173138__godspine__chorus-drums-120.mp3", background2);
		 createjs.Sound.registerSound("media/177112__setuniman__drum-loop-0y44.mp3", background3);
		 createjs.Sound.registerSound("media/explosion.wav", explosion);
		 createjs.Sound.registerSound("media/ticking.mp3", ticking);
		 //createjs.Sound.registerSound("media/footsteps.wav", walking);
		 //createjs.Sound.addEventListener("fileload", createjs.proxy(this.playBackgroundSound, this));
	};
	
	function playBackgroundSound(){ //starts background sounds
		backgroundSound=createjs.Sound.play(background1);
		backgroundSound.loop=-1;
		console.log(backgroundSound);
	};
	
	function changeBackgroundSound(nr){ //changes track for background sounds
		backgroundSound.stop();
		backgroundSound=createjs.Sound.play("background"+nr);
		backgroundSound.loop=-1;
	};
	
	function stopBackgroundSound(){ //stops background sounds
		backgroundSound.stop();
	};
	
	function pauseBackgroundSound(){ //pauses background sounds
		backgroundSound.paused=true;
	};
	
	function resumeBackgroundSound(){ //resumes background sounds
		backgroundSound.paused=false;
	};
	
	return{ //returns public methods and vars
	explosion: explosion,
	ticking: ticking,
	init: init,
	playBackgroundSound: playBackgroundSound,
	changeBackgroundSound: changeBackgroundSound,
	stopBackgroundSound: stopBackgroundSound,
	pauseBackgroundSound: pauseBackgroundSound,
	resumeBackgroundSound: resumeBackgroundSound,
	};
}());