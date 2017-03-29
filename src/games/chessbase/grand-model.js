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
					initial: [{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:23},{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:28},{s:1,p:29}],
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
					initial: [{s:-1,p:70},{s:-1,p:71},{s:-1,p:72},{s:-1,p:73},{s:-1,p:74},{s:-1,p:75},{s:-1,p:76},{s:-1,p:77},{s:-1,p:78},{s:-1,p:79}],
					epTarget: true,
				},
				
				4: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:11},{s:1,p:18},{s:-1,p:81},{s:-1,p:88}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:12},{s:1,p:17},{s:-1,p:82},{s:-1,p:87}],
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
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:13},{s:-1,p:83}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:14},{s:-1,p:84}],
				},
				
				9: {
					name: 'marshall',
					aspect: 'fr-marshall',							
					graph: this.cbMergeGraphs(geometry,
            			this.cbRookGraph(geometry),
						this.cbKnightGraph(geometry)),
					value: 7.8,
					abbrev: 'M',
					initial: [{s:1,p:15},{s:-1,p:85}],
				},
				
	            10: {
	            	name: 'cardinal',
	            	aspect: 'fr-cardinal',
					graph: this.cbMergeGraphs(geometry,
            			this.cbBishopGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 6,
	            	abbrev: 'C',
	            	initial: [{s:1,p:16},{s:-1,p:86}],
	            },				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==1)
					return [0];
				else if(piece.t==3)
					return [2];
				var r=geometry.R(move.t);
				if((piece.t==0 && r<=9 && r>=7) || (piece.t==2 && r>=0 && r<=2)) {
					var considerTypes={ 4:2, 5:2, 6:2, 7:1, 9:1, 10:1 };
					for(var i=0;i<this.pieces.length;i++) {
						var piece1=this.pieces[i];
						if(piece1.s==piece.s // piece from our side 
								&& piece1.p>=0 // in play
								&& (piece1.t in considerTypes)) // promotable piece type
                            considerTypes[piece1.t]--;
					}
					var promo=[];
					for(var t in considerTypes) // create an array of types from our types map
                        if(considerTypes[t]>0)
                            promo.push(t);
					if(r!=0 && r!=9)
						promo.unshift(piece.t);
					else if(promo.length==0)
						return null; // last line but no captured piece to promote to: move is not possible
					return promo;
				}
				return [];
			},

		
		};
	}
	
})();