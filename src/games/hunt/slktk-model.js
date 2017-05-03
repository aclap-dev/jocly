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
		distToApex: 1500,
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
	
	this.g.SolGraph=JSON.parse(JSON.stringify(this.g.Graph));
	
	this.g.RC.push([-0.7,2-0.5625]); // 25
	this.g.RC.push([-0.7,2]);   // 26
	this.g.RC.push([-0.7,2+0.5625]); // 27
	this.g.RC.push([-1.6,2]); // 28
	
	for(var i=25;i<=28;i++) 
		this.g.Graph[i]=[null,null,null,null,null,null,null,null];
	
	Connect(1,25,4,5);
	Connect(25,28,4,5);
	Connect(28,27,6,7);
	Connect(27,3,6,7);
	Connect(25,26,3,2);
	Connect(26,27,3,2);
	Connect(2,26,0,1);
	Connect(26,28,0,1);
	
	this.g.catcher=JocGame.PLAYER_A;
	this.g.catcherMin=1;
	this.g.catcheeMin=4;
	this.g.initialPos=[[12],[0,1,2,3,4,9,14,19,24,23,22,21,20,15,10,5]];
	this.g.solCanCatch=false;
	
	this.HuntPostInitGame();
}

Model.Board.HuntGetAllMoves = function(aGame) {
	var moves;
	if(this.mWho==aGame.g.catcher)
		moves=this.GenerateGenMoves(aGame);
	else
		moves=this.GenerateSolMoves(aGame);
	return moves;
}

Model.Board.GenerateSolMoves = function(aGame) {
	var moves=[];
	for(var i=0; i<this.pieces.length; i++) {
		var piece=this.pieces[i];
		if(piece.s==-aGame.g.catcher && piece.p>-1) {
			for(var d=0;d<8;d++) {
				var pos=aGame.g.SolGraph[piece.p][d];
				if(pos!=null && this.board[pos]==null) {
					if(aGame.g.solCanCatch) {
						var caught=[];
						for(var d0=0;d0<8;d0++) {
							var pos0=aGame.g.SolGraph[pos][d0];
							if(pos0!=null) {
								var piece0=this.board[pos0];
								if(piece0!=null && piece0.s==aGame.g.catcher) {
									var pos1=aGame.g.SolGraph[pos0][d0];
									if(pos1!=null && this.board[pos1]!=null) {
										caught.push(pos0);
									}
								}
							}
						}
						if(caught.length==0) 
							moves.push({p:[piece.p,pos]});
						else
							moves.push({p:[piece.p,pos],c:caught});
					} else 
						moves.push({p:[piece.p,pos]});
				}
			}
		}
	}
	return moves;
}

Model.Board.GenerateGenMoves = function(aGame) {
	var moves=[];
	for(var i=0; i<this.pieces.length; i++) {
		var piece=this.pieces[i];
		if(piece.s==aGame.g.catcher && piece.p>-1) {
			for(var d=0;d<8;d++) {
				var pos=aGame.g.Graph[piece.p][d];
				if(pos!=null && this.board[pos]==null) {
					var caught=[];
					for(var bd0=0;bd0<4;bd0++) {
						var pos0=aGame.g.Graph[pos][2*bd0];
						var pos1=aGame.g.Graph[pos][2*bd0+1];
						if(pos0!=null && pos1!=null) {
							var piece0=this.board[pos0];
							var piece1=this.board[pos1];
							if(piece0!=null && piece1!=null && piece0.s==piece1.s) {
								caught.push(pos0);
								caught.push(pos1);
							}
						}
					}
					if(caught.length==0) 
						moves.push({p:[piece.p,pos]});
					else
						moves.push({p:[piece.p,pos],c:caught});						
				}
			}
		}
	}
	return moves;
}

Model.Board.Evaluate = function(aGame,aFinishOnly,aTopLevel) {
	this.mEvaluation=0;
	
	/*if(aGame.GetRepeatOccurence(this)>2) {
		this.mFinished=true;
		this.mWinner=JocGame.DRAW;
	}
	var evalData=this.HuntMakeEvalData(aGame);

	//JocLog("eval piece count",this.HuntEvaluatePieceCount(aGame,evalData),aGame.g.huntEval.pieceCount);
	this.mEvaluation+=this.HuntEvaluatePieceCount(aGame,evalData)*aGame.g.huntEval.pieceCount;
	if(this.mFinished==false) {
		var genPos=evalData.catcherPieces[0].p;
		if((genPos==25 || genPos==26 || genPos==27) && this.board[1]!=null && this.board[2]!=null && this.board[3]!=null) {
			this.mFinished=true;
			this.mWinner=-aGame.g.catcher;
		} else if(genPos==28) {
			this.mFinished=true;
			this.mWinner=aGame.g.catcher;			
		}
	}
	var freeZone=this.HuntEvaluateFreeZone(aGame,evalData);
	//JocLog("freezone",freeZone,aGame.g.huntEval.freeZone,aGame.g.Graph.length,freeZone,aGame.g.huntEval.freeZone/aGame.g.Graph.length,"=====",freeZone*evalData.catcher*aGame.g.huntEval.freeZone/aGame.g.Graph.length);
	this.mEvaluation+=freeZone*evalData.catcher*aGame.g.huntEval.freeZone/aGame.g.Graph.length;	
	if(freeZone>3) {
		//JocLog("dist to catcher",this.HuntEvaluateDistToCatcher(aGame,evalData),aGame.g.huntEval.dist,"=======",this.HuntEvaluateDistToCatcher(aGame,evalData)*evalData.catcher*aGame.g.huntEval.dist);
		this.mEvaluation+=this.HuntEvaluateDistToCatcher(aGame,evalData)*evalData.catcher*aGame.g.huntEval.dist;
	}

	//JocLog("hunt dist",aGame.HuntDist(evalData.catcherPieces[0].p,28))
	this.mEvaluation+=aGame.HuntDist(evalData.catcherPieces[0].p,28)*evalData.catchee;

	if(isNaN(this.mEvaluation))
		JocLog("NaN eval");*/
	
	//JocLog("eval = ",this.mEvaluation);

	/*
	JocLog("eval piece count",this.HuntEvaluateFreeZone(aGame,evalData),aGame.g.huntEval.freeZone);
	this.mEvaluation+=this.HuntEvaluateFreeZone(aGame,evalData)*aGame.g.huntEval.freeZone;
	JocLog("eval dist to catcher",this.HuntEvaluateDistToCatcher(aGame,evalData)*evalData.catcher,aGame.g.huntEval.distToCatcher);
	this.mEvaluation+=this.HuntEvaluateDistToCatcher(aGame,evalData)*evalData.catcher*aGame.g.huntEval.distToCatcher;
	JocLog("eval hunt dist",aGame.HuntDist(evalData.catcherPieces[0].p,28),evalData.catchee);
	this.mEvaluation+=aGame.HuntDist(evalData.catcherPieces[0].p,28)*evalData.catchee;
	JocLog("eval = ",this.mEvaluation);
	*/
}
