View.Game.CheckersSetCellSide=function() {
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	var smallDimension=Math.min(this.mGeometry.width/(WIDTH+1), this.mGeometry.height/(HEIGHT+1))-1;
	this.g.cellSide = Math.floor(smallDimension);
}

View.Game.AlqDrawLine=function(fr,fc,tr,tc) {
	this.g.ctxField.beginPath();
	this.g.ctxField.moveTo(this.g.cellSide/2+fc*this.g.cellSide,this.g.cellSide/2+fr*this.g.cellSide);
	this.g.ctxField.lineTo(this.g.cellSide/2+tc*this.g.cellSide,this.g.cellSide/2+tr*this.g.cellSide);
	this.g.ctxField.closePath();
	this.g.ctxField.stroke();	
}

View.Game.CheckersDrawPiece=function(canvas,color) {
	var pathblack="";
	var pathwhite="";
	var GAME=this;	
	switch(this.mSkin){
		default:
		break;
		case "wood1":
		case "stone":
		case "modern":
		pathwhite=this.mViewOptions.fullPath+"/res/images/ball_red90.png";
		pathblack=this.mViewOptions.fullPath+"/res/images/ball_black90.png";
		break;
	}
	var ctx=canvas[0].getContext("2d");
	var l=ctx.canvas.width;
	var m=l/10;		

	if (pathblack.length>0){
		
		// shadow
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle="rgba(0,0,0,0.5)";
		ctx.arc(l/2-m/2,l/2+m/2,(l-m)/2,0,Math.PI*2,true);
		ctx.fill();
		ctx.restore();

		// token
		var imageObj = new Image();
	    imageObj.onload = function(){
	        ctx.drawImage(imageObj, m/2, 0, l-m/2, l-m/2);
		}
		if (color=="white"){
			imageObj.src = pathwhite;		
		}else{
		    imageObj.src = pathblack;		
		}
	}else{

	
		ctx.clearRect(0,0,l,l);
		// shadow
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle="rgba(0,0,0,0.5)";
		ctx.arc(l/2+m/4,l/2+m/2,(l-m)/2,0,Math.PI*2,true);
		ctx.fill();
		ctx.restore();
		// token
		var grad=ctx.createLinearGradient(0,0,0,l);
		if (color=="white"){
			grad.addColorStop(1, 'rgb(204,204,204)');
			grad.addColorStop(0, 'rgb(255,255,255)');
		}else{
			grad.addColorStop(1, 'rgb(0,0,0)');
			grad.addColorStop(0, 'rgb(102,102,102)');
		}
		ctx.fillStyle=grad;
		ctx.beginPath();
		ctx.strokeStyle="rgba(128,128,128,0.8)";
		ctx.arc(l/2,l/2,(l-m)/2,0,Math.PI*2,true);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	
		ctx.beginPath();
		ctx.strokeStyle="rgba(128,128,128,0.3)";
		ctx.arc(l/2,l/2,(l-m)/2.5,0,Math.PI*2,true);
		ctx.stroke();
		ctx.closePath();	
		ctx.beginPath();
		ctx.arc(l/2,l/2,(l-m)/8,0,Math.PI*2,true);
		ctx.stroke();
		ctx.closePath();
	}
}


View.Game.CheckersDrawBoard=function() {

	var path="";
	var GAME=this;
	switch(this.mSkin){
		default:
		break;
		case "wood1":
		path=this.mViewOptions.fullPath+"/res/images/alquarqueboard1.jpg";
		break;
		case "stone":
		path=this.mViewOptions.fullPath+"/res/images/alquarquegranit.jpg";
		break;
		case "modern":
		path=this.mViewOptions.fullPath+"/res/images/alquerquemodern2.jpg";
		break;
		
	}
	if (path.length > 0){
		var imageObj = new Image();
	    imageObj.onload = function(){
	        GAME.g.ctxField.drawImage(imageObj, 0, 0, GAME.g.boardW, GAME.g.boardH);
		}
	    imageObj.src = path;
	}else{
	
	    // sol2: drawing it 
	    
	   	var WIDTH=this.mOptions.width;
		var HEIGHT=this.mOptions.height;
	
	    
	    	
		var boardGradient = this.g.ctxField.createRadialGradient(
				-this.g.boardW/2,-this.g.boardW/2,0,
				this.g.boardW/6*4,this.g.boardW/6*2,this.g.boardW*2);
		boardGradient.addColorStop(0,"#BAF445");
		boardGradient.addColorStop(1,"#008000");
	
		
		this.g.ctxField.fillStyle = boardGradient ;
		this.g.ctxField.beginPath();
		this.g.ctxField.rect(0,0,this.g.boardW,this.g.boardH);
		this.g.ctxField.closePath();	
		this.g.ctxField.fill();
		
		this.g.ctxField.strokeStyle = "rgba(80,80,80,0.8)" ;
		this.g.ctxField.lineWidth = 4 ;	
	
		for(var r=0;r<HEIGHT;r++)
			this.AlqDrawLine(r,0,r,WIDTH-1);
		for(var c=0;c<WIDTH;c++)
			this.AlqDrawLine(0,c,HEIGHT-1,c);
	
		this.AlqDrawLine(0,0,HEIGHT-1,WIDTH-1);
		this.AlqDrawLine(0,WIDTH-1,HEIGHT-1,0);
		this.AlqDrawLine(2,0,0,2);
		this.AlqDrawLine(2,0,4,2);
		this.AlqDrawLine(0,2,2,4);
		this.AlqDrawLine(4,2,2,4);
	}
}

View.Game.CheckersMarginFactor = 5;
View.Game.CheckersPossibleMarginFactor = 1;

