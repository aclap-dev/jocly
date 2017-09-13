
(function() {
	
	var posNames = {
		93:'a1',94:'b1',95:'c1',96:'d1',97:'e1',98:'f1',99:'g1',100:'h1',101:'i1',
		79:'a2',80:'b2',81:'c2',82:'d2',83:'e2',84:'f2',85:'g2',86:'h2',87:'i2',88:'j2',
		66:'a3',67:'b3',68:'c3',69:'d3',70:'e3',71:'f3',72:'g3',73:'h3',74:'i3',75:'j3',76:'k3',
		52:'a4',53:'b4',54:'c4',55:'d4',56:'e4',57:'f4',58:'g4',59:'h4',60:'i4',61:'j4',62:'k4',63:'l4',
		39:'a5',40:'b5',41:'c5',42:'d5',43:'e5',44:'f5',45:'g5',46:'h5',47:'i5',48:'j5',49:'k5',50:'l5',
		26:'b6',27:'c6',28:'d6',29:'e6',30:'f6',31:'g6',32:'h6',33:'i6',34:'j6',35:'k6',36:'l6',
		14:'c7',15:'d7',16:'e7',17:'f7',18:'g7',19:'h7',20:'i7',21:'j7',22:'k7',23:'l7',
		1:'d8',2:'e8',3:'f8',4:'g8',5:'h8',6:'i8',7:'j8',8:'k8',9:'l8',
	};
	
	var geometry = Model.Game.cbBoardGeometryHex([
	    "   # . + # . + # . +     ",
	    "  . + # . + # . + # .    ",
	    " + # . + # . + # . + #   ",
	    "# . + # . + # . + # . +  ",
	    " + # . + # . + # . + # . ",
	    "  . + # . + # . + # . +  ",
	    "   # . + # . + # . + #   ",
	    "    + # . + # . + # .    ",
	],posNames);
	
	var promo = {
		"1": { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1 },
		"-1": { 93:1, 94:1, 95:1, 96:1, 97:1, 98:1, 99:1, 100:1, 101:1 },
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
					graph: this.cbBRInitialPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:79},{s:1,p:80},{s:1,p:81},{s:1,p:82},{s:1,p:83},{s:1,p:84},{s:1,p:85},{s:1,p:86},{s:1,p:87},{s:1,p:88}],
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
					graph: this.cbBRInitialPawnGraph(geometry,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:14},{s:-1,p:15},{s:-1,p:16},{s:-1,p:17},{s:-1,p:18},{s:-1,p:19},{s:-1,p:20},{s:-1,p:21},{s:-1,p:22},{s:-1,p:23}],
					epTarget: true,
				},
				
				4: {
					name: 'knight',
					graph: this.cbGLKnightGraph(geometry),
					value: 2.9,
					abbrev: 'N',
					initial: [{s:1,p:94},{s:1,p:100},{s:-1,p:2},{s:-1,p:8}],
				},
				
				5: {
					name: 'bishop',
					graph: this.cbGLBishopGraph(geometry),
					value: 3.1,
					abbrev: 'B',
					initial: [{s:1,p:95},{s:1,p:97},{s:1,p:99},{s:-1,p:3},{s:-1,p:5},{s:-1,p:7}],
				},

				6: {
					name: 'rook',
					graph: this.cbGLRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:93},{s:1,p:101},{s:-1,p:1},{s:-1,p:9}],
					castle: true,
				},

				7: {
					name: 'queen',
					graph: this.cbGLQueenGraph(geometry),
					value: 9,
					abbrev: 'Q',
					initial: [{s:1,p:96},{s:-1,p:6}],
				},
				
				8: {
					name: 'king',
					isKing: true,
					graph: this.cbGLKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:98},{s:-1,p:4}],
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
