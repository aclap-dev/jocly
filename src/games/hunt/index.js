exports.games = (function() {
	var modelScripts = [
		"hunt-model.js",
		"decercarlaliebre-model.js"
	]
	var config_view_js = [
		"hunt-xd-view.js",
		"decercarlaliebre-xd-view.js"
	]
	return [
		{
			"name": "decercarlaliebre",
			"modelScripts": modelScripts,
			"config": {
				"status": true,
				"model": {
					"title-en": "De cercar la liebre",
					"summary": "Middle age hunt game",
					"defaultLevel": 2,
					"js": modelScripts,
					"defaultHuman": 1,
					"gameOptions": {
						"preventRepeat": true,
						"uctTransposition": "state",
						"uctIgnoreLoop": false,
						"levelOptions": {
							"pieceCount0": 12000000,
							"pieceCount1": 1000000,
							"dist20": 15,
							"freeZone0": 400,
							"openRisk0": 200,
							"forkRisk0": 400,
							"catcheeGroups0": 300
						}
					},
					"levels": [
						{
							"label": "Easy",
							"playoutCeil": 1,
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"ignoreLeaf": false,
							"uncertaintyFactor": 5,
							"propagateMultiVisits": false,
							"c": 0.4,
							"log": true,
							"ai": "uct",
							"isDefault": true,
							"maxDuration": 1,
							"maxNodes": 1500,
							"maxLoops": 250
						},
						{
							"label": "Medium",
							"propagateMultiVisits": false,
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"ignoreLeaf": false,
							"uncertaintyFactor": 5,
							"c": 0.4,
							"playoutCeil": 1,
							"log": true,
							"ai": "uct",
							"maxDuration": 2,
							"maxNodes": 2500,
							"maxLoops": 500
						},
						{
							"label": "Strong",
							"uncertaintyFactor": 5,
							"playoutDepth": 0,
							"minVisitsExpand": 1,
							"ignoreLeaf": false,
							"c": 0.4,
							"propagateMultiVisits": false,
							"playoutCeil": 1,
							"log": true,
							"ai": "uct",
							"maxDuration": 5
						}
					],
					"plazza": "true",
					"module": "hunt",
					"rules": {
						"en": "decercarlaliebre-rules.html",
						"fr": "decercarlaliebre-rules-fr.html"
					},
					"credits": {
						"en": "decercarlaliebre-credits.html",
						"fr": "decercarlaliebre-credits-fr.html"
					},
					"description": {
						"en": "decercarlaliebre-description.html",
						"fr": "decercarlaliebre-description-fr.html"
					},
					"thumbnail": "decercarlaliebre-thumbnail.png",
					"strings": [
					]
				},
				"view": {
					"title-en": "De cercar la liebre View",
					"defaultOptions": {
						"sounds": true,
						"notation": false,
						"moves": true
					},
					"js": config_view_js,
					"visuals": {
						"600x600": [
							"res/visuals/decercar-600x600-3d.jpg",
							"res/visuals/decercar-600x600-2d.jpg"
						]
					},
					"xdView": true,
					"css": [
						"hunt.css",
						"decercarlaliebre.css"
					],
					"module": "hunt",
					"switchable": false,
					"useShowMoves": true,
					"useNotation": true,
					"animateSelfMoves": false,
					"skins": [
						{
							"name": "decercarlaliebre3d",
							"title": "3D Classic",
							"3d": true,
							"camera": {
								"radius": 14,
								"elevationAngle": 45,
								"limitCamMoves": true
							},
							"world": {
								"lightIntensity": 0,
								"skyLightIntensity": 0,
								"color": 3355443,
								"fog": false,
								"lightPosition": {
									"x": -5,
									"y": 18,
									"z": 5
								},
								"lightShadowDarkness": 0.25,
								"ambientLightColor": 1118481
							},
							"preload": [
								"image|/res/xd-view/meshes/liebre/hunter.jpg",
								"image|/res/xd-view/meshes/liebre/rabbitskin4.jpg",
								"image|/res/xd-view/meshes/liebre/liebreboardsimple.jpg",
								"image|/res/xd-view/meshes/liebre/liebreboard.jpg",
								"smoothedfilegeo|0|/res/xd-view/meshes/board.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/liebre/hunter2.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/liebre/liebre6.js",
								"smoothedfilegeo|0|/res/xd-view/meshes/target.js"
							]
						},
						{
							"name": "medieval",
							"title": "Medieval"
						}
					],
					"preferredRatio": 1
				}
			},
			"viewScripts": config_view_js
		}
	]
})()