/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

Model.Game.InitGame = function() {
	this.HexInitGame();
	this.g.GetStrengthByType=function(type) {
		switch(type) {
		case 'C': return 5;
		case 'c': return 3;
		case 'p': return 2;
		default: return 0;
		}
	}
	this.g.distAmiralToLastRowSubFactor={ "-1": 10, "0":0, "1": -10 };
	this.g.distAmiralToLastRowFactor=3;
	this.g.pieceWeight={
		c: 2,
		p: 1,
		C: 0,
		r: 0,
	}
	this.g.weightFactor=3;
	this.g.GainOtherAmiralDist=[0,15,4,2,1,0.7,0.6,0.5,0.4,0.3,0.2,0.1,0];
	this.g.GainSelfAmiralDist=[0,5,4,2,1,0.7,0.6,0.5,0.4,0.3,0.2,0.1,0];
	this.g.gainOtherAmiralDistSubFactor=1;
	this.g.gainSelfAmiralDistSubFactor=1;
	this.g.yohohoFactor=2;
	this.g.MoveCount=22;
	
	var $this=this;
	this.g.Dist=function(pos1,pos2) {
		if(pos1==pos2)
			return 0;
		if(pos2<pos1) {
			var tmp=pos1;
			pos1=pos2;
			pos2=tmp;
		}
		return $this.g.DistArray[pos1][pos2-pos1-1];
	}
	
	var NBCELLS=this.g.Graph.length;
	
	this.g.DistArray=[];
	for(var i=0;i<NBCELLS-1;i++) {
		var line=[];
		for(var j=0;j<NBCELLS-i;j++)
			line.push(-1);
		this.g.DistArray.push(line);	
	}
	this.g.SetDist=function(pos1,pos2,dist) {
		if(pos1==pos2)
			return;
		if(pos2<pos1) {
			var tmp=pos1;
			pos1=pos2;
			pos2=tmp;
		}
		$this.g.DistArray[pos1][pos2-pos1-1]=dist;
	}
	for(var pos=0;pos<NBCELLS;pos++) {
		this.YohohoEachDirection(pos,function(pos1) {
			if(pos<pos1) {
				var dist=$this.g.Dist(pos,pos1);
				if(dist<0)
					$this.g.SetDist(pos,pos1,1);
			}
			return true;
		});
	}
	for(var pos=0;pos<NBCELLS;pos++) {
		this.YohohoEachDirection(pos,function(pos1) {
			if(pos<pos1) {
				for(var pos2=0;pos2<NBCELLS;pos2++) {
				var dist2=$this.g.Dist(pos2,pos);
					if(dist2>=0) {
					var dist3=$this.g.Dist(pos2,pos1);
						if(dist3==-1 || dist2+1<dist3)
							$this.g.SetDist(pos2,pos1,dist2+1);
					}
				}
			}
		return true;
		});
	}
}

/* Constructs an instance of the Move object for the game.
 * args is either an empty object ({}), or contains the data passed to the InitUI parameter.
 */
Model.Move.Init = function(args) {
	if(typeof(args)!="undefined")
		this.CopyFrom(args);
}

/* Optional method.
 * Copy the given board data to self.
 * Even if optional, it is better to implement the method for performance reasons. 
 */
Model.Move.CopyFrom = function(args) {
	this.t=args.t; // move type: 'm' move 2 pieces or 'a': attack
	if(args.t=='m') {
		this.m=[{
			f: args.m[0].f, // first sub-move from
			t: args.m[0].t, // first sub-move to
		},{
			f: args.m[1].f, // second sub-move from
			t: args.m[1].t, // second sub-move to
		}]
	} else if(args.t=='a') {
		this.af=[];
		for(var i=0; i<args.af.length; i++)
			this.af.push(args.af[i]);
		this.at=args.at;
	}
}


/* Optional method.
 * Returns a string to represent the move for display to human. If not defined JSON is used.
 */
Model.Move.ToString = function() {
	var str;
	if(this.t=='m') {
		str="M "+this.m[0].f+">"+this.m[0].t;
		if(typeof this.m[1].f!="undefined")
			str+=" "+this.m[1].f+">"+this.m[1].t;
	} else {
		str="A "+this.af.join(",")+">"+this.at;
	}
	return str;
}

Model.Board.InitialPosition = function(aGame) {	
	this.HexInit(aGame);
	this.first=true;
	this.yohoho=false;
	this.amirals={};
	for(var i=0; i<this.pieces.length; i++) {
		var piece=this.pieces[i];
		if(piece.type=='C')
			this.amirals[piece.s]=i;
		if(piece.s==JocGame.PLAYER_A)
			piece.angle=0;
		else
			piece.angle=180;
	}
	this.piecesWeight={ "-1": 8, "1": 8, };
}

/* Push into the mMoves array, every moves that must be explored from this position. 
 * All possible moves may not be considered, for instance if a game has many possible 
 * different moves for a given board (like the game of GO). However, if not all possible 
 * moves are pushed, method IsValidMove must be implemented to validate human input moves.
 */
Model.Board.GenerateMoves = function(aGame) {
	//JocLog("mLevelInfo",aGame.mLevelInfo);
	var lastRowRace=false;
	var moveCount=aGame.g.MoveCount;
	if(typeof aGame.mLevelInfo!="undefined") {
		if(typeof(aGame.mLevelInfo.rowRaceLevel)!="undefined")
			lastRowRace=(aGame.mCurrentLevel>=0 && aGame.mCurrentLevel<=aGame.mLevelInfo.rowRaceLevel);
		if(typeof(aGame.mLevelInfo.moveCount)!="undefined")
			moveCount=aGame.mLevelInfo.moveCount;
	}
	//JocLog("GenerateMoves",aGame.mCurrentLevel,"/",aGame.mTopLevel,"lastRowRace",lastRowRace,typeof lastRowRace);
	var $this=this;
	var selfAmiralPos=this.pieces[this.amirals[this.mWho]].pos;
	var otherAmiralPos=this.pieces[this.amirals[-this.mWho]].pos;
	var otherAmiralRow=aGame.g.Coord[otherAmiralPos][0];
	var otherAmiralNextRow=otherAmiralRow-this.mWho;
	
	//JocLog("Position amiral self",selfAmiralPos,"other",otherAmiralPos);

	var subMovesMap={};
	var subMoves=[];
	
	var subMovesLastRow=[];

	var pieces=this.pieces;
	if(lastRowRace)
		pieces=[this.pieces[this.amirals[this.mWho]]];
	
	for(var i=0;i<pieces.length;i++) {
		var piece=pieces[i];
		
		if(piece.s==this.mWho && piece.alive) {
			var poss=this.YohohoReachablePositionsThrough(aGame,piece.pos,piece.type);
			//JocLog("Poss",piece.pos,poss);
			for(var j=0; j<poss.length; j++) {
				var subMove={ f: piece.pos, t: poss[j].pos, index:i, reqEmpty: poss[j].reqEmpty };
				//subMove.d2Self=aGame.g.Dist(piece.pos,selfAmiralPos);
				//subMove.d2Other=aGame.g.Dist(piece.pos,otherAmiralPos);
				var eval=0;
				if(piece.type=='C') {
					var coord=aGame.g.Coord[piece.pos];
					var frow=coord[0];
					var fdistToLastRow=(this.mWho==JocGame.PLAYER_A?8-frow:frow);
					coord=aGame.g.Coord[subMove.t];
					var trow=coord[0];
					var tdistToLastRow=(this.mWho==JocGame.PLAYER_A?8-trow:trow);
					if(tdistToLastRow==0 && this.board[subMove.t]==-1)
						subMovesLastRow.push(subMove);
					eval+=12;
					eval+=aGame.g.distAmiralToLastRowSubFactor[tdistToLastRow-fdistToLastRow];
				} else if(piece.type=='c') {
					eval+=1;
				}
					
				/*
				var distSelfAmiral0=aGame.g.Dist(subMove.f,selfAmiralPos);
				var distSelfAmiral1=aGame.g.Dist(subMove.t,selfAmiralPos);
				var distOtherAmiral0=aGame.g.Dist(subMove.f,otherAmiralPos);
				var distOtherAmiral1=aGame.g.Dist(subMove.t,otherAmiralPos);
				
				var gainSelfAmiralDist=aGame.g.GainSelfAmiralDist[distSelfAmiral1]-aGame.g.GainSelfAmiralDist[distSelfAmiral0];
				var gainOtherAmiralDist=aGame.g.GainOtherAmiralDist[distOtherAmiral1]-aGame.g.GainOtherAmiralDist[distOtherAmiral0];
				*/
				var distSelfAmiral1=aGame.g.Dist(subMove.t,selfAmiralPos);
				var distOtherAmiral1=aGame.g.Dist(subMove.t,otherAmiralPos);
				var gainSelfAmiralDist=aGame.g.GainSelfAmiralDist[distSelfAmiral1];
				var gainOtherAmiralDist=aGame.g.GainOtherAmiralDist[distOtherAmiral1];
				
				if(distOtherAmiral1==2 && (piece.type=='c' || piece.type=='p')) {
					aGame.YohohoEachDirection(subMove.t,function(pos) {
						if($this.board[pos]==-1 && aGame.g.Dist(pos,otherAmiralPos)==1 && aGame.g.Dist(pos,selfAmiralPos)==1 && aGame.g.Coord[pos][0]==otherAmiralNextRow ) {
							eval+=3;
							return false;
						}
						return true;
					});
				}
				
				var gainAmiralDist=Math.max(gainSelfAmiralDist*aGame.g.gainSelfAmiralDistSubFactor,gainOtherAmiralDist*aGame.g.gainOtherAmiralDistSubFactor);
				
				eval+=gainAmiralDist;
				
				subMove.eval=eval;
				
				if(typeof subMovesMap[subMove.index]=="undefined")
					subMovesMap[subMove.index]=[];
				subMovesMap[subMove.index].push(subMove);
			}
		}
	}
	
	if(subMovesLastRow.length>0) {
		for(var i=0; i<subMovesLastRow.length; i++) {
			var subMove=subMovesLastRow[i];
			this.mMoves.push({ t: 'm', m: [{f:subMove.f, t:subMove.t }, { }] });
		}
		return;
	}
	
	var subMovesPool=[];
	for(var index in subMovesMap)
		if(subMovesMap.hasOwnProperty(index)) {
			var subMovesByPiece=subMovesMap[index];
			subMovesByPiece.sort(function(a,b) {
				return b.eval-a.eval;
			});
			subMovesPool.push(subMovesByPiece);
		}
	subMovesPool.sort(function(a,b) {
		return b[0].eval-a[0].eval;
	});
	//JocLog("subMovesPool",subMovesPool);

	var i1=1;
	var i2=0;
	while(subMovesPool.length>0) {
		subMoves.push(subMovesPool[i2].shift());
		if(subMovesPool[i2].length==0) {
			subMovesPool.splice(i2,1);
			i1--;
		} else
			i2++;
		if(i2==i1) {
			if(i1<subMovesPool.length)
				i1++;
			i2=0;
		}
	}
	//JocLog("GenerateMoves subMoves",subMoves);

	if(lastRowRace) {
		//JocLog("lastRowRace",subMoves);
		var keptSubMoves=[];
		var bestRowGain=-1;
		for(var i=0; i<subMoves.length; i++) {
			var subMove=subMoves[i];
			var rowGain=(aGame.g.Coord[subMove.t][0]-aGame.g.Coord[subMove.t][0])*this.mWho;
			if(rowGain==bestRowGain)
				keptSubMoves.push(subMove);
			else if(rowGain>bestRowGain) {
				bestRowGain=rowGain;
				keptSubMoves=[subMove];
			}
		}
		this.mMoves=this.YohohoCaptures(aGame,this.mWho);
		for(var i=0; i<keptSubMoves.length; i++) {
			var subMove=keptSubMoves[i];
			if(this.board[subMove.t]==-1)
				this.mMoves.push({t:'m',m:[{ f: subMove.f, t: subMove.t },{}]})
		}
		
		//JocLog("GenerateMoves moves",moves);	
		if(this.mMoves.length==0) {
			this.mFinished=true;
			this.mWinner=JocGame.DRAW;
		}
		return;
	}
	
	function CompatibleSubMoves(sm1,sm2) {
		if(sm1.index==sm2.index)
			return false;
		//if(sm1.f==sm2.f)
		//	JocLog("%",sm1,sm2);
		for(var i=0; i<sm1.reqEmpty.length; i++) {
			var emptyPos=sm1.reqEmpty[i];
			if($this.board[emptyPos]!=-1)
				return false;
		}
		for(var i=0; i<sm2.reqEmpty.length; i++) {
			var emptyPos=sm2.reqEmpty[i];
			if(emptyPos==sm1.t)
				return false;
			if($this.board[emptyPos]!=-1 && emptyPos!=sm1.f)
				return false;
		}
		if(sm1.t==sm2.t)
			return false;
		return true;
	}
	
	var moves=[];

	var amiralCapture=this.YohohoAmiralCapture(aGame,this.mWho);
	//JocLog("Amiral capture",amiralCapture);
	if(amiralCapture.risk) {
		for(var i=0; i<amiralCapture.capture.length; i++) {
			var capture=amiralCapture.capture[i];
			var af=JSON.parse(JSON.stringify(capture.af));
			this.mMoves.push({ t:'a', af:af, at:capture.at });
		}
		for(var j=0;j<subMoves.length && moves.length<moveCount;j++) 
			for(var i=0;i<amiralCapture.escape.length && moves.length<moveCount;i++) {
				var amiralIndex=this.amirals[this.mWho];
				var amiralPiece=this.pieces[amiralIndex];
				var escapeSubmove={ f: amiralPiece.pos, t: amiralCapture.escape[i].t, index: amiralIndex, reqEmpty: [amiralCapture.escape[i].t] }; 
				if(subMoves[j].index!=amiralIndex) {
					var valid=CompatibleSubMoves(escapeSubmove,subMoves[j]);
					if(valid)
						moves.push({ t: 'm', m: [{f: escapeSubmove.f, t: escapeSubmove.t },{f:subMoves[j].f, t:subMoves[j].t }] });
					else if(CompatibleSubMoves(subMoves[j],escapeSubmove))
						moves.push({ t: 'm', m: [{f:subMoves[j].f, t:subMoves[j].t },{f: escapeSubmove.f, t: escapeSubmove.t }] });
				}
			}
		this.mMoves=this.mMoves.concat(moves);
		//JocLog("GenerateMoves moves",moves);	
		if(this.mMoves.length==0) {
			this.mFinished=true;
			this.mWinner=-this.mWho;
		}
		return;
	}
	
	if(this.first) {
		for(var j=0;j<i && moves.length<moveCount;j++)
			if(this.board[subMoves[j].t]==-1)
				moves.push({ t: 'm', m: [{f:subMoves[j].f, t:subMoves[j].t }, { }] });
	} else {
		for(var i=1;i<subMoves.length && moves.length<moveCount;i++)
			for(var j=0;j<i && moves.length<moveCount;j++) {
				if(subMoves[i].index!=subMoves[j].index)
					if(CompatibleSubMoves(subMoves[i],subMoves[j]))
						moves.push({ t: 'm', m: [{ f:subMoves[i].f, t:subMoves[i].t },{ f:subMoves[j].f, t:subMoves[j].t }] });
					else if(CompatibleSubMoves(subMoves[j],subMoves[i]))
						moves.push({ t: 'm', m: [{ f:subMoves[j].f, t:subMoves[j].t },{ f:subMoves[i].f, t:subMoves[i].t }] });
			}
	}
	
	this.mMoves=this.YohohoCaptures(aGame,this.mWho);
	
	this.mMoves=this.mMoves.concat(moves);
	//JocLog("GenerateMoves moves",moves);	
	if(this.mMoves.length==0) {
		this.mFinished=true;
		this.mWinner=-this.mWho;
	}
}

/* Optional method.
 * If not defined, verification is made by checking move is equal to one of the moves generated by GenerateMove
 */
Model.Board.IsValidMove = function(aGame,move) {
	// TODO: truly verify move validity to prevent hacked clients in duel
	return true;
}


/* Optional method.
 * Using it will decrease the number of explored boards but each explored board will take longer.
 * In the case of TicTacToe, the overall duration will be bigger if QuickEvaluate is used.
 */
/*Model.Board.QuickEvaluate = function(aGame) {
	return 0; // good to have board center
}*/

/* The Evaluate method must:
 * - detects whether the game is finished by setting mFinished to true, and determine the winner by assigning
 * mWinner (to JocGame.PLAYER_A, JocGame.PLAYER_B, JocGame.DRAW).
 * - calculate mEvaluation to indicate apparent advantage to PLAYER_A (higher positive evaluation) or to
 * PLAYER_B (lower negative evaluation)
 * Parameters:
 * - aFinishOnly: it is safe to ignore this parameter value, but for better performance, the mEvaluation setting
 * can be skipped if aFinishOnly is true (function caller is only interested if the game is finished).
 * - aTopLevel: it is safe to ignore this parameter value. For convenience, if true, there is no performance involved 
 * so it is safe to make additional calculation and storing data, for instance to simplify the display of the last move.
 */
Model.Board.Evaluate = function(aGame,aFinishOnly,aTopLevel) {
	this.mEvaluation=0;
	var amiralCaptureA=this.YohohoAmiralCapture(aGame,JocGame.PLAYER_A);
	if(amiralCaptureA.risk && amiralCaptureA.end) {
		this.mFinished=true;
		this.mWinner=JocGame.PLAYER_B;
	}
	var amiralCaptureB=this.YohohoAmiralCapture(aGame,JocGame.PLAYER_B);
	if(amiralCaptureB.risk && amiralCaptureB.end) {
		this.mFinished=true;
		this.mWinner=JocGame.PLAYER_A;
	}

	var aAmiralPos=this.pieces[this.amirals[JocGame.PLAYER_A]].pos;
	var bAmiralPos=this.pieces[this.amirals[JocGame.PLAYER_B]].pos;
	
	var arow=aGame.g.Coord[aAmiralPos][0];
	if(arow==8) {
		this.mFinished=true;
		this.mWinner=JocGame.PLAYER_A;
	}
	var brow=aGame.g.Coord[bAmiralPos][0];
	if(brow==0) {
		this.mFinished=true;
		this.mWinner=JocGame.PLAYER_B;
	}
	if(this.mFinished)
		return;
	
	//JocLog("amiral brow",this.pieces[this.amirals[JocGame.PLAYER_B]].pos,brow);
	var distAmiralToLastRowFactor=aGame.g.distAmiralToLastRowFactor;
	switch(aGame.g.Dist(aAmiralPos,bAmiralPos)) {
	case 1: distAmiralToLastRowFactor=aGame.g.distAmiralToLastRowFactor; break;
	case 2: distAmiralToLastRowFactor=1.2*aGame.g.distAmiralToLastRowFactor; break;
	default: distAmiralToLastRowFactor=2*aGame.g.distAmiralToLastRowFactor;
	}
	this.mEvaluation+=(arow-8+brow)*distAmiralToLastRowFactor;
	
	this.mEvaluation+=(this.piecesWeight[JocGame.PLAYER_A]-this.piecesWeight[JocGame.PLAYER_B])*aGame.g.weightFactor;
	var adist=0, bdist=0;

	for(var i=0; i<this.pieces.length; i++) {
		var piece=this.pieces[i];
		if(piece.alive) {
			var minDist=Math.min(aGame.g.Dist(piece.pos,aAmiralPos),aGame.g.Dist(piece.pos,bAmiralPos));
			if(piece.s==JocGame.PLAYER_A)
				adist+=minDist;
			else
				bdist+=minDist;
		}
	}
	this.mEvaluation+=(bdist-adist)*0.001;
	this.mEvaluation+=(amiralCaptureA?-aGame.g.yohohoFactor:0)+(amiralCaptureB?aGame.g.yohohoFactor:0);

	//if(aGame.g.Dist(this.pieces[this.amirals[1]].pos,this.pieces[this.amirals[-1]].pos)==0)
	//	this.mEvaluation+=10*this.mWho;
	
	//JocLog("Evaluation",this.mEvaluation,"arow",arow,"brow",brow);
}

/* Optional method.
 * Copy the given board data to self.
 * Even if optional, it is better to implement the method for performance reasons. 
 */
/*
Model.Board.CopyFrom = function(aBoard) {
	for(var i=0;i<3;i++) {
		for(var j=0;j<3;j++) {
			this.board[i][j]=aBoard.board[i][j];
		}
	}
}
*/

Model.Board.yohohoUpdateAngle = function(aGame,piece,pos0,pos) {
	var angle=0;
	if(pos===undefined || pos0===undefined)
		angle=0;
	else { 
		var coord0=aGame.g.Coord[pos0];
		var coord=aGame.g.Coord[pos];
		if(coord[1]>coord0[1])
			if(coord[0]>coord0[0])
				angle=-30;
			else if(coord[0]<coord0[0])
				angle=-150;
			else
				angle=-90;  // ok
		else if(coord[0]>coord0[0])
			angle=30;
		else if(coord[0]<coord0[0])
			angle=150;
		else
			angle=90;
	}
	piece.angle=angle;
}

/* Modify the current board instance to apply the move.
 */
Model.Board.ApplyMove = function(aGame,move) {
	if(move.t=='m') {
		var index=this.board[move.m[0].f];
		var side=this.pieces[index].s;
		this.board[move.m[0].f]=-1;
		this.board[move.m[0].t]=index;
		this.pieces[index].pos=move.m[0].t;
		this.yohohoUpdateAngle(aGame,this.pieces[index],move.m[0].f,move.m[0].t);
		if(this.first==false && typeof move.m[1].f!="undefined") {
			index=this.board[move.m[1].f];
			if(index<0)
				JocLog("!!!! move from nowhere",move);
			this.board[move.m[1].f]=-1;
			this.board[move.m[1].t]=index;
			this.pieces[index].pos=move.m[1].t;
			this.yohohoUpdateAngle(aGame,this.pieces[index],move.m[1].f,move.m[1].t);
		}
		var amiralCapture=this.YohohoAmiralCapture(aGame,-side);
		this.yohoho=amiralCapture.risk;
	} else if(move.t=='a') {
		var index=this.board[move.at];
		this.board[move.at]=-1;
		this.pieces[index].alive=0;
		this.piecesWeight[-this.mWho]-=aGame.g.pieceWeight[this.pieces[index].type];
	}
	this.first=false;
}

Model.Board.YohohoReachablePositions=function(aGame,pos,type,accept,reject) {
	var $this=this;
	var poss=[];
	var range=0;
	var side=this.pieces[this.board[pos]].s;
	var eachDirection="YohohoEachDirectionWind";
	switch(type) {
	case 'C': range=1; break;
	case 'c': range=2; break;
	case 'p': range=3; break;
	case 'r': eachDirection="YohohoEachDirection"; break;
	}
	aGame[eachDirection](pos,function(pos1,dir) {
		var dist=0;
		while(pos1!=null && (range==0 || dist<range) && 
				(pos1==accept || ($this.board[pos1]==-1 && pos1!=reject))
			) {
			var valid=true;
			if(type=='C') {
				var strength=0;
				aGame.YohohoEachDirection(pos1,function(pos2) {
					var index=$this.board[pos2];
					if(index>=0 && $this.pieces[index].alive && $this.pieces[index].s==-side) {
						var strength0=aGame.g.GetStrengthByType($this.pieces[index].type);
						strength+=strength0;
					}
					return true;
				});
				if(strength>5)
					valid=false;
			}
			if(valid)
				poss.push(pos1);
			pos1=aGame.g.Graph[pos1][dir];
			dist++;
		}
		return true;
	});
	return poss;
}

Model.Board.YohohoReachablePositionsThrough=function(aGame,pos,type) {
	var $this=this;
	var poss=[];
	var range=0;
	var side=this.pieces[this.board[pos]].s;
	var eachDirection="YohohoEachDirectionWind";
	switch(type) {
	case 'C': range=1; break;
	case 'c': range=2; break;
	case 'p': range=3; break;
	case 'r': eachDirection="YohohoEachDirection"; break;
	}
	aGame[eachDirection](pos,function(pos1,dir) {
		var dist=0;
		var reqEmpty=[];
		while(pos1!=null && (range==0 || dist<range) && ($this.board[pos1]==-1 || $this.pieces[$this.board[pos1]].s==side)) {
			var valid=true;
			if(type=='C') {
				var strength=0;
				aGame.YohohoEachDirection(pos1,function(pos2) {
					var index=$this.board[pos2];
					if(index>=0 && $this.pieces[index].alive && $this.pieces[index].s==-side) {
						var strength0=aGame.g.GetStrengthByType($this.pieces[index].type);
						strength+=strength0;
					}
					return true;
				});
				if(strength>5)
					valid=false;
			}
			reqEmpty.push(pos1);
			if(valid) {
				var reqEmpty0=[];
				for(var i=0; i<reqEmpty.length; i++)
					reqEmpty0.push(reqEmpty[i]);
				poss.push({ pos: pos1, reqEmpty: reqEmpty0 });
			}
			pos1=aGame.g.Graph[pos1][dir];
			dist++;
		}
		return true;
	});
	return poss;
}


Model.Game.YohohoEachDirection = function(pos,fnt) {
	for(var i=0;i<6;i++) {
		var npos=this.g.Graph[pos][i];
		if(npos!=null)
			if(fnt(npos,i)==false)
				return;
	}
}

Model.Game.YohohoEachDirectionWind = function(pos,fnt) {
	for(var i=1;i<6;i++) {
		var npos=this.g.Graph[pos][i];
		if(npos!=null)
			if(fnt(npos,i)==false)
				return;
	}
}

Model.Board.YohohoAmiralCapture=function(aGame,who) {
	var $this=this;
	var capture={ risk: false };
	
	// check whether the amiral is in capture
	
	var amiralPos=this.pieces[this.amirals[who]].pos;
	var strength=0;
	var attackers=[];
	aGame.YohohoEachDirection(amiralPos,function(pos1) {
		var index=$this.board[pos1];
		if(index>=0 && $this.pieces[index].alive && $this.pieces[index].s==-who) {
			var strength0=aGame.g.GetStrengthByType($this.pieces[index].type);
			if(strength0>0)
				attackers.push(index);
			strength+=strength0;
		}
		return true;
	});
	//JocLog("YohohoAmiralDanger", strength>5);
	if(strength<=5)
		return capture;
	
	// check saving amiral by capturing ennemy
	
	capture.risk=true;
	
	capture.attackers=attackers;
	capture.capture=[];
	for(var i=0; i<attackers.length; i++) {
		var index=attackers[i];
		var attackerStrength=aGame.g.GetStrengthByType(this.pieces[index].type);
		if(strength-attackerStrength<=5) {
			var strength1=0;
			var attackers1=[];
			aGame.YohohoEachDirection(this.pieces[index].pos,function(pos1) {
				var index0=$this.board[pos1];
				if(index0>=0 && $this.pieces[index0].alive && $this.pieces[index0].s==who) {
					var strength0=aGame.g.GetStrengthByType($this.pieces[index0].type);
					if(strength0>0)
						attackers1.push($this.pieces[index0].pos);
					strength1+=strength0;
				}
				return true;
			});
			if(strength1>attackerStrength)
				capture.capture.push({ af: attackers1, at: this.pieces[index].pos });
		}
	}
	
	// check saving amiral by moving the piece
	
	capture.escape=[];
	aGame.YohohoEachDirectionWind(amiralPos,function(pos1) {
		var index=$this.board[pos1];
		if(index==-1) {
			var strength1=0;
			aGame.YohohoEachDirection(pos1,function(pos2) {
				var index1=$this.board[pos2];
				if(index1>=0 && $this.pieces[index1].alive && $this.pieces[index1].s==-who) {
					var strength0=aGame.g.GetStrengthByType($this.pieces[index1].type);
					strength1+=strength0;
				}
			});
			if(strength1<=5)
				capture.escape.push({ f: amiralPos, t: pos1 });
		}
		return true;
	});
	
	capture.end = capture.escape.length==0 && capture.capture.length==0;

	return capture;
}

Model.Board.YohohoCaptures=function(aGame,who) {
	var $this=this;
	var captures=[];
	for(var i=0; i<$this.pieces.length; i++) {
		var piece=$this.pieces[i];
		if(piece.s==-who && piece.alive) {
			var attackeeStrength=aGame.g.GetStrengthByType(piece.type);
			var attackers=[];
			if(attackeeStrength>0) { // not a rock
				var strength1=0;
				aGame.YohohoEachDirection(piece.pos,function(pos) {
					var index=$this.board[pos];
					if(index>=0 && $this.pieces[index].alive && $this.pieces[index].s==who) {
						var strength0=aGame.g.GetStrengthByType($this.pieces[index].type);
						if(strength0>0)
							attackers.push(pos);
						strength1+=strength0;
					}
					return true;
				});
				if(strength1>attackeeStrength)
					captures.push({ t: 'a', af: attackers, at: piece.pos });
			}
		}
	}
	return captures;
}
