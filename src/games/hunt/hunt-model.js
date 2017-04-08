/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

Model.Game.HuntInitGame = function() {
	this.g.huntOptions={
		compulsoryCatch: false,
		catchLongestLine: false,
		multipleCatch: true,
	}
	this.g.huntEval={
		pieceCount: 1000000,
		freeZone: 100,
		dist: 1000,
	}
	this.g.RC=[];
	this.g.Graph=[];
	this.g.useDrop=false;
	this.g.evaluate0=0;
	this.g.debugEval=false;
}

Model.Game.HuntPostInitGame = function() {
	this.HuntMakeDist();
	this.zobrist=new JocGame.Zobrist({
		board: {
			type: "array",
			size: this.g.Graph.length,
			values: ["1","-1"],
		},
		who: {
			values: ["1","-1"],			
		}
	});

}

Model.Game.HuntMakeGrid = function(options) {
	var opts={
		rows: 5,
		cols: 5,
		row0: 0,
		col0: 0,
		dirs: 4,
	}
	Object.assign(opts,options);
	
	var posByRC={};
	
	var base=this.g.RC.length;
	for(var r=0;r<opts.rows;r++)
		for(var c=0;c<opts.cols;c++) {
			var pos=base+r*opts.cols+c;
			this.g.RC[pos]=[r+opts.row0,c+opts.col0];
			posByRC[""+r+","+c]=pos;
		}
	for(var pos=0;pos<this.g.RC.length;pos++) {
		var r=this.g.RC[pos][0];
		var c=this.g.RC[pos][1];
		var graph=[];
		var pos1=posByRC[""+(r-1)+","+c];
		if(typeof pos1 != "undefined")
			graph.push(pos1);
		else
			graph.push(null);
		pos1=posByRC[""+(r+1)+","+c];
		if(typeof pos1 != "undefined")
			graph.push(pos1);
		else
			graph.push(null);
		pos1=posByRC[""+r+","+(c-1)];
		if(typeof pos1 != "undefined")
			graph.push(pos1);
		else
			graph.push(null);
		pos1=posByRC[""+r+","+(c+1)];
		if(typeof pos1 != "undefined")
			graph.push(pos1);
		else
			graph.push(null);
		for(var i=graph.length;i<opts.dirs;i++)
			graph.push(null);
		this.g.Graph.push(graph);
	}
}

Model.Game.HuntMakeDist=function() {
	var $this=this;
	this.g.Dist=[];
	this.g.DistMax=0;
	function SetDist(a,b,c) {
		$this.g.Dist[a][b]=c;
		if(c>$this.g.DistMax)
			$this.g.DistMax=c;
	}
	for(var i=0;i<this.g.Graph.length;i++) {
		var distLine=[]
		for(var j=0;j<=i;j++) {
			distLine.push(-1);
		}
		this.g.Dist.push(distLine);
	}
	for(var pos=0;pos<this.g.Graph.length;pos++) {
		var graph=this.g.Graph[pos];
		for(var d=0;d<graph.length;d++) {
			var pos1=graph[d];
			if(pos1!=null) {
				if(pos1<pos && this.g.Dist[pos-1][pos1]==-1) {
					SetDist(pos-1,pos1,1);
				} else if(pos1>pos && this.g.Dist[pos1-1][pos]==-1) {
					SetDist(pos1-1,pos,1);
				}
			}
		}
	}
	var updated=true;
	for(var loop=1;updated;loop++) {
		updated=false;
		for(var pos=1;pos<this.g.Graph.length;pos++) {
			for(var pos1=0;pos1<pos;pos1++) {
				if(this.g.Dist[pos-1][pos1]==loop) {
					var graph=this.g.Graph[pos1];
					for(var d=0;d<graph.length;d++) {
						var pos2=graph[d];
						if(pos2!=null) {
							if(pos2<pos && this.g.Dist[pos-1][pos2]==-1) {
								SetDist(pos-1,pos2,loop+1);
								updated=true;
							} else if(pos2>pos && this.g.Dist[pos2-1][pos]==-1) {
								SetDist(pos2-1,pos,loop+1);
								updated=true;
							}
						}
					}
					graph=this.g.Graph[pos];
					for(var d=0;d<graph.length;d++) {
						var pos2=graph[d];
						if(pos2!=null) {
							if(pos2<pos1 && this.g.Dist[pos1-1][pos2]==-1) {
								SetDist(pos1-1,pos2,loop+1);
								updated=true;
							} else if(pos2>pos1 && this.g.Dist[pos2-1][pos1]==-1) {
								SetDist(pos2-1,pos1,loop+1);
								updated=true;
							}
						}
					}
				}
			}
		}
	}
}

Model.Game.HuntRemovePositions=function(positions) {
	var repl={}
	var index=0;
	positions.sort(function(a,b) {
		return a-b;
	});
	for(var gpos=0;gpos<this.g.Graph.length;gpos++) {
		if(positions.length>0 && gpos==positions[0])
			positions.shift();
		else
			repl[gpos]=index++;
	}
	for(var gpos=0;gpos<this.g.Graph.length;gpos++) {
		if(typeof repl[gpos]=="undefined") {
			this.g.Graph[gpos]="X";
			continue;
		}
		var graph=this.g.Graph[gpos];
		var graph1=[];
		for(var d=0;d<graph.length;d++) {
			var npos=graph[d];
			if(npos!=null && typeof repl[npos]!="undefined")
				graph1.push(repl[npos]);
			else
				graph1.push(null);
		}
		this.g.Graph[gpos]=graph1;
	}
	var graph0=[];
	var rc0=[];
	for(var gpos=0;gpos<this.g.Graph.length;gpos++)
		if(typeof repl[gpos]!="undefined") {
			graph0.push(this.g.Graph[gpos]);
			rc0.push(this.g.RC[gpos]);
		}
	this.g.Graph=graph0;
	this.g.RC=rc0;
	this.g.PosName={};
}

Model.Game.HuntDist=function(pos0,pos1) {
	if(pos0==pos1)
		return 0;
	if(pos1>pos0) {
		var tmp=pos0;
		pos0=pos1;
		pos1=tmp;
	}
	return this.g.Dist[pos0-1][pos1];
}

Model.Move.Init = function(args) {
	if(typeof args !="undefined")
		this.CopyFrom(args);
}

Model.Move.PosName={};

Model.Move.ToString = function() {
	var $this=this;
	var str="";
	function BuildSerie(field) {
		if(typeof $this[field]!="undefined" && $this[field].length>0) {
			var pName=[];
			for(var i in $this[field]) {
				var pos=$this[field][i];
				if(typeof $this.PosName[pos]!="undefined")
					pName.push($this.PosName[pos]);
				else
					pName.push(pos);
			}
			return pName.join(",");
		} else
			return "";
	}
	str+=BuildSerie('p');
	var capt=BuildSerie('c');
	if(capt.length>0)
		str+="x"+capt;
	return str;
}

Model.Move.Equals = function(move) {
	if(move==null)
		return false;
	if(move.p.length!=this.p.length)
		return false;
	for(var i=0;i<this.p.length;i++)
		if(move.p[i]!=this.p[i])
			return false;
	if(move.c===undefined && this.c===undefined)
		return true;
	if(move.c!==undefined && this.c!==undefined) {
		for(var i=0;i<this.c.length;i++)
			if(move.c[i]!=this.c[i])
				return false;	
		return true;
	}
	return false;
}

Model.Board.InitialPosition = function(aGame) {
	this.HuntInitialPosition(aGame,aGame.g.initialPos);
	//this.Evaluate(aGame,false,true);
	//aGame.g.evaluate0=this.mEvaluation+1000000*aGame.g.catcher;
	this.zSign=aGame.zobrist.update(0,"who",-1);
}

Model.Board.CopyFrom = function(aBoard) {
	this.board=[];
	for(var i=0;i<aBoard.board.length;i++)
		this.board.push(null);
	this.pieces=[];
	for(var i in aBoard.pieces) {
		var piece0=aBoard.pieces[i];
		var piece={
			p: piece0.p,
			s: piece0.s,
			i: piece0.i,
			a: piece0.a,
			pv: piece0.pv,
			pv2: piece0.pv2,
		}
		this.pieces.push(piece);
		if(piece.p>-1)
			this.board[piece.p]=piece;
	}
	this.pieceCount=[aBoard.pieceCount[0],aBoard.pieceCount[1]];
	this.lastMoves={
		"1": [aBoard.lastMoves["1"][0],aBoard.lastMoves["1"][1],aBoard.lastMoves["1"][2]],
		"-1": [aBoard.lastMoves["-1"][0],aBoard.lastMoves["-1"][1],aBoard.lastMoves["-1"][2]],
	}
	this.mWho=aBoard.mWho;
	this.zSign=aBoard.zSign;
}

Model.Board.HuntInitialPosition = function(aGame, pieces) {
	this.board=[];
	for(var pos=0;pos<aGame.g.Graph.length;pos++)
		this.board.push(null);
	this.pieces=[];	
	this.pieceCount=[0,0];
	for(var who=0;who<2;who++) {
		for(var i=0;i<pieces[who].length;i++) {
			var pos=pieces[who][i];
			var piece={
				p: pos,       // position on the board or -1 if out 
				s: 1-(who*2), // 1 = Player A or -1 = player B
				i: this.pieces.length, // piece index
				a: 0, // piece angle
			}
			this.board[pos]=piece;
			this.zSign=aGame.zobrist.update(this.zSign,"board",1-(who*2),pos);
			this.pieces.push(piece);
			this.pieceCount[who]++;
		}
	}
	this.lastMoves={
		"1": [null,null,null],
		"-1": [null,null,null],
	}
}

Model.Board.GenerateMoves = function(aGame) {
	this.mMoves = [];
	if(aGame.g.useDrop) {
		this.mMoves=this.HuntGetAllDropMoves(aGame);
	}
	if(this.mMoves.length==0) {
		this.mMoves=this.HuntGetAllMoves(aGame);
		if(this.mMoves.length==0) {
			this.mFinished=true;
			this.mWinner=-this.mWho;
		}
	}
}

Model.Board.HuntGetCatcherMoves = function(aGame) {
	var $this=this;
	var moves=[];
	
	function CatchPiece(pos,poss,caught,caughtBidir) {
		var gotMoves=false;
		for(var d=0;d<aGame.g.Graph[pos].length;d++) {
			var pos1=aGame.g.Graph[pos][d];
			if(pos1!=null) {
				var piece1=$this.board[pos1];
				if(piece1!=null && piece1.s==-$this.mWho) {
					var pos2=aGame.g.Graph[pos1][d];
					if(pos2!=null && ($this.board[pos2]==null || poss.indexOf(pos2)>=0)) {
						var valid=true;
						var bidir=Math.floor(d/2);
						for(var i=0;i<caught.length;i++)
							if(pos1==caught[i] && bidir==caughtBidir[i]) {
								valid=false;
								break;
							}
						if(valid) {
							var poss0=poss.concat([pos2]);
							var caught0=caught.concat([pos1]);
							if(aGame.g.huntOptions.multipleCatch==false) {
								moves.push({p:poss0,c:caught0});
								gotMoves=true;								
							} else {
								var gotMoves0=CatchPiece(pos2,poss0,caught0,caughtBidir.concat([bidir]));
								if(gotMoves0==false || aGame.g.huntOptions.compulsaryCatch==false) {
									moves.push({p:poss0,c:caught0});
									gotMoves=true;
								}
							}
						}
					}
				}
			}
		}		
		return gotMoves;
	}
	
	for(var i=0;i<this.pieces.length;i++) {
		var piece=this.pieces[i];
		if(piece.p>=0 && piece.s==this.mWho) {
			CatchPiece(piece.p,[piece.p],[],[]);
		}
	}
	
	if(moves.length==0 || aGame.g.huntOptions.compulsaryCatch==false) {
		moves=moves.concat(this.HuntGetCatcheeMoves(aGame));
	} else if(aGame.g.huntOptions.catchLongestLine) {
		var longest=0, moves0=[];
		for(var i in moves) {
			if(longest<moves[i].c.length) {
				longest=moves[i].c.length;
				moves0=[moves[i]];
			} else if(longest==moves[i].c.length)
				moves0.push(moves[i]);
		}
		moves=moves0;
	}
	return moves;
}

Model.Board.HuntGetCatcheeMoves = function(aGame) {
	var moves=[];
	for(var i=0;i<this.pieces.length;i++) {
		var piece=this.pieces[i];
		if(piece.p>=0 && piece.s==this.mWho) {
			for(var d=0;d<aGame.g.Graph[piece.p].length;d++) {
				var pos=aGame.g.Graph[piece.p][d];
				if(pos!=null && this.board[pos]==null)
					moves.push({p:[piece.p,pos]});
			}			
		}
	}
	return moves;
}

Model.Board.HuntGetAllMoves = function(aGame) {
	if(this.mWho==aGame.g.catcher)
		return this.HuntGetCatcherMoves(aGame);
	else
		return this.HuntGetCatcheeMoves(aGame);
}

Model.Board.HuntGetAllDropMoves = function(aGame) {
	var moves=[];
	var dockPiece=null;
	for(var i=0;i<this.pieces.length;i++) {
		var piece=this.pieces[i];
		if(piece.p==-2 && piece.s==this.mWho) {
			dockPiece=piece;
			break
		}
	}
	if(dockPiece) {
		for(var pos=0;pos<this.board.length;pos++)
			if(this.board[pos]==null)
				moves.push({p:[pos]});
	}
	return moves;
}

Model.Board.HuntMakeEvalData=function(aGame) {
	var evalData={
		catcher: aGame.g.catcher,
		catchee: -aGame.g.catcher,
		catcherSide: (1-aGame.g.catcher)/2,
		catcheeSide: (aGame.g.catcher+1)/2,
		catcherPieces: [],
		catcheePieces: [],
		catcherPiecesDock: [],
		catcheePiecesDock: [],
	}
	for(var i=0;i<this.pieces.length;i++) {
		var piece=this.pieces[i];
		if(piece.p>-1)
			if(piece.s==evalData.catcher)
				evalData.catcherPieces.push(piece);
			else
				evalData.catcheePieces.push(piece);
		else if(piece.p==-2)
			if(piece.s==evalData.catcher)
				evalData.catcherPiecesDock.push(piece);
			else
				evalData.catcheePiecesDock.push(piece);
	}
	return evalData;
} 

Model.Board.HuntEvaluateFreeZone = function(aGame,evalData,evalMap) {
	var catcherZone={};
	var smallestZone=null;
	var smallestCatcherFreeZone=-1;
	for(var i in evalData.catcherPieces) {
		var catcherPiece=evalData.catcherPieces[i];
		var freePoss={},freePossCount=0,unexplored={},unexploredCount=1;
		unexplored[catcherPiece.p]=true;
		while(unexploredCount>0) {
			var pos;
			for(var pos0 in unexplored) {
				pos=parseInt(pos0);
				unexploredCount--;
				break;
			}
			delete unexplored[pos];
			freePoss[pos]=true;
			freePossCount++;
			catcherZone[pos]=true;
			for(var d in aGame.g.Graph[pos]) {
				var pos1=aGame.g.Graph[pos][d];
				if(pos1!=null && this.board[pos1]==null && !freePoss[pos1] && !unexplored[pos1]) {
					unexplored[pos1]=true;
					unexploredCount++;
				}
			}
		}
		//JocLog("Catcher free zone",freePossCount-1);
		if(smallestCatcherFreeZone<0 || smallestCatcherFreeZone<freePossCount-1) {
			smallestCatcherFreeZone=freePossCount-1;
			smallestZone=freePoss;
		}
	}
	evalData.catcherZone=catcherZone;
	evalMap.freeZone=[smallestCatcherFreeZone,0];
	evalMap.freeZone2=[smallestCatcherFreeZone*smallestCatcherFreeZone,0];
	evalMap.freeZoneSQRT=[Math.sqrt(smallestCatcherFreeZone),0];
	var dist=0;
	var dist2=0;
	var maxDist0=0;
	for(var i in evalData.catcheePieces) {
		var piece=evalData.catcheePieces[i];
		//var minDist=Infinity;
		var maxDist=0;
		for(var pos in freePoss) {
			var d=aGame.HuntDist(pos,piece.p);
			/*
			if(d<minDist)
				minDist=d;
			if(d==1)
				break;
			*/
			if(d>maxDist)
				maxDist=d;
			if(d>maxDist0)
				maxDist0=d;
		}
		//dist+=minDist
		dist+=maxDist;
		dist2+=maxDist*maxDist;
	}
	evalMap.distFree=[dist,0];
	evalMap.distFree2=[dist2,0];
	evalMap.maxDistFree=[maxDist0,0];
}

Model.Board.HuntEvaluateOppositeDistFromCatcher = function(aGame,evalData,evalMap) {
	var allFarthest=[];
	for(var i in evalData.catcherPieces) {
		var piece=evalData.catcherPieces[i];
		var farthest=[];
		var maxDist=0;
		for(var pos=0;pos<aGame.g.Graph.length;pos++) {
			var dist=aGame.HuntDist(pos,piece.p);
			if(dist>maxDist) {
				maxDist=dist;
				farthest=[pos];
			} else if(dist==maxDist)
				farthest.push(pos);
		}
		allFarthest=allFarthest.concat(farthest);
	}
	var dist=0, dist2=0, dists=0;
	for(var i in evalData.catcheePieces) {
		var piece=evalData.catcheePieces[i];
		var d=0,d2=0,ds=0;
		for(var j=0;j<allFarthest.length;j++) {
			d0=aGame.HuntDist(allFarthest[j],piece.p);
			d+=d0;
			d2+=d0*d0;
			ds+=Math.sqrt(d);
		}
		dist+=d/farthest.length;
		dist2+=d2/farthest.length;
		dists+=ds/farthest.length;
	}
	evalMap.oppDist=[-dist,0];
	evalMap.oppDist2=[-dist2,0];
	evalMap.oppDists=[-dists,0];
}

Model.Board.HuntEvaluateDistToCatcher = function(aGame,evalData,evalMap) {
	var dist=0, dist2=0, dist3=0;
	var maxDist=0;
	//var dists=[];
	for(var i in evalData.catcheePieces) {
		var catcheePiece=evalData.catcheePieces[i];
		var minDist=-1;
		for(var j in evalData.catcherPieces) {
			var catcherPiece=evalData.catcherPieces[j];
			var d=aGame.HuntDist(catcherPiece.p,catcheePiece.p);
			if(minDist<0 || minDist<d)
				minDist=d;
		}
		dist+=minDist;
		var minDist2=minDist*minDist;
		dist2+=minDist2;
		dist3+=minDist*minDist2;
		if(minDist>maxDist) {
			maxDist=minDist;
		}
	}
	evalMap.dist3=[dist3,0];
	evalMap.dist2=[dist2,0];
	evalMap.dist=[dist,0];
	evalMap.maxDist=[maxDist,0];
}

Model.Board.HuntEvaluateCatchable = function(aGame,evalData,evalMap) {
	var catchablePieces=0, catchableDir=0, catchableDangerPieces=0;
	for(var i in evalData.catcheePieces) {
		var catcheePiece=evalData.catcheePieces[i];
		var pos=catcheePiece.p;
		var catchable=false;
		var catchDanger=false;
		var graph=aGame.g.Graph[pos]
		for(var d=0;d<graph.length;d+=2) {
			var pos1=graph[d];
			var pos2=graph[d+1];
			if(pos1!=null && pos2!=null) {
				if(this.board[pos1]==null && this.board[pos2]==null) {
					catchableDir++;
					catchable=true;
				} else 	if((this.board[pos1]==null && this.board[pos2].s==aGame.g.catcher) ||
					(this.board[pos2]==null && this.board[pos1].s==aGame.g.catcher)) {
					catchableDir++;
					catchDanger=true;
					catchable=true;
				}
			}
		}
		if(catchable)
			catchablePieces++;
		if(catchDanger)
			catchableDangerPieces++;
	}
	evalMap.catchablePieces=[catchablePieces,0];
	evalMap.catchableDir=[catchableDir,0];
	evalMap.catchableDir2=[catchableDir*catchableDir,0];
	evalMap.catchDangerFork=[catchableDangerPieces>1?1:0,0];
}

Model.Board.HuntEvaluateRisk = function(aGame,evalData,evalMap) {
	var riskPoss={}, openPoss={};
	var riskCount=0, openCount=0;
	function AddOpen(pos) {
		if(evalData.catcherZone[pos]===undefined)
			if(openPoss[pos]===undefined) {
				openPoss[pos]=1;
				openCount++;
			} else
				openPoss[pos]++;
	}
	function AddRisky(pos) {
		if(riskPoss[pos]===undefined) {
			riskPoss[pos]=1;
			riskCount++;
		} else
			riskPoss[pos]++;
	}
	for(var i in evalData.catcheePieces) {
		var piece=evalData.catcheePieces[i];
		var pos=piece.p;
		var graph=aGame.g.Graph[pos];
		for(var d=0;d<graph.length;d+=2) {
			var pos1=graph[d];
			var pos2=graph[d+1];
			if(pos1!=null && pos2!=null) {
				var piece1=this.board[pos1];
				var piece2=this.board[pos2];
				if(piece1==null && piece2==null) {
					AddOpen(pos1);
					AddOpen(pos2);
				} else if(piece1!=null && piece1.s==aGame.g.catcher && piece2==null) {
					AddOpen(pos1);
					AddRisky(pos2);
				} else if(piece2!=null && piece2.s==aGame.g.catcher && piece1==null) {
					AddRisky(pos1);
					AddOpen(pos2);
				}
			}
		}
	}
	var openMetric=0;
	for(var pos in openPoss) {
		var metric=openPoss[pos];
		openMetric+=metric*metric;
	}
	var riskMetric=0;
	for(var pos in riskPoss) {
		var metric=riskPoss[pos];
		riskMetric+=metric*metric;
	}
	evalMap.openRisk=[openMetric,0];
	evalMap.forkRisk=[riskMetric,0];
}


Model.Board.HuntEvaluateAntiBack = function(aGame,evalData,evalMap) {
	var catcherPrev=0, catcheePrev=0, catcherPiecePrev=0, catcheePiecePrev=0;
	for(var i in evalData.catcheePieces) {
		var piece=evalData.catcheePieces[i];
		if(piece.p==piece.pv2)
			catcheePiecePrev++;
	}
	for(var i in evalData.catcherPieces) {
		var piece=evalData.catcherPieces[i];
		if(piece.p==piece.pv2)
			catcherPiecePrev++;
	}
	for(var who=-1;who<2;who+=2) {
		var last=this.lastMoves[who];	
//		if(last[0]!=null && last[1]!=null && typeof last[0].c=="undefined" && typeof last[1].c=="undefined" && 
//				last[0].p.length==2 && last[1].p.length==2 && last[0].p[0]==last[1].p[1] && last[1].p[0]==last[0].p[1])
			if(last[0]!=null && last[0].Equals(last[2]))
				if(aGame.g.catcher==who)
					catcherPrev++;
				else
					catcheePrev++;
	}
	evalMap.antiBack=[catcheePrev,catcherPrev];
	evalMap.antiBackPiece=[catcheePiecePrev,catcherPiecePrev];
}

Model.Board.HuntEvaluateCatcheeConnections = function(aGame,evalData,evalMap) {
	var conn=0;
	var connLog=0;
	for(var i=0;i<this.pieces.length;i++) {
		var piece=this.pieces[i];
		if(piece.s==-aGame.g.catcher && piece.p>=0) {
			var pieceConn=0;
			var graph=aGame.g.Graph[piece.p];
			for(var d=0;d<graph.length;d++) {
				var pos1=graph[d];
				if(pos1!=null) {
					var piece1=this.board[pos1];
					if(piece1 && piece1.s==piece.s)
						pieceConn++;
				}
			}
			conn+=pieceConn;
			connLog+=Math.log(pieceConn+1);
		}
	}
	evalMap.catcheeConn=[0,conn];
	evalMap.catcheeConnLog=[0,connLog];
}

Model.Board.HuntEvaluateCatcheeGroups = function(aGame,evalData,evalMap) {
	var pieces={}
	var pieceCount=0;
	for(var i=0;i<this.pieces.length;i++) {
		var piece=this.pieces[i];
		if(piece.s==-aGame.g.catcher && piece.p>=0) {
			pieces[piece.i]=piece;
			pieceCount++;
		}
	}
	var groupCount=0;
	while(pieceCount>0) {
		groupCount++;
		for(var i in pieces)
			break;
		var piece=pieces[i];
			delete pieces[i];
		var pieces0={};
		pieces0[i]=piece;
		var pieceCount0=1;
		while(pieceCount0>0) {
			for(var i in pieces0)
				break;
			var piece0=pieces0[i];
			delete pieces0[i];
			pieceCount0--;
			delete pieces[i];
			pieceCount--;
			var graph=aGame.g.Graph[piece0.p];
			for(var d=0;d<graph.length;d++) {
				var pos1=graph[d];
				if(pos1!=null) {
					var piece1=this.board[pos1];
					if(piece1 && (piece1.i in pieces) && !(piece1.i in pieces0)) {
						pieces0[piece1.i]=piece1;
						pieceCount0++;
					}
				}
			}
		}
	}
	evalMap.catcheeGroups=[groupCount,0];
}

Model.Board.HuntEvaluateGroups = function(aGame,evalData,evalMap) {
	var groups={};
	var groupPos={};
	var groupIndex=0;
	for(var pos=0;pos<aGame.g.Graph.length;pos++) {
		if(typeof groupPos[pos]=="undefined") {
			var piece=this.board[pos];
			var currentGroup=null;
			var graph=aGame.g.Graph[pos];
			for(var d=0;d<graph.length;d++) {
				var pos1=graph[d];
				if(pos1!=null) {
					var piece1=this.board[pos1];
					if((piece==null && piece1==null) ||
						(piece!=null && piece1!=null && piece.s==piece1.s)) {
						if(typeof groupPos[pos1]!="undefined") {
							var groupPos1=groupPos[pos1];
							if(currentGroup==null) {
								groupPos[pos]=groupPos1;
								groups[groupPos1].poss.push(pos);
								currentGroup=groupPos1;
							} else if(currentGroup!=groupPos1) {
								// Merge groups
								var group=groups[currentGroup];
								var group1=groups[groupPos1];
								group.poss=group.poss.concat(group1.poss);
								for(var i in group1.poss)
									groupPos[group1.poss[i]]=currentGroup;
								delete groups[groupPos1];
							}
						}
					}
				}
			}
			if(currentGroup==null) {
				groups[groupIndex]={
					type: piece==null?0:piece.s,
					poss: [pos],
					touchCatcher: false,
				}
				groupPos[pos]=groupIndex++;
			}
		}
	}
	for(var i in evalData.catcherPieces) {
		var piece=evalData.catcherPieces[i];
		for(var d=0;d<graph.length;d++) {
			var pos1=aGame.g.Graph[piece.p][d];
			if(pos1!=null) {
				groups[groupPos[pos1]].touchCatcher=true;
			}
		}
	}
	//JocLog("groups",groups);
	var catcheeGroups=0;
	var maxEmptyNoCatcherGroup=0;
	var emptyNoCatcherGroup=0;
	var minEmptyCatcherGroup=0;
	for(var g in groups) {
		var group=groups[g];
		if(group.type==-aGame.g.catcher)
			catcheeGroups++;
		else if(group.type==0) {
			if(group.touchCatcher==false) {
				if(group.poss.length>maxEmptyNoCatcherGroup)
					maxEmptyNoCatcherGroup=group.poss.length;
				emptyNoCatcherGroup+=group.poss.length;
			} else if(group.touchCatcher==true)
				minEmptyCatcherGroup+=group.poss.length;
		}
	}
	evalMap.catcheeGroups=[catcheeGroups,0];
	evalMap.maxEmptyNoCatcherGroup=[0,maxEmptyNoCatcherGroup];
	evalMap.emptyNoCatcherGroup=[0,emptyNoCatcherGroup];
	evalMap.minEmptyCatcherGroup=[minEmptyCatcherGroup<0?0:minEmptyCatcherGroup,0];
}

Model.Board.HuntGameEvaluate = function(aGame,evalData,evalMap) {
	return { pieceCount: [1,1] };
}


Model.Board.QuickEvaluate = function(aGame) {
	this.Evaluate(aGame,false,true);
	return this.mEvaluation;
}


Model.Board.Evaluate = function(aGame,aFinishOnly,aTopLevel) {
	var repeat=aGame.GetRepeatOccurence(this);
	if(repeat>2) {
		this.mFinished=true;
		this.mWinner=JocGame.DRAW;
	}
	var evalData=this.HuntMakeEvalData(aGame);
	if(this.pieceCount[evalData.catcherSide]<aGame.g.catcherMin) {
		this.mFinished=true;
		this.mWinner=evalData.catchee;
	}
	if(this.pieceCount[evalData.catcheeSide]<aGame.g.catcheeMin) {
		this.mFinished=true;
		this.mWinner=evalData.catcher;
	}
	this.mEvaluation=0;
	if(this.mFinished)
		return;

	var evalMap={
		pieceCount: [
		 	        this.pieceCount[evalData.catcherSide], 
			        this.pieceCount[evalData.catcheeSide], 
		]
	}

	var evalFactors=this.HuntGameEvaluate(aGame,evalData,evalMap);
	
	var debugEval=arguments[3]=="debug"; 
	
	for(var f in evalFactors) {
		var factors=evalFactors[f];
		var values=evalMap[f];
		if(values===undefined)
			console.error("Evaluation undefined map value",f);
		if(debugEval) {
			console.log(f+":",values[0],"x",factors[0]," - ",values[1],"x",factors[1],"=",values[0]*factors[0]-values[1]*factors[1]);
		}
		this.mEvaluation+=values[0]*factors[0]-values[1]*factors[1];
	}
		
	if(debugEval) {
		for(var f in evalMap) {
			if(typeof evalFactors[f]=="undefined")
				JocLog("Unused",f+": ",evalMap[f][0],evalMap[f][1]);
		}
		JocLog("==>",this.mEvaluation,"=>",this.mEvaluation*aGame.g.catcher,"=>",this.mEvaluation*aGame.g.catcher-aGame.g.evaluate0);
	}
	this.mEvaluation*=aGame.g.catcher;
	this.mEvaluation-=aGame.g.evaluate0;
	
}

Model.Board.HuntCheckBoard=function(aGame) {
	for(var i in aGame.g.Graph) {
		var pos=aGame.g.Graph[i];
		var piece=this.board[pos];
		if(piece!=null) {
			if(piece.p!=pos)
				return "Piece "+piece+i+" has p "+piece.p+" while on board pos "+pos;
		} 
	}
	for(var i in this.pieces) {
		var piece=this.pieces[i];
		if(piece.p!=-1 && this.board[piece.p]!=piece)
			return "Piece "+i+" not on board "+piece.p;
	}
	return null;
}

Model.Board.HuntAngle = function(aGame,pos0,pos) {
	var rc0=aGame.g.RC[pos0];
	var r0=rc0[0];
	var c0=rc0[1];
	var rc=aGame.g.RC[pos];
	var r=rc[0];
	var c=rc[1];
	/*return {
		"-1,-1": -135,
		"0,-1": -90,
		"1,-1": -45,
		"-1,0": 180,
		"1,0": 0,
		"-1,1": 135,
		"0,1": 90,
		"1,1": 45,
		"-2,-2": -135,
		"0,-2": -90,
		"2,-2": -45,
		"-2,0": 180,
		"2,0": 0,
		"-2,2": 135,
		"0,2": 90,
		"2,2": 45,
	}[""+(r-r0)+","+(c-c0)];*/

	var a = 0;
	var dx=r-r0;
	var dy=c-c0;
	if (dx==0){
		a = (dy > 0) ? 90 : -90;
	}else{
		a = 180*Math.atan(dy/dx) / Math.PI ; 
		if(dx<0) a= (a+180)%360;
	}
	return a; 
}

Model.Board.ApplyMove = function(aGame,aMove) {
	if(aMove.p.length==1) {
		for(var i=0;i<this.pieces.length;i++) {
			var piece=this.pieces[i];
			if(piece.s==this.mWho && piece.p==-2) {
				piece.p=aMove.p[0];
				piece.a=0;
				this.board[piece.p]=piece;
				this.zSign=aGame.zobrist.update(this.zSign,"board",piece.s,piece.p);
				break;
			}
		}
	} else {
		var piece=this.board[aMove.p[0]];
		this.zSign=aGame.zobrist.update(this.zSign,"board",piece.s,piece.p);
		this.board[aMove.p[0]]=null;
		this.board[aMove.p[aMove.p.length-1]]=piece;
		piece.pv2=piece.pv;
		piece.pv=piece.p;
		piece.p=aMove.p[aMove.p.length-1];
		piece.a=this.HuntAngle(aGame,aMove.p[aMove.p.length-2],aMove.p[aMove.p.length-1]);
		this.zSign=aGame.zobrist.update(this.zSign,"board",piece.s,piece.p);
		if(aMove.c!==undefined) {
			var side=this.mWho==JocGame.PLAYER_A?0:1;
			for(var i=0;i<aMove.c.length;i++) {
				piece=this.board[aMove.c[i]];
				if(piece!=null) {
					this.board[aMove.c[i]]=null;
					this.zSign=aGame.zobrist.update(this.zSign,"board",piece.s,piece.p);
					piece.p=-1;
					this.pieceCount[1-side]--;
				}
			}
		}
	}
	this.lastMoves[this.mWho][2]=this.lastMoves[this.mWho][1];
	this.lastMoves[this.mWho][1]=this.lastMoves[this.mWho][0];
	this.lastMoves[this.mWho][0]=new (aGame.GetMoveClass())(aMove);
	this.zSign=aGame.zobrist.update(this.zSign,"who",-this.mWho);
	this.zSign=aGame.zobrist.update(this.zSign,"who",this.mWho);	
}

Model.Board.GetSignature = function() {
	return this.zSign;
}	
