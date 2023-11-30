
(function() {
	
	View.Game.cbDefineView = function() {

		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbShatranjBoard2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbShatranjBoard3DMargin),
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
					draw: this.cbDrawBoardFn(this.cbShatranjBoard2DMargin),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbShatranjBoard3DMargin),					
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
			pieces: this.cbNishapurPieceStyle({
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
		if((aMove.a=='N')||(aMove.a=='E'))
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}
	
})();
