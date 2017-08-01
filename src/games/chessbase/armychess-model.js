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
					initial: [{s:1,p:8},{s:1,p:9},{s:1,p:14},{s:1,p:15}],
					epTarget: true,
				},
				
				2: {
					name: 'soilder',
					aspect: 'fr-admiral',
					graph: this.cbKingGraph(geometry),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:40},{s:-1,p:41},{s:-1,p:42},{s:-1,p:43},{s:-1,p:44},{s:-1,p:45},{s:-1,p:46},{s:-1,p:47},{s:-1,p:48},{s:-1,p:49},{s:-1,p:50},{s:-1,p:51},{s:-1,p:52},{s:-1,p:53},{s:-1,p:54},{s:-1,p:55},{s:-1,p:56},{s:-1,p:57},{s:-1,p:58},{s:-1,p:59},{s:-1,p:61},{s:-1,p:62},{s:-1,p:63},],
					epCatch: true,
				},

				4: {
					name: 'knight',
					aspect: 'fr-lion',
					graph: this.cbShortRangeGraph(geometry,[
						[-1,-1],[-1,1],[1,-1],[1,1],[1,0],[0,1],[-1,0],[0,-1],
						[-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],
						[1,-2],[2,-2],[2,-1],[2,0],[2,1],
						[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]]),
					value: 6,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:6}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9,
					abbrev: 'B',
					initial: [{s:1,p:2},{s:1,p:5}],
				},

				6: {
					name: 'rook',
					aspect: 'fr-lighthouse',
					graph: this.cbMergeGraphs(geometry, 
			this.cbShortRangeGraph(geometry,[
	            			 [-2,-2],[-2,0],[-2,2],[0,2],[2,2],[2,0],[2,-2],[0,-2],
	            			 [-3,-3],[-3,0],[-3,3],[0,3],[3,3],[3,0],[3,-3],[0,-3]
	            			 ]),
			this.cbRookGraph(geometry)),
					value: 12,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:7}],
					castle: true,
				},

				7: {
	            	name: 'amazon',
	            	aspect: 'fr-amazon',
					graph: this.cbMergeGraphs(geometry,
            			this.cbQueenGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 12,
	            	abbrev: 'A',
	            	initial: [{s:1,p:3}],
	            },	
				
				3: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:4},{s:-1,p:60}],
				},
				8: {
	            	name: 'emperor',
	            	aspect: 'fr-crowned-rook',
					graph: this.cbMergeGraphs(geometry,
            			this.cbQueenGraph(geometry),
						this.cbXQCannonGraph(geometry),
						this.cbLongRangeGraph(geometry,[[1,-1],[-1,-1],[-1,1],[1,1]],null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE),
						this.cbShortRangeGraph(geometry,[
							[-2,-2],[-2,0],[-2,2],[0,2],[2,2],[2,0],[2,-2],[0,-2],
	            			 [-3,-3],[-3,0],[-3,3],[0,3],[3,3],[3,0],[3,-3],[0,-3]]),
						this.cbKnightGraph(geometry)),
	            	value: 20,
	            	abbrev: 'EM',
				},
				9: {
					name: 'horse',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.9,
					abbrev: 'HR',
					initial: [{s:1,p:10},{s:1,p:11},{s:1,p:12},{s:1,p:13}],
				},

				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==1)
					return [0];
				else if(piece.t==0 && geometry.R(move.t)==7)
					return [4,5,6,7,8];
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
