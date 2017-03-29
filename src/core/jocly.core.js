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

if (typeof WorkerGlobalScope == 'undefined' || !(self instanceof WorkerGlobalScope)) {
    var GameProxy = require("./jocly.proxy.js");
}

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

exports.createInternalGame = function (gameName, options) {
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

exports.createGame = function (gameName) {
    var options, element;
    if(typeof Element !== "undefined" && arguments[1] instanceof Element) {
        element = arguments[1];
        options = arguments[2];
    } else
        options = arguments[1];

    var promise = new Promise((resolve,reject)=>{
        GameProxy.createGame(gameName,options)
            .then((game)=>{
                if(element) {
                    game.attachElement(element,options)
                        .then(()=>{
                            resolve(game);
                        },reject);
                } else
                    resolve(game);
            },reject);
    });
    return promise;
}
