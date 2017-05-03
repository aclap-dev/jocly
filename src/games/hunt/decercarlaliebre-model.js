/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

Model.Move.PosName={
	0:"A5",1:"B5",2:"C5",3:"D5",4:"E5",
	5:"A4",6:"B4",7:"C4",8:"D4",9:"E4",
	10:"A3",11:"B3",12:"C3",13:"D3",14:"E3",
	15:"A2",16:"B2",17:"C2",18:"D2",19:"E2",
	20:"A1",21:"B1",22:"C1",23:"D1",24:"E1",
}

Model.Board.HuntGameEvaluate = function(aGame,evalData,evalMap) {
/*
	this.HuntEvaluateDistToCatcher(aGame,evalData,evalMap);
	this.HuntEvaluateCatchable(aGame,evalData,evalMap);
	this.HuntEvaluateAntiBack(aGame,evalData,evalMap);
	this.HuntEvaluateGroups(aGame,evalData,evalMap);
	return { 
		pieceCount: [12000000,1000000],
		dist3: [15,0],
		antiBack: [1000,10],
		antiBackPiece: [100,1],
		catchablePieces: [20,0],
		catchableDir: [10,0],
		catchDangerFork: [1000,0],
		maxEmptyNoCatcherGroup: [0,30],
		emptyNoCatcherGroup: [0,100],
		catcheeGroups: [10,0],
		minEmptyCatcherGroup: [20,0],
	};
*/
	this.HuntEvaluateDistToCatcher(aGame,evalData,evalMap);
	//this.HuntEvaluateCatchable(aGame,evalData,evalMap);
	//this.HuntEvaluateAntiBack(aGame,evalData,evalMap);
	//this.HuntEvaluateGroups(aGame,evalData,evalMap);
	this.HuntEvaluateCatcheeGroups(aGame,evalData,evalMap);
	//this.HuntEvaluateCatcheeConnections(aGame,evalData,evalMap);
	this.HuntEvaluateFreeZone(aGame,evalData,evalMap);
	//this.HuntEvaluateOppositeDistFromCatcher(aGame,evalData,evalMap);
	this.HuntEvaluateRisk(aGame,evalData,evalMap);
	
	/*
	if(evalMap.minEmptyCatcherGroup[0]<=6)
		evalMap.minEmptyCatcherGroup[1]=6-evalMap.minEmptyCatcherGroup[0];
	*/
	var opts=aGame.mOptions.levelOptions;
	var evalFactors={
		/*
		pieceCount: [12000000,1000000],
		dist3: [15,0],
		antiBack: [2000,10],
		antiBackPiece: [100,1],
		catchablePieces: [20,0],
		catchableDir: [10,0],
		catchDangerFork: [100000,0],
		maxEmptyNoCatcherGroup: [0,30],
		emptyNoCatcherGroup: [0,100],
		catcheeGroups: [10,0],
		minEmptyCatcherGroup: [50,200],
		freeZone: [500,0],
		*/
	};
	for(var opt in opts) 
		if(opts.hasOwnProperty(opt)) {
			var m=/^(.*)(0|1)$/.exec(opt);
			if(!m)
				continue;
			if(evalFactors[m[1]]===undefined)
				evalFactors[m[1]]=[0,0];
			evalFactors[m[1]][m[2]]=opts[opt];
		}
	
	return evalFactors;
}

Model.Game.InitGame = function() {
	var $this=this;
	this.HuntInitGame();
	Object.assign(this.g.huntOptions,{
		compulsaryCatch: false,
		catchLongestLine: false,
		multipleCatch: true,
	});
	this.HuntMakeGrid({});
	function Connect(pos0,pos1,dir0,dir1) {
		$this.g.Graph[pos0][dir0]=pos1;
		$this.g.Graph[pos1][dir1]=pos0;		
	}
	Connect(10,6,4,5);
	Connect(6,2,4,5);
	Connect(20,16,4,5);
	Connect(16,12,4,5);
	Connect(12,8,4,5);
	Connect(8,4,4,5);
	Connect(22,18,4,5);
	Connect(18,14,4,5);

	Connect(0,6,6,7);
	Connect(6,12,6,7);
	Connect(12,18,6,7);
	Connect(18,24,6,7);
	Connect(10,16,6,7);
	Connect(16,22,6,7);
	Connect(2,8,6,7);
	Connect(8,14,6,7);
	
	this.g.catcher=JocGame.PLAYER_B;
	this.g.evaluate0=-2500000;
	this.g.catcherMin=1;
	this.g.catcheeMin=10;
	this.g.initialPos=[[0,1,2,3,4,5,6,7,8,9,10,14],[12]];
	
	this.HuntPostInitGame();
}


