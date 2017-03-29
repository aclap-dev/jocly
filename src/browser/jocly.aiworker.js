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

var window = self;

var Jocly;

onmessage = function(e) {
    var t0 = Date.now();
    var message = e.data;
    var options = message.options;
    var importTime = 0;
    switch(message.type) {
        case "Init":
            var scripts = [
                message.baseURL+"jocly.core.js",
            ];
            Jocly = self.exports = {};
            importScripts.apply(null,scripts);
            importTime = Date.now() - t0;
            break;
        case "Play":
            Jocly.createInternalGame(message.gameName,options).then((game)=>{
                game.mBoard.mMoves = [];
                game.Load({
                    playedMoves: message.playedMoves
                });
                game.mDoneCallback = function(doneData) {
                    postMessage({
                        type: "Done",
                        data: doneData
                    });
                }
                game.mProgressCallback = function(percent) {
                    postMessage({
                        type: "Progress",
                        percent: percent
                    });
                }
                if(typeof(options.level)!="undefined")
                    game.mTopLevel=options.level;
                if(typeof(options.maxDepth)!="undefined")
                    game.mTopLevel=options.maxDepth;
                game.mStartTime = new Date().getTime();
                game.mExploredCount = 0;
                game.mPickedMoveIndex = 0;
                game.mBestMoves = [];
                game.mContexts = [];
                game.mDuration = 0;
                game.mAborted = false;
                game.mRandomSeed = 0;
                if(options.randomSeed && !isNaN(parseInt(options.randomSeed)))
                    game.mRandomSeed = parseInt(options.randomSeed);
                if(game.mOptions.levelOptions) {
                    game.mOptions.levelOptionsSaved=JSON.parse(JSON.stringify(game.mOptions.levelOptions));
                    if(options.level)
                        JocUtil.extend(game.mOptions.levelOptions,options.level);
                }
                switch(e.data.algo) {
                    case "uct":
                        JoclyUCT.startMachine(game,options);
                        break;
                    case "alpha-beta":
                        game.Engine(game.mBoard, game.mTopLevel, false, 0, options.potential); // start algo
                        game.Run();
                        break;
                }
            });
            break;
    }
    //console.info("initTime",Date.now()-e.data.t0);
}