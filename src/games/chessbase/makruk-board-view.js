(function() {

	View.Game.cbMakrukBoard = $.extend({},View.Game.cbGridBoardClassic,{
		'colorFill' : {
			".": "rgba(0,0,0,0)", 
		},
		paintLines: function(spec,ctx,images,channel) {
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = 30;
			ctx.stroke();
		},
	});

	View.Game.cbMakrukBoard3DMargin = $.extend({},View.Game.cbMakrukBoard,{
		'margins' : {x:.47,y:.47},
		'extraChannels':[
			'bump'
		],
		'texturesImg' : {
			'boardBG' : '/res/images/wood-chipboard-5.jpg',			
		},
	});
	
	View.Game.cbMakrukBoard2DMargin = $.extend({},View.Game.cbMakrukBoard,{
		'margins' : {x:.47,y:.47},
		'colorFill' : {
			".": "rgba(0,0,0,0)", 
		},	
		'texturesImg' : {
			'boardBG' : '/res/images/wood-chipboard-4.jpg',			
		},
	});
		
})();