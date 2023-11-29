
(function() {

	function drawAdancedPattern(ctx,img,xCenter,yCenter,cx,cy,fillColor,compMode,rotationDeg){
		var bInvert
		var buffCz=512;
		var tmpCanvas = document.createElement('canvas');
		tmpCanvas.width=tmpCanvas.height=buffCz;
		ctxTmp=tmpCanvas.getContext('2d');
        ctxTmp.fillStyle=fillColor;
        ctxTmp.fillRect(0,0,buffCz,buffCz);
        ctxTmp.translate(buffCz/2,buffCz/2);
        if (rotationDeg)
        ctxTmp.rotate(rotationDeg/180*Math.PI);
        ctxTmp.globalCompositeOperation=compMode;
		ctxTmp.drawImage(img,0,0,img.width,img.height,-buffCz/2,-buffCz/2,buffCz,buffCz);
		// now paste the result in diffuse canvas
        ctx.drawImage(tmpCanvas,0,0,buffCz,buffCz,xCenter-cx/2,yCenter-cy/2,cx,cy);
	}
	
	function drawFilledPattern(ctx,img,xCenter,yCenter,cx,cy,fillColor,rotationDeg){
		drawAdancedPattern(ctx,img,xCenter,yCenter,cx,cy,fillColor,'destination-in',rotationDeg);
	}
	function drawInvertedFilledPattern(ctx,img,xCenter,yCenter,cx,cy,fillColor,rotationDeg){
		drawAdancedPattern(ctx,img,xCenter,yCenter,cx,cy,fillColor,'destination-out',rotationDeg);
	}

		
	View.Game.cbDefineView = function() {
	
		var cornerCut = .3;
		
		var rbBoard = $.extend(true,{},this.cbGridBoardClassic,{
			'texturesImg' : {
				'boarddeco-star': '/res/rollerball/kingstar.png',
				'boarddeco-starterline': '/res/rollerball/starterline-cell-12.png',
				'boarddeco-starterline-inverted': '/res/rollerball/starterline-cell-12-inverted.png',
				'boarddeco-arrow': '/res/rollerball/left-arrow.png',
			},	

			//notationMode: "in",
			//notationDebug: true,
			margins: { x: .67, y: .67 },
			paintLines: function(spec,ctx,images,channel) {
				var cSize = this.cbCSize(spec);
				ctx.strokeStyle = "#000000";
				ctx.lineWidth = 40;
				ctx.strokeRect(-3*cSize.cx/2,-3*cSize.cy/2,3*cSize.cx,3*cSize.cy);
				ctx.beginPath();
				ctx.moveTo((cornerCut*2-7)*cSize.cx/2,-7*cSize.cy/2);
				ctx.lineTo((7-cornerCut*2)*cSize.cx/2,-7*cSize.cy/2);
				ctx.lineTo(7*cSize.cx/2,(cornerCut*2-7)*cSize.cy/2);
				ctx.lineTo(7*cSize.cx/2,(7-cornerCut*2)*cSize.cy/2);
				ctx.lineTo((7-cornerCut*2)*cSize.cx/2,7*cSize.cy/2);
				ctx.lineTo((cornerCut*2-7)*cSize.cx/2,7*cSize.cy/2);
				ctx.lineTo(-7*cSize.cx/2,(7-cornerCut*2)*cSize.cy/2);
				ctx.lineTo(-7*cSize.cx/2,(cornerCut*2-7)*cSize.cy/2);
				ctx.closePath();
				
				ctx.stroke();
				
				drawFilledPattern(ctx,images['boarddeco-arrow'],0,cSize.cy,cSize.cx,cSize.cy,"rgba(0,0,0,1)",0);
				drawFilledPattern(ctx,images['boarddeco-arrow'],-cSize.cx,0,cSize.cx,cSize.cy,"rgba(0,0,0,1)",90);
				drawFilledPattern(ctx,images['boarddeco-arrow'],0,-cSize.cy,cSize.cx,cSize.cy,"rgba(0,0,0,1)",180);
				drawFilledPattern(ctx,images['boarddeco-arrow'],cSize.cx,0,cSize.cx,cSize.cy,"rgba(0,0,0,1)",270);
			},
			paintCells: function(spec,ctx,images,channel) {
				var cSize = this.cbCSize(spec);
				var getCoords=spec.coordsFn(spec);
				var cornerCells={
					0:[0,0,1,0],
					6:[0,1,0,0],
					42:[0,0,0,1],
					48:[1,0,0,0],
				};
				var specialCells={10:'k',9:'p',2:'p',38:'k',39:'p',46:'p'};
				for(var row=0;row<7;row++) {
					for(var col=0;col<7;col++) {
						var pos = this.mViewAs==1 ?
							col+row*7 :
							7*7-(1+col+row*7);
						var coords=getCoords.call(this,pos);
						var cellType=this.cbView.boardLayout[7-row-1][col];
						var xCenter=coords.x;
						var yCenter=coords.y;
						var cx=cSize.cx;
						var cy=cSize.cy;
						
						var invertedCelltype=cellType=="#"?".":"#";
						var cornerCell=cornerCells[pos];
						if(cornerCell)
							spec.paintCornerCell.call(this,spec,ctx,images,channel,cellType,xCenter,yCenter,cx,cy,cornerCell);
						else if(specialCells[pos]){
							var fillStyle="#ffffff";
							if (channel!='bump')
								fillStyle=spec.colorFill[cellType];
							if (specialCells[pos]=='k'){
								spec.paintCell.call(this,spec,ctx,images,channel,invertedCelltype,xCenter,yCenter,cx,cy);
								if(images['boarddeco-star']){
									drawInvertedFilledPattern(ctx,images['boarddeco-star'],xCenter,yCenter,cx,cy,fillStyle,
									pos>20?0:180);
								}
							}
							if (specialCells[pos]=='p'){
								if (cellType=="."){
									spec.paintCell.call(this,spec,ctx,images,channel,".",xCenter,yCenter,cx,cy);
									drawFilledPattern(ctx,images['boarddeco-starterline'],xCenter,yCenter,cx,cy,spec.colorFill["#"],pos>20?0:180);
								}
								if (cellType=="#"){
									spec.paintCell.call(this,spec,ctx,images,channel,".",xCenter,yCenter,cx,cy);
									drawFilledPattern(ctx,images['boarddeco-starterline-inverted'],xCenter,yCenter,cx,cy,spec.colorFill["#"],pos>20?0:180);
								}
							}
						} else
							spec.paintCell.call(this,spec,ctx,images,channel,cellType,xCenter,yCenter,cx,cy);						
					}
				}
			},
			paintCornerCell: function(spec,ctx,images,channel,cellType,xCenter,yCenter,cx,cy,cornerCell) {
				ctx.save();
				ctx.translate(xCenter,yCenter);
				ctx.strokeStyle = "rgba(0,0,0,1)";
				ctx.lineWidth = 15;
				if (channel=='bump')
					ctx.fillStyle="#ffffff";
				else
					ctx.fillStyle=spec.colorFill[cellType];
				ctx.beginPath();
				ctx.moveTo((cornerCut*2*cornerCell[3]-1)*cx/2,-1*cy/2);
				ctx.lineTo((1-cornerCut*2*cornerCell[0])*cx/2,-1*cy/2);
				ctx.lineTo(1*cx/2,(cornerCut*2*cornerCell[0]-1)*cy/2);
				ctx.lineTo(1*cx/2,(1-cornerCut*2*cornerCell[1])*cy/2);
				ctx.lineTo((1-cornerCut*2*cornerCell[1])*cx/2,1*cy/2);
				ctx.lineTo((cornerCut*2*cornerCell[2]-1)*cx/2,1*cy/2);
				ctx.lineTo(-1*cx/2,(1-cornerCut*2*cornerCell[2])*cy/2);
				ctx.lineTo(-1*cx/2,(cornerCut*2*cornerCell[3]-1)*cy/2);
				ctx.closePath();

				ctx.fill();
				ctx.stroke();
				
				ctx.restore();
			},
		});

		var rbBoard2d = $.extend(true,{},rbBoard,{
			'colorFill' : {		
				".": "#F1D9B3", // "white" cells
				"#": "#C7885D", // "black" cells
				" ": "rgba(0,0,0,0)",
			},
			'texturesImg' : {
				'boardBG' : '/res/images/whitebg.png',
			},
		});

		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,rbBoard),
				"3d": this.cbGridBoard.coordsFn.call(this,rbBoard),
			},
			boardLayout: [
	      		"#.#.#.#",
	     		".#.#.#.",
	     		"#.   .#",
	     		".#   #.",
	     		"#.   .#",
	     		".#.#.#.",
	     		"#.#.#.#",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(rbBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(rbBoard),					
				},
			},
			clicker: {
				"2d": {
					width: 1300,
					height: 1300,
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
		};
	}

	
})();
