/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {

	function ButtonSize(miniFEN) {
		var t=miniFEN.split('/');
		return {w:t[0].length, h:t.length, s:t.length*t[0].length};
	}

	function ImageOffset(aGame,id) {
		var types=aGame.cbVar.pieceTypes;
		for(var t in types) {
			var abbrev = types[t].abbrev || types[t].fenAbbrev;
			if(abbrev==id) return aGame.cbView.pieces[types[t].aspect]['2d'].clipx;
		}
	}
	
	/*
	 * View.Game.xdInit overriding to create initial setup gadgets 
	 */
	var SuperViewGameXdInit = View.Game.xdInit;
	View.Game.xdInit = function(xdv) {
		var $this=this;
		SuperViewGameXdInit.apply(this,arguments);
		var dialogs=this.cbVar.prelude;
		for(var i=0; i<dialogs.length; i++) if(dialogs[i]) CreateDialog($this,xdv,i,dialogs[i]);
	}

	function CreateDialog(aGame,xdv,n,dialog) {
		var size=600;
		var setups=dialog.setups;
		if(!setups) return; // should not happen
		var buttonDim=ButtonSize(setups[0]);  // assume all buttons equally large
		var bg=dialog.panelBackground;
		var width = dialog.panelWidth || Math.ceil(Math.sqrt((buttonDim.h+1)*setups.length/(buttonDim.w+1)));
		var w=size*width*(buttonDim.w+1);
		var h=size*Math.ceil(setups.length/width)*(buttonDim.h+1);
		var panelDef={ // selection panel
			base: {
				type: (bg ? "image" : "element"),
				x: 0,
				y: 0,
				width: w,
				height: h,
				z: 108,
			},
		};
		if(bg) {
			panelDef.base.file = aGame.g.fullPath+bg;
		} else panelDef.base.css={"background-color": "White"};
		xdv.createGadget("setup"+n+"-board",panelDef);
		for(var setup in setups) {
			(function(setup) {
				var w=width, h=Math.ceil(setups.length/w);
				var x=((setup%w)-(w-1)/2)*(buttonDim.w+1)*size; // setups layed out in 4x3 pattern of blocks of 3x3 icons
				var y=(Math.floor(setup/w)-h/2+0.5)*(buttonDim.h+1)*size;
				xdv.createGadget("setup"+n+"#"+setup,{	// this creates a clickable block of icons
					base: {
						type: "canvas",
						x: x,
						y: y,
						width: buttonDim.w*size,
						height: buttonDim.h*size,
						z: 109,
						draw: function(ctx) {
							ctx.fillStyle="#c0c0c0";
							ctx.rect(-size*buttonDim.w/2,-size*buttonDim.h/2,size*buttonDim.w,size*buttonDim.h);
							ctx.fill();
							ctx.save();
							this.getResource("image|"+aGame.g.fullPath+"/res/fairy/wikipedia-fairy-sprites.png",function(image) {
								for(var i=0;i<buttonDim.s;i++) { // layout icons for this setup as 2x2 block
									var x=i%buttonDim.w, y=Math.floor(i/buttonDim.w), p=setups[setup].charAt(i+y);
									if(p!=' ') ctx.drawImage(image,ImageOffset(aGame,p),0,100,100,
											(x-buttonDim.w/2)*size,(y-buttonDim.h/2)*size,size,size);
								}
								ctx.restore();
							});
						}
					},
				});				
			})(setup);
		}
	}

	/*
	 * View.Board.xdInput overriding to handle setup phase
	 */
	var SuperViewBoardxdInput = View.Board.xdInput;
	View.Board.xdInput = function(xdv, aGame) {
		if(this.lastMove.f==-2) { // in prelude
			var stage=this.lastMove.t;
			var dialog=aGame.cbVar.prelude[stage];
			if(!dialog || dialog.persistent && dialog.persistent!==true)
				return {
					initial: {},
					getActions: function(moves,currentInput) { return null; },
				}
			return {
				initial: {
					setupDone: false,
				},
				getActions: function(moves,currentInput) { 
					var actions={};
					if(!currentInput.setupDone) {
						moves.forEach(function(move) {
							actions[move.setup]={
								view: ["setup"+stage+"#"+move.setup],
								click: ["setup"+stage+"#"+move.setup],
								moves: [move],
								validate: { setupDone: true },
							}
						});
					}
					return actions;
				},
				furnitures: ["setup"+stage+"-board"],
			}
		} else
			return SuperViewBoardxdInput.apply(this,arguments);
	}
	
	/*
	 * View.Board.cbAnimate overriding to prevent animation on setup
	 */
	var SuperViewBoardcbAnimate = View.Board.cbAnimate;
	View.Board.cbAnimate = function(xdv,aGame,aMove,callback) {
		if(this.lastMove.f===-2)
			callback();
		else
			SuperViewBoardcbAnimate.apply(this,arguments);
	}
	
})();

