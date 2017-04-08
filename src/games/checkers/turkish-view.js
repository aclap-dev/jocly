View.Game.CheckersSetCellSide=function() {
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	var smallDimension=Math.min(this.mGeometry.width/(WIDTH+1), this.mGeometry.height/(HEIGHT+1))-1;
	this.g.cellSide = Math.floor(smallDimension);
}

View.Game.CheckersDrawBoard = function(){
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	var path="";
	var GAME=this;
	switch(this.mSkin){
		default:
		break;
		case "wood0":
		path=this.mViewOptions.fullPath+"/res/images/damier8x8wood.jpg";
		break;
		case "marble0":
		path=this.mViewOptions.fullPath+"/res/images/damier8x8marble.jpg";
		break;
		case "classical":
		path=this.mViewOptions.fullPath+"/res/images/damier8x8classic.jpg";
		break;
		
	}
	if (path.length > 0){
		var imageObj = new Image();
	    imageObj.onload = function(){
	        GAME.g.ctxField.drawImage(imageObj, 0, 0, GAME.g.boardW, GAME.g.boardH);
		}
	    imageObj.src = path;
	}else{	
	
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
	}
}

View.Game.CheckersDrawCell=function(row,col,top,left,width,height) {
	if(row%2!=col%2)
		cell=$("<div/>").addClass("cell").addClass("cell-black").css({
			top: top,
			left: left,
			width: width,
			height: height,
		}).attr("joclypos",row+" "+col).appendTo(this.mWidget);
}

View.Game.CheckersMarginFactor = 7;
View.Game.CheckersPossibleMarginFactor = 0.5;
