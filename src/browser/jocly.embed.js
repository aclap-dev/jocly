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

var gameId;
var gGame;

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{
    console.info("embed receives message",event.data);
    var origin = event.origin || event.originalEvent.origin;
    var url = new URL(window.location);
    if(origin!=url.origin)
        return;
    function Reply(message) {
        window.parent.postMessage({
            joclyEmbeddedGameId: gameId,
            replyId: event.data.replyId,
            message: message
        },"*");
    }
    var message = event.data.message;
    switch(message.type) {
        case "init":
            gameId = message.id;
            var area = document.getElementById("area");
            Jocly.createInternalGame(message.gameName).then((game) => {
                gGame = game;
                game.AddListener(Listen);
                function Start() {
                    game.AttachElement(area).then(()=>{
                        game.GameInitView();
                        game.DisplayBoard();
                        Reply();
                    });
                }
                if (document.readyState === "complete"
                    || document.readyState === "loaded"
                    || document.readyState === "interactive")
                    Start();
                else
                    window.addEventListener("DOMContentLoaded", () => {
                        Start();
                    });
            });
            break;
        case "humanTurn":
            gGame.HumanTurn();
            break;
        case "machineTurn":
            gGame.StartMachine(message.options);
            break;
        case "getFinished":
            var finished = gGame.GetFinished();
            Reply({
                finished: !!finished,
                winner: finished
            });
            break;
        case "getMoveString":
            var move = new (gGame.GetMoveClass())(message.move);
            Reply(move.ToString());
            break;
    }
}

function Listen(message) {
    switch(message.type) {
        case "human-move":
            gGame.ApplyMove(message.move);
            var finished = gGame.GetFinished();
            if(!finished)
                gGame.InvertWho();
            gGame.DisplayBoard();
            Object.assign(message,{
                finished: !!finished,
                winner: finished
            });
            break;
        case "machine-move":
            var move = message.result.move;
            delete message.result.move;
            gGame.PlayMove(move)
                .then(()=>{
                    var finished = gGame.GetFinished();
                    if(!finished)
                        gGame.InvertWho();
                    gGame.DisplayBoard();
                    window.parent.postMessage({
                        joclyEmbeddedGameId: gameId,
                        message: {
                            type: "machine-move",
                            moveData: message.result,
                            move: move,
                            finished: !!finished,
                            winner: finished
                        }
                    },"*");
                });
            return;
    }
    window.parent.postMessage({
        joclyEmbeddedGameId: gameId,
        message: message
    },"*");
}
