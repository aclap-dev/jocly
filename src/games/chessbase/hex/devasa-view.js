
(function() {
	
	View.Game.cbDefineView = function() {
		
		var board3d = $.extend(true,{},this.cbHexBoardClassic3DMargin,{
			//notationDebug: true,
		});

		var board2d = $.extend(true,{},this.cbHexBoardClassic2DMargin,{
			//notationDebug: true,
		});

		return {
			coords: {
				"2d": this.cbHexBoard.coordsFn.call(this,board2d),
				"3d": this.cbHexBoard.coordsFn.call(this,board3d),
			},
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(board2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(board3d),					
				},
			},
			clicker: {
				"2d": {
					width: 1000,
					height: 1000,
				},
				"3d": {
					scale: [.5,.5,.5],
				},
			},
			pieces: this.cbStauntonPieceStyle({
				"default": {
					"2d": {
						width: 700,
						height: 700,
					},
					"3d": {
						scale: [.4,.4,.4],
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
