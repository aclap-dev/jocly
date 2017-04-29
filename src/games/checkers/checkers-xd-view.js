/*
 *
 * Copyright (c) 2013 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

(function() {
	
	var CLASSIC3D_FLOOR_Z = 1 ;
	
	function drawAdancedPattern(ctx,img,xCenter,yCenter,cx,cy,fillColor,compMode,rotationDeg){
		var bInvert
		var buffCz=512;
		var tmpCanvas = document.createElement('canvas');
		tmpCanvas.width=tmpCanvas.height=buffCz;
		ctxTmp=tmpCanvas.getContext('2d');
        ctxTmp.fillStyle=fillColor;
        ctxTmp.fillRect(0,0,buffCz,buffCz);
        ctxTmp.translate(buffCz/2,buffCz/2);
        if (rotationDeg)
        ctxTmp.rotate(rotationDeg/180*Math.PI);
        ctxTmp.globalCompositeOperation=compMode;
		ctxTmp.drawImage(img,0,0,img.width,img.height,-buffCz/2,-buffCz/2,buffCz,buffCz);
		// now paste the result in diffuse canvas
        ctx.drawImage(tmpCanvas,0,0,buffCz,buffCz,xCenter-cx/2,yCenter-cy/2,cx,cy);
	}
	
	function drawFilledPattern(ctx,img,xCenter,yCenter,cx,cy,fillColor,rotationDeg){
		drawAdancedPattern(ctx,img,xCenter,yCenter,cx,cy,fillColor,'destination-in',rotationDeg);
	}
	function drawInvertedFilledPattern(ctx,img,xCenter,yCenter,cx,cy,fillColor,rotationDeg){
		drawAdancedPattern(ctx,img,xCenter,yCenter,cx,cy,fillColor,'destination-out',rotationDeg);
	}
	
	var currentGame;
	
	var WIDTH, HEIGHT, SIZE, PCOUNT, SWIDTH;
	var CLASSIC_WHITE = 0xbbaa99;
	var CLASSIC_BLACK = 0x222222;
	
	var colors=["black","red"];
	var reflexivities=[0.5,0.7];
	var sphereGeometry, textures, textureCube;
	
	View.Game.xdInitExtra = function(xdv) {
	}

	View.Game.xdPreInit = function(xdv) {
	}
	
	// useful to initialize pieces and board while the real meshes aren't loaded yet
	View.Game.chMakeDummyMesh = function(xdv) {
		if(typeof THREE != "undefined")
		    return new THREE.Mesh( new THREE.CubeGeometry( .001,.001,.001 ), 
					      new THREE.MeshLambertMaterial() );
		else
			return null;
	}
	
	var pieces = {};
	
	View.Game.chMakeTokenPiece = function(avatar,type,who,callback) {
		
		var fullPath=this.mViewOptions.fullPath;
		
		function loadResources(type,who,callback){
			var bumpMap;
			var diffuseMap;
			var pieceGeo;
			var queenMask;
			var nbRes=4;
			var TEXTURE_CANVAS_SZ=256;
			
			function checkLoaded(){
				nbRes--;
				if (nbRes==0){
					function blackenCtxIfNeeded(ctx){
						if(who<0){
							//ctx.globalCompositeOperation="multiply";
							ctx.fillStyle="rgba(0,0,0,0.9)";
							ctx.fillRect(0,0,TEXTURE_CANVAS_SZ,TEXTURE_CANVAS_SZ);
						}
					}
					
					// piecetop
					var canvasDiffuse=document.createElement('canvas');
					canvasDiffuse.width=canvasDiffuse.height=TEXTURE_CANVAS_SZ;
					var textureDiff =  new THREE.Texture(canvasDiffuse);
					var canvasBump=document.createElement('canvas');
					canvasBump.width=canvasBump.height=TEXTURE_CANVAS_SZ;
					var textureBump =  new THREE.Texture(canvasBump);
					
					
					var ctx=canvasDiffuse.getContext("2d");
					ctx.drawImage(diffuseMap,0,0,TEXTURE_CANVAS_SZ,TEXTURE_CANVAS_SZ);
					blackenCtxIfNeeded(ctx);
					
					if (type==1)
						drawFilledPattern(ctx,queenMask,
							TEXTURE_CANVAS_SZ/2,TEXTURE_CANVAS_SZ/2,TEXTURE_CANVAS_SZ,TEXTURE_CANVAS_SZ,
							(who>0)?"rgba(0,0,0,0.9)":"rgba(221, 193, 148, 1)",
							0);

					var ctxBump=canvasBump.getContext("2d");
					ctxBump.drawImage(bumpMap,0,0,TEXTURE_CANVAS_SZ,TEXTURE_CANVAS_SZ);
					
					textureDiff.needsUpdate=true;
					textureBump.needsUpdate=true;
					
					// piece border
					var canvasDiffuseB=document.createElement('canvas');
					canvasDiffuseB.width=canvasDiffuseB.height=TEXTURE_CANVAS_SZ;
					var textureDiffB =  new THREE.Texture(canvasDiffuseB);
					var ctxB=canvasDiffuseB.getContext("2d");
					ctxB.drawImage(diffuseMap,0,0,TEXTURE_CANVAS_SZ,TEXTURE_CANVAS_SZ);
					blackenCtxIfNeeded(ctxB);
					textureDiffB.needsUpdate=true;
					
					
					var specular="#050505",shininess=50,color=0xdddddd;
					if (who<0) {
						specular="#111111";
						shininess=10;
					}
					var mattop=new THREE.MeshPhongMaterial({name:"piecetop",
						color : color,
						specular:specular,
						shininess:shininess,
						map:textureDiff,
						bumpMap:textureBump,
						bumpScale:0.06
						});
					var matborder=new THREE.MeshPhongMaterial({name:"pieceborders",
						color : color,
						specular:specular,
						shininess:shininess,
						map:textureDiffB});
					
					var pieceMat=new THREE.MultiMaterial([matborder,mattop]);
					
					callback({geometry:pieceGeo,material:pieceMat});
					
				}
			}

			avatar.getResource("smoothedfilegeo|0|"+fullPath+"/res/xd-view/meshes/piece-v2.js",
				function(geometry , materials){
					pieceGeo=geometry;
					//pieceMat=materials;
					checkLoaded();
				});
			avatar.getResource("image|"+fullPath+"/res/xd-view/meshes/piecetop-bump.jpg",
				function(img){
					bumpMap=img;
					checkLoaded();
				});
			avatar.getResource("image|"+fullPath+"/res/xd-view/meshes/piecediff.jpg",
				function(img){
					diffuseMap=img;
					checkLoaded();
				});
			avatar.getResource("image|"+fullPath+"/res/xd-view/meshes/piecetop-queen-mask.png",
				function(img){
					queenMask=img;
					checkLoaded();
				});
		}
				
				
		var key="_"+type+"_"+who+"_";
			
		var piece=pieces[key];
		if(Array.isArray(piece))
			piece.push(callback);
		else if(!piece) {
			pieces[key] = [ callback ];
			loadResources(type,who,function(resources) {
				var callbacks = pieces[key];
				pieces[key] = {
					geometry: resources.geometry,
					material: resources.material,
				}
				callbacks.forEach(function(callback) {
					callback(new THREE.Mesh(resources.geometry,resources.material));
				});
			});
		} else 
			callback(new THREE.Mesh(piece.geometry,piece.material));				
	}


	View.Game.xdInit = function(xdv) {
				
		var $this=this;
		
		this.g.getColumn=function(c,r) {
			return 2*c+(r%2);			
		}
		this.g.dimensions={
			width: this.mOptions.width, 
			squareWidth: 2*this.mOptions.width, 
			height: this.mOptions.height, 
		}

		this.xdPreInit();
		
		var fullPath=this.mViewOptions.fullPath;
		var lightcellDistance=this.g.lightcellDistance;
		var INITIAL=this.mOptions.initial;
		WIDTH=this.g.dimensions.width;
		SWIDTH=this.g.dimensions.squareWidth;
		HEIGHT=this.g.dimensions.height;
		SIZE=Math.floor(12000/SWIDTH,12000/HEIGHT);
		
		if(typeof THREE!="undefined") {
			sphereGeometry = new THREE.SphereGeometry(1,32,16);
			textures=["black.png","white.png","red.png"];	
			var path = fullPath+"/res/xd-view/meshes/skybox/";
			var format = '.jpg';
			var urls = [
				path + 'px' + format, path + 'nx' + format,
				path + 'py' + format, path + 'ny' + format,
				path + 'pz' + format, path + 'nz' + format
			];
			//textureCube = THREE.ImageUtils.loadTextureCube( urls );
			textureCube = new THREE.CubeTextureLoader( ).load( urls );
		}

		xdv.createGadget("board", {
			"2d" : {
				type : "image",
			},
		});

		xdv.createGadget("lightside", {
			"3d": {
				type: "custom3d",
				create: function() {
					var backlight = new THREE.PointLight( 0xaaaaff, 1, 30 );
					return backlight;
				},
				z: 10000,
				x: 10000,
				castShadow: false,
			},
			"turtles3d": {
				create: function() {
					var backlight = new THREE.PointLight( 0xaaaaff, 3, 30 , 2);
					return backlight;
				},
			},
		});
		xdv.createGadget("lightback", {
			"3d": {
				type: "custom3d",
				create: function() {
					var backlight = new THREE.PointLight( 0xaaccff, 0.7, 30 );
					return backlight;
				},
				z: 10000,
				y: -10000,
				castShadow: false,
			},
			"turtles3d" : {
				create: function() {
					var backlight = new THREE.PointLight( 0xaaccff, 3, 30 , 2);
					return backlight;
				},
			},
		});
		
		
		/*function createSkyball(style){
			var graphGeometry = new THREE.SphereGeometry( 50 , 50, 50 );
			var material = new THREE.MeshBasicMaterial( { 
		        color: 0x00ff00, 
		        wireframe: false,
		        side: THREE.DoubleSide
		    } );
			graphGeometry.computeBoundingBox();
			zMin = graphGeometry.boundingBox.min.z;
			zMax = graphGeometry.boundingBox.max.z;
			zRange = zMax - zMin;
			var color, point, face, numberOfSides, vertexIndex;
			// faces are indexed using characters
			var faceIndices = [ 'a', 'b', 'c', 'd' ];
			// first, assign colors to vertices as desired
			for ( var i = 0; i < graphGeometry.vertices.length; i++ ) 
			{
				point = graphGeometry.vertices[ i ];
				color = new THREE.Color( 0x000000 );
				
				var delta=(zMax - point.z)/zRange;
				if(style=="turtles3d"){
					color.b = 1+delta;
					color.g = 0.5+0.4*delta;
					color.r = 0.3*delta;
				}else{
					color.g = color.b = color.r = delta/6;
				}
				
				graphGeometry.colors[i] = color; // use this array for convenience
			}
			// copy the colors as necessary to the face's vertexColors array.
			for ( var i = 0; i < graphGeometry.faces.length; i++ ) 
			{
				face = graphGeometry.faces[ i ];
				numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
				for( var j = 0; j < numberOfSides; j++ ) 
				{
					vertexIndex = face[ faceIndices[ j ] ];
					face.vertexColors[ j ] = graphGeometry.colors[ vertexIndex ];
				}
			}
			///////////////////////
			// end vertex colors //
			///////////////////////
			// "wireframe texture"
			var wireTexture = new THREE.ImageUtils.loadTexture( fullPath + "/res/xd-view/meshes/square.png" );
			wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping; 
			wireTexture.repeat.set( 40, 40 );
			var wireMaterial = new THREE.MeshBasicMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side:THREE.DoubleSide } );

			wireMaterial.map.repeat.set( 20, 60 );	
			
			var mesh = new THREE.Mesh( graphGeometry , wireMaterial );
			mesh.doubleSided = true;
			return mesh;
		}
		
		xdv.createGadget("skyball", {
			"turtles3d" : {
				type : "custommesh3d",		
				rotate: 135,
				rotateX: -60,
				create: function() {
					return createSkyball("turtles3d");
				},
				opacity:1,
			},
		});*/

		for(var pos=0; pos<this.g.Coord.length;pos++) {
			(function(pos) {
				xdv.createGadget("text#"+pos, {
					"2d" : {
						type : "element",
						width : SIZE*.2,
						height : SIZE*.2,
						initialClasses: "notation",
						css : {
							"text-align" : "center",
						},
						z : 4,
						display : function(element, width, height) {
							element.css({
								"font-size" : (height * .6) + "pt",
								"line-height" : (height * 1) + "px",
							}).text($this.checkersPosToString(pos));
						},
					},
					"alquerque3d": {
						type: "custommesh3d",
						z: -SIZE*.05,
						rotateX: -90,
						create: function() {
                            var _this = this;
                            this.getResource('font|'+fullPath+
                                '/res/xd-view/fonts/helvetiker_regular.typeface.json',
                                function(font) {
                                var gg=new THREE.TextGeometry(""+($this.checkersPosToString(pos)),{
                                    size: 0.2,
                                    height: 0.05,
                                    curveSegments: 6,
                                    font: font,

                                });
                                var gm=new THREE.MeshBasicMaterial();
                                var mesh= new THREE.Mesh( gg , gm );
                                _this.objectReady(mesh);
                            });
							return null;
						},
					},
				});
				xdv.createGadget("cell#"+pos, {
					"2d" : {
						type : "element",
						initialClasses: "xd-choice",
						width: SIZE,//*1.1,
						height: SIZE,//*1.1,
						z: 1,
					},/*
					"2d-wood-alquerque" : {
						type : "element",
						initialClasses: "xd-choice",
						width: SIZE*0.9,
						height: SIZE*0.9,
						z: 1,
					}, */
					"3d": {
						type: "meshfile",
						file : fullPath+"/res/xd-view/meshes/ring-target.js",
						flatShading: true,
						smooth : 0,
						z : 0,
						scale:[8/SWIDTH,8/SWIDTH,8/SWIDTH],
						materials: { 
							"square" : {
								transparent: true,
								opacity: 0,
							},
							"ring" : {
								color : 0xffffff,
								opacity: 1,
							}
						},							
					},
				});				
			})(pos);
		}
		function createTurtle(avatar,callback,type,who){
			var piecesParts=["turtle-legs-smoothed","turtle-head-smoothed","turtle-tail-smoothed","turtle-hotel","turtle-house"];
			
			var resCount=piecesParts.length;
			var parentObject;
			var childObjects=[];
			function checkLoaded(){
				if (--resCount==0){		
					for (var n=0 ; n < childObjects.length ; n++) parentObject.add(childObjects[n]);
					callback(parentObject);
				}
			}
			for(var p=0 ; p < piecesParts.length ; p++){
				var smooth=0;
				var shadow=false;
				var flatShading=false;
				var visible=true;
				if ((piecesParts[p]==="turtle-hotel") || (piecesParts[p]==="turtle-house")){
					smooth=0;
				} 
				if (piecesParts[p]==="turtle-hotel")
					visible=false;
				var url="smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/"+piecesParts[p]+".js";
				(function(p){
					avatar.getResource(url,function(geometry , materials){
					 	var materials0=[];
                        var tasks = 1;
                        function Done() {
                            if(--tasks==0) {
                                if(p==0){
                                    parentObject = new THREE.Mesh( geometry , new THREE.MultiMaterial( materials0 ) );
                                    parentObject.castShadow=true;
                                    parentObject.receiveShadow=shadow;
                                }
                                else{
                                    var mesh=new THREE.Mesh( geometry , new THREE.MultiMaterial( materials0 ) );
                                    mesh.castShadow=true;
                                    mesh.receiveShadow=shadow;
                                    mesh.visible=visible;
                                    mesh.title=piecesParts[p];
                                    childObjects.push(mesh);
                                }
                                checkLoaded();
                            }
                        }
 						for(var m=0;m<materials.length;m++){
                            (function(m) {
                                tasks++;
                                var mat=materials[m].clone();
                                if (mat.name==="mat.turtle")
                                    mat.emissive={r:0,g:0,b:0}; // mat.emissive={r:.7,g:.7,b:.7};
                                if ((mat.name==="mat.turtle")||(mat.name==="mat.buildings")){
                                    mat.shininess = 10;
                                    mat.specular={r:0,g:0,b:0};
                                    var matUrl;
                                    if (who==-1)
                                        matUrl = fullPath+"/res/xd-view/meshes/turtle-black.png";
                                    else
                                        matUrl = fullPath+"/res/xd-view/meshes/turtle.png";
                                    avatar.getMaterialMap(matUrl,function(matMap) {
                                        mat.map = matMap;
                                        if (mat.name==="mat.buildings")
                                            mat.shading=THREE.FlatShading;
                                        materials0[m] = mat;
                                        Done();
                                    });
                                } else {
                                    if (mat.name==="mat.buildings")
                                        mat.shading=THREE.FlatShading;
                                    materials0[m] = mat;
                                    Done();
                                }
                            })(m);
 						}
                        Done();
					});
				})(p);
			}
		}
		
		function CreatePiece(side,index) {
			var scaleFactor=1;
			xdv.createGadget("piece#"+index, {
				"2d" : {
					type : "sprite",
					z : 4,
					file : fullPath+"/res/images/basic-pieces-v2x200.png",
					clipx: 0,
					clipy: side==1?0:100,
					clipwidth: 100,
					clipheight: 100,
					width: SIZE,//*.9,
					height: SIZE,//*.9,
					opacity: 1,
				},
				"green":{
					file : fullPath+"/res/images/basic2.png",
				},
				"2d-wood-alquerque" : {
					type : "sprite",
					z : 4,
					file : fullPath+"/res/images/basic-alquerque2.png",
					clipx: 0,
					clipy: side==1?0:150,
					clipwidth: 150,
					clipheight: 150,
					width: SIZE*.9,
					height: SIZE*.9,
					opacity: 1,
				},
				"kids":{
					type : "sprite",
					z : 4,
					file : fullPath+"/res/images/pieces-kids200x200.png",
					clipx: 0,
					clipy: side==1?0:100,
					clipwidth: 100,
					clipheight: 100,
					width: SIZE*.9,
					height: SIZE*.9,
					opacity: 1,
				},
				"classic3d" : {
					type: "custommesh3d",
					create: function(callback){
						this._pKey="dummy";
						return $this.chMakeDummyMesh(xdv);
					},
					display: function(force,options,delay){
						var key="_"+options.checkersType+"_"+options.checkersSide+"_";
						if (key!=this._pKey){
							this._pKey=key;
							var avat=this;
							currentGame.chMakeTokenPiece(avat,options.checkersType,options.checkersSide,function(mesh){
								avat.replaceMesh(mesh,options,delay);
							});
						}
					},
					scale: [0.5*10/SWIDTH,0.5*10/SWIDTH,0.5*10/SWIDTH],
					z : CLASSIC3D_FLOOR_Z,			
				},
				"turkish3d":{
					type: "meshfile",
					scale: [1,1,1],
					smooth : 0,
					z : CLASSIC3D_FLOOR_Z,			
					materials: { 
						"base" : {
							color : side==1?CLASSIC_WHITE:CLASSIC_BLACK,
							shininess : side==1?10:20, //side==1?255:10,
							specular:side==1?{r:.5,g:.5,b:.5}:{r:.6,g:.3,b:0},
							reflectivity: 0.5,
							transparent: true,
							opacity: 1,
						}
					},
				},
				"alquerque3d":{
					type: "custommesh3d",
					scale: [scaleFactor,scaleFactor,scaleFactor],
					//opacity: opacity,
					create: function() {
						var shininess = 500, specular = 0x050505, bumpScale = 0.005, shading = THREE.SmoothShading, transparent=false, opacity=1;
						var sphereMaterial = new THREE.MeshPhongMaterial( {
							name: "ball",
							specular: specular,
							shininess: shininess,
							shading: shading,
							opacity: opacity,
							transparent: transparent,
							envMap: textureCube,
							reflectivity: 0.2,
							combine: THREE.MixOperation, 
						} );
						var geometry = sphereGeometry.clone();
						for (var i = 0; i < geometry.faces.length; i++) {
							geometry.faces[i].materialIndex = 0;
						}
						var sphere = new THREE.Mesh(geometry,new THREE.MultiMaterial( [sphereMaterial] ));
						return sphere;
					},					
				},
				"turtles3d" :{
					type : "custommesh3d",
					create: function(callback){
								createTurtle(this,callback,"pawn",side);
							},
					rotate: side==1?180:0,
					scale: [0.5,0.5,0.5],
					checkersType: 0,
					z : CLASSIC3D_FLOOR_Z,			
					display: function(force,options){
						if(this.object3d.children){
							for(var i=0;i<this.object3d.children.length;i++){
								var child=this.object3d.children[i];
								switch (child.title){
									default:
									break;
									case "turtle-hotel":
										child.joclyVisible=(options.checkersType==1 || (this.options.checkersType==1 && options.checkersType!==0));
									break;
									case "turtle-house":
										child.joclyVisible=(options.checkersType==0 || (this.options.checkersType==0 && options.checkersType!==1));
									break;
								}
							}
						}
					},
				},
			});			
		}
		function createFrame(avatar,cx,cy){
			
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
			var frameColor="#000000";
			if (avatar.options.frameColorFill) frameColor=avatar.options.frameColorFill;
			frameMat = new THREE.MeshPhongMaterial({
				color: frameColor,
				shininess: 500,
				specular: '#444444',
				//ambient: '#000000',
			});
			var frameObj = new THREE.Mesh( frameGeo , frameMat);
			frameObj.position.y=-extrudeSettings.amount-.01;
			return frameObj;
		}

		function createGridBoard(avatar,callback, notations, viewAs){
	
			var parent=new THREE.Object3D();	
			var TEXTURE_CANVAS_SZ=1024;
			
			var canvasDiffuse=document.createElement('canvas');
			canvasDiffuse.width=canvasDiffuse.height=TEXTURE_CANVAS_SZ;
			var textureDiff =  new THREE.Texture(canvasDiffuse);					
			var canvasBump=document.createElement('canvas');
			canvasBump.width=canvasBump.height=TEXTURE_CANVAS_SZ;
			var textureBump =  new THREE.Texture(canvasBump);
			var margin=5; //prct
			if (avatar.options.margin!==undefined) margin=avatar.options.margin;
			
			
			function paintNotations(ctx,cellCx,cellCy,fillStyle){
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = fillStyle;
				ctx.font = Math.ceil(cellCx / 5) + 'px Monospace';
				for(var pos=0; pos<$this.g.Coord.length;pos++){
					var rcCoord=$this.g.Coord[pos];
					//var rcCoord=$this.getCCoord(pos);
					var r=rcCoord[0];
					var c=$this.g.getColumn(rcCoord[1],r);
					if ($this.mViewAs>0) r=HEIGHT-1-r;
					if ($this.mViewAs<0) c=SWIDTH-1-c;
					var text=$this.checkersPosToString(pos);
					var x = (c+(1-SWIDTH)/2)*cellCx-cellCx / 3;
					var y = (r+(1-HEIGHT)/2)*cellCy-cellCy / 3;
					ctx.fillText(text,x,y);
				}
			}
			
			avatar.getResource("image|"+fullPath+"/res/images/wood-chipboard-5.jpg",function(img){
					
				
				var blackColor="rgba(159, 76, 12,0.2)";
				var whiteColor="rgba(246, 222, 174,0.5)"
				
				if (avatar.options.blackCellFill!==undefined) blackColor=avatar.options.blackCellFill;
				if (avatar.options.whiteCellFill!==undefined) whiteColor=avatar.options.whiteCellFill;
				// create board floor
				var ctx=canvasDiffuse.getContext("2d");
				ctx.translate(TEXTURE_CANVAS_SZ/2,TEXTURE_CANVAS_SZ/2);
				ctx.drawImage(img,-TEXTURE_CANVAS_SZ/2,-TEXTURE_CANVAS_SZ/2,TEXTURE_CANVAS_SZ,TEXTURE_CANVAS_SZ);
				//TEXTURE_CANVAS_SZ=(1+2*margin/100)*SWIDTH*cellCx
				
				function drawCell(ctx,fillStyle,xCenter,yCenter,cx,cy){
					ctx.fillStyle=fillStyle;
					ctx.fillRect(xCenter-cx/2,yCenter-cy/2,cx,cy);
				}
				function drawLines(ctx){
					ctx.strokeStyle="#000000";
					ctx.lineWidth="2";
					for(var r=0;r<HEIGHT;r++){
						ctx.beginPath();
						ctx.moveTo((-SWIDTH/2)*cellCx,(-HEIGHT/2+r)*cellCy);
						ctx.lineTo((SWIDTH/2)*cellCx,(-HEIGHT/2+r)*cellCy);
						ctx.stroke();
					}
					for(var c=0;c<SWIDTH;c++) {
						ctx.beginPath();
						ctx.moveTo((-SWIDTH/2+c)*cellCx,(-HEIGHT/2)*cellCy);
						ctx.lineTo((-SWIDTH/2+c)*cellCx,(HEIGHT/2)*cellCy);
						ctx.stroke();
					}
					ctx.lineWidth="4";
					ctx.beginPath();
					ctx.moveTo((-SWIDTH/2)*cellCx,(-HEIGHT/2)*cellCy);
					ctx.lineTo((SWIDTH/2)*cellCx,(-HEIGHT/2)*cellCy);
					ctx.lineTo((SWIDTH/2)*cellCx,(HEIGHT/2)*cellCy);
					ctx.lineTo((-SWIDTH/2)*cellCx,(HEIGHT/2)*cellCy);
					ctx.lineTo((-SWIDTH/2)*cellCx,(-HEIGHT/2)*cellCy);
					ctx.stroke();
				}
				
				// pre paint with black fill color
				ctx.fillStyle=blackColor;
				ctx.fillRect(-TEXTURE_CANVAS_SZ/2,-TEXTURE_CANVAS_SZ/2,TEXTURE_CANVAS_SZ,TEXTURE_CANVAS_SZ);
				// paint diffuse cells
				var cellCx=TEXTURE_CANVAS_SZ/(SWIDTH*(1+2*margin/100));
				var cellCy=TEXTURE_CANVAS_SZ/(HEIGHT*(1+2*margin/100));
				for(var r=0;r<HEIGHT;r++)
					for(var c=0;c<SWIDTH;c++) {
						(function(r,c){
							var i=r+c;
							drawCell(ctx,i%2?blackColor:whiteColor,(c+(1-SWIDTH)/2)*cellCx,(r+(1-HEIGHT)/2)*cellCy,cellCx,cellCy);
						})(r,c);
					}
				// paint diffuse lines
				drawLines(ctx);
				var notationColor=whiteColor;
				if (avatar.options.notationColor!==undefined) notationColor=avatar.options.notationColor;
				if (notations) 
					paintNotations(ctx,cellCx,cellCy,notationColor);
				
				
				// paint bump white + lines
				var ctxBump=canvasBump.getContext("2d");
				ctxBump.translate(TEXTURE_CANVAS_SZ/2,TEXTURE_CANVAS_SZ/2);
				ctxBump.fillStyle="#ffffff";
				ctxBump.fillRect(-TEXTURE_CANVAS_SZ/2,-TEXTURE_CANVAS_SZ/2,TEXTURE_CANVAS_SZ,TEXTURE_CANVAS_SZ);
				drawLines(ctxBump);
				if (notations) 
					paintNotations(ctxBump,cellCx,cellCy,"#000000");

				
				textureDiff.needsUpdate=true;
				textureBump.needsUpdate=true;
				
				var bsp="#010101";
				if (avatar.options.boardSpecular!==undefined) bsp=avatar.options.boardSpecular;
				
				var geo=new THREE.PlaneGeometry((1+2*margin/100)*SWIDTH*SIZE/1000,(1+2*margin/100)*HEIGHT*SIZE/1000);
				var mesh=new THREE.Mesh(geo, new THREE.MeshPhongMaterial({map:textureDiff,bumpMap:textureBump,bumpScale:0.005,specular:bsp,shininess:400}));
				mesh.rotation.x=-Math.PI/2;	
				mesh.receiveShadow=true;
				parent.add(mesh);								

	
				// add border frame
				var cx=(1+2*margin/100)*SWIDTH*SIZE/1000;
				var cy=(1+2*margin/100)*HEIGHT*SIZE/1000;
				var frameObj = createFrame(avatar,cx,cy);
				parent.add(frameObj);
				
						
				callback(parent);
			});			
		}

		function createLewebBoard(avatar,callback){
			var webGeo=new THREE.IcosahedronGeometry(15,3);
			var webMat=new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: true, shininess:30, abient:0x333333, specular:0x0088ff});
			
			if (leweblook=="flat"){
				var delta=10;
				for (var i =0 ; i < webGeo.vertices.length; i++){
					webGeo.vertices[i].add(new THREE.Vector3(-delta/2+Math.random()*delta,-delta/2+Math.random()*delta,0));
				}	
			}
			
			var mesh=new THREE.Mesh(webGeo,webMat);
			callback(mesh);
		}
		if(this.mInitial) {
			for(var i=0;i<this.mInitial.pieces.length;i++) {
				var piece=this.mInitial.pieces[i];
				CreatePiece(piece.s,i);
			}
			PCOUNT=0;
			for(var i in INITIAL.a)
				if(INITIAL.a.hasOwnProperty(i))
					PCOUNT++;
			for(var i in INITIAL.b)
				if(INITIAL.b.hasOwnProperty(i))
					PCOUNT++;
		} else {
			var index=0;
			for(var i in INITIAL.a)
				if(INITIAL.a.hasOwnProperty(i))
					CreatePiece(JocGame.PLAYER_A,index++);
			for(var i in INITIAL.b)
				if(INITIAL.b.hasOwnProperty(i))
					CreatePiece(JocGame.PLAYER_B,index++);
			PCOUNT=INITIAL.a.length+INITIAL.b.length;
		}

		function createAlquerqueBoard(avatar,callback){
			var piecesParts=["board-alquerque-external-frame","board-checkers-triangle","board-checkers-slot"];
			var metalMat=new THREE.MeshPhongMaterial({color: 0x222222, shininess:10, specular:0x444444});			
			var resCount=piecesParts.length;
			var parentObject;
			var childObjects=[];
			function checkLoaded(){
				if (--resCount==0){		
					for (var n=0 ; n < childObjects.length ; n++) parentObject.add(childObjects[n]);
					callback(parentObject);
				}
			}
			
			for(var p=0 ; p < piecesParts.length ; p++){
				var smooth=0;
				var shadow=true;
				var flatShading=false;
				var visible=true;
				if (piecesParts[p]=="board-checkers-slot")
					smooth=0;
				var url="smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/"+piecesParts[p]+".js";
				(function(p){
					avatar.getResource(url,function(geometry , materials){
					 	var materials0=[];
 						for(var m=0;m<materials.length;m++){
 							var mat=materials[m].clone();
 							if (mat.name != "mat.slot") mat.shading=THREE.FlatShading;
 							materials0.push(mat);
 						}

						if(p==0){
							materials0[0].specular={r:0,g:0,b:0};
							parentObject = new THREE.Mesh( geometry , new THREE.MultiMaterial( materials0 ) );
							margin=-4;
							var cx=(1+2*margin/100)*SWIDTH*SIZE/1000;
							var cy=(1+2*margin/100)*HEIGHT*SIZE/1000;
							var frameObj = createFrame(avatar,cx,cy);
							frameObj.position.y+=.2;
							frameObj.scale.y*=1.2;
							parentObject.add(frameObj);
							parentObject.receiveShadow=true;
							
						}
						else{
							var b3dSize=2; // cell size in blender
							materials0[0].shininess = 500;
							materials0[0].specular.setHex(0x020202);
							switch(piecesParts[p]) {
								case "board-checkers-triangle":
								{
									var flowersPos=[{x:1,y:1},{x:1,y:-1},{x:-1,y:-1},{x:-1,y:1}];
									var bcolors=[0x001144,0x220000];
									for (var i=0 ; i < 4 ; i++){
										for (var j=0 ; j < 4 ; j++){
											for (var k=0 ; k < 2 ; k++){
												//materials0[0].ambiant=0xff0000;
												var mesh;
												if (k==0) 
													mesh = new THREE.Mesh( geometry , new THREE.MultiMaterial( materials0 ) );
												else
													mesh = new THREE.Mesh( geometry , metalMat);
												mesh.receiveShadow=shadow;
												mesh.position.x=b3dSize*flowersPos[i].x;
												mesh.position.z=b3dSize*flowersPos[i].y;
												mesh.rotation.y=Math.PI/2*j;
												if (k>0){
													mesh.rotation.x=Math.PI;
													mesh.position.y=0.28;
												}
												childObjects.push(mesh);
											}
										}
									}
								}
								break;
								case "board-checkers-slot": 
								{
									for (var r=0 ; r < 5 ; r++){
										for (var c=0 ; c < 5 ; c++){
											var mesh=new THREE.Mesh( geometry , metalMat); //new THREE.MultiMaterial( materials0 ) );
											mesh.receiveShadow=shadow;
											mesh.position.x=b3dSize*(c-2);
											mesh.position.z=b3dSize*(r-2);
											childObjects.push(mesh);
										}
									}								
								}
								break;
								default:
								{
									var mesh=new THREE.Mesh( geometry , new THREE.MultiMaterial( materials0 ) );
									mesh.receiveShadow=shadow;
									mesh.title=piecesParts[p];
									childObjects.push(mesh);
								}
								break;
							}
						}
						checkLoaded();
					});
				})(p);
			}
		}
		
		var turkishBoardOptions= {
			blackCellFill:"rgba(140, 41, 41,0.4)",
			whiteCellFill:"rgba(140, 41, 41,0.4)",
			notationColor:"#000000",
		};
		var turtlesBoardOptions={
			blackCellFill:"rgba(0,100,0,0.5)",
			whiteCellFill:"rgba(255,255,255,1)",
			frameColorFill:"#ffffff",
			boardSpecular:"#000000",
			margin:10,
		}

		xdv.createGadget("boardframeNotations", {
			"3d": {
				type: "custommesh3d",
				create: function(callback){
					createGridBoard(this,callback,true,1);
				}
			},
			"turkish3d": turkishBoardOptions,
			"turtles3d": turtlesBoardOptions,
		});
		xdv.createGadget("boardframeNotationsB", {
			"3d": {
				type: "custommesh3d",
				create: function(callback){
					createGridBoard(this,callback,true,-1);
				}
			},
			"turkish3d": turkishBoardOptions,
			"turtles3d": turtlesBoardOptions,
		});
		xdv.createGadget("boardframeB", {
			"3d": {
				type: "custommesh3d",
				create: function(callback){
					createGridBoard(this,callback,false,-1);
				}
			},
			"turkish3d": turkishBoardOptions,
			"turtles3d": turtlesBoardOptions,
		});
	
		xdv.createGadget("boardframe", {
			"3d": {
				type: "custommesh3d",
				create: function(callback){
					createGridBoard(this,callback,false,1);
				},	
			},
			"turkish3d": turkishBoardOptions,
			"turtles3d": turtlesBoardOptions,
			"alquerque3d":{
				type : "custommesh3d",
				create: function(callback){
					createAlquerqueBoard(this,callback);
				},
				scale: [1.2,1.2,1.2],
				checkersType: 0,
				z : -320,
			},
		});
		
		xdv.createGadget("turtlesworld", {
			"turtles3d":{
                harbor: false,
				type : "custommesh3d",
				color: 0x668800,
				z:-850,
				create: function() {
					var $this=this;
					var smooth=0;
					var gg=new THREE.CylinderGeometry(150,150,1, 64, 1, false);					
					var gm=new THREE.MeshPhongMaterial( { color: 0xff0000 /*, ambient : 0x000000 */} );
					var board = new THREE.Mesh( gg , gm );
					board.receiveShadow=true;
					
					this.getResource("smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/rainbowflat.js",function(geometry , materials) {
						
						materials[0].transparent=true;
						materials[0].opacity=.8;
						materials[0].side = THREE.DoubleSide;
						materials[0].shininess = 10;
						materials[0].specular.setHex(0x222222);
						
						var rainbow = new THREE.Mesh( geometry , new THREE.MultiMaterial( materials ) );
						rainbow.scale.set(7,7,7);
						rainbow.position.set(7,0,-7);
						rainbow.rotation.y=-45;
						board.add(rainbow);
						$this.objectReady(board);
					});
					return null;
				},
			}
		});
		
		xdv.createGadget("flowers", {
			"turtles3d" : {
                harbor: false,
				type : "custommesh3d",		
				create: function() {
					var $this=this;
					var container=new THREE.Object3D();
					var catCount=1;
										
					var texPath = fullPath + "/res/xd-view/meshes/star.png" ;
					
					var textureLoader = new THREE.TextureLoader();
					textureLoader.setCrossOrigin("anonymous");
					textureLoader.load(texPath,
							function(texture){		
								var starSprite = texture ; 
								for(var i=0;i<catCount;i++) {
									var material = new THREE.PointsMaterial( { size: 0.5, map: starSprite, blending: THREE.NormalBlending,  depthTest: true, transparent : true } );
									var geometry = new THREE.Geometry();
									for(var i=0;i<1000;i++) {
										var vertex = new THREE.Vector3();
										var r=12+Math.random()*40;
										var a=Math.random()*2*Math.PI;
										vertex.x = r*Math.cos(a);
										vertex.z = r*Math.sin(a);
										vertex.y = 0.2;
										geometry.vertices.push( vertex );
									}
									material.color.setHex( 0xffffff );
									var particles = new THREE.Points( geometry, material);
									
									container.add(particles)
								}
								$this.objectReady(container);
							},
							// Function called when download progresses
							function ( xhr ) {
								console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
							},
							// Function called when download errors
							function ( xhr ) {
								console.log( 'An error happened' );
							}
						);
					return null;
				},
			}
		});
		xdv.createGadget("rocks", {
			"turtles3d" : {
                harbor: false,
				type: "custommesh3d",
				z: -200,
				scale: [1,1,1],
				flatShading: true,
				create: function() {					
					var $this=this;
					this.getResource("smoothedfilegeo|"+0+"|"+fullPath+"/res/xd-view/meshes/rocksmoothed.js",function(geometry , materials) {
						var rocks=new THREE.Object3D();
						for (var i=0;i<100;i++){
							var rock=new THREE.Mesh(geometry,new THREE.MultiMaterial( materials ));
							var r=20+Math.random()*40;
							var a=Math.random()*2*Math.PI;
							var sz=0.3+Math.random()*2;
							rock.scale.set(sz,sz,sz);
							rock.position.x = r*Math.cos(a);
							rock.position.z = r*Math.sin(a);
							rock.rotation.y=Math.random()*2*Math.PI;
							rock.castShadow=true;
							rocks.add(rock);
						}
						
						$this.objectReady(rocks);
					});
					return null;
				},
			}
		});
		xdv.createGadget("fences", {
			"turtles3d" : {
                harbor: false,
				type: "custommesh3d",
				z: -200,
				scale: [2,2,2],
				flatShading: true,
				create: function() {					
					var $this=this;
					this.getResource("smoothedfilegeo|"+0+"|"+fullPath+"/res/xd-view/meshes/turtle-fences.js",function(geometry , materials) {
					
						var fenceMat = new THREE.MeshPhongMaterial({color : 0xffffff , specular:0x222222 , shininess:100, shading:THREE.FlatShading});
						
						var fences=new THREE.Mesh(geometry,fenceMat);
						for (var i=0;i<3;i++){
							var fence=new THREE.Mesh(geometry,fenceMat);
							fence.rotation.y=(i+1)*(Math.PI/2);
							fence.castShadow=true;
							fences.add(fence);
						}
						
						$this.objectReady(fences);
					});
					return null;
				},
			}
		});
		for(var r=0;r<HEIGHT;r++)
			for(var c=0;c<SWIDTH;c++) {
				var i=r*SWIDTH+c;
				xdv.createGadget("square#"+i, {
					"2d" : {
						type : "element",
						z : 2,
						classes : "",
					},
					"3d":{	
						receiveShadow:true,
					},
				});
				xdv.saveGadgetProps("square#"+i,["color"],"initial");
			}
		
		function createScreen(videoTexture) {
			var $this=this;
			var smooth=0;
			this.getResource("smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/flatscreen.js",function(geometry , materials) {
 				var materials0=[];
 				
 				for(var i=0;i<materials.length;i++){
                    if (materials[i].name=="screen"){
	 					var mat=materials[i].clone();
 						mat.map=videoTexture;
 						mat.emissive={r:1,g:1,b:1},
 						mat.overdraw = true;
 						//mat.side = THREE.DoubleSide;
 						materials0.push(mat);
                    }else if (materials[i].name=="boomer"){
	 					var mat=materials[i].clone();
	 					mat.shading=THREE.FlatShading;
	 					materials0.push(mat);
                    }else if (materials[i].name=="tv"){
	 					var mat=materials[i].clone();
	 					mat.shading=THREE.FlatShading;
	 					materials0.push(mat);
 					}else{
 						materials0.push(materials[i]);
 					}
 				}
 				var mesh = new THREE.Mesh( geometry , new THREE.MultiMaterial( materials0 ) );
 				
 				mesh.visible = false;
 				$this.objectReady(mesh);
			});
			return null;
		};
		
		xdv.createGadget("videoa",{
			"3d": {
				type : "video3d",
				makeMesh: function(videoTexture){
					createScreen.call(this,videoTexture);
				},
			},
		});
		xdv.createGadget("videob",{
			"3d": {
				type : "video3d",
				makeMesh: function(videoTexture){
					createScreen.call(this,videoTexture);
				},
			},
		});
		
		this.xdInitExtra(xdv);
	}
	
	View.Game.xdBuildScene = function(xdv) {
		
		currentGame=this;
		var $this=this;
		
		xdv.updateGadget("fences",{
			"turtles3d": {
				visible: true,
			},
		});
		xdv.updateGadget("rocks",{
			"turtles3d": {
				visible: true,
			},
		});
		xdv.updateGadget("flowers",{
			"turtles3d": {
				visible: true,
			},
		});
		xdv.updateGadget("turtlesworld",{
			"turtles3d": {
				visible: true,
			},
		});

		var screenZoom=2;
		xdv.updateGadget("videoa",{
			"3d": {
				visible: true,
				scale:[screenZoom,screenZoom,screenZoom],
				rotate: this.mViewAs==1?180:0,
				rotateX: this.mViewAs==1?30:-30,
				z: 3000,
				y: this.mViewAs==1?12000:-12000,
				playerSide: 1,
			},
		});

		xdv.updateGadget("videob",{
			"3d": {
				visible: true,
				scale:[screenZoom,screenZoom,screenZoom],
				rotate: this.mViewAs==1?0:180,
				rotateX: this.mViewAs==1?-30:30,
				z: 3000,
				y: this.mViewAs==1?-12000:12000,
				playerSide: -1,
			},
		});

		xdv.updateGadget("board",{
			"2d": {
				visible: true,
				rotate: this.mViewAs==JocGame.PLAYER_A?0:180,
				x: 0,
				y: 0,
				width: SWIDTH*SIZE,
				height: HEIGHT*SIZE,
			},
		});
		
		xdv.updateGadget("boardframe",{
			"3d": {
				visible: !this.mNotation && (this.mViewAs>0),
			},
			"alquerque3d":{
				visible: true,
			}
		});
		xdv.updateGadget("boardframeNotations",{
			"3d": {
				visible: this.mNotation && (this.mViewAs>0),
			},
			"alquerque3d":{
				visible: false,
			}
		});
		xdv.updateGadget("boardframeB",{
			"3d": {
				visible: !this.mNotation && (this.mViewAs<0),
			},
			"alquerque3d":{
				visible: false,
			}
		});
		xdv.updateGadget("boardframeNotationsB",{
			"3d": {
				visible: this.mNotation && (this.mViewAs<0),
			},
			"alquerque3d":{
				visible: false,
			}
		});

		xdv.updateGadget("lightside",{
			"3d": {
				visible: true,
			},
		});
		xdv.updateGadget("lightback",{
			"3d": {
				visible: true,
			},
		});
		/*xdv.updateGadget("skyball",{
			"3d": {
				visible: true,
			},
		});*/
		
		for(var r=0;r<HEIGHT;r++)
			for(var c=0;c<SWIDTH;c++) {
			var i=r*SWIDTH+c;
			var black=(r+c)%2;
			var coord=this.getVCoord(r,c);
			xdv.updateGadget("square#"+i, {
				base : {
					x : coord[0],
					y : coord[1],
				},
				"2d" : {
					initialClasses : black?"cell-black":"cell-white",
					width : SIZE,
					height : SIZE,					
				},
				"3d" : {
					visible: true,
					scale: [1,1,1],
				},
			});			
		}
		for(var pos=0;pos<this.g.Coord.length;pos++) {
			var coord=this.getCCoord(pos);
			xdv.updateGadget("text#"+pos, {
				base : {
					visible: this.mNotation,
				},
				"2d" : {
					x: coord[0]-SIZE*.42,
					y: coord[1]-SIZE*.42,
				},
				"3d" : {
					x: coord[0]-SIZE*.47,
					y: coord[1]+SIZE*.47,
				},
				"alquerque3d" : {
					z: SIZE*.02,
				},
				"turtles3d" : {
					z: SIZE*.02,
				}
			});
			xdv.updateGadget("cell#"+pos,{
				base: {
					visible: false,
					x: coord[0],
					y: coord[1],
				}
			});
		}
	}
	
	View.Game.getVCoord = function() {
		var r,c;
		if(arguments.length==1) {
			var pos=arguments[0];
			var rcCoord=this.g.Coord[pos];
			r=rcCoord[0];
			c=rcCoord[1];
		} else {
			r=arguments[0];
			c=arguments[1];
		}
		r=HEIGHT-1-r;
		if (this.mViewAs == JocGame.PLAYER_B) {
			r=HEIGHT-1-r;
			c=SWIDTH-1-c;
		}
		var vx=(c-(SWIDTH-1)/2)*SIZE;
		var vy=(r-(HEIGHT-1)/2)*SIZE;
		return [vx,vy];
	}
	
	View.Game.getCCoord=function(pos) {
		var rcCoord=this.g.Coord[pos];
		var r=rcCoord[0];
		var c=this.g.getColumn(rcCoord[1],r);
		return this.getVCoord(r,c);
	}

	View.Board.xdDisplay = function(xdv, aGame) {
		for(var i=0;i<this.pieces.length;i++) {
			var piece=this.pieces[i];
			if(!piece)
				xdv.updateGadget("piece#"+i,{
					base : {
						visible: false,
					},
				});
			else {
				var coord=aGame.getCCoord(piece.p);
				xdv.updateGadget("piece#"+i,{
					base : {
						visible: true,
						x: coord[0],
						y: coord[1],
					},
					"2d" : {
						clipx: piece.t==0?0:100,
						clipy: piece.s==1?0:100,
						opacity : 1,						
					},
					"2d-wood-alquerque" : {
						clipy: piece.s==1?0:150,
						clipx: piece.t==0?0:150,
					},
					"kids":{
						clipy: piece.s==1?0:100,
					},
					"3d" : {					
						checkersType: piece.t,
						checkersSide: piece.s,
					},
					"classic3d":{
						z: CLASSIC3D_FLOOR_Z,
					},
					"alquerque3d" : {
						z : SIZE*0.3,
						scale : [ SIZE * .0003, SIZE * .0003, SIZE * .0003 ],
						materials: {
							"ball": {
								map: aGame.mViewOptions.fullPath+"/res/xd-view/meshes/"+(piece.s===JocGame.PLAYER_A?"red":"black")+(piece.t==0?"":"-king")+".png",
								reflectivity: (piece.s===JocGame.PLAYER_A)?0.6:0.6, // reflexivities[this.board[pos]],
								opacity: 1,
							},
						},
					},
					"turkish3d": {
						scale : [ SIZE * .0003, SIZE * .0003, SIZE * .0003 ],
						//file : aGame.mViewOptions.fullPath+"/res/xd-view/meshes/turkish-piece"+(piece.t==0?"":"-queen")+".js",
						file : aGame.mViewOptions.fullPath+"/res/xd-view/meshes/turkish"+(piece.t==0?"":"-queen")+".js",
						z: CLASSIC3D_FLOOR_Z,
						materials: { 
							"base" : {
								opacity: 1,
							}, 
						},
					},
					"turtles3d": {
						scale : [ SIZE * .0003, SIZE * .0003, SIZE * .0003 ],
						z : CLASSIC3D_FLOOR_Z,			
						checkersType: piece.t,
						rotate: 
							this.CheckersAngle(aGame,piece,piece.plp,piece.p),
					}
					
				});
			}
		}
		for(var i=this.pieces.length;i<PCOUNT;i++)
			xdv.updateGadget("piece#"+i,{
				base : {
					visible: false,
				}
			});
		xdv.updateGadget("boardframe", {
			"3d": {			
				materials: { 
					"playera" : {
						color : aGame.mViewAs==JocGame.PLAYER_A?CLASSIC_WHITE:CLASSIC_BLACK,
					}, 
					"playerb" : {
						color : aGame.mViewAs==JocGame.PLAYER_B?CLASSIC_WHITE:CLASSIC_BLACK,
					}
				},
			},
			"turkish3d":{
				materials: { 
					"mainframe" : {
						color : 0x111111,
					},
				},
			},
			"turtles3d":{
				materials: { 
					"mainframe" : {
						color : 0x55ff88,
					},
				},
			},
		});
		xdv.updateGadget("videoa", {
			"3d": {			
				materials: { 
					"tv" : {
						color : CLASSIC_WHITE,
					}, 
				},
			},
		});
		xdv.updateGadget("videob", {
			"3d": {			
				materials: { 
					"tv" : {
						color : CLASSIC_BLACK,
					}, 
				},
			},
		});
	}
	
	View.Board.xdInput = function(xdv, aGame) {
		return {
			initial: {
				pos: [],
			},
			getActions: function(moves,currentInput) {
				var actions={};
				var actionIndex=currentInput.pos.length;
				moves.forEach(function(move) {
					if(actionIndex>=move.pos.length)
						return;
					var matching=true;
					currentInput.pos.forEach(function(pos,index) {
						if(move.pos[index]!=pos)
							matching=false;
					});
					if(!matching)
						return;
					var pos1=move.pos[actionIndex];
					var action=actions[pos1];
					if(action===undefined) {
						var pieceIndex1;
						if(actionIndex>0)
							pieceIndex1=this.board[move.pos[0]];
						else
							pieceIndex1=this.board[pos1]<0?null:this.board[pos1];
						var widgets=["cell#"+pos1];
						if(pieceIndex1!=null)
							widgets.push("piece#"+pieceIndex1);
						action=actions[pos1]={
							moves: [],
							view: ["cell#"+pos1],
							click: widgets,
							highlight: function(mode) {
								xdv.updateGadget("cell#"+pos1,{
									"2d": {
										classes: mode=="cancel"?"xd-cancel":"xd-choice-view",
										opacity: aGame.mShowMoves || mode=="cancel"?.5:0,
									},
									"3d": {
										materials: { 
											"ring" : {
												color : mode=="cancel"?0xff4400:0xffffff,
												opacity: aGame.mShowMoves || mode=="cancel"?1:0,
												transparent: aGame.mShowMoves || mode=="cancel"?false:true,
											}
										},	
										castShadow: aGame.mShowMoves || mode=="cancel",
									},
								});
							},
							unhighlight: function() {
							},
							validate: {
								pos: currentInput.pos.concat([pos1]),
							},
							execute: function(callback) {
								if(actionIndex==0) {
									callback();
									return;
								}
								var captPiece=move.capt[actionIndex]!=null?this.board[move.capt[actionIndex]]:null;
								this.checkersAnimateMove(xdv,aGame,
										this.board[currentInput.pos[0]],
										move.pos[actionIndex],
										captPiece,function() {
									callback();
								});
							},
							unexecute: function() {
								var pieceIndex=this.board[move.pos[0]];
								var coord=aGame.getCCoord(move.pos[actionIndex]);
								xdv.updateGadget("piece#"+pieceIndex,{
									base: {
										x: coord[0],
										y: coord[1],
									},
								});								
								var captPiece=move.capt[actionIndex]!=null?this.board[move.capt[actionIndex]]:null;
								if(captPiece!=null)
									xdv.updateGadget("piece#"+captPiece,{
										"2d": {
											opacity : 1,
										},
										"3d" : {
											materials: { 
												"base" : {
													opacity: 1,
												}, 
												"queen" : {
													opacity: 1,
												}
											},
										},
									});
							},
						}
					}
					action.moves.push(move);
				},this);
				return actions;
			},
		}
	}
	
	View.Board.checkersAnimateMove = function(xdv, aGame, pieceIndex, pos, captPiece, callback) {
		if(captPiece===null) aGame.PlaySound("move"+(1+Math.floor(Math.random()*4)));
		var animCount=1;
		var duration=400;
		function EndAnim() {
			if(captPiece!==null) aGame.PlaySound("tac"+(1+Math.floor(Math.random()*3)));
			animCount--;
			if(animCount==0) {
				xdv.updateGadget("piece#"+pieceIndex,{ "3d": {	positionEasingUpdate: null,	}});
				callback();
			}
		}
		var coord=aGame.getCCoord(pos);
		var z0=CLASSIC3D_FLOOR_Z,z1=SIZE;
		var a=-4*(z1-0);
		var fromPos=captPiece!==null?this.pieces[captPiece].p:this.pieces[pieceIndex].p;
		xdv.updateGadget("piece#"+pieceIndex,{
			base: {
				x: coord[0],
				y: coord[1],
			},
			"3d": {
				positionEasingUpdate: function(ratio) {
					if(captPiece!==null)
						this.object3d.position.y=(a*ratio*ratio-a*ratio+z0)*this.SCALE3D;
				},
			},
			"alquerque3d": {
				positionEasingUpdate: function(ratio) {
					z0=SIZE*0.3;
					if(captPiece!==null)
						this.object3d.position.y=(a*ratio*ratio-a*ratio+z0)*this.SCALE3D;
				},
			},
			"turtles3d": {
				rotate: this.CheckersAngle(aGame,this.pieces[pieceIndex],fromPos,pos),
			},
		},duration,EndAnim);
		if(captPiece!==null) {
			animCount++;
			var coord1=aGame.getCCoord(this.pieces[captPiece].p);
			xdv.updateGadget("piece#"+captPiece,{
				"2d": {
					opacity : 0.3,
				},
				"3d" : {
					materials: { 
						"base" : {
							opacity: .3,
						}, 
						"queen" : {
							opacity: .3,
						}
					},
				},
			},duration,EndAnim);
		}

	}
	
	View.Board.checkersVanishCapts = function(xdv, aGame, capts, callback) {
		var animCount=0;
		function EndAnim() {
			animCount--;
			if(animCount==0)
				callback();
		}
		for(var capt in capts) 
			if(capts.hasOwnProperty(capt)) {
				animCount++;
				xdv.updateGadget("piece#"+capt,{
					"2d": {
						opacity: 0,
					},
					"3d": {
						z: - SIZE*.24,
					},
					"turkish3d": {
						z: - SIZE,
					},
					"kids3d": {
						z: - SIZE*.5,
					},
				},500,EndAnim);
			}
		if(animCount==0)
			callback();
	}
	
	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		var $this=this;
		var board=aGame.mOldBoard;
		var pieceIndex=board.board[aMove.pos[0]];
		var capts={};
		var index=1;
		function Animate() {
			var captPiece=null;
			var capture=aMove.capt[index];
			if(capture!==null) {
				captPiece=board.board[capture];
				capts[captPiece]=true;
				haveCapts=true;
			}
			board.checkersAnimateMove(xdv,aGame,pieceIndex,aMove.pos[index],captPiece, function() {
				index++;
				if(index==aMove.pos.length)
					$this.checkersVanishCapts(xdv,aGame,capts,function() {
						if(board.pieces[board.board[aMove.pos[0]]].t==0) {
							var r=aGame.g.Coord[aMove.pos[aMove.pos.length-1]][0];
							if(($this.mWho==1 && r==HEIGHT-1) || ($this.mWho==-1 && r==0))
								aGame.PlaySound("promo");
						}
						aGame.MoveShown();
					});
				else
					Animate();
			});
		}
		Animate();
		return false;
	}
	
	View.Board.CheckersAngle = function(aGame,piece,from,to) {
		var $this=this;
		if(from!=to) {
			var angle;
			aGame.CheckersEachDirection(from,function(pos,dir) {
				while(pos!==null) {
					if(pos==to) {
						switch(dir)  {
						case 0:
							angle=135;
							break;
						case 2:
							angle=45;
							break;
						case 3:
							angle=-45;
							break;
						case 1:
							angle=-135;
							break;
						default:
							angle=aGame.mViewAs==piece.s?180:0
						}
						return false;
					}
					pos=aGame.g.Graph[pos][dir];
				}
				return true;
			});
			if(angle!==undefined)
				return aGame.mViewAs==1?angle:angle+180;
		}
		return aGame.mViewAs==piece.s?180:0;
	}
	
})();

