
(function() {
	
	var geometry = Model.Game.cbBoardGeometryMultiplan(5,5,5);
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbRSKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:2},{s:-1,p:122}],
				},

				1: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbRSQueenGraph(geometry),
					abbrev: 'Q',
					initial: [{s:1,p:27},{s:-1,p:97}],
					value: 9,
				},

				2: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRSRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:4},{s:-1,p:124},{s:-1,p:120}],
					castle: true,
				},

				3: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbRSBishopGraph(geometry),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:25},{s:1,p:28},{s:-1,p:99},{s:-1,p:96}],
				},

				4: {
					name: 'unicorn',
					aspect: 'fr-unicorn',
					graph: this.cbRSUnicornGraph(geometry),
					value: 2,
					abbrev: 'U',
					initial: [{s:1,p:26},{s:1,p:29},{s:-1,p:98},{s:-1,p:95}],
				},

				5: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbRSKnightGraph(geometry),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:3},{s:-1,p:123},{s:-1,p:121}],
				},

				6: {
					name: 'pawn-w',
					aspect: 'fr-pawn',
					graph: this.cbRSPawnGraph(geometry,1),
					value: 1,
					abbrev: 'P',
					initial: [{s:1,p:5},{s:1,p:6},{s:1,p:7},{s:1,p:8},{s:1,p:9},{s:1,p:30},{s:1,p:31},{s:1,p:32},{s:1,p:33},{s:1,p:34}],
				},

				7: {
					name: 'pawn-b',
					aspect: 'fr-pawn',
					graph: this.cbRSPawnGraph(geometry,-1),
					value: 1,
					abbrev: 'P',
					initial: [{s:-1,p:119},{s:-1,p:118},{s:-1,p:117},{s:-1,p:116},{s:-1,p:115},{s:-1,p:94},{s:-1,p:93},{s:-1,p:92},{s:-1,p:91},{s:-1,p:90}],
				},
				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==6 && geometry.R(move.t)==4 && geometry.F(move.t)==4)
					return [5,4,3,2,1];
				else if(piece.t==7 && geometry.R(move.t)==0 && geometry.F(move.t)==0)
					return [5,4,3,2,1];
				return [];
			},

			evaluate: function(aGame,evalValues,material) {
				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				// TODO detect minimum material condition to draw
				
				// check 50 moves without capture
				if(this.noCaptCount>=100) {
					this.mFinished=true;
					this.mWinner=JocGame.DRAW;					
				}
				
				// motivate pawns to reach the promotion line
				var distPromo=aGame.cbUseTypedArrays?new Int8Array(3):[0,0,0];
				var height=geometry.height;
				var pawns=material[1].byType[6],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(Math.max(height-geometry.R(pawns[i].p),geometry.floors-geometry.F(pawns[i].p))) {
						case 2: distPromo[0]++; break;
						case 3: distPromo[1]++; break;
						case 4: distPromo[2]++; break;
						}
				}
				pawns=material[-1].byType[7],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(Math.max(geometry.R(pawns[i].p),geometry.F(pawns[i].p))) {
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
				for(var t=3;t<=5;t++)
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