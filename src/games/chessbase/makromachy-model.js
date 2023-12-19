
(function() {

	var geometry = Model.Game.cbBoardGeometryGrid(14,14);

	var c = Model.Game.cbConstants;
	var adjacent=[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[0,1],[0,-1],[1,0]];
	var castle=c.FLAG_CAPTURE_SELF;					// to generate capture of own King as castling candidate
	var flying=c.FLAG_MOVE|c.FLAG_CAPTURE|c.FLAG_SCREEN_CAPTURE;	// move or direct capture, abd candidate for screen capture
	var airlift=c.FLAG_SPECIAL_CAPTURE | c.FLAG_CAPTURE_SELF;	// candidate move to any occupied square

	function AirliftGraph(geometry,deltas) { // slide minimally 4 steps in given directions
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			graph[pos]=[];
			deltas.forEach(function(delta) {
				var direction=[];
				var pos1=geometry.Graph(pos,delta);
				var dist=0;
				while(pos1!=null) {
					direction.push(pos1 | (dist++ < 3 ? c.FLAG_STOP : airlift));
					pos1=geometry.Graph(pos1,delta);
				}
				if(direction.length>3)
					graph[pos].push(Model.Game.cbTypedArray(direction));
			});
		}
		return graph;
	}
	
	Model.Game.minimumBridge = -1;	// enable anti-trading
	Model.Game.cbPawnTypes = 6;	// Pawn and Warrior moves reset the 50-move counter
	Model.Game.cbMaxRepeats = 2;	// causes invocation of cbPerpEval on first repetition

	Model.Game.cbPerpEval = function(board, aGame) {  // win if repetitively checked by Eagle
		if(board.check && board.pieces[board.board[board.lastMove.t]].t == 18) return board.mWho; // rechecking with Eagle immediately loses
		var n = aGame.GetRepeatOccurence(board);
		return (n==2 ? undefined : JocGame.DRAW); // defer decision on 1st repeat, 2nd repeat means draw
	}

	Model.Board.customGen = function(moves, move, b) { // mature a candidate move (or discard it)
		if(move.a == 'D') { // virgin DH x K: attempt to castle
			if(b.pieces[move.c].m || b.check) return; // King not virgin or in check
			var step=(move.t>move.f ? 1 : -1);
			for(var sqr=move.f; sqr!=move.t; sqr+=step) if(b.board[sqr]<0) { // for all empties beteen DH and K
				moves.push({ // generate a castling to it. (DH destination from table.)
					f: move.t,  // K location
					t: sqr,	    // K destination
					c: null,
					a: 'K',
					cg: move.f, // DH location
				});
			}
		} else if(move.a == 'W') { // backward capture by W
			if(b.pieces[move.c].p != move.t) return; // suppress e.p. case
			moves.push({ // but generate other capture
				f: move.f,
				t: move.t,
				c: move.c,
				a: 'W',
			});
		} else { // airlift move, hits first piece on ray (friend or foe)
			moves.push({
				f: move.f,
				t: (move.t ^ move.x) & 0xffff, // correct destination to previous square
				c: null,    // can never be a capture
				a: move.a,
			});
		}
	}

	Model.Game.cbDefine = function() {

		// classic chess pieces

		// second leg hit & run must go to empty (and not to origin)
		this.neighbors=this.cbShortRangeGraph(geometry,adjacent,null,c.FLAG_MOVE);

		var castleGraph=this.cbNullGraph(geometry); // create castling moves for corner pieces
		castleGraph[0]=[[castle+8]];	// only a single move from each corner
		castleGraph[13]=[[castle+8]];
		castleGraph[182]=[[castle+190]];
		castleGraph[195]=[[castle+190]];

		var piecesTypes = {

		    0: { // Pawns with initial 3-step push
			name : 'ipawnw',
			abbrev : '',
			fenAbbrev: 'P',
			aspect : 'fr-pawn',
			graph : this.cbFlexiPawnGraph(geometry,1,3),
			value : 0.89,
			initial: [{s:1,p:42},{s:1,p:43},{s:1,p:44},{s:1,p:45},{s:1,p:52},{s:1,p:53},{s:1,p:54},
				  {s:1,p:55},{s:1,p:46},{s:1,p:47},{s:1,p:48},{s:1,p:49},{s:1,p:50},{s:1,p:51}],
			epTarget : true, // can be captured e.p. (i.e. move of more than 1 step creates e.p. rights)
		    },

		    1: {
			name : 'ipawnb',
			abbrev : '',
			fenAbbrev: 'P',
			aspect : 'fr-pawn',
			graph : this.cbFlexiPawnGraph(geometry,-1,3),
			value : 0.89,
			initial: [{s:-1,p:144},{s:-1,p:145},{s:-1,p:146},{s:-1,p:147},{s:-1,p:148},{s:-1,p:149},{s:-1,p:140},
				  {s:-1,p:141},{s:-1,p:142},{s:-1,p:143},{s:-1,p:150},{s:-1,p:151},{s:-1,p:152},{s:-1,p:153}],
			epTarget : true,
		    },

		    2: { // Pawns after first move
			name : 'pawnw',
			abbrev : '',
			fenAbbrev: 'P',
			aspect : 'fr-pawn',
			graph : this.cbPawnGraph(geometry,1),
			value : 0.89,
			epCatch : true, // can capture e.p.
		    },

		    3: {
			name : 'pawnb',
			abbrev : '',
			fenAbbrev: 'P',
			aspect : 'fr-pawn',
			graph : this.cbPawnGraph(geometry,-1),
			value : 0.89,
			epCatch : true,
		    },

		    4: { // 'Pawn' that always has double push (and captures backwards like Knight)
			name : 'warriorw',
			abbrev : 'W',
			aspect : 'fr-corporal',
			graph : this.cbMergeGraphs(geometry,
				    this.cbFlexiPawnGraph(geometry,1,2),
				    this.cbShortRangeGraph(geometry,[[2,-1],[-2,-1],[1,-2],[-1,-2]],null,this.cbConstants.FLAG_SPECIAL_CAPTURE)
				),
			value : 2.01,
			initial: [{s:1,p:14},{s:1,p:15},{s:1,p:16},{s:1,p:25},{s:1,p:26},{s:1,p:27}],
			epTarget : true,
			epCatch : true,
		    },

		    5: {
			name : 'warriorb',
			abbrev : 'W',
			aspect : 'fr-corporal',
			graph : this.cbMergeGraphs(geometry,
				    this.cbFlexiPawnGraph(geometry,-1,2),
				    this.cbShortRangeGraph(geometry,[[2,1],[-2,1],[1,2],[-1,2]],null,this.cbConstants.FLAG_SPECIAL_CAPTURE)
				),
			value : 2.01,
			initial: [{s:-1,p:168},{s:-1,p:169},{s:-1,p:170},{s:-1,p:179},{s:-1,p:180},{s:-1,p:181}],
			epTarget : true,
			epCatch : true,
		    },

		    6: {
			name : 'rook',
			abbrev : 'R',
			aspect : 'fr-rook',
			graph : this.cbRookGraph(geometry),
			value : 5.66,
			initial: [{s:1,p:18},{s:1,p:23},{s:-1,p:172},{s:-1,p:177}],
		    },

		    7: {
			name : 'bishop',
			abbrev : 'B',
			aspect : 'fr-bishop',
			graph : this.cbBishopGraph(geometry),
			value : 4.44,
			initial: [{s:1,p:28},{s:1,p:41},{s:-1,p:154},{s:-1,p:167}],
		    },

		    8: { // has extra 'air lift' moves along diagonals
			name : 'knight',
			abbrev : 'N',
			aspect : 'fr-knight',
			graph : this.cbMergeGraphs(geometry,
				    this.cbKnightGraph(geometry),
				    AirliftGraph(geometry,[[1,1],[1,-1],[-1,1],[-1,-1]])),
			value : 3.2,
			initial: [{s:1,p:30},{s:1,p:39},{s:-1,p:156},{s:-1,p:165}],
		    },

		    9: {
			name : 'queen',
			abbrev : 'Q',
			aspect : 'fr-proper-queen',
			graph : this.cbQueenGraph(geometry),
			value : 11.35,
			initial: [{s:1,p:21},{s:-1,p:175}],
		    },

		    10: {
			name : 'king',
			abbrev : 'K',
			aspect : 'fr-king',
			graph : this.cbKingGraph(geometry),
			isKing : true,
			initial: [{s:1,p:8},{s:-1,p:190}],
		    },

		    11: {
			name : 'archer',
			abbrev : 'O',
			aspect : 'fr-bow',
			graph : this.cbShortRangeGraph(geometry,[[2,2],[2,-2],[-2,2],[-2,-2],[1,0],[-1,0],[0,1],[0,-1]]),
			value : 3.29,
			initial: [{s:1,p:33},{s:1,p:36},{s:-1,p:159},{s:-1,p:162}],
			ranking: 1,
		    },

		    13: {
			name : 'elephant',
			abbrev : 'E',
			aspect : 'fr-proper-elephant',
			graph : this.cbMergeGraphs(geometry,
				    this.cbElephantGraph(geometry),
				    AirliftGraph(geometry,[[1,1],[1,-1],[-1,1],[-1,-1]])),
			value : 3.23,
			initial: [{s:1,p:32},{s:1,p:37},{s:-1,p:158},{s:-1,p:163}],
		    },

		    14: {
			name : 'cannon',
			abbrev : 'C',
			aspect : 'fr-cannon',
			graph : this.cbXQCannonGraph(geometry),
			value : 3.83,
			initial: [{s:1,p:4},{s:1,p:9},{s:-1,p:186},{s:-1,p:191}],
		    },

		    15: {
			name : 'champion',
			abbrev : 'I',
			aspect : 'fr-champion',
			graph : this.cbMergeGraphs(geometry,
				    this.cbChampionGraph(geometry),
				    AirliftGraph(geometry,[[1,0],[0,1],[-1,0],[0,-1]])),
			value : 5.24,
			initial: [{s:1,p:2},{s:1,p:11},{s:-1,p:184},{s:-1,p:193}],
		    },

		    16: { // B after W bent slider
			name : 'rhino',
			abbrev : 'U',
			aspect : 'fr-rhino2',
			graph : this.cbRhinoGraph(geometry),
			 value : 8.54,
			initial: [{s:1,p:6},{s:-1,p:188}],
		    },

		    17: { // R after F bent slider
			name : 'griffon',
			abbrev : 'G',
			aspect : 'fr-griffin',
			graph : this.cbGriffonGraph(geometry),
			value : 9.61,
			initial: [{s:1,p:5},{s:-1,p:187}],
		    },

		    18: { // flying piece: Queen that can jump over arbitrary many to capture
			name : 'eagle',
			abbrev : 'L',
			aspect : 'fr-flying-queen',
			graph : this.cbLongRangeGraph(geometry,adjacent,null,flying),
			value : 19.18,
			initial: [{s:1,p:7},{s:-1,p:189}],
			antiTrade: 2,
			ranking: 1,
		    },

		    19: {
			name : 'camel',
			abbrev : 'J',
			aspect : 'fr-camel',
			graph : this.cbCamelGraph(geometry),
			value : 2.88,
			initial: [{s:1,p:1},{s:1,p:12},{s:-1,p:183},{s:-1,p:194}],
		    },

		    20: { // Amazon that can jump to 2nd ring, and do hit & run capture to adjacent squares
			name : 'terror',
			abbrev : 'T',
			aspect : 'fr-terror',
			graph : this.cbMergeGraphs(geometry,
			            this.cbAlibabaGraph(geometry),
			            this.cbShortRangeGraph(geometry,adjacent,null,c.FLAG_HITRUN),
			            this.cbAmazonGraph(geometry)),
			value : 19.33,
			initial: [{s:1,p:20},{s:-1,p:174}],
			antiTrade: 3, // cannot be captured from other piece in group 2 or 3 when protected
		    },

		    21: {
			name : 'marshall',
			abbrev : 'M',
			aspect : 'fr-proper-marshall',
			graph : this.cbMarshallGraph(geometry),
			value : 9.59,
			initial: [{s:1,p:31},{s:-1,p:157}],
		    },

		    22: {
			name : 'archbishop',
			abbrev : 'A',
			aspect : 'fr-proper-cardinal',
			graph : this.cbCardinalGraph(geometry),
			value : 8.17,
			initial: [{s:1,p:38},{s:-1,p:164}],
		    },
			
		    23: {
			name : 'dragon king',
			abbrev : 'D',
			aspect : 'fr-proper-crowned-rook',
			graph : this.cbMergeGraphs(geometry, castleGraph, // has the DK x K special moves
			            this.cbFersGraph(geometry),
			            this.cbRookGraph(geometry)),
			value : 7.69,
			initial: [{s:1,p:0},{s:1,p:13},{s:-1,p:182},{s:-1,p:195}],
		    },

		    24: {
			name : 'dragon horse',
			abbrev : 'H',
			aspect : 'fr-saint',
			graph : this.cbMergeGraphs(geometry,
			            this.cbSchleichGraph(geometry),
			            this.cbBishopGraph(geometry)),
			value : 6.54,
			initial: [{s:1,p:29},{s:1,p:40},{s:-1,p:155},{s:-1,p:166}],
		    },
			
		    25: {
			name : 'vao',
			abbrev : 'V',
			aspect : 'fr-cannon2',
			graph : this.cbVaoGraph(geometry),
			value : 2.71,
			initial: [{s:1,p:3},{s:1,p:10},{s:-1,p:185},{s:-1,p:192}],
		    },

		    26: { // flying piece: Rook that can jump over arbitrary many to capture
			name : 'raven',
			abbrev : 'F',
			aspect : 'fr-flying-rook',
			graph : this.cbLongRangeGraph(geometry,[[1,0],[-1,0],[0,1],[0,-1]],null,flying),
			value : 10.16,
			initial: [{s:1,p:19},{s:1,p:22},{s:-1,p:173},{s:-1,p:176}],
			ranking: 1,
		    },

		    27: {
			name : 'zebra',
			abbrev : 'Z',
			aspect : 'fr-zebra',
			graph : this.cbZebraGraph(geometry),
			value : 2.66,
			initial: [{s:1,p:17},{s:1,p:24},{s:-1,p:171},{s:-1,p:178}],
		    },

		    28: { // flying piece: Bishop that can jump over arbitrary many to capture
			name : 'bat',
			abbrev : 'S',
			aspect : 'fr-flying-bishop',
			graph : this.cbLongRangeGraph(geometry,[[1,1],[-1,1],[1,-1],[-1,-1]],null,flying),
			value : 6.93,
			initial: [{s:1,p:34},{s:1,p:35},{s:-1,p:160},{s:-1,p:161}],
			ranking: 1,
		    },

		    29: { // DK that has lost the castling moves
			name : 'dragon king',
			abbrev : 'D',
			aspect : 'fr-proper-crowned-rook',
			graph : this.cbMergeGraphs(geometry,
			            this.cbFersGraph(geometry),
			            this.cbRookGraph(geometry)),
			value : 7.79,
		    },


		}

		// defining types for readable promo cases

		return {
			
			geometry: geometry,
			
			pieceTypes: piecesTypes,

			promote: function(aGame,piece,move) {
				// initial pawns go up to last row where it promotes to Queen
				if(piece.t == 23) return[29];		// Dragon King loses (fast) castling
				if(piece.t < 2) return [piece.t+2];	// Pawn loses double push
				if(piece.t > 5) return [];		// non-Pawns do not promote
				var r=geometry.R(move.t);		// only Pawns and Warriors left here
				if(piece.s > 0 ? r < 13 : r > 0) return [];
				return [6,7,8,9,11,13,14,15,16,17,19,21,22,29,24,25,27];
			},

			castle: { // fast castling: R always to K square, K one step to highlight R for entry
				"8/0": {k:[7],r:[8],n:"O-O-O"},
				"8/13": {k:[9],r:[8],n:"O-O"},
				"190/182": {k:[189],r:[190],n:"O-O-O"},
				"190/195": {k:[191],r:[190],n:"O-O"},
			},
		};
	}

})();
