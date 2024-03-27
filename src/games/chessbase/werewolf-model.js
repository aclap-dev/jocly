
(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(8,8);
	
	Model.Game.cbDefine = function() {
		
		var wolf = this.cbConstants.FLAG_SPECIAL | this.cbConstants.FLAG_SPECIAL_CAPTURE | this.cbConstants.FLAG_THREAT; // wolf-mode flags

		var p = this.cbPiecesFromFEN(geometry, 'rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR');

		var ww = p.addPiece({
			name: 'werewolf',
			aspect: 'fr-wolf',
			graph: this.cbMergeGraphs(geometry,
				this.cbLongRangeGraph(geometry,
					[[1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],null,null,3),
				this.cbShortRangeGraph(geometry,
					[[2,0],[0,2],[-2,0],[0,-2],[2,2],[2,-2],[-2,2],[-2,-2]],null,wolf)
				),
			value: 10,
			abbrev: 'W',
			initial: [{s:1,p:3},{s:-1,p:59}],
		});

		return {
			
			geometry: geometry,
			
			pieceTypes: p.pieceTypes,
			
			promote: function(aGame,piece,move) {
				if(move.c !== null && this.pieces[move.c].t == ww   // captured Werewolf
					&& move.a != 'W' && move.a != 'K') // by non-Werewolf other than King
					return [ww];                       // so promote to one
				else if(piece.t==0 && geometry.R(move.t)==7)
					return [4,2,3];
				else if(piece.t==1 && geometry.R(move.t)==0)
					return [4,2,3];
				return [];
			},

			castle: p.castle,
			
			evaluate: function(aGame,evalValues,material,pieceCount) {
				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				if(pieceCount[1]==1) { // white king single
					if(!black[2] && !black[3] && !black[6] && !black[7] && (black[4]+black[5]<2 || black[5]<2)) {
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				if(pieceCount[-1]==1) { // black king single
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

				// Bishop pair (penalize single Bishop)
				if(white[5]==1) evalValues.pieceValue-=0.25;
				if(black[5]==1) evalValues.pieceValue+=0.25;
				
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

	Model.Board.customGen = function(moves, move, aBoard) {
		var mid = move.f + move.t >> 1; // jumped-over square
		var victim = aBoard.board[mid];

		if(victim < 0) return; // slide did already reach move.t

		moves.push({ // reach target through jump
			f: move.f,
			t: move.t,
			c: move.c,
			a: move.a
		});

		if(aBoard.pieces[victim].s != aBoard.mWho) // jumped over foe
			moves.push({ // also try to capture it
				f: move.f,
				t: move.t,
				c: move.c,
				via: mid,
				kill: victim,
				a: move.a
			});
	}
})();
