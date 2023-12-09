
(function() {

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

	// some new flags for various common forms of locust capture
	// they can be used for other purposes if FLAG_FAIRY is not set
	var t = Model.Game.cbConstants.FLAG_THREAT;
	var FLAG_FAIRY = 1<<26;
	var FLAG_RIFLE = 2<<26;   // capture without moving
	var FLAG_HITRUN = 4<<26;  // do K step after capture
	var FLAG_CHECKER = 8<<26; // remove jumped-over foe
	var FLAG_STOP = Model.Game.cbConstants.FLAG_STOP;
	var FLAG_MOVE = Model.Game.cbConstants.FLAG_MOVE;
	Model.Game.cbConstants.FLAG_RIFLE = FLAG_RIFLE | FLAG_FAIRY | Model.Game.cbConstants.FLAG_SPECIAL_CAPTURE | t;
	Model.Game.cbConstants.FLAG_HITRUN = FLAG_HITRUN | FLAG_FAIRY | Model.Game.cbConstants.FLAG_SPECIAL_CAPTURE | t;
	Model.Game.cbConstants.FLAG_CHECKER = FLAG_CHECKER | FLAG_FAIRY | Model.Game.cbConstants.FLAG_SPECIAL;

	Model.Game.minimumBridge = 0; // for anti-trading rule of double capturing piece

	Model.Game.cbSkiGraph = function(geometry, stepSet, bend, flags1, flags2) { // two-stage slider move, possibly bent

		var graph = {};
		var s = this.cbConstants

		function SkiSlide(start, vec, flags, bend, iflags, range) { // trace out bent trajectory
			var path = [], corner = geometry.Graph(start, vec);
			if(corner != null) {
				var vec2 = Rotate(vec, bend);
				if(iflags >= 0 && iflags != FLAG_STOP) path.push(corner | iflags); // for s do this later
				for(var n=1; n<range; n++) {
					var delta = [n*vec2[0], n*vec2[1]], pos = geometry.Graph(corner, delta);
					if(pos != null) {
						if(n == 1 && iflags == FLAG_STOP) path.push(corner | FLAG_STOP);
						path.push(pos | flags);
			}	}	}
			if(path.length > 0) graph[start].push($this.cbTypedArray(path));
		}

		for(pos=0; pos<geometry.boardSize; pos++) {
			graph[pos] = [];
			stepSet.forEach(function(vec){
				SkiSlide(pos, vec, flags2, bend, flags1, 9);
				if(bend & 3) SkiSlide(pos, vec, flags2, -bend, FLAG_STOP, 9); // for bent: both forks
			});
		}
		return graph;
	}

	Model.Game.cbAdvancerGraph = function(geometry,deltas,maxDist) {
		if(maxDist===undefined) maxDist=10000;
		var graph = this.cbLongRangeGraph(geometry,deltas,null,0,maxDist+1); // capture square in path
		for(var s=0; s<geometry.boardSize; s++) { // start squares
			for(var i=0; i<graph[s].length; i++) { // directions
				var n=graph[s][i].length;
				var flag = this.cbConstants.FLAG_RIFLE | this.cbConstants.FLAG_CHECKER | this.cbConstants.FLAG_CAPTURE_SELF;
				if(n == 1) graph[s][i][0] |= FLAG_MOVE; // one step from edge
				else {
					graph[s][i][0] |= FLAG_STOP; // first square must be empty
					if(n <= maxDist) { // cut by edge
						var line = [];
						for(var j=0; j<n; j++) line.push(graph[s][i][j]);
						line.push(graph[s][i][n-1] | FLAG_MOVE);
						graph[s][i] = this.cbTypedArray(line);
					}
					for(var j=1; j<n; j++) graph[s][i][j] |= flag;
				}
			}
		}
	}

	Model.Game.cbWithdrawerGraph = function(geometry,deltas,maxDist) {
		var graph = this.cbLongRangeGraph(geometry,deltas,null,0,maxDist);
		for(var s=0; s<geometry.boardSize; s++) { // start squares
			for(var i=0; i<graph[s].length; i++) { // directions
				var flag = this.cbConstants.FLAG_MOVE;
				var n=graph[s][i].length;
				for(var j=0; j<n; j++) if(graph[s][i][0] + graph[s][j][0] == 2*s) {
					flag = this.cbConstants.FLAG_SPECIAL;
					break;
				}
				for(var j=0; j<n; j++) graph[s][i][j] |= flag;
			}
		}
		return graph;
	}

	Model.Game.cbCamelGraph = function(geometry,confine) {
		return this.cbShortRangeGraph(geometry,All4([[1,3],[-1,3]]),confine);
	}

	Model.Game.cbZebraGraph = function(geometry,confine) {
		return this.cbShortRangeGraph(geometry,All4([[2,3],[-2,3]]),confine);
	}

	Model.Game.cbAlibabaGraph = function(geometry,confine) {
		return this.cbShortRangeGraph(geometry,All4([[2,0],[2,2]]),confine);
	}

	Model.Game.cbWizardGraph = function(geometry,confine) {
		return this.cbShortRangeGraph(geometry,All4([[1,1],[1,3],[-1,3]]),confine);
	}

	Model.Game.cbChampionGraph = function(geometry,confine) {
		return this.cbShortRangeGraph(geometry,All4([[1,0],[2,0],[2,2]]),confine);
	}

	Model.Game.cbVaoGraph = function(geometry) {
		return this.cbLongRangeGraph(geometry,All4([[1,-1]]),null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE);
	}
	
	Model.Game.cbGriffonGraph = function(geometry,confine) {
		return this.cbSkiGraph(geometry,All4([[1,0]]),1);
	}

	Model.Game.cbRhinoGraph = function(geometry,confine) {
		return this.cbSkiGraph(geometry,All4([[1,1]]),1);
	}

	Model.Game.extraInit = function(geometry) { // called from InitGame
		if(!this.neighbors) this.neighbors = this.cbShortRangeGraph(geometry,All4([[1,0],[1,1]]),null,0);
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
		}
		OriginalApplyMove.apply(this, arguments);
	}

	var lionxlion; // 'tunnel parameter' to cbGetAttackers (Yeghh!)

	var OriginalQuickApply = Model.Board.cbQuickApply;
	Model.Board.cbQuickApply = function(aGame,move) {
		var tmp = OriginalQuickApply.apply(this, arguments);
		lionxlion = -2;
		if(move.c !== null && aGame.minimumBridge) {
			var at = aGame.g.pTypes[this.pieces[move.c].t].antiTrade;
			if(at) { // move captures Lion
				if(at == aGame.g.pTypes[tmp[0].ty].antiTrade) lionxlion = (at*at > 10000 ? -3 : move.t); // remember location of LxL capture
				else if(at < 0) {
					if(this.lastMove && this.lastMove.c && this.lastMove.t != move.t // also test for counterstrike
						&& aGame.g.pTypes[this.pieces[this.lastMove.c].t].antiTrade == at) { // same anti-trade group
						lionxlion = -3; // flags 'iron Lion'
					}
				}
			}
		}
		if(move.via !== undefined) { // remove locust victim
			this.board[move.via] = -1;
			this.pieces[move.kill].p = -1;
			tmp.unshift({
				i: move.kill,
				f: -1,
				t: move.via,
			});
			if(this.pieces[move.kill].t >= aGame.minimumBridge)
				lionxlion = -2; // enough extra gain to allow trade
		}
		return tmp;
	}

	Model.Board.customGen = function(move) {} // dummy

	var OriginalMoveGen = Model.Board.cbGeneratePseudoLegalMoves;
	Model.Board.cbGeneratePseudoLegalMoves = function(aGame) {
		var $this = this;
		this.specials = []; // for collecting locust captures

		var moves = OriginalMoveGen.apply(this, arguments);

		this.specials.forEach(function(move){ // candidate moves: locust capture
			if(move.x & FLAG_FAIRY) {
				var via, index, to, victim, victim2;
				if(move.x & FLAG_HITRUN) {
					var nb = aGame.neighbors[move.t];
					var n = nb.length;
					for(var j=0; j<n; j++) { // all directions for second leg
						var to2 = nb[j][0];
						victim2 = (to2 == move.f ? -1 : $this.board[to2]); // no self-capt on igui!
						if(victim2 < 0 || $this.pieces[victim2].s != $this.mWho) // valid 2nd leg
							moves.push({
								f: move.f,
								t: to2,
								c: victim2 < 0 ? null : victim2,
								a: move.a,
								via: move.t,
								kill: move.c
							});
					}
				} else {
					if(move.x & FLAG_CHECKER) {
						if(move.x & FLAG_RIFLE) { // Advancer
							index = move.c;
							if(index && $this.pieces[index].s == $this.mWho) index = null; // no friendly capture
							moves.push({
								f: move.f,
								t: (move.t ^ move.x) & 0xffff,
								c: index,
								a: move.a,
								ep: index !== null
							});
							return;
						} else {
							via = move.f + move.t >> 1, index = $this.board[via];
							if(index < 0) return;
							to = move.t; victim2 = move.c;
						}
					} else { // rifle type
						via = move.t; to = move.f; index = $this.board[via]; victim2 = null;
					}
					victim = $this.pieces[index];
					if(victim.s != $this.mWho)
						moves.push({
							f:move.f,
							t:to,
							c:victim2,
							a:move.a,
							via:via,
							kill:index
						});
				}
			} else Model.Board.customGen($this, moves);
		});

		return moves;
	}

	var OriginalGetAttackers = Model.Board.cbGetAttackers;
	Model.Board.cbGetAttackers = function(aGame,pos,who,isKing) {
		if(isKing) { // called for check test
			if(lionxlion == -3) return [1]; // capture of iron Lion: always illegal, fake checker
			var checkers = OriginalGetAttackers.call(this, aGame, pos, who, true);
			if(checkers.length > 0) return checkers; // in any case in check if King in check
			if(lionxlion >= 0) // legality test of LxL
				return OriginalGetAttackers.call(this, aGame, lionxlion, who, false);
			return []; // King and royal Lion both safe
		}
		return OriginalGetAttackers.apply(this, arguments);
	}

	var OriginalToString = Model.Move.ToString;
	Model.Move.ToString = function(format) {
		if(this.via !== undefined) { // locust capture	(computer form currently undefined)		
			return this.a + 'x' + geometry.PosName(this.via) +
					(this.c == null ? '-' : 'x') + geometry.PosName(this.t);
		}
		return OriginalToString.call(this, format);
	}
	
})();
