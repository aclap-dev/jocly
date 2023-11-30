/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {
	
	View.Game.cbDefineView = function() {

		var modernBoardDelta = {
//			notationMode: 'in',
//			notationDebug: true,
		};		
		var modernBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,modernBoardDelta);
		var modernBoard2d = $.extend(true,{},this.cbGridBoardClassic2DNoMargin,modernBoardDelta);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,modernBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,modernBoard3d),
			},
			boardLayout: [
			"#.#.#.#.#",	      		
			".#.#.#.#.",
	     		"#.#.#.#.#",
	      	".#.#.#.#.",
	     		"#.#.#.#.#",
	      	".#.#.#.#.",
	     		"#.#.#.#.#",
	      	".#.#.#.#.",
	     		"#.#.#.#.#",
	      		],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(modernBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(modernBoard3d),					
				},
			},
			clicker: {
				"2d": {
					width: 1300,
					height: 1300,
				},
				"3d": {
					scale: [.75,.75,.75],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"2d": {
						width: 1200,
						height: 1200,
					},
					"3d": {
						scale: [.5,.5,.5],
					},
				},
			}),
		};
	}

	/* Make the knight and minister (or chancellor) jump when leaping */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		var geometry = aGame.cbVar.geometry;
		var x0 = geometry.C(aMove.f);
		var x1 = geometry.C(aMove.t);
		var y0 = geometry.R(aMove.f);
		var y1 = geometry.R(aMove.t);
		if(x1-x0==0 || y1-y0==0 || Math.abs(x1-x0)==Math.abs(y1-y0))
			return (zFrom+zTo)/2;
		else
			return Math.max(zFrom,zTo)+1500;
	}
	
	var SuperViewBoardcbAnimate = View.Board.cbAnimate;
	View.Board.cbAnimate = function(xdv,aGame,aMove,callback) {

		var piece=this.pieces[this.board[aMove.f]];
		if(piece.t==5 && piece.m==false) {
			var pieceIndex1 = this.board[aMove.t]
			if(pieceIndex1>=0) {
				var piece1 = this.pieces[pieceIndex1];
				if(piece1.s==this.mWho && piece1.m==false) {
					var animCount=2;
					function EndAnim() {
						if(--animCount==0)
							callback();
					}
					SuperViewBoardcbAnimate.call(this,xdv,aGame,aMove,function() {
						EndAnim();
					});
					var displaySpec=aGame.cbMakeDisplaySpecForPiece(aGame,aMove.f,piece1);
					xdv.updateGadget("piece#"+piece1.i,displaySpec,600,function() {
						EndAnim();
					});
					return;
				}
			}
		}
		SuperViewBoardcbAnimate.apply(this,arguments);
	}
	
})();
