
(function() {
	
	View.Game.cbDefineView = function() {
		
		var board3d = $.extend(true,{},this.cbHexBoardClassic3DMargin,{
			//notationDebug: true,
			vertical: true,
		});

		var board2d = $.extend(true,{},this.cbHexBoardClassic2DMargin,{
			//notationDebug: true,
			vertical: true,
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
					width: 1200,
					height: 1200,
					initialClasses: "cb-hex-vert",
				},
				"3d": {
					scale: [.65,.65,.65],
					rotate: 30,
				},
			},
			pieces: this.cbStauntonPieceStyle({
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
		if(aMove.a=='N' || aMove.a=='B' || aMove.a=='Q')
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}
	
	var SuperViewBoardcbAnimate = View.Board.cbAnimate;
	View.Board.cbAnimate = function(xdv,aGame,aMove,callback) {

		var piece=this.pieces[this.board[aMove.f]];
		if(piece.t==8 && !this.castled[this.mWho] && aMove.cg===undefined) {
			var geometry = aGame.cbVar.geometry;
			var dc=aGame.g.distGraph[aMove.t][aMove.f];
			if(dc==3) {
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
