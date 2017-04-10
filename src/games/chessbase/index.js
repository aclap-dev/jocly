
var mvs = {
    "models": {
        "classic-chess": {
            "plazza": "true",
            "released": 1389887778,
            "title-en": "Chess",
            "module": "chessbase",
            "summary": "Regular Orthodox Classic Western Chess",
            "thumbnail": "knight-thumbnail.png",
            "rules": {
                "en": "rules.html",
                "fr": "rules-fr.html"
            },
            "credits": {
                "en": "credits.html",
                "fr": "credits-fr.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "classic-model.js",
                "classic-db.min.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "xiangqi": {
            "plazza": "true",
            "released": 1394466978,
            "title-en": "Xiangqi",
            "module": "chessbase",
            "summary": "Chinese Chess",
            "thumbnail": "xiangqi-thumb.png",
            "rules": {
                "en": "xiangqi-rules.html"
            },
            "credits": {
                "en": "xiangqi-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "xiangqi-model.js",
                "xiangqi-db.min.js"
            ],
            "description": {
                "en": "xiangqi-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "gardner-chess": {
            "plazza": "true",
            "released": 1398178578,
            "title-en": "Gardner MiniChess",
            "module": "chessbase",
            "summary": "Gardner 5x5 minichess (1969)",
            "thumbnail": "gardner-thumb.png",
            "rules": {
                "en": "gardner-rules.html"
            },
            "credits": {
                "en": "gardner-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "gardner-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ],
            "description": {
                "en": "gardner-description.html"
            }
        },
        "mini4x4-chess": {
            "plazza": "true",
            "released": 1398178577,
            "title-en": "Mini Chess 4x4",
            "module": "chessbase",
            "summary": "4x4 mini chess variant",
            "thumbnail": "mini4x4-thumb.png",
            "rules": {
                "en": "mini4x4-rules.html"
            },
            "credits": {
                "en": "mini4x4-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "mini4x4-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ],
            "description": {
                "en": "mini4x4-description.html"
            }
        },
        "mini4x5-chess": {
            "plazza": "true",
            "released": 1398178576,
            "title-en": "Mini Chess 4x5",
            "module": "chessbase",
            "summary": "4x5 mini chess variant",
            "thumbnail": "mini4x5-thumb.png",
            "rules": {
                "en": "mini4x5-rules.html"
            },
            "credits": {
                "en": "mini4x5-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "mini4x5-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ],
            "description": {
                "en": "mini4x5-description.html"
            }
        },
        "micro4x5-chess": {
            "plazza": "true",
            "released": 1398178575,
            "title-en": "Micro Chess",
            "module": "chessbase",
            "summary": "4x5 chess variant by Glimne (1997)",
            "thumbnail": "micro4x5-thumb.png",
            "rules": {
                "en": "micro4x5-rules.html"
            },
            "credits": {
                "en": "micro4x5-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "micro4x5-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ],
            "description": {
                "en": "micro4x5-description.html"
            }
        },
        "baby-chess": {
            "plazza": "true",
            "released": 1398178574,
            "title-en": "Baby Chess",
            "module": "chessbase",
            "summary": "5x5 Baby chess",
            "thumbnail": "baby-thumb.png",
            "rules": {
                "en": "baby-rules.html"
            },
            "credits": {
                "en": "baby-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "baby-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ],
            "description": {
                "en": "baby-description.html"
            }
        },
        "malett-chess": {
            "plazza": "true",
            "released": 1398178573,
            "title-en": "Malett Chess",
            "module": "chessbase",
            "summary": "5x5 chess variant by Jeff Malett",
            "thumbnail": "malett-thumb.png",
            "rules": {
                "en": "malett-rules.html"
            },
            "credits": {
                "en": "malett-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "malett-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ],
            "description": {
                "en": "malett-description.html"
            }
        },
        "los-alamos-chess": {
            "plazza": "true",
            "released": 1398178573,
            "title-en": "Los Alamos Chess",
            "module": "chessbase",
            "summary": "6x6 chess variant",
            "thumbnail": "los-alamos-thumb.png",
            "rules": {
                "en": "los-alamos-rules.html"
            },
            "credits": {
                "en": "los-alamos-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "los-alamos-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ],
            "description": {
                "en": "los-alamos-description.html"
            }
        },
        "attack-chess": {
            "plazza": "true",
            "released": 1398178572,
            "title-en": "Chess Attack",
            "module": "chessbase",
            "summary": "5x6 chess variant",
            "thumbnail": "attack-thumb.png",
            "rules": {
                "en": "attack-rules.html"
            },
            "credits": {
                "en": "attack-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "attack-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ],
            "description": {
                "en": "attack-description.html"
            }
        },
        "courier-chess": {
            "plazza": "true",
            "released": 1393430178,
            "title-en": "Courier Chess",
            "module": "chessbase",
            "summary": "12x8 chess (12th century)",
            "thumbnail": "courier-thumb.png",
            "rules": {
                "en": "courier-rules.html"
            },
            "credits": {
                "en": "courier-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "courier-model.js"
            ],
            "description": {
                "en": "courier-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 4000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [2sec]",
                    "maxDuration": 2,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 20000,
                    "maxDuration": 20
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 40000,
                    "maxDuration": 30
                }
            ]
        },
        "makruk": {
            "plazza": "true",
            "released": 1393948578,
            "title-en": "Makruk",
            "module": "chessbase",
            "summary": "Thai Chess",
            "thumbnail": "mk-thumb.png",
            "rules": {
                "en": "mk-rules.html"
            },
            "credits": {
                "en": "mk-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "makruk-model.js"
            ],
            "description": {
                "en": "mk-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "shako-chess": {
            "plazza": "true",
            "released": 1396536978,
            "title-en": "Shako",
            "module": "chessbase",
            "summary": "10x10 Chess",
            "thumbnail": "shako-thumb.png",
            "rules": {
                "en": "shako-rules.html",
                "fr": "shako-rules-fr.html"
            },
            "credits": {
                "en": "shako-credits.html",
                "fr": "shako-credits-fr.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "shako-model.js"
            ],
            "description": {
                "en": "shako-description.html",
                "fr": "shako-description-fr.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 6000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [3sec]",
                    "maxDuration": 3,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 30000,
                    "maxDuration": 30
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 60000,
                    "maxDuration": 45
                }
            ]
        },
        "shatranj-chess": {
            "plazza": "true",
            "released": 1401461778,
            "title-en": "Shatranj",
            "module": "chessbase",
            "summary": "Ancient Chess",
            "thumbnail": "shatranj-thumb.png",
            "rules": {
                "en": "shatranj-rules.html"
            },
            "credits": {
                "en": "shatranj-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.15,
                    "distPawnPromo2Factor": 0.05,
                    "distPawnPromo3Factor": 0.025
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "shatranj-model.js"
            ],
            "description": {
                "en": "shatranj-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "basic-chess": {
            "plazza": "true",
            "released": 1389887778,
            "title-en": "Basic Chess",
            "module": "chessbase",
            "summary": "Basic Chess",
            "thumbnail": "knight-thumbnail.png",
            "rules": {
                "en": "rules.html"
            },
            "credits": {
                "en": "credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": true,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "basic-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "raumschach": {
            "plazza": "true",
            "released": 1402066578,
            "title-en": "Raumschach",
            "module": "chessbase",
            "summary": "5x5x5 Chess",
            "thumbnail": "raumschach-thumb.png",
            "rules": {
                "en": "raumschach-rules.html"
            },
            "credits": {
                "en": "raumschach-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "multiplan-geo-model.js",
                "raumschach-model.js"
            ],
            "description": {
                "en": "raumschach-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 4000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [2sec]",
                    "maxDuration": 2,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 20000,
                    "maxDuration": 20
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 40000,
                    "maxDuration": 30
                }
            ]
        },
        "glinski-chess": {
            "plazza": "true",
            "released": 1396882578,
            "title-en": "Glinski Chess",
            "module": "chessbase",
            "summary": "Hexagonal Chess",
            "thumbnail": "glinski-thumb.png",
            "rules": {
                "en": "glinski-rules.html"
            },
            "credits": {
                "en": "glinski-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "hex-geo-model.js",
                "glinski-model.js"
            ],
            "description": {
                "en": "glinski-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 6000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [3sec]",
                    "maxDuration": 3,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 30000,
                    "maxDuration": 30
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 60000,
                    "maxDuration": 45
                }
            ]
        },
        "brusky-chess": {
            "plazza": "true",
            "released": 1398790818,
            "title-en": "Brusky Chess",
            "module": "chessbase",
            "summary": "Hexagonal Chess",
            "thumbnail": "brusky-thumb.png",
            "rules": {
                "en": "brusky-rules.html"
            },
            "credits": {
                "en": "brusky-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "hex-geo-model.js",
                "brusky-model.js"
            ],
            "description": {
                "en": "brusky-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 6000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [3sec]",
                    "maxDuration": 3,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 30000,
                    "maxDuration": 30
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 60000,
                    "maxDuration": 45
                }
            ]
        },
        "devasa-chess": {
            "plazza": "true",
            "released": 1403189777,
            "title-en": "De Vasa Chess",
            "module": "chessbase",
            "summary": "Hexagonal Chess",
            "thumbnail": "devasa-thumb.png",
            "rules": {
                "en": "devasa-rules.html"
            },
            "credits": {
                "en": "devasa-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "hex-geo-model.js",
                "devasa-model.js"
            ],
            "description": {
                "en": "devasa-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 6000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [3sec]",
                    "maxDuration": 3,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 30000,
                    "maxDuration": 30
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 60000,
                    "maxDuration": 45
                }
            ]
        },
        "mccooey-chess": {
            "plazza": "true",
            "released": 1402671378,
            "title-en": "McCooey Chess",
            "module": "chessbase",
            "summary": "Hexagonal Chess",
            "thumbnail": "mccooey-thumb.png",
            "rules": {
                "en": "mccooey-rules.html"
            },
            "credits": {
                "en": "mccooey-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "hex-geo-model.js",
                "mccooey-model.js"
            ],
            "description": {
                "en": "mccooey-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 6000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [3sec]",
                    "maxDuration": 3,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 30000,
                    "maxDuration": 30
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 60000,
                    "maxDuration": 45
                }
            ]
        },
        "shafran-chess": {
            "plazza": "true",
            "released": 1403535378,
            "title-en": "Shafran Chess",
            "module": "chessbase",
            "summary": "Hexagonal Chess",
            "thumbnail": "shafran-thumb.png",
            "rules": {
                "en": "shafran-rules.html"
            },
            "credits": {
                "en": "shafran-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "hex-geo-model.js",
                "shafran-model.js"
            ],
            "description": {
                "en": "shafran-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 6000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [3sec]",
                    "maxDuration": 3,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 30000,
                    "maxDuration": 30
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 60000,
                    "maxDuration": 45
                }
            ]
        },
        "circular-chess": {
            "plazza": "true",
            "released": 1397055378,
            "title-en": "Modern Circular Chess",
            "module": "chessbase",
            "summary": "Chess on a ring",
            "thumbnail": "circular-thumb.png",
            "rules": {
                "en": "circular-rules.html"
            },
            "credits": {
                "en": "circular-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "cylinder-geo-model.js",
                "circular-model.js"
            ],
            "description": {
                "en": "circular-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "byzantine-chess": {
            "plazza": "true",
            "released": 1401461778,
            "title-en": "Byzantine Chess",
            "module": "chessbase",
            "summary": "10th century circular Chess",
            "thumbnail": "byzantine-thumb.png",
            "rules": {
                "en": "byzantine-rules.html"
            },
            "credits": {
                "en": "byzantine-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.15,
                    "distPawnPromo2Factor": 0.05,
                    "distPawnPromo3Factor": 0.025
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "cylinder-geo-model.js",
                "byzantine-model.js"
            ],
            "description": {
                "en": "byzantine-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "3dchess": {
            "plazza": "true",
            "released": 1402584978,
            "title-en": "3D Chess",
            "module": "chessbase",
            "summary": "6x8x3 Chess",
            "thumbnail": "3dchess-thumb.png",
            "rules": {
                "en": "3dchess-rules.html"
            },
            "credits": {
                "en": "3dchess-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "multiplan-geo-model.js",
                "3dchess-model.js"
            ],
            "description": {
                "en": "3dchess-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 6000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [3sec]",
                    "maxDuration": 3,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 30000,
                    "maxDuration": 30
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 60000,
                    "maxDuration": 45
                }
            ]
        },
        "cylinder-chess": {
            "plazza": "true",
            "released": 1401720978,
            "title-en": "Cylinder Chess",
            "module": "chessbase",
            "summary": "Cylinder Chess",
            "thumbnail": "cylinder-thumb.png",
            "rules": {
                "en": "cylinder-rules.html"
            },
            "credits": {
                "en": "cylinder-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "cylinder-geo-model.js",
                "cylinder-model.js"
            ],
            "description": {
                "en": "cylinder-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "cubic-chess": {
            "plazza": "true",
            "released": 1395590178,
            "title-en": "360 Chess Authoring",
            "module": "chessbase",
            "summary": "Inventing the 360 Chess variant on a cube",
            "thumbnail": "cubic-chess-thumb.png",
            "rules": {
                "en": "rules.html"
            },
            "credits": {
                "en": "credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": true,
            "js": [
                "base-model.js",
                "cubic-geo-model.js",
                "cubic-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "rollerball-chess": {
            "plazza": "true",
            "released": 1397141778,
            "title-en": "Rollerball Chess",
            "module": "chessbase",
            "summary": "Chess variant on an unusual board",
            "thumbnail": "rollerball-thumb.png",
            "rules": {
                "en": "rollerball-rules.html"
            },
            "credits": {
                "en": "rollerball-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromoFactor": -0.05,
                    "distKingThroneFactor": -0.1
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "rollerball-model.js"
            ],
            "description": {
                "en": "rollerball-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "chess960": {
            "plazza": "true",
            "released": 1401720878,
            "title-en": "Chess 960",
            "module": "chessbase",
            "summary": "Chess from randomized positions",
            "thumbnail": "chess960-thumb.png",
            "rules": {
                "en": "chess960-rules.html"
            },
            "credits": {
                "en": "chess960-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "chess960-model.js"
            ],
            "description": {
                "en": "chess960-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "metamachy-chess": {
            "plazza": "true",
            "released": 1402412178,
            "title-en": "Metamachy",
            "module": "chessbase",
            "summary": "Chess on 12x12 with fairy pieces",
            "thumbnail": "metamachy-thumb.png",
            "rules": {
                "en": "metamachy-rules.html"
            },
            "credits": {
                "en": "metamachy-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "metamachy-model.js"
            ],
            "description": {
                "en": "metamachy-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 6000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "fast",
                    "label": "Fast [3sec]",
                    "maxDuration": 3,
                    "isDefault": true
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "medium",
                    "label": "Medium",
                    "maxNodes": 30000,
                    "maxDuration": 30
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 60000,
                    "maxDuration": 45
                }
            ]
        },
        "capablanca-chess": {
            "plazza": "true",
            "released": 1404893076,
            "title-en": "Capablanca Chess",
            "module": "chessbase",
            "summary": "Chess on 10x8 (1920)",
            "thumbnail": "capablanca-thumb.png",
            "rules": {
                "en": "capablanca-rules.html"
            },
            "credits": {
                "en": "capablanca-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "capablanca-model.js"
            ],
            "description": {
                "en": "capablanca-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "carrera-chess": {
            "plazza": "true",
            "released": 1404916434,
            "title-en": "Carerra Chess",
            "module": "chessbase",
            "summary": "Chess on 10x8 (1617)",
            "thumbnail": "carrera-thumb.png",
            "rules": {
                "en": "carrera-rules.html"
            },
            "credits": {
                "en": "carrera-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "carrera-model.js"
            ],
            "description": {
                "en": "carrera-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "gothic-chess": {
            "plazza": "true",
            "released": 1404982805,
            "title-en": "Gothic Chess",
            "module": "chessbase",
            "summary": "Chess on 10x8 (2000)",
            "thumbnail": "gothic-thumb.png",
            "rules": {
                "en": "gothic-rules.html"
            },
            "credits": {
                "en": "gothic-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "gothic-model.js"
            ],
            "description": {
                "en": "gothic-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "janus-chess": {
            "plazza": "true",
            "released": 1404997707,
            "title-en": "Janus Chess",
            "module": "chessbase",
            "summary": "Chess on 10x8 (1978)",
            "thumbnail": "janus-thumb.png",
            "rules": {
                "en": "janus-rules.html"
            },
            "credits": {
                "en": "janus-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "janus-model.js"
            ],
            "description": {
                "en": "janus-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "grand-chess": {
            "plazza": "true",
            "released": 1404985842,
            "title-en": "Grand Chess",
            "module": "chessbase",
            "summary": "Chess on 10x10 (1984)",
            "thumbnail": "grand-thumb.png",
            "rules": {
                "en": "grand-rules.html"
            },
            "credits": {
                "en": "grand-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "grand-model.js"
            ],
            "description": {
                "en": "grand-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "modern-chess": {
            "plazza": "true",
            "released": 1404999946,
            "title-en": "Modern Chess",
            "module": "chessbase",
            "summary": "Chess on 9x9 (1968)",
            "thumbnail": "modern-thumb.png",
            "rules": {
                "en": "modern-rules.html"
            },
            "credits": {
                "en": "modern-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "modern-model.js"
            ],
            "description": {
                "en": "modern-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "chancellor-chess": {
            "plazza": "true",
            "released": 1404918051,
            "title-en": "Chancellor Chess",
            "module": "chessbase",
            "summary": "Chess on 9x9 (1887)",
            "thumbnail": "chancellor-thumb.png",
            "rules": {
                "en": "chancellor-rules.html"
            },
            "credits": {
                "en": "chancellor-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "chancellor-model.js"
            ],
            "description": {
                "en": "chancellor-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "wildebeest-chess": {
            "plazza": "true",
            "released": 1405001496,
            "title-en": "Wildebeest Chess",
            "module": "chessbase",
            "summary": "Chess on 11x10 (1987)",
            "thumbnail": "wildebeest-thumb.png",
            "rules": {
                "en": "wildebeest-rules.html"
            },
            "credits": {
                "en": "wildebeest-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "wildebeest-model.js"
            ],
            "description": {
                "en": "wildebeest-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "smess": {
            "plazza": "true",
            "released": 1402671377,
            "title-en": "Smess",
            "module": "chessbase",
            "summary": "The Ninny's Chess (1970)",
            "thumbnail": "smess-thumb.png",
            "rules": {
                "en": "smess-rules.html"
            },
            "credits": {
                "en": "smess-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.2,
                    "distPawnPromo3Factor": 0.1,
                    "distPawnPromo4Factor": 0.05,
                    "distPawnPromo5Factor": 0.03
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "smess-geo-model.js",
                "smess-model.js"
            ],
            "description": {
                "en": "smess-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "demi-chess": {
            "plazza": "true",
            "released": 1403189778,
            "title-en": "Demi-Chess",
            "module": "chessbase",
            "summary": "4x8 chess variant by Peter Krystufek (1986)",
            "thumbnail": "demi-thumb.png",
            "rules": {
                "en": "demi-rules.html"
            },
            "credits": {
                "en": "demi-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "demi-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ],
            "description": {
                "en": "demi-description.html"
            }
        },
        "romanchenko-chess": {
            "plazza": "true",
            "released": 1403535377,
            "title-en": "Romanchenko's Chess",
            "module": "chessbase",
            "summary": "Shifted 8x8 chess variant by V. Romanchenko",
            "thumbnail": "romanchenko-thumb.png",
            "rules": {
                "en": "romanchenko-rules.html"
            },
            "credits": {
                "en": "romanchenko-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "romanchenko-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ],
            "description": {
                "en": "romanchenko-description.html"
            }
        },
        "amazon-chess": {
            "plazza": "true",
            "released": 1405068607,
            "title-en": "Amazon Chess",
            "module": "chessbase",
            "summary": "18th century, Russia",
            "thumbnail": "amazon-thumb.png",
            "rules": {
                "en": "amazon-rules.html"
            },
            "credits": {
                "en": "amazon-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "amazon-model.js"
            ],
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ],
            "description": {
                "en": "amazon-description.html"
            }
        },
        "dukerutland-chess": {
            "plazza": "true",
            "released": 1405068608,
            "title-en": "Duke of Rutland Chess",
            "module": "chessbase",
            "summary": "Chess on 14x10 (1747)",
            "thumbnail": "dukerutland-thumb.png",
            "rules": {
                "en": "dukerutland-rules.html"
            },
            "credits": {
                "en": "dukerutland-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "dukerutland-model.js"
            ],
            "description": {
                "en": "dukerutland-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "gustav3-chess": {
            "plazza": "true",
            "released": 1405068609,
            "title-en": "Gustav III Chess",
            "module": "chessbase",
            "summary": "Gustav Johan Billberg, 1839",
            "thumbnail": "gustav3-thumb.png",
            "rules": {
                "en": "gustav3-rules.html"
            },
            "credits": {
                "en": "gustav3-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "gustav3-model.js"
            ],
            "description": {
                "en": "gustav3-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "hyderabad-chess": {
            "plazza": "true",
            "released": 1405068610,
            "title-en": "Hyderabad Decimal Chess",
            "module": "chessbase",
            "summary": "Shir Muhammad Khan Iman, 1797-1798",
            "thumbnail": "hyderabad-thumb.png",
            "rules": {
                "en": "hyderabad-rules.html"
            },
            "credits": {
                "en": "hyderabad-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "hyderabad-model.js"
            ],
            "description": {
                "en": "hyderabad-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "kaisergame-chess": {
            "plazza": "true",
            "released": 1405068611,
            "title-en": "Kaiserspiel",
            "module": "chessbase",
            "summary": "Tressau, 1840",
            "thumbnail": "kaisergame-thumb.png",
            "rules": {
                "en": "kaisergame-rules.html"
            },
            "credits": {
                "en": "kaisergame-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "kaisergame-model.js"
            ],
            "description": {
                "en": "kaisergame-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "sultangame-chess": {
            "plazza": "true",
            "released": 1405068612,
            "title-en": "Sultanspiel",
            "module": "chessbase",
            "summary": "Tressau, 1840",
            "thumbnail": "sultangame-thumb.png",
            "rules": {
                "en": "sultangame-rules.html"
            },
            "credits": {
                "en": "sultangame-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "sultangame-model.js"
            ],
            "description": {
                "en": "sultangame-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "reformed-courier-chess": {
            "plazza": "true",
            "released": 1405068613,
            "title-en": "Reformed Courierspiel",
            "module": "chessbase",
            "summary": "Clément Bégnis, 2011",
            "thumbnail": "reformed-courier-thumb.png",
            "rules": {
                "en": "reformed-courier-rules.html"
            },
            "credits": {
                "en": "reformed-courier-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "reformed-courier-model.js"
            ],
            "description": {
                "en": "reformed-courier-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "tutti-frutti-chess": {
            "plazza": "true",
            "released": 1405068614,
            "title-en": "Tutti-Frutti Chess",
            "module": "chessbase",
            "summary": "Ralph Betza et Philip Cohen, 1978-79",
            "thumbnail": "tutti-frutti-thumb.png",
            "rules": {
                "en": "tutti-frutti-rules.html"
            },
            "credits": {
                "en": "tutti-frutti-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": {
                    "pieceValueFactor": 1,
                    "pieceValueRatioFactor": 1,
                    "posValueFactor": 0.1,
                    "averageDistKingFactor": -0.01,
                    "castleFactor": 0.1,
                    "minorPiecesMovedFactor": 0.1,
                    "checkFactor": 0.2,
                    "endingKingFreedomFactor": 0.01,
                    "endingDistKingFactor": 0.05,
                    "distKingCornerFactor": 0.1,
                    "distPawnPromo1Factor": 0.3,
                    "distPawnPromo2Factor": 0.1,
                    "distPawnPromo3Factor": 0.05
                }
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "tutti-frutti-model.js"
            ],
            "description": {
                "en": "tutti-frutti-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "strong",
                    "label": "Strong",
                    "maxNodes": 20000,
                    "maxDuration": 15
                }
            ]
        },
        "sweet16-chess": {
            "plazza": "true",
            "released": 1482940591,
            "title-en": "Sweet 16 Chess",
            "module": "chessbase",
            "summary": "A huge 16x16 Chess Variant",
            "thumbnail": "sweet16-thumb.png",
            "rules": {
                "en": "sweet16-rules.html"
            },
            "credits": {
                "en": "sweet16-credits.html"
            },
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "state",
                "uctIgnoreLoop": false,
                "levelOptions": []
            },
            "obsolete": false,
            "js": [
                "base-model.js",
                "grid-geo-model.js",
                "sweet16-model.js"
            ],
            "description": {
                "en": "sweet16-description.html"
            },
            "levels": [
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 3,
                    "name": "easy",
                    "label": "Easy",
                    "maxNodes": 1000
                },
                {
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
                    "c": 0.6,
                    "ignoreLeaf": false,
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
        "classic-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin3dflat",
                    "title": "3D Flat",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "image|/res/extruded/wood.jpg",
                        "image|/res/extruded/wikipedia-pieces-diffuse-white.jpg",
                        "image|/res/extruded/wikipedia-pieces-diffuse-black.jpg",
                        "smoothedfilegeo|0|/res/extruded/flat3dpieces-king.js",
                        "smoothedfilegeo|0|/res/extruded/flat3dpieces-queen.js",
                        "smoothedfilegeo|0|/res/extruded/flat3dpieces-pawn.js",
                        "smoothedfilegeo|0|/res/extruded/flat3dpieces-rook.js",
                        "smoothedfilegeo|0|/res/extruded/flat3dpieces-knight.js",
                        "smoothedfilegeo|0|/res/extruded/flat3dpieces-bishop.js"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 89,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2dfull",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                },
                {
                    "name": "skin2dwood",
                    "title": "2D Wood",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/woodenpieces2d2.png",
                        "image|/res/images/wood.jpg"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "extruded-set-view.js",
                "classic-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/classic-chess-600x600-3d.jpg",
                    "res/visuals/classic-chess-600x600-2d.jpg"
                ]
            }
        },
        "xiangqi": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 0.9,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "smoothedfilegeo|0|/res/xiangqi/token.js",
                        "image|/res/xiangqi/clearwoodtexture.jpg",
                        "image|/res/xiangqi/decoration-cross.png",
                        "image|/res/xiangqi/whitebg.png",
                        "image|/res/xiangqi/xiangqi-pieces-sprites-playera.png",
                        "image|/res/xiangqi/xiangqi-pieces-sprites-playerb.png",
                        "image|/res/xiangqi/piecebump.jpg"
                    ],
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": 10,
                            "y": 10,
                            "z": 10
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.75,
                        "ambientLightColor": 4473924
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin3dwall",
                    "title": "3D Wall",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "smoothedfilegeo|0|/res/xiangqi/token.js",
                        "image|/res/xiangqi/wood3.jpg",
                        "image|/res/xiangqi/clearwoodtexture.jpg",
                        "image|/res/xiangqi/decoration-cross.png",
                        "image|/res/xiangqi/whitebg.png",
                        "image|/res/xiangqi/xiangqi-pieces-sprites-playera.png",
                        "image|/res/xiangqi/xiangqi-pieces-sprites-playerb.png",
                        "image|/res/xiangqi/piecebump.jpg"
                    ],
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": 10,
                            "y": 10,
                            "z": 10
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.75,
                        "ambientLightColor": 4473924
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 89,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin3dwestern",
                    "title": "3D Western",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "smoothedfilegeo|0|/res/xiangqi/token.js",
                        "image|/res/xiangqi/wood3.jpg",
                        "image|/res/xiangqi/clearwoodtexture.jpg",
                        "image|/res/xiangqi/decoration-cross.png",
                        "image|/res/xiangqi/whitebg.png",
                        "image|/res/xiangqi/xiangqi-pieces-sprites-western-player.png",
                        "image|/res/xiangqi/piecebump.jpg"
                    ],
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": 10,
                            "y": 10,
                            "z": 10
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.75,
                        "ambientLightColor": 4473924
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin3dwallwestern",
                    "title": "3D Wall Western",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "smoothedfilegeo|0|/res/xiangqi/token.js",
                        "image|/res/xiangqi/wood3.jpg",
                        "image|/res/xiangqi/clearwoodtexture.jpg",
                        "image|/res/xiangqi/decoration-cross.png",
                        "image|/res/xiangqi/whitebg.png",
                        "image|/res/xiangqi/xiangqi-pieces-sprites-western-player.png",
                        "image|/res/xiangqi/piecebump.jpg"
                    ],
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": 10,
                            "y": 10,
                            "z": 10
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.75,
                        "ambientLightColor": 4473924
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 89,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/xiangqi/wood3.jpg",
                        "image|/res/xiangqi/clearwoodtexture.jpg",
                        "image|/res/xiangqi/decoration-cross.png",
                        "image|/res/xiangqi/whitebg.png",
                        "image|/res/xiangqi/xiangqi-pieces-sprites.png"
                    ]
                },
                {
                    "name": "skin2dwestern",
                    "title": "2D Western",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/xiangqi/wood3.jpg",
                        "image|/res/xiangqi/clearwoodtexture.jpg",
                        "image|/res/xiangqi/decoration-cross.png",
                        "image|/res/xiangqi/whitebg.png",
                        "image|/res/xiangqi/xiangqi-pieces-sprites-western.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "xiangqi-board-view.js",
                "xiangqi-set-view.js",
                "xiangqi-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/xiangqi-600x600-3d.jpg",
                    "res/visuals/xiangqi-600x600-2d.jpg"
                ]
            }
        },
        "gardner-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "gardner-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/gardner-600x600-3d.jpg",
                    "res/visuals/gardner-600x600-2d.jpg"
                ]
            }
        },
        "mini4x4-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "mini4x4-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/mini4x4-600x600-3d.jpg",
                    "res/visuals/mini4x4-600x600-2d.jpg"
                ]
            }
        },
        "mini4x5-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "mini4x5-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/mini4x5-600x600-3d.jpg",
                    "res/visuals/mini4x5-600x600-2d.jpg"
                ]
            }
        },
        "micro4x5-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "micro4x5-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/micro4x5-600x600-3d.jpg",
                    "res/visuals/micro4x5-600x600-2d.jpg"
                ]
            }
        },
        "baby-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "baby-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/baby-600x600-3d.jpg",
                    "res/visuals/baby-600x600-2d.jpg"
                ]
            }
        },
        "malett-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "malett-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/malett-600x600-3d.jpg",
                    "res/visuals/malett-600x600-2d.jpg"
                ]
            }
        },
        "los-alamos-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "los-alamos-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/los-alamos-600x600-3d.jpg",
                    "res/visuals/los-alamos-600x600-2d.jpg"
                ]
            }
        },
        "attack-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "attack-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/attack-600x600-3d.jpg",
                    "res/visuals/attack-600x600-2d.jpg"
                ]
            }
        },
        "courier-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1.5,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "smoothedfilegeo|0|/res/courierchess/cc-pawn/cc-pawn.js",
                        "image|/res/courierchess/cc-pawn/cc-pawn-diffuse.jpg",
                        "image|/res/courierchess/cc-pawn/cc-pawn-normal.jpg",
                        "smoothedfilegeo|0|/res/courierchess/cc-archer/cc-archer.js",
                        "image|/res/courierchess/cc-archer/cc-archer-diffuse.jpg",
                        "image|/res/courierchess/cc-archer/cc-archer-normal.jpg",
                        "smoothedfilegeo|0|/res/courierchess/cc-queen/cc-queen.js",
                        "image|/res/courierchess/cc-queen/cc-queen-diffuse.jpg",
                        "image|/res/courierchess/cc-queen/cc-queen-normal.jpg",
                        "smoothedfilegeo|0|/res/courierchess/cc-schleich/cc-schleich.js",
                        "image|/res/courierchess/cc-schleich/cc-schleich-diffuse.jpg",
                        "image|/res/courierchess/cc-schleich/cc-schleich-normal.jpg",
                        "smoothedfilegeo|0|/res/courierchess/cc-knight/cc-knight.js",
                        "image|/res/courierchess/cc-knight/cc-knight-diffuse.jpg",
                        "image|/res/courierchess/cc-knight/cc-knight-normal.jpg",
                        "smoothedfilegeo|0|/res/courierchess/cc-man/cc-man.js",
                        "image|/res/courierchess/cc-man/cc-man-diffuse.jpg",
                        "image|/res/courierchess/cc-man/cc-man-normal.jpg",
                        "smoothedfilegeo|0|/res/courierchess/cc-courier/cc-courier.js",
                        "image|/res/courierchess/cc-courier/cc-courier-diffuse.jpg",
                        "image|/res/courierchess/cc-courier/cc-courier-normal.jpg",
                        "smoothedfilegeo|0|/res/courierchess/cc-rook/cc-rook.js",
                        "image|/res/courierchess/cc-rook/cc-rook-diffuse.jpg",
                        "image|/res/courierchess/cc-rook/cc-rook-normal.jpg",
                        "smoothedfilegeo|0|/res/courierchess/cc-king/cc-king.js",
                        "image|/res/courierchess/cc-king/cc-king-diffuse.jpg",
                        "image|/res/courierchess/cc-king/cc-king-normal.jpg",
                        "image|/res/images/crackles.jpg",
                        "image|/res/images/tileralpha.png"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 12,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/courierchess/wikipedia-courier-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "courier-board-view.js",
                "courierchess-set-view.js",
                "courier-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/courier-600x600-3d.jpg",
                    "res/visuals/courier-600x600-2d.jpg"
                ]
            }
        },
        "makruk": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/wood-chipboard-5.jpg",
                        "smoothedfilegeo|0|/res/makruk/pawn/mk-pawn.js",
                        "image|/res/makruk/pawn/mk-pawn-diffusemap.jpg",
                        "image|/res/makruk/pawn/mk-pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/makruk/knight/mk-knight.js",
                        "image|/res/makruk/knight/mk-knight-diffusemap.jpg",
                        "image|/res/makruk/knight/mk-knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/makruk/bishop/mk-bishop.js",
                        "image|/res/makruk/bishop/mk-bishop-diffusemap.jpg",
                        "image|/res/makruk/bishop/mk-bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/makruk/rook/mk-rook.js",
                        "image|/res/makruk/rook/mk-rook-diffusemap.jpg",
                        "image|/res/makruk/rook/mk-rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/makruk/queen/mk-queen.js",
                        "image|/res/makruk/queen/mk-queen-diffusemap.jpg",
                        "image|/res/makruk/queen/mk-queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/makruk/king/mk-king.js",
                        "image|/res/makruk/king/mk-king-diffusemap.jpg",
                        "image|/res/makruk/king/mk-king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.4,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -10,
                            "y": 5,
                            "z": 0
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.85,
                        "ambientLightColor": 1118481
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/wood-chipboard-4.jpg"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "makruk-board-view.js",
                "makruk-set-view.js",
                "makruk-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/makruk-600x600-3d.jpg",
                    "res/visuals/makruk-600x600-2d.jpg"
                ]
            }
        },
        "shako-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "shako-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/shako-600x600-3d.jpg",
                    "res/visuals/shako-600x600-2d.jpg"
                ]
            }
        },
        "shatranj-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "smoothedfilegeo|0|/res/nishapur/pawn/pawn.js",
                        "image|/res/nishapur/pawn/pawn-diffusemap.jpg",
                        "image|/res/nishapur/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/nishapur/knight/knight.js",
                        "image|/res/nishapur/knight/knight-diffusemap.jpg",
                        "image|/res/nishapur/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/nishapur/elephant/elephant.js",
                        "image|/res/nishapur/elephant/elephant-diffusemap.jpg",
                        "image|/res/nishapur/elephant/elephant-normalmap.jpg",
                        "smoothedfilegeo|0|/res/nishapur/rook/rook.js",
                        "image|/res/nishapur/rook/rook-diffusemap.jpg",
                        "image|/res/nishapur/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/nishapur/general/general.js",
                        "image|/res/nishapur/general/general-diffusemap.jpg",
                        "image|/res/nishapur/general/general-normalmap.jpg",
                        "smoothedfilegeo|0|/res/nishapur/king/king.js",
                        "image|/res/nishapur/king/king-diffusemap.jpg",
                        "image|/res/nishapur/king/king-normalmap.jpg",
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/wood-chipboard-2.jpg"
                    ],
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.4,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -10,
                            "y": 5,
                            "z": 0
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.85,
                        "ambientLightColor": 1118481
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/wood-chipboard-2.jpg",
                        "image|/res/nishapur/nishapur-2d-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "shatranj-board-view.js",
                "nishapur-set-view.js",
                "shatranj-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/shatranj-600x600-3d.jpg",
                    "res/visuals/shatranj-600x600-2d.jpg"
                ]
            }
        },
        "basic-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": []
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "basic-view.js"
            ]
        },
        "raumschach": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1.1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/unicorn/unicorn.js",
                        "image|/res/fairy/unicorn/unicorn-diffusemap.jpg",
                        "image|/res/fairy/unicorn/unicorn-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 16777215
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 200,
                        "radius": 24,
                        "elevationAngle": 40,
                        "elevationMin": -89,
                        "rotationAngle": 150,
                        "target": [
                            0,
                            0,
                            5000
                        ],
                        "targetBounds": [
                            3000,
                            3000,
                            6000
                        ]
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "multiplan-board-view.js",
                "fairy-set-view.js",
                "raumschach-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/raumschach-600x600-3d.jpg",
                    "res/visuals/raumschach-600x600-2d.jpg"
                ]
            }
        },
        "glinski-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css",
                "hex.css"
            ],
            "preferredRatio": 0.89,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target-hexagon.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 13.5,
                        "elevationAngle": 45,
                        "elevationMin": 0,
                        "distMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/cancel.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "hex-board-view.js",
                "staunton-set-view.js",
                "glinski-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/glinski-600x600-3d.jpg",
                    "res/visuals/glinski-600x600-2d.jpg"
                ]
            }
        },
        "brusky-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css",
                "hex.css"
            ],
            "preferredRatio": 1.7,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 13.5,
                        "elevationAngle": 45,
                        "elevationMin": 0,
                        "distMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/cancel.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "hex-board-view.js",
                "staunton-set-view.js",
                "brusky-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/brusky-600x600-3d.jpg",
                    "res/visuals/brusky-600x600-2d.jpg"
                ]
            }
        },
        "devasa-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css",
                "hex.css"
            ],
            "preferredRatio": 1.154700538,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target-hexagon.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 14.5,
                        "elevationAngle": 45,
                        "elevationMin": 0,
                        "distMin": 0,
                        "rotationAngle": 80
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/cancel.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "hex-board-view.js",
                "staunton-set-view.js",
                "devasa-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/devasa-600x600-3d.jpg",
                    "res/visuals/devasa-600x600-2d.jpg"
                ]
            }
        },
        "mccooey-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css",
                "hex.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target-hexagon.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 13.5,
                        "elevationAngle": 45,
                        "elevationMin": 0,
                        "distMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/cancel.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "hex-board-view.js",
                "staunton-set-view.js",
                "mccooey-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/mccooey-600x600-3d.jpg",
                    "res/visuals/mccooey-600x600-2d.jpg"
                ]
            }
        },
        "shafran-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css",
                "hex.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target-cylinder-v3.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 13.5,
                        "elevationAngle": 45,
                        "elevationMin": 0,
                        "distMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/cancel.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "hex-board-view.js",
                "staunton-set-view.js",
                "shafran-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/shafran-600x600-3d.jpg",
                    "res/visuals/shafran-600x600-2d.jpg"
                ]
            }
        },
        "circular-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css",
                "circular.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target-cylinder-v3.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 14.5,
                        "elevationAngle": 45,
                        "elevationMin": 0,
                        "distMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/cancel.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "circular-board-view.js",
                "staunton-set-view.js",
                "circular-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/circular-600x600-3d.jpg",
                    "res/visuals/circular-600x600-2d.jpg"
                ]
            }
        },
        "byzantine-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css",
                "circular.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "smoothedfilegeo|0|/res/nishapur/pawn/pawn.js",
                        "image|/res/nishapur/pawn/pawn-diffusemap.jpg",
                        "image|/res/nishapur/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/nishapur/knight/knight.js",
                        "image|/res/nishapur/knight/knight-diffusemap.jpg",
                        "image|/res/nishapur/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/nishapur/elephant/elephant.js",
                        "image|/res/nishapur/elephant/elephant-diffusemap.jpg",
                        "image|/res/nishapur/elephant/elephant-normalmap.jpg",
                        "smoothedfilegeo|0|/res/nishapur/rook/rook.js",
                        "image|/res/nishapur/rook/rook-diffusemap.jpg",
                        "image|/res/nishapur/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/nishapur/general/general.js",
                        "image|/res/nishapur/general/general-diffusemap.jpg",
                        "image|/res/nishapur/general/general-normalmap.jpg",
                        "smoothedfilegeo|0|/res/nishapur/king/king.js",
                        "image|/res/nishapur/king/king-diffusemap.jpg",
                        "image|/res/nishapur/king/king-normalmap.jpg",
                        "image|/res/images/wikipedia.png",
                        "image|/res/byzantine/byzantine-board.jpg"
                    ],
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.4,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -10,
                            "y": 5,
                            "z": 0
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.85,
                        "ambientLightColor": 1118481
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 14.5,
                        "elevationAngle": 45,
                        "elevationMin": 0,
                        "distMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/wikipedia.png",
                        "image|/res/byzantine/byzantine-board.jpg",
                        "image|/res/nishapur/nishapur-2d-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "circular-board-view.js",
                "nishapur-set-view.js",
                "byzantine-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/byzantine-600x600-3d.jpg",
                    "res/visuals/byzantine-600x600-2d.jpg"
                ]
            }
        },
        "3dchess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 0.8,
                        "skyLightIntensity": 0.5,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 8947848
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 200,
                        "radius": 18,
                        "elevationAngle": 30,
                        "elevationMin": -89,
                        "rotationAngle": 150,
                        "target": [
                            0,
                            0,
                            2500
                        ],
                        "targetBounds": [
                            3000,
                            3000,
                            6000
                        ]
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "multiplan-board-view.js",
                "staunton-set-view.js",
                "3dchess-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/3dchess-600x600-3d.jpg",
                    "res/visuals/3dchess-600x600-2d.jpg"
                ]
            }
        },
        "cylinder-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [],
                    "world": {
                        "lightIntensity": 1,
                        "skyLightIntensity": 1,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": 10,
                            "y": 15,
                            "z": 0
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 16777215
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 200,
                        "radius": 18,
                        "elevationAngle": 0,
                        "elevationMin": -89,
                        "rotationAngle": -90,
                        "target": [
                            0,
                            0,
                            0
                        ],
                        "targetBounds": [
                            3000,
                            3000,
                            6000
                        ]
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "cylinder-board-view.js",
                "staunton-set-view.js",
                "cylinder-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/cylinder-600x600-3d.jpg",
                    "res/visuals/cylinder-600x600-2d.jpg"
                ]
            }
        },
        "cubic-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1.3333333333333,
            "useShowMoves": false,
            "useNotation": true,
            "useAutoComplete": false,
            "defaultOptions": {
                "sounds": true,
                "moves": false,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [],
                    "world": {
                        "lightIntensity": 0,
                        "skyLightIntensity": 0,
                        "lightCastShadow": false,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": 9,
                            "y": 14,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 16777215
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 200,
                        "radius": 25,
                        "elevationAngle": 45,
                        "elevationMin": -89,
                        "rotationAngle": -45,
                        "target": [
                            0,
                            0,
                            0
                        ],
                        "targetBounds": [
                            3000,
                            3000,
                            6000
                        ]
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": []
                }
            ],
            "animateSelfMoves": false,
            "switchable": false,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "cubic-board-view.js",
                "staunton-set-view.js",
                "cubic-view.js"
            ]
        },
        "rollerball-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg",
                        "image|/res/images/wood.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 14.5,
                        "elevationAngle": 45,
                        "elevationMin": 0,
                        "distMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/wikipedia.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/cancel.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "rollerball-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/rollerball-600x600-3d.jpg",
                    "res/visuals/rollerball-600x600-2d.jpg"
                ]
            }
        },
        "chess960": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "chess960-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/chess960-600x600-3d.jpg",
                    "res/visuals/chess960-600x600-2d.jpg"
                ]
            }
        },
        "metamachy-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/cannon2/cannon2.js",
                        "image|/res/fairy/cannon2/cannon2-diffusemap.jpg",
                        "image|/res/fairy/cannon2/cannon2-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/elephant/elephant.js",
                        "image|/res/fairy/elephant/elephant-diffusemap.jpg",
                        "image|/res/fairy/elephant/elephant-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/admiral/admiral.js",
                        "image|/res/fairy/admiral/admiral-diffusemap.jpg",
                        "image|/res/fairy/admiral/admiral-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/camel/camel.js",
                        "image|/res/fairy/camel/camel-diffusemap.jpg",
                        "image|/res/fairy/camel/camel-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/lion/lion.js",
                        "image|/res/fairy/lion/lion-diffusemap.jpg",
                        "image|/res/fairy/lion/lion-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/eagle/eagle.js",
                        "image|/res/fairy/eagle/eagle-diffusemap.jpg",
                        "image|/res/fairy/eagle/eagle-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "metamachy-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/metamachy-600x600-3d.jpg",
                    "res/visuals/metamachy-600x600-2d.jpg"
                ]
            }
        },
        "capablanca-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/cardinal/cardinal.js",
                        "image|/res/fairy/cardinal/cardinal-diffusemap.jpg",
                        "image|/res/fairy/cardinal/cardinal-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/marshall/marshall.js",
                        "image|/res/fairy/marshall/marshall-diffusemap.jpg",
                        "image|/res/fairy/marshall/marshall-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "capablanca-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/capablanca-600x600-3d.jpg",
                    "res/visuals/capablanca-600x600-2d.jpg"
                ]
            }
        },
        "carrera-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/cardinal/cardinal.js",
                        "image|/res/fairy/cardinal/cardinal-diffusemap.jpg",
                        "image|/res/fairy/cardinal/cardinal-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/marshall/marshall.js",
                        "image|/res/fairy/marshall/marshall-diffusemap.jpg",
                        "image|/res/fairy/marshall/marshall-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "capablanca-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/carrera-600x600-3d.jpg",
                    "res/visuals/carrera-600x600-2d.jpg"
                ]
            }
        },
        "gothic-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/cardinal/cardinal.js",
                        "image|/res/fairy/cardinal/cardinal-diffusemap.jpg",
                        "image|/res/fairy/cardinal/cardinal-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/marshall/marshall.js",
                        "image|/res/fairy/marshall/marshall-diffusemap.jpg",
                        "image|/res/fairy/marshall/marshall-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "capablanca-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/gothic-600x600-3d.jpg",
                    "res/visuals/gothic-600x600-2d.jpg"
                ]
            }
        },
        "janus-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/cardinal/cardinal.js",
                        "image|/res/fairy/cardinal/cardinal-diffusemap.jpg",
                        "image|/res/fairy/cardinal/cardinal-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "capablanca-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/janus-600x600-3d.jpg",
                    "res/visuals/janus-600x600-2d.jpg"
                ]
            }
        },
        "grand-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/cardinal/cardinal.js",
                        "image|/res/fairy/cardinal/cardinal-diffusemap.jpg",
                        "image|/res/fairy/cardinal/cardinal-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/marshall/marshall.js",
                        "image|/res/fairy/marshall/marshall-diffusemap.jpg",
                        "image|/res/fairy/marshall/marshall-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "grand-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/grand-600x600-3d.jpg",
                    "res/visuals/grand-600x600-2d.jpg"
                ]
            }
        },
        "modern-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/cardinal/cardinal.js",
                        "image|/res/fairy/cardinal/cardinal-diffusemap.jpg",
                        "image|/res/fairy/cardinal/cardinal-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "modern-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/modern-600x600-3d.jpg",
                    "res/visuals/modern-600x600-2d.jpg"
                ]
            }
        },
        "chancellor-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/marshall/marshall.js",
                        "image|/res/fairy/marshall/marshall-diffusemap.jpg",
                        "image|/res/fairy/marshall/marshall-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "modern-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/chancellor-600x600-3d.jpg",
                    "res/visuals/chancellor-600x600-2d.jpg"
                ]
            }
        },
        "wildebeest-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/camel/camel.js",
                        "image|/res/fairy/camel/camel-diffusemap.jpg",
                        "image|/res/fairy/camel/camel-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/dragon/dragon.js",
                        "image|/res/fairy/dragon/dragon-diffusemap.jpg",
                        "image|/res/fairy/dragon/dragon-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "wildebeest-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/wildebeest-600x600-3d.jpg",
                    "res/visuals/wildebeest-600x600-2d.jpg"
                ]
            }
        },
        "smess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "smoothedfilegeo|0|/res/smess/token.js",
                        "image|/res/smess/promo.png",
                        "image|/res/smess/arrow-top.png",
                        "image|/res/smess/arrow-top-left.png",
                        "image|/res/images/wood-chipboard-4.jpg",
                        "image|/res/smess/playera-bg.png",
                        "image|/res/smess/playerb-bg.png",
                        "image|/res/smess/smess-pieces-sprites.png"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/smess/promo.png",
                        "image|/res/smess/arrow-top.png",
                        "image|/res/smess/arrow-top-left.png",
                        "image|/res/images/wood-chipboard-4.jpg",
                        "image|/res/smess/smess-pieces-sprites-a.png",
                        "image|/res/smess/smess-pieces-sprites-b.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "smess-set-view.js",
                "smess-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/smess-600x600-3d.jpg",
                    "res/visuals/smess-600x600-2d.jpg"
                ]
            }
        },
        "demi-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "demi-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/demi-600x600-3d.jpg",
                    "res/visuals/demi-600x600-2d.jpg"
                ]
            }
        },
        "romanchenko-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "romanchenko-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/romanchenko-600x600-3d.jpg",
                    "res/visuals/romanchenko-600x600-2d.jpg"
                ]
            }
        },
        "amazon-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/amazon/amazon.js",
                        "image|/res/fairy/amazon/amazon-diffusemap.jpg",
                        "image|/res/fairy/amazon/amazon-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "amazon-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/amazon-600x600-3d.jpg",
                    "res/visuals/amazon-600x600-2d.jpg"
                ]
            }
        },
        "dukerutland-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/marshall/marshall.js",
                        "image|/res/fairy/marshall/marshall-diffusemap.jpg",
                        "image|/res/fairy/marshall/marshall-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/crowned-rook/crowned-rook.js",
                        "image|/res/fairy/crowned-rook/crowned-rook-diffusemap.jpg",
                        "image|/res/fairy/crowned-rook/crowned-rook-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "dukerutland-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/dukerutland-600x600-3d.jpg",
                    "res/visuals/dukerutland-600x600-2d.jpg"
                ]
            }
        },
        "gustav3-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/amazon/amazon.js",
                        "image|/res/fairy/amazon/amazon-diffusemap.jpg",
                        "image|/res/fairy/amazon/amazon-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "gustav3-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/gustav3-600x600-3d.jpg",
                    "res/visuals/gustav3-600x600-2d.jpg"
                ]
            }
        },
        "hyderabad-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/marshall/marshall.js",
                        "image|/res/fairy/marshall/marshall-diffusemap.jpg",
                        "image|/res/fairy/marshall/marshall-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/cardinal/cardinal.js",
                        "image|/res/fairy/cardinal/cardinal-diffusemap.jpg",
                        "image|/res/fairy/cardinal/cardinal-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/amazon/amazon.js",
                        "image|/res/fairy/amazon/amazon-diffusemap.jpg",
                        "image|/res/fairy/amazon/amazon-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "hyderabad-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/hyderabad-600x600-3d.jpg",
                    "res/visuals/hyderabad-600x600-2d.jpg"
                ]
            }
        },
        "kaisergame-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/cardinal/cardinal.js",
                        "image|/res/fairy/cardinal/cardinal-diffusemap.jpg",
                        "image|/res/fairy/cardinal/cardinal-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/amazon/amazon.js",
                        "image|/res/fairy/amazon/amazon-diffusemap.jpg",
                        "image|/res/fairy/amazon/amazon-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "grand-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/kaisergame-600x600-3d.jpg",
                    "res/visuals/kaisergame-600x600-2d.jpg"
                ]
            }
        },
        "sultangame-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/cardinal/cardinal.js",
                        "image|/res/fairy/cardinal/cardinal-diffusemap.jpg",
                        "image|/res/fairy/cardinal/cardinal-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/marshall/marshall.js",
                        "image|/res/fairy/marshall/marshall-diffusemap.jpg",
                        "image|/res/fairy/marshall/marshall-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/amazon/amazon.js",
                        "image|/res/fairy/amazon/amazon-diffusemap.jpg",
                        "image|/res/fairy/amazon/amazon-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "sultangame-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/sultangame-600x600-3d.jpg",
                    "res/visuals/sultangame-600x600-2d.jpg"
                ]
            }
        },
        "reformed-courier-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/elephant/elephant.js",
                        "image|/res/fairy/elephant/elephant-diffusemap.jpg",
                        "image|/res/fairy/elephant/elephant-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/lighthouse/lighthouse.js",
                        "image|/res/fairy/lighthouse/lighthouse-diffusemap.jpg",
                        "image|/res/fairy/lighthouse/lighthouse-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/unicorn/unicorn.js",
                        "image|/res/fairy/unicorn/unicorn-diffusemap.jpg",
                        "image|/res/fairy/unicorn/unicorn-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "reformed-courier-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/reformed-courier-600x600-3d.jpg",
                    "res/visuals/reformed-courier-600x600-2d.jpg"
                ]
            }
        },
        "tutti-frutti-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/fairy/pawn/pawn.js",
                        "image|/res/fairy/pawn/pawn-diffusemap.jpg",
                        "image|/res/fairy/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/knight/knight.js",
                        "image|/res/fairy/knight/knight-diffusemap.jpg",
                        "image|/res/fairy/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/bishop/bishop.js",
                        "image|/res/fairy/bishop/bishop-diffusemap.jpg",
                        "image|/res/fairy/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/king/king.js",
                        "image|/res/fairy/king/king-diffusemap.jpg",
                        "image|/res/fairy/king/king-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/rook/rook.js",
                        "image|/res/fairy/rook/rook-diffusemap.jpg",
                        "image|/res/fairy/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/queen/queen.js",
                        "image|/res/fairy/queen/queen-diffusemap.jpg",
                        "image|/res/fairy/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/amazon/amazon.js",
                        "image|/res/fairy/amazon/amazon-diffusemap.jpg",
                        "image|/res/fairy/amazon/amazon-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/marshall/marshall.js",
                        "image|/res/fairy/marshall/marshall-diffusemap.jpg",
                        "image|/res/fairy/marshall/marshall-normalmap.jpg",
                        "smoothedfilegeo|0|/res/fairy/cardinal/cardinal.js",
                        "image|/res/fairy/cardinal/cardinal-diffusemap.jpg",
                        "image|/res/fairy/cardinal/cardinal-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/fairy/wikipedia-fairy-sprites.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "fairy-set-view.js",
                "tutti-frutti-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/tutti-frutti-600x600-3d.jpg",
                    "res/visuals/tutti-frutti-600x600-2d.jpg"
                ]
            }
        },
        "sweet16-chess": {
            "title-en": "Chessbase view",
            "module": "chessbase",
            "xdView": true,
            "css": [
                "chessbase.css"
            ],
            "preferredRatio": 1,
            "useShowMoves": true,
            "useNotation": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false,
                "autocomplete": false
            },
            "skins": [
                {
                    "name": "skin3d",
                    "title": "3D Classic",
                    "3d": true,
                    "preload": [
                        "smoothedfilegeo|0|/res/ring-target.js",
                        "image|/res/images/cancel.png",
                        "image|/res/images/wikipedia.png",
                        "smoothedfilegeo|0|/res/staunton/pawn/pawn-classic.js",
                        "image|/res/staunton/pawn/pawn-diffusemap.jpg",
                        "image|/res/staunton/pawn/pawn-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/knight/knight.js",
                        "image|/res/staunton/knight/knight-diffusemap.jpg",
                        "image|/res/staunton/knight/knight-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/bishop/bishop.js",
                        "image|/res/staunton/bishop/bishop-diffusemap.jpg",
                        "image|/res/staunton/bishop/bishop-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/rook/rook.js",
                        "image|/res/staunton/rook/rook-diffusemap.jpg",
                        "image|/res/staunton/rook/rook-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/queen/queen.js",
                        "image|/res/staunton/queen/queen-diffusemap.jpg",
                        "image|/res/staunton/queen/queen-normalmap.jpg",
                        "smoothedfilegeo|0|/res/staunton/king/king.js",
                        "image|/res/staunton/king/king-diffusemap.jpg",
                        "image|/res/staunton/king/king-normalmap.jpg"
                    ],
                    "world": {
                        "lightIntensity": 1.3,
                        "skyLightIntensity": 1.2,
                        "lightCastShadow": true,
                        "fog": false,
                        "color": 4686804,
                        "lightPosition": {
                            "x": -9,
                            "y": 9,
                            "z": 9
                        },
                        "skyLightPosition": {
                            "x": 9,
                            "y": 9,
                            "z": 9
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 2236962
                    },
                    "camera": {
                        "fov": 45,
                        "distMax": 50,
                        "radius": 18,
                        "elevationAngle": 60,
                        "elevationMin": 0
                    }
                },
                {
                    "name": "skin2d",
                    "title": "2D Classic",
                    "3d": false,
                    "preload": [
                        "image|/res/images/cancel.png",
                        "image|/res/images/whitebg.png",
                        "image|/res/images/wikipedia.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "switchable": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": "promo",
                "usermove": null
            },
            "js": [
                "base-view.js",
                "grid-board-view.js",
                "staunton-set-view.js",
                "sweet16-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/sweet16-600x600-3d.jpg",
                    "res/visuals/sweet16-600x600-2d.jpg"
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
    games[name].viewScripts = mvs.views[name].js;
    games[name].config.view = mvs.views[name];
}

exports.games = Object.keys(games).map((name)=>{
    return games[name];
});
