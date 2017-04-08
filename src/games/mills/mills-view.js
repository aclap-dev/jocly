/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

View.Game.MillsDrawPiece=function(canvas,color) {
	var ctx=canvas[0].getContext("2d");
	var l=ctx.canvas.width;
	var m=l/5;

	ctx.clearRect(0,0,l,l);

	var path="";
	// token
	switch(this.mSkin){
		default:
		break;
		case 'wood':
		path=this.mViewOptions.fullPath+"/res/images/";
	    switch(color){
	    	default:
	    	path=path+"ballblack2.png";
	    	break;
	    	case "white":
	    	path=path+"ballshinywood.png";
	    	break;
	    }
	    break;
		case 'suede':
		path=this.mViewOptions.fullPath+"/res/images/";
	    switch(color){
	    	default:
	    	path=path+"oursin.png";
	    	break;
	    	case "white":
	    	path=path+"coq2.png";
	    	break;
	    }
	    break;
		case 'stone':
		path=this.mViewOptions.fullPath+"/res/images/";
	    switch(color){
	    	default:
	    	path=path+"ballblack.png";
	    	break;
	    	case "white":
	    	path=path+"ballwhitestone.png";
	    	break;
	    }
	    break;
	}
	
	if(path.length>0){
		var imageObj = new Image();
	    imageObj.onload = function(){
	        ctx.drawImage(imageObj, m/2, m/2, l-m, l-m);
	    }
		imageObj.src = path;		
	}else{
		// shadow
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle="rgba(0,0,0,0.5)";
		ctx.arc(l/2,l/2+m/2,(l-m)/2,0,Math.PI*2,true);
		ctx.fill();
		ctx.restore();
		
		// token
		var grad=ctx.createLinearGradient(0,0,0,l);
		if (color=="white"){
			grad.addColorStop(1, 'rgb(204,204,204)');
			grad.addColorStop(0, 'rgb(255,255,255)');
		}else{
			grad.addColorStop(0, 'rgb(102,102,102)');
			grad.addColorStop(1, 'rgb(0,0,0)');
		}
		ctx.fillStyle=grad;
		ctx.beginPath();
		ctx.strokeStyle="rgba(128,128,128,0.8)";
		ctx.arc(l/2,l/2,(l-m)/2,0,Math.PI*2,true);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	
		ctx.beginPath();
		ctx.strokeStyle="rgba(128,128,128,0.3)";
		ctx.arc(l/2,l/2,(l-m)/2.5,0,Math.PI*2,true);
		ctx.stroke();
		ctx.closePath();	
		ctx.beginPath();
		ctx.arc(l/2,l/2,(l-m)/8,0,Math.PI*2,true);
		ctx.stroke();
		ctx.closePath();
	}
}

View.Game.MillsDrawBoard=function() {
		
	var path="";
	// token
	switch(this.mSkin){
		default:
		path=this.mViewOptions.fullPath+"/res/images/"+this.mOptions.mencount+"mensboard-"+this.mSkin+".jpg";
		break;
		case 'basic':
		break;
	}
	
	if (path.length>0){
		var ctx=this.g.ctxField;
		ctx.save();
		ctx.clearRect(0,0,this.g.boardW,this.g.boardH);		
		var GAME=this;			
		var imageObj = new Image();
	    imageObj.onload = function(){
	    	if(GAME.g.boardW>0 && GAME.g.boardH>0)
	    		ctx.drawImage(imageObj, 0, 0, GAME.g.boardW, GAME.g.boardH);
	    };
	    imageObj.src = path;
		ctx.restore();
	}else{
		var aGame=this;
		var ctx=this.g.ctxField;
		ctx.save();
/*
		var boardGradient = ctx.createRadialGradient(
			-this.g.boardW/2,-this.g.boardW/2,0,
			this.g.boardW/6*4,this.g.boardW/6*4,this.g.boardW*2);
		boardGradient.addColorStop(0,"#BAF445");
		boardGradient.addColorStop(1,"#008000");
*/
		var boardGradient = ctx.createRadialGradient(
			this.g.boardW/2,-this.g.boardH/2,0,
			this.g.boardW/2,-this.g.boardW/2,2*this.g.boardH);
		boardGradient.addColorStop(0,"#BAF445");
		boardGradient.addColorStop(1,"#008000");
	
		
		ctx.fillStyle = boardGradient ;
		ctx.beginPath();
		ctx.rect(0,0,this.g.boardW,this.g.boardH);
		ctx.closePath();	
		ctx.fill();
	
		function DrawLine(fr,fc,tr,tc) {
			aGame.g.ctxField.beginPath();
			aGame.g.ctxField.moveTo(aGame.g.cellSide/2+(fc+1)*aGame.g.cellSide,aGame.g.cellSide/2+fr*aGame.g.cellSide);
			aGame.g.ctxField.lineTo(aGame.g.cellSide/2+(tc+1)*aGame.g.cellSide,aGame.g.cellSide/2+tr*aGame.g.cellSide);
			aGame.g.ctxField.closePath();
			aGame.g.ctxField.strokeStyle="rgb(50,50,50)";
			aGame.g.ctxField.lineWidth=aGame.g.cellSide/10;
			aGame.g.ctxField.stroke();	
		}
	
		var lines=this.MillsGetLines();
		for(var i in lines) {
			var segment=lines[i];
			DrawLine(segment[0],segment[1],segment[2],segment[3]);		
		}
	
		function DrawDisk(r,c) {
			aGame.g.ctxField.beginPath();
			aGame.g.ctxField.fillStyle="rgb(50,50,50)";
			aGame.g.ctxField.arc(aGame.g.cellSide/2+(c+1)*aGame.g.cellSide,aGame.g.cellSide/2+r*aGame.g.cellSide,aGame.g.cellSide/5,0,Math.PI*2,true);
			aGame.g.ctxField.closePath();
			aGame.g.ctxField.fill();	
	
			aGame.g.ctxField.beginPath();
			aGame.g.ctxField.fillStyle="rgb(255,255,255)";
			aGame.g.ctxField.arc(aGame.g.cellSide/2+(c+1)*aGame.g.cellSide,aGame.g.cellSide/2+r*aGame.g.cellSide,aGame.g.cellSide/10,0,Math.PI*2,true);
			aGame.g.ctxField.closePath();
			aGame.g.ctxField.fill();	
		}
	
		for(var i in this.g.Coord) {
			var coord=this.g.Coord[i];
			DrawDisk(coord[0],coord[1]);
		}
	}
	
}

View.Game.MillsDrawCell=function(row,col,top,left,width,height) {
}

View.Game.MillsSetCellSide=function() {
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	var smallDimension=Math.min(this.mGeometry.width/(WIDTH+2), this.mGeometry.height/(HEIGHT))-1;
	this.g.cellSide = smallDimension;
}

View.Game.MillsSetBoardSize=function() {
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	this.g.boardW=this.g.cellSide*(WIDTH+2);
	this.g.boardH=this.g.cellSide*HEIGHT;
}

View.Game.MillsGetCellPosition=function(row,col) {
	var col0=col;
	var row0=row;
	if(this.mViewAs==JocGame.PLAYER_B)
		col0=this.mOptions.width-1-col;
	if(this.mViewAs==JocGame.PLAYER_A)
		row0=this.mOptions.height-1-row;
	return {
		"top": this.g.top+row0*this.g.cellSide,
		"left": this.g.left+(col0+1)*this.g.cellSide,
	}
}

View.Game.MillsMarginFactor = 16;
View.Game.MillsPossibleMarginFactor = 0;

View.Game.InitView=function() {
	
	var $this=this;
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;

	this.MillsSetCellSide();
	
	this.g.cellMargin=Math.floor(this.g.cellSide/this.MillsMarginFactor);
	this.g.tokenSide=this.g.cellSide-2*this.g.cellMargin;
	this.MillsSetBoardSize();
	this.g.top=Math.floor((this.mGeometry.height-this.g.boardH)/2);
	this.g.left=Math.floor((this.mGeometry.width-this.g.boardW)/2);
	
	var board=$("<div/>").addClass("mills-board").css({
		top: this.g.top,
		left: this.g.left,
		width: this.g.boardW,
		height: this.g.boardH,
	}).appendTo(this.mWidget);

	var canvas=$("<canvas/>").attr("width",this.g.boardW).attr("height",this.g.boardH).appendTo(board);
	this.g.ctxField = canvas[0].getContext("2d");
	this.g.ctxField.clearRect(0,0,this.g.boardW,this.g.boardH);
	this.g.ctxField.save();
	this.MillsDrawBoard();


	this.g.ctxField.restore();

	var aGame=this;
	function CreatePiece(side,index,sideIndex) {
		var pieceClass;
		switch(side) {
		case JocGame.PLAYER_A: pieceClass="piece-white"; break;
		case JocGame.PLAYER_B: pieceClass="piece-black"; break;
		}
		var piece = $("<div/>").addClass("piece").addClass(pieceClass)
			.css({
				"width": aGame.g.cellSide-2*aGame.g.cellMargin,
				"height": aGame.g.cellSide-2*aGame.g.cellMargin,
				"border-radius": Math.floor((aGame.g.cellSide-2*aGame.g.cellMargin)/2),
			}).hide();
		var color=side==JocGame.PLAYER_A?"white":"black";
		piece.attr("jocindex",index);
		piece.appendTo(aGame.mWidget);
		var canvas=$("<canvas/>").addClass("piece-canvas").attr("width",aGame.g.cellSide-2*aGame.g.cellMargin).attr("height",aGame.g.cellSide-2*aGame.g.cellMargin);
		canvas.appendTo(piece);
		$this.MillsDrawPiece(canvas,color);
	}
	var index=0;
	for(var i=0;i<this.mOptions.mencount;i++)
		CreatePiece(JocGame.PLAYER_A,index++,i);
	for(var i=0;i<this.mOptions.mencount;i++)
		CreatePiece(JocGame.PLAYER_B,index++,i);
	
	for(var i in this.g.Coord) {
		var cCoord=this.g.Coord[i];
		var r=cCoord[0];
		var c=cCoord[1];
		/*
		if(aGame.mViewAs==JocGame.PLAYER_A)
			r=HEIGHT-r-1;
		else
			c=WIDTH-c-1;
		*/
		var position=this.MillsGetCellPosition(r,c);
		if(this.mShowMoves) {
			var highlight = $("<div/>").addClass("possible")
			.css({
				"width": this.g.cellSide-this.MillsPossibleMarginFactor*aGame.g.cellMargin,
				"height": this.g.cellSide-this.MillsPossibleMarginFactor*aGame.g.cellMargin,
				"border-radius": Math.floor((aGame.g.cellSide-this.MillsPossibleMarginFactor*aGame.g.cellMargin)/2),
	 			"top": position.top+(this.MillsPossibleMarginFactor*this.g.cellMargin)/2,
	 			"left": position.left+(this.MillsPossibleMarginFactor*this.g.cellMargin)/2,
			}).hide();
			highlight.attr("jocpos",i);
			highlight.appendTo(aGame.mWidget);
		}
		var front = $("<div/>").addClass("front")
		.css({
			"width": this.g.cellSide,
			"height": this.g.cellSide,
 			"top": position.top,
 			"left": position.left,
		});
		front.attr("jocpos",i);
		front.appendTo(aGame.mWidget);
		this.MillsDrawCell(r,c,position.top,position.left,this.g.cellSide,this.g.cellSide);
		if(this.mNotation) {
			$("<div/>").text(parseInt(i)).addClass("notation").css({
				"line-height": this.g.cellSide/6+"px",
				"font-size": this.g.cellSide/8+"pt",
	 			"top": position.top+3*this.g.cellSide/8,
	 			"left": position.left+3*this.g.cellSide/8,
	 			"width": this.g.cellSide/5+"px",
			}).appendTo(this.mWidget);
		}
	}

}

View.Board.MillsDisplayPiece=function(aGame,piece) {
	var pWidget=aGame.mWidget.find(".piece[jocindex="+piece.i+"]");
	if(piece.a) {
		var top, left;
		if(piece.d>-1) {
			var h=aGame.g.boardH/aGame.mOptions.mencount;
			if(piece.s==aGame.mViewAs) {
				top=aGame.g.top+h*(piece.d+0.5)-aGame.g.cellSide/2;				
				left=aGame.g.left;
			} else {
				top=aGame.g.top+aGame.g.boardH-h*piece.d-h/2-aGame.g.cellSide/2;
				left=aGame.g.left+(aGame.mOptions.width+1)*aGame.g.cellSide;
			}
		} else {
			var coord=aGame.g.Coord[piece.p];
			var position=aGame.MillsGetCellPosition(coord[0],coord[1]);
			top=position.top;
			left=position.left;
		}
		pWidget.css({
			top: top+aGame.g.cellMargin,
			left: left+aGame.g.cellMargin,
			opacity: 1,
		}).show();
	} else 
		pWidget.hide();
}

View.Board.UpdateZIndex=function(aGame){
	$(".piece-white").css("z-index",this.mWho==JocGame.PLAYER_A?101:100);
	$(".piece-black").css("z-index",this.mWho==JocGame.PLAYER_A?100:101);
}

View.Board.Display=function(aGame) {
	for(var i=0;i<this.pieces.length;i++) {
		var piece=this.pieces[i];
		this.MillsDisplayPiece(aGame,piece);
	}
}

View.Board.MillsMovePiece=function(aGame,index,pos,fnt) {
	var coord=aGame.g.Coord[pos];
	var position=aGame.MillsGetCellPosition(coord[0],coord[1]);
	var pWidget=aGame.mWidget.find(".piece[jocindex="+index+"]");
	pWidget.animate({
			"top": position.top+aGame.g.cellMargin,
			"left": position.left+aGame.g.cellMargin,
	},700,function() {
		if(fnt)
			fnt();
		else
			aGame.MoveShown();
	});
}

View.Board.PlayedMove=function(aGame,aMove) {
	
	this.UpdateZIndex(aGame);

	var fromIndex=aMove.f==-1?this.lastMoveIndex:aGame.mOldBoard.board[aMove.f];
	this.MillsMovePiece(aGame,fromIndex,aMove.t,function() {
		if(aMove.c>-1) {
			var catchIndex=aGame.mOldBoard.board[aMove.c];
			var pWidget=aGame.mWidget.find(".piece[jocindex="+catchIndex+"]");
			pWidget.animate({
					"opacity": 0,
			},500,function() {
				aGame.MoveShown();
			});
		} else 
			aGame.MoveShown();
		
	});
	
	return false;
}

View.Board.HumanTurn=function(aGame) {

	this.UpdateZIndex(aGame);

	var $this=this;
	var moves=this.mMoves;
	var backMoves=[];
	var  move={
		f: -1,
		t: -1,
		c: -1,
	}
	
	function CheckMove() {
		for(var i in $this.mMoves) {
			var m=$this.mMoves[i];
			if(m.f==move.f && m.t==move.t && (m.c==move.c || (m.c==-2 && move.c==-1))) {
				aGame.MakeMove(m);
				return;
			}
		}
		UpdateChoice();
	}
	
	function MakeBack() {
		aGame.mWidget.find(".possible").hide().removeClass("possible-back");
		aGame.mWidget.find(".front").removeClass("choice back").unbind(JocGame.CLICK);
		if(backMoves.length>0) {
			var back=backMoves[backMoves.length-1];
			aGame.mWidget.find(".possible[jocpos="+back.pos+"]").show().addClass("possible-back");
			aGame.mWidget.find(".front[jocpos="+back.pos+"]").removeClass("choice").addClass("back").bind(JocGame.CLICK,function() {
				backMoves.pop();
				move=back.move;
				$(this).removeClass("back").unbind(JocGame.CLICK);
				MakeBack();
				UpdateChoice();
			});
		}
		
	}
	
	function UpdateChoice() {
		aGame.mWidget.find(".front.choice").unbind(JocGame.CLICK).removeClass("choice");
		
		for(var p=0;p<aGame.g.Coord.length;p++) {
			var index=$this.board[p];
			var field=null;
			if($this.placing) {
				if(move.t==-1)
					field="t";
				else
					field="c";
			} else {
				if(move.f==-1)
					field="f";
				else if(move.t==-1)
					field="t";
				else
					field="c";
			}
			var valid=false;
			for(var i=0;i<$this.mMoves.length;i++) {
				var m=$this.mMoves[i];
				if((field=="f" && m.f==p) ||
					(field=="t" && m.t==p && m.f==move.f) ||
					(field=="c" && m.c==p && m.f==move.f && m.t==move.t)
					) {
					valid=true;
					break;
				}
			}																		
			if(valid) {
				aGame.mWidget.find(".possible[jocpos="+p+"]").show();
				if(field=='f' || field=='c')
					aGame.mWidget.find(".possible[jocpos="+p+"]").addClass("possible-piece");
				else
					aGame.mWidget.find(".possible[jocpos="+p+"]").removeClass("possible-piece");
				aGame.mWidget.find(".front[jocpos="+p+"]").addClass("choice")
					.bind(JocGame.CLICK,function() {
						var pos=parseInt($(this).attr("jocpos"));
						backMoves.push({
							pos: pos,
							move: JSON.parse(JSON.stringify(move)),
						});
						MakeBack();
						move[field]=pos;
						CheckMove();
					});		
			}
		}
	}
	
	UpdateChoice();
	
}


/* Optional method.
 * Board based member: 'this' is a board instance. 
 * If implemented, it is called after a human player made the move.
 */
View.Board.HumanTurnEnd=function(aGame) {
	aGame.mWidget.find(".possible").hide().removeClass("possible-back");
	aGame.mWidget.find(".front").unbind(JocGame.CLICK).removeClass("choice back");
}
