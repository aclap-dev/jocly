
(function(){

	var geometry=Model.Game.cbBoardGeometryGrid(12,12);

	Model.Game.minimumBridge=4; // switch on anti-trading, but allow double-capture of pieces > P & GB

	Model.Game.cbDefine=function(){

		var hitrun=this.cbConstants.FLAG_HITRUN;		// for Lion's adjacent enemy, to add 2nd leg
		var locust=this.cbConstants.FLAG_CHECKER		// for Falcon & Eagle jump, to empty...
			 | this.cbConstants.FLAG_SPECIAL_CAPTURE;	// ... or occupied
		var igui=this.cbConstants.FLAG_RIFLE;			// for Falcon & Eagle adjacent enemy, to add igui

		return {
			geometry:geometry,

			pieceTypes:{

				0: {
					name: 'pawn-w',
					aspect: 'sh-pawn',
					graph: this.cbShortRangeGraph(geometry,[[0,1]]),
					value: 0.5,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:36},{s:1,p:37},{s:1,p:38},{s:1,p:39},{s:1,p:40},{s:1,p:41},{s:1,p:42},{s:1,p:43},{s:1,p:44},{s:1,p:45},{s:1,p:46},{s:1,p:47}],
				},
								
				1: {
					name: 'pawn-b',
					aspect: 'sh-pawn',
					graph: this.cbShortRangeGraph(geometry,[[0,-1]]),
					value: 0.5,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:96},{s:-1,p:97},{s:-1,p:98},{s:-1,p:99},{s:-1,p:100},{s:-1,p:101},{s:-1,p:102},{s:-1,p:103},{s:-1,p:104},{s:-1,p:105},{s:-1,p:106},{s:-1,p:107}],
				},

				2: {
					name: 'go-between',
					aspect: 'sh-shuttle',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[0,-1]]),
					value: 1.1,
					abbrev: 'GB',
					fenAbbrev: 'I',
					initial: [{s:1,p:51},{s:1,p:56}],
				},

				3: {
					name: 'go-between',	// defined as pair because of asymmetric promotion piece
					aspect: 'sh-shuttle',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[0,-1]]),
					value: 1.1,
					abbrev: 'GB',
					fenAbbrev: 'I',
					initial: [{s:-1,p:87},{s:-1,p:92}],
				},

				4: {
					name: 'lance-w',
					aspect: 'sh-lance',
					graph: this.cbLongRangeGraph(geometry,[[0,1]]),
					value: 1,
					abbrev: 'L',
					initial: [{s:1,p:0},{s:1,p:11}],
				},

				5: {
					name: 'lance-b',
					aspect: 'sh-lance',
					graph: this.cbLongRangeGraph(geometry,[[0,-1]]),
					value: 1,
					abbrev: 'L',
					initial: [{s:-1,p:132},{s:-1,p:143}],
				},

				6: {
					name: 'leopard',
					aspect: 'sh-leopard',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]]),
					value: 2.5,
					abbrev: 'FL',
					fenAbbrev: 'F',
					initial: [{s:1,p:1},{s:1,p:10},{s:-1,p:133},{s:-1,p:142}],
				},

				7: {
					name: 'side-mover',
					aspect: 'sh-sweeper',
					graph: this.cbMergeGraphs(geometry,
						this.cbLongRangeGraph(geometry,[[1,0],[-1,0]]),
						this.cbShortRangeGraph(geometry,[[0,1],[0,-1]])
						),
					value: 2.25,
					abbrev: 'M',
					initial: [{s:1,p:24},{s:1,p:35},{s:-1,p:108},{s:-1,p:119}],
				},

				8: {
					name: 'vertical-mover',
					aspect: 'sh-climber',
					graph: this.cbMergeGraphs(geometry,
						this.cbLongRangeGraph(geometry,[[0,1],[0,-1]]),
						this.cbShortRangeGraph(geometry,[[1,0],[-1,0]])
						),
					value: 2.5,
					abbrev: 'V',
					initial: [{s:1,p:25},{s:1,p:34},{s:-1,p:109},{s:-1,p:118}],
				},

				9: {
					name: 'bishop',
					aspect: 'sh-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 4,
					abbrev: 'B',
					initial: [{s:1,p:14},{s:1,p:21},{s:-1,p:122},{s:-1,p:129}],
				},

				10: {
					name: 'rook',
					aspect: 'sh-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:26},{s:1,p:33},{s:-1,p:110},{s:-1,p:117}],
				},
				
				11: {
					name: 'phoenix',
					aspect: 'sh-phoenix',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[0,-1],[1,0],[-1,0],[-2,2],[2,2],[2,-2],[-2,-2]]),
					value: 3,
					abbrev: 'PH',
					fenAbbrev: 'X',
					initial: [{s:1,p:18},{s:-1,p:125}],
				},

				12: {
					name: 'kirin',
					aspect: 'sh-kirin',
					graph: this.cbShortRangeGraph(geometry,[[0,2],[0,-2],[2,0],[-2,0],[-1,1],[1,1],[1,-1],[-1,-1]]),
					value: 3,
					abbrev: 'KN',
					fenAbbrev: 'O',
					initial: [{s:1,p:17},{s:-1,p:126}],
				},

				13: {
					name: 'copper-w',
					aspect: 'sh-copper',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[0,-1],[-1,1],[1,1]]),
					value: 2,
					abbrev: 'C',
					initial: [{s:1,p:2},{s:1,p:9}],
				},

				14: {
					name: 'copper-b',
					aspect: 'sh-copper',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[0,-1],[-1,-1],[1,-1]]),
					value: 2,
					abbrev: 'C',
					initial: [{s:-1,p:134},{s:-1,p:141}],
				},

				15: {
					name: 'silver-w',
					aspect: 'sh-silver',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[1,1],[1,-1],[-1,1],[-1,-1]]),
					value: 2.25,
					abbrev: 'S',
					initial: [{s:1,p:3},{s:1,p:8}],
				},

				16: {
					name: 'silver-b',
					aspect: 'sh-silver',
					graph: this.cbShortRangeGraph(geometry,[[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]),
					value: 2.25,
					abbrev: 'S',
					initial: [{s:-1,p:135},{s:-1,p:140}],
				},

				17: {
					name: 'gold-w',
					aspect: 'sh-gold',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1]]),
					value: 2.5,
					abbrev: 'G',
					initial: [{s:1,p:4},{s:1,p:7}],
				},

				18: {
					name: 'gold-b',
					aspect: 'sh-gold',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[0,-1],[1,0],[-1,0],[1,-1],[-1,-1]]),
					value: 2.5,
					abbrev: 'G',
					initial: [{s:-1,p:136},{s:-1,p:139}],
				},

				19: {
					name: 'tiger-w',
					aspect: 'sh-tiger',
					graph: this.cbShortRangeGraph(geometry,[[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]),
					value: 2.75,
					abbrev: 'BT',
					fenAbbrev: 'T',
					initial: [{s:1,p:16},{s:1,p:19}],
				},

				20: {
					name: 'tiger-b',
					aspect: 'sh-tiger',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]),
					value: 2.75,
					abbrev: 'BT',
					fenAbbrev: 'T',
					initial: [{s:-1,p:124},{s:-1,p:127}],
				},

				21: {
					name: 'elephant-w',
					aspect: 'sh-elephant',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]),
					value: 3,
					abbrev: 'DE',
					fenAbbrev: 'E',
					initial: [{s:1,p:6}],
				},

				22: {
					name: 'elephant-b',
					aspect: 'sh-elephant',
					graph: this.cbShortRangeGraph(geometry,[[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]),
					value: 3,
					abbrev: 'DE',
					fenAbbrev: 'E',
					initial: [{s:-1,p:137}],
				},

				23: {
					name: 'reverse-chariot',
					aspect: 'sh-chariot',
					graph: this.cbLongRangeGraph(geometry,[[0,1],[0,-1]]),
					value: 1.5,
					abbrev: 'RV',
					fenAbbrev: 'A',
					initial: [{s:1,p:12},{s:1,p:23},{s:-1,p:120},{s:-1,p:131}],
				},

				24: {
					name: 'dragon-horse',
					aspect: 'sh-horse',
					graph: this.cbMergeGraphs(geometry,
						this.cbBishopGraph(geometry),
						this.cbShortRangeGraph(geometry,[[1,0],[0,1],[0,-1],[-1,0]])
						),
					value: 5.5,
					abbrev: 'DH',
					fenAbbrev: 'H',
					initial: [{s:1,p:27},{s:1,p:32},{s:-1,p:111},{s:-1,p:116}],
				},
				
				25: {
					name: 'dragon-king',
					aspect: 'sh-dragon',
					graph: this.cbMergeGraphs(geometry,
						this.cbRookGraph(geometry),
						this.cbShortRangeGraph(geometry,[[1,1],[-1,1],[1,-1],[-1,-1]])
						),
					value: 7,
					abbrev: 'DK',
					fenAbbrev: 'D',
					initial: [{s:1,p:28},{s:1,p:31},{s:-1,p:112},{s:-1,p:115}],
				},

				26: {
					name: 'queen',
					aspect: 'sh-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9.5,
					abbrev: 'FK',
					fenAbbrev: 'Q',
					initial: [{s:1,p:30},{s:-1,p:113}],
				},
				
				27: {
					name: 'lion',
					aspect: 'sh-lion',
					graph: this.cbMergeGraphs(geometry,
						this.cbKingGraph(geometry),
						this.cbKnightGraph(geometry),
						this.cbShortRangeGraph(geometry,
							[[1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]], null, hitrun),
						this.cbShortRangeGraph(geometry,
							[[2,0],[0,2],[-2,0],[0,-2], [2,2],[2,-2],[-2,2],[-2,-2]])
						),
					value: 15,
					abbrev: 'LN',
					fenAbbrev: 'N',
					initial: [{s:1,p:29},{s:-1,p:114}],
					antiTrade: -1,
				},

				28: {
					name: 'king',
					aspect: 'sh-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:5},{s:-1,p:138}],
				},

				29: {
					name: 'tokin-w',
					aspect: 'sh-tokin',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1]]),
					value: 2.5,
					abbrev: '+P',
				},

				30: {
					name: 'tokin-b',
					aspect: 'sh-tokin',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[0,-1],[1,0],[-1,0],[1,-1],[-1,-1]]),
					value: 2.5,
					abbrev: '+P',
				},

				31: {
					name: 'elephant2-w',
					aspect: 'sh-promotion-elephant',
					graph: this.cbShortRangeGraph(geometry,[[0,1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]),
					value: 3,
					abbrev: '+GB',
					fenAbbrev: '+I',
				},

				32: {
					name: 'elephant2-b',
					aspect: 'sh-promotion-elephant',
					graph: this.cbShortRangeGraph(geometry,[[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]),
					value: 3,
					abbrev: '+GB',
					fenAbbrev: '+I',
				},

				33: {
					name: 'white-horse-w',
					aspect: 'sh-whitehorse',
					graph: this.cbLongRangeGraph(geometry,[[0,1],[0,-1],[1,1],[-1,1]]),
					value: 5.25,
					abbrev: '+L',
				},

				34: {
					name: 'white-horse-b',
					aspect: 'sh-whitehorse',
					graph: this.cbLongRangeGraph(geometry,[[0,1],[0,-1],[1,-1],[-1,-1]]),
					value: 5.25,
					abbrev: '+L',
				},

				35: {
					name: 'bishop2',
					aspect: 'sh-promotion-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 4,
					abbrev: '+FL',
					fenAbbrev: '+F',
				},

				36: {
					name: 'free-boar',
					aspect: 'sh-freeboar',
					graph: this.cbLongRangeGraph(geometry,[[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]),
					value: 7.5,
					abbrev: '+SM',
					fenAbbrev: '+M',
				},

				37: {
					name: 'flying-ox',
					aspect: 'sh-flyingox',
					graph: this.cbLongRangeGraph(geometry,[[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]),
					value: 8,
					abbrev: '+VM',
					fenAbbrev: '+V',
				},

				38: {
					name: 'dragon-horse2',
					aspect: 'sh-promotion-horse',
					graph: this.cbMergeGraphs(geometry,
						this.cbBishopGraph(geometry),
						this.cbShortRangeGraph(geometry,[[1,0],[0,1],[0,-1],[-1,0]])
						),
					value: 5.5,
					abbrev: '+B',
				},
				
				39: {
					name: 'dragon-king2',
					aspect: 'sh-promotion-dragon',
					graph: this.cbMergeGraphs(geometry,
						this.cbRookGraph(geometry),
						this.cbShortRangeGraph(geometry,[[1,1],[-1,1],[1,-1],[-1,-1]])
						),
					value: 7,
					abbrev: '+R',
				},

				40: {
					name: 'queen2',
					aspect: 'sh-promotion-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9.5,
					abbrev: '+PH',
					fenAbbrev: '+X',
				},
				
				41: {
					name: 'lion2',
					aspect: 'sh-promotion-lion',
					graph: this.cbMergeGraphs(geometry,
						this.cbKingGraph(geometry),
						this.cbKnightGraph(geometry),
						this.cbShortRangeGraph(geometry,
							[[1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]], null, hitrun),
						this.cbShortRangeGraph(geometry,
							[[2,0],[0,2],[-2,0],[0,-2], [2,2],[2,-2],[-2,2],[-2,-2]])
						),
					value: 15,
					abbrev: '+KN',
					fenAbbrev: '+O',
					antiTrade: -1,
				},

				42: {
					name: 'side-mover2',
					aspect: 'sh-promotion-sweeper',
					graph: this.cbMergeGraphs(geometry,
						this.cbLongRangeGraph(geometry,[[1,0],[-1,0]]),
						this.cbShortRangeGraph(geometry,[[0,1],[0,-1]])
						),
					value: 2.25,
					abbrev: '+C',
				},

				43: {
					name: 'vertical-mover2',
					aspect: 'sh-promotion-climber',
					graph: this.cbMergeGraphs(geometry,
						this.cbLongRangeGraph(geometry,[[0,1],[0,-1]]),
						this.cbShortRangeGraph(geometry,[[1,0],[-1,0]])
						),
					value: 2.5,
					abbrev: '+S',
				},

				44: {
					name: 'rook2',
					aspect: 'sh-promotion-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: '+G',
				},

				45: {
					name: 'flying-stag',
					aspect: 'sh-stag',
					graph: this.cbMergeGraphs(geometry,
						this.cbLongRangeGraph(geometry,[[0,1],[0,-1]]),
						this.cbShortRangeGraph(geometry,[[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]])
						),
					value: 4,
					abbrev: '+BT',
					fenAbbrev: '+T',
				},

				46: {
					name: 'crown-prince',
					aspect: 'sh-prince',
					//isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: '+DE',
					fenAbbrev: '+E',
				},

				47: {
					name: 'whale-w',
					aspect: 'sh-whale',
					graph: this.cbLongRangeGraph(geometry,[[0,1],[0,-1],[1,-1],[-1,-1]]),
					value: 4.5,
					abbrev: '+RV',
					fenAbbrev: '+A',
				},

				48: {
					name: 'whale-b',
					aspect: 'sh-whale',
					graph: this.cbLongRangeGraph(geometry,[[0,1],[0,-1],[1,1],[-1,1]]),
					value: 4.5,
					abbrev: '+RV',
					fenAbbrev: '+A',
				},

				49: {
					name: 'falcon-w',
					aspect: 'sh-promotion-falcon',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry,[[0,1],[0,2]]),
						this.cbShortRangeGraph(geometry,[[0,1]], null, igui),
						this.cbShortRangeGraph(geometry,[[0,2]], null, locust),
						this.cbLongRangeGraph(geometry,[[1,0],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]])
						),
					value: 8.75,
					abbrev: '+DH',
					fenAbbrev: '+H',
				},

				50: {
					name: 'falcon-b',
					aspect: 'sh-promotion-falcon',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry,[[0,-1],[0,-2]]),
						this.cbShortRangeGraph(geometry,[[0,-1]], null, igui),
						this.cbShortRangeGraph(geometry,[[0,-2]], null, locust),
						this.cbLongRangeGraph(geometry,[[1,0],[-1,0],[0,1],[1,1],[1,-1],[-1,1],[-1,-1]])
						),
					value: 8.75,
					abbrev: '+DH',
					fenAbbrev: '+H',
				},

				51: {
					name: 'eagle-w',
					aspect: 'sh-promotion-eagle',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry,[[1,1],[-1,1],[2,2],[-2,2]]),
						this.cbShortRangeGraph(geometry,[[1,1],[-1,1]], null, igui),
						this.cbShortRangeGraph(geometry,[[2,2],[-2,2]], null, locust),
						this.cbLongRangeGraph(geometry,[[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,-1]])
						),
					value: 9.25,
					abbrev: '+DK',
					fenAbbrev: '+D',
				},

				52: {
					name: 'eagle-b',
					aspect: 'sh-promotion-eagle',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry,[[1,-1],[-1,-1],[2,-2],[-2,-2]]),
						this.cbShortRangeGraph(geometry,[[1,-1],[-1,-1]], null, igui),
						this.cbShortRangeGraph(geometry,[[2,-2],[-2,-2]], null, locust),
						this.cbLongRangeGraph(geometry,[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1]])
						),
					value: 9.25,
					abbrev: '+DK',
					fenAbbrev: '+D',
				},

			},

			promote: function(aGame,piece,move) {
				if(piece.t>25) // unpromotable or already promoted
					return [];
				var rank=geometry.R(move.f);
				if(piece.s==1) {
					if(piece.t==0 && rank==10) return[29]; // last-rank Pawn
					if(rank>=8 && move.c == null) return []; // was already in zone, and no capture
					if(geometry.R(move.t) < 8) return []; // did not end in zone
				} else {
					if(piece.t==1 && rank==1) return[30];
					if(rank<=3 && move.c == null) return [];
					if(geometry.R(move.t)>3) return [];
				}
				if(piece.t<13) // P, GB, L: map pair on pair; FL, SM, VM, B, R, Ph, Kn: single on single
					return [piece.t, piece.t+29];
				if(piece.t>22) // RV, DH, DK: choose correctly oriented promoted type
					return [piece.t, 2*piece.t+(piece.s==1 ? 1 : 2)];
				return [piece.t, (piece.t+1>>1)+35]; // map pair on single
			},

			evaluate: function(aGame,evalValues,material,totalPieces) {
				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				if(totalPieces[1] == 1) { // white king single
					var n = totalPieces[-1];
					if(n<4 && (black[4]==2 || n==2 && black[4]+black[5] || n==1)) {
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				if(totalPieces[-1] == 1) { // black king single
					var n = totalPieces[1];
					if(n<4 && (white[4]==2 || n==2 && white[4]+white[4])) {
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				
				// check 50 moves without capture
				if(this.noCaptCount>=100) {
					this.mFinished=true;
					this.mWinner=JocGame.DRAW;					
				}
				
				// motivate pawns to reach the promotion line
				var distPromo=aGame.cbUseTypedArrays?new Int8Array(3):[0,0,0];
				var height=geometry.height;
				var pawns=material[1].byType[0],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(height-geometry.R(pawns[i].p)) {
						case 2: distPromo[0]++; break;
						case 3: distPromo[1]++; break;
						case 4: distPromo[2]++; break;
						}
				}
				pawns=material[-1].byType[2],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(geometry.R(pawns[i].p)) {
						case 1: distPromo[0]--; break;
						case 2: distPromo[1]--; break;
						case 3: distPromo[2]--; break;
						}
				}
				if(distPromo[0]!=0)
					evalValues['distPawnPromo1']=distPromo[0];
				if(distPromo[1]!=0)
					evalValues['distPawnPromo2']=distPromo[1];
				if(distPromo[2]!=0)
					evalValues['distPawnPromo3']=distPromo[2];
				
				// motivate knights and bishops to deploy early
				var minorPiecesMoved=0;
				for(var t=4;t<=5;t++)
					for(var s=1;s>=-1;s-=2) {
						var pieces=material[s].byType[t];
						if(pieces)
							for(var i=0;i<pieces.length;i++)
								if(pieces[i].m)
									minorPiecesMoved+=s;
					}
				if(minorPiecesMoved!=0) {
					evalValues['minorPiecesMoved']=minorPiecesMoved;
				}
			},
			
		};
	}

})();
