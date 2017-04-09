/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

// relative to top left corner of the board
View.Game.HexCellRow2Ycenter=function( r ){ 
	if(this.mViewAs==JocGame.PLAYER_B)
		r=this.g.HEIGHT-1-r;
	if (this.mOptions.orientation=='onASide'){
		var y=this.g.boardH-this.g.mainMarginY;
		y-=this.g.R*(r+1);
		return y;
	}else{ // onACorner
		var y=this.g.boardH-this.g.mainMarginY;
		if (r%2==0){
			y-=(1+r/2*3)*this.g.T;
		}else{
			y-=(-this.g.T/2+(r+1)/2*3*this.g.T);
		}
		return y;
	}
}

View.Game.HexCellCol2Xcenter=function( c ){
	if(this.mViewAs==JocGame.PLAYER_B)
		c=this.g.WIDTH-1-c;
	if (this.mOptions.orientation=='onASide'){
		var x=this.g.mainMarginX;
		if (c%2==0){
			x+=(1+c/2*3)*this.g.T;
		}else{
			x+=(-this.g.T/2+(c+1)/2*3*this.g.T);
		}
		return x;
	}else{// onACorner
		var x=this.g.mainMarginX;
		x+=this.g.R*(c+1);
		return x;
	}
}

/* Optional static method.
 * Game based member: 'this' is a game (model) instance. 
 * Called at the init of the game to display the empty board.
 */
View.Game.HexInitView=function() {

	this.g.WIDTH=this.mOptions.maxCols;
	this.g.HEIGHT=this.mOptions.maxLines;
	var GAME=this;

	var mainMarginX=this.mGeometry.width*this.g.margin/100;
	var mainMarginY=this.mGeometry.height*this.g.margin/100;
	
	// an hexagone is made of 6 equilateral triangles. T is this triangles side length
	var T=0;
	var N=0;
	
	if (this.mOptions.orientation=="onASide"){
		T=(this.mGeometry.height-2*mainMarginY)/(this.g.HEIGHT+1)/Math.cos(Math.PI/6);	
		N=this.g.WIDTH;
		if (this.g.WIDTH%2==0){
			T=Math.min(T,(this.mGeometry.width-2*mainMarginX)/(1.5*N+1));
		}else{
			T=Math.min(T,(this.mGeometry.width-2*mainMarginX)/((N+1)+(N-1)/2));
		}		
	}else{// onACorner
		T=(this.mGeometry.width-2*mainMarginX)/(this.g.WIDTH+1)/Math.cos(Math.PI/6);	
		N=this.g.HEIGHT;
		if (this.g.HEIGHT%2==0){
			T=Math.min(T,(this.mGeometry.height-2*mainMarginY)/(1.5*N+1));
		}else{
			T=Math.min(T,(this.mGeometry.height-2*mainMarginY)/((N+1)+(N-1)/2));
		}
	}
	
	var R=T*Math.cos(Math.PI/6);
	
	this.g.R=R; // circle approach (included circle)
	this.g.T=T; // triangle approach (triangle grid)
	
	// diameter of included circle
	this.g.cellSide=Math.floor(2*R);
	this.g.hexRatio=0.866;
	
	this.g.cellMargin=0;//this.g.cellSide/16;
	this.g.tokenSide=this.g.cellSide-2*this.g.cellMargin;
	
	if (this.mOptions.orientation=="onASide"){
		this.g.boardH=2*mainMarginY+(this.g.HEIGHT+1)*R;
		if (this.g.WIDTH%2==0){
			this.g.boardW=2*mainMarginX+T*(3/2*N+0.5);
		}else{
			this.g.boardW=2*mainMarginX+T*((N+1)+(N-1)/2);
		}
	}else{
		this.g.boardW=2*mainMarginX+(this.g.WIDTH+1)*R;
		if (this.g.HEIGHT%2==0){
			this.g.boardH=2*mainMarginY+T*(3/2*N+0.5);
		}else{
			this.g.boardH=2*mainMarginY+T*((N+1)+(N-1)/2);
		}
	}

	this.g.top=(this.mGeometry.height-this.g.boardH)/2;//-mainMarginX;
	this.g.left=(this.mGeometry.width-this.g.boardW)/2;//-mainMarginY;
	this.g.mainMarginX=mainMarginX;
	this.g.mainMarginY=mainMarginY;
	
	this.g.backBoard=$("<div/>").addClass("hexa-board").css({position: "absolute",
		top: this.g.top,
		left: this.g.left,
		width: this.g.boardW,
		height: this.g.boardH,
	}).appendTo(this.mWidget);
			
	// adding the canvas to the div
	$("<canvas/>").attr("id","canvasboard").attr("width",this.g.boardW).attr("height",this.g.boardH).
		css({position: "absolute",
		top: 0,
		left: 0,
		width: this.g.boardW,
		height: this.g.boardH,
		}).appendTo(this.g.backBoard);
	this.g.ctxboard = $('#canvasboard')[0].getContext("2d"); 
	this.HexDrawBoard(this.g.ctxboard);
	
	if (this.mOptions.addCellCanvas){
		//this.g.canvasCtx=[];
		this.g.canvasCells=[];
		
		this.g.CellClass=function(pos,nbmax,ctx){
			this.pos=pos;
			this.nb=0;
			this.nbMax=nbmax;
			this.who=0;
			this.ctx=ctx;
		};
		
		/*this.g.CellClass.prototype.DisplayBmp=function(path){
			var imageObj = new Image();
			var ctx=this.ctx;
		   	imageObj.onload = function(){
		       	ctx.drawImage(imageObj, 0, 0, ctx.canvas.width,ctx.canvas.height);
		   	}
			imageObj.src = path;
		};*/
		
		this.g.CellClass.prototype.DisplayBmp=function(color){
			var ctx=this.ctx;
			if (GAME.g.SeedsImage != undefined){
				var yOffset=color=="green"?5*88:0;
				// images are 100x88px
		       	ctx.drawImage(GAME.g.SeedsImage, 
		       					// src
		       					(this.nb-1)*100,yOffset+(this.nbMax-2)*88,100,88, 
		       					// dest 
		       					0, 0, ctx.canvas.width,ctx.canvas.height);
		       	}
		};
				
		this.g.CellClass.prototype.Display=function(n,who,bForceRepaint){
			if ((n!=this.nb)||(who!=this.who)||(bForceRepaint)){
				var ctx=this.ctx;
				ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
				if (n>0){
					// update members
					this.nb=n;
					this.who=who;
					// do the job
					var color=this.who==JocGame.PLAYER_A?"green":"red";
					this.DisplayBackground(color);
					//var path=GAME.mViewOptions.fullPath+"/res/images/hexplode/"+this.nbMax+"-"+this.nb+"-"+color+".png";
					//this.DisplayBmp(path);	
					this.DisplayBmp(color);
				}
			}			
		};
		
		this.g.CellClass.prototype.DisplayBackground=function(color){
			var ctx=this.ctx;
			var xCenter=ctx.canvas.width/2;
			var yCenter=ctx.canvas.height/2;
			var T=xCenter;
			var R=yCenter;
			var alpha="0.3";
			if (this.nb==(this.nbMax-1)) alpha="1.0";
			ctx.fillStyle=color=="green"?"rgba(194,255,0,"+alpha+")":"rgba(255,45,174,"+alpha+")";
			ctx.beginPath();
			ctx.moveTo(xCenter-T/2,yCenter-R);
			ctx.lineTo(xCenter+T/2,yCenter-R);
			ctx.lineTo(xCenter+T,yCenter);
			ctx.lineTo(xCenter+T/2,yCenter+R);
			ctx.lineTo(xCenter-T/2,yCenter+R);
			ctx.lineTo(xCenter-T,yCenter);
			ctx.lineTo(xCenter-T/2,yCenter-R);	
			ctx.fill();
		};
	}
	
	// create cells
	for(var r=0;r<this.g.HEIGHT;r++) {
		for(var c=0;c<this.g.WIDTH;c++) {
			var row=r;
			var col=c;
			var yCenter=this.HexCellRow2Ycenter( r );
			var xCenter=this.HexCellCol2Xcenter( c );
			var pos=this.HexRcPos(r,c);//r*this.g.WIDTH+c;
			var prct=0.9;
			if (this.g.Layout[r][c]!="."){
				$("<div/>").attr("id","cell"+pos).addClass("cell").
				addClass("cell-"+(((row+col)%2==0)?"white":"black")).
				attr("jocpos",pos).css({ 
					width: 2*this.g.R*prct,
					height: 2*this.g.R*prct,
					top: this.g.top+yCenter-this.g.R*prct,
					left: this.g.left+xCenter-this.g.R*prct,
					'border-radius': this.g.R*prct,
					'-webkit-border-radius': this.g.R*prct,					
				}).appendTo(this.mWidget);
				$("<div/>").addClass("front").
				attr("jocpos",pos).css({ 
					width: 2*this.g.R,
					height: 2*this.g.R,
					top: this.g.top+yCenter-this.g.R,
					left: this.g.left+xCenter-this.g.R,
					'border-radius': this.g.R
				}).appendTo(this.mWidget);
				// add a cell canvas if requested
				if (this.mOptions.addCellCanvas){
					var curCanvas=$("<canvas/>").attr("canvapos",pos).addClass("cellcanvas").css({ 
						top: this.g.top+yCenter-this.g.R,
						left: this.g.left+xCenter-this.g.T,
						width: 2*this.g.T,
						height: 2*this.g.R,
					}).appendTo(this.mWidget);
					var ctx=curCanvas[0].getContext("2d");
					//this.g.canvasCtx[pos]=ctx;
					this.g.canvasCells[pos]=new this.g.CellClass(pos,this.g.nbSeedsMax[pos],ctx);
				}
				if(this.mNotation) {
					$("<div/>").text(pos/*+1*/).addClass("notation").css({
						"line-height": this.g.cellSide/6+"px",
						"font-size": this.g.cellSide/6+"pt",
			 			"top": this.g.top+yCenter-this.g.cellSide/2,
			 			"left": this.g.left+xCenter-this.g.R/2,
			 			"width":this.g.R,
			 			"text-align": "center"
					}).appendTo(this.mWidget);
				}
			}
		}
	}
	// create pieces
	for(var i in this.mBoard.pieces) {
		var piece=this.mBoard.pieces[i];
		var curcell=$("<div/>").addClass("piece").attr("id","jocindex"+i).css({ 
				width: 2*this.g.R,
				height: 2*this.g.R,
			}).appendTo(this.mWidget).hide();
		$("<canvas/>").attr("id","tokencellcanvas").attr("width",this.g.tokenSide).attr("height",this.g.tokenSide).
				css({position: "absolute",
				top: this.g.cellMargin,
				left: this.g.cellMargin,
				width: this.g.tokenSide,
				height: this.g.tokenSide,
				}).appendTo(curcell);
		if (this.mOptions.tokenBitmaps != undefined){
			var bitmap=piece.s==JocGame.PLAYER_A?this.mOptions.tokenBitmaps.a[piece.type]:this.mOptions.tokenBitmaps.b[piece.type];
			this.HexPaintToken(curcell,piece.s==JocGame.PLAYER_A?"black":"white",bitmap);
		}else{
			this.HexPaintTokenOneRes(curcell,piece.s,piece.type);
		}
	}
	// PASS div
	$("<div/>").attr("id","passingdiv").addClass("hex-score").html("<a class='hex-pass' href='javascript:void(0)'>Pass</a>" +
			"<div style='width:100%' class='ardri-passing'>Passing</div>").css({
			top: this.g.top,
			left: this.g.left,
			width: this.g.boardW+2,
			height: this.g.boardH+2,
			background: "rgba(255,255,255,0.6)",
			textAlign: "center",
			zIndex: 500,
			'font-family': 'Arial',
			'font-size': this.g.boardH/10,
			'padding-top': this.g.boardH/2-this.g.boardH/10
		}).hide().appendTo(this.mWidget);
		
}

View.Game.HexDrawBoard=function(){
	var ctx=this.g.ctxboard;
	
	var GAME=this;
	
	var R=this.g.R;
	var T=this.g.T;
	var mX=this.g.mainMarginX;
	var mY=this.g.mainMarginY;
	var skin=this.mSkin;

	var boardGradient = ctx.createRadialGradient(
		0,0,this.g.boardW/2,
		this.g.boardW,this.g.boardW,this.g.boardW*2);
	boardGradient.addColorStop(0,"rgb(0,195,255)");
	boardGradient.addColorStop(1,"rgb(0,25,200)");
	var boardGradient2 = ctx.createRadialGradient(
		0,0,this.g.boardW/2,
		this.g.boardW,this.g.boardW,this.g.boardW*2);
	boardGradient2.addColorStop(0,"rgba(0,195,255,0.7)");
	boardGradient2.addColorStop(1,"rgba(0,25,200,0.7)");	
	
	function DrawHexagone(xCenter,yCenter,celltype){
		ctx.beginPath(); 
		if (GAME.mOptions.orientation=='onASide'){
			ctx.moveTo(xCenter-T/2,yCenter-R);
			ctx.lineTo(xCenter+T/2,yCenter-R);
			ctx.lineTo(xCenter+T,yCenter);
			ctx.lineTo(xCenter+T/2,yCenter+R);
			ctx.lineTo(xCenter-T/2,yCenter+R);
			ctx.lineTo(xCenter-T,yCenter);
			ctx.lineTo(xCenter-T/2,yCenter-R);
		}else{ // 'onACorner
			ctx.moveTo(xCenter,yCenter-T);
			ctx.lineTo(xCenter+R,yCenter-T/2);
			ctx.lineTo(xCenter+R,yCenter+T/2);
			ctx.lineTo(xCenter,yCenter+T);
			ctx.lineTo(xCenter-R,yCenter+T/2);
			ctx.lineTo(xCenter-R,yCenter-T/2);
			ctx.lineTo(xCenter,yCenter-T);
		}

		ctx.lineWidth=1;
		switch(skin){
			default:
			ctx.strokeStyle="rgba(255,255,255,0.2)";
			ctx.stroke();		
			if (celltype=='c'){
				ctx.fillStyle="rgba(0,0,0,0.2)";
				ctx.fill();
			}
			break;
			case 'basic':
			case 'stylised':
			case 'basicnosound':
			case 'stylisednosound':
			if (celltype=='c'){
				ctx.strokeStyle="rgba(255,255,255,0.8)";
				//ctx.fillStyle="rgba(75,180,255,0.8)";
				ctx.fillStyle=boardGradient2;
			}else{
				ctx.strokeStyle="rgba(255,255,255,0.6)";
				ctx.fillStyle=boardGradient;
			}
			ctx.stroke();		
			ctx.fill();
			break;
		}

		
	}
	
	function DrawCells(){
		for (var r=0;r<GAME.mOptions.maxLines;r++){
			for (var c=0;c<GAME.mOptions.maxCols;c++){
				switch (GAME.g.Layout[r][c]){
					default:
					DrawHexagone(GAME.HexCellCol2Xcenter( c ),GAME.HexCellRow2Ycenter( r ),GAME.g.Layout[r][c]);
					break;
					case ".":
					break;
				}
			}
		}
	}
	
	var ctx=this.g.ctxboard;
	ctx.clearRect(0,0,this.g.boardW,this.g.boardH);

	ctx.save();
	


	
	/*ctx.fillStyle = boardGradient ;
	ctx.beginPath();
	ctx.rect(0,0,this.g.boardW,this.g.boardH);
	ctx.closePath();	
	ctx.fill();*/
		
	var viewer=this.mViewAs;
	
	var bg=this.mViewOptions.boardBackgrounds[this.mSkin];
	if (bg!=undefined){
		var path=this.mViewOptions.fullPath+"/res/images/"+bg;
		var GAME=this;
		var imageObj = new Image();
    	imageObj.onload = function(){
    		if (viewer==JocGame.PLAYER_B){
    			switch(skin){
		    		default:
		    		ctx.translate(GAME.g.boardW,GAME.g.boardH);
	    			ctx.scale(-1, -1);
	    			break;
	    			case 'basic':
	    			case 'stylised':
	    			case 'basicnosound':
	    			case 'stylisednosound':
		    		ctx.translate(GAME.g.boardW,0);
	    			ctx.scale(-1, 1);
	    			break;
    			}
    		}	
     		switch(skin){
	    		default:
        		ctx.drawImage(imageObj, 0, 0, GAME.g.boardW, GAME.g.boardH);
			   	DrawCells();
	    		break;
    			case 'basic':
    			case 'stylised':
    			case 'basicnosound':
    			case 'stylisednosound':
			   	DrawCells();
        		ctx.drawImage(imageObj, 0, 0, GAME.g.boardW, GAME.g.boardH);
			   	break;
	    	}
        };
    	imageObj.src = path;
	}else{
		/*var boardGradient = ctx.createRadialGradient(
				-this.g.boardW/2,-this.g.boardW/2,0,
				this.g.boardW/6*4,this.g.boardW/6*2,this.g.boardW*2);
		boardGradient.addColorStop(0,"#33ccff");
		boardGradient.addColorStop(1,"#3366ff");
		
		ctx.fillStyle = boardGradient ;
		ctx.beginPath();
		ctx.rect(0,0,this.g.boardW,this.g.boardH);
		ctx.closePath();	*/
		//ctx.fill();
		DrawCells();
	}
	ctx.restore();
}

View.Game.HexPaintToken=function(cell,coul,bitmap){
	var ctx=cell.find("#tokencellcanvas")[0].getContext("2d");
	var l=ctx.canvas.width;
	var m=l/10;
	var path=this.mViewOptions.fullPath+"/res/images/";
	var imageObj = new Image();
    imageObj.onload = function(){
    	ctx.clearRect(0,0,l,l);
        ctx.drawImage(imageObj, m, m, l-2*m, l-2*m);
    }
    path+=bitmap;
	imageObj.src = path;
}

