exports.model=Model={Game:{},Board:{},Move:{}},function(){var t;Model.Game.cbConstants={MASK:65535,FLAG_MOVE:65536,FLAG_CAPTURE:131072,FLAG_STOP:262144,FLAG_SCREEN_CAPTURE:524288,FLAG_CAPTURE_KING:1048576,FLAG_CAPTURE_NO_KING:2097152};var e="undefined"!=typeof Int32Array;Model.Game.cbUseTypedArrays=e,Model.Game.cbTypedArray=function(t){if(e){var a=new Int32Array(t.length);return a.set(t),a}for(var i=[],r=t.length,s=0;s<r;s++)i.push(t[s]);return i},Model.Game.cbShortRangeGraph=function(t,e,a,i){var r=this;void 0===i&&(i=196608);for(var s={},n=0;n<t.boardSize;n++)s[n]=[],(!a||n in a)&&e.forEach(function(e){var o=t.Graph(n,e);null!=o&&(!a||o in a)&&s[n].push(r.cbTypedArray([o|i]))});return s},Model.Game.cbLongRangeGraph=function(t,e,a,i,r){var s=this;void 0!==i&&null!=i||(i=196608),r||(r=1/0);for(var n={},o=0;o<t.boardSize;o++)n[o]=[],(!a||o in a)&&e.forEach(function(e){for(var h=[],p=t.Graph(o,e),c=0;null!=p&&(!a||p in a)&&(h.push(p|i),++c!=r);)p=t.Graph(p,e);h.length>0&&n[o].push(s.cbTypedArray(h))});return n},Model.Game.cbNullGraph=function(t){for(var e={},a=0;a<t.boardSize;a++)e[a]=[];return e},Model.Game.cbAuthorGraph=function(t){for(var e={},a=0;a<t.boardSize;a++){e[a]=[];for(var i=0;i<t.boardSize;i++)e[a].push([2293760|i])}return e},Model.Game.cbMergeGraphs=function(t){for(var e=[],a=0;a<t.boardSize;a++){e[a]=[];for(var i=1;i<arguments.length;i++)e[a]=e[a].concat(arguments[i][a])}return e},Model.Game.cbGetThreatGraph=function(){function t(e,a){for(var i in n){var r=n[i];if(!(r.p.length<a.length+1)){for(var s=!0,o=0;o<a.length;o++)if(a[o]!=r.p[o]){s=!1;break}if(s){var h=r.p[a.length],p=e[h];void 0===p&&(p={e:{}},e[h]=p),r.p.length==a.length+1&&(p.t=r.t,p.ts=r.ts,p.tk=r.tk,delete n[i]),a.push(h),t(p.e,a),a.pop()}}}}var e=this;this.cbUseScreenCapture=!1,this.cbUseCaptureKing=!1,this.cbUseCaptureNoKing=!1;for(var a={1:[],"-1":[]},i=[],r=0;r<this.g.boardSize;r++)this.g.pTypes.forEach(function(t,a){t.graph[r].forEach(function(t){for(var s=[],n=0;n<t.length;n++){var o=t[n];1048576&o?(e.cbUseCaptureKing=!0,s.unshift({d:65535&o,a:r,tk:a})):2097152&o?(e.cbUseCaptureNoKing=!0,s.unshift({d:65535&o,a:r,tnk:a})):131072&o?s.unshift({d:65535&o,a:r,t:a}):262144&o?s.unshift({d:65535&o,a:r}):524288&o&&(e.cbUseScreenCapture=!0,s.unshift({d:65535&o,a:r,ts:a}))}s.length>0&&i.push(s)})});var s={};i.forEach(function(t){t.forEach(function(e,a){var i=s[e.d];void 0===i&&(i={},s[e.d]=i);for(var r=[],n=a+1;n<t.length;n++)r.push(t[n].d);r.push(e.a);var o=r.join(","),h=i[o];void 0===h&&(h={p:r,t:{},ts:{},tk:{}},i[o]=h),void 0!==e.t?h.t[e.t]=!0:void 0!==e.tk?h.tk[e.tk]=!0:void 0!==e.ts&&(h.ts[e.ts]=!0)})});for(var r=0;r<e.g.boardSize;r++){var n=s[r],o={};t(o,[]),a[1][r]=o,a[-1][r]=o}return a},Model.Game.InitGame=function(){var e=this;this.cbVar=t=this.cbDefine(),this.g.boardSize=this.cbVar.geometry.boardSize,this.g.pTypes=this.cbGetPieceTypes(),this.g.threatGraph=this.cbGetThreatGraph(),this.g.distGraph=this.cbVar.geometry.GetDistances(),this.cbPiecesCount=0,this.g.castleablePiecesCount={1:0,"-1":0};for(var a in t.pieceTypes){var i=t.pieceTypes[a];if(i.castle){(i.initial||[]).forEach(function(t){e.g.castleablePiecesCount[t.s]++})}i.initial&&(this.cbPiecesCount+=i.initial.length)}for(var r=[],a=0;a<this.cbPiecesCount;a++)r.push(a);var s=Object.keys(t.pieceTypes);this.zobrist=new JocGame.Zobrist({board:{type:"array",size:this.cbVar.geometry.boardSize,values:r},who:{values:["1","-1"]},type:{type:"array",size:this.cbPiecesCount,values:s}})},Model.Game.cbGetPieceTypes=function(){for(var t=[],e={},a=0;a<this.cbVar.geometry.boardSize;a++)e[a]=[];for(var i in this.cbVar.pieceTypes){var r=this.cbVar.pieceTypes[i];t[i]={graph:r.graph||e,abbrev:r.abbrev||"",value:r.isKing?100:r.value||1,isKing:!!r.isKing,castle:!!r.castle,epTarget:!!r.epTarget,epCatch:!!r.epCatch}}return t},Model.Board.Init=function(t){this.zSign=0},Model.Board.InitialPosition=function(a){var i=this;this.board=e?new Int16Array(a.g.boardSize):[];for(var r=0;r<a.g.boardSize;r++)this.board[r]=-1;if(this.kings={},this.pieces=[],this.ending={1:!1,"-1":!1},this.lastMove=null,a.cbVar.castle&&(this.castled={1:!1,"-1":!1}),this.zSign=a.zobrist.update(0,"who",-1),this.noCaptCount=0,this.mWho=1,a.mInitial)this.mWho=a.mInitial.turn||1,a.mInitial.pieces.forEach(function(t){var e={};for(var a in t)t.hasOwnProperty(a)&&(e[a]=t[a]);i.pieces.push(e)}),a.mInitial.lastMove&&(this.lastMove={f:a.mInitial.lastMove.f,t:a.mInitial.lastMove.t}),void 0!==a.mInitial.noCaptCount&&(this.noCaptCount=a.mInitial.noCaptCount),a.cbVar.castle&&a.mInitial.castle&&(this.castled={1:{k:!!a.mInitial.castle[1]&&!!a.mInitial.castle[1].k,q:!!a.mInitial.castle[1]&&!!a.mInitial.castle[1].q},"-1":{k:!!a.mInitial.castle[-1]&&!!a.mInitial.castle[-1].k,q:!!a.mInitial.castle[-1]&&!!a.mInitial.castle[-1].q}});else for(var s in a.cbVar.pieceTypes)for(var n=a.cbVar.pieceTypes[s],o=n.initial||[],h=0;h<o.length;h++){var p=o[h],c={s:p.s,t:parseInt(s),p:p.p,m:!1};this.pieces.push(c)}if(this.pieces.sort(function(t,e){if(t.s!=e.s)return e.s-t.s;var i=a.cbVar.pieceTypes[t.t].value||100,r=a.cbVar.pieceTypes[e.t].value||100;return i!=r?i-r:t.p-e.p}),this.pieces.forEach(function(t,e){t.i=e,i.board[t.p]=e,a.g.pTypes[t.t].isKing&&(i.kings[t.s]=t.p),i.zSign=a.zobrist.update(i.zSign,"board",e,t.p),i.zSign=a.zobrist.update(i.zSign,"type",t.t,e)}),a.mInitial&&a.mInitial.enPassant){var r=t.geometry.PosByName(a.mInitial.enPassant);if(r>=0){var l,u=t.geometry.C(r),b=t.geometry.R(r);l=1==a.mInitial.turn?t.geometry.POS(u,b-1):t.geometry.POS(u,b+1),this.epTarget={p:r,i:this.board[l]}}}},Model.Board.CopyFrom=function(t){if(e)this.board=new Int16Array(t.board.length),this.board.set(t.board);else{this.board=[];for(var a=t.board,i=a.length,r=0;r<i;r++)this.board.push(a[r])}this.pieces=[];for(var s=t.pieces.length,r=0;r<s;r++){var n=t.pieces[r];this.pieces.push({s:n.s,p:n.p,t:n.t,i:n.i,m:n.m})}this.kings={1:t.kings[1],"-1":t.kings[-1]},this.check=t.check,t.lastMove?this.lastMove={f:t.lastMove.f,t:t.lastMove.t,c:t.lastMove.c}:this.lastMove=null,this.ending={1:t.ending[1],"-1":t.ending[-1]},void 0!==t.castled&&(this.castled={1:t.castled[1],"-1":t.castled[-1]}),this.noCaptCount=t.noCaptCount,t.epTarget?this.epTarget={p:t.epTarget.p,i:t.epTarget.i}:this.epTarget=null,this.mWho=t.mWho,this.zSign=t.zSign},Model.Board.cbApplyCastle=function(t,e,a){var i=t.cbVar.castle[e.f+"/"+e.cg],r=i.r[i.r.length-1],s=this.pieces[this.board[e.cg]],n=i.k[i.k.length-1],o=this.pieces[this.board[e.f]];return a&&(this.zSign=t.zobrist.update(this.zSign,"board",s.i,e.cg),this.zSign=t.zobrist.update(this.zSign,"board",s.i,r),this.zSign=t.zobrist.update(this.zSign,"board",o.i,e.f),this.zSign=t.zobrist.update(this.zSign,"board",o.i,n)),s.p=r,s.m=!0,this.board[e.cg]=-1,o.p=n,o.m=!0,this.board[e.f]=-1,this.board[r]=s.i,this.board[n]=o.i,this.castled[s.s]=!0,this.kings[o.s]=n,[{i:s.i,f:r,t:-1},{i:o.i,f:n,t:e.f,kp:e.f,who:o.s,m:!1},{i:s.i,f:-1,t:e.cg,m:!1,cg:!1}]},Model.Board.cbQuickApply=function(t,e){if(void 0!==e.cg)return this.cbApplyCastle(t,e,!1);var a=[],i=this.board[e.f],r=this.pieces[i];if(null!=e.c){a.unshift({i:e.c,f:-1,t:this.pieces[e.c].p});var s=this.pieces[e.c];this.board[s.p]=-1,s.p=-1}var n=this.kings[r.s];return t.g.pTypes[r.t].isKing&&(this.kings[r.s]=e.t),a.unshift({i:i,f:e.t,t:e.f,kp:n,who:r.s,ty:r.t}),r.p=e.t,void 0!==e.pr&&(r.t=e.pr),this.board[e.f]=-1,this.board[e.t]=i,a},Model.Board.cbQuickUnapply=function(t,e){for(var a=0;a<e.length;a++){var i=e[a],r=this.pieces[i.i];i.f>=0&&(r.p=-1,this.board[i.f]=-1),i.t>=0&&(r.p=i.t,this.board[i.t]=i.i),void 0!==i.m&&(r.m=i.m),void 0!==i.kp&&(this.kings[i.who]=i.kp),void 0!=i.ty&&(r.t=i.ty),void 0!=i.cg&&(this.castled[r.s]=i.cg)}},Model.Board.ApplyMove=function(t,e){var a=this.pieces[this.board[e.f]];if(void 0!==e.cg)this.cbApplyCastle(t,e,!0);else{if(this.zSign=t.zobrist.update(this.zSign,"board",a.i,e.f),this.board[a.p]=-1,void 0!==e.pr&&(this.zSign=t.zobrist.update(this.zSign,"type",a.t,a.i),a.t=e.pr,this.zSign=t.zobrist.update(this.zSign,"type",a.t,a.i)),null!=e.c){var i=this.pieces[e.c];this.zSign=t.zobrist.update(this.zSign,"board",i.i,i.p),this.board[i.p]=-1,i.p=-1,i.m=!0,this.noCaptCount=0}else this.noCaptCount++;a.p=e.t,a.m=!0,this.board[e.t]=a.i,this.zSign=t.zobrist.update(this.zSign,"board",a.i,e.t),t.g.pTypes[a.t].isKing&&(this.kings[a.s]=e.t)}this.check=!!e.ck,this.lastMove={f:e.f,t:e.t,c:e.c},void 0!==e.ko&&(this.ending[a.s]=e.ko),void 0!==e.ept?this.epTarget={p:e.ept,i:a.i}:this.epTarget=null,this.zSign=t.zobrist.update(this.zSign,"who",-this.mWho),this.zSign=t.zobrist.update(this.zSign,"who",this.mWho)},Model.Board.Evaluate=function(a){function i(e){var a=1/0;for(var i in t.geometry.corners)a=Math.min(a,h.distGraph[s.kings[e]][i]);return a-Math.sqrt(h.boardSize)}var r="debug"==arguments[3],s=this;this.mEvaluation=0;var n,o=this.mWho,h=a.g;if(e)n={1:{count:new Uint8Array(h.pTypes.length),byType:{}},"-1":{count:new Uint8Array(h.pTypes.length),byType:{}}};else{n={1:{count:[],byType:{}},"-1":{count:[],byType:{}}};for(var p=0;p<h.pTypes.length;p++)n[1].count[p]=n[-1].count[p]=0}if(a.mOptions.preventRepeat&&a.GetRepeatOccurence(this)>2)return this.mFinished=!0,void(this.mWinner=a.cbOnPerpetual?o*a.cbOnPerpetual:JocGame.DRAW);for(var c={1:0,"-1":0},l={1:h.distGraph[this.kings[-1]],"-1":h.distGraph[this.kings[1]]},u={1:0,"-1":0},b={1:0,"-1":0},v={1:0,"-1":0},f={1:0,"-1":0},d={1:!1,"-1":!1},g=this.pieces,m=g.length,p=0;p<m;p++){var G=g[p];if(G.p>=0){var S=G.s,M=h.pTypes[G.t];M.isKing?d[S]=G.m:c[S]+=M.value,M.castle&&!G.m&&f[S]++,b[S]++,u[S]+=l[S][G.p],v[S]+=t.geometry.distEdge[G.p];var y=n[S];y.count[G.t]++;var C=y.byType;void 0===C[G.t]?C[G.t]=[G]:C[G.t].push(G)}}if(this.lastMove&&null!=this.lastMove.c){var G=this.pieces[this.board[this.lastMove.t]];c[-G.s]+=this.cbStaticExchangeEval(a,G.p,G.s,{piece:G})}var A={1:0,"-1":0},z={1:0,"-1":0},T={1:0,"-1":0};this.ending[1]&&(z[1]=(u[1]-Math.sqrt(h.boardSize))/b[1],t.geometry.corners&&(T[1]=i(1))),this.ending[-1]&&(z[-1]=(u[-1]-Math.sqrt(h.boardSize))/b[-1],t.geometry.corners&&(T[1]=i(-1)));var k={pieceValue:c[1]-c[-1],pieceValueRatio:(c[1]-c[-1])/(c[1]+c[-1]+1),posValue:v[1]-v[-1],averageDistKing:u[1]/b[1]-u[-1]/b[-1],check:this.check?-o:0,endingKingFreedom:A[1]-A[-1],endingDistKing:z[1]-z[-1],distKingCorner:T[1]-T[-1]};t.castle&&(k.castle=(this.castled[1]?1:d[1]?0:f[1]/(h.castleablePiecesCount[1]+1))-(this.castled[-1]?1:d[-1]?0:f[-1]/(h.castleablePiecesCount[-1]+1))),t.evaluate&&t.evaluate.call(this,a,k,n);var E=a.mOptions.levelOptions;for(var P in k){var F=k[P],L=E[P+"Factor"]||0,R=F*L;r&&console.log(P,"=",F,"*",L,"=>",R),this.mEvaluation+=R}r&&console.log("Evaluation",this.mEvaluation)},Model.Board.cbGeneratePseudoLegalMoves=function(t){function e(e,r){var s=t.cbVar.promote;if(!s)return void i.push(r);var n=s.call(a,t,e,r);if(null!=n)if(0==n.length)i.push(r);else if(1==n.length)r.pr=n[0],i.push(r);else for(var o=0;o<n.length;o++){var h=n[o];i.push({f:r.f,t:r.t,c:r.c,pr:h,ept:r.ept,ep:r.ep,a:r.a})}}for(var a=this,i=[],r=t.cbVar,s=this.mWho,n=!r.castle||this.check||this.castled[s]?null:[],o=-1,h=this.pieces.length,p=0;p<h;p++){var c=this.pieces[p];if(!(c.p<0||c.s!=s)){var l=t.g.pTypes[c.t];l.isKing&&(c.m?n=null:o=c),n&&l.castle&&!c.m&&n.push(c);var u,b;u=l.graph[c.p],b=u.length;for(var v=0;v<b;v++)for(var f=u[v],d=!1,g=f.length,m=null,G=0;G<g;G++){var S=f[G],M=65535&S,y=this.board[M];if(!(y<0)||l.epCatch&&this.epTarget&&this.epTarget.p==M){if(!(524288&S)){var C;C=y<0?this.pieces[this.epTarget.i]:this.pieces[y],!(C.s!=c.s&&131072&S)||1048576&S&&!t.g.pTypes[C.t].isKing||2097152&S&&t.g.pTypes[C.t].isKing||e(c,{f:c.p,t:M,c:C.i,a:l.abbrev,ep:y<0});break}if(d){var C=this.pieces[y];C.s!=c.s&&e(c,{f:c.p,t:M,c:C.i,a:l.abbrev});break}d=!0}else 65536&S&&0==d&&e(c,{f:c.p,t:M,c:null,a:l.abbrev,ept:null!=m&&l.epTarget?m:void 0});m=M}}}if(n)for(var p=0;p<n.length;p++){var A=n[p],z=t.cbVar.castle[o.p+"/"+A.p];if(z){for(var T=!0,v=0;v<z.r.length;v++){var k=z.r[v];if(this.board[k]>=0&&k!=o.p&&k!=A.p){T=!1;break}}if(T){for(var E=!0,v=0;v<z.k.length;v++){var k=z.k[v];if(this.board[k]>=0&&k!=A.p&&k!=o.p||this.cbGetAttackers(t,k,s).length>0){E=!1;break}}E&&i.push({f:o.p,t:z.k[z.k.length-1],c:null,cg:A.p})}}}return i},Model.Board.cbStaticExchangeEval=function(t,e,a,i){var r=0,s=this.cbGetSmallestAttacker(t,e,a);if(s){var n=this.mWho;this.mWho=s.s;var o=this.cbQuickApply(t,{f:s.p,t:e,c:i.piece.i}),h=t.g.pTypes[i.piece.t].value;i.piece=s,r=Math.max(0,h-this.cbStaticExchangeEval(t,e,-a,i)),this.cbQuickUnapply(t,o),this.mWho=n}return r},Model.Board.cbGetSmallestAttacker=function(t,e,a){var i=this.cbGetAttackers(t,e,a);if(0==i.length)return null;for(var r=1/0,s=null,n=i.length,o=0;o<n;o++){var h=i[o],p=t.g.pTypes[h.t].value;p<r&&(r=p,s=h)}return s},Model.Board.cbCollectAttackers=function(t,e,a,i){for(var r in e){var s=e[r],n=this.board[r];if(n<0)this.cbCollectAttackers(t,s.e,a,i);else{var o=this.pieces[n];o.s==-t&&(s.t&&o.t in s.t||i&&s.tk&&o.t in s.tk)&&a.push(o)}}},Model.Board.cbCollectAttackersScreen=function(t,e,a,i,r){for(var s in e){var n=e[s],o=this.board[s];if(o<0)this.cbCollectAttackersScreen(t,n.e,a,i,r);else{var h=this.pieces[o];!r&&h.s==-t&&(n.t&&h.t in n.t||i&&n.tk&&h.t in n.tk)?a.push(h):r?r&&h.s==-t&&n.ts&&h.t in n.ts&&a.push(h):this.cbCollectAttackersScreen(t,n.e,a,i,!0)}}},Model.Board.cbGetAttackers=function(t,e,a,i){var r=[];return t.cbUseScreenCapture?this.cbCollectAttackersScreen(a,t.g.threatGraph[a][e],r,i,!1):this.cbCollectAttackers(a,t.g.threatGraph[a][e],r,i),r},Model.Board.GenerateMoves=function(t){var e=this.cbGeneratePseudoLegalMoves(t);this.mMoves=[];for(var a=!0,i=this.kings[this.mWho],r=e.length,s=0;s<r;s++){var n=e[s],o=this.cbQuickApply(t,n);if(!(this.cbGetAttackers(t,this.kings[this.mWho],this.mWho,!0).length>0)){var h=this.cbGetAttackers(t,this.kings[-this.mWho],-this.mWho,!0).length>0;n.ck=h,this.mMoves.push(n),n.f!=i&&(a=!1)}this.cbQuickUnapply(t,o)}if(0==this.mMoves.length)this.mFinished=!0,this.mWinner=t.cbOnStaleMate?t.cbOnStaleMate*this.mWho:JocGame.DRAW,this.check&&(this.mWinner=-this.mWho);else if(this.ending[this.mWho]){if(!a)for(var s=0;s<this.mMoves.length;s++)this.mMoves[s].ko=!1}else if(!this.ending[this.mWho]&&a&&!this.check)for(var s=0;s<this.mMoves.length;s++)this.mMoves[s].ko=!0},Model.Board.GetSignature=function(){return this.zSign},Model.Move.Init=function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e])},Model.Move.Equals=function(t){return this.f==t.f&&this.t==t.t&&this.pr==t.pr},Model.Move.CopyFrom=function(t){this.Init(t)},Model.Move.ToString=function(e){var a=this;switch(e=e||"natural"){case"natural":return function(){var e;if(void 0!==a.cg?e=t.castle[a.f+"/"+a.cg].n:(e=a.a||"",e+=t.geometry.PosName(a.f),null==a.c?e+="-":e+="x",e+=t.geometry.PosName(a.t)),void 0!==a.pr){var i=t.pieceTypes[a.pr];i&&i.abbrev&&i.abbrev.length>0&&!i.silentPromo&&(e+="="+i.abbrev)}return a.ck&&(e+="+"),e}();case"engine":return function(){var e=t.geometry.PosName(a.f)+t.geometry.PosName(a.t);if(void 0!=a.pr){var i=t.pieceTypes[a.pr];i&&i.abbrev&&i.abbrev.length>0&&!i.silentPromo&&(e+=i.abbrev)}return e}();default:return"??"}},Model.Board.CompactMoveString=function(e,a,i){"function"!=typeof a.ToString&&(a=e.CreateMove(a));var r=a.ToString(),s=/^([A-Z]?)([a-z])([1-9][0-9]*)([-x])([a-z])([1-9][0-9]*)(.*?)$/.exec(r);if(!s)return r;var n=s[7];if(i||(i={}),i.value||(i.value=[]),0==i.value.length){var o=this.mMoves;this.mMoves&&0!=this.mMoves.length||this.GenerateMoves(e);for(var h=0;h<this.mMoves.length;h++){var p=this.mMoves[h];"function"!=typeof p.ToString&&(p=e.CreateMove(p)),i.value.push({str:p.ToString(),move:p})}this.mMoves=o}var c=[];if(i.value.forEach(function(t){var e=/^([A-Z]?[a-z][1-9][0-9]*[-x][a-z][1-9][0-9]*)(.*?)$/.exec(t.str);e&&t.move.t==a.t&&(t.move.a||"")==s[1]&&e[2]==n&&c.push(t.move)}),1==c.length)return""==s[1]&&"x"==s[4]?s[2]+"x"+s[5]+s[6]+s[7]:s[1]+("x"==s[4]?"x":"")+s[5]+s[6]+s[7];if(t.geometry.CompactCrit)for(var l="",h=0;;h++){var u=t.geometry.CompactCrit(a.f,h);if(null==u)return r;l+=u;for(var b=[],v=0;v<c.length;v++){var f=c[v];t.geometry.CompactCrit(f.f,h)==u&&b.push(f)}if(console.assert(b.length>0),1==b.length)return s[1]+l+("x"==s[4]?"x":"")+s[5]+s[6]+s[7];c=b}return r},Model.Board.cbIntegrity=function(t){function e(t,e){t||console.error(e)}for(var a=this,i=0;i<this.board.length;i++){var r=this.board[i];if(r>=0){var s=a.pieces[r];e(void 0!==s,"no piece at pos"),e(s.p==i,"piece has different pos")}}for(var r=0;r<this.pieces.length;r++){var s=this.pieces[r];s.p>=0&&e(a.board[s.p]==r,"board index mismatch")}},Model.Board.ExportBoardState=function(t){return t.cbVar.geometry.ExportBoardState?t.cbVar.geometry.ExportBoardState(this,t.cbVar,t.mPlayedMoves.length):"not supported"},Model.Game.Import=function(e,a){var i,r=[],s={1:{},"-1":{}},n=null,o=0;if("pjn"==e){var h={status:!1,error:"parse"},p=a.split(" ");if(6!=p.length)return console.warn("FEN should have 6 parts"),h;var c=p[0].split("/"),l=t.geometry.fenHeight||t.geometry.height;if(c.length!=l)return console.warn("FEN board should have",l,"rows, got",c.length),h;var u={};for(var b in t.pieceTypes){var v=t.pieceTypes[b],f=v.fenAbbrev||v.abbrev||"X";u[f.toUpperCase()]={s:1,t:b},u[f.toLowerCase()]={s:-1,t:b}}var d=t.geometry.FenRowPos||function(e,a){return(t.geometry.height-1-e)*t.geometry.width+a};if(c.forEach(function(e,a){for(var i=0,s=0;s<e.length;s++){var n=e.substr(s,1),o=u[n];if(void 0!==o){var p=d(a,i);i++;for(var c={s:o.s,t:o.t,p:p},l=!0,b=t.pieceTypes[c.t].initial||[],v=0;v<b.length;v++){var f=b[v];f.s==c.s&&f.p==p&&(l=!1)}c.m=l,r.push(c)}else{if(isNaN(parseInt(n)))return console.warn("FEN invalid board spec",n),h;i+=parseInt(n)}}}),r.sort(function(t,e){return e.s-t.s}),"w"==p[1])i=1;else{if("b"!=p[1])return console.warn("FEN invalid turn spec",p[1]),h;i=-1}s[1].k=p[2].indexOf("K")>=0,s[1].q=p[2].indexOf("Q")>=0,s[-1].k=p[2].indexOf("k")>=0,s[-1].q=p[2].indexOf("q")>=0,n="-"==p[3]?null:p[3];var g=parseInt(p[4]);isNaN(g)||(o=g);var m={pieces:r,turn:i,castle:s,enPassant:n,noCaptCount:o};return t.importGame&&t.importGame.call(this,m,e,a),{status:!0,initial:m}}return{status:!1,error:"unsupported"}}}(),function(){Model.Game.cbBoardGeometryGrid=function(t,e){function a(e){return e%t}function i(e){return Math.floor(e/t)}function r(e,a){return a*t+e}function s(s,n){var o=a(s),h=i(s),p=o+n[0],c=h+n[1];return p<0||p>=t||c<0||c>=e?null:r(p,c)}function n(t){return String.fromCharCode("a".charCodeAt(0)+a(t))+(i(t)+1)}function o(t){var e=/^([a-z])([0-9]+)$/.exec(t);return e?r(e[1].charCodeAt(0)-"a".charCodeAt(0),parseInt(e[2])-1):-1}function h(t,e){return 0==e?String.fromCharCode("a".charCodeAt(0)+a(t)):1==e?i(t)+1:null}function p(){for(var r=[],s=0;s<t*e;s++){var n=[];r.push(n);for(var o=0;o<t*e;o++){var h=i(s),p=a(s),c=i(o),l=a(o);n.push(Math.max(Math.abs(h-c),Math.abs(p-l)))}}return r}function c(a,i,s){for(var o=[],h=e-1;h>=0;h--){for(var p="",c=0,l=0;l<t;l++){var u=a.board[r(l,h)];if(u<0)c++;else{c>0&&(p+=c,c=0);var b=a.pieces[u],v=i.pieceTypes[b.t].fenAbbrev||i.pieceTypes[b.t].abbrev||"?";-1==b.s?p+=v.toLowerCase():p+=v.toUpperCase()}}c&&(p+=c),o.push(p)}var f=o.join("/");f+=" ",1==a.mWho?f+="w":f+="b",f+=" ";var d="";return a.castled&&(!1===a.castled[1]?d+="KQ":(a.castled[1].k&&(d+="K"),a.castled[1].q&&(d+="Q")),!1===a.castled[-1]?d+="kq":(a.castled[-1].k&&(d+="k"),a.castled[-1].q&&(d+="q"))),0==d.length&&(d="-"),f+=d,f+=" ",a.epTarget?f+=n(a.epTarget.p):f+="-",f+=" ",f+=a.noCaptCount,f+=" ",f+=Math.floor(s/2)+1}return{boardSize:t*e,width:t,height:e,C:a,R:i,POS:r,Graph:s,PosName:n,PosByName:o,CompactCrit:h,GetDistances:p,distEdge:function(){for(var r=[],s=0;s<t*e;s++){var n=a(s),o=i(s);r[s]=Math.min(n,Math.abs(t-n-1),o,Math.abs(e-o-1))}return r}(),corners:function(){var a={};return a[r(0,0)]=1,a[r(0,e-1)]=1,a[r(t-1,0)]=1,a[r(t-1,e-1)]=1,a}(),ExportBoardState:c}},Model.Game.cbPawnGraph=function(t,e,a){for(var i=this,r={},s=0;s<t.boardSize;s++)if(!a||s in a){var n=[],o=t.Graph(s,[0,e]);null!=o&&(!a||o in a)&&n.push(i.cbTypedArray([o|i.cbConstants.FLAG_MOVE])),[-1,1].forEach(function(r){var o=t.Graph(s,[r,e]);null!=o&&(!a||o in a)&&n.push(i.cbTypedArray([o|i.cbConstants.FLAG_CAPTURE]))}),r[s]=n}else r[s]=[];return r},Model.Game.cbInitialPawnGraph=function(t,e,a){for(var i=this,r={},s=0;s<t.boardSize;s++)if(!a||s in a){var n=[],o=t.Graph(s,[0,e]);if(null!=o&&(!a||o in a)){var h=[o|i.cbConstants.FLAG_MOVE],p=t.Graph(o,[0,e]);null!=p&&(!a||p in a)&&h.push(p|i.cbConstants.FLAG_MOVE),n.push(i.cbTypedArray(h))}[-1,1].forEach(function(r){var o=t.Graph(s,[r,e]);null!=o&&(!a||o in a)&&n.push(i.cbTypedArray([o|i.cbConstants.FLAG_CAPTURE]))}),r[s]=n}else r[s]=[];return r},Model.Game.cbKingGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],e)},Model.Game.cbKnightGraph=function(t,e){return this.cbShortRangeGraph(t,[[2,-1],[2,1],[-2,-1],[-2,1],[-1,2],[-1,-2],[1,2],[1,-2]],e)},Model.Game.cbHorseGraph=function(t){for(var e=this,a={},i=0;i<t.boardSize;i++)a[i]=[],[[1,0,2,-1],[1,0,2,1],[-1,0,-2,-1],[-1,0,-2,1],[0,1,-1,2],[0,-1,-1,-2],[0,1,1,2],[0,-1,1,-2]].forEach(function(r){var s=t.Graph(i,[r[0],r[1]]);if(null!=s){var n=t.Graph(i,[r[2],r[3]]);null!=n&&a[i].push(e.cbTypedArray([s|e.cbConstants.FLAG_STOP,n|e.cbConstants.FLAG_MOVE|e.cbConstants.FLAG_CAPTURE]))}});return a},Model.Game.cbRookGraph=function(t,e){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0]],e)},Model.Game.cbBishopGraph=function(t,e){return this.cbLongRangeGraph(t,[[1,-1],[1,1],[-1,1],[-1,-1]],e)},Model.Game.cbQueenGraph=function(t,e){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0],[1,-1],[1,1],[-1,1],[-1,-1]],e)},Model.Game.cbXQGeneralGraph=function(t,e){for(var a=this,i={},r=0;r<t.boardSize;r++)i[r]=[],[[-1,0,!1],[0,-1,!0],[0,1,!0],[1,0,!1]].forEach(function(s){var n=[],o=t.Graph(r,s);if(null!=o&&((!e||o in e)&&n.push(o|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE),s[2]))for(var h=t.Graph(o,s);null!=h;)!e||h in e?n.push(h|a.cbConstants.FLAG_CAPTURE|a.cbConstants.FLAG_CAPTURE_KING):n.push(h|a.cbConstants.FLAG_STOP),h=t.Graph(h,s);n.length>0&&i[r].push(a.cbTypedArray(n))});return i},Model.Game.cbXQSoldierGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e]])},Model.Game.cbXQPromoSoldierGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e],[-1,0],[1,0]])},Model.Game.cbXQAdvisorGraph=function(t,e){return this.cbShortRangeGraph(t,[[1,1],[-1,1],[1,-1],[-1,-1]],e)},Model.Game.cbXQCannonGraph=function(t){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0]],null,this.cbConstants.FLAG_MOVE|this.cbConstants.FLAG_SCREEN_CAPTURE)},Model.Game.cbXQElephantGraph=function(t,e){for(var a=this,i={},r=0;r<t.boardSize;r++)i[r]=[],(!e||r in e)&&[[1,1,2,2],[1,-1,2,-2],[-1,1,-2,2],[-1,-1,-2,-2]].forEach(function(s){var n=t.Graph(r,[s[0],s[1]]);if(null!=n){var o=t.Graph(r,[s[2],s[3]]);null!=o&&(!e||o in e)&&i[r].push(a.cbTypedArray([n|a.cbConstants.FLAG_STOP,o|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE]))}});return i},Model.Game.cbSilverGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e],[-1,-1],[-1,1],[1,-1],[1,1]])},Model.Game.cbFersGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1]])},Model.Game.cbSchleichGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,0],[1,0],[0,-1],[0,1]])},Model.Game.cbAlfilGraph=function(t,e){return this.cbShortRangeGraph(t,[[-2,-2],[-2,2],[2,2],[2,-2]])}}(),function(){var t=Model.Game.cbBoardGeometryGrid(12,12);Model.Game.cbDefine=function(){function e(e){for(var i={},r=0;r<t.boardSize;r++){i[r]=[];var s=[],n=t.Graph(r,[0,e]);null!=n&&(s.push(n|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE),n=t.Graph(n,[0,e]),null!=n&&s.push(n|a.cbConstants.FLAG_MOVE),i[r].push(a.cbTypedArray(s)))}return a.cbMergeGraphs(t,a.cbShortRangeGraph(t,[[-1,-1],[-1,1],[-1,0],[1,0],[1,-1],[1,1],[0,-e]]),i)}var a=this;return{geometry:t,pieceTypes:{0:{name:"pawn-w",aspect:"fr-pawn",graph:this.cbPawnGraph(t,1),value:1,abbrev:"",fenAbbrev:"P",epCatch:!0},1:{name:"ipawn-w",aspect:"fr-pawn",graph:this.cbInitialPawnGraph(t,1),value:1,abbrev:"",fenAbbrev:"P",initial:[{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:29},{s:1,p:30},{s:1,p:32},{s:1,p:33},{s:1,p:34},{s:1,p:35}],epTarget:!0,epCatch:!0},2:{name:"pawn-b",aspect:"fr-pawn",graph:this.cbPawnGraph(t,-1),value:1,abbrev:"",fenAbbrev:"P",epCatch:!0},3:{name:"ipawn-b",aspect:"fr-pawn",graph:this.cbInitialPawnGraph(t,-1),value:1,abbrev:"",fenAbbrev:"P",initial:[{s:-1,p:108},{s:-1,p:109},{s:-1,p:110},{s:-1,p:111},{s:-1,p:113},{s:-1,p:114},{s:-1,p:116},{s:-1,p:117},{s:-1,p:118},{s:-1,p:119}],epTarget:!0,epCatch:!0},4:{name:"knight",aspect:"fr-knight",graph:this.cbKnightGraph(t),value:2.5,abbrev:"N",initial:[{s:1,p:14},{s:1,p:21},{s:-1,p:122},{s:-1,p:129}]},5:{name:"bishop",aspect:"fr-bishop",graph:this.cbBishopGraph(t),value:3.5,abbrev:"B",initial:[{s:1,p:15},{s:1,p:20},{s:-1,p:123},{s:-1,p:128}]},6:{name:"rook",aspect:"fr-rook",graph:this.cbRookGraph(t),value:5,abbrev:"R",initial:[{s:1,p:13},{s:1,p:22},{s:-1,p:121},{s:-1,p:130}],castle:!0},7:{name:"queen",aspect:"fr-queen",graph:this.cbQueenGraph(t),value:9,abbrev:"Q",initial:[{s:1,p:18},{s:-1,p:126}]},8:{name:"king",aspect:"fr-king",isKing:!0,graph:this.cbKingGraph(t),abbrev:"K",initial:[{s:1,p:17},{s:-1,p:125}]},9:{name:"cannon",aspect:"fr-cannon2",graph:this.cbXQCannonGraph(t),value:4,abbrev:"C",initial:[{s:1,p:0},{s:1,p:11},{s:-1,p:132},{s:-1,p:143}]},10:{name:"elephant",aspect:"fr-elephant",graph:this.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]]),value:2.5,abbrev:"E",initial:[{s:1,p:12},{s:1,p:23},{s:-1,p:120},{s:-1,p:131}]},11:{name:"prince-w",aspect:"fr-prince",graph:e(1),value:3.5,epTarget:!0,abbrev:"I",initial:[{s:1,p:28},{s:1,p:31}]},12:{name:"prince-b",aspect:"fr-prince",graph:e(-1),epTarget:!0,value:3.5,abbrev:"I",initial:[{s:-1,p:112},{s:-1,p:115}]},13:{name:"camel",aspect:"fr-camel",graph:this.cbShortRangeGraph(t,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),value:2,abbrev:"M",initial:[{s:1,p:1},{s:1,p:10},{s:-1,p:133},{s:-1,p:142}]},14:{name:"lion",aspect:"fr-lion",graph:this.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1],[1,0],[0,1],[-1,0],[0,-1],[-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]]),value:7.5,abbrev:"L",initial:[{s:1,p:5},{s:-1,p:137}]},15:{name:"eagle",aspect:"fr-eagle",graph:function(){for(var e=a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE,i={},r=0;r<t.boardSize;r++)i[r]=[],[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(s){var n=t.Graph(r,s);if(null!=n)for(var o=0;o<2;o++){for(var h=[],p=1;p<11;p++){var c=[];c[o]=s[o]*p,c[1-o]=0;var l=t.Graph(n,c);null!=l&&(1==p&&h.push(n|a.cbConstants.FLAG_STOP),h.push(l|e))}h.length>0&&i[r].push(a.cbTypedArray(h))}});return a.cbMergeGraphs(t,a.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1]]),i)}(),value:8,abbrev:"A",initial:[{s:1,p:6},{s:-1,p:138}]},16:{name:"Buffalo",aspect:"fr-buffalo",graph:this.cbShortRangeGraph(t,[[1,2],[1,3],[2,1],[2,3],[3,1],[3,2],[1,-2],[1,-3],[2,-1],[2,-3],[3,-1],[3,-2],[-1,-2],[-1,-3],[-2,-1],[-2,-3],[-3,-1],[-3,-2],[-1,2],[-1,3],[-2,1],[-2,3],[-3,1],[-3,2]]),value:7,abbrev:"F",initial:[{s:1,p:4},{s:-1,p:136}]},17:{name:"Rhino",aspect:"fr-rhino",graph:function(e){for(var i=a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE,r={},s=0;s<t.boardSize;s++){var n=[];[[0,1],[1,0],[-1,0],[0,-1]].forEach(function(e){var r=[Math.sign(e[0]),Math.sign(e[1])],o=t.Graph(s,e);if(0==r[0]?(xleft=-1,xright=1):(xleft=r[0],xright=r[0]),0==r[1]?(yleft=-1,yright=1):(yleft=r[1],yright=r[1]),null!=o){for(var h=(a.cbConstants.FLAG_MOVE,a.cbConstants.FLAG_CAPTURE,a.cbConstants.FLAG_STOP,Math.max(11,11)-1),p=[],c=[],l=1;l<h;l++){var u=[xleft*l,yleft*l],b=[xright*l,yright*l],v=t.Graph(o,u),f=t.Graph(o,b);null!=v&&(p.push(o|a.cbConstants.FLAG_STOP),p.push(v|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE|a.cbConstants.FLAG_STOP)),null!=f&&(c.push(o|a.cbConstants.FLAG_STOP),c.push(f|i|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE|a.cbConstants.FLAG_STOP))}p.length>0&&n.push(a.cbTypedArray(p)),c.length>0&&n.push(a.cbTypedArray(c))}}),r[s]=n}return a.cbMergeGraphs(t,a.cbShortRangeGraph(t,[[0,1],[1,0],[-1,0],[0,-1]]),r)}(),value:6,abbrev:"U",initial:[{s:1,p:7},{s:-1,p:139}]},18:{name:"giraffe",abbrev:"Z",aspect:"fr-giraffe",graph:this.cbShortRangeGraph(t,[[-3,-2],[-3,2],[3,-2],[3,2],[2,3],[2,-3],[-2,3],[-2,-3]]),value:2,initial:[{s:1,p:2},{s:1,p:9},{s:-1,p:134},{s:-1,p:141}]},19:{name:"bow",abbrev:"V",aspect:"fr-bow",graph:this.cbLongRangeGraph(t,[[-1,-1],[1,1],[-1,1],[1,-1]],null,this.cbConstants.FLAG_MOVE|this.cbConstants.FLAG_SCREEN_CAPTURE),value:3,initial:[{s:1,p:3},{s:1,p:8},{s:-1,p:135},{s:-1,p:140}]},20:{name:"machine",abbrev:"W",aspect:"fr-machine",graph:this.cbShortRangeGraph(t,[[-1,0],[-2,0],[1,0],[2,0],[0,1],[0,2],[0,-1],[0,-2]]),value:3,initial:[{s:1,p:16},{s:1,p:19},{s:-1,p:124},{s:-1,p:127}]}},promote:function(e,a,i){return 1==a.t&&11==t.R(i.t)?[7,14,15,16,17]:3==a.t&&0==t.R(i.t)?[7,14,15,16,17]:11==a.t&&11==t.R(i.t)?[7,14,15,16,17]:12==a.t&&0==t.R(i.t)?[7,14,15,16,17]:[]}}};var e={1:{17:[[15,16],[19,18],[41,29],[39,28],[43,30],[3,4,16],[27,16,28],[40,28,29],[42,29,30],[31,18,30],[7,18,6]],5:[[3,4],[7,8],[29,17],[27,16],[31,18],[15,4,6],[28,16,17],[30,17,18],[19,6,18]]},"-1":{125:[[127,126],[123,124],[101,113],[99,112],[103,114],[135,124,136],[111,112,124],[100,112,113],[102,113,114],[115,114,126],[139,126,138]],137:[[139,138],[135,136],[113,125],[115,126],[111,124],[127,126,138],[114,125,126],[112,124,125],[123,124,136]]}},a=Model.Board.GenerateMoves;Model.Board.GenerateMoves=function(t){if(void 0===this.setupState)return void(this.mMoves=[{}]);if("setup"!=this.setupState){a.apply(this,arguments);var i=this.pieces[this.board[this.kings[this.mWho]]];if(!i.m&&!this.check)for(var r=e[this.mWho][i.p],s=0;s<r.length;s++){var n=r[s];if(!(this.board[n[0]]>=0)){for(var o=!0,h=!1,p=0;p<n.length;p++){var c=n[p],l=this.board[c];this.board[c]=-1;var u=this.cbQuickApply(t,{f:i.p,t:c}),b=this.cbGetAttackers(t,c,this.mWho,!0).length>0;if(b||0!=p||(h=this.cbGetAttackers(t,this.kings[-this.mWho],-this.mWho,!0).length>0),this.cbQuickUnapply(t,u),this.board[c]=l,this.cbIntegrity(t),b){o=!1;break}}o&&this.mMoves.push({f:i.p,t:n[0],c:null,ck:h,a:"K"})}}}else{this.mMoves=[];for(var s=0;s<12;s++)this.mMoves.push({setup:s})}};var i=Model.Board.CopyFrom;Model.Board.CopyFrom=function(t){i.apply(this,arguments),this.setupState=t.setupState};var r=Model.Board.Evaluate;Model.Board.Evaluate=function(t){void 0!==this.setupState&&"setup"!=this.setupState&&r.apply(this,arguments)};var s=Model.Board.ApplyMove;Model.Board.ApplyMove=function(t,e){if(void 0===this.setupState)this.setupState="setup";else if("setup"==this.setupState){var a=this,i={1:{K:17,Q:18,E:6,L:5,F:4,U:7},"-1":{K:125,Q:126,E:138,L:137,F:136,U:139}},r={1:{},"-1":{}};["1","-1"].forEach(function(t){for(var e in i[t])r[t][e]=a.board[i[t][e]]}),[4,5,6,7,17,18,125,126,136,137,138,139].forEach(function(e){var i=a.board[e];a.board[e]=-1,a.pieces[i].p=-1,a.zSign=t.zobrist.update(a.zSign,"board",i,e)});var n=e.setup,o={};n/6<1?(this.board[17]=r[1].K,this.pieces[r[1].K].p=17,a.zSign=t.zobrist.update(a.zSign,"board",r[1].K,17),this.kings[1]=17,o[1]=[18,5,6],this.board[125]=r[-1].K,this.pieces[r[-1].K].p=125,a.zSign=t.zobrist.update(a.zSign,"board",r[-1].K,125),this.kings[-1]=125,o[-1]=[126,137,138]):(this.board[5]=r[1].K,this.pieces[r[1].K].p=5,a.zSign=t.zobrist.update(a.zSign,"board",r[1].K,5),this.kings[1]=5,o[1]=[17,18,6],this.board[137]=r[-1].K,this.pieces[r[-1].K].p=137,a.zSign=t.zobrist.update(a.zSign,"board",r[-1].K,137),this.kings[-1]=137,o[-1]=[125,126,138]),n%=6;var h=Math.floor(n/2);this.board[o[1][h]]=r[1].Q,this.pieces[r[1].Q].p=o[1][h],a.zSign=t.zobrist.update(a.zSign,"board",r[1].Q,o[1][h]),o[1].splice(h,1),this.board[o[-1][h]]=r[-1].Q,this.pieces[r[-1].Q].p=o[-1][h],a.zSign=t.zobrist.update(a.zSign,"board",r[-1].Q,o[-1][h]),o[-1].splice(h,1);var p,c;n%=2,0==n?(p=0,c=1):(p=1,c=0),this.board[o[1][p]]=r[1].E,this.pieces[r[1].E].p=o[1][p],
a.zSign=t.zobrist.update(a.zSign,"board",r[1].E,o[1][p]),this.board[o[1][c]]=r[1].L,this.pieces[r[1].L].p=o[1][c],a.zSign=t.zobrist.update(a.zSign,"board",r[1].L,o[1][c]),this.board[o[-1][p]]=r[-1].E,this.pieces[r[-1].E].p=o[-1][p],a.zSign=t.zobrist.update(a.zSign,"board",r[-1].E,o[-1][p]),this.board[o[-1][c]]=r[-1].L,this.pieces[r[-1].L].p=o[-1][c],a.zSign=t.zobrist.update(a.zSign,"board",r[-1].L,o[1][c]),o[1]=[4,7],o[-1]=[136,139];var l,u;n%=2,0==n?(l=0,u=1):(l=1,u=0),this.board[o[1][u]]=r[1].F,this.pieces[r[1].F].p=o[1][u],a.zSign=t.zobrist.update(a.zSign,"board",r[1].F,o[1][u]),this.board[o[1][l]]=r[1].U,this.pieces[r[1].U].p=o[1][l],a.zSign=t.zobrist.update(a.zSign,"board",r[1].U,o[1][l]),this.board[o[-1][u]]=r[-1].F,this.pieces[r[-1].F].p=o[-1][u],a.zSign=t.zobrist.update(a.zSign,"board",r[-1].F,o[-1][u]),this.board[o[-1][l]]=r[-1].U,this.pieces[r[-1].U].p=o[-1][l],a.zSign=t.zobrist.update(a.zSign,"board",r[-1].U,o[1][l]),this.setupState="done"}else s.apply(this,arguments)};var n=Model.Move.ToString;Model.Move.ToString=function(){return void 0===this.f?void 0===this.setup?"--":"#"+this.setup:n.apply(this,arguments)};var o=Model.Board.CompactMoveString;Model.Board.CompactMoveString=function(t,e,a){return"function"!=typeof e.ToString&&(e=t.CreateMove(e)),void 0===this.setupState||"setup"==this.setupState?e.ToString():o.apply(this,arguments)},Model.Board.StaticGenerateMoves=function(t){return"setup"==this.setupState?[t.CreateMove({setup:Math.floor(12*Math.random())})]:null}}();