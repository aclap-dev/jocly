(function() {
	
	var JOCLY_FIELD_SIZE=12000; // physical space

	var NBCOLS=0, NBROWS=0, CSIZES={};
	
	View.Game.cbEnsureConstants =function() {
		if(NBROWS)
			return;
		NBROWS=this.cbVar.geometry.height;
		NBCOLS=this.cbVar.geometry.width;
	}
	
	// 'this' is a Game object
	View.Game.cbCSize =function(boardSpec) {
		this.cbEnsureConstants();
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
			}
			CSIZES[boardSpec.margins.x+"_"+boardSpec.margins.y]=cSize;
		}
		return cSize;
	}
	
	View.Game.cbGridBoard = $.extend({},View.Game.cbBaseBoard,{
		
		notationMode: "out", // notation outside the board
		
		// 'this' is a Game object
		coordsFn: function(boardSpec) {
			
			boardSpec = boardSpec || {};
			boardSpec.margins = boardSpec.margins || {x:0,y:0};
			
			return function(pos) {
				var cSize = this.cbCSize(boardSpec);
				var c=pos%NBCOLS;
				var r=(pos-c)/NBCOLS;
				if(this.mViewAs==1)
					r=NBROWS-1-r;
				if(this.mViewAs==-1)
					c=NBCOLS-1-c;
				var coords={
					x:(c-(NBCOLS-1)/2)*cSize.cx,
					y:(r-(NBROWS-1)/2)*cSize.cy,
					z:0,
				};
				//console.warn("coord",pos,"=",coords)
				return coords;
			}
		},
		
		createGeometry: function(spec,callback) {
			var cSize = this.cbCSize(spec);
			var cx=cSize.width/1000;
			var cy=cSize.height/1000;
			var geo = new THREE.PlaneGeometry(cx,cy);
			
			var matrix = new THREE.Matrix4();
			matrix.makeRotationX(-Math.PI/2)
			geo.applyMatrix(matrix);
			
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

		paintBackground: function(spec,ctx,images,channel,bWidth,bHeight) {
			if (images['boardBG'])
				ctx.drawImage(images['boardBG'],-bWidth/2,-bHeight/2,bWidth,bHeight);				
		},		

		paintChannel: function(spec,ctx,images,channel) {
			var cSize = this.cbCSize(spec);
			spec.paintBackground.call(this,spec,ctx,images,channel,cSize.width,cSize.height);			
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

	View.Game.cbGridBoardClassic = $.extend({},View.Game.cbGridBoard,{
		'colorFill' : {		
			".": "rgba(160,150,150,0.9)", // "white" cells
			"#": "rgba(0,0,0,1)", // "black" cells
			" ": "rgba(0,0,0,0)",
		},
		'texturesImg' : {
			'boardBG' : '/res/images/wood.jpg',
		},
		modifyMesh: function(spec,mesh,callback) {
			var cSize = this.cbCSize(spec);
			var cx=cSize.width/1000;
			var cy=cSize.height/1000;

			// add border frame
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
			
			blackMat = new THREE.MeshPhongMaterial({
				color: '#000000',
				shininess: 500,
				specular: '#888888',
				emissive: '#000000',
				//ambient: '#000000',
			});
			var frameObj = new THREE.Mesh( frameGeo , blackMat);
			frameObj.position.y=-extrudeSettings.amount-.01;
			mesh.add(frameObj);
			var bottom = new THREE.Mesh(new THREE.BoxGeometry(cx,cy,0.1),blackMat);
			bottom.rotation.x=Math.PI/2;
			bottom.position.y=-.1;
			mesh.add(bottom);
			callback(mesh);
		},
		
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
					var xCenter=coords.x;
					var yCenter=coords.y;
					var cx=cSize.cx;
					var cy=cSize.cy;
					
					spec.paintCell.call(this,spec,ctx,images,channel,cellType,xCenter,yCenter,cx,cy);
				}
			}
		},
		
		paintLines: function(spec,ctx,images,channel) {
			var cSize = this.cbCSize(spec);
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 40;
			ctx.strokeRect(-NBCOLS*cSize.cx/2,-NBROWS*cSize.cy/2,NBCOLS*cSize.cx,NBROWS*cSize.cy);
		},

		paintChannel: function(spec,ctx,images,channel) {
			var cSize = this.cbCSize(spec);
			spec.paintBackground.call(this,spec,ctx,images,channel,cSize.width,cSize.height);
			spec.paintCells.call(this,spec,ctx,images,channel)
			spec.paintLines.call(this,spec,ctx,images,channel);
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
					var x = coords.x-cSize.cx / 3;
					var y = coords.y-cSize.cy / 3;
					if(spec.notationDebug)
						ctx.fillText(pos,x,y);
					else
						ctx.fillText(String.fromCharCode(97 + displayedCol) + displayedRow,x,y);
				}
			}
		},
	});
	
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		var geometry = aGame.cbVar.geometry;
		var x0 = geometry.C(aMove.f);
		var x1 = geometry.C(aMove.t);
		var y0 = geometry.R(aMove.f);
		var y1 = geometry.R(aMove.t);
		if(x1-x0==0 || y1-y0==0 || Math.abs(x1-x0)==Math.abs(y1-y0))
			return (zFrom+zTo)/2;
		else
			return Math.max(zFrom,zTo)+1500;
	}

	View.Game.cbGridBoardClassic2D = $.extend({},View.Game.cbGridBoardClassic,{
		'colorFill' : {		
			".": "#F1D9B3", // "white" cells
			"#": "#C7885D", // "black" cells
			" ": "rgba(0,0,0,0)",
		},
	});

	View.Game.cbGridBoardClassic3DMargin = $.extend({},View.Game.cbGridBoardClassic,{
		'margins' : {x:.67,y:.67},
		'extraChannels':[ // in addition to 'diffuse' which is default
			'bump'
		],
		/*
		'mesh': { // not implemented yet
			jsfile:"/res/xd-view/meshes/taflboard.js",
			meshScale:1.32,
			boardMaterialName:"board",
		}
		*/
	});
	
	View.Game.cbGridBoardClassic2DMargin = $.extend({},View.Game.cbGridBoardClassic2D,{
		'margins' : {x:.67,y:.67},
	});

	View.Game.cbGridBoardClassic2DNoMargin = $.extend({},View.Game.cbGridBoardClassic2D,{
		'margins' : {x:0.0,y:0.0},
		'notationMode': 'in',
		'texturesImg' : {
			'boardBG' : '/res/images/whitebg.png',
		},
	});

	
	
})();
