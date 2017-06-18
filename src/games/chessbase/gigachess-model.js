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

	// graphs
	Model.Game.cbCorporalGraph = function(geometry,side,confine) {
		var $this=this;
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			if(confine && !(pos in confine)){
				graph[pos]=[];
				continue;
			}
			var directions=[];
			var pos1=geometry.Graph(pos,[0,side]);
			if(pos1!=null && (!confine || (pos1 in confine))) {
				var direction=[pos1 | $this.cbConstants.FLAG_MOVE];
				var pos2=geometry.Graph(pos1,[0,side]);
				if(pos2!=null && (!confine || (pos2 in confine)))
					direction.push(pos2 | $this.cbConstants.FLAG_MOVE);
				directions.push($this.cbTypedArray(direction));
			}
			[-1,1].forEach(function(dc) {
				var pos2=geometry.Graph(pos,[dc,side]);
				if(pos2!=null && (!confine || (pos2 in confine)))
					directions.push($this.cbTypedArray([pos2 | $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE]));
			});
			graph[pos]=directions;
		}
		return graph;
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

	Model.Game.cbShipGraph = function(geometry){
		var $this=this;

		var flags = $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE;
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			graph[pos]=[];
			[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(delta) { // loop on all 4 diagonals
				var pos1=geometry.Graph(pos,delta);
				if(pos1!=null) {
					for(var dir=1;dir<2;dir++) { // dir=0 for row, dir=1 for column
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

	var confine = {};

	for(var pos=0;pos<geometry.boardSize;pos++) {
		confine[pos]=1;
	}

	Model.Game.cbDefine = function() {

		// classic chess pieces

		var piecesTypes = {


		
      0: {
      name : 'ipawnw',
      abbrev : 'P',
      aspect : 'fr-pawn',
      graph : this.cbInitialPawnGraph(geometry,1,confine),
      value : 0.6,
      initial: [{s:1,p:28},{s:1,p:29},{s:1,p:30},{s:1,p:31},{s:1,p:38},{s:1,p:39},{s:1,p:40},{s:1,p:41},{s:1,p:46},{s:1,p:47},{s:1,p:48},{s:1,p:49},{s:1,p:50},{s:1,p:51}],
      epCatch : true,
      epTarget : true,
      },

      1: {
      name : 'ipawnb',
      abbrev : 'P',
      aspect : 'fr-pawn',
      graph : this.cbInitialPawnGraph(geometry,-1,confine),
      value : 0.6,
      initial: [{s:-1,p:144},{s:-1,p:145},{s:-1,p:146},{s:-1,p:147},{s:-1,p:148},{s:-1,p:149},{s:-1,p:154},{s:-1,p:155},{s:-1,p:156},{s:-1,p:157},{s:-1,p:164},{s:-1,p:165},{s:-1,p:166},{s:-1,p:167}],
      epCatch : true,
      epTarget : true,
      },

      2: {
      name : 'corporalw',
      abbrev : 'O',
      aspect : 'fr-corporal',
      graph : this.cbCorporalGraph(geometry,1,confine),
      value : 0.9,
      initial: [{s:1,p:32},{s:1,p:33},{s:1,p:34},{s:1,p:35},{s:1,p:36},{s:1,p:37}],
      epCatch : true,
      epTarget : true,
      },

      3: {
      name : 'corporalb',
      abbrev : 'O',
      aspect : 'fr-corporal',
      graph : this.cbCorporalGraph(geometry,-1,confine),
      value : 0.9,
      initial: [{s:-1,p:158},{s:-1,p:159},{s:-1,p:160},{s:-1,p:161},{s:-1,p:162},{s:-1,p:163}],
      epCatch : true,
      epTarget : true,
      },

      4: {
      name : 'princew',
      abbrev : 'I',
      aspect : 'fr-prince',
      graph : this.cbPrinceGraph(geometry,1,confine),
      value : 2.5,
      initial: [{s:1,p:19},{s:1,p:22}],
      epTarget : true,
      },

      5: {
      name : 'princeb',
      abbrev : 'I',
      aspect : 'fr-prince',
      graph : this.cbPrinceGraph(geometry,-1,confine),
      value : 2.5,
      initial: [{s:-1,p:173},{s:-1,p:176}],
      epTarget : true,
      },

      6: {
      name : 'rook',
      abbrev : 'R',
      aspect : 'fr-rook',
      graph : this.cbRookGraph(geometry,confine),
      value : 5,
      initial: [{s:1,p:16},{s:1,p:25},{s:-1,p:170},{s:-1,p:179}],
      },

      7: {
      name : 'bishop',
      abbrev : 'B',
      aspect : 'fr-bishop',
      graph : this.cbBishopGraph(geometry,confine),
      value : 3.4,
      initial: [{s:1,p:18},{s:1,p:23},{s:-1,p:172},{s:-1,p:177}],
      },

      8: {
      name : 'knight',
      abbrev : 'N',
      aspect : 'fr-knight',
      graph : this.cbKnightGraph(geometry,confine),
      value : 2.2,
      initial: [{s:1,p:17},{s:1,p:24},{s:-1,p:171},{s:-1,p:178}],
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
      abbrev : 'W',
      aspect : 'fr-bow',
      graph : this.cbLongRangeGraph(geometry,[[-1,-1],[1,1],[-1,1],[1,-1]],null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE),
      value : 3.3,
      initial: [{s:1,p:0},{s:1,p:13},{s:-1,p:182},{s:-1,p:195}],
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
      value : 6.7,
      initial: [{s:1,p:5},{s:-1,p:187}],
      },

      13: {
      name : 'elephant',
      abbrev : 'E',
      aspect : 'fr-elephant',
      graph : this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]],confine),
      value : 2.2,
      initial: [{s:1,p:15},{s:1,p:26},{s:-1,p:169},{s:-1,p:180}],
      },

      14: {
      name : 'cannon',
      abbrev : 'Z',
      aspect : 'fr-cannon2',
      graph : this.cbXQCannonGraph(geometry),
      value : 4.9,
      initial: [{s:1,p:1},{s:1,p:12},{s:-1,p:183},{s:-1,p:194}],
      },

      15: {
      name : 'machine',
      abbrev : 'D',
      aspect : 'fr-machine',
      graph : this.cbShortRangeGraph(geometry,[[-1,0],[-2,0],[1,0],[2,0],[0,1],[0,2],[0,-1],[0,-2]],confine),
      value : 2.4,
      initial: [{s:1,p:14},{s:1,p:27},{s:-1,p:168},{s:-1,p:181}],
      },

      16: {
      name : 'buffalo',
      abbrev : 'F',
      aspect : 'fr-buffalo',
      graph : this.cbShortRangeGraph(geometry,[
                  [1,2],[1,3],[2,1],[2,3],[3,1],[3,2],
                  [1,-2],[1,-3],[2,-1],[2,-3],[3,-1],[3,-2],
                  [-1,-2],[-1,-3],[-2,-1],[-2,-3],[-3,-1],[-3,-2],
                  [-1,2],[-1,3],[-2,1],[-2,3],[-3,1],[-3,2]
                  ],confine),
      value : 5.9,
      initial: [{s:1,p:4},{s:-1,p:186}],
      },

      17: {
      name : 'ship',
      abbrev : 'X',
      aspect : 'fr-ship',
      graph : this.cbShipGraph(geometry),
      value : 4.5,
      initial: [{s:1,p:3},{s:1,p:10},{s:-1,p:185},{s:-1,p:192}],
      },

      18: {
      name : 'eagle',
      abbrev : 'H',
      aspect : 'fr-eagle',
      graph : this.cbEagleGraph(geometry),
      value : 8.1,
      initial: [{s:1,p:6},{s:-1,p:188}],
      },

      19: {
      name : 'camel',
      abbrev : 'J',
      aspect : 'fr-camel',
      graph : this.cbShortRangeGraph(geometry,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),
      value : 2,
      initial: [{s:1,p:2},{s:1,p:11},{s:-1,p:184},{s:-1,p:193}],
      },

      20: {
      name : 'amazon',
      abbrev : 'A',
      aspect : 'fr-amazon',
      graph : this.cbMergeGraphs(geometry,
                  this.cbKnightGraph(geometry,confine),
                  this.cbQueenGraph(geometry,confine)),
      value : 10.4,
      initial: [{s:1,p:7},{s:-1,p:189}],
      },

      21: {
      name : 'marshall',
      abbrev : 'M',
      aspect : 'fr-marshall',
      graph : this.cbMergeGraphs(geometry,
                  this.cbKnightGraph(geometry,confine),
                  this.cbRookGraph(geometry,confine)),
      value : 7.1,
      initial: [{s:1,p:8},{s:-1,p:190}],
      },

      22: {
      name : 'cardinal',
      abbrev : 'C',
      aspect : 'fr-cardinal',
      graph : this.cbMergeGraphs(geometry,
                  this.cbKnightGraph(geometry,confine),
                  this.cbBishopGraph(geometry,confine)),
      value : 5.5,
      initial: [{s:1,p:9},{s:-1,p:191}],
      },
			

		}

		// defining types for readable promo cases
		var T_ipawnw=0
    var T_ipawnb=1
    var T_corporalw=2
    var T_corporalb=3
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
    var T_buffalo=16
    var T_ship=17
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
				if( ((piece.t==T_ipawnw || piece.t==T_corporalw) && geometry.R(move.t)==lastRow) || ((piece.t==T_ipawnb || piece.t==T_corporalb) && geometry.R(move.t)==firstRow)) 
					return [T_queen];
				if (piece.t==T_princew && geometry.R(move.t)==lastRow)
					return [T_amazon];
				if (piece.t==T_princeb && geometry.R(move.t)==firstRow)
					return [T_amazon];
				if ((piece.t==T_knight || piece.t==T_camel) && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					return [T_buffalo];
				if (piece.t==T_elephant && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					return [T_lion];
				if (piece.t==T_machine && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					return [T_lion];
				if (piece.t==T_ship && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					return [T_eagle];
				return [];
			},					
		};
	}

})();
