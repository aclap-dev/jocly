/*
 *
 * Copyright (c) 2013 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

(function() {

	var SIZE,RADIUS,fullPath;
	var CLASSIC_WHITE = 0xbbaa99;
	var CLASSIC_BLACK = 0x222222;
	var colors=["","white","black","red"];
	var reflexivities=[0,0.1,0.9,0.7];
	//var reflexivities=[0,0,1,1];
	var sphereGeometry, textureCube;
	
	View.Game.xdInitExtra = function(xdv) {
	}

	View.Game.xdPreInit = function(xdv) {
	}

	View.Game.xdInit = function(xdv) {
				
		fullPath=this.mViewOptions.fullPath;
		if(typeof THREE!="undefined") {
			sphereGeometry = new THREE.SphereGeometry(1,32,16);
			var path = fullPath+"/res/xd-view/meshes/skybox/";
			var format = '.jpg';
			var urls = [
				path + 'px' + format, path + 'nx' + format,
				path + 'py' + format, path + 'ny' + format,
				path + 'pz' + format, path + 'nz' + format
			];
			textureCube = new THREE.CubeTextureLoader().load( urls );
		}

		this.xdPreInit();
		

		SIZE = this.mOptions.size;
		RADIUS = Math.round(5800/SIZE);
		
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
			}
		});
		xdv.createGadget("lightback", {
			"3d": {
				type: "custom3d",
				create: function() {
					var backlight = new THREE.PointLight( 0xaaccff, 1, 30 );
					return backlight;
				},
				z: -10000,
				//y: -4000,
				castShadow: false,
			}
		});
		
		xdv.createGadget("skyball", {
			"classic3d" : {
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
				    //var modifier = new THREE.SubdivisionModifier( 2 );
					//modifier.modify( graphGeometry );
					
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
						//color.setHSL( 0.7 * (zMax - point.z) / zRange, 1, 0.5 );
						
						/*var delta=(zMax - point.z)/zRange;
						color.b = 1+delta;
						color.g = 0.5+0.3*delta;
						color.r = 0.2*delta;*/

						var delta=(zMax - point.z)/zRange;
						color.b = 1+delta;
						color.g = 0.5+0.4*delta;
						color.r = 0.3*delta;



						
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

		function createScreen(videoTexture) {
			var $this=this;
			var smooth=0;
			this.getResource("smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/flatscreen.js",function(geometry , materials) {
 				var materials0=[];
 				
 				for(var i=0;i<materials.length;i++){
                    if (materials[i].name=="screen"){
	 					var mat=materials[i].clone();
 						mat.map=videoTexture;
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
		

		/*
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
							var gg=new THREE.TextGeometry(""+(pos+1),{
								size: 0.2,
								height: 0.05,
								curveSegments: 6,
								font: "helvetiker",
								
							});
							var gm=new THREE.MeshBasicMaterial();
							var mesh= new THREE.Mesh( gg , gm );
							return mesh;
						},
					},
				});
				//var sphereMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
			})(pos);
		}
		*/

		xdv.createGadget("board", {
			"wood" : {
				type : "image",
				file: fullPath + "/res/images/wood.png",
				z: 0,
			},
		});
		
		this.xdInitExtra(xdv);
		
	}
	
	var gadgetIds={};

	View.Game.isGadgetId = function(nid,type) {
		return gadgetIds[type+"#"+nid]!==undefined;
	}

	View.Game.spGadgetId = function(xdv,nid,type) {
		var id=type+"#"+nid;
		if(gadgetIds[id]===undefined) {
			gadgetIds[id]=true;
			var scaleFactor=RADIUS*.001*1.01;
			var transparent=false;
			var opacity=1;
			var makeSphere=true;
			var color2d="red", z2d=1, file2d=null;
			var scaleFactorWood=null;
			switch(type) {
			case "piece":
				transparent=true;
				z2d=4;
				break;
			case "cell":
				scaleFactor=RADIUS*.001*.5;
				transparent=true;
				opacity=.5;
				color2d="green";
				z2d=2;
				break;
			case "plot":
				scaleFactor=RADIUS*.001*.2;
				transparent=true;
				opacity=.7;
				color2d="blue";
				file2d="plot";
				scaleFactorWood=RADIUS*.001*.6;
				break;
			case "text":
				makeSphere=false;
				xdv.createGadget("text#"+nid, {
					"2d" : {
						type : "element",
						width : RADIUS*.2,
						height : RADIUS*.2,
						initialClasses: "notation",
						css : {
							"color": "#808080",
							"text-align" : "center",
							"font-weight" : "bold",
						},
						z : 2,
						display : function(element, width, height) {
							element.css({
								"font-size" : (height * 1) + "pt",
								"line-height" : (height * 1) + "px",
							}).text(nid/*pos+1*/);
						},
					},
					"3d": {
						type: "custommesh3d",
						z: 0,
						create: function() {
                            var $this = this;
                            this.getResource('font|'+fullPath+
                                '/res/xd-view/fonts/helvetiker_regular.typeface.json',
                                function(font) {
                                    var gg=new THREE.TextGeometry(""+(nid+/*1*/0),{
                                        size: RADIUS*$this.SCALE3D*.3,
                                        height: 0.05,
                                        curveSegments: 6,
                                        font: font,
                                    });
                                    var gm=new THREE.MeshPhongMaterial({
                                        //ambient: 0xff0000,

                                    });
                                    var mesh= new THREE.Mesh( gg , gm );
                                    $this.objectReady(mesh);                        
                                });
                            return null;
						},
					},
				});

			}
			if(makeSphere)
				xdv.createGadget(type+"#"+nid, {
					"2d": {
						type : "image",
						file: fullPath + "/res/images/"+(file2d?file2d:"ball_"+color2d)+".png",
						initialClasses: "xd-choice",
						width: RADIUS*2*scaleFactor,
						height: RADIUS*2*scaleFactor,
						z: z2d,
						opacity: opacity,
						classes: "sp-disk",
					},
					"wood": {
						width: RADIUS*2*(scaleFactorWood?scaleFactorWood:scaleFactor),
						height: RADIUS*2*(scaleFactorWood?scaleFactorWood:scaleFactor),
					},
					"3d": {
						type: "custommesh3d",
						scale: [scaleFactor,scaleFactor,scaleFactor],
						//opacity: opacity,
						create: function() {
	                        
	                        var shininess = 500, specular = 0xffffff, shading = THREE.SmoothShading;
	                        var sphereMaterial = new THREE.MeshPhongMaterial( {
	                                //map: imgTexture,
	                        		name: "ball",
	                                //color: 0xffffff,
	                                //ambient: 0x000000,
	                                specular: specular,
	                                shininess: shininess,
	                                shading: shading,
	                                opacity: opacity,
	                                transparent: transparent,
	                                envMap: textureCube,
	                                reflectivity: 0.2,
	                                combine: THREE.MixOperation, 
	                                //combine: THREE.AddOperation, 
	                           	    //combine: THREE.MultiplyOperation,
	                        } );
	                        var geometry=sphereGeometry.clone();
	                        for(var i=0;i<geometry.faces.length;i++) {
	                        	geometry.faces[i].materialIndex=0;
	                        }
	                        var sphere = new THREE.Mesh(geometry,new THREE.MultiMaterial( [sphereMaterial] ));
	                        return sphere;
						},
					},
				});				
		}
		return id;
	}
	
	View.Game.xdBuildScene = function(xdv) {
		var $this=this;

		xdv.updateGadget("board",{
			"wood": {
				visible: true,
				width: RADIUS*2*(SIZE+.3),
				height: RADIUS*2*(SIZE+.3),
			},
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
		xdv.updateGadget("skyball",{
			"3d": {
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

		for(var pos=0;pos<SIZE*SIZE;pos++) {
			var coord=this.getVCoord(pos);
			xdv.updateGadget(this.spGadgetId(xdv,pos,"plot"),{
				base: {
					visible: true,
					x: coord[0],
					y: coord[1],
				},
				"3d" : {
					materials: {
						"ball": {
							map: fullPath+"/res/xd-view/meshes/grey.png",
						},
					}
				},
			});			
		}
		
		for(var pos=0; pos<this.g.Graph.length;pos++) {
			var coord=this.getVCoord(pos);
			xdv.updateGadget(this.spGadgetId(xdv,pos,"text"),{
				base : {
					visible: this.mNotation,
					x: coord[0],
					y: coord[1],
				},
				"3d" : {
					x: coord[0]-RADIUS*.25,
					z: coord[2]-RADIUS*.15,
				},
			});			
		}

	}
	
	View.Game.getVCoord = function() {
		var r,c,h;
		if(arguments.length==1) {
			var pos=arguments[0];
			var rcCoord=this.g.Coord[pos];
			r=rcCoord[0];
			c=rcCoord[1];
			h=rcCoord[2];
		} else {
			r=arguments[0];
			c=arguments[1];
			h=arguments[1];
		}
		var vx=((c-(SIZE-1)/2)+h/2);
		var vy=((r-(SIZE-1)/2)+h/2);
		var vz=(h)*Math.sqrt(2)/2;
		return [vx*2*RADIUS,vy*2*RADIUS,vz*2*RADIUS];
	}
	
	View.Game.getCCoord=function(pos) {
		var rcCoord=this.g.Coord[pos];
		var r=rcCoord[0];
		var c=rcCoord[1];
		var h=rcCoord[2];
		return this.getVCoord(r,c,h);
	}

	View.Board.xdDisplay = function(xdv, aGame) {
		//console.log("xdDisplay board",this);
		var scaleFactor=RADIUS*.001*1.01;
		for(var pos=0;pos<aGame.g.Coord.length;pos++) {
			if(this.board[pos]==0 && aGame.isGadgetId(pos,"piece"))
				xdv.updateGadget(aGame.spGadgetId(xdv,pos,"piece"),{
					base : {
						visible: false,
					},
				});
			else if(this.board[pos]) {
				var coord=aGame.getVCoord(pos);
				var coordInt=aGame.g.Coord[pos];
				xdv.updateGadget(aGame.spGadgetId(xdv,pos,"piece"),{
					base : {
						visible: true,
						x: coord[0],
						y: coord[1],
					},
					"2d" : {
						file: fullPath + "/res/images/ball_"+colors[this.board[pos]]+".png",
						width: RADIUS*2,
						height: RADIUS*2,
						z: coordInt[2]*2+4,
					},
					"3d" : {
						z: coord[2],
						scale: [scaleFactor,scaleFactor,scaleFactor],
						materials: {
							"ball": {
								map: fullPath+"/res/xd-view/meshes/"+colors[this.board[pos]]+".png",
								reflectivity: reflexivities[this.board[pos]],
								opacity: 1,
							},
						}
					},
				});				
			}
			xdv.updateGadget(aGame.spGadgetId(xdv,pos,"text"),{
				"2d" : {
					visible: aGame.mNotation && this.board[pos]==0 && aGame.g.Beneath[pos]==null,
				},
			});	
		}
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
		var clickPos;
		var selfColor=(1-this.mWho)/2+1;
		var moves=this.GenerateAllMoves(aGame);
		var moveFrom=null, moveTo=null, selMove;
		
		function Highlight(pos,type) {
			//console.log("Highlight",pos,type);
			function Click() {
				htsm.smQueueEvent("E_CLICK",{pos:pos,type:type});				
			}
			var coord=aGame.getVCoord(pos);
			var coordInt=aGame.g.Coord[pos];
			var color="green";
			var gtype="piece";
			if(type=="normal") {
				if($this.board[pos]==0) 
					gtype="cell";
				else gtype=null;
			} else if(type=="moveto") {
				gtype="cell";
			} else if(type=="cancel") {
				color="red";
			}
			if(gtype)
				xdv.updateGadget(aGame.spGadgetId(xdv,pos,gtype),{
					base: {
						visible: true,
						x: coord[0],
						y: coord[1],
						click: Click,
						z: coordInt[2]*2+5,
					},
					"2d": {
						file: fullPath+"/res/images/ball_"+color+".png",
					},
					"3d": {
						z: coord[2],
						materials: {
							"ball": {
								map: fullPath+"/res/xd-view/meshes/"+color+".png",
								reflectivity: color=="red"||color=="green"?.1:reflexivities[selfColor],
							},
						},
					}
				});
		}
		function Init(args) {
			//console.log("moves",moves);
		}
		function Clean(args) {
			for(var pos=0;pos<aGame.g.Graph.length;pos++) {
				if(aGame.isGadgetId(pos,"cell")) {
					xdv.updateGadget(aGame.spGadgetId(xdv,pos,"cell"),{
						base: {
							visible: false,
							click: null,
						}
					});
				}
				if(aGame.isGadgetId(pos,"piece")) {
					if($this.board[pos]) {
						xdv.updateGadget(aGame.spGadgetId(xdv,pos,"piece"),{
							base: {
								click: null,
							},
							"2d": {
								file: fullPath+"/res/images/ball_"+colors[$this.board[pos]]+".png",
							},
							"3d": {
								materials: {
									"ball": {
										map: fullPath+"/res/xd-view/meshes/"+colors[$this.board[pos]]+".png",
										reflexivity:reflexivities[$this.board[pos]],
									},
								},
							}
						});				
					}
				} 
			}
		}
		function Select(args) {
			var typeNormal={}, typeMoveFrom={}
			for(var i=0;i<moves.length;i++) {
				var move=moves[i];
				if(move.act=="+")
					typeNormal[move.pos]=true;
				else if(move.act==">")
					typeMoveFrom[move.from]=true;
			}
			for(var pos in typeNormal)
				Highlight(pos,"normal");
			for(var pos in typeMoveFrom)
				Highlight(pos,"movefrom");
		}
		function SelectTo(args) {
			Highlight(moveFrom,"cancel");
			for(var i=0;i<moves.length;i++) {
				var move=moves[i];
				if(moveFrom==move.from) {
					Highlight(move.to,"moveto");
				}
			}
		}
		function Save(args) {
			clickPos=args.pos;
			for(var i=0;i<moves.length;i++) {
				var move=moves[i];
				if(moveFrom===null) {
					if(move.pos==clickPos) {
						move0=move;
						return;
					}
				} else if(move.from==moveFrom && move.to==moveTo) {
					move0=move;
					return;
				}
			}
			console.error("move not found",clickPos,moves);
		}
		function Animate(args) {
			$this.spAnimateMove(xdv,aGame,move0,function() {
				htsm.smQueueEvent("E_ANIM_DONE",{});				
			});
		}
		function SendMove(args) {
			aGame.MakeMove(move0);
		}
		function Click(args) {
			switch(args.type) {
			case "normal":
				htsm.smQueueEvent("E_CLICK_ADD",args);				
				break;
			case "movefrom":
				moveFrom=args.pos;
				htsm.smQueueEvent("E_CLICK_FROM",args);				
				break;
			case "moveto":
				moveTo=args.pos;
				htsm.smQueueEvent("E_CLICK_TO",args);				
				break;
			case "cancel":
				htsm.smQueueEvent("E_CLICK_CANCEL",args);				
				break;
			}
		}
		function Cancel(args) {
			moveFrom=null;
		}

		htsm.smTransition("S_INIT", "E_INIT", "S_SELECT", [ Init ]);
		htsm.smEntering("S_SELECT", [ Select ]);
		htsm.smTransition("S_SELECT", "E_CLICK",null, [ Clean, Click ]);
		htsm.smTransition("S_SELECT", "E_CLICK_FROM",null, [ SelectTo ]);
		htsm.smTransition("S_SELECT", "E_CLICK_TO","S_ANIMATING", [ Save, Animate ]);
		htsm.smTransition("S_SELECT", "E_CLICK_ADD","S_ANIMATING", [ Save, Animate ]);
		htsm.smTransition("S_SELECT", "E_CLICK_CANCEL",null, [ Clean, Cancel, Select ]);
		//htsm.smTransition("S_SELECT", "E_ANIM_DONE",null, [ ]);
		htsm.smLeaving("S_SELECT", [ Clean ]);
		htsm.smTransition("S_ANIMATING","E_ANIM_DONE","S_DONE",[SendMove])

		htsm.smTransition(["S_SELECT","S_DONE"],"E_END","S_DONE",[]);
		htsm.smEntering("S_DONE",[Clean]);
	}
	
	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		aGame.mOldBoard.spAnimateMove(xdv,aGame,aMove,function() {
			aGame.MoveShown();
		})
		return false;
	}

	View.Board.spAnimateMove = function(xdv, aGame, aMove, callback) {
		if(aMove.act=="+")
			this.spAnimateMoveAdd.apply(this,arguments);
		else if(aMove.act==">")
			this.spAnimateMoveShift.apply(this,arguments);
	}
	
	View.Board.spAnimateMoveAdd = function(xdv, aGame, aMove, callback) {
		var selfColor=(1-this.mWho)/2+1;
		var coord=aGame.getVCoord(aMove.pos);
		var coordInt=aGame.g.Coord[aMove.pos];
		var scaleFactor0=RADIUS*.001*0.001;
		var scaleFactor=RADIUS*.001*1.01;
		xdv.updateGadget(aGame.spGadgetId(xdv,aMove.pos,"piece"),{
			base: {
				visible: true,
				x: coord[0],
				y: coord[1],
			}, 
			"2d": {
				width: RADIUS*2*scaleFactor0, 
				height: RADIUS*2*scaleFactor0,
				z: coordInt[2]*2+4,
				file: fullPath + "/res/images/ball_"+colors[selfColor]+".png",
			},
			"3d": {
				z: coord[2],										
				scale: [scaleFactor0,scaleFactor0,scaleFactor0],
				materials: {
					"ball": {
						map: fullPath+"/res/xd-view/meshes/"+colors[selfColor]+".png",
						reflectivity: reflexivities[selfColor],
						opacity: 1,
					},
					transparent: true,
				},
			},
		});
		xdv.updateGadget(aGame.spGadgetId(xdv,aMove.pos,"piece"),{
			base: {
			},
			"2d": {
				width: RADIUS*2, 
				height: RADIUS*2, 
			},
			"3d": {
				scale: [scaleFactor,scaleFactor,scaleFactor],
			}
		},800,function() {
			if(aMove.remove!==undefined && aMove.remove.length>0)
					DeleteBalls(aMove.remove);
			else
				callback();
		});
		var animCount;
		function EndAnim() {
			if(--animCount==0)
				callback();
		} 
		function DeleteBalls(del) {
			animCount=del.length;
			for(var i=0;i<del.length;i++) {
				xdv.updateGadget(aGame.spGadgetId(xdv,del[i],"piece"),{
					base: {
					},
					"2d": {
						width: RADIUS*2*scaleFactor0, 
						height: RADIUS*2*scaleFactor0, 						
					},
					"3d": {
						scale: [scaleFactor0,scaleFactor0,scaleFactor0],
					}
				},800,function() {
					EndAnim();
				});				
			}
		}
	}

	View.Board.spAnimateMoveShift = function(xdv, aGame, aMove, callback) {
		//console.log("spAnimateMoveShift",aMove,this);
		var animCount=0;
		function EndAnim() {
			if(--animCount==0)
				callback();
		} 
		var down=[];
		for(var i=aMove.down.length-1;i>=0;i--)
			down.push(aMove.down[i]);
		down.push(aMove.from);
		down.push(aMove.to);
		try{
		for(var i=1;i<down.length;i++) {
			var pos0=down[i-1];
			var coord0=aGame.getVCoord(pos0);
			var coord1=aGame.getVCoord(down[i]);
			var coord1Int=aGame.g.Coord[down[i]];
			var distance=Math.sqrt((coord0[0]-coord1[0])*(coord0[0]-coord1[0])+(coord0[1]-coord1[1])*(coord0[1]-coord1[1]))
			var jump=i==down.length-1 && distance>2*RADIUS*1.1;
			animCount++;
			(function(coord0,coord1,jump) {
				xdv.updateGadget(aGame.spGadgetId(xdv,pos0,"piece"),{
					base: {
						x: coord1[0],
						y: coord1[1],
					},
					"2d": {
						z: coord1Int[2]*2+4,
					},
					"3d": {
						z: coord1[2],
						positionEasingUpdate: function(ratio) {
							if(jump) {
								var y=((.25-(ratio-.5)*(ratio-.5))*4*RADIUS*2+coord0[2])*this.SCALE3D;
								this.object3d.position.y=y;
							}
						},
					}
				},800,function() {
					EndAnim();
				});
			})(coord0,coord1,jump);
		}
		} catch(e) { debugger; }
	}
	
})();

