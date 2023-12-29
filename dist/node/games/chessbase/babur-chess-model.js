exports.model=Model={Game:{},Board:{},Move:{}},function(){var t;Model.Game.cbConstants={MASK:65535,FLAG_MOVE:65536,FLAG_CAPTURE:131072,FLAG_STOP:262144,FLAG_SCREEN_CAPTURE:524288,FLAG_CAPTURE_KING:1048576,FLAG_CAPTURE_NO_KING:2097152};var e="undefined"!=typeof Int32Array;Model.Game.cbUseTypedArrays=e,Model.Game.cbTypedArray=function(t){if(e){var r=new Int32Array(t.length);return r.set(t),r}for(var a=[],i=t.length,s=0;s<i;s++)a.push(t[s]);return a},Model.Game.cbShortRangeGraph=function(t,e,r,a){var i=this;void 0===a&&(a=196608);for(var s={},n=0;n<t.boardSize;n++)s[n]=[],(!r||n in r)&&e.forEach(function(e){var o=t.Graph(n,e);null!=o&&(!r||o in r)&&s[n].push(i.cbTypedArray([o|a]))});return s},Model.Game.cbLongRangeGraph=function(t,e,r,a,i){var s=this;void 0!==a&&null!=a||(a=196608),i||(i=1/0);for(var n={},o=0;o<t.boardSize;o++)n[o]=[],(!r||o in r)&&e.forEach(function(e){for(var h=[],p=t.Graph(o,e),c=0;null!=p&&(!r||p in r)&&(h.push(p|a),++c!=i);)p=t.Graph(p,e);h.length>0&&n[o].push(s.cbTypedArray(h))});return n},Model.Game.cbNullGraph=function(t){for(var e={},r=0;r<t.boardSize;r++)e[r]=[];return e},Model.Game.cbAuthorGraph=function(t){for(var e={},r=0;r<t.boardSize;r++){e[r]=[];for(var a=0;a<t.boardSize;a++)e[r].push([2293760|a])}return e},Model.Game.cbMergeGraphs=function(t){for(var e=[],r=0;r<t.boardSize;r++){e[r]=[];for(var a=1;a<arguments.length;a++)e[r]=e[r].concat(arguments[a][r])}return e},Model.Game.cbGetThreatGraph=function(){function t(e,r){for(var a in n){var i=n[a];if(!(i.p.length<r.length+1)){for(var s=!0,o=0;o<r.length;o++)if(r[o]!=i.p[o]){s=!1;break}if(s){var h=i.p[r.length],p=e[h];void 0===p&&(p={e:{}},e[h]=p),i.p.length==r.length+1&&(p.t=i.t,p.ts=i.ts,p.tk=i.tk,delete n[a]),r.push(h),t(p.e,r),r.pop()}}}}var e=this;this.cbUseScreenCapture=!1,this.cbUseCaptureKing=!1,this.cbUseCaptureNoKing=!1;for(var r={1:[],"-1":[]},a=[],i=0;i<this.g.boardSize;i++)this.g.pTypes.forEach(function(t,r){t.graph[i].forEach(function(t){for(var s=[],n=0;n<t.length;n++){var o=t[n];1048576&o?(e.cbUseCaptureKing=!0,s.unshift({d:65535&o,a:i,tk:r})):2097152&o?(e.cbUseCaptureNoKing=!0,s.unshift({d:65535&o,a:i,tnk:r})):131072&o?s.unshift({d:65535&o,a:i,t:r}):262144&o?s.unshift({d:65535&o,a:i}):524288&o&&(e.cbUseScreenCapture=!0,s.unshift({d:65535&o,a:i,ts:r}))}s.length>0&&a.push(s)})});var s={};a.forEach(function(t){t.forEach(function(e,r){var a=s[e.d];void 0===a&&(a={},s[e.d]=a);for(var i=[],n=r+1;n<t.length;n++)i.push(t[n].d);i.push(e.a);var o=i.join(","),h=a[o];void 0===h&&(h={p:i,t:{},ts:{},tk:{}},a[o]=h),void 0!==e.t?h.t[e.t]=!0:void 0!==e.tk?h.tk[e.tk]=!0:void 0!==e.ts&&(h.ts[e.ts]=!0)})});for(var i=0;i<e.g.boardSize;i++){var n=s[i],o={};t(o,[]),r[1][i]=o,r[-1][i]=o}return r},Model.Game.InitGame=function(){var e=this;this.cbVar=t=this.cbDefine(),this.g.boardSize=this.cbVar.geometry.boardSize,this.g.pTypes=this.cbGetPieceTypes(),this.g.threatGraph=this.cbGetThreatGraph(),this.g.distGraph=this.cbVar.geometry.GetDistances(),this.cbPiecesCount=0,this.g.castleablePiecesCount={1:0,"-1":0};for(var r in t.pieceTypes){var a=t.pieceTypes[r];if(a.castle){(a.initial||[]).forEach(function(t){e.g.castleablePiecesCount[t.s]++})}a.initial&&(this.cbPiecesCount+=a.initial.length)}for(var i=[],r=0;r<this.cbPiecesCount;r++)i.push(r);var s=Object.keys(t.pieceTypes);this.zobrist=new JocGame.Zobrist({board:{type:"array",size:this.cbVar.geometry.boardSize,values:i},who:{values:["1","-1"]},type:{type:"array",size:this.cbPiecesCount,values:s}})},Model.Game.cbGetPieceTypes=function(){for(var t=[],e={},r=0;r<this.cbVar.geometry.boardSize;r++)e[r]=[];for(var a in this.cbVar.pieceTypes){var i=this.cbVar.pieceTypes[a];t[a]={graph:i.graph||e,abbrev:i.abbrev||"",value:i.isKing?100:i.value||1,isKing:!!i.isKing,castle:!!i.castle,epTarget:!!i.epTarget,epCatch:!!i.epCatch}}return t},Model.Board.Init=function(t){this.zSign=0},Model.Board.InitialPosition=function(r){var a=this;this.board=e?new Int16Array(r.g.boardSize):[];for(var i=0;i<r.g.boardSize;i++)this.board[i]=-1;if(this.kings={},this.pieces=[],this.ending={1:!1,"-1":!1},this.lastMove=null,r.cbVar.castle&&(this.castled={1:!1,"-1":!1}),this.zSign=r.zobrist.update(0,"who",-1),this.noCaptCount=0,this.mWho=1,r.mInitial)this.mWho=r.mInitial.turn||1,r.mInitial.pieces.forEach(function(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);a.pieces.push(e)}),r.mInitial.lastMove&&(this.lastMove={f:r.mInitial.lastMove.f,t:r.mInitial.lastMove.t}),void 0!==r.mInitial.noCaptCount&&(this.noCaptCount=r.mInitial.noCaptCount),r.cbVar.castle&&r.mInitial.castle&&(this.castled={1:{k:!!r.mInitial.castle[1]&&!!r.mInitial.castle[1].k,q:!!r.mInitial.castle[1]&&!!r.mInitial.castle[1].q},"-1":{k:!!r.mInitial.castle[-1]&&!!r.mInitial.castle[-1].k,q:!!r.mInitial.castle[-1]&&!!r.mInitial.castle[-1].q}});else for(var s in r.cbVar.pieceTypes)for(var n=r.cbVar.pieceTypes[s],o=n.initial||[],h=0;h<o.length;h++){var p=o[h],c={s:p.s,t:parseInt(s),p:p.p,m:!1};this.pieces.push(c)}if(this.pieces.sort(function(t,e){if(t.s!=e.s)return e.s-t.s;var a=r.cbVar.pieceTypes[t.t].value||100,i=r.cbVar.pieceTypes[e.t].value||100;return a!=i?a-i:t.p-e.p}),this.pieces.forEach(function(t,e){t.i=e,a.board[t.p]=e,r.g.pTypes[t.t].isKing&&(a.kings[t.s]=t.p),a.zSign=r.zobrist.update(a.zSign,"board",e,t.p),a.zSign=r.zobrist.update(a.zSign,"type",t.t,e)}),r.mInitial&&r.mInitial.enPassant){var i=t.geometry.PosByName(r.mInitial.enPassant);if(i>=0){var l,u=t.geometry.C(i),b=t.geometry.R(i);l=1==r.mInitial.turn?t.geometry.POS(u,b-1):t.geometry.POS(u,b+1),this.epTarget={p:i,i:this.board[l]}}}},Model.Board.CopyFrom=function(t){if(e)this.board=new Int16Array(t.board.length),this.board.set(t.board);else{this.board=[];for(var r=t.board,a=r.length,i=0;i<a;i++)this.board.push(r[i])}this.pieces=[];for(var s=t.pieces.length,i=0;i<s;i++){var n=t.pieces[i];this.pieces.push({s:n.s,p:n.p,t:n.t,i:n.i,m:n.m})}this.kings={1:t.kings[1],"-1":t.kings[-1]},this.check=t.check,t.lastMove?this.lastMove={f:t.lastMove.f,t:t.lastMove.t,c:t.lastMove.c}:this.lastMove=null,this.ending={1:t.ending[1],"-1":t.ending[-1]},void 0!==t.castled&&(this.castled={1:t.castled[1],"-1":t.castled[-1]}),this.noCaptCount=t.noCaptCount,t.epTarget?this.epTarget={p:t.epTarget.p,i:t.epTarget.i}:this.epTarget=null,this.mWho=t.mWho,this.zSign=t.zSign},Model.Board.cbApplyCastle=function(t,e,r){var a=t.cbVar.castle[e.f+"/"+e.cg],i=a.r[a.r.length-1],s=this.pieces[this.board[e.cg]],n=a.k[a.k.length-1],o=this.pieces[this.board[e.f]];return r&&(this.zSign=t.zobrist.update(this.zSign,"board",s.i,e.cg),this.zSign=t.zobrist.update(this.zSign,"board",s.i,i),this.zSign=t.zobrist.update(this.zSign,"board",o.i,e.f),this.zSign=t.zobrist.update(this.zSign,"board",o.i,n)),s.p=i,s.m=!0,this.board[e.cg]=-1,o.p=n,o.m=!0,this.board[e.f]=-1,this.board[i]=s.i,this.board[n]=o.i,this.castled[s.s]=!0,this.kings[o.s]=n,[{i:s.i,f:i,t:-1},{i:o.i,f:n,t:e.f,kp:e.f,who:o.s,m:!1},{i:s.i,f:-1,t:e.cg,m:!1,cg:!1}]},Model.Board.cbQuickApply=function(t,e){if(void 0!==e.cg)return this.cbApplyCastle(t,e,!1);var r=[],a=this.board[e.f],i=this.pieces[a];if(null!=e.c){r.unshift({i:e.c,f:-1,t:this.pieces[e.c].p});var s=this.pieces[e.c];this.board[s.p]=-1,s.p=-1}var n=this.kings[i.s];return t.g.pTypes[i.t].isKing&&(this.kings[i.s]=e.t),r.unshift({i:a,f:e.t,t:e.f,kp:n,who:i.s,ty:i.t}),i.p=e.t,void 0!==e.pr&&(i.t=e.pr),this.board[e.f]=-1,this.board[e.t]=a,r},Model.Board.cbQuickUnapply=function(t,e){for(var r=0;r<e.length;r++){var a=e[r],i=this.pieces[a.i];a.f>=0&&(i.p=-1,this.board[a.f]=-1),a.t>=0&&(i.p=a.t,this.board[a.t]=a.i),void 0!==a.m&&(i.m=a.m),void 0!==a.kp&&(this.kings[a.who]=a.kp),void 0!=a.ty&&(i.t=a.ty),void 0!=a.cg&&(this.castled[i.s]=a.cg)}},Model.Board.ApplyMove=function(t,e){var r=this.pieces[this.board[e.f]];if(void 0!==e.cg)this.cbApplyCastle(t,e,!0);else{if(this.zSign=t.zobrist.update(this.zSign,"board",r.i,e.f),this.board[r.p]=-1,void 0!==e.pr&&(this.zSign=t.zobrist.update(this.zSign,"type",r.t,r.i),r.t=e.pr,this.zSign=t.zobrist.update(this.zSign,"type",r.t,r.i)),null!=e.c){var a=this.pieces[e.c];this.zSign=t.zobrist.update(this.zSign,"board",a.i,a.p),this.board[a.p]=-1,a.p=-1,a.m=!0,this.noCaptCount=0}else this.noCaptCount++;r.p=e.t,r.m=!0,this.board[e.t]=r.i,this.zSign=t.zobrist.update(this.zSign,"board",r.i,e.t),t.g.pTypes[r.t].isKing&&(this.kings[r.s]=e.t)}this.check=!!e.ck,this.lastMove={f:e.f,t:e.t,c:e.c},void 0!==e.ko&&(this.ending[r.s]=e.ko),void 0!==e.ept?this.epTarget={p:e.ept,i:r.i}:this.epTarget=null,this.zSign=t.zobrist.update(this.zSign,"who",-this.mWho),this.zSign=t.zobrist.update(this.zSign,"who",this.mWho)},Model.Board.Evaluate=function(r){function a(e){var r=1/0;for(var a in t.geometry.corners)r=Math.min(r,h.distGraph[s.kings[e]][a]);return r-Math.sqrt(h.boardSize)}var i="debug"==arguments[3],s=this;this.mEvaluation=0;var n,o=this.mWho,h=r.g;if(e)n={1:{count:new Uint8Array(h.pTypes.length),byType:{}},"-1":{count:new Uint8Array(h.pTypes.length),byType:{}}};else{n={1:{count:[],byType:{}},"-1":{count:[],byType:{}}};for(var p=0;p<h.pTypes.length;p++)n[1].count[p]=n[-1].count[p]=0}if(r.mOptions.preventRepeat&&r.GetRepeatOccurence(this)>2)return this.mFinished=!0,void(this.mWinner=r.cbOnPerpetual?o*r.cbOnPerpetual:JocGame.DRAW);for(var c={1:0,"-1":0},l={1:h.distGraph[this.kings[-1]],"-1":h.distGraph[this.kings[1]]},u={1:0,"-1":0},b={1:0,"-1":0},v={1:0,"-1":0},f={1:0,"-1":0},g={1:!1,"-1":!1},d=this.pieces,m=d.length,p=0;p<m;p++){var G=d[p];if(G.p>=0){var y=G.s,M=h.pTypes[G.t];M.isKing?g[y]=G.m:c[y]+=M.value,M.castle&&!G.m&&f[y]++,b[y]++,u[y]+=l[y][G.p],v[y]+=t.geometry.distEdge[G.p];var C=n[y];C.count[G.t]++;var S=C.byType;void 0===S[G.t]?S[G.t]=[G]:S[G.t].push(G)}}if(this.lastMove&&null!=this.lastMove.c){var G=this.pieces[this.board[this.lastMove.t]];c[-G.s]+=this.cbStaticExchangeEval(r,G.p,G.s,{piece:G})}var A={1:0,"-1":0},T={1:0,"-1":0},k={1:0,"-1":0};this.ending[1]&&(T[1]=(u[1]-Math.sqrt(h.boardSize))/b[1],t.geometry.corners&&(k[1]=a(1))),this.ending[-1]&&(T[-1]=(u[-1]-Math.sqrt(h.boardSize))/b[-1],t.geometry.corners&&(k[1]=a(-1)));var z={pieceValue:c[1]-c[-1],pieceValueRatio:(c[1]-c[-1])/(c[1]+c[-1]+1),posValue:v[1]-v[-1],averageDistKing:u[1]/b[1]-u[-1]/b[-1],check:this.check?-o:0,endingKingFreedom:A[1]-A[-1],endingDistKing:T[1]-T[-1],distKingCorner:k[1]-k[-1]};t.castle&&(z.castle=(this.castled[1]?1:g[1]?0:f[1]/(h.castleablePiecesCount[1]+1))-(this.castled[-1]?1:g[-1]?0:f[-1]/(h.castleablePiecesCount[-1]+1))),t.evaluate&&t.evaluate.call(this,r,z,n);var E=r.mOptions.levelOptions;for(var P in z){var R=z[P],F=E[P+"Factor"]||0,I=R*F;i&&console.log(P,"=",R,"*",F,"=>",I),this.mEvaluation+=I}i&&console.log("Evaluation",this.mEvaluation)},Model.Board.cbGeneratePseudoLegalMoves=function(t){function e(e,i){var s=t.cbVar.promote;if(!s)return void a.push(i);var n=s.call(r,t,e,i);if(null!=n)if(0==n.length)a.push(i);else if(1==n.length)i.pr=n[0],a.push(i);else for(var o=0;o<n.length;o++){var h=n[o];a.push({f:i.f,t:i.t,c:i.c,pr:h,ept:i.ept,ep:i.ep,a:i.a})}}for(var r=this,a=[],i=t.cbVar,s=this.mWho,n=!i.castle||this.check||this.castled[s]?null:[],o=-1,h=this.pieces.length,p=0;p<h;p++){var c=this.pieces[p];if(!(c.p<0||c.s!=s)){var l=t.g.pTypes[c.t];l.isKing&&(c.m?n=null:o=c),n&&l.castle&&!c.m&&n.push(c);var u,b;u=l.graph[c.p],b=u.length;for(var v=0;v<b;v++)for(var f=u[v],g=!1,d=f.length,m=null,G=0;G<d;G++){var y=f[G],M=65535&y,C=this.board[M];if(!(C<0)||l.epCatch&&this.epTarget&&this.epTarget.p==M){if(!(524288&y)){var S;S=C<0?this.pieces[this.epTarget.i]:this.pieces[C],!(S.s!=c.s&&131072&y)||1048576&y&&!t.g.pTypes[S.t].isKing||2097152&y&&t.g.pTypes[S.t].isKing||e(c,{f:c.p,t:M,c:S.i,a:l.abbrev,ep:C<0});break}if(g){var S=this.pieces[C];S.s!=c.s&&e(c,{f:c.p,t:M,c:S.i,a:l.abbrev});break}g=!0}else 65536&y&&0==g&&e(c,{f:c.p,t:M,c:null,a:l.abbrev,ept:null!=m&&l.epTarget?m:void 0});m=M}}}if(n)for(var p=0;p<n.length;p++){var A=n[p],T=t.cbVar.castle[o.p+"/"+A.p];if(T){for(var k=!0,v=0;v<T.r.length;v++){var z=T.r[v];if(this.board[z]>=0&&z!=o.p&&z!=A.p){k=!1;break}}if(k){for(var E=!0,v=0;v<T.k.length;v++){var z=T.k[v];if(this.board[z]>=0&&z!=A.p&&z!=o.p||this.cbGetAttackers(t,z,s).length>0){E=!1;break}}E&&a.push({f:o.p,t:T.k[T.k.length-1],c:null,cg:A.p})}}}return a},Model.Board.cbStaticExchangeEval=function(t,e,r,a){var i=0,s=this.cbGetSmallestAttacker(t,e,r);if(s){var n=this.mWho;this.mWho=s.s;var o=this.cbQuickApply(t,{f:s.p,t:e,c:a.piece.i}),h=t.g.pTypes[a.piece.t].value;a.piece=s,i=Math.max(0,h-this.cbStaticExchangeEval(t,e,-r,a)),this.cbQuickUnapply(t,o),this.mWho=n}return i},Model.Board.cbGetSmallestAttacker=function(t,e,r){var a=this.cbGetAttackers(t,e,r);if(0==a.length)return null;for(var i=1/0,s=null,n=a.length,o=0;o<n;o++){var h=a[o],p=t.g.pTypes[h.t].value;p<i&&(i=p,s=h)}return s},Model.Board.cbCollectAttackers=function(t,e,r,a){for(var i in e){var s=e[i],n=this.board[i];if(n<0)this.cbCollectAttackers(t,s.e,r,a);else{var o=this.pieces[n];o.s==-t&&(s.t&&o.t in s.t||a&&s.tk&&o.t in s.tk)&&r.push(o)}}},Model.Board.cbCollectAttackersScreen=function(t,e,r,a,i){for(var s in e){var n=e[s],o=this.board[s];if(o<0)this.cbCollectAttackersScreen(t,n.e,r,a,i);else{var h=this.pieces[o];!i&&h.s==-t&&(n.t&&h.t in n.t||a&&n.tk&&h.t in n.tk)?r.push(h):i?i&&h.s==-t&&n.ts&&h.t in n.ts&&r.push(h):this.cbCollectAttackersScreen(t,n.e,r,a,!0)}}},Model.Board.cbGetAttackers=function(t,e,r,a){var i=[];return t.cbUseScreenCapture?this.cbCollectAttackersScreen(r,t.g.threatGraph[r][e],i,a,!1):this.cbCollectAttackers(r,t.g.threatGraph[r][e],i,a),i},Model.Board.GenerateMoves=function(t){var e=this.cbGeneratePseudoLegalMoves(t);this.mMoves=[];for(var r=!0,a=this.kings[this.mWho],i=e.length,s=0;s<i;s++){var n=e[s],o=this.cbQuickApply(t,n);if(!(this.cbGetAttackers(t,this.kings[this.mWho],this.mWho,!0).length>0)){var h=this.cbGetAttackers(t,this.kings[-this.mWho],-this.mWho,!0).length>0;n.ck=h,this.mMoves.push(n),n.f!=a&&(r=!1)}this.cbQuickUnapply(t,o)}if(0==this.mMoves.length)this.mFinished=!0,this.mWinner=t.cbOnStaleMate?t.cbOnStaleMate*this.mWho:JocGame.DRAW,this.check&&(this.mWinner=-this.mWho);else if(this.ending[this.mWho]){if(!r)for(var s=0;s<this.mMoves.length;s++)this.mMoves[s].ko=!1}else if(!this.ending[this.mWho]&&r&&!this.check)for(var s=0;s<this.mMoves.length;s++)this.mMoves[s].ko=!0},Model.Board.GetSignature=function(){return this.zSign},Model.Move.Init=function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e])},Model.Move.Equals=function(t){return this.f==t.f&&this.t==t.t&&this.pr==t.pr},Model.Move.CopyFrom=function(t){this.Init(t)},Model.Move.ToString=function(e){var r=this;switch(e=e||"natural"){case"natural":return function(){var e;if(void 0!==r.cg?e=t.castle[r.f+"/"+r.cg].n:(e=r.a||"",e+=t.geometry.PosName(r.f),null==r.c?e+="-":e+="x",e+=t.geometry.PosName(r.t)),void 0!==r.pr){var a=t.pieceTypes[r.pr];a&&a.abbrev&&a.abbrev.length>0&&!a.silentPromo&&(e+="="+a.abbrev)}return r.ck&&(e+="+"),e}();case"engine":return function(){var e=t.geometry.PosName(r.f)+t.geometry.PosName(r.t);if(void 0!=r.pr){var a=t.pieceTypes[r.pr];a&&a.abbrev&&a.abbrev.length>0&&!a.silentPromo&&(e+=a.abbrev)}return e}();default:return"??"}},Model.Board.CompactMoveString=function(e,r,a){"function"!=typeof r.ToString&&(r=e.CreateMove(r));var i=r.ToString(),s=/^([A-Z]?)([a-z])([1-9][0-9]*)([-x])([a-z])([1-9][0-9]*)(.*?)$/.exec(i);if(!s)return i;var n=s[7];if(a||(a={}),a.value||(a.value=[]),0==a.value.length){var o=this.mMoves;this.mMoves&&0!=this.mMoves.length||this.GenerateMoves(e);for(var h=0;h<this.mMoves.length;h++){var p=this.mMoves[h];"function"!=typeof p.ToString&&(p=e.CreateMove(p)),a.value.push({str:p.ToString(),move:p})}this.mMoves=o}var c=[];if(a.value.forEach(function(t){var e=/^([A-Z]?[a-z][1-9][0-9]*[-x][a-z][1-9][0-9]*)(.*?)$/.exec(t.str);e&&t.move.t==r.t&&(t.move.a||"")==s[1]&&e[2]==n&&c.push(t.move)}),1==c.length)return""==s[1]&&"x"==s[4]?s[2]+"x"+s[5]+s[6]+s[7]:s[1]+("x"==s[4]?"x":"")+s[5]+s[6]+s[7];if(t.geometry.CompactCrit)for(var l="",h=0;;h++){var u=t.geometry.CompactCrit(r.f,h);if(null==u)return i;l+=u;for(var b=[],v=0;v<c.length;v++){var f=c[v];t.geometry.CompactCrit(f.f,h)==u&&b.push(f)}if(console.assert(b.length>0),1==b.length)return s[1]+l+("x"==s[4]?"x":"")+s[5]+s[6]+s[7];c=b}return i},Model.Board.cbIntegrity=function(t){function e(t,e){t||console.error(e)}for(var r=this,a=0;a<this.board.length;a++){var i=this.board[a];if(i>=0){var s=r.pieces[i];e(void 0!==s,"no piece at pos"),e(s.p==a,"piece has different pos")}}for(var i=0;i<this.pieces.length;i++){var s=this.pieces[i];s.p>=0&&e(r.board[s.p]==i,"board index mismatch")}},Model.Board.ExportBoardState=function(t){return t.cbVar.geometry.ExportBoardState?t.cbVar.geometry.ExportBoardState(this,t.cbVar,t.mPlayedMoves.length):"not supported"},Model.Game.Import=function(e,r){var a,i=[],s={1:{},"-1":{}},n=null,o=0;if("pjn"==e){var h={status:!1,error:"parse"},p=r.split(" ");if(6!=p.length)return console.warn("FEN should have 6 parts"),h;var c=p[0].split("/"),l=t.geometry.fenHeight||t.geometry.height;if(c.length!=l)return console.warn("FEN board should have",l,"rows, got",c.length),h;var u={};for(var b in t.pieceTypes){var v=t.pieceTypes[b],f=v.fenAbbrev||v.abbrev||"X";u[f.toUpperCase()]={s:1,t:b},u[f.toLowerCase()]={s:-1,t:b}}var g=t.geometry.FenRowPos||function(e,r){return(t.geometry.height-1-e)*t.geometry.width+r};if(c.forEach(function(e,r){for(var a=0,s=0;s<e.length;s++){var n=e.substr(s,1),o=u[n];if(void 0!==o){var p=g(r,a);a++;for(var c={s:o.s,t:o.t,p:p},l=!0,b=t.pieceTypes[c.t].initial||[],v=0;v<b.length;v++){var f=b[v];f.s==c.s&&f.p==p&&(l=!1)}c.m=l,i.push(c)}else{if(isNaN(parseInt(n)))return console.warn("FEN invalid board spec",n),h;a+=parseInt(n)}}}),i.sort(function(t,e){return e.s-t.s}),"w"==p[1])a=1;else{if("b"!=p[1])return console.warn("FEN invalid turn spec",p[1]),h;a=-1}s[1].k=p[2].indexOf("K")>=0,s[1].q=p[2].indexOf("Q")>=0,s[-1].k=p[2].indexOf("k")>=0,s[-1].q=p[2].indexOf("q")>=0,n="-"==p[3]?null:p[3];var d=parseInt(p[4]);isNaN(d)||(o=d);var m={pieces:i,turn:a,castle:s,enPassant:n,noCaptCount:o};return t.importGame&&t.importGame.call(this,m,e,r),{status:!0,initial:m}}return{status:!1,error:"unsupported"}}}(),function(){Model.Game.cbBoardGeometryGrid=function(t,e){function r(e){return e%t}function a(e){return Math.floor(e/t)}function i(e,r){return r*t+e}function s(s,n){var o=r(s),h=a(s),p=o+n[0],c=h+n[1];return p<0||p>=t||c<0||c>=e?null:i(p,c)}function n(t){return String.fromCharCode("a".charCodeAt(0)+r(t))+(a(t)+1)}function o(t){var e=/^([a-z])([0-9]+)$/.exec(t);return e?i(e[1].charCodeAt(0)-"a".charCodeAt(0),parseInt(e[2])-1):-1}function h(t,e){return 0==e?String.fromCharCode("a".charCodeAt(0)+r(t)):1==e?a(t)+1:null}function p(){for(var i=[],s=0;s<t*e;s++){var n=[];i.push(n);for(var o=0;o<t*e;o++){var h=a(s),p=r(s),c=a(o),l=r(o);n.push(Math.max(Math.abs(h-c),Math.abs(p-l)))}}return i}function c(r,a,s){for(var o=[],h=e-1;h>=0;h--){for(var p="",c=0,l=0;l<t;l++){var u=r.board[i(l,h)];if(u<0)c++;else{c>0&&(p+=c,c=0);var b=r.pieces[u],v=a.pieceTypes[b.t].fenAbbrev||a.pieceTypes[b.t].abbrev||"?";-1==b.s?p+=v.toLowerCase():p+=v.toUpperCase()}}c&&(p+=c),o.push(p)}var f=o.join("/");f+=" ",1==r.mWho?f+="w":f+="b",f+=" ";var g="";return r.castled&&(!1===r.castled[1]?g+="KQ":(r.castled[1].k&&(g+="K"),r.castled[1].q&&(g+="Q")),!1===r.castled[-1]?g+="kq":(r.castled[-1].k&&(g+="k"),r.castled[-1].q&&(g+="q"))),0==g.length&&(g="-"),f+=g,f+=" ",r.epTarget?f+=n(r.epTarget.p):f+="-",f+=" ",f+=r.noCaptCount,f+=" ",f+=Math.floor(s/2)+1}return{boardSize:t*e,width:t,height:e,C:r,R:a,POS:i,Graph:s,PosName:n,PosByName:o,CompactCrit:h,GetDistances:p,distEdge:function(){for(var i=[],s=0;s<t*e;s++){var n=r(s),o=a(s);i[s]=Math.min(n,Math.abs(t-n-1),o,Math.abs(e-o-1))}return i}(),corners:function(){var r={};return r[i(0,0)]=1,r[i(0,e-1)]=1,r[i(t-1,0)]=1,r[i(t-1,e-1)]=1,r}(),ExportBoardState:c}},Model.Game.cbPawnGraph=function(t,e,r){for(var a=this,i={},s=0;s<t.boardSize;s++)if(!r||s in r){var n=[],o=t.Graph(s,[0,e]);null!=o&&(!r||o in r)&&n.push(a.cbTypedArray([o|a.cbConstants.FLAG_MOVE])),[-1,1].forEach(function(i){var o=t.Graph(s,[i,e]);null!=o&&(!r||o in r)&&n.push(a.cbTypedArray([o|a.cbConstants.FLAG_CAPTURE]))}),i[s]=n}else i[s]=[];return i},Model.Game.cbInitialPawnGraph=function(t,e,r){for(var a=this,i={},s=0;s<t.boardSize;s++)if(!r||s in r){var n=[],o=t.Graph(s,[0,e]);if(null!=o&&(!r||o in r)){var h=[o|a.cbConstants.FLAG_MOVE],p=t.Graph(o,[0,e]);null!=p&&(!r||p in r)&&h.push(p|a.cbConstants.FLAG_MOVE),n.push(a.cbTypedArray(h))}[-1,1].forEach(function(i){var o=t.Graph(s,[i,e]);null!=o&&(!r||o in r)&&n.push(a.cbTypedArray([o|a.cbConstants.FLAG_CAPTURE]))}),i[s]=n}else i[s]=[];return i},Model.Game.cbKingGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],e)},Model.Game.cbKnightGraph=function(t,e){return this.cbShortRangeGraph(t,[[2,-1],[2,1],[-2,-1],[-2,1],[-1,2],[-1,-2],[1,2],[1,-2]],e)},Model.Game.cbHorseGraph=function(t){for(var e=this,r={},a=0;a<t.boardSize;a++)r[a]=[],[[1,0,2,-1],[1,0,2,1],[-1,0,-2,-1],[-1,0,-2,1],[0,1,-1,2],[0,-1,-1,-2],[0,1,1,2],[0,-1,1,-2]].forEach(function(i){var s=t.Graph(a,[i[0],i[1]]);if(null!=s){var n=t.Graph(a,[i[2],i[3]]);null!=n&&r[a].push(e.cbTypedArray([s|e.cbConstants.FLAG_STOP,n|e.cbConstants.FLAG_MOVE|e.cbConstants.FLAG_CAPTURE]))}});return r},Model.Game.cbRookGraph=function(t,e){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0]],e)},Model.Game.cbBishopGraph=function(t,e){return this.cbLongRangeGraph(t,[[1,-1],[1,1],[-1,1],[-1,-1]],e)},Model.Game.cbQueenGraph=function(t,e){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0],[1,-1],[1,1],[-1,1],[-1,-1]],e)},Model.Game.cbXQGeneralGraph=function(t,e){for(var r=this,a={},i=0;i<t.boardSize;i++)a[i]=[],[[-1,0,!1],[0,-1,!0],[0,1,!0],[1,0,!1]].forEach(function(s){var n=[],o=t.Graph(i,s);if(null!=o&&((!e||o in e)&&n.push(o|r.cbConstants.FLAG_MOVE|r.cbConstants.FLAG_CAPTURE),s[2]))for(var h=t.Graph(o,s);null!=h;)!e||h in e?n.push(h|r.cbConstants.FLAG_CAPTURE|r.cbConstants.FLAG_CAPTURE_KING):n.push(h|r.cbConstants.FLAG_STOP),h=t.Graph(h,s);n.length>0&&a[i].push(r.cbTypedArray(n))});return a},Model.Game.cbXQSoldierGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e]])},Model.Game.cbXQPromoSoldierGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e],[-1,0],[1,0]])},Model.Game.cbXQAdvisorGraph=function(t,e){return this.cbShortRangeGraph(t,[[1,1],[-1,1],[1,-1],[-1,-1]],e)},Model.Game.cbXQCannonGraph=function(t){return this.cbLongRangeGraph(t,[[0,-1],[0,1],[-1,0],[1,0]],null,this.cbConstants.FLAG_MOVE|this.cbConstants.FLAG_SCREEN_CAPTURE)},Model.Game.cbXQElephantGraph=function(t,e){for(var r=this,a={},i=0;i<t.boardSize;i++)a[i]=[],(!e||i in e)&&[[1,1,2,2],[1,-1,2,-2],[-1,1,-2,2],[-1,-1,-2,-2]].forEach(function(s){var n=t.Graph(i,[s[0],s[1]]);if(null!=n){var o=t.Graph(i,[s[2],s[3]]);null!=o&&(!e||o in e)&&a[i].push(r.cbTypedArray([n|r.cbConstants.FLAG_STOP,o|r.cbConstants.FLAG_MOVE|r.cbConstants.FLAG_CAPTURE]))}});return a},Model.Game.cbSilverGraph=function(t,e){return this.cbShortRangeGraph(t,[[0,e],[-1,-1],[-1,1],[1,-1],[1,1]])},Model.Game.cbFersGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1]])},Model.Game.cbSchleichGraph=function(t,e){return this.cbShortRangeGraph(t,[[-1,0],[1,0],[0,-1],[0,1]])},Model.Game.cbAlfilGraph=function(t,e){return this.cbShortRangeGraph(t,[[-2,-2],[-2,2],[2,2],[2,-2]])}}(),function(){var t=Model.Game.cbBoardGeometryGrid(12,12);Model.Game.cbPrinceGraph=function(t,e,r){for(var a=this,i={},s=0;s<t.boardSize;s++)if(!r||s in r){i[s]=[];var n=[],o=t.Graph(s,[0,e]);null!=o&&(!r||o in r)&&(n.push(o|a.cbConstants.FLAG_MOVE|a.cbConstants.FLAG_CAPTURE),o=t.Graph(o,[0,e]),null!=o&&(!r||o in r)&&n.push(o|a.cbConstants.FLAG_MOVE),i[s].push(a.cbTypedArray(n)))}else i[s]=[];return a.cbMergeGraphs(t,a.cbShortRangeGraph(t,[[-1,-1],[-1,1],[-1,0],[1,0],[1,-1],[1,1],[0,-e]]),i)},Model.Game.cbEagleGraph=function(t){for(var e=this,r=e.cbConstants.FLAG_MOVE|e.cbConstants.FLAG_CAPTURE,a={},i=0;i<t.boardSize;i++)a[i]=[],[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(s){var n=t.Graph(i,s);if(null!=n)for(var o=0;o<2;o++){for(var h=[],p=1;p<11;p++){var c=[];c[o]=s[o]*p,c[1-o]=0;var l=t.Graph(n,c);null!=l&&(1==p&&h.push(n|e.cbConstants.FLAG_STOP),h.push(l|r))}h.length>0&&a[i].push(e.cbTypedArray(h))}});return e.cbMergeGraphs(t,e.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1]]),a)},Model.Game.cbShipGraph=function(t){for(var e=this,r=e.cbConstants.FLAG_MOVE|e.cbConstants.FLAG_CAPTURE,a={},i=0;i<t.boardSize;i++)a[i]=[],[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(s){var n=t.Graph(i,s);if(null!=n)for(var o=1;o<2;o++){for(var h=[],p=1;p<11;p++){var c=[];c[o]=s[o]*p,c[1-o]=0;var l=t.Graph(n,c);null!=l&&(1==p&&h.push(n|e.cbConstants.FLAG_STOP),h.push(l|r))}h.length>0&&a[i].push(e.cbTypedArray(h))}});return e.cbMergeGraphs(t,e.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1]]),a)};for(var e={},r=0;r<t.boardSize;r++)e[r]=1;Model.Game.cbDefine=function(){var r={0:{name:"ipawnw",abbrev:"",fenAbbrev:"P",aspect:"fr-pawn",graph:this.cbInitialPawnGraph(t,1,e),value:.9,initial:[{s:1,p:24},{s:1,p:25},{s:1,p:26},{s:1,p:27},{s:1,p:28},{s:1,p:29},{s:1,p:30},{s:1,p:31},{s:1,p:32},{s:1,p:33},{s:1,p:34},{s:1,p:35}],epCatch:!0,epTarget:!0},1:{name:"ipawnb",abbrev:"",fenAbbrev:"P",aspect:"fr-pawn",graph:this.cbInitialPawnGraph(t,-1,e),value:.9,initial:[{s:-1,p:108},{s:-1,p:109},{s:-1,p:110},{s:-1,p:111},{s:-1,p:112},{s:-1,p:113},{s:-1,p:114},{s:-1,p:115},{s:-1,p:116},{s:-1,p:117},{s:-1,p:118},{s:-1,p:119}],epCatch:!0,epTarget:!0},2:{name:"princew",abbrev:"I",aspect:"fr-prince",graph:this.cbPrinceGraph(t,1,e),value:3.5,initial:[{s:1,p:16},{s:1,p:19}],epTarget:!0},3:{name:"princeb",abbrev:"I",aspect:"fr-prince",graph:this.cbPrinceGraph(t,-1,e),value:3.5,initial:[{s:-1,p:124},{s:-1,p:127}],epTarget:!0},4:{name:"rook",abbrev:"R",aspect:"fr-rook",graph:this.cbRookGraph(t,e),value:5,initial:[{s:1,p:12},{s:1,p:23},{s:-1,p:120},{s:-1,p:131}]},5:{name:"bishop",abbrev:"B",aspect:"fr-bishop",graph:this.cbBishopGraph(t,e),value:4,initial:[{s:1,p:14},{s:1,p:21},{s:-1,p:122},{s:-1,p:129}]},6:{name:"knight",abbrev:"N",aspect:"fr-knight",graph:this.cbKnightGraph(t,e),value:3,initial:[{s:1,p:13},{s:1,p:22},{s:-1,p:121},{s:-1,p:130}]},7:{name:"queen",abbrev:"Q",aspect:"fr-queen",graph:this.cbQueenGraph(t,e),value:10,initial:[]},8:{name:"king",abbrev:"K",aspect:"fr-king",graph:this.cbKingGraph(t,e),isKing:!0,initial:[{s:1,p:17},{s:-1,p:125}]},9:{name:"elephant",abbrev:"E",aspect:"fr-elephant",graph:this.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]],e),value:2.9,initial:[{s:1,p:0},{s:1,p:11},{s:-1,p:132},{s:-1,p:143}]},10:{name:"cannon",abbrev:"Z",aspect:"fr-cannon2",graph:this.cbXQCannonGraph(t),value:3.5,initial:[{s:1,p:4},{s:1,p:7},{s:-1,p:136},{s:-1,p:139}]},11:{name:"eagle",abbrev:"H",aspect:"fr-eagle",graph:this.cbEagleGraph(t),value:8.1,initial:[]},12:{name:"camel",abbrev:"J",aspect:"fr-camel",graph:this.cbShortRangeGraph(t,[[-3,-1],[-3,1],[3,-1],[3,1],[1,3],[1,-3],[-1,3],[-1,-3]]),value:2.7,initial:[{s:1,p:2},{s:1,p:9},{s:-1,p:134},{s:-1,p:141}]},13:{name:"ship",abbrev:"X",aspect:"fr-ship",graph:this.cbShipGraph(t),value:4.8,initial:[{s:1,p:15},{s:1,p:20},{s:-1,p:123},{s:-1,p:128}]},14:{name:"lion",abbrev:"L",aspect:"fr-lion",graph:this.cbShortRangeGraph(t,[[-1,-1],[-1,1],[1,-1],[1,1],[1,0],[0,1],[-1,0],[0,-1],[-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1]],e),value:6.7,initial:[{s:1,p:18},{s:-1,p:126}]}};return{geometry:t,pieceTypes:r,promote:function(e,r,a){return 0==r.t&&11==t.R(a.t)||1==r.t&&0==t.R(a.t)?[7]:2==r.t&&11==t.R(a.t)?[7]:13==r.t&&(11==t.R(a.t)&&r.s>0||0==t.R(a.t)&&r.s<0)?[11]:[]}}}}();