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

exports.view = View = {
	Game: {},
	Board: {},
};

if (window.JoclyXdViewCleanup)
	window.JoclyXdViewCleanup();

(function () {

	window.JoclyXdViewCleanup = function () {
		var renderer = threeCtx && threeCtx.renderer;
		if (renderer) {
			renderer.forceContextLoss();
			renderer.context = null;
			renderer.domElement = null;
			delete threeCtx.renderer;
		}
		if (arStream)
			AR(null);
	}

	var area, currentSkin, logger, xdv, VSIZE, VHALF, htStateMachine, threeCtx = null,
		SCALE3D = 0.001, resourcesMap = {}, resources, arStream = null;

	// hack to ensure mouse and touch events do not collide
	var lastTouchStart = 0, lastJoclyclick = 0;

	/* ======================================== */

	var LOADING_TEXT_RESOURCE = "";

	if (typeof CustomEvent == "undefined") {
		function CustomEvent(event, params) {
			params = params || { bubbles: false, cancelable: false };
			var evt = document.createEvent('Event');
			evt.initEvent(event, params.bubbles, params.cancelable);
			return evt;
		};
		CustomEvent.prototype = window.Event.prototype;
		window.CustomEvent = CustomEvent;
	}

	var Class = function () {
	};
	(function () {
		var initializing = false, fnTest = /xyz/.test(function () {
		}) ? /\b_super\b/ : /.*/;
		Class.extend = function (prop) {
			var _super = this.prototype;
			initializing = true;
			var prototype = new this();
			initializing = false;
			for (var name in prop) {
				prototype[name] = typeof prop[name] == "function"
					&& typeof _super[name] == "function"
					&& fnTest.test(prop[name]) ? (function (name, fn) {
						return function () {
							var tmp = this._super;
							this._super = _super[name];
							var ret = fn.apply(this, arguments);
							this._super = tmp;
							return ret;
						};
					})(name, prop[name]) : prop[name];
			}
			function Class(args) {
				if (!initializing && this.init)
					if (arguments.length > 0 && args.jBlocksArgsList)
						this.init.apply(this, args);
					else
						this.init.apply(this, arguments);
			}
			Class.prototype = prototype;
			Class.prototype.constructor = Class;
			Class.extend = arguments.callee;
			return Class;
		};
	})();

	/* ======================================== */

	var WebRTC;
	var logResourcesLoad = false;

	function Log() {
		console.info.apply(console, arguments);
	}

	View.Board.Log = Log;
	View.Game.Log = Log;

	function HTStateMachine() { }
	HTStateMachine.prototype = new JHStateMachine();

	HTStateMachine.prototype.smError = function () {
		//console.info("=>",arguments);
	}
	HTStateMachine.prototype.smWarning = function () {
		//console.info("=>",arguments);
	};
	HTStateMachine.prototype.smDebug = function () {
		//console.info("=>",arguments);
	}

	function Diff(oOld, oNew) {
		var diff = {};
		var diffSet = false;
		for (var i in oNew) {
			if (oNew.hasOwnProperty(i)) {
				if (!oOld.hasOwnProperty(i)) {
					diff[i] = oNew[i];
					diffSet = true;
				} else if (typeof oNew[i] == "object") {
					var diff0 = Diff(oOld[i], oNew[i]);
					if (diff0) {
						diff[i] = diff0;
						diffSet = true;
					}
				} else if (oNew[i] != oOld[i]) {
					diff[i] = oNew[i];
					diffSet = true;
				}
			}
		}
		return diffSet ? diff : null;
	}

	var resLoadingMask = null;
	var resLoadingCount = 0;
	function IncrementResLoading() {
		if (resLoadingCount++ == 0) {
			resLoadingMask = $(".jocly-res-loading-mask");
			if (resLoadingMask.length == 0)
				resLoadingMask = $("<div/>").addClass("jocly-res-loading-mask").css({
					position: "absolute",
					top: 0,
					left: 0,
					width: $("body").width(),
					height: $("body").height(),
					"background-color": "rgba(0,0,0,.8)",
					"background-image": "url(" + LOADING_TEXT_RESOURCE + ")",
					"background-position": "center center",
					"background-repeat": "no-repeat",
					"z-index": 100000,
				}).appendTo($("body"));
			else
				resLoadingMask.show();
		}
	}
	function DecrementResLoading() {
		if (--resLoadingCount == 0) {
			if (resLoadingMask)
				resLoadingMask.hide();
		}
	}

	var materialMaps = {};
	function GetMaterialMap(map, callback) {
		var $this = this;
		if (materialMaps[map])
			callback(materialMaps[map]);
		else {
			var loader = new THREE.TextureLoader();
			loader.setCrossOrigin("anonymous");
			if (logResourcesLoad)
				console.log("Loading map", map);
			IncrementResLoading();
			loader.load(
				// ressource url
				map,
				// Function when resource is loaded
				function (texture) {
					materialMaps[map] = texture;
					if (logResourcesLoad)
						console.log("Loaded", map);
					DecrementResLoading();
					threeCtx.animControl.trigger();
					callback(materialMaps[map]);
				},
				// Function called when download progresses
				function (xhr) {
					//console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
				},
				// Function called when download errors
				function (xhr) {
					if (logResourcesLoad)
						console.log("(not) Loaded", map);
					DecrementResLoading();
					threeCtx.animControl.trigger();
					callback(null);
				});
		}
	}

	var pendingGetResource = [];
	function GetResource(res, callback) {
		var resource = resources[res];
		if (resource === undefined) {
			resource = resources[res] = {
				pending: [callback],
				status: "loading",
			}

			var getResFnt = null;
			var m = /^(.*\|)(.*?)$/.exec(res);
			if (m) {
				var prefix = m[1];
				var url = m[2];
				for (var r in resourcesMap) {
					var m2 = /^(.*\|)(.*?)$/.exec(r);
					if (m2)
						if (prefix == m[1] && url.substr(-m2[2].length) == m2[2]) {
							getResFnt = resourcesMap[r];
							break;
						}
				}
			}

			if (/^image\|/.test(res)) {
				var imgSrc = /^image\|(.*)/.exec(res)[1];
				if (logResourcesLoad)
					console.log("Loading resource", res);
				function HandleImage(image) {
					resource.image = image;
					if (logResourcesLoad)
						console.log("Loaded", res);
					resource.status = "loaded";
					resource.imgSrc = imgSrc;
					DecrementResLoading();
					for (var i = 0; i < resource.pending.length; i++)
						resource.pending[i](resource.image, imgSrc);
					resource.pending = null;
					if (threeCtx)
						threeCtx.animControl.trigger();
				}
				IncrementResLoading();
				if (getResFnt) {
					getResFnt(function (data) {
						var image = new Image();
						image.onload = function () {
							HandleImage(image);
						}
						image.src = data;
					});
				} else {
					var image = new Image();
					image.onload = function () {
						HandleImage(image)
					}
					image.src = imgSrc;
				}
			} else if (/^smoothedfilegeo\|/.test(res)) {
				if (logResourcesLoad)
					console.log("Loading resource", res);
				if (!threeCtx) {
					delete resources[res];
					pendingGetResource.push([res, callback]);
					return;
				}
				var m = /^smoothedfilegeo\|([^\|]*)\|(.*)$/.exec(res);
				var smooth = parseInt(m[1]);
				var file = m[2];
				IncrementResLoading();
				function HandleGeoMat(geometry, materials) {
					if (logResourcesLoad)
						console.log("Loaded", res);

					// not sure of the side effects here but this removes the console
					// warnings "THREE.DirectGeometry.fromGeometry(): Undefined vertexUv"
					for (var i = 0; i < geometry.faceVertexUvs.length; i++) {
						for (var j = 0; j < geometry.faceVertexUvs[i].length; j++) {
							var uv = geometry.faceVertexUvs[i][j];
							if (uv === undefined)
								geometry.faceVertexUvs[i][j] = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
						}
						for (; j < geometry.faces.length; j++)
							geometry.faceVertexUvs[i].push([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);
					}

					if (smooth > 0) {
						var modifier = new THREE.SubdivisionModifier(smooth);
						modifier.modify(geometry);
					}
					resource.status = "loaded";
					DecrementResLoading();
					resource.geometry = geometry;
					resource.materials = materials;
					for (var i = 0; i < resource.pending.length; i++)
						resource.pending[i](geometry, materials);
					resource.pending = null;
					threeCtx.animControl.trigger(3000);
				}
				if (getResFnt) {
					getResFnt(function (data) {
						try {
							var parsed = threeCtx.loader.parse(JSON.parse(data));
							HandleGeoMat(parsed.geometry, parsed.materials);
						} catch (e) {
							debugger;
						}
					});
				} else
					threeCtx.loader.load(file, HandleGeoMat);
			} else if (/^json\|/.test(res)) {
				if (logResourcesLoad)
					console.log("Loading resource", res);
				IncrementResLoading();
				var url = /^json\|(.*)/.exec(res)[1];
				function JSONResult(event, data) {
					if (logResourcesLoad)
						console.log("Loaded", res);
					var path = /^(\.)?(.*)$/.exec(url);
					if (data.url.substr(-path[2].length) == path[2]) {
						$(document).unbind("jocly.json-resource", JSONResult);
						resource.status = "loaded";
						DecrementResLoading();
						resource.data = data.data;
						for (var i = 0; i < resource.pending.length; i++)
							resource.pending[i](resource.data);
						resource.pending = null;
						if (threeCtx)
							threeCtx.animControl.trigger();
					} else
						console.warn("Expecting", url, "got", data.url)

				}
				$(document).bind("jocly.json-resource", JSONResult);
				$("<script/>").attr("type", "text/javascript").attr("jocly-type", "json-resource").attr("src", url).appendTo($("head"));
			} else if (/^json2\|/.test(res)) {
				if (logResourcesLoad)
					console.log("Loading resource", res);
				IncrementResLoading();
				var url = /^json2\|(.*)/.exec(res)[1];
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function () {
					if (xhr.readyState == XMLHttpRequest.DONE) {
						if (logResourcesLoad)
							console.log("Loaded", res);
						var data = JSON.parse(xhr.responseText);
						resource.status = "loaded";
						DecrementResLoading();
						resource.data = data;
						for (var i = 0; i < resource.pending.length; i++)
							resource.pending[i](resource.data);
						resource.pending = null;
						if (threeCtx)
							threeCtx.animControl.trigger();
					}
				}
				xhr.open('GET', url, true);
				xhr.send(null);

			} else if (/^font\|/.test(res)) {
				if (logResourcesLoad)
					console.info("font path", fontPath);
				var fontPath = /^font\|(.*)/.exec(res)[1];
				IncrementResLoading();
				var fontLoader = new THREE.FontLoader();
				fontLoader.load(fontPath, function (font) {
					DecrementResLoading();
					resource.status = "loaded";
					resource.font = font;
					for (var i = 0; i < resource.pending.length; i++)
						resource.pending[i](font);
					resource.pending = null;
					if (threeCtx)
						threeCtx.animControl.trigger();
				});
			}
		} else if (resource.status == "loading") {
			resource.pending.push(callback);
		} else {
			if (/^image\|/.test(res)) {
				callback(resource.image, resource.imgSrc);
			} else if (/^smoothedfilegeo\|/.test(res)) {
				callback(resource.geometry, resource.materials);
			} else if (/^json\|/.test(res)) {
				callback(resource.data);
			} else if (/^json2\|/.test(res)) {
				callback(resource.data);
			} else if (/^font\|/.test(res)) {
				callback(resource.font);
			}
		}
	}

	function ResumePendingResources() {
		if (threeCtx)
			while (pendingGetResource.length) {
				var call = pendingGetResource.shift();
				GetResource.call(null, call[0], call[1]);
			}
	}


	/* ======================================== */

	var XDView = Class.extend({
		init: function () {
			this.gadgets = {};
			this.resources = {};
			this.game = null;
			this.initDone = false;
			this.ratio = 0;
			this.center = null;
			this.getMaterialMap = GetMaterialMap;
		},
		createGadget: function (id, options) {
			if (this.ratio > 0) {
				if (options.base === undefined)
					options.base = {};
				options.base.ratio = this.ratio;
				options.base.center = this.center;
			}
			this.gadgets[id] = new Gadget(id, options);
		},
		updateGadget: function (id, options, delay, callback) {
			var gadget = this.gadgets[id];
			if (gadget) {
				if (arguments.length < 3 || delay === undefined)
					delay = 0;
				if (arguments.length < 4 || callback === undefined)
					callback = function () { }
				gadget.update(options, delay, callback);
			}
		},
		removeGadget: function (id) {
			var gadget = this.gadgets[id];
			if (gadget) {
				gadget.unbuild();
				delete this.gadgets[id];
			}
		},
		showGadget: function (id) {
			this.updateGadget(id, {
				base: {
					visible: true,
				},
			});
		},
		hideGadget: function (id) {
			this.updateGadget(id, {
				base: {
					visible: false,
				},
			});
		},
		updateArea: function (ratio, center) {
			this.ratio = ratio;
			this.center = center;
			for (var gi in this.gadgets)
				this.gadgets[gi].update({
					base: {
						ratio: ratio,
						center: center,
					},
				});
		},
		redisplayGadgets: function () {
			for (var gi in this.gadgets) {
				var gadget = this.gadgets[gi];
				gadget.update({});
			}
		},
		unbuildGadgets: function () {
			for (var gi in this.gadgets)
				this.gadgets[gi].unbuild();
		},
		saveGadgetProps: function (id, props, saveName) {
			var gadget = this.gadgets[id];
			if (gadget)
				gadget.saveProps(props, saveName);
		},
		restoreGadgetProps: function (id, saveName, delay, callback) {
			var gadget = this.gadgets[id];
			if (gadget)
				gadget.restoreProps(saveName, delay, callback);
			else if (callback)
				callback();
		},
		listScene: function () {
			console.log("listScene:");
			var accu = [];
			accu["faces"] = 0;
			//var crlf="<br>";
			var crlf = " :: ";
			var output = "========= Scene summary ===========";
			var nbLights = -1;


			function getFaces(obj, nbFaces) {
				if (obj.geometry) {
					var gg = obj.geometry;
					if (gg.faces) nbFaces += gg.faces.length;
				}
				if (obj.getDescendants) {
					var children = obj.getDescendants();
					if (children) nbFaces += getFaces(children, nbFaces);
				}
				return nbFaces;
			}
			if (threeCtx) if (threeCtx.scene) {
				var threeScene = threeCtx.scene;
				nbLights = threeScene.__lights.length;
				console.log(threeScene);
				var obj = threeScene.getDescendants();
				for (var o in obj) {
					var nbf = getFaces(obj[o], 0);
					accu["faces"] += nbf;
					//console.log(obj[o].name+" has "+nbf+" faces");
					/*if(obj[o].geometry){
						var gg=obj[o].geometry;
						if (gg.faces) accu["faces"]+=gg.faces.length;
						console.log(obj[o].name+" has "+gg.faces.length+" faces");
					}*/
				}
			}
			output += crlf + "nb lights: " + nbLights;
			output += crlf + "Nb faces: " + accu["faces"];
			console.log(output);
		},
	})

	/* ======================================== */

	function InitGlobals() {
		xdv = new XDView();
		VSIZE = 12600;
		VHALF = VSIZE / 2;
		htStateMachine = null;
		threeCtx = null;
		SCALE3D = 0.001;
		resourcesMap = {};
		resources = {};
		area = null;
		currentSkin = null;
		logger = null;
	}
	InitGlobals();

	/* ======================================== */

	var Gadget = Class.extend({
		init: function (id, options) {
			this.id = id;
			this.options = $.extend(true, {
				base: {
					visible: false,
				}
			}, options);
			this.avatar = null;
			this.savedProps = {};
		},
		mergeOptions: function () {
			return $.extend(true,
				{
					x: 0,
					y: 0,
					z: 0,
				},
				this.options.base,
				currentSkin["3d"] ? this.options["3d"] : this.options["2d"],
				this.options[currentSkin.name]);
		},
		build: function (options) {
			if (this.avatar)
				return;
			if (arguments.length == 0)
				options = this.mergeOptions();
		},
		unbuild: function () {
			if (this.avatar) {
				this.avatar.remove();
				this.avatar = null;
			}
		},
		canDisplay: function (options) {
			if (currentSkin === undefined || currentSkin === null)
				return false;
			if (arguments.length == 0)
				options = this.mergeOptions();
			return options.visible &&
				((!currentSkin["3d"] && options.ratio !== undefined && options.center !== undefined) ||
					(currentSkin["3d"] /* && 3D requirements */));
		},
		update: function (options, delay, callback) {
			if (arguments.length < 2 || delay === undefined)
				delay = 0;
			if (arguments.length < 3 || callback === undefined)
				callback = function () { };
			if (currentSkin !== undefined && currentSkin !== null) {
				var xdMap = currentSkin["3d"] ? "3d" : "2d";
				if (options.base)
					for (var i in options.base) {
						if (this.options[xdMap])
							delete this.options[xdMap][i];
						if (this.options[currentSkin.name])
							delete this.options[currentSkin.name][i];
					}
				if (options[xdMap])
					for (var i in options[xdMap])
						if (this.options[currentSkin.name])
							delete this.options[currentSkin.name][i];
				$.extend(true, this.options, options);
				var aOptions = this.mergeOptions();
				if (!this.avatar && this.canDisplay(aOptions)) {
					var avatarType = avatarTypes[aOptions.type];
					if (avatarType !== undefined)
						this.avatar = new avatarType(this, aOptions);
				}
				if (typeof delay == "object") {
					if (delay[currentSkin.name] !== undefined)
						delay = delay[currentSkin.name];
					else if (delay[xdMap] !== undefined)
						delay = delay[xdMap];
					else if (delay.base !== undefined)
						delay = delay.base;
					else
						delay = 0;
				}
				if (this.avatar)
					this.avatar.update(aOptions, delay, callback);
			} else
				$.extend(true, this.options, options);
		},
		saveProps: function (props, saveName) {
			var save = {};
			for (var oi in this.options) {
				var optCat = this.options[oi];
				for (var i in props) {
					var prop = props[i];
					if (optCat[prop] !== undefined) {
						save[oi] = save[oi] || {};
						save[oi][prop] = optCat[prop];
					}
				}
			}
			this.savedProps[saveName] = save;
		},
		restoreProps: function (saveName, delay, callback) {
			if (this.savedProps[saveName] !== undefined)
				this.update(this.savedProps[saveName], delay, callback);
			else if (callback)
				callback();
		},
	});

	/* ======================================== */

	var updateOp = 1;

	var GadgetAvatar = Class.extend({
		init: function (gadget, options) {
			this.gadget = gadget;
			this.options = options;
			this.SCALE3D = SCALE3D;
			this.animCounts = {};
		},
		remove: function () {
		},
		display: function (options) {
		},
		update: function (options, delay, callback) {
			var aOptions = $.extend(true, {}, this.options, options);
			aOptions.updateOp = updateOp++;
			aOptions.updateCallback = callback;
			this.display(aOptions, delay, callback);
			if (aOptions.visible)
				this.show();
			else
				this.hide();
			this.options = aOptions;
		},
		show: function () {
		},
		hide: function () {
		},
		animStart: function (options) {
			if (options === undefined) {
				console.error("animStart without options");
				debugger;
				return;
			}
			if (options.updateOp === undefined) {
				console.error("animStart without options");
				debugger;
				return;
			}
			if (this.object3d)
				this.object3d.matrixAutoUpdate = true;
			if (this.animCounts[options.updateOp] === undefined)
				this.animCounts[options.updateOp] = 1;
			else
				this.animCounts[options.updateOp]++;
		},
		animEnd: function (options) {
			if (options === undefined) {
				console.error("animEnd without options");
				debugger;
				return;
			}
			if (options.updateOp === undefined) {
				console.error("animEnd without options");
				debugger;
				return;
			}
			if (this.animCounts[options.updateOp] === undefined) {
				console.error("animEnd without animCount");
				debugger;
				return;
			}
			if (--this.animCounts[options.updateOp] == 0) {
				if (this.object3d)
					this.object3d.matrixAutoUpdate = false;
				options.updateCallback();
				delete this.animCounts[options.updateOp];
			}
		},
		getResource: GetResource,
	});

	var GadgetElement = GadgetAvatar.extend({
		init: function (gadget, options) {
			options = $.extend(true, {
				display: function () { },
			}, options);
			this._super.apply(this, arguments);
			this.options = $.extend(true, {
				x: 0,
				y: 0,
				z: 0,
				width: 1000,
				height: 1000,
				tag: "div",
				opacity: 1,
				rotate: 0,
				css: {},
			}, options);
			this.element = $("<" + this.options.tag + "/>").css({
				"position": "absolute",
				"z-index": this.options.z,
			}).hide().addClass("jocly-gadget").appendTo(area);
			if (this.options.initialClasses)
				this.element.addClass(this.options.initialClasses);
		},
		display: function (options, delay) {
			var $this = this;
			if (this.element) {
				this.displayElement.call(this, !this.displayCalled, options, delay);
				this.displayCalled = true;
			} else if (delay) {
				this.animStart(options);
				setTimeout(function () { $this.animEnd(options); }, delay);
			}
		},
		displayElement: function (force, options, delay) {
			var $this = this;
			this.element.css($.extend(true, this.options.css, options.css));
			if (
				force ||
				this.aWidth === undefined || this.aHeight === undefined ||
				options.ratio != this.options.ratio ||
				options.center.x != this.options.center.x ||
				options.center.y != this.options.center.y ||
				options.width != this.options.width ||
				options.height != this.options.height ||
				options.x != this.options.x ||
				options.y != this.options.y ||
				options.z != this.options.z
			) {
				this.aWidth = options.width * options.ratio;
				this.aHeight = options.height * options.ratio;
				var left = options.x * options.ratio + options.center.x - this.aWidth / 2;
				var top = options.y * options.ratio + options.center.y - this.aHeight / 2;
				if (delay) {
					this.animStart(options);
					this.element.css({
						"z-index": options.z,
					}).animate({
						width: this.aWidth,
						height: this.aHeight,
						left: left,
						top: top,
					}, delay, function () { $this.animEnd(options); });
				} else {
					this.element.css({
						width: this.aWidth,
						height: this.aHeight,
						left: left,
						top: top,
						"z-index": options.z,
					});
				}
				this.options.display(this.element, this.aWidth, this.aHeight);
			}
			if (force ||
				options.classes != this.options.classes) {
				if (this.options.classes)
					this.element.removeClass(this.options.classes);
				this.element.addClass(options.classes);
			}
			if (force ||
				options.click != this.options.click) {
				//this.element.unbind(JocGame.CLICK);
				this.element.unbind(JocGame.MOUSEMOVE_EVENT);
				this.element.unbind(JocGame.MOUSEDOWN_EVENT);
				this.element.unbind(JocGame.MOUSEUP_EVENT);
				if (options.click) {
					var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
					(function () {
						var mouseDown = false;
						var notified = false;
						var downPosition = [0, 0];
						$this.element.bind(JocGame.MOUSEDOWN_EVENT, function (event) {
							event.preventDefault();
							if (iOS && event.type == "mousedown")
								return;
							if (event.type == "touchstart")
								lastTouchStart = Date.now();
							if (event.type == "mousedown" && Date.now() - lastTouchStart < 500)
								return;
							mouseDown = true;
							downPosition = GetEventPosition(event);
						});
						$this.element.bind(JocGame.MOUSEUP_EVENT, function (event) {
							event.preventDefault();
							if (iOS && event.type == "mouseup")
								return;
							mouseDown = false;
							if (event.type == "joclyclick")
								lastJoclyclick = Date.now();
							if (event.type == "mouseup" && Date.now() - lastJoclyclick < 500)
								return;
							if (event.type == 'mouseup' || event.type == 'joclyclick') {
								options.click.call($this);
							} else {
								event.stopPropagation();
								var newevent = new CustomEvent("joclyclick", {});
								var x, y;
								if (event.originalEvent.changedTouches && event.originalEvent.changedTouches.length > 0) {
									x = event.originalEvent.changedTouches[0].pageX;
									y = event.originalEvent.changedTouches[0].pageY;
								} else if (event.originalEvent.touches && event.originalEvent.touches.length > 0) {
									x = event.originalEvent.touches[0].pageX;
									y = event.originalEvent.touches[0].pageY;
								} else {
									console.warn("Invalid touch event");
									return;
								}
								var target = document.elementFromPoint(x, y);
								target.dispatchEvent(newevent);
							}
						});
						$this.element.bind(JocGame.MOUSEMOVE_EVENT, function (event) {
							event.preventDefault();
							if (iOS && event.type == "mousemove")
								return;
							if (mouseDown && !notified) {
								var position = GetEventPosition(event);
								var dx = position[0] - downPosition[0];
								var dy = position[1] - downPosition[1];
								if (dx * dx + dy * dy > 100) {
									notified = true;
									options.click.call($this);
								}
							}
						});
					})();
				}
			}
			/*
			if(force ||
					options.holdClick != this.options.holdClick) {
				this.element.unbind("holdclick");
				if(options.holdClick)
					this.element.bind("holdclick",options.holdClick);
			}
			*/
			if (force ||
				options.rotate != this.options.rotate) {
				while (options.rotate < 0)
					options.rotate += 360;
				options.rotate %= 360;
				var rotate = options.rotate;
				var rotate0 = this.options.rotate;
				if (rotate - this.options.rotate > 180)
					rotate0 = 360;
				else if (this.options.rotate - rotate > 180)
					rotate += 360;
				if (delay) {
					this.animStart(options);
					$({ deg: rotate0 }).animate({ deg: rotate }, {
						step: function (now) {
							$this.element.css('transform', 'rotate(' + now + 'deg)');
						},
						duration: delay,
						complete: function () {
							$this.animEnd(options);
						},
					});
				} else
					this.element.css({
						"transform": "rotate(" + options.rotate + "deg)",
					});
			} else if (delay) {
				this.animStart(options);
				setTimeout(function () {
					$this.animEnd(options);
				}, 0);
			}
			if (force ||
				options.opacity != this.options.opacity) {
				if (delay) {
					this.animStart(options);
					this.element.stop().animate({
						"opacity": options.opacity,
					}, delay, function () { $this.animEnd(options); });
				} else
					this.element.css({
						"opacity": options.opacity,
					});
			}
		},
		show: function () {
			this.element.show();
		},
		hide: function () {
			this.element.hide();
		},
		remove: function () {
			this._super.apply(this, arguments);
			this.element.unbind(JocGame.CLICK);
			//this.element.unbind("holdclick");
			this.element.remove();
		},
	});

	var GadgetImage = GadgetElement.extend({
		displayElement: function (force, options) {
			var $this = this;
			this._super.apply(this, arguments);
			if (force || this.options.file != options.file) {
				this.options.file = options.file;
				GetResource("image|" + options.file, function (image, imgSrc) {
					if (imgSrc == $this.options.file)
						$this.element.css({
							"background-image": "url(" + image.src + ")",
							"background-size": "100% 100%",
							"background-repeat": "no-repeat",
						});
					else
						console.log("file has changed to", $this.options.file, "(", imgSrc, ")");
				});
			}
		},
	});

	var GadgetCanvas = GadgetElement.extend({
		init: function (gadget, options) {
			options = $.extend({
				tag: "canvas",
				draw: function () { },
			}, options);
			this._super.call(this, gadget, options);
			this.canvasContext = this.element[0].getContext("2d");
		},
		displayElement: function (force, options) {
			this._super.apply(this, arguments);
			this.element.attr("width", this.aWidth).attr("height", this.aHeight);
			//this.canvasContext.save();
			this.canvasContext.clearRect(0, 0, options.width, options.height);
			this.canvasContext.translate(this.aWidth / 2, this.aHeight / 2);
			this.canvasContext.scale(options.ratio, options.ratio);
			this.options.draw.call(this, this.canvasContext, 1 / options.ratio);
			//this.canvasContext.restore();
		}
	});

	var GadgetHexagon = GadgetCanvas.extend({
		init: function (gadget, options) {
			var $this = this;
			var R = options.radius;
			var L = R * Math.sqrt(3) / 2;
			options = $.extend({
				lineWidthFactor: 1,
			}, options, {
					draw: function (ctx, pixSize) {
						ctx.lineWidth = pixSize * $this.options.lineWidthFactor;
						ctx.beginPath();
						ctx.moveTo(-L, L / 2);
						ctx.lineTo(0, R);
						ctx.lineTo(L, L / 2);
						ctx.lineTo(L, -L / 2);
						ctx.lineTo(0, -R);
						ctx.lineTo(-L, -L / 2);
						ctx.closePath();
						if ($this.options.strokeStyle) {
							ctx.strokeStyle = $this.options.strokeStyle;
							ctx.stroke();
						}
						if ($this.options.fillStyle) {
							ctx.fillStyle = $this.options.fillStyle;
							ctx.fill();
						}
					},
				});
			this._super.call(this, gadget, options);
			this.element.attr("width", options.width).attr("height", options.height);
			this.canvasContext = this.element[0].getContext("2d");
		},
	});

	/*
	var GadgetSprite=GadgetCanvas.extend({
		init: function(gadget,options) {
			this._super.apply(this,arguments);
			this.displayArgs=null;
		},
		displayElement: function(force,options) {
			var $this=this;
			this._super.apply(this,arguments);
			if(force || this.options.file!=options.file) {
				GetResource("image|"+options.file, function(image) {
					$this.image=image;
					if($this.displayArgs && $this.options.clipx!==undefined && $this.options.clipy!==undefined && 
							$this.options.clipwidth!==undefined && $this.options.clipheight!==undefined)
						$this.drawImage.apply($this,$this.displayArgs);
				});
			}
			if(force || this.options.clipx!=options.clipx
					|| this.options.clipy!=options.clipy
					|| this.options.clipwidth!=options.clipwidth
					|| this.options.clipheight!=options.clipheight
					) {
				if(this.image && options.clipx!==undefined && options.clipy!==undefined && 
						options.clipwidth!==undefined && options.clipheight!==undefined) {
					this.drawImage.call(this,force,options);
				} else 
					this.displayArgs=arguments;
			}
			if(this.image && options.clipx!==undefined && options.clipy!==undefined && 
					options.clipwidth!==undefined && options.clipheight!==undefined)
				this.drawImage.apply(this,arguments);
			else
				this.displayArgs=arguments;
		},
		drawImage: function(force,options) {
			this.canvasContext.save();
			var x0=parseInt(options.clipx+.5);
			var y0=parseInt(options.clipy+.5);
			var cx0=parseInt(options.clipwidth+.5);
			var cy0=parseInt(options.clipheight+.5);
			var x1=0;
			var y1=0;
			var cx1=parseInt(this.aWidth+.5);
			var cy1=parseInt(this.aHeight+.5);
			
			this.canvasContext.scale(cx1,cy1);
			this.canvasContext.imageSmoothingEnabled=true;
        	
			this.canvasContext.drawImage(this.image,x0,y0,cx0,cy0,x1,y1,1,1);
			//this.canvasContext.drawImage(this.image,x0,y0,cx0,cy0,x1,y1,cx1,cy1);
			this.canvasContext.restore();
			this.displayArgs=null;
		},
	});
	*/

	var GadgetSprite = GadgetCanvas.extend({
		init: function (gadget, options) {
			this._super.apply(this, arguments);
			this.displayArgs = null;
		},
		displayElement: function (force, options) {
			var $this = this;
			this._super.apply(this, arguments);
			if (force || this.options.file != options.file) {
				GetResource("image|" + options.file, function (image, imgSrc) {
					if (imgSrc == $this.options.file) {
						$this.image = image;
						$this.element.css({
							"background-image": "url(" + image.src + ")",
							"background-size": "100% 100%",
							"background-repeat": "no-repeat",
						});
					}
					if ($this.displayArgs && $this.options.clipx !== undefined && $this.options.clipy !== undefined &&
						$this.options.clipwidth !== undefined && $this.options.clipheight !== undefined)
						$this.drawImage.apply($this, $this.displayArgs);
				});
			}
			if (force || this.options.clipx != options.clipx
				|| this.options.clipy != options.clipy
				|| this.options.clipwidth != options.clipwidth
				|| this.options.clipheight != options.clipheight
			) {
				if (this.image && options.clipx !== undefined && options.clipy !== undefined &&
					options.clipwidth !== undefined && options.clipheight !== undefined) {
					this.drawImage.call(this, force, options);
				} else
					this.displayArgs = arguments;
			}
			if (this.image && options.clipx !== undefined && options.clipy !== undefined &&
				options.clipwidth !== undefined && options.clipheight !== undefined)
				this.drawImage.apply(this, arguments);
			else
				this.displayArgs = arguments;
		},
		drawImage: function (force, options) {
			var rx = (options.clipwidth / this.aWidth);
			var ry = (options.clipheight / this.aHeight);
			var bcx = parseInt(this.image.width / rx + .5);
			var bcy = parseInt(this.image.height / ry + .5);
			var bs = "" + bcx + "px " + bcy + "px";
			this.element.css({
				"width": parseInt(this.aWidth + .5),
				"height": parseInt(this.aHeight + .5),
				"background-image": options.file,
				"background-size": bs,
				"background-position": "-" + (parseInt(options.clipx / rx + .5)) + "px -" + (parseInt(options.clipy / ry + .5)) + "px",
			});
		},
	});

	var GadgetDisk = GadgetElement.extend({
		init: function (gadget, options) {
			this._super.apply(this, arguments);
		},
		displayElement: function (force, options) {
			this._super.apply(this, arguments);
			this.element.css({
				"border-radius": "50%",
			});
		},
	});

	var GadgetObject3D = GadgetAvatar.extend({
		init: function (gadget, options) {
			var $this = this;
			this._super.apply(this, arguments);
			this.displayCalled = false;
			this.options = $.extend(true, {
				x: 0.0,
				y: 0.0,
				z: 0.0,
				color: null,
				castShadow: true,
				receiveShadow: false,
				harbor: true,
			}, options);
			this.createObject();
		},
		createObject: function () {
		},
		objectReady: function (object3d) {
			var $this = this;
			this.object3d = object3d;
			object3d.castShadow = this.options.castShadow;
			object3d.receiveShadow = this.options.receiveShadow;
			object3d.name = this.gadget.id;
			object3d.matrixAutoUpdate = false;
			this.shouldUpdate = true;
			this.update(this.options);
			//object3d.visible=this.options.visible;
			if (this.options.harbor)
				threeCtx.harbor.add(object3d);
			else
				threeCtx.scene.add(object3d);
		},
		display: function (options, delay) {
			var $this = this;
			if (this.object3d) {
				this.shouldUpdate = false;
				this.displayObject3D.call(this, !this.displayCalled, options, delay);
				this.displayCalled = true;
				if (this.shouldUpdate)
					this.object3d.updateMatrix();
			}
			if (delay) {
				$this.animStart(options);
				setTimeout(function () { $this.animEnd(options); }, delay);
			}
		},
		displayObject3D: function (force, options, delay) {
			var $this = this;
			threeCtx.animControl.trigger((isNaN(delay) ? 0 : delay) + 200);
			if (force ||
				options.x != this.options.x ||
				options.y != this.options.y ||
				options.z != this.options.z
			) {
				this.shouldUpdate = true;
				if (delay) {
					this.animStart(options);
					new TWEEN.Tween(this.object3d.position).to({
						x: options.x * SCALE3D,
						y: options.z * SCALE3D,
						z: options.y * SCALE3D,
					}, delay).easing(options.positionEasing ? options.positionEasing : TWEEN.Easing.Cubic.EaseInOut).onComplete(function () {
						$this.animEnd(options);
					}).onUpdate(function (ratio) {
						if (options.positionEasingUpdate)
							options.positionEasingUpdate.call($this, ratio);
					}).start();
				} else {
					this.object3d.position.x = options.x * SCALE3D;
					this.object3d.position.y = options.z * SCALE3D;
					this.object3d.position.z = options.y * SCALE3D;
				}
			}
			if (force ||
				options.click != this.options.click) {
				if (this.options.click)
					this.object3d.off("mouseup");
				if (options.click) {
					//if(!threeCtx.cameraControls.hasBeenDragged())
					this.object3d.on("mouseup", function () {
						//if(!threeCtx.cameraControls.hasBeenDragged())
						options.click.call();
					});
				}
			}
			/*
			if(force || 
					options.holdClick != this.options.holdClick) {
				if(this.options.holdClick)
					this.object3d.off("holdclick");
				if(options.holdClick) {
					//if(!threeCtx.cameraControls.hasBeenDragged())
						this.object3d.on("holdclick",function(eventData){
							if(!threeCtx.cameraControls.hasBeenDragged())
								options.holdClick.call($this,eventData);
							}
						);
				}
			}
			*/
			if (force ||
				options.castShadow != this.options.castShadow) {
				this.object3d.castShadow = options.castShadow
			}
			if (force ||
				options.receiveShadow != this.options.receiveShadow) {
				this.object3d.receiveShadow = options.receiveShadow
			}
		},
		show: function () {
			if (arStream && !this.options.harbor)
				return this.hide();
			if (this.object3d) {
				this.object3d.visible = true;
				if (this.object3d.children) {
					for (var c = 0; c < this.object3d.children.length; c++) {
						var part = this.object3d.children[c];
						if (part.joclyVisible === undefined || part.joclyVisible)
							part.visible = true;
						else
							part.visible = false;
					}
				}
			}
		},
		hide: function () {
			if (this.object3d) {
				this.object3d.visible = false;
				if (this.object3d.children) {
					for (var c = 0; c < this.object3d.children.length; c++)
						this.object3d.children[c].visible = false;
				}
			}
		},
		remove: function () {
			this._super.apply(this, arguments);
			if (this.object3d) {
				if (this.options.click)
					this.object3d.off("mouseup");
				/*
				if(this.options.holdClick)
					this.object3d.off("holdclick");
				*/
				if (this.object3d.parent)
					this.object3d.parent.remove(this.object3d);
				this.object3d = null;
			}
		},
		getMaterialMap: GetMaterialMap,
	});

	var GadgetMesh = GadgetObject3D.extend({
		init: function (gadget, options) {
			options = $.extend(true, {
				rotate: 0,
				rotateX: 0,
				rotateY: 0,
				scale: [1, 1, 1],
				materials: {},
				smooth: 0,
				opacity: 1,
				flatShading: false,
				morphing: [],
			}, options, {
				});
			this._super.call(this, gadget, options);
		},
		displayObject3D: function (force, options, delay) {
			var $this = this;
			this._super.apply(this, arguments);
			if (force ||
				options.rotate != this.options.rotate ||
				options.rotateX != this.options.rotateX ||
				options.rotateY != this.options.rotateY
			) {
				this.shouldUpdate = true;
				var delta = options.rotate - this.options.rotate;
				if (delta > 180)
					options.rotate -= 360;
				else if (delta < -180)
					options.rotate += 360;
				delta = options.rotateX - this.options.rotateX;
				if (delta > 180)
					options.rotateX -= 360;
				else if (delta < -180)
					options.rotateX += 360;
				delta = options.rotateY - this.options.rotateY;
				if (delta > 180)
					options.rotateY -= 360;
				else if (delta < -180)
					options.rotateY += 360;
				if (delay) {
					this.animStart(options);
					new TWEEN.Tween(this.object3d.rotation).to({
						x: options.rotateX * (Math.PI / 180),
						y: options.rotate * (Math.PI / 180),
						z: options.rotateY * (Math.PI / 180),
					}, delay).easing(options.rotateEasing ? options.rotateEasing : TWEEN.Easing.Cubic.EaseInOut).onComplete(function () {
						$this.animEnd(options);
					}).start();
				} else {
					this.object3d.rotation.x = options.rotateX * (Math.PI / 180);
					this.object3d.rotation.y = options.rotate * (Math.PI / 180);
					this.object3d.rotation.z = options.rotateY * (Math.PI / 180);
				}
			}
			if (force ||
				options.scale[0] != this.options.scale[0] ||
				options.scale[1] != this.options.scale[1] ||
				options.scale[2] != this.options.scale[2]
			) {
				this.shouldUpdate = true;
				if (delay) {
					this.animStart(options);
					new TWEEN.Tween(this.object3d.scale).to({
						x: options.scale[0],
						y: options.scale[2],
						z: options.scale[1],
					}, delay).easing(options.scaleEasing ? options.scaleEasing : TWEEN.Easing.Cubic.EaseInOut).onComplete(function () {
						$this.animEnd(options);
					}).start();
				} else {
					this.object3d.scale.set(options.scale[0], options.scale[2], options.scale[1]);
					/*if ((options.scale[0] > 0) &&
						(options.scale[1] > 0) &&
						(options.scale[2] > 0)
					)
						this.object3d.scale.set(options.scale[0],options.scale[2],options.scale[1]);
					else{
						var g=this.object3d.geometry;
						g.dynamic = true;
						for(var i = 0; i<g.faces.length; i++) {
						    g.faces[i].normal.x = -1*g.faces[i].normal.x;
						    g.faces[i].normal.y = -1*g.faces[i].normal.y;
						    g.faces[i].normal.z = -1*g.faces[i].normal.z;
						}
						g.computeVertexNormals();
						g.computeFaceNormals();
						g.applyMatrix(new THREE.Matrix4().makeScale( options.scale[0], options.scale[2], options.scale[1] ) );						
					}*/
				}
			}
			if (force ||
				options.color != this.options.color
			) {
				if (this.object3d.material && this.object3d.material.color !== undefined)
					if (options.color !== null)
						this.object3d.material.color.setHex(options.color);

				/*
									if(options.color===null)
										this.object3d.material.color.setHex(0xffffff);
									else 
										this.object3d.material.color.setHex(options.color);
				*/
			}
			if (force ||
				options.opacity != this.options.opacity
			) {
				if (this.object3d.material && this.object3d.material.opacity !== undefined) {
					if (options.opacity === null)
						options.opacity = 1;
					if (delay) {
						this.animStart(options);
						new TWEEN.Tween(this.object3d.material).to({
							opacity: options.opacity,
						}, delay).easing(options.opacityEasing ? options.opacityEasing : TWEEN.Easing.Cubic.EaseInOut).onComplete(function () {
							$this.animEnd(options);
						}).start();
					} else
						this.object3d.material.opacity = options.opacity;

				}
			}
			if (force ||
				options.morphing.toString() != this.options.morphing.toString()
			) {
				this.shouldUpdate = true;
				if (options.morphing.length > 0) {
					if (this.object3d.material && this.object3d.material.materials &&
						this.object3d.material.materials.length > 0 && !this.object3d.material.materials[0].morphTargets) {
						for (var i = 0; i < this.object3d.material.materials.length; i++)
							this.object3d.material.materials[i].morphTargets = true;
					}
					if (delay) {
						this.animStart(options);
						new TWEEN.Tween(this.object3d.morphTargetInfluences).to(options.morphing,
							delay).easing(options.morphingEasing ? options.morphingEasing : TWEEN.Easing.Cubic.EaseInOut).onComplete(function () {
								$this.animEnd(options);
							}).start();
					} else {
						for (var i = 0; i < options.morphing.length && i < this.object3d.morphTargetInfluences.length; i++)
							this.object3d.morphTargetInfluences[i] = options.morphing[i];
					}
				}
			}
			if (this.object3d.material && options.materials) {
				if (force) {
					if (this.object3d.material.materials) {
						for (var m in this.object3d.material.materials) {
							var mat = $this.object3d.material.materials[m];
							if (options.materials[mat.name]) {
								for (var mpi in options.materials[mat.name]) {
									var newMatProp = options.materials[mat.name][mpi];
									(function (mat, mpi) {
										if (mpi == "map") {
											GetMaterialMap(newMatProp, function (matMpi) {
												mat[mpi] = matMpi;
												mat.needsUpdate = true;
											});
										} else if (mpi == "color") {
											if (typeof mat["ambient"] != "undefined")
												mat["ambient"].setHex(newMatProp);
											mat[mpi].setHex(newMatProp);
										}
										else
											mat[mpi] = newMatProp;
									})(mat, mpi, m);
								}
							}
						}
					}
				} else {
					var diffMat = Diff(this.options.materials, options.materials);
					if (diffMat) {
						for (var mi in diffMat) {
							var newMat = diffMat[mi];
							if (this.object3d.material.materials) {
								for (var m in this.object3d.material.materials) {
									var mat = $this.object3d.material.materials[m];
									if (mat.name == mi) {
										if (newMat) {
											for (var mpi in newMat) {
												var newMatProp = newMat[mpi];
												if (newMatProp !== null) {
													(function (mat, mpi) {
														if (mpi == "map")
															GetMaterialMap(newMatProp, function (matMpi) {
																mat[mpi] = matMpi;
																mat.needsUpdate = true;
															});
														else if (mpi == "color") {
															if (typeof mat["ambient"] != "undefined")
																mat["ambient"].setHex(newMatProp);
															mat[mpi].setHex(newMatProp);
														} else {
															if (delay) {
																$this.animStart(options);
																if (mat[mpi] === undefined || isNaN(newMatProp)) {
																	mat[mpi] = newMatProp;
																	setTimeout(function () {
																		$this.animEnd(options);
																	});
																} else {
																	var change = {};
																	change[mpi] = newMatProp;
																	new TWEEN.Tween(mat).to(change, delay).easing(options.materialEasing ? options.materialEasing :
																		TWEEN.Easing.Cubic.EaseInOut).onComplete(function () {
																			$this.animEnd(options);
																		}).start();
																}
															} else
																mat[mpi] = newMatProp;
														}
													})(mat, mpi);
												} else
													delete mat[mpi];
											}
										} else {
											delete mat.map;
											delete mat.opacity;
											delete mat.color;
										}
									}
								}
							}
						}
					}
				}
			}
		},
	});

	var GadgetCustomMesh3D = GadgetMesh.extend({
		init: function (gadget, options) {
			options = $.extend(true, {
				create: function () { return null },
				display: function () { },
			}, options, {
				});
			this._super.call(this, gadget, options);
		},
		createObject: function () {
			var $this = this;
			function Callback(object3d) {
				$this.objectReady(object3d);
			}
			var object3d = this.options.create.call(this, Callback);
			if (object3d)
				this.objectReady(object3d);
		},
		displayObject3D: function (force, options, delay) {
			this._super.apply(this, arguments);
			this.options.display.call(this, force, options, delay);
		},
		replaceMesh: function (mesh, options, delay) {
			if (this.object3d) {
				if (this.options.click)
					this.object3d.off("mouseup");
				/*
				if(this.options.holdClick)
					this.object3d.off("holdclick");
				*/
				if (this.object3d.parent)
					this.object3d.parent.remove(this.object3d);
			}
			this.object3d = mesh;
			if (this.options.visible)
				this.show();
			else
				this.hide();
			if (this.options.harbor)
				threeCtx.harbor.add(this.object3d);
			else
				threeCtx.scene.add(this.object3d);
			if (delay) {
				this.displayObject3D(true, this.options);
				this.displayObject3D(true, options, delay);
			} else
				this.displayObject3D(true, options);
		},
	});

	var GadgetPlane3D = GadgetMesh.extend({
		init: function (gadget, options) {
			options = $.extend(true, {
				display: function () { },
				sx: 1000,
				sy: 1000,
				color: 0xffffff,
				horizontal: true,
				texture: null,
				material: "basic",
				side: null,

			}, options, {
				});
			this._super.call(this, gadget, options);
		},
		createObject: function () {
			var gg = new THREE.PlaneGeometry(this.options.sx * SCALE3D, this.options.sy * SCALE3D, 1, 1);
			var matData = {
				color: this.options.data,
				opacity: 0,
			}
			if (this.options.texture) {
				var tOptions = this.options.texture;
				if (tOptions.file) {
					GetMaterialMap(tOptions.file, function (texture) {
						if (tOptions.wrapS !== undefined)
							texture.wrapS = tOptions.wrapS;
						if (tOptions.wrapT !== undefined)
							texture.wrapT = tOptions.wrapT;
						if (tOptions.repeat)
							texture.repeat.set.apply(texture.repeat, tOptions.repeat);
						matData.map = texture;
					});
				}
			}
			if (this.options.side !== undefined)
				matData.side = this.options.side;
			if (this.options.transparent !== undefined)
				matData.transparent = this.options.transparent;
			var gm;
			switch (this.options.material) {
				case "phong":
					gm = new THREE.MeshPhongMaterial(matData);
					break;
				default:
					gm = new THREE.MeshBasicMaterial(matData);
			}
			var mesh = new THREE.Mesh(gg, gm);
			this.objectReady(mesh);
		},
	});

	// should this class be obsoleted in favor of GadgetCustomMesh3D
	var GadgetCustom3D = GadgetObject3D.extend({
		init: function (gadget, options) {
			options = $.extend(true, {
				create: function () { return null },
				display: function () { },
			}, options, {
				});
			this._super.call(this, gadget, options);
		},
		createObject: function () {
			var $this = this;
			function Callback(object3d) {
				$this.objectReady(object3d);
			}
			var object3d = this.options.create.call(this, Callback);
			if (object3d)
				this.objectReady(object3d);
		},
		displayObject3D: function (force, options, delay) {
			this._super.apply(this, arguments);
			this.options.display.call(this, force, options, delay);
		},
	});

	var GadgetMeshFile = GadgetMesh.extend({
		init: function (gadget, options) {
			this._super.apply(this, arguments);
			this.meshFileForceDisplay = false;
		},
		createObject: function () {
			var $this = this;
			var file = this.options.file;
			var smooth = this.options.smooth;
			GetResource("smoothedfilegeo|" + this.options.smooth + "|" + file, function (geometry, materials) {
				if (file != $this.options.file)
					return;
				var materials0 = []
				for (var i = 0; i < materials.length; i++)
					materials0.push(materials[i].clone());
				materials = materials0;
				if ($this.options.flatShading)
					for (var m = 0; m < materials.length; m++) {
						materials[m].shading = THREE.FlatShading;
					}
				var mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
				$this.objectReady(mesh);
				if ($this.meshFileForceDisplay) {
					$this.displayObject3D(true, $this.meshFileForceDisplay);
					$this.meshFileForceDisplay = false;
				}
			});
		},
		displayObject3D: function (force, options, delay) {
			var fileChange = (options.file != this.options.file);
			if (fileChange) {
				options.click = null;
				//options.holdClick=null;
			}
			this._super.apply(this, arguments);
			if (fileChange) {
				if (this.object3d) {
					if (this.options.click)
						this.object3d.off("mouseup");
					/*
					if(this.options.holdClick)
						this.object3d.off("holdclick");
					*/
					if (this.object3d.parent)
						this.object3d.parent.remove(this.object3d);
					this.object3d = null;
				}
				this.options.file = options.file;
				this.meshFileForceDisplay = options;
				this.createObject();
			}
		},
	});

	var Gadget3DVideo = GadgetMesh.extend({
		init: function (gadget, options) {
			options = $.extend(true, {
				scale: [1, 1, 1],
				playerSide: 1,
				makeMesh: function (videoTexture, ccvVideoTexture) {
					var material = new THREE.MeshBasicMaterial({
						map: videoTexture,
						overdraw: true,
						// side:THREE.DoubleSide
					});
					var geometry = new THREE.PlaneGeometry(12, 9, 1, 1);
					var mesh = new THREE.Mesh(geometry, material);

					return mesh;
				},
				videoPlaying: function (on) {
				},
				ccvLocked: function (on) {
				},
				ccv: false,
				ccvMargin: [.10, .10, .30, .10],
				ccvWidth: 80,
				ccvHeight: 60,
				hideBeforeFirstLock: true,
			}, options);
			this._super.call(this, gadget, options);
			this.videoConnected = false;
			this.videoErrorCount = 0;
			this.videoSkipError = false;
			this.shouldBeVisible = false;
			this.gotFirstLock = false;
		},
		objectReady: function (mesh) {
			mesh.visible = false;
			for (var i = 0; i < mesh.children.length; i++)
				mesh.children[i].visible = false;
			this.streamReady(Gadget3DVideo.isStreamReady(this.options.playerSide));
			this._super.apply(this, arguments);
		},
		createObject: function () {
			Gadget3DVideo.addAvatar(this, this.options.playerSide);
			var ccvTexture = null;
			if (this.ccvContextKey)
				ccvTexture = Gadget3DVideo.getCCVVideoTexture(this.options.playerSide, this.ccvContextKey)
			var mesh = this.options.makeMesh.call(this,
				Gadget3DVideo.getVideoTexture(this.options.playerSide), ccvTexture);
			if (mesh)
				this.objectReady(mesh);
		},
		remove: function () {
			Gadget3DVideo.removeAvatar(this, this.options.playerSide);
			this._super.apply(this, arguments);
		},
		show: function () {
			this.shouldBeVisible = true;
			if (this.videoConnected && (this.options.ccv == false || this.gotFirstLock || !this.options.hideBeforeFirstLock))
				this._super();
		},
		hide: function () {
			this.shouldBeVisible = false;
			this._super();
		},
		streamReady: function (on) {
			this.videoConnected = on;
			if (on)
				this.show();
			else
				this.hide();
		},
		ccvLocked: function (locked) {
			if (locked && this.shouldBeVisible) {
				this.gotFirstLock = true;
				this.show();
			}
			this.options.ccvLocked(locked);
		},
	});

	Gadget3DVideo.streams = {};
	Gadget3DVideo.avatars = { "1": [], "-1": [] };
	Gadget3DVideo.textures = { "1": null, "-1": null };
	Gadget3DVideo.renderLoopHooked = false;
	Gadget3DVideo.ccvLibRequested = false;
	Gadget3DVideo.getStream = function (playerSide) {
		if (!this.streams[playerSide]) {
			var vStream = {
				stream: null,
				avatars: this.avatars[playerSide],
				video: null,
				videoImage: null,
				videoContext: null,
				videoTexture: null,
				streamReady: false,
				ownVideoElement: false,
				errorCount: 0,
				loopCount: 0,
				local: false,
				ccvVideoImage: null,
				ccvInProgress: false,
				ccvLock: null,
				ccvContexts: {},
				ccvLastAnalyzed: null,
				ccvLastSuccess: null,
			}
			var video = $("video[joclyhub-video='" + playerSide + "']");
			if (video.length > 0) {
				vStream.video = video;
			} else {
				vStream.ownVideoElement = true;
				vStream.video = $("<video/>").attr("autoplay", "autoplay").width(
					160).height(120).css({
						visibility: "hidden",
						position: "absolute",
						"z-index": -1,
						top: 0,
					}).attr("joclyhub-video", playerSide).appendTo("body");
			}
			var canvas = $("canvas[joclyhub-video-canvas='" + playerSide + "']");
			if (canvas.length > 0) {
				vStream.videoImage = canvas;
				if (this.textures[playerSide])
					vStream.videoTexture = this.textures[playerSide];
				else {
					vStream.videoTexture = new THREE.Texture(vStream.videoImage[0]);
					this.textures[playerSide] = vStream.videoTexture;
				}
			} else {
				vStream.videoImage = this.makeCanvas(160, 120).attr("joclyhub-video-canvas", playerSide);
				vStream.videoTexture = new THREE.Texture(vStream.videoImage[0]);
				this.textures[playerSide] = vStream.videoTexture;
			}
			vStream.videoTexture.minFilter = THREE.LinearFilter;
			vStream.videoTexture.magFilter = THREE.LinearFilter;
			vStream.videoImageContext = vStream.videoImage[0].getContext('2d');
			this.streams[playerSide] = vStream;
		}
		return this.streams[playerSide];
	}
	Gadget3DVideo.addStream = function (playerSide, stream, local) {
		var $this = this;
		var vStream = this.getStream(playerSide);
		vStream.stream = stream;
		vStream.local = local;
		if (threeCtx)
			threeCtx.animControl.trigger(3000);
		if (!this.renderLoopHooked) {
			this.renderLoopHooked = true;
			if (threeCtx)
				threeCtx.animateCallbacks["Gadget3DVideo"] = {
					_this: $this,
					callback: $this.animate,
				}
		}
	}
	Gadget3DVideo.removeStream = function (playerSide) {
		var vStream = this.streams[playerSide];
		if (vStream) {
			if (vStream.streamReady)
				for (var i = 0; i < vStream.avatars.length; i++)
					vStream.avatars[i].streamReady(false);
			if (vStream.ccvLastSuccess)
				vStream.ccvLastSuccess.videoImage.remove();
			if (vStream.ccvLastAnalyzed)
				vStream.ccvLastAnalyzed.remove();
			delete this.streams[playerSide];
			if (this.renderLoopHooked) {
				var streamCount = 0;
				for (var s in this.streams)
					streamCount++;
				if (streamCount == 0) {
					if (threeCtx)
						delete threeCtx.animateCallbacks["Gadget3DVideo"];
					this.renderLoopHooked = false;
				}
			}
		}
	}
	Gadget3DVideo.addAvatar = function (avatar, playerSide) {
		this.avatars[playerSide].push(avatar);
		var vStream = this.getStream(playerSide);
		if (!avatar.ccvContextKey)
			avatar.ccvContextKey = "" + avatar.options.ccvWidth + "," + avatar.options.ccvHeight + "," + JSON.stringify(avatar.options.ccvMargin);
		if (!vStream.ccvContexts[avatar.ccvContextKey]) {
			var ccvContext = {
				width: avatar.options.ccvWidth,
				height: avatar.options.ccvHeight,
				margin: avatar.options.ccvMargin,
			}
			ccvContext.videoImage = this.makeCanvas(ccvContext.width, ccvContext.height);
			ccvContext.videoImageContext = ccvContext.videoImage[0].getContext('2d');
			ccvContext.videoImageContext.fillStyle = "rgb(0,255,0)";
			ccvContext.videoImageContext.fillRect(0, 0, ccvContext.width, ccvContext.height);
			ccvContext.videoTexture = new THREE.Texture(ccvContext.videoImage[0]);
			ccvContext.videoTexture.minFilter = THREE.LinearFilter;
			ccvContext.videoTexture.magFilter = THREE.LinearFilter;
			ccvContext.videoTexture.needsUpdate = true;
			vStream.ccvContexts[avatar.ccvContextKey] = ccvContext;
			//debugger;
		}
		return vStream.streamReady;
	}
	Gadget3DVideo.getVideoTexture = function (playerSide) {
		var vStream = this.streams[playerSide];
		if (vStream)
			return vStream.videoTexture;
		else
			return null;
	}
	Gadget3DVideo.getCCVVideoTexture = function (playerSide, contextKey) {
		var vStream = this.streams[playerSide];
		if (vStream) {
			var ccvContext = vStream.ccvContexts[contextKey];
			if (ccvContext)
				return ccvContext.videoTexture;
		}
		return null;
	}
	Gadget3DVideo.isStreamReady = function (playerSide) {
		return this.streams[playerSide] && this.streams[playerSide].streamReady;
	}
	Gadget3DVideo.isCCVLocked = function (playerSide) {
		return this.streams[playerSide] && this.streams[playerSide].ccvLock;
	}
	Gadget3DVideo.removeAvatar = function (avatar, playerSide) {
		var vStream = this.streams[playerSide];
		if (vStream)
			for (var i = 0; i < vStream.avatars.length; i++)
				if (avatar == vStream.avatars[i]) {
					vStream.avatars.splice(i, 1);
					break;
				}
	}
	Gadget3DVideo.animate = function () {
		for (var side in this.streams) {
			var vStream = this.streams[side];
			try {
				vStream.loopCount++;
				if (vStream.video[0].getAttribute("webrtc-attached") === "1" &&
					vStream.video[0].readyState === vStream.video[0].HAVE_ENOUGH_DATA) {
					vStream.videoImageContext.drawImage(vStream.video[0], 0, 0,
						vStream.videoImage[0].width, vStream.videoImage[0].height);
					if (vStream.videoTexture) {
						vStream.videoTexture.needsUpdate = true;
						if (!vStream.streamReady) {
							vStream.streamReady = true;
							for (var i = 0; i < vStream.avatars.length; i++)
								vStream.avatars[i].streamReady(true);
						}
					}
					var ccvLocalRequested = false;
					var ccvRequested = false;
					for (var i = 0; i < vStream.avatars.length; i++)
						if (vStream.avatars[i].options.ccv) {
							ccvRequested = true;
							if (vStream.local) {
								ccvLocalRequested = true;
								break;
							}
						}
					if (ccvLocalRequested) {
						if (typeof (ccv) == "undefined") { // ccv library not loaded
							if (!this.ccvLibRequested) {
								var path = null;
								console.error("No CCV path available");
								this.ccvLibRequested = true;
								if (path) {
									$("<script/>").attr("src", path + "/face.js").attr("type", "text/javascript")
										.appendTo($("head"));
									$("<script/>").attr("src", path + "/ccv.js").attr("type", "text/javascript")
										.appendTo($("head"));
								}
							}
						} else {
							if (!vStream.ccvInProgress)
								this.ccvPoll(vStream);
						}
					}
					if (ccvRequested)
						this.ccvAnimate(vStream);
					threeCtx.animControl.trigger();
				}
			} catch (e) {
				if (vStream.errorCount % 1000000 == 0)
					console.warn("Gadget3DVideo.animate error", vStream.errorCount, side, e);
				vStream.errorCount++;
			}
		}
	}
	Gadget3DVideo.ccvLocked = function (vStream, locking) {
		for (var i = 0; i < vStream.avatars.length; i++)
			vStream.avatars[i].ccvLocked(locking);
	}
	Gadget3DVideo.ccvPoll = function (vStream) {
		vStream.ccvInProgress = true;
		var width = vStream.videoImage[0].width;
		var height = vStream.videoImage[0].height;
		var now = Date.now();
		function CCVResult(comp) {
			if (comp.length == 0) {
				if (vStream.ccvLock) {
					vStream.ccvLock = null;
					Gadget3DVideo.ccvLocked(vStream, false);
					WebRTC.sendCCVMessage({
						locked: false,
					});
				}
			} else {
				var face = comp[0];
				var lock = vStream.ccvLock;
				vStream.ccvLock = {
					x: face.x,
					y: face.y,
					width: face.width,
					height: face.height,
				}
				if (vStream.ccvLastSuccess)
					vStream.ccvLastSuccess.videoImage.remove();
				vStream.ccvLastSuccess = $.extend({
					videoImage: vStream.ccvLastAnalyzed,
					copied: false,
				}, vStream.ccvLock);
				vStream.ccvLastAnalyzed = null;
				vStream.ccvLastAnalyzedContext = null;

				if (!lock)
					Gadget3DVideo.ccvLocked(vStream, true);
				WebRTC.sendCCVMessage({
					locked: true,
					x: face.x,
					y: face.y,
					width: face.width,
					height: face.height,
				});
			}
			ReschedulePoll();
		}
		function ReschedulePoll() {
			setTimeout(function () {
				vStream.ccvInProgress = false;
			}, 200);
		}
		if (!vStream.ccvLastAnalyzed) {
			vStream.ccvLastAnalyzed = this.makeCanvas(vStream.videoImage[0].width, vStream.videoImage[0].height);
			vStream.ccvLastAnalyzedContext = vStream.ccvLastAnalyzed[0].getContext("2d");
		}
		vStream.ccvLastAnalyzedContext.drawImage(vStream.videoImage[0], 0, 0, vStream.videoImage[0].width, vStream.videoImage[0].height);

		/*
		if(WebRTC.webrtcDetectedBrowser=="firefox")
			ccv.detect_objects({
				//"canvas" : ccv.grayscale(vStream.ccvLastAnalyzed[0]),
				"canvas" : ccv.grayscale(vStream.videoImage[0]),
				"cascade" : cascade,
				"interval" : 5,
				"min_neighbors" : 1,
				"async" : false,
				"async" : true,
				"worker" : 1
			})(CCVResult);
		else
		*/
		CCVResult(ccv.detect_objects({
			//"canvas" : ccv.grayscale(vStream.ccvLastAnalyzed[0]),
			"canvas": ccv.grayscale(vStream.videoImage[0]),
			"cascade": cascade,
			"interval": 5,
			"min_neighbors": 1,
			"async": false,
			"worker": 1
		}));
	}
	Gadget3DVideo.makeCanvas = function (width, height) {
		return $("<canvas/>").attr("width", width).attr("height", height).width(width).height(height)
			.css({
				visibility: "hidden",
				position: "absolute",
				"z-index": -1,
				top: 0,
			}).appendTo("body");
	}
	Gadget3DVideo.ccvAnimate = function (vStream) {
		function DrawImage(ccvContext, ccvLock, source) {
			var width = ccvLock.width * (1 + ccvContext.margin[1] + ccvContext.margin[3]);
			var height = ccvLock.height * (1 + ccvContext.margin[0] + ccvContext.margin[2]);
			var x = ccvLock.x - ccvLock.width * ccvContext.margin[3];
			var y = ccvLock.y - ccvLock.height * ccvContext.margin[0];
			if (x < 0) {
				width += x;
				x = 0;
			}
			if (y < 0) {
				height += y;
				y = 0;
			}
			if (x + width > source.width)
				width = source.width - x;
			if (y + height > source.height)
				height = source.height - y;
			ccvContext.videoImageContext.drawImage(source,
				x, y, width, height,
				0, 0,
				ccvContext.width, ccvContext.height);
			ccvContext.videoTexture.needsUpdate = true;
		}

		for (var contextKey in vStream.ccvContexts) {
			var ccvContext = vStream.ccvContexts[contextKey];
			if (vStream.ccvLock)
				DrawImage(ccvContext, vStream.ccvLock, vStream.videoImage[0]);
			else if (vStream.ccvLastSuccess && !vStream.ccvLastSuccess.copied) {
				vStream.ccvLastSuccess.copied = true;
				DrawImage(ccvContext, vStream.ccvLastSuccess, vStream.ccvLastSuccess.videoImage[0]);
			}
		}
	}
	Gadget3DVideo.receiveRemoteLock = function (message) {
		for (var side in this.streams) {
			var vStream = this.streams[side];
			if (vStream.local)
				continue;
			var lock = vStream.ccvLock;
			if (message.locked) {
				vStream.ccvLock = {
					x: message.x,
					y: message.y,
					width: message.width,
					height: message.height,
				};
				if (vStream.ccvLastSuccess)
					vStream.ccvLastSuccess.videoImage.remove();
				var videoImage = this.makeCanvas(vStream.videoImage[0].width, vStream.videoImage[0].height);
				var videoImageContext = videoImage[0].getContext("2d");
				videoImageContext.drawImage(vStream.videoImage[0], 0, 0, vStream.videoImage[0].width, vStream.videoImage[0].height);
				vStream.ccvLastSuccess = $.extend({
					videoImage: videoImage,
					copied: false,
				}, vStream.ccvLock);
				if (!lock)
					Gadget3DVideo.ccvLocked(vStream, true);
			} else {
				if (lock) {
					vStream.ccvLock = null;
					Gadget3DVideo.ccvLocked(vStream, false);
				}
			}
		}
	}

	function WebRTCHandler(event, data) {
		try {
			if (data.webrtcType == "mediaOn") {
				if (data.ar)
					AR(data.stream);
				else
					Gadget3DVideo.addStream(data.side, data.stream, data.local);
			} if (data.webrtcType == "mediaOff") {
				if (arStream)
					AR(null);
				else
					Gadget3DVideo.removeStream(data.side);
			} if (data.webrtcType == "ccv")
				Gadget3DVideo.receiveRemoteLock(data.message);
		} catch (e) {
			console.error("xd-view webrtc error", e);
		}
	}
	$(document).bind("joclyhub.webrtc", WebRTCHandler);

	var Gadget3DVideoFile = GadgetCustomMesh3D.extend({
		init: function (gadget, options) {
			options = $.extend(true, {
				scale: [1, 1, 1],
				makeMesh: function (videoTexture) {
					var material = new THREE.MeshBasicMaterial({
						map: videoTexture,
						overdraw: true,
					});
					var geometry = new THREE.PlaneGeometry(this.options.width * this.SCALE3D, this.options.height * this.SCALE3D, 1, 1);
					var mesh = new THREE.Mesh(geometry, material);

					return mesh;
				},
				width: 12,
				height: 9,
			}, options);
			this.videoPlayer = Gadget3DVideoFile.GetVideoPlayer(options.src);
			this._super.call(this, gadget, options);
		},
		createObject: function () {
			var mesh = this.options.makeMesh.call(this, this.videoPlayer.texture);
			if (mesh)
				this.objectReady(mesh);
		},
		remove: function () {
			var videoPlayer = videoPlayers[this.options.src];
			if (videoPlayer) {
				videoPlayer.count--;
				if (videoPlayer.count == 0) {
					delete threeCtx.animateCallbacks["Gadget3DVideoFile." + this.options.src];
					videoPlayer.tag.remove();
					videoPlayer.canvas.remove();
					delete videoPlayers[this.options.src];
				}
			}
			this._super.apply(this, arguments);
		},
	});

	var videoPlayers = {};
	Gadget3DVideoFile.GetVideoPlayer = function (url) {
		var videoPlayer = videoPlayers[url];
		if (!videoPlayer) {
			var width = 638;
			var height = 360;
			var videoTag = $("<video/>").attr("autoplay", "autoplay")./*attr("muted","muted").*/attr("loop", "loop").css({
				width: width,
				height: height,
				position: "absolute",
			}).append($("<source/>").attr("src", url).attr("type", "video/webm")).appendTo("body");
			videoPlayer = {
				count: 1,
				tag: videoTag,
				canvas: Gadget3DVideo.makeCanvas(width, height),
			}
			videoPlayer.context = videoPlayer.canvas[0].getContext('2d');
			videoPlayer.context.fillStyle = "rgb(0,255,0)";
			videoPlayer.context.fillRect(0, 0, width, height);

			videoPlayer.texture = new THREE.Texture(videoPlayer.canvas[0]);
			videoPlayer.texture.minFilter = THREE.LinearFilter;
			videoPlayer.texture.magFilter = THREE.LinearFilter;
			videoPlayer.texture.needsUpdate = true;

			function Animate() {
				var ctx = videoPlayer.context;
				ctx.drawImage(videoPlayer.tag[0], 0, 0,
					width, height);
				videoPlayer.texture.needsUpdate = true;
			}
			threeCtx.animateCallbacks["Gadget3DVideoFile." + url] = {
				_this: null,
				callback: Animate,
			}

			videoPlayers[url] = videoPlayer;
		} else
			videoPlayer.count++;

		return videoPlayer;
	}


	var GadgetCamera = GadgetObject3D.extend({
		init: function (gadget, options) {
			this._super.call(this, gadget, options);
			//this.object3d=threeCtx.camera;
			this.object3d = threeCtx.body;
			this.cameraObject = this.object3d.children[0];
			this.targetAnim = null;
			this.camTarget = threeCtx.camTarget;
		},
		displayObject3D: function (force, options, delay) {
			var $this = this;
			this.options.x = this.object3d.position.x / SCALE3D;
			this.options.y = this.object3d.position.z / SCALE3D;
			this.options.z = this.object3d.position.y / SCALE3D;
			this._super.apply(this, arguments);
			if (force ||
				options.targetX * SCALE3D != threeCtx.cameraControls.camTarget.x ||
				options.targetY * SCALE3D != threeCtx.cameraControls.camTarget.z ||
				options.targetZ * SCALE3D != threeCtx.cameraControls.camTarget.y
			) {
				if (delay) {
					var traveling = options.traveling;
					var x0 = threeCtx.cameraControls.camTarget.x;
					var y0 = threeCtx.cameraControls.camTarget.y;
					var z0 = threeCtx.cameraControls.camTarget.z;

					options.traveling = false;
					if (this.targetAnim) {
						this.targetAnim.stop();
						//this.animEnd(this.targetCallback);
						this.animEnd(options);
					}
					//this.targetCallback=callback;
					this.animStart(options);
					this.targetAnim = new TWEEN.Tween(threeCtx.cameraControls.camTarget).to({
						x: options.targetX * SCALE3D,
						y: options.targetZ * SCALE3D,
						z: options.targetY * SCALE3D,
					}, delay).easing(options.targetEasing ? options.targetEasing : TWEEN.Easing.Cubic.EaseInOut).onComplete(function () {
						$this.targetAnim = null;
						$this.animEnd(options);
					}).onUpdate(function (ratio) {
						if (options.targetEasingUpdate)
							options.targetEasingUpdate.call($this, ratio);
						if (traveling) {
							var dx = threeCtx.cameraControls.camTarget.x - x0;
							var dy = threeCtx.cameraControls.camTarget.y - y0;
							var dz = threeCtx.cameraControls.camTarget.z - z0;
							x0 = threeCtx.cameraControls.camTarget.x;
							y0 = threeCtx.cameraControls.camTarget.y;
							z0 = threeCtx.cameraControls.camTarget.z;
							//$this.object3d.position.add(new THREE.Vector3(dx,dy,dz));
						}
						//$this.object3d.lookAt(threeCtx.cameraControls.camTarget);
						$this.cameraObject.lookAt(threeCtx.cameraControls.camTarget);
					}).start();
				} else {
					threeCtx.cameraControls.camTarget.x = options.targetX * SCALE3D;
					threeCtx.cameraControls.camTarget.y = options.targetZ * SCALE3D;
					threeCtx.cameraControls.camTarget.z = options.targetY * SCALE3D;
				}
			}
		},
	});

	function CreateCameraGadget() {
		xdv.createGadget("camera", {
			"3d": {
				type: "camera3d",
				x: threeCtx.camera.position.x / SCALE3D,
				y: threeCtx.camera.position.z / SCALE3D,
				z: threeCtx.camera.position.y / SCALE3D,
				targetX: threeCtx.cameraControls.camTarget.x / SCALE3D,
				targetY: threeCtx.cameraControls.camTarget.z / SCALE3D,
				targetZ: threeCtx.cameraControls.camTarget.y / SCALE3D,
			},
		});
		xdv.saveGadgetProps("camera", ["targetX", "targetY", "targetZ"], "initial");
		xdv.updateGadget("camera", {
			"3d": {
				visible: true,
			},
		});
	}

	/* ======================================== */

	var avatarTypes = {
		"image": GadgetImage,
		"element": GadgetElement,
		"canvas": GadgetCanvas,
		"hexagon": GadgetHexagon,
		"sprite": GadgetSprite,
		"disk": GadgetDisk,
		"meshfile": GadgetMeshFile,
		"custom3d": GadgetCustom3D,
		"plane3d": GadgetPlane3D,
		"custommesh3d": GadgetCustomMesh3D,
		"video3d": Gadget3DVideo,
		"camera3d": GadgetCamera,
		"videofile3d": Gadget3DVideoFile,
	}


	/* ======================================== */

	var areaElements = null;

	View.Game.CamAnim = {
		isSupported: function () {
			return !!threeCtx;
		},
		isRunning: function () {
			return threeCtx && threeCtx.camAnim;
		},
		set: function (on) {
			if (threeCtx)
				threeCtx.setCamAnim(on);
		},
	}

	View.Game.InitView = function () {

		resourcesMap = this.resources || {};

		if (this != xdv.game) {
			xdv.game = this;
			if (this.mWidget.find(".jocly-xdv-area").length == 0) {
				area = $("<div/>").css({
					"position": "absolute",
					"z-index": 0,
					"overflow": "hidden",
				}).addClass("jocly-xdv-area").appendTo(this.mWidget);
			}
		}
		if (areaElements) {
			areaElements.appendTo(area);
			areaElements = null;
		}

		if (!xdv.initDone) {
			this.xdInit(xdv);
			xdv.initDone = true;
		}

		var needs3DUpdate = false;
		if (!currentSkin || this.mSkin != currentSkin.name) {
			currentSkin = null;
			for (var i = 0; i < this.mViewOptions.skins.length; i++) {
				var skin = this.mViewOptions.skins[i];
				if (skin.name == this.mSkin) {
					currentSkin = skin;
					break;
				}
			}
			if (currentSkin == null) {
				Log("!!! InitView", "skin", this.mSkin, "not found");
				return;
			}
			xdv.unbuildGadgets();
			areaElements = null;
			if (currentSkin["3d"])
				needs3DUpdate = true;
		}

		var areaWidth = Math.min(this.mGeometry.width, this.mGeometry.height
			* (this.mViewOptions.preferredRatio || 1));
		var areaHeight = Math.min(this.mGeometry.width / (this.mViewOptions.preferredRatio || 1), this.mGeometry.height);
		var areaCenter;
		if (currentSkin["3d"]) {
			area.css({
				left: 0,
				top: 0,
				width: this.mGeometry.width,
				height: this.mGeometry.height,
			});
			areaCenter = {
				x: this.mGeometry.width / 2,
				y: this.mGeometry.height / 2,
			};
			if (!threeCtx) {
				if (!THREE.Object3D._threexDomEvent) {
					THREE.Object3D._threexDomEvent = new THREEx.DomEvent();
				}
				threeCtx = BuildThree(this, areaWidth, areaHeight);
				CreateCameraGadget();
				threeCtx.camera.updateProjectionMatrix();
			} else {
				threeCtx.renderer.setSize(this.mGeometry.width, this.mGeometry.height);
				threeCtx.anaglyphEffect.setSize(this.mGeometry.width, this.mGeometry.height);
				threeCtx.camera.aspect = this.mGeometry.width / this.mGeometry.height;
				threeCtx.camera.updateProjectionMatrix();
			}

			THREE.Object3D._threexDomEvent.setDOMElement(threeCtx.renderer.domElement);
			THREE.Object3D._threexDomEvent.setBoundContext(THREEx_boundContext);
			THREE.Object3D._threexDomEvent.camera(threeCtx.camera);

			ResumePendingResources();

			threeCtx.animControl.trigger();
			if (needs3DUpdate) {

				var cameraData = $.extend(true, {
					radius: 12,
					elevationAngle: 60,
					rotationAngle: 90,
					distMax: 20,
					distMin: 0,
					elevationMax: 89,
					elevationMin: 10,
					startAngle: 90,
					camAnim: false,
					limitCamMoves: true,
					enableDrag: true,
					targetBounds: [3000, 3000, 3000],
					target: [0, 0, 800],
					fov: 55,
					near: .01
				}, currentSkin.camera);

				// update FOV
				threeCtx.camera.fov = cameraData.fov;
				threeCtx.camera.near = cameraData.near;
				threeCtx.camera.updateProjectionMatrix();

				$.extend(threeCtx.cameraControls, {
					minDistance: cameraData.distMin,
					maxDistance: cameraData.distMax,
					minPolarAngle: (90 - cameraData.elevationMax) * Math.PI / 180,
					maxPolarAngle: (90 - cameraData.elevationMin) * Math.PI / 180,
					enableDrag: cameraData.enableDrag,
					targetBounds: [cameraData.targetBounds[0] * SCALE3D, cameraData.targetBounds[2] * SCALE3D, cameraData.targetBounds[1] * SCALE3D],
				});

				var camPosition = {
					x: cameraData.radius * Math.cos(cameraData.elevationAngle * Math.PI / 180) * Math.cos(cameraData.rotationAngle * Math.PI / 180),
					z: cameraData.radius * Math.cos(cameraData.elevationAngle * Math.PI / 180) * Math.sin(cameraData.rotationAngle * Math.PI / 180),
					y: cameraData.radius * Math.sin(cameraData.elevationAngle * Math.PI / 180),
				}

				var camTarget = {
					x: cameraData.target[0],
					y: cameraData.target[1],
					z: cameraData.target[2],
				}
				xdv.updateGadget("camera", {
					"3d": {
						x: camPosition.x / SCALE3D,
						y: camPosition.z / SCALE3D,
						z: camPosition.y / SCALE3D,
						targetX: camTarget.x,
						targetY: camTarget.y,
						targetZ: camTarget.z,
					},
				});
				threeCtx.cameraControls.camTarget.copy(camTarget);
				//threeCtx.cameraControls.camera.position.copy(camPosition);
				threeCtx.cameraControls.update();

				var world = {
					color: 0x205D7C,
					fog: true,
					fogNear: 10,
					fogFar: 100,
					lightCastShadow: true,
					lightIntensity: 1.75,
					lightPosition: { x: -12, y: 12, z: 12 },
					//lightShadowDarkness: 0.75,
					ambientLightColor: 0xbbbbbb,
					skyLightPosition: { x: -45, y: 45, z: 45 },
					skyLightIntensity: 2,
				}
				$.extend(true, world, currentSkin.world);
				if (threeCtx.scene.fog) {
					threeCtx.scene.remove(threeCtx.scene.fog);
					delete threeCtx.scene.fog;
				}
				if (world.fog) {
					var fogColor = world.color;
					if (world.fogColor) fogColor = world.fogColor;
					threeCtx.scene.fog = new THREE.Fog(fogColor, world.fogNear, world.fogFar);
				}

				threeCtx.world = world;
				threeCtx.renderer.setClearColor(new THREE.Color(world.color), 1);
				threeCtx.light.castShadow = world.lightCastShadow;
				threeCtx.light.intensity = world.lightIntensity;
				threeCtx.light.position.set(world.lightPosition.x, world.lightPosition.y, world.lightPosition.z);
				//threeCtx.light.shadowDarkness=world.lightShadowDarkness;
				threeCtx.ambientLight.color.setHex(world.ambientLightColor);
				threeCtx.skyLight.intensity = world.skyLightIntensity;
				threeCtx.skyLight.position.set(world.skyLightPosition.x, world.skyLightPosition.y, world.skyLightPosition.z);
			}
			threeCtx.renderer.domElement.style.display = "block";
		} else {
			area.css({
				left: (this.mGeometry.width - areaWidth) / 2,
				top: (this.mGeometry.height - areaHeight) / 2,
				width: areaWidth,
				height: areaHeight,
			});
			areaCenter = {
				x: areaWidth / 2,
				y: areaHeight / 2,
			}
			if (threeCtx)
				threeCtx.renderer.domElement.style.display = "none";
		}

		this.xdBuildScene(xdv);
		//xdv.updateArea(Math.min(areaWidth,areaHeight)/VSIZE,areaCenter);
		xdv.updateArea(Math.max(areaWidth, areaHeight) / VSIZE, areaCenter);
	}

	View.Game.DestroyView = function () {
		if (!xdv.game) {
			Log("!!! InitView", "game already unset");
			return;
		}
		if (resLoadingMask)
			resLoadingMask.hide();
		xdv.game = null;
		areaElements = area.children().detach();
		if (threeCtx) {
			if (threeCtx.cameraControls.autoRotate)
				threeCtx.cameraControls.autoRotate = false;
		}
		//threeCtx.animControl.stop();
	}

	View.Game.CloseView = function () {
		xdv.unbuildGadgets();

		if (threeCtx) {
			THREE.Object3D._threexDomEvent.unsetBoundContext(THREEx_boundContext);
			threeCtx.cameraControls.destroy();
			threeCtx = null;
		}
		InitGlobals();
	}

	View.Game.xdResourceLoaded = function (res) {
		if (/^map\|/.test(res))
			return false;
		if (resources[res] && resources[res].status == "loaded")
			return true;
		else
			return false;
	}

	View.Game.xdLoadResources = function (ress, callback) {
		var resCount = 0;
		function ResLoaded() {
			if (--resCount == 0)
				callback();
		}
		for (var i = 0; i < ress.length; i++) {
			resCount++;
			var m = /^map\|(.*)$/.exec(ress[i]);
			if (m)
				GetMaterialMap(m[1], function () {
					setTimeout(ResLoaded, 0);
				});
			else
				GetResource(ress[i], function () {
					setTimeout(ResLoaded, 0);
				});
		}
	}

	View.Game.xdExternalCommand = function (cmd, scope) {
		switch (cmd.type) {
			case 'updateCamera':
				xdv.updateGadget("camera", {
					"3d": cmd.camera,
				}, cmd.delay || 0);
				break;
			case 'getCamera':
				var resp = {
					type: "camera",
					cameraId: cmd.cameraId,
				}
				if (threeCtx) {
					resp.camera = {
						x: threeCtx.camera.position.x / SCALE3D,
						y: threeCtx.camera.position.z / SCALE3D,
						z: threeCtx.camera.position.y / SCALE3D,
						targetX: threeCtx.cameraControls.camTarget.x / SCALE3D,
						targetY: threeCtx.cameraControls.camTarget.z / SCALE3D,
						targetZ: threeCtx.cameraControls.camTarget.y / SCALE3D,
					}
				} else {
					console.warn("cannot get camera without 3D context");
					resp.camera = null;
				}
				scope.sendEmbed(resp);
				break;
			case 'snapshot':
				var resp = {
					type: "snapshot",
					snapshotId: cmd.snapshotId,
				}
				if (threeCtx) {
					var renderer = threeCtx.renderer;
					var canvas = renderer.domElement;
					renderer.render(threeCtx.scene, threeCtx.camera);
					resp.image = canvas.toDataURL("image/png");
				} else {
					console.warn("cannot get snapshot without 3D context");
					resp.image = null;
				}
				scope.sendEmbed(resp);
				break;
		}
	}

	View.Game.ViewControl = function (cmd, options) {
		options = options || {};
		var promise = new Promise(function (resolve, reject) {
			switch (cmd) {
				case "enterAnaglyph":
					if (threeCtx) {
						threeCtx.anaglyph = true;
						var factor = 2.5;
						threeCtx.scene.scale.set(1 / factor, 1 / factor, 1 / factor);
						threeCtx.camera.scale.set(factor, factor, factor);
						threeCtx.animControl.trigger();
					};
					resolve();
					break;

				case "exitAnaglyph":
					if (threeCtx) {
						threeCtx.anaglyph = false;
						threeCtx.scene.scale.set(1, 1, 1);
						threeCtx.camera.scale.set(1, 1, 1);
						threeCtx.animControl.trigger();
					};
					resolve();
					break;

				case "stopAnimations":
					var animCount = TWEEN.getAll().length;
					TWEEN.removeAll();
					resolve(animCount > 0);
					break;

				case "setPanorama":
					if (options.pictureUrl || options.pictureData) {
						xdv.removeGadget("panorama");
						xdv.createGadget("panorama", {
							"3d": {
								type: "custommesh3d",
								harbor: false,
								rotate: options.rotate || 0,
								create: function (callback) {
									var geometry = new THREE.SphereGeometry(500, 60, 40);
									geometry.scale(- 1, 1, 1);
									new Promise(function (resolve, reject) {
										if (options.pictureData) {
											var image = new Image;
											image.src = options.pictureData;
											var texture = new THREE.Texture(image);
											image.onload = function () {
												texture.needsUpdate = true;
												resolve(texture);
											}
										} else
											resolve(new THREE.TextureLoader().load(options.pictureUrl))
									}).then(function (texture) {
										var material = new THREE.MeshBasicMaterial({
											map: texture
										});
										mesh = new THREE.Mesh(geometry, material);
										callback(mesh);
									})
								},
							}
						});
						xdv.updateGadget("panorama", {
							"3d": {
								visible: true
							},
						});
					} else {
						xdv.updateGadget("panorama", {
							"3d": {
								visible: false
							},
						});
						xdv.removeGadget("panorama");
					}
					resolve();
					break;

				case "takeSnapshot":
					if (threeCtx) {
						var canvas = threeCtx.renderer.domElement;
						threeCtx.renderer.render(threeCtx.scene, threeCtx.camera);
						resolve(canvas.toDataURL("image/" + (options.format || "png"), options.quality || undefined));
					} else
						reject(new Error("Snapshot only available on 3D views"));
					break;

				case "getCamera":
					if (threeCtx)
						resolve({
							x: threeCtx.body.position.x / SCALE3D,
							y: threeCtx.body.position.z / SCALE3D,
							z: threeCtx.body.position.y / SCALE3D,
							targetX: threeCtx.cameraControls.camTarget.x / SCALE3D,
							targetY: threeCtx.cameraControls.camTarget.z / SCALE3D,
							targetZ: threeCtx.cameraControls.camTarget.y / SCALE3D
						});
					else 
						reject(new Error("Camera only available on 3D views"));
					break;

				case 'setCamera':
					if(!threeCtx)
						return reject(new Error("Camera only available on 3D views"));

					switch(options.type) {
						case "spin":
							resolve(SpinCamera(options));
							break;
						case "stop":
							if(threeCtx.dolly) {
								delete threeCtx.animateCallbacks["dolly"];
								TWEEN.remove(threeCtx.dolly);
								delete threeCtx.dolly;
							}
							break;
						case "move":
						default:
							resolve(MoveCamera(options));
					}

					break;


				default:
					reject(new Error("ViewControl: unsupported command " + cmd));
			}
		});
		return promise;
	}

	function SpinCamera(options) {
		var x0 = threeCtx.cameraControls.camTarget.x;
		var y0 = threeCtx.cameraControls.camTarget.z;
		var x1 = threeCtx.body.position.x;
		var y1 = threeCtx.body.position.z;
		var angle0 = Math.atan2(y1-y0,x1-x0);
		var angle1 = angle0 - 2 * Math.PI;
		if(options.direction=="ccw")
			angle1 = angle0 + 2 * Math.PI;
		var radius = Math.sqrt((x1-x0)*(x1-x0)+(y1-y0)*(y1-y0));
		if(threeCtx.dolly)
			TWEEN.remove(threeCtx.dolly);
		var state = {};
		function StartSpinning() {
			state.angle = angle0;
			threeCtx.dolly = new TWEEN.Tween(state).to({ angle: angle1 }, (options.speed || 30) * 1000)
					.onComplete( function() {
						StartSpinning();
					})
					.onUpdate( function() {
						threeCtx.animControl.trigger();
					}).start();
		}
		threeCtx.animateCallbacks["dolly"] = {
			_this: null,
			callback: function() {
				threeCtx.body.position.x = x0 + radius * Math.cos(state.angle);
				threeCtx.body.position.z = y0 + radius * Math.sin(state.angle);
			}
		};
		StartSpinning();
		threeCtx.animControl.trigger();

	}

	function MoveCamera(options) {
		function GetKalman() {
			var R = .2;
			if(typeof options.smooth!="undefined")
				R = options.smooth;
			return new KalmanFilter({R: R});
		}
		var kalman = {
			x: GetKalman(),
			y: GetKalman(),
			z: GetKalman(),
			targetX: GetKalman(),
			targetY: GetKalman(),
			targetZ: GetKalman()
		}
		var state = {
			x: threeCtx.body.position.x,
			y: threeCtx.body.position.y,
			z: threeCtx.body.position.z,
			targetX: threeCtx.cameraControls.camTarget.x,
			targetY: threeCtx.cameraControls.camTarget.y,
			targetZ: threeCtx.cameraControls.camTarget.z
		}
		var state1 = {
			x: options.camera.x * SCALE3D,
			z: options.camera.y * SCALE3D,
			y: options.camera.z * SCALE3D,
			targetX: options.camera.targetX * SCALE3D,
			targetZ: options.camera.targetY * SCALE3D,
			targetY: options.camera.targetZ * SCALE3D
		}
		var finalCamera = new THREE.Vector3(state1.x, state1.y, state1.z);
		var finalTarget = new THREE.Vector3(state1.targetX, state1.targetY, state1.targetZ);
		if(threeCtx.dolly)
			TWEEN.remove(threeCtx.dolly);
		threeCtx.dolly = new TWEEN.Tween(state).to(state1, options.speed * 1000)
				.onUpdate( function() {
					threeCtx.animControl.trigger();
				}).start();
		threeCtx.animateCallbacks["dolly"] = {
			_this: null,
			callback: function() {
				threeCtx.body.position.x = kalman.x.filter(state.x);
				threeCtx.body.position.y = kalman.y.filter(state.y);
				threeCtx.body.position.z = kalman.z.filter(state.z);
				threeCtx.cameraControls.camTarget.x = kalman.targetX.filter(state.targetX);
				threeCtx.cameraControls.camTarget.y = kalman.targetY.filter(state.targetY);
				threeCtx.cameraControls.camTarget.z = kalman.targetZ.filter(state.targetZ);
				var cameraVec = new THREE.Vector3(
					threeCtx.body.position.x,
					threeCtx.body.position.y,
					threeCtx.body.position.z);
				if(cameraVec.distanceTo(finalCamera)<.1) {
					var targetVec = new THREE.Vector3(
						threeCtx.cameraControls.camTarget.x,
						threeCtx.cameraControls.camTarget.y,
						threeCtx.cameraControls.camTarget.z);
					if(targetVec.distanceTo(finalTarget)<.1) {
						delete threeCtx.animateCallbacks["dolly"];
						TWEEN.remove(threeCtx.dolly);
						delete threeCtx.dolly;
					}
				}
			}
		}
		threeCtx.animControl.trigger();
	}

	View.Board.Display = function (aGame) {
		//Log("### View.Board.Display");
		this.xdDisplay(xdv, aGame);
		//xdv.listScene();
	}

	View.Board.xdInput = function (xdv, aGame) {
		console.error("View.Board.xdInput must be overriden");
		return {
			initial: {},
			getActions: function (moves, currentInput) {
				return {};
			},
		}
	}

	View.Board.xdBuildHTStateMachine = function (xdv, htsm, aGame) {
		var $this = this;
		var inputSpec;
		var clickGadgets = {}, viewGadgets = {}, highlightGadgets = [];
		var inputStack, movesStack, actionStack;
		function Click(action, mode) {
			if (mode == "select")
				htsm.smQueueEvent("E_ACTION", { action: action });
			else if (mode == "cancel")
				htsm.smQueueEvent("E_CANCEL", { action: action });
		}
		function Init(args) {
			inputSpec = $this.xdInput(xdv, aGame);
			inputStack = [inputSpec.initial];
			// ensures moves are not duplicated
			var movesMap = {};
			$this.mMoves.forEach(function (move) {
				movesMap[JSON.stringify(move)] = move;
			});
			var moves = [];
			for (var m in movesMap)
				moves.push(movesMap[m]);
			movesStack = [moves];
			actionStack = [];
		}
		function ShowFurnitures(args) {
			if (inputSpec.furnitures)
				inputSpec.furnitures.forEach(function (gadget) {
					xdv.updateGadget(gadget, {
						base: {
							visible: true,
						},
					});
				});
		}
		function HideFurnitures(args) {
			if (inputSpec.furnitures)
				inputSpec.furnitures.forEach(function (gadget) {
					xdv.updateGadget(gadget, {
						base: {
							visible: false,
						},
					});
				});
		}
		function SetAction(action, mode) {
			if (mode == "select") {
				if (action.pre)
					action.pre.call($this);
				if (action.cancel)
					action.cancel.forEach(function (gid) {
						clickGadgets[gid] = true;
						xdv.updateGadget(gid, {
							base: {
								click: function () {
									Click(action, "cancel");
								},
							},
						});
					});
			}
			if (action.click)
				action.click.forEach(function (gid) {
					clickGadgets[gid] = true;
					xdv.updateGadget(gid, {
						base: {
							click: function () {
								Click(action, mode);
							},
						},
					});
				});
			if (typeof action.highlight == "function") {
				if (typeof action.unhighlight != "function")
					console.warn("No unhighlight function defined for", action);
				else
					highlightGadgets.push(function () {
						action.unhighlight.call($this, mode);
					});
				action.highlight.call($this, mode);
			}
			if (action.view)
				action.view.forEach(function (gid) {
					viewGadgets[gid] = true;
					xdv.updateGadget(gid, {
						base: {
							visible: true,
						},
					})
				});
		}
		function PrepareAction(args) {
			var nextActions = inputSpec.getActions.call($this, movesStack[movesStack.length - 1], inputStack[inputStack.length - 1]);
			if (nextActions == null) {
				htsm.smQueueEvent("E_MOVE_DONE", { move: movesStack[movesStack.length - 1][0] });
				return;
			}
			var actionsCount = 0;
			var action0;
			for (var action in nextActions) {
				action0 = nextActions[action];
				actionsCount++;
			}
			if (actionsCount > 1 || (inputStack.length == 1 && !inputSpec.allowForced) || (actionsCount == 1 && !aGame.mAutoComplete && !action0.skipable)) {
				for (var actId in nextActions) {
					var action = nextActions[actId];
					action.forced = false;
					SetAction(action, "select");
				}
			} else if (actionsCount == 0) {
				htsm.smQueueEvent("E_MOVE_DONE", { move: actionStack[actionStack.length - 1].moves[0] });
			} else {
				action0.forced = true;
				htsm.smQueueEvent("E_ACTION", { action: action0 });
			}
		}
		function SendMove(args) {
			aGame.HumanMove(args.move);
		}
		function Clean(args) {
			for (var gid in clickGadgets)
				xdv.updateGadget(gid, {
					base: {
						click: null,
					},
				});
			clickGadgets = {};
			for (var gid in viewGadgets)
				xdv.updateGadget(gid, {
					base: {
						visible: false,
					},
				});
			viewGadgets = {};
			for (var i = 0; i < highlightGadgets.length; i++)
				highlightGadgets[i].call($this);
		}
		function Execute(action, callback) {
			if (action.execute) {
				var actions = action.execute;
				if (typeof actions == "function")
					actions = [actions];
				var actionsCount = 0;
				function ActionDone(action) {
					if (--actionsCount == 0)
						callback();
				}
				actions.forEach(function (action) {
					actionsCount++;
					setTimeout(function () {
						action.call($this, ActionDone);
					}, 0);
				});
			} else
				callback();
		}
		function Action(args) {
			movesStack.push(args.action.moves);
			Execute(args.action, function () {
				htsm.smQueueEvent("E_DONE", { action: args.action });
			});
		}
		function PostAction(args) {
			if (args.action.post)
				args.action.post.call($this);
		}
		function SetCancel(args) {
			if (actionStack.length > 0 && !actionStack[actionStack.length - 1].noAutoCancel)
				SetAction(actionStack[actionStack.length - 1], "cancel");
		}
		function Validate(args) {
			inputStack.push($.extend(true, {}, inputStack[inputStack.length - 1], args.action.validate));
		}
		function Cancel(args) {
			while (actionStack.length > 0) {
				var action = actionStack.pop();
				inputStack.pop();
				movesStack.pop();
				if (action.unexecute)
					action.unexecute.call($this);
				if (action.post)
					action.post.call($this);
				if (action.forced == false)
					break;
			}
		}
		function PushAction(args) {
			actionStack.push(args.action);
		}
		htsm.smTransition("S_INIT", "E_INIT", "S_WAIT_ACTION", [Init, ShowFurnitures]);
		htsm.smEntering("S_WAIT_ACTION", [PrepareAction, SetCancel]);
		htsm.smLeaving("S_WAIT_ACTION", [Clean]);
		htsm.smTransition("S_WAIT_ACTION", "E_ACTION", "S_ACTION", [PushAction, Validate, Action]);
		htsm.smTransition("S_WAIT_ACTION", "E_CANCEL", null, [Cancel, Clean, PrepareAction, SetCancel]);
		htsm.smTransition("S_WAIT_ACTION", "E_MOVE_DONE", "S_DONE", [SendMove, HideFurnitures]);
		htsm.smTransition(["S_WAIT_ACTION", "S_ACTION"], "E_END", "S_DONE", []);
		htsm.smTransition("S_ACTION", "E_DONE", "S_WAIT_ACTION", [PostAction]);
		htsm.smTransition("S_DONE", "E_END", null, [HideFurnitures]);
	}

	View.Board.HumanTurn = function (aGame) {
		//Log("### View.Board.HumanTurn");
		var $this = this;
		htStateMachine = new HTStateMachine();
		htStateMachine.init();
		this.xdBuildHTStateMachine(xdv, htStateMachine, aGame);
		htStateMachine.smSetInitialState("S_INIT");
		htStateMachine.smQueueEvent("E_INIT", {});
		htStateMachine.smPlay();
	}

	View.Board.HumanTurnEnd = function (aGame) {
		//Log("### View.Board.HumanTurnEnd");
		if (htStateMachine) {
			htStateMachine.smQueueEvent("E_END", {});
			htStateMachine = null;
		}
	}

	View.Board.PlayedMove = function (aGame, aMove) {
		//Log("### View.Board.PlayedMove");
		return this.xdPlayedMove(xdv, aGame, aMove);
	}

	View.Board.xdShowEnd = function (xdv, aGame) {
		return true;
	}

	View.Board.ShowEnd = function (aGame) {
		return this.xdShowEnd(xdv, aGame);
	}

	/* ======================================== */

	var THREEx_boundContext = "" + Math.random();

	function BuildThree(aGame, areaWidth, areaHeight) {

		var camera = new THREE.PerspectiveCamera(55, (area.width() / area.height()), 1, 4000);

		var scene = new THREE.Scene();

		var body = new THREE.Object3D();
		scene.add(body);
		body.add(camera);

		var harbor = new THREE.Object3D();
		scene.add(harbor);

		var ambientLight = new THREE.AmbientLight(0xbbbbbb);
		harbor.add(ambientLight);

		var light = new THREE.SpotLight(0xffffff, 1.75, 0, 1.05, 1, 2);  // test params here https://threejs.org/docs/?q=SpotLight#Reference/Lights/SpotLight
		light.position.set(-12, 12, 12);

		light.castShadow = true;
		//light.shadowDarkness = .75;

		light.shadow.camera.near = 1;
		light.shadow.camera.far = 27;
		light.shadow.camera.fov = 90;

		light.shadow.mapSize.width = 4096;
		light.shadow.mapSize.height = 4096;

		light.target = harbor;

		harbor.add(light);

		var skylight = new THREE.PointLight(0xcccccc, 2, 150);//, Math.PI/5, 10);
		skylight.position.set(-45, 45, 45);
		harbor.add(skylight);

		//light.shadowCameraVisible = false;
		// skylight.shadowCameraVisible = true; nonsens! PointLight objects don't have shadow feature

		var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(area.width(), area.height());
		//renderer.setClearColor( scene.fog.color, 1 );

		var projector = new THREE.Projector();

		area.append($(renderer.domElement));

		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		//renderer.shadowMapEnabled = true;
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
		//renderer.physicallyBasedShading = true; // gives high level of shininess specular
		//renderer.shadowMapCascade = true;

		var stereo = false;
		var stereoEffect = new THREE.StereoEffect(renderer);
		stereoEffect.setSize(area.width(), area.height());

		var anaglyphEffect = new THREE.AnaglyphEffect(renderer);
		anaglyphEffect.setSize(area.width(), area.height());

		var gamepads = new VRGamepads({
			camera: camera,
			scene: scene,
			resBase: aGame.config.baseURL + "res/vr/",
			drag: function (position, direction, pointerObject, pointerRescale) {
				var intersectPoint = null;
				var pointedObject = null;
				VRGetIntersect(position, direction, function (object, point) {
					intersectPoint = point;
					pointedObject = object;
				});
				return intersectPoint ? {
					point: intersectPoint,
					object: pointedObject
				} : null;
			},
			click: function (position, direction) {
				VRGetIntersect(position, direction, function (object, point) {
					if (object)
						THREE.Object3D._threexDomEvent._notify("mouseup", object, null, point);
				});
			},
			move: function (step) {
				body.position.add(step);
			}
		});

		var vrRay = new THREE.Raycaster();

		var camAnim = !!aGame.mViewOptions.camAnim;

		var animateCallbacks = {};

		var frameBacklog = 0;

		function AnimControl() {
			this.animating = false;
			this.animateTimer = null;
			this.nextStop = 0;
		}
		AnimControl.prototype = {
			start: function () {
				body.updateMatrixWorld();
				if (this.animateTimer != null) {
					clearTimeout(this.animateTimer);
					this.animateTimer = null;
				}
				if (this.animating == false) {
					this.animating = true;
					this.animate();
				}
			},
			stop: function (delay) {
				if (threeCtx && vr.vrEffect && vr.vrEffect.isPresenting) {
					if (this.animateTimer != null) {
						clearTimeout(this.animateTimer);
						this.animateTimer = null;
					}
					return;
				}
				if (delay === undefined)
					delay = 200;
				var now = Date.now();
				var $this = this;
				if (this.animating) {
					if (this.animateTimer != null) {
						if (this.nextStop < now + delay)
							clearTimeout(this.animateTimer);
						else
							return;
					}
					this.nextStop = Math.max(this.nextStop, now + delay);
					this.animateTimer = setTimeout(function () {
						$this.animateTimer = null;
						$this.animating = false;
					}, this.nextStop - now);
				}
			},
			trigger: function () {
				if (!this.animating || this.animateTimer != null) {
					this.start();
					this.stop.apply(this, arguments);
				}
			},
			animate: function () {
				var $this = this;
				var statsCurrentSec = 0;
				var statsTic = 0;
				var renderSum = 0;
				var renderCount = 0;

				function Animate(timestamp) {
					frameBacklog--;
					var t0, t1;
					var showStats = false;
					if (showStats) {
						var sec = Math.floor(Date.now() / 1000);
						if (sec == statsCurrentSec)
							statsTic++;
						else {
							if (statsTic > 0) {
								var rate = Math.round(1000 * renderSum / renderCount) / 1000;
								var lag = Math.round(1000 * (window.performance.now() - timestamp)) / 1000;
								/*
                                console.log("fps",statsTic,"render",rate,"ms","",
                                            "lag",lag,"ms","",
                                            "frame backlog",frameBacklog);
								*/
								$(statsPanel).text("fps " + statsTic);
							}
							statsTic = 1;
							statsCurrentSec = sec;
						}
					}
					if ($this.animating) {
						frameBacklog++;
						requestAnimationFrame(Animate);
					}
					TWEEN.update();
					if (showStats)
						t0 = Date.now();
					if (vr.vrEffect && vr.vrEffect.isPresenting) {
						gamepads.update();
						var harborpad = gamepads.getHarborPad();
						if (harborpad) {
							harborpad.visible = false;
							harborpad.getWorldPosition(ctx.harbor.position);
							var scale = (harborpad.getAxes()[1] + 1.1) * .03;
							ctx.harbor.scale.set(scale, scale, scale);
							harborpad.getWorldQuaternion(ctx.harbor.quaternion);
						} else {
							ctx.harbor.position.set(0, 0, 0);
							ctx.harbor.scale.set(1, 1, 1);
							ctx.harbor.quaternion.copy(ctx.defaultHarborQuaternion);
						}
						vr.vrControls.update();
						vr.vrEffect.render(scene, camera);
					} else {
						if (!arStream) {
							ctx.harbor.position.set(0, 0, 0);
							ctx.harbor.scale.set(1, 1, 1);
							ctx.harbor.quaternion.copy(ctx.defaultHarborQuaternion);
						}
						/*
                        if(gamepads)
                            gamepads.clearAll();
						*/
						if (!arStream) {
							cameraControls.update();
							cameraOrientationControls.update();
						}
						if (stereo) {
							gamepads.update();
							stereoEffect.render(scene, camera);
						} else if (ctx.anaglyph || aGame.mAnaglyph)
							anaglyphEffect.render(scene, camera);
						else
							renderer.render(scene, camera);
					}
					if (showStats) {
						t1 = Date.now();
						renderSum += t1 - t0;
						renderCount++;
					}

					for (var cbi in animateCallbacks) {
						var cb = animateCallbacks[cbi];
						cb.callback.call(cb._this);
					}
				}
				frameBacklog++;
				Animate(window.performance.now());
			},
		}
		var animControl = new AnimControl();

		var statsPanel = null;

		var cameraControls = new THREE.OrbitControls(camera, body, renderer.domElement);

		$.extend(cameraControls, {
			autoRotate: camAnim,
			animControl: animControl,
		});
		cameraControls.camTarget.set(0, 0.8, 0);

		var canOrientation = false;
		var cameraOrientationControls = new THREE.DeviceOrientationControls(body, function (controls) {
			if (typeof vr != "undefined")
				animControl.trigger();
			if (!canOrientation && controls.enabled) {
				canOrientation = true;
				area.find(".vr-button").show();
			}
		});


		if (typeof cameraControls.addEventListener == "function")
			cameraControls.addEventListener('change', function () {
				animControl.trigger();
			});

		var ctx = {
			scene: scene,
			renderer: renderer,
			light: light,
			skyLight: skylight,
			ambientLight: ambientLight,
			loader: new THREE.JSONLoader(),
			camera: camera,
			cameraControls: cameraControls,
			animateCallbacks: animateCallbacks,
			camTarget: cameraControls.camTarget,
			animControl: animControl,
			body: body,
			harbor: harbor,
			defaultHarborQuaternion: harbor.quaternion.clone(),
			anaglyphEffect: anaglyphEffect,
			anaglyph: false
		};

		function VRGetIntersect(position, direction, callback) {
			var threexDomEvent = THREE.Object3D._threexDomEvent;
			vrRay.set(position, direction);
			try {
				var intersects = vrRay.intersectObjects(threexDomEvent._boundObjs[threexDomEvent._boundContext]);
			} catch (e) {
				return callback(null, null);
			}
			if (intersects.length == 0)
				return callback(null, null);
			var intersect = intersects[0];
			var object3d = threexDomEvent.getRootObject(intersect.object);
			var objectCtx = threexDomEvent._objectCtxGet(object3d);
			if (!objectCtx)
				callback(null, null);
			else
				callback(object3d, intersect.point);
		}

		function VRSetup(ctx) {

			function LookAtHarbor() {
				vr.vrControls.resetPose();
			}

			function MakeButton() {
				ctx.vrButton = document.createElement("img");
				ctx.vrButton.className = "vr-button";
				ctx.vrButton.setAttribute("data-vr-enter-src", aGame.config.baseURL + "res/vr/vr-enter.png");
				ctx.vrButton.setAttribute("data-vr-exit-src", aGame.config.baseURL + "res/vr/vr-exit.png");
				ctx.vrButton.setAttribute("src", ctx.vrButton.getAttribute("data-vr-enter-src"));
				Object.assign(ctx.vrButton.style, {
					position: "absolute",
					bottom: "8px",
					right: "8px",
					cursor: "pointer",
					"z-index": 2147483647
				});
				area[0].appendChild(ctx.vrButton);
			}

			function CardboardVR() {
				MakeButton();
				ctx.vrButton.style.display = "none";
				ctx.vrButton.addEventListener("click", function () {
					if (stereo) {
						stereo = false;
						ctx.vrButton.setAttribute("src", ctx.vrButton.getAttribute("data-vr-enter-src"));
						var size = renderer.getSize();
						renderer.setViewport(0, 0, size.width, size.height);
					} else {
						stereo = true;
						ctx.vrButton.setAttribute("src", ctx.vrButton.getAttribute("data-vr-exit-src"));
					}
					animControl.trigger();
				});
			}

			function PureVR() {
				MakeButton();
				var vrControls = new THREE.VRControls(ctx.camera);
				vr.vrControls = vrControls;
				if (window.lastVrEffect) {
					if (window.lastVrEffect.isPresenting)
						window.lastVrEffect.exitPresent();
				}
				var vrEffect = new THREE.VREffect(ctx.renderer);
				vr.vrEffect = vrEffect;
				window.lastVrEffect = vrEffect;

				window.addEventListener('vrdisplaypresentchange', function (event) {
					ctx.animControl.trigger()
				}, false);

				ctx.vrButton.addEventListener("click", function () {
					if (vrEffect.isPresenting) {
						vrEffect.exitPresent();
						ctx.vrButton.setAttribute("src", ctx.vrButton.getAttribute("data-vr-enter-src"));
					} else {
						vrEffect.requestPresent();
						ctx.vrButton.setAttribute("src", ctx.vrButton.getAttribute("data-vr-exit-src"));
						LookAtHarbor();
					}
					animControl.trigger();
				});

			}

			vr = {};

			if (typeof navigator.getVRDisplays != "undefined") {
				navigator.getVRDisplays()
					.then(function (displays) {
						if (displays.length == 0)
							CardboardVR();
						else
							PureVR();
					}).catch(function () {
						CardboardVR();
					});
			} else
				CardboardVR();

			return vr;
		}

		var vr = VRSetup(ctx);

		return $.extend(ctx, vr);
	}


	function GetEventPosition(event) {
		if (event.originalEvent)
			return GetEventPosition(event.originalEvent);
		if (event.changedTouches && event.changedTouches.length > 0)
			return [event.changedTouches[0].pageX, event.changedTouches[0].pageY];
		if (event.touches && event.touches.length > 0)
			return [event.touches[0].pageX, event.touches[0].pageY];
		return [event.pageX, event.pageY];
	}

	function AR(stream) {
		if (!!arStream == !!stream) {
			console.warn("AR is already", !!stream);
			return;
		}
		arStream = stream;
		if (arStream) {
			var video = $("<video/>").addClass("ar-video").attr("autoplay", "autoplay").css({
				position: "absolute",
				top: 0,
				width: "100%",
				height: "100%",
				left: 0,
				"z-index": -1,
				backgroundColor: "#0f0",
				objectFit: "cover"
			}).appendTo(area.parent());
			JoclyAR.attach({
				element: video[0],
				stream: arStream,
				threeCtx: threeCtx
			});
			xdv.redisplayGadgets();
			threeCtx.renderer.setClearColor(new THREE.Color(threeCtx.world.color), 0);
			threeCtx.animControl.trigger();
		} else {
			var video = area.parent().find(".ar-video");
			if (video.length) {
				JoclyAR.detach({
					element: video[0]
				});
				video.remove();
			}
			xdv.redisplayGadgets();
			threeCtx.renderer.setClearColor(new THREE.Color(threeCtx.world.color), 1);
			threeCtx.animControl.trigger();
		}
	}

})();
