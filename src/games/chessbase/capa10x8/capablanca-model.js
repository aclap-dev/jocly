/*
 * Copyright(c) 2013-2014 - jocly.com
 *
 * You are allowed to use and modify this source code as long as it is exclusively for use in the Jocly API. 
 *
 * Original authors: Jocly team
 *
 */
 

(function() {
	
	var geometry = Model.Game.cbBoardGeometryGrid(10,8);

	// various alternative castling rules (default is f -> c or i)
	var janus={ // asymmetric, to b- or i-file
		"4/0": {k:[3,2,1],r:[1,2],n:"O-O"},
		"4/9": {k:[5,6,7,8],r:[8,7],n:"O-O-O"},
		"74/70": {k:[73,72,71],r:[71,72],n:"O-O"},
		"74/79": {k:[75,76,77,78],r:[78,77],n:"O-O-O"},
	}
	var mirrored={ // e -> b or h
		"4/0": {k:[3,2,1],r:[1,2],n:"O-O"},
		"4/9": {k:[5,6,7],r:[8,7,6],n:"O-O-O"},
		"74/70": {k:[73,72,71],r:[71,72],n:"O-O"},
		"74/79": {k:[75,76,77],r:[78,77,76],n:"O-O-O"},
	}
	var mirror2={ // e -> c or g
		"4/0": {k:[3,2],r:[1,2,3],n:"O-O"},
		"4/9": {k:[5,6],r:[8,7,6,5],n:"O-O-O"},
		"74/70": {k:[73,72],r:[71,72,73],n:"O-O"},
		"74/79": {k:[75,76],r:[78,77,76,75],n:"O-O-O"},
	}
	var twostep={ // f -> d or h
		"5/0": {k:[4,3],r:[1,2,3,4],n:"O-O-O"},
		"5/9": {k:[6,7],r:[8,7,6],n:"O-O"},
		"75/70": {k:[74,73],r:[71,72,73,74],n:"O-O-O"},
		"75/79": {k:[76,77],r:[78,77,76],n:"O-O"},
	}
	var flexible={ // dummy 1-step, as template for flexible
		"5/0": {k:[4],r:[1,2,3,4,5],n:"O-O-O",extra:-3},
		"5/9": {k:[6],r:[8,7,6,5],n:"O-O",extra:-2},
		"75/70": {k:[74],r:[71,72,73,74,75],n:"O-O-O",extra:-3},
		"75/79": {k:[76],r:[78,77,76,75],n:"O-O",extra:-2},
	}
	var mirror_f={ // same, but from e-file
		"4/0": {k:[3],r:[1,2,3,4],n:"O-O",extra:-2},
		"4/9": {k:[5],r:[8,7,6,5,4],n:"O-O-O",extra:-3},
		"74/70": {k:[73],r:[71,72,73,74],n:"O-O",extra:-2},
		"74/79": {k:[75],r:[78,77,76,75,74],n:"O-O-O",extra:-3},
	}

	Model.Game.cbDefine=function(){

		var p=this.cbPiecesFromFEN(geometry, "rnabqkbmnr/pppppppppp/10/10/10/10/PPPPPPPPPP/RNABQKBMNR");

		p.prelude=[{
			panelWidth: 2, // two buttons per row
			panelBackground: "/res/rules/capablanca/capablanca-panel.png",
			//	 Capablanca   Gothic      Bird     Carrera    Embassy    Ladorean  Grotesque  Schoolbook  Univers     Janus
			setups: ["NABQKBMN","NBQMKABN","NBMQKABN","ANBQKBNM","NBQKMABN","BQNKANMB","BQNKMNAB","QNBAKBNM","BNMQKANB","ANBQKBNA"],
			castle: [ p.castle,  p.castle,  p.castle, undefined,  mirrored,  mirror2,   mirror_f,  flexible,  flexible,   janus   ],
			squares: {1:[1,2,3,4,5,6,7,8], '-1':[71,72,73,74,75,76,77,78]},
			participants: p.promoChoice, // adapt auto-generated promotion choice to selected variant (Janus has no Marshall!)
			persistent: true, // stick with selection for all subsequent games
		},0];

	        return p;
	}
	
})();
