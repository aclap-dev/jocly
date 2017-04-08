View.Game.xdPreInit= function() {
	this.g.lightcellDistance=1.0;
}


View.Game.xdInitExtra = function(xdv) {
	xdv.updateGadget("board", {
		"wood0" : {
			file : this.mViewOptions.fullPath + "/res/images/damier10x10wood.jpg",
		},
		"marble0" : {
			file : this.mViewOptions.fullPath + "/res/images/damier10x10marble.jpg",
		},
		"classical" : {
			file : this.mViewOptions.fullPath + "/res/images/damier10x10classic.jpg",
		},
		"green" : {
			file : this.mViewOptions.fullPath + "/res/images/damier10x10green.jpg",
		},
	});

}

