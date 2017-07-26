/*
 * Copyright(c) 2013-2016 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

 

 

(function() {

	View.Game.cbPromoSize = 1200;
	View.Game.cbTargetSelectColor = 0x8B4513;
	View.Game.cbDefineView = function() {

		var orthoBoardDelta = {
//			notationMode: 'in',
//			notationDebug: true,
		};
		var threeColors3D = {
			'colorFill' : { 
				"+": "rgba(0,0,32,1)",
				".": "rgba(160,150,150,0.9)",
				"#": "rgba(0,24,0,1)",
			}            
		}
		var threeColors2D = {
			'colorFill' : { 
				"+": "rgba(128,128,0,1)",
				".": "rgba(189,183,107,1)",
				"#": "rgba(85,107,47,1)",
			}            
		}
		var orthoBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,orthoBoardDelta,threeColors3D);
		var orthoBoard2d = $.extend(true,{},this.cbGridBoardClassic2DNoMargin,orthoBoardDelta,threeColors2D);
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,orthoBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,orthoBoard3d),
			},
			boardLayout: [
	     		".+.+.+.+.+",
	     		"#.#.#.#.#.",
	     		".+.+.+.+.+",
	     		"#.#.#.#.#.",
	     		".+.+.+.+.+",
	     		"#.#.#.#.#.",
	     		".+.+.+.+.+",
	     		"#.#.#.#.#.",
	     		".+.+.+.+.+",
	     		"#.#.#.#.#.",
			],

			board: {
				"2d": {
					draw: this.cbDrawBoardFn(orthoBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(orthoBoard3d),					
				},
			},
			clicker: {
				"2d": {
					width: 1400,
					height: 1400,
				},
				"3d": {
					scale: [.75,.75,.75],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"2d":{
						width: 1300,
						height: 1300,				
					},
					"3d": {
						scale: [.5,.5,.5],
					},
				},
				"fr-knight": {
					"3d": {
						scale: [.4,.4,.4],
						rotate: 90,
					},
				},
				"fr-unicorn": {
					"3d" : {
						rotate: 90,
					},
				},
			}),
		};
	}


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
	

})();