
var mvs = {
    "models": {
        "decercarlaliebre": {
            "plazza": "true",
            "title-en": "De cercar la liebre",
            "module": "hunt",
            "js": [
                "hunt-model.js",
                "decercarlaliebre-model.js"
            ],
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
                    "ai": "uct",
                    "c": 0.4,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "playoutCeil": 1,
                    "log": true,
                    "label": "Easy",
                    "isDefault": true,
                    "maxDuration": 1,
                    "maxNodes": 1500,
                    "maxLoops": 250
                },
                {
                    "ai": "uct",
                    "c": 0.4,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "playoutCeil": 1,
                    "log": true,
                    "label": "Medium",
                    "maxDuration": 2,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "ai": "uct",
                    "c": 0.4,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "playoutCeil": 1,
                    "log": true,
                    "label": "Strong",
                    "maxDuration": 5
                }
            ],
            "defaultLevel": 2,
            "summary": "Middle age hunt game",
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
            "strings": []
        }
    },
    "views": {
        "decercarlaliebre": {
            "title-en": "De cercar la liebre View",
            "module": "hunt",
            "js": [
                "hunt-xd-view.js",
                "decercarlaliebre-xd-view.js"
            ],
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
            "preferredRatio": 1,
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
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            }
        }
    }
};

var games = {};

for(var name in mvs.models) {
    games[name] = {
        name: name,
        modelScripts: mvs.models[name].js,
        config: {
            status: true,
            model: mvs.models[name]
        }
    }
}

for(var name in mvs.views) {
    if(games[name]) {
        games[name].viewScripts = mvs.views[name].js;
        games[name].config.view = mvs.views[name];
    }
}

exports.games = Object.keys(games).map((name)=>{
    return games[name];
});
