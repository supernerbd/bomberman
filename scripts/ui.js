/*
ui.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var game = game || {};

game.ui= (function(){
	var ctx;
	var CANVAS_WIDTH;
	var CANVAS_HEIGHT;
	var BOX;
	
	function init(ctx1){ //inits ctx and constants
		ctx=ctx1;
		CANVAS_HEIGHT=game.main.CANVAS_HEIGHT;
		CANVAS_WIDTH=game.main.CANVAS_WIDTH;
		BOX=game.main.BOX;
	};
	
	function drawStart(){ //draws start view
		ctx.save();
		ctx.fillStyle="black";
		//ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT); 
		ctx.drawImage(background,0,0, CANVAS_WIDTH,CANVAS_HEIGHT);
		ctx.drawImage(player0, 100,100);
		ctx.drawImage(player1, 900,100);
		ctx.drawImage(bomb, 100,400);
		ctx.drawImage(bomb, 900,400);
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		fillText("BOMBING FOR TWO", CANVAS_WIDTH/2,150, "50pt Oswald", "black");
		fillText("Start game with a click...", CANVAS_WIDTH/2,CANVAS_HEIGHT-100, "30pt Oswald", "black");
		fillText("Left Player controle your character ", CANVAS_WIDTH/2,CANVAS_HEIGHT-200, "20pt Oswald", "black");
		fillText("with W,A,S,D and set Bomb with C.", CANVAS_WIDTH/2,CANVAS_HEIGHT-160, "20pt Oswald", "black");
		fillText("Right Player controle your character with ", CANVAS_WIDTH/2,CANVAS_HEIGHT-300, "20pt Oswald", "black");
		fillText("UP,DOWN,LEFT,RIGHT and set Bomb with M.", CANVAS_WIDTH/2,CANVAS_HEIGHT-260, "20pt Oswald", "black");
		ctx.restore();
	};
	
	function drawDefault(player){ //draws default HUD
		ctx.save();
		ctx.fillStyle="black";
		ctx.drawImage(heart,10, 1, 40,40);
		ctx.drawImage(heart,CANVAS_WIDTH-50,1, 40,40);
		fillText(player[0].lives,30,20,"15pt Oswald", "white");
		fillText(player[1].lives,CANVAS_WIDTH-30,20,"15pt Oswald", "white");
		ctx.restore();
	};
	
	function drawEnd(player){ //draws End view
		ctx.save();
		ctx.fillStyle="black";
		//ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT); 
		ctx.drawImage(background,0,0, CANVAS_WIDTH,CANVAS_HEIGHT);
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		if(player[0].lives==player[1].lives){
			fillText("DRAW! Try again.", CANVAS_WIDTH/2,CANVAS_HEIGHT/2, "50pt Oswald", "black");
		}
		if(player[0].lives<player[1].lives){
			fillText("Right Player Wins", CANVAS_WIDTH/2,CANVAS_HEIGHT/2, "50pt Oswald", "black");
			ctx.drawImage(player1, 500,100);
		}
		if(player[0].lives>player[1].lives){
			fillText("Left Player Wins", CANVAS_WIDTH/2,CANVAS_HEIGHT/2, "50pt Oswald", "black");
			ctx.drawImage(player0, 500,100);
		}
		fillText("Restart game with a click...", CANVAS_WIDTH/2,CANVAS_HEIGHT-100, "30pt Oswald", "black");
		ctx.restore();
	};
	
	function drawUI(storage){ //draws UI view
		if(storage){
			fillText("Welcome back", CANVAS_WIDTH/2-250,80, "50pt Oswald", "white");
		}
		else{
			fillText("Welcome", CANVAS_WIDTH/2-150,80, "50pt Oswald", "white");
		}
		//start Button
		ctx.save();
		ctx.fillStyle='rgba(0,0,0,0.40)';
		ctx.fillRect(375,100,300,100); 
		ctx.fillStyle="black";
		ctx.strokeRect(375,100,300,100); 
		fillText("START", 430,175, "50pt Oswald", "white");
		ctx.restore();
		//credit Button
		ctx.save();
		ctx.fillStyle='rgba(0,0,0,0.40)';
		ctx.fillRect(375,200,300,100); 
		ctx.fillStyle="black";
		ctx.strokeRect(375,200,300,100); 
		fillText("CREDITS", 390,275, "50pt Oswald", "white");
		ctx.restore();
		//help Button (back to Game-state.start
		ctx.save();
		ctx.fillStyle='rgba(0,0,0,0.40)';
		ctx.fillRect(375,300,300,100); 
		ctx.fillStyle="black";
		ctx.strokeRect(375,300,300,100); 
		fillText("HELP", 430,375, "50pt Oswald", "white");
		ctx.restore();
		//gems
		fillText("Speed", 310,CANVAS_HEIGHT-60, "20pt Oswald", "black");
		ctx.drawImage(powerUp0,325,CANVAS_HEIGHT-50, BOX.HEIGHT,BOX.WIDTH);
		fillText("Bomb", 510,CANVAS_HEIGHT-60, "20pt Oswald", "black");
		ctx.drawImage(powerUp1,525,CANVAS_HEIGHT-50, BOX.HEIGHT,BOX.WIDTH);
		fillText("Explosion", 710,CANVAS_HEIGHT-60, "20pt Oswald", "black");
		ctx.drawImage(powerUp2,745,CANVAS_HEIGHT-50, BOX.HEIGHT,BOX.WIDTH);
		//player
		ctx.drawImage(player0, 100,150);
		ctx.drawImage(player1, 900,150);
		fillText("LEFT PLAYER", 50,100, "20pt Oswald", "white");
		fillText("RIGHT PLAYER", 820,100, "20pt Oswald", "white");
	};
	
	function drawCredits(){ //draw Credits screen
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		fillText("Game by Bernd Paulus", 500,30, "30pt Oswald", "white");
		fillText("Diverse assets from:", 500,80, "20pt Oswald", "white");
		fillText("Background: 'High Resolution Textures'. Found here: http://seamless-pixels.blogspot.co.uk/2014/03/greengrassgroundlanddirtaerialtopseamle.html.", 500,100, "10pt Oswald", "white");
		fillText("Bomb: 'Open Clipart Pictures'. Found here: https://pixabay.com/de/bombe-explosiv-detonation-fuze-154456/. ", 500,110, "10pt Oswald", "white");
		fillText("All other Images: Daniel Cook: 'Planet Cute'. Sprite collection. Found here: http://www.lostgarden.com/2007/05/dancs-miraculously-flexible-game.html. ", 500,120, "10pt Oswald", "white");
		fillText("Ticking: By timgormly. Under CC BY 3.0. Converted from aif to mp3. Found here: https://www.freesound.org/people/timgormly/sounds/142593/.", 500,130, "10pt Oswald", "white");
		fillText("Explosion 2: By LiamG_SFX. Under CC BY-NC 3.0. Found here: https://www.freesound.org/people/LiamG_SFX/sounds/322509/. ", 500,140, "10pt Oswald", "white");
		fillText("Chrous Drums 120: By godspine Under CC0 1.0. Found here: https://www.freesound.org/people/godspine/sounds/173138/.", 500,150, "10pt Oswald", "white");
		fillText("drums straight backbeat ska: By bigjoedrummer. Under CC BY 3.0. Found here: https://www.freesound.org/people/bigjoedrummer/sounds/128633/.", 500,160, "10pt Oswald", "white");
		fillText("drum loop 0Y44: By Setuniman. Under CC BY-NC 3.0. Found here: https://www.freesound.org/people/Setuniman/sounds/177112/.", 500,170, "10pt Oswald", "white");
		fillText("170404A: By Freed. Under CC BY 3.0. Found here: https://www.freesound.org/people/Freed/sounds/8406/.", 500,180, "10pt Oswald", "white");
		fillText("Fond: 'Oswald' by Vernon Adams. Under SIL Open Font License, 1.1. Found here: https://www.google.com/fonts#QuickUsePlace:quickUse/Family:Oswald.", 500,190, "10pt Oswald", "white");
		fillText("Click to continue", 500,400, "30pt Oswald", "white");
		ctx.textAlign="start";
		ctx.textBaseline="alphabetic";
	};
	
	function pointInside(oX,oY,width,height,m){ //is mouse click in box?
		if( m.x >= oX && m.x <= oX + width && m.y >= oY && m.y <= oY + height ){
			return true;
		}
		else{
			return false;
		}
	};
	
	function fillText(string, x, y, css, color) { //helper to write text on canvas
		ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	};
	
	return{
		init: init,
		drawStart: drawStart,
		fillText: fillText,
		drawDefault: drawDefault,
		drawEnd: drawEnd,
		drawUI: drawUI,
		pointInside: pointInside,
		drawCredits: drawCredits
	}
	
}());