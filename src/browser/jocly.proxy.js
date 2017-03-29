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

var gameConfigs = {}
var gameIdRef = 0;
var messageListenerInstalled = false;
var games = {};
var msgIdRef = 0;
var messageReplies = {};

function MessageListener(event) {
    var game = games[event.data.joclyEmbeddedGameId];
    console.info("proxy receives message",event.data);
    if(game) {
        var replyId = event.data.replyId;
        if(replyId) {
            var reply = messageReplies[replyId];
            if(reply) {
                delete messageReplies[replyId];
                reply(event.data.message);
            }
        } else 
            game.listeners.forEach((listener)=>{
                listener.call(game,event.data.message);
            });
    }
}

function GameProxyClass(gameName) {
    this.gameName = gameName;
    this.listeners = [];
    this.id = ++gameIdRef;
}

GameProxyClass.prototype.attachElement = function(element,options) {
    var self = this;
    var promise = new Promise((resolve,reject)=>{
        if(!messageListenerInstalled) {
            messageListenerInstalled = true;
            window.addEventListener("message",MessageListener);
        }

        this.element = element;
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

        this.iframe = iframe;

        iframe.onload = ()=>{
            PostMessage(self,{
                type: "init",
                id: this.id,
                gameName: this.gameName
            },(reply)=>{
                resolve();
            });
        };

    });
    return promise;
}

function PostMessage(game,message,reply) {
    var wrapper = {
        message: message
    }
    if(reply) {
        var replyId = ++msgIdRef;
        wrapper.replyId = replyId;
        messageReplies[replyId] = reply;
    }
    game.iframe.contentWindow.postMessage(wrapper,"*");
}

GameProxyClass.prototype.listen = function(listener) {
    var self = this;
    var promise = new Promise((resolve,reject)=>{
        self.listeners.push(listener);
        resolve();
    });
    return promise;
}

GameProxyClass.prototype.unlisten = function(listener) {
    var self = this;
    var promise = new Promise((resolve,reject)=>{
        for(var i = self.listeners.length-1;i>=0;i--)
            if(self.listeners[i]==listener)
                self.listeners.splice(i,1);
        resolve();
    });
    return promise;
}

GameProxyClass.prototype.humanTurn = function() {
    var self = this;
    var promise = new Promise((resolve,reject)=>{
        PostMessage(self,{
            type: "humanTurn"
        });
        resolve();
    });
    return promise;
}

GameProxyClass.prototype.machineTurn = function(options) {
    var self = this;
    var promise = new Promise((resolve,reject)=>{
        PostMessage(self,{
            type: "machineTurn",
            options: options
        });
        resolve();
    });
    return promise;
}

GameProxyClass.prototype.getFinished = function() {
    var self = this;
    var promise = new Promise((resolve,reject)=>{
        PostMessage(self,{
            type: "getFinished"
        },(result) => {
            resolve(result);
        });
    });
    return promise;
}

GameProxyClass.prototype.getMoveString = function(move) {
    var self = this;
    var promise = new Promise((resolve,reject)=>{
        PostMessage(self,{
            type: "getMoveString",
            move: move
        },(move) => {
            resolve(move);
        });
    });
    return promise;
}

function CreateGame(gameName) {
    var promise = new Promise((resolve,reject)=>{

        function CreateGame(config) {
            var game = new GameProxyClass(gameName);
            games[game.id] = game;
            Object.assign(game,config);
            resolve(game);
        }

        var config = gameConfigs[gameName];
        if(config)
            CreateGame(config);
        else {
            Jocly.listGames()
                .then((games)=>{
                    var gameDescr = games[gameName];
                    if (!gameDescr)
                        return reject(new Error("Game " + gameName + " not found"));
                    SystemJS.import("games/" + gameDescr.module + "/" + gameName + "-config.js")
                        .then((config)=>{
                            gameConfigs[gameName] = config;
                            CreateGame(config);
                        });

                },reject);
        }
    });
    return promise;
}

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
    this.GameProxy = {
        createGame: CreateGame
    }
else
    exports.createGame = CreateGame;
