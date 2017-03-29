
(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(7,7);
	
	var confine = {};
	for(var pos=0;pos<geometry.boardSize;pos++) {
		if(!(
				(pos>=16 && pos<=18) ||
				(pos>=23 && pos<=25) ||
				(pos>=30 && pos<=32) 
				))
			confine[pos]=1;
	}
	
	var zones={
		bottom: {
			poss: [1,2,3,4,5,6,9,10,11,12],
			trans: [[0,-1],[1,0]],
		},
		left: {
			poss: [0,7,8,14,15,21,22,28,29,35],
			trans: [[1,0],[0,1]],
		},
		top: {
			poss: [36,37,38,39,42,43,44,45,46,47],
			trans: [[0,1],[-1,0]],
		},
		right: {
			poss: [13,19,20,26,27,33,34,40,41,48],
			trans: [[-1,0],[0,-1]],
		},
	}
	
	var pos2trans={};
	for(var zi in zones) {
		var zone=zones[zi];
		for(var pos in zone.poss)
			pos2trans[zone.poss[pos]]=zone.trans;
	} 

	var distance={};

	(function() {
		for(var pos in confine) {
			distance[pos]={};
			distance[pos][pos]=0;
		}
		var steps=[[-1,1],[0,1],[1,1]];
		var modifs=true;
		while(modifs) {
			modifs=false;
			for(var pos in confine) {
				steps.forEach(function(deltav) {
					var trans=pos2trans[pos];
					var delta=[trans[0][0]*deltav[0]+trans[0][1]*deltav[1],trans[1][0]*deltav[0]+trans[1][1]*deltav[1]];
					var pos1=geometry.Graph(pos,delta);
					if(pos1==null || !(pos1 in confine))
						return;
					if(distance[pos][pos1]!=1) {
						distance[pos][pos1]=1;
						modifs=true;
					} 
					for(var pos2 in confine) {
						if(pos2==pos)
							continue;
						if(distance[pos][pos2]===undefined && distance[pos1][pos2]!==undefined) {
							distance[pos][pos2]=distance[pos1][pos2]+1;
							modifs=true;
						} else if(distance[pos1][pos2]!==undefined && distance[pos][pos2]!==undefined && distance[pos][pos2]>distance[pos1][pos2]+1) {
							distance[pos][pos2]=distance[pos1][pos2]+1;
							modifs=true;
						}
					}
				});
			}
		}
		//console.log("distance",distance);
		geometry.GetDistance=function() {
			return distance;
		}
	})();
	
	var promo = {
		"1": { 46:1, 39:1 },
		"-1": { 2:1, 9:1 },
	}
	
	var distancePromo={	"1": {}, "-1": {} };
	["1","-1"].forEach(function(side) {
		for(var pos in confine) {
			var minDist=Infinity;
			for(var pos1 in promo[side]) {
				var dist=distance[pos][pos1];
				if(dist<minDist) {
					distancePromo[side][pos]=dist;
					minDist=dist;
				}
			}
		}		
	});

	Model.Game.cbRbGraph = function(geometry,deltas,maxDist,rebound,sideRebound) {
		var $this=this;
		var flags=this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_CAPTURE;
		maxDist = maxDist || 12;
		rebound = rebound || {};
		var graph={};
		for(var pos=0;pos<geometry.boardSize;pos++) {
			graph[pos]=[];
			if(confine && !(pos in confine))
				continue;
			deltas.forEach(function(delta) {
				var direction=[];
				var trans0=pos2trans[pos];
				var delta0=[trans0[0][0]*delta[0]+trans0[0][1]*delta[1],trans0[1][0]*delta[0]+trans0[1][1]*delta[1]];
				var pos1=geometry.Graph(pos,delta0);
				var dist=0;
				var rebounded=false;
				while(pos1!=null) {
					if(dist++==maxDist)
						break;
					if(confine && !(pos1 in confine))
						break;
					direction.push(pos1 | flags);
					var pos2=pos1;
					pos1=geometry.Graph(pos1,delta0);
					if(!rebounded && (pos2 in rebound)) {
						if(pos1==null || (confine && !(pos1 in confine))) {
							var trans2=pos2trans[pos2];
							if(sideRebound) {
								if(trans0[0]==trans2[0] && trans0[1]==trans2[1]) // same zone, invert deltaX
									delta0=[trans2[0][0]*-delta[0]+trans2[0][1]*delta[1],trans2[1][0]*-delta[0]+trans2[1][1]*delta[1]];									
								else
									delta0=[trans2[0][0]*delta[0]+trans2[0][1]*delta[1],trans2[1][0]*delta[0]+trans2[1][1]*delta[1]];
							} else 
								delta0=[trans2[0][0]*delta[0]+trans2[0][1]*delta[1],trans2[1][0]*delta[0]+trans2[1][1]*delta[1]];
							pos1=geometry.Graph(pos2,delta0);
							rebounded=true;							
						}
					}
				}
				if(direction.length>0)
					graph[pos].push($this.cbTypedArray(direction));
			});
		}
		return graph;

	}

	Model.Game.cbRbRookExtraGraph = function(geometry) {
		var graph={};
		var extras={
			1: [0,1],
			35: [1,0],
			47: [0,-1],
			13: [-1,0],
		}
		var flags=this.cbConstants.FLAG_MOVE | this.cbConstants.FLAG_CAPTURE;
		for(var pos=0;pos<geometry.boardSize;pos++) {
			graph[pos]=[];
			var delta=extras[pos];
			var direction=[];
			if(delta) {
				var pos1=geometry.Graph(pos,delta);
				var skipped=false;
				while(pos1!=null) {
					if(skipped)
						direction.push(pos1 | flags);
					else {
						skipped=true;
						direction.push(pos1 | this.cbConstants.FLAG_STOP);
					}
					pos1=geometry.Graph(pos1,delta);
				}				
				graph[pos].push(this.cbTypedArray(direction));			
			}
		}
		return graph;
	}
	
	var passLine={
		"1": [{2:1,9:1},{3:1,10:1}],
		"-1": [{39:1,46:1},{38:1,45:1}],
	}

	Model.Game.cbDefine = function() {

		return {
			
			geometry: geometry,
			
			pieceTypes: {

				0: {
					name: 'pawn',
					aspect: 'pawn',
					graph: this.cbRbGraph(geometry,[[-1,1],[0,1],[1,1]],1),
					value: 1,
					abbrev: '',
					fenAbbrev: 'P',
					initial: [{s:1,p:2},{s:1,p:9},{s:-1,p:39},{s:-1,p:46}],
				},
				
				5: {
					name: 'bishop',
					graph: this.cbMergeGraphs(geometry,
							this.cbRbGraph(geometry,[[-1,1],[1,1]],6,confine,true),
							this.cbRbGraph(geometry,[[-1,-1],[1,-1]],1)),
					value: 2.4,
					abbrev: 'B',
					initial: [{s:1,p:3},{s:-1,p:45}],
				},

				6: {
					name: 'rook',
					graph: this.cbMergeGraphs(geometry,
							this.cbRbGraph(geometry,[[0,1]],12,{0:1,6:1,42:1,48:1}),
							this.cbRbGraph(geometry,[[1,0],[-1,0],[0,-1]],1),
							this.cbRbRookExtraGraph(geometry)),
					value: 3.1,
					abbrev: 'R',
					initial: [{s:1,p:4},{s:1,p:11},{s:-1,p:37},{s:-1,p:44}],
					castle: true,
				},

				8: {
					name: 'king',
					isKing: true,
					graph: this.cbKingGraph(geometry,confine),
					abbrev: 'K',
					initial: [{s:1,p:10},{s:-1,p:38}],
				},

				9: {
					name: 'king-out',
					aspect: 'king',
					isKing: true,
					graph: this.cbKingGraph(geometry,confine),
					abbrev: 'K',
				},
				
			},

			promote: function(aGame,piece,move) {
				if(piece.t==8) {
					var pLine=passLine[piece.s];
					if((move.f in pLine[1]) && (move.t in pLine[0]))
						return [9];
				} else if(piece.t==9) {
					var pLine=passLine[piece.s];
					if((move.f in pLine[0]) && (move.t in pLine[1]))
						return [8];
				} 
				if(piece.t==0 && promo[piece.s][move.t])
					return [5,6];
				return [];
			},

			evaluate: function(aGame,evalValues,material) {

				// handle additional win condition
				if(this.kings[1]==38 && this.pieces[this.board[38]].t==9) {
					this.mFinished=true;
					this.mWinner=JocGame.PLAYER_A;
				}
				if(this.kings[-1]==10 && this.pieces[this.board[10]].t==9) {
					this.mFinished=true;
					this.mWinner=JocGame.PLAYER_B;
				}
				
				// check lack of material to checkmate
				var white=material[1].count;
				var black=material[-1].count;
				if(!white[0] && !white[5] && !white[6]) { // white king single
					if(!black[0] && !black[6]) {
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				if(!black[0] && !black[5] && !black[6]) { // black king single
					if(!white[0] && !white[6]) {
						this.mFinished=true;
						this.mWinner=JocGame.DRAW;
					}
				}
				
				// check 50 moves without capture
				if(this.noCaptCount>=100) {
					this.mFinished=true;
					this.mWinner=JocGame.DRAW;					
				}
				
				// motivate pawns to reach the promotion line
				var distPromo=0;
				for(var side=-1;side<=1;side+=2) {
					var pawns=material[side].byType[0],pawnsLength;
					if(pawns) {
						pawnsLength=pawns.length;
						for(var i=0;i<pawnsLength;i++)
							distPromo+=distancePromo[side][pawns[i].p]*side;
					}
				}
				evalValues['distPawnPromo']=distPromo;

				// motivate king to reach opponent throne
				evalValues['distKingThrone']=distance[this.kings[1]][38]-distance[this.kings[-1]][10];
				
			},
			
		};
	}
	
})();