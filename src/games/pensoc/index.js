exports.games = (function() {
	var modelScripts = [
		"pensoc-model.js"
	]
	var config_view_js = [
		"pensoc-xd-view.js"
	]
	return [
		{
			"name": "pensoc",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "Penguin soccer",
					"summary": "Penguins playing soccer",
					"module": "pensoc",
					"js": modelScripts,
					"gameOptions": {
						"levelOptions": {
							"distGoalFactor": 12,
							"distBallFactor": -1,
							"haveBallFactor": 3.2,
							"reachableFactor": 0.1,
							"ballReachableFactor": 3.4
						},
						"uctTransposition": "state"
					},
					"levels": [
						{
							"name": "baby",
							"label": "Baby",
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0.63,
							"ignoreLeaf": false,
							"log": false,
							"uncertaintyFactor": 3,
							"maxNodes": 2000
						},
						{
							"name": "fast",
							"label": "Fast [1sec]",
							"log": false,
							"c": 0.63,
							"ignoreLeaf": false,
							"playoutDepth": 0,
							"uncertaintyFactor": 3,
							"ai": "uct",
							"minVisitsExpand": 1,
							"maxDuration": 1,
							"isDefault": true
						},
						{
							"name": "papa",
							"label": "Papa",
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0.63,
							"ignoreLeaf": false,
							"log": false,
							"uncertaintyFactor": 3,
							"maxNodes": 10000
						},
						{
							"name": "mama",
							"label": "Mama",
							"ai": "uct",
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"c": 0.63,
							"ignoreLeaf": false,
							"log": false,
							"uncertaintyFactor": 3,
							"maxNodes": 10000
						}
					],
					"defaultLevel": 2,
					"plazza": "true",
					"rules": {
						"en": "rules.html",
						"fr": "rules-fr.html"
					},
					"credits": {
						"en": "credits.html",
						"fr": "credits-fr.html"
					},
					"description": {
						"en": "description.html",
						"fr": "description-fr.html"
					},
					"thumbnail": "thumbnail.png",
					"strings": [
					],
					"debugEval": true
				},
				"view": {
					"title-en": "Penguin Soccer View",
					"preloadImages": {
						"background": "res/images/ps-background.jpg",
						"sprites": "res/images/ps-images.png"
					},
					"xdView": true,
					"js": config_view_js,
					"visuals": {
						"600x600": [
							"res/visuals/pensoc-600x600-3d.jpg",
							"res/visuals/pensoc-600x600-2d.jpg"
						]
					},
					"css": [
						"pensoc.css"
					],
					"preferredRatio": 1.1638,
					"module": "pensoc",
					"useShowMoves": true,
					"useNotation": true,
					"animateSelfMoves": false,
					"sounds": {
						"slide1": "hoho1",
						"turn": "turn",
						"kick": "kick",
						"getup0": "hoha",
						"getup1": "hehop",
						"slide0": "ouai",
						"slide": "slide",
						"slide2": "hoho1",
						"slide3": "oula1",
						"slide4": "oula2",
						"haha": "hahaha",
						"goout": "hehehehe"
					},
					"skins": [
						{
							"name": "3dofficial",
							"title": "Official 3D",
							"3d": true,
							"camera": {
								"radius": 15,
								"limitCamMoves": true,
								"elevationMin": 0,
								"rotationAngle": 110
							},
							"world": {
								"skyLightIntensity": 0.2,
								"skyLightPosition": {
									"x": 24,
									"y": 24,
									"z": 5
								},
								"lightIntensity": 0.4,
								"lightPosition": {
									"x": -12,
									"y": 12,
									"z": 10
								},
								"lightShadowDarkness": 0.4,
								"fog": false,
								"color": 0
							},
							"preload": [
								"smoothedfilegeo|0|/res/xd-view/meshes/banquise4.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/goals3.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/arrow.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/soccerball2.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/icecube1.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/iceberg-small.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/ocean.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/mama-animated.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/daddy-animated.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/baby-animated.js",
								"map|/res/xd-view/meshes/soccer-texture2.jpg",
								"map|/res/xd-view/meshes/mama-A-diffusex512.jpg",
								"map|/res/xd-view/meshes/mama-B-diffusex512.jpg",
								"map|/res/xd-view/meshes/daddy-A-diffusex512.jpg",
								"map|/res/xd-view/meshes/daddy-B-diffusex512.jpg",
								"map|/res/xd-view/meshes/baby-A-diffusex512.jpg",
								"map|/res/xd-view/meshes/baby-B-diffusex512.jpg"
							]
						},
						{
							"name": "official",
							"title": "Official 2D"
						}
					],
					"defaultOptions": {
						"sounds": true,
						"notation": false,
						"moves": true
					},
					"switchable": true
				}
			},
			"viewScripts": config_view_js
		}
	]
})()