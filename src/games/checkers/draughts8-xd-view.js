
View.Game.xdPreInit= function() {
	this.g.lightcellDistance=1.2;
}

View.Game.xdInitExtra = function(xdv) {
	xdv.updateGadget("board", {
		"wood0" : {
			file : this.mViewOptions.fullPath + "/res/images/damier8x8wood.jpg",
		},
		"marble0" : {
			file : this.mViewOptions.fullPath + "/res/images/damier8x8marble.jpg",
		},
		"classical" : {
			file : this.mViewOptions.fullPath + "/res/images/damier8x8classic.jpg",
		},
		"green" : {
			file : this.mViewOptions.fullPath + "/res/images/damier8x8green.jpg",
		},
	});
}

