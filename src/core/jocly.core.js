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

"use strict";

/*
 * Keys to understand this code
 * 
 * This script can be executed under various contexts:
 * A. in the browser within the application context
 * B. in the browser within an iframe controlled by the application
 * C. in the browser as a worker for running the AI
 * D. in node.js
 * 
 * In case A, the Match object can either be:
 * - attached to an element (A1)
 * - not attached (A2)
 *
 * A Match object is only glue. The actual object doing the job is generated
 * from function CreateInternalGame(). This object is constructed by defining
 * a base (from jocly.game.js) overloaded by the model (<game-name>_model.js),
 * and possibly by the view (<game-name>_view.js) if there is a need for a UI
 * (case B only).
 * 
 * In cases A2, B, C and D, the Match object contains 'game', the actual smart object
 * In case A1, it contains property 'iframe' which is an actual iframe running
 * the code as case B. Properties 'game' and 'iframe' should never be set at the 
 * same time.
 * 
 * Match.attachElement() moves from case A2 to A1, creating an iframe running in
 * in case B and passing the responsability of the actual game object to it.
 * Match.detachElement() (A1 to A2) gets the game back from the iframe and destroys 
 * the iframe.
 * 
 * In case B (and only in this case), the Match object has a property 'area'
 * representing the DOM element containing the UI.
 *
 * By convention, Match object method names starts with a lowercase character,
 * the game object with uppercase. Both APIs may have some similarities but
 * are actually different.
 * 
 * Most Match API methods do the following: check whether we are in case A1,
 * if so, the command/reply is passed/answered to/from the iframe running case B.
 * In all other cases, the action is performed locally using the API of the game
 * object.
 * 
 */

(function() {

    var gameClassCache = {};

    function CreateGame(gameName, gameDescr,base, model, config) {
        var Game = function () {
            this.g = {}; // some games assume this member exists
        };
        Object.assign(Game.prototype, base.Game.prototype, model.model.Game);

        var Board = function () { };
        Object.assign(Board.prototype, base.Board.prototype, model.model.Board);
        Game.prototype.mBoardClass = Board;

        var Move = function (args) { this.Init(args); };
        Object.assign(Move.prototype, base.Move.prototype, model.model.Move);
        Game.prototype.mMoveClass = Move;


        Game.prototype.config = config.config;

        if(typeof SystemJS!="undefined") {
            Game.prototype.config.baseURL = SystemJS.getConfig().baseURL;
            Game.prototype.config.view.fullPath = SystemJS.getConfig().baseURL + "games/" + gameDescr.module;
        }
        Game.prototype.module = gameDescr.module;
        Game.prototype.name = gameName;

        var initArgs = {
            game: config.config.model.gameOptions,
            view: config.config.view
        };

        gameClassCache[gameName] = {
            gameClass: Game,
            initArgs: initArgs
        }

        var game = new Game();

        game.Init(initArgs);

        return game;
    }

    function CreateInternalGame(gameName, options) {
        var gameClassData = gameClassCache[gameName];
        if(gameClassData) {
            var promise = new Promise((resolve,reject)=>{
                var game = new gameClassData.gameClass();
                game.Init(gameClassData.initArgs);
                resolve(game);
            });
            return promise;
        }
        if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
            return WorkerCreateGame(gameName, options);
        else if(typeof process!=="undefined" && process.title === "node")
            return NodeCreateGame(gameName,options);
        else
            return BrowserCreateGame(gameName, options);
    }

    function NodeCreateGame(gameName, options) {
        var t0 = Date.now();
        options = options || {};
        var promise = new Promise((resolve, reject) => {

            var games = require("./jocly-allgames.js").games;

            var gameDescr = games[gameName];
            if (!gameDescr)
                return reject(new Error("Game " + gameName + " not found"));

            var base = require("./jocly.game.js");
            var model = require("./games/" + gameDescr.module + "/" + gameName + "-model.js");
            var config = require("./games/" + gameDescr.module + "/" + gameName + "-config.js");

            var game = CreateGame(gameName, gameDescr, base, model, config);

            resolve(game);
        });
        return promise;
    }

    function WorkerCreateGame(gameName, options) {
        var t0 = Date.now();
        options = options || {};
        var promise = new Promise((resolve, reject) => {

            importScripts("jocly-allgames.js");
            var games = exports.games;

            var gameDescr = games[gameName];
            if (!gameDescr)
                return reject(new Error("Game " + gameName + " not found"));

            var originalExports = exports;
            var base = exports = {};
            importScripts("jocly.game.js");
            var model = exports = {};
            importScripts("games/" + gameDescr.module + "/" + gameName + "-model.js");
            var config = exports = {};
            importScripts("games/" + gameDescr.module + "/" + gameName + "-config.js");
            exports = originalExports;

            var game = CreateGame(gameName, gameDescr, base, model, config);

            resolve(game);
        });
        return promise;
    }

    function BrowserCreateGame(gameName, options) {
        options = options || {};
        var promise = new Promise((resolve, reject) => {

            exports.listGames().then((games) => {

                var gameDescr = games[gameName];
                if (!gameDescr)
                    return reject(new Error("Game " + gameName + " not found"));

                var gamePromises = [
                    SystemJS.import("jocly.game.js"),
                    SystemJS.import("games/" + gameDescr.module + "/" + gameName + "-model.js"),
                    SystemJS.import("games/" + gameDescr.module + "/" + gameName + "-config.js")
                ];

                Promise.all(gamePromises).then(([base, model, config]) => {

                    var game = CreateGame(gameName, gameDescr, base, model, config);

                    resolve(game);
                }, (e) => {
                    reject(e);
                });
            }, reject);

        });
        return promise;
    }

    // Check in what context this code is running
    var jsContext = "browser";
    if(typeof process!=="undefined" && process.title === "node")
        jsContext = "node";
    else if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
        jsContext = "worker";


    exports.listGames = function () {

        var promise = new Promise((resolve, reject) => {
            if(typeof SystemJS!="undefined")
                SystemJS.import("jocly-allgames.js").then((m) => {
                    if(typeof SystemJS!="undefined") {
                        var baseURL = SystemJS.getConfig().baseURL;
                        for(var gameName in m.games) {
                            var game = m.games[gameName];
                            game.thumbnail = baseURL + "games/" + game.module + "/" + game.thumbnail;
                        }
                    }
                    resolve(m.games);
                }, (e) => {
                    console.warn("Could not load Jocly games", e);
                    reject(e);
                });
            else
                resolve(require("./jocly-allgames.js").games);
        });
        return promise;
    }

    function CreateMatch(gameName) {
        var promise = new Promise( function(resolve, reject) {
            CreateInternalGame(gameName)
                .then( function(game) {
                    var proxy = new GameProxy(gameName,game);
                    resolve(proxy);
                }, function(error) {
                    reject(error);
                });
        });
        return promise;
    }


    var messageListenerInstalled = false;
    var matches = {};
    var msgIdRef = 0;
    var messageReplies = {};
    var matchIdRef = 0;

    function GameProxy(gameName,game) {
        this.gameName = gameName;
        this.game = game;
        this.iframe = null;
        this.id = ++matchIdRef;
        matches[this.id] = this;
    }

    function MessageListener(event) {
        var message = event.data;
        var match = matches[message.joclyEmbeddedGameId];
        //console.info("proxy receives message",event.data,!!match);
        if(match) {
            var replyId = message.replyId;
            if(replyId) {
                var reply = messageReplies[replyId];
                if(reply) {
                    delete messageReplies[replyId];
                    if(message.message.type=="error") {
                        var error = new Error(message.message.error.message,message.message.error.fileName,message.message.error.lineNumber);
                        reply(error);
                    } else
                        reply(null,message.message);
                }
            } else if(message.message.type=="machine-progress") {
                if(match.machineProgressListener)
                    match.machineProgressListener(message.message.progress);
            }
        }
    }

    function PostMessage(match,message,reply) {
        var wrapper = {
            message: message
        }
        if(reply) {
            var replyId = ++msgIdRef;
            wrapper.replyId = replyId;
            messageReplies[replyId] = reply;
        }
        try {
            match.iframe.contentWindow.postMessage(wrapper,"*");
        } catch(e) {
            console.error("Message",message,"could not be posted:",e);
        }
    }

    GameProxy.prototype.attachElement = function(element, options) {
        if(jsContext=="node")
            return Promise.reject(new Error("attachElement(): not supported in node.js"));
        if(!this.game || this.iframe)
            return Promise.reject(new Error("attachElement(): match is already attached"));
        options = options || {};
        var self = this;
        var promise = new Promise( function(resolve, reject) {
            if(!messageListenerInstalled) {
                messageListenerInstalled = true;
                window.addEventListener("message",MessageListener);
            }

            self.element = element;
            var iframeUrl = "jocly.embed.html";

            var iframe = document.createElement("iframe");
            var attrs = {
                name: "jocly-embedded-"+self.id,
                frameborder: 0,
                src: SystemJS.getConfig().baseURL+iframeUrl,
                width: "100%",
                height: "100%"
            }			
            Object.keys(attrs).forEach((attr)=>{
                iframe.setAttribute(attr,attrs[attr]);
            });
            Object.assign(iframe.style,{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                whiteSpace: "normal",
            });

            var wrapper = document.createElement("div");
            Object.assign(wrapper.style,{
                position: "relative",
                whiteSpace: "nowrap",
                width: "100%",
                height: "100%"
            });
            wrapper.appendChild(iframe);
            element.appendChild(wrapper);

            self.iframe = iframe;

            iframe.onload = ()=>{
                PostMessage(self,{
                    type: "init",
                    id: self.id,
                    gameName: self.gameName,
                    playedMoves: self.game.mPlayedMoves
                },(error,reply)=>{
                    if(error)
                        reject(error);
                    else {
                        self.game = null;
                        resolve();
                    }
                });
            };
        });
        return promise;   
    }

    GameProxy.prototype.detachElement = function() {
        if(jsContext=="node")
            return Promise.reject(new Error("detachElement(): not supported in node.js"));
        if(this.game || !this.iframe)
            return Promise.reject(new Error("detachElement(): match is not attached"));
        var self = this;
        var promise = new Promise( function(resolve, reject) {
            Promise.all([
                    CreateInternalGame(self.gameName),
                    ProxiedMethod(self,"getPlayedMoves")
                ])
                .then( ([game,moves]) => {
                        self.game = game;
                        game.Load({
                            playedMoves: moves
                        });
                        return ProxiedMethod(self,"destroy");
                    })
                .then( () => {
                        while(self.element.firstChild)
                            self.element.removeChild(self.element.firstChild);
                        delete self.element;
                        delete self.iframe;
                        resolve();                        
                    })
                .catch( reject );
        });
        return promise;
    }

    function ProxiedMethod(match,methodName,args) {
        args = Array.from(args || []);
        var promise = new Promise( function(resolve, reject) {
            PostMessage(match,{
                type: "method",
                id: match.id,
                methodName: methodName,
                args: args,
            },(error,reply)=>{
                if(error)
                    reject(error);
                else
                    resolve.apply(null,reply && reply.args || []);
            });            
        });
        return promise;
    }

    GameProxy.prototype.getTurn = function() {
        if(this.game) {
            var self = this;
            var promise = new Promise( function(resolve, reject) {
                var who = self.game.GetWho();
                resolve(who);
            });
            return promise;        
        } else
            return ProxiedMethod(this,"getTurn",arguments);
    }

    GameProxy.prototype.getMoveString = function(move) {
        if(this.game) {
            var self = this;
            var promise = new Promise( function(resolve, reject) {
                if(Array.isArray(move))
                    resolve(
                        move.map( (m) => {
                            return self.game.CreateMove(m).ToString();
                        })
                    )
                else
                    resolve(self.game.CreateMove(move).ToString());
            });
            return promise;        
        } else
            return ProxiedMethod(this,"getMoveString",arguments);
    }

    GameProxy.prototype.pickMove = function(moveString) {
        if(this.game) {
            var self = this;
            var promise = new Promise( function(resolve, reject) {
                if(!self.game.mBoard.mMoves || self.game.mBoard.mMoves.length==0)
                    self.game.mBoard.GenerateMoves(self.game);
                var move = self.game.GetBestMatchingMove(moveString,self.game.mBoard.mMoves);
                resolve(move);
            });
            return promise;        
        } else
            return ProxiedMethod(this,"pickMove",arguments);
    }

    GameProxy.prototype.playMove = function(move) {
        if(jsContext=="node" || (!this.iframe && !this.area))
            return this.applyMove(move);
        if(this.game) {
            var self = this;
            var promise = new Promise( function(resolve, reject) {

                self.game.PlayMove(move)
                    .then(()=>{
                        var finished = self.game.GetFinished();
                        if(!finished)
                            self.game.InvertWho();
                        self.game.DisplayBoard();
                        resolve({
                            finished: !!finished,
                            winner: finished
                        });
                    })
                    .catch( (err) => {
                        reject(err);
                    });
            });
            return promise;        
        } else
            return ProxiedMethod(this,"playMove",arguments);
    }

    GameProxy.prototype.applyMove = function(move) {
        if(this.game) {
            var self = this;
            var promise = new Promise( function(resolve, reject) {

                self.game.ApplyMove(move);
                var finished = self.game.GetFinished();
                if(!finished)
                    self.game.InvertWho();
                if(self.area)
                    self.game.DisplayBoard();
                resolve({
                    finished: !!finished,
                    winner: finished
                });
            });
            return promise;        
        } else
            return ProxiedMethod(this,"applyMove",arguments);
    }

    GameProxy.prototype.destroy = function(move) {
        var self = this;
        if(this.game) {
            var promise = new Promise( function(resolve, reject) {
                if(self.area)
                    self.game.GameDestroyView();
                resolve();
            });
            return promise;        
        } else 
            return this.detachElement()
                .then( () => {
                    delete matches[self.id];
                })
    }

    GameProxy.prototype.getPlayedMoves = function() {
        if(this.game) {
            var self = this;
            var promise = new Promise( function(resolve, reject) {
                resolve(Array.from(self.game.mPlayedMoves));
            });
            return promise;        
        } else
            return ProxiedMethod(this,"getPlayedMoves");
    }

    GameProxy.prototype.userTurn = function() {
        if(jsContext=="node")
            return Promise.reject(new Error("userTurn(): not supported in node.js"));
        if(!this.area && !this.iframe)
            return Promise.reject(new Error("userTurn(): match is not attached to DOM element"));

        if(this.game) {
            var self = this;

            if(this.userTurnReject)
                return Promise.reject(new Error("userTurn(): already in user input mode"));

            var savedHumanMove;

            function Restore() {
                self.game.HumanMove = savedHumanMove;
                delete self.userTurnReject;
            }

            var promise = new Promise( function(resolve, reject) {
                self.userTurnReject = reject;

                function HumanMove(move) {
                    self.game.ApplyMove(move);
                    var finished = self.game.GetFinished();
                    if(!finished)
                        self.game.InvertWho();
                    self.game.DisplayBoard();
                    resolve({
                        move: move,
                        finished: !!finished,
                        winner: finished
                    });
                }
                savedHumanMove = self.game.HumanMove;
                self.game.HumanMove = HumanMove;

                self.game.HumanTurn();
            });
            return promise
                .then( (result) => {
                    Restore();
                    return result;
                })
                .catch( (err) => {
                    Restore();
                    throw err;
                })
        } else
            return ProxiedMethod(this,"userTurn");
    }

    GameProxy.prototype.abortUserTurn = function() {
        if(jsContext=="node")
            return Promise.reject(new Error("abortUserTurn(): not supported in node.js"));
        if(!this.area && !this.iframe)
            return Promise.reject(new Error("abortUserTurn(): match is not attached to DOM element"));

        if(this.game) {
            var self = this;

            if(!this.userTurnReject)
                return Promise.reject(new Error("abortUserTurn(): not in user input mode"));

            var promise = new Promise( function(resolve, reject) {
                self.game.HumanTurnEnd();
                var userTurnReject = self.userTurnReject;
                delete self.userTurnReject;
                userTurnReject(new Error("User input aborted"));
                resolve();
            });
            return promise;
        } else
            return ProxiedMethod(this,"abortUserTurn");
    }

    GameProxy.prototype.machineSearch = function(options) {

        var self = this;

        if(this.game) {

            options = Object.assign({
                level: self.game.config.model.levels[0],
                threaded: true
            },options);

            var savedMachineMove, savedMachineProgress;

            function Restore() {
                self.game.MachineMove = savedMachineMove;
                self.game.MachineProgress = savedMachineProgress;
                delete self.machineSearchReject;
            }

            var promise = new Promise( function(resolve, reject) {
                self.machineSearchReject = reject;

                function MachineMove(result) {
                    var move = result.move;
                    delete result.move;
                    var finished = self.game.GetFinished();
                    resolve({
                        move: move,
                        finished: !!finished,
                        winner: finished
                    });
                }
                savedMachineMove = self.game.MachineMove;
                self.game.MachineMove = MachineMove;

                function MachineProgress(percent) {
                    if(self.area)
                        window.parent.postMessage({
                            joclyEmbeddedGameId: self.id,
                            message: {
                                type: "machine-progress",
                                progress: percent
                            }
                        },"*");
                }
                savedMachineProgress = self.game.MachineProgress;
                self.game.MachineProgress = MachineProgress;

                self.game.StartMachine(options);
            });
            return promise
                .then( (result) => {
                    Restore();
                    return result;
                })
                .catch( (err) => {
                    Restore();
                    throw err;
                })
        } else {
            function Restore2() {
               delete self.machineProgressListener;
            }
            options = options || {};
            self.machineProgressListener = options.progress || function() {};
            delete options.progress;

            return ProxiedMethod(this,"machineSearch",[options])
                .then( (result) => {
                    Restore2();
                    return result;
                })
                .catch( (err) => {
                    Restore2();
                    throw err;
                })
        }
    }

    GameProxy.prototype.abortMachineSearch = function() {
        if(this.game) {
            var self = this;

            if(!this.machineSearchReject)
                return Promise.reject(new Error("abortMachineSearch(): machine not searching"));

            var promise = new Promise( function(resolve, reject) {
                self.game.StopThreadedMachine();
                var machineSearchReject = self.machineSearchReject;
                delete self.machineSearchReject;
                machineSearchReject(new Error("Machine search aborted"));
                resolve();
            });
            return promise;
        } else
            return ProxiedMethod(this,"abortMachineSearch");
    }

    GameProxy.prototype.setViewOptions = function(options) {
        if(jsContext=="node")
            return Promise.reject(new Error("setViewOptions(): not supported in node.js"));
        if(!this.area && !this.iframe)
            return Promise.reject(new Error("setViewOptions(): match is not attached to DOM element"));

        if(this.game) {
            var self = this;

            var promise = new Promise( function(resolve, reject) {
                self.game.GameDestroyView();
                const optDefs = {
                    "mSkin": "skin",
                    "mNotation": "notation",
                    "mSounds": "sounds",
                    "mShowMoves": "showMoves",
                    "mAutoComplete": "autoComplete"
                }
                for(var o in optDefs) 
                    if(typeof options[optDefs[o]]!="undefined")
                        self.game[o] = options[optDefs[o]];
                self.game.GameInitView();
                resolve();
            });
            return promise;
        } else
            return ProxiedMethod(this,"setViewOptions",arguments);
    }

    GameProxy.prototype.getFinished = function() {
        if(this.game) {
            var self = this;

            var promise = new Promise( function(resolve, reject) {
                var finished = self.game.GetFinished();
                resolve({
                    finished: !!finished,
                    winner: finished
                });
            });
            return promise;
        } else
            return ProxiedMethod(this,"getFinished");
    }

    GameProxy.prototype.rollback = function(index) {
        if(this.game) {
            var self = this;

            var promise = new Promise( function(resolve, reject) {
                if(index<0)
                    index = self.game.mPlayedMoves.length + index;
                index = Math.max(0,Math.min(index,self.game.mPlayedMoves.length));
                var playedMoves = self.game.mPlayedMoves;
                self.game.BackTo(index,playedMoves);
                if(self.area)
                    self.game.DisplayBoard();
                resolve();
            });
            return promise;
        } else
            return ProxiedMethod(this,"rollback",arguments);
    }

    GameProxy.prototype.otherPlayer = function(player) {
        var promise = new Promise( function(resolve, reject) {
            if(player==1)
                resolve(-1);
            else if(player==-1)
                resolve(1);
            else
                reject(new Error("otherPlayer: invalid input"));
        });
        return promise;
    }

    GameProxy.prototype.save = function() {
        if(this.game) {
            var self = this;

            var promise = new Promise( function(resolve, reject) {
                resolve({
                    playedMoves: Array.from(self.game.mPlayedMoves)
                })
            });
            return promise;
        } else
            return ProxiedMethod(this,"save");
    }

    GameProxy.prototype.load = function(data) {
        if(this.game) {
            var self = this;

            var promise = new Promise( function(resolve, reject) {
                self.game.Load(data);
                if(self.area)
                    self.game.DisplayBoard();
                resolve();
            });
            return promise;
        } else
            return ProxiedMethod(this,"load",arguments);
    }

    exports.createMatch = CreateMatch;
    exports._createInternalGame = CreateInternalGame; // do not use this

    exports.PLAYER_A = 1;
    exports.PLAYER_B = -1;
    exports.DRAW = 2;

})();



