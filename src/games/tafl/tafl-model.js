/*
 * Copyright (c) 2013 - Jocly - www.jocly.com - All rights reserved
 */

(function() {
	
	var SIZE; // the actual board size
	
	// pos to [column,row]
	function Cr(pos) {
		var c=pos%SIZE;
		return [c,(pos-c)/SIZE];
	}
	
	//  column, row to pos
	function Pos(c,r) {
		return r*SIZE+c;
	}
	
	function DistBorder(pos) {
		var cr=Cr(pos);
		return Math.min(cr[0],cr[1],SIZE-cr[0]-1,SIZE-cr[1]-1);
	}
	
	Model.Game.InitGame = function() {
		var $this=this;
		SIZE=this.mOptions.centerDistance*2+1; 
		var directions=[[0,-1],[1,0],[0,1],[-1,0]]; // dx, dy
		this.g.attackersCount=this.mOptions.initial.attackers.length;
		this.g.defendersCount=this.mOptions.initial.defenders.soldiers.length;

		this.g.excludeMap={};
		this.mOptions.exclude.forEach(function(pos) {
			$this.g.excludeMap[pos]=true;
		});
		
		this.g.home=this.mOptions.initial.defenders.king;

		this.g.Graph=[];
		this.g.borders={};
		
		for(var pos=0;pos<SIZE*SIZE;pos++) {
			var graph=[];
			var cr=Cr(pos);
			directions.forEach(function(dir) {
				var x=cr[0]+dir[0];
				if(x<0 || x>=SIZE) {
					graph.push(null);
					$this.g.borders[pos]=true;
				} else {
					var y=cr[1]+dir[1];
					if(y<0 || y>=SIZE) {
						graph.push(null);
						$this.g.borders[pos]=true;
					} else {
						var pos1=Pos(x,y);
						if($this.g.excludeMap[pos1])
							graph.push(null)
						else
							graph.push(pos1);
					}
				}
			});
			this.g.Graph.push(graph);
		}
		
		this.zobrist=new JocGame.Zobrist({
			board: {
				type: "array",
				size: SIZE*SIZE,
				values: ['s1','s-1','k1','k-1'],
			}
		});
	}
	
	Model.Move.Init = function(args) {
		var $this=this;
		this.f=args.f;
		this.t=args.t;
		this.c=[];
		if(args.c)
			for(var ci=0;ci<args.c.length;ci++)
				$this.c.push(args.c[ci]);
	}
	
	Model.Move.CopyFrom=function(move) {
		this.Init(move);
	}
	
	Model.Move.ToString=function() {
		var str=this.f+">"+this.t;
		if(this.c.length>0)
			str+="x"+this.c.join(",");
		return str;
	}
	
	Model.Board.Init = function(aGame) {
		this.zSign=0;
	}
	
	Model.Board.InitialPosition = function(aGame) {
		var $this=this;
		this.board=[];
		this.pieces=[];
		for(var pos=0;pos<SIZE*SIZE;pos++)
			this.board.push(-1);
		function AddPiece(pos,side,type) {
			$this.zSign=aGame.zobrist.update($this.zSign,"board",type+side,pos);
			$this.board[pos]=$this.pieces.length;
			$this.pieces.push({
				i: $this.pieces.length,
				p: pos,
				s: side,
				t: type,
			});
		}
		var attackersSide=aGame.mOptions.attackers;
		AddPiece(aGame.mOptions.initial.defenders.king,-attackersSide,'k');
		var defenders=aGame.mOptions.initial.defenders.soldiers;
		this.defendersCount=0;
		for(var i=0;i<defenders.length;i++) {
			AddPiece(defenders[i],-attackersSide,'s');
			this.defendersCount++;
		}
		this.defendersCount=defenders.length;
		var attackers=aGame.mOptions.initial.attackers;
		this.attackersCount=0;
		for(var i=0;i<attackers.length;i++) {
			AddPiece(attackers[i],attackersSide,'s');
			var cr=Cr(attackers[i]);
			this.attackersCount++;
		}
	}

	Model.Board.CopyFrom = function(aBoard) {
		var $this=this;
		this.board=[];
		var board0=aBoard.board;
		for(var pos=0;pos<board0.length;pos++)
			$this.board.push(board0[pos]);
		this.pieces=[];
		var pieces0=aBoard.pieces;
		for(var pi=0;pi<pieces0.length;pi++) {
			var piece=pieces0[pi];
			$this.pieces.push({
				i: piece.i,
				p: piece.p,
				s: piece.s,
				t: piece.t,
			});
		};
		this.defendersCount=aBoard.defendersCount;
		this.attackersCount=aBoard.attackersCount;
		this.mWho=aBoard.mWho;
		this.zSign=aBoard.zSign;
	}
	
	Model.Board.GenerateMoves = function(aGame) {
		var $this=this;
		var moves=[];
		for(var pi=0;pi<this.pieces.length;pi++) {
			var piece=this.pieces[pi];
			if(piece.s!=$this.mWho || piece.p<0)
				continue;
			for(var dir=0;dir<4;dir++) {
				var pos=aGame.g.Graph[piece.p][dir];
				while(pos!=null) {
					var index1=$this.board[pos];
					if(index1<0 && (pos!=aGame.g.home || !aGame.mOptions.privateHome || piece.t=='k')) {
						var move={
							f: piece.p,
							t: pos,
							c: [],
						}
						for(var dir2=0;dir2<4;dir2++) {
							var pos2=aGame.g.Graph[pos][dir2];
							if(pos2!=null) {
								var index2=$this.board[pos2];
								if(index2>=0) {
									var piece2=$this.pieces[index2];
									if(piece2.s==-piece.s) {
										if(piece2.t=='k') {
											for(var dir3=0;dir3<4;dir3++) {
												var pos3=aGame.g.Graph[pos2][dir3];
												if(pos3==null)
													break;
												var index3=$this.board[pos3];
												if(index3<0) {
													if(pos3!=pos && (pos3!=aGame.g.home || !aGame.mOptions.homeCatch))
														break;
												} else {
													var piece3=$this.pieces[index3];
													if(piece3.s==piece2.s)
														break;
												}
											}
											if(dir3==4)
												move.c.push(pos2);
										} else { // piece2.t=='s'
											var pos3=aGame.g.Graph[pos2][dir2];
											if(pos3!=null) {
												var index3=$this.board[pos3];
												if(pos3==aGame.g.home && aGame.mOptions.homeCatch)
													move.c.push(pos2);
												else if(index3>=0) {
													var piece3=$this.pieces[index3];
													if(piece3.s==piece.s)
														move.c.push(pos2);
												} 
											}
										}
									}
								}
							}
						}
						moves.push(move);
					} else
						break;
					if(!aGame.mOptions.longMove)
						break;
					pos=aGame.g.Graph[pos][dir];
				}
			}
		}
		this.mMoves=moves;
	}
	
	Model.Board.Evaluate = function(aGame) {
		var debug=arguments[3]=="debug";
		this.mEvaluation=0;
		if(this.pieces[0].p<0) {
			this.mFinished=true;
			this.mWinner=aGame.mOptions.attackers;
			return;
		}
		if(this.pieces[0].p in aGame.g.borders) {
			this.mFinished=true;
			this.mWinner=-aGame.mOptions.attackers;
			return;
		}
		if(aGame.GetRepeatOccurence(this)>2) {
			this.mFinished=true;
			this.mWinner=JocGame.DRAW;
			return;
		}
		
		var posKing=this.pieces[0].p;
		var crKing=Cr(posKing);
		var distKing=0
		for(var i=aGame.mOptions.initial.attackers.length+1;i<this.pieces.length;i++) {
			var piece=this.pieces[i];
			if(piece.p>=0) {
				var cr=Cr(piece.p);
				var dist=Math.max(Math.abs(cr[0]-crKing[0]),Math.abs(cr[1]-crKing[1]));
				distKing+=dist;
			}
		}
		
		// metric based on the pathes the king may take to reach borders
		// plus, empty squares area from king
		var pool={},poolDone={};
		pool[posKing]=1;
		var poolCount=1;
		var kingPath=0;
		var kingFreedom=0;
		while(poolCount>0) {
			var nextPool={};
			poolCount=0;
			for(var pos in pool) {
				var posValue=pool[pos];
				var deltaPosValue=posValue/4;
				var graph=aGame.g.Graph[pos];
				for(var dir=0;dir<4;dir++) {
					var pos1=graph[dir];
					while(pos1) {
						if(this.board[pos1]>=0)
							break;
						if(!(pos1 in poolDone) && !(pos1 in pool)) {
							if(pos1 in aGame.g.borders)
								kingPath+=posValue;
							else {
								if(!(pos1 in nextPool)) {
									kingFreedom++;
									poolCount++;
									nextPool[pos1]=deltaPosValue;
								} else
									nextPool[pos1]+=deltaPosValue;
							}
						}
						if(!aGame.mOptions.longMove)
							break;
						pos1=aGame.g.Graph[pos1][dir];
					}
				}
				poolDone[pos]=posValue;
			}
			pool=nextPool;
		}
		
		var evalValues={
			"attackersCount": this.attackersCount,
			"defendersCount": this.defendersCount,
			"kingPath": kingPath,
			"kingFreedom": kingFreedom,
			"distKing": distKing,
		}
		
		var evParams=aGame.mOptions.levelOptions;
		for(var name in evalValues) {
			var value=evalValues[name];
			var factor=evParams[name+'Factor'] || 0;
			var weighted=value*factor;
			if(debug)
				console.log(name,"=",value,"*",factor,"=>",weighted);
			this.mEvaluation+=weighted;
		}
		this.mEvaluation*=aGame.mOptions.attackers;
		if(debug)
			console.log("Evaluation",this.mEvaluation);
	}
	
	Model.Board.ApplyMove = function(aGame,move) {
		//this.taflIntegrity(aGame);
		var $this=this;
		var index=this.board[move.f];
		var piece=this.pieces[index];
		this.zSign=aGame.zobrist.update(this.zSign,"board",piece.t+piece.s,move.f);
		this.zSign=aGame.zobrist.update(this.zSign,"board",piece.t+piece.s,move.t);
		this.board[move.f]=-1;
		this.board[move.t]=index;
		piece.p=move.t;
		if(this.mWho==aGame.mOptions.attackers) {
			var cr0=Cr(move.f);
			var cr=Cr(move.t);
		}
		var capts=move.c;
		for(var ci=0;ci<capts.length;ci++) {
			var pos1=capts[ci];
			var index1=$this.board[pos1];
			var piece1=$this.pieces[index1];
			$this.zSign=aGame.zobrist.update($this.zSign,"board",piece1.t+piece1.s,pos1);
			$this.board[pos1]=-1;
			piece1.p=-1;
			if($this.mWho==-aGame.mOptions.attackers)
				$this.attackersCount--;
			else if(piece1.t=='s')
				$this.defendersCount--;
		}
		//this.taflIntegrity(aGame);
	}
	
	Model.Board.taflIntegrity = function(aGame) {
		var $this=this;
		// debug: check integrity
		var aCount=0;
		var dCount=0;
		this.board.forEach(function(index,pos) {
			if(index>=0) {
				var piece=$this.pieces[index];
				if(piece.p!=pos)
					debugger;
				if(piece.t=='s')
					if(piece.s==aGame.mOptions.attackers)
						aCount++;
					else
						dCount++;
			}
		});
		if(aCount!=this.attackersCount)
			debugger;
		if(dCount!=this.defendersCount)
			debugger;
		this.pieces.forEach(function(piece,index) {
			if(piece.p>=0) {
				if($this.board[piece.p]!=index)
					debugger;
			}
		});		
	}
	
	Model.Board.GetSignature = function() {
		return this.zSign;
	}

})();

