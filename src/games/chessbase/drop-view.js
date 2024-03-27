
(function(){

  View.Game.cbAddCounters = function(style2D, style3D) {

		for(var i=1; i<=10; i++) {

			style2D["cnt-" + i] = {
				"2d": {
					clipx: (i-1)*100
				}
			};

			style3D["cnt-" + i] = {
				mesh: {
					jsFile:"/res/counters/counter.js"
				},
				materials: {
					mat0: {
						channels: {
							diffuse: {
								texturesImg: {
									diffImg : "/res/counters/diffusemaps/cnt-"+i+".jpg",
								}
							},
							normal: {
								texturesImg: {
									normalImg: "/res/counters/counter-normalmap.jpg",
								}
							}
						},
					}
				},
			};
		}

	}

})();

