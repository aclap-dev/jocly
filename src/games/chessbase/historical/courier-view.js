(function() {
	
	View.Game.cbDefineView = function() {

		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbCourierBoard2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbCourierBoard3DMargin),
			},
			boardLayout: [
	       		"#.#.#.#.#.#.",
	     		".#.#.#.#.#.#",
	       		"#.#.#.#.#.#.",
	     		".#.#.#.#.#.#",
	       		"#.#.#.#.#.#.",
	     		".#.#.#.#.#.#",
	       		"#.#.#.#.#.#.",
	     		".#.#.#.#.#.#",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(this.cbCourierBoard2DMargin),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbCourierBoard3DMargin),					
				},
			},
			clicker: {
				"2d": {
					width: 900,
					height: 900,
				},
				"3d": {
					scale: [.6,.6,.6],
				},
			},
			pieces: this.cbCourierChessPieceStyle({
				"default": {
					"2d": {
						width: 800,
						height: 800,
					},
					"3d": {
						scale: [.33,.33,.33],
					},
				},
				"cc-rook": {
					"3d": {
						scale: [.28,.28,.28],
					},
				}
			}),
		};
	}

	/* Make the knight jump when moving */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		if ((aMove.a=='N') || (aMove.a=='B'))
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}
	
})();
