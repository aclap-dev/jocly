
(function(){

	var geometry, gameState;

	Model.Game.cbDropGeometry = function(files, ranks, v) {
		geometry = Model.Game.cbBoardGeometryGrid(files+4, ranks+2*v);
		geometry.handWidth = 2; geometry.handHeight = v;

		geometry.BOARD_AREA = {}; // define proper board
		for(var r=0; r<ranks; r++) for(var f=0; f<files; f++) {
			var sqr = (files+4)*(r+v) + f + 2;
			geometry.BOARD_AREA[sqr.toString()] = 1;
		}

		Model.Game.cbPawnsPerFile = ranks;

		return geometry;
	}

	Model.Game.cbDropGraph = function(geometry, leapSteps, slideSteps, start, end) {
		var leaps = Model.Game.cbShortRangeGraph(geometry, leapSteps, geometry.BOARD_AREA);
		var slides = Model.Game.cbLongRangeGraph(geometry, slideSteps, geometry.BOARD_AREA);
		var s = geometry.boardSize, w = geometry.width, v = geometry.handHeight; 
		if(start === undefined) start = 0; // forbidden ranks
		if(end === undefined) end = 0;
		start = w*(start+v); end = s - w*(end+v);
		var drops = {};
		for(var r=0; r<s; r+=w) // scan board & holdings
		for(var f=0; f<w; f++) {
			drops[r+f] = [];
			if(f < 2 && f&1 || f >= w-2 && !(f-w&1) || r < v*w && !(f-w&1) || r >= s-v*w && f&1)
			for(var r1=v*w;r1<s-v*w;r1+=w) // scan proper board area
			if(r1 >= start && r1 < end)
			for(var f1=2; f1<w-2; f1++) {
				var pos = r1 + f1;
				drops[r+f].push(Model.Game.cbTypedArray([pos | Model.Game.cbConstants.FLAG_MOVE]));
			}
		}
		return Model.Game.cbMergeGraphs(geometry, drops, leaps, slides);
	}

	var counters = [];

	Model.Game.cbAddHoldings = function(geometry, definition) {
		var w = geometry.width;
		var maxType=0;

		Model.Game.demoted = []; // tabulates how pieces transfrom on capture
		Model.Game.hand = {'-1':[], '1':[] }; // tabulates where captured pieces of a given color and type are put

		if(Model.Game.handLayout === undefined) {
			var whiteHand = w - 2; // default primary hand squares
			var blackHand = geometry.boardSize - w + 1;
			Model.Game.handLayout = { '1':[], '-1':[] };
			for(var i=0; i<geometry.height; i++) { // assign squares of extended board to hands
				Model.Game.handLayout[ 1].push(whiteHand + i*w);
				Model.Game.handLayout[-1].push(blackHand - i*w);
			}
		}

		for(var i in definition.pieceTypes) {
			var pType = definition.pieceTypes[i];
			demotedType = (pType.demoted===undefined ? i : pType.demoted); // can be 0!
			Model.Game.demoted[i] = parseInt(demotedType); // by default remains the same
			if(pType.hand !== undefined) { // assign a hand square to piece type
				Model.Game.hand[ 1][i] = Model.Game.handLayout[ 1][pType.hand];
				Model.Game.hand[-1][i] = Model.Game.handLayout[-1][pType.hand];
			}
			var n = parseInt(i);
			if(n > maxType) maxType = n;
		}

		var holdings = []; // collect set of 'spare' holdings squares
		Model.Game.handLayout[ 1].forEach(function(sqr){ holdings.push({s: 1,p:sqr+1}); });
		Model.Game.handLayout[-1].forEach(function(sqr){ holdings.push({s:-1,p:sqr-1}); });

		// generate counter pseudo-pieces
		for(var i=0; i<11; i++) {
			definition.pieceTypes[maxType + i + 1] = {
				name: 'counter',
				aspect: 'cnt-' + (i == 0 ? 1 : i+2),
				value: 0,
				initial: (i == 0 ? holdings : []),
			};
		}

		return definition;
	}

	Model.Game.cbSetPawnLimit = function(n) {
		Model.Game.cbPawnsPerFile = n; // specify limit
		Model.Board.cbGetAttackers = NewGetAttackers; // and enforce it
		Model.Board.cbQuickApply = NewQuickApply;
	}

	var OriginalInitialPosition = Model.Board.InitialPosition;
	Model.Board.InitialPosition = function(aGame) {
		var $this = this, w = geometry.width, v = geometry.handHeight;
		gameState = this; // post on behalf of diverted Zobrist update
		OriginalInitialPosition.apply(this, arguments);
		// count Pawns per file (hidden in this.kings)
		for(var i=2; i<w-2; i++) this.kings[i] = this.kings[-i] = 0;
		for(var s=v*w; s<geometry.boardSize-v*w; s++) {
			var f = geometry.C(s);
			if(f>1 && f<w-2) {
				var i = this.board[s];
				if(i >= 0) {
					var piece = this.pieces[i];
					if(piece.t < 2) this.kings[f*piece.s]++;
				}
			}
		}

		// remember counter piece for each square (and remove them); also mark primary squares
		Model.Game.handLayout[ 1].forEach(function(sqr){
			counters[sqr+1] = $this.board[sqr+1], $this.board[sqr+1] = -1, counters[sqr] = 1;
		});
		Model.Game.handLayout[-1].forEach(function(sqr){
			counters[sqr-1] = $this.board[sqr-1], $this.board[sqr-1] = -1, counters[sqr] = 1;
		});
	}

	var bad = false; // 'tunnel parameter' passed to check test

	var OriginalQuickApply = Model.Board.cbQuickApply;
	function NewQuickApply(aGame,move) {
		if(move.a == '') { // Pawn, check for illegal drop
			bad = (counters[move.f] && this.kings[this.mWho*geometry.C(move.t)] >= Model.Game.cbPawnsPerFile);
		}
		return OriginalQuickApply.apply(this, arguments);
	}

	var OriginalApplyMove = Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {
		var ctr;
		OriginalApplyMove.apply(this, arguments);
		if(move.pr !== undefined && move.a == '') // pawn promotes
			this.kings[this.mWho*geometry.C(move.f)]--;
		if(move.c != null) {
			var victim = this.pieces[move.c];
			victim.t = Model.Game.demoted[victim.t]; // demote and flip orientation
			if(victim.t < 2) this.kings[victim.s*geometry.C(move.t)]--; // pawn captured
			var hand = Model.Game.hand[this.mWho][victim.t];
			if(hand !== undefined) { // not all types have to go in hand!
				victim.s *= -1;
				victim.p = hand; this.zSign ^= aGame.bKey(victim);
				if(this.board[hand] >= 0) {
					hand += this.mWho; ctr = counters[hand];
					if(this.board[hand] >= 0) this.pieces[ctr].t++;
					this.zSign ^= (666666+hand)*this.pieces[ctr].t;
					victim.i = this.board[hand]; // use index field to link inactive pieces in list
				}
				this.board[hand] = move.c;
				victim.p = hand;
			}
		} else {
			if(counters[move.f]) { // drop
				var spare = move.f + this.mWho;
				var second = this.board[spare];
				if(second >= 0) { // we held more of that type
					var next = this.pieces[second].i;
					this.pieces[second].i = second; // repair index field
					this.board[move.f] = second; // shift it to head of queue
					this.pieces[second].p = move.f;
					this.board[spare] = next;
					ctr = counters[spare];
					this.zSign ^= (666666+spare)*this.pieces[ctr].t;
					if(next >= 0) this.pieces[ctr].t--;
				}
				if(move.a == '') this.kings[this.mWho*geometry.C(move.t)]++;
			}
		}
	}

	var OriginalGetAttackers = Model.Board.cbGetAttackers;
	function NewGetAttackers(aGame,pos,who,isKing) {
		if(bad) {
			bad = false;
			return [1]; // fake a king attacker when too many Pawns in a file
		}
		return OriginalGetAttackers.apply(this, arguments);
	}

	OriginalToString = Model.Move.ToString;
	Model.Move.ToString = function() {
		var v = geometry.handHeight, w = geometry.width;
		var f = geometry.C(this.f);
		var result = 'fail';
		if(f < 2 || f >= w - 2) { // drop
			f = geometry.C(this.t);
			result = (this.a == '' ? 'P' : this.a) + '@' + String.fromCharCode(95+f) + (geometry.R(this.t)+1-v);
		} else {
			var move = { f:this.f - 2 - v*w, t:this.t - 2 - v*w, c:this.c, a:this.a }; // offset coords
			result = OriginalToString.apply(move, arguments);
		}
		return result;
	}

})();
