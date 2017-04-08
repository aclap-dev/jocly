
var mvs = {
    "models": {
        "reversi": {
            "js": [
                "reversi-model.js"
            ],
            "plazza": "true",
            "released": 1409239768,
            "title-en": "Annexation",
            "module": "reversi",
            "summary": "Also called Reversi or Othello",
            "thumbnail": "thumb-reversi.png",
            "rules": {
                "en": "rules-reversi.html"
            },
            "credits": {
                "en": "credits.html"
            },
            "description": {
                "en": "description.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "levelOptions": {
                    "stableFactor": 20,
                    "aboutStableFactor": -20,
                    "aboutStableBorderFactor": -15,
                    "borderFactor": 5,
                    "aboutBorderFactor": -4,
                    "countFactor": 1,
                    "mobilityFactor": 5
                },
                "width": 8,
                "height": 8,
                "initial": {
                    "1": [
                        "3:4",
                        "4:3"
                    ],
                    "-1": [
                        "3:3",
                        "4:4"
                    ]
                }
            },
            "debugEval": true,
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [1sec]",
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 10000,
                    "maxDuration": 10
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "reversi6": {
            "js": [
                "reversi-model.js"
            ],
            "plazza": "true",
            "released": 1409239768,
            "title-en": "Annexation 6",
            "module": "reversi",
            "summary": "Reversi/Othello rules on a 6x6 board",
            "thumbnail": "thumb-reversi6.png",
            "rules": {
                "en": "rules-reversi6.html"
            },
            "credits": {
                "en": "credits.html"
            },
            "description": {
                "en": "description.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "levelOptions": {
                    "stableFactor": 20,
                    "aboutStableFactor": -20,
                    "aboutStableBorderFactor": -15,
                    "borderFactor": 5,
                    "aboutBorderFactor": -4,
                    "countFactor": 1,
                    "mobilityFactor": 5
                },
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
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [1sec]",
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 10000,
                    "maxDuration": 10
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "reversi4": {
            "js": [
                "reversi-model.js"
            ],
            "plazza": "true",
            "released": 1409239768,
            "title-en": "Annexation 4",
            "module": "reversi",
            "summary": "Reversi/Othello rules on a 4x4 board",
            "thumbnail": "thumb-reversi4.png",
            "rules": {
                "en": "rules-reversi4.html"
            },
            "credits": {
                "en": "credits.html"
            },
            "description": {
                "en": "description.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "levelOptions": {
                    "stableFactor": 20,
                    "aboutStableFactor": -20,
                    "aboutStableBorderFactor": -15,
                    "borderFactor": 5,
                    "aboutBorderFactor": -4,
                    "countFactor": 1,
                    "mobilityFactor": 5
                },
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
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [1sec]",
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 10000,
                    "maxDuration": 10
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "reversi10": {
            "js": [
                "reversi-model.js"
            ],
            "plazza": "true",
            "released": 1409239768,
            "title-en": "Annexation 10",
            "module": "reversi",
            "summary": "Reversi/Othello rules on a 10x10 board",
            "thumbnail": "thumb-reversi10.png",
            "rules": {
                "en": "rules-reversi10.html"
            },
            "credits": {
                "en": "credits.html"
            },
            "description": {
                "en": "description.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "levelOptions": {
                    "stableFactor": 20,
                    "aboutStableFactor": -20,
                    "aboutStableBorderFactor": -15,
                    "borderFactor": 5,
                    "aboutBorderFactor": -4,
                    "countFactor": 1,
                    "mobilityFactor": 5
                },
                "width": 10,
                "height": 10,
                "initial": {
                    "1": [
                        "4:5",
                        "5:4"
                    ],
                    "-1": [
                        "5:5",
                        "4:4"
                    ]
                }
            },
            "debugEval": true,
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [1sec]",
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 10000,
                    "maxDuration": 10
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "reversicross": {
            "js": [
                "reversi-model.js"
            ],
            "plazza": "true",
            "released": 1409239768,
            "title-en": "Annexation Cross",
            "module": "reversi",
            "summary": "Reversi/Othello rules on a cross-shaped board",
            "thumbnail": "thumb-cross.png",
            "rules": {
                "en": "rules-cross.html"
            },
            "credits": {
                "en": "credits.html"
            },
            "description": {
                "en": "description.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "levelOptions": {
                    "stableFactor": 20,
                    "aboutStableFactor": -20,
                    "aboutStableBorderFactor": -15,
                    "borderFactor": 5,
                    "aboutBorderFactor": -4,
                    "countFactor": 1,
                    "mobilityFactor": 5
                },
                "width": 8,
                "height": 8,
                "deadCells": {
                    "0:0": "#",
                    "0:1": "#",
                    "1:0": "#",
                    "1:1": "#",
                    "0:7": "#",
                    "0:6": "#",
                    "1:7": "#",
                    "1:6": "#",
                    "7:0": "#",
                    "7:1": "#",
                    "6:0": "#",
                    "6:1": "#",
                    "7:7": "#",
                    "7:6": "#",
                    "6:7": "#",
                    "6:6": "#"
                },
                "initial": {
                    "1": [
                        "3:4",
                        "4:3"
                    ],
                    "-1": [
                        "3:3",
                        "4:4"
                    ]
                }
            },
            "debugEval": true,
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [1sec]",
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 10000,
                    "maxDuration": 10
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "reversicross10": {
            "js": [
                "reversi-model.js"
            ],
            "plazza": "true",
            "released": 1409239768,
            "title-en": "Annexation Cross 10",
            "module": "reversi",
            "summary": "Reversi/Othello rules on a 10x10 cross-shaped board",
            "thumbnail": "thumb-cross10.png",
            "rules": {
                "en": "rules-cross10.html"
            },
            "credits": {
                "en": "credits.html"
            },
            "description": {
                "en": "description.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "levelOptions": {
                    "stableFactor": 20,
                    "aboutStableFactor": -20,
                    "aboutStableBorderFactor": -15,
                    "borderFactor": 5,
                    "aboutBorderFactor": -4,
                    "countFactor": 1,
                    "mobilityFactor": 5
                },
                "width": 10,
                "height": 10,
                "deadCells": {
                    "0:0": "#",
                    "0:1": "#",
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
                    "0:7": "#",
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
                "initial": {
                    "1": [
                        "4:5",
                        "5:4"
                    ],
                    "-1": [
                        "5:5",
                        "4:4"
                    ]
                }
            },
            "debugEval": true,
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [1sec]",
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 10000,
                    "maxDuration": 10
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "reversiturnover": {
            "js": [
                "reversi-model.js"
            ],
            "plazza": "true",
            "released": 1409239768,
            "title-en": "Annexation Turn-Over",
            "module": "reversi",
            "summary": "Reversi/Othello rules on a 10x10 octogonal-shaped board",
            "thumbnail": "thumb-turnover.png",
            "rules": {
                "en": "rules-turnover.html"
            },
            "credits": {
                "en": "credits.html"
            },
            "description": {
                "en": "description.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "levelOptions": {
                    "stableFactor": 20,
                    "aboutStableFactor": -20,
                    "aboutStableBorderFactor": -15,
                    "borderFactor": 5,
                    "aboutBorderFactor": -4,
                    "countFactor": 1,
                    "mobilityFactor": 5
                },
                "width": 10,
                "height": 10,
                "deadCells": {
                    "0:0": "#",
                    "0:1": "#",
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
                    "0:7": "#",
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
                "initial": {
                    "1": [
                        "4:5",
                        "5:4"
                    ],
                    "-1": [
                        "5:5",
                        "4:4"
                    ]
                }
            },
            "debugEval": true,
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [1sec]",
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 10000,
                    "maxDuration": 10
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "ignoreLeaf": false,
                    "log": true,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        }
    },
    "views": {
        "reversi": {
            "title-en": "Annex View",
            "js": [
                "reversi-xd-view.js"
            ],
            "xdView": true,
            "useNotation": true,
            "useShowMoves": true,
            "module": "reversi",
            "css": "reversi.css",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "distMax": 39.5,
                        "distMin": 10.1,
                        "elevationMin": -89.9,
                        "elevationMax": 89.9,
                        "limitCamMoves": true,
                        "fov": 45
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.3,
                        "lightPosition": {
                            "x": 10,
                            "y": 18,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.35,
                        "color": 4686804,
                        "ambientLightColor": 5592405,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/reversi-pieces-2-textures.png",
                        "image|/res/xd-view/reversi-pieces-2-textures-bump.png",
                        "smoothedfilegeo|0|/res/xd-view/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/reversi-pieces-6.js"
                    ]
                },
                {
                    "name": "classic2d",
                    "title": "2D Classic",
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/xd-view/boardtexture.jpg",
                        "image|/res/xd-view/cellshadows.png",
                        "image|/res/xd-view/sprites.png",
                        "image|/res/xd-view/select-target-2d.png"
                    ]
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/reversi-600x600-3d.jpg",
                    "res/visuals/reversi-600x600-2d.jpg"
                ]
            }
        },
        "reversi6": {
            "title-en": "Annex View",
            "js": [
                "reversi-xd-view.js"
            ],
            "xdView": true,
            "useNotation": true,
            "useShowMoves": true,
            "module": "reversi",
            "css": "reversi.css",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "distMax": 39.5,
                        "distMin": 10.1,
                        "elevationMin": -89.9,
                        "elevationMax": 89.9,
                        "limitCamMoves": true,
                        "fov": 45
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.3,
                        "lightPosition": {
                            "x": 10,
                            "y": 18,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.35,
                        "color": 4686804,
                        "ambientLightColor": 5592405,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/reversi-pieces-2-textures.png",
                        "image|/res/xd-view/reversi-pieces-2-textures-bump.png",
                        "smoothedfilegeo|0|/res/xd-view/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/reversi-pieces-6.js"
                    ]
                },
                {
                    "name": "classic2d",
                    "title": "2D Classic",
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/xd-view/boardtexture.jpg",
                        "image|/res/xd-view/cellshadows.png",
                        "image|/res/xd-view/sprites.png",
                        "image|/res/xd-view/select-target-2d.png"
                    ]
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/reversi6-600x600-3d.jpg",
                    "res/visuals/reversi6-600x600-2d.jpg"
                ]
            }
        },
        "reversi4": {
            "title-en": "Annex View",
            "js": [
                "reversi-xd-view.js"
            ],
            "xdView": true,
            "useNotation": true,
            "useShowMoves": true,
            "module": "reversi",
            "css": "reversi.css",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "distMax": 39.5,
                        "distMin": 10.1,
                        "elevationMin": -89.9,
                        "elevationMax": 89.9,
                        "limitCamMoves": true,
                        "fov": 45
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.3,
                        "lightPosition": {
                            "x": 10,
                            "y": 18,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.35,
                        "color": 4686804,
                        "ambientLightColor": 5592405,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/reversi-pieces-2-textures.png",
                        "image|/res/xd-view/reversi-pieces-2-textures-bump.png",
                        "smoothedfilegeo|0|/res/xd-view/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/reversi-pieces-6.js"
                    ]
                },
                {
                    "name": "classic2d",
                    "title": "2D Classic",
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/xd-view/boardtexture.jpg",
                        "image|/res/xd-view/cellshadows.png",
                        "image|/res/xd-view/sprites.png",
                        "image|/res/xd-view/select-target-2d.png"
                    ]
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/reversi4-600x600-3d.jpg",
                    "res/visuals/reversi4-600x600-2d.jpg"
                ]
            }
        },
        "reversi10": {
            "title-en": "Annex View",
            "js": [
                "reversi-xd-view.js"
            ],
            "xdView": true,
            "useNotation": true,
            "useShowMoves": true,
            "module": "reversi",
            "css": "reversi.css",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "distMax": 39.5,
                        "distMin": 10.1,
                        "elevationMin": -89.9,
                        "elevationMax": 89.9,
                        "limitCamMoves": true,
                        "fov": 45
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.3,
                        "lightPosition": {
                            "x": 10,
                            "y": 18,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.35,
                        "color": 4686804,
                        "ambientLightColor": 5592405,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/reversi-pieces-2-textures.png",
                        "image|/res/xd-view/reversi-pieces-2-textures-bump.png",
                        "smoothedfilegeo|0|/res/xd-view/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/reversi-pieces-6.js"
                    ]
                },
                {
                    "name": "classic2d",
                    "title": "2D Classic",
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/xd-view/boardtexture.jpg",
                        "image|/res/xd-view/cellshadows.png",
                        "image|/res/xd-view/sprites.png",
                        "image|/res/xd-view/select-target-2d.png"
                    ]
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/reversi10-600x600-3d.jpg",
                    "res/visuals/reversi10-600x600-2d.jpg"
                ]
            }
        },
        "reversicross": {
            "title-en": "Annex View",
            "js": [
                "reversi-xd-view.js"
            ],
            "xdView": true,
            "useNotation": true,
            "useShowMoves": true,
            "module": "reversi",
            "css": "reversi.css",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "distMax": 39.5,
                        "distMin": 10.1,
                        "elevationMin": -89.9,
                        "elevationMax": 89.9,
                        "limitCamMoves": true,
                        "fov": 45
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.3,
                        "lightPosition": {
                            "x": 10,
                            "y": 18,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.35,
                        "color": 4686804,
                        "ambientLightColor": 5592405,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/reversi-pieces-2-textures.png",
                        "image|/res/xd-view/reversi-pieces-2-textures-bump.png",
                        "smoothedfilegeo|0|/res/xd-view/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/reversi-pieces-6.js"
                    ]
                },
                {
                    "name": "classic2d",
                    "title": "2D Classic",
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/xd-view/boardtexture.jpg",
                        "image|/res/xd-view/cellshadows.png",
                        "image|/res/xd-view/sprites.png",
                        "image|/res/xd-view/select-target-2d.png"
                    ]
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/cross-600x600-3d.jpg",
                    "res/visuals/cross-600x600-2d.jpg"
                ]
            }
        },
        "reversicross10": {
            "title-en": "Annex View",
            "js": [
                "reversi-xd-view.js"
            ],
            "xdView": true,
            "useNotation": true,
            "useShowMoves": true,
            "module": "reversi",
            "css": "reversi.css",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "distMax": 39.5,
                        "distMin": 10.1,
                        "elevationMin": -89.9,
                        "elevationMax": 89.9,
                        "limitCamMoves": true,
                        "fov": 45
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.3,
                        "lightPosition": {
                            "x": 10,
                            "y": 18,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.35,
                        "color": 4686804,
                        "ambientLightColor": 5592405,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/reversi-pieces-2-textures.png",
                        "image|/res/xd-view/reversi-pieces-2-textures-bump.png",
                        "smoothedfilegeo|0|/res/xd-view/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/reversi-pieces-6.js"
                    ]
                },
                {
                    "name": "classic2d",
                    "title": "2D Classic",
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/xd-view/boardtexture.jpg",
                        "image|/res/xd-view/cellshadows.png",
                        "image|/res/xd-view/sprites.png",
                        "image|/res/xd-view/select-target-2d.png"
                    ]
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/cross10-600x600-3d.jpg",
                    "res/visuals/cross10-600x600-2d.jpg"
                ]
            }
        },
        "reversiturnover": {
            "title-en": "Annex View",
            "js": [
                "reversi-xd-view.js"
            ],
            "xdView": true,
            "useNotation": true,
            "useShowMoves": true,
            "module": "reversi",
            "css": "reversi.css",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "distMax": 39.5,
                        "distMin": 10.1,
                        "elevationMin": -89.9,
                        "elevationMax": 89.9,
                        "limitCamMoves": true,
                        "fov": 45
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.3,
                        "lightPosition": {
                            "x": 10,
                            "y": 18,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.35,
                        "color": 4686804,
                        "ambientLightColor": 5592405,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/reversi-pieces-2-textures.png",
                        "image|/res/xd-view/reversi-pieces-2-textures-bump.png",
                        "smoothedfilegeo|0|/res/xd-view/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/reversi-pieces-6.js"
                    ]
                },
                {
                    "name": "classic2d",
                    "title": "2D Classic",
                    "preload": [
                        "image|/res/xd-view/pass-dark.png",
                        "image|/res/xd-view/pass-light.png",
                        "image|/res/xd-view/boardtexture.jpg",
                        "image|/res/xd-view/cellshadows.png",
                        "image|/res/xd-view/sprites.png",
                        "image|/res/xd-view/select-target-2d.png"
                    ]
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/turnover-600x600-3d.jpg",
                    "res/visuals/turnover-600x600-2d.jpg"
                ]
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
