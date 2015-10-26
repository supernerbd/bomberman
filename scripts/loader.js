/*
loader.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var game = game || {};


window.onload = function(){ //loads game when all scripts are loaded
	console.log("window.onload called");
	// This is ths "sandbox" where we hook our modules up
	// so that we donT have any hard-coded dependencies in
	// the moduls themselves
	// more full blown sandbox solutions are discussed here:
	//http://addyosmani.com/writing-modular-js/
	//app.sound.init();
	//app.main.sound = app.sound;
	game.main.sound=game.sound;
	game.collision.init();
	game.main.collision=game.collision;
	game.main.Emitter=game.Emitter;
	game.main.init();
};
window.onblur = function(){ //game gets paused
	//console.log("blur at " + Date());
	game.main.pauseGame();
};
window.onfocus = function(){ //game reumes
	//console.log("focus at " + Date());
	game.main.resumeGame();
}
