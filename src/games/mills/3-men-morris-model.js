/*
 *
 * Copyright (c) 2012 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

Model.Game.InitGameExtra = function() {
}

Model.Game.BuildGraphCoord = function() {

	/*
	 * Each of the 9 positions on the board
	 * Directions: 0=right, 1=top, 2=left, 3=bottom
	 * this.g.Graph[position][direction] = new position to the direction or null if no position toward that direction
	 */
	this.g.Graph=[
	              [1,3,null,null], // 0
	              [2,4,0,null], // 1
	              [null,5,1,null], // 2
	              [4,6,null,0], // 3
	              [5,7,3,1], // 4
	              [null,8,4,2], // 5
	              [7,null,null,3], // 6
	              [8,null,6,4], // 7
	              [null,null,7,5], // 8	              
	];
	/*
	 * Each of the 9 positions on the board
	 * this.g.Coord[position]=[row,column]
	 */
	this.g.Coord=[
	              [0,0], // 0
	              [0,1], // 1
	              [0,2], // 2
	              [1,0], // 3
	              [1,1], // 4
	              [1,2], // 5
	              [2,0], // 6
	              [2,1], // 7
	              [2,2], // 8
	];
	
	/*
	 * All groups of 3 aligned positions
	 */
	this.g.Triplets=[
	                 [0,1,2],
	                 [3,4,5],
	                 [6,7,8],
	                 [0,3,6],
	                 [1,4,7],
	                 [2,5,8],
    ];
}
