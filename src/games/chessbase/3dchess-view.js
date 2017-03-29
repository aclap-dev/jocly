
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
			boardFloorFrames: [true,false,false],
			boardFloorMargins: [{x:.67,y:.67},{x:0,y:0},{x:0,y:0}],
			boardFloorOpacity: [1,.3,.3],
			interFloorsDist: 3000,
		});
		
		var board2d = $.extend(true,{},this.cbMultiplanBoardClassic2DNoMargin,{
			notationMode: 'in',
			//notationDebug: true,			
			boardFloorFrames: [false,false,false],
			margins: {x:.3,y:.3},
			boardFloorMargins: [{x:.3,y:.3},{x:.3,y:.3},{x:.3,y:.3}],
			boardFloor2dPos: [{x:-4000,y:3300},{x:0,y:0},{x:4000,y:-3300}],
			boardFloorSize: 4100,
		});
		
		
		return {
			coords: {
				"2d": this.cbMultiplanBoard.coordsFn.call(this,board2d),
				"3d": this.cbMultiplanBoard.coordsFn.call(this,board3d),
			},
			boardLayout: [[
				      		".#.#.#",
				     		"#.#.#.",
				      		".#.#.#",
				     		"#.#.#.",
				      		".#.#.#",
				     		"#.#.#.",
				      		".#.#.#",
				     		"#.#.#.",
						],[
				     		"#.#.#.",
				      		".#.#.#",
				     		"#.#.#.",
				      		".#.#.#",
				     		"#.#.#.",
				      		".#.#.#",
				     		"#.#.#.",
				      		".#.#.#",
						],[
				      		".#.#.#",
				     		"#.#.#.",
				      		".#.#.#",
				     		"#.#.#.",
				      		".#.#.#",
				     		"#.#.#.",
				      		".#.#.#",
				     		"#.#.#.",
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
					width: 650,
					height: 650,				
				},
				"3d": {
					scale: [.7,.7,.7],
				},
			},
			pieces: this.cbStauntonPieceStyle({
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
