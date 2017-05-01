exports.games = (function() {
	var modelScripts = [
		"tafl-model.js"
	]
	var config_model_description = {
		"en": "description.html",
		"fr": "description-fr.html"
	}
	var config_model_credits = {
		"en": "credits.html",
		"fr": "credits-fr.html"
	}
	var config_model_gameOptions_levelOptions = {
		"attackersCountFactor": 10,
		"defendersCountFactor": -10,
		"kingPathFactor": -20,
		"kingFreedomFactor": -0.1,
		"distKingFactor": -0.05
	}
	var config_model_visuals = [
		"res/visuals/tablut-600x600-3d.jpg",
		"res/visuals/tablut-600x600-2d.jpg"
	]
	var config_model_levels = {
		"name": "easy",
		"label": "Easy",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.65,
		"uncertaintyFactor": 3,
		"useAlphaBeta": true,
		"maxNodes": 1000
	}
	var config_model_levels_2 = {
		"name": "fast",
		"label": "Fast [1sec]",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.65,
		"uncertaintyFactor": 3,
		"useAlphaBeta": true,
		"maxDuration": 1,
		"isDefault": true
	}
	var config_model_levels_3 = {
		"name": "strong",
		"label": "Strong",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.65,
		"uncertaintyFactor": 3,
		"useAlphaBeta": true,
		"maxNodes": 10000,
		"maxDuration": 10
	}
	var config_model_levels_4 = [
		config_model_levels,
		config_model_levels_2,
		config_model_levels_3
	]
	var config_view_js = [
		"tafl-xd-view.js"
	]
	var config_view_css = [
		"tafl.css"
	]
	var config_view_sounds = {
		"death1": "death1",
		"death2": "death2",
		"death3": "death3",
		"move1": "move1",
		"move3": "move3"
	}
	var config_view_defaultOptions = {
		"sounds": true,
		"moves": true,
		"notation": false
	}
	var config_view_skins_camera = {
		"limitCamMoves": true,
		"radius": 14,
		"rotationAngle": 90,
		"elevationAngle": 89.9,
		"elevationMin": 2,
		"elevationMax": 89.9
	}
	var config_view_skins_world_lightPosition = {
		"x": 10,
		"y": 5,
		"z": 0
	}
	var config_view_skins_world = {
		"lightIntensity": 0.8,
		"skyLightIntensity": 0.5,
		"lightCastShadow": false,
		"fog": false,
		"color": 1118481,
		"lightPosition": config_view_skins_world_lightPosition,
		"lightShadowDarkness": 0.55,
		"ambientLightColor": 4473924
	}
	var config_view_skins_preload = [
		"image|/res/xd-view/meshes/woodtoken-diffuse-black.jpg",
		"image|/res/xd-view/meshes/woodtoken-diffuse.jpg",
		"image|/res/images/ardriboard_bgx1024.jpg",
		"image|/res/images/ardricellborders.png",
		"image|/res/images/ardriblackcell.png",
		"image|/res/images/ardrikingcell.png",
		"image|/res/images/blackcell.png",
		"image|/res/images/whitecell.png",
		"smoothedfilegeo|0|/res/xd-view/meshes/taflboard.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/woodtoken.js"
	]
	var config_view_skins = {
		"name": "tafl3d",
		"title": "3D Classic",
		"3d": true,
		"camera": config_view_skins_camera,
		"world": config_view_skins_world,
		"preload": config_view_skins_preload
	}
	var config_view_skins_preload_2 = [
		"image|/res/xd-view/meshes/ardri-sprites.png",
		"image|/res/images/ardriboard_bgx1024.jpg",
		"image|/res/images/ardricellborders.png",
		"image|/res/images/ardriblackcell.png",
		"image|/res/images/ardrikingcell.png",
		"image|/res/images/blackcell.png",
		"image|/res/images/whitecell.png"
	]
	var config_view_skins_2 = {
		"name": "tafl2d",
		"title": "2D Classic",
		"3d": false,
		"preload": config_view_skins_preload_2
	}
	var config_view_skins_3 = [
		config_view_skins,
		config_view_skins_2
	]
	var config_model_gameOptions_exclude = [
		0,
		6,
		42,
		48
	]
	var config_model_visuals_2 = [
		"res/visuals/ardri-600x600-3d.jpg",
		"res/visuals/ardri-600x600-2d.jpg"
	]
	var config_model_gameOptions_exclude_2 = [
		0,
		10,
		110,
		120
	]
	var config_model_gameOptions_initial_defenders_soldiers = [
		38,
		48,
		49,
		50,
		58,
		59,
		61,
		62,
		70,
		71,
		72,
		82
	]
	var config_model_gameOptions_initial_defenders = {
		"king": 60,
		"soldiers": config_model_gameOptions_initial_defenders_soldiers
	}
	var config_model_visuals_3 = [
		"res/visuals/hnefatafl-600x600-3d.jpg",
		"res/visuals/hnefatafl-600x600-2d.jpg"
	]
	var config_model_visuals_4 = [
		"res/visuals/tawlbwrdd-600x600-3d.jpg",
		"res/visuals/tawlbwrdd-600x600-2d.jpg"
	]
	var config_model_visuals_5 = [
		"res/visuals/brandubh-600x600-3d.jpg",
		"res/visuals/brandubh-600x600-2d.jpg"
	]
	var config_model_visuals_6 = [
		"res/visuals/alea-evangelii-600x600-3d.jpg",
		"res/visuals/alea-evangelii-600x600-2d.jpg"
	]
	return [
		{
			"name": "tafl-tablut",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Tablut",
					"summary": "9x9 board (from Laponia)",
					"rules": {
						"en": "rules-tafl-tablut.html",
						"fr": "rules-tafl-tablut-fr.html"
					},
					"js": modelScripts,
					"plazza": "true",
					"thumbnail": "thumb-tafl-tablut.png",
					"module": "tafl",
					"description": config_model_description,
					"credits": config_model_credits,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "states",
						"levelOptions": config_model_gameOptions_levelOptions,
						"exclude": [
						],
						"attackers": 1,
						"longMove": true,
						"initial": {
							"attackers": [
								3,
								4,
								5,
								13,
								27,
								36,
								45,
								37,
								35,
								44,
								53,
								43,
								75,
								76,
								77,
								67
							],
							"defenders": {
								"king": 40,
								"soldiers": [
									22,
									31,
									38,
									39,
									41,
									42,
									49,
									58
								]
							}
						},
						"homeCatch": true,
						"privateHome": true,
						"centerDistance": 4
					},
					"demoRandom": true,
					"visuals": config_model_visuals,
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "Tafl view",
					"visuals": {
						"600x600": config_model_visuals
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"preferredRatio": 1,
					"switchable": true,
					"module": "tafl",
					"useNotation": true,
					"sounds": config_view_sounds,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_3,
					"animateSelfMoves": false,
					"useShowMoves": false
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "tafl-ardri",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Ardri",
					"summary": "7x7 board (from Scotland)",
					"rules": {
						"en": "rules-tafl-ardri.html",
						"fr": "rules-tafl-ardri-fr.html"
					},
					"js": modelScripts,
					"plazza": "true",
					"thumbnail": "thumb-tafl-ardri.png",
					"module": "tafl",
					"description": config_model_description,
					"credits": config_model_credits,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "states",
						"levelOptions": config_model_gameOptions_levelOptions,
						"exclude": config_model_gameOptions_exclude,
						"attackers": -1,
						"longMove": false,
						"initial": {
							"attackers": [
								2,
								3,
								4,
								10,
								14,
								21,
								28,
								22,
								20,
								27,
								34,
								26,
								44,
								45,
								46,
								38
							],
							"defenders": {
								"king": 24,
								"soldiers": [
									16,
									17,
									18,
									23,
									25,
									30,
									31,
									32
								]
							}
						},
						"homeCatch": true,
						"privateHome": true,
						"centerDistance": 3
					},
					"demoRandom": true,
					"visuals": config_model_visuals_2,
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "Tafl view",
					"visuals": {
						"600x600": config_model_visuals_2
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"preferredRatio": 1,
					"switchable": true,
					"module": "tafl",
					"useNotation": true,
					"sounds": config_view_sounds,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_3,
					"animateSelfMoves": false,
					"useShowMoves": false
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "tafl-hnefatafl",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Hnefatafl",
					"summary": "11x11 board (from Scandinavia)",
					"rules": {
						"en": "rules-tafl-hnefatafl.html",
						"fr": "rules-tafl-hnefatafl-fr.html"
					},
					"js": modelScripts,
					"plazza": "true",
					"thumbnail": "thumb-tafl-hnefatafl.png",
					"module": "tafl",
					"description": config_model_description,
					"credits": config_model_credits,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "states",
						"levelOptions": config_model_gameOptions_levelOptions,
						"exclude": config_model_gameOptions_exclude_2,
						"attackers": 1,
						"longMove": true,
						"initial": {
							"attackers": [
								3,
								4,
								5,
								6,
								7,
								16,
								33,
								44,
								55,
								66,
								77,
								56,
								43,
								54,
								65,
								76,
								87,
								64,
								113,
								114,
								115,
								116,
								117,
								104
							],
							"defenders": config_model_gameOptions_initial_defenders
						},
						"homeCatch": true,
						"privateHome": true,
						"centerDistance": 5
					},
					"demoRandom": true,
					"visuals": config_model_visuals_3,
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "Tafl view",
					"visuals": {
						"600x600": config_model_visuals_3
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"preferredRatio": 1,
					"switchable": true,
					"module": "tafl",
					"useNotation": true,
					"sounds": config_view_sounds,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_3,
					"animateSelfMoves": false,
					"useShowMoves": false
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "tawlbwrdd",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Tawlbwrdd",
					"summary": "11x11 board (from Wales)",
					"rules": {
						"en": "rules-tawlbwrdd.html",
						"fr": "rules-tawlbwrdd-fr.html"
					},
					"js": modelScripts,
					"plazza": "true",
					"thumbnail": "thumb-tawlbwrdd.png",
					"module": "tafl",
					"description": config_model_description,
					"credits": config_model_credits,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "states",
						"levelOptions": config_model_gameOptions_levelOptions,
						"exclude": config_model_gameOptions_exclude_2,
						"attackers": 1,
						"longMove": true,
						"initial": {
							"attackers": [
								4,
								5,
								6,
								15,
								17,
								27,
								44,
								55,
								66,
								45,
								67,
								57,
								54,
								65,
								76,
								53,
								75,
								63,
								114,
								115,
								116,
								103,
								105,
								93
							],
							"defenders": config_model_gameOptions_initial_defenders
						},
						"homeCatch": true,
						"privateHome": true,
						"centerDistance": 5
					},
					"demoRandom": true,
					"visuals": config_model_visuals_4,
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "Tafl view",
					"visuals": {
						"600x600": config_model_visuals_4
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"preferredRatio": 1,
					"switchable": true,
					"module": "tafl",
					"useNotation": true,
					"sounds": config_view_sounds,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_3,
					"animateSelfMoves": false,
					"useShowMoves": false
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "tafl-brandubh",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Brandubh",
					"summary": "7x7 board (from Ireland)",
					"rules": {
						"en": "rules-tafl-brandubh.html",
						"fr": "rules-tafl-brandubh-fr.html"
					},
					"js": modelScripts,
					"plazza": "true",
					"thumbnail": "thumb-tafl-brandubh.png",
					"module": "tafl",
					"description": config_model_description,
					"credits": config_model_credits,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "states",
						"levelOptions": config_model_gameOptions_levelOptions,
						"exclude": config_model_gameOptions_exclude,
						"attackers": 1,
						"longMove": false,
						"initial": {
							"attackers": [
								3,
								10,
								21,
								22,
								26,
								27,
								38,
								45
							],
							"defenders": {
								"king": 24,
								"soldiers": [
									17,
									23,
									25,
									31
								]
							}
						},
						"homeCatch": true,
						"privateHome": true,
						"centerDistance": 3
					},
					"demoRandom": true,
					"visuals": config_model_visuals_5,
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "Tafl view",
					"visuals": {
						"600x600": config_model_visuals_5
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"preferredRatio": 1,
					"switchable": true,
					"module": "tafl",
					"useNotation": true,
					"sounds": config_view_sounds,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_3,
					"animateSelfMoves": false,
					"useShowMoves": false
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "alea-evangelii",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Alea Evangelii",
					"summary": "19x19 board (from England)",
					"rules": {
						"en": "rules-alea-evangelii.html",
						"fr": "rules-alea-evangelii-fr.html"
					},
					"js": modelScripts,
					"plazza": "true",
					"thumbnail": "thumb-alea-evangelii.png",
					"module": "tafl",
					"description": config_model_description,
					"credits": config_model_credits,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "states",
						"levelOptions": config_model_gameOptions_levelOptions,
						"exclude": [
							0,
							18,
							342,
							360
						],
						"attackers": 1,
						"longMove": true,
						"initial": {
							"attackers": [
								2,
								5,
								13,
								16,
								38,
								43,
								51,
								56,
								95,
								113,
								97,
								111,
								344,
								347,
								358,
								355,
								304,
								309,
								317,
								322,
								247,
								249,
								265,
								263,
								64,
								66,
								68,
								136,
								174,
								212,
								148,
								186,
								224,
								292,
								294,
								296,
								82,
								100,
								118,
								88,
								108,
								128,
								242,
								260,
								278,
								232,
								252,
								272
							],
							"defenders": {
								"king": 180,
								"soldiers": [
									84,
									86,
									156,
									194,
									166,
									204,
									274,
									276,
									123,
									141,
									143,
									159,
									161,
									163,
									177,
									179,
									181,
									183,
									197,
									199,
									201,
									217,
									219,
									237
								]
							}
						},
						"homeCatch": true,
						"privateHome": true,
						"centerDistance": 9
					},
					"demoRandom": true,
					"visuals": config_model_visuals_6,
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "Tafl view",
					"visuals": {
						"600x600": config_model_visuals_6
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"preferredRatio": 1,
					"switchable": true,
					"module": "tafl",
					"useNotation": true,
					"sounds": config_view_sounds,
					"defaultOptions": config_view_defaultOptions,
					"skins": config_view_skins_3,
					"animateSelfMoves": false,
					"useShowMoves": false
				}
			},
			"viewScripts": config_view_js
		}
	]
})()