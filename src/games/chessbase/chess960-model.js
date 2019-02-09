
(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(8,8);
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,

//			zobrist: "old",
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
				},
				
				1: {
					name: 'ipawn-w',
					aspect: 'pawn',
					graph: this.cbInitialPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:8},{s:1,p:9},{s:1,p:10},{s:1,p:11},{s:1,p:12},{s:1,p:13},{s:1,p:14},{s:1,p:15}],
					epTarget: true,
				},
				
				2: {
					name: 'pawn-b',
					aspect: 'pawn',
					graph: this.cbPawnGraph(geometry,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
				},

				3: {
					name: 'ipawn-b',
					aspect: 'pawn',
					graph: this.cbInitialPawnGraph(geometry,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:48},{s:-1,p:49},{s:-1,p:50},{s:-1,p:51},{s:-1,p:52},{s:-1,p:53},{s:-1,p:54},{s:-1,p:55}],
					epTarget: true,
				},
				
				4: {
					name: 'knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:6},{s:-1,p:57},{s:-1,p:62}],
				},
				
				5: {
					name: 'bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:2},{s:1,p:5},{s:-1,p:58},{s:-1,p:61}],
				},

				6: {
					name: 'rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:7},{s:-1,p:56},{s:-1,p:63}],
					castle: true,
				},

				7: {
					name: 'queen',
					graph: this.cbQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:3},{s:-1,p:59}],
				},
				
				8: {
					name: 'king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:4},{s:-1,p:60}],
				},
				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==1)
					return [0];
				else if(piece.t==3)
					return [2];
				else if(piece.t==0 && geometry.R(move.t)==7)
					return [4,5,6,7];
				else if(piece.t==2 && geometry.R(move.t)==0)
					return [4,5,6,7];
				return [];
			},

			castle: {
				"1/0": {k:[2],r:[1,2,3],n:"O-O-O"},
				"2/0": {k:[2],r:[1,2,3],n:"O-O-O"},
				"3/0": {k:[2],r:[1,2,3],n:"O-O-O"},
				"4/0": {k:[3,2],r:[1,2,3],n:"O-O-O"},
				"5/0": {k:[4,3,2],r:[1,2,3],n:"O-O-O"},
				"6/0": {k:[5,4,3,2],r:[1,2,3],n:"O-O-O"},
				"2/1": {k:[2],r:[2,3],n:"O-O-O"},
				"3/1": {k:[2],r:[2,3],n:"O-O-O"},
				"4/1": {k:[3,2],r:[2,3],n:"O-O-O"},
				"5/1": {k:[4,3,2],r:[2,3],n:"O-O-O"},
				"6/1": {k:[5,4,3,2],r:[2,3],n:"O-O-O"},
				"3/2": {k:[2],r:[3],n:"O-O-O"},
				"4/2": {k:[3,2],r:[3],n:"O-O-O"},
				"5/2": {k:[4,3,2],r:[3],n:"O-O-O"},
				"6/2": {k:[5,4,3,2],r:[3],n:"O-O-O"},
				"4/3": {k:[3,2],r:[3],n:"O-O-O"},
				"5/3": {k:[4,3,2],r:[3],n:"O-O-O"},
				"6/3": {k:[5,4,3,2],r:[3],n:"O-O-O"},
				"5/4": {k:[4,3,2],r:[3],n:"O-O-O"},
				"6/4": {k:[5,4,3,2],r:[3],n:"O-O-O"},
				"6/5": {k:[5,4,3,2],r:[4,3],n:"O-O-O"},

				"1/7": {k:[2,3,4,5,6],r:[6,5],n:"O-O"},
				"2/7": {k:[3,4,5,6],r:[6,5],n:"O-O"},
				"3/7": {k:[4,5,6],r:[6,5],n:"O-O"},
				"4/7": {k:[5,6],r:[6,5],n:"O-O"},
				"5/7": {k:[6],r:[6,5],n:"O-O"},
				"6/7": {k:[6],r:[6,5],n:"O-O"},
				"1/6": {k:[2,3,4,5,6],r:[5],n:"O-O"},
				"2/6": {k:[3,4,5,6],r:[5],n:"O-O"},
				"3/6": {k:[4,5,6],r:[5],n:"O-O"},
				"4/6": {k:[5,6],r:[5],n:"O-O"},
				"5/6": {k:[6],r:[5],n:"O-O"},
				"1/5": {k:[2,3,4,5,6],r:[5],n:"O-O"},
				"2/5": {k:[3,4,5,6],r:[5],n:"O-O"},
				"3/5": {k:[4,5,6],r:[5],n:"O-O"},
				"4/5": {k:[5,6],r:[5],n:"O-O"},
				"1/4": {k:[2,3,4,5,6],r:[5],n:"O-O"},
				"2/4": {k:[3,4,5,6],r:[5],n:"O-O"},
				"3/4": {k:[4,5,6],r:[5],n:"O-O"},
				"1/3": {k:[2,3,4,5,6],r:[4,5],n:"O-O"},
				"2/3": {k:[3,4,5,6],r:[4,5],n:"O-O"},
				"1/2": {k:[2,3,4,5,6],r:[3,4,5],n:"O-O"},

				"57/56": {k:[58],r:[57,58,59],n:"O-O-O"},
				"58/56": {k:[58],r:[57,58,59],n:"O-O-O"},
				"59/56": {k:[58],r:[57,58,59],n:"O-O-O"},
				"60/56": {k:[59,58],r:[57,58,59],n:"O-O-O"},
				"61/56": {k:[60,59,58],r:[57,58,59],n:"O-O-O"},
				"62/56": {k:[61,60,59,58],r:[57,58,59],n:"O-O-O"},
				"58/57": {k:[58],r:[58,59],n:"O-O-O"},
				"59/57": {k:[58],r:[58,59],n:"O-O-O"},
				"60/57": {k:[59,58],r:[58,59],n:"O-O-O"},
				"61/57": {k:[60,59,58],r:[58,59],n:"O-O-O"},
				"62/57": {k:[61,60,59,58],r:[58,59],n:"O-O-O"},
				"59/58": {k:[58],r:[59],n:"O-O-O"},
				"60/58": {k:[59,58],r:[59],n:"O-O-O"},
				"61/58": {k:[60,59,58],r:[59],n:"O-O-O"},
				"62/58": {k:[61,60,59,58],r:[59],n:"O-O-O"},
				"60/59": {k:[59,58],r:[59],n:"O-O-O"},
				"61/59": {k:[60,59,58],r:[59],n:"O-O-O"},
				"62/59": {k:[61,60,59,58],r:[59],n:"O-O-O"},
				"61/60": {k:[60,59,58],r:[59],n:"O-O-O"},
				"62/60": {k:[61,60,59,58],r:[59],n:"O-O-O"},
				"62/61": {k:[61,60,59,58],r:[60,59],n:"O-O-O"},

				"57/63": {k:[58,59,60,61,62],r:[62,61],n:"O-O"},
				"58/63": {k:[59,60,61,62],r:[62,61],n:"O-O"},
				"59/63": {k:[60,61,62],r:[62,61],n:"O-O"},
				"60/63": {k:[61,62],r:[62,61],n:"O-O"},
				"61/63": {k:[62],r:[62,61],n:"O-O"},
				"62/63": {k:[62],r:[62,61],n:"O-O"},
				"57/62": {k:[58,59,60,61,62],r:[61],n:"O-O"},
				"58/62": {k:[59,60,61,62],r:[61],n:"O-O"},
				"59/62": {k:[60,61,62],r:[61],n:"O-O"},
				"60/62": {k:[61,62],r:[61],n:"O-O"},
				"61/62": {k:[62],r:[61],n:"O-O"},
				"57/61": {k:[58,59,60,61,62],r:[61],n:"O-O"},
				"58/61": {k:[59,60,61,62],r:[61],n:"O-O"},
				"59/61": {k:[60,61,62],r:[61],n:"O-O"},
				"60/61": {k:[61,62],r:[61],n:"O-O"},
				"57/60": {k:[58,59,60,61,62],r:[61],n:"O-O"},
				"58/60": {k:[59,60,61,62],r:[61],n:"O-O"},
				"59/60": {k:[60,61,62],r:[61],n:"O-O"},
				"57/59": {k:[58,59,60,61,62],r:[60,61],n:"O-O"},
				"58/59": {k:[59,60,61,62],r:[60,61],n:"O-O"},
				"57/58": {k:[58,59,60,61,62],r:[59,60,61],n:"O-O"},

			},
			
			evaluate: function(aGame,evalValues,material) {
				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				if(!white[0] && !white[1] && !white[4] && !white[5] && !white[6] && !white[7]) { // white king single
					if(!black[2] && !black[3] && !black[6] && !black[7] && (black[4]+black[5]<2 || black[5]<2)) {
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				if(!black[2] && !black[3] && !black[4] && !black[5] && !black[6] && !black[7]) { // black king single
					if(!white[0] && !white[1] && !white[6] && !white[7] && (white[4]+white[5]<2 || white[5]<2)) {
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				
				// check 50 moves without capture
				if(this.noCaptCount>=100) {
					this.mFinished=true;
					this.mWinner=JocGame.DRAW;					
				}
				
				// motivate pawns to reach the promotion line
				var distPromo=aGame.cbUseTypedArrays?new Int8Array(3):[0,0,0];
				var height=geometry.height;
				var pawns=material[1].byType[0],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(height-geometry.R(pawns[i].p)) {
						case 2: distPromo[0]++; break;
						case 3: distPromo[1]++; break;
						case 4: distPromo[2]++; break;
						}
				}
				pawns=material[-1].byType[2],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(geometry.R(pawns[i].p)) {
						case 1: distPromo[0]--; break;
						case 2: distPromo[1]--; break;
						case 3: distPromo[2]--; break;
						}
				}
				if(distPromo[0]!=0)
					evalValues['distPawnPromo1']=distPromo[0];
				if(distPromo[1]!=0)
					evalValues['distPawnPromo2']=distPromo[1];
				if(distPromo[2]!=0)
					evalValues['distPawnPromo3']=distPromo[2];
				
				// motivate knights and bishops to deploy early
				var minorPiecesMoved=0;
				for(var t=4;t<=5;t++)
					for(var s=1;s>=-1;s-=2) {
						var pieces=material[s].byType[t];
						if(pieces)
							for(var i=0;i<pieces.length;i++)
								if(pieces[i].m)
									minorPiecesMoved+=s;
					}
				if(minorPiecesMoved!=0) {
					evalValues['minorPiecesMoved']=minorPiecesMoved;
				}
			},
			
		};
	}
	
	var SuperModelBoardGenerateMoves=Model.Board.GenerateMoves;
	Model.Board.GenerateMoves = function(aGame) {
		if(this.setupState===undefined)  {
			this.mMoves=[{}];
			return;
		}
		if(this.setupState=="setup")  {
			this.mMoves=[];
			for(var i=0;i<960;i++)
				this.mMoves.push({setup:i});
			return;
		}
		SuperModelBoardGenerateMoves.apply(this,arguments); // call regular GenerateMoves method
	}
	
	var SuperModelBoardCopyFrom = Model.Board.CopyFrom;
	Model.Board.CopyFrom = function(aBoard) {
		SuperModelBoardCopyFrom.apply(this,arguments);
		this.setupState = aBoard.setupState;
	}

	var SuperModelBoardEvaluate = Model.Board.Evaluate;
	Model.Board.Evaluate = function(aGame) {
		if(this.setupState===undefined || this.setupState=="setup")
			return;
		SuperModelBoardEvaluate.apply(this,arguments);
	}

	var SuperModelBoardApplyMove=Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {
		if(this.setupState===undefined)
			this.setupState="setup";
		else if(this.setupState=="setup") {
			var $this=this;
			var pieces={ "1": {}, "-1": {} };
			this.pieces.forEach(function(piece,pIndex) {
				if(piece.t>=4) {
					$this.zSign^=aGame.bKey(piece);
//					$this.zSign=aGame.zobrist.update($this.zSign,"board",pIndex,piece.p);				
					$this.board[piece.p]=-1;
					piece.p=-1;
					var pType=aGame.g.pTypes[piece.t];
					if(pieces[piece.s][pType.abbrev]===undefined)
						pieces[piece.s][pType.abbrev]=[];
					pieces[piece.s][pType.abbrev].push(piece.i);
				}
			});
			var cols=aGame.c960Gen(move.setup);
			//console.info("cols",cols);
			//console.info("pieces",pieces);
			cols.forEach(function(type,colIndex) {
				["1","-1"].forEach(function(side) {
					var index=pieces[side][type].shift();
					var piece=$this.pieces[index];
					var pos=colIndex+(side=="-1"?56:0);
					//console.log("index",index,"to pos",pos)
					$this.board[pos]=index;
					piece.p=pos;
					$this.zSign^=aGame.bKey(piece);
//					$this.zSign=aGame.zobrist.update($this.zSign,"board",index,pos);	
					if(type=="K")
						$this.kings[piece.s]=pos;
				});
			});
			this.setupState="done";
		} else
			SuperModelBoardApplyMove.apply(this,arguments);
	}

	var SuperModelMoveToString = Model.Move.ToString;
	Model.Move.ToString = function() {
		if(this.f===undefined) {
			if(this.setup===undefined)
				return "--";
			else
				return "#"+this.setup;
		}
		return SuperModelMoveToString.apply(this,arguments);
	}
	
	var SuperModelBoardCompactMoveString = Model.Board.CompactMoveString; 
	Model.Board.CompactMoveString = function(aGame,aMove,allMoves) {
		if(typeof aMove.ToString!="function") // ensure proper move object, if necessary
			aMove=aGame.CreateMove(aMove);
		if(this.setupState===undefined || this.setupState=="setup")
			return aMove.ToString();
		return SuperModelBoardCompactMoveString.apply(this,arguments);
	}

	Model.Board.StaticGenerateMoves = function(aGame) {
		if(this.setupState=="setup")
			return [aGame.CreateMove({setup:Math.floor(Math.random()*960)})];
		return null;
	}

	
	Model.Game.c960Gen = function(seed) {
	    var cols = [], empty = [0, 1, 2, 3, 4, 5, 6, 7], fullSeed = 960,
	        b1, b2, nn;
	
	    if (seed === undefined) {
	        seed = Math.floor(Math.random() * 960);
	    } else {
	        seed %= 960;
	    }
	
	    function rand(range) {
	        fullSeed /= range;
	        var value = Math.floor(seed / fullSeed);
	        seed %= fullSeed;
	        return value;
	    }
	    function assign(piece, col) {
	        cols[col] = piece;
	        empty.splice(empty.indexOf(col), 1);
	    }
	    b1 = rand(4) * 2;
	    b2 = rand(4) * 2 + 1;
	    assign('B', b1);
	    assign('B', b2);
	    assign('Q', empty[rand(6)]);
	    nn = [ [0, 1], [0, 2], [0, 3], [0, 4], [1, 2],
	        [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]][rand(10)];
	    assign('N', empty[nn[1]]);
	    assign('N', empty[nn[0]]);
	    assign('R', empty[0]);
	    assign('K', empty[0]);
	    assign('R', empty[0]);
	    return cols;
	}
	
})();
