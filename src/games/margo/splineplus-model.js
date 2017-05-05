/*
 * Copyright (c) 2013 - Jocly - www.jocly.com - All rights reserved
 */

Model.Board.GenerateAllMoves = function(aGame) {
	var moves=this.MakeFreeMoves(aGame);
	var sppMoves=this.MakeSelfSinglePinMoves(aGame);
	if(sppMoves.length>0)
		moves=moves.concat(sppMoves);
	return moves;
}

Model.Board.GetSingleUpBalls=function(aGame,pos,upFreeNeighbors) {
	var $this=this;
	var upNeighbors=[];
	var upDirs=[];
	aGame.g.EachDirectionUp(pos,function(pos1,dir1) {
		if($this.board[pos1]!=0) {
			upNeighbors.push(pos1);
			upDirs.push(dir1);
		} else if(upFreeNeighbors)
			upFreeNeighbors[pos1]=true;
		return true;
	});
	if(upNeighbors.length==0)
		return [];
	else if(upNeighbors.length>1)
		return null;
	else {
		var up=upNeighbors[0];
		var ups=[up];
		while((up=aGame.g.Graph[up][upDirs[0]])!=null) {
			if(this.board[up]==0) {
				if(upFreeNeighbors)
					upFreeNeighbors[up]=true;
				return ups;
			} else
				ups.push(up);
		}
		return ups; // top level; never happens
	}
}

Model.Board.MakeSelfSinglePinMoves = function(aGame) {
	var moves=[];
	var $this=this;
	var selfColor=this.mWho==JocGame.PLAYER_A?1:2;
		
	for(var pos=0; pos<aGame.g.Coord.length; pos++) { // go through every position
		if(aGame.g.Coord[pos][2]>this.maxLayer)
			break;
		if(this.board[pos]==selfColor) { // self balls
			var topFree={ };
			var upLine=this.GetSingleUpBalls(aGame,pos,topFree);
			if(upLine!=null) {
				for(var i=0; i<this.mMoves.length; i++) {
					var move=this.mMoves[i];
					if(move.act=='+' && typeof topFree[move.pos]=="undefined")
						moves.push({ act: '>', from: pos, to: move.pos, down: upLine, clr: selfColor });
				}
			}
		}
	}
	return moves;
}

Model.Board.Evaluate = function(aGame) {
	this.splineEvaluate.apply(this,arguments);
	//console.log("Eval"+this.mEvaluation,(this.height[1]-this.height[2])*3);
	this.mEvaluation+=(this.height[1]-this.height[2])*aGame.g.factor.sppHeight;
}
