exports.games = (function() {
	var modelScripts = [
		"checkersbase-model.js",
		"alquerque-model.js"
	]
	var config_model_gameOptions_initial_a = [
		0,
		0
	]
	var config_model_gameOptions_initial_a_2 = [
		0,
		1
	]
	var config_model_gameOptions_initial_a_3 = [
		0,
		2
	]
	var config_model_gameOptions_initial_a_4 = [
		0,
		3
	]
	var config_model_gameOptions_initial_a_5 = [
		0,
		4
	]
	var config_model_gameOptions_initial_a_6 = [
		1,
		0
	]
	var config_model_gameOptions_initial_a_7 = [
		1,
		1
	]
	var config_model_gameOptions_initial_a_8 = [
		1,
		2
	]
	var config_model_gameOptions_initial_a_9 = [
		1,
		3
	]
	var config_model_gameOptions_initial_a_10 = [
		1,
		4
	]
	var config_model_gameOptions_initial_a_11 = [
		2,
		3
	]
	var config_model_gameOptions_initial_a_12 = [
		2,
		4
	]
	var config_model_gameOptions_initial_a_13 = [
		config_model_gameOptions_initial_a,
		config_model_gameOptions_initial_a_2,
		config_model_gameOptions_initial_a_3,
		config_model_gameOptions_initial_a_4,
		config_model_gameOptions_initial_a_5,
		config_model_gameOptions_initial_a_6,
		config_model_gameOptions_initial_a_7,
		config_model_gameOptions_initial_a_8,
		config_model_gameOptions_initial_a_9,
		config_model_gameOptions_initial_a_10,
		config_model_gameOptions_initial_a_11,
		config_model_gameOptions_initial_a_12
	]
	var config_model_gameOptions_initial_b = [
		4,
		0
	]
	var config_model_gameOptions_initial_b_2 = [
		4,
		1
	]
	var config_model_gameOptions_initial_b_3 = [
		4,
		2
	]
	var config_model_gameOptions_initial_b_4 = [
		4,
		3
	]
	var config_model_gameOptions_initial_b_5 = [
		4,
		4
	]
	var config_model_gameOptions_initial_b_6 = [
		3,
		0
	]
	var config_model_gameOptions_initial_b_7 = [
		3,
		1
	]
	var config_model_gameOptions_initial_b_8 = [
		3,
		2
	]
	var config_model_gameOptions_initial_b_9 = [
		3,
		3
	]
	var config_model_gameOptions_initial_b_10 = [
		3,
		4
	]
	var config_model_gameOptions_initial_b_11 = [
		2,
		0
	]
	var config_model_gameOptions_initial_b_12 = [
		2,
		1
	]
	var config_model_gameOptions_initial_b_13 = [
		config_model_gameOptions_initial_b,
		config_model_gameOptions_initial_b_2,
		config_model_gameOptions_initial_b_3,
		config_model_gameOptions_initial_b_4,
		config_model_gameOptions_initial_b_5,
		config_model_gameOptions_initial_b_6,
		config_model_gameOptions_initial_b_7,
		config_model_gameOptions_initial_b_8,
		config_model_gameOptions_initial_b_9,
		config_model_gameOptions_initial_b_10,
		config_model_gameOptions_initial_b_11,
		config_model_gameOptions_initial_b_12
	]
	var config_model_gameOptions_initial = {
		"a": config_model_gameOptions_initial_a_13,
		"b": config_model_gameOptions_initial_b_13
	}
	var config_model_levels = {
		"label": "Fast",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.5,
		"maxDuration": 1,
		"isDefault": true
	}
	var config_model_levels_2 = {
		"label": "Beginner",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.5,
		"maxDuration": 0.5,
		"maxNodes": 100,
		"maxLoops": 200
	}
	var config_model_levels_3 = {
		"label": "Easy",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.5,
		"maxDuration": 1,
		"maxNodes": 2500,
		"maxLoops": 500
	}
	var config_model_levels_4 = {
		"label": "Medium",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.5,
		"maxDuration": 2,
		"maxNodes": 5500,
		"maxLoops": 500
	}
	var config_model_levels_5 = {
		"label": "Hard",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.5,
		"maxDuration": 5,
		"maxNodes": 2000,
		"maxLoops": 3500
	}
	var config_model_levels_6 = {
		"label": "Expert",
		"maxLoops": 8000,
		"c": 0.8,
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"ai": "uct",
		"uncertaintyFactor": 5,
		"propagateMultiVisits": false,
		"maxDuration": 60,
		"maxNodes": 15000,
		"ignoreLeaf": false
	}
	var config_model_levels_7 = [
		config_model_levels,
		config_model_levels_2,
		config_model_levels_3,
		config_model_levels_4,
		config_model_levels_5,
		config_model_levels_6
	]
	var config_view_css = [
		"checkersbase.css",
		"alquerque.css"
	]
	var config_view_js = [
		"checkers-xd-view.js",
		"alquerque-xd-view.js"
	]
	var config_view_skins_camera = {
		"radius": 20,
		"elevationAngle": 45,
		"limitCamMoves": true
	}
	var config_view_skins_world_lightPosition = {
		"x": -5,
		"y": 18,
		"z": 5
	}
	var config_view_skins_world = {
		"lightIntensity": 0.8,
		"color": 0,
		"fog": false,
		"lightPosition": config_view_skins_world_lightPosition,
		"lightShadowDarkness": 0.55,
		"ambientLightColor": 0
	}
	var config_view_skins = {
		"name": "2d-wood-alquerque",
		"title": "Wood"
	}
	var config_view_sounds = {
		"move1": "alq_move1",
		"move2": "alq_move2",
		"move3": "alq_move3",
		"move4": "alq_move2",
		"tac1": "alq_tac1",
		"tac2": "alq_tac2",
		"tac3": "alq_tac1",
		"promo": null,
		"usermove": null
	}
	var config_view_defaultOptions = {
		"sounds": true,
		"notation": false,
		"moves": true
	}
	var modelScripts_2 = [
		"checkersbase-model.js",
		"alquerque-arabic-model.js"
	]
	var config_view_js_2 = [
		"checkers-xd-view.js",
		"checkers-xd-view-captbreak.js",
		"alquerque-xd-view.js"
	]
	var modelScripts_3 = [
		"checkersbase-model.js",
		"draughts-model.js"
	]
	var config_model_gameOptions_initial_a_14 = [
		2,
		2
	]
	var config_model_gameOptions_initial_b_14 = [
		7,
		0
	]
	var config_model_gameOptions_initial_b_15 = [
		7,
		1
	]
	var config_model_gameOptions_initial_b_16 = [
		7,
		2
	]
	var config_model_gameOptions_initial_b_17 = [
		7,
		3
	]
	var config_model_gameOptions_initial_b_18 = [
		6,
		0
	]
	var config_model_gameOptions_initial_b_19 = [
		6,
		1
	]
	var config_model_gameOptions_initial_b_20 = [
		6,
		2
	]
	var config_model_gameOptions_initial_b_21 = [
		6,
		3
	]
	var config_model_gameOptions_initial_b_22 = [
		6,
		4
	]
	var config_view_css_2 = [
		"checkersbase.css",
		"draughts.css"
	]
	var config_view_js_3 = [
		"checkers-xd-view.js",
		"draughts10-xd-view.js"
	]
	var config_view_skins_camera_2 = {
		"radius": 24,
		"elevationAngle": 65,
		"limitCamMoves": true,
		"distMax": 30,
		"fov": 35
	}
	var config_view_skins_world_lightPosition_2 = {
		"x": -15,
		"y": 15,
		"z": 0
	}
	var config_view_skins_world_2 = {
		"lightIntensity": 0.7,
		"skyLightIntensity": 0.5,
		"lightPosition": config_view_skins_world_lightPosition_2,
		"lightShadowDarkness": 0.45,
		"ambientLightColor": 8947848,
		"color": 4686804,
		"fog": false
	}
	var config_view_skins_preload = [
		"image|/res/images/wood-chipboard-5.jpg",
		"image|/res/xd-view/meshes/piecetop-bump.jpg",
		"image|/res/xd-view/meshes/piecediff.jpg",
		"image|/res/xd-view/meshes/piecetop-queen-mask.png",
		"smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/piece-v2.js"
	]
	var config_view_skins_2 = {
		"name": "classic3d",
		"title": "3D Classic",
		"3d": true,
		"camera": config_view_skins_camera_2,
		"world": config_view_skins_world_2,
		"preload": config_view_skins_preload
	}
	var config_view_skins_camera_3 = {
		"radius": 14,
		"elevationAngle": 45,
		"limitCamMoves": true,
		"distMax": 40
	}
	var config_view_skins_world_3 = {
		"lightIntensity": 0,
		"skyLightIntensity": 3,
		"fog": true,
		"color": 3645658,
		"lightPosition": config_view_skins_world_lightPosition,
		"lightShadowDarkness": 0.55,
		"ambientLightColor": 4473924
	}
	var config_view_skins_preload_2 = [
		"image|/res/images/wood-chipboard-5.jpg",
		"image|/res/xd-view/meshes/turtle.png",
		"image|/res/xd-view/meshes/star.png",
		"image|/res/xd-view/meshes/rock.jpg",
		"smoothedfilegeo|0|/res/xd-view/meshes/turtle-legs-smoothed.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/turtle-head-smoothed.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/turtle-tail-smoothed.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/turtle-hotel.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/turtle-house.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/rainbowflat.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/rocksmoothed.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/turtle-fences.js"
	]
	var config_view_skins_3 = {
		"name": "turtles3d",
		"title": "3D Turtles",
		"3d": true,
		"camera": config_view_skins_camera_3,
		"world": config_view_skins_world_3,
		"preload": config_view_skins_preload_2
	}
	var config_view_skins_4 = {
		"name": "classical",
		"title": "Classic"
	}
	var config_view_skins_5 = {
		"name": "wood0",
		"title": "Wood"
	}
	var config_view_skins_6 = {
		"name": "marble0",
		"title": "Marble"
	}
	var config_view_skins_7 = {
		"name": "green",
		"title": "Green"
	}
	var config_view_sounds_2 = {
		"move1": "move1",
		"move2": "move2",
		"move3": "move3",
		"move4": "move4",
		"tac1": "tac1",
		"tac2": "tac1",
		"tac3": "tac1",
		"promo": "promo",
		"usermove": null
	}
	var config_model_gameOptions_initial_a_15 = [
		config_model_gameOptions_initial_a,
		config_model_gameOptions_initial_a_2,
		config_model_gameOptions_initial_a_3,
		config_model_gameOptions_initial_a_4,
		config_model_gameOptions_initial_a_6,
		config_model_gameOptions_initial_a_7,
		config_model_gameOptions_initial_a_8,
		config_model_gameOptions_initial_a_9,
		config_model_gameOptions_initial_b_11,
		config_model_gameOptions_initial_b_12,
		config_model_gameOptions_initial_a_14,
		config_model_gameOptions_initial_a_11
	]
	var config_model_gameOptions_initial_b_23 = [
		5,
		0
	]
	var config_model_gameOptions_initial_b_24 = [
		5,
		1
	]
	var config_model_gameOptions_initial_b_25 = [
		5,
		2
	]
	var config_model_gameOptions_initial_b_26 = [
		5,
		3
	]
	var config_model_gameOptions_initial_b_27 = [
		config_model_gameOptions_initial_b_14,
		config_model_gameOptions_initial_b_15,
		config_model_gameOptions_initial_b_16,
		config_model_gameOptions_initial_b_17,
		config_model_gameOptions_initial_b_18,
		config_model_gameOptions_initial_b_19,
		config_model_gameOptions_initial_b_20,
		config_model_gameOptions_initial_b_21,
		config_model_gameOptions_initial_b_23,
		config_model_gameOptions_initial_b_24,
		config_model_gameOptions_initial_b_25,
		config_model_gameOptions_initial_b_26
	]
	var config_model_gameOptions_initial_2 = {
		"a": config_model_gameOptions_initial_a_15,
		"b": config_model_gameOptions_initial_b_27
	}
	var config_view_js_4 = [
		"checkers-xd-view.js",
		"draughts8-xd-view.js"
	]
	var config_view_skins_8 = [
		config_view_skins_2,
		config_view_skins_3,
		config_view_skins_4,
		config_view_skins_6,
		config_view_skins_5,
		config_view_skins_7
	]
	var config_model_gameOptions_variant = {
		"mustMoveForwardStrict": true,
		"lastRowCrown": true,
		"captureLongestLine": true,
		"lastRowFactor": 0.001
	}
	var config_model_gameOptions = {
		"preventRepeat": true,
		"width": 4,
		"height": 8,
		"initial": config_model_gameOptions_initial_2,
		"variant": config_model_gameOptions_variant,
		"uctTransposition": "state"
	}
	var config_view_visuals_600x600 = [
		"res/visuals/brazilian-draughts-600x600-3d.jpg",
		"res/visuals/brazilian-draughts-600x600-2d.jpg"
	]
	var config_view_visuals = {
		"600x600": config_view_visuals_600x600
	}
	var config_view = {
		"title-en": "Draughts View",
		"preferredRatio": 1,
		"js": config_view_js_4,
		"skins": config_view_skins_8,
		"visuals": config_view_visuals,
		"sounds": config_view_sounds_2,
		"module": "checkers",
		"css": config_view_css_2,
		"switchable": true,
		"animateSelfMoves": false,
		"useNotation": true,
		"useShowMoves": true,
		"defaultOptions": config_view_defaultOptions,
		"xdView": true
	}
	var config_view_js_5 = [
		"checkersbase-view.js",
		"draughts-view.js"
	]
	var config_view_js_6 = [
		"checkers-xd-view.js",
		"draughts6-xd-view.js"
	]
	var modelScripts_4 = [
		"checkersbase-model.js",
		"turkish-model.js"
	]
	var config_view_js_7 = [
		"checkers-xd-view.js",
		"turkish-xd-view.js"
	]
	return [
		{
			"name": "alquerque-roman",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Roman Alquerque",
					"summary": "Alquerque as played in France and England.",
					"rules": "rules-alquerque-roman.html",
					"maxLevel": 20,
					"plazza": "true",
					"thumbnail": "alquerque-roman-thumb3d.png",
					"module": "checkers",
					"description": "description.html",
					"credits": "credits-alquerque-roman.html",
					"js": modelScripts,
					"gameOptions": {
						"preventRepeat": true,
						"width": 5,
						"height": 5,
						"initial": config_model_gameOptions_initial,
						"variant": {
							"canStepBack": true,
							"mustMoveForward": true,
							"lastRowFreeze": false,
							"noMove": "lose",
							"longRangeKing": false,
							"kingCaptureShort": false,
							"lastRowCrown": true,
							"captureInstantRemove": true,
							"canCaptureBackward": false
						}
					},
					"levels": config_model_levels_7
				},
				"view": {
					"title-en": "Roman Alquerque",
					"preferredRatio": 1,
					"css": config_view_css,
					"js": config_view_js,
					"skins": [
						{
							"name": "alquerque3d",
							"title": "3D Classic",
							"3d": true,
							"camera": config_view_skins_camera,
							"world": config_view_skins_world,
							"preload": [
								"image|/res/xd-view/meshes/red.png",
								"image|/res/xd-view/meshes/black.png",
								"image|/res/images/alquarqueboard1.jpg",
								"image|/res/xd-view/meshes/skybox/nx.jpg",
								"image|/res/xd-view/meshes/skybox/ny.jpg",
								"image|/res/xd-view/meshes/skybox/nz.jpg",
								"image|/res/xd-view/meshes/skybox/px.jpg",
								"image|/res/xd-view/meshes/skybox/py.jpg",
								"image|/res/xd-view/meshes/skybox/pz.jpg",
								"smoothedfilegeo|0|/res/xd-view/meshes/board-checkers-slot.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/board-alquerque-external-frame.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/board-checkers-triangle.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js"
							]
						},
						config_view_skins
					],
					"visuals": {
						"600x600": [
							"res/visuals/alquerque-roman-600x600-3d.jpg",
							"res/visuals/alquerque-roman-600x600-2d.jpg"
						]
					},
					"module": "checkers",
					"xdView": true,
					"switchable": true,
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"sounds": config_view_sounds,
					"defaultOptions": config_view_defaultOptions
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "alquerque-arabic",
			"modelScripts": modelScripts_2,
			"config": {
				"status": true,
				"model": {
					"title-en": "Arabic Alquerque",
					"summary": "Alquerque as played in Middle-East and Spain.",
					"rules": "rules-alquerque-arabic.html",
					"maxLevel": 20,
					"plazza": "true",
					"thumbnail": "alquerque-arabic-thumb.png",
					"module": "checkers",
					"description": "description.html",
					"credits": "credits-arabic.html",
					"js": modelScripts_2,
					"gameOptions": {
						"preventRepeat": true,
						"width": 5,
						"height": 5,
						"initial": config_model_gameOptions_initial,
						"variant": {
							"canStepBack": true,
							"mustMoveForward": true,
							"lastRowFreeze": false,
							"noMove": "lose",
							"longRangeKing": true,
							"kingCaptureShort": false,
							"lastRowCrown": true,
							"canCaptureBackward": false,
							"captureInstantRemove": true,
							"compulsoryCatch": false
						}
					},
					"levels": config_model_levels_7
				},
				"view": {
					"title-en": "Arabic Alquerque View",
					"preferredRatio": 1,
					"css": config_view_css,
					"js": config_view_js_2,
					"skins": [
						{
							"name": "alquerque3d",
							"title": "3D Classic",
							"3d": true,
							"camera": config_view_skins_camera,
							"world": config_view_skins_world,
							"preload": [
								"image|/res/xd-view/meshes/red.png",
								"image|/res/xd-view/meshes/black.png",
								"image|/res/xd-view/meshes/red-king.png",
								"image|/res/xd-view/meshes/black-king.png",
								"image|/res/images/alquarqueboard1.jpg",
								"image|/res/xd-view/meshes/skybox/nx.jpg",
								"image|/res/xd-view/meshes/skybox/ny.jpg",
								"image|/res/xd-view/meshes/skybox/nz.jpg",
								"image|/res/xd-view/meshes/skybox/px.jpg",
								"image|/res/xd-view/meshes/skybox/py.jpg",
								"image|/res/xd-view/meshes/skybox/pz.jpg",
								"smoothedfilegeo|0|/res/xd-view/meshes/board-checkers-slot.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/board-alquerque-external-frame.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/board-checkers-triangle.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js"
							]
						},
						config_view_skins
					],
					"visuals": {
						"600x600": [
							"res/visuals/alquerque-arabic-600x600-3d.jpg",
							"res/visuals/alquerque-arabic-600x600-2d.jpg"
						]
					},
					"module": "checkers",
					"xdView": true,
					"switchable": true,
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"sounds": config_view_sounds,
					"defaultOptions": config_view_defaultOptions
				}
			},
			"viewScripts": config_view_js_2
		},
		{
			"name": "draughts",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "International Draughts",
					"summary": "Rules for draughts as played in worldwide competitions.",
					"rules": "rules-draughts.html",
					"maxLevel": 20,
					"plazza": "true",
					"thumbnail": "draughts-thumb3d.png",
					"module": "checkers",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_3,
					"gameOptions": {
						"preventRepeat": true,
						"width": 5,
						"height": 10,
						"initial": {
							"a": [
								config_model_gameOptions_initial_a,
								config_model_gameOptions_initial_a_2,
								config_model_gameOptions_initial_a_3,
								config_model_gameOptions_initial_a_4,
								config_model_gameOptions_initial_a_5,
								config_model_gameOptions_initial_a_6,
								config_model_gameOptions_initial_a_7,
								config_model_gameOptions_initial_a_8,
								config_model_gameOptions_initial_a_9,
								config_model_gameOptions_initial_a_10,
								config_model_gameOptions_initial_b_11,
								config_model_gameOptions_initial_b_12,
								config_model_gameOptions_initial_a_14,
								config_model_gameOptions_initial_a_11,
								config_model_gameOptions_initial_a_12,
								config_model_gameOptions_initial_b_6,
								config_model_gameOptions_initial_b_7,
								config_model_gameOptions_initial_b_8,
								config_model_gameOptions_initial_b_9,
								config_model_gameOptions_initial_b_10
							],
							"b": [
								[
									9,
									0
								],
								[
									9,
									1
								],
								[
									9,
									2
								],
								[
									9,
									3
								],
								[
									9,
									4
								],
								[
									8,
									0
								],
								[
									8,
									1
								],
								[
									8,
									2
								],
								[
									8,
									3
								],
								[
									8,
									4
								],
								config_model_gameOptions_initial_b_14,
								config_model_gameOptions_initial_b_15,
								config_model_gameOptions_initial_b_16,
								config_model_gameOptions_initial_b_17,
								[
									7,
									4
								],
								config_model_gameOptions_initial_b_18,
								config_model_gameOptions_initial_b_19,
								config_model_gameOptions_initial_b_20,
								config_model_gameOptions_initial_b_21,
								config_model_gameOptions_initial_b_22
							]
						},
						"variant": {
							"mustMoveForwardStrict": true,
							"lastRowCrown": true,
							"captureLongestLine": true,
							"lastRowFactor": 0.001,
							"captureInstantRemove": true
						},
						"uctTransposition": "state"
					},
					"levels": config_model_levels_7
				},
				"view": {
					"title-en": "Draughts View",
					"switchable": true,
					"css": config_view_css_2,
					"js": config_view_js_3,
					"skins": [
						config_view_skins_2,
						config_view_skins_3,
						config_view_skins_4,
						config_view_skins_5,
						config_view_skins_6,
						config_view_skins_7
					],
					"module": "checkers",
					"preferredRatio": 1,
					"xdView": true,
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"useAutoComplete": true,
					"defaultOptions": {
						"sounds": true,
						"notation": false,
						"moves": true,
						"autocomplete": true
					},
					"sounds": config_view_sounds_2,
					"visuals": {
						"600x600": [
							"res/visuals/draughts-600x600-3d.jpg",
							"res/visuals/draughts-600x600-2d.jpg"
						]
					}
				}
			},
			"viewScripts": config_view_js_3
		},
		{
			"name": "english-draughts",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "English Draughts",
					"summary": "A popular version of checkers on a 8x8 board.",
					"rules": "rules-brit-checkers.html",
					"maxLevel": 20,
					"plazza": "true",
					"thumbnail": "draughts8-thumb3d.png",
					"module": "checkers",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_3,
					"gameOptions": {
						"preventRepeat": true,
						"width": 4,
						"height": 8,
						"initial": config_model_gameOptions_initial_2,
						"variant": {
							"mustMoveForwardStrict": true,
							"lastRowCrown": true,
							"captureLongestLine": true,
							"longRangeKing": false,
							"kingCaptureShort": true,
							"lastRowFactor": 0.001,
							"kingValue": 2,
							"whiteStarts": false,
							"canCaptureBackward": false
						},
						"invertNotation": true,
						"uctTransposition": "state"
					},
					"levels": config_model_levels_7
				},
				"view": {
					"title-en": "Draughts View",
					"preferredRatio": 1,
					"js": config_view_js_4,
					"skins": config_view_skins_8,
					"visuals": {
						"600x600": [
							"res/visuals/english-draughts-600x600-3d.jpg",
							"res/visuals/english-draughts-600x600-2d.jpg"
						]
					},
					"sounds": config_view_sounds_2,
					"module": "checkers",
					"css": config_view_css_2,
					"switchable": true,
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"defaultOptions": config_view_defaultOptions,
					"xdView": true
				}
			},
			"viewScripts": config_view_js_4
		},
		{
			"name": "brazilian-draughts",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "Brazilian Draughts",
					"summary": "Same as international checkers on a 8x8 board.",
					"rules": "rules-brazilian-draughts.html",
					"maxLevel": 20,
					"plazza": "true",
					"thumbnail": "draughts8-thumb3d.png",
					"module": "checkers",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_3,
					"gameOptions": config_model_gameOptions,
					"levels": config_model_levels_7
				},
				"view": config_view
			},
			"viewScripts": config_view_js_4
		},
		{
			"name": "spanish-draughts",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "Spanish Draughts",
					"summary": "Same as international checkers on a 8x8 board, no backward capture.",
					"rules": "rules-spanish-draughts.html",
					"maxLevel": 20,
					"plazza": "true",
					"thumbnail": "draughts8-thumb3d.png",
					"module": "checkers",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_3,
					"gameOptions": {
						"preventRepeat": true,
						"width": 4,
						"height": 8,
						"initial": config_model_gameOptions_initial_2,
						"variant": {
							"mustMoveForwardStrict": true,
							"lastRowCrown": true,
							"captureLongestLine": true,
							"lastRowFactor": 0.001,
							"canCaptureBackward": false
						},
						"uctTransposition": "state"
					},
					"levels": config_model_levels_7
				},
				"view": config_view
			},
			"viewScripts": config_view_js_4
		},
		{
			"name": "brazilian-draughts-hlwn",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "Halloween Draughts",
					"summary": "Same as international checkers on a 8x8 board.",
					"thumbnail": "halloweenthumb.png",
					"module": "checkers",
					"maxLevel": 20,
					"obsolete": true,
					"plazza": "broken",
					"rules": "rules-brazilian-draughts.html",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_3,
					"gameOptions": config_model_gameOptions,
					"levels": config_model_levels_7
				},
				"view": {
					"title-en": "Draughts View",
					"preferredRatio": 1,
					"js": config_view_js_5,
					"skins": [
						{
							"name": "halloween",
							"title": "Halloween"
						}
					],
					"visuals": {
						"600x600": [
							"res/visuals/halloween-draughts-600x600-2d.jpg",
							"res/visuals/halloween-draughts-b-600x600-2d.jpg"
						]
					},
					"module": "checkers",
					"css": config_view_css_2,
					"switchable": true,
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"defaultOptions": config_view_defaultOptions,
					"preloadImages": {
						"pieces": "res/images/pieces.png"
					}
				}
			},
			"viewScripts": config_view_js_5
		},
		{
			"name": "german-draughts",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "German Draughts",
					"summary": "Checkers according to German Draughts rules.",
					"rules": "rules-german-draughts.html",
					"maxLevel": 20,
					"plazza": "true",
					"thumbnail": "draughts8-thumb3d.png",
					"module": "checkers",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_3,
					"gameOptions": {
						"preventRepeat": true,
						"width": 4,
						"height": 8,
						"initial": config_model_gameOptions_initial_2,
						"variant": {
							"mustMoveForwardStrict": true,
							"lastRowCrown": true,
							"captureLongestLine": false,
							"lastRowFactor": 0.001,
							"kingValue": 4,
							"kingCaptureShort": false,
							"captureInstantRemove": false
						},
						"uctTransposition": "state"
					},
					"levels": config_model_levels_7
				},
				"view": {
					"title-en": "Draughts View",
					"preferredRatio": 1,
					"js": config_view_js_4,
					"skins": config_view_skins_8,
					"visuals": {
						"600x600": [
							"res/visuals/german-draughts-600x600-3d.jpg",
							"res/visuals/german-draughts-600x600-2d.jpg"
						]
					},
					"sounds": config_view_sounds_2,
					"module": "checkers",
					"css": config_view_css_2,
					"switchable": true,
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"defaultOptions": config_view_defaultOptions,
					"xdView": true
				}
			},
			"viewScripts": config_view_js_4
		},
		{
			"name": "thai-draughts",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "Thai Draughts",
					"summary": "Checkers according to Thai rules.",
					"rules": "rules-thai-draughts.html",
					"maxLevel": 20,
					"plazza": "true",
					"thumbnail": "draughts8-thumb3d.png",
					"module": "checkers",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_3,
					"gameOptions": {
						"preventRepeat": true,
						"width": 4,
						"height": 8,
						"initial": {
							"a": [
								config_model_gameOptions_initial_a,
								config_model_gameOptions_initial_a_2,
								config_model_gameOptions_initial_a_3,
								config_model_gameOptions_initial_a_4,
								config_model_gameOptions_initial_a_6,
								config_model_gameOptions_initial_a_7,
								config_model_gameOptions_initial_a_8,
								config_model_gameOptions_initial_a_9
							],
							"b": [
								config_model_gameOptions_initial_b_14,
								config_model_gameOptions_initial_b_15,
								config_model_gameOptions_initial_b_16,
								config_model_gameOptions_initial_b_17,
								config_model_gameOptions_initial_b_18,
								config_model_gameOptions_initial_b_19,
								config_model_gameOptions_initial_b_20,
								config_model_gameOptions_initial_b_21
							]
						},
						"variant": {
							"mustMoveForwardStrict": true,
							"lastRowCrown": true,
							"captureLongestLine": false,
							"lastRowFactor": 0.001,
							"kingValue": 4,
							"kingCaptureShort": true,
							"captureInstantRemove": true,
							"noMove": "lose",
							"king180deg": true
						},
						"uctTransposition": "state"
					},
					"levels": config_model_levels_7
				},
				"view": {
					"title-en": "Draughts View",
					"preferredRatio": 1,
					"js": config_view_js_4,
					"skins": config_view_skins_8,
					"visuals": {
						"600x600": [
							"res/visuals/thai-draughts-600x600-3d.jpg",
							"res/visuals/thai-draughts-600x600-2d.jpg"
						]
					},
					"sounds": config_view_sounds_2,
					"module": "checkers",
					"css": config_view_css_2,
					"switchable": true,
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"defaultOptions": config_view_defaultOptions,
					"xdView": true
				}
			},
			"viewScripts": config_view_js_4
		},
		{
			"name": "kids-draughts",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "Kids Draughts",
					"summary": "A version for kids of checkers on a 6x6 board.",
					"rules": "rules-kids-draughts.html",
					"maxLevel": 20,
					"plazza": "true",
					"thumbnail": "kidsdraughts-thumb3d.png",
					"module": "checkers",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_3,
					"gameOptions": {
						"preventRepeat": true,
						"width": 3,
						"height": 6,
						"initial": {
							"a": [
								config_model_gameOptions_initial_a,
								config_model_gameOptions_initial_a_2,
								config_model_gameOptions_initial_a_3,
								config_model_gameOptions_initial_a_6,
								config_model_gameOptions_initial_a_7,
								config_model_gameOptions_initial_a_8
							],
							"b": [
								config_model_gameOptions_initial_b_23,
								config_model_gameOptions_initial_b_24,
								config_model_gameOptions_initial_b_25,
								config_model_gameOptions_initial_b,
								config_model_gameOptions_initial_b_2,
								config_model_gameOptions_initial_b_3
							]
						},
						"variant": config_model_gameOptions_variant,
						"uctTransposition": "state"
					},
					"levels": config_model_levels_7
				},
				"view": {
					"title-en": "Kids Draughts View",
					"animateSelfMoves": false,
					"js": config_view_js_6,
					"module": "checkers",
					"preferredRatio": 1,
					"switchable": true,
					"css": [
						"checkersbase.css",
						"draughts.css",
						"kids-draughts.css"
					],
					"useNotation": true,
					"useShowMoves": true,
					"defaultOptions": config_view_defaultOptions,
					"visuals": {
						"600x600": [
							"res/visuals/kids-draughts-600x600-3d.jpg",
							"res/visuals/kids-draughts-600x600-2d.jpg"
						]
					},
					"skins": [
						config_view_skins_3,
						{
							"name": "kids",
							"title": "Kids"
						}
					],
					"xdView": true
				}
			},
			"viewScripts": config_view_js_6
		},
		{
			"name": "turkish-draughts",
			"modelScripts": modelScripts_4,
			"config": {
				"status": true,
				"model": {
					"title-en": "Turkish Draughts",
					"summary": "A 8x8 checkers on straight lines.",
					"rules": "rules-turkish-draughts.html",
					"maxLevel": 20,
					"plazza": "true",
					"thumbnail": "turkish-thumb3d.png",
					"module": "checkers",
					"description": "description.html",
					"credits": "credits-turkish-draughts.html",
					"js": modelScripts_4,
					"gameOptions": {
						"preventRepeat": true,
						"width": 8,
						"height": 8,
						"initial": {
							"a": [
								config_model_gameOptions_initial_a_6,
								config_model_gameOptions_initial_a_7,
								config_model_gameOptions_initial_a_8,
								config_model_gameOptions_initial_a_9,
								config_model_gameOptions_initial_a_10,
								[
									1,
									5
								],
								[
									1,
									6
								],
								[
									1,
									7
								],
								config_model_gameOptions_initial_b_11,
								config_model_gameOptions_initial_b_12,
								config_model_gameOptions_initial_a_14,
								config_model_gameOptions_initial_a_11,
								config_model_gameOptions_initial_a_12,
								[
									2,
									5
								],
								[
									2,
									6
								],
								[
									2,
									7
								]
							],
							"b": [
								config_model_gameOptions_initial_b_18,
								config_model_gameOptions_initial_b_19,
								config_model_gameOptions_initial_b_20,
								config_model_gameOptions_initial_b_21,
								config_model_gameOptions_initial_b_22,
								[
									6,
									5
								],
								[
									6,
									6
								],
								[
									6,
									7
								],
								config_model_gameOptions_initial_b_23,
								config_model_gameOptions_initial_b_24,
								config_model_gameOptions_initial_b_25,
								config_model_gameOptions_initial_b_26,
								[
									5,
									4
								],
								[
									5,
									5
								],
								[
									5,
									6
								],
								[
									5,
									7
								]
							]
						},
						"variant": {
							"lastRowCrown": true,
							"mustMoveForward": true,
							"kingCaptureShort": false,
							"captureInstantRemove": true,
							"captureLongestLine": true,
							"canCaptureBackward": false
						},
						"uctTransposition": "state"
					},
					"levels": config_model_levels_7
				},
				"view": {
					"title-en": "Turkish Draughts View",
					"skins": [
						{
							"name": "turkish3d",
							"title": "3D Classic",
							"3d": true,
							"camera": {
								"radius": 14,
								"elevationAngle": 45,
								"limitCamMoves": true
							},
							"world": {
								"lightIntensity": 0.8,
								"color": 0,
								"fog": false,
								"lightPosition": {
									"x": -10,
									"y": 18,
									"z": 0
								},
								"ambientLightColor": 0
							},
							"preload": [
								"image|/res/images/wood-chipboard-5.jpg",
								"smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/turkish.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/turkish-queen.js"
							]
						},
						config_view_skins_7,
						config_view_skins_5,
						config_view_skins_6,
						config_view_skins_4
					],
					"xdView": true,
					"css": [
						"checkersbase.css",
						"turkish.css"
					],
					"js": config_view_js_7,
					"module": "checkers",
					"preferredRatio": 1,
					"visuals": {
						"600x600": [
							"res/visuals/turkish-draughts-600x600-3d.jpg",
							"res/visuals/turkish-draughts-600x600-2d.jpg"
						]
					},
					"sounds": config_view_sounds_2,
					"switchable": true,
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"defaultOptions": config_view_defaultOptions
				}
			},
			"viewScripts": config_view_js_7
		}
	]
})()