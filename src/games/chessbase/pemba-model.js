
(function() {

	var firstRow=0;
	var lastRow=11;
	var firstCol=0;
	var lastCol=11;

	var geometry = Model.Game.cbBoardGeometryGrid(10,10);

	// graphs

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
      value : 0.6,
      initial: [{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:23},{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:28},{s:1,p:29}],
      epCatch : true,
      epTarget : true,
      },

      1: {
      name : 'ipawnb',
      abbrev : '',
      fenAbbrev: 'P',
      aspect : 'fr-pawn',
      graph : this.cbInitialPawnGraph(geometry,-1,confine),
      value : 0.6,
      initial: [{s:-1,p:70},{s:-1,p:71},{s:-1,p:72},{s:-1,p:73},{s:-1,p:74},{s:-1,p:75},{s:-1,p:76},{s:-1,p:77},{s:-1,p:78},{s:-1,p:79}],
      epCatch : true,
      epTarget : true,
      },
   2: {
      name : 'knight',
      abbrev : 'N',
      aspect : 'fr-knight',
      graph : this.cbKnightGraph(geometry,confine),
      value : 2.5,
      initial: [{s:1,p:12},{s:1,p:17},{s:-1,p:82},{s:-1,p:87}],
      },
      3: {
      name : 'bishop',
      abbrev : 'B',
      aspect : 'fr-bishop',
      graph : this.cbBishopGraph(geometry,confine),
      value : 3.4,
      initial: [{s:1,p:13},{s:1,p:16},{s:-1,p:83},{s:-1,p:86}],
      },
      4: {
      name : 'rook',
      abbrev : 'R',
      aspect : 'fr-rook',
      graph : this.cbRookGraph(geometry,confine),
      value : 5,
      initial: [{s:1,p:11},{s:1,p:18},{s:-1,p:81},{s:-1,p:88}],
      },
        
      5: {
      name : 'queen',
      abbrev : 'Q',
      aspect : 'fr-queen',
      graph : this.cbQueenGraph(geometry,confine),
      value : 8.2,
      initial: [{s:1,p:14},{s:-1,p:84}],
      },
      6: {
      name : 'king',
      abbrev : 'K',
      aspect : 'fr-king',
      graph : this.cbKingGraph(geometry,confine),
      isKing : true,
      initial: [{s:1,p:15},{s:-1,p:85}],
      },
      7: {
      name : 'elephant',
      abbrev : 'E',
      aspect : 'fr-elephant',
      graph : this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]],confine),
      value : 2.5,
      initial: [{s:1,p:10},{s:1,p:19},{s:-1,p:80},{s:-1,p:89}],
      },
      8: {
      name : 'cannon',
      abbrev : 'C',
      aspect : 'fr-cannon2',
      graph : this.cbXQCannonGraph(geometry),
      value : 4.9,
      initial: [{s:1,p:0},{s:1,p:9},{s:-1,p:90},{s:-1,p:99}],
      },
      9: {
      name : 'bow',
      abbrev : 'W',
      aspect : 'fr-bow',
      graph : this.cbLongRangeGraph(geometry,[[-1,-1],[1,1],[-1,1],[1,-1]],null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE),
      value : 3.3,
      initial: [{s:1,p:2},{s:1,p:7},{s:-1,p:92},{s:-1,p:97}],
      },
      10: {
      name : 'camel',
      abbrev : 'J',
      aspect : 'fr-camel',
      graph : this.cbShortRangeGraph(geometry,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),
      value : 2,
      initial: [{s:1,p:1},{s:1,p:8},{s:-1,p:91},{s:-1,p:98}],
      },
      11: {
      name : 'machine',
      abbrev : 'D',
      aspect : 'fr-machine',
      graph : this.cbShortRangeGraph(geometry,[[-1,0],[-2,0],[1,0],[2,0],[0,1],[0,2],[0,-1],[0,-2]],confine),
      value : 2.4,
      initial: [{s:1,p:4},{s:1,p:5},{s:-1,p:94},{s:-1,p:95}],
      },

      12: {
      name : 'giraffe',
      abbrev : 'Z',
      aspect : 'fr-giraffe',
      graph : this.cbShortRangeGraph(geometry,[[-3,-2],[-3,2],[3,-2],[3,2],[2,3],[2,-3],[-2,3],[-2,-3]]),
      value : 3,
      initial: [{s:1,p:3},{s:1,p:6},{s:-1,p:93},{s:-1,p:96}],
      },

		}

		// defining types for readable promo cases
		var T_ipawnw=0
        var T_ipawnb=1

        var T_queen=5

		return {
			
			geometry: geometry,
			
			pieceTypes: piecesTypes,

			promote: function(aGame,piece,move) {
				// initial pawns go up to last row where it promotes to Queen
				if( ((piece.t==T_ipawnw ) && geometry.R(move.t)==lastRow) || ((piece.t==T_ipawnb ) && geometry.R(move.t)==firstRow)) 
					return [T_queen];
				return [];
			},					
		};
	}

})();


