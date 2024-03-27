
(function() {
	
	var geometry = Model.Game.cbBoardGeometryCylinder(16,4);
	
	var promo = {
		"1": { 11:1, 27:1, 43:1, 59:1, 12:1, 28:1, 44:1, 60:1 },
		"-1": { 52:1, 36:1, 20:1, 4:1, 51:1, 35:1, 19:1, 3:1 },
	}
	
	// for each side and position, calculate distance to promotion line
	var distPromo={	"1": {}, "-1": {} };
	var distance = geometry.GetDistances();
	["1","-1"].forEach(function(side) {
		for(var pos in geometry.confine) {
			var minDist=Infinity;
			for(var pos1 in promo[side]) {
				var dist=distance[pos][pos1];
				if(dist<minDist) {
					distPromo[side][pos]=dist;
					minDist=dist;
				}
			}
		}		
	});
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-cw',
					aspect: 'pawn',
					graph: this.cbCircularPawnGraph(geometry,true,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
				},
				
				1: {
					name: 'ipawn-cw',
					aspect: 'pawn',
					graph: this.cbCircularPawnGraph(geometry,true,2),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:5},{s:1,p:21},{s:1,p:37},{s:1,p:53},{s:-1,p:13},{s:-1,p:29},{s:-1,p:45},{s:-1,p:61}],
				},
				
				2: {
					name: 'pawn-ccw',
					aspect: 'pawn',
					graph: this.cbCircularPawnGraph(geometry,false,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
				},

				3: {
					name: 'ipawn-ccw',
					aspect: 'pawn',
					graph: this.cbCircularPawnGraph(geometry,false,2),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:2},{s:1,p:18},{s:1,p:34},{s:1,p:50},{s:-1,p:10},{s:-1,p:26},{s:-1,p:42},{s:-1,p:58}],
				},
				
				4: {
					name: 'knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:20},{s:1,p:19},{s:-1,p:27},{s:-1,p:28}],
				},
				
				5: {
					name: 'bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:36},{s:1,p:35},{s:-1,p:43},{s:-1,p:44}],
				},

				6: {
					name: 'rook',
					graph: this.cbCylinderRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:4},{s:1,p:3},{s:-1,p:11},{s:-1,p:12}],
					castle: true,
				},

				7: {
					name: 'queen',
					graph: this.cbMergeGraphs(geometry,this.cbCylinderRookGraph(geometry),this.cbBishopGraph(geometry)),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:51},{s:-1,p:60}],
				},
				
				8: {
					name: 'king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:52},{s:-1,p:59}],
				},
				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==1)
					return [0];
				else if(piece.t==3)
					return [2];
				else if(piece.s==1 && (piece.t==0 || piece.t==2) && (move.t in promo[1]))
					return [4,5,6,7];
				else if(piece.s==-1 && (piece.t==0 || piece.t==2) && (move.t in promo[-1]))
					return [4,5,6,7];
				return [];
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
				var distPromo0=aGame.cbUseTypedArrays?new Int8Array(3):[0,0,0];
				var pawns=material[1].byType[0],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++) {
						var dProm=distPromo[1][pawns[i].p];
						if(dProm>0 && dProm<4)
							distPromo0[dProm-1]++;
					}
				}
				pawns=material[-1].byType[2],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++) {
						var dProm=distPromo[-1][pawns[i].p];
						if(dProm>0 && dProm<4)
							distPromo0[dProm-1]--;
					}
				}
				if(distPromo0[0]!=0)
					evalValues['distPawnPromo1']=distPromo0[0];
				if(distPromo0[1]!=0)
					evalValues['distPawnPromo2']=distPromo0[1];
				if(distPromo0[2]!=0)
					evalValues['distPawnPromo3']=distPromo0[2];
				
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