/*
 *
 * Copyright (c) 2013 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */


View.Game.xdPreInit = function(xdv) {
	this.g.huntLayout={
			header: 1,
			boardHeight: 4,
			footer: 1,
			left: 1,
			boardWidth: 4,
			right: 1,
	};
	
	this.g.huntGameData.sprites="/res/images/liebre/tokens.png";
	this.g.huntGameData.boardJSFile="/res/xd-view/meshes/board.js";
	this.g.huntGameData.hunterJSFile="/res/xd-view/meshes/liebre/hunter2.js";
	this.g.huntGameData.hunterMaterialsPreload={
		matName:"mat.short",
		matMap:"/res/xd-view/meshes/liebre/hunter.jpg"
	};
	this.g.huntGameData.preyJSFile="/res/xd-view/meshes/liebre/liebre6.js";
	this.g.huntGameData.preyMaterialsPreload={
		matName:"Material",
		matMap:"/res/xd-view/meshes/liebre/rabbitskin4.jpg"
	};
	this.g.huntGameData.targetJSFile="/res/xd-view/meshes/target.js";
	this.g.huntGameData.preyScale=0.1;
	this.g.huntGameData.hunterScale=0.25;
	this.g.huntGameData.boardSize=1.25;
	this.g.huntGameData.boardZ=0;
	this.g.huntGameData.preyZ0=300;
	this.g.huntGameData.hunterZ0=0;
	this.g.huntGameData.screenDist=12000;
	this.g.huntGameData.screenScale=4.5;
	this.g.huntGameData.fieldMap="/res/xd-view/meshes/liebre/liebreboardsimple.jpg";
	this.g.huntGameData.boardField2D="/res/images/liebre/liebreboard.jpg";
	
	this.g.huntGameData.preyMorph=[1,0,0,0,0];
	this.g.huntGameData.hunterMorph=[1,0,0,0,0,0,0,0,0,0,0,0];

	//// default override ///
	this.g.huntGameData.killPieceZTempo=-0.5; // unit = cell size
	this.g.huntGameData.jumpEatScale=1.5;
	this.g.huntGameData.preyJumpsAtWalk=true;
	/////////////////////////

	this.g.huntGameData.sequences=[];
	this.g.huntGameData.sequences["prey"]=[];
	this.g.huntGameData.sequences["prey"]["walk"]=[	
		[0,1,0,0,0],
		[0,0,1,0,0],
		[0,0,0,1,0],
		[0,0,0,0,1],
	];
	this.g.huntGameData.sequences["prey"]["jump"]=this.g.huntGameData.sequences["prey"]["walk"];
	
	this.g.huntGameData.sequences["hunter"]=[];
	this.g.huntGameData.sequences["hunter"]["walk"]=[
		    	      [0,0,0,1,0,0,0,0,0,0,0,0],
		    	      [0,0,0,0,1,0,0,0,0,0,0,0],
		    	      [0,0,0,0,0,1,0,0,0,0,0,0],
		    	      [0,0,0,0,0,0,1,0,0,0,0,0],
		    	      [0,0,0,0,0,0,0,1,0,0,0,0],
		    	      [0,0,0,0,0,0,0,0,1,0,0,0],
		    	      [0,0,0,0,0,0,0,0,0,1,0,0],
		    	      [0,0,0,0,0,0,0,0,0,0,1,0],
		    	      [1,0,0,0,0,0,0,0,0,0,0,0],
	];
}


View.Game.xdInitExtra = function(xdv){
	
}
