/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(10,10);
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: 0.6,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:10},{s:1,p:11},{s:1,p:12},{s:1,p:13},{s:1,p:24},{s:1,p:25},{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19}],
					},
				
				2: {
					name: 'pawn-b',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,-1),
					value: 0.6,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:80},{s:-1,p:81},{s:-1,p:82},{s:-1,p:83},{s:-1,p:74},{s:-1,p:75},{s:-1,p:86},{s:-1,p:87},{s:-1,p:88},{s:-1,p:89}],
					},

				4: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.6,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:8},{s:-1,p:91},{s:-1,p:98}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.4,
					abbrev: 'B',
					initial: [{s:1,p:2},{s:1,p:7},{s:-1,p:92},{s:-1,p:97}],
				},

				6: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:9},{s:-1,p:90},{s:-1,p:99}],
					
				},

				7: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 8.2,
					abbrev: 'Q',
					initial: [{s:1,p:6},{s:-1,p:93}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:5},{s:-1,p:94}],
				},
				
				9: {
					name: 'marshall',
					aspect: 'fr-marshall',							
					graph: this.cbMergeGraphs(geometry,
            			this.cbRookGraph(geometry),
						this.cbKnightGraph(geometry)),
					value: 7.5,
					abbrev: 'M',
					initial: [{s:1,p:14},{s:1,p:15},{s:-1,p:84},{s:-1,p:85}],
				},
				
	            10: {
	            	name: 'cardinal',
	            	aspect: 'fr-cardinal',
					graph: this.cbMergeGraphs(geometry,
            			this.cbBishopGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 6,
	            	abbrev: 'C',
	            	initial: [{s:1,p:3},{s:-1,p:96}],
	            },				
			
			11: {
	            	name: 'amazon',
	            	aspect: 'fr-amazon',
					graph: this.cbMergeGraphs(geometry,
            			this.cbQueenGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 10.7,
	            	abbrev: 'A',
	            	initial: [{s:1,p:4},{s:-1,p:95}],
	            },				
			},

			
			promote: function(aGame,piece,move) {
			
				var r=geometry.R(move.t);
				var c=geometry.C(move.t);
				if((piece.t==0 && r==9) || (piece.t==2 && r==0)) {
					var col2piece = { 0:6 , 1:4, 2:5, 3:10, 4:11, 5:9, 6:7, 7:5, 8:4, 9:6};
					var nbPiecesPerType = { 6:2, 4:2, 5:2, 10:1, 11:1, 9:2, 7:1};
					var wantedPromo=col2piece[c];
					// check if there is one available: count nb pieces from that type on the board
					var nb=0;
					for(var i=0;i<this.pieces.length;i++) {
						var piece1=this.pieces[i];
						if ((piece1.s == piece.s) && (piece1.p >=0) && (piece1.t == wantedPromo))
							nb++;
					}
					if (nb<nbPiecesPerType[wantedPromo])
						return [wantedPromo];
				}
				
				return [];

			},	
		};
	}
	
})();