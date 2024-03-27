
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
						width: 1200,
						height: 1200,						
					},
					"skin2dwestern": this.cbShogiWesternPieceStyle()["default"]["2d"],
					"3d": {
						scale: [.60,.60,.60],
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
	      		"##.....##",
	      		"##.....##",
	      		"##.....##",
	      		"##.....##",
	      		"##.....##"
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
					width: 1200,
					height: 1200,
				},
				"3d": {
					scale: [.85,.85,.85],
				},
			},
			pieces: pieceSet, // prepared above
		};
	}

	/* Make piece drops jump */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		var f=aGame.cbVar.geometry.C(aMove.f);
		var h = (f==1 || f==7 ? 2000 : 0);
		return (zFrom+zTo+h)/2; // no jumping pieces
	}

})();

