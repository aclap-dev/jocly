/*
 *
 * Copyright (c) 2013 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

(function() {

	var WIDTH, HEIGHT, SIZE, PCOUNT, SWIDTH;
	var CLASSIC_WHITE = 0xbbaa99;
	var CLASSIC_BLACK = 0x222222;
	
	View.Game.xdInitExtra = function(xdv) {
	}

	View.Game.xdPreInit = function(xdv) {
	}
	// useful to initialize pieces and board while the real meshes aren't loaded yet
	View.Game.millsMakeDummyMesh = function(xdv) {
		if(typeof THREE != "undefined")
		    return new THREE.Mesh( new THREE.CubeGeometry( .001,.001,.001 ), 
					      new THREE.MeshLambertMaterial() );
		else
			return null;
	}
	
	var currentGame;	
	var pieces = {};
	
	View.Game.millsMakeTokenPiece = function(avatar,who,callback) {
		
		var fullPath=this.mViewOptions.fullPath;
		
		function loadResources(who,callback){
			var bumpMap;
			var diffuseMap;
			var pieceGeo;
			var nbRes=3;
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
					
					
					var specular="#222222",shininess=20;
					if (who<0) {
						specular="#333333";
						shininess=10;
					}
					var mattop=new THREE.MeshPhongMaterial({name:"piecetop",
						specular:specular,
						shininess:shininess,
						map:textureDiff,
						bumpMap:textureBump,
						bumpScale:0.03
						});
					var matborder=new THREE.MeshPhongMaterial({name:"pieceborders",
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
		}
				
				
		var key="_"+who+"_";
			
		var piece=pieces[key];
		if(Array.isArray(piece))
			piece.push(callback);
		else if(!piece) {
			pieces[key] = [ callback ];
			loadResources(who,function(resources) {
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
			
		var $this = this;
		this.xdPreInit();
		
		var fullPath=this.mViewOptions.fullPath;
		WIDTH=this.mOptions.width;
		SWIDTH=this.mOptions.width+2;
		HEIGHT=this.mOptions.height;
		SIZE=Math.floor(Math.min(12000/SWIDTH,12000/HEIGHT));
		
		xdv.createGadget("board", {
			"2d" : {
				type : "image",
			},
		});

		xdv.createGadget("skyball", {
			"3d" : {
                harbor: false,
				type : "custommesh3d",		
				rotate: 135,
				rotateX: -60,
				create: function() {
					
					var graphGeometry = new THREE.SphereGeometry( 40 , 50, 50 );
					var material = new THREE.MeshBasicMaterial( { 
				        color: 0x00ff00, 
				        wireframe: false,
				        side: THREE.DoubleSide
				    } );
					
					///////////////////////////////////////////////
					// calculate vertex colors based on Z values //
					///////////////////////////////////////////////
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
						/*color.b = 1+delta;
						color.g = 0.5+0.4*delta;
						color.r = 0.3*delta;*/
						color.g = color.b = color.r = delta/6;
						
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
					var $this=this;

					var textureLoader = new THREE.TextureLoader();
					textureLoader.setCrossOrigin("anonymous");
					textureLoader.load(fullPath + "/res/xd-view/meshes/square.png",
						function(wireTexture){
							wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping; 
							wireTexture.repeat.set( 40, 40 );
							var wireMaterial = new THREE.MeshBasicMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side:THREE.DoubleSide } );
	
							wireMaterial.map.repeat.set( 20, 60 );
							
							var mesh = new THREE.Mesh( graphGeometry , wireMaterial );
							mesh.doubleSided = true;
							$this.objectReady(mesh);
						},			
						// Function called when download progresses
						function ( xhr ) {
							//console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
						},
						// Function called when download errors
						function ( xhr ) {
							console.log( "error loading texture" );
							return;
						});
					return null;
				},
				opacity:1,
			},
		});

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
							}).text(pos+1);
						},
					},
					"3d": {
						type: "custommesh3d",
						z: -SIZE*.05,
						rotateX: -90,
						create: function() {
                            var $this = this;
                            this.getResource('font|'+fullPath+
                                '/res/xd-view/fonts/helvetiker_regular.typeface.json',
                                function(font) {
                                var gg=new THREE.TextGeometry(""+(pos+1),{
                                    size: 0.2,
                                    height: 0.05,
                                    curveSegments: 6,
                                    font: font,

                                });
                                var gm=new THREE.MeshBasicMaterial();
                                var mesh= new THREE.Mesh( gg , gm );
                                $this.objectReady(mesh);
                            });
							return null;
						},
					},
				});
				xdv.createGadget("cell#"+pos, {
					"2d" : {
						type : "element",
						initialClasses: "xd-choice",
						width: SIZE*1.1,
						height: SIZE*1.1,
						z: 1,
					},
					"3d": {
						type: "meshfile",
						file : fullPath+"/res/xd-view/meshes/ring-target.js",
						scale: [.8,.8,.8],
						smooth : 0,
						flatShading: true,
						z : -100,		
						materials: { 
							"square" : {
								transparent: true,
								opacity: 0,
							},
							"ring" : {
								color : 0xffcc00,
								shininess : 10,
								//reflectivity: 0.5,
								//transparent: true,
								//opacity: 0.5,
							}
						},	
					},
				});				
			})(pos);
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
			});
			var frameObj = new THREE.Mesh( frameGeo , frameMat);
			frameObj.position.y=-extrudeSettings.amount-.01;
			return frameObj;
		}
		
		function CreatePiece(side,index) {
			xdv.createGadget("piece#"+index, {
				"2d" : {
					type : "sprite",
					z : 4,
					file : fullPath+"/res/images/basic2.png",
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
						return $this.millsMakeDummyMesh(xdv);
					},
					display: function(force,options,delay){
						var key="_"+options.playerSide+"_";
						if (key!=this._pKey){
							this._pKey=key;
							var avat=this;
							currentGame.millsMakeTokenPiece(avat,options.playerSide,function(mesh){
								avat.replaceMesh(mesh,options,delay);
							});
						}
					},
					scale: [0.3*10/SWIDTH,0.3*10/SWIDTH,0.3*10/SWIDTH],
					z : 1,			
				},
			});			
		}

		var index=0;
		for(var side=1;side>=-1;side-=2)
			for(var m=0;m<this.mOptions.mencount;m++)
				CreatePiece(side,index++);
		PCOUNT=this.mOptions.menCount*2;
		
		var coords=this.g.Coord;
		var graph=this.g.Graph;
		xdv.createGadget("boardframe", {
			"classic3d": {
				type : "custommesh3d",
				color: 0xaaffaa,		
				scale: [1.65,1.65,1.65],
				opacity : 1,
				//flatShading: true,
				z : -320,
				create: function() {					
					var $this=this;
					this.getResource("smoothedfilegeo|"+0+"|"+fullPath+"/res/xd-view/meshes/boardoriented.js",function(geometry , materials) {
						
						var zoom=0.81;
						switch(WIDTH){
							default:
								console.log("3D error: unhandled size "+WIDTH);
							break;
							case 7:
								zoom=0.81;
							break;
							case 5:
								zoom=1.05;
							break;
							case 3:
								zoom=1.40;
							break;
							
						}
						function xyPos(position){
							return [zoom*(-WIDTH/2+coords[position][0]+0.5),zoom*(-HEIGHT/2+coords[position][1]+0.5)];
						}
						for (var m in materials){
							var mat=materials[m];
							if (mat.name=="mainframe"){
								mat.specular={r:.05,g:.05,b:.05}
								mat.shininess=40;
							}
								
						}
						var board=new THREE.Mesh(geometry,new THREE.MultiMaterial( materials ));
						
						var cylGeo=new THREE.SphereGeometry(0.15, 32, 32);		
						var cylMat=new THREE.MeshPhongMaterial( { color: 0x000000 , specular: 0x030303, shininess  : 500 } );
						for (var i=0;i< coords.length;i++){
							var cyl=new THREE.Mesh(cylGeo,cylMat);
							
							cyl.castShadow=true;
							cyl.position.y=0.16;
							var xy=xyPos(i);
							cyl.position.x=xy[0];
							cyl.position.z=xy[1];
							cyl.castShadow=true;
							cyl.scale.y=.2;
							board.add(cyl);							
						}
    					
						var tubeMat = new THREE.MeshPhongMaterial( { color: 0x000000 , specular: 0x050505, shininess  : 500  } );
						
						var doneSegments=[];
						function JoinPositions(p1,p2){
							var signature=(p1<p2)?p1+"-"+p2:p2+"-"+p1;
							if (doneSegments[signature]) 
								return;
							doneSegments[signature]=true;
							//alert("JoinPositions: p1="+p1+" ,p2="+p2);
							var xy1=xyPos(p1);
							var xy2=xyPos(p2);
							var curve = new THREE.CatmullRomCurve3([
								new THREE.Vector3(xy1[0], 0, xy1[1]),
								new THREE.Vector3(xy2[0], 0, xy2[1])
								]);
							var tubeGeo = new THREE.TubeGeometry(curve, 1, 0.1, 10, false);
							var tube = new THREE.Mesh(tubeGeo,tubeMat);
							tube.position.y=0.15;
							tube.scale.y=0.2;
							tube.castShadow=false;
							board.add(tube);
						}
						
						/*for (var p=0;p<graph.length;p++){
							for(var q=0;q<graph[p].length;q++){*/
						for (var p=0;p<graph.length;p++){
							for(var q=0;q<graph[p].length;q++){
								if (graph[p][q]!=null) 
									JoinPositions(p,graph[p][q]);
							}
						}
						
						// add border frame
						var margin=-8;
						var cx=7.83;//(1+2*margin/100)*WIDTH*SIZE/1000;
						var cy=7.83;//(1+2*margin/100)*HEIGHT*SIZE/1000;
						var frameObj = createFrame($this,cx,cy);
						frameObj.position.y=-.15;
						board.add(frameObj);
						var bottom=new THREE.Mesh(new THREE.BoxGeometry(cx,.5,cy),frameObj.material);
						bottom.position.y=-.3;
						board.add(bottom);
						board.receiveShadow=true;
						$this.objectReady(board);
					});
					return null;
				},
			},
		});
		
		var millsCreateScreen = function(videoTexture) {
			// flat screens
			var gg=new THREE.PlaneGeometry(4,3,1,1);
			var gm=new THREE.MeshPhongMaterial({color:0xffffff,map:videoTexture,shading:THREE.FlatShading,emissive:{r:1,g:1,b:1}});
			var mesh = new THREE.Mesh( gg , gm );
			this.objectReady(mesh); 
			return null;
		}		
		
		xdv.createGadget("videoa",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return millsCreateScreen.call(this,videoTexture);
				},
			},
		});
		xdv.createGadget("videoabis",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return millsCreateScreen.call(this,videoTexture);
				},
			},
		});
		xdv.createGadget("videob",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return millsCreateScreen.call(this,videoTexture);
				},
			},
		});	
		xdv.createGadget("videobbis",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return millsCreateScreen.call(this,videoTexture);
				},
			},
		});
		
		
		xdv.createGadget("spacefield",{
			"3d" : {
                harbor: false,
				type : "custommesh3d",		
				create: function() {
					var $this=this;
					var container=new THREE.Object3D();
					var catCount=10;
					var partSys=[];
					
					
					var textureLoader = new THREE.TextureLoader();
					textureLoader.setCrossOrigin("anonymous");
					textureLoader.load(fullPath + "/res/xd-view/meshes/star.png" ,
						function(starSprite){
							for(var i=0;i<catCount;i++) {
								var material = new THREE.PointsMaterial( { size: 1-i/catCount, map: starSprite, blending: THREE.AdditiveBlending,  depthTest: true, transparent : true } );
								var geometry = new THREE.Geometry();
								material.color.setHex( 0xffffff );
								var particles = new THREE.Points( geometry, material);
								partSys.push({
									object: particles,
									geometry: geometry,
								});
								container.add(particles)
							}
							$this.getResource("json2|"+fullPath + "/res/xd-view/meshes/starsdb.json",function(data) {
								for(var i=0;i<data.length;i++) {
									var star=data[i];
									var r=30;
									var rot=(star.az-90)*Math.PI/180;
									var elev=star.al*Math.PI/180;
									var vertex = new THREE.Vector3();
									vertex.x = r*Math.cos(elev)*Math.cos(rot);
									vertex.z = r*Math.cos(elev)*Math.sin(rot);
									vertex.y = r*Math.sin(elev);
									var cat=Math.floor(i*catCount/data.length);
									var catObj=partSys[cat];
									catObj.geometry.vertices.push( vertex );					
								}
								$this.objectReady(container);						
							});
					});															
				},
			},
		});
					
		
		
		this.xdInitExtra(xdv);
	}
	
	View.Game.xdBuildScene = function(xdv) {

		currentGame=this;
		var $this=this;

		var scaleScreen=3;
		var zScreen=3000;
		var zScreenVignette=1500;
		var yScreen=10000;
		var screenAngle=0;
		var thumbDist=.89;
		var thumbOffset=5500;		
		var inclination=25;
		
		xdv.updateGadget("videoa",{
			"3d": {
				visible: true,
				playerSide: 1,
				z: zScreen,
				y: this.mViewAs==1?yScreen:-yScreen,
				rotate: this.mViewAs==1?-(180+screenAngle):-screenAngle,
				rotateX: this.mViewAs==1?inclination:-inclination,
				scale: [scaleScreen,scaleScreen,scaleScreen],
			},
		});
		xdv.updateGadget("videoabis",{
			"3d": {
				visible: true,
				playerSide: -1,
				z: zScreenVignette,
				x: this.mViewAs==1?-thumbOffset:thumbOffset,
				y: this.mViewAs==1?thumbDist*yScreen:-thumbDist*yScreen,
				rotate: this.mViewAs==1?-(180+screenAngle):-screenAngle,
				rotateX: this.mViewAs==1?inclination:-inclination,
				scale: [scaleScreen/4,scaleScreen/4,scaleScreen/4],
			},
		});

		xdv.updateGadget("videob",{
			"3d": {
				visible: true,
				playerSide: -1,
				z: zScreen,
				y: this.mViewAs==1?-yScreen:yScreen,
				rotate: this.mViewAs==1?-screenAngle:-(180+screenAngle),
				rotateX: this.mViewAs==1?-inclination:inclination,
				scale: [scaleScreen,scaleScreen,scaleScreen],
			},
		});
		xdv.updateGadget("videobbis",{
			"3d": {
				visible: true,
				playerSide: 1,
				z: zScreenVignette,
				x: this.mViewAs==1?thumbOffset:-thumbOffset,
				y: this.mViewAs==1?-thumbDist*yScreen:thumbDist*yScreen,
				rotate: this.mViewAs==1?-screenAngle:-(180+screenAngle),
				rotateX: this.mViewAs==1?-inclination:inclination,
				scale: [scaleScreen/4,scaleScreen/4,scaleScreen/4],
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
				visible: true,
				receiveShadow:true,
			}
		});

		xdv.updateGadget("skyball",{
			"3d": {
				visible: true,
			},
		});
		xdv.updateGadget("spacefield",{
			"3d": {
				visible: true,
			},
		});		
		
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
				}
			});
			xdv.updateGadget("cell#"+pos,{
				base: {
					visible: false,
					x: coord[0],
					y: coord[1],
				},
				"2d" : {
					width: SIZE * .95,
					height: SIZE * .95,
				},
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
			c=WIDTH-1-c;
		}
		var vx=(c-(WIDTH-1)/2)*SIZE;
		var vy=(r-(HEIGHT-1)/2)*SIZE;
		return [vx,vy, - SIZE * .04];
	}
	
	View.Game.getCCoord=function(pos) {
		var rcCoord=this.g.Coord[pos];
		var r=rcCoord[0];
		var c=rcCoord[1];
		return this.getVCoord(r,c);
	}

	View.Game.getPieceCoord=function(piece) {
		if(piece.p<0) {
			var x=(piece.s==1?-5500:5500)*this.mViewAs;
			var height=12000*WIDTH/SWIDTH;
			var dy=height/this.mOptions.mencount;
			var y2d=((piece.d+.5)*dy-height/2)*piece.s*this.mViewAs;
			var z2d=10+piece.d;
			var y3d=(piece.s==1?SIZE*WIDTH/2:-SIZE*WIDTH/2)*this.mViewAs;
			var z3d=-SIZE*.04 + piece.d*SIZE*.17;
			return {
				"2d": [x,y2d,z2d], 
				"3d": [x,y3d,z3d], 
			}
		} else {
			var coord=this.getCCoord(piece.p);
			return {
				"2d": coord,
				"3d": coord,
			}
		}
	}

	View.Board.xdDisplay = function(xdv, aGame) {
		for(var i=0;i<this.pieces.length;i++) {
			var piece=this.pieces[i];
			if(!piece.a)
				xdv.updateGadget("piece#"+i,{
					base : {
						visible: false,
					},
				});
			else {
				var coord=aGame.getPieceCoord(piece);
				xdv.updateGadget("piece#"+i,{
					base : {
						visible: true,
					},
					"2d" : {
						opacity : 1,
						x: coord["2d"][0],
						y: coord["2d"][1],
					},
					"3d" : {
						z : coord["3d"][2],
						scale: [SIZE*.00045,SIZE*.00045,SIZE*.00045],
						opacity : 1,						
						x: coord["3d"][0],
						y: coord["3d"][1],
						playerSide: piece.s,
						materials: { 
							"base" : {
								opacity: 1,
							}, 
						},
					},
				});
			}
		}
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
	
	View.Board.xdBuildHTStateMachine = function(xdv, htsm, aGame) {
		var $this = this;
		var moves=this.mMoves;
		var pieceIndex=-1;
		var uMove={f:-2,t:-2,c:-2},move;
		var matchingMoves=[];
		
		function Highlight(pos,type) {		
			var piece=null;
			var pieceIndex1;
			pieceIndex1=$this.board[pos];
			if(pieceIndex1<0 && pos==uMove.t)
				pieceIndex1=pieceIndex;
			if(pieceIndex1>=0)
				piece=$this.pieces[pieceIndex1];
			var color;
			var event;
			var classes;
			switch(type) {
			case "normal": 
				event="E_CLICKED";
				color=0xffff00;
				classes="xd-choice-view";
				break;
			case "cancel": 
				event="E_CANCEL";
				color=0xff0000;
				classes="xd-cancel";
				break;
			}

			function SendEvent() {
				htsm.smQueueEvent(event, {pos:pos,type:type});
			}
			xdv.updateGadget("cell#"+pos,{
				base: {
					visible: true,
					click : SendEvent,
				},
				"2d": {
					classes: classes,
					opacity: (aGame.mShowMoves || type=="cancel")?.5:0,
				},
				"3d": {
					color: color,
					scale: [SIZE * .0006,SIZE * .0006, SIZE * .0006],
					opacity: type=="cancel"?.5:0,
					castShadow: true,
					materials: { 
						"square" : {
						},
						"ring" : {
							color : type=="cancel"?0xff4400:0xffffff,
							shininess : 10,
							transparent: false,
						}
					},	

				},
			});
			var rcCoord=aGame.g.Coord[pos];
			var r=rcCoord[0];
			var c=rcCoord[1];
			var darkCell=(c%2==r%2);
			if(piece)
				xdv.updateGadget("piece#"+pieceIndex1,{
					base: {
						visible: true,
						click : SendEvent,
					},
					"2d": {
						classes: "choice",
					},
				});
		}
		function Init(args) {
		}
		function Clean(args) {
			for ( var pos = 0; pos < aGame.g.Coord.length; pos++) {
				xdv.updateGadget("cell#" + pos, {
					"base" : {
						visible : false,
						click : null,
					},
					"2d" : {
						classes: "",
					},
				});
			}
			for( var i in $this.pieces) {
				var piece=$this.pieces[i];
				xdv.updateGadget("piece#"+i, {
					"base" : {
						click : null,
					},
				});				
			}
		}
		function Select(args) {
			matchingMoves=[];
			for(var i=0;i<moves.length;i++) {
				var move=moves[i];
				var keep=true;
				if(uMove.f!=-2 && uMove.f!=move.f)
					keep=false;
				if(uMove.t!=-2 && uMove.t!=move.t)
					keep=false;
				if(uMove.c!=-2 && uMove.c!=move.c)
					keep=false;
				if(keep)
					matchingMoves.push(move);
			}

			if(matchingMoves.length==1) {
				var mMove=matchingMoves[0];
				if(uMove.f==-2 && mMove.f>=0) {
					uMove.f=mMove.f;
					htsm.smQueueEvent("E_CLICKED",{pos:mMove.f,type:"normal"});
				} else if(uMove.t==-2 && mMove.t>=0) {
					uMove.t=mMove.t;
					htsm.smQueueEvent("E_CLICKED",{pos:mMove.t,type:"normal"});
				} else if(uMove.c==-2 && mMove.c>=0) {
					uMove.c=mMove.c;
					htsm.smQueueEvent("E_CLICKED",{pos:mMove.c,type:"normal"});
				} else 
					htsm.smQueueEvent("E_DONE",{move:mMove});
				return;
			}
			if(uMove.f>-2 && uMove.t==-2)
				Highlight(uMove.f,"cancel");
			else if(uMove.t>=0 && uMove.c==-2)
				Highlight(uMove.t,"cancel");
			for(var i=0;i<matchingMoves.length;i++) {
				var move=matchingMoves[i];
				if(uMove.t>=0)
					Highlight(move.c,"normal");
				else if(uMove.f>=0 || move.f==-1)
					Highlight(move.t,"normal");
				else
					Highlight(move.f,"normal");
			}
		}
		function Animate(args) {
			var from=-1,to=-1,capt=-1;
			if(uMove.c>=0)
				capt=uMove.c;
			else {
				to=uMove.t;
				if(uMove.f>=0)
					from=uMove.f
			}
			$this.millsAnimateMove(xdv,aGame,from,to,capt,function() {
				htsm.smQueueEvent("E_ANIM_DONE",{});					
			});
		}
		function SaveClick(args) {
			for(var i=0;i<matchingMoves.length;i++) {
				var move=matchingMoves[i];
				if(move.f==args.pos) {
					uMove.f=args.pos;
					pieceIndex=$this.board[args.pos];
				} else if(move.t==args.pos) {
					if(uMove.f<0)
						pieceIndex=$this.dock[$this.mWho][0];
					uMove.t=args.pos;
				} else if(move.c==args.pos)
					uMove.c=args.pos;
				
			}
		}
		function SaveMove(args) {
			move=args.move;
		}
		function SendMove(args) {
			aGame.MakeMove(move);
		}
		function CancelLastClick(args) {
			if(uMove.t>-2) {
				uMove.t=-2;
				var piece=$this.pieces[pieceIndex];
				var coord=aGame.getPieceCoord(piece);
				xdv.updateGadget("piece#"+pieceIndex,{
					"2d" : {
						x: coord["2d"][0],
						y: coord["2d"][1],
					},
					"3d" : {
						z : coord["3d"][2],
						x: coord["3d"][0],
						y: coord["3d"][1],
					},
					
				});
			} else if(uMove.f>-2) {
				pieceIndex=-1;
				uMove.f=-2;
			}
		}

		htsm.smTransition("S_INIT", "E_INIT", "S_SELECT", [ Init ]);
		htsm.smEntering("S_SELECT", [ Select ]);
		htsm.smTransition("S_SELECT", "E_CLICKED","S_ANIMATING", [ SaveClick,Animate ]);
		htsm.smTransition("S_SELECT", "E_CANCEL",null, [ Clean,CancelLastClick,Select ]);
		htsm.smTransition("S_SELECT", "E_DONE",null, [ SaveMove, SendMove  ]);
		htsm.smTransition("S_SELECT", "E_ANIM_DONE",null, [ ]);
		htsm.smLeaving("S_SELECT", [ Clean ]);
		htsm.smTransition("S_ANIMATING","E_ANIM_DONE","S_SELECT",[])

		htsm.smTransition(["S_SELECT"],"E_END","S_DONE",[]);
		htsm.smEntering("S_DONE",[Clean]);

	}
	
	View.Board.millsAnimateMove = function(xdv, aGame, from, to, capture, callback) {
		var $this=this;
		var pieceIndex, fly=false;
		function Capture() {
			if(capture<0)
				callback();
			else {
				pieceIndex=$this.board[capture];
				
				aGame.PlaySound("capture");

				xdv.updateGadget("piece#"+pieceIndex,{
					"2d": {
						opacity: 0,
					},
					"3d": {
						z: 7*SIZE,
						materials: { 
							"base" : {
								opacity: 0,
							}
						},
						materialEasing: (typeof TWEEN==="undefined")?null:TWEEN.Easing.Cubic.EaseOut,
					},
				},800,function() {
					callback();
				});
			}
		}
		if(to>=0) {
			if(from>=0) { 
				pieceIndex=this.board[from];
				fly=true;
				for(var i=0;i<aGame.g.Graph[from].length;i++)
					if(aGame.g.Graph[from][i]==to) {
						fly=false;
						break;
					}
			} else {
				pieceIndex=this.dock[this.mWho][0];
				fly=true;
			}
			var coord=aGame.getCCoord(to);
			var coord0=aGame.getPieceCoord(this.pieces[pieceIndex]);
			var z0=coord0["3d"][2];
			var z1=z0+SIZE;
			var z2=-SIZE*.04;
			var c=z0;
			var S1=c-z1;
			var S2=c-z2;

			var A=-1;
			var B=4*S1-2*S2;
			var C=-S2*S2;
			var D=B*B-4*A*C;
			var a1=(-B-Math.sqrt(D))/(2*A);
			var a2=(-B+Math.sqrt(D))/(2*A);
			var a=a1;
			var b=-a-S2;
			if(a==0 || -b/(2*a)<0 || -b/(2*a)>1) {
				a=a2;
				b=-a-S2;
			}
			
			if (fly){
			}else{
				aGame.PlaySound("move"+(1+Math.floor(Math.random()*4)));
			}
			xdv.updateGadget("piece#"+pieceIndex,{
				"2d": {
					x: coord[0],
					y: coord[1],
				},
				"3d": {
					x: coord[0],
					y: coord[1],
					positionEasingUpdate: function(ratio) {
						if(fly) {
							var y=(a*ratio*ratio+b*ratio+c)*this.SCALE3D;
							this.object3d.position.y=y;
						}
					},
				},
			},400,function() {
				xdv.updateGadget("piece#"+pieceIndex,{ "3d": {	positionEasingUpdate: null,	}});
				if (fly)
					aGame.PlaySound("tac"+(1+Math.floor(Math.random()*3)));
				Capture();
			});
		} else 
			Capture();
	}
	
	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		var board=aGame.mOldBoard;
		board.millsAnimateMove(xdv,aGame,aMove.f,aMove.t,aMove.c, function() {
			aGame.MoveShown();
		});
		return false;
	}
	
})();

