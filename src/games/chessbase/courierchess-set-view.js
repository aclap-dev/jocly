(function() {
	var CANVAS_SIZE = 512;
	var CC_CANVAS_PROPERTIES = {
			cx: CANVAS_SIZE,
			cy: CANVAS_SIZE
	}
	function THREE_CONST(v) {
		if(typeof THREE!=="undefined")
			return THREE[v];
		else
			return 0;
	}
	
	View.Game.cbCourierChessPieceStyle = function(modifier) {
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
					display: this.cbDisplayPieceFn(this.cbCourierChessPieceStyle3D),
				},
				"2d": {
					file: this.mViewOptions.fullPath + "/res/courierchess/wikipedia-courier-sprites.png",
					clipwidth: 100,
					clipheight: 100,
				},
			},
			"cc-pawn": {
				"2d": {
					clipx: 0,
				},
			},
			"cc-knight": {
				"2d": {
					clipx: 100,
				},
			},
			"cc-archer": {
				"2d": {
					clipx: 200,
				},
			},
			"cc-rook": {
				"2d": {
					clipx: 300,
				},
			},
			"cc-queen": {
				"2d": {
					clipx: 400,
				},
			},
			"cc-king": {
				"2d": {
					clipx: 500,
				},
			},
			"cc-courier": {
				"2d": {
					clipx: 700,
				},
			},
			"cc-schleich": {
				"2d": {
					clipx: 600,
				},
			},
			"cc-man": {
				"2d": {
					clipx: 800,
				},
			},
		},modifier);
	}
	
	View.Game.cbCourierChessPieceStyle3D = $.extend(true,{},View.Game.cbUniformPieceStyle3D,{
		
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
							size: CC_CANVAS_PROPERTIES, 
						},
						normal: { 
							size: CC_CANVAS_PROPERTIES,
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
							specular: 0x222222,
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
							specular: 0x222222,
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

		
		"cc-pawn": {
			mesh: { 
				jsFile:"/res/courierchess/cc-pawn/cc-pawn.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/courierchess/cc-pawn/cc-pawn-diffuse.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/courierchess/cc-pawn/cc-pawn-normal.jpg", 
							}
						}
					}
				}
			},
		},
		
		"cc-knight": {
			mesh: { 
				jsFile:"/res/courierchess/cc-knight/cc-knight.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/courierchess/cc-knight/cc-knight-diffuse.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/courierchess/cc-knight/cc-knight-normal.jpg", 
							}
						}
					}
				}
			},
		},
		
		"cc-archer": {
			mesh: { 
				jsFile:"/res/courierchess/cc-archer/cc-archer.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/courierchess/cc-archer/cc-archer-diffuse.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/courierchess/cc-archer/cc-archer-normal.jpg", 
							}
						}
					}
				}
			},
		},
		
		"cc-rook": {
			mesh: { 
				jsFile:"/res/courierchess/cc-rook/cc-rook.js" 		
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/courierchess/cc-rook/cc-rook-diffuse.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/courierchess/cc-rook/cc-rook-normal.jpg", 
							}
						}
					}
				}
			},
		},
		
		"cc-queen": {
			mesh: { 
				jsFile:"/res/courierchess/cc-queen/cc-queen.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/courierchess/cc-queen/cc-queen-diffuse.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/courierchess/cc-queen/cc-queen-normal.jpg", 
							}
						}
					}
				}
			},
		},
		
		"cc-king": {
			mesh: { 
				jsFile:"/res/courierchess/cc-king/cc-king.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/courierchess/cc-king/cc-king-diffuse.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/courierchess/cc-king/cc-king-normal.jpg", 
							}
						}
					}
				}
			},
		},

		"cc-man": {
			mesh: { 
				jsFile:"/res/courierchess/cc-man/cc-man.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/courierchess/cc-man/cc-man-diffuse.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/courierchess/cc-man/cc-man-normal.jpg", 
							}
						}
					}
				}
			},
		},
		"cc-schleich": {
			mesh: { 
				jsFile:"/res/courierchess/cc-schleich/cc-schleich.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/courierchess/cc-schleich/cc-schleich-diffuse.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/courierchess/cc-schleich/cc-schleich-normal.jpg", 
							}
						}
					}
				}
			},
		},
		"cc-courier": {
			mesh: { 
				jsFile:"/res/courierchess/cc-courier/cc-courier.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/courierchess/cc-courier/cc-courier-diffuse.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/courierchess/cc-courier/cc-courier-normal.jpg", 
							}
						}
					}
				}
			},
		},
		
	});
	
})();