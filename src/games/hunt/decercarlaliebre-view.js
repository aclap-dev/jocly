/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

View.Game.GameSpecificInit=function(){
	if (this.mSkin=='medieval'){
		$(".area-canvas,.highlight,.notation").addClass("medieval");
	}
}
View.Game.SpecificSkinHuntDrawPiece=function(canvas,who){
	if (this.mSkin=='medieval'){
		// we do not draw, we css :)
		canvas.addClass(who==JocGame.PLAYER_B?"medieval-hunter":"medieval-liebre");
	}
}