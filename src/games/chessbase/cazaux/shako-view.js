
(function() {
		
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
	      		".#.#.#.#.#",
	     		"#.#.#.#.#.",
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
					draw: this.cbDrawBoardFn(shakoBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(shakoBoard3d),					
				},
			},
			clicker: {
				"2d": {
					width: 1200,
					height: 1200,
				},
				"3d": {
					scale: [.75,.75,.75],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"2d": {
						width: 1200,
						height: 1200,
					},
					"3d": {
						scale: [.5,.5,.5],
					},
				},
			}),
		};
	}

	/* 
	 * Make the knight jump when moving, the elephant when moving 2 squares, the cannon when capturing 
	 */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		if(aMove.a=='N' || (aMove.a=='E' && aGame.g.distGraph[aMove.f][aMove.t]==2) || (aMove.a=='C' && aMove.c!=null))
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}
	
})();
