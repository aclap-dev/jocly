
(function() {
	
	View.Game.cbDefineView = function() {

		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbXiangqiBoard2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbXiangqiBoard3DMargin),
			},
			boardLayout: [
	      		".........",
	    		".........",
	    		".........",
	    		".........",
	    		".........",
	    		".........",
	    		".........",
	    		".........",
	    		".........",
	    		".........",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(this.cbXiangqiBoard2DMargin),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbXiangqiBoard3DMargin),					
				},
			},
			clicker: {
				"2d": {
					width: 1100,
					height: 1100,
				},
				"3d": {
					scale: [.75,.75,.7],
				},
			},
			pieces: this.cbXiangqiPieceStyle({
				'default': {
					"3d": {
						//display: this.cbDisplayPieceFn(this.cbXiangqiPieceStyle),
						scale: [.5,.5,.5],
					},
					"skin3dwall": {
						rotate: 0,
					},
					"skin3dwestern": {
						display: this.cbXiangqiWesternPieceStyle()["default"]["3d"].display, 
					},
					"skin3dwallwestern": {
						display: this.cbXiangqiWesternPieceStyle()["default"]["3d"].display, 
						rotate: 0,
					},
					"skin2dwestern": this.cbXiangqiWesternPieceStyle()["default"]["2d"],
					
				},
			}),
		};
	}

	/* Make the horse jump when moving, the cannon when capturing */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
				
		if((aMove.a=='H') || (aMove.a=='C' && aMove.c!=null))
			return Math.max(zFrom,zTo)+1500;
		
		var geometry = aGame.cbVar.geometry;
		var x0 = geometry.C(aMove.f);
		var x1 = geometry.C(aMove.t);
		var y0 = geometry.R(aMove.f);
		var y1 = geometry.R(aMove.t);
		
		if (x0==x1 || y0==y1)
			return (zFrom+zTo)/2;
		else
			return Math.max(zFrom,zTo)+800;
	}
	
})();
