
(function() {
	
	View.Game.cbDefineView = function() {
		
		var board3d = $.extend(true,{},this.cbCubicBoardClassic,{
			notationDebug: true,
		});

		var board2d = $.extend(true,{},this.cbCubicBoardClassic2D,{
			notationDebug: true,
		});

		
		return {
			coords: {
				"2d": this.cbCubicBoard.coordsFn.call(this,board2d),
				"3d": this.cbCubicBoard.coordsFn.call(this,board3d),
			},
			boardLayout: [[
				"#.#.",
			    ".#.#",
				"#.#.",
			    ".#.#",
	     	],[
				"#.#.",
			    ".#.#",
				"#.#.",
			    ".#.#",
	     	],[
				"#.#.",
			    ".#.#",
				"#.#.",
			    ".#.#",
	     	],[
				"#.#.",
			    ".#.#",
				"#.#.",
			    ".#.#",
	     	],[
				"#.#.",
			    ".#.#",
				"#.#.",
			    ".#.#",
	     	],[
			    ".#.#",
				"#.#.",
			    ".#.#",
				"#.#.",
	     	]],
			
			/*
			boardLayout: [[
		     		"#.#.",
		      		".#.#",
		      		"#.#.",
		     		".#.#",
		     		"#.#.",
		     	],[
		     	   "#.#.#",
		     	   ".#.#.",
		     	   "#.#.#",
		     	],[
		     	   ".#.#",
		     	   "#.#.",
		     	   ".#.#",
		     	],[
		     	   "#.#.",
		     	   ".#.#",
		     	   "#.#.",
		     	],[
		     	   ".#.#.",
		     	   "#.#.#",
		     	   ".#.#.",
		     	],[
		     		".#.#",
		     		"#.#.",
		      		".#.#",
		     		"#.#.",
		      		".#.#",
		     	]],
			*/
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
					width: 800,
					height: 800,
				},
				"3d": {
					scale: [1.2,1.2,1.2],
				},
			},
			pieces: this.cbStauntonPieceStyle({
				"default": {
					"2d": {
						width: 700,
						height: 700,						
					},
					"3d": {
						//scale: [.8,.8,.8],
						scale: [.7,.7,.7],
					},
				},
			}),
			captureAnim3d: "scaledown",
			fences: {
				"35": "#000000",
				"25": "#000000",
			}
		};
	}

})();
