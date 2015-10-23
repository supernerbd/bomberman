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
// add hud and menus, add graphics, add sound
//put utilities and collision into own objects, rework the code (make it nice!),
//Power ups: more bombs, faster, greater explosion radius
//Collisions: Enemy shouldn't walk through my bomb...!!
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
		var gameState= undefined;
		//Arrays
		var level = [];
		var player = [];
		var oldPlayer=[];
		var bombs=[];
		//GAME_STATE Object
		var GAME_STATE = Object.freeze({ 
			BEGIN : 0,
			DEFAULT : 1,
			/*EXPLODING : 2,
			ROUND_OVER : 3,
			REPEAT_LEVEL : 4,*/
			END : 5
		});
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
		//BOX_POWERUP state object
		var BOX_POWERUP = Object.freeze({
			NO: 0,
			SPEED: 1,
			BOMB: 2,
			RADIUS: 3,
		});
		//VALUES_POWERUP object
		var VALUES_POWERUP = Object.freeze({ //each value added to current value in player object
			SPEED: 40,
			BOMB: 1,
			RADIUS: 40,			
		});
	//Other Objects
	function Player(x,y,color,up,right,down,left,bombsLeft,lives){ //Keys only if changeable keys is possible
		this.x=x;
		this.y=y;
		this.color=color;
		this.up=up;
		this.right=right;
		this.down=down;
		this.left=left;
		this.bombsLeft=bombsLeft;
		this.speed=PLAYER.SPEED;
		this.explosionRadius= BOMB.EXPLOSION_MAX_RADIUS_START;
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
		this.powerUp=BOX_POWERUP.NO;
		return this;
	};
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
		collision=game.collision; //didn't worked otherwise. Why?
		// hook up events (mouse)
		canvas.onmousedown = doMousedown; //do I need mouse? Maybe to start level, navigate menus
		//setup sound
		
		//setup game state/level
		gameState = GAME_STATE.START;
		setupLevel();
		//start animation/gameLoop
		gameLoop();
		//Event listener
		window.addEventListener("keyup",function(e){
		// bomb
		var char = String.fromCharCode(e.keyCode);
		if (char == "m" || char == "M"){
			setBomb(player[1].x,player[1].y,1,BOMB.RADIUS);
		}
		if (char == "c" || char == "C"){
			setBomb(player[0].x,player[0].y,0,BOMB.RADIUS);
		}
		});
	};
	
	function reset(){
		setupLevel();
		bombs=[];
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
		if(gameState==GAME_STATE.DEFAULT){
			drawLevel();
		}
		// iii) draw HUD
		drawHUD();		
		//debug
		if (debug){
			// draw dt in bottom right corner
			fillText("dt: " + dt.toFixed(3), CANVAS_WIDTH - 150, CANVAS_HEIGHT - 10, "18pt courier", "black");
		}
	};
	
	function drawHUD(){
		switch (gameState){
			case GAME_STATE.START:
				ctx.save();
				ctx.fillStyle="black";
				ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT); 
				ctx.textAlign="center";
				ctx.textBaseline="middle";
				fillText("BOMBER", CANVAS_WIDTH/2,150, "50pt courier", "white");
				fillText("Start game with a click...", CANVAS_WIDTH/2,CANVAS_HEIGHT-100, "30pt courier", "white");
				fillText("Left Player controle your character ", CANVAS_WIDTH/2,CANVAS_HEIGHT-200, "20pt courier", "white");
				fillText("with W,A,S,D and set Bomb with C.", CANVAS_WIDTH/2,CANVAS_HEIGHT-160, "20pt courier", "white");
				fillText("Right Player controle your character with ", CANVAS_WIDTH/2,CANVAS_HEIGHT-300, "20pt courier", "white");
				fillText("UP,DOWN,LEFT,RIGHT and set Bomb with M.", CANVAS_WIDTH/2,CANVAS_HEIGHT-260, "20pt courier", "white");
				ctx.restore();
			break;
			case GAME_STATE.DEFAULT:
				ctx.save();
				ctx.fillStyle="black";
				ctx.fillText("Lives: "+player[0].lives,10,10);
				ctx.fillText("Lives: "+player[1].lives,CANVAS_WIDTH-80,10);
				ctx.restore();
			break;
			case GAME_STATE.END:
				ctx.save();
				ctx.fillStyle="black";
				ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT); 
				ctx.textAlign="center";
				ctx.textBaseline="middle";
				if(player[0].lives==player[1].lives){
					fillText("DRAW! Try again.", CANVAS_WIDTH/2,CANVAS_HEIGHT/2, "50pt courier", "white");
				}
				if(player[0].lives<player[1].lives){
					fillText("Right Player Wins", CANVAS_WIDTH/2,CANVAS_HEIGHT/2, "50pt courier", "white");
				}
				if(player[0].lives>player[1].lives){
					fillText("Left Player Wins", CANVAS_WIDTH/2,CANVAS_HEIGHT/2, "50pt courier", "white");
				}
				fillText("Restart game with a click...", CANVAS_WIDTH/2,CANVAS_HEIGHT-100, "30pt courier", "white");
				ctx.restore();
			break;
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
				if(level[i].fixed){ //fixed boxes
					ctx.save();
					ctx.fillStyle="grey";
					ctx.fillRect(level[i].x,level[i].y,BOX.HEIGHT,BOX.WIDTH);
					ctx.restore();
				}
				else{ //non fixed boxes
					switch (level[i].powerUp){
						case 0: //without powerup
							ctx.save();
							ctx.fillStyle="blue";
							ctx.fillRect(level[i].x,level[i].y,BOX.HEIGHT,BOX.WIDTH);
							ctx.restore();
							break;
						case 1: //with powerup speed
							ctx.save();
							ctx.fillStyle="green";
							ctx.fillRect(level[i].x,level[i].y,BOX.HEIGHT,BOX.WIDTH);
							ctx.restore();
							break;
						case 2: //with powerup bombs
							ctx.save();
							ctx.fillStyle="yellow";
							ctx.fillRect(level[i].x,level[i].y,BOX.HEIGHT,BOX.WIDTH);
							ctx.restore();
							break;
						case 3: //with powerup radius
							ctx.save();
							ctx.fillStyle="black";
							ctx.fillRect(level[i].x,level[i].y,BOX.HEIGHT,BOX.WIDTH);
							ctx.restore();
							break;
					}
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
		var pl1=new Player(1025,270,"red","KEY_UP","KEY_RIGHT","KEY_DOWN","KEY_LEFT",2,2);
		var pl2=new Player(25,270,"blue","KEY_W","KEY_D","KEY_S","KEY_A",2,2);
		player[1]=pl1;
		player[0]=pl2;
		oldPlayer[0]=new OldPlayer(player[0].x,player[0].y);
		oldPlayer[1]=new OldPlayer(player[1].x,player[1].y);
	};
	
	function movePlayer(dt){
		//Maybe bomb only on keyup...
		//changable keys: run through array and check for true.
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_UP]){player[1].y-=player[1].speed*dt; checkCollision(1);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_RIGHT]){player[1].x+=player[1].speed*dt; checkCollision(1);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_DOWN]){player[1].y+=player[1].speed*dt; checkCollision(1);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_LEFT]){player[1].x-=player[1].speed*dt; checkCollision(1);}
		//if(myKeys.keydown[myKeys.KEYBOARD.KEY_M]){console.log("player[0] bomb")}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_W]){player[0].y-=player[0].speed*dt; checkCollision(0);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_D]){player[0].x+=player[0].speed*dt; checkCollision(0);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_S]){player[0].y+=player[0].speed*dt; checkCollision(0);}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_A]){player[0].x-=player[0].speed*dt; checkCollision(0);}
		//if(myKeys.keydown[myKeys.KEYBOARD.KEY_SHIFT]){setBomb(player[1].x,player[1].y,1)}
		oldPlayer[0].x=player[0].x;
		oldPlayer[0].y=player[0].y;
		oldPlayer[1].x=player[1].x;
		oldPlayer[1].y=player[1].y;
	};
	
	function checkCollision(nr){ //
		for (var i=0; i<level.length; i++){
			if(collision.rectCircleColliding(player[nr],level[i])){
				switch(level[i].powerUp){
					case 0:
					player[nr].x=oldPlayer[nr].x; //lets player stay where he is. No movement.
					player[nr].y=oldPlayer[nr].y;
					break;
					case 1: //Set powerup values and delete boxes after
					player[nr].speed+=VALUES_POWERUP.SPEED;
					level.splice(i, 1);
					break;
					case 2:
					player[nr].bombsLeft+=VALUES_POWERUP.BOMB;
					level.splice(i, 1);
					break;
					case 3:
					player[nr].explosionRadius+=VALUES_POWERUP.RADIUS;
					level.splice(i, 1);
					break;
				}
			}
		}
		collision.playerHitLeft(player[nr]);
		collision.playerHitRight(player[nr]);
		collision.playerHitTop(player[nr]);
		collision.playerHitBottom(player[nr]);
	};
	
	function checkExplosionsCollisions(nr){ //
		if(bombs[nr].exploding){ //handle explosion and power Ups
			for (var i=0; i<level.length; i++){
				if(collision.bombColliding(bombs[nr],level[i])){
					if(level[i].fixed!=true){//determine powerups and properly delete entry in array
						if(level[i].powerUp==0){
							var powerUp=determinePowerUp();
							switch (powerUp){
								case false:
								level.splice(i, 1);
								break;
								case 1:
								level[i].powerUp=1;
								break;
								case 2:
								level[i].powerUp=2;
								break;
								case 3:
								level[i].powerUp=3;
								break;
							}
						}
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
		/*else{ //handle collision
			console.log("collision");
			if(collision.circlesIntersect(player[0],bombs[nr])){
				player[0].x=oldPlayer[0].x; //lets player stay where he is. No movement.
				player[0].y=oldPlayer[0].y;
				console.log("collision0");
			}
			if(collision.circlesIntersect(player[1],bombs[nr])){
				player[1].x=oldPlayer[1].x; //lets player stay where he is. No movement.
				player[1].y=oldPlayer[1].y;
				console.log("collision1");
			}
		}*/
	};
	
	function checkBombs(dt){
		for (var i=0; i<bombs.length; i++){
			if(bombs[i].exploding==false){ //check if bomb is exploding
				checkExplosionsCollisions(i);
				if(bombs[i].time==0){ 			//check if bomb should explode
					bombs[i].exploding=true;
				}
			bombs[i].time=bombs[i].time-1; //primitive timer and dt needs to be worked in
			}
			else{ //bomb is indeed exploding
				//collision
				checkExplosionsCollisions(i);
				if(bombs[i].radius<player[bombs[i].playerNr].explosionRadius){ //set new radius
					bombs[i].radius+=BOMB.EXPLOSION_SPEED*dt;//explosion speed
				}
				else{
					bombs[i].done=true; //set end of bomb
				}
				//after explosion delete entry in array, add new possebility to plant bomb
				if(bombs[i].done){
					if(player[0].lostLives){
						player[0].lives-=1;
						if(player[0].lives<=0){
							gameState=GAME_STATE.END;
						}
						player[0].lostLives=false;
					}
					if(player[1].lostLives){
						player[1].lives-=1;
						if(player[1].lives<=0){
							gameState=GAME_STATE.END;
						}
						player[1].lostLives=false;
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
	
	function determinePowerUp(){ //randomize powerup occurnces
		var firstStep=Math.random();
		if (firstStep<=.8){
			return false;
		}
		else{
			var secondStep=getRandom(0,3);
			if(secondStep<1){
				return 1;
			}
			if(secondStep<2 && secondStep>1){
				return 2;
			}
			else{
				return 3;
			}
		}
	};
	
	function fillText(string, x, y, css, color) {
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
		//console.log("mouse click at " + mouse.x + " " + mouse.y);
		switch (gameState){
			case GAME_STATE.START:
				gameState=GAME_STATE.DEFAULT;
			break;
			case GAME_STATE.END:
				gameState=GAME_STATE.START;
				reset();
			break;
		}
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
		fillText("... PAUSED ...", CANVAS_WIDTH/2, CANVAS_HEIGHT/2, "40pt courier", "white")
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