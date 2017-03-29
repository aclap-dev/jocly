(function() {
	
	
	// Reducing the promo frame which was overflowing the board screen
	View.Game.cbPromoSize = 1500;
	
	View.Game.cbCreatePromo = function(xdv) {
		xdv.createGadget("promo-board",{
			base: {
				type: "element",
				x: 0,
				y: 0,
				width: 1500,
				height: 1500,
				z: 108,
				css: {
					"background-color": "white",
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
	
	// needed for new canvas for repainting bicolor pieces parts
	var CANVAS_SIZE = 512 ;
	
	// musketeer geometry, rows from 0 to 9
	var geometry=Model.Game.cbBoardGeometryGrid(8,10);
	
	// positions of selected pieces
	var startPosW1 = 31 ;
	var startPosW2 = 39 ;
	var startPosB1 = 40 ;
	var startPosB2 = 48 ;
	
	function colOffsetX(pos) {return geometry.C(pos)-geometry.width/2+0.5;} 
	function rowOffsetY(pos) {return -geometry.R(pos)+geometry.width/2+0.5;} 
		
	// 3d bicolor pieces texture painting. Using 2 materials named "mat0" and "mat1"	
	function paint2PartsTextureImageClip(side,spec,ctx,material,channel,channelData,imgKey,image,clip,resources) {
				
		
		var cx=ctx.canvas.width;
		var cy=ctx.canvas.height;
		
		if ( ((side == "1") && (material == "mat0")) || ((side == "-1") && (material == "mat1")) ) {
			// white
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
			else{	
				ctx.drawImage(image,clip.x,clip.y,clip.cx,clip.cy,0,0,cx,cy);			
			}
		}else{
			// black	
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
		}

	}
	
	blackPhongParams = {
		specular: 0x222222,
		shininess : 100  
	};
	textureCanvasSz = { cx : CANVAS_SIZE , cy : CANVAS_SIZE } ;
	
	// extending fairy pieces with musketeer new pieces
	View.Game.cbFairyMusketeerPieceStyle3D = $.extend(true,{},View.Game.cbFairyPieceStyle3D,{
		/* 
		 * 
		 * blender note: for 2 materials pieces, generate one single piece , parts are defined by assigned materials  
		 *  
		 * 
		 * 
		 */
		
		"default":{
			
			// to take into account the need of multi material feature (MultiMaterial)
			makeMaterial: function(spec,resources) {
				
	    		
				var pieceMaterials=[];
				
				for (var material in spec.materials) {

					var phongParams = spec.materials[material].params ;
					phongParams.map = resources.textures[material]['diffuse'] ;
					phongParams.normalMap = resources.textures[material]['normal'] ;
					var ns = spec.materials[material].channels['normal'].normalScale || 1;
					phongParams.normalScale = new THREE.Vector2( ns , ns ) ;
					
					var newMat = new THREE.MeshPhongMaterial( phongParams );
					pieceMaterials.push(newMat);
					
				}
				
				resources.material=new THREE.MultiMaterial(pieceMaterials);
				
				resources.geometry.mergeVertices()
				resources.geometry.computeVertexNormals(); // needed in normals not exported in js file!


			},
			
			makeMaterials: function(spec,resources) {
				resources.textures={};
		    	for (var m in spec.materials) {
		    		resources.textures[m]={}
		    		spec.makeMaterialTextures.call(this,spec,m,resources)
		    	}
    			spec.makeMaterial.call(this,spec,resources);
			},			
		},		
		"-1":{
			'default': {
				materials:{
					mat0:{						
						params : {
							specular: 0x050505,
							shininess : 100 , 
						},
					},
				},
				paintTextureImageClip: function(spec,ctx,material,channel,channelData,imgKey,image,clip,resources) {
					paint2PartsTextureImageClip("-1",spec,ctx,material,channel,channelData,imgKey,image,clip,resources);
				},
			},
		},				
		"1":{
			'default': {
					paintTextureImageClip: function(spec,ctx,material,channel,channelData,imgKey,image,clip,resources) {
						paint2PartsTextureImageClip("1",spec,ctx,material,channel,channelData,imgKey,image,clip,resources);
				}
			},
		},
		
			"fr-leopard": {
				mesh: { 
					jsFile:"/res/musketeer/leopard.js" 
				},
	
				materials: {
					mat0: {
						channels: {
							diffuse: {
								texturesImg: {
									diffImg : "/res/musketeer/leopard-diffusemap.jpg",
								}
							},
							normal: {
								texturesImg: {
									normalImg: "/res/musketeer/leopard-normalmap.jpg", 
								}
							}
						}
					}
					 
				}
			},
		
			"fr-fortress": {
				mesh: { 
					jsFile:"/res/musketeer/fortress.js" 
				},
	
				materials: {
					mat0: {
						channels: {
							diffuse: {
								texturesImg: {
									diffImg : "/res/musketeer/fortress-diffusemap.jpg",
								}
							},
							normal: {
								texturesImg: {
									normalImg: "/res/musketeer/fortress-normalmap.jpg", 
								}
							}
						}
					}
					 
				}
			},
		
			"fr-mdd": {
				mesh: { 
					jsFile:"/res/musketeer/dragon-musketeer.js" 
				},
	
				materials: {
					mat0: {
						channels: {
							diffuse: {
								texturesImg: {
									diffImg : "/res/musketeer/dragon-musketeer-diffusemap.jpg",
								}
							},
							normal: {
								texturesImg: {
									normalImg: "/res/musketeer/dragon-musketeer-normalmap.jpg", 
								}
							}
						}
					}
					 
				}
			},
		
			"fr-spider": {
				mesh: { 
					jsFile:"/res/musketeer/spider.js" 
				},
	
				materials: {
					mat0: {
						channels: {
							diffuse: {
								texturesImg: {
									diffImg : "/res/musketeer/spider-diffusemap.jpg",
								}
							},
							normal: {
								texturesImg: {
									normalImg: "/res/musketeer/spider-normalmap.jpg", 
								}
							}
						}
					}
					 
				}
			},
				
	});
	
	View.Game.cbDefineView = function() {

		var musketeerBoardDelta = {
			//notationMode: "in",
			//notationDebug: true,

			// specific musketeer board painting
			paintLines:function(spec,ctx,images,channel) {
				var cSize = this.cbCSize(spec);
				ctx.strokeStyle = "#000000";
				ctx.lineWidth = 40;
				ctx.beginPath();
				ctx.moveTo(-cSize.cx*4,-cSize.cy*5);
				ctx.lineTo(cSize.cx*4,-cSize.cy*5);
				ctx.lineTo(cSize.cx*4,cSize.cy*5);
				ctx.lineTo(-cSize.cx*4,cSize.cy*5);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(-cSize.cx*4,-cSize.cy*4);
				ctx.lineTo(cSize.cx*4,-cSize.cy*4);
				ctx.closePath();
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(-cSize.cx*4,cSize.cy*4);
				ctx.lineTo(cSize.cx*4,cSize.cy*4);
				ctx.closePath();				
				ctx.stroke();
				
			},
            
            paintOutNotation: function(spec,ctx,channel) {
                var NBROWS=this.cbVar.geometry.height;
		        var NBCOLS=this.cbVar.geometry.width;

                var cSize = this.cbCSize(spec);
                for (var row = 0; row < NBROWS; row++) {
                    var displayedRow = NBROWS - row - 1;
                    if(this.mViewAs<0)
                        displayedRow=row;
                    var x = -(NBCOLS/2 + spec.margins.x/2) * cSize.cx;
                    var y = (row-NBROWS/2+.5) * cSize.cy;
                    ctx.fillText(displayedRow, x, y);	
                }
                for (var col = 0; col < NBCOLS; col++) {
                    var displayedCol=col;
                    if(this.mViewAs<0)
                        displayedCol = NBCOLS - col -1;
                    var x = (col-NBCOLS/2+.5) * cSize.cx;
                    var y = (NBROWS/2 + spec.margins.y/2) * cSize.cy;
                    ctx.fillText(String.fromCharCode(97 + displayedCol), x , y);
                }
            },            
		};		
		
		musketeerBoardDelta3d = $.extend(true,{},musketeerBoardDelta,
				{
					'colorFill' : {
						".": "rgba(160,150,150,0.9)", // white cells
						"#": "rgba(0,0,0,1)", // "black" cells
						" ": "rgba(160,150,150,0.5)",
					}
				}
		);

		musketeerBoardDelta2d = $.extend(true,{},musketeerBoardDelta, 
			{
				'colorFill' : {
					".": "#F1D9B3", // "white" cells
					"#": "#C7885D", // "black" cells
					" ": "rgba(241,217,179,.5)",
				}
			}
		);
		
		var musketeerBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,musketeerBoardDelta3d);
		var musketeerBoard2d = $.extend(true,{},this.cbGridBoardClassic2DMargin,musketeerBoardDelta2d);
		var musketeerIconesOffset= 1900 ; // in case we use the resource with all icons in a single file, 1 line for whites, 1 line for blacks
		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,musketeerBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,musketeerBoard3d),
			},
			boardLayout: [
	     		"        ",
	      		".#.#.#.#",
	     		"#.#.#.#.",
	      		".#.#.#.#",
	     		"#.#.#.#.",
	      		".#.#.#.#",
	     		"#.#.#.#.",
	      		".#.#.#.#",
	     		"#.#.#.#.",
	      		"        ",
			],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(musketeerBoard2d),										
				},
				"3d": {
					display: this.cbDisplayBoardFn(musketeerBoard3d),					
				},
			},
			clicker: {
				"2d": {
					width: 1100,
					height: 1100,
				},
				"3d": {
					scale: [.75,.75,.75],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"fr-pawn":{ // overload so that pawn uses same resource than musketer pieces to avoids an update bug at promotion time			
					"2d": {
						file: this.mViewOptions.fullPath + "/res/musketeer/wikipedia-fairy-musketeer-all-sprites.png",
						clipx : 0,
					}
				},
				"default": {
					"3d": {
						scale: [.5,.5,.5],
						display: this.cbDisplayPieceFn(this.cbFairyMusketeerPieceStyle3D)
					},
				},
									"fr-leopard" :{
						"2d": {
							file: this.mViewOptions.fullPath + "/res/musketeer/wikipedia-fairy-musketeer-all-sprites.png",
							clipx : 1800+musketeerIconesOffset,
						}
					},
									"fr-fortress" :{
						"2d": {
							file: this.mViewOptions.fullPath + "/res/musketeer/wikipedia-fairy-musketeer-all-sprites.png",
							clipx : 1200+musketeerIconesOffset,
						}
					},
									"fr-mdd" :{
						"2d": {
							file: this.mViewOptions.fullPath + "/res/musketeer/wikipedia-fairy-musketeer-all-sprites.png",
							clipx : 0+musketeerIconesOffset,
						}
					},
									"fr-spider" :{
						"2d": {
							file: this.mViewOptions.fullPath + "/res/musketeer/wikipedia-fairy-musketeer-all-sprites.png",
							clipx : 600+musketeerIconesOffset,
						}
					},
							}),
		};
	}

	/* Make the knight jump when moving */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		if(this.setupState===undefined || this.setupState!="done")
			return Math.max(zFrom,zTo)+3000;
					
		if(("_N_Le_Fo_Dr_Sp_U_H_E_Ch_Ar_Ca_".indexOf("_"+aMove.a+"_")>=0) && (aGame.g.distGraph[aMove.f][aMove.t]>1))
			return Math.max(zFrom,zTo)+2000;
		else
			return (zFrom+zTo)/2;
	}
	/*
	 * View.Board.xdDisplay overriding to prevent displaying black xtra pieces before setup
	 */
	var SuperViewBoardxdDisplay = View.Board.xdDisplay;
	View.Board.xdDisplay = function(xdv, aGame) {
		var size = 1060; 
		SuperViewBoardxdDisplay.apply(this,arguments);
        xdv.updateGadget("selection-posW1",{
			"base":{
				visible: (this.setupState===undefined),
				x: aGame.mViewAs > 0 ? size*colOffsetX(startPosW1) : -size*colOffsetX(startPosW1),
				y: aGame.mViewAs > 0 ? size*rowOffsetY(startPosW1) : -size*rowOffsetY(startPosW1), 
			}
		});
        xdv.updateGadget("selection-posB1",{
			"base":{
				visible: (this.setupState===undefined) ,
				x: aGame.mViewAs > 0 ? size*colOffsetX(startPosB1) : -size*colOffsetX(startPosB1),
				y: aGame.mViewAs > 0 ? size*rowOffsetY(startPosB1) : -size*rowOffsetY(startPosB1), 
			}
		});
        xdv.updateGadget("selection-posW2",{
			"base":{
				visible: ((this.setupState===undefined) || (this.setupState == "setup1_0")),
				x: aGame.mViewAs > 0 ? size*colOffsetX(startPosW2) : -size*colOffsetX(startPosW2),
				y: aGame.mViewAs > 0 ? size*rowOffsetY(startPosW2) : -size*rowOffsetY(startPosW2), 				
			}
		});
        xdv.updateGadget("selection-posB2",{
			"base":{
				visible: ((this.setupState===undefined) || (this.setupState == "setup1_0")) ,
				x: aGame.mViewAs > 0 ? size*colOffsetX(startPosB2) : -size*colOffsetX(startPosB2),
				y: aGame.mViewAs > 0 ? size*rowOffsetY(startPosB2) : -size*rowOffsetY(startPosB2), 
			}
		});
		
		xdv.updateGadget("selection-board",{
			"base":{
				visible: ((this.setupState===undefined) || (this.setupState != "done")) 
			}
		});
		xdv.updateGadget("board",{
			"base":{
				visible: !((this.setupState===undefined) || (this.setupState == "setup1_0")) 
			}
		});

		if(this.setupState===undefined || this.setupState=="setup1_0") {
			
			for (var idx in this.pieces){
				var piece = this.pieces[idx];
				var abbrev = aGame.g.pTypes[piece.t].abbrev ;
				if ("KQRBNP".indexOf(abbrev)>=0){
					xdv.updateGadget("piece#"+idx,{
						"base":{
							opacity: 0.0, 
						},
						"3d":{
							scale: [0.0001,0.0001,0.0001] // do not use 0, it leads to Matrix errors
						}
					});										
				}
			}
		}
		if(this.setupState=="setup2_0" || this.setupState=="setup2_1" || this.setupState=="setup2_2" || this.setupState=="setup2_3") {
			
			for (var idx in this.pieces){
				var piece = this.pieces[idx];
				var abbrev = aGame.g.pTypes[piece.t].abbrev ;
				if ("KQRBNP".indexOf(abbrev)>=0){
					xdv.updateGadget("piece#"+idx,{
						"base":{
							opacity: 0.5, 
						},
						"3d":{
							scale: [0.2,0.2,0.2]
						}
					});										
				}
			}
		}
	}		
	
	/*var SuperViewGamexdBuildScene = View.Game.xdBuildScene ;
	View.Game.xdBuildScene = function(xdv) {
		SuperViewGamexdBuildScene.apply(this,arguments);
		var $this = this ;
		xdv.updateGadget("selection-board",{
			"base":{
				visible: (($this.mBoard.setupState===undefined) || ($this.mBoard.setupState != "done")) 
			}
		});
	}*/
	

	/*
	 * View.Game.xdInit overriding to create initial setup gadgets 
	 */
	var SuperViewGameXdInit = View.Game.xdInit;
	View.Game.xdInit = function(xdv) {
		var size = 1060;
		var $this=this;
		SuperViewGameXdInit.apply(this,arguments);
		
		function createSelectArea3D(thisGadget,relPath){
			thisGadget.getResource("image|"+$this.mViewOptions.fullPath + relPath, function(image){
				
				var c=document.createElement('canvas');
				c.width=c.height=CANVAS_SIZE;
				var ctx=c.getContext("2d");
				ctx.fillStyle="#FF0000";
				ctx.fillRect(6,6,500,500); 
				THREE.ImageUtils.crossOrigin = "anonymous";
				ctx.drawImage(image,0,0,CANVAS_SIZE,CANVAS_SIZE);
				
				var texture = new THREE.Texture(c);
				texture.needsUpdate = true;

				var mat2 = new THREE.MeshPhongMaterial({
					map : texture ,
				});
				var plan = new THREE.Mesh(
						new THREE.PlaneGeometry(1,1,1,1),
						mat2							
						);
				
				var empty = new THREE.Object3D();
				plan.position.y = .02;
				plan.rotation.x = -Math.PI/2;
				empty.add(plan);
				thisGadget.objectReady(empty);
			});			
		}	
		
		xdv.createGadget("selection-posW1",{
            base:{
                x:size*3.5,
                y:size*1.5,
                visible:true,
            },
            "2d":{
                type:"sprite",
                z:-1,
                file: this.mViewOptions.fullPath + "/res/musketeer/musketeer-select-1W.png",
                width:size,
                height:size,
            },          
            "3d":{
				type: "custom3d",
				scale: [1,1,1],
				create: function() {
					createSelectArea3D(this,"/res/musketeer/musketeer-select-1W.png");					
					return null;
				}
            }
    
        });
		xdv.createGadget("selection-posW2",{
            base:{
                x:size*3.5,
                y:size*0.5,
                visible:true,
            },
            "2d":{
                type:"sprite",
                z:-1,
                file: this.mViewOptions.fullPath + "/res/musketeer/musketeer-select-2W.png",
                width:size,
                height:size,
            },
            "3d":{
				type: "custom3d",
				scale: [1,1,1],
				create: function() {
					createSelectArea3D(this,"/res/musketeer/musketeer-select-2W.png");					
					return null;
				}
            }            
        });
		xdv.createGadget("selection-posB1",{
            base:{
                x:size*-3.5,
                y:size*-0.5,
                visible:true,
            },
            "2d":{
                type:"sprite",
                z:-1,
                file: this.mViewOptions.fullPath + "/res/musketeer/musketeer-select-1B.png",
                width:size,
                height:size,
            },            
            "3d":{
				type: "custom3d",
				scale: [1,1,1],
				create: function() {
					createSelectArea3D(this,"/res/musketeer/musketeer-select-1B.png");					
					return null;
				}
            }
        });	
		
		xdv.createGadget("selection-posB2",{
            base:{
                x:size*-3.5,
                y:size*-1.5,
                visible:true,
            },
            "2d":{
                type:"sprite",
                z:-1,
                file: this.mViewOptions.fullPath + "/res/musketeer/musketeer-select-2B.png",
                width:size,
                height:size,
            },
            "3d":{
				type: "custom3d",
				scale: [1,1,1],
				create: function() {
					createSelectArea3D(this,"/res/musketeer/musketeer-select-2B.png");					
					return null;
				}
            }
        });
		xdv.createGadget("selection-board",{
			"base":{
				x:0,
				y:0,
				visible: true,
			},
			"3d":{
				type: "custom3d",
				scale: [1,1,1],
				create: function() {
					var geometry = new THREE.BoxGeometry(8.5,0.01,4.4);
					var blackMat = new THREE.MeshPhongMaterial({
						color: '#000000',
						shininess: 100,
						specular: '#222222',
						emissive: '#000000',
						transparent:true,
						opacity: 0.9
					});
					var cube = new THREE.Mesh( geometry, blackMat );
					return cube;					
				}
			},
			"2d":{
				type:"element",
				z:-1,
				width: size*8,
				height: size*4,
				css:{
					"background-color": "rgba(0,0,0,0)",
					/*"border" : "solid 2px black",
					"border-radius": "5px",*/
				}
			}
		});
	}
})();
