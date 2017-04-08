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
		header: 0.5,
		boardHeight: 3.5,
		footer: 0.5,
	});
	this.HuntBuildLayout();
	this.HuntMakeCoord();
	this.HuntDrawBoard();
	this.HuntMakePieces();

	if (this.mSkin=='asian') {
		$(".area-canvas,.highlight").addClass("asian");
	}
}
View.Game.SpecificSkinHuntDrawPiece=function(canvas,who){
	if (this.mSkin=='asian'){
		// we do not draw, we css :)
		canvas.addClass(who==JocGame.PLAYER_B?"asian-black":"asian-white");
	}
}