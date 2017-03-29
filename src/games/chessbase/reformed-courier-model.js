/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(12,8);
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: 1.05,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
				},
				
				1: {
					name: 'ipawn-w',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,1),
					value: 1.05,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:12},{s:1,p:13},{s:1,p:14},{s:1,p:15},{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19},{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:23}],
					epTarget: true,
				},
				
				2: {
					name: 'pawn-b',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,-1),
					value: 1.05,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
				},

				3: {
					name: 'ipawn-b',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,-1),
					value: 1.05,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:72},{s:-1,p:73},{s:-1,p:74},{s:-1,p:75},{s:-1,p:76},{s:-1,p:77},{s:-1,p:78},{s:-1,p:79},{s:-1,p:80},{s:-1,p:81},{s:-1,p:82},{s:-1,p:83}],
					epTarget: true,
				},
				
				4: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.7,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:10},{s:-1,p:85},{s:-1,p:94}],
				},
				
				5: {
					name: 'courier',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.3,
					abbrev: 'C',
					initial: [{s:1,p:3},{s:1,p:8},{s:-1,p:87},{s:-1,p:92}],
				},

				6: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:11},{s:-1,p:84},{s:-1,p:95}],
					castle: true,
				},

				7: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 8.3,
					abbrev: 'Q',
					initial: [{s:1,p:5},{s:-1,p:89}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:6},{s:-1,p:90}],
				},
				
			9: {
	            	name: 'archer',
	            	aspect: 'fr-elephant',
	            	graph: this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]]),
	            	value: 2.75,
	            	abbrev: 'A',
	            	initial: [{s:1,p:2},{s:1,p:9},{s:-1,p:86},{s:-1,p:93}],
	            },	

			10: {
	            	name: 'champion',
	            	aspect: 'fr-lighthouse',
	            	graph: this.cbShortRangeGraph(geometry,[
						[-1,-1],[-1,1],[1,-1],[1,1],[1,0],[0,1],[-1,0],[0,-1],
						[-2,0],[0,-2],[2,0],[0,2]]),
	            	value: 4.8,
	            	abbrev: 'Ch',
	            	initial: [{s:1,p:4},{s:-1,p:88}],
	            },	

			11: {
	            	name: 'paladin',
	            	aspect: 'fr-unicorn',
	            	graph: this.cbShortRangeGraph(geometry,[
						[-1,-1],[-1,1],[1,-1],[1,1],[1,0],[0,1],[-1,0],[0,-1],
						[-2,-1],[-1,-2],[1,-2],[2,-1],[2,1],[1,2],[-1,2],[-2,1]]),
	            	value: 6,
	            	abbrev: 'Pa',
	            	initial: [{s:1,p:7},{s:-1,p:91}],
	            },	


			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==1)
					return [0];
				else if(piece.t==3)
					return [2];
				else if(piece.t==0 && geometry.R(move.t)==7)
					return [4,5,6,7,9,10,11];
				else if(piece.t==2 && geometry.R(move.t)==0)
					return [4,5,6,7,9,10,11];
				return [];
			},
			
			castle: {
				"6/0": {k:[5,4,3,2],r:[1,2,3],n:"O-O-O"},
				"6/11": {k:[7,8,9,10],r:[10,9],n:"O-O"},
				"90/84": {k:[89,88,87,86],r:[85,86,87],n:"O-O-O"},
				"90/95": {k:[91,92,93,94],r:[94,93],n:"O-O"},
			},
		};
	}
	
})();