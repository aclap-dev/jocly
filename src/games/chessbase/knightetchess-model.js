/*
 * Copyright(c) 2013-2017 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(8,8);
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'fr-knight',
					graph: this.cbMergeGraphs(geometry,
            			this.cbPawnGraph(geometry,1),
						this.cbKnightGraph(geometry)),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: false,
				},
				
				1: {
					name: 'ipawn-w',
					aspect: 'fr-knight',
					graph: this.cbMergeGraphs(geometry,
            			this.cbInitialPawnGraph(geometry,1),
						this.cbKnightGraph(geometry)),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:8},{s:1,p:9},{s:1,p:10},{s:1,p:11},{s:1,p:12},{s:1,p:13},{s:1,p:14},{s:1,p:15}],
					epTarget: false,
				},
				
				2: {
					name: 'pawn-b',
					aspect: 'fr-knight',
					graph: this.cbMergeGraphs(geometry,
            			this.cbPawnGraph(geometry,-1),
						this.cbKnightGraph(geometry)),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: false,
				},

				3: {
					name: 'ipawn-b',
					aspect: 'fr-knight',
					graph: this.cbMergeGraphs(geometry,
            			this.cbInitialPawnGraph(geometry,-1),
						this.cbKnightGraph(geometry)),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:48},{s:-1,p:49},{s:-1,p:50},{s:-1,p:51},{s:-1,p:52},{s:-1,p:53},{s:-1,p:54},{s:-1,p:55}],
					epTarget: false,
				},
				
				4: {
					name: 'unicorn',
					aspect: 'fr-unicorn',
					graph: this.cbMergeGraphs(geometry,
							this.cbLongRangeGraph(geometry,[[2,-1],[2,1],[-2,-1],[-2,1],[-1,2],[-1,-2],[1,2],[1,-2]]),
							 this.cbKingGraph(geometry),
							 ),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:6},{s:-1,p:57},{s:-1,p:62}],
				},
				
				5: {
					name: 'cardinal',
					aspect: 'fr-cardinal',
					graph: this.cbMergeGraphs(geometry,
            			this.cbBishopGraph(geometry),
						this.cbKnightGraph(geometry)),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:2},{s:1,p:5},{s:-1,p:58},{s:-1,p:61}],
				},

				6: {
					name: 'chancellor',
					aspect: 'fr-marshall',
					graph: this.cbMergeGraphs(geometry,
            			this.cbRookGraph(geometry),
						this.cbKnightGraph(geometry)),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:7},{s:-1,p:56},{s:-1,p:63}],
					castle: true,
				},

				7: {
	            	name: 'commander',
	            	aspect: 'fr-amazon',
					graph: this.cbMergeGraphs(geometry,
            			this.cbQueenGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 8,
	            	abbrev: 'A',
	            	initial: [{s:1,p:3},{s:-1,p:59}],
	            },	
				
				8: {
					name: 'king',
					aspect: 'fr-king',
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
				"4/0": {k:[3,2],r:[1,2,3],n:"O-O-O"},
				"4/7": {k:[5,6],r:[6,5],n:"O-O"},
				"60/56": {k:[59,58],r:[57,58,59],n:"O-O-O"},
				"60/63": {k:[61,62],r:[62,61],n:"O-O"},
			},
			
		};
	}
			
})();
