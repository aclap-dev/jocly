/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 


(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(10,10);
	
	Model.Game.cbDefine=function(){
        p = this.cbPiecesFromFEN(geometry, "aw6wm/ronbqkbnor/pppppppppp/10/10/10/10/PPPPPPPPPP/RONBQKBNOR/AW6WM");
        p.setValues({P:0.9, N:2.9, B:3.7, R:5, Q:9.6, M:8.5, A:7, W:4.2, O:4.7});

        var ww = p.addPiece({
			name: 'leo',
			aspect: 'fr-star',
			graph: this.cbLongRangeGraph(geometry,[[0,-1],[0,1],[-1,0],[1,0],[1,1],[1,-1],[-1,-1],[-1,1]],null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE),
			value: 5.5,
			abbrev: 'L',
			initial: [{s:1,p:2},{s:1,p:7},{s:-1,p:92},{s:-1,p:97}],
		});
        
		return {
			
			geometry: geometry,
			
			pieceTypes: p.pieceTypes,
			
			castle: {
				"15/10": {k:[14],r:[15],n:"O-O-O",extra:-2},
				"15/19": {k:[16],r:[15],n:"O-O",extra:-2},
				"85/80": {k:[84],r:[85],n:"O-O-O",extra:-2},
				"85/89": {k:[86],r:[85],n:"O-O",extra:-2},
			},

			promote: function(aGame,piece,move) {

                //Queen, Marshall, Archbishop, Rook, Champion, Leo, Knight, Bishop, or Wizard
				if(piece.t==0 && geometry.R(move.t)==9)
					return [7,4,2,8,6,11,5,3,9];
				else if(piece.t==1 && geometry.R(move.t)==0)
					return [7,4,2,8,6,11,5,3,9];
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
				
				// check 64 moves without capture
				if(this.noCaptCount>=128) {
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
