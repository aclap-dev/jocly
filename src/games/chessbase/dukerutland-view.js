/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

 

(function() {
	
	View.Game.cbPromoSize = 1200;

	View.Game.cbDefineView = function() {

		
		var dukerutlandBoardDelta = {
//			notationMode: 'in',
//			notationDebug: true,
		};		
		var dukerutlandBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,dukerutlandBoardDelta);
		var dukerutlandBoard2d = $.extend(true,{},this.cbGridBoardClassic2DNoMargin,dukerutlandBoardDelta);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,dukerutlandBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,dukerutlandBoard3d),
			},
			boardLayout: [
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
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(dukerutlandBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(dukerutlandBoard3d),					
				},
			},
			clicker: {
				"2d": {
					width: 800,
					height: 800,
				},
				"3d": {
					scale: [.5,.5,.5],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"3d": {
						scale: [.4,.4,.4],
					},
					"2d": {
						width: 800,
						height: 800,
					},

				},
				"fr-crowned-rook": {
				"3d": {
				scale: [.35,.35,.35],
					},
				},
				"fr-marshall": {
			"3d": {
				scale: [.41,.41,.44],
					},
				},

			}),
		};
	}

	/* Make the knight concubine jump when leaping */
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