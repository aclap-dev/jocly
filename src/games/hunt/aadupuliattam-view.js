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
		boardHeight: 7,
		footer: 1,
		left: 1,
		boardWidth: 7,
		right: 1,
	});
	this.HuntBuildLayout();
	this.HuntMakeCoord();
	this.HuntDrawBoard();
	this.HuntMakePieces();
	
	var dockRC=[0.6,7.5];
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

