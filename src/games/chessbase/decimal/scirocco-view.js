
(function() {

	View.Game.cbDefineView = function() {
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic3DMargin),
			},
			boardLayout: [
				".#.#.#.#.#",
				"#.#.#.#.#.",
				".#.#.#.#.#",
				"#.#.#.#.#.",
				".#.#.#.#.#",
				"#.#.#.#.#.",
				".#.#.#.#.#",
				"#.#.#.#.#.",
				".#.#.#.#.#",
				"#.#.#.#.#."
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(this.cbGridBoardClassic2DMargin),
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbGridBoardClassic3DMargin),
				},
			},
			clicker: {
				"2d": {
					width: 1150,
					height: 1150,
				},
				"3d": {
					scale: [.75,.75,.75],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"2d": {
						width: 945,
						height: 945,						
					},
					"3d": {
						scale: [.45,.45,.45],
					},
				},
			}),
		};
	}

})();
