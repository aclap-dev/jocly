exports.model=Model={Game:{},Board:{},Move:{}},function(){var t;Model.Game.cbConstants={MASK:65535,FLAG_MOVE:65536,FLAG_CAPTURE:131072,FLAG_STOP:262144,FLAG_SCREEN_CAPTURE:524288,FLAG_CAPTURE_KING:1048576,FLAG_CAPTURE_NO_KING:2097152};var e="undefined"!=typeof Int32Array;Model.Game.cbUseTypedArrays=e,Model.Game.cbTypedArray=function(t){if(e){var a=new Int32Array(t.length);return a.set(t),a}for(var r=[],s=t.length,i=0;i<s;i++)r.push(t[i]);return r},Model.Game.cbShortRangeGraph=function(t,e,a,r){var s=this;void 0===r&&(r=196608);for(var i={},n=0;n<t.boardSize;n++)i[n]=[],(!a||n in a)&&e.forEach(function(e){var h=t.Graph(n,e);null!=h&&(!a||h in a)&&i[n].push(s.cbTypedArray([h|r]))});return i},Model.Game.cbLongRangeGraph=function(t,e,a,r,s){var i=this;void 0!==r&&null!=r||(r=196608),s||(s=1/0);for(var n={},h=0;h<t.boardSize;h++)n[h]=[],(!a||h in a)&&e.forEach(function(e){for(var o=[],p=t.Graph(h,e),c=0;null!=p&&(!a||p in a)&&(o.push(p|r),++c!=s);)p=t.Graph(p,e);o.length>0&&n[h].push(i.cbTypedArray(o))});return n},Model.Game.cbNullGraph=function(t){for(var e={},a=0;a<t.boardSize;a++)e[a]=[];return e},Model.Game.cbAuthorGraph=function(t){for(var e={},a=0;a<t.boardSize;a++){e[a]=[];for(var r=0;r<t.boardSize;r++)e[a].push([2293760|r])}return e},Model.Game.cbMergeGraphs=function(t){for(var e=[],a=0;a<t.boardSize;a++){e[a]=[];for(var r=1;r<arguments.length;r++)e[a]=e[a].concat(arguments[r][a])}return e},Model.Game.cbGetThreatGraph=function(){function t(e,a){for(var r in n){var s=n[r];if(!(s.p.length<a.length+1)){for(var i=!0,h=0;h<a.length;h++)if(a[h]!=s.p[h]){i=!1;break}if(i){var o=s.p[a.length],p=e[o];void 0===p&&(p={e:{}},e[o]=p),s.p.length==a.length+1&&(p.t=s.t,p.ts=s.ts,p.tk=s.tk,delete n[r]),a.push(o),t(p.e,a),a.pop()}}}}var e=this;this.cbUseScreenCapture=!1,this.cbUseCaptureKing=!1,this.cbUseCaptureNoKing=!1;for(var a={1:[],"-1":[]},r=[],s=0;s<this.g.boardSize;s++)this.g.pTypes.forEach(function(t,a){t.graph[s].forEach(function(t){for(var i=[],n=0;n<t.length;n++){var h=t[n];1048576&h?(e.cbUseCaptureKing=!0,i.unshift({d:65535&h,a:s,tk:a})):2097152&h?(e.cbUseCaptureNoKing=!0,i.unshift({d:65535&h,a:s,tnk:a})):131072&h?i.unshift({d:65535&h,a:s,t:a}):262144&h?i.unshift({d:65535&h,a:s}):524288&h&&(e.cbUseScreenCapture=!0,i.unshift({d:65535&h,a:s,ts:a}))}i.length>0&&r.push(i)})});var i={};r.forEach(function(t){t.forEach(function(e,a){var r=i[e.d];void 0===r&&(r={},i[e.d]=r);for(var s=[],n=a+1;n<t.length;n++)s.push(t[n].d);s.push(e.a);var h=s.join(","),o=r[h];void 0===o&&(o={p:s,t:{},ts:{},tk:{}},r[h]=o),void 0!==e.t?o.t[e.t]=!0:void 0!==e.tk?o.tk[e.tk]=!0:void 0!==e.ts&&(o.ts[e.ts]=!0)})});for(var s=0;s<e.g.boardSize;s++){var n=i[s],h={};t(h,[]),a[1][s]=h,a[-1][s]=h}return a},Model.Game.InitGame=function(){var e=this;this.cbVar=t=this.cbDefine(),this.g.boardSize=this.cbVar.geometry.boardSize,this.g.pTypes=this.cbGetPieceTypes(),this.g.threatGraph=this.cbGetThreatGraph(),this.g.distGraph=this.cbVar.geometry.GetDistances(),this.cbPiecesCount=0,this.g.castleablePiecesCount={1:0,"-1":0};for(var a in t.pieceTypes){var r=t.pieceTypes[a];if(r.castle){(r.initial||[]).forEach(function(t){e.g.castleablePiecesCount[t.s]++})}r.initial&&(this.cbPiecesCount+=r.initial.length)}for(var s=[],a=0;a<this.cbPiecesCount;a++)s.push(a);var i=Object.keys(t.pieceTypes);this.zobrist=new JocGame.Zobrist({board:{type:"array",size:this.cbVar.geometry.boardSize,values:s},who:{values:["1","-1"]},type:{type:"array",size:this.cbPiecesCount,values:i}})},Model.Game.cbGetPieceTypes=function(){for(var t=[],e={},a=0;a<this.cbVar.geometry.boardSize;a++)e[a]=[];for(var r in this.cbVar.pieceTypes){var s=this.cbVar.pieceTypes[r];t[r]={graph:s.graph||e,abbrev:s.abbrev||"",value:s.isKing?100:s.value||1,isKing:!!s.isKing,castle:!!s.castle,epTarget:!!s.epTarget,epCatch:!!s.epCatch}}return t},Model.Board.Init=function(t){this.zSign=0},Model.Board.InitialPosition=function(a){var r=this;this.board=e?new Int16Array(a.g.boardSize):[];for(var s=0;s<a.g.boardSize;s++)this.board[s]=-1;if(this.kings={},this.pieces=[],this.ending={1:!1,"-1":!1},this.lastMove=null,a.cbVar.castle&&(this.castled={1:!1,"-1":!1}),this.zSign=a.zobrist.update(0,"who",-1),this.noCaptCount=0,this.mWho=1,a.mInitial)this.mWho=a.mInitial.turn||1,a.mInitial.pieces.forEach(function(t){var e={};for(var a in t)t.hasOwnProperty(a)&&(e[a]=t[a]);r.pieces.push(e)}),a.mInitial.lastMove&&(this.lastMove={f:a.mInitial.lastMove.f,t:a.mInitial.lastMove.t}),void 0!==a.mInitial.noCaptCount&&(this.noCaptCount=a.mInitial.noCaptCount),a.cbVar.castle&&a.mInitial.castle&&(this.castled={1:{k:!!a.mInitial.castle[1]&&!!a.mInitial.castle[1].k,q:!!a.mInitial.castle[1]&&!!a.mInitial.castle[1].q},"-1":{k:!!a.mInitial.castle[-1]&&!!a.mInitial.castle[-1].k,q:!!a.mInitial.castle[-1]&&!!a.mInitial.castle[-1].q}});else for(var i in a.cbVar.pieceTypes)for(var n=a.cbVar.pieceTypes[i],h=n.initial||[],o=0;o<h.length;o++){var p=h[o],c={s:p.s,t:parseInt(i),p:p.p,m:!1};this.pieces.push(c)}if(this.pieces.sort(function(t,e){if(t.s!=e.s)return e.s-t.s;var r=a.cbVar.pieceTypes[t.t].value||100,s=a.cbVar.pieceTypes[e.t].value||100;return r!=s?r-s:t.p-e.p}),this.pieces.forEach(function(t,e){t.i=e,r.board[t.p]=e,a.g.pTypes[t.t].isKing&&(r.kings[t.s]=t.p),r.zSign=a.zobrist.update(r.zSign,"board",e,t.p),r.zSign=a.zobrist.update(r.zSign,"type",t.t,e)}),a.mInitial&&a.mInitial.enPassant){var s=t.geometry.PosByName(a.mInitial.enPassant);if(s>=0){var l,b=t.geometry.C(s),u=t.geometry.R(s);l=1==a.mInitial.turn?t.geometry.POS(b,u-1):t.geometry.POS(b,u+1),this.epTarget={p:s,i:this.board[l]}}}},Model.Board.CopyFrom=function(t){if(e)this.board=new Int16Array(t.board.length),this.board.set(t.board);else{this.board=[];for(var a=t.board,r=a.length,s=0;s<r;s++)this.board.push(a[s])}this.pieces=[];for(var i=t.pieces.length,s=0;s<i;s++){var n=t.pieces[s];this.pieces.push({s:n.s,p:n.p,t:n.t,i:n.i,m:n.m})}this.kings={1:t.kings[1],"-1":t.kings[-1]},this.check=t.check,t.lastMove?this.lastMove={f:t.lastMove.f,t:t.lastMove.t,c:t.lastMove.c}:this.lastMove=null,this.ending={1:t.ending[1],"-1":t.ending[-1]},void 0!==t.castled&&(this.castled={1:t.castled[1],"-1":t.castled[-1]}),this.noCaptCount=t.noCaptCount,t.epTarget?this.epTarget={p:t.epTarget.p,i:t.epTarget.i}:this.epTarget=null,this.mWho=t.mWho,this.zSign=t.zSign},Model.Board.cbApplyCastle=function(t,e,a){var r=t.cbVar.castle[e.f+"/"+e.cg],s=r.r[r.r.length-1],i=this.pieces[this.board[e.cg]],n=r.k[r.k.length-1],h=this.pieces[this.board[e.f]];return a&&(this.zSign=t.zobrist.update(this.zSign,"board",i.i,e.cg),this.zSign=t.zobrist.update(this.zSign,"board",i.i,s),this.zSign=t.zobrist.update(this.zSign,"board",h.i,e.f),this.zSign=t.zobrist.update(this.zSign,"board",h.i,n)),i.p=s,i.m=!0,this.board[e.cg]=-1,h.p=n,h.m=!0,this.board[e.f]=-1,this.board[s]=i.i,this.board[n]=h.i,this.castled[i.s]=!0,this.kings[h.s]=n,[{i:i.i,f:s,t:-1},{i:h.i,f:n,t:e.f,kp:e.f,who:h.s,m:!1},{i:i.i,f:-1,t:e.cg,m:!1,cg:!1}]},Model.Board.cbQuickApply=function(t,e){if(void 0!==e.cg)return this.cbApplyCastle(t,e,!1);var a=[],r=this.board[e.f],s=this.pieces[r];if(null!=e.c){a.unshift({i:e.c,f:-1,t:this.pieces[e.c].p});var i=this.pieces[e.c];this.board[i.p]=-1,i.p=-1}var n=this.kings[s.s];return t.g.pTypes[s.t].isKing&&(this.kings[s.s]=e.t),a.unshift({i:r,f:e.t,t:e.f,kp:n,who:s.s,ty:s.t}),s.p=e.t,void 0!==e.pr&&(s.t=e.pr),this.board[e.f]=-1,this.board[e.t]=r,a},Model.Board.cbQuickUnapply=function(t,e){for(var a=0;a<e.length;a++){var r=e[a],s=this.pieces[r.i];r.f>=0&&(s.p=-1,this.board[r.f]=-1),r.t>=0&&(s.p=r.t,this.board[r.t]=r.i),void 0!==r.m&&(s.m=r.m),void 0!==r.kp&&(this.kings[r.who]=r.kp),void 0!=r.ty&&(s.t=r.ty),void 0!=r.cg&&(this.castled[s.s]=r.cg)}},Model.Board.ApplyMove=function(t,e){var a=this.pieces[this.board[e.f]];if(void 0!==e.cg)this.cbApplyCastle(t,e,!0);else{if(this.zSign=t.zobrist.update(this.zSign,"board",a.i,e.f),this.board[a.p]=-1,void 0!==e.pr&&(this.zSign=t.zobrist.update(this.zSign,"type",a.t,a.i),a.t=e.pr,this.zSign=t.zobrist.update(this.zSign,"type",a.t,a.i)),null!=e.c){var r=this.pieces[e.c];this.zSign=t.zobrist.update(this.zSign,"board",r.i,r.p),this.board[r.p]=-1,r.p=-1,r.m=!0,this.noCaptCount=0}else this.noCaptCount++;a.p=e.t,a.m=!0,this.board[e.t]=a.i,this.zSign=t.zobrist.update(this.zSign,"board",a.i,e.t),t.g.pTypes[a.t].isKing&&(this.kings[a.s]=e.t)}this.check=!!e.ck,this.lastMove={f:e.f,t:e.t,c:e.c},void 0!==e.ko&&(this.ending[a.s]=e.ko),void 0!==e.ept?this.epTarget={p:e.ept,i:a.i}:this.epTarget=null,this.zSign=t.zobrist.update(this.zSign,"who",-this.mWho),this.zSign=t.zobrist.update(this.zSign,"who",this.mWho)},Model.Board.Evaluate=function(a){function r(e){var a=1/0;for(var r in t.geometry.corners)a=Math.min(a,o.distGraph[i.kings[e]][r]);return a-Math.sqrt(o.boardSize)}var s="debug"==arguments[3],i=this;this.mEvaluation=0;var n,h=this.mWho,o=a.g;if(e)n={1:{count:new Uint8Array(o.pTypes.length),byType:{}},"-1":{count:new Uint8Array(o.pTypes.length),byType:{}}};else{n={1:{count:[],byType:{}},"-1":{count:[],byType:{}}};for(var p=0;p<o.pTypes.length;p++)n[1].count[p]=n[-1].count[p]=0}if(a.mOptions.preventRepeat&&a.GetRepeatOccurence(this)>2)return this.mFinished=!0,void(this.mWinner=a.cbOnPerpetual?h*a.cbOnPerpetual:JocGame.DRAW);for(var c={1:0,"-1":0},l={1:o.distGraph[this.kings[-1]],"-1":o.distGraph[this.kings[1]]},b={1:0,"-1":0},u={1:0,"-1":0},v={1:0,"-1":0},f={1:0,"-1":0},g={1:!1,"-1":!1},d=this.pieces,G=d.length,p=0;p<G;p++){var m=d[p];if(m.p>=0){var C=m.s,M=o.pTypes[m.t];M.isKing?g[C]=m.m:c[C]+=M.value,M.castle&&!m.m&&f[C]++,u[C]++,b[C]+=l[C][m.p],v[C]+=t.geometry.distEdge[m.p];var y=n[C];y.count[m.t]++;var S=y.byType;void 0===S[m.t]?S[m.t]=[m]:S[m.t].push(m)}}if(this.lastMove&&null!=this.lastMove.c){var m=this.pieces[this.board[this.lastMove.t]];c[-m.s]+=this.cbStaticExchangeEval(a,m.p,m.s,{piece:m})}var A={1:0,"-1":0},T={1:0,"-1":0},k={1:0,"-1":0};this.ending[1]&&(T[1]=(b[1]-Math.sqrt(o.boardSize))/u[1],t.geometry.corners&&(k[1]=r(1))),this.ending[-1]&&(T[-1]=(b[-1]-Math.sqrt(o.boardSize))/u[-1],t.geometry.corners&&(k[1]=r(-1)));var R={pieceValue:c[1]-c[-1],pieceValueRatio:(c[1]-c[-1])/(c[1]+c[-1]+1),posValue:v[1]-v[-1],averageDistKing:b[1]/u[1]-b[-1]/u[-1],check:this.check?-h:0,endingKingFreedom:A[1]-A[-1],endingDistKing:T[1]-T[-1],distKingCorner:k[1]-k[-1]};t.castle&&(R.castle=(this.castled[1]?1:g[1]?0:f[1]/(o.castleablePiecesCount[1]+1))-(this.castled[-1]?1:g[-1]?0:f[-1]/(o.castleablePiecesCount[-1]+1))),t.evaluate&&t.evaluate.call(this,a,R,n);var E=a.mOptions.levelOptions;for(var P in R){var z=R[P],F=E[P+"Factor"]||0,L=z*F;s&&console.log(P,"=",z,"*",F,"=>",L),this.mEvaluation+=L}s&&console.log("Evaluation",this.mEvaluation)},Model.Board.cbGeneratePseudoLegalMoves=function(t){function e(e,s){var i=t.cbVar.promote;if(!i)return void r.push(s);var n=i.call(a,t,e,s);if(null!=n)if(0==n.length)r.push(s);else if(1==n.length)s.pr=n[0],r.push(s);else for(var h=0;h<n.length;h++){var o=n[h];r.push({f:s.f,t:s.t,c:s.c,pr:o,ept:s.ept,ep:s.ep,a:s.a})}}for(var a=this,r=[],s=t.cbVar,i=this.mWho,n=!s.castle||this.check||this.castled[i]?null:[],h=-1,o=this.pieces.length,p=0;p<o;p++){var c=this.pieces[p];if(!(c.p<0||c.s!=i)){var l=t.g.pTypes[c.t];l.isKing&&(c.m?n=null:h=c),n&&l.castle&&!c.m&&n.push(c);var b,u;b=l.graph[c.p],u=b.length;for(var v=0;v<u;v++)for(var f=b[v],g=!1,d=f.length,G=null,m=0;m<d;m++){var C=f[m],M=65535&C,y=this.board[M];if(!(y<0)||l.epCatch&&this.epTarget&&this.epTarget.p==M){if(!(524288&C)){var S;S=y<0?this.pieces[this.epTarget.i]:this.pieces[y],!(S.s!=c.s&&131072&C)||1048576&C&&!t.g.pTypes[S.t].isKing||2097152&C&&t.g.pTypes[S.t].isKing||e(c,{f:c.p,t:M,c:S.i,a:l.abbrev,ep:y<0});break}if(g){var S=this.pieces[y];S.s!=c.s&&e(c,{f:c.p,t:M,c:S.i,a:l.abbrev});break}g=!0}else 65536&C&&0==g&&e(c,{f:c.p,t:M,c:null,a:l.abbrev,ept:null!=G&&l.epTarget?G:void 0});G=M}}}if(n)for(var p=0;p<n.length;p++){var A=n[p],T=t.cbVar.castle[h.p+"/"+A.p];if(T){for(var k=!0,v=0;v<T.r.length;v++){var R=T.r[v];if(this.board[R]>=0&&R!=h.p&&R!=A.p){k=!1;break}}if(k){for(var E=!0,v=0;v<T.k.length;v++){var R=T.k[v];if(this.board[R]>=0&&R!=A.p&&R!=h.p||this.cbGetAttackers(t,R,i).length>0){E=!1;break}}E&&r.push({f:h.p,t:T.k[T.k.length-1],c:null,cg:A.p})}}}return r},Model.Board.cbStaticExchangeEval=function(t,e,a,r){var s=0,i=this.cbGetSmallestAttacker(t,e,a);if(i){var n=this.mWho;this.mWho=i.s;var h=this.cbQuickApply(t,{f:i.p,t:e,c:r.piece.i}),o=t.g.pTypes[r.piece.t].value;r.piece=i,s=Math.max(0,o-this.cbStaticExchangeEval(t,e,-a,r)),this.cbQuickUnapply(t,h),this.mWho=n}return s},Model.Board.cbGetSmallestAttacker=function(t,e,a){var r=this.cbGetAttackers(t,e,a);if(0==r.length)return null;for(var s=1/0,i=null,n=r.length,h=0;h<n;h++){var o=r[h],p=t.g.pTypes[o.t].value;p<s&&(s=p,i=o)}return i},Model.Board.cbCollectAttackers=function(t,e,a,r){for(var s in e){var i=e[s],n=this.board[s];if(n<0)this.cbCollectAttackers(t,i.e,a,r);else{var h=this.pieces[n];h.s==-t&&(i.t&&h.t in i.t||r&&i.tk&&h.t in i.tk)&&a.push(h)}}},Model.Board.cbCollectAttackersScreen=function(t,e,a,r,s){for(var i in e){var n=e[i],h=this.board[i];if(h<0)this.cbCollectAttackersScreen(t,n.e,a,r,s);else{var o=this.pieces[h];!s&&o.s==-t&&(n.t&&o.t in n.t||r&&n.tk&&o.t in n.tk)?a.push(o):s?s&&o.s==-t&&n.ts&&o.t in n.ts&&a.push(o):this.cbCollectAttackersScreen(t,n.e,a,r,!0)}}},Model.Board.cbGetAttackers=function(t,e,a,r){var s=[];return t.cbUseScreenCapture?this.cbCollectAttackersScreen(a,t.g.threatGraph[a][e],s,r,!1):this.cbCollectAttackers(a,t.g.threatGraph[a][e],s,r),s},Model.Board.GenerateMoves=function(t){var e=this.cbGeneratePseudoLegalMoves(t);this.mMoves=[];for(var a=!0,r=this.kings[this.mWho],s=e.length,i=0;i<s;i++){var n=e[i],h=this.cbQuickApply(t,n);if(!(this.cbGetAttackers(t,this.kings[this.mWho],this.mWho,!0).length>0)){var o=this.cbGetAttackers(t,this.kings[-this.mWho],-this.mWho,!0).length>0;n.ck=o,this.mMoves.push(n),n.f!=r&&(a=!1)}this.cbQuickUnapply(t,h)}if(0==this.mMoves.length)this.mFinished=!0,this.mWinner=t.cbOnStaleMate?t.cbOnStaleMate*this.mWho:JocGame.DRAW,this.check&&(this.mWinner=-this.mWho);else if(this.ending[this.mWho]){if(!a)for(var i=0;i<this.mMoves.length;i++)this.mMoves[i].ko=!1}else if(!this.ending[this.mWho]&&a&&!this.check)for(var i=0;i<this.mMoves.length;i++)this.mMoves[i].ko=!0},Model.Board.GetSignature=function(){return this.zSign},Model.Move.Init=function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e])},Model.Move.Equals=function(t){return this.f==t.f&&this.t==t.t&&this.pr==t.pr},Model.Move.CopyFrom=function(t){this.Init(t)},Model.Move.ToString=function(e){var a=this;switch(e=e||"natural"){case"natural":return function(){var e;if(void 0!==a.cg?e=t.castle[a.f+"/"+a.cg].n:(e=a.a||"",e+=t.geometry.PosName(a.f),null==a.c?e+="-":e+="x",e+=t.geometry.PosName(a.t)),void 0!==a.pr){var r=t.pieceTypes[a.pr];r&&r.abbrev&&r.abbrev.length>0&&!r.silentPromo&&(e+="="+r.abbrev)}return a.ck&&(e+="+"),e}();case"engine":return function(){var e=t.geometry.PosName(a.f)+t.geometry.PosName(a.t);if(void 0!=a.pr){var r=t.pieceTypes[a.pr];r&&r.abbrev&&r.abbrev.length>0&&!r.silentPromo&&(e+=r.abbrev)}return e}();default:return"??"}},Model.Board.CompactMoveString=function(e,a,r){"function"!=typeof a.ToString&&(a=e.CreateMove(a));var s=a.ToString(),i=/^([A-Z]?)([a-z])([1-9][0-9]*)([-x])([a-z])([1-9][0-9]*)(.*?)$/.exec(s);if(!i)return s;var n=i[7];if(r||(r={}),r.value||(r.value=[]),0==r.value.length){var h=this.mMoves;this.mMoves&&0!=this.mMoves.length||this.GenerateMoves(e);for(var o=0;o<this.mMoves.length;o++){var p=this.mMoves[o];"function"!=typeof p.ToString&&(p=e.CreateMove(p)),r.value.push({str:p.ToString(),move:p})}this.mMoves=h}var c=[];if(r.value.forEach(function(t){var e=/^([A-Z]?[a-z][1-9][0-9]*[-x][a-z][1-9][0-9]*)(.*?)$/.exec(t.str);e&&t.move.t==a.t&&(t.move.a||"")==i[1]&&e[2]==n&&c.push(t.move)}),1==c.length)return""==i[1]&&"x"==i[4]?i[2]+"x"+i[5]+i[6]+i[7]:i[1]+("x"==i[4]?"x":"")+i[5]+i[6]+i[7];if(t.geometry.CompactCrit)for(var l="",o=0;;o++){var b=t.geometry.CompactCrit(a.f,o);if(null==b)return s;l+=b;for(var u=[],v=0;v<c.length;v++){var f=c[v];t.geometry.CompactCrit(f.f,o)==b&&u.push(f)}if(console.assert(u.length>0),1==u.length)return i[1]+l+("x"==i[4]?"x":"")+i[5]+i[6]+i[7];c=u}return s},Model.Board.cbIntegrity=function(t){function e(t,e){t||console.error(e)}for(var a=this,r=0;r<this.board.length;r++){var s=this.board[r];if(s>=0){var i=a.pieces[s];e(void 0!==i,"no piece at pos"),e(i.p==r,"piece has different pos")}}for(var s=0;s<this.pieces.length;s++){var i=this.pieces[s];i.p>=0&&e(a.board[i.p]==s,"board index mismatch")}},Model.Board.ExportBoardState=function(t){return t.cbVar.geometry.ExportBoardState?t.cbVar.geometry.ExportBoardState(this,t.cbVar,t.mPlayedMoves.length):"not supported"},Model.Game.Import=function(e,a){var r,s=[],i={1:{},"-1":{}},n=null,h=0;if("pjn"==e){var o={status:!1,error:"parse"},p=a.split(" ");if(6!=p.length)return console.warn("FEN should have 6 parts"),o;var c=p[0].split("/"),l=t.geometry.fenHeight||t.geometry.height;if(c.length!=l)return console.warn("FEN board should have",l,"rows, got",c.length),o;var b={};for(var u in t.pieceTypes){var v=t.pieceTypes[u],f=v.fenAbbrev||v.abbrev||"X";b[f.toUpperCase()]={s:1,t:u},b[f.toLowerCase()]={s:-1,t:u}}var g=t.geometry.FenRowPos||function(e,a){return(t.geometry.height-1-e)*t.geometry.width+a};if(c.forEach(function(e,a){for(var r=0,i=0;i<e.length;i++){var n=e.substr(i,1),h=b[n];if(void 0!==h){var p=g(a,r);r++;for(var c={s:h.s,t:h.t,p:p},l=!0,u=t.pieceTypes[c.t].initial||[],v=0;v<u.length;v++){var f=u[v];f.s==c.s&&f.p==p&&(l=!1)}c.m=l,s.push(c)}else{if(isNaN(parseInt(n)))return console.warn("FEN invalid board spec",n),o;r+=parseInt(n)}}}),s.sort(function(t,e){return e.s-t.s}),"w"==p[1])r=1;else{if("b"!=p[1])return console.warn("FEN invalid turn spec",p[1]),o;r=-1}i[1].k=p[2].indexOf("K")>=0,i[1].q=p[2].indexOf("Q")>=0,i[-1].k=p[2].indexOf("k")>=0,i[-1].q=p[2].indexOf("q")>=0,n="-"==p[3]?null:p[3];var d=parseInt(p[4]);isNaN(d)||(h=d);var G={pieces:s,turn:r,castle:i,enPassant:n,noCaptCount:h};return t.importGame&&t.importGame.call(this,G,e,a),{status:!0,initial:G}}return{status:!1,error:"unsupported"}}}(),function(){Model.Game.cbBoardGeometryGrid=function(t,e){function a(e){return e%t}function r(e){return Math.floor(e/t)}function s(e,a){return a*t+e}function i(i,n){var h=a(i),o=r(i),p=h+n[0],c=o+n[1];return p<0||p>=t||c<0||c>=e?null:s(p,c)}function n(t){return String.fromCharCode("a".charCodeAt(0)+a(t))+(r(t)+1)}function h(t){var e=/^([a-z])([0-9]+)$/.exec(t);return e?s(e[1].charCodeAt(0)-"a".charCodeAt(0),parseInt(e[2])-1):-1}function o(t,e){return 0==e?String.fromCharCode("a".charCodeAt(0)+a(t)):1==e?r(t)+1:null}function p(){for(var s=[],i=0;i<t*e;i++){var n=[];s.push(n);for(var h=0;h<t*e;h++){var o=r(i),p=a(i),c=r(h),l=a(h);n.push(Math.max(Math.abs(o-c),Math.abs(p-l)))}}return s}function c(a,r,i){for(var h=[],o=e-1;o>=0;o--){for(var p="",c=0,l=0;l<t;l++){var b=a.board[s(l,o)];if(b<0)c++;else{c>0&&(p+=c,c=0);var u=a.pieces[b],v=r.pieceTypes[u.t].fenAbbrev||r.pieceTypes[u.t].abbrev||"?";-1==u.s?p+=v.toLowerCase():p+=v.toUpperCase()}}c&&(p+=c),h.push(p)}var f=h.join("/");f+=" ",1==a.mWho?f+="w":f+="b",f+=" ";var g="";return a.castled&&(!1===a.castled[1]?g+="KQ":(a.castled[1].k&&(g+="K"),a.castled[1].q&&(g+="Q")),!1===a.castled[-1]?g+="kq":(a.castled[-1].k&&(g+="k"),a.castled[-1].q&&(g+="q"))),0==g.length&&(g="-"),f+=g,f+=" ",a.epTarget?f+=n(a.epTarget.p):f+="-",f+=" ",f+=a.noCaptCount,f+=" ",f+=Math.floor(i/2)+1}return{boardSize:t*e,width:t,height:e,C:a,R:r,POS:s,Graph:i,PosName:n,PosByName:h,CompactCrit:o,GetDistances:p,distEdge:function(){for(var s=[],i=0;i<t*e;i++){var n=a(i),h=r(i);s[i]=Math.min(n,Math.abs(t-n-1),h,Math.abs(e-h-1))}return s}(),corners:function(){var a={};return a[s(0,0)]=1,a[s(0,e-1)]=1,a[s(t-1,0)]=1,a[s(t-1,e-1)]=1,a}(),ExportBoardState:c}},Model.Game.cbPawnGraph=function(t,e,a){for(var r=this,s={},i=0;i<t.boardSize;i++)if(!a||i in a){var n=[],h=t.Graph(i,[0,e]);null!=h&&(!a||h in a)&&n.push(r.cbTypedArray([h|r.cbConstants.FLAG_MOVE])),[-1,1].forEach(function(s){var h=t.Graph(i,[s,e]);null!=h&&(!a||h in a)&&n.push(r.cbTypedArray([h|r.cbConstants.FLAG_CAPTURE]))}),s[i]=n}else s[i]=[];return s},Model.Game.cbInitialPawnGraph=function(t,e,a){for(var r=this,s={},i=0;i<t.boardSize;i++)if(!a||i in a){var n=[],h=t.Graph(i,[0,e]);if(null!=h&&(!a||h in a)){var o=[h|r.cbConstants.FLAG_MOVE],p=t.Graph(h,[0,e]);null!=p&&(!a||p in a)&&o.push(p|r.cbConstants.FLAG_MOVE),n.push(r.cbTypedArray(o))}[-1,1].forEach(function(s){var h=t.Graph(i,[s,e]);null!=h&&(!a||h in a)&&n.push(r.cbTypedArray([h|r.cbConstants.FLAG_CAPTURE]))}),s[i]=n}else s[i]=[];return s},Model.Game.cbKingGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],e)},Model.Game.cbKnightGraph=function(t,e){return this.cbShortRangeGraph(t,[[2,-1],[2,1],[-2,-1],[-2,1],[-1,2],[-1,-2],[1,2],[1,-2]],e)},Model.Game.cbHorseGraph=function(t){for(var e=this,a={},r=0;r<t.boardSize;r++)a[r]=[],[[1,0,2,-1],[1,0,2,1],[-1,0,-2,-1],[-1,0,-2,1],[0,1,-1,2],[0,-1,-1,-2],[0,1,1,2],[0,-1,1,-2]].forEach(function(s){var i=t.Graph(r,[s[0],s[1]]);if(null!=i){var n=t.Graph(r,[s[2],s[3]]);null!=n&&a[r].push(e.cbTypedArray([i|e.cbConstants.FLAG_STOP,n|e.cbConstants.FLAG_MOVE|e.cbConstants.FLAG_CAPTURE]))}});return a},Model.Game.cbRookGraph=function(t,e){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0]],e)},Model.Game.cbBishopGraph=function(t,e){return this.cbLongRangeGraph(t,[[1,-1],[1,1],[-1,1],[-1,-1]],e)},Model.Game.cbQueenGraph=function(t,e){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0],[1,-1],[1,1],[-1,1],[-1,-1]],e)},Model.Game.cbXQGeneralGraph=function(t,e){for(var a=this,r={},s=0;s<t.boardSize;s++)r[s]=[],[[-1,0,!1],[0,-1,!0],[0,1,!0],[1,0,!1]].forEach(function(i){var n=[],h=t.Graph(s,i);if(null!=h&&((!e||h in e)&&n.push(h|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE),i[2]))for(var o=t.Graph(h,i);null!=o;)!e||o in e?n.push(o|a.cbConstants.FLAG_CAPTURE|a.cbConstants.FLAG_CAPTURE_KING):n.push(o|a.cbConstants.FLAG_STOP),o=t.Graph(o,i);n.length>0&&r[s].push(a.cbTypedArray(n))});return r},Model.Game.cbXQSoldierGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e]])},Model.Game.cbXQPromoSoldierGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e],[-1,0],[1,0]])},Model.Game.cbXQAdvisorGraph=function(t,e){return this.cbShortRangeGraph(t,[[1,1],[-1,1],[1,-1],[-1,-1]],e)},Model.Game.cbXQCannonGraph=function(t){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0]],null,this.cbConstants.FLAG_MOVE|this.cbConstants.FLAG_SCREEN_CAPTURE)},Model.Game.cbXQElephantGraph=function(t,e){for(var a=this,r={},s=0;s<t.boardSize;s++)r[s]=[],(!e||s in e)&&[[1,1,2,2],[1,-1,2,-2],[-1,1,-2,2],[-1,-1,-2,-2]].forEach(function(i){var n=t.Graph(s,[i[0],i[1]]);if(null!=n){var h=t.Graph(s,[i[2],i[3]]);null!=h&&(!e||h in e)&&r[s].push(a.cbTypedArray([n|a.cbConstants.FLAG_STOP,h|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE]))}});return r},Model.Game.cbSilverGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e],[-1,-1],[-1,1],[1,-1],[1,1]])},Model.Game.cbFersGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1]])},Model.Game.cbSchleichGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,0],[1,0],[0,-1],[0,1]])},Model.Game.cbAlfilGraph=function(t,e){return this.cbShortRangeGraph(t,[[-2,-2],[-2,2],[2,2],[2,-2]])}}(),function(){var t=Model.Game.cbBoardGeometryGrid(16,16);Model.Game.cbGriffonGraph=function(t){for(var e=this,a=e.cbConstants.FLAG_MOVE|e.cbConstants.FLAG_CAPTURE,r={},s=0;s<t.boardSize;s++)r[s]=[],[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(i){var n=t.Graph(s,i);if(null!=n)for(var h=0;h<2;h++){for(var o=[],p=1;p<15;p++){var c=[];c[h]=i[h]*p,c[1-h]=0;var l=t.Graph(n,c);null!=l&&(1==p&&o.push(n|e.cbConstants.FLAG_STOP),o.push(l|a))}o.length>0&&r[s].push(e.cbTypedArray(o))}});return e.cbMergeGraphs(t,e.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1]]),r)},Model.Game.cbRhinoGraph=function(t,e){for(var a=this,r=a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE,s={},i=0;i<t.boardSize;i++){var n=[];[[0,1],[1,0],[-1,0],[0,-1]].forEach(function(e){var s=[Math.sign(e[0]),Math.sign(e[1])],h=t.Graph(i,e);if(0==s[0]?(xleft=-1,xright=1):(xleft=s[0],xright=s[0]),0==s[1]?(yleft=-1,yright=1):(yleft=s[1],yright=s[1]),null!=h){for(var o=(a.cbConstants.FLAG_MOVE,a.cbConstants.FLAG_CAPTURE,a.cbConstants.FLAG_STOP,Math.max(15,15)-1),p=[],c=[],l=1;l<o;l++){var b=[xleft*l,yleft*l],u=[xright*l,yright*l],v=t.Graph(h,b),f=t.Graph(h,u);null!=v&&(p.push(h|a.cbConstants.FLAG_STOP),p.push(v|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE|a.cbConstants.FLAG_STOP)),null!=f&&(c.push(h|a.cbConstants.FLAG_STOP),c.push(f|r|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE|a.cbConstants.FLAG_STOP))}p.length>0&&n.push(a.cbTypedArray(p)),c.length>0&&n.push(a.cbTypedArray(c))}}),s[i]=n}return a.cbMergeGraphs(t,a.cbShortRangeGraph(t,[[0,1],[1,0],[-1,0],[0,-1]]),s)},Model.Game.cbSnakeGraph=function(t,e){for(var a=this,r=a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE,s={},i=0;i<t.boardSize;i++){var n=[];[[0,1],[0,-1]].forEach(function(e){var s=[Math.sign(e[0]),Math.sign(e[1])],h=t.Graph(i,e);if(0==s[0]?(xleft=-1,xright=1):(xleft=s[0],xright=s[0]),0==s[1]?(yleft=-1,yright=1):(yleft=s[1],yright=s[1]),null!=h){for(var o=(a.cbConstants.FLAG_MOVE,a.cbConstants.FLAG_CAPTURE,a.cbConstants.FLAG_STOP,Math.max(15,15)-1),p=[],c=[],l=1;l<o;l++){var b=[xleft*l,yleft*l],u=[xright*l,yright*l],v=t.Graph(h,b),f=t.Graph(h,u);null!=v&&(p.push(h|a.cbConstants.FLAG_STOP),p.push(v|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE|a.cbConstants.FLAG_STOP)),null!=f&&(c.push(h|a.cbConstants.FLAG_STOP),c.push(f|r|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE|a.cbConstants.FLAG_STOP))}p.length>0&&n.push(a.cbTypedArray(p)),c.length>0&&n.push(a.cbTypedArray(c))}}),s[i]=n}return a.cbMergeGraphs(t,a.cbShortRangeGraph(t,[[0,1],[0,-1]]),s)},Model.Game.cbShipGraph=function(t){for(var e=this,a=e.cbConstants.FLAG_MOVE|e.cbConstants.FLAG_CAPTURE,r={},s=0;s<t.boardSize;s++)r[s]=[],[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(i){var n=t.Graph(s,i);if(null!=n)for(var h=1;h<2;h++){for(var o=[],p=1;p<15;p++){var c=[];c[h]=i[h]*p,c[1-h]=0;var l=t.Graph(n,c);null!=l&&(1==p&&o.push(n|e.cbConstants.FLAG_STOP),o.push(l|a))}o.length>0&&r[s].push(e.cbTypedArray(o))}});return e.cbMergeGraphs(t,e.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1]]),r)},Model.Game.cbPrinceGraph=function(t,e,a){for(var r=this,s={},i=0;i<t.boardSize;i++)if(!a||i in a){s[i]=[];var n=[],h=t.Graph(i,[0,e]);null!=h&&(!a||h in a)&&(n.push(h|r.cbConstants.FLAG_MOVE|r.cbConstants.FLAG_CAPTURE),h=t.Graph(h,[0,e]),null!=h&&(!a||h in a)&&n.push(h|r.cbConstants.FLAG_MOVE),s[i].push(r.cbTypedArray(n)))}else s[i]=[];return r.cbMergeGraphs(t,r.cbShortRangeGraph(t,[[-1,-1],[-1,1],[-1,0],[1,0],[1,-1],[1,1],[0,-e]]),s)};for(var e={},a=0;a<t.boardSize;a++)e[a]=1;Model.Game.cbDefine=function(){return{geometry:t,pieceTypes:{0:{name:"ipawn-w",aspect:"fr-pawn",graph:this.cbInitialPawnGraph(t,1),value:.8,abbrev:"",fenAbbrev:"P",initial:[{s:1,p:64},{s:1,p:65},{s:1,p:66},{s:1,p:67},{s:1,p:68},{s:1,p:69},{s:1,p:70},{s:1,p:71},{s:1,p:72},{s:1,p:73},{s:1,p:74},{s:1,p:75},{s:1,p:76},{s:1,p:77},{s:1,p:78},{s:1,p:79}],epCatch:!0,epTarget:!0},1:{name:"ipawn-b",aspect:"fr-pawn",graph:this.cbInitialPawnGraph(t,-1),value:.8,abbrev:"",fenAbbrev:"P",initial:[{s:-1,p:176},{s:-1,p:177},{s:-1,p:178},{s:-1,p:179},{s:-1,p:180},{s:-1,p:181},{s:-1,p:182},{s:-1,p:183},{s:-1,p:184},{s:-1,p:185},{s:-1,p:186},{s:-1,p:187},{s:-1,p:188},{s:-1,p:189},{s:-1,p:190},{s:-1,p:191}],epCatch:!0,epTarget:!0},2:{name:"hawk",aspect:"fr-hawk",graph:this.cbShortRangeGraph(t,[[-3,3],[-2,2],[0,2],[2,2],[3,3],[0,3],[3,3],[-2,0],[-3,0],[2,0],[3,0],[0,-2],[0,-3],[2,-2],[3,-3],[0,2],[0,3],[-2,-2],[-3,-3]]),value:5.5,abbrev:"H",initial:[{s:1,p:0},{s:1,p:15},{s:-1,p:240},{s:-1,p:255}]},3:{name:"mammoth",aspect:"fr-mammoth",graph:this.cbMergeGraphs(t,this.cbKingGraph(t),this.cbShortRangeGraph(t,[[-2,-2],[0,-2],[-2,2],[0,2],[2,2],[2,0],[-2,2],[-2,0],[0,-2],[2,-2]])),value:6.2,abbrev:"M",initial:[{s:1,p:1},{s:1,p:14},{s:-1,p:241},{s:-1,p:254}]},4:{name:"squirle",aspect:"fr-squirle",graph:this.cbShortRangeGraph(t,[[-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]]),value:6,abbrev:"SQ",initial:[{s:1,p:2},{s:1,p:13},{s:-1,p:242},{s:-1,p:253}]},5:{name:"Cheetah",aspect:"fr-leopard",graph:this.cbShortRangeGraph(t,[[-3,0],[-3,-1],[-3,-2],[-3,-3],[-3,1],[-3,2],[-3,3],[3,0],[3,-1],[3,-2],[3,-3],[3,1],[3,2],[3,3],[-2,3],[-1,3],[0,3],[1,3],[2,3],[-2,-3],[-1,-3],[0,-3],[1,-3],[2,-3]]),value:8.5,abbrev:"C",initial:[{s:1,p:3},{s:1,p:12},{s:-1,p:243},{s:-1,p:252}]},6:{name:"ship",aspect:"fr-ship",graph:this.cbShipGraph(t),value:5,abbrev:"S",initial:[{s:1,p:36},{s:1,p:43},{s:-1,p:212},{s:-1,p:219}]},7:{name:"snake",aspect:"fr-dragon",graph:this.cbSnakeGraph(t),value:3.7,abbrev:"N",initial:[{s:1,p:37},{s:1,p:42},{s:-1,p:213},{s:-1,p:218}]},8:{name:"king",aspect:"fr-king",isKing:!0,graph:this.cbKingGraph(t),abbrev:"K",initial:[{s:1,p:23},{s:-1,p:231}]},9:{name:"troll-w",abbrev:"T",aspect:"fr-huscarl",graph:this.cbMergeGraphs(t,this.cbPawnGraph(t,1),this.cbShortRangeGraph(t,[[-3,3],[0,3],[3,3],[-3,0],[3,0],[-3,-3],[0,-3],[-3,3]])),value:3.2,initial:[{s:1,p:48},{s:1,p:50},{s:1,p:52},{s:1,p:54},{s:1,p:56},{s:1,p:58},{s:1,p:60},{s:1,p:62}]},10:{name:"troll-b",abbrev:"T",aspect:"fr-huscarl",graph:this.cbMergeGraphs(t,this.cbPawnGraph(t,-1),this.cbShortRangeGraph(t,[[-3,3],[0,3],[3,3],[-3,0],[3,0],[-3,-3],[0,-3],[-3,3]])),value:3.2,initial:[{s:-1,p:192},{s:-1,p:194},{s:-1,p:196},{s:-1,p:198},{s:-1,p:200},{s:-1,p:202},{s:-1,p:204},{s:-1,p:206}]},11:{name:"princew",abbrev:"P",aspect:"fr-prince",graph:this.cbPrinceGraph(t,1,e),value:3.1,initial:[{s:1,p:38},{s:1,p:41}],epTarget:!0},12:{name:"princeb",abbrev:"P",aspect:"fr-prince",graph:this.cbPrinceGraph(t,-1,e),value:3.1,initial:[{s:-1,p:214},{s:-1,p:217}],epTarget:!0},13:{name:"griffon",abbrev:"G",aspect:"fr-griffin",graph:this.cbGriffonGraph(t),value:9,initial:[{s:1,p:25},{s:-1,p:233}]},14:{name:"rhino",abbrev:"U",aspect:"fr-rhino",graph:this.cbRhinoGraph(t),value:8.1,initial:[{s:1,p:10},{s:-1,p:250}]},15:{name:"direwolf",abbrev:"O",aspect:"fr-wolf",graph:this.cbShortRangeGraph(t,[[-3,-3],[-3,3],[3,-3],[3,3],[3,0],[0,3],[-3,0],[0,-3],[-3,2],[-3,1],[3,-1],[3,-2],[3,1],[3,2],[1,3],[2,3],[1,-3],[2,-3],[-3,-1],[-3,-2],[-1,3],[-2,3],[-1,-3],[-2,-3],[-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]]),value:17.4,initial:[{s:1,p:8},{s:-1,p:248}]},16:{name:"soldierw",abbrev:"S",aspect:"fr-corporal",graph:this.cbMergeGraphs(t,this.cbInitialPawnGraph(t,1),this.cbShortRangeGraph(t,[[-1,0],[1,0]])),value:.9,initial:[{s:1,p:49},{s:1,p:51},{s:1,p:53},{s:1,p:55},{s:1,p:57},{s:1,p:59},{s:1,p:61},{s:1,p:63}],epCatch:!0,epTarget:!0},17:{name:"soldierb",abbrev:"S",aspect:"fr-corporal",graph:this.cbMergeGraphs(t,this.cbInitialPawnGraph(t,-1),this.cbShortRangeGraph(t,[[-1,0],[1,0]])),value:.9,initial:[{s:-1,p:193},{s:-1,p:195},{s:-1,p:197},{s:-1,p:199},{s:-1,p:201},{s:-1,p:203},{s:-1,p:205},{s:-1,p:207}],epCatch:!0,epTarget:!0},18:{name:"machine",abbrev:"W",aspect:"fr-machine",graph:this.cbShortRangeGraph(t,[[-1,0],[-2,0],[1,0],[2,0],[0,1],[0,2],[0,-1],[0,-2]],e),value:3,initial:[{s:1,p:39},{s:1,p:40},{s:-1,p:215},{s:-1,p:216}]},19:{name:"rook",abbrev:"R",aspect:"fr-rook",graph:this.cbRookGraph(t,e),value:5,initial:[{s:1,p:33},{s:1,p:46},{s:-1,p:209},{s:-1,p:222}]},20:{name:"knight",abbrev:"N",aspect:"fr-knight",graph:this.cbKnightGraph(t,e),value:2.5,initial:[{s:1,p:34},{s:1,p:45},{s:-1,p:210},{s:-1,p:221}]},21:{name:"bishop",abbrev:"B",aspect:"fr-bishop",graph:this.cbBishopGraph(t,e),value:4.1,initial:[{s:1,p:35},{s:1,p:44},{s:-1,p:211},{s:-1,p:220}]},22:{name:"elephant",abbrev:"E",aspect:"fr-elephant",graph:this.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]],e),value:2.8,initial:[{s:1,p:32},{s:1,p:47},{s:-1,p:208},{s:-1,p:223
}]},23:{name:"centaur",abbrev:"J",aspect:"fr-crowned-knight",graph:this.cbMergeGraphs(t,this.cbKnightGraph(t,e),this.cbKingGraph(t,e)),value:6.1,initial:[{s:1,p:4},{s:1,p:11},{s:-1,p:244},{s:-1,p:251}]},24:{name:"Buffalo",abbrev:"F",aspect:"fr-buffalo",graph:this.cbShortRangeGraph(t,[[1,2],[1,3],[2,1],[2,3],[3,1],[3,2],[1,-2],[1,-3],[2,-1],[2,-3],[3,-1],[3,-2],[-1,-2],[-1,-3],[-2,-1],[-2,-3],[-3,-1],[-3,-2],[-1,2],[-1,3],[-2,1],[-2,3],[-3,1],[-3,2]],e),value:8.9,initial:[{s:1,p:5},{s:-1,p:245}]},25:{name:"sorcerer",abbrev:"O",aspect:"fr-star",graph:this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0],[1,1],[1,-1],[-1,-1],[-1,1]],null,this.cbConstants.FLAG_MOVE|this.cbConstants.FLAG_SCREEN_CAPTURE),value:7,initial:[{s:1,p:6},{s:-1,p:246}]},26:{name:"amazon",abbrev:"A",aspect:"fr-amazon",graph:this.cbMergeGraphs(t,this.cbKnightGraph(t,e),this.cbQueenGraph(t,e)),value:15,initial:[{s:1,p:7},{s:-1,p:247}]},27:{name:"cannon",abbrev:"C",aspect:"fr-cannon2",graph:this.cbXQCannonGraph(t),value:3.6,initial:[{s:1,p:16},{s:1,p:31},{s:-1,p:224},{s:-1,p:239}]},28:{name:"camel",abbrev:"M",aspect:"fr-camel",graph:this.cbShortRangeGraph(t,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),value:2.6,initial:[{s:1,p:17},{s:1,p:30},{s:-1,p:225},{s:-1,p:238}]},29:{name:"giraffe",abbrev:"Z",aspect:"fr-giraffe",graph:this.cbShortRangeGraph(t,[[-3,-2],[-3,2],[3,-2],[3,2],[2,3],[2,-3],[-2,3],[-2,-3]]),value:2.4,initial:[{s:1,p:18},{s:1,p:29},{s:-1,p:226},{s:-1,p:237}],epCatch:!0,epTarget:!0},30:{name:"bow",abbrev:"V",aspect:"fr-bow",graph:this.cbLongRangeGraph(t,[[-1,-1],[1,1],[-1,1],[1,-1]],null,this.cbConstants.FLAG_MOVE|this.cbConstants.FLAG_SCREEN_CAPTURE),value:2.6,initial:[{s:1,p:19},{s:1,p:28},{s:-1,p:227},{s:-1,p:236}]},31:{name:"amiral",abbrev:"S",aspect:"fr-crowned-rook",graph:this.cbMergeGraphs(t,this.cbKingGraph(t,e),this.cbRookGraph(t,e)),value:6.8,initial:[{s:1,p:20},{s:-1,p:228}]},32:{name:"missionnary",abbrev:"Y",aspect:"fr-crowned-bishop",graph:this.cbMergeGraphs(t,this.cbKingGraph(t,e),this.cbBishopGraph(t,e)),value:6,initial:[{s:1,p:27},{s:-1,p:235}]},33:{name:"cardinal",abbrev:"X",aspect:"fr-cardinal",graph:this.cbMergeGraphs(t,this.cbKnightGraph(t,e),this.cbBishopGraph(t,e)),value:6.75,initial:[{s:1,p:21},{s:-1,p:229}]},34:{name:"marshall",abbrev:"H",aspect:"fr-marshall",graph:this.cbMergeGraphs(t,this.cbKnightGraph(t,e),this.cbRookGraph(t,e)),value:8.5,initial:[{s:1,p:26},{s:-1,p:234}]},35:{name:"lion",abbrev:"L",aspect:"fr-lion",graph:this.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1],[1,0],[0,1],[-1,0],[0,-1],[-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]],e),value:10,initial:[{s:1,p:22},{s:-1,p:230}]},36:{name:"queen",abbrev:"Q",aspect:"fr-queen",graph:this.cbQueenGraph(t,e),value:10.5,initial:[{s:1,p:24},{s:-1,p:232}]},37:{name:"duchess",abbrev:"D",aspect:"fr-duchess",graph:this.cbMergeGraphs(t,this.cbKingGraph(t,e),this.cbShortRangeGraph(t,[[2,0],[3,0],[-2,0],[-3,0],[-2,0],[0,2],[0,3],[0,-2],[0,-3],[-3,-3],[-2,-2],[-3,-3],[2,2],[3,3],[2,-2],[3,-3],[-2,2],[-3,3]],e)),value:9.5,initial:[{s:1,p:9},{s:-1,p:249}]}},promote:function(e,a,r){return 0==a.t&&15==t.R(r.t)||1==a.t&&0==t.R(r.t)?[36]:16==a.t&&15==t.R(r.t)||17==a.t&&0==t.R(r.t)?[36]:11==a.t&&15==t.R(r.t)?[26]:12==a.t&&0==t.R(r.t)?[26]:6==a.t&&(15==t.R(r.t)&&a.s>0||0==t.R(r.t)&&a.s<0)?[13]:7==a.t&&(15==t.R(r.t)&&a.s>0||0==t.R(r.t)&&a.s<0)?[14]:9==a.t&&15==t.R(r.t)&&a.s>0&&a.p>223?[15]:10==a.t&&0==t.R(r.t)&&a.s<0&&a.p<32?[15]:20!=a.t&&28!=a.t&&29!=a.t||!(15==t.R(r.t)&&a.s>0||0==t.R(r.t)&&a.s<0)?22!=a.t&&18!=a.t&&23!=a.t&&3!=a.t&&4!=a.t||!(15==t.R(r.t)&&a.s>0||0==t.R(r.t)&&a.s<0)?2==a.t&&(15==t.R(r.t)&&a.s>0||0==t.R(r.t)&&a.s<0)?[37]:[]:[35]:[24]}}}}();