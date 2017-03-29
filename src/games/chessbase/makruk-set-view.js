(function() {
	var CANVAS_SIZE = 512;
	var MK_CANVAS_PROPERTIES = {
			cx: CANVAS_SIZE,
			cy: CANVAS_SIZE
	}
	function THREE_CONST(v) {
		if(typeof THREE!=="undefined")
			return THREE[v];
		else
			return 0;
	}
	
	View.Game.cbMakrukPieceStyle = function(modifier) {
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
					display: this.cbDisplayPieceFn(this.cbMakrukPieceStyle3D),
				},
				"2d": {
					file: this.mViewOptions.fullPath + "/res/images/wikipedia.png",
					clipwidth: 100,
					clipheight: 100,
				},
			},
			"mk-pawn": {
				"2d": {
					clipx: 0,
				},
			},
			"mk-knight": {
				"2d": {
					clipx: 100,
				},
			},
			"mk-bishop": {
				"2d": {
					clipx: 200,
				},
			},
			"mk-rook": {
				"2d": {
					clipx: 300,
				},
			},
			"mk-queen": {
				"2d": {
					clipx: 400,
				},
			},
			"mk-king": {
				"2d": {
					clipx: 500,
				},
			},
		},modifier);
	}
	
	View.Game.cbMakrukPieceStyle3D = $.extend(true,{},View.Game.cbUniformPieceStyle3D,{
		
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
							size: MK_CANVAS_PROPERTIES, 
						},
						normal: { 
							size: MK_CANVAS_PROPERTIES,
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
							specular: 0x050505,
							shininess : 200 , 
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
						ctx.globalCompositeOperation = 'normal';
						ctx.fillStyle='rgba(255,238,202,0.8)';
						ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
					} else
						ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
				},
			}
		},
		"-1":{
			'default': {
				materials:{
					mat0:{						
						params : {
							specular: 0x111111,
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
						ctx.globalCompositeOperation = 'normal';
						ctx.fillStyle='rgba(250,30,0,0.5)';
						ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
					} else
						ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
				},
			},
		},

		
		"mk-pawn": {
			mesh: { 
				jsFile:"/res/makruk/pawn/mk-pawn.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/makruk/pawn/mk-pawn-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/makruk/pawn/mk-pawn-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		"mk-knight": {
			mesh: { 
				jsFile:"/res/makruk/knight/mk-knight.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/makruk/knight/mk-knight-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/makruk/knight/mk-knight-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		"mk-bishop": {
			mesh: { 
				jsFile:"/res/makruk/bishop/mk-bishop.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/makruk/bishop/mk-bishop-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/makruk/bishop/mk-bishop-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		"mk-rook": {
			mesh: { 
				jsFile:"/res/makruk/rook/mk-rook.js" 		
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/makruk/rook/mk-rook-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/makruk/rook/mk-rook-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		"mk-queen": {
			mesh: { 
				jsFile:"/res/makruk/queen/mk-queen.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/makruk/queen/mk-queen-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/makruk/queen/mk-queen-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		"mk-king": {
			mesh: { 
				jsFile:"/res/makruk/king/mk-king.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/makruk/king/mk-king-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/makruk/king/mk-king-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
	});
	
})();