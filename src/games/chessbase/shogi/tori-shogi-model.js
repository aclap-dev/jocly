
(function(){
	var geometry = Model.Game.cbDropGeometry(7,7,0);
	
	Model.Game.cbOnStaleMate = -1; // stalemate = last player wins
	Model.Game.cbMaxRepeats = 4;
	Model.Game.cbSetPawnLimit(2);

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
					aspect: 'tori-swallow',
					graph: this.cbDropGraph(geometry, [[0,1]],[],0,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'S',
					demoted: 1,
					hand: 0,
					initial: [{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:28},{s:1,p:29},{s:1,p:30},{s:1,p:39}],
				},
				
				1: {
					name: 'pawn-b',
					aspect: 'tori-swallow',
					graph: this.cbDropGraph(geometry, [[0,-1]],[],1,0),
					value: 1,
					abbrev: '',
					fenAbbrev: 'S',
					demoted: 0,
					hand: 0,
					initial: [{s:-1,p:46},{s:-1,p:47},{s:-1,p:48},{s:-1,p:49},{s:-1,p:50},{s:-1,p:51},{s:-1,p:52},{s:-1,p:37}],
				},


				2: {
					name: 'falcon-w',
					aspect: 'tori-falcon',
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[1,-1],[1,1],[-1,1],[-1,-1]],[]),
					value: 8,
					abbrev: 'F',
					demoted: 3,
					hand: 5,
					initial: [{s:1,p:16}],
				},
				
				3: {
					name: 'falcon-b',
					aspect: 'tori-falcon',
					graph: this.cbDropGraph(geometry, [[1,0],[-1,0],[0,-1],[1,-1],[1,1],[-1,1],[-1,-1]],[]),
					value: 8,
					abbrev: 'F',
					demoted: 2,
					hand: 5,
					initial: [{s:-1,p:60}],
				},

				4: {
					name: 'left-quail-w',
					aspect: 'tori-l-quail',
					graph: this.cbDropGraph(geometry, [[1,-1]],[[0,1],[-1,-1]]),
					value: 5,
					abbrev: 'L',
					demoted: 5,
					hand: 2,
					initial: [{s:1,p:2}],
				},

				5: {
					name: 'left-quail-b',
					aspect: 'tori-l-quail',
					graph: this.cbDropGraph(geometry, [[1,1]],[[0,-1],[-1,1]]),
					value: 5,
					abbrev: 'L',
					demoted: 4,
					hand: 2,
					initial: [{s:-1,p:74}],
				},

				6: {
					name: 'right-quail-w',
					aspect: 'tori-r-quail',
					graph: this.cbDropGraph(geometry, [[1,-1]],[[0,1],[-1,-1]]),
					value: 5,
					abbrev: 'R',
					demoted: 7,
					hand: 3,
					initial: [{s:1,p:8}],
				},
				
				7: {
					name: 'right-quail-b',
					aspect: 'tori-r-quail',
					graph: this.cbDropGraph(geometry, [[-1,1]],[[0,-1],[1,1]]),
					value: 5,
					abbrev: 'R',
					demoted: 6,
					hand: 3,
					initial: [{s:-1,p:68}],
				},

				8: {
					name: 'pheasant-w',
					aspect: 'tori-pheasant',
					graph: this.cbDropGraph(geometry, [[0,2],[1,-1],[-1,-1]],[]),
					value: 3,
					abbrev: 'P',
					demoted: 9,
					hand: 1,
					initial: [{s:1,p:3},{s:1,p:7}],
				},
				
				9: {
					name: 'pheasant-b',
					aspect: 'tori-pheasant',
					graph: this.cbDropGraph(geometry, [[0,-2],[1,1],[-1,1]],[]),
					value: 3,
					abbrev: 'P',
					demoted: 8,
					hand: 1,
					initial: [{s:-1,p:69},{s:-1,p:73}],
				},

				10: {
					name: 'crane',
					aspect: 'tori-crane',
					graph: this.cbDropGraph(geometry, [[1,1],[1,-1],[-1,1],[-1,-1],[0,1],[0,-1]],[]),
					value: 6,
					abbrev: 'C',
					hand: 4,
					initial: [{s:1,p:4},{s:1,p:6},{s:-1,p:70},{s:-1,p:72}],
				},

				11: {
					name: 'king',
					aspect: 'tori-phoenix',
					isKing: true,
					graph: this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]],[]),
					abbrev: 'K',
					initial: [{s:1,p:5},{s:-1,p:71}],
				},
				
				12: {
					name: 'p-goose-w',
					aspect: 'tori-goose',
					graph: this.cbDropGraph(geometry, [[0,-2],[2,2],[-2,2]],[]),
					value: 1.5,
					abbrev: '+S',
					demoted: 1,
				},
				
				13: {
					name: 'p-goose-b',
					aspect: 'tori-goose',
					graph: this.cbDropGraph(geometry, [[0,2],[2,-2],[-2,-2]],[]),
					value: 1.5,
					abbrev: '+S',
					demoted: 0,
				},
				
				14: {
					name: 'eagle-w',
					aspect: 'tori-eagle',
					graph: this.cbMergeGraphs(geometry,
						this.cbDropGraph(geometry, [[0,1],[1,0],[-1,0]],[[0,-1],[1,1],[-1,1]]),
						this.cbLongRangeGraph(geometry, [[-1,-1],[1,-1]],
									geometry.BOARD_AREA, null, 2)
					),
					value: 11,
					abbrev: '+F',
					demoted: 3,
				},
				
				15: {
					name: 'eagle-b',
					aspect: 'tori-eagle',
					graph: this.cbMergeGraphs(geometry,
						this.cbDropGraph(geometry, [[0,-1],[1,0],[-1,0]],[[0,1],[1,-1],[-1,-1]]),
						this.cbLongRangeGraph(geometry, [[-1,1],[1,1]],
									geometry.BOARD_AREA, null, 2)
					),
					value: 11,
					abbrev: '+F',
					demoted: 2,
				},
								
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t >= 4)
					return [];
				var f = geometry.C(move.f);
				if(f < 2 || f > 8) return []; // drop
				var f = geometry.R(move.f);
				var t = geometry.R(move.t);
				if(piece.s == 1) {
					if(t > 4 || f > 4)
						return [piece.t+12];
				} else {
					if(t < 2 || f < 2)
						return [piece.t+12];
				}
				return [];
			},

			evaluate: function(aGame,evalValues,material) {
			},

		};

		return this.cbAddHoldings(geometry, definition);
	}

})();
