
(function() {
	var firstRow=0;
	var lastRow=15;
	var firstCol=0;
	var lastCol=15;
	var geometry = Model.Game.cbBoardGeometryGrid(16,16);

	/** Move graph for the Snake */
	Model.Game.cbSnakeGraph = function(geometry,confine){
		var $this=this;
        return $this.cbSkiGraph(geometry,[[0,1],[0,-1]],1);
	}

    /** Move graph for the Snake */
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
					value: .8,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:64},{s:1,p:65},{s:1,p:66},{s:1,p:67},{s:1,p:68},{s:1,p:69},{s:1,p:70},{s:1,p:71},{s:1,p:72},{s:1,p:73},{s:1,p:74},{s:1,p:75},{s:1,p:76},{s:1,p:77},{s:1,p:78},{s:1,p:79}],
					epCatch : true,
					epTarget : true,
				},
				1: {
					name: 'ipawn-b',
					aspect: 'fr-pawn',
					graph: this.cbInitialPawnGraph(geometry,-1),
					value: .8,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:-1,p:176},{s:-1,p:177},{s:-1,p:178},{s:-1,p:179},{s:-1,p:180},{s:-1,p:181},{s:-1,p:182},{s:-1,p:183},{s:-1,p:184},{s:-1,p:185},{s:-1,p:186},{s:-1,p:187},{s:-1,p:188},{s:-1,p:189},{s:-1,p:190},{s:-1,p:191}],
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
					initial: [{s:1,p:0},{s:1,p:15},{s:-1,p:240},{s:-1,p:255}],
				},
				3: {
					name: 'mammoth',
					aspect: 'fr-mammoth',
					graph : this.cbMergeGraphs(geometry,
                  this.cbKingGraph(geometry),
                  this.cbShortRangeGraph(geometry,[
						[-2,-2],[0,-2],[-2,2],[0,2],[2,2],[2,0],
						[-2,2],[-2,0],[0,-2],[2,-2]])),
					value: 6.2,
					abbrev: 'M',
					initial: [{s:1,p:1},{s:1,p:14},{s:-1,p:241},{s:-1,p:254}],
				},
				4: {
					name: 'squirle',
					aspect: 'fr-squirle',
					graph: this.cbShortRangeGraph(geometry,[
						[-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],
						[1,-2],[2,-2],[2,-1],[2,0],[2,1],
						[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]]),
					value: 6,
					abbrev: 'SQ',
					initial: [{s:1,p:2},{s:1,p:13},{s:-1,p:242},{s:-1,p:253}],
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
					value: 8.5,
					abbrev: 'C',
					initial: [{s:1,p:3},{s:1,p:12},{s:-1,p:243},{s:-1,p:252}],
				},
				
				6: {
					name: 'ship',
					aspect: 'fr-ship',
					graph : this.cbShipGraph(geometry),
					value: 5,
					abbrev: 'S',
					initial: [{s:1,p:36},{s:1,p:43},{s:-1,p:212},{s:-1,p:219}],
				},
				7: {
					name: 'snake',
					aspect: 'fr-dragon',
					graph: this.cbSnakeGraph(geometry),
					value: 3.7,
					abbrev: 'N',
					initial: [{s:1,p:37},{s:1,p:42},{s:-1,p:213},{s:-1,p:218}],
				},

				8: {
					name: 'king',
					aspect: 'fr-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:23},{s:-1,p:231}],
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
                    value : 3.2,
                    initial: [{s:1,p:48},{s:1,p:50},{s:1,p:52},{s:1,p:54},{s:1,p:56},{s:1,p:58},{s:1,p:60},{s:1,p:62}],
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
                    value : 3.2,
                    initial: [{s:-1,p:192},{s:-1,p:194},{s:-1,p:196},{s:-1,p:198},{s:-1,p:200},{s:-1,p:202},{s:-1,p:204},{s:-1,p:206}],
                },
                11: {
                  name : 'princew',
                  abbrev : 'P',
                  aspect : 'fr-prince',
                  graph : this.cbPrinceGraph(geometry,1,confine),
                  value : 3.1,
                  initial: [{s:1,p:38},{s:1,p:41}],
                  epTarget : true,
                },
                12: {
                  name : 'princeb',
                  abbrev : 'P',
                  aspect : 'fr-prince',
                  graph : this.cbPrinceGraph(geometry,-1,confine),
                  value : 3.1,
                  initial: [{s:-1,p:214},{s:-1,p:217}],
                  epTarget : true,
                },

      			13: {
                  name : 'griffon',
                  abbrev : 'G',
                  aspect : 'fr-griffin',
                  graph : this.cbGriffonGraph(geometry),
                  value : 9,
                  initial: [{s:1,p:25},{s:-1,p:233}],
                 },
      			14: {
                  name : 'rhino',
                  abbrev : 'U',
                  aspect : 'fr-rhino',
                  graph : this.cbRhinoGraph(geometry),
                  value : 8.1,
                  initial: [{s:1,p:10},{s:-1,p:250}],
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
                  value : 17.4,
                  initial: [{s:1,p:8},{s:-1,p:248}],
                },
                16: {
                  name : 'soldierw',
                  abbrev : 'S',
                  aspect : 'fr-corporal',
                  graph : this.cbMergeGraphs(geometry,
                  this.cbInitialPawnGraph(geometry,1),
                  this.cbShortRangeGraph(geometry,[
						[-1,0],[1,0]])),
                  value : 0.9,
                  initial: [{s:1,p:49},{s:1,p:51},{s:1,p:53},{s:1,p:55},{s:1,p:57},{s:1,p:59},{s:1,p:61},{s:1,p:63}],
                  epCatch : true,
                  epTarget : true,
                },
                17: {
                  name : 'soldierb',
                  abbrev : 'S',
                  aspect : 'fr-corporal',
                  graph : this.cbMergeGraphs(geometry,
                  this.cbInitialPawnGraph(geometry,-1),
                  this.cbShortRangeGraph(geometry,[
						[-1,0],[1,0]])),
                  value : 0.9,
                  initial: [{s:-1,p:193},{s:-1,p:195},{s:-1,p:197},{s:-1,p:199},{s:-1,p:201},{s:-1,p:203},{s:-1,p:205},{s:-1,p:207}],
                  epCatch : true,
                  epTarget : true,
                  },
                18: {
                  name : 'machine',
                  abbrev : 'W',
                  aspect : 'fr-machine',
                  graph : this.cbShortRangeGraph(geometry,[[-1,0],[-2,0],[1,0],[2,0],[0,1],[0,2],[0,-1],[0,-2]],confine),
                  value : 3,
                  initial: [{s:1,p:39},{s:1,p:40},{s:-1,p:215},{s:-1,p:216}],
                  },
                19: {
                  name : 'rook',
                  abbrev : 'R',
                  aspect : 'fr-rook',
                  graph : this.cbRookGraph(geometry,confine),
                  value : 5,
                  initial: [{s:1,p:33},{s:1,p:46},{s:-1,p:209},{s:-1,p:222}],
                  },
                20: {
                  name : 'knight',
                  abbrev : 'N',
                  aspect : 'fr-knight',
                  graph : this.cbKnightGraph(geometry,confine),
                  value : 2.5,
                  initial: [{s:1,p:34},{s:1,p:45},{s:-1,p:210},{s:-1,p:221}],
                  },
                21: {
                  name : 'bishop',
                  abbrev : 'B',
                  aspect : 'fr-bishop',
                  graph : this.cbBishopGraph(geometry,confine),
                  value : 4.1,
                  initial: [{s:1,p:35},{s:1,p:44},{s:-1,p:211},{s:-1,p:220}],
                  },
                22: {
                  name : 'elephant',
                  abbrev : 'E',
                  aspect : 'fr-elephant',
                  graph : this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]],confine),
                  value : 2.8,
                  initial: [{s:1,p:32},{s:1,p:47},{s:-1,p:208},{s:-1,p:223}],
                  },
                23: {
                  name : 'centaur',
                  abbrev : 'J',
                  aspect : 'fr-crowned-knight',
     
                  graph : this.cbMergeGraphs(geometry,
                  this.cbKnightGraph(geometry,confine),
                  this.cbKingGraph(geometry,confine)),

                  value : 6.1,
                  initial: [{s:1,p:4},{s:1,p:11},{s:-1,p:244},{s:-1,p:251}],
                  },
                  24: {
                  name : 'Buffalo',
                  abbrev : 'F',
                  aspect : 'fr-buffalo',
                  graph : this.cbShortRangeGraph(geometry,[
                              [1,2],[1,3],[2,1],[2,3],[3,1],[3,2],
                              [1,-2],[1,-3],[2,-1],[2,-3],[3,-1],[3,-2],
                              [-1,-2],[-1,-3],[-2,-1],[-2,-3],[-3,-1],[-3,-2],
                              [-1,2],[-1,3],[-2,1],[-2,3],[-3,1],[-3,2]
                              ],confine),
                  value : 8.9,
                  initial: [{s:1,p:5},{s:-1,p:245}],
                  },
                  25: {
                  name : 'sorcerer',
                  abbrev : 'O',
                  aspect : 'fr-star',
                  graph : this.cbLongRangeGraph(geometry,[[0,-1],[0,1],[-1,0],[1,0],[1,1],[1,-1],[-1,-1],[-1,1]],null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE),
                  value : 7,
                  initial: [{s:1,p:6},{s:-1,p:246}],
                  },
                  26: {
                  name : 'amazon',
                  abbrev : 'A',
                  aspect : 'fr-amazon',
                  graph : this.cbMergeGraphs(geometry,
                              this.cbKnightGraph(geometry,confine),
                              this.cbQueenGraph(geometry,confine)),
                  value : 15,
                  initial: [{s:1,p:7},{s:-1,p:247}],
                  },
                  27: {
                  name : 'cannon',
                  abbrev : 'C',
                  aspect : 'fr-cannon2',
                  graph : this.cbXQCannonGraph(geometry),
                  value : 3.6,
                  initial: [{s:1,p:16},{s:1,p:31},{s:-1,p:224},{s:-1,p:239}],
                  },
                  28: {
                  name : 'camel',
                  abbrev : 'M',
                  aspect : 'fr-camel',
                  graph : this.cbShortRangeGraph(geometry,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),
                  value : 2.6,
                  initial: [{s:1,p:17},{s:1,p:30},{s:-1,p:225},{s:-1,p:238}],
                  },
                  29: {
                  name : 'giraffe',
                  abbrev : 'Z',
                  aspect : 'fr-giraffe',
                  graph : this.cbShortRangeGraph(geometry,[[-3,-2],[-3,2],[3,-2],[3,2],[2,3],[2,-3],[-2,3],[-2,-3]]),
                  value : 2.4,
                  initial: [{s:1,p:18},{s:1,p:29},{s:-1,p:226},{s:-1,p:237}],
                  epCatch : true,
                  epTarget : true,
                  },
                  30: {
                  name : 'bow',
                  abbrev : 'V',
                  aspect : 'fr-bow',
                  graph : this.cbLongRangeGraph(geometry,[[-1,-1],[1,1],[-1,1],[1,-1]],null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE),
                  value : 2.6,
                  initial: [{s:1,p:19},{s:1,p:28},{s:-1,p:227},{s:-1,p:236}],
                  },
                  31: {
                  name : 'amiral',
                  abbrev : 'S',
                  aspect : 'fr-crowned-rook',
                  graph : this.cbMergeGraphs(geometry,
                              this.cbKingGraph(geometry,confine),
                              this.cbRookGraph(geometry,confine)),
                  value : 6.8,
                  initial: [{s:1,p:20},{s:-1,p:228}],
                  },
                  32: {
                  name : 'missionnary',
                  abbrev : 'Y',
                  aspect : 'fr-crowned-bishop',
                  graph : this.cbMergeGraphs(geometry,
                              this.cbKingGraph(geometry,confine),
                              this.cbBishopGraph(geometry,confine)),
                  value : 6,
                  initial: [{s:1,p:27},{s:-1,p:235}],
                  },
                  33: {
                      name : 'cardinal',
                      abbrev : 'X',
                      aspect : 'fr-cardinal',
                      graph : this.cbMergeGraphs(geometry,
                                  this.cbKnightGraph(geometry,confine),
                                  this.cbBishopGraph(geometry,confine)),
                      value : 6.75,
                      initial: [{s:1,p:21},{s:-1,p:229}],
                  },
                  34: {
                  name : 'marshall',
                  abbrev : 'H',
                  aspect : 'fr-marshall',
                  graph : this.cbMergeGraphs(geometry,
                              this.cbKnightGraph(geometry,confine),
                              this.cbRookGraph(geometry,confine)),
                  value : 8.5,
                  initial: [{s:1,p:26},{s:-1,p:234}],
                  },
                  35: {
                  name : 'lion',
                  abbrev : 'L',
                  aspect : 'fr-lion',
                  graph : this.cbShortRangeGraph(geometry,[
                              [-1,-1],[-1,1],[1,-1],[1,1],[1,0],[0,1],[-1,0],[0,-1],
                              [-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],
                              [1,-2],[2,-2],[2,-1],[2,0],[2,1],
                              [2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]
                              ], confine),
                  value : 10,
                  initial: [{s:1,p:22},{s:-1,p:230}],
                  },
                  36: {
                  name : 'queen',
                  abbrev : 'Q',
                  aspect : 'fr-queen',
                  graph : this.cbQueenGraph(geometry,confine),
                  value : 10.5,
                  initial: [{s:1,p:24},{s:-1,p:232}],
                  },
                  37: {
                  name : 'duchess',
                  abbrev : 'D',
                  aspect : 'fr-duchess',
                  graph : this.cbMergeGraphs(geometry,
                  this.cbKingGraph(geometry,confine),
                    this.cbShortRangeGraph(geometry,[
                      [+2,0],[+3,0],[-2,0],[-3,0],[-2,0],[0,2],[0,3],[0,-2],[0,-3],[-3,-3],[-2,-2],[-3,-3],
                      [2,2],[3,3],[+2,-2],[+3,-3],[-2,+2],[-3,+3],
                        ],confine)),

                    value : 9.5,
                    initial: [{s:1,p:9},{s:-1,p:249}],
                  },
			},
            promote: function(aGame,piece,move) {
				if( ((piece.t==0) && geometry.R(move.t)==lastRow) || ((piece.t==1 ) && geometry.R(move.t)==firstRow)) 
					    return [36];
                if( ((piece.t==16) && geometry.R(move.t)==lastRow) || ((piece.t==17 ) && geometry.R(move.t)==firstRow)) 
					    return [36];
			    if (piece.t==11 && geometry.R(move.t)==lastRow)
				    return [26];
			    if (piece.t==12 && geometry.R(move.t)==firstRow)
				    return [26];
			    if ((piece.t==6) && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
				    return [13];
			    if (piece.t==7 && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
				    return [14];
			    if ((piece.t==9 ) && (geometry.R(move.t)==lastRow && piece.s > 0 && piece.p > 223))
                    return [15];
                if ((piece.t==10 ) && (geometry.R(move.t)==firstRow && piece.s < 0 && piece.p < 32))  
                    return [15];
                if ((piece.t==20 || piece.t==28 || piece.t==29) && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					return [24];
				if ((piece.t==22 || piece.t==18 || piece.t==23 || piece.t==3 || piece.t==4) && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
					return [35];
				if ((piece.t==2) && ((geometry.R(move.t)==lastRow && piece.s > 0) || (geometry.R(move.t)==firstRow && piece.s < 0)) ) 
				    return [37];
                return [];
			},
			
		};
	}

	
})();
