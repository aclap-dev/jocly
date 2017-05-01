exports.games = (function() {
	var modelScripts = [
		"spbase-model.js",
		"spline-model.js"
	]
	var config_model_levels = {
		"label": "Easy",
		"potential": 2000,
		"maxDepth": 5
	}
	var config_model_levels_2 = {
		"label": "Medium",
		"potential": 6000,
		"maxDepth": 6
	}
	var config_model_strings = [
	]
	var config_model_gameOptions = {
		"preventRepeat": true,
		"uctTransposition": "states",
		"uctIgnoreLoop": true,
		"size": 4
	}
	var config_view_js = [
		"spbase-xd-view.js",
		"spline-view.js"
	]
	var config_view_css = [
		"spbase.css"
	]
	var config_view_defaultOptions = {
		"sounds": true,
		"moves": true,
		"notation": false
	}
	var config_view_skins_camera = {
		"radius": 20,
		"elevationAngle": 45,
		"limitCamMoves": true,
		"distMax": 40,
		"distMin": 10,
		"elevationMin": -45,
		"elevationMax": 89.9,
		"enableDrag": false
	}
	var config_view_skins_world_skyLightPosition = {
		"x": 0,
		"y": 10,
		"z": 0
	}
	var config_view_skins_world = {
		"lightIntensity": 0,
		"color": 0,
		"fog": false,
		"skyLightIntensity": 0.7,
		"skyLightPosition": config_view_skins_world_skyLightPosition,
		"ambientLightColor": 8947848
	}
	var config_view_skins_preload = [
		"image|/res/xd-view/meshes/grey.png",
		"image|/res/xd-view/meshes/black.png",
		"image|/res/xd-view/meshes/white.png",
		"image|/res/xd-view/meshes/green.png",
		"image|/res/xd-view/meshes/skybox/nx.jpg",
		"image|/res/xd-view/meshes/skybox/ny.jpg",
		"image|/res/xd-view/meshes/skybox/nz.jpg",
		"image|/res/xd-view/meshes/skybox/px.jpg",
		"image|/res/xd-view/meshes/skybox/py.jpg",
		"image|/res/xd-view/meshes/skybox/pz.jpg"
	]
	var config_view_skins = {
		"name": "classic3d",
		"title": "3D Classic",
		"3d": true,
		"camera": config_view_skins_camera,
		"world": config_view_skins_world,
		"preload": config_view_skins_preload
	}
	var config_view_skins_preload_2 = [
		"image|/res/images/ball_black.png",
		"image|/res/images/ball_white.png",
		"image|/res/images/ball_green.png",
		"image|/res/images/plot.png",
		"image|/res/images/wood.png"
	]
	var config_view_skins_2 = {
		"name": "wood",
		"title": "Wood",
		"preload": config_view_skins_preload_2
	}
	var config_view_skins_preload_3 = [
		"image|/res/images/ball_black.png",
		"image|/res/images/ball_white.png",
		"image|/res/images/ball_green.png",
		"image|/res/images/plot.png"
	]
	var config_view_skins_3 = {
		"name": "classical",
		"title": "Classic",
		"preload": config_view_skins_preload_3
	}
	var config_view_skins_4 = [
		config_view_skins,
		config_view_skins_2,
		config_view_skins_3
	]
	var modelScripts_2 = [
		"spbase-model.js",
		"spline-model.js",
		"splineplus-model.js"
	]
	var modelScripts_3 = [
		"spbase-model.js",
		"margo-model.js"
	]
	var config_model_description = {
		"en": "description.html",
		"fr": "description-fr.html"
	}
	var config_model_credits = {
		"en": "credits.html",
		"fr": "credits-fr.html"
	}
	var config_model_rules = {
		"en": "rules.html",
		"fr": "rules-fr.html"
	}
	var config_view_js_2 = [
		"spbase-xd-view.js"
	]
	var config_model_levels_3 = {
		"label": "Fast (1sec)",
		"maxDuration": 1,
		"isDefault": true,
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0,
		"ignoreLeaf": false,
		"uncertaintyFactor": 0
	}
	var config_model_levels_4 = {
		"label": "Beginner",
		"maxDuration": 1,
		"maxNodes": 250,
		"maxLoops": 50,
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0,
		"ignoreLeaf": false,
		"uncertaintyFactor": 0
	}
	var config_model_levels_5 = {
		"label": "Easy",
		"maxDuration": 2,
		"maxNodes": 500,
		"maxLoops": 100,
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0,
		"ignoreLeaf": false,
		"uncertaintyFactor": 0
	}
	var config_model_levels_6 = {
		"label": "Medium",
		"maxDuration": 4,
		"maxNodes": 2500,
		"maxLoops": 200,
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0,
		"ignoreLeaf": false,
		"uncertaintyFactor": 0
	}
	var config_model_levels_7 = {
		"label": "Confirmed",
		"maxDuration": 8,
		"maxNodes": 5000,
		"maxLoops": 500,
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0,
		"ignoreLeaf": false,
		"uncertaintyFactor": 0
	}
	var config_model_levels_8 = {
		"label": "Slow (10sec)",
		"maxDuration": 10,
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0,
		"ignoreLeaf": false,
		"uncertaintyFactor": 0
	}
	var config_model_levels_9 = [
		config_model_levels_3,
		config_model_levels_4,
		config_model_levels_5,
		config_model_levels_6,
		config_model_levels_7,
		config_model_levels_8
	]
	return [
		{
			"name": "shibumi-spline",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Spline",
					"summary": "Shibumi game",
					"js": modelScripts,
					"levels": [
						{
							"label": "Beginner",
							"potential": 1000,
							"isDefault": true,
							"maxDepth": 1
						},
						config_model_levels,
						config_model_levels_2,
						{
							"label": "Confirmed",
							"potential": 10000,
							"maxDepth": 8
						}
					],
					"thumbnail": "tn-shibumi-spline.png",
					"strings": config_model_strings,
					"module": "margo",
					"description": {
						"en": "description-spline.html",
						"fr": "description-spline.html"
					},
					"credits": {
						"en": "credits-spline.html",
						"fr": "credits-spline.html"
					},
					"demoRandom": true,
					"gameOptions": config_model_gameOptions,
					"plazza": "true",
					"rules": {
						"en": "rules-spline.html",
						"fr": "rules-spline.html"
					}
				},
				"view": {
					"title-en": "Margo View",
					"visuals": {
						"600x600": [
							"res/visuals/spline-600x600-3d.jpg",
							"res/visuals/spline-600x600-2d.jpg"
						]
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"module": "margo",
					"useNotation": true,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_4,
					"animateSelfMoves": false,
					"preferredRatio": 1
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "shibumi-splineplus",
			"modelScripts": modelScripts_2,
			"config": {
				"status": true,
				"model": {
					"title-en": "Spline+",
					"summary": "Shibumi game",
					"js": modelScripts_2,
					"levels": [
						{
							"potential": 1000,
							"isDefault": true,
							"maxDepth": 1
						},
						config_model_levels,
						config_model_levels_2,
						{
							"potential": 20000,
							"maxDepth": 8
						}
					],
					"thumbnail": "tn-shibumi-spline-plus.png",
					"strings": config_model_strings,
					"module": "margo",
					"description": {
						"en": "description-splineplus.html",
						"fr": "description-splineplus.html"
					},
					"credits": {
						"en": "credits-splineplus.html",
						"fr": "credits-splineplus.html"
					},
					"demoRandom": true,
					"gameOptions": config_model_gameOptions,
					"plazza": "true",
					"rules": {
						"en": "rules-splineplus.html",
						"fr": "rules-splineplus.html"
					}
				},
				"view": {
					"title-en": "Margo View",
					"visuals": {
						"600x600": [
							"res/visuals/splineplus-600x600-3d.jpg",
							"res/visuals/splineplus-600x600-2d.jpg"
						]
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"module": "margo",
					"useNotation": true,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_4,
					"animateSelfMoves": false,
					"preferredRatio": 1
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "shibumi-spargo",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "Spargo",
					"summary": "Margo on the Shibumi platform",
					"js": modelScripts_3,
					"levels": [
						{
							"label": "Fast (1sec)",
							"maxDuration": 1,
							"isDefault": true,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.0450571101395
						},
						{
							"label": "Beginner",
							"maxDuration": 1,
							"maxNodes": 250,
							"maxLoops": 50,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.0450571101395
						},
						{
							"label": "Easy",
							"maxDuration": 2,
							"maxNodes": 500,
							"maxLoops": 100,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.0450571101395
						},
						{
							"label": "Medium",
							"maxDuration": 4,
							"maxNodes": 2500,
							"maxLoops": 200,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.0450571101395
						},
						{
							"label": "Confirmed",
							"maxDuration": 8,
							"maxNodes": 5000,
							"maxLoops": 500,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.0450571101395
						},
						{
							"label": "Slow (10sec)",
							"maxDuration": 10,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.0450571101395
						}
					],
					"thumbnail": "tn-spargo.png",
					"strings": config_model_strings,
					"module": "margo",
					"description": config_model_description,
					"credits": config_model_credits,
					"demoRandom": true,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "states",
						"uctIgnoreLoop": true,
						"size": 4,
						"levelOptions": {
							"evalSafety3fMore": 42.512798629808,
							"evalSafety": 19.107304715313,
							"evalSafetyXEyesBonus": 1.7865484737243,
							"evalSafety1f": 9.1591122993614,
							"evalSafety3f": 35.452884571656,
							"evalSafety2eyes": 4.3758955150703,
							"evalSafety3fMoreBonus": 0.74012620371718,
							"evalSafety1eyeBonus": 5.894529516766,
							"evalSafetyPinnedBonus": 0,
							"evalHeightRatio": 0,
							"evalCenterRatio": 0.09143959872229
						}
					},
					"plazza": "true",
					"rules": config_model_rules
				},
				"view": {
					"title-en": "Margo View",
					"visuals": {
						"600x600": [
							"res/visuals/spargo-600x600-3d.jpg",
							"res/visuals/spargo-600x600-2d.jpg"
						]
					},
					"js": config_view_js_2,
					"xdView": true,
					"css": config_view_css,
					"module": "margo",
					"useNotation": true,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_4,
					"animateSelfMoves": false,
					"preferredRatio": 1
				}
			},
			"viewScripts": config_view_js_2
		},
		{
			"name": "margo5",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "Margo 5",
					"summary": "Margo game",
					"js": modelScripts_3,
					"levels": config_model_levels_9,
					"thumbnail": "tn-margo5.png",
					"strings": config_model_strings,
					"module": "margo",
					"description": config_model_description,
					"credits": config_model_credits,
					"demoRandom": true,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "states",
						"uctIgnoreLoop": true,
						"size": 5,
						"levelOptions": {
							"evalSafety3fMore": 33.941637893389,
							"evalSafety": 11.750749731517,
							"evalSafetyXEyesBonus": 1.7649150399344,
							"evalSafety1f": 9.3661218573064,
							"evalSafety3f": 27.890795686826,
							"evalSafety2eyes": 22.177834740058,
							"evalSafety3fMoreBonus": 0.9758058890196,
							"evalSafety1eyeBonus": 7.4647745586541,
							"evalSafetyPinnedBonus": 0.5745794638283,
							"evalHeightRatio": 1.8008592868854,
							"evalCenterRatio": 0.12634283054723
						}
					},
					"plazza": "true",
					"rules": config_model_rules
				},
				"view": {
					"title-en": "Margo View",
					"visuals": {
						"600x600": [
							"res/visuals/margo5-600x600-3d.jpg",
							"res/visuals/margo5-600x600-2d.jpg"
						]
					},
					"js": config_view_js_2,
					"xdView": true,
					"css": config_view_css,
					"module": "margo",
					"useNotation": true,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_4,
					"animateSelfMoves": false,
					"preferredRatio": 1
				}
			},
			"viewScripts": config_view_js_2
		},
		{
			"name": "margo6",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "Margo 6",
					"summary": "Margo game",
					"js": modelScripts_3,
					"levels": config_model_levels_9,
					"thumbnail": "tn-margo6.png",
					"strings": config_model_strings,
					"module": "margo",
					"description": config_model_description,
					"credits": config_model_credits,
					"demoRandom": true,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "states",
						"uctIgnoreLoop": true,
						"size": 6,
						"levelOptions": {
							"evalSafety3fMore": 28.254787541129,
							"evalSafety": 18.087998411946,
							"evalSafetyXEyesBonus": 1.7649150399344,
							"evalSafety1f": 9.163683726905,
							"evalSafety3f": 27.587078130791,
							"evalSafety2eyes": 33.190368679179,
							"evalSafety3fMoreBonus": 0.93791029877741,
							"evalSafety1eyeBonus": 9.1829299172843,
							"evalSafetyPinnedBonus": 0.3350934287035,
							"evalHeightRatio": 1.3477082543829,
							"evalCenterRatio": 0.091233102472746
						}
					},
					"plazza": "true",
					"rules": config_model_rules
				},
				"view": {
					"title-en": "Margo View",
					"visuals": {
						"600x600": [
							"res/visuals/margo6-600x600-3d.jpg",
							"res/visuals/margo6-600x600-2d.jpg"
						]
					},
					"js": config_view_js_2,
					"xdView": true,
					"css": config_view_css,
					"module": "margo",
					"useNotation": true,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_4,
					"animateSelfMoves": false,
					"preferredRatio": 1
				}
			},
			"viewScripts": config_view_js_2
		},
		{
			"name": "margo7",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "Margo 7",
					"summary": "Margo game",
					"js": modelScripts_3,
					"levels": [
						{
							"label": "Fast (1sec)",
							"maxDuration": 1,
							"isDefault": true,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.1607776901587
						},
						{
							"label": "Beginner",
							"maxDuration": 1,
							"maxNodes": 250,
							"maxLoops": 50,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.1607776901587
						},
						{
							"label": "Easy",
							"maxDuration": 2,
							"maxNodes": 500,
							"maxLoops": 100,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.1607776901587
						},
						{
							"label": "Medium",
							"maxDuration": 4,
							"maxNodes": 2500,
							"maxLoops": 200,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.1607776901587
						},
						{
							"label": "Confirmed",
							"maxDuration": 8,
							"maxNodes": 5000,
							"maxLoops": 500,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.1607776901587
						},
						{
							"label": "Slow (10sec)",
							"maxDuration": 10,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0,
							"ignoreLeaf": false,
							"uncertaintyFactor": 1.1607776901587
						}
					],
					"thumbnail": "tn-margo7.png",
					"strings": config_model_strings,
					"module": "margo",
					"description": config_model_description,
					"credits": config_model_credits,
					"demoRandom": true,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "states",
						"uctIgnoreLoop": true,
						"size": 7,
						"levelOptions": {
							"evalSafety3fMore": 34.25098499078,
							"evalSafety": 20,
							"evalSafetyXEyesBonus": 1.341487216319,
							"evalSafety1f": 9.6161542055582,
							"evalSafety3f": 39.04195901009,
							"evalSafety2eyes": 19.585075193114,
							"evalSafety3fMoreBonus": 0.74764503238808,
							"evalSafety1eyeBonus": 6.6109850341,
							"evalSafetyPinnedBonus": 0,
							"evalHeightRatio": 1.8392730390391,
							"evalCenterRatio": 0.077991601047649
						}
					},
					"plazza": "true",
					"rules": config_model_rules
				},
				"view": {
					"title-en": "Margo View",
					"visuals": {
						"600x600": [
							"res/visuals/margo7-600x600-3d.jpg",
							"res/visuals/margo7-600x600-2d.jpg"
						]
					},
					"js": config_view_js_2,
					"xdView": true,
					"css": config_view_css,
					"module": "margo",
					"useNotation": true,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_4,
					"animateSelfMoves": false,
					"preferredRatio": 1
				}
			},
			"viewScripts": config_view_js_2
		},
		{
			"name": "margo8",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "Margo 8",
					"summary": "Margo game",
					"js": modelScripts_3,
					"levels": [
						{
							"label": "Fast (1sec)",
							"maxDuration": 1,
							"isDefault": true,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0.16486250067757,
							"ignoreLeaf": false,
							"uncertaintyFactor": 0
						},
						{
							"label": "Beginner",
							"maxDuration": 1,
							"maxNodes": 250,
							"maxLoops": 50,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0.16486250067757,
							"ignoreLeaf": false,
							"uncertaintyFactor": 0
						},
						{
							"label": "Easy",
							"maxDuration": 2,
							"maxNodes": 500,
							"maxLoops": 100,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0.16486250067757,
							"ignoreLeaf": false,
							"uncertaintyFactor": 0
						},
						{
							"label": "Medium",
							"maxDuration": 4,
							"maxNodes": 2500,
							"maxLoops": 200,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0.16486250067757,
							"ignoreLeaf": false,
							"uncertaintyFactor": 0
						},
						{
							"label": "Confirmed",
							"maxDuration": 8,
							"maxNodes": 5000,
							"maxLoops": 500,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0.16486250067757,
							"ignoreLeaf": false,
							"uncertaintyFactor": 0
						},
						{
							"label": "Slow (10sec)",
							"maxDuration": 10,
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0.16486250067757,
							"ignoreLeaf": false,
							"uncertaintyFactor": 0
						}
					],
					"thumbnail": "tn-margo8.png",
					"strings": config_model_strings,
					"module": "margo",
					"description": config_model_description,
					"credits": config_model_credits,
					"demoRandom": true,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "states",
						"uctIgnoreLoop": true,
						"size": 8,
						"levelOptions": {
							"evalSafety3fMore": 46.937096046536,
							"evalSafety": 20,
							"evalSafetyXEyesBonus": 1.7649150399344,
							"evalSafety1f": 10,
							"evalSafety3f": 31.878459454792,
							"evalSafety2eyes": 20.316545249669,
							"evalSafety3fMoreBonus": 1.1493006038375,
							"evalSafety1eyeBonus": 6.0032010946565,
							"evalSafetyPinnedBonus": 0,
							"evalHeightRatio": 1.146771970669,
							"evalCenterRatio": 0.07973781159539
						}
					},
					"plazza": "true",
					"rules": config_model_rules
				},
				"view": {
					"title-en": "Margo View",
					"visuals": {
						"600x600": [
							"res/visuals/margo8-600x600-3d.jpg",
							"res/visuals/margo8-600x600-2d.jpg"
						]
					},
					"js": config_view_js_2,
					"xdView": true,
					"css": config_view_css,
					"module": "margo",
					"useNotation": true,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_4,
					"animateSelfMoves": false,
					"preferredRatio": 1
				}
			},
			"viewScripts": config_view_js_2
		}
	]
})()