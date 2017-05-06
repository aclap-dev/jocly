
(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(8,8);
	
	Model.Game.cbDefine = function() {
				
		var elephantGraph = this.cbShortRangeGraph(geometry,[[-2,-2],[-2,2],[2,-2],[2,2]]);

		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'np-pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: false,
					initial: [{s:1,p:8},{s:1,p:9},{s:1,p:10},{s:1,p:11},{s:1,p:12},{s:1,p:13},{s:1,p:14},{s:1,p:15}],
				},
				
				
				2: {
					name: 'pawn-b',
					aspect: 'np-pawn',
					graph: this.cbPawnGraph(geometry,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:48},{s:-1,p:49},{s:-1,p:50},{s:-1,p:51},{s:-1,p:52},{s:-1,p:53},{s:-1,p:54},{s:-1,p:55}],
					epCatch: false,
				},

				
				4: {
					name: 'knight',
					aspect: 'np-knight',
					graph: this.cbKnightGraph(geometry),
					value: 3.5,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:6},{s:-1,p:57},{s:-1,p:62}],
				},
				
				5: {
					name: 'elephant',
					aspect: 'np-elephant',
					graph: elephantGraph,
					value: 2.5,
					abbrev: 'E',
					initial: [{s:1,p:2},{s:1,p:5},{s:-1,p:58},{s:-1,p:61}],
				},

				6: {
					name: 'rook',
					aspect: 'np-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:7},{s:-1,p:56},{s:-1,p:63}],
					castle: false,
				},

				7: {
					name: 'general',
					aspect: 'np-general',
					graph: this.cbFersGraph(geometry),
					value: 2,
					abbrev: 'G',
					initial: [{s:1,p:4},{s:-1,p:60}],
				},
				
				8: {
					name: 'king',
					aspect: 'np-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:3},{s:-1,p:59}],
				},
				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==0 && geometry.R(move.t)==7)
					return [7];
				else if(piece.t==2 && geometry.R(move.t)==0)
					return [7];
				return [];
			},
			
			evaluate: function(aGame,evalValues,material) {
				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				if(!white[0] && !white[4] && !white[5] && !white[6] && !white[7]) { // white king single
					this.mFinished=true;
					this.mWinner=JocGame.PLAYER_B;
				}
				if(!black[2] && !black[4] && !black[5] && !black[6] && !black[7]) { // black king single
					this.mFinished=true;
					this.mWinner=JocGame.PLAYER_A;
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