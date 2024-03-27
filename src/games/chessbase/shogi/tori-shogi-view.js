
(function() {

	// equip board with lines, for lack of checkering
	View.Game.cbShogiBoard3DMargin = $.extend({},View.Game.cbGridBoardClassic,{
		paintLines: function(spec,ctx,images,channel) {
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = 5;
			ctx.stroke();
		},
		'margins' : {x:.67,y:.67},
		'extraChannels':[ // in addition to 'diffuse' which is default
			'bump'
		],
	});
	
	View.Game.cbDefineView = function() {

		// this is returned via intermediate variable so it can be extended first
		var pieceSet = this.cbToriPieceStyle({
				"default": {
					"2d": {
						width: 950,
						height: 950,						
					},
					"3d": {
						scale: [.5,.5,.5],
					},
				},
			});

			// this drop-view.js function extends piece sets with holdings counters
			View.Game.cbAddCounters(pieceSet, View.Game.cbToriPieceStyle3D);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic3DMargin),
			},
			boardLayout: [
	      		"##.......##",
	      		"##.......##",
	      		"##.......##",
	      		"##.......##",
	      		"##.......##",
	      		"##.......##",
	      		"##.......##"
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(this.cbGridBoardClassic2DMargin),
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbShogiBoard3DMargin),
				},
			},
			clicker: {
				"2d": {
					width: 1025,
					height: 1025,
				},
				"3d": {
					scale: [.70,.70,.70],
				},
			},
			pieces: pieceSet, // prepared above
		};
	}

	/* Make the knight jump when moving */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		var file = aMove.f % 11;
		var d = aMove.t - aMove.f;
		if(aMove.a=='P' && (d == 22 || d == -22) || aMove.a == '+S' || file < 2 || file > 8)
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}

})();

