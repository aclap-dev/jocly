
(function() {

	View.Game.cbDefineView = function() {
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic3DMargin),
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
					draw: this.cbDrawBoardFn(this.cbGridBoardClassic2DMargin),
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbGridBoardClassic3DMargin),
				},
			},
			clicker: {
				"2d": {
					width: 1150,
					height: 1150,
				},
				"3d": {
					scale: [.75,.75,.75],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"2d": {
						width: 1050,
						height: 1050,						
					},
					"3d": {
						scale: [.5,.5,.5],
					},
				},
			}),
		};
	}

	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		var d = aMove.t - aMove.f;
		if(aMove.a=='N' ||
		   aMove.a=='W' && aMove.via === undefined &&
			(d>11 || d<-11 || d==2 || d==-2 || d==8 || d==-8))
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}

})();
