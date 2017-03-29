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

const SystemJS = require("../../node_modules/systemjs/dist/system.js");

function GetScriptPath() {
    var scripts= document.getElementsByTagName('script');
    var path= scripts[scripts.length-1].src.split('?')[0];
    var mydir= path.split('/').slice(0, -1).join('/')+'/';
    return new URL(mydir).pathname;
}

const joclyScriptPath = GetScriptPath();

SystemJS.config({
    baseURL: joclyScriptPath
});

function ExportFunction(fName) {
    exports[fName] = function() {
        var args = arguments;
        var promise = new Promise((resolve,reject)=>{
            SystemJS.import("jocly.core.js").then((m)=>{
                m[fName].apply(m,args).then(function() {
                    resolve.apply(null,arguments);
                },(e)=>{
                    reject(e);
                });
            },(e)=>{
                reject(e);
            });
        });
        return promise;
    }
}

["listGames","createGame","createInternalGame"].forEach((fName)=>{
    ExportFunction(fName);
});

