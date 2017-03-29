(function() {
	
	// in case opponents don't agree
	var DEFAULT_TYPE1 = 9;
	var DEFAULT_TYPE2 = 11;
	
	// musketeer geometry, adding rows "0" and "9"
	var geometry = Model.Game.cbBoardGeometryGrid(8,10);

    // substract one row because of row "0"
    geometry.PosName = function(pos){ 
        return String.fromCharCode(("a".charCodeAt(0))+this.C(pos)) + (this.R(pos)) ;
    }
	
	var confine = {};
	// excluding rows "0" and "9" from game play
		for(var pos=0;pos<geometry.boardSize;pos++) {
		if(!(
				(pos==0)||(pos==1)||(pos==2)||(pos==3)||(pos==4)||(pos==5)||(pos==6)||(pos==7)||(pos==72)||(pos==73)||(pos==74)||(pos==75)||(pos==76)||(pos==77)||(pos==78)||(pos==79) 
			))
			confine[pos]=1;
	}
	
	Model.Game.cbDefine = function() {
		
		var classicPieces = { 
			0: {
				name: 'pawn-w',
				aspect: 'fr-pawn',
				graph: this.cbPawnGraph(geometry,1,confine),
				value: 1,
				abbrev: '',
				fenAbbrev: 'P',
				epCatch: true,
				//initial:[{s:1,p:57}] // debug stuff fro promo testing
			},
			
			1: {
				name: 'ipawn-w',
				aspect: 'fr-pawn',
				graph: this.cbInitialPawnGraph(geometry,1,confine),
				value: 1,
				abbrev: '',
				fenAbbrev: 'P',
				initial: [{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19},{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:23}],
				epTarget: true,
			},
			
			2: {
				name: 'pawn-b',
				aspect: 'fr-pawn',
				graph: this.cbPawnGraph(geometry,-1,confine),
				value: 1,
				abbrev: '',
				fenAbbrev: 'P',
				epCatch: true,
				// initial:[{s:-1,p:17}] // debug stuff fro promo testing				
			},
	
			3: {
				name: 'ipawn-b',
				aspect: 'fr-pawn',
				graph: this.cbInitialPawnGraph(geometry,-1,confine),
				value: 1,
				abbrev: '',
				fenAbbrev: 'P',
				initial: [{s:-1,p:56},{s:-1,p:57},{s:-1,p:58},{s:-1,p:59},{s:-1,p:60},{s:-1,p:61},{s:-1,p:62},{s:-1,p:63}],
				epTarget: true,
			},
			
			4: {
				name: 'knight',
				aspect: 'fr-knight',
				graph: this.cbKnightGraph(geometry,confine),
				value: 2.9,
				abbrev: 'N',
				initial: [{s:1,p:9},{s:1,p:14},{s:-1,p:65},{s:-1,p:70}],
			},
			
			5: {
				name: 'bishop',
				aspect: 'fr-bishop',
				graph: this.cbBishopGraph(geometry,confine),
				value: 3.05,
				abbrev: 'B',
				initial: [{s:1,p:10},{s:1,p:13},{s:-1,p:66},{s:-1,p:69}],
			},
	
			6: {
				name: 'rook',
				aspect: 'fr-rook',
				graph: this.cbRookGraph(geometry,confine),
				value: 4.95,
				abbrev: 'R',
				initial: [{s:1,p:8},{s:1,p:15},{s:-1,p:64},{s:-1,p:71}],
				castle: true,
			},
	
			7: {
				name: 'queen',
				aspect: 'fr-queen',
				graph: this.cbQueenGraph(geometry,confine),
				value: 9.15,
				abbrev: 'Q',
				initial: [{s:1,p:11},{s:-1,p:67}],
			},
			
			8: {
				name: 'king',
				aspect: 'fr-king',
				isKing: true,
				graph: this.cbKingGraph(geometry,confine),
				abbrev: 'K',
				initial: [{s:1,p:12},{s:-1,p:68}],
			}
		};

		// musketeer xtra pieces
		var piecesTypes = Object.assign({},classicPieces,{
			
							11: {
					name: 'leopard',
					aspect: 'fr-leopard',
					graph : this.cbMergeGraphs(geometry,
	            				this.cbXQElephantGraph(geometry,confine),
	            				this.cbShortRangeGraph(geometry,
	            					[
	            					 [-1,-1],[-1,1],[1,-1],[1,1],
	            					 [-2,-1],[-1,-2],[-2,1],[-1,2],
	            					 [1,2],[2,1],[2,-1],[1,-2]
	            					],confine)
	            			),
					value: 4.5,
					abbrev: 'Le',
					initial: [{s:1,p:24},{s:-1,p:43}],				
				},
							14: {
					name: 'fortress',
					aspect: 'fr-fortress',
					graph : this.cbMergeGraphs(geometry,
            				this.cbShortRangeGraph(geometry,[[-1,-2],[0,-2],[1,-2],[-1,2],[0,2],[1,2],[-2,0],[2,0]],confine),
            				this.cbLongRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1]],confine,null,3)
            				),
					value: 5.3,
					abbrev: 'Fo',
					initial: [{s:1,p:25},{s:-1,p:44}],				
				},
							16: {
					name: 'dragon',
					aspect: 'fr-mdd',
					graph : this.cbMergeGraphs(geometry,
            				this.cbQueenGraph(geometry,confine),
            				this.cbKnightGraph(geometry,confine)
            				),
					value: 13.5,
					abbrev: 'Dr',
					initial: [{s:1,p:26},{s:-1,p:45}],				
				},
							15: {
					name: 'spider',
					aspect: 'fr-spider',
					graph : this.cbMergeGraphs(geometry,
            				this.cbShortRangeGraph(geometry,
            						[
            						 [-1,-2],[0,-2],[1,-2],[-1,2],[0,2],[1,2],
            						 [-2,-1],[-2,0],[-2,1],[2,-1],[2,0],[2,1]
            						 ],confine),
            				this.cbLongRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1]],confine,null,2)
            				),
					value: 5.1,
					abbrev: 'Sp',
					initial: [{s:1,p:27},{s:-1,p:46}],				
				},
							13: {
					name: 'unicorn',
					aspect: 'fr-unicorn',
					graph : this.cbShortRangeGraph(geometry,
	            			[
	            			 [-1,-2],[-2,-1],[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],
	            			 [-1,-3],[-3,-1],[-3,1],[-1,3],[1,3],[3,1],[3,-1],[1,-3]
	            			 ],confine),
					value: 4.6,
					abbrev: 'U',
					initial: [{s:1,p:28},{s:-1,p:47}],				
				},
							12: {
					name: 'hawk',
					aspect: 'fr-eagle',
					graph : this.cbShortRangeGraph(geometry,
	            			[
	            			 [-2,-2],[-2,0],[-2,2],[0,2],[2,2],[2,0],[2,-2],[0,-2],
	            			 [-3,-3],[-3,0],[-3,3],[0,3],[3,3],[3,0],[3,-3],[0,-3]
	            			 ],confine),
					value: 2.3,
					abbrev: 'H',
					initial: [{s:1,p:33},{s:-1,p:51}],				
				},
							10: {
					name: 'elephant',
					aspect: 'fr-elephant',
					graph : this.cbShortRangeGraph(geometry,
							[
							 [1,1],[-1,1],[1,-1],[-1,-1],
							 [0,1],[0,-1],[1,0],[-1,0],
							 [-2,-2],[2,2],[-2,2],[2,-2],
							 [-2,0],[2,0],[0,2],[0,-2]
							],
							 confine),
					value: 4.5,
					abbrev: 'E',
					initial: [{s:1,p:34},{s:-1,p:52}],				
				},
							17: {
					name: 'chancellor',
					aspect: 'fr-marshall',
					graph : this.cbMergeGraphs(geometry,
            				this.cbRookGraph(geometry,confine),
            				this.cbKnightGraph(geometry,confine)
            				),
					value: 8.5,
					abbrev: 'Ch',
					initial: [{s:1,p:35},{s:-1,p:53}],				
				},
							18: {
					name: 'archbishop',
					aspect: 'fr-cardinal',
					graph : this.cbMergeGraphs(geometry,
            				this.cbBishopGraph(geometry,confine),
            				this.cbKnightGraph(geometry,confine)
            				),
					value: 6.4,
					abbrev: 'Ar',
					initial: [{s:1,p:36},{s:-1,p:54}],				
				},
							9: {
					name: 'cannon',
					aspect: 'fr-cannon',
					graph : this.cbShortRangeGraph(geometry,
							[
							 [1,1],[-1,1],[1,-1],[-1,-1],
							 [0,1],[0,-1],[1,0],[-1,0],
							 [-2,1],[-2,0],[-2,-1],[2,1],[2,0],[2,-1],
							 [0,2],[0,-2]
							 ],
							 confine),
					value: 4.6,
					abbrev: 'Ca',
					initial: [{s:1,p:32},{s:-1,p:55}],				
				},
						
        
		});
		
		return {
			
			geometry: geometry,
			
			pieceTypes: piecesTypes,

			// adding selected musketeer pieces to promotion choice
			promote: function(aGame,piece,move) {
				if(piece.t==1)
					return [0];
				else if(piece.t==3)
					return [2];
				else if(piece.t==0 && geometry.R(move.t)==8)
					return [4,5,6,7,this.type1,this.type2];
				else if(piece.t==2 && geometry.R(move.t)==1)
					return [4,5,6,7,this.type1,this.type2];
				return [];
			},

			// updating castle positions
			castle: {
				"12/8": {k:[11,10],r:[9,10,11],n:"O-O-O"},
				"12/15": {k:[13,14],r:[14,13],n:"O-O"},
				"68/64": {k:[67,66],r:[65,66,67],n:"O-O-O"},
				"68/71": {k:[69,70],r:[70,69],n:"O-O"},
			},
			
			evaluate: function(aGame,evalValues,material) {
				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				if(!white[0] && !white[1] && !white[4] && !white[5] && !white[6] && !white[7]) { // white king single
					if(!black[2] && !black[3] && !black[6] && !black[7] && (black[4]+black[5]<2 || black[5]<2)) {
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				if(!black[2] && !black[3] && !black[4] && !black[5] && !black[6] && !black[7]) { // black king single
					if(!white[0] && !white[1] && !white[6] && !white[7] && (white[4]+white[5]<2 || white[5]<2)) {
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				
				// check 50 moves without capture
				if(this.noCaptCount>=100) {
					this.mFinished=true;
					this.mWinner=JocGame.DRAW;					
				}
				
				// motivate pawns to reach the promotion line
				var distPromo=new Int8Array(3);
				var height=geometry.height;
				var pawns=material[1].byType[0],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(height-geometry.R(pawns[i].p)) {
						case 2: distPromo[0]++; break;
						case 3: distPromo[1]++; break;
						case 4: distPromo[2]++; break;
						}
				}
				pawns=material[-1].byType[2],pawnsLength;
				if(pawns) {
					pawnsLength=pawns.length;
					for(var i=0;i<pawnsLength;i++)
						switch(geometry.R(pawns[i].p)) {
						case 1: distPromo[0]--; break;
						case 2: distPromo[1]--; break;
						case 3: distPromo[2]--; break;
						}
				}
				if(distPromo[0]!=0)
					evalValues['distPawnPromo1']=distPromo[0];
				if(distPromo[1]!=0)
					evalValues['distPawnPromo2']=distPromo[1];
				if(distPromo[2]!=0)
					evalValues['distPawnPromo3']=distPromo[2];
				
				// motivate knights and bishops to deploy early
				var minorPiecesMoved=0;
				for(var t=4;t<=5;t++)
					for(var s=1;s>=-1;s-=2) {
						var pieces=material[s].byType[t];
						if(pieces)
							for(var i=0;i<pieces.length;i++)
								if(pieces[i].m)
									minorPiecesMoved+=s;
					}
				if(minorPiecesMoved!=0) {
					evalValues['minorPiecesMoved']=minorPiecesMoved;
				}
			},
			
		};
	}

	
	/*
	 * Model.Board.GenerateMoves:
	 *   - handle setup phase : this.setupState
	 *   	. undefined : 1st white choice
	 *   	. setup1_0 : black choice (2nd piece or white choice cancel)
	 *   	. setup2_0 : white chooses 1st xtra piece placement
	 *   	. setup2_1 : black chooses 1st xtra piece placement
	 *   	. setup2_2 : white chooses 2nd xtra piece placement
	 *   	. setup2_3 : black chooses 2nd xtra piece placement
	 */
		
	var wStartPositions = [24,25,26,27,28,33,34,35,36,32]; // where available white extra pieces have been dropped on the starting board
	var bStartPositions = [43,44,45,46,47,51,52,53,54,55]; // where available black extra pieces have been dropped on the starting board
	var startupRowW = [0,1,2,3,4,5,6,7];
	var startupRowB = [72,73,74,75,76,77,78,79];
	var xtraPiece1StartPosW = 31;
	var xtraPiece2StartPosW = 39;
	var xtraPiece1StartPosB = 40;
	var xtraPiece2StartPosB = 48;
	
	var SuperModelBoardGenerateMoves=Model.Board.GenerateMoves;
	Model.Board.GenerateMoves = function(aGame) {
		var $this = this;  
		if (this.setupState===undefined) { // first time, white chooses first piece			

			this.mMoves=[{}];
			wStartPositions.forEach(function(pos){
				if ($this.board[pos]>=0){
					var piece = $this.pieces[$this.board[pos]] ;
					$this.mMoves.push({f:pos,t:xtraPiece1StartPosW});
				}
			});
			
			return;
		}
		if (this.setupState==="setup1_0"){// second time, black chooses same piece, or refuses
			this.mMoves=[{}];			
			// choose a 2nd piece 
            var emptyPos = -1;
			bStartPositions.forEach(function(pos){
				if ($this.board[pos]>=0){
                    $this.mMoves.push({f:pos,t:xtraPiece2StartPosB});
				}else{
                    emptyPos=pos;
                }
			});
            // or take first back to refuse
            var pIdx = this.board[xtraPiece1StartPosB]; 
            this.mMoves.push({f:xtraPiece1StartPosB,t:emptyPos});
						
			return;
		}	
		if (this.setupState==="setup2_0"){// white chooses first xtra piece startup place 
			this.mMoves=[{}];
			startupRowW.forEach(function(pos){
				$this.mMoves.push({f:xtraPiece1StartPosW,t:pos});
			});			
			return;
		}
		if (this.setupState==="setup2_1"){// black chooses first xtra piece startup place 
			this.mMoves=[{}];
			startupRowB.forEach(function(pos){
				$this.mMoves.push({f:xtraPiece1StartPosB,t:pos});
			});			
			return;
		}
		if (this.setupState==="setup2_2"){// white chooses 2nd xtra piece startup place 
			this.mMoves=[{}];
			// first check if previous piece is behind the King or a rook
			var prevPiece = -1 ;
			var idx=startupRowW[0];
			while (prevPiece < 0){
				if ($this.board[idx]>=0){
					prevPiece = $this.board[idx+8];
				}
				idx++;
			}
			var rk = this.pieces[prevPiece];
			var pt1 = aGame.g.pTypes[rk.t].abbrev ;					
			startupRowW.forEach(function(pos){
				if ($this.board[pos]==-1){
					var pt2 = aGame.g.pTypes[$this.pieces[$this.board[pos+8]].t].abbrev ;
					if ( ((pt1 == "K") && (pt2 == "R")) || ((pt1 == "R") && (pt2 == "K")) ){
						// can't place behind king and rook
					}else
						$this.mMoves.push({f:xtraPiece2StartPosW,t:pos});					
				}
			});			
			return;
		}
		if (this.setupState==="setup2_3"){// black chooses 2nd xtra piece startup place 
			this.mMoves=[{}];
			// first check if previous piece is behind the King or a rook
			var prevPiece = -1 ;
			var idx=startupRowB[0];
			while (prevPiece < 0){
				if ($this.board[idx]>=0){
					prevPiece = $this.board[idx-8];
				}
				idx++;
			}
			var rk = this.pieces[prevPiece];
			var pt1 = aGame.g.pTypes[rk.t].abbrev ;					
			startupRowB.forEach(function(pos){
				if ($this.board[pos]==-1){
					var pt2 = aGame.g.pTypes[$this.pieces[$this.board[pos-8]].t].abbrev ;
					if ( ((pt1 == "K") && (pt2 == "R")) || ((pt1 == "R") && (pt2 == "K")) ){
						// can't place behind king and rook
					}else
						$this.mMoves.push({f:xtraPiece2StartPosB,t:pos});					
				}
			});			
			return;
		}
		SuperModelBoardGenerateMoves.apply(this,arguments); // call regular GenerateMoves method
	}
	
	/*
	 * Model.Board.CopyFrom overriding to copy setupState property
	 */
	var SuperModelBoardCopyFrom = Model.Board.CopyFrom;
	Model.Board.CopyFrom = function(aBoard) {
		SuperModelBoardCopyFrom.apply(this,arguments);
		this.setupState = aBoard.setupState;
		this.type1 = aBoard.type1 ;
		this.type2 = aBoard.type2 ;
		this.bFirstDiplay = aBoard.bFirstDiplay ;
		this.bXtraPiecesRemoved = aBoard.bXtraPiecesRemoved ;
	}
	
	/*
	 * Model.Board.Evaluate overriding: in setup phase, no evaluation 
	 */
	var SuperModelBoardEvaluate = Model.Board.Evaluate;
	Model.Board.Evaluate = function(aGame) {
		if(this.setupState===undefined || this.setupState!="done")
			return;
		SuperModelBoardEvaluate.apply(this,arguments);
	}
	
	
	Model.Board.CheckXtraPiecesEntrance = function(aGame,pos){
		// check if xtra pieces have to enter the game
		if ((pos > 7) && (pos < 16)){				
			if (this.board[pos-8]>=0){
				this.board[pos]=this.board[pos-8];
				this.board[pos-8]=-1;
				this.pieces[this.board[pos]].p = pos ; 
				this.zSign=aGame.zobrist.update(this.zSign,"board",this.board[pos],pos);
			}
		}
		if ((pos > 63) && (pos < 72)){				
			if (this.board[pos+8]>=0){
				this.board[pos]=this.board[pos+8];
				this.board[pos+8]=-1;
				this.pieces[this.board[pos]].p = pos ; 
				this.zSign=aGame.zobrist.update(this.zSign,"board",this.board[pos],pos);
			}
		}
	}	

	/*
	 * Model.Board.ApplyMove overriding: setup phase and king special move
	 */
	var SuperModelBoardApplyMove=Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {
		var $this = this;
		if(this.setupState===undefined){
			SuperModelBoardApplyMove.apply(this,arguments);
            // select same piece for black
            bStartPositions.forEach(function(pos) {
                if($this.board[pos]>=0){
                    if($this.pieces[$this.board[xtraPiece1StartPosW]].t == $this.pieces[$this.board[pos]].t){
                        var pIndex=$this.board[pos];
                        $this.board[pos]=-1;
                        $this.board[xtraPiece1StartPosB]=pIndex;
                        $this.pieces[pIndex].p=xtraPiece1StartPosB;
                    }
                }
            });
			this.setupState="setup1_0";
		}
		else if(this.setupState=="setup1_0") {
			SuperModelBoardApplyMove.apply(this,arguments);
			// default values if players do not agree
			this.type1 = DEFAULT_TYPE1 ; 
			this.type2 = DEFAULT_TYPE2 ; 
			if(move.t==xtraPiece2StartPosB){
				// selection agreed
				// get xtra pieces types
				this.type1 = this.pieces[this.board[xtraPiece1StartPosW]].t;
				this.type2 = this.pieces[this.board[xtraPiece2StartPosB]].t;
			}else{
				// selection refused
			}
			// remove unused pieces from board
			if ($this.bXtraPiecesRemoved===undefined){
                var positionsToBeScaned = wStartPositions.concat(bStartPositions).concat([xtraPiece1StartPosW,xtraPiece2StartPosW,xtraPiece1StartPosB,xtraPiece2StartPosB]);
				positionsToBeScaned.forEach(function(pos) {
					if($this.board[pos]>=0){
						var pIndex=$this.board[pos];
						if (pIndex>=0){								
							$this.board[pos]=-1;
							$this.pieces[pIndex].p=-1;
							$this.zSign=aGame.zobrist.update($this.zSign,"board",pIndex,pos);												
						}
					}
				});
				$this.bXtraPiecesRemoved = true;
			}								
			// setup 2 xtras pieces for W and B
			for (var idx in this.pieces){
				var myPiece = this.pieces[idx];
				if ((myPiece.t==this.type1) || (myPiece.t==this.type2)){
					console.log("select piece",myPiece);
					if ((myPiece.t==this.type1) && (myPiece.s==1)) {
						myPiece.p = xtraPiece1StartPosW ;
						this.board[xtraPiece1StartPosW] = myPiece.i;
					}
					if ((myPiece.t==this.type2) && (myPiece.s==1)) {
						myPiece.p = xtraPiece2StartPosW ;
						this.board[xtraPiece2StartPosW] = myPiece.i;
					}
					if ((myPiece.t==this.type1) && (myPiece.s==-1)) {
						myPiece.p = xtraPiece1StartPosB ;
						this.board[xtraPiece1StartPosB] = myPiece.i;
					}
					if ((myPiece.t==this.type2) && (myPiece.s==-1)) {
						myPiece.p = xtraPiece2StartPosB ;
						this.board[xtraPiece2StartPosB] = myPiece.i;
					}
				}
			}
			this.setupState="setup2_0"; // choose start positions for xtra pieces 
            
		}
		else if(this.setupState=="setup2_0") {
			SuperModelBoardApplyMove.apply(this,arguments);
			this.setupState="setup2_1"; // choose start positions for xtra pieces 
		}
		else if(this.setupState=="setup2_1") {
			SuperModelBoardApplyMove.apply(this,arguments);
			this.setupState="setup2_2"; // choose start positions for xtra pieces 
		}
		else if(this.setupState=="setup2_2") {
			SuperModelBoardApplyMove.apply(this,arguments);
			this.setupState="setup2_3"; // choose start positions for xtra pieces 
		}
		else if(this.setupState=="setup2_3") {
			SuperModelBoardApplyMove.apply(this,arguments);
			this.setupState="done"; // choose start positions for xtra pieces 
		}
		else{			
			SuperModelBoardApplyMove.apply(this,arguments);
			// check capture => capture xtra piece at the same time if there is one
			if(move.c){
				var pos = move.t;
				if ((pos > 7) && (pos < 16)){
					if (this.board[pos-8]>=0){
						var pIndex = this.pieces[this.board[pos-8]].i;
						this.pieces[this.board[pos-8]].p = -1 ;
						this.board[pos-8]=-1;
						$this.zSign=aGame.zobrist.update($this.zSign,"board",pIndex,pos-8);
					}					
				}
				if ((pos > 63) && (pos < 72)){
					if (this.board[pos+8]>=0){
						var pIndex = this.pieces[this.board[pos+8]].i;
						this.pieces[this.board[pos+8]].p = -1 ;
						this.board[pos+8]=-1;
						$this.zSign=aGame.zobrist.update($this.zSign,"board",pIndex,pos+8);
					}					
				}
			}			
			this.CheckXtraPiecesEntrance(aGame,move.f);
            if (move.cg){
                this.CheckXtraPiecesEntrance(aGame,move.cg);
            }
		}
	}
	/*
	 * 
	 * Model.Move.ToString overriding for setup notation
	 */
	var SuperModelMoveToString = Model.Move.ToString;
	Model.Move.ToString = function() {
		if(this.f===undefined) {
			if(this.setup===undefined)
				return "--";
			else
				return "#"+this.setup;
		}
		return SuperModelMoveToString.apply(this,arguments);
	}
	var SuperApplyCastle = Model.Board.cbApplyCastle;
	Model.Board.cbApplyCastle = function(aGame,move,updateSign) {
		return SuperApplyCastle.apply(this,arguments);
	}
	/*
	 * 
	 * Model.Board.CompactMoveString overriding to help reading PJN game transcripts
	 */
	var SuperModelBoardCompactMoveString = Model.Board.CompactMoveString; 
	Model.Board.CompactMoveString = function(aGame,aMove,allMoves) {
		if(typeof aMove.ToString!="function") // ensure proper move object, if necessary
			aMove=aGame.CreateMove(aMove);
		if (this.setupState===undefined)
            {                
                var p = this.pieces[this.board[aMove.f]];
                return "W1="+aGame.g.pTypes[p.t].abbrev;    
            }
		if (this.setupState=="setup1_0")
            {                
                var p = this.pieces[this.board[aMove.f]];
                return "B2="+aGame.g.pTypes[p.t].abbrev;    
            }
		if (this.setupState!="done")
            {                
                var p = this.pieces[this.board[aMove.f]];
                return aGame.g.pTypes[p.t].abbrev+"^"+geometry.PosName(aMove.t);   
            }
            
        if (this.setupState!="done")
			return aMove.ToString();
		return SuperModelBoardCompactMoveString.apply(this,arguments);
	}

	/*
	 * Model.Board.StaticGenerateMoves overriding to prevent using AI during the setup phase
	 */

	Model.Board.StaticGenerateMoves = function(aGame) {
		var $this = this ;
		
		function isItOkRegardingKingRookException(pos,bWhite){			
			// first check if previous piece is behind the King or a rook
			var prevPiece = -1 ;
			var row=bWhite?startupRowW:startupRowB;
			var idx=row[0];
			while (prevPiece < 0){
				if ($this.board[idx]>=0){
					prevPiece = bWhite?$this.board[idx+8]:$this.board[idx-8];
				}
				idx++;
			}
			var rk = $this.pieces[prevPiece];
			var pt1 = aGame.g.pTypes[rk.t].abbrev ;					

			var pt2 = aGame.g.pTypes[$this.pieces[bWhite?$this.board[pos+8]:$this.board[pos-8]].t].abbrev ;
			if ( ((pt1 == "K") && (pt2 == "R")) || ((pt1 == "R") && (pt2 == "K")) ){
				// can't place behind king and rook
				return false;
			}else
				return true;					
		}

		
		function getAnAvailablePiecePos(positions,bFree){
			function random() {
				var d = new Date();
				var seed = d.getTime(); 
			    var x = Math.sin(seed++) * 10000;
			    return x - Math.floor(x);
			}
			var pos = -1 ;
			while (pos < 0){
				var r = Math.floor(random()*positions.length);
				if (	((!bFree) && ($this.board[positions[r]]>=0)) || 
						((bFree) && ($this.board[positions[r]]<0)) )
					pos = positions[r] ;
			}
			return pos;
		}
		if(this.setupState===undefined){
			var f=getAnAvailablePiecePos(wStartPositions,false);
			return [aGame.CreateMove(aGame.CreateMove({f:f,t:xtraPiece1StartPosW}))];
		}
		if(this.setupState=="setup1_0"){
			// accept white choice
            var f=getAnAvailablePiecePos(bStartPositions,false);
			return [aGame.CreateMove(aGame.CreateMove({f:f,t:xtraPiece2StartPosB}))];
		}
		if(this.setupState=="setup2_0"){
			var t=getAnAvailablePiecePos(startupRowW,true);
			return [aGame.CreateMove(aGame.CreateMove({f:xtraPiece1StartPosW,t:t}))];
		}
		if(this.setupState=="setup2_1"){
			var t=getAnAvailablePiecePos(startupRowB,true);
			return [aGame.CreateMove(aGame.CreateMove({f:xtraPiece1StartPosB,t:t}))];
		}
		if(this.setupState=="setup2_2"){
			var t=getAnAvailablePiecePos(startupRowW,true);
			while(!isItOkRegardingKingRookException(t,true)){
				t=getAnAvailablePiecePos(startupRowW,true);
			}
			return [aGame.CreateMove(aGame.CreateMove({f:xtraPiece2StartPosW,t:t}))];
		}
		if(this.setupState=="setup2_3"){
			var t=getAnAvailablePiecePos(startupRowB,true);
			while(!isItOkRegardingKingRookException(t,false)){
				t=getAnAvailablePiecePos(startupRowB,true);
			}			
			return [aGame.CreateMove(aGame.CreateMove({f:xtraPiece2StartPosB,t:t}))];
		}
		return null;
	}		
	
})();
