
View.Game.xdPreInit= function() {
	this.g.lightcellDistance=1.7;
	this.g.dimensions={
			width: this.mOptions.width, 
			squareWidth: this.mOptions.width, 
			height: this.mOptions.height, 
		}
	this.g.getColumn=function(c,r) {
		return c;			
	}
}

View.Game.xdInitExtra = function(xdv) {
	xdv.updateGadget("board", {
		"2d-wood-alquerque" : {
			file : this.mViewOptions.fullPath + "/res/images/alquarqueboard1.jpg",
		},
	});
}

