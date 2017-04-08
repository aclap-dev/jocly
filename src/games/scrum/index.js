
var mvs = {
    "models": {
        "scrum": {
            "plazza": "true",
            "title-en": "Scrum",
            "js": [
                "scrum-model.js"
            ],
            "module": "scrum",
            "maxLevel": 5,
            "defaultLevel": 1,
            "summary": "A little rugby game",
            "rules": {
                "en": "rules.html",
                "fr": "rules-fr.html"
            },
            "description": {
                "en": "description.html",
                "fr": "description-fr.html"
            },
            "credits": {
                "en": "credits.html",
                "fr": "credits-fr.html"
            },
            "thumbnail": "scrum-thumb3d.png",
            "strings": {
                "no-surround": "You cannot completely surround the ball"
            },
            "gameOptions": {
                "preventRepeat": true,
                "width": 5,
                "height": 12,
                "initial": {
                    "a": [
                        [
                            1,
                            2
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            4
                        ],
                        [
                            3,
                            2
                        ],
                        [
                            4,
                            1
                        ],
                        [
                            5,
                            2
                        ],
                        [
                            5,
                            0
                        ]
                    ],
                    "b": [
                        [
                            11,
                            2
                        ],
                        [
                            10,
                            0
                        ],
                        [
                            10,
                            4
                        ],
                        [
                            9,
                            2
                        ],
                        [
                            8,
                            1
                        ],
                        [
                            7,
                            2
                        ],
                        [
                            7,
                            0
                        ]
                    ],
                    "ball": [
                        5,
                        1
                    ]
                },
                "uctTransposition": "states",
                "levelOptions": {
                    "MIN_MOVES": 20,
                    "ROW_FACTOR": 20,
                    "BDIST_FACTOR": 0.05,
                    "NEIGHBOR_FACTOR": 0.18953811793163
                }
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "maxDuration": 1,
                    "playoutDepth": 1,
                    "minVisitsExpand": 1,
                    "c": 0.35272296388695,
                    "ignoreLeaf": false,
                    "propagateMultiVisits": false,
                    "productRatio": 0,
                    "useDepthWeights": false,
                    "propagation": "mixed",
                    "useAlphaBeta": true,
                    "uncertaintyFactor": 2.4883591498064,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 1,
                    "minVisitsExpand": 1,
                    "c": 0.35272296388695,
                    "ignoreLeaf": false,
                    "propagateMultiVisits": false,
                    "productRatio": 0,
                    "useDepthWeights": false,
                    "propagation": "mixed",
                    "useAlphaBeta": true,
                    "uncertaintyFactor": 2.4883591498064,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 1,
                    "minVisitsExpand": 1,
                    "c": 0.35272296388695,
                    "ignoreLeaf": false,
                    "propagateMultiVisits": false,
                    "productRatio": 0,
                    "useDepthWeights": false,
                    "propagation": "mixed",
                    "useAlphaBeta": true,
                    "uncertaintyFactor": 2.4883591498064,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 1,
                    "minVisitsExpand": 1,
                    "c": 0.35272296388695,
                    "ignoreLeaf": false,
                    "propagateMultiVisits": false,
                    "productRatio": 0,
                    "useDepthWeights": false,
                    "propagation": "mixed",
                    "useAlphaBeta": true,
                    "uncertaintyFactor": 2.4883591498064,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 1,
                    "minVisitsExpand": 1,
                    "c": 0.35272296388695,
                    "ignoreLeaf": false,
                    "propagateMultiVisits": false,
                    "productRatio": 0,
                    "useDepthWeights": false,
                    "propagation": "mixed",
                    "useAlphaBeta": true,
                    "uncertaintyFactor": 2.4883591498064,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "playoutDepth": 1,
                    "minVisitsExpand": 1,
                    "c": 0.35272296388695,
                    "ignoreLeaf": false,
                    "propagateMultiVisits": false,
                    "productRatio": 0,
                    "useDepthWeights": false,
                    "propagation": "mixed",
                    "useAlphaBeta": true,
                    "uncertaintyFactor": 2.4883591498064,
                    "maxDuration": 60,
                    "maxNodes": 50000,
                    "maxLoops": 3000
                }
            ]
        }
    },
    "views": {
        "scrum": {
            "title-en": "Scrum View",
            "preferredRatio": 0.58,
            "switchable": true,
            "useNotation": true,
            "useShowMoves": true,
            "animateSelfMoves": false,
            "skins": [
                {
                    "name": "scrum3djocly",
                    "title": "Scrum 3D",
                    "3d": true,
                    "camera": {
                        "radius": 12,
                        "limitCamMoves": true,
                        "elevationMax": 80,
                        "rotationAngle": 30,
                        "elevationAngle": 35
                    },
                    "world": {
                        "lightIntensity": 1,
                        "fog": false,
                        "color": 0,
                        "lightPosition": {
                            "x": -10,
                            "y": 18,
                            "z": 10
                        },
                        "lightShadowDarkness": 0.35,
                        "ambientLightColor": 8947848,
                        "skyLightIntensity": 0.3
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/scrumfield8x12.jpg",
                        "image|/res/xd-view/meshes/teama-text.jpg",
                        "image|/res/xd-view/meshes/teamb-text.jpg",
                        "image|/res/xd-view/meshes/ballUVslayout.jpg",
                        "image|/res/xd-view/meshes/pubs.jocly.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/stade2-xtra.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/player-anim.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/scrum-ball.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrow.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrowscrum.js"
                    ],
                    "brand": "none"
                },
                {
                    "name": "scrum3dsg",
                    "title": "Scrum 3D",
                    "3d": true,
                    "camera": {
                        "radius": 12,
                        "limitCamMoves": true,
                        "elevationMax": 80,
                        "rotationAngle": 30,
                        "elevationAngle": 35
                    },
                    "world": {
                        "lightIntensity": 1,
                        "fog": false,
                        "color": 0,
                        "lightPosition": {
                            "x": -10,
                            "y": 18,
                            "z": 10
                        },
                        "lightShadowDarkness": 0.35,
                        "ambientLightColor": 8947848,
                        "skyLightIntensity": 0.3
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/scrumfield8x12.jpg",
                        "image|/res/xd-view/meshes/teama-text.jpg",
                        "image|/res/xd-view/meshes/teamb-text.jpg",
                        "image|/res/xd-view/meshes/ballUVslayout.jpg",
                        "image|/res/xd-view/meshes/pubs.jocly.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/stade2-xtra.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/player-anim.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/scrum-ball.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrow.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrowscrum.js"
                    ],
                    "brand": "sg"
                },
                {
                    "name": "scrum3dhnk",
                    "title": "Scrum 3D",
                    "3d": true,
                    "camera": {
                        "radius": 12,
                        "limitCamMoves": true,
                        "elevationMax": 80,
                        "rotationAngle": 30,
                        "elevationAngle": 35
                    },
                    "world": {
                        "lightIntensity": 1,
                        "fog": false,
                        "color": 0,
                        "lightPosition": {
                            "x": -10,
                            "y": 18,
                            "z": 10
                        },
                        "lightShadowDarkness": 0.35,
                        "ambientLightColor": 8947848,
                        "skyLightIntensity": 0.3
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/scrumfield8x12.jpg",
                        "image|/res/xd-view/meshes/teama-text.jpg",
                        "image|/res/xd-view/meshes/teamb-text.jpg",
                        "image|/res/xd-view/meshes/ballUVslayout.jpg",
                        "image|/res/xd-view/meshes/pubs.jocly.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/stade2-xtra.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/player-anim.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/scrum-ball.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrow.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrowscrum.js"
                    ],
                    "brand": "hnk"
                },
                {
                    "name": "scrum3dlr",
                    "title": "Scrum 3D",
                    "3d": true,
                    "camera": {
                        "radius": 12,
                        "limitCamMoves": true,
                        "elevationMax": 80,
                        "rotationAngle": 30,
                        "elevationAngle": 35
                    },
                    "world": {
                        "lightIntensity": 1,
                        "fog": false,
                        "color": 0,
                        "lightPosition": {
                            "x": -10,
                            "y": 18,
                            "z": 10
                        },
                        "lightShadowDarkness": 0.35,
                        "ambientLightColor": 8947848,
                        "skyLightIntensity": 0.3
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/scrumfield8x12.jpg",
                        "image|/res/xd-view/meshes/teama-text.jpg",
                        "image|/res/xd-view/meshes/teamb-text.jpg",
                        "image|/res/xd-view/meshes/ballUVslayout.jpg",
                        "image|/res/xd-view/meshes/pubs.jocly.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/stade2-xtra.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/player-anim.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/scrum-ball.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrow.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrowscrum.js"
                    ],
                    "brand": "lr"
                },
                {
                    "name": "scrum3dea",
                    "title": "Scrum 3D",
                    "3d": true,
                    "camera": {
                        "radius": 12,
                        "limitCamMoves": true,
                        "elevationMax": 80,
                        "rotationAngle": 30,
                        "elevationAngle": 35
                    },
                    "world": {
                        "lightIntensity": 1,
                        "fog": false,
                        "color": 0,
                        "lightPosition": {
                            "x": -10,
                            "y": 18,
                            "z": 10
                        },
                        "lightShadowDarkness": 0.35,
                        "ambientLightColor": 8947848,
                        "skyLightIntensity": 0.3
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/scrumfield8x12.jpg",
                        "image|/res/xd-view/meshes/teama-text.jpg",
                        "image|/res/xd-view/meshes/teamb-text.jpg",
                        "image|/res/xd-view/meshes/ballUVslayout.jpg",
                        "image|/res/xd-view/meshes/pubs.jocly.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/stade2-xtra.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/player-anim.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/scrum-ball.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrow.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrowscrum.js"
                    ],
                    "brand": "ea"
                },
                {
                    "name": "scrum3dcc",
                    "title": "Scrum 3D",
                    "3d": true,
                    "camera": {
                        "radius": 12,
                        "limitCamMoves": true,
                        "elevationMax": 80,
                        "rotationAngle": 30,
                        "elevationAngle": 35
                    },
                    "world": {
                        "lightIntensity": 1,
                        "fog": false,
                        "color": 0,
                        "lightPosition": {
                            "x": -10,
                            "y": 18,
                            "z": 10
                        },
                        "lightShadowDarkness": 0.35,
                        "ambientLightColor": 8947848,
                        "skyLightIntensity": 0.3
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/scrumfield8x12.jpg",
                        "image|/res/xd-view/meshes/teama-text.jpg",
                        "image|/res/xd-view/meshes/teamb-text.jpg",
                        "image|/res/xd-view/meshes/ballUVslayout.jpg",
                        "image|/res/xd-view/meshes/pubs.jocly.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/stade2-xtra.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/player-anim.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/scrum-ball.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrow.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrowscrum.js"
                    ],
                    "brand": "cc"
                },
                {
                    "name": "scrum3dtb",
                    "title": "Scrum 3D",
                    "3d": true,
                    "camera": {
                        "radius": 12,
                        "limitCamMoves": true,
                        "elevationMax": 80,
                        "rotationAngle": 30,
                        "elevationAngle": 35
                    },
                    "world": {
                        "lightIntensity": 1,
                        "fog": false,
                        "color": 0,
                        "lightPosition": {
                            "x": -10,
                            "y": 18,
                            "z": 10
                        },
                        "lightShadowDarkness": 0.35,
                        "ambientLightColor": 8947848,
                        "skyLightIntensity": 0.3
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/scrumfield8x12.jpg",
                        "image|/res/xd-view/meshes/teama-text.jpg",
                        "image|/res/xd-view/meshes/teamb-text.jpg",
                        "image|/res/xd-view/meshes/ballUVslayout.jpg",
                        "image|/res/xd-view/meshes/pubs.jocly.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/stade2-xtra.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/player-anim.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/scrum-ball.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrow.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrowscrum.js"
                    ],
                    "brand": "tb"
                },
                {
                    "name": "scrum3dmc",
                    "title": "Scrum 3D",
                    "3d": true,
                    "camera": {
                        "radius": 12,
                        "limitCamMoves": true,
                        "elevationMax": 80,
                        "rotationAngle": 30,
                        "elevationAngle": 35
                    },
                    "world": {
                        "lightIntensity": 1,
                        "fog": false,
                        "color": 0,
                        "lightPosition": {
                            "x": -10,
                            "y": 18,
                            "z": 10
                        },
                        "lightShadowDarkness": 0.35,
                        "ambientLightColor": 8947848,
                        "skyLightIntensity": 0.3
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/scrumfield8x12.jpg",
                        "image|/res/xd-view/meshes/teama-text.jpg",
                        "image|/res/xd-view/meshes/teamb-text.jpg",
                        "image|/res/xd-view/meshes/ballUVslayout.jpg",
                        "image|/res/xd-view/meshes/pubs.jocly.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/stade2-xtra.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/player-anim.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/scrum-ball.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrow.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrowscrum.js"
                    ],
                    "brand": "mc"
                },
                {
                    "name": "scrum3ddhl",
                    "title": "Scrum 3D",
                    "3d": true,
                    "camera": {
                        "radius": 12,
                        "limitCamMoves": true,
                        "elevationMax": 80,
                        "rotationAngle": 30,
                        "elevationAngle": 35
                    },
                    "world": {
                        "lightIntensity": 1,
                        "fog": false,
                        "color": 0,
                        "lightPosition": {
                            "x": -10,
                            "y": 18,
                            "z": 10
                        },
                        "lightShadowDarkness": 0.35,
                        "ambientLightColor": 8947848,
                        "skyLightIntensity": 0.3
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/scrumfield8x12.jpg",
                        "image|/res/xd-view/meshes/teama-text.jpg",
                        "image|/res/xd-view/meshes/teamb-text.jpg",
                        "image|/res/xd-view/meshes/ballUVslayout.jpg",
                        "image|/res/xd-view/meshes/pubs.jocly.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/stade2-xtra.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/player-anim.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/scrum-ball.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrow.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/arrowscrum.js"
                    ],
                    "brand": "dhl"
                },
                {
                    "name": "regular",
                    "title": "Classical 2D",
                    "brand": "none",
                    "preload": [
                        "image|/res/xd-view/meshes/scrumfield8x12.jpg",
                        "image|/res/images/regular.png"
                    ]
                },
                {
                    "name": "regularsg",
                    "title": "Classical 2D",
                    "brand": "sg"
                },
                {
                    "name": "regularhnk",
                    "title": "Classical 2D",
                    "brand": "hnk"
                },
                {
                    "name": "regularlr",
                    "title": "Classical 2D",
                    "brand": "lr"
                },
                {
                    "name": "regularea",
                    "title": "Classical 2D",
                    "brand": "ea"
                },
                {
                    "name": "regularcc",
                    "title": "Classical 2D",
                    "brand": "cc"
                },
                {
                    "name": "regulartb",
                    "title": "Classical 2D",
                    "brand": "tb"
                },
                {
                    "name": "regularmc",
                    "title": "Classical 2D",
                    "brand": "mc"
                },
                {
                    "name": "regulardhl",
                    "title": "Classical 2D",
                    "brand": "dhl"
                }
            ],
            "sounds": {
                "whistle": "whistle",
                "win": "stadiumcrowd",
                "loss": "stadiumcrowd",
                "end": "stadiumcrowd"
            },
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true,
                "skin-scrum": "rugby"
            },
            "xdView": true,
            "js": [
                "scrum-xd-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/scrum-600x600-3d.jpg",
                    "res/visuals/scrum-600x600-2d.jpg"
                ]
            },
            "css": [
                "scrum.css"
            ]
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
    games[name].viewScripts = mvs.views[name].js;
    games[name].config.view = mvs.views[name];
}

exports.games = Object.keys(games).map((name)=>{
    return games[name];
});
