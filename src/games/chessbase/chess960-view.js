
(function() {
	
	View.Game.cbDefineView = function() {
		
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic2DNoMargin),
				"3d": this.cbGridBoard.coordsFn.call(this,this.cbGridBoardClassic3DMargin),
			},
			boardLayout: [
	      		".#.#.#.#",
	     		"#.#.#.#.",
	     		".#.#.#.#",
	     		"#.#.#.#.",
	     		".#.#.#.#",
	     		"#.#.#.#.",
	     		".#.#.#.#",
	     		"#.#.#.#.",				
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(this.cbGridBoardClassic2DNoMargin),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(this.cbGridBoardClassic3DMargin),					
				},
			},
			clicker: {
				"2d": {
					width: 1400,
					height: 1400,
				},
				"3d": {
					scale: [.9,.9,.9],
				},
			},
			pieces: this.cbStauntonPieceStyle({
				"default": {
					"2d": {
						width: 1300,
						height: 1300,						
					},
					"3d": {
						scale: [.6,.6,.6],
					},
				},
			}),
		};
	}

	/*
	var SuperViewBoardXdBuildHTStateMachine = View.Board.xdBuildHTStateMachine;
	View.Board.xdBuildHTStateMachine = function(xdv, htsm, aGame) {
		if(this.setupState===undefined) {
			aGame.MakeMove({});
		} else if(this.setupState=="setup") {
			aGame.MakeMove({setup:Math.floor(Math.random()*960)});
		} else
			SuperViewBoardXdBuildHTStateMachine.apply(this,arguments);
	}
	*/
	
	var SuperViewBoardxdInput = View.Board.xdInput;
	View.Board.xdInput = function(xdv, aGame) {
		if(this.setupState===undefined) {
			return {
				initial: {},
				getActions: function(moves,currentInput) { return null; },
			}
		} else if(this.setupState=="setup") {
			return {
				initial: {
					setupDone: false,
				},
				getActions: function(moves,currentInput) { 
					var actions={};
					if(!currentInput.setupDone) {
						var move=moves[Math.floor(Math.random()*moves.length)];
						actions[move.setup]={
							moves: [move],
							skipable: true,
							validate: { setupDone: true },
							execute: function(callback) {
								this.cbAnimate(xdv,aGame,move,callback);
							},
						}
					}
					return actions;
				},
				allowForced: true,
			}
		} else
			return SuperViewBoardxdInput.apply(this,arguments);
	}


	/*
	var SuperViewBoardxdDisplay = View.Board.xdDisplay;
	View.Board.xdDisplay = function(xdv, aGame) {
		if(this.setupState===undefined) {
			var $this=this;
			this.pieces.forEach(function(piece,pIndex) {
				xdv.updateGadget("piece#"+piece.i,{
					base: {
						visible: false,
					}
				});
				xdv.updateGadget("piece#"+piece.i,{
					base: {
						visible: true,
					}
				});
			});
		} else
			SuperViewBoardxdDisplay.apply(this,arguments);
	}
	*/

	var SuperViewBoardCbAnimate = View.Board.cbAnimate;
	View.Board.cbAnimate = function(xdv,aGame,aMove,callback) {
		if(this.setupState===undefined)
			callback();
		else if(this.setupState=="setup")
			this.c960AnimateSetup.apply(this,arguments);
		else
			SuperViewBoardCbAnimate.apply(this,arguments);
	}

	View.Board.c960AnimateSetup = function(xdv,aGame,aMove,callback) {
		var $this=this;
		var cols=aGame.c960Gen(aMove.setup);
		var animCount=1;
		function Done() {
			if(--animCount==0)
				callback();
		};
		["1","-1"].forEach(function(side) {
			var colPoss={};
			cols.forEach(function(type,col) {
				if(colPoss[type]===undefined)
					colPoss[type]=[];
				colPoss[type].push(col);
			});
			$this.pieces.forEach(function(piece,pIndex) {
				if(piece.s==side) {
					if(piece.t>=4) {
						var type=aGame.g.pTypes[piece.t].abbrev;
						var toPos=colPoss[type].shift();
						if(side=="-1")
							toPos+=56;
						if(toPos!=piece.p) {
							var displaySpec=aGame.cbMakeDisplaySpecForPiece(aGame,toPos,piece);
							animCount++;
							xdv.updateGadget("piece#"+piece.i,displaySpec,2000,function() {
								Done();
							});
	
						}
					}
				}
			});			
		});
		Done();
	}

})();
