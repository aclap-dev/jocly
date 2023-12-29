exports.config = {"status":true,"model":{"title-en":"Wild Mirza","summary":"Wild Timurid on 12x12 with snake","rules":{"en":"wild-mirza-rules.html"},"module":"chessbase","plazza":"true","thumbnail":"wild-mirza-thumb.png","released":1497874349,"credits":{"en":"wild-mirza-credits.html"},"gameOptions":{"preventRepeat":true,"uctTransposition":"state","uctIgnoreLoop":false,"levelOptions":{"checkFactor":0.2,"pieceValueFactor":1,"posValueFactor":0.1,"averageDistKingFactor":-0.01,"castleFactor":0.1,"minorPiecesMovedFactor":0.1,"pieceValueRatioFactor":1,"endingKingFreedomFactor":0.01,"endingDistKingFactor":0.05,"distKingCornerFactor":0.1,"distPawnPromo1Factor":0.3,"distPawnPromo2Factor":0.1,"distPawnPromo3Factor":0.05}},"obsolete":false,"js":["base-model.js","grid-geo-model.js","wild-mirza-model.js"],"description":{"en":"wild-mirza-description.html"},"levels":[{"name":"easy","label":"Easy","ai":"uct","playoutDepth":0,"minVisitsExpand":1,"c":0.6,"ignoreLeaf":false,"uncertaintyFactor":3,"maxNodes":6000},{"name":"fast","label":"Fast [3sec]","ai":"uct","playoutDepth":0,"minVisitsExpand":1,"c":0.6,"ignoreLeaf":false,"uncertaintyFactor":3,"maxDuration":3,"isDefault":true},{"name":"medium","label":"Medium","ai":"uct","playoutDepth":0,"minVisitsExpand":1,"c":0.6,"ignoreLeaf":false,"uncertaintyFactor":3,"maxNodes":30000,"maxDuration":30},{"name":"strong","label":"Strong","ai":"uct","playoutDepth":0,"minVisitsExpand":1,"c":0.6,"ignoreLeaf":false,"uncertaintyFactor":3,"maxNodes":60000,"maxDuration":45}]},"view":{"title-en":"Wild mirza view","visuals":{"600x600":["res/visuals/wild-mirza-600x600-3d.jpg","res/visuals/wild-mirza-600x600-2d.jpg"]},"xdView":true,"css":["chessbase.css"],"preferredRatio":1,"useShowMoves":true,"useNotation":true,"module":"chessbase","defaultOptions":{"sounds":true,"moves":true,"notation":false,"autocomplete":false},"skins":[{"name":"skin3d","title":"3D Classic","3d":true,"preload":["smoothedfilegeo|0|/res/ring-target.js","image|/res/images/cancel.png","image|/res/images/wikipedia.png","smoothedfilegeo|0|/res/fairy/pawn/pawn.js","image|/res/fairy/pawn/pawn-diffusemap.jpg","image|/res/fairy/pawn/pawn-normalmap.jpg","smoothedfilegeo|0|/res/fairy/rook/rook.js","image|/res/fairy/rook/rook-diffusemap.jpg","image|/res/fairy/rook/rook-normalmap.jpg","smoothedfilegeo|0|/res/fairy/bishop/bishop.js","image|/res/fairy/bishop/bishop-diffusemap.jpg","image|/res/fairy/bishop/bishop-normalmap.jpg","smoothedfilegeo|0|/res/fairy/knight/knight.js","image|/res/fairy/knight/knight-diffusemap.jpg","image|/res/fairy/knight/knight-normalmap.jpg","smoothedfilegeo|0|/res/fairy/queen/queen.js","image|/res/fairy/queen/queen-diffusemap.jpg","image|/res/fairy/queen/queen-normalmap.jpg","smoothedfilegeo|0|/res/fairy/king/king.js","image|/res/fairy/king/king-diffusemap.jpg","image|/res/fairy/king/king-normalmap.jpg","smoothedfilegeo|0|/res/fairy/prince/prince.js","image|/res/fairy/prince/prince-diffusemap.jpg","image|/res/fairy/prince/prince-normalmap.jpg","smoothedfilegeo|0|/res/fairy/elephant/elephant.js","image|/res/fairy/elephant/elephant-diffusemap.jpg","image|/res/fairy/elephant/elephant-normalmap.jpg","smoothedfilegeo|0|/res/fairy/cannon2/cannon2.js","image|/res/fairy/dragon/dragon-diffuse-map.jpg","image|/res/fairy/dragon/dragon-normal-map.jpg","smoothedfilegeo|0|/res/fairy/dragon/dragon.js","image|/res/fairy/cannon2/cannon2-diffusemap.jpg","image|/res/fairy/cannon2/cannon2-normalmap.jpg","smoothedfilegeo|0|/res/fairy/eagle/eagle.js","image|/res/fairy/eagle/eagle-diffusemap.jpg","image|/res/fairy/eagle/eagle-normalmap.jpg","smoothedfilegeo|0|/res/fairy/camel/camel.js","image|/res/fairy/camel/camel-diffusemap.jpg","image|/res/fairy/camel/camel-normalmap.jpg"],"world":{"lightIntensity":1.3,"skyLightIntensity":1.2,"lightCastShadow":true,"fog":false,"color":4686804,"lightPosition":{"x":-9,"y":9,"z":9},"skyLightPosition":{"x":9,"y":9,"z":9},"lightShadowDarkness":0.55,"ambientLightColor":2236962},"camera":{"fov":45,"distMax":50,"radius":18,"elevationAngle":60,"elevationMin":0}},{"name":"skin2d","title":"2D Classic","3d":false,"preload":["image|/res/images/cancel.png","image|/res/images/whitebg.png","image|/res/fairy/wikipedia-fairy-sprites.png"]}],"animateSelfMoves":false,"switchable":true,"sounds":{"move1":"alq_move1","move2":"alq_move2","move3":"alq_move3","move4":"alq_move2","tac1":"alq_tac1","tac2":"alq_tac2","tac3":"alq_tac1","promo":"promo","usermove":null},"js":["base-view.js","grid-board-view.js","fairy-set-view.js","timurid-view.js"],"useAutoComplete":true}}