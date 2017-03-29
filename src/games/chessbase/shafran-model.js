
(function() {
	
	var posNames = {
		2:'a1',11:'b1',21:'c1',30:'d1',40:'e1',
		3:'a2',12:'b2',22:'c2',31:'d2',41:'e2',50:'f2',
		4:'a3',13:'b3',23:'c3',32:'d3',42:'e3',51:'f3',61:'g3',
		5:'a4',14:'b4',24:'c4',33:'d4',43:'e4',52:'f4',62:'g4',71:'h4',
		6:'a5',15:'b5',25:'c5',34:'d5',44:'e5',53:'f5',63:'g5',72:'h5',82:'i5',
		7:'a6',16:'b6',26:'c6',35:'d6',45:'e6',54:'f6',64:'g6',73:'h6',83:'i6',
		       17:'b7',27:'c7',36:'d7',46:'e7',55:'f7',65:'g7',74:'h7',84:'i7',
		               28:'c8',37:'d8',47:'e8',56:'f8',66:'g8',75:'h8',85:'i8',
		                       38:'d9',48:'e9',57:'f9',67:'g9',76:'h9',86:'i9',
		                               49:'e10',58:'f10',68:'g10',77:'h10',87:'i10',
		65:'f11',
	};
	
	var geometry = Model.Game.cbBoardGeometryHex([ 

       '    # . + # . +     ',
       '   . + # . + # .    ',
       '  + # . + # . + #   ',
       ' # . + # . + # . +  ',
       '. + # . + # . + # . ',
       ' # . + # . + # . +  ',
       '  + # . + # . + #   ',
       '   . + # . + # .    ',
       '    # . + # . +     ',
    ],posNames);
	
	var promo = {
		"1": { 7:1, 17:1, 28:1, 38:1, 49:1, 58:1, 68:1, 77:1, 87:1 },
		"-1": { 2:1, 11:1, 21:1, 30:1, 40:1, 50:1, 61:1, 71:1, 82:1 },
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
					name: 'pawn-w',
					aspect: 'pawn',
					graph: this.cbMCPawnGraph(geometry,1,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:3},{s:1,p:83}],
					epCatch: true,
				},
				
				1: {
					name: 'ipawn-w',
					aspect: 'pawn',
					graph: this.cbMCPawnGraph(geometry,1,2),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:12},{s:1,p:22},{s:1,p:62},{s:1,p:72}],
					epTarget: true,
				},
				
				2: {
					name: 'pawn-b',
					aspect: 'pawn',
					graph: this.cbMCPawnGraph(geometry,-1,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:6},{s:-1,p:86}],
					epCatch: true,
				},

				3: {
					name: 'ipawn-b',
					aspect: 'pawn',
					graph: this.cbMCPawnGraph(geometry,-1,2),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:16},{s:-1,p:27},{s:-1,p:76},{s:-1,p:67}],
					epTarget: true,
				},
								
				4: {
					name: 'knight',
					graph: this.cbGLKnightGraph(geometry),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:11},{s:1,p:61},{s:-1,p:28},{s:-1,p:77}],
				},
				
				5: {
					name: 'bishop',
					graph: this.cbGLBishopGraph(geometry),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:21},{s:1,p:50},{s:1,p:71},{s:-1,p:17},{s:-1,p:38},{s:-1,p:68}],
				},

				6: {
					name: 'rook',
					graph: this.cbGLRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:2},{s:1,p:82},{s:-1,p:7},{s:-1,p:87}],
					castle: true,
				},

				7: {
					name: 'queen',
					graph: this.cbGLQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:30},{s:-1,p:58}],
				},
				
				8: {
					name: 'king',
					isKing: true,
					graph: this.cbGLKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:40},{s:-1,p:49}],
				},
				
				9: {
					name: 'icpawn-w',
					aspect: 'pawn',
					graph: this.cbMCPawnGraph(geometry,1,3),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:31},{s:1,p:41},{s:1,p:51}],
					epTarget: true,
				},
				
				10: {
					name: 'icpawn-b',
					aspect: 'pawn',
					graph: this.cbMCPawnGraph(geometry,-1,3),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:37},{s:-1,p:48},{s:-1,p:57}],
					epTarget: true,
				},
			},
			
			castle: {
				"40/2": {k:[30,21],r:[11,21,30],Xn:"O-O"},
				"40/82": {k:[50,61],r:[71,61,50],Xn:"O-O"},
				
				"49/87": {k:[58,68],r:[77,68,58],n:"O-O"},
				"49/7": {k:[38,28],r:[17,28,38],n:"O-O"},
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==1 || piece.t==9)
					return [0];
				else if(piece.t==3 || piece.t==10)
					return [2];
				else if(piece.t==0 && (move.t in promo[1]))
					return [4,5,6,7];
				else if(piece.t==2 && (move.t in promo[-1]))
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
	
	var extraCastle={
		2:{k:[11],r:[11,21]},82:{k:[71],r:[61]},
		87:{k:[77],r:[68]},7:{k:[17],r:[28]}
	}
	
	var SuperModelBoardGenerateMoves=Model.Board.GenerateMoves;
	Model.Board.GenerateMoves = function(aGame) {
		SuperModelBoardGenerateMoves.apply(this,arguments); // call regular GenerateMoves method
		if(!this.castled[this.mWho]) {
			for(var i=0;i<this.mMoves.length;i++) {
				var move=this.mMoves[i];
				var extra = extraCastle[move.cg];
				if(extra) {
					var kIndex=this.board[move.f];
					var kPiece=this.pieces[kIndex];
					this.board[move.f]=-1;
					this.board[extra.k[0]]=kIndex;
					kPiece.p=extra.k[0];
					
					var inCheck=this.cbGetAttackers(aGame,kPiece.p,this.mWho,true).length>0;
					if(!inCheck) {
						var rIndex=this.board[move.cg];
						var rPiece=this.pieces[rIndex];
						this.board[move.cg]=-1;
						this.board[extra.r[0]]=rIndex;
						rPiece.p=extra.r[0];
						
						var oppInCheck=this.cbGetAttackers(aGame,this.kings[-this.mWho],-this.mWho,true).length>0;
						this.mMoves.push({
							f: move.f,
							t: extra.k[0],
							c: null,
							ck: oppInCheck,
							a: 'K',
						});

						this.board[extra.r[0]]=-1;
						this.board[move.cg]=rIndex;
						rPiece.p=move.cg;						
					}
					this.board[extra.k[0]]=-1;
					this.board[move.f]=kIndex;
					kPiece.p=move.f;
				}
			}
		}
	}
	
	Model.Game.wbExtraCastleRook={ // rook identification and displacement from king destination
		11:{r0:2,r:21},71:{r0:82,r:61},
		17:{r0:7,r:28},77:{r0:87,r:68},
	}
	
	var SuperModelBoardApplyMove=Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {
		if(move.a=='K' && !this.castled[this.mWho] && move.cg===undefined) {
			var dc=aGame.g.distGraph[move.t][move.f];
			if(dc==3) {
				var kPiece=this.pieces[this.board[move.f]];
				this.board[move.f]=-1;
				this.zSign=aGame.zobrist.update(this.zSign,"board",kPiece.i,move.f);
				this.board[move.t]=kPiece.i;
				this.zSign=aGame.zobrist.update(this.zSign,"board",kPiece.i,move.t);
				kPiece.p=move.t;
				this.kings[this.mWho]=kPiece.p;
				var extra=aGame.wbExtraCastleRook[move.t];
				var rPiece=this.pieces[this.board[extra.r0]];
				this.board[extra.r0]=-1;
				this.zSign=aGame.zobrist.update(this.zSign,"board",rPiece.i,extra.r0);
				this.board[extra.r]=rPiece.i;
				this.zSign=aGame.zobrist.update(this.zSign,"board",rPiece.i,extra.r);
				rPiece.p=extra.r;				
				this.check=!!move.ck;
				this.castled[this.mWho]=true;
				return;
			}
		}
		SuperModelBoardApplyMove.apply(this,arguments);
	}

	
})();