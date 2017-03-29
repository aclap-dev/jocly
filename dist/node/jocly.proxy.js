"use strict";

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

var joclyGame = require("./jocly.game");
var joclyCore = require("./jocly.core");

var gameConfigs = {};

function GameProxyClass(gameName) {
    this.gameName = gameName;
    this.listeners = [];
}

GameProxyClass.prototype.listen = function (listener) {
    var self = this;
    var promise = new Promise(function (resolve, reject) {
        self.listeners.push(listener);
        resolve();
    });
    return promise;
};

GameProxyClass.prototype.unlisten = function (listener) {
    var self = this;
    var promise = new Promise(function (resolve, reject) {
        for (var i = self.listeners.length - 1; i >= 0; i--) {
            if (self.listeners[i] == listener) self.listeners.splice(i, 1);
        }resolve();
    });
    return promise;
};

GameProxyClass.prototype.humanTurn = function () {
    return this.game.humanTurn();
};

GameProxyClass.prototype.machineTurn = function (options) {
    var self = this;
    var promise = new Promise(function (resolve, reject) {
        self.game.StartMachine(options);
        resolve();
    });
    return promise;
};

GameProxyClass.prototype.getFinished = function () {
    var self = this;
    var promise = new Promise(function (resolve, reject) {
        var finished = self.gameName.GetFinished();
        resolve(finished);
    });
    return promise;
};

GameProxyClass.prototype.getMoveString = function (move) {
    var self = this;
    var promise = new Promise(function (resolve, reject) {
        var m = new (self.game.GetMoveClass())(move);
        resolve(m.ToString());
    });
    return promise;
};

function Post(game, message) {
    game.listeners.forEach(function (listener) {
        listener.call(game, message);
    });
}

function GetListener(game) {
    return function (message) {
        var _game = this;
        switch (message.type) {
            case "human-move":
                _game.ApplyMove(message.move);
                var finished = _game.GetFinished();
                if (!finished) _game.InvertWho();
                Object.assign(message, {
                    finished: !!finished,
                    winner: finished
                });
                break;
            case "machine-move":
                var move = message.result.move;
                delete message.result.move;
                _game.ApplyMove(move);
                var finished = _game.GetFinished();
                if (!finished) _game.InvertWho();
                Post(game, {
                    type: "machine-move",
                    moveData: message.result,
                    move: move,
                    finished: !!finished,
                    winner: finished
                });
                return;
        }
        Post(game, message);
    };
}

function CreateGame(gameName) {
    var promise = new Promise(function (resolve, reject) {

        function CreateGame(config) {
            var game = new GameProxyClass(gameName);
            Object.assign(game, config);
            game.game = new joclyCore.createInternalGame(gameName).then(function (_game) {
                _game.AddListener(GetListener(game));
                game.game = _game;
                resolve(game);
            }, reject);
        }

        var config = gameConfigs[gameName];
        if (config) CreateGame(config);else {
            joclyCore.listGames().then(function (games) {
                var gameDescr = games[gameName];
                if (!gameDescr) return reject(new Error("Game " + gameName + " not found"));
                var config = require("./games/" + gameDescr.module + "/" + gameName + "-config.js");
                gameConfigs[gameName] = config;
                CreateGame(config);
            }, reject);
        }
    });
    return promise;
}

exports.createGame = CreateGame;
//# sourceMappingURL=jocly.proxy.js.map
