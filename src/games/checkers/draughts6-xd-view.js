
View.Game.xdPreInit= function() {
	this.g.lightcellDistance=1.2;
}

View.Game.xdInitExtra = function(xdv) {
	xdv.updateGadget("board", {
		"kids" : {
			file : this.mViewOptions.fullPath + "/res/images/grasskids6x6.png",
		},
	});
}

