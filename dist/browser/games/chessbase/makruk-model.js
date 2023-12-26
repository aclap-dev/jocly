exports.model=Model={Game:{},Board:{},Move:{}},function(){var t;Model.Game.cbConstants={MASK:65535,FLAG_MOVE:65536,FLAG_CAPTURE:131072,FLAG_STOP:262144,FLAG_SCREEN_CAPTURE:524288,FLAG_CAPTURE_KING:1048576,FLAG_CAPTURE_NO_KING:2097152};var e="undefined"!=typeof Int32Array;Model.Game.cbUseTypedArrays=e,Model.Game.cbTypedArray=function(t){if(e){var r=new Int32Array(t.length);return r.set(t),r}for(var i=[],a=t.length,s=0;s<a;s++)i.push(t[s]);return i},Model.Game.cbShortRangeGraph=function(t,e,r,i){var a=this;void 0===i&&(i=196608);for(var s={},n=0;n<t.boardSize;n++)s[n]=[],(!r||n in r)&&e.forEach(function(e){var o=t.Graph(n,e);null!=o&&(!r||o in r)&&s[n].push(a.cbTypedArray([o|i]))});return s},Model.Game.cbLongRangeGraph=function(t,e,r,i,a){var s=this;void 0!==i&&null!=i||(i=196608),a||(a=1/0);for(var n={},o=0;o<t.boardSize;o++)n[o]=[],(!r||o in r)&&e.forEach(function(e){for(var h=[],c=t.Graph(o,e),p=0;null!=c&&(!r||c in r)&&(h.push(c|i),++p!=a);)c=t.Graph(c,e);h.length>0&&n[o].push(s.cbTypedArray(h))});return n},Model.Game.cbNullGraph=function(t){for(var e={},r=0;r<t.boardSize;r++)e[r]=[];return e},Model.Game.cbAuthorGraph=function(t){for(var e={},r=0;r<t.boardSize;r++){e[r]=[];for(var i=0;i<t.boardSize;i++)e[r].push([2293760|i])}return e},Model.Game.cbMergeGraphs=function(t){for(var e=[],r=0;r<t.boardSize;r++){e[r]=[];for(var i=1;i<arguments.length;i++)e[r]=e[r].concat(arguments[i][r])}return e},Model.Game.cbGetThreatGraph=function(){function t(e,r){for(var i in n){var a=n[i];if(!(a.p.length<r.length+1)){for(var s=!0,o=0;o<r.length;o++)if(r[o]!=a.p[o]){s=!1;break}if(s){var h=a.p[r.length],c=e[h];void 0===c&&(c={e:{}},e[h]=c),a.p.length==r.length+1&&(c.t=a.t,c.ts=a.ts,c.tk=a.tk,delete n[i]),r.push(h),t(c.e,r),r.pop()}}}}var e=this;this.cbUseScreenCapture=!1,this.cbUseCaptureKing=!1,this.cbUseCaptureNoKing=!1;for(var r={1:[],"-1":[]},i=[],a=0;a<this.g.boardSize;a++)this.g.pTypes.forEach(function(t,r){t.graph[a].forEach(function(t){for(var s=[],n=0;n<t.length;n++){var o=t[n];1048576&o?(e.cbUseCaptureKing=!0,s.unshift({d:65535&o,a:a,tk:r})):2097152&o?(e.cbUseCaptureNoKing=!0,s.unshift({d:65535&o,a:a,tnk:r})):131072&o?s.unshift({d:65535&o,a:a,t:r}):262144&o?s.unshift({d:65535&o,a:a}):524288&o&&(e.cbUseScreenCapture=!0,s.unshift({d:65535&o,a:a,ts:r}))}s.length>0&&i.push(s)})});var s={};i.forEach(function(t){t.forEach(function(e,r){var i=s[e.d];void 0===i&&(i={},s[e.d]=i);for(var a=[],n=r+1;n<t.length;n++)a.push(t[n].d);a.push(e.a);var o=a.join(","),h=i[o];void 0===h&&(h={p:a,t:{},ts:{},tk:{}},i[o]=h),void 0!==e.t?h.t[e.t]=!0:void 0!==e.tk?h.tk[e.tk]=!0:void 0!==e.ts&&(h.ts[e.ts]=!0)})});for(var a=0;a<e.g.boardSize;a++){var n=s[a],o={};t(o,[]),r[1][a]=o,r[-1][a]=o}return r},Model.Game.InitGame=function(){var e=this;this.cbVar=t=this.cbDefine(),this.g.boardSize=this.cbVar.geometry.boardSize,this.g.pTypes=this.cbGetPieceTypes(),this.g.threatGraph=this.cbGetThreatGraph(),this.g.distGraph=this.cbVar.geometry.GetDistances(),this.cbPiecesCount=0,this.g.castleablePiecesCount={1:0,"-1":0};for(var r in t.pieceTypes){var i=t.pieceTypes[r];if(i.castle){(i.initial||[]).forEach(function(t){e.g.castleablePiecesCount[t.s]++})}i.initial&&(this.cbPiecesCount+=i.initial.length)}for(var a=[],r=0;r<this.cbPiecesCount;r++)a.push(r);var s=Object.keys(t.pieceTypes);this.zobrist=new JocGame.Zobrist({board:{type:"array",size:this.cbVar.geometry.boardSize,values:a},who:{values:["1","-1"]},type:{type:"array",size:this.cbPiecesCount,values:s}})},Model.Game.cbGetPieceTypes=function(){for(var t=[],e={},r=0;r<this.cbVar.geometry.boardSize;r++)e[r]=[];for(var i in this.cbVar.pieceTypes){var a=this.cbVar.pieceTypes[i];t[i]={graph:a.graph||e,abbrev:a.abbrev||"",value:a.isKing?100:a.value||1,isKing:!!a.isKing,castle:!!a.castle,epTarget:!!a.epTarget,epCatch:!!a.epCatch}}return t},Model.Board.Init=function(t){this.zSign=0},Model.Board.InitialPosition=function(r){var i=this;this.board=e?new Int16Array(r.g.boardSize):[];for(var a=0;a<r.g.boardSize;a++)this.board[a]=-1;if(this.kings={},this.pieces=[],this.ending={1:!1,"-1":!1},this.lastMove=null,r.cbVar.castle&&(this.castled={1:!1,"-1":!1}),this.zSign=r.zobrist.update(0,"who",-1),this.noCaptCount=0,this.mWho=1,r.mInitial)this.mWho=r.mInitial.turn||1,r.mInitial.pieces.forEach(function(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);i.pieces.push(e)}),r.mInitial.lastMove&&(this.lastMove={f:r.mInitial.lastMove.f,t:r.mInitial.lastMove.t}),void 0!==r.mInitial.noCaptCount&&(this.noCaptCount=r.mInitial.noCaptCount),r.cbVar.castle&&r.mInitial.castle&&(this.castled={1:{k:!!r.mInitial.castle[1]&&!!r.mInitial.castle[1].k,q:!!r.mInitial.castle[1]&&!!r.mInitial.castle[1].q},"-1":{k:!!r.mInitial.castle[-1]&&!!r.mInitial.castle[-1].k,q:!!r.mInitial.castle[-1]&&!!r.mInitial.castle[-1].q}});else for(var s in r.cbVar.pieceTypes)for(var n=r.cbVar.pieceTypes[s],o=n.initial||[],h=0;h<o.length;h++){var c=o[h],p={s:c.s,t:parseInt(s),p:c.p,m:!1};this.pieces.push(p)}if(this.pieces.sort(function(t,e){if(t.s!=e.s)return e.s-t.s;var i=r.cbVar.pieceTypes[t.t].value||100,a=r.cbVar.pieceTypes[e.t].value||100;return i!=a?i-a:t.p-e.p}),this.pieces.forEach(function(t,e){t.i=e,i.board[t.p]=e,r.g.pTypes[t.t].isKing&&(i.kings[t.s]=t.p),i.zSign=r.zobrist.update(i.zSign,"board",e,t.p),i.zSign=r.zobrist.update(i.zSign,"type",t.t,e)}),r.mInitial&&r.mInitial.enPassant){var a=t.geometry.PosByName(r.mInitial.enPassant);if(a>=0){var l,u=t.geometry.C(a),v=t.geometry.R(a);l=1==r.mInitial.turn?t.geometry.POS(u,v-1):t.geometry.POS(u,v+1),this.epTarget={p:a,i:this.board[l]}}}},Model.Board.CopyFrom=function(t){if(e)this.board=new Int16Array(t.board.length),this.board.set(t.board);else{this.board=[];for(var r=t.board,i=r.length,a=0;a<i;a++)this.board.push(r[a])}this.pieces=[];for(var s=t.pieces.length,a=0;a<s;a++){var n=t.pieces[a];this.pieces.push({s:n.s,p:n.p,t:n.t,i:n.i,m:n.m})}this.kings={1:t.kings[1],"-1":t.kings[-1]},this.check=t.check,t.lastMove?this.lastMove={f:t.lastMove.f,t:t.lastMove.t,c:t.lastMove.c}:this.lastMove=null,this.ending={1:t.ending[1],"-1":t.ending[-1]},void 0!==t.castled&&(this.castled={1:t.castled[1],"-1":t.castled[-1]}),this.noCaptCount=t.noCaptCount,t.epTarget?this.epTarget={p:t.epTarget.p,i:t.epTarget.i}:this.epTarget=null,this.mWho=t.mWho,this.zSign=t.zSign},Model.Board.cbApplyCastle=function(t,e,r){var i=t.cbVar.castle[e.f+"/"+e.cg],a=i.r[i.r.length-1],s=this.pieces[this.board[e.cg]],n=i.k[i.k.length-1],o=this.pieces[this.board[e.f]];return r&&(this.zSign=t.zobrist.update(this.zSign,"board",s.i,e.cg),this.zSign=t.zobrist.update(this.zSign,"board",s.i,a),this.zSign=t.zobrist.update(this.zSign,"board",o.i,e.f),this.zSign=t.zobrist.update(this.zSign,"board",o.i,n)),s.p=a,s.m=!0,this.board[e.cg]=-1,o.p=n,o.m=!0,this.board[e.f]=-1,this.board[a]=s.i,this.board[n]=o.i,this.castled[s.s]=!0,this.kings[o.s]=n,[{i:s.i,f:a,t:-1},{i:o.i,f:n,t:e.f,kp:e.f,who:o.s,m:!1},{i:s.i,f:-1,t:e.cg,m:!1,cg:!1}]},Model.Board.cbQuickApply=function(t,e){if(void 0!==e.cg)return this.cbApplyCastle(t,e,!1);var r=[],i=this.board[e.f],a=this.pieces[i];if(null!=e.c){r.unshift({i:e.c,f:-1,t:this.pieces[e.c].p});var s=this.pieces[e.c];this.board[s.p]=-1,s.p=-1}var n=this.kings[a.s];return t.g.pTypes[a.t].isKing&&(this.kings[a.s]=e.t),r.unshift({i:i,f:e.t,t:e.f,kp:n,who:a.s,ty:a.t}),a.p=e.t,void 0!==e.pr&&(a.t=e.pr),this.board[e.f]=-1,this.board[e.t]=i,r},Model.Board.cbQuickUnapply=function(t,e){for(var r=0;r<e.length;r++){var i=e[r],a=this.pieces[i.i];i.f>=0&&(a.p=-1,this.board[i.f]=-1),i.t>=0&&(a.p=i.t,this.board[i.t]=i.i),void 0!==i.m&&(a.m=i.m),void 0!==i.kp&&(this.kings[i.who]=i.kp),void 0!=i.ty&&(a.t=i.ty),void 0!=i.cg&&(this.castled[a.s]=i.cg)}},Model.Board.ApplyMove=function(t,e){var r=this.pieces[this.board[e.f]];if(void 0!==e.cg)this.cbApplyCastle(t,e,!0);else{if(this.zSign=t.zobrist.update(this.zSign,"board",r.i,e.f),this.board[r.p]=-1,void 0!==e.pr&&(this.zSign=t.zobrist.update(this.zSign,"type",r.t,r.i),r.t=e.pr,this.zSign=t.zobrist.update(this.zSign,"type",r.t,r.i)),null!=e.c){var i=this.pieces[e.c];this.zSign=t.zobrist.update(this.zSign,"board",i.i,i.p),this.board[i.p]=-1,i.p=-1,i.m=!0,this.noCaptCount=0}else this.noCaptCount++;r.p=e.t,r.m=!0,this.board[e.t]=r.i,this.zSign=t.zobrist.update(this.zSign,"board",r.i,e.t),t.g.pTypes[r.t].isKing&&(this.kings[r.s]=e.t)}this.check=!!e.ck,this.lastMove={f:e.f,t:e.t,c:e.c},void 0!==e.ko&&(this.ending[r.s]=e.ko),void 0!==e.ept?this.epTarget={p:e.ept,i:r.i}:this.epTarget=null,this.zSign=t.zobrist.update(this.zSign,"who",-this.mWho),this.zSign=t.zobrist.update(this.zSign,"who",this.mWho)},Model.Board.Evaluate=function(r){function i(e){var r=1/0;for(var i in t.geometry.corners)r=Math.min(r,h.distGraph[s.kings[e]][i]);return r-Math.sqrt(h.boardSize)}var a="debug"==arguments[3],s=this;this.mEvaluation=0;var n,o=this.mWho,h=r.g;if(e)n={1:{count:new Uint8Array(h.pTypes.length),byType:{}},"-1":{count:new Uint8Array(h.pTypes.length),byType:{}}};else{n={1:{count:[],byType:{}},"-1":{count:[],byType:{}}};for(var c=0;c<h.pTypes.length;c++)n[1].count[c]=n[-1].count[c]=0}if(r.mOptions.preventRepeat&&r.GetRepeatOccurence(this)>2)return this.mFinished=!0,void(this.mWinner=r.cbOnPerpetual?o*r.cbOnPerpetual:JocGame.DRAW);for(var p={1:0,"-1":0},l={1:h.distGraph[this.kings[-1]],"-1":h.distGraph[this.kings[1]]},u={1:0,"-1":0},v={1:0,"-1":0},b={1:0,"-1":0},f={1:0,"-1":0},d={1:!1,"-1":!1},g=this.pieces,m=g.length,c=0;c<m;c++){var G=g[c];if(G.p>=0){var y=G.s,M=h.pTypes[G.t];M.isKing?d[y]=G.m:p[y]+=M.value,M.castle&&!G.m&&f[y]++,v[y]++,u[y]+=l[y][G.p],b[y]+=t.geometry.distEdge[G.p];var C=n[y];C.count[G.t]++;var k=C.byType;void 0===k[G.t]?k[G.t]=[G]:k[G.t].push(G)}}if(this.lastMove&&null!=this.lastMove.c){var G=this.pieces[this.board[this.lastMove.t]];p[-G.s]+=this.cbStaticExchangeEval(r,G.p,G.s,{piece:G})}var S={1:0,"-1":0},A={1:0,"-1":0},T={1:0,"-1":0};this.ending[1]&&(A[1]=(u[1]-Math.sqrt(h.boardSize))/v[1],t.geometry.corners&&(T[1]=i(1))),this.ending[-1]&&(A[-1]=(u[-1]-Math.sqrt(h.boardSize))/v[-1],t.geometry.corners&&(T[1]=i(-1)));var z={pieceValue:p[1]-p[-1],pieceValueRatio:(p[1]-p[-1])/(p[1]+p[-1]+1),posValue:b[1]-b[-1],averageDistKing:u[1]/v[1]-u[-1]/v[-1],check:this.check?-o:0,endingKingFreedom:S[1]-S[-1],endingDistKing:A[1]-A[-1],distKingCorner:T[1]-T[-1]};t.castle&&(z.castle=(this.castled[1]?1:d[1]?0:f[1]/(h.castleablePiecesCount[1]+1))-(this.castled[-1]?1:d[-1]?0:f[-1]/(h.castleablePiecesCount[-1]+1))),t.evaluate&&t.evaluate.call(this,r,z,n);var E=r.mOptions.levelOptions;for(var P in z){var R=z[P],I=E[P+"Factor"]||0,w=R*I;a&&console.log(P,"=",R,"*",I,"=>",w),this.mEvaluation+=w}a&&console.log("Evaluation",this.mEvaluation)},Model.Board.cbGeneratePseudoLegalMoves=function(t){function e(e,a){var s=t.cbVar.promote;if(!s)return void i.push(a);var n=s.call(r,t,e,a);if(null!=n)if(0==n.length)i.push(a);else if(1==n.length)a.pr=n[0],i.push(a);else for(var o=0;o<n.length;o++){var h=n[o];i.push({f:a.f,t:a.t,c:a.c,pr:h,ept:a.ept,ep:a.ep,a:a.a})}}for(var r=this,i=[],a=t.cbVar,s=this.mWho,n=!a.castle||this.check||this.castled[s]?null:[],o=-1,h=this.pieces.length,c=0;c<h;c++){var p=this.pieces[c];if(!(p.p<0||p.s!=s)){var l=t.g.pTypes[p.t];l.isKing&&(p.m?n=null:o=p),n&&l.castle&&!p.m&&n.push(p);var u,v;u=l.graph[p.p],v=u.length;for(var b=0;b<v;b++)for(var f=u[b],d=!1,g=f.length,m=null,G=0;G<g;G++){var y=f[G],M=65535&y,C=this.board[M];if(!(C<0)||l.epCatch&&this.epTarget&&this.epTarget.p==M){if(!(524288&y)){var k;k=C<0?this.pieces[this.epTarget.i]:this.pieces[C],!(k.s!=p.s&&131072&y)||1048576&y&&!t.g.pTypes[k.t].isKing||2097152&y&&t.g.pTypes[k.t].isKing||e(p,{f:p.p,t:M,c:k.i,a:l.abbrev,ep:C<0});break}if(d){var k=this.pieces[C];k.s!=p.s&&e(p,{f:p.p,t:M,c:k.i,a:l.abbrev});break}d=!0}else 65536&y&&0==d&&e(p,{f:p.p,t:M,c:null,a:l.abbrev,ept:null!=m&&l.epTarget?m:void 0});m=M}}}if(n)for(var c=0;c<n.length;c++){var S=n[c],A=t.cbVar.castle[o.p+"/"+S.p];if(A){for(var T=!0,b=0;b<A.r.length;b++){var z=A.r[b];if(this.board[z]>=0&&z!=o.p&&z!=S.p){T=!1;break}}if(T){for(var E=!0,b=0;b<A.k.length;b++){var z=A.k[b];if(this.board[z]>=0&&z!=S.p&&z!=o.p||this.cbGetAttackers(t,z,s).length>0){E=!1;break}}E&&i.push({f:o.p,t:A.k[A.k.length-1],c:null,cg:S.p})}}}return i},Model.Board.cbStaticExchangeEval=function(t,e,r,i){var a=0,s=this.cbGetSmallestAttacker(t,e,r);if(s){var n=this.mWho;this.mWho=s.s;var o=this.cbQuickApply(t,{f:s.p,t:e,c:i.piece.i}),h=t.g.pTypes[i.piece.t].value;i.piece=s,a=Math.max(0,h-this.cbStaticExchangeEval(t,e,-r,i)),this.cbQuickUnapply(t,o),this.mWho=n}return a},Model.Board.cbGetSmallestAttacker=function(t,e,r){var i=this.cbGetAttackers(t,e,r);if(0==i.length)return null;for(var a=1/0,s=null,n=i.length,o=0;o<n;o++){var h=i[o],c=t.g.pTypes[h.t].value;c<a&&(a=c,s=h)}return s},Model.Board.cbCollectAttackers=function(t,e,r,i){for(var a in e){var s=e[a],n=this.board[a];if(n<0)this.cbCollectAttackers(t,s.e,r,i);else{var o=this.pieces[n];o.s==-t&&(s.t&&o.t in s.t||i&&s.tk&&o.t in s.tk)&&r.push(o)}}},Model.Board.cbCollectAttackersScreen=function(t,e,r,i,a){for(var s in e){var n=e[s],o=this.board[s];if(o<0)this.cbCollectAttackersScreen(t,n.e,r,i,a);else{var h=this.pieces[o];!a&&h.s==-t&&(n.t&&h.t in n.t||i&&n.tk&&h.t in n.tk)?r.push(h):a?a&&h.s==-t&&n.ts&&h.t in n.ts&&r.push(h):this.cbCollectAttackersScreen(t,n.e,r,i,!0)}}},Model.Board.cbGetAttackers=function(t,e,r,i){var a=[];return t.cbUseScreenCapture?this.cbCollectAttackersScreen(r,t.g.threatGraph[r][e],a,i,!1):this.cbCollectAttackers(r,t.g.threatGraph[r][e],a,i),a},Model.Board.GenerateMoves=function(t){var e=this.cbGeneratePseudoLegalMoves(t);this.mMoves=[];for(var r=!0,i=this.kings[this.mWho],a=e.length,s=0;s<a;s++){var n=e[s],o=this.cbQuickApply(t,n);if(!(this.cbGetAttackers(t,this.kings[this.mWho],this.mWho,!0).length>0)){var h=this.cbGetAttackers(t,this.kings[-this.mWho],-this.mWho,!0).length>0;n.ck=h,this.mMoves.push(n),n.f!=i&&(r=!1)}this.cbQuickUnapply(t,o)}if(0==this.mMoves.length)this.mFinished=!0,this.mWinner=t.cbOnStaleMate?t.cbOnStaleMate*this.mWho:JocGame.DRAW,this.check&&(this.mWinner=-this.mWho);else if(this.ending[this.mWho]){if(!r)for(var s=0;s<this.mMoves.length;s++)this.mMoves[s].ko=!1}else if(!this.ending[this.mWho]&&r&&!this.check)for(var s=0;s<this.mMoves.length;s++)this.mMoves[s].ko=!0},Model.Board.GetSignature=function(){return this.zSign},Model.Move.Init=function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e])},Model.Move.Equals=function(t){return this.f==t.f&&this.t==t.t&&this.pr==t.pr},Model.Move.CopyFrom=function(t){this.Init(t)},Model.Move.ToString=function(e){var r=this;switch(e=e||"natural"){case"natural":return function(){var e;if(void 0!==r.cg?e=t.castle[r.f+"/"+r.cg].n:(e=r.a||"",e+=t.geometry.PosName(r.f),null==r.c?e+="-":e+="x",e+=t.geometry.PosName(r.t)),void 0!==r.pr){var i=t.pieceTypes[r.pr];i&&i.abbrev&&i.abbrev.length>0&&!i.silentPromo&&(e+="="+i.abbrev)}return r.ck&&(e+="+"),e}();case"engine":return function(){var e=t.geometry.PosName(r.f)+t.geometry.PosName(r.t);if(void 0!=r.pr){var i=t.pieceTypes[r.pr];i&&i.abbrev&&i.abbrev.length>0&&!i.silentPromo&&(e+=i.abbrev)}return e}();default:return"??"}},Model.Board.CompactMoveString=function(e,r,i){"function"!=typeof r.ToString&&(r=e.CreateMove(r));var a=r.ToString(),s=/^([A-Z]?)([a-z])([1-9][0-9]*)([-x])([a-z])([1-9][0-9]*)(.*?)$/.exec(a);if(!s)return a;var n=s[7];if(i||(i={}),i.value||(i.value=[]),0==i.value.length){var o=this.mMoves;this.mMoves&&0!=this.mMoves.length||this.GenerateMoves(e);for(var h=0;h<this.mMoves.length;h++){var c=this.mMoves[h];"function"!=typeof c.ToString&&(c=e.CreateMove(c)),i.value.push({str:c.ToString(),move:c})}this.mMoves=o}var p=[];if(i.value.forEach(function(t){var e=/^([A-Z]?[a-z][1-9][0-9]*[-x][a-z][1-9][0-9]*)(.*?)$/.exec(t.str);e&&t.move.t==r.t&&(t.move.a||"")==s[1]&&e[2]==n&&p.push(t.move)}),1==p.length)return""==s[1]&&"x"==s[4]?s[2]+"x"+s[5]+s[6]+s[7]:s[1]+("x"==s[4]?"x":"")+s[5]+s[6]+s[7];if(t.geometry.CompactCrit)for(var l="",h=0;;h++){var u=t.geometry.CompactCrit(r.f,h);if(null==u)return a;l+=u;for(var v=[],b=0;b<p.length;b++){var f=p[b];t.geometry.CompactCrit(f.f,h)==u&&v.push(f)}if(console.assert(v.length>0),1==v.length)return s[1]+l+("x"==s[4]?"x":"")+s[5]+s[6]+s[7];p=v}return a},Model.Board.cbIntegrity=function(t){function e(t,e){t||console.error(e)}for(var r=this,i=0;i<this.board.length;i++){var a=this.board[i];if(a>=0){var s=r.pieces[a];e(void 0!==s,"no piece at pos"),e(s.p==i,"piece has different pos")}}for(var a=0;a<this.pieces.length;a++){var s=this.pieces[a];s.p>=0&&e(r.board[s.p]==a,"board index mismatch")}},Model.Board.ExportBoardState=function(t){return t.cbVar.geometry.ExportBoardState?t.cbVar.geometry.ExportBoardState(this,t.cbVar,t.mPlayedMoves.length):"not supported"},Model.Game.Import=function(e,r){var i,a=[],s={1:{},"-1":{}},n=null,o=0;if("pjn"==e){var h={status:!1,error:"parse"},c=r.split(" ");if(6!=c.length)return console.warn("FEN should have 6 parts"),h;var p=c[0].split("/"),l=t.geometry.fenHeight||t.geometry.height;if(p.length!=l)return console.warn("FEN board should have",l,"rows, got",p.length),h;var u={};for(var v in t.pieceTypes){var b=t.pieceTypes[v],f=b.fenAbbrev||b.abbrev||"X";u[f.toUpperCase()]={s:1,t:v},u[f.toLowerCase()]={s:-1,t:v}}var d=t.geometry.FenRowPos||function(e,r){return(t.geometry.height-1-e)*t.geometry.width+r};if(p.forEach(function(e,r){for(var i=0,s=0;s<e.length;s++){var n=e.substr(s,1),o=u[n];if(void 0!==o){var c=d(r,i);i++;for(var p={s:o.s,t:o.t,p:c},l=!0,v=t.pieceTypes[p.t].initial||[],b=0;b<v.length;b++){var f=v[b];f.s==p.s&&f.p==c&&(l=!1)}p.m=l,a.push(p)}else{if(isNaN(parseInt(n)))return console.warn("FEN invalid board spec",n),h;i+=parseInt(n)}}}),a.sort(function(t,e){return e.s-t.s}),"w"==c[1])i=1;else{if("b"!=c[1])return console.warn("FEN invalid turn spec",c[1]),h;i=-1}s[1].k=c[2].indexOf("K")>=0,s[1].q=c[2].indexOf("Q")>=0,s[-1].k=c[2].indexOf("k")>=0,s[-1].q=c[2].indexOf("q")>=0,n="-"==c[3]?null:c[3];var g=parseInt(c[4]);isNaN(g)||(o=g);var m={pieces:a,turn:i,castle:s,enPassant:n,noCaptCount:o};return t.importGame&&t.importGame.call(this,m,e,r),{status:!0,initial:m}}return{status:!1,error:"unsupported"}}}(),function(){Model.Game.cbBoardGeometryGrid=function(t,e){function r(e){return e%t}function i(e){return Math.floor(e/t)}function a(e,r){return r*t+e}function s(s,n){var o=r(s),h=i(s),c=o+n[0],p=h+n[1];return c<0||c>=t||p<0||p>=e?null:a(c,p)}function n(t){return String.fromCharCode("a".charCodeAt(0)+r(t))+(i(t)+1)}function o(t){var e=/^([a-z])([0-9]+)$/.exec(t);return e?a(e[1].charCodeAt(0)-"a".charCodeAt(0),parseInt(e[2])-1):-1}function h(t,e){return 0==e?String.fromCharCode("a".charCodeAt(0)+r(t)):1==e?i(t)+1:null}function c(){for(var a=[],s=0;s<t*e;s++){var n=[];a.push(n);for(var o=0;o<t*e;o++){var h=i(s),c=r(s),p=i(o),l=r(o);n.push(Math.max(Math.abs(h-p),Math.abs(c-l)))}}return a}function p(r,i,s){for(var o=[],h=e-1;h>=0;h--){for(var c="",p=0,l=0;l<t;l++){var u=r.board[a(l,h)];if(u<0)p++;else{p>0&&(c+=p,p=0);var v=r.pieces[u],b=i.pieceTypes[v.t].fenAbbrev||i.pieceTypes[v.t].abbrev||"?";-1==v.s?c+=b.toLowerCase():c+=b.toUpperCase()}}p&&(c+=p),o.push(c)}var f=o.join("/");f+=" ",1==r.mWho?f+="w":f+="b",f+=" ";var d="";return r.castled&&(!1===r.castled[1]?d+="KQ":(r.castled[1].k&&(d+="K"),r.castled[1].q&&(d+="Q")),!1===r.castled[-1]?d+="kq":(r.castled[-1].k&&(d+="k"),r.castled[-1].q&&(d+="q"))),0==d.length&&(d="-"),f+=d,f+=" ",r.epTarget?f+=n(r.epTarget.p):f+="-",f+=" ",f+=r.noCaptCount,f+=" ",f+=Math.floor(s/2)+1}return{boardSize:t*e,width:t,height:e,C:r,R:i,POS:a,Graph:s,PosName:n,PosByName:o,CompactCrit:h,GetDistances:c,distEdge:function(){for(var a=[],s=0;s<t*e;s++){var n=r(s),o=i(s);a[s]=Math.min(n,Math.abs(t-n-1),o,Math.abs(e-o-1))}return a}(),corners:function(){var r={};return r[a(0,0)]=1,r[a(0,e-1)]=1,r[a(t-1,0)]=1,r[a(t-1,e-1)]=1,r}(),ExportBoardState:p}},Model.Game.cbPawnGraph=function(t,e,r){for(var i=this,a={},s=0;s<t.boardSize;s++)if(!r||s in r){var n=[],o=t.Graph(s,[0,e]);null!=o&&(!r||o in r)&&n.push(i.cbTypedArray([o|i.cbConstants.FLAG_MOVE])),[-1,1].forEach(function(a){var o=t.Graph(s,[a,e]);null!=o&&(!r||o in r)&&n.push(i.cbTypedArray([o|i.cbConstants.FLAG_CAPTURE]))}),a[s]=n}else a[s]=[];return a},Model.Game.cbInitialPawnGraph=function(t,e,r){for(var i=this,a={},s=0;s<t.boardSize;s++)if(!r||s in r){var n=[],o=t.Graph(s,[0,e]);if(null!=o&&(!r||o in r)){var h=[o|i.cbConstants.FLAG_MOVE],c=t.Graph(o,[0,e]);null!=c&&(!r||c in r)&&h.push(c|i.cbConstants.FLAG_MOVE),n.push(i.cbTypedArray(h))}[-1,1].forEach(function(a){var o=t.Graph(s,[a,e]);null!=o&&(!r||o in r)&&n.push(i.cbTypedArray([o|i.cbConstants.FLAG_CAPTURE]))}),a[s]=n}else a[s]=[];return a},Model.Game.cbKingGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],e)},Model.Game.cbKnightGraph=function(t,e){return this.cbShortRangeGraph(t,[[2,-1],[2,1],[-2,-1],[-2,1],[-1,2],[-1,-2],[1,2],[1,-2]],e)},Model.Game.cbHorseGraph=function(t){for(var e=this,r={},i=0;i<t.boardSize;i++)r[i]=[],[[1,0,2,-1],[1,0,2,1],[-1,0,-2,-1],[-1,0,-2,1],[0,1,-1,2],[0,-1,-1,-2],[0,1,1,2],[0,-1,1,-2]].forEach(function(a){var s=t.Graph(i,[a[0],a[1]]);if(null!=s){var n=t.Graph(i,[a[2],a[3]]);null!=n&&r[i].push(e.cbTypedArray([s|e.cbConstants.FLAG_STOP,n|e.cbConstants.FLAG_MOVE|e.cbConstants.FLAG_CAPTURE]))}});return r},Model.Game.cbRookGraph=function(t,e){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0]],e)},Model.Game.cbBishopGraph=function(t,e){return this.cbLongRangeGraph(t,[[1,-1],[1,1],[-1,1],[-1,-1]],e)},Model.Game.cbQueenGraph=function(t,e){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0],[1,-1],[1,1],[-1,1],[-1,-1]],e)},Model.Game.cbXQGeneralGraph=function(t,e){for(var r=this,i={},a=0;a<t.boardSize;a++)i[a]=[],[[-1,0,!1],[0,-1,!0],[0,1,!0],[1,0,!1]].forEach(function(s){var n=[],o=t.Graph(a,s);if(null!=o&&((!e||o in e)&&n.push(o|r.cbConstants.FLAG_MOVE|r.cbConstants.FLAG_CAPTURE),s[2]))for(var h=t.Graph(o,s);null!=h;)!e||h in e?n.push(h|r.cbConstants.FLAG_CAPTURE|r.cbConstants.FLAG_CAPTURE_KING):n.push(h|r.cbConstants.FLAG_STOP),h=t.Graph(h,s);n.length>0&&i[a].push(r.cbTypedArray(n))});return i},Model.Game.cbXQSoldierGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e]])},Model.Game.cbXQPromoSoldierGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e],[-1,0],[1,0]])},Model.Game.cbXQAdvisorGraph=function(t,e){return this.cbShortRangeGraph(t,[[1,1],[-1,1],[1,-1],[-1,-1]],e)},Model.Game.cbXQCannonGraph=function(t){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0]],null,this.cbConstants.FLAG_MOVE|this.cbConstants.FLAG_SCREEN_CAPTURE)},Model.Game.cbXQElephantGraph=function(t,e){for(var r=this,i={},a=0;a<t.boardSize;a++)i[a]=[],(!e||a in e)&&[[1,1,2,2],[1,-1,2,-2],[-1,1,-2,2],[-1,-1,-2,-2]].forEach(function(s){var n=t.Graph(a,[s[0],s[1]]);if(null!=n){var o=t.Graph(a,[s[2],s[3]]);null!=o&&(!e||o in e)&&i[a].push(r.cbTypedArray([n|r.cbConstants.FLAG_STOP,o|r.cbConstants.FLAG_MOVE|r.cbConstants.FLAG_CAPTURE]))}});return i},Model.Game.cbSilverGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e],[-1,-1],[-1,1],[1,-1],[1,1]])},Model.Game.cbFersGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1]])},Model.Game.cbSchleichGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,0],[1,0],[0,-1],[0,1]])},Model.Game.cbAlfilGraph=function(t,e){return this.cbShortRangeGraph(t,[[-2,-2],[-2,2],[2,2],[2,-2]])}}(),function(){var t=Model.Game.cbBoardGeometryGrid(8,8);Model.Game.cbDefine=function(){return{geometry:t,pieceTypes:{0:{name:"pawn-w",aspect:"mk-pawn",graph:this.cbPawnGraph(t,1),value:1,abbrev:"",fenAbbrev:"P",initial:[{s:1,p:16},{s:1,p:17},{s:1,p:18},{s:1,p:19},{s:1,p:20},{s:1,p:21},{s:1,p:22},{s:1,p:23}]},1:{name:"pawn-b",aspect:"mk-pawn",graph:this.cbPawnGraph(t,-1),value:1,abbrev:"",fenAbbrev:"P",initial:[{s:-1,p:40},{s:-1,p:41},{s:-1,p:42},{s:-1,p:43},{s:-1,p:44},{s:-1,p:45},{s:-1,p:46},{s:-1,p:47}]},2:{name:"horse",aspect:"mk-knight",graph:this.cbKnightGraph(t),value:3.5,abbrev:"N",initial:[{s:1,p:1},{s:1,p:6},{s:-1,p:57},{s:-1,p:62}]},3:{name:"khon-w",aspect:"mk-bishop",graph:this.cbSilverGraph(t,1),value:3,abbrev:"B",initial:[{s:1,p:2},{s:1,p:5}]},4:{name:"khon-b",aspect:"mk-bishop",graph:this.cbSilverGraph(t,-1),value:3,abbrev:"B",initial:[{s:-1,p:58},{s:-1,p:61}]},5:{name:"rook",aspect:"mk-rook",graph:this.cbRookGraph(t),value:5,abbrev:"R",initial:[{s:1,p:0},{s:1,p:7},{s:-1,p:56},{s:-1,p:63}],castle:!0},6:{name:"met",aspect:"mk-queen",graph:this.cbFersGraph(t),value:2,abbrev:"Q",initial:[{s:1,p:4},{s:-1,p:59}]},7:{name:"king",aspect:"mk-king",isKing:!0,graph:this.cbKingGraph(t),abbrev:"K",initial:[{s:1,p:3},{s:-1,p:60}]}},evaluate:function(t,e,r){function i(t){var e=64,i=r[t].count;2==i[5]?e=8:1==i[5]?e=16:2==i[1==t?3:4]?e=22:1==i[1==t?3:4]?e=44:2==i[2]&&(e=32),a.noCaptCount>=2*e&&(a.mFinished=!0,a.mWinner=JocGame.DRAW)}var a=this;0==r[1].count[0]&&i(-1),0==r[-1].count[1]&&i(1)},promote:function(e,r,i){return 0==r.t&&5==t.R(i.t)?[6]:1==r.t&&2==t.R(i.t)?[6]:[]}}}}();