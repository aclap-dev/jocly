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

	Model.Board.customGen = function(moves,move,aBoard,aGame) { // generate extra castlings from RxK friendly captures
		var v=aGame.cbVar.prelude[0].persistent; // selected variant
		if(v<6 || v>8) return; // no flexible catling in these variants
		var k=aBoard.pieces[move.c]; // piece we hit
		if(k.t != 8 || k.m) return;  // not a King, or has moved
		var r=aBoard.pieces[aBoard.board[move.f]]; // rook
		if(r.m) return; // has moved
		// path is free, and both virgin
		v=(r.p>k.p ? 1 : -1); // direction King moves in
		var i=0;
		for(var pos=move.t+v; pos!=move.f; pos+=v) { // every square between King and Rook
			if(aBoard.cbGetAttackers(aGame,pos,aBoard.mWho).length>0) break; // slides into check: no further
			if(i++>1) { // skip 1- and (normally generated) 2-step castling
				var spec=aGame.cbVar.castle[move.t+"/"+move.f];
				var rookOffset=pos-v-spec.r[spec.r.length-1] << 16; // upper bits encode final pos w.r.t. tabulated
				moves.push({f:k.p, t:pos+rookOffset, c:null, cg:r.p});
			}
		}
	}

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

	var flexible=twostep; // for now
	var mirror_f=mirror2;

	Model.Game.cbDefine=function(){

		var p=this.cbPiecesFromFEN(geometry, "rnabqkbmnr/pppppppppp/10/10/10/10/PPPPPPPPPP/RNABQKBMNR");

		p.addMoves('rook',this.cbLongRangeGraph(geometry,[[1,0]],null,this.cbConstants.FLAG_CAPTURE_SELF),[0,70]); // allow Rx(own)K from corners...
		p.addMoves('rook',this.cbLongRangeGraph(geometry,[[-1,0]],null,this.cbConstants.FLAG_CAPTURE_SELF),[9,79]); // ... to trigger customGen

		p.prelude=[{
			panelWidth: 2, // two buttons per row
			panelBackground: "/res/rules/capablanca/capablanca-panel.png",
			//	 Capablanca   Gothic      Bird     Carrera    Embassy    Ladorean  Grotesque  Schoolbook  Univers     Janus
			setups: ["NABQKBMN","NBQMKABN","NBMQKABN","ANBQKBNM","NBQKMABN","BQNKANMB","BQNKMNAB","QNBAKBNM","BNMQKANB","ANBQKBNA"],
			castle: [ p.castle,  p.castle,  p.castle, undefined,  mirrored,  mirror2,   mirror_f,  flexible,  flexible,   janus   ],
			squares: {1:[1,2,3,4,5,6,7,8], '-1':[71,72,73,74,75,76,77,78]},
			participants: p.promoChoice, // adapt the auto-generated promotion choice to the selected variant
			persistent: true, // stick with selection for all subsequent games
		},0];

	        return p;
	}
	
})();
