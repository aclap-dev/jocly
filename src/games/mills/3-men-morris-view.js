/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

View.Game.MillsGetLines=function() {
	var lines=[
	           [0,0,0,2],
	           [1,0,1,2],
	           [2,0,2,2],
	           [0,0,2,0],
	           [0,1,2,1],
	           [0,2,2,2],
	];
	return lines;
}

View.Game.xdInitExtra = function(xdv) {
	xdv.updateGadget("board", {
		"stone" : {
			file : this.mViewOptions.fullPath + "/res/images/3mensboard-stone.jpg",
		},
		"suede" : {
			file : this.mViewOptions.fullPath + "/res/images/3mensboard-suede.jpg",
		},
		"wood" : {
			file : this.mViewOptions.fullPath + "/res/images/3mensboard-wood.jpg",
		},
	});
}
