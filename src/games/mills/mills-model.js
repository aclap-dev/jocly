/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

Model.Game.InitGameInfo = function() {
	// overload to set game feature options
}

Model.Game.BuildGraphCoord = function() {
	var g=[];
	var coord=[];
	this.g.Graph=g;
	this.g.Coord=coord;
}

/* Optional method.
 * Called when the game is created.
 */
Model.Game.InitGame = function() {
	this.BuildGraphCoord();
	/*
	 * Access possible triplets from each position
	 */
	this.g.TripletsByPos=[];
	for(var i=0;i<this.g.Coord.length;i++)
		this.g.TripletsByPos[i]=[];
	for(var i in this.g.Triplets) {
		var triplet=this.g.Triplets[i];
		for(var j in triplet) {
			var pos1=triplet[j];
			this.g.TripletsByPos[pos1].push(triplet);
		}
	}
	this.InitGameExtra();
}

/* Optional method.
 * Called when the game is over.
 */
Model.Game.DestroyGame = function() {
}

Model.Game.MillsDirections = 4;

// walk through neighbor positions
Model.Game.MillsEachDirection = function(pos,fnt) {
	for(var i=0;i<this.MillsDirections;i++) {
		var npos=this.g.Graph[pos][i];
		if(npos!=null)
			fnt(npos);
	}
}

/* Constructs an instance of the Move object for the game.
 * args is either an empty object ({}), or contains the data passed to the InitUI parameter.
 */
Model.Move.Init = function(args) {
	this.f=args.f; // from position, -1 if placing
	this.t=args.t; // to position
	this.c=args.c; // opponent catch position, -1 if none, -2 any capture => end of game
}

/* Optional method.
 * Copy the given board data to self.
 * Even if optional, it is better to implement the method for performance reasons. 
 */
Model.Move.CopyFrom = function(aMove) {
	this.f=aMove.f;
	this.t=aMove.t;
	this.c=aMove.c;
}

/* Optional method.
 * Verify move equality. If not defined, comparison is performed from JSON stringification of move objects.
 */
Model.Move.Equals = function(move) {
	return this.t==move.t && this.c==move.c && this.f==move.f;
}

/* Optional method.
 * Returns a string to represent the move for display to human. If not defined JSON is used.
 */
Model.Move.ToString = function() {
	var str="";
	if(this.f>-1)
		str+=this.f+">";
	str+=this.t;
	if(this.c>-1)
		str+="x"+this.c;
	return str;
}

/* Board object constructor.
 */
Model.Board.Init = function(aGame) {
}

Model.Board.InitialPosition = function(aGame) {
	var posCount=aGame.g.Coord.length;    // how many board positions
	var menCount=aGame.mOptions.mencount; // how many men per side
	
	
	this.board=[]; // access pieces by position
	for(var p=0;p<posCount;p++) {
		this.board[p]=-1; // index in this.pieces. -1 => no piece at this position
	}
	
	this.pieces=[];
	this.dock={
		"1": [],
		"-1": [],
	}
	this.menCount={
		"1": 0,
		"-1": 0,			
	}
	var index=0;
	for(var i=0;i<2;i++) {
		var side=(i==0)?1:-1;
		for(var m=0;m<menCount;m++) {
			this.dock[side].unshift(index);
			this.pieces.push({
				s: side,    // which side is that piece: 1=A, -1=B
				a: true,    // piece is active (not yet placed or on the board)
				d: m,   	// dock rank, -1 => piece on the board
				p: -1,       // position on the piece on the board, -1=piece has not yet been placed
				i: index++,  // piece index in Board.pieces
			});			
		}
	}
	
	this.placing=true; // placing stage
}

Model.Board.StaticGenerateMoves = function(aGame) {
	//JocLog("StaticGenerateMoves",aGame);
	if(aGame.mFullPlayedMoves.length==0) { // very first move: pick randomly
		var moves=[];
		for(var i=0;i<aGame.g.Coord.length;i++) {
			moves.push({f:-1,t:i,c:-1});
		}
		return moves;
	}
	return null;
}

/* Push into the mMoves array, every possible move
 */
Model.Board.GenerateMoves = function(aGame) {
	/*
	JocLog("Level",aGame.mCurrentLevel,aGame.mLevelInfo);
	if(aGame.mCurrentLevel>=0) { // computing generation
		if(aGame.mLevelInfo.maxDepth-aGame.mCurrentLevel>=2)
			// only "meaningful" moves
	}
	*/
	this.mMoves = [];
	if(this.placing)
		this.GeneratePlacingMoves(aGame);
	else if(aGame.mOptions.canFly)
		this.GenerateFlyingMoves(aGame);
	else
		this.GenerateMovingMoves(aGame);
	if(this.mMoves.length==0) {
		this.mFinished=true;
		if(this.menCount[JocGame.PLAYER_A]+this.menCount[JocGame.PLAYER_B]==aGame.g.Coord.length)
			this.mWinner=JocGame.DRAW;
		else
			this.mWinner=-this.mWho;
	}
}

Model.Board.GeneratePlacingMoves = function(aGame) {
	for(var p=0;p<aGame.g.Coord.length;p++)
		if(this.board[p]==-1) {
			var considerPos=true;
			if(typeof aGame.mLevelInfo != "undefined" && aGame.mCurrentLevel>=0) { // computing generation
				var vDepth=aGame.mLevelInfo.maxDepth-aGame.mCurrentLevel;
				if(vDepth>=aGame.mLevelInfo.placingRace) { // if deep in calculation, only consider meaningful moves
					considerPos=false;
					for(var i in aGame.g.TripletsByPos[p]) { // for each triplet the position belongs to
						var triplet=aGame.g.TripletsByPos[p][i];
						var self=0, other=0, empty=0; 
						for(var j=0;j<3;j++) {
							if(this.board[triplet[j]]==-1)
								empty++;
							else {
								if(this.pieces[this.board[triplet[j]]].s==this.mWho)
									self++;
								else
									other++;
							}
						}
						if(self==2 || (self==1 && other==0) || other==2) {
							considerPos=true;
							break;
						}
					}
				}
			}
			if(considerPos)
				this.GenerateCapturingMoves(aGame,{
					f: -1,
					t: p,
					c: -1,
				});
		}
}

Model.Board.GenerateMovingMoves = function(aGame) {
	$this=this;
	for(var i in this.pieces) {
		var piece=this.pieces[i];
		if(piece.a && piece.s==this.mWho) {
			aGame.MillsEachDirection(piece.p,function(pos) {
				if($this.board[pos]==-1) {
					$this.GenerateCapturingMoves(aGame,{
						f: piece.p,
						t: pos,
						c: -1,
					});
				}
			});
		}
	}
}

Model.Board.GenerateFlyingMoves = function(aGame) {
	if(this.menCount[this.mWho]!=3)
		this.GenerateMovingMoves(aGame);
	else {
		for(var i in this.pieces) {
			var piece=this.pieces[i];
			if(piece.a && piece.s==this.mWho) {
				for(var pos in this.board) {
					if(this.board[pos]==-1) {
						this.GenerateCapturingMoves(aGame,{
							f: piece.p,
							t: pos,
							c: -1,
						});						
					}
				}
			}
		}
	}
}

Model.Board.GenerateCapturingMoves = function(aGame,move) {
	for(var i in aGame.g.TripletsByPos[move.t]) {
		var triplet=aGame.g.TripletsByPos[move.t][i];
		var capture=true;
		for(var j=0;j<3;j++) {
			var pos=triplet[j];
			if(pos!=move.t) {
				if(this.board[pos]==-1 || move.f==pos) {
					capture=false;
					break;
				}
				var piece=this.pieces[this.board[pos]];
				if(piece.a==false || piece.d>-1 || piece.s!=this.mWho) {
					capture=false;
					break;
				}
			}
		}
		if(capture) {
			if(this.menCount[-this.mWho]==3 && this.placing==false) {
				this.mMoves.push({
					f: move.f,
					t: move.t,
					c: -2,
				});		
				return;
			}
			var moves=[]
			for(var j in this.pieces) {
				var piece=this.pieces[j];
				if(piece.a==true && piece.d==-1 && piece.s==-this.mWho) {
					var cMove={
							f: move.f,
							t: move.t,
							c: piece.p,
					}
					moves.push(cMove);
				}
			}
			if(aGame.mOptions.poundInMill==false) {
				var inMill={};
				for(var k in aGame.g.Triplets) {
					var t=aGame.g.Triplets[k];
					if((this.board[t[0]]!=-1 && this.pieces[this.board[t[0]]].s==-this.mWho) &&
							(this.board[t[1]]!=-1 && this.pieces[this.board[t[1]]].s==-this.mWho) &&
							(this.board[t[2]]!=-1 && this.pieces[this.board[t[2]]].s==-this.mWho)) {
						inMill[t[0]]=true;
						inMill[t[1]]=true;
						inMill[t[2]]=true;
					}
				}
				var moves0=[];
				for(var k in moves) {
					if(!inMill[moves[k].c])
						moves0.push(moves[k]);
				}
				if(moves0.length>0)
					moves=moves0;
			}
			this.mMoves=this.mMoves.concat(moves);
			return;
		}
	}
	// no capture
	this.mMoves.push({
		f: move.f,
		t: move.t,
		c: -1,
	});
}

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
	if(aGame.GetRepeatOccurence(this)>2) {
		this.mFinished=true;
		this.mWinner=JocGame.DRAW;
		return;
	}
	if(this.placing==false) {
		if(this.menCount[JocGame.PLAYER_A]<3) {
			this.mFinished=true;
			this.mWinner=JocGame.PLAYER_B;
			return;
		}
		if(this.menCount[JocGame.PLAYER_B]<3) {
			this.mFinished=true;
			this.mWinner=JocGame.PLAYER_A;
			return;
		}
	}
	var menCountDiff=this.menCount[JocGame.PLAYER_A]-this.menCount[JocGame.PLAYER_B];
	var linesDiff1=0;
	var linesDiff2=0;
	for(var i in aGame.g.Triplets) {
		var count={
			"-1": 0,
			"0": 0,
			"1": 0,
		}
		var triplet=aGame.g.Triplets[i];
		for(var j=0;j<3;j++) {
			var pos=triplet[j];
			var index=this.board[pos];
			if(index>-1) {
				var piece=this.pieces[index];
				count[piece.s]++;
			}
		}
		if(count[1]==1 && count[-1]==0)
			linesDiff1++;
		else if(count[1]==2 && count[-1]==0)
			linesDiff2++;
		if(count[-1]==1 && count[1]==0)
			linesDiff1--;
		else if(count[-1]==2 && count[1]==0)
			linesDiff2--;
	}
	this.mEvaluation=menCountDiff*10;
	this.mEvaluation+=linesDiff1*1;
	this.mEvaluation+=linesDiff2*3;
}

/* Modify the current board instance to apply the move.
 */
Model.Board.ApplyMove = function(aGame,move) {
	if(this.placing) {
		var index=this.dock[this.mWho].shift();
		var piece=this.pieces[index];
		piece.d=-1;
		piece.p=move.t;
		this.board[move.t]=index;
		this.lastMoveIndex=index;
		this.menCount[this.mWho]++;
		if(this.dock[JocGame.PLAYER_B].length==0)
			this.placing=false;
	} else {
		var piece=this.pieces[this.board[move.f]];
		this.board[piece.p]=-1;
		this.board[move.t]=piece.i;
		piece.p=move.t;
		this.lastMoveIndex=piece.i;		
	}
	if(move.c>-1) {
		var index=this.board[move.c];
		this.board[move.c]=-1;
		var piece=this.pieces[index];
		piece.a=false;
		this.menCount[-this.mWho]--;
	} else if(move.c==-2)
		this.menCount[-this.mWho]--;
}
	
Model.Board.IsValidMove = function(aGame,move) {
	return true;
}

	