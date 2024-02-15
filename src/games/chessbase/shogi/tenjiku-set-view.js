(function() {
	var CANVAS_SIZE = 512;
	var FAIRY_CANVAS_PROPERTIES = {
			cx: CANVAS_SIZE,
			cy: CANVAS_SIZE
	}
	function THREE_CONST(v) {
		if(typeof THREE!=="undefined")
			return THREE[v];
		else
			return 0;
	}

	View.Game.cbChuPieceStyle = function(modifier) {
		return $.extend(true,{
			"1": {
				"default": {
					"2d": {
						clipy: 0,
					},
				},
			},
			"-1": {
				"default": {
					"2d": {
						clipy: 100,
					},
				},
			},
			"default": {
				"3d": {
					display: this.cbDisplayPieceFn(this.cbChuPieceStyle3D),
				},
				"2d": {
					file: this.mViewOptions.fullPath + "/res/shogi/tenjiku-shogi-picto-sprites.png",
					clipwidth: 100,
					clipheight: 100,
				},
			},
			"sh-pawn":		{"2d":{clipx:0}},
			"sh-shuttle":		{"2d":{clipx:2700}},
			"sh-copper":		{"2d":{clipx:5900}},
			"sh-silver":		{"2d":{clipx:5800}},
			"sh-gold":		{"2d":{clipx:5700}},
			"sh-leopard":		{"2d":{clipx:4600}},
			"sh-tiger":		{"2d":{clipx:2300}},
			"sh-elephant":		{"2d":{clipx:700}},
			"sh-phoenix":		{"2d":{clipx:5400}},
			"sh-kirin":		{"2d":{clipx:4000}},
			"sh-lance":		{"2d":{clipx:7100}},
			"sh-chariot":		{"2d":{clipx:2800}},
			"sh-sweeper":		{"2d":{clipx:3400}},
			"sh-climber":		{"2d":{clipx:7200}},
			"sh-bishop":		{"2d":{clipx:200}},
			"sh-rook":		{"2d":{clipx:300}},
			"sh-horse":		{"2d":{clipx:3200}},
			"sh-dragon":		{"2d":{clipx:1500}},
			"sh-falcon":		{"2d":{clipx:5100}},
			"sh-eagle":		{"2d":{clipx:1100}},
			"sh-queen":		{"2d":{clipx:400}},
			"sh-lion":		{"2d":{clipx:1200}},
			"sh-king":		{"2d":{clipx:500}},
			"sh-tokin":		{"2d":{clipx:3500}},
			"sh-promotion-elephant":{"2d":{clipx:4400}},
			"sh-promotion-sweeper":	{"2d":{clipx:1600}},
			"sh-promotion-climber":	{"2d":{clipx:2400}},
			"sh-promotion-rook":	{"2d":{clipx:3300}},
			"sh-promotion-bishop":	{"2d":{clipx:3600}},
			"sh-stag":		{"2d":{clipx:2500}},
			"sh-prince":		{"2d":{clipx:2100}},
			"sh-promotion-queen":	{"2d":{clipx:5000}},
			"sh-promotion-lion":	{"2d":{clipx:1300}},
			"sh-whitehorse":	{"2d":{clipx:3100}},
			"sh-whale":		{"2d":{clipx:2200}},
			"sh-freeboar":		{"2d":{clipx:3000}},
			"sh-flyingox":		{"2d":{clipx:2900}},
			"sh-promotion-horse":	{"2d":{clipx:4500}},
			"sh-promotion-dragon":	{"2d":{clipx:4300}},
			"sh-promotion-falcon":	{"2d":{clipx:5100}},
			"sh-promotion-eagle":	{"2d":{clipx:1100}},
			"sh-iron":		{"2d":{clipx:6000}},
			"sh-knight":		{"2d":{clipx:100}},
			"sh-buffalo":		{"2d":{clipx:2000}},
			"sh-wolf":		{"2d":{clipx:4100}},
			"sh-dog":		{"2d":{clipx:4100}},
			"sh-stone":		{"2d":{clipx:6900}},
			"sh-angryboar":		{"2d":{clipx:3700}},
			"sh-flyingdragon":	{"2d":{clipx:5200}},
			"sh-violentox":		{"2d":{clipx:5300}},
			"sh-catsword":		{"2d":{clipx:3800}},
			"sh-vertsoldier":	{"2d":{clipx:5500}},
			"sh-sidesoldier":	{"2d":{clipx:6700}},
			"sh-chariot":		{"2d":{clipx:600}},
			"sh-lionhawk":		{"2d":{clipx:4800}},
			"sh-freeeagle":		{"2d":{clipx:2600}},
			"sh-bishopgeneral":	{"2d":{clipx:6500}},
			"sh-rookgeneral":	{"2d":{clipx:6400}},
			"sh-vicegeneral":	{"2d":{clipx:6600}},
			"sh-greatgeneral":	{"2d":{clipx:6300}},
			"sh-demon":		{"2d":{clipx:900}},
			"sh-promotion-bishgen":	{"2d":{clipx:6200}},
			"sh-promotion-rookgen":	{"2d":{clipx:6100}},
			"sh-promotion-vicegen":	{"2d":{clipx:6600}},
			"sh-promotion-greatgen":{"2d":{clipx:6300}},
			"sh-promotion-demon":	{"2d":{clipx:900}},
			"sh-promotion-vertsol":	{"2d":{clipx:5600}},
			"sh-promotion-sidesol":	{"2d":{clipx:6800}},
			"sh-promotion-chariot":	{"2d":{clipx:800}},
			"sh-promotion-buffalo":	{"2d":{clipx:1900}},
			"sh-promotion-multigen":{"2d":{clipx:3900}},
			"sh-promotion-tetrarch":{"2d":{clipx:7000}},
			"sh-jade": {
				"2d": {
					clipx: 500,
				},
			},

		},modifier);
	}

	View.Game.cbChuPieceStyle3D = $.extend(true,{},View.Game.cbUniformPieceStyle3D,{

		"default": {
			mesh: {
				normalScale: 1,
				rotateZ: 180,
			},
			//'useUniforms' : true,
			materials:{
				mat0:{
					channels:{
						diffuse:{
							size: FAIRY_CANVAS_PROPERTIES,
						},
						normal: {
							size: FAIRY_CANVAS_PROPERTIES,
						},
					},
				},
			},
		},

		"1":{
			'default': {
				materials:{
					mat0:{
						params : {
							specular: 0x020202,
							shininess : 150 ,
						},
					},
				},
			}
		},
		"-1":{
			'default': {
				materials:{
					mat0:{
						params : {
							specular: 0x040404,
							shininess : 100 ,
						},
					},
				},
			},
		},

		"sh-copper": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/copper-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-queen": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/queen-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-leopard": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/leopard-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-tiger": {
			mesh: {
				jsFile:"/res/shogi/b-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/tiger-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-elephant": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/elephant-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-shuttle": {
			mesh: {
				jsFile:"/res/shogi/p-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/gobetween-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-chariot": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/chariot-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-sweeper": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/sidemover-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-climber": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/verticalmover-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-phoenix": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/phoenix-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-kirin": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/kirin-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-lion": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/lion-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-sweeper": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/sidemover-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-climber": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/verticalmover-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-bishop": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/bishop-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-rook": {
			mesh: {
				jsFile:"/res/shogi/b-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/rook-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-whitehorse": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/whitehorse-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-freeboar": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/boar-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-flyingox": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/flyingox-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-whale": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/whale-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-stag": {
			mesh: {
				jsFile:"/res/shogi/b-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/stag-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-queen": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/queen-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-lion": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/lion-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-prince": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/prince-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-falcon": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/falcon-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-eagle": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/eagle-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-elephant": {
			mesh: {
				jsFile:"/res/shogi/p-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/elephant-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-pawn": {
			mesh: {
				jsFile:"/res/shogi/p-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/pawn-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-tokin": {
			mesh: {
				jsFile:"/res/shogi/p-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/tokin-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-knight": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/knight-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-lance": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/lance-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-silver": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/silver-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-gold": {
			mesh: {
				jsFile:"/res/shogi/b-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/gold-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-bishop": {
			mesh: {
				jsFile:"/res/shogi/b-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/bishop-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-rook": {
			mesh: {
				jsFile:"/res/shogi/b-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/rook-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-horse": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/horse-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-dragon": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/chu-diffusemaps/dragon-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-horse": {
			mesh: {
				jsFile:"/res/shogi/b-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/horse-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-dragon": {
			mesh: {
				jsFile:"/res/shogi/b-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/dragon-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-king": {
			mesh: {
				jsFile:"/res/shogi/k-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/king-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-iron": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/dai-diffusemaps/iron-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-catsword": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/dai-diffusemaps/catsword-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-angryboar": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/dai-diffusemaps/angryboar-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-flyingdragon": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/dai-diffusemaps/flyingdragon-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-violentox": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/dai-diffusemaps/violentox-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-evilwolf": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/dai-diffusemaps/wolf-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-stone": {
			mesh: {
				jsFile:"/res/shogi/n-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/dai-diffusemaps/stone-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-buffalo": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/buffalo-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-dog": {
			mesh: {
				jsFile:"/res/shogi/p-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/dog-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-vertsoldier": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/verticalsoldier-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-sidesoldier": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/sidesoldier-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-chariot": {
			mesh: {
				jsFile:"/res/shogi/b-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/chariotsoldier-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-lionhawk": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/hawk-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-freeeagle": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/freeeagle-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-bishopgeneral": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/bishopgeneral-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-rookgeneral": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/rookgeneral-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-vicegeneral": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/vicegeenral-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-greatgeneral": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/greatgeneral-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-demon": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/demon-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-bishgen": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/bishopgeneral-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-rookgen": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/rookgeneral-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-vicegen": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/vicegeneral-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-greatgen": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/greatgeneral-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-demon": {
			mesh: {
				jsFile:"/res/shogi/j-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/demon-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-vertsol": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/verticalsoldier-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-sidesol": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/sidesoldier-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-chariot": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/chariotsoldier-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-buffalo": {
			mesh: {
				jsFile:"/res/shogi/g-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-multigen": {
			mesh: {
				jsFile:"/res/shogi/p-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/multigeneral-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-promotion-tertrarch": {
			mesh: {
				jsFile:"/res/shogi/b-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/tenjiku-diffusemaps/tetrarch-r.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"sh-jade": {
			mesh: {
				jsFile:"/res/shogi/k-tile.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/shogi/diffusemaps/jade-b.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/shogi/tile-normalmap.jpg",
							}
						}
					}
				}
			},
		},

	});

})();
