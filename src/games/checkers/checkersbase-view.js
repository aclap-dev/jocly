

View.Game.CheckersDrawPieceKing=function(canvas,color) {
	var ctx=canvas[0].getContext("2d");
	var l=ctx.canvas.width;
	var m=l/10;
	
	var path=this.mViewOptions.fullPath+"/res/images/crownwhite.png";
	
	ctx.clearRect(0,0,l,l);
	// shadow
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle="rgba(0,0,0,0.5)";
	ctx.arc(l/2+m/4,l/2+m/2,(l-m)/2,0,Math.PI*2,true);
	ctx.fill();
	ctx.restore();
	// token
	var grad=ctx.createLinearGradient(0,0,0,l);
	if (color=="white"){
		grad.addColorStop(1, 'rgb(204,204,204)');
		grad.addColorStop(0, 'rgb(255,255,255)');
		path=this.mViewOptions.fullPath+"/res/images/crownblack.png";
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

	ctx.strokeStyle="rgba(128,128,128,0.3)";
	ctx.beginPath();
	ctx.arc(l/2,l/2,(l-m)/2.5,0,Math.PI*2,true);
	ctx.stroke();
	ctx.closePath();
	
	var imageObj = new Image();
	var margin=l/4;
    imageObj.onload = function(){
        ctx.drawImage(imageObj, margin, margin, l-2*margin, l-2*margin);
    };
    imageObj.src = path;

}

View.Game.CheckersDrawPiece=function(canvas,color) {
	var ctx=canvas[0].getContext("2d");
	var l=ctx.canvas.width;
	var m=l/10;

	ctx.clearRect(0,0,l,l);
	// shadow
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle="rgba(0,0,0,0.5)";
	ctx.arc(l/2+m/4,l/2+m/2,(l-m)/2,0,Math.PI*2,true);
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

View.Game.CheckersDrawPieceBitmap=function(canvas,x) {
	var ctx=canvas[0].getContext("2d");
	var l=ctx.canvas.width;
	var m=0;
	ctx.clearRect(0,0,l,l);
	ctx.drawImage(this.g.piecesRes,x,0,200,200,m/2,m/2,l-m,l-m);
}

View.Game.CheckersDrawPieceKingHalloween=function(canvas,color) {
	this.CheckersDrawPieceBitmap(canvas,color=="white"?400:600);
}

View.Game.CheckersDrawPieceHalloween=function(canvas,color) {
	this.CheckersDrawPieceBitmap(canvas,color=="white"?0:200);
}

View.Game.CheckersDrawBoard=function() {
}

View.Game.CheckersDrawCell=function(row,col,top,left,width,height) {
}

View.Game.CheckersSetCellSide=function() {
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	var smallDimension=Math.min(this.mGeometry.width/(WIDTH+1), this.mGeometry.height/(HEIGHT+1))-1;
	//this.g.cellSide = Math.floor(smallDimension);
	this.g.cellSide = smallDimension;
}

View.Game.CheckersSetBoardSize=function() {
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	this.g.boardW=this.g.cellSide*WIDTH;
	this.g.boardH=this.g.cellSide*HEIGHT;
}

View.Game.CheckersGetCellPosition=function(row,col) {
	return {
		"top": this.g.top+row*this.g.cellSide,
		"left": this.g.left+col*this.g.cellSide,
	}
}

View.Game.CheckersMarginFactor = 16;
View.Game.CheckersPossibleMarginFactor = -4;

View.Game.InitView=function() {
	
	var $this=this;
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	var INITIAL=this.mOptions.initial;

	this.CheckersSetCellSide();
	
	this.g.cellMargin=Math.floor(this.g.cellSide/this.CheckersMarginFactor);
	this.g.tokenSide=this.g.cellSide-2*this.g.cellMargin;
	this.CheckersSetBoardSize();
	this.g.top=Math.floor((this.mGeometry.height-this.g.boardH)/2);
	this.g.left=Math.floor((this.mGeometry.width-this.g.boardW)/2);
	if(this.mSkin=="halloween")
		this.g.piecesRes=this.preloadedImages['pieces']; 

	
	var board=$("<div/>").addClass("checkersbase-board").css({
		top: this.g.top,
		left: this.g.left,
		width: this.g.boardW,
		height: this.g.boardH,
	}).appendTo(this.mWidget);

	var canvas=$("<canvas/>").attr("width",this.g.boardW).attr("height",this.g.boardH).appendTo(board);
	this.g.ctxField = canvas[0].getContext("2d");
	this.g.ctxField.clearRect(0,0,this.g.boardW,this.g.boardH);
	this.g.ctxField.save();
	this.CheckersDrawBoard();


	this.g.ctxField.restore();

	var aGame=this;
	function CreatePiece(side,index) {
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
		piece.attr("jocindex",index);
		piece.attr("joctype",0);
		piece.appendTo(aGame.mWidget);
		var canvas=$("<canvas/>").addClass("piece-canvas").attr("width",aGame.g.cellSide-2*aGame.g.cellMargin).attr("height",aGame.g.cellSide-2*aGame.g.cellMargin);
		canvas.appendTo(piece);
		if($this.mSkin=="halloween")
			$this.CheckersDrawPieceHalloween(canvas,(side==1 && $this.g.whiteStarts) ||
					(canvas,side==-1 && $this.g.whiteStarts==false)
					?"white":"black");
		else
			$this.CheckersDrawPiece(canvas,(side==1 && $this.g.whiteStarts) ||
				(canvas,side==-1 && $this.g.whiteStarts==false)
				?"white":"black");
	}
	var index=0;
	for(var i in INITIAL.a)
		if(INITIAL.a.hasOwnProperty(i))
			CreatePiece(JocGame.PLAYER_A,index++);
	for(var i in INITIAL.b)
		if(INITIAL.b.hasOwnProperty(i))
			CreatePiece(JocGame.PLAYER_B,index++);
	
	for(var i=0; i<this.g.Coord.length; i++) {
		var cCoord=this.g.Coord[i];
		var r=cCoord[0];
		var c=cCoord[1];
		if(aGame.mViewAs==JocGame.PLAYER_A)
			r=HEIGHT-r-1;
		else
			c=WIDTH-c-1;
		var position=this.CheckersGetCellPosition(r,c);
		if(this.mShowMoves) {
			var highlight = $("<div/>").addClass("possible")
			.css({
				"width": this.g.cellSide-this.CheckersPossibleMarginFactor*aGame.g.cellMargin,
				"height": this.g.cellSide-this.CheckersPossibleMarginFactor*aGame.g.cellMargin,
				"border-radius": Math.floor((aGame.g.cellSide-this.CheckersPossibleMarginFactor*aGame.g.cellMargin)/2),
	 			"top": position.top+(this.CheckersPossibleMarginFactor*this.g.cellMargin)/2,
	 			"left": position.left+(this.CheckersPossibleMarginFactor*this.g.cellMargin)/2,
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
		this.CheckersDrawCell(r,c,position.top,position.left,this.g.cellSide,this.g.cellSide);
		if(this.mNotation) {
			var sz=this.g.cellSide/8;
			$("<div/>").text(parseInt(i)+1).addClass("notation").css({
				"line-height": sz+"px",
				"font-size": sz+"pt",
	 			"top": position.top,
	 			"left": position.left,
	 			"text-shadow": 0+"px "+sz/10+"px "+sz/15+"px" +"#000",
			}).appendTo(this.mWidget);
		}
	}

}

View.Board.Display=function(aGame) {
	var WIDTH=aGame.mOptions.width;
	var HEIGHT=aGame.mOptions.height;
		
	for(var i=0;i<this.pieces.length;i++) {
		var piece=this.pieces[i];
		if(piece!=null) {
			var pWidget=aGame.mWidget.find(".piece[jocindex="+i+"]");
			var side=piece.s;
			if(parseInt(pWidget.attr("joctype"))!=piece.t) {
				pWidget.attr("joctype",piece.t);
				var canvas=pWidget.find("canvas");
				switch(piece.t) {
				case 0: if(aGame.mSkin=="halloween")
							aGame.CheckersDrawPieceHalloween(canvas,(side==1 && aGame.g.whiteStarts) ||
								(canvas,side==-1 && aGame.g.whiteStarts==false)?"white":"black");
						else
							aGame.CheckersDrawPiece(canvas,(side==1 && aGame.g.whiteStarts) ||
									(canvas,side==-1 && aGame.g.whiteStarts==false)?"white":"black");				
				break;
				case 1: if(aGame.mSkin=="halloween")
							aGame.CheckersDrawPieceKingHalloween(canvas,(canvas,side==1 && aGame.g.whiteStarts) ||
									(canvas,side==-1 && aGame.g.whiteStarts==false)?"white":"black");
						else
							aGame.CheckersDrawPieceKing(canvas,(canvas,side==1 && aGame.g.whiteStarts) ||
									(canvas,side==-1 && aGame.g.whiteStarts==false)?"white":"black");
						break;
									
				}
			}
			var tCoord=aGame.g.Coord[piece.p];
			var tr=tCoord[0];
			var tc=tCoord[1];
			if(aGame.mViewAs==JocGame.PLAYER_A)
				tr=HEIGHT-tr-1;
			else
				tc=WIDTH-tc-1;
			var position=aGame.CheckersGetCellPosition(tr,tc);
			pWidget.css({
	 			"top": position.top+aGame.g.cellMargin,
	 			"left": position.left+aGame.g.cellMargin,
			}).show();
		} else {
			aGame.mWidget.find(".piece[jocindex="+i+"]").hide();
		}
	}
}
View.Board.UpdateZIndex=function(aGame){
	$(".piece-white").css("z-index",this.mWho==JocGame.PLAYER_A?101:100);
	$(".piece-black").css("z-index",this.mWho==JocGame.PLAYER_A?100:101);
}
View.Board.PlayedMove=function(aGame,aMove) {
	
	this.UpdateZIndex(aGame);
		
	var WIDTH=aGame.mOptions.width;
	var HEIGHT=aGame.mOptions.height;
	var pIndex=this.board[aMove.pos[aMove.pos.length-1]];
	var pWidget=aGame.mWidget.find(".piece[jocindex="+pIndex+"]");
	function MovePiece(index) {
		var pCoord=aGame.g.Coord[aMove.pos[index]];
		var tr=pCoord[0];
		var tc=pCoord[1];
		if(aGame.mViewAs==JocGame.PLAYER_A)
			tr=HEIGHT-tr-1;
		else
			tc=WIDTH-tc-1;
		var position=aGame.CheckersGetCellPosition(tr,tc);
		pWidget.animate({
 			"top": position.top+aGame.g.cellMargin,
 			"left": position.left+aGame.g.cellMargin,
		},500,function() {
			index++;
			if(index>=aMove.pos.length)
				aGame.MoveShown();
			else
				MovePiece(index);
		});
	}
	MovePiece(1);
	return false;
}

View.Board.HumanTurn=function(aGame) {

	this.UpdateZIndex(aGame);

	var WIDTH=aGame.mOptions.width;
	var HEIGHT=aGame.mOptions.height;
	var moves=this.mMoves;
	var index=0, poss=[], capts=[], $this=this, pWidget;
	
	function MovePiece(pos) {
		var pCoord=aGame.g.Coord[pos];
		var tr=pCoord[0];
		var tc=pCoord[1];
		if(aGame.mViewAs==JocGame.PLAYER_A)
			tr=HEIGHT-tr-1;
		else
			tc=WIDTH-tc-1;
		var position=aGame.CheckersGetCellPosition(tr,tc);
		pWidget.animate({
 			"top": position.top+aGame.g.cellMargin,
 			"left": position.left+aGame.g.cellMargin,
		},500,function() {
		});
	}

	function UpdateChoice() {
		aGame.mWidget.find(".possible").hide();
		aGame.mWidget.find(".front").unbind(JocGame.CLICK).removeClass("choice back");
		if(poss.length>0) {
			aGame.mWidget.find(".front[jocpos="+poss[poss.length-1]+"]").addClass("back").bind(JocGame.CLICK,function() {
				MovePiece(poss[0]);
				index=0;
				poss=[];
				capts=[];
				UpdateChoice();
			});
		}
		var matchingMoves=[];
		for(var i=0; i<moves.length; i++) {
			var move=moves[i];
			var keep=true;
			for(var j=0; j<poss.length; j++) {
				if(poss[j]!=move.pos[j]) {
					keep=false;
					break;
				}
			}
			if(keep)
				matchingMoves.push(move);
		}

		var nextPoss={};
		var nextCapts={};
		for(var i=0; i<matchingMoves.length; i++) {
			var move=matchingMoves[i];
			nextPoss[move.pos[index]]=true;
			nextCapts[move.pos[index]]=move.capt[index];
		}
		for(var npos in nextPoss) 
			if(nextPoss.hasOwnProperty(npos)) {	
				aGame.mWidget.find(".possible[jocpos="+npos+"]").show();
				aGame.mWidget.find(".front[jocpos="+npos+"]").addClass("choice")
					.bind(JocGame.CLICK,function() {
						var pos=parseInt($(this).attr("jocpos"));
						poss.push(pos);
						capts.push(nextCapts[npos]);
						if(index==0) {
							pWidget=aGame.mWidget.find(".piece[jocindex="+$this.board[pos]+"]");
						} else {
							MovePiece(pos);
						}
						index++;
						UpdateChoice();
					});
			}
		if(matchingMoves.length==1 && matchingMoves[0].pos.length==poss.length) {
			aGame.mWidget.find(".front").removeClass("back");
			setTimeout(function() {
				aGame.MakeMove(JSON.parse(JSON.stringify(matchingMoves[0])));
			},500);
		}
	}

	UpdateChoice();
}

/* Optional method.
 * Board based member: 'this' is a board instance. 
 * If implemented, it is called after a human player made the move.
 */
View.Board.HumanTurnEnd=function(aGame) {
	aGame.mWidget.find(".possible").hide();
	aGame.mWidget.find(".front").unbind(JocGame.CLICK).removeClass("choice back");
}
