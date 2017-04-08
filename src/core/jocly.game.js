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

try {

	exports.Game = JocGame = function() {}
	exports.Board = JocBoard = function() {}
	exports.Move = JocMove = function() {}

} catch(e) {
	global.JocGame = exports.Game = function() {};
	global.JocBoard = exports.Board = function() {};
	global.JocMove = exports.Move = function() {};

	(function() {
		var r = require;
		var ju = r("./jocly.util.js");
		global.MersenneTwister = ju.MersenneTwister;
		global.JocUtil = ju.JocUtil;
		global.JoclyUCT = r("./jocly.uct.js").JoclyUCT;
	})();
}

JocGame.PLAYER_A = 1;
JocGame.PLAYER_B = -1;
JocGame.DRAW = 2;

if(typeof document!="undefined")
	JocGame.CLICK=('ontouchstart' in document.documentElement)?"touchstart":"click";
else
	JocGame.CLICK="click";
/*
JocGame.MOUSEMOVE_EVENT=('ontouchstart' in document.documentElement)?"touchmove":"mousemove";
JocGame.MOUSEDOWN_EVENT=('ontouchstart' in document.documentElement)?"touchstart":"mousedown";
JocGame.MOUSEUP_EVENT=('ontouchstart' in document.documentElement)?"touchend":"mouseup";
*/

JocGame.MOUSEMOVE_EVENT="touchmove mousemove";
JocGame.MOUSEDOWN_EVENT="touchstart mousedown";
JocGame.MOUSEUP_EVENT="touchend mouseup joclyclick";

/* biggest integer with unit precision: 
   Math.pow(2,53)-1 < Math.pow(2,53) is true 
   Math.pow(2,54)-1 < Math.pow(2,54) is false */
JocGame.MAX_VALUE = Math.pow(2,53); 

JocGame.prototype = {}

JocGame.prototype.Init = function(aOptions) {
	this.mWho = JocGame.PLAYER_A;
	this.mViewAs = JocGame.PLAYER_A;
	this.mTopLevel = 3;
	this.mLoopMax = 300;
	this.mPreventRepeat = false;
	if(aOptions) {
		this.mOptions = aOptions.game;
		this.mViewOptions = aOptions.view;
		this.mSkin = this.mViewOptions.skins[0].name; // TODO check if 3D not supported
		this.mNotation=false;
		this.mShowMoves=this.mViewOptions.useShowMoves;
		this.mSounds=!!this.mViewOptions.sounds;
		this.mAutoComplete=false;

		if(typeof(this.mOptions.level)!="undefined")
			this.mTopLevel = this.mOptions.level;
		if (typeof(this.mOptions.loopMax)!="undefined")
			this.mLoopMax = this.mOptions.loopMax;
		this.mVisitedBoards = {};
		if(typeof(this.mOptions.viewAs)!="undefined")
			this.mViewAs = this.mOptions.viewAs;
	}
	this.mNextSchedule = null;
	this.mPlayedMoves = [];
	this.mFullPlayedMoves = [];
	this.mViewInited = false;
	this.mGameInited = false;
	if(aOptions && aOptions.initial)
		this.GameInitGame(aOptions.initial);
	else
		this.GameInitGame();
	this.mBoard = new (this.GetBoardClass())(this);
	if(this.mBoard.InitialPosition)
		this.mBoard.InitialPosition(this);
	this.mBoard.mMoves=[];
	this.mBoard.mWho = this.mWho;
	this.listeners = [];

}

JocGame.prototype.AddListener = function(listener) {
	this.listeners.push(listener);
}

JocGame.prototype.RemoveListener = function(listener) {
	for(var i=this.listeners.length-1;i>=0;i--)
		if(this.listeners[i]==listener)
			this.listeners.splice(i,1);
}

JocGame.prototype.DispatchMessage = function(message) {
	var self = this;
	this.listeners.forEach(function(listener) {
		listener.call(self,message);
	});
}

JocGame.prototype.HumanMove = function(move) {
	this.DispatchMessage({
		type: "human-move",
		move: move
	});
}

JocGame.prototype.MachineMove = function(result) {
	this.DispatchMessage({
		type: "machine-move",
		result: result
	});
}

JocGame.prototype.MachineProgress = function(progress) {
	this.DispatchMessage({
		type: "machine-progress",
		progress: progress
	});
}

JocGame.prototype.PlayMove = function(move) {
	var self = this;
	var promise = new Promise(function(resolve,reject) {
		self.mOldBoard=new (self.GetBoardClass())(self);
		self.mOldBoard.CopyFrom(self.mBoard);
		self.ApplyMove(move);
		var moveShown = self.mBoard.PlayedMove(self,move);
		if(moveShown)
			resolve();
		else
			self.MoveShown = function() {
				delete self.MoveShown;
				resolve();
			}
	});
	return promise;
}

JocGame.prototype.InvertWho = function() {
	var who = this.GetWho();
	this.SetWho(-who);
}

JocGame.prototype.AttachElement = function (element, options) {
	options = options || {};
	var game = this;
	this.widget = element;
	var promise = new Promise(function(resolve, reject) {
		if (game.gamePreAttachProto)
			reject(new Error("Game already attached"));
		else {
			var systemJSConfig = {
				meta: {
					"jocly-xdview.js": {
						globals: {
							jQuery: "jquery.js",
							THREE: "three.js"
						}
					}
				}
			}
			systemJSConfig.meta["games/" + game.module + "/" + game.name + "-view.js"] = {
				globals: {
					xdview: "jocly-xdview.js",
					jQuery: "jquery.js",
					THREE: "three.js"
				}
			}
		};
		SystemJS.config(systemJSConfig);

		Promise.all([
			SystemJS.import("jocly-xdview.js"),
			SystemJS.import("games/" + game.module + "/" + game.name + "-view.js")
		]).then(function(args) {
			var xdview = args[0], view = args[1];
			game.gamePreAttachProto = Object.getPrototypeOf(game);
			var gameProto = Object.assign({}, game.gamePreAttachProto, xdview.view.Game, view.view.Game);
			Object.setPrototypeOf(game, gameProto);

			var Board = game.mBoardClass;
			game.boardPreAttachProto = Board.prototype;
			Object.assign(Board.prototype, game.boardPreAttachProto, xdview.view.Board, view.view.Board);

			var Move = game.mMoveClass;
			game.movePreAttachProto = Move.prototype;
			Object.assign(Move.prototype, game.movePreAttachProto, view.view.Move);

			game.mGeometry = {
				width: game.widget.clientWidth,
				height: game.widget.clientHeight
			}
			game.mWidget = jQuery(game.widget);

			var defaultViewOptions = game.mViewOptions && game.mViewOptions.defaultOptions;
			if(defaultViewOptions) {
			    const optDefs = {
                    "mSkin": "skin",
                    "mNotation": "notation",
                    "mSounds": "sounds",
                    "mShowMoves": "moves",
                    "mAutoComplete": "autocomplete"
                }
				for(var opt in optDefs)
					if(typeof defaultViewOptions[optDefs[opt]]!="undefined")
						game[opt] = defaultViewOptions[optDefs[opt]];
			}

			game.UpdateSounds();
			resolve();
		}, function(e) {
			reject(e);
		});
	});
	return promise;
}

JocGame.prototype.DetachElement = function () {
	var game = this;
	this.widget = element;
	var promise = new Promise(function(resolve, reject) {
		if (!game.gamePreAttachProto)
			reject(new Error("Game not attached"));
		else {
			// TODO
			resolve();
		}
	});
	return promise;
}

JocGame.prototype.GetBoardClass = function() {
	return this.mBoardClass;
}

JocGame.prototype.GetMoveClass = function() {
	return this.mMoveClass;
}

JocGame.prototype.CreateMove = function(args) {
	return new this.mMoveClass(args);
}

JocGame.prototype.CloneBoard = function(board) {
	var newBoard=new (this.GetBoardClass())(this);
	newBoard.CopyFrom(board);
	return newBoard;
}

JocGame.prototype.InitView = function() {
	console.log("Abstract InitView called");
}

JocGame.prototype.GameInitView = function() {
	if(this.mGeometry.width>0 && this.mGeometry.height>0) {
		this.InitView();
		this.mViewInited=true;
	}
}

JocGame.prototype.DestroyView = function() {
	if(this.mWidget)
		this.mWidget.empty();
}

JocGame.prototype.GameDestroyView = function() {
	if(this.mViewInited) {
		this.DestroyView();
		this.mViewInited=false;
	}
}

JocGame.prototype.CanPlaySound = function(tag) {
	return true;
}

JocGame.prototype.UpdateSounds = function() {
	var joclySounds = $("#jocly-sounds");
	if(joclySounds.length==0)
		joclySounds = $("<div/>").attr("id","jocly-sounds").css({display:"none"}).appendTo($("body"));
	function AddSound(tag, path, fname) {
		var audio = $("<audio/>").attr("id", "jocly-sound-" + tag).attr("preload","auto");
                $("<source/>").attr("src", path + "/res/sounds/" + fname + ".ogg").attr("type", "audio/ogg").appendTo(audio);
		$("<source/>").attr("src", path + "/res/sounds/" + fname + ".mp3").attr("type", "audio/mp3").appendTo(audio);
		audio.appendTo(joclySounds);
	}
	joclySounds.empty();
	var defaultSounds = {
		useraction: "bells1",
		usermove: "bells1",
		win: "winblues",
		loss: "lose",
		end: "draw",
	}
	for (var i in defaultSounds)
		AddSound(i, this.config.baseURL, defaultSounds[i]);
	if (this.config.view.sounds) {
		for (var i in this.config.view.sounds) {
			$("#jocly-sound-" + i).remove();
			if (this.config.view.sounds[i])
				if (this.config.view.sounds[i])
					AddSound(i, this.config.baseURL+"games/"+this.config.model.module, this.config.view.sounds[i]);
		}
	}
}

JocGame.prototype.PlaySound = function(tag) {
	if(!this.CanPlaySound(tag))
		return;
	var audio=document.getElementById("jocly-sound-"+tag);
	if(audio && this.mSounds) {
		if(typeof this.mNeedPhonegapMedia=="undefined") {
			this.mNeedPhonegapMedia=false;
			this.mNeedPhonegapMedia = window && window.cordova && (typeof Media != "undefined");
		}
		
		if(this.mNeedPhonegapMedia) {
			if(typeof this.mPhonegapMediaLib=="undefined")
				this.mPhonegapMediaLib={};
			if(typeof this.mPhonegapMediaLib[tag]=="undefined") {
				var node=audio.firstChild;
				while(node) {
					if(/source/i.test(node.nodeName) && node.getAttribute("type")=="audio/mp3")
						break;
					node=node.nextSibling;
				}
				if(node) {
					var src=node.getAttribute("src");
					
					var m=/^([^#\?]*)\/[^#\?]+/.exec(window.location.pathname);
					if(m)
						src=src.replace(/^\./,m[1]);
					src=src.replace(/%20/g," ");
					this.mPhonegapMediaLib[tag]=new Media(src, function() {
							//console.info("PlaySound: Media played "+src);
						},function(error) {
							console.warn("Jocly PlaySound: Media did not play "+error.code);
						},function(status) {
							//console.info("PlaySound: mediaStatus "+status);
						});
				} else
					this.mPhonegapMediaLib[tag]=null;
			}
			if(this.mPhonegapMediaLib[tag]) {
				this.mPhonegapMediaLib[tag].play();
			}
		} else
			audio.cloneNode(true).play();
	}
}

JocGame.prototype.InitGame = function() {
}

JocGame.prototype.GameInitGame = function() {
	if(this.mGameInited==false) {
		this.mVisitedBoards={};
		if(arguments.length>0 && arguments[0])
			this.mInitial=arguments[0];
		else
			this.mInitial=null;
		this.InitGame();
		this.mGameInited=true;
	}
}

JocGame.prototype.DestroyGame = function() {
}

JocGame.prototype.GameDestroyGame = function() {
	if(this.mGameInited) {
		this.DestroyGame();
		this.mGameInited=false;
	}
	if(this.aiWorker) {
		try {
			this.aiWorker.terminate();
			delete this.aiWorker;
		} catch(e) {
			console.warn("Cannot terminate worker",e);
		}
	}
}

JocGame.prototype.DisplayBoard = function() {
	if(this.mBoard.Display)
		this.mBoard.Display(this);
}

JocGame.prototype.SetWho = function(aWho) {
	this.mWho = aWho;
	this.mBoard.mWho = aWho;
}

JocGame.prototype.GetWho = function() {
	return this.mWho;
}

JocGame.prototype.HumanTurn = function() {
	if(!this.mBoard.mMoves || this.mBoard.mMoves.length==0) {
		this.mCurrentLevel=-1; 
		this.mBoard.GenerateMoves(this);
	}
	this.mBoard.HumanTurn(this);
}

JocGame.prototype.HumanTurnEnd = function() {
	this.mBoard.HumanTurnEnd(this);
}

JocGame.prototype.PlayedMove = function(aMove, aOldBoard) {
	this.mOldBoard=aOldBoard;
	return this.mBoard.PlayedMove(this,aMove);
}

JocGame.prototype.ShowEnd = function() {
	return this.mBoard.ShowEnd(this);
}

JocGame.prototype.EvaluateBoard = function() {
	this.mBoard.mFinished=false;
	this.mBoard.mMoves=[];
	this.mCurrentLevel=-1;
	this.mBoard.GenerateMoves(this);
	if(this.mBoard.mFinished==false)
		this.mBoard.Evaluate(this,true,true);
	//JocLog("EvaluatedBoard "+JSON.stringify(this.mBoard));
}

JocGame.prototype.GetFinished = function() {
	this.EvaluateBoard();
	if(this.mBoard.mFinished)
		return this.mBoard.mWinner;
	else
		return 0;
	this.SetWho(-this.mWho);
	var moves=this.mBoard.mMoves;
	this.EvaluateBoard();
	this.mBoard.mMoves=moves;
	this.SetWho(-this.mWho);
	if(this.mBoard.mFinished)
		return this.mBoard.mWinner;
	else
		return 0;
}

JocGame.prototype.IsValidMove = function(args) {
	var move = new (this.GetMoveClass())(args);
	return this.mBoard.IsValidMove(this,move);
}

JocGame.prototype.AddVisit = function(board,sign) {
	if(board)
		sign=board.GetSignature();
	var visits=this.mVisitedBoards[sign];
	if(visits===undefined)
		this.mVisitedBoards[sign]=1;
	else
		this.mVisitedBoards[sign]++;
}

JocGame.prototype.RemoveVisit = function(board,sign) {
	if(board)
		sign=board.GetSignature();
	var visits=this.mVisitedBoards[sign];
	if(visits!==undefined) {
		if(visits>1)
			this.mVisitedBoards[sign]--;
		else
			delete this.mVisitedBoards[sign];
	}
}

var engdbg_loops, engdbg_time, engdbg_t0;

JocGame.prototype.StartMachine = function(aOptions) {
	engdbg_loops=0;
	engdbg_time=0;
	engdbg_t0=Date.now();
	
	this.mDoneCallback=aOptions.Done || this.MachineMove;
	this.mProgressCallback=aOptions.Progress || this.MachineProgress;
	if(typeof(aOptions.level)!="undefined")
		this.mTopLevel=aOptions.level;
	if(typeof(aOptions.maxDepth)!="undefined")
		this.mTopLevel=aOptions.maxDepth;
	this.mStartTime = new Date().getTime();
	this.mExploredCount = 0;
	this.mPickedMoveIndex = 0;
	this.mBestMoves = [];
	this.mContexts = [];
	this.mDuration = 0;
	this.mAborted = false;
	this.mRandomSeed = 0;
	if(aOptions.randomSeed && !isNaN(parseInt(aOptions.randomSeed)))
		this.mRandomSeed = parseInt(aOptions.randomSeed);
	if(typeof this.mBoard.StaticGenerateMoves =="function") {
		var moves=this.mBoard.StaticGenerateMoves(this);
		if(moves && moves.length>0) {
			this.mBestMoves=moves;
			JocUtil.schedule(this, "Done", {});
			return;
		}
	}
	
	if(this.mOptions.levelOptions) {
		this.mOptions.levelOptionsSaved=JSON.parse(JSON.stringify(this.mOptions.levelOptions));
		if(aOptions.level)
			Object.assign(this.mOptions.levelOptions,aOptions.level);
	}
	
	var aiThread = aOptions.threaded && typeof window=="object" && window.Worker;
	if(aOptions.level && aOptions.level.ai=="uct" && JoclyUCT) {
		if(aiThread)
			this.StartThreadedMachine(aOptions,"uct");
		else
			JoclyUCT.startMachine(this,aOptions);
	}
	else { // default is legacy alpha-beta ai
		if(aiThread)
			this.StartThreadedMachine(aOptions,"alpha-beta");
		else {
			this.mSavedVisitedBoards={}
			for(var s in this.mVisitedBoards)
				this.mSavedVisitedBoards[s]=this.mVisitedBoards[s];
			this.Engine(this.mBoard, this.mTopLevel, false, 0, aOptions.potential); // start algo
			this.Run();
		}
	}
}

JocGame.prototype.StartThreadedMachine = function(aOptions,algo) {
	var $this = this;
	delete aOptions.Done;
	delete aOptions.Progress;
	var t0 = Date.now();
	if(!this.aiWorker) {
		this.aiWorker = new Worker(this.config.baseURL+'jocly.aiworker.js');
		this.aiWorker.postMessage({
			type: "Init",
			baseURL: this.config.baseURL,
			//modelURL: this.config.baseURL+"games/"+this.config.model.module+"/"+this.name+"-model.js",
			options: aOptions,
			t0: t0
		});
	}
	this.aiWorker.onmessage = function(e) {
		var message = e.data;
		switch(message.type) {
			case "Progress":
				$this.mProgressCallback(message.percent);
				break;
			case "Done":
				$this.mBestMoves = message.data.moves;
				$this.mPickedMoveIndex = message.data.moveIndex;
				$this.mExploredCount = message.data.explored;
				$this.mDuration = message.data.duration;
				$this.mBoard.evaluation = message.data.evaluation;
				$this.Done();
				break;
		}
	}
	this.aiWorker.postMessage({
		type: "Play",
		playedMoves: this.mPlayedMoves,
		gameOptions: this.mOptions,
		gameName: this.name,
		options: aOptions,
		algo: algo,
		t0: t0
	});
}

JocGame.prototype.StopThreadedMachine = function() {
	if(this.aiWorker) {
		try {
			this.aiWorker.terminate();
			delete this.aiWorker;
		} catch(e) {
			console.warn("Cannot terminate worker",e);
		}
	}
}

JocGame.prototype.ScheduleStep = function() {
	this.mNextSchedule = this.ExecuteStep;
}

JocGame.prototype.Random = function(roof) {
	var value;
	if(this.mRandomSeed)
		value = this.mRandomSeed % roof; 
	else
		value = Math.floor(Math.random()*roof);
	return value;
}

JocGame.prototype.ArrayShuffle = function(arr) {
	var i = arr.length;
	if (i<=0) return;
	while (--i) {
		var j;
		if(this.mRandomSeed)
			j=this.mRandomSeed%(i+1);
		else
			j=Math.floor(Math.random()*(i+1));
		var tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}

JocGame.prototype.Done = function() {
	this.mDuration = new Date().getTime() - this.mStartTime;
	if(this.mOptions.levelOptionsSaved) {
		this.mOptions.levelOptions=this.mOptions.levelOptionsSaved;
		this.mOptions.levelOptionsSaved=null;
	}
	if(this.mSavedVisitedBoards)
		this.mVisitedBoards=this.mSavedVisitedBoards;
	if (this.mDoneCallback) {
		this.mPickedMoveIndex = this.Random(this.mBestMoves.length);
		try {
			if(this.mProgressCallback) {
				this.mProgressCallback(100);
			}
			this.mDoneCallback( {
				moves : this.mBestMoves,
				move : this.mBestMoves[this.mPickedMoveIndex],
				moveIndex : this.mPickedMoveIndex,
				explored : this.mExploredCount,
				duration : this.mDuration,
				evaluation : this.mBoard.mEvaluation
			});
		} catch (e) {
			JocLog("!!! Done:" + e,e.stack?e.stack:"");
		}
	}
}

JocGame.prototype.Run = function() {
	var t0=Date.now();
	try {
		var tNow = new Date().getTime();
		while (this.mNextSchedule && new Date().getTime()-tNow<20 && this.mAborted==false) {
			var fnt = this.mNextSchedule;
			this.mNextSchedule = null;
			fnt.call(this);
		}
		if(this.mAborted) {
			this.mAbortCallback();
		} else if (this.mNextSchedule) {
			JocUtil.schedule(this, "Run", {});
		}
	} catch(e) { 
		JocLog("JocGame.Run "+e+"\n"+e.stack);
	}
	var t1=Date.now();
	engdbg_loops++;
	engdbg_time+=t1-t0;
}

JocGame.prototype.Abort = function(aAbortCallback) {
	var $this=this;
	this.mAbortCallback=function() {
		if($this.mOptions.levelOptionsSaved) {
			$this.mOptions.levelOptions=$this.mOptions.levelOptionsSaved;
			$this.mOptions.levelOptionsSaved=null;
		}
		if($this.mSavedVisitedBoards) {
			$this.mVisitedBoards=$this.mSavedVisitedBoards;
			$this.mSavedVisitedBoards=null;
		}
		aAbortCallback();
	}
	this.mAborted=true;
}

JocGame.prototype.Engine = function(aBoard, aLevel, aBAlpha, aAlpha, aPotential) {
	var context = {
		mBoard : aBoard,
		mLevel : aLevel,
		mBAlpha : aBAlpha,
		mAlpha : aAlpha,
		mBestEvaluation : 0,
		mMoveIndex : 0,
		mNextBoard : null,
		mNextBoards : null
	}
	this.mContexts.push(context);

	context.mBoard.mFinished = false;
	context.mBoard.mWinner = JocGame.DRAW;
	this.mCurrentLevel=aLevel; 
	if(context.mBoard.mMoves.length==0)
		context.mBoard.GenerateMoves(this);

	//JocLog("Level "+aLevel+" "+context.mBoard.mMoves.length+" moves");
	if (context.mBoard.mMoves.length == 0 && context.mBoard.mFinished == false) {
		context.mBoard.Evaluate(this,true,false);
		if(context.mBoard.mFinished == false) {
			JocLog("!!! No move possible while not finished - player",this.mWho,"board",context.mBoard);
			context.mBoard.mFinished=true;
		}
	}
		
	//JocLog("No possible move level "+aLevel+" from "+JSON.stringify(context.mBoard));
	if(context.mBoard.mFinished) {
		switch (context.mBoard.mWinner) {
		case JocGame.PLAYER_A:
			context.mBoard.mEvaluation = JocGame.MAX_VALUE - (this.mTopLevel - context.mLevel);
			break;
		case JocGame.PLAYER_B:
			context.mBoard.mEvaluation = -JocGame.MAX_VALUE + (this.mTopLevel - context.mLevel);
			break;
		}
		context.mBestEvaluation = context.mBoard.mEvaluation;
		this.ExecuteStep2();
		return;
	}

	context.mExploCtrl={
		exploFrom: this.mExploredCount,
		exploTo: this.mExploredCount+aPotential,
	}
	
	if(context.mBoard.QuickEvaluate) {
		var boardsMoves=[];
		for(var i in context.mBoard.mMoves) {
			var board=context.mBoard.MakeAndApply(this,i);
			var quickEval=board.QuickEvaluate(this);
			boardsMoves.push({
				move: context.mBoard.mMoves[i],
				board: board,
				evaluation: quickEval
			});
		}
		function MoveSort(bm1,bm2) {
			return (bm2.evaluation-bm1.evaluation)*context.mBoard.mWho;
		}
		boardsMoves.sort(MoveSort);
		context.mBoard.mMoves=[];
		context.mNextBoards=[];
		if(typeof this.mOptions.capMoves != "undefined")
			boardsMoves=boardsMoves.slice(0,this.mOptions.capMoves);
		for(var i in boardsMoves) {
			context.mBoard.mMoves.push(boardsMoves[i].move);
			context.mNextBoards.push(boardsMoves[i].board);
		}
	}
	this.ExecuteStep();
}

JocGame.prototype.ExecuteStep = function() {
	this.mExploredCount++;
	// JocLog("# context: "+this.mContexts.length);
	var context = this.mContexts[this.mContexts.length - 1];
	//JocLog("ExecuteStep level "+context.mLevel+" index "+context.mMoveIndex+"/"+context.mBoard.mMoves.length);
	if(context.mNextBoards) {
		context.mNextBoard = context.mNextBoards[context.mMoveIndex];
	} else {
		context.mNextBoard = context.mBoard.MakeAndApply(this,context.mMoveIndex);
	}

	if(this.mProgressCallback) {
		var percent=null;
		if(context.mLevel==this.mTopLevel)
			percent=Math.floor((context.mMoveIndex*100)/context.mBoard.mMoves.length);
		else if(context.mLevel==this.mTopLevel-1) {
			var topContext=this.mContexts[0];
			var topStep=1/topContext.mBoard.mMoves.length;
			percent=Math.floor(100*(topContext.mMoveIndex*topStep+(context.mMoveIndex*topStep/context.mBoard.mMoves.length)));
		}
		if(percent!=null) 
			try {
				this.mProgressCallback(percent);
			} catch(e) {}
	}

	var nextBoard = context.mNextBoard;
	nextBoard.mFinished = false;
	nextBoard.mWinner = 0;
	nextBoard.Evaluate(this,context.mLevel==0,false,this);
	
	if(context.mLevel<0) // random mode
		nextBoard.mEvaluation=0;
	
	// JocLog("Eval2 "+nextBoard.mFinished+"/"+nextBoard.mWinner+"/"+nextBoard.mEvaluation);
	if (nextBoard.mFinished) {
		switch (nextBoard.mWinner) {
		case JocGame.PLAYER_A:
			nextBoard.mEvaluation = JocGame.MAX_VALUE - (this.mTopLevel - context.mLevel);
			break;
		case JocGame.PLAYER_B:
			nextBoard.mEvaluation = -JocGame.MAX_VALUE + (this.mTopLevel - context.mLevel);
			break;
		case JocGame.DRAW:
			nextBoard.mEvaluation = 0;
			break;
		}
	} else if(context.mLevel==this.mTopLevel && context.mBoard.mMoves.length==1) {
		// one possible move at top level: no need to recurse
	} else if (context.mLevel > 0) {
		var potential=(context.mExploCtrl.exploTo-this.mExploredCount)/context.mBoard.mMoves.length;
		//JocLog("ExecuteStep",potential,context.mLevel,context.mExploCtrl);
		if(potential>=1) { 
			nextBoard.mWho = -nextBoard.mWho; // player changes
			this.Engine(nextBoard, context.mLevel - 1, (context.mMoveIndex != 0),
					context.mBestEvaluation,potential); // recurse algo
			return;
		}
	}
	this.ExecuteStep2();
}

JocGame.prototype.ExecuteStep2 = function() {
	var context = this.mContexts[this.mContexts.length - 1];
	//JocLog("ExecuteStep2 level "+context.mLevel+" index "+context.mMoveIndex+" "+JSON.stringify(context.mBoard.board));
	if(context.mBoard.mMoves.length>0) {
		if (context.mMoveIndex == 0) { // first evaluated move
			context.mBestEvaluation = context.mNextBoard.mEvaluation; // then it's the best one so far
			if (context.mLevel == this.mTopLevel) // if top level
				this.SetBest(context.mBoard.mMoves[0], context.mBoard); // store move
		} else { // another move evaluated
			if (context.mNextBoard.mWho > 0) { // B plays
				if (context.mNextBoard.mEvaluation > context.mBestEvaluation) { // best move ?
					context.mBestEvaluation = context.mNextBoard.mEvaluation; // remember it
					if (context.mLevel == this.mTopLevel) // if top level
						this.SetBest(context.mBoard.mMoves[context.mMoveIndex],
								context.mBoard); // then store
				} else if (context.mLevel == this.mTopLevel
						&& context.mNextBoard.mEvaluation == context.mBestEvaluation) { // top level and
																	// another best
																	// move
					this.AddBest(context.mBoard.mMoves[context.mMoveIndex],
							context.mBoard); // add to best moves
				}
			} else { // A plays
				if (context.mNextBoard.mEvaluation < context.mBestEvaluation) { // best move
					context.mBestEvaluation = context.mNextBoard.mEvaluation; // keep it
					if (context.mLevel == this.mTopLevel)
						this.SetBest(context.mBoard.mMoves[context.mMoveIndex],
								context.mBoard);
				} else if (context.mLevel == this.mTopLevel
						&& context.mNextBoard.mEvaluation == context.mBestEvaluation)
					this.AddBest(context.mBoard.mMoves[context.mMoveIndex],
							context.mBoard);
			}
		}
	}
	context.mBoard.mEvaluation = context.mBestEvaluation; // assign best eval
	if (context.mBAlpha) { // alpha-beta pruning
		if ((context.mBoard.mWho == JocGame.PLAYER_A && context.mBestEvaluation > context.mAlpha)
				|| (context.mBoard.mWho == JocGame.PLAYER_B && context.mBestEvaluation < context.mAlpha)) {
			context.mMoveIndex = context.mBoard.mMoves.length - 1; 
			//JocLog("Alpha-beta pruned level");
			// ensure no more looking for other moves at this level
		}
	}

	context.mMoveIndex++;
	if (context.mMoveIndex < context.mBoard.mMoves.length) {
		this.ScheduleStep();
	} else {
		//JocLog("BestEval level "+context.mLevel+": "+context.mBestEvaluation+" "+context.mMoveIndex+"/"+context.mBoard.mMoves.length);
		this.mContexts.pop();
		if (this.mContexts.length > 0) {
			var context = this.mContexts[this.mContexts.length - 1];
			context.mNextBoard.mWho = -context.mNextBoard.mWho;
			this.ExecuteStep2();
		} else {
			delete context.mBoard.mMoves;
			//JocLog("Best eval "+context.mBestEvaluation);
			this.Done();
		}
	}
}

JocGame.prototype.SetBest = function(aMove, aBoard) {
	var move = new (this.GetMoveClass())({});
	move.CopyFrom(aMove);
	this.mBestMoves = [ move ];
}

JocGame.prototype.AddBest = function(aMove, aBoard) {
	var move = new (this.GetMoveClass())({});
	move.CopyFrom(aMove);
	this.mBestMoves.push(move);
}

JocGame.prototype.GetRepeatOccurence = function(board) {
	if(!this.mOptions.preventRepeat)
		return -1;
	var repOcc=this.mVisitedBoards[board.GetSignature()];
	return repOcc;
}

JocGame.prototype.HandleRepeat = function(board) {
	if(this.mOptions.preventRepeat) {
		var sign=board.GetSignature(true);
		if(this.mVisitedBoards[sign]===undefined)
			this.mVisitedBoards[sign]=1;
		else
			this.mVisitedBoards[sign]++;
	}
}

JocGame.prototype.UnhandleRepeat = function(board) {
	if(this.mOptions.preventRepeat) {
		var sign=board.GetSignature(true);
		if(this.mVisitedBoards[sign]==1)
			delete this.mVisitedBoards[sign];
		else if(this.mVisitedBoards[sign]>1)
			this.mVisitedBoards[sign]--;
	}
}

JocGame.prototype.ApplyMove = function(aMove) {
	var move = new (this.GetMoveClass())({});
	move.CopyFrom(aMove);
	this.mPlayedMoves.push(move);
	if(this.mFullPlayedMoves.length<this.mPlayedMoves.length)
		this.mFullPlayedMoves.push(move);
	else if(!move.Equals(this.mFullPlayedMoves[this.mPlayedMoves.length-1])) {
		this.mFullPlayedMoves=this.mFullPlayedMoves.slice(0,this.mPlayedMoves.length-1);
		this.mFullPlayedMoves.push(move);
	}
	this.mBoard.ApplyMove(this,aMove);
	this.mBoard.mMoves=[];
	this.HandleRepeat(this.mBoard);
}

JocGame.prototype.BackTo = function(aIndex,moves) {
	if(!moves)
		moves=this.mFullPlayedMoves;
	this.mWho = JocGame.PLAYER_A;
	this.mBoard = new (this.GetBoardClass())(this);
	if(this.mBoard.InitialPosition)
		this.mBoard.InitialPosition(this);
	if(this.mInitial && this.mInitial.turn)
		this.mWho = this.mInitial.turn;
	this.mBoard.mWho = this.mWho;
	this.mBestMoves = [];
	this.mVisitedBoards={};
	this.mPlayedMoves = [];
	for(var i=0;i<aIndex;i++) {
		this.mBoard.ApplyMove(this,moves[i]);
		this.HandleRepeat(this.mBoard);
		this.mBoard.mWho=-this.mBoard.mWho;
		this.mPlayedMoves.push(moves[i]);
	}
	this.mWho=this.mBoard.mWho;
}

JocGame.prototype.Load = function(gameData) {
	this.mWho = JocGame.PLAYER_A;
	this.mBoard = new (this.GetBoardClass())(this);
	if(this.mBoard.InitialPosition)
		this.mBoard.InitialPosition(this);
	this.mBoard.mWho = this.mWho;
	var board = this.GetBoardClass();
	if(gameData.initialBoard)
		board.CopyFrom(gameData.initialBoard);
	this.mBestMoves = [];
	this.mVisitedBoards={};
	var moves=gameData.playedMoves;
	this.mPlayedMoves = [];
	this.mFullPlayedMoves = [];
	for(var i in moves) {
		var move=new (this.GetMoveClass())(moves[i]);
		if(!this.IsValidMove(move))
			throw "invalid-move";		
		this.mBoard.ApplyMove(this,move);
		this.HandleRepeat(this.mBoard);
		this.mBoard.mWho=-this.mBoard.mWho;
		this.mPlayedMoves.push(move);
		this.mFullPlayedMoves.push(move);
		this.mBoard.mMoves=[];
	}
	this.mWho=this.mBoard.mWho;
	if(this.mBoard.mFinished==false)
		this.mBoard.Evaluate(this,true,true);
}

JocGame.prototype.CloseView = function() {
}

JocMove.prototype = {}

JocMove.prototype.CopyFrom = function(aMove) {
	var fields=JSON.parse(JSON.stringify(aMove));
	for(var f in fields) {
		this[f]=fields[f];
	}
}

JocMove.prototype.Equals = function(move) {
	return JSON.stringify(this)==JSON.stringify(move);
}

JocMove.prototype.ToString = function() {
	return JSON.stringify(this);
}

JocMove.prototype.Strip = function() {
	return this;
}

JocBoard.prototype = {}

JocBoard.prototype.Init = function(aGame) {
}

JocBoard.prototype.InitBoard = function(aGame) {
	this.mDepth = 0; // no depth calc
	this.mMoves = []; // move storage
	this.mEvaluation = 0; // not evaluated yet
	this.mFinished = false;
	this.mWinner = 0;
	this.Init(aGame);
}

JocBoard.prototype.CopyFrom = function(aBoard) {
	var signature=aBoard.mSignature;
	delete(aBoard.mSignature);
	var fields=JSON.parse(JSON.stringify(aBoard));
	for(var f in fields) {
		this[f]=fields[f];
	}
	aBoard.mSignature=signature;
}

JocBoard.prototype.GetSignature = function() {
	if(arguments[0] || !this.mSignature) {
		var moves=this.mMoves;
		delete(this.mMoves);
		delete(this.mSignature);
		this.mSignature=JocUtil.md5(JSON.stringify(this));
		//JocLog("signature",this.mSignature,this);
		this.mMoves=moves;
	}
	return this.mSignature;
}

JocBoard.prototype.ApplyMove = function(aGame,aMove) {
	JocLog("Method JocBoard:ApplyMove() must be overloaded");
	// must be overloaded
}

JocBoard.prototype.GenerateMoves = function(aGame) {
	JocLog("Method JocBoard:GenerateMoves() must be overloaded");
	// must be overloaded
}

JocBoard.prototype.Evaluate = function(aGame,aFinishOnly,aTopLevel) {
	JocLog("Method JocBoard:Evaluate() must be overloaded");
	this.mEvaluation = 0; // must be overloaded
}

JocBoard.prototype.HumanTurn = function() {
}

JocBoard.prototype.HumanTurnEnd = function() {
}

JocBoard.prototype.PlayedMove = function() {
}

JocBoard.prototype.ShowEnd = function() {
}

JocBoard.prototype.MakeAndApply = function(aGame,aIndex) {
	var board = new (aGame.GetBoardClass())(aGame);	
	board.CopyFrom(this);
	board.mWho = this.mWho;
	board.mBoardClass = this.mBoardClass;
	board.ApplyMove(aGame,this.mMoves[aIndex]); // apply move
	board.mMoves=[];
	return board;
}

JocBoard.prototype.IsValidMove = function(aGame,move) {
	if(typeof move.Equals != "function")
		move=aGame.CreateMove(move);
	if(!this.mMoves || this.mMoves.length==0) {
		this.mCurrentLevel=-1;
		this.GenerateMoves(aGame);
	}
	for(var i in this.mMoves) {
		if(move.Equals(this.mMoves[i]))
			return true;
	}
	console.error("Invalid move "+JSON.stringify(move)+" in "+JSON.stringify(this.mMoves));
	return false;
}

JocBoard.prototype.PushMove = function(aGame,args) {
	this.mMoves.push(aGame.CreateMove(args));
}


JocBoard.prototype.GenerateMoveObjects = function(aGame) {
	var moves=[];
	this.mMoves=[];
	this.GenerateMoves(aGame);
	for(var i=0;i<this.mMoves.length;i++)
		moves.push(aGame.CreateMove(this.mMoves[i]));
	this.mMoves=moves;
}

JocBoard.prototype.ExportBoardState = function(aGame) {
	return JSON.stringify(this);
}

JocGame.prototype.GetBestMatchingMove = function(moveStr,candidateMoves) {
	var prettyMoves=[];
	var $this=this;
	candidateMoves.forEach(function(m) {
		if(typeof m.ToString=="function")
			prettyMoves.push(m.ToString());
		else
			prettyMoves.push($this.CreateMove(m).ToString());
	});
	var bestDist=Infinity;
	var bestMatches=[];
	candidateMoves.forEach(function(candidate,index) {
		var dist=JocGame.Levenshtein(moveStr,prettyMoves[index])/(Math.max(prettyMoves[index].length,moveStr.length)+1);
		if(dist==bestDist)
			bestMatches.push(index);
		else if(dist<bestDist) {
			bestMatches=[index];
			bestDist=dist;
		}
	});
	if(bestMatches.length==1)
		return candidateMoves[bestMatches[0]];

	var candidateIndexes=bestMatches;
	var matches=[];
	candidateIndexes.forEach(function(index) {
		var pretty=prettyMoves[index];
		if(moveStr.indexOf(pretty)>=0 || pretty.indexOf(moveStr)>=0)
			matches.push(index);
	});
	if(matches.length==1)
		return candidateMoves[matches[0]];

	bestDist=Infinity;
	bestMatches=[];
	candidateIndexes.forEach(function(index) {
		var dist=0;
		var str1=moveStr.replace(/[A-Z]/g,'');
		var str2=prettyMoves[index].replace(/[A-Z]/g,'');
		dist+=JocGame.Levenshtein(str1,str2)/(Math.max(str1.length,str2.length)+1);
		dist+=(str1.indexOf(str2)>=0 || str2.indexOf(str1)>=0)?0:1;
		str1=moveStr.replace(/[a-z]/g,'');
		str2=prettyMoves[index].replace(/[a-z]/g,'');
		dist+=JocGame.Levenshtein(str1,str2).distance/(Math.max(str1.length,str2.length)+1);
		dist+=(str1.indexOf(str2)>=0 || str2.indexOf(str1)>=0)?0:1;
		if(dist==bestDist)
			bestMatches.push(index);
		else if(dist<bestDist) {
			bestMatches=[index];
			bestDist=dist;
		}
	});
	if(bestMatches.length==1)
		return candidateMoves[bestMatches[0]];
	return null;
}

JocBoard.prototype.PickMoveFromDatabase = function(aGame,database) {
	if(!this.mMoves || this.mMoves.length==0) {
		var moves=[];
		this.mMoves=[];
		this.GenerateMoves(aGame);
		for(var i=0;i<this.mMoves.length;i++)
			moves.push(aGame.CreateMove(this.mMoves[i]));
		this.mMoves=moves;
	}
	if(this.mMoves.length==0)
		return null;
	var key=""+this.mWho+"#"+this.GetSignature();
	var dbMoves=database[key];
	if(!dbMoves)
		return null;
	var totalEval=0;
	for(var i=0;i<dbMoves.length;i++)
		totalEval+=dbMoves[i].e;
	var rnd=Math.random()*totalEval;
	var current=0;
	for(var i=0;i<dbMoves.length;i++) {
		var dbMove=dbMoves[i];
		current+=dbMove.e;
		if(current>rnd) {
			var pickedMove=aGame.GetBestMatchingMove(dbMove.m,this.mMoves);
			if(pickedMove)
				return [pickedMove];
		}
	}
	return null; // never reached
}

JocBoard.prototype.CompactMoveString = function(aGame,aMove) {
	if(typeof aMove.ToString!="function")
		aMove=aGame.CreateMove(aMove);
	return aMove.ToString();
}

/*-- Zobrist implementation --*/

JocGame.Zobrist=function(params) {
	var mt=new MersenneTwister(12345);
	var paramNames=[];
	for(var f in params)
		paramNames.push(f);
	paramNames.sort(); // ensures we walk through parameters always in same order so generated pseudo random seeds are always the same
	this.seed={};
	for(var pi=0;pi<paramNames.length;pi++) {
		var f=paramNames[pi];
		var param=params[f];
		var seed={
			values: {},
			seeds:[],
		}
		var vIndex=0;
		for(var vi=0;vi<param.values.length;vi++)
			seed.values[param.values[vi]]=vIndex++;
		switch(param.type) {
		case "array":
			for(var j=0;j<param.size;j++) {
				var seeds0=[];
				for(var i=0;i<vIndex;i++)
					seeds0.push(mt.genrand_int32());
				seed.seeds.push(seeds0);
			}
			seed.type="array";
			break;
		default:
			for(var i=0;i<vIndex;i++)
				seed.seeds.push(mt.genrand_int32());
			seed.type="simple";
		}
		this.seed[f]=seed;
	}
	//console.log("Created zobrist",this);
}

JocGame.Zobrist.prototype={
	update: function(zobrist,name) {
		//var zobrist0=zobrist;
		var seed=this.seed[name];
		if(seed===undefined) {
			console.error("Unknown Zobrist parameter",name);
			return 0;
		}
		var vIndex=seed.values[arguments[2]];
		if(vIndex===undefined) {
			console.error("Undeclared Zobrist value",arguments[2],"as param",name);
			return 0;
		}
		switch(seed.type) {
		case "simple":
			zobrist^=seed.seeds[vIndex];
			break;
		case "array":
			var seeds=seed.seeds[arguments[3]];
			if(seeds===undefined) {
				console.error("Undeclared Zobrist array index",arguments[3],"as param",name);
				return 0;				
			}
			zobrist^=seeds[vIndex];
			//console.log("Zobrist",zobrist0,"=>",name,"array[",arguments[2],"] =",arguments[3],"=>",zobrist);
			break;
		}
		return zobrist;
	},
}

/*--- Levenshtein distance implementation ---*/
JocGame.Levenshtein=function(e,f){if(e==f)return 0;var d=e.length,j=f.length;if(0===d)return j;if(0===j)return d;var b=!1;try{b=!"0"[0]}catch(m){b=!0}
b&&(e=e.split(""),f=f.split(""));for(var b=Array(d+1),g=Array(d+1),a=0,h=0,i=0,a=0;a<d+1;a++)b[a]=a;for(var c="",k="",h=1;h<=j;h++){g[0]=h;k=f[h-1];
for(a=0;a<d;a++){var c=e[a],i=c==k?0:1,c=b[a+1]+1,l=g[a]+1,i=b[a]+i;l<c&&(c=l);i<c&&(c=i);g[a+1]=c}a=b;b=g;g=a}return b[d]};

