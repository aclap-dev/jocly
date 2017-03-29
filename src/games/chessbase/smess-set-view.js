(function() {

	var FLAT_CANVAS_WIDTH = 1024 ;
	var FLAT_CANVAS_HEIGHT = 1024 ;
	
	//var TOKEN_BGCOLOR = "#FFD8A5";
	//var TOKEN_BGCOLOR = "#FFF5F5";
	var TOKEN_BGCOLOR = "rgb(255,248,240)";
	
	
	var TOKEN_MAT_PROPS = {
			//color : 0xffffff,
			shininess : 10,
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
	
	View.Game.cbSmessPieceStyle = function(modifier) {
		return $.extend(true,{
			"1": {
				"default": {
					"2d": {
						file: this.mViewOptions.fullPath + "/res/smess/smess-pieces-sprites-a.png",
						clipy: 0,
					},
				},
			},
			"-1": {
				"default": {
					"2d": {
						file: this.mViewOptions.fullPath + "/res/smess/smess-pieces-sprites-b.png",
						clipy: 0,
					},
				},
			},
			"default": {
				"3d": {
					display: this.cbDisplayPieceFn(this.cbSmessPieceStyle3D),
				},
				"2d": {
					clipwidth: 300,
					clipheight: 300,
				},
			},
			'sm-pawn': {
				"2d": {
					clipx: 0,
				},
			},			
			'sm-skull': {
				"2d": {
					clipx: 300,
				},
			},			
			'sm-brain': {
				"2d": {
					clipx: 600,
				},
			},			
		},modifier);
	}
	
	View.Game.cbSmessPieceStyle3D = $.extend(true,{},View.Game.cbTokenPieceStyle3D,{
		
		'1': {
			'default': {
				'materials': {
					'piecetop': {
						'channels': {
							'bump':{
								'texturesImg': {
									'bumpTexturePattern': "/res/smess/smess-pieces-sprites.png",
								}
							},
							'diffuse': {
								'texturesImg': {
									'mainDiffuse': "/res/smess/playera-bg.png",
									'faceDiffuse': "/res/smess/smess-pieces-sprites.png",
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
									'bumpTexturePattern': "/res/smess/smess-pieces-sprites.png",
								}
							},
							'diffuse': {
								'texturesImg': {
									'mainDiffuse': "/res/smess/playerb-bg.png",
									'faceDiffuse': "/res/smess/smess-pieces-sprites.png",
								},
							},
						},
					},
				},
			},			
		},

		
		'default': {
			
			'mesh': {
				jsFile:"/res/smess/token.js",
			},

			'materials':{
				'pieceborders':{
					'params': TOKEN_MAT_PROPS ,
					'channels':{
						'diffuse':{
							size: { cx: FLAT_CANVAS_WIDTH, cy: FLAT_CANVAS_WIDTH },
							texturesImg: {
								'mainDiffuse': "/res/smess/playera-bg.png",
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
								//'bumpTexture': "/res/smess/piecebump.jpg",
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
						},
					},
				},
			},
		},

		'sm-pawn': {
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

		'sm-skull': {
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

		'sm-brain': {
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

	});
	
})();