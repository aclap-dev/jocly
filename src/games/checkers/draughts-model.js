
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
			if(r%2==0) {
				if(r<HEIGHT-1) {
					g[pos].push((r+1)*WIDTH+c);
					if(c>0)
						g[pos].push((r+1)*WIDTH+c-1);
					else
						g[pos].push(null);
				} else {
					g[pos].push(null);
					g[pos].push(null);
				}
				if(r>0) {
					g[pos].push((r-1)*WIDTH+c);
					if(c>0)
						g[pos].push((r-1)*WIDTH+c-1);
					else
						g[pos].push(null);
				} else {
					g[pos].push(null);
					g[pos].push(null);
				}
			} else {
				if(r<HEIGHT-1) {
					if(c<WIDTH-1)
						g[pos].push((r+1)*WIDTH+c+1);
					else
						g[pos].push(null);
					g[pos].push((r+1)*WIDTH+c);
				} else {
					g[pos].push(null);
					g[pos].push(null);
				}
				if(r>0) {
					if(c<WIDTH-1)
						g[pos].push((r-1)*WIDTH+c+1);
					else
						g[pos].push(null);
					g[pos].push((r-1)*WIDTH+c);
				} else {
					g[pos].push(null);
					g[pos].push(null);
				}
			}
		}
	}
	this.g.Graph=g;
	this.g.Coord=coord;
}

