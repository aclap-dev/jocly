/*
 *
 * Copyright (c) 2013 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

(function() {

	var SIZE, fullPath;
	var full2dWidth,full2dHeight;
	// 3d data in blender units
	var NBCOLS,NBROWS;
	var CELLSIZE=2;
	var interspace=CELLSIZE/5;
	var CELLTHICKNESS=.1;
	var connect4Color;
	var BLENDER2WORLD;//=1000;
	var bTorus; 
	var alpha,R;
	var nbBackLights;
	var lightsR;
	var backLightIntensity;
	
	function colOrientation(c,step,deg){
		var angle=step==0?0:Math.PI;
		if (bTorus) angle+=(-c*alpha);
		if (deg) angle=angle*180/Math.PI;
		return angle;
	}			
	
	View.Game.fiarCoord2d = function(c,r) {
		return [(c+.5)*SIZE-full2dWidth/2,((this.mOptions.height-1)/2-r)*SIZE];
	}
	
	View.Game.fiarCoord3d = function(c,r,offset) {
		var x,y,z;
		var rotZ=0;
		var roffset = offset || 0;
		z=(r+.5-NBROWS/2)*CELLSIZE*BLENDER2WORLD;
		if (bTorus){
			rotZ=colOrientation(c,0,true);
			var r=R*Math.cos(alpha/2)-interspace/2;
			r+=roffset;
			y=r*Math.cos(c*alpha)*BLENDER2WORLD;
			x=r*Math.sin(c*alpha)*BLENDER2WORLD;
		}else{
			x=(c+.5-NBCOLS/2)*CELLSIZE*BLENDER2WORLD;
			y=0;
		}
		return [x,y,z,rotZ];
	}
	
	View.Game.xdInit = function(xdv) {
		SIZE=Math.ceil(12000/(Math.max(this.mOptions.width,this.mOptions.height)));
		full2dWidth=SIZE*this.mOptions.width;
		full2dHeight=SIZE*this.mOptions.height;
		fullPath=this.mViewOptions.fullPath;
		bTorus=this.mOptions.torus;
		
		// 3d data
		BLENDER2WORLD=1000;
		NBCOLS=this.mOptions.width;
		NBROWS=this.mOptions.height;
		alpha=(Math.PI*2)/NBCOLS;
		R = (CELLSIZE/2)/Math.sin(alpha/2);
		nbBackLights=bTorus?3:2;
		lightsR=bTorus?40000:20000; //7*R*BLENDER2WORLD
		backLightIntensity=bTorus?1.5:1.5;
		connect4Color=bTorus?0x0066ff:0x0066ff;

		for (var i=0;i<nbBackLights;i++) {
			(function(i) {
				xdv.createGadget("lightback"+i, {
					"3d": {
						type: "custom3d",
						create: function() {
							var backlight = new THREE.SpotLight( 0xbbbbbb, backLightIntensity );
							backlight.castShadow = bTorus?false:true;
							
							backlight.shadow.camera.near= bTorus?30:15;
							backlight.shadow.camera.far = bTorus?40:35;
							backlight.shadow.camera.fov = bTorus?60:70;
							
							backlight.shadow.mapSize.width = 4096;
							backlight.shadow.mapSize.height= 4096;

							var object3d = new THREE.Object3D();
							var target = new THREE.Object3D();
							target.position.set(
								-lightsR*Math.cos(i*(2*Math.PI)/nbBackLights),
								0,
								-lightsR*Math.sin(i*(2*Math.PI)/nbBackLights)	
							);
							object3d.add(target);
							backlight.target = target;
							object3d.add(backlight);

							return object3d;
						},
						x: lightsR*Math.cos(i*(2*Math.PI)/nbBackLights),
						y: lightsR*Math.sin(i*(2*Math.PI)/nbBackLights),
						//z: 5000,
						//x: -20000,
						//z: 10000,
						//y: 3000,
					}
				});
			})(i);
		}
		
				
		// standard board

		function moveCellFlat(c,r,mesh,step){
			mesh.position.y=0;
			mesh.position.y=(r+.5-NBROWS/2)*CELLSIZE;
			mesh.position.x=step==0?(-interspace/2):(interspace/2);
			mesh.position.z=(c+.5-NBCOLS/2)*CELLSIZE;
			//mesh.rotation.y=step>0?0:Math.PI;
			mesh.rotation.y=colOrientation(c,step);
		}
		// cylinder board
		function moveCellTorus(c,r,mesh,step){
			mesh.position.y=(r+.5-NBROWS/2)*CELLSIZE;

			var r=R*Math.cos(alpha/2);
			r=r-step*(interspace+CELLTHICKNESS);
			
			mesh.position.x=r*Math.cos(c*alpha);
			mesh.position.z=r*Math.sin(c*alpha);
			
			//mesh.rotation.y=step==0?0:Math.PI;
			//mesh.rotation.y+=(-c*alpha);
			mesh.rotation.y=colOrientation(c,step);

			
			if (step>0) mesh.scale.z = 1-interspace*Math.tan(alpha/2);
		}					
		var moveCell = bTorus?moveCellTorus:moveCellFlat;
						
		xdv.createGadget("board3d",{
			"3d": {
				type: "custommesh3d",
				create: function(callback){
				
					var parentObject = new THREE.Object3D();//create an empty container
					
					var nbCells=NBCOLS*NBROWS;
					
					var resCount=4; // cell+ring+foot+board xtras
					var childObjects=[];
					
					function checkLoaded(){
						if (--resCount==0){		
							for (var n=0 ; n < childObjects.length ; n++) {
								parentObject.add(childObjects[n]);
							}
							callback(parentObject);
						}
					}
					
					var matBlueFlat = new THREE.MeshPhongMaterial( { 
						wireframe: false , 
						shading: THREE.FlatShading ,
						color: connect4Color,
						specular: 0x111111,
						shininess:40,
					} ) ;

					
					var $this=this;
					var smooth=0;
					var url="smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/connect4cell.js";	
					this.getResource(url,function(geometry , materials){						
						for (var step=0 ; step < 2 ; step++){
							for (var r = 0 ; r < NBROWS ; r++){
								for (var c = 0 ; c < NBCOLS ; c++ ){
									var mesh = new THREE.Mesh( geometry , matBlueFlat ) ;
									mesh.receiveShadow=false;
									mesh.castShadow=true;
									moveCell(c,r,mesh,step);
									childObjects.push(mesh);
								}
							}
						}
						checkLoaded();
					});
					smooth=0;
					url="smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/connect4cell-ring-smoothed.js";	
					this.getResource(url,function(geometry , materials){						
						for (var step=0 ; step < 2 ; step++){
							for (var r = 0 ; r < NBROWS ; r++){
								for (var c = 0 ; c < NBCOLS ; c++ ){
									var mesh = new THREE.Mesh( geometry , new THREE.MeshPhongMaterial( { 
												wireframe: false , 
												shading: THREE.SmoothShading ,
												color: connect4Color,
												specular: 0x333333,
											} ) );
									mesh.receiveShadow=false;
									mesh.castShadow=true;
									moveCell(c,r,mesh,step);
									childObjects.push(mesh);
								}
							}
						}
						checkLoaded();
					});
					smooth=0;
					url="smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/connect4cell-foot.js";	
					this.getResource(url,function(geometry , materials){						
						if (!bTorus){
							for (var step=0 ; step < 2 ; step++){
								var mesh = new THREE.Mesh( geometry , matBlueFlat );
								var z=step==0?NBCOLS/2*CELLSIZE:-NBCOLS/2*CELLSIZE;
								mesh.position.x=0;
								mesh.position.y=(-NBROWS/2+.5)*CELLSIZE;
								mesh.position.z=z;
								childObjects.push(mesh);
								
								var border1=new THREE.Mesh(
									new THREE.BoxGeometry(.6,CELLSIZE*NBROWS,.2),
									matBlueFlat);
								border1.position.z=z;
								childObjects.push(border1);
							}
						}
						checkLoaded();
					});
					// board xtras
					{
						if (bTorus){
							for (var c=0;c<NBCOLS;c++){
								var bar=new THREE.Mesh(
									new THREE.BoxGeometry(interspace*1.4,interspace,CELLSIZE*1.2),
									matBlueFlat);
								moveCell(c,-.5,bar,.5);
								childObjects.push(bar);
							}
						}else{
							var border1=new THREE.Mesh(
									new THREE.BoxGeometry(.6,.2,CELLSIZE*NBCOLS),
									matBlueFlat);
								border1.position.y=-(NBROWS/2)*CELLSIZE;
								childObjects.push(border1);
						}
						checkLoaded();
					}
					
					return null;
				},
			}	
		});
		
		for(var r=0;r<this.mOptions.height;r++)
			for(var c=0;c<this.mOptions.width;c++) {
				var pos=r*this.mOptions.width+c;
				var coord2d=this.fiarCoord2d(c,r);
				xdv.createGadget("cell#"+pos, {
					"2d" : {
						type : "sprite",
						x : coord2d[0],
						y : coord2d[1],
						z : 2,
						file : fullPath+"/res/sprites2d.png",
						clipx: 0,
						clipy: 0,
						clipwidth: 200,
						clipheight: 200,
						width: SIZE,
						height: SIZE,
					},
				});
			}
		for(var c=0;c<this.mOptions.width;c++) {
			var $this=this;
			(function(c){
				var notation=String.fromCharCode(65+c);
				var coord2d=$this.fiarCoord2d(c,$this.mOptions.height-1);
				var coord3d=$this.fiarCoord3d(c,$this.mOptions.height-.7,bTorus?1:0);
				var centeringOffset=0.2*BLENDER2WORLD;
				if (bTorus){
					coord3d[3]+=90;
					var a=c*alpha;
					coord3d[0]+=centeringOffset*Math.cos(a);
					coord3d[1]-=centeringOffset*Math.sin(a);
				}else{
					coord3d[3]-=90;
					coord3d[0]-=.2*BLENDER2WORLD;
				}
				xdv.createGadget("text#"+c,{
					"2d": {
						type : "element",
						x : coord2d[0],
						y : coord2d[1],
						z : 3,
						initialClasses: "fiar-text",
						display : function(element, width, height) {
							element.css({
								"font-size" : (height * .5) + "pt",
								"line-height" : (height * 1) + "px",
							}).text(notation);
						},
					},
					"3d":{
						type: "custommesh3d",
						x: coord3d[1],
						y: coord3d[0],
						z: coord3d[2]+CELLSIZE/2*BLENDER2WORLD,
						rotate: coord3d[3],
						create: function() {
                            var $this = this;
                            this.getResource('font|'+fullPath+
                                '/res/xd-view/fonts/helvetiker_regular.typeface.json',
                                function(font) {
                                var gg=new THREE.TextGeometry(""+notation,{
                                    size: 0.6,
                                    height: 0.05,
                                    curveSegments: 6,
                                    font: font,
                                });
                                var gm=new THREE.MeshPhongMaterial( { color: 0xff0000 } );
                                var mesh= new THREE.Mesh( gg , gm );
                                $this.objectReady(mesh);
                            });
							return null;
						},						
					}
				});
				xdv.createGadget("clicker#"+c+"t", {
					"2d" : {
						type : "element",
						x : (c+.5)*SIZE-6000,
						y : -SIZE,
						z : 4,
						width: SIZE,
						height: $this.mOptions.height*SIZE,
						/*
						css: {
							"background-color": "rgba(255,0,0,.6)",
							"border": "1px solid Black",
						}
						*/
					},
					"3d" : {
						type: "custommesh3d",
						create: function(callback){
							
							var pivot = new THREE.Object3D();//create an empty container
							//var pivot = new THREE.Mesh(new THREE.CubeGeometry(10,10,10),new THREE.MeshPhongMaterial());//create an empty container
							
							var gg=new THREE.BoxGeometry((2*CELLTHICKNESS+interspace)*.05,CELLSIZE*NBROWS,CELLSIZE);
							var mesh = new THREE.Mesh( gg , 
								new THREE.MeshPhongMaterial( { 
													wireframe: true , 
													color: Math.random()*0xffffff,
													shininess:10,
													transparent: true,
													opacity: 0,
												} ) );
							mesh.position.z=(c+.5-NBCOLS/2)*CELLSIZE;
							moveCell(c,NBROWS/2-.5,mesh,0);
							//mesh.rotation.y=colOrientation(c,0);
							pivot.add(mesh);
							callback(pivot);
						},
					},
				});
				xdv.createGadget("clicker#"+c+"b", {
					"2d" : {
						type : "element",
						x : (c+.5)*SIZE-6000,
						y : ($this.mOptions.height/2)*SIZE,
						z : 4,
						width: SIZE,
						height: 2*SIZE,
						/*
						css: {
							"background-color": "rgba(0,0,255,.6)",
							"border": "1px solid Black",
						}
						*/
					},
					"3d" : {
						type: "custommesh3d",
						create: function(callback){
							var group = new THREE.Object3D();//create an empty container
							var gg=new THREE.BoxGeometry((4*CELLTHICKNESS+interspace)*1.1,CELLSIZE,CELLSIZE);
							var mesh = new THREE.Mesh( gg , 
								new THREE.MeshPhongMaterial( { 
													wireframe: true , 
													color: Math.random()*0xffffff,
													shininess:250,
													transparent: true,
													opacity: 0,													
												} ) );
							mesh.position.z=(c+.5-NBCOLS/2)*CELLSIZE;
							moveCell(c,0,mesh,0);
							//mesh.rotation.y=colOrientation(c,0);
							group.add(mesh);
							callback(group);
						},
					},
				});
			})(c);	
		}

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
 						mat.emissive = {r:1,g:1,b:1};
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

		var scaleScreen=5;
		var zScreen=0;
		var xScreen=3000;
		var yScreen=(NBCOLS/2+2)*CELLSIZE*BLENDER2WORLD;
		var screenAngle=25;
		xdv.createGadget("videoa",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return createScreen.call(this,videoTexture);
				},
				z: zScreen,
				x: xScreen,
				y: yScreen,
				rotate: -(180-screenAngle),
				scale: [scaleScreen,scaleScreen,scaleScreen],
			},
		});
		xdv.createGadget("videob",{
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

		var fillerW=.05;
		for(var c=0;c<(this.mOptions.width+1);c++) {
			xdv.createGadget("filler#c"+c, {
				"2d" : {
					type : "element",
					x : c*SIZE-full2dWidth/2,
					y : 0,
					z : 3,
					width: SIZE*.05,
					height: (this.mOptions.height+fillerW)*SIZE,
					css: {
						"background-color": "#0065d0",
					}
					
				},				
			});
		}
		for(var r=0;r<(this.mOptions.height+1);r++) {
			xdv.createGadget("filler#r"+r, {
				"2d" : {
					type : "element",
					y : r*SIZE-full2dHeight/2,
					x : 0,
					z : 3,
					height: SIZE*.05,
					width: (this.mOptions.width+fillerW)*SIZE,
					css: {
						"background-color": "#0065d0",
					}
					
				},				
			});
		}
		if (bTorus){
			for (var c=0;c<2;c++){
				xdv.createGadget("fillertorus#c"+c, {
					"2d" : {
						type : "element",
						x : c*full2dWidth-full2dWidth/2,
						y : 0,
						z : 4,
						width: SIZE*.08,
						height: (this.mOptions.height+fillerW)*SIZE,
						initialClasses: c==0?"fiar-holes-left":"fiar-holes-right",						
					},				
				});				
			}
		}
	}
	
	var tokens={},tokenCounter=1;

	View.Game.fiarIsToken = function(c,r) {
		var token=tokens[c+"/"+r];
		return !!token;
	}

	View.Game.fiarRemoveToken = function(c,r) {
		var token=tokens[c+"/"+r];
		if(token)
			delete tokens[c+"/"+r];
	}
	
	View.Game.fiarMoveToken = function(c0,r0,c,r) {
		var token=tokens[c0+"/"+r0];
		if(token) {
			delete tokens[c0+"/"+r0];
			tokens[c+"/"+r]=token;
		}
	}
	
	View.Game.fiarGetToken = function(xdv,c,r,who) {
		var token=tokens[c+"/"+r];
		if(!token) {
			token="token#"+(tokenCounter++);
			var coord2d=this.fiarCoord2d(c,r);
			var coord3d=this.fiarCoord3d(c,r);
			xdv.createGadget(token, {
				"2d" : {
					type : "sprite",
					x : coord2d[0],
					y : coord2d[1],
					z : 1,
					file : fullPath+"/res/sprites2d.png",
					clipx: 0,
					clipy: 0,
					clipwidth: 200,
					clipheight: 200,
					width: SIZE,
					height: SIZE,
				},
				"3d" : {
					type: "meshfile",
					file : fullPath+"/res/xd-view/meshes/connect4-token.js",
					flatShading: true,
					x: coord3d[1],
					y: coord3d[0],
					z: coord3d[2],
					rotate: coord3d[3],
					receiveShadow:false //bTorus?false:true,
				}
			});
			tokens[c+"/"+r]=token;
		}
		if(arguments.length>3){
			var url=fullPath+"/res/xd-view/meshes/connect4-yellow.png";
			if (who==1) url=fullPath+"/res/xd-view/meshes/connect4-red.png";
			xdv.updateGadget(token,{
				"2d": {
					clipx : who==1?200:400,
				},
				"3d": {
					materials : {
						"token-mat" : {
							map: url,
						}
					}
				}
			});
		}
		return token;
	}

	View.Game.xdBuildScene = function(xdv) {
		for(var pos=0;pos<this.mOptions.width*this.mOptions.height;pos++)
			xdv.updateGadget("cell#"+pos, {
				"base" : {
					visible : true,
				},
			});
		xdv.updateGadget("board3d",{
			"3d":{
				visible : true,
			}
		});
		xdv.updateGadget("lightside",{
			"3d": {
				visible: true,
			},
		});
		for (var i=0;i<nbBackLights;i++){
			xdv.updateGadget("lightback"+i,{
				"3d": {
					visible: true,
				},
			});
		}
		xdv.updateGadget("videoa",{
			"3d": {
				visible: true,
				playerSide: 1,
			},
		});

		xdv.updateGadget("videob",{
			"3d": {
				visible: true,
				//rotate: 90,
				playerSide: -1,
			},
		});
		for(var c=0;c<this.mOptions.width;c++){
			xdv.updateGadget("text#"+c,{
				base: { 
					visible: this.mNotation,
				}
			});
		}
		for(var c=0;c<(this.mOptions.width+1);c++) {
			xdv.updateGadget("filler#c"+c, {
				"2d": {
					visible: true,
				}
			});
		}
		for(var r=0;r<(this.mOptions.height+1);r++) {
			xdv.updateGadget("filler#r"+r, {
				"2d": {
					visible: true,
				}
			});
		}
		if (bTorus){
			for (var c=0;c<2;c++){
				xdv.updateGadget("fillertorus#c"+c, {
					"2d": {
						visible: true,
					}
				});
			}
		}
	}
	
	View.Board.xdDisplay = function(xdv, aGame) {
		var wTokens={};
		if(this.mFinished)
			for(var i=0;i<aGame.g.TuplesList.length;i++) {
				var tuple=aGame.g.TuplesList[i];
				var counter={
					1: 0,
					0: 0,
					'-1': 0,
				};
				for(var j=0;j<tuple.length;j++)
					counter[this.board[tuple[j]]]++;
				if(counter[1]==aGame.mOptions.lines || counter['-1']==aGame.mOptions.lines)
					for(var j=0;j<tuple.length;j++)
						wTokens[tuple[j]]=true;
			}
		for(var r=0;r<aGame.mOptions.height;r++) {
			for(var c=0;c<aGame.mOptions.width;c++) {
				var pos=r*aGame.mOptions.width+c;
				if(this.board[pos]==0) {
					if(aGame.fiarIsToken(c,r)) {
						var token=aGame.fiarGetToken(xdv,c,r);
						xdv.updateGadget(token,{
							base: {
								visible: false,
							},
						});
					}
				} else {
					var token=aGame.fiarGetToken(xdv,c,r,this.board[pos]);
					var coord2d=aGame.fiarCoord2d(c,r);
					var coord3d=aGame.fiarCoord3d(c,r);
					var url=fullPath+"/res/xd-view/meshes/connect4";
					if (this.board[pos]==1) 
						url+="-red";
					else
						url+="-yellow";
					if (pos in wTokens) 
						url+="-star";
					url+=".png";
					xdv.updateGadget(token,{
						base: {
							visible: true,
						},
						"2d": {
							x : coord2d[0],
							y : coord2d[1],
							clipy : (pos in wTokens)?200:0,
						},
						"3d": {
							x: coord3d[1],
							y: coord3d[0],
							z: coord3d[2],
							rotate: coord3d[3],
							materials : {
								"token-mat" : {
									map: url,
								}
							}
						}
					});
				}
			}
		}
	}
	
	View.Board.xdBuildHTStateMachine = function(xdv, htsm, aGame) {
		var $this=this;
		function Select() {
			for(var i=0;i<$this.mMoves.length;i++) {
				var move=$this.mMoves[i];
				if(move.op=='+') {
					(function(col) {
						xdv.updateGadget("clicker#"+col+"t",{
							base: {
								visible: true,
								click: function() {
									htsm.smQueueEvent("E_CLICK",{col:col,op:'+'});
								},
							},
						});
						if(!aGame.mOptions.remove)
							xdv.updateGadget("clicker#"+move.col+"b",{
								base: {
									visible: true,
									click: function() {
										htsm.smQueueEvent("E_CLICK",{col:col,op:'+'});
									},
								},
							});
					})(move.col);
				} else if(move.op=='-') {
					(function(col) {
						xdv.updateGadget("clicker#"+move.col+"b",{
							base: {
								visible: true,
								click: function() {
									htsm.smQueueEvent("E_CLICK",{col:col,op:'-'});
								},
							},
						});
					})(move.col);
				}
			}
		}
		function Clean() {
			for(var col=0;col<aGame.mOptions.width;col++) {
				xdv.updateGadget("clicker#"+col+"t",{
					base: {
						visible: false,
						click: null,
					},
				});
				xdv.updateGadget("clicker#"+col+"b",{
					base: {
						visible: false,
						click: null,
					},
				});
			}
		}
		function Click(args) {
			if(args.op=='+')
				$this.fiarAnimateDrop(xdv,aGame,args.col,$this.cols[args.col],function() {
					aGame.HumanMove({
						col: args.col,
						op: '+',
					});			
				});
			else if(args.op=='-')
				$this.fiarAnimateOut(xdv,aGame,args.col,$this.cols[args.col]-1,function() {
					aGame.HumanMove({
						col: args.col,
						op: '-',
					});			
				});
		}
		htsm.smTransition("S_INIT", "E_INIT", "S_SELECT", [ Select ]);
		htsm.smTransition("S_SELECT", "E_CLICK", "S_ANIMATE", [ Clean, Click ]);
		htsm.smTransition(["S_SELECT","S_ANIMATE"], "E_END", "S_DONE", [ ]);
		htsm.smEntering("S_DONE",[Clean]);
	}
	
	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		if(aMove.op=='+')
			this.fiarAnimateDrop(xdv,aGame,aMove.col,this.cols[aMove.col]-1,function() {
				aGame.MoveShown();			
			});
		else if(aMove.op=='-')
			this.fiarAnimateOut(xdv,aGame,aMove.col,this.cols[aMove.col],function() {
				aGame.MoveShown();			
			});
	}
	
	View.Board.fiarAnimateDrop = function(xdv,aGame,c,r,callback) {
		var token = aGame.fiarGetToken(xdv,c,r,this.mWho);
		var coord2d=aGame.fiarCoord2d(c,r);
		var coord3d=aGame.fiarCoord3d(c,r);
		xdv.updateGadget(token,{
			base: {
				visible: true,
			},
			"2d": {
				x: coord2d[0],
				y: -13000,
				clipy: 0,
			},
			"3d":{
				y: coord3d[0],
				z: NBROWS/2*CELLSIZE*BLENDER2WORLD,
			}
		});
		
		aGame.PlaySound("sound2");

		xdv.updateGadget(token,{
			"2d": {
				y: coord2d[1],
			},
			"3d":{
				z: coord3d[2],		
			}
		},400,function() {
			callback();
		});
	}
	
	View.Board.fiarAnimateOut = function(xdv,aGame,c,topr,callback) {
		var animCount=0;
		var moved=[];
		function AnimEnd() {
			if(--animCount==0) {
				for(var i=0;i<moved.length;i++) {
					var from=moved[i].from;
					var to=moved[i].to;
					aGame.fiarMoveToken(from.c,from.r,to.c,to.r);
				}
				callback();
			}
		}
		var outToken=aGame.fiarGetToken(xdv,c,0,this.mWho);
		var coord2d=aGame.fiarCoord2d(c,0);
		var coord3d=aGame.fiarCoord3d(c,0);
		animCount++;
		xdv.updateGadget(outToken,{
			"2d": {
				x: coord2d[0],
				y: 13000,
			},
			"3d": {
				y: coord3d[0],
				z: -13000,
			}
		},600,function() {
			xdv.removeGadget(outToken);
			aGame.fiarRemoveToken(c,0);
			AnimEnd();
		});
		for(var i=1;i<=topr;i++) {
			(function(r) {
				var token=aGame.fiarGetToken(xdv,c,r);
				if(token) {
					moved.push({
						from: {
							c: c,
							r: r,
						},
						to: {
							c: c,
							r: r-1,
						},
					});
					var coord2d=aGame.fiarCoord2d(c,r-1);
					var coord3d=aGame.fiarCoord3d(c,r-1);
					animCount++;
					xdv.updateGadget(token,{
						"2d": {
							y: coord2d[1],
						},
						"3d": {
							z: coord3d[2],
						}
					},600,function() {
						AnimEnd();
					});					
				}
			})(i)
		}
	}
	
})();
