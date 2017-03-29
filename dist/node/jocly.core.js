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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if (typeof WorkerGlobalScope == 'undefined' || !(self instanceof WorkerGlobalScope)) {
    var GameProxy = require("./jocly.proxy.js");
}

exports.listGames = function () {

    var promise = new Promise(function (resolve, reject) {
        if (typeof SystemJS != "undefined") SystemJS.import("jocly-allgames.js").then(function (m) {
            if (typeof SystemJS != "undefined") {
                var baseURL = SystemJS.getConfig().baseURL;
                for (var gameName in m.games) {
                    var game = m.games[gameName];
                    game.thumbnail = baseURL + "games/" + game.module + "/" + game.thumbnail;
                }
            }
            resolve(m.games);
        }, function (e) {
            console.warn("Could not load Jocly games", e);
            reject(e);
        });else resolve(require("./jocly-allgames.js").games);
    });
    return promise;
};

var gameClassCache = {};

function CreateGame(gameName, gameDescr, base, model, config) {
    var Game = function Game() {
        this.g = {}; // some games assume this member exists
    };
    Object.assign(Game.prototype, base.Game.prototype, model.model.Game);

    var Board = function Board() {};
    Object.assign(Board.prototype, base.Board.prototype, model.model.Board);
    Game.prototype.mBoardClass = Board;

    var Move = function Move(args) {
        this.Init(args);
    };
    Object.assign(Move.prototype, base.Move.prototype, model.model.Move);
    Game.prototype.mMoveClass = Move;

    Game.prototype.config = config.config;

    if (typeof SystemJS != "undefined") {
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
    };

    var game = new Game();

    game.Init(initArgs);

    return game;
}

exports.createInternalGame = function (gameName, options) {
    var gameClassData = gameClassCache[gameName];
    if (gameClassData) {
        var promise = new Promise(function (resolve, reject) {
            var game = new gameClassData.gameClass();
            game.Init(gameClassData.initArgs);
            resolve(game);
        });
        return promise;
    }
    if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) return WorkerCreateGame(gameName, options);else if (typeof process !== "undefined" && process.title === "node") return NodeCreateGame(gameName, options);else return BrowserCreateGame(gameName, options);
};

function NodeCreateGame(gameName, options) {
    var t0 = Date.now();
    options = options || {};
    var promise = new Promise(function (resolve, reject) {

        var games = require("./jocly-allgames.js").games;

        var gameDescr = games[gameName];
        if (!gameDescr) return reject(new Error("Game " + gameName + " not found"));

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
    var promise = new Promise(function (resolve, reject) {

        importScripts("jocly-allgames.js");
        var games = exports.games;

        var gameDescr = games[gameName];
        if (!gameDescr) return reject(new Error("Game " + gameName + " not found"));

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
    var promise = new Promise(function (resolve, reject) {

        exports.listGames().then(function (games) {

            var gameDescr = games[gameName];
            if (!gameDescr) return reject(new Error("Game " + gameName + " not found"));

            var gamePromises = [SystemJS.import("jocly.game.js"), SystemJS.import("games/" + gameDescr.module + "/" + gameName + "-model.js"), SystemJS.import("games/" + gameDescr.module + "/" + gameName + "-config.js")];

            Promise.all(gamePromises).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 3),
                    base = _ref2[0],
                    model = _ref2[1],
                    config = _ref2[2];

                var game = CreateGame(gameName, gameDescr, base, model, config);

                resolve(game);
            }, function (e) {
                reject(e);
            });
        }, reject);
    });
    return promise;
}

exports.createGame = function (gameName) {
    var options, element;
    if (typeof Element !== "undefined" && arguments[1] instanceof Element) {
        element = arguments[1];
        options = arguments[2];
    } else options = arguments[1];

    var promise = new Promise(function (resolve, reject) {
        GameProxy.createGame(gameName, options).then(function (game) {
            if (element) {
                game.attachElement(element, options).then(function () {
                    resolve(game);
                }, reject);
            } else resolve(game);
        }, reject);
    });
    return promise;
};
//# sourceMappingURL=jocly.core.js.map
