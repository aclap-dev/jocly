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

var matchId;
var gMatch;

window.addEventListener("message", ReceiveMessage, false);

function ReceiveMessage(event)
{
    //console.info("embed receives message",event.data);
    var origin = event.origin || event.originalEvent.origin;
    var url = new URL(window.location);
    if(origin!=url.origin)
        return;
    function Reply(message) {
        message = message || {};
        window.parent.postMessage({
            joclyEmbeddedGameId: matchId,
            replyId: event.data.replyId,
            message: message
        },"*");
    }
    function ReplyError(error) {
        console.warn("Embed error:",error);
        if(typeof error=="object")
            error = {
                message: error.message,
                fileName: error.fileName,
                lineNumber: error.lineNumber,
                stack: error.stack
            }
        Reply({
            type: "error",
            error: error
        });
    }
    var message = event.data.message;
    switch(message.type) {
        case "init":
            matchId = message.id;
            var area = document.getElementById("area");
            Jocly.createMatch(message.gameName).then((match) => {
                gMatch = match;
                match.game.Load({
                    playedMoves: message.playedMoves
                });
                function Start() {
                    match.game.AttachElement(area).then(()=>{
                            match.area = area;
                            var options = message.options && message.options.viewOptions;
                            if(options) {
                                const optDefs = {
                                    "mSkin": "skin",
                                    "mNotation": "notation",
                                    "mSounds": "sounds",
                                    "mShowMoves": "showMoves",
                                    "mAutoComplete": "autoComplete"
                                }
                                for(var o in optDefs) 
                                    if(typeof options[optDefs[o]]!="undefined")
                                        match.game[o] = options[optDefs[o]];
                            }
                            match.game.GameInitView();
                            match.game.DisplayBoard();
                            Reply();
                        })
                        .catch(ReplyError);
                }
                if (document.readyState === "complete"
                    || document.readyState === "loaded"
                    || document.readyState === "interactive")
                    Start();
                else
                    window.addEventListener("DOMContentLoaded", () => {
                        Start();
                    });
            })
            .catch(ReplyError);
            break;
        case "method":
            //console.info("embed execute method",message.methodName,message.args);
            try {
                gMatch[message.methodName].apply(gMatch,message.args)
                    .then( function() {
                        Reply({
                            args: Array.from(arguments)
                        })
                    },ReplyError)
            } catch(e) {
                ReplyError(e);
            }
            break;
        case "destroy":
            var playedMoves = gMatch.game.mPlayedMoves;
            gMatch.destroy()
                .then( ()=> {
                    Reply({
                        playedMoves: playedMoves
                    });
                });
            break;
    }
}

window.addEventListener("resize", Resize, false);

function Resize() {
    var game = gMatch && gMatch.game;
    if(!game)
        return;
    game.mGeometry = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    game.GameDestroyView();
    game.GameInitView();
    game.DisplayBoard();
}