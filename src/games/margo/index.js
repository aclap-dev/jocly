
var mvs = {
    "models": {
        "shibumi-spline": {
            "title-en": "Spline",
            "module": "margo",
            "js": [
                "spbase-model.js",
                "spline-model.js"
            ],
            "summary": "Shibumi game",
            "thumbnail": "tn-shibumi-spline.png",
            "strings": [],
            "rules": {
                "en": "rules-spline.html",
                "fr": "rules-spline.html"
            },
            "description": {
                "en": "description-spline.html",
                "fr": "description-spline.html"
            },
            "credits": {
                "en": "credits-spline.html",
                "fr": "credits-spline.html"
            },
            "demoRandom": true,
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "uctIgnoreLoop": true,
                "size": 4
            },
            "plazza": "true",
            "levels": [
                {
                    "label": "Beginner",
                    "potential": 1000,
                    "isDefault": true,
                    "maxDepth": 1
                },
                {
                    "label": "Easy",
                    "potential": 2000,
                    "maxDepth": 5
                },
                {
                    "label": "Medium",
                    "potential": 6000,
                    "maxDepth": 6
                },
                {
                    "label": "Confirmed",
                    "potential": 10000,
                    "maxDepth": 8
                }
            ]
        },
        "shibumi-splineplus": {
            "title-en": "Spline+",
            "module": "margo",
            "js": [
                "spbase-model.js",
                "spline-model.js",
                "splineplus-model.js"
            ],
            "summary": "Shibumi game",
            "thumbnail": "tn-shibumi-spline-plus.png",
            "strings": [],
            "rules": {
                "en": "rules-splineplus.html",
                "fr": "rules-splineplus.html"
            },
            "description": {
                "en": "description-splineplus.html",
                "fr": "description-splineplus.html"
            },
            "credits": {
                "en": "credits-splineplus.html",
                "fr": "credits-splineplus.html"
            },
            "demoRandom": true,
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "uctIgnoreLoop": true,
                "size": 4
            },
            "plazza": "true",
            "levels": [
                {
                    "potential": 1000,
                    "isDefault": true,
                    "maxDepth": 1
                },
                {
                    "label": "Easy",
                    "potential": 2000,
                    "maxDepth": 5
                },
                {
                    "label": "Medium",
                    "potential": 6000,
                    "maxDepth": 6
                },
                {
                    "potential": 20000,
                    "maxDepth": 8
                }
            ]
        },
        "shibumi-spargo": {
            "title-en": "Spargo",
            "module": "margo",
            "js": [
                "spbase-model.js",
                "margo-model.js"
            ],
            "summary": "Margo on the Shibumi platform",
            "thumbnail": "tn-spargo.png",
            "strings": [],
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
            "demoRandom": true,
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "uctIgnoreLoop": true,
                "size": 4,
                "levelOptions": {
                    "evalSafety": 19.107304715313,
                    "evalSafety2eyes": 4.3758955150703,
                    "evalSafetyXEyesBonus": 1.7865484737243,
                    "evalSafety1f": 9.1591122993614,
                    "evalSafety3f": 35.452884571656,
                    "evalSafety3fMore": 42.512798629808,
                    "evalSafety3fMoreBonus": 0.74012620371718,
                    "evalSafety1eyeBonus": 5.894529516766,
                    "evalSafetyPinnedBonus": 0,
                    "evalHeightRatio": 0,
                    "evalCenterRatio": 0.09143959872229
                }
            },
            "plazza": "true",
            "levels": [
                {
                    "label": "Fast (1sec)",
                    "maxDuration": 1,
                    "isDefault": true,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.0450571101395
                },
                {
                    "label": "Beginner",
                    "maxDuration": 1,
                    "maxNodes": 250,
                    "maxLoops": 50,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.0450571101395
                },
                {
                    "label": "Easy",
                    "maxDuration": 2,
                    "maxNodes": 500,
                    "maxLoops": 100,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.0450571101395
                },
                {
                    "label": "Medium",
                    "maxDuration": 4,
                    "maxNodes": 2500,
                    "maxLoops": 200,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.0450571101395
                },
                {
                    "label": "Confirmed",
                    "maxDuration": 8,
                    "maxNodes": 5000,
                    "maxLoops": 500,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.0450571101395
                },
                {
                    "label": "Slow (10sec)",
                    "maxDuration": 10,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.0450571101395
                }
            ]
        },
        "margo5": {
            "title-en": "Margo 5",
            "module": "margo",
            "js": [
                "spbase-model.js",
                "margo-model.js"
            ],
            "summary": "Margo game",
            "thumbnail": "tn-margo5.png",
            "strings": [],
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
            "demoRandom": true,
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "uctIgnoreLoop": true,
                "size": 5,
                "levelOptions": {
                    "evalSafety": 11.750749731517,
                    "evalSafety2eyes": 22.177834740058,
                    "evalSafetyXEyesBonus": 1.7649150399344,
                    "evalSafety1f": 9.3661218573064,
                    "evalSafety3f": 27.890795686826,
                    "evalSafety3fMore": 33.941637893389,
                    "evalSafety3fMoreBonus": 0.9758058890196,
                    "evalSafety1eyeBonus": 7.4647745586541,
                    "evalSafetyPinnedBonus": 0.5745794638283,
                    "evalHeightRatio": 1.8008592868854,
                    "evalCenterRatio": 0.12634283054723
                }
            },
            "plazza": "true",
            "levels": [
                {
                    "label": "Fast (1sec)",
                    "maxDuration": 1,
                    "isDefault": true,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Beginner",
                    "maxDuration": 1,
                    "maxNodes": 250,
                    "maxLoops": 50,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Easy",
                    "maxDuration": 2,
                    "maxNodes": 500,
                    "maxLoops": 100,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Medium",
                    "maxDuration": 4,
                    "maxNodes": 2500,
                    "maxLoops": 200,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Confirmed",
                    "maxDuration": 8,
                    "maxNodes": 5000,
                    "maxLoops": 500,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Slow (10sec)",
                    "maxDuration": 10,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                }
            ]
        },
        "margo6": {
            "title-en": "Margo 6",
            "module": "margo",
            "js": [
                "spbase-model.js",
                "margo-model.js"
            ],
            "summary": "Margo game",
            "thumbnail": "tn-margo6.png",
            "strings": [],
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
            "demoRandom": true,
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "uctIgnoreLoop": true,
                "size": 6,
                "levelOptions": {
                    "evalSafety": 18.087998411946,
                    "evalSafety2eyes": 33.190368679179,
                    "evalSafetyXEyesBonus": 1.7649150399344,
                    "evalSafety1f": 9.163683726905,
                    "evalSafety3f": 27.587078130791,
                    "evalSafety3fMore": 28.254787541129,
                    "evalSafety3fMoreBonus": 0.93791029877741,
                    "evalSafety1eyeBonus": 9.1829299172843,
                    "evalSafetyPinnedBonus": 0.3350934287035,
                    "evalHeightRatio": 1.3477082543829,
                    "evalCenterRatio": 0.091233102472746
                }
            },
            "plazza": "true",
            "levels": [
                {
                    "label": "Fast (1sec)",
                    "maxDuration": 1,
                    "isDefault": true,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Beginner",
                    "maxDuration": 1,
                    "maxNodes": 250,
                    "maxLoops": 50,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Easy",
                    "maxDuration": 2,
                    "maxNodes": 500,
                    "maxLoops": 100,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Medium",
                    "maxDuration": 4,
                    "maxNodes": 2500,
                    "maxLoops": 200,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Confirmed",
                    "maxDuration": 8,
                    "maxNodes": 5000,
                    "maxLoops": 500,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Slow (10sec)",
                    "maxDuration": 10,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                }
            ]
        },
        "margo7": {
            "title-en": "Margo 7",
            "module": "margo",
            "js": [
                "spbase-model.js",
                "margo-model.js"
            ],
            "summary": "Margo game",
            "thumbnail": "tn-margo7.png",
            "strings": [],
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
            "demoRandom": true,
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "uctIgnoreLoop": true,
                "size": 7,
                "levelOptions": {
                    "evalSafety": 20,
                    "evalSafety2eyes": 19.585075193114,
                    "evalSafetyXEyesBonus": 1.341487216319,
                    "evalSafety1f": 9.6161542055582,
                    "evalSafety3f": 39.04195901009,
                    "evalSafety3fMore": 34.25098499078,
                    "evalSafety3fMoreBonus": 0.74764503238808,
                    "evalSafety1eyeBonus": 6.6109850341,
                    "evalSafetyPinnedBonus": 0,
                    "evalHeightRatio": 1.8392730390391,
                    "evalCenterRatio": 0.077991601047649
                }
            },
            "plazza": "true",
            "levels": [
                {
                    "label": "Fast (1sec)",
                    "maxDuration": 1,
                    "isDefault": true,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.1607776901587
                },
                {
                    "label": "Beginner",
                    "maxDuration": 1,
                    "maxNodes": 250,
                    "maxLoops": 50,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.1607776901587
                },
                {
                    "label": "Easy",
                    "maxDuration": 2,
                    "maxNodes": 500,
                    "maxLoops": 100,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.1607776901587
                },
                {
                    "label": "Medium",
                    "maxDuration": 4,
                    "maxNodes": 2500,
                    "maxLoops": 200,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.1607776901587
                },
                {
                    "label": "Confirmed",
                    "maxDuration": 8,
                    "maxNodes": 5000,
                    "maxLoops": 500,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.1607776901587
                },
                {
                    "label": "Slow (10sec)",
                    "maxDuration": 10,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 1.1607776901587
                }
            ]
        },
        "margo8": {
            "title-en": "Margo 8",
            "module": "margo",
            "js": [
                "spbase-model.js",
                "margo-model.js"
            ],
            "summary": "Margo game",
            "thumbnail": "tn-margo8.png",
            "strings": [],
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
            "demoRandom": true,
            "gameOptions": {
                "preventRepeat": true,
                "uctTransposition": "states",
                "uctIgnoreLoop": true,
                "size": 8,
                "levelOptions": {
                    "evalSafety": 20,
                    "evalSafety2eyes": 20.316545249669,
                    "evalSafetyXEyesBonus": 1.7649150399344,
                    "evalSafety1f": 10,
                    "evalSafety3f": 31.878459454792,
                    "evalSafety3fMore": 46.937096046536,
                    "evalSafety3fMoreBonus": 1.1493006038375,
                    "evalSafety1eyeBonus": 6.0032010946565,
                    "evalSafetyPinnedBonus": 0,
                    "evalHeightRatio": 1.146771970669,
                    "evalCenterRatio": 0.07973781159539
                }
            },
            "plazza": "true",
            "levels": [
                {
                    "label": "Fast (1sec)",
                    "maxDuration": 1,
                    "isDefault": true,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.16486250067757,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Beginner",
                    "maxDuration": 1,
                    "maxNodes": 250,
                    "maxLoops": 50,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.16486250067757,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Easy",
                    "maxDuration": 2,
                    "maxNodes": 500,
                    "maxLoops": 100,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.16486250067757,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Medium",
                    "maxDuration": 4,
                    "maxNodes": 2500,
                    "maxLoops": 200,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.16486250067757,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Confirmed",
                    "maxDuration": 8,
                    "maxNodes": 5000,
                    "maxLoops": 500,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.16486250067757,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                },
                {
                    "label": "Slow (10sec)",
                    "maxDuration": 10,
                    "ai": "uct",
                    "playoutDepth": 0,
                    "minVisitsExpand": 1,
                    "c": 0.16486250067757,
                    "ignoreLeaf": false,
                    "uncertaintyFactor": 0
                }
            ]
        }
    },
    "views": {
        "shibumi-spline": {
            "title-en": "Margo View",
            "module": "margo",
            "js": [
                "spbase-xd-view.js",
                "spline-view.js"
            ],
            "xdView": true,
            "css": [
                "spbase.css"
            ],
            "preferredRatio": 1,
            "useNotation": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 20,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40,
                        "distMin": 10,
                        "elevationMin": -45,
                        "elevationMax": 89.9,
                        "enableDrag": false
                    },
                    "world": {
                        "lightIntensity": 0,
                        "color": 0,
                        "fog": false,
                        "skyLightIntensity": 0.7,
                        "skyLightPosition": {
                            "x": 0,
                            "y": 10,
                            "z": 0
                        },
                        "ambientLightColor": 8947848
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/grey.png",
                        "image|/res/xd-view/meshes/black.png",
                        "image|/res/xd-view/meshes/white.png",
                        "image|/res/xd-view/meshes/green.png",
                        "image|/res/xd-view/meshes/skybox/nx.jpg",
                        "image|/res/xd-view/meshes/skybox/ny.jpg",
                        "image|/res/xd-view/meshes/skybox/nz.jpg",
                        "image|/res/xd-view/meshes/skybox/px.jpg",
                        "image|/res/xd-view/meshes/skybox/py.jpg",
                        "image|/res/xd-view/meshes/skybox/pz.jpg"
                    ]
                },
                {
                    "name": "wood",
                    "title": "Wood",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png",
                        "image|/res/images/wood.png"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/spline-600x600-3d.jpg",
                    "res/visuals/spline-600x600-2d.jpg"
                ]
            }
        },
        "shibumi-splineplus": {
            "title-en": "Margo View",
            "module": "margo",
            "js": [
                "spbase-xd-view.js",
                "spline-view.js"
            ],
            "xdView": true,
            "css": [
                "spbase.css"
            ],
            "preferredRatio": 1,
            "useNotation": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 20,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40,
                        "distMin": 10,
                        "elevationMin": -45,
                        "elevationMax": 89.9,
                        "enableDrag": false
                    },
                    "world": {
                        "lightIntensity": 0,
                        "color": 0,
                        "fog": false,
                        "skyLightIntensity": 0.7,
                        "skyLightPosition": {
                            "x": 0,
                            "y": 10,
                            "z": 0
                        },
                        "ambientLightColor": 8947848
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/grey.png",
                        "image|/res/xd-view/meshes/black.png",
                        "image|/res/xd-view/meshes/white.png",
                        "image|/res/xd-view/meshes/green.png",
                        "image|/res/xd-view/meshes/skybox/nx.jpg",
                        "image|/res/xd-view/meshes/skybox/ny.jpg",
                        "image|/res/xd-view/meshes/skybox/nz.jpg",
                        "image|/res/xd-view/meshes/skybox/px.jpg",
                        "image|/res/xd-view/meshes/skybox/py.jpg",
                        "image|/res/xd-view/meshes/skybox/pz.jpg"
                    ]
                },
                {
                    "name": "wood",
                    "title": "Wood",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png",
                        "image|/res/images/wood.png"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/splineplus-600x600-3d.jpg",
                    "res/visuals/splineplus-600x600-2d.jpg"
                ]
            }
        },
        "shibumi-spargo": {
            "title-en": "Margo View",
            "module": "margo",
            "js": [
                "spbase-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "spbase.css"
            ],
            "preferredRatio": 1,
            "useNotation": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 20,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40,
                        "distMin": 10,
                        "elevationMin": -45,
                        "elevationMax": 89.9,
                        "enableDrag": false
                    },
                    "world": {
                        "lightIntensity": 0,
                        "color": 0,
                        "fog": false,
                        "skyLightIntensity": 0.7,
                        "skyLightPosition": {
                            "x": 0,
                            "y": 10,
                            "z": 0
                        },
                        "ambientLightColor": 8947848
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/grey.png",
                        "image|/res/xd-view/meshes/black.png",
                        "image|/res/xd-view/meshes/white.png",
                        "image|/res/xd-view/meshes/green.png",
                        "image|/res/xd-view/meshes/skybox/nx.jpg",
                        "image|/res/xd-view/meshes/skybox/ny.jpg",
                        "image|/res/xd-view/meshes/skybox/nz.jpg",
                        "image|/res/xd-view/meshes/skybox/px.jpg",
                        "image|/res/xd-view/meshes/skybox/py.jpg",
                        "image|/res/xd-view/meshes/skybox/pz.jpg"
                    ]
                },
                {
                    "name": "wood",
                    "title": "Wood",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png",
                        "image|/res/images/wood.png"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/spargo-600x600-3d.jpg",
                    "res/visuals/spargo-600x600-2d.jpg"
                ]
            }
        },
        "margo5": {
            "title-en": "Margo View",
            "module": "margo",
            "js": [
                "spbase-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "spbase.css"
            ],
            "preferredRatio": 1,
            "useNotation": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 20,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40,
                        "distMin": 10,
                        "elevationMin": -45,
                        "elevationMax": 89.9,
                        "enableDrag": false
                    },
                    "world": {
                        "lightIntensity": 0,
                        "color": 0,
                        "fog": false,
                        "skyLightIntensity": 0.7,
                        "skyLightPosition": {
                            "x": 0,
                            "y": 10,
                            "z": 0
                        },
                        "ambientLightColor": 8947848
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/grey.png",
                        "image|/res/xd-view/meshes/black.png",
                        "image|/res/xd-view/meshes/white.png",
                        "image|/res/xd-view/meshes/green.png",
                        "image|/res/xd-view/meshes/skybox/nx.jpg",
                        "image|/res/xd-view/meshes/skybox/ny.jpg",
                        "image|/res/xd-view/meshes/skybox/nz.jpg",
                        "image|/res/xd-view/meshes/skybox/px.jpg",
                        "image|/res/xd-view/meshes/skybox/py.jpg",
                        "image|/res/xd-view/meshes/skybox/pz.jpg"
                    ]
                },
                {
                    "name": "wood",
                    "title": "Wood",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png",
                        "image|/res/images/wood.png"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/margo5-600x600-3d.jpg",
                    "res/visuals/margo5-600x600-2d.jpg"
                ]
            }
        },
        "margo6": {
            "title-en": "Margo View",
            "module": "margo",
            "js": [
                "spbase-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "spbase.css"
            ],
            "preferredRatio": 1,
            "useNotation": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 20,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40,
                        "distMin": 10,
                        "elevationMin": -45,
                        "elevationMax": 89.9,
                        "enableDrag": false
                    },
                    "world": {
                        "lightIntensity": 0,
                        "color": 0,
                        "fog": false,
                        "skyLightIntensity": 0.7,
                        "skyLightPosition": {
                            "x": 0,
                            "y": 10,
                            "z": 0
                        },
                        "ambientLightColor": 8947848
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/grey.png",
                        "image|/res/xd-view/meshes/black.png",
                        "image|/res/xd-view/meshes/white.png",
                        "image|/res/xd-view/meshes/green.png",
                        "image|/res/xd-view/meshes/skybox/nx.jpg",
                        "image|/res/xd-view/meshes/skybox/ny.jpg",
                        "image|/res/xd-view/meshes/skybox/nz.jpg",
                        "image|/res/xd-view/meshes/skybox/px.jpg",
                        "image|/res/xd-view/meshes/skybox/py.jpg",
                        "image|/res/xd-view/meshes/skybox/pz.jpg"
                    ]
                },
                {
                    "name": "wood",
                    "title": "Wood",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png",
                        "image|/res/images/wood.png"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/margo6-600x600-3d.jpg",
                    "res/visuals/margo6-600x600-2d.jpg"
                ]
            }
        },
        "margo7": {
            "title-en": "Margo View",
            "module": "margo",
            "js": [
                "spbase-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "spbase.css"
            ],
            "preferredRatio": 1,
            "useNotation": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 20,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40,
                        "distMin": 10,
                        "elevationMin": -45,
                        "elevationMax": 89.9,
                        "enableDrag": false
                    },
                    "world": {
                        "lightIntensity": 0,
                        "color": 0,
                        "fog": false,
                        "skyLightIntensity": 0.7,
                        "skyLightPosition": {
                            "x": 0,
                            "y": 10,
                            "z": 0
                        },
                        "ambientLightColor": 8947848
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/grey.png",
                        "image|/res/xd-view/meshes/black.png",
                        "image|/res/xd-view/meshes/white.png",
                        "image|/res/xd-view/meshes/green.png",
                        "image|/res/xd-view/meshes/skybox/nx.jpg",
                        "image|/res/xd-view/meshes/skybox/ny.jpg",
                        "image|/res/xd-view/meshes/skybox/nz.jpg",
                        "image|/res/xd-view/meshes/skybox/px.jpg",
                        "image|/res/xd-view/meshes/skybox/py.jpg",
                        "image|/res/xd-view/meshes/skybox/pz.jpg"
                    ]
                },
                {
                    "name": "wood",
                    "title": "Wood",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png",
                        "image|/res/images/wood.png"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/margo7-600x600-3d.jpg",
                    "res/visuals/margo7-600x600-2d.jpg"
                ]
            }
        },
        "margo8": {
            "title-en": "Margo View",
            "module": "margo",
            "js": [
                "spbase-xd-view.js"
            ],
            "xdView": true,
            "css": [
                "spbase.css"
            ],
            "preferredRatio": 1,
            "useNotation": true,
            "defaultOptions": {
                "sounds": true,
                "moves": true,
                "notation": false
            },
            "skins": [
                {
                    "name": "classic3d",
                    "title": "3D Classic",
                    "3d": true,
                    "camera": {
                        "radius": 20,
                        "elevationAngle": 45,
                        "limitCamMoves": true,
                        "distMax": 40,
                        "distMin": 10,
                        "elevationMin": -45,
                        "elevationMax": 89.9,
                        "enableDrag": false
                    },
                    "world": {
                        "lightIntensity": 0,
                        "color": 0,
                        "fog": false,
                        "skyLightIntensity": 0.7,
                        "skyLightPosition": {
                            "x": 0,
                            "y": 10,
                            "z": 0
                        },
                        "ambientLightColor": 8947848
                    },
                    "preload": [
                        "image|/res/xd-view/meshes/grey.png",
                        "image|/res/xd-view/meshes/black.png",
                        "image|/res/xd-view/meshes/white.png",
                        "image|/res/xd-view/meshes/green.png",
                        "image|/res/xd-view/meshes/skybox/nx.jpg",
                        "image|/res/xd-view/meshes/skybox/ny.jpg",
                        "image|/res/xd-view/meshes/skybox/nz.jpg",
                        "image|/res/xd-view/meshes/skybox/px.jpg",
                        "image|/res/xd-view/meshes/skybox/py.jpg",
                        "image|/res/xd-view/meshes/skybox/pz.jpg"
                    ]
                },
                {
                    "name": "wood",
                    "title": "Wood",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png",
                        "image|/res/images/wood.png"
                    ]
                },
                {
                    "name": "classical",
                    "title": "Classic",
                    "preload": [
                        "image|/res/images/ball_black.png",
                        "image|/res/images/ball_white.png",
                        "image|/res/images/ball_green.png",
                        "image|/res/images/plot.png"
                    ]
                }
            ],
            "animateSelfMoves": false,
            "visuals": {
                "600x600": [
                    "res/visuals/margo8-600x600-3d.jpg",
                    "res/visuals/margo8-600x600-2d.jpg"
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
