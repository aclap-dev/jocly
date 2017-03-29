
(function() {
	View.Game.cbExtraLights = [{
		color: 0xffffff,
		intensity: 1,
		position: [9, 14, -9],
		props: {
			shadowCameraNear: 10,
			shadowCameraFar: 25,
			castShadow: true,
			shadowDarkness: .25,
			shadowMapWidth: 2048,
			shadowMapHeight: 2048,
		},
	}]; 	
	View.Game.cbDefineView = function() {
		
		var board3d = $.extend(true,{},this.cbMultiplanBoardClassic3DMargin,{
			notationMode: 'in',
			//notationDebug: true,			
			boardFloorFrames: [true,false,false,false,false],
			boardFloorMargins: [{x:.67,y:.67},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}],
			boardFloorOpacity: [1,.2,.2,.2,.2],
			boardFloorBackground: [true,false,false,false,false],
		});
		
		var board2d = $.extend(true,{},this.cbMultiplanBoardClassic2DNoMargin,{
			notationMode: 'in',
			//notationDebug: true,			
			boardFloorFrames: [false,false,false,false,false],
			boardFloorMargins: [{x:.0,y:.0},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}],
			boardFloor2dPos: [{x:2000,y:3500},{x:-2000,y:2000},{x:4000,y:-500},{x:0,y:-2000},{x:-4000,y:-3500}],
			boardFloorSize: 3800,
		});
		
		
		return {
			coords: {
				"2d": this.cbMultiplanBoard.coordsFn.call(this,board2d),
				"3d": this.cbMultiplanBoard.coordsFn.call(this,board3d),
			},
			boardLayout: [[
				      		".#.#.",
				     		"#.#.#",
				     		".#.#.",
				     		"#.#.#",
				     		".#.#.",
						],[
				     		"#.#.#",
				     		".#.#.",
				     		"#.#.#",
				     		".#.#.",
				     		"#.#.#",
						],[
				      		".#.#.",
				     		"#.#.#",
				     		".#.#.",
				     		"#.#.#",
				     		".#.#.",
						],[
				     		"#.#.#",
				     		".#.#.",
				     		"#.#.#",
				     		".#.#.",
				     		"#.#.#",
						],[
				      		".#.#.",
				     		"#.#.#",
				     		".#.#.",
				     		"#.#.#",
				     		".#.#.",
						]],
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
					width: 800,
					height: 800,				
				},
				"3d": {
					scale: [.9,.9,.9],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"2d": {
						width: 600,
						height: 600,
					},
					"3d": {
						scale: [.6,.6,.6],
					},
				},
			}),
			captureAnim3d: "scaledown",
		};
	}

	/* Make the knight jump when moving */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		if(aMove.a=='N' || (zFrom!=zTo))
			return Math.max(zFrom,zTo)+1500;
		else
			return (zFrom+zTo)/2;
	}
	
})();
