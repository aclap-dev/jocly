/*
 *
 *
 *
 * authors: fhoudebert
 *
 */

(function() {

    function createTexturedPatternCanvas(W,H,texture,clipW,clipH,mask,borderFact){
    	// borderFact is the percentage (/100) of the mask transition overlay border : ex 30% => .3
        var cv = document.createElement('canvas');
        cv.width=W;
        cv.height=H;
        var ctx=cv.getContext('2d');

        var maskW=mask.width;
        var maskH=mask.height;
        var textW=texture.width;
        var textH=texture.height;
        var tmp = document.createElement('canvas');
        ctx.globalCompositeOperation='or';

        var y=0;
        for (var i=0; y<=(H+clipH/2);i++){
            var x=0;
            for (var j=0; x<=(W+clipW/2);j++){
                tmp.width=clipW; tmp.height=clipH;
                ctxTmp=tmp.getContext('2d');
                ctxTmp.globalCompositeOperation='xor';
                ctxTmp.drawImage(texture, Math.random()*(textW-clipW),Math.random()*(textH-clipH),clipW,clipH,0,0,clipW,clipH);
                ctxTmp.drawImage(mask,0,0,clipW,clipH);
                ctx.drawImage(tmp,x-clipW/2,y-clipH/2,clipW,clipH);
                x+=clipW-borderFact*clipW;
            }
            y+=clipH-borderFact*clipH;
        }
        return cv;
    }




	// Reducing the promo frame which was overflowing the board screen
	View.Game.cbPromoSize = 1100;

	// extending fairy pieces with some musketeer new pieces
	View.Game.cbFairybigorraPieceStyle3D = $.extend(true,{},View.Game.cbFairyPieceStyle3D,{
	});

	View.Game.cbDefineView = function() {
		
		var bigorrachessBoardDelta = {
			notationMode: "out",
			notationDebug: true,
		}

		bigorrachessBoardDelta3d = $.extend(true,{},bigorrachessBoardDelta,
			{

                //orange/jaune ocre
				'colorFill' : {
					"#": "rgba(205,112,84,1)",
					".": "rgba(221,177,85,1)",
				},
				'texturesImg' : {
					'crackles': '/res/images/crackles.jpg',
					'tiler': '/res/images/tileralpha.png',
				},
				'3D':true,
				'margins' : {x:.47,y:.47},
				'extraChannels':[
					'bump'
				],
				paintCell: function(spec,ctx,images,channel,cellType,xCenter,yCenter,cx,cy) {

					var tW=images['crackles'].width;
					var tH=images['crackles'].height;
					var tClipCx=200;
					var tClipCy=200;



					ctx.fillStyle="#000000";
					ctx.fillRect(xCenter-cx/2,yCenter-cy/2,cx,cy);

					if(channel=="bump"){
						return;
					}

					cx=.98*cx;
					cy=.98*cy;

					ctx.save();


					ctx.strokeStyle = "rgba(0,0,0,1)";
					ctx.lineWidth = 50;
					if (channel=='diffuse')
						ctx.fillStyle=spec.colorFill[cellType];
					else
						ctx.fillStyle=0xffffff;
					ctx.fillRect(xCenter-cx/2,yCenter-cy/2,cx,cy);

					ctx.globalCompositeOperation = 'multiply';
					ctx.drawImage(images['crackles'],
						Math.random()*(tW-tClipCx),Math.random()*(tH-tClipCy),tClipCx,tClipCy,
						xCenter-cx/2,yCenter-cy/2,cx,cy);
					ctx.restore();
				},

				paintBackground: function(spec,ctx,images,channel,bWidth,bHeight) {

						ctx.save();
						ctx.fillStyle="#ffffff";
						if (channel=='diffuse')
							ctx.fillStyle="#BA784A";
							//ctx.fillStyle="#cc6600";
						var cSize = this.cbCSize(spec);
						ctx.fillRect(-bWidth/2,-bHeight/2,bWidth,bHeight);
						var textureCanvas=createTexturedPatternCanvas(1200,800,images['crackles'],200,200,images['tiler'],.3);
						ctx.globalCompositeOperation='multiply';
						ctx.drawImage(textureCanvas,-bWidth/2,-bHeight/2,bWidth,bHeight);
						ctx.restore();
				},
			}
		);

		bigorrachessBoardDelta2d = $.extend(true,{},bigorrachessBoardDelta,
			{

				'texturesImg' : {}, // to avoid default wood texture
				'margins' : {x:.47,y:.47},
                //orange/jaune ocre
				'colorFill' : {
					"#": "rgba(205,112,84,1)",
					".": "rgba(221,177,85,1)",
				},

			}
		);

		var bigorrachessBoard3d = $.extend(true,{},this.cbGridBoardClassic3DMargin,bigorrachessBoardDelta3d);
		var bigorrachessBoard2d = $.extend(true,{},this.cbGridBoardClassic2DMargin,bigorrachessBoardDelta2d);

		return {
			coords: {
				"2d": this.cbGridBoard.coordsFn.call(this,bigorrachessBoard2d),
				"3d": this.cbGridBoard.coordsFn.call(this,bigorrachessBoard3d),
			},
			boardLayout: [
	      		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#.",
	      		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#.",
	     		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#.",
	     		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#.",
	     		".#.#.#.#.#.#.#.#",
	     		"#.#.#.#.#.#.#.#."
			  ],
			board: {
				"2d": {
					draw: this.cbDrawBoardFn(bigorrachessBoard2d),
				},
				"3d": {
					display: this.cbDisplayBoardFn(bigorrachessBoard3d),
				},
			},
			clicker: {
				"2d": {
					width: 800,
					height: 800,
				},
				"3d": {
					scale: [0.51428571428571,0.51428571428571,0.51428571428571],
				},
			},
			pieces: this.cbFairyPieceStyle({
				"default": {
					"2d": {
						width: 742.85714285714,
						height: 742.85714285714,	
					},			
					"3d": {
						scale: [0.34285714285714,0.34285714285714,0.34285714285714],
						display: this.cbDisplayPieceFn(this.cbFairybigorraPieceStyle3D)
					},
				},
				"fr-amazon" :{
					"3d": {
						scale: [0.41142857142857,0.41142857142857,0.41142857142857],
					}
				},
			}),
		};
	}

	/* Make the jumps */
	View.Board.cbMoveMidZ = function(aGame,aMove,zFrom,zTo) {
		var geo=aGame.cbVar.geometry;
		var dx=Math.abs(geo.C(aMove.t)-geo.C(aMove.f));
		var dy=Math.abs(geo.R(aMove.t)-geo.R(aMove.f));
        // jump to move
		if(("_N_E_W_K_L_M_T_F_G_J_Z_D_O_T_C_SQ_M_H_".indexOf("_"+aMove.a+"_")>=0) && (aGame.g.distGraph[aMove.f][aMove.t]>1))
			return Math.max(zFrom,zTo)+2000;
		else if(("_A_X_".indexOf("_"+aMove.a+"_")>=0) && dx!=dy && dx!=0 && dy!=0)
			return Math.max(zFrom,zTo)+2000;
// jump to attack
		else if(("_Z_W__C_V_O_".indexOf("_"+aMove.a+"_")>=0) && aMove.c != null)
			return Math.max(zFrom,zTo)+2000;
		else
			return (zFrom+zTo)/2;
	}
})();
