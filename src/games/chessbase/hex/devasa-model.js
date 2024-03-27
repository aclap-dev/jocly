
(function() {
	
	var posNames = {
		
		108:'a1',109:'b1',110:'c1',111:'d1',112:'e1',113:'f1',114:'g1',115:'h1',116:'i1',
		94:'a2',95:'b2',96:'c2',97:'d2',98:'e2',99:'f2',100:'g2',101:'h2',102:'i2',
		81:'a3',82:'b3',83:'c3',84:'d3',85:'e3',86:'f3',87:'g3',88:'h3',89:'i3',
		67:'a4',68:'b4',69:'c4',70:'d4',71:'e4',72:'f4',73:'g4',74:'h4',75:'i4',
		54:'a5',55:'b5',56:'c5',57:'d5',58:'e5',59:'f5',60:'g5',61:'h5',62:'i5',
		40:'a6',41:'b6',42:'c6',43:'d6',44:'e6',45:'f6',46:'g6',47:'h6',48:'i6',
		27:'a7',28:'b7',29:'c7',30:'d7',31:'e7',32:'f7',33:'g7',34:'h7',35:'i7',
		13:'a8',14:'b8',15:'c8',16:'d8',17:'e8',18:'f8',19:'g8',20:'h8',21:'i8',
		0:'a9',1:'b9',2:'c9',3:'d9',4:'e9',5:'f9',6:'g9',7:'h9',8:'i9',
	};
	
	var geometry = Model.Game.cbBoardGeometryHex([

	    ". + # . + # . + #",
	    " # . + # . + # . +",
	    "  + # . + # . + # .",
	    "   . + # . + # . + #",
	    "    # . + # . + # . +",
	    "     + # . + # . + # .",
	    "      . + # . + # . + #",
	    "       # . + # . + # . +",
	    "        + # . + # . + # ."
	],posNames);
	
	var promo = {
		"1": { 0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1 },
		"-1": { 108:1, 109:1, 110:1, 111:1, 112:1, 113:1, 114:1, 115:1, 116:1 },
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
					graph: this.cbBRPawnGraph(geometry,1,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
				},
				
				1: {
					name: 'ipawn-w',
					aspect: 'pawn',
					graph: this.cbDVInitialPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:81},{s:1,p:82},{s:1,p:83},{s:1,p:84},{s:1,p:85},{s:1,p:86},{s:1,p:87},{s:1,p:88},{s:1,p:89}],
					epTarget: true,
				},
				
				2: {
					name: 'pawn-b',
					aspect: 'pawn',
					graph: this.cbBRPawnGraph(geometry,-1,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: true,
				},

				3: {
					name: 'ipawn-b',
					aspect: 'pawn',
					graph: this.cbDVInitialPawnGraph(geometry,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:27},{s:-1,p:28},{s:-1,p:29},{s:-1,p:30},{s:-1,p:31},{s:-1,p:32},{s:-1,p:33},{s:-1,p:34},{s:-1,p:35}],
					epTarget: true,
				},
				
				4: {
					name: 'knight',
					graph: this.cbGLKnightGraph(geometry),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:109},{s:1,p:115},{s:-1,p:1},{s:-1,p:7}],
				},
				
				5: {
					name: 'bishop',
					graph: this.cbGLBishopGraph(geometry),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:110},{s:1,p:112},{s:1,p:114},{s:-1,p:2},{s:-1,p:4},{s:-1,p:6}],
				},

				6: {
					name: 'rook',
					graph: this.cbGLRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:108},{s:1,p:116},{s:-1,p:0},{s:-1,p:8}],
					castle: true,
				},

				7: {
					name: 'queen',
					graph: this.cbGLQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:111},{s:-1,p:5}],
				},
				
				8: {
					name: 'king',
					isKing: true,
					graph: this.cbGLKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:113},{s:-1,p:3}],
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

			castle: {
				"98/93": {k:[97,96],r:[94,95,96,97],n:"O-O-O"},
				"98/101": {k:[99,100],r:[100,99],n:"O-O"},
				"4/9": {k:[5,6],r:[8,7,6,5],n:"O-O-O"},
				"4/1": {k:[3,2],r:[2,3],n:"O-O"},
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
