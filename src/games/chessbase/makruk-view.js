
(function() {
	
	View.Game.cbDefineView = function() {

		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbMakrukBoard2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbMakrukBoard3DMargin),
			},
			boardLayout: [
	      		"........",
	      		"........",
	      		"........",
	      		"........",
	      		"........",
	      		"........",
	      		"........",
	      		"........",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(this.cbMakrukBoard2DMargin),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbMakrukBoard3DMargin),					
				},
			},
			clicker: {
				"2d": {
					width: 1400,
					height: 1400,
				},
				"3d": {
					scale: [.9,.9,.9],
				},
			},
			pieces: this.cbMakrukPieceStyle({
				"default": {
					"2d": {
						width: 1400,
						height: 1400,
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
		if(aMove.a=='N')
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}
	
})();
