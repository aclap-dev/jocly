
(function() {

	function Rotate(vec, n) { // calculate queen step 'rotated' over n*45 degrees
		var x = vec[0], y = vec[1], h;
		for(var i=0; i<(n&7); i++) {
			h = x; x -= y; y += h; // rotate 45 degrees (expands by sqrt(2))
			if(x*y == 0) x >>= 1, y >>= 1; // renormalize when orthogonal
		}
		return [x,y];
	}

	var c = Model.Game.cbConstants;

	Model.Game.minimumBridge = 0; // for anti-trading rule of double capturing piece

	Model.Game.cbSkiGraph = function(geometry, stepSet, bend, flags1, flags2, confine, range) { // two-stage slider move, possibly bent

		var graph = {};
		var $this=this;

		function SkiSlide(start, vec, flags, bend, iflags, range) { // trace out bent trajectory
			var path = [], f = iflags, corner = geometry.Graph(start, vec), brouhaha=0;
			while(f < -1 && corner) corner = geometry.Graph(corner, vec), f++; // negative iflags jump to corner
			if(corner != null) {
				f=(iflags<-1 ? flags : iflags);
				if(confine) {
					if(!(corner in confine)) return;
					if(confine[corner]=='b') f &= ~(brouhaha=c.FLAG_MOVE|c.FLAG_SPECIAL); // not to empty brouhaha squares
				}
				var vec2 = Rotate(vec, bend);
				if(f>=0 && iflags != c.FLAG_STOP) // defer adding stop until something follows it
					path.push(corner | f);    // use iflags on 1st square if it did not indicate skipping
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

        Model.Game.cbCastlingDef = function(wKing,wShortDest,wShortRook,wLongDest,wLongRook,bKing,bShortDest,bShortRook,bLongDest,bLongRook) {

		function OneCastling(king,dest,rook,notation) {
			var def={k: [], r: [], n: notation};
			var i, step=(dest<king ? -1 : 1);
			i=king; do def.k.push(i+=step); while(i!=dest);
			i=rook; do def.r.push(i-=step); while(i!=dest-step);
			return def;
		}

		var def = {};
		def[wKing+'/'+wShortRook] = OneCastling(wKing,wShortDest,wShortRook,'O-O');
		def[bKing+'/'+bShortRook] = OneCastling(bKing,bShortDest,bShortRook,'O-O');
		def[wKing+'/'+wLongRook] = OneCastling(wKing,wLongDest,wLongRook,'O-O-O');
		def[bKing+'/'+bLongRook] = OneCastling(bKing,bLongDest,bLongRook,'O-O-O');
		return def;
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
			addMoves: function(name,graph,squares) {
					var p = this.pieceTypes[this.name2nr[name]];
					var newGraph = $this.cbMergeGraphs(geometry,p.graph,graph);
					if(squares===undefined) p.graph=newGraph;
					else for(var pos in squares)
						p.graph[squares[pos]]=newGraph[squares[pos]]; // only merge moves from given squares
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
	
})();

