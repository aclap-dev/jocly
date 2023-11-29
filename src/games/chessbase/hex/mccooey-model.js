
(function() {
	
	var posNames = {
		2:'a1',13:'b1',23:'c1',34:'d1',44:'e1',55:'f1',66:'g1',78:'h1',89:'i1',101:'k1',112:'l1',
		3:'a2',14:'b2',24:'c2',35:'d2',45:'e2',56:'f2',67:'g2',79:'h2',90:'i2',102:'k2',113:'l2',
		4:'a3',15:'b3',25:'c3',36:'d3',46:'e3',57:'f3',68:'g3',80:'h3',91:'i3',103:'k3',114:'l3',
		5:'a4',16:'b4',26:'c4',37:'d4',47:'e4',58:'f4',69:'g4',81:'h4',92:'i4',104:'k4',115:'l4',
		6:'a5',17:'b5',27:'c5',38:'d5',48:'e5',59:'f5',70:'g5',82:'h5',93:'i5',105:'k5',116:'l5',
		7:'a6',18:'b6',28:'c6',39:'d6',49:'e6',60:'f6',71:'g6',83:'h6',94:'i6',106:'k6',117:'l6',
		       19:'b7',29:'c7',40:'d7',50:'e7',61:'f7',72:'g7',84:'h7',95:'i7',107:'k7',
		               30:'c8',41:'d8',51:'e8',62:'f8',73:'g8',85:'h8',96:'i8',
		                       42:'d9',52:'e9',63:'f9',74:'g9',86:'h9',
		                              53:'e10',64:'f10',75:'g10',
		                                       65:'f11',
	};
	
	var geometry = Model.Game.cbBoardGeometryHex([ 
       '     # + . # + .      ',
       '    + . # + . # +     ',
       '   . # + . # + . #    ',
       '  # + . # + . # + .   ',
       ' + . # + . # + . # +  ',
       '. # + . # + . # + . # ',
       ' + . # + . # + . # +  ',
       '  # + . # + . # + .   ',
       '   . # + . # + . #    ',
       '    + . # + . # +     ',
       '     # + . # + .      ' 
    ],posNames);
	
	var promo = {
		"1": { 7:1, 19:1, 30:1, 42:1, 53:1, 65:1, 75:1, 86:1, 96:1, 107:1, 117:1 },
		"-1": { 2:1, 13:1, 23:1, 34:1, 44:1, 55:1, 66:1, 78:1, 89:1, 101:1, 112:1 },
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
					initial: [{s:1,p:58}],
					epCatch: true,
				},
				
				1: {
					name: 'ipawn-w',
					aspect: 'pawn',
					graph: this.cbMCPawnGraph(geometry,1,2),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:23},{s:1,p:35},{s:1,p:46},{s:1,p:68},{s:1,p:79},{s:1,p:89}],
					epTarget: true,
				},
				
				2: {
					name: 'pawn-b',
					aspect: 'pawn',
					graph: this.cbMCPawnGraph(geometry,-1,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:62}],
					epCatch: true,
				},

				3: {
					name: 'ipawn-b',
					aspect: 'pawn',
					graph: this.cbMCPawnGraph(geometry,-1,2),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:30},{s:-1,p:41},{s:-1,p:51},{s:-1,p:73},{s:-1,p:85},{s:-1,p:96}],
					epTarget: true,
				},
				
				4: {
					name: 'knight',
					graph: this.cbGLKnightGraph(geometry),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:45},{s:1,p:67},{s:-1,p:52},{s:-1,p:74}],
				},
				
				5: {
					name: 'bishop',
					graph: this.cbGLBishopGraph(geometry),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:55},{s:1,p:56},{s:1,p:57},{s:-1,p:65},{s:-1,p:64},{s:-1,p:63}],
				},

				6: {
					name: 'rook',
					graph: this.cbGLRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:34},{s:1,p:78},{s:-1,p:42},{s:-1,p:86}],
					castle: true,
				},

				7: {
					name: 'queen',
					graph: this.cbGLQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:44},{s:-1,p:53}],
				},
				
				8: {
					name: 'king',
					isKing: true,
					graph: this.cbGLKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:66},{s:-1,p:75}],
				},
				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==1)
					return [0];
				else if(piece.t==3)
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
	
})();
