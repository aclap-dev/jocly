/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(11,10);
	
	function IIPawnGraph(aGame,side) {
		return aGame.cbMergeGraphs(geometry,
				aGame.cbLongRangeGraph(geometry,[[0,side]],null,aGame.cbConstants.FLAG_MOVE,3), 
				aGame.cbShortRangeGraph(geometry,[[-1,side],[1,side]],null,aGame.cbConstants.FLAG_CAPTURE)
			);
	}

	Model.Game.cbOnStaleMate = -1; // stalemate = last player wins
	
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
					epTarget: true,
				},
				
				4: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.4,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:9},{s:-1,p:100},{s:-1,p:108}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.3,
					abbrev: 'B',
					initial: [{s:1,p:2},{s:1,p:3},{s:-1,p:106},{s:-1,p:107}],
				},

				6: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:10},{s:-1,p:99},{s:-1,p:109}],
					castle: true,
				},

				7: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 8.2,
					abbrev: 'Q',
					initial: [{s:1,p:4},{s:-1,p:105}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:5},{s:-1,p:104}],
				},
								          
				9: {
	            	name: 'camel',
	            	aspect: 'fr-camel',
	            	graph: this.cbShortRangeGraph(geometry,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),
	            	value: 2.1,
	            	abbrev: 'M',
	            	initial: [{s:1,p:7},{s:1,p:8},{s:-1,p:101},{s:-1,p:102}],
	            },	

				10: {
	            	name: 'wildebeest',
	            	aspect: 'fr-dragon',
				graph: this.cbShortRangeGraph(geometry,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3],[-2,-1],[-2,1],[2,-1],[2,1],[1,2],[1,-2],[-1,2],[-1,-2]]),
	            	value: 4.7,
	            	abbrev: 'W',
	            	initial: [{s:1,p:6},{s:-1,p:103}],
	            },
	            
				11: {
					name: 'iipawn-w',
					aspect: 'fr-pawn',
					graph: IIPawnGraph(this,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:11},{s:1,p:12},{s:1,p:13},{s:1,p:14},{s:1,p:15},{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19},{s:1,p:20},{s:1,p:21}],
					epTarget: true,
				},

				12: {
					name: 'iipawn-b',
					aspect: 'fr-pawn',
					graph: IIPawnGraph(this,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:88},{s:-1,p:89},{s:-1,p:90},{s:-1,p:91},{s:-1,p:92},{s:-1,p:93},{s:-1,p:94},{s:-1,p:95},{s:-1,p:96},{s:-1,p:97},{s:-1,p:98}],
					epTarget: true,
				},
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==11 || piece.t==12) {
					//var dc=Math.abs(geometry.C(move.t)-geometry.C(move.f));
					var dr=Math.abs(geometry.R(move.t)-geometry.R(move.f));
					if(dr==1)
						return [piece.t==11?1:3];
					else
						return [piece.t==11?0:2];
				}
				if(piece.t==1)
					return [0];
				else if(piece.t==3)
					return [2];
				else if(piece.t==0 && geometry.R(move.t)==9)
					return [7,10];
				else if(piece.t==2 && geometry.R(move.t)==0)
					return [7,10];
				return [];
			},
			
			castle: {
				"5/0": {k:[4],r:[1,2,3,4,5],n:"O-O-O",extra:3},
				"5/10": {k:[6],r:[9,8,7,6,5],n:"O-O",extra:3},
				"104/99": {k:[103],r:[100,101,102,103,104],n:"O-O-O",extra:3},
				"104/109": {k:[105],r:[108,107,106,105,104],n:"O-O",extra:3},
			},
			
		};
	}
	
})();
