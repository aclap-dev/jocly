
(function() {
	
	var geometry = Model.Game.cbBoardGeometryCylinder(16,4);
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				1: {
					name: 'pawn-cw',
					aspect: 'np-pawn',
					graph: this.cbCircularPawnGraph(geometry,true,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:5},{s:1,p:21},{s:1,p:37},{s:1,p:53},{s:-1,p:13},{s:-1,p:29},{s:-1,p:45},{s:-1,p:61}],
				},
				
				3: {
					name: 'pawn-ccw',
					aspect: 'np-pawn',
					graph: this.cbCircularPawnGraph(geometry,false,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:2},{s:1,p:18},{s:1,p:34},{s:1,p:50},{s:-1,p:10},{s:-1,p:26},{s:-1,p:42},{s:-1,p:58}],
				},
				
				4: {
					name: 'knight',
					aspect: 'np-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:20},{s:1,p:19},{s:-1,p:27},{s:-1,p:28}],
				},
				
				5: {
					name: 'elephant',
					aspect: 'np-elephant',
					graph: this.cbElephantGraph(geometry),
					value: 2,
					abbrev: 'B',
					initial: [{s:1,p:36},{s:1,p:35},{s:-1,p:43},{s:-1,p:44}],
				},

				6: {
					name: 'rook',
					aspect: 'np-rook',
					graph: this.cbCylinderRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:4},{s:1,p:3},{s:-1,p:11},{s:-1,p:12}],
					castle: true,
				},

				7: {
					name: 'fers',
					aspect: 'np-general',
					graph: this.cbFersGraph(geometry),
					value: 2,
					abbrev: 'Q',
					initial: [{s:1,p:51},{s:-1,p:60}],
				},
				
				8: {
					name: 'king',
					aspect: 'np-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:52},{s:-1,p:59}],
				},
				
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