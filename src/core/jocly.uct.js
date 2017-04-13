/*    Copyright 2017 Jocly
 *
 *    This program is free software: you can redistribute it and/or  modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *    As a special exception, the copyright holders give permission to link the
 *    code of portions of this program with the OpenSSL library under certain
 *    conditions as described in each individual source file and distribute
 *    linked combinations including the program with the OpenSSL library. You
 *    must comply with the GNU Affero General Public License in all respects
 *    for all of the code used other than as permitted herein. If you modify
 *    file(s) with this exception, you may extend this exception to your
 *    version of the file(s), but you are not obligated to do so. If you do not
 *    wish to do so, delete this exception statement from your version. If you
 *    delete this exception statement from all source files in the program,
 *    then also delete it in the license file.
 */

var JoclyUCT={};

if(typeof WorkerGlobalScope == 'undefined' && typeof SystemJS == 'undefined') {
	module.exports.JoclyUCT = JoclyUCT;
	(function() {
		var r = require;
		var ju = r("./jocly.util.js");
		global.MersenneTwister = ju.MersenneTwister;
		global.JocUtil = ju.JocUtil;
	})();
} else
	this.JoclyUCT = JoclyUCT;

(function() {
	
	function Node(parent,who) {
		this.visits=1;							// number of time the node has been visited
		this.children=null;					// node children if any
		this.who=who;							// 1 = first player, 2 = second player
		this.parents=[];						// parent nodes
		if(parent)
			this.parents.push(parent);
		this.known=false;						// true if all the node and nodes below have been expanded and all leaves are terminal 
		this.evaluation=0;						// the current minimax value
		this.staticEvalSum=0;					// the sum of the normalized playouts evaluations
		this.staticEvalCount=0;				// the number of playouts evaluations
		this.depth=parent?parent.depth+1:0;		// the node depth
	}
	
	Node.prototype={
		addParent: function(parent) {
			this.parents.push(parent);
			if(parent.depth+1<this.depth)
				this.depth=parent.depth+1;
		}
	}
	
	var winnerMap={ // convert from Jocly convention (draw==2)
		"-1": -1,
		1: 1,
		2: 0,
		0: 0
	}
		
	JoclyUCT.startMachine = function(aGame,aOptions) {
		var loopCount=0;
		var nodeCount=0;
		var redundantNodeCount=0;
		var poDur=0,poCount=0;	// playout stats
		var skippedAlphaBeta=0; // alpha-beta stats
		var maxDepth=0;

		var uctParams={
				minVisitsExpand: aOptions.level.minVisitsExpand || 1,
				playoutSpread: aOptions.level.playoutSpread || 2,
				playoutDepth: (aOptions.level.playoutDepth!==undefined)?aOptions.level.playoutDepth:0,
				c: (aOptions.level.c!==undefined)?aOptions.level.c:.3,
				playoutCeil: (aOptions.level.playoutCeil!==undefined)?aOptions.level.playoutCeil:0,
				log: aOptions.level.log?true:false,
				maxDuration: (aOptions.level.maxDuration!==undefined)?aOptions.level.maxDuration:2,
				maxLoops: (aOptions.level.maxLoops!==undefined)?aOptions.level.maxLoops:0,
				maxNodes: (aOptions.level.maxNodes!==undefined)?aOptions.level.maxNodes:0,
				showMinimaxTree: aOptions.level.showMinimaxTree?true:false,
				showBestLine: aOptions.level.showBestLine?true:false,
				ignoreLeaf: aOptions.level.ignoreLeaf===undefined?false:aOptions.level.ignoreLeaf,
				propagateMultiVisits: aOptions.level.propagateMultiVisits===undefined?true:aOptions.level.propagateMultiVisits,
				propagation: aOptions.level.propagation===undefined?"mixed":aOptions.level.propagation,
				useDepthWeights: aOptions.level.useDepthWeights===undefined?false:aOptions.level.useDepthWeights,
				productRatio: aOptions.level.productRatio===undefined?0:aOptions.level.productRatio,
				useAlphaBeta: aOptions.level.useAlphaBeta===undefined?false:aOptions.level.useAlphaBeta,
				uncertaintyFactor: aOptions.level.uncertaintyFactor===undefined?0:aOptions.level.uncertaintyFactor,
				directVisits: aOptions.level.directVisits===undefined?true:aOptions.level.directVisits,
				distributeEval: aOptions.level.distributeEval===undefined?true:aOptions.level.distributeEval,
				pickMove: aOptions.level.pickMove===undefined?"besteval":aOptions.level.pickMove, // or maxvisits
				debugRawEval: aOptions.level.debugRawEval===undefined?false:aOptions.level.debugRawEval,
		};
		var uctNodes={};
		var signatures; // the array of visited board signatures

		if(uctParams.log)
			console.log("Running UCT AI - ",aOptions.level.label,"- Player",aGame.mWho==1?"A":"B");

		/*
		 * Normalize evaluations to get -1<eval<1
		 * Handle negative and positive evaluations separately so 0 remains 0 
		 */
		var evalMapPositive={
			v: 0,						// evaluation original value
			l: null,					// "less" branch (for evaluations < v)
			m: {						// "more" branch (for evaluations > v)
				v: Number.MAX_VALUE,
				l: null,
				m: null,
			},
		}
		var evalMapNegative=JSON.parse(JSON.stringify(evalMapPositive)); // deep copy for the initial negative map
		
		function NormalizeEval(evaluation) {
			var evalNode=evalMapPositive;
			var negative=false;
			var normEval=0, step=1;
			if(evaluation==0)
				return 0;
			if(evaluation<0) {
				evaluation=-evaluation;
				evalNode=evalMapNegative;
				negative=true;
			}
			while(true) {
				if(evaluation>evalNode.v) {
					normEval+=step;
					if(!evalNode.m) {
						evalNode.m={
							v: evaluation,
							l: null,
							m: null
						}
					}
					evalNode=evalNode.m;
				} else if(evaluation<evalNode.v) {
					normEval-=step;
					if(!evalNode.l) {
						evalNode.l={
							v: evaluation,
							l: null,
							m: null
						}
					}
					evalNode=evalNode.l;
				} else {	// matching evaluation
					break;
				}
				step=step/2;
			}
			if(negative)
				normEval=-normEval;
			return normEval;
		}
		
		/*
		 * Best evaluation (minimax)
		 */
		function GetMinimaxEval(node,children) {
			var evaluation=undefined;
			for(var i=0;i<children.length;i++) {
				var node1=children[i];
				if(evaluation===undefined || node1.evaluation*node1.who>evaluation*node1.who)
					evaluation=node1.evaluation;
			}
			return evaluation;
		}
		/*
		 * Minus worse opponent evaluation
		 */
		function GetMaximinEval(node,children) {
			var evaluation=undefined;
			for(var i=0;i<children.length;i++) {
				var node1=children[i];
				if(evaluation===undefined || node1.evaluation*node1.who<evaluation*node1.who)
					evaluation=node1.evaluation;
			}
			return -evaluation;
		}
		/*
		 * Probability product evaluation
		 */
		function GetProductEval(node,children) {
			var value=1;
			for(var i=0;i<children.length;i++) {
				var node1=children[i];
				value1=(node1.evaluation+1)/2;
				if(node.who==1)
					value*=1-node1.evaluation;
				else
					value*=node1.evaluation;
			}
			if(node.who==1)
				return (1-value)*2-1;
			else
				return value*2-1;
		}
		
		function PropagateEvalParent(node,visits,visited) {
			if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop && (node.sign in visited))
				return;
			var children=[];
			if(uctParams.ignoreLeaf) {
				var hasExpandedChildren=false;
				for(var i=0;i<node.children.length;i++)
					if(node.children[i].n.children) {
						hasExpandedChildren=true;
						break;
					}
				if(hasExpandedChildren) {
					for(var i=0;i<node.children.length;i++) {
						var node1=node.children[i].n;
						if(node1.known || node1.children)
							children.push(node1);
					}
				}
			}
			if(children.length==0)
				for(var i=0;i<node.children.length;i++)
					children.push(node.children[i].n);

			var evaluation;
			switch(uctParams.propagation) {
			case "maximin":
				evaluation=GetMaximinEval(node,children);
				break;
			case "minimax2min-avg":
				var evaluation1=GetMaximinEval(node,children);
				var evaluation2=GetMinimaxEval(node,children);
				evaluation=(evaluation1+evaluation2)/2;
				break;
			case "minimax2min-best":
				var evaluation1=GetMaximinEval(node,children);
				var evaluation2=GetMinimaxEval(node,children);
				if(node.who==1)
					evaluation=Math.max(evaluation1,evaluation2);
				else
					evaluation=Math.min(evaluation1,evaluation2);
				break;
			case "product":
				evaluation=GetPropabilityProductEval(node,children);
				break;
			case "minimax":
			case "mixed":
			default:
				evaluation=GetMinimaxEval(node,children);
				if(uctParams.propagation=="mixed" && uctParams.productRatio>0) {
					evaluation2=GetProductEval(node,children);
					evaluation=uctParams.productRatio*evaluation2+(1-uctParams.productRatio)*evaluation;
				}
				if(uctParams.useDepthWeights)
					evaluation=WeightEval(evaluation,node.depth+1);
			}
			if(uctParams.uncertaintyFactor) // tend to do good things now rather than later
				evaluation*=1-Math.pow(10,-uctParams.uncertaintyFactor)*Math.log(node.depth+1);
			if(node.evaluation!==evaluation) { 
				node.evaluation=evaluation;
				if(!uctParams.directVisits)
					node.visits+=visits;
				PropagateEval(node,visits,visited);
			} else if(!uctParams.directVisits)
				PropagateVisits(node,visits,visited);
		}
		function PropagateEval(node,visits,visited) {
			if(node.parents.length==0) // root node: stop here
				return;
			if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop) {
				if(!visited)
					visited={};
				visited[node.sign]=true;
			}
			for(var i=0;i<node.parents.length;i++) {
				var parent=node.parents[i];
				if(uctParams.useAlphaBeta) { // sort the parent children so alpha-beta will be more efficient
					parent.children.sort(function(c1,c2) {
						return (c2.evaluation-c1.evaluation)*node.who;
					});
				}
				PropagateEvalParent(parent,visits,visited);
			}
		}

		function PropagateVisits(node,visits,visited) {
			if(node.parents.length==0) // root node: stop here
				return;
			if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop) {
				if(!visited)
					visited={};
				visited[node.sign]=true;
			}
			for(var i=0;i<node.parents.length;i++) {
				var parent=node.parents[i];
				if(!(parent.sign in visited)) {
					parent.visits+=visits;
					visited[parent.sign]=true;
					PropagateVisits(parent,visits,visited);
				}
			}
		}
		
		/*
		 * Propagates known boolean up 
		 */
		function PropagateKnownParent(node,visited) {
			if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop && (node.sign in visited))
				return;
			var known=true;
			for(var i=0;i<node.children.length;i++) {
				var node1=node.children[i].n;
				if(node1.known==false) {
					known=false;
					break;
				}
			}
			if(known==true) {
				node.known=true;
				PropagateKnown(node,visited);
			}
		}
		function PropagateKnown(node,visited) {
			if(node.known==false || node.parents.length==0)
				return;
			if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop) {
				if(!visited)
					visited={};
				visited[node.sign]=true;
			}
			for(var i=0;i<node.parents.length;i++)
				PropagateKnownParent(node.parents[i],visited);
		}

		/*
		 * A simple 32 bits integer transformation function, so that zobrist board signatures can be XORed without side effect
		 */
		function TransformInteger(v0) {
			var ib=1;
			var v=0;
			for(var i=0;i<32;i++) {
				var b=(v0>>>i)&1;
				if(ib)
					v=(v<<1)|b;
				else
					v=(v<<1)|(1-b);
				ib=b;
			}
			return v;
		}
		
		/*
		 * Runs an iteration
		 */
		function Step() {
			loopCount++;

			// Select
			var board=new (aGame.GetBoardClass())(aGame);
			board.CopyFrom(aGame.mBoard);
			
			var pathSign=0; // keep track of the boards we've been through (order doesn't matter)
			var node=rootNode;
			var depth=0;
			var descendMaxDepth=0;
			var moves=[];
			var nodePath=[];
			var parentVisits=loopCount;
			var visited={};
			var alpha=-2;
			var beta=2;
			while(true) {
				nodePath.push(node);
				if(depth>descendMaxDepth) {
					descendMaxDepth=depth;
				}
				if(node.children===null)
					break;
				var candidateChildren;
				if(uctParams.useAlphaBeta) {
					candidateChildren=[];
					for(var i=0;i<node.children.length;i++) {
						var child1=node.children[i];
						var node1=child1.n;
						candidateChildren.push(child1);
						if(node1.who==1 && // maximizing player 
							node1.evaluation>alpha)
							alpha=node1.evaluation;
						if(node1.who==-1 && // minimizing player
							node1.evaluation<beta)
							beta=node1.evaluation;
						if(beta<alpha) {
							skippedAlphaBeta+=node.children.length-1-i;
							//console.log("alpha-beta skipped",node.children.length-1-i,"nodes");
							break;
						}
					}
					
				} else
					candidateChildren=node.children;
				if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop) {
					var candidateChildren0=[];
					for(var i=0;i<candidateChildren.length;i++)
						if(!(candidateChildren[i].n.sign in visited))
							candidateChildren0.push(candidateChildren[i]);
					candidateChildren=candidateChildren0;
				}
				var bestChildren=[], bestUCB;
				var parentVisitsLog;
				if(uctParams.directVisits)
					parentVisitsLog=Math.log(parentVisits);
				else
					parentVisitsLog=Math.log(node.visits);
				
				function PickBestChildren() {
					for(var i=0;i<candidateChildren.length;i++) {
						var child1=candidateChildren[i];
						var node1=child1.n;
						if(node1.known)
							continue;
						var value=(node1.evaluation*node1.who+1)/2; // ensures value between 0 and 1
						var ucb;
						if(uctParams.directVisits)
							ucb=value+uctParams.c*Math.sqrt(parentVisitsLog/child1.f);
						else
							ucb=value+uctParams.c*Math.sqrt(parentVisitsLog/node1.visits);
						if(bestChildren.length==0 || ucb>=bestUCB) {
							if(bestChildren.length>0 && ucb>bestUCB)
								bestChildren=[];
							bestUCB=ucb;
							bestChildren.push(child1);
						}
					}
				}
				
				/*
				 * redistribute evaluations uniformly between 0 and 1 (excluded) 
				 */
				function PickBestChildrenDistributeEval() {

					var childrenDE={};
					var values=[];
					for(var i=0;i<candidateChildren.length;i++) {
						var child1=candidateChildren[i];
						var node1=child1.n;
						if(node1.known)
							continue;
						var value=(node1.evaluation*node1.who+1)/2; // ensures value between 0 and 1
						if(childrenDE[value]===undefined) {
							childrenDE[value]=[];
							values.push(value);
						}
						childrenDE[value].push(child1);
					}
					values.sort(function(v1,v2) {
						return v1-v2;
					});
					var step=1/(values.length+1);
					var index=0;
					for(var vi=0; vi<values.length;vi++) {
						index++;
						var value0=values[vi];
						var children=childrenDE[value0];
						var value1=step*index;
						for(var i=0;i<children.length;i++) {
							var child1=children[i];
							var node1=child1.n;
							var ucb;
							if(uctParams.directVisits)
								ucb=value1+uctParams.c*Math.sqrt(parentVisitsLog/child1.f);
							else
								ucb=value1+uctParams.c*Math.sqrt(parentVisitsLog/node1.visits);
							if(bestChildren.length==0 || ucb>=bestUCB) {
								if(bestChildren.length>0 && ucb>bestUCB)
									bestChildren=[];
								bestUCB=ucb;
								bestChildren.push(child1);
							}
						}
					}
				}
				
				if(uctParams.distributeEval)
					PickBestChildrenDistributeEval();
				else
					PickBestChildren()
				
				if(bestChildren.length==0) // all child nodes are known
					return;
				var child=bestChildren[Math.floor(Math.random()*bestChildren.length)];
				if(uctParams.directVisits) {
					child.f++;
					parentVisits=child.f;
				}
				node=child.n;
				if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop)
					visited[node.sign]=1;
				depth++;
				moves.push(child.m);
				board.ApplyMove(aGame,child.m);
				aGame.AddVisit(board);
				board.mMoves=[];
				signatures.push(board.GetSignature());
				if(aGame.mOptions.uctTransposition=="states")
					pathSign^=TransformInteger(board.GetSignature()); // consider the states we have been through but not their order
				board.mWho=-board.mWho;
			}
			
			// Expand
			if(node==rootNode || node.visits>=uctParams.minVisitsExpand) {
				if(!board.mMoves || board.mMoves.length==0)
					board.GenerateMoves(aGame);
				if(board.mFinished) { // in some game implementations, ending is detected while generating the moves
					node.known=true;
					node.evaluation=winnerMap[board.mWinner];
					PropagateKnown(node);
				} else {
					node.children=[];
					var bestEval=undefined;
					var known=true;
					for(var i=0;i<board.mMoves.length;i++) {
						var move=board.mMoves[i];
						var signatures1=[];
						var board1=new (aGame.GetBoardClass())(aGame);
						board1.CopyFrom(board);
						board1.ApplyMove(aGame,move);
						aGame.AddVisit(board1);
						board1.mMoves=[];
						board1.mWho=-board1.mWho;
						if(depth>maxDepth)
							maxDepth=depth;
						var signature=board1.GetSignature();
						signatures1.push(signature);
						var sign1;
						if(aGame.mOptions.uctTransposition=="states") {
							sign1=pathSign^signature; // board signature is not transformed to differentiate the leaf board
							sign1^=depth; // depth in signature
						} else if(aGame.mOptions.uctTransposition=="state")
							sign1=signature; // only final state counts
						var node1=null;
						if(aGame.mOptions.uctTransposition)
							node1=uctNodes[sign1];
						if(!node1) {
							node1=new Node(node,-node.who);
							nodeCount++;
							if(aGame.mOptions.uctTransposition) {
								uctNodes[sign1]=node1;
								node1.sign=sign1;
							}
							board1.Evaluate(aGame);
							if(board1.mFinished) {
								node1.known=true;
								node1.evaluation=winnerMap[board1.mWinner]; // 1, -1 or 0
							} else {
								if(isNaN(board1.mEvaluation))
									console.error("Evaluation in not a number !",board1.mEvaluation);
								node1.evaluation=Playout(node1,board1,signatures1);
							}
							node1.staticEvalSum=node1.evaluation;
							node1.staticEvalCount=1;
						} else {
							redundantNodeCount++;
							node1.addParent(node);
						}
						if(node1.known==false)
							known=false;
						var nodeChain={
							n: node1,
							m: (new (aGame.GetMoveClass())(move)).Strip(), // Save memory by stripping the stored move
						}
						if(uctParams.directVisits)
							nodeChain.f=1;
						node.children.push(nodeChain);
						var _eval=node1.evaluation*node1.who;
						if(bestEval===undefined || _eval>bestEval*node1.who)
							bestEval=node1.evaluation;
						for(var j=0;j<signatures1.length;j++)
							aGame.RemoveVisit(null,signatures1[j]);
					}
					node.evaluation=bestEval;
					PropagateEval(node,uctParams.propagateMultiVisits?board.mMoves.length:1);
					if(uctParams.directVisits)
						for(var i=0;i<nodePath.length;i++)
							nodePath[i].visits+=uctParams.propagateMultiVisits?board.mMoves.length:1;
					
					if(known) {
						node.known=true;
						PropagateKnown(node);
					}
				}
				return;
			}
			if(node.known)
				return;

			// Simulate
			function Playout(node,board,signatures) {
				var result=null;
				var t0=Date.now();
				for(var depth=0;depth<uctParams.playoutDepth || board.mWho==uctParams.playoutCeil*rootNode.who;depth++) {
					if(!board.mMoves || board.mMoves.length==0)
						board.GenerateMoves(aGame);
					if(board.mFinished) {
						result={
							finished: true,
							winner: winnerMap[board.mWinner],
						};
						break;
					}
					var weightedMoves=[];
					for(var i=0;i<board.mMoves.length;i++) {
						var board1=new (aGame.GetBoardClass())(aGame);
						board1.CopyFrom(board);
						board1.ApplyMove(aGame,board.mMoves[i]);
						aGame.AddVisit(board1);
						board1.mMoves=[];
						board1.Evaluate(aGame);
						var evaluation=board1.mEvaluation;
						if(board1.mFinished) {
							if(board1.mWinner==1)
								evaluation=Number.MAX_VALUE;
							else if(board1.mWinner==-1)
								evaluation=-Number.MAX_VALUE;
							else
								evaluation=0;
						} else if(isNaN(board1.mEvaluation))
							console.error("Evaluation in not a number !");

						weightedMoves.push({
							move: board.mMoves[i],
							evaluation: evaluation,
							board: board1,
						});
						aGame.RemoveVisit(board1);
					}
					weightedMoves.sort(function(a1,a2) {
						var ev1=a1.evaluation*board.mWho;
						var ev2=a2.evaluation*board.mWho;
						return ev2-ev1;
					});
					
					/*
					 * Pick the next move in the playout with a preference for the moves that seem the best.
					 * For instance, with playoutSpread=2, the probability weight to pick the best move is 1/2,
					 * the second best move 1/4, third best 1/8, ...
					 * If several moves have the same quality, they have the same probability.
					 */
					var n=weightedMoves.length;
					var r=1/uctParams.playoutSpread;
					var max=(1-Math.pow(r,n+1))/(1-r)-1;
					var rnd=Math.random()*max;
					var equalMoves, lastEval=undefined, cursor=0, reached=false;
					for(var i=0;i<n;i++) {
						var wMove=weightedMoves[i];
						var ev=wMove.evaluation;
						if(ev!==lastEval) {
							if(reached) {
								break;
							} else {
								equalMoves=[wMove];
								lastEval=ev;
							}
						} else {
							equalMoves.push(wMove);
						}
						cursor+=Math.pow(r,i+1);
						if(cursor>=rnd)
							reached=true;
					}
					var pickedMove=equalMoves[Math.floor(Math.random()*equalMoves.length)];

					board=pickedMove.board;
					aGame.AddVisit(board);
					signatures.push(board.GetSignature()); // remember the board state signature so it can be removed later 
					board.mWho=-board.mWho;
					if(board.mFinished) {
						result={
							finished: true,
							winner: winnerMap[board.mWinner],
						};
						break;
					}
				}
				if(result===null) {
					result={
						finished: false,
						eval: board.mEvaluation
					}
				}

				// update stats
				poDur+=Date.now()-t0;
				poCount++;

				var nodeEval;
				if(result.finished)
					nodeEval=result.winner; // 1, -1 or 0
				else {
					if(uctParams.debugRawEval)
						node.rawEval=result.eval;
					var normEval=NormalizeEval(result.eval);
					UpdateDepthEval(normEval,node.depth);
					nodeEval=normEval;
				}
				return nodeEval;
			}
			var evaluation=Playout(node,board,signatures);
			node.staticEvalSum+=evaluation;
			node.staticEvalCount++;
			node.evaluation=node.staticEvalSum/node.staticEvalCount; // averaging normalized evaluations might not be the best way to get an accurate result
			PropagateEval(node,1);
			if(uctParams.directVisits)
				for(var i=0;i<nodePath.length;i++)
					nodePath[i].visits++;
		}
		
		var evalWeights=[];
		/*
		 * Update the evaluation weight for the given depth in order to balance evaluation propagation
		 */
		function UpdateDepthEval(evaluation,depth) {
			while(evalWeights.length<=depth) 
				evalWeights.push({
					count: 0,
					sum: 0
				});
			var weight=evalWeights[depth];
			weight.sum+=evaluation;
			weight.count++;
		}
		/*
		 * 
		 */
		function WeightEval(evaluation,depth) {
			var weight=evalWeights[depth];
			if(weight===undefined) { // why does this happen, even if very rare ? :(
				while(evalWeights.length<depth) 
					evalWeights.push({
						count: 0,
						sum: 0
					});
				evalWeights.push({
					count: 1,
					sum: evaluation
				});
				return evaluation;
			}
			var average=weight.count>0?weight.sum/weight.count:0;
			if(evaluation>average) {
				evaluation=(evaluation-average)/(1-average);
			} else if(evaluation<average) {
				evaluation=-(average-evaluation)/(average+1);
			}
			return evaluation;
		}

		if(!aGame.mBoard.mMoves || aGame.mBoard.mMoves.length==0)
			aGame.mBoard.GenerateMoves(aGame);
		if(aGame.mBoard.mMoves.length==1) { // only one possible move: pick it
			aGame.mBestMoves=[aGame.mBoard.mMoves[0]];
			JocUtil.schedule(aGame, "Done", {});
			return;
		}
		if(aGame.mBoard.mMoves.length==0) {
			console.error("No move available",aGame);
			debugger;
		}
		var rootNode=new Node(null,-aGame.mWho);
		nodeCount++;
		if(aGame.mOptions.uctTransposition)
			uctNodes[aGame.mBoard.GetSignature()]=rootNode;
		
		var t0=Date.now();
		var lastProgressPercent=-1;
		function Run() {
			if(aGame.mAborted) {
				aGame.mAbortCallback.call(aGame);
				return;
			}
			var now=Date.now();
			var progressPercent=0;
			if(uctParams.maxDuration>0)
				progressPercent=Math.round(100*(now-t0)/(uctParams.maxDuration*1000));
			if(uctParams.maxLoops>0)
				progressPercent=Math.max(progressPercent,100*loopCount/uctParams.maxLoops);
			if(uctParams.maxNodes>0)
				progressPercent=Math.max(progressPercent,100*nodeCount/uctParams.maxNodes);
			progressPercent = Math.min(100,progressPercent);
			if(progressPercent!=lastProgressPercent) {
				lastProgressPercent=progressPercent;
				if(aGame.mProgressCallback)
					aGame.mProgressCallback(progressPercent);
			}
			if(!rootNode.children || (rootNode.known==false &&
					(uctParams.maxDuration<=0 || now<uctParams.maxDuration*1000+t0) &&
					(uctParams.maxLoops<=0 || loopCount<uctParams.maxLoops) &&
					(uctParams.maxNodes<=0 || nodeCount<uctParams.maxNodes)
				)) {
				do {
					signatures=[];
					try {
						Step();
					} catch(e) {
						console.error("UCT step",e);
						debugger;
					}
					for(var i=0;i<signatures.length;i++)
						aGame.RemoveVisit(null,signatures[i]);
				} while(Date.now()-100<now);
				setTimeout(Run,0);
			} else {
				if(uctParams.log) {
					ReportStats(rootNode);
				}
				
				var bestEval=undefined;
				aGame.mBestMoves=[];
				if(uctParams.pickMove=="maxvisits" && uctParams.directVisits) {
					for(var i=0;i<rootNode.children.length;i++) {
						var child=rootNode.children[i];
						var node=child.n;
						if(node.evaluation==node.who) {
							aGame.mBestMoves.push(child.m);
						}
					}
					if(aGame.mBestMoves.length==0) {
						for(var i=0;i<rootNode.children.length;i++) {
							var child=rootNode.children[i];
							if(bestEval===undefined || bestEval<=child.f) {
								if(bestEval===undefined || bestEval<child.f)
									aGame.mBestMoves=[];
								bestEval=child.f;
								aGame.mBestMoves.push(child.m);													
							}
						}
					}
				} else {
					var bestEval2=undefined;
					var candidateChildren=[];
					if(uctParams.pickMove=="besteval-multivisits")
						rootNode.children.forEach(function(child) {
							if(child.n.visits>1 || child.n.known==true)
								candidateChildren.push(child);
						});
					if(candidateChildren.length==0)
						candidateChildren=rootNode.children;
					for(var i=0;i<candidateChildren.length;i++) {
						var child=candidateChildren[i];
						var node=child.n;
						var staticEval=node.staticEvalSum/node.staticEvalCount;
						if(bestEval===undefined || bestEval>=node.evaluation*rootNode.who) {
							if(bestEval===undefined || bestEval>node.evaluation*rootNode.who || (
								bestEval==node.evaluation*rootNode.who && (
										bestEval2===undefined || bestEval2>rootNode.who*staticEval
										))) {
								bestEval2=staticEval;
								aGame.mBestMoves=[];
							}
							bestEval=node.evaluation*rootNode.who;
							aGame.mBestMoves.push(child.m);						
						}
					}
				}

				JocUtil.schedule(aGame, "Done", {});
			}
		}
		Run();
	
		function ReportStats(node) {
			console.log("  duration",Date.now()-t0);
			console.log("  evaluation:",node.evaluation);
			console.log("  fully explored:",node.known);
			console.log("  node count:",nodeCount);
			console.log("  redundant node count:",redundantNodeCount);
			console.log("  max depth:",maxDepth);
			console.log("  alpha-beta",uctParams.useAlphaBeta,"skipped",skippedAlphaBeta);
			console.log(" ",loopCount,"steps, per step",(Date.now()-t0)/loopCount,"ms");
			console.log(" ",poCount,"playouts",poDur,"ms, per playout",poDur/poCount,"ms");
			console.log("  UCT c",uctParams.c);
			console.log("  tree",rootNode);

			function ShowMinimax(node,depth) {
				if(uctParams.propagation!="minimax" && (uctParams.propagation!="mixed" || uctParams.productRatio>0)) {
					console.warn("Cannot display minimax tree on propagation",uctParams.propagation,"pp ratio",uctParams.productRatio);
					return;
				}
				var indent="";
				for(var i=0;i<depth;i++)
					indent+="  ";
				console.log(indent+"*",depth,"*",-node.who,"eval",node.evaluation);
				for(var i=0;i<node.children.length;i++) {
					var child1=node.children[i];
					var node1=child1.n;
					console.log(indent,"  "+(node1.evaluation==node.evaluation?"*":" ")+" move",(new (aGame.GetMoveClass())(child1.m)).ToString(),
							"visits",node1.visits,
							"eval",node1.evaluation,
							"known",node1.known,
							"sev",node1.staticEvalSum+"/"+node1.staticEvalCount,
							"who",node1.who,
							"children",node1.children?node1.children.length:"no");
					if(node1.children && node1.evaluation==node.evaluation)
						ShowMinimax(node1,depth+1);
				}
			}
			if(uctParams.showMinimaxTree) {
				console.log("Minimax tree");
				ShowMinimax(node,0);
			}
			
			if(uctParams.checkSide) {
				var checkSideNodeCount=0;
				var checkSideError=0;
				function CheckSide(node) {
					checkSideNodeCount++;
					if(node.children)
						for(var i=0;i<node.children.length;i++) {
							var child1=node.children[i];
							if(child1.n.who!=-node.who)
								checkSideError++;
							CheckSide(child1.n);
						}				
				}
				CheckSide(rootNode);
				console.log("  tree side alternance","node",checkSideNodeCount,"errors",checkSideError);
			}
		}
	}

})();

