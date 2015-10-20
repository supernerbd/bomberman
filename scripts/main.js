/*
main.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var game = game || {};

// first step: set up canvas, 2. establish animation loop, 3. draw boxes, 4. draw player, 5. check collision, 6. destructable boxes, 7. bombs, 8. exploding and destruction
// maybe just using circles for exploding? Makes some things easier..
// !! this. can be used for functions but not for vars!!
// add hud and menus, add power ups, add graphics, add sound
//put utilities and collision into own objects, rework the code (make it nice!),
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
		var collision = undefined;
		//Arrays
		var level = [];
		var player = [];
		var oldPlayer=[];
		var bombs=[];
		//BOMB Object
		var BOMB = Object.freeze({
			RADIUS: 10,
			EXPLOSION_MAX_RADIUS_START: 80,
			EXPLOSION_SPEED: 30,
		});
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
		collision=game.collision; //didn't worked other wise. Why?
		// hook up events (mouse)
		canvas.onmousedown = doMousedown; //do I need mouse? Maybe to start level, navigate menus
		//setup sound
		
		//setup game state/level
		setupLevel();
		//start animation/gameLoop
		gameLoop();
		//Event listener
		window.addEventListener("keyup",function(e){
		// bomb
		var char = String.fromCharCode(e.keyCode);
		if (char == "m" || char == "M"){
			setBomb(player[0].x,player[0].y,0,BOMB.RADIUS);
		}
		if (char == "c" || char == "C"){
			setBomb(player[1].x,player[1].y,1,BOMB.RADIUS);
		}
		});
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
		//bombs checking
		checkBombs(dt);
		//check collision
		//checkCollision();
		
		// 5) DRAW	
		// i) draw background
		ctx.fillStyle = "white"; 
		ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT); 
	
		// ii) draw 
		drawLevel();
		// iii) draw HUD
			ctx.save;
			ctx.fillStyle="black";
			ctx.fillText("Lives: "+player[0].lives,10,10);
			ctx.fillText("Lives: "+player[1].lives,CANVAS_WIDTH-80,10);
			ctx.restore;
		
		//debug
		if (debug){
			// draw dt in bottom right corner
			fillText(ctx,"dt: " + dt.toFixed(3), CANVAS_WIDTH - 150, CANVAS_HEIGHT - 10, "18pt courier", "black");
		}
	};
	
	function drawLevel(){
		//draw bombs // Explosions through increasing radius
		for (var i=0; i<bombs.length; i++){
			ctx.save();
			ctx.beginPath();
			ctx.arc(bombs[i].x, bombs[i].y, bombs[i].radius, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.fillStyle="green";
			ctx.fill();
			ctx.restore();
		}
		//draw boxes
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
				else{
					ctx.save();
					ctx.fillStyle="blue";
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
		// add destructable boxes (code not final!!)
		for (var i=BOX.HEIGHT; i<=CANVAS_HEIGHT; i=i+BOX.HEIGHT*2){ 
			for (var j=BOX.WIDTH*2; j<=CANVAS_WIDTH-BOX.WIDTH*2; j=j+BOX.WIDTH*2){
				var box = new Box(j,i,false);
				Object.seal(box);
				level.push(box);
			}
		}
		for (var i=0; i<=CANVAS_HEIGHT; i=i+BOX.HEIGHT*2){ 
			for (var j=BOX.WIDTH*2; j<=CANVAS_WIDTH-BOX.WIDTH*2; j=j+BOX.WIDTH*2){
				var box = new Box(j,i,false);
				Object.seal(box);
				level.push(box);
			}
		}
		// add player
		var pl1=new Player(25,270,"red","KEY_UP","KEY_RIGHT","KEY_DOWN","KEY_LEFT",2,2);
		var pl2=new Player(1025,270,"blue","KEY_W","KEY_D","KEY_S","KEY_A",2,2);
		player[0]=pl1;
		player[1]=pl2;
		oldPlayer[0]=new OldPlayer(player[0].x,player[0].y);
		oldPlayer[1]=new OldPlayer(player[1].x,player[1].y);
	};
	
	function movePlayer(dt){
		//Maybe bomb only on keyup...
		//changable keys: run through array and check for true.
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_UP]){player[0].y-=PLAYER.SPEED*dt; checkCollision(0);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_RIGHT]){player[0].x+=PLAYER.SPEED*dt; checkCollision(0);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_DOWN]){player[0].y+=PLAYER.SPEED*dt; checkCollision(0);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_LEFT]){player[0].x-=PLAYER.SPEED*dt; checkCollision(0);}
		//if(myKeys.keydown[myKeys.KEYBOARD.KEY_M]){console.log("player[0] bomb")}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_W]){player[1].y-=PLAYER.SPEED*dt; checkCollision(1);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_D]){player[1].x+=PLAYER.SPEED*dt; checkCollision(1);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_S]){player[1].y+=PLAYER.SPEED*dt; checkCollision(1);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_A]){player[1].x-=PLAYER.SPEED*dt; checkCollision(1);}
		//if(myKeys.keydown[myKeys.KEYBOARD.KEY_SHIFT]){setBomb(player[1].x,player[1].y,1)}
		oldPlayer[0].x=player[0].x;
		oldPlayer[0].y=player[0].y;
		oldPlayer[1].x=player[1].x;
		oldPlayer[1].y=player[1].y;
	};
	
	function checkCollision(nr){ //stays here for now... Maybe move it to collsions. But player and bombs need to be public than..
		for (var i=0; i<level.length; i++){
			if(collision.rectCircleColliding(player[nr],level[i])){
				player[nr].x=oldPlayer[nr].x;
				player[nr].y=oldPlayer[nr].y;
			}
		}
		collision.playerHitLeft(player[nr]);
		collision.playerHitRight(player[nr]);
		collision.playerHitTop(player[nr]);
		collision.playerHitBottom(player[nr]);
	};
	
	function checkExplosionsCollisions(nr){ //stays here for now... Maybe move it to collsions. But player and bombs need to be public than..
		if(bombs[nr].exploding){
			for (var i=0; i<level.length; i++){
				if(collision.bombColliding(bombs[nr],level[i])){
					if(level[i].fixed!=true){
						level.splice(i, 1);
					}
				}
			}
			if(collision.circlesIntersect(player[0],bombs[nr])){
				player[0].lostLives=true;
			}
			if(collision.circlesIntersect(player[1],bombs[nr])){
				player[1].lostLives=true;
			}
		}
	};
	
	function checkBombs(dt){
		for (var i=0; i<bombs.length; i++){
			if(bombs[i].exploding==false){ //check if bomb is exploding
				if(bombs[i].time==0){ 			//check if bomb should explode
					bombs[i].exploding=true;
				}
			bombs[i].time=bombs[i].time-1; //primitive timer and dt needs to be worked in
			}
			else{ //bomb is indeed exploding
				//collision
				checkExplosionsCollisions(i);
				if(bombs[i].radius<BOMB.EXPLOSION_MAX_RADIUS_START){ //set new radius
					bombs[i].radius+=BOMB.EXPLOSION_SPEED*dt;//explosion speed
				}
				else{
					bombs[i].done=true; //set end of bomb
				}
				//after explosion delete entry in array, add new possebility to plant bomb
				if(bombs[i].done){
					if(player[bombs[i].playerNr].lostLives){
						player[bombs[i].playerNr].lives-=1;
						player[bombs[i].playerNr].lostLives=false;
					}
					player[bombs[i].playerNr].bombsLeft+=1;
					bombs.splice(i, 1);
				}
			}
		}
	};
	
	function setBomb(x,y,playerNr,radius){
		if(player[playerNr].bombsLeft>=0){ //check how many bombs left for each player
			var nr=bombs.length;
			bombs[nr]= new Bomb(x,y,playerNr,radius);
			player[playerNr].bombsLeft-=1;
		}
	};
	
	function Player(x,y,color,up,right,down,left,bombsLeft,lives){ //Keys only if changeable keys is possible
		this.x=x;
		this.y=y;
		this.color=color;
		this.up=up;
		this.right=right;
		this.down=down;
		this.left=left;
		this.bombsLeft=bombsLeft;
		this.lives=lives;
		this.lostLives=false;
		this.radius=PLAYER.RADIUS;
		return this;
	};
	
	function OldPlayer(x,y){ //Keys only if changeable keys is possible
		this.x=x;
		this.y=y;
		return this;
	};
	
	function Bomb(x,y,playerNr,radius){
		this.x=x;
		this.y=y;
		this.playerNr=playerNr;
		this.radius=radius;
		this.time=120; //own constant for the time?
		this.size=BOX.HEIGHT*2;
		this.exploding=false;
		this.done=false;
		return this;
	}
	
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
	
	//return (or make public)
	return{
		init: init,
		pauseGame: pauseGame,
		resumeGame: resumeGame,
		BOX: BOX,
		PLAYER: PLAYER,
		CANVAS_HEIGHT: CANVAS_HEIGHT,
		CANVAS_WIDTH: CANVAS_WIDTH,
		collision: collision,
	};
}());