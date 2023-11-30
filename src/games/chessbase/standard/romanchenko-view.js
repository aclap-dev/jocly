
(function() {
	
	View.Game.cbDefineView = function() {
		
		var rmBoard = $.extend(true,{},this.cbGridBoardClassic,{
			paintLines:function(spec,ctx,images,channel) {
				var cSize = this.cbCSize(spec);
				ctx.strokeStyle = "#000000";
				ctx.lineWidth = 40;
				ctx.beginPath();
				ctx.moveTo(-cSize.cx*5,-cSize.cy*4);	
				ctx.lineTo(cSize.cx*3,-cSize.cy*4);	
				ctx.lineTo(cSize.cx*3,0);	
				ctx.lineTo(cSize.cx*5,0);	
				ctx.lineTo(cSize.cx*5,cSize.cy*4);	
				ctx.lineTo(-cSize.cx*3,cSize.cy*4);	
				ctx.lineTo(-cSize.cx*3,0);
				ctx.lineTo(-cSize.cx*5,0);	
						
				ctx.closePath();				
				ctx.stroke();
				
			},
			margins: { x: .67, y: .67 },
		});
		
		var rmBoard2d = $.extend(true,{},rmBoard,{
			'colorFill' : {		
				".": "#F1D9B3", // "white" cells
				"#": "#C7885D", // "black" cells
				" ": "rgba(0,0,0,0)",
			},
			'texturesImg' : {
				'boardBG' : '/res/images/whitebg.png',
			},
			margins: { x: 0, y: 0 },
		});
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,rmBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,rmBoard),
			},
			boardLayout: [
	     		".#.#.#.#  ",
	     		"#.#.#.#.  ",
	     		".#.#.#.#  ",
	     		"#.#.#.#.  ",
	     		"  .#.#.#.#",
	       		"  #.#.#.#.",
	     		"  .#.#.#.#",
	     		"  #.#.#.#.",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(rmBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(rmBoard),					
				},
			},
			clicker: {
				"2d": {
					width: 1200,
					height: 1200,
				},
				"3d": {
					scale: [0.7,0.7,0.7],
				},
			},
			pieces: this.cbStauntonPieceStyle({
				"default": {
					"2d": {
						width: 1100,
						height: 1100,
					},
					"3d": {
						scale: [.5,.5,.5],
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
