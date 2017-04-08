/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

View.Game.MillsGetLines=function() {
	var lines=[
	           [0,0,0,6],
	           [1,1,1,5],
	           [2,2,2,4],
	           [3,0,3,2],
	           [3,4,3,6],
	           [4,2,4,4],
	           [5,1,5,5],
	           [6,0,6,6],
	           [0,0,6,0],
	           [1,1,5,1],
	           [2,2,4,2],
	           [0,3,2,3],
	           [4,3,6,3],
	           [2,4,4,4],
	           [1,5,5,5],
	           [0,6,6,6],
	           [0,0,2,2],
	           [0,6,2,4],
	           [6,0,4,2],
	           [6,6,4,4],
	           
	];
	return lines;
}

View.Game.xdInitExtra = function(xdv) {
	xdv.updateGadget("board", {
		"stone" : {
			file : this.mViewOptions.fullPath + "/res/images/12mensboard-stone.jpg",
		},
		"suede" : {
			file : this.mViewOptions.fullPath + "/res/images/12mensboard-suede.jpg",
		},
		"wood" : {
			file : this.mViewOptions.fullPath + "/res/images/12mensboard-wood.jpg",
		},
	});
}
