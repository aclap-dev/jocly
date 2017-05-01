exports.games = (function() {
	var modelScripts = [
		"fiarbase-model.js"
	]
	var config_model_rules = {
		"en": "rules.html",
		"fr": "rules-fr.html"
	}
	var config_model_description = {
		"en": "description.html",
		"fr": "description-fr.html"
	}
	var config_model_credits = {
		"en": "credits.html",
		"fr": "credits-fr.html"
	}
	var config_model_gameOptions_levelOptions = {
		"evalTuple1": 1,
		"evalTuple2": 2,
		"evalTuple3": 4,
		"evalTuple4": 8,
		"evalTuple5": 16,
		"evalTuple6": 32
	}
	var config_model_levels = {
		"name": "easy",
		"label": "Easy",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.55,
		"ignoreLeaf": false,
		"maxNodes": 1000,
		"isDefault": true
	}
	var config_model_levels_2 = {
		"name": "fast",
		"label": "Fast [1sec]",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.55,
		"ignoreLeaf": false,
		"maxDuration": 1
	}
	var config_model_levels_3 = {
		"name": "strong",
		"label": "Strong",
		"ai": "uct",
		"playoutDepth": 0,
		"minVisitsExpand": 1,
		"c": 0.55,
		"ignoreLeaf": false,
		"maxNodes": 10000
	}
	var config_model_levels_4 = [
		config_model_levels,
		config_model_levels_2,
		config_model_levels_3
	]
	var config_view_js = [
		"fiarbase-xd-view.js"
	]
	var config_view_css = [
		"fiarbase.css"
	]
	var config_view_sounds = {
		"sound1": "sound1",
		"sound2": "sound2"
	}
	var config_view_defaultOptions = {
		"sounds": true,
		"moves": true,
		"notation": false
	}
	var config_view_skins_camera = {
		"radius": 20,
		"limitCamMoves": true,
		"rotationAngle": 180,
		"elevationAngle": 0,
		"elevationMin": -89,
		"elevationMax": 89,
		"distMax": 30
	}
	var config_view_skins_world_lightPosition = {
		"x": 10,
		"y": 5,
		"z": 0
	}
	var config_view_skins_world = {
		"lightIntensity": 0.2,
		"skyLightIntensity": 0.2,
		"lightCastShadow": false,
		"fog": true,
		"color": 0,
		"lightPosition": config_view_skins_world_lightPosition,
		"lightShadowDarkness": 0.55,
		"ambientLightColor": 2236996
	}
	var config_view_skins_preload = [
		"map|/res/xd-view/meshes/connect4-red-star.png",
		"map|/res/xd-view/meshes/connect4-red.png",
		"map|/res/xd-view/meshes/connect4-yellow-star.png",
		"map|/res/xd-view/meshes/connect4-yellow.png",
		"smoothedfilegeo|0|/res/xd-view/meshes/connect4cell.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/connect4cell-ring-smoothed.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/connect4-token.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/connect4cell-foot.js"
	]
	var config_view_skins = {
		"name": "fiar3d",
		"title": "3D Classic",
		"3d": true,
		"camera": config_view_skins_camera,
		"world": config_view_skins_world,
		"preload": config_view_skins_preload
	}
	var config_view_skins_preload_2 = [
		"image|/res/sprites2d.png"
	]
	var config_view_skins_2 = {
		"name": "fiar2d",
		"title": "2D Classic",
		"3d": false,
		"preload": config_view_skins_preload_2
	}
	var config_view_skins_3 = [
		config_view_skins,
		config_view_skins_2
	]
	return [
		{
			"name": "fourinarow",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Four In A Row",
					"summary": "Four In A Row game",
					"thumbnail": "fiar-thumb.png",
					"js": modelScripts,
					"plazza": "true",
					"module": "fourinarow",
					"rules": config_model_rules,
					"description": config_model_description,
					"credits": config_model_credits,
					"gameOptions": {
						"width": 7,
						"height": 6,
						"lines": 4,
						"remove": false,
						"levelOptions": config_model_gameOptions_levelOptions,
						"uctTransposition": "state"
					},
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "Four In A Row View",
					"visuals": {
						"600x600": [
							"res/visuals/fourinarow-600x600-3d.jpg",
							"res/visuals/fourinarow-600x600-2d.jpg"
						]
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"preferredRatio": 1,
					"module": "fourinarow",
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
			"name": "fourinarow96",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Four In A Row 9x6",
					"summary": "Four In A Row on a 9x6 board",
					"thumbnail": "fiar-thumb.png",
					"js": modelScripts,
					"plazza": "true",
					"module": "fourinarow",
					"rules": config_model_rules,
					"description": config_model_description,
					"credits": config_model_credits,
					"gameOptions": {
						"width": 9,
						"height": 6,
						"lines": 4,
						"remove": false,
						"levelOptions": config_model_gameOptions_levelOptions,
						"uctTransposition": "state"
					},
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "Four In A Row View",
					"visuals": {
						"600x600": [
							"res/visuals/fourinarow-9x6-600x600-3d.jpg",
							"res/visuals/fourinarow-9x6-600x600-2d.jpg"
						]
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"preferredRatio": 1,
					"module": "fourinarow",
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
			"name": "fiarpopout",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Popout",
					"summary": "Four In A Row with removals",
					"thumbnail": "fiar-thumb.png",
					"js": modelScripts,
					"plazza": "true",
					"module": "fourinarow",
					"rules": config_model_rules,
					"description": config_model_description,
					"credits": config_model_credits,
					"gameOptions": {
						"width": 7,
						"height": 6,
						"lines": 4,
						"remove": true,
						"levelOptions": config_model_gameOptions_levelOptions,
						"uctTransposition": "state",
						"preventRepeat": true
					},
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "Four In A Row View",
					"visuals": {
						"600x600": [
							"res/visuals/popout-600x600-3d.jpg",
							"res/visuals/popout-600x600-2d.jpg"
						]
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"preferredRatio": 1,
					"module": "fourinarow",
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
			"name": "fiveinarow",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Five In A Row",
					"summary": "Variant of Four In A Row",
					"thumbnail": "fiar-thumb.png",
					"js": modelScripts,
					"plazza": "true",
					"module": "fourinarow",
					"rules": config_model_rules,
					"description": config_model_description,
					"credits": config_model_credits,
					"gameOptions": {
						"width": 9,
						"height": 6,
						"lines": 5,
						"remove": false,
						"levelOptions": config_model_gameOptions_levelOptions,
						"uctTransposition": "state",
						"fillSides": true
					},
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "Four In A Row View",
					"visuals": {
						"600x600": [
							"res/visuals/fiveinarow-600x600-3d.jpg",
							"res/visuals/fiveinarow-600x600-2d.jpg"
						]
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"preferredRatio": 1,
					"module": "fourinarow",
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
			"name": "torus4",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Torus 4",
					"summary": "Four In A Row on a cylinder",
					"thumbnail": "fiar-torus-thumb.png",
					"js": modelScripts,
					"plazza": "true",
					"module": "fourinarow",
					"rules": config_model_rules,
					"description": config_model_description,
					"credits": config_model_credits,
					"gameOptions": {
						"width": 9,
						"height": 6,
						"lines": 4,
						"remove": false,
						"levelOptions": config_model_gameOptions_levelOptions,
						"uctTransposition": "state",
						"torus": true
					},
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "Four In A Row View",
					"visuals": {
						"600x600": [
							"res/visuals/torus4-600x600-3d.jpg",
							"res/visuals/torus4-600x600-2d.jpg"
						]
					},
					"js": config_view_js,
					"xdView": true,
					"css": config_view_css,
					"preferredRatio": 1,
					"module": "fourinarow",
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