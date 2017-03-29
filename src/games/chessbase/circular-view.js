
(function() {
	
	View.Game.cbDefineView = function() {
		
		var board3d = $.extend(true,{},this.cbCircularBoardClassic3D,{
			//notationDebug: true,
		});
		
		var board2d = $.extend(true,{},this.cbCircularBoardClassic2D,{
			//notationDebug: true,
			'texturesImg' : {
				'boardBG' : '/res/images/whitebg.png',
			},
		});
		
		return {
			coords: {
				"2d": this.cbCircularBoard.coordsFn.call(this,board2d),
				"3d": this.cbCircularBoard.coordsFn.call(this,board3d),
			},
			boardLayout: [
	      		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#.",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(board2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(board3d),					
				},
			},
			clicker: {
				"2d": {
					width: 1000,
					height: 1000,
				},
				"3d": {
					scale: [.5,.5,.5],
				},
			},
			pieces: this.cbStauntonPieceStyle({
				"default": {
					"2d": {
						width: 1000,
						height: 1000,
					},
					"3d": {
						scale: [.35,.35,.35],
					},
				},
			}),
		};
	}

})();
