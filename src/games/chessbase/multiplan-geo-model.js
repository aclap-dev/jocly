
(function() {
	
	Model.Game.cbBoardGeometryMultiplan = function(width,height,floors) {
		function C(pos) {
			return pos%width;
		}
		function R(pos) {
			return Math.floor((pos%(width*height))/width);
		}
		function F(pos) {
			return Math.floor(pos/(width*height));
		}
		function POS(c,r,f) {
			return f*width*height+r*width+c;
		}
		function Graph(pos,delta) {
			var c0=C(pos);
			var r0=R(pos);
			var f0=F(pos);
			var c=c0+delta[0];
			var r=r0+delta[1];
			var f=f0+delta[2];
			if(c<0 || c>=width || r<0 || r>=height || f<0 || f>=floors)
				return null;
			return POS(c,r,f);
		}
		function PosName(pos) {
			 return ""+String.fromCharCode(("A".charCodeAt(0))+F(pos))+String.fromCharCode(("a".charCodeAt(0))+C(pos)) + (R(pos)+1);
		}
		function PosByName(str) {
			var m=/^([A-Z]+)([a-z])([0-9]+)$/.exec(str);
			if(!m)
				return -1;
			var f=m[1].charCodeAt(0)-"A".charCodeAt(0);
			var c=m[2].charCodeAt(0)-"a".charCodeAt(0);
			var r=parseInt(m[3])-1;
			return POS(c,r,f);
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
			for(var pos1=0;pos1<width*height*floors;pos1++) {
				var dist1=[];
				dist.push(dist1);
				for(var pos2=0;pos2<width*height*floors;pos2++) {
					var r1=R(pos1), c1=C(pos1), f1=F(pos1), r2=R(pos2), c2=C(pos2), f2=F(pos2);
					dist1.push(Math.max(Math.abs(r1-r2),Math.abs(c1-c2),Math.abs(f1-f2)));
				}
			}
			return dist;
		}
		function DistEdges() {
			var dist=[];
			for(var pos=0;pos<width*height*floors;pos++) {
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
			corners[POS(0,0,0)]=1;
			corners[POS(0,height-1,0)]=1;
			corners[POS(width-1,0,0)]=1;
			corners[POS(width-1,height-1,0)]=1;
			corners[POS(0,0,floors-1)]=1;
			corners[POS(0,height-1,floors-1)]=1;
			corners[POS(width-1,0,floors-1)]=1;
			corners[POS(width-1,height-1,floors-1)]=1;
			return corners;
		}
		function FenRowPos(rowIndex,colIndex) {
			var floor = floors - 1 - Math.floor(rowIndex/height);
			var row = height - 1 - rowIndex % height;
			return POS(colIndex,row,floor);
		}
		
		return {
			boardSize: width*height*floors,
			width: width,
			height: height,
			floors: floors,
			fenHeight: height * floors,
			C: C,
			R: R,
			F: F,
			POS: POS,
			Graph: Graph, 
			PosName: PosName,
			PosByName: PosByName,
			CompactCrit: CompactCrit,
			GetDistances: GetDistances,
			distEdge: DistEdges(),
			corners: Corners(),
			FenRowPos: FenRowPos,
		};
	}
	
	var CT = Model.Game.cbConstants;
	
	var rsRookDeltas = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
	var rsBishopDeltas = [[1,1,0],[1,-1,0],[-1,1,0],[-1,-1,0],[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,0,-1],[-1,0,-1],[0,1,-1],[0,-1,-1]];
	var rsUnicornDeltas = [[1,1,1],[1,-1,1],[-1,1,1],[-1,-1,1],[1,1,-1],[1,-1,-1],[-1,1,-1],[-1,-1,-1]];
	var rsKnightDeltas = [[2,1,0],[2,-1,0],[-2,1,0],[-2,-1,0],[1,2,0],[-1,2,0],[1,-2,0],[-1,-2,0],
	                      [2,0,1],[2,0,-1],[-2,0,1],[-2,0,-1],[1,0,2],[-1,0,2],[1,0,-2],[-1,0,-2],
	                      [0,1,2],[0,-1,2],[0,1,-2],[0,-1,-2],[0,2,1],[0,2,-1],[0,-2,1],[0,-2,-1],
	];

	
	
	Model.Game.cbRSKingGraph = function(geometry) {
		return this.cbShortRangeGraph(geometry,rsRookDeltas.concat(rsUnicornDeltas,rsBishopDeltas));
	}

	Model.Game.cbRSQueenGraph = function(geometry) {
		return this.cbLongRangeGraph(geometry,rsRookDeltas.concat(rsUnicornDeltas,rsBishopDeltas));
	}

	Model.Game.cbRSKnightGraph = function(geometry) {
		return this.cbShortRangeGraph(geometry,rsKnightDeltas);
	}

	Model.Game.cbRSRookGraph = function(geometry) {
		return this.cbLongRangeGraph(geometry,rsRookDeltas);
	}

	Model.Game.cbRSBishopGraph = function(geometry) {
		return this.cbLongRangeGraph(geometry,rsBishopDeltas);
	}

	Model.Game.cbRSUnicornGraph = function(geometry) {
		return this.cbLongRangeGraph(geometry,rsUnicornDeltas);
	}

	Model.Game.cbRSPawnGraph = function(geometry,side) {
		var moveGraph = this.cbShortRangeGraph(geometry,[[0,side,0],[0,0,side]],null,CT.FLAG_MOVE);
		var captGraph = this.cbShortRangeGraph(geometry,[[side,side,0],[-side,side,0],[0,side,side],[-side,0,side],[side,0,side]],null,CT.FLAG_CAPTURE);
		var graph = [];
		for(var pos=0;pos<geometry.boardSize;pos++)
			graph[pos] = moveGraph[pos].concat(captGraph[pos]); 
		return graph;
	}

	Model.Game.cb3DPawnGraph = function(geometry,side,range) {
		var moveGraph = this.cbLongRangeGraph(geometry,[[0,side,0]],null,CT.FLAG_MOVE,range);
		var captGraph = this.cbLongRangeGraph(geometry,[[1,side,0],[-1,side,0],[0,side,1],[0,side,-1]],null,CT.FLAG_CAPTURE,1);
		return this.cbMergeGraphs(geometry,moveGraph,captGraph);
	}

	Model.Game.cb3DKingGraph = function(geometry) {
		var moveGraph = this.cbLongRangeGraph(geometry,[[1,-1,0],[1,0,0],[1,1,0],[0,1,0],[0,-1,0],[-1,-1,0],[-1,0,0],[-1,1,0]],null,CT.FLAG_MOVE|CT.FLAG_CAPTURE,1);
		var captGraph = this.cbLongRangeGraph(geometry,[[0,0,-1],[0,1,-1],[0,-1,-1],[1,0,-1],[-1,0,-1],
		                                                [0,0,1],[0,1,1],[0,-1,1],[1,0,1],[-1,0,1]],null,CT.FLAG_CAPTURE,1);
		return this.cbMergeGraphs(geometry,moveGraph,captGraph);
	}
	
})();
