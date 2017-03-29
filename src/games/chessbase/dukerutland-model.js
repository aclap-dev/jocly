/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(14,10);
	
	function IIPawnGraph(aGame,side) {
		return aGame.cbMergeGraphs(geometry,
				aGame.cbLongRangeGraph(geometry,[[0,side]],null,aGame.cbConstants.FLAG_MOVE,3), 
				aGame.cbShortRangeGraph(geometry,[[-1,side],[1,side]],null,aGame.cbConstants.FLAG_CAPTURE)
			);
	}

	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: 0.7,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
				},
				
				1: {
					name: 'ipawn-w',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,1),
					value: 0.7,
					abbrev: '',
					fenAbbrev: 'P',
					epTarget: true,
				},
				
				2: {
					name: 'pawn-b',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,-1),
					value: 0.7,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
				},

				3: {
					name: 'ipawn-b',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,-1),
					value: 0.7,
					abbrev: '',
					fenAbbrev: 'P',
					epTarget: true,
				},
				
				4: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.2,
					abbrev: 'N',
					initial: [{s:1,p:2},{s:1,p:3},{s:1,p:11},{s:-1,p:128},{s:-1,p:129},{s:-1,p:137}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.3,
					abbrev: 'B',
					initial: [{s:1,p:4},{s:1,p:5},{s:1,p:9},{s:1,p:10},{s:-1,p:130},{s:-1,p:131},{s:-1,p:135},{s:-1,p:136}],
				},

				6: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:13},{s:-1,p:126},{s:-1,p:139}],
					},

				7: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 8.1,
					abbrev: 'Q',
					initial: [{s:1,p:6},{s:-1,p:132}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:7},{s:-1,p:133}],
				},
								          
				9: {
					name: 'concubine',
					aspect: 'fr-marshall',								
					graph: this.cbMergeGraphs(geometry,
            			this.cbRookGraph(geometry),
						this.cbKnightGraph(geometry)),
					value: 7.1,
					abbrev: 'C',
					initial: [{s:1,p:8},{s:-1,p:134}],
				},

				10: {
	            	name: 'crowned-rook',
	            	aspect: 'fr-crowned-rook',
					graph: this.cbMergeGraphs(geometry,
            			this.cbRookGraph(geometry),
						this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,1],[1,-1]])),  
	            	value: 6.2,
	            	abbrev: 'CR',
	            	initial: [{s:1,p:1},{s:1,p:12},{s:-1,p:127},{s:-1,p:138}],
	            },
	            
				11: {
					name: 'iipawn-w',
					aspect: 'fr-pawn',
					graph: IIPawnGraph(this,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:14},{s:1,p:15},{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19},{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:23},{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27}],
					epTarget: true,
				},

				12: {
					name: 'iipawn-b',
					aspect: 'fr-pawn',
					graph: IIPawnGraph(this,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:112},{s:-1,p:113},{s:-1,p:114},{s:-1,p:115},{s:-1,p:116},{s:-1,p:117},{s:-1,p:118},{s:-1,p:119},{s:-1,p:120},{s:-1,p:121},{s:-1,p:122},{s:-1,p:123},{s:-1,p:124},{s:-1,p:125}],
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
					return [4,5,6,7,9,10];
				else if(piece.t==2 && geometry.R(move.t)==0)
					return [4,5,6,7,9,10];
				return [];
			},
			
						
		};
	}

	
	
	
})();