(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(12,12);
	
	var confine = {};

	for(var pos=0;pos<geometry.boardSize;pos++) {
		confine[pos]=1;
	}
	Model.Game.cbDefine = function() {
		
		var $this = this;
		
		/*
		 * Movement/capture graph for the Unicorn
		 */
	function UnicornGraph(side) {
		
	    var lastCol=11;	
        var lastRow=11;

		var flags = $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE;
		var graph={};
		
		for(var pos=0;pos<geometry.boardSize;pos++) {
			if(confine && !(pos in confine)){
				graph[pos]=[];
				continue;
			}
			var directions=[];
			[[1,2],[2,1],[1,-2],[2,-1],[-1,2],[-2,1],[-1,-2],[-2,-1]].forEach(function(delta) { // loop on all 8 diagonals
				var movedir = [Math.sign(delta[0]),Math.sign(delta[1])];
				var pos1=geometry.Graph(pos,delta);
				if(pos1!=null && (!confine || (pos1 in confine))) {
					var direction=[pos1 | $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE | $this.cbConstants.FLAG_STOP];
					//directions.push($this.cbTypedArray(direction));
					var nbMax = Math.max(lastRow , lastCol) - 1;
					var away=[] // hold the sliding line
					for(var n=1;n<nbMax;n++) {
						var delta2=[movedir[0]*n,movedir[1]*n];
						var pos2=geometry.Graph(pos1,delta2);
						if(pos2!=null && (!confine || (pos2 in confine))) {
							if(n==1) // possible to slide at least 1 cell, make sure the diagonal cell is not occupied, but cannot move to this cell
								away.push(pos1 | $this.cbConstants.FLAG_STOP);
							away.push(pos2 | flags | $this.cbConstants.FLAG_STOP);
						}
					}
					if(away.length>0)
						directions.push($this.cbTypedArray(away));
				}
			});
			graph[pos]=directions;
		}

		return $this.cbMergeGraphs(geometry,
		   $this.cbShortRangeGraph(geometry,[[1,2],[2,1],[1,-2],[2,-1],[-1,2],[-2,1],[-1,-2],[-2,-1]]),
		   graph
		);
	}

	
		
		/*
		 * Movement/capture graph for the eagle
		 */
		function EagleGraph() {
			var flags = $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE;
			var graph={};
			for(var pos=0;pos<geometry.boardSize;pos++) {
				graph[pos]=[];
				[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(delta) { // loop on all 4 diagonals
					var pos1=geometry.Graph(pos,delta);
					if(pos1!=null) {
						for(var dir=0;dir<2;dir++) { // dir=0 for row, dir=1 for column
							var away=[] // hold the sliding line
							for(var n=1;n<11;n++) { // board is 12 cells long, so only consider max 11 cell displacements
								var delta2=[];
								delta2[dir]=delta[dir]*n;
								delta2[1-dir]=0; // delta2 is now only about moving orthogonally, away from the piece
								var pos2=geometry.Graph(pos1,delta2);
								if(pos2!=null) {
									if(n==1) // possible to slide at least 1 cell, make sure the diagonal cell is not occupied, but cannot move to this cell
										away.push(pos1 | $this.cbConstants.FLAG_STOP);
									away.push(pos2 | flags);
								}
							}
							if(away.length>0)
								graph[pos].push($this.cbTypedArray(away));
						}
					}					
				});
			}
			return $this.cbMergeGraphs(geometry,
			   $this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1]]),
			   graph
			);
		}
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: false,
				},
				
				1: {
					name: 'ipawn-w',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:36},{s:1,p:37},{s:1,p:38},{s:1,p:39},{s:1,p:40},{s:1,p:41},{s:1,p:42},{s:1,p:43},{s:1,p:44},{s:1,p:45},{s:1,p:46},{s:1,p:47}],
					epTarget: true,
					epCatch: false,
				},
				
				2: {
					name: 'pawn-b',
					aspect: 'fr-pawn',
					graph: this.cbPawnGraph(geometry,-1),
					value: 0.9,
					abbrev: '',
					fenAbbrev: 'P',
					epCatch: false,

				},

				3: {
					name: 'ipawn-b',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,-1),
					value: 0.9,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:96},{s:-1,p:97},{s:-1,p:98},{s:-1,p:99},{s:-1,p:100},{s:-1,p:101},{s:-1,p:102},{s:-1,p:103},{s:-1,p:104},{s:-1,p:105},{s:-1,p:106},{s:-1,p:107}],
					epTarget: true,
					epCatch: false,
				},
				
				4: {
	            	name: 'anqa',
	            	aspect: 'fr-griffin',
	            	graph: EagleGraph(),
	            	value: 9,
	            	abbrev: 'A',
	            	initial: [{s:1,p:5},{s:-1,p:137}],
	            },	
				5: {
					name: 'cockatrice',
					aspect: 'fr-bishop',
					graph: this.cbBishopGraph(geometry),
					value: 4,
					abbrev: 'B',
					initial: [{s:1,p:4},{s:1,p:7},{s:-1,p:136},{s:-1,p:139}],
				},

				6: {
					name: 'roque',
					aspect: 'fr-rook',
					graph: this.cbRookGraph(geometry),
					value: 5.2,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:11},{s:-1,p:132},{s:-1,p:143}],
					castle: true,
				},
				7: {
	            	name: 'leon',
	            	aspect: 'fr-lion',
	            	graph: this.cbShortRangeGraph(geometry,[
						[-1,3],[0,3],[1,3],[3,1],[3,0],[3,1],[-1,-3],[0,-3],
						[-1,-3],[-3,-1],[-3,0],[-3,1]]),
	            	value: 4.2,
	            	abbrev: 'L',
	            	initial: [{s:1,p:1},{s:1,p:10},{s:-1,p:133},{s:-1,p:142}],
	            },	
				8: {
					name: 'rey',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:6},{s:-1,p:138}],
				},
				9: {
	            	name : 'zaraffa',
	            	abbrev : 'Z',
	            	aspect : 'fr-giraffe',
	            	graph : this.cbShortRangeGraph(geometry,[[-3,-2],[-3,2],[3,-2],[3,2],[2,3],[2,-3],[-2,3],[-2,-3]]),
	            	value : 2.5,
	            	initial: [{s:1,p:3},{s:1,p:8},{s:-1,p:135},{s:-1,p:140}],
	            },
				10: {
	            	name: 'unicornio',
	            	aspect: 'fr-rhino',
	            	graph: UnicornGraph(),
	            	value: 8,
	            	abbrev: 'U',
	            	initial: [{s:1,p:2},{s:1,p:9},{s:-1,p:134},{s:-1,p:141}],
	            },			

			},
            // pawn promote to the piece occupying the square initially
			promote: function(aGame,piece,move) {
                
				if(piece.t==1 && geometry.R(move.t)==11) {
                    if(move.t==132 || move.t==143){
                        return [6];
                    }
                    else if(move.t==133 || move.t==142){
                        return [7];
                    }
                    else if(move.t==134 || move.t==141){
                        return [10];
                    }
                    else if(move.t==135 || move.t==140){
                        return [9];
                    }
                    else if(move.t==136 || move.t==139){
                        return [5];
                    }else{
                        return [4]; 
                    }
					
                }
				else if(piece.t==3 && geometry.R(move.t)==0){
                    if(move.t==0 || move.t==11){
                        return [6];
                    }
                    else if(move.t==1 || move.t==10){
                        return [7];
                    }
                    else if(move.t==2 || move.t==9){
                        return [10];
                    }
                    else if(move.t==3 || move.t==8){
                        return [9];
                    }
                    else if(move.t==4 || move.t==7){
                        return [5];
                    }else{
                        return [4]; 
                    }
					
                }
			    else
				return [];
			},

		};
	}

	/*
	 * Model.Board.GenerateMoves:
	 *   - handle setup phase 
	 *   - handle king special move: a kind of castle involving only the king
	 */
	var kingLongMoves={
		"1": {
			6: [ [4,5],[8,9],[30,18],[28,17],[32,19] ],
//6: [ [4,5],[8,9],[30,18],[28,17],[32,19],[16,5,7],[29,17,18],[31,18,19],[20,7,19] ],
		},
		"-1": {
			138: [ [1140,13],[136,137],[114,126],[116,127],[112,125] ],
//			138: [ [1140,13],[136,137],[114,126],[116,127],[112,125],[128,127,139],[115,126,127],[113,125,126],[124,125,137] ],
		},
	}
	
		var SuperModelBoardGenerateMoves=Model.Board.GenerateMoves;
	Model.Board.GenerateMoves = function(aGame) {

		SuperModelBoardGenerateMoves.apply(this,arguments); // call regular GenerateMoves method
		// now consider special 2 cases king moves
		var kPiece=this.pieces[this.board[this.kings[this.mWho]]];
console.log("this.mWho"+this.mWho);
		if(!kPiece.m && !this.check) {
console.log("kPiece"+kPiece.p);

			var lMoves=kingLongMoves[this.mWho][kPiece.p];
			for(var i=0;i<lMoves.length;i++) {
				var lMove=lMoves[i];
				if(this.board[lMove[0]]>=0)
					continue;
				var canMove=true;
				var oppInCheck=false;
				for(var j=0;j<lMove.length;j++) {
					var pos=lMove[j];
					var tmpOut=this.board[pos];
					this.board[pos]=-1; // remove possible piece to prevent problems when quick-applying/unapplying
					var undo=this.cbQuickApply(aGame,{
						f: kPiece.p,
						t: pos,
					});
					var inCheck=this.cbGetAttackers(aGame,pos,this.mWho,true).length>0;
					if(!inCheck && j==0)
						oppInCheck=this.cbGetAttackers(aGame,this.kings[-this.mWho],-this.mWho,true).length>0;
					this.cbQuickUnapply(aGame,undo);
					this.board[pos]=tmpOut;
					this.cbIntegrity(aGame);
					if(inCheck) {
						canMove=false;
						break;
					}
				}
				if(canMove)
					this.mMoves.push({
						f: kPiece.p,
						t: lMove[0],
						c: null,
						ck: oppInCheck,
						a: 'K',
					});
			}
		}
	}

	/*
	 * Model.Board.ApplyMove overriding: setup phase and king special move
	 */
	var SuperModelBoardApplyMove=Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {
		
			SuperModelBoardApplyMove.apply(this,arguments);
	}
	
})();
