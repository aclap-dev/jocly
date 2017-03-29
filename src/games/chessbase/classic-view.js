
(function() {
	
	View.Game.cbDefineView = function() {

		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DMargin),
				"skin2dwood": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DNoMargin),
				"skin2dfull": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DNoMargin),
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
					draw: this.cbDrawBoardFn(this.cbGridBoardClassic2DNoMargin),										
				},
				"skin2dfull": {
					draw: this.cbDrawBoardFn(this.cbGridBoardClassic2DNoMargin),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbGridBoardClassic3DMargin),					
				},
			},
			clicker: {
				"skin2dwood": {
					width: 1600,
					height: 1600,
				},
				"skin2dfull": {
					width: 1600,
					height: 1600,
				},
				"3d": {
					scale: [.9,.9,.9],
				},
			},
			pieces: this.cbStauntonPieceStyle({
				"default": {
					"3d": {
						scale: [.6,.6,.6],
					},
					"skin3dflat": {
						scale: [.6,.6,1],
						rotate: 0,
						display: this.cbExtrudedPieceStyle()["default"]["3d"].display,
					},
					"skin2dwood": $.extend(true,
						{
							width:1600,
							height:1600
						},
						this.cbStauntonWoodenPieceStyle()["default"]["2d"]),		
					"skin2dfull": {
						width: 1400,
						height: 1400,
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
