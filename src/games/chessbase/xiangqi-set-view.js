(function() {

	var FLAT_CANVAS_WIDTH = 1024 ;
	var FLAT_CANVAS_HEIGHT = 1024 ;
	
	//var TOKEN_BGCOLOR = "#FFD8A5";
	//var TOKEN_BGCOLOR = "#FFF5F5";
	var TOKEN_BGCOLOR = "rgb(255,255,255)";
	
	
	var TOKEN_MAT_PROPS = {
			//color : 0xffffff,
			shininess : 1000,
			bumpScale: 0.05,
			//emissive: {r:.3,g:.3,b:.4},
			specular: {r:0.1,g:0.1,b:0.1},
		};

	function THREE_CONST(v) {
		if(typeof THREE!=="undefined")
			return THREE[v];
		else
			return 0;
	}
	
	View.Game.cbXiangqiPieceStyle = function(modifier) {
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
						clipy: 300,
					},
				},
			},
			"default": {
				"3d": {
					display: this.cbDisplayPieceFn(this.cbXiangqiPieceStyle3D),
				},
				"2d": {
					file: this.mViewOptions.fullPath + "/res/xiangqi/xiangqi-pieces-sprites.png",
					clipwidth: 300,
					clipheight: 300,
				},
			},
			'xq-pawn': {
				"2d": {
					clipx: 1800,
				},
			},			
			'xq-horse': {
				"2d": {
					clipx: 600,
				},
			},			
			'xq-chariot': {
				"2d": {
					clipx: 1200,
				},
			},			
			'xq-cannon': {
				"2d": {
					clipx: 1500,
				},
			},			
			'xq-general': {
				"2d": {
					clipx: 0,
				},
			},			
			'xq-advisor': {
				"2d": {
					clipx: 300,
				},
			},			
			'xq-elephant': {
				"2d": {
					clipx: 900,
				},
			},			

		},modifier);
	}
	
	View.Game.cbXiangqiPieceStyle3D = $.extend(true,{},View.Game.cbTokenPieceStyle3D,{
		
		'1': {
			'default': {
				'materials': {
					'piecetop': {
						'channels': {
							'bump':{
								'texturesImg': {
									'bumpTexturePattern': "/res/xiangqi/xiangqi-pieces-sprites-playera.png",
								}
							},
							'diffuse': {
								'texturesImg': {
									'mainDiffuse': "/res/xiangqi/whitebg.png",
									'faceDiffuse': "/res/xiangqi/xiangqi-pieces-sprites-playera.png",
								},
								'patternFill': {
									'faceDiffuse': "rgba(255,0,0,1)",
								},
							},
						},
					},
				},
			},			
		},
		'-1': {
			'default': {
				'materials': {
					'piecetop': {
						'channels': {
							'bump':{
								'texturesImg': {
									'bumpTexturePattern': "/res/xiangqi/xiangqi-pieces-sprites-playerb.png",
								}
							},
							'diffuse': {
								'texturesImg': {
									'mainDiffuse': "/res/xiangqi/whitebg.png",
									'faceDiffuse': "/res/xiangqi/xiangqi-pieces-sprites-playerb.png",
								},
								'patternFill': {
									'faceDiffuse': "rgba(0,0,0,1)",
								},
							},
						},
					},
				},
			},			
		},

		
		'default': {
			
			'mesh': {
				jsFile:"/res/xiangqi/token.js",
			},

			'materials':{
				'pieceborders':{
					'params': TOKEN_MAT_PROPS ,
					'channels':{
						'diffuse':{
							size: { cx: FLAT_CANVAS_WIDTH, cy: FLAT_CANVAS_WIDTH },
							texturesImg: {
								'mainDiffuse': "/res/xiangqi/whitebg.png",
							},
							'patternFill': {
								'mainDiffuse': TOKEN_BGCOLOR,
							},
						},
					},
				},
				'piecetop':{
					'params': TOKEN_MAT_PROPS ,
					'channels':{
						'bump':{
							size: { cx: 512, cy: 512 },
							texturesImg: {
								'bumpTexture': "/res/xiangqi/piecebump.jpg",
							},							
							'clipping': {
								'bumpTexturePattern': {
									y:0,
									cx: 300,
									cy: 300,									
								}
							},
							'patternFill': {
								'bumpTexturePattern': "rgba(0,0,0,0.2)",
							},
						},
						'diffuse':{
							size: { cx: FLAT_CANVAS_WIDTH, cy: FLAT_CANVAS_HEIGHT },
							'clipping': {
								'faceDiffuse': {
									y:0,
									cx: 300,
									cy: 300,									
								}
							},
							'patternFill': {
								'mainDiffuse': TOKEN_BGCOLOR,
							},
						},
					},
				},
			},
		},

		'xq-pawn': {
			'materials': {
				'piecetop': {
					'channels': {
						'diffuse': {
							'clipping': {
								'faceDiffuse': {
									x: 1800,
								},
							},
						},
						'bump': {
							'clipping': {
								'bumpTexturePattern': {
									x: 1800,
								},
							},
						},
					},
				},
			},
		},			

		'xq-horse': {
			'materials': {
				'piecetop': {
					'channels': {
						'diffuse': {
							'clipping': {
								'faceDiffuse': {
									x: 600,
								},
							},
						},
						'bump': {
							'clipping': {
								'bumpTexturePattern': {
									x: 600,
								},
							},
						},
					},
				},
			},
		},			

		'xq-chariot': {
			'materials': {
				'piecetop': {
					'channels': {
						'diffuse': {
							'clipping': {
								'faceDiffuse': {
									x: 1200,
								},
							},
						},
						'bump': {
							'clipping': {
								'bumpTexturePattern': {
									x: 1200,
								},
							},
						},
					},
				},
			},
		},			

		'xq-cannon': {
			'materials': {
				'piecetop': {
					'channels': {
						'diffuse': {
							'clipping': {
								'faceDiffuse': {
									x: 1500,
								},
							},
						},
						'bump': {
							'clipping': {
								'bumpTexturePattern': {
									x: 1500,
								},
							},
						},
					},
				},
			},
		},			

		'xq-general': {
			'materials': {
				'piecetop': {
					'channels': {
						'diffuse': {
							'clipping': {
								'faceDiffuse': {
									x: 0,
								},
							},
						},
						'bump': {
							'clipping': {
								'bumpTexturePattern': {
									x: 0,
								},
							},
						},
					},
				},
			},
		},			

		'xq-advisor': {
			'materials': {
				'piecetop': {
					'channels': {
						'diffuse': {
							'clipping': {
								'faceDiffuse': {
									x: 300,
								},
							},
						},
						'bump': {
							'clipping': {
								'bumpTexturePattern': {
									x: 300,
								},
							},
						},
					},
				},
			},
		},			

		'xq-elephant': {
			'materials': {
				'piecetop': {
					'channels': {
						'diffuse': {
							'clipping': {
								'faceDiffuse': {
									x: 900,
								},
							},
						},
						'bump': {
							'clipping': {
								'bumpTexturePattern': {
									x: 900,
								},
							},
						},
					},
				},
			},
		},
	});

	View.Game.cbXiangqiWesternPieceStyle = function(modifier) {
		return $.extend(true,this.cbXiangqiPieceStyle(),{
			"default": {
				"3d": {
					display: this.cbDisplayPieceFn(this.cbXiangqiWesternPieceStyle3D),
				},
				"2d": {
					file: this.mViewOptions.fullPath + "/res/xiangqi/xiangqi-pieces-sprites-western.png",
				},
			}
		},modifier);
	}
	
	View.Game.cbXiangqiWesternPieceStyle3D = $.extend(true,{},View.Game.cbXiangqiPieceStyle3D,{
		'1': {
			'default': {
				'materials': {
					'piecetop': {
						'channels': {
							'diffuse': {
								'texturesImg': {
									'faceDiffuse': "/res/xiangqi/xiangqi-pieces-sprites-western-player.png",
								},
							},
							'bump': {
								'texturesImg': {
									'bumpTexturePattern': "/res/xiangqi/xiangqi-pieces-sprites-western-player.png",
								},
							},
						},
					},
				},
			},			
		},
		'-1': {
			'default': {
				'materials': {
					'piecetop': {
						'channels': {
							'diffuse': {
								'texturesImg': {
									'faceDiffuse': "/res/xiangqi/xiangqi-pieces-sprites-western-player.png",
								},
							},
							'bump': {
								'texturesImg': {
									'bumpTexturePattern': "/res/xiangqi/xiangqi-pieces-sprites-western-player.png",
								},
							},
						},
					},
				},
			},			
		},
	});
	
})();