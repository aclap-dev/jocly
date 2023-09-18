/*
 * Copyright(c) 2013-2017 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(16,16);
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
					epTarget: true,
					initial: [{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19},{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:23},{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:28},{s:1,p:29},{s:1,p:30},{s:1,p:31}],
				},
				
				1: {
					name: 'pawn-b',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
					epTarget: true,
					initial: [{s:-1,p:96},{s:-1,p:97},{s:-1,p:98},{s:-1,p:99},{s:-1,p:100},{s:-1,p:101},{s:-1,p:102},{s:-1,p:103},{s:-1,p:104},{s:-1,p:105},{s:-1,p:106},{s:-1,p:107},{s:-1,p:108},{s:-1,p:109},{s:-1,p:110},{s:-1,p:111}],
				},
								
				2: {
					name: 'pawn-w2',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
					epTarget: true,
					initial: [{s:1,p:224},{s:1,p:225},{s:1,p:226},{s:1,p:227},{s:1,p:228},{s:1,p:229},{s:1,p:230},{s:1,p:231},{s:1,p:232},{s:1,p:233},{s:1,p:234},{s:1,p:235},{s:1,p:236},{s:1,p:237},{s:1,p:238},{s:1,p:239}],
				},
				
				3: {
					name: 'pawn-b2',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
					epTarget: true,
					initial: [{s:-1,p:144},{s:-1,p:145},{s:-1,p:146},{s:-1,p:147},{s:-1,p:148},{s:-1,p:149},{s:-1,p:150},{s:-1,p:151},{s:-1,p:152},{s:-1,p:153},{s:-1,p:154},{s:-1,p:155},{s:-1,p:156},{s:-1,p:157},{s:-1,p:158},{s:-1,p:159}],
				},
				
				4: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:6},{s:1,p:9},{s:1,p:14},{s:1,p:241},{s:1,p:246},{s:1,p:249},{s:1,p:254},{s:-1,p:113},{s:-1,p:118},{s:-1,p:121},{s:-1,p:126},{s:-1,p:129},{s:-1,p:134},{s:-1,p:137},{s:-1,p:142}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:2},{s:1,p:5},{s:1,p:10},{s:1,p:13},{s:1,p:242},{s:1,p:245},{s:1,p:250},{s:1,p:253},{s:-1,p:114},{s:-1,p:117},{s:-1,p:122},{s:-1,p:125},{s:-1,p:130},{s:-1,p:133},{s:-1,p:138},{s:-1,p:141}],
				},

				6: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:7},{s:1,p:8},{s:1,p:15},{s:1,p:240},{s:1,p:247},{s:1,p:248},{s:1,p:255},{s:-1,p:112},{s:-1,p:119},{s:-1,p:120},{s:-1,p:127},{s:-1,p:128},{s:-1,p:135},{s:-1,p:136},{s:-1,p:143}],
					castle: true,
				},

				7: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:3},{s:1,p:11},{s:1,p:244},{s:1,p:252},{s:-1,p:115},{s:-1,p:123},{s:-1,p:132},{s:-1,p:140}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:12},{s:-1,p:124}],
				},
				
				9: {
					name: 'commander',
					aspect: 'fr-amazon',
					graph: this.cbMergeGraphs(geometry,
            			this.cbQueenGraph(geometry),
						this.cbKnightGraph(geometry)),
					value: 13,
					abbrev: 'Co',
					initial: [{s:1,p:4},{s:-1,p:116}],
				},
				
				10: {
					name: 'cardinal',
					aspect: 'fr-cardinal',
					graph: this.cbMergeGraphs(geometry,
            			this.cbBishopGraph(geometry),
						this.cbKnightGraph(geometry)),
					value: 6,
					abbrev: 'Ca',
					initial: [{s:1,p:251},{s:-1,p:139}],
				},

				11: {
					name: 'chancellor',
					aspect: 'fr-marshall',
					graph: this.cbMergeGraphs(geometry,
            			this.cbRookGraph(geometry),
						this.cbKnightGraph(geometry)),
					value: 9,
					abbrev: 'Ch',
					initial: [{s:1,p:243},{s:-1,p:131}],
					castle: true,
				},
				
			},
			
			promote: function(aGame,piece,move) {
					if(piece.t==0 && geometry.R(move.t)==7)
					return [4,5,6,7,9,10,11];
				else if(piece.t==1 && geometry.R(move.t)==0)
					return [4,5,6,7,9,10,11];
				else if(piece.t==2 && geometry.R(move.t)==8)
					return [4,5,6,7,9,10,11];
				else if(piece.t==3 && geometry.R(move.t)==15)
					return [4,5,6,7,9,10,11];
				return [];
			},

			castle: {
				"12/8": {k:[11,10],r:[9,10,11],n:"O-O-O"},
				"12/15": {k:[13,14],r:[14,13],n:"O-O"},
				"124/120": {k:[123,122],r:[121,122,123],n:"O-O-O"},
				"124/127": {k:[125,126],r:[126,125],n:"O-O"},
			},
			
			evaluate: function(aGame,evalValues,material) {
				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				if(!white[0] && !white[1] && !white[4] && !white[5] && !white[6] && !white[7]) { // white king single
					if(!black[2] && !black[3] && !black[6] && !black[7] && (black[4]+black[5]<2 || black[5]<2)) {
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				if(!black[2] && !black[3] && !black[4] && !black[5] && !black[6] && !black[7]) { // black king single
					if(!white[0] && !white[1] && !white[6] && !white[7] && (white[4]+white[5]<2 || white[5]<2)) {
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