/*
THREE= typeof THREE=="undefined" ? {} : THREE;
TWEEN= typeof TWEEN=="undefined" ? { Easing: { Cubic: {}, Quartic: {}, } } : TWEEN;
*/
(function() {
	
	var T = 750;
	var R = T * Math.cos(Math.PI / 6);
	
	// palmtree stuff
	var nbStages=3;
	var nbLeavesPerStage=5;														
	var palmsPositions = [  {r:18,a:210,zoom:0.8,rotOffset:90},
							{r:15,a:215,zoom:1.0,rotOffset:270},
							{r:15,a:250,zoom:0.7,rotOffset:170},
							{r:25,a:285,zoom:0.6,rotOffset:0},
							{r:25,a:295,zoom:0.8,rotOffset:270},
							{r:18,a:15,zoom:1.0,rotOffset:0},
							{r:25,a:170,zoom:1.2,rotOffset:0},
							{r:35,a:92,zoom:0.8,rotOffset:270},];
			
	function Angle(coord0,coord) {
		if(coord0[0]==coord[0])
			if(coord0[1]>coord[1])
				return 90;
			else
				return -90;
		else
			return 180+Math.atan2((coord[0]-coord0[0]),(coord[1]-coord0[1]))*(180/Math.PI);
	}
	
	function CreatPalmtrees(xdv){
		var leafidx=0;
		var palmsZ=3000; // origin for leaves and trunc (trunc mesh origin is set at its top)
		for (var p =0 ; p < palmsPositions.length ; p++){			
			var angle=palmsPositions[p].a*Math.PI/180;
			var r=palmsPositions[p].r;
			var zoom=palmsPositions[p].zoom;
			var rotOffset=palmsPositions[p].rotOffset;
			var sz=3.5;
			sz=sz*zoom;
			xdv.createGadget("palmtrunc#"+p, {
				"cartoon3d" : {
                    harbor: false,
					type : "meshfile",
					file : xdv.game.mViewOptions.fullPath+"/res/xd-view/meshes/palmtreetrunc.js",
					scale: [sz,sz,sz],
					z : palmsZ*zoom,
					x : (R * r)*Math.cos(angle),
					y : (R * r)*Math.sin(angle),
					rotate: rotOffset,
					smooth: 0 ,
				},
			});
			
			for (var stage=0 ; stage < nbStages ; stage++){
				for (var idx=0 ; idx < nbLeavesPerStage ; idx++){
					
					var sz=1,
					sz=sz*7/(7+stage)*zoom;
					
					xdv.createGadget("palmleaf#"+leafidx, {
						"cartoon3d" : {
                        harbor: false,
						type : "meshfile",
						file : xdv.game.mViewOptions.fullPath+"/res/xd-view/meshes/leaves5.js",
						scale: [sz,sz,sz],
						z : palmsZ*zoom*.99,
						x : (R * r)*Math.cos(angle),
						y : (R * r)*Math.sin(angle),
						
						rotate: rotOffset+(stage/2+idx+(Math.random()-.5)/5)*380/nbLeavesPerStage,
						rotateY: stage*(80/nbStages), 
						
						smooth: 0 ,
						
						materials: { "palmgreen" : {
								side:THREE.DoubleSide,
							}},
						},
					});
					leafidx++;
				}
			}
		}	
	}
	function CreateExplosionObjects(xdv) {
		xdv.createGadget("light", {
			"3d": {
				type: "custom3d",
				create: function() {
					var explight = new THREE.SpotLight( 0xffffaa, 1, 0, 1.05, 1, 2);
					//explight.castShadow = false;
					$.extend(this.options,{
						intensity: 0,
					});
					return explight;
				},
				display: function(force,options,delay) {
					this.object3d.target.position.x=this.object3d.position.x;
					this.object3d.target.position.z=this.object3d.position.z;
					var $this=this;
					if(force || 
							this.options.intensity != options.intensity) {
						if(delay) {
							this.animStart(options);
							setTimeout(function() { 
								$this.object3d.position.z=200000;
								$this.object3d.intensity=options.intensity;
								$this.animEnd(options); 
							},delay);
							/*
							this.animStart(options);
							new TWEEN.Tween(this.object3d).to({intensity:options.intensity},delay)
								.easing(TWEEN.Easing.Quartic.EaseOut)
								.onComplete(function() {
									$this.object3d.position.z=200000;
									$this.animEnd(options);
								})
								.start();
							*/
						} else
							this.object3d.intensity=options.intensity;
					} 
				},
				z: 200000,
				intensity: 0,
			}
		});
		/*xdv.createGadget("fire1", {
			"3d": {
				type: "plane3d",
				color : 0xffffff,
				sx : 1000,
				sy : 1000,
				z : 1000,
				x: 0,
				y: 0,
				texture: {
					file: xdv.game.mViewOptions.fullPath+"/res/xd-view/meshes/explosion-256.png",
				},
				side: THREE.DoubleSide,
	            transparent:true,
			}
		});
		xdv.createGadget("fire2", {
			"3d": {
				type: "plane3d",
				color : 0xffffff,
				sx : 1000,
				sy : 1000,
				z : 1000,
				x: 0,
				y: 0,
				rotate: 90,
				texture: {
					file: xdv.game.mViewOptions.fullPath+"/res/xd-view/meshes/explosion-256.png",
				},
				side: THREE.DoubleSide,
	            transparent:true,
			}
		});*/
	}

	function AttackPosition(xdv,aGame,piece,pos) {
		var coord=aGame.getVCoord(pos);
		var coord0=aGame.getVCoord(piece.pos);
		var angles;
		if(coord[0]>coord0[0])
			if(coord[1]>coord0[1])
				angles=[120,-60]; 
			else if(coord[1]<coord0[1])
				angles=[60,-120];
			else
				angles=[0,180];
		else if(coord[1]>coord0[1])
			angles=[60,-120];
		else if(coord[1]<coord0[1])
			angles=[-60,120];
		else
			angles=[0,180]; 
		var angle0=angles[0];
		var angle1=angles[1];
		var angle;
		if(Math.abs((angle0+360)-(piece.angle+360))>Math.abs((angle1+360)-(piece.angle+360)))
			angle=angle1;
		else
			angle=angle0;
		var attackerId=piece.type+":"+piece.s+":"+piece.index;
		xdv.updateGadget(attackerId,{
			"3d": {
				rotate: angle,
			},
		},500,function() {
			xdv.updateGadget(attackerId,{
				"3d": {
					rotate: piece.angle,
				},
			},1500);			
		});
	}

	
	function AnimateAttack(xdv,aGame,piece,attackers) {
		var coord=aGame.getVCoord(piece.pos);
		for(var i=0;i<attackers.length;i++) {
			(function(attacker) {
				attackerId=attacker.type+":"+attacker.s+":"+attacker.index;
				AttackPosition(xdv,aGame,attacker,piece.pos);
			})(attackers[i]);
		}
		setTimeout(function() {
			SinkShip(xdv,aGame,piece);
		},800);
	}
	
	function SinkShip(xdv,aGame,piece) {
		var pieceId=piece.type+":"+piece.s+":"+piece.index;
		var coord=aGame.getVCoord(piece.pos);
		xdv.updateGadget("light",{
			"3d": {
				x: coord[0],
				y: coord[1],
				z: 2000,
				intensity: 20,
				visible: true,
			},
		});
		xdv.updateGadget("light",{
			"3d": {
				intensity: 0,
				z:5000,
			},
		},200);
		xdv.updateGadget(pieceId,{
			"3d": {
				rotateX: 60,
				//rotateEasing: TWEEN.Easing.Quartic.EaseIn,
			},
		},1000);
		xdv.updateGadget(pieceId,{
			"3d": {
				z: -2000,
				//positionEasing: TWEEN.Easing.Quartic.EaseIn,
			},
		},2000);
		/*xdv.updateGadget("fire1",{
			"3d": {
				x: coord[0],
				y: coord[1],
				z: 500,
				visible: true,
				scale: [0.1,0.1,0.1],
				opacity: 1,
			},
		});
		xdv.updateGadget("fire1",{
			"3d": {
				scale: [2,2,2],
				scaleEasing: TWEEN.Easing.Cubic.EaseOut,
				opacity: 0,
				opacityEasing: TWEEN.Easing.Cubic.EaseOut,
			},
		},300, function() {
			xdv.updateGadget("fire1",{
				"3d": {
					visible: false,
				},
			});	
		});
		xdv.updateGadget("fire2",{
			"3d": {
				x: coord[0],
				y: coord[1],
				z: 500,
				visible: true,
				scale: [0.1,0.1,0.1],
				opacity: 1,
			},
		});
		xdv.updateGadget("fire2",{
			"3d": {
				scale: [2,2,2],
				scaleEasing: TWEEN.Easing.Cubic.EaseOut,
				opacity: 0,
				opacityEasing: TWEEN.Easing.Cubic.EaseOut,
			},
		},300, function() {
			xdv.updateGadget("fire2",{
				"3d": {
					visible: false,
				},
			});	
		});*/
		
	}

	var maxLines, maxCols, orientation;

	function GetVCoord(aGame,pos) {
		function RawPos(pos0) { 
			var coord = aGame.g.Coord[pos0];
			var r = maxLines - 1 - coord[0];
			var c = coord[1];
			var x, y;
			if (orientation == 'onASide') {
				if (c % 2 == 0)
					x = (1 + c / 2 * 3) * T;
				else
					x = (-T / 2 + (c + 1) / 2 * 3 * T);
				y = R * (r + 1);
			} else {
				x = R * (c + 1);
				if (r % 2 == 0)
					y = (1 + r / 2 * 3) * T;
				else
					y = (-T / 2 + (r + 1) / 2 * 3 * T);
			}
			return [ x, y ];
		}
		if (aGame.mViewAs == JocGame.PLAYER_B)
			pos=aGame.g.Graph.length - 1 - pos;
		var center = RawPos(38);
		var centerX = center[0];
		var centerY = center[1];
		var coord = RawPos(pos);
		coord = [ coord[0] - centerX, coord[1] - centerY ];
		return coord;
	}

	View.Game.getVCoord = function(pos) {
		return GetVCoord(this,pos);
	}
	
	View.Game.xdInit = function(xdv) {

		var $this = this;
		
		var fullPath=this.mViewOptions.fullPath;
		
		maxLines=this.mOptions.maxLines;
		maxCols=this.mOptions.maxCols;
		orientation=this.mOptions.orientation;
		
		CreateExplosionObjects(xdv);

		xdv.createGadget("board", {
			"official" : {
				type : "image",
				file : fullPath + "/res/images/oceanboard.jpg",
				width : 12600,
				height : 11340,
			},
		});

		xdv.createGadget("surround", {
			"cartoon3d" : {
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
	
					//var textureCube = THREE.ImageUtils.loadTextureCube( urls, new THREE.CubeRefractionMapping() );
					//var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
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
			"cartoon3d" : {
                harbor: false,
				type : "meshfile",
				file : fullPath+"/res/xd-view/meshes/ocean.js",
				scale: [200,200,3],
				z : -50,
				smooth: 0 ,
			},
			"stylized3d" : {
				type : "meshfile",
				file : fullPath+"/res/xd-view/meshes/woodboard3.js",
				scale: [2.4,2.14,1],
				z : -130,
				smooth: 0 ,
				flatShading: true,
			},
		});
		
		xdv.createGadget("island", {
			"cartoon3d" : {
                harbor: false,
				type : "meshfile",
				file : fullPath+"/res/xd-view/meshes/landscape-smoothed.js",
				scale: [1,1,1],
				z : 0,
				smooth: 0 ,
			},
		});
		xdv.createGadget("flag", {
			"cartoon3d" : {
				type : "meshfile",
				file : fullPath+"/res/xd-view/meshes/barilflagsquare.js",
				scale: [0.6,0.6,0.6],
				z : 0,
				rotate: 90,
				x : R * 10,
				smooth: 0 ,
			},
			"stylized3d" : {
				type : "meshfile",
				file : fullPath+"/res/xd-view/meshes/stylized-flag.js",
				scale: [0.6,0.6,0.6],
				z : 0,
				rotate: 90,
				x : R * 10,
				smooth: 0 ,
			},
		});
        
        xdv.createGadget("hexboard", {
            base: {
                x : 0,
                y : 0,
            },
            "cartoon3d" : {
                visible: true,
                receiveShadow : true,
                type : "custommesh3d",
                radius : T * 12 * .95,
				rotate: 30,
                thickness: 210,
                z : -150,
                smooth: 1,
                create: function() {
                    var gg= new THREE.CylinderGeometry(this.options.radius*this.SCALE3D, this.options.radius*this.SCALE3D, this.options.thickness*this.SCALE3D, 64, 1, false);
                    var gm=new THREE.MeshLambertMaterial( { 
                        color: "#1630ff",
                    });
                    var mesh = new THREE.Mesh( gg , gm );
                    return mesh;
                },
            },
        });
		
		CreatPalmtrees(xdv);	
		
		function createRaft(videoTexture) {
			var $this=this;
			var smooth=0;
			this.getResource("smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/barilscreen.js",function(geometry , materials) {
 				var materials0=[];
 				
 				for(var i=0;i<materials.length;i++){
                    if (materials[i].name=="screen"){
	 					var mat=materials[i].clone();
 						mat.map=videoTexture;
 						mat.overdraw = true;
 						//mat.side = THREE.DoubleSide;
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
				castShadow : false ,
				makeMesh: function(videoTexture){
					createRaft.call(this,videoTexture);
				},
			},
		});

		/*for (var g=0;g<5;g++){
			xdv.createGadget("videoa-"+g,{
				"3d": {
					type : "video3d",
					makeMesh: function(videoTexture){
						createRaft.call(this,videoTexture);
					},
				},
			});
		}*/

		xdv.createGadget("videob",{
			"3d": {
				type : "video3d",
				castShadow : false ,
				makeMesh: function(videoTexture){
					createRaft.call(this,videoTexture);
				},
			},
		});
				
		xdv.createGadget("videoa-sky",{
			"3d": {
				type : "video3d",
			},
		});
		xdv.createGadget("videob-sky",{
			"3d": {
				type : "video3d",
			},
		});
		
		for ( var i = 0; i < this.g.Graph.length; i++) {
			var rcCoord = this.g.Coord[i];
			var r = maxLines - 1 - rcCoord[0];
			var c = rcCoord[1];
			var coord = this.getVCoord(i);
			var fillStyle = "rgba(0,0,128,0.1)";
			var fillStyleS = "rgba(0,195,255,0.7)";
			var hex3dColor = 0xffffff;
			var hex3dOpacity = 0.3;
			if(this.mOptions.boardLayout[r][c]=='c') {
				fillStyle = "rgba(0,0,128,0.3)";
				fillStyleS = "rgba(0,195,255,0.9)";
				hex3dColor = 0x808080;
				hex3dOpacity = 0.2;
			}
			xdv.createGadget("hex#" + i, {
				base: {
					x : coord[0],
					y : coord[1],
				},
				"2d" : {
					type : "hexagon",
					width : 2.6 * T,
					height : 2.6 * T,
					radius : T * .98,
					lineWidthFactor : 1,
					strokeStyle : "rgba(255,255,255,0.2)",
					fillStyle : fillStyle,
					css : {	},
					z : 1,
				},
				stylized: {
					fillStyle : fillStyleS,
					radius : T * .95,
				},
				"3d" : {
					receiveShadow : true,
				},
				"cartoon3d" : {
					type : "custommesh3d",
					radius : T * .95,
					thickness: T * .1,
					opacity: hex3dOpacity,
					color: hex3dColor,
					z : -T * .04,
					create: function() {
						var gg= new THREE.CylinderGeometry(this.options.radius*this.SCALE3D, this.options.radius*this.SCALE3D, this.options.thickness*this.SCALE3D, 6, 1, false);
						var gm=new THREE.MeshLambertMaterial( { 
							color: this.options.color,
							transparent:true,
							opacity: this.options.opacity,
						});
						var mesh = new THREE.Mesh( gg , gm );
						return mesh;

					},
				},
				"stylized3d" : {
					type : "custommesh3d",
					radius : T * .95,
					thickness: T*.1,
					opacity: hex3dOpacity,
					color: 0x808080,
					z : 0,
					create: function() {
						var gg= new THREE.CylinderGeometry(this.options.radius*this.SCALE3D, this.options.radius*this.SCALE3D, this.options.thickness*this.SCALE3D, 6, 1, false);
						var gm=new THREE.MeshPhongMaterial( { 
							color: this.options.color,
							//color: 0xff0000,
							transparent:true,
							opacity: this.options.opacity,
						});
						var mesh = new THREE.Mesh( gg , gm );
						return mesh;

					},
				},
			});
			xdv.saveGadgetProps("hex#" + i, ["opacity","color"],"initial");
			xdv.createGadget("mask#" + i, {
				"2d" : {
					type : "disk",
					width : 2 * R,
					height : 2 * R,
					x : coord[0],
					y : coord[1],
					z : 5,
				},
			});
			(function(pos) {
				xdv.createGadget("text#" + i, {
					"2d" : {
						type : "element",
						width : R,
						height : R * 0.5,
						css : {
							color : "White",
							"text-align" : "center",
						},
						x : coord[0],
						y : coord[1] - 500,
						z : 4,
						display : function(element, width, height) {
							element.css({
								"font-size" : (height * .6) + "pt",
								"line-height" : (height * 1) + "px",
							}).text(pos);
						},
					},
					"stylized": {
						y : coord[1] - 400,
						css : {
							color : "Black",
							"text-align" : "center",
						},
					},
					"3d": {
						type: "custommesh3d",
						z: 20,
						rotateX: -90,
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
                                var gm=new THREE.MeshBasicMaterial();
                                var mesh= new THREE.Mesh( gg , gm );
                                $this.objectReady(mesh);
                            });
							return null;
						},
					},
				});
			})(i);
		}

		var pieces = { 
			"C": {
				type : "C",
				count : 1,
				positionX : 100,
				name: "admiral",
				scale: [1,.8,1],
				sscale: [0.8,0.65,0.8],
				blackMaterial: {
					"voiles": {
						map: this.mViewOptions.fullPath+"/res/xd-view/meshes/jarmada-admiral-voiles-pirate-uvs-512.jpg",
					},
					"coque": {
						map: this.mViewOptions.fullPath+"/res/xd-view/meshes/jarmada-admiral-pirate-uvs-512.jpg",						
					}
				},
			}, 
			"c": {
				type : "c",
				count : 2,
				positionX : 200,
				name: "gallion",
				scale: [.9,.7,.9],
				sscale: [.8,.7,.9],
				blackMaterial: {
					"voiles": {
						map: this.mViewOptions.fullPath+"/res/xd-view/meshes/jarmada-admiral-voiles-pirate-uvs-512.jpg",
					},
					"coque": {
						map: this.mViewOptions.fullPath+"/res/xd-view/meshes/jarmada-gallion-pirate-uvs-512.jpg",						
					}
				},
			}, 
			"p": {
				type : "p",
				count : 4,
				positionX : 0,
				name: "frigate",
				scale: [1,1,1],
				sscale: [.7,.8,.7],
				blackMaterial: {
					"voiles": {
						map: this.mViewOptions.fullPath+"/res/xd-view/meshes/jarmada-admiral-voiles-pirate-uvs-512.jpg",
					},
					"coque": {
						map: this.mViewOptions.fullPath+"/res/xd-view/meshes/jarmada-frigate-pirate-uvs-512.jpg",						
					}
				},
			}, 
			"r": {
				type : "r",
				count : 1,
				positionX : 300,
				name: "rock",
				scale: [1,1,1],
				sscale: [0.6,0.6,0.7],
				blackMaterial: {
					"sand": {
						color: 0x202020,
					},
					"leaves": {
						color: 0x800000,
					},
				},
			} 
		};
		for ( var pi in this.mBoard.pieces) {
			var piece = this.mBoard.pieces[pi];
			var pieceData = pieces[piece.type];
			var id = piece.type + ":" + piece.s + ":" + piece.index;
			xdv.createGadget(id, {
				"2d" : {
					type : "sprite",
					file : this.mViewOptions.fullPath + "/res/images/yohohores6.png",
					clipx : pieceData.positionX,
					clipy : (piece.s+1)*50,
					clipwidth : 100,
					clipheight : 100,
					width : 1200,
					height : 1200,
					z : 3,
				},
				"stylized" : {
					file : this.mViewOptions.fullPath + "/res/images/yohohoresbasic5.png"
				},
				"3d" : {
					type : "meshfile",
					z : piece.z,
					rotate: piece.s==1?0:180,
				},
				"stylized3d" : {
					file : this.mViewOptions.fullPath+"/res/xd-view/meshes/stylized-"+pieceData.name+".js",
					materials : { "ivory": { color: piece.s==1?0xaa9999:0x222222 }, opacity : .5	},
					smooth : 2,
					scale: pieceData.sscale,
				},
				"cartoon3d" : {
					file : this.mViewOptions.fullPath+"/res/xd-view/meshes/jarmada-"+pieceData.name+".js",							
					materials: piece.s==-1?pieceData.blackMaterial:{},
					scale: pieceData.scale,
				},
				});
		}

		this.g.BattleSounds = function() {
			return true;
		}
		this.g.YohohoSound = function() {
			var soundName = "yohoho" + (Math.floor(Math.random() * 4) + 1);
			if ($this.g.BattleSounds())
				$this.PlaySound(soundName);
		}

	}

	View.Game.xdBuildScene = function(xdv) {
		
		xdv.updateGadget("light", {
			"3d" : {
				visible: true,
				intensity: 0,
			},
		});

		for ( var i = 0; i < this.g.Graph.length; i++) {
			var coord = this.getVCoord(i);
			xdv.updateGadget("hex#" + i, {
				base : {
					x : coord[0],
					y : coord[1],
				},
			});
			xdv.updateGadget("mask#" + i, {
				base : {
					x : coord[0],
					y : coord[1],
				},
			});
			xdv.updateGadget("text#" + i, {
				base : {
					x : coord[0],
					y : coord[1] - 500,
				},
				"stylized": {
					y : coord[1] - 400,
				},
				"3d": {
					x : coord[0]-200,
					y : coord[1]-300,
				},
			});
		}
		xdv.updateGadget("board",{
			"2d": {
				visible: true,
				rotate: this.mViewAs==JocGame.PLAYER_A?0:180,
			},
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
		xdv.updateGadget("island",{
			"3d": {
				visible: true,
			},
		});
		
		var raftZoom=1.5;
		var raftDist=6000;
		
		xdv.updateGadget("videoa",{
			"3d": {
				visible: true,
				scale: [raftZoom,raftZoom,raftZoom],
				rotate: this.mViewAs==1?45:180+45,
				z: 0,
				y: this.mViewAs==1?raftDist:-raftDist,
				x: this.mViewAs==1?-raftDist:raftDist,
				playerSide: 1,
			},
		});
		
		xdv.updateGadget("videob",{
			"3d": {
				visible: true,
				scale: [raftZoom,raftZoom,raftZoom],
				rotate: this.mViewAs==1?180+45:45,
				z: 0,
				y: this.mViewAs==1?-raftDist:raftDist,
				x: this.mViewAs==1?raftDist:-raftDist,
				playerSide: -1,
			},
		});

		var skyScreenDist=30000;
		var skyScreenZoom=2;
		var screenZ=9000;
		xdv.updateGadget("videoa-sky",{
			"3d": {
				visible: true,
				scale: [skyScreenZoom,skyScreenZoom,skyScreenZoom],
				rotate: this.mViewAs==1?180:0,
				z: screenZ,
				y: this.mViewAs==1?skyScreenDist:-skyScreenDist,
				playerSide: 1,
			},
		});
		xdv.updateGadget("videob-sky",{
			"3d": {
				visible: true,
				scale: [skyScreenZoom,skyScreenZoom,skyScreenZoom],
				rotate: this.mViewAs==1?0:180,
				y: this.mViewAs==1?-skyScreenDist:skyScreenDist,
				z: screenZ,
				playerSide: -1,
			},
		});
		
		/*for (var g=0;g<5;g++){
			raftDist=raftDist+1000;
			xdv.updateGadget("videoa-"+g,{
				"3d": {
					visible: true,
					scale: [raftZoom,raftZoom,raftZoom],
					rotate: this.mViewAs==1?180+45:+45,
					z: 0,
					y: this.mViewAs==1?raftDist:-raftDist,
					x: this.mViewAs==1?-raftDist:raftDist,
					playerSide: 1,
				},
			});
		}*/
		
		xdv.updateGadget("flag",{
			"cartoon3d": {
				visible: true,
				rotate: this.mViewAs==JocGame.PLAYER_A?90:-90,
			},			
			"stylized3d": {
				visible: true,
				rotate: this.mViewAs==JocGame.PLAYER_A?-90:90,
			},
		});
		for (var p =0 ; p < palmsPositions.length*nbStages*nbLeavesPerStage ; p++){
			xdv.updateGadget("palmleaf#"+p,{
				"cartoon3d": {
					visible: true,
				},
			});
		}
		for (var p =0 ; p < palmsPositions.length ; p++){
			xdv.updateGadget("palmtrunc#"+p,{
				"cartoon3d": {
					visible: true,
				},
			});
		}
		for ( var i = 0; i < this.g.Graph.length; i++) {
			xdv.showGadget("hex#" + i);
			xdv.showGadget("mask#" + i);
			if (this.mNotation)
				xdv.showGadget("text#" + i);
			else
				xdv.hideGadget("text#" + i);
		}
	}

	View.Board.xdDisplay = function(xdv, aGame) {
		for ( var i in this.pieces) {
			var piece = this.pieces[i];
			var id = piece.type + ":" + piece.s + ":" + piece.index;
			if (piece.alive) {
				var coord = aGame.getVCoord(piece.pos);
				// this.Log("piece",piece,coord)
				xdv.updateGadget(id, {
					"base" : {
						visible : true,
						x : coord[0],
						y : coord[1],
					},
					"3d": {
						rotate: aGame.mViewAs==JocGame.PLAYER_A?piece.angle:piece.angle-180,
						z: T*.05,
						rotateX: 0,
					},
				});
			} else
				xdv.hideGadget(id);
		}
	}

	View.Board.xdBuildHTStateMachine = function(xdv, htsm, aGame) {
		var $this = this;

		var amiralCapture = this.YohohoAmiralCapture(aGame, this.mWho);
		var captures = this.YohohoCaptures(aGame, this.mWho);
		var move = {};
		
		function Highlight(item,type) {
			var pos, piece=null, pieceId=null;
			if(typeof item=="object") {
				piece=item;
				pieceId=piece.type+":"+piece.s+":"+piece.index;
				pos=piece.pos;
			} else {
				pos=item;
				var pieceIndex=$this.board[pos];
				if(pieceIndex>=0) {
					piece=$this.pieces[pieceIndex];
					pieceId=piece.type+":"+piece.s+":"+piece.index;
				}
			}
			var event,eventArgs,maskClass,hexColor;
			switch(type) {
			case "piece":
				event="E_PIECE_CLICKED";
				eventArgs={ piece: piece };
				maskClass="choice"+(aGame.mShowMoves ? " choice-view": "");
				hexColor=0x00ff00;
				break;
			case "position":
				event="E_DEST_CLICKED";
				eventArgs={ pos: pos };
				maskClass="choice"+(aGame.mShowMoves ? " choice-view": "");
				hexColor=0x00ff00;
				break;
			case "attack":
				event="E_PIECE_CAPTURE";
				eventArgs={ piece: piece };
				maskClass="choice"+(aGame.mShowMoves ? " choice-view-capture": "");
				hexColor=0xff0000;
				break;
			case "cancel":
				event="E_CLICK_CANCEL";
				eventArgs={ pos: pos };
				maskClass="choice choice-view-cancel";
				hexColor=0xffffff;
				break;
			}
			xdv.updateGadget("mask#" + pos,{
				base : {
					visible : true,
					click : function() {
						htsm.smQueueEvent(event, eventArgs);
					},
				},
				"2d" : {
					classes : maskClass,
				},
			});
			xdv.updateGadget("hex#" + pos,{
				"3d" : {
					click : function() {
						htsm.smQueueEvent(event, eventArgs);
					},
				},
				"cartoon3d": {
					color : hexColor,
					opacity : 1 ,					
				},
				"stylized3d": {
					color : hexColor,
					opacity : 1 ,
				},
			});
			if(piece)
				xdv.updateGadget(pieceId,{
					"3d" : {
						click : function() {
							htsm.smQueueEvent(event, eventArgs);
						},
					},
				});
		}

		function Init(args) {
			//$this.Log("HTInit");
		}
		function SelectFirst(args) {
			//$this.Log("HTSelectFirst");
			if (amiralCapture.risk) {
				for ( var i in amiralCapture.capture)
					Highlight(amiralCapture.capture[i].at,"attack");
				if (amiralCapture.escape.length > 0)
					Highlight(amiralCapture.escape[0].f,"piece");
			} else {
				for ( var i in captures)
					Highlight(captures[i].at,"attack");
				for ( var i in $this.pieces) {
					var piece = $this.pieces[i];
					if (piece.alive && piece.s == $this.mWho)
						Highlight(piece,"piece");
				}
			}
		}
		function Clean(args) {
			for ( var pos = 0; pos < aGame.g.Graph.length; pos++) {
				xdv.updateGadget("mask#" + pos, {
					"base" : {
						click : null,
						visible : false,
					},
					"2d" : {
						classes : "",
					},
				});
				xdv.updateGadget("hex#" + pos, {
					"3d" : {
						click : null,
					},
				});
				xdv.restoreGadgetProps("hex#" + pos, "initial");
			}
			for( var i in $this.pieces) {
				var piece=$this.pieces[i];
				xdv.updateGadget(piece.type+":"+piece.s+":"+piece.index, {
					"3d" : {
						click : null,
					},
				});				
			}
		}
		function SaveProps(args) {
			var piece=args.piece;
			var pieceId=piece.type+":"+piece.s+":"+piece.index;
			xdv.saveGadgetProps(pieceId,["x","y","z","rotate","rotateX"],"beforefirst");
		}
		function RestoreProps(args) {
			var piece=$this.pieces[$this.board[move.m[0].f]];
			var pieceId=piece.type+":"+piece.s+":"+piece.index;
			xdv.restoreGadgetProps(pieceId,"beforefirst");
		}
		function ClickFirst(args) {
			var spos = args.piece.pos;
			var index = $this.board[spos];
			if (index >= 0 && $this.pieces[index].s == -$this.mWho) {
				for ( var i in captures)
					if (captures[i].at == spos) {
						var cmove = captures[i];
						if (aGame.g.BattleSounds())
							aGame.PlaySound('assault');
						for ( var j in cmove.af)
							xdv.updateGadget("mask#" + cmove.af[i], {
								"base" : {
									visible : true,
								},
								"2d" : {
									classes : "attacker",
								},
							});
						xdv.updateGadget("mask#" + spos, {
							"base" : {
								visible : true,
							},
							"2d" : {
								classes : "attack",
							},
						});
						return;
					}
			}
			move = {
				t : 'm',
				m : [ {
					f : spos
				}, {} ]
			};
		}
		function SelectFirstDest(args) {
			//$this.Log("HTSelectFirstDest");
			var spos=move.m[0].f;
			Highlight(spos,"cancel");
			var pos = move.m[0].f;
			var piece = $this.pieces[$this.board[pos]];
			var poss = $this.YohohoReachablePositions(aGame, pos, piece.type,
					null, null);
			for ( var i in poss) {
				var pos1 = poss[i];
				Highlight(pos1,"position");
			}
		}
		function ClearMove(args) {
			move = {};
		}
		function ClickFirstDest(args) {
			var epos = args.pos;

			//$this.Log("HTClickFirstDest");
			if (aGame.g.BattleSounds())
				aGame.PlaySound('move');
			move.m[0].t = epos;
			var coord = aGame.getVCoord(epos);
			var coord0=aGame.getVCoord(move.m[0].f);

			var piece = $this.pieces[$this.board[move.m[0].f]];
			var pieceId = piece.type + ":" + piece.s + ":" + piece.index;
			xdv.updateGadget(pieceId, {
				base : {
					x : coord[0],
					y : coord[1],
				},
				"3d": {
					rotate: Angle(coord0,coord),
					//rotateEasing: TWEEN.Easing.Cubic.EaseInOut,
				},
			},500,function() {
				htsm.smQueueEvent("E_ANIMATE_DONE",{});
			});
		}
		function CheckFirstEnd(args) {
			var tCoord=aGame.g.Coord[move.m[0].t];
			var tr=tCoord[0];
			var tc=tCoord[1];
			var pieceType=$this.pieces[$this.board[move.m[0].f]].type;
			if($this.first ||
					($this.mWho==JocGame.PLAYER_A && tr==8 && pieceType=="C") ||
					($this.mWho==JocGame.PLAYER_B && tr==0 && pieceType=="C")) {
					aGame.MakeMove(move); 
			} else
				htsm.smQueueEvent("E_NO_END",{});
		}
		function SelectSecond(args) {
			//$this.Log("HTSelectSecond");
			var spos=move.m[0].t;
			Highlight(spos,"cancel");
			for ( var i in $this.pieces) {
				var piece = $this.pieces[i];
				if (piece.alive && piece.s == $this.mWho && piece.pos!=move.m[0].f)
					Highlight(piece,"piece");
			}
		}
		function ClickSecond(args) {
			var spos = args.piece.pos;
			var index = $this.board[spos];
			if (index >= 0 && $this.pieces[index].s == -$this.mWho) {
				for ( var i in captures)
					if (captures[i].at == spos) {
						var cmove = captures[i];
						if (aGame.g.BattleSounds())
							aGame.PlaySound('assault');
						for ( var j in cmove.af)
							xdv.updateGadget("mask#" + cmove.af[i], {
								"base" : {
									visible : true,
								},
								"2d" : {
									classes : "attacker",
								},
							});
						xdv.updateGadget("mask#" + spos, {
							"base" : {
								visible : true,
							},
							"2d" : {
								classes : "attack",
							},
						});
						return;
					}
			}
			move.m[1] = {
				f : spos
			};
		}
		function SelectSecondDest(args) {
			//$this.Log("HTSelectFirstDest");
			var spos=move.m[1].f;
			Highlight(spos,"cancel");
			var pos = move.m[1].f;
			var piece = $this.pieces[$this.board[pos]];
			var poss=$this.YohohoReachablePositions(aGame,pos,piece.type,move.m[0].f,move.m[0].t);
			for ( var i in poss) {
				var pos1 = poss[i];
				Highlight(pos1,"position");
			}
		}
		function ClearSecondMove(args) {
			delete move.m[1];
		}
		function ClickSecondDest(args) {
			var epos = args.pos;

			//$this.Log("HTClickSecondDest");
			if (aGame.g.BattleSounds()) {
				var board = new (aGame.GetBoardClass())(aGame);	
				board.CopyFrom($this);
				board.mWho = -$this.mWho;
				board.mBoardClass = $this.mBoardClass;
				board.ApplyMove(aGame,move);
				if(board.yohoho)
					aGame.g.YohohoSound();
				aGame.PlaySound('move');
			}
			move.m[1].t = epos;
			var coord = aGame.getVCoord(epos);
			var coord0 = aGame.getVCoord(move.m[1].f);

			var piece = $this.pieces[$this.board[move.m[1].f]];
			var pieceId = piece.type + ":" + piece.s + ":" + piece.index;
			xdv.updateGadget(pieceId, {
				base : {
					x : coord[0],
					y : coord[1],
				},
				"3d": {
					rotate: Angle(coord0,coord),
					//rotateEasing: TWEEN.Easing.Cubic.EaseInOut,
				},
			},500,function() {
				htsm.smQueueEvent("E_ANIMATE_DONE",{});
			});
		}
		function SendMove(args) {
			aGame.MakeMove(move); 
		}
		function AnimateCapture(args) {
			var spos=args.piece.pos;
			for(var i in captures)
				if(captures[i].at==spos) {
					var cmove=captures[i];
					if (aGame.g.BattleSounds()) aGame.PlaySound('assault');
					for(var j in cmove.af)
						xdv.updateGadget("mask#"+cmove.af[j],{
							"base": {
								visible: true,
							},
							"2d": {
								classes: "attacker"
							},
						});
					xdv.updateGadget("mask#"+spos,{
						"base": {
							visible: true,
						},
						"2d": {
							classes: "attack"
						},
					});
					setTimeout(function() {
						for(var j in cmove.af)
							xdv.updateGadget("mask#"+cmove.af[j],{
								"base": {
									visible: false,
								},
								"2d": {
									classes: ""
								},
							});
						xdv.updateGadget("mask#"+spos,{
							"base": {
								visible: false,
							},
							"2d": {
								classes: ""
							},
						});
						htsm.smQueueEvent("E_ANIMATE_DONE",{});
					},4000);
					move=captures[i];
					
					var coord=aGame.getVCoord(spos);
					var attackers=[];
					for(var j in cmove.af)
						attackers.push($this.pieces[$this.board[cmove.af[j]]]);
					AnimateAttack(xdv,aGame,args.piece,attackers);
					return;
				}
		}
		function BackFirst(args) {
			var spos=move.m[0].f;
			var piece=$this.pieces[$this.board[spos]];
			var pieceId=piece.type+":"+piece.s+":"+piece.index;
			var coord=aGame.getVCoord(spos);
			xdv.updateGadget(pieceId,{
				base: {
					x: coord[0],
					y: coord[1],
				},
			});
		}		
		
		htsm.smTransition("S_INIT", "E_INIT", "S_SELECT_FIRST", [ Init ]);
		htsm.smEntering("S_SELECT_FIRST", [ SelectFirst ]);
		htsm.smTransition("S_SELECT_FIRST", "E_PIECE_CLICKED",
				"S_SELECT_FIRST_DEST", [ SaveProps, ClickFirst ]);
		htsm.smTransition("S_SELECT_FIRST", "E_PIECE_CAPTURE",
				"S_ANIMATE_CAPTURE", [ AnimateCapture ]);
		htsm.smLeaving("S_SELECT_FIRST", [ Clean ]);
		htsm.smEntering("S_SELECT_FIRST_DEST", [ SelectFirstDest ]);
		htsm.smTransition("S_SELECT_FIRST_DEST", "E_CLICK_CANCEL",
				"S_SELECT_FIRST", [ ClearMove ]);
		htsm.smTransition("S_SELECT_FIRST_DEST", "E_DEST_CLICKED",
				"S_ANIMATE_FIRST", [ ClickFirstDest ]);
		htsm.smLeaving("S_SELECT_FIRST_DEST", [ Clean ]);

		htsm.smTransition("S_ANIMATE_FIRST","E_ANIMATE_DONE","S_CHECK_END",[CheckFirstEnd]);
		htsm.smTransition("S_CHECK_END","E_NO_END","S_SELECT_SECOND",[]);

		htsm.smEntering("S_SELECT_SECOND", [ SelectSecond ]);
		htsm.smTransition("S_SELECT_SECOND", "E_PIECE_CLICKED",
				"S_SELECT_SECOND_DEST", [ ClickSecond ]);
		htsm.smTransition("S_SELECT_SECOND", "E_CLICK_CANCEL",
				"S_SELECT_FIRST_DEST", [ RestoreProps, BackFirst, ClearSecondMove ]);
		htsm.smLeaving("S_SELECT_SECOND", [ Clean ]);
		htsm.smEntering("S_SELECT_SECOND_DEST", [ SelectSecondDest ]);
		htsm.smTransition("S_SELECT_SECOND_DEST", "E_CLICK_CANCEL",
				"S_SELECT_SECOND", [ ClearSecondMove ]);
		htsm.smTransition("S_SELECT_SECOND_DEST", "E_DEST_CLICKED",
				"S_ANIMATE_SECOND", [ ClickSecondDest ]);
		htsm.smLeaving("S_SELECT_SECOND_DEST", [ Clean ]);
		htsm.smTransition("S_ANIMATE_SECOND","E_ANIMATE_DONE","S_DONE",[SendMove]);
		htsm.smTransition("S_ANIMATE_CAPTURE","E_ANIMATE_DONE","S_DONE",[SendMove]);
		
		htsm.smTransition(["S_SELECT_FIRST","S_SELECT_FIRST_DEST","S_SELECT_SECOND","S_SELECT_SECOND_DEST","S_ANIMATE_CAPTURE","S_ANIMATE_FIRST","S_ANIMATE_SECOND","S_CHECK_END","S_DONE"],
				"E_END","S_DONE", [ Clean ]);
	}

	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		var $this=this;
		if(aMove.t=='m') {
			if (aGame.g.BattleSounds())
				aGame.PlaySound('move');
			if(this.yohoho) {
				aGame.g.YohohoSound();
			}
			var piece=this.pieces[this.board[aMove.m[0].t]];
			var pieceId=piece.type+":"+piece.s+":"+piece.index;
			var coord=aGame.getVCoord(aMove.m[0].t);
			var coord0=aGame.getVCoord(aMove.m[0].f);
			xdv.updateGadget(pieceId,{
				base: {
					x: coord[0],
					y: coord[1],
				},
				"3d": {
					rotate: Angle(coord0,coord),
					//rotateEasing: TWEEN.Easing.Cubic.EaseInOut,
				}
			},1000,function() {
				if(typeof aMove.m[1].f=="undefined") 
					aGame.MoveShown();
				else {
					if (aGame.g.BattleSounds())
						aGame.PlaySound('move');
					var piece=$this.pieces[$this.board[aMove.m[1].t]];
					var pieceId=piece.type+":"+piece.s+":"+piece.index;
					var coord=aGame.getVCoord(aMove.m[1].t);
					var coord0=aGame.getVCoord(aMove.m[1].f);
					xdv.updateGadget(pieceId,{
						base: {
							x: coord[0],
							y: coord[1],
						},
						"3d": {
							rotate: Angle(coord0,coord),
							//rotateEasing: TWEEN.Easing.Cubic.EaseInOut,
						}
					},500,function() {
						aGame.MoveShown();
					});
				}				
			});
		} else if(aMove.t=='a') {
			if (aGame.g.BattleSounds()) aGame.PlaySound('assault');
			
			for(var j in aMove.af)
				xdv.updateGadget("mask#"+aMove.af[j],{
					base: {
						visible: true,
					},
					"2d": {
						classes: "attacker",
					},
				});
			xdv.updateGadget("mask#"+aMove.at,{
				base: {
					visible: true,
				},
				"2d": {
					classes: "attack",
				},
			});
			setTimeout(function() {
				for(var j in aMove.af)
					xdv.updateGadget("mask#"+aMove.af[j],{
						base: {
							visible: false,
						},
						"2d": {
							classes: ""
						},
					});
				xdv.updateGadget("mask#"+aMove.at,{
					base: {
						visible: false,
					},
					"2d": {
						classes: ""
					},
				});
				aGame.MoveShown();
			},4000);
			var attackers=[];
			for(var j in aMove.af)
				attackers.push(aGame.mOldBoard.pieces[aGame.mOldBoard.board[aMove.af[j]]]);
			AnimateAttack(xdv,aGame,aGame.mOldBoard.pieces[aGame.mOldBoard.board[aMove.at]],attackers);
		}
		return false;
	}
	
})();

