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
	$.extend(this.g.huntEval,{
	});
	
	function Connect(pos0,pos1,dir0,dir1) {
		$this.g.Graph[pos0][dir0]=pos1;
		$this.g.Graph[pos1][dir1]=pos0;		
	}
	

	var c0=3,r0=3,d0=2.5,d=1,s=0.25,h=0.4;
	var alpha=Math.PI/5;
	
	var pointsRef=[ // from drawing with 100pix for 1 col/line (margin included)

		[400,532],

		[236,437],
		[287,378],
		[359,346],
		[437,346],
		[513,379],
		[560,437],
		
		[168,397],
		[240,313],
		[342,267],
		[456,268],
		[557,313],
		[629,398],
		
		[100,358],
		[194,250],
		[326,190],
		[471,191],
		[604,250],
		[698,359],

		[146,186],
		[310,113],
		[487,113],
		[650,186],
	];
	
	for(var i in pointsRef) {
		var point=pointsRef[i];
		var pointCR=[(point[1]-100)/100,(point[0]-100)/100];
		//var pointCR=[point[1],point[0]];
		
		this.g.Graph.push([]);
		this.g.RC.push(pointCR);
	}	
	
	Connect(0,2,7,6);
	Connect(2,8,7,6);
	Connect(8,14,7,6);
	Connect(14,19,7,6);
	Connect(0,3,5,4);
	Connect(3,9,5,4);
	Connect(9,15,5,4);
	Connect(15,20,5,4);
	Connect(0,4,3,2);
	Connect(4,10,3,2);
	Connect(10,16,3,2);
	Connect(16,21,3,2);
	Connect(0,5,1,0);
	Connect(5,11,1,0);
	Connect(11,17,1,0);
	Connect(17,22,1,0);
	Connect(1,7,7,6);
	Connect(7,13,7,6);
	Connect(6,12,1,0);
	Connect(12,18,1,0);
	
	Connect(1,2,9,8);
	Connect(2,3,9,8);
	Connect(3,4,9,8);
	Connect(4,5,9,8);
	Connect(5,6,9,8);
	Connect(7,8,9,8);
	Connect(8,9,9,8);
	Connect(9,10,9,8);
	Connect(10,11,9,8);
	Connect(11,12,9,8);
	Connect(13,14,9,8);
	Connect(14,15,9,8);
	Connect(15,16,9,8);
	Connect(16,17,9,8);
	Connect(17,18,9,8);

	Connect(19,20,9,8);
	Connect(20,21,9,8);
	Connect(21,22,9,8);	
	
	/*var points=[
	        [r0,c0],
	        [r0-h,c0-d0-s],
	        [r0-h,c0+d0+s],
	        [r0-d0*Math.sin(alpha),c0-d0*Math.cos(alpha)],
	        [r0-d0*Math.sin(alpha),c0+d0*Math.cos(alpha)],
	        [r0-d0*Math.sin(2*alpha),c0-d0*Math.cos(2*alpha)],
	        [r0-d0*Math.sin(2*alpha),c0+d0*Math.cos(2*alpha)],
	        [r0-(d0+d)*Math.sin(alpha),c0-(d0+d)*Math.cos(alpha)],
	        [r0-(d0+d)*Math.sin(alpha),c0+(d0+d)*Math.cos(alpha)],
	        [r0-(d0+d)*Math.sin(2*alpha),c0-(d0+d)*Math.cos(2*alpha)],
	        [r0-(d0+d)*Math.sin(2*alpha),c0+(d0+d)*Math.cos(2*alpha)],
	        [r0-(d0+2*d)*Math.sin(alpha),c0-(d0+2*d)*Math.cos(alpha)],
	        [r0-(d0+2*d)*Math.sin(alpha),c0+(d0+2*d)*Math.cos(alpha)],
	        [r0-(d0+2*d)*Math.sin(2*alpha),c0-(d0+2*d)*Math.cos(2*alpha)],
	        [r0-(d0+2*d)*Math.sin(2*alpha),c0+(d0+2*d)*Math.cos(2*alpha)],
	        [r0-(d0+3*d)*Math.sin(alpha),c0-(d0+3*d)*Math.cos(alpha)],
	        [r0-(d0+3*d)*Math.sin(alpha),c0+(d0+3*d)*Math.cos(alpha)],
	        [r0-(d0+3*d)*Math.sin(2*alpha),c0-(d0+3*d)*Math.cos(2*alpha)],
	        [r0-(d0+3*d)*Math.sin(2*alpha),c0+(d0+3*d)*Math.cos(2*alpha)],
	        [r0-h-d*Math.sin(alpha),c0-d0-d*Math.cos(alpha)-s],
	        [r0-h-2*d*Math.sin(alpha),c0-d0-2*d*Math.cos(alpha)-s],
	        [r0-h-d*Math.sin(alpha),c0+d0+d*Math.cos(alpha)+s],
	        [r0-h-2*d*Math.sin(alpha),c0+d0+2*d*Math.cos(alpha)+s],
	    ];
	
	for(var i in points) {
		var point=points[i];
		this.g.Graph.push([]);
		this.g.RC.push(point);
	}
	
	Connect(0,3,7,6);
	Connect(3,7,7,6);
	Connect(7,11,7,6);
	Connect(11,15,7,6);
	Connect(0,5,5,4);
	Connect(5,9,5,4);
	Connect(9,13,5,4);
	Connect(13,17,5,4);
	Connect(0,6,3,2);
	Connect(6,10,3,2);
	Connect(10,14,3,2);
	Connect(14,18,3,2);
	Connect(0,4,1,0);
	Connect(4,8,1,0);
	Connect(8,12,1,0);
	Connect(12,16,1,0);
	Connect(1,19,7,6);
	Connect(19,20,7,6);
	Connect(2,21,1,0);
	Connect(21,22,1,0);
	
	Connect(1,3,9,8);
	Connect(3,5,9,8);
	Connect(5,6,9,8);
	Connect(6,4,9,8);
	Connect(4,2,9,8);
	Connect(19,7,9,8);
	Connect(7,9,9,8);
	Connect(9,10,9,8);
	Connect(10,8,9,8);
	Connect(8,21,9,8);
	Connect(20,11,9,8);
	Connect(11,13,9,8);
	Connect(13,14,9,8);
	Connect(14,12,9,8);
	Connect(12,22,9,8);

	Connect(15,17,9,8);
	Connect(17,18,9,8);
	Connect(18,16,9,8);*/

	this.g.catcher=JocGame.PLAYER_B;
	this.g.catcherMin=3;
	this.g.catcheeMin=1;
	//this.g.initialPos=[[-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],[0,5,6]];
	//this.g.initialPos=[[-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]];
	this.g.initialPos=[[11,12,13,14,15,16,17,18,19,20,21,22],[0,3,4]];
	this.g.useDrop=false;
	
	this.HuntPostInitGame();

	//JocLog("Graph",this.g.Graph);
	//JocLog("RC",this.g.RC);
}



