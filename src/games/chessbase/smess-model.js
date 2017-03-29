
(function() {
	
	var geometry = Model.Game.cbBoardGeometrySmess(7,8);
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'ninny',
					aspect: 'sm-pawn',
					graph: this.cbSmessPieceGraph(geometry,false),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:7},{s:1,p:8},{s:1,p:9},{s:1,p:10},{s:1,p:11},{s:1,p:12},{s:1,p:13},
					          {s:-1,p:42},{s:-1,p:43},{s:-1,p:44},{s:-1,p:45},{s:-1,p:46},{s:-1,p:47},{s:-1,p:48},
					          ],
				},
				
				1: {
					name: 'numskull',
					aspect: 'sm-skull',
					graph: this.cbSmessPieceGraph(geometry,true),
					value: 4,
					abbrev: 'R',
					initial: [{s:1,p:1},{s:1,p:2},{s:1,p:4},{s:1,p:5},{s:-1,p:50},{s:-1,p:51},{s:-1,p:53},{s:-1,p:54}],
				},

				2: {
					name: 'brain',
					aspect: 'sm-brain',
					isKing: true,
					graph: this.cbSmessPieceGraph(geometry,false),
					abbrev: 'K',
					initial: [{s:1,p:3},{s:-1,p:52}],
				},
				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==0 && (move.t in aGame.cbSmessPromoPoss[piece.s]))
					return [1];
				return [];
			},

			evaluate: function(aGame,evalValues,material) {
				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				
				if(white[0]==0 && white[1]==0 && black[0]==0 && black[1]==0) {
					this.mFinished=true;
					this.mWinner=JocGame.DRAW;					
				}
				
				// check 50 moves without capture
				if(this.noCaptCount>=100) {
					this.mFinished=true;
					this.mWinner=JocGame.DRAW;					
				}
				
				// motivate pawns to reach promotion
				var distPromo=aGame.cbUseTypedArrays?new Int8Array(5):[0,0,0,0,0];
				var distPromo0=aGame.cbVar.geometry.distPromo;
				
				var pawns=material[1].byType[0],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(distPromo0[1][pawns[i].p]) {
						case 2: distPromo[0]++; break;
						case 3: distPromo[1]++; break;
						case 4: distPromo[2]++; break;
						case 5: distPromo[3]++; break;
						case 6: distPromo[4]++; break;
						}
				}
				pawns=material[-1].byType[2],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(distPromo0[-1][pawns[i].p]) {
						case 1: distPromo[0]--; break;
						case 2: distPromo[1]--; break;
						case 3: distPromo[2]--; break;
						case 4: distPromo[3]--; break;
						case 5: distPromo[4]--; break;
						}
				}
				if(distPromo[0]!=0)
					evalValues['distPawnPromo1']=distPromo[0];
				if(distPromo[1]!=0)
					evalValues['distPawnPromo2']=distPromo[1];
				if(distPromo[2]!=0)
					evalValues['distPawnPromo3']=distPromo[2];
				if(distPromo[3]!=0)
					evalValues['distPawnPromo4']=distPromo[3];
				if(distPromo[4]!=0)
					evalValues['distPawnPromo5']=distPromo[4];
				
			},
		};
	}
	
})();