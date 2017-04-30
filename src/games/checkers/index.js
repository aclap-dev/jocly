
var mvs = {
    "models": {
        "alquerque-bell": {
            "plazza": "true",
            "title-en": "Alquerque",
            "module": "checkers",
            "maxLevel": 20,
            "summary": "A 10th century checkers game from Middle-East.",
            "thumbnail": "alquerque-thumb3d.png",
            "rules": "rules-alquerque-bell.html",
            "description": "description.html",
            "credits": "credits.html",
            "js": [
                "checkersbase-model.js",
                "alquerque-model.js"
            ],
            "gameOptions": {
                "preventRepeat": true,
                "width": 5,
                "height": 5,
                "initial": {
                    "a": [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            1
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            0,
                            3
                        ],
                        [
                            0,
                            4
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            1,
                            3
                        ],
                        [
                            1,
                            4
                        ],
                        [
                            2,
                            3
                        ],
                        [
                            2,
                            4
                        ]
                    ],
                    "b": [
                        [
                            4,
                            0
                        ],
                        [
                            4,
                            1
                        ],
                        [
                            4,
                            2
                        ],
                        [
                            4,
                            3
                        ],
                        [
                            4,
                            4
                        ],
                        [
                            3,
                            0
                        ],
                        [
                            3,
                            1
                        ],
                        [
                            3,
                            2
                        ],
                        [
                            3,
                            3
                        ],
                        [
                            3,
                            4
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            1
                        ]
                    ]
                },
                "variant": {
                    "canStepBack": false,
                    "mustMoveForward": true,
                    "lastRowFreeze": true,
                    "noMove": "lose"
                }
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "c": 0.8,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "maxDuration": 60,
                    "maxNodes": 15000,
                    "maxLoops": 8000
                }
            ]
        },
        "alquerque-avds": {
            "plazza": "true",
            "title-en": "Alquerque AvdS",
            "module": "checkers",
            "maxLevel": 20,
            "summary": "Alquerque rules proposal from a Draughts historian.",
            "thumbnail": "alquerque-avds3-thumb.png",
            "rules": "rules-alquerque-avds.html",
            "description": "description.html",
            "credits": "credits-avds.html",
            "js": [
                "checkersbase-model.js",
                "alquerque-avds-model.js"
            ],
            "gameOptions": {
                "preventRepeat": true,
                "width": 5,
                "height": 5,
                "initial": {
                    "a": [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            1
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            0,
                            3
                        ],
                        [
                            0,
                            4
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            1,
                            3
                        ],
                        [
                            1,
                            4
                        ],
                        [
                            2,
                            3
                        ],
                        [
                            2,
                            4
                        ]
                    ],
                    "b": [
                        [
                            4,
                            0
                        ],
                        [
                            4,
                            1
                        ],
                        [
                            4,
                            2
                        ],
                        [
                            4,
                            3
                        ],
                        [
                            4,
                            4
                        ],
                        [
                            3,
                            0
                        ],
                        [
                            3,
                            1
                        ],
                        [
                            3,
                            2
                        ],
                        [
                            3,
                            3
                        ],
                        [
                            3,
                            4
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            1
                        ]
                    ]
                },
                "variant": {
                    "canStepBack": true,
                    "mustMoveForward": true,
                    "lastRowFreeze": false,
                    "noMove": "lose",
                    "longRangeKing": true,
                    "kingCaptureShort": false,
                    "lastRowCrown": true,
                    "canCaptureBackward": false
                }
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "c": 0.8,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "maxDuration": 60,
                    "maxNodes": 15000,
                    "maxLoops": 8000
                }
            ]
        },
        "draughts": {
            "plazza": "true",
            "title-en": "International Draughts",
            "module": "checkers",
            "maxLevel": 20,
            "summary": "Rules for draughts as played in worldwide competitions.",
            "thumbnail": "draughts-thumb3d.png",
            "rules": "rules-draughts.html",
            "description": "description.html",
            "credits": "credits.html",
            "js": [
                "checkersbase-model.js",
                "draughts-model.js"
            ],
            "gameOptions": {
                "preventRepeat": true,
                "width": 5,
                "height": 10,
                "initial": {
                    "a": [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            1
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            0,
                            3
                        ],
                        [
                            0,
                            4
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            1,
                            3
                        ],
                        [
                            1,
                            4
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            1
                        ],
                        [
                            2,
                            2
                        ],
                        [
                            2,
                            3
                        ],
                        [
                            2,
                            4
                        ],
                        [
                            3,
                            0
                        ],
                        [
                            3,
                            1
                        ],
                        [
                            3,
                            2
                        ],
                        [
                            3,
                            3
                        ],
                        [
                            3,
                            4
                        ]
                    ],
                    "b": [
                        [
                            9,
                            0
                        ],
                        [
                            9,
                            1
                        ],
                        [
                            9,
                            2
                        ],
                        [
                            9,
                            3
                        ],
                        [
                            9,
                            4
                        ],
                        [
                            8,
                            0
                        ],
                        [
                            8,
                            1
                        ],
                        [
                            8,
                            2
                        ],
                        [
                            8,
                            3
                        ],
                        [
                            8,
                            4
                        ],
                        [
                            7,
                            0
                        ],
                        [
                            7,
                            1
                        ],
                        [
                            7,
                            2
                        ],
                        [
                            7,
                            3
                        ],
                        [
                            7,
                            4
                        ],
                        [
                            6,
                            0
                        ],
                        [
                            6,
                            1
                        ],
                        [
                            6,
                            2
                        ],
                        [
                            6,
                            3
                        ],
                        [
                            6,
                            4
                        ]
                    ]
                },
                "variant": {
                    "mustMoveForwardStrict": true,
                    "lastRowCrown": true,
                    "captureLongestLine": true,
                    "lastRowFactor": 0.001,
                    "captureInstantRemove": true
                },
                "uctTransposition": "state"
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "c": 0.8,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "maxDuration": 60,
                    "maxNodes": 15000,
                    "maxLoops": 8000
                }
            ]
        },
        "english-draughts": {
            "plazza": "true",
            "title-en": "English Draughts",
            "module": "checkers",
            "maxLevel": 20,
            "summary": "A popular version of checkers on a 8x8 board.",
            "thumbnail": "draughts8-thumb3d.png",
            "rules": "rules-brit-checkers.html",
            "description": "description.html",
            "credits": "credits.html",
            "js": [
                "checkersbase-model.js",
                "draughts-model.js"
            ],
            "gameOptions": {
                "preventRepeat": true,
                "width": 4,
                "height": 8,
                "initial": {
                    "a": [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            1
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            0,
                            3
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            1,
                            3
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            1
                        ],
                        [
                            2,
                            2
                        ],
                        [
                            2,
                            3
                        ]
                    ],
                    "b": [
                        [
                            7,
                            0
                        ],
                        [
                            7,
                            1
                        ],
                        [
                            7,
                            2
                        ],
                        [
                            7,
                            3
                        ],
                        [
                            6,
                            0
                        ],
                        [
                            6,
                            1
                        ],
                        [
                            6,
                            2
                        ],
                        [
                            6,
                            3
                        ],
                        [
                            5,
                            0
                        ],
                        [
                            5,
                            1
                        ],
                        [
                            5,
                            2
                        ],
                        [
                            5,
                            3
                        ]
                    ]
                },
                "variant": {
                    "mustMoveForwardStrict": true,
                    "lastRowCrown": true,
                    "captureLongestLine": true,
                    "longRangeKing": false,
                    "kingCaptureShort": true,
                    "lastRowFactor": 0.001,
                    "kingValue": 2,
                    "whiteStarts": false,
                    "canCaptureBackward": false
                },
                "invertNotation": true,
                "uctTransposition": "state"
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "c": 0.8,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "maxDuration": 60,
                    "maxNodes": 15000,
                    "maxLoops": 8000
                }
            ]
        },
        "brazilian-draughts": {
            "plazza": "true",
            "title-en": "Brazilian Draughts",
            "module": "checkers",
            "maxLevel": 20,
            "summary": "Same as international checkers on a 8x8 board.",
            "thumbnail": "draughts8-thumb3d.png",
            "rules": "rules-brazilian-draughts.html",
            "description": "description.html",
            "credits": "credits.html",
            "js": [
                "checkersbase-model.js",
                "draughts-model.js"
            ],
            "gameOptions": {
                "preventRepeat": true,
                "width": 4,
                "height": 8,
                "initial": {
                    "a": [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            1
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            0,
                            3
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            1,
                            3
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            1
                        ],
                        [
                            2,
                            2
                        ],
                        [
                            2,
                            3
                        ]
                    ],
                    "b": [
                        [
                            7,
                            0
                        ],
                        [
                            7,
                            1
                        ],
                        [
                            7,
                            2
                        ],
                        [
                            7,
                            3
                        ],
                        [
                            6,
                            0
                        ],
                        [
                            6,
                            1
                        ],
                        [
                            6,
                            2
                        ],
                        [
                            6,
                            3
                        ],
                        [
                            5,
                            0
                        ],
                        [
                            5,
                            1
                        ],
                        [
                            5,
                            2
                        ],
                        [
                            5,
                            3
                        ]
                    ]
                },
                "variant": {
                    "mustMoveForwardStrict": true,
                    "lastRowCrown": true,
                    "captureLongestLine": true,
                    "lastRowFactor": 0.001
                },
                "uctTransposition": "state"
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "c": 0.8,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "maxDuration": 60,
                    "maxNodes": 15000,
                    "maxLoops": 8000
                }
            ]
        },
        "spanish-draughts": {
            "plazza": "true",
            "title-en": "Spanish Draughts",
            "module": "checkers",
            "maxLevel": 20,
            "summary": "Same as international checkers on a 8x8 board, no backward capture.",
            "thumbnail": "draughts8-thumb3d.png",
            "rules": "rules-spanish-draughts.html",
            "description": "description.html",
            "credits": "credits.html",
            "js": [
                "checkersbase-model.js",
                "draughts-model.js"
            ],
            "gameOptions": {
                "preventRepeat": true,
                "width": 4,
                "height": 8,
                "initial": {
                    "a": [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            1
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            0,
                            3
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            1,
                            3
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            1
                        ],
                        [
                            2,
                            2
                        ],
                        [
                            2,
                            3
                        ]
                    ],
                    "b": [
                        [
                            7,
                            0
                        ],
                        [
                            7,
                            1
                        ],
                        [
                            7,
                            2
                        ],
                        [
                            7,
                            3
                        ],
                        [
                            6,
                            0
                        ],
                        [
                            6,
                            1
                        ],
                        [
                            6,
                            2
                        ],
                        [
                            6,
                            3
                        ],
                        [
                            5,
                            0
                        ],
                        [
                            5,
                            1
                        ],
                        [
                            5,
                            2
                        ],
                        [
                            5,
                            3
                        ]
                    ]
                },
                "variant": {
                    "mustMoveForwardStrict": true,
                    "lastRowCrown": true,
                    "captureLongestLine": true,
                    "lastRowFactor": 0.001,
                    "canCaptureBackward": false
                },
                "uctTransposition": "state"
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "c": 0.8,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "maxDuration": 60,
                    "maxNodes": 15000,
                    "maxLoops": 8000
                }
            ]
        },
        "brazilian-draughts-hlwn": {
            "obsolete": true,
            "plazza": "broken",
            "title-en": "Halloween Draughts",
            "module": "checkers",
            "maxLevel": 20,
            "summary": "Same as international checkers on a 8x8 board.",
            "thumbnail": "halloweenthumb.png",
            "rules": "rules-brazilian-draughts.html",
            "description": "description.html",
            "credits": "credits.html",
            "js": [
                "checkersbase-model.js",
                "draughts-model.js"
            ],
            "gameOptions": {
                "preventRepeat": true,
                "width": 4,
                "height": 8,
                "initial": {
                    "a": [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            1
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            0,
                            3
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            1,
                            3
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            1
                        ],
                        [
                            2,
                            2
                        ],
                        [
                            2,
                            3
                        ]
                    ],
                    "b": [
                        [
                            7,
                            0
                        ],
                        [
                            7,
                            1
                        ],
                        [
                            7,
                            2
                        ],
                        [
                            7,
                            3
                        ],
                        [
                            6,
                            0
                        ],
                        [
                            6,
                            1
                        ],
                        [
                            6,
                            2
                        ],
                        [
                            6,
                            3
                        ],
                        [
                            5,
                            0
                        ],
                        [
                            5,
                            1
                        ],
                        [
                            5,
                            2
                        ],
                        [
                            5,
                            3
                        ]
                    ]
                },
                "variant": {
                    "mustMoveForwardStrict": true,
                    "lastRowCrown": true,
                    "captureLongestLine": true,
                    "lastRowFactor": 0.001
                },
                "uctTransposition": "state"
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "c": 0.8,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "maxDuration": 60,
                    "maxNodes": 15000,
                    "maxLoops": 8000
                }
            ]
        },
        "german-draughts": {
            "plazza": "true",
            "title-en": "German Draughts",
            "module": "checkers",
            "maxLevel": 20,
            "summary": "Checkers according to German Draughts rules.",
            "thumbnail": "draughts8-thumb3d.png",
            "rules": "rules-german-draughts.html",
            "description": "description.html",
            "credits": "credits.html",
            "js": [
                "checkersbase-model.js",
                "draughts-model.js"
            ],
            "gameOptions": {
                "preventRepeat": true,
                "width": 4,
                "height": 8,
                "initial": {
                    "a": [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            1
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            0,
                            3
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            1,
                            3
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            1
                        ],
                        [
                            2,
                            2
                        ],
                        [
                            2,
                            3
                        ]
                    ],
                    "b": [
                        [
                            7,
                            0
                        ],
                        [
                            7,
                            1
                        ],
                        [
                            7,
                            2
                        ],
                        [
                            7,
                            3
                        ],
                        [
                            6,
                            0
                        ],
                        [
                            6,
                            1
                        ],
                        [
                            6,
                            2
                        ],
                        [
                            6,
                            3
                        ],
                        [
                            5,
                            0
                        ],
                        [
                            5,
                            1
                        ],
                        [
                            5,
                            2
                        ],
                        [
                            5,
                            3
                        ]
                    ]
                },
                "variant": {
                    "mustMoveForwardStrict": true,
                    "lastRowCrown": true,
                    "captureLongestLine": false,
                    "lastRowFactor": 0.001,
                    "kingValue": 4,
                    "kingCaptureShort": false,
                    "captureInstantRemove": true
                },
                "uctTransposition": "state"
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "c": 0.8,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "maxDuration": 60,
                    "maxNodes": 15000,
                    "maxLoops": 8000
                }
            ]
        },
        "thai-draughts": {
            "plazza": "true",
            "title-en": "Thai Draughts",
            "module": "checkers",
            "maxLevel": 20,
            "summary": "Checkers according to Thai rules.",
            "thumbnail": "draughts8-thumb3d.png",
            "rules": "rules-thai-draughts.html",
            "description": "description.html",
            "credits": "credits.html",
            "js": [
                "checkersbase-model.js",
                "draughts-model.js"
            ],
            "gameOptions": {
                "preventRepeat": true,
                "width": 4,
                "height": 8,
                "initial": {
                    "a": [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            1
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            0,
                            3
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            1,
                            3
                        ]
                    ],
                    "b": [
                        [
                            7,
                            0
                        ],
                        [
                            7,
                            1
                        ],
                        [
                            7,
                            2
                        ],
                        [
                            7,
                            3
                        ],
                        [
                            6,
                            0
                        ],
                        [
                            6,
                            1
                        ],
                        [
                            6,
                            2
                        ],
                        [
                            6,
                            3
                        ]
                    ]
                },
                "variant": {
                    "mustMoveForwardStrict": true,
                    "lastRowCrown": true,
                    "captureLongestLine": false,
                    "lastRowFactor": 0.001,
                    "kingValue": 4,
                    "kingCaptureShort": true,
                    "captureInstantRemove": true,
                    "noMove": "lose",
                    "king180deg": true
                },
                "uctTransposition": "state"
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "c": 0.8,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "maxDuration": 60,
                    "maxNodes": 15000,
                    "maxLoops": 8000
                }
            ]
        },
        "kids-draughts": {
            "plazza": "true",
            "title-en": "Kids Draughts",
            "module": "checkers",
            "maxLevel": 20,
            "summary": "A version for kids of checkers on a 6x6 board.",
            "thumbnail": "kidsdraughts-thumb3d.png",
            "rules": "rules-kids-draughts.html",
            "description": "description.html",
            "credits": "credits.html",
            "js": [
                "checkersbase-model.js",
                "draughts-model.js"
            ],
            "gameOptions": {
                "preventRepeat": true,
                "width": 3,
                "height": 6,
                "initial": {
                    "a": [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            1
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            2
                        ]
                    ],
                    "b": [
                        [
                            5,
                            0
                        ],
                        [
                            5,
                            1
                        ],
                        [
                            5,
                            2
                        ],
                        [
                            4,
                            0
                        ],
                        [
                            4,
                            1
                        ],
                        [
                            4,
                            2
                        ]
                    ]
                },
                "variant": {
                    "mustMoveForwardStrict": true,
                    "lastRowCrown": true,
                    "captureLongestLine": true,
                    "lastRowFactor": 0.001
                },
                "uctTransposition": "state"
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "c": 0.8,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "maxDuration": 60,
                    "maxNodes": 15000,
                    "maxLoops": 8000
                }
            ]
        },
        "turkish-draughts": {
            "plazza": "true",
            "title-en": "Turkish Draughts",
            "module": "checkers",
            "maxLevel": 20,
            "summary": "A 8x8 checkers on straight lines.",
            "thumbnail": "turkish-thumb3d.png",
            "rules": "rules-turkish-draughts.html",
            "description": "description.html",
            "credits": "credits-turkish-draughts.html",
            "js": [
                "checkersbase-model.js",
                "turkish-model.js"
            ],
            "gameOptions": {
                "preventRepeat": true,
                "width": 8,
                "height": 8,
                "initial": {
                    "a": [
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            1,
                            3
                        ],
                        [
                            1,
                            4
                        ],
                        [
                            1,
                            5
                        ],
                        [
                            1,
                            6
                        ],
                        [
                            1,
                            7
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            1
                        ],
                        [
                            2,
                            2
                        ],
                        [
                            2,
                            3
                        ],
                        [
                            2,
                            4
                        ],
                        [
                            2,
                            5
                        ],
                        [
                            2,
                            6
                        ],
                        [
                            2,
                            7
                        ]
                    ],
                    "b": [
                        [
                            6,
                            0
                        ],
                        [
                            6,
                            1
                        ],
                        [
                            6,
                            2
                        ],
                        [
                            6,
                            3
                        ],
                        [
                            6,
                            4
                        ],
                        [
                            6,
                            5
                        ],
                        [
                            6,
                            6
                        ],
                        [
                            6,
                            7
                        ],
                        [
                            5,
                            0
                        ],
                        [
                            5,
                            1
                        ],
                        [
                            5,
                            2
                        ],
                        [
                            5,
                            3
                        ],
                        [
                            5,
                            4
                        ],
                        [
                            5,
                            5
                        ],
                        [
                            5,
                            6
                        ],
                        [
                            5,
                            7
                        ]
                    ]
                },
                "variant": {
                    "lastRowCrown": true,
                    "mustMoveForward": true,
                    "kingCaptureShort": false,
                    "captureInstantRemove": true,
                    "captureLongestLine": true,
                    "canCaptureBackward": false
                },
                "uctTransposition": "state"
            },
            "levels": [
                {
                    "label": "Fast",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "isDefault": true
                },
                {
                    "label": "Beginner",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 0.5,
                    "maxNodes": 100,
                    "maxLoops": 200
                },
                {
                    "label": "Easy",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 1,
                    "maxNodes": 2500,
                    "maxLoops": 500
                },
                {
                    "label": "Medium",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 2,
                    "maxNodes": 5500,
                    "maxLoops": 500
                },
                {
                    "label": "Hard",
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.5,
                    "maxDuration": 5,
                    "maxNodes": 2000,
                    "maxLoops": 3500
                },
                {
                    "label": "Expert",
                    "ai": "uct",
                    "c": 0.8,
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 5,
                    "propagateMultiVisits": false,
                    "maxDuration": 60,
                    "maxNodes": 15000,
                    "maxLoops": 8000
                }
            ]
        }
    },
    "views": {
        "alquerque": {
            "js": [
                "checkersbase-view.js",
                "alquerque-view.js"
            ],
            "css": [
                "checkersbase.css",
                "alquerque.css"
            ],
            "title-en": "Alquerque View",
            "skins": [
                {
                    "name": "wood1",
                    "title": "Wood"
                },
                {
                    "name": "green",
                    "title": "Green"
                },
                {
                    "name": "stone",
                    "title": "Stone"
                },
                {
                    "name": "modern",
                    "title": "Modern"
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/alquerque-600x600-3d.jpg",
                    "res/visuals/alquerque-600x600-2d.jpg"
                ]
            },
            "module": "checkers",
            "preferredRatio": 1,
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            }
        },
        "alquerque-bell": {
            "js": [
                "checkers-xd-view.js",
                "alquerque-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "checkersbase.css",
                "alquerque.css"
            ],
            "title-en": "Alquerque Bell View",
            "skins": [
                {
                    "name": "alquerque3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 20,
                        "elevationAngle": 45,
                        "limitCamMoves": true
                    },
                    "world": {
                        "lightIntensity": 0.8,
                        "color": 0,
                        "fog": false,
                        "lightPosition": {
                            "x": -5,
                            "y": 18,
                            "z": 5
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 0
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/red.png",
                        "image|/res/xd-view/meshes/black.png",
                        "image|/res/images/alquarqueboard1.jpg",
                        "image|/res/xd-view/meshes/skybox/nx.jpg",
                        "image|/res/xd-view/meshes/skybox/ny.jpg",
                        "image|/res/xd-view/meshes/skybox/nz.jpg",
                        "image|/res/xd-view/meshes/skybox/px.jpg",
                        "image|/res/xd-view/meshes/skybox/py.jpg",
                        "image|/res/xd-view/meshes/skybox/pz.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/board-checkers-slot.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/board-alquerque-external-frame.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/board-checkers-triangle.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js"
                    ]
                },
                {
                    "name": "2d-wood-alquerque",
                    "title": "Wood"
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/alquerque-600x600-3d.jpg",
                    "res/visuals/alquerque-600x600-2d.jpg"
                ]
            },
            "module": "checkers",
            "preferredRatio": 1,
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": null,
                "usermove": null
            },
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            }
        },
        "alquerque-avds": {
            "js": [
                "checkers-xd-view.js",
                "checkers-xd-view-captbreak.js",
                "alquerque-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "checkersbase.css",
                "alquerque.css"
            ],
            "title-en": "Alquerque Bell View",
            "skins": [
                {
                    "name": "alquerque3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 20,
                        "elevationAngle": 45,
                        "limitCamMoves": true
                    },
                    "world": {
                        "lightIntensity": 0.8,
                        "color": 0,
                        "fog": false,
                        "lightPosition": {
                            "x": -5,
                            "y": 18,
                            "z": 5
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 0
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/red.png",
                        "image|/res/xd-view/meshes/black.png",
                        "image|/res/xd-view/meshes/red-king.png",
                        "image|/res/xd-view/meshes/black-king.png",
                        "image|/res/images/alquarqueboard1.jpg",
                        "image|/res/xd-view/meshes/skybox/nx.jpg",
                        "image|/res/xd-view/meshes/skybox/ny.jpg",
                        "image|/res/xd-view/meshes/skybox/nz.jpg",
                        "image|/res/xd-view/meshes/skybox/px.jpg",
                        "image|/res/xd-view/meshes/skybox/py.jpg",
                        "image|/res/xd-view/meshes/skybox/pz.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/board-checkers-slot.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/board-alquerque-external-frame.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/board-checkers-triangle.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js"
                    ]
                },
                {
                    "name": "2d-wood-alquerque",
                    "title": "Wood"
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/alquerque-avds3-600x600-3d.jpg",
                    "res/visuals/alquerque-avds3-600x600-2d.jpg"
                ]
            },
            "module": "checkers",
            "preferredRatio": 1,
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "sounds": {
                "move1": "alq_move1",
                "move2": "alq_move2",
                "move3": "alq_move3",
                "move4": "alq_move2",
                "tac1": "alq_tac1",
                "tac2": "alq_tac2",
                "tac3": "alq_tac1",
                "promo": null,
                "usermove": null
            },
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            }
        },
        "draughts": {
            "js": [
                "checkers-xd-view.js",
                "draughts10-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "checkersbase.css",
                "draughts.css"
            ],
            "title-en": "Draughts View",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 24,
                        "elevationAngle": 65,
                        "limitCamMoves": true,
                        "distMax": 30,
                        "fov": 35
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.5,
                        "lightPosition": {
                            "x": -15,
                            "y": 15,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.45,
                        "ambientLightColor": 8947848,
                        "color": 4686804,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/piecetop-bump.jpg",
                        "image|/res/xd-view/meshes/piecediff.jpg",
                        "image|/res/xd-view/meshes/piecetop-queen-mask.png",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/piece-v2.js"
                    ]
                },
                {
                    "name": "turtles3d",
                    "title": "3D Turtles",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40
                    },
                    "world": {
                        "lightIntensity": 0,
                        "skyLightIntensity": 3,
                        "fog": true,
                        "color": 3645658,
                        "lightPosition": {
                            "x": -5,
                            "y": 18,
                            "z": 5
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/turtle.png",
                        "image|/res/xd-view/meshes/star.png",
                        "image|/res/xd-view/meshes/rock.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-legs-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-head-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-tail-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-hotel.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-house.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rainbowflat.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rocksmoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-fences.js"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic"
                },
                {
                    "name": "wood0",
                    "title": "Wood"
                },
                {
                    "name": "marble0",
                    "title": "Marble"
                },
                {
                    "name": "green",
                    "title": "Green"
                }
            ],
            "module": "checkers",
            "preferredRatio": 1,
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "useAutoComplete": true,
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true,
                "autocomplete": true
            },
            "sounds": {
                "move1": "move1",
                "move2": "move2",
                "move3": "move3",
                "move4": "move4",
                "tac1": "tac1",
                "tac2": "tac1",
                "tac3": "tac1",
                "promo": "promo",
                "usermove": null
            },
            "visuals": {
                "600x600": [
                    "res/visuals/draughts-600x600-3d.jpg",
                    "res/visuals/draughts-600x600-2d.jpg"
                ]
            }
        },
        "brazilian-draughts": {
            "js": [
                "checkers-xd-view.js",
                "draughts8-xd-view.js"
            ],
            "css": [
                "checkersbase.css",
                "draughts.css"
            ],
            "title-en": "Draughts View",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 24,
                        "elevationAngle": 65,
                        "limitCamMoves": true,
                        "distMax": 30,
                        "fov": 35
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.5,
                        "lightPosition": {
                            "x": -15,
                            "y": 15,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.45,
                        "ambientLightColor": 8947848,
                        "color": 4686804,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/piecetop-bump.jpg",
                        "image|/res/xd-view/meshes/piecediff.jpg",
                        "image|/res/xd-view/meshes/piecetop-queen-mask.png",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/piece-v2.js"
                    ]
                },
                {
                    "name": "turtles3d",
                    "title": "3D Turtles",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40
                    },
                    "world": {
                        "lightIntensity": 0,
                        "skyLightIntensity": 3,
                        "fog": true,
                        "color": 3645658,
                        "lightPosition": {
                            "x": -5,
                            "y": 18,
                            "z": 5
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/turtle.png",
                        "image|/res/xd-view/meshes/star.png",
                        "image|/res/xd-view/meshes/rock.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-legs-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-head-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-tail-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-hotel.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-house.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rainbowflat.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rocksmoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-fences.js"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic"
                },
                {
                    "name": "marble0",
                    "title": "Marble"
                },
                {
                    "name": "wood0",
                    "title": "Wood"
                },
                {
                    "name": "green",
                    "title": "Green"
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/brazilian-draughts-600x600-3d.jpg",
                    "res/visuals/brazilian-draughts-600x600-2d.jpg"
                ]
            },
            "sounds": {
                "move1": "move1",
                "move2": "move2",
                "move3": "move3",
                "move4": "move4",
                "tac1": "tac1",
                "tac2": "tac1",
                "tac3": "tac1",
                "promo": "promo",
                "usermove": null
            },
            "module": "checkers",
            "preferredRatio": 1,
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            },
            "xdView": true
        },
        "spanish-draughts": {
            "js": [
                "checkers-xd-view.js",
                "draughts8-xd-view.js"
            ],
            "css": [
                "checkersbase.css",
                "draughts.css"
            ],
            "title-en": "Draughts View",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 24,
                        "elevationAngle": 65,
                        "limitCamMoves": true,
                        "distMax": 30,
                        "fov": 35
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.5,
                        "lightPosition": {
                            "x": -15,
                            "y": 15,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.45,
                        "ambientLightColor": 8947848,
                        "color": 4686804,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/piecetop-bump.jpg",
                        "image|/res/xd-view/meshes/piecediff.jpg",
                        "image|/res/xd-view/meshes/piecetop-queen-mask.png",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/piece-v2.js"
                    ]
                },
                {
                    "name": "turtles3d",
                    "title": "3D Turtles",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40
                    },
                    "world": {
                        "lightIntensity": 0,
                        "skyLightIntensity": 3,
                        "fog": true,
                        "color": 3645658,
                        "lightPosition": {
                            "x": -5,
                            "y": 18,
                            "z": 5
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/turtle.png",
                        "image|/res/xd-view/meshes/star.png",
                        "image|/res/xd-view/meshes/rock.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-legs-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-head-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-tail-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-hotel.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-house.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rainbowflat.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rocksmoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-fences.js"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic"
                },
                {
                    "name": "marble0",
                    "title": "Marble"
                },
                {
                    "name": "wood0",
                    "title": "Wood"
                },
                {
                    "name": "green",
                    "title": "Green"
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/brazilian-draughts-600x600-3d.jpg",
                    "res/visuals/brazilian-draughts-600x600-2d.jpg"
                ]
            },
            "sounds": {
                "move1": "move1",
                "move2": "move2",
                "move3": "move3",
                "move4": "move4",
                "tac1": "tac1",
                "tac2": "tac1",
                "tac3": "tac1",
                "promo": "promo",
                "usermove": null
            },
            "module": "checkers",
            "preferredRatio": 1,
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            },
            "xdView": true
        },
        "english-draughts": {
            "js": [
                "checkers-xd-view.js",
                "draughts8-xd-view.js"
            ],
            "css": [
                "checkersbase.css",
                "draughts.css"
            ],
            "title-en": "Draughts View",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 24,
                        "elevationAngle": 65,
                        "limitCamMoves": true,
                        "distMax": 30,
                        "fov": 35
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.5,
                        "lightPosition": {
                            "x": -15,
                            "y": 15,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.45,
                        "ambientLightColor": 8947848,
                        "color": 4686804,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/piecetop-bump.jpg",
                        "image|/res/xd-view/meshes/piecediff.jpg",
                        "image|/res/xd-view/meshes/piecetop-queen-mask.png",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/piece-v2.js"
                    ]
                },
                {
                    "name": "turtles3d",
                    "title": "3D Turtles",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40
                    },
                    "world": {
                        "lightIntensity": 0,
                        "skyLightIntensity": 3,
                        "fog": true,
                        "color": 3645658,
                        "lightPosition": {
                            "x": -5,
                            "y": 18,
                            "z": 5
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/turtle.png",
                        "image|/res/xd-view/meshes/star.png",
                        "image|/res/xd-view/meshes/rock.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-legs-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-head-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-tail-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-hotel.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-house.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rainbowflat.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rocksmoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-fences.js"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic"
                },
                {
                    "name": "marble0",
                    "title": "Marble"
                },
                {
                    "name": "wood0",
                    "title": "Wood"
                },
                {
                    "name": "green",
                    "title": "Green"
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/english-draughts-600x600-3d.jpg",
                    "res/visuals/english-draughts-600x600-2d.jpg"
                ]
            },
            "sounds": {
                "move1": "move1",
                "move2": "move2",
                "move3": "move3",
                "move4": "move4",
                "tac1": "tac1",
                "tac2": "tac1",
                "tac3": "tac1",
                "promo": "promo",
                "usermove": null
            },
            "module": "checkers",
            "preferredRatio": 1,
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            },
            "xdView": true
        },
        "thai-draughts": {
            "js": [
                "checkers-xd-view.js",
                "draughts8-xd-view.js"
            ],
            "css": [
                "checkersbase.css",
                "draughts.css"
            ],
            "title-en": "Draughts View",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 24,
                        "elevationAngle": 65,
                        "limitCamMoves": true,
                        "distMax": 30,
                        "fov": 35
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.5,
                        "lightPosition": {
                            "x": -15,
                            "y": 15,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.45,
                        "ambientLightColor": 8947848,
                        "color": 4686804,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/piecetop-bump.jpg",
                        "image|/res/xd-view/meshes/piecediff.jpg",
                        "image|/res/xd-view/meshes/piecetop-queen-mask.png",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/piece-v2.js"
                    ]
                },
                {
                    "name": "turtles3d",
                    "title": "3D Turtles",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40
                    },
                    "world": {
                        "lightIntensity": 0,
                        "skyLightIntensity": 3,
                        "fog": true,
                        "color": 3645658,
                        "lightPosition": {
                            "x": -5,
                            "y": 18,
                            "z": 5
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/turtle.png",
                        "image|/res/xd-view/meshes/star.png",
                        "image|/res/xd-view/meshes/rock.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-legs-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-head-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-tail-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-hotel.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-house.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rainbowflat.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rocksmoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-fences.js"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic"
                },
                {
                    "name": "marble0",
                    "title": "Marble"
                },
                {
                    "name": "wood0",
                    "title": "Wood"
                },
                {
                    "name": "green",
                    "title": "Green"
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/thai-draughts-600x600-3d.jpg",
                    "res/visuals/thai-draughts-600x600-2d.jpg"
                ]
            },
            "sounds": {
                "move1": "move1",
                "move2": "move2",
                "move3": "move3",
                "move4": "move4",
                "tac1": "tac1",
                "tac2": "tac1",
                "tac3": "tac1",
                "promo": "promo",
                "usermove": null
            },
            "module": "checkers",
            "preferredRatio": 1,
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            },
            "xdView": true
        },
        "german-draughts": {
            "js": [
                "checkers-xd-view.js",
                "draughts8-xd-view.js"
            ],
            "css": [
                "checkersbase.css",
                "draughts.css"
            ],
            "title-en": "Draughts View",
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 24,
                        "elevationAngle": 65,
                        "limitCamMoves": true,
                        "distMax": 30,
                        "fov": 35
                    },
                    "world": {
                        "lightIntensity": 0.7,
                        "skyLightIntensity": 0.5,
                        "lightPosition": {
                            "x": -15,
                            "y": 15,
                            "z": 0
                        },
                        "lightShadowDarkness": 0.45,
                        "ambientLightColor": 8947848,
                        "color": 4686804,
                        "fog": false
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/piecetop-bump.jpg",
                        "image|/res/xd-view/meshes/piecediff.jpg",
                        "image|/res/xd-view/meshes/piecetop-queen-mask.png",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/piece-v2.js"
                    ]
                },
                {
                    "name": "turtles3d",
                    "title": "3D Turtles",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40
                    },
                    "world": {
                        "lightIntensity": 0,
                        "skyLightIntensity": 3,
                        "fog": true,
                        "color": 3645658,
                        "lightPosition": {
                            "x": -5,
                            "y": 18,
                            "z": 5
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/turtle.png",
                        "image|/res/xd-view/meshes/star.png",
                        "image|/res/xd-view/meshes/rock.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-legs-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-head-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-tail-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-hotel.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-house.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rainbowflat.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rocksmoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-fences.js"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic"
                },
                {
                    "name": "marble0",
                    "title": "Marble"
                },
                {
                    "name": "wood0",
                    "title": "Wood"
                },
                {
                    "name": "green",
                    "title": "Green"
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/german-draughts-600x600-3d.jpg",
                    "res/visuals/german-draughts-600x600-2d.jpg"
                ]
            },
            "sounds": {
                "move1": "move1",
                "move2": "move2",
                "move3": "move3",
                "move4": "move4",
                "tac1": "tac1",
                "tac2": "tac1",
                "tac3": "tac1",
                "promo": "promo",
                "usermove": null
            },
            "module": "checkers",
            "preferredRatio": 1,
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            },
            "xdView": true
        },
        "brazilian-draughts-hlwn": {
            "js": [
                "checkersbase-view.js",
                "draughts-view.js"
            ],
            "css": [
                "checkersbase.css",
                "draughts.css"
            ],
            "title-en": "Draughts View",
            "skins": [
                {
                    "name": "halloween",
                    "title": "Halloween"
                }
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/halloween-draughts-600x600-2d.jpg",
                    "res/visuals/halloween-draughts-b-600x600-2d.jpg"
                ]
            },
            "module": "checkers",
            "preferredRatio": 1,
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            },
            "preloadImages": {
                "pieces": "res/images/pieces.png"
            }
        },
        "kids-draughts": {
            "js": [
                "checkers-xd-view.js",
                "draughts6-xd-view.js"
            ],
            "css": [
                "checkersbase.css",
                "draughts.css",
                "kids-draughts.css"
            ],
            "title-en": "Kids Draughts View",
            "module": "checkers",
            "preferredRatio": 1,
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            },
            "visuals": {
                "600x600": [
                    "res/visuals/kids-draughts-600x600-3d.jpg",
                    "res/visuals/kids-draughts-600x600-2d.jpg"
                ]
            },
            "skins": [
                {
                    "name": "turtles3d",
                    "title": "3D Turtles",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40
                    },
                    "world": {
                        "lightIntensity": 0,
                        "skyLightIntensity": 3,
                        "fog": true,
                        "color": 3645658,
                        "lightPosition": {
                            "x": -5,
                            "y": 18,
                            "z": 5
                        },
                        "lightShadowDarkness": 0.55,
                        "ambientLightColor": 4473924
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "image|/res/xd-view/meshes/turtle.png",
                        "image|/res/xd-view/meshes/star.png",
                        "image|/res/xd-view/meshes/rock.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-legs-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-head-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-tail-smoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-hotel.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-house.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rainbowflat.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/rocksmoothed.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turtle-fences.js"
                    ]
                },
                {
                    "name": "kids",
                    "title": "Kids"
                }
            ],
            "xdView": true
        },
        "turkish-draughts": {
            "js": [
                "checkers-xd-view.js",
                "turkish-xd-view.js"
            ],
            "visuals": {
                "600x600": [
                    "res/visuals/turkish-draughts-600x600-3d.jpg",
                    "res/visuals/turkish-draughts-600x600-2d.jpg"
                ]
            },
            "xdView": true,
            "css": [
                "checkersbase.css",
                "turkish.css"
            ],
            "title-en": "Turkish Draughts View",
            "module": "checkers",
            "preferredRatio": 1,
            "skins": [
                {
                    "name": "turkish3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 14,
                        "elevationAngle": 45,
                        "limitCamMoves": true
                    },
                    "world": {
                        "lightIntensity": 0.8,
                        "color": 0,
                        "fog": false,
                        "lightPosition": {
                            "x": -10,
                            "y": 18,
                            "z": 0
                        },
                        "ambientLightColor": 0
                    },
                    "preload": [
                        "image|/res/images/wood-chipboard-5.jpg",
                        "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turkish.js",
                        "smoothedfilegeo|0|/res/xd-view/meshes/turkish-queen.js"
                    ]
                },
                {
                    "name": "green",
                    "title": "Green"
                },
                {
                    "name": "wood0",
                    "title": "Wood"
                },
                {
                    "name": "marble0",
                    "title": "Marble"
                },
                {
                    "name": "classical",
                    "title": "Classic"
                }
            ],
            "sounds": {
                "move1": "move1",
                "move2": "move2",
                "move3": "move3",
                "move4": "move4",
                "tac1": "tac1",
                "tac2": "tac1",
                "tac3": "tac1",
                "promo": "promo",
                "usermove": null
            },
            "switchable": true,
            "animateSelfMoves": false,
            "useNotation": true,
            "useShowMoves": true,
            "defaultOptions": {
                "sounds": true,
                "notation": false,
                "moves": true
            }
        }
    }
};

var games = {};

for(var name in mvs.models) 
	if(mvs.models.hasOwnProperty(name)) {
		games[name] = {
			name: name,
			modelScripts: mvs.models[name].js,
			config: {
				status: true,
				model: mvs.models[name]
			}
		}
}

for(var name in mvs.views) 
	if(mvs.views.hasOwnProperty(name)) {
		if(games[name]) {
			games[name].viewScripts = mvs.views[name].js;
			games[name].config.view = mvs.views[name];
		}
	}

exports.games = Object.keys(games).map((name)=>{
    return games[name];
});
