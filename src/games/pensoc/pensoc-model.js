/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

(function() {

	function Pos2RC(pos) {
		return [Math.floor(pos/8),pos%8];
	}

	var Dist2Goal=[];
	for(var pos=0;pos<64;pos++) {
		var rc=Pos2RC(pos);
		var r=rc[0];
		var c=rc[1];
		Dist2Goal.push(Math.max(r,c));
	}

	var Distance=[];
	for(var pos0=0;pos0<64;pos0++) {
		var line=[];
		Distance.push(line);
		var rc0=Pos2RC(pos0);
		var r0=rc0[0];
		var c0=rc0[1];
		for(var pos1=0;pos1<pos0;pos1++) {
			var rc1=Pos2RC(pos1);
			var r1=rc1[0];
			var c1=rc1[1];
			line.push(Math.max(Math.abs(r0-r1),Math.abs(c0-c1)));
		}
	}
	function PSDist(pos0,pos1) {
		if(pos0==pos1)
			return 0;
		if(pos1>pos0) {
			var tmp=pos1;
			pos1=pos0;
			pos0=tmp;
		}
		return Distance[pos0][pos1];
	}
	
	var DirsRC=[
		[1,1],
		[1,0],
		[1,-1],
		[0,-1],
		[-1,-1],
		[-1,0],
		[-1,1],
		[0,1],
	];
	var Graph=[];
	for(var pos=0;pos<64;pos++) {
		var cell=[];
		var rc=Pos2RC(pos);
		for(var d=0;d<8;d++) {
			var r=rc[0]+DirsRC[d][0];
			var c=rc[1]+DirsRC[d][1];
			if(r<0 || r>=8 || c<0 || c>=8)
				cell.push(null);
			else
				cell.push(r*8+c);
		}
		Graph.push(cell);
	}

	var Reachable=[];
	for(var pos=0;pos<64;pos++) {
		var all={};
		var reach={
			'-1': all,
		};
		Reachable.push(reach);
		for(var d=0;d<8;d++) {
			var dir={};
			reach[d]=dir;
			var pos1=Graph[pos][d];
			for(var i=1;i<4 && pos1!=null;i++) {
				dir[pos1]=i;
				all[pos1]=i;
				pos1=Graph[pos1][d];
			}
		}
	}
	
	Model.Game.InitGame = function() {
		this.g.Graph=Graph;
		this.zobrist=new JocGame.Zobrist({
			board: {
				type: "array",
				size: 65,
				values: ["-1","0","1","2","3","4","5","6"],
			},
			dirs: {
				type: "array",
				size: 9,
				values: ["0","1","2","3","4","5","6"],
			},
		});
	}
	
	Model.Move.Init = function(args) {
		this.i=parseInt(args.i); // piece index: 0=WM,1=WP,2=WB,3=BM,4=BP,5=BB
		this.p=parseInt(args.p); // destination for the penguin or the ball
		this.d=parseInt(args.d); // direction 0 to 7 or -1: the penguin will face after the move, -1 means standing up
		this.md=parseInt(args.md); // direction of the movement, for the penguin or the ball
	}
	
	Model.Move.CopyFrom = function(args) {
		this.Init(args);
	}
	
	Model.Move.ToString = function() {
		var str="";
		str+=this.p;
		str+=['M','P','B','M','P','B'][this.i];
		str+=this.d;
		return str;
	}
	
	Model.Move.Equals = function(move) {
		return this.p==move.p && this.i==move.i && this.d==move.d && this.md==move.md;
	}
	
	Model.Board.Init = function(aGame) {
		this.zSign=0;
	}
	
	Model.Board.InitialPosition = function(aGame) {
		this.board=[];
		for(var i=0;i<64;i++)
			this.board.push(null);
		this.penguins=[];
		for(var who=1;who>-2;who-=2)  
			for(var type=0;type<3;type++) {
				var index=this.penguins.length;
				var penguin={
					p: -1,
					i: index,
					s: who,
					t: type,
					d: -1,
				};
				this.penguins.push(penguin);
				this.zSign=aGame.zobrist.update(this.zSign,"board",index,0);
				this.zSign=aGame.zobrist.update(this.zSign,"dirs",index,0);
			}
		this.ball=-1;
		this.zSign=aGame.zobrist.update(this.zSign,"board",-1,0);
	}
	
	Model.Board.CopyFrom = function(aBoard) {
		this.board=[];
		for(var i=0;i<aBoard.board.length;i++)
			this.board.push(null);
		this.penguins=[];
		for(var i in aBoard.penguins) {
			var penguin0=aBoard.penguins[i];
			var penguin={
				p: penguin0.p,
				s: penguin0.s,
				i: penguin0.i,
				t: penguin0.t,
				d: penguin0.d,
			}
			this.penguins.push(penguin);
			if(penguin.p>-1)
				this.board[penguin.p]=penguin;
		}
		this.ball=aBoard.ball;
		this.mWho=aBoard.mWho;
		this.zSign=aBoard.zSign;
	}
	
	Model.Board.GenerateMoves = function(aGame) {
		this.mMoves=this.PenSocGetAllMoves(aGame);
	}
	
	Model.Board.PenSocGetAllMoves = function(aGame) {
		var moves=[];
		for(var i=0;i<this.penguins.length;i++) {
			var penguin=this.penguins[i];
			if(penguin.s==this.mWho) {
				moves=moves.concat(this.PenSocGetBoardMoves(aGame,penguin));
			}
		}
		return moves;
	}
	
	Model.Board.PenSocGetRotatingMoves=function(aGame,index,pos,dir,dirSteps) {
		var moves=[];
		for(var d=dir-dirSteps;d<=dir+dirSteps;d++) {
			moves.push({
				i:index,
				p: pos,
				d: (d+8)%8,
				md: (dir+8)%8,
			});
		}
		return moves;
	}
	
	Model.Board.PenSocGetBoardMoves = function(aGame,penguin) {
		var moves=[];
		var forbiddenPos=this.mWho==JocGame.PLAYER_A?63:0;
		var dirs;
		if(penguin.d==-1) { // penguin up
			dirs=[0,1,2,3,4,5,6,7];
		} else {
			dirs=[parseInt(penguin.d)];
		}
		var pos0=penguin.p;
		var dist=penguin.t+1;
		var angleSteps=penguin.t+1;
		if(pos0==-1) {
			pos0=this.mWho==JocGame.PLAYER_A?0:63;
			dirs=this.mWho==JocGame.PLAYER_A?[0,1,7]:[4,3,5];
			dist=penguin.t;
			if(this.board[pos0]!=null)
				return moves;
		}
		
		if(penguin.p>-1 && penguin.d>-1) {
			moves.push({
				i: penguin.i,
				p: penguin.p,
				d: -1,
				md: -1,
			})
		}
		
		if(this.ball!=-1 && this.ball==penguin.p) {
			dist=3-penguin.t;
	
			for(var dir=0;dir<8;dir++) {
				var pos=pos0, pos1=pos0;
				var interrupted=false;
				for(var i=0;i<dist;i++) {
					pos=aGame.g.Graph[pos][dir];
					if(pos==null) {
						if(i>0)
							moves.push({
								i: penguin.i,
								p: pos1,
								d: -1,
								md: dir,
							});			
						interrupted=true;
						break;
					}
					if(pos!=null && this.board[pos]!=null) {
						moves.push({
							i: penguin.i,
							p: pos,
							d: -1,
							md: dir,
						});
						interrupted=true;
						break;
					}
					pos1=pos;
				}
				if(!interrupted) {
					moves.push({
						i: penguin.i,
						p: pos1,
						d: -1,
						md: dir,
					});															
				}
			}
	
		} else {
			for(var di=0;di<dirs.length;di++) {
				var dir=dirs[di];
				var pos=pos0, pos1=pos0;
				var sliding=true;
				for(var i=0;i<dist;i++) {
					//JocLog("Penguin",penguin.t,"dir",dir,"Pos",pos,aGame.g.Graph[pos]);
					pos=aGame.g.Graph[pos][dir];
					if(pos==null || this.board[pos]!=null) {
						if(pos!=null && this.ball!=-1 && pos==this.ball) {
							var penguin2=this.board[pos];
							if(penguin2 && penguin2.s==penguin.s) {
								sliding=false;
								break;
							}
							var valid=true;
							var pos2=pos;
							while(pos2) {
								if(pos2==forbiddenPos) {
									valid=false;
									break;
								}
								if(this.board[pos2]==null)
									break;
								pos2=aGame.g.Graph[pos2][dir];
							}
							if(valid) {
								moves.push({
									i: penguin.i,
									p: pos,
									d: penguin.d,
									md: dir,
								});
							}
						} else 	if(i>0 && pos==null) {
							moves.push({
								i: penguin.i,
								p: pos1,
								d: -1,
								md: dir,
							});
						}
							
						sliding=false;
						break;
					}
					if(this.ball==-1 && (pos==27 || pos==28 || pos==35 || pos==36)) {
						moves.push({
							i: penguin.i,
							p: pos,
							d: -1,
							md: dir,
						});
						sliding=false;
						break;
					}
					if(pos!=null && this.ball!=-1 && this.ball==pos) {
						moves.push({
							i: penguin.i,
							p: pos,
							d: -1,
							md: dir,
						});
						sliding=false;
						break;					
					}
						
					pos1=pos;
				}
				if(sliding && pos1!=forbiddenPos) {
					moves=moves.concat(this.PenSocGetRotatingMoves(aGame,penguin.i,pos1,dir,angleSteps));
				}
				if(penguin.p==-1 && penguin.t==0 && di==0)
					break;
			}
		}
		return moves;
	}
	
	/* Optional method.
	 * If not defined, verification is made by checking move is equal to one of the moves generated by GenerateMove
	 */
	Model.Board.IsValidMove = function(aGame,move) {
		// TODO: truly verify move validity to prevent hacked clients in duel
		return true;
	}
	
	Model.Board.Evaluate = function(aGame,aFinishOnly,aTopLevel) {
		var debug=arguments[3]=="debug";
		this.mEvaluation=0;
		if(this.ball==0) {
			this.mFinished=true;
			this.mWinner=JocGame.PLAYER_B;
		} else if(this.ball==63) {
			this.mFinished=true;
			this.mWinner=JocGame.PLAYER_A;
		}
		if(this.mFinished)
			return;
		var distBall=0;
		var ballReachable=0;
		var reachable=0;
		for(var i=0;i<6;i++) {
			var penguin=this.penguins[i];
			var db;
			if(penguin.p>=0) {
				if(this.ball<0)
					db=Math.min(PSDist(penguin.p,27),PSDist(penguin.p,28),PSDist(penguin.p,35),PSDist(penguin.p,36));
				else
					db=PSDist(penguin.p,this.ball);
				var line=Reachable[penguin.p][penguin.d];
				for(var pos in line) {
					var reach=line[pos];
					if(reach<=penguin.t+1) {
						reachable+=penguin.s;
						if(this.ball>=0 && pos==this.ball)
							ballReachable+=penguin.s;
						else if(this.ball<0 && (pos==27 || pos==28 || pos==35 || pos==36))
							ballReachable+=penguin.s;									
					}
				}
			} else
				db=8;
			distBall+=db*penguin.s;
		}
		var distGoal=0;
		var haveBall=0;
		if(this.ball>=0) {
			distGoal=Dist2Goal[this.ball]-Dist2Goal[63-this.ball];
			var penguin0=this.board[this.ball];
			if(penguin0!=null)
				haveBall=penguin0.s;
		}
		var evParams=aGame.mOptions.levelOptions;
		if(debug) {
			console.log("distBall",distBall,"*",evParams.distBallFactor);
			console.log("distGoal",distGoal,"*",evParams.distGoalFactor);
			console.log("haveBall",haveBall,"*",evParams.haveBallFactor);
			console.log("reachable",reachable,"*",evParams.reachableFactor);
			console.log("ballReachable",ballReachable,"*",evParams.ballReachableFactor);
			console.log("distBall details",this.ball,Dist2Goal[this.ball],Dist2Goal[63-this.ball]);
		}
		this.mEvaluation=
			distBall*evParams.distBallFactor+
			distGoal*evParams.distGoalFactor+
			haveBall*evParams.haveBallFactor+
			reachable*evParams.reachableFactor;
	}
	
	Model.Board.ApplyMove = function(aGame,aMove) {
		 var penguin=this.penguins[aMove.i];
		 aMove.d=parseInt(aMove.d);
		 
		 if(this.ball!=-1 && this.ball==penguin.p) {
			 this.zSign=aGame.zobrist.update(this.zSign,"board",-1,this.ball+1);
			 this.ball=aMove.p;
			 this.zSign=aGame.zobrist.update(this.zSign,"board",-1,this.ball+1);
			 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin.i,penguin.d+1);
			 penguin.d=aMove.md;
			 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin.i,penguin.d+1);
			 var penguin1=this.board[aMove.p];
			 if(penguin1!=null) {
				 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin1.i,penguin1.d+1);
				 penguin1.d=-1;
				 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin1.i,penguin1.d+1);
			 }
		 } else {
			 if(penguin.p>-1)
				 this.board[penguin.p]=null;
			 if(aMove.p>-1) {
				 var pos1=aMove.p;
				 var penguin0=penguin;
				 while(pos1!=null) {
					 var penguin1=this.board[pos1];
					 this.board[pos1]=penguin0;
					 this.zSign=aGame.zobrist.update(this.zSign,"board",penguin0.i,penguin0.p+1);
					 penguin0.p=pos1;
					 this.zSign=aGame.zobrist.update(this.zSign,"board",penguin0.i,penguin0.p+1);
					 if(penguin1==null)
						 break;
					 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin1.i,penguin1.d+1);
					 penguin1.d=aMove.md;
					 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin1.i,penguin1.d+1);
					 penguin0=penguin1;
					 pos1=aGame.g.Graph[pos1][aMove.md];
				 }
				 if(pos1==null) {
					 this.zSign=aGame.zobrist.update(this.zSign,"board",penguin0.i,penguin0.p+1);
					 penguin0.p=-1;
					 this.zSign=aGame.zobrist.update(this.zSign,"board",penguin0.i,penguin0.p+1);
					 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin0.i,penguin0.d+1);
					 penguin0.d=-1;
					 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin0.i,penguin0.d+1);
				 }
			 }
			 this.zSign=aGame.zobrist.update(this.zSign,"board",penguin.i,penguin.p+1);
			 penguin.p=aMove.p;
			 this.zSign=aGame.zobrist.update(this.zSign,"board",penguin.i,penguin.p+1);
			 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin.i,penguin.d+1);
			 penguin.d=aMove.d;
			 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin.i,penguin.d+1);
			 if(this.ball==-1 && (aMove.p==27 || aMove.p==28 || aMove.p==35 || aMove.p==36)) { 
				 this.zSign=aGame.zobrist.update(this.zSign,"board",-1,this.ball+1);
				 this.ball=aMove.p;
				 this.zSign=aGame.zobrist.update(this.zSign,"board",-1,this.ball+1);
			 }
			 if(this.ball!=-1 && this.ball==penguin.p) {
				 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin.i,penguin.d+1);
				 penguin.d=-1;
				 this.zSign=aGame.zobrist.update(this.zSign,"dirs",penguin.i,penguin.d+1);
			 }
		 }
	}
	
	Model.Board.GetSignature = function() {
		return this.zSign;
	}	

})();
