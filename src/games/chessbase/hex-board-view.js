
(function() {
	
	var JOCLY_FIELD_SIZE=12000; // physical space

	var NBCOLS=0, NBROWS=0, CSIZES={}, SHIFTMOD2, SHIFTRIGHT;
	
	var COS30 = Math.cos(Math.PI/6);

	View.Game.cbTargetMesh = "/res/ring-target-hexagon.js";
	View.Game.cbTargetSelectColor = 0x338800; //0xff8800;
	View.Game.cbTargetCancelColor = 0xff8800; //0x884400;

	View.Game.cbEnsureConstants =function() {
		if(NBROWS)
			return;
		NBROWS=this.cbVar.geometry.height;
		NBCOLS=this.cbVar.geometry.width;
		SHIFTMOD2=this.cbVar.geometry.SHIFTMOD2;
		SHIFTRIGHT=this.cbVar.geometry.SHIFTRIGHT?1:0;
	}

	// 'this' is a Game object
	View.Game.cbCSize =function(boardSpec) {
		this.cbEnsureConstants();
		var cSize=CSIZES[boardSpec.margins.x+"_"+boardSpec.margins.y];
		if(!cSize) {
			
			var ratio,r,s,width,height;
			
			if(boardSpec.vertical) {
				var relWidth = ((NBROWS+2*boardSpec.margins.x+.5) * 1.5);
				var relHeight = ((NBCOLS+2*boardSpec.margins.y-SHIFTRIGHT/2) * 2 * COS30); 
				ratio =  relWidth / relHeight;
				if(ratio<1) {
					r = (JOCLY_FIELD_SIZE * ratio) / relWidth;
					s = r * COS30;
				} else {
					s = JOCLY_FIELD_SIZE / ratio / relHeight;
					r = s / COS30;
				}
				width = (NBROWS+2*boardSpec.margins.x+.5) * 1.5 * r;
				height= (NBCOLS+2*boardSpec.margins.y-SHIFTRIGHT/2) * 2 * s;
			} else {
				var relWidth = ((NBCOLS+2*boardSpec.margins.x+SHIFTRIGHT/2-1/2) * 2 * COS30);
				var relHeight = ((NBROWS+2*boardSpec.margins.y+.5) * 1.5); 
				ratio =  relWidth / relHeight;
				if(ratio<1) {
					s = JOCLY_FIELD_SIZE * ratio / relWidth;
					r = s / COS30;
				} else {
					r = (JOCLY_FIELD_SIZE / ratio) / relHeight;
					s = r * COS30;
				}
				width = (NBCOLS+2*boardSpec.margins.x+SHIFTRIGHT/2-1/2) * 2 * s;
				height= (NBROWS+2*boardSpec.margins.y+.5) * 1.5 * r;
			}

			
			cSize={
				s:s,
				r:r,
				pieceCx:2*s*.9,
				pieceCy:2*s*.9,
				ratio: ratio,
				width: width,
				height: height,
			}				

			CSIZES[boardSpec.margins.x+"_"+boardSpec.margins.y]=cSize;
		}
		return cSize;
	}
	
	View.Game.cbHexBoard = $.extend({},View.Game.cbBaseBoard,{
		
		notationMode: "out", // notation outside the board
		
		// 'this' is a Game object
		coordsFn: function(boardSpec) {
			
			boardSpec = boardSpec || {};
			boardSpec.margins = boardSpec.margins || {x:0,y:0};
			
			return function(pos) {
				var cSize = this.cbCSize(boardSpec);
				var c=pos%NBCOLS;
				var r=(pos-c)/NBCOLS;
				var coords;
				if(boardSpec.vertical) 
					coords = {
						x:(r-(NBROWS-1)/2)*(cSize.r*3/2),
						y:-(c-(NBCOLS-1)/2+SHIFTRIGHT/4)*2*cSize.s-(r%2==SHIFTMOD2?0:cSize.s),
						z:0,
					}
				else 
					coords = {
						x:(c-(NBCOLS-1)/2-SHIFTRIGHT/4+1/4)*2*cSize.s+(r%2==SHIFTMOD2?0:cSize.s),
						y:(r-(NBROWS-1)/2)*(cSize.r*3/2),
						z:0,
					};
				if(this.mViewAs==-1) {
					coords.y=-coords.y;
					coords.x=-coords.x;
				}
				return coords;
			}
		},
		
		createGeometry: function(spec,callback) {
			var cSize = this.cbCSize(spec);
			var geo = new THREE.PlaneGeometry(cSize.width/1000,cSize.height/1000);
			
			var matrix = new THREE.Matrix4();
			matrix.makeRotationX(-Math.PI/2)
			geo.applyMatrix(matrix);
			
			var uvs=geo.faceVertexUvs[0];
			for (var u = 0 ; u < uvs.length ; u++){
				for (var i = 0 ; i < uvs[u].length ; i++){
					if(cSize.ratio<1)
						uvs[u][i].x=uvs[u][i].x*cSize.ratio+(1-cSize.ratio)/2;
					if(cSize.ratio>1)
						uvs[u][i].y=uvs[u][i].y/cSize.ratio+(1-1/cSize.ratio)/2;
				}
			}
			callback(geo);
		},

		paintBackground: function(spec,ctx,images,channel,bWidth,bHeight) {
			if (images['boardBG'])
				ctx.drawImage(images['boardBG'],-bWidth/2,-bHeight/2,bWidth,bHeight);				
		},		

		paintChannel: function(spec,ctx,images,channel) {
			var cSize = this.cbCSize(spec);
			spec.paintBackground.call(this,spec,ctx,images,channel,cSize.width,cSize.height);			
		},
		
		paint: function(spec,canvas,images,callback) {
			for(var channel in canvas) {
				var ctx=canvas[channel].getContext('2d');
				ctx.scale(spec.TEXTURE_CANVAS_CX/JOCLY_FIELD_SIZE,spec.TEXTURE_CANVAS_CY/JOCLY_FIELD_SIZE);
				ctx.translate(JOCLY_FIELD_SIZE/2,JOCLY_FIELD_SIZE/2);
				spec.paintChannel.call(this,spec,ctx,images,channel);
			}
			callback();
		},


	});

	View.Game.cbHexBoardClassic = $.extend({},View.Game.cbHexBoard,{
		'colorFill' : {		
			"+": "rgba(100,100,100,.9)", //"rgba(200,150,100,1)", // "gray" cells
			"#": "rgba(0,0,0,1)", // "black" cells
			".": "rgba(210,200,200,.9)", // "white" cells
			" ": "rgba(0,0,0,0)",
		},
		'texturesImg' : {
			'boardBG' : '/res/images/wood.jpg',
		},
		'notationMode': 'in',
		modifyMesh: function(spec,mesh,callback) {
			var cSize = this.cbCSize(spec);
			
			var cx = cSize.width / 1000;
			var cy = cSize.height / 1000;
			
			// add border frame
			function setupShapeSquare(cx,cy){
				var sh = new THREE.Shape();
				sh.moveTo(-cx/2 , -cy/2);
				sh.lineTo(cx/2 , -cy/2);
				sh.lineTo(cx/2 , cy/2);
				sh.lineTo(-cx/2 , cy/2);
				return sh;		
			}					
			var bevelSize = .1;
			var frameWidth=0.5;
			var frameShape = setupShapeSquare(cx+frameWidth+bevelSize, cy+frameWidth+bevelSize);
			var holeShape = setupShapeSquare(cx+bevelSize,cy+bevelSize);
			frameShape.holes.push(holeShape);

			var extrudeSettings = {
				amount: .4 , // main extrusion thickness
				steps: 1 , // nb of main extrusion steps
				bevelSize: bevelSize, 
				bevelThickness:.04,
				bevelSegments: 1, // nb of bevel segment
			};

			var frameGeo = new THREE.ExtrudeGeometry( frameShape, extrudeSettings );
			
			var matrix = new THREE.Matrix4();
			matrix.makeRotationX(-Math.PI/2)
			frameGeo.applyMatrix(matrix);
			
            blackMat = new THREE.MeshPhongMaterial({
                color: '#000000',
                shininess: 500,
                specular: '#888888',
                emissive: '#000000',
            });
			var frameObj = new THREE.Mesh( frameGeo , blackMat);
			frameObj.position.y=-extrudeSettings.amount-.01;
			mesh.add(frameObj);
			var bottom = new THREE.Mesh(new THREE.BoxGeometry(cx,cy,0.1),blackMat);
			bottom.rotation.x=Math.PI/2;
			bottom.position.y=-.1;
			mesh.add(bottom);
			callback(mesh);
		},
		
		paintCell: function(spec,ctx,images,channel,cellType,xCenter,yCenter,r,s) {
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = 15;
			if (channel=='bump')
				ctx.fillStyle="#ffffff";
			else
				ctx.fillStyle=spec.colorFill[cellType];
			ctx.beginPath();
			if(spec.vertical) {
				ctx.moveTo(xCenter-r,yCenter+0);
				ctx.lineTo(xCenter-r/2,yCenter-s);
				ctx.lineTo(xCenter+r/2,yCenter-s);
				ctx.lineTo(xCenter+r,yCenter-0);
				ctx.lineTo(xCenter+r/2,yCenter+s);
				ctx.lineTo(xCenter-r/2,yCenter+s);
			} else {
				ctx.moveTo(xCenter+0,yCenter+r);
				ctx.lineTo(xCenter+s,yCenter+r/2);
				ctx.lineTo(xCenter+s,yCenter-r/2);
				ctx.lineTo(xCenter+0,yCenter-r);
				ctx.lineTo(xCenter-s,yCenter-r/2);
				ctx.lineTo(xCenter-s,yCenter+r/2);				
			}
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		},
		
		paintCells: function(spec,ctx,images,channel) {
			var cSize = this.cbCSize(spec);
			var getCoords=spec.coordsFn(spec);
			for(var row=0;row<NBROWS;row++) {
				for(var col=0;col<NBCOLS;col++) {
					var pos = col+row*NBCOLS;
					var coords=getCoords.call(this,pos);
					var cellType=this.cbVar.geometry.CellType(col,NBROWS-row-1);
					if(cellType!=' ') {
						var xCenter=coords.x;
						var yCenter=coords.y;
						spec.paintCell.call(this,spec,ctx,images,channel,cellType,xCenter,yCenter,cSize.r,cSize.s);
					}
				}
			}
		},
		
		paintLines: function(spec,ctx,images,channel) {
		},

		paintChannel: function(spec,ctx,images,channel) {
			var cSize = this.cbCSize(spec);
			spec.paintBackground.call(this,spec,ctx,images,channel,cSize.width,cSize.height);
			spec.paintCells.call(this,spec,ctx,images,channel)
			spec.paintLines.call(this,spec,ctx,images,channel);
			if(this.mNotation)
				spec.paintNotation.call(this,spec,ctx,channel);
		},
		
		paintNotation: function(spec,ctx,channel) {
			var cSize = this.cbCSize(spec);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = "#000000";
			ctx.font = Math.ceil(cSize.s*2 / 3) + 'px Monospace';
			switch(spec.notationMode) {
			case "out":
				spec.paintOutNotation.apply(this,arguments);
				break;
			case "in":
				spec.paintInNotation.apply(this,arguments);
				break;
			}
		},
		
		paintOutNotation: function(spec,ctx,channel) {
		},
		
		paintInNotation: function(spec,ctx,channel) {
			var cSize = this.cbCSize(spec);
			var getCoords=spec.coordsFn(spec);
			var fills=spec.colorFill;
			ctx.font = Math.ceil(cSize.s*2 / 5) + 'px Monospace';
			var geometry = this.cbVar.geometry;
			for(var row=0;row<NBROWS;row++) {
				for(var col=0;col<NBCOLS;col++) {
					var pos = col+row*NBCOLS;
					var coords=getCoords.call(this,pos);
					var cellType=this.cbVar.geometry.CellType(col,NBROWS-row-1);
					if(cellType==' ') 
						continue;
					ctx.fillStyle="rgba(0,0,0,0)";
					if(channel=="bump")
						ctx.fillStyle = fills["."];
					switch(cellType) {
					case ".":
						ctx.fillStyle= (channel=="bump") ? fills["."] : fills["#"];
						break;
					case "#":
						ctx.fillStyle=fills["."];
						break;
					case "+":
						ctx.fillStyle=fills["#"];
						break;
					}
					var x = coords.x;
					var y = coords.y + cSize.s*(spec.vertical?.8:.8);
					//ctx.fillText(pos+"/"+geometry.PosName(pos),x,y);
					if(spec.notationDebug)
						ctx.fillText(pos+"/"+col+"/"+row,x,y);
					else
						ctx.fillText(geometry.PosName(pos),x,y);
				}
			}
		},
	});

	View.Game.cbHexBoardClassic2D = $.extend({},View.Game.cbHexBoardClassic,{
		'colorFill' : {		
			".": "rgba(255,206,158,1)", // "white" cells
			"#": "rgba(209,139,71,1)", // "black" cells
			"+": "rgba(232,171,111,1)", // "gray" cells
			" ": "rgba(0,0,0,0)",
		},
		'texturesImg' : {
			'boardBG' : '/res/images/whitebg.png',
		},
	});

	View.Game.cbHexBoardClassic3DMargin = $.extend({},View.Game.cbHexBoardClassic,{
		'margins' : {x:.5,y:.5},
		'extraChannels':[ // in addition to 'diffuse' which is default
			'bump'
		],
	});
	
	View.Game.cbHexBoardClassic2DMargin = $.extend({},View.Game.cbHexBoardClassic2D,{
		'margins' : {x:.5,y:.5},
	});

	View.Game.cbHexBoardClassic2DNoMargin = $.extend({},View.Game.cbHexBoardClassic2D,{
		'margins' : {x:0.0,y:0.0},
	});

	
	
})();
