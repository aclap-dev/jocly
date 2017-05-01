exports.games = (function() {
	var modelScripts = [
		"mills-model.js",
		"9-men-morris-model.js"
	]
	var config_model_levels = {
		"label": "Easy",
		"maxDepth": 2,
		"potential": 100,
		"placingRace": 1,
		"isDefault": true
	}
	var config_model_levels_2 = {
		"label": "Medium",
		"maxDepth": 4,
		"potential": 300,
		"placingRace": 1
	}
	var config_model_levels_3 = {
		"label": "Hard",
		"maxDepth": 8,
		"potential": 1000,
		"placingRace": 2
	}
	var config_model_levels_4 = [
		config_model_levels,
		config_model_levels_2,
		config_model_levels_3
	]
	var config_view_css = [
		"mills.css",
		"9-men-morris.css"
	]
	var config_view_js = [
		"mills-xd-view.js",
		"9-men-morris-view.js"
	]
	var config_view_visuals_600x600 = [
		"res/visuals/ninemen-600x600-3d.jpg",
		"res/visuals/ninemen-600x600-2d.jpg"
	]
	var config_view_visuals = {
		"600x600": config_view_visuals_600x600
	}
	var config_view_defaultOptions = {
		"sounds": true,
		"notation": false,
		"moves": true
	}
	var config_view_sounds = {
		"move1": "move1",
		"move2": "move2",
		"move3": "move3",
		"move4": "move4",
		"tac1": "tac1",
		"tac2": "tac2",
		"tac3": "tac3",
		"capture": "promo",
		"usermove": null
	}
	var config_view_skins_camera = {
		"radius": 14,
		"elevationAngle": 45,
		"distMax": 39.5,
		"distMin": 10.1,
		"elevationMin": -89.9,
		"elevationMax": 89.9,
		"limitCamMoves": true
	}
	var config_view_skins_world_lightPosition = {
		"x": 0,
		"y": 18,
		"z": 0
	}
	var config_view_skins_world = {
		"lightIntensity": 0.6,
		"skyLightIntensity": 0.3,
		"lightPosition": config_view_skins_world_lightPosition,
		"color": 0,
		"fog": false
	}
	var config_view_skins_preload = [
		"image|/res/xd-view/meshes/woodcell1x512.jpg",
		"image|/res/xd-view/meshes/piecetop-bump.jpg",
		"image|/res/xd-view/meshes/piecediff.jpg",
		"smoothedfilegeo|0|/res/xd-view/meshes/piece-v2.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/boardoriented.js",
		"smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js"
	]
	var config_view_skins = {
		"name": "classic3d",
		"title": "3D Classic",
		"3d": true,
		"camera": config_view_skins_camera,
		"world": config_view_skins_world,
		"preload": config_view_skins_preload
	}
	var config_view_skins_2 = {
		"name": "stone",
		"title": "Stone"
	}
	var config_view_skins_3 = {
		"name": "suede",
		"title": "Suede"
	}
	var config_view_skins_4 = {
		"name": "wood",
		"title": "Wood"
	}
	var config_view_skins_5 = [
		config_view_skins,
		config_view_skins_2,
		config_view_skins_3,
		config_view_skins_4
	]
	var modelScripts_2 = [
		"mills-model.js",
		"12-men-morris-model.js"
	]
	var config_view_css_2 = [
		"mills.css",
		"12-men-morris.css"
	]
	var config_view_js_2 = [
		"mills-xd-view.js",
		"12-men-morris-view.js"
	]
	var config_view_visuals_600x600_2 = [
		"res/visuals/twelvemen-600x600-3d.jpg",
		"res/visuals/twelvemen-600x600-2d.jpg"
	]
	var config_view_visuals_2 = {
		"600x600": config_view_visuals_600x600_2
	}
	var config_view = {
		"title-en": "12 Men´s Morris View",
		"switchable": true,
		"xdView": true,
		"css": config_view_css_2,
		"js": config_view_js_2,
		"module": "mills",
		"preferredRatio": 1.2857142857143,
		"visuals": config_view_visuals_2,
		"animateSelfMoves": false,
		"useNotation": true,
		"useShowMoves": true,
		"defaultOptions": config_view_defaultOptions,
		"sounds": config_view_sounds,
		"skins": config_view_skins_5
	}
	var modelScripts_3 = [
		"mills-model.js",
		"6-men-morris-model.js"
	]
	var config_view_js_3 = [
		"mills-xd-view.js",
		"6-men-morris-view.js"
	]
	var modelScripts_4 = [
		"mills-model.js",
		"3-men-morris-model.js"
	]
	var config_view_js_4 = [
		"mills-xd-view.js",
		"3-men-morris-view.js"
	]
	var modelScripts_5 = [
		"mills-model.js",
		"7-men-morris-model.js"
	]
	var config_view_js_5 = [
		"mills-xd-view.js",
		"7-men-morris-view.js"
	]
	return [
		{
			"name": "9-men-morris",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "9 Men´s Morris",
					"summary": "An old board game",
					"rules": "rules.html",
					"maxLevel": 7,
					"plazza": "true",
					"thumbnail": "mensmorris9-thumb3d.png",
					"module": "mills",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts,
					"gameOptions": {
						"preventRepeat": true,
						"width": 7,
						"height": 7,
						"mencount": 9,
						"poundInMill": false
					},
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "7 Men´s Morris View",
					"switchable": true,
					"xdView": true,
					"css": config_view_css,
					"js": config_view_js,
					"module": "mills",
					"preferredRatio": 1.2857142857143,
					"visuals": config_view_visuals,
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"defaultOptions": config_view_defaultOptions,
					"sounds": config_view_sounds,
					"skins": config_view_skins_5
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "9-men-morris-fly",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "9 Men´s Morris Fly",
					"summary": "An old board game",
					"rules": "rules.html",
					"maxLevel": 7,
					"plazza": "true",
					"thumbnail": "mensmorris9-thumb3d.png",
					"module": "mills",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts,
					"gameOptions": {
						"preventRepeat": true,
						"width": 7,
						"height": 7,
						"mencount": 9,
						"canFly": true
					},
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "9 Men´s Morris View",
					"switchable": true,
					"xdView": true,
					"css": config_view_css,
					"js": config_view_js,
					"module": "mills",
					"preferredRatio": 1.2857142857143,
					"visuals": config_view_visuals,
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"defaultOptions": config_view_defaultOptions,
					"sounds": config_view_sounds,
					"skins": config_view_skins_5
				}
			},
			"viewScripts": config_view_js
		},
		{
			"name": "12-men-morris",
			"modelScripts": modelScripts_2,
			"config": {
				"status": true,
				"model": {
					"title-en": "12 Men´s Morris",
					"summary": "An old board game",
					"rules": "rules.html",
					"maxLevel": 7,
					"plazza": "true",
					"thumbnail": "mensmorris12-thumb3d.png",
					"module": "mills",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_2,
					"gameOptions": {
						"preventRepeat": true,
						"width": 7,
						"height": 7,
						"mencount": 12,
						"poundInMill": false
					},
					"levels": config_model_levels_4
				},
				"view": config_view
			},
			"viewScripts": config_view_js_2
		},
		{
			"name": "12-men-morris-fly",
			"modelScripts": modelScripts_2,
			"config": {
				"status": true,
				"model": {
					"title-en": "12 Men´s Morris Fly",
					"summary": "An old board game",
					"rules": "rules.html",
					"maxLevel": 7,
					"plazza": "true",
					"thumbnail": "mensmorris12-thumb3d.png",
					"module": "mills",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_2,
					"gameOptions": {
						"preventRepeat": true,
						"width": 7,
						"height": 7,
						"mencount": 12,
						"canFly": true
					},
					"levels": config_model_levels_4
				},
				"view": config_view
			},
			"viewScripts": config_view_js_2
		},
		{
			"name": "6-men-morris",
			"modelScripts": modelScripts_3,
			"config": {
				"status": true,
				"model": {
					"title-en": "6 Men´s Morris",
					"summary": "An old board game",
					"rules": "rules.html",
					"maxLevel": 7,
					"plazza": "true",
					"thumbnail": "mensmorris6-thumb3d.png",
					"module": "mills",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_3,
					"gameOptions": {
						"preventRepeat": true,
						"width": 5,
						"height": 5,
						"mencount": 6,
						"poundInMill": false
					},
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "6 Men´s Morris View",
					"switchable": true,
					"xdView": true,
					"css": [
						"mills.css",
						"6-men-morris.css"
					],
					"js": config_view_js_3,
					"module": "mills",
					"preferredRatio": 1.4,
					"visuals": {
						"600x600": [
							"res/visuals/sixmen-600x600-3d.jpg",
							"res/visuals/sixmen-600x600-2d.jpg"
						]
					},
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"defaultOptions": config_view_defaultOptions,
					"sounds": config_view_sounds,
					"skins": config_view_skins_5
				}
			},
			"viewScripts": config_view_js_3
		},
		{
			"name": "3-men-morris",
			"modelScripts": modelScripts_4,
			"config": {
				"status": true,
				"model": {
					"title-en": "6 Men´s Morris",
					"summary": "An old board game",
					"rules": "rules.html",
					"maxLevel": 7,
					"plazza": "true",
					"thumbnail": "mensmorris3-thumb3d.png",
					"module": "mills",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_4,
					"gameOptions": {
						"preventRepeat": true,
						"width": 3,
						"height": 3,
						"mencount": 3,
						"poundInMill": false
					},
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "3 Men´s Morris View",
					"switchable": true,
					"xdView": true,
					"css": [
						"mills.css",
						"3-men-morris.css"
					],
					"js": config_view_js_4,
					"module": "mills",
					"preferredRatio": 1.6666666666667,
					"visuals": {
						"600x600": [
							"res/visuals/threemen-600x600-3d.jpg",
							"res/visuals/threemen-600x600-2d.jpg"
						]
					},
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"defaultOptions": config_view_defaultOptions,
					"sounds": config_view_sounds,
					"skins": config_view_skins_5
				}
			},
			"viewScripts": config_view_js_4
		},
		{
			"name": "7-men-morris",
			"modelScripts": modelScripts_5,
			"config": {
				"status": true,
				"model": {
					"title-en": "7 Men´s Morris",
					"summary": "An old board game",
					"rules": "rules.html",
					"maxLevel": 7,
					"plazza": "true",
					"thumbnail": "mensmorris7-thumb3d.png",
					"module": "mills",
					"description": "description.html",
					"credits": "credits.html",
					"js": modelScripts_5,
					"gameOptions": {
						"preventRepeat": true,
						"width": 5,
						"height": 5,
						"mencount": 7,
						"poundInMill": false
					},
					"levels": config_model_levels_4
				},
				"view": {
					"title-en": "7 Men´s Morris View",
					"switchable": true,
					"xdView": true,
					"css": [
						"mills.css",
						"7-men-morris.css"
					],
					"js": config_view_js_5,
					"module": "mills",
					"preferredRatio": 1.4,
					"visuals": {
						"600x600": [
							"res/visuals/sevenmen-600x600-3d.jpg",
							"res/visuals/sevenmen-600x600-2d.jpg"
						]
					},
					"animateSelfMoves": false,
					"useNotation": true,
					"useShowMoves": true,
					"defaultOptions": config_view_defaultOptions,
					"sounds": config_view_sounds,
					"skins": config_view_skins_5
				}
			},
			"viewScripts": config_view_js_5
		}
	]
})()