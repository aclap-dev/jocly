/*
 *
 * Copyright (c) 2013 - Jocly - www.jocly.com
 * 
 * This file is part of the Jocly game platform and cannot be used outside of this context without the written permission of Jocly.
 * 
 */

(function() {
	View.Game.Coords = function(row,col){		
		return {x:(col+(1-this.g.NBCOLS)/2)*this.g.CSIZE,y:(row+(1-this.g.NBROWS)/2)*this.g.CSIZE};
	}
	View.Game.Coords2d = function(row,col){	
		return {x:(col+(1-this.g.NBCOLS)/2)*this.g.CSIZE_2D,y:(row+(1-(this.g.NBROWS-this.g.addedRowsFor2d))/2)*this.g.CSIZE_2D};
	}
	
	View.Game.refreshScore = function(xdv,nbBlacks,nbWhites){
		if (this.g.canvasScore !== undefined){		
			var cnv=this.g.canvasScore;
			var ctx=cnv.getContext("2d");
			ctx.clearRect(0,0,cnv.width,cnv.height);
			
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = '100px Verdana';
	
			ctx.fillStyle = "rgba(255,255,255,1)";
			ctx.fillText(nbWhites,cnv.width/4,cnv.height/2);
			ctx.fillStyle = "rgba(0,0,0,1)";
			ctx.fillText(nbBlacks,cnv.width/4*3,cnv.height/2);
	
			if(this.g.textureScore)
				this.g.textureScore.needsUpdate=true;
			
			xdv.updateGadget("scoreboardA",{
				"2d":{
					visible:true,
				}
			});
		}
	}
	
	
	View.Game.xdInit = function(xdv) {
		
		var fullPath=this.mViewOptions.fullPath;
		this.g.NBCOLS=this.mOptions.width;
		this.g.NBROWS=this.mOptions.height;
		this.g.NBCELLS=Math.max(this.g.NBCOLS,this.g.NBROWS);
		this.g.CSIZE=12000/this.g.NBCELLS;					

		// handling 2d with potential extra row for score
		this.g.addedRowsFor2d=0;
		if ((this.g.NBCOLS>this.g.NBROWS)&&(this.g.NBCOLS-this.g.NBROWS<2)){
			this.g.addedRowsFor2d=1;
		}  
		if (this.g.NBCOLS<=this.g.NBROWS){
			this.g.addedRowsFor2d=1;
		}  

		this.g.NBCELLS_2D=Math.max(this.g.NBCOLS,this.g.NBROWS+this.g.addedRowsFor2d);
		this.g.CSIZE_2D=12000/this.g.NBCELLS_2D;					
		
		var $this=this;

		this.rCreateScreens(xdv);

		xdv.createGadget("pass-board-w",{
			base: {
				type: "element",
				x: 0,
				y: 0,
				width: 8000,
				height: 8000,
				opacity:0,
				z: 108,
				center: {x:0,y:0},
				css: {
					"background-color": "White",
					"border-radius": "2rem",
					"box-shadow": "1px 1px 12px #555",
					"background-image": "url("+fullPath+"/res/xd-view/pass-light.png)",
					"background-size": "contain"
				}
			},
		});
		xdv.createGadget("pass-board-b",{
			base: {
				type: "element",
				x: 0,
				y: 0,
				width: 8000,
				height: 8000,
				opacity:0,
				z: 108,
				center: {x:0,y:0},
				css: {
					"background-color": "Black",
					"border-radius": "2rem",
					"box-shadow": "1px 1px 12px #555",
					"background-image": "url("+fullPath+"/res/xd-view/pass-dark.png)",
					"background-size": "contain"
				}
			},
		});

		function createPiece3D(avatar,callback){
			
			function instanciatePiece(){
				var mesh = new THREE.Mesh($this.g.pieceGeo,$this.g.pieceMaterial);
				callback(mesh);
			}
				
			if (($this.g.pieceMaterial === undefined) && ($this.g.pieceGeo === undefined)) {
				
				// prepare canvas
				var TXT_CNV_SZ=512;
				var canvasDiffuse=document.createElement('canvas');
				canvasDiffuse.width=TXT_CNV_SZ;
				canvasDiffuse.height=TXT_CNV_SZ;
				var textureDiff =  new THREE.Texture(canvasDiffuse);					
				var canvasBump=document.createElement('canvas');
				canvasBump.width=TXT_CNV_SZ;
				canvasBump.height=TXT_CNV_SZ;
				var textureBump =  new THREE.Texture(canvasBump);
				// resources
				var nbRes=3;
				var diffuseMap;
				var bumpMap;
				var pieceGeo;
				
				function checkLoaded(){
					nbRes--;
					if (nbRes==0){
						// paint textures
						var ctx=canvasDiffuse.getContext("2d");
						ctx.drawImage(diffuseMap,0,0,diffuseMap.width,diffuseMap.height,0,0,TXT_CNV_SZ,TXT_CNV_SZ);
						var ctxBump=canvasBump.getContext("2d");
						ctxBump.drawImage(bumpMap,0,0,bumpMap.width,bumpMap.height,0,0,TXT_CNV_SZ,TXT_CNV_SZ);

						textureDiff.needsUpdate = true;
						textureBump.needsUpdate = true;
						$this.g.pieceMaterial = new THREE.MultiMaterial([new THREE.MeshPhongMaterial({ 
								name: "Material",
						 		specular:"#111111",
						 		shininess:10,
						 		shading: THREE.SmoothShading,
						 		map:textureDiff,
						 		bumpMap:textureBump,
						 		bumpScale:0.1,
						 })]);
						$this.g.pieceGeo = pieceGeo;
						instanciatePiece();
						//callback(mesh);
					}
				}
				avatar.getResource("image|"+fullPath+"/res/xd-view/reversi-pieces-2-textures.png",
					function(img){
						diffuseMap=img;
						checkLoaded();
					});
				avatar.getResource("image|"+fullPath+"/res/xd-view/reversi-pieces-2-textures-bump.png",
					function(img){
						bumpMap=img;
						checkLoaded();
					});
				avatar.getResource("smoothedfilegeo|0|"+fullPath+"/res/xd-view/reversi-pieces-6.js",
					function(geometry , materials){
						pieceGeo=geometry;
						checkLoaded();
					});
			}else{
				instanciatePiece();
			}
		}


		function createGridBoard(avatar,callback, notations, viewAs){
	
			var HEIGHT = $this.g.NBROWS;
			var SWIDTH = $this.g.NBCOLS;
			var SIZE=Math.floor(12000/$this.g.NBCELLS);
			
			
			var parent=new THREE.Object3D();	
			var TEXTURE_CANVAS_CX=1024;
			var TEXTURE_CANVAS_CY=TEXTURE_CANVAS_CX/$this.g.NBCOLS*$this.g.NBROWS;
			var TEXTURE_CANVAS_CSQUARE=Math.max(TEXTURE_CANVAS_CX,TEXTURE_CANVAS_CY);
			
			var canvasDiffuse=document.createElement('canvas');
			canvasDiffuse.width=TEXTURE_CANVAS_CX;
			canvasDiffuse.height=TEXTURE_CANVAS_CY;
			var textureDiff =  new THREE.Texture(canvasDiffuse);					
			var canvasBump=document.createElement('canvas');
			canvasBump.width=TEXTURE_CANVAS_CX;
			canvasBump.height=TEXTURE_CANVAS_CY;
			var textureBump =  new THREE.Texture(canvasBump);
			var margin=0; //prct
			if (avatar.options.margin!==undefined) margin=avatar.options.margin;
			
			
			function paintNotations(ctx,cellCx,cellCy,fillStyle){
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = fillStyle;
				ctx.font = Math.ceil(cellCx / 5) + 'px Monospace';
				for(var r=0;r<HEIGHT;r++)
					for(var c=0;c<SWIDTH;c++) {
						if ($this.isAlive(r,c))
							ctx.fillText("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(c)+(r+1),(c+(1-SWIDTH)/2)*cellCx,(r+(1-HEIGHT)/2)*cellCy);
					}				
			}
			
			
			avatar.getResource("image|"+fullPath+"/res/images/wood-chipboard-5.jpg",function(img){
				
				var blackColor="rgba(51, 204, 0,0.4)";
				var whiteColor="rgba(0, 128, 0,0.4)"

				// create board floor
				var ctx=canvasDiffuse.getContext("2d");
				ctx.translate(TEXTURE_CANVAS_CX/2,TEXTURE_CANVAS_CY/2);
				ctx.drawImage(img,-TEXTURE_CANVAS_CSQUARE/2,-TEXTURE_CANVAS_CSQUARE/2,TEXTURE_CANVAS_CSQUARE,TEXTURE_CANVAS_CSQUARE);
				//TEXTURE_CANVAS_SZ=(1+2*margin/100)*SWIDTH*cellCx
				
				function drawCell(ctx,fillStyle,xCenter,yCenter,cx,cy){
					if ($this.isAlive(r,c))
						ctx.fillStyle=fillStyle;
					else
						ctx.fillStyle="#000000";
					ctx.fillRect(xCenter-cx/2,yCenter-cy/2,cx,cy);
				}
				function drawLines(ctx){
					ctx.strokeStyle="#000000";
					ctx.lineWidth="2";
					for(var r=0;r<HEIGHT;r++){
						ctx.beginPath();
						ctx.moveTo((-SWIDTH/2)*cellCx,(-HEIGHT/2+r)*cellCy);
						ctx.lineTo((SWIDTH/2)*cellCx,(-HEIGHT/2+r)*cellCy);
						ctx.stroke();
					}
					for(var c=0;c<SWIDTH;c++) {
						ctx.beginPath();
						ctx.moveTo((-SWIDTH/2+c)*cellCx,(-HEIGHT/2)*cellCy);
						ctx.lineTo((-SWIDTH/2+c)*cellCx,(HEIGHT/2)*cellCy);
						ctx.stroke();
					}
					ctx.lineWidth="4";
					ctx.beginPath();
					ctx.moveTo((-SWIDTH/2)*cellCx,(-HEIGHT/2)*cellCy);
					ctx.lineTo((SWIDTH/2)*cellCx,(-HEIGHT/2)*cellCy);
					ctx.lineTo((SWIDTH/2)*cellCx,(HEIGHT/2)*cellCy);
					ctx.lineTo((-SWIDTH/2)*cellCx,(HEIGHT/2)*cellCy);
					ctx.lineTo((-SWIDTH/2)*cellCx,(-HEIGHT/2)*cellCy);
					ctx.stroke();
				}
				
				// pre paint with black fill color
				ctx.fillStyle=blackColor;
				ctx.fillRect(-TEXTURE_CANVAS_CX/2,-TEXTURE_CANVAS_CY/2,TEXTURE_CANVAS_CX,TEXTURE_CANVAS_CY);
				// paint diffuse cells
				var cellCx=TEXTURE_CANVAS_CX/(SWIDTH*(1+2*margin/100));
				var cellCy=TEXTURE_CANVAS_CY/(HEIGHT*(1+2*margin/100));
				for(var r=0;r<HEIGHT;r++)
					for(var c=0;c<SWIDTH;c++) {
						(function(r,c){
							var i=r+c;
							drawCell(ctx,i%2?blackColor:whiteColor,(c+(1-SWIDTH)/2)*cellCx,(r+(1-HEIGHT)/2)*cellCy,cellCx,cellCy);
						})(r,c);
					}
				// paint diffuse lines
				drawLines(ctx);
				var notationColor="#000000"; //whiteColor;
				if (avatar.options.notationColor!==undefined) notationColor=avatar.options.notationColor;
				if (notations) 
					paintNotations(ctx,cellCx,cellCy,notationColor);
				
				
				// paint bump white + lines
				var ctxBump=canvasBump.getContext("2d");
				ctxBump.translate(TEXTURE_CANVAS_CX/2,TEXTURE_CANVAS_CY/2);
				ctxBump.fillStyle="#ffffff";
				ctxBump.fillRect(-TEXTURE_CANVAS_CX/2,-TEXTURE_CANVAS_CY/2,TEXTURE_CANVAS_CX,TEXTURE_CANVAS_CY);
				drawLines(ctxBump);
				if (notations) 
					paintNotations(ctxBump,cellCx,cellCy,"#000000");

				
				textureDiff.needsUpdate=true;
				textureBump.needsUpdate=true;
				
				var bsp="#050505";
				if (avatar.options.boardSpecular!==undefined) bsp=avatar.options.boardSpecular;
				
				
				var geo=new THREE.PlaneGeometry((1+2*margin/100)*SWIDTH*SIZE/1000,(1+2*margin/100)*HEIGHT*SIZE/1000);
				var mesh=new THREE.Mesh(geo, new THREE.MeshPhongMaterial({map:textureDiff,bumpMap:textureBump,bumpScale:0.005,specular:bsp,shininess:50}));
				mesh.rotation.x=-Math.PI/2;	
				mesh.receiveShadow=true;
				parent.add(mesh);								

				// add border frame
				var cx=(1+2*margin/100)*SWIDTH*SIZE/1000;
				var cy=(1+2*margin/100)*HEIGHT*SIZE/1000;
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
					shininess: 250,
					specular: '#ffffff',
					emissive: '#000000',
				});
				var frameObj = new THREE.Mesh( frameGeo , frameMat);
				frameObj.position.y=-extrudeSettings.amount-.01;
				parent.add(frameObj);
				
				var boardBottom=new THREE.Mesh(geo,frameMat);
				boardBottom.position.y=-.3;
				boardBottom.rotation.x=Math.PI/2;	
				boardBottom.receiveShadow=true;
				parent.add(boardBottom);
						
				callback(parent);
			});			
		}
		
		
		function checkScoreTextureExists(){			
			if($this.g.canvasScore===undefined){				
				$this.g.canvasScore=document.createElement('canvas');
				$this.g.canvasScore.width=512;
				$this.g.canvasScore.height=$this.g.canvasScore.width/8*3;
				if(typeof THREE!="undefined")
					$this.g.textureScore = new THREE.Texture($this.g.canvasScore);
			}			
		}
		
		var cnvScore2DH=this.g.CSIZE_2D;
		var cnvScore2DW=cnvScore2DH/3*8;
		// var yForScore2D = -6000-cnvScore2DH/2+this.g.addedRowsFor2d*this.g.CSIZE_2D;
		var yForScore2D = -6000+this.g.addedRowsFor2d*this.g.CSIZE_2D/2;
		if (this.g.NBCOLS>this.g.NBROWS)
			yForScore2D += (this.g.NBCOLS-this.g.NBROWS)*this.g.CSIZE_2D/4;
		xdv.createGadget("scoreboardA",{
			"2d":{
				type: "canvas",
				width:  cnvScore2DW,
				height: cnvScore2DH,
				x: 0,
				y: yForScore2D,
				z:10,
				draw: function(ctx) {
					ctx.save();
					checkScoreTextureExists();

					ctx.drawImage($this.g.canvasScore,-cnvScore2DW/2,-cnvScore2DH/2,cnvScore2DW,cnvScore2DH);
					ctx.restore();
				}					
			},
			"3d":{
				type: "custommesh3d",
				z:800,
				y:-($this.g.NBROWS+1)/2*this.g.CSIZE,
				create: function(callback){
					
					checkScoreTextureExists();

					var plane = new THREE.Mesh( 
							new THREE.PlaneGeometry(8,3), 
					      	new THREE.MeshPhongMaterial({map:$this.g.textureScore,transparent: true}) );
					callback(plane);
				},
				receiveShadow: true,
			},
		});
		xdv.createGadget("scoreboardB",{
			"3d":{
				type: "custommesh3d",
				z:800,				
				y:($this.g.NBROWS+1)/2*this.g.CSIZE,
				rotate:180,
				create: function(callback){
					
					checkScoreTextureExists();
					
					var plane = new THREE.Mesh( 
							new THREE.PlaneGeometry(8,3), 
					      	new THREE.MeshPhongMaterial({map:$this.g.textureScore,transparent: true}) );
					callback(plane);
				},
				receiveShadow: true,
			},
		});


		var BOARD_CNV_SZ = 1024; // texture painting bitmap width in pixels
		function DrawBoard(avatar,bCanvas,bNotations,callback) {
			
			var shadowsImg,boardText;
			var nbRes=2;
			
			console.log("painting board",avatar,bCanvas,bNotations);

			var drawIfReady = function(){
				nbRes--;
				if (nbRes==0){
					var csize = BOARD_CNV_SZ/$this.g.NBCELLS_2D;
					var hCenteringOffset=(BOARD_CNV_SZ-$this.g.NBCOLS*csize)/2;
					var vCenteringOffset=$this.g.addedRowsFor2d*csize+(BOARD_CNV_SZ-($this.g.NBROWS+$this.g.addedRowsFor2d)*csize)/2;
					// paint texture
					var ctx=bCanvas.getContext("2d");
					//ctx.fillStyle=bNotations?"#ff0000":"#00ff00";
					var textureSz=128;
					var x=0;
					while (x<BOARD_CNV_SZ){
						var y=0;					
						while (y<BOARD_CNV_SZ){
							ctx.drawImage(boardText,x,y,textureSz,textureSz);
							y+=textureSz;
						}
						x+=textureSz;
					}
					// paint shadows
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';	
					ctx.font = Math.ceil(csize / 5) + 'px Monospace';																
					for (var r=0; r<$this.g.NBROWS; r++){		
						for (var c=0; c<$this.g.NBCOLS; c++){
							var coords={x:hCenteringOffset+c*csize,y:vCenteringOffset+r*csize};
							if ($this.isAlive(r,c)){
								ctx.drawImage(shadowsImg,coords.x,coords.y,csize,csize);
								if(bNotations){
									ctx.fillText("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(c)+(r+1),coords.x+csize/2, coords.y+csize/2);
									//ctx.fillText("["+r+":"+c+"]",coords.x+csize/2, coords.y+csize/2);
								}
							}
							else{
								ctx.fillStyle="rgba(0,0,0,0.5)";
								ctx.fillRect(coords.x,coords.y,csize,csize);
							}
							
						}
					}
					// clean up with white
					if (hCenteringOffset>0){
						ctx.fillStyle="rgba(255,255,255,1)";
						ctx.fillRect(0,0,hCenteringOffset,BOARD_CNV_SZ);					
						ctx.fillRect(BOARD_CNV_SZ-hCenteringOffset,0,hCenteringOffset,BOARD_CNV_SZ);						
					}			
					if (vCenteringOffset>0){
						// green area for score
						ctx.save();
						ctx.fillStyle="rgba(35,120,35,1)";
						ctx.fillRect(hCenteringOffset,0,BOARD_CNV_SZ-2*hCenteringOffset,vCenteringOffset);
						// inner shadow
					    ctx.beginPath();
						ctx.rect(hCenteringOffset,0,BOARD_CNV_SZ-2*hCenteringOffset,vCenteringOffset);			
    					ctx.clip();
					    ctx.strokeStyle = "rgba(35,120,35,1)";
					    ctx.lineWidth = 2;
					    ctx.shadowBlur = 8;
					    ctx.shadowColor = 'black';
					    ctx.shadowOffsetX = 0;
					    ctx.shadowOffsetY = 3;
    					
    					ctx.beginPath();
						ctx.rect(hCenteringOffset,0,BOARD_CNV_SZ-2*hCenteringOffset,vCenteringOffset);
						ctx.stroke();

						ctx.restore();
						
						// white cleaning at bottom
						ctx.fillStyle="rgba(255,255,255,1)";
						ctx.fillRect(hCenteringOffset,vCenteringOffset+$this.g.NBROWS*csize,BOARD_CNV_SZ-2*hCenteringOffset,vCenteringOffset);			
					}			
					callback();
				}
			}			

			avatar.getResource("image|"+fullPath+"/res/xd-view/cellshadows.png",function(img){
				shadowsImg=img;
				drawIfReady();
			});
			avatar.getResource("image|"+fullPath+"/res/xd-view/boardtexture.jpg",function(img){
				boardText=img;
				drawIfReady();
			});

		}

		var boardCanvas={
			'plain': null,
			'notation': null,
		}	

		function RequestBoardCanvas(avatar,notation,callback) {
			var key=notation?'notation':'plain';
			if(boardCanvas[key]!==null){
				console.log("canvas callback",key);
				callback(boardCanvas[key]);
			}
			else {
				console.log("creating canvas",key);
				var bc=document.createElement('canvas');
				boardCanvas[key]=bc;
				bc.width=BOARD_CNV_SZ;
				bc.height=BOARD_CNV_SZ;
				DrawBoard(avatar,bc,notation,function() {
					callback(bc);
				});
			}
		}
		
		var BOARDSIZE=12000;
		xdv.createGadget("board",{
			"base":{
				z:0,
			},
			"2d" : {
				type : "canvas",
				width: BOARDSIZE,
				height: BOARDSIZE,
				draw: function(ctx) {
					console.log("Draw board without notations");
					ctx.save();
					RequestBoardCanvas(this,false,function(bc){
						ctx.drawImage(bc,-BOARDSIZE/2,-BOARDSIZE/2,BOARDSIZE,BOARDSIZE);
						//ctx.fillStyle="#ff0000";	
						//ctx.fillRect(-BOARDSIZE/2,-BOARDSIZE/2,BOARDSIZE,BOARDSIZE);
						ctx.restore();
					});
				},
			},
			"3d":{			
				type: "custommesh3d",
				create: function(callback){
					createGridBoard(this,callback,false,1);
				},
			}

		});
		xdv.createGadget("boardNotations",{
			"base":{
				z:0,
			},
			"2d" : {
				type : "canvas",
				width: BOARDSIZE,
				height: BOARDSIZE,
				draw: function(ctx) {
					console.log("Draw board with notations");
					ctx.save();
					RequestBoardCanvas(this,true,function(bc){
						ctx.drawImage(bc,-BOARDSIZE/2,-BOARDSIZE/2,BOARDSIZE,BOARDSIZE);	
						//ctx.fillStyle="#00ff00";	
						//ctx.fillRect(-BOARDSIZE/2,-BOARDSIZE/2,BOARDSIZE,BOARDSIZE);
						ctx.restore();
					});
				},
			},
			"3d":{			
				type: "custommesh3d",
				create: function(callback){
					createGridBoard(this,callback,true,1);
				},
			}

		});
		
		var zoom3d=.6/this.g.NBCELLS*8;	
		var zoom3dselect=zoom3d*1.2;
		this.g.pieceZ0=300/this.g.NBCELLS*4;
		for(var pos in this.g.confine) {
			var rc=this.RC(pos);
			var r=rc.r,c=rc.c;
			var coords=this.Coords(r,c);
			var coords2d=this.Coords2d(r,c);
			xdv.createGadget("piece#"+r+"#"+c, {	
				"base": {
					z: 1,
				},	
				"2d" : {
					x: coords2d.x,
					y: coords2d.y,
					type : "sprite",
					file: fullPath+"/res/xd-view/sprites.png",
					clipwidth: 200,
					clipheight: 200,
					clipx: 0,
					clipy: 0,
					width: $this.g.CSIZE_2D,
					height: $this.g.CSIZE_2D,
				},
				"3d":{
					x: coords.x,
					y: coords.y,
					visible:false,
					type: "custommesh3d",
					scale:[zoom3d,zoom3d,zoom3d*2],
					create: function(callback){						
						createPiece3D(this,callback);
					},
					z:$this.g.pieceZ0,
				}
			});
			
			xdv.createGadget("clicker#"+r+"#"+c,{
				base:{
					x: coords.x,
					y: coords.y,						
				},
				"2d": {
					z: 103,
					x: coords2d.x,
					y: coords2d.y,
					width:$this.g.CSIZE_2D,				
					height:$this.g.CSIZE_2D,				
					type: "element",
					css: {
						"background-image": "url("+fullPath+"/res/xd-view/select-target-2d.png)",
						"background-size": "contain",
						"cursor": "pointer"
					}
				},
				"3d": {
					type: "meshfile",
					file : fullPath+"/res/xd-view/ring-target.js",
					flatShading: true,
					castShadow: true,
					smooth : 0,
					z: 0,
					scale:[zoom3dselect,zoom3dselect,1],
					materials: { 
						"square" : {
							transparent: true,
							opacity: 0,
						},
						"ring" : {
							color : 0xdddddd,
							opacity: 1,
						}
					},
				}
			});
		}
	}

	View.Game.rCreateScreen = function(videoTexture) {
		// flat screens
		var gg=new THREE.PlaneGeometry(4,3,1,1);
		var gm=new THREE.MeshPhongMaterial({map:videoTexture,shading:THREE.FlatShading});
		var mesh = new THREE.Mesh( gg , gm );
		this.objectReady(mesh); 
		return null;
	}
	
	View.Game.rCreateScreens = function(xdv) {
		var $this=this;
		xdv.createGadget("videoa",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return $this.rCreateScreen.call(this,videoTexture);
				},
			},
		});
		xdv.createGadget("videoabis",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return $this.rCreateScreen.call(this,videoTexture);
				},
			},
		});
		xdv.createGadget("videob",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return $this.rCreateScreen.call(this,videoTexture);
				},
			},
		});	
		xdv.createGadget("videobbis",{
			"3d": {
				type : "video3d",				
				makeMesh: function(videoTexture){
					return $this.rCreateScreen.call(this,videoTexture);
				},
			},
		});
	}

	View.Game.xdBuildScene = function(xdv){

		xdv.updateGadget("pass-board-w",{
			base: {
				visible: false,
			}
		});
		xdv.updateGadget("pass-board-b",{
			base: {
				visible: false,
			}
		});
		xdv.updateGadget("board",{
			"base": {
				visible: !this.mNotation,
			}
		});
		xdv.updateGadget("boardNotations",{
			"base": {
				visible: this.mNotation,
			}
		});
		
		for (var r=0; r<this.g.NBROWS; r++){		
			for (var c=0; c<this.g.NBCOLS; c++){
				xdv.updateGadget("piece#"+r+"#"+c, {	
					"2d": {
						visible : true,
					},
					"3d": {
						visible : true,
						flatShading:false,
					} 
				});
				xdv.updateGadget("clicker#"+r+"#"+c, {	
					"base": {
						visible : false,
					} 
				});
			}
		}		
		
		// webRTC screens
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
		
	}		
	View.Board.sideToAngle = function(side){
		if (side==1) return 180;
		return 0;
	}
	View.Board.clipX = function(side){
		if (side==1) return 200;
		return 0;
	}
	View.Board.xdDisplay = function(xdv, aGame) {
		
		//console.info("freeClose",this.freeClose);
		
		var $this=this;
		
		for(var pos in aGame.g.confine) {
			var rc=aGame.RC(pos);
			var r=rc.r, c=rc.c;
			var rot= aGame.mBoard.board[pos]<0?180:0; //Math.round(Math.random())*180; // 
			xdv.updateGadget("piece#"+r+"#"+c, {
				"2d":{
					visible : aGame.mBoard.board[pos] != 0 ,
					clipx: $this.clipX(aGame.mBoard.board[pos]),
				},					
				"3d": {
					visible : aGame.mBoard.board[pos] != 0 ,
					rotateX: $this.sideToAngle(aGame.mBoard.board[pos]),
				} 
			});
		}
		xdv.updateGadget("scoreboardA",{
			"base": {
				visible: true,
			}
		});
		xdv.updateGadget("scoreboardB",{
			"3d": {
				visible: true,
			}
		});
		aGame.refreshScore(xdv,aGame.mBoard.counts[0],aGame.mBoard.counts[1]);
	}
	
	
	View.Board.reversiAnimateMove = function(xdv, aGame, r, c, callback) {
		var $this=this;
		var Z0=aGame.g.pieceZ0;	
		var Z1=aGame.g.CSIZE/2;	
		var captured=[];
		var animCount=0;
		var duration=400;

		var b=aGame.mBoard;
		var ob=aGame.mOldBoard;
		
		var nbToRestore=0;
		
		function EndAnim() {
						
			function Finalize(){
				nbToRestore--;
				if (nbToRestore==0)
					callback();
			}
			
			//aGame.PlaySound("tac"+(1+Math.floor(Math.random()*3)));
			if (animCount < captured.length){
				var locR=captured[animCount].row;
				var locC=captured[animCount].col;
				animCount++;

				// update score
				if (b.mWho==1){
					aGame.refreshScore(xdv,ob.counts[0]+1+animCount,ob.counts[1]-animCount);				
				}else{					
					aGame.refreshScore(xdv,ob.counts[0]-animCount,ob.counts[1]+1+animCount);				
				}

				xdv.updateGadget("piece#"+locR+"#"+locC,{ 
					"2d": {
						clipx: $this.clipX(b.board[aGame.POS(locC,locR)]),
						opacity: 0.5,				
					},
					"3d": { 
						rotateX: $this.sideToAngle(b.board[aGame.POS(locC,locR)]),
						z: Z1 
					}
				}, Math.max(50,500/captured.length), EndAnim);				
			}else{
				nbToRestore=captured.length;
				for (var i=0;i<captured.length;i++){
					var locR=captured[i].row;
					var locC=captured[i].col;
					xdv.updateGadget("piece#"+locR+"#"+locC,{ 
						"2d":{
							opacity: 1,
						},
						"3d": { 
							z: Z0 
						}
					}, 400, Finalize);									
				}
				//callback();			
			}
		}

		
		
		function turnCaptured(){

			for (var row=0; row<aGame.g.NBROWS; row++){		
				for (var col=0; col<aGame.g.NBCOLS; col++){
					if (b.board[aGame.POS(col,row)] != ob.board[aGame.POS(col,row)]) {
						if ((row==r)&&(col==c)){
							continue;
						}
						captured.push({row:row,col:col});
					}
				}
			}
			
			//console.info("captured",captured);
					
			EndAnim();
		}
		
		
		if (b.lastMove){
			// put the hidden piece on the wrong side to make it flip  
			xdv.updateGadget("piece#"+b.lastMove.row+"#"+b.lastMove.col,{
				"2d":{
					//clipx: $this.clipX(-1*b.board[b.lastMove.row][b.lastMove.col]),
					visible: true,
					opacity: 0,					
				},
				"3d":{
					rotateX: $this.sideToAngle(-1*b.board[aGame.POS(b.lastMove.col,b.lastMove.row)]),
					z: Z0,
				}
			});
		}
		// make the new piece pop up in the game
		xdv.updateGadget("piece#"+r+"#"+c,{
			"2d":{
				clipx: $this.clipX(b.board[aGame.POS(b.lastMove.col,b.lastMove.row)]),
				clipy: 200,
				opacity: 1,
			},
			"3d":{
				rotateX: $this.sideToAngle(b.board[aGame.POS(b.lastMove.col,b.lastMove.row)]),
				z: Z1,
				visible: true,
			}
		},200,function(){
			// update score
			if (b.mWho==1){
				aGame.refreshScore(xdv,ob.counts[0]+1,ob.counts[1]);				
			}else{					
				aGame.refreshScore(xdv,ob.counts[0],ob.counts[1]+1);				
			}
			// push down piece and call for captures animation
			xdv.updateGadget("piece#"+r+"#"+c,{
				"2d":{
					clipy: 0,
				},
				"3d":{				
					z: Z0,
					}
				},200,turnCaptured);
			}	
		);
	}
	
	View.Board.xdBuildHTStateMachine = function(xdv, htsm, aGame) {
		var $this=this;
		var move={};
				
		function SelectTo(args){

			function Click(r,c) {				
				htsm.smQueueEvent("E_CLICK",{row:r,col:c});
			}

			$this.mMoves.forEach(function(move) {
				if(move.pass){
					htsm.smQueueEvent("E_PASS",{row:-1,col:-1,pass:true});
				}else{
					(function(r,c){					
						xdv.updateGadget("clicker#"+r+"#"+c,{
							"base":{
								visible:true,
								castShadow: aGame.mShowMoves,
								click: function(){
									Click(r,c);
								},
							},
							"2d":{								
								opacity: aGame.mShowMoves?1:0,								
							},
							"3d":{
								materials: {
									"ring": {
										opacity: aGame.mShowMoves?1:0,
										transparent: aGame.mShowMoves?false:true,
									},
									"square" : {
										transparent: true,
										opacity: 0,
									},									
								},								
							}
						});				
					})(move.row,move.col);					
				}
			});
		}
		function Clean(args){
			for (var r=0; r<aGame.g.NBROWS; r++){		
				for (var c=0; c<aGame.g.NBCOLS; c++){
					xdv.updateGadget("clicker#"+r+"#"+c,{
						"base":{
							visible:false,
							click: null,
						},
					});				
				}
			}			
		}
		function SaveTo(args) {
			move.row=args.row;
			move.col=args.col;
		}
		function SendMove(args) {
			aGame.MakeMove(move);
		}
		function SendPass(args) {
			aGame.MakeMove({pass:true});
		}
		function Animate(args) {
				htsm.smQueueEvent("E_ANIMATED",{});
		}
		htsm.smTransition("S_INIT", "E_INIT", "S_SELECT_TO", [ ]);
		htsm.smEntering("S_SELECT_TO",[SelectTo]);
		htsm.smLeaving("S_SELECT_TO",[Clean]);
		htsm.smTransition("S_SELECT_TO", "E_PASS", "S_DONE", [ SendPass ]);
		htsm.smTransition("S_SELECT_TO", "E_CLICK", "S_ANIMATE", [ SaveTo , Animate ]);
		htsm.smTransition("S_ANIMATE", "E_ANIMATED", "S_DONE", [ SendMove ]);
		htsm.smEntering("S_DONE",[Clean]);
		htsm.smTransition(["S_SELECT_TO","S_ANIMATE"], "E_END", "S_DONE", [ ]);
		htsm.smTransition("S_DONE", "E_END", null, [ ]);		
		
	}	
	
	View.Board.xdPlayedMove = function(xdv, aGame, aMove) {
		
		function passAnim(passBoard,callback){
			xdv.updateGadget(passBoard,{
				base: {
					visible: true,
					opacity:0,
				}
			});
			
			function switchOff(){
				xdv.updateGadget(passBoard,{
					base: {
						opacity:0,
					}
				},200,function(){
					xdv.updateGadget(passBoard,{
						base: {
							visible: false,
						}
					});
					callback();
				});
				
			}
			xdv.updateGadget(passBoard,{
				base: {
					opacity:1,
				}
			},200, function(){
				xdv.updateGadget(passBoard,{
					base: {
						opacity:0.99,
					}
				},1000,switchOff);
			});
		}

		if (aMove.pass){
			var passBoard=this.mWho==1?"pass-board-b":"pass-board-w";
			passAnim(passBoard,function(){
				aGame.MoveShown();
			});			
		}else{			
			aGame.mOldBoard.reversiAnimateMove(xdv,aGame,aMove.row,aMove.col,function() {
				aGame.MoveShown();
			});
		}
	}

})();
