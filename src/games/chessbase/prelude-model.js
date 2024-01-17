/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {

	var SuperModelBoardInitialPosition=Model.Board.InitialPosition;
	Model.Board.InitialPosition = function(aGame) {
		SuperModelBoardInitialPosition.apply(this,arguments);
		if(aGame.cbVar.prelude) this.lastMove.f=-2; // request prelude
	}

	var SuperModelBoardGenerateMoves=Model.Board.GenerateMoves;
	Model.Board.GenerateMoves = function(aGame) {
		// first moves (white and black) are managed specifically to setup K,Q,E,L initial position 
		if(this.lastMove.f==-2)  { // we are in prelude
			var dialog=aGame.cbVar.prelude[this.lastMove.t]; // prescriptions for this stage
			if(!dialog) { // no presciption
				this.mMoves=[{}]; // only 'move' is a turn pass (no 'setup' field)
				return;
			}
			this.mMoves=[];
			for(var i=0;i<dialog.setups.length;i++) // push pseudo-move for each possible selection
				this.mMoves.push({setup:i});
			return;
		}
		SuperModelBoardGenerateMoves.apply(this,arguments); // call regular GenerateMoves method
	}

	/*
	 * Model.Board.Evaluate overriding: in setup phase, no evaluation 
	 */
	var SuperModelBoardEvaluate = Model.Board.Evaluate;
	Model.Board.Evaluate = function(aGame) {
		if(this.lastMove.f==-2)	return; // no eval in prelude
		SuperModelBoardEvaluate.apply(this,arguments);
	}

	/*
	 * Model.Board.ApplyMove overriding: setup phase and king special move
	 */
	var SuperModelBoardApplyMove=Model.Board.ApplyMove;
	Model.Board.ApplyMove = function(aGame,move) {

		function abbrev2typeIndex(id,who) { // find first or last piece type with given ID
			var res;
			for(var typeIndex in types) { // identify type the ID stands for
				var type=types[typeIndex];
				if(id==(type.abbrev || type.fenAbbrev)) {
					res=typeIndex;
					if(who>0) break; // white wants first
				}
			}
			return res;
		}

		if(this.lastMove.f==-2) { // we are in prelude
			if(move.setup !== undefined) { // move is a setup instruction (not a turn pass)
				var $this=this;
				var dialog=aGame.cbVar.prelude[this.lastMove.t]; // info for this prelude stage
				var pieceIDs=dialog.setups[move.setup];
				var types=aGame.cbVar.pieceTypes;
				var nrPieces=this.cbPiecesCount;
				for(var who=-1; who<=1; who+=2) { // perform the setup indicated by the move
					var squares=dialog.squares[who];
					var j=0;
					for(var i=0; i<squares.length; i++) {
						var pos=squares[i]; // next square
						var id=pieceIDs[j++];  // next piece
						while(id=='/' || id==' ') id=pieceIDs[j++]; // but skip slash or space
						var pieceIndex=this.board[pos];
						var offs=aGame.cbVar.prelude.blackTypeOffsets;
						var piece=this.pieces[pieceIndex];
						this.zSign^=aGame.bKey(piece);
						piece.t=abbrev2typeIndex(id,who); // 'promote' the piece to the desired type
						this.zSign^=aGame.bKey(piece);
					}
				}
				this.cbPlacePieces(aGame); // this sorts the piece list again, based on the new piece values
				if(this.mWho<0) this.zSign^=aGame.wKey(1);
				var promo=dialog.participants;
				if(promo) { // create new list of participating non-pawn, non-royals
					while(promo.length) promo.pop(); // empty existing array (which might be owned by promotion routine)
					var present=[];
					for(pos=0; pos<aGame.g.boardSize; pos++) {
						var p=this.board[pos];
						if(p>=0) {
							var t=this.pieces[p].t;
							if(!types[t].isKing && t>=this.cbPawnTypes) present[t]=1;
						}
					}
					for(var t in present) promo.push(t);
				}
			} // turn pass doesn't change game state other than going to the next stage
			if(++this.lastMove.t==aGame.cbVar.prelude.length) this.lastMove.f=-1; // next stage of prelude, or done with it
		} else
			SuperModelBoardApplyMove.apply(this,arguments);
	}

	/*
	 * Model.Move.ToString overriding for setup notation
	 */
	var SuperModelMoveToString = Model.Move.ToString;
	Model.Move.ToString = function() {
		if(this.f===undefined) {
			if(this.setup===undefined)
				return "--";
			else
				return "#"+this.setup;
		}
		return SuperModelMoveToString.apply(this,arguments);
	}

	/*
	 * Model.Board.CompactMoveString overriding to help reading PJN game transcripts
	 */
	var SuperModelBoardCompactMoveString = Model.Board.CompactMoveString; 
	Model.Board.CompactMoveString = function(aGame,aMove,allMoves) {
		if(typeof aMove.ToString!="function") // ensure proper move object, if necessary
			aMove=aGame.CreateMove(aMove);
		if(this.lastMove.f==-2)
			return aMove.ToString();
		return SuperModelBoardCompactMoveString.apply(this,arguments);
	}

	/*
	 * Model.Board.StaticGenerateMoves overriding to prevent using AI during the setup phase
	 */
	Model.Board.StaticGenerateMoves = function(aGame) {
		if(this.lastMove.f==-2) { // prelude; fake we have book move
			var dialog=aGame.cbVar.prelude[this.lastMove.t];
			if(!dialog) return {}; // even if just a turn pass
			return [aGame.CreateMove({setup:Math.floor(Math.random()*dialog.setups.length)})]; // pick randomly from this stage's setups
		}
		return null;
	}

})();
