/*
 * Copyright (c) 2013 - Jocly - www.jocly.com - All rights reserved
 */

View.Board.xdShowEnd=function(xdv,aGame) {
	var $this=this;
	if(this.mWinLine) {
		var winLine={};
		for(var i=0;i<this.mWinLine.length;i++) {
			winLine[this.mWinLine[i]]=true;
		}
		var animCount=0;
		function EndAnim(callback) {
			if(--animCount==0)
				callback();
		}
		function Fade(callback) {
			for(var pos=0;pos<aGame.g.Graph.length;pos++) {
				if($this.board[pos]>0 && !(pos in winLine)) {
					animCount++;
					xdv.updateGadget("piece#"+pos, {
						"2d": {
							opacity: .2,
						},
						"3d": {
							materials: {
								"ball": {
									opacity: .2,
								},
							}
						},
					},500,function() {
						EndAnim(callback);				
					});
				}
			}
		}
		function UnFade(callback) {
			for(var pos=0;pos<aGame.g.Graph.length;pos++) {
				if($this.board[pos]>0 && !(pos in winLine)) {
					animCount++;
					xdv.updateGadget("piece#"+pos, {
						"2d": {
							opacity: 1,
						},
						"3d": {
							materials: {
								"ball": {
									opacity: 1,
								},
							}
						},
					},500,function() {
						EndAnim(callback);				
					});
				}
			}
		}
		Fade(function() {
			setTimeout(function() {
				UnFade(function() {
					aGame.EndShown()
				});				
			},500);
		});
	}
	return false;
}
