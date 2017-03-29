(function() {

	View.Game.cbShatranjBoard = $.extend({},View.Game.cbGridBoardClassic,{
		'colorFill' : {
			".": "rgba(0,0,0,0)", 
		},
		paintLines: function(spec,ctx,images,channel) {
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = 30;
			ctx.stroke();
		},
	});

	View.Game.cbShatranjBoard3DMargin = $.extend({},View.Game.cbShatranjBoard,{
		'margins' : {x:.47,y:.47},
		'extraChannels':[
			'bump'
		],
		'texturesImg' : {
			'boardBG' : '/res/images/wood-chipboard-2.jpg',			
		},
	});
	
	View.Game.cbShatranjBoard2DMargin = $.extend({},View.Game.cbShatranjBoard,{
		'margins' : {x:.47,y:.47},
		'colorFill' : {
			".": "rgba(0,0,0,0)", 
		},	
		'texturesImg' : {
			'boardBG' : '/res/images/wood-chipboard-2.jpg',			
		},
	});
		
})();