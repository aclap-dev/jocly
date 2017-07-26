/*
 * Copyright(c) 2013-2016 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(8,8);
	
	Model.Game.cbKnightRiderGraph = function(geometry,confine) {
		return this.cbLongRangeGraph(geometry,[[2,-1],[2,1],[-2,-1],[-2,1],[-1,2],[-1,-2],[1,2],[1,-2]],confine);
	}

	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'cavalier-w',
					aspect: 'fr-knight',
					graph: Model.Game.cbHorseGraph(geometry),
					value: 2,
					abbrev: 'H',
					initial: [{s:1,p:8},{s:1,p:9},{s:1,p:10},{s:1,p:11},{s:1,p:12},{s:1,p:13},{s:1,p:14},{s:1,p:15}],
				},
				
				1: {
					name: 'cavalier-b',
					aspect: 'fr-knight',
					graph: Model.Game.cbHorseGraph(geometry),
					value: 2,
					abbrev: 'H',
					initial: [{s:-1,p:48},{s:-1,p:49},{s:-1,p:50},{s:-1,p:51},{s:-1,p:52},{s:-1,p:53},{s:-1,p:54},{s:-1,p:55}],
				},
				
				2: {
					name: 'nightrider',
					aspect: 'fr-unicorn',
					graph: this.cbKnightRiderGraph(geometry),
					value: 4.5,
					abbrev: 'I',
					initial: [{s:1,p:1},{s:1,p:6},{s:-1,p:57},{s:-1,p:62}],
				},
				
				3: {
	            	name: 'paladin',
	            	aspect: 'fr-cardinal',
					graph: this.cbMergeGraphs(geometry,
            			this.cbBishopGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 6,
	            	abbrev: 'A',
	            	initial: [{s:1,p:2},{s:1,p:5},{s:-1,p:58},{s:-1,p:61}],
				},

				4: {
					name: 'marshall',
					aspect: 'fr-marshall',							
					graph: this.cbMergeGraphs(geometry,
            			this.cbRookGraph(geometry),
						this.cbKnightGraph(geometry)),
					value: 7.8,
					abbrev: 'M',
					initial: [{s:1,p:0},{s:1,p:7},{s:-1,p:56},{s:-1,p:63}],
				},

				5: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:3},{s:-1,p:59}],
				},
				
				6: {
					name: 'knightking',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbMergeGraphs(geometry,
						this.cbKingGraph(geometry),
						this.cbKnightGraph(geometry)),
					abbrev: 'K',
					initial: [{s:1,p:4},{s:-1,p:60}],
				},
				
			},
			
			promote: function(aGame,piece,move) {
				rank = geometry.R(move.t);
				file = geometry.C(move.t);
				if ((piece.t==0 && rank==7) || (piece.t==1 && rank==0)) {
					if (file==0 || file==7)
						return [4];
					if (file==1 || file==6)
						return [2];
					if (file==2 || file==5)
						return [3];
					if (file==3)
						return [5];
					return [2,3,4,5];
				}
				return [];
			},

			importGame: function(initial,format,data) {
				initial.pieces.forEach(function(piece) {
					if(piece.s==1 && geometry.R(piece.p)==1 && piece.t==0) {
						piece.t=1;
						piece.m=false;
					}
					if(piece.s==1 && geometry.R(piece.p)!=1 && piece.t==1) {
						piece.t=0;
						piece.m=true;
					}
					if(piece.s==-1 && geometry.R(piece.p)==geometry.height-2 && piece.t==2) {
						piece.t=3;
						piece.m=false;
					}
					if(piece.s==-1 && geometry.R(piece.p)!=geometry.height-2 && piece.t==3) {
						piece.t=2;
						piece.m=true;
					}
				});
				return true;
			}
		};
	}
	
})();