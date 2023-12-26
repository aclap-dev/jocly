exports.view=View={Game:{},Board:{},Move:{}},function(){var e,a,t;View.Game.cbTargetMesh="/res/ring-target.js",View.Game.cbTargetSelectColor=16777215,View.Game.cbTargetCancelColor=16746496,View.Game.cbPromoSize=2e3,View.Game.xdInit=function(t){this.g.fullPath=this.mViewOptions.fullPath,this.cbPieceByType={},e=this.cbVar,a=this.cbDefineView(),this.cbView=a,this.cbClearPieces(),this.cbCreateLights(t),this.cbCreateScreens(t),this.cbCreateBoard(t),this.cbCreatePromo(t),this.cbCreatePieces(t),this.cbCreateCells(t)},View.Game.cbMakeDummyMesh=function(e){return"undefined"!=typeof THREE?new THREE.Mesh(new THREE.CubeGeometry(1e-4,1e-4,1e-4),new THREE.MeshLambertMaterial):null},View.Game.cbCurrentGame=function(){return t},View.Game.cbCreatePieces=function(e){for(var a=this.cbMakeDummyMesh(e),t=0;t<this.cbPiecesCount;t++)e.createGadget("piece#"+t,{base:{},"2d":{type:"sprite"},"3d":{type:"custommesh3d",create:function(e,t,i){return a}}})},View.Game.cbCreateBoard=function(e){var a=this.cbMakeDummyMesh(e);e.createGadget("board",{base:{},"2d":{type:"canvas",width:12e3,height:12e3,draw:function(e){console.warn("board draw must be overridden")}},"3d":{type:"custommesh3d",receiveShadow:!0,create:function(e,t,i){return a}}})},View.Game.cbCreateCells=function(e){for(var a=this,t=0;t<this.g.boardSize;t++)!function(t){e.createGadget("cell#"+t,{"2d":{z:101,type:"element",initialClasses:a.cbCellClass(e,t),width:1300,height:1300}}),e.createGadget("clicker#"+t,$.extend(!0,{"2d":{z:103,type:"element",initialClasses:"cb-clicker"},"3d":{type:"meshfile",file:a.g.fullPath+a.cbTargetMesh,flatShading:!0,castShadow:!0,smooth:0,scale:[.9,.9,.9],materials:{square:{transparent:!0,opacity:0},ring:{color:a.cbTargetSelectColor,opacity:1}}}},a.cbView.clicker))}(t)},View.Game.cbCreatePromo=function(e){e.createGadget("promo-board",{base:{type:"element",x:0,y:0,width:2e3,height:2e3,z:108,css:{"background-color":"White"}}}),e.createGadget("promo-cancel",{base:{type:"image",file:this.g.fullPath+"/res/images/cancel.png",x:0,y:0,width:800,height:800,z:109}});for(var a=0;a<this.g.pTypes.length;a++)e.createGadget("promo#"+a,{base:{y:0,z:109,type:"sprite",clipwidth:100,clipheight:100,width:1200,height:1200}})},View.Game.xdBuildScene=function(i){t=this,e=this.cbVar,a=this.cbDefineView(),this.cbView=a;for(var n=0;n<this.cbExtraLights.length;n++)i.updateGadget("extralights#"+n,{"3d":{visible:!0}});i.updateGadget("board",$.extend({base:{visible:!0}},this.cbView.board));for(var r=0;r<this.g.boardSize;r++)!function(e){var a=t.cbMakeDisplaySpec(e,0),n=$.extend(!0,{},a,{base:{visible:!0}},t.cbView.clicker,t.cbView.cell);i.updateGadget("cell#"+e,n),$.extend(!0,a,t.cbView.clicker),i.updateGadget("clicker#"+e,a)}(r);i.updateGadget("videoa",{"3d":{visible:!0,playerSide:1,z:3e3,y:1==this.mViewAs?1e4:-1e4,rotate:1==this.mViewAs?-180:-0,rotateX:1==this.mViewAs?25:-25,scale:[3,3,3]}}),i.updateGadget("videoabis",{"3d":{visible:!0,playerSide:-1,z:1500,x:1==this.mViewAs?-5500:5500,y:1==this.mViewAs?8900:-8900,rotate:1==this.mViewAs?-180:-0,rotateX:1==this.mViewAs?25:-25,scale:[.75,.75,.75]}}),i.updateGadget("videob",{"3d":{visible:!0,playerSide:-1,z:3e3,y:1==this.mViewAs?-1e4:1e4,rotate:1==this.mViewAs?-0:-180,rotateX:1==this.mViewAs?-25:25,scale:[3,3,3]}}),i.updateGadget("videobbis",{"3d":{visible:!0,playerSide:1,z:1500,x:1==this.mViewAs?5500:-5500,y:1==this.mViewAs?-8900:8900,rotate:1==this.mViewAs?-0:-180,rotateX:1==this.mViewAs?-25:25,scale:[.75,.75,.75]}}),i.updateGadget("promo-board",{base:{visible:!1}}),i.updateGadget("promo-cancel",{base:{visible:!1}});for(var n=0;n<this.g.pTypes.length;n++)i.updateGadget("promo#"+n,{base:{visible:!1}})},View.Game.cbDisplayBoardFn=function(e){var a=this;return function(i,n,r){var s=e.style+"_"+e.margins.x+"_"+e.margins.y+"_"+a.mNotation+"_"+a.mViewAs,c=this;s!=this._cbKey&&(this._cbKey=s,e.display.call(t,e,c,function(e){c.replaceMesh(e,n,r)}))}},View.Game.cbDrawBoardFn=function(e){return function(a){e.draw.call(t,e,this,a)}},View.Game.cbMakeDisplaySpec=function(e,a){var t={};for(var i in this.cbView.coords){var n=this.cbView.coords[i],r=n.call(this,e);t[i]={x:r.x||0,y:r.y||0,z:r.z||0,rotateX:r.rx||0,rotateY:(r.ry||0)*("3d"==i?this.mViewAs*a<0?-1:1:0),rotate:(r.rz||0)+("3d"==i&&this.mViewAs*a<0?180:0)}}return t},View.Game.cbMakeDisplaySpecForPiece=function(t,i,n){function r(e,a,t){return a?$.extend(!0,e,a.default,a[t]):{}}var s=this.cbMakeDisplaySpec(i,n.s);if(void 0===e.pieceTypes[n.t])return void console.warn("Piece type",n.t,"not defined in model");var c=e.pieceTypes[n.t].aspect||e.pieceTypes[n.t].name;return c?(a.pieces&&(s=r(s,a.pieces,c),a.pieces[n.s]&&(s=r(s,a.pieces[n.s],c))),s):void console.warn("Piece type",n.t,"has no aspect defined")},View.Board.xdDisplay=function(e,a){for(var t=0;t<this.pieces.length;t++){var i=this.pieces[t];if(i.p<0)e.updateGadget("piece#"+t,{base:{visible:!1}});else{var n=a.cbMakeDisplaySpecForPiece(a,i.p,i);n=$.extend(!0,{base:{visible:!0},"2d":{opacity:1},"3d":{positionEasingUpdate:null}},n),e.updateGadget("piece#"+t,n)}}for(;t<a.cbPiecesCount;t++)e.updateGadget("piece#"+t,{base:{visible:!1}})},View.Game.cbExtraLights=[{color:16777215,intensity:.8,position:[9,14,-9],props:{shadowCameraNear:10,shadowCameraFar:25,castShadow:!0,shadowMapWidth:2048,shadowMapHeight:2048}}],View.Game.cbCreateLights=function(e){for(var a=0;a<this.cbExtraLights.length;a++)!function(a,t){e.createGadget("extralights#"+t,{"3d":{type:"custommesh3d",create:function(e){var t=new THREE.SpotLight(a.color,a.intensity);t.shadow.camera.far=a.props.shadowCameraFar,t.shadow.camera.near=a.props.shadowCameraNear,t.shadow.mapSize.width=a.props.shadowMapWidth,t.shadow.mapSize.height=a.props.shadowMapHeight,t.position.set.apply(t.position,a.position);var i=new THREE.Mesh;i.add(t);var n=new THREE.Object3D;i.add(n),t.target=n,e(i)}}})}(this.cbExtraLights[a],a)},View.Game.cbCreateScreen=function(e){var a=new THREE.PlaneGeometry(4,3,1,1),t=new THREE.MeshPhongMaterial({color:16777215,map:e,shading:THREE.FlatShading,emissive:{r:1,g:1,b:1}}),i=new THREE.Mesh(a,t);return this.objectReady(i),null},View.Game.cbCreateScreens=function(e){var a=this;e.createGadget("videoa",{"3d":{type:"video3d",makeMesh:function(e){return a.cbCreateScreen.call(this,e)}}}),e.createGadget("videoabis",{"3d":{type:"video3d",makeMesh:function(e){return a.cbCreateScreen.call(this,e)}}}),e.createGadget("videob",{"3d":{type:"video3d",makeMesh:function(e){return a.cbCreateScreen.call(this,e)}}}),e.createGadget("videobbis",{"3d":{type:"video3d",makeMesh:function(e){return a.cbCreateScreen.call(this,e)}}})},View.Board.xdInput=function(a,t){function i(){a.updateGadget("promo-board",{base:{visible:!1}}),a.updateGadget("promo-cancel",{base:{visible:!1}})}return{initial:{f:null,t:null,pr:null},getActions:function(n,r){var s={};if(null==r.f)n.forEach(function(e){void 0===s[e.f]&&(s[e.f]={f:e.f,moves:[],click:["piece#"+this.board[e.f],"clicker#"+e.f],view:["clicker#"+e.f],highlight:function(i){a.updateGadget("cell#"+e.f,{"2d":{classes:"select"==i?"cb-cell-select":"cb-cell-cancel",opacity:t.mShowMoves||"cancel"==i?1:0}}),a.updateGadget("clicker#"+e.f,{"3d":{materials:{ring:{color:"select"==i?t.cbTargetSelectColor:t.cbTargetCancelColor,opacity:t.mShowMoves||"cancel"==i?1:0,transparent:!t.mShowMoves&&"cancel"!=i}},castShadow:t.mShowMoves||"cancel"==i}})},unhighlight:function(){a.updateGadget("cell#"+e.f,{"2d":{classes:""}})},validate:{f:e.f}}),s[e.f].moves.push(e)},this);else if(null==r.t)n.forEach(function(n){var r=void 0===n.cg?n.t:n.cg;void 0===s[r]&&(s[r]={t:n.t,moves:[],click:["piece#"+this.board[r],"clicker#"+r],view:["clicker#"+r],highlight:function(e){a.updateGadget("cell#"+r,{"2d":{classes:"select"==e?"cb-cell-select":"cb-cell-cancel",opacity:t.mShowMoves||"cancel"==e?1:0}}),a.updateGadget("clicker#"+r,{"3d":{materials:{ring:{color:"select"==e?t.cbTargetSelectColor:t.cbTargetCancelColor,opacity:t.mShowMoves||"cancel"==e?1:0,transparent:!t.mShowMoves&&"cancel"!=e}},castShadow:t.mShowMoves||"cancel"==e}})},unhighlight:function(e){a.updateGadget("cell#"+r,{"2d":{classes:""}})},validate:{t:n.t},execute:function(i){var r=this;this.cbAnimate(a,t,n,function(){var c=s[n.t].moves;c.length>1&&(a.updateGadget("promo-board",{base:{visible:!0,width:t.cbPromoSize*(c.length+1)}}),a.updateGadget("promo-cancel",{base:{visible:!0,x:c.length*t.cbPromoSize/2}}),c.forEach(function(i,n){var r=e.pieceTypes[i.pr].aspect||e.pieceTypes[i.pr].name,s=$.extend(!0,{},t.cbView.pieces.default,t.cbView.pieces[r]);t.cbView.pieces[this.mWho]&&(s=$.extend(!0,s,t.cbView.pieces[this.mWho].default,t.cbView.pieces[this.mWho][r])),a.updateGadget("promo#"+i.pr,{base:$.extend(s["2d"],{x:(n-c.length/2)*t.cbPromoSize})})},r)),i()})},unexecute:function(){if(null!=n.c){var e=this.pieces[n.c],r=t.cbMakeDisplaySpecForPiece(t,e.p,e);r=$.extend(!0,{base:{visible:!0},"2d":{opacity:1},"3d":{positionEasingUpdate:null}},r),a.updateGadget("piece#"+n.c,r)}var s=this.pieces[this.board[n.f]],c=t.cbMakeDisplaySpecForPiece(t,s.p,s);a.updateGadget("piece#"+s.i,c),i()}}),void 0!==n.cg&&(s[r].validate.cg=n.cg,s[r].execute=function(e){this.cbAnimate(a,t,n,function(){e()})}),s[r].moves.push(n)},this);else if(null==r.pr){var c=[];n.forEach(function(e){void 0!==e.pr&&(void 0===s[e.pr]&&(s[e.pr]={pr:e.pr,moves:[],click:["promo#"+e.pr],validate:{pr:e.pr},cancel:["promo-cancel"],post:i,skipable:!0},c.push(e.pr)),s[e.pr].moves.push(e))},this),c.length>1&&c.forEach(function(e){s[e].view=["promo#"+e]})}return s}}},View.Game.cbCellClass=function(e,a){return"classic-cell "+((a+(a-a%this.g.NBCOLS)/this.g.ROWS)%2?"classic-cell-black":"classic-cell-white")},View.Board.xdPlayedMove=function(e,a,t){a.mOldBoard.cbAnimate(e,a,t,function(){a.MoveShown()})},View.Board.cbAnimate=function(e,a,t,i){function n(){0==--s&&(c&&a.PlaySound("tac"+(1+Math.floor(3*Math.random()))),i())}var r=this,s=1,c=!1,o=this.pieces[this.board[t.f]],l=a.cbMakeDisplaySpec(t.f,o.s),h=a.cbMakeDisplaySpecForPiece(a,t.t,o);for(var d in l){var u=l[d];void 0!==u.z&&function(e){var i=u.z,n=h[e].z,s=r.cbMoveMidZ(a,t,i,n,e),o=i,l=o-s,d=o-n;s!=(i+n)/2&&(c=!0);var m=4*l-2*d,p=-d*d,f=Math.abs(m*m- -4*p),g=(-m-Math.sqrt(f))/-2,b=(-m+Math.sqrt(f))/-2,w=g,v=-w-d;(0==w||-v/(2*w)<0||-v/(2*w)>1)&&(w=b,v=-w-d),h[e].positionEasingUpdate=function(e){var a=(w*e*e+v*e+o)*this.SCALE3D;this.object3d.position.y=a}}(d)}if(c||a.PlaySound("move"+(1+Math.floor(4*Math.random()))),e.updateGadget("piece#"+o.i,h,600,function(){n()}),null!=t.c){s++;var m={positionEasingUpdate:null};switch(a.cbView.captureAnim3d||"movedown"){case"movedown":m.z=-2e3;break;case"scaledown":m.scale=[0,0,0]}var p=this.pieces[t.c];e.updateGadget("piece#"+p.i,{"2d":{opacity:0},"3d":m},600,n)}if(void 0!==t.cg){var u=a.cbVar.castle[t.f+"/"+t.cg],f=u.r[u.r.length-1],o=this.pieces[this.board[t.cg]],h=a.cbMakeDisplaySpecForPiece(a,f,o);s++,e.updateGadget("piece#"+o.i,h,600,function(){n()})}},View.Board.cbMoveMidZ=function(e,a,t,i){return(t+i)/2}}(),function(){View.Game.cbBaseBoard={TEXTURE_CANVAS_CX:1024,TEXTURE_CANVAS_CY:1024,display:function(e,a,t){var i=this;e.getResource=a.getResource,e.createGeometry.call(this,e,function(a){e.createTextureImages.call(i,e,function(n){var r=["diffuse"].concat(e.extraChannels||[]),s={};r.forEach(function(a){var t=document.createElement("canvas");t.width=e.TEXTURE_CANVAS_CX,t.height=e.TEXTURE_CANVAS_CY,s[a]=t}),e.createMaterial.call(i,e,s,function(r){var c=new THREE.Mesh(a,r);e.modifyMesh.call(i,e,c,function(a){e.paint.call(i,e,s,n,function(){t(a)})})})})})},createTextureImages:function(e,a){var t=this,i={},n=0,r=e.texturesImg||{};for(var s in r)n++;if(0==n)a(i);else for(var s in r)!function(s){e.getResource("image|"+t.g.fullPath+r[s],function(e){i[s]=e,0==--n&&a(i)})}(s)},createMaterial:function(e,a,t){var i=new THREE.Texture(a.diffuse);i.needsUpdate=!0;var n={specular:"#050505",shininess:30,map:i};if(a.bump){var r=new THREE.Texture(a.bump);r.needsUpdate=!0,n.bumpMap=r,n.bumpScale=.05}t(new THREE.MeshPhongMaterial(n))},modifyMesh:function(e,a,t){t(a)},prePaint:function(e,a,t,i,n){n()},paint:function(e,a,t,i,n){n()},postPaint:function(e,a,t,i,n){n()},paintChannel:function(e,a,t,i){},draw:function(e,a,t){var i=this;e.getResource=a.getResource,e.createTextureImages.call(this,e,function(a){e.paintChannel.call(i,e,t,a,"diffuse")})}}}(),function(){function e(e){for(var a=JSON.stringify(e),t=0,i=0;i<a.length;i++)t=(t<<5)-t+a.charCodeAt(i),t&=t;return t}var a,t={};View.Game.cbDisplayPieceFn=function(t){var i=this,n=e(t);return function(e,r,s){a=this.getResource;var c=/^piece#([0-9]+)$/.exec(this.gadget.id);if(!c)return null;var o=parseInt(c[1]),l=i.cbCurrentGame();if(o>=l.mBoard.pieces.length)return null;var h=l.mBoard.pieces[o],d=l.cbVar.pieceTypes[h.t].aspect||l.cbVar.pieceTypes[h.t].name,u=d+"_"+n+"_"+h.s,m=this;u!=this._cbKey&&(this._cbKey=u,m.options=r,l.cbMakePiece(t,d,h.s,function(e){m.replaceMesh(e,m.options,s)}))}},View.Game.cbMakePiece=function(a,i,n,r){function s(e,a,t){return a?$.extend(!0,e,a.default,a[t]):{}}if(!a)return void console.error("piece-view: style is not defined");var c=s({},a,i);a[n]&&(c=s(c,a[n],i));var o=e(c),l=t[o];Array.isArray(l)?l.push(r):l?r(new THREE.Mesh(l.geometry,l.material)):(t[o]=[r],c.loadResources.call(this,c,function(e){c.displayPiece.call(this,c,e,function(){var a=t[o];t[o]={geometry:e.geometry,material:e.material},a.forEach(function(a){a(new THREE.Mesh(e.geometry,e.material))})})}))},View.Game.cbClearPieces=function(){t={}},View.Game.cbBasePieceStyle={default:{mesh:{jsFile:function(e,a){a(new THREE.CubeGeometry(1,1,1),new THREE.MeshPhongMaterial({}))},smooth:0,rotateZ:0},loadMesh:function(e,t){"function"==typeof e.mesh.jsFile?e.mesh.jsFile(e,t):a("smoothedfilegeo|"+e.mesh.smooth+"|"+this.g.fullPath+e.mesh.jsFile,t)},loadImages:function(e,t){function i(){0==--r&&t(s)}var n=this,r=1,s={};for(var c in e.materials){var o=e.materials[c].channels;for(var l in o)if(o[l].texturesImg)for(var h in o[l].texturesImg)!function(e,t){r++,a("image|"+n.g.fullPath+t,function(a){s[e]=a,i()})}(h,o[l].texturesImg[h])}i()},loadResources:function(e,a){function t(){0==--s&&a({geometry:n,images:i,textures:{},loadedMaterials:r})}var i,n,r,s=2;e.loadMesh.call(this,e,function(a,i){if(!a._cbZRotated){var s=new THREE.Matrix4;s.makeRotationY(e.mesh.rotateZ*Math.PI/180),a.applyMatrix(s),a._cbZRotated=!0}n=a,r=i,t()}),e.loadImages.call(this,e,function(e){i=e,t()})},displayPiece:function(e,a,t){e.makeMaterials.call(this,e,a),t()},paintTextureImageClip:function(e,a,t,i,n,r,s,c,o){var l=a.canvas.width,h=a.canvas.height;if(n.patternFill&&n.patternFill[r]){var d=n.patternFill[r];a.save();var u=document.createElement("canvas");u.width=l,u.height=h,ctxTmp=u.getContext("2d"),ctxTmp.fillStyle=d,ctxTmp.fillRect(0,0,l,h),ctxTmp.globalCompositeOperation="destination-in",ctxTmp.drawImage(s,c.x,c.y,c.cx,c.cy,0,0,l,h),a.drawImage(u,0,0,l,h,0,0,l,h),a.restore()}else a.drawImage(s,c.x,c.y,c.cx,c.cy,0,0,l,h)},paintTextureImage:function(e,a,t,i,n,r,s,c){var o;o=n.clipping&&n.clipping[r]?n.clipping[r]:{x:0,y:0,cx:s.width,cy:s.height},e.paintTextureImageClip.call(this,e,a,t,i,n,r,s,o,c)},paintTexture:function(e,a,t,i,n){var r=e.materials[t].channels[i];for(var s in r.texturesImg){var c=n.images[s];e.paintTextureImage.call(this,e,a,t,i,r,s,c,n)}},makeMaterialTextures:function(e,a,t){for(var i in e.materials[a].channels){var n=e.materials[a].channels[i],r=document.createElement("canvas");r.width=n.size.cx,r.height=n.size.cy;var s=r.getContext("2d");e.paintTexture.call(this,e,s,a,i,t);var c=new THREE.Texture(r);c.needsUpdate=!0,t.textures[a][i]=c}},makeMaterials:function(e,a){a.textures={};for(var t in e.materials)a.textures[t]={},e.makeMaterialTextures.call(this,e,t,a),e.makeMaterial.call(this,e,t,a)}}},View.Game.cbTokenPieceStyle3D=$.extend(!0,{},View.Game.cbBasePieceStyle,{default:{makeMaterials:function(e,a){a.textures={};for(var t in e.materials)a.textures[t]={},e.makeMaterialTextures.call(this,e,t,a);var i=[];for(var n in a.loadedMaterials){var r=a.loadedMaterials[n].clone(),s=r.name;if(e.materials[s]){$.extend(!0,r,e.materials[s].params);for(var c in e.materials[s].channels)switch(c){case"diffuse":r.map=a.textures[s][c];break;case"bump":r.bumpMap=a.textures[s][c]}}i.push(r)}var o=new THREE.MultiMaterial(i);a.material=o}}}),View.Game.cbUniformPieceStyle3D=$.extend(!0,{},View.Game.cbBasePieceStyle,{default:{makeMaterial:function(e,a,t){var i=e.materials[a].params;i.map=t.textures[a].diffuse,i.normalMap=t.textures[a].normal;var n=e.materials[a].channels.normal.normalScale||1;i.normalScale=new THREE.Vector2(n,n);var r=new THREE.MeshPhongMaterial(i);t.material=r,t.geometry.mergeVertices(),t.geometry.computeVertexNormals()}}}),View.Game.cbPhongPieceStyle3D=$.extend(!0,{},View.Game.cbBasePieceStyle,{default:{phongProperties:{color:"#ffffff",shininess:300,specular:"#ffffff",emissive:"#222222",shading:"undefined"!=typeof THREE?THREE.FlatShading:0},makeMaterials:function(e,a){var t=new THREE.MeshPhongMaterial(e.phongProperties);a.material=t}}})}(),function(){var e=0,a=0,t={};View.Game.cbTargetMesh="/res/ring-target-cylinder-v3.js",View.Game.cbEnsureConstants=function(){a||(a=this.cbVar.geometry.height,e=this.cbVar.geometry.width,console.warn("NBROWS",a,"NBCOLS",e))},View.Game.cbCSize=function(i){this.cbEnsureConstants();var n=t[i.margins.x+"_"+i.margins.y];if(!n){var r,s,c,o,l=2*a+4+2*i.margins.x,h=2*a+4+2*i.margins.y;r=l/h,o=r<1?12e3*r/l:12e3/r/h,s=(2*a+4+2*i.margins.x)*o,c=(2*a+4+2*i.margins.y)*o,console.warn("width",s,"height",c),n={cy:o,pieceCx:o,pieceCy:o,ratio:r,width:s,height:c,angle:360/e,angleRad:2*Math.PI/e,shiftAngleRad:Math.PI/e,center:4},t[i.margins.x+"_"+i.margins.y]=n}return n},View.Game.cbCircularBoard=$.extend({},View.Game.cbBaseBoard,{notationMode:"in",coordsFn:function(t){return t=t||{},t.margins=t.margins||{x:0,y:0},function(i){var n=this.cbCSize(t),r=i%e,s=a-1-(i-r)/e;return-1==this.mViewAs&&(r=e-1-r),{x:(n.center/2+s+.5)*n.cy*Math.cos(r*n.angleRad+n.shiftAngleRad)*this.mViewAs,y:(n.center/2+s+.5)*n.cy*Math.sin(r*n.angleRad+n.shiftAngleRad),z:0}}},createGeometry:function(e,a){var t=this.cbCSize(e),i=t.width/1e3,n=t.height/1e3,r=new THREE.PlaneGeometry(i,n),s=new THREE.Matrix4;s.makeRotationX(-Math.PI/2),r.applyMatrix(s);for(var c=r.faceVertexUvs[0],o=0;o<c.length;o++)for(var l=0;l<c[o].length;l++)t.ratio<1&&(c[o][l].x=c[o][l].x*t.ratio+(1-t.ratio)/2),t.ratio>1&&(c[o][l].y=c[o][l].y/t.ratio+(1-1/t.ratio)/2);a(r)},paintBackground:function(e,a,t,i,n,r){t.boardBG&&a.drawImage(t.boardBG,-n/2,-r/2,n,r)},paintChannel:function(e,a,t,i){var n=this.cbCSize(e);e.paintBackground.call(this,e,a,t,i,n.width,n.height)},paint:function(e,a,t,i){for(var n in a){var r=a[n].getContext("2d");r.save(),r.scale(e.TEXTURE_CANVAS_CX/12e3,e.TEXTURE_CANVAS_CY/12e3),r.translate(6e3,6e3),e.paintChannel.call(this,e,r,t,n),r.restore()}i()}}),View.Game.cbCircularBoardClassic=$.extend({},View.Game.cbCircularBoard,{colorFill:{".":"rgba(160,150,150,0.9)","#":"rgba(0,0,0,1)"," ":"rgba(0,0,0,0)"},texturesImg:{boardBG:"/res/images/wood.jpg"},modifyMesh:function(e,a,t){function i(e,a){var t=new THREE.Shape;return t.moveTo(-e/2,-a/2),t.lineTo(e/2,-a/2),t.lineTo(e/2,a/2),t.lineTo(-e/2,a/2),t}var n=this.cbCSize(e),r=n.width/1e3,s=n.height/1e3,c=i(r+.5+.1,s+.5+.1),o=i(r+.1,s+.1);c.holes.push(o);var l={amount:.4,steps:1,bevelSize:.1,bevelThickness:.04,bevelSegments:1},h=new THREE.ExtrudeGeometry(c,l),d=new THREE.Matrix4;d.makeRotationX(-Math.PI/2),h.applyMatrix(d),blackMat=new THREE.MeshPhongMaterial({color:"#000000",shininess:500,specular:"#888888",emissive:"#000000"});var u=new THREE.Mesh(h,blackMat);u.position.y=-l.amount-.01,a.add(u);var m=new THREE.Mesh(new THREE.BoxGeometry(r,s,.1),blackMat);m.rotation.x=Math.PI/2,m.position.y=-.1,a.add(m),t(a)},paintCell:function(e,a,t,i,n,r,s,c,o,l,h){a.strokeStyle="rgba(0,0,0,1)",a.lineWidth=15,a.fillStyle="bump"==i?"#ffffff":e.colorFill[n],a.beginPath(),a.moveTo(c*Math.cos(l-h/2),c*Math.sin(l-h/2)),a.lineTo(o*Math.cos(l-h/2),o*Math.sin(l-h/2)),a.arc(0,0,o,l-h/2,l+h/2,!1),a.lineTo(c*Math.cos(l+h/2),c*Math.sin(l+h/2)),a.arc(0,0,c,l+h/2,l-h/2,!0),a.closePath(),a.stroke(),a.fill()},paintCells:function(t,i,n,r){for(var s=this.cbCSize(t),c=t.coordsFn(t),o=0;o<a;o++)for(var l=0;l<e;l++){var h=1==this.mViewAs?l+o*e:e*a-(1+l+o*e),d=c.call(this,h),u=this.cbView.boardLayout[a-o-1][l],m=d.x,p=d.y,f=(s.center/2+o)*s.cy,g=(s.center/2+o+1)*s.cy,b=Math.atan2(p,m);t.paintCell.call(this,t,i,n,r,u,m,p,f,g,b,s.angleRad)}},paintLines:function(e,a,t,i){},paintChannel:function(e,a,t,i){var n=this.cbCSize(e);e.paintBackground.call(this,e,a,t,i,n.width,n.height),e.paintCells.call(this,e,a,t,i),e.paintLines.call(this,e,a,t,i),this.mNotation&&e.paintNotation.call(this,e,a,i)},paintNotation:function(e,a,t){var i=this.cbCSize(e);switch(a.textAlign="center",a.textBaseline="middle",a.fillStyle="#000000",a.font=Math.ceil(i.cx/3)+"px Monospace",e.notationMode){case"out":e.paintOutNotation.apply(this,arguments);break;case"in":e.paintInNotation.apply(this,arguments)}},paintOutNotation:function(t,i,n){for(var r=this.cbCSize(t),s=0;s<a;s++){var c=a-s;this.mViewAs<0&&(c=s+1);var o=-(e/2+t.margins.x/2)*r.cx,l=(s-a/2+.5)*r.cy;i.fillText(c,o,l)}for(var h=0;h<e;h++){var d=h;this.mViewAs<0&&(d=e-h-1);var o=(h-e/2+.5)*r.cx,l=(a/2+t.margins.y/2)*r.cy;i.fillText(String.fromCharCode(97+d),o,l)}},paintInNotation:function(t,i,n){var r=this.cbCSize(t),s=t.coordsFn(t),c=t.colorFill;i.font=Math.ceil(r.cy/5)+"px Monospace";for(var o=this.cbVar.geometry,l=0;l<a;l++)for(var h=0;h<e;h++){var d=h+l*e,u=s.call(this,d),m=this.cbView.boardLayout[l][h];if(" "!=m){switch(i.fillStyle="rgba(0,0,0,0)","bump"==n&&(i.fillStyle=c["."]),m){case".":i.fillStyle="bump"==n?c["."]:c["#"];break;case"#":i.fillStyle=c["."]}var p=u.x,f=u.y;t.notationDebug?i.fillText(d,p,f):i.fillText(o.PosName(d),p,f)}}}}),View.Game.cbCircularBoardClassic2D=$.extend({},View.Game.cbCircularBoardClassic,{colorFill:{".":"#F1D9B3","#":"#C7885D"," ":"rgba(0,0,0,0)"},margins:{x:0,y:0}}),View.Game.cbCircularBoardClassic3D=$.extend({},View.Game.cbCircularBoardClassic,{margins:{x:.3,y:.3},extraChannels:["bump"]}),View.Game.cbCircularBoardClassic2D=$.extend({},View.Game.cbCircularBoardClassic2D,{margins:{x:.1,y:.1}}),View.Board.cbMoveMidZ=function(e,a,t,i){return Math.max(t,i)+1500}}(),function(){var e={cx:512,cy:512};View.Game.cbStauntonWoodenPieceStyle=function(e){return this.cbStauntonPieceStyle($.extend(!0,{default:{"2d":{file:this.mViewOptions.fullPath+"/res/images/woodenpieces2d2.png"}}},e))},View.Game.cbStauntonPieceStyle=function(e){return $.extend(!0,{1:{default:{"2d":{clipy:0}}},"-1":{default:{"2d":{clipy:100}}},default:{"3d":{display:this.cbDisplayPieceFn(this.cbStauntonPieceStyle3D)},"2d":{file:this.mViewOptions.fullPath+"/res/images/wikipedia.png",clipwidth:100,clipheight:100}},pawn:{"2d":{clipx:0}},knight:{"2d":{clipx:100}},bishop:{"2d":{clipx:200}},rook:{"2d":{clipx:300}},queen:{"2d":{clipx:400}},king:{"2d":{clipx:500}}},e)},View.Game.cbStauntonPieceStyle3D=$.extend(!0,{},View.Game.cbUniformPieceStyle3D,{default:{mesh:{normalScale:1,rotateZ:180},materials:{mat0:{channels:{diffuse:{size:e},normal:{size:e}}}}},1:{default:{materials:{mat0:{params:{specular:131586,shininess:150}}}}},"-1":{default:{materials:{mat0:{params:{specular:526344,shininess:100}}},paintTextureImageClip:function(e,a,t,i,n,r,s,c,o){var l=a.canvas.width,h=a.canvas.height;"diffuse"==i?(a.globalCompositeOperation="normal",a.drawImage(s,c.x,c.y,c.cx,c.cy,0,0,l,h),a.globalCompositeOperation="multiply",a.drawImage(s,c.x,c.y,c.cx,c.cy,0,0,l,h),a.drawImage(s,c.x,c.y,c.cx,c.cy,0,0,l,h),a.globalCompositeOperation="hue",a.fillStyle="rgba(0,0,0,0.7)",a.fillRect(0,0,512,512)):a.drawImage(s,c.x,c.y,c.cx,c.cy,0,0,l,h)}}},pawn:{mesh:{jsFile:"/res/staunton/pawn/pawn-classic.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/staunton/pawn/pawn-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/staunton/pawn/pawn-normalmap.jpg"}}}}}},knight:{mesh:{jsFile:"/res/staunton/knight/knight.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/staunton/knight/knight-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/staunton/knight/knight-normalmap.jpg"}}}}}},bishop:{mesh:{jsFile:"/res/staunton/bishop/bishop.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/staunton/bishop/bishop-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/staunton/bishop/bishop-normalmap.jpg"}}}}}},rook:{mesh:{jsFile:"/res/staunton/rook/rook.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/staunton/rook/rook-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/staunton/rook/rook-normalmap.jpg"}}}}}},queen:{mesh:{jsFile:"/res/staunton/queen/queen.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/staunton/queen/queen-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/staunton/queen/queen-normalmap.jpg"}}}}}},king:{mesh:{jsFile:"/res/staunton/king/king.js"},materials:{mat0:{channels:{diffuse:{texturesImg:{diffImg:"/res/staunton/king/king-diffusemap.jpg"}},normal:{texturesImg:{normalImg:"/res/staunton/king/king-normalmap.jpg"}}}}}}})}(),function(){View.Game.cbDefineView=function(){var e=$.extend(!0,{},this.cbCircularBoardClassic3D,{}),a=$.extend(!0,{},this.cbCircularBoardClassic2D,{texturesImg:{boardBG:"/res/images/whitebg.png"}});return{coords:{"2d":this.cbCircularBoard.coordsFn.call(this,a),"3d":this.cbCircularBoard.coordsFn.call(this,e)},boardLayout:[".#.#.#.#.#.#.#.#","#.#.#.#.#.#.#.#.",".#.#.#.#.#.#.#.#","#.#.#.#.#.#.#.#."],board:{"2d":{draw:this.cbDrawBoardFn(a)},"3d":{display:this.cbDisplayBoardFn(e)}},clicker:{"2d":{width:1e3,height:1e3},"3d":{scale:[.5,.5,.5]}},pieces:this.cbStauntonPieceStyle({default:{"2d":{width:1e3,height:1e3},"3d":{scale:[.35,.35,.35]}}})}}}();