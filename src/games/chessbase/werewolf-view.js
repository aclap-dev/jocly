(function() {
	
	View.Game.cbDefineView = function() {
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic3DMargin),
			},
			boardLayout: [
	      		".#.#.#.#",
	     		"#.#.#.#.",
	     		".#.#.#.#",
	     		"#.#.#.#.",
	     		".#.#.#.#",
	     		"#.#.#.#.",
	     		".#.#.#.#",
	     		"#.#.#.#.",				
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(this.cbGridBoardClassic2DMargin),
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbGridBoardClassic3DMargin),
				},
			},
			clicker: {
				"2d": {
					width: 1300,
					height: 1300,
				},
				"3d": {
					scale: [.9,.9,.9],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"2d": {
						width: 1200,
						height: 1200,						
					},
					"3d": {
						scale: [.6,.6,.6],
					},
				},
			}),
		};
	}

	/* Make the knight jump when moving */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		var d = aMove.t - aMove.f;
		if(aMove.a=='N' ||
		   aMove.a=='W' && aMove.via === undefined && !(d&1) && (d&15)!=8 )
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}

})();
