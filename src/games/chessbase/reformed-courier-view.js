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
	
		View.Game.cbPromoSize = 1200;


		var courierBoardDelta = {
//			notationMode: 'in',
//			notationDebug: true,
		};		
		var courierBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,courierBoardDelta);
		var courierBoard2d = $.extend(true,{},this.cbGridBoardClassic2DNoMargin,courierBoardDelta);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,courierBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,courierBoard3d),
			},
			boardLayout: [
	      	".#.#.#.#.#.#",
			"#.#.#.#.#.#.",
	      	".#.#.#.#.#.#",
	     		"#.#.#.#.#.#.",
	      	".#.#.#.#.#.#",
	     		"#.#.#.#.#.#.",
	      	".#.#.#.#.#.#",
	     		"#.#.#.#.#.#.",
	      	],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(courierBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(courierBoard3d),					
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
						scale: [.4,.4,.4],
					},
					"2d": {
						width: 900,
						height: 900,
					},

				},
				
			}),
		};
	}

	/* 
	 * Make the knight & the paladin jump when moving, the archer & the champion when moving 2 squares
	 */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		if(aMove.a=='N' || aMove.a=='Pa' || (aMove.a=='A' && aGame.g.distGraph[aMove.f][aMove.t]==2) || (aMove.a=='Ch' && aGame.g.distGraph[aMove.f][aMove.t]==2))
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}


	})();