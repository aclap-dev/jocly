
(function() {
	
	var JOCLY_FIELD_SIZE=12000; // physical space

	var NBCOLS=0, NBROWS=0, CSIZES={};
	
	View.Game.cbTargetMesh = "/res/ring-target-cylinder-v2.js";
	View.Game.cbTargetSelectColor = 0x338800; //0xff8800;
	View.Game.cbTargetCancelColor = 0xff8800; //0x884400;

	View.Game.cbCylinderEnsureConstants =function() {
		if(NBROWS)
			return;
		NBROWS=this.cbVar.geometry.height;
		NBCOLS=this.cbVar.geometry.width;
	}
	
	var superCbSize = View.Game.cbCSize; 
	
	// 'this' is a Game object
	View.Game.cbCSize =function(boardSpec) {
		this.cbCylinderEnsureConstants();
		
		if(!boardSpec.cylinder)
			return superCbSize.apply(this,arguments);
		
		var cSize=CSIZES[boardSpec.margins.x+"_"+boardSpec.margins.y];
		if(!cSize) {

			var ratio,width,height,cellSize;
			
			var relWidth = NBCOLS+2*boardSpec.margins.x;
			var relHeight = NBROWS+2*boardSpec.margins.y;
			
			ratio =  relWidth / relHeight;
			if(ratio<1)
				cellSize = (JOCLY_FIELD_SIZE * ratio) / relWidth;
			else 
				cellSize = (JOCLY_FIELD_SIZE / ratio) / relHeight;
			width = (NBCOLS+2*boardSpec.margins.x) * cellSize;
			height= (NBROWS+2*boardSpec.margins.y) * cellSize;
			
			//console.log("width",width,"height",height,"NBCOLS",NBCOLS,"NBROWS",NBROWS,"ratio",ratio)
			
			var a = 2 * Math.PI / NBCOLS;
			var cx = cellSize/1000;
			var cosA = Math.cos(a);
			var d = 4 * cosA * cosA + 4 * cx * cx; 
			var radius = cosA + Math.sqrt(d) / 2; 

			/* useful ?
			var pieceCx=1.0*cx;			
			var pieceCy=pieceCx/1.0;
			if (pieceCy>pieceScale2D*cy){
				pieceCy=pieceScale2D*cy;
				pieceCx=this.g.pieceRatio*cy;
			}
			*/
			cSize={
				cx:cellSize,
				cy:cellSize,
				pieceCx:cellSize,
				pieceCy:cellSize,
				ratio: ratio,
				width: width,
				height: height,
				radius: radius,
				innerRadius: radius * Math.cos(a/2),
				angle: a,
				cosAngle: Math.cos(a),
				sinAngle: Math.sin(a),
			}
			console.log("CSIZE",boardSpec.margins.x+"_"+boardSpec.margins.y,cSize)
			CSIZES[boardSpec.margins.x+"_"+boardSpec.margins.y]=cSize;
		}
		return cSize;
	}
	
	View.Game.cbCylinderBoard = $.extend({},View.Game.cbBaseBoard,{
		
		notationMode: "in",
		cylinder: true,
		colShift: .5,
		
		// 'this' is a Game object
		coordsFn: function(boardSpec) {
			
			boardSpec = boardSpec || {};
			boardSpec.margins = boardSpec.margins || {x:0,y:0};
			
			return function(pos) {
				var cSize = this.cbCSize(boardSpec);

				var c=pos%NBCOLS;
				var r=(pos-c)/NBCOLS;
				var xb, yb;
				if(this.mViewAs==1) {
					r = NBROWS-1-r;
					xb = (c-(NBCOLS-1)/2)*cSize.cx;
					yb = (r-(NBROWS-1)/2)*cSize.cy;
					c = NBCOLS-1-c;
					c = (c+2)%NBCOLS;
				} else {
					xb = ((NBCOLS-c-1)-(NBCOLS-1)/2)*cSize.cx;
					yb = (r-(NBROWS-1)/2)*cSize.cy;
					c = (c+2)%NBCOLS;					
				}
				var coords={	
					x: cSize.innerRadius * 1.02 * Math.cos(cSize.angle * (c+boardSpec.colShift)) * 1000,
					y: cSize.innerRadius * 1.02 * Math.sin(cSize.angle * (c+boardSpec.colShift)) * 1000,
					z: cSize.cy * (NBROWS/2 - 1/2 - r),
					ry: cSize.angle * (c+boardSpec.colShift) * 180 / Math.PI - 90,
					rx: 90,
					rz: 0,
					xb: xb,
					yb: yb,
				};

				return coords;
			}
		},
		
		easingFn: function(boardSpec) {
			return function(ratio) {
				console.log("easing",ratio);
				debugger;
			}		
		},
		
		createGeometry: function(spec,callback) {
			var cSize = this.cbCSize(spec);
			
			var cx = cSize.cx / 1000;
			var geo = new THREE.CylinderGeometry(cSize.radius,cSize.radius,cx * NBROWS, NBCOLS, cx * NBROWS,true);
			/*
			var matrix = new THREE.Matrix4();
			matrix.makeRotationX(-Math.PI/2)
			geo.applyMatrix(matrix);
			*/
			
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

		/*
		paintBackground: function(spec,ctx,images,channel,bWidth,bHeight) {
			if (images['boardBG'])
				ctx.drawImage(images['boardBG'],-bWidth/2,-bHeight/2,bWidth,bHeight);				
		},
		*/		

		paintChannel: function(spec,ctx,images,channel) {
			var cSize = this.cbCSize(spec);
			//spec.paintBackground.call(this,spec,ctx,images,channel,cSize.width,cSize.height);			
		},
		
		paint: function(spec,canvas,images,callback) {
			for(var channel in canvas) {
				var ctx=canvas[channel].getContext('2d');
				ctx.save();
				ctx.scale(spec.TEXTURE_CANVAS_CX/JOCLY_FIELD_SIZE,spec.TEXTURE_CANVAS_CY/JOCLY_FIELD_SIZE);
				ctx.translate(JOCLY_FIELD_SIZE/2,JOCLY_FIELD_SIZE/2);
				spec.paintChannel.call(this,spec,ctx,images,channel);
				ctx.restore();
			}
			callback();
		},


	});

	View.Game.cbCylinderBoardClassic = $.extend({},View.Game.cbCylinderBoard,{
		'margins': { x:0, y:0 },
		'colorFill' : {		
			".": "rgba(255,255,255,1)", // "white" cells
			"#": "rgba(0,0,0,1)", // "black" cells
			" ": "rgba(0,0,0,0)",
		},
		'texturesImg' : {
			'boardBG' : '/res/images/wood.jpg',
		},
		'extraChannels':[ // in addition to 'diffuse' which is default
  			'bump'
  		],
		
		paintCell: function(spec,ctx,images,channel,cellType,xCenter,yCenter,cx,cy) {
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = 15;
			if (channel=='bump')
				ctx.fillStyle="#ffffff";
			else
				ctx.fillStyle=spec.colorFill[cellType];
			ctx.fillRect(xCenter-cx/2,yCenter-cy/2,cx,cy);
			ctx.rect(xCenter-cx/2,yCenter-cy/2,cx,cy);
		},
		
		paintCells: function(spec,ctx,images,channel) {
			var cSize = this.cbCSize(spec);
			var getCoords=spec.coordsFn(spec);
			for(var row=0;row<NBROWS;row++) {
				for(var col=0;col<NBCOLS;col++) {
					var pos = this.mViewAs==1 ?
						col+row*NBCOLS :
						NBCOLS*NBROWS-(1+col+row*NBCOLS);
					var coords=getCoords.call(this,pos);
					var cellType=this.cbView.boardLayout[NBROWS-row-1][col];
					var xCenter=coords.xb;
					var yCenter=coords.yb;
					var cx=cSize.cx;
					var cy=cSize.cy;
					
					spec.paintCell.call(this,spec,ctx,images,channel,cellType,xCenter,yCenter,cx,cy);
				}
			}
		},
		
		paintChannel: function(spec,ctx,images,channel) {
			var cSize = this.cbCSize(spec);
			//spec.paintBackground.call(this,spec,ctx,images,channel,cSize.width,cSize.height);
			spec.paintCells.call(this,spec,ctx,images,channel)
			if(this.mNotation)
				spec.paintNotation.call(this,spec,ctx,channel);
		},
		
		paintNotation: function(spec,ctx,channel) {
			var cSize = this.cbCSize(spec);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = "#000000";
			ctx.font = Math.ceil(cSize.cx / 3) + 'px Monospace';
			switch(spec.notationMode) {
			case "out":
				spec.paintOutNotation.apply(this,arguments);
				break;
			case "in":
				spec.paintInNotation.apply(this,arguments);
				break;
			}
		},
		
		paintOutNotation: function(spec,ctx,channel) {
			var cSize = this.cbCSize(spec);
			for (var row = 0; row < NBROWS; row++) {
				var displayedRow = NBROWS - row;
				if(this.mViewAs<0)
					displayedRow=row+1;
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
		
		paintInNotation: function(spec,ctx,channel) {
			var cSize = this.cbCSize(spec);
			var getCoords=spec.coordsFn(spec);
			var fills=spec.colorFill;
			ctx.font = Math.ceil(cSize.cx / 5) + 'px Monospace';
			for (var row = 0; row < NBROWS; row++) {
				for (var col = 0; col < NBCOLS; col++) {
					var displayedRow=NBROWS - row;
					var displayedCol=col;
					if(this.mViewAs<0)
						displayedCol = NBCOLS - col -1;
					else
						displayedRow=row+1;								
					var pos = this.mViewAs==1 ?
							col+row*NBCOLS :
							NBCOLS*NBROWS-(1+col+row*NBCOLS);
					var coords=getCoords.call(this,pos);
					ctx.fillStyle="rgba(0,0,0,0)";
					if(channel=="bump")
						ctx.fillStyle = fills["."];
					switch(this.cbView.boardLayout[NBROWS-row-1][col]) {
					case ".":
						ctx.fillStyle= (channel=="bump") ? fills["."] : fills["#"];
						break;
					case "#":
						ctx.fillStyle=fills["."];
						break;
					}
					var x = coords.xb-cSize.cx / 3;
					var y = coords.yb-cSize.cy / 3;
					if(spec.notationDebug)
						ctx.fillText(pos,x,y);
					else
						ctx.fillText(String.fromCharCode(97 + displayedCol) + displayedRow,x,y);
				}
			}
		},
		
		createMaterial: function(spec,canvas,callback) {
			var texBoardDiffuse = new THREE.Texture(canvas.diffuse);
			texBoardDiffuse.needsUpdate = true;
			var matSpec={
				specular: '#050505',
				emissive: '#000000',
				shininess: 20,
				shading: THREE.FlatShading,
				map: texBoardDiffuse,
			}
			if(canvas.bump) {
				var texBoardBump = new THREE.Texture(canvas.bump);
				texBoardBump.needsUpdate = true;
				matSpec.bumpMap = texBoardBump;
				matSpec.bumpScale = 0.1;
			}
			var material=new THREE.MeshPhongMaterial(matSpec);
			material.side = THREE.DoubleSide;
			material.opacity=1;
			//material.transparent=true;										
			callback(material);
		},


		
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
				while(ng2<ng0)
					ng2+=2*Math.PI;
				if(ng2-ng0>Math.PI)
					ng2 -= 2 * Math.PI;

				var radius0 = Math.sqrt(spec.y*spec.y+spec.x*spec.x);
				var radius2=radius0;
				var radius1=radius0+1500;
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
					var x = radius * Math.cos(ng) * this.SCALE3D;
					var z = radius * Math.sin(ng) * this.SCALE3D;
					this.object3d.position.x=x;
					this.object3d.position.z=z;
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


	
})();
