/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

View.Game.PenSocRotate=function(item,deg) {
	var xOrigin=item.width()/2;
	var yOrigin=item.height()/2;
	item.css({
		"-moz-transform": "rotate("+deg+"deg)", 
		"-webkit-transform": "rotate("+deg+"deg)",
		"-o-transform": "rotate("+deg+"deg)",
		"msTransform": "rotate("+deg+"deg)",
		"transform": "rotate("+deg+"deg)",
	});
}

View.Game.PenSocMakelighter=function(x,y,r,type) {
	
	var $this=this;
	var radius=r*1.25;
	function MakeLighter(type) {
		var lighter=$("<canvas/>").addClass(type).css({
			top: y-radius,
			left: x-radius,
			"border-radius": radius,
		}).attr("width",2*radius).attr("height",2*radius).appendTo($this.g.area);
		var ctx=lighter[0].getContext("2d");
		if(type=="highlighter")
			ctx.strokeStyle="#ff9900";
		else if(type=="backlighter")
			ctx.strokeStyle="#ff66cc";
		ctx.lineWidth=r*0.25;
		ctx.beginPath();
		ctx.arc(radius,radius,r*1.125,0,Math.PI*2,true);
		ctx.closePath();
		ctx.stroke();
		return lighter;
	}
	
	var lighter=MakeLighter(type);
	//lighter.push(MakeLighter("backlighter")[0]);
	return lighter;
}

View.Game.PenSocMakeHighlighter=function(x,y,r) {
	return this.PenSocMakelighter(x,y,r,"highlighter");
}

View.Game.PenSocMakeBacklighter=function(x,y,r) {
	return this.PenSocMakelighter(x,y,r,"backlighter");
}

View.Game.PenSocDrawPenguin=function(penguin) {
	var deg=this.mViewAs==JocGame.PLAYER_A?
			[0,-45,-90,-135,180,135,90,45]:
			[180,135,90,45,0,-45,-90,-135];
	var data=penguin.data("data");
	penguin.attr("width",data.size).attr("height",data.size).css({
		top: data.y-data.size/2,
		left: data.x-data.size/2,
	});
	var ctx=penguin[0].getContext("2d");
	var resX, resY;
    if(data.which==JocGame.PLAYER_A)
    	resY=200;
    else
    	resY=0;
    resX=data.type*200;
    if(data.swimming) {
    	resX+=1200;
    	this.PenSocRotate(penguin,deg[this.g.initialPos[data.type+(data.which==JocGame.PLAYER_A?0:3)][2]]);
    } else if(data.dir>-1) {
    	resX+=600;
    	this.PenSocRotate(penguin,deg[data.dir]);    	
    } else {
    	this.PenSocRotate(penguin,deg[data.which==JocGame.PLAYER_A?0:4]);
    }
	ctx.drawImage(this.g.imagesRes,resX,resY,200,200,0,0,data.size,data.size);
}


View.Game.PenSocUpdatePenguin=function(penguin,options) {
	var data=penguin.data("data");
	$.extend(data,options);
	penguin.data(data);
	this.PenSocDrawPenguin(penguin);
	//JocLog("UpdatePenguin",options);
}

View.Game.PenSocMakePenguin=function(options) {
	var data={
		x: this.g.center,
		y: this.g.center,
		which: JocGame.PLAYER_A,
		type: 0,
		dir: -1,
		size: this.g.cellSize,
		swimming: true,
	}
	$.extend(data,options);
	var penguin=$("<canvas/>").addClass("penguin").data("data",data).appendTo(this.g.area);
	this.PenSocDrawPenguin(penguin);
	return penguin;
}

View.Game.PenSocMakeBall=function(size) {
	var $this=this;
	var ball=$("<canvas/>").addClass("ball").css({
		top: this.g.center-size/2,
		left: this.g.center-size/2,
		"border-radius": size/2,
	}).attr("width",size).attr("height",size).appendTo(this.g.area);
	var ctx=ball[0].getContext("2d");
	ctx.drawImage(this.g.imagesRes,0,400,200,200,0,0,size,size);
	return ball;
}

View.Game.PenSocMakeCancel=function() {
	var size=this.g.cellSize;
	this.g.cancelButton=$("<canvas/>").addClass("cancel").css({
		top: size*5.5,
		left: size*11.6,
		"border-radius": size/2,
	}).attr("width",size).attr("height",size).appendTo(this.g.area).hide();
	this.g.cancelFront=$("<div/>").addClass("front").css({
		top: size*5.5,
		left: size*11.6,
		width: size,
		height: size,
		"border-radius": size/2,
	}).attr("width",size).attr("height",size).appendTo(this.g.area).hide();
	var ctx=this.g.cancelButton[0].getContext("2d");
	ctx.drawImage(this.g.imagesRes,600,400,200,200,0,0,size,size);
	this.g.cancelBacklighter=this.PenSocMakeBacklighter(size*12.1,size*6,size/2).hide();
}

View.Game.PenSocMakeGoal=function(who) {
	var top,left,rotate=false;
	if(who==JocGame.PLAYER_A) {
		top=this.g.areaHeight-this.g.cellSize*2+this.g.cellSize*0.25;
		left=this.g.boardSize/Math.sqrt(2)-this.g.cellSize;
	} else {
		top=-this.g.cellSize*0.25;
		left=this.g.boardSize/Math.sqrt(2)-this.g.cellSize;
		rotate=true;
	}
	var goal=$("<canvas/>").addClass("goal").css({
		top: top,
		left: left,
	}).attr("width",this.g.cellSize*2).attr("height",this.g.cellSize*2).appendTo(this.g.area);
	if(rotate)
		this.PenSocRotate(goal,180);
	var ctx=goal[0].getContext("2d");
	ctx.drawImage(this.g.imagesRes,200,400,200,200,0,0,this.g.cellSize*2,this.g.cellSize*2);
}

View.Game.InitView=function() {
	//JocLog("PenSocInitView");
	this.mWidget.empty();
	
	this.g.areaBackground=this.preloadedImages['background']; 
	this.g.imagesRes=this.preloadedImages['sprites']; 

	var $this=this;
	this.g.areaWidth=Math.min(this.mGeometry.width, this.mGeometry.height*this.mViewOptions.preferredRatio);
	this.g.areaHeight=this.g.areaWidth/this.mViewOptions.preferredRatio;
	
	this.g.top=(this.mGeometry.height-this.g.areaHeight)/2;
	this.g.left=(this.mGeometry.width-this.g.areaWidth)/2;
	this.g.center=this.g.areaHeight/2;
	this.g.boardSize=this.g.areaHeight/Math.sqrt(2);
	this.g.cellSize=$this.g.boardSize/8;
		
	this.g.Coord=[];
	for(var i=0;i<8;i++)
		for(var j=0;j<8;j++) {
			var x=this.g.center-(i-4)*this.g.cellSize*Math.sqrt(2)/2+(j-4)*this.g.cellSize*Math.sqrt(2)/2;
			var y=this.g.center-(i-4)*this.g.cellSize*Math.sqrt(2)/2-(j-3)*this.g.cellSize*Math.sqrt(2)/2;
			if(this.mViewAs==JocGame.PLAYER_B) {
				x=this.g.center+(i-4)*this.g.cellSize*Math.sqrt(2)/2-(j-4)*this.g.cellSize*Math.sqrt(2)/2;
				y=this.g.center+(i-4)*this.g.cellSize*Math.sqrt(2)/2+(j-3)*this.g.cellSize*Math.sqrt(2)/2;
			}
			this.g.Coord.push([x,y]);
		}
	
	this.g.area=$("<div/>").addClass("pensoc-area").css({
		top: this.g.top,
		left: this.g.left,
		width: this.g.areaWidth,
		height: this.g.areaHeight,
	}).appendTo(this.mWidget);

	this.g.areaCanvas=$("<canvas/>").addClass("pensoc-area-canvas").css({
		top: 0,
		left: 0,
	}).attr("width",this.g.areaWidth).attr("height",this.g.areaHeight).appendTo(this.g.area);
	
	var areaCtx=this.g.areaCanvas[0].getContext("2d")
    areaCtx.drawImage(this.g.areaBackground,0,0,this.g.areaBackground.width,this.g.areaBackground.height,0,0,$this.g.areaWidth,$this.g.areaHeight);	
	
	this.PenSocMakeGoal(JocGame.PLAYER_A);
	this.PenSocMakeGoal(JocGame.PLAYER_B);

	this.g.board=$("<div/>").addClass("pensoc-board").css({
		top:(this.g.areaHeight-this.g.boardSize)/2,
		left: (this.g.areaHeight-this.g.boardSize)/2,
		width: this.g.boardSize,
		height: this.g.boardSize,
	}).appendTo(this.g.area);
	
	this.g.boardCanvas=$("<canvas/>").addClass("pensoc-board-canvas").css({
		top: 0,
		left: 0,
	}).attr("width",this.g.boardSize).attr("height",this.g.boardSize).appendTo(this.g.board);
	
	for(var i=0;i<8;i++)
		for(var j=0;j<8;j++) {
			var pos=i*8+j;
			var coord=this.g.Coord[pos];
			if(this.mNotation)
				$("<div/>").addClass("notation").css({
					top: coord[1]-this.g.cellSize/2,
					left: coord[0]-this.g.cellSize/2,
					width: this.g.cellSize,
					height: this.g.cellSize,
					"line-height": this.g.cellSize+"px",
					"font-size": this.g.cellSize/4+"pt",
				}).appendTo(this.g.area).text(pos);
			if(this.mShowMoves)
				this.PenSocMakeHighlighter(coord[0],coord[1],this.g.cellSize/2).attr("joc-pos",pos).hide();
			this.PenSocMakeBacklighter(coord[0],coord[1],this.g.cellSize/2).attr("joc-pos",pos).hide();
			$("<div/>").addClass("front").css({
				width: this.g.cellSize,
				height: this.g.cellSize,
				top: coord[1]-this.g.cellSize/2,
				left: coord[0]-this.g.cellSize/2,
				"border-radius": this.g.cellSize/2,
			}).appendTo(this.g.area).attr("joc-pos",pos).hide();
		}

	if(this.mViewAs==JocGame.PLAYER_A)
		this.g.initialPos=[
		                   [0.6*this.g.cellSize,9.5*this.g.cellSize,6],
		                   [2*this.g.cellSize,10.5*this.g.cellSize,7],
		                   [3.5*this.g.cellSize,10.2*this.g.cellSize,0],
		                   [7.5*this.g.cellSize,0.8*this.g.cellSize,1],
		                   [9*this.g.cellSize,0.6*this.g.cellSize,3],
		                   [9.2*this.g.cellSize,2*this.g.cellSize,2],
		                   ];
	else
		this.g.initialPos=[
		                   [7.5*this.g.cellSize,0.8*this.g.cellSize,5],
		                   [9*this.g.cellSize,0.6*this.g.cellSize,7],
		                   [9.2*this.g.cellSize,2*this.g.cellSize,6],
		                   [0.6*this.g.cellSize,9.5*this.g.cellSize,2],
		                   [2*this.g.cellSize,10.5*this.g.cellSize,3],
		                   [3.5*this.g.cellSize,10.2*this.g.cellSize,4],
		                   ];
	
	this.g.penguins=[];
	for(var who=1;who>-2;who-=2)  
		for(var type=0;type<3;type++) {
			var index=this.g.penguins.length;
			var coord=this.g.initialPos[index];
			var penguin=this.PenSocMakePenguin({x:coord[0],y:coord[1],which:who,type:type,angle:who==this.mViewAs?0:180})
			.attr("joc-index",index).hide();
			/*
			this.PenSocMakePenguin({x:coord[0],y:coord[1],which:who,type:type,angle:who==this.mViewAs?0:180})
			.addClass("ghost");
			*/
			var highlighter=this.PenSocMakeHighlighter(coord[0],coord[1],this.g.cellSize/2).attr("joc-index",index).hide();
			var backlighter=this.PenSocMakeBacklighter(coord[0],coord[1],this.g.cellSize/2).attr("joc-index",index).hide();
			var front=$("<div/>").addClass("front").css({
				width: this.g.cellSize,
				height: this.g.cellSize,
				top: coord[1]-this.g.cellSize/2,
				left: coord[0]-this.g.cellSize/2,
				"border-radius": this.g.cellSize/2,
			}).attr("joc-index",index).appendTo(this.g.area).hide();
			if(this.mNotation) {
				$("<div/>").addClass("notation").css({
					left: coord[0]-this.g.cellSize/2,
					top: coord[1]+this.g.cellSize/4,
					width: this.g.cellSize,
					height: this.g.cellSize,
					"line-height": this.g.cellSize+"px",
					"font-size": this.g.cellSize/4+"pt",
				}).appendTo(this.g.area).text(index);
			}
			this.g.penguins.push({
				widget: penguin,
				highlighter: highlighter,
				backlighter: backlighter,
				front: front,
				index: this.g.penguins.length,
			});
		}
	
	this.PenSocMakeRotator();
	this.PenSocMakeTranslator();
	this.PenSocMakePenguinHandlers();
	
	this.g.ball=this.PenSocMakeBall(this.g.cellSize).hide();
	this.PenSocMakeCancel();
	
	this.PenSocRotate(this.g.board,45);
	
	function DrawBoard() {
		return;
		var cellSize=$this.g.cellSize;
		var ctx=$this.g.boardCanvas[0].getContext("2d");
		ctx.save();
		var grad=ctx.createLinearGradient(0,0,$this.g.boardSize,$this.g.boardSize);
		grad.addColorStop(1, 'rgb(240,240,240)');
		grad.addColorStop(0, 'rgb(250,250,250)');
		ctx.fillStyle=grad;
		for(var i=0;i<8;i++)
			for(var j=0;j<8;j++)
				if((i+j)%2==0) {
					ctx.beginPath();
					ctx.moveTo(i*cellSize,j*cellSize);
					ctx.lineTo((i+1)*cellSize,j*cellSize);
					ctx.lineTo((i+1)*cellSize,(j+1)*cellSize);
					ctx.lineTo(i*cellSize,(j+1)*cellSize);
					ctx.closePath();
					ctx.fill();
				}
		ctx.restore();				
	}
	
	DrawBoard();
	
}

View.Game.PenSocMakeRotator=function() {
	var rRadius=2.2*this.g.cellSize;
	var centerX=this.g.areaWidth-rRadius;
	var centerY=this.g.areaHeight-rRadius;
	this.g.rotatorPenguin=this.PenSocMakePenguin({
		x: centerX,
		y: centerY,
		pos: 'l',
		which: this.mViewAs,
		swimming: false,
		size: this.g.cellSize*2,
	}).addClass("rotator").hide();
	this.g.rotatorBall=this.PenSocMakeBall(this.g.cellSize*2).css({
		left: centerX-this.g.cellSize,
		top: centerY-this.g.cellSize,
	}).hide();
	/*
	this.g.rotatorHighlighter=this.PenSocMakeHighlighter(
			centerX,
			centerY,
			this.g.cellSize/2).addClass("rotator").attr("joc-dir",-1).hide();
	this.g.rotatorFront=$("<div/>").addClass("front rotator").css({
		left: centerX-this.g.cellSize/2,
		top: centerY-this.g.cellSize/2,
		width: this.g.cellSize,
		height: this.g.cellSize,
		"border-radius": this.g.cellSize/2,
	}).appendTo(this.g.area).attr("joc-dir",-1).hide();
	*/
	
	var radius=1.5*this.g.cellSize;
	
	this.g.rotator=$("<canvas/>").addClass("rotator-circle").css({
		top: this.g.areaHeight-2*rRadius,
		left: this.g.areaWidth-2*rRadius,
	}).attr("width",2*rRadius).attr("height",2*rRadius).appendTo(this.g.area).hide();
	var ctx=this.g.rotator[0].getContext("2d");
	ctx.strokeStyle="White";
	ctx.lineWidth=this.g.cellSize*0.2;
	ctx.beginPath();
	ctx.arc(rRadius,rRadius,radius,0,2*Math.PI,true);
	ctx.closePath();
	ctx.stroke();
	
	this.g.directions=[];
	for(var i=0;i<8;i++) {
		var angleStep=((-2-i)+16)%8;
		if(this.mViewAs==JocGame.PLAYER_B)
			angleStep=((2-i)+16)%8;
		var direction=this.PenSocMakeHighlighter(
				centerX+Math.cos(angleStep*(Math.PI/4))*radius,
				centerY+Math.sin(angleStep*(Math.PI/4))*radius,
				this.g.cellSize/2
			).attr("joc-dir",this.g.directions.length).addClass("rotator").hide();
		/*
		var backlighter=this.PenSocMakeBacklighter(
				centerX+Math.cos(angleStep*(Math.PI/4))*radius,
				centerY+Math.sin(angleStep*(Math.PI/4))*radius,
				this.g.cellSize/2
			).attr("joc-dir",this.g.directions.length).addClass("rotator").hide();
		*/
		if(this.mNotation) {
			$("<div/>").addClass("notation rotator").css({
				left: centerX+Math.cos(angleStep*(Math.PI/4))*radius-this.g.cellSize/2,
				top: centerY+Math.sin(angleStep*(Math.PI/4))*radius-this.g.cellSize/2,
				width: this.g.cellSize,
				height: this.g.cellSize,
				"line-height": this.g.cellSize+"px",
				"font-size": this.g.cellSize/4+"pt",
			}).appendTo(this.g.area).hide().text(i);
		}
		var front=$("<div/>").addClass("front rotator").css({
				left: centerX+Math.cos(angleStep*(Math.PI/4))*radius-this.g.cellSize/2,
				top: centerY+Math.sin(angleStep*(Math.PI/4))*radius-this.g.cellSize/2,
				width: this.g.cellSize,
				height: this.g.cellSize,
				"border-radius": this.g.cellSize/2,
			}).appendTo(this.g.area).hide().attr("joc-dir",this.g.directions.length);
		this.g.directions.push({
			highlighter: direction,
			//backlighter: backlighter,
			front: front,
		});
		ctx.fillStyle="White";
		ctx.beginPath();
		ctx.arc(rRadius+Math.cos(angleStep*(Math.PI/4))*radius,rRadius+Math.sin(angleStep*(Math.PI/4))*radius,this.g.cellSize/4,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
	}
}

View.Game.PenSocMakeTranslator=function() {
	var rRadius=2.2*this.g.cellSize;
	var centerX=this.g.areaWidth-rRadius;
	var centerY=this.g.areaHeight-rRadius;

	var radius=1.5*this.g.cellSize;
	
	for(var i=0;i<8;i++) {
		var angleStep=((-2-i)+16)%8;
		if(this.mViewAs==JocGame.PLAYER_B)
			angleStep=((2-i)+16)%8;
		var arrow=$("<canvas/>").addClass("arrow").css({
			left: centerX+Math.cos(angleStep*(Math.PI/4))*radius-this.g.cellSize/2,
			top: centerY+Math.sin(angleStep*(Math.PI/4))*radius-this.g.cellSize/2,
			"border-radius": this.g.cellSize/2,
		}).attr("width",this.g.cellSize).attr("height",this.g.cellSize).appendTo(this.g.area).attr("joc-dir",i).hide();
		this.PenSocRotate(arrow,angleStep*45+90);
		var ctx=arrow[0].getContext("2d");
		ctx.drawImage(this.g.imagesRes,400,400,200,200,0,0,this.g.cellSize,this.g.cellSize)
	}
}

View.Game.PenSocMakePenguinHandlers=function() {
	var $this=this;
	
	function MakeLighter(y,type) {
		var lighter=$("<div/>").addClass(type).css({
			top: y,
			right: $this.g.cellSize*0.1,
			width: $this.g.cellSize*2.4,
			height: $this.g.cellSize*1.5,
			"border-radius": $this.g.cellSize*0.2,
			"background-color": type=="highlighter"?"#ff9900":"#ff66cc",
		}).appendTo($this.g.area);
		return lighter;
	}
	function MakeFront(y) {
		var front=$("<div/>").addClass("front").css({
			top: y,
			right: $this.g.cellSize*0.2,
			width: $this.g.cellSize*2.1,
			height: $this.g.cellSize*1.3,
			"border-radius": $this.g.cellSize*0.2,
		}).appendTo($this.g.area);
		return front;		
	}	
	
	this.g.buttonsCanvas=$("<canvas/>").addClass("pensoc-buttons-canvas").css({
		right: 0,
		top: 0,
	}).attr("width",3*this.g.cellSize).attr("height",this.g.areaHeight).appendTo(this.g.area).hide();
	var ctx=this.g.buttonsCanvas[0].getContext("2d");
	function DrawBackground(y) {
		ctx.drawImage($this.g.imagesRes,0,600,300,200,$this.g.cellSize*0.6,y,$this.g.cellSize*2.25,$this.g.cellSize*1.5);
	}
	this.g.handleHighlighters=[];
	this.g.handleBacklighters=[];
	this.g.handleFronts=[];
	this.g.handlePenguins=[];
	for(var type=0;type<3;type++) {
		var index=2-type;
		DrawBackground(index*1.6*this.g.cellSize+0.2*this.g.cellSize);
		this.g.handleHighlighters.push(MakeLighter(index*1.6*this.g.cellSize+0.2*this.g.cellSize,"highlighter").hide());
		this.g.handleBacklighters.push(MakeLighter(index*1.6*this.g.cellSize+0.2*this.g.cellSize,"backlighter").hide());
		this.g.handleFronts.push(MakeFront(index*1.6*this.g.cellSize+0.3*this.g.cellSize).attr("joc-type",type).hide());
		this.g.handlePenguins.push(this.PenSocMakePenguin({
			x: this.g.areaWidth-this.g.cellSize*1.3,
			y: index*this.g.cellSize*1.6+0.9*this.g.cellSize,
			size: this.g.cellSize*1.3,
			type: type,
			swimming: false,
		}).hide());
	}

	this.g.standingCanvas=$("<canvas/>").addClass("pensoc-buttons-canvas").css({
		right: 0,
		top: this.g.cellSize*7,
	}).attr("width",3*this.g.cellSize).attr("height",2*this.g.cellSize).appendTo(this.g.area).hide();
	var ctx=this.g.standingCanvas[0].getContext("2d");
	ctx.drawImage(this.g.imagesRes,0,600,300,200,$this.g.cellSize*0.6,$this.g.cellSize*0.5,$this.g.cellSize*2.25,$this.g.cellSize*1.5);
	ctx.drawImage(this.g.imagesRes,300,600,300,200,$this.g.cellSize*0.5,$this.g.cellSize*0.5,$this.g.cellSize*2.25,$this.g.cellSize*1.5);
	this.g.standingHighlighter=MakeLighter(7.5*this.g.cellSize,"highlighter").hide();
	this.g.standingFront=MakeFront(7.6*this.g.cellSize).hide();

	this.g.slidingCanvas=$("<canvas/>").addClass("pensoc-buttons-canvas").css({
		right: 0,
		top: this.g.cellSize*8.6,
	}).attr("width",3*this.g.cellSize).attr("height",2*this.g.cellSize).appendTo(this.g.area).hide();
	var ctx=this.g.slidingCanvas[0].getContext("2d");
	ctx.drawImage(this.g.imagesRes,0,600,300,200,$this.g.cellSize*0.6,$this.g.cellSize*0.5,$this.g.cellSize*2.25,$this.g.cellSize*1.5);
	ctx.drawImage(this.g.imagesRes,600,600,300,200,$this.g.cellSize*0.5,$this.g.cellSize*0.5,$this.g.cellSize*2.25,$this.g.cellSize*1.5);
	this.g.slidingHighlighter=MakeLighter(9.1*this.g.cellSize,"highlighter").hide();
	this.g.slidingFront=MakeFront(9.2*this.g.cellSize).hide();


}

View.Game.DestroyView=function() {
	this.mWidget.empty();
}

/* Display the current board 
 * Board based member: 'this' is a board instance. 
 */
View.Board.Display=function(aGame) {
	//JocLog("Display");
	if(this.ball==-1)
		aGame.g.ball.css({
			top: aGame.g.center-aGame.g.cellSize/2,
			left: aGame.g.center-aGame.g.cellSize/2,			
		}).show();
	else {
		var coord=aGame.g.Coord[this.ball];
		aGame.g.ball.css({
			top: coord[1]-aGame.g.cellSize/2,
			left: coord[0]-aGame.g.cellSize/2,			
		}).show();
	}
		
	for(var i=0;i<this.penguins.length;i++) {
		var penguin=this.penguins[i];
		var vPenguin=aGame.g.penguins[i];
		if(penguin.p==-1)
			aGame.PenSocUpdatePenguin(vPenguin.widget,{
				x: aGame.g.initialPos[i][0], 
				y: aGame.g.initialPos[i][1],
				dir: penguin.d,
				swimming: true,
			});
		else 
			aGame.PenSocUpdatePenguin(vPenguin.widget,{
				x: aGame.g.Coord[penguin.p][0], 
				y: aGame.g.Coord[penguin.p][1], 
				dir: penguin.d,
				swimming: false,
			});
		vPenguin.widget.show();
	}
	
	// display rotator for development
	//aGame.mWidget.find(".rotator").show();
	//aGame.mWidget.find(".highlighter").show();
}

View.Board.PenSocClearInput=function(aGame) {
	aGame.mWidget.find(".highlighter,.backlighter,.arrow").hide();
	aGame.mWidget.find(".front").hide().unbind(JocGame.CLICK);
	aGame.mWidget.find(".board-arrow").remove();
	aGame.g.rotatorPenguin.hide();
	aGame.g.rotatorBall.hide();
	aGame.g.standingCanvas.hide();
	aGame.g.slidingCanvas.hide();
	aGame.g.rotator.hide();
	aGame.g.cancelButton.hide();
}

View.Board.HumanTurn=function(aGame) {
	var $this=this;
	var penguinBackData=[];
	var skippedMovePos;
	var moves=this.PenSocGetAllMoves(aGame);
	var move={
		i: -1,
		p: -1,
		d: -1,
		md: -1,
	}
	//JocLog("HumanTurn",moves.length,moves);

	aGame.g.buttonsCanvas.show();
	for(var i=0;i<3;i++) {
		var penguin=this.penguins[i+(this.mWho==JocGame.PLAYER_A?0:3)];
		aGame.PenSocUpdatePenguin(aGame.g.handlePenguins[i].show(),{
			which: this.mWho,
			dir: penguin.d,
		});
	}
	
	function Input() {
		JocLog("Input",move,penguinBackData);
		$this.PenSocClearInput(aGame);

		if(move.i>-1) {
			aGame.g.cancelButton.show();
			aGame.g.cancelBacklighter.show();
			aGame.g.cancelFront.show().bind(JocGame.CLICK,function() {
				aGame.PenSocUpdatePenguin(aGame.g.penguins[move.i].widget,penguinBackData[0]);
				penguinBackData=[];
				move={i:-1,p:-1,md:-1,d:-1};
				Input();
			});
		}
		
		if(move.i==-1) {
			var indexes={};
			for(var i in moves)
				indexes[moves[i].i]=true;
			for(var i in indexes) {
				var penguin=$this.penguins[i];
				var highlighter;
				if(penguin.p==-1) {
					highlighter=aGame.mWidget.find(".highlighter[joc-index="+penguin.i+"]");
					aGame.mWidget.find(".front[joc-index="+penguin.i+"]").show().bind(JocGame.CLICK,function() {
						move.i=parseInt($(this).attr("joc-index"));
						$this.PenSocAnimatePenguin(aGame,move.i,$this.mWho==JocGame.PLAYER_A?0:63,-1,function(backPenguin) {
							penguinBackData.push(backPenguin);
							Input();
						});
					});
				} else {
					highlighter=aGame.mWidget.find(".highlighter[joc-pos="+penguin.p+"]");
					aGame.mWidget.find(".front[joc-pos="+penguin.p+"]").show().bind(JocGame.CLICK,function() {
						move.i=$this.board[parseInt($(this).attr("joc-pos"))].i;
						penguinBackData.push(aGame.g.penguins[move.i].widget.data("data"));
						Input();
					});
				}
				highlighter.show();
				aGame.g.handleHighlighters[penguin.t].show();
				aGame.g.handleFronts[penguin.t].show().bind(JocGame.CLICK,function() {
					var type=parseInt($(this).attr("joc-type"));
					move.i=type+($this.mWho==JocGame.PLAYER_A?0:3);
					if($this.penguins[i].p==-1)  {
						$this.PenSocAnimatePenguin(aGame,move.i,$this.mWho==JocGame.PLAYER_A?0:63,-1,function(backPenguin) {
							penguinBackData.push(backPenguin);
							Input();
						});						
					} else {
						penguinBackData.push(aGame.g.penguins[move.i].widget.data("data"));
						Input();
					}
				});
			}
		} else if(move.p==-1) {
			var poss={};
			for(var i in moves)
				if(moves[i].i==move.i)
					poss[moves[i].p]=true;
			var mds={}, mdSlideCount=0;
			for(var i in moves)
				if(moves[i].i==move.i) {
					mds[moves[i].md]=true;
					if(moves[i].md!=-1)
						mdSlideCount++;
				}
			var pCount=0;
			for(var pos in poss)
				pCount++;
			if(pCount==1) {
				//penguinBackData.push(aGame.g.penguins[move.i].widget.data("data"));
				move.p=parseInt(pos);
				move.md=moves[0].md;
				skippedMovePos=true;
				if($this.penguins[move.i].p==move.p)
					Input();
				else {
					$this.PenSocAnimatePenguin(aGame,move.i,move.p,move.md,function(backPenguin) {
						Input();
					});
				}
				return;
			}
			skippedMovePos=false;
			
			for(var pos in poss) {
				if(parseInt(pos)!=$this.penguins[move.i].p) {
					aGame.mWidget.find(".highlighter[joc-pos="+pos+"]").show();
					aGame.mWidget.find(".front[joc-pos="+pos+"]").show().bind(JocGame.CLICK,function() {
						move.p=parseInt($(this).attr("joc-pos"));
						for(var i=0;i<moves.length;i++) {
							var move0=moves[i];
							if(move0.i==move.i && move0.p==move.p) {
								move.md=move0.md;
								break;
							}
						}
						if($this.ball!=-1 && $this.penguins[move.i].p==$this.ball) {
							$this.PenSocAnimateBall(aGame,move.p,function() {
								Input();
							});
						} else {
							$this.PenSocAnimatePenguin(aGame,move.i,move.p,move.md,function(backPenguin) {
								penguinBackData.push(backPenguin);
								Input();
							});
						}
					});
				}
			}
			if($this.penguins[move.i].d>-1) {
				if(mdSlideCount>0) {
					aGame.g.slidingHighlighter.show();
					aGame.g.slidingCanvas.show();
					aGame.g.slidingFront.show().bind(JocGame.CLICK,function() {
						for(var i in moves) 
							if(moves[i].i==move.i && moves[i].md!=-1) {
								move.p=moves[i].p;
								move.md=moves[i].md;
								break;
							}
						$this.PenSocAnimatePenguin(aGame,move.i,move.p,move.md,function(backPenguin) {
							penguinBackData.push(backPenguin);
							Input();
						});
					});
				}
				aGame.g.standingHighlighter.show();
				aGame.g.standingCanvas.show();
				aGame.g.standingFront.show().bind(JocGame.CLICK,function() {
					move.p=$this.penguins[move.i].p;
					move.md=-1;
					Input();
				});
			} else {
				if($this.ball!=-1 && $this.penguins[move.i].p==$this.ball) {
					aGame.g.rotatorBall.show();
				} else {
					aGame.PenSocUpdatePenguin(aGame.g.rotatorPenguin,{
						dir: -1,
						type: $this.penguins[move.i].t,
						which: $this.penguins[move.i].s,
					});
					aGame.g.rotatorPenguin.show();
				}
				for(var md in mds) {
					if(md!=-1) {
						aGame.mWidget.find(".arrow[joc-dir="+md+"]").show();
						aGame.g.directions[md].highlighter.show();
						aGame.g.directions[md].front.show().bind(JocGame.CLICK,function() {
							var md=parseInt($(this).attr("joc-dir"));
							for(var i in moves)
								if(moves[i].i==move.i && moves[i].md==md) {
									move.md=md;
									move.p=moves[i].p;
									break;
								}
							if($this.ball!=-1 && $this.penguins[move.i].p==$this.ball) {
								$this.PenSocAnimateBall(aGame,move.p,function() {
									Input();
								});
							} else {
								$this.PenSocAnimatePenguin(aGame,move.i,move.p,move.md,function(backPenguin) {
									penguinBackData.push(backPenguin);
									Input();
								});
							}
						});
					}
				}
			}
			var penguin=$this.penguins[move.i];
			var backfront;
			if(penguin.p==-1) {
				var corner=$this.mWho==JocGame.PLAYER_A?0:63;
				aGame.mWidget.find(".backlighter[joc-pos="+corner+"]").show();
				backfront=aGame.mWidget.find(".front[joc-pos="+corner+"]");
			} else {
				aGame.mWidget.find(".backlighter[joc-pos="+penguin.p+"]").show();
				backfront=aGame.mWidget.find(".front[joc-pos="+penguin.p+"]");
			}
			aGame.g.handleBacklighters[penguin.t].show();
			backfront.push(aGame.g.handleFronts[penguin.t][0]);
			backfront.show().bind(JocGame.CLICK,function() {
				var penguinData=penguinBackData.pop();
				var vPenguin=aGame.g.penguins[move.i].widget;
				aGame.PenSocUpdatePenguin(vPenguin,penguinData);
				move.i=-1;
				Input();
			});
		} else {
			aGame.mWidget.find(".rotator").show();
			aGame.mWidget.find(".rotator.highlighter").hide();
			var dirs={};
			var moveCount=0;
			var moveDir;
			for(var i in moves)
				if(moves[i].i==move.i && moves[i].p==move.p) {
					dirs[moves[i].d]=true;
					moveDir=moves[i].md;
					moveCount++;
				}
			if(moveCount==1) {
				move.md=moveDir;
				aGame.MakeMove(move);
				return;
			}
			aGame.mWidget.find(".rotator-circle").show();
			aGame.PenSocUpdatePenguin(aGame.g.rotatorPenguin,{
				which: $this.mWho,
				dir: moveDir,
				type: $this.penguins[move.i].t,
			});
			for(var dir in dirs) {
				aGame.mWidget.find(".highlighter[joc-dir="+dir+"]").show();
				var front=aGame.mWidget.find(".front[joc-dir="+dir+"]");
				var pos=aGame.g.Graph[move.p][dir];
				if(pos!=null) {
					var coord=aGame.g.Coord[pos];
					var canvas=$("<canvas/>").addClass("board-arrow").css({
						top: coord[1]-aGame.g.cellSize/2,
						left: coord[0]-aGame.g.cellSize/2,
					}).attr("width",aGame.g.cellSize).attr("height",aGame.g.cellSize).attr("joc-pos",pos).attr("joc-dir",dir).appendTo(aGame.g.area);
					var ctx=canvas[0].getContext("2d");
					ctx.drawImage(aGame.g.imagesRes,800,400,200,200,0,0,aGame.g.cellSize,aGame.g.cellSize);
					var deg=aGame.mViewAs==JocGame.PLAYER_A?
							[0,-45,-90,-135,180,135,90,45]:
							[180,135,90,45,0,-45,-90,-135];
					aGame.PenSocRotate(canvas,deg[dir]);
					front.push(aGame.mWidget.find(".front[joc-pos="+pos+"]")[0]);
				}
				front.show().bind(JocGame.CLICK,function() {
					if($(this)[0].hasAttribute("joc-dir"))
						move.d=parseInt($(this).attr("joc-dir"));
					else
						move.d=parseInt(aGame.mWidget.find(".board-arrow[joc-pos="+$(this).attr("joc-pos")+"]").attr("joc-dir"));
					aGame.MakeMove(move);
				});
			}
			aGame.mWidget.find(".backlighter[joc-pos="+move.p+"]").show();
			aGame.mWidget.find(".front[joc-pos="+move.p+"]").show().bind(JocGame.CLICK,function() {
				var penguinData=penguinBackData.pop();
				var vPenguin=aGame.g.penguins[move.i].widget;
				aGame.PenSocUpdatePenguin(vPenguin,penguinData);
				if(skippedMovePos)
					move.i=-1;
				move.p=-1;
				move.md=-1;
				aGame.g.rotatorPenguin.hide();
				aGame.mWidget.find(".rotator-circle").hide();
				Input();
			});
		}
	}
	
	Input();
}

/* Optional method.
 * Board based member: 'this' is a board instance. 
 * If implemented, it is called after a human player made the move.
 */
View.Board.HumanTurnEnd=function(aGame) {
	this.PenSocClearInput(aGame);
}

View.Board.PenSocAnimatePenguin=function(aGame,index,to,dir,fnt) {
	var vPenguin=aGame.g.penguins[index].widget;
	var penguinData=JSON.parse(JSON.stringify(vPenguin.data("data")));
	aGame.PenSocUpdatePenguin(vPenguin,{
		swimming: false,
		dir: dir,
	})
	var coord=aGame.g.Coord[to];
	this.PenSocClearInput(aGame);
	vPenguin.animate({
		top: coord[1]-aGame.g.cellSize/2,
		left: coord[0]-aGame.g.cellSize/2,
	},400,function() {
		aGame.PenSocUpdatePenguin(vPenguin,{
			y: coord[1],
			x: coord[0],			
		});
		fnt(penguinData);
	});
	
}

View.Board.PenSocAnimateBall=function(aGame,to,fnt) {
	var coord=aGame.g.Coord[to];
	this.PenSocClearInput(aGame);
	aGame.g.ball.animate({
		top: coord[1]-aGame.g.cellSize/2,
		left: coord[0]-aGame.g.cellSize/2,
	},400,function() {
		fnt();
	});
	
}

View.Board.PlayedMove=function(aGame,aMove) {
	var vPenguin=aGame.g.penguins[aMove.i].widget;
	var from=aGame.mOldBoard.penguins[aMove.i].p;
	var to=this.penguins[aMove.i].p;
	if(from!=-1 && aGame.mOldBoard.ball==from) {
		var coord=aGame.g.Coord[aMove.p];
		aGame.g.ball.animate({
			top: coord[1]-aGame.g.cellSize/2,
			left: coord[0]-aGame.g.cellSize/2,
		},700,function() {
			aGame.MoveShown();						
		});
	} else if(from!=to) {
		if(from==-1) {
			var corner=this.mWho==JocGame.PLAYER_A?0:63;
			var coord=aGame.g.Coord[corner];
			aGame.PenSocUpdatePenguin(vPenguin,{
				swimming: false,
				dir: aMove.md,
			});
			vPenguin.animate({
				top: coord[1]-aGame.g.cellSize/2,
				left: coord[0]-aGame.g.cellSize/2,
			},300,function() {
				if(to==corner)
					aGame.MoveShown();
				else {
					var coord=aGame.g.Coord[to];
					vPenguin.animate({
						top: coord[1]-aGame.g.cellSize/2,
						left: coord[0]-aGame.g.cellSize/2,
					},700,function() {
						aGame.MoveShown();						
					});
				}
			})
		} else {
			aGame.PenSocUpdatePenguin(vPenguin,{
				dir: aMove.md,
			});
			var coord=aGame.g.Coord[to];
			vPenguin.animate({
				top: coord[1]-aGame.g.cellSize/2,
				left: coord[0]-aGame.g.cellSize/2,
			},700,function() {
				aGame.MoveShown();						
			});
			
		}
	} else {
		aGame.MoveShown();		
	}
	return false;
}

/* Optional method.
 * Board based member: 'this' is a board instance. 
 * If implemented, must return true if there is no need to wait for an animation to achieve,
 * if it returns false, the implementation must ensure it will call aMoveDoneFnt to resume 
 * the game. 
 */
View.Board.ShowEnd=function(aGame) {
	return true;
}

