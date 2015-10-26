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
	
	function init(ctx1){ //inits ctx and constants
		ctx=ctx1;
		CANVAS_HEIGHT=game.main.CANVAS_HEIGHT;
		CANVAS_WIDTH=game.main.CANVAS_WIDTH;
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
		fillText("BOMBING FOR TWO", CANVAS_WIDTH/2,150, "50pt courier", "black");
		fillText("Start game with a click...", CANVAS_WIDTH/2,CANVAS_HEIGHT-100, "30pt courier", "black");
		fillText("Left Player controle your character ", CANVAS_WIDTH/2,CANVAS_HEIGHT-200, "20pt courier", "black");
		fillText("with W,A,S,D and set Bomb with C.", CANVAS_WIDTH/2,CANVAS_HEIGHT-160, "20pt courier", "black");
		fillText("Right Player controle your character with ", CANVAS_WIDTH/2,CANVAS_HEIGHT-300, "20pt courier", "black");
		fillText("UP,DOWN,LEFT,RIGHT and set Bomb with M.", CANVAS_WIDTH/2,CANVAS_HEIGHT-260, "20pt courier", "black");
		ctx.restore();
	};
	
	function drawDefault(player){ //draws default HUD
		ctx.save();
		ctx.fillStyle="black";
		ctx.drawImage(heart,10, 1, 40,40);
		ctx.drawImage(heart,CANVAS_WIDTH-50,1, 40,40);
		fillText(player[0].lives,30,20,"15pt courier", "white");
		fillText(player[1].lives,CANVAS_WIDTH-30,20,"15pt courier", "white");
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
			fillText("DRAW! Try again.", CANVAS_WIDTH/2,CANVAS_HEIGHT/2, "50pt courier", "black");
		}
		if(player[0].lives<player[1].lives){
			fillText("Right Player Wins", CANVAS_WIDTH/2,CANVAS_HEIGHT/2, "50pt courier", "black");
			ctx.drawImage(player1, 500,100);
		}
		if(player[0].lives>player[1].lives){
			fillText("Left Player Wins", CANVAS_WIDTH/2,CANVAS_HEIGHT/2, "50pt courier", "black");
			ctx.drawImage(player0, 500,100);
		}
		fillText("Restart game with a click...", CANVAS_WIDTH/2,CANVAS_HEIGHT-100, "30pt courier", "black");
		ctx.restore();
	}
	
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
		drawEnd: drawEnd
	}
	
}());