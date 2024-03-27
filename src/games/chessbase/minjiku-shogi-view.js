
(function() {
	
	View.Game.cbDefineView = function() {
		
		var delta3D = {
				'colorFill' : {
					"#": "rgba(50,100,75,1)",
					".": "rgba(125,125,200,1)",
					"!": "rgba(0,0,0,1)",
					"b": "rgba(40,40,40,1)",
				},
		};

		var delta2D = {
				'colorFill' : {
					"!": "rgba(0,0,0,1)",
					"b": "rgba(100,100,100,1)",
				},
		};

		var board3D = $.extend(true,{},this.cbGridBoardClassic3DMargin,delta3D);
		var board2D = $.extend(true,{},this.cbGridBoardClassic2DMargin,delta2D);

		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,board2D),
				"3d": this.cbGridBoard.coordsFn.call(this,board3D),
			},
			boardLayout: [
			"!!!!bb!!!!",
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
			"!!!!bb!!!!",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(board2D),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(board3D),					
				},
			},
			clicker: {
				"2d": {
					width: 1000,
					height: 1000,
				},
				"3d": {
					scale: [.6,.6,.6],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"2d": {
						width: 900,
						height: 900,
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
		var c=aMove.a;
		var x=aMove.t%10-aMove.f%10, y=(aMove.t-aMove.f-x)/10;
		var dist=x*x+y*y;
		if(dist>2) { // never jump to adjacent squares
			var oblique=x*y*y*y-y*x*x*x;
			if(c=='X'||c=='Y'||c=='+L'||						// Kirin, Phoenix and Ninja ski-slide
			   oblique&&(c=='+Y')||							// Knight jump of Samurai
			   aMove.c!==null&&(c=='J'||c=='A'||c=='D'||c=='+M'||c=='+V'||c=='+C')) // hop capture
				return Math.max(zFrom,zTo)+1000+100*Math.sqrt(dist);
		}
		return (zFrom+zTo)/2; // slides straight
	}
	
})();
