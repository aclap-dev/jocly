
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
		var byzPaintCell = function(spec,ctx,images,channel,cellType,xCenter,yCenter,innerRadius,outerRadius,angle,deltaAngle) {
			ctx.strokeStyle = "rgba(0,0,0,0.5)";
			ctx.lineWidth = 10;
			if (channel=='bump')
				ctx.fillStyle="#ffffff";
			else
				ctx.fillStyle=spec.colorFill[cellType];
			ctx.beginPath();
		
			ctx.moveTo(innerRadius*Math.cos(angle-deltaAngle/2),innerRadius*Math.sin(angle-deltaAngle/2));
			ctx.lineTo(outerRadius*Math.cos(angle-deltaAngle/2),outerRadius*Math.sin(angle-deltaAngle/2));
			ctx.arc(0,0,outerRadius,angle-deltaAngle/2,angle+deltaAngle/2,false);
			ctx.lineTo(innerRadius*Math.cos(angle+deltaAngle/2),innerRadius*Math.sin(angle+deltaAngle/2));
			ctx.arc(0,0,innerRadius,angle+deltaAngle/2,angle-deltaAngle/2,true);
			
			ctx.closePath();
			if (channel!='bump')
				ctx.stroke();
			ctx.fill();
		}
		
		var board3d = $.extend(true,{},this.cbCircularBoardClassic3D,{
			//notationDebug: true,
			'colorFill' : {		
				".": "rgba(255,255,255,0.5)", // "white" cells
				"#": "rgba(0,0,0,0.2)", // "black" cells
				" ": "rgba(0,0,0,0)",
			},
			'texturesImg' : {
				'boardBG' : '/res/byzantine/byzantine-board.jpg',	
			},
			paintCell: byzPaintCell,
		});
		
		var board2d = $.extend(true,{},this.cbCircularBoardClassic2D,{
			//notationDebug: true,
			'margins' : {x:.3,y:.3},
			'texturesImg' : {
				'boardBG' : '/res/byzantine/byzantine-board.jpg',	
			},
			'colorFill' : {		
				".": "rgba(255,255,255,0.5)", // "white" cells
				"#": "rgba(0,0,0,0.2)", // "black" cells
				" ": "rgba(0,0,0,0)",
			},
			paintCell: byzPaintCell,
		});
		
		return {
			coords: {
				"2d": this.cbCircularBoard.coordsFn.call(this,board2d),
				"3d": this.cbCircularBoard.coordsFn.call(this,board3d),
			},
			boardLayout: [
	      		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#.",
			],
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
					scale: [.55,.55,.55],
				},
			},
			pieces: this.cbNishapurPieceStyle({
				"default": {
					"2d": {
						width: 800,
						height: 800,
					},
					"3d": {
						scale: [.45,.45,.45],
					},
				},
			}),
		};
	}
	/* Make the knight jump when moving */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
			return Math.max(zFrom,zTo)+800;
	}
})();
