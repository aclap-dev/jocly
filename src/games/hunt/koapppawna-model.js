/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

Model.Game.InitGame = function() {
	var $this=this;
	this.HuntInitGame();
	Object.assign(this.g.huntOptions,{
		compulsaryCatch: true,
		catchLongestLine: true,
		multipleCatch: true,
	});
	this.HuntMakeGrid({});
	
	this.g.catcher=JocGame.PLAYER_A;
	this.g.catcherMin=1;
	this.g.catcheeMin=10;
	this.g.initialPos=[[12],[10,14,17,16,18,22,15,19,21,23,20,24]];
	
	this.HuntPostInitGame();
}


