
(function() {
	
	View.Game.cbDefineView = function() {
		
		var delta3D = {
				'colorFill' : {
					"#": "rgba(50,100,75,1)",
					".": "rgba(200,75,25,1)",
				},
		};

		var board3D = $.extend(true,{},this.cbGridBoardClassic3DMargin,delta3D);

		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,board3D),
			},
			boardLayout: [
	      		".#.#.#.#.#.#.#",
	      		"#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#",
	      		"#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#",
	      		"#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#",
	      		"#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#",
	      		"#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#",
	      		"#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#",
	      		"#.#.#.#.#.#.#.",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(this.cbGridBoardClassic2DMargin),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(board3D),					
				},
			},
			clicker: {
				"2d": {
					width: 800,
					height: 800,
				},
				"3d": {
					scale: [0.51,0.51,0.51],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"2d": {
						width: 742,
						height: 742,	
					},
					"3d": {
						scale: [0.34,0.34,0.34],
					},
				},
			}),
		};
	}

	// we can rely entirely on the default cbMoveMidZ

})();
