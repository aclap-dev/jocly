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
	var lastRow=10;	
	var firstCol=0;
	var lastCol=10;	
	
	var geometry = Model.Game.cbBoardGeometryGrid(11,11);
	
	// graphs
	
	
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
            fenAbbrev : 'P',
            aspect : 'fr-pawn',
            graph : this.cbInitialPawnGraph(geometry,1,confine),
            value : 0.6,
            initial: [{s:1,p:22},{s:1,p:23},{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:28},{s:1,p:29},{s:1,p:30},{s:1,p:31},{s:1,p:32}],
            epTarget : true,
            },

            1: {
            name : 'ipawnb',
            abbrev : '',
            fenAbbrev : 'P',
            aspect : 'fr-pawn',
            graph : this.cbInitialPawnGraph(geometry,-1,confine),
            value : 0.6,
            initial: [{s:-1,p:88},{s:-1,p:89},{s:-1,p:90},{s:-1,p:91},{s:-1,p:92},{s:-1,p:93},{s:-1,p:94},{s:-1,p:95},{s:-1,p:96},{s:-1,p:97},{s:-1,p:98}],
            epTarget : true,
            },

            2: {
            name : 'pawnw',
            abbrev : '',
            fenAbbrev : 'P',
            aspect : 'fr-pawn',
            graph : this.cbPawnGraph(geometry,1,confine),
            value : 0.6,
            initial: [],
            epCatch : true,
            },

            3: {
            name : 'pawnb',
            abbrev : '',
            fenAbbrev : 'P',
            aspect : 'fr-pawn',
            graph : this.cbPawnGraph(geometry,-1,confine),
            value : 0.6,
            initial: [],
            epCatch : true,
            },

            4: {
            name : 'rook',
            abbrev : 'R',
            aspect : 'fr-rook',
            graph : this.cbRookGraph(geometry,confine),
            value : 5,
            initial: [{s:1,p:11},{s:1,p:21},{s:-1,p:99},{s:-1,p:109}],
            },

            5: {
            name : 'bishop',
            abbrev : 'B',
            aspect : 'fr-bishop',
            graph : this.cbBishopGraph(geometry,confine),
            value : 3.4,
            initial: [{s:1,p:13},{s:1,p:19},{s:-1,p:101},{s:-1,p:107}],
            },

            6: {
            name : 'knight',
            abbrev : 'N',
            aspect : 'fr-knight',
            graph : this.cbKnightGraph(geometry,confine),
            value : 2.5,
            initial: [{s:1,p:12},{s:1,p:20},{s:-1,p:100},{s:-1,p:108}],
            },

            7: {
            name : 'queen',
            abbrev : 'Q',
            aspect : 'fr-queen',
            graph : this.cbQueenGraph(geometry,confine),
            value : 8.2,
            initial: [{s:1,p:15},{s:1,p:17},{s:-1,p:103},{s:-1,p:105}],
            },

            8: {
            name : 'king',
            abbrev : 'K',
            aspect : 'fr-king',
            graph : this.cbKingGraph(geometry,confine),
            isKing : true,
            initial: [{s:1,p:16},{s:-1,p:104}],
            },

            9: {
            name : 'elephant',
            abbrev : 'E',
            aspect : 'fr-elephant',
            graph : this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]],confine),
            value : 2.5,
            initial: [{s:1,p:0},{s:1,p:10},{s:-1,p:110},{s:-1,p:120}],
            },

            10: {
            name : 'cannon',
            abbrev : 'C',
            aspect : 'fr-cannon2',
            graph : this.cbXQCannonGraph(geometry),
            value : 4.9,
            initial: [{s:1,p:4},{s:1,p:6},{s:-1,p:114},{s:-1,p:116}],
            },

            11: {
            name : 'gryphon',
            abbrev : 'G',
            aspect : 'fr-griffon',
            graph : this.cbEagleGraph(geometry),
            value : 7.7,
            initial: [{s:1,p:14},{s:1,p:18},{s:-1,p:102},{s:-1,p:106}],
            },

            12: {
            name : 'camel',
            abbrev : 'J',
            aspect : 'fr-camel',
            graph : this.cbShortRangeGraph(geometry,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),
            value : 2.2,
            initial: [{s:1,p:2},{s:1,p:8},{s:-1,p:112},{s:-1,p:118}],
            },
					
		}
		
		// defining types for readable promo cases
		var T_ipawnw=0
        var T_ipawnb=1
        var T_pawnw=2
        var T_pawnb=3
        var T_rook=4
        var T_bishop=5
        var T_knight=6
        var T_queen=7
        var T_king=8
        var T_elephant=9
        var T_cannon=10
        var T_gryphon=11
        var T_camel=12

		return {
			
			geometry: geometry,
			
			pieceTypes: piecesTypes,

			promote: function(aGame,piece,move) {
				// initial pawns promote to pawn
				if (piece.t==T_ipawnw)
					return [T_pawnw];
				if (piece.t==T_ipawnb)
					return [T_pawnb];
				// pawns promote to Queen
				if( ((piece.t==T_pawnw) && geometry.R(move.t)==lastRow) || ((piece.t==T_pawnb) && geometry.R(move.t)==firstRow)) 
					return [T_gryphon,T_queen];
				return [];
			},			
		};
	}
	
})();
