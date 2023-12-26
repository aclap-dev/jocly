/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(12,12);
	
	Model.Game.cbDefine = function() {
		
		var $this = this;
		
		/*
		 * Movement/capture graph for the prince
		 */
		function PrinceGraph(side) {
			var graph={};
			for(var pos=0;pos<geometry.boardSize;pos++) {
				graph[pos]=[];
				var forward=[]; // hold the pos line in front of the piece
				var pos1=geometry.Graph(pos,[0,side]);
				if(pos1!=null) {
					forward.push(pos1 | $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE); // capture and move allowed at first forward position
					pos1=geometry.Graph(pos1,[0,side]);
					if(pos1!=null)
						forward.push(pos1 | $this.cbConstants.FLAG_MOVE); // move to second forward only, no capture
					graph[pos].push($this.cbTypedArray(forward));
				}
			}
			return $this.cbMergeGraphs(geometry,
				$this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[-1,0],[1,0],[1,-1],[1,1],[0,-side]]), // direction other than forward
				graph // forward direction
			);
		}
		
		/*
		 * Movement/capture graph for the eagle
		 */
		function EagleGraph() {
			var flags = $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE;
			var graph={};
			for(var pos=0;pos<geometry.boardSize;pos++) {
				graph[pos]=[];
				[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(delta) { // loop on all 4 diagonals
					var pos1=geometry.Graph(pos,delta);
					if(pos1!=null) {
						for(var dir=0;dir<2;dir++) { // dir=0 for row, dir=1 for column
							var away=[] // hold the sliding line
							for(var n=1;n<11;n++) { // board is 12 cells long, so only consider max 11 cell displacements
								var delta2=[];
								delta2[dir]=delta[dir]*n;
								delta2[1-dir]=0; // delta2 is now only about moving orthogonally, away from the piece
								var pos2=geometry.Graph(pos1,delta2);
								if(pos2!=null) {
									if(n==1) // possible to slide at least 1 cell, make sure the diagonal cell is not occupied, but cannot move to this cell
										away.push(pos1 | $this.cbConstants.FLAG_STOP);
									away.push(pos2 | flags);
								}
							}
							if(away.length>0)
								graph[pos].push($this.cbTypedArray(away));
						}
					}					
				});
			}
			return $this.cbMergeGraphs(geometry,
			   $this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1]]),
			   graph
			);
		}
		
		return {
			
			geometry: geometry,

//			zobrist: "old",
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
				},
				
				1: {
					name: 'ipawn-w',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:28},{s:1,p:29},{s:1,p:30},{s:1,p:31},{s:1,p:32},{s:1,p:33},{s:1,p:34},{s:1,p:35}],
					epTarget: true,
					epCatch: true,
				},
				
				2: {
					name: 'pawn-b',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,

				},

				3: {
					name: 'ipawn-b',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:108},{s:-1,p:109},{s:-1,p:110},{s:-1,p:111},{s:-1,p:112},{s:-1,p:113},{s:-1,p:114},{s:-1,p:115},{s:-1,p:116},{s:-1,p:117},{s:-1,p:118},{s:-1,p:119}],
					epTarget: true,
					epCatch: true,
				},
				
				4: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.5,
					abbrev: 'N',
					initial: [{s:1,p:14},{s:1,p:21},{s:-1,p:122},{s:-1,p:129}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.5,
					abbrev: 'B',
					initial: [{s:1,p:15},{s:1,p:20},{s:-1,p:123},{s:-1,p:128}],
				},

				6: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:13},{s:1,p:22},{s:-1,p:121},{s:-1,p:130}],
					castle: true,
				},

				7: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:18},{s:-1,p:126}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:17},{s:-1,p:125}],
				},
				
				9: {
					name: 'cannon',
					aspect: 'fr-cannon2',
					graph: this.cbXQCannonGraph(geometry),
					value: 3.5,
					abbrev: 'C',
					initial: [{s:1,p:0},{s:1,p:11},{s:-1,p:132},{s:-1,p:143}],
				},
				
	            10: {
	            	name: 'elephant',
	            	aspect: 'fr-elephant',
	            	graph: this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]]),
	            	value: 2.5,
	            	abbrev: 'E',
	            	initial: [{s:1,p:12},{s:1,p:23},{s:-1,p:120},{s:-1,p:131}],
	            },				
			
			 11: {
	            	name: 'prince-w',
	            	aspect: 'fr-admiral',
	            	graph: PrinceGraph(1),
	            	value: 3,
	            	epTarget: true,
	            	abbrev: 'I',
                    initial: [{s:1,p:16},{s:1,p:19}],
	            },

			12: {
	            	name: 'prince-b',
	            	aspect: 'fr-admiral',
	            	graph: PrinceGraph(-1),
					epTarget: true,
	            	value: 3,
	            	abbrev: 'I',
	            	initial: [{s:-1,p:124},{s:-1,p:127}],
	            },


			13: {
	            	name: 'camel',
	            	aspect: 'fr-camel',
	            	graph: this.cbShortRangeGraph(geometry,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),
	            	value: 2,
	            	abbrev: 'M',
	            	initial: [{s:1,p:1},{s:1,p:10},{s:-1,p:133},{s:-1,p:142}],
	            },	

			14: {
	            	name: 'lion',
	            	aspect: 'fr-lion',
	            	graph: this.cbShortRangeGraph(geometry,[
						[-1,-1],[-1,1],[1,-1],[1,1],[1,0],[0,1],[-1,0],[0,-1],
						[-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],
						[1,-2],[2,-2],[2,-1],[2,0],[2,1],
						[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]]),
	            	value: 7.5,
	            	abbrev: 'L',
	            	initial: [{s:1,p:5},{s:-1,p:137}],
	            },	
			15: {
	            	name: 'eagle',
	            	aspect: 'fr-griffin',
	            	graph: EagleGraph(),
	            	value: 8,
	            	abbrev: 'A',
	            	initial: [{s:1,p:6},{s:-1,p:138}],
	            },	



				
			},

			promote: function(aGame,piece,move) {
				if(piece.t==1 && geometry.R(move.t)==11)
					return [7,14,15];
				else if(piece.t==3 && geometry.R(move.t)==0)
					return [7,14,15];
			else if(piece.t==11 && geometry.R(move.t)==11)
					return [7,14,15];
			else if(piece.t==12 && geometry.R(move.t)==0)
					return [7,14,15];
				return [];
			},

		};
	}

	/*
	 * Model.Board.GenerateMoves:
	 *   - handle setup phase 
	 *   - handle king special move: a kind of castle involving only the king
	 */
	var kingLongMoves={
		"1": {
			17: [ [15,16],[19,18],[41,29],[39,28],[43,30],[3,4,16],[27,16,28],[40,28,29],[42,29,30],[31,18,30],[7,18,6] ],
			5: [ [3,4],[7,8],[29,17],[27,16],[31,18],[15,4,6],[28,16,17],[30,17,18],[19,6,18] ],
		},
		"-1": {
			125: [ [127,126],[123,124],[101,113],[99,112],[103,114],[135,124,136],[111,112,124],[100,112,113],[102,113,114],[115,114,126],[139,126,138] ],
			137: [ [139,138],[135,136],[113,125],[115,126],[111,124],[127,126,138],[114,125,126],[112,124,125],[123,124,136] ],
		},
	}
	var SuperModelBoardGenerateMoves=Model.Board.GenerateMoves;
	Model.Board.GenerateMoves = function(aGame) {
		// first moves (white and black) are managed specifically to setup K,Q,E,L initial position 
		if(this.setupState===undefined)  {
			this.mMoves=[{}];
			return;
		}
		if(this.setupState=="setup")  {
			this.mMoves=[];
			for(var i=0;i<12;i++)
				this.mMoves.push({setup:i});
			return;
		}
		SuperModelBoardGenerateMoves.apply(this,arguments); // call regular GenerateMoves method
		// now consider special 2 cases king moves
		var kPiece=this.pieces[this.board[this.kings[this.mWho]]];
		if(!kPiece.m && !this.check) {
			var lMoves=kingLongMoves[this.mWho][kPiece.p];
			for(var i=0;i<lMoves.length;i++) {
				var lMove=lMoves[i];
				if(this.board[lMove[0]]>=0)
					continue;
				var canMove=true;
				var oppInCheck=false;
				for(var j=0;j<lMove.length;j++) {
					var pos=lMove[j];
					var tmpOut=this.board[pos];
					this.board[pos]=-1; // remove possible piece to prevent problems when quick-applying/unapplying
					var undo=this.cbQuickApply(aGame,{
						f: kPiece.p,
						t: pos,
					});
					var inCheck=this.cbGetAttackers(aGame,pos,this.mWho,true).length>0;
					if(!inCheck && j==0)
						oppInCheck=this.cbGetAttackers(aGame,this.kings[-this.mWho],-this.mWho,true).length>0;
					this.cbQuickUnapply(aGame,undo);
					this.board[pos]=tmpOut;
					this.cbIntegrity(aGame);
					if(inCheck) {
						canMove=false;
						break;
					}
				}
				if(canMove)
					this.mMoves.push({
						f: kPiece.p,
						t: lMove[0],
						c: null,
						ck: oppInCheck,
						a: 'K',
					});
			}
		}
	}
	
	/*
	 * Model.Board.CopyFrom overriding to copy setupState property
	 */
	var SuperModelBoardCopyFrom = Model.Board.CopyFrom;
	Model.Board.CopyFrom = function(aBoard) {
		SuperModelBoardCopyFrom.apply(this,arguments);
		this.setupState = aBoard.setupState;
	}
	
	/*
	 * Model.Board.Evaluate overriding: in setup phase, no evaluation 
	 */
	var SuperModelBoardEvaluate = Model.Board.Evaluate;
	Model.Board.Evaluate = function(aGame) {
		if(this.setupState===undefined || this.setupState=="setup")
			return;
		SuperModelBoardEvaluate.apply(this,arguments);
	}
	
	/*
	 * Model.Board.ApplyMove overriding: setup phase and king special move
	 */
	var SuperModelBoardApplyMove=Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {
		if(this.setupState===undefined)
			this.setupState="setup";
		else if(this.setupState=="setup") {
			var $this=this;
			// at this point, KQLE have arbitrary positions. remember those piece indexes so we can move them
			var starting={
				"1": { K: 17, Q: 18, L: 5, E: 6 },
				"-1": { K: 125, Q: 126, L: 137, E: 138 },
			}
			var indexes={ "1": {}, "-1": {}	};
			["1","-1"].forEach(function(side) {
				for(var p in starting[side])
					indexes[side][p]=$this.board[starting[side][p]];
			});
			// remove KQLE from the board
			[5,6,17,18,125,126,137,138].forEach(function(pos) {
				var pIndex=$this.board[pos];
				$this.zSign^=aGame.bKey($this.pieces[pIndex]);
				$this.board[pos]=-1;
				$this.pieces[pIndex].p=-1;
//				$this.zSign=aGame.zobrist.update($this.zSign,"board",pIndex,pos);
			});
			// setup KQLE positions according to the setup
			var setup=move.setup;
			var remaining={};
			if(setup/6<1) {
				this.board[17]=indexes[1].K;
				this.pieces[indexes[1].K].p=17;
				this.zSign^=aGame.bKey(this.pieces[indexes[1].K]);
//				$this.zSign=aGame.zobrist.update($this.zSign,"board",indexes[1].K,17);
				this.kings[1]=17;
				remaining[1]=[18,5,6];
				this.board[125]=indexes[-1].K;
				this.pieces[indexes[-1].K].p=125;
				this.zSign^=aGame.bKey(this.pieces[indexes[-1].K]);
//				$this.zSign=aGame.zobrist.update($this.zSign,"board",indexes[-1].K,125);
				this.kings[-1]=125;
				remaining[-1]=[126,137,138];
			} else {
				this.board[5]=indexes[1].K;
				this.pieces[indexes[1].K].p=5;
				this.zSign^=aGame.bKey(this.pieces[indexes[1].K]);
//				$this.zSign=aGame.zobrist.update($this.zSign,"board",indexes[1].K,5);
				this.kings[1]=5;
				remaining[1]=[17,18,6];
				this.board[137]=indexes[-1].K;
				this.pieces[indexes[-1].K].p=137;
				this.zSign^=aGame.bKey(this.pieces[indexes[-1].K]);
//				$this.zSign=aGame.zobrist.update($this.zSign,"board",indexes[-1].K,137);
				this.kings[-1]=137;
				remaining[-1]=[125,126,138];
			}
			setup%=6;
			var queen=Math.floor(setup/2);
			this.board[remaining[1][queen]]=indexes[1].Q;
			this.pieces[indexes[1].Q].p=remaining[1][queen];
			this.zSign^=aGame.bKey(this.pieces[indexes[1].Q]);
//			$this.zSign=aGame.zobrist.update($this.zSign,"board",indexes[1].Q,remaining[1][queen]);
			remaining[1].splice(queen,1);
			this.board[remaining[-1][queen]]=indexes[-1].Q;
			this.pieces[indexes[-1].Q].p=remaining[-1][queen];
			this.zSign^=aGame.bKey(this.pieces[indexes[-1].Q]);
//			$this.zSign=aGame.zobrist.update($this.zSign,"board",indexes[-1].Q,remaining[-1][queen]);				
			remaining[-1].splice(queen,1);
			var eagle,lion;
			setup%=2;
			if(setup==0) {
				eagle=0;
				lion=1;
			} else {
				eagle=1;
				lion=0;				
			}
			this.board[remaining[1][eagle]]=indexes[1].E;
			this.pieces[indexes[1].E].p=remaining[1][eagle];
			this.zSign^=aGame.bKey(this.pieces[indexes[1].E]);
//			$this.zSign=aGame.zobrist.update($this.zSign,"board",indexes[1].E,remaining[1][eagle]);
			this.board[remaining[1][lion]]=indexes[1].L;
			this.pieces[indexes[1].L].p=remaining[1][lion];
			this.zSign^=aGame.bKey(this.pieces[indexes[1].L]);
//			$this.zSign=aGame.zobrist.update($this.zSign,"board",indexes[1].L,remaining[1][lion]);

			this.board[remaining[-1][eagle]]=indexes[-1].E;
			this.pieces[indexes[-1].E].p=remaining[-1][eagle];
			this.zSign^=aGame.bKey(this.pieces[indexes[-1].E]);
//			$this.zSign=aGame.zobrist.update($this.zSign,"board",indexes[-1].E,remaining[-1][eagle]);
			this.board[remaining[-1][lion]]=indexes[-1].L;
			this.pieces[indexes[-1].L].p=remaining[-1][lion];
			this.zSign^=aGame.bKey(this.pieces[indexes[-1].L]);
//			$this.zSign=aGame.zobrist.update($this.zSign,"board",indexes[-1].L,remaining[1][lion]);		
			
			this.setupState="done";
		} else
			SuperModelBoardApplyMove.apply(this,arguments);
	}

	/*
	 * Model.Move.ToString overriding for setup notation
	 */
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
	
	/*
	 * Model.Board.CompactMoveString overriding to help reading PJN game transcripts
	 */
	var SuperModelBoardCompactMoveString = Model.Board.CompactMoveString; 
	Model.Board.CompactMoveString = function(aGame,aMove,allMoves) {
		if(typeof aMove.ToString!="function") // ensure proper move object, if necessary
			aMove=aGame.CreateMove(aMove);
		if(this.setupState===undefined || this.setupState=="setup")
			return aMove.ToString();
		return SuperModelBoardCompactMoveString.apply(this,arguments);
	}

	/*
	 * Model.Board.StaticGenerateMoves overriding to prevent using AI during the setup phase
	 */
	Model.Board.StaticGenerateMoves = function(aGame) {
		if(this.setupState=="setup")
			return [aGame.CreateMove({setup:Math.floor(Math.random()*12)})];
		return null;
	}
	
})();
