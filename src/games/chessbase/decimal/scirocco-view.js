
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
				"#.#.#.#.#."
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
		var d = aMove.t - aMove.f, jump = 0;
		if(aMove.a=='N' || aMove.a=='A' || aMove.a=='D' || aMove.a=='C' ||
		   aMove.a=='Dv' || aMove.a=='Sq' || aMove.a=='Wi' || aMove.a=='Z') jump = 1; 		else {
			var dist = (d>11 || d<-11 || d>1 && d<9 || d<-1 && d>-9);
	  	if(dist) {
				if(aMove.a=='S' || aMove.a=='G' || aMove.a=='Ma' || aMove.a=='Pr' ||
				   aMove.a=='T' || aMove.a=='Zi' || aMove.a=='Za' || aMove.a=='L' || aMove.a=='E')
					jump = 1;
				else if(aMove.a=='Ab' || aMove.a=='Dk') {
					var diag = 0, orth = 0;
					for(var i=-9; i<9; i++) {
						if(d == 9*i || d == 11*i) diag = 1;
						if(d == 1*i || d == 10*i) orth = 1;
					}
		  		jump = (aMove.a=='Ab' ? !diag : !orth);
		}	}	}
		if(jump) 
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2 - 0.001*(aMove.a == 'O');
	}

})();
