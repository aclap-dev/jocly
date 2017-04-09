
var mvs = {
    "models": {
        "tafl-tablut": {
            "plazza": "true",
            "title-en": "Tablut",
            "module": "tafl",
            "js": [
                "tafl-model.js"
            ],
            "summary": "9x9 board (from Laponia)",
            "thumbnail": "thumb-tafl-tablut.png",
            "rules": {
                "en": "rules-tafl-tablut.html",
                "fr": "rules-tafl-tablut-fr.html"
            },
            "description": {
                "en": "description.html",
                "fr": "description-fr.html"
            },
            "credits": {
                "en": "credits.html",
                "fr": "credits-fr.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "levelOptions": {
                    "attackersCountFactor": 10,
                    "defendersCountFactor": -10,
                    "kingPathFactor": -20,
                    "kingFreedomFactor": -0.1,
                    "distKingFactor": -0.05
                },
                "exclude": [],
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
            "visuals": [
                "res/visuals/tablut-600x600-3d.jpg",
                "res/visuals/tablut-600x600-2d.jpg"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
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
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 10000,
                    "maxDuration": 10
                }
            ]
        },
        "tafl-ardri": {
            "plazza": "true",
            "title-en": "Ardri",
            "module": "tafl",
            "js": [
                "tafl-model.js"
            ],
            "summary": "7x7 board (from Scotland)",
            "thumbnail": "thumb-tafl-ardri.png",
            "rules": {
                "en": "rules-tafl-ardri.html",
                "fr": "rules-tafl-ardri-fr.html"
            },
            "description": {
                "en": "description.html",
                "fr": "description-fr.html"
            },
            "credits": {
                "en": "credits.html",
                "fr": "credits-fr.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "levelOptions": {
                    "attackersCountFactor": 10,
                    "defendersCountFactor": -10,
                    "kingPathFactor": -20,
                    "kingFreedomFactor": -0.1,
                    "distKingFactor": -0.05
                },
                "exclude": [
                    0,
                    6,
                    42,
                    48
                ],
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
            "visuals": [
                "res/visuals/ardri-600x600-3d.jpg",
                "res/visuals/ardri-600x600-2d.jpg"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
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
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 10000,
                    "maxDuration": 10
                }
            ]
        },
        "tafl-hnefatafl": {
            "plazza": "true",
            "title-en": "Hnefatafl",
            "module": "tafl",
            "js": [
                "tafl-model.js"
            ],
            "summary": "11x11 board (from Scandinavia)",
            "thumbnail": "thumb-tafl-hnefatafl.png",
            "rules": {
                "en": "rules-tafl-hnefatafl.html",
                "fr": "rules-tafl-hnefatafl-fr.html"
            },
            "description": {
                "en": "description.html",
                "fr": "description-fr.html"
            },
            "credits": {
                "en": "credits.html",
                "fr": "credits-fr.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "levelOptions": {
                    "attackersCountFactor": 10,
                    "defendersCountFactor": -10,
                    "kingPathFactor": -20,
                    "kingFreedomFactor": -0.1,
                    "distKingFactor": -0.05
                },
                "exclude": [
                    0,
                    10,
                    110,
                    120
                ],
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
                    "defenders": {
                        "king": 60,
                        "soldiers": [
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
                    }
                },
                "homeCatch": true,
                "privateHome": true,
                "centerDistance": 5
            },
            "demoRandom": true,
            "visuals": [
                "res/visuals/hnefatafl-600x600-3d.jpg",
                "res/visuals/hnefatafl-600x600-2d.jpg"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
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
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 10000,
                    "maxDuration": 10
                }
            ]
        },
        "tawlbwrdd": {
            "plazza": "true",
            "title-en": "Tawlbwrdd",
            "module": "tafl",
            "js": [
                "tafl-model.js"
            ],
            "summary": "11x11 board (from Wales)",
            "thumbnail": "thumb-tawlbwrdd.png",
            "rules": {
                "en": "rules-tawlbwrdd.html",
                "fr": "rules-tawlbwrdd-fr.html"
            },
            "description": {
                "en": "description.html",
                "fr": "description-fr.html"
            },
            "credits": {
                "en": "credits.html",
                "fr": "credits-fr.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "levelOptions": {
                    "attackersCountFactor": 10,
                    "defendersCountFactor": -10,
                    "kingPathFactor": -20,
                    "kingFreedomFactor": -0.1,
                    "distKingFactor": -0.05
                },
                "exclude": [
                    0,
                    10,
                    110,
                    120
                ],
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
                    "defenders": {
                        "king": 60,
                        "soldiers": [
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
                    }
                },
                "homeCatch": true,
                "privateHome": true,
                "centerDistance": 5
            },
            "demoRandom": true,
            "visuals": [
                "res/visuals/tawlbwrdd-600x600-3d.jpg",
                "res/visuals/tawlbwrdd-600x600-2d.jpg"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
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
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 10000,
                    "maxDuration": 10
                }
            ]
        },
        "tafl-brandubh": {
            "plazza": "true",
            "title-en": "Brandubh",
            "module": "tafl",
            "js": [
                "tafl-model.js"
            ],
            "summary": "7x7 board (from Ireland)",
            "thumbnail": "thumb-tafl-brandubh.png",
            "rules": {
                "en": "rules-tafl-brandubh.html",
                "fr": "rules-tafl-brandubh-fr.html"
            },
            "description": {
                "en": "description.html",
                "fr": "description-fr.html"
            },
            "credits": {
                "en": "credits.html",
                "fr": "credits-fr.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "levelOptions": {
                    "attackersCountFactor": 10,
                    "defendersCountFactor": -10,
                    "kingPathFactor": -20,
                    "kingFreedomFactor": -0.1,
                    "distKingFactor": -0.05
                },
                "exclude": [
                    0,
                    6,
                    42,
                    48
                ],
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
            "visuals": [
                "res/visuals/brandubh-600x600-3d.jpg",
                "res/visuals/brandubh-600x600-2d.jpg"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
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
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 10000,
                    "maxDuration": 10
                }
            ]
        },
        "alea-evangelii": {
            "plazza": "true",
            "title-en": "Alea Evangelii",
            "module": "tafl",
            "js": [
                "tafl-model.js"
            ],
            "summary": "19x19 board (from England)",
            "thumbnail": "thumb-alea-evangelii.png",
            "rules": {
                "en": "rules-alea-evangelii.html",
                "fr": "rules-alea-evangelii-fr.html"
            },
            "description": {
                "en": "description.html",
                "fr": "description-fr.html"
            },
            "credits": {
                "en": "credits.html",
                "fr": "credits-fr.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "levelOptions": {
                    "attackersCountFactor": 10,
                    "defendersCountFactor": -10,
                    "kingPathFactor": -20,
                    "kingFreedomFactor": -0.1,
                    "distKingFactor": -0.05
                },
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
            "visuals": [
                "res/visuals/alea-evangelii-600x600-3d.jpg",
                "res/visuals/alea-evangelii-600x600-2d.jpg"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.65,
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
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
                    "uncertaintyFactor": 3,
                    "useAlphaBeta": true,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 10000,
                    "maxDuration": 10
                }
            ]
        }
    },
    "views": {
        "tafl-tablut": {
            "title-en": "Tafl view",
            "module": "tafl",
            "js": [
                "tafl-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "tafl.css"
            ],
            "preferredRatio": 1,
            "switchable": true,
            "useShowMoves": false,
            "useNotation": true,
            "sounds": {
                "death1": "death1",
                "death2": "death2",
                "death3": "death3",
                "move1": "move1",
                "move3": "move3"
            },
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "tafl3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "limitCamMoves": true,
                        "radius": 14,
                        "rotationAngle": 90,
                        "elevationAngle": 89.9,
                        "elevationMin": 2,
                        "elevationMax": 89.9
                    },
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 1118481,
                        "lightPosition": {
                            "x": 10,
                            "y": 5,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
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
                },
                {
                    "name": "tafl2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/xd-view/meshes/ardri-sprites.png",
                        "image|/res/images/ardriboard_bgx1024.jpg",
                        "image|/res/images/ardricellborders.png",
                        "image|/res/images/ardriblackcell.png",
                        "image|/res/images/ardrikingcell.png",
                        "image|/res/images/blackcell.png",
                        "image|/res/images/whitecell.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/tablut-600x600-3d.jpg",
                    "res/visuals/tablut-600x600-2d.jpg"
                ]
            }
        },
        "tafl-ardri": {
            "title-en": "Tafl view",
            "module": "tafl",
            "js": [
                "tafl-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "tafl.css"
            ],
            "preferredRatio": 1,
            "switchable": true,
            "useShowMoves": false,
            "useNotation": true,
            "sounds": {
                "death1": "death1",
                "death2": "death2",
                "death3": "death3",
                "move1": "move1",
                "move3": "move3"
            },
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "tafl3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "limitCamMoves": true,
                        "radius": 14,
                        "rotationAngle": 90,
                        "elevationAngle": 89.9,
                        "elevationMin": 2,
                        "elevationMax": 89.9
                    },
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 1118481,
                        "lightPosition": {
                            "x": 10,
                            "y": 5,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
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
                },
                {
                    "name": "tafl2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/xd-view/meshes/ardri-sprites.png",
                        "image|/res/images/ardriboard_bgx1024.jpg",
                        "image|/res/images/ardricellborders.png",
                        "image|/res/images/ardriblackcell.png",
                        "image|/res/images/ardrikingcell.png",
                        "image|/res/images/blackcell.png",
                        "image|/res/images/whitecell.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/ardri-600x600-3d.jpg",
                    "res/visuals/ardri-600x600-2d.jpg"
                ]
            }
        },
        "tafl-hnefatafl": {
            "title-en": "Tafl view",
            "module": "tafl",
            "js": [
                "tafl-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "tafl.css"
            ],
            "preferredRatio": 1,
            "switchable": true,
            "useShowMoves": false,
            "useNotation": true,
            "sounds": {
                "death1": "death1",
                "death2": "death2",
                "death3": "death3",
                "move1": "move1",
                "move3": "move3"
            },
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "tafl3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "limitCamMoves": true,
                        "radius": 14,
                        "rotationAngle": 90,
                        "elevationAngle": 89.9,
                        "elevationMin": 2,
                        "elevationMax": 89.9
                    },
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 1118481,
                        "lightPosition": {
                            "x": 10,
                            "y": 5,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
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
                },
                {
                    "name": "tafl2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/xd-view/meshes/ardri-sprites.png",
                        "image|/res/images/ardriboard_bgx1024.jpg",
                        "image|/res/images/ardricellborders.png",
                        "image|/res/images/ardriblackcell.png",
                        "image|/res/images/ardrikingcell.png",
                        "image|/res/images/blackcell.png",
                        "image|/res/images/whitecell.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/hnefatafl-600x600-3d.jpg",
                    "res/visuals/hnefatafl-600x600-2d.jpg"
                ]
            }
        },
        "tawlbwrdd": {
            "title-en": "Tafl view",
            "module": "tafl",
            "js": [
                "tafl-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "tafl.css"
            ],
            "preferredRatio": 1,
            "switchable": true,
            "useShowMoves": false,
            "useNotation": true,
            "sounds": {
                "death1": "death1",
                "death2": "death2",
                "death3": "death3",
                "move1": "move1",
                "move3": "move3"
            },
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "tafl3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "limitCamMoves": true,
                        "radius": 14,
                        "rotationAngle": 90,
                        "elevationAngle": 89.9,
                        "elevationMin": 2,
                        "elevationMax": 89.9
                    },
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 1118481,
                        "lightPosition": {
                            "x": 10,
                            "y": 5,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
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
                },
                {
                    "name": "tafl2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/xd-view/meshes/ardri-sprites.png",
                        "image|/res/images/ardriboard_bgx1024.jpg",
                        "image|/res/images/ardricellborders.png",
                        "image|/res/images/ardriblackcell.png",
                        "image|/res/images/ardrikingcell.png",
                        "image|/res/images/blackcell.png",
                        "image|/res/images/whitecell.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/tawlbwrdd-600x600-3d.jpg",
                    "res/visuals/tawlbwrdd-600x600-2d.jpg"
                ]
            }
        },
        "tafl-brandubh": {
            "title-en": "Tafl view",
            "module": "tafl",
            "js": [
                "tafl-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "tafl.css"
            ],
            "preferredRatio": 1,
            "switchable": true,
            "useShowMoves": false,
            "useNotation": true,
            "sounds": {
                "death1": "death1",
                "death2": "death2",
                "death3": "death3",
                "move1": "move1",
                "move3": "move3"
            },
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "tafl3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "limitCamMoves": true,
                        "radius": 14,
                        "rotationAngle": 90,
                        "elevationAngle": 89.9,
                        "elevationMin": 2,
                        "elevationMax": 89.9
                    },
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 1118481,
                        "lightPosition": {
                            "x": 10,
                            "y": 5,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
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
                },
                {
                    "name": "tafl2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/xd-view/meshes/ardri-sprites.png",
                        "image|/res/images/ardriboard_bgx1024.jpg",
                        "image|/res/images/ardricellborders.png",
                        "image|/res/images/ardriblackcell.png",
                        "image|/res/images/ardrikingcell.png",
                        "image|/res/images/blackcell.png",
                        "image|/res/images/whitecell.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/brandubh-600x600-3d.jpg",
                    "res/visuals/brandubh-600x600-2d.jpg"
                ]
            }
        },
        "alea-evangelii": {
            "title-en": "Tafl view",
            "module": "tafl",
            "js": [
                "tafl-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "tafl.css"
            ],
            "preferredRatio": 1,
            "switchable": true,
            "useShowMoves": false,
            "useNotation": true,
            "sounds": {
                "death1": "death1",
                "death2": "death2",
                "death3": "death3",
                "move1": "move1",
                "move3": "move3"
            },
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "tafl3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "limitCamMoves": true,
                        "radius": 14,
                        "rotationAngle": 90,
                        "elevationAngle": 89.9,
                        "elevationMin": 2,
                        "elevationMax": 89.9
                    },
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 1118481,
                        "lightPosition": {
                            "x": 10,
                            "y": 5,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
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
                },
                {
                    "name": "tafl2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/xd-view/meshes/ardri-sprites.png",
                        "image|/res/images/ardriboard_bgx1024.jpg",
                        "image|/res/images/ardricellborders.png",
                        "image|/res/images/ardriblackcell.png",
                        "image|/res/images/ardrikingcell.png",
                        "image|/res/images/blackcell.png",
                        "image|/res/images/whitecell.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/alea-evangelii-600x600-3d.jpg",
                    "res/visuals/alea-evangelii-600x600-2d.jpg"
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
