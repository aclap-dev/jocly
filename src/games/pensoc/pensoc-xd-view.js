(function() {

	var fullPath, SIZE=1066,Coord;
	var SIZE3D=1,BLENDER2WORLD=1000;
	var FIX2D=0.859285714;
	var oceanLevel=-400,nbIcebergs=60;
	var psStartPos;
	
	var upMorphPos=[1,0];
	var layedMorphPos=[0,1];
	var scaleArrow3d=0.2;
	var fieldZ=500;
	var overBallZ=fieldZ+550;
	var xboard3dOffest=-950;
	
	
	var iceMat,iceMatBlack;


	var RestCoord={
		'1': [
		      [-6300,4100,fieldZ],[-4700,5000,fieldZ],[-3200,4800,fieldZ],
		      [1000,-5200,fieldZ],[2600,-5300,fieldZ],[3100,-3900,fieldZ],
		     ],
		'-1': [
		      [1000,-5200,fieldZ],[2600,-5300,fieldZ],[3100,-3900,fieldZ],
		      [-6300,4100,fieldZ],[-4700,5000,fieldZ],[-3200,4800,fieldZ],
		     ],
	}
	var RestClip=[
        [1200,200],[1400,200],[1600,200],
        [1200,0],[1400,0],[1600,0],
	];
	var StandClip=[
	    [0,200],[200,200],[400,200],
	    [0,0],[200,0],[400,0],
	];
	var LayClip=[
   	    [600,200],[800,200],[1000,200],
   	    [600,0],[800,0],[1000,0],
   	];
	var StandRotation={
		'1': [0,0,0,180,180,180],
		'-1': [180,180,180,0,0,0],
	}
	var RestRotation={
		'1': [90,45,0,315,225,270],			
		'-1': [315,225,270,90,45,0],
	}
	var Angles={
		'1': [0,315,270,225,180,135,90,45],
		'-1': [180,135,90,45,0,315,270,225],
	}
	
	View.Game.xdInit = function(xdv) {
		fullPath=this.mViewOptions.fullPath;
		
		if (typeof THREE != "undefined"){
			var path = fullPath+"/res/xd-view/textures/skybox/";
			var diffuse = 0xccccff, specular = 0x111111, shininess = 100, scale = 23;
			var format = ".jpg";
			var urls = [
				path + 'sb-nord' + format, path + 'sb-sud' + format,
				path + 'sb-top' + format, path + 'sb-bottom' + format,
				path + 'sb-ouest' + format, path + 'sb-est' + format
			];			
			var reflectionCube = new THREE.CubeTextureLoader().load( urls ); 
			iceMat = new THREE.MeshPhongMaterial( {
				color: diffuse,
				specular: specular,
				shininess: shininess,
				envMap: reflectionCube,
				combine: THREE.AddOperation,
				shading: THREE.SmoothShading,
				reflectivity: 1
			} );		
			iceMatBlack = new THREE.MeshPhongMaterial( {
				color: 0x0044aa,
				specular: specular,
				shininess: shininess,
				envMap: reflectionCube,
				combine: THREE.AddOperation,
				shading: THREE.FlatShading,
				reflectivity: 0.6,
			} );		
			
		}

		
		xdv.createGadget("board",{
			"2d": {
				type: "image",
				file: fullPath+"/res/images/ps-background.jpg",
				width: 12030,
				height: 10337,
			},
		});
		xdv.createGadget("goala",{
			base: {
				x: -1000,
				y: 5250,
			},
			"2d": {
				type: "sprite",
				file: fullPath+"/res/images/ps-images.png",
				clipx: 200,
				clipy: 400,
				clipwidth: 200,
				clipheight: 200,
				x: -859,
				y: 4511,
				width: 1718,
				height: 1718,
				z: 6,
			},
			"3d" : {
				type:"meshfile",
				file : fullPath+"/res/xd-view/meshes/goals3.js",
			}
		});
		xdv.createGadget("goalb",{
			base: {
				x: -1000,
				y: -5250,
			},
			"2d": {
				type: "sprite",
				file: fullPath+"/res/images/ps-images.png",
				clipx: 200,
				clipy: 400,
				clipwidth: 200,
				clipheight: 200,
				x: -859,
				y: -4511,
				width: 1718,
				height: 1718,
				z: 6,
				rotate: 180,
			},
			"3d" : {
				type:"meshfile",
				file : fullPath+"/res/xd-view/meshes/goals3.js",
			},
		});
		xdv.createGadget("ball",{
			"2d": {
				type: "sprite",
				file: fullPath+"/res/images/ps-images.png",
				clipx: 0,
				clipy: 400,
				clipwidth: 200,
				clipheight: 200,
				width: 859,
				height: 859,
				z: 3,
			},
 			"3d": {
				type: "custommesh3d",
				create: function(callback){ 
					var $this=this;
					var diffuse = 0xbbbbbb, specular = 0x444444, shininess = 20, scale = 23;
					this.getMaterialMap(fullPath + "/res/xd-view/meshes/soccer-texture2.jpg",function(diffMap) {
                        if(!diffMap)
                            return callback(null);
                        var material2 = new THREE.MeshPhongMaterial( {
                            color: diffuse,
                            specular: specular,
                            shininess: shininess,
                            combine: THREE.MixOperation,
                            shading: THREE.SmoothShading,
                            map: diffMap,
                        } );

                        var smooth=0;
                        var url="smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/soccerball2.js";
                        $this.getResource(url,function(geometry , materials){
                                geometry.computeVertexNormals(); // needed in normals not exported in js file!
                                var mesh= new THREE.Mesh( geometry , material2 );
                                callback(mesh);
                            });
                    });
					
					return null;
				}
			} 
		});
		var penguinTypes=["mama","daddy","baby"];
		for(var i=0;i<6;i++){
			(function(i){
				var type=penguinTypes[i%3];
				var team=i<3?"A":"B";
				var penguinScale=0.2;
				xdv.createGadget("penguin#"+i,{
					"2d": {
						type: "sprite",
						file: fullPath+"/res/images/ps-images.png",
						clipwidth: 200,
						clipheight: 200,
						width: 1031,
						height: 1031,
						z: 4,
					},
					"3d": {
						type: "custommesh3d",
						scale: [penguinScale,penguinScale,penguinScale],
						morphing: upMorphPos,
						create: function(callback){
							var $this=this;
							
							function checkMaps(){
								nbMaps--;
								if (nbMaps==0){
									// all maps loaded, go for mesh
								}
							}
							
							var diffuse = 0xffffff, specular = 0x111111, shininess = 50, scale = 23;
							this.getMaterialMap(fullPath + "/res/xd-view/meshes/"+type+"-"+team+"-diffusex512.jpg",function(diffMap) {
                                if(!diffMap)
                                    return callback(null);
                                var material2 = new THREE.MeshPhongMaterial( {
                                    color: diffuse,
                                    specular: specular,
                                    shininess: shininess,
                                    combine: THREE.MixOperation,
                                    shading: THREE.SmoothShading,
                                    morphTargets: true,
                                    map: diffMap,
                                } );

                                var smooth = 0;
                                var url = "smoothedfilegeo|" + smooth + "|" + fullPath + "/res/xd-view/meshes/" + type + "-animated.js";
                                $this.getResource(url, function(geometry, materials) {
                                    geometry.computeVertexNormals();
                                    // needed if normals not exported in js file!
                                    var mesh = new THREE.Mesh(geometry, material2);
                                    callback(mesh);
                                });

                            });
							return null;
						}
					}
				});
			})(i);
		}
		
		for(var pos=0;pos<64;pos++)
			(function(pos) {
				xdv.createGadget("text#"+pos,{
					"2d": {
						type : "element",
						width : 386,
						height : 386,
						initialClasses: "notation",
						css : {
							"text-align" : "center",
						},
						z : 2,
						display : function(element, width, height) {
							element.css({
								"font-size" : (height * .6) + "pt",
								"line-height" : (height * 1) + "px",
							}).text(pos);
						},
					},
					"3d":{
						type: "custommesh3d",
						create: function() {
                            var $this = this;
                            this.getResource('font|'+fullPath+
                                '/res/xd-view/fonts/helvetiker_regular.typeface.json',
                                function(font) {
                                var gg=new THREE.TextGeometry(""+pos,{
                                    size: 0.25,
                                    height: 0.05,
                                    curveSegments: 6,
                                    font: font,
                                });
                                gg.center();
                                var gm=new THREE.MeshPhongMaterial({color:0x000000});
                                var mesh= new THREE.Mesh( gg , gm );
                                $this.objectReady(mesh);
                            });
							return null;
						},
					}
				});						
				xdv.createGadget("cell#"+pos,{
					"3d":{
						type : "custommesh3d",
						scale: [1.1,1.1,1],
						create: function(callback){
							var url="smoothedfilegeo|0|"+fullPath+"/res/xd-view/meshes/icecube1.js";
							this.getResource(url,function(geometry , materials){
								geometry.computeVertexNormals(); // needed in normals not exported in js file!
								
								var r=Math.floor(pos/8);
								var c=pos%8;
								var mesh= new THREE.Mesh( geometry , (r+c)%2?iceMat:iceMatBlack );
								callback(mesh);
							});
							return null;
						},
						flatShading: true,
						rotate: Math.ceil(Math.random()*4)*90,
						//rotateX: Math.random()*3-1.5,
						//rotateY: Math.random()*3-1.5,
					}
				});
			})(pos);
		

		function CreateButton(button) {
			xdv.createGadget(button.name+"-image",{
				"2d": {
					type: "sprite",
					file: fullPath+"/res/images/ps-images.png",
					clipwidth: button.clipwidth,
					clipheight: 200,
					width: button.width,
					height: 1200,
					clipx: button.clipx,
					clipy: button.clipy,
					x: 4726,
					y: button.y,
					z: 4,
				},
			});
			xdv.createGadget(button.name+"-background",{
				"2d": {
					type: "sprite",
					file: fullPath+"/res/images/ps-images.png",
					clipwidth: 300,
					clipheight: 200,
					width: 2062,
					height: 1203,
					clipx: 0,
					clipy: 600,
					x: 4726,
					y: button.y,
					z: 3,
				},
			});
			xdv.createGadget(button.name+"-highlight",{
				"2d": {
					type: "element",
					width: 2234,
					height: 1374,
					x: 4726,
					y: button.y,
					z: 2,
					css: {
						"background-color": "Orange",
						"border-radius": "10%",
					},
				},
			});
			var but3d=false;
			var meshfile="";
			if (button.name==="up"){
				but3d=true;
			}
			xdv.createGadget(button.name+"-clicker",{
				"2d": {
					type: "element",
					width: 2234,
					height: 1374,
					x: 4726,
					y: button.y,
					z: 10,
					initialClasses: "clicker",
					opacity: 0,
					css: {
						"border-radius": "10%",
					},
				},
				"3d":{
					type: but3d?"meshfile":"",
					scale:[scaleArrow3d,scaleArrow3d,scaleArrow3d*5],
					flatShading: true,
					z:1500,
					rotateX:90,
					file : fullPath+"/res/xd-view/meshes/arrow.js",
					materials: { 
						"mat.arrow" : {
							color : 0x0088ff,
						}
					},
				}
			});
		}

		var buttons=[{
			name: "up",
			width: 1546,
			clipx: 300,
			clipy: 600,
			clipwidth: 300,
			y: 2148,
		},{
			name: "slide",
			width: 1546,
			clipx: 600,
			clipy: 600,
			clipwidth: 300,
			y: 3694,
		},{
			name: "penguin0",
			width: 1031,
			clipx: 0,
			clipy: 200,
			clipwidth: 200,
			y: -1460,
		},{
			name: "penguin1",
			width: 1031,
			clipx: 200,
			clipy: 200,
			clipwidth: 200,
			y: -2921,
		},{
			name: "penguin2",
			width: 1031,
			clipx: 200,
			clipy: 200,
			clipwidth: 200,
			y: -4382,
		}];
		
		for(var i=0;i<buttons.length;i++)
			CreateButton(buttons[i]);

		xdv.createGadget("cancel-image",{
			"2d": {
				type: "sprite",
				file: fullPath+"/res/images/ps-images.png",
				clipwidth: 200,
				clipheight: 200,
				width: 1031,
				height: 1031,
				clipx: 600,
				clipy: 400,
				x: 4897,
				y: 172,
				z: 4,
			},
		});
		xdv.createGadget("cancel-highlight",{
			"2d": {
				type: "element",
				width: 1203,
				height: 1203,
				x: 4897,
				y: 171,
				z: 2,
				css: {
					"background-color": "transparent",
					"border": "6px solid Magenta",
					"border-radius": "50%",
				},
			},
		});
		xdv.createGadget("cancel-clicker",{
			"2d": {
				type: "element",
				width: 2234,
				height: 1374,
				x: 4897,
				y: 171,
				z: 10,
				initialClasses: "clicker",
				opacity: 0,
				css: {
					"border-radius": "10%",
				},
			},
		});
		
		for(var i=0;i<8;i++) {
			xdv.createGadget("rotator-image#"+i,{
				"2d": {
					type: "sprite",
					file: fullPath+"/res/images/ps-images.png",
					clipwidth: 200,
					clipheight: 200,
					width: 1031,
					height: 1031,
					clipx: 400,
					clipy: 400,
					z: 4,
				},
			});
			xdv.createGadget("rotator-highlight#"+i,{
				"2d": {
					type: "element",
					width: 1031,
					height: 1031,
					z: 2,
					css: {
						"background-color": "transparent",
						"border": "6px solid Orange",
						"border-radius": "50%",
					},
				},
			});			
			xdv.createGadget("rotator-clicker#"+i,{
				"2d": {
					type: "element",
					width: 1200,
					height: 1200,
					z: 10,
					initialClasses: "clicker",
					opacity: 0,
					css: {
						"border-radius": "50%",
					},
				},
			});			
			xdv.createGadget("rotator-plot#"+i,{
				"2d": {
					type: "element",
					width: 429,
					height: 429,
					z: 1,
					css: {
						"background-color": "White",
						"border-radius": "50%",
					},
				},
			});			
		}
		xdv.createGadget("rotator-subject",{
			"2d": {
				type: "sprite",
				file: fullPath+"/res/images/ps-images.png",
				clipwidth: 200,
				clipheight: 200,
				width: 1031,
				height: 1031,
				clipx: 600,
				clipy: 200,
				x: 4124,
				y: 3007,
				z: 4,
				rotate: 0,
			},
		});
		xdv.createGadget("rotator-circle",{
			"2d": {
				type: "element",
				width: 2577,
				height: 2577,
				x: 4124,
				y: 3007,
				z: 1,
				css: {
					"background-color": "transparent",
					"border": "6px solid White",
					"border-radius": "50%",
				},
			},
		});			
		xdv.createGadget("surround", {
			"3d" : {
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
						path + 'sb-nord' + format, path + 'sb-sud' + format,
						path + 'sb-top' + format, path + 'sb-bottom' + format,
						path + 'sb-ouest' + format, path + 'sb-est' + format
					];
					
					var textureCube =  new THREE.CubeTextureLoader().load( urls ); // THREE.ImageUtils.loadTextureCube( urls, new THREE.CubeRefractionMapping() );
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
				scale: [100,100,3],
				z : oceanLevel,
				smooth: 0 ,
			},
		});
		xdv.createGadget("iceberg", {
			"3d": {
				type: "custommesh3d",
				z: oceanLevel+900,
				create: function(callback){ 
					var $this=this;
					var nbMaps=1;

					
					function checkMaps(){
						nbMaps--;
						if (nbMaps==0){
							// all maps loaded, go for mesh
							var smooth=0;
							var url="smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/banquise4.js";
							$this.getResource(url,function(geometry , materials){
								geometry.computeVertexNormals(); // needed in normals not exported in js file!
								var mesh= new THREE.Mesh( geometry , iceMat );
								callback(mesh);
							});
						}
					}

					checkMaps();
					return null;
				}
			}
		});
	
		var rMin=15,rMax=65;
		var sizeMin=.1,sizeMax=1;
		for(var i=0;i<nbIcebergs;i++){
			var scale=sizeMin+(sizeMax-sizeMin)*Math.random();
			var r=(rMin+(rMax-rMin)*Math.random())*BLENDER2WORLD;
			var alpha=Math.random()*Math.PI*2;

			xdv.createGadget("iceberg#"+i, {
				"3d" : {
                    harbor: false,
					type : "meshfile",
					file : fullPath+"/res/xd-view/meshes/iceberg-small.js",
					scale:[scale,scale,scale],
					x:r*Math.cos(alpha),
					y:r*Math.sin(alpha),
					rotateX: Math.random()*360,
					rotate: Math.random()*360,
					z:oceanLevel-500,
					smooth: 0 ,
				},
			});
		}
		
		// flat screens
		function createScreen(videoTexture) {
			var $this=this;
			var gg=new THREE.PlaneGeometry(4,3,1,1);
			var gm=new THREE.MeshPhongMaterial({color:0xffffff,map:videoTexture,shading:THREE.FlatShading});
			var mesh = new THREE.Mesh( gg , gm );
			$this.objectReady(mesh); 
			return null;
		};
		var scaleScreen=2;
		var zScreen=2000;
		var xScreen=7000;
		var yScreen=7000;
		var screenAngle=45;
		var thumbDist=.99;
		var thumbOffset=3000;
		xdv.createGadget("videoa",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return createScreen.call(this,videoTexture);
				},
				z: zScreen,
				x: xScreen,
				y: -yScreen,
				rotate: -screenAngle,
				scale: [scaleScreen,scaleScreen,scaleScreen],
			},
		});
		xdv.createGadget("videoabis",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return createScreen.call(this,videoTexture);
				},
				z: zScreen-1000,
				x: thumbDist*xScreen+thumbOffset,
				y: -thumbDist*yScreen+thumbOffset,
				rotate: -(screenAngle),
				scale: [scaleScreen/4,scaleScreen/4,scaleScreen/4],
			},
		});
		xdv.createGadget("videob",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return createScreen.call(this,videoTexture);
				},
				z: zScreen,
				x: -xScreen,
				y: yScreen,
				rotate: -(180+screenAngle),
				scale: [scaleScreen,scaleScreen,scaleScreen],
			},
		});	
		xdv.createGadget("videobbis",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return createScreen.call(this,videoTexture);
				},
				z: zScreen-1000,
				x: -thumbDist*xScreen-thumbOffset,
				y: thumbDist*yScreen-thumbOffset,
				rotate: -(180+screenAngle),
				scale: [scaleScreen/4,scaleScreen/4,scaleScreen/4],
			},
		});	
	}
	
	
	View.Game.xdBuildScene = function(xdv) {

		Coord=[];
		for(var pos=0;pos<64;pos++) {
			var r=Math.floor(pos/8);
			var c=pos%8;
			var x0=(r-3.5)*SIZE;
			var y0=(c-3.5)*SIZE;
			var angle=135*Math.PI/180;
			var x=x0*Math.cos(angle)+y0*Math.sin(angle);
			var y=-x0*Math.sin(angle)+y0*Math.cos(angle);
			if(this.mViewAs==-1) {
				x=-x;
				y=-y;
			}
			Coord.push([-1000+x,y,fieldZ]);
		}

		for(var i=0;i<8;i++) {
			var x=4800-this.mViewAs*Math.cos((i*45-90)*Math.PI/180)*1500;
			var y=3500+this.mViewAs*Math.sin((i*45-90)*Math.PI/180)*1500;
			xdv.updateGadget("rotator-image#"+i,{
				"2d": {
					x: x*FIX2D,
					y: y*FIX2D,
					rotate: -i*45+(this.mViewAs==-1?180:0),
				},
			});
			xdv.updateGadget("rotator-highlight#"+i,{
				"2d": {
					x: x*FIX2D,
					y: y*FIX2D,
				},
			});			
			xdv.updateGadget("rotator-clicker#"+i,{
				"2d": {
					x: x*FIX2D,
					y: y*FIX2D,
				},
			});			
			xdv.updateGadget("rotator-plot#"+i,{
				"2d": {
					x: x*FIX2D,
					y: y*FIX2D,
				},
			});		
		}
		
		xdv.updateGadget("board",{
			base: {
				visible: true,
			}
		});
		xdv.updateGadget("goala",{
			base: {
				visible: true,
			},
			"3d":{
				scale:[1.4,1,1],
				flatShading: false,
				materials: {
					"filet": {
						wireframe: true ,
					}
				},
				z:fieldZ,
			},
		});
		xdv.updateGadget("goalb",{
			base: {
				visible: true,
			},
			"3d":{
				scale:[1.4,1,1],
				flatShading: false,
				materials: {
					"filet": {
						wireframe: true ,
					}
				},
				rotate:180,
				z:fieldZ,
			},
		});
		for(var pos=0;pos<64;pos++) {
			var coord=Coord[pos];
			xdv.updateGadget("text#"+pos,{
				"base":{
					visible: this.mNotation,
				},
				"2d": {
					x: coord[0]*FIX2D,
					y: coord[1]*FIX2D,
				},
				"3d": {
					x: coord[0],
					y: coord[1],
					z: coord[2],
					rotateX:-90,
					color: 0x0000ff,
				},
			});
			xdv.updateGadget("cell#"+pos,{
				"3d" : {
					x: coord[0],
					y: coord[1],
					z: 0,
					rotate: 45,
					visible:true,
					receiveShadow: true,
				}
			});
		}
		xdv.updateGadget("surround",{
			"3d" : {
				visible: true,
			}
		});
		xdv.updateGadget("ocean",{
			"3d" : {
				visible: true,
				receiveShadow: true,
			}
		});
		xdv.updateGadget("iceberg",{
			"3d" : {
				visible: true,
				receiveShadow: true,
				rotate:45,
				scale:[1.05,1.05,1],
				x:xboard3dOffest,
			}
		});
		for(var i=0;i<nbIcebergs;i++){
			xdv.updateGadget("iceberg#"+i, {
				"3d" : {
					visible:true,
				}
			});
		}
		
		xdv.updateGadget("videoa",{
			"3d": {
				visible: true,
				playerSide: 1,
			},
		});
		xdv.updateGadget("videoabis",{
			"3d": {
				visible: true,
				playerSide: -1,
			},
		});

		xdv.updateGadget("videob",{
			"3d": {
				visible: true,
				playerSide: -1,
			},
		});
		xdv.updateGadget("videobbis",{
			"3d": {
				visible: true,
				playerSide: 1,
			},
		});
		
	}

	View.Board.penguinCoord = function(aGame,index,pos) {
		if(pos<0)
			return RestCoord[aGame.mViewAs][index];
		else{
			var pz=Coord[pos][2];
			if((this.ball>=0&&this.ball==pos) || (this.ball<0 && (pos==27 || pos==28 || pos==35 || pos==36)))
				pz=overBallZ;
			return [Coord[pos][0],Coord[pos][1],pz];
		}
	}

	View.Board.penguinClip = function(aGame,index,pos,dir) {
		if(pos<0)
			return RestClip[index];
		else if(dir<0)
			return StandClip[index];
		else
			return LayClip[index];
	}
	View.Board.penguinMorph = function(aGame,index,pos,dir) {
		if(pos<0)
			return upMorphPos;
		else if(dir<0)
			return upMorphPos;
		else
			return layedMorphPos;
	}
	
	View.Board.penguinRotation = function(aGame,index,pos,dir) {
		if(pos<0)
			return RestRotation[aGame.mViewAs][index];
		else if(dir<0)
			return StandRotation[aGame.mViewAs][index];
		else
			return Angles[aGame.mViewAs][dir];
	}

	View.Board.xdDisplay = function(xdv, aGame) {
		var coord;
		if(this.ball==-1){
			coord=[-1000,0,fieldZ];
		}
		else{
			coord=Coord[this.ball];
		}
		xdv.updateGadget("ball",{
			base: {
				visible: true,
				x: coord[0],
				y: coord[1],				
			},
			"2d": {
				x: coord[0]*FIX2D,
				y: coord[1]*FIX2D,
			},
			"3d":{
				z:oceanLevel+1200,
				scale: [0.3,0.3,0.3],			
			}
		});
		for(var i=0;i<this.penguins.length;i++) {
			var penguin=this.penguins[i];
			var coord=this.penguinCoord(aGame,i,penguin.p);
			var clip=this.penguinClip(aGame,i,penguin.p,penguin.d);
			var rotation=this.penguinRotation(aGame,i,penguin.p,penguin.d);
			var morph=this.penguinMorph(aGame,i,penguin.p,penguin.d);
			xdv.updateGadget("penguin#"+i,{
				base: {
					visible: true,
					x: coord[0],
					y: coord[1],
					rotate: rotation,
				},
				"2d": {
					x: coord[0]*FIX2D,
					y: coord[1]*FIX2D,
					clipx: clip[0],
					clipy: clip[1],
				},
				"3d":{
					castShadow: true,
					z: coord[2],
					morphing: morph,
					rotate: 180-rotation,
				}
			});
		}
	}
	
	View.Board.xdBuildHTStateMachine = function(xdv, htsm, aGame) {
		var $this=this;
		var move={
			i: -1,
			p: -1,
			md: -1,
			d: -1,
		}
		var moves=this.mMoves;
		var disposable=[];
		
		
		function MakeClickablePieces(pos,callback){
			if(($this.ball>=0)&&($this.ball==pos)){
				xdv.updateGadget("ball",{
					"3d":{
						click:callback,
					}
				});
			}
			for (i=0;i<6;i++)
				if(($this.penguins[i].p>0)&&($this.penguins[i].p==pos)){
					xdv.updateGadget("penguin#"+i,{
						"3d":{
							click:callback,
						}
					});
				}
		}

		function ClickablePenguin(index,callback,color) {
			var coord=$this.penguinCoord(aGame,index,$this.penguins[index].p);
			
			xdv.updateGadget("penguin#"+index,{
				"3d":{
					click:callback,
				}
			});
			
			MakeClickablePieces($this.penguins[index].p,callback);
			
			MakeClicker(coord,callback);
			MakeHighlighter(coord,color);
			var pType=index%3;
			var clip=StandClip[index];
			xdv.updateGadget("penguin"+pType+"-image",{
				"2d": {
					visible: true,
					clipx: clip[0],
					clipy: clip[1],
				},
			});
			xdv.updateGadget("penguin"+pType+"-background",{
				"2d": {
					visible: true,
				},
			});
			xdv.updateGadget("penguin"+pType+"-highlight",{
				"2d": {
					visible: true,
				},
			});
			xdv.updateGadget("penguin"+pType+"-clicker",{
				"base": {
					visible: true,
					click: callback,
				},
			});
		}
		
		function ClickablePos(pos,callback,color) {
			var coord=Coord[pos];
			MakeClickablePieces(pos,callback);
			MakeClicker(coord,callback);
			MakeHighlighter(coord,color);
		}
		
		function ClickableArrow(pos,callback,dir) {
			if(pos!==null) {
				var coord=Coord[pos];
				MakeClicker(coord,callback);
				MakeArrow(coord,dir);
			}
			xdv.updateGadget("rotator-plot#"+dir,{
				"2d": {
					visible: true,
				},
			});				
			xdv.updateGadget("rotator-highlight#"+dir,{
				"2d": {
					visible: true,
				},
			});				
			xdv.updateGadget("rotator-clicker#"+dir,{
				"2d": {
					visible: true,
					click: callback,
				},
			});				
			var clip=LayClip[move.i];
			xdv.updateGadget("rotator-subject",{
				"2d": {
					visible: true,
					click: callback,
					clipx: clip[0],
					clipy: clip[1],
					rotate: Angles[aGame.mViewAs][move.md],
				},
			});				
			xdv.updateGadget("rotator-circle",{
				"2d": {
					visible: true,
				}
			});
		}
		function MakeArrow(coord,dir) {
			var id="arrow#"+disposable.length;
			disposable.push(id);
			xdv.createGadget(id,{
				base: {
					x: coord[0],
					y: coord[1],
					width: SIZE*1.3,
					height: SIZE*1.3,
					rotate: Angles[aGame.mViewAs][dir],
				},
				"2d": {
					type: "sprite",
					file: fullPath+"/res/images/ps-images.png",
					clipwidth: 200,
					clipheight: 200,
					x: coord[0]*FIX2D,
					y: coord[1]*FIX2D,
					width: 1031,
					height: 1031,
					clipx: 800,
					clipy: 400,
					z: 1,
				},
				"3d": {
					z: coord[2],
					//rotate: Angles3d[aGame.mViewAs][dir]+180,
					type: "meshfile",
					scale:[scaleArrow3d,scaleArrow3d,scaleArrow3d],
					flatShading: true,
					file : fullPath+"/res/xd-view/meshes/arrow.js",
					materials: { 
						"mat.arrow" : {
							color : 0xffcc00,
							opacity: 1,
							specular: {r:0,g:0,b:0},
						}
					},				
					rotate: -Angles[aGame.mViewAs][dir],	
				}
			});
			xdv.updateGadget(id,{
				base: {
					visible: true,
				},
			});			
		}
		var ringScale=0.6;
		function MakeClicker(coord,callback) {
			var id="clicker#"+disposable.length;
			disposable.push(id);
			xdv.createGadget(id,{
				base: {
					x: coord[0],
					y: coord[1],
					width: SIZE*1.1,
					height: SIZE*1.1,
					visible: true,
					click: callback,
				},
				"2d": {
					type: "element",
					initialClasses: "clicker",
					opacity: 0,
					css: {
						"border-radius": "50%",
					},
					z: 10,
					x: coord[0]*FIX2D,
					y: coord[1]*FIX2D,
					width: SIZE*1.1*FIX2D,
					height: SIZE*1.1*FIX2D,
				},
				"3d":{
					z: fieldZ,
					type: "meshfile",
					file : fullPath+"/res/xd-view/meshes/ring-target.js",
					flatShading: true,
					castShadow: false,
					smooth : 0,
					rotate:45,
					scale:[ringScale,ringScale,ringScale],
					materials: { 
						"square" : {
							transparent: true,
							opacity: 0,
						},
						"ring" : {
							//color : 0xffcc00,
							//opacity: 1,
							transparent: true,
							opacity: 0,
							specular: {r:0,g:0,b:0},
						}
					},							
				}	
			});
			xdv.updateGadget(id,{
				base: {
					visible: true,
				},
			});			
		}
		
		function MakeHighlighter(coord,color) {
			var id="highlighter#"+disposable.length;
			var color3d=color=="Orange"?0xffcc00:0xff00cc;
			disposable.push(id);
			xdv.createGadget(id,{
				base: {
					x: coord[0],
					y: coord[1],
					width: SIZE*1.1,
					height: SIZE*1.1,
					visible: true,
				},
				"2d": {
					type: "element",
					css: {
						"background-color": "transparent",
						"border": "6px solid "+color,
						"border-radius": "50%",
					},
					z: 1,
					x: coord[0]*FIX2D,
					y: coord[1]*FIX2D,
					width: SIZE*1.1*FIX2D,
					height: SIZE*1.1*FIX2D,
				},
				"3d":{
					//z: coord[2],
					z: fieldZ,
					type: "meshfile",
					file : fullPath+"/res/xd-view/meshes/ring-target.js",
					flatShading: true,
					smooth : 0,
					rotate:45,
					scale:[ringScale,ringScale,ringScale],
					materials: { 
						"square" : {
							transparent: true,
							opacity: 0,
						},
						"ring" : {
							color : color3d,
							opacity: 1,
							specular: {r:0,g:0,b:0},
						}
					},							
				}
			});
			xdv.updateGadget(id,{
				base: {
					visible: true,
				},
			});
		}
		
		function ShowButton(which,callback,pos) {
			xdv.updateGadget(which+"-image",{
				"2d": {
					visible: true,
				}
			});
			xdv.updateGadget(which+"-background",{
				"2d": {
					visible: true,
				}
			});
			xdv.updateGadget(which+"-highlight",{
				"2d": {
					visible: true,
				}
			});
			var coord3d=[0,0,fieldZ];
			if (pos!==undefined)
				coord3d=Coord[pos];
			xdv.updateGadget(which+"-clicker",{
				base: {
					visible: true,
					click: callback,
				},
				"3d":{
					x:coord3d[0],
					y:coord3d[1],
					//z:coord3d[2],
				}
			});
		}
		
		function ShowCancel(args) {
			xdv.updateGadget("cancel-image",{
				"2d": {
					visible: true,
				},
			});				
			xdv.updateGadget("cancel-highlight",{
				"2d": {
					visible: true,
				},
			});				
			xdv.updateGadget("cancel-clicker",{
				"2d": {
					visible: true,
					click: function() {
						htsm.smQueueEvent("E_CANCEL",{});
					},
				},
			});
		}
		
		function Clean(args) {
			disposable.forEach(function(id) {
				xdv.removeGadget(id);				
			});
			["ball","penguin#0","penguin#1","penguin#2","penguin#3","penguin#4","penguin#5"].forEach(function(which) {
				xdv.updateGadget(which,{base:{click:null}});
			});

			["up","slide","penguin0","penguin1","penguin2"].forEach(function(which) {
				xdv.updateGadget(which+"-image",{
					"2d": {
						visible: false,
					},
				});
				xdv.updateGadget(which+"-background",{
					"2d": {
						visible: false,
					},
				});
				xdv.updateGadget(which+"-highlight",{
					"2d": {
						visible: false,
					},
				});
				xdv.updateGadget(which+"-clicker",{
					base: {
						visible: false,
						click: null,
					},
				});				
			});
			for(var d=0;d<8;d++) {
				xdv.updateGadget("rotator-image#"+d,{
					"2d": {
						visible: false,
					},
				});				
				xdv.updateGadget("rotator-highlight#"+d,{
					"2d": {
						visible: false,
					},
				});				
				xdv.updateGadget("rotator-plot#"+d,{
					"2d": {
						visible: false,
					},
				});				
				xdv.updateGadget("rotator-clicker#"+d,{
					"2d": {
						visible: false,
						click: null,
					},
				});				
			}
			xdv.updateGadget("rotator-subject",{
				"2d": {
					visible: false,
				},
			});				
			xdv.updateGadget("rotator-circle",{
				"2d": {
					visible: false,
				},
			});				
			xdv.updateGadget("cancel-image",{
				"2d": {
					visible: false,
				},
			});				
			xdv.updateGadget("cancel-highlight",{
				"2d": {
					visible: false,
				},
			});				
			xdv.updateGadget("cancel-clicker",{
				"2d": {
					visible: false,
					click: null,
				},
			});				
		}
		
		function SelectPenguin(args) {
			var indexes={};
			$this.mMoves.forEach(function(m) {
				indexes[m.i]=true;
			});
			for(var i in indexes)
				(function(i) { 
					ClickablePenguin(i,function() {
						psStartPos=$this.penguins[i].p;
						move.i=i;
						if($this.penguins[i].p<0)
							htsm.smQueueEvent("E_DRY",{});
						else
							htsm.smQueueEvent("E_SELECT",{});
					},"Orange");
				})(i)
		}
		
		function AnimateDry(args) {
			$this.psAnimateDry(xdv,aGame,move.i,function() {
				htsm.smQueueEvent("E_DRY_DONE",{});									
			});
		}
		
		function AnimateSlide(args) {
			$this.psAnimateSlide(xdv,aGame,move.i,move.p,move.md,function() {
				htsm.smQueueEvent("E_SELECT_DIR",{});				
			});
		}
		
		function SelectTarget(args) {
			var poss={};
			moves.forEach(function(m) {
				if(m.i==move.i)
					poss[m.p]=m;
			});
			var pCount=0;
			var slideCount=0;
			for(var pos in poss) {
				var m=poss[pos];
				if(m.md>=0)
					slideCount++;
				pCount++;
			}
			if(pCount==1) {
				move.p=pos;
				move.md=poss[pos].md;
				if(move.md<0) {
					move.d=-1;
					htsm.smQueueEvent("E_STANDUP",{});
				} else
					htsm.smQueueEvent("E_MOVE",{});
				return;
			}
			ClickablePos(psStartPos,function() {
				htsm.smQueueEvent("E_CANCEL",{});
			},"Magenta");
			for(var pos in poss) {
				(function(pos) {
					var m=poss[pos];
					if(m.md<0) {
						ShowButton("up",function() {
							move.p=m.p;
							move.md=m.md;
							move.d=m.d;
							htsm.smQueueEvent("E_STANDUP",{});
						},pos);
					} else {
						if(slideCount==1) {
							ShowButton("slide",function() {
								move.p=m.p;
								move.md=m.md;
								move.d=m.d;
								htsm.smQueueEvent("E_MOVE",{});
							});
						}
						ClickablePos(pos,function() {
							move.p=m.p;
							move.md=m.md;
							if($this.ball>=0 && $this.penguins[m.i].p==$this.ball) {
								move.d=m.d;
								htsm.smQueueEvent("E_KICK",{});
							} else
								htsm.smQueueEvent("E_MOVE",{});								
						},"Orange");
						if(slideCount>1) {
							xdv.updateGadget("rotator-image#"+poss[pos].md,{
								"2d": {
									visible: true,
								}
							});
							xdv.updateGadget("rotator-highlight#"+poss[pos].md,{
								"2d": {
									visible: true,
								}
							});
							xdv.updateGadget("rotator-clicker#"+poss[pos].md,{
								"2d": {
									visible: true,
									click: function() {
										move.p=m.p;
										move.md=m.md;
										if($this.ball>=0 && $this.penguins[m.i].p==$this.ball) {
											move.d=m.d;
											htsm.smQueueEvent("E_KICK",{});
										} else
											htsm.smQueueEvent("E_MOVE",{});								
									},
								}
							});
							if($this.ball>=0 && $this.penguins[move.i].p==$this.ball) 
								xdv.updateGadget("rotator-subject",{
									"2d": {
										visible: true,
										clipx: 0,
										clipy: 400,
										rotate: StandRotation[aGame.mViewAs][move.i],
									}
								});
							else {
								var clip=StandClip[move.i];
								xdv.updateGadget("rotator-subject",{
									"2d": {
										visible: true,
										clipx: clip[0],
										clipy: clip[1],
										rotate: StandRotation[aGame.mViewAs][move.i],
									}
								});
							}
						}
					}
				})(pos);
			}
		}
		function SelectDir(args) {
			var dirs={};
			moves.forEach(function(m) {
				if(m.i==move.i && m.p==move.p && m.md==move.md)
					dirs[m.d]=m;
			});
			var dCount=0;
			for(var dir in dirs)
				dCount++;
			if(dCount==1) {
				move.d=dir;
				htsm.smQueueEvent("E_DIR",{});
				return;
			}
			for(var dir in dirs) {
				(function(dir) {
					ClickableArrow(aGame.g.Graph[move.p][dir],function() {
						move.d=dir;
						htsm.smQueueEvent("E_DIR",{});
					},dir);
				})(dir);
			}
			
			var rotation=Angles[aGame.mViewAs][move.md];
			xdv.updateGadget("rotator-subject",{				
				"2d": {
					rotate: rotation,
				}
			});
		}

		function AnimateDir(args) {
			$this.psAnimateDir(xdv,aGame,move.i,move.p,move.d,function() {
				htsm.smQueueEvent("E_DIR_DONE",{});
			});
		}
		
		function AnimateStandup(args) {
			$this.psAnimateStandup(xdv,aGame,move.i,function() {
				htsm.smQueueEvent("E_STANDUP_DONE",{});				
			});
		}

		function AnimateKick(args) {
			$this.psAnimateKick(xdv,aGame,move.i,move.p,move.md,function() {
				htsm.smQueueEvent("E_KICK_DONE",{});				
			});
		}

		function MakeMove(args) {
			aGame.MakeMove(move);
		}

		function Cancel(args) {
			var index=move.i;
			var penguin=$this.penguins[move.i];
			var coord=$this.penguinCoord(aGame,move.i,penguin.p);
			var clip=$this.penguinClip(aGame,move.i,penguin.p,penguin.d);
			var rotation=$this.penguinRotation(aGame,move.i,penguin.p,penguin.d);
			var morph=$this.penguinMorph(aGame,move.i,penguin.p,penguin.d);
			
			if(move.p<0) {
				move.i=-1;
			} else {
				if(penguin.p<0){
					coord=Coord[psStartPos];	
					rotation=StandRotation[aGame.mViewAs][move.i];
				}
				move.p=-1;
				move.md=-1;
			}
			xdv.updateGadget("penguin#"+index,{
				base: {
					x: coord[0],
					y: coord[1],
					rotate: rotation,
				},
				"2d": {
					clipx: clip[0],
					clipy: clip[1],
					x: coord[0]*FIX2D,
					y: coord[1]*FIX2D,
				},
				"3d":{
					z: coord[2],
					morphing: morph,			
					rotate: 180-rotation,
				},
			});
			coord=[-1000,0,fieldZ];
			if($this.ball>=0){
				coord=Coord[$this.ball];
			}
			xdv.updateGadget("ball",{
				base: {
					x: coord[0],
					y: coord[1],
				},
				"2d": {
					x: coord[0]*FIX2D,
					y: coord[1]*FIX2D,					
				}
			});
		}
		htsm.smTransition("S_INIT", "E_INIT", "S_SELECT_PENGUIN", [ ]);
		htsm.smEntering("S_SELECT_PENGUIN", [ SelectPenguin ]);
		htsm.smTransition("S_SELECT_PENGUIN", "E_DRY", "S_ANIM_DRY", [ AnimateDry ]);
		htsm.smTransition("S_SELECT_PENGUIN", "E_SELECT", "S_SELECT", [ ]);
		htsm.smTransition("S_ANIM_DRY", "E_DRY_DONE", "S_SELECT", [ ]);
		htsm.smEntering("S_SELECT", [ SelectTarget, ShowCancel ]);
		htsm.smTransition("S_SELECT", "E_MOVE", "S_ANIM_TARGET", [ AnimateSlide ]);
		htsm.smTransition("S_SELECT", "E_STANDUP", "S_ANIM_STANDUP", [ AnimateStandup ]);
		htsm.smTransition("S_SELECT", "E_KICK", "S_ANIM_KICK", [ AnimateKick ]);
		htsm.smTransition("S_SELECT", "E_CANCEL", "S_SELECT_PENGUIN", [ Cancel ]);
		htsm.smTransition("S_ANIM_TARGET", "E_SELECT_DIR", "S_SELECT_DIR", [ ]);
		htsm.smTransition("S_ANIM_STANDUP", "E_STANDUP_DONE", "S_DONE", [ MakeMove ]);
		htsm.smTransition("S_ANIM_KICK", "E_KICK_DONE", "S_DONE", [ MakeMove ]);
		htsm.smEntering("S_SELECT_DIR", [ SelectDir, ShowCancel ]);
		htsm.smTransition("S_SELECT_DIR", "E_DIR", "S_ANIM_DIR", [ AnimateDir ]);
		htsm.smTransition("S_SELECT_DIR", "E_CANCEL", "S_SELECT", [ Cancel ]);
		htsm.smTransition("S_ANIM_DIR", "E_DIR_DONE", "S_DONE", [ MakeMove ]);

		htsm.smLeaving(["S_SELECT_PENGUIN","S_SELECT","S_SELECT_DIR"], [ Clean ]);

		htsm.smTransition(["S_DONE","S_SELECT_PENGUIN","S_SELECT","S_SELECT_DIR","S_ANIM_DRY","S_ANIM_TARGET","S_ANIM_STANDUP","S_ANIM_KICK"], 
				"E_END", "S_DONE", [ Clean ]);

	}

	function IntRand(i){
		return Math.floor(Math.random()*i);
	}

	View.Board.psAnimateDry=function(xdv,aGame,index,callback) {
		var $this=this;
		var clip=LayClip[index];
		// get penguin out of water
		xdv.updateGadget("penguin#"+index,{
			"2d": {
				clipx: clip[0],
				clipy: clip[1],
				z:5,
			},
			"3d":{
				morphing: layedMorphPos,
			}
		},{"base":1,"3d":200},function() {
			psStartPos=aGame.mWho==1?0:63;
			var coord=Coord[psStartPos];
			var coord0=RestCoord[aGame.mViewAs][index];
			var angle=Math.atan2(coord[1]-coord0[1],coord[0]-coord0[0])/Math.PI*180+90;
			// orient to start position
			xdv.updateGadget("penguin#"+index,{
				base: {
					rotate: angle,
				},
				"3d":{
					rotate: 180-angle,
				}
			},300,function() {
				// move to start position
				aGame.PlaySound("slide0");
				xdv.updateGadget("penguin#"+index,{
					base: {
						x: coord[0],
						y: coord[1],
					},
					"2d": {
						x: coord[0]*FIX2D,
						y: coord[1]*FIX2D,
					},
					"3d":{
						z: coord[2],						
					}
				},600,function() {
					// face front
					xdv.updateGadget("penguin#"+index,{
						base: {
							rotate: StandRotation[aGame.mViewAs][index],
						},
						"2d": {
							z:4,
						},
						"3d": {
							rotate: 180-StandRotation[aGame.mViewAs][index],							
						}
					},300,function() {
						callback();
					});
				});					
			});
		});
	}

	/* animation tools */
	function Sequence(duration){
		this.duration=duration;
		this.sound=null;
					
		this.animations=[];
		this.addAnim=function(avatarId,params,timings){
			var t=$.extend(true,{base:this.duration},timings);
			this.animations.push({
				id:avatarId,
				params:params,
				timings:t,
				});
		};
		this.addSound=function(sound){
			this.sound=sound;
		}
		this.play=function(xdv,callback,aGame){
			if (this.sound!=null) aGame.PlaySound(this.sound);
			var count=this.animations.length;
			//console.log("Sequence.play: nb animations to play=", count);
			function checkFinished(){
				count--;
				//console.log("checkFinished", count);
				if (count==0){
					//console.log("animation finished");
					callback();
				}
			}
			for(var i = 0; i < this.animations.length ; i++){
				var s=this.animations[i];
				//console.log("Sequence.play: launch item ", i, s.id);
				xdv.updateGadget(s.id,s.params,s.timings,checkFinished);
			}
		}
	} 

	function Scenario(){
		var $this=this;
		this.name="scenario";
		this.init=function(){
			$this.sequences=[];
		};
		this.createSequence=function(delay){
			var seq=new Sequence(delay);
			$this.sequences.push(seq);
			return seq;
		};
		
		this.play=function(xdv,callback,aGame){
			var i=0;
			function playSeq(xdv){
				if (i==($this.sequences.length-1)){
					$this.sequences[i].play(xdv,callback,aGame);
				}else{
					$this.sequences[i].play(xdv,function(){
						i++;
						playSeq(xdv);
					},aGame);
				}
			}
			playSeq(xdv);
		}
		
		this.getLastSeq=function(){
			var seq=null;
			if ($this.sequences.length>0) 
				seq=$this.sequences[$this.sequences.length-1];
			return seq;
		}
		
		this.init();
	} 
	
	View.Board.psAnimateSlide = function(xdv,aGame,index,pos,md,callback) {
		var $this=this;
		var coord0=Coord[psStartPos];
		var coord=$this.penguinCoord(aGame,index,pos);
		var angle;
		if(psStartPos==pos){
			angle=StandRotation[aGame.mViewAs][index];
		}
		else{
			angle=Math.atan2(coord[1]-coord0[1],coord[0]-coord0[0])/Math.PI*180+90;			
		}
			
		var sc=new Scenario();	
		// SEQ 0	
		// rotate to target	
		var seq0=sc.createSequence(300);
		var clip=LayClip[index];
		seq0.addAnim("penguin#"+index,{
			base: {
				rotate: angle,
			},
			"2d":{
				clipx:clip[0],
				clipy:clip[1],
			},
			"3d": {
				rotate: 180-angle,
				morphing: layedMorphPos,
			}
		});
						

		// SEQ 1	
		var seq1=sc.createSequence(500);
		seq1.addSound('slide'+IntRand(5));
		var catchBall = false;
		// what about the ball?
		if ($this.ball < 0 && (pos == 27 || pos == 28 || pos == 35 || pos == 36)) {
			catchBall = true;
			// move ball to target
			seq1.addAnim("ball", {
				base : {
					x : coord[0],
					y : coord[1],
				},
				"2d": {
					x: coord[0]*FIX2D,
					y: coord[1]*FIX2D,					
				},
			});
		}
		if (pos == $this.ball)
			catchBall = true;

		// what about main penguin?
		// move to target
		seq1.addAnim("penguin#"+index,{
			base: {
					x: coord[0],
					y: coord[1],
				},
				"2d": {
					x: coord[0]*FIX2D,
					y: coord[1]*FIX2D,
				},
				"3d": {
					z: coord[2],
				}
			});
		if (catchBall) {
			seq1.addSound('haha');
			// get up
			var clip=StandClip[index];
			seq1.addAnim("penguin#"+index,{
					"2d": {
						clipx: clip[0],
						clipy: clip[1],
					},
					"3d":{
						morphing: upMorphPos,
					}
				},
				{"2d":1,"3d":300});
		}
		
		// add penguins push animations 
		this.psGetAnimsSlidePush(sc,aGame,pos,md);
		// play it now
		sc.play(xdv,callback,aGame);
	}
	
	View.Board.psGetAnimsSlidePush=function(scenario,aGame,pos,dir){
		var $this=this;
		var seq=scenario.getLastSeq();
		if(seq!=null){
			var nbShiftedPenguins=0;
			var penguin=this.board[pos];
			while((penguin!=null)&&(pos!=null)){
				// compute penguin animation data
				var pos1=aGame.g.Graph[pos][dir]; 
				
				var coord0=Coord[pos];
				var coord=(pos1==null)?RestCoord[aGame.mViewAs][penguin.i]:Coord[pos1];
				var angle=Math.atan2(coord[1]-coord0[1],coord[0]-coord0[0])/Math.PI*180+90;
				var clip=LayClip[penguin.i];
				
				seq.addAnim("penguin#"+penguin.i,{
					"base":{
						rotate: angle,
						x: coord[0],
						y: coord[1],						
					},
					"2d": {
						clipx: clip[0],
						clipy: clip[1],
						x: coord[0]*FIX2D,
						y: coord[1]*FIX2D,
					},
					"3d": {
						z: coord[2],
						morphing:layedMorphPos,
						rotate: 180-angle,
					}
				});
				
				if (pos1==null){
					// penguin has been sent to rest position => add a sequence to stand up in the good direction
					var seqUp=scenario.createSequence(400);
					clip=StandClip[penguin.i];
					var rotation=this.penguinRotation(aGame,penguin.i,-1);
					seqUp.addSound('getup1');
					seqUp.addAnim("penguin#"+penguin.i,
						{	
							"2d":{
								clipx: clip[0],
								clipy: clip[1],
								rotate:rotation,
							},
							"3d":{
								morphing:upMorphPos,
								rotate:180-rotation,
							}
					});
				}
				
				nbShiftedPenguins++;
				// iteration
				pos=pos1;
				penguin=this.board[pos];
			}
		}
	}

	View.Board.psAnimateDir = function(xdv,aGame,index,pos,dir,callback) {
		var coord0=Coord[psStartPos];
		var coord=Coord[pos];
		var angle=StandRotation[aGame.mViewAs][index];
		if (dir>0)
			angle=Angles[aGame.mViewAs][dir];
		// rotate to final dir
		xdv.updateGadget("penguin#"+index,{
			base: {
				rotate: angle,
			},
			"3d":{
				rotate: 180-angle,
			},
		},300,function() {
			callback();
		});
	}
	View.Board.psAnimateStandup = function(xdv,aGame,index,callback) {
		var clip=StandClip[index];
		var rotation=StandRotation[aGame.mViewAs][index];
		var sound='getup'+IntRand(2);
		aGame.PlaySound(sound);

		xdv.updateGadget("penguin#"+index,{
			base: {
				clipx: clip[0],
				clipy: clip[1],
				rotate: rotation,
			},
			"3d":{
				morphing: upMorphPos,
				rotate: 180-rotation,
			}
		},{"2d":1,"3d":300},function() {
			callback();
		});
	}

	View.Board.psAnimateKick = function(xdv,aGame,index,pos,md,callback) {
		var $this=this;
		var rotation=Angles[aGame.mViewAs][md];
		
		var sc=new Scenario();
		
		// turn towards ball
		var seq=sc.createSequence(300);
		seq.addAnim("penguin#"+index,{base: {rotate: rotation,},"3d":{rotate: 180-rotation},});

		// pirouette!
		//seq=sc.createSequence(600);
		//seq.addAnim("penguin#"+index,{"3d":{rotateX: 179, z:2*overBallZ},},{base:1,"3d":600});
		//seq=sc.createSequence(600);
		
		
		// shoot!
		seq=sc.createSequence(600);
		seq.addSound('kick');
		var coord=Coord[pos];
		seq.addAnim("ball",{
			base: {
				x:coord[0],
				y:coord[1]
			},
			"2d": {
				x:coord[0]*FIX2D,
				y:coord[1]*FIX2D,				
			}
		});
		seq.addAnim("penguin#"+index,
			{
				base: {rotate: rotation,},
				"3d":{rotate: 180-rotation, morphing:layedMorphPos, z:fieldZ},
			});
		var penguin=$this.board[pos];
		if(penguin) {
			var clip=StandClip[penguin.i];
			var rotation=StandRotation[aGame.mViewAs][penguin.i];
			seq.addAnim("penguin#"+penguin.i,{
				base:{rotate: rotation},
				"2d":{clipx:clip[0],clipy:clip[1]},
				"3d":{rotate: 180-rotation, morphing:upMorphPos, z:overBallZ},
				});
		}
		
		sc.play(xdv,callback,aGame);
	}

	View.Board.psPlayedMove = function(xdv, aGame, aMove) {
		var $this=this;
		var penguin=this.penguins[aMove.i];
		function PenguinReady() {
			if(aMove.md>=0) {
				if($this.ball>=0 && penguin.p==$this.ball)
					$this.psAnimateKick(xdv,aGame,aMove.i,aMove.p,aMove.md,function() {
						aGame.MoveShown();
					});
				else
					$this.psAnimateSlide(xdv,aGame,aMove.i,aMove.p,aMove.md,function() {
						if(aMove.d<0)
							aGame.MoveShown();
						else
							$this.psAnimateDir(xdv,aGame,aMove.i,aMove.p,aMove.d,function() {
								aGame.MoveShown();
							});
					});
			} else
				$this.psAnimateStandup(xdv,aGame,aMove.i,function() {
					aGame.MoveShown();
				});
		}
		if(penguin.p<0)
			this.psAnimateDry(xdv,aGame,aMove.i,function() {
				PenguinReady();
			});
		else {
			psStartPos=penguin.p;
			PenguinReady();
		}
	}
	
	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		aGame.mOldBoard.psPlayedMove(xdv,aGame,aMove);
		return false;
	}

	
})();
