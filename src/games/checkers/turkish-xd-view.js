
View.Game.xdPreInit= function() {
	this.g.lightcellDistance=1.2;
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

View.Board.CheckersAngle = function(aGame,piece,from,to) {
	return 0;
}