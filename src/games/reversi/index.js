exports.games = (function() {
	var modelScripts = [
		"reversi-model.js"
	]
	var config_model_credits = {
		"en": "credits.html"
	}
	var config_model_description = {
		"en": "description.html"
	}
	var config_model_gameOptions_levelOptions = {
		"stableFactor": 20,
		"aboutStableFactor": -20,
		"aboutStableBorderFactor": -15,
		"borderFactor": 5,
		"aboutBorderFactor": -4,
		"countFactor": 1,
		"mobilityFactor": 5
	}
	var config_model_gameOptions_initial_1 = [
		"3:4",
		"4:3"
	]
	var config_model_gameOptions_initial_1_2 = [
		"3:3",
		"4:4"
	]
	var config_model_gameOptions_initial = {
		"1": config_model_gameOptions_initial_1,
		"-1": config_model_gameOptions_initial_1_2
	}
	var config_model_levels = {
		"name": "easy",
		"label": "Easy",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.65,
		"ignoreLeaf": false,
		"log": true,
		"uncertaintyFactor": 3,
		"maxNodes": 1000
	}
	var config_model_levels_2 = {
		"name": "fast",
		"label": "Fast [1sec]",
		"log": true,
		"c": 0.65,
		"ignoreLeaf": false,
		"playoutDepth": 0,
		"uncertaintyFactor": 3,
		"ai": "uct",
		"minVisitsExpand": 1,
		"maxDuration": 1,
		"isDefault": true
	}
	var config_model_levels_3 = {
		"name": "medium",
		"label": "Medium",
		"log": true,
		"c": 0.65,
		"ignoreLeaf": false,
		"playoutDepth": 0,
		"uncertaintyFactor": 3,
		"ai": "uct",
		"minVisitsExpand": 1,
		"maxNodes": 10000,
		"maxDuration": 10
	}
	var config_model_levels_4 = {
		"name": "strong",
		"label": "Strong",
		"log": true,
		"c": 0.65,
		"ignoreLeaf": false,
		"playoutDepth": 0,
		"uncertaintyFactor": 3,
		"ai": "uct",
		"minVisitsExpand": 1,
		"maxNodes": 20000,
		"maxDuration": 15
	}
	var config_model_levels_5 = [
		config_model_levels,
		config_model_levels_2,
		config_model_levels_3,
		config_model_levels_4
	]
	var config_view_js = [
		"reversi-xd-view.js"
	]
	var config_view_skins_camera = {
		"radius": 14,
		"elevationAngle": 45,
		"distMax": 39.5,
		"distMin": 10.1,
		"elevationMin": -89.9,
		"elevationMax": 89.9,
		"limitCamMoves": true,
		"fov": 45
	}
	var config_view_skins_world_lightPosition = {
		"x": 10,
		"y": 18,
		"z": 0
	}
	var config_view_skins_world = {
		"lightIntensity": 0.7,
		"skyLightIntensity": 0.3,
		"lightPosition": config_view_skins_world_lightPosition,
		"lightShadowDarkness": 0.35,
		"color": 4686804,
		"ambientLightColor": 5592405,
		"fog": false
	}
	var config_view_skins_preload = [
		"image|/res/xd-view/pass-dark.png",
		"image|/res/xd-view/pass-light.png",
		"image|/res/images/wood-chipboard-5.jpg",
		"image|/res/xd-view/reversi-pieces-2-textures.png",
		"image|/res/xd-view/reversi-pieces-2-textures-bump.png",
		"smoothedfilegeo|0|/res/xd-view/ring-target.js",
		"smoothedfilegeo|0|/res/xd-view/reversi-pieces-6.js"
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
		"image|/res/xd-view/pass-dark.png",
		"image|/res/xd-view/pass-light.png",
		"image|/res/xd-view/boardtexture.jpg",
		"image|/res/xd-view/cellshadows.png",
		"image|/res/xd-view/sprites.png",
		"image|/res/xd-view/select-target-2d.png"
	]
	var config_view_skins_2 = {
		"name": "classic2d",
		"title": "2D Classic",
		"preload": config_view_skins_preload_2
	}
	var config_view_skins_3 = [
		config_view_skins,
		config_view_skins_2
	]
	var config_model_gameOptions_initial_1_3 = [
		"4:5",
		"5:4"
	]
	var config_model_gameOptions_initial_1_4 = [
		"5:5",
		"4:4"
	]
	var config_model_gameOptions_initial_2 = {
		"1": config_model_gameOptions_initial_1_3,
		"-1": config_model_gameOptions_initial_1_4
	}
	return [
		{
			"name": "reversi",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Annexation",
					"summary": "Also called Reversi or Othello",
					"thumbnail": "thumb-reversi.png",
					"js": modelScripts,
					"module": "reversi",
					"released": 1409239768,
					"plazza": "true",
					"rules": {
						"en": "rules-reversi.html"
					},
					"credits": config_model_credits,
					"description": config_model_description,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "state",
						"levelOptions": config_model_gameOptions_levelOptions,
						"width": 8,
						"height": 8,
						"initial": config_model_gameOptions_initial
					},
					"debugEval": true,
					"levels": config_model_levels_5
				},
				"view": {
					"title-en": "Annex View",
					"js": config_view_js,
					"xdView": true,
					"useNotation": true,
					"useShowMoves": true,
					"module": "reversi",
					"skins": config_view_skins_3,
					"visuals": {
						"600x600": [
							"res/visuals/reversi-600x600-3d.jpg",
							"res/visuals/reversi-600x600-2d.jpg"
						]
					}
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "reversi6",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Annexation 6",
					"summary": "Reversi/Othello rules on a 6x6 board",
					"thumbnail": "thumb-reversi6.png",
					"js": modelScripts,
					"module": "reversi",
					"released": 1409239768,
					"plazza": "true",
					"rules": {
						"en": "rules-reversi6.html"
					},
					"credits": config_model_credits,
					"description": config_model_description,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "state",
						"levelOptions": config_model_gameOptions_levelOptions,
						"width": 6,
						"height": 6,
						"initial": {
							"1": [
								"2:3",
								"3:2"
							],
							"-1": [
								"2:2",
								"3:3"
							]
						}
					},
					"debugEval": true,
					"levels": config_model_levels_5
				},
				"view": {
					"title-en": "Annex View",
					"js": config_view_js,
					"xdView": true,
					"useNotation": true,
					"useShowMoves": true,
					"module": "reversi",
					"skins": config_view_skins_3,
					"visuals": {
						"600x600": [
							"res/visuals/reversi6-600x600-3d.jpg",
							"res/visuals/reversi6-600x600-2d.jpg"
						]
					}
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "reversi4",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Annexation 4",
					"summary": "Reversi/Othello rules on a 4x4 board",
					"thumbnail": "thumb-reversi4.png",
					"js": modelScripts,
					"module": "reversi",
					"released": 1409239768,
					"plazza": "true",
					"rules": {
						"en": "rules-reversi4.html"
					},
					"credits": config_model_credits,
					"description": config_model_description,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "state",
						"levelOptions": config_model_gameOptions_levelOptions,
						"width": 4,
						"height": 4,
						"initial": {
							"1": [
								"1:2",
								"2:1"
							],
							"-1": [
								"1:1",
								"2:2"
							]
						}
					},
					"debugEval": true,
					"levels": config_model_levels_5
				},
				"view": {
					"title-en": "Annex View",
					"js": config_view_js,
					"xdView": true,
					"useNotation": true,
					"useShowMoves": true,
					"module": "reversi",
					"skins": config_view_skins_3,
					"visuals": {
						"600x600": [
							"res/visuals/reversi4-600x600-3d.jpg",
							"res/visuals/reversi4-600x600-2d.jpg"
						]
					}
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "reversi10",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Annexation 10",
					"summary": "Reversi/Othello rules on a 10x10 board",
					"thumbnail": "thumb-reversi10.png",
					"js": modelScripts,
					"module": "reversi",
					"released": 1409239768,
					"plazza": "true",
					"rules": {
						"en": "rules-reversi10.html"
					},
					"credits": config_model_credits,
					"description": config_model_description,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "state",
						"levelOptions": config_model_gameOptions_levelOptions,
						"width": 10,
						"height": 10,
						"initial": config_model_gameOptions_initial_2
					},
					"debugEval": true,
					"levels": config_model_levels_5
				},
				"view": {
					"title-en": "Annex View",
					"js": config_view_js,
					"xdView": true,
					"useNotation": true,
					"useShowMoves": true,
					"module": "reversi",
					"skins": config_view_skins_3,
					"visuals": {
						"600x600": [
							"res/visuals/reversi10-600x600-3d.jpg",
							"res/visuals/reversi10-600x600-2d.jpg"
						]
					}
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "reversicross",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Annexation Cross",
					"summary": "Reversi/Othello rules on a cross-shaped board",
					"thumbnail": "thumb-cross.png",
					"js": modelScripts,
					"module": "reversi",
					"released": 1409239768,
					"plazza": "true",
					"rules": {
						"en": "rules-cross.html"
					},
					"credits": config_model_credits,
					"description": config_model_description,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "state",
						"levelOptions": config_model_gameOptions_levelOptions,
						"width": 8,
						"height": 8,
						"deadCells": {
							"7:0": "#",
							"0:0": "#",
							"1:0": "#",
							"1:1": "#",
							"0:7": "#",
							"0:6": "#",
							"1:7": "#",
							"1:6": "#",
							"0:1": "#",
							"7:1": "#",
							"6:0": "#",
							"6:1": "#",
							"7:7": "#",
							"7:6": "#",
							"6:7": "#",
							"6:6": "#"
						},
						"initial": config_model_gameOptions_initial
					},
					"debugEval": true,
					"levels": config_model_levels_5
				},
				"view": {
					"title-en": "Annex View",
					"js": config_view_js,
					"xdView": true,
					"useNotation": true,
					"useShowMoves": true,
					"module": "reversi",
					"skins": config_view_skins_3,
					"visuals": {
						"600x600": [
							"res/visuals/cross-600x600-3d.jpg",
							"res/visuals/cross-600x600-2d.jpg"
						]
					}
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "reversicross10",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Annexation Cross 10",
					"summary": "Reversi/Othello rules on a 10x10 cross-shaped board",
					"thumbnail": "thumb-cross10.png",
					"js": modelScripts,
					"module": "reversi",
					"released": 1409239768,
					"plazza": "true",
					"rules": {
						"en": "rules-cross10.html"
					},
					"credits": config_model_credits,
					"description": config_model_description,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "state",
						"levelOptions": config_model_gameOptions_levelOptions,
						"width": 10,
						"height": 10,
						"deadCells": {
							"0:7": "#",
							"0:0": "#",
							"0:2": "#",
							"1:0": "#",
							"1:1": "#",
							"1:2": "#",
							"2:0": "#",
							"2:1": "#",
							"2:2": "#",
							"7:0": "#",
							"7:1": "#",
							"7:2": "#",
							"8:0": "#",
							"8:1": "#",
							"8:2": "#",
							"9:0": "#",
							"9:1": "#",
							"9:2": "#",
							"0:1": "#",
							"0:8": "#",
							"0:9": "#",
							"1:7": "#",
							"1:8": "#",
							"1:9": "#",
							"2:7": "#",
							"2:8": "#",
							"2:9": "#",
							"7:7": "#",
							"7:8": "#",
							"7:9": "#",
							"8:7": "#",
							"8:8": "#",
							"8:9": "#",
							"9:7": "#",
							"9:8": "#",
							"9:9": "#"
						},
						"initial": config_model_gameOptions_initial_2
					},
					"debugEval": true,
					"levels": config_model_levels_5
				},
				"view": {
					"title-en": "Annex View",
					"js": config_view_js,
					"xdView": true,
					"useNotation": true,
					"useShowMoves": true,
					"module": "reversi",
					"skins": config_view_skins_3,
					"visuals": {
						"600x600": [
							"res/visuals/cross10-600x600-3d.jpg",
							"res/visuals/cross10-600x600-2d.jpg"
						]
					}
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "reversiturnover",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Annexation Turn-Over",
					"summary": "Reversi/Othello rules on a 10x10 octogonal-shaped board",
					"thumbnail": "thumb-turnover.png",
					"js": modelScripts,
					"module": "reversi",
					"released": 1409239768,
					"plazza": "true",
					"rules": {
						"en": "rules-turnover.html"
					},
					"credits": config_model_credits,
					"description": config_model_description,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "state",
						"levelOptions": config_model_gameOptions_levelOptions,
						"width": 10,
						"height": 10,
						"deadCells": {
							"0:7": "#",
							"0:0": "#",
							"0:2": "#",
							"1:0": "#",
							"1:1": "#",
							"2:0": "#",
							"7:0": "#",
							"8:0": "#",
							"8:1": "#",
							"9:0": "#",
							"9:1": "#",
							"9:2": "#",
							"0:1": "#",
							"0:8": "#",
							"0:9": "#",
							"1:8": "#",
							"1:9": "#",
							"2:9": "#",
							"7:9": "#",
							"8:8": "#",
							"8:9": "#",
							"9:7": "#",
							"9:8": "#",
							"9:9": "#"
						},
						"initial": config_model_gameOptions_initial_2
					},
					"debugEval": true,
					"levels": config_model_levels_5
				},
				"view": {
					"title-en": "Annex View",
					"js": config_view_js,
					"xdView": true,
					"useNotation": true,
					"useShowMoves": true,
					"module": "reversi",
					"skins": config_view_skins_3,
					"visuals": {
						"600x600": [
							"res/visuals/turnover-600x600-3d.jpg",
							"res/visuals/turnover-600x600-2d.jpg"
						]
					}
				}
			},
			"viewScripts": config_view_js
		}
	]
})()