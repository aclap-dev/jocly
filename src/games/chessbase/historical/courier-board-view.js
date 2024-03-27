(function() {

	View.Game.cbCourierBoard = $.extend({},View.Game.cbGridBoardClassic,{
		'colorFill' : {
			".": "rgba(204,40,0,1)", 
			"#": "rgba(180,180,0,1)", 
		},
	});

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

	View.Game.cbCourierBoard3DMargin = $.extend({},View.Game.cbCourierBoard,{
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
	});
	
	View.Game.cbCourierBoard2DMargin = $.extend({},View.Game.cbCourierBoard,{
		'texturesImg' : {}, // to avoid default wood texture
		'margins' : {x:.47,y:.47},
		'colorFill' : {
			".": "rgba(224,50,0,1)", 
			"#": "rgba(220,220,0,1)", 
		},	
	});
		
})();