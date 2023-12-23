
(function() {
	var firstRow=0;
	var lastRow=12;
	var firstCol=0;
	var lastCol=12;
	var geometry = Model.Game.cbBoardGeometryGrid(13,13);


	/** Move graph for the Snake */
	Model.Game.cbSnakeGraph = function(geometry,confine){
		var $this=this;
        return $this.cbSkiGraph(geometry,[[0,1],[0,-1]],1);
	}
    /** Move graph for the Ship */
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
		
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

			
				0: {
					name: 'ipawn-w',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,1),
					value: .9,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:39},{s:1,p:40},{s:1,p:41},{s:1,p:42},{s:1,p:43},{s:1,p:44},{s:1,p:45},{s:1,p:46},{s:1,p:47},{s:1,p:48},{s:1,p:49},{s:1,p:50},{s:1,p:51}],
					epCatch : true,
					epTarget : true,
				},
				1: {
					name: 'ipawn-b',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,-1),
					value: .9,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:117},{s:-1,p:118},{s:-1,p:119},{s:-1,p:120},{s:-1,p:121},{s:-1,p:122},{s:-1,p:123},{s:-1,p:124},{s:-1,p:125},{s:-1,p:126},{s:-1,p:127},{s:-1,p:128},{s:-1,p:129}],
					epCatch : true,
					epTarget : true,
				},
				2: {
					name: 'hawk',
					aspect: 'fr-hawk',
					graph: this.cbShortRangeGraph(geometry,[
						[-3,3],[-2,2],[0,2],[2,2],[3,3],[0,3],
						[3,3],[-2,0],[-3,0],[2,0],[3,0],[0,-2],[0,-3],
						[2,-2],[3,-3],[0,2],[0,3],[-2,-2],[-3,-3]]),
					value: 5.5,
					abbrev: 'H',
					initial: [{s:1,p:0},{s:1,p:12},{s:-1,p:156},{s:-1,p:168}],
				},
				3: {
					name: 'mammoth',
					aspect: 'fr-mammoth',
					graph : this.cbMergeGraphs(geometry,
                  this.cbKingGraph(geometry),
                  this.cbShortRangeGraph(geometry,[
						[-2,-2],[0,-2],[-2,2],[0,2],[2,2],[2,0],
						[-2,2],[-2,0],[0,-2],[2,-2]])),
					value: 6.5,
					abbrev: 'M',
					initial: [{s:1,p:1},{s:1,p:11},{s:-1,p:157},{s:-1,p:167}],
				},
				4: {
					name: 'squirle',
					aspect: 'fr-squirle',
					graph: this.cbShortRangeGraph(geometry,[
						[-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],
						[1,-2],[2,-2],[2,-1],[2,0],[2,1],
						[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]]),
					value: 6,
					abbrev: 'Q',
					initial: [{s:1,p:2},{s:1,p:10},{s:-1,p:158},{s:-1,p:166}],
				},

				5: {
					name: 'Cheetah',
					aspect: 'fr-leopard',
					graph: this.cbShortRangeGraph(geometry,[
						[-3,0],[-3,-1],[-3,-2],[-3,-3],[-3,1],[-3,2],[-3,3],
                        [3,0],[3,-1],[3,-2],[3,-3],[3,1],[3,2],[3,3],
                        [-2,3],[-1,3],[0,3],[1,3],[2,3],
						[-2,-3],[-1,-3],[0,-3],[1,-3],[2,-3]
                    ]),
					value: 8,
					abbrev: 'C',
					initial: [{s:1,p:3},{s:1,p:9},{s:-1,p:159},{s:-1,p:165}],
				},
				
				6: {
					name: 'ship',
					aspect: 'fr-ship',
					graph : this.cbShipGraph(geometry),
					value: 4.5,
					abbrev: 'S',
					initial: [{s:1,p:4},{s:1,p:8},{s:-1,p:160},{s:-1,p:164}],
				},
				7: {
					name: 'snake',
					aspect: 'fr-dragon',
					graph: this.cbSnakeGraph(geometry),
					value: 3.5,
					abbrev: 'N',
					initial: [{s:1,p:5},{s:1,p:7},{s:-1,p:161},{s:-1,p:163}],
				},

				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:6},{s:-1,p:162}],
				},
      			9: {
                    name : 'troll-w',
                    abbrev : 'T',
                    aspect : 'fr-huscarl',
                    graph : this.cbMergeGraphs(geometry,
                  this.cbPawnGraph(geometry,1),
                  this.cbShortRangeGraph(geometry,[
						[-3,3],[0,3],[3,3],[-3,0],[3,0],[-3,-3],
						[0,-3],[-3,3]])),
                    value : 3.25,
                    initial: [{s:1,p:18},{s:1,p:20},{s:1,p:32}],
                },
                10: {
                    name : 'troll-b',
                    abbrev : 'T',
                    aspect : 'fr-huscarl',
                    graph : this.cbMergeGraphs(geometry,
                  this.cbPawnGraph(geometry,-1),
                  this.cbShortRangeGraph(geometry,[
						[-3,3],[0,3],[3,3],[-3,0],[3,0],[-3,-3],
						[0,-3],[-3,3]])),
                    value : 3.25,
                    initial: [{s:-1,p:148},{s:-1,p:150},{s:-1,p:136}],
                },
                11: {
                  name : 'princew',
                  abbrev : 'P',
                  aspect : 'fr-prince',
                  graph : this.cbPrinceGraph(geometry,1,confine),
                  value : 3.25,
                  initial: [{s:1,p:19}],
                  epTarget : true,
                },
                12: {
                  name : 'princeb',
                  abbrev : 'P',
                  aspect : 'fr-prince',
                  graph : this.cbPrinceGraph(geometry,-1,confine),
                  value : 3.25,
                  initial: [{s:-1,p:149}],
                  epTarget : true,
                },

      			13: {
                  name : 'griffon',
                  abbrev : 'G',
                  aspect : 'fr-griffin',
                  graph : this.cbGriffonGraph(geometry),
                  value : 8.5,
                  initial: [],
                 },
      			14: {
                  name : 'rhino',
                  abbrev : 'U',
                  aspect : 'fr-rhino',
                  graph : this.cbRhinoGraph(geometry),
                  value : 7.5,
                  initial: [],
                },
                15: {
                  name : 'direwolf',
                  abbrev : 'O',
                  aspect : 'fr-wolf',
                  graph : this.cbShortRangeGraph(geometry,[
                  [-3,-3],[-3,3],[3,-3],[3,3],[3,0],[0,3],[-3,0],[0,-3],
                  [-3,2],[-3,1],[3,-1],[3,-2],[3,1],[3,2],[1,3],[2,3],
                  [1,-3],[2,-3],[-3,-1],[-3,-2],[-1,3],[-2,3],[-1,-3],[-2,-3],
                  [-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],
                  [1,-2],[2,-2],[2,-1],[2,0],[2,1],
                  [2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]
                  ]),
                  value : 17.5,
                  initial: [],
                },
			},
            promote: function(aGame,piece,move) {
				if( ((piece.t==0) && geometry.R(move.t)==lastRow) || ((piece.t==1 ) && geometry.R(move.t)==firstRow)) 
					    return [15];
				    if (piece.t==11 && geometry.R(move.t)==lastRow)
					    return [15];
				    if (piece.t==12 && geometry.R(move.t)==firstRow)
					    return [15];
				    if ((piece.t==6) && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					    return [13];
				    if (piece.t==7 && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					    return [14];
				    if ((piece.t==9 ) && (geometry.R(move.t)==lastRow && piece.s > 0 && piece.p > 142)) {
                        console.log("move.t",move.t);
                        console.log("piece.s",piece.s);
                        console.log("aGame",aGame);
                        console.log("move",move);
                        console.log("piece",piece);
                        return [15];
                    }
                    if ((piece.t==10 ) && (geometry.R(move.t)==firstRow && piece.s < 0 && piece.p < 26)) {
                    console.log("move.t",move.t);
                        console.log("piece.s",piece.s);
                        console.log("aGame",aGame);
                        console.log("move",move);
                        console.log("piece",piece);
                        return [15];
                    }
                    return [];
			},
			
		};
	}

	
})();
