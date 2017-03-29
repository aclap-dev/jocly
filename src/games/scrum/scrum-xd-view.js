/*
 *
 * Copyright (c) 2013 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

(function() {
	
	var HEIGHT=12600, WIDTH=5250;
	var BWIDTH,BHEIGHT;
	var cellSide;
	var nbStadiumLights=0;
	var stadiumScale=1.3;
	var stadiumZ=-210;
	var groundZoom=stadiumScale*0.8;
	var followBall=true;
	

	View.Game.xdInit = function(xdv) {

		var fullPath=this.mViewOptions.fullPath;

		BWIDTH=this.mOptions.width;
		BHEIGHT=this.mOptions.height;

		xdv.createGadget("board", {
			"2d" : {
				type : "canvas",
			},
		});
		for (var l=0;l<nbStadiumLights;l++){
			var r=5000;
			var angle=Math.PI/4+(2*Math.PI/nbStadiumLights)*l;
			xdv.createGadget("slight#"+l, {
				"3d": {
					type: "custom3d",
					create: function() {
						var light = new THREE.SpotLight( 0xffffff, 0.7 );
						light.castShadow = true;
						//light.shadowCameraVisible=true;
						light.shadowDarkness = .25;
		
						light.shadowCameraNear = 3;
						light.shadowCameraFar = 20;
						light.shadowCameraFov = 90;
						light.shadowMapWidth = 1024;
						light.shadowMapHeight = 1024;
						
						light.shadowCascade = true;
						light.shadowCascadeCount = 3;
						light.shadowCascadeNearZ = [ -1.000, 0.995, 0.998 ];
						light.shadowCascadeFarZ  = [  0.995, 0.998, 1.000 ];
						light.shadowCascadeWidth = [ 1024, 1024, 1024 ];
						light.shadowCascadeHeight = [ 1024, 1024, 1024 ];
						
						return light;
					},
					y: r*Math.sin(angle),
					x: r*Math.cos(angle),
					z: 6000,
				}
			});
		}
		
		xdv.createGadget("boardgrass",{
			"2d":{
				type:"sprite",
				file : fullPath + "/res/xd-view/meshes/scrumfield8x12.jpg",
				clipwidth : 700,
				clipheight : 1200,
				clipx : 50,
				clipy : 48,
				z: -1,
				//opacity:0.5,				
			}
		});
		
		for(var ad=0;ad<2;ad++){
			xdv.createGadget("field-ad#"+ad,{
				"2d": {
					clipwidth : 300,
					clipheight : 100,
					clipx : 0,
					clipy : 0,
					z: 5,
					opacity:0.5,					
				},
				"regular":{
					type : "sprite",
					file : fullPath + "/res/xd-view/meshes/field-ad.jocly.jpg",
				},
				"regularsg":{
					type : "sprite",
					file : fullPath + "/res/xd-view/meshes/field-ad.sg.jpg",
				},
				"regularhnk":{
					type : "sprite",
					file : fullPath + "/res/xd-view/meshes/field-ad.hnk.jpg",
				},
				"regularlr":{
					type : "sprite",
					file : fullPath + "/res/xd-view/meshes/field-ad.lr.jpg",
				},
				"regularea":{
					type : "sprite",
					file : fullPath + "/res/xd-view/meshes/field-ad.ea.jpg",
				},
				"regularcc":{
					type : "sprite",
					file : fullPath + "/res/xd-view/meshes/field-ad.cc.jpg",
				},
				"regulartb":{
					type : "sprite",
					file : fullPath + "/res/xd-view/meshes/field-ad.tb.jpg",
				},
				"regularmc":{
					type : "sprite",
					file : fullPath + "/res/xd-view/meshes/field-ad.mc.jpg",
				},
				"regulardhl":{
					type : "sprite",
					file : fullPath + "/res/xd-view/meshes/field-ad.dhl.jpg",
				},
			});
		}
		xdv.createGadget("screenlighta",{
			"3d": {
				type: "custom3d",
				create: function(){
					var aLight= new THREE.SpotLight(0xffffff,1.2, 0, 1.05, 1, 2);
					aLight.castShadow = false;
					return aLight;
				},
				y: -7000,
				z:300,
				rotateX:90,
			}
		});
		xdv.createGadget("screenlightb",{
			"3d": {
				type: "custom3d",
				create: function(){
					var aLight= new THREE.SpotLight(0xffffff,1.2, 0, 1.05, 1, 2);
					//aLight.height = 1000;
					//aLight.width = 1000;
					aLight.castShadow = false;
					return aLight;
				},
				y: 7000,
				z:300,
				rotateX:90,
			}
		});
		xdv.createGadget("stadium", {
			"3d" : {
				type: "meshfile",
				file : fullPath+"/res/xd-view/meshes/stade4.js",
				scale: [stadiumScale,stadiumScale,stadiumScale],
				flatShading:true,
				z: stadiumZ,
				smooth:0,
			}
		});
		xdv.createGadget("stadiumxtra", {
			"3d" : {
				type: "meshfile",
				file : fullPath+"/res/xd-view/meshes/stade2-xtra.js",
				scale: [stadiumScale,stadiumScale,stadiumScale],
				flatShading:true,
				z: stadiumZ,
				//smooth:1,
				click: function() {
					followBall=true;
				},
			},
			"scrum3djocly": {
				materials:{
					"mat.pub.large.panels":{
						map: fullPath+"/res/xd-view/meshes/pubs.jocly.jpg",
					},
					"poteaux.pub":{
						map: fullPath+"/res/xd-view/meshes/pubs.jocly.jpg",
					},
				},
			}, 
			"scrum3dsg": {
				materials:{
					"mat.pub.large.panels":{
						map: fullPath+"/res/xd-view/meshes/pubs.sg.jpg",
					},
					"poteaux.pub":{
						map: fullPath+"/res/xd-view/meshes/pubs.sg.jpg",
					},
				},
			}, 
			"scrum3dhnk": {
				materials:{
					"mat.pub.large.panels":{
						map: fullPath+"/res/xd-view/meshes/pubs.hnk.jpg",
					},
					"poteaux.pub":{
						map: fullPath+"/res/xd-view/meshes/pubs.hnk.jpg",
					},
				},
			}, 
			"scrum3dlr": {
				materials:{
					"mat.pub.large.panels":{
						map: fullPath+"/res/xd-view/meshes/pubs.lr.jpg",
					},
					"poteaux.pub":{
						map: fullPath+"/res/xd-view/meshes/pubs.lr.jpg",
					},
				},
			}, 
			"scrum3dea": {
				materials:{
					"mat.pub.large.panels":{
						map: fullPath+"/res/xd-view/meshes/pubs.ea.jpg",
					},
					"poteaux.pub":{
						map: fullPath+"/res/xd-view/meshes/pubs.ea.jpg",
					},
				},
			}, 
			"scrum3dcc": {
				materials:{
					"mat.pub.large.panels":{
						map: fullPath+"/res/xd-view/meshes/pubs.cc.jpg",
					},
					"poteaux.pub":{
						map: fullPath+"/res/xd-view/meshes/pubs.cc.jpg",
					},
				},
			}, 
			"scrum3dmc": {
				materials:{
					"mat.pub.large.panels":{
						map: fullPath+"/res/xd-view/meshes/pubs.mc.jpg",
					},
					"poteaux.pub":{
						map: fullPath+"/res/xd-view/meshes/pubs.mc.jpg",
					},
				},
			},
			"scrum3dtb": {
				materials:{
					"mat.pub.large.panels":{
						map: fullPath+"/res/xd-view/meshes/pubs.tb.jpg",
					},
					"poteaux.pub":{
						map: fullPath+"/res/xd-view/meshes/pubs.tb.jpg",
					},
				},
			}, 
			"scrum3ddhl": {
				materials:{
					"mat.pub.large.panels":{
						map: fullPath+"/res/xd-view/meshes/pubs.dhl.jpg",
					},
					"poteaux.pub":{
						map: fullPath+"/res/xd-view/meshes/pubs.dhl.jpg",
					},
				},
			},	
		});

/*		xdv.createGadget("stadium-rows", {
			"3d" : {
				type: "custommesh3d",
				scale: [stadiumScale,stadiumScale,stadiumScale],
				z: stadiumZ,
				create : function(){
					$this = this;
					this.getResource("smoothedfilegeo|"+0+"|"+fullPath+"/res/xd-view/meshes/stade2-rows.js",function(geometry , materials) {
						var nbParticules=0;
						var colors=[];
						function addPeople(vrtx,color){
							particles.vertices.push(vrtx);
							if (color){
								colors[nbParticules]=color;
							}else{
								colors[nbParticules]=new THREE.Color(Math.random()*0xffffff);
							}
							nbParticules++;
						}
						var particles=new THREE.Geometry();
						for (var f=0;f<geometry.faces.length;f++){
							var centroid=geometry.faces[f].centroid;
							var a=geometry.vertices[geometry.faces[f].a];
							var b=geometry.vertices[geometry.faces[f].b];
							var c=geometry.vertices[geometry.faces[f].c];
							var d=geometry.vertices[geometry.faces[f].d];		*/
							/*
							
							d*************c
							***************
							**dp*******cp**
							***************
							***************
							***************
							***************
							***************
							**ap*******bp**
							***************
							a*************b
							
							*/
							/*
							var nbRows=16;
							var nbCols=12;
							var offsetRow=10; // (%)
							var offsetCols=10; // (%)
							
							
							var delta=new THREE.Vector3();
							delta.subVectors(b,a);
							var ap=new THREE.Vector3();
							var bp=new THREE.Vector3();
							var cp=new THREE.Vector3();
							var dp=new THREE.Vector3();
							delta.subVectors(b,a);
							delta.multiplyScalar(offsetCols/100);
							ap.copy(a);
							ap.add(delta);
							delta.subVectors(a,b);
							delta.multiplyScalar(offsetCols/100);
							bp.copy(b);
							bp.add(delta);

							delta.subVectors(d,c);
							delta.multiplyScalar(offsetCols/100);
							cp.copy(c);
							cp.add(delta);
							addPeople(cp,new THREE.Color(0x0000ff));
							delta.subVectors(c,d);
							delta.multiplyScalar(offsetCols/100);
							dp.copy(d);
							dp.add(delta);
							addPeople(dp,new THREE.Color(0x00ff00));
							
							delta.subVectors(dp,ap);
							delta.multiplyScalar(offsetRow/100);
							ap.add(delta);
							delta.subVectors(ap,dp);
							delta.multiplyScalar(offsetRow/100);
							dp.add(delta);
							delta.subVectors(cp,bp);
							delta.multiplyScalar(offsetRow/100);
							bp.add(delta);
							delta.subVectors(bp,cp);
							delta.multiplyScalar(offsetRow/100);
							cp.add(delta);
							
							for(var i=0;i<nbRows;i++){
								var startLeft=new THREE.Vector3();
								var endRight=new THREE.Vector3();
								startLeft.copy(ap);
								delta.subVectors(dp,ap);
								delta.multiplyScalar(i/(nbRows-1));
								startLeft.add(delta);

								endRight.copy(bp);
								delta.subVectors(cp,bp);
								delta.multiplyScalar(i/(nbRows-1));
								endRight.add(delta);

								for (var j=0;j<nbCols;j++){
									delta.subVectors(endRight,startLeft);
									delta.multiplyScalar(j/(nbCols-1));
									var p=new THREE.Vector3();
									p.copy(startLeft);
									p.add(delta);
									addPeople(p);
								}
							}							
						}
						
						particles.colors=colors;
						var pMaterial =
						  new THREE.ParticleBasicMaterial({
						    color: 0xFFFFFF,
						    size: 0.1,
						    map: THREE.ImageUtils.loadTexture(
						      fullPath + "/res/xd-view/meshes/white.png"
						    ),
						    blending: THREE.AdditiveBlending,
						    transparent: true,
						    vertexColors: true,
						  });
						var particleSystem =
							new THREE.ParticleSystem(
								particles,
								pMaterial);
					
						$this.objectReady(particleSystem);
					
					});
					return null;
				}
			}
		});			*/
			
		function createScreen(videoTexture) {
			var $this=this;
			var smooth=0;
			this.getResource("smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/stade-screen.js",function(geometry , materials) {
 				var materials0=[];
 				
 				for(var i=0;i<materials.length;i++){
                    if (materials[i].name=="mat.screen"){
	 					var mat=materials[i].clone();
 						mat.map=videoTexture;
 						mat.overdraw = true;
 						//mat.side = THREE.DoubleSide;
 						materials0.push(mat);
                    }else{
	 					var mat=materials[i].clone();
	 					mat.shading=THREE.FlatShading;
	 					materials0.push(mat);
                    }
 				}
 				var mesh = new THREE.Mesh( geometry , new THREE.MultiMaterial( materials0 ) );
 				
 				mesh.visible = false;
 				$this.objectReady(mesh);
			});
			return null;
		};

		var scaleScreen=stadiumScale*2;
		var zScreen=3000;
		var yScreen=10000;
		xdv.createGadget("videoa",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return createScreen.call(this,videoTexture);
				},
				z: zScreen,
				y: yScreen,
				scale: [scaleScreen,scaleScreen,scaleScreen],
			},
			"scrum3dsg": {
				type : "videofile3d",
				src: fullPath+"/videos/sg.webm",
			},
			"scrum3dhnk": {
				type : "videofile3d",
				src: fullPath+"/videos/hnk.webm",
			},
			"scrum3dea": {
				type : "videofile3d",
				src: fullPath+"/videos/ea.webm",
			},
			"scrum3dcc": {
				type : "videofile3d",
				src: fullPath+"/videos/cc.webm",
			},
			"scrum3dlr": {
				type : "videofile3d",
				src: fullPath+"/videos/lr.webm",
			},
			"scrum3dtb": {
				type : "videofile3d",
				src: fullPath+"/videos/tb.webm",
			},
			"scrum3dmc": {
				type : "videofile3d",
				src: fullPath+"/videos/mc2.webm",
			},			
			"scrum3ddhl": {
				type : "videofile3d",
				src: fullPath+"/videos/dhl.webm",
			},
		});
		xdv.createGadget("videob",{
			"3d": {
				type : "video3d",
				makeMesh: function(videoTexture){
					return createScreen.call(this,videoTexture);
				},
				z: zScreen,
				y: -yScreen,
				scale: [scaleScreen,scaleScreen,scaleScreen],
			},
			"scrum3dsg": {
				type : "videofile3d",
				src: fullPath+"/videos/sg.webm",
			},
			"scrum3dhnk": {
				type : "videofile3d",
				src: fullPath+"/videos/hnk.webm",
			},
			"scrum3dea": {
				type : "videofile3d",
				src: fullPath+"/videos/ea.webm",
			},
			"scrum3dcc": {
				type : "videofile3d",
				src: fullPath+"/videos/cc.webm",
			},
			"scrum3dlr": {
				type : "videofile3d",
				src: fullPath+"/videos/lr.webm",
			},
			"scrum3dtb": {
				type : "videofile3d",
				src: fullPath+"/videos/tb.webm",
			},
			"scrum3dmc": {
				type : "videofile3d",
				src: fullPath+"/videos/mc2.webm",
			},			
			"scrum3ddhl": {
				type : "videofile3d",
				src: fullPath+"/videos/dhl.webm",
			},
		});
				
		/*
		xdv.createGadget("stadium-lights", {
			"3d" : {
				type: "custommesh3d",
				create: function(){
					var $this=this;
					this.getResource("smoothedfilegeo|"+0+"|"+fullPath+"/res/xd-view/meshes/stade-lights.js",function(geometry , materials) {
						
						var starSprite = new THREE.ImageUtils.loadTexture( fullPath + "/res/xd-view/meshes/star.png" );
						var material = new THREE.ParticleBasicMaterial( { size: 0.5, map: starSprite, blending: THREE.AdditiveBlending,  depthTest: true, transparent : true, } );
						material.color.setHex( 0xffffff );
						var lights = new THREE.ParticleSystem( geometry, material);
						var material2 = new THREE.ParticleBasicMaterial( { size: 0.8, map: starSprite, blending: THREE.AdditiveBlending,  depthTest: true, transparent : true } );
						material2.color.setHex( 0xff8888 );
						var lights2 = new THREE.ParticleSystem( geometry, material2);
						lights2.scale.x=1.25;
						lights.add(lights2);
						$this.objectReady(lights);
					});
					return null;
				},
				scale: [stadiumScale,stadiumScale,stadiumScale],
				z: stadiumZ+5000,
			}
		});*/
		xdv.createGadget("surround", {
			"3d" : {
                harbor: false,
				type: "custom3d",
				width: 100000,
				height: 100000,
				depth: 100000,
				scale: [1,1,1],
				rotate: 90,
				create: function() {	
					var path = fullPath+"/res/xd-view/textures/skybox/";

	
					var format = ".jpg";
					var urls = [
						path + 'px' + format, path + 'nx' + format,
						path + 'py' + format, path + 'ny' + format,
						path + 'pz' + format, path + 'nz' + format
					];
					
					var textureCube = new THREE.CubeTextureLoader().load( urls );
					var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.95 } );
					var shader = {
						uniforms: { "tCube": { type: "t", value: null },
									"tFlip": { type: "f", value: -1 } },
						vertexShader: [
							"varying vec3 vViewPosition;",
							"void main() {",
								"vec4 mPosition = modelMatrix * vec4( position, 1.0 );",
								"vViewPosition = cameraPosition - mPosition.xyz;",
								"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
							"}"
						].join("\n"),
			
						fragmentShader: [
							"uniform samplerCube tCube;",
							"uniform float tFlip;",
							"varying vec3 vViewPosition;",
							"void main() {",
								"vec3 wPos = cameraPosition - vViewPosition;",
								"gl_FragColor = textureCube( tCube, vec3( tFlip * wPos.x, wPos.yz ) );",
							"}"
						].join("\n")
					}
					shader.uniforms[ "tCube" ].value = textureCube;
	
					var material = new THREE.ShaderMaterial( {
	
						fragmentShader: shader.fragmentShader,
						vertexShader: shader.vertexShader,
						uniforms: shader.uniforms,
						depthWrite: false,
						side: THREE.BackSide
	
					} ),
	
					mesh = new THREE.Mesh( new THREE.CubeGeometry( 3000, 3000, 3000 ), material );
					return mesh;
				},			
			},
		});
		xdv.createGadget("ocean", {
			"3d" : {
                harbor: false,
				type : "meshfile",
				file : fullPath+"/res/xd-view/meshes/ocean.js",
				scale: [200,200,3],
				z : -50,
				smooth: 0 ,
			},
		});

		xdv.createGadget("ground", {
			"3d" : {
				type : "custommesh3d",
				z: -40,
				create: function(){
					var gg=new THREE.CubeGeometry(8,0.08,13);
                    var $this = this;
                    var loader = new THREE.TextureLoader();
                    loader.load(fullPath+"/res/xd-view/meshes/scrumfield8x12.jpg",
                        function(diffuseMap) {
                            diffuseMap.wrapS = diffuseMap.wrapT = THREE.RepeatWrapping;
                            diffuseMap.format = THREE.RGBFormat;
                            //var gm=new THREE.MeshBasicMaterial({color:0xffffff,side: THREE.DoubleSide});
                            var gm=new THREE.MeshPhongMaterial( {
                                        color: 0x888888,
                                        map: diffuseMap,
                                        shininess:0,
                             } );
                            var mesh=new THREE.Mesh(gg,gm);
                            $this.objectReady(mesh);
                        });
					return null;
				},
				receiveShadow : true,
				scale: [groundZoom,groundZoom,groundZoom],
			},
		});

		for(var pos=0;pos<BHEIGHT*BWIDTH;pos++) {
			var coord=this.getVCoord(pos);
			(function(pos) {
				xdv.createGadget("cell#"+pos, {
					"2d" : {
						type : "element",
						initialClasses: ((Math.floor(pos/BWIDTH))+(pos%BWIDTH))%2?"cell-white cell-white-rugby":"cell-black cell-black-rugby",
						z: 1,
					},
					"3d" : {
						type: "meshfile",
						file : fullPath+"/res/xd-view/meshes/target.js",
						flatShading: true,
						smooth : 0,
						z : -50,
						castShadow: false,
						scale: [0.5,0.5,0.5],
						materials: { 
							"square" : {
								transparent: true,
								opacity: 0,
							},
							"ring" : {
								color : 0xffffff,
								opacity: 0,
								transparent: true,
							}
						},							
						holdClick: function(eventData) {
							followBall=false;
							var point=eventData.point;
							xdv.updateGadget("camera",{
								"3d": {
									targetX: 0,
									targetY: point.z/$this.SCALE3D,
									//targetZ: point.y/$this.SCALE3D,
									traveling: true,
								}
							},1000);
						},
					}
				});				
				xdv.createGadget("text#"+pos, {
					"2d" : {
						type : "element",
						initialClasses: "xd-notation",
						display : function(element, width, height) {
							element.css({
								"font-size" : (height * .6) + "pt",
								"line-height" : (height * 1) + "px",
							}).text(pos);
						},
					},
					"3d": {
						type: "custommesh3d",
						//z: -cellSide*.05,
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
                                var gm=new THREE.MeshPhongMaterial();
                                var mesh= new THREE.Mesh( gg , gm );
                                $this.objectReady(mesh);
                            });
							return null;
						},
						color: 0x888888,
					},
				});			
			})(pos);
		}
		
		var initial=this.mOptions.initial;
		var pieceIndex=0;
		var pieceZoom=0.16;
		function CreatePiece(side) {
			xdv.createGadget("player#"+(pieceIndex++), {
				"2d" : {
					type : "sprite",
					z: 4,
					file : fullPath + "/res/images/regular.png",
					clipwidth : 125,
					clipheight : 125,
					clipx : side==JocGame.PLAYER_A?125:0,
					clipy : 0,
				},
				"3d" : {
					type: "meshfile",
					//file : fullPath+"/res/xd-view/meshes/scrumer-team-a.js",
					file : fullPath+"/res/xd-view/meshes/player-anim.js",
					scale: [pieceZoom,pieceZoom,pieceZoom],
					//flatShading: true,
					//smooth : 2,
					z : 30,		
					materials:{
						"mat.short":{
							map: side==JocGame.PLAYER_A?fullPath+"/res/xd-view/meshes/teama-text.jpg":fullPath+"/res/xd-view/meshes/teamb-text.jpg",
						}
					},
					morphing: [1,0,0,0,0,0,0,0,0,0,0,0],
				},	
			});							
		}
		for(var i=0;i<initial.a.length;i++)
			CreatePiece(JocGame.PLAYER_A);
		for(var i=0;i<initial.b.length;i++)
			CreatePiece(JocGame.PLAYER_B);
		xdv.createGadget("ball", {
			"2d" : {
				type : "sprite",
				z: 4,
				file : this.mViewOptions.fullPath + "/res/images/regular.png",
				clipwidth : 125,
				clipheight : 125,
				clipx : 250,
				clipy : 0,
			},
            "3d" : {
                type: "meshfile",
                file : fullPath+"/res/xd-view/meshes/scrum-ball.js",
                scale: [0.2,0.2,0.2],
                smooth: 0,
                z: 500,  
                rotate : 45,        
                rotateX: 45,    
                materials:{
                	"Material":{
                		shininess:10,
                		specular:{r:.1,g:.1,b:.1},
                	}
                }
            },
		});
		xdv.createGadget("arrowscrum", {
			"2d" : {
				type : "sprite",
				z: 4,
				width: 400,
				height: 400,
				file : this.mViewOptions.fullPath + "/res/images/regular.png",
				clipwidth : 125,
				clipheight : 125,
				clipx : 500,
				clipy : 0,
			},
			"3d" : {
				type: "meshfile",
				file : fullPath+"/res/xd-view/meshes/arrowscrum.js",
				flatShading:true,
				z: 250, //stadiumZ,
			},
		});							
		for(var i=0;i<8;i++)
			xdv.createGadget("arrow#"+i, {
				"2d" : {
					type : "sprite",
					z: 4,
					width: 400,
					height: 400,
					file : this.mViewOptions.fullPath + "/res/images/regular.png",
					clipwidth : 125,
					clipheight : 125,
					clipx : 375,
					clipy : 0,
				},
				"3d" : {
					type: "meshfile",
					file : fullPath+"/res/xd-view/meshes/arrow.js",
					flatShading:true,
					z: 250, //stadiumZ,
				},
			});							
			
	}
	
	View.Game.getVCoord = function(pos) {
		if(this.mViewAs==JocGame.PLAYER_B)
			pos=BWIDTH*BHEIGHT-1-pos;
		var r=BHEIGHT-1-Math.floor(pos/BWIDTH);
		var c=pos%BWIDTH;
		var x=cellSide*(c+.5)-WIDTH/2;
		var y=cellSide*(r+.5)-HEIGHT/2;
		return [x,y];
	}

	View.Game.xdBuildScene = function(xdv) {
		var $this=this;

		cellSide=Math.min(WIDTH/BWIDTH,HEIGHT/BHEIGHT);
		
		for (var l=0;l<nbStadiumLights;l++){
			xdv.updateGadget("slight#"+l, {
				"3d" : {
					visible: true,
				}
			});
		}
		xdv.updateGadget("stadium",{
			"3d" : {
				visible: false,
			}
		});
		xdv.updateGadget("stadiumxtra",{
			"3d" : {
				visible: true,
			}
		});
		/*
		xdv.updateGadget("stadium-rows",{
			"3d" : {
				visible: true,
			}
		});
		*/
		
		/*
		xdv.updateGadget("stadium-lights",{
			"3d" : {
				visible: true,
		});		
		*/
		xdv.updateGadget("screenlighta",{
			"3d" : {
				visible: true,
			}
		});
		xdv.updateGadget("screenlightb",{
			"3d" : {
				visible: true,
			}
		});
		xdv.updateGadget("pubvideoa",{
			"3d" : {
				visible: true,
			}
		});		
		xdv.updateGadget("pubvideob",{
			"3d" : {
				visible: true,
			}
		});
		
		
		xdv.updateGadget("surround",{
			"3d": {
				visible: true,
			},
		});
		xdv.updateGadget("ocean",{
			"3d": {
				visible: true,
			},
		});
		xdv.updateGadget("ground",{
			"3d" : {
				visible: true,
			}
		});
		
		xdv.updateGadget("boardgrass",{
			"2d" : {
				visible: true,
				width: WIDTH+2*cellSide,
				height: HEIGHT,
			}			
		});
		xdv.updateGadget("board",{
			"2d" : {
				visible: true,
				draw: function(ctx,pixSize) {
					$this.scrumDrawBoard2(ctx,pixSize,WIDTH+2*cellSide,HEIGHT,2);
				},
				width: WIDTH+2*cellSide,
				height: HEIGHT,
			},			
		});
		for(var ad=0;ad<2;ad++){
			xdv.updateGadget("field-ad#"+ad,{
				"2d":{
					width:3*cellSide,
					height:cellSide,
					rotate:90+ad*180,
					x:3*cellSide*(ad==0?1:-1),
					visible:true,
				}
			});
		}
		for(var pos=0;pos<BHEIGHT*BWIDTH;pos++) {
			var coord=this.getVCoord(pos);
			xdv.updateGadget("cell#"+pos, {
				"base" : {
					visible: true,
					x: coord[0],
					y: coord[1],
				},
				"2d":{
					width: cellSide,
					height: cellSide,
				},

			});				
			xdv.updateGadget("text#"+pos, {
				"base":{
					visible: $this.mNotation,
				},
				"2d" : {
					width: cellSide/4,
					height: cellSide/4,
					x: coord[0]-cellSide*.32,
					y: coord[1]-cellSide*.37,
				},
				"3d" : {
					x: coord[0]-cellSide*.37,
					y: coord[1]+cellSide*.37,
				},
			});				
		}
		xdv.updateGadget("videoa",{
			"3d": {
				visible: true,
				rotate: 180,
				playerSide: 1,
			},
		});

		xdv.updateGadget("videob",{
			"3d": {
				visible: true,
				rotate: 0,
				playerSide: -1,
			},
		});
	}

	View.Board.xdDisplay = function(xdv, aGame) {
		for(var i=0;i<this.pieces.length;i++) {
			var piece=this.pieces[i];
			var coord=aGame.getVCoord(piece.p);
			xdv.updateGadget("player#"+i,{
				base: {
					visible : true,
					x : coord[0],
					y : coord[1],
					rotate: piece.s==aGame.mViewAs?0:180,
				},
				"3d":{
					rotate: aGame.mViewAs==1?piece.a:180+piece.a,
					morphing: piece.sc?[0,0,1,0,0,0,0,0,0,0,0]:[1,0,0,0,0,0,0,0,0,0,0,0],
				}
			});
		}
		var ballCoord=aGame.getVCoord(this.ball);
		xdv.updateGadget("ball",{
			base: {
				visible : true,
				x : ballCoord[0],
				y : ballCoord[1],
			},
			"3d": {
				z : 500,				
			},
		});
		if (this.scrum) 
			SuperShowArrow(aGame,xdv,true,this.ball,this.scrumExit);
		else
			xdv.updateGadget("arrowscrum",{
				base : {
					visible: false,
				}
			});

		/* if(followBall)
			xdv.updateGadget("camera",{
				"3d": {
					targetX : 0,
					targetY : ballCoord[1],
					targetEasing: TWEEN.Easing.Sinusoidal.EaseInOut,
					traveling: true,
				},
			},2000); */
	}
	
	function SuperShowArrow(aGame,xdv,scrumArrow,pos0,pos1) {
		var coord0=aGame.getVCoord(pos0);
		var r0=Math.floor(pos0/BWIDTH);
		var c0=pos0%BWIDTH;
		var coord1=aGame.getVCoord(pos1);
		var r1=Math.floor(pos1/BWIDTH);
		var c1=pos1%BWIDTH;
		var rotations={
			"-1,-1": -135,
			"-1,0": 180,
			"-1,1": 135,
			"0,-1": -90,
			"0,1": 90,
			"1,-1": -45,
			"1,0": 0,
			"1,1": 45,
		}
		var rotations3D={
			"-1,-1": 135,
			"-1,0": 180,
			"-1,1": -135,
			"0,-1": 90,
			"0,1":  -90,
			"1,-1": 45,
			"1,0": 0,
			"1,1": -45,
		}
		var arrows={
				"-1,-1": 0,
				"-1,0": 1,
				"-1,1": 2,
				"0,-1": 3,
				"0,1":  4,
				"1,-1": 5,
				"1,0": 6,
				"1,1": 7,
			}
		var rotOffset= aGame.mViewAs==JocGame.PLAYER_B?180:0;
		var arrowId=scrumArrow?"arrowscrum":"arrow#"+arrows[""+(r1-r0)+","+(c1-c0)];
		xdv.updateGadget(arrowId,{
			base : {
				visible: true,
				x : (coord1[0]+coord0[0])/2,
				y : (coord1[1]+coord0[1])/2,
				rotate: rotations[""+(r1-r0)+","+(c1-c0)]+rotOffset,
			},
			"3d" : {			
				scale : [0.1,0.1,0.1],
				rotate : rotations3D[""+(r1-r0)+","+(c1-c0)]+rotOffset,
			}
		});
	}
		
	View.Board.xdBuildHTStateMachine = function(xdv, htsm, aGame) {
		var $this=this;
		
		var doScrum=false;
		var isFirst=this.first;
		if(this.scrum)
			aGame.ScrumEachDirection(this.ball,function(pos) {
				var cell=$this.board[pos];
				if(cell>=0 && $this.pieces[cell].s==$this.mWho)
					doScrum=true;
			});
		var cMove={
			seg1i: -1,
			seg1f: -1,
			seg1t: -1,
			seg1b: -1,
			seg2i: -1,
			seg2f: -1,
			seg2t: -1,
			seg2b: -1,
		}
		var ball=this.ball;
		
		function Highlight(item,type) {
			var piece=null,pieceIndex=-1,pos,isBall=false;
			if(typeof item=="object") {
				piece=item;
				pos=piece.p;
			} else {
				var pos=item;
				pieceIndex=$this.board[pos];
				if(pieceIndex>=0)
					piece=$this.pieces[pieceIndex];
				else if(pos==ball)
					isBall=true;
			}
			var classes="";
			switch(type) {
			case "normal": classes=aGame.mShowMoves?"choice-view":""; break;
			case "cancel": classes="choice-cancel"; break;
			}
			function Click() {
				switch(type) {
				case "normal":
					htsm.smQueueEvent("E_CLICK",{pos:pos,piece:piece,index:pieceIndex,ball:isBall});
					break;
				case "cancel":
					htsm.smQueueEvent("E_CANCEL",{pos:pos,piece:piece,index:pieceIndex,ball:isBall});
					break;
				}
			}
			var showTarget=(aGame.mShowMoves||(type=="cancel"));
			xdv.updateGadget("cell#"+pos,{
				base : {
					click : Click,
				},
				"2d" : {
					classes : classes,					
				},
				"3d" : {
					//visible : true,
					//color: 0xff0000,
					castShadow: false, //aGame.mShowMoves,
					receiveShadow: true,
					materials: { 
						"square" : {
						},
						"ring" : {
							//shininess : 0,
							//reflectivity: 0,
							color : type=="cancel"?0xff4400:0x227700,
							opacity: (showTarget)?1:0,
							transparent: !showTarget,
						}
					},					
				}
			});
			if(piece) 
				xdv.updateGadget("player#"+pieceIndex,{
					base : {
						click : Click,
					},
				});
			else if(isBall)
				xdv.updateGadget("ball",{
					base : {
						click : Click,
					},
				});
		}
		function EachPiece(fnt) {
			for(var i in $this.pieces) {
				var piece=$this.pieces[i];
				if(piece.s==$this.mWho)
					fnt(i,piece.p);
			}
		}
		function ShowArrow(pos0,pos1){
			SuperShowArrow(aGame,xdv,false,pos0,pos1);
		}
		function Clean(args) {
			for ( var pos = 0; pos < BWIDTH*BHEIGHT; pos++) {
				xdv.updateGadget("cell#" + pos, {
					"base" : {
						click : null,
					},
					"2d" : {
						classes : "",
					},
					"3d":{
						materials: {						
							"ring" : {
								opacity: 0,
								transparent: true,
							}
						}
					}
				});
			}
			for( var i in $this.pieces) {
				var piece=$this.pieces[i];
				xdv.updateGadget("player#"+i, {
					"base" : {
						click : null,
					},
				});				
			}
			xdv.updateGadget("ball", {
				"base" : {
					click : null,
				},
			});
			for(var i=0;i<8;i++)
				xdv.updateGadget("arrow#"+i, {
					"base" : {
						visible : false,
					},
				});
		}
		function Select1(args) {
			if(doScrum) {
				aGame.ScrumEachDirection($this.ball,function(pos) {
					var cell=$this.board[pos];
					if(cell>=0 && $this.pieces[cell].s==$this.mWho)
						Highlight(pos,"normal");
				});
			} else {
				EachPiece(function(index,pos) {
					Highlight(pos,"normal");
				});
			}
		}
		function Click1(args) {
			cMove.seg1f=args.pos;
			cMove.seg1i=args.index;
		}
		function Select1Dest(args) {
			Highlight(cMove.seg1f,"cancel");
			if(doScrum) {
				Highlight($this.ball,"normal")
				ShowArrow(cMove.seg1f,$this.ball);
			} else
				aGame.ScrumEachDirection(cMove.seg1f,function(npos) {
					if($this.board[npos]<0) {
						Highlight(npos,"normal");
						ShowArrow(cMove.seg1f,npos);
					}
				});

		}
		function Cancel1(args) {
			cMove.seg1i=-1;
			cMove.seg1f=-1;
		}
		function CheckClick(args) {
			if(args.ball)
				htsm.smQueueEvent("E_CLICK_BALL",args);
			else
				htsm.smQueueEvent("E_CLICK_CELL",args);
		}
		function Select1Ball(args) {
			aGame.ScrumEachDirection(ball,function(npos) {
				if($this.board[npos]<0) {
					var empty=0;
					aGame.ScrumEachDirection(npos,function(npos2) {
						if(($this.board[npos2]==-1 || npos2==cMove.seg1f) && npos2!=ball && npos2!=cMove.seg1t)
							empty++;
					});
					if(empty>0) {
						Highlight(npos,"normal");
						ShowArrow(ball,npos);
					}
				}
			});
			Highlight(ball,"cancel");
		}
		function Click1Dest(args) {
			cMove.seg1t=args.pos;
		}
		function Animate1(args) {
			AnimateMoveSegment(xdv,aGame,$this,cMove.seg1i,cMove.seg1t,cMove.seg1b,function() {
				htsm.smQueueEvent("E_ANIMATE_END",{});
				
			});
		}
		function Click1Ball(args) {
			cMove.seg1b=args.pos;
			ball=args.pos;
		}
		function Click2(args) {
			cMove.seg2i=args.index;
			cMove.seg2f=args.pos;
		}
		function Select2(args) {
			EachPiece(function(index,pos) {
				if(index!=cMove.seg1i)
					Highlight(pos,"normal");
			});
			if(cMove.seg1b>=0)
				Highlight(cMove.seg1b,"cancel");
			else
				Highlight(cMove.seg1t,"cancel");
		}
		function Cancel1Dest(args) {
			cMove.seg1t=-1;
		}
		function Cancel1Full(args) {
			var coord=aGame.getVCoord(cMove.seg1f);
			xdv.updateGadget("player#"+cMove.seg1i,{
				base : {
					x : coord[0],
					y : coord[1],
				},
			});
			var coord=aGame.getVCoord($this.ball);
			xdv.updateGadget("ball",{
				base : {
					x : coord[0],
					y : coord[1],
				},
			});
			ball=$this.ball;
			cMove.seg1i=-1;
			cMove.seg1f=-1;
			cMove.seg1t=-1;
			cMove.seg1b=-1;
		}
		function Select2Dest(args) {
			Highlight(cMove.seg2f,"cancel");
			aGame.ScrumEachDirection(cMove.seg2f,function(npos) {
				if(npos==cMove.seg1f || ($this.board[npos]<0 && npos!=cMove.seg1t) ) {
					Highlight(npos,"normal");
					ShowArrow(cMove.seg2f,npos);
				}
			});
		}
		function Cancel2(args) {
			cMove.seg2f=-1;
			cMove.seg2i=-1;
		}
		function Cancel2Dest(args) {
		}
		function Click2Dest(args) {
			cMove.seg2t=args.pos;
		}
		function Animate2(args) {
			AnimateMoveSegment(xdv,aGame,$this,cMove.seg2i,cMove.seg2t,cMove.seg2b,function() {
				htsm.smQueueEvent("E_ANIMATE_END",{});
			});
		}
		function Select2Ball(args) {
			aGame.ScrumEachDirection(ball,function(npos) {
				if(npos==cMove.seg1f || ($this.board[npos]<0 && npos!=cMove.seg1t && npos!=cMove.seg2f)) {
					var empty=0;
					aGame.ScrumEachDirection(npos,function(npos2) {
						if(($this.board[npos2]==-1 || npos2==cMove.seg1f || npos2==cMove.seg2f) && npos2!=ball && npos2!=cMove.seg1t && npos2!=cMove.seg2t)
							empty++;
					});
					if(empty>0) {
						Highlight(npos,"normal");
						ShowArrow(ball,npos);
					}
				}
			});
			Highlight(ball,"cancel");
		}
		function MakeMove(args) {
			var move={seg:[{f:cMove.seg1f,t:cMove.seg1t}]};
			if(cMove.seg1b>=0)
				move.seg[0].b=cMove.seg1b;
			if(cMove.seg2f>=0) {
				move.seg.push({f:cMove.seg2f,t:cMove.seg2t});
				if(cMove.seg2b>=0)
					move.seg[1].b=cMove.seg2b;
			}
			var ball=$this.ball;
			if(cMove.seg1b>=0)
				ball=cMove.seg1b;
			if(cMove.seg2b>=0)
				ball=cMove.seg2b;
			var empty=0;
			aGame.ScrumEachDirection(ball,function(pos) {
				if((pos==cMove.seg1f || pos==cMove.seg2f || $this.board[pos]<0) && pos!=cMove.seg1t && pos!=cMove.seg2t)
					empty++;
			});
			if(empty==1)
				aGame.PlaySound("whistle");
			aGame.HumanMove(move);
		}
		function Click2Ball(args) {
			cMove.seg2b=args.pos;
		}
		function CheckEnd(args) {
			if(isFirst || doScrum)
				htsm.smQueueEvent("E_MOVE_END",{});
			else {
				var ballRow=Math.floor(ball/BWIDTH);
				if((ballRow==0 && $this.mWho==JocGame.PLAYER_B) || (ballRow==BHEIGHT-1 && $this.mWho==JocGame.PLAYER_A))
					htsm.smQueueEvent("E_MOVE_END",{});
				else
					htsm.smQueueEvent("E_CONTINUE",{});
			}
		}
		
		htsm.smTransition("S_INIT", "E_INIT", "S_SELECT1", [ ]);

		htsm.smEntering("S_SELECT1",[ Select1 ]);
		htsm.smTransition("S_SELECT1", "E_CLICK", "S_SELECT1D", [ Click1 ]);
		htsm.smLeaving("S_SELECT1",[ Clean ]);
		
		htsm.smEntering("S_SELECT1D",[ Select1Dest ]);
		htsm.smTransition("S_SELECT1D", "E_CLICK", null, [ CheckClick ]);
		htsm.smTransition("S_SELECT1D", "E_CANCEL", "S_SELECT1", [ Cancel1 ]);
		htsm.smTransition("S_SELECT1D", "E_CLICK_CELL", "S_ANIMATE1", [ Click1Dest ]);
		htsm.smTransition("S_SELECT1D", "E_CLICK_BALL", "S_SELECT1B", [ Click1Dest ]);
		htsm.smLeaving("S_SELECT1D",[ Clean ]);
		
		htsm.smEntering("S_SELECT1B",[ Select1Ball ]);
		htsm.smTransition("S_SELECT1B", "E_CLICK", "S_ANIMATE1", [ Click1Ball ]);
		htsm.smTransition("S_SELECT1B", "E_CANCEL", "S_SELECT1D", [ Cancel1Dest ]);
		htsm.smLeaving("S_SELECT1B",[ Clean ]);

		htsm.smEntering("S_ANIMATE1",[ Animate1 ]);
		htsm.smTransition("S_ANIMATE1","E_ANIMATE_END",null,[ CheckEnd ]);
		htsm.smTransition("S_ANIMATE1","E_MOVE_END",null,[ MakeMove ]);
		htsm.smTransition("S_ANIMATE1","E_CONTINUE","S_SELECT2",[]);
		
		htsm.smEntering("S_SELECT2",[ Select2 ]);
		htsm.smTransition("S_SELECT2","E_CLICK","S_SELECT2D",[ Click2 ])
		htsm.smTransition("S_SELECT2","E_CANCEL","S_SELECT1",[ Cancel1Full ])		
		htsm.smLeaving("S_SELECT2",[ Clean ]);

		htsm.smEntering("S_SELECT2D",[ Select2Dest ]);
		htsm.smTransition("S_SELECT2D", "E_CLICK", null, [ CheckClick ]);
		htsm.smTransition("S_SELECT2D", "E_CANCEL", "S_SELECT2", [ Cancel2 ]);
		htsm.smTransition("S_SELECT2D", "E_CLICK_CELL", "S_ANIMATE2", [ Click2Dest ]);
		htsm.smTransition("S_SELECT2D", "E_CLICK_BALL", "S_SELECT2B", [ Click2Dest ]);
		htsm.smLeaving("S_SELECT2D",[ Clean ]);

		htsm.smEntering("S_SELECT2B",[ Select2Ball ]);
		htsm.smTransition("S_SELECT2B", "E_CLICK", "S_ANIMATE2", [ Click2Ball ]);
		htsm.smLeaving("S_SELECT2B",[ Clean ]);

		htsm.smEntering("S_ANIMATE2",[ Animate2 ]);
		htsm.smTransition("S_ANIMATE2","E_ANIMATE_END","S_DONE",[ MakeMove ]);
		
		
		htsm.smTransition(["S_SELECT1","S_SELECT1D","S_SELECT1B","S_ANIMATE1","S_SELECT2","S_SELECT2D","S_SELECT2B","S_ANIMATE2","S_DONE"],"E_END","S_DONE",[]);
		htsm.smEntering("S_DONE",[Clean]);
	}

	function AnimateScrum(xdv,aGame,aBoard,oldBoard,callback) {
		var animCount=1;
		function AnimEnd() {
			if(--animCount==0)
				callback();
		}
		for(var i=0;i<aBoard.pieces.length;i++) {
			var piece=aBoard.pieces[i];
			var piece0=oldBoard.pieces[i];
			if(piece.sc!=piece0.sc) {
				animCount++;
				xdv.updateGadget("player#"+i,{
					base: {
						rotate: piece.s==aGame.mViewAs?0:180,
					},
					"3d":{
						morphing: piece.sc?[0,0,1,0,0,0,0,0,0,0,0]:[1,0,0,0,0,0,0,0,0,0,0,0],
						rotate: aGame.mViewAs==1?piece.a:180+piece.a,
					}
				},500,AnimEnd);
			}
		}
		AnimEnd();
	}

	
	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		var $this=this;
		function MoveDone() {
			AnimateScrum(xdv,aGame,$this,aGame.mOldBoard,function() {
				aGame.MoveShown();				
			});
		}
		AnimateMoveSegment(xdv,aGame,aGame.mOldBoard,this.board[aMove.seg[0].t],aMove.seg[0].t,aMove.seg[0].b,function() {
			if(aMove.seg.length>1)
				AnimateMoveSegment(xdv,aGame,aGame.mOldBoard,$this.board[aMove.seg[1].t],aMove.seg[1].t,aMove.seg[1].b,function() {
					MoveDone();
					if($this.scrum)
						aGame.PlaySound("whistle");
				});
			else {
				MoveDone();
				if($this.scrum)
					aGame.PlaySound("whistle");
			}
		});
		return false;
	}

	View.Game.scrumDrawDashLine = function(ctx, x0, y0, x1, y1, nbdashes,
			dashpercent) {
		var a = 0;
		if (x1 != x0) {
			a = (y1 - y0) / (x1 - x0);
			var b = y0 - a * x0;
			for ( var i = 0; i < nbdashes; i++) {
				var xs = x0 + (x1 - x0) / nbdashes
						* (i + (100 - dashpercent) / 200);
				var xe = x0 + (x1 - x0) / nbdashes
						* (i + dashpercent / 100 + (100 - dashpercent) / 200);
				var ys = a * xs + b;
				var ye = a * xe + b;
				ctx.moveTo(xs, ys);
				ctx.lineTo(xe, ye);
			}
		} else {
			for ( var i = 0; i < nbdashes; i++) {
				var ys = y0 + (y1 - y0) / nbdashes
						* (i + (100 - dashpercent) / 200);
				var ye = y0 + (y1 - y0) / nbdashes
						* (i + dashpercent / 100 + (100 - dashpercent) / 200);
				ctx.moveTo(x0, ys);
				ctx.lineTo(x0, ye);
			}
		}
	}

	View.Game.scrumDraw15metersMarks = function(ctx, y, REALWIDTH, fieldW, h,
			fieldXstart) {
		var x = fieldXstart + fieldW * 15 / REALWIDTH;
		ctx.moveTo(x, y - h / 2);
		ctx.lineTo(x, y + h / 2);
		x = fieldXstart + fieldW * (REALWIDTH - 15) / REALWIDTH;
		ctx.moveTo(x, y - h / 2);
		ctx.lineTo(x, y + h / 2);
	}
	View.Game.scrumDraw22texts = function(ctx, y, cellSide, fieldW, fieldXstart) {
		// 22 text
		ctx.save();
		ctx.fillStyle = "rgba(255,255,255,0.3)";
		ctx.font = (cellSide / 3) + "pt Arial";
		ctx.translate(fieldXstart, y);
		ctx.rotate(-Math.PI / 2);
		ctx.textAlign = "center";
		ctx.fillText("22", 0, cellSide / 3 + 2);
		ctx.fillText("22", 0, fieldW - 4);
		ctx.restore();
	}

	View.Game.scrumDrawGoals = function(ctx,pixSize,boardW,boardH,xtraTouchCells,cellSide) {

		var fieldH = boardH - 2 * cellSide;
		var fieldYstart = cellSide;
		var fieldW = boardW;
		var fieldXstart = 0;

		// goals
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,255,255,1.0)";
		ctx.lineWidth = 4*pixSize;
		var goalwidth = fieldW * 10.8 / 100;
		var goalH = cellSide / 3;
		y = cellSide;
		x = fieldXstart + (fieldW - goalwidth) / 2;
		ctx.moveTo(x, y);
		ctx.lineTo(x - goalH, y - goalH);
		var x2 = fieldXstart + (fieldW + goalwidth) / 2;
		ctx.moveTo(x2, y);
		ctx.lineTo(x2 + goalH, y - goalH);
		ctx.moveTo(x2 + goalH / 3, y - goalH / 3);
		ctx.lineTo(x - goalH / 3, y - goalH / 3);

		y = fieldH + cellSide;
		x = fieldXstart + (fieldW - goalwidth) / 2;
		ctx.moveTo(x, y);
		ctx.lineTo(x - goalH, y + goalH);
		x2 = fieldXstart + (fieldW + goalwidth) / 2;
		ctx.moveTo(x2, y);
		ctx.lineTo(x2 + goalH, y + goalH);
		ctx.moveTo(x2 + goalH / 3, y + goalH / 3);
		ctx.lineTo(x - goalH / 3, y + goalH / 3);
		ctx.closePath();
		ctx.stroke();

		ctx.stroke();
	}

	View.Game.scrumDrawBoard2 = function(ctx,pixSize,boardW,boardH,xtraTouchCells) {
		ctx.translate(-boardW/2,-boardH/2);
		ctx.fillStyle = "rgba(0,185,0,0.3)";
		ctx.beginPath();
		ctx.rect(0, 0, boardW, boardH);
		ctx.closePath();
		ctx.fill();
		this.scrumDrawGoals(ctx,pixSize,boardW,boardH,xtraTouchCells,cellSide);
	}

	View.Game.scrumDrawBoard = function(ctx,pixSize,boardW,boardH,xtraTouchCells) {
		
		ctx.translate(-boardW/2,-boardH/2);
				
		/*var boardGradient = ctx.createRadialGradient(-boardW / 2,
				-boardW / 2, 0, boardW / 6 * 4,
				boardW / 6 * 2, boardW * 2);
		boardGradient.addColorStop(0, "#BAF445");
		boardGradient.addColorStop(1, "#008000");

		ctx.fillStyle = boardGradient;*/
		
		ctx.fillStyle = "rgb(0,185,0)";
		ctx.beginPath();
		ctx.rect(0, 0, boardW, boardH);
		ctx.closePath();
		ctx.fill();

		var fieldH = boardH - 2 * cellSide;
		var fieldYstart = cellSide;
		var fieldW = boardW - (xtraTouchCells * cellSide);
		var fieldXstart = (xtraTouchCells * cellSide) / 2;

		var REALLENGTH = 100;
		var REALWIDTH = 60;
		// goal lines
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,255,255,0.8)";
		ctx.lineWidth = 2*pixSize;
		ctx.moveTo(fieldXstart, fieldYstart);
		ctx.lineTo(fieldXstart + fieldW, fieldYstart);
		ctx.moveTo(fieldXstart, fieldYstart + fieldH);
		ctx.lineTo(fieldXstart + fieldW, fieldYstart + fieldH);
		ctx.closePath();
		ctx.stroke();

		// touch lines
		ctx.moveTo(fieldXstart, 0);
		ctx.lineTo(fieldXstart, boardH);
		ctx.moveTo(fieldXstart + fieldW, 0);
		ctx.lineTo(fieldXstart + fieldW, boardH);
		ctx.stroke();

		// top 22m line
		ctx.strokeStyle = "rgba(255,255,255,0.4)";
		ctx.beginPath();
		var y = fieldYstart + (fieldH * 22) / REALLENGTH;
		var h = cellSide;
		ctx.moveTo(fieldXstart, y);
		ctx.lineTo(fieldXstart + fieldW, y);
		this.scrumDraw15metersMarks(ctx, y, REALWIDTH, fieldW, h, fieldXstart);

		this.scrumDraw22texts(ctx, y, cellSide, fieldW, fieldXstart);

		// 50m line
		var y = fieldYstart + fieldH / 2;
		ctx.moveTo(fieldXstart, y);
		ctx.lineTo(fieldXstart + fieldW, y);
		this.scrumDraw15metersMarks(ctx, y, REALWIDTH, fieldW, h, fieldXstart);
		// bottom 22m line
		y = fieldYstart + fieldH - (fieldH * 22) / REALLENGTH;
		ctx.moveTo(fieldXstart, y);
		ctx.lineTo(fieldXstart + fieldW, y);
		this.scrumDraw15metersMarks(ctx, y, REALWIDTH, fieldW, h, fieldXstart);
		ctx.closePath();
		ctx.stroke();

		// 22 text
		this.scrumDraw22texts(ctx, y, cellSide, fieldW, fieldXstart);

		// 5m line
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,255,255,0.3)";
		y = fieldYstart + (fieldH * 5) / REALLENGTH;
		this.scrumDrawDashLine(ctx, fieldXstart + (fieldW * 5) / REALWIDTH, y,
				fieldXstart + (fieldW * (REALWIDTH - 5)) / REALWIDTH, y, 6, 60);
		// 5m line
		y = fieldYstart + fieldH - (fieldH * 5) / REALLENGTH;
		this.scrumDrawDashLine(ctx, fieldXstart + (fieldW * 5) / REALWIDTH, y,
				fieldXstart + (fieldW * (REALWIDTH - 5)) / REALWIDTH, y, 6, 60);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,255,255,0.3)";
		// 10m line
		y = fieldYstart + fieldH / 2 - (fieldH * 10) / REALLENGTH;
		this.scrumDrawDashLine(ctx, fieldXstart + (fieldW * 5) / REALWIDTH, y,
				fieldXstart + (fieldW * (REALWIDTH - 5)) / REALWIDTH, y, 6, 60);
		// 10m line
		y = fieldYstart + fieldH / 2 + (fieldH * 10) / REALLENGTH;
		this.scrumDrawDashLine(ctx, fieldXstart + (fieldW * 5) / REALWIDTH, y,
				fieldXstart + (fieldW * (REALWIDTH - 5)) / REALWIDTH, y, 6, 60);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,255,255,0.3)";
		// vertical lines
		var x = fieldXstart + (fieldW * 5) / REALWIDTH;
		this.scrumDrawDashLine(ctx, x, fieldYstart, x, boardH
				- fieldYstart, 40, 30);
		var x = fieldXstart + (fieldW * (REALWIDTH - 5)) / REALWIDTH;
		this.scrumDrawDashLine(ctx, x, fieldYstart, x, boardH
				- fieldYstart, 40, 30);
		ctx.closePath();
		ctx.stroke();

		var goalwidth = fieldW * 15 / 100;
		var goalH = cellSide / 3;
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,255,255,1.0)";
		ctx.lineWidth = 2*pixSize;
		ctx.moveTo(fieldXstart, fieldYstart);
		ctx.lineTo(fieldXstart - goalH / 3, fieldYstart - goalH / 6);
		ctx.moveTo(fieldXstart + fieldW, fieldYstart);
		ctx.lineTo(fieldXstart + fieldW + goalH / 3, fieldYstart - goalH / 6);
		ctx.moveTo(fieldXstart, fieldYstart + fieldH);
		ctx.lineTo(fieldXstart - goalH / 3, fieldYstart + fieldH + goalH / 6);
		ctx.moveTo(fieldXstart + fieldW, fieldYstart + fieldH);
		ctx.lineTo(fieldXstart + fieldW + goalH / 3, fieldYstart + fieldH
				+ goalH / 6);
		ctx.closePath();
		ctx.stroke();
		
		this.scrumDrawGoals(ctx,pixSize,boardW,boardH,xtraTouchCells,cellSide);
	}

	function AnimateMoveSegment(xdv,aGame,aBoard,pieceIndex,to,ball,callback) {
		var piece=aBoard.pieces[pieceIndex];
		var animCount=1;
		function AnimEnd() {
			if(--animCount==0)
				callback();
		}
		var coord=aGame.getVCoord(to);
		
		var from=piece.p;
		var r0=Math.floor(from/BWIDTH);
		var c0=from%BWIDTH;
		var r1=Math.floor(to/BWIDTH);
		var c1=to%BWIDTH;
		var rotation3D={
			"-1,-1": 135,
			"-1,0": 180,
			"-1,1": -135,
			"0,-1": 90,
			"0,1":  -90,
			"1,-1": 45,
			"1,0": 0,
			"1,1": -45,
		}[""+(r1-r0)+","+(c1-c0)];
		var rotation={
			"-1,-1": -135,
			"-1,0": 180,
			"-1,1": 135,
			"0,-1": -90,
			"0,1": 90,
			"1,-1": -45,
			"1,0": 0,
			"1,1": 45,
		}[""+(r1-r0)+","+(c1-c0)];
		
		xdv.updateGadget("player#"+pieceIndex,{
			"2d" : {
				rotate: (aGame.mViewAs==JocGame.PLAYER_A?0:180)+rotation,
			},
		});
		
		var sequence=[
		    	      [0,0,0,1,0,0,0,0,0,0,0,0],
		    	      [0,0,0,0,1,0,0,0,0,0,0,0],
		    	      [0,0,0,0,0,1,0,0,0,0,0,0],
		    	      [0,0,0,0,0,0,1,0,0,0,0,0],
		    	      [0,0,0,0,0,0,0,1,0,0,0,0],
		    	      [0,0,0,0,0,0,0,0,1,0,0,0],
		    	      [0,0,0,0,0,0,0,0,0,1,0,0],
		    	      [0,0,0,0,0,0,0,0,0,0,1,0],
		    	      [1,0,0,0,0,0,0,0,0,0,0,0],
		];
		var seqIndex=0;

		var coord0=aGame.getVCoord(piece.p);
		
		function Anim() {
			if(seqIndex==sequence.length) {
				xdv.updateGadget("player#"+pieceIndex,{
					base : {
						x : coord[0],
						y : coord[1],
					},
					"3d" : {
						rotate: (aGame.mViewAs==JocGame.PLAYER_A?0:180)+piece.a,
					},
				},500);
				AnimEnd();
				return;
			}
			var morphStep=sequence[seqIndex++];
			xdv.updateGadget("player#"+pieceIndex,{
				base : {
					x : coord0[0]+(coord[0]-coord0[0])*(seqIndex/sequence.length),
					y : coord0[1]+(coord[1]-coord0[1])*(seqIndex/sequence.length),
				},
				"3d" : {
					morphing: morphStep,
					rotate: (aGame.mViewAs==JocGame.PLAYER_A?180:0)+rotation3D,
				},
			},50,Anim);
		}
		Anim();

		if(ball>=0) {
			animCount++;
			var coordb=aGame.getVCoord(ball);
			xdv.updateGadget("ball",{
				base : {
					x : coordb[0],
					y : coordb[1],
				}
			},500,function() {
				AnimEnd();
			});
			/* if(followBall)
				xdv.updateGadget("camera",{
					"3d": {
						targetX : 0,
						targetY : coordb[1],
						targetEasing: TWEEN.Easing.Sinusoidal.EaseInOut,
						traveling: true,
					},
				},2000); */
		}
	}

	View.Board.xdShowEnd=function(xdv,aGame) {

		followBall=true;
		
		if(this.mWinner==JocGame.DRAW)
			return true;

		var animCount=1;
		function AnimEnd() {
			if(--animCount==0)
				aGame.EndShown();
		}
		for(var i=0;i<this.pieces.length;i++) {
			var piece=this.pieces[i];
			if(piece.s==this.mWinner) {
				animCount++;
				(function(i) {
					xdv.updateGadget("player#"+i,{
						"3d" : {
							morphing: [0,0,0,0,0,0,0,0,0,0,0,1],
						},
					},1000,function() {
						xdv.updateGadget("player#"+i,{
							"3d" : {
								morphing: [1,0,0,0,0,0,0,0,0,0,0,0],
							},
						},1000,AnimEnd);
					});
				})(i);
			}
		}
		
		xdv.updateGadget("ball",{
			"3d": {
				z : 0,				
			},
		},1000,function() {
			xdv.updateGadget("ball",{
				"3d": {
					z : 500,				
				},
			},1000,function() {
				AnimEnd();
			});
		});

		return false;
	}

})();
