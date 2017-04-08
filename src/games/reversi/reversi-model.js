/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

(function() {
	
	var USE_TYPED_ARRAYS = typeof Int8Array != "undefined", ArrayCreate, ArrayClone;
	
	if(USE_TYPED_ARRAYS) {
		ArrayCreate = function(size) {
			return new Int8Array(size);
		}
		ArrayClone = function(array) {
			var tArray=new Int8Array(array.length);
			tArray.set(array);
			return tArray;			
		}
	} else {
		ArrayCreate = function(size) {
			var arr=[];
			for(var i=0;i<size;i++)
				arr.push(0);
			return arr;
		}
		ArrayClone = function(array) {
			var arr=[];
			var arrLength=array.length;
			for(var i=0;i<arrLength;i++)
				arr.push(array[i]);
			return arr;
		}		
	}
		
	Model.Game.isAlive = function(r,c){
		return this.POS(c,r) in this.g.confine;
	}
	
	Model.Game.C = function(pos) {
		return pos%this.mOptions.width;
	}

	Model.Game.R = function(pos) {
		return Math.floor(pos/this.mOptions.width);
	}

	Model.Game.RC = function(pos) {
		return {
			r: Math.floor(pos/this.mOptions.width),
			c: pos%this.mOptions.width,
		}
	}
	
	Model.Game.POS = function(c,r) {
		return r*this.mOptions.width+c;
	}
	
	Model.Game.STR2POS = function(key) {
		var m=/^(\d+):(\d+)$/.exec(key);
		if(m) {
			var r=parseInt(m[1]);
			var c=parseInt(m[2]);
			return this.POS(c,r);
		}
		return null;
	}

	Model.Game.InitGame = function() {
		var NBCOLS=this.NBCOLS=this.mOptions.width;
		var NBROWS=this.NBROWS=this.mOptions.height;
		
		this.g.confine={};
		
		this.g.totalCount=NBROWS*NBCOLS;
		
		for(var r=0;r<NBROWS;r++)
			for(var c=0;c<NBCOLS;c++)
				this.g.confine[this.POS(c,r)]=1;
		
		if(this.mOptions.deadCells)
			for(var key in this.mOptions.deadCells) {
				var pos=this.STR2POS(key);
				if(pos!=null) {
					this.g.totalCount--;
					delete this.g.confine[pos];
				}
			}
		
		this.g.dirDeltaRC=[[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1]];
		
		this.g.Graph={};
		for(var r=0;r<NBROWS;r++) 
			for(var c=0;c<NBCOLS;c++) {
				var pos=this.POS(c,r);
				if(!(pos in this.g.confine))
					continue;
				var dirs=ArrayCreate(this.g.dirDeltaRC.length);
				for(var i=0;i<this.g.dirDeltaRC.length;i++) {
					var d=this.g.dirDeltaRC[i];
					var r1=r+d[0];
					var c1=c+d[1];
					var pos1=r1*NBCOLS+c1;
					if(r1>=0 && c1>=0 && r1<NBROWS && c1<NBCOLS && (pos1 in this.g.confine))
						dirs[i]=pos1;
					else
						dirs[i]=-1;
				}
				this.g.Graph[pos]=dirs;
			}
		
		this.g.corners={};
		for(var pos in this.g.confine) {
			var ngb=0;
			for(var d=0;d<8;d++) {
				var pos1=this.g.Graph[pos][d];
				if(pos1<0)
					ngb|=1<<d;
			}
			if((ngb&0xf)==0xf || (ngb&0x1e)==0x1e || (ngb&0x3c)==0x3c || (ngb&0x78)==0x78 ||
				(ngb&0xf0)==0xf0 || (ngb&0xe1)==0xe1 || (ngb&0xc3)==0xc3 || (ngb&0x87)==0x87)
				this.g.corners[pos]=1;
		}
		
		this.g.borders={};
		for(var pos in this.g.confine) {
			if(pos in this.g.corners)
				continue;
			var ngb=0;
			for(var d=0;d<8;d++) {
				var pos1=this.g.Graph[pos][d];
				if(pos1<0)
					ngb|=1<<d;
			}
			if((ngb&0x7)==0x7 || (ngb&0xe)==0xe || (ngb&0x1c)==0x1c || (ngb&0x38)==0x38 ||
				(ngb&0x70)==0x70 || (ngb&0xe0)==0xe0 || (ngb&0xc1)==0xc1 || (ngb&0x83)==0x83)
				this.g.borders[pos]=1;
		}
		
		this.zobrist=new JocGame.Zobrist({
			board: {
				type: "array",
				size: NBCOLS*NBROWS,
				values: ["1","-1"],
			}
		});
	}
	
	Model.Move.Init = function(args) {
		this.row=args.row;
		this.col=args.col;
		this.pass=args.pass;
	}
	
	Model.Move.CopyFrom=function(aMove) {
		this.row=aMove.row;
		this.col=aMove.col;
		this.pass=aMove.pass;
	}
	
	Model.Move.ToString=function() {
		if(this.pass)
			return "PASS";
		return "ABCDEFGH".charAt(this.col)+(this.row+1);
	}
	
	Model.Move.Equals=function(move) {
		if(move.pass && this.pass)
			return true;
		return this.row==move.row && this.col==move.col;
	}
	
	Model.Board.Init = function(aGame) {
		this.zSign=0;
	}

	Model.Board.InitialPosition = function(aGame) {
		console.info("InitialPosition");
		this.board=ArrayCreate(aGame.mOptions.width*aGame.mOptions.height);
		this.counts=[0,0];
		this.freeClose={};
		this.passes=0;
		this.lastMove=null;
		var $this=this;
		[1,-1].forEach(function(side) {
			var side01=(1-side)/2;
			aGame.mOptions.initial[side].forEach(function(strpos) {
				$this.counts[side01]++;
				var pos=aGame.STR2POS(strpos);
				$this.board[pos]=side;
				delete $this.freeClose[pos];
				for(var d=0;d<8;d++) {
					var pos1=aGame.g.Graph[pos][d];
					if(pos1<0) 
						continue;
					if(!$this.board[pos1])
						$this.freeClose[pos1]=1;
				}
				$this.zSign=aGame.zobrist.update($this.zSign,"board",side,pos);
			});
		});
		this.FindMoves(aGame);
		this.stable={};
		for(var pos in aGame,aGame.g.corners)
			this.stable[pos]=3;
		this.aboutStable={};
		this.aboutBorder={};
		this.rvUpdateStable(aGame,aGame.g.corners);
		this.rvUpdateAboutBorder(aGame);
	}
	
	Model.Board.CopyFrom=function(aBoard) {
		
		this.mWho=aBoard.mWho;
		this.zSign=aBoard.zSign;
		this.board=ArrayClone(aBoard.board);
		this.counts=[aBoard.counts[0],aBoard.counts[1]];
		this.freeClose={};
		for(var pos in aBoard.freeClose)
			this.freeClose[pos]=1;
		this.passes=aBoard.passes;
		this.lastMove=null;
		if(aBoard.lastMove)
			this.lastMove={
				row: aBoard.lastMove.row,
				col: aBoard.lastMove.col,
			}
		else
			this.lastMove=null;
		this.movePoss={
			"1": ArrayClone(aBoard.movePoss[1]),
			"-1": ArrayClone(aBoard.movePoss[-1]),
		}
		/*
		this.freeStable={};
		for(var pos in aBoard.freeStable)
			this.freeStable[pos]=aBoard.freeStable[pos];
		*/
		/*
		this.stable={};
		for(var pos in aBoard.stable)
			this.stable[pos]=aBoard.stable[pos];
		*/
		this.stable=aBoard.stable; // !!! stable object member is shared with parent boards, so it must never be modified, but replaced instead
		this.aboutStable=aBoard.aboutStable; // !!! idem for aboutStable
		this.aboutBorder=aBoard.aboutBorder; // !!! idem for aboutBorder
	}

	Model.Board.GenerateMoves=function(aGame) {
		this.mMoves = [];
		for(var i=0;i<this.movePoss[this.mWho].length;i++) {
			var pos=this.movePoss[this.mWho][i];
			var rc=aGame.RC(pos);
			this.PushMove(aGame,{row: rc.r, col: rc.c });
		}
		if(this.mMoves.length==0)
			this.PushMove(aGame,{pass: true, row: -1, col: -1 });
		//console.log("GenerateMoves",this.mWho,this.mMoves.length,"freeClose",this.freeClose,"moves",this.mMoves);
	}

	Model.Board.FindMoves=function(aGame) {
		this.movePoss={
			"1": [],
			"-1": [],
		};
		var graph=aGame.g.Graph;
		for(var pos in this.freeClose) {
			//if(pos==34)
			//	debugger;
			var posGraph=graph[pos];
			var isMove=0;
			for(var d=0;d<8;d++) {
				var pos1=posGraph[d];
				var captured=false;
				if(pos1>=0) {
					var who=-this.board[pos1];
					if(who) {
						var sideBit=who==1?1:2;
						if(!(isMove&sideBit)) {
							captured=true;
							pos1=graph[pos1][d];
							while(this.board[pos1]==-who)
								pos1=graph[pos1][d];
							if(pos1>=0 && this.board[pos1]==who)
								isMove|=sideBit;
							if(isMove==3)
								break;
						}
					}
				}
			}
			if(isMove & 1)
				this.movePoss[1].push(pos);
			if(isMove & 2)
				this.movePoss[-1].push(pos);
		}
		//console.info("FindMoves",this.movePoss);
	}
	
	Model.Board.ApplyMove=function(aGame,move) {
		this.lastMove=null;
		if(move.pass) {
			this.passes++;
			return;
		}
		this.lastMove={
			row: move.row, 
			col: move.col
		};
		this.passes=0;
		var side01=(1-this.mWho)/2;
		var sideBit=1<<side01;
		this.counts[side01]++;
		var pos=aGame.POS(move.col,move.row);
		var graph=aGame.g.Graph;
		var posGraph=graph[pos];
		this.board[pos]=this.mWho;
		this.zSign=aGame.zobrist.update(this.zSign,"board",this.mWho,pos);
		delete this.freeClose[pos];
		var stableChange=false;
		/*
		if((this.freeStable[pos] || 0) & (1<<side01)) {
			delete this.freeStable[pos];
			stableChange=true;
			this.stable[pos]=this.mWho;
		}
		*/
		var stableSeeds={};
		if((this.stable[pos] || 0) & sideBit) {
			stableChange=true;
			stableSeeds[pos]=1;
		}
		for(var d=0;d<8;d++) {
			var pos1=posGraph[d];
			if(pos1>=0 && this.board[pos1]==0) {
				this.freeClose[pos1]=1;
				//if(stable)
				//	stableCandidates[pos1]=1;
			}
			var captured=[];
			while(pos1>=0 && this.board[pos1]==-this.mWho) {
				captured.push(pos1);
				pos1=graph[pos1][d];
			}
			if(pos1>=0 && captured.length>0 && this.board[pos1]==this.mWho) {
				for(var i=captured.length-1;i>=0;i--) {
					var pos2=captured[i];
					this.zSign=aGame.zobrist.update(this.zSign,"board",-this.mWho,pos2);
					this.zSign=aGame.zobrist.update(this.zSign,"board",this.mWho,pos2);
					this.board[pos2]=this.mWho;
					this.counts[side01]++;
					this.counts[1-side01]--;
					if((this.stable[pos2] || 0) & sideBit) {
						stableChange=true;
						stableSeeds[pos2]=1;
					}
				}
			}
		}
		if(stableChange)
			this.rvUpdateStable(aGame,stableSeeds);
		if(pos in aGame.g.borders)
			this.rvUpdateAboutBorder(aGame);			
		this.FindMoves(aGame);
	}
	
	Model.Board.rvUpdateStable=function(aGame,seeds) {
		var stable=this.stable;
		this.stable={};
		for(var pos in stable)
			this.stable[pos]=stable[pos];
		var looping=true;
		var sideBit=this.mWho==1?1:2;
		var graph=aGame.g.Graph;
		while(looping) {
			looping=false;
			var seeds2={};
			for(var pos in seeds) {
				var posGraph=graph[pos];
				for(var d=0;d<8;d++) {
					var pos1=posGraph[d];
					if(pos1>=0 && !((this.stable[pos1] || 0) & sideBit))
						seeds2[pos1]=1;
				}
			}
			var seeds={};
			for(var pos in seeds2) {
				var posGraph=graph[pos];
				var ngb=0;
				for(var d=0;d<8;d++) {
					var pos1=posGraph[d];
					if(pos1<0 || (this.board[pos1]==this.mWho && (this.stable[pos1] || 0) & sideBit))
						ngb|=1<<d;
				}
				if((ngb&0xf)==0xf || (ngb&0x1e)==0x1e || (ngb&0x3c)==0x3c || (ngb&0x78)==0x78 ||
					(ngb&0xf0)==0xf0 || (ngb&0xe1)==0xe1 || (ngb&0xc3)==0xc3 || (ngb&0x87)==0x87) {
					this.stable[pos] = (this.stable[pos] || 0) | sideBit;
					looping=true;
					seeds[pos]=1;
				}
			}
		}
		this.aboutStable={};
		for(var pos in this.stable) {
			if(this.board[pos])
				continue;
			var posGraph=graph[pos];
			for(var d=0;d<8;d++) {
				var pos1=posGraph[d];
				if(pos1>=0 && !(pos1 in this.stable))
					this.aboutStable[pos1] = (this.aboutStable[pos1] || 0) | this.stable[pos];
			}
		}
		//console.info("stable",this.stable,"aboutStable",this.aboutStable);
	}

	Model.Board.rvUpdateAboutBorder=function(aGame) {
		this.aboutBorder={};
		var graph=aGame.g.Graph;
		var borders=aGame.g.borders;
		for(var pos in borders) {
			if(this.board[pos])
				continue;
			var posGraph=graph[pos];
			for(var d=0;d<8;d++) {
				var pos1=posGraph[d];
				if(pos1>=0 && !(pos1 in this.stable) && !(pos1 in this.aboutStable) && !(pos1 in borders))
					this.aboutBorder[pos1] = 1;
			}
		}
	}
	
	Model.Board.Evaluate=function(aGame) {
		var debug=arguments[3]=="debug";
		this.mEvaluation=0;
		var NBCOLS=aGame.mOptions.width;
		var NBROWS=aGame.mOptions.height;
		if(this.passes==2 || this.counts[0]+this.counts[1]==aGame.g.totalCount || this.counts[0]==0 || this.counts[1]==0) {
			this.mFinished=true;
			if(this.counts[0]>this.counts[1])
				this.mWinner=JocGame.PLAYER_A;
			else if(this.counts[0]<this.counts[1])
				this.mWinner=JocGame.PLAYER_B;
			else
				this.mWinner=JocGame.DRAW;
			return;
		}

		var evParams=aGame.mOptions.levelOptions;
		var evalValues={};

		var stableCount={
			'1': 0,
			'-1': 0,
		};
		var aboutStableCount={
			'1': 0,
			'-1': 0,
		};
		var aboutStableBorderCount={
			'1': 0,
			'-1': 0,
		};
		var borderCount={
			'1': 0,
			'-1': 0,
		};
		var confine=aGame.g.confine;
		var borders=aGame.g.borders;
		for(var pos in confine) {
			var who=this.board[pos];
			if(!who)
				continue;
			var sideBit=who==1?1:2;
			var sideBitInv=who==1?2:1;
			if((this.stable[pos] || 0) & sideBit)
				stableCount[who]++;
			else if((this.aboutStable[pos] || 0) & sideBitInv) {
				if(pos in borders)
					aboutStableBorderCount[who]++;
				else
					aboutStableCount[who]++;
			} else if(pos in borders)
				borderCount[who]++;
		}
		
		evalValues.stable=(stableCount[1]-stableCount[-1]);

		evalValues.aboutStable=(aboutStableCount[1]-aboutStableCount[-1]);

		evalValues.aboutStableBorder=(aboutStableBorderCount[1]-aboutStableBorderCount[-1]);

		evalValues.border=(borderCount[1]-borderCount[-1]);

		evalValues.count=(this.counts[0]-this.counts[1]);

		evalValues.mobility=(this.movePoss[1].length-this.movePoss[-1].length)/(this.movePoss[1].length+this.movePoss[-1].length);
		
		for(var name in evalValues) {
			var value=evalValues[name];
			var factor=evParams[name+'Factor'] || 0;
			var weighted=value*factor;
			if(debug)
				console.log(name,"=",value,"*",factor,"=>",weighted);
			this.mEvaluation+=weighted;
		}
		if(debug) {
			console.log("Evaluation",this.mEvaluation);
		}
	}

	Model.Board.GetSignature = function() {
		return this.zSign;
	}	
	
})();
