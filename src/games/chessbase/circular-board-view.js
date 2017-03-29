
(function() {
	
	var JOCLY_FIELD_SIZE=12000; // physical space

	var NBCOLS=0, NBROWS=0, CSIZES={};
	
	var CENTER=4;
	
	View.Game.cbTargetMesh = "/res/ring-target-cylinder-v3.js";

	View.Game.cbEnsureConstants =function() {
		if(NBROWS)
			return;
		NBROWS=this.cbVar.geometry.height;
		NBCOLS=this.cbVar.geometry.width;
		
		console.warn("NBROWS",NBROWS,"NBCOLS",NBCOLS)
	}
	
	// 'this' is a Game object
	View.Game.cbCSize =function(boardSpec) {
		this.cbEnsureConstants();
		var cSize=CSIZES[boardSpec.margins.x+"_"+boardSpec.margins.y];
		if(!cSize) {

			var ratio,width,height,cellSize;
			
			var relWidth = 2*NBROWS+CENTER+2*boardSpec.margins.x;
			var relHeight = 2*NBROWS+CENTER+2*boardSpec.margins.y;
			
			ratio =  relWidth / relHeight;
			if(ratio<1)
				cellSize = (JOCLY_FIELD_SIZE * ratio) / relWidth;
			else 
				cellSize = (JOCLY_FIELD_SIZE / ratio) / relHeight;
			width = (2*NBROWS+CENTER+2*boardSpec.margins.x) * cellSize;
			height= (2*NBROWS+CENTER+2*boardSpec.margins.y) * cellSize;
			
			console.warn("width",width,"height",height)
			
			cSize={
				//cx:cellSize,
				cy:cellSize,
				pieceCx:cellSize,
				pieceCy:cellSize,
				ratio: ratio,
				width: width,
				height: height,
				angle: 360/NBCOLS,
				angleRad: 2*Math.PI/NBCOLS,
				shiftAngleRad: Math.PI/NBCOLS,
				center: CENTER,
			}
			CSIZES[boardSpec.margins.x+"_"+boardSpec.margins.y]=cSize;
		}
		return cSize;
	}
	
	View.Game.cbCircularBoard = $.extend({},View.Game.cbBaseBoard,{
		
		notationMode: "in", // notation outside the board
		
		// 'this' is a Game object
		coordsFn: function(boardSpec) {
			
			boardSpec = boardSpec || {};
			boardSpec.margins = boardSpec.margins || {x:0,y:0};
			
			return function(pos) {
				var cSize = this.cbCSize(boardSpec);
				var c=pos%NBCOLS;
				var r=NBROWS-1-(pos-c)/NBCOLS;
				if(this.mViewAs==-1)
					c=NBCOLS-1-c;
				var coords={
					x: (cSize.center/2+r+.5)*cSize.cy*Math.cos(c*cSize.angleRad+cSize.shiftAngleRad)*this.mViewAs,
					y: (cSize.center/2+r+.5)*cSize.cy*Math.sin(c*cSize.angleRad+cSize.shiftAngleRad),
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

	View.Game.cbCircularBoardClassic = $.extend({},View.Game.cbCircularBoard,{
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
		
		paintCell: function(spec,ctx,images,channel,cellType,xCenter,yCenter,innerRadius,outerRadius,angle,deltaAngle) {
			//if(channel=="diffuse")
			//	console.log("paintCell",cellType,xCenter,yCenter,cx,cy)
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = 15;
			if (channel=='bump')
				ctx.fillStyle="#ffffff";
			else
				ctx.fillStyle=spec.colorFill[cellType];
			ctx.beginPath();
		
			ctx.moveTo(innerRadius*Math.cos(angle-deltaAngle/2),innerRadius*Math.sin(angle-deltaAngle/2));
			ctx.lineTo(outerRadius*Math.cos(angle-deltaAngle/2),outerRadius*Math.sin(angle-deltaAngle/2));
			ctx.arc(0,0,outerRadius,angle-deltaAngle/2,angle+deltaAngle/2,false);
			ctx.lineTo(innerRadius*Math.cos(angle+deltaAngle/2),innerRadius*Math.sin(angle+deltaAngle/2));
			ctx.arc(0,0,innerRadius,angle+deltaAngle/2,angle-deltaAngle/2,true);
			
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
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
					//var cx=cSize.cx;
					//var cy=cSize.cy;
					
					var innerRadius = (cSize.center/2+row)*cSize.cy;
					var outerRadius = (cSize.center/2+row+1)*cSize.cy;
					var angle = Math.atan2(yCenter,xCenter);
					
					spec.paintCell.call(this,spec,ctx,images,channel,cellType,xCenter,yCenter,
							innerRadius,
							outerRadius,
							angle,
							cSize.angleRad
					);
				}
			}
		},
		
		paintLines: function(spec,ctx,images,channel) {
			/*
			var cSize = this.cbCSize(spec);
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 40;
			ctx.strokeRect(-NBCOLS*cSize.cx/2,-NBROWS*cSize.cy/2,NBCOLS*cSize.cx,NBROWS*cSize.cy);
			*/
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
			ctx.font = Math.ceil(cSize.cy / 5) + 'px Monospace';
			var geometry = this.cbVar.geometry;
			
			for (var row = 0; row < NBROWS; row++) {
				for (var col = 0; col < NBCOLS; col++) {
					var pos = col+row*NBCOLS;
					var coords=getCoords.call(this,pos);
					//var cellType=this.cbView.boardLayout[NBROWS-row-1][col];
					var cellType=this.cbView.boardLayout[row][col];
					if(cellType==' ') 
						continue;
					ctx.fillStyle="rgba(0,0,0,0)";
					if(channel=="bump")
						ctx.fillStyle = fills["."];
					switch(cellType) {
					case ".":
						ctx.fillStyle= (channel=="bump") ? fills["."] : fills["#"];
						break;
					case "#":
						ctx.fillStyle=fills["."];
						break;
					}
					var x = coords.x;
					var y = coords.y;
					if(spec.notationDebug)
						ctx.fillText(pos,x,y);
					else
						ctx.fillText(geometry.PosName(pos),x,y);
				}
			}
		},
	});

	View.Game.cbCircularBoardClassic2D = $.extend({},View.Game.cbCircularBoardClassic,{
		'colorFill' : {		
			".": "#F1D9B3", // "white" cells
			"#": "#C7885D", // "black" cells
			" ": "rgba(0,0,0,0)",
		},
		'margins' : {x:0,y:0},
	});

	View.Game.cbCircularBoardClassic3D = $.extend({},View.Game.cbCircularBoardClassic,{
		'margins' : {x:.3,y:.3},
		'extraChannels':[ // in addition to 'diffuse' which is default
			'bump'
		],
	});
	
	View.Game.cbCircularBoardClassic2D = $.extend({},View.Game.cbCircularBoardClassic2D,{
		'margins' : {x:0.1,y:0.1},
	});

	/* Make all pieces jump when moving */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		return Math.max(zFrom,zTo)+1500;
	}
	
	
})();
