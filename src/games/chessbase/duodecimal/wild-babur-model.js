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
	var lastRow=11;
	var firstCol=0;
	var lastCol=11;

	var geometry = Model.Game.cbBoardGeometryGrid(12,12);

	// graphs

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
      abbrev : '',
      fenAbbrev: 'P',
      aspect : 'fr-pawn',
      graph : this.cbInitialPawnGraph(geometry,1),
      value : 0.9,
      initial: [{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:28},{s:1,p:29},{s:1,p:30},{s:1,p:31},{s:1,p:32},{s:1,p:33},{s:1,p:34},{s:1,p:35}],
      epCatch : true,
      epTarget : true,
      },

      1: {
      name : 'ipawnb',
      abbrev : '',
      fenAbbrev: 'P',
      aspect : 'fr-pawn',
      graph : this.cbInitialPawnGraph(geometry,-1),
      value : 0.9,
      initial: [{s:-1,p:108},{s:-1,p:109},{s:-1,p:110},{s:-1,p:111},{s:-1,p:112},{s:-1,p:113},{s:-1,p:114},{s:-1,p:115},{s:-1,p:116},{s:-1,p:117},{s:-1,p:118},{s:-1,p:119}],
      epCatch : true,
      epTarget : true,
      },
      2: {
      name : 'princew',
      abbrev : 'I',
      aspect : 'fr-prince',
      graph : this.cbPrinceGraph(geometry,1,confine),
      value : 3.5,
       initial: [{s:1,p:16},{s:1,p:19}],
      epTarget : true,
      },
      3: {
      name : 'princeb',
      abbrev : 'I',
      aspect : 'fr-prince',
      graph : this.cbPrinceGraph(geometry,-1,confine),
      value : 3.5,
      initial: [{s:-1,p:124},{s:-1,p:127}],
      epTarget : true,
      },
      4: {
      name : 'rook',
      abbrev : 'R',
      aspect : 'fr-rook',
      graph : this.cbRookGraph(geometry,confine),
      value : 5,
      initial: [{s:1,p:12},{s:1,p:23},{s:-1,p:120},{s:-1,p:131}],
      },
      5: {
      name : 'bishop',
      abbrev : 'B',
      aspect : 'fr-bishop',
      graph : this.cbBishopGraph(geometry,confine),
      value : 4,
      initial: [{s:1,p:14},{s:1,p:21},{s:-1,p:122},{s:-1,p:129}],
      },
      6: {
      name : 'knight',
      abbrev : 'N',
      aspect : 'fr-knight',
      graph : this.cbKnightGraph(geometry,confine),
      value : 3,
      initial: [{s:1,p:13},{s:1,p:22},{s:-1,p:121},{s:-1,p:130}],
      },
      7: {
      name : 'queen',
      abbrev : 'Q',
      aspect : 'fr-queen',
      graph : this.cbQueenGraph(geometry,confine),
      value : 10,
      initial: [],
      },
      8: {
      name : 'king',
      abbrev : 'K',
      aspect : 'fr-king',
      graph : this.cbKingGraph(geometry,confine),
      isKing : true,
      initial: [{s:1,p:17},{s:-1,p:125}],
      },
      9: {
      name : 'elephant',
      abbrev : 'E',
      aspect : 'fr-elephant',
      graph : this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]],confine),
      value : 2.9,
      initial: [{s:1,p:0},{s:1,p:11},{s:-1,p:132},{s:-1,p:143}],
      },
      10: {
      name : 'cannon',
      abbrev : 'Z',
      aspect : 'fr-cannon2',
      graph : this.cbXQCannonGraph(geometry),
      value : 3.5,
      initial: [{s:1,p:4},{s:1,p:7},{s:-1,p:136},{s:-1,p:139}],
      },
      11: {
      name : 'eagle',
      abbrev : 'H',
      aspect : 'fr-griffon',
      graph : this.cbGriffonGraph(geometry),
      value : 8.1,
      initial: [{s:1,p:15},{s:1,p:20},{s:-1,p:123},{s:-1,p:128}],
      },
      12: {
      name : 'camel',
      abbrev : 'J',
      aspect : 'fr-camel',
      graph : this.cbShortRangeGraph(geometry,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),
      value : 2.7,
      initial: [{s:1,p:2},{s:1,p:9},{s:-1,p:134},{s:-1,p:141}],
      },
       13: {
      name : 'ship',
      abbrev : 'X',
      aspect : 'fr-ship',
      graph : this.cbShipGraph(geometry),
      value : 4.8,
      initial: [],
      },
      14: {
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
      initial: [{s:1,p:18},{s:-1,p:126}],
      },
		}

		// defining types for readable promo cases
		var T_ipawnw=0
        var T_ipawnb=1
        var T_princew=2
        var T_princeb=3
        var T_rook=4
        var T_bishop=5
        var T_knight=6
        var T_queen=7
        var T_king=10
        var T_lion=14
        var T_elephant=9
        var T_cannon=10
        var T_ship=13
        var T_eagle=11
        var T_camel=12

		return {
			
			geometry: geometry,
			
			pieceTypes: piecesTypes,

			promote: function(aGame,piece,move) {
				// initial pawns go up to last row where it promotes to Queen
				if( ((piece.t==T_ipawnw ) && geometry.R(move.t)==lastRow) || ((piece.t==T_ipawnb ) && geometry.R(move.t)==firstRow)) 
					return [T_queen];
				if (piece.t==T_princew && geometry.R(move.t)==lastRow)
					return [T_queen];

				if (piece.t==T_ship && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					return [T_eagle];
				return [];
			},					
		};
	}

})();
