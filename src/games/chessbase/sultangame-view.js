/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

 

(function() {
	
	View.Game.cbPromoSize = 1500;

	View.Game.cbDefineView = function() {

		var sultanBoardDelta = {
//			notationMode: 'in',
//			notationDebug: true,
		};		
		var sultanBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,sultanBoardDelta);
		var sultanBoard2d = $.extend(true,{},this.cbGridBoardClassic2DNoMargin,sultanBoardDelta);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,sultanBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,sultanBoard3d),
			},
			boardLayout: [
	      		".#.#.#.#.#.",
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
					draw: this.cbDrawBoardFn(sultanBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(sultanBoard3d),					
				},
			},
			clicker: {
				"2d": {
					width: 1000,
					height: 1000,
				},
				"3d": {
					scale: [.65,.65,.65],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"3d": {
						scale: [.5,.5,.5],
					},
				},
				"fr-cardinal": {
			"3d": {
				scale: [.55,.55,.58],
					},
				},
				"fr-marshall": {
			"3d": {
				scale: [.52,.52,.54],
					},
				},
				"fr-amazon": {
			"3d": {
				scale: [.5,.5,.6],
					},
				},

			}),
		};
	}

	/* Make the knight, marshall, amazon and cardinal jump when leaping */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
	var geometry = aGame.cbVar.geometry;
	var x0 = geometry.C(aMove.f);
	var x1 = geometry.C(aMove.t);
	var y0 = geometry.R(aMove.f);
	var y1 = geometry.R(aMove.t);
	if(x1-x0==0 || y1-y0==0 || Math.abs(x1-x0)==Math.abs(y1-y0))
		return (zFrom+zTo)/2;
	else
		return Math.max(zFrom,zTo)+1500;
}


})();