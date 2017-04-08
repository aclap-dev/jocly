/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

View.Game.MillsGetLines=function() {
	var lines=[
	           [0,0,0,4],
	           [1,1,1,3],
	           [2,0,2,1],
	           [2,3,2,4],
	           [3,1,3,3],
	           [4,0,4,4],
	           [0,0,4,0],
	           [1,1,3,1],
	           [0,2,1,2],
	           [3,2,4,2],
	           [1,3,3,3],
	           [0,4,4,4],
	           [1,2,3,2],
	           [2,1,2,3],
	];
	return lines;
}

View.Game.xdInitExtra = function(xdv) {
	xdv.updateGadget("board", {
		"stone" : {
			file : this.mViewOptions.fullPath + "/res/images/7mensboard-stone.jpg",
		},
		"suede" : {
			file : this.mViewOptions.fullPath + "/res/images/7mensboard-suede.jpg",
		},
		"wood" : {
			file : this.mViewOptions.fullPath + "/res/images/7mensboard-wood.jpg",
		},
	});
}
