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

		var wildebeestBoardDelta = {
//			notationMode: 'in',
//			notationDebug: true,
		};		
		var wildebeestBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,wildebeestBoardDelta);
		var wildebeestBoard2d = $.extend(true,{},this.cbGridBoardClassic2DNoMargin,wildebeestBoardDelta);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,wildebeestBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,wildebeestBoard3d),
			},
			boardLayout: [
	      	"#.#.#.#.#.#",
	      		".#.#.#.#.#.",
	     		"#.#.#.#.#.#",
	      		".#.#.#.#.#.",
	     		"#.#.#.#.#.#",
	      		".#.#.#.#.#.",
	     		"#.#.#.#.#.#",
	      		".#.#.#.#.#.",
	     		"#.#.#.#.#.#",
				".#.#.#.#.#.",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(wildebeestBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(wildebeestBoard3d),					
				},
			},
			clicker: {
				"2d": {
					width: 1100,
					height: 1100,
				},
				"3d": {
					scale: [.7,.7,.7],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"3d": {
						scale: [.45,.45,.45],
					},
				},
			}),
		};
	}

	/* Make the knight, camel and wildebeest jump when leaping */
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
		if(piece.t==8 && !this.castled[this.mWho] && aMove.cg===undefined) {
			var geometry = aGame.cbVar.geometry;
			var dc=Math.abs(geometry.C(aMove.t)-geometry.C(aMove.f));
			if(dc>=2) {
				var extra=aGame.wbExtraCastleRook[aMove.t];
				var rPiece=this.pieces[this.board[extra.r0]];

				var animCount=2;
				function EndAnim() {
					if(--animCount==0)
						callback();
				}
				SuperViewBoardcbAnimate.call(this,xdv,aGame,aMove,function() {
					EndAnim();
				});
				var displaySpec=aGame.cbMakeDisplaySpecForPiece(aGame,extra.r,rPiece);
				xdv.updateGadget("piece#"+rPiece.i,displaySpec,600,function() {
					EndAnim();
				});
				return;
			}
		}
		SuperViewBoardcbAnimate.apply(this,arguments);
	}

})();
