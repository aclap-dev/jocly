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

	View.Game.cbNishapurPieceStyle = function(modifier) {
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
					display: this.cbDisplayPieceFn(this.cbNishapurPieceStyle3D),
				},
				"2d": {
					file: this.mViewOptions.fullPath + "/res/nishapur/nishapur-2d-sprites.png",
					clipwidth: 100,
					clipheight: 100,
				},
			},
			"np-pawn": {
				"2d": {
					clipx: 0,
				},
			},
			"np-knight": {
				"2d": {
					clipx: 300,
				},
			},
			"np-elephant": {
				"2d": {
					clipx: 200,
				},
			},
			"np-rook": {
				"2d": {
					clipx: 100,
				},
			},
			"np-general": {
				"2d": {
					clipx: 400,
				},
			},
			"np-king": {
				"2d": {
					clipx: 500,
				},
			},
		},modifier);
	}
	
	View.Game.cbNishapurPieceStyle3D = $.extend(true,{},View.Game.cbUniformPieceStyle3D,{
		
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
							specular: 0x111111,
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
						ctx.globalCompositeOperation = 'overlay';
						ctx.fillStyle='rgba(123,61,27,0.7)';
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
							specular: 0x333333,
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
						ctx.globalCompositeOperation = 'overlay';
						ctx.fillStyle='rgba(127,127,68,0.7)';
						ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
					} else
						ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
				},
			},
		},

		
		"np-pawn": {
			mesh: { 
				jsFile:"/res/nishapur/pawn/pawn.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/nishapur/pawn/pawn-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/nishapur/pawn/pawn-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		"np-knight": {
			mesh: { 
				jsFile:"/res/nishapur/knight/knight.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/nishapur/knight/knight-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/nishapur/knight/knight-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		"np-elephant": {
			mesh: { 
				jsFile:"/res/nishapur/elephant/elephant.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/nishapur/elephant/elephant-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/nishapur/elephant/elephant-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		"np-rook": {
			mesh: { 
				jsFile:"/res/nishapur/rook/rook.js" 		
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/nishapur/rook/rook-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/nishapur/rook/rook-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		"np-general": {
			mesh: { 
				jsFile:"/res/nishapur/general/general.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/nishapur/general/general-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/nishapur/general/general-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		"np-king": {
			mesh: { 
				jsFile:"/res/nishapur/king/king.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/nishapur/king/king-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/nishapur/king/king-normalmap.jpg", 
							}
						}
					}
				}
			},
		},		

	});
	
})();