
(function() {

	// some new flags for various common forms of locust capture
	// they can be used for other purposes if FLAG_FAIRY is not set
	var c = Model.Game.cbConstants;
	var FAIRY_BIT = 1<<26;
	var RIFLE_BIT = 2<<26;   // capture without moving
	var HITRUN_BIT = 4<<26;  // do K step after capture
	var CHECKER_BIT = 8<<26; // remove jumped-over foe
	var BURN_BIT = 2<<26;
	c.FLAG_RIFLE = RIFLE_BIT | FAIRY_BIT | c.FLAG_SPECIAL_CAPTURE | c.FLAG_THREAT;
	c.FLAG_HITRUN = HITRUN_BIT | FAIRY_BIT | c.FLAG_SPECIAL_CAPTURE | c.FLAG_THREAT;
	c.FLAG_CHECKER = CHECKER_BIT | FAIRY_BIT | c.FLAG_SPECIAL;
	c.FLAG_BURN = BURN_BIT | HITRUN_BIT | FAIRY_BIT;

	Model.Game.extraInit = function(geometry) { // called from InitGame
		if(!this.neighbors) this.neighbors = this.cbSymmetricGraph(geometry,[RIFLE_BIT|c.FLAG_MOVE|c.FLAG_CAPTURE,10,11]);
		if(!this.burnZone)  this.burnZone  = this.cbSymmetricGraph(geometry,[10,11]);
	}

	Model.Game.cbAdvancerGraph = function(geometry,deltas,maxDist) {
		if(maxDist===undefined) maxDist=10000;
		var graph = this.cbLongRangeGraph(geometry,deltas,null,0,maxDist+1); // capture square in path
		for(var s=0; s<geometry.boardSize; s++) { // start squares
			for(var i=0; i<graph[s].length; i++) { // directions
				var n=graph[s][i].length;
				var flag = c.FLAG_RIFLE | c.FLAG_CHECKER | c.FLAG_CAPTURE_SELF;
				if(n == 1) graph[s][i][0] |= c.FLAG_MOVE; // one step from edge
				else {
					graph[s][i][0] |= c.FLAG_STOP; // first square must be empty
					if(n <= maxDist) { // cut by edge
						var line = [];
						for(var j=0; j<n; j++) line.push(graph[s][i][j]);
						line.push(graph[s][i][n-1] | c.FLAG_MOVE);
						graph[s][i] = this.cbTypedArray(line);
					}
					for(var j=1; j<n; j++) graph[s][i][j] |= flag;
				}
			}
		}
		return graph;
	}

	Model.Game.cbWithdrawerGraph = function(geometry,deltas,maxDist) {
		var graph = this.cbLongRangeGraph(geometry,deltas,null,0,maxDist);
		for(var s=0; s<geometry.boardSize; s++) { // start squares
			for(var i=0; i<graph[s].length; i++) { // directions
				var flag = c.FLAG_MOVE;
				var n=graph[s][i].length;
				for(var j=0; j<n; j++) if(graph[s][i][0] + graph[s][j][0] == 2*s) {
					flag = c.FLAG_SPECIAL;
					break;
				}
				for(var j=0; j<n; j++) graph[s][i][j] |= flag;
			}
		}
		return graph;
	}

	var OriginalApplyMove = Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {
		if(move.kill !== undefined) { // locust capture, remove victim
			if(move.kill == -1) {
				var bz = aGame.burnZone[move.t];
				for(var i=0; i<bz.length; i++) {
					var sqr=bz[i][0] & 0xffff;
					var index = this.board[sqr];
					if(index >= 0) {
						var burned=this.pieces[index];
						if(burned.s != this.mWho ||
						    bz[i][0] & aGame.cbConstants.FLAG_CAPTURE_SELF) {
							this.zSign^=aGame.bKey(burned);
							this.board[sqr]=-1;
							burned.p=-1;
							this.noCaptCount=0;
						};
					}
				}
			} else {
				var piece1=this.pieces[move.kill];
				this.zSign^=aGame.bKey(piece1);
				this.board[piece1.p]=-1;
				piece1.p=-1;
				this.noCaptCount=0;
			}
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
			if(at & 1) { // move captures Lion
				var dat = at ^ aGame.g.pTypes[tmp[0].ty].antiTrade;
				if(!(dat&~1)) lionxlion = (at*at > 10000 ? -3 : move.t); // remember location of LxL capture
				else if(at < 0) {
					if(this.lastMove && this.lastMove.c!==null && this.lastMove.t != move.t // also test for counterstrike
						&& aGame.g.pTypes[this.pieces[this.lastMove.c].t].antiTrade == at) { // same anti-trade group
						lionxlion = -3; // flags 'iron Lion'
					}
				}
			}
		}
		if(move.kill !== undefined) { // remove locust victim
			if(move.kill == -1) {
				var bz = aGame.burnZone[move.t];
				for(var i=0; i<bz.length; i++) {
					var index = this.board[bz[i][0] & 0xffff];
					if(index >= 0) {
						if(this.pieces[index].s != this.mWho ||
						    bz[i][0] & aGame.cbConstants.FLAG_CAPTURE_SELF) tmp.unshift({
							i: index,
							f: -1,
							t: bz[i][0] & 0xffff,
						});
					}
				}
				return tmp;
			}
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

	Model.Board.customGen = function() {} // dummy

	var OriginalMoveGen = Model.Board.cbGeneratePseudoLegalMoves;
	Model.Board.cbGeneratePseudoLegalMoves = function(aGame) {
		var $this = this;
		this.specials = []; // for collecting locust captures

		var moves = OriginalMoveGen.apply(this, arguments);

		this.specials.forEach(function(move){ // candidate moves: locust capture
			if(move.x & FAIRY_BIT) {
				var via, index, to, victim, victim2;
				if(move.x & HITRUN_BIT) {
					if(move.x & BURN_BIT) {
						moves.push({
							f: move.f,
							t: move.t,
							c: move.c,
							a: move.a,
							kill: -1, // requests burn in move apply
						});
						return;
					}
					var nb = aGame.neighbors[move.t];
					var n = nb.length;
					for(var j=0; j<n; j++) { // all directions for second leg
						var to2 = nb[j][0] & 0xffff;
						var flags = aGame.cbConstants;
						victim2 = (to2 == move.f && nb[j][0] & RIFLE_BIT ? -1 : $this.board[to2]); // no self-capt on igui!
						if(victim2 < 0 ? nb[j][0] & flags.FLAG_MOVE
							: nb[j][0] & flags.FLAG_CAPTURE && $this.pieces[victim2].s != $this.mWho) // valid 2nd leg
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
					if(move.x & CHECKER_BIT) {
						if(move.x & RIFLE_BIT) { // Advancer
							index = move.c;
							if(index !== null && $this.pieces[index].s == $this.mWho) index = null; // no friendly capture
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
			} else Model.Board.customGen(moves, move, $this, aGame);
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
