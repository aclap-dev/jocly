/*
 *
 * Copyright (c) 2013 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

(function() {

	var fullPath;
	var WIDTH, HEIGHT, SSIZE;
	var nbBoardLights=4;
	
	View.Game.xdInitExtra = function(xdv) {
	}

	View.Game.xdPreInit = function(xdv) {
	}

	View.Game.xdInit = function(xdv) {
				

		this.g.huntGameData={};
		// init defaults
		this.g.huntGameData.sceneXtras=[];
		this.g.huntGameData.preyJumpsAtWalk=false;
		this.g.huntGameData.clipwidth=155;
		this.g.huntGameData.clipheight=155;
		this.g.huntGameData.lightsIntensity=0.55;
		this.g.huntGameData.jumpEatScale=1.0; // unit = cell size
		this.g.huntGameData.jumpMoveScale=0.5; // unit = cell size
		this.g.huntGameData.killPieceZTempo=-0.3; // unit = cell size
		this.g.huntGameData.killPieceZFinal=-1; // unit = cell size
		this.g.huntGameData.boardColOffset=0; // to center exotic boards
		this.g.huntGameData.boardRowOffset=0; // to center exotic boards
		this.g.huntGameData.targetColorSelected=0xddffdd; // to center exotic boards
		this.g.huntGameData.soundMove=null; // to center exotic boards
		this.g.huntGameData.soundJump=null; // to center exotic boards
		this.g.huntGameData.soundEndJump=null; // to center exotic boards
		this.g.huntGameData.boardSize=1;
		this.g.huntGameData.boardStretch=true;
		
		
		this.xdPreInit();

		var huntGameData=this.g.huntGameData;

		
		var hl=this.g.huntLayout;
		var width0=hl.left+hl.boardWidth+hl.right;
		var height0=hl.header+hl.boardHeight+hl.footer;
		SSIZE=Math.floor(Math.min(
			12000/width0,
			12000/height0
		));
		WIDTH=width0*SSIZE;
		HEIGHT=height0*SSIZE;

		this.HuntMakeCoord();

		for (var l=0;l<nbBoardLights;l++){
			var r=8000;
			var angle=Math.PI/4+(2*Math.PI/nbBoardLights)*l;
			xdv.createGadget("blight#"+l, {
				"3d": {
					type: "custom3d",
					create: function() {
						var light = new THREE.SpotLight( 0xffffff, huntGameData.lightsIntensity );
						light.castShadow = false;
		
						light.shadow.camera.near = 3;
						light.shadow.camera.far = 20;
						light.shadow.camera.fov = 90;
						light.shadow.mapSize.width = 1024;
						light.shadow.mapSize.height = 1024;
						
						/*light.shadowCascade = true;
						light.shadowCascadeCount = 3;
						light.shadowCascadeNearZ = [ -1.000, 0.995, 0.998 ];
						light.shadowCascadeFarZ  = [  0.995, 0.998, 1.000 ];
						light.shadowCascadeWidth = [ 1024, 1024, 1024 ];
						light.shadowCascadeHeight = [ 1024, 1024, 1024 ];*/
						
						var object3d = new THREE.Object3D();
						var target = new THREE.Object3D();
						object3d.add(target);
						light.target = target;
						object3d.add(light);

						return object3d;
					},
					y: r*Math.sin(angle),
					x: r*Math.cos(angle),
					z: 6000,
				}
			});
		}
		
		for (var i=0;i<huntGameData.sceneXtras.length;i++){
			xdv.createGadget(
				huntGameData.sceneXtras[i].id, 
				huntGameData.sceneXtras[i].gadgetData
			);
		}

		var ratio=(hl.header+hl.boardHeight+hl.footer)/(hl.left+hl.boardWidth+hl.right);

		fullPath=this.mViewOptions.fullPath;
		xdv.createGadget("board", {
			"2d" : {
				type : "image",
			},
			"3d": {
				type : "custommesh3d",
				rotateX: -90,
				create: function() {
					if (huntGameData.fieldMap!==undefined){

						var $this = this ;
						
						var nbToBeLoaded = 1;
						if (huntGameData.fieldSpecMap!==undefined) nbToBeLoaded++;
						var nbLoaded = 0;
						
						var gg=new THREE.PlaneGeometry(12/((ratio>1)?ratio:1),12*((ratio<1)?ratio:1),1,1);
						
						var diffuseMap=null;
						var specMap=null;
						var specColor=0x000000;
						var shininess=0;

						
						function checkAllLoaded(){
							nbLoaded++;
							if (nbLoaded==nbToBeLoaded){
								var gm=new THREE.MeshPhongMaterial( {
									color: 0xffffff, 
									map: diffuseMap,
									specularMap: specMap,
									specular: specColor,
									shininess: shininess,
								 } );
								var mesh=new THREE.Mesh(gg,gm);
								mesh.rotation.z=Math.PI/2;
								mesh.receiveShadow=true;
								$this.objectReady(mesh);
							}
						}
						var textureLoaderDiff = new THREE.TextureLoader();
						//textureLoaderDiff.setCrossOrigin("anonymous"); 						
						textureLoaderDiff.load(
							fullPath+huntGameData.fieldMap,
							function(texture){
								diffuseMap = texture ;
								diffuseMap.wrapS = diffuseMap.wrapT = THREE.RepeatWrapping;
								diffuseMap.format = THREE.RGBFormat;
								checkAllLoaded();
							}
						);
						
						if (huntGameData.fieldSpecMap!==undefined){
							var textureLoaderSpec = new THREE.TextureLoader();
							//textureLoaderSpec.setCrossOrigin("anonymous"); 													
							textureLoaderSpec.loadTexture( 
								fullPath+huntGameData.fieldSpecMap ,
								function(texture){
									specMap = texture ;
									specMap.wrapS = specMap.wrapT = THREE.RepeatWrapping;
									specMap.format = THREE.RGBFormat;
									shininess=170;
									specColor=0xffffff;
									checkAllLoaded();
								}									
							);
						}
						return null; 
					}else{
						return null;
					}
				}
			},

		});
		
		xdv.createGadget("boardframe",{
			"3d": {
				type: "meshfile",
				file : fullPath+huntGameData.boardJSFile,
				flatShading: true,
				z : huntGameData.boardZ,
				receiveShadow : true,
				scale : [
					huntGameData.boardSize/((ratio>1 && huntGameData.boardStretch)?ratio:1),
					huntGameData.boardSize*((ratio<1 && huntGameData.boardStretch)?ratio:1),
					huntGameData.boardSize],				
			},
		});

		var pieceIndex=0;
		for(var who=0;who<2;who++) {
			for(var i=0;i<this.g.initialPos[who].length;i++) {
				var pos=this.g.initialPos[who][i];
				var hunter= (this.g.catcher==1 && who==1) || (this.g.catcher==-1 && who==0); 
				var jsFile= hunter?(this.mViewOptions.fullPath + huntGameData.hunterJSFile):(this.mViewOptions.fullPath + huntGameData.preyJSFile);
				var pieceScale= hunter?huntGameData.hunterScale:huntGameData.preyScale;
				var pieceMorph= hunter?huntGameData.hunterMorph:huntGameData.preyMorph;
				var z0=hunter?huntGameData.hunterZ0:huntGameData.preyZ0;
				var preloadMat=hunter?huntGameData.hunterMaterialsPreload:huntGameData.preyMaterialsPreload;
				var $this=this;
				(function(jsf,preloadMat) {	
					xdv.createGadget("piece#"+(pieceIndex++), {
						"2d": {
							type : "sprite",
							clipx : hunter?155:0,
							clipy : 0,
							clipwidth : huntGameData.clipwidth, 
							clipheight : huntGameData.clipheight, 
							width: SSIZE*.8,
							height: SSIZE*.8,
							file : $this.mViewOptions.fullPath + huntGameData.sprites,
							z : hunter?3:4, // to let preys jump over hunters
						},	
						"3d": {
							type:"custommesh3d",
							scale:[pieceScale,pieceScale,pieceScale],
							morphing: pieceMorph,
							z: z0,
							create: function(cb){ 
								var smooth=0;
								var url="smoothedfilegeo|"+smooth+"|"+jsf;
								var $this=this;
								this.getResource(url,function(geometry0 , materials0){
                                    //geometry.computeVertexNormals(); // needed in normals not exported in js file!
                                    var materials1=[];
                                    function Done() {
                                        if(--tasks==0) {
                                            var mesh = new THREE.Mesh( geometry0 , new THREE.MultiMaterial(materials1) ) ;
                                            cb(mesh);
                                        }
                                    }
                                    var tasks = 1;
                                    for(var m=0;m<materials0.length;m++) {
                                        (function(m) {
                                            tasks++;
                                            var newmat=materials0[m].clone();
                                            if (newmat.name===preloadMat.matName){
                                                $this.getMaterialMap(fullPath + preloadMat.matMap,function(matMap) {
                                                    newmat.map = matMap;
                                                    materials1[m] = newmat;
                                                    Done();
                                                });
                                            } else {
                                                materials1[m] = newmat;
                                                Done();
                                            }
                                        })(m);
                                    }
                                    Done();
                                });
								
								return null;
							}
						}, 
					});
				})(jsFile,preloadMat);
			}
		}

		for(var pos=0;pos<this.g.Graph.length;pos++) {
			var coord=this.getCCoord(pos);
			xdv.createGadget("cell#"+pos, {
				"base":{
					x : coord[0],
					y : coord[1],
				},
				"2d": {
					type : "element",
					x : coord[0],
					y : coord[1],
					z : 2,
					width : SSIZE*.9,
					height : SSIZE*.9,
					classes : "",
				},					
				"3d" : {
					type: "meshfile",
					file : fullPath+huntGameData.targetJSFile,
					flatShading: true,
					smooth : 0,
					z : -50,
					castShadow: false,
					scale: [0.8,0.8,0.8],
					materials: { 
						"square" : {
							transparent: true,
							opacity: 0,
						},
						"ring" : {
							color : 0xffffff,
							//specular : 0x050505,
							opacity: 0,
							transparent: true,
						}
					},
				},
			});
			(function(pos) {
				xdv.createGadget("text#"+pos, {
					"2d" : {
						type : "element",
						initialClasses: "xd-notation",
						display : function(element, width, height) {
							element.css({
								"font-size" : (height * .6) + "pt",
								"line-height" : (height * 1) + "px",
							}).text(pos+1);
						},
						x : coord[0]-SSIZE*.3,
						y : coord[1]-SSIZE*.3,
						z : 1,
						width : SSIZE*.2,
						height : SSIZE*.2,
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
						x : coord[0]-SSIZE*.2,
						y : coord[1]-SSIZE*.2,
						z : 100,
					},
				});
			})(pos);
		}
				
		function createScreen(videoTexture) {
			var $this=this;
			this.getResource("smoothedfilegeo|0|"+fullPath+"/res/xd-view/meshes/stade-screen.js",function(geometry , materials) {
 				var materials0=[];
 				
 				for(var i=0;i<materials.length;i++){
                    if (materials[i].name=="mat.screen"){
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
 				
 				var light = new THREE.SpotLight( 0xffffff, 5 );
				//light.castShadow = true;
				//light.shadowCameraVisible=true;
				/*light.shadowDarkness = 1;

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
				light.shadowCascadeHeight = [ 1024, 1024, 1024 ];*/
				light.position.set(0,0,2);
				light.target=mesh;
				
				mesh.add(light);

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
	
	View.Game.HuntMakeCoord=function() {

		var hl=this.g.huntLayout;
		var width0=hl.left+hl.boardWidth+hl.right;
		var height0=hl.header+hl.boardHeight+hl.footer;

		this.g.Coord=[];
		for(var i=0;i<this.g.RC.length;i++) {
			var rc=this.g.RC[i];
			var row=rc[0];
			var col=rc[1];
			row+=this.g.huntGameData.boardRowOffset;
			col+=this.g.huntGameData.boardColOffset;
			var coord;
			if(this.mViewAs==JocGame.PLAYER_A)
				coord=[
				       (col+1)*SSIZE-width0*SSIZE*.5,
				       (row+1)*SSIZE-height0*SSIZE*.5,
		               ];
			else
				coord=[
				       width0*SSIZE*.5-(col+1)*SSIZE,
				       height0*SSIZE*.5-(row+1)*SSIZE,
		               ];
			this.g.Coord.push(coord);
		}
	}

	
	View.Game.xdBuildScene = function(xdv) {
		var $this=this;
		var huntGameData=this.g.huntGameData;
		
		for (var l=0;l<nbBoardLights;l++){
			xdv.updateGadget("blight#"+l, {
				"3d" : {
					visible: true,
				}
			});
		}
		for (var i=0;i<huntGameData.sceneXtras.length;i++){
			xdv.updateGadget(
				huntGameData.sceneXtras[i].id, 
				huntGameData.sceneXtras[i].gadgetUpdateData
			);
		}
		xdv.updateGadget("boardframe",{
			"3d":{
				visible: true,
			}
		});		
		xdv.updateGadget("board",{
			"base":{
				visible: true,
			},
			"2d": {
				rotate: this.mViewAs==JocGame.PLAYER_A?0:180,
				x: 0,
				y: 0,
				width: WIDTH,
				height: HEIGHT,
				file : this.mViewOptions.fullPath + huntGameData.boardField2D,
			},
			"3d":{
				receiveShadow: true,
				visible: !(huntGameData.fieldMap===undefined),
			}
		});
		for(var pos=0;pos<this.g.Graph.length;pos++) {
			xdv.updateGadget("text#"+pos, {
				"base" : {
					visible: this.mNotation,
				},
			});
		}
		
		var screenZoom=huntGameData.screenScale;
		xdv.updateGadget("videoa",{
			"3d": {
				visible: true,
				scale:[screenZoom,screenZoom,screenZoom],
				rotate: this.mViewAs==1?180:0,
				rotateX: this.mViewAs==1?30:-30,
				z: 3000,
				y: this.mViewAs==1?huntGameData.screenDist:-huntGameData.screenDist,
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
				y: this.mViewAs==1?-huntGameData.screenDist:huntGameData.screenDist,
				playerSide: -1,
			},
		});
	}
	
	View.Game.getCCoord=function(pos) {
		return this.g.Coord[pos];
	}
	
	View.Board.xdDisplay = function(xdv, aGame) {
		for(var i=0;i<this.pieces.length;i++) {
			var piece=this.pieces[i];
			switch(piece.p) {
			case -2:
				var coord=aGame.GetOffBoardCoord(i,SSIZE);
				xdv.updateGadget("piece#"+i, {
					"base": {
						visible: true,
						x: coord[0],
						y: coord[1],
						rotate:180,
					},
				});
				break;
			case -1:
				xdv.updateGadget("piece#"+i, {
					"base": {
						visible: false,
					},
				});
				break;
			default:
				var hunter= aGame.g.catcher!=piece.s;
				var z0=hunter?aGame.g.huntGameData.hunterZ0:aGame.g.huntGameData.preyZ0;
				var coord=aGame.getCCoord(piece.p);
				xdv.updateGadget("piece#"+i, {
					"base": {
						visible: true,
						x: coord[0],
						y: coord[1],
					},
					"2d": {
						opacity: 1,
					},
					"3d":{
						rotate: piece.a,
						z: z0,
					}
				});
				break;
			}
		}
	}
	
	View.Board.xdBuildHTStateMachine = function(xdv, htsm, aGame) {
		var $this=this;
		var move={p:[]};
		var moves=[];
		if(aGame.g.useDrop)
			moves=this.HuntGetAllDropMoves(aGame);
		if(moves.length==0)
			moves=this.HuntGetAllMoves(aGame);
		var pieceIndex=-1;
		var killPieceIndex=-1;

		function Highlight(pos,capt,type) {
			var piece=null;
			var pieceIndex1=-1;
			if(pieceIndex>=0 && pos==move.p[move.p.length-1])
				pieceIndex1=pieceIndex;
			else if($this.board[pos])
				pieceIndex1=$this.board[pos].i;
			if(pieceIndex1>=0)
				piece=$this.pieces[pieceIndex1];
			var color;
			var event;
			var classes;
			switch(type) {
			case "normal": 
				event="E_CLICKED";
				color=aGame.g.huntGameData.targetColorSelected
				classes="highlight";
				break;
			case "cancel": 
				event="E_CANCEL";
				color=0xff4400;
				classes="back";
				break;
			case "confirm": 
				event="E_CONFIRM";
				color=0x00ff00;
				classes="confirm";
				break;
			}

			function SendEvent() {
				htsm.smQueueEvent(event, {pos:pos,capt:capt,type:type});
			}
			var showTarget=(aGame.mShowMoves||(type=="cancel")||(type=="confirm"));
			xdv.updateGadget("cell#"+pos,{
				"base": {
					visible: true,
					click : SendEvent,
				},
				"2d": {
					classes: classes,
					opacity: (aGame.mShowMoves || type=="cancel" || type=="confirm")?.5:0,
				},
				"3d" : {
					castShadow: false, //aGame.mShowMoves,
					receiveShadow: true,
					materials: { 
						"square" : {
						},
						"ring" : {
							//shininess : 0,
							//reflectivity: 0,
							color : color, //type=="cancel"?0xff4400:0x000000,
							opacity: (showTarget)?1:0,
							transparent: !showTarget,
						}
					},					
				}
			});
			if(piece)
				xdv.updateGadget("piece#"+pieceIndex1,{
					"base": {
						visible: true,
						click : function() {
							SendEvent();
						}
					},
					"2d": {
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
			for( var i=0; i<$this.pieces.length; i++) {
				var piece=$this.pieces[i];
				xdv.updateGadget("piece#"+i, {
					"base" : {
						click : null,
					},
				});				
			}
		}
		function Select(args) {
			var matchingMoves=[];
			for(var i=0;i<moves.length;i++) {
				var m=moves[i];
				var keep=true;
				for(var j=0;j<move.p.length;j++) {
					if(m.p[j]!=move.p[j]) {
						keep=false;
						break;
					}
				}
				if(keep)
					matchingMoves.push(m);
			}
			if(matchingMoves.length==1 && move.p.length==matchingMoves[0].p.length) {
				htsm.smQueueEvent("E_DONE",{move:matchingMoves[0]});
				return;
			}
			if(move.p.length>1){
				Highlight(move.p[move.p.length-2],null,"cancel");
				Highlight(move.p[move.p.length-1],null,"confirm");
			}
			else if(move.p.length>0)
				Highlight(move.p[move.p.length-1],null,"cancel");				
			
			nextPoss={};
			for(var i=0;i<matchingMoves.length;i++) {
				var m=matchingMoves[i];
				nextPoss[m.p[move.p.length]]=move.p.length<1?null:(m.c!==undefined?m.c[move.p.length-1]:null);
			}
			for(var pos in nextPoss)
				if(nextPoss.hasOwnProperty(pos))
					Highlight(pos,nextPoss[pos],"normal");				
			
		}
		function Animate(args) {
			if(move.p.length<=1)
				htsm.smQueueEvent("E_ANIM_DONE",{});
			else {
				var angle=$this.HuntAngle(aGame,move.p[move.p.length-2],move.p[move.p.length-1]);
				$this.HuntAnimatePiece(xdv,aGame,pieceIndex,move.p[move.p.length-2],move.p[move.p.length-1],angle,killPieceIndex,function() {
					htsm.smQueueEvent("E_ANIM_DONE",{});					
				});
			}
		}
		function SaveSegment(args) {
			if(pieceIndex<0)
				pieceIndex=$this.board[args.pos].i;
			xdv.saveGadgetProps("piece#"+pieceIndex,["x","y","z","rotate","opacity"],"piece-"+move.p.length);
			move.p.push(args.pos);
			if(args.capt!==null) {
				if(move.c===undefined)
					move.c=[];
				killPieceIndex=$this.board[args.capt].i;
				xdv.saveGadgetProps("piece#"+killPieceIndex,["z"],"alive");
				move.c.push(args.capt);
			}
		}
		function SendMove(args) {
			aGame.MakeMove(move);
		}
		function CancelLastClick(args) {
			move.p.splice(move.p.length-1);
			xdv.restoreGadgetProps("piece#"+pieceIndex,"piece-"+move.p.length);
			if(move.p.length==0)
				pieceIndex=-1;
			if(move.c!==undefined) {
				if(killPieceIndex>=0)
					xdv.restoreGadgetProps("piece#"+killPieceIndex,"alive");
				move.c.splice(move.c.length-1);
				if(move.c.length==0) {
					killPieceIndex=-1;
					delete move.c;
				} else
					killPieceIndex=$this.board[move.c[move.c.length-1]].i;
			}
		}
		function AnimateVanish(args) {
			$this.HuntAnimateVanish(xdv,aGame,move.c,function() {
				htsm.smQueueEvent("E_ANIM_DONE",{});					
			});
		}

		htsm.smTransition("S_INIT", "E_INIT", "S_SELECT", [ Init ]);
		htsm.smEntering("S_SELECT", [ Select ]);
		htsm.smTransition("S_SELECT", "E_CONFIRM","S_ANIMATING_VANISH", [ AnimateVanish ]);
		htsm.smTransition("S_SELECT", "E_ENTER","S_ANIMATING", [ Animate ]);
		htsm.smTransition("S_SELECT", "E_CLICKED","S_ANIMATING", [ SaveSegment,Animate ]);
		htsm.smTransition("S_SELECT", "E_CANCEL",null, [ Clean,CancelLastClick,Select ]);
		htsm.smTransition("S_SELECT", "E_DONE", "S_ANIMATING_VANISH", [ AnimateVanish ]);
		htsm.smLeaving("S_SELECT", [ Clean ]);
		htsm.smTransition("S_ANIMATING","E_ANIM_DONE","S_SELECT",[]);
		htsm.smTransition("S_ANIMATING_VANISH","E_ANIM_DONE",null,[SendMove]);
		htsm.smTransition(["S_SELECT","S_ANIMATING","S_ANIMATING_VANISH"],"E_END","S_DONE",[]);
		htsm.smEntering("S_DONE",[Clean]);
	}
	
	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		var $this=this;
		var pieceIndex0=aGame.mOldBoard.board[aMove.p[0]].i;
		if(aMove.p.length==0)
			this.HuntAnimateDrop(xdv,aGame,pieceIndex0,aMove.p[0],function() {
				aGame.mOldBoard.HuntAnimateVanish(xdv,aGame,aMove.c,function() {
					aGame.MoveShown();					
				});
			});
		else {
			var index=0;
			function AnimateSegment() {
				if(++index==aMove.p.length)
					aGame.mOldBoard.HuntAnimateVanish(xdv,aGame,aMove.c,function() {
						aGame.MoveShown();					
					});
				else {
					var angle=$this.HuntAngle(aGame,aMove.p[index-1],aMove.p[index]);
					var killPieceIndex=-1;
					if(aMove.c!==undefined && aMove.c.length>index-1)
						killPieceIndex=aGame.mOldBoard.board[aMove.c[index-1]].i;
					$this.HuntAnimatePiece(xdv,aGame,pieceIndex0,aMove.p[index-1],aMove.p[index],angle,killPieceIndex,AnimateSegment);
				}
			}
			AnimateSegment();
		}
		return false;
	}
	
	View.Board.HuntAnimatePiece=function(xdv,aGame,pieceIndex,from,to,angle,killPieceIndex,fnt) {
		var coord=aGame.getCCoord(to);

		var seqIndex=0;
		var hunter= aGame.g.catcher!=this.mWho; 
		var huntGameData=aGame.g.huntGameData;

		var sequence=huntGameData.sequences[hunter?"hunter":"prey"][((!hunter)&&(killPieceIndex>=0))?"jump":"walk"];
		var endMorph=hunter?huntGameData.hunterMorph:huntGameData.preyMorph;
		var nbSteps=sequence.length;
		
		var z0=hunter?aGame.g.huntGameData.hunterZ0:aGame.g.huntGameData.preyZ0;
		var z1=z0;
		var jump=(killPieceIndex>=0);
		if(!hunter) {
			if(jump)
				z1+=SSIZE*huntGameData.jumpEatScale;
			else
				if (huntGameData.preyJumpsAtWalk)
					z1+=SSIZE*huntGameData.jumpMoveScale;
		}
		var z2=z0;
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
		
		var coord0=aGame.getCCoord(from);
		var morphTime=550/nbSteps;
		function Move() {
			var morphStep=sequence[seqIndex++];
			if(seqIndex<=nbSteps) {
				xdv.updateGadget("piece#"+pieceIndex, {
					"base": {
						x : coord0[0]+(coord[0]-coord0[0])*(seqIndex/sequence.length),
						y : coord0[1]+(coord[1]-coord0[1])*(seqIndex/sequence.length),
					},
					"3d":{
						positionEasing: (typeof(TWEEN)=="undefined")?null:TWEEN.Easing.Linear.EaseNone,
						morphingEasing: (typeof(TWEEN)=="undefined")?null:TWEEN.Easing.Linear.EaseNone,
						morphing: morphStep,
						positionEasingUpdate: function(ratio) {
							var ratio0=(seqIndex-1)/nbSteps+ratio*1/nbSteps;
							var y=(a*ratio0*ratio0+b*ratio0+c)*this.SCALE3D;
							this.object3d.position.y=y;
						},
					}
				},morphTime,Move);
			} else {
				if (jump) aGame.PlaySound(huntGameData.soundEndJump);
				xdv.updateGadget("piece#"+pieceIndex, {
					"base": {
						x: coord[0],
						y: coord[1],
					},
					"3d":{
						morphing: endMorph,
						z: z2,
					}
				},morphTime,fnt);
			}
		}
		
		xdv.updateGadget("piece#"+pieceIndex, {
			"3d":{
				rotate: angle,
			}
		},250,function() {
			if(killPieceIndex>=0) {
				xdv.updateGadget("piece#"+killPieceIndex, {
					"3d":{
						"z": huntGameData.killPieceZTempo*SSIZE,
						positionEasingUpdate: null,
					}
				},400);
			}
			if (!jump) aGame.PlaySound(huntGameData.soundMove);
			Move();
		});
				

	}

	View.Board.HuntAnimateDrop=function(xdv,aGame,pieceIndex,to,fnt) {
		var coord=aGame.getCCoord(to);

		xdv.updateGadget("piece#"+pieceIndex, {
			"base": {
				x: coord[0],
				y: coord[1],
			},
		},500,fnt);
	}

	View.Board.HuntAnimateVanish=function(xdv,aGame,capts0,fnt) {
		if(capts0===undefined || capts0.length==0)
			fnt();
		else {
			var animCount=0;
			var capts={};
			for(var i=0;i<capts0.length;i++)
				capts[capts0[i]]=true;
			function AnimEnd() {
				if(--animCount==0)
					fnt();
			}
			for(var pos in capts) 
				if(capts.hasOwnProperty(pos)) {
					animCount++;
					xdv.updateGadget("piece#"+this.board[pos].i,{
						"base": {
							opacity: 0,
						},
						"3d": {
							z: aGame.g.huntGameData.killPieceZFinal*SSIZE,
						}
					},500,AnimEnd);
				}
		}
	}

})();

