/*
collision.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var game = game || {};
/*//Rectangle vs rectangle collision detection
			if (player[nr].x < level[i].x + BOX.WIDTH  && player[nr].x + PLAYER.RADIUS  > level[i].x && 
				player[nr].y < level[i].y + BOX.HEIGHT && player[nr].y + PLAYER.RADIUS > level[i].y) {
				// The objects are touching
				player[nr].x=oldPlayer[nr].x;
				player[nr].y=oldPlayer[nr].y;
			}*/
game.collision = (function(){
	var BOX;
	var PLAYER;
	var CANVAS_WIDTH;
	var CANVAS_HEIGHT;
	function init(){
		BOX=game.main.BOX;
		PLAYER=game.main.PLAYER;
		CANVAS_HEIGHT=game.main.CANVAS_HEIGHT;
		CANVAS_WIDTH=game.main.CANVAS_WIDTH;
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
	
	function circlesIntersect(c1,c2){
		var dx=c2.x-c1.x;
		var dy = c2.y-c1.y;
		var distance= Math.sqrt(dx*dx + dy*dy);
		return distance < c1.radius + c2.radius;
	};
	
	// return true if the rectangle and circle are colliding
	// this function is from user marcE from stackoverflow.com: http://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle-in-html5-canvas
	// I altered this code to fit in my needs.
	function rectCircleColliding(circle,rect){
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
	// return true if the rectangle and circle are colliding
	// this function is from user marcE from stackoverflow.com: http://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle-in-html5-canvas
	// I altered this code to fit in my needs.
	function bombColliding(circle,rect){
		var distX = Math.abs(circle.x - rect.x-BOX.WIDTH/2);
		var distY = Math.abs(circle.y - rect.y-BOX.HEIGHT/2);

		if (distX > (BOX.WIDTH/2 + circle.radius)) { return false; }
		if (distY > (BOX.HEIGHT/2 + circle.radius)) { return false; }

		if (distX <= (BOX.WIDTH/2)) { return true; } 
		if (distY <= (BOX.HEIGHT/2)) { return true; }

		var dx=distX-BOX.WIDTH/2;
		var dy=distY-BOX.HEIGHT/2;
		return (dx*dx+dy*dy<=(circle.radius*circle.radius));
	};
//return (or make public)
	return{
		playerHitLeft: playerHitLeft,
		playerHitRight: playerHitRight,
		playerHitTop: playerHitTop,
		playerHitBottom: playerHitBottom,
		circlesIntersect: circlesIntersect,
		bombColliding: bombColliding,
		rectCircleColliding: rectCircleColliding,
		init: init,
	};
}());