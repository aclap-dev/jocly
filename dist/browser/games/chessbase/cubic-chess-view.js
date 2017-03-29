exports.view = View = {
    Game: {},
    Board: {},
    Move: {}
};


// base chess view

(function() {

	var cbVar, cbView, currentGame;
	
	View.Game.cbTargetMesh = "/res/ring-target.js";
	View.Game.cbTargetSelectColor = 0xffffff;
	View.Game.cbTargetCancelColor = 0xff8800;

	View.Game.cbPromoSize = 2000;
	
	View.Game.xdInit = function(xdv) {

		this.g.fullPath=this.mViewOptions.fullPath;
		this.cbPieceByType={};
		cbVar=this.cbVar;
		cbView=this.cbDefineView();
		this.cbView=cbView;
		this.cbClearPieces();
		this.cbCreateLights(xdv);
		this.cbCreateScreens(xdv);
		this.cbCreateBoard(xdv);
		this.cbCreatePromo(xdv);
		this.cbCreatePieces(xdv);
		this.cbCreateCells(xdv);
	}	
	
	// useful to initialize pieces and board while the real meshes aren't loaded yet
	View.Game.cbMakeDummyMesh = function(xdv) {
		if(typeof THREE != "undefined")
		    return new THREE.Mesh( new THREE.CubeGeometry( .0001, .0001, .0001 ), 
					      new THREE.MeshLambertMaterial() );
		else
			return null;
	}
	
	View.Game.cbCurrentGame = function() {
		return currentGame;
	}
	
	View.Game.cbCreatePieces = function(xdv) {

		var dummyMesh=this.cbMakeDummyMesh(xdv);

		for(var index=0;index<this.cbPiecesCount;index++) {
			xdv.createGadget("piece#"+index,{
				base: {
				},
				"2d": {
					type: "sprite",
				},
				"3d":{
					type:"custommesh3d",
					create: function(force,options,delay){
					    return dummyMesh;
					},
				},				
			});
		}
	}

	View.Game.cbCreateBoard = function(xdv) {
		//console.warn("View.Game.cbCreateBoard must be overriden");
		var dummyMesh=this.cbMakeDummyMesh(xdv);

		xdv.createGadget("board",{
			base: {
			},
			"2d": {
				type: "canvas",
				width: 12000,
				height: 12000,
				draw: function(ctx) {
					console.warn("board draw must be overridden");
				},
			},
			"3d":{
				type:"custommesh3d",
				receiveShadow:true,
				create: function(force,options,delay){
				    return dummyMesh;
				},
			},				
		});		
	}

	View.Game.cbCreateCells = function(xdv) {
		var $this=this;
		for(var pos=0;pos<this.g.boardSize;pos++) 
			(function(pos) {
				xdv.createGadget("cell#"+pos,{
					"2d": {
						z: 101,
						type: "element",
						initialClasses: $this.cbCellClass(xdv,pos),
						width: 1300,
						height: 1300,
					},					
				});
				xdv.createGadget("clicker#"+pos,$.extend(true,{
					"2d": {
						z: 103,
						type: "element",
						initialClasses: "cb-clicker",
					},
					"3d": {
						type: "meshfile",
						file : $this.g.fullPath+$this.cbTargetMesh,
						flatShading: true,
						castShadow: true,
						smooth : 0,
						scale:[.9,.9,.9],
						materials: { 
							"square" : {
								transparent: true,
								opacity: 0,
							},
							"ring" : {
								color : $this.cbTargetSelectColor,
								opacity: 1,
							}
						},
					}
				},$this.cbView.clicker));
			})(pos);
	}
	
	View.Game.cbCreatePromo = function(xdv) {
		xdv.createGadget("promo-board",{
			base: {
				type: "element",
				x: 0,
				y: 0,
				width: 2000,
				height: 2000,
				z: 108,
				css: {
					"background-color": "White",
				},
			},
		});
		xdv.createGadget("promo-cancel",{
			base: {
				type: "image",
				file: this.g.fullPath+"/res/images/cancel.png",
				x: 0,
				y: 0,
				width: 800,
				height: 800,
				z: 109,
			},
		});
		for(var i=0;i<this.g.pTypes.length;i++) {
			xdv.createGadget("promo#"+i,{
				base: {
					y: 0,
					z: 109,
					type: "sprite",
					clipwidth: 100,
					clipheight: 100,
					width: 1200,
					height: 1200,
				},
			});
		}
	}
	
	View.Game.xdBuildScene = function(xdv){

		currentGame=this;
		cbVar=this.cbVar;
		cbView=this.cbDefineView();
		this.cbView=cbView;

		for(var i=0;i<this.cbExtraLights.length;i++) {
			xdv.updateGadget("extralights#"+i,{
				"3d":{
					visible:true,
				}
			});
		}
		
		xdv.updateGadget("board",$.extend({
			base: {
				visible: true,
			},
		},this.cbView.board));
		for(var pos=0;pos<this.g.boardSize;pos++) {
			(function(pos) {
				var displaySpec=currentGame.cbMakeDisplaySpec(pos,0);
				var cellSpec=$.extend(true,{},displaySpec,{
					"base": {
						visible: true,
					},
				},currentGame.cbView.clicker,currentGame.cbView.cell);
				xdv.updateGadget("cell#"+pos,cellSpec);
				$.extend(true,displaySpec,currentGame.cbView.clicker);
				xdv.updateGadget("clicker#"+pos,displaySpec);
			})(pos);
		}
		
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
		
		xdv.updateGadget("promo-board",{
			base: {
				visible: false,
			},
		});
		xdv.updateGadget("promo-cancel",{
			base: {
				visible: false,
			},
		});
		for(var i=0;i<this.g.pTypes.length;i++) {
			xdv.updateGadget("promo#"+i,{
				base: {
					visible: false,
				},
			});
		};
	}
	
	View.Game.cbDisplayBoardFn = function(spec) {
		
		var $this=this;
		
		return function(force,options,delay) {

			var key = spec.style+"_"+spec.margins.x+"_"+spec.margins.y+"_"+$this.mNotation+"_"+$this.mViewAs;
			
			var avat=this;
			if(key!=this._cbKey){
				this._cbKey=key;
				spec.display.call(currentGame,spec,avat,function(mesh) {
					avat.replaceMesh(mesh,options,delay);
				});
			}
		}
	}

	View.Game.cbDrawBoardFn = function(spec) {
		return function(ctx) {
			spec.draw.call(currentGame,spec,this,ctx);
		}
	}
	
	View.Game.cbMakeDisplaySpec = function(pos,side) {
		var displaySpec={};		
		for(var c in this.cbView.coords) {
			var coordsFn=this.cbView.coords[c];
			var coord=coordsFn.call(this,pos);
			displaySpec[c]={
				x: coord.x || 0,
				y: coord.y || 0,
				z: coord.z || 0,
				rotateX: coord.rx || 0,
				rotateY: (coord.ry || 0) * (c=="3d"?(this.mViewAs*side<0?-1:1):0), // TODO handle better side orientation
				rotate: (coord.rz || 0) + (c=="3d"?(this.mViewAs*side<0?180:0):0), // TODO handle better side orientation
				/*
				rotateY: coord.ry || 0,
				rotate: (coord.rz || 0) + (c=="3d"?(this.mViewAs*side>0?0:180):0), // TODO handle better side orientation
				*/
			}
		}
		return displaySpec;
	}
	
	View.Game.cbMakeDisplaySpecForPiece = function(aGame,pos,piece) {
		var displaySpec=this.cbMakeDisplaySpec(pos,piece.s);		
		if(cbVar.pieceTypes[piece.t]===undefined) {
			console.warn("Piece type",piece.t,"not defined in model");
			return;
		}
		var aspect=cbVar.pieceTypes[piece.t].aspect || cbVar.pieceTypes[piece.t].name;
		if(!aspect) {
			console.warn("Piece type",piece.t,"has no aspect defined");
			return;				
		}
		function BuildSpec(spec,specs,aspect) {
			if(specs)
				return $.extend(true,spec,specs['default'],specs[aspect]);
			return {};
		}
//		displaySpec=BuildSpec(displaySpec,aGame.cbPieces,aspect);
//		if(aGame.cbPieces[piece.s])
//			displaySpec=BuildSpec(displaySpec,aGame.cbPieces[piece.s],aspect);
		if(cbView.pieces) {
			displaySpec=BuildSpec(displaySpec,cbView.pieces,aspect);
			if(cbView.pieces[piece.s])
				displaySpec=BuildSpec(displaySpec,cbView.pieces[piece.s],aspect);
		}
		return displaySpec;
	}
	
	View.Board.xdDisplay = function(xdv, aGame) {
		var $this=this;
		for(var index=0;index<this.pieces.length;index++) {
			var piece=this.pieces[index];
			if(piece.p<0)
				xdv.updateGadget("piece#"+index,{
					base: {
						visible: false,
					}
				});
			else {
				var displaySpec=aGame.cbMakeDisplaySpecForPiece(aGame,piece.p,piece);
				displaySpec=$.extend(true,{
					base: {
						visible: true,
					},
					"2d": {
						opacity: 1,
					},
					"3d": {
						positionEasingUpdate: null,												
					},
				},displaySpec);
				
				//console.warn("display",displaySpec);
					
				xdv.updateGadget("piece#"+index,displaySpec);
			}
		}
		for(;index<aGame.cbPiecesCount;index++)
			xdv.updateGadget("piece#"+index,{
				base: {
					visible: false,
				}
			});
	}
	
	View.Game.cbExtraLights = [{
		color: 0xffffff,
		intensity: 0.8,
		position: [9, 14, -9],
		props: {
			shadowCameraNear: 10,
			shadowCameraFar: 25,
			castShadow: true,
			//shadowDarkness: .25,
			shadowMapWidth: 2048,
			shadowMapHeight: 2048,
		},
	}]; 

	View.Game.cbCreateLights = function(xdv) {
		var $this = this;
		// lights
		for(var i=0;i<this.cbExtraLights.length;i++) {
			(function(light,index) {
				xdv.createGadget("extralights#"+index,{
					"3d": {
						type: "custommesh3d",
						create: function(callback){
							// spot lighting
							var spotLight1 = new THREE.SpotLight( light.color, light.intensity );
							//for(var prop in light.props)
								//spotLight1[prop] = light.props[prop];
							
							spotLight1.shadow.camera.far = light.props.shadowCameraFar;
							spotLight1.shadow.camera.near = light.props.shadowCameraNear;
							spotLight1.shadow.mapSize.width = light.props.shadowMapWidth;
							spotLight1.shadow.mapSize.height = light.props.shadowMapHeight;

							spotLight1.position.set.apply(spotLight1.position,light.position);	
							var mesh=new THREE.Mesh();
							mesh.add(spotLight1);
							var target = new THREE.Object3D();
							mesh.add(target);
							spotLight1.target = target;

							callback(mesh);
						},
					}
				});
				
			})(this.cbExtraLights[i],i);
		}
	}
	
	// 'this' is not a Game but an Avatar object
	View.Game.cbCreateScreen = function(videoTexture) {
		// flat screens
		var gg=new THREE.PlaneGeometry(4,3,1,1);
		var gm=new THREE.MeshPhongMaterial({color:0xffffff,map:videoTexture,shading:THREE.FlatShading,emissive:{r:1,g:1,b:1}});
		var mesh = new THREE.Mesh( gg , gm );
		this.objectReady(mesh); 
		return null;
	}
	
	View.Game.cbCreateScreens = function(xdv) {
		var $this=this;
		xdv.createGadget("videoa",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return $this.cbCreateScreen.call(this,videoTexture);
				},
			},
		});
		xdv.createGadget("videoabis",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return $this.cbCreateScreen.call(this,videoTexture);
				},
			},
		});
		xdv.createGadget("videob",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return $this.cbCreateScreen.call(this,videoTexture);
				},
			},
		});	
		xdv.createGadget("videobbis",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return $this.cbCreateScreen.call(this,videoTexture);
				},
			},
		});
	}
	
	View.Board.xdInput = function(xdv, aGame) {
		
		function HidePromo() {
			xdv.updateGadget("promo-board",{
				base: {
					visible: false,
				}
			});
			xdv.updateGadget("promo-cancel",{
				base: {
					visible: false,
				}
			});		
		}
		
		return {
			initial: {
				f: null,
				t: null,
				pr: null,
			},
			getActions: function(moves,currentInput) {
				var actions={};
				if(currentInput.f==null) {
					moves.forEach(function(move) {
						if(actions[move.f]===undefined)
							actions[move.f]={
								f: move.f,
								moves: [],
								click: ["piece#"+this.board[move.f],"clicker#"+move.f],
								view: ["clicker#"+move.f],
								highlight: function(mode) {
									xdv.updateGadget("cell#"+move.f,{
										"2d": {
											classes: mode=="select"?"cb-cell-select":"cb-cell-cancel",					
											opacity: aGame.mShowMoves || mode=="cancel"?1:0,
										}
									});									
									xdv.updateGadget("clicker#"+move.f,{
										"3d": {
											materials: {
												ring: {
													color: mode=="select"?aGame.cbTargetSelectColor:aGame.cbTargetCancelColor,
													opacity: aGame.mShowMoves || mode=="cancel"?1:0,
													transparent: aGame.mShowMoves || mode=="cancel"?false:true,
												},
											},
											castShadow: aGame.mShowMoves || mode=="cancel",
										},
									});									
								},
								unhighlight: function() {
									xdv.updateGadget("cell#"+move.f,{
										"2d": {
											classes: "",							
										}
									});									
								},
								validate: {
									f: move.f,
								},
							}
						actions[move.f].moves.push(move);
					},this);
				} else if(currentInput.t==null) {
					moves.forEach(function(move) {
						var target = move.cg===undefined?move.t:move.cg;
						if(actions[target]===undefined) {
							actions[target]={
								t: move.t,
								moves: [],
								click: ["piece#"+this.board[target],"clicker#"+target],
								view: ["clicker#"+target],
								highlight: function(mode) {
									xdv.updateGadget("cell#"+target,{
										"2d": {
											classes: mode=="select"?"cb-cell-select":"cb-cell-cancel",					
											opacity: aGame.mShowMoves || mode=="cancel"?1:0,
										},
									});									
									xdv.updateGadget("clicker#"+target,{
										"3d": {
											materials: {
												ring: {
													color: mode=="select"?aGame.cbTargetSelectColor:aGame.cbTargetCancelColor,
													opacity: aGame.mShowMoves || mode=="cancel"?1:0,
													transparent: aGame.mShowMoves || mode=="cancel"?false:true,
												},
											},
											castShadow: aGame.mShowMoves || mode=="cancel",
										},
									});									
								},
								unhighlight: function(mode) {
									xdv.updateGadget("cell#"+target,{
										"2d": {
											classes: "",							
										}
									});									
								},
								validate: {
									t: move.t,
								},
								execute: function(callback) {
									var $this=this;
									this.cbAnimate(xdv,aGame,move,function() {
										var promoMoves=actions[move.t].moves;
										if(promoMoves.length>1) {
											xdv.updateGadget("promo-board",{
												base: {
													visible: true,
													width: aGame.cbPromoSize*(promoMoves.length+1),
												}
											});
											xdv.updateGadget("promo-cancel",{
												base: {
													visible: true,
													x: promoMoves.length*aGame.cbPromoSize/2,
												}
											});
											promoMoves.forEach(function(move,index) {
												var aspect=cbVar.pieceTypes[move.pr].aspect || cbVar.pieceTypes[move.pr].name;
												var aspectSpec = $.extend(true,{},aGame.cbView.pieces["default"],aGame.cbView.pieces[aspect]);
												if(aGame.cbView.pieces[this.mWho])
													aspectSpec = $.extend(true,aspectSpec,
															aGame.cbView.pieces[this.mWho]["default"],aGame.cbView.pieces[this.mWho][aspect]);
												xdv.updateGadget("promo#"+move.pr, {
													base: $.extend(aspectSpec["2d"], { 
														x: (index-promoMoves.length/2)*aGame.cbPromoSize 
													}),														
												});												
											},$this);
										}
										callback();
									});
								},
								unexecute: function() {
									if(move.c!=null) {
										var piece1=this.pieces[move.c];
										var displaySpec1=aGame.cbMakeDisplaySpecForPiece(aGame,piece1.p,piece1);
										displaySpec1=$.extend(true,{
											base: {
												visible: true,
											},
											"2d": {
												opacity: 1,
											},
											"3d": {
												positionEasingUpdate: null,												
											},
										},displaySpec1);
										xdv.updateGadget("piece#"+move.c,displaySpec1);
									}
									var piece=this.pieces[this.board[move.f]];
									var displaySpec=aGame.cbMakeDisplaySpecForPiece(aGame,piece.p,piece);
									xdv.updateGadget("piece#"+piece.i,displaySpec);
									HidePromo();
								},
							}
						}
						if(move.cg!==undefined) {
							actions[target].validate.cg=move.cg;
							actions[target].execute=function(callback) {
								this.cbAnimate(xdv,aGame,move,function() {
									callback();
								});
							};
						}
						actions[target].moves.push(move);
					},this);
				} else if(currentInput.pr==null) {
					var promos=[];
					moves.forEach(function(move) {
						if(move.pr!==undefined) {
							if(actions[move.pr]===undefined) {
								actions[move.pr]={
									pr: move.pr,
									moves: [],
									click: ["promo#"+move.pr],
									//view: ["promo#"+move.pr],
									validate: {
										pr: move.pr,
									},
									cancel: ["promo-cancel"],
									post: HidePromo,
									skipable: true,
								}
								promos.push(move.pr);
							}
							actions[move.pr].moves.push(move);
						}
					},this);
					if(promos.length>1) // avoid loading the avatar if forced promotion (only 1 choice)
						promos.forEach(function(pr) {
							actions[pr].view=["promo#"+pr];
						});
				}
				return actions;
			},
		}
	}

	View.Game.cbCellClass = function(xdv, pos) {
		var cellClass;
		if((pos+(pos-pos%this.g.NBCOLS)/this.g.ROWS)%2)
			cellClass="classic-cell-black";
		else
			cellClass="classic-cell-white";
		return "classic-cell "+cellClass;
	}	
		
	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		aGame.mOldBoard.cbAnimate(xdv,aGame,aMove,function() {
			aGame.MoveShown();
		});
	}

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

		var displaySpec0=aGame.cbMakeDisplaySpec(aMove.f,piece.s);
		var displaySpec=aGame.cbMakeDisplaySpecForPiece(aGame,aMove.t,piece);
		for(var skin in displaySpec0) {
			var spec=displaySpec0[skin];
			if(spec.z===undefined)
				continue;
			(function(skin) {
				var z0=spec.z;
				var z2=displaySpec[skin].z;
				var z1=$this.cbMoveMidZ(aGame,aMove,z0,z2,skin);
				var c=z0;
				var S1=c-z1;
				var S2=c-z2;
				
				if(z1!=(z0+z2)/2)
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
				displaySpec[skin].positionEasingUpdate = function(ratio) {
					var y=(a*ratio*ratio+b*ratio+c)*this.SCALE3D;
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

	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		return (zFrom+zTo)/2;
	}

	
})();


// base board management


(function() {

	
	View.Game.cbBaseBoard = {

		TEXTURE_CANVAS_CX: 1024,
		TEXTURE_CANVAS_CY: 1024,	

		// 'this' is a Game object
		display: function(spec, avatar, callback) {
			var $this=this;
			spec.getResource=avatar.getResource;
			spec.createGeometry.call(this,spec,function(geometry) {
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
						var mesh=new THREE.Mesh(geometry,material);
						spec.modifyMesh.call($this,spec,mesh,function(mesh) {
							spec.paint.call($this,spec,canvas,images,function() {
								callback(mesh);
							});
						});
					});					
				});
			});
		},
		
		createTextureImages: function(spec,callback) {
			var $this=this;
			var images={};
			var nbRes=0;
			var texturesImg=spec.texturesImg || {};
			for(var ti in texturesImg)
				nbRes++;
			if(nbRes==0)
				callback(images);
			else
				for(var ti in texturesImg)
					(function(ti) {
						spec.getResource("image|"+$this.g.fullPath+texturesImg[ti],function(img){
							images[ti]=img;
							if(--nbRes==0)
								callback(images);
						});
					})(ti);

		},
		
		createMaterial: function(spec,canvas,callback) {
			var texBoardDiffuse = new THREE.Texture(canvas.diffuse);
			texBoardDiffuse.needsUpdate = true;
			var matSpec={
				specular: '#050505',//'#222222',
				//emissive: '#333333',
				shininess: 30, //50,
				map: texBoardDiffuse,
			}
			if(canvas.bump) {
				var texBoardBump = new THREE.Texture(canvas.bump);
				texBoardBump.needsUpdate = true;
				matSpec.bumpMap = texBoardBump;
				matSpec.bumpScale = 0.05;//0.1;
			}
			var material=new THREE.MeshPhongMaterial(matSpec);
			callback(material);
		},

		modifyMesh: function(spec,mesh,callback) {
			callback(mesh);
		},

		prePaint: function(spec,mesh,canvas,images,callback) {
			callback();
		},

		paint: function(spec,mesh,canvas,images,callback) {
			callback();
		},

		postPaint: function(spec,mesh,canvas,images,callback) {
			callback();
		},

		paintChannel: function(spec,ctx,images,channel) {
			
		},
		
		draw: function(spec,avatar,ctx) {
			var $this=this;
			spec.getResource=avatar.getResource;
			//ctx.save();
			spec.createTextureImages.call(this,spec,function(images) {
				spec.paintChannel.call($this,spec,ctx,images,"diffuse");
				//ctx.restore();
			});
		},
		
	}

	
})();

// base piece management

(function() {

	var pieces = {}, getResource;

	function Hash(obj) {
		var str=JSON.stringify(obj);
		var h=0;
		for(var i=0;i<str.length;i++) {
			h=(h<<5)-h+str.charCodeAt(i);
			h&=h;
		}
		return h;
	}
	
	View.Game.cbDisplayPieceFn = function(styleSpec) {
		
		var $this=this;
		var styleSign=Hash(styleSpec);

		return function(force,options,delay){
			getResource = this.getResource;	
			var m=/^piece#([0-9]+)$/.exec(this.gadget.id);
			if(!m)
				return null;
			var index=parseInt(m[1]);
			var currentGame=$this.cbCurrentGame();
			if(index>=currentGame.mBoard.pieces.length)
				return null;
			var piece=currentGame.mBoard.pieces[index];
			var aspect=currentGame.cbVar.pieceTypes[piece.t].aspect || currentGame.cbVar.pieceTypes[piece.t].name;

			var key=aspect+"_"+styleSign+"_"+piece.s;
			var avat=this;
			if(key!=this._cbKey){
				this._cbKey=key;
				avat.options=options;
				currentGame.cbMakePiece(styleSpec,aspect,piece.s,function(mesh){
					avat.replaceMesh(mesh,avat.options,delay);
				});				
			}
		}
	}
	
	View.Game.cbMakePiece = function(styleSpec,aspect,side,callback) {
		
		if(!styleSpec) {
			console.error("piece-view: style is not defined");
			return;
		}
		
		function BuildSpec(spec,specs,aspect) {
			if(specs)
				return $.extend(true,spec,specs['default'],specs[aspect]);
			return {};
		}
		var aspectSpec=BuildSpec({},styleSpec,aspect);
		if(styleSpec[side])
			aspectSpec=BuildSpec(aspectSpec,styleSpec[side],aspect);
		var aspectKey=Hash(aspectSpec);
		var piece=pieces[aspectKey];
		if(Array.isArray(piece))
			piece.push(callback);
		else if(!piece) {
			pieces[aspectKey] = [ callback ];
			aspectSpec.loadResources.call(this,aspectSpec,function(resources) {
				aspectSpec.displayPiece.call(this,aspectSpec,resources,function() {
					var callbacks = pieces[aspectKey];
					pieces[aspectKey] = {
						geometry: resources.geometry,
						material: resources.material,
					}
					callbacks.forEach(function(callback) {
						callback(new THREE.Mesh(resources.geometry,resources.material));
					});
				});				
			});
		} else 
			callback(new THREE.Mesh(piece.geometry,piece.material));			
	}

	View.Game.cbClearPieces = function() {
		pieces = {};
	}
	
	View.Game.cbBasePieceStyle = {

		"default": {
			mesh: {
				jsFile: function(spec,callback) {
					callback(new THREE.CubeGeometry(1,1,1),new THREE.MeshPhongMaterial({}));
				},
				smooth: 0,
				rotateZ: 0,
			},

			loadMesh: function(spec,callback) {
				if(typeof spec.mesh.jsFile=="function")
					spec.mesh.jsFile(spec,callback);
				else
					getResource("smoothedfilegeo|"+spec.mesh.smooth+"|"+this.g.fullPath+spec.mesh.jsFile,callback);
			},

			loadImages: function(spec,callback) {
				var $this=this;
				var nbRes=1;
				var images={};
				function Loaded() {
					if(--nbRes==0)
						callback(images);
				}
				for(var mat in spec.materials) {
					var channels=spec.materials[mat].channels;
					for(var channel in channels) {
						if(channels[channel].texturesImg)
							for(var img in channels[channel].texturesImg)
								(function(img,url) {
									nbRes++;
									getResource("image|"+$this.g.fullPath+url,function(image) {
										images[img]=image;
										Loaded();
									});
								})(img,channels[channel].texturesImg[img]);
					}
				}
				Loaded();
			},
			
			loadResources: function(spec,callback) {
				var nbRes=2;
				var images, geometry,materials;
				
				function Loaded() {
					if(--nbRes==0)
						callback({
							geometry: geometry,
							images: images,
							textures: {},
							loadedMaterials: materials,
						});
				}
				spec.loadMesh.call(this,spec,function(geo,mats) {
					if(!geo._cbZRotated) {
						var matrix = new THREE.Matrix4();
						matrix.makeRotationY(spec.mesh.rotateZ*Math.PI/180)
						geo.applyMatrix(matrix);
						geo._cbZRotated=true;
					}
					geometry=geo;
					materials=mats;
					//materials=mats;
					Loaded();
				});
				spec.loadImages.call(this,spec,function(imgs) {
					images=imgs;
					Loaded();
				});
			},
						
			displayPiece: function(spec,resources,callback) {
				spec.makeMaterials.call(this,spec,resources);
				callback();
			},
			
			paintTextureImageClip: function(spec,ctx,material,channel,channelData,imgKey,image,clip,resources) {
				var cx=ctx.canvas.width;
				var cy=ctx.canvas.height;
				if(channelData.patternFill && channelData.patternFill[imgKey]) {
					var fillKey=channelData.patternFill[imgKey];	
					ctx.save();
					// use a tmp canvas for painting colored patterns with shape used as mask (alpha channel needed)
					var tmpCanvas = document.createElement('canvas');
					tmpCanvas.width=cx;
					tmpCanvas.height=cy;
					ctxTmp=tmpCanvas.getContext('2d');
			        ctxTmp.fillStyle=fillKey;
			        ctxTmp.fillRect(0,0,cx,cy);
			        ctxTmp.globalCompositeOperation='destination-in';
					ctxTmp.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
					// now paste the result in diffuse canvas
					ctx.drawImage(tmpCanvas,0,0,cx,cy,0,0,cx,cy);
					ctx.restore();
				}
				else
					ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);				
			},
			
			paintTextureImage: function(spec,ctx,material,channel,channelData,imgKey,image,resources) {
				var clip;
				if(channelData.clipping && channelData.clipping[imgKey])
					clip=channelData.clipping[imgKey];
				else
					clip={
						x: 0,
						y: 0,
						cx: image.width,
						cy: image.height
					};
				spec.paintTextureImageClip.call(this,spec,ctx,material,channel,channelData,imgKey,image,clip,resources);
			},
			
			paintTexture: function(spec,ctx,material,channel,resources) {
				//console.log("paintTexture",channel,"for",spec.mesh.jsFile);
				var channelData=spec.materials[material].channels[channel];
				for(var img in channelData.texturesImg) {
					var image=resources.images[img];
					spec.paintTextureImage.call(this,spec,ctx,material,channel,channelData,img,image,resources);
				}
			},
			
			makeMaterialTextures: function(spec,material,resources) {
		    	for (var chan in spec.materials[material].channels) {
		    		var channel = spec.materials[material].channels[chan];
		    		var canvas = document.createElement('canvas');
		    		canvas.width=channel.size.cx;
		    		canvas.height=channel.size.cy;
		    		var ctx = canvas.getContext('2d');
		    		spec.paintTexture.call(this,spec,ctx,material,chan,resources);
		    		var texture =  new THREE.Texture(canvas);
		    		texture.needsUpdate = true;
		    		resources.textures[material][chan]=texture;
	    		}
			},

			makeMaterials: function(spec,resources) {
				resources.textures={};
		    	for (var m in spec.materials) {
		    		resources.textures[m]={}
		    		spec.makeMaterialTextures.call(this,spec,m,resources)
	    			spec.makeMaterial.call(this,spec,m,resources);
		    	}
			},
		}		
	}
	
	View.Game.cbTokenPieceStyle3D = $.extend(true,{},View.Game.cbBasePieceStyle,{

		"default": {

			makeMaterials: function(spec,resources) {
				resources.textures={};
		    	for (var m in spec.materials) {
		    		resources.textures[m]={}
		    		spec.makeMaterialTextures.call(this,spec,m,resources)
		    	}

		    	var pieceMaterials=[];
	    		for (var mat in resources.loadedMaterials){
	    			var newMat=resources.loadedMaterials[mat].clone();	    			
	    			var matName=newMat.name;
	    			if (spec.materials[matName]){
		    			$.extend(true,newMat,spec.materials[matName].params);
						for (var chan in spec.materials[matName].channels) {
							switch (chan){
							case 'diffuse':
								newMat.map = resources.textures[matName][chan];
								break;
							case 'bump':
								newMat.bumpMap = resources.textures[matName][chan];
								break;
							}
						}
	    			}
	    			pieceMaterials.push(newMat);
	    		}
				var pieceMat = new THREE.MultiMaterial( pieceMaterials );
				resources.material=pieceMat;
			},

			
		},
	});

	View.Game.cbUniformPieceStyle3D = $.extend(true,{},View.Game.cbBasePieceStyle,{

		"default": {

			makeMaterial: function(spec,material,resources) {
	    		/*var shader = THREE.ShaderLib[ "normalmap" ];
				var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
	    		var phongParams = spec.materials[material].params;
				for (var chan in spec.materials[material].channels) {
					var chanParams=spec.materials[material].channels[chan];
					switch (chan) {
					case 'diffuse':
						phongParams.map = resources.textures[material][chan];
						break;
					case 'normal':                        
						uniforms[ "tNormal" ].value = resources.textures[material][chan];
						uniforms[ "uNormalScale" ].value.y = chanParams.normalScale || 1;
						phongParams.normalMap = uniforms[ "tNormal" ].value ;
						phongParams.normalScale = uniforms[ "uNormalScale" ].value ;                        
					break;
					default:
					}
				}
				uniforms[ "enableAO" ].value = true;					
				//uniforms[ "tNormal" ].value = texNorm;
				//uniforms[ "uNormalScale" ].value.y = cbPieceType.normalScale;
				if(uniforms[ "uShininess" ] !== undefined)
					uniforms[ "uShininess" ].value = spec.materials[material].params['shininess'] || 100; */

				var phongParams = spec.materials[material].params ;
				phongParams.map = resources.textures[material]['diffuse'] ;
				phongParams.normalMap = resources.textures[material]['normal'] ;
				var ns = spec.materials[material].channels['normal'].normalScale || 1;
				phongParams.normalScale = new THREE.Vector2( ns , ns ) ;

				var pieceMat = new THREE.MeshPhongMaterial( phongParams );
				
				resources.material=pieceMat;
				
				resources.geometry.mergeVertices()
				resources.geometry.computeVertexNormals(); // needed in normals not exported in js file!

			},

			
		}
		
	});
	
	View.Game.cbPhongPieceStyle3D = $.extend(true,{},View.Game.cbBasePieceStyle,{

		"default": {

			phongProperties : {
				color: "#ffffff",
				shininess: 300,
				specular: "#ffffff",
				emissive: "#222222",
				shading: typeof THREE!="undefined"?THREE.FlatShading:0,
			},
			makeMaterials: function(spec,resources) {
				var pieceMat = new THREE.MeshPhongMaterial( spec.phongProperties );
				resources.material=pieceMat;
			},
		}
		
	});
	
})();





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
							material.emissive={r:.5,g:.5,b:.5};
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
				specular: '#111111',
				emissive: '#ffffff',
				shininess: 500,
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
	var lightInt = 1.2;

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

(function() {
	var CANVAS_SIZE = 512;
	var STAUNTON_CANVAS_PROPERTIES = {
			cx: CANVAS_SIZE,
			cy: CANVAS_SIZE
	}
	function THREE_CONST(v) {
		if(typeof THREE!=="undefined")
			return THREE[v];
		else
			return 0;
	}

	View.Game.cbStauntonWoodenPieceStyle = function(modifier) {
		return this.cbStauntonPieceStyle($.extend(true,{
			"default": {
				"2d": {
					file: this.mViewOptions.fullPath + "/res/images/woodenpieces2d2.png",
				},
			},
		},modifier));
	}
	
	View.Game.cbStauntonPieceStyle = function(modifier) {
		return $.extend(true,{
			"1": {
				"default": {
					"2d": {
						clipy: 0,
					},
				},
			},
			"-1": {
				"default": {
					"2d": {
						clipy: 100,
					},
				},
			},
			"default": {
				"3d": {
					display: this.cbDisplayPieceFn(this.cbStauntonPieceStyle3D),
				},
				"2d": {
					file: this.mViewOptions.fullPath + "/res/images/wikipedia.png",
					clipwidth: 100,
					clipheight: 100,
				},
			},
			"pawn": {
				"2d": {
					clipx: 0,
				},
			},
			"knight": {
				"2d": {
					clipx: 100,
				},
			},
			"bishop": {
				"2d": {
					clipx: 200,
				},
			},
			"rook": {
				"2d": {
					clipx: 300,
				},
			},
			"queen": {
				"2d": {
					clipx: 400,
				},
			},
			"king": {
				"2d": {
					clipx: 500,
				},
			},
		},modifier);
	}
	
	View.Game.cbStauntonPieceStyle3D = $.extend(true,{},View.Game.cbUniformPieceStyle3D,{
		
		"default": {
			mesh: {
				normalScale: 1,
				rotateZ: 180,
			},
			//'useUniforms' : true,
			materials:{
				mat0:{						
					channels:{ 
						diffuse:{
							size: STAUNTON_CANVAS_PROPERTIES, 
						},
						normal: { 
							size: STAUNTON_CANVAS_PROPERTIES,
						},
					},
				},
			},	
		},

		"1":{
			'default': {
				materials:{
					mat0:{						
						params : {
							//specular: 0xaaccff,
							specular: 0x020202,
							shininess : 150 , 
							//combine: THREE_CONST('AddOperation'), 
							//shading: THREE_CONST('SmoothShading'),
						},
					},
				},
			}
		},
		"-1":{
			'default': {
				materials:{
					mat0:{						
						params : {
							specular: 0x080808,
							shininess : 100 , 
							//combine: THREE_CONST('AddOperation'), 
							//shading: THREE_CONST('SmoothShading'),
						},
					},
				},
				paintTextureImageClip: function(spec,ctx,material,channel,channelData,imgKey,image,clip,resources) {
					var cx=ctx.canvas.width;
					var cy=ctx.canvas.height;
					if(channel=="diffuse") {
						ctx.globalCompositeOperation = 'normal';
						ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
						ctx.globalCompositeOperation = 'multiply';
						ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
						ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
						ctx.globalCompositeOperation = 'hue';
						ctx.fillStyle='rgba(0,0,0,0.7)';
						ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
					} else
						ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);
				},
			},
		},

		
		pawn: {
			mesh: { 
				jsFile:"/res/staunton/pawn/pawn-classic.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/pawn/pawn-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/pawn/pawn-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		knight: {
			mesh: { 
				jsFile:"/res/staunton/knight/knight.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/knight/knight-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/knight/knight-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		bishop: {
			mesh: { 
				jsFile:"/res/staunton/bishop/bishop.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/bishop/bishop-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/bishop/bishop-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		rook: {
			mesh: { 
				jsFile:"/res/staunton/rook/rook.js" 		
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/rook/rook-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/rook/rook-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		queen: {
			mesh: { 
				jsFile:"/res/staunton/queen/queen.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/queen/queen-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/queen/queen-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
		king: {
			mesh: { 
				jsFile:"/res/staunton/king/king.js" 
			},
			materials: {
				mat0: {
					channels: {
						diffuse: {
							texturesImg: {
								diffImg : "/res/staunton/king/king-diffusemap.jpg",
							}
						},
						normal: {
							texturesImg: {
								normalImg: "/res/staunton/king/king-normalmap.jpg", 
							}
						}
					}
				}
			},
		},
		
	});
	
})();

(function() {
	
	View.Game.cbDefineView = function() {
		
		var board3d = $.extend(true,{},this.cbCubicBoardClassic,{
			notationDebug: true,
		});

		var board2d = $.extend(true,{},this.cbCubicBoardClassic2D,{
			notationDebug: true,
		});

		
		return {
			coords: {
				"2d": this.cbCubicBoard.coordsFn.call(this,board2d),
				"3d": this.cbCubicBoard.coordsFn.call(this,board3d),
			},
			boardLayout: [[
				"#.#.",
			    ".#.#",
				"#.#.",
			    ".#.#",
	     	],[
				"#.#.",
			    ".#.#",
				"#.#.",
			    ".#.#",
	     	],[
				"#.#.",
			    ".#.#",
				"#.#.",
			    ".#.#",
	     	],[
				"#.#.",
			    ".#.#",
				"#.#.",
			    ".#.#",
	     	],[
				"#.#.",
			    ".#.#",
				"#.#.",
			    ".#.#",
	     	],[
			    ".#.#",
				"#.#.",
			    ".#.#",
				"#.#.",
	     	]],
			
			/*
			boardLayout: [[
		     		"#.#.",
		      		".#.#",
		      		"#.#.",
		     		".#.#",
		     		"#.#.",
		     	],[
		     	   "#.#.#",
		     	   ".#.#.",
		     	   "#.#.#",
		     	],[
		     	   ".#.#",
		     	   "#.#.",
		     	   ".#.#",
		     	],[
		     	   "#.#.",
		     	   ".#.#",
		     	   "#.#.",
		     	],[
		     	   ".#.#.",
		     	   "#.#.#",
		     	   ".#.#.",
		     	],[
		     		".#.#",
		     		"#.#.",
		      		".#.#",
		     		"#.#.",
		      		".#.#",
		     	]],
			*/
		     board: {
				"2d": {
					draw: this.cbDrawBoardFn(board2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(board3d),					
				},
			},
			clicker: {
				"2d": {
					width: 800,
					height: 800,
				},
				"3d": {
					scale: [1.2,1.2,1.2],
				},
			},
			pieces: this.cbStauntonPieceStyle({
				"default": {
					"2d": {
						width: 700,
						height: 700,						
					},
					"3d": {
						//scale: [.8,.8,.8],
						scale: [.7,.7,.7],
					},
				},
			}),
			captureAnim3d: "scaledown",
			fences: {
				"35": "#000000",
				"25": "#000000",
			}
		};
	}

})();

//# sourceMappingURL=cubic-chess-view.js.map
