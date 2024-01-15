
(function(){

  var geometry=Model.Game.cbBoardGeometryGrid(10,10);

  Model.Game.cbDefine=function(){

	var $this = this;
	var s = this.cbConstants.FLAG_STOP;
	var m = this.cbConstants.FLAG_MOVE;
	var c = this.cbConstants.FLAG_CAPTURE;
	var sc = this.cbConstants.FLAG_SPECIAL_CAPTURE;
	var sd = this.cbConstants.FLAG_CAPTURE_SELF;
	var se = this.cbConstants.FLAG_SPECIAL;

	function Rotate(vec, n) { // calculate queen step 'rotated' over n*45 degrees
		var x = vec[0], y = vec[1], h;
		for(var i=0; i<(n&7); i++) {
			h = x; x -= y; y += h; // rotate 45 degrees (expands by sqrt(2))
			if(x*y == 0) x >>= 1, y >>= 1; // renormalize when orthogonal
		}
		return [x,y];
	}

	function All4(dirSet) {
		var result = [];
		for(var i=0; i<dirSet.length; i++) {
			for(var j=0; j<4; j++) result.push(Rotate(dirSet[i],2*j));
		}
		return result;
	}

	var king = All4([[1,0],[1,1]]);
	var alibaba = All4([[2,0],[2,2]]);
	var camel = [[1,3],[1,-3],[-1,3],[-1,-3],[3,1],[3,-1],[-3,1],[-3,-1]];
	var zebra = [[2,3],[2,-3],[-2,3],[-2,-3],[3,2],[3,-2],[-3,2],[-3,-2]];

	function SkiGraph(geometry, stepSet, bend, flags1, flags2) { // two-stage slider move, possibly bent

		var graph = {};

		function SkiSlide(start, vec, flags, bend, iflags, range) { // trace out bent trajectory
			var path = [], corner = geometry.Graph(start, vec);
			if(corner != null) {
				var vec2 = Rotate(vec, bend);
				if(iflags >= 0 && iflags != s) path.push(corner | iflags); // for s do this later
				for(var n=1; n<range; n++) {
					var delta = [n*vec2[0], n*vec2[1]], pos = geometry.Graph(corner, delta);
					if(pos != null) {
						if(n == 1 && iflags == s) path.push(corner | s);
						path.push(pos | flags);
			}	}	}
			if(path.length > 0) graph[start].push($this.cbTypedArray(path));
		}

		for(pos=0; pos<geometry.boardSize; pos++) {
			graph[pos] = [];
			stepSet.forEach(function(vec){
				SkiSlide(pos, vec, flags2, bend, flags1, 9);
				if(bend & 3) SkiSlide(pos, vec, flags2, -bend, s, 9); // for bent: both forks
			});
		}
		return graph;
	}

	this.cbOnStaleMate = -1;// stalemating wins
	this.cbOnPerpetual = 1; // repeater loses
	this.cbMaxRepeats = 2;  // on first repeat

	return{

		geometry:geometry,

		pieceTypes:{
				0: {
					name: 'pawn-w',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: 0.8,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:20},{s:1,p:21},{s:1,p:23},{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:28},{s:1,p:29}],
				},

				1: {
					name: 'pawn-b',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,-1),
					value: 0.8,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:70},{s:-1,p:71},{s:-1,p:73},{s:-1,p:74},{s:-1,p:75},{s:-1,p:76},{s:-1,p:78},{s:-1,p:79}],
				},

				2: {
					name: 'firzan',
					aspect: 'fr-ferz',
					graph: this.cbShortRangeGraph(geometry, All4([[1,1]])),
					value: 1.25,
					abbrev: 'F',
					initial: [{s:1,p:15},{s:-1,p:84}],
				},

				3: {
					name: 'wazir',
					aspect: 'fr-wazir',
					graph: this.cbShortRangeGraph(geometry, All4([[0,1]])),
					value: 1.15,
					abbrev: 'W',
					initial: [{s:1,p:14},{s:-1,p:85}],
				},

				4: {
					name: 'alfil',
					aspect: 'fr-proper-elephant',
					graph: this.cbShortRangeGraph(geometry, All4([[2,2]])),
					value: 0.9,
					abbrev: 'A',
					initial: [{s:1,p:1},{s:-1,p:98}],
				},

				5: {
					name: 'dabbaba',
					aspect: 'fr-machine',
					graph: this.cbShortRangeGraph(geometry, All4([[2,0]])),
					value: 1,
					abbrev: 'D',
					initial: [{s:1,p:8},{s:-1,p:91}],
				},

				6: {
					name: 'knight',
					aspect: 'fr-knight',
					graph: this.cbKnightGraph(geometry),
					value: 2.75,
					abbrev: 'N',
					initial: [{s:1,p:4},{s:-1,p:95}],
				},

				7: {
					name: 'camel',
					aspect: 'fr-camel',
					graph: this.cbShortRangeGraph(geometry, camel),
					value: 2.5,
					abbrev: 'C',
					initial: [{s:1,p:5},{s:-1,p:94}],
				},

				8: {
					name: 'stork',
					aspect: 'fr-stork',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry, All4([[0,1]]), null, c),
						this.cbShortRangeGraph(geometry, All4([[2,2]]))
					),
					value: 2,
					abbrev: 'S',
					initial: [{s:1,p:2},{s:-1,p:97}],
				},

				9: {
					name: 'goat',
					aspect: 'fr-goat',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry, All4([[2,0]])),
						this.cbShortRangeGraph(geometry, All4([[1,1]]), null, m)
					),
					value: 1.75,
					abbrev: 'G',
					initial: [{s:1,p:7},{s:-1,p:92}],
				},

				10: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:13},{s:-1,p:86}],
				},

				11: {
					name: 'commoner',
					aspect: 'fr-man',
					graph: this.cbKingGraph(geometry),
					value: 2.65,
					abbrev: 'M',
					initial: [{s:1,p:16},{s:-1,p:83}],
				},

				12: {
					name: 'marquis',
					aspect: 'fr-ferz-knight',
					graph: this.cbMergeGraphs(geometry,
						this.cbKnightGraph(geometry),
						this.cbShortRangeGraph(geometry, All4([[1,1]]))
					),
					value: 5,
					abbrev: 'Ma',
					initial: [{s:1,p:11},{s:-1,p:88}],
				},

				13: {
					name: 'priest',
					aspect: 'fr-wazir-knight',
					graph: this.cbMergeGraphs(geometry,
						this.cbKnightGraph(geometry),
						this.cbShortRangeGraph(geometry, All4([[0,1]]))
					),
					value: 5,
					abbrev: 'Pr',
					initial: [{s:1,p:18},{s:-1,p:81}],
				},

				14: {
					name: 'chariot',
					aspect: 'fr-small-rook',
					graph: this.cbLongRangeGraph(geometry, All4([[0,1]]), null, null, 4),
					value: 4.25,
					abbrev: 'Ch',
					initial: [{s:1,p:0},{s:-1,p:99}],
				},

				15: {
					name: 'wagon',
					aspect: 'fr-gate',
					graph: SkiGraph(geometry, All4([[0,1]]), 0, s, m|c),
					value: 3.75,
					abbrev: 'Wa',
					initial: [{s:1,p:9},{s:-1,p:90}],
				},

				16: {
					name: 'guard',
					aspect: 'fr-corporal',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry, All4([[1,1]]), null, c),
						this.cbShortRangeGraph(geometry, All4([[0,1]]), null, m)
					),
					value: 1.3,
					abbrev: 'Gu',
					initial: [{s:1,p:22},{s:1,p:27},{s:-1,p:72},{s:-1,p:77}],
				},

				17: {
					name: 'dervish',
					aspect: 'fr-star',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry, alibaba),
						this.cbShortRangeGraph(geometry, [[0,0]], null, sd | 0x4000000)
					),
					value: 3,
					abbrev: 'Dv',
					initial: [{s:1,p:6},{s:-1,p:93}],
				},

				18: {
					name: 'scirocco',
					aspect: 'fr-saint',
					graph: this.cbMergeGraphs(geometry,
						this.cbBishopGraph(geometry),
						this.cbShortRangeGraph(geometry, All4([[0,1]]))
					),
					value: 5.25,
					abbrev: 'Sc',
					initial: [{s:1,p:12},{s:1,p:17},{s:-1,p:82},{s:-1,p:87}],
				},

				19: {
					name: 'tadpole',
					aspect: 'fr-bow',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry, All4([[1,0]]), null, c),
						this.cbShortRangeGraph(geometry, All4([[1,1],[3,0]]))
						),
					value: 4.25,
					abbrev: 'T',
				},

				20: {
					name: 'zig',
					aspect: 'fr-lighthouse',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry, All4([[1,0],[2,0]])),
						this.cbShortRangeGraph(geometry, All4([[2,2]]), null, se | 0x10000000)
					),
					value: 3.25,
					abbrev: 'Zi',
				},

				21: {
					name: 'zag',
					aspect: 'fr-small-bishop',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry, All4([[1,1],[2,2]])),
						this.cbShortRangeGraph(geometry, All4([[2,0]]), null, se | 0x10000000)
					),
					value: 3.25,
					abbrev: 'Za',
				},

				22: {
					name: 'bishop',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 3.5,
					abbrev: 'B',
				},

				23: {
					name: 'genie',
					aspect: 'fr-cannon',
					graph: this.cbMergeGraphs(geometry,
						this.cbLongRangeGraph(geometry, king,null,null,3),
						this.cbShortRangeGraph(geometry, king, null, sc | 0x20000000)
					),
					value: 12,
					abbrev: 'Gn',
				},

				24: {
					name: 'rook',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
				},

				25: {
					name: 'squirrel',
					aspect: 'fr-squirrel',
					graph: this.cbMergeGraphs(geometry,
						this.cbKnightGraph(geometry),
						this.cbShortRangeGraph(geometry, alibaba)
						),
					value: 7,
					abbrev: 'Sq',
				},

				26: {
					name: 'queen',
					aspect: 'fr-proper-queen',
					graph: this.cbQueenGraph(geometry),
					value: 9.5,
					abbrev: 'Q',
				},

				27: {
					name: 'lioness',
					aspect: 'fr-lion',
					graph: this.cbMergeGraphs(geometry,
						this.cbKingGraph(geometry),
						this.cbKnightGraph(geometry),
						this.cbShortRangeGraph(geometry, alibaba)
						),
					value: 11,
					abbrev: 'L',
				},

				28: {
					name: 'emperor',
					aspect: 'fr-emperor',
					isKing: true,
					graph: this.cbShortRangeGraph(geometry, All4([[2,2],[2,0],[1,0]])),
					abbrev: 'E',
				},

				29: {
					name: 'gnu',
					aspect: 'fr-buffalo',
					graph: this.cbMergeGraphs(geometry,
						this.cbShortRangeGraph(geometry, camel),
						this.cbKnightGraph(geometry)
					),
					value: 6.5,
					abbrev: 'Wi',
				},

				30: {
					name: 'duke',
					aspect: 'fr-marshall',
					graph: this.cbMergeGraphs(geometry,
						this.cbKnightGraph(geometry),
						this.cbLongRangeGraph(geometry, All4([[1,0]]), null, null, 4)
						),
					value: 8.25,
					abbrev: 'Dk',
				},

				31: {
					name: 'abbot',
					aspect: 'fr-cardinal',
					graph: this.cbMergeGraphs(geometry,
						this.cbKnightGraph(geometry),
						this.cbLongRangeGraph(geometry, All4([[1,1]]), null, null, 4)
						),
					value: 8,
					abbrev: 'Ab',
				},

				32: {
					name: 'octopus',
					aspect: 'fr-griffon',
					graph: SkiGraph(geometry, All4([[1,1]]), 1, m, m|c),
					value: 8.5,
					abbrev: 'O',
				},

				33: {
					name: 'spider',
					aspect: 'fr-rhino2',
					graph: SkiGraph(geometry, All4([[1,0]]), 1, m, m|c),
					value: 8,
					abbrev: 'Sp',
				},

				34: {
					name: 'zebra',
					aspect: 'fr-zebra',
					graph: this.cbShortRangeGraph(geometry, zebra),
					value: 2.25,
					abbrev: 'Z',
				},

				35: {
					name: 'harpy',
					aspect: 'fr-amazon',
					graph: this.cbLongRangeGraph(geometry, king, null, m|sd|0x8000000, 3),
					value: 5,
					abbrev: 'H',
				},

				36: {
					name: 'vulture',
					aspect: 'fr-proper-crowned-rook',
					graph: this.cbMergeGraphs(geometry,
						SkiGraph(geometry, All4([[1,1]]), 0, m|c, m),
						SkiGraph(geometry, All4([[1,0]]), 0, m|c, c)
						),
					value: 8.25,
					abbrev: 'V',
				},
			},

			promote: function(aGame,piece,move) {

				var type = piece.t + !piece.t; // map 0 -> 1
				if(piece.t > 18) return []; // already promoted
				var fr = geometry.R(move.f), tr = geometry.R(move.t);
				if(piece.s==1 && (fr > 6 || tr > 6) ||
				   piece.s==-1 && (fr < 3 || tr < 3))
					return [piece.t, type + 18];

				return [];
			},

			castle:{
			},

			evaluate: function(aGame,evalValues,material) {

				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				var pieceCnt = 0, n = white.length;
				
				for(var i=0; i<n && pieceCnt<2; i++) pieceCnt += white[i];
				if(pieceCnt <= 1		    // white king single
				   || white[10] + white[28] == 0) { // or captured
					this.mFinished=true;
					this.mWinner=-1;
				}
				pieceCnt = 0;
				for(var i=0; i<n && pieceCnt<2; i++) pieceCnt += black[i];
				if(pieceCnt <= 1		    // black king single
				   || black[10] + black[28] == 0) { // or captured
					this.mFinished=true;
					this.mWinner=1;
				}
				
				// reconstruct piece values per player
				var difVal = evalValues['pieceValue'];
				var totVal = difVal/evalValues['pieceValueRatio'] - 1;
				var wVal = 0.5*(totVal + difVal) + 4;
				var bVal = 0.5*(totVal - difVal) + 4;

				// calculate expected material gain from promotions
				var wProm = 0, bProm = 0; // promotion gain
				for(var i=0; i<n; i++) {  // what players gain if all their pieces promote
					var gain = promoGain[i];
					wProm += white[i] * gain;
					bProm += black[i] * gain;
				}
				var wFrac = (bVal < 20 ? 1 : (wVal - bVal + 20)/wVal); // likely fraction to promote
				var bFrac = (wVal < 20 ? 1 : (bVal - wVal + 20)/bVal);
//				evalValues['pieceValue'] += 0.9*(wFrac*wProm - bFrac*bProm);
				
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
				for(var tt=4;tt<=5;tt++)
					for(var s=1;s>=-1;s-=2) {
						var pieces=material[s].byType[tt];
						if(pieces)
							for(var i=0;i<pieces.length;i++)
								if(pieces[i].m)
									minorPiecesMoved+=s;
					}
				if(minorPiecesMoved!=0) {
					evalValues['minorPiecesMoved']=minorPiecesMoved;
				}

			}

		}
	}

	var OriginalApplyMove = Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {
		if(move.via !== undefined) { // locust capture, remove victim
			var piece1=this.pieces[move.kill];
			this.zSign^=aGame.bKey(piece1);
			this.board[piece1.p]=-1;
			piece1.p=-1;
			piece1.m=true;
			this.noCaptCount=0;
			this.kings[2*piece1.s]--;
		}
		if(move.c) this.kings[-2*this.mWho]--;
		OriginalApplyMove.apply(this, arguments);
	}

	var victim; // 'tunnel parameter' for GetAttackers()

	var OriginalQuickApply = Model.Board.cbQuickApply;
	Model.Board.cbQuickApply = function(aGame,move) {
		var tmp = OriginalQuickApply.apply(this, arguments);
		victim = move.c;
		if(move.via !== undefined) { // remove locust victim
			this.board[move.via] = -1;
			this.pieces[move.kill].p = -1;
			tmp.unshift({
				i: move.kill,
				f: -1,
				t: move.via,
			});
			victim = 1;
		}
		return tmp;
	}

	var OriginalMoveGen = Model.Board.cbGeneratePseudoLegalMoves;
	Model.Board.cbGeneratePseudoLegalMoves = function(aGame) {
		var $this = this;
		this.specials = [];
		var moves = OriginalMoveGen.apply(this, arguments);
		var index, from, to, piece, victim;
		this.specials.forEach(function(move){
			if(move.x & 0x30000000) { // locust capture
				if(move.x & 0x10000000) { // checkers type
					via = move.f + move.t >> 1, index = $this.board[via];
					if(index < 0) return;
					to = move.t;
				} else // rifle type
					via = move.t, to = move.f, index = $this.board[via];
				victim = $this.pieces[index];
				if(victim.s != $this.mWho)
					moves.push({
						f:move.f,
						t:to,
						c:null,
						a:move.a,
						via:via,
						kill:index
					});
			} else { // move induction
				if(move.x & 0x8000000) { // Harpy
					var victim = $this.pieces[move.c]; // piece at target
					if(victim.s != $this.mWho) return; // no induction on foes
					var id = aGame.g.pTypes[victim.t].abbrev;
					if(id=='Ma' || id=='Pr' || id=='N' || id=='Sq' ||
					   id=='Dk' || id=='Ab' || id=='Wi') return;  // already moves as N
					var nGraph = aGame.g.pTypes[6].graph[move.t]; // Knight graph
					var m = nGraph.length;
					for(var k=0; k<m; k++) {
						to = nGraph[k][0] & 0xffff;
						victim = $this.board[to];
						if(victim < 0 || $this.pieces[victim].s != $this.mWho) {
							moves.push({
								f: move.t,
								t: to,
								c: victim < 0 ? null : victim,
								a: id
							});
					}	}
				} else { // Dervish
					var induced = induMap[move.f];
					induced.forEach(function(map){
						var from = map[0];
						index = $this.board[from];
						if(index >= 0) {
							piece = $this.pieces[index];
							if(piece.s == $this.mWho) { // friend at induction square
								var n = map.length;
								for(var i=1; i<n; i++) {
									to = map[i];
									victim = $this.board[to];
									if(victim < 0 || $this.pieces[victim].s != $this.mWho) // to-square accessible
										moves.push({
											f: from,
											t: to,
											c: victim < 0 ? null : victim,
											a: aGame.g.pTypes[piece.t].abbrev
										});
						} } }
					});
			}	}
		});

		return moves;
	}

	var induMap = {};

	function InduMap(aGame) { // create list of possible Dervish-induced moves per Dervish location
		for(var pos=0; pos<100; pos++) {
			var graph = aGame.g.pTypes[10].graph[pos]; // King graph at Dervish location
			var n = graph.length;
			induMap[pos] = [];
			for(var i=0; i<n; i++) {
				var from = graph[i][0] & 0xffff;
				var set = [from]; // first element is from-square of induced moves
				for(var j=0; j<n; j++) {
					var to = graph[j][0] & 0xffff;
					if(from + to == 2*pos) set.push(to); // induced Alibaba target
					var d = to - from;
					if(d==9 || d==11 || d==-9 || d==-11) set.push(to); // induced Ferz target
				}
				if(set.length > 1) induMap[pos].push(Model.Game.cbTypedArray(set)); // collect non-empty lists
	}	}	}

	var promoGain = [];

	var OriginalInitialPosition = Model.Board.InitialPosition;
	Model.Board.InitialPosition = function(aGame) {
		var thiss = this;
		OriginalInitialPosition.apply(this, arguments);
		InduMap(aGame);
		this.kings[2] = this.kings[-2] = 26; // tracks number of non-royals
		for(var i=1; i<19; i++) {
			promoGain[i+18] = 0;
			if(i != 10) promoGain[i] = aGame.g.pTypes[i+18].value - aGame.g.pTypes[i].value;
		}
		promoGain[10] = 4; promoGain[0] = promoGain[1];
	}

	var OriginalGetAttackers = Model.Board.cbGetAttackers;
	Model.Board.cbGetAttackers = function(aGame,pos,who,isKing) {
		if(isKing == 100  // called to see if in check
			&& victim != null && this.kings[-2*this.mWho] == 1) return []; // never in check after baring
		return OriginalGetAttackers.apply(this, arguments);
	}

	var OriginalToString = Model.Move.ToString;
	Model.Move.ToString = function(format) {
		if(this.via !== undefined) { // locust capture	(computer form currently undefined)		
			return this.a + 'x' + geometry.PosName(this.via) +
					'-' + geometry.PosName(this.t);
		}
		return OriginalToString.call(this, format);
	}

})();
