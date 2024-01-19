/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {
	
	View.Game.cbDefineView = function() {

		var wildebeestBoardDelta = {
//			notationMode: 'in',
//			notationDebug: true,
		};		
		var wildebeestBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,wildebeestBoardDelta);
		var wildebeestBoard2d = $.extend(true,{},this.cbGridBoardClassic2DNoMargin,wildebeestBoardDelta);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,wildebeestBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,wildebeestBoard3d),
			},
			boardLayout: [
			"#.#.#.#.#.#",
	      		".#.#.#.#.#.",
	     		"#.#.#.#.#.#",
	      		".#.#.#.#.#.",
	     		"#.#.#.#.#.#",
	      		".#.#.#.#.#.",
	     		"#.#.#.#.#.#",
	      		".#.#.#.#.#.",
	     		"#.#.#.#.#.#",
			".#.#.#.#.#.",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(wildebeestBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(wildebeestBoard3d),					
				},
			},
			clicker: {
				"2d": {
					width: 1100,
					height: 1100,
				},
				"3d": {
					scale: [.7,.7,.7],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"3d": {
						scale: [.45,.45,.45],
					},
				},
			}),
		};
	}

})();
