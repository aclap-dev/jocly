/*
 * Copyright(c) 2013-2017 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

 

 

(function() {
	
	View.Game.cbDefineView = function() {

		var orthoBoardDelta = {
//			notationMode: 'in',
//			notationDebug: true,
		};		
		var orthoBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,orthoBoardDelta);
		var orthoBoard2d = $.extend(true,{},this.cbGridBoardClassic2DNoMargin,orthoBoardDelta);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,orthoBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,orthoBoard3d),
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
					draw: this.cbDrawBoardFn(orthoBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(orthoBoard3d),					
				},
			},
			clicker: {
				"2d": {
					width: 700,
					height: 700,
				},
				"3d": {
					scale: [0.45,0.45,0.45],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"3d": {
						scale: [0.3,0.3,0.3],
					},
					"2d": {
						width: 650,
						height: 650,
					},
				},
				"fr-amazon": {
					"3d": {
						scale: [0.3,0.3,0.3],
					},
				},
			}),
		};
	}

	/* Make the knight and amazon jump when leaping */
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