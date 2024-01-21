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

		var capaBoardDelta = {
			notationMode: 'in',
			notationDebug: true,
		};		
		var capaBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,capaBoardDelta);
		var capaBoard2d = $.extend(true,{},this.cbGridBoardClassic2DNoMargin,capaBoardDelta);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,capaBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,capaBoard3d),
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
	      		],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(capaBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(capaBoard3d),					
				},
			},
			clicker: {
				"2d": {
					width: 1100,
					height: 1100,
				},
				"3d": {
					scale: [.75,.75,.75],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"3d": {
						scale: [.5,.5,.5],
					},
				},
			}),
		};
	}

	/* rely on grid-board default for making pieces hop */

})();
