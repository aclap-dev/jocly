
(function() {
	
	Model.Game.cbBoardGeometryHex = function(boardLayout,posNames) {
		
		var posNamesInv={};
		if(!posNames)
			posNames = {};
		else for(pos in posNames)
			posNamesInv[posNames[pos]]=pos;
		
		var height=boardLayout.length;
		var width=0;
		var SHIFTMOD2,SHIFTRIGHT=false;
		var maxLength=0;
		var confine={};
		
		for(var i=0;i<boardLayout.length;i++) {
			if(boardLayout[i].length%2==1)
				boardLayout[i]+" ";
			if(boardLayout[i].length>maxLength)
				maxLength=boardLayout[i].length;
		}
		for(var i=0;i<boardLayout.length;i++)
			while(boardLayout[i].length<maxLength)
				boardLayout[i]+=" ";

		boardLayout.forEach(function(line,index) {
			if(line[0]!=' ') {
				SHIFTMOD2=(index)%2;
			}
			var length=Math.ceil(line.length/2);
			if(length>width)
				width=length;
		});
		boardLayout.forEach(function(line,index) {
			if((boardLayout.length-1-index)%2==1-SHIFTMOD2) {
				if(line[line.length-1]!=' ' || line[line.length-2]!=' ')
					SHIFTRIGHT=true;
			}
			for(var i=0;i<line.length;i+=2)
				if(line[i]!=' ' || (i+1<line.length && line[i+1]!=' ')) {
					var pos = index*width+i/2;
					confine[pos]=1;
				}
		});
		
		function Graph(pos,delta) {
			var c0=C(pos);
			var r0=R(pos);
			var c=c0,r=r0;

			for(var d=0;d<3;d++) {
				var ad=Math.abs(delta[d]);
				var si=ad==0?0:delta[d]/ad;
				for(var i=0;i<ad;i++) {
					if(r%2==SHIFTMOD2) {
						if(d==1 && si<0)
							c--;
						if(d==2 && si>0)
							c--;
					} else {
						if(d==1 && si>0)
							c++;
						if(d==2 && si<0)
							c++;
					}
					if(d==1 || d==2)
						r+=si;
					if(d==0)
						c+=si;
				}
			}
			if(c<0 || c>=width || r<0 || r>=height)
				return null;
			var pos=POS(c,r);
			if(pos in confine)
				return pos;
			else
				return null;
		}
		
		var distance={};
		for(var pos in confine) {
			distance[pos]={};
			distance[pos][pos]=0;
		}
		var steps=[[1,0,0],[0,1,0],[0,0,1],[-1,0,0],[0,-1,0],[0,0,-1]];
		var modifs=true;
		while(modifs) {
			modifs=false;
			for(var pos in confine) {
				steps.forEach(function(delta) {
					var pos1=Graph(pos,delta);
					if(pos1==null)
						return;
					if(distance[pos][pos1]!=1) {
						distance[pos][pos1]=1;
						distance[pos1][pos]=1;
						modifs=true;
					} 
					for(var pos2 in confine) {
						if(pos2==pos)
							continue;
						if(distance[pos1][pos2]===undefined && distance[pos][pos2]!==undefined) {
							distance[pos1][pos2]=distance[pos][pos2]+1;
							distance[pos2][pos1]=distance[pos][pos2]+1;
							modifs=true;
						} else if(distance[pos1][pos2]!==undefined && distance[pos][pos2]!==undefined && distance[pos1][pos2]>distance[pos][pos2]+1) {
							distance[pos1][pos2]=distance[pos][pos2]+1;
							distance[pos2][pos1]=distance[pos][pos2]+1;
							modifs=true;
						}
					}
				});
			}
		}
		
		var cornerDist=0;
		var corners={};
		
		for(var pos in confine) {
			var d2sum=0;
			for(var pos1 in confine) {
				var d=distance[pos][pos1];
				d2sum+=d*d;
			}
			if(d2sum>cornerDist) {
				corners={};
				corners[pos]=1;
				cornerDist=d2sum;
			} else if(d2sum==cornerDist)
				corners[pos]=1;
		}
		
		var distEdges={};
		var modifs=true;
		while(modifs) {
			modifs=false;
			for(var pos in confine) {
				if(pos in distEdges)
					continue;
				steps.forEach(function(delta) {
					var pos1=Graph(pos,delta);
					if(pos1==null)
						distEdges[pos]=1;
					else if(pos1 in distEdges) {
						if(!(pos in distEdges) || distEdges[pos]>distEdges[pos1]+1) {
							distEdges[pos]=distEdges[pos1]+1;
							modifs=true;
						}
					}
				});
			}
		}
		
		function C(pos) {
			return pos%width;
		}
		function R(pos) {
			return Math.floor(pos/width);
		}
		function POS(c,r) {
			return r*width+c;
		}
		function PosName(pos) {
			if(posNames[pos]!==undefined)
				return posNames[pos];
			return String.fromCharCode(("a".charCodeAt(0))+C(pos)) + (R(pos)+1);
		}
		function PosByName(str) {
			if(posNamesInv[str]!==undefined)
				return posNamesInv[str];
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
			return distance;
		}
		function CellType(col,row) {
			var cellType=boardLayout[boardLayout.length-1-row][col*2];
			if(cellType==' ')
				cellType=boardLayout[boardLayout.length-1-row][col*2+1] || ' ';
			return cellType;
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
			distEdge: distEdges,
			corners: corners,
			SHIFTMOD2: SHIFTMOD2,
			SHIFTRIGHT: SHIFTRIGHT,
			CellType: CellType,
			confine: confine,
		};
	}
	
	var CT = Model.Game.cbConstants;

	var lineDeltas=[[1,0,0],[0,1,0],[0,0,1],[-1,0,0],[0,-1,0],[0,0,-1]];
	var edgeDeltas=[[1,1,0],[0,1,1],[-1,0,1],[-1,-1,0],[0,-1,-1],[1,0,-1]];
	var knightDeltas=[[2,1,0],[1,2,0],[0,2,1],[0,1,2],[-1,0,2],[-2,0,1],[-2,-1,0],[-1,-2,0],[0,-2,-1],[0,-1,-2],[1,0,-2],[2,0,-1]];

	Model.Game.cbGLKingGraph = function(geometry) {
		return this.cbShortRangeGraph(geometry,edgeDeltas.concat(lineDeltas),geometry.confine);
	}

	Model.Game.cbGLRookGraph = function(geometry) {
		return this.cbLongRangeGraph(geometry,lineDeltas,geometry.confine);
	}

	Model.Game.cbGLBishopGraph = function(geometry) {
		return this.cbLongRangeGraph(geometry,edgeDeltas,geometry.confine);
	}

	Model.Game.cbGLQueenGraph = function(geometry) {
		return this.cbLongRangeGraph(geometry,edgeDeltas.concat(lineDeltas),geometry.confine);
	}

	Model.Game.cbGLKnightGraph = function(geometry) {
		return this.cbShortRangeGraph(geometry,knightDeltas,geometry.confine);
	}

	Model.Game.cbGLPawnGraph = function(geometry,side,range) {
		var moveGraph = this.cbLongRangeGraph(geometry,[[side,0,0]],geometry.confine,CT.FLAG_MOVE,range);
		var captDeltas = {
			'1': [[0,1,0],[0,0,-1]],
			'-1': [[0,0,1],[0,-1,0]],
		}
		var captGraph = this.cbShortRangeGraph(geometry,captDeltas[side],geometry.confine,CT.FLAG_CAPTURE);
		var graph = [];
		for(var pos=0;pos<geometry.boardSize;pos++)
			graph[pos] = moveGraph[pos].concat(captGraph[pos]); 
		return graph;
	}

	Model.Game.cbBRInitialPawnGraph = function(geometry,side) {
		var moveGraph = this.cbLongRangeGraph(geometry,[[0,-side,0],[0,0,-side]],geometry.confine,CT.FLAG_MOVE,2);
		var captGraph = this.cbShortRangeGraph(geometry,[[-side,-side,0],[side,0,-side],[0,-side,-side]],geometry.confine,CT.FLAG_CAPTURE);
		var graph = [];
		for(var pos=0;pos<geometry.boardSize;pos++)
			graph[pos] = moveGraph[pos].concat(captGraph[pos]); 
		return graph;
	}

	Model.Game.cbDVInitialPawnGraph = function(geometry,side) {
		var moveGraph = this.cbLongRangeGraph(geometry,[[0,-side,0],[0,0,-side]],geometry.confine,CT.FLAG_MOVE,2);
		var captGraph = this.cbShortRangeGraph(geometry,[[-side,-side,0],[side,0,-side]],geometry.confine,CT.FLAG_CAPTURE);
		var graph = [];
		for(var pos=0;pos<geometry.boardSize;pos++)
			graph[pos] = moveGraph[pos].concat(captGraph[pos]); 
		return graph;
	}

	Model.Game.cbBRPawnGraph = function(geometry,side) {
		var moveGraph = this.cbShortRangeGraph(geometry,[[0,-side,0],[0,0,-side]],geometry.confine,CT.FLAG_MOVE);
		var captGraph = this.cbShortRangeGraph(geometry,[[-side,-side,0],[side,0,-side]],geometry.confine,CT.FLAG_CAPTURE);
		var graph = [];
		for(var pos=0;pos<geometry.boardSize;pos++)
			graph[pos] = moveGraph[pos].concat(captGraph[pos]); 
		return graph;
	}

	Model.Game.cbMCPawnGraph = function(geometry,side,range) {
		var moveGraph = this.cbLongRangeGraph(geometry,[[side,0,0]],geometry.confine,CT.FLAG_MOVE,range);
		var captGraph = this.cbShortRangeGraph(geometry,[[side,0,-side],[side,side,0]],geometry.confine,CT.FLAG_CAPTURE);
		var graph = [];
		for(var pos=0;pos<geometry.boardSize;pos++)
			graph[pos] = moveGraph[pos].concat(captGraph[pos]); 
		return graph;
	}


	

	
})();
