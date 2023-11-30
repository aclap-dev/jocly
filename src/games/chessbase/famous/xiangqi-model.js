
(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(9,10);
	geometry.ADVISOR_AREA = {3:1,5:1,13:1,21:1,23:1,66:1,68:1,76:1,84:1,86:1};
	geometry.ELEPHANT_AREA = { 
		'1': {2:1,6:1,18:1,22:1,26:1,38:1,42:1}, 
		'-1': {83:1,87:1,63:1,67:1,71:1,47:1,51:1},
	};
	geometry.GENERAL_AREA = { 
		3:1, 4:1, 5:1,12:1,13:1,14:1,21:1,22:1,23:1,
		84:1,85:1,86:1,75:1,76:1,77:1,66:1,67:1,68:1
	};
	// TODO move params below into variant definition
	Model.Game.cbOnStaleMate = -1; // stalemate = last player loses

	Model.Game.cbPerpEval = function(board, aGame) {
		var result, loop = aGame.GetRepeatOccurence(board, 1) >> 1;
		// handle perperual checking
		if(board.oppoCheck >= loop)
			result = (board.check >= loop ? JocGame.DRAW : -board.mWho);
		else
			result = (board.check >= loop ? board.mWho : JocGame.DRAW);
		return result;
	}

	Model.Game.cbDefine = function() {
		
		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn-w',
					aspect: 'xq-pawn',
					graph: this.cbXQPromoSoldierGraph(geometry,1),
					abbrev: '',
					value: 2,
					fenAbbrev: 'P',
				},
				
				1: {
					name: 'pawn-b',
					aspect: 'xq-pawn',
					graph: this.cbXQPromoSoldierGraph(geometry,-1),
					abbrev: '',
					value: 2,
					fenAbbrev: 'P',
				},

				2: {
					name: 'ipawn-w',
					aspect: 'xq-pawn',
					graph: this.cbXQSoldierGraph(geometry,1),
					abbrev: '',
					value: 1,
					fenAbbrev: 'P',
					initial: [{s:1,p:27},{s:1,p:29},{s:1,p:31},{s:1,p:33},{s:1,p:35}],
				},

				3: {
					name: 'ipawn-b',
					aspect: 'xq-pawn',
					graph: this.cbXQSoldierGraph(geometry,-1),
					abbrev: '',
					value: 1,
					fenAbbrev: 'P',
					initial: [{s:-1,p:54},{s:-1,p:56},{s:-1,p:58},{s:-1,p:60},{s:-1,p:62}],
				},
				
				4: {
					name: 'cannon',
					aspect: 'xq-cannon',
					graph: this.cbXQCannonGraph(geometry),
					abbrev: 'C',
					value: 4.5,
					initial: [{s:1,p:19},{s:1,p:25},{s:-1,p:64},{s:-1,p:70}],
				},
				
				5: {
					name: 'chariot',
					aspect: 'xq-chariot',
					graph: this.cbRookGraph(geometry),
					abbrev: 'R',
					value: 9,
					initial: [{s:1,p:0},{s:1,p:8},{s:-1,p:81},{s:-1,p:89}],
				},

				6: {
					name: 'horse',
					aspect: 'xq-horse',
					graph: this.cbHorseGraph(geometry),
					abbrev: 'H',
					value: 4,
					initial: [{s:1,p:1},{s:1,p:7},{s:-1,p:82},{s:-1,p:88}],
				},

				7: {
					name: 'elephant-w',
					aspect: 'xq-elephant',
					graph: this.cbXQElephantGraph(geometry,geometry.ELEPHANT_AREA[1]),
					abbrev: 'E',
					value: 2,
					initial: [{s:1,p:2},{s:1,p:6}],
				},
				
				8: {
					name: 'elephant-b',
					aspect: 'xq-elephant',
					graph: this.cbXQElephantGraph(geometry,geometry.ELEPHANT_AREA[-1]),
					abbrev: 'E',
					value: 2,
					initial: [{s:-1,p:83},{s:-1,p:87}],
				},
				
				9: {
					name: 'advisor',
					aspect: 'xq-advisor',
					graph: this.cbXQAdvisorGraph(geometry,geometry.ADVISOR_AREA),
					abbrev: 'A',
					value: 2,
					initial: [{s:1,p:3},{s:1,p:5},{s:-1,p:84},{s:-1,p:86}],
				},
				
				10: {
					name: 'general',
					aspect: 'xq-general',
					isKing: true,
					graph: this.cbXQGeneralGraph(geometry,geometry.GENERAL_AREA),
					abbrev: 'K',
					initial: [{s:1,p:4},{s:-1,p:85}],
				},
				
			},
			
			promote: function(aGame,piece,move) {
				if(piece.t==2 && move.t>=45)
					return [0];
				else if(piece.t==3 && move.t<45)
					return [1];
				return [];
				return [];
			},

			/*
			importGame: function(initial,format,data) {
				initial.pieces.forEach(function(piece) {
					if(piece.s==1 && geometry.R(piece.p)==1 && piece.t==0) {
						piece.t=1;
						piece.m=false;
					}
					if(piece.s==1 && geometry.R(piece.p)!=1 && piece.t==1) {
						piece.t=0;
						piece.m=true;
					}
					if(piece.s==-1 && geometry.R(piece.p)==geometry.height-2 && piece.t==2) {
						piece.t=3;
						piece.m=false;
					}
					if(piece.s==-1 && geometry.R(piece.p)!=geometry.height-2 && piece.t==3) {
						piece.t=2;
						piece.m=true;
					}
				});
				return true;
			},
			*/

			zobrist: "old" // force use of (flawed) keys to not break opening book
		};
	}

	Model.Board.CompactMoveString = function(aGame,aMove) {
		var $this=this;
		function ColName(col) {
			if($this.mWho>0)
				return 9-col;
			else
				return col+1;
		}
		var letters={0:'P',1:'P',2:'P',3:'P',4:'C',5:'R',6:'H',7:'E',8:'E',9:'A',10:'K'};
		function GetNotation(aMove) {
			var piece=$this.pieces[$this.board[aMove.f]];
			var letter=letters[piece.t];
			var str=letter;
			var startCol=geometry.C(aMove.f);
			var endCol=geometry.C(aMove.t);
			var startRow=geometry.R(aMove.f);
			var endRow=geometry.R(aMove.t);
			var matching=[];
			$this.pieces.forEach(function(piece) {
				if(piece.p>=0 && piece.s==$this.mWho && letters[piece.t]==letter && geometry.C(piece.p)==startCol)
					matching.push(piece);
			});
			matching.sort(function(a,b) {
				return (geometry.R(a.p)-geometry.R(b.p))*$this.mWho;
			});
			if(matching.length==1)
				str+=ColName(startCol);
			else if(matching.length==2) {
				if(matching[0]==piece)
					str+='+';
				else
					str+='-';
			} else if(matching.length==3) {
				if(matching[0]==piece)
					str+='+';
				else if(matching[1]==piece)
					str+=ColName(startCol);
				else
					str+='-';
			} else if(matching.length==4) {
				if(matching[0]==piece)
					str='++';
				else if(matching[1]==piece)
					str+='+';
				else if(matching[2]==piece)
					str+='-';
				else
					str='--';
			} else if(matching.length==5) {
				if(matching[0]==piece)
					str='++';
				else if(matching[1]==piece)
					str+='+';
				else if(matching[2]==piece)
					str+=ColName(startCol);
				else if(matching[3]==piece)
					str+='-';
				else
					str='--';
			}
			
			if(startRow==endRow)
				str+='.'+ColName(endCol);
			else {
				if((endRow-startRow)*$this.mWho>0)
					str+='+';
				else
					str+='-';
				if(startCol!=endCol)
					str+=ColName(endCol);
				else if((endRow-startRow)*$this.mWho>0)
					str+=Math.abs(endRow-startRow);
				else 
					str+=Math.abs(endRow-startRow);
			}
			
			return str;
		}

		var moveStr0=GetNotation(aMove);
		
		var piece=this.pieces[this.board[aMove.f]];
		if(letters[piece.t]=='P' && geometry.R(aMove.f)==geometry.R(aMove.t)) {
			var tandemCols={};
			this.pieces.forEach(function(piece) {
				if(piece.p>=0 && piece.s==$this.mWho && letters[piece.t]=='P') {
					var startCol=geometry.C(piece.p);
					if(tandemCols[startCol]===undefined)
						tandemCols[startCol]=1;
					else
						tandemCols[startCol]++;
				}
			});
			var tandemCount=0;
			for(var col in tandemCols)
				if(tandemCols[col]>1)
					tandemCount++;
			if(tandemCount>1) {
				moveStr0=ColName(geometry.C(aMove.f))+moveStr0.substr(1);
			}
		}

		return moveStr0;
	}

	Model.Move.ToString = function(format) {
		var self = this;
		function PosName(pos) {
			var col = pos % 9;
			var row = (pos-col)/9;
			return String.fromCharCode(("a".charCodeAt(0))+col) + row;
		}
		return PosName(self.f) + PosName(self.t);
	}
	
})();
