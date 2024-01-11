
(function() {

	function Rotate(vec, n) { // calculate queen step 'rotated' over n*45 degrees
		var x = vec[0], y = vec[1], h;
		for(var i=0; i<(n&7); i++) {
			h = x; x -= y; y += h; // rotate 45 degrees (expands by sqrt(2))
			if(x*y == 0) x >>= 1, y >>= 1; // renormalize when orthogonal
		}
		return [x,y];
	}

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

	Model.Game.minimumBridge = 0; // for anti-trading rule of double capturing piece

	Model.Game.cbSkiGraph = function(geometry, stepSet, bend, flags1, flags2, confine, range) { // two-stage slider move, possibly bent

		var graph = {};
		var $this=this;

		function SkiSlide(start, vec, flags, bend, iflags, range) { // trace out bent trajectory
			var path = [], f = iflags, corner = geometry.Graph(start, vec), brouhaha=0;
			while(f < -1 && corner) corner = geometry.Graph(corner, vec), f++; // negative iflags jump to corner
			if(corner != null) {
				f=(iflags<0 ? flags : iflags);
				if(confine) {
					if(!(corner in confine)) return;
					if(confine[corner]=='b') f &= ~(brouhaha=c.FLAG_MOVE|c.FLAG_SPECIAL); // not to empty brouhaha squares
				}
				var vec2 = Rotate(vec, bend);
				if(f && iflags != c.FLAG_STOP) // defer adding stop until something follows it
					path.push(corner | f); // use iflags on 1st square if it did not indikate skipping
				if(brouhaha) return; // never past occupied brouhaha square
				for(var n=1; n<range; n++) {
					var delta = [n*vec2[0], n*vec2[1]], pos = geometry.Graph(corner, delta);
					if(pos == null) break // path strays off board
					if(confine) {
						if(!(pos in confine)) break;
						if(confine[pos]=='b') flags &= ~(brouhaha=c.FLAG_MOVE|c.FLAG_SPECIAL);
						if(!flags) break;
					}
					if(n == 1 && iflags == c.FLAG_STOP) path.push(corner | c.FLAG_STOP);
					path.push(pos | flags);
					if(brouhaha) break; // never past occupied brouhaha square
			}	}
			if(path.length > 0) graph[start].push($this.cbTypedArray(path));
		}

		if(!flags1) flags1 = c.FLAG_MOVE | c.FLAG_CAPTURE;
		if(!flags2) flags2 = c.FLAG_MOVE | c.FLAG_CAPTURE;
		if(!range) range=Infinity;
		for(pos=0; pos<geometry.boardSize; pos++) {
			if(confine && !(pos in confine))
				continue;
			graph[pos] = [];
			stepSet.forEach(function(vec){
				SkiSlide(pos, vec, flags2, bend, flags1, range);
				if(bend&3 && bend>0) SkiSlide(pos, vec, flags2, -bend, (flags1<0 ? flags1 : c.FLAG_STOP), range); // for bent: both forks
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

	Model.Game.cbPushGraph = function(geometry,direction,maxDist,rank) {
		var $this=this;
		var h = geometry.height;
                var half=h-1>>1;
		if(!maxDist) maxDist=Infinity;
		if(rank===undefined) rank=h;
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			graph[pos]=[];
			var line=[];
			var pos1=geometry.Graph(pos,[0,direction]);
			var dist=0;
			while(pos1!=null) {
				line.push(pos1 | c.FLAG_MOVE);
				if(++dist==maxDist) break;
				if(h-1+direction*(2*geometry.R(pos)-h+1) > 2*rank) break; // stop if starting beyond 'rank'
				pos1=geometry.Graph(pos1,[0,direction]);
				if(h-1+direction*(2*geometry.R(pos1)-h+1) > 2*half) break; // stop if we enter enemy half
			}
			if(line.length>0)
				graph[pos].push($this.cbTypedArray(line));
		}
		return graph;
	}

	Model.Game.cbFlexiPawnGraph = function(geometry,direction,pawnRank,maxPush) {
      		return this.cbMergeGraphs(geometry,
			this.cbPushGraph(geometry,direction,maxPush,pawnRank),
			this.cbShortRangeGraph(geometry,[[1,direction],[-1,direction]],null,c.FLAG_CAPTURE));
	}

	Model.Game.cbCamelGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[31],confine);
	}

	Model.Game.cbZebraGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[32],confine);
	}

	Model.Game.cbElephantGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[11,22],confine);
	}

	Model.Game.cbWarMachineGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[10,20],confine);
	}

	Model.Game.cbAlibabaGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[20,22],confine);
	}

	Model.Game.cbWizardGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[11,31],confine);
	}

	Model.Game.cbChampionGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[10,20,22],confine);
	}

	Model.Game.cbCardinalGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[-11,21],confine);
	}

	Model.Game.cbMarshallGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[-10,21],confine);
	}

	Model.Game.cbAmazonGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[-10,-11,21],confine);
	}

	Model.Game.cbVaoGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[c.FLAG_MOVE|c.FLAG_SCREEN_CAPTURE,-11],confine);
	}
	
	Model.Game.cbGriffonGraph = function(geometry,confine) {
		return this.cbSkiGraph(geometry,[[1,1],[1,-1],[-1,1],[-1,-1]],1);
	}

	Model.Game.cbRhinoGraph = function(geometry,confine) {
		return this.cbSkiGraph(geometry,[[1,0],[0,1],[-1,0],[0,-1]],1);
	}

	Model.Game.cbLionGraph = function(geometry,confine) {
		return this.cbSymmetricGraph(geometry,[10,11,20,21,22],confine);
	}

	Model.Game.extraInit = function(geometry) { // called from InitGame
		if(!this.neighbors) this.neighbors = this.cbSymmetricGraph(geometry,[RIFLE_BIT|c.FLAG_MOVE|c.FLAG_CAPTURE,10,11]);
		if(!this.burnZone)  this.burnZone  = this.cbSymmetricGraph(geometry,[10,11]);
	}

	Model.Game.cbPiecesFromFEN = function(geometry, fen, pawnRank, maxPush,confine) {
		var $this=this;
		var locations=[];
		var sqr=geometry.boardSize;

		var res = { // what this function will return
			geometry: geometry,
			pieceTypes: {}, // too be filled by MakePiece()
			promote: function(e,piece,move) { // watch out! called with unnatural 'this'
					if(piece.t>=res.maxPromote) return [];
					var rank=geometry.R(move.t);
					if(piece.s<0) {
						if(rank>=res.promoZone) return [];
					} else {
						if(geometry.height-rank>res.promoZone) return [];
					}
					return res.promoChoice;
				},
			setProperty: function(name, property, value) {
					this.pieceTypes[this.name2nr[name]][property] = value;
				},
			addMoves: function(name,graph) {
					var p = this.pieceTypes[this.name2nr[name]];
					p.graph = $this.cbMergeGraphs(geometry,p.graph,graph);
				},
			addPiece: function(typeDef) {
					this.pieceTypes[this.nr] = typeDef;
					this.name2nr[typeDef['name']] = this.nr;
					if(!typeDef.isKing) this.promoChoice.push(this.nr);
					return this.nr++;
				},
			setCastling: function(kstep,partnerName) {
					if(!locations['K']) return;
					if(!partnerName) partnerName='rook';
					if(partnerName!='rook') delete this.pieceTypes[this.name2nr['rook']].castle;
					var rook=this.name2nr[partnerName];
					if(!rook) return;
					this.castle={}; this.pieceTypes[rook].castle=true;
					SetCastling(rook,kstep,0); SetCastling(rook,kstep,1);
				},
			setValues: function(table,property) {
				if(property===undefined) property='value';
				for(var i=0; i<this.nr; i++) {
					var t=this.pieceTypes[i], id=t.abbrev;
					if(!id) id='P';
					if(table[id]) t[property]=table[id];
				}
			},
			nr: 0,
			name2nr: [],
			maxPromote: 0,
			promoZone: 1,
			promoChoice: [],
		};

		function SetCastling(rookType,kstep,player) {
			var k=locations['K'][player][0];
			var loc=locations[res.pieceTypes[rookType].abbrev][player];
			var rank=geometry.R(k);
			if(!kstep) kstep=(geometry.width-3>>1)-geometry.C(loc[0]); // file of left rook
			for(var i=0; i<loc.length; i++) {
				var r=loc[i];
				if(geometry.R(r)!=rank) continue;
				var kk=[], rr=[], text='O-O';
				if(r<k) {
					for(var j=r+1; j<=k-kstep+1; j++) rr.push(j);
					for(var j=k-1; j>=k-kstep; j--) kk.push(j);
					text+='-O'
				} else {
					for(var j=r-1; j>=k+kstep-1; j--) rr.push(j);
					for(var j=k+1; j<=k+kstep; j++) kk.push(j);
				}
				res.castle[k+'/'+r] = { k:kk, r:rr, n:text};
			}
		}

		function MakePiece(name, abbrev, aspect, graph, value, pos, prop1, prop2) {
			var piece = {
				name: name,
				abbrev: abbrev,
				aspect: aspect,
				graph: graph,
			};
			if(aspect=='fr-pawn') piece.fenAbbrev=abbrev, piece.abbrev='', res.maxPromote++;
			else if(aspect!='fr-king') res.promoChoice.push(res.nr); // add to promotion choice
			if(prop1) piece[prop1] = true;
			if(prop2) piece[prop2] = true;
			if(pos) {
				var ini = [];
				for(var i=0; i<pos[0].length; i++)
					ini.push({s: 1, p: pos[0][i]});
				for(var i=0; i<pos[1].length; i++)
					ini.push({s: -1, p: pos[1][i]});
				if(ini.length) piece.initial = ini;
			}
			res.name2nr[name] = res.nr;
			res.pieceTypes[res.nr++] = piece;
		}

		for(var i=0; i<fen.length; i++) {
			var c = fen[i];
			if(c == '/') {
				sqr -= sqr%geometry.width; // start next rank
				continue;
			}
			var n=parseInt(fen.substring(i));
			if(n) { // skip number of squares
				sqr-=n; i+=(n>99?2:n>9?1:0);
				continue;
			}
			var cc=c.toUpperCase();
			if(!locations[cc]) locations[cc]=[[],[]];
			--sqr;
			if(sqr>=0) locations[cc][c==cc?0:1].push(geometry.width*(geometry.R(sqr)+1)-geometry.C(sqr)-1);
		}

		var s=1, f=(geometry.width+2*geometry.height)/24; // leaper value correction for board size

		if('P' in locations) {
			if(pawnRank===undefined) pawnRank=geometry.R(locations['P'][0][locations['P'][0].length-1]);
			MakePiece('pawnw', 'P', 'fr-pawn', this.cbFlexiPawnGraph(geometry,1,pawnRank,maxPush), 1, [locations['P'][0],[]], 'epTarget', 'epCatch');
			MakePiece('pawnb', 'P', 'fr-pawn', this.cbFlexiPawnGraph(geometry,-1,pawnRank,maxPush), 1, [[],locations['P'][1]], 'epTarget', 'epCatch');
		}
		
		if('S' in locations) { // Shogi Pawn
			if(pawnRank===undefined) pawnRank=geometry.R(locations['S'][0][locations['S'][0].length-1]);
			MakePiece('soldierw', 'S', 'fr-pawn', this.cbShortRangeGraph(geometry,[[0,1]]), 1, [locations['P'][0],[]]);
			MakePiece('soldierb', 'S', 'fr-pawn', this.cbShortRangeGraph(geometry,[[0,-1]]), 1, [[],locations['P'][1]]);
		}

		if(pawnRank) {
			s=geometry.width-geometry.height+2*pawnRank; if(s<0) s=0;
			s=0.9+0.4*s/geometry.width; // Bishop value correction for 2 forward slides hitting enemy camp
		}

		if('A' in locations)
			MakePiece('archbishop', 'A', 'fr-proper-cardinal', this.cbCardinalGraph(geometry,confine), 8.25*Math.sqrt(s/f), locations['A']);
		if('B' in locations)
			MakePiece('bishop', 'B', 'fr-bishop', this.cbBishopGraph(geometry,confine), 3.50*s, locations['B']);
		if('C' in locations)
			MakePiece('camel', 'C', 'fr-camel', this.cbCamelGraph(geometry,confine), 2.5/(0.5*f+0.5), locations['C']);
		if('D' in locations)
			MakePiece('dragon-king', 'D', 'fr-proper-crowned-rook', this.cbSymmetricGraph(geometry,[-10,11],confine), 7.0/Math.sqrt(f), locations['D']);
		if('E' in locations)
			MakePiece('elephant', 'E', 'fr-proper-elephant', this.cbElephantGraph(geometry,confine), 3.35, locations['E']);
		if('G' in locations)
			MakePiece('griffon', 'G', 'fr-griffon', this.cbGriffonGraph(geometry,confine), 8.3, locations['G']);
		if('H' in locations)
			MakePiece('dragon-horse', 'H', 'fr-saint', this.cbSymmetricGraph(geometry,[-11,10],confine), 5.25*Math.sqrt(s/f), locations['H']);
		if('J' in locations)
			MakePiece('centaur', 'J', 'fr-crowned-knight', this.cbSymmetricGraph(geometry,[10,11,21],confine), 8/f, locations['J']);
		if('L' in locations)
			MakePiece('lion', 'L', 'fr-lion', this.cbLionGraph(geometry,confine), 11/f, locations['L']);
		if('M' in locations)
			MakePiece('marshall', 'M', 'fr-proper-marshall', this.cbMarshallGraph(geometry,confine), 9.0/Math.sqrt(f), locations['M']);
		if('N' in locations)
			MakePiece('knight', 'N', 'fr-knight', this.cbKnightGraph(geometry,confine), 3.25/f, locations['N']);
		if('O' in locations)
			MakePiece('champion', 'O', 'fr-champion', this.cbChampionGraph(geometry,confine), 4.5/f, locations['O']);
		if('Q' in locations)
			MakePiece('queen', 'Q', 'fr-proper-queen', this.cbQueenGraph(geometry,confine), 9.5*Math.sqrt(s), locations['Q']);
		if('R' in locations)
			MakePiece('rook', 'R', 'fr-rook', this.cbRookGraph(geometry,confine), 5.0, locations['R'], 'castle');
		if('T' in locations)
			MakePiece('amazon', 'T', 'fr-amazon', this.cbAmazonGraph(geometry,confine), 12.5*Math.sqrt(0.5*s+0.5), locations['T']);
		if('U' in locations)
			MakePiece('rhino', 'U', 'fr-rhino', this.cbRhinoGraph(geometry,confine), 7.8, locations['U']);
		if('V' in locations)
			MakePiece('vao', 'V', 'fr-cannon2', this.cbVaoGraph(geometry,confine), 2*s, locations['V']);
		if('W' in locations)
			MakePiece('wizard', 'W', 'fr-wizard', this.cbWizardGraph(geometry,confine), 4/(0.5*f+0.5), locations['W']);
		if('X' in locations)
			MakePiece('cannon', 'X', 'fr-cannon', this.cbXQCannonGraph(geometry,confine), 3, locations['X']);
		if('Y' in locations)
			MakePiece('man', 'Y', 'fr-man', this.cbKingGraph(geometry,confine), 3/f, locations['Y']);
		if('Z' in locations)
			MakePiece('zebra', 'Z', 'fr-zebra', this.cbZebraGraph(geometry,confine), 2.5/(0.5*f+0.5), locations['Z']);
		if('K' in locations)
			MakePiece('king', 'K', 'fr-king', this.cbKingGraph(geometry,confine), 100, locations['K'],'isKing');

		res.setCastling(); // now we know where all pieces are

		return res;
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
