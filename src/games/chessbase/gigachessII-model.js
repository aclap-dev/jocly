/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API.
 *
 * Original authors: Jocly team
 *
 */
(function() {

	var firstRow=0;
	var lastRow=13;
	var firstCol=0;
	var lastCol=13;

	var geometry = Model.Game.cbBoardGeometryGrid(14,14);
	Model.Game.cbEagleGraph = function(geometry){
		var $this=this;

		var flags = $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE;
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			graph[pos]=[];
			[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(delta) { // loop on all 4 diagonals
				var pos1=geometry.Graph(pos,delta);
				if(pos1!=null) {
					for(var dir=0;dir<2;dir++) { // dir=0 for row, dir=1 for column
						var nbMax = (dir==0) ? lastRow : lastCol;
						var away=[] // hold the sliding line
						for(var n=1;n<nbMax;n++) {
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

	Model.Game.cbRhinoGraph = function(geometry,confine){
		var $this=this;

		var flags = $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE;
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {

			
			var directions=[];
			[[0,1],[1,0],[-1,0],[0,-1],[1,2],[2,1],[1,-2],[2,-1],[-1,2],[-2,1],[-1,-2],[-2,-1]].forEach(function(delta) { // loop on all 8 diagonals
				var movedir = [Math.sign(delta[0]),Math.sign(delta[1])];
                
				var pos1=geometry.Graph(pos,delta);

                    if(movedir[0]==0){
                     xleft=-1;
                     xright=1;
                    }else{
                     xleft=movedir[0];
                     xright=movedir[0];
                    }
                    if(movedir[1]==0){
                     yleft=-1;
                     yright=1;
                    }else{
                     yleft=movedir[1];
                     yright=movedir[1];
                    }

				if(pos1!=null /*&& (!confine || (pos1 in confine))*/) {
					var direction=[pos1 | $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE | $this.cbConstants.FLAG_STOP];
					//directions.push($this.cbTypedArray(direction));
					var nbMax = Math.max(lastRow , lastCol) - 1;
					var awayl=[] // hold the sliding line
                   var awayr=[] // hold the sliding line
					for(var n=1;n<nbMax;n++) {

						var delta2=[xleft*n,yleft*n];
                        var delta3=[xright*n,yright*n];
						var pos2=geometry.Graph(pos1,delta2);
                        var pos3=geometry.Graph(pos1,delta3);

						if(pos2!=null ) {
                        // possible to slide at least 1 cell, make sure the diagonal cell is not occupied, but cannot move to this cell
							if(n==1) 
								awayl.push(pos1 | $this.cbConstants.FLAG_STOP );
							awayl.push(pos2 | $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE| $this.cbConstants.FLAG_STOP);
                            
						}
                        if(pos3!=null ) {
                            // possible to slide at least 1 cell, make sure the diagonal cell is not occupied, but cannot move to this cell
							if(n==1) 
								awayr.push(pos1 | $this.cbConstants.FLAG_STOP);
							
                            awayr.push(pos3 | flags | $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE| $this.cbConstants.FLAG_STOP);
						}

					}
					if(awayl.length>0)
						directions.push($this.cbTypedArray(awayl));
                    if(awayr.length>0)
						directions.push($this.cbTypedArray(awayr));
				}
			});
			graph[pos]=directions;

		}

		return $this.cbMergeGraphs(geometry,
		   $this.cbShortRangeGraph(geometry,[[0,1],[1,0],[-1,0],[0,-1]]),
		   graph
		);
	}

	Model.Game.cbPrinceGraph = function(geometry,side,confine) {
		var $this=this;
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			if(confine && !(pos in confine)){
				graph[pos]=[];
				continue;
			}
			graph[pos]=[];
			var forward=[]; // hold the pos line in front of the piece
			var pos1=geometry.Graph(pos,[0,side]);
			if(pos1!=null && (!confine || (pos1 in confine))) {
				forward.push(pos1 | $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE); // capture and move allowed at first forward position
				pos1=geometry.Graph(pos1,[0,side]);
				if(pos1!=null && (!confine || (pos1 in confine)))
					forward.push(pos1 | $this.cbConstants.FLAG_MOVE); // move to second forward only, no capture
				graph[pos].push($this.cbTypedArray(forward));
			}
		}
		return $this.cbMergeGraphs(geometry,
			$this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[-1,0],[1,0],[1,-1],[1,1],[0,-side]]), // direction other than forward
			graph // forward direction
		);
	}




	var confine = {};

	for(var pos=0;pos<geometry.boardSize;pos++) {
		confine[pos]=1;
	}

	Model.Game.cbDefine = function() {

		// classic chess pieces

		var piecesTypes = {
		
      0: {
      name : 'ipawnw',
      abbrev : '',
      fenAbbrev: 'P',
      aspect : 'fr-pawn',
      graph : this.cbInitialPawnGraph(geometry,1,confine),
      value : 0.75,
      initial: [{s:1,p:28},{s:1,p:29},{s:1,p:30},{s:1,p:31},{s:1,p:38},{s:1,p:39},{s:1,p:40},{s:1,p:41},{s:1,p:46},{s:1,p:47},{s:1,p:48},{s:1,p:49},{s:1,p:50},{s:1,p:51}],
      epCatch : true,
      epTarget : true,
      },

      1: {
      name : 'ipawnb',
      abbrev : '',
      fenAbbrev: 'P',
      aspect : 'fr-pawn',
      graph : this.cbInitialPawnGraph(geometry,-1,confine),
      value : 0.75,
      initial: [{s:-1,p:144},{s:-1,p:145},{s:-1,p:146},{s:-1,p:147},{s:-1,p:148},{s:-1,p:149},{s:-1,p:154},{s:-1,p:155},{s:-1,p:156},{s:-1,p:157},{s:-1,p:164},{s:-1,p:165},{s:-1,p:166},{s:-1,p:167}],
      epCatch : true,
      epTarget : true,
      },

      2: {
      name : 'giraffe',
      abbrev : 'Z',
      aspect : 'fr-giraffe',
      graph : this.cbShortRangeGraph(geometry,[[-3,-2],[-3,2],[3,-2],[3,2],[2,3],[2,-3],[-2,3],[-2,-3]]),
      value : 2,
      initial: [{s:1,p:2},{s:1,p:11},{s:-1,p:184},{s:-1,p:193}],
      epCatch : true,
      epTarget : true,
      },
      3: {
      name : 'rhino',
      abbrev : 'U',
      aspect : 'fr-rhino',
      graph : this.cbRhinoGraph(geometry),
      value : 7.5,
     // epCatch : true,
     // epTarget : true,
      initial: [{s:1,p:4},{s:-1,p:186}],
      },
      4: {
      name : 'princew',
      abbrev : 'P',
      aspect : 'fr-prince',
      graph : this.cbPrinceGraph(geometry,1,confine),
      value : 3,
      initial: [{s:1,p:32},{s:1,p:37}],
      epTarget : true,
      },

      5: {
      name : 'princeb',
      abbrev : 'P',
      aspect : 'fr-prince',
      graph : this.cbPrinceGraph(geometry,-1,confine),
      value : 3,
      initial: [{s:-1,p:158},{s:-1,p:163}],
      epTarget : true,
      },

      6: {
      name : 'rook',
      abbrev : 'R',
      aspect : 'fr-rook',
      graph : this.cbRookGraph(geometry,confine),
      value : 5,
      initial: [{s:1,p:15},{s:1,p:26},{s:-1,p:169},{s:-1,p:180}],
      },

      7: {
      name : 'bishop',
      abbrev : 'B',
      aspect : 'fr-bishop',
      graph : this.cbBishopGraph(geometry,confine),
      value : 3.5,
      initial: [{s:1,p:17},{s:1,p:24},{s:-1,p:171},{s:-1,p:178}],
      },

      8: {
      name : 'knight',
      abbrev : 'N',
      aspect : 'fr-knight',
      graph : this.cbKnightGraph(geometry,confine),
      value : 9.75,
      initial: [{s:1,p:16},{s:1,p:25},{s:-1,p:170},{s:-1,p:179}],
      },

      9: {
      name : 'queen',
      abbrev : 'Q',
      aspect : 'fr-queen',
      graph : this.cbQueenGraph(geometry,confine),
      value : 8.3,
      initial: [{s:1,p:20},{s:-1,p:174}],
      },

      10: {
      name : 'king',
      abbrev : 'K',
      aspect : 'fr-king',
      graph : this.cbKingGraph(geometry,confine),
      isKing : true,
      initial: [{s:1,p:21},{s:-1,p:175}],
      },

      11: {
      name : 'bow',
      abbrev : 'V',
      aspect : 'fr-bow',
      graph : this.cbLongRangeGraph(geometry,[[-1,-1],[1,1],[-1,1],[1,-1]],null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE),
      value : 2.5,
      initial: [{s:1,p:3},{s:1,p:10},{s:-1,p:185},{s:-1,p:192}],
      },

      12: {
      name : 'lion',
      abbrev : 'L',
      aspect : 'fr-lion',
      graph : this.cbShortRangeGraph(geometry,[
                  [-1,-1],[-1,1],[1,-1],[1,1],[1,0],[0,1],[-1,0],[0,-1],
                  [-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],
                  [1,-2],[2,-2],[2,-1],[2,0],[2,1],
                  [2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]
                  ], confine),
      value : 9,
      initial: [{s:1,p:35},{s:-1,p:161}],
      },

      13: {
      name : 'elephant',
      abbrev : 'E',
      aspect : 'fr-elephant',
      graph : this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]],confine),
      value : 2.25,
      initial: [{s:1,p:14},{s:1,p:27},{s:-1,p:168},{s:-1,p:181}],
      },

      14: {
      name : 'cannon',
      abbrev : 'C',
      aspect : 'fr-cannon2',
      graph : this.cbXQCannonGraph(geometry),
      value : 3.5,
      initial: [{s:1,p:0},{s:1,p:13},{s:-1,p:182},{s:-1,p:195}],
      },

      15: {
      name : 'machine',
      abbrev : 'W',
      aspect : 'fr-machine',
      graph : this.cbShortRangeGraph(geometry,[[-1,0],[-2,0],[1,0],[2,0],[0,1],[0,2],[0,-1],[0,-2]],confine),
      value : 2.4,
      initial: [{s:1,p:18},{s:1,p:23},{s:-1,p:172},{s:-1,p:177}],
      },

      16: {
      name : 'centaur',
      abbrev : 'J',
      aspect : 'fr-crowned-knight',
     
      graph : this.cbMergeGraphs(geometry,
                  this.cbKnightGraph(geometry,confine),
                  this.cbKingGraph(geometry,confine)),

      value : 5.75,
      initial: [{s:1,p:19},{s:-1,p:173}],
      },

      17: {
      name : 'sorcerer',
      abbrev : 'O',
      aspect : 'fr-star',
      graph : this.cbLongRangeGraph(geometry,[[0,-1],[0,1],[-1,0],[1,0],[1,1],[1,-1],[-1,-1],[-1,1]],null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE),
      value : 6.5,
      initial: [{s:1,p:6},{s:-1,p:188}],
      },
      18: {
      name : 'eagle',
      abbrev : 'G',
      aspect : 'fr-eagle',
      graph : this.cbEagleGraph(geometry),
      value : 9,
      initial: [{s:1,p:34},{s:-1,p:160}],
      },

      19: {
      name : 'camel',
      abbrev : 'M',
      aspect : 'fr-camel',
      graph : this.cbShortRangeGraph(geometry,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),
      value : 2,
      initial: [{s:1,p:1},{s:1,p:12},{s:-1,p:183},{s:-1,p:194}],
      },

      20: {
      name : 'amazon',
      abbrev : 'A',
      aspect : 'fr-amazon',
      graph : this.cbMergeGraphs(geometry,
                  this.cbKnightGraph(geometry,confine),
                  this.cbQueenGraph(geometry,confine)),
      value : 14,
      initial: [{s:1,p:7},{s:-1,p:189}],
      },

      21: {
      name : 'marshall',
      abbrev : 'H',
      aspect : 'fr-marshall',
      graph : this.cbMergeGraphs(geometry,
                  this.cbKnightGraph(geometry,confine),
                  this.cbRookGraph(geometry,confine)),
      value : 8.25,
      initial: [{s:1,p:5},{s:-1,p:187}],
      },

      22: {
      name : 'cardinal',
      abbrev : 'X',
      aspect : 'fr-cardinal',
      graph : this.cbMergeGraphs(geometry,
                  this.cbKnightGraph(geometry,confine),
                  this.cbBishopGraph(geometry,confine)),
      value : 6.75,
      initial: [{s:1,p:8},{s:-1,p:190}],
      },
			

      23: {
      name : 'Buffalo',
      abbrev : 'F',
      aspect : 'fr-buffalo',
      graph : this.cbShortRangeGraph(geometry,[
                  [1,2],[1,3],[2,1],[2,3],[3,1],[3,2],
                  [1,-2],[1,-3],[2,-1],[2,-3],[3,-1],[3,-2],
                  [-1,-2],[-1,-3],[-2,-1],[-2,-3],[-3,-1],[-3,-2],
                  [-1,2],[-1,3],[-2,1],[-2,3],[-3,1],[-3,2]
                  ],confine),
      value : 8,
      initial: [{s:1,p:9},{s:-1,p:191}],
      },

      24: {
      name : 'missionnary',
      abbrev : 'Y',
      aspect : 'fr-crowned-bishop',
      graph : this.cbMergeGraphs(geometry,
                  this.cbKingGraph(geometry,confine),
                  this.cbBishopGraph(geometry,confine)),
      value : 5.5,
      initial: [{s:1,p:33},{s:-1,p:159}],
      },
      25: {
      name : 'amiral',
      abbrev : 'S',
      aspect : 'fr-crowned-rook',
      graph : this.cbMergeGraphs(geometry,
                  this.cbKingGraph(geometry,confine),
                  this.cbRookGraph(geometry,confine)),
      value : 6.75,
      initial: [{s:1,p:36},{s:-1,p:162}],
      },
      26: {
      name : 'duchess',
      abbrev : 'S',
      aspect : 'fr-lighthouse',
      graph : this.cbMergeGraphs(geometry,
                  this.cbKingGraph(geometry,confine),
this.cbShortRangeGraph(geometry,[
    [+2,0],[+3,0],[-2,0],[-3,0],[-2,0],[0,2],[0,3],[0,-2],[0,-3],[-3,-3],[-2,-2],[-3,-3],
    [2,2],[3,3],[+2,-2],[+3,-3],[-2,+2],[-3,+3],
],confine)),

      value : 8.75,
      initial: [{s:1,p:22},{s:-1,p:176}],
      },
		}

		// defining types for readable promo cases
		var T_ipawnw=0
        var T_ipawnb=1
        var T_giraffe=2
        var T_rhino=3
        var T_princew=4
        var T_princeb=5
        var T_rook=6
        var T_bishop=7
        var T_knight=8
        var T_queen=9
        var T_king=10
        var T_bow=11
        var T_lion=12
        var T_elephant=13
        var T_cannon=14
        var T_machine=15
        var T_centaur=16
        var T_buffalo=23
        var T_sorcerer=17
        var T_eagle=18
        var T_camel=19
        var T_amazon=20
        var T_marshall=21
        var T_cardinal=22

		return {
			
			geometry: geometry,
			
			pieceTypes: piecesTypes,

			promote: function(aGame,piece,move) {
				// initial pawns go up to last row where it promotes to Queen
				if( ((piece.t==T_ipawnw) && geometry.R(move.t)==lastRow) || ((piece.t==T_ipawnb ) && geometry.R(move.t)==firstRow)) 
					return [T_queen];
				if (piece.t==T_princew && geometry.R(move.t)==lastRow)
					return [T_amazon];
				if (piece.t==T_princeb && geometry.R(move.t)==firstRow)
					return [T_amazon];
				if ((piece.t==T_knight || piece.t==T_camel || piece.t==T_giraffe) && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					return [T_buffalo];
				if (piece.t==T_elephant && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					return [T_lion];
				if (piece.t==T_machine && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					return [T_lion];
				if (piece.t==T_centaur && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					return [T_lion];
				return [];
			},					
		};
	}

	/*
	 * Model.Board.GenerateMoves:
	 *   - handle king special move: a kind of castle involving only the king
	 *   -When jumping like a Knight, at least one of the two intermediate squares must be free of threat (e.g., if jumping from h2 to j3, either i2 or i3 must not be under attack).
	 */
	var kingLongMoves={
		"1": {
21: [ [48,34],[50,36],[48,35],[50,35],[49,35],[49,34],[49,36],[37,22],[23,22],[9,22],[37,36],[9,8],[5,6],[5,20],[33,20],[19,20],[33,34],[19,34],[19,6],[47,34],[23,8],[23,36],[51,36]]
		},
		"-1": {
			175: [ [145,160],[149,162],[163,162],[163,176],[177,176],[191,176],[187,174],[159,174],[159,160],[173,174],[147,162],[147,160],[146,160],[146,161],[148,161],[148,162],[147,161],[177,162],[149,162],[177,190],[173,188],[173,160]]
		},
	}

var SuperModelBoardGenerateMoves=Model.Board.GenerateMoves;
	Model.Board.GenerateMoves = function(aGame) {

		SuperModelBoardGenerateMoves.apply(this,arguments); // call regular GenerateMoves method
		// now consider special 2 cases king moves
		var kPiece=this.pieces[this.board[this.kings[this.mWho]]];
		if(!kPiece.m && !this.check) {
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
					if(inCheck 
/* // king move but doesn‘t jump
|| tmpOut>-1
*/                  ) {
						canMove=false;
						break;
					}
				}

				if(canMove)
					this.mMoves.push({
						f: kPiece.p,
						t: lMove[0],
                        //t: pos,
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

	/*
	 * Model.Move.ToString overriding for setup notation
	 */
	var SuperModelMoveToString = Model.Move.ToString;
	Model.Move.ToString = function() {

		return SuperModelMoveToString.apply(this,arguments);
	}
	
	/*
	 * Model.Board.CompactMoveString overriding to help reading PJN game transcripts
	 */
	var SuperModelBoardCompactMoveString = Model.Board.CompactMoveString; 
	Model.Board.CompactMoveString = function(aGame,aMove,allMoves) {
		if(typeof aMove.ToString!="function") // ensure proper move object, if necessary
			aMove=aGame.CreateMove(aMove);

		return SuperModelBoardCompactMoveString.apply(this,arguments);
	}

})();
