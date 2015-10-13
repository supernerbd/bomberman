/*
main.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var game = game || {};

// first step: set up canvas, 2. establish animation loop, 3. draw boxes, 4. draw player, 5. check collision, 6. destructable boxes, 7. bombs, 8. exploding and destruction
// !! this. can be used for functions but not for vars!!
game.main = (function(){
	//properties
		//for each outside object used in here (init in loader.js) Make them public!
		
		//for inside this object
		var CANVAS_HEIGHT = 550;
		var CANVAS_WIDTH = 1050;
		var paused = false;
		var canvas= undefined;
		var ctx = undefined;
		var windowHeight;
		var windowWidth;
		var animationID=0;
		var lastTime = 0;
		var debug = true;
		var level = [];
		var player = [];
		var oldPlayer=[];
		//BOX object
		var BOX = Object.freeze({
			HEIGHT: 50,
			WIDTH: 50,
		});
		//PLAYER Object
		var PLAYER = Object.freeze({
			RADIUS: 20,
			SPEED: 80,
		});
	//methods
	function init(){ //setup canvas, set canvas into center of screen, setup mouse controls, start animation loop
		//setup canvas
		windowHeight=window.innerHeight;
		windowWidth=window.innerWidth;
		document.querySelector('canvas').style.left = windowWidth/2-CANVAS_WIDTH/2 + "px";
		document.querySelector('canvas').style.top= windowHeight/2-CANVAS_HEIGHT/2 + "px";
		canvas = document.querySelector('canvas');
		canvas.width = CANVAS_WIDTH;
		canvas.height = CANVAS_HEIGHT;
		ctx = canvas.getContext('2d');
		// hook up events (mouse)
		canvas.onmousedown = doMousedown; //do I need mouse? Maybe to start level, navigate menus
		//setup sound
		
		//setup game state/level
		setupLevel();
		//start animation/gameLoop
		gameLoop();
	};
	
	function gameLoop(){
		// 1) PAUSED?
	 	// if so, bail out of loop
	 	if(paused){
			drawPauseScreen();
			return;
		}
		// 1) LOOP
		// schedule a call to gameLoop()
	 	animationID=requestAnimationFrame(gameLoop);
	 	
	 	// 3) HOW MUCH TIME HAS GONE BY?
	 	var dt = calculateDeltaTime();
		
		// 4) UPDATE
		//Player movement
		movePlayer(dt);
		//check collision
		//checkCollision();
		
		// 5) DRAW	
		// i) draw background
		ctx.fillStyle = "white"; 
		ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT); 
	
		// ii) draw 
		drawLevel();
		// iii) draw HUD

		
		//debug
		if (debug){
			// draw dt in bottom right corner
			fillText(ctx,"dt: " + dt.toFixed(3), CANVAS_WIDTH - 150, CANVAS_HEIGHT - 10, "18pt courier", "black");
		}
	};
	
	function drawLevel(){
		for (var i=0; i<=level.length; i++){
			if(level[i]==undefined){ }
			else{
				//draw static boxes
				if(level[i].fixed){
					ctx.save();
					ctx.fillStyle="grey";
					ctx.fillRect(level[i].x,level[i].y,BOX.HEIGHT,BOX.WIDTH);
					ctx.restore();
				}
			}
		}
		//drawPlayer
		for (var i=0; i<=1; i++){ //bad code but length didn't worked..
			ctx.save();
			ctx.beginPath();
			ctx.arc(player[i].x, player[i].y, PLAYER.RADIUS, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.fillStyle=player[i].color;
			ctx.fill();
			ctx.restore();
		}
	};
	
	function setupLevel(){ //setup level in level Array
		//grid of fixed boxes
		for (var i=BOX.HEIGHT; i<=CANVAS_HEIGHT; i=i+BOX.HEIGHT*2){ 
			for (var j=BOX.WIDTH; j<=CANVAS_WIDTH; j=j+BOX.WIDTH*2){
				var box = new Box(j,i,true);
				Object.seal(box);
				level.push(box);
			}
		}
		// add player
		var pl1=new Player(25,270,"red","KEY_UP","KEY_RIGHT","KEY_DOWN","KEY_LEFT","KEY_M");
		var pl2=new Player(1025,270,"blue","KEY_W","KEY_D","KEY_S","KEY_A","KEY_SHIFT");
		player[0]=pl1;
		player[1]=pl2;
		oldPlayer[0]=new OldPlayer(player[0].x,player[0].y);
		oldPlayer[1]=new OldPlayer(player[1].x,player[1].y);
	};
	
	function movePlayer(dt){
		//Maybe bomb only on keyup...
		//changable keys: run through array and check for true.
		//myKeys.keydown[myKeys.KEYBOARD.KEY_UP] this.x+=this.xSpeed*this.speed*dt;
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_UP]){player[0].y-=PLAYER.SPEED*dt; checkCollision(0);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_RIGHT]){player[0].x+=PLAYER.SPEED*dt; checkCollision(0);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_DOWN]){player[0].y+=PLAYER.SPEED*dt; checkCollision(0);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_LEFT]){player[0].x-=PLAYER.SPEED*dt; checkCollision(0);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_M]){console.log("player[0] bomb")}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_W]){player[1].y-=PLAYER.SPEED*dt; checkCollision(1);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_D]){player[1].x+=PLAYER.SPEED*dt; checkCollision(1);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_S]){player[1].y+=PLAYER.SPEED*dt; checkCollision(1);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_A]){player[1].x-=PLAYER.SPEED*dt; checkCollision(1);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_SHIFT]){console.log("player[1] SHIFT")}
		oldPlayer[0].x=player[0].x;
		oldPlayer[0].y=player[0].y;
		oldPlayer[1].x=player[1].x;
		oldPlayer[1].y=player[1].y;
	};
	
	function checkCollision(nr){
		for (var i=0; i<level.length; i++){
			/*//Rectangle vs rectangle collision detection
			if (player[nr].x < level[i].x + BOX.WIDTH  && player[nr].x + PLAYER.RADIUS  > level[i].x && 
				player[nr].y < level[i].y + BOX.HEIGHT && player[nr].y + PLAYER.RADIUS > level[i].y) {
				// The objects are touching
				player[nr].x=oldPlayer[nr].x;
				player[nr].y=oldPlayer[nr].y;
			}*/
			if(RectCircleColliding(player[nr],level[i])){
				player[nr].x=oldPlayer[nr].x;
				player[nr].y=oldPlayer[nr].y;
			}
		}
		playerHitLeft(player[nr]);
		playerHitRight(player[nr]);
		playerHitTop(player[nr]);
		playerHitBottom(player[nr]);
	}
	
	function Player(x,y,color,up,right,down,left,bomb){ //Keys only if changeable keys is possible
		this.x=x;
		this.y=y;
		this.color=color;
		this.up=up;
		this.right=right;
		this.down=down;
		this.left=left;
		this.bomb=bomb;
		return this;
	};
	
	function OldPlayer(x,y){ //Keys only if changeable keys is possible
		this.x=x;
		this.y=y;
		return this;
	};
	
	function Box(x,y,fixed){ //fixed is boolean
		this.x=x;
		this.y=y;
		this.fixed=fixed;
		return this;
	};
	
	function fillText(ctx, string, x, y, css, color) {
		ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	};
	
	function calculateDeltaTime(){
		// what's with (+ new Date) below?
		// + calls Date.valueOf(), which converts it from an object to a 	
		// primitive (number of milliseconds since January 1, 1970 local time)
		var now,fps;
		now = (+new Date); 
		fps = 1000 / (now - lastTime);
		fps = clamp(fps, 12, 60);
		lastTime = now; 
		return 1/fps;
	};
	
	function doMousedown(e){ //not that important in this game, but handy in navigating the game menu
		var mouse=getMouse(e);
		console.log("mouse click at " + mouse.x + " " + mouse.y);
	};
	
	function pauseGame(){//pause (stop audio, stop animation, call paused screen)
		//this.stopBGAudio();
		paused=true;
		//stop the animation loop
		cancelAnimationFrame(animationID);
		// call update() once so that our paused screen gets drawn
		gameLoop();
	};
	
	function resumeGame(){//resume (resume audio, restart animation)
		// stop ths animation loop, just in case it's running
		cancelAnimationFrame(animationID);
		
		paused=false;
		//this.sound.playBGAudio();
		//restart the loop
		gameLoop();
	};
	
	function drawPauseScreen(){
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		fillText(ctx,"... PAUSED ...", CANVAS_WIDTH/2, CANVAS_HEIGHT/2, "40pt courier", "white")
		ctx.restore();
	};
	
	function playerHitLeft(c){
		if(c.x<=PLAYER.RADIUS){
			c.x=PLAYER.RADIUS;
		}
	};
	function playerHitRight(c){
		if(c.x>=CANVAS_WIDTH-PLAYER.RADIUS){
			c.x=CANVAS_WIDTH-PLAYER.RADIUS;
		}
	};
	
	function playerHitTop(c){
		if(c.y<=PLAYER.RADIUS){
			c.y=PLAYER.RADIUS;
		}
	};
	
	function playerHitBottom(c){
		if(c.y>=CANVAS_HEIGHT-PLAYER.RADIUS){
			c.y=CANVAS_HEIGHT-PLAYER.RADIUS;
		}
	};
	
	// return true if the rectangle and circle are colliding
	// this function is from user marcE from stackoverflow.com: http://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle-in-html5-canvas
	// I altered this code to fit in my needs.
	function RectCircleColliding(circle,rect){
		var distX = Math.abs(circle.x - rect.x-BOX.WIDTH/2);
		var distY = Math.abs(circle.y - rect.y-BOX.HEIGHT/2);

		if (distX > (BOX.WIDTH/2 + PLAYER.RADIUS)) { return false; }
		if (distY > (BOX.HEIGHT/2 + PLAYER.RADIUS)) { return false; }

		if (distX <= (BOX.WIDTH/2)) { return true; } 
		if (distY <= (BOX.HEIGHT/2)) { return true; }

		var dx=distX-BOX.WIDTH/2;
		var dy=distY-BOX.HEIGHT/2;
		return (dx*dx+dy*dy<=(PLAYER.RADIUS*PLAYER.RADIUS));
	};
	
	//return (or make public)
	return{
		init: init,
		pauseGame: pauseGame,
		resumeGame: resumeGame,
	};
}());