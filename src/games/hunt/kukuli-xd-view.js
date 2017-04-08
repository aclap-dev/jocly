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
			boardHeight: 6,
			footer: 1,
			left: 1,
			boardWidth: 4,
			right: 1,
	};
	
	this.g.huntGameData.lightsIntensity=0.55;

	this.g.huntGameData.boardRowOffset=2;
		
	this.g.huntGameData.sprites="/res/xd-view/meshes/kukuli/tokens.png";
	this.g.huntGameData.boardJSFile="/res/xd-view/meshes/board.js";
	this.g.huntGameData.hunterJSFile="/res/xd-view/meshes/kukuli/kukuli2.js";
	this.g.huntGameData.preyJSFile="/res/xd-view/meshes/kukuli/ukuku2.js";
	this.g.huntGameData.targetJSFile="/res/xd-view/meshes/target.js";
	this.g.huntGameData.preyScale=0.5;
	this.g.huntGameData.hunterScale=0.5;
	this.g.huntGameData.boardSize=1.23;
	this.g.huntGameData.boardZ=0;
	this.g.huntGameData.preyZ0=0;
	this.g.huntGameData.hunterZ0=0;
	this.g.huntGameData.screenDist=12000;
	this.g.huntGameData.screenScale=4.5;
	this.g.huntGameData.fieldMap="/res/xd-view/meshes/kukuli/kukuliboard.jpg";
	this.g.huntGameData.fieldSpecMap="/res/xd-view/meshes/kukuli/kukuliboard-specular.jpg";
	this.g.huntGameData.boardField2D=this.g.huntGameData.fieldMap;
	
	this.g.huntGameData.soundMove="move"; // to center exotic boards
	this.g.huntGameData.soundEndJump="jumpend"; // to center exotic boards
	
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
