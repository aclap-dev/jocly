
(function(){
	var geometry = Model.Game.cbDropGeometry(5,5,0);
	
	Model.Game.cbOnStaleMate = -1; // stalemate = last player wins
	Model.Game.cbMaxRepeats = 4;
	Model.Game.cbSetPawnLimit(1);

  Model.Game.cbPerpEval = function(board, aGame) {
		var loop = aGame.GetRepeatOccurence(board, 1) >> 1;
		if(board.oppoCheck >= loop) return -board.mWho;
		if(board.check >= loop) return board.mWho;
		return JocGame.DRAW; // draw if neither is perpetually checking
  }

	Model.Game.cbMateEval = function(board) { // detect Pawn-drop mate
		var m = board.lastMove;
		var piece = board.pieces[board.board[m.t]];
		if(piece.t < 2) { // Pawn
		  var f = geometry.C(m.f);
		  if(f==1 || f==geometry.width-2) return board.mWho; // dropped: flip result
		}
		return -board.mWho;
  }

	Model.Game.cbDefine = function() {
		
		var $this = this;
		
		var definition = {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'sh-pawn',
					graph: this.cbDropGraph(geometry, [[0,1]],[],0,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:11}],
					demoted: 1,
					hand: 0,
				},
				
				1: {
					name: 'pawn-b',
					aspect: 'sh-pawn',
					graph: this.cbDropGraph(geometry, [[0,-1]],[],1,0),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:33}],
					demoted: 0,
					hand: 0,
				},

				2: {
					name: 'silver-w',
					aspect: 'sh-silver',
					graph: this.cbDropGraph(geometry, [[0,1],[1,1],[1,-1],[-1,1],[-1,-1]],[]),
					value: 6.4,
					abbrev: 'S',
					initial: [{s:1,p:4}],
					demoted: 3,
					hand: 1,
				},
				
				3: {
					name: 'silver-b',
					aspect: 'sh-silver',
					graph: this.cbDropGraph(geometry, [[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],[]),
					value: 6.4,
					abbrev: 'S',
					initial: [{s:-1,p:40}],
					demoted: 2,
					hand: 1,
				},
				
				4: {
					name: 'bishop',
					aspect: 'sh-bishop',
					graph: this.cbDropGraph(geometry, [],[[1,1],[1,-1],[-1,1],[-1,-1]]),
					value: 8.9,
					abbrev: 'B',
					initial: [{s:1,p:5},{s:-1,p:39}],
					hand: 3,
				},

				5: {
					name: 'rook',
					aspect: 'sh-rook',
					graph: this.cbDropGraph(geometry, [], [[0,1],[1,0],[-1,0],[0,-1]]),
					value: 10.4,
					abbrev: 'R',
					initial: [{s:1,p:6},{s:-1,p:38}],
					castle: false,
					hand: 4,
				},

				6: {
					name: 'gold-w',
					aspect: 'sh-gold',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1]],[]),
					value: 6.9,
					abbrev: 'G',
					initial: [{s:1,p:3}],
					demoted: 7,
					hand: 2,
				},
				
				7: {
					name: 'gold-b',
					aspect: 'sh-gold',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,-1],[-1,-1]],[]),
					value: 6.9,
					abbrev: 'G',
					initial: [{s:-1,p:41}],
					demoted: 6,
					hand: 2,
				},
				
				8: {
					name: 'p-pawn-w',
					aspect: 'sh-tokin',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1]],[]),
					value: 4.2,
					abbrev: '+P',
					demoted: 1,
				},
				
				9: {
					name: 'p-pawn-b',
					aspect: 'sh-tokin',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,-1],[-1,-1]],[]),
					value: 4.2,
					abbrev: '+P',
					demoted: 0,
				},
				
				10: {
					name: 'p-silver-w',
					aspect: 'sh-promoted-silver',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1]],[]),
					value: 6.7,
					abbrev: '+S',
					demoted: 3,
				},
				
				11: {
					name: 'p-silver-b',
					aspect: 'sh-promoted-silver',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,-1],[-1,-1]],[]),
					value: 6.7,
					abbrev: '+S',
					demoted: 2,
				},
				
				12: {
					name: 'horse',
					aspect: 'sh-horse',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1]],[[1,1],[1,-1],[-1,1],[-1,-1]]),
					value: 11.5,
					abbrev: '+B',
					demoted: 4,
				},
				
				13: {
					name: 'dragon',
					aspect: 'sh-dragon',
					graph: this.cbDropGraph(geometry, [[1,1],[1,-1],[-1,1],[-1,-1]], [[0,1],[1,0],[-1,0],[0,-1]]),
					value: 13.0,
					abbrev: '+R',
					demoted: 5,
				},

				14: {
					name: 'king',
					aspect: 'sh-king',
					isKing: true,
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]],[]),
					abbrev: 'K',
					initial: [{s:1,p:2}],
				},
				
				15: {
					name: 'king',
					aspect: 'sh-jade',
					isKing: true,
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]],[]),
					abbrev: 'K',
					initial: [{s:-1,p:42}],
				},
				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t >= 6)
					return [];
				var f = geometry.C(move.f);
				if(f < 2 || f > 6) return []; // drop
				var f = geometry.R(move.f);
				var t = geometry.R(move.t);
				if(piece.s == 1) {
					if(t > 3 || f > 3)
						return	piece.t == 0 && t > 3
						?	[piece.t+8]
						:	[piece.t, piece.t+8];
				} else {
					if(t < 1 || f < 1)
						return	piece.t == 1 && t < 1
						?	[piece.t+8]
						:	[piece.t, piece.t+8];
				}
				return [];
			},

			evaluate: function(aGame,evalValues,material) {

			},

		};

		return this.cbAddHoldings(geometry, definition);
	}

})();
