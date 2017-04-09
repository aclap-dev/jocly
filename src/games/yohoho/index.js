
var mvs = {
    "models": {
        "yohoho": {
            "plazza": "true",
            "title-en": "Yohoho!",
            "module": "yohoho",
            "js": [
                "hexbase-model.js",
                "yohoho-model.js"
            ],
            "gameOptions": {
                "maxLines": 9,
                "maxCols": 17,
                "orientation": "onACorner",
                "boardLayout": [
                    "#.#.#.#.#.#.#.#.#",
                    ".#.#.#.#.#.#.#.#.",
                    "#.#.#.#.#.#.#.#.#",
                    ".#.#.#.#.#.#.#.#.",
                    "c.c.c.c.c.c.c.c.c",
                    ".#.#.#.#.#.#.#.#.",
                    "#.#.#.#.#.#.#.#.#",
                    ".#.#.#.#.#.#.#.#.",
                    "#.#.#.#.#.#.#.#.#"
                ],
                "initial": {
                    "a": [
                        "#.#.#.#.#.#.#.#.#",
                        ".#.#.#.#.#.#.#.#.",
                        "#.#.#.#.#.#.#.#.#",
                        ".#.#.#.#.#.#.#.#.",
                        "#.#.#.#.#.#.#.#.#",
                        ".#.#.#.#.#.#.#.#.",
                        "#.#.#.#.C.#.#.#.#",
                        ".#.#.#.#.#.#.#.#.",
                        "#.p.p.c.r.c.p.p.#"
                    ],
                    "b": [
                        "#.p.p.c.r.c.p.p.#",
                        ".#.#.#.#.#.#.#.#.",
                        "#.#.#.#.C.#.#.#.#",
                        ".#.#.#.#.#.#.#.#.",
                        "#.#.#.#.#.#.#.#.#",
                        ".#.#.#.#.#.#.#.#.",
                        "#.#.#.#.#.#.#.#.#",
                        ".#.#.#.#.#.#.#.#.",
                        "#.#.#.#.#.#.#.#.#"
                    ]
                },
                "maxNbCellsPerMove": 3,
                "margin": 1
            },
            "levels": [
                {
                    "label": "Cabin boy",
                    "potential": 1000,
                    "isDefault": true,
                    "maxDepth": 1,
                    "moveCount": 12,
                    "calRatio": 3.31
                },
                {
                    "label": "Sailor",
                    "potential": 4000,
                    "maxDepth": 5,
                    "moveCount": 15,
                    "rowRaceLevel": 1,
                    "calRatio": 25.16
                },
                {
                    "label": "Officer",
                    "potential": 20000,
                    "maxDepth": 6,
                    "moveCount": 20,
                    "rowRaceLevel": 3,
                    "calRatio": 126.18
                },
                {
                    "label": "Captain",
                    "potential": 40000,
                    "maxDepth": 8,
                    "moveCount": 25,
                    "rowRaceLevel": 4,
                    "calRatio": 130.51
                },
                {
                    "label": "Admiral",
                    "potential": 100000,
                    "maxDepth": 8,
                    "moveCount": 25,
                    "rowRaceLevel": 4,
                    "calRatio": 192.22
                }
            ],
            "defaultLevel": 2,
            "summary": "Sea Battle over hexagons",
            "rules": {
                "en": "rules.html",
                "fr": "rules-fr.html"
            },
            "credits": {
                "en": "credits.html"
            },
            "description": {
                "en": "description.html"
            },
            "thumbnail": "yohoho-thumb3d.png"
        }
    },
    "views": {
        "yohoho": {
            "title-en": "Yohoho View",
            "module": "yohoho",
            "js": [
                "yohoho-xd-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/yohoho-600x600-3d.jpg",
                    "res/visuals/yohoho-600x600-2d.jpg"
                ]
            },
            "css": [
                "yohoho.css"
            ],
            "switchable": true,
            "useShowMoves": true,
            "useNotation": true,
            "animateSelfMoves": false,
            "sounds": {
                "win": "yohoho_final",
                "loss": "yohoho_final_lose",
                "end": "yohoho_final",
                "assault": "yohoho_assault",
                "yohoho1": "yohoho1",
                "yohoho2": "yohoho2",
                "yohoho3": "yohoho3",
                "yohoho4": "yohoho4",
                "move": "yohoho_moveon"
            },
            "skins": [
                {
                    "name": "cartoon3d",
                    "title": "Cartoon (3D)",
                    "3d": true,
                    "camera": {
                        "radius": 12,
                        "limitCamMoves": true,
                        "elevationMin": 0
                    },
                    "world": {
                        "lightIntensity": 1,
                        "skyLightIntensity": 0,
                        "fog": false,
                        "fogNear": 15,
                        "fogFar": 80,
                        "fogColor": "#ffffff"
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/baril-256.jpg",
                        "image|/res/xd-view/meshes/explosion-256.png",
                        "image|/res/xd-view/meshes/jarmada-admiral-pirate-uvs-512.jpg",
                        "image|/res/xd-view/meshes/jarmada-admiral-uvs-512.jpg",
                        "image|/res/xd-view/meshes/jarmada-admiral-voiles-pirate-uvs-512.jpg",
                        "image|/res/xd-view/meshes/jarmada-admiral-voiles-uvs-512.jpg",
                        "image|/res/xd-view/meshes/jarmada-frigate-pirate-uvs-512.jpg",
                        "image|/res/xd-view/meshes/jarmada-frigate-uvs-512.jpg",
                        "image|/res/xd-view/meshes/jarmada-gallion-pirate-uvs-512.jpg",
                        "image|/res/xd-view/meshes/jarmada-gallion-uvs-512.jpg",
                        "image|/res/xd-view/meshes/ocean-texture.jpg",
                        "image|/res/xd-view/meshes/ocean-texture2.jpg",
                        "image|/res/xd-view/meshes/palm-leaves-texture-512.png",
                        "image|/res/xd-view/meshes/wood-texture.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/landscape-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/jarmada-frigate.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/jarmada-gallion.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/jarmada-rock.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/jarmada-admiral.js"
                    ]
                },
                {
                    "name": "official",
                    "title": "Official"
                },
                {
                    "name": "stylized",
                    "title": "Stylized"
                }
            ],
            "boardBackgrounds": {
                "official": "oceanboard.jpg",
                "officialnosound": "oceanboard.jpg",
                "stylized": "winddirection.png",
                "basic": "winddirection.png",
                "stylizednosound": "winddirection.png",
                "basicnosound": "winddirection.png"
            },
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            },
            "preferredRatio": 1.1164274322169,
            "xdView": true
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
