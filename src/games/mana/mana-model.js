/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

Model.Game.InitGame = function() {
	var $this=this;
	this.g.Graph=[];
	this.g.CValue=[];
	var dPos=[[1,0],[-1,0],[0,1],[0,-1]];
	for(var r=0;r<this.mOptions.height;r++)
		for(var c=0;c<this.mOptions.width;c++) {
			var graph=[];
			for(var i=0;i<dPos.length;i++) {
				var dc=dPos[i][0];
				var dr=dPos[i][1];
				var r1=r+dr;
				var c1=c+dc;
				if(r1>=0 && r1<this.mOptions.height && c1>=0 && c1<this.mOptions.width)
					graph.push(r1*this.mOptions.width+c1);
				else
					graph.push(-1);
			}
			this.g.Graph.push(graph);
			this.g.CValue[r*this.mOptions.width+c]=parseInt(this.mOptions.initial[r].charAt(c));
		}
	
	function GetPath(cell,credits,path,exclude) {
		var graph=$this.g.Graph[path[path.length-1]];
		for(var j=0;j<4;j++) {
			var pos=graph[j];
			if(pos>=0 && !exclude[pos]) {
				if(credits==0) {
					if(!cell[pos])
						cell[pos]=[];
					var path1=[];
					for(var k=0;k<path.length;k++)
						path1.push(path[k]);
					path1.push(pos);
					cell[pos].push(path1);
				} else {
					path.push(pos);
					exclude[pos]=true;
					GetPath(cell,credits-1,path,exclude);
					delete exclude[pos];
					path.pop();
				}
			}
		}
	}
	this.g.Targets=[];
	for(var pos=0;pos<this.g.Graph.length;pos++) {
		var cell={};
		var exclude={};
		exclude[pos]=true;
		GetPath(cell,this.g.CValue[pos]-1,[pos],exclude);
		this.g.Targets[pos]=cell;
	}

	this.g.Orients={
		"NW": {
			angle: -90,
		},
		"NE": {
			angle: 180,
		},
		"SW": {
			angle: 0,
		},
		"SE": {
			angle: 90,
		},
	}
	
	var dist=[];
	for(var pos1=0;pos1<this.g.Graph.length;pos1++) {
		dist.push([]);
		for(var pos2=0;pos2<this.g.Graph.length;pos2++)
			dist[pos1].push(pos1==pos2?0:-1);
	}
	while(true) {
		var changes=0;
		for(var pos1=0;pos1<this.g.Graph.length;pos1++)
			for(var pos2=0;pos2<this.g.Graph.length;pos2++) {
				if(dist[pos1][pos2]>=0) {
					var targets=this.g.Targets[pos2];
					for(var t in targets) {
						var target=parseInt(t);
						if(dist[pos1][target]<0) {
							dist[pos1][target]=dist[pos1][pos2]+1;
							changes++;
						}
					}
				}
			}
		if(changes==0)
			break;
	}
	this.g.Dist=dist;
}

Model.Game.DestroyGame = function() {
}

Model.Move.Init = function(args) {
	if(typeof(args)!="undefined")
		this.CopyFrom(args);
}

Model.Move.ToString = function() {
	var notations=[];
	if(this.o)
		notations.push("o"+this.o);
	if(this.p) {
		for(var i=0;i<this.p.d.length;i++)
			notations.push("d"+this.p.d[i]);
		for(var i=0;i<this.p.r.length;i++)
			notations.push("r"+this.p.r[i]);
	}
	if(this.m)
		notations.push("m"+this.m[0]+">"+this.m[1]);
	if(this.i!==undefined)
		notations.push("p"+this.i);
	return notations.join(" ");
}

Model.Move.CopyFrom = function(move) {
	Object.assign(this,JSON.parse(JSON.stringify(move)));
}

Model.Board.Init = function(aGame) {
}

Model.Board.InitialPosition = function(aGame) {
	var pieces=[];
	var board=[];
	for(var i=0;i<aGame.g.Graph.length;i++)
		board[i]=-1;
	this.pieces=pieces;
	this.board=board;
	this.stage=1; // 1: orient board + place A pieces, 2: place B pieces, 3: play
	this.mana=-1;
	this.roninOut={
			"1": 0,
			"-1": 0,
		}
	this.damyoOut={
			"1": 0,
			"-1": 0,
		}
}

Model.Board._getRCCoord = function(aGame,pos,orient) {
	var r=Math.floor(pos/aGame.mOptions.width);
	var c=pos%aGame.mOptions.width;
	if(arguments.length<3)
		orient=this.orient;
	if(orient=="NE" || orient=="SW") {
		var t=r;
		r=c;
		c=t;
	}
	if(orient=="NE" || orient=="NW")
		c=aGame.mOptions.width-1-c;
	if(orient=="NE" || orient=="SE")
		r=aGame.mOptions.height-1-r;
	return [r,c];
}


Model.Board.manaCreatePlacement = function(aGame,orient) {
	var poss=[];
	for(var pos=0;pos<aGame.g.Graph.length;pos++) {
		var rc=this._getRCCoord(aGame,pos,orient);
		if((this.mWho==-1 && rc[1]<=1) || (this.mWho==1 && rc[1]>=aGame.mOptions.width-2)) {
			poss.push(pos);
		}
	}
	var placement={
		d: [],
		r: [],
	}
	for(var i=0;i<aGame.mOptions.damyoCount;i++) {
		var posIndex=aGame.Random(poss.length);
		var pos=poss[posIndex];
		poss.splice(posIndex,1);
		placement.d.push(pos);
	}
	for(var i=0;i<aGame.mOptions.roninCount;i++) {
		var posIndex=aGame.Random(poss.length);
		var pos=poss[posIndex];
		poss.splice(posIndex,1);
		placement.r.push(pos);
	}
	return placement;
}

Model.Board.GenerateMoves = function(aGame) {
	if(this.stage==1) {
		var orients=["NE","SE","SW","NW"];
		for(var i=0;i<aGame.mOptions.stage1start;i++) {
			var orient=orients[aGame.Random(4)];
			var placement=this.manaCreatePlacement(aGame,orient);
			this.mMoves.push({
				o: orient,
				p: placement,
			});
		}
	} else if(this.stage==2) {
		for(var i=0;i<aGame.mOptions.stage2start;i++) {
			var placement=this.manaCreatePlacement(aGame,this.orient);
			this.mMoves.push({
				p: placement,
			});
		}		
	} else {
		var movables=this.manaMovablePieces(aGame);
		var validMoves=[];
		var mana=-1;
		if(this.mana>=0)
			mana=aGame.g.CValue[this.mana];
		for(var i in movables) {
			var piece=this.pieces[i];
			if(mana<0 || aGame.g.CValue[piece.p]==mana) {
				for(var pos in movables[i])
					validMoves.push({
						m: [piece.p,parseInt(pos)],
					});
			}
		}
		if(validMoves.length==0) {
			for(var i in movables) {
				var piece=this.pieces[i];
				for(var pos in movables[i])
					validMoves.push({
						m: [piece.p,parseInt(pos)],
					});
			}
			if(this.roninOut[this.mWho]>0)
				for(var pos=0;pos<aGame.g.Graph.length;pos++) {
					if(this.board[pos]<0 && (aGame.mOptions.insertAnywhere || aGame.g.CValue[pos]==mana))
						validMoves.push({
							i: pos,
						});
				}
		}
		this.mMoves=validMoves;
	}
}


Model.Board.Evaluate = function(aGame,aFinishOnly,aTopLevel) {
	this.mEvaluation=0;
	if(this.damyoOut[JocGame.PLAYER_A]>=aGame.mOptions.damyoKillWin) {
		this.mFinished=true;
		this.mWinner=JocGame.PLAYER_B;
		return;
	} else if(this.damyoOut[JocGame.PLAYER_B]>=aGame.mOptions.damyoKillWin) {
		this.mFinished=true;
		this.mWinner=JocGame.PLAYER_A;
		return;
	}
	var cellTypesPieceCount={
			"1": { 1: 0, 2: 0, 3: 0 },
			"-1": { 1: 0, 2: 0, 3: 0 },
		}
	var cellTypesDamyoCount={
			"1": { 1: 0, 2: 0, 3: 0 },
			"-1": { 1: 0, 2: 0, 3: 0 },
		}
	var damyoPoss={
			"1": [],
			"-1": [],
	}
	for(var pIndex=0;pIndex<this.pieces.length;pIndex++) {
		var piece=this.pieces[pIndex];
		if(piece.p>=0) {
			cellTypesPieceCount[piece.s][aGame.g.CValue[piece.p]]++;
			if(piece.t=="d") {
				cellTypesDamyoCount[piece.s][aGame.g.CValue[piece.p]]++;
				damyoPoss[piece.s].push(piece.p);
			}
		}
	}
	for(var pos=0;pos<aGame.g.Graph.length;pos++) {
		var pIndex=this.board[pos];
		if(pIndex>=0) {
			var piece=this.pieces[pIndex];
		}
	}
	var typeCount={
		"1": 0,
		"-1": 0,
	}
	for(var who=-1;who<=1;who+=2)
		for(var type=1;type<=3;type++)
			if(cellTypesPieceCount[who][type]>0)
				typeCount[who]++;
	var sameAsDamyo={
		"1": 0,
		"-1": 0,
	}
	for(var who=-1;who<=1;who+=2) 
		for(var type=1;type<=3;type++)
			sameAsDamyo[who]+=(cellTypesDamyoCount[who][type]*cellTypesPieceCount[who][type]);
	var roninCount={
		"1": 0,
		"-1": 0,			
	}
	for(var who=-1;who<=1;who+=2)
		roninCount[who]=aGame.mOptions.roninCount-this.roninOut[who];

	var dist2Damyo={
		"1": {
			dist: 0,
			invSquare: 0,
		},
		"-1": {
			dist: 0,
			invSquare: 0,
		},
	}
	for(var pIndex=0;pIndex<this.pieces.length;pIndex++) {
		var piece=this.pieces[pIndex];
		if(piece.p>=0 && piece.t=="r") {
			var minDist=-1;
			for(var i=0;i<damyoPoss[-piece.s].length;i++) {
				var damyoPos=damyoPoss[-piece.s][i];
				var dist=aGame.g.Dist[piece.p][damyoPos];
				if(minDist<0 || dist<minDist)
					minDist=dist;
			}
			if(minDist==0)
				debugger;
			dist2Damyo[piece.s].dist+=minDist;
			dist2Damyo[piece.s].invSquare+=1/(minDist*minDist);
		}
	}
	
	var eval=0;
	var factors=aGame.mOptions.factors;
	eval+=factors.typeCount[typeCount[1]]-factors.typeCount[typeCount[-1]];
	eval+=factors.sameAsDamyo*(sameAsDamyo[1]-sameAsDamyo[-1]);
	eval+=factors.roninCount[roninCount[1]]-factors.roninCount[roninCount[-1]];
	eval+=factors.dist2Damyo*(dist2Damyo[1].dist-dist2Damyo[-1].dist);
	eval+=factors.dist2DamyoInvSquare*(dist2Damyo[1].invSquare-dist2Damyo[-1].invSquare);
	/*
	console.log("eval",eval,
			"d",factors.dist2Damyo*(dist2Damyo[1].dist-dist2Damyo[-1].dist),
			"dis",factors.dist2DamyoInvSquare*(dist2Damyo[1].invSquare-dist2Damyo[-1].invSquare),
			"rc",factors.roninCount[roninCount[1]]-factors.roninCount[roninCount[-1]],
			"sd",factors.sameAsDamyo*(sameAsDamyo[1]-sameAsDamyo[-1]),
			"tc",factors.typeCount[typeCount[1]]-factors.typeCount[typeCount[-1]]
			);
	*/
	if(isNaN(eval))
		debugger;
	this.mEvaluation=eval;
}

Model.Board.ApplyMove = function(aGame,move) {
	if(this.stage==1)
		this.orient=move.o;
	if(this.stage==1 || this.stage==2) {
		var index=0;
		for(var i=0;i<move.p.d.length;i++) {
			var p=move.p.d[i];
			var piece={
				s: this.mWho,
				t: 'd',
				p: p,
				i: index++,
			}
			this.pieces.push(piece);
			this.board[p]=this.pieces.length-1;
		}
		index=0;
		for(var i=0;i<move.p.r.length;i++) {
			var p=move.p.r[i];
			var piece={
				s: this.mWho,
				t: 'r',
				p: p,
				i: index++,
			}
			this.pieces.push(piece);
			this.board[p]=this.pieces.length-1;
		}
		this.stage++;
	}
	if(move.m) {
		var pieceIndex=this.board[move.m[0]];
		var piece=this.pieces[pieceIndex];
		this.board[move.m[0]]=-1;
		var pieceIndex1=this.board[move.m[1]];
		if(pieceIndex1>=0) {
			var piece1=this.pieces[pieceIndex1];
			piece1.p=-1;
			if(piece1.t=="r")
				this.roninOut[-this.mWho]++;
			else if(piece1.t=="d")
				this.damyoOut[-this.mWho]++;
		}
		piece.p=move.m[1];
		this.board[move.m[1]]=pieceIndex;
		this.mana=move.m[1];
	}
	if(move.i!==undefined) {
		var piece,i;
		for(i=0;i<this.pieces.length;i++) {
			piece=this.pieces[i];
			if(piece.t=="r" && piece.s==this.mWho && piece.p<0)
				break;
		}
		piece.p=move.i;
		this.board[move.i]=i;
		this.mana=move.i;
		this.roninOut[this.mWho]--;
	}
}
	
Model.Board.IsValidMove = function(aGame,move) {
	return true;
}
	
Model.Board.manaMovablePieces = function(aGame) {
	var pieces={};
	for(var i=0;i<this.pieces.length;i++) {
		var piece=this.pieces[i];
		if(piece.s==this.mWho) {
			var pos=piece.p;
			for(var pos1 in aGame.g.Targets[pos]) {
				if(this.board[pos1]>=0 && this.pieces[this.board[pos1]].s==this.mWho)
					continue;
				var validPath=null;
				var pathes=aGame.g.Targets[pos][pos1];
				for(var j=0;j<pathes.length;j++) {
					var valid=true;
					var path=pathes[j];
					for(var k=1;k<path.length-1;k++)
						if(this.board[path[k]]>=0) {
							valid=false;
							break;
						}
					if(valid) {
						validPath=path;
						break;
					}
				}
				if(validPath) {
					if(!pieces[i])
						pieces[i]={};
					pieces[i][pos1]=validPath;
				}
			}
		}
	}
	return pieces;
}

