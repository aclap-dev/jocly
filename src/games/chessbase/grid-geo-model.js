
(function() {
	
	Model.Game.cbBoardGeometryGrid = function(width,height) {
		function C(pos) {
			return pos%width;
		}
		function R(pos) {
			return Math.floor(pos/width);
		}
		function POS(c,r) {
			return r*width+c;
		}
		function Graph(pos,delta) {
			var c0=C(pos);
			var r0=R(pos);
			var c=c0+delta[0];
			var r=r0+delta[1];
			if(c<0 || c>=width || r<0 || r>=height)
				return null;
			return POS(c,r);
		}
		function PosName(pos) {
			 return String.fromCharCode(("a".charCodeAt(0))+C(pos)) + (R(pos)+1);
		}
		function PosByName(str) {
			var m=/^([a-z])([0-9]+)$/.exec(str);
			if(!m)
				return -1;
			var c=m[1].charCodeAt(0)-"a".charCodeAt(0);
			var r=parseInt(m[2])-1;
			return POS(c,r);
		}
		function CompactCrit(pos,index) {
			if(index==0)
				return String.fromCharCode(("a".charCodeAt(0))+C(pos));
			else if(index==1)
				return (R(pos)+1);
			else
				return null;
		}
		function GetDistances() {
			var dist=[];
			for(var pos1=0;pos1<width*height;pos1++) {
				var dist1=[];
				dist.push(dist1);
				for(var pos2=0;pos2<width*height;pos2++) {
					var r1=R(pos1), c1=C(pos1), r2=R(pos2), c2=C(pos2);
					dist1.push(Math.max(Math.abs(r1-r2),Math.abs(c1-c2)));
				}
			}
			return dist;
		}
		function DistEdges() {
			var dist=[];
			for(var pos=0;pos<width*height;pos++) {
				var c=C(pos);
				var r=R(pos);
				dist[pos]=Math.min(
					c, Math.abs(width-c-1),
					r, Math.abs(height-r-1)
				);
			}
			return dist;
		}
		function Corners() {
			var corners={};
			corners[POS(0,0)]=1;
			corners[POS(0,height-1)]=1;
			corners[POS(width-1,0)]=1;
			corners[POS(width-1,height-1)]=1;
			return corners;
		}

		function ExportBoardState(board,cbVar,moveCount) {
			var fenRows = [];
			for(var r=height-1;r>=0;r--) {
				var fenRow = "";
				var emptyCount = 0;
				for(var c=0;c<width;c++) {
					var pieceIndex = board.board[POS(c,r)];
					if(pieceIndex<0)
						emptyCount++;
					else {
						if(emptyCount>0) {
							fenRow += emptyCount;
							emptyCount = 0;
						}
						var piece = board.pieces[pieceIndex];
						var abbrev = cbVar.pieceTypes[piece.t].fenAbbrev || cbVar.pieceTypes[piece.t].abbrev || "?";
						if(piece.s==-1)
							fenRow += abbrev.toLowerCase();
						else
							fenRow += abbrev.toUpperCase();
					}
				}
				if(emptyCount)
					fenRow += emptyCount;
				fenRows.push(fenRow);
			}
			var fen = fenRows.join("/");
			fen += " ";
			if(board.mWho==1)
				fen += "w";
			else
				fen += "b";
			fen += " ";
			var castle = "";
			if(board.castled) {
				if(board.castled[1]===false)
					castle += "KQ";
				else {
					if(board.castled[1].k)
						castle+= "K";
					if(board.castled[1].q)
						castle+= "Q";
				}
				if(board.castled[-1]===false)
					castle += "kq";
				else {
					if(board.castled[-1].k)
						castle+= "k";
					if(board.castled[-1].q)
						castle+= "q";
				}
			}
			if(castle.length==0)
				castle = "-";
			fen += castle;
			fen += " ";
			if(!board.epTarget)
				fen += "-";
			else
				fen += PosName(board.epTarget.p);
			fen += " ";
			fen += board.noCaptCount;
			fen += " ";
			fen += Math.floor(moveCount/2)+1;
			return fen;
		}
		
		return {
			boardSize: width*height,
			width: width,
			height: height,
			C: C,
			R: R,
			POS: POS,
			Graph: Graph, 
			PosName: PosName,
			PosByName: PosByName,
			CompactCrit: CompactCrit,
			GetDistances: GetDistances,
			distEdge: DistEdges(),
			corners: Corners(),
			ExportBoardState: ExportBoardState
		};
	}

	/*
 	Piece graph: [ directions ]
 	Direction: [ Targets ]
 	Target: <position> | <flags bitmask>
 	<position>: 0xffff (invalid) or next position
	*/
	
	Model.Game.cbPawnGraph = function(geometry,side,confine) {
		var $this=this;
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			if(confine && !(pos in confine)){
				graph[pos]=[];
				continue;
			}
			var directions=[];
			var pos1=geometry.Graph(pos,[0,side]);
			if(pos1!=null && (!confine || (pos1 in confine)))
				directions.push($this.cbTypedArray([pos1 | $this.cbConstants.FLAG_MOVE]));
			[-1,1].forEach(function(dc) {
				var pos2=geometry.Graph(pos,[dc,side]);
				if(pos2!=null && (!confine || (pos2 in confine)))
					directions.push($this.cbTypedArray([pos2 | $this.cbConstants.FLAG_CAPTURE]));				
			});
			graph[pos]=directions;
		}
		return graph;
	}
		
	Model.Game.cbInitialPawnGraph = function(geometry,side,confine) {
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
					directions.push($this.cbTypedArray([pos2 | $this.cbConstants.FLAG_CAPTURE]));				
			});
			graph[pos]=directions;
		}
		return graph;
	}

	Model.Game.cbKingGraph = function(geometry,confine) {
		return this.cbShortRangeGraph(geometry,[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],confine);
	}

	Model.Game.cbKnightGraph = function(geometry,confine) {
		return this.cbShortRangeGraph(geometry,[[2,-1],[2,1],[-2,-1],[-2,1],[-1,2],[-1,-2],[1,2],[1,-2]],confine);
	}

	Model.Game.cbHorseGraph = function(geometry) {
		var $this=this;
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			graph[pos]=[];
			[[1,0,2,-1],[1,0,2,1],[-1,0,-2,-1],[-1,0,-2,1],[0,1,-1,2],[0,-1,-1,-2],[0,1,1,2],[0,-1,1,-2]].forEach(function(desc) {
				var pos1=geometry.Graph(pos,[desc[0],desc[1]]);
				if(pos1!=null) {
					var pos2=geometry.Graph(pos,[desc[2],desc[3]]);
					if(pos2!=null)
						graph[pos].push($this.cbTypedArray([pos1 | $this.cbConstants.FLAG_STOP, pos2 | $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE]));
				}
			});
		}
		return graph;
	}

	
	Model.Game.cbRookGraph = function(geometry,confine) {
		return this.cbLongRangeGraph(geometry,[[0,-1],[0,1],[-1,0],[1,0]],confine);
	}
	
	Model.Game.cbBishopGraph = function(geometry,confine) {
		return this.cbLongRangeGraph(geometry,[[1,-1],[1,1],[-1,1],[-1,-1]],confine);
	}
	
	Model.Game.cbQueenGraph = function(geometry,confine) {
		return this.cbLongRangeGraph(geometry,[[0,-1],[0,1],[-1,0],[1,0],[1,-1],[1,1],[-1,1],[-1,-1]],confine);
	}

	Model.Game.cbXQGeneralGraph = function(geometry,confine) {
		var $this=this;
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			graph[pos]=[];
			[[-1,0,false],[0,-1,true],[0,1,true],[1,0,false]].forEach(function(delta) {
				var direction=[];
				var pos1=geometry.Graph(pos,delta);
				if(pos1!=null) {
					if(!confine || (pos1 in confine))
					direction.push(pos1 | $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE);
					if(delta[2]) {
						var pos2=geometry.Graph(pos1,delta);
						while(pos2!=null) {
							if(!confine || (pos2 in confine))
								direction.push(pos2 | $this.cbConstants.FLAG_CAPTURE | $this.cbConstants.FLAG_CAPTURE_KING);
							else
								direction.push(pos2 | $this.cbConstants.FLAG_STOP);
							pos2=geometry.Graph(pos2,delta);
						}
					}
				}
				if(direction.length>0)
					graph[pos].push($this.cbTypedArray(direction));
			});
		}
		return graph;
	}
	
	Model.Game.cbXQSoldierGraph = function(geometry,side) {
		return this.cbShortRangeGraph(geometry,[[0,side]]);
	}

	Model.Game.cbXQPromoSoldierGraph = function(geometry,side) {
		return this.cbShortRangeGraph(geometry,[[0,side],[-1,0],[1,0]]);
	}

	Model.Game.cbXQAdvisorGraph = function(geometry,confine) {
		return this.cbShortRangeGraph(geometry,[[1,1],[-1,1],[1,-1],[-1,-1]],confine);
	}

	Model.Game.cbXQCannonGraph = function(geometry) {
		return this.cbLongRangeGraph(geometry,[[0,-1],[0,1],[-1,0],[1,0]],null,this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_SCREEN_CAPTURE);
	}
	
	Model.Game.cbXQElephantGraph = function(geometry,confine) {
		var $this=this;
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			graph[pos]=[];
			if(confine && !(pos in confine))
				continue;
			[[1,1,2,2],[1,-1,2,-2],[-1,1,-2,2],[-1,-1,-2,-2]].forEach(function(desc) {
				var pos1=geometry.Graph(pos,[desc[0],desc[1]]);
				if(pos1!=null) {
					var pos2=geometry.Graph(pos,[desc[2],desc[3]]);
					if(pos2!=null && (!confine || (pos2 in confine)))
						graph[pos].push($this.cbTypedArray([pos1 | $this.cbConstants.FLAG_STOP, pos2 | $this.cbConstants.FLAG_MOVE | $this.cbConstants.FLAG_CAPTURE]));
				}
			});
		}
		return graph;
	}
	
	Model.Game.cbSilverGraph = function(geometry,side) {
		return this.cbShortRangeGraph(geometry,[[0,side],[-1,-1],[-1,1],[1,-1],[1,1]]);
	}
	
	Model.Game.cbFersGraph = function(geometry,side) {
		return this.cbShortRangeGraph(geometry,[[-1,-1],[-1,1],[1,-1],[1,1]]);
	}	

	Model.Game.cbSchleichGraph = function(geometry,side) {
		return this.cbShortRangeGraph(geometry,[[-1,0],[1,0],[0,-1],[0,1]]);
	}	
	
	Model.Game.cbAlfilGraph = function(geometry,side) {
		return this.cbShortRangeGraph(geometry,[[-2,-2],[-2,2],[2,2],[2,-2]]);
	}	

})();
