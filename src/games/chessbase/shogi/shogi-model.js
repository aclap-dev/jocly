
(function(){
	var geometry = Model.Game.cbDropGeometry(9,9,0);
	
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
					initial: [{s:1,p:28},{s:1,p:29},{s:1,p:30},{s:1,p:31},{s:1,p:32},{s:1,p:33},{s:1,p:34},{s:1,p:35},{s:1,p:36}],
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
					initial: [{s:-1,p:80},{s:-1,p:81},{s:-1,p:82},{s:-1,p:83},{s:-1,p:84},{s:-1,p:85},{s:-1,p:86},{s:-1,p:87},{s:-1,p:88},],
					demoted: 0,
					hand: 0,
				},

				2: {
					name: 'lance-w',
					aspect: 'sh-lance',
					graph: this.cbDropGraph(geometry, [],[[0,1]],0,1),
					value: 4.3,
					abbrev: 'L',
					initial: [{s:1,p:2},{s:1,p:10}],
					demoted: 3,
					hand: 1,
				},
				
				3: {
					name: 'lance-b',
					aspect: 'sh-lance',
					graph: this.cbDropGraph(geometry, [],[[0,-1]],1,0),
					value: 4.3,
					abbrev: 'L',
					initial: [{s:-1,p:106},{s:-1,p:114}],
					demoted: 2,
					hand: 1,
				},
				
				4: {
					name: 'knight-w',
					aspect: 'sh-knight',
					graph: this.cbDropGraph(geometry, [[1,2],[-1,2]],[],0,2),
					value: 4.5,
					abbrev: 'N',
					initial: [{s:1,p:3},{s:1,p:9}],
					demoted: 5,
					hand: 2,
				},
				
				5: {
					name: 'knight-b',
					aspect: 'sh-knight',
					graph: this.cbDropGraph(geometry, [[1,-2],[-1,-2]],[],2,0),
					value: 4.5,
					abbrev: 'N',
					initial: [{s:-1,p:107},{s:-1,p:113}],
					demoted: 4,
					hand: 2,
				},
				
				6: {
					name: 'silver-w',
					aspect: 'sh-silver',
					graph: this.cbDropGraph(geometry, [[0,1],[1,1],[1,-1],[-1,1],[-1,-1]],[]),
					value: 6.4,
					abbrev: 'S',
					initial: [{s:1,p:4},{s:1,p:8}],
					demoted: 7,
					hand: 3,
				},
				
				7: {
					name: 'silver-b',
					aspect: 'sh-silver',
					graph: this.cbDropGraph(geometry, [[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],[]),
					value: 6.4,
					abbrev: 'S',
					initial: [{s:-1,p:108},{s:-1,p:112}],
					demoted: 6,
					hand: 3,
				},
				
				8: {
					name: 'bishop',
					aspect: 'sh-bishop',
					graph: this.cbDropGraph(geometry, [],[[1,1],[1,-1],[-1,1],[-1,-1]]),
					value: 8.9,
					abbrev: 'B',
					initial: [{s:1,p:16},{s:-1,p:100}],
					hand: 5,
				},

				9: {
					name: 'rook',
					aspect: 'sh-rook',
					graph: this.cbDropGraph(geometry, [], [[0,1],[1,0],[-1,0],[0,-1]]),
					value: 10.4,
					abbrev: 'R',
					initial: [{s:1,p:22},{s:-1,p:94}],
					castle: true,
					hand: 6,
				},

				10: {
					name: 'gold-w',
					aspect: 'sh-gold',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1]],[]),
					value: 6.9,
					abbrev: 'G',
					initial: [{s:1,p:5},{s:1,p:7}],
					demoted: 11,
					hand: 4,
				},
				
				11: {
					name: 'gold-b',
					aspect: 'sh-gold',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,-1],[-1,-1]],[]),
					value: 6.9,
					abbrev: 'G',
					initial: [{s:-1,p:109},{s:-1,p:111}],
					demoted: 10,
					hand: 4,
				},
				
				12: {
					name: 'king',
					aspect: 'sh-king',
					isKing: true,
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]],[]),
					abbrev: 'K',
					initial: [{s:1,p:6}],
				},
				
				13: {
					name: 'p-pawn-w',
					aspect: 'sh-tokin',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1]],[]),
					value: 4.2,
					abbrev: '+P',
					demoted: 1,
				},
				
				14: {
					name: 'p-pawn-b',
					aspect: 'sh-tokin',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,-1],[-1,-1]],[]),
					value: 4.2,
					abbrev: '+P',
					demoted: 0,
				},
				
				15: {
					name: 'p-lance-w',
					aspect: 'sh-promoted-lance',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1]],[]),
					value: 6.3,
					abbrev: '+L',
					demoted: 3,
				},
				
				16: {
					name: 'p-lance-b',
					aspect: 'sh-promoted-lance',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,-1],[-1,-1]],[]),
					value: 6.3,
					abbrev: '+L',
					demoted: 2,
				},
				
				17: {
					name: 'p-knight-w',
					aspect: 'sh-promoted-knight',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1]],[]),
					value: 6.4,
					abbrev: '+N',
					demoted: 5,
				},
				
				18: {
					name: 'p-knight-b',
					aspect: 'sh-promoted-knight',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,-1],[-1,-1]],[]),
					value: 6.4,
					abbrev: '+N',
					demoted: 4,
				},
				
				19: {
					name: 'p-silver-w',
					aspect: 'sh-promoted-silver',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1]],[]),
					value: 6.7,
					abbrev: '+S',
					demoted: 7,
				},
				
				20: {
					name: 'p-silver-b',
					aspect: 'sh-promoted-silver',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,-1],[-1,-1]],[]),
					value: 6.7,
					abbrev: '+S',
					demoted: 6,
				},
				
				21: {
					name: 'horse',
					aspect: 'sh-horse',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1]],[[1,1],[1,-1],[-1,1],[-1,-1]]),
					value: 11.5,
					abbrev: '+B',
					demoted: 8,
				},
				
				22: {
					name: 'dragon',
					aspect: 'sh-dragon',
					graph: this.cbDropGraph(geometry, [[1,1],[1,-1],[-1,1],[-1,-1]], [[0,1],[1,0],[-1,0],[0,-1]]),
					value: 13.0,
					abbrev: '+R',
					demoted: 9,
				},

				23: {
					name: 'king',
					aspect: 'sh-jade',
					isKing: true,
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]],[]),
					abbrev: 'K',
					initial: [{s:-1,p:110}],
				},
				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t >= 10)
					return [];
				var f = geometry.C(move.f);
				if(f < 2 || f > 10) return []; // drop
				var f = geometry.R(move.f);
				var t = geometry.R(move.t);
				if(piece.s == 1) {
					if(t > 5 || f > 5)
						return	piece.t < 6 && t > 7 - (piece.t > 3)
						?	[piece.t+13]
						:	[piece.t, piece.t+13];
				} else {
					if(t < 3 || f < 3)
						return	piece.t < 6 && t < 1 + (piece.t > 3)
						?	[piece.t+13]
						:	[piece.t, piece.t+13];
				}
				return [];
			},

			evaluate: function(aGame,evalValues,material) {

			},

		};

		return this.cbAddHoldings(geometry, definition);
	}

})();
