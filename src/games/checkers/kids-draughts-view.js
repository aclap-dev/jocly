
View.Game.CheckersSetCellSide=function() {
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	var smallDimension=Math.min(this.mGeometry.width/((WIDTH*2)+1), this.mGeometry.height/(HEIGHT+1))-1;
	this.g.cellSide = Math.floor(smallDimension);
}

View.Game.CheckersDrawBoard = function(){
	var GAME=this;
	var path=this.mViewOptions.fullPath+"/res/images/grass3.jpg";
	var imageObj = new Image();
	imageObj.onload = function(){
        GAME.g.ctxField.drawImage(imageObj, 0, 0, GAME.g.boardW, GAME.g.boardH);
	}
    imageObj.src = path;	
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
	var cell=$("<div/>").addClass("cell").addClass("cell-black").css({
		top: top,
		left: left,
		width: width,
		height: height,
	}).attr("joclypos",row+" "+col).appendTo(this.mWidget);
}

View.Game.CheckersDrawKidsPiece=function(canvas,color,bKing) {
	var pathblack="";
	var pathwhite="";
	var GAME=this;	
	
	if(bKing){
		pathwhite=this.mViewOptions.fullPath+"/res/images/kidsredking.png";
		pathblack=this.mViewOptions.fullPath+"/res/images/kidsblueking.png";
	}else{
		pathwhite=this.mViewOptions.fullPath+"/res/images/kidsred.png";
		pathblack=this.mViewOptions.fullPath+"/res/images/kidsblue.png";
	}
		
	
	var ctx=canvas[0].getContext("2d");
	var l=ctx.canvas.width;
	var m=l/10;
	
	ctx.clearRect(0,0,l,l);
	
	// token
	var imageObj = new Image();
    imageObj.onload = function(){
        ctx.drawImage(imageObj, 0, 0, l, l);
	}
	if (color=="white"){
		imageObj.src = pathwhite;		
	}else{
	    imageObj.src = pathblack;		
	}
	
}
View.Game.CheckersDrawPiece=function(canvas,color) {
	this.CheckersDrawKidsPiece(canvas,color,false);
}

View.Game.CheckersDrawPieceKing=function(canvas,color) {
	this.CheckersDrawKidsPiece(canvas,color,true);
}