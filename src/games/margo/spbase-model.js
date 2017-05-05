/*
 * Copyright (c) 2013 - Jocly - www.jocly.com - All rights reserved
 */

Model.Game.InitGame = function() {
	var aGame=this;
	var size=this.mOptions.size;
	var coord=[]; // coord[position] = [row,col,height]
	var g=[];	  // g[position][direction] = neighbor_position | null if outside
	var index=0;
	//var hBase=[0,16,25,29];
	var hBase0=0;
	var hBase=[];
	for(var h=0;h<size;h++) {
		hBase.push(hBase0);
		hBase0+=(size-h)*(size-h);
	} 
	for(var h=0;h<size;h++) 
		for(var r=0;r<size-h;r++)
			for(var c=0;c<size-h;c++) {
				var pos=index++;
				coord[pos]=[r,c,h];
				g[pos]=[];
				/* down */
				for(var dr=0;dr<2;dr++)
					for(var dc=0;dc<2;dc++) {
						var h0=h-1;
						var r0=r+dr;
						var c0=c+dc;
						if(h0>=0 && h0<size && r0>=0 && r0<size-h0 && c0>=0 && c0<size-h0)
							g[pos].push(hBase[h0]+r0*(size-h0)+c0);
						else
							g[pos].push(null);
					}
				/* same level */
				var dirs=[[0,-1],[0,1],[-1,0],[1,0]];
				for(var i=0; i<dirs.length; i++) {
					var dir=dirs[i];
					var h0=h;
					var r0=r+dir[0];
					var c0=c+dir[1];
					if(h0>=0 && h0<size && r0>=0 && r0<size-h0 && c0>=0 && c0<size-h0)
						g[pos].push(hBase[h0]+r0*(size-h0)+c0);
					else
						g[pos].push(null);
				}
				/* up */
				for(var dr=-1;dr<1;dr++)
					for(var dc=-1;dc<1;dc++) {
						var h0=h+1;
						var r0=r+dr;
						var c0=c+dc;
						if(h0>=0 && h0<size && r0>=0 && r0<size-h0 && c0>=0 && c0<size-h0)
							g[pos].push(hBase[h0]+r0*(size-h0)+c0);
						else
							g[pos].push(null);
					}
			}
	this.g.Graph=g;
	this.g.Coord=coord;
	
	// go to position at same r and c, 2 levels above /below
	this.g.Over=[];
	this.g.Beneath=[];
	for(var pos=0;pos<this.g.Graph.length;pos++) {
		this.g.Over[pos]=null;
		this.g.Beneath[pos]=null;
	}
	for(var pos=0;pos<this.g.Graph.length;pos++) {
		var coord=this.g.Coord[pos];
		for(var pos1=pos+1;pos1<this.g.Graph.length;pos1++) {
			var coord1=this.g.Coord[pos1];
			if(coord1[2]==coord[2]+2 && coord1[0]==coord[0]-1 && coord1[1]==coord[1]-1) {
				this.g.Over[pos]=pos1;
				this.g.Beneath[pos1]=pos;
				break;
			}
		}
	}

	// walk through neighbor positions
	this.g.EachDirection = function(pos,fnt) {
		for(var i=0;i<12;i++) {
			var npos=aGame.g.Graph[pos][i];
			if(npos!=null)
				if(fnt(npos,i)==false)
					return;
		}
	}
	// walk through down neighbors positions
	this.g.EachDirectionDown = function(pos,fnt) {
		var dirs=[0,1,2,3];
		for(var i=0;i<dirs.length;i++) {
			var npos=aGame.g.Graph[pos][dirs[i]];
			if(npos!=null)
				if(fnt(npos,dirs[i])==false)
					return;
		}
	}
	// walk up neighbors positions
	this.g.EachDirectionUp = function(pos,fnt) {
		var dirs=[8,9,10,11];
		for(var i=0;i<dirs.length;i++) {
			var npos=aGame.g.Graph[pos][dirs[i]];
			if(npos!=null)
				if(fnt(npos,dirs[i])==false)
					return;
		}
	}
	// walk up neighbors positions at same z
	this.g.EachDirectionFlat = function(pos,fnt) {
		var dirs=[4, 5, 6, 7];
		for(var i=0;i<dirs.length;i++) {
			var npos=aGame.g.Graph[pos][dirs[i]];
			if(npos!=null)
				if(fnt(npos,dirs[i])==false)
					return;
		}
	}
	// walk up neighbors positions at same z or below
	this.g.EachDirectionFlatDown = function(pos,fnt) {
		var dirs=[0, 1, 2, 3, 4, 5, 6, 7];
		for(var i=0;i<dirs.length;i++) {
			var npos=aGame.g.Graph[pos][dirs[i]];
			if(npos!=null)
				if(fnt(npos,dirs[i])==false)
					return;
		}
	}
	// walk up neighbors positions at same z or above
	this.g.EachDirectionFlatUp = function(pos,fnt) {
		var dirs=[4, 5, 6, 7, 8, 9, 10, 11];
		for(var i=0;i<dirs.length;i++) {
			var npos=aGame.g.Graph[pos][dirs[i]];
			if(npos!=null)
				if(fnt(npos,dirs[i])==false)
					return;
		}
	}

	this.zobrist=new JocGame.Zobrist({
		board: {
			type: "array",
			size: this.g.Graph.length,
			values: [0,1],
		}
	});

	this.InitGameExtra();
}

Model.Game.MapSameLevelDiagGraph = function() {
	var hBase=[0,16,25,29];
	for(var h=0;h<4;h++) 
		for(var r=0;r<4-h;r++)
			for(var c=0;c<4-h;c++) {
				var pos=hBase[h]+r*(4-h)+c;
				for(var dr=-1;dr<2;dr+=2)
					for(var dc=-1;dc<2;dc+=2) {
						var h0=h;
						var r0=r+dr;
						var c0=c+dc;
						if(h0>=0 && h0<4 && r0>=0 && r0<4-h0 && c0>=0 && c0<4-h0)
							this.g.Graph[pos].push(hBase[h0]+r0*(4-h0)+c0);
						else
							this.g.Graph[pos].push(null);
					}
			}
}

Model.Game.InitGameExtra = function() {
}

Model.Game.DestroyGame = function() {
	this.DestroyGameExtra();
}

Model.Game.DestroyGameExtra = function() {
}

Model.Game.spUpdateZobrist = function(sign,adds,addsSide,removes,removesSide,who) {
	for(var i=0;i<adds.length;i++)
		sign=this.zobrist.update(sign,"board",addsSide,adds[i]);
	for(var i=0;i<removes.length;i++)
		sign=this.zobrist.update(sign,"board",removesSide,removes[i]);
	return sign;
}

Model.Move.Init = function(args) {
	for(var p in args) 
		if(args.hasOwnProperty(p))
			this[p]=JSON.parse(JSON.stringify(args[p]));
}

Model.Move.ToString = function() {
	var color=['?','W','B','R'][this.clr];
	var str="";
	switch(this.act) {
	case "+":
		str+="+"+this.pos+color;
		break;
	case ">":
		str+=this.from+">"+this.to+color;
		break;
	}
	return str;
}

Model.Board.Init = function(aGame) {
}

Model.Board.InitialPosition = function(aGame) {
	this.spInitialPosition(aGame);
}

Model.Board.spInitialPosition = function(aGame) {
	this.board=[]; // access balls by position
	for(var i=0; i<aGame.g.Graph.length; i++)
		this.board[i]=0;
	this.maxLayer=0;
	this.ballCount=[0,0,0];
	this.playables={};
	this.height=[0,0,0];
	this.zSign=0;
	// can put ball at ground level z=0
	for(var i=0;i<aGame.mOptions.size*aGame.mOptions.size;i++)
		this.playables[i]=true;
}

Model.Board.MakeFreeMoves = function(aGame) {
	var moves=[];
	for(var pos in this.playables)
		if(this.playables.hasOwnProperty(pos))
			moves.push({ act: '+', pos: pos, clr: this.mWho==JocGame.PLAYER_A?1:2 });
	return moves;
}

Model.Board.GenerateMoves = function(aGame) {
	var moves=this.GenerateAllMoves(aGame);
	var moveLimit=aGame.mOptions.moveCount;
	if(moves.length==0) {
		this.mFinished=true;
		if(this.ballCount[1]>this.ballCount[2])
			this.mWinner=JocGame.PLAYER_A;
		else if(this.ballCount[1]<this.ballCount[2])
			this.mWinner=JocGame.PLAYER_B;
		else
			this.mWinner=JocGame.DRAW;
	} else if(moveLimit!==undefined && moves.length>moveLimit) {
		aGame.ArrayShuffle(moves);
		moves.sort(function(m1,m2) {
			m2.nextBoard.evaluation-m1.nextBoard.evaluation;
		});
		moves.splice(moveLimit,moves.length-moveLimit);
	}
	this.mMoves=moves;
}

Model.Board.GenerateAllMoves = function(aGame) {
	var moves=this.MakeFreeMoves(aGame);
	return moves;
}

Model.Board.Evaluate = function(aGame,aFinishOnly,aTopLevel) {
	this.mEvaluation = 0;
}

Model.Board.ApplyMove = function(aGame,move) {
	this.spApplyMove(aGame,move);
}

Model.Board.spApplyMove = function(aGame,move) {
	//console.log("spApplyMove",move)
	var $this=this;
	function UpdatePlayables(pos) {
		delete $this.playables[pos]; // position cannot be played anymore
		aGame.g.EachDirectionFlat(pos,function(pos1,dir) {
			if($this.board[pos1]) {
				var dir0,pdir;
				switch(dir) {
				case 4: dir0=7; pdir=10; break;
				case 5: dir0=6; pdir=9; break; 
				case 6: dir0=4; pdir=8; break;
				case 7: dir0=5; pdir=11; break;
				}
				var pos0=aGame.g.Graph[pos][dir0];
				if(pos0!==null && $this.board[pos0]>0 &&
						$this.board[aGame.g.Graph[pos1][dir0]])
					$this.playables[aGame.g.Graph[pos][pdir]]=true;
			}
		});		
	}
	switch(move.act) {
	case "+":
		this.board[move.pos]=move.clr;
		var h=aGame.g.Coord[move.pos][2];
		if(h>this.maxLayer)
			this.maxLayer=h;
		this.height[move.clr]+=h;
		this.ballCount[move.clr]++;

		// check 2x2 platform 
		UpdatePlayables(move.pos);
		break;
	case ">":
		if(move.down.length>0)
			this.playables[move.down[move.down.length-1]]=true;
		else
			this.playables[move.from]=true;
		var from=move.from;
		for(var i=0; i<move.down.length; i++) {
			var down=move.down[i];
			this.height[this.board[down]]--;
			this.board[from]=this.board[down];
			from=down;
		}
		this.board[from]=0;
		this.board[move.to]=move.clr;
		var h=aGame.g.Coord[move.to][2];
		this.height[move.clr]+=h;
		if(h>this.maxLayer)
			this.maxLayer=h;
		UpdatePlayables(move.to);
		break;
	}
}

Model.Board.IsValidMove = function(aGame,move) {
	return true;
}

Model.Board.ExtendMove = function(aGame,pos) {
	return {};
}	

Model.Board.GetSignature = function() {
	return this.zSign;
}	
