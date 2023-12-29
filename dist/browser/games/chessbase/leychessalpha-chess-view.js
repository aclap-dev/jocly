exports.view=View={Game:{},Board:{},Move:{}},function(){var e,a,i;View.Game.cbTargetMesh="/res/ring-target.js",View.Game.cbTargetSelectColor=16777215,View.Game.cbTargetCancelColor=16746496,View.Game.cbPromoSize=2e3,View.Game.xdInit=function(i){this.g.fullPath=this.mViewOptions.fullPath,this.cbPieceByType={},e=this.cbVar,a=this.cbDefineView(),this.cbView=a,this.cbClearPieces(),this.cbCreateLights(i),this.cbCreateScreens(i),this.cbCreateBoard(i),this.cbCreatePromo(i),this.cbCreatePieces(i),this.cbCreateCells(i)},View.Game.cbMakeDummyMesh=function(e){return"undefined"!=typeof THREE?new THREE.Mesh(new THREE.CubeGeometry(1e-4,1e-4,1e-4),new THREE.MeshLambertMaterial):null},View.Game.cbCurrentGame=function(){return i},View.Game.cbCreatePieces=function(e){for(var a=this.cbMakeDummyMesh(e),i=0;i<this.cbPiecesCount;i++)e.createGadget("piece#"+i,{base:{},"2d":{type:"sprite"},"3d":{type:"custommesh3d",create:function(e,i,r){return a}}})},View.Game.cbCreateBoard=function(e){var a=this.cbMakeDummyMesh(e);e.createGadget("board",{base:{},"2d":{type:"canvas",width:12e3,height:12e3,draw:function(e){console.warn("board draw must be overridden")}},"3d":{type:"custommesh3d",receiveShadow:!0,create:function(e,i,r){return a}}})},View.Game.cbCreateCells=function(e){for(var a=this,i=0;i<this.g.boardSize;i++)!function(i){e.createGadget("cell#"+i,{"2d":{z:101,type:"element",initialClasses:a.cbCellClass(e,i),width:1300,height:1300}}),e.createGadget("clicker#"+i,$.extend(!0,{"2d":{z:103,type:"element",initialClasses:"cb-clicker"},"3d":{type:"meshfile",file:a.g.fullPath+a.cbTargetMesh,flatShading:!0,castShadow:!0,smooth:0,scale:[.9,.9,.9],materials:{square:{transparent:!0,opacity:0},ring:{color:a.cbTargetSelectColor,opacity:1}}}},a.cbView.clicker))}(i)},View.Game.cbCreatePromo=function(e){e.createGadget("promo-board",{base:{type:"element",x:0,y:0,width:2e3,height:2e3,z:108,css:{"background-color":"White"}}}),e.createGadget("promo-cancel",{base:{type:"image",file:this.g.fullPath+"/res/images/cancel.png",x:0,y:0,width:800,height:800,z:109}});for(var a=0;a<this.g.pTypes.length;a++)e.createGadget("promo#"+a,{base:{y:0,z:109,type:"sprite",clipwidth:100,clipheight:100,width:1200,height:1200}})},View.Game.xdBuildScene=function(r){i=this,e=this.cbVar,a=this.cbDefineView(),this.cbView=a;for(var t=0;t<this.cbExtraLights.length;t++)r.updateGadget("extralights#"+t,{"3d":{visible:!0}});r.updateGadget("board",$.extend({base:{visible:!0}},this.cbView.board));for(var s=0;s<this.g.boardSize;s++)!function(e){var a=i.cbMakeDisplaySpec(e,0),t=$.extend(!0,{},a,{base:{visible:!0}},i.cbView.clicker,i.cbView.cell);r.updateGadget("cell#"+e,t),$.extend(!0,a,i.cbView.clicker),r.updateGadget("clicker#"+e,a)}(s);r.updateGadget("videoa",{"3d":{visible:!0,playerSide:1,z:3e3,y:1==this.mViewAs?1e4:-1e4,rotate:1==this.mViewAs?-180:-0,rotateX:1==this.mViewAs?25:-25,scale:[3,3,3]}}),r.updateGadget("videoabis",{"3d":{visible:!0,playerSide:-1,z:1500,x:1==this.mViewAs?-5500:5500,y:1==this.mViewAs?8900:-8900,rotate:1==this.mViewAs?-180:-0,rotateX:1==this.mViewAs?25:-25,scale:[.75,.75,.75]}}),r.updateGadget("videob",{"3d":{visible:!0,playerSide:-1,z:3e3,y:1==this.mViewAs?-1e4:1e4,rotate:1==this.mViewAs?-0:-180,rotateX:1==this.mViewAs?-25:25,scale:[3,3,3]}}),r.updateGadget("videobbis",{"3d":{visible:!0,playerSide:1,z:1500,x:1==this.mViewAs?5500:-5500,y:1==this.mViewAs?-8900:8900,rotate:1==this.mViewAs?-0:-180,rotateX:1==this.mViewAs?-25:25,scale:[.75,.75,.75]}}),r.updateGadget("promo-board",{base:{visible:!1}}),r.updateGadget("promo-cancel",{base:{visible:!1}});for(var t=0;t<this.g.pTypes.length;t++)r.updateGadget("promo#"+t,{base:{visible:!1}})},View.Game.cbDisplayBoardFn=function(e){var a=this;return function(r,t,s){var n=e.style+"_"+e.margins.x+"_"+e.margins.y+"_"+a.mNotation+"_"+a.mViewAs,l=this;n!=this._cbKey&&(this._cbKey=n,e.display.call(i,e,l,function(e){l.replaceMesh(e,t,s)}))}},View.Game.cbDrawBoardFn=function(e){return function(a){e.draw.call(i,e,this,a)}},View.Game.cbMakeDisplaySpec=function(e,a){var i={};for(var r in this.cbView.coords){var t=this.cbView.coords[r],s=t.call(this,e);i[r]={x:s.x||0,y:s.y||0,z:s.z||0,rotateX:s.rx||0,rotateY:(s.ry||0)*("3d"==r?this.mViewAs*a<0?-1:1:0),rotate:(s.rz||0)+("3d"==r&&this.mViewAs*a<0?180:0)}}return i},View.Game.cbMakeDisplaySpecForPiece=function(i,r,t){function s(e,a,i){return a?$.extend(!0,e,a.default,a[i]):{}}var n=this.cbMakeDisplaySpec(r,t.s);if(void 0===e.pieceTypes[t.t])return void console.warn("Piece type",t.t,"not defined in model");var l=e.pieceTypes[t.t].aspect||e.pieceTypes[t.t].name;return l?(a.pieces&&(n=s(n,a.pieces,l),a.pieces[t.s]&&(n=s(n,a.pieces[t.s],l))),n):void console.warn("Piece type",t.t,"has no aspect defined")},View.Board.xdDisplay=function(e,a){for(var i=0;i<this.pieces.length;i++){var r=this.pieces[i];if(r.p<0)e.updateGadget("piece#"+i,{base:{visible:!1}});else{var t=a.cbMakeDisplaySpecForPiece(a,r.p,r);t=$.extend(!0,{base:{visible:!0},"2d":{opacity:1},"3d":{positionEasingUpdate:null}},t),e.updateGadget("piece#"+i,t)}}for(;i<a.cbPiecesCount;i++)e.updateGadget("piece#"+i,{base:{visible:!1}})},View.Game.cbExtraLights=[{color:16777215,intensity:.8,position:[9,14,-9],props:{shadowCameraNear:10,shadowCameraFar:25,castShadow:!0,shadowMapWidth:2048,shadowMapHeight:2048}}],View.Game.cbCreateLights=function(e){for(var a=0;a<this.cbExtraLights.length;a++)!function(a,i){e.createGadget("extralights#"+i,{"3d":{type:"custommesh3d",create:function(e){var i=new THREE.SpotLight(a.color,a.intensity);i.shadow.camera.far=a.props.shadowCameraFar,i.shadow.camera.near=a.props.shadowCameraNear,i.shadow.mapSize.width=a.props.shadowMapWidth,i.shadow.mapSize.height=a.props.shadowMapHeight,i.position.set.apply(i.position,a.position);var r=new THREE.Mesh;r.add(i);var t=new THREE.Object3D;r.add(t),i.target=t,e(r)}}})}(this.cbExtraLights[a],a)},View.Game.cbCreateScreen=function(e){var a=new THREE.PlaneGeometry(4,3,1,1),i=new THREE.MeshPhongMaterial({color:16777215,map:e,shading:THREE.FlatShading,emissive:{r:1,g:1,b:1}}),r=new THREE.Mesh(a,i);return this.objectReady(r),null},View.Game.cbCreateScreens=function(e){var a=this;e.createGadget("videoa",{"3d":{type:"video3d",makeMesh:function(e){return a.cbCreateScreen.call(this,e)}}}),e.createGadget("videoabis",{"3d":{type:"video3d",makeMesh:function(e){return a.cbCreateScreen.call(this,e)}}}),e.createGadget("videob",{"3d":{type:"video3d",makeMesh:function(e){return a.cbCreateScreen.call(this,e)}}}),e.createGadget("videobbis",{"3d":{type:"video3d",makeMesh:function(e){return a.cbCreateScreen.call(this,e)}}})},View.Board.xdInput=function(a,i){function r(){a.updateGadget("promo-board",{base:{visible:!1}}),a.updateGadget("promo-cancel",{base:{visible:!1}})}return{initial:{f:null,t:null,pr:null},getActions:function(t,s){var n={};if(null==s.f)t.forEach(function(e){void 0===n[e.f]&&(n[e.f]={f:e.f,moves:[],click:["piece#"+this.board[e.f],"clicker#"+e.f],view:["clicker#"+e.f],highlight:function(r){a.updateGadget("cell#"+e.f,{"2d":{classes:"select"==r?"cb-cell-select":"cb-cell-cancel",opacity:i.mShowMoves||"cancel"==r?1:0}}),a.updateGadget("clicker#"+e.f,{"3d":{materials:{ring:{color:"select"==r?i.cbTargetSelectColor:i.cbTargetCancelColor,opacity:i.mShowMoves||"cancel"==r?1:0,transparent:!i.mShowMoves&&"cancel"!=r}},castShadow:i.mShowMoves||"cancel"==r}})},unhighlight:function(){a.updateGadget("cell#"+e.f,{"2d":{classes:""}})},validate:{f:e.f}}),n[e.f].moves.push(e)},this);else if(null==s.t)t.forEach(function(t){var s=void 0===t.cg?t.t:t.cg;void 0===n[s]&&(n[s]={t:t.t,moves:[],click:["piece#"+this.board[s],"clicker#"+s],view:["clicker#"+s],highlight:function(e){a.updateGadget("cell#"+s,{"2d":{classes:"select"==e?"cb-cell-select":"cb-cell-cancel",opacity:i.mShowMoves||"cancel"==e?1:0}}),a.updateGadget("clicker#"+s,{"3d":{materials:{ring:{color:"select"==e?i.cbTargetSelectColor:i.cbTargetCancelColor,opacity:i.mShowMoves||"cancel"==e?1:0,transparent:!i.mShowMoves&&"cancel"!=e}},castShadow:i.mShowMoves||"cancel"==e}})},unhighlight:function(e){a.updateGadget("cell#"+s,{"2d":{classes:""}})},validate:{t:t.t},execute:function(r){var s=this;this.cbAnimate(a,i,t,function(){var l=n[t.t].moves;l.length>1&&(a.updateGadget("promo-board",{base:{visible:!0,width:i.cbPromoSize*(l.length+1)}}),a.updateGadget("promo-cancel",{base:{visible:!0,x:l.length*i.cbPromoSize/2}}),l.forEach(function(r,t){var s=e.pieceTypes[r.pr].aspect||e.pieceTypes[r.pr].name,n=$.extend(!0,{},i.cbView.pieces.default,i.cbView.pieces[s]);i.cbView.pieces[this.mWho]&&(n=$.extend(!0,n,i.cbView.pieces[this.mWho].default,i.cbView.pieces[this.mWho][s])),a.updateGadget("promo#"+r.pr,{base:$.extend(n["2d"],{x:(t-l.length/2)*i.cbPromoSize})})},s)),r()})},unexecute:function(){if(null!=t.c){var e=this.pieces[t.c],s=i.cbMakeDisplaySpecForPiece(i,e.p,e);s=$.extend(!0,{base:{visible:!0},"2d":{opacity:1},"3d":{positionEasingUpdate:null}},s),a.updateGadget("piece#"+t.c,s)}var n=this.pieces[this.board[t.f]],l=i.cbMakeDisplaySpecForPiece(i,n.p,n);a.updateGadget("piece#"+n.i,l),r()}}),void 0!==t.cg&&(n[s].validate.cg=t.cg,n[s].execute=function(e){this.cbAnimate(a,i,t,function(){e()})}),n[s].moves.push(t)},this);else if(null==s.pr){var l=[];t.forEach(function(e){void 0!==e.pr&&(void 0===n[e.pr]&&(n[e.pr]={pr:e.pr,moves:[],click:["promo#"+e.pr],validate:{pr:e.pr},cancel:["promo-cancel"],post:r,skipable:!0},l.push(e.pr)),n[e.pr].moves.push(e))},this),l.length>1&&l.forEach(function(e){n[e].view=["promo#"+e]})}return n}}},View.Game.cbCellClass=function(e,a){return"classic-cell "+((a+(a-a%this.g.NBCOLS)/this.g.ROWS)%2?"classic-cell-black":"classic-cell-white")},View.Board.xdPlayedMove=function(e,a,i){a.mOldBoard.cbAnimate(e,a,i,function(){a.MoveShown()})},View.Board.cbAnimate=function(e,a,i,r){function t(){0==--n&&(l&&a.PlaySound("tac"+(1+Math.floor(3*Math.random()))),r())}var s=this,n=1,l=!1,o=this.pieces[this.board[i.f]],c=a.cbMakeDisplaySpec(i.f,o.s),m=a.cbMakeDisplaySpecForPiece(a,i.t,o);for(var f in c){var p=c[f];void 0!==p.z&&function(e){var r=p.z,t=m[e].z,n=s.cbMoveMidZ(a,i,r,t,e),o=r,c=o-n,f=o-t;n!=(r+t)/2&&(l=!0);var d=4*c-2*f,h=-f*f,g=Math.abs(d*d- -4*h),u=(-d-Math.sqrt(g))/-2,y=(-d+Math.sqrt(g))/-2,b=u,x=-b-f;(0==b||-x/(2*b)<0||-x/(2*b)>1)&&(b=y,x=-b-f),m[e].positionEasingUpdate=function(e){var a=(b*e*e+x*e+o)*this.SCALE3D;this.object3d.position.y=a}}(f)}if(l||a.PlaySound("move"+(1+Math.floor(4*Math.random()))),e.updateGadget("piece#"+o.i,m,600,function(){t()}),null!=i.c){n++;var d={positionEasingUpdate:null};switch(a.cbView.captureAnim3d||"movedown"){case"movedown":d.z=-2e3;break;case"scaledown":d.scale=[0,0,0]}var h=this.pieces[i.c];e.updateGadget("piece#"+h.i,{"2d":{opacity:0},"3d":d},600,t)}if(void 0!==i.cg){var p=a.cbVar.castle[i.f+"/"+i.cg],g=p.r[p.r.length-1],o=this.pieces[this.board[i.cg]],m=a.cbMakeDisplaySpecForPiece(a,g,o);n++,e.updateGadget("piece#"+o.i,m,600,function(){t()})}},View.Board.cbMoveMidZ=function(e,a,i,r){return(i+r)/2}}(),function(){View.Game.cbBaseBoard={TEXTURE_CANVAS_CX:1024,TEXTURE_CANVAS_CY:1024,display:function(e,a,i){var r=this;e.getResource=a.getResource,e.createGeometry.call(this,e,function(a){e.createTextureImages.call(r,e,function(t){var s=["diffuse"].concat(e.extraChannels||[]),n={};s.forEach(function(a){var i=document.createElement("canvas");i.width=e.TEXTURE_CANVAS_CX,i.height=e.TEXTURE_CANVAS_CY,n[a]=i}),e.createMaterial.call(r,e,n,function(s){var l=new THREE.Mesh(a,s);e.modifyMesh.call(r,e,l,function(a){e.paint.call(r,e,n,t,function(){i(a)})})})})})},createTextureImages:function(e,a){var i=this,r={},t=0,s=e.texturesImg||{};for(var n in s)t++;if(0==t)a(r);else for(var n in s)!function(n){e.getResource("image|"+i.g.fullPath+s[n],function(e){r[n]=e,0==--t&&a(r)})}(n)},createMaterial:function(e,a,i){var r=new THREE.Texture(a.diffuse);r.needsUpdate=!0;var t={specular:"#050505",shininess:30,map:r};if(a.bump){var s=new THREE.Texture(a.bump);s.needsUpdate=!0,t.bumpMap=s,t.bumpScale=.05}i(new THREE.MeshPhongMaterial(t))},modifyMesh:function(e,a,i){i(a)},prePaint:function(e,a,i,r,t){t()},paint:function(e,a,i,r,t){t()},postPaint:function(e,a,i,r,t){t()},paintChannel:function(e,a,i,r){},draw:function(e,a,i){var r=this;e.getResource=a.getResource,e.createTextureImages.call(this,e,function(a){e.paintChannel.call(r,e,i,a,"diffuse")})}}}(),function(){function e(e){for(var a=JSON.stringify(e),i=0,r=0;r<a.length;r++)i=(i<<5)-i+a.charCodeAt(r),i&=i;return i}var a,i={};View.Game.cbDisplayPieceFn=function(i){var r=this,t=e(i);return function(e,s,n){a=this.getResource;var l=/^piece#([0-9]+)$/.exec(this.gadget.id);if(!l)return null;var o=parseInt(l[1]),c=r.cbCurrentGame();if(o>=c.mBoard.pieces.length)return null;var m=c.mBoard.pieces[o],f=c.cbVar.pieceTypes[m.t].aspect||c.cbVar.pieceTypes[m.t].name,p=f+"_"+t+"_"+m.s,d=this;p!=this._cbKey&&(this._cbKey=p,d.options=s,c.cbMakePiece(i,f,m.s,function(e){d.replaceMesh(e,d.options,n)}))}},View.Game.cbMakePiece=function(a,r,t,s){function n(e,a,i){return a?$.extend(!0,e,a.default,a[i]):{}}if(!a)return void console.error("piece-view: style is not defined");var l=n({},a,r);a[t]&&(l=n(l,a[t],r));var o=e(l),c=i[o];Array.isArray(c)?c.push(s):c?s(new THREE.Mesh(c.geometry,c.material)):(i[o]=[s],l.loadResources.call(this,l,function(e){l.displayPiece.call(this,l,e,function(){var a=i[o];i[o]={geometry:e.geometry,material:e.material},a.forEach(function(a){a(new THREE.Mesh(e.geometry,e.material))})})}))},View.Game.cbClearPieces=function(){i={}},View.Game.cbBasePieceStyle={default:{mesh:{jsFile:function(e,a){a(new THREE.CubeGeometry(1,1,1),new THREE.MeshPhongMaterial({}))},smooth:0,rotateZ:0},loadMesh:function(e,i){"function"==typeof e.mesh.jsFile?e.mesh.jsFile(e,i):a("smoothedfilegeo|"+e.mesh.smooth+"|"+this.g.fullPath+e.mesh.jsFile,i)},loadImages:function(e,i){function r(){0==--s&&i(n)}var t=this,s=1,n={};for(var l in e.materials){var o=e.materials[l].channels;for(var c in o)if(o[c].texturesImg)for(var m in o[c].texturesImg)!function(e,i){s++,a("image|"+t.g.fullPath+i,function(a){n[e]=a,r()})}(m,o[c].texturesImg[m])}r()},loadResources:function(e,a){function i(){0==--n&&a({geometry:t,images:r,textures:{},loadedMaterials:s})}var r,t,s,n=2;e.loadMesh.call(this,e,function(a,r){if(!a._cbZRotated){var n=new THREE.Matrix4;n.makeRotationY(e.mesh.rotateZ*Math.PI/180),a.applyMatrix(n),a._cbZRotated=!0}t=a,s=r,i()}),e.loadImages.call(this,e,function(e){r=e,i()})},displayPiece:function(e,a,i){e.makeMaterials.call(this,e,a),i()},paintTextureImageClip:function(e,a,i,r,t,s,n,l,o){var c=a.canvas.width,m=a.canvas.height;if(t.patternFill&&t.patternFill[s]){var f=t.patternFill[s];a.save();var p=document.createElement("canvas");p.width=c,p.height=m,ctxTmp=p.getContext("2d"),ctxTmp.fillStyle=f,ctxTmp.fillRect(0,0,c,m),ctxTmp.globalCompositeOperation="destination-in",ctxTmp.drawImage(n,l.x,l.y,l.cx,l.cy,0,0,c,m),a.drawImage(p,0,0,c,m,0,0,c,m),a.restore()}else a.drawImage(n,l.x,l.y,l.cx,l.cy,0,0,c,m)},paintTextureImage:function(e,a,i,r,t,s,n,l){var o;o=t.clipping&&t.clipping[s]?t.clipping[s]:{x:0,y:0,cx:n.width,cy:n.height},e.paintTextureImageClip.call(this,e,a,i,r,t,s,n,o,l)},paintTexture:function(e,a,i,r,t){var s=e.materials[i].channels[r];for(var n in s.texturesImg){var l=t.images[n];e.paintTextureImage.call(this,e,a,i,r,s,n,l,t)}},makeMaterialTextures:function(e,a,i){for(var r in e.materials[a].channels){var t=e.materials[a].channels[r],s=document.createElement("canvas");s.width=t.size.cx,s.height=t.size.cy;var n=s.getContext("2d");e.paintTexture.call(this,e,n,a,r,i);var l=new THREE.Texture(s);l.needsUpdate=!0,i.textures[a][r]=l}},makeMaterials:function(e,a){a.textures={};for(var i in e.materials)a.textures[i]={},e.makeMaterialTextures.call(this,e,i,a),e.makeMaterial.call(this,e,i,a)}}},View.Game.cbTokenPieceStyle3D=$.extend(!0,{},View.Game.cbBasePieceStyle,{default:{makeMaterials:function(e,a){a.textures={};for(var i in e.materials)a.textures[i]={},e.makeMaterialTextures.call(this,e,i,a);var r=[];for(var t in a.loadedMaterials){var s=a.loadedMaterials[t].clone(),n=s.name;if(e.materials[n]){$.extend(!0,s,e.materials[n].params);for(var l in e.materials[n].channels)switch(l){case"diffuse":s.map=a.textures[n][l];break;case"bump":s.bumpMap=a.textures[n][l]}}r.push(s)}var o=new THREE.MultiMaterial(r);a.material=o}}}),View.Game.cbUniformPieceStyle3D=$.extend(!0,{},View.Game.cbBasePieceStyle,{default:{makeMaterial:function(e,a,i){var r=e.materials[a].params;r.map=i.textures[a].diffuse,r.normalMap=i.textures[a].normal;var t=e.materials[a].channels.normal.normalScale||1;r.normalScale=new THREE.Vector2(t,t);var s=new THREE.MeshPhongMaterial(r);i.material=s,i.geometry.mergeVertices(),i.geometry.computeVertexNormals()}}}),View.Game.cbPhongPieceStyle3D=$.extend(!0,{},View.Game.cbBasePieceStyle,{default:{phongProperties:{color:"#ffffff",shininess:300,specular:"#ffffff",emissive:"#222222",shading:"undefined"!=typeof THREE?THREE.FlatShading:0},makeMaterials:function(e,a){var i=new THREE.MeshPhongMaterial(e.phongProperties);a.material=i}}})}(),function(){var e=0,a=0,i={};View.Game.cbEnsureConstants=function(){a||(a=this.cbVar.geometry.height,e=this.cbVar.geometry.width)},View.Game.cbCSize=function(r){this.cbEnsureConstants();var t=i[r.margins.x+"_"+r.margins.y];if(!t){var s,n,l,o,c=e+2*r.margins.x,m=a+2*r.margins.y;s=c/m,o=s<1?12e3*s/c:12e3/s/m,n=(e+2*r.margins.x)*o,l=(a+2*r.margins.y)*o,t={cx:o,cy:o,pieceCx:o,pieceCy:o,ratio:s,width:n,height:l},i[r.margins.x+"_"+r.margins.y]=t}return t},View.Game.cbGridBoard=$.extend({},View.Game.cbBaseBoard,{notationMode:"out",coordsFn:function(i){return i=i||{},i.margins=i.margins||{x:0,y:0},function(r){var t=this.cbCSize(i),s=r%e,n=(r-s)/e;return 1==this.mViewAs&&(n=a-1-n),-1==this.mViewAs&&(s=e-1-s),{x:(s-(e-1)/2)*t.cx,y:(n-(a-1)/2)*t.cy,z:0}}},createGeometry:function(e,a){var i=this.cbCSize(e),r=i.width/1e3,t=i.height/1e3,s=new THREE.PlaneGeometry(r,t),n=new THREE.Matrix4;n.makeRotationX(-Math.PI/2),s.applyMatrix(n);for(var l=s.faceVertexUvs[0],o=0;o<l.length;o++)for(var c=0;c<l[o].length;c++)i.ratio<1&&(l[o][c].x=l[o][c].x*i.ratio+(1-i.ratio)/2),i.ratio>1&&(l[o][c].y=l[o][c].y/i.ratio+(1-1/i.ratio)/2);a(s)},paintBackground:function(e,a,i,r,t,s){i.boardBG&&a.drawImage(i.boardBG,-t/2,-s/2,t,s)},paintChannel:function(e,a,i,r){var t=this.cbCSize(e);e.paintBackground.call(this,e,a,i,r,t.width,t.height)},paint:function(e,a,i,r){for(var t in a){var s=a[t].getContext("2d");s.save(),s.scale(e.TEXTURE_CANVAS_CX/12e3,e.TEXTURE_CANVAS_CY/12e3),s.translate(6e3,6e3),e.paintChannel.call(this,e,s,i,t),s.restore()}r()}}),View.Game.cbGridBoardClassic=$.extend({},View.Game.cbGridBoard,{colorFill:{".":"rgba(160,150,150,0.9)","#":"rgba(0,0,0,1)"," ":"rgba(0,0,0,0)"},texturesImg:{boardBG:"/res/images/wood.jpg"},modifyMesh:function(e,a,i){function r(e,a){var i=new THREE.Shape;return i.moveTo(-e/2,-a/2),i.lineTo(e/2,-a/2),i.lineTo(e/2,a/2),i.lineTo(-e/2,a/2),i}var t=this.cbCSize(e),s=t.width/1e3,n=t.height/1e3,l=r(s+.5+.1,n+.5+.1),o=r(s+.1,n+.1);l.holes.push(o);var c={amount:.4,steps:1,bevelSize:.1,bevelThickness:.04,bevelSegments:1},m=new THREE.ExtrudeGeometry(l,c),f=new THREE.Matrix4;f.makeRotationX(-Math.PI/2),m.applyMatrix(f),blackMat=new THREE.MeshPhongMaterial({color:"#000000",shininess:500,specular:"#888888",emissive:"#000000"});var p=new THREE.Mesh(m,blackMat);p.position.y=-c.amount-.01,a.add(p);var d=new THREE.Mesh(new THREE.BoxGeometry(s,n,.1),blackMat);d.rotation.x=Math.PI/2,d.position.y=-.1,a.add(d),i(a)},paintCell:function(e,a,i,r,t,s,n,l,o){a.strokeStyle="rgba(0,0,0,1)",a.lineWidth=15,a.fillStyle="bump"==r?"#ffffff":e.colorFill[t],a.fillRect(s-l/2,n-o/2,l,o),a.rect(s-l/2,n-o/2,l,o)},paintCells:function(i,r,t,s){for(var n=this.cbCSize(i),l=i.coordsFn(i),o=0;o<a;o++)for(var c=0;c<e;c++){var m=1==this.mViewAs?c+o*e:e*a-(1+c+o*e),f=l.call(this,m),p=this.cbView.boardLayout[a-o-1][c],d=f.x,h=f.y,g=n.cx,u=n.cy;i.paintCell.call(this,i,r,t,s,p,d,h,g,u)}},paintLines:function(i,r,t,s){var n=this.cbCSize(i);r.strokeStyle="#000000",r.lineWidth=40,r.strokeRect(-e*n.cx/2,-a*n.cy/2,e*n.cx,a*n.cy)},paintChannel:function(e,a,i,r){var t=this.cbCSize(e);e.paintBackground.call(this,e,a,i,r,t.width,t.height),e.paintCells.call(this,e,a,i,r),e.paintLines.call(this,e,a,i,r),this.mNotation&&e.paintNotation.call(this,e,a,r)},paintNotation:function(e,a,i){var r=this.cbCSize(e);switch(a.textAlign="center",a.textBaseline="middle",a.fillStyle="#000000",a.font=Math.ceil(r.cx/3)+"px Monospace",e.notationMode){case"out":e.paintOutNotation.apply(this,arguments);break;case"in":e.paintInNotation.apply(this,arguments)}},paintOutNotation:function(i,r,t){for(var s=this.cbCSize(i),n=0;n<a;n++){var l=a-n;this.mViewAs<0&&(l=n+1);var o=-(e/2+i.margins.x/2)*s.cx,c=(n-a/2+.5)*s.cy;r.fillText(l,o,c)}for(var m=0;m<e;m++){var f=m;this.mViewAs<0&&(f=e-m-1);var o=(m-e/2+.5)*s.cx,c=(a/2+i.margins.y/2)*s.cy;r.fillText(String.fromCharCode(97+f),o,c)}},paintInNotation:function(i,r,t){var s=this.cbCSize(i),n=i.coordsFn(i),l=i.colorFill;r.font=Math.ceil(s.cx/5)+"px Monospace";for(var o=0;o<a;o++)for(var c=0;c<e;c++){var m=a-o,f=c;this.mViewAs<0?f=e-c-1:m=o+1;var p=1==this.mViewAs?c+o*e:e*a-(1+c+o*e),d=n.call(this,p);switch(r.fillStyle="rgba(0,0,0,0)","bump"==t&&(r.fillStyle=l["."]),this.cbView.boardLayout[a-o-1][c]){case".":r.fillStyle="bump"==t?l["."]:l["#"];break;case"#":r.fillStyle=l["."]}var h=d.x-s.cx/3,g=d.y-s.cy/3;i.notationDebug?r.fillText(p,h,g):r.fillText(String.fromCharCode(97+f)+m,h,g)}}}),View.Board.cbMoveMidZ=function(e,a,i,r){var t=e.cbVar.geometry,s=t.C(a.f),n=t.C(a.t),l=t.R(a.f),o=t.R(a.t);return n-s==0||o-l==0||Math.abs(n-s)==Math.abs(o-l)?(i+r)/2:Math.max(i,r)+1500},View.Game.cbGridBoardClassic2D=$.extend({},View.Game.cbGridBoardClassic,{colorFill:{".":"#F1D9B3","#":"#C7885D"," ":"rgba(0,0,0,0)"}}),View.Game.cbGridBoardClassic3DMargin=$.extend({},View.Game.cbGridBoardClassic,{margins:{x:.67,y:.67},extraChannels:["bump"]}),View.Game.cbGridBoardClassic2DMargin=$.extend({},View.Game.cbGridBoardClassic2D,{margins:{x:.67,y:.67}}),View.Game.cbGridBoardClassic2DNoMargin=$.extend({},View.Game.cbGridBoardClassic2D,{margins:{x:0,y:0},notationMode:"in",texturesImg:{boardBG:"/res/images/whitebg.png"}})}(),function(){var e={cx:512,cy:512};View.Game.cbFairyPieceStyle=function(e){return $.extend(!0,{1:{default:{"2d":{clipy:0}}},"-1":{default:{"2d":{clipy:100}}},default:{"3d":{display:this.cbDisplayPieceFn(this.cbFairyPieceStyle3D)},"2d":{file:this.mViewOptions.fullPath+"/res/fairy/wikipedia-fairy-sprites.png",clipwidth:100,clipheight:100}},"fr-pawn":{"2d":{clipx:0}},"fr-hoplit":{"2d":{clipx:0}},"fr-ferz":{"2d":{clipx:3900}},"fr-wazir":{"2d":{clipx:3800}},"fr-knight":{"2d":{clipx:100}},"fr-bishop":{"2d":{clipx:200}},"fr-small-bishop":{"2d":{clipx:3400}},"fr-crowned-bishop":{"2d":{clipx:3300}},"fr-rook":{"2d":{clipx:300}},"fr-small-rook":{"2d":{clipx:3500}},"fr-gate":{"2d":{clipx:3600}},"fr-queen":{"2d":{clipx:400}},"fr-proper-queen":{"2d":{clipx:400}},"fr-king":{"2d":{clipx:500}},"fr-emperor":{"2d":{clipx:500}},"fr-man":{"2d":{clipx:3700}},"fr-cannon":{"2d":{clipx:600}},"fr-cannon2":{"2d":{clipx:600}},"fr-elephant":{"2d":{clipx:700}},"fr-proper-elephant":{"2d":{clipx:700}},"fr-dragon":{"2d":{clipx:800}},"fr-lighthouse":{"2d":{clipx:900}},"fr-admiral":{"2d":{clipx:1e3}},"fr-eagle":{"2d":{clipx:1100}},"fr-birdie":{"2d":{clipx:1100}},"fr-lion":{"2d":{clipx:1200}},"fr-camel":{"2d":{clipx:1300}},"fr-amazon":{"2d":{clipx:1400}},"fr-crowned-rook":{"2d":{clipx:1500}},"fr-proper-crowned-rook":{"2d":{clipx:1500}},"fr-marshall":{"2d":{clipx:1600}},"fr-proper-marshall":{"2d":{clipx:1600}},"fr-cardinal":{"2d":{clipx:1700}},"fr-proper-cardinal":{"2d":{clipx:1700}},"fr-unicorn":{"2d":{clipx:1800}},"fr-rhino":{"2d":{clipx:1900}},"fr-bull":{"2d":{clipx:2e3}},"fr-prince":{"2d":{clipx:2100}},"fr-ship":{"2d":{clipx:2200}},"fr-buffalo":{"2d":{clipx:2300}},"fr-bow":{"2d":{clipx:2400}},"fr-antelope":{"2d":{clipx:2500}},"fr-star":{"2d":{clipx:2600}},"fr-corporal":{"2d":{clipx:2700}},"fr-machine":{"2d":{clipx:2800}},"fr-giraffe":{"2d":{clipx:4e3}},"fr-wolf":{"2d":{clipx:4100}},"fr-squirle":{"2d":{clipx:4200}},"fr-crowned-rook":{"2d":{clipx:4300}},"fr-crowned-knight":{"2d":{clipx:4400}},"fr-crowned-bishop":{"2d":{clipx:4500}},"fr-leopard":{"2d":{clipx:4600}},"fr-huscarl":{"2d":{clipx:4700}},"fr-griffin":{"2d":{clipx:4800}},"fr-mammoth":{"2d":{clipx:4900}},"fr-duchess":{"2d":{clipx:5e3}},"fr-hawk":{"2d":{clipx:5100}}},e)},View.Game.cbFairyPieceStyle3D=$.extend(!0,{},View.Game.cbUniformPieceStyle3D,{default:{mesh:{normalScale:1,rotateZ:180},materials:{mat0:{channels:{diffuse:{size:e},normal:{size:e}}}}},1:{default:{materials:{mat0:{params:{specular:131586,shininess:150}}}}},"-1":{default:{materials:{mat0:{params:{specular:263172,shininess:100}}},paintTextureImageClip:function(e,a,i,r,t,s,n,l,o){var c=a.canvas.width,m=a.canvas.height;"diffuse"==r?(a.globalCompositeOperation="normal",a.drawImage(n,l.x,l.y,l.cx,l.cy,0,0,c,m),a.globalCompositeOperation="multiply",a.drawImage(n,l.x,l.y,l.cx,l.cy,0,0,c,m),a.drawImage(n,l.x,l.y,l.cx,l.cy,0,0,c,m),a.globalCompositeOperation="hue",a.fillStyle="rgba(0,0,0,0.7)",a.fillRect(0,0,512,512)):a.drawImage(n,l.x,l.y,l.cx,l.cy,0,0,c,m)}}},"fr-pawn":{mesh:{jsFile:"/res/fairy/pawn/pawn.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/pawn/pawn-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/pawn/pawn-normalmap.jpg"}}}}}},"fr-hoplit":{mesh:{jsFile:"/res/fairy/pawn/hoplit.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/pawn/hoplit-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/pawn/pawn-normalmap.jpg"}}}}}},"fr-ferz":{mesh:{jsFile:"/res/fairy/pawn/ferz.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/pawn/pawn-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/pawn/pawn-normalmap.jpg"}}}}}},"fr-wazir":{mesh:{jsFile:"/res/fairy/pawn/wazir.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/pawn/pawn-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/pawn/pawn-normalmap.jpg"}}}}}},"fr-knight":{mesh:{jsFile:"/res/fairy/knight/knight.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/knight/knight-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/knight/knight-normalmap.jpg"}}}}}},"fr-nightrider":{mesh:{jsFile:"/res/fairy/knight/nightrider.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/knight/pedestal-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/knight/knight-normalmap.jpg"}}}}}},"fr-wazir-knight":{mesh:{jsFile:"/res/fairy/knight/wazirknight.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/knight/pedestal-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/knight/knight-normalmap.jpg"}}}}}},"fr-ferz-knight":{mesh:{jsFile:"/res/fairy/knight/ferzknight.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/knight/knight-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/knight/knight-normalmap.jpg"}}}}}},"fr-zebra":{mesh:{jsFile:"/res/fairy/knight/knight.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/knight/zebra-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/knight/knight-normalmap.jpg"}}}}}},"fr-bishop":{mesh:{jsFile:"/res/fairy/bishop/bishop.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/bishop/bishop-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/bishop/bishop-normalmap.jpg"}}}}}},"fr-rook":{mesh:{jsFile:"/res/fairy/rook/rook.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/rook/rook-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/rook/rook-normalmap.jpg"}}}}}},"fr-queen":{mesh:{jsFile:"/res/fairy/queen/queen.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/queen/queen-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/queen/queen-normalmap.jpg"}}}}}},"fr-king":{mesh:{jsFile:"/res/fairy/king/king.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/king/king-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/king/king-normalmap.jpg"}}}}}},"fr-cannon":{mesh:{jsFile:"/res/fairy/cannon/cannon.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/cannon/cannon-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/cannon/cannon-normalmap.jpg"}}}}}},"fr-cannon2":{mesh:{jsFile:"/res/fairy/cannon2/cannon2.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/cannon2/cannon2-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/cannon2/cannon2-normalmap.jpg"}}}}}},"fr-dragon":{mesh:{jsFile:"/res/fairy/dragon/dragon.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/dragon/dragon-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/dragon/dragon-normalmap.jpg"}}}}}},"fr-lighthouse":{mesh:{jsFile:"/res/fairy/lighthouse/lighthouse.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/lighthouse/lighthouse-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/lighthouse/lighthouse-normalmap.jpg"}}}}}},"fr-elephant":{mesh:{jsFile:"/res/fairy/elephant/elephant.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/elephant/elephant-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/elephant/elephant-normalmap.jpg"}}}}}},"fr-admiral":{mesh:{jsFile:"/res/fairy/admiral/admiral.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/admiral/admiral-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/admiral/admiral-normalmap.jpg"}}}}}},"fr-eagle":{mesh:{jsFile:"/res/fairy/eagle/eagle.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/eagle/eagle-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/eagle/eagle-normalmap.jpg"}}}}}},"fr-lion":{mesh:{jsFile:"/res/fairy/lion/lion.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/lion/lion-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/lion/lion-normalmap.jpg"}}}}}},"fr-camel":{mesh:{jsFile:"/res/fairy/camel/camel.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/camel/camel-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/camel/camel-normalmap.jpg"}}}}}},"fr-marshall":{mesh:{jsFile:"/res/fairy/marshall/marshall.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/marshall/marshall-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/marshall/marshall-normalmap.jpg"}}}}}},"fr-crowned-rook":{mesh:{jsFile:"/res/fairy/crowned-rook/crowned-rook.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/crowned-rook/crowned-rook-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/crowned-rook/crowned-rook-normalmap.jpg"}}}}}},"fr-amazon":{mesh:{jsFile:"/res/fairy/amazon/amazon.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/amazon/amazon-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/amazon/amazon-normalmap.jpg"}}}}}},"fr-cardinal":{mesh:{jsFile:"/res/fairy/cardinal/cardinal.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/cardinal/cardinal-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/cardinal/cardinal-normalmap.jpg"}}}}}},"fr-unicorn":{mesh:{jsFile:"/res/fairy/unicorn/unicorn.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/unicorn/unicorn-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/unicorn/unicorn-normalmap.jpg"}}}}}},"fr-star":{mesh:{jsFile:"/res/fairy/star/star.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/star/star-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/star/star-normalmap.jpg"}}}}}},"fr-bow":{mesh:{jsFile:"/res/fairy/bow/bow.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/bow/bow-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/bow/bow-normalmap.jpg"}}}}}},"fr-prince":{mesh:{jsFile:"/res/fairy/prince/prince.js"},
materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/prince/prince-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/prince/prince-normalmap.jpg"}}}}}},"fr-rhino":{mesh:{jsFile:"/res/fairy/rhino/rhino.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/rhino/rhino-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/rhino/rhino-normalmap.jpg"}}}}}},"fr-bull":{mesh:{jsFile:"/res/fairy/bull/bull.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/bull/bull-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/bull/bull-normalmap.jpg"}}}}}},"fr-corporal":{mesh:{jsFile:"/res/fairy/corporal/corporal.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/corporal/corporal-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/corporal/corporal-normalmap.jpg"}}}}}},"fr-antelope":{mesh:{jsFile:"/res/fairy/antelope/antelope.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/antelope/antelope-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/antelope/antelope-normalmap.jpg"}}}}}},"fr-machine":{mesh:{jsFile:"/res/fairy/machine/machine.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/machine/machine-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/machine/machine-normalmap.jpg"}}}}}},"fr-buffalo":{mesh:{jsFile:"/res/fairy/buffalo/buffalo.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/buffalo/buffalo-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/buffalo/buffalo-normalmap.jpg"}}}}}},"fr-ship":{mesh:{jsFile:"/res/fairy/ship/ship.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/ship/ship-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/ship/ship-normalmap.jpg"}}}}}},"fr-giraffe":{mesh:{jsFile:"/res/fairy/giraffe/giraffe.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/giraffe/giraffe-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/giraffe/giraffe-normalmap.jpg"}}}}}},"fr-wolf":{mesh:{jsFile:"/res/fairy/wolf/wolf.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/wolf/wolf-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/wolf/wolf-normalmap.jpg"}}}}}},"fr-squirle":{mesh:{jsFile:"/res/fairy/squirle/squirle.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/squirle/squirle-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/squirle/squirle-normalmap.jpg"}}}}}},"fr-crowned-bishop":{mesh:{jsFile:"/res/fairy/crowned-bishop/crowned-bishop.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/crowned-bishop/crowned-bishop-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/crowned-bishop/crowned-bishop-normalmap.jpg"}}}}}},"fr-crowned-knight":{mesh:{jsFile:"/res/fairy/crowned-knight/crowned-knight.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/crowned-knight/crowned-knight-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/crowned-knight/crowned-knight-normalmap.jpg"}}}}}},"fr-crowned-rook":{mesh:{jsFile:"/res/fairy/crowned-rook/crowned-rook.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/crowned-rook/crowned-rook-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/crowned-rook/crowned-rook-normalmap.jpg"}}}}}},"fr-leopard":{mesh:{jsFile:"/res/fairy/leopard/leopard.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/leopard/leopard-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/leopard/leopard-normalmap.jpg"}}}}}},"fr-huscarl":{mesh:{jsFile:"/res/fairy/huscarl/huscarl.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/huscarl/huscarl-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/huscarl/huscarl-normalmap.jpg"}}}}}},"fr-griffin":{mesh:{jsFile:"/res/fairy/griffin/griffin.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/griffin/griffin-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/griffin/griffin-normalmap.jpg"}}}}}},"fr-mammoth":{mesh:{jsFile:"/res/fairy/mammoth/mammoth.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/mammoth/mammoth-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/mammoth/mammoth-normalmap.jpg"}}}}}},"fr-duchess":{mesh:{jsFile:"/res/fairy/lighthouse/lighthouse.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/lighthouse/lighthouse-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/lighthouse/lighthouse-normalmap.jpg"}}}}}},"fr-hawk":{mesh:{jsFile:"/res/fairy/hawk/hawk.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/fairy/hawk/hawk-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/fairy/hawk/hawk-normalmap.jpg"}}}}}}})}(),function(){View.Game.cbDefineView=function(){var e={},a=$.extend(!0,{},this.cbGridBoardClassic3DMargin,e),i=$.extend(!0,{},this.cbGridBoardClassic2DNoMargin,e);return{coords:{"2d":this.cbGridBoard.coordsFn.call(this,i),"3d":this.cbGridBoard.coordsFn.call(this,a)},boardLayout:[".#.#.#.#.#.#","#.#.#.#.#.#.",".#.#.#.#.#.#","#.#.#.#.#.#.",".#.#.#.#.#.#","#.#.#.#.#.#.",".#.#.#.#.#.#","#.#.#.#.#.#.",".#.#.#.#.#.#","#.#.#.#.#.#.",".#.#.#.#.#.#","#.#.#.#.#.#."],board:{"2d":{draw:this.cbDrawBoardFn(i)},"3d":{display:this.cbDisplayBoardFn(a)}},clicker:{"2d":{width:1e3,height:1e3},"3d":{scale:[.6,.6,.6]}},pieces:this.cbFairyPieceStyle({default:{"3d":{scale:[.4,.4,.4]},"2d":{width:900,height:900}}})}},View.Board.cbMoveMidZ=function(e,a,i,r){return"N"==a.a||"M"==a.a||"E"==a.a&&2==e.g.distGraph[a.f][a.t]||"L"==a.a&&2==e.g.distGraph[a.f][a.t]||"K"==a.a&&2==e.g.distGraph[a.f][a.t]||"C"==a.a&&null!=a.c?Math.max(i,r)+1500:(i+r)/2};var e=View.Game.xdInit;View.Game.xdInit=function(a){var i=this;e.apply(this,arguments);a.createGadget("setup-board",{base:{type:"element",x:0,y:0,width:7200,height:5400,z:108,css:{"background-color":"White"}}});var r={0:"KQEL",1:"KQLE",2:"KEQL",3:"KLQE",4:"KELQ",5:"KLEQ",6:"QEKL",7:"QLKE",8:"EQKL",9:"LQKE",10:"ELKQ",11:"LEKQ"},t={K:500,Q:400,E:1100,L:1200};for(var s in r)!function(e){var s=3*(e%4-1.5)*600,n=3*(Math.floor(e/4)-1)*600;a.createGadget("setup#"+e,{base:{type:"canvas",x:s,y:n,width:1200,height:1200,z:109,draw:function(a){a.fillStyle="#c0c0c0",a.rect(-600,-600,1200,1200),a.fill(),a.save(),this.getResource("image|"+i.g.fullPath+"/res/fairy/wikipedia-fairy-sprites.png",function(i){for(var s=0;s<4;s++){var n=s%2,l=Math.floor(s/2),o=r[e].charAt(s);a.drawImage(i,t[o],0,100,100,600*(n-1),600*(l-1),600,600)}a.restore()})}}})}(s)};var a=View.Board.xdInput;View.Board.xdInput=function(e,i){return void 0===this.setupState?{initial:{},getActions:function(e,a){return null}}:"setup"==this.setupState?{initial:{setupDone:!1},getActions:function(e,a){var i={};return a.setupDone||e.forEach(function(e){i[e.setup]={view:["setup#"+e.setup],click:["setup#"+e.setup],moves:[e],validate:{setupDone:!0}}}),i},furnitures:["setup-board"]}:a.apply(this,arguments)};var i=View.Board.cbAnimate;View.Board.cbAnimate=function(e,a,r,t){void 0===this.setupState||"setup"==this.setupState?t():i.apply(this,arguments)};var r=View.Board.xdDisplay;View.Board.xdDisplay=function(e,a){if(void 0===this.setupState||"setup"==this.setupState){var i=this,t={};[5,6,17,18,125,126,137,138].forEach(function(e){var a=i.board[e];t[e]=a,i.pieces[a].p=-1}),r.apply(this,arguments);for(var s in t)this.pieces[t[s]].p=parseInt(s)}else r.apply(this,arguments)}}();