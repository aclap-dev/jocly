/*
 * Copyright(c) 2013-2016 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(10,10);
	
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
					initial: [{s:1,p:21},{s:1,p:22},{s:1,p:23},{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:28}],
				},
				
				1: {
					name: 'cavalier-b',
					aspect: 'fr-knight',
					graph: Model.Game.cbHorseGraph(geometry),
					value: 2,
					abbrev: 'H',
					initial: [{s:-1,p:71},{s:-1,p:72},{s:-1,p:73},{s:-1,p:74},{s:-1,p:75},{s:-1,p:76},{s:-1,p:77},{s:-1,p:78}],
				},
				
				2: {
					name: 'nightrider',
					aspect: 'fr-unicorn',
					graph: this.cbKnightRiderGraph(geometry),
					value: 4.4,
					abbrev: 'I',
					initial: [{s:1,p:2},{s:1,p:7},{s:-1,p:92},{s:-1,p:97}],
				},
				
				3: {
	            	name: 'paladin',
	            	aspect: 'fr-cardinal',
					graph: this.cbMergeGraphs(geometry,
            			this.cbBishopGraph(geometry),
						this.cbKnightGraph(geometry)),
	            	value: 6,
	            	abbrev: 'A',
	            	initial: [{s:1,p:3},{s:1,p:6},{s:-1,p:93},{s:-1,p:96}],
				},

				4: {
					name: 'marshall',
					aspect: 'fr-marshall',							
					graph: this.cbMergeGraphs(geometry,
            			this.cbRookGraph(geometry),
						this.cbKnightGraph(geometry)),
					value: 7.8,
					abbrev: 'M',
					initial: [{s:1,p:1},{s:1,p:8},{s:-1,p:91},{s:-1,p:98}],
				},

				5: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:4},{s:-1,p:94}],
				},
				
				6: {
					name: 'knightking',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbMergeGraphs(geometry,
						this.cbKingGraph(geometry),
						this.cbKnightGraph(geometry)),
					abbrev: 'K',
					initial: [{s:1,p:5},{s:-1,p:95}],
				},
				7: {
					name: 'cannon',
					aspect: 'fr-cannon2',
					graph: this.cbXQCannonGraph(geometry),
					value: 4.6,
					abbrec: 'C',
					initial: [{s:1,p:10},{s:1,p:19},{s:-1,p:89},{s:-1,p:80}],
				},
				
			},
			
		promote: function(aGame,piece,move) {
				var rank = geometry.R(move.t);
				if ((piece.t==0 && rank==9) || (piece.t==1 && rank==0)) {
					var considerTypes={ 2:2, 3:2, 4:2, 5:1, 7:2 };
					for(var i=0;i<this.pieces.length;i++) {
						var piece1=this.pieces[i];
						if(piece1.s==piece.s // piece from our side 
								&& piece1.p>0 // in play on board
								&& (piece1.t in considerTypes)) // promotable piece type
							considerTypes[piece1.t] = considerTypes[piece1.t] - 1;
					}
					var promo=[];
					for(var t in considerTypes) { // create an array of types from our types map
						if (considerTypes[t] > 0)
							promo.push(t);
					}
					if(promo.length==0)
						return null; // last line but no captured piece to promote to: move is not possible
					return promo;
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
	debugger;
})();