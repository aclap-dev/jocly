
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
	var $this = this;
	var skins = this.mViewOptions.skins.filter(function(skin) {
		return skin.name === $this.mSkin;
	});
	if(skins.length>0 && skins[0].preload) {
		var resources = skins[0].preload.map(function(res) {
			var m = /^(.*?\|)([^\|]*)$/.exec(res);
			return m[1] + $this.mViewOptions.fullPath + m[2];
		});
		this.xdLoadResources(resources,function() {});
	}
}

View.Board.CheckersAngle = function(aGame,piece,from,to) {
	return 0;
}