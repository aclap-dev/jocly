/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(9,9);
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
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
					initial: [{s:1,p:9},{s:1,p:10},{s:1,p:11},{s:1,p:12},{s:1,p:13},{s:1,p:14},{s:1,p:15},{s:1,p:16},{s:1,p:17}],
					epTarget: true,
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
					initial: [{s:-1,p:63},{s:-1,p:64},{s:-1,p:65},{s:-1,p:66},{s:-1,p:67},{s:-1,p:68},{s:-1,p:69},{s:-1,p:70},{s:-1,p:71}],
					epTarget: true,
				},
				
				4: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:7},{s:-1,p:73},{s:-1,p:79}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:2},{s:1,p:6},{s:-1,p:74},{s:-1,p:78}],
				},

				6: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:8},{s:-1,p:72},{s:-1,p:80}],
					castle: true,
				},

				7: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:5},{s:-1,p:75}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:4},{s:-1,p:76}],
				},
								
	            10: {
	            	name: 'minister',
	            	aspect: 'fr-cardinal',
					graph: this.cbMergeGraphs(geometry,
            			this.cbBishopGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 6,
	            	abbrev: 'M',
	            	initial: [{s:1,p:3},{s:-1,p:77}],
	            },				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==1)
					return [0];
				else if(piece.t==3)
					return [2];
				else if(piece.t==0 && geometry.R(move.t)==8)
					return [4,5,6,7,10];
				else if(piece.t==2 && geometry.R(move.t)==0)
					return [4,5,6,7,10];
				return [];
			},
			castle: {
				"4/0": {k:[3,2],r:[1,2,3],n:"O-O-O"},
				"4/8": {k:[5,6],r:[7,6,5],n:"O-O"},
				"76/72": {k:[75,74],r:[73,74,75],n:"O-O-O"},
				"76/80": {k:[77,78],r:[79,78,77],n:"O-O"},
			},
			
		};
	}

	var bishopPoss={ 2:[1,3], 6:[5,7], 74:[73,75], 78:[77,79] };
	
	var SuperModelBoardGenerateMoves=Model.Board.GenerateMoves;
	Model.Board.GenerateMoves = function(aGame) {
		SuperModelBoardGenerateMoves.apply(this,arguments); // call regular GenerateMoves method
		if(!this.bishopSwap || !this.bishopSwap[this.mWho]) { // consider bishop swap rule
			for(var pos in bishopPoss) {
				var pieceIndex=this.board[pos];
				if(pieceIndex>=0) {
					var piece=this.pieces[pieceIndex];
					if(piece.s==this.mWho && piece.m==false) { // piece of our side and not moved yet
						for(var i=0;i<bishopPoss[pos].length;i++) {
							var pos1=bishopPoss[pos][i];
							var pieceIndex1=this.board[pos1];
							if(pieceIndex1>=0) {
								var piece1=this.pieces[pieceIndex1];
								if(piece1.m==false) { // piece to swap bishop with has not moved yet
									this.board[pos1]=pieceIndex;
									this.board[pos]=pieceIndex1;
									this.pieces[pieceIndex].p=pos;
									this.pieces[pieceIndex1].p=pos1;									
									var oppInCheck=this.cbGetAttackers(aGame,this.kings[-this.mWho],-this.mWho,true).length>0;
									this.board[pos]=pieceIndex;
									this.board[pos1]=pieceIndex1;
									this.pieces[pieceIndex1].p=pos1;
									this.pieces[pieceIndex].p=pos;						
									this.mMoves.push({
										f: piece.p,
										t: piece1.p,
										c: null,
										ck: oppInCheck,
										a: 'B',
									});
								}
							}
						}
					}
				}
			}
		}
	}
	
	var SuperModelBoardCopyFrom = Model.Board.CopyFrom;
	Model.Board.CopyFrom = function(aBoard) {
		SuperModelBoardCopyFrom.apply(this,arguments);
		if(aBoard.bishopSwap!==undefined)
			this.bishopSwap = {
				"1": aBoard.bishopSwap["1"],
				"-1": aBoard.bishopSwap["-1"],
			}
	}

	var SuperModelBoardApplyMove=Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {
		if(move.f in bishopPoss) {
			var piece=this.pieces[this.board[move.f]];
			if(piece.m==false) {
				var pieceIndex1=this.board[move.t];
				if(pieceIndex1>=0) {
					var piece1=this.pieces[pieceIndex1];
					if(piece1.s==this.mWho && piece1.m==false) { // this is a bishop swap: special apply handler
						this.zSign=aGame.zobrist.update(this.zSign,"board",piece.i,piece.p);
						this.zSign=aGame.zobrist.update(this.zSign,"board",pieceIndex1,piece1.p);
						this.zSign=aGame.zobrist.update(this.zSign,"board",piece.i,piece1.p);
						this.zSign=aGame.zobrist.update(this.zSign,"board",pieceIndex1,piece.p);
						this.board[move.f]=pieceIndex1;
						piece1.p=move.f;
						this.board[move.t]=piece.i;
						piece.p=move.t;
						this.check=!!move.ck;
						if(!this.bishopSwap)
							this.bishopSwap={};
						this.bishopSwap[this.mWho]=true; // make sure we don't swap twice
						return;
					}
				}
			}
		}
		SuperModelBoardApplyMove.apply(this,arguments);
	}
	
})();