/*
main.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var game = game || {};

// first step: set up canvas
// !! this. can be used for functions but not for vars!!
game.main = (function(){
	//properties
		//for each outside object (init in loader.js) Make them public!
		
		//for inside this object
		var paused = false;
	//methods
	function init(){ //setup canvas, set canvas into center of screen, setup mouse controls, start animation loop
	
	};
	
	function pauseGame(){//pause (stop audio, stop animation, call paused screen)
		/*this.stopBGAudio();
		this.paused=true;
		//stop the animation loop
		cancelAnimationFrame(this.animationID);
		// call update() once so that our paused screen gets drawn
		this.update();*/
	};
	
	function resumeGame(){//resume (resume audio, restart animation)
		/*// stop ths animation loop, just in case it's running
		cancelAnimationFrame(this.animationID);
		
		this.paused=false;
		this.sound.playBGAudio();
		//restart the loop
		this.update();*/
	};
	
	//return (or make public)
	return{
		init: init,
		pauseGame: pauseGame,
		resumeGame: resumeGame,
	};
}());