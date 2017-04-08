/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

View.Game.InitView=function() {
	this.HuntInitView();
	this.g.AisWhite=true;
	$.extend(this.g.huntLayout,{
		header: 1,
		boardHeight: 9,
		footer: 1,
		left: 1,
		boardWidth: 7,
		right: 1,
	});

	this.g.SkipLines={3:5,5:6,6:4,7:9,9:10,10:8,11:13,13:14,14:12,15:17,17:18,18:16};
	
	this.HuntBuildLayout();
	this.HuntMakeCoord();
	this.HuntDrawBoard();
	this.HuntMakePieces();
	
	var dockRC=[0.2,0.9];
	this.g.DockCoord=[this.g.posSize*dockRC[1],this.g.posSize*dockRC[0]];
	
	this.g.pieceDock=$("<canvas/>").addClass("piece-dock").css({
		left: this.g.DockCoord[0],
		top: this.g.DockCoord[1],
	}).attr("width",this.g.posSize).attr("height",this.g.posSize).appendTo(this.g.area).hide();
	this.HuntDrawPiece(this.g.pieceDock,this.g.catcher);
	$("<div/>").addClass("piece-count").css({
		left: this.g.DockCoord[0],
		top: this.g.DockCoord[1]+this.g.posSize,
		width: this.g.posSize*1,
		height: this.g.posSize*1,
		"line-height": this.g.posSize+"px",
		"font-size": this.g.posSize/2+"pt",
	}).appendTo(this.g.area).hide();

}

View.Game.HuntPreDrawPositions=function(ctx) {
	var $this=this;
	ctx.save();
	var coord0=this.g.Coord[0];
	function DrawArc(pos) {
		var coord1=$this.g.Coord[pos];
		var r=Math.sqrt((coord0[0]-coord1[0])*(coord0[0]-coord1[0])+(coord0[1]-coord1[1])*(coord0[1]-coord1[1]));
		ctx.beginPath();
		ctx.arc(coord0[0],coord0[1],r,-Math.PI/5,-(4/5)*Math.PI,true);
		ctx.stroke();
		ctx.closePath();
	}
	DrawArc(3);
	DrawArc(7);
	DrawArc(11);
	DrawArc(15);
	
	ctx.restore();
}

View.Game.HuntDrawLine=function(ctx,pos1,pos2) {
	if(this.g.SkipLines[pos1]==pos2 || this.g.SkipLines[pos2]==pos1)
		return;
	var x0=this.g.Coord[pos1][0];
	var x1=this.g.Coord[pos2][0];
	var y0=this.g.Coord[pos1][1];
	var y1=this.g.Coord[pos2][1];
	ctx.beginPath();
	ctx.moveTo(x0,y0);
	ctx.lineTo(x1,y1);
	ctx.closePath();
	ctx.stroke();
}

View.Board.HuntAnimatePiece=function(aGame,pieceIndex,to,fnt) {
	var pos1=this.pieces[pieceIndex].p;
	if(aGame.g.SkipLines[pos1]==to || aGame.g.SkipLines[to]==pos1) {
		this.HuntAnimatePieceArc(aGame,pieceIndex,to,fnt);
		return;
	}
	var coord=aGame.g.Coord[to];
	var x=coord[0];
	var y=coord[1];
	aGame.g.pieces[pieceIndex].animate({
		left: x-aGame.g.posSize/2,
		top: y-aGame.g.posSize/2,
	},500,function() {
		fnt();
	});
}

View.Board.HuntAnimatePieceArc=function(aGame,pieceIndex,to,fnt) {
	var duration=500;
	var step=20;
	var loopMax=duration/step;
	var coord1=aGame.g.Coord[this.pieces[pieceIndex].p];
	var coord0=aGame.g.Coord[0];
	var coord=aGame.g.Coord[to];
	var dx=(coord[0]-coord0[0]);
	var dy=-(coord[1]-coord0[1]);
	var dx1=(coord1[0]-coord0[0]);
	var dy1=-(coord1[1]-coord0[1]);
	var r=Math.sqrt(dx*dx+dy*dy);
	var alpha=Math.atan(dy1/dx1);
	var alpha1=Math.atan(dy/dx);
	if(dx<0)
		alpha1+=Math.PI;
	if(dx1<0)
		alpha+=Math.PI;
	var dalpha=(alpha1-alpha)/loopMax;
	var loop=0;
	var piece=aGame.g.pieces[pieceIndex];
	var timer=setInterval(function() {
		piece.css({
			left: coord0[0]+r*Math.cos(alpha)-aGame.g.posSize/2,
			top: coord0[1]-r*Math.sin(alpha)-aGame.g.posSize/2,
		});
		alpha+=dalpha;
		loop++;
		if(loop==loopMax) {
			clearInterval(timer);
			fnt();
		}
	},step);
}


