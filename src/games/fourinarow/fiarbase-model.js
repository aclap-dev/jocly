/*
 * Copyright (c) 2013 - Jocly - www.jocly.com - All rights reserved
 */

Model.Game.InitGame = function() {
	var width=this.mOptions.width;
	var height=this.mOptions.height;
	var lines=this.mOptions.lines;
	var directions=[[-1,-1],[0,-1],[1,-1],[-1,0]];
	var tuples=[];
	for(var r=0;r<height;r++)
		for(var c=0;c<width;c++) {
			for(var d=0;d<directions.length;d++) {
				var dx=directions[d][0];
				var dy=directions[d][1];
				var i;
				var tuple=[];
				for(i=0;i<lines;i++) {
					var pos;
					if(this.mOptions.torus)
						pos=(r+dy*i)*width+(c+dx*i+width)%width;
					else
						pos=(r+dy*i)*width+c+dx*i;

					if(this.mOptions.torus && (r+dy*i<0 || r+dy*i>=height))
						break;
					else if(!this.mOptions.torus && (c+dx*i<0 || c+dx*i>=width || r+dy*i<0 || r+dy*i>=height))
						break;
					else
						tuple.push(pos);
				}
				if(i==lines) {
					tuples.push(tuple);
				}
			}
		}
	this.g.TuplesList=tuples;
	var tuplesMap={};
	for(var i=0;i<tuples.length;i++) {
		var tuple=tuples[i];
		for(var j=0;j<tuple.length;j++) {
			var pos=tuple[j];
			if(tuplesMap[pos]===undefined)
				tuplesMap[pos]=[];
			tuplesMap[pos].push(tuple);
		}
	}
	this.g.Tuples=tuplesMap;
	this.zobrist=new JocGame.Zobrist({
		board: {
			type: "array",
			size: this.mOptions.width*this.mOptions.height,
			values: ["1","-1"],
		}
	});
}

Model.Move.Init = function(args) {
	this.op=args.op;
	this.col=args.col;
}

Model.Move.CopyFrom=function(move) {
	this.Init(move);
}

Model.Move.ToString=function() {
	var str="";
	switch(this.op) {
	case '+': str+='+'; break;
	case '-': str+='-'; break;
	default: str+='?';
	}
	str+=String.fromCharCode(65+this.col);
	return str;
}

Model.Board.Init = function(aGame) {
	this.zSign=0;
}

Model.Board.InitialPosition = function(aGame) {
	this.board=[];
	var width=aGame.mOptions.width;
	var height=aGame.mOptions.height;
	for(var r=0;r<height;r++) {
		for(var c=0;c<width;c++)
			this.board.push(0);
	}
	this.tuples={}
	for(var i=1;i<=aGame.mOptions.lines;i++) {
		this.tuples[i]=0;
		this.tuples[-i]=0;
	}
	this.cols=[];
	for(var c=0;c<width;c++)
		this.cols.push(0);
	if(aGame.mOptions.fillSides) {
		for(var i=0;i<height;i++) {
			var pos=i*width;
			var who=(i%2)?-1:1;
			var col=0;
			this.board[pos]=who;
			this.cols[col]++;
			this.tuples[who]++;
			this.zSign=aGame.zobrist.update(this.zSign,"board",who,pos);
			
			var pos=i*width+width-1;
			var who=(i%2)?1:-1;
			var col=width-1;
			this.board[pos]=who;
			this.cols[col]++;
			this.tuples[who]++;
			this.zSign=aGame.zobrist.update(this.zSign,"board",who,pos);		
		}
	}
}

Model.Board.GenerateMoves = function(aGame) {
	var moves=[],maxHeight=aGame.mOptions.height;
	for(var c=0;c<aGame.mOptions.width;c++)
		if(this.cols[c]<maxHeight)
			moves.push({
				op: '+',
				col: c,
			});
	if(aGame.mOptions.remove)
		for(var c=0;c<aGame.mOptions.width;c++)
			if(this.board[c]==this.mWho)
				moves.push({
					op: '-',
					col: c,
				});
	this.mMoves=moves;
	//console.log("GenerateMoves",moves.length,moves);
	if(moves.length==0) {
		this.mFinished=true;
		this.mWinner=JocGame.DRAW;
	}
		
}

Model.Board.Evaluate = function(aGame) {
	this.mEvaluation=0;
	this.mWinner=0;
	if(aGame.mOptions.preventRepeat && aGame.GetRepeatOccurence(this)>2) {
		this.mFinished=true;
		this.mWinner=JocGame.DRAW;
		return;
	}
	if(this.tuples[aGame.mOptions.lines]>0) {
		this.mFinished=true;
		this.mWinner=1;
	}
	if(this.tuples[-aGame.mOptions.lines]>0) {
		this.mFinished=true;
		if(this.mWinner)
			this.mWinner=JocGame.DRAW;
		else
			this.mWinner=-1;
		return;
	}
	if(this.mFinished)
		return;
	var evParam=aGame.mOptions.levelOptions;
	for(var i=1;i<aGame.mOptions.lines;i++) {
		this.mEvaluation+=this.tuples[i]*evParam['evalTuple'+i];
		this.mEvaluation-=this.tuples[-i]*evParam['evalTuple'+i];
	}
}

Model.Board.ApplyMove = function(aGame,move) {
	//console.log("+ApplyMove",move)
	var $this=this;
	if(move.op=='+') {
		var c=move.col;
		var r=this.cols[c];
		var pos=r*aGame.mOptions.width+c;
		for(var i=0;i<aGame.g.Tuples[pos].length;i++) {
			var tuple=aGame.g.Tuples[pos][i];
			var counter={
				'1': 0,
				'0': 0,
				'-1': 0,
			}
			for(var j=0;j<tuple.length;j++)
				counter[this.board[tuple[j]]]++;
			if(counter[1]>0 && counter[-1]==0)
				this.tuples[counter[1]]--;
			else if(counter[-1]>0 && counter[1]==0)
				this.tuples[-counter[-1]]--;
			counter[this.mWho]++;
			if(counter[1]>0 && counter[-1]==0)
				this.tuples[counter[1]]++;
			else if(counter[-1]>0 && counter[1]==0)
				this.tuples[-counter[-1]]++;
		}		
		this.board[pos]=this.mWho;
		this.cols[c]++;
		this.zSign=aGame.zobrist.update(this.zSign,"board",this.mWho,pos);
	} else if(move.op=='-') {
		for(var r=0;r<this.cols[move.col];r++) {
			var pos=r*aGame.mOptions.width+move.col;
			for(var i=0;i<aGame.g.Tuples[pos].length;i++) {
				var tuple=aGame.g.Tuples[pos][i];
				var counter={
					'1': 0,
					'0': 0,
					'-1': 0,
				}
				for(var j=0;j<tuple.length;j++)
					counter[this.board[tuple[j]]]++;
				if(counter[1]>0 && counter[-1]==0)
					this.tuples[counter[1]]--;
				else if(counter[-1]>0 && counter[1]==0)
					this.tuples[-counter[-1]]--;
			}
		}
		for(var i=0;i<this.cols[move.col];i++) {
			var pos=i*aGame.mOptions.width+move.col;
			var pos1=pos+aGame.mOptions.width;
			var whoAbove=0;
			if(pos1<this.board.length)
				whoAbove=this.board[pos1];
			this.zSign=aGame.zobrist.update(this.zSign,"board",this.board[pos],pos);
			if(whoAbove)
				this.zSign=aGame.zobrist.update(this.zSign,"board",whoAbove,pos);			
			this.board[pos]=whoAbove;
		}
		this.cols[move.col]--;
		for(var r=0;r<this.cols[move.col];r++) {
			var pos=r*aGame.mOptions.width+move.col;
			for(var i=0;i<aGame.g.Tuples[pos].length;i++) {
				var tuple=aGame.g.Tuples[pos][i];
				var counter={
					'1': 0,
					'0': 0,
					'-1': 0,
				}
				for(var j=0;j<tuple.length;j++)
					counter[this.board[tuple[j]]]++;
				if(counter[1]>0 && counter[-1]==0)
					this.tuples[counter[1]]++;
				else if(counter[-1]>0 && counter[1]==0)
					this.tuples[-counter[-1]]++;
			}
		}
	} else
		console.error("Invalid move",move);
	//console.log("-ApplyMove")
}

Model.Board.CopyFrom = function(aBoard) {
	this.tuples={};
	for(var i in aBoard.tuples)
		this.tuples[i]=aBoard.tuples[i];
	this.board=[];
	for(var pos=0;pos<aBoard.board.length;pos++)
		this.board.push(aBoard.board[pos]);
	this.cols=[];
	for(var col=0;col<aBoard.cols.length;col++)
		this.cols.push(aBoard.cols[col]);
	this.mWho=aBoard.mWho;
	this.zSign=aBoard.zSign;
}

Model.Board.GetSignature = function() {
	return this.zSign;
}	

