View.Game.CheckersDrawBoard = function(){
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	var path="";
	var GAME=this;
	switch(this.mSkin){
		default:
		break;
		case "halloween":
			if (HEIGHT==8) path=this.mViewOptions.fullPath+"/res/images/damier8x8halloween.jpg";
			if (HEIGHT==10) path=this.mViewOptions.fullPath+"/res/images/damier10x10wood.jpg";
			break;
		case "wood0":
			if (HEIGHT==8) path=this.mViewOptions.fullPath+"/res/images/damier8x8wood.jpg";
			if (HEIGHT==10) path=this.mViewOptions.fullPath+"/res/images/damier10x10wood.jpg";
			break;
		case "marble0":
		if (HEIGHT==8) path=this.mViewOptions.fullPath+"/res/images/damier8x8marble.jpg";
		if (HEIGHT==10) path=this.mViewOptions.fullPath+"/res/images/damier10x10marble.jpg";
		break;
		case "classical":
		if (HEIGHT==8) path=this.mViewOptions.fullPath+"/res/images/damier8x8classic.jpg";
		if (HEIGHT==10) path=this.mViewOptions.fullPath+"/res/images/damier10x10classic.jpg";
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

View.Game.CheckersSetBoardSize=function() {
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	this.g.boardW=this.g.cellSide*WIDTH*2;
	this.g.boardH=this.g.cellSide*HEIGHT;
}

View.Game.CheckersGetCellPosition=function(row,col) {
	return {
		"top": this.g.top+row*this.g.cellSide,
		"left": this.g.left+(2*col+(1-row%2))*this.g.cellSide,
	}
}

View.Game.CheckersDrawCell=function(row,col,top,left,width,height) {
	var cell=$("<div/>").addClass("cell").css({
		top: top,
		left: left,
		width: width,
		height: height,
	}).attr("joclypos",row+" "+col).appendTo(this.mWidget);
	if(this.mSkin=='green') cell.addClass("cell-black");
}
