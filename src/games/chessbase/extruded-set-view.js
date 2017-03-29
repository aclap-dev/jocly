(function() {

	var FLAT_CANVAS_WIDTH = 1200 ;
	var FLAT_CANVAS_HEIGHT = 200 ;
	
	var EXTRUDED_MATERIAL_WOOD_PARAMS = {
		shininess : 500,
		bumpScale: 0,
		color : {r:1,g:1,b:1},
	}
	var EXTRUDED_MATERIAL_FACE_PARAMS = {
		bumpScale: 0,
		shininess : 200,
		specular : {r:0,g:0,b:0},
		color : {r:1,g:1,b:1},
	}


	function THREE_CONST(v) {
		if(typeof THREE!=="undefined")
			return THREE[v];
		else
			return 0;
	}
	
	View.Game.cbExtrudedPieceStyle = function(modifier) {
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
					display: this.cbDisplayPieceFn(this.cbExtrudedPieceStyle3D),
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

	
	View.Game.cbExtrudedPieceStyle3D = $.extend(true,{},View.Game.cbTokenPieceStyle3D,{
		'1': {
			'default': {
				'materials': {
					'face': {
						'channels': {
							'diffuse': {
								'texturesImg': {
									'faceDiffuse': "/res/extruded/wikipedia-pieces-diffuse-white.jpg",
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
					'face': {
						'channels': {
							'diffuse': {
								'texturesImg': {
									'faceDiffuse': "/res/extruded/wikipedia-pieces-diffuse-black.jpg",
								},
							},
						},
					},
				},
			},
		},
		
		'default':{

			'materials':{
				'wood':{
					'params': EXTRUDED_MATERIAL_WOOD_PARAMS,
					'channels':{
						'diffuse':{
							size: { cx: 256, cy: 256 },
							'texturesImg': {
								'mainDiffuse': "/res/extruded/wood.jpg",
							},
						},
					},
				},
				'face':{
					'params': EXTRUDED_MATERIAL_FACE_PARAMS,
					'channels':{
						'diffuse':{
							size: { cx: FLAT_CANVAS_WIDTH, cy: FLAT_CANVAS_HEIGHT },
						},
					},
				},
			},
		},

		'pawn': {
			mesh: { 
				jsFile:"/res/extruded/flat3dpieces-pawn.js",
			},
		},
		'knight': {
			mesh: { 
				jsFile:"/res/extruded/flat3dpieces-knight.js",
			},
		},
		'bishop': {
			mesh: { 
				jsFile:"/res/extruded/flat3dpieces-bishop.js",
			},
		},
		'rook': {
			mesh: { 
				jsFile:"/res/extruded/flat3dpieces-rook.js",
			},
		},
		'queen': {
			mesh: { 
				jsFile:"/res/extruded/flat3dpieces-queen.js",
			},
		},
		'king': {
			mesh: { 
				jsFile:"/res/extruded/flat3dpieces-king.js",
			},
		},
	});
	
	
})();