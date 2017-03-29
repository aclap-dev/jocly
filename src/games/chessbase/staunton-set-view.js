(function() {
	var CANVAS_SIZE = 512;
	var STAUNTON_CANVAS_PROPERTIES = {
			cx: CANVAS_SIZE,
			cy: CANVAS_SIZE
	}
	function THREE_CONST(v) {
		if(typeof THREE!=="undefined")
			return THREE[v];
		else
			return 0;
	}

	View.Game.cbStauntonWoodenPieceStyle = function(modifier) {
		return this.cbStauntonPieceStyle($.extend(true,{
			"default": {
				"2d": {
					file: this.mViewOptions.fullPath + "/res/images/woodenpieces2d2.png",
				},
			},
		},modifier));
	}
	
	View.Game.cbStauntonPieceStyle = function(modifier) {
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
					display: this.cbDisplayPieceFn(this.cbStauntonPieceStyle3D),
				},
				"2d": {
					file: this.mViewOptions.fullPath + "/res/images/wikipedia.png",
					clipwidth: 100,
					clipheight: 100,
				},
			},
			"pawn": {
				"2d": {
					clipx: 0,
				},
			},
			"knight": {
				"2d": {
					clipx: 100,
				},
			},
			"bishop": {
				"2d": {
					clipx: 200,
				},
			},
			"rook": {
				"2d": {
					clipx: 300,
				},
			},
			"queen": {
				"2d": {
					clipx: 400,
				},
			},
			"king": {
				"2d": {
					clipx: 500,
				},
			},
		},modifier);
	}
	
	View.Game.cbStauntonPieceStyle3D = $.extend(true,{},View.Game.cbUniformPieceStyle3D,{
		
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
							size: STAUNTON_CANVAS_PROPERTIES, 
						},
						normal: { 
							size: STAUNTON_CANVAS_PROPERTIES,
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
							//specular: 0xaaccff,
							specular: 0x020202,
							shininess : 150 , 
							//combine: THREE_CONST('AddOperation'), 
							//shading: THREE_CONST('SmoothShading'),
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
							specular: 0x080808,
							shininess : 100 , 
							//combine: THREE_CONST('AddOperation'), 
							//shading: THREE_CONST('SmoothShading'),
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

		
		pawn: {
			mesh: { 
				jsFile:"/res/staunton/pawn/pawn-classic.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/pawn/pawn-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/pawn/pawn-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		knight: {
			mesh: { 
				jsFile:"/res/staunton/knight/knight.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/knight/knight-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/knight/knight-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		bishop: {
			mesh: { 
				jsFile:"/res/staunton/bishop/bishop.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/bishop/bishop-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/bishop/bishop-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		rook: {
			mesh: { 
				jsFile:"/res/staunton/rook/rook.js" 		
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/rook/rook-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/rook/rook-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		queen: {
			mesh: { 
				jsFile:"/res/staunton/queen/queen.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/queen/queen-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/queen/queen-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		king: {
			mesh: { 
				jsFile:"/res/staunton/king/king.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/king/king-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/king/king-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
	});
	
})();