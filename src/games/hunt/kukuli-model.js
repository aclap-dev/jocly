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
	Object.assign(this.g.huntEval,{
		pieceCount: 1000000,
		distHome: 100,
		catcheeAtHome: 100,
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
	
	this.g.RC.push([-0.9,1.1]); // 25
	this.g.RC.push([-0.9,2]);   // 26
	this.g.RC.push([-0.9,2.9]); // 27
	this.g.RC.push([-1.6,0.4]); // 28
	this.g.RC.push([-1.6,2]);   // 29
	this.g.RC.push([-1.6,3.6]); // 30
	
	for(var i=25;i<=30;i++) 
		this.g.Graph[i]=[null,null,null,null,null,null,null,null];
	
	Connect(2,25,7,6);
	Connect(25,28,7,6);
	Connect(2,27,4,5);
	Connect(27,30,4,5);
	Connect(25,26,3,2);
	Connect(26,27,3,2);
	Connect(28,29,3,2);
	Connect(29,30,3,2);
	Connect(2,26,0,1);
	Connect(26,29,0,1);
	
	this.g.catcher=JocGame.PLAYER_A;
	this.g.catcherMin=1;
	this.g.catcheeMin=10;
	this.g.initialPos=[[26],[10,14,15,16,17,18,19,20,21,22,23,24]];
	
	this.HuntPostInitGame();
}

Model.Board.Evaluate = function(aGame,aFinishOnly,aTopLevel) {
	var evalData=this.HuntMakeEvalData(aGame);
	this.mEvaluation=0;
	/*this.mEvaluation+=this.HuntEvaluatePieceCount(aGame,evalData)*aGame.g.huntEval.pieceCount;

	var freeZoneCount=this.HuntEvaluateFreeZone(aGame,evalData);
	
	this.mEvaluation+=freeZoneCount*evalData.catcher*aGame.g.huntEval.freeZone;
	this.mEvaluation+=this.HuntEvaluateDistToCatcher(aGame,evalData)*evalData.catcher*aGame.g.huntEval.distToCatcher;

	var distCatcherHome=aGame.HuntDist(evalData.catcherPieces[0].p,29);
	var catcheeCloserCount=0;
	var catchees=[];
	for(var i in evalData.catcheePieces) {
		var piece=evalData.catcheePieces[i];
		var dist=aGame.HuntDist(piece.p,29);
		catchees.push(dist);
		if(dist<=distCatcherHome)
			catcheeCloserCount++;
	}
	if(catcheeCloserCount>=7) {
		catchees.sort(function(a,b) {
			return a-b;
		});
		var dist=0;
		for(var i=0;i<5;i++)
			dist+=catchees[i];
		this.mEvaluation+=(50-dist)*evalData.catchee*aGame.g.huntEval.distHome;
	}
	
	var homeCount=0;
	var catcherAtHome=false;
	var homePoss=[25,26,27,28,29,30,2];
	for(var i in homePoss) {
		var pos=homePoss[i];
		var piece=this.board[pos];
		if(piece!=null) {
			if(piece.s==evalData.catcher)
				catcherAtHome=true;
			else
				homeCount++;
		}
	}
	if(homeCount==7) {
		this.mFinished=true;
		this.mWinner=evalData.catchee;
	}
	this.mEvaluation+=homeCount*evalData.catchee*aGame.g.huntEval.catcheeAtHome;*/
 }


