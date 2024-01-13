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

	View.Game.cbFairyPieceStyle = function(modifier) {
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
					display: this.cbDisplayPieceFn(this.cbFairyPieceStyle3D),
				},
				"2d": {
					file: this.mViewOptions.fullPath + "/res/fairy/wikipedia-fairy-sprites.png",
					clipwidth: 100,
					clipheight: 100,
				},
			},
			"fr-pawn": {
				"2d": {
					clipx: 0,
				},
			},
			"fr-hoplit": {
				"2d": {
					clipx: 0,
				},
			},
			"fr-ferz": {
				"2d": {
					clipx: 3800,
				},
			},
			"fr-wazir": {
				"2d": {
					clipx: 3700,
				},
			},
			"fr-knight": {
				"2d": {
					clipx: 100,
				},
			},
			"fr-bishop": {
				"2d": {
					clipx: 200,
				},
			},
			"fr-small-bishop": {
				"2d": {
					clipx: 3600,
				},
			},
			"fr-saint": {
				"2d": {
					clipx: 3200,
				},
			},
			"fr-rook": {
				"2d": {
					clipx: 300,
				},
			},
			"fr-small-rook": {
				"2d": {
					clipx: 3300,
				},
			},
			"fr-gate": {
				"2d": {
					clipx: 3400,
				},
			},
			"fr-queen": {
				"2d": {
					clipx: 400,
				},
			},
			"fr-proper-queen": {
				"2d": {
					clipx: 400,
				},
			},
			"fr-king": {
				"2d": {
					clipx: 500,
				},
			},
			"fr-emperor": {
				"2d": {
					clipx: 500,
				},
			},
			"fr-man": {
				"2d": {
					clipx: 3900,
				},
			},
			"fr-cannon": {
				"2d": {
					clipx: 600,
				},
			},
			"fr-cannon2": {
				"2d": {
					clipx: 5200,
				},
			},
			"fr-elephant": {
				"2d": {
					clipx: 700,
				},
			},
			"fr-proper-elephant": {
				"2d": {
					clipx: 700,
				},
			},
			"fr-dragon": {
				"2d": {
					clipx: 800,
				},
			},
			"fr-lighthouse": {
				"2d": {
					clipx: 900,
				},
			},
			"fr-admiral": {
				"2d": {
					clipx: 1000,
				},
			},
			"fr-eagle": {
				"2d": {
					clipx: 1100,
				},
			},
			"fr-birdie": {
				"2d": {
					clipx: 1100,
				},
			},
			"fr-birdie": {
				"2d": {
					clipx: 1100,
				},
			},
			"fr-stork": {
				"2d": {
					clipx: 5300,
				},
			},
			"fr-lion": {
				"2d": {
					clipx: 1200,
				},
			},
			"fr-camel": {
				"2d": {
					clipx: 1300,
				},
			},
			"fr-amazon": {
				"2d": {
					clipx: 1400,
				},
			},
			"fr-proper-crowned-rook": {
				"2d": {
					clipx: 1500,
				},
			},
			"fr-marshall": {
				"2d": {
					clipx: 1600,
				},
			},
			"fr-proper-marshall": {
				"2d": {
					clipx: 1600,
				},
			},
			"fr-cardinal": {
				"2d": {
					clipx: 1700,
				},
			},
			"fr-proper-cardinal": {
				"2d": {
					clipx: 1700,
				},
			},
			"fr-unicorn": {
				"2d": {
					clipx: 1800,
				},
			},
			"fr-rhino": {
				"2d": {
					clipx: 1900,
				},
			},
			"fr-bull": {
				"2d": {
					clipx: 2000,
				},
			},		
			"fr-prince": {
				"2d": {
					clipx: 2100,
				},
			},
			"fr-ship": {
				"2d": {
					clipx: 2200,
				},
			},
			"fr-buffalo": {
				"2d": {
					clipx: 2300,
				},
			},
			"fr-bow": {
				"2d": {
					clipx: 2400,
				},
			},
			"fr-antelope": {
				"2d": {
					clipx: 2500,
				},
			},
			"fr-star": {
				"2d": {
					clipx: 2600,
				},
			},
			"fr-corporal": {
				"2d": {
					clipx: 2700,
				},
			},
			
			"fr-machine": {
				"2d": {
					clipx: 2800,
				},
			},
			"fr-wazir-knight": {
				"2d": {
					clipx: 2900,
				},
			},
			"fr-ferz-knight": {
				"2d": {
					clipx: 3000,
				},
			},
			"fr-nightrider": {
				"2d": {
					clipx: 3100,
				},
			},
			"fr-zebra": {
				"2d": {
					clipx: 3500,
				},
			},
			"fr-giraffe": {
				"2d": {
					clipx: 4000,
				},
			},
			"fr-wolf": {
				"2d": {
					clipx: 4100,
				},
			},
			"fr-squirle": {
				"2d": {
					clipx: 4200,
				},
			},
			"fr-crowned-rook": {
				"2d": {
					clipx: 4300,
				},
			},
			"fr-crowned-knight": {
				"2d": {
					clipx: 4400,
				},
			},
			"fr-crowned-bishop": {
				"2d": {
					clipx: 4500,
				},
			},
			"fr-leopard": {
				"2d": {
					clipx: 4600,
				},
			},
			"fr-huscarl": {
				"2d": {
					clipx: 4700,
					},
			},
			"fr-griffin": {
				"2d": {
					clipx: 4800,
					},
			},
			"fr-mammoth": {
				"2d": {
					clipx: 4900,
					},
			},
			"fr-duchess": {
				"2d": {
					clipx: 5000,
					},
			},
			"fr-hawk": {
				"2d": {
					clipx: 5100,
					},
			},
			"fr-flying-queen": {
				"2d": {
					clipx: 6300,
					},
			},
			"fr-flying-rook": {
				"2d": {
					clipx: 6400,
					},
			},
			"fr-flying-bishop": {
				"2d": {
					clipx: 6500,
					},
			},
			"fr-phoenix": {
				"2d": {
					clipx: 5400,
					},
			},
			"fr-champion": {
				"2d": {
					clipx: 5500,
					},
			},
			"fr-wizard": {
				"2d": {
					clipx: 5600,
					},
			},
			"fr-gold": {
				"2d": {
					clipx: 5700,
					},
			},
			"fr-silver": {
				"2d": {
					clipx: 5800,
					},
			},
			"fr-copper": {
				"2d": {
					clipx: 5900,
					},
			},
			"fr-cobra": {
				"2d": {
					clipx: 6000,
					},
			},
			"fr-flamingo": {
				"2d": {
					clipx: 6100,
					},
			},
		},modifier);
	}

	View.Game.cbFairyPieceStyle3D = $.extend(true,{},View.Game.cbUniformPieceStyle3D,{

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
				paintTextureImageClip: function(spec,ctx,material,channel,channelData,imgKey,image,clip,resources) {
					var cx=ctx.canvas.width;
					var cy=ctx.canvas.height;
					if(channel=="diffuse") {
						ctx.globalCompositeOperation = 'normal';
						ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
						ctx.globalCompositeOperation = 'multiply';
						ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
						ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
						ctx.globalCompositeOperation = 'hue';
						ctx.fillStyle='rgba(0,0,0,0.7)';
						ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
					} else
						ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
				},
			},
		},


		"fr-pawn": {
			mesh: {
				jsFile:"/res/fairy/pawn/pawn.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/pawn/pawn-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/pawn/pawn-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-hoplit": {
			mesh: {
				jsFile:"/res/fairy/pawn/hoplit.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/pawn/hoplit-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/pawn/pawn-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-ferz": {
			mesh: {
				jsFile:"/res/fairy/pawn/ferz.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/pawn/pawn-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/pawn/pawn-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-wazir": {
			mesh: {
				jsFile:"/res/fairy/pawn/wazir.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/pawn/pawn-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/pawn/pawn-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-ferz": {
			mesh: {
				jsFile:"/res/fairy/pawn/ferz.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/pawn/pawn-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/pawn/pawn-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-wazir": {
			mesh: {
				jsFile:"/res/fairy/pawn/wazir.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/pawn/pawn-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/pawn/pawn-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-knight": {
			mesh: {
				jsFile:"/res/fairy/knight/knight.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/knight/knight-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/knight/knight-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-nightrider": {
			mesh: {
				jsFile:"/res/fairy/knight/nightrider.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/knight/pedestal-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/knight/knight-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-wazir-knight": {
			mesh: {
				jsFile:"/res/fairy/knight/wazirknight.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/knight/pedestal-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/knight/knight-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-ferz-knight": {
			mesh: {
				jsFile:"/res/fairy/knight/ferzknight.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/knight/knight-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/knight/knight-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-zebra": {
			mesh: {
				jsFile:"/res/fairy/knight/knight.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/knight/zebra-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/knight/knight-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-bishop": {
			mesh: {
				jsFile:"/res/fairy/bishop/bishop.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/bishop/bishop-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/bishop/bishop-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-small-bishop": {
			mesh: {
				jsFile:"/res/fairy/bishop/small-bishop.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/bishop/bishop-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/bishop/bishop-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-saint": {
			mesh: {
				jsFile:"/res/fairy/saint/saint.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/saint/saint-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/saint/saint-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-rook": {
			mesh: {
				jsFile:"/res/fairy/rook/rook.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/rook/rook-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/rook/rook-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-small-rook": {
			mesh: {
				jsFile:"/res/fairy/rook/small-rook.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/rook/rook-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/rook/rook-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-gate": {
			mesh: {
				jsFile:"/res/fairy/rook/gate.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/rook/rook-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/rook/rook-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-queen": {
			mesh: {
				jsFile:"/res/fairy/queen/queen.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/queen/queen-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/queen/queen-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-proper-queen": {
			mesh: {
				jsFile:"/res/fairy/queen/proper-queen.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/queen/queen-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/queen/queen-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-flying-queen": {
			mesh: {
				jsFile:"/res/fairy/queen/flying-queen.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/queen/queen-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/queen/queen-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-flying-rook": {
			mesh: {
				jsFile:"/res/fairy/rook/flying-rook.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/rook/rook-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/rook/rook-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-flying-bishop": {
			mesh: {
				jsFile:"/res/fairy/bishop/flying-bishop.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/bishop/bishop-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/bishop/bishop-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-king": {
			mesh: {
				jsFile:"/res/fairy/king/king.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/king/king-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/king/king-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-emperor": {
			mesh: {
				jsFile:"/res/fairy/king/emperor.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/king/king-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/king/king-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-man": {
			mesh: {
				jsFile:"/res/fairy/king/man.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/king/king-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/king/king-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-cannon": {
			mesh: {
				jsFile:"/res/fairy/cannon/cannon.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/cannon/cannon-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/cannon/cannon-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-cannon2": {
			mesh: {
				jsFile:"/res/fairy/cannon2/cannon2.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/cannon2/cannon2-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/cannon2/cannon2-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-dragon": {
			mesh: {
				jsFile:"/res/fairy/dragon/dragon.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/dragon/dragon-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/dragon/dragon-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-lighthouse": {
			mesh: {
				jsFile:"/res/fairy/lighthouse/lighthouse.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/lighthouse/lighthouse-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/lighthouse/lighthouse-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-elephant": {
			mesh: {
				jsFile:"/res/fairy/elephant/elephant.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/elephant/elephant-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/elephant/elephant-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-proper-elephant": {
			mesh: {
				jsFile:"/res/fairy/elephant/proper-elephant.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/elephant/elephant-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/elephant/elephant-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-admiral": {
			mesh: {
				jsFile:"/res/fairy/admiral/admiral.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/admiral/admiral-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/admiral/admiral-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-eagle": {
			mesh: {
				jsFile:"/res/fairy/eagle/eagle.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/eagle/eagle-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/eagle/eagle-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-birdie": {
			mesh: {
				jsFile:"/res/fairy/eagle/birdie.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/eagle/eagle-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/eagle/eagle-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-stork": {
			mesh: {
				jsFile:"/res/fairy/birds/stork.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/birds/stork-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/birds/stork-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-lion": {
			mesh: {
				jsFile:"/res/fairy/lion/lion.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/lion/lion-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/lion/lion-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-camel": {
			mesh: {
				jsFile:"/res/fairy/camel/camel.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/camel/camel-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/camel/camel-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-marshall": {
			mesh: {
				jsFile:"/res/fairy/marshall/marshall.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/marshall/marshall-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/marshall/marshall-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-proper-marshall": {
			mesh: {
				jsFile:"/res/fairy/marshall/proper-marshall.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/marshall/marshall-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/marshall/marshall-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-crowned-rook": {
			mesh: {
				jsFile:"/res/fairy/crowned-rook/crowned-rook.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/crowned-rook/crowned-rook-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/crowned-rook/crowned-rook-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-proper-crowned-rook": {
			mesh: {
				jsFile:"/res/fairy/crowned-rook/proper-crowned-rook.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/crowned-rook/crowned-rook-diffuse-map.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/crowned-rook/crowned-rook-normal-map.jpg",
							}
						}
					}
				}
			},
		},

		"fr-amazon": {
			mesh: {
				jsFile:"/res/fairy/amazon/amazon.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/amazon/amazon-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/amazon/amazon-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-cardinal": {
			mesh: {
				jsFile:"/res/fairy/cardinal/cardinal.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/cardinal/cardinal-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/cardinal/cardinal-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-proper-cardinal": {
			mesh: {
				jsFile:"/res/fairy/cardinal/proper-cardinal.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/cardinal/cardinal-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/cardinal/cardinal-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-unicorn": {
			mesh: {
				jsFile:"/res/fairy/unicorn/unicorn.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/unicorn/unicorn-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/unicorn/unicorn-normalmap.jpg",
							}
						}
					}
				}
			},
		},

		"fr-star": {
			mesh: {
				jsFile:"/res/fairy/star/star.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/star/star-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/star/star-normalmap.jpg",
							}
						}
					}
				}
			}
		},

		"fr-bow": {
			mesh: {
				jsFile:"/res/fairy/bow/bow.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/bow/bow-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/bow/bow-normalmap.jpg",
							}
						}
					}
				}
			}
		},

		"fr-prince": {
			mesh: {
				jsFile:"/res/fairy/prince/prince.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/prince/prince-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/prince/prince-normalmap.jpg",
							}
						}
					}
				}
			}
		},

		"fr-rhino": {
			mesh: {
				jsFile:"/res/fairy/rhino/rhino.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/rhino/rhino-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/rhino/rhino-normalmap.jpg",
							}
						}
					}
				}
			}
		},

		"fr-bull": {
			mesh: {
				jsFile:"/res/fairy/bull/bull.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/bull/bull-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/bull/bull-normalmap.jpg",
							}
						}
					}
				}
			}
		},

		"fr-corporal": {
			mesh: {
				jsFile:"/res/fairy/corporal/corporal.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/corporal/corporal-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/corporal/corporal-normalmap.jpg",
							}
						}
					}
				}
			}
		},

		"fr-antelope": {
			mesh: {
				jsFile:"/res/fairy/antelope/antelope.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/antelope/antelope-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/antelope/antelope-normalmap.jpg",
							}
						}
					}
				}
			}
		},

		"fr-machine": {
			mesh: {
				jsFile:"/res/fairy/machine/machine.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/machine/machine-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/machine/machine-normalmap.jpg",
							}
						}
					}
				}
			}
		},

		"fr-buffalo": {
			mesh: {
				jsFile:"/res/fairy/buffalo/buffalo.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/buffalo/buffalo-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/buffalo/buffalo-normalmap.jpg",
							}
						}
					}
				}
			}
		},

		"fr-ship": {
			mesh: {
				jsFile:"/res/fairy/ship/ship.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/ship/ship-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/ship/ship-normalmap.jpg",
							}
						}
					}
				}
			}
		},
		"fr-giraffe": {
			mesh: {
				jsFile:"/res/fairy/giraffe/giraffe.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/giraffe/giraffe-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/giraffe/giraffe-normalmap.jpg",

							}
						}
					}
				}
			}
		},
		"fr-wolf": {
			mesh: {
				jsFile:"/res/fairy/wolf/wolf.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/wolf/wolf-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/wolf/wolf-normalmap.jpg",
							}
						}
					}
				}
			}
		},
		"fr-squirle": {
			mesh: {
				jsFile:"/res/fairy/squirle/squirle.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/squirle/squirle-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/squirle/squirle-normalmap.jpg",
							}
						}
					}
				}
			}
		},
		"fr-crowned-bishop": {
			mesh: {
				jsFile:"/res/fairy/crowned-bishop/crowned-bishop.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/crowned-bishop/crowned-bishop-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/crowned-bishop/crowned-bishop-normalmap.jpg",
							}
						}
					}
				}
			}
		},
		"fr-crowned-knight": {
			mesh: {
				jsFile:"/res/fairy/crowned-knight/crowned-knight.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/crowned-knight/crowned-knight-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/crowned-knight/crowned-knight-normalmap.jpg",
							}
						}
					}
				}
			}
		},
		"fr-crowned-rook": {
			mesh: {
				jsFile:"/res/fairy/crowned-rook/crowned-rook.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/crowned-rook/crowned-rook-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/crowned-rook/crowned-rook-normalmap.jpg",
							}
						}
					}
				}
			}
		},
		"fr-leopard": {
			mesh: {
				jsFile:"/res/fairy/leopard/leopard.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/leopard/leopard-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/leopard/leopard-normalmap.jpg",
							}
						}
					}
				}
			}
		},
		"fr-huscarl": {
			mesh: {
				jsFile:"/res/fairy/huscarl/huscarl.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/huscarl/huscarl-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/huscarl/huscarl-normalmap.jpg",
							}
						}
					}
				}
			}
		},
		"fr-griffin": {
			mesh: {
				jsFile:"/res/fairy/griffin/griffin.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/griffin/griffin-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/griffin/griffin-normalmap.jpg",
							}
						}
					}
				}
			}
		},
		"fr-mammoth": {
			mesh: {
				jsFile:"/res/fairy/mammoth/mammoth.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/mammoth/mammoth-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/mammoth/mammoth-normalmap.jpg",
							}
						}
					}
				}
			}
		},
		"fr-duchess": {
			mesh: {
				jsFile:"/res/fairy/lighthouse/lighthouse.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/lighthouse/lighthouse-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/lighthouse/lighthouse-normalmap.jpg",
							}
						}
					}
				}
			},
		},
		"fr-copper": {
			mesh: {
				jsFile:"/res/fairy/generals/copper.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/generals/copper-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/generals/copper-normalmap.jpg",
							}
						}
					}
				}
			},
		},
		"fr-silver": {
			mesh: {
				jsFile:"/res/fairy/generals/silver.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/generals/silver-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/generals/silver-normalmap.jpg",
							}
						}
					}
				}
			},
		},
		"fr-gold": {
			mesh: {
				jsFile:"/res/fairy/generals/gold.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/generals/gold-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/generals/gold-normalmap.jpg",
							}
						}
					}
				}
			},
		},
		"fr-champion": {
			mesh: {
				jsFile:"/res/fairy/omega/champion.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/omega/champion-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/omega/champion-normalmap.jpg",
							}
						}
					}
				}
			},
		},
		"fr-wizard": {
			mesh: {
				jsFile:"/res/fairy/omega/wizard.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/omega/wizard-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/omega/wizard-normalmap.jpg",
							}
						}
					}
				}
			},
		},
		"fr-flamingo": {
			mesh: {
				jsFile:"/res/fairy/birds/flamingo.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/birds/flamingo-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/birds/flamingo-normalmap.jpg",
							}
						}
					}
				}
			},
		},
		"fr-phoenix": {
			mesh: {
				jsFile:"/res/fairy/birds/phoenix.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/birds/phoenix-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/birds/phoenix-normalmap.jpg",
							}
						}
					}
				}
			},
		},
		"fr-cobra": {
			mesh: {
				jsFile:"/res/fairy/cobra/cobra.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/cobra/cobra-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/cobra/cobra-normalmap.jpg",
							}
						}
					}
				}
			},
		},
		"fr-hawk": {
			mesh: {
				jsFile:"/res/fairy/hawk/hawk.js"
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/fairy/hawk/hawk-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/fairy/hawk/hawk-normalmap.jpg",
							}
						}
					}
				}
			},
		},
	});
})();
