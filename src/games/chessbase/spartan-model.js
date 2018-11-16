
(function(){

	var geometry=Model.Game.cbBoardGeometryGrid(8,8);

	Model.Game.cbDefine=function(){

		var $this = this;

		function HoplitGraph() {
			var graph = $this.cbShortRangeGraph(geometry, [[2,-2],[-2,-2]], 0, $this.cbConstants.FLAG_MOVE ); // double pushes
			for(var pos=0;pos<geometry.boardSize;pos++) {
				if(pos < 48 || pos >= 56) graph[pos] = [];
			}
                        var graph2 = $this.cbShortRangeGraph(geometry, [[1,-1],[-1,-1]], 0, $this.cbConstants.FLAG_MOVE ); // non-captures
			graph = $this.cbMergeGraphs(geometry, graph, graph2 );
			graph2 = $this.cbShortRangeGraph(geometry, [[0,-1]], 0, $this.cbConstants.FLAG_CAPTURE ); // captures
			return $this.cbMergeGraphs(geometry, graph, graph2 );
		}

    return{
      geometry:geometry,
      pieceTypes:{
				0: {
					name: 'pawn',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: false,
				},
				
				1: {
					name: 'ipawn',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:8},{s:1,p:9},{s:1,p:10},{s:1,p:11},{s:1,p:12},{s:1,p:13},{s:1,p:14},{s:1,p:15}],
					epTarget: false,
				},
				
				2: {
					name: 'hoplit',
					aspect: 'fr-hoplit',
					graph: HoplitGraph(geometry),
					value: 1,
					abbrev: '',
					fenAbbrev: 'H',
					epCatch: false,
				},

				3: {
					name: 'ihoplit',
					aspect: 'fr-hoplit',
					graph: HoplitGraph(geometry),
					value: 1,
					abbrev: 'H',
					fenAbbrev: 'H',
					initial: [{s:-1,p:48},{s:-1,p:49},{s:-1,p:50},{s:-1,p:51},{s:-1,p:52},{s:-1,p:53},{s:-1,p:54},{s:-1,p:55}],
					epTarget: false,
				},
				
				4: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 3.25,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:6}],
				},
				
				5: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.5,
					abbrev: 'B',
					initial: [{s:1,p:2},{s:1,p:5}],
				},

				6: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:7}],
					castle: true,
				},

				7: {
					name: 'queen',
					aspect: 'fr-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9.5,
					abbrev: 'Q',
					initial: [{s:1,p:3}],
				},
				
				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: 1,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:4}],
				},
				
				9: {
					name: 'captain',
					aspect: 'fr-lighthouse',
					graph: this.cbShortRangeGraph(geometry,[[0,-1],[0,1],[1,0],[-1,0],[-2,0],[0,2],[0,-2],[2,0]]),
					value: 3.1,
					abbrev: 'C',
					initial: [{s:-1,p:59},{s:-1,p:60}],
				},
				
				10: {
					name: 'lieutenant',
					aspect: 'fr-admiral',
					graph: this.cbMergeGraphs(geometry,
            						this.cbShortRangeGraph(geometry, [[-1,0],[1,0]], 0, this.cbConstants.FLAG_MOVE ),
							this.cbShortRangeGraph(geometry, [[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]])),
					value: 3.6,
					abbrev: 'L',
					initial: [{s:-1,p:56},{s:-1,p:63}],
				},
				
				11: {
					name: 'general',
					aspect: 'fr-proper-crowned-rook',
					graph: this.cbMergeGraphs(geometry,
            						this.cbRookGraph(geometry),
							this.cbShortRangeGraph(geometry, [[1,1], [-1,1], [1,-1], [-1,-1]])),
					value: 7,
					abbrev: 'G',
					initial: [{s:-1,p:57}],
				},
				
				12: {
					name: 'warlord',
					aspect: 'fr-proper-cardinal',
					graph: this.cbMergeGraphs(geometry,
            						this.cbBishopGraph(geometry),
							this.cbKnightGraph(geometry)),
					value: 8.75,
					abbrev: 'W',
					initial: [{s:-1,p:62}],
				},

				13: {
					name: 'king',
					aspect: 'fr-king',
					isKing: 1,
					graph: this.cbKingGraph(geometry),
					value: 4.50,
					abbrev: 'K',
					initial: [{s:-1,p:58}],
				},
				
				14: {
					name: 'king',
					aspect: 'fr-king',
					isKing: 2,
					graph: this.cbKingGraph(geometry),
					value: 4.50,
					abbrev: 'K',
					initial: [{s:-1,p:61}],
				},
				
			},

			promote: function(aGame,piece,move) {
				if(piece.t==1)
					return [0];
				else if(piece.t==3)
					return [2];
				else if(piece.t==0 && geometry.R(move.t)==7)
					return [4,5,6,7];
				else if(piece.t==2 && geometry.R(move.t)==0) {
					if(this.kings[-1] < 0)    // King #1 missing
						return [9,10,11,12,13]; // so can promote to K #1
					if(this.kings[-2] < 0)    // King #2 missing
						return [9,10,11,12,14]; // so can promote to K #2
					return [9,10,11,12];
				}
				return [];
			},

			castle:{
				"4/0":{k:[3,2],r:[1,2,3],n:"O-O-O"},
				"4/7":{k:[5,6],r:[6,5],n:"O-O"},
			},

			evaluate: function(aGame,evalValues,material,totalPieces) {
				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				if(totalPieces[1] == 1) { // white king single
					var n = totalPieces[-1];
					if(n<3 && (black[10] || n==1)) { // KKL or KK
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				if(totalPieces[-1] == 1) { // black king single
					var n = totalPieces[1];
					if(n<4 && (white[4]==2 || n==2 && white[4]+white[5])) { // KNNK, KNK or KBK
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
				if(black[12] + black[13] == 2) {
					var diff = evalValues["pieceValue"];
					var sum = diff/evalValues["pieceValueRatio"] - 1;
					evalValues["pieceValue"] -= 4.5; // value of spare King
					evalValues["pieceValueRatio"] = (diff - 4.5)/(sum + 5.5);
				}
			},
			
		};
	}

	function TrackKings(thiss,move) {
		if(move.c != null) { // test if King was captured
			if(move.t == thiss.kings[-1]) thiss.kings[-1] = -1; else
			if(move.t == thiss.kings[-2]) thiss.kings[-2] = -1;
		}
	}

	var OriginalApplyMove = Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {
		TrackKings(this,move);
		OriginalApplyMove.apply(this, arguments);
	}

	var OriginalQuickApply = Model.Board.cbQuickApply;
	Model.Board.cbQuickApply = function(aGame,move) {
		var saved = {       // remember King locations
			firstKing:  this.kings[-1],
			secondKing: this.kings[-2],
		};
		TrackKings(this,move);
		var tmp = OriginalQuickApply.apply(this, arguments);
		tmp.unshift(saved);
		return tmp;
	}

	var OriginalQuickUnapply = Model.Board.cbQuickUnapply;
	Model.Board.cbQuickUnapply = function(aGame,undo) {
		var saved = undo.shift();
		this.kings[-1] = saved.firstKing; // restore King locations
		this.kings[-2] = saved.secondKing;
		OriginalQuickUnapply.call(this, aGame, undo);
	}

	var OriginalGetAttackers = Model.Board.cbGetAttackers;
	Model.Board.cbGetAttackers = function(aGame,pos,who,isKing) {
		if(isKing == 100 && who == -1) { // called to see if Spartans in check
			if(this.kings[-2] < 0) return OriginalGetAttackers.call(this, aGame, this.kings[-1], -1, true);
			if(this.kings[-1] < 0) return OriginalGetAttackers.call(this, aGame, this.kings[-2], -1, true);
			var checkers = OriginalGetAttackers.call(this, aGame, this.kings[-1], -1, true);
			if(checkers.length <= 0) return checkers; // King #1 not attacked => OK
			return OriginalGetAttackers.call(this, aGame, this.kings[-2], -1, true);
		}
		return OriginalGetAttackers.apply(this, arguments);
	}

	var OriginalSEE = Model.Board.cbStaticExchangeEval;
	Model.Board.cbStaticExchangeEval = function(aGame,pos,who,isKing) {
		royal = this.kings[-2] < 0 ? 13 : // detect if only one King
		        this.kings[-1] < 0 ? 14 : 0; // and if so, which one
		if(!royal) // more Kings; use configured value for sorting and scoring
			return OriginalSEE.apply(this,arguments);
		var oldValue = aGame.g.pTypes[royal].value;

		aGame.g.pTypes[royal].value = 100; // use high value for last remaining King
		var tmp = OriginalSEE.apply(this,arguments);
		aGame.g.pTypes[royal].value = oldValue;
		return tmp;
	}

	var OriginalEvaluate = Model.Board.Evaluate;
	Model.Board.Evaluate = function(aGame) {
		var king = (this.kings[-2] > this.kings[-1] ? this.kings[-2] : this.kings[-1]); // backward-most (present) King
		var saved = this.kings[-1];
		this.kings[-1] = king; // use safest (?) King in eval
		OriginalEvaluate.apply(this, arguments);
		this.kings[-1] = saved; // be sure not to mess with the original tracking
	}

})();
