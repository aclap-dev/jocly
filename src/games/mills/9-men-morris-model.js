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
	 * Each of the 24 positions on the board
	 * Directions: 0=right, 1=top, 2=left, 3=bottom
	 * this.g.Graph[position][direction] = new position to the direction or null if no position toward that direction
	 */
	this.g.Graph=[
	              [1,9,null,null], // 0
	              [2,4,0,null], // 1
	              [null,14,1,null], // 2
	              [4,10,null,null], // 3
	              [5,7,3,1], // 4
	              [null,13,4,null], // 5
	              [7,11,null,null], // 6
	              [8,null,6,4], // 7
	              [null,12,7,null], // 8
	              [10,21,null,0], // 9
	              [11,18,9,3], // 10
	              [null,15,10,6], // 11
	              [13,17,null,8], //12
	              [14,20,12,5], // 13
	              [null,23,13,2], // 14
	              [16,null,null,11], // 15
	              [17,19,15,null], // 16
	              [null,null,16,12], // 17
	              [19,null,null,10], // 18
	              [20,22,18,16], // 19
	              [null,null,19,13], // 20
	              [22,null,null,9], //21
	              [23,null,21,19], // 22
	              [null,null,22,14], // 23
	];
	/*
	 * Each of the 24 positions on the board
	 * this.g.Coord[position]=[row,column]
	 */
	this.g.Coord=[
	              [0,0], // 0
	              [0,3], // 1
	              [0,6], // 2
	              [1,1], // 3
	              [1,3], // 4
	              [1,5], // 5
	              [2,2], // 6
	              [2,3], // 7
	              [2,4], // 8
	              [3,0], // 9
	              [3,1], // 10
	              [3,2], // 11
	              [3,4], //12
	              [3,5], // 13
	              [3,6], // 14
	              [4,2], // 15
	              [4,3], // 16
	              [4,4], // 17
	              [5,1], // 18
	              [5,3], // 19
	              [5,5], // 20
	              [6,0], //21
	              [6,3], // 22
	              [6,6], // 23
	];
	
	/*
	 * All groups of 3 aligned positions
	 */
	this.g.Triplets=[
	                 [0,1,2],
	                 [3,4,5],
	                 [6,7,8],
	                 [9,10,11],
	                 [12,13,14],
	                 [15,16,17],
	                 [18,19,20],
	                 [21,22,23],
	                 [0,9,21],
	                 [3,10,18],
	                 [6,11,15],
	                 [1,4,7],
	                 [16,19,22],
	                 [8,12,17],
	                 [5,13,20],
	                 [2,14,23],
    ];
}
