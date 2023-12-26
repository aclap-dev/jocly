exports.model=Model={Game:{},Board:{},Move:{}},Model.Game.InitGameInfo=function(){},Model.Game.BuildGraphCoord=function(){var i=[],t=[];this.g.Graph=i,this.g.Coord=t},Model.Game.InitGame=function(){this.BuildGraphCoord(),this.g.TripletsByPos=[];for(var i=0;i<this.g.Coord.length;i++)this.g.TripletsByPos[i]=[];for(var i in this.g.Triplets)if(this.g.Triplets.hasOwnProperty(i)){var t=this.g.Triplets[i];for(var e in t)if(t.hasOwnProperty(e)){var s=t[e];this.g.TripletsByPos[s].push(t)}}this.InitGameExtra()},Model.Game.DestroyGame=function(){},Model.Game.MillsDirections=4,Model.Game.MillsEachDirection=function(i,t){for(var e=0;e<this.MillsDirections;e++){var s=this.g.Graph[i][e];null!=s&&t(s)}},Model.Move.Init=function(i){this.f=i.f,this.t=i.t,this.c=i.c},Model.Move.CopyFrom=function(i){this.f=i.f,this.t=i.t,this.c=i.c},Model.Move.Equals=function(i){return this.t==i.t&&this.c==i.c&&this.f==i.f},Model.Move.ToString=function(){var i="";return this.f>-1&&(i+=this.f+">"),i+=this.t,this.c>-1&&(i+="x"+this.c),i},Model.Board.Init=function(i){},Model.Board.InitialPosition=function(i){var t=i.g.Coord.length,e=i.mOptions.mencount;this.board=[];for(var s=0;s<t;s++)this.board[s]=-1;this.pieces=[],this.dock={1:[],"-1":[]},this.menCount={1:0,"-1":0};for(var o=0,n=0;n<2;n++)for(var r=0==n?1:-1,h=0;h<e;h++)this.dock[r].unshift(o),this.pieces.push({s:r,a:!0,d:h,p:-1,i:o++});this.placing=!0},Model.Board.StaticGenerateMoves=function(i){if(0==i.mFullPlayedMoves.length){for(var t=[],e=0;e<i.g.Coord.length;e++)t.push({f:-1,t:e,c:-1});return t}return null},Model.Board.GenerateMoves=function(i){this.mMoves=[],this.placing?this.GeneratePlacingMoves(i):i.mOptions.canFly?this.GenerateFlyingMoves(i):this.GenerateMovingMoves(i),0==this.mMoves.length&&(this.mFinished=!0,this.menCount[JocGame.PLAYER_A]+this.menCount[JocGame.PLAYER_B]==i.g.Coord.length?this.mWinner=JocGame.DRAW:this.mWinner=-this.mWho)},Model.Board.GeneratePlacingMoves=function(i){for(var t=0;t<i.g.Coord.length;t++)if(-1==this.board[t]){var e=!0;if(void 0!==i.mLevelInfo&&i.mCurrentLevel>=0){var s=i.mLevelInfo.maxDepth-i.mCurrentLevel;if(s>=i.mLevelInfo.placingRace){e=!1;for(var o in i.g.TripletsByPos[t])if(i.g.TripletsByPos[t].hasOwnProperty(o)){for(var n=i.g.TripletsByPos[t][o],r=0,h=0,a=0,l=0;l<3;l++)-1==this.board[n[l]]?a++:this.pieces[this.board[n[l]]].s==this.mWho?r++:h++;if(2==r||1==r&&0==h||2==h){e=!0;break}}}}e&&this.GenerateCapturingMoves(i,{f:-1,t:t,c:-1})}},Model.Board.GenerateMovingMoves=function(i){$this=this;for(var t=0;t<this.pieces.length;t++){var e=this.pieces[t];e.a&&e.s==this.mWho&&i.MillsEachDirection(e.p,function(t){-1==$this.board[t]&&$this.GenerateCapturingMoves(i,{f:e.p,t:t,c:-1})})}},Model.Board.GenerateFlyingMoves=function(i){if(3!=this.menCount[this.mWho])this.GenerateMovingMoves(i);else for(var t=0;t<this.pieces.length;t++){var e=this.pieces[t];if(e.a&&e.s==this.mWho)for(var s=0;s<this.board.length;s++)-1==this.board[s]&&this.GenerateCapturingMoves(i,{f:e.p,t:s,c:-1})}},Model.Board.GenerateCapturingMoves=function(i,t){for(var e in i.g.TripletsByPos[t.t])if(i.g.TripletsByPos[t.t].hasOwnProperty(e)){for(var s=i.g.TripletsByPos[t.t][e],o=!0,n=0;n<3;n++){var r=s[n];if(r!=t.t){if(-1==this.board[r]||t.f==r){o=!1;break}var h=this.pieces[this.board[r]];if(0==h.a||h.d>-1||h.s!=this.mWho){o=!1;break}}}if(o){if(3==this.menCount[-this.mWho]&&0==this.placing)return void this.mMoves.push({f:t.f,t:t.t,c:-2});for(var a=[],n=0;n<this.pieces.length;n++){var h=this.pieces[n];if(1==h.a&&-1==h.d&&h.s==-this.mWho){var l={f:t.f,t:t.t,c:h.p};a.push(l)}}if(0==i.mOptions.poundInMill){var c={};for(var d in i.g.Triplets)if(i.g.Triplets.hasOwnProperty(d)){var f=i.g.Triplets[d];-1!=this.board[f[0]]&&this.pieces[this.board[f[0]]].s==-this.mWho&&-1!=this.board[f[1]]&&this.pieces[this.board[f[1]]].s==-this.mWho&&-1!=this.board[f[2]]&&this.pieces[this.board[f[2]]].s==-this.mWho&&(c[f[0]]=!0,c[f[1]]=!0,c[f[2]]=!0)}for(var u=[],d=0;d<a.length;d++)c[a[d].c]||u.push(a[d]);u.length>0&&(a=u)}return void(this.mMoves=this.mMoves.concat(a))}}this.mMoves.push({f:t.f,t:t.t,c:-1})},Model.Board.Evaluate=function(i,t,e){if(i.GetRepeatOccurence(this)>2)return this.mFinished=!0,void(this.mWinner=JocGame.DRAW);if(0==this.placing){if(this.menCount[JocGame.PLAYER_A]<3)return this.mFinished=!0,void(this.mWinner=JocGame.PLAYER_B);if(this.menCount[JocGame.PLAYER_B]<3)return this.mFinished=!0,void(this.mWinner=JocGame.PLAYER_A)}var s=this.menCount[JocGame.PLAYER_A]-this.menCount[JocGame.PLAYER_B],o=0,n=0;for(var r in i.g.Triplets)if(i.g.Triplets.hasOwnProperty(r)){for(var h={"-1":0,0:0,1:0},a=i.g.Triplets[r],l=0;l<3;l++){var c=a[l],d=this.board[c];if(d>-1){var f=this.pieces[d];h[f.s]++}}1==h[1]&&0==h[-1]?o++:2==h[1]&&0==h[-1]&&n++,1==h[-1]&&0==h[1]?o--:2==h[-1]&&0==h[1]&&n--}this.mEvaluation=10*s,this.mEvaluation+=1*o,this.mEvaluation+=3*n},Model.Board.ApplyMove=function(i,t){if(this.placing){var e=this.dock[this.mWho].shift(),s=this.pieces[e];s.d=-1,s.p=t.t,this.board[t.t]=e,this.lastMoveIndex=e,this.menCount[this.mWho]++,0==this.dock[JocGame.PLAYER_B].length&&(this.placing=!1)}else{var s=this.pieces[this.board[t.f]];this.board[s.p]=-1,this.board[t.t]=s.i,s.p=t.t,this.lastMoveIndex=s.i}if(t.c>-1){var e=this.board[t.c];this.board[t.c]=-1;var s=this.pieces[e];s.a=!1,this.menCount[-this.mWho]--}else-2==t.c&&this.menCount[-this.mWho]--},Model.Board.IsValidMove=function(i,t){return!0},Model.Game.InitGameExtra=function(){},Model.Game.BuildGraphCoord=function(){this.g.Graph=[[1,6,null,null],[2,4,0,null],[null,9,1,null],[4,7,null,null],[5,16,3,1],[null,8,4,null],[7,13,null,0],[16,10,6,3],[9,12,16,5],[null,15,8,2],[11,null,null,7],[12,14,10,16],[null,null,11,8],[14,null,null,6],[15,null,13,11],[null,null,14,9],[8,11,7,4]],this.g.Coord=[[0,0],[0,2],[0,4],[1,1],[1,2],[1,3],[2,0],[2,1],[2,3],[2,4],[3,1],[3,2],[3,3],[4,0],[4,2],[4,4],[2,2]],this.g.Triplets=[[0,1,2],[3,4,5],[10,11,12],[13,14,15],[0,6,13],[3,7,10],[5,8,12],[2,9,15],[6,7,16],[7,16,8],[16,8,9],[1,4,16],[4,16,11],[16,11,14]]},Model.Board.StaticGenerateMoves=function(i){return 0==i.mFullPlayedMoves.length?[{f:-1,t:16,c:-1}]:null};