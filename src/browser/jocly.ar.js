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

JoclyAR = (function($) {

    var running = false;
    var videoElement = null;
    var canvas, context;
    var width = 320, height = 240;
    var modelSize = 5;
    var scale = .2;
    var threeCtx = null;
    var processing = false;
    var arWorker = null;
    var oposition = new THREE.Vector3();
    var oeuler = new THREE.Euler();

    function AnimationFrame() {
        if(!running)
            return;
        if(!processing && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
            processing = true;
            context.drawImage(videoElement,0,0,width,height);
            var imageData = context.getImageData(0, 0, width, height);
            arWorker.postMessage({
                type: "Detect",
                imageData: imageData,
                vwidth: videoElement.clientWidth,
                vheight: videoElement.clientHeight
            });
        } else
            requestAnimationFrame(AnimationFrame);
    }

    var mouseDownY = null, scale0 = scale;
    function MouseMove(event) {
        var y = event.clientY;
        var ratio = (y-mouseDownY) / event.target.clientHeight;
        scale = scale0 * (1 - ratio);
        threeCtx.animControl.trigger();
    }
    function Mouse(event) {
        switch(event.type) {
            case 'mousedown':
                if(event.button==1 || event.button==2) {
                    mouseDownY = event.clientY;
                    scale0 = scale;
                    event.target.addEventListener('mousemove',MouseMove);
                }
                break;
            case 'mouseup':
            case 'mouseout':
                event.target.removeEventListener('mousemove',MouseMove);
        }
    }

    var exports = {
        start: function() {
            JoclyPlazza.webrtc.startLocal(true,{
                video: {
                    width: { ideal: width },
                    height: { ideal: height },
                    facingMode: "environment",
                    frameRate: {ideal: 24 }
                }
            });
        },
        stop: function() {
            JoclyPlazza.webrtc.setChannel(null);
        },
        attach: function(data) {
            videoElement = data.element;
            JoclyPlazza.webrtc.attachMediaStream(data.element,data.stream);
            canvas = document.createElement("canvas");
            canvas.setAttribute("width",width);
            canvas.setAttribute("height",height);
            Object.assign(canvas.style,{
                width: width,
                height: height,
                visibility : "hidden",
                position: "absolute",
                "z-index": -2,
                top: 0,
            });
            document.body.appendChild(canvas);
            /*
            $("<canvas/>")
                .attr("width", width).attr("height",height)
                .width(width).height(height)
                .css({
                    visibility : "hidden",
                    position: "absolute",
                    "z-index": -2,
                    top: 0,
            }).appendTo("body");
            */
            context = canvas.getContext("2d");
            threeCtx = data.threeCtx;
            running = true;
            processing = false;
            threeCtx.renderer.domElement.addEventListener("mousedown",Mouse);
            threeCtx.renderer.domElement.addEventListener("mouseup",Mouse);
            threeCtx.renderer.domElement.addEventListener("mouseout",Mouse);

       		arWorker = new Worker(JoclyPlazza.config.baseURL+JoclyPlazza.config.joclyPath+'/jocly.arworker.js');
            arWorker.onmessage = function(e) {
                processing = false;
                var message = e.data;
                switch(message.type) {
                    case "Pose": 
                        var rotation = message.rotation;
                        var translation = message.translation;

                        threeCtx.body.position.set(0,0,0);
                        threeCtx.camera.lookAt(new THREE.Vector3(0,-1,0));

                        threeCtx.harbor.scale.set(modelSize*scale,modelSize*scale,modelSize*scale);

                        threeCtx.harbor.rotation.set(
                            -Math.asin(-rotation[1][2]),
                            Math.atan2(rotation[1][0], rotation[1][1]),
                            -Math.atan2(rotation[0][2], rotation[2][2])                            
                        );
                        threeCtx.harbor.position.set(
                            translation[0],
                            -translation[2],
                            -translation[1]                            
                        );
                        if(!threeCtx.harbor.position.equals(oposition) || 
                            !threeCtx.harbor.rotation.equals(oeuler))
                            threeCtx.animControl.trigger();
                        oposition.copy(threeCtx.harbor.position);
                        oeuler.copy(threeCtx.harbor.rotation);
                        break;
                    case "NoPose":
                        break;
                }
                setTimeout(AnimationFrame,20);
            }
            arWorker.postMessage({
                type: "Init",
                baseUrl: JoclyPlazza.config.baseURL+JoclyPlazza.config.joclyPath,
                modelSize: modelSize,
                width: width,
                height: height
            });
            requestAnimationFrame(AnimationFrame);
        },
        detach: function(data) {
            threeCtx.renderer.domElement.removeEventListener("mousedown",Mouse);
            threeCtx.renderer.domElement.removeEventListener("mouseup",Mouse);
            threeCtx.renderer.domElement.removeEventListener("mouseout",Mouse);
            JoclyPlazza.webrtc.detachMediaStream(data.element);
            videoElement = null;
            running = false;
            canvas.parentNode.removeChild(canvas);
            context = null;
            threeCtx = null;
            arWorker.terminate();
            arWorker = null;
        }
    }

    return exports;


})();

