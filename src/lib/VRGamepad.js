
function VRGamepads(opts) {
    var options = Object.assign({
        drag: function(position,direction) {
            return false;
        },
        click: function(position,direction) {
        },
        reset: function() {
        },
        speed: 10,
        move: function(delta) {
        },
        visionCrosshairAngle: -Math.PI/8,
        movementMin: .2,
    },opts);

    var harborpad = null;

    function VRGamepad(gamepad) {

        THREE.Object3D.call( this );

        this.matrixAutoUpdate = false;
        this.isVRPad = false;

        var axes = [];
        var buttons = [];
        var buttonsIndexes = {
            move: -1,
            click: -1,
            reset: -1
        }

        this.getGamepad = function () {
            return gamepad;
        }

        this.getButtonState = function ( button ) {
            return false;
        }

        this.drag = function() {
            var pointer = this.getPointer();
            var progress = this.progressObject;
            var pointed = options.drag(pointer.position,pointer.direction);
            if(pointed) {
                if(this.pointerRescale) {
                    var distance = pointer.position.distanceTo(pointed.point);
                    var thickness = harborpad ? .1 : 1;
                    this.pointerObject.scale.set(thickness,distance,thickness);
                }
                this.pointerObject.material.color.setRGB(0,1,0);

                if(progress) {
                    var oid = pointed.object.id;
                    if(this.pointedId==oid) {
                        const pointingTime = 2000;
                        var now = Date.now();
                        var ratio = 1-(now-this.pointedTime)/pointingTime;
                        if(ratio<0) {
                            options.click(pointer.position,pointer.direction);
                            this.pointedId = null;
                        } else
                            progress.scale.set(ratio,ratio,ratio);
                    } else {
                        this.pointedId = oid;
                        progress.scale.set(1,1,1);
                        this.pointedTime = Date.now();
                        progress.visible = true;
                    }
                }
            } else {
                this.pointerObject.material.color.setRGB(1,.75,0);
                if(this.pointerRescale) {
                    var thickness = harborpad ? .1 : 1;
                    this.pointerObject.scale.set(thickness,100,thickness);
                }

                if(progress && this.pointedId) {
                    progress.visible = false;
                    this.pointedId = null;
                }

            }
        }

        this.update = function() {
            var $this = this;

            if(this.crosshairNeedsUpdate) {
                var pointer = this.getPointer();
                this.pointerObject.position.copy(pointer.position);
                this.pointerObject.position.add(pointer.direction);
            }

            if(this.progressNeedsUpdate) {
                var pointer = this.getPointer();
                this.progressObject.position.copy(pointer.position);
                this.progressObject.position.add(pointer.direction);
            }

			var pose = gamepad.pose;
            if(pose) {
                if(pose.position)
                    this.position.fromArray(pose.position);
                if(pose.orientation)
                    this.quaternion.fromArray(pose.orientation);
                this.matrix.compose(this.position,this.quaternion,this.scale );
                this.matrixWorldNeedsUpdate = true;
            }
            if(gamepad.buttons) {
                var changedButtons = false;
                gamepad.buttons.forEach(function(button,index) {
                    if(index===buttonsIndexes.click && button.pressed)
                        $this.drag();
                    if(button.pressed!==buttons[index]) {
                        buttons[index] = button.pressed;
                        if(buttons[index]!==undefined) {
                            changedButtons = true;
                            if(index===buttonsIndexes.move)
                                $this.moveButtonChanged(button.pressed);
                            if(index===buttonsIndexes.click)
                                $this.clickButtonChanged(button.pressed);
                            if(index===buttonsIndexes.reset)
                                $this.resetButtonChanged(button.pressed);
                        }
                    }
                });
            }
            if(gamepad.axes) {
                var changedAxes = false;
                gamepad.axes.forEach(function(axe,index) {
                    if(axe!==axes[index]) {
                        axes[index] = axe;
                        changedAxes = true;
                    }
                });
                if(buttonsIndexes.move>=0 && buttons[buttonsIndexes.move]) {
                    var now = window.performance.now();
                    var last = this.lastThumbpadTimestamp;
                    var deltaT = now - last;
                    var rotation = new THREE.Matrix4().extractRotation(this.matrixWorld);
                    var direction = new THREE.Vector3(axes[0],0,-axes[1]).applyMatrix4(rotation);
                    direction.multiplyScalar(options.speed*deltaT/1000);
                    options.move(direction);
                    this.lastThumbpadTimestamp = now;
                }
                if(buttonsIndexes.move<0) {
                    var now = window.performance.now();
                    var movement = new THREE.Vector3(axes[0],0,axes[1]);
                    if(movement.length()>options.movementMin) {
                        var last = this.lastThumbpadTimestamp;
                        var deltaT = now - last;
                        // yeah i know, it could have been simpler
                        var direction = options.camera.getWorldDirection();
                        var xzDirection = new THREE.Vector3(direction.x,0,direction.z);
                        xzDirection.normalize();
                        xzDirection.applyAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/2);
                        var rotateAxis = new THREE.Vector3(xzDirection.x,0,xzDirection.z)
                        rotateAxis.normalize();
                        var rotateAxis2 = new THREE.Vector3().copy(direction);
                        rotateAxis2.applyAxisAngle(rotateAxis,Math.PI/2);
                        var angle = Math.atan2(-axes[0],-axes[1]);
                        direction.applyAxisAngle(rotateAxis2,angle);
                        direction.multiplyScalar(options.speed*deltaT/1000);
                        options.move(direction);
                    }
                    this.lastThumbpadTimestamp = now;
                }
            }

            if(this.alwaysDrag)
                this.drag();
        }

        this.getPointer = function() {
            var position = this.getWorldPosition();
            if(gamepad.pose && gamepad.pose.hasOrientation) {
                var line = this.pointerObject;
                var pos0 = new THREE.Vector3(0,0,0);
                pos0.applyMatrix4(line.matrixWorld);
                var direction = new THREE.Vector3(0,-1,0);
                direction.applyMatrix4(line.matrixWorld);
                direction.sub(pos0);
                direction.normalize();
                return {
                    position: position,
                    direction: direction
                }
            } else {
                var position = options.camera.getWorldPosition();
                var direction = options.camera.getWorldDirection();
                position.add(direction);
                return {
                    position: position,
                    direction: direction
                }
            }
        }

        this.moveButtonChanged = function(on) {
            if(on)
                this.lastThumbpadTimestamp = window.performance.now();
        }

        this.clickButtonChanged = function(on) {
            if(on)
                this.pointerObject.visible = true;
            else {
                this.pointerObject.visible = false;
                var pointer = this.getPointer();
                options.click(pointer.position,pointer.direction);
            }
        }

        this.resetButtonChanged = function(on) {

        }

        this.destroyGamepad = function() {
            if(this.parent)
                this.parent.remove(this);
            if(this.pointerObject && this.pointerObject.parent)
                this.pointerObject.parent.remove(this.pointerObject);
            if(this.progressObject && this.progressObject.parent)
                this.progressObject.parent.remove(this.progressObject);
        }

        var cache = {}

        this.createCrosshair = function() {
            var crosshair = cache["crosshair"];
            if(crosshair===undefined) {
                var geometry = new THREE.SphereGeometry(.02);
                var material = new THREE.MeshBasicMaterial( {color: 0xff0000 } );
                crosshair = new THREE.Mesh(geometry,material);
                cache["crosshair"] = crosshair;
            }
            crosshair = crosshair.clone();
            this.crosshairNeedsUpdate = true;
            this.pointerObject = crosshair;
            options.scene.add(crosshair);
            this.pointerRescale = false;
        }

        this.createProgress = function() {
            var progress = cache["progress"];
            if(progress===undefined) {
                var geometry = new THREE.SphereGeometry(.2,16,12);
                var material = new THREE.MeshBasicMaterial( {
                    color: 0xff0000,
                    opacity: .5,
                    transparent: true
                } );
                progress = new THREE.Mesh(geometry,material);
                progress.visible = false;
                cache["progress"] = progress;
            }
            progress = progress.clone();
            this.progressNeedsUpdate = true;
            this.progressObject = progress;
            options.scene.add(progress);
        }

        this.createViveControllerMesh = function() {

            var $this = this;
            // create clicking ray
            var line = cache["vive-controller-ray"];
            if(line===undefined) {
                var geometry = new THREE.CylinderGeometry(.008,.008,1,8);
                geometry.translate(0,-.5,0);
                var material = new THREE.MeshBasicMaterial( {color: 0x80ff80} );
                line = new THREE.Mesh( geometry, material );
                line.scale.set(1,100,1);
                line.rotateX(Math.PI/6);
                line.visible = false;
                cache["vive-controller-ray"] = line;
            }
            this.pointerObject = line.clone();
            this.add(this.pointerObject);
            this.pointerRescale = true;

            // create controller
            function AddController(object) {
                $this.add(object);
            }
            var controllerObject = cache["vive-controller"];
            if(controllerObject===undefined) {
                cache["vive-controller"] = [AddController];
                var loader = new THREE.JSONLoader();
                loader.load( options.resBase + 'vive-controller/vr_controller_vive_1_5.js',
                    function(geometry) {
                        var loader = new THREE.TextureLoader();
                        loader.setPath( options.resBase + 'vive-controller/' );
                        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                        material.map = loader.load( 'onepointfive_texture.png');
                        material.specularMap = loader.load( 'onepointfive_spec.png');
                        var controller = new THREE.Mesh(geometry,material);
                        var object = new THREE.Object3D();
                        object.add(controller);
                        cache["vive-controller"].forEach(function(callback) {
                            callback(object.clone());
                        });
                        cache["vive-controller"] = object;
                });
            } else if(Array.isArray(controllerObject)) {
                cache["vive-controller"].push(AddController);
            } else
                AddController(controllerObject.clone());
            options.camera.parent.add(this);
        }

        this.getAxes = function() {
            return axes;
        }

        if(/openvr/i.test(gamepad.id)) {
            this.createViveControllerMesh();
            buttonsIndexes = {
                move: 0,
                click: 1,
                reset: 3
            }
            this.isVRPad = true;
        } else if(/touch/i.test(gamepad.id)) {
            this.createViveControllerMesh();
            buttonsIndexes = {
                move: -1,
                click: 1,
                reset: 3
            }
            this.isVRPad = true;
        } else if(gamepad.id=="simulated") {
            this.createCrosshair();
            this.createProgress();
            this.alwaysDrag = true;
        } else if(gamepad.id==/gear vr/i.test(gamepad.id)) {
            this.createCrosshair();
            buttonsIndexes = {
                move: -1,
                click: 1,
                reset: 1
            }
        } else {
            this.createCrosshair();
            buttonsIndexes = {
                move: -1,
                click: 7,
                reset: 1
            }
        }

		if(/left/i.test(gamepad.id))
			this.whichHand = "left";
		if(/right/i.test(gamepad.id))
			this.whichHand = "right";
		
    };

    VRGamepad.prototype = Object.create( THREE.Object3D.prototype );
    VRGamepad.prototype.constructor = VRGamepad;

    var knownGamepads = [];

    function mapGamepads() {
        var newGamepads = [];
        if(typeof navigator.getGamepads=="function") {
            var gamepadsList = navigator.getGamepads();
            for(var i = 0;i<gamepadsList.length;i++) {
                var gamepad = gamepadsList[i];
                if(gamepad) {
                    var isNewGamepad = true;
                    for(var j=0;j<knownGamepads.length;j++) {
                        var knownGamepad = knownGamepads[j];
                        if(gamepad===knownGamepad.getGamepad()) {
                            newGamepads.push(knownGamepad);
                            knownGamepads.splice(j,1);
                            isNewGamepad = false;
                            break;
                        }
                    }
                    if(isNewGamepad)
                        newGamepads.push(new VRGamepad(gamepad));
                }
            }
        }
        if(newGamepads.length==0) {
            var needSimulated = true;
            for(var j=0;j<knownGamepads.length;j++) {
                var knownGamepad = knownGamepads[j];
                if(knownGamepad.getGamepad().id=="simulated") {
                    newGamepads.push(knownGamepad);
                    knownGamepads.splice(j,1);
                    needSimulated = false;
                }
            }
            if(needSimulated)
                newGamepads.push(new VRGamepad({
                    id: "simulated"
                }));
        }
        knownGamepads.forEach(function(gamepad) {
            gamepad.destroyGamepad();
        });
        knownGamepads = newGamepads;
        harborpad = null;
        var firstVRPad = null;
        for(var i=0;i<knownGamepads.length;i++) {
            var gamepad = knownGamepads[i];
            if(gamepad.isVRPad) {
                if(firstVRPad) {
                    harborpad = gamepad;
                    break;
                } else
                    firstVRPad = gamepad;
            }
        }
        if(harborpad) {
			if(harborpad.whichHand=="right" && firstVRPad.whichHand=="left") {
				var tmpPad = harborpad;
				harborpad = firstVRPad;
				firstVRPad = tmpPad;
			}
            firstVRPad.pointerObject.scale.setX(.1);
            firstVRPad.pointerObject.scale.setZ(.1);
        } else if(firstVRPad) {
            firstVRPad.pointerObject.scale.setX(1);
            firstVRPad.pointerObject.scale.setZ(1);
        }

    }

    this.getHarborPad = function() {
        return harborpad;
    }

    this.update = function() {
        mapGamepads();
        knownGamepads.forEach(function(gamepad) {
            gamepad.update();
        });
    }

    this.clearAll = function() {
        knownGamepads.forEach(function(gamepad) {
            gamepad.destroyGamepad();
        });
        knownGamepads = [];
    }

}
