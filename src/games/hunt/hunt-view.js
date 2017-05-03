/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

View.Game.GameSpecificInit=function(){
}

View.Game.InitView=function() {
	this.HuntInitView();
	this.HuntBuildLayout();
	this.HuntMakeCoord();
	this.HuntDrawBoard();
	this.HuntMakePieces();
	this.GameSpecificInit();
}

View.Game.HuntInitView=function() {
	this.g.backgroundColor="#FFCC66";
	this.g.color="#990000";
	this.g.huntLayout={
		header: 1,
		boardHeight: 4,
		footer: 1,
		left: 1,
		boardWidth: 4,
		right: 1,
	};
	this.g.AisWhite=false;
}

View.Game.HuntBuildLayout=function() {

	this.g.background=$("<div/>").addClass("background").css({
		left: 0,
		top: 0,
		width: this.mGeometry.width,
		height: this.mGeometry.height,
		"background-color": this.g.backgroundColor,
	}).appendTo(this.mWidget);
	
	this.g.areaWidth=Math.min(this.mGeometry.width, this.mGeometry.height*this.mViewOptions.preferredRatio);
	this.g.areaHeight=Math.min(this.mGeometry.width/this.mViewOptions.preferredRatio,this.mGeometry.height);
	
	this.g.left=(this.mGeometry.width-this.g.areaWidth)/2;
	this.g.top=(this.mGeometry.height-this.g.areaHeight)/2;

	this.g.area=$("<div/>").addClass("area").css({
		left: this.g.left,
		top: this.g.top,
		width: this.g.areaWidth,
		height: this.g.areaHeight,
	}).appendTo(this.mWidget);

	this.g.areaCanvas=$("<canvas/>").addClass("area-canvas").css({
		left: 0,
		top: 0,
	}).attr("width",this.g.areaWidth).attr("height",this.g.areaHeight).appendTo(this.g.area);

	this.g.areaCtx=this.g.areaCanvas[0].getContext("2d");
	
	this.g.layout={
		header: null,
		footer: null,
		left: null,
		right: null,
		board: null,
	}

	var layout=this.g.huntLayout; 
	var vWeight=layout.boardHeight || 1;
	vWeight += layout.header || 0;
	vWeight += layout.footer || 0;
	var hWeight=layout.boardWidth || 1;
	hWeight += layout.left || 0;
	hWeight += layout.left || 0;
	this.g.boardLeft=0;
	this.g.boardTop=0;
	this.g.boardHeight=layout.boardHeight?this.g.areaHeight*layout.boardHeight/vWeight:this.g.areaHeight;
	this.g.boardWidth=layout.boardWidth?this.g.areaWidth*layout.boardWidth/hWeight:this.g.areaWidth;
	
	if(layout.header) {
		this.g.boardTop=this.g.areaHeight*(layout.header/vWeight);
		this.g.layout.header=$("<div/>").addClass("layout layout-header").css({
			left: 0,
			top: 0,
			width: this.g.areaWidth,
			height: this.g.boardTop,
		}).appendTo(this.g.area);
	}
	if(layout.footer) {
		this.g.layout.header=$("<div/>").addClass("layout layout-footer").css({
			left: 0,
			top: this.g.boardTop+this.g.boardHeight,
			width: this.g.areaWidth,
			height: this.g.areaHeight*(layout.footer/vWeight),
		}).appendTo(this.g.area);
	}
	if(layout.left) {
		this.g.boardLeft=this.g.areaWidth*(layout.left/hWeight);
		this.g.layout.left=$("<div/>").addClass("layout layout-left").css({
			left: 0,
			top: this.g.boardTop,
			width: this.g.boardLeft,
			height: this.g.boardHeight,
		}).appendTo(this.g.area);
	}
	if(layout.right) {
		this.g.layout.right=$("<div/>").addClass("layout layout-right").css({
			left: this.g.boardLeft+this.g.boardWidth,
			top: this.g.boardTop,
			width: this.g.areaWidth*(layout.left/hWeight),
			height: this.g.boardHeight,
		}).appendTo(this.g.area);
	}

	this.g.board=$("<div/>").addClass("layout layout-board").css({
		left: this.g.boardLeft,
		top: this.g.boardTop,
		width: this.g.boardWidth,
		height: this.g.boardHeight,
	}).appendTo(this.g.area);
}

View.Game.HuntMakeCoord=function() {
	var row0=null, col0=null, row1=null, col1=null;
	for(var i=0;i<this.g.RC.length;i++) {
		var rc=this.g.RC[i];
		var row=rc[0];
		var col=rc[1];
		if(row0==null || row<row0)
			row0=row;
		if(row1==null || row>row1)
			row1=row;
		if(col0==null || col<col0)
			col0=col;
		if(col1==null || col>col1)
			col1=col;
	}
	this.g.Coord=[];
	for(var i=0;i<this.g.RC.length;i++) {
		var rc=this.g.RC[i];
		var row=rc[0];
		var col=rc[1];
		var coord;
		if(this.mViewAs==JocGame.PLAYER_A)
			coord=[
                   this.g.boardLeft+(col-col0)/(col1-col0)*this.g.boardWidth,
                   this.g.boardTop+(row-row0)/(row1-row0)*this.g.boardHeight,
                   ];
		else
			coord=[
                   this.g.boardLeft+(col1-col)/(col1-col0)*this.g.boardWidth,
                   this.g.boardTop+(row1-row)/(row1-row0)*this.g.boardHeight,
                   ];
		this.g.Coord.push(coord);
	}
	var distMin=-1;
	for(var pos=0;pos<this.g.Graph.length;pos++) {
		var graph=this.g.Graph[pos];
		for(var d=0;d<graph.length;d++) {
			var pos1=graph[d];
			if(pos1!=null) {
				var dr=Math.abs(this.g.RC[pos][0]-this.g.RC[pos1][0]);
				var dc=Math.abs(this.g.RC[pos][1]-this.g.RC[pos1][1]);
				var dist=Math.sqrt(dr*dr+dc*dc);
				if(distMin<0 || dist<distMin) {
					//JocLog("Dist min",pos,pos1);
					distMin=dist;
				}
			}
		}
	}
	this.g.posSize=Math.min(this.g.boardWidth/(col1-col0)*distMin,this.g.boardHeight/(row1-row0)*distMin);
	if(this.g.posSize<=0) {
		this.g.posSize=this.g.boardWidth/10;
		JocLog("Adjusting posSize",this.g.posSize);
	}
	//JocLog("posSize",this.g.posSize);
	this.g.lineWidth=this.g.posSize*0.05;
	this.g.posRadius=this.g.posSize*0.2;
}

View.Game.HuntDrawLine=function(ctx,pos1,pos2) {
	var x0=this.g.Coord[pos1][0];
	var x1=this.g.Coord[pos2][0];
	var y0=this.g.Coord[pos1][1];
	var y1=this.g.Coord[pos2][1];
	ctx.beginPath();
	ctx.moveTo(x0,y0);
	ctx.lineTo(x1,y1);
	ctx.closePath();
	ctx.stroke();
}

View.Game.HuntPreDrawPositions=function(ctx) {
}

View.Game.HuntDrawBoard=function() {
	var ctx=this.g.areaCtx;
	ctx.lineWidth=this.g.lineWidth;
	ctx.strokeStyle=this.g.color;
	ctx.fillStyle=this.g.color;
	if (this.mSkin=='official'){
		for(var pos=0;pos<this.g.Graph.length;pos++) {
			var graph=this.g.Graph[pos];
			for(var i=0;i<graph.length;i++) {
				var pos1=graph[i];
				if(pos1!=null) {
					this.HuntDrawLine(ctx,pos,pos1);
				}
			}
		}
	}
	this.HuntPreDrawPositions(ctx);
	for(var pos=0;pos<this.g.Coord.length;pos++) {
		var coord=this.g.Coord[pos];
		var x=coord[0];
		var y=coord[1];
		if (this.mSkin=='official'){
			ctx.beginPath();
			ctx.arc(x,y,this.g.posRadius,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
			ctx.save();
			ctx.globalCompositeOperation="destination-out";
			ctx.beginPath();
			ctx.arc(x,y,this.g.posRadius-this.g.lineWidth,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}
		if(this.mNotation) {
			var PosNameMap=this.GetMoveClass().prototype.PosName;
			var posName=pos;
			if(typeof PosNameMap[pos]!="undefined")
				posName=PosNameMap[pos];
			$("<div/>").addClass("notation").css({
				left: x-this.g.posSize*0.2,
				top: y-this.g.posSize*0.15,
				width: this.g.posSize*0.4,
				height: this.g.posSize*0.3,
				"line-height": this.g.posSize*0.3+"px",
				"font-size": this.g.posSize*0.2+"px",
			}).appendTo(this.g.area).text(posName);
		}
		$("<div/>").addClass("highlight").css({
			left: x-this.g.posSize*0.5,
			top: y-this.g.posSize*0.5,
			width: this.g.posSize*1,
			height: this.g.posSize*1,
			"border-radius": this.g.posSize/2,
		}).appendTo(this.g.area).attr("joc-pos",pos).hide();
		$("<div/>").addClass("front").css({
			left: x-this.g.posSize*0.5,
			top: y-this.g.posSize*0.5,
			width: this.g.posSize*1,
			height: this.g.posSize*1,
			"border-radius": this.g.posSize/2,
		}).appendTo(this.g.area).attr("joc-pos",pos).hide();
	}
}

View.Game.HuntMakePieces=function() {
	this.g.pieces=[];
	for(var who=0;who<2;who++) {
		for(var i=0;i<this.g.initialPos[who].length;i++) {
			var pos=this.g.initialPos[who][i];
			var piece=$("<canvas/>").addClass("piece").css({
			}).attr("width",this.g.posSize).attr("height",this.g.posSize).appendTo(this.g.area).hide();
			this.HuntDrawPiece(piece,this.g.AisWhite?2*who-1:1-2*who);
			this.g.pieces.push(piece);
		}
		
	}
}

View.Game.DestroyView=function() {
	this.mWidget.empty();
}

View.Board.Display=function(aGame) {
	var evalData=this.HuntMakeEvalData(aGame);
	if(evalData.catcheePiecesDock.length>0) {
		$(".piece-dock").show();
		$(".piece-count").show().text(evalData.catcheePiecesDock.length);
	} else {
		$(".piece-dock").hide();
		$(".piece-count").hide();		
	}
	for(var i=0;i<this.pieces.length;i++) {
		var piece=this.pieces[i];
		var vPiece=aGame.g.pieces[i];
		if(piece.p<0)
			vPiece.hide();
		else {
			vPiece.css({
				left: aGame.g.Coord[piece.p][0]-aGame.g.posSize/2,
				top: aGame.g.Coord[piece.p][1]-aGame.g.posSize/2,
				opacity: 1,
			}).show();
		}
	}
}

View.Board.HuntClearInput=function(aGame) {
	aGame.mWidget.find(".highlight").removeClass("back").hide();
	aGame.mWidget.find(".front").hide().unbind(JocGame.CLICK);	
}

View.Board.HumanTurn=function(aGame) {
	var $this=this;
	var move={p:[]};
	var moves=[];
	if(aGame.g.useDrop)
		moves=this.HuntGetAllDropMoves(aGame);
	if(moves.length==0)
		moves=this.HuntGetAllMoves(aGame);
	function Input() {
		$this.HuntClearInput(aGame);
		var posMap={};
		var moveCount=0;
		var move0;
		for(var i=0;i<moves.length;i++) {
			var match=true;
			for(var j=0;j<move.p.length;j++) {
				if(move.p[j]!=moves[i].p[j]) {
					match=false;
					break;
				}
			}
			if(match) { 
				posMap[moves[i].p[move.p.length]]=moves[i].p[move.p.length];
				moveCount++;
				move0=moves[i];
			}
		}
		if(moveCount==1 && move.p.length==move0.p.length) {
			if(move0.p.length==1)
				$this.HuntAnimateDrop(aGame,-1,move0.p[0],function() {
					aGame.MakeMove(move0);
				});
			else
				aGame.MakeMove(move0);
			return;
		}
		for(var i in posMap) 
			if(posMap.hasOwnProperty(i)) {
				var pos=posMap[i];
				aGame.mWidget.find(".highlight[joc-pos="+pos+"]").show();
				aGame.mWidget.find(".front[joc-pos="+pos+"]").show().bind(JocGame.CLICK,function() {
					move.p.push(parseInt($(this).attr("joc-pos")));
					if(move.p.length>1) {
						$this.HuntClearInput(aGame);
						$this.HuntAnimatePiece(aGame,$this.board[move.p[0]].i,move.p[move.p.length-1],function() {
							Input();						
						});
					} else
						Input();
				});
			}
		if(move.p.length>0) {
			var pos=move.p[move.p.length-1];
			aGame.mWidget.find(".highlight[joc-pos="+pos+"]").show().addClass("back");
			aGame.mWidget.find(".front[joc-pos="+pos+"]").show().bind(JocGame.CLICK,function() {
				if(move.p.length>1) {
					var pieceIndex=$this.board[move.p[0]].i;
					var coord=aGame.g.Coord[move.p[move.p.length-2]];
					aGame.g.pieces[pieceIndex].css({
						left: coord[0]-aGame.g.posSize/2,
						top: coord[1]-aGame.g.posSize/2,
					});
				}
				move.p.pop();
				Input();
			});			
		}
	}
	Input();
}

View.Board.HuntAnimatePiece=function(aGame,pieceIndex,to,fnt) {
	var coord=aGame.g.Coord[to];
	var x=coord[0];
	var y=coord[1];
	aGame.g.pieces[pieceIndex].animate({
		left: x-aGame.g.posSize/2,
		top: y-aGame.g.posSize/2,
	},500,function() {
		fnt();
	});
}

View.Board.HuntAnimateDrop=function(aGame,pieceIndex,to,fnt) {
	//JocLog("AnimateDrop",arguments);
	if(pieceIndex<0)
		for(pieceIndex=0;this.pieces[pieceIndex].s!=this.mWho || this.pieces[pieceIndex].p!=-2;pieceIndex++);
	aGame.g.pieces[pieceIndex].css({
		left: aGame.g.DockCoord[0],
		top: aGame.g.DockCoord[1],
		opacity: 1,
	}).show();
	this.HuntAnimatePiece(aGame,pieceIndex,to,function() {
		fnt();
	});
}

View.Board.HumanTurnEnd=function(aGame) {
	this.HuntClearInput(aGame);
}

View.Board.PlayedMove=function(aGame,aMove) {
	var $this=this;
	var pieceIndex;
	if(aMove.p.length==1) {
		pieceIndex=this.board[aMove.p[0]].i;
		this.HuntAnimateDrop(aGame,pieceIndex,aMove.p[0],function() {
			aGame.MoveShown();
		});
	} else {
		pieceIndex=aGame.mOldBoard.board[aMove.p[0]].i;
		function AnimatePiece(posIndex) {
			$this.HuntAnimatePiece(aGame,pieceIndex,aMove.p[posIndex],function() {
				if(posIndex==aMove.p.length-1) {
					if(typeof aMove.c!="undefined" && aMove.c.length>0) {
						var vPieces=[];
						for(var i=0; i<aMove.c.length)
							vPieces.push(aGame.g.pieces[aGame.mOldBoard.board[aMove.c[i]].i]);
						for(var i=0; i<vPieces.length; i++)
							vPieces[i].animate({opacity:0});
						setTimeout(function() {
							for(var i=0; i<vPieces.length; i++)
								vPieces[i].hide().css("opacity",0);
							aGame.MoveShown();
						},600);
					} else
						aGame.MoveShown();
				} else
					AnimatePiece(posIndex+1);
			});
		}
		AnimatePiece(1);
	}
	return false;
}

View.Board.ShowEnd=function(aGame) {
	return true;
}

View.Game.SpecificSkinHuntDrawPiece=function(canvas,who){
	// to be overloaded
}
View.Game.HuntDrawPiece=function(canvas,who) {
	if (this.mSkin!='official'){
		this.SpecificSkinHuntDrawPiece(canvas,who);
	}else{
		var ctx=canvas[0].getContext("2d");
		var l=canvas[0].width;
		var m=l*0.2;
			
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle="rgba(0,0,0,0.2)";
		ctx.arc(l/2,l/2+m/2,(l-m)/2,0,Math.PI*2,true);
		ctx.fill();
	
		var color=who==JocGame.PLAYER_B?"rgba(255,255,255,1)":"rgba(0,0,0,1)";
		var invcol=who==JocGame.PLAYER_A?"rgba(0,0,0,1)":"rgba(255,255,255,1)";
		var grad=ctx.createLinearGradient(0,0,0,l);
		if (who==JocGame.PLAYER_B) {
			grad.addColorStop(1, 'rgb(204,204,204)');
			grad.addColorStop(0, 'rgb(255,255,255)');
		} else {
			grad.addColorStop(0, 'rgb(102,102,102)');
			grad.addColorStop(1, 'rgb(0,0,0)');
		}
		ctx.fillStyle=grad;
	
		ctx.lineWidth=1;
	
		ctx.beginPath();
		ctx.strokeStyle="rgba(128,128,128,0.8)";
		ctx.arc(l/2,l/2,(l-m)/2,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	
		ctx.beginPath();
		ctx.strokeStyle="rgba(128,128,128,0.8)";
		ctx.arc(l/2,l/2,(l-m)/2.2,0,Math.PI*2,true);
		ctx.closePath();
		ctx.stroke();
	
		ctx.beginPath();
		ctx.strokeStyle="rgba(128,128,128,0.8)";
		ctx.arc(l/2,l/2,(l-m)/2.4,0,Math.PI*2,true);
		ctx.closePath();
		ctx.stroke();
	
		ctx.restore();
	}

}


