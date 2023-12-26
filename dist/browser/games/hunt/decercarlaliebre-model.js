exports.model=Model={Game:{},Board:{},Move:{}},Model.Game.HuntInitGame=function(){this.g.huntOptions={compulsoryCatch:!1,catchLongestLine:!1,multipleCatch:!0},this.g.huntEval={pieceCount:1e6,freeZone:100,dist:1e3},this.g.RC=[],this.g.Graph=[],this.g.useDrop=!1,this.g.evaluate0=0,this.g.debugEval=!1},Model.Game.HuntPostInitGame=function(){this.HuntMakeDist(),this.zobrist=new JocGame.Zobrist({board:{type:"array",size:this.g.Graph.length,values:["1","-1"]},who:{values:["1","-1"]}})},Model.Game.HuntMakeGrid=function(t){var e={rows:5,cols:5,row0:0,col0:0,dirs:4};Object.assign(e,t);var i,h,s,a={},r=this.g.RC.length;for(h=0;h<e.rows;h++)for(s=0;s<e.cols;s++)i=r+h*e.cols+s,this.g.RC[i]=[h+e.row0,s+e.col0],a[h+","+s]=i;for(i=0;i<this.g.RC.length;i++){h=this.g.RC[i][0],s=this.g.RC[i][1];var o=[],n=a[h-1+","+s];void 0!==n?o.push(n):o.push(null),n=a[h+1+","+s],void 0!==n?o.push(n):o.push(null),n=a[h+","+(s-1)],void 0!==n?o.push(n):o.push(null),n=a[h+","+(s+1)],void 0!==n?o.push(n):o.push(null);for(var l=o.length;l<e.dirs;l++)o.push(null);this.g.Graph.push(o)}},Model.Game.HuntMakeDist=function(){function t(t,e,i){r.g.Dist[t][e]=i,i>r.g.DistMax&&(r.g.DistMax=i)}var e,i,h,s,a,r=this;this.g.Dist=[],this.g.DistMax=0;for(var o=0;o<this.g.Graph.length;o++){for(var n=[],l=0;l<=o;l++)n.push(-1);this.g.Dist.push(n)}for(e=0;e<this.g.Graph.length;e++)for(s=this.g.Graph[e],a=0;a<s.length;a++)null!==(i=s[a])&&(i<e&&-1==this.g.Dist[e-1][i]?t(e-1,i,1):i>e&&-1==this.g.Dist[i-1][e]&&t(i-1,e,1));for(var c=!0,u=1;c;u++)for(c=!1,e=1;e<this.g.Graph.length;e++)for(i=0;i<e;i++)if(this.g.Dist[e-1][i]==u){for(s=this.g.Graph[i],a=0;a<s.length;a++)null!==(h=s[a])&&(h<e&&-1==this.g.Dist[e-1][h]?(t(e-1,h,u+1),c=!0):h>e&&-1==this.g.Dist[h-1][e]&&(t(h-1,e,u+1),c=!0));for(s=this.g.Graph[e],a=0;a<s.length;a++)null!==(h=s[a])&&(h<i&&-1==this.g.Dist[i-1][h]?(t(i-1,h,u+1),c=!0):h>i&&-1==this.g.Dist[h-1][i]&&(t(h-1,i,u+1),c=!0))}},Model.Game.HuntRemovePositions=function(t){var e,i={},h=0;for(t.sort(function(t,e){return t-e}),e=0;e<this.g.Graph.length;e++)t.length>0&&e==t[0]?t.shift():i[e]=h++;for(e=0;e<this.g.Graph.length;e++)if(void 0!==i[e]){for(var s=this.g.Graph[e],a=[],r=0;r<s.length;r++){var o=s[r];null!==o&&void 0!==i[o]?a.push(i[o]):a.push(null)}this.g.Graph[e]=a}else this.g.Graph[e]="X";var n=[],l=[];for(e=0;e<this.g.Graph.length;e++)void 0!==i[e]&&(n.push(this.g.Graph[e]),l.push(this.g.RC[e]));this.g.Graph=n,this.g.RC=l,this.g.PosName={}},Model.Game.HuntDist=function(t,e){if(t==e)return 0;if(e>t){var i=t;t=e,e=i}return this.g.Dist[t-1][e]},Model.Move.Init=function(t){void 0!==t&&this.CopyFrom(t)},Model.Move.PosName={},Model.Move.ToString=function(){function t(t){if(void 0!==e[t]&&e[t].length>0){for(var i=[],h=0;h<e[t].length;h++){var s=e[t][h];void 0!==e.PosName[s]?i.push(e.PosName[s]):i.push(s)}return i.join(",")}return""}var e=this,i="";i+=t("p");var h=t("c");return h.length>0&&(i+="x"+h),i},Model.Move.Equals=function(t){var e;if(null===t)return!1;if(t.p.length!=this.p.length)return!1;for(e=0;e<this.p.length;e++)if(t.p[e]!=this.p[e])return!1;if(void 0===t.c&&void 0===this.c)return!0;if(void 0!==t.c&&void 0!==this.c){for(e=0;e<this.c.length;e++)if(t.c[e]!=this.c[e])return!1;return!0}return!1},Model.Board.InitialPosition=function(t){this.HuntInitialPosition(t,t.g.initialPos),this.zSign=t.zobrist.update(0,"who",-1)},Model.Board.CopyFrom=function(t){var e;for(this.board=[],e=0;e<t.board.length;e++)this.board.push(null);for(this.pieces=[],e=0;e<t.pieces.length;e++){var i=t.pieces[e],h={p:i.p,s:i.s,i:i.i,a:i.a,pv:i.pv,pv2:i.pv2};this.pieces.push(h),h.p>-1&&(this.board[h.p]=h)}this.pieceCount=[t.pieceCount[0],t.pieceCount[1]],this.lastMoves={1:[t.lastMoves[1][0],t.lastMoves[1][1],t.lastMoves[1][2]],"-1":[t.lastMoves[-1][0],t.lastMoves[-1][1],t.lastMoves[-1][2]]},this.mWho=t.mWho,this.zSign=t.zSign},Model.Board.HuntInitialPosition=function(t,e){var i;for(this.board=[],i=0;i<t.g.Graph.length;i++)this.board.push(null);this.pieces=[],this.pieceCount=[0,0];for(var h=0;h<2;h++)for(var s=0;s<e[h].length;s++){i=e[h][s];var a={p:i,s:1-2*h,i:this.pieces.length,a:0};this.board[i]=a,this.zSign=t.zobrist.update(this.zSign,"board",1-2*h,i),this.pieces.push(a),this.pieceCount[h]++}this.lastMoves={1:[null,null,null],"-1":[null,null,null]}},Model.Board.GenerateMoves=function(t){this.mMoves=[],t.g.useDrop&&(this.mMoves=this.HuntGetAllDropMoves(t)),0===this.mMoves.length&&(this.mMoves=this.HuntGetAllMoves(t),0===this.mMoves.length&&(this.mFinished=!0,this.mWinner=-this.mWho))},Model.Board.HuntGetCatcherMoves=function(t){function e(i,a,r,o){for(var n=!1,l=0;l<t.g.Graph[i].length;l++){var c=t.g.Graph[i][l];if(null!==c){var u=h.board[c];if(null!==u&&u.s==-h.mWho){var p=t.g.Graph[c][l];if(null!==p&&(null===h.board[p]||a.indexOf(p)>=0)){for(var g=!0,v=Math.floor(l/2),d=0;d<r.length;d++)if(c==r[d]&&v==o[d]){g=!1;break}if(g){var f=a.concat([p]),M=r.concat([c]);if(!1===t.g.huntOptions.multipleCatch)s.push({p:f,c:M}),n=!0;else{!1!==e(p,f,M,o.concat([v]))&&!1!==t.g.huntOptions.compulsaryCatch||(s.push({p:f,c:M}),n=!0)}}}}}}return n}var i,h=this,s=[];for(i=0;i<this.pieces.length;i++){var a=this.pieces[i];a.p>=0&&a.s==this.mWho&&e(a.p,[a.p],[],[])}if(0===s.length||!1===t.g.huntOptions.compulsaryCatch)s=s.concat(this.HuntGetCatcheeMoves(t));else if(t.g.huntOptions.catchLongestLine){var r=0,o=[];for(i=0;i<s.length;i++)r<s[i].c.length?(r=s[i].c.length,o=[s[i]]):r==s[i].c.length&&o.push(s[i]);s=o}return s},Model.Board.HuntGetCatcheeMoves=function(t){for(var e=[],i=0;i<this.pieces.length;i++){var h=this.pieces[i];if(h.p>=0&&h.s==this.mWho)for(var s=0;s<t.g.Graph[h.p].length;s++){var a=t.g.Graph[h.p][s];null!==a&&null===this.board[a]&&e.push({p:[h.p,a]})}}return e},Model.Board.HuntGetAllMoves=function(t){return this.mWho==t.g.catcher?this.HuntGetCatcherMoves(t):this.HuntGetCatcheeMoves(t)},Model.Board.HuntGetAllDropMoves=function(t){for(var e=[],i=null,h=0;h<this.pieces.length;h++){var s=this.pieces[h];if(-2==s.p&&s.s==this.mWho){i=s;break}}if(i)for(var a=0;a<this.board.length;a++)null===this.board[a]&&e.push({p:[a]});return e},Model.Board.HuntMakeEvalData=function(t){for(var e={catcher:t.g.catcher,catchee:-t.g.catcher,catcherSide:(1-t.g.catcher)/2,catcheeSide:(t.g.catcher+1)/2,catcherPieces:[],catcheePieces:[],catcherPiecesDock:[],catcheePiecesDock:[]},i=0;i<this.pieces.length;i++){var h=this.pieces[i];h.p>-1?h.s==e.catcher?e.catcherPieces.push(h):e.catcheePieces.push(h):-2==h.p&&(h.s==e.catcher?e.catcherPiecesDock.push(h):e.catcheePiecesDock.push(h))}return e},Model.Board.HuntEvaluateFreeZone=function(t,e,i){var h,s,a,r,o,n={},l=null,c=-1;for(h=0;h<e.catcherPieces.length;h++){var u=e.catcherPieces[h],p={},g=0,v={},d=1;for(v[u.p]=!0;d>0;){for(a in v)if(v.hasOwnProperty(a)){s=parseInt(a),d--;break}for(delete v[s],p[s]=!0,g++,n[s]=!0,o=0;o<t.g.Graph[s].length;o++)null===(r=t.g.Graph[s][o])||null!==this.board[r]||p[r]||v[r]||(v[r]=!0,d++)}(c<0||c<g-1)&&(c=g-1,l=p)}e.catcherZone=n,i.freeZone=[c,0],i.freeZone2=[c*c,0],i.freeZoneSQRT=[Math.sqrt(c),0];var f=0,M=0,m=0;for(h=0;h<e.catcheePieces.length;h++){var G=e.catcheePieces[h],b=0;for(s in l)l.hasOwnProperty(s)&&(o=t.HuntDist(s,G.p),o>b&&(b=o),o>m&&(m=o));f+=b,M+=b*b}i.distFree=[f,0],i.distFree2=[M,0],i.maxDistFree=[m,0]},Model.Board.HuntEvaluateOppositeDistFromCatcher=function(t,e,i){var h,s,a,r=[];for(s=0;s<e.catcherPieces.length;s++){a=e.catcherPieces[s];for(var o=[],n=0,l=0;l<t.g.Graph.length;l++)h=t.HuntDist(l,a.p),h>n?(n=h,o=[l]):h==n&&o.push(l);r=r.concat(o)}h=0;var c=0,u=0;for(s=0;s<e.catcheePieces.length;s++){a=e.catcheePieces[s];for(var p=0,g=0,v=0,d=0;d<r.length;d++)d0=t.HuntDist(r[d],a.p),p+=d0,g+=d0*d0,v+=Math.sqrt(p);h+=p/r.length,c+=g/r.length,u+=v/r.length}i.oppDist=[-h,0],i.oppDist2=[-c,0],i.oppDists=[-u,0]},Model.Board.HuntEvaluateDistToCatcher=function(t,e,i){for(var h=0,s=0,a=0,r=0,o=0;o<e.catcheePieces.length;o++){for(var n=e.catcheePieces[o],l=-1,c=0;c<e.catcherPieces.length;c++){var u=e.catcherPieces[c],p=t.HuntDist(u.p,n.p);(l<0||l<p)&&(l=p)}h+=l;var g=l*l;s+=g,a+=l*g,l>r&&(r=l)}i.dist3=[a,0],i.dist2=[s,0],i.dist=[h,0],i.maxDist=[r,0]},Model.Board.HuntEvaluateCatchable=function(t,e,i){for(var h=0,s=0,a=0,r=0;r<e.catcheePieces.length;r++){for(var o=e.catcheePieces[r],n=o.p,l=!1,c=!1,u=t.g.Graph[n],p=0;p<u.length;p+=2){var g=u[p],v=u[p+1];null!==g&&null!==v&&(null===this.board[g]&&null===this.board[v]?(s++,l=!0):(null===this.board[g]&&this.board[v].s==t.g.catcher||null===this.board[v]&&this.board[g].s==t.g.catcher)&&(s++,c=!0,l=!0))}l&&h++,c&&a++}i.catchablePieces=[h,0],i.catchableDir=[s,0],i.catchableDir2=[s*s,0],i.catchDangerFork=[a>1?1:0,0]},Model.Board.HuntEvaluateRisk=function(t,e,i){function h(t){void 0===e.catcherZone[t]&&(void 0===n[t]?(n[t]=1,c++):n[t]++)}function s(t){void 0===o[t]?(o[t]=1,l++):o[t]++}for(var a,r,o={},n={},l=0,c=0,u=0;u<e.catcheePieces.length;u++){a=e.catcheePieces[u].p;for(var p=t.g.Graph[a],g=0;g<p.length;g+=2){var v=p[g],d=p[g+1];if(null!==v&&null!==d&&void 0!==d){var f=this.board[v],M=this.board[d];null===f&&null===M?(h(v),h(d)):null!==f&&f.s==t.g.catcher&&null===M?(h(v),s(d)):null!==M&&M.s==t.g.catcher&&null===f&&(s(v),h(d))}}}var m=0;for(a in n)n.hasOwnProperty(a)&&(r=n[a],m+=r*r);var G=0;for(a in o)o.hasOwnProperty(a)&&(r=o[a],G+=r*r);i.openRisk=[m,0],i.forkRisk=[G,0]},Model.Board.HuntEvaluateAntiBack=function(t,e,i){var h,s,a=0,r=0,o=0,n=0;for(h=0;h<e.catcheePieces.length;h++)s=e.catcheePieces[h],s.p==s.pv2&&n++;for(h=0;h<e.catcherPieces.length;h++)s=e.catcherPieces[h],s.p==s.pv2&&o++;for(var l=-1;l<2;l+=2){var c=this.lastMoves[l];null!==c[0]&&c[0].Equals(c[2])&&(t.g.catcher==l?a++:r++)}i.antiBack=[r,a],i.antiBackPiece=[n,o]},Model.Board.HuntEvaluateCatcheeConnections=function(t,e,i){for(var h=0,s=0,a=0;a<this.pieces.length;a++){var r=this.pieces[a];if(r.s==-t.g.catcher&&r.p>=0){for(var o=0,n=t.g.Graph[r.p],l=0;l<n.length;l++){var c=n[l];if(null!==c){var u=this.board[c];u&&u.s==r.s&&o++}}h+=o,s+=Math.log(o+1)}}i.catcheeConn=[0,h],i.catcheeConnLog=[0,s]},Model.Board.HuntEvaluateCatcheeGroups=function(t,e,i){var h,s,a={},r=0;for(h=0;h<this.pieces.length;h++)s=this.pieces[h],s.s==-t.g.catcher&&s.p>=0&&(a[s.i]=s,r++);for(var o=0;r>0;){o++;for(h in a)if(a.hasOwnProperty(h))break;s=a[h],delete a[h];var n={};n[h]=s;for(var l=1;l>0;){for(h in n)if(n.hasOwnProperty(h))break;var c=n[h];delete n[h],l--,delete a[h],r--;for(var u=t.g.Graph[c.p],p=0;p<u.length;p++){var g=u[p];if(null!==g){var v=this.board[g];v&&v.i in a&&!(v.i in n)&&(n[v.i]=v,l++)}}}}i.catcheeGroups=[o,0]},Model.Board.HuntEvaluateGroups=function(t,e,i){for(var h,s,a,r,o,n={},l={},c=0,u=0;u<t.g.Graph.length;u++)if(void 0===l[u]){s=this.board[u];var p=null,g=t.g.Graph[u];for(a=0;a<g.length;a++)if(null!==(r=g[a])){var v=this.board[r];if((null===s&&null===v||null!==s&&null!==v&&s.s==v.s)&&void 0!==l[r]){var d=l[r];if(null===p)l[u]=d,n[d].poss.push(u),p=d;else if(p!=d){o=n[p];var f=n[d];for(o.poss=o.poss.concat(f.poss),h=0;h<f.poss.length;h++)l[f.poss[h]]=p;delete n[d]}}}null===p&&(n[c]={type:null===s?0:s.s,poss:[u],touchCatcher:!1},l[u]=c++)}for(h=0;h<e.catcherPieces.length;h++)for(s=e.catcherPieces[h],a=0;a<t.g.Graph[s.p].length;a++)null!==(r=t.g.Graph[s.p][a])&&(n[l[r]].touchCatcher=!0);var M=0,m=0,G=0,b=0;for(var C in n)n.hasOwnProperty(C)&&(o=n[C],o.type==-t.g.catcher?M++:0===o.type&&(!1===o.touchCatcher?(o.poss.length>m&&(m=o.poss.length),G+=o.poss.length):!0===o.touchCatcher&&(b+=o.poss.length)));i.catcheeGroups=[M,0],i.maxEmptyNoCatcherGroup=[0,m],i.emptyNoCatcherGroup=[0,G],i.minEmptyCatcherGroup=[b<0?0:b,0]},Model.Board.HuntGameEvaluate=function(t,e,i){return{pieceCount:[1,1]}},Model.Board.QuickEvaluate=function(t){return this.Evaluate(t,!1,!0),this.mEvaluation},Model.Board.Evaluate=function(t,e,i){var h;t.GetRepeatOccurence(this)>2&&(this.mFinished=!0,this.mWinner=JocGame.DRAW);var s=this.HuntMakeEvalData(t);if(this.pieceCount[s.catcherSide]<t.g.catcherMin&&(this.mFinished=!0,this.mWinner=s.catchee),this.pieceCount[s.catcheeSide]<t.g.catcheeMin&&(this.mFinished=!0,this.mWinner=s.catcher),this.mEvaluation=0,!this.mFinished){var a={pieceCount:[this.pieceCount[s.catcherSide],this.pieceCount[s.catcheeSide]]},r=this.HuntGameEvaluate(t,s,a),o="debug"==arguments[3];for(h in r)if(r.hasOwnProperty(h)){var n=r[h],l=a[h];void 0===l&&console.error("Evaluation undefined map value",h),o&&console.log(h+":",l[0],"x",n[0]," - ",l[1],"x",n[1],"=",l[0]*n[0]-l[1]*n[1]),this.mEvaluation+=l[0]*n[0]-l[1]*n[1]}if(o){for(h in a)a.hasOwnProperty(h)&&void 0===r[h]&&JocLog("Unused",h+": ",a[h][0],a[h][1]);JocLog("==>",this.mEvaluation,"=>",this.mEvaluation*t.g.catcher,"=>",this.mEvaluation*t.g.catcher-t.g.evaluate0)}this.mEvaluation*=t.g.catcher,this.mEvaluation-=t.g.evaluate0}},Model.Board.HuntCheckBoard=function(t){var e,i;for(e=0;e<t.g.Graph.length;e++){var h=t.g.Graph[e];if(null!==(i=this.board[h])&&i.p!=h)return"Piece "+i+e+" has p "+i.p+" while on board pos "+h}for(e=0;e<this.pieces.length;e++)if(i=this.pieces[e],-1!=i.p&&this.board[i.p]!=i)return"Piece "+e+" not on board "+i.p;return null},Model.Board.HuntAngle=function(t,e,i){var h=t.g.RC[e],s=h[0],a=h[1],r=t.g.RC[i],o=r[0],n=r[1],l=0,c=o-s,u=n-a;return 0===c?l=u>0?90:-90:(l=180*Math.atan(u/c)/Math.PI,c<0&&(l=(l+180)%360)),l},Model.Board.ApplyMove=function(t,e){var i,h;if(1==e.p.length){for(h=0;h<this.pieces.length;h++)if(i=this.pieces[h],i.s==this.mWho&&-2==i.p){i.p=e.p[0],i.a=0,this.board[i.p]=i,this.zSign=t.zobrist.update(this.zSign,"board",i.s,i.p);break}}else if(i=this.board[e.p[0]],this.zSign=t.zobrist.update(this.zSign,"board",i.s,i.p),this.board[e.p[0]]=null,this.board[e.p[e.p.length-1]]=i,i.pv2=i.pv,i.pv=i.p,i.p=e.p[e.p.length-1],i.a=this.HuntAngle(t,e.p[e.p.length-2],e.p[e.p.length-1]),this.zSign=t.zobrist.update(this.zSign,"board",i.s,i.p),void 0!==e.c){var s=this.mWho==JocGame.PLAYER_A?0:1;for(h=0;h<e.c.length;h++)null!==(i=this.board[e.c[h]])&&(this.board[e.c[h]]=null,this.zSign=t.zobrist.update(this.zSign,"board",i.s,i.p),i.p=-1,this.pieceCount[1-s]--)}this.lastMoves[this.mWho][2]=this.lastMoves[this.mWho][1],this.lastMoves[this.mWho][1]=this.lastMoves[this.mWho][0],this.lastMoves[this.mWho][0]=new(t.GetMoveClass())(e),this.zSign=t.zobrist.update(this.zSign,"who",-this.mWho),this.zSign=t.zobrist.update(this.zSign,"who",this.mWho)},Model.Board.GetSignature=function(){return this.zSign},Model.Move.PosName={0:"A5",1:"B5",2:"C5",3:"D5",4:"E5",5:"A4",6:"B4",7:"C4",8:"D4",9:"E4",10:"A3",11:"B3",12:"C3",13:"D3",14:"E3",15:"A2",16:"B2",17:"C2",18:"D2",19:"E2",20:"A1",21:"B1",22:"C1",23:"D1",24:"E1"},Model.Board.HuntGameEvaluate=function(t,e,i){this.HuntEvaluateDistToCatcher(t,e,i),this.HuntEvaluateCatcheeGroups(t,e,i),this.HuntEvaluateFreeZone(t,e,i),this.HuntEvaluateRisk(t,e,i);var h=t.mOptions.levelOptions,s={};for(var a in h)if(h.hasOwnProperty(a)){var r=/^(.*)(0|1)$/.exec(a);if(!r)continue;void 0===s[r[1]]&&(s[r[1]]=[0,0]),s[r[1]][r[2]]=h[a]}return s},Model.Game.InitGame=function(){function t(t,i,h,s){var a;for(e.g.Graph[t][h]=i,e.g.Graph[i][s]=t,a=0;a<h;a++)void 0===e.g.Graph[t][a]&&(e.g.Graph[t][a]=null);for(a=0;a<s;a++)void 0===e.g.Graph[i][a]&&(e.g.Graph[i][a]=null)}var e=this;this.HuntInitGame(),Object.assign(this.g.huntOptions,{compulsaryCatch:!1,catchLongestLine:!1,multipleCatch:!0}),this.HuntMakeGrid({}),t(10,6,4,5),t(6,2,4,5),t(20,16,4,5),t(16,12,4,5),t(12,8,4,5),t(8,4,4,5),t(22,18,4,5),t(18,14,4,5),t(0,6,6,7),t(6,12,6,7),t(12,18,6,7),t(18,24,6,7),t(10,16,6,7),t(16,22,6,7),t(2,8,6,7),t(8,14,6,7),this.g.catcher=JocGame.PLAYER_B,this.g.evaluate0=-25e5,this.g.catcherMin=1,this.g.catcheeMin=10,this.g.initialPos=[[0,1,2,3,4,5,6,7,8,9,10,14],[12]],this.HuntPostInitGame()};