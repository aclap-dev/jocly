/*
 *
 * Copyright (c) 2013 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */


View.Game.xdPreInit = function(xdv) {
	this.g.AisWhite=false;
	this.g.huntLayout={
			header: 1,
			boardHeight: 5,
			footer: 1,
			left: 1,
			boardWidth: 6,
			right: 1,
	};
	
	this.g.huntGameData.lightsIntensity=0.9;

		
	this.g.huntGameData.sprites="/res/xd-view/meshes/tiger/tokens-pulijudam.png";
	this.g.huntGameData.boardJSFile="/res/xd-view/meshes/tiger/pulijudam-board.js";
	this.g.huntGameData.hunterJSFile="/res/xd-view/meshes/tiger/lambfoot.js";
	this.g.huntGameData.preyJSFile="/res/xd-view/meshes/tiger/tigertooth.js";
	this.g.huntGameData.targetJSFile="/res/xd-view/meshes/target4.js";
	this.g.huntGameData.preyScale=0.3;
	this.g.huntGameData.hunterScale=0.25;
	this.g.huntGameData.boardSize=1.15;
	this.g.huntGameData.boardStretch=false;
	this.g.huntGameData.boardZ=0;
	this.g.huntGameData.preyZ0=0;
	this.g.huntGameData.hunterZ0=0;
	this.g.huntGameData.screenDist=12000;
	this.g.huntGameData.screenScale=4.5;
	//this.g.huntGameData.fieldMap="/res/xd-view/meshes/tiger/pulijudam.jpg";
	this.g.huntGameData.boardField2D="/res/xd-view/meshes/tiger/pulijudam.jpg";
	
	this.g.huntGameData.soundMove="move"; 
	this.g.huntGameData.soundEndJump="jumpend"; 
	
	this.g.huntGameData.targetColorSelected=0x333333;
	
	this.g.huntGameData.preyMorph=[1];
	this.g.huntGameData.hunterMorph=[1];
	
	this.g.huntGameData.sequences=[];
	this.g.huntGameData.sequences["prey"]=[];
	this.g.huntGameData.sequences["prey"]["walk"]=[
		[1],
	];
	this.g.huntGameData.sequences["prey"]["jump"]=[
		[1],
	];
	this.g.huntGameData.sequences["hunter"]=[];
	this.g.huntGameData.sequences["hunter"]["walk"]=[
		[1],
	];
}


View.Game.xdInitExtra = function(xdv){
	
}

View.Game.GetOffBoardCoord = function(i,cellSize) {
	return [(-this.g.huntLayout.boardWidth/2+this.g.huntLayout.boardWidth/15*i)*cellSize,3.5*cellSize];
}