/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

/*
Model.Move.PosName={
	0:"C7",1:"D7",2:"E7",
	3:"C6",4:"D6",5:"E6",
	6:"A5",7:"B5",8:"C5",9:"D5",10:"E5",11:"F5",12:"G5",
	13:"A4",14:"B4",15:"C4",16:"D4",17:"E4",18:"F4",19:"G4",
	20:"A3",21:"B3",22:"C3",23:"D3",24:"E3",25:"F3",26:"G3",
	27:"C2",28:"D2",29:"E2",
	30:"C1",31:"D1",32:"E1",
}
*/

Model.Board.HuntGameEvaluate = function(aGame,evalData,evalMap) {
	this.HuntEvaluateDistToCatcher(aGame,evalData,evalMap);
	this.HuntEvaluateCatchable(aGame,evalData,evalMap);
	this.HuntEvaluateAntiBack(aGame,evalData,evalMap);
	this.HuntEvaluateGroups(aGame,evalData,evalMap);
	
	if(evalMap.minEmptyCatcherGroup[0]<=6)
		evalMap.minEmptyCatcherGroup[1]=6-evalMap.minEmptyCatcherGroup[0];
	var evalFactors={ 
		pieceCount: [12000000,1000000],
		dist3: [5,0],
		antiBack: [2000,10],
		antiBackPiece: [100,1],
		catchablePieces: [20,0],
		catchableDir: [10,0],
		catchDangerFork: [100000,0],
		maxEmptyNoCatcherGroup: [0,30],
		emptyNoCatcherGroup: [0,100],
		catcheeGroups: [10,0],
		minEmptyCatcherGroup: [90,200],
	};
	return evalFactors;

/*
	this.HuntEvaluateDistToCatcher(aGame,evalData,evalMap);
	this.HuntEvaluateCatchable(aGame,evalData,evalMap);
	this.HuntEvaluateAntiBack(aGame,evalData,evalMap);
	this.HuntEvaluateGroups(aGame,evalData,evalMap);
	
	if(evalMap.minEmptyCatcherGroup[0]<=6)
		evalMap.minEmptyCatcherGroup[1]=6-evalMap.minEmptyCatcherGroup[0];
	var evalFactors={ 
		pieceCount: [12000000,1000000],
		dist3: [10,0],
		//antiBack: [2000,10],
		antiBackPiece: [100,1],
		catchablePieces: [20,0],
		catchableDir: [10,0],
		catchDangerFork: [100000,0],
		maxEmptyNoCatcherGroup: [0,30],
		emptyNoCatcherGroup: [0,100],
		catcheeGroups: [100,0],
		minEmptyCatcherGroup: [90,200],
	};
	return evalFactors;
*/
}


Model.Game.InitGame = function() {
	var $this=this;
	this.HuntInitGame();
	Object.assign(this.g.huntOptions,{
		compulsaryCatch: true,
		catchLongestLine: false,
		multipleCatch: true,
	});
	Object.assign(this.g.huntEval,{
	});
	this.HuntMakeGrid({
		rows: 7,
		cols: 7,
	});
	this.HuntRemovePositions([0,1,7,8,5,6,12,13,35,36,42,43,40,41,47,48]);
	
	function Connect(pos0,pos1,dir0,dir1) {
		$this.g.Graph[pos0][dir0]=pos1;
		$this.g.Graph[pos1][dir1]=pos0;		
	}
	Connect(0,4,6,7);
	Connect(4,10,6,7);
	Connect(6,14,6,7);
	Connect(14,22,6,7);
	Connect(8,16,6,7);
	Connect(16,24,6,7);
	Connect(10,18,6,7);
	Connect(18,26,6,7);
	Connect(22,28,6,7);
	Connect(28,32,6,7);

	Connect(8,4,4,5);
	Connect(4,2,4,5);
	Connect(20,14,4,5);
	Connect(14,8,4,5);
	Connect(22,16,4,5);
	Connect(16,10,4,5);
	Connect(24,18,4,5);
	Connect(18,12,4,5);
	Connect(30,28,4,5);
	Connect(28,24,4,5);
	
	this.g.catcher=JocGame.PLAYER_A;
	this.g.catcherMin=1;
	this.g.catcheeMin=10;
	this.g.initialPos=[[16],[9,8,10,7,11,4,3,5,6,12,1,0,2]];
	
	this.HuntPostInitGame();
}



