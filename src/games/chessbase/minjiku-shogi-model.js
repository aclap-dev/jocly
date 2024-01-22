
(function() {

	var geometry = Model.Game.cbBoardGeometryGrid(10,12);

	var c = Model.Game.cbConstants;
	var adjacent=[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[0,1],[0,-1],[1,0]];
	var castle=c.FLAG_CAPTURE_SELF;							// to generate capture of own King as castling candidate
	var flying=c.FLAG_MOVE|c.FLAG_CAPTURE|c.FLAG_SCREEN_CAPTURE;			// move or direct capture, and candidate for screen capture
	var rifle=c.FLAG_RIFLE;								// rifle capture
	var burning=c.FLAG_BURN|c.FLAG_SPECIAL|c.FLAG_SPECIAL_CAPTURE|c.FLAG_THREAT;	// burns on moving and capturing
	var area=[]; // confinement area
	var edge=[]; // for detecting squares that border the board edge

	for(var i=10; i<110; i++) area[i]=1, edge[i]=0;
	area[4]=area[5]=area[114]=area[115]='b'; // brouhaha squares
	for(var i=0; i<10; i++) edge[10*i+10]=edge[10*i+19]=edge[i]=edge[10+i]=edge[100+i]=edge[110+i]=1;

	Model.Game.cbPerpEval = function(board, aGame) {  // perpetually checking loses
		var result, loop = aGame.GetRepeatOccurence(board, 1) >> 1;
		// handle perperual checking
		if(board.oppoCheck >= loop)
			result = (board.check >= loop ? JocGame.DRAW : -board.mWho);
		else
			result = (board.check >= loop ? board.mWho : JocGame.DRAW);
		return result;
	}

	var via=[-10,-11,-10,-9,-10,-9,-11,0,0,-1, -11,0,0,1,-9,0,0,0,0,0, 0,0,-1,9,-11,0,1,-9,11,-1, 9,0,0,1,11,0,0,0,0,0, 10,9,10,11,10,11,9,0,0,0,];

	Model.Board.customGen = function(moves, move, b, aGame) { // mature a candidate move (or discard it)
		var pos=move.f;
		var graph=aGame.knight[pos];
		for(var i=0; i<graph.length; i++) { // check if N targets are reachable
			var tg1=graph[i][0];
			var pos1=tg1 & 0xffff;
			var step=pos1-pos+21;
			if(b.board[pos+via[step]]<0 || b.board[pos+via[step+1]]<0) {
				var m, victim=b.board[pos1];
				if(victim<0) { // reject non-capt to brouhaha squares
					if(pos1>9 && pos1<110) m={f: pos, t: pos1, c: null, a: move.a};
				} else if(b.pieces[victim].s != b.mWho) m={f: pos, t: pos1, c: victim, a: move.a, ep: false};
				if(m) {
					if(move.a=='F') m.kill=-1;
					moves.push(m);
				}
			}
		}
		var graph=aGame.machine[pos];
		for(var i=0; i<graph.length; i++) { // check if blocked D targets reachable through detour
			var tg1=graph[i][0];
			var pos1=tg1 & 0xffff;
			var step=pos1-pos+24;
			var block=pos+via[step];
			if(b.board[block] >= 0) { // blocked
				var m, s=pos+via[step+1]; // first detour square
				if(edge[block]) { // for a move along the edge one detour is invalid
					if(edge[s]) s=pos+via[step+2];	// on (wrapped) edge, so take other
					if(b.board[s]>=0) continue;	// the one detour is blocked
				} else if(b.board[s]>=0 && b.board[pos+via[step+2]]>=0) continue; // both blocked
				var victim=b.board[pos1];
				if(victim<0) {
					if(pos1>9 && pos1<110) m={f: pos, t: pos1, c: null, a: move.a};
				} else if(b.pieces[victim].s != b.mWho) m={f: pos, t: pos1, c: victim, a: move.a, ep: false};
				if(m) {
					if(move.a=='F') m.kill=-1;
					moves.push(m);
				}
			}
		}
	}

	Model.Game.cbDefine = function() {

		var $this=this;

		// burn only diagonally
		this.burnZone=this.cbShortRangeGraph(geometry,[[1,1],[1,-1],[-1,1],[-1,-1]],null,c.FLAG_CAPTURE);

		this.knight=this.cbKnightGraph(geometry,area); // used for generating area moves
		this.machine=this.cbShortRangeGraph(geometry,[[2,0],[-2,0],[0,2],[0,-2]],area);

		function AreaGraph(geometry) {
			return $this.cbShortRangeGraph(geometry,[[0,0]],area,c.FLAG_CAPTURE_SELF);
		}

		var piecesTypes = {
		
		    0: { // Asian Pawns
			name : 'pawnw',
			abbrev : '',
			fenAbbrev: 'P',
			aspect : 'fr-pawn',
			graph : this.cbShortRangeGraph(geometry,[[0,1]]),
			value : 0.86,
			initial: [{s:1,p:30},{s:1,p:31},{s:1,p:32},{s:1,p:33},{s:1,p:34},
				  {s:1,p:35},{s:1,p:36},{s:1,p:37},{s:1,p:38},{s:1,p:39}],
		    },

		    1: {
			name : 'pawnb',
			abbrev : '',
			fenAbbrev: 'P',
			aspect : 'fr-pawn',
			graph : this.cbShortRangeGraph(geometry,[[0,-1]]),
			value : 0.86,
			initial: [{s:-1,p:80},{s:-1,p:81},{s:-1,p:82},{s:-1,p:83},{s:-1,p:84},
				  {s:-1,p:85},{s:-1,p:86},{s:-1,p:87},{s:-1,p:88},{s:-1,p:89}],
		    },

		    2: { // shogi generals also are directional
			name : 'silverw',
			abbrev : 'S',
			aspect : 'fr-silver',
			graph : this.cbShortRangeGraph(geometry,[[1,1],[-1,1],[1,-1],[-1,-1],[0,1]],area),
			value : 2.30,
			initial: [{s:1,p:12},{s:1,p:17}],
		    },

		    3: {
			name : 'silverb',
			abbrev : 'S',
			aspect : 'fr-silver',
			graph : this.cbShortRangeGraph(geometry,[[1,1],[-1,1],[1,-1],[-1,-1],[0,-1]],area),
			value : 2.30,
			initial: [{s:-1,p:102},{s:-1,p:107}],
		    },

		    4: {
			name : 'goldw',
			abbrev : 'G',
			aspect : 'fr-gold',
			graph : this.cbShortRangeGraph(geometry,[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1]],area),
			value : 2.93,
			initial: [{s:1,p:13},{s:1,p:16}],
		    },

		    5: {
			name : 'goldb',
			abbrev : 'G',
			aspect : 'fr-gold',
			graph : this.cbShortRangeGraph(geometry,[[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,-1]],area),
			value : 2.93,
			initial: [{s:-1,p:103},{s:-1,p:106}],
		    },

		    6: {
			name : 'minister',
			abbrev : 'M',
			aspect : 'fr-man',
			graph : this.cbShortRangeGraph(geometry,[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]],area),
			value : 3.98,
			initial: [{s:1,p:4},{s:-1,p:115}],
		    },

		    7: {
			name : 'kirin',
			abbrev : 'Y',
			aspect : 'fr-giraffe',
			graph : this.cbShortRangeGraph(geometry,[[1,1],[1,-1],[-1,1],[-1,-1],[2,0],[-2,0],[0,2],[0,-2]],area),
			value : 3.44,
			initial: [{s:1,p:21},{s:-1,p:98}],
		    },

		    8: {
			name : 'phoenix',
			abbrev : 'X',
			aspect : 'fr-phoenix',
			graph : this.cbShortRangeGraph(geometry,[[2,2],[2,-2],[-2,2],[-2,-2],[1,0],[-1,0],[0,1],[0,-1]],area),
			value : 4.07,
			initial: [{s:1,p:28},{s:-1,p:91}],
		    },

		    9: {
			name : 'sweeper',
			abbrev : 'L',
			aspect : 'fr-machine',
			graph : this.cbMergeGraphs(geometry,
					this.cbShortRangeGraph(geometry,[[0,1],[0,-1]],area),
					this.cbLongRangeGraph(geometry,[[1,0],[-1,0]],area)),
			value : 3.54,
		    },

		    10: {
			name : 'bishop',
			abbrev : 'B',
			aspect : 'fr-bishop',
			graph : this.cbBishopGraph(geometry,area),
			value : 3.94,
			initial: [{s:1,p:14},{s:1,p:15},{s:-1,p:104},{s:-1,p:105}],
		    },

		    11: {
			name : 'rook',
			abbrev : 'R',
			aspect : 'fr-rook',
			graph : this.cbRookGraph(geometry,area),
			value : 5.11,
			initial: [{s:1,p:10},{s:1,p:19},{s:-1,p:100},{s:-1,p:109}],
		    },

		    12: { // flying piece: Bishop that can jump over arbitrary many to capture
			name : 'diagonal jumper',
			abbrev : 'D',
			aspect : 'fr-flying-bishop',
			graph : this.cbLongRangeGraph(geometry,[[1,1],[-1,1],[1,-1],[-1,-1]],area,flying),
			value : 6.13,
			initial: [{s:1,p:22},{s:1,p:27},{s:-1,p:92},{s:-1,p:97}],
			ranking: 3,
		    },

		    13: { // has rifle capture to W squares
			name : 'viper',
			abbrev : 'V',
			aspect : 'fr-saint',
			graph : this.cbMergeGraphs(geometry,
			            this.cbShortRangeGraph(geometry,[[1,0],[0,-1],[-1,0],[0,1]],area,rifle),
			            this.cbBishopGraph(geometry,area)),
			value : 6.38,
			initial: [{s:1,p:26},{s:-1,p:93}],
		    },
			
		    14: { // has rifle capture to F squares
			name : 'cobra',
			abbrev : 'C',
			aspect : 'fr-proper-crowned-rook',
			graph : this.cbMergeGraphs(geometry,
			            this.cbShortRangeGraph(geometry,[[1,1],[1,-1],[-1,1],[-1,-1]],area,rifle),
			            this.cbRookGraph(geometry,area)),
			value : 8.68,
			initial: [{s:1,p:23},{s:-1,p:96}],
		    },

		    15: {
			name : 'queen',
			abbrev : 'Q',
			aspect : 'fr-proper-queen',
			graph : this.cbQueenGraph(geometry,area),
			value : 16.82,
			initial: [{s:1,p:11},{s:-1,p:108}],
		    },

		    16: { // promoted and unpromotable pieces start here
			name : 'goldw',
			abbrev : '+P',
			aspect : 'fr-lighthouse',
			graph : this.cbShortRangeGraph(geometry,[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1]],area),
			value : 2.60,
		    },

		    17: {
			name : 'goldb',
			abbrev : '+P',
			aspect : 'fr-lighthouse',
			graph : this.cbShortRangeGraph(geometry,[[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,-1]],area),
			value : 2.60,
		    },

		    18: {
			name : 'bishop',
			abbrev : '+S',
			aspect : 'fr-small-bishop',
			graph : this.cbBishopGraph(geometry,area),
			value : 3.77,
		    },

		    19: {
			name : 'rook',
			abbrev : '+G',
			aspect : 'fr-small-rook',
			graph : this.cbRookGraph(geometry,area),
			value : 4.96,
		    },

		    20: { // flying piece: Rook that can jump over arbitrary many to capture
			name : 'orthogonal jumper',
			abbrev : '+M',
			aspect : 'fr-flying-rook',
			graph : this.cbLongRangeGraph(geometry,[[1,0],[-1,0],[0,1],[0,-1]],area,flying),
			value : 7.80,
			ranking: 3,
		    },

		    21: {
			name : 'samurai',
			abbrev : '+Y',
			aspect : 'fr-samurai',
			graph : this.cbMergeGraphs(geometry,
			            this.cbShortRangeGraph(geometry,adjacent,area,rifle),
			            this.cbKnightGraph(geometry,area)),
			value : 4.82,
		    },
			
		    22: {
			name : 'queen',
			abbrev : '+X',
			aspect : 'fr-queen',
			graph : this.cbQueenGraph(geometry,area),
			value : 9.52,
		    },

		    23: {
			name : 'ninja',
			abbrev : '+L',
			aspect : 'fr-ship',
			graph : this.cbMergeGraphs(geometry,
			            this.cbSkiGraph(geometry,[[1,0],[-1,0]],0,-1),
			            this.cbShortRangeGraph(geometry,[[1,0],[0,-1],[-1,0],[0,1]],area,rifle),
			            this.cbFersGraph(geometry,area)),
			value : 4.64,
		    },
			
		    24: {
			name : 'pviper',
			abbrev : '+B',
			aspect : 'fr-crowned-bishop',
			graph : this.cbMergeGraphs(geometry,
			            this.cbShortRangeGraph(geometry,[[1,0],[0,-1],[-1,0],[0,1]],area,rifle),
			            this.cbBishopGraph(geometry,area)),
			value : 4.71,
		    },
			
		    25: {
			name : 'pcobra',
			abbrev : '+R',
			aspect : 'fr-crowned-rook',
			graph : this.cbMergeGraphs(geometry,
			            this.cbShortRangeGraph(geometry,[[1,1],[1,-1],[-1,1],[-1,-1]],area,rifle),
			            this.cbRookGraph(geometry,area)),
			value : 5.81,
		    },

		    26: {
			name : 'lion',
			abbrev : '+D',
			aspect : 'fr-lion',
			graph : this.cbMergeGraphs(geometry,
					this.cbLongRangeGraph(geometry,adjacent,area,undefined,2),
					AreaGraph(geometry,area)),
			value : 9.73,
		    },

		    27: {
			name : 'area jumper',
			abbrev : 'A',
			aspect : 'fr-flying-saint',
			graph : this.cbMergeGraphs(geometry,
					this.cbLongRangeGraph(geometry,[[1,1],[-1,1],[1,-1],[-1,-1]],area,flying),
					this.cbLongRangeGraph(geometry,[[1,0],[-1,0],[0,1],[0,-1]],area,undefined,2),
					AreaGraph(geometry,area)),
			value : 13.01,
			initial: [{s:1,p:24},{s:-1,p:95}],
			ranking: 5,
		    },

		    28: { // flying piece: Queen that can jump over arbitrary many to capture
			name : 'jumping general',
			abbrev : 'J',
			aspect : 'fr-flying-queen',
			graph : this.cbLongRangeGraph(geometry,adjacent,area,flying),
			value : 20.00,
			initial: [{s:1,p:25},{s:-1,p:94}],
			antiTrade: 2,
			ranking: 7,
		    },

		    29: { // burns on move and capture
			name : 'fire dragon',
			abbrev : 'F',
			aspect : 'fr-terror',
			graph : this.cbMergeGraphs(geometry,
			            this.cbLongRangeGraph(geometry,adjacent,area,burning),
			            AreaGraph(geometry,area)),
			value : 34.97,
			initial: [{s:1,p:18},{s:-1,p:101}],
		    },

		    30: {
			name : 'king',
			abbrev : 'K',
			aspect : 'fr-king',
			graph : this.cbKingGraph(geometry,area),
			isKing : true,
			initial: [{s:1,p:5},{s:-1,p:114}],
//			ranking: 9,
		    },

		    31: {
			name : 'isweeper',
			abbrev : 'L',
			aspect : 'fr-machine',
			graph : this.cbMergeGraphs(geometry,
					this.cbLongRangeGraph(geometry,[[0,1],[0,-1]],area,null,2),
					this.cbShortRangeGraph(geometry,[[0,1],[0,-1]],area),
					this.cbLongRangeGraph(geometry,[[1,0],[-1,0]],area)),
			value : 3.54,
			initial: [{s:1,p:20},{s:1,p:29},{s:-1,p:90},{s:-1,p:99}],
		    },

		}

		return {
			
			geometry: geometry,
			
			pieceTypes: piecesTypes,

			promote: function(aGame,piece,move) {
				if(piece.t==31) return[9];				// Sweeper loses initial move
				if(piece.s>0 ? move.t<80 : move.t>39) return [];	// does not end in zone
				if(piece.t>15) return [];				// non-promoting or already promoted
				if(move.c===null &&					// not a capture
				  (piece.s>0 ? move.f>79 : move.f<40)) return [];	// and does not end in zone
				if(piece.t<2) return [piece.t, piece.t+16];		// Pawn pair to Gold pair
				if(piece.t<6) return [piece.t, piece.t+34>>1];		// Silver/Gold pair to single B/R
				return [piece.t, piece.t+14];				// single to single
			},
		};
	}

})();
