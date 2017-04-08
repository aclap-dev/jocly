Model.Game.CheckersDirections = 8;
Model.Game.Checkers2WaysDirections = [ 0,1,2,3,3,2,1,0 ]; 

Model.Game.BuildGraphCoord = function() {
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;

	var g=[];
	var coord=[];
	for(var r=0;r<HEIGHT;r++) {
		for(var c=0;c<WIDTH;c++) {
			var pos=r*WIDTH+c;
			coord[pos]=[r,c];
			g[pos]=[];
			for(var h=-1;h<2;h++)
				for(var v=-1;v<2;v++) {
					if(h!=0 || v!=0)
						if(r+h<HEIGHT && r+h>=0 && c+v<WIDTH && c+v>=0 && Math.abs(h)!=Math.abs(v))
							g[pos].push((r+h)*WIDTH+c+v);
						else
							g[pos].push(null);
				}
		}
	}
	this.g.Graph=g;
	this.g.Coord=coord;
}
