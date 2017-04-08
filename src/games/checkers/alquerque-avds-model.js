Model.Game.CheckersDirections = 8;
Model.Game.Checkers2WaysDirections = [ 0,0,1,1,2,3,3,2 ]; 

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
			if(r>0)
				g[pos].push((r-1)*WIDTH+c);
			else
				g[pos].push(null);
			if(r<HEIGHT-1)
				g[pos].push((r+1)*WIDTH+c);
			else
				g[pos].push(null);
			if(c>0)
				g[pos].push(r*WIDTH+c-1);
			else
				g[pos].push(null);
			if(c<WIDTH-1)
				g[pos].push(r*WIDTH+c+1);
			else
				g[pos].push(null);
			if((r%2)==(c%2)) {
				for(var h=-1;h<2;h+=2)
					for(var v=-1;v<2;v+=2) {
						if(r+h<HEIGHT && r+h>=0 && c+v<WIDTH && c+v>=0)
							g[pos].push((r+h)*WIDTH+c+v);
						else
							g[pos].push(null);
					}
			} else {
				g[pos].push(null);
				g[pos].push(null);
				g[pos].push(null);
				g[pos].push(null);
			}
		}
	}
	this.g.Graph=g;
	this.g.Coord=coord;
	
	this.g.compulsoryCatch=false;
}
