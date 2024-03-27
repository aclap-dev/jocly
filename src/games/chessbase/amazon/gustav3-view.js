/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

 

(function() {
	
	View.Game.cbDefineView = function() {

		var gustavBoardDelta = {
		};		
		var gustavBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,gustavBoardDelta);
		var gustavBoard2d = $.extend(true,{},this.cbGridBoardClassic2DMargin,gustavBoardDelta);
		
		
		var g3Board = $.extend(true,{},this.cbGridBoardClassic,{

			paintLines:function(spec,ctx,images,channel) {
				var cSize = this.cbCSize(spec);
				ctx.strokeStyle = "#000000";
				ctx.lineWidth = 40;
				ctx.beginPath();
				ctx.moveTo(-cSize.cx*5,-cSize.cy*4);
				ctx.lineTo(cSize.cx*5,-cSize.cy*4);
				ctx.lineTo(cSize.cx*5,-cSize.cy*3);
				ctx.lineTo(cSize.cx*4,-cSize.cy*3);	
				ctx.lineTo(cSize.cx*4,cSize.cy*3);	
				ctx.lineTo(cSize.cx*5,cSize.cy*3);	
				ctx.lineTo(cSize.cx*5,cSize.cy*4);	
				ctx.lineTo(-cSize.cx*5,cSize.cy*4);	
				ctx.lineTo(-cSize.cx*5,cSize.cy*3);	
				ctx.lineTo(-cSize.cx*4,cSize.cy*3);	
				ctx.lineTo(-cSize.cx*4,-cSize.cy*3);	
				ctx.lineTo(-cSize.cx*5,-cSize.cy*3);	
				ctx.lineTo(-cSize.cx*5,-cSize.cy*4);	
						
				ctx.closePath();				
				ctx.stroke();
				
			},
			margins: { x: .67, y: .67 },
		});
		
		var g3Board2d = $.extend(true,{},g3Board,{
			'colorFill' : {		
				".": "#F1D9B3", // "white" cells
				"#": "#C7885D", // "black" cells
				" ": "rgba(0,0,0,0)",
			},
			'texturesImg' : {
				'boardBG' : '/res/images/whitebg.png',
			},
			margins: { x: 0, y: 0 },
		});
		
				
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,g3Board2d),
				"3d": this.cbGridBoard.coordsFn.call(this,g3Board),
			},
			boardLayout: [
	      		"#.#.#.#.#.",
	     		" #.#.#.#. ",
	     		" .#.#.#.# ",
	     		" #.#.#.#. ",
	     		" .#.#.#.# ",
	     		" #.#.#.#. ",
	     		" .#.#.#.# ",
	     		".#.#.#.#.#",				
			],

			board: {
				"2d": {
					draw: this.cbDrawBoardFn(g3Board2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(g3Board),					
				},
			},
			clicker: {
				"2d": {
					width: 1200,
					height: 1200,
				},
				"3d": {
					scale: [.75,.75,.75],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"3d": {
						scale: [.5,.5,.5],
					},
					"2d": {
						width: 1100,
						height: 1100,
					},
				},
				"fr-amazon": {
					"3d": {
						scale: [.5,.5,.6],
					},
				},
			}),
		};
	}

	/* Make the knight and amazon jump when leaping */
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