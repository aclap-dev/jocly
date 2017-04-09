/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

View.Game.InitView=function() {
	var $this=this;
	this.HexInitView();
	this.g.BattleSounds=function() {
		var bRet=false;
		switch($this.mSkin){
			default:
			break;
			case 'basic':
			case 'stylised':
			case 'official':
			bRet=true;
			break;
		}
		return bRet;
	}
	this.g.YohohoSound=function() {
		var soundName="yohoho"+(Math.floor(Math.random()*4)+1);
		if ($this.g.BattleSounds()) $this.PlaySound(soundName);		
	}
}

View.Game.DestroyView=function() {
	this.mWidget.empty();
}

View.Game.HexPaintTokenOneRes=function(cell,player,type){
	var ctx=cell.find("#tokencellcanvas")[0].getContext("2d");
	var l=ctx.canvas.width;
	var m=0;
	var yOffset=player==JocGame.PLAYER_A?100:0;
	var xOffset=0;
	switch(type){
		default: 
		break;
		case "p":
		xOffset=0;
		break;
		case "C":
		xOffset=100;
		break;
		case "c":
		xOffset=200;
		break;
		case "r":
		xOffset=300;
		break;
	}
	var imageObj = new Image();
    imageObj.onload = function(){
    	ctx.clearRect(0,0,l,l);
        ctx.drawImage(imageObj, 
        	xOffset,yOffset, 100,100,
        	m, m, l-2*m, l-2*m);
    }
	switch(this.mSkin){
		default:
		imageObj.src = path=this.mViewOptions.fullPath+"/res/images/yohohores6.png";
		break;
		case 'basic':
		case 'basicnosound':
		imageObj.src = path=this.mViewOptions.fullPath+"/res/images/yohohoresbasic2.png";
		break;
		case 'stylised':
		case 'stylisednosound':
		imageObj.src = path=this.mViewOptions.fullPath+"/res/images/yohohoresbasic5.png";
		break;
	}
}

/* Display the current board 
 * Board based member: 'this' is a board instance. 
 */
View.Board.Display=function(aGame) {
	//$.jBlocks("log","display");
	var $this=this;
	for (var i in $this.pieces){
		var piece=$this.pieces[i];
		aGame.mWidget.find("#jocindex"+i).show();
		var cell=aGame.mWidget.find("#jocindex"+i);
		var tCoord=aGame.g.Coord[piece.pos];
		var tr=tCoord[0];
		var tc=tCoord[1];
		if (piece.alive){
			cell.css({
					opacity: 1,
					top: aGame.g.top + aGame.HexCellRow2Ycenter( tr )-aGame.g.R,
					left: aGame.g.left + aGame.HexCellCol2Xcenter( tc )-aGame.g.R,
				});
			cell.show();
		}else{
			cell.hide();
		}
	}
	//aGame.mWidget.hide().show(0);
}

/* Optional method.
 * Board based member: 'this' is a board instance. 
 * If implemented, it is called before a human player is to play.
 */
View.Board.HumanTurn=function(aGame) {
	var $this=this;
	var amiralCapture=this.YohohoAmiralCapture(aGame,this.mWho);
	var captures=this.YohohoCaptures(aGame,this.mWho);
	//JocLog("amiralCapture",amiralCapture);
	var move={};
	//JocLog("Board",this.mWho,this);

	function HighlightStart() {
		if(amiralCapture.risk) {
			for(var i in amiralCapture.capture)
				aGame.mWidget.find("[jocpos='"+amiralCapture.capture[i].at+"']").addClass("choice"+(aGame.mShowMoves?" choice-view-capture":""));
			if(amiralCapture.escape.length>0)
				aGame.mWidget.find("[jocpos='"+amiralCapture.escape[0].f+"']").addClass("choice"+(aGame.mShowMoves?" choice-view":""));
		} else {
			for(var i in captures) 
				aGame.mWidget.find("[jocpos='"+captures[i].at+"']").addClass("choice"+(aGame.mShowMoves?" choice-view-capture":""));
			for(var i in $this.pieces) {
				var piece=$this.pieces[i];
				if(piece.alive && piece.s==$this.mWho) {
					aGame.mWidget.find("[jocpos='"+piece.pos+"']").addClass("choice"+(aGame.mShowMoves?" choice-view":""));
				}
			}
		}
	}
	
	function HighlightStart2() {
		for(var i in $this.pieces) {
			var piece=$this.pieces[i];
			if(piece.alive && piece.s==$this.mWho && piece.pos!=move.m[0].f) {
				aGame.mWidget.find("[jocpos='"+piece.pos+"']").addClass("choice"+(aGame.mShowMoves?" choice-view":""));
			}
		}
		aGame.mWidget.find("[jocpos='"+move.m[0].t+"']").addClass("choice"+(aGame.mShowMoves?" choice-view-cancel":""));
	}
	
	function ClickEnd(obj) {
		if(!obj.hasClass("choice"))
			obj=obj.find("div");
		aGame.mWidget.find(".choice").unbind(JocGame.CLICK).removeClass("choice choice-view choice-view-cancel choice-view-capture");
		var epos=parseInt(obj.attr("jocpos"));
		if(epos==move.m[0].f) {
			HighlightStart();
			aGame.mWidget.find(".front.choice").bind(JocGame.CLICK,function() {
				ClickStart($(this));
			});
		} else {
			if (aGame.g.BattleSounds()) aGame.PlaySound('move');
			move.m[0].t=epos;
			var tCoord=aGame.g.Coord[epos];
			var tr=tCoord[0];
			var tc=tCoord[1];
			var idx=$this.board[move.m[0].f];
			aGame.mWidget.find("#jocindex"+idx).animate({
						top: aGame.g.top + aGame.HexCellRow2Ycenter( tr )-aGame.g.R,
						left: aGame.g.left + aGame.HexCellCol2Xcenter( tc )-aGame.g.R,
			},500,function() {
				var pieceType=$this.pieces[idx].type;
				if($this.first || ($this.mWho==JocGame.PLAYER_A && tr==8 && pieceType=="C") || ($this.mWho==JocGame.PLAYER_B && tr==0 && pieceType=="C")) {
					aGame.MakeMove(move);
				} else {
					HighlightStart2();
					aGame.mWidget.find(".front.choice").bind(JocGame.CLICK,function() {
						ClickStart2($(this));
					});
				}				
				//aGame.mWidget.hide().show(0);
			});
		}
	}

	function ClickEnd2(obj) {
		if(!obj.hasClass("choice"))
			obj=obj.find("div");
		aGame.mWidget.find(".choice").unbind(JocGame.CLICK).removeClass("choice choice-view choice-view-cancel choice-view-capture");
		var epos=parseInt(obj.attr("jocpos"));
		if(epos==move.m[1].f) {
			HighlightStart2();
			aGame.mWidget.find(".front.choice").bind(JocGame.CLICK,function() {
				ClickStart2($(this));
			});
		} else {
			move.m[1].t=epos;

			var board = new (aGame.GetBoardClass())(aGame);	
			board.CopyFrom($this);
			board.mWho = -$this.mWho;
			board.mBoardClass = $this.mBoardClass;
			//var mWho=aGame.mWho;
			//aGame.mWho=-mWho;
			board.ApplyMove(aGame,move);
			//aGame.mWho=mWho;
			if(board.yohoho)
				aGame.g.YohohoSound();
			
			if (aGame.g.BattleSounds()) aGame.PlaySound('move');
			var tCoord=aGame.g.Coord[epos];
			var tr=tCoord[0];
			var tc=tCoord[1];
			var idx=$this.board[move.m[1].f];
			aGame.mWidget.find("#jocindex"+idx).animate({
						top: aGame.g.top + aGame.HexCellRow2Ycenter( tr )-aGame.g.R,
						left: aGame.g.left + aGame.HexCellCol2Xcenter( tc )-aGame.g.R,
			},500,function() {
				aGame.MakeMove(move);
				//aGame.mWidget.hide().show(0);
			});
		}
	}

	function HighlightEnd() {
		aGame.mWidget.find("[jocpos='"+spos+"']").addClass("choice choice-view-cancel");
		var pos=move.m[0].f;
		var piece=$this.pieces[$this.board[pos]];
		var poss=$this.YohohoReachablePositions(aGame,pos,piece.type,null,null);
		for(var i in poss) {
			var pos1=poss[i];			
			aGame.mWidget.find("[jocpos='"+pos1+"']").addClass("choice choice-view");
		}
	}
	
	function HighlightEnd2() {
		aGame.mWidget.find("[jocpos='"+spos+"']").addClass("choice choice-view-cancel");
		var pos=move.m[1].f;
		var piece=$this.pieces[$this.board[pos]];
		var poss=$this.YohohoReachablePositions(aGame,pos,piece.type,move.m[0].f,move.m[0].t);
		for(var i in poss) {
			var pos1=poss[i];			
			aGame.mWidget.find("[jocpos='"+pos1+"']").addClass("choice choice-view");
		}
	}
	
	function ClickStart(obj) {
		aGame.mWidget.find(".choice").unbind(JocGame.CLICK).removeClass("choice choice-view choice-view-cancel choice-view-capture");
		spos=parseInt(obj.attr("jocpos"));
		var index=$this.board[spos];
		if(index>=0 && $this.pieces[index].s==-$this.mWho) {
			for(var i in captures)
				if(captures[i].at==spos) {
					var cmove=captures[i];
					if (aGame.g.BattleSounds()) aGame.PlaySound('assault');
					for(var j in cmove.af)
						aGame.mWidget.find("[jocpos='"+cmove.af[i]+"']").addClass("attacker");
					aGame.mWidget.find("[jocpos='"+spos+"']").addClass("attack");
					aGame.mWidget.find("#jocindex"+index).animate({
						opacity: 0,
					},2000,function() {
						aGame.mWidget.find("[jocpos='"+spos+"']").removeClass("attack");
						for(var j in cmove.af)
							aGame.mWidget.find("[jocpos='"+cmove.af[i]+"']").removeClass("attacker");
						aGame.MakeMove(captures[i]);
						//aGame.mWidget.hide().show(0);
					});
					return;
				}
		}
		move={
			t: 'm',
			m: [ { f:spos },{}]
		};
		HighlightEnd();
		aGame.mWidget.find(".front.choice").bind(JocGame.CLICK,function() {
			ClickEnd($(this));
		});
	}
	
	function ClickStart2(obj) {
		aGame.mWidget.find(".choice").unbind(JocGame.CLICK).removeClass("choice choice-view choice-view-cancel choice-view-capture");
		spos=parseInt(obj.attr("jocpos"));
		if(spos==move.m[0].t) {
			var tCoord=aGame.g.Coord[move.m[0].f];
			var tr=tCoord[0];
			var tc=tCoord[1];
			var idx=$this.board[move.m[0].f];
			aGame.mWidget.find("#jocindex"+idx).css({
				top: aGame.g.top + aGame.HexCellRow2Ycenter( tr )-aGame.g.R,
				left: aGame.g.left + aGame.HexCellCol2Xcenter( tc )-aGame.g.R,
			});
			HighlightStart();
			aGame.mWidget.find(".front.choice").bind(JocGame.CLICK,function() {
				ClickStart($(this));
			});	
		} else {
			move.m[1].f=spos;
			HighlightEnd2();
			aGame.mWidget.find(".front.choice").bind(JocGame.CLICK,function() {
				ClickEnd2($(this));
			});
		}
	}
		
	HighlightStart();
	aGame.mWidget.find(".front.choice").bind(JocGame.CLICK,function() {
		ClickStart($(this));
	});	
}

/* Optional method.
 * Board based member: 'this' is a board instance. 
 * If implemented, it is called after a human player made the move.
 */
View.Board.HumanTurnEnd=function(aGame) {
	aGame.mWidget.find(".hex-pass").hide().unbind(JocGame.CLICK);
	aGame.mWidget.find(".front,.cell,.piece div").unbind(JocGame.CLICK);
	aGame.mWidget.find(".choice,.choice-view").removeClass(" choice choice-view choice-view-cancel choice-view-capture");	
}

/* Optional method.
 * Board based member: 'this' is a board instance. 
 * If implemented, must return true if there is no need to wait for an animation to achieve,
 * if it returns false, the implementation must ensure it will call aMoveDoneFnt to resume 
 * the game. 
 */
View.Board.PlayedMove=function(aGame,aMove) {
	var $this=this;
	if(aMove.t=='m') {
		if(this.yohoho) {
			//JocLog("Yohoho");
			//this.yohoho=false;
			aGame.g.YohohoSound();
		}
		var coord=aGame.g.Coord[aMove.m[0].t];
		var tr=coord[0];
		var tc=coord[1];
		var idx=this.board[aMove.m[0].t];
		aGame.mWidget.find("#jocindex"+idx).animate({
			top: aGame.g.top + aGame.HexCellRow2Ycenter( tr )-aGame.g.R,
			left: aGame.g.left + aGame.HexCellCol2Xcenter( tc )-aGame.g.R,
		},500,function() {
			if(typeof aMove.m[1].f=="undefined") 
				aGame.MoveShown();
			else {
				var coord=aGame.g.Coord[aMove.m[1].t];
				var tr=coord[0];
				var tc=coord[1];
				var idx=$this.board[aMove.m[1].t];
				aGame.mWidget.find("#jocindex"+idx).animate({
					top: aGame.g.top + aGame.HexCellRow2Ycenter( tr )-aGame.g.R,
					left: aGame.g.left + aGame.HexCellCol2Xcenter( tc )-aGame.g.R,
				},500,function() {
					aGame.MoveShown();
				});
			}
			//aGame.mWidget.hide().show(0);
		});		
	} else if(aMove.t=='a') {
		if (aGame.g.BattleSounds()) aGame.PlaySound('assault');
		var idx=aGame.mOldBoard.board[aMove.at];
		aGame.mWidget.find("[jocpos='"+aMove.at+"']").addClass("attack");
		for(var i in aMove.af)
			aGame.mWidget.find("[jocpos='"+aMove.af[i]+"']").addClass("attacker");
		aGame.mWidget.find("#jocindex"+idx).animate({
			opacity: 0,
		},2000,function() {
			aGame.mWidget.find("[jocpos='"+aMove.at+"']").removeClass("attack");
			for(var i in aMove.af)
				aGame.mWidget.find("[jocpos='"+aMove.af[i]+"']").removeClass("attacker");
			aGame.MoveShown();
			//aGame.mWidget.hide().show(0);
		});
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
