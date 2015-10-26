/*
storage.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var game = game || {};

game.storage= (function(){
	//vars
	var wasHere;
	//helper. Found here: http://stackoverflow.com/questions/3357553/how-to-store-an-array-in-localstorage
	//this way i can store objects/arrays in local storage, very neat!
	
	Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
	}
	Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
	}
	
	function init(){ //returns if player had opened this site before
		if(window.localStorage.getObj("bomber")==undefined){
			wasHere=false;
			window.localStorage.setObj("bomber", "yes");
		}
		else{
			wasHere=true;
		}
		return wasHere;
	};
	
	return{
		init: init
	}
	
}());