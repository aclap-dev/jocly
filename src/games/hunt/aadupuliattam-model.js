/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

Model.Game.InitGame = function() {
	var $this=this;
	this.HuntInitGame();
	Object.assign(this.g.huntOptions,{
		compulsaryCatch: true,
		catchLongestLine: false,
		multipleCatch: false,
	});
	Object.assign(this.g.huntEval,{
	});
	
	function Connect(pos0,pos1,dir0,dir1) {
		$this.g.Graph[pos0][dir0]=pos1;
		$this.g.Graph[pos1][dir1]=pos0;		
	}
	
	var ratio=(2*5.3)/3.8;
	var a=3.8*ratio, b=1.7*ratio, c=0.6*ratio, d=5, e=0.3;
	var alpha=Math.atan(d/a);
	var beta=Math.atan(Math.tan(alpha)/3);
	
	//considering a 6x6 grid
	var rectHeight=2;
	var rectWidth=6;
	
	var bottomLineY=5;
	var topPoint=[0,rectWidth/2];
	var bottomP0=[bottomLineY,0];
	var bottomP1=[bottomLineY,rectWidth/3];
	var bottomP2=[bottomLineY,2*rectWidth/3];
	var bottomP3=[bottomLineY,rectWidth];
	
	function InstersectLine(p1,p2,line){
		var a=(p1[1]-p2[1])/(p1[0]-p2[0]);
		var b=p1[1]-a*p1[0];
		return [line,a*line+b];
	}

	var points=[];
	points.push(topPoint);
	points.push([2,0.5]);
	points.push(InstersectLine(topPoint,bottomP0,2));
	points.push(InstersectLine(topPoint,bottomP1,2));
	points.push(InstersectLine(topPoint,bottomP2,2));
	points.push(InstersectLine(topPoint,bottomP3,2));
	points.push([2,rectWidth-0.5]);
	points.push([3,0]);
	points.push(InstersectLine(topPoint,bottomP0,3));
	points.push(InstersectLine(topPoint,bottomP1,3));
	points.push(InstersectLine(topPoint,bottomP2,3));
	points.push(InstersectLine(topPoint,bottomP3,3));
	points.push([3,rectWidth]);
	points.push([4,-0.5]);
	points.push(InstersectLine(topPoint,bottomP0,4));
	points.push(InstersectLine(topPoint,bottomP1,4));
	points.push(InstersectLine(topPoint,bottomP2,4));
	points.push(InstersectLine(topPoint,bottomP3,4));
	points.push([4,rectWidth+0.5]);
	points.push(bottomP0);
	points.push(bottomP1);
	points.push(bottomP2);
	points.push(bottomP3);

		
/*	   var points=[
	 	    [0,d],
	        [a,0],
	        [a,2*d],
	        [b,d-b*Math.tan(alpha)],
	        [b+c,d-(b+c)*Math.tan(alpha)],
	        [b+2*c,d-(b+2*c)*Math.tan(alpha)],
	        [b,d+b*Math.tan(alpha)],
	        [b+c,d+(b+c)*Math.tan(alpha)],
	        [b+2*c,d+(b+2*c)*Math.tan(alpha)],
	        [b,d-b*Math.sin(beta)],
	        [b+c,d-(b+c)*Math.sin(beta)],
	        [b+2*c,d-(b+2*c)*Math.sin(beta)],
	        [b,d+b*Math.sin(beta)],
	        [b+c,d+(b+c)*Math.sin(beta)],
	        [b+2*c,d+(b+2*c)*Math.sin(beta)],
	        [b,-e],
	        [b+c,-e],
	        [b+2*c,-e],
	        [b,2*d+e],
	        [b+c,2*d+e],
	        [b+2*c,2*d+e],
	        [a,d-a*Math.tan(beta)],
	        [a,d+a*Math.tan(beta)],
	    ];*/
	
	for(var i in points) {
		var point=points[i];
		this.g.Graph.push([]);
		this.g.RC.push(point);
	}
	
	Connect(1,2,1,0);
	Connect(2,3,1,0);
	Connect(3,4,1,0);
	Connect(4,5,1,0);
	Connect(5,6,1,0);
	Connect(7,8,1,0);
	Connect(8,9,1,0);
	Connect(9,10,1,0);
	Connect(10,11,1,0);
	Connect(11,12,1,0);
	Connect(13,14,1,0);
	Connect(14,15,1,0);
	Connect(15,16,1,0);
	Connect(16,17,1,0);
	Connect(17,18,1,0);
	Connect(19,20,1,0);
	Connect(20,21,1,0);
	Connect(21,22,1,0);
	
	Connect(19,14,8,9);
	Connect(14,8,8,9);
	Connect(8,2,8,9);
	Connect(2,0,8,9);
	
	Connect(20,15,6,7);
	Connect(15,9,6,7);
	Connect(9,3,6,7);
	Connect(3,0,6,7);
	
	Connect(21,16,4,5);
	Connect(16,10,4,5);
	Connect(10,4,4,5);
	Connect(4,0,4,5);
	
	Connect(22,17,2,3);
	Connect(17,11,2,3);
	Connect(11,5,2,3);
	Connect(5,0,2,3);
	
	Connect(13,7,8,9);
	Connect(7,1,8,9);
	Connect(18,12,8,9);
	Connect(12,6,8,9);


	/*Connect(15,3,1,0);
	Connect(3,9,1,0);
	Connect(9,12,1,0);
	Connect(12,6,1,0);
	Connect(6,18,1,0);
	Connect(16,4,1,0);
	Connect(4,10,1,0);
	Connect(10,13,1,0);
	Connect(13,7,1,0);
	Connect(7,19,1,0);
	Connect(17,5,1,0);
	Connect(5,11,1,0);
	Connect(11,14,1,0);
	Connect(14,8,1,0);
	Connect(8,20,1,0);
	Connect(1,21,1,0);
	Connect(21,22,1,0);
	Connect(22,2,1,0);
	
	Connect(1,5,8,9);
	Connect(5,4,8,9);
	Connect(4,3,8,9);
	Connect(3,0,8,9);
	
	Connect(21,11,6,7);
	Connect(11,10,6,7);
	Connect(10,9,6,7);
	Connect(9,0,6,7);
	
	Connect(22,14,4,5);
	Connect(14,13,4,5);
	Connect(13,12,4,5);
	Connect(12,0,4,5);
	
	Connect(2,8,2,3);
	Connect(8,7,2,3);
	Connect(7,6,2,3);
	Connect(6,0,2,3);
	
	Connect(17,16,8,9);
	Connect(16,15,8,9);
	Connect(20,19,8,9);
	Connect(19,18,8,9);*/
		
	this.g.catcher=JocGame.PLAYER_B;
	this.g.catcherMin=3;
	this.g.catcheeMin=1;
	//this.g.initialPos=[[-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],[0,9,12]];
	//this.g.initialPos=[[-2,-2,-2],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]];
	this.g.initialPos=[[18,19,20,21,22],[0,3,4]];
	this.g.useDrop=false;
	//this.g.initialPos=[[-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],[0,3,4]];
	//this.g.useDrop=true;
	
	this.HuntPostInitGame();

	//JocLog("Graph",this.g.Graph);
	//JocLog("RC",this.g.RC);
}



