/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

View.Game.InitView=function() {
	this.HuntInitView();
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
}
