
(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(8,8);
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'mk-pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19},{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:23}],
				},
				
				1: {
					name: 'pawn-b',
					aspect: 'mk-pawn',
					graph: this.cbPawnGraph(geometry,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:40},{s:-1,p:41},{s:-1,p:42},{s:-1,p:43},{s:-1,p:44},{s:-1,p:45},{s:-1,p:46},{s:-1,p:47}],
				},

				2: {
					name: 'horse',
					aspect: 'mk-knight',
					graph: this.cbKnightGraph(geometry),
					value: 3.5,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:6},{s:-1,p:57},{s:-1,p:62}],
				},
				
				3: {
					name: 'khon-w',
					aspect: 'mk-bishop',
					graph: this.cbSilverGraph(geometry,1),
					value: 3,
					abbrev: 'B',
					initial: [{s:1,p:2},{s:1,p:5}],
				},

				4: {
					name: 'khon-b',
					aspect: 'mk-bishop',
					graph: this.cbSilverGraph(geometry,-1),
					value: 3,
					abbrev: 'B',
					initial: [{s:-1,p:58},{s:-1,p:61}],
				},

				5: {
					name: 'rook',
					aspect: 'mk-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:7},{s:-1,p:56},{s:-1,p:63}],
					castle: true,
				},

				6: {
					name: 'met',
					aspect: 'mk-queen',
					graph: this.cbFersGraph(geometry),
					value: 2,
					abbrev: 'Q',
					initial: [{s:1,p:4},{s:-1,p:59}],
				},
				
				7: {
					name: 'king',
					aspect: 'mk-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:3},{s:-1,p:60}],
				},
				
			},
			
			evaluate: function(aGame,evalValues,material) {
				var $this=this;
				// implement counting rule
				function Count(side) {
					var maxMoves=64;
					var piecesLeft=material[side].count;
					if(piecesLeft[5]==2)
						maxMoves=8;
					else if(piecesLeft[5]==1)
						maxMoves=16;
					else {
						if(piecesLeft[side==1?3:4]==2)
							maxMoves=22;
						else if(piecesLeft[side==1?3:4]==1)
							maxMoves=44;
						else {
							if(piecesLeft[2]==2)
								maxMoves=32;
						}
					}
					if($this.noCaptCount>=maxMoves*2) {
						$this.mFinished=true;
						$this.mWinner=JocGame.DRAW;
					}
				}
				if(material[1].count[0]==0) // no white pawn left
					Count(-1);
				if(material[-1].count[1]==0) // no black pawn left
					Count(1);
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==0 && geometry.R(move.t)==5)
					return [6];
				else if(piece.t==1 && geometry.R(move.t)==2)
					return [6];
				return [];
			},
			
		};
	}
	
})();