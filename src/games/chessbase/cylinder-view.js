
(function() {
	var lightPos = 14;
	var lightInt = .5;

	View.Game.cbExtraLights = [{
		color: 0xffffff,
		intensity: lightInt,
		position: [-lightPos, lightPos, -lightPos],
		props: {
			shadowCameraNear: 15,
			shadowCameraFar: 40,
			castShadow: true,
			shadowDarkness: .25,
			shadowMapWidth: 2048,
			shadowMapHeight: 2048,
			//shadowCameraVisible: true,
		},
	},{
		color: 0xffffff,
		intensity: lightInt,
		position: [lightPos, lightPos, lightPos],
		props: {
			shadowCameraNear: 15,
			shadowCameraFar: 40,
			castShadow: false,
			shadowDarkness: .25,
			shadowMapWidth: 2048,
			shadowMapHeight: 2048,
		},
	},{
		color: 0xffffff,
		intensity: lightInt,
		position: [lightPos, -lightPos, lightPos],
		props: {
			shadowCameraNear: 15,
			shadowCameraFar: 40,
			castShadow: true,
			shadowDarkness: .25,
			shadowMapWidth: 2048,
			shadowMapHeight: 2048,
		},
	},{
		color: 0xffffff,
		intensity: lightInt,
		position: [-lightPos, -lightPos, -lightPos],
		props: {
			shadowCameraNear: 15,
			shadowCameraFar: 40,
			castShadow: false,
			shadowDarkness: .25,
			shadowMapWidth: 2048,
			shadowMapHeight: 2048,
		},
	}]; 
		
	View.Game.cbDefineView = function() {
		
		var board3d = $.extend(true,{},this.cbCylinderBoardClassic,{
			//notationDebug: true,
			//colShift: 0,
		});

		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DNoMargin),
				"3d": this.cbCylinderBoard.coordsFn.call(this,board3d),
			},
			boardLayout: [
	      		".#.#.#.#",
	     		"#.#.#.#.",
	     		".#.#.#.#",
	     		"#.#.#.#.",
	     		".#.#.#.#",
	     		"#.#.#.#.",
	     		".#.#.#.#",
	     		"#.#.#.#.",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(this.cbGridBoardClassic2DNoMargin),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(board3d),					
				},
			},
			clicker: {
				"2d": {
					width: 1400,
					height: 1400,
				},
				"3d": {
					scale: [.9,.9,.9],
				},
			},
			pieces: this.cbStauntonPieceStyle({
				"default": {
					"2d": {
						width: 1300,
						height: 1300,						
					},
					"3d": {
						scale: [.6,.6,.6],
					},
				},
			}),
			captureAnim3d: "scaledown",
		};
	}

})();
