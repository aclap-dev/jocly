/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(11,11);

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
					initial: [{s:1,p:2},{s:1,p:9},{s:-1,p:112},{s:-1,p:119}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:1},{s:1,p:8},{s:-1,p:111},{s:-1,p:118}],
				},

				6: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:10},{s:-1,p:110},{s:-1,p:120}],
					castle: true,
				},

				7: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:6},{s:-1,p:116}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:5},{s:-1,p:115}],
				},
				
				9: {
	            	name: 'commander',
	            	aspect: 'fr-amazon',
					graph: this.cbMergeGraphs(geometry,
            			this.cbQueenGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 12,
	            	abbrev: 'C',
	            	initial: [{s:1,p:4},{s:-1,p:114}],
	            },	
							
	            10: {
	            	name: 'adjutant',
	            	aspect: 'fr-cardinal',
					graph: this.cbMergeGraphs(geometry,
            			this.cbBishopGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 6,
	            	abbrev: 'A',
	            	initial: [{s:1,p:7},{s:-1,p:117}],
	            },	
			11: {
	            	name: 'marshall',
	            	aspect: 'fr-marshall',
					graph: this.cbMergeGraphs(geometry,
            			this.cbRookGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 7.5,
	            	abbrev: 'M',
	            	initial: [{s:1,p:3},{s:-1,p:113}],
	            },	

			12: {
					name: 'iipawn-w',
					aspect: 'fr-pawn',
					graph: IIPawnGraph(this,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:11},{s:1,p:12},{s:1,p:13},{s:1,p:14},{s:1,p:15},{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19},{s:1,p:20},{s:1,p:21}],
					epTarget: true,
				},

				13: {
					name: 'iipawn-b',
					aspect: 'fr-pawn',
					graph: IIPawnGraph(this,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:99},{s:-1,p:100},{s:-1,p:101},{s:-1,p:102},{s:-1,p:103},{s:-1,p:104},{s:-1,p:105},{s:-1,p:106},{s:-1,p:107},{s:-1,p:108},{s:-1,p:109}],
					epTarget: true,
				},



			
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==12 || piece.t==13) {
					//var dc=Math.abs(geometry.C(move.t)-geometry.C(move.f));
					var dr=Math.abs(geometry.R(move.t)-geometry.R(move.f));
					if(dr==1)
						return [piece.t==12?1:3];
					else
						return [piece.t==12?0:2];
				}
				
				if(piece.t==1)
					return [0];
				else if(piece.t==3)
					return [2];
				var r=geometry.R(move.t);

				if((piece.t==0 && geometry.R(move.t)==10) || (piece.t==2 && geometry.R(move.t)==0)) {
					var considerTypes={ 4:1, 5:1, 6:1, 7:1, 9:1, 10:1, 11:1 };
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
					if(r!=0 && r!=10) {
						
						promo.unshift(piece.t);
					} else if(promo.length==0)
						return null; // last line but no captured piece to promote to: move is not possible
					return promo;
				}
				return [];
			},

		castle: {
				"5/0": {k:[4,3,2,1],r:[1,2,3,4],n:"O-O"},
				"5/10": {k:[6,7,8,9],r:[9,8,7,6],n:"O-O-O"},
				"115/110": {k:[114,113,112,111],r:[111,112,113,114],n:"O-O"},
				"115/120": {k:[116,117,118,119],r:[119,118,117,116],n:"O-O-O"},
			},
		
		};
	}
	
})();