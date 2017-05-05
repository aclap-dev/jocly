/*
 * Copyright (c) 2013 - Jocly - www.jocly.com - All rights reserved
 */

Model.Game.InitGameExtra = function() {
	this.MapSameLevelDiagGraph();
	this.BuildSplineLines();
	this.g.factor={
			completion: [[4,2,1],[4,2],[4]],
			count: 0.1,
			sppHeight: 1.
	}
}

Model.Game.BuildSplineLines = function() {
	var $this=this;
	var lines=[];
	
	function EachDirectionSameLevel(pos,fnt) {
		var dirs=[7,15,5,13];
		for(var i=0;i<dirs.length;i++) {
			var npos=$this.g.Graph[pos][dirs[i]];
			if(npos!=null)
				fnt(npos,dirs[i]);
		}
	}

	var hBase=[0,16,25,29];
	for(var h=0;h<4;h++) 
		for(var r=0;r<4-h;r++)
			for(var c=0;c<4-h;c++) {
				var pos=hBase[h]+r*(4-h)+c;
				EachDirectionSameLevel(pos,function(pos1,dir) {
					var poss=[pos];
					while(pos1!=null) {
						poss.push(pos1);
						pos1=$this.g.Graph[pos1][dir];
					}
					if(poss.length==4-h)
						lines.push(poss);
				});
			}
	this.g.SplineLines=lines;
}

Model.Board.splineEvaluate = function(aGame,aFinishOnly,aTopLevel) {
	var lineCompletionA=[[0,0,0],[0,0],[0]];
	var lineCompletionB=[[0,0,0],[0,0],[0]];
	for(var i=0;i<aGame.g.SplineLines.length;i++) {
		var line=aGame.g.SplineLines[i];
		var h=aGame.g.Coord[line[0]][2];
		if(h>this.maxLayer)
			break;
		var empty=0;
		var playera=0;
		var playerb=0;
		for(var j=0; j<line.length; j++) {
			var pos=line[j];
			if(this.board[pos]==1)
				playera++;
			else if(this.board[pos]==2)
				playerb++;
			else {
				empty++;
				break;
			}
		}
		if(empty==0) {
			if(playera==0) {
				this.mFinished=true;
				this.mWinner=JocGame.PLAYER_B;
			} else if(playerb==0) {
				this.mFinished=true;
				this.mWinner=JocGame.PLAYER_A;
			}
			if(this.mFinished) {
				if(aTopLevel)
					this.mWinLine=line;
				return;
			}
		} else {
			if(playera==0 && playerb>0)
				lineCompletionB[h][h-playerb-1]++;
			else if(playerb==0 && playera>0)
				lineCompletionA[h][h-playera-1]++;
		}
	}
	this.mEvaluation=0;
	for(var i=0;i<3;i++) {
		for(var j=0;j<3-i;j++)
			this.mEvaluation+=(lineCompletionA[i][j]-lineCompletionB[i][j])*aGame.g.factor.completion[i][j];
	}
	this.mEvaluation += (this.ballCount[1]-this.ballCount[2])*aGame.g.factor.count;
}

Model.Board.Evaluate = function() {
	this.splineEvaluate.apply(this,arguments);
}
