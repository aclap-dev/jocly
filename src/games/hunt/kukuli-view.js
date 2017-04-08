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
		boardHeight: 6.6,
		footer: 1,
	});
	this.HuntBuildLayout();
	this.HuntMakeCoord();
	this.HuntDrawBoard();
	this.HuntMakePieces();
	
	if (this.mSkin=='peruvian') {
		$(".area-canvas,.highlight").addClass("peruvian");
	}	
}
View.Game.SpecificSkinHuntDrawPiece=function(canvas,who){
	if (this.mSkin=='peruvian'){
		// we do not draw, we css :)
		canvas.addClass(who==JocGame.PLAYER_B?"peruvian-black":"peruvian-white");
	}
}