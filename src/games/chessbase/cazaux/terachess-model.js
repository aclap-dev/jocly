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
	var lastRow=15;
	var firstCol=0;
	var lastCol=15;

	var geometry = Model.Game.cbBoardGeometryGrid(16,16);

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


	Model.Game.cbRhinoGraph = function(geometry,confine){
		var $this=this;

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
      value : 0.5,
      initial: [{s:1,p:48},{s:1,p:49},{s:1,p:50},{s:1,p:51},{s:1,p:52},{s:1,p:53},{s:1,p:54},{s:1,p:55},{s:1,p:56},{s:1,p:57},{s:1,p:58},{s:1,p:59},{s:1,p:60},{s:1,p:61},{s:1,p:62},{s:1,p:63}],
      epCatch : true,
      epTarget : true,
      },

      1: {
      name : 'ipawnb',
      abbrev : '',
      fenAbbrev: 'P',
      aspect : 'fr-pawn',
      graph : this.cbInitialPawnGraph(geometry,-1,confine),
      value : 0.5,
      initial: [{s:-1,p:192},{s:-1,p:193},{s:-1,p:194},{s:-1,p:195},{s:-1,p:196},{s:-1,p:197},{s:-1,p:198},{s:-1,p:199},{s:-1,p:200},{s:-1,p:201},{s:-1,p:202},{s:-1,p:203},{s:-1,p:204},{s:-1,p:205},{s:-1,p:206},{s:-1,p:207}],
      epCatch : true,
      epTarget : true,
      },

      2: {
      name : 'corporalw',
      abbrev : 'O',
      aspect : 'fr-corporal',
      graph : this.cbCorporalGraph(geometry,1,confine),
      value : 0.8,
      initial: [{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19},{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:28},{s:1,p:29},{s:1,p:30},{s:1,p:31}],
      epCatch : true,
      epTarget : true,
      },

      3: {
      name : 'corporalb',
      abbrev : 'O',
      aspect : 'fr-corporal',
      graph : this.cbCorporalGraph(geometry,-1,confine),
      value : 0.8,
      initial: [{s:-1,p:224},{s:-1,p:225},{s:-1,p:226},{s:-1,p:227},{s:-1,p:228},{s:-1,p:229},{s:-1,p:230},{s:-1,p:233},{s:-1,p:234},{s:-1,p:235},{s:-1,p:236},{s:-1,p:237},{s:-1,p:238},{s:-1,p:239}],
      epCatch : true,
      epTarget : true,
      },

      4: {
      name : 'princew',
      abbrev : 'I',
      aspect : 'fr-admiral',
      graph : this.cbPrinceGraph(geometry,1,confine),
      value : 2.2,
      initial: [{s:1,p:38},{s:1,p:41}],
      epTarget : true,
      },

      5: {
      name : 'princeb',
      abbrev : 'I',
      aspect : 'fr-admiral',
      graph : this.cbPrinceGraph(geometry,-1,confine),
      value : 2.2,
      initial: [{s:-1,p:214},{s:-1,p:217}],
      epTarget : true,
      },

      6: {
      name : 'rook',
      abbrev : 'R',
      aspect : 'fr-rook',
      graph : this.cbRookGraph(geometry,confine),
      value : 5,
      initial: [{s:1,p:34},{s:1,p:45},{s:-1,p:210},{s:-1,p:221}],
      },

      7: {
      name : 'bishop',
      abbrev : 'B',
      aspect : 'fr-bishop',
      graph : this.cbBishopGraph(geometry,confine),
      value : 3.4,
      initial: [{s:1,p:36},{s:1,p:43},{s:-1,p:212},{s:-1,p:219}],
      },

      8: {
      name : 'knight',
      abbrev : 'N',
      aspect : 'fr-knight',
      graph : this.cbKnightGraph(geometry,confine),
      value : 2,
      initial: [{s:1,p:35},{s:1,p:44},{s:-1,p:211},{s:-1,p:220}],
      },

      9: {
      name : 'queen',
      abbrev : 'Q',
      aspect : 'fr-queen',
      graph : this.cbQueenGraph(geometry,confine),
      value : 8.3,
      initial: [{s:1,p:39},{s:-1,p:215}],
      },

      10: {
      name : 'king',
      abbrev : 'K',
      aspect : 'fr-king',
      graph : this.cbKingGraph(geometry,confine),
      isKing : true,
      initial: [{s:1,p:40},{s:-1,p:216}],
      },

      11: {
      name : 'star',
      abbrev : 'S',
      aspect : 'fr-star',
      graph : this.cbLongRangeGraph(geometry,[[0,-1],[0,1],[-1,0],[1,0],[1,1],[1,-1],[-1,-1],[-1,1]],null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE),
      value : 8.2,
      initial: [{s:1,p:7},{s:-1,p:247}],
      },

      12: {
      name : 'bow',
      abbrev : 'W',
      aspect : 'fr-bow',
      graph : this.cbLongRangeGraph(geometry,[[-1,-1],[1,1],[-1,1],[1,-1]],null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE),
      value : 3.3,
      initial: [{s:1,p:2},{s:1,p:13},{s:-1,p:242},{s:-1,p:253}],
      },

      13: {
      name : 'rhino',
      abbrev : 'U',
      aspect : 'fr-rhino2',
      graph : this.cbRhinoGraph(geometry,confine),
      value : 6.1,
      initial: [{s:1,p:6},{s:-1,p:246}],
      },

      14: {
      name : 'bull',
      abbrev : 'T',
      aspect : 'fr-bull',
      graph : this.cbShortRangeGraph(geometry,[
      					[2,3],[3,2],[2,-3],[3,-2],[-2,3],[-3,2],[-2,-3],[-3,-2]
      					],confine),
      value : 1.7,
      initial: [{s:1,p:3},{s:1,p:12},{s:-1,p:243},{s:-1,p:252}],
      },

      15: {
      name : 'antelope',
      abbrev : 'G',
      aspect : 'fr-antelope',
      graph : this.cbShortRangeGraph(geometry,[
      					[2,2],[3,3],[2,-2],[3,-3],[-2,2],[-3,3],[-2,-2],[-3,-3],
      					[2,0],[3,0],[-2,0],[-3,0],[0,2],[0,3],[0,-2],[0,-3]
      					],
      					confine),
      value : 3.7,
      initial: [{s:1,p:0},{s:1,p:15},{s:-1,p:240},{s:-1,p:255}],
      },

      16: {
      name : 'lion',
      abbrev : 'L',
      aspect : 'fr-lion',
      graph : this.cbShortRangeGraph(geometry,[
      						[-1,-1],[-1,1],[1,-1],[1,1],[1,0],[0,1],[-1,0],[0,-1],
      						[-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],
      						[1,-2],[2,-2],[2,-1],[2,0],[2,1],
      						[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]
      						], confine),
      value : 6,
      initial: [{s:1,p:23},{s:-1,p:231}],
      },

      17: {
      name : 'elephant',
      abbrev : 'E',
      aspect : 'fr-elephant',
      graph : this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]],confine),
      value : 2,
      initial: [{s:1,p:32},{s:1,p:47},{s:-1,p:208},{s:-1,p:223}],
      },

      18: {
      name : 'cannon',
      abbrev : 'Z',
      aspect : 'fr-cannon2',
      graph : this.cbXQCannonGraph(geometry),
      value : 5,
      initial: [{s:1,p:4},{s:1,p:11},{s:-1,p:244},{s:-1,p:251}],
      },

      19: {
      name : 'machine',
      abbrev : 'D',
      aspect : 'fr-machine',
      graph : this.cbShortRangeGraph(geometry,[[-1,0],[-2,0],[1,0],[2,0],[0,1],[0,2],[0,-1],[0,-2]],confine),
      value : 2.2,
      initial: [{s:1,p:33},{s:1,p:46},{s:-1,p:209},{s:-1,p:222}],
      },

      20: {
      name : 'buffalo',
      abbrev : 'F',
      aspect : 'fr-buffalo',
      graph : this.cbShortRangeGraph(geometry,[
      						[1,2],[1,3],[2,1],[2,3],[3,1],[3,2],
      						[1,-2],[1,-3],[2,-1],[2,-3],[3,-1],[3,-2],
      						[-1,-2],[-1,-3],[-2,-1],[-2,-3],[-3,-1],[-3,-2],
      						[-1,2],[-1,3],[-2,1],[-2,3],[-3,1],[-3,2]
      						],confine),
      value : 5.4,
      initial: [{s:1,p:5},{s:-1,p:245}],
      },

      21: {
      name : 'ship',
      abbrev : 'X',
      aspect : 'fr-ship',
      graph : this.cbShipGraph(geometry),
      value : 4.4,
      initial: [{s:1,p:37},{s:1,p:42},{s:-1,p:213},{s:-1,p:218}],
      },

      22: {
      name : 'eagle',
      abbrev : 'H',
      aspect : 'fr-griffon',
      graph : this.cbEagleGraph(geometry),
      value : 8.4,
      initial: [{s:1,p:24},{s:-1,p:232}],
      },

      23: {
      name : 'camel',
      abbrev : 'J',
      aspect : 'fr-camel',
      graph : this.cbShortRangeGraph(geometry,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),
      value : 2,
      initial: [{s:1,p:1},{s:1,p:14},{s:-1,p:241},{s:-1,p:254}],
      },

      24: {
      name : 'amazon',
      abbrev : 'A',
      aspect : 'fr-amazon',
      graph : this.cbMergeGraphs(geometry,
      						this.cbKnightGraph(geometry,confine),
      						this.cbQueenGraph(geometry,confine)),
      value : 10.2,
      initial: [{s:1,p:8},{s:-1,p:248}],
      },

      25: {
      name : 'marshall',
      abbrev : 'M',
      aspect : 'fr-marshall',
      graph : this.cbMergeGraphs(geometry,
      						this.cbKnightGraph(geometry,confine),
      						this.cbRookGraph(geometry,confine)),
      value : 6.9,
      initial: [{s:1,p:9},{s:-1,p:249}],
      },

      26: {
      name : 'cardinal',
      abbrev : 'C',
      aspect : 'fr-cardinal',
      graph : this.cbMergeGraphs(geometry,
      						this.cbKnightGraph(geometry,confine),
      						this.cbBishopGraph(geometry,confine)),
      value : 5.3,
      initial: [{s:1,p:10},{s:-1,p:250}],
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
    var T_star=11
    var T_bow=12
    var T_rhino=13
    var T_bull=14
    var T_antelope=15
    var T_lion=16
    var T_elephant=17
    var T_cannon=18
    var T_machine=19
    var T_buffalo=20
    var T_ship=21
    var T_eagle=22
    var T_camel=23
    var T_amazon=24
    var T_marshall=25
    var T_cardinal=26

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
				if ((piece.t==T_knight || piece.t==T_camel || piece.t==T_bull) && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) )
					return [T_buffalo];
				if (piece.t==T_elephant && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) )
					return [T_lion];
				if (piece.t==T_machine && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) )
					return [T_lion];
				if (piece.t==T_ship && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) )
					return [T_eagle];
				if (piece.t==T_antelope && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) )
					return [T_star];
				return [];
			},
		};
	}

	var SuperModelBoardGenerateMoves=Model.Board.GenerateMoves;
	Model.Board.GenerateMoves = function(aGame) {
		var $this = this;
		SuperModelBoardGenerateMoves.apply(this,arguments); // call regular GenerateMoves method
	}

	var SuperModelBoardApplyMove=Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {
		// console.log("ApplyMove entrance",aGame,move);
		var $this = this;
		SuperModelBoardApplyMove.apply(this,arguments); // call regular GenerateMoves method
	}

})();
