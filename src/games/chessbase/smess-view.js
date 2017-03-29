
(function() {
	
	var arrowDraw=[
	 { img: "left", rot:0 },
	 { img: "", rot:0 },
	 { img: "left", rot:90 },
	 { img: "", rot:90 },
	 { img: "left", rot:180 },
	 { img: "", rot:180 },
	 { img: "left", rot:270 },
	 { img: "", rot:270 },
	];
	
	View.Game.cbSmessBoard = $.extend({},View.Game.cbGridBoardClassic,{
		
		'texturesImg' : {
			'promo' : '/res/smess/promo.png',
			'arrowtop' : '/res/smess/arrow-top.png',
			'arrowtopleft' : '/res/smess/arrow-top-left.png',
			'boardBG' : '/res/images/wood-chipboard-4.jpg',
		},
		
		paintCell: function(spec,ctx,images,channel,cellType,xCenter,yCenter,cx,cy) {
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = 15;
			ctx.rect(xCenter-cx/2,yCenter-cy/2,cx,cy);
			ctx.stroke();
			
			var arrows=cellType.charCodeAt(0) >> 8;
			for(var i=0;i<8;i++)
				if(arrows & (1<<i)) {
					ctx.save();
					ctx.translate(xCenter,yCenter);
					var img="arrowtop"+arrowDraw[i].img;
					ctx.rotate(arrowDraw[i].rot*Math.PI/180);
					var image=images[img];
					ctx.drawImage(image,0,0,image.width,image.height,-cx/2,-cy/2,cx,cy);					
					ctx.restore();
				}
			if(cellType.charCodeAt(0) & 1) {
				var image=images["promo"];
				ctx.drawImage(image,0,0,image.width,image.height,xCenter-cx/2,yCenter-cy/2,cx,cy);					
			}
		},
		
	});
	
	View.Game.cbSmessBoard3DMargin = $.extend({},View.Game.cbSmessBoard,{
		'3D':true,
		'margins' : {x:.35,y:.35},
		'extraChannels':[
			'bump'
		],
	});
	
	View.Game.cbSmessBoard2DMargin = $.extend({},View.Game.cbSmessBoard,{
		'margins' : {x:.35,y:.35},
	});
	
	View.Game.cbSmessBoard2DNoMargin = $.extend({},View.Game.cbSmessBoard,{
		'margins' : {x:0.0,y:0.0},
	});

	
	View.Game.cbDefineView = function() {

		var geometry = this.cbVar.geometry;
		var boardLayout = [];
		for(var r=0;r<geometry.height;r++) {
			var line="";
			for(var c=0;c<geometry.width;c++) {
				var pos=geometry.POS(c,r);
				var code=this.cbSmessGraph[pos]<<8;
				if(this.cbSmessPromoPoss["1"][pos] ||
					this.cbSmessPromoPoss["-1"][pos])
						code |= 1;
				line+=String.fromCharCode(code);
			}
			boardLayout.unshift(line);
		}
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbSmessBoard2DMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbSmessBoard3DMargin),
			},
			boardLayout: boardLayout,
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(this.cbSmessBoard2DMargin),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbSmessBoard3DMargin),					
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
			pieces: this.cbSmessPieceStyle({
				"default": {
					"2d": {
						width: 1000,
						height: 1000,						
					},
					"3d": {
						scale: [.4,.4,.4],
					},
				},
			}),
		};
	}

})();
