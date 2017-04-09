/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

// tools
Model.Game.HexInitRCPosAndLayout=function(){
	
	/*
	if(this._HexInitRCPosAndLayout)
		return;
	this._HexInitRCPosAndLayout=true;
	*/
	
	var HEIGHT=this.mOptions.maxLines;
	var layout=[];
	var rcPositions=[];
	var rcPosIdx=0;
	for(var r=0;r<this.mOptions.maxLines;r++) {
		layout[r]=[];
		rcPositions[r]=[];
		for(var c=0;c<this.mOptions.maxCols;c++) {
			layout[r][c]=this.mOptions.boardLayout[HEIGHT-1-r][c];
			if(layout[r][c]!="."){
				rcPositions[r][c]=rcPosIdx;
				rcPosIdx++;
			} else { 
				rcPositions[r][c]=-1;
			}
		}
	}	
	this.g.rcPositions=rcPositions;
	this.g.Layout=layout;
	this.g.nbPos=rcPosIdx;
}

Model.Game.HexRcPos=function(r,c){
	//return r*this.mOptions.maxCols+c;
	return this.g.rcPositions[r][c];
}
Model.Game.HexIsCell=function(r,c){
	if (r<0 || r>=this.mOptions.maxLines || c<0 || c>=this.mOptions.maxCols) return false;
	return this.g.Layout[r][c]!=".";
}

/* Optional method.
 * Called when the game is created.
 */
Model.Game.HexInitGame = function() {

	this.HexInitRCPosAndLayout();
	
	this.g.orientation=this.mOptions.orientation;
	this.g.maxNbCellsPerMove=this.mOptions.maxNbCellsPerMove;
	this.g.margin=this.mOptions.margin;

	var g=[];
	var coord=[];
	
	for(var r=0;r<this.mOptions.maxLines;r++) {
		for(var c=0;c<this.mOptions.maxCols;c++) {
			if (this.HexIsCell(r,c)){
				var pos=this.HexRcPos(r,c);
				coord[pos]=[r,c];				
				g[pos]=[];
				// go for 6 directions, trigonometric positive way, start with 0° if onACorner, 30° if onASide
				if (this.g.orientation=="onASide"){
					for (var d=0 ; d < 6 ; d++){
						switch (d){
							case 0: if (this.HexIsCell(r+1,c+1)) g[pos].push(this.HexRcPos(r+1,c+1)); else g[pos].push(null); break;
							case 1: if (this.HexIsCell(r+2,c)) g[pos].push(this.HexRcPos(r+2,c)); else g[pos].push(null); break; 
							case 2: if (this.HexIsCell(r+1,c-1)) g[pos].push(this.HexRcPos(r+1,c-1)); else g[pos].push(null); break;
							case 3: if (this.HexIsCell(r-1,c-1)) g[pos].push(this.HexRcPos(r-1,c-1)); else g[pos].push(null); break;
							case 4: if (this.HexIsCell(r-2,c)) g[pos].push(this.HexRcPos(r-2,c)); else g[pos].push(null); break;
							case 5: if (this.HexIsCell(r-1,c+1)) g[pos].push(this.HexRcPos(r-1,c+1)); else g[pos].push(null); break;
							default : break;
						}
					}
				}else{ //onACorner
					for (var d=0 ; d < 6 ; d++){
						switch (d){
							case 0: if (this.HexIsCell(r,c+2)) g[pos].push(this.HexRcPos(r,c+2)); else g[pos].push(null); break;
							case 1: if (this.HexIsCell(r+1,c+1)) g[pos].push(this.HexRcPos(r+1,c+1)); else g[pos].push(null); break;
							case 2: if (this.HexIsCell(r+1,c-1)) g[pos].push(this.HexRcPos(r+1,c-1)); else g[pos].push(null); break;
							case 3: if (this.HexIsCell(r,c-2)) g[pos].push(this.HexRcPos(r,c-2)); else g[pos].push(null); break;
							case 4: if (this.HexIsCell(r-1,c-1)) g[pos].push(this.HexRcPos(r-1,c-1)); else g[pos].push(null); break;
							case 5: if (this.HexIsCell(r-1,c+1)) g[pos].push(this.HexRcPos(r-1,c+1)); else g[pos].push(null); break;
							default : break;
						}
					}
				}
			}
		}
	}

	this.g.Graph=g;
	this.g.Coord=coord;
}

/* Optional method.
 * Called when the game is over.
 */
Model.Game.DestroyGame = function() {
}

Model.Board.xtraInitBoard = function(aGame) {	
}

/* Board object constructor.
 * There 2 strategies about initializing boards:
 * 1/ implement the starting board in the Init function and no implementation of Model.Board.InitialPosition
 * 2/ implement in Init function the very minimum to allow Model.Board.CopyFrom to work (note the default CopyFrom is
 * compatible with an empty Init) and implement Model.Board.InitialPosition to set the board data as starting board
 * Second method is better for performance.
 */
Model.Board.HexInit = function(aGame) {	

	var WIDTH=aGame.mOptions.maxCols;
	var HEIGHT=aGame.mOptions.maxLines;
	this.board=[]; // access pieces by position
	// init
	var initVal=-1;
	if (aGame.mOptions.boardInitValue!=undefined) initVal=aGame.mOptions.boardInitValue;
	for(var r=0;r<HEIGHT;r++) {
		for(var c=0;c<WIDTH;c++)
			this.board[aGame.HexRcPos(r,c)]=initVal;
	}
	var INITIAL=aGame.mOptions.initial;
	this.pieces=[]; // access pieces by index
	var index=0;
	var indexPieces=[{},{}]
	if (INITIAL){
		for(var rtab=0;rtab<HEIGHT;rtab++) {
			var r = HEIGHT-1-rtab;
			for(var c=0;c<WIDTH;c++) {
				var pos=aGame.HexRcPos(r,c);
				switch(INITIAL.a[rtab][c]){
					case ".":
					case "#":
					break;
					default:
						var pieceType=INITIAL.a[rtab][c];
						var indexPiece=indexPieces[0][pieceType];
						if(typeof indexPiece=="undefined")
							indexPieces[0][pieceType]=0;
						this.pieces.push({
							s: JocGame.PLAYER_A, // side
							pos: pos, // cell num
							type: pieceType, // type of token (pawn or king for instance)
							alive: true,
							index: indexPieces[0][pieceType]++,
						});
						this.board[pos]=index++; // update board
					break;
				}
				switch(INITIAL.b[rtab][c]){
					case ".":
					case "#":
					break;
					default:
						var pieceType=INITIAL.b[rtab][c];
						var indexPiece=indexPieces[1][pieceType];
						if(typeof indexPiece=="undefined")
							indexPieces[1][pieceType]=0;
						this.pieces.push({
							s: JocGame.PLAYER_B, // side
							pos: pos, // cell num
							type: pieceType, // type of token (pawn or king for instance)
							alive: true,
							index: indexPieces[1][pieceType]++,
						});
						this.board[pos]=index++; // update board
					break;
				}			
			}
		}
	}	
}

/* Optional method.
 * Initialize the board as corresponding to a starting game 
 */
/*
Model.Board.InitialPosition = function(aGame) {
}
*/

	
	
	
