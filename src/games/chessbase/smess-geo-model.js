
(function() {
	
	Model.Game.cbBoardGeometrySmess = function(width,height) {
		var $this=this;
		var distance;
		
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
			if(distance!==undefined)
				return distance;
			distance={};
			for(var pos=0;pos<width*height;pos++) {
				distance[pos]={};
				distance[pos][pos]=0;				
			}
			var graphDeltas={
				0:[-1,1],1:[0,1],2:[1,1],3:[1,0],4:[1,-1],5:[0,-1],6:[-1,-1],7:[-1,0],
			}
			var modifs=true;
			while(modifs) {
				modifs=false;
				for(var pos=0;pos<width*height;pos++) {
					var deltas=[];
					for(var i=0;i<8;i++) {
						if($this.cbSmessGraph[pos] & (1<<i))
							deltas.push(graphDeltas[i]);
					}
					deltas.forEach(function(delta) {
						var pos1=Graph(pos,delta);
						if(pos1==null)
							return;
						if(distance[pos][pos1]!=1) {
							distance[pos][pos1]=1;
							modifs=true;
						} 
						for(var pos2=0;pos2<width*height;pos2++) {
							if(pos2==pos)
								continue;
							if(distance[pos][pos2]===undefined && distance[pos1][pos2]!==undefined) {
								distance[pos][pos2]=distance[pos1][pos2]+1;
								modifs=true;
							} else if(distance[pos][pos2]!==undefined && distance[pos1][pos2]!==undefined && distance[pos][pos2]>distance[pos1][pos2]+1) {
								distance[pos][pos2]=distance[pos1][pos2]+1;
								modifs=true;
							}
						}
					});

				}
			}
			return distance;
		}
		function DistPromo() {
			// for each side and position, calculate distance to promotion line
			var distPromo={	"1": {}, "-1": {} };
			var distance = GetDistances();
			["1","-1"].forEach(function(side) {
				for(var pos=0;pos<width*height;pos++) {
					var minDist=Infinity;
					for(var pos1 in $this.cbSmessPromoPoss[side]) {
						var dist=distance[pos][pos1];
						if(dist<minDist) {
							distPromo[side][pos]=dist;
							minDist=dist;
						}
					}
				}		
			});
			return distPromo;
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
			distPromo: DistPromo(),
		};
	}
	
	Model.Game.cbSmessGraph=[
	    2, 128|2|8, 128|2|8, 128|2|8, 128|2|8, 128|2|8, 128|2,
	    2|32, 2|8, 2|8|32|128, 128|2|8, 2|8|32|128, 2|16|128, 2|32,
	    2|8|32, 8|32|128, 1|4|16|64, 8|128, 1|4|16|64, 2|8|32|128, 2|32|128,
	    2|32, 2|8|32|128, 2|32|128, 1|2|4|8|16|32|64|128, 2|32|128, 128, 1|64|128,
	    4|8|16, 8, 2|8|32, 1|2|4|8|16|32|64|128, 2|8|32, 2|8|32|128, 2|32,
	    2|8|32, 2|8|32|128, 1|4|16|64, 8|128, 1|4|16|64, 2|8|128, 2|32|128,
	    2|32, 1|8|32, 2|8|32|128, 8|32|128, 2|8|32|128, 32|128, 2|32,
	    8|32, 8|32|128, 8|32|128, 8|32|128, 8|32|128, 8|32|128, 32,
	];
	
	Model.Game.cbSmessPromoPoss={
		"1": { 50:1,51:1,53:1,54:1 },
		"-1": { 1:1,2:1,4:1,5:1 },
	}
	
	Model.Game.cbSmessPieceGraph = function(geometry,longRange) {
		var $this=this;
		var flags = this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_CAPTURE;
		var graphDeltas={
			0:[-1,1],1:[0,1],2:[1,1],3:[1,0],4:[1,-1],5:[0,-1],6:[-1,-1],7:[-1,0],
		}
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			graph[pos]=[];
			var deltas=[];
			for(var i=0;i<8;i++) {
				if(this.cbSmessGraph[pos] & (1<<i))
					deltas.push(graphDeltas[i]);
			}
			deltas.forEach(function(delta) {
				var line=[];
				var pos1=geometry.Graph(pos,delta);
				while(pos1!=null) {
					line.push(pos1 | flags);
					if(!longRange)
						break;
					else
						pos1=geometry.Graph(pos1,delta);
				} 
				if(line.length>0)
					graph[pos].push($this.cbTypedArray(line));
			});
		}
		return graph;
	}

})();
