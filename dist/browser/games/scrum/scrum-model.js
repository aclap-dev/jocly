exports.model = Model = {
    Game: {},
    Board: {},
    Move: {}
};

/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

/* Optional method.
 * Called when the game is created.
 */
Model.Game.InitGame = function() {
	var WIDTH=this.mOptions.width;
	var HEIGHT=this.mOptions.height;
	var g=[];
	var coord=[];
	for(var r=0;r<HEIGHT;r++) {
		for(var c=0;c<WIDTH;c++) {
			var pos=r*WIDTH+c;
			coord[pos]=[r,c];
			g[pos]=[];
			for(var h=-1;h<2;h++)
				for(var v=-1;v<2;v++) {
					if(h!=0 || v!=0) {
						if(r+h<HEIGHT && r+h>=0 && c+v<WIDTH && c+v>=0)
							g[pos].push((r+h)*WIDTH+c+v);
						else
							g[pos].push(null);
					}
				}
		}
	}
	this.g.Graph=g;
	this.g.Coord=coord;
	this.zobrist=new JocGame.Zobrist({
		board: {
			type: "array",
			size: this.g.Graph.length,
			values: ["1","-1","-2"],
		}
	});

}

/* Optional method.
 * Called when the game is over.
 */
Model.Game.DestroyGame = function() {
}

// walk through neighbor positions
Model.Game.ScrumEachDirection = function(pos,fnt) {
	for(var i=0;i<8;i++) {
		var npos=this.g.Graph[pos][i];
		if(npos!=null)
			fnt(npos,i);
	}
}

/* Constructs an instance of the Move object for the game.
 * args is either an empty object ({}), or contains the data passed to the InitUI parameter.
 */
Model.Move.Init = function(args) {
	//JocLog("Move.Init",args);
	if(typeof(args.seg)!="undefined") {
		this.seg=[{
			f: args.seg[0].f, // first segment, piece from
			t: args.seg[0].t, // first segment, piece to
		}];
		if(typeof(args.seg[0].b)!="undefined")
			this.seg[0].b=args.seg[0].b; // first segment, ball to
		if(typeof(args.seg[1])!="undefined") {
			this.seg[1]={
				f: args.seg[1].f, // second segment, piece from
				t: args.seg[1].t, // second segment, piece to
			};
			if(typeof(args.seg[1].b)!="undefined")
				this.seg[1].b=args.seg[1].b; // second segment, ball to
		}
	}
}

/* Optional method.
 * Returns a string to represent the move for display to human. If not defined JSON is used.
 */
Model.Move.ToString = function() {
	var str=this.seg[0].f+">"+this.seg[0].t;
	if(typeof(this.seg[0].b)!="undefined")
		str+=">"+this.seg[0].b;
	if(typeof(this.seg[1])!="undefined") {
		str+=" - "+this.seg[1].f+">"+this.seg[1].t;
		if(typeof(this.seg[1].b)!="undefined")
			str+=">"+this.seg[1].b;
	}
	return str;
}

/* Board object constructor.
 */
Model.Board.Init = function(aGame) {	
	this.zSign=0;
}

Model.Board.InitialPosition = function(aGame) {
	var WIDTH=aGame.mOptions.width;
	var HEIGHT=aGame.mOptions.height;
	var INITIAL=aGame.mOptions.initial;
	
	this.first=true;

	this.board=[]; // access pieces by position
	for(var r=0;r<HEIGHT;r++) {
		for(var c=0;c<WIDTH;c++)
			this.board[r*WIDTH+c]=-1;
	}

	this.pieces=[]; // access pieces by index
	var index=0;
	for(var i in INITIAL.a) {
		var p=INITIAL.a[i];
		var pos=p[0]*WIDTH+p[1];
		this.pieces.push({
			s: JocGame.PLAYER_A, // side
			p: pos, // position
			a: 180,
			sc: false,
		});
		this.board[pos]=index++;
		this.zSign=aGame.zobrist.update(this.zSign,"board","1",pos);
	}
	for(var i in INITIAL.b) {
		var p=INITIAL.b[i];
		var pos=p[0]*WIDTH+p[1];
		this.pieces.push({
			s: JocGame.PLAYER_B, // side
			p: pos, // position
			a: 0,
			sc: false,
		});
		this.board[pos]=index++;
		this.zSign=aGame.zobrist.update(this.zSign,"board","-1",pos);
	}
	this.ball=INITIAL.ball[0]*WIDTH+INITIAL.ball[1];
	this.board[this.ball]=-2;
	this.zSign=aGame.zobrist.update(this.zSign,"board","-2",this.ball);
	this.scrum=false;
}

/* Push into the mMoves array, every possible move
 */
Model.Board.GenerateMoves = function(aGame) {
	try {
		this._GenerateMoves(aGame);
	} catch(e) {
		console.error("GenerateMoves: "+e);
	}
}

Model.Board._GenerateMoves = function(aGame) {
	// generating an exhaustive list of moves (~10K) would badly affect computer thinking
	// only a subset of moves must be considered, hence the complexity of the GenerateMoves method
	
	var HEIGHT=aGame.mOptions.height;
	var $this=this;
	var time0=new Date().getTime();

	// === Utility functions ===
	
	// get distance between 2 positions
	// TODO measure impact of caching
	var distCache={};
	function Dist(p0,p1) {
		if(p0>p1) {
			var tmp=p0;
			p0=p1;
			p1=tmp;
		}
		var sign=""+p0+"/"+p1;
		if(typeof(distCache[sign])=="undefined") {
			var coord0=aGame.g.Coord[p0];
			var coord1=aGame.g.Coord[p1];
			var d=Math.max(Math.abs(coord0[0]-coord1[0]),Math.abs(coord0[1]-coord1[1]));
			distCache[sign]=d;
		}
		return distCache[sign];
	}

	// walk through neighbor positions but directed to another position
	function EachDirectionTo(pos,toPos,strict,fnt) {
		var c0=aGame.g.Coord[pos];
		var c=aGame.g.Coord[toPos];
		var dirs=[0,1,2,3,4,5,6,7];
		if(c[0]>c0[0]) {
			dirs[0]=-1;
			dirs[1]=-1;
			dirs[2]=-1;
			if(strict) {
				dirs[3]=-1;
				dirs[4]=-1;
			}
		} else if(c[0]<c0[0]) {
			dirs[5]=-1;
			dirs[6]=-1;
			dirs[7]=-1;
			if(strict) {
				dirs[3]=-1;
				dirs[4]=-1;
			}
		}
		if(c[1]>c0[1]) {
			dirs[0]=-1;
			dirs[3]=-1;
			dirs[5]=-1;
			if(strict) {
				dirs[1]=-1;
				dirs[6]=-1;
			}
		} else if(c[1]<c0[1]) {
			dirs[2]=-1;
			dirs[4]=-1;
			dirs[7]=-1;
			if(strict) {
				dirs[1]=-1;
				dirs[6]=-1;
			}
		}
		for(var i in dirs) {
			if(dirs[i]!=-1) {
				var npos=aGame.g.Graph[pos][dirs[i]];
				if(npos)
					fnt(npos,i);
			}
		}
	}
	
	// walk through each of own pieces
	function EachPiece(fnt) {
		for(var i in $this.pieces) {
			var piece=$this.pieces[i];
			if(piece.s==$this.mWho)
				fnt(i,piece.p);
		}
	}
	
	// count number of opponents in the neighborhood
	var ballDataCountCache={};
	function BallDataCount(pos) {
		if(typeof(ballDataCountCache[pos])=="undefined") {
			var opCount=0;
			var selfCount=0;
			var emptyCount=0;
			var etab=[];
			aGame.ScrumEachDirection(pos,function(npos) {
				var cell=$this.board[npos];
				if(cell<0) {
					if(cell==-1) {
						emptyCount++;
						etab.push(npos);
					}
				} else if($this.pieces[cell].s==$this.mWho)
					selfCount++;
				else
					opCount++;
			});
			var counters={
				e: emptyCount,
				etab: etab,
				s: selfCount,
				o: opCount,
			}
			ballDataCountCache[pos]=counters;
			return counters;
		} else 
			return ballDataCountCache[pos];
	}
	var ballDataCount=BallDataCount(this.ball);

	// get level1 ball moves
	var ballMoves1=[];
	var ballRow=aGame.g.Coord[this.ball][0];
	aGame.ScrumEachDirection(this.ball,function(pos) {
		var cell=$this.board[pos];
		if(cell==-1) {
			ballMoves1.push({
				p: pos,
				c: BallDataCount(pos),
				g: (aGame.g.Coord[pos][0]-ballRow)*$this.mWho
			});
		}
	});

	// === handling scrum ===
	if(this.scrum) {
		var scrumExit=-1;
		var pieces=[];
		aGame.ScrumEachDirection(this.ball,function(pos) {
			var cell=$this.board[pos];
			if(cell==-1)
				scrumExit=pos;
			else if(cell>=0 && $this.pieces[cell].s==$this.mWho)
				pieces.push(cell);
		});
		if(scrumExit==-1) {
			this.mFinished=true;
			this.mWinner=JocGame.DRAW;
			return;
		}
		for(var i in pieces) {
			var index=pieces[i];
			var enclosed=true;
			aGame.ScrumEachDirection(scrumExit,function(pos) {
				var cell=$this.board[pos];
				if(cell==-1 || (cell>=0 && pos==$this.pieces[index].p))
						enclosed=false;
			});
			if(enclosed==false)
				this.mMoves.push({seg:[{
					f: $this.pieces[index].p,
					t: $this.ball,
					b: scrumExit,
				}]});
		}
		if(pieces.length>0) {
			//JocLog("Scrum moves",this.mMoves);
			if(this.mMoves.length==0) {
				this.mFinished=true;
				this.mWinner=JocGame.DRAW;
			}
			return;
		}
	}
	
	// === building segments ===
	
	var segments=[];

	
	// segments moving the ball 
	aGame.ScrumEachDirection(this.ball,function(pos) {
		var cell=$this.board[pos];
		if(cell>=0 && $this.pieces[cell].s==$this.mWho) {
			for(var i in ballMoves1) {
				var bm=ballMoves1[i];
				var segment={
					i: cell,       // piece index
					f: pos,        // start piece position
					t: $this.ball, // end piece position
					b: bm.p,       // ball position
					c: bm.c,       // # of opponent in ball neighborhood
					g: bm.g,       // ball row gain
					d: 1,          // distance from piece to ball
				}
				segments.push(segment);
			}
		}
	});
	
	// segments moving piece only
	EachPiece(function(index,pos) {
		
		function AddSegment(pos0,d0) {
			var segment={
				i: index,
				f: pos,
				t: pos0,
				b: null,
				c: ballDataCount,
				g: 0,
				d: d0,
			}
			segments.push(segment);
		}

		var dist=Dist(pos,$this.ball);
		if(dist==1) {
			aGame.ScrumEachDirection(pos,function(npos) {
				var cell=$this.board[npos];
				if(cell==-1) {
					var d=Dist(npos,$this.ball);
					AddSegment(npos,d);
				}
			});
		} else if(dist<4) {
			aGame.ScrumEachDirection(pos,function(npos) {
				var cell=$this.board[npos];
				if(cell==-1) {
					var d=Dist(npos,$this.ball);
					AddSegment(npos,d);
				}
			});
		} else { 
			EachDirectionTo(pos,$this.ball,false,function(npos) {
				var cell=$this.board[npos];
				if(cell==-1) {
					var d=Dist(npos,$this.ball);
					AddSegment(npos,d);
				}
			});
		}
	});
	
	// update segment weights
	for(var i in segments) {
		var segment=segments[i];
		var weight=
			(8-segment.c.o)*0.125 * 1 +
			(segment.c.s)*0.125 *   1 +
			(segment.g+2)*0.25 *    4 +
			(11-segment.d)*(1/11) * 2 ;
		if(segment.e==0)
			weight=-1000;
		if(segment.e==1)
			weight+=1000;
		if(segment.e==2)
			weight+=2;
		segment.w=weight;
	}
	segments.sort(function(a,b) {
		return b.w-a.w;
	});
		
	// generate moves
	var moves=[];  
	var pmoves=[]; // provisioned moves

	if(this.first) {
		for(var i=0;i<aGame.mOptions.levelOptions.MIN_MOVES && i<segments.length;i++) {
			var seg=segments[i];
			var move={ seg:[{
						f: seg.f,
						t: seg.t,
				}] }
			if(seg.b!=null)
				move.seg[0].b=seg.b;
			moves.push(move);
		}
		this.mMoves=moves;
		return;
	}
	
	var gotLevel1WinningSegment=false;
	function AddMove(seg1,seg2) {

		if(seg1.b!=null) {
			// check if winning first segment
			var ballRow=aGame.g.Coord[seg1.b][0];
			if((ballRow==0 && $this.mWho==JocGame.PLAYER_B) || (ballRow==HEIGHT-1 && $this.mWho==JocGame.PLAYER_A)) {
				var empty=0;
				aGame.ScrumEachDirection(seg1.b,function(pos) {
					if($this.board[pos]==-1)
						empty++;
				});
				if(empty>0) {
					if(gotLevel1WinningSegment==false) {
						moves=[];
						gotLevel1WinningSegment=true;
					}
					var move={seg:[{
						f: seg1.f,
						t: seg1.t,
						b: seg1.b,
					}]};
					moves.push(move);
				}
			}
		} else {
			var ballRow=aGame.g.Coord[$this.ball][0];
			if((ballRow==0 && $this.mWho==JocGame.PLAYER_B) || (ballRow==HEIGHT-1 && $this.mWho==JocGame.PLAYER_A)) {
				var touch=false;
				var empty=0;
				aGame.ScrumEachDirection($this.ball,function(pos) {
					if(pos==seg1.t)
						touch=true;
					else if($this.board[pos]==-1)
						empty++;
				});
				if(touch && empty>0) {
					if(gotLevel1WinningSegment==false) {
						moves=[];
						gotLevel1WinningSegment=true;
					}
					var move={seg:[{
						f: seg1.f,
						t: seg1.t,
					}]};
					moves.push(move);
				}
			}
		}
		if(gotLevel1WinningSegment)
			return;
		var empty=0;
		var ball=$this.ball;
		if(seg1.b!=null) ball=seg1.b;
		if(seg2.b!=null) ball=seg2.b;
		aGame.ScrumEachDirection(ball,function(pos) {
			var cell=$this.board[pos];
			if(cell<0)
				empty++;
			if(seg1.t==pos || seg2.t==pos)
				empty--;
			if(seg1.f==pos || seg2.f==pos)
				empty++;
		});
		if(empty==0) return;
		
		var move={seg:[{
			f: seg1.f,
			t: seg1.t,
		},{
			f: seg2.f,
			t: seg2.t,
		}]};
		if(seg1.b!=null)
			move.seg[0].b=seg1.b;
		if(seg2.b!=null)
			move.seg[1].b=seg2.b;
		moves.push(move);
	}
	
	var iSegWT1=-1, iSegWT2=0;
	function GetNextSegmentPair() {
		while(true) {
			iSegWT1++;
			if(iSegWT1==iSegWT2) {
				iSegWT2++;
				iSegWT1=0;
			}
			if(iSegWT2<segments.length) {
				var seg1=segments[iSegWT1];
				var seg2=segments[iSegWT2];
				if((seg1.b==null || seg2.b==null) && // filter: 2 level1 segments using same ball
					(seg1.i!=seg2.i) &&              // playing same piece
					(seg1.t!=seg2.t) &&              // same destination cell
					(seg2.t!=seg1.b || seg2.b!=null ) &&   // moving piece to ball
					(seg2.b!=seg1.t)                 // no ball to where first piece just move
					)
					return [ seg1 , seg2 ];
			} else {
				// hopefully should not happen
				return null;
			}
		}
	}
	
	// get segments moving ball at level 2
	var l2segmentsBallCache={}
	function GetLevel2BallSegments(ball) {
		if(typeof(l2segmentsBallCache[ball])=="undefined") {
			l2segmentsBallCache[ball]=[];
			var avail=[];
			var pieces=[];
			aGame.ScrumEachDirection(ball,function(pos) {
				var cell=$this.board[pos];
				if(cell==-1)
					avail.push(pos);
				else if(cell>=0 && $this.pieces[cell].s==$this.mWho) {
					pieces.push(cell);
				}
			});
			for(var i in pieces) {
				var index=pieces[i];
				for(var j in avail) {
					l2segmentsBallCache[ball].push({
						i: index,
						f: $this.pieces[index].p,
						t: ball,
						b: avail[j],
					});
				}
			}
		}
		return l2segmentsBallCache[ball];
	}
	
	// get segments moving to position
	var l2segmentsPieceCache={}
	function GetLevel2PieceSegments(ppos) {
		if(typeof(l2segmentsPieceCache[ppos])=="undefined") {
			l2segmentsPieceCache[ppos]=[];
			aGame.ScrumEachDirection(ppos,function(pos) {
				var cell=$this.board[pos];
				if(cell>=0 && $this.pieces[cell].s==$this.mWho) {
					l2segmentsPieceCache[ppos].push({
						i: cell,
						f: $this.pieces[cell].p,
						t: ppos,
					});
				}
			});
		}
		return l2segmentsPieceCache[ppos];
	}
	
	var segs;
	while(moves.length<aGame.mOptions.levelOptions.MIN_MOVES) { 
		segs=GetNextSegmentPair();
		if(segs) {
			//JocLog("Move",m[0],m[1]);
			//AddMove(m[0],m[1]);
			var seg1=segs[0];
			var seg2=segs[1];
			AddMove(seg1,seg2);
			if(seg1.b!=null && !seg1.explored) { // ball moved at level 1
				seg1.explored=true;
				// consider ball move at level 2
				var segments2=GetLevel2BallSegments(seg1.b);
				for(var i in segments2) {
					var segment2=segments2[i];					
					if(segment2.i!=seg1.i) {
						AddMove(seg1,segment2);
					}
				}
				// consider moving piece to where 1st piece was
				var segments2=GetLevel2PieceSegments(seg1.f);
				for(var i in segments2) {
					var segment2=segments2[i];
					if(segment2.i!=seg1.i) {
						AddMove(seg1,segment2);
					}
				}
			}
		} else 
			break;
	}
	
	// add moves where seg1 moves piece only and seg2 moves ball to where first piece was
	var piecesAround=[];
	aGame.ScrumEachDirection(this.ball,function(pos) {
		var cell=$this.board[pos];
		if(cell>=0 && $this.pieces[cell].s==$this.mWho)
			piecesAround.push(cell);
	});
	var piecesAround1=[];
	for(var i in piecesAround) { // do not consider moves with ball behind
		var row=aGame.g.Coord[this.pieces[piecesAround[i]].p][0];
		if((this.mWho==JocGame.PLAYER_A && row>=ballRow) ||
				(this.mWho==JocGame.PLAYER_B && row<=ballRow))
			piecesAround1.push(piecesAround[i]);
	}
	var movesLength0=moves.length;
	for(var i in piecesAround1)
		for(var j in piecesAround) {
			if(piecesAround1[i]!=piecesAround[j]) {
				var piece1=this.pieces[piecesAround1[i]];
				var piece2=this.pieces[piecesAround[j]];
				aGame.ScrumEachDirection(piece1.p,function(pos) {
					var cell=$this.board[pos];
					if(cell==-1) {
						var seg1={
							i: piecesAround1[i],
							f: piece1.p,
							t: pos,
						}
						var seg2={
							i: piecesAround[j],
							f: piece2.p,
							t: $this.ball,
							b: piece1.p,
						}
						//JocLog("group2 move",seg1,seg2);
						AddMove(seg1,seg2);
					}
				});
			}
		}
	var group2Moves=moves.length-movesLength0;
	
	this.mMoves=moves;
	
	if(this.mMoves.length==0) {
		// always have one 'bad' but legal move possible to prevent no move found
		function MakeLooseMove() {
			var looseMove=null;
			var looseData=[];
			var piecesDist=[];
			EachPiece(function(index,pos) {
				var d=Dist(pos,$this.ball);
				piecesDist.push({
					i: index,
					d: d,
				});
			});
			piecesDist.sort(function(a,b) {
				return b.d-a.d;
			});
			for(var i in piecesDist) {
				var piece=piecesDist[i];
				var pos=$this.pieces[piece.i].p;
				var d0=Dist(pos,$this.ball);
				var abortEachDir=false;
				aGame.ScrumEachDirection(pos,function(npos) {
					if(abortEachDir)
						return;
					if($this.board[npos]==-1) {
						var d=Dist(npos,$this.ball);
						if(d>=d0) {
							if(looseData.length==1 && npos==looseData[0].t) return;
							looseData.push({
								i: piece.i,
								f: pos,
								t: npos,
							});
							abortEachDir=true;
						}
					}
				});
				if(looseData.length==2) {
					looseMove={seg:[{
						f: looseData[0].f,
						t: looseData[0].t,
					},{
						f: looseData[1].f,
						t: looseData[1].t,
					}]};
					return looseMove;
				}
			}
		}
		this.mMoves.push(MakeLooseMove());
	}
	
	gmStats = (typeof(gmStats)!="undefined") ? gmStats : {
		count: 0,
		time: 0,
		moves: 0,
		segments: 0,
		maxGroup2: 0,
	}
	var time1 = new Date().getTime();
	var deltaTime = time1 - time0;
	
	gmStats.count++;
	gmStats.time+=deltaTime;
	gmStats.moves+=moves.length;
	gmStats.segments+=segments.length;
	
	if(group2Moves>gmStats.maxGroup2) {
		gmStats.maxGroup2=group2Moves;
		//JocLog("Group2",group2Moves);
	}
	
	//JocLog("Duration",deltaTime,"ms",gmStats.time/gmStats.count,"moves",moves.length,gmStats.moves/gmStats.count,"segments",segments.length,gmStats.segments/gmStats.count);

	//JocLog("segments",segments.length,segments);
	//JocLog("moves",this.mMoves);
	
	//JocLog("-----------------------------------------");
}

/* Optional method.
 */
/*
Model.Board.QuickEvaluate = function(aGame) {
	return this.EvaluateChessBoard(aGame);
}
*/

/* The Evaluate method must:
 * - detects whether the game is finished by setting mFinished to true, and determine the winner by assigning
 * mWinner (to JocGame.PLAYER_A, JocGame.PLAYER_B, JocGame.DRAW).
 * - calculate mEvaluation to indicate apparent advantage to PLAYER_A (higher positive evaluation) or to
 * PLAYER_B (lower negative evaluation)
 * Parameters:
 * - aFinishOnly: it is safe to ignore this parameter value, but for better performance, the mEvaluation setting
 * can be skipped if aFinishOnly is true (function caller is only interested if the game is finished).
 * - aTopLevel: it is safe to ignore this parameter value. For convenience, if true, there is no performance involved 
 * so it is safe to make additional calculation and storing data, for instance to simplify the display of the last move.
 */
Model.Board.Evaluate = function(aGame,aFinishOnly,aTopLevel) {

	if(aGame.GetRepeatOccurence(this)>2) {
		this.mFinished=true;
		this.mWinner=JocGame.DRAW;
		return;
	}

	var HEIGHT=aGame.mOptions.height;
	var $this=this;

	var emptyCount=0;
	var aCount=0;
	var bCount=0;

	aGame.ScrumEachDirection(this.ball,function(pos) {
		var cell=$this.board[pos];
		if(cell==-1)
			emptyCount++;
		else if(cell>=0) {
			var piece=$this.pieces[cell];
			if(piece.s==JocGame.PLAYER_A) {
				aCount++;
			} else {
				bCount++;
			}
			if(ballRow==0 && piece.p==JocGame.PLAYER_B) {
				$this.mFinished=true;
				$this.mWinner=JocGame.PLAYER_B;
			} else if(ballRow==HEIGHT-1 && piece.p==JocGame.PLAYER_A) {
				$this.mFinished=true;
				$this.mWinner=JocGame.PLAYER_A;
			}
		}
	});
	
	var ballRow=aGame.g.Coord[this.ball][0];
	if(ballRow==0 && bCount>0) {
		$this.mFinished=true;
		$this.mWinner=JocGame.PLAYER_B;
	}
	if(ballRow==HEIGHT-1 && aCount>0) {
		$this.mFinished=true;
		$this.mWinner=JocGame.PLAYER_A;
	}
	
	var rowCloseA=ballRow/(HEIGHT-1);
	var rowCloseB=1-rowCloseA;
	var rowClose=rowCloseA-rowCloseB;
	
	var neighbor=0;
	if(bCount==0)
		neighbor++;
	if(aCount==0)
		neighbor--;
	
	var aBDist=0;
	var bBDist=0;
	var bCoord=aGame.g.Coord[this.ball];
	for(var i in this.pieces) {
		var piece=this.pieces[i];
		var coord=aGame.g.Coord[piece.p];
		var d=Math.max(Math.abs(bCoord[0]-coord[0]),Math.abs(bCoord[1]-coord[1]));
		if(piece.s==JocGame.PLAYER_A) {
			aBDist+=d;
		} else {
			bBDist+=d;
		}
	}
	
	this.mEvaluation=
		(rowClose * aGame.mOptions.levelOptions.ROW_FACTOR) +
		(neighbor * aGame.mOptions.levelOptions.NEIGHBOR_FACTOR) +
		((bBDist-aBDist) * aGame.mOptions.levelOptions.BDIST_FACTOR)
	;

	//JocLog("Evaluate",this.mEvaluation,"neighbor",neighbor,"row",rowClose,"abdist",aBDist,"bbdist",bBDist);
}

/* Optional method.
 * Copy the given board data to self.
 * Even if optional, it is better to implement the method for performance reasons. 
 */
Model.Board.CopyFrom = function(aBoard) {
	this.board=[];
	for(var pos=0;pos<aBoard.board.length;pos++)
		this.board.push(aBoard.board[pos]);
	this.pieces=[];
	for(var i=0;i<aBoard.pieces.length;i++) {
		var piece=aBoard.pieces[i];
		this.pieces.push({
			s: piece.s,
			p: piece.p,
			a: piece.a,
			sc: piece.sc,
		});
	}
	this.ball=aBoard.ball;
	this.scrum=aBoard.scrum;
	this.first=aBoard.first;	
	this.mWho=aBoard.mWho;
	this.zSign=aBoard.zSign;
}

/* Modify the current board instance to apply the move.
 */
Model.Board.ApplyMove = function(aGame,move) {
	//JocLog("ApplyMove "+JSON.stringify(move)+" "+JSON.stringify(this));
	var $this=this;
	
	var piece0=this.board[move.seg[0].f];
	if(piece0<0) {
		JocLog("!!! ApplyMove",move,this.board,"seg0: no piece at start");
		return;
	}
	if(this.pieces[piece0].s!=this.mWho) {
		console.error("!!! ApplyMove",move,this.board,"seg0: piece at start is not self");
		return;
	}
	var pto0=this.board[move.seg[0].t];
	if(pto0!=-1 && pto0!=-2) {
		JocLog("!!! ApplyMove",move,this.board,"seg0: cell at dest not avail",pto0);
		return;
	}
	if(pto0==-2) {
		if(typeof(move.seg[0].b)=="undefined") {
			JocLog("!!! ApplyMove",move,this.board,"seg0: to ball but no ball depl");
			return;
		}
	}
	if(pto0!=-2) {
		if(typeof(move.seg[0].b)!="undefined") {
			JocLog("!!! ApplyMove",move,this.board,"seg0: no ball but ball depl");
			return;
		}
	}
	var seg=move.seg[0];
	var pIndex=this.board[seg.f];
	this.zSign=aGame.zobrist.update(this.zSign,"board",this.mWho,seg.f);
	this.board[seg.f]=-1;
	this.zSign=aGame.zobrist.update(this.zSign,"board",this.mWho,seg.t);
	this.board[seg.t]=pIndex;
	this.pieces[piece0].p=seg.t;
	if(seg.b!==undefined) {
		this.zSign=aGame.zobrist.update(this.zSign,"board",-2,this.ball);
		this.ball=seg.b;
		this.zSign=aGame.zobrist.update(this.zSign,"board",-2,this.ball);
		this.board[this.ball]=-2;
	}
	
	if(typeof(move.seg[1])!="undefined") {
		var piece1=this.board[move.seg[1].f];
		if(piece0==piece1) {
			JocLog("!!! ApplyMove",move,this.board,"seg1: move same piece");
			return;
		}
		if(piece1<0) {
			JocLog("!!! ApplyMove",move,this.board,"seg1: no piece at start");
			JocLog(move,this);
			return;
		}
		if(this.pieces[piece1].s!=this.mWho) {
			JocLog("!!! ApplyMove",move,this.board,"seg1: piece at start is not self");
			return;
		}
		var pto1=this.board[move.seg[1].t];
		if(pto1!=-1 && pto1!=-2) {
			JocLog("!!! ApplyMove",move,this.board,"seg1: cell at dest not avail");
			return;
		}
		if(pto1==-2) {
			if(typeof(move.seg[1].b)=="undefined") {
				JocLog("!!! ApplyMove",move,this.board,"seg1: to ball but no ball depl");
				return;
			}
		}
		if(pto1!=-2) {
			if(typeof(move.seg[1].b)!="undefined") {
				JocLog("!!! ApplyMove",move,this.board,"seg1: no ball but ball depl");
				return;
			}
		}
		var seg=move.seg[1];
		var pIndex=this.board[seg.f];
		this.zSign=aGame.zobrist.update(this.zSign,"board",this.mWho,seg.f);
		this.board[seg.f]=-1;
		this.zSign=aGame.zobrist.update(this.zSign,"board",this.mWho,seg.t);
		this.board[seg.t]=pIndex;
		this.pieces[piece1].p=seg.t;
		if(seg.b!==undefined) {
			this.zSign=aGame.zobrist.update(this.zSign,"board",-2,this.ball);
			this.ball=seg.b;
			this.zSign=aGame.zobrist.update(this.zSign,"board",-2,this.ball);
			this.board[this.ball]=-2;
		}
	}
	
	// detect scrum
	var emptyCount=0;
	aGame.ScrumEachDirection(this.ball,function(pos){
		if($this.board[pos]==-1) {
			emptyCount++;
			$this.scrumExit=pos;
		}
	});
	
	this.scrum=false;
	if(emptyCount==1) {
		this.scrum=true;
	} else if(emptyCount==0) {
		JocLog("!!! ApplyMove: ball enclosed");
	}
	
	var scrummers={};
	if(this.scrum) {
		aGame.ScrumEachDirection(this.ball,function(pos,dir) {
			var pIndex=$this.board[pos];
			if(pIndex>=0)
				scrummers[pIndex]=dir;
		});
	}
	for(var i=0;i<this.pieces.length;i++) {
		var piece=this.pieces[i];
		var angle=0;
		if(scrummers[i]!==undefined) {
			angle=[135,180,-135,90,-90,45,0,-45][scrummers[i]];
			piece.a=angle;
			piece.sc=true;
		} else {
			piece.a=angle+(piece.s==1?180:0);
			piece.sc=false;
		}
	}
	
	this.first=false;
	
	//JocLog("Applied Move "+JSON.stringify(this));
}
	
Model.Board.IsValidMove = function(aGame,move) {
	//JocLog("IsValidMove",move);
	var $this=this;
	var empty=0;
	var ball=this.ball;
	var seg1=move.seg[0];
	var seg2=move.seg[1];
	if(seg1.b) ball=seg1.b;
	if(seg2 && seg2.b) ball=seg2.b;
	aGame.ScrumEachDirection(ball,function(pos) {
		var cell=$this.board[pos];
		if(cell<0)
			empty++;
		if(seg1.t==pos || (seg2 && seg2.t==pos))
			empty--;
		if(seg1.f==pos || (seg2 && seg2.f==pos))
			empty++;
	});
	if(empty==0) {
		this.mInvalidMoveMessage=aGame.mStrings['no-surround'];
		return false;
	} else
		return true;
}

Model.Board.GetSignature = function() {
	return this.zSign;
}	
	

//# sourceMappingURL=scrum-model.js.map
