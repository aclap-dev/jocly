(function() {
	
	View.Game.cbXiangqiBoard = $.extend({},View.Game.cbGridBoardClassic,{
		'colorFill' : {		
			".": "rgba(0,0,0,0)", 
		},
		
		'texturesImg' : {
			'boardBG' : '/res/xiangqi/wood2.jpg',
			'boarddeco1': '/res/xiangqi/decoration-cross.png',
		},
		
		paintCell: function(spec,ctx,images,channel,cellType,xCenter,yCenter,cx,cy) {
		},

		paintBackground: function(spec,ctx,images,channel,bWidth,bHeight) {
			if (channel=='diffuse')
				ctx.drawImage(images['boardBG'],-bWidth/2,-bHeight/2,bWidth,bHeight);				
		},		
		
		paintLines: function(spec,ctx,images,channel) {

			var $this=this;
			
			var NBROWS=10, NBCOLS=9;
			
			var cSize = this.cbCSize(spec);
			var getCoords=spec.coordsFn(spec);

			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = 15;
			
			function Pos(col,row) {
				return $this.mViewAs==1 ?
						col+row*NBCOLS :
						NBCOLS*NBROWS-(1+col+row*NBCOLS);
			}
	
			function JoinPoints(start,end){
				var p0=getCoords.call($this,Pos(start.col,start.row));
				var p1=getCoords.call($this,Pos(end.col,end.row));
				ctx.beginPath();
				ctx.moveTo(p0.x,p0.y);
				ctx.lineTo(p1.x,p1.y);
				ctx.stroke();
			}
			
			function PositionDecoration(point){
				var p=getCoords.call($this,Pos(point.col,point.row));				
				var cx=cSize.cx/2;
				var cy=cSize.cy/2;
				if(images['boarddeco1']){
					var image=images['boarddeco1'];
					switch (point.col){
						default:
							ctx.drawImage(image,p.x-cx/2,p.y-cy/2,cx,cy);
						break;
						case 0:
							ctx.drawImage(image,image.width/2,0,image.width/2,image.height,p.x,p.y-cy/2,cx/2,cy);
						break;
						case 8:
							ctx.drawImage(image,0,0,image.width/2,image.height,p.x-cx/2,p.y-cy/2,cx/2,cy);
						break;
					}
				}				
			}

			/*
			if (channel=='diffuse'){
				ctx.fillStyle="rgba(50,0,0,0.5)";
				ctx.fillRect(-game.JOCLYFIELDSIZE/2,-game.JOCLYFIELDSIZE/2,game.JOCLYFIELDSIZE,game.JOCLYFIELDSIZE);
			}
			*/
	
			var topleft=getCoords.call($this,Pos(0,NBROWS-1));
			ctx.save();
			ctx.lineWidth = 60;
			ctx.fillStyle="rgba(231,208,167,0.0)";
			//ctx.fillStyle="rgba(0,0,0,0.3)";
			//ctx.globalCompositeOperation = 'multiply';
			ctx.rect(topleft.x,topleft.y,
				(NBCOLS-1)*cSize.cx,
				(NBROWS-1)*cSize.cy);
			ctx.fill();
			ctx.stroke();
			ctx.restore();
	
			for(var row=1;row<NBROWS;row++){
				var pos=Pos(0,row);
				var coords=getCoords.call($this,pos);
				ctx.strokeRect(coords.x, coords.y, (NBCOLS-1)*cSize.cx, cSize.cy);
			}
			for (var row=4;row<NBROWS;row+=5){
				for(var col=0;col<(NBCOLS-1);col++){
					var pos=Pos(col,row);
					var coords=getCoords.call($this,pos);
					ctx.strokeRect(coords.x, coords.y, cSize.cx, 4*cSize.cy);
				}
			}
			JoinPoints({col:3,row:0},{col:5,row:2});
			JoinPoints({col:5,row:0},{col:3,row:2});
			JoinPoints({col:3,row:9},{col:5,row:7});
			JoinPoints({col:5,row:9},{col:3,row:7});
			
			PositionDecoration({col:1,row:2});
			PositionDecoration({col:7,row:2});
			PositionDecoration({col:1,row:7});
			PositionDecoration({col:7,row:7});
			for (var col=0; col < 9 ; col+=2){				
				PositionDecoration({col:col,row:3});
				PositionDecoration({col:col,row:6});
			}
		},
	});
	
	View.Game.cbXiangqiBoard3DMargin = $.extend({},View.Game.cbXiangqiBoard,{
		'3D':true,
		'margins' : {x:.35,y:.35},
		'extraChannels':[
			'bump'
		],
	});
	
	View.Game.cbXiangqiBoard2DMargin = $.extend({},View.Game.cbXiangqiBoard,{
		'margins' : {x:.35,y:.35},
	});
	
	View.Game.cbXiangqiBoard2DNoMargin = $.extend({},View.Game.cbXiangqiBoard,{
		'margins' : {x:0.0,y:0.0},
	});
	
})();