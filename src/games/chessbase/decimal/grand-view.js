/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {
	
	View.Game.cbPromoSize = 1100;

	View.Game.cbDefineView = function() {

		var shakoBoardDelta = {
//			notationMode: 'in',
//			notationDebug: true,
		};		
		var shakoBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,shakoBoardDelta);
		var shakoBoard2d = $.extend(true,{},this.cbGridBoardClassic2DNoMargin,shakoBoardDelta);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,shakoBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,shakoBoard3d),
			},
			boardLayout: [	      		
	     		"#.#.#.#.#.",
	     		".#.#.#.#.#",	      		
	     		"#.#.#.#.#.",
	     		".#.#.#.#.#",	      		
	     		"#.#.#.#.#.",
	     		".#.#.#.#.#",	      		
	     		"#.#.#.#.#.",
	     		".#.#.#.#.#",	      		
	     		"#.#.#.#.#.",
	     		".#.#.#.#.#",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(shakoBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(shakoBoard3d),					
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

	/* Make the knight, marshall and cardinal jump when leaping */
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
