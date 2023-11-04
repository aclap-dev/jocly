
(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(10,10);
	
	Model.Game.cbDefine = function() {
		
		var elephantGraph = this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]]);
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: .9,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [],
					epCatch: true,
				},
				
				1: {
					name: 'pawn-b',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,-1),
					value: .9,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [],
					epCatch: true,
				},

				2: {
					name: 'ipawn-w',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,1),
					value: .9,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:23},{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:28},{s:1,p:29}],
					epTarget: true,
				},
				
				3: {
					name: 'ipawn-b',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,-1),
					value: .9,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:70},{s:-1,p:71},{s:-1,p:72},{s:-1,p:73},{s:-1,p:74},{s:-1,p:75},{s:-1,p:76},{s:-1,p:77},{s:-1,p:78},{s:-1,p:79}],
					epTarget: true,
				},

				4: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.7,
					abbrev: 'N',
					initial: [{s:1,p:12},{s:1,p:17},{s:-1,p:82},{s:-1,p:87}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.2,
					abbrev: 'B',
					initial: [{s:1,p:13},{s:1,p:16},{s:-1,p:83},{s:-1,p:86}],
				},

				6: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:11},{s:1,p:18},{s:-1,p:81},{s:-1,p:88}],
					castle: true,
				},

				7: {
					name: 'giraffe',
					aspect: 'fr-giraffe',
					graph: this.cbQueenGraph(geometry),
					value: 8,
					abbrev: 'Q',
					initial: [{s:1,p:14},{s:-1,p:84}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:15},{s:-1,p:85}],
				},
				
				9: {
					name: 'elephant',
					aspect: 'fr-elephant',
					graph: elephantGraph,
					value: 2.6,
					abbrev: 'E',
					initial: [{s:1,p:10},{s:1,p:19},{s:-1,p:80},{s:-1,p:89}],
				},
				
				10: {
					name: 'cannon',
					aspect: 'fr-cannon2',
					graph: this.cbXQCannonGraph(geometry),
					value: 4.9,
					abbrev: 'C',
					initial: [{s:1,p:0},{s:1,p:9},{s:-1,p:90},{s:-1,p:99}],
				},
				
			},

			castle: {
				"15/11": {k:[14,13],r:[12,13,14],n:"O-O-O"},
				"15/18": {k:[16,17],r:[17,16],n:"O-O"},
				"85/81": {k:[84,83],r:[82,83,84],n:"O-O-O"},
				"85/88": {k:[86,87],r:[87,86],n:"O-O"},
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==2)
					return [0];
				else if(piece.t==3)
					return [1];
				else if(piece.t==0 && geometry.R(move.t)==9)
					return [4,5,6,7,9,10];
				else if(piece.t==1 && geometry.R(move.t)==0)
					return [4,5,6,7,9,10];
				return [];
			},
			
		};
	}
	
})();
