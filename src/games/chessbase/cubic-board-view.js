
(function() {
	
	var JOCLY_FIELD_SIZE=12000; // physical space

	var NBCOLS=0, NBROWS=0, NBFLOORS=0, CSIZES={};
	
	View.Game.cbCubicEnsureConstants =function() {
		if(NBROWS)
			return;
		NBROWS=this.cbVar.geometry.height;
		NBCOLS=this.cbVar.geometry.width;
		NBFLOORS=this.cbVar.geometry.depth;
	}
	
	// 'this' is a Game object
	View.Game.cbCSize =function(boardSpec) {
		this.cbCubicEnsureConstants();
		
		var cSize=CSIZES[boardSpec.flat];
		if(!cSize) {

			if(boardSpec.flat) {
				
				var widthCells = 2 * (NBCOLS+NBROWS);
				var heightCells = NBCOLS + NBROWS + NBFLOORS;
				
				var cellSize = Math.min(JOCLY_FIELD_SIZE/widthCells,JOCLY_FIELD_SIZE/heightCells);
				var centerYAdj = -(NBROWS-NBCOLS)/2;
				console.warn("centerYAdj",centerYAdj)

				var fenceWidth = boardSpec.fenceRatio*cellSize;

				cSize={
					cellSize: cellSize,
					width: cellSize * widthCells,
					height: cellSize * heightCells,
					planes2d: [{
						x: -(NBCOLS/2-1/2)*cellSize,
						y: (centerYAdj-(NBFLOORS+NBROWS)/2+1/2)*cellSize,
					},{
						x: -(NBCOLS+NBROWS/2-1/2)*cellSize,
						y: (centerYAdj+1/2)*cellSize,
					},{
						x: -(NBCOLS/2-1/2)*cellSize,
						y: (centerYAdj+1/2)*cellSize,
					},{
						x: (NBROWS+NBCOLS/2+1/2)*cellSize,
						y: (centerYAdj+1/2)*cellSize,
					},{
						x: (NBROWS/2+1/2)*cellSize,
						y: (centerYAdj+1/2)*cellSize,
					},{
						x: (NBROWS/2+1/2)*cellSize,
						y: (centerYAdj+NBFLOORS/2+NBCOLS/2+1/2)*cellSize,
					}],
					fenceWidth: fenceWidth,
					fences2d: {
						"01": [{
							x0: -NBCOLS*cellSize,
							y0: (centerYAdj-NBFLOORS/2)*cellSize,
							x1: -NBCOLS*cellSize,
							y1: (centerYAdj-NBFLOORS/2-NBROWS)*cellSize,
						},{
							x0: -NBCOLS*cellSize,
							y0: (centerYAdj-NBFLOORS/2)*cellSize,
							x1: (-NBCOLS-NBROWS)*cellSize,
							y1: (centerYAdj-NBFLOORS/2)*cellSize,
						}],
						"02": [{
							x0: -NBCOLS*cellSize,
							y0: (centerYAdj-NBFLOORS/2)*cellSize,
							x1: 0,
							y1: (centerYAdj-NBFLOORS/2)*cellSize,
						}],
						"03": [{
							x0: -NBCOLS*cellSize,
							y0: (centerYAdj-NBFLOORS/2-NBROWS)*cellSize,
							x1: 0,
							y1: (centerYAdj-NBFLOORS/2-NBROWS)*cellSize,
						},{
							x0: NBROWS*cellSize,
							y0: (centerYAdj-NBFLOORS/2)*cellSize,
							x1: (NBROWS+NBCOLS)*cellSize,
							y1: (centerYAdj-NBFLOORS/2)*cellSize,
						}],
						"04": [{
							x0: 0,
							y0: (centerYAdj-NBFLOORS/2)*cellSize,
							x1: 0,
							y1: (centerYAdj-NBFLOORS/2-NBROWS)*cellSize,
						},{
							x0: 0,
							y0: (centerYAdj-NBFLOORS/2)*cellSize,
							x1: (NBROWS)*cellSize,
							y1: (centerYAdj-NBFLOORS/2)*cellSize,
						}],
						"12": [{
							x0: -NBCOLS*cellSize,
							y0: (centerYAdj-NBFLOORS/2)*cellSize,
							x1: -NBCOLS*cellSize,
							y1: (centerYAdj+NBFLOORS/2)*cellSize,
						}],
						"13": [{
							x0: (-NBCOLS-NBROWS)*cellSize,
							y0: (centerYAdj-NBFLOORS/2)*cellSize,
							x1: (-NBCOLS-NBROWS)*cellSize,
							y1: (centerYAdj+NBFLOORS/2)*cellSize,
						},{
							x0: (NBCOLS+NBROWS)*cellSize,
							y0: (centerYAdj-NBFLOORS/2)*cellSize,
							x1: (NBCOLS+NBROWS)*cellSize,
							y1: (centerYAdj+NBFLOORS/2)*cellSize,
						}],
						"15": [{
							x0: -NBCOLS*cellSize,
							y0: (centerYAdj+NBFLOORS/2)*cellSize,
							x1: (-NBCOLS-NBROWS)*cellSize,
							y1: (centerYAdj+NBFLOORS/2)*cellSize,
						},{
							x0: 0,
							y0: (centerYAdj+NBFLOORS/2+NBCOLS)*cellSize,
							x1: (NBROWS)*cellSize,
							y1: (centerYAdj+NBFLOORS/2+NBCOLS)*cellSize,
						}],
						"24": [{
							x0: 0,
							y0: (centerYAdj-NBFLOORS/2)*cellSize,
							x1: 0,
							y1: (centerYAdj+NBFLOORS/2)*cellSize,
						}],
						"25": [{
							x0: -NBCOLS*cellSize,
							y0: (centerYAdj+NBFLOORS/2)*cellSize,
							x1: 0,
							y1: (centerYAdj+NBFLOORS/2)*cellSize,
						},{
							x0: 0,
							y0: (centerYAdj+NBFLOORS/2)*cellSize,
							x1: 0,
							y1: (centerYAdj+NBFLOORS/2+NBCOLS)*cellSize,
						}],
						"34": [{
							x0: NBROWS*cellSize,
							y0: (centerYAdj-NBFLOORS/2)*cellSize,
							x1: NBROWS*cellSize,
							y1: (centerYAdj+NBFLOORS/2)*cellSize,
						}],
						"35": [{
							x0: NBROWS*cellSize,
							y0: (centerYAdj+NBFLOORS/2)*cellSize,
							x1: (NBROWS+NBCOLS)*cellSize,
							y1: (centerYAdj+NBFLOORS/2)*cellSize,
						},{
							x0: NBROWS*cellSize,
							y0: (centerYAdj+NBFLOORS/2)*cellSize,
							x1: NBROWS*cellSize,
							y1: (centerYAdj+NBFLOORS/2+NBCOLS)*cellSize,
						}],
						"45": [{
							x0: 0,
							y0: (centerYAdj+NBFLOORS/2)*cellSize,
							x1: NBROWS*cellSize,
							y1: (centerYAdj+NBFLOORS/2)*cellSize,
						}],
					},
				}

			} else {
				var ratio,width,height,cellSize;
				
				var maxEdge = Math.max(NBCOLS,NBROWS,NBFLOORS);
				var cellSize = JOCLY_FIELD_SIZE / (maxEdge+3);
				var fenceWidth = boardSpec.fenceRatio*cellSize;
				
				cSize={
					cellSize: cellSize,
					widths: [NBCOLS*cellSize,NBROWS*cellSize,NBCOLS*cellSize,NBCOLS*cellSize,NBROWS*cellSize,NBCOLS*cellSize],
					heights: [NBROWS*cellSize,NBFLOORS*cellSize,NBFLOORS*cellSize,NBFLOORS*cellSize,NBFLOORS*cellSize,NBROWS*cellSize],
					orients: [{
						rotX: -90,
						rotZ: 180,
						tranZ: -NBFLOORS/2*cellSize, 
						rx: 0,
						ry: 0,
						rz: 0,
						dx: [1,0],
						dy: [0,1],
						dz: [0,0],
					},{
						rotZ: 90,
						tranX: -NBCOLS/2*cellSize, 
						rx: 0,
						ry: -90,
						rz: 0,
						dx: [0,0],
						dy: [1,0],
						dz: [0,1],
					},{
						rotZ: 180,
						tranY: NBROWS/2*cellSize, 
						rx: -90,
						ry: 0,
						rz: 0,
						dx: [1,0],
						dy: [0,0],
						dz: [0,1],
					},{
						tranY: -NBROWS/2*cellSize, 
						rx: 90,
						ry: 0,
						rz: 180,
						dx: [-1,0],
						dy: [0,0],
						dz: [0,1],
					},{
						rotZ: -90,
						tranX: NBCOLS/2*cellSize, 
						rx: 0,
						ry: 90,
						rz: 0,
						dx: [0,0],
						dy: [-1,0],
						dz: [0,1],
					},{
						rotX: 90,
						rotZ: 180,
						tranZ: NBFLOORS/2*cellSize, 
						rx: 180,
						ry: 0,
						rz: 0,
						dx: [1,0],
						dy: [0,-1],
						dz: [0,0],
					}],
					fenceWidth: fenceWidth,
					fences: {
						"01": {
							height: NBROWS*cellSize+fenceWidth,
							rx: 90, ry: 0, rz: 0,
							tx: -NBCOLS/2*cellSize,ty:0,tz:-NBFLOORS/2*cellSize,
						},
						"02": {
							height: NBCOLS*cellSize+fenceWidth,
							rx: 0, ry: 90, rz: 0,
							tx: 0,ty:NBROWS/2*cellSize,tz:-NBFLOORS/2*cellSize,
						},
						"03": {
							height: NBCOLS*cellSize+fenceWidth,
							rx: 0, ry: 90, rz: 0,
							tx: 0,ty:-NBROWS/2*cellSize,tz:-NBFLOORS/2*cellSize,
						},
						"04": {
							height: NBROWS*cellSize+fenceWidth,
							rx: 90, ry: 0, rz: 0,
							tx: NBCOLS/2*cellSize,ty:0,tz:-NBFLOORS/2*cellSize,
						},
						"12": {
							height: NBFLOORS*cellSize+fenceWidth,
							rx: 0, ry: 0, rz: 0,
							tx: -NBCOLS/2*cellSize,ty:NBROWS/2*cellSize,tz:0,
						},
						"13": {
							height: NBFLOORS*cellSize+fenceWidth,
							rx: 0, ry: 0, rz: 0,
							tx: -NBCOLS/2*cellSize,ty:-NBROWS/2*cellSize,tz:0,
						},
						"15": {
							height: NBROWS*cellSize+fenceWidth,
							rx: 90, ry: 0, rz: 0,
							tx: -NBCOLS/2*cellSize,ty:0,tz:NBFLOORS/2*cellSize,
						},
						"25": {
							height: NBCOLS*cellSize+fenceWidth,
							rx: 0, ry: 90, rz: 0,
							tx: 0,ty:NBROWS/2*cellSize,tz:NBFLOORS/2*cellSize,
						},
						"24": {
							height: NBFLOORS*cellSize+fenceWidth,
							rx: 0, ry: 0, rz: 0,
							tx: NBCOLS/2*cellSize,ty:NBROWS/2*cellSize,tz:0,
						},
						"34": {
							height: NBFLOORS*cellSize+fenceWidth,
							rx: 0, ry: 0, rz: 0,
							tx: NBCOLS/2*cellSize,ty:-NBROWS/2*cellSize,tz:0,
						},
						"35": {
							height: NBCOLS*cellSize+fenceWidth,
							rx: 0, ry: 90, rz: 0,
							tx: 0,ty:-NBROWS/2*cellSize,tz:NBFLOORS/2*cellSize,
						},
						"45": {
							height: NBROWS*cellSize+fenceWidth,
							rx: 90, ry: 0, rz: 0,
							tx: NBCOLS/2*cellSize,ty:0,tz:NBFLOORS/2*cellSize,
						},
					}
				}
			}
			CSIZES[boardSpec.flat]=cSize;
		}
		return cSize;
	}
	
	View.Game.cbCubicBoard = $.extend({},View.Game.cbBaseBoard,{
		
		notationMode: "in",
		fenceRatio: .08,
		
		coordsFn: function(boardSpec) {
			
			boardSpec = boardSpec || {};
			
			return function(pos) {
				var cSize = this.cbCSize(boardSpec);
				var geometry = this.cbVar.geometry;
				var planeId = geometry.P(pos);
				var plane = geometry.planes[planeId];

				if(boardSpec.flat) {
					
					var plane2d = cSize.planes2d[planeId];
					var pos1 = pos - plane.start;
					var c = pos1 % plane.cols;
					var r = Math.floor(pos1 / plane.cols);
					r = plane.rows - r -1;
					var coords;
					if(planeId==5) {
						c = plane.cols - c -1;
						var tmp = c;
						c = r;
						r = tmp;
						coords = {
								x: plane2d.x+(c-plane.rows/2)*cSize.cellSize,
								y: plane2d.y+(r-plane.cols/2)*cSize.cellSize,
							}
					} else 
						coords = {
							x: plane2d.x+(c-plane.cols/2)*cSize.cellSize,
							y: plane2d.y+(r-plane.rows/2)*cSize.cellSize,
						}
					coords.xb = coords.x;
					coords.yb = coords.y;
					
					return coords;
					
				} else {
					var orient = cSize.orients[planeId];
					
					var pos0 = pos - plane.start;
					var c = pos0 % plane.cols;
					var r = Math.floor(pos0 / plane.cols);
					
					if(this.mViewAs==1) {
						r = plane.rows-1-r;
	
						xb = (c-(plane.cols-1)/2)*cSize.cellSize;
						yb = (r-(plane.rows-1)/2)*cSize.cellSize;
	
						//c = plane.cols-1-c;
						//c = (c+2)%plane.cols;
					} else {
						//xb = ((plane.cols-c-1)-(plane.cols-1)/2)*cSize.cx;
						//yb = (r-(plane.rows-1)/2)*cSize.cy;
						//c = (c+2)%plane.cols;					
					}
					
					var coords = {
						xb: xb,
						yb: yb,
						
						x: -(orient.tranX || 0)-xb*orient.dx[0]-yb*orient.dx[1],
						y: -(orient.tranY || 0)-xb*orient.dy[0]-yb*orient.dy[1],
						z: -(orient.tranZ || 0)-xb*orient.dz[0]-yb*orient.dz[1],
						
						rx: orient.rx,
						ry: orient.ry,
						rz: orient.rz,
					}
					
					return coords;
				}
			}
		},
		
		createGeometry: function(spec,plane,callback) {
			var cSize = this.cbCSize(spec);
			
			var geo = new THREE.PlaneGeometry(cSize.widths[plane]/1000,cSize.heights[plane]/1000);
			
			var orient = cSize.orients[plane];
			var tranX = orient.tranX ? -orient.tranX / 1000 : 0; 
			var tranY = orient.tranZ ? -orient.tranZ / 1000 : 0; 
			var tranZ = orient.tranY ? -orient.tranY / 1000 : 0; 
			
			var matrix = new THREE.Matrix4();
			if(orient.rotX) {
				matrix.makeRotationX(orient.rotX*Math.PI/180);
				geo.applyMatrix(matrix);
			}
			if(orient.rotY) {
				matrix.makeRotationZ(orient.rotY*Math.PI/180);
				geo.applyMatrix(matrix);
			}
			if(orient.rotZ) {
				matrix.makeRotationY(orient.rotZ*Math.PI/180);
				geo.applyMatrix(matrix);
			}
			matrix.makeTranslation(tranX,tranY,tranZ);
			geo.applyMatrix(matrix);
			
			var ratio = cSize.widths[plane] / cSize.heights[plane];
			
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

		createFenceGeometry: function(spec,fence,callback) {
			var cSize = this.cbCSize(spec);
			var fData = cSize.fences[fence] || {};
			var geo = new THREE.CubeGeometry( cSize.fenceWidth/1000, fData.height/1000, cSize.fenceWidth/1000 );

			
			var matrix = new THREE.Matrix4();
			matrix.makeRotationX(fData.rx*Math.PI/180);
			geo.applyMatrix(matrix);
			matrix.makeRotationZ(fData.ry*Math.PI/180);
			geo.applyMatrix(matrix);
			matrix.makeRotationY(fData.rz*Math.PI/180);
			geo.applyMatrix(matrix);
			matrix.makeTranslation(-fData.tx/1000,-fData.tz/1000,-fData.ty/1000);
			geo.applyMatrix(matrix);
			
			callback(geo);
		},

		paintBackground: function(spec,ctx,images,plane,channel,bWidth,bHeight) {
			if (images['boardBG'])
				ctx.drawImage(images['boardBG'],-bWidth/2,-bHeight/2,bWidth,bHeight);
		},

		paintChannel: function(spec,ctx,images,plane,channel) {
			var cSize = this.cbCSize(spec);
			spec.paintBackground.call(this,spec,ctx,images,plane,channel,cSize.widths[plane],cSize.heights[plane]);			
		},

		paint: function(spec,canvas,images,plane,callback) {
			var cSize = this.cbCSize(spec);
			var geometry = this.cbVar.geometry;
			for(var channel in canvas) {
				var ctx=canvas[channel].getContext('2d');
				ctx.save();
				if(spec.flat) {
					ctx.scale(spec.TEXTURE_CANVAS_CX/cSize.width,spec.TEXTURE_CANVAS_CY/cSize.height);
					ctx.translate(cSize.width/2,cSize.height/2);					
				} else {
					var maxDist = Math.max(geometry.planes[plane].cols,geometry.planes[plane].rows)*cSize.cellSize; 
					ctx.scale(spec.TEXTURE_CANVAS_CX/maxDist,spec.TEXTURE_CANVAS_CY/maxDist);
					ctx.translate(maxDist/2,maxDist/2);
				}
				spec.paintChannel.call(this,spec,ctx,images,plane,channel);
				ctx.restore();
			}
			callback();
		},

		createInnerMesh: function(spec,callback) {
			var cSize = this.cbCSize(spec);
			var factor = .99;
			var insideGeo = new THREE.CubeGeometry( factor*NBCOLS*cSize.cellSize/1000, factor*NBFLOORS*cSize.cellSize/1000, factor*NBROWS*cSize.cellSize/1000 );
			var insideMesh = new THREE.Mesh(insideGeo,new THREE.MeshPhongMaterial({color:0x000000,transparent:true,opacity:.9}));
			insideMesh.castShadow = true;
			callback(insideMesh);
		},

		display: function(spec, avatar, callback) {
			var $this=this;
			spec.getResource=avatar.getResource;
			var geometry = this.cbVar.geometry;
			var nbMeshes=6+geometry.fences.length;
			var nbMeshesLeft=nbMeshes;
			var meshes={}
			function AddMesh(mesh,mid) {
				mesh.visible=true;
				meshes[mid]=mesh;
				if(--nbMeshesLeft==0) {
					var fullMesh=new THREE.Object3D();
					for(var mid=0;mid<nbMeshes;mid++) {
						var mesh=meshes[mid];
						fullMesh.add(mesh);
					}
					spec.createInnerMesh.call($this,spec,function(innerMesh) {
						fullMesh.add(innerMesh)
						callback(fullMesh);						
					});
				}
			}
			function MakePlane(plane,cols,rows) {
				spec.createGeometry.call($this,spec,plane,function(meshGeometry) {
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
							//material.side = THREE.DoubleSide;
							//material.opacity=.9;
							//material.transparent=true;										
							var mesh=new THREE.Mesh(meshGeometry,material);
							mesh.receiveShadow = true;
							spec.paint.call($this,spec,canvas,images,plane,function() {
								AddMesh(mesh,plane);
							});
						});
					});					
				});
			}
			function MakeFence(mid,fence) {
				spec.createFenceGeometry.call($this,spec,fence,function(meshGeometry) {
					
					spec.createTextureImages.call($this,spec,function(images) {
						var channels=['diffuse'/*,'bump'*/];
						var canvas={};
						channels.forEach(function(channel) {
							var canvas0=document.createElement('canvas');
							canvas0.width=spec.TEXTURE_CANVAS_CX;
							canvas0.height=spec.TEXTURE_CANVAS_CY;
							canvas[channel]=canvas0;
						});
						spec.createMaterial.call($this,spec,canvas,function(material) {
							material.emissive={r:0,g:0,b:0};
							if($this.cbView.fences && $this.cbView.fences[fence])
								material.color.set($this.cbView.fences[fence]);
							var mesh=new THREE.Mesh(meshGeometry,material);
							spec.paintFence.call($this,spec,canvas,images,fence,function() {
								AddMesh(mesh,mid);
							});
						});
					});
				});
			}
			for(var i=0;i<6;i++)
				MakePlane(i,geometry.planes[i].cols,geometry.planes[i].rows);
			for(var i=0;i<geometry.fences.length;i++)
				MakeFence(i+6,geometry.fences[i]);
		},
		
		paintFence: function(spec,canvas,images,fence,callback) {
			var cSize = this.cbCSize(spec);
			var bWidth=cSize.fenceWidth,bHeight=cSize.fences[fence].height,channel='diffuse';
			var ctx=canvas[channel].getContext('2d');
			if (images['diffusefence']) {
				ctx.drawImage(images['diffusefence'],0,0,ctx.canvas.width,ctx.canvas.height);
			}
			callback();
		},

		draw: function(spec,avatar,ctx) {
			var $this=this;
			spec.getResource=avatar.getResource;
			(function(ctx) {
				spec.createTextureImages.call($this,spec,function(images) {
					for(var plane=0;plane<6;plane++)
						spec.paintChannel.call($this,spec,ctx,images,plane,"diffuse");
					spec.drawFences.call($this,spec,ctx);
				});				
			})(ctx);
		},
		
		drawFences: function(spec,ctx) {
			var cSize = this.cbCSize(spec);
			var geometry = this.cbVar.geometry;
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = cSize.fenceWidth;
			for(var i=0;i<geometry.fences.length;i++) {
				var fenceId = geometry.fences[i];
				var fence = cSize.fences2d[fenceId];
				if(fence)
					for(var j=0;j<fence.length;j++) {
						var line=fence[j];
						ctx.beginPath();
						ctx.moveTo(line.x0,line.y0);
						ctx.lineTo(line.x1,line.y1);
						ctx.stroke();
					}
			}
		} 

	});

	View.Game.cbCubicBoardClassic = $.extend({},View.Game.cbCubicBoard,{
		'margins': { x: 0, y: 0 },
		'colorFill' : {		
			".": "rgba(160,150,150,1)", // "white" cells
			"#": "rgba(0,0,0,1)", // "black" cells
			" ": "rgba(0,0,0,0)",
		},
		'texturesImg' : {
			'boardBG' : '/res/images/wood.jpg',
			'diffusefence' : '/res/images/wood.jpg',
		},
		'extraChannels':[ // in addition to 'diffuse' which is default
  			'bump'
  		],
		
		paintCell: function(spec,ctx,images,plane,channel,cellType,xCenter,yCenter,cx,cy) {
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = 15;
			if (channel=='bump')
				ctx.fillStyle="#ffffff";
			else
				ctx.fillStyle=spec.colorFill[cellType];
			ctx.fillRect(xCenter-cx/2,yCenter-cy/2,cx,cy);
			ctx.rect(xCenter-cx/2,yCenter-cy/2,cx,cy);
		},
		
		paintCells: function(spec,ctx,images,plane,channel) {
			var cSize = this.cbCSize(spec);
			var geometry=this.cbVar.geometry;
			var cols=geometry.planes[plane].cols;
			var rows=geometry.planes[plane].rows;
			var getCoords=spec.coordsFn(spec);
			for(var row=0;row<rows;row++) {
				for(var col=0;col<cols;col++) {
					var pos = geometry.POS(col,row,plane);
					/*
					var pos = this.mViewAs==1 ?
						+plane*NBCOLS*NBROWS :
						NBCOLS*NBROWS-(1+col+row*NBCOLS);
					*/
					var coords=getCoords.call(this,pos);
					var cellType=this.cbView.boardLayout[plane][row][col];
					var xCenter=coords.xb;
					var yCenter=coords.yb;
					var cx=cSize.cellSize;
					var cy=cSize.cellSize;
					
					spec.paintCell.call(this,spec,ctx,images,plane,channel,cellType,xCenter,yCenter,cx,cy);
				}
			}
		},
		
		paintChannel: function(spec,ctx,images,plane,channel) {
			var cSize = this.cbCSize(spec);
			//spec.paintBackground.call(this,spec,ctx,images,channel,plane,cSize.widths[plane],cSize.heights[plane]);
			spec.paintCells.call(this,spec,ctx,images,plane,channel)
			if(this.mNotation)
				spec.paintNotation.call(this,spec,ctx,plane,channel);
		},
		
		paintNotation: function(spec,ctx,plane,channel) {
			var cSize = this.cbCSize(spec);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = "#000000";
			ctx.font = Math.ceil(cSize.cellSize / 5) + 'px Monospace';
			spec.paintInNotation.apply(this,arguments);
		},
		
		paintInNotation: function(spec,ctx,plane,channel) {
			var cSize = this.cbCSize(spec);
			var getCoords=spec.coordsFn(spec);
			var fills=spec.colorFill;
			var geometry = this.cbVar.geometry;
			var pData = geometry.planes[plane];
			
			for (var row = 0; row < pData.rows; row++) {
				for (var col = 0; col < pData.cols; col++) {
					var pos = col + row*pData.cols + pData.start;
					var coords=getCoords.call(this,pos);
					ctx.fillStyle="rgba(0,0,0,0)";
					if(channel=="bump")
						ctx.fillStyle = fills["."];
					switch(this.cbView.boardLayout[plane][row][col]) {
					case ".":
						ctx.fillStyle= (channel=="bump") ? fills["."] : fills["#"];
						break;
					case "#":
						ctx.fillStyle=fills["."];
						break;
					}
					var x = coords.xb-cSize.cellSize * .3;
					var y = coords.yb+cSize.cellSize * .3;
					if(spec.notationDebug)
						ctx.fillText(pos,x,y);
					else
						ctx.fillText(geometry.PosName(pos),x,y);
				}
			}
		},		

		createMaterial: function(spec,canvas,callback) {
			var texBoardDiffuse = new THREE.Texture(canvas.diffuse);
			texBoardDiffuse.needsUpdate = true;
			var matSpec={
				specular: '#010101',
				//emissive: '#ffffff',
				shininess: 200,
				map: texBoardDiffuse,
			}
			if(canvas.bump) {
				var texBoardBump = new THREE.Texture(canvas.bump);
				texBoardBump.needsUpdate = true;
				matSpec.bumpMap = texBoardBump;
				matSpec.bumpScale = 0.1;
			}
			var material=new THREE.MeshPhongMaterial(matSpec);
			callback(material);
		},

	});
	
	View.Game.cbCubicBoardClassic2D = $.extend({},View.Game.cbCubicBoardClassic,{
		'colorFill' : {		
			".": "rgba(231,208,167,1)", // "white" cells
			"#": "rgba(152,113,82,1)", // "black" cells
			" ": "rgba(0,0,0,0)",
		},
		'flat': true,
	});

	
	View.Board.cbAnimate = function(xdv,aGame,aMove,callback) {
		
		var $this=this;
		var animCount=1;
		var tacSound=false;
		
		function EndAnim() {
			if(--animCount==0){
				if(tacSound)
					aGame.PlaySound("tac"+(1+Math.floor(Math.random()*3)));
				callback();
			}
		}
		var piece=this.pieces[this.board[aMove.f]];
		
		function ShortAngle(ng0,ng2) {
			while(ng2<ng0)
				ng2+=2*Math.PI;
			if(ng2-ng0>Math.PI)
				ng2 -= 2 * Math.PI;
			return ng2;
		}

		var displaySpec0=aGame.cbMakeDisplaySpec(aMove.f,piece.s);
		var displaySpec=aGame.cbMakeDisplaySpecForPiece(aGame,aMove.t,piece);
		for(var skin in displaySpec0) {
			var spec=displaySpec0[skin];
			if(spec.z===undefined)
				continue;
			(function(skin) {
				var dspec = displaySpec[skin];
				var ng0 = Math.atan2(spec.y,spec.x);
				var ng2 = Math.atan2(dspec.y,dspec.x);
				ng2 = ShortAngle(ng0,ng2);

				var xyradius0 = Math.sqrt(spec.y*spec.y+spec.x*spec.x);
				var xyradius2 = Math.sqrt(dspec.y*dspec.y+dspec.x*dspec.x);
				
				var radius0 = Math.sqrt(spec.y*spec.y+spec.x*spec.x+spec.z*spec.z);
				var radius2 = Math.sqrt(dspec.y*dspec.y+dspec.x*dspec.x+dspec.z*dspec.z);
				
				var png0 = Math.acos(spec.z/radius0);
				var png2 = Math.acos(dspec.z/radius2);
				png2 = ShortAngle(png0,png2);
				
				var radius1=radius0+4000;
				var c=radius0;
				var S1=c-radius1;
				var S2=c-radius2;
				
				tacSound=true;

				var A=-1;
				var B=4*S1-2*S2;
				var C=-S2*S2;
				var D=Math.abs(B*B-4*A*C);
				var a1=(-B-Math.sqrt(D))/(2*A);
				var a2=(-B+Math.sqrt(D))/(2*A);
				var a=a1;
				var b=-a-S2;
				if(a==0 || -b/(2*a)<0 || -b/(2*a)>1) {
					a=a2;
					b=-a-S2;
				}				
				
				dspec.positionEasingUpdate = function(ratio) {
					var radius=(a*ratio*ratio+b*ratio+c);
					var ng = ng0 + (ng2-ng0)*ratio;
					var png = png0 + (png2-png0)*ratio;
					var Y = radius * Math.cos(png);
					var y = Y * this.SCALE3D;
					
					var xyRadius = Math.sqrt(radius*radius - Y*Y);
					
					var x = xyRadius * Math.cos(ng) * this.SCALE3D;
					var z = xyRadius * Math.sin(ng) * this.SCALE3D;
					this.object3d.position.x=x;
					this.object3d.position.z=z;
					this.object3d.position.y=y;
				}
			})(skin);
		}

		if (!tacSound)
			aGame.PlaySound("move"+(1+Math.floor(Math.random()*4)));
		
		xdv.updateGadget("piece#"+piece.i,displaySpec,600,function() {
			EndAnim();
		});

		if(aMove.c!=null) {
			animCount++;
			var anim3d={
				positionEasingUpdate: null,
			};
			switch(aGame.cbView.captureAnim3d || "movedown") {
			case 'movedown':
				anim3d.z=-2000;
				break;
			case 'scaledown':
				anim3d.scale=[0,0,0];
				break;
			}
			var piece1=this.pieces[aMove.c];
			xdv.updateGadget("piece#"+piece1.i,{
				"2d": {
					opacity: 0,
				},
				"3d": anim3d,
			},600,EndAnim);
		}
		
		if(aMove.cg!==undefined) {
			var spec=aGame.cbVar.castle[aMove.f+"/"+aMove.cg];
			var rookTo=spec.r[spec.r.length-1];
			var piece=this.pieces[this.board[aMove.cg]];
			var displaySpec=aGame.cbMakeDisplaySpecForPiece(aGame,rookTo,piece);
			animCount++;
			xdv.updateGadget("piece#"+piece.i,displaySpec,600,function() {
				EndAnim();
			});
		}
	}
	
	var lightPos = 14;
	var lightInt = 1;

	View.Game.cbExtraLights = [{
		color: 0xffffff,
		intensity: lightInt,
		position: [-lightPos, lightPos, -lightPos],
		props: {
			shadowCameraNear: 15,
			shadowCameraFar: 40,
			castShadow: true,
			shadowDarkness: .25,
			shadowMapWidth: 2048,
			shadowMapHeight: 2048,
			//shadowCameraVisible: true,
		},
	},{
		color: 0xffffff,
		intensity: lightInt,
		position: [lightPos, lightPos, lightPos],
		props: {
			shadowCameraNear: 15,
			shadowCameraFar: 40,
			castShadow: false,
			shadowDarkness: .25,
			shadowMapWidth: 2048,
			shadowMapHeight: 2048,
		},
	},{
		color: 0xffffff,
		intensity: lightInt,
		position: [lightPos, -lightPos, lightPos],
		props: {
			shadowCameraNear: 15,
			shadowCameraFar: 40,
			castShadow: true,
			shadowDarkness: .25,
			shadowMapWidth: 2048,
			shadowMapHeight: 2048,
		},
	},{
		color: 0xffffff,
		intensity: lightInt,
		position: [-lightPos, -lightPos, -lightPos],
		props: {
			shadowCameraNear: 15,
			shadowCameraFar: 40,
			castShadow: false,
			shadowDarkness: .25,
			shadowMapWidth: 2048,
			shadowMapHeight: 2048,
		},
	}]; 
	
})();
