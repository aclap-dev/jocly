exports.config = {"status":true,"model":{"title-en":"Bigorra","summary":"FantasticXIII and Gigachess II on 16x16","rules":{"en":"bigorra-rules.html"},"module":"chessbase","plazza":"true","thumbnail":"bigorra-thumb.png","released":1497771910,"credits":{"en":"fantasticXIII-credits.html"},"gameOptions":{"preventRepeat":true,"uctTransposition":"state","uctIgnoreLoop":false,"levelOptions":{"checkFactor":0.2,"pieceValueFactor":1,"posValueFactor":0.1,"averageDistKingFactor":-0.01,"castleFactor":0.1,"minorPiecesMovedFactor":0.1,"pieceValueRatioFactor":1,"endingKingFreedomFactor":0.01,"endingDistKingFactor":0.05,"distKingCornerFactor":0.1,"distPawnPromo1Factor":0.3,"distPawnPromo2Factor":0.1,"distPawnPromo3Factor":0.05}},"obsolete":false,"js":["base-model.js","grid-geo-model.js","bigorra-model.js"],"description":{"en":"bigorra-description.html","fr":"bigorra-description-fr.html"},"levels":[{"name":"easy","label":"Easy","ai":"uct","playoutDepth":0,"minVisitsExpand":1,"c":0.6,"ignoreLeaf":false,"uncertaintyFactor":3,"maxNodes":6000},{"name":"fast","label":"Fast [3sec]","ai":"uct","playoutDepth":0,"minVisitsExpand":1,"c":0.6,"ignoreLeaf":false,"uncertaintyFactor":3,"maxDuration":3,"isDefault":true},{"name":"medium","label":"Medium","ai":"uct","playoutDepth":0,"minVisitsExpand":1,"c":0.6,"ignoreLeaf":false,"uncertaintyFactor":3,"maxNodes":30000,"maxDuration":30},{"name":"strong","label":"Strong","ai":"uct","playoutDepth":0,"minVisitsExpand":1,"c":0.6,"ignoreLeaf":false,"uncertaintyFactor":3,"maxNodes":60000,"maxDuration":45}]},"view":{"title-en":"Chessbase view","visuals":{"600x600":["res/visuals/bigorra-600x600-3d.jpg","res/visuals/bigorra-600x600-2d.jpg"]},"xdView":true,"css":["chessbase.css"],"preferredRatio":1,"useShowMoves":true,"useNotation":true,"module":"chessbase","defaultOptions":{"sounds":true,"moves":true,"notation":false,"autocomplete":false},"skins":[{"name":"skin3d","title":"3D Classic","3d":true,"preload":["smoothedfilegeo|0|/res/ring-target.js","image|/res/images/cancel.png","image|/res/images/wikipedia.png","smoothedfilegeo|0|/res/fairy/pawn/pawn.js","image|/res/fairy/pawn/pawn-diffusemap.jpg","image|/res/fairy/pawn/pawn-normalmap.jpg","smoothedfilegeo|0|/res/fairy/king/king.js","image|/res/fairy/king/king-diffusemap.jpg","image|/res/fairy/king/king-normalmap.jpg","smoothedfilegeo|0|/res/fairy/prince/prince.js","image|/res/fairy/prince/prince-diffusemap.jpg","image|/res/fairy/prince/prince-normalmap.jpg","smoothedfilegeo|0|/res/fairy/mamoth/elephant.js","image|/res/fairy/mamoth/mamoth-diffusemap.jpg","image|/res/fairy/mamoth/mamoth-normalmap.jpg","smoothedfilegeo|0|/res/fairy/squirle/squirle.js","image|/res/fairy/cannon2/squirle-diffusemap.jpg","image|/res/fairy/cannon2/squirle-normalmap.jpg","smoothedfilegeo|0|/res/fairy/griffin/griffin.js","image|/res/fairy/griffin/griffin-diffusemap.jpg","image|/res/fairy/griffin/griffin-normalmap.jpg","smoothedfilegeo|0|/res/fairy/huscarl/huscarl.js","image|/res/fairy/huscarl/huscarl-diffusemap.jpg","image|/res/fairy/huscarl/huscarl-normalmap.jpg","smoothedfilegeo|0|/res/fairy/hawk/hawk.js","image|/res/fairy/hawk/hawk-diffusemap.jpg","image|/res/fairy/hawk/hawk-normalmap.jpg","smoothedfilegeo|0|/res/fairy/knight/knight.js","image|/res/fairy/knight/knight-diffusemap.jpg","image|/res/fairy/knight/knight-normalmap.jpg","smoothedfilegeo|0|/res/fairy/bishop/bishop.js","image|/res/fairy/bishop/bishop-diffusemap.jpg","image|/res/fairy/bishop/bishop-normalmap.jpg","smoothedfilegeo|0|/res/fairy/queen/queen.js","image|/res/fairy/queen/queen-diffusemap.jpg","image|/res/fairy/queen/queen-normalmap.jpg","smoothedfilegeo|0|/res/fairy/rook/rook.js","image|/res/fairy/rook/rook-diffusemap.jpg","image|/res/fairy/rook/rook-normalmap.jpg","smoothedfilegeo|0|/res/fairy/cannon2/cannon2.js","image|/res/fairy/cannon2/cannon2-diffusemap.jpg","image|/res/fairy/cannon2/cannon2-normalmap.jpg","smoothedfilegeo|0|/res/fairy/elephant/elephant.js","image|/res/fairy/elephant/elephant-diffusemap.jpg","image|/res/fairy/elephant/elephant-normalmap.jpg","smoothedfilegeo|0|/res/fairy/prince/prince.js","image|/res/fairy/prince/prince-diffusemap.jpg","image|/res/fairy/prince/prince-normalmap.jpg","smoothedfilegeo|0|/res/fairy/camel/camel.js","image|/res/fairy/camel/camel-diffusemap.jpg","image|/res/fairy/camel/camel-normalmap.jpg","smoothedfilegeo|0|/res/fairy/lion/lion.js","image|/res/fairy/lion/lion-diffusemap.jpg","image|/res/fairy/lion/lion-normalmap.jpg","smoothedfilegeo|0|/res/fairy/bow/bow.js","image|/res/fairy/bow/bow-diffusemap.jpg","image|/res/fairy/bow/bow-normalmap.jpg","smoothedfilegeo|0|/res/fairy/machine/machine.js","image|/res/fairy/machine/machine-diffusemap.jpg","image|/res/fairy/machine/machine-normalmap.jpg","smoothedfilegeo|0|/res/fairy/buffalo/buffalo.js","image|/res/fairy/buffalo/buffalo-diffusemap.jpg","image|/res/fairy/buffalo/buffalo-normalmap.jpg","smoothedfilegeo|0|/res/fairy/rhino/rhino.js","image|/res/fairy/rhino/rhino-diffusemap.jpg","image|/res/fairy/rhino/rhino-normalmap.jpg","smoothedfilegeo|0|/res/fairy/giraffe/giraffe.js","image|/res/fairy/giraffe/giraffe-diffuse-map.jpg","image|/res/fairy/giraffe/giraffe-normal-map.jpg","smoothedfilegeo|0|/res/fairy/ship/ship.js","image|/res/fairy/ship/ship-diffusemap.jpg","image|/res/fairy/ship/ship-normalmap.jpg","smoothedfilegeo|0|/res/fairy/dragon/dragon.js","image|/res/fairy/dragon/dragon-diffusemap.jpg","image|/res/fairy/dragon/dragon-normalmap.jpg","smoothedfilegeo|0|/res/fairy/leopard/leopard.js","image|/res/fairy/leopard/leopard-diffusemap.jpg","image|/res/fairy/leopard/leopard-normalmap.jpg"],"world":{"lightIntensity":1.3,"skyLightIntensity":1.2,"lightCastShadow":true,"fog":false,"color":4686804,"lightPosition":{"x":-9,"y":9,"z":9},"skyLightPosition":{"x":9,"y":9,"z":9},"lightShadowDarkness":0.55,"ambientLightColor":2236962},"camera":{"fov":45,"distMax":50,"radius":18,"elevationAngle":60,"elevationMin":0}},{"name":"skin2d","title":"2D Classic","3d":false,"preload":["image|/res/images/cancel.png","image|/res/images/whitebg.png","image|/res/fairy/wikipedia-fairy-sprites.png"]}],"animateSelfMoves":false,"switchable":true,"sounds":{"move1":"alq_move1","move2":"alq_move2","move3":"alq_move3","move4":"alq_move2","tac1":"alq_tac1","tac2":"alq_tac2","tac3":"alq_tac1","promo":"promo","usermove":null},"js":["base-view.js","grid-board-view.js","fairy-set-view.js","bigorra-view.js"],"useAutoComplete":true}}