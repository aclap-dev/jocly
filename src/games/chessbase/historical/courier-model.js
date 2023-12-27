
(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(12,8);
	
	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'cc-pawn',
					graph: this.cbPawnGraph(geometry,1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					//initial: [{s:1,p:12},{s:1,p:13},{s:1,p:14},{s:1,p:15},{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19},{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:23},],
					initial: [{s:1,p:36},{s:1,p:13},{s:1,p:14},{s:1,p:15},{s:1,p:16},{s:1,p:17},{s:1,p:42},{s:1,p:19},{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:47},],
					epCatch: true,
				},
				
				1: {
					name: 'pawn-b',
					aspect: 'cc-pawn',
					graph: this.cbPawnGraph(geometry,-1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					//initial: [{s:-1,p:72},{s:-1,p:73},{s:-1,p:74},{s:-1,p:75},{s:-1,p:76},{s:-1,p:77},{s:-1,p:78},{s:-1,p:79},{s:-1,p:80},{s:-1,p:81},{s:-1,p:82},{s:-1,p:83}],
					initial: [{s:-1,p:48},{s:-1,p:73},{s:-1,p:74},{s:-1,p:75},{s:-1,p:76},{s:-1,p:77},{s:-1,p:54},{s:-1,p:79},{s:-1,p:80},{s:-1,p:81},{s:-1,p:82},{s:-1,p:59}],
					epCatch: true,
				},

				2: {
					name: 'cc-knight',
					graph: this.cbKnightGraph(geometry),
					value: 3,
					abbrev: 'N',
					initial: [{s:1,p:1},{s:1,p:10},{s:-1,p:85},{s:-1,p:94}],
				},
				
				3: {
					name: 'cc-archer',
					graph: this.cbAlfilGraph(geometry),
					value: 2,
					abbrev: 'B',
					initial: [{s:1,p:2},{s:1,p:9},{s:-1,p:86},{s:-1,p:93}],
				},

				4: {
					name: 'cc-rook',
					graph: this.cbRookGraph(geometry),
					value: 5,
					abbrev: 'R',
					initial: [{s:1,p:0},{s:1,p:11},{s:-1,p:84},{s:-1,p:95}],
					castle: true,
				},

				5: {
					name: 'cc-queen',
					graph: this.cbFersGraph(geometry),
					value: 2,
					abbrev: 'Q',
					//initial: [{s:1,p:6},{s:-1,p:90}],
					initial: [{s:1,p:30},{s:-1,p:66}],
				},
				
				6: {
					name: 'cc-king',
					isKing: true,
					graph: this.cbKingGraph(geometry),
					abbrev: 'K',
					initial: [{s:1,p:5},{s:-1,p:89}],
				},
				
				7: {
					name: 'cc-man',
					graph: this.cbKingGraph(geometry),
					value: 3,
					abbrev: 'M',
					initial: [{s:1,p:4},{s:-1,p:88}],
				},
				
				8: {
					name: 'cc-schleich',
					graph: this.cbSchleichGraph(geometry),
					value: 2,
					abbrev: 'S',
					initial: [{s:1,p:7},{s:-1,p:91}],
				},

				9: {
					name: 'cc-courier',
					graph: this.cbBishopGraph(geometry),
					value: 3,
					abbrev: 'C',
					initial: [{s:1,p:3},{s:1,p:8},{s:-1,p:87},{s:-1,p:92}],
				},
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==0 && geometry.R(move.t)==7)
					return [5];
				else if(piece.t==1 && geometry.R(move.t)==0)
					return [5];
				return [];
			},

			castle: {
			},
			
			evaluate: function(aGame,evalValues,material) {
				// check 50 moves without capture
				if(this.noCaptCount>=100) {
					this.mFinished=true;
					this.mWinner=JocGame.DRAW;					
				}				
			},
			
		};
	}
	
})();