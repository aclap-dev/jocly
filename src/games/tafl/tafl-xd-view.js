/*
 *
 * Copyright (c) 2013 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

(function() {
	
	var SIZE, CSIZE, fullPath;
	
	var fieldZ=0;


	// pos to [column,row]
	function Cr(pos) {
		var c=pos%SIZE;
		return [c,(pos-c)/SIZE];
	}
	
	//  column, row to pos
	function Pos(c,r) {
		return r*SIZE+c;
	}
	
	// get coordinates from either r,c or pos params
	function Coord() {
		if(arguments.length==2)
			return [(arguments[0]-SIZE/2+.5)*CSIZE,(arguments[1]-SIZE/2+.5)*CSIZE];
		else { 
			var c=arguments[0]%SIZE;
			return Coord(c%SIZE,(arguments[0]-c)/SIZE);
		}
	}
	
	View.Game.xdInit = function(xdv) {
		var $this=this;
		SIZE=this.mOptions.centerDistance*2+1;
		CSIZE=Math.ceil(11500/(SIZE+1));
		fullPath=this.mViewOptions.fullPath;

		var pieceScale=CSIZE/3000;
		var ringScale=CSIZE/1400;
		var boardScale=0.129*SIZE*CSIZE/1000;
		
		
		xdv.createGadget("extralights",{
			"3d": {
				type: "custommesh3d",
				create: function(callback){
					// spot lighting
					var spotLight1 = new THREE.SpotLight( 0xffffff, 0.5 );
					//spotLight1.shadowCameraVisible = true;
					spotLight1.shadow.camera.near = 10;
					spotLight1.shadow.camera.far = 25;
					spotLight1.castShadow = true;
					//spotLight1.shadowDarkness = .25;
					spotLight1.shadow.mapSize.width = 2048;
					spotLight1.shadow.mapSize.height = 2048;

					spotLight1.position.set(-6, 8, -6);
					
					var spotLight2 = new THREE.SpotLight( 0xffffff, 0.5 );
					//spotLight2.shadowCameraVisible = true;
					spotLight2.position.set(7, 7, 7);
					spotLight2.shadow.camera.near = 10;
					spotLight2.shadow.camera.far = 25;
					spotLight2.castShadow = true;
					//spotLight2.shadowDarkness = .15;
					spotLight2.shadow.mapSize.width = 2048;
					spotLight2.shadow.mapSize.height = 2048;
					
					var mesh=new THREE.Mesh();
					mesh.add(spotLight1);
				    mesh.add(spotLight2);
					var target = new THREE.Object3D();
					mesh.add(target);
					spotLight1.target = target;
					spotLight2.target = target;
					callback(mesh);
				},
			}
		});
		
		
		function DrawBoard(avatar,boardCanvas,bNotations,callback) {
			var BOARDSZ = 1024; // texture painting bitmap width in pixels
			
			var innerBOARDcx = 872;
			var innerBOARDcy = 872;
			var innerBOARDx = 76;
			var innerBOARDy = 76;
			var NBROWS = SIZE;
			var NBCOLS = SIZE;
			
			var nbRes = 6;

			var boardImage,cellImage,blackCell,kingCell,attackCell,defendCell;


			function drawIfReady() {
				nbRes--;
				if (nbRes == 0) {
					// do the job
					var ctx = boardCanvas.getContext('2d');
					// draw wood background
					ctx.drawImage(boardImage, 0, 0, BOARDSZ, BOARDSZ);
					
					
					// draw cells limits
					var cellCx = innerBOARDcx / NBCOLS;
					var cellCy = innerBOARDcy / NBROWS;
					var pos = 0;
					for (var row = 0; row < NBROWS; row++) {
						for (var col = 0; col < NBCOLS; col++) {
							if (bNotations && ($this.mOptions.exclude.indexOf(pos)<0)) {
								// top left small
								ctx.textAlign = 'left';
								ctx.textBaseline = 'top';
								ctx.fillStyle = "#000000";
								ctx.font = Math.ceil(cellCx / 4) + 'px Monospace';
								ctx.fillText(pos, innerBOARDx + (col + .05) * cellCx, innerBOARDy + (row + .05) * cellCy);
							}
							oldBlendingMode = ctx.globalCompositeOperation;
							oldAlpha = ctx.globalAlpha ;
							if ($this.mOptions.initial.defenders.king==pos) {
								ctx.globalCompositeOperation = 'multiply';
								ctx.drawImage(kingCell, innerBOARDx + col * cellCx, innerBOARDy + row * cellCy, cellCx, cellCy);
							}
							if ($this.mOptions.exclude.indexOf(pos)>=0) {
								ctx.globalCompositeOperation = 'multiply';
								ctx.drawImage(blackCell, innerBOARDx + col * cellCx, innerBOARDy + row * cellCy, cellCx, cellCy);
							}
							if ($this.mOptions.initial.attackers.indexOf(pos)>=0) {
								ctx.globalCompositeOperation = 'multiply';
								ctx.globalAlpha = 0.8;
								ctx.drawImage(attackCell, innerBOARDx + col * cellCx, innerBOARDy + row * cellCy, cellCx, cellCy);
							}
							if ($this.mOptions.initial.defenders.soldiers.indexOf(pos)>=0) {
								ctx.globalCompositeOperation = 'multiply';
								ctx.globalAlpha = 0.5;
								ctx.drawImage(defendCell, innerBOARDx + col * cellCx, innerBOARDy + row * cellCy, cellCx, cellCy);
							}
							ctx.globalCompositeOperation = oldBlendingMode;
							ctx.globalAlpha = oldAlpha ;
							ctx.drawImage(cellImage, innerBOARDx + col * cellCx, innerBOARDy + row * cellCy, cellCx, cellCy);
							pos++;
						}
					}
					callback();
				}
			}
			avatar.getResource("image|"+fullPath+"/res/images/ardriboard_bgx1024.jpg",function(img){
				boardImage=img;
				drawIfReady();
			});
			avatar.getResource("image|"+fullPath+"/res/images/ardricellborders.png",function(img){
				cellImage=img;
				drawIfReady();
			});
			avatar.getResource("image|"+fullPath+"/res/images/ardriblackcell.png",function(img){
				blackCell=img;
				drawIfReady();
			});
			avatar.getResource("image|"+fullPath+"/res/images/ardrikingcell.png",function(img){
				kingCell=img;
				drawIfReady();
			});
			avatar.getResource("image|"+fullPath+"/res/images/blackcell.png",function(img){
				attackCell=img;
				drawIfReady();
			});
			avatar.getResource("image|"+fullPath+"/res/images/whitecell.png",function(img){
				defendCell=img;
				drawIfReady();
			});
		}
		
		function create3DBoard(bNotations,callback){
			var smooth=0;
			var url="smoothedfilegeo|"+smooth+"|"+fullPath+"/res/xd-view/meshes/taflboard.js";
			var avat=this;
			this.getResource(url,function(geometry , materials){
				
				RequestBoardCanvas(avat,bNotations,function(boardCanvas) {

					DrawBoard(avat,boardCanvas,bNotations,function(){
						
						var texBoard = new THREE.Texture(boardCanvas);
						// And tell Three.js that it needs to update the texture.
						texBoard.needsUpdate = true;
						
						var materials0=[];		
						for(var i=0;i<materials.length;i++){
							var mat=materials[i].clone();
							if (mat.name=="boardsquare"){
	 							mat=new THREE.MeshPhongMaterial({
											// light
											specular: '#050505',
											// intermediate
											//color: '#ff0000',
											// dark
											emissive: '#000000',
											shininess: 250,
											//transparent: true,
											map: texBoard,
											bumpMap: texBoard,
											bumpScale:0.01,
											name:"boardsquare",
										});
	 						}
	 						if (mat.name=="board"){
	 							mat=new THREE.MeshPhongMaterial({
	 								color: '#000000',
	 								shininess: 500,
	 								specular: '#888888',
	 								//ambient: '#000000',
	 								emissive: '#000000',
	 								name: "board",
	 							});
	 						}
	 						materials0.push(mat);
	 					}


						var board = new THREE.Mesh( geometry , new THREE.MultiMaterial(materials0));	
						//board.overdraw = true;
					      
	  					callback(board);
					});			
				});
			});
				
		}
		
		var boardCanvas={
			'plain': null,
			'notation': null,
		}
		function RequestBoardCanvas(avatar,notation,callback) {
			var key=notation?'notation':'plain';
			if(boardCanvas[key])
				callback(boardCanvas[key]);
			else {
				var bc=document.createElement('canvas');
				boardCanvas[key]=bc;
				bc.width=1024;
				bc.height=1024;
				DrawBoard(avatar,bc,notation,function() {
					callback(bc);
				});
			}
		}
		
		var BOARDSIZE = SIZE*CSIZE*1.18;
		
		xdv.createGadget("board",{
			base: {
			},
			"2d": {
				type: "canvas",
				width: BOARDSIZE,
				height: BOARDSIZE,
				draw: function(ctx) {
					ctx.save();
					RequestBoardCanvas(this,false,function(boardCanvas){
						ctx.drawImage(boardCanvas,-BOARDSIZE/2,-BOARDSIZE/2,BOARDSIZE,BOARDSIZE);	
						ctx.restore();
					});
				},
			},
			"3d": {
				type: "custommesh3d",
				scale: [boardScale,boardScale,boardScale],
				z:150,
				receiveShadow:true,
				create: function(callback){
					create3DBoard.call(this,false,callback);
					return null;
				}
			}
		});
		
		xdv.createGadget("boardnotations",{
			base: {
			},
			"2d": {
				type: "canvas",
				width: SIZE*CSIZE*1.18,
				height: SIZE*CSIZE*1.18,
				draw: function(ctx,pixSize){
					ctx.save();
					RequestBoardCanvas(this,true,function(boardCanvas){
						ctx.drawImage(boardCanvas,-BOARDSIZE/2,-BOARDSIZE/2,BOARDSIZE,BOARDSIZE);	
						ctx.restore();
					});
				},
			},
			"3d": {
				type: "custommesh3d",
				scale: [boardScale,boardScale,boardScale],
				z:150,
				receiveShadow:true,
				create: function(callback){
					create3DBoard.call(this,true,callback);
					return null;
				}
			}
		});
		
		for(var pos=0;pos<SIZE*SIZE;pos++) 
			(function(pos) {
				var coord=Coord(pos);
				var cellClass;
				if($this.g.excludeMap[pos])
					cellClass="cell-exclude";
				else if(pos%2)
					cellClass="cell-white";
				else
					cellClass="cell-black";
				if(pos==$this.g.home)
					cellClass+=" cell-home";
				xdv.createGadget("cell#"+pos,{
					base: {
						x: coord[0],
						y: coord[1],
					},
					"2d": {
						z: 1,
						type: "element",
						initialClasses: "cell",
						width: CSIZE*1.01,
						height: CSIZE*1.01,
					},
				});
				xdv.createGadget("clicker#"+pos,{
					base: {
						x: coord[0],
						y: coord[1],
					},
					"2d": {
						z: 3,
						type: "element",
						initialClasses: "clicker",
						width: CSIZE,
						height: CSIZE,
					},
					"3d": {
						z: fieldZ,
						type: "meshfile",
						file : fullPath+"/res/xd-view/meshes/ring-target.js",
						flatShading: true,
						castShadow: true,
						smooth : 0,
						scale:[ringScale,ringScale,ringScale],
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
					}
				});
			})(pos);
		
		var PIECE_TEXT_SZ=512;
		function DrawPieceTexture(avatar,cnv,bWhite,callback){
			var url="image|"+fullPath+"/res/xd-view/meshes/woodtoken-diffuse"+(bWhite?".jpg":"-black.jpg");
			avatar.getResource(url,function(img){
				var ctx = cnv.getContext('2d');
				ctx.drawImage(img,0,0,PIECE_TEXT_SZ, PIECE_TEXT_SZ);	
				callback();
			});
		}
		var pieceTextures={
			'white': null,
			'plain': null,
		}
		function RequestPieceTexture(avatar,bWhite,bKing,callback) {
			var key=bWhite?'white':'plain';
			if(Array.isArray(pieceTextures[key]))
				pieceTextures[key].push(callback);
			else if(pieceTextures[key]===null) {
				var bc=document.createElement('canvas');
				bc.width=PIECE_TEXT_SZ;
				bc.height=PIECE_TEXT_SZ;				
				pieceTextures[key]=[callback];
				DrawPieceTexture(avatar,bc,bWhite,function() {
					var texPiece = new THREE.Texture(bc);
					texPiece.needsUpdate = true;
					while(pieceTextures[key].length>0)
						(pieceTextures[key].shift())(texPiece);
					pieceTextures[key] = texPiece;
				});
			} else
				callback(pieceTextures[key]);
		}
		
		function create3DPiece(bWhite,bKing,callback){
			var smooth=0;
			var url="smoothedfilegeo|"+smooth+"|"+fullPath +"/res/xd-view/meshes/woodtoken.js";
			var avat=this;
			this.getResource(url,function(geometry , materials){
				
				RequestPieceTexture(avat,bWhite,bKing,function(texPiece) {
						
						var materials0=[];		
						for(var i=0;i<materials.length;i++){
							var mat=materials[i].clone();
							if (mat.name=="wood"){
	 							mat=new THREE.MeshPhongMaterial({
											// light
	 										specular: '#222222',
	 										color: '#dddddd',
											shininess: 30,
											map: texPiece,
											bumpMap: texPiece,
											bumpScale:0.03,
											name:"wood",
										});
	 						}
	 						if (mat.name=="redstar"){
	 							mat=new THREE.MeshPhongMaterial({
	 								color: '#aa0000',
	 								shininess: 150,
	 								specular: '#666666',
	 								emissive: '#000000',
	 								name: "redstar",
	 								transparent:!(bKing),
	 								opacity: bKing?1:0,
	 								shading: THREE.FlatShading,
	 							});
	 						}
	 						materials0.push(mat);
	 					}


						var piece = new THREE.Mesh( geometry , new THREE.MultiMaterial(materials0));	
						//board.overdraw = true;
					      
	  					callback(piece);
				});
			});			
		}
		
		function MakePiece(index,side,type) {
			var clipx;
			if(side==$this.mOptions.attackers)
				clipx=0;
			else if(type=='k')
				clipx=310;
			else
				clipx=155;
			xdv.createGadget("piece#"+index,{
				base: {
				},
				"2d": {
					z: 4,
					type: "sprite",
					file: fullPath+"/res/xd-view/meshes/ardri-sprites.png",
					clipwidth: 155,
					clipheight: 155,
					clipx: clipx,
					clipy: 0,
					width: CSIZE*.85,
					height: CSIZE*.85,
				},
				"3d": {
					type: "custommesh3d",
					castShadow: true,	
					receiveShadow: false,
					scale:[pieceScale,pieceScale,(type=="k")?pieceScale*1.5:pieceScale],
					create: function(callback){
						create3DPiece.call(this,side!=$this.mOptions.attackers,type=="k",callback);
						return null;
					}
				},
			});			
		}
		
		var index=0;
		MakePiece(index++,-this.mOptions.attackers,'k');
		for(var i=0;i<this.mOptions.initial.defenders.soldiers.length;i++)
			MakePiece(index++,-this.mOptions.attackers,'s');
		for(var i=0;i<this.mOptions.initial.attackers.length;i++)
			MakePiece(index++,this.mOptions.attackers,'s');
		
		
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
		xdv.createGadget("videoa",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return createScreen.call(this,videoTexture);
				},
				z: zScreen,
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
				scale: [scaleScreen/4,scaleScreen/4,scaleScreen/4],
			},
		});	
	}
	
	var tokens={},tokenCounter=1;

	View.Game.xdBuildScene = function(xdv) {
		xdv.updateGadget("extralights",{
			"3d":{
				visible:true,
			}
		});
		xdv.updateGadget("board",{
			base: {
				visible: !this.mNotation,
			},
		});
		xdv.updateGadget("boardnotations",{
			base: {
				visible: this.mNotation,
			},
		});			
		for(var pos=0;pos<SIZE*SIZE;pos++) {
			var coord=Coord(pos);
			xdv.updateGadget("cell#"+pos,{
				base: {
					visible: true,
				},
			});
		}
		var xScreen=0;
		var yScreen=9000;
		var thumbDist=.99;
		var thumbOffset=4000;
		xdv.updateGadget("videoa",{
			"3d": {
				visible: true,
				playerSide: 1,
				x: xScreen,
				y: this.mViewAs==1?yScreen:-yScreen,
				rotate: this.mViewAs==1?180:0,
			},
		});
		xdv.updateGadget("videoabis",{
			"3d": {
				visible: true,
				playerSide: -1,
				x: this.mViewAs==1?-thumbOffset:thumbOffset,
				y: this.mViewAs==1?thumbDist*yScreen:-thumbDist*yScreen,
				rotate: this.mViewAs==1?180:0,
			},
		});

		xdv.updateGadget("videob",{
			"3d": {
				visible: true,
				playerSide: -1,
				x: -xScreen,
				y: this.mViewAs==1?-yScreen:yScreen,
				rotate: this.mViewAs==1?0:180,
			},
		});
		xdv.updateGadget("videobbis",{
			"3d": {
				visible: true,
				playerSide: 1,
				x: this.mViewAs==1?thumbOffset:-thumbOffset,
				y: this.mViewAs==1?-thumbDist*yScreen:thumbDist*yScreen,
				rotate: this.mViewAs==1?0:180,
			},
		});
	}
	
	View.Board.xdDisplay = function(xdv, aGame) {
		for(var i=0;i<this.pieces.length;i++) {
			var piece=this.pieces[i];
			if(piece.p<0)
				xdv.updateGadget("piece#"+i,{
					base: {
						visible: false,
					},
				});
			else {
				var coord=Coord(piece.p);
				xdv.updateGadget("piece#"+i,{
					base: {
						visible: true,
						x: coord[0],
						y: coord[1],
					},
					"2d": {
						opacity: 1,
					},
					"3d":{
						z:0,
					}
				});
			}

		}
	}
	
	View.Board.xdBuildHTStateMachine = function(xdv, htsm, aGame) {
		var $this=this;
		var move={};
		
		function Clean(args) {
			for(var pos=0;pos<SIZE*SIZE;pos++) {
				xdv.updateGadget("clicker#"+pos,{
					base: {
						visible: false,
						click: null,
					}
				});
				xdv.updateGadget("cell#"+pos,{
					base: {
					},
					"2d": {
						classes: "",						
					},
				});
			}
			$this.pieces.forEach(function(piece) {
				xdv.updateGadget("piece#"+piece.i,{
					base: {
						click: null,
					}
				});									
			});
		}
		function SelectFrom(args) {
			var poss={};
			function Click(pos) {
				htsm.smQueueEvent("E_CLICK",{pos:pos});
			}
			$this.mMoves.forEach(function(move) {
				poss[move.f]=true;
			});
			for(var pos in poss)
				(function(pos) {
					var index=$this.board[pos];
					xdv.updateGadget("piece#"+index,{
						base: {
							click: function() {
								Click(pos);
							},
						}
					});					
					xdv.updateGadget("clicker#"+pos,{
						base: {
							visible: true,
							click: function() {
								Click(pos);
							},
						},
						"3d" : {
							materials : {
								"ring" : {
									color : 0xffffff,
									opacity: 1,
								},
							},
						}
					});					
					xdv.updateGadget("cell#"+pos,{
						base: {
						},
						"2d": {
							classes: "cell-select",							
						}
					});					
				})(pos);
		}		
		function SaveFrom(args) {
			move.f=parseInt(args.pos);
		}
		function SelectTo(args) {
			var poss={};
			xdv.updateGadget("piece#"+$this.board[move.f],{
				base: {
					click: function() {
						htsm.smQueueEvent("E_CANCEL",{});
					},
				}
			});					
			xdv.updateGadget("clicker#"+move.f,{
				base: {
					visible: true,
					click: function() {
						htsm.smQueueEvent("E_CANCEL",{});
					},
				},
				"3d" : {
					materials : {
						"ring" : {
							color : 0xff8800,
							opacity: 1,
						},
					},
				}
			});					
			xdv.updateGadget("cell#"+move.f,{
				"2d": {
					classes: "cell-cancel",							
				}
			});					
			function Click(pos) {
				htsm.smQueueEvent("E_CLICK",{move:poss[pos]});
			}
			$this.mMoves.forEach(function(m) {
				if(m.f==move.f)
					poss[m.t]=m;
			});
			for(var pos in poss)
				(function(pos) {
					xdv.updateGadget("clicker#"+pos,{
						base: {
							visible: true,
							click: function() {
								Click(pos);
							},
						},
						"3d" : {
							materials : {
								"ring" : {
									color : 0xffffff,
									opacity: 1,
								},
							},
						}
					});					
					xdv.updateGadget("cell#"+pos,{
						base: {
						},
						"2d": {
							classes: "cell-select",							
						}
					});					
				})(pos);
		}
		function SaveTo(args) {
			move.t=parseInt(args.move.t);
			move.c=args.move.c;
		}
		function Animate(args) {
			$this.taflAnimate(xdv,aGame,move,function() {
				htsm.smQueueEvent("E_ANIMATED",{});
			});
		}
		function SendMove(args) {
			aGame.MakeMove(move);
		}
		function Cancel(args) {
			move={}
		}
		htsm.smTransition("S_INIT", "E_INIT", "S_SELECT_FROM", [ ]);
		htsm.smEntering("S_SELECT_FROM",[SelectFrom]);
		htsm.smLeaving("S_SELECT_FROM",[Clean]);
		htsm.smTransition("S_SELECT_FROM", "E_CLICK", "S_SELECT_TO", [ SaveFrom, SelectTo ]);
		htsm.smLeaving("S_SELECT_TO",[Clean]);
		htsm.smTransition("S_SELECT_TO", "E_CLICK", "S_ANIMATE", [ SaveTo, Animate ]);
		htsm.smTransition("S_SELECT_TO", "E_CANCEL", "S_SELECT_FROM", [ Cancel ]);
		htsm.smTransition("S_ANIMATE", "E_ANIMATED", "S_DONE", [ SendMove ]);
		htsm.smTransition(["S_SELECT_FROM","S_SELECT_TO","S_ANIMATE"], "E_END", "S_DONE", [ ]);
		htsm.smEntering("S_DONE",[Clean]);
		htsm.smTransition("S_DONE", "E_END", null, [ ]);
	}
	
	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		aGame.mOldBoard.taflAnimate(xdv,aGame,aMove,function() {
			aGame.MoveShown();
		});
	}
	
	View.Board.taflAnimate = function(xdv,aGame,aMove,callback) {
		var $this=this;
		var animCount=0;
		
		function EndAnim() {
			if(--animCount==0)
				callback();
		}
		var piece=this.pieces[this.board[aMove.f]];

		var soundName=this.mWho==aGame.mOptions.attackers?"move1":"move3";
		if (aGame.mSkin=='thanksgiving')
			soundName=piece.t=='k'?"move3":"move1"; 
		aGame.PlaySound(soundName);

		var coord=Coord(aMove.t);
		xdv.updateGadget("piece#"+piece.i,{
			base: {
				x: coord[0],
				y: coord[1],
			},
		},600,function() {
			if(aMove.c.length>0) {
				var soundName="death"+(Math.floor(Math.random()*3)+1);
				aGame.PlaySound(soundName);
				aMove.c.forEach(function(pos1) {
					animCount++;
					var piece1=$this.pieces[$this.board[pos1]];
					xdv.updateGadget("piece#"+piece1.i,{
						base: {
						},
						"2d": {
							opacity: 0,
						},
						"3d": {
							z: -1000,
						}
					},600,EndAnim);
				});
			} else
				callback();
		});
	}
	
})();
