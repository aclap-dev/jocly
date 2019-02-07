
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
		var pieceSet = this.cbShogiPieceStyle({
				"default": {
					"2d": {
						width: 850,
						height: 850,						
					},
					"3d": {
						scale: [.42,.42,.42],
					},
				},
			});

			// this drop-view.js function extends piece sets with holdings counters
			View.Game.cbAddCounters(pieceSet, View.Game.cbShogiPieceStyle3D);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic3DMargin),
			},
			boardLayout: [
	      		"##.........##",
	      		"##.........##",
	      		"##.........##",
	      		"##.........##",
	      		"##.........##",
	      		"##.........##",
	      		"##.........##",
	      		"##.........##",
	      		"##.........##"
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
					width: 925,
					height: 925,
				},
				"3d": {
					scale: [.59,.59,.59],
				},
			},
			pieces: pieceSet, // prepared above
		};
	}

	/* Make the knight jump when moving */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		var file = aMove.f % 13;
		if(aMove.a=='N' || file < 2 || file > 10)
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}

})();

