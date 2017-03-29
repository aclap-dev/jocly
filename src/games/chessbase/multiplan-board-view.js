
(function() {
	
	var JOCLY_FIELD_SIZE=12000; // physical space

	var NBCOLS=0, NBROWS=0, NBFLOORS=0, CSIZES={};

	View.Game.cbTargetMesh = "/res/ring-target-square-v2.js";
	
	View.Game.cbEnsureConstants = function() {
		if(!NBFLOORS)
			NBFLOORS=this.cbView.boardLayout.length;
		if(!NBROWS)
			NBROWS=this.cbView.boardLayout[0].length;
		if(!NBCOLS)
			NBCOLS=this.cbView.boardLayout[0][0].length;		
	}
	
	// 'this' is a Game object
	View.Game.cbCSize =function(boardSpec,floor) {
		var margins=boardSpec.margins;
		if(floor!==undefined)
			if(boardSpec.boardFloorMargins!==undefined && boardSpec.boardFloorMargins[floor]!==undefined)
				margins=boardSpec.boardFloorMargins[floor];
		
		var cSize=CSIZES[boardSpec.flat+"_"+margins.x+"_"+margins.y];
		if(!cSize) {
			this.cbEnsureConstants();
			
			var ratio,width,height,cellSize;
			
			var relWidth = NBCOLS+2*boardSpec.margins.x;
			var relHeight = NBROWS+2*boardSpec.margins.y;
			
			ratio =  relWidth / relHeight;
			if(ratio<1)
				cellSize = (JOCLY_FIELD_SIZE * ratio) / relWidth;
			else 
				cellSize = (JOCLY_FIELD_SIZE / ratio) / relHeight;
			width = (NBCOLS+2*boardSpec.margins.x) * cellSize;
			height= (NBROWS+2*boardSpec.margins.y) * cellSize;
			

			if(boardSpec.flat)
				cellSize = boardSpec.boardFloorSize / Math.max(NBCOLS+2*margins.x,NBCOLS+2*margins.y);
			
			cSize={
				cx:cellSize,
				cy:cellSize,
				pieceCx:cellSize,
				pieceCy:cellSize,
				ratio: ratio,
				width: (NBCOLS+2*margins.x) * cellSize,
				height: (NBROWS+2*margins.y) * cellSize,
			}
			CSIZES[boardSpec.flat+"_"+margins.x+"_"+margins.y]=cSize;
		}
		return cSize;
	}
	
	View.Game.cbMultiplanBoard = $.extend({},View.Game.cbBaseBoard,{
		
		notationMode: "out", // notation outside the board
		interFloorsDist: 2500,
		
		// 'this' is a Game object
		coordsFn: function(boardSpec) {
			
			boardSpec = boardSpec || {};
			boardSpec.margins = boardSpec.margins || {x:0,y:0};
			
			return function(pos,floor) {
				this.cbEnsureConstants();
				var f=Math.floor(pos/(NBCOLS*NBROWS));
				var c=pos%NBCOLS;
				var r=((pos%(NBCOLS*NBROWS))-c)/NBCOLS;
				var cSize = this.cbCSize(boardSpec,floor);
				if(this.mViewAs==1)
					r=NBROWS-1-r;
				if(this.mViewAs==-1)
					c=NBCOLS-1-c;
				var coords={
					x:(c-(NBCOLS-1)/2)*cSize.cx,
					y:(r-(NBROWS-1)/2)*cSize.cy,
				};
				if(!boardSpec.flat)
					coords.z = f*boardSpec.interFloorsDist;
				else {
					var plan=boardSpec.boardFloor2dPos[f];
					coords.x+=plan.x;
					coords.y+=plan.y;
				}
				return coords;
			}
		},
		
		createGeometry: function(spec,floor,callback) {
			var cSize = this.cbCSize(spec);
			console.log("geometry",floor,cSize)
			var cx = cSize.width/1000;
			var cy = cSize.height/1000;
			
			var geo = new THREE.PlaneGeometry(cx,cy);
			
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

		paintBackground: function(spec,ctx,images,floor,channel,bWidth,bHeight,x0,y0) {
			if (images['boardBG'])
				ctx.drawImage(images['boardBG'],x0-bWidth/2,y0-bHeight/2,bWidth,bHeight);				
		},		

		paintChannel: function(spec,ctx,images,floor,channel,x0,y0) {
			var cSize = this.cbCSize(spec);
			spec.paintBackground.call(this,spec,ctx,images,floor,channel,cSize.width,cSize.height,x0,y0);			
		},
		
		paint: function(spec,canvas,images,floor,callback) {
			for(var channel in canvas) {
				var ctx=canvas[channel].getContext('2d');
				ctx.scale(spec.TEXTURE_CANVAS_CX/JOCLY_FIELD_SIZE,spec.TEXTURE_CANVAS_CY/JOCLY_FIELD_SIZE);
				ctx.translate(JOCLY_FIELD_SIZE/2,JOCLY_FIELD_SIZE/2);
				spec.paintChannel.call(this,spec,ctx,images,floor,channel,0,0);
			}
			callback();
		},

		display: function(spec, avatar, callback) {
			var $this=this;
			spec.getResource=avatar.getResource;
			var nbMeshesLeft=this.cbView.boardLayout.length;
			var meshes={}
			function AddMesh(mesh,floor) {
				mesh.visible=true;
				meshes[floor]=mesh;
				if(--nbMeshesLeft==0) {
					var fullMesh=new THREE.Object3D();
					for(var floor=0;floor<$this.cbView.boardLayout.length;floor++) {
						var mesh=meshes[floor];
						fullMesh.add(mesh);
						mesh.translateY(floor*spec.interFloorsDist/1000);
					}
					callback(fullMesh);
				}
			}
			for(var floor=0;floor<this.cbView.boardLayout.length;floor++) {
				(function(floor) {
					spec.createGeometry.call($this,spec,floor,function(geometry) {
						spec.createTextureImages.call($this,spec,function(images) {
							var channels=['diffuse'].concat(spec.extraChannels || []);
							var canvas={};
							channels.forEach(function(channel) {
								var canvas0=document.createElement('canvas');
								canvas0.width=spec.TEXTURE_CANVAS_CX;
								canvas0.height=spec.TEXTURE_CANVAS_CY;
								canvas[channel]=canvas0;
							});
							spec.createMaterial.call($this,spec,canvas,function(material) {
								if(spec.boardFloorOpacity!==undefined && spec.boardFloorOpacity[floor]!==undefined) {
									var opacity=spec.boardFloorOpacity[floor];
									if(opacity!=1) {
										material.opacity=opacity;
										material.transparent=true;										
									}
								}
								material.side = THREE.DoubleSide;
								var mesh=new THREE.Mesh(geometry,material);
								spec.modifyMesh.call($this,spec,mesh,floor,function(mesh) {
									spec.paint.call($this,spec,canvas,images,floor,function() {
										AddMesh(mesh,floor);
									});
								});
							});
						});					
					});
				})(floor);
			}
		},
		
		draw: function(spec,avatar,ctx) {
			var $this=this;
			spec.getResource=avatar.getResource;
			ctx.save();
			spec.createTextureImages.call(this,spec,function(images) {
				for(var floor=0;floor<$this.cbView.boardLayout.length;floor++) {
					var plan=spec.boardFloor2dPos[floor];
					spec.paintChannel.call($this,spec,ctx,images,floor,"diffuse",plan.x,plan.y);
				}
				ctx.restore();
			});
		},


	});

	View.Game.cbMultiplanBoardClassic = $.extend({},View.Game.cbMultiplanBoard,{
		'colorFill' : {		
			".": "rgba(160,150,150,0.9)", // "white" cells
			"#": "rgba(0,0,0,1)", // "black" cells
			" ": "rgba(0,0,0,0)",
		},
		'texturesImg' : {
			'boardBG' : '/res/images/wood.jpg',
		},
		modifyMesh: function(spec,mesh,floor,callback) {
			if(spec.boardFloorFrames!==undefined && spec.boardFloorFrames[floor]!==undefined && 
					spec.boardFloorFrames[floor]==false) {
				callback(mesh);
				return;
			}
			var cSize = this.cbCSize(spec);
			var cx = cSize.width/1000;
			var cy = cSize.height/1000;

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
		
		paintCell: function(spec,ctx,images,floor,channel,cellType,xCenter,yCenter,cx,cy) {
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = 15;
			if (channel=='bump')
				ctx.fillStyle="#ffffff";
			else
				ctx.fillStyle=spec.colorFill[cellType];
			ctx.fillRect(xCenter-cx/2,yCenter-cy/2,cx,cy);
			ctx.rect(xCenter-cx/2,yCenter-cy/2,cx,cy);
		},
		
		paintCells: function(spec,ctx,images,floor,channel,x0,y0) {
			var cSize = this.cbCSize(spec,floor);
			var getCoords=spec.coordsFn(spec);
			for(var row=0;row<NBROWS;row++) {
				for(var col=0;col<NBCOLS;col++) {
					var pos = this.mViewAs==1 ?
						col+row*NBCOLS+floor*NBCOLS*NBROWS :
						NBCOLS*NBROWS-(1+col+row*NBCOLS);
					var coords=getCoords.call(this,pos,floor);
					var cellType=this.cbView.boardLayout[floor][NBROWS-row-1][col];
					var xCenter=coords.x;
					var yCenter=coords.y;
					var cx=cSize.cx;
					var cy=cSize.cy;
					
					spec.paintCell.call(this,spec,ctx,images,floor,channel,cellType,xCenter,yCenter,cx,cy);
				}
			}
		},
		
		paintLines: function(spec,ctx,images,floor,channel,x0,y0) {
			var cSize = this.cbCSize(spec);
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 40;
			ctx.strokeRect(x0-NBCOLS*cSize.cx/2,y0-NBROWS*cSize.cy/2,NBCOLS*cSize.cx,NBROWS*cSize.cy);
		},

		paintChannel: function(spec,ctx,images,floor,channel,x0,y0) {
			var cSize = this.cbCSize(spec,floor);
			if(spec.boardFloorFrames===undefined || spec.boardFloorFrames[floor])
				spec.paintBackground.call(this,spec,ctx,images,channel,floor,cSize.width,cSize.height,x0,y0);
			spec.paintCells.call(this,spec,ctx,images,floor,channel,x0,y0)
			spec.paintLines.call(this,spec,ctx,images,floor,channel,x0,y0);
			if(this.mNotation)
				spec.paintNotation.call(this,spec,ctx,floor,channel,x0,y0);
		},
		
		paintNotation: function(spec,ctx,floor,channel,x0,y0) {
			var cSize = this.cbCSize(spec,floor);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = "#000000";
			ctx.font = Math.ceil(cSize.cx / 3) + 'px Monospace';
			switch(spec.notationMode) {
			case "out":
				spec.paintOutNotation.apply(this,arguments);
				break;
			case "in":
				spec.paintInNotation.apply(this,arguments);
				break;
			}
		},
		
		paintOutNotation: function(spec,ctx,floor,channel,x0,y0) {
			var cSize = this.cbCSize(spec);
			for (var row = 0; row < NBROWS; row++) {
				var displayedRow = NBROWS - row;
				if(this.mViewAs<0)
					displayedRow=row+1;
				var x = -(NBCOLS/2 + spec.margins.x/2) * cSize.cx;
				var y = (row-NBROWS/2+.5) * cSize.cy;
				ctx.fillText(displayedRow, x+x0, y+y0);	
			}
			for (var col = 0; col < NBCOLS; col++) {
				var displayedCol=col;
				if(this.mViewAs<0)
					displayedCol = NBCOLS - col -1;
				var x = (col-NBCOLS/2+.5) * cSize.cx;
				var y = (NBROWS/2 + spec.margins.y/2) * cSize.cy;
				ctx.fillText(String.fromCharCode(97 + displayedCol), x+x0 , y+y0);
			}
		},
		
		paintInNotation: function(spec,ctx,floor,channel,x0,y0) {
			var cSize = this.cbCSize(spec);
			var getCoords=spec.coordsFn(spec);
			var fills=spec.colorFill;
			ctx.font = Math.ceil(cSize.cx / 5) + 'px Monospace';
			for (var row = 0; row < NBROWS; row++) {
				for (var col = 0; col < NBCOLS; col++) {
					var displayedRow=NBROWS - row;
					var displayedCol=col;
					if(this.mViewAs<0)
						displayedCol = NBCOLS - col -1;
					else
						displayedRow=row+1;								
					var pos = this.mViewAs==1 ?
							col+row*NBCOLS :
							NBCOLS*NBROWS-(1+col+row*NBCOLS);
					pos+=floor*NBCOLS*NBROWS;
					var coords;
					if(spec.flat) {
						coords=getCoords.call(this,pos);
						coords.x-=x0;
						coords.y-=y0;
					} else {
						coords=getCoords.call(this,pos,floor);
					}
					ctx.fillStyle="rgba(0,0,0,0)";
					if(channel=="bump")
						ctx.fillStyle = fills["."];
					switch(this.cbView.boardLayout[floor][NBROWS-row-1][col]) {
					case ".":
						ctx.fillStyle= (channel=="bump") ? fills["."] : fills["#"];
						break;
					case "#":
						ctx.fillStyle=fills["."];
						break;
					}
					var x = coords.x-cSize.cx / 3.5;
					var y = coords.y-cSize.cy / 3;
					if(spec.notationDebug)
						ctx.fillText(pos,x,y);
					else
						ctx.fillText(this.cbVar.geometry.PosName(pos),x+x0,y+y0);
				}
			}
		},
	});

	View.Game.cbMultiplanBoardClassic2D = $.extend({},View.Game.cbMultiplanBoardClassic,{
		'colorFill' : {		
			".": "rgba(231,208,167,1)", // "white" cells
			"#": "rgba(152,113,82,1)", // "black" cells
			" ": "rgba(0,0,0,0)",
		},
		'flat': true,
	});

	View.Game.cbMultiplanBoardClassic3D = $.extend({},View.Game.cbMultiplanBoardClassic,{
		'flat': false,
	});
	
	View.Game.cbMultiplanBoardClassic3DMargin = $.extend({},View.Game.cbMultiplanBoardClassic3D,{
		'margins' : {x:.67,y:.67},
		'extraChannels':[ // in addition to 'diffuse' which is default
			'bump'
		],
		/*
		'mesh': { // not implemented yet
			jsfile:"/res/xd-view/meshes/taflboard.js",
			meshScale:1.32,
			boardMaterialName:"board",
		}
		*/
	});
	
	View.Game.cbMultiplanBoardClassic2DMargin = $.extend({},View.Game.cbMultiplanBoardClassic2D,{
		'margins' : {x:.67,y:.67},
	});

	View.Game.cbMultiplanBoardClassic2DNoMargin = $.extend({},View.Game.cbMultiplanBoardClassic2D,{
		'margins' : {x:0.0,y:0.0},
		'notationMode': 'in',
	});

	
	
})();
