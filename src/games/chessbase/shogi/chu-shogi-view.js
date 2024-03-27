
(function() {

	View.Game.cbDefineView = function() {

		View.Game.cbChuPieceStyle3D[-1].default.paintTextureImageClip = undefined;
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic3DMargin),
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
	      		".#.#.#.#.#.#",
	      		"#.#.#.#.#.#.",
	      		".#.#.#.#.#.#",
	      		"#.#.#.#.#.#.",
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
					width: 975,
					height: 975,
				},
				"3d": {
					scale: [.65,.65,.65],
				},
			},
			pieces: this.cbChuPieceStyle({
				"default": {
					"2d": {
						width: 850,
						height: 850,						
					},
					"3d": {
						scale: [.46,.46,.46],
					},
				},
			}),
		};
	}

	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		var d = aMove.t - aMove.f;
		if((aMove.a=='LN' || aMove.a == '+KN' || aMove.a == 'KN' || aMove.a == 'PH') &&
		   (aMove.via === undefined && (d>13 || d<-13 || d==2 || d==-2 || d==10 || d==-10)))
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}

})();
