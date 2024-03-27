
(function() {
	
	View.Game.cbDefineView = function() {

		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DNoMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic3DMargin),
			},
			boardLayout: [
	     		"#.#.",
	     		".#.#",
	     		"#.#.",
	     		".#.#",
	       		"#.#.",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(this.cbGridBoardClassic2DNoMargin),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbGridBoardClassic3DMargin),					
				},
			},
			clicker: {
				"2d": {
					width: 2400,
					height: 2400,
				},
				"3d": {
					scale: [1.2,1.2,1.2],
				},
			},
			pieces: this.cbStauntonPieceStyle({
				"default": {
					"2d": {
						width: 2100,
						height: 2100,
					},
					"3d": {
						scale: [.7,.7,.7],
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
