
(function() {

	View.Game.cbDefineView = function() {

		var myBoard = $.extend(true,{},this.cbGridBoardClassic2DMargin,{
			notationMode: "out",
			notationDebug: true,
		});

		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic3DMargin),
			},
			boardLayout: [
			              ".#.#.#.#.#.#.#.#",
			              "#.#.#.#.#.#.#.#.",
			              ".#.#.#.#.#.#.#.#",
			              "#.#.#.#.#.#.#.#.",
			              ".#.#.#.#.#.#.#.#",
			              "#.#.#.#.#.#.#.#.",
			              ".#.#.#.#.#.#.#.#",
			              "#.#.#.#.#.#.#.#.",
			              ".#.#.#.#.#.#.#.#",
			              "#.#.#.#.#.#.#.#.",
			              ".#.#.#.#.#.#.#.#",
			              "#.#.#.#.#.#.#.#.",
			              ".#.#.#.#.#.#.#.#",
			              "#.#.#.#.#.#.#.#.",
			              ".#.#.#.#.#.#.#.#",
			              "#.#.#.#.#.#.#.#.",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(myBoard),
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbGridBoardClassic3DMargin),
				},
			},
			clicker: {
				"2d": {
					width: 650,
					height: 650,
				},
				"3d": {
					scale: [0.45,0.45,0.45],
				},
			},
			pieces: this.cbStauntonPieceStyle({
				"default": {
					"2d": {
						width: 600,
						height: 600,
					},
					"3d": {
						scale: [0.3,0.3,0.3],
					},
				},
			}),
		};
	}

	/* Make the knight jump when moving */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		if(aMove.a=='N')
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}

})();
