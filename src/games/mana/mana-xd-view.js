/*
 *
 * Copyright (c) 2013 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

(function() {
	
	var VSIZE=1500;
	
	View.Game.xdInit = function(xdv) {


		var fullPath=this.mViewOptions.fullPath ;
		var options=this.mOptions;
		
		xdv.createGadget("lightside", {
			"3d": {
				type: "custom3d",
				create: function() {
					var backlight = new THREE.SpotLight( 0xbbbbbb, .6, 0, 1.05, 1, 2 );
					backlight.shadow.camera.near=10;
					backlight.shadow.camera.far=40;
					backlight.castShadow = true;
					backlight.shadow.mapSize.width = 2048;
					backlight.shadow.mapSize.height = 2048;
					return backlight;
				},
				z: 15000,
				x: 15000,
			}
		});
		
		
		xdv.createGadget("board", {
			"2d": {
				type : "image",
				file : this.mViewOptions.fullPath + "/res/images/boardexp.png",
				rotate : 45,
				width: VSIZE*this.mOptions.width/.75,
				height: VSIZE*this.mOptions.height/.75,
			},
			"orange3d" : {
				type : "custommesh3d",
				rotate : 45,	
				z:0,
				create: function() {
					var $this=this;
					var gg=new THREE.CylinderGeometry(500,500,1, 64, 1, false);		
					var gm=new THREE.MeshPhongMaterial( { color: 0xDAA037, specular: 0x111111, shininess: 1 } );
					//var gm=new THREE.MeshPhongMaterial( { color: 0xff0000 } );
					var board = new THREE.Mesh( gg , gm );
					this.getResource("smoothedfilegeo|"+0+"|"+fullPath+"/res/xd-view/meshes/strokeblack.js",function(geometry , materials) {
						var gm=new THREE.MeshPhongMaterial( { color: 0x111111, specular: 0x000000, shininess: 100 } );
						var VSIZE=1.5; // local redefinition
						for (var r = 0 ; r < options.height ; r++){
							for (var c = 0 ; c < options.width ; c++){
								var y=-(options.width*VSIZE)/2+c*VSIZE+VSIZE/2;
								var x=(options.height*VSIZE)/2-r*VSIZE-VSIZE/2;
								var nb=options.initial[r][c];
								var strokeInterval=0;

								switch(nb){
									default:
									break;
									case "2":
									strokeInterval=VSIZE/4;
									break;
									case "3":
									strokeInterval=VSIZE/6;
									break;
								}
	
								var delta=(nb-1)*strokeInterval/2;
								for (var s=0 ; s < options.initial[r][c] ; s++){
									for (var i=0 ; i < 2 ; i++){
										var obj = new THREE.Mesh( geometry , gm );
										obj.position.y=0.5;
										obj.position.x=(i>0)?x:x-delta+s*strokeInterval;
										obj.position.z=(i<1)?y:y-delta+s*strokeInterval;
										obj.rotation.y=Math.ceil(Math.random()*2)*Math.PI + i*Math.PI/2;
										obj.scale.set(0.3,0.5,0.5);
										//obj.castShadow=true;
										//obj.receiveShadow=true;
										board.add(obj);
									}
								}
							}
						}
						board.receiveShadow=true;
						$this.objectReady(board);
					});
					return null;
				}
			},
		});
		
		var manaCreateScreen = function(videoTexture) {
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
					return manaCreateScreen.call(this,videoTexture);
				},
			},
		});
		xdv.createGadget("videoabis",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return manaCreateScreen.call(this,videoTexture);
				},
			},
		});
		xdv.createGadget("videob",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return manaCreateScreen.call(this,videoTexture);
				},
			},
		});	
		xdv.createGadget("videobbis",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return manaCreateScreen.call(this,videoTexture);
				},
			},
		});
		
		var orients=[{
			text: "NW",
			classic2d: {
				x: -VSIZE*2.5,
				y: -VSIZE*2.5,
			},
			orange3d:{
				x: -VSIZE*2.5,
				y: -VSIZE*2.5,
				rotate: -45,
				color:0x000000,
			},
		},{
			text: "NE",
			classic2d:{
				x: VSIZE*2.5,
				y: -VSIZE*2.5,
			},
			orange3d:{
				x: VSIZE*2.5,
				y: -VSIZE*2.5,		
				rotate: 225,	
				color:0x000000,
			},
		},{
			text: "SW",
			classic2d:{
				x: -VSIZE*2.5,
				y: VSIZE*2.5,
			},
			orange3d:{
				x: -VSIZE*2.5,
				y: VSIZE*2.5,			
				rotate: 45,
				color:0x000000,
			},
		},{
			text: "SE",
			classic2d:{
				x: VSIZE*2.5,
				y: VSIZE*2.5,
			},
			orange3d: {
				x: VSIZE*2.5,
				y: VSIZE*2.5,
				rotate: 135,
				color:0x000000,
			},	
		}];
		var fullPath=this.mViewOptions.fullPath;
		for(var i in orients) {
			var orient=orients[i];
			(function(orient) {
				xdv.createGadget("orient#"+orient.text,{
					"2d": {
						type : "element",
						width : VSIZE*.9,
						height : VSIZE*.9,
						css : {
							color : "Black",
							"text-align" : "center",
						},
						initialClasses: "mana-select mana-select-view",
						x : orient.classic2d.x,
						y : orient.classic2d.y,
						z : 4,
						display : function(element, width, height) {
							element.css({
								"font-size" : (height * .3) + "pt",
								"line-height" : (height * 1) + "px",
							}).text(orient.text);
						},
					},
					"orange3d" : {
						type: "meshfile",
						file: fullPath + "/res/xd-view/meshes/select-smoothed.js",
						scale: [1,1,1],
						smooth: 0,
						x : orient.orange3d.x,
						y : orient.orange3d.y,
						rotate: orient.orange3d.rotate-90,
						materials: { 
							"square" : {
								transparent: true,
								opacity: 0,
							},
							"mat.arrow" : {
								color : orient.orange3d.color,
								shininess : 255,
							}, 
							"ring" : {
								shininess:10,
								emissive:{r:.6,g:.6,b:.6},
							}
							
						}, 
					}
				});
			})(orient);
		}

		for(var pos=0;pos<this.g.Graph.length;pos++)
			(function(pos) {
				xdv.createGadget("text#"+pos,{
					"2d": {
						type : "element",
						width : VSIZE*.20,
						height : VSIZE*.20,
						initialClasses: "mana-text",
						z : 4,
						display : function(element, width, height) {
							element.css({
								"font-size" : (height * .5) + "pt",
								"line-height" : (height * 1) + "px",
							}).text(pos);
						},
					},
					"orange3d": {
						type: "custommesh3d",
						//z: -SIZE*.05,
						rotateX: -90,
						create: function() {
                            var $this = this;
                            this.getResource('font|'+fullPath+
                                '/res/xd-view/fonts/helvetiker_regular.typeface.json',
                                function(font) {
                                var gg=new THREE.TextGeometry(""+pos,{
                                    size: 0.2,
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
					},
				});				
				xdv.createGadget("cell#"+pos,{
					"2d": {
						type : "element",
						width : VSIZE*1.05,
						height : VSIZE*1.05,
						initialClasses: "mana-select",
						z : 5,
					},
					"orange3d": {
						type: "meshfile",
						file : fullPath+"/res/xd-view/meshes/select-smoothed.js",
						scale: [.9,.9,.9],
						smooth : 0,
						z : 0,		
						castShadow: false,
						materials: { 
							"square" : {
								transparent: true,
								opacity: 0,
							},
							"mat.arrow" : {
								transparent: true,
								opacity: 0,
							}, 
							"ring" : {
								shininess:10,
								emissive:{r:.6,g:.6,b:.6},
							}
						},	
					},
				});				
			})(pos);
		
		function createPawn(avatar,callback,type,who){
			var url="smoothedfilegeo|"+0+"|"+fullPath+"/res/xd-view/meshes/mana-piece-smoothed2.js";
			avatar.getResource(url,function(geometry , materials){
			 	var materials0=[];
				for(var m=0;m<materials.length;m++){
					var mat=materials[m].clone();
					mat.specular={r:.1,g:.1,b:.1};
					//mat.ambient={r:.1,g:.1,b:.1};
					mat.shininess=10;
					if (who==-1){						
						mat.color={r:.5,g:.2,b:0};
						if ((mat.name=="blackstripe")&&(type=="damyo")){
							mat.color={r:1,g:.8,b:.8};												
						}
					}
					else{
						mat.color={r:1,g:1,b:1};						
						if ((mat.name=="blackstripe")&&(type=="damyo")){
							mat.color={r:0,g:0,b:0};												
						}
					}
					materials0.push(mat);
				}
				
				var pawn = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials0));
				pawn.castShadow=true;
				callback(pawn);
			});
		}
		
		var pieceClipW=150;
		for(var who=1;who>=-1;who-=2) {
			for(var i=0;i<this.mOptions.damyoCount;i++)
				(function(who,i){
					xdv.createGadget("damyo#"+who+"#"+i,{
						"2d": {
							type: "sprite",
							file : fullPath + "/res/images/manapieces.png",
							clipx : pieceClipW,
							clipy : who==1?0:pieceClipW,
							clipwidth : pieceClipW,
							clipheight : pieceClipW,
							width : VSIZE/.75,
							height : VSIZE/.75,
							x: VSIZE,
							z : 7,
						},
						"orange3d":{
							type:  "custommesh3d",
							create: function(callback){
								createPawn(this,callback,"damyo",who);
							},
							rotate: who==1?90:-90,
							scale: [0.3,0.3,0.3],					
						},
					});
				})(who,i);
			for(var i=0;i<this.mOptions.roninCount;i++)
				(function(who,i){
					xdv.createGadget("ronin#"+who+"#"+i,{
						"2d": {
							type: "sprite",
							file : fullPath + "/res/images/manapieces.png",
							clipx : 0,
							clipy : who==1?0:pieceClipW,
							clipwidth : pieceClipW,
							clipheight : pieceClipW,
							width : VSIZE*1.1,
							height : VSIZE*1.1,
							x: VSIZE*i,
							z : 7,
						},
						"orange3d":{
							type:  "custommesh3d",
							create: function(callback){
								createPawn(this,callback,"ronin",who);
							},
							rotate: who==1?90:-90,
							scale: [0.3,0.3,0.3],		
						},
					});
				})(who,i);
		}
		xdv.createGadget("cancel",{
			"2d": {
				type : "element",
				initialClasses: "mana-cancel",
				y: VSIZE*this.mOptions.height/(this.mOptions.height+2)*(this.mOptions.height/2+.5),
				z : 4,
			},
			"orange3d": {
				type: "meshfile",
				file: this.mViewOptions.fullPath + "/res/xd-view/meshes/select-ring-undo.js",
				smooth: 0,
				scale: [1,1,1],
				materials:{
					"ring" : {
						shininess:10,
						emissive:{r:.6,g:.6,b:.6},
					}					
				}
			}
		});
		xdv.createGadget("mana",{
			"2d": {
				type: "sprite",
				file : this.mViewOptions.fullPath + "/res/images/manapieces.png",
				clipx : 2*pieceClipW,
				clipy : 0,
				clipwidth : pieceClipW,
				clipheight : pieceClipW,
				width : VSIZE*.9,
				height : VSIZE*.9,
				z : 8,
			},
			"orange3d": {
				type: "meshfile",
				file: this.mViewOptions.fullPath + "/res/xd-view/meshes/mana.js",
				//smooth: 2,
				scale: [1,1,1],
				materials:{
					"manamat":{
						shininess:500,
						specular:{r:.3,g:.3,b:.3},
						//emissive:{r:.2,g:.2,b:.2},
						diffuse:{r:.6,g:0,b:0},
						color:0xff0000,						
					}
				}
			}
		});
	}
	
	View.Game.xdBuildScene = function(xdv) {
		var $this=this;
		

		xdv.updateGadget("lightside",{
			"3d": {
				visible: true,
			},
		});
		
		xdv.updateGadget("board",{
			"2d": {
				visible: true,
			},
			"orange3d": {
				visible: true,
				receiveShadow: true,
				z:-500,
			},
		});
		xdv.updateGadget("cancel",{
			"2d": {
				width : VSIZE*.85,
				height : VSIZE*.85,
			},
		});
		
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

		
		for(var who=1;who>=-1;who-=2) {
			for(var i=0;i<$this.mOptions.damyoCount;i++) {
				var pieceId="damyo#"+who+"#"+i;
				xdv.updateGadget(pieceId,{
					"orange3d": {
						rotate: ($this.mViewAs==JocGame.PLAYER_B?180:0) + (who==1?90:-90),
					},
				});
			}
			for(var i=0;i<$this.mOptions.roninCount;i++) {
				var pieceId="ronin#"+who+"#"+i;
				xdv.updateGadget(pieceId,{
					"orange3d": {
						rotate: ($this.mViewAs==JocGame.PLAYER_B?180:0) + (who==1?90:-90),
					},
				});
			}
		}
	}
	
	View.Board.getRCCoord = function(aGame,pos,orient) {
		var r=Math.floor(pos/aGame.mOptions.width);
		var c=pos%aGame.mOptions.width;
		if(arguments.length<3)
			orient=this.orient;
		if(orient=="NE" || orient=="SW") {
			var t=r;
			r=c;
			c=t;
		}
		if(orient=="NE" || orient=="NW")
			c=aGame.mOptions.width-1-c;
		if(orient=="NE" || orient=="SE")
			r=aGame.mOptions.height-1-r;
		return [r,c];
	}

	View.Board.getVCoord = function(aGame,pos,orient) {
		if(aGame.mViewAs==JocGame.PLAYER_B)
			pos=aGame.g.Graph.length-1-pos;
		var rcCoord=this.getRCCoord(aGame,pos,orient);
		var r=rcCoord[0];
		var c=rcCoord[1];
		return [VSIZE*(-aGame.mOptions.height/2+r+.5),VSIZE*(-aGame.mOptions.width/2+c+.5)];
	}
	
	View.Board.pieceOutPosition = function(aGame,piece) {
		var damyoCount=aGame.mOptions.damyoCount;
		var piecesCount=aGame.mOptions.roninCount+damyoCount;
		var slot=12000/piecesCount;
		var y = VSIZE*3.8;
		if(piece.t=="d")
			x=((piece.i-piecesCount/2)+.5)*slot;
		else
			x=((damyoCount+piece.i-piecesCount/2)+.5)*slot;
		if(aGame.mViewAs!=piece.s) {
			y=-y;
			x=-x;
		}
		return [x,y]
	}

	View.Board.manaUpdateCells = function(xdv, aGame, orient) {
		for(var pos=0;pos<aGame.g.Graph.length;pos++) {
			var coord=this.getVCoord(aGame,pos,orient);
			xdv.updateGadget("text#"+pos,{
				base: { 
					visible: aGame.mNotation && this.stage!=1,
					x: coord[0],
					y: coord[1],
				},
			});
			xdv.updateGadget("cell#"+pos,{
				base: {
					x: coord[0],
					y: coord[1],
				},
			});
		}
	}

	View.Board.xdDisplay = function(xdv, aGame) {
		this.manaUpdateCells(xdv,aGame,this.orient);
		if(this.stage==1)
			xdv.updateGadget("board",{
				"2d": {
					rotate : 45,
					width: VSIZE*aGame.mOptions.width*.7,
					height: VSIZE*aGame.mOptions.height*.7,
				},
				"orange3d":{
					rotate: 45,
				}
			});
		else {
			var angle=aGame.g.Orients[this.orient].angle;
			xdv.updateGadget("board",{
				"2d": {
					rotate: aGame.mViewAs==JocGame.PLAYER_B?angle+180:angle,
					width: VSIZE*aGame.mOptions.width/0.75,
					height: VSIZE*aGame.mOptions.height/0.75,
				},
				"orange3d": {
					rotate: aGame.mViewAs==JocGame.PLAYER_B?-angle+180+90:-angle+90,
				},
			});
		}
		if(this.mana<0){
			xdv.updateGadget("mana",{
				base: {
					visible: false,
					x: -7000,
					y: 0,
				},
				"orange3d":{
					// z: 1200,
					scale: [0.3,0.3,0.3],
				},
			});
		}
		else {
			var pieceType="r";
			if (this.board[this.mana]>=0){
				pieceType=this.pieces[this.board[this.mana]].t;
			}
			var coord=this.getVCoord(aGame,this.mana,this.orient);
			xdv.updateGadget("mana",{
				base: {
					visible: true,
					x: coord[0],
					y: coord[1],
					scale:[0.3,0.3,0.3],//pieceType=="r"?[0.3,0.3,0.3]:[0.4,0.4,0.4],
				},
			});
		}
		function HidePieces(side) {
			for(var i=0;i<aGame.mOptions.damyoCount;i++) {
				var pieceId="damyo#"+side+"#"+i;
				xdv.updateGadget(pieceId,{
					base: {
						visible: false,
					},
				});
			}
			for(var i=0;i<aGame.mOptions.roninCount;i++) {
				var pieceId="ronin#"+side+"#"+i;
				xdv.updateGadget(pieceId,{
					base: {
						visible: false,
					},
				});
			}
		}
		if(this.stage==1) {
			HidePieces(JocGame.PLAYER_A);
			HidePieces(JocGame.PLAYER_B);
		} else 	if(this.stage<=2)
			HidePieces(JocGame.PLAYER_B);
		for(var i=0;i<this.pieces.length;i++) {
			var piece=this.pieces[i];
			var pieceId=(piece.t=="d"?"damyo":"ronin")+"#"+piece.s+"#"+piece.i;
			if(piece.p<0) {
				if(this.stage<3)
					xdv.updateGadget(pieceId,{
						base: {
							visible: false,
							x: 0,
							y: 0,
						},
						"2d":{
						},
						"orange3d": {
						}
					});
				else {
					var coord=this.pieceOutPosition(aGame,piece);
					xdv.updateGadget(pieceId,{
						base: {
							visible: true,
							x: coord[0],
							y: coord[1],
						},
						"2d": {
						},
						"orange3d": {
						}
					});
				}
			} else {
				var coord=this.getVCoord(aGame,piece.p,this.orient);
				xdv.updateGadget(pieceId,{
					base: {
						visible: true,
						x: coord[0],
						y: coord[1],
					},
					"2d": {
						z: 7,
					},
					"orange3d": {
					}
				});				
			}
		}
	}
		
	function MoveSound(aGame, type){
		switch(type){
			default:
				aGame.PlaySound('zip'+Math.floor(Math.random()*4));
				break;
			case 'mana':
				aGame.PlaySound('wind');
				break;
		}
	}	

	View.Board.xdBuildHTStateMachine = function(xdv, htsm, aGame) {
		var $this = this;
		var orients=["NW","NE","SW","SE"];
		var orient;
		var damyo=[];
		var ronin=[];
		var movables;
		var moveStart,moveEnd;
		var move;
		
		function HighLight(pos,type) {
			var pieceIndex=$this.board[pos];
			var piece=null;
			var pieceId=null;
			if(pieceIndex>=0) {
				piece=$this.pieces[pieceIndex];
				pieceId=(piece.t=="r"?"ronin":"damyo")+"#"+piece.s+"#"+piece.i;
			}
			xdv.updateGadget("cell#"+pos,{
				base: {
					visible: true,
					click: function() {
						htsm.smQueueEvent("E_CLICK",{pos:pos,type:type});
					},
				},
				"2d":{
					classes: (type=="cancel"?"mana-cancel mana-select-view":"")+(aGame.mShowMoves?" mana-select-view":""),
				},
			});
			if(pieceId)
				xdv.updateGadget(pieceId,{
					base: {
						click: function() {
							htsm.smQueueEvent("E_CLICK",{pos:pos,type:type});
						}
					},
				});
			if(pos==$this.mana)
				xdv.updateGadget("mana",{
					base: {
						click: function() {
							htsm.smQueueEvent("E_CLICK",{pos:pos,type:type});
						}
					},
				});
		}
		function Init(args) {
		}
		function Clean(args) {
			for(var pos=0;pos<aGame.g.Graph.length;pos++)
				xdv.updateGadget("cell#"+pos,{
					base: {
						visible: false,
						click: null,
					},
				});
			for(var s=-1;s<=1;s+=2) {
				for(var i=0;i<aGame.mOptions.damyoCount;i++)
					xdv.updateGadget("damyo#"+s+"#"+i,{
						base: {
							click: null,
						},
					});
				for(var i=0;i<aGame.mOptions.roninCount;i++)
					xdv.updateGadget("ronin#"+s+"#"+i,{
						base: {
							click: null,
						},
					});
			}
			xdv.updateGadget("cancel",{
				base: {
					visible: false,
					click: null,
				},
			});
			xdv.updateGadget("mana",{
				base: {
					click: null,
				},
			});
		}
		function Stage(args) {
			if($this.stage<=2)
				htsm.smQueueEvent("E_STAGE"+$this.stage,{});
			else {
				var pieces=$this.manaMovablePieces(aGame);
				htsm.smQueueEvent("E_MOVE",{movables:pieces});
			}
		}
		function Orient(args) {
			for(var pos=0;pos<aGame.g.Graph.length;pos++)
				xdv.updateGadget("text#"+pos,{
					base: { visible: false },
				});
			xdv.updateGadget("board",{
				"2d": {
					width: VSIZE*aGame.mOptions.width*.7,
					height: VSIZE*aGame.mOptions.height*.7,
					rotate: 45,
				},
				"orange3d":{
					rotate: 45,
				}
			});
			for(var i in orients) {
				(function(orient) {
					xdv.updateGadget("orient#"+orient,{
						base: {
							visible: true,
							click: function() {
								htsm.smQueueEvent("E_ORIENT",{orient:orient});
							},
						},
					});
				})(orients[i]);
			}
		}
		function ExitOrient(args) {
			for(var i in orients) {
				(function(orient) {
					xdv.updateGadget("orient#"+orient,{
						base: {
							visible: false,
							click: null,
						},
					});
				})(orients[i]);
			}
		}
		function Pivot(args) {
			aGame.PlaySound("chains");
			xdv.updateGadget("board",{
				"orange3d": {
					rotate: -aGame.g.Orients[args.orient].angle+90,
				},
				"2d":{
					rotate: aGame.g.Orients[args.orient].angle,
					width: VSIZE*aGame.mOptions.width/.75,
					height: VSIZE*aGame.mOptions.height/.75,
				}
			},1000,function() {
				htsm.smQueueEvent("E_ORIENT_DONE",{orient:args.orient});
			});
		}
		function UpdateCells(args) {
			$this.manaUpdateCells(xdv,aGame,args.orient);
		}
		function HighlightCancel(args) {
			xdv.updateGadget("cancel",{
				base: {
					visible: true,
					click: function() {
						htsm.smQueueEvent("E_CANCEL",{});
					},
				},
			});			
		}
		function UnHighlightCancel(args) {
			xdv.updateGadget("cancel",{
				base: {
					visible: false,
					click: null,
				},
			});	
		}
		function ShowPlacingPieces(args) {
		
			aGame.PlaySound("sabers");

			for(var i=0;i<aGame.mOptions.damyoCount;i++) {
				var pieceId="damyo#"+$this.mWho+"#"+i;
				var coord=$this.pieceOutPosition(aGame,{
					t: "d",
					s: $this.mWho,
					i: i,
				});
				xdv.updateGadget(pieceId,{
					base: {
						visible: true,
						x: coord[0],
						y: coord[1],
					},
				});				
			}
			for(var i=0;i<aGame.mOptions.roninCount;i++) {
				var pieceId="ronin#"+$this.mWho+"#"+i;
				var coord=$this.pieceOutPosition(aGame,{
					t: "r",
					s: $this.mWho,
					i: i,
				});
				xdv.updateGadget(pieceId,{
					base: {
						visible: true,
						x: coord[0],
						y: coord[1],
					},
				});				
			}
		}
		function PlacePiece(args) {
			var piece=null;
			var pieceType;
			var pieceIndex;
			if(damyo.length<aGame.mOptions.damyoCount) {
				piece="damyo#"+$this.mWho+"#"+damyo.length;
				pieceType='d';
				pieceIndex=damyo.length;
			} else if(ronin.length<aGame.mOptions.roninCount) {
				piece="ronin#"+$this.mWho+"#"+ronin.length;
				pieceType="r";
				pieceIndex=ronin.length;
			} else {
				htsm.smQueueEvent("E_ALL_PLACED",{});
				return;
			}
			var cancelCoord=$this.pieceOutPosition(aGame,{
				t: pieceType,
				s: $this.mWho,
				i: pieceIndex,
			});
			xdv.updateGadget("cancel",{
				base: {
					visible: true,
					x: cancelCoord[0],
					y: cancelCoord[1],
				},
				"2d":{
					width : VSIZE*.85,
					height : VSIZE*.85,
				}
			});
			xdv.updateGadget(piece,{
				base: {
					click: function() {
						htsm.smQueueEvent("E_CANCEL",{});
					},
				},
			}); 
			var poss=[];
			for(var pos=0;pos<aGame.g.Graph.length;pos++) {
				var rc=$this.getRCCoord(aGame,pos,orient?orient:$this.orient);
				var coord=$this.getVCoord(aGame,pos,orient?orient:$this.orient);
				if(($this.mWho==-1 && rc[1]<=1) || ($this.mWho==1 && rc[1]>=aGame.mOptions.width-2)) {
					var taken=false;
					for(var i=0;i<damyo.length;i++)
						if(damyo[i]==pos)
							taken=true;
					for(var i=0;i<ronin.length;i++)
						if(ronin[i]==pos)
							taken=true;
					if(!taken)
						(function(pos) {
							xdv.updateGadget("cell#"+pos,{
								base: {
									visible: true,
									x: coord[0],
									y: coord[1],
									click: function() {
										htsm.smQueueEvent("E_PLACE",{
											pos: pos,
											pieceId: piece,
											pieceType: pieceType,
										});
									},
								},
								"2d": {
									classes: (aGame.mShowMoves?"mana-select-view":""),
								}
							});
						})(pos);
				}
			}
		}
		function SaveOrient(args) {
			orient=args.orient;
		}
		function MovePlacePiece(args) {
			MoveSound(aGame);
			var coord=$this.getVCoord(aGame,args.pos,orient?orient:$this.orient);
			xdv.updateGadget(args.pieceId,{
				base: {
					x: coord[0],
					y: coord[1],
				},
			},400,function() {
				htsm.smQueueEvent("E_PLACED",args);
			});
		}
		function SavePlace(args) {
			if(args.pieceType=="d")
				damyo.push(args.pos);
			if(args.pieceType=="r")
				ronin.push(args.pos);
		}
		function SendPlaceMove(args) {
			var move={
				p: {
					d: damyo,
					r: ronin,
				},
			};
			if($this.mWho==1)
				move.o=orient;
			aGame.MakeMove(move);
		}
		function HidePieces(args) {
			for(var i=0;i<aGame.mOptions.damyoCount;i++)
				xdv.updateGadget("damyo#"+$this.mWho+"#"+i,{
					base: {
						visible: false,
						x: 0,
						y: 0,
					},
				});
			for(var i=0;i<aGame.mOptions.roninCount;i++)
				xdv.updateGadget("ronin#"+$this.mWho+"#"+i,{
					base: {
						visible: false,
						x: 0,
						y: 0,
					},
				});
		}
		function ClearPieces(args) {
			damyo=[];
			ronin=[];
		}
		function SelectStart(args) {
			var validMoves=[];
			var mana=-1;
			if($this.mana>=0)
				mana=aGame.g.CValue[$this.mana];
			for(var i in movables) {
				var piece=$this.pieces[i];
				if(mana<0 || aGame.g.CValue[piece.p]==mana) {
					validMoves.push({
						type: 'move',
						pieceIndex: i,
						movable: movables[i],
					});
				}
			}
			if(validMoves.length==0) {
				for(var i in movables) {
					validMoves.push({
						type: 'move',
						pieceIndex: i,
						movable: movables[i],						
					});
				}
				if($this.roninOut[$this.mWho]>0)
					for(var pos=0;pos<aGame.g.Graph.length;pos++) {
						if($this.board[pos]<0 && (aGame.mOptions.insertAnywhere || aGame.g.CValue[pos]==mana))
							validMoves.push({
								type: 'insert',
								pos: pos,
							});
					}
			}
			for(var i=0;i<validMoves.length;i++) {
				var move=validMoves[i];
				switch(move.type) {
				case "insert":
					HighLight(move.pos,"insert");
					break;
				case "move":
					HighLight($this.pieces[move.pieceIndex].p,"move");
					break;
				}
			}
		}
		function SaveMovables(args) {
			movables=args.movables;
		}
		function ClickStart(args) {
			if($this.board[args.pos]<0)
				htsm.smQueueEvent("E_CELL_CLICK",{pos:args.pos});
			else
				htsm.smQueueEvent("E_PIECE_CLICK",{pieceIndex:$this.board[args.pos]});
		}
		function SelectEnd(args) {
			var movable=movables[args.pieceIndex];
			for(var pos in movable)
				HighLight(pos,"dest");
			xdv.updateGadget("cancel",{
				"2d": {
					width : VSIZE*1.05,
					height : VSIZE*1.05,
				},
			});
			HighLight(moveStart,"cancel");
		}
		function ClickEnd(args) {
			if(args.type=="cancel")
				htsm.smQueueEvent("E_CANCEL",{});
			else
				htsm.smQueueEvent("E_MOVE_COMPLETE",{pos:args.pos});
		}
		function SaveMove(args) {
			move={
				m:[moveStart,moveEnd],
			};
		}
		function SaveMoveEnd(args) {
			moveEnd=args.pos;
		}
		function SaveMoveStart(args) {
			moveStart=args.pos;
		}
		function AnimateMove(args) {
			var duration=400;
			var pieceIndex=$this.board[moveStart];
			var piece=$this.pieces[pieceIndex];
			var pieceId=(piece.t=="d"?"damyo":"ronin")+"#"+$this.mWho+"#"+piece.i;
			var animPath=movables[pieceIndex][moveEnd];
			var animIndex=1;
			function AnimateSegment() {
				MoveSound(aGame);
				var coord=$this.getVCoord(aGame,animPath[animIndex],$this.orient);
				xdv.updateGadget(pieceId,{
					base: {
						x: coord[0],
						y: coord[1],
					},
					"2d":{
						z: 8,
					},
					"orange3d":{
						//z: ?,
					},
				},duration,function() {
					animIndex++;
					if(animIndex==animPath.length)
						htsm.smQueueEvent("E_ANIM_DONE",{});
					else
						AnimateSegment();
				});
			}
			AnimateSegment();
		}
		function AnimateInsert(args) {
			var piece;
			for(var i=0;i<$this.pieces.length;i++) {
				piece=$this.pieces[i];
				if(piece.t=="r" && piece.s==$this.mWho && piece.p<0)
					break;
			}
			var pieceId="ronin#"+piece.s+"#"+piece.i;
			xdv.updateGadget(pieceId,{
				base: {
					visible: true,
				},
			});
			var coord=$this.getVCoord(aGame,moveStart,$this.orient);
			MoveSound(aGame);
			xdv.updateGadget(pieceId,{
				base: {
					visible: true,
					x: coord[0],
					y: coord[1],
				},
			},400,function() {
				htsm.smQueueEvent("E_ANIM_DONE",{});				
			});
		}
		function SaveInsert(args) {
			move={
				i:moveStart,
			};
		}
		function SendMove(args) {
			aGame.MakeMove(move);
		}
		function AnimateMana() {
			
			MoveSound(aGame,'mana');
			
			var mana=move.m?move.m[1]:move.i;
			if(mana==$this.mana) {
				htsm.smQueueEvent("E_ANIM_DONE",{});				
				return;
			}
			if($this.mana<0)
				xdv.updateGadget("mana",{
					"2d": {
						x: -VSIZE*aGame.mOptions.width/(aGame.mOptions.width+2)*(aGame.mOptions.width/2+.5),
						y: 0,
						visible: true,
					},
					"orange3d":{
						visible: true,
					}
				});
			var coord=$this.getVCoord(aGame,mana,$this.orient)
			xdv.updateGadget("mana",{
				base: {
					visible: true,
				},
				"3d":{
					z: 1000,
				}
			},200,function(){
				xdv.updateGadget("mana",{
					base: {
						x: coord[0],
						y: coord[1],
					},
				},400,function() {
					xdv.updateGadget("mana",{
						"3d": {
							z: 0,
						},
					},200,function(){
						htsm.smQueueEvent("E_ANIM_DONE",{});				
					});
				});
			});
			

		}
		function AnimateCapture() {
			var pieceIndex=$this.board[moveEnd];
			if(pieceIndex<0)
				htsm.smQueueEvent("E_ANIM_DONE",{});
			else {
				var piece=$this.pieces[pieceIndex];
				var coord=$this.pieceOutPosition(aGame,piece);
				
				if (piece.t=="d"){
					aGame.PlaySound('deathdamyo');
				}else{
					aGame.PlaySound('sabers');
					aGame.PlaySound('death'+Math.ceil(Math.random()*3));
				}
				
				xdv.updateGadget((piece.t=="d"?"damyo#":"ronin#")+piece.s+"#"+piece.i,{
					base: {
						x: coord[0],
						y: coord[1],
						visible: true,
					},
				},400,function() {
					htsm.smQueueEvent("E_ANIM_DONE",{});				
				});
			}
		}
		
		htsm.smTransition("S_INIT","E_INIT","S_READY",[Init]);
		htsm.smEntering("S_READY",[Stage]);
		htsm.smTransition("S_READY","E_STAGE1","S_STAGE1",[]);
		htsm.smEntering("S_STAGE1",[HidePieces,Orient]);
		htsm.smTransition("S_STAGE1","E_ORIENT","S_ORIENTING",[Pivot]);
		htsm.smLeaving("S_STAGE1",[Clean,ExitOrient]);
		htsm.smTransition("S_ORIENTING","E_ORIENT_DONE","S_PLACING",[SaveOrient,UpdateCells,ShowPlacingPieces]);
		
		htsm.smTransition("S_READY","E_STAGE2","S_PLACING",[UpdateCells,ShowPlacingPieces]);
		
		htsm.smTransition("S_READY","E_STAGE3","S_PLACING",[UpdateCells,HidePieces]);

		htsm.smTransition("S_READY","E_MOVE","S_SELECT",[SaveMovables]);

		htsm.smEntering("S_SELECT",[SelectStart]);
		htsm.smLeaving("S_SELECT",[Clean]);
		htsm.smTransition("S_SELECT","E_CLICK",null,[SaveMoveStart,ClickStart]);
		htsm.smTransition("S_SELECT","E_PIECE_CLICK","S_SELECT2",[]);

		htsm.smTransition("S_SELECT","E_CELL_CLICK","S_ANIM_INSERT",[SaveMoveStart,AnimateInsert]);
		htsm.smTransition("S_ANIM_INSERT","E_ANIM_DONE","S_ANIM_MANA",[SaveInsert]);

		htsm.smEntering("S_SELECT2",[SelectEnd]);
		htsm.smTransition("S_SELECT2","E_CLICK",null,[ClickEnd]);
		htsm.smTransition("S_SELECT2","E_CANCEL","S_SELECT",[]);
		htsm.smTransition("S_SELECT2","E_MOVE_COMPLETE","S_ANIM_MOVE",[SaveMoveEnd,AnimateMove]);
		htsm.smLeaving("S_SELECT2",[Clean]);
		
		htsm.smTransition("S_ANIM_MOVE","E_ANIM_DONE","S_ANIM_CAPT",[SaveMove]);
		
		htsm.smTransition("S_PLACING","E_CANCEL","S_READY",[ClearPieces]);
		htsm.smTransition("S_PLACING","E_ALL_PLACED",null,[SendPlaceMove]);
		htsm.smEntering("S_PLACING",[HighlightCancel,PlacePiece]);
		htsm.smLeaving("S_PLACING",[UnHighlightCancel,Clean]);
		htsm.smTransition("S_PLACING","E_PLACE","S_ANIM_PLACE",[SavePlace,MovePlacePiece]);
		htsm.smEntering("S_ANIM_PLACE",[]);
		htsm.smTransition("S_ANIM_PLACE","E_PLACED","S_PLACING",[]);
		
		htsm.smEntering("S_ANIM_MANA",[AnimateMana]);
		htsm.smTransition("S_ANIM_MANA","E_ANIM_DONE",null,[SendMove]);

		htsm.smEntering("S_ANIM_CAPT",[AnimateCapture]);
		htsm.smTransition("S_ANIM_CAPT","E_ANIM_DONE","S_ANIM_MANA",[]);

		
		htsm.smTransition(["S_READY","S_STAGE1","S_ORIENTING","S_PLACING","S_ANIM_PLACE","S_SELECT","S_SELECT2","S_ANIM_MOVE","S_ANIM_INSERT","S_ANIM_MANA"],"E_END","S_END",[]);
		htsm.smEntering("S_END",[Clean]);
	}
	
	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		var $this=this;
		function PlacePieces() {
			var pieces=[];
			var piecesIndex=0;
			for(var i=0;i<aMove.p.d.length;i++) {
				pieces.push({
					pieceId: "damyo#"+$this.mWho+"#"+i,
					pos: aMove.p.d[i],
					t: "d",
					i: i,
					s: $this.mWho,
				});
			}
			for(var i=0;i<aMove.p.r.length;i++) {
				pieces.push({
					pieceId: "ronin#"+$this.mWho+"#"+i,
					pos: aMove.p.r[i],
					t: "d",
					i: i,
					s: $this.mWho,
				});
			}
			for(var i=0;i<pieces.length;i++) {
				var coord=$this.pieceOutPosition(aGame,pieces[i]);
				xdv.updateGadget(pieces[i].pieceId,{
					base: {
						visible: true,
						x: coord[0],
						y: coord[1],
					},
				});
			}
			function Animate() {
				MoveSound(aGame);
				var piece=pieces[piecesIndex];
				var coord=$this.getVCoord(aGame,piece.pos,$this.orient);
				xdv.updateGadget(piece.pieceId,{
					base: {
						x: coord[0],
						y: coord[1],
					},
				},300,function() {
					piecesIndex++;
					if(piecesIndex==pieces.length)
						aGame.MoveShown();
					else
						Animate();
				});
			}
			Animate();
		}
		function AnimateMana() {
			if(aGame.mOldBoard.mana==$this.mana) {
				aGame.MoveShown();
				return;
			}
			if(aGame.mOldBoard.mana<0){
				xdv.updateGadget("mana",{
					base: {
						x: -7000,
						y: 0,
						visible: true,
					},
				});
			}
			
			var coord=$this.getVCoord(aGame,$this.mana,$this.orient)
			xdv.updateGadget("mana",{
				base: {
					visible: true,
				},
				"3d":{
					z: 1000,
				}
			},200,function(){
				MoveSound(aGame,'mana');
				xdv.updateGadget("mana",{
					base: {
						x: coord[0],
						y: coord[1],
					},
				},400,function() {
					xdv.updateGadget("mana",{
						"3d": {
							z: 0,
						},
					},200,function(){
						aGame.MoveShown();				
					});
				});
			});
		}
		function AnimateCapture(piece) {
			if (piece.t=="d"){
				aGame.PlaySound('deathdamyo');
			}else{
				aGame.PlaySound('sabers');
				aGame.PlaySound('death'+Math.ceil(Math.random()*3));
			}
			var coord=$this.pieceOutPosition(aGame,piece);
			xdv.updateGadget((piece.t=="d"?"damyo#":"ronin#")+piece.s+"#"+piece.i,{
				base: {
					x: coord[0],
					y: coord[1],
					visible: true,
				},
			},400,function() {
				AnimateMana();
			});
		}
		if(aMove.o)
			xdv.updateGadget("board",{
				"2d": {
					rotate: aGame.g.Orients[aMove.o].angle,
					width: VSIZE*aGame.mOptions.width/.75,
					height: VSIZE*aGame.mOptions.height/.75,
				},
				"orange3d": {
					rotate: -aGame.g.Orients[aMove.o].angle+90,
				},
			},1000,function() {
				PlacePieces();
			});
		else if(aMove.p)
			PlacePieces();
		else if(aMove.m) {
			var movables=aGame.mOldBoard.manaMovablePieces(aGame);
			var duration=400;
			var pieceIndex=aGame.mOldBoard.board[aMove.m[0]];
			var piece=aGame.mOldBoard.pieces[pieceIndex];
			var pieceId=(piece.t=="d"?"damyo":"ronin")+"#"+this.mWho+"#"+piece.i;
			var animPath=movables[pieceIndex][aMove.m[1]];
			var animIndex=1;
			function AnimateSegment() {
				MoveSound(aGame);
				var coord=$this.getVCoord(aGame,animPath[animIndex],$this.orient);
				xdv.updateGadget(pieceId,{
					base: {
						x: coord[0],
						y: coord[1],
					},
					"2d":{
						z: 8,
					},
					"orange3d":{
						// z?
					},
				},duration,function() {
					animIndex++;
					if(animIndex==animPath.length) {
						if(aGame.mOldBoard.board[aMove.m[1]]>=0)
							AnimateCapture(aGame.mOldBoard.pieces[aGame.mOldBoard.board[aMove.m[1]]]);
						else
							AnimateMana();
					} else
						AnimateSegment();
				});
			}
			AnimateSegment();
		} else if(aMove.i!==undefined) {
			var piece;
			for(var i=0;i<aGame.mOldBoard.pieces.length;i++) {
				piece=aGame.mOldBoard.pieces[i];
				if(piece.t=="r" && piece.s==this.mWho && piece.p<0)
					break;
			}
			var pieceId="ronin#"+piece.s+"#"+piece.i;
			xdv.updateGadget(pieceId,{
				base: {
					visible: true,
				},
			});
			var coord=this.getVCoord(aGame,aMove.i,this.orient);
			xdv.updateGadget(pieceId,{
				base: {
					visible: true,
					x: coord[0],
					y: coord[1],
				},
			},400,function() {
				AnimateMana();
			});			
		}
		return false;
	}
	
})();

