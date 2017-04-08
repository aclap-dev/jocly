(function() {

	View.Board.xdInput = function(xdv, aGame) {
		return {
			initial: {
				pos: [],
			},
			getActions: function(moves,currentInput) {
				//console.log("getActions",currentInput,moves);
				var actions={};
				var actionIndex=currentInput.pos.length;
				var mixedFinal=0;
				var moves0=[];
				moves.forEach(function(move) {
					var matching=true;
					currentInput.pos.forEach(function(pos,index) {
						if(move.pos[index]!=pos)
							matching=false;
					});
					if(!matching)
						return;
					moves0.push(move);
					if(currentInput.pos.length==move.pos.length)
						mixedFinal|=1;
					else
						mixedFinal|=2;
				});				
				moves0.forEach(function(move) {
					if(mixedFinal!=3 && currentInput.pos.length>=move.pos.length)
						return;
					var pos1, pos0=move.pos[0],isFinal=false;
					if(currentInput.pos.length==move.pos.length) {
						pos1=move.pos[Math.max(0,currentInput.pos.length-1)];
						isFinal=true;
					} else
						pos1=move.pos[currentInput.pos.length];
					var action=actions[pos1];
					if(action===undefined) {
						var pieceIndex1=null;
						if(mixedFinal!=3 || isFinal)
							pieceIndex1=this.board[move.pos[0]];
						var widgets=["cell#"+pos1];
						if(pieceIndex1!=null)
							widgets.push("piece#"+pieceIndex1);
						(function(pos0,pos1,widgets,actionIndex,isFinal) {
							action=actions[pos1]={
								moves: [],
								view: ["cell#"+pos1,"cell#"+pos0],
								click: widgets,
								highlight: function(mode) {
									if(mode=='cancel')
										xdv.updateGadget("cell#"+pos0,{
											base: {
												visible: true,
											},
											"2d": {
												classes: "xd-cancel",
												opacity: aGame.mShowMoves || .5,
											},
											"3d": {
												materials: { 
													"ring" : {
														color : 0xff4400,
														opacity: aGame.mShowMoves || 1,
														transparent: aGame.mShowMoves || false,
													}
												},	
												castShadow: aGame.mShowMoves || true,
											},
										});
									else 
										xdv.updateGadget("cell#"+pos1,{
											"2d": {
												classes: "xd-choice-view",
												opacity: aGame.mShowMoves || 0,
											},
											"3d": {
												materials: { 
													"ring" : {
														color : 0xffffff,
														opacity: aGame.mShowMoves || 0,
														transparent: aGame.mShowMoves || true,
													}
												},	
												castShadow: aGame.mShowMoves || false,
											},
										});
									
								},
								unhighlight: function(mode) {
									//console.info("unhighlight",arguments)
									if(mode=="cancel")
										xdv.updateGadget("cell#"+pos0,{
											base: {
												visible: false,
											},
										});
									else
										xdv.updateGadget("cell#"+pos1,{
											base: {
												visible: false,
											},
										});
								},
								validate: {
									pos: currentInput.pos.concat([pos1]),
								},
								execute: function(callback) {
									if(actionIndex==0) {
										callback();
										return;
									}
									if(isFinal) {
										callback();
										return;
									}
									var captPiece=move.capt[actionIndex]!=null?this.board[move.capt[actionIndex]]:null;
									this.checkersAnimateMove(xdv,aGame,
											this.board[currentInput.pos[0]],
											move.pos[actionIndex],
											captPiece,function() {
										callback();
									});
									if(captPiece!=null)
										xdv.updateGadget("piece#"+captPiece,{
											"2d": {
												opacity : .5,
											},
											"3d" : {
												materials: { 
													"ball" : {
														opacity: .5,
														transparent: true,
													}, 
													"base" : {
														opacity: .5,
														transparent: true,
													}, 
													"queen" : {
														opacity: .5,
														transparent: true,
													}
												},
											},
										});
								},
								unexecute: function() {
									var pieceIndex=this.board[move.pos[0]];
									var coord=aGame.getCCoord(move.pos[Math.max(0,actionIndex-1)]);
									xdv.updateGadget("piece#"+pieceIndex,{
										base: {
											x: coord[0],
											y: coord[1],
										},
									});								
									var captPiece=move.capt[actionIndex]!=null?this.board[move.capt[actionIndex]]:null;
									if(captPiece!=null)
										xdv.updateGadget("piece#"+captPiece,{
											"2d": {
												opacity : 1,
											},
											"3d" : {
												materials: { 
													"ball" : {
														opacity: 1,
													}, 
													"base" : {
														opacity: 1,
													}, 
													"queen" : {
														opacity: 1,
													}
												},
											},
										});
								},
							};
							if(actionIndex>0) {
								action.cancel=["cell#"+pos0];
								action.noAutoCancel=true;
							}
						})(pos0,pos1,widgets,actionIndex,isFinal);
					}
					action.moves.push(move);
				},this);
				//console.log("return actions",actions);
				return actions;
			},
		}
	}

	
})();
