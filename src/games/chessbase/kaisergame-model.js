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
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:8},{s:-1,p:91},{s:-1,p:98}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.1,
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
					castle: true,
				},

				7: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:5},{s:-1,p:95}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:4},{s:-1,p:94}],
				},
				
				9: {
	            	name: 'commander',
	            	aspect: 'fr-amazon',
					graph: this.cbMergeGraphs(geometry,
            			this.cbQueenGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 12,
	            	abbrev: 'C',
	            	initial: [{s:1,p:3},{s:-1,p:93}],
	            },	
							
	            10: {
	            	name: 'adjutant',
	            	aspect: 'fr-cardinal',
					graph: this.cbMergeGraphs(geometry,
            			this.cbBishopGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 6,
	            	abbrev: 'A',
	            	initial: [{s:1,p:6},{s:-1,p:96}],
	            },	

			11: {
					name: 'iipawn-w',
					aspect: 'fr-pawn',
					graph: IIPawnGraph(this,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:10},{s:1,p:11},{s:1,p:12},{s:1,p:13},{s:1,p:14},{s:1,p:15},{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19}],
					epTarget: true,
				},

				12: {
					name: 'iipawn-b',
					aspect: 'fr-pawn',
					graph: IIPawnGraph(this,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:80},{s:-1,p:81},{s:-1,p:82},{s:-1,p:83},{s:-1,p:84},{s:-1,p:85},{s:-1,p:86},{s:-1,p:87},{s:-1,p:88},{s:-1,p:89}],
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
				var r=geometry.R(move.t);

				if((piece.t==0 && geometry.R(move.t)==9) || (piece.t==2 && geometry.R(move.t)==0)) {
					var considerTypes={ 4:1, 5:1, 6:1, 7:1, 9:1, 10:1 };
					var promoTypes={};
					for(var i=0;i<this.pieces.length;i++) {
						var piece1=this.pieces[i];
						if(piece1.s==piece.s // piece from our side 
								&& piece1.p<0 // already captured 
								&& (piece1.t in considerTypes)) // promotable piece type
							promoTypes[piece1.t]=1;
					}
					var promo=[];
					for(var t in promoTypes) // create an array of types from our types map
						promo.push(t);
					if(r!=0 && r!=9) {
						
						promo.unshift(piece.t);
					} else if(promo.length==0)
						return null; // last line but no captured piece to promote to: move is not possible
					return promo;
				}
				return [];
			},

		castle: {
				"4/0": {k:[3,2,1],r:[1,2,3],n:"O-O"},
				"4/9": {k:[5,6,7,8],r:[8,7,6,5],n:"O-O-O"},
				"94/90": {k:[93,92,91],r:[91,92,93],n:"O-O"},
				"94/99": {k:[95,96,97,98],r:[98,97,96,95],n:"O-O-O"},
			},
		
		};
	}
	
})();