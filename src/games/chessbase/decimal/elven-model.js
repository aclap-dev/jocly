
(function(){

	var geometry=Model.Game.cbBoardGeometryGrid(10,10);

	Model.Game.minimumBridge=10; // switch on anti-trading; no side catch allows it

	Model.Game.cbDefine=function(){

		var hitrun = this.cbConstants.FLAG_HITRUN;

		var p = this.cbPiecesFromFEN(geometry, 'r3k4r/ynbdqlhbny/pppppppppp/10/10/10/10/PPPPPPPPPP/YNBHLQDBNY/R4K3R');

		p.addMoves('lion',this.cbShortRangeGraph(geometry,[[1,0],[0,1],[-1,0],[0,-1], [1,1],[1,-1],[-1,1],[-1,-1]], null, hitrun));
		p.setProperty('lion','value',15);     // upgrade value of Lion, to account for hit & run capture
		p.setProperty('lion','antiTrade',-1); // trading ban, including counterstrike

		p.setValues({Y:'dwarf',H:'elf',D:'goblin',L:'warlock'},'name');
		p.setValues({H:'E',D:'G',L:'W'},'abbrev'); p.setProperty('man','abbrev','D');

		p.promoZone=3;
		p.promoChoice = [7,6,8,2]; // B(2) !D(3) !H(4) !L(5) N(6) Q(7) R(8)

		return{
			geometry:geometry,

			pieceTypes: p.pieceTypes,

			promote: p.promote,

			castle: p.castle,

			evaluate: function(aGame,evalValues,material,totalPieces) {
				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				if(totalPieces[1] == 1) { // white king single
					var n = totalPieces[-1];
					if(n<4 && (black[6]==2 || n==2 && black[6]+black[2] || n==1)) {
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				if(totalPieces[-1] == 1) { // black king single
					var n = totalPieces[1];
					if(n<4 && (white[6]==2 || n==2 && white[6]+white[2])) {
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
				if(white[2]==1) evalValues.pieceValue-=0.25;
				if(black[2]==1) evalValues.pieceValue+=0.25;
				
				// motivate pawns to reach the promotion line
				var distPromo=aGame.cbUseTypedArrays?new Int8Array(3):[0,0,0];
				var height=geometry.height;
				var pawns=material[1].byType[0],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(height-geometry.R(pawns[i].p)) {
						case 4: distPromo[0]++; break;
						case 5: distPromo[1]++; break;
						case 6: distPromo[2]++; break;
						}
				}
				pawns=material[-1].byType[2],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(geometry.R(pawns[i].p)) {
						case 3: distPromo[0]--; break;
						case 4: distPromo[1]--; break;
						case 5: distPromo[2]--; break;
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
