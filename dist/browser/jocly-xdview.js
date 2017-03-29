/*
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog 
 *
 *	Subdivision Geometry Modifier 
 *		using Catmull-Clark Subdivision Surfaces
 *		for creating smooth geometry meshes
 *
 *	Note: a modifier modifies vertices and faces of geometry,
 *		so use geometry.clone() if original geometry needs to be retained
 * 
 *	Readings: 
 *		http://en.wikipedia.org/wiki/Catmull%E2%80%93Clark_subdivision_surface
 *		http://www.rorydriscoll.com/2008/08/01/catmull-clark-subdivision-the-basics/
 *		http://xrt.wikidot.com/blog:31
 *		"Subdivision Surfaces in Character Animation"
 *
 *		(on boundary edges)
 *		http://rosettacode.org/wiki/Catmull%E2%80%93Clark_subdivision_surface
 *		https://graphics.stanford.edu/wikis/cs148-09-summer/Assignment3Description
 *
 *	Supports:
 *		Closed and Open geometries.
 *
 *	TODO:
 *		crease vertex and "semi-sharp" features
 *		selective subdivision
 */

THREE.SubdivisionModifier = function ( subdivisions ) {

	this.subdivisions = (subdivisions === undefined ) ? 1 : subdivisions;

	// Settings
	this.useOldVertexColors = false;
	this.supportUVs = true;
	this.debug = false;

};

// Applies the "modify" pattern
THREE.SubdivisionModifier.prototype.modify = function ( geometry ) {

	var repeats = this.subdivisions;

	while ( repeats-- > 0 ) {
		this.smooth( geometry );
	}

};

/// REFACTORING THIS OUT

THREE.GeometryUtils.orderedKey = function ( a, b ) {

	return Math.min( a, b ) + "_" + Math.max( a, b );

};


// Returns a hashmap - of { edge_key: face_index }
THREE.GeometryUtils.computeEdgeFaces = function ( geometry ) {

	var i, il, v1, v2, j, k,
		face, faceIndices, faceIndex,
		edge,
		hash,
		edgeFaceMap = {};

	var orderedKey = THREE.GeometryUtils.orderedKey;

	function mapEdgeHash( hash, i ) {

		if ( edgeFaceMap[ hash ] === undefined ) {

			edgeFaceMap[ hash ] = [];

		}

		edgeFaceMap[ hash ].push( i );
	}


	// construct vertex -> face map

	for( i = 0, il = geometry.faces.length; i < il; i ++ ) {

		face = geometry.faces[ i ];

		if ( face instanceof THREE.Face3 ) {

			hash = orderedKey( face.a, face.b );
			mapEdgeHash( hash, i );

			hash = orderedKey( face.b, face.c );
			mapEdgeHash( hash, i );

			hash = orderedKey( face.c, face.a );
			mapEdgeHash( hash, i );

		} else if ( face instanceof THREE.Face4 ) {

			hash = orderedKey( face.a, face.b );
			mapEdgeHash( hash, i );

			hash = orderedKey( face.b, face.c );
			mapEdgeHash( hash, i );

			hash = orderedKey( face.c, face.d );
			mapEdgeHash( hash, i );

			hash = orderedKey( face.d, face.a );
			mapEdgeHash( hash, i );

		}

	}

	// extract faces

	// var edges = [];
	// 
	// var numOfEdges = 0;
	// for (i in edgeFaceMap) {
	// 	numOfEdges++;
	//
	// 	edge = edgeFaceMap[i];
	// 	edges.push(edge);
	//
	// }

	//debug('edgeFaceMap', edgeFaceMap, 'geometry.edges',geometry.edges, 'numOfEdges', numOfEdges);

	return edgeFaceMap;

}

/////////////////////////////

// Performs an iteration of Catmull-Clark Subdivision
THREE.SubdivisionModifier.prototype.smooth = function ( oldGeometry ) {

	//debug( 'running smooth' );

	// New set of vertices, faces and uvs
	var newVertices = [], newFaces = [], newUVs = [];

	function v( x, y, z ) {
		newVertices.push( new THREE.Vector3( x, y, z ) );
	}

	var scope = this;
	var orderedKey = THREE.GeometryUtils.orderedKey;
	var computeEdgeFaces = THREE.GeometryUtils.computeEdgeFaces;

	function assert() {

		if (scope.debug && console && console.assert) console.assert.apply(console, arguments);

	}

	function debug() {

		if (scope.debug) console.log.apply(console, arguments);

	}

	function warn() {

		if (console)
		console.log.apply(console, arguments);

	}

	function f4( a, b, c, d, oldFace, orders, facei ) {

		// TODO move vertex selection over here!

		var newFace = new THREE.Face4( a, b, c, d, null, oldFace.color, oldFace.materialIndex );

		if (scope.useOldVertexColors) {

			newFace.vertexColors = []; 

			var color, tmpColor, order;

			for (var i=0;i<4;i++) {

				order = orders[i];

				color = new THREE.Color(),
				color.setRGB(0,0,0);

				for (var j=0, jl=0; j<order.length;j++) {
					tmpColor = oldFace.vertexColors[order[j]-1];
					color.r += tmpColor.r;
					color.g += tmpColor.g;
					color.b += tmpColor.b;
				}

				color.r /= order.length;
				color.g /= order.length;
				color.b /= order.length;

				newFace.vertexColors[i] = color;

			}

		}

		newFaces.push( newFace );

		if (scope.supportUVs) {

			var aUv = [
				getUV(a, ''),
				getUV(b, facei),
				getUV(c, facei),
				getUV(d, facei)
			];

			if (!aUv[0]) debug('a :( ', a+':'+facei);
			else if (!aUv[1]) debug('b :( ', b+':'+facei);
			else if (!aUv[2]) debug('c :( ', c+':'+facei);
			else if (!aUv[3]) debug('d :( ', d+':'+facei);
			else 
				newUVs.push( aUv );

		}
	}

	var originalPoints = oldGeometry.vertices;
	var originalFaces = oldGeometry.faces;
	var originalVerticesLength = originalPoints.length;

	var newPoints = originalPoints.concat(); // New set of vertices to work on

	var facePoints = [], // these are new points on exisiting faces
		edgePoints = {}; // these are new points on exisiting edges

	var sharpEdges = {}, sharpVertices = []; // Mark edges and vertices to prevent smoothening on them
	// TODO: handle this correctly.

	var uvForVertices = {}; // Stored in {vertex}:{old face} format


	function debugCoreStuff() {

		console.log('facePoints', facePoints, 'edgePoints', edgePoints);
		console.log('edgeFaceMap', edgeFaceMap, 'vertexEdgeMap', vertexEdgeMap);

	}

	function getUV(vertexNo, oldFaceNo) {
		var j,jl;

		var key = vertexNo+':'+oldFaceNo;
		var theUV = uvForVertices[key];

		if (!theUV) {
			if (vertexNo>=originalVerticesLength && vertexNo < (originalVerticesLength + originalFaces.length)) {
				debug('face pt');
			} else {
				debug('edge pt');
			}

			warn('warning, UV not found for', key);

			return null;
		}

		return theUV;
 
		// Original faces -> Vertex Nos. 
		// new Facepoint -> Vertex Nos.
		// edge Points

	}

	function addUV(vertexNo, oldFaceNo, value) {

		var key = vertexNo+':'+oldFaceNo;
		if (!(key in uvForVertices)) {
			uvForVertices[key] = value;
		} else {
			warn('dup vertexNo', vertexNo, 'oldFaceNo', oldFaceNo, 'value', value, 'key', key, uvForVertices[key]);
		}
	}

	// Step 1
	//	For each face, add a face point
	//	Set each face point to be the centroid of all original points for the respective face.
	// debug(oldGeometry);
	var i, il, j, jl, face;

	// For Uvs
	var uvs = oldGeometry.faceVertexUvs[0];
	var abcd = 'abcd', vertice;

	debug('originalFaces, uvs, originalVerticesLength', originalFaces.length, uvs.length, originalVerticesLength);

	if (scope.supportUVs)

	for (i=0, il = uvs.length; i<il; i++ ) {

		for (j=0,jl=uvs[i].length;j<jl;j++) {

			vertice = originalFaces[i][abcd.charAt(j)];
			addUV(vertice, i, uvs[i][j]);

		}

	}

	if (uvs.length == 0) scope.supportUVs = false;

	// Additional UVs check, if we index original 
	var uvCount = 0;
	for (var u in uvForVertices) {
		uvCount++;
	}
	if (!uvCount) {
		scope.supportUVs = false;
		debug('no uvs');
	}

	var avgUv ;

	for (i=0, il = originalFaces.length; i<il ;i++) {

		face = originalFaces[ i ];
		facePoints.push( face.centroid );
		newPoints.push( face.centroid );

		if (!scope.supportUVs) continue;

		// Prepare subdivided uv

		avgUv = new THREE.Vector2();

		if ( face instanceof THREE.Face3 ) {

			avgUv.x = getUV( face.a, i ).x + getUV( face.b, i ).x + getUV( face.c, i ).x;
			avgUv.y = getUV( face.a, i ).y + getUV( face.b, i ).y + getUV( face.c, i ).y;
			avgUv.x /= 3;
			avgUv.y /= 3;

		} else if ( face instanceof THREE.Face4 ) {

			avgUv.x = getUV( face.a, i ).x + getUV( face.b, i ).x + getUV( face.c, i ).x + getUV( face.d, i ).x;
			avgUv.y = getUV( face.a, i ).y + getUV( face.b, i ).y + getUV( face.c, i ).y + getUV( face.d, i ).y;
			avgUv.x /= 4;
			avgUv.y /= 4;

		}

		addUV(originalVerticesLength + i, '', avgUv);

	}

	// Step 2
	//	For each edge, add an edge point.
	//	Set each edge point to be the average of the two neighbouring face points and its two original endpoints.

	var edgeFaceMap = computeEdgeFaces ( oldGeometry ); // Edge Hash -> Faces Index  eg { edge_key: [face_index, face_index2 ]}
	var edge, faceIndexA, faceIndexB, avg;

	// debug('edgeFaceMap', edgeFaceMap);

	var edgeCount = 0;

	var edgeVertex, edgeVertexA, edgeVertexB;

	////

	var vertexEdgeMap = {}; // Gives edges connecting from each vertex
	var vertexFaceMap = {}; // Gives faces connecting from each vertex

	function addVertexEdgeMap(vertex, edge) {

		if (vertexEdgeMap[vertex]===undefined) {

			vertexEdgeMap[vertex] = [];

		}

		vertexEdgeMap[vertex].push(edge);
	}

	function addVertexFaceMap(vertex, face, edge) {

		if (vertexFaceMap[vertex]===undefined) {

			vertexFaceMap[vertex] = {};

		}

		vertexFaceMap[vertex][face] = edge;
		// vertexFaceMap[vertex][face] = null;
	}

	// Prepares vertexEdgeMap and vertexFaceMap
	for (i in edgeFaceMap) { // This is for every edge
		edge = edgeFaceMap[i];

		edgeVertex = i.split('_');
		edgeVertexA = edgeVertex[0];
		edgeVertexB = edgeVertex[1];

		// Maps an edgeVertex to connecting edges
		addVertexEdgeMap(edgeVertexA, [edgeVertexA, edgeVertexB] );
		addVertexEdgeMap(edgeVertexB, [edgeVertexA, edgeVertexB] );

		for (j=0,jl=edge.length;j<jl;j++) {

			face = edge[j];
			addVertexFaceMap(edgeVertexA, face, i);
			addVertexFaceMap(edgeVertexB, face, i);

		}

		// {edge vertex: { face1: edge_key, face2: edge_key.. } }

		// this thing is fishy right now.
		if (edge.length < 2) {

			// edge is "sharp";
			sharpEdges[i] = true;
			sharpVertices[edgeVertexA] = true;
			sharpVertices[edgeVertexB] = true;

		}

	}

	for (i in edgeFaceMap) {

		edge = edgeFaceMap[i];

		faceIndexA = edge[0]; // face index a
		faceIndexB = edge[1]; // face index b

		edgeVertex = i.split('_');
		edgeVertexA = edgeVertex[0];
		edgeVertexB = edgeVertex[1];

		avg = new THREE.Vector3();

		//debug(i, faceIndexB,facePoints[faceIndexB]);

		assert(edge.length > 0, 'an edge without faces?!');

		if (edge.length==1) {

			avg.add( originalPoints[ edgeVertexA ] );
			avg.add( originalPoints[ edgeVertexB ] );
			avg.multiplyScalar( 0.5 );

			sharpVertices[newPoints.length] = true;

		} else {

			avg.add( facePoints[ faceIndexA ] );
			avg.add( facePoints[ faceIndexB ] );

			avg.add( originalPoints[ edgeVertexA ] );
			avg.add( originalPoints[ edgeVertexB ] );

			avg.multiplyScalar( 0.25 );

		}

		edgePoints[i] = originalVerticesLength + originalFaces.length + edgeCount;

		newPoints.push( avg );

		edgeCount ++;

		if (!scope.supportUVs) {
			continue;
		}

		// Prepare subdivided uv

		avgUv = new THREE.Vector2();

		avgUv.x = getUV(edgeVertexA, faceIndexA).x + getUV(edgeVertexB, faceIndexA).x;
		avgUv.y = getUV(edgeVertexA, faceIndexA).y + getUV(edgeVertexB, faceIndexA).y;
		avgUv.x /= 2;
		avgUv.y /= 2;

		addUV(edgePoints[i], faceIndexA, avgUv);

		if (edge.length>=2) {
			assert(edge.length == 2, 'did we plan for more than 2 edges?');
			avgUv = new THREE.Vector2();

			avgUv.x = getUV(edgeVertexA, faceIndexB).x + getUV(edgeVertexB, faceIndexB).x;
			avgUv.y = getUV(edgeVertexA, faceIndexB).y + getUV(edgeVertexB, faceIndexB).y;
			avgUv.x /= 2;
			avgUv.y /= 2;

			addUV(edgePoints[i], faceIndexB, avgUv);
		}

	}

	debug('-- Step 2 done');

	// Step 3
	//	For each face point, add an edge for every edge of the face, 
	//	connecting the face point to each edge point for the face.

	var facePt, currentVerticeIndex;

	var hashAB, hashBC, hashCD, hashDA, hashCA;

	var abc123 = ['123', '12', '2', '23'];
	var bca123 = ['123', '23', '3', '31'];
	var cab123 = ['123', '31', '1', '12'];
	var abc1234 = ['1234', '12', '2', '23'];
	var bcd1234 = ['1234', '23', '3', '34'];
	var cda1234 = ['1234', '34', '4', '41'];
	var dab1234 = ['1234', '41', '1', '12'];

	for (i=0, il = facePoints.length; i<il ;i++) { // for every face
		facePt = facePoints[i];
		face = originalFaces[i];
		currentVerticeIndex = originalVerticesLength+ i;

		if ( face instanceof THREE.Face3 ) {

			// create 3 face4s

			hashAB = orderedKey( face.a, face.b );
			hashBC = orderedKey( face.b, face.c );
			hashCA = orderedKey( face.c, face.a );

			f4( currentVerticeIndex, edgePoints[hashAB], face.b, edgePoints[hashBC], face, abc123, i );
			f4( currentVerticeIndex, edgePoints[hashBC], face.c, edgePoints[hashCA], face, bca123, i );
			f4( currentVerticeIndex, edgePoints[hashCA], face.a, edgePoints[hashAB], face, cab123, i );

		} else if ( face instanceof THREE.Face4 ) {

			// create 4 face4s

			hashAB = orderedKey( face.a, face.b );
			hashBC = orderedKey( face.b, face.c );
			hashCD = orderedKey( face.c, face.d );
			hashDA = orderedKey( face.d, face.a );

			f4( currentVerticeIndex, edgePoints[hashAB], face.b, edgePoints[hashBC], face, abc1234, i );
			f4( currentVerticeIndex, edgePoints[hashBC], face.c, edgePoints[hashCD], face, bcd1234, i );
			f4( currentVerticeIndex, edgePoints[hashCD], face.d, edgePoints[hashDA], face, cda1234, i );
			f4( currentVerticeIndex, edgePoints[hashDA], face.a, edgePoints[hashAB], face, dab1234, i );


		} else {

			debug('face should be a face!', face);

		}

	}

	newVertices = newPoints;

	// Step 4

	//	For each original point P, 
	//		take the average F of all n face points for faces touching P, 
	//		and take the average R of all n edge midpoints for edges touching P, 
	//		where each edge midpoint is the average of its two endpoint vertices. 
	//	Move each original point to the point


	var F = new THREE.Vector3();
	var R = new THREE.Vector3();

	var n;
	for (i=0, il = originalPoints.length; i<il; i++) {
		// (F + 2R + (n-3)P) / n

		if (vertexEdgeMap[i]===undefined) continue;

		F.set(0,0,0);
		R.set(0,0,0);
		var newPos =  new THREE.Vector3(0,0,0);

		var f = 0; // this counts number of faces, original vertex is connected to (also known as valance?)
		for (j in vertexFaceMap[i]) {
			F.add(facePoints[j]);
			f++;
		}

		var sharpEdgeCount = 0;

		n = vertexEdgeMap[i].length; // given a vertex, return its connecting edges

		// Are we on the border?
		var boundary_case = f != n;

		// if (boundary_case) {
		// 	console.error('moo', 'o', i, 'faces touched', f, 'edges',  n, n == 2);
		// }

		for (j=0;j<n;j++) {
			if (
				sharpEdges[
					orderedKey(vertexEdgeMap[i][j][0],vertexEdgeMap[i][j][1])
				]) {
					sharpEdgeCount++;
				}
		}

		// if ( sharpEdgeCount==2 ) {
		// 	continue;
		// 	// Do not move vertex if there's 2 connecting sharp edges.
		// }

		/*
		if (sharpEdgeCount>2) {
			// TODO
		}
		*/

		F.divideScalar(f);


		var boundary_edges = 0;

		if (boundary_case) {

			var bb_edge;
			for (j=0; j<n;j++) {
				edge = vertexEdgeMap[i][j];
				bb_edge = edgeFaceMap[orderedKey(edge[0], edge[1])].length == 1
				if (bb_edge) {
					var midPt = originalPoints[edge[0]].clone().add(originalPoints[edge[1]]).divideScalar(2);
					R.add(midPt);
					boundary_edges++;
				}
			}

			R.divideScalar(4);
			// console.log(j + ' --- ' + n + ' --- ' + boundary_edges);
			assert(boundary_edges == 2, 'should have only 2 boundary edges');

		} else {
			for (j=0; j<n;j++) {
				edge = vertexEdgeMap[i][j];
				var midPt = originalPoints[edge[0]].clone().add(originalPoints[edge[1]]).divideScalar(2);
				R.add(midPt);
			}

			R.divideScalar(n);
		}

		// Sum the formula
		newPos.add(originalPoints[i]);


		if (boundary_case) {

			newPos.divideScalar(2);
			newPos.add(R);

		} else {

			newPos.multiplyScalar(n - 3);

			newPos.add(F);
			newPos.add(R.multiplyScalar(2));
			newPos.divideScalar(n);

		}

		newVertices[i] = newPos;

	}

	var newGeometry = oldGeometry; // Let's pretend the old geometry is now new :P

	newGeometry.vertices = newVertices;
	newGeometry.faces = newFaces;
	newGeometry.faceVertexUvs[ 0 ] = newUVs;

	delete newGeometry.__tmpVertices; // makes __tmpVertices undefined :P

	newGeometry.computeCentroids();
	newGeometry.computeFaceNormals();
	newGeometry.computeVertexNormals();

};

// tween.js r5 - http://github.com/sole/tween.js
var TWEEN = TWEEN || function() {
	var a, e, c = 60, b = false, h = [];
	return {
		setFPS : function(f) {
			c = f || 60
		},
		start : function(f) {
			arguments.length != 0 && this.setFPS(f);
			e = setInterval(this.update, 1E3 / c)
		},
		stop : function() {
			clearInterval(e)
		},
		setAutostart : function(f) {
			(b = f) && !e && this.start()
		},
		add : function(f) {
			h.push(f);
			b && !e && this.start()
		},
		getAll : function() {
			return h
		},
		removeAll : function() {
			h = []
		},
		remove : function(f) {
			a = h.indexOf(f);
			a !== -1 && h.splice(a, 1)
		},
		update : function(f) {
			a = 0;
			num_tweens = h.length;
			for (f = f || Date.now(); a < num_tweens;)
				if (h[a].update(f))
					a++;
				else {
					h.splice(a, 1);
					num_tweens--
				}
			num_tweens == 0 && b == true && this.stop()
		}
	}
}();
TWEEN.Tween = function(a) {
	var e = {}, c = {}, b = {}, h = 1E3, f = 0, j = null, n = TWEEN.Easing.Linear.EaseNone, k = null, l = null, m = null;
	this.to = function(d, g) {
		if (g !== null)
			h = g;
		for ( var i in d)
			if (a[i] !== null)
				b[i] = d[i];
		return this
	};
	this.start = function(d) {
		TWEEN.add(this);
		j = d ? d + f : Date.now() + f;
		for ( var g in b)
			if (a[g] !== null) {
				e[g] = a[g];
				c[g] = b[g] - a[g]
			}
		return this
	};
	this.stop = function() {
		TWEEN.remove(this);
		return this
	};
	this.delay = function(d) {
		f = d;
		return this
	};
	this.easing = function(d) {
		n = d;
		return this
	};
	this.chain = function(d) {
		k = d
	};
	this.onUpdate = function(d) {
		l = d;
		return this
	};
	this.onComplete = function(d) {
		m = function() {
			var $this=this;
			setTimeout(function() {
				d.call($this);				
			},0);
		}
		return this
	};
	this.update = function(d) {
		var g, i;
		if (d < j)
			return true;
		d = (d - j) / h;
		d = d > 1 ? 1 : d;
		i = n(d);
		for (g in c)
			a[g] = e[g] + c[g] * i;
		l !== null && l.call(a, i);
		if (d == 1) {
			m !== null && m.call(a);
			k !== null && k.start();
			return false
		}
		return true
	}
};
TWEEN.Easing = {
	Linear : {},
	Quadratic : {},
	Cubic : {},
	Quartic : {},
	Quintic : {},
	Sinusoidal : {},
	Exponential : {},
	Circular : {},
	Elastic : {},
	Back : {},
	Bounce : {}
};
TWEEN.Easing.Linear.EaseNone = function(a) {
	return a
};
TWEEN.Easing.Quadratic.EaseIn = function(a) {
	return a * a
};
TWEEN.Easing.Quadratic.EaseOut = function(a) {
	return -a * (a - 2)
};
TWEEN.Easing.Quadratic.EaseInOut = function(a) {
	if ((a *= 2) < 1)
		return 0.5 * a * a;
	return -0.5 * (--a * (a - 2) - 1)
};
TWEEN.Easing.Cubic.EaseIn = function(a) {
	return a * a * a
};
TWEEN.Easing.Cubic.EaseOut = function(a) {
	return --a * a * a + 1
};
TWEEN.Easing.Cubic.EaseInOut = function(a) {
	if ((a *= 2) < 1)
		return 0.5 * a * a * a;
	return 0.5 * ((a -= 2) * a * a + 2)
};
TWEEN.Easing.Quartic.EaseIn = function(a) {
	return a * a * a * a
};
TWEEN.Easing.Quartic.EaseOut = function(a) {
	return -(--a * a * a * a - 1)
};
TWEEN.Easing.Quartic.EaseInOut = function(a) {
	if ((a *= 2) < 1)
		return 0.5 * a * a * a * a;
	return -0.5 * ((a -= 2) * a * a * a - 2)
};
TWEEN.Easing.Quintic.EaseIn = function(a) {
	return a * a * a * a * a
};
TWEEN.Easing.Quintic.EaseOut = function(a) {
	return (a -= 1) * a * a * a * a + 1
};
TWEEN.Easing.Quintic.EaseInOut = function(a) {
	if ((a *= 2) < 1)
		return 0.5 * a * a * a * a * a;
	return 0.5 * ((a -= 2) * a * a * a * a + 2)
};
TWEEN.Easing.Sinusoidal.EaseIn = function(a) {
	return -Math.cos(a * Math.PI / 2) + 1
};
TWEEN.Easing.Sinusoidal.EaseOut = function(a) {
	return Math.sin(a * Math.PI / 2)
};
TWEEN.Easing.Sinusoidal.EaseInOut = function(a) {
	return -0.5 * (Math.cos(Math.PI * a) - 1)
};
TWEEN.Easing.Exponential.EaseIn = function(a) {
	return a == 0 ? 0 : Math.pow(2, 10 * (a - 1))
};
TWEEN.Easing.Exponential.EaseOut = function(a) {
	return a == 1 ? 1 : -Math.pow(2, -10 * a) + 1
};
TWEEN.Easing.Exponential.EaseInOut = function(a) {
	if (a == 0)
		return 0;
	if (a == 1)
		return 1;
	if ((a *= 2) < 1)
		return 0.5 * Math.pow(2, 10 * (a - 1));
	return 0.5 * (-Math.pow(2, -10 * (a - 1)) + 2)
};
TWEEN.Easing.Circular.EaseIn = function(a) {
	return -(Math.sqrt(1 - a * a) - 1)
};
TWEEN.Easing.Circular.EaseOut = function(a) {
	return Math.sqrt(1 - --a * a)
};
TWEEN.Easing.Circular.EaseInOut = function(a) {
	if ((a /= 0.5) < 1)
		return -0.5 * (Math.sqrt(1 - a * a) - 1);
	return 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
};
TWEEN.Easing.Elastic.EaseIn = function(a) {
	var e, c = 0.1, b = 0.4;
	if (a == 0)
		return 0;
	if (a == 1)
		return 1;
	b || (b = 0.3);
	if (!c || c < 1) {
		c = 1;
		e = b / 4
	} else
		e = b / (2 * Math.PI) * Math.asin(1 / c);
	return -(c * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - e) * 2 * Math.PI
			/ b))
};
TWEEN.Easing.Elastic.EaseOut = function(a) {
	var e, c = 0.1, b = 0.4;
	if (a == 0)
		return 0;
	if (a == 1)
		return 1;
	b || (b = 0.3);
	if (!c || c < 1) {
		c = 1;
		e = b / 4
	} else
		e = b / (2 * Math.PI) * Math.asin(1 / c);
	return c * Math.pow(2, -10 * a) * Math.sin((a - e) * 2 * Math.PI / b) + 1
};
TWEEN.Easing.Elastic.EaseInOut = function(a) {
	var e, c = 0.1, b = 0.4;
	if (a == 0)
		return 0;
	if (a == 1)
		return 1;
	b || (b = 0.3);
	if (!c || c < 1) {
		c = 1;
		e = b / 4
	} else
		e = b / (2 * Math.PI) * Math.asin(1 / c);
	if ((a *= 2) < 1)
		return -0.5 * c * Math.pow(2, 10 * (a -= 1))
				* Math.sin((a - e) * 2 * Math.PI / b);
	return c * Math.pow(2, -10 * (a -= 1))
			* Math.sin((a - e) * 2 * Math.PI / b) * 0.5 + 1
};
TWEEN.Easing.Back.EaseIn = function(a) {
	return a * a * (2.70158 * a - 1.70158)
};
TWEEN.Easing.Back.EaseOut = function(a) {
	return (a -= 1) * a * (2.70158 * a + 1.70158) + 1
};
TWEEN.Easing.Back.EaseInOut = function(a) {
	if ((a *= 2) < 1)
		return 0.5 * a * a * (3.5949095 * a - 2.5949095);
	return 0.5 * ((a -= 2) * a * (3.5949095 * a + 2.5949095) + 2)
};
TWEEN.Easing.Bounce.EaseIn = function(a) {
	return 1 - TWEEN.Easing.Bounce.EaseOut(1 - a)
};
TWEEN.Easing.Bounce.EaseOut = function(a) {
	return (a /= 1) < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625
			* (a -= 1.5 / 2.75) * a + 0.75 : a < 2.5 / 2.75 ? 7.5625
			* (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75)
			* a + 0.984375
};
TWEEN.Easing.Bounce.EaseInOut = function(a) {
	if (a < 0.5)
		return TWEEN.Easing.Bounce.EaseIn(a * 2) * 0.5;
	return TWEEN.Easing.Bounce.EaseOut(a * 2 - 1) * 0.5 + 0.5
};

(function() {
	
	var _Tween=TWEEN.Tween;
	
	TWEEN.Tween = function(object) {
		var $this=this;
		$.extend(this,new _Tween(object));
		var _onComplete=this.onComplete;
        this.onComplete = function ( callback ) {
            _onComplete.call($this,function() {
            	setTimeout(function() {
            		callback.call($this);
            	},0);
            });
            return this;
        };
	}
	
	TWEEN.Easing.Linear.EaseNone = TWEEN.Easing.Linear.EaseNone || TWEEN.Easing.Linear.None; 
	TWEEN.Easing.Quadratic.EaseIn = TWEEN.Easing.Quadratic.EaseIn || TWEEN.Easing.Quadratic.In;
	TWEEN.Easing.Quadratic.EaseOut = TWEEN.Easing.Quadratic.EaseOut || TWEEN.Easing.Quadratic.Out;
	TWEEN.Easing.Quadratic.EaseInOut = TWEEN.Easing.Quadratic.EaseInOut || TWEEN.Easing.Quadratic.InOut;
	TWEEN.Easing.Cubic.EaseIn = TWEEN.Easing.Cubic.EaseIn || TWEEN.Easing.Cubic.In; 
	TWEEN.Easing.Cubic.EaseOut = TWEEN.Easing.Cubic.EaseOut || TWEEN.Easing.Cubic.Out;
	TWEEN.Easing.Cubic.EaseInOut = TWEEN.Easing.Cubic.EaseInOut || TWEEN.Easing.Cubic.InOut;
	TWEEN.Easing.Quartic.EaseIn = TWEEN.Easing.Quartic.EaseIn || TWEEN.Easing.Quartic.In;
	TWEEN.Easing.Quartic.EaseOut = TWEEN.Easing.Quartic.EaseOut || TWEEN.Easing.Quartic.Out;
	TWEEN.Easing.Quartic.EaseInOut = TWEEN.Easing.Quartic.EaseInOut || TWEEN.Easing.Quartic.InOut;
	TWEEN.Easing.Quintic.EaseIn = TWEEN.Easing.Quintic.EaseIn || TWEEN.Easing.Quintic.In;
	TWEEN.Easing.Quintic.EaseOut = TWEEN.Easing.Quintic.EaseOut || TWEEN.Easing.Quintic.Out; 
	TWEEN.Easing.Quintic.EaseInOut = TWEEN.Easing.Quintic.EaseInOut || TWEEN.Easing.Quintic.InOut;
	TWEEN.Easing.Sinusoidal.EaseIn = TWEEN.Easing.Sinusoidal.EaseIn || TWEEN.Easing.Sinusoidal.In;
	TWEEN.Easing.Sinusoidal.EaseOut = TWEEN.Easing.Sinusoidal.EaseOut || TWEEN.Easing.Sinusoidal.Out;
	TWEEN.Easing.Sinusoidal.EaseInOut = TWEEN.Easing.Sinusoidal.EaseInOut || TWEEN.Easing.Sinusoidal.InOut;
	TWEEN.Easing.Exponential.EaseIn = TWEEN.Easing.Exponential.EaseIn || TWEEN.Easing.Exponential.In;
	TWEEN.Easing.Exponential.EaseOut = TWEEN.Easing.Exponential.EaseOut || TWEEN.Easing.Exponential.Out;
	TWEEN.Easing.Exponential.EaseInOut = TWEEN.Easing.Exponential.EaseInOut || TWEEN.Easing.Exponential.InOut;
	TWEEN.Easing.Circular.EaseIn = TWEEN.Easing.Circular.EaseIn || TWEEN.Easing.Circular.In;
	TWEEN.Easing.Circular.EaseOut = TWEEN.Easing.Circular.EaseOut || TWEEN.Easing.Circular.Out;
	TWEEN.Easing.Circular.EaseInOut = TWEEN.Easing.Circular.EaseInOut || TWEEN.Easing.Circular.InOut;
	TWEEN.Easing.Elastic.EaseIn = TWEEN.Easing.Elastic.EaseIn || TWEEN.Easing.Elastic.In;
	TWEEN.Easing.Elastic.EaseOut = TWEEN.Easing.Elastic.EaseOut || TWEEN.Easing.Elastic.Out;
	TWEEN.Easing.Elastic.EaseInOut = TWEEN.Easing.Elastic.EaseInOut || TWEEN.Easing.Elastic.InOut;
	TWEEN.Easing.Back.EaseIn = TWEEN.Easing.Back.EaseIn || TWEEN.Easing.Back.In;
	TWEEN.Easing.Back.EaseOut = TWEEN.Easing.Back.EaseOut || TWEEN.Easing.Back.Out;
	TWEEN.Easing.Back.EaseInOut = TWEEN.Easing.Back.EaseInOut || TWEEN.Easing.Back.InOut;
	TWEEN.Easing.Bounce.EaseIn = TWEEN.Easing.Bounce.EaseIn || TWEEN.Easing.Bounce.In;
	TWEEN.Easing.Bounce.EaseOut = TWEEN.Easing.Bounce.EaseOut || TWEEN.Easing.Bounce.Out;
	TWEEN.Easing.Bounce.EaseInOut = TWEEN.Easing.Bounce.EaseInOut || TWEEN.Easing.Bounce.InOut;

})();
/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */
/*global THREE, console */

// This set of controls performs orbiting, dollying (zooming), and panning. It maintains
// the "up" direction as +Y, unlike the TrackballControls. Touch on tablet and phones is
// supported.
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe
//
// This is a drop-in replacement for (most) TrackballControls used in examples.
// That is, include this js file and wherever you see:
//    	controls = new THREE.TrackballControls( camera );
//      controls.target.z = 150;
// Simple substitute "OrbitControls" and the control should work as-is.

THREE.OrbitControls = function ( camera, object, domElement ) {

	this.object = object;
    this.camera = camera;
    
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	// Set to false to disable this control
	this.enabled = true;

	// "target" sets the location of focus, where the control orbits around
	// and where it pans with respect to.
	this.camTarget = new THREE.Vector3();
	// center is old, deprecated; use "camTarget" instead
	this.center = this.camTarget;

	// This option actually enables dollying in and out; left as "zoom" for
	// backwards compatibility
	this.noZoom = false;
	this.zoomSpeed = 1.0;
	// Limits to how far you can dolly in and out
	this.minDistance = 0;
	this.maxDistance = Infinity;

	// Set to true to disable this control
	this.noRotate = false;
	this.rotateSpeed = 1.0;

	// Set to true to disable this control
	this.noPan = false;
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	// Set to true to disable use of the keys
	this.noKeys = false;
	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
	
	// Jocly specific
	this.animControl = null;
	this.enableDrag = true;
	this.targetBounds = [3,3,3];

	////////////
	// internals

	var scope = this;

	var EPS = 0.000001;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();

	var dollyStart = new THREE.Vector2();
	var dollyEnd = new THREE.Vector2();
	var dollyDelta = new THREE.Vector2();

	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;
	var pan = new THREE.Vector3();

	var lastPosition = new THREE.Vector3();

	var STATE = { NONE : -1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };
	var state = STATE.NONE;

	// events

	var changeEvent = { type: 'change' };


	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;

	};

	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;

	};

	// pass in distance in world space to move left
	this.panLeft = function ( distance ) {

		var panOffset = new THREE.Vector3();
		var te = this.object.matrix.elements;
		// get X column of matrix
		panOffset.set( te[0], te[1], te[2] );
		panOffset.multiplyScalar(-distance);
		
		pan.add( panOffset );

	};

	// pass in distance in world space to move up
	this.panUp = function ( distance ) {

		var panOffset = new THREE.Vector3();
		var te = this.object.matrix.elements;
		// get Y column of matrix
		panOffset.set( te[4], te[5], te[6] );
		panOffset.multiplyScalar(distance);
		
		pan.add( panOffset );
	};
	
	// main entry point; pass in Vector2 of change desired in pixel space,
	// right and down are positive
	this.pan = function ( delta ) {

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		if ( scope.camera.fov !== undefined ) {

			// perspective
			var position = scope.object.position;
			var offset = position.clone().sub( scope.camTarget );
			var targetDistance = offset.length();

			// half of the fov is center to top of screen
			targetDistance *= Math.tan( (scope.camera.fov/2) * Math.PI / 180.0 );
			// we actually don't use screenWidth, since perspective camera is fixed to screen height
			scope.panLeft( 2 * delta.x * targetDistance / element.clientHeight );
			scope.panUp( 2 * delta.y * targetDistance / element.clientHeight );

		} else if ( scope.object.top !== undefined ) {

			// orthographic
			scope.panLeft( delta.x * (scope.object.right - scope.object.left) / element.clientWidth );
			scope.panUp( delta.y * (scope.object.top - scope.object.bottom) / element.clientHeight );

		} else {

			// camera neither orthographic or perspective - warn user
			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );

		}

	};

	this.dollyIn = function ( dollyScale ) {

		if ( dollyScale === undefined ) {

			dollyScale = getZoomScale();

		}

		scale /= dollyScale;

	};

	this.dollyOut = function ( dollyScale ) {

		if ( dollyScale === undefined ) {

			dollyScale = getZoomScale();

		}

		scale *= dollyScale;

	};

	this.update = function () {

		var position = this.object.position;
		var offset = position.clone().sub( this.camTarget );

		// angle from z-axis around y-axis

		var theta = Math.atan2( offset.x, offset.z );

		// angle from y-axis

		var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

		if ( this.autoRotate ) {

			this.rotateLeft( getAutoRotationAngle() );

		}

		theta += thetaDelta;
		phi += phiDelta;

		// restrict phi to be between desired limits
		phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

		// restrict phi to be betwee EPS and PI-EPS
		phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

		var radius = offset.length() * scale;

		// restrict radius to be between desired limits
		radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );
		
		//console.log("radius",radius,"phi",phi,"theta",theta);
		
		// move target to panned location
		this.camTarget.add( pan );

		offset.x = radius * Math.sin( phi ) * Math.sin( theta );
		offset.y = radius * Math.cos( phi );
		offset.z = radius * Math.sin( phi ) * Math.cos( theta );
		
		if(this.camTarget.x<-this.targetBounds[0])
			this.camTarget.setX(-this.targetBounds[0]);
		if(this.camTarget.x>this.targetBounds[0])
			this.camTarget.setX(this.targetBounds[0]);
		if(this.camTarget.y<-this.targetBounds[1])
			this.camTarget.setY(-this.targetBounds[1]);
		if(this.camTarget.y>this.targetBounds[1])
			this.camTarget.setY(this.targetBounds[1]);
		if(this.camTarget.z<-this.targetBounds[2])
			this.camTarget.setZ(-this.targetBounds[2]);
		if(this.camTarget.z>this.targetBounds[2])
			this.camTarget.setZ(this.targetBounds[2]);

		position.copy( this.camTarget ).add( offset );

		// apparently camera.lookAt is based on the camera relative position
        // in our case, where the camera is attached to an object, we need
        // to temporarily move the camera to this object for lookAt to work
        // properly
        var camPos = new THREE.Vector3();
        camPos.copy(this.camera.position);
        this.camera.position.copy(this.object.position);
		this.camera.lookAt( this.camTarget );
        this.camera.position.copy(camPos);

		thetaDelta = 0;
		phiDelta = 0;
		scale = 1;
		pan.set(0,0,0);

		if ( lastPosition.distanceTo( this.object.position ) > 0 ) {

			if(typeof this.dispatchEvent=="function")
				this.dispatchEvent( changeEvent );

			lastPosition.copy( this.object.position );
		}

	};
	
	this.destroy = function() {
		// things to do there ?
	}

	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.zoomSpeed );

	}

	function onMouseDown( event ) {

		if(THREE.Object3D._threexDomEvent.lockObject(event,scope.enableDrag))
			return;

		if ( scope.enabled === false ) { return; }
		event.preventDefault();
		event.stopPropagation();

		if ( event.button === 0 ) {
			if ( scope.noRotate === true ) { return; }

			state = STATE.ROTATE;

			rotateStart.set( event.clientX, event.clientY );

		} else if ( event.button === 1 ) {
			if ( scope.noZoom === true ) { return; }

			state = STATE.DOLLY;

			dollyStart.set( event.clientX, event.clientY );

		} else if ( event.button === 2 ) {
			if ( scope.noPan === true ) { return; }

			state = STATE.PAN;

			panStart.set( event.clientX, event.clientY );

		}

		// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
		scope.domElement.addEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		if ( state === STATE.ROTATE ) {

			if ( scope.noRotate === true ) return;

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			// rotating across whole screen goes 360 degrees around
			scope.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );
			// rotating up and down along whole screen attempts to go 360, but limited to 180
			scope.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );
			
		} else if ( state === STATE.DOLLY ) {

			if ( scope.noZoom === true ) return;

			dollyEnd.set( event.clientX, event.clientY );
			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				scope.dollyIn();

			} else {

				scope.dollyOut();

			}

			dollyStart.copy( dollyEnd );

		} else if ( state === STATE.PAN ) {

			if ( scope.noPan === true ) return;

			panEnd.set( event.clientX, event.clientY );
			panDelta.subVectors( panEnd, panStart );
			
			scope.pan( panDelta );

			panStart.copy( panEnd );

		}

		trigger();

	}

	function onMouseUp( /* event */ ) {

		if ( scope.enabled === false ) return;

		// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
		scope.domElement.removeEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.removeEventListener( 'mouseup', onMouseUp, false );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {
		
		event.stopPropagation();
		event.preventDefault();

		if ( scope.enabled === false || scope.noZoom === true ) return;

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.dollyOut();

		} else {

			scope.dollyIn();

		}
		
		trigger();

	}

	function onMouseOut( event ) {

		if ( scope.enabled === false ) return;
	
		this.mouseIsDown = false;
		state = STATE.NONE;
		
	}
	
	function onKeyDown( event ) {

		if ( scope.enabled === false ) { return; }
		if ( scope.noKeys === true ) { return; }
		if ( scope.noPan === true ) { return; }

		// pan a pixel - I guess for precise positioning?
		// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
		var needUpdate = false;
		
		switch ( event.keyCode ) {

			case scope.keys.UP:
				scope.pan( new THREE.Vector2( 0, scope.keyPanSpeed ) );
				needUpdate = true;
				break;
			case scope.keys.BOTTOM:
				scope.pan( new THREE.Vector2( 0, -scope.keyPanSpeed ) );
				needUpdate = true;
				break;
			case scope.keys.LEFT:
				scope.pan( new THREE.Vector2( scope.keyPanSpeed, 0 ) );
				needUpdate = true;
				break;
			case scope.keys.RIGHT:
				scope.pan( new THREE.Vector2( -scope.keyPanSpeed, 0 ) );
				needUpdate = true;
				break;
		}

		// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
		if ( needUpdate ) {

			scope.update();

		}

	}
	
	function touchstart( event ) {

		if(THREE.Object3D._threexDomEvent.lockObject(event,scope.enableDrag))
			return;

		if ( scope.enabled === false ) { return; }

		switch ( event.touches.length ) {

			case 1:	// one-fingered touch: rotate
				if ( scope.noRotate === true ) { return; }

				state = STATE.TOUCH_ROTATE;

				rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			case 2:	// two-fingered touch: dolly
				if ( scope.noZoom === true ) { return; }

				state = STATE.TOUCH_DOLLY;

				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				var distance = Math.sqrt( dx * dx + dy * dy );
				dollyStart.set( 0, distance );
				break;

			case 3: // three-fingered touch: pan
				if ( scope.noPan === true ) { return; }

				state = STATE.TOUCH_PAN;

				panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			default:
				state = STATE.NONE;

		}
		
		trigger();
	}

	function touchmove( event ) {

		if ( scope.enabled === false ) { return; }

		event.preventDefault();
		event.stopPropagation();

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		switch ( event.touches.length ) {

			case 1: // one-fingered touch: rotate
				if ( scope.noRotate === true ) { return; }
				if ( state !== STATE.TOUCH_ROTATE ) { return; }

				rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				rotateDelta.subVectors( rotateEnd, rotateStart );

				// rotating across whole screen goes 360 degrees around
				scope.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );
				// rotating up and down along whole screen attempts to go 360, but limited to 180
				scope.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

				rotateStart.copy( rotateEnd );
				break;

			case 2: // two-fingered touch: dolly
				if ( scope.noZoom === true ) { return; }
				if ( state !== STATE.TOUCH_DOLLY ) { return; }

				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				var distance = Math.sqrt( dx * dx + dy * dy );

				dollyEnd.set( 0, distance );
				dollyDelta.subVectors( dollyEnd, dollyStart );

				if ( dollyDelta.y > 0 ) {

					scope.dollyOut();

				} else {

					scope.dollyIn();

				}

				dollyStart.copy( dollyEnd );
				break;

			case 3: // three-fingered touch: pan
				if ( scope.noPan === true ) { return; }
				if ( state !== STATE.TOUCH_PAN ) { return; }

				panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				panDelta.subVectors( panEnd, panStart );
				
				scope.pan( panDelta );

				panStart.copy( panEnd );
				break;

			default:
				state = STATE.NONE;

		}

		trigger();

	}

	function touchend( /* event */ ) {

		if ( scope.enabled === false ) { return; }

		state = STATE.NONE;
	}

	function trigger() {
		if(scope.animControl)
			scope.animControl.trigger();
	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); event.stopPropagation(); }, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'mouseout', onMouseOut, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox

	this.domElement.addEventListener( 'keydown', onKeyDown, false );

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );

/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function( object, changeCallback ) {

	var scope = this;

	this.object = object;

	this.enabled = false;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	this.alpha = 0;
	this.alphaOffsetAngle = 0;

	this.calibration = true;

	var onDeviceOrientationChangeEvent = function( event ) {

		if(event.alpha!==null || event.beta!==null | event.gamma!==null) {
			scope.object.rotation.reorder( "YXZ" );
			scope.enabled = true;
		}
		scope.deviceOrientation = event;
		changeCallback(scope);

	};

	var onScreenOrientationChangeEvent = function() {

		scope.screenOrientation = window.orientation || 0;
		changeCallback(scope);

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function() {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

		}

	}();

	this.connect = function() {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

	};

	this.disconnect = function() {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	this.update = function() {

		if ( scope.enabled === false ) return;

		if(scope.calibration) {
			scope.calibration = false;
			this.alphaOffsetAngle = - object.rotation.y - THREE.Math.degToRad( scope.deviceOrientation.alpha ) + Math.PI/2;
		}

		var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) + this.alphaOffsetAngle : 0; // Z
		var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad( scope.deviceOrientation.beta ) : 0; // X'
		var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
		var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

		setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );
		this.alpha = alpha;

	};

	this.updateAlphaOffsetAngle = function( angle ) {

		this.alphaOffsetAngle = angle;
		this.update();

	};

	this.dispose = function() {

		this.disconnect();

	};

	this.connect();

};

/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author julianwa / https://github.com/julianwa
 */

THREE.RenderableObject = function () {

	this.id = 0;

	this.object = null;
	this.z = 0;
	this.renderOrder = 0;

};

//

THREE.RenderableFace = function () {

	this.id = 0;

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();
	this.v3 = new THREE.RenderableVertex();

	this.normalModel = new THREE.Vector3();

	this.vertexNormalsModel = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
	this.vertexNormalsLength = 0;

	this.color = new THREE.Color();
	this.material = null;
	this.uvs = [ new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2() ];

	this.z = 0;
	this.renderOrder = 0;

};

//

THREE.RenderableVertex = function () {

	this.position = new THREE.Vector3();
	this.positionWorld = new THREE.Vector3();
	this.positionScreen = new THREE.Vector4();

	this.visible = true;

};

THREE.RenderableVertex.prototype.copy = function ( vertex ) {

	this.positionWorld.copy( vertex.positionWorld );
	this.positionScreen.copy( vertex.positionScreen );

};

//

THREE.RenderableLine = function () {

	this.id = 0;

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();

	this.vertexColors = [ new THREE.Color(), new THREE.Color() ];
	this.material = null;

	this.z = 0;
	this.renderOrder = 0;

};

//

THREE.RenderableSprite = function () {

	this.id = 0;

	this.object = null;

	this.x = 0;
	this.y = 0;
	this.z = 0;

	this.rotation = 0;
	this.scale = new THREE.Vector2();

	this.material = null;
	this.renderOrder = 0;

};

//

THREE.Projector = function () {

	var _object, _objectCount, _objectPool = [], _objectPoolLength = 0,
	_vertex, _vertexCount, _vertexPool = [], _vertexPoolLength = 0,
	_face, _faceCount, _facePool = [], _facePoolLength = 0,
	_line, _lineCount, _linePool = [], _linePoolLength = 0,
	_sprite, _spriteCount, _spritePool = [], _spritePoolLength = 0,

	_renderData = { objects: [], lights: [], elements: [] },

	_vector3 = new THREE.Vector3(),
	_vector4 = new THREE.Vector4(),

	_clipBox = new THREE.Box3( new THREE.Vector3( - 1, - 1, - 1 ), new THREE.Vector3( 1, 1, 1 ) ),
	_boundingBox = new THREE.Box3(),
	_points3 = new Array( 3 ),
	_points4 = new Array( 4 ),

	_viewMatrix = new THREE.Matrix4(),
	_viewProjectionMatrix = new THREE.Matrix4(),

	_modelMatrix,
	_modelViewProjectionMatrix = new THREE.Matrix4(),

	_normalMatrix = new THREE.Matrix3(),

	_frustum = new THREE.Frustum(),

	_clippedVertex1PositionScreen = new THREE.Vector4(),
	_clippedVertex2PositionScreen = new THREE.Vector4();

	//

	this.projectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .projectVector() is now vector.project().' );
		vector.project( camera );

	};

	this.unprojectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .unprojectVector() is now vector.unproject().' );
		vector.unproject( camera );

	};

	this.pickingRay = function ( vector, camera ) {

		console.error( 'THREE.Projector: .pickingRay() is now raycaster.setFromCamera().' );

	};

	//

	var RenderList = function () {

		var normals = [];
		var uvs = [];

		var object = null;
		var material = null;

		var normalMatrix = new THREE.Matrix3();

		function setObject( value ) {

			object = value;
			material = object.material;

			normalMatrix.getNormalMatrix( object.matrixWorld );

			normals.length = 0;
			uvs.length = 0;

		}

		function projectVertex( vertex ) {

			var position = vertex.position;
			var positionWorld = vertex.positionWorld;
			var positionScreen = vertex.positionScreen;

			positionWorld.copy( position ).applyMatrix4( _modelMatrix );
			positionScreen.copy( positionWorld ).applyMatrix4( _viewProjectionMatrix );

			var invW = 1 / positionScreen.w;

			positionScreen.x *= invW;
			positionScreen.y *= invW;
			positionScreen.z *= invW;

			vertex.visible = positionScreen.x >= - 1 && positionScreen.x <= 1 &&
					 positionScreen.y >= - 1 && positionScreen.y <= 1 &&
					 positionScreen.z >= - 1 && positionScreen.z <= 1;

		}

		function pushVertex( x, y, z ) {

			_vertex = getNextVertexInPool();
			_vertex.position.set( x, y, z );

			projectVertex( _vertex );

		}

		function pushNormal( x, y, z ) {

			normals.push( x, y, z );

		}

		function pushUv( x, y ) {

			uvs.push( x, y );

		}

		function checkTriangleVisibility( v1, v2, v3 ) {

			if ( v1.visible === true || v2.visible === true || v3.visible === true ) return true;

			_points3[ 0 ] = v1.positionScreen;
			_points3[ 1 ] = v2.positionScreen;
			_points3[ 2 ] = v3.positionScreen;

			return _clipBox.intersectsBox( _boundingBox.setFromPoints( _points3 ) );

		}

		function checkBackfaceCulling( v1, v2, v3 ) {

			return ( ( v3.positionScreen.x - v1.positionScreen.x ) *
				    ( v2.positionScreen.y - v1.positionScreen.y ) -
				    ( v3.positionScreen.y - v1.positionScreen.y ) *
				    ( v2.positionScreen.x - v1.positionScreen.x ) ) < 0;

		}

		function pushLine( a, b ) {

			var v1 = _vertexPool[ a ];
			var v2 = _vertexPool[ b ];

			_line = getNextLineInPool();

			_line.id = object.id;
			_line.v1.copy( v1 );
			_line.v2.copy( v2 );
			_line.z = ( v1.positionScreen.z + v2.positionScreen.z ) / 2;
			_line.renderOrder = object.renderOrder;

			_line.material = object.material;

			_renderData.elements.push( _line );

		}

		function pushTriangle( a, b, c ) {

			var v1 = _vertexPool[ a ];
			var v2 = _vertexPool[ b ];
			var v3 = _vertexPool[ c ];

			if ( checkTriangleVisibility( v1, v2, v3 ) === false ) return;

			if ( material.side === THREE.DoubleSide || checkBackfaceCulling( v1, v2, v3 ) === true ) {

				_face = getNextFaceInPool();

				_face.id = object.id;
				_face.v1.copy( v1 );
				_face.v2.copy( v2 );
				_face.v3.copy( v3 );
				_face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;
				_face.renderOrder = object.renderOrder;

				// use first vertex normal as face normal

				_face.normalModel.fromArray( normals, a * 3 );
				_face.normalModel.applyMatrix3( normalMatrix ).normalize();

				for ( var i = 0; i < 3; i ++ ) {

					var normal = _face.vertexNormalsModel[ i ];
					normal.fromArray( normals, arguments[ i ] * 3 );
					normal.applyMatrix3( normalMatrix ).normalize();

					var uv = _face.uvs[ i ];
					uv.fromArray( uvs, arguments[ i ] * 2 );

				}

				_face.vertexNormalsLength = 3;

				_face.material = object.material;

				_renderData.elements.push( _face );

			}

		}

		return {
			setObject: setObject,
			projectVertex: projectVertex,
			checkTriangleVisibility: checkTriangleVisibility,
			checkBackfaceCulling: checkBackfaceCulling,
			pushVertex: pushVertex,
			pushNormal: pushNormal,
			pushUv: pushUv,
			pushLine: pushLine,
			pushTriangle: pushTriangle
		}

	};

	var renderList = new RenderList();

	this.projectScene = function ( scene, camera, sortObjects, sortElements ) {

		_faceCount = 0;
		_lineCount = 0;
		_spriteCount = 0;

		_renderData.elements.length = 0;

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
		if ( camera.parent === null ) camera.updateMatrixWorld();

		_viewMatrix.copy( camera.matrixWorldInverse.getInverse( camera.matrixWorld ) );
		_viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, _viewMatrix );

		_frustum.setFromMatrix( _viewProjectionMatrix );

		//

		_objectCount = 0;

		_renderData.objects.length = 0;
		_renderData.lights.length = 0;

		function addObject( object ) {

			_object = getNextObjectInPool();
			_object.id = object.id;
			_object.object = object;

			_vector3.setFromMatrixPosition( object.matrixWorld );
			_vector3.applyMatrix4( _viewProjectionMatrix );
			_object.z = _vector3.z;
			_object.renderOrder = object.renderOrder;

			_renderData.objects.push( _object );

		}

		scene.traverseVisible( function ( object ) {

			if ( object instanceof THREE.Light ) {

				_renderData.lights.push( object );

			} else if ( object instanceof THREE.Mesh || object instanceof THREE.Line ) {

				if ( object.material.visible === false ) return;
				if ( object.frustumCulled === true && _frustum.intersectsObject( object ) === false ) return;

				addObject( object );

			} else if ( object instanceof THREE.Sprite ) {

				if ( object.material.visible === false ) return;
				if ( object.frustumCulled === true && _frustum.intersectsSprite( object ) === false ) return;

				addObject( object );

			}

		} );

		if ( sortObjects === true ) {

			_renderData.objects.sort( painterSort );

		}

		//

		for ( var o = 0, ol = _renderData.objects.length; o < ol; o ++ ) {

			var object = _renderData.objects[ o ].object;
			var geometry = object.geometry;

			renderList.setObject( object );

			_modelMatrix = object.matrixWorld;

			_vertexCount = 0;

			if ( object instanceof THREE.Mesh ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					var attributes = geometry.attributes;
					var groups = geometry.groups;

					if ( attributes.position === undefined ) continue;

					var positions = attributes.position.array;

					for ( var i = 0, l = positions.length; i < l; i += 3 ) {

						renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

					}

					if ( attributes.normal !== undefined ) {

						var normals = attributes.normal.array;

						for ( var i = 0, l = normals.length; i < l; i += 3 ) {

							renderList.pushNormal( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] );

						}

					}

					if ( attributes.uv !== undefined ) {

						var uvs = attributes.uv.array;

						for ( var i = 0, l = uvs.length; i < l; i += 2 ) {

							renderList.pushUv( uvs[ i ], uvs[ i + 1 ] );

						}

					}

					if ( geometry.index !== null ) {

						var indices = geometry.index.array;

						if ( groups.length > 0 ) {

							for ( var g = 0; g < groups.length; g ++ ) {

								var group = groups[ g ];

								for ( var i = group.start, l = group.start + group.count; i < l; i += 3 ) {

									renderList.pushTriangle( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

								}

							}

						} else {

							for ( var i = 0, l = indices.length; i < l; i += 3 ) {

								renderList.pushTriangle( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

							}

						}

					} else {

						for ( var i = 0, l = positions.length / 3; i < l; i += 3 ) {

							renderList.pushTriangle( i, i + 1, i + 2 );

						}

					}

				} else if ( geometry instanceof THREE.Geometry ) {

					var vertices = geometry.vertices;
					var faces = geometry.faces;
					var faceVertexUvs = geometry.faceVertexUvs[ 0 ];

					_normalMatrix.getNormalMatrix( _modelMatrix );

					var material = object.material;

					var isFaceMaterial = material instanceof THREE.MultiMaterial;
					var objectMaterials = isFaceMaterial === true ? object.material : null;

					for ( var v = 0, vl = vertices.length; v < vl; v ++ ) {

						var vertex = vertices[ v ];

						_vector3.copy( vertex );

						if ( material.morphTargets === true ) {

							var morphTargets = geometry.morphTargets;
							var morphInfluences = object.morphTargetInfluences;

							for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

								var influence = morphInfluences[ t ];

								if ( influence === 0 ) continue;

								var target = morphTargets[ t ];
								var targetVertex = target.vertices[ v ];

								_vector3.x += ( targetVertex.x - vertex.x ) * influence;
								_vector3.y += ( targetVertex.y - vertex.y ) * influence;
								_vector3.z += ( targetVertex.z - vertex.z ) * influence;

							}

						}

						renderList.pushVertex( _vector3.x, _vector3.y, _vector3.z );

					}

					for ( var f = 0, fl = faces.length; f < fl; f ++ ) {

						var face = faces[ f ];

						material = isFaceMaterial === true
							 ? objectMaterials.materials[ face.materialIndex ]
							 : object.material;

						if ( material === undefined ) continue;

						var side = material.side;

						var v1 = _vertexPool[ face.a ];
						var v2 = _vertexPool[ face.b ];
						var v3 = _vertexPool[ face.c ];

						if ( renderList.checkTriangleVisibility( v1, v2, v3 ) === false ) continue;

						var visible = renderList.checkBackfaceCulling( v1, v2, v3 );

						if ( side !== THREE.DoubleSide ) {

							if ( side === THREE.FrontSide && visible === false ) continue;
							if ( side === THREE.BackSide && visible === true ) continue;

						}

						_face = getNextFaceInPool();

						_face.id = object.id;
						_face.v1.copy( v1 );
						_face.v2.copy( v2 );
						_face.v3.copy( v3 );

						_face.normalModel.copy( face.normal );

						if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

							_face.normalModel.negate();

						}

						_face.normalModel.applyMatrix3( _normalMatrix ).normalize();

						var faceVertexNormals = face.vertexNormals;

						for ( var n = 0, nl = Math.min( faceVertexNormals.length, 3 ); n < nl; n ++ ) {

							var normalModel = _face.vertexNormalsModel[ n ];
							normalModel.copy( faceVertexNormals[ n ] );

							if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

								normalModel.negate();

							}

							normalModel.applyMatrix3( _normalMatrix ).normalize();

						}

						_face.vertexNormalsLength = faceVertexNormals.length;

						var vertexUvs = faceVertexUvs[ f ];

						if ( vertexUvs !== undefined ) {

							for ( var u = 0; u < 3; u ++ ) {

								_face.uvs[ u ].copy( vertexUvs[ u ] );

							}

						}

						_face.color = face.color;
						_face.material = material;

						_face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;
						_face.renderOrder = object.renderOrder;

						_renderData.elements.push( _face );

					}

				}

			} else if ( object instanceof THREE.Line ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					var attributes = geometry.attributes;

					if ( attributes.position !== undefined ) {

						var positions = attributes.position.array;

						for ( var i = 0, l = positions.length; i < l; i += 3 ) {

							renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

						}

						if ( geometry.index !== null ) {

							var indices = geometry.index.array;

							for ( var i = 0, l = indices.length; i < l; i += 2 ) {

								renderList.pushLine( indices[ i ], indices[ i + 1 ] );

							}

						} else {

							var step = object instanceof THREE.LineSegments ? 2 : 1;

							for ( var i = 0, l = ( positions.length / 3 ) - 1; i < l; i += step ) {

								renderList.pushLine( i, i + 1 );

							}

						}

					}

				} else if ( geometry instanceof THREE.Geometry ) {

					_modelViewProjectionMatrix.multiplyMatrices( _viewProjectionMatrix, _modelMatrix );

					var vertices = object.geometry.vertices;

					if ( vertices.length === 0 ) continue;

					v1 = getNextVertexInPool();
					v1.positionScreen.copy( vertices[ 0 ] ).applyMatrix4( _modelViewProjectionMatrix );

					var step = object instanceof THREE.LineSegments ? 2 : 1;

					for ( var v = 1, vl = vertices.length; v < vl; v ++ ) {

						v1 = getNextVertexInPool();
						v1.positionScreen.copy( vertices[ v ] ).applyMatrix4( _modelViewProjectionMatrix );

						if ( ( v + 1 ) % step > 0 ) continue;

						v2 = _vertexPool[ _vertexCount - 2 ];

						_clippedVertex1PositionScreen.copy( v1.positionScreen );
						_clippedVertex2PositionScreen.copy( v2.positionScreen );

						if ( clipLine( _clippedVertex1PositionScreen, _clippedVertex2PositionScreen ) === true ) {

							// Perform the perspective divide
							_clippedVertex1PositionScreen.multiplyScalar( 1 / _clippedVertex1PositionScreen.w );
							_clippedVertex2PositionScreen.multiplyScalar( 1 / _clippedVertex2PositionScreen.w );

							_line = getNextLineInPool();

							_line.id = object.id;
							_line.v1.positionScreen.copy( _clippedVertex1PositionScreen );
							_line.v2.positionScreen.copy( _clippedVertex2PositionScreen );

							_line.z = Math.max( _clippedVertex1PositionScreen.z, _clippedVertex2PositionScreen.z );
							_line.renderOrder = object.renderOrder;

							_line.material = object.material;

							if ( object.material.vertexColors === THREE.VertexColors ) {

								_line.vertexColors[ 0 ].copy( object.geometry.colors[ v ] );
								_line.vertexColors[ 1 ].copy( object.geometry.colors[ v - 1 ] );

							}

							_renderData.elements.push( _line );

						}

					}

				}

			} else if ( object instanceof THREE.Sprite ) {

				_vector4.set( _modelMatrix.elements[ 12 ], _modelMatrix.elements[ 13 ], _modelMatrix.elements[ 14 ], 1 );
				_vector4.applyMatrix4( _viewProjectionMatrix );

				var invW = 1 / _vector4.w;

				_vector4.z *= invW;

				if ( _vector4.z >= - 1 && _vector4.z <= 1 ) {

					_sprite = getNextSpriteInPool();
					_sprite.id = object.id;
					_sprite.x = _vector4.x * invW;
					_sprite.y = _vector4.y * invW;
					_sprite.z = _vector4.z;
					_sprite.renderOrder = object.renderOrder;
					_sprite.object = object;

					_sprite.rotation = object.rotation;

					_sprite.scale.x = object.scale.x * Math.abs( _sprite.x - ( _vector4.x + camera.projectionMatrix.elements[ 0 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 12 ] ) );
					_sprite.scale.y = object.scale.y * Math.abs( _sprite.y - ( _vector4.y + camera.projectionMatrix.elements[ 5 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 13 ] ) );

					_sprite.material = object.material;

					_renderData.elements.push( _sprite );

				}

			}

		}

		if ( sortElements === true ) {

			_renderData.elements.sort( painterSort );

		}

		return _renderData;

	};

	// Pools

	function getNextObjectInPool() {

		if ( _objectCount === _objectPoolLength ) {

			var object = new THREE.RenderableObject();
			_objectPool.push( object );
			_objectPoolLength ++;
			_objectCount ++;
			return object;

		}

		return _objectPool[ _objectCount ++ ];

	}

	function getNextVertexInPool() {

		if ( _vertexCount === _vertexPoolLength ) {

			var vertex = new THREE.RenderableVertex();
			_vertexPool.push( vertex );
			_vertexPoolLength ++;
			_vertexCount ++;
			return vertex;

		}

		return _vertexPool[ _vertexCount ++ ];

	}

	function getNextFaceInPool() {

		if ( _faceCount === _facePoolLength ) {

			var face = new THREE.RenderableFace();
			_facePool.push( face );
			_facePoolLength ++;
			_faceCount ++;
			return face;

		}

		return _facePool[ _faceCount ++ ];


	}

	function getNextLineInPool() {

		if ( _lineCount === _linePoolLength ) {

			var line = new THREE.RenderableLine();
			_linePool.push( line );
			_linePoolLength ++;
			_lineCount ++;
			return line;

		}

		return _linePool[ _lineCount ++ ];

	}

	function getNextSpriteInPool() {

		if ( _spriteCount === _spritePoolLength ) {

			var sprite = new THREE.RenderableSprite();
			_spritePool.push( sprite );
			_spritePoolLength ++;
			_spriteCount ++;
			return sprite;

		}

		return _spritePool[ _spriteCount ++ ];

	}

	//

	function painterSort( a, b ) {

		if ( a.renderOrder !== b.renderOrder ) {

			return a.renderOrder - b.renderOrder;

		} else if ( a.z !== b.z ) {

			return b.z - a.z;

		} else if ( a.id !== b.id ) {

			return a.id - b.id;

		} else {

			return 0;

		}

	}

	function clipLine( s1, s2 ) {

		var alpha1 = 0, alpha2 = 1,

		// Calculate the boundary coordinate of each vertex for the near and far clip planes,
		// Z = -1 and Z = +1, respectively.
		bc1near =  s1.z + s1.w,
		bc2near =  s2.z + s2.w,
		bc1far =  - s1.z + s1.w,
		bc2far =  - s2.z + s2.w;

		if ( bc1near >= 0 && bc2near >= 0 && bc1far >= 0 && bc2far >= 0 ) {

			// Both vertices lie entirely within all clip planes.
			return true;

		} else if ( ( bc1near < 0 && bc2near < 0 ) || ( bc1far < 0 && bc2far < 0 ) ) {

			// Both vertices lie entirely outside one of the clip planes.
			return false;

		} else {

			// The line segment spans at least one clip plane.

			if ( bc1near < 0 ) {

				// v1 lies outside the near plane, v2 inside
				alpha1 = Math.max( alpha1, bc1near / ( bc1near - bc2near ) );

			} else if ( bc2near < 0 ) {

				// v2 lies outside the near plane, v1 inside
				alpha2 = Math.min( alpha2, bc1near / ( bc1near - bc2near ) );

			}

			if ( bc1far < 0 ) {

				// v1 lies outside the far plane, v2 inside
				alpha1 = Math.max( alpha1, bc1far / ( bc1far - bc2far ) );

			} else if ( bc2far < 0 ) {

				// v2 lies outside the far plane, v2 inside
				alpha2 = Math.min( alpha2, bc1far / ( bc1far - bc2far ) );

			}

			if ( alpha2 < alpha1 ) {

				// The line segment spans two boundaries, but is outside both of them.
				// (This can't happen when we're only clipping against just near/far but good
				//  to leave the check here for future usage if other clip planes are added.)
				return false;

			} else {

				// Update the s1 and s2 vertices to match the clipped line segment.
				s1.lerp( s2, alpha1 );
				s2.lerp( s1, 1 - alpha2 );

				return true;

			}

		}

	}

};

// This THREEx helper makes it easy to handle the mouse events in your 3D scene
//
// * CHANGES NEEDED
//   * handle drag/drop
//   * notify events not object3D - like DOM
//     * so single object with property
//   * DONE bubling implement bubling/capturing
//   * DONE implement event.stopPropagation()
//   * DONE implement event.type = "click" and co
//   * DONE implement event.target
//
// # Lets get started
//
// First you include it in your page
//
// ```<script src='threex.domevent.js'></script>```
//
// # use the object oriented api
//
// You bind an event like this
// 
// ```mesh.on('click', function(object3d){ ... })```
//
// To unbind an event, just do
//
// ```mesh.off('click', function(object3d){ ... })```
//
// As an alternative, there is another naming closer DOM events.
// Pick the one you like, they are doing the same thing
//
// ```mesh.addEventListener('click', function(object3d){ ... })```
// ```mesh.removeEventListener('click', function(object3d){ ... })```
//
// # Supported Events
//
// Always in a effort to stay close to usual pratices, the events name are the same as in DOM.
// The semantic is the same too.
// Currently, the available events are
// [click, dblclick, mouseup, mousedown](http://www.quirksmode.org/dom/events/click.html),
// [mouseover and mouse out](http://www.quirksmode.org/dom/events/mouseover.html).
//
// # use the standalone api
//
// The object-oriented api modifies THREE.Object3D class.
// It is a global class, so it may be legitimatly considered unclean by some people.
// If this bother you, simply do ```THREEx.DomEvent.noConflict()``` and use the
// standalone API. In fact, the object oriented API is just a thin wrapper
// on top of the standalone API.
//
// First, you instanciate the object
//
// ```var domEvent = new THREEx.DomEvent();```
// 
// Then you bind an event like this
//
// ```domEvent.bind(mesh, 'click', function(object3d){ object3d.scale.x *= 2; });```
//
// To unbind an event, just do
//
// ```domEvent.unbind(mesh, 'click', callback);```
//
// 
// # Code

//

/** @namespace */
var THREEx		= THREEx 		|| {};

// # Constructor
THREEx.DomEvent	= function(camera)
{
	this._camera	= camera || null;
	this._domElement= null;
	this._projector	= new THREE.Projector();
	this._selected	= null;
	this._boundObjs	= {};
	this.setBoundContext('_');
	this.mouseIsDown = false;
	this.mouseDragNotified = false;
	this.lastDownTime = 0;

	// Bind dom event for mouse and touch
	var _this	= this;
	//this._$onClick		= function(){ _this._onClick.apply(_this, arguments);		};
	//this._$onDblClick	= function(){ _this._onDblClick.apply(_this, arguments);	};
	this._$onMouseMove	= function(){ _this._onMouseMove.apply(_this, arguments);	};
	this._$onMouseDown	= function(){ _this._onMouseDown.apply(_this, arguments);	};
	this._$onMouseUp	= function(){ _this._onMouseUp.apply(_this, arguments);		};
	this._$onTouchMove	= function(){ _this._onTouchMove.apply(_this, arguments);	};
	this._$onTouchStart	= function(){ _this._onTouchStart.apply(_this, arguments);	};
	this._$onTouchEnd	= function(){ _this._onTouchEnd.apply(_this, arguments);	};
}

THREEx.DomEvent.prototype.setDOMElement = function(domElement) {
	if(this._domElement)
		this.unsetDOMElement();
	this._domElement=domElement;
	//this._domElement.addEventListener( 'click'	, this._$onClick	, false );
	//this._domElement.addEventListener( 'dblclick'	, this._$onDblClick	, false );
	this._domElement.addEventListener( 'mousemove'	, this._$onMouseMove	, false );
	this._domElement.addEventListener( 'mousedown'	, this._$onMouseDown	, false );
	this._domElement.addEventListener( 'mouseup'	, this._$onMouseUp	, false );
	this._domElement.addEventListener( 'touchmove'	, this._$onTouchMove	, false );
	this._domElement.addEventListener( 'touchstart'	, this._$onTouchStart	, false );
	this._domElement.addEventListener( 'touchend'	, this._$onTouchEnd	, false );
}

THREEx.DomEvent.prototype.unsetDOMElement = function() {
	if(this._domElement) {
		//this._domElement.removeEventListener( 'click'		, this._$onClick	, false );
		//this._domElement.removeEventListener( 'dblclick'	, this._$onDblClick	, false );
		this._domElement.removeEventListener( 'mousemove'	, this._$onMouseMove	, false );
		this._domElement.removeEventListener( 'mousedown'	, this._$onMouseDown	, false );
		this._domElement.removeEventListener( 'mouseup'		, this._$onMouseUp	, false );
		this._domElement.removeEventListener( 'touchmove'	, this._$onTouchMove	, false );
		this._domElement.removeEventListener( 'touchstart'	, this._$onTouchStart	, false );
		this._domElement.removeEventListener( 'touchend'	, this._$onTouchEnd	, false );
		this._domElement=null;
	}
}

THREEx.DomEvent.prototype.setBoundContext = function(boundContext) {
	this._boundContext=boundContext;
	if(this._boundObjs[boundContext]===undefined)
		this._boundObjs[boundContext]=[];
}

THREEx.DomEvent.prototype.unsetBoundContext = function(boundContext) {
	if(this._boundObjs[boundContext]!==undefined) {
		var boundObjs=this._boundObjs[boundContext];
		for(var i=0;i<boundObjs.length;i++) {
			var object3d=boundObjs[i];
			if(object3d._3xDomEvent) {
				for(var f in object3d._3xDomEvent) {
					var m=/^(.*)Handlers$/.exec(f);
					if(m) {
						var event=m[1];
						var handlers=object3d._3xDomEvent[f];
						for(var j=0;j<handlers.length;j++) {
							var handler=handlers[j];
							this.unbind(object3d,event,handler.callback,handler.useCapture);
						}
					}
				}
			}
		}
	}
}


// # Destructor
THREEx.DomEvent.prototype.destroy	= function()
{
	for(var bc in this._boundObjs)
		this.unsetBoundContext(bc);
	
	// unBind dom event for mouse and touch
	this.unsetDOMElement();
}

THREEx.DomEvent.eventNames	= [
	//"click",
	//"dblclick",
	//"holdclick",
	//"mouseover",
	//"mouseout",
	"mousedown",
	"mouseup",
	"mousemove",
	"touchmove",
	"touchstart",
	"touchend",
];

/********************************************************************************/
/*		domevent context						*/
/********************************************************************************/

// handle domevent context in object3d instance

THREEx.DomEvent.prototype._objectCtxInit	= function(object3d){
	object3d._3xDomEvent = {};
}
THREEx.DomEvent.prototype._objectCtxDeinit	= function(object3d){
	delete object3d._3xDomEvent;
}
THREEx.DomEvent.prototype._objectCtxIsInit	= function(object3d){
	return object3d._3xDomEvent ? true : false;
}
THREEx.DomEvent.prototype._objectCtxGet	= function(object3d){
	return object3d._3xDomEvent;
}

/********************************************************************************/
/*										*/
/********************************************************************************/

/**
 * Getter/Setter for camera
*/
THREEx.DomEvent.prototype.camera	= function(value)
{
	if( value )	this._camera	= value;
	return this._camera;
}

THREEx.DomEvent.prototype.bind	= function(object3d, eventName, callback, useCapture)
{
	var $this=this;
	console.assert( THREEx.DomEvent.eventNames.indexOf(eventName) !== -1, "not available events:"+eventName );

	if( !this._objectCtxIsInit(object3d) )	this._objectCtxInit(object3d);
	var objectCtx	= this._objectCtxGet(object3d);	
	if( !objectCtx[eventName+'Handlers'] )	objectCtx[eventName+'Handlers']	= [];

	objectCtx[eventName+'Handlers'].push({
		callback	: callback,
		useCapture	: useCapture
	});
	
	function AddToBoundObjs(object3d) {
		$this._boundObjs[$this._boundContext].push(object3d);
		for(var i=0;i<object3d.children.length;i++)
			AddToBoundObjs(object3d.children[i]);
	}
	
	// add this object in this._boundObjs
	AddToBoundObjs(object3d);
	//console.log("boundObjs",this._boundObjs)
}

THREEx.DomEvent.prototype.unbind	= function(object3d, eventName, callback)
{
	var $this=this;
	console.assert( THREEx.DomEvent.eventNames.indexOf(eventName) !== -1, "not available events:"+eventName );

	if( !this._objectCtxIsInit(object3d) )	this._objectCtxInit(object3d);

	var objectCtx	= this._objectCtxGet(object3d);
	if( !objectCtx[eventName+'Handlers'] )	objectCtx[eventName+'Handlers']	= [];

	function RemoveFromBoundObjs(object3d) {
		var index = $this._boundObjs[$this._boundContext].indexOf(object3d);
		if(index>=0)
			$this._boundObjs[$this._boundContext].splice(index, 1);
		for(var i=0;i<object3d.children.length;i++)
			RemoveFromBoundObjs(object3d.children[i]);
	}
	
	var handlers	= objectCtx[eventName+'Handlers'];
	for(var i = 0; i < handlers.length; i++){
		var handler	= handlers[i];
		if( callback && callback != handler.callback )	continue;
		//if( useCapture != handler.useCapture )	continue;
		handlers.splice(i, 1)
		// from this object from this._boundObjs
		RemoveFromBoundObjs(object3d);
		break;
	}
}

THREEx.DomEvent.prototype._bound	= function(eventName, object3d)
{
	var objectCtx	= this._objectCtxGet(this.getRootObject(object3d));
	if( !objectCtx )	return false;
	return objectCtx[eventName+'Handlers'] ? true : false;
}

THREEx.DomEvent.prototype.getRootObject = function(object3d) {
	var object3d0=object3d;
	while(object3d && !object3d._3xDomEvent)
		object3d=object3d.parent;
	if(!object3d)
		console.error("Could not find root object for",object3d0);
	return object3d;
}

THREEx.DomEvent.prototype.isTHREExTarget = function(clientX, clientY) {
	var domElement=$(this._domElement);
	var offset=domElement.offset();
	var mouseX	= +((clientX-offset.left) / domElement.width() ) * 2 - 1;
	var mouseY	= -((clientY-offset.top) / domElement.height()) * 2 + 1;

	var vector	= new THREE.Vector3( mouseX, mouseY, 1 );
	vector.unproject( this._camera );
    var worldPos = this._camera.getWorldPosition();
	vector.sub( worldPos ).normalize()
	var ray		= new THREE.Raycaster( worldPos, vector );
	var intersects	= ray.intersectObjects( this._boundObjs[this._boundContext] );
	return intersects.length !== 0;
}

THREEx.DomEvent.prototype.lockObject = function(event,enableDrag) {
	if(/^mouse/.test(event.type) && event.button!=0)
		return false;
	var domElement=$(this._domElement);
	var offset=domElement.offset();
	var x, y;
	if(event.clientX!==undefined && event.clientY!==undefined) {
		x = event.clientX;
		y = event.clientY;
	} else if(event.touches && event.touches.length>0) {
		x = event.touches[0].pageX;
		y = event.touches[0].pageY;
	} else if(event.changedTouches && event.changedTouches.length>0) {
		x = event.changedTouches[0].pageX;
		y = event.changedTouches[0].pageY;
	} else {
		console.warn("Unable to get event position");
		return false;
	}
		
	var mouseX	= +((x-offset.left) / domElement.width() ) * 2 - 1;
	var mouseY	= -((y-offset.top) / domElement.height()) * 2 + 1;
	
	var vector	= new THREE.Vector3( mouseX, mouseY, 1 );
	vector.unproject( this._camera );
    var worldPos = this._camera.getWorldPosition();
    //vector.sub( this._camera.position ).normalize()
    vector.sub( worldPos ).normalize()
	var ray		= new THREE.Raycaster( worldPos, vector );
	var intersects	= ray.intersectObjects( this._boundObjs[this._boundContext] );
	this.objectLocked = intersects.length !== 0;
	this.enableDrag = this.objectLocked && enableDrag;
	return this.objectLocked;
}

/********************************************************************************/
/*		onEvent								*/
/********************************************************************************/

// # handle click kind of events

THREEx.DomEvent.prototype._onEvent	= function(eventName, mouseX, mouseY, origDomEvent, eventX, eventY)
{
	//console.log("_onEvent",eventName,mouseX,mouseY);

	if(eventName=="mouseup") {
		this.mouseIsDown = false;		
		if(!this.objectLocked)
			return null;
	} else if(eventName=="mousedown") {
		this.mouseIsDown = true;
		this.mouseDownPos = [eventX, eventY];
		this.mouseDragNotified = false;
		this.lastDownTime = Date.now();
	} else if(eventName=="mousemove") {
		if(this.mouseIsDown) {
			var dx = this.mouseDownPos[0] - eventX;
			var dy = this.mouseDownPos[1] - eventY;
			var distSq = dx * dx + dy * dy;
			if(this.enableDrag) {
				if(distSq < 100)
					return null;
				if(!this.mouseDragNotified) {
					if(Date.now()-this.lastDownTime<50)
						return null;
					this.mouseDragNotified = true;
					return this._onEvent("mouseup", this.mouseEventPos[0], this.mouseEventPos[1], origDomEvent, eventX, eventY);
				}
			} else {
				if(distSq > 100) {
					this.objectLocked = false;
					return null;
				}
			}
		}
	}

	var vector	= new THREE.Vector3( mouseX, mouseY, 1 );
	vector.unproject( this._camera );
    var worldPos = this._camera.getWorldPosition();
	vector.sub( worldPos ).normalize()
	var ray		= new THREE.Raycaster( worldPos, vector );
	var intersects	= ray.intersectObjects( this._boundObjs[this._boundContext] );
	
	//console.log("camera",this._camera.position,"ray",ray,"bound",this._boundObjs)

	// if there are no intersections, return now
	if( intersects.length === 0 )	{
		//console.warn("THREEx",eventName,"No hit");
		return null;
	}
	
	// init some vairables
	var intersect	= intersects[0];
	var object3d	= this.getRootObject(intersect.object);
	var objectCtx	= this._objectCtxGet(object3d);
	if( !objectCtx )	return null;

	// notify handlers
	this._notify(eventName, object3d, origDomEvent, intersect.point);
}

THREEx.DomEvent.prototype._notify	= function(eventName, object3d, origDomEvent, point)
{
	//console.log("notify",eventName,"to",object3d.id)
	var objectCtx	= this._objectCtxGet(object3d);
	var handlers	= objectCtx ? objectCtx[eventName+'Handlers'] : null;

	// do bubbling
	if( !objectCtx || !handlers || handlers.length === 0 ) {
		if(object3d.parent)
			this._notify(eventName, object3d.parent);
		return;
	}
	
	// notify all handlers
	var handlers	= objectCtx[eventName+'Handlers'];
	for(var i = 0; i < handlers.length; i++){
		var handler	= handlers[i];
		var toPropagate	= true;
		handler.callback({
			type		: eventName,
			target		: object3d,
			origDomEvent	: origDomEvent,
			stopPropagation	: function(){
				toPropagate	= false;
			},
			point: point
		});
		if( !toPropagate )	continue;
		// do bubbling
		if( handler.useCapture === false ){
			object3d.parent && this._notify(eventName, object3d.parent, origDomEvent, point);
		}
	}
}

/********************************************************************************/
/*		handle mouse events						*/
/********************************************************************************/
// # handle mouse events

//THREEx.DomEvent.longClickTimer=null;

THREEx.DomEvent.prototype._onMouseDown	= function(event) {
	//console.log("_onMouseDown",event.type)
	var $this=this;
	
	if(event.button!==0)
		return;
	/*
	if(THREEx.DomEvent.longClickTimer)
		clearTimeout(THREEx.DomEvent.longClickTimer);
	THREEx.DomEvent.longClickTimer=setTimeout(function() {
		THREEx.DomEvent.longClickTimer=null;
		$this._onMouseEvent('holdclick', event);
	},500);
	*/
	return this._onMouseEvent('mousedown', event);	
}
THREEx.DomEvent.prototype._onMouseUp	= function(event) {

	if(event.button!==0)
		return;

	//console.log("_onMouseUp",event.type)
	/*
	if(THREEx.DomEvent.longClickTimer) {
		clearTimeout(THREEx.DomEvent.longClickTimer);
		THREEx.DomEvent.longClickTimer=null;
	}
	*/
	return this._onMouseEvent('mouseup'	, event);	
}

THREEx.DomEvent.prototype._onMouseMove	= function(event)
{
	//console.log("_onMouseMove",event.type)
	if(!this.mouseIsDown)
		return null;
	/*
	if(THREEx.DomEvent.longClickTimer) {
		clearTimeout(THREEx.DomEvent.longClickTimer);
		THREEx.DomEvent.longClickTimer = null;
	}
	*/
	return this._onMouseEvent('mousemove', event);	
}

THREEx.DomEvent.prototype._onMouseEvent	= function(eventName, domEvent)
{
	var domElement=$(this._domElement);
	var offset=domElement.offset();
	var mouseX	= +((domEvent.clientX-offset.left) / domElement.width() ) * 2 - 1;
	var mouseY	= -((domEvent.clientY-offset.top) / domElement.height()) * 2 + 1;
	this.mouseEventPos = [ mouseX, mouseY ];
	return this._onEvent(eventName, mouseX, mouseY, domEvent, domEvent.clientX-offset.left, domEvent.clientY-offset.top);
}

/*
THREEx.DomEvent.prototype._onClick		= function(event)
{
	// TODO handle touch ?
	return this._onMouseEvent('click'	, event);
}
THREEx.DomEvent.prototype._onDblClick		= function(event)
{
	// TODO handle touch ?
	return this._onMouseEvent('dblclick'	, event);
}
*/

/********************************************************************************/
/*		handle touch events						*/
/********************************************************************************/
// # handle touch events


THREEx.DomEvent.prototype._onTouchStart	= function(event){ return this._onTouchEvent('mousedown', event);	}
THREEx.DomEvent.prototype._onTouchEnd	= function(event){ return this._onTouchEvent('mouseup'	, event);	}
THREEx.DomEvent.prototype._onTouchMove	= function(event){ 	
	if(!this.mouseIsDown) 
		return null; 
	else 
		return this._onTouchEvent('mousemove', event);	
}

/*
THREEx.DomEvent.prototype._onTouchMove	= function(domEvent)
{
	if( domEvent.touches.length != 1 )	return undefined;

	domEvent.preventDefault();

	var mouseX	= +(domEvent.touches[ 0 ].pageX / window.innerWidth ) * 2 - 1;
	var mouseY	= -(domEvent.touches[ 0 ].pageY / window.innerHeight) * 2 + 1;
	return this._onMove('mousemove', mouseX, mouseY, domEvent);
}
*/

THREEx.DomEvent.prototype._onTouchEvent	= function(eventName, domEvent)
{
	var domElement=$(this._domElement);
	var offset=domElement.offset();
	var mouseX=0, mouseY=0, eventX=0, eventY=0;
	if(domEvent.touches && domEvent.touches.length>0) {
		mouseX	= +((domEvent.touches[0].clientX-offset.left) / domElement.width() ) * 2 - 1;
		mouseY	= -((domEvent.touches[0].clientY-offset.top) / domElement.height()) * 2 + 1;
		eventX = domEvent.touches[0].clientX-offset.left;
		eventY = domEvent.touches[0].clientY-offset.top;
	} else if(domEvent.changedTouches && domEvent.changedTouches.length>0) {
		mouseX	= +((domEvent.changedTouches[0].clientX-offset.left) / domElement.width() ) * 2 - 1;
		mouseY	= -((domEvent.changedTouches[0].clientY-offset.top) / domElement.height()) * 2 + 1;
		eventX = domEvent.changedTouches[0].clientX-offset.left;
		eventY = domEvent.changedTouches[0].clientY-offset.top;
	}
	this.mouseEventPos = [ mouseX, mouseY ];
	return this._onEvent(eventName, mouseX, mouseY, domEvent, eventX, eventY);
}


/********************************************************************************/
// # Patch THREE.Object3D
/********************************************************************************/

// handle noConflit.
THREEx.DomEvent.noConflict	= function(){
	THREEx.DomEvent.noConflict.symbols.forEach(function(symbol){
		THREE.Object3D.prototype[symbol]	= THREEx.DomEvent.noConflict.previous[symbol]
	})
}
// Backup previous values to restore them later if needed.
THREEx.DomEvent.noConflict.symbols	= ['on', 'off', 'addEventListener', 'removeEventListener'];
THREEx.DomEvent.noConflict.previous	= {};
THREEx.DomEvent.noConflict.symbols.forEach(function(symbol){
	THREEx.DomEvent.noConflict.previous[symbol]	= THREE.Object3D.prototype[symbol]
})

// begin the actual patching of THREE.Object3D

// create the global instance of THREEx.DomEvent
//THREE.Object3D._threexDomEvent	= new THREEx.DomEvent();

// # wrap mouseevents.bind()
THREE.Object3D.prototype._addEventListener = THREE.Object3D.prototype.addEventListener;
THREE.Object3D.prototype.on	=
THREE.Object3D.prototype.addEventListener = function(eventName, callback){
	THREE.Object3D._threexDomEvent.bind(this, eventName, callback);
	return this;
}

// # wrap mouseevents.unbind()
THREE.Object3D.prototype._removeEventListener = THREE.Object3D.prototype.removeEventListener;
THREE.Object3D.prototype.off	=
THREE.Object3D.prototype.removeEventListener	= function(eventName, callback){
	THREE.Object3D._threexDomEvent.unbind(this, eventName, callback);
	return this;
}

/**
 * @author alteredq / http://alteredqualia.com/
 * @authod mrdoob / http://mrdoob.com/
 * @authod arodic / http://aleksandarrodic.com/
 * @authod fonserbc / http://fonserbc.github.io/
*/

THREE.StereoEffect = function ( renderer ) {

	var _stereo = new THREE.StereoCamera();
	_stereo.aspect = 0.5;

	this.setEyeSeparation = function ( eyeSep ) {

		_stereo.eyeSep = eyeSep;

	};

	this.setSize = function ( width, height ) {

		renderer.setSize( width, height );

	};

	this.render = function ( scene, camera ) {

		scene.updateMatrixWorld();

		if ( camera.parent === null ) camera.updateMatrixWorld();

		_stereo.update( camera );

		var size = renderer.getSize();

		if ( renderer.autoClear ) renderer.clear();
		renderer.setScissorTest( true );

		renderer.setScissor( 0, 0, size.width / 2, size.height );
		renderer.setViewport( 0, 0, size.width / 2, size.height );
		renderer.render( scene, _stereo.cameraL );

		renderer.setScissor( size.width / 2, 0, size.width / 2, size.height );
		renderer.setViewport( size.width / 2, 0, size.width / 2, size.height );
		renderer.render( scene, _stereo.cameraR );

		renderer.setScissorTest( false );

	};

};


function VRGamepads(opts) {
    var options = Object.assign({
        drag: function(position,direction) {
            return false;
        },
        click: function(position,direction) {
        },
        reset: function() {
        },
        speed: 10,
        move: function(delta) {
        },
        visionCrosshairAngle: -Math.PI/8,
        movementMin: .2,
    },opts);

    var harborpad = null;

    function VRGamepad(gamepad) {

        THREE.Object3D.call( this );

        this.matrixAutoUpdate = false;
        this.isVRPad = false;

        var axes = [];
        var buttons = [];
        var buttonsIndexes = {
            move: -1,
            click: -1,
            reset: -1
        }

        this.getGamepad = function () {
            return gamepad;
        }

        this.getButtonState = function ( button ) {
            return false;
        }

        this.drag = function() {
            var pointer = this.getPointer();
            var progress = this.progressObject;
            var pointed = options.drag(pointer.position,pointer.direction);
            if(pointed) {
                if(this.pointerRescale) {
                    var distance = pointer.position.distanceTo(pointed.point);
                    var thickness = harborpad ? .1 : 1;
                    this.pointerObject.scale.set(thickness,distance,thickness);
                }
                this.pointerObject.material.color.setRGB(0,1,0);

                if(progress) {
                    var oid = pointed.object.id;
                    if(this.pointedId==oid) {
                        const pointingTime = 2000;
                        var now = Date.now();
                        var ratio = 1-(now-this.pointedTime)/pointingTime;
                        if(ratio<0) {
                            options.click(pointer.position,pointer.direction);
                            this.pointedId = null;
                        } else
                            progress.scale.set(ratio,ratio,ratio);
                    } else {
                        this.pointedId = oid;
                        progress.scale.set(1,1,1);
                        this.pointedTime = Date.now();
                        progress.visible = true;
                    }
                }
            } else {
                this.pointerObject.material.color.setRGB(1,.75,0);
                if(this.pointerRescale) {
                    var thickness = harborpad ? .1 : 1;
                    this.pointerObject.scale.set(thickness,100,thickness);
                }

                if(progress && this.pointedId) {
                    progress.visible = false;
                    this.pointedId = null;
                }

            }
        }

        this.update = function() {
            var $this = this;

            if(this.crosshairNeedsUpdate) {
                var pointer = this.getPointer();
                this.pointerObject.position.copy(pointer.position);
                this.pointerObject.position.add(pointer.direction);
            }

            if(this.progressNeedsUpdate) {
                var pointer = this.getPointer();
                this.progressObject.position.copy(pointer.position);
                this.progressObject.position.add(pointer.direction);
            }

			var pose = gamepad.pose;
            if(pose) {
                if(pose.position)
                    this.position.fromArray(pose.position);
                if(pose.orientation)
                    this.quaternion.fromArray(pose.orientation);
                this.matrix.compose(this.position,this.quaternion,this.scale );
                this.matrixWorldNeedsUpdate = true;
            }
            if(gamepad.buttons) {
                var changedButtons = false;
                gamepad.buttons.forEach(function(button,index) {
                    if(index===buttonsIndexes.click && button.pressed)
                        $this.drag();
                    if(button.pressed!==buttons[index]) {
                        buttons[index] = button.pressed;
                        if(buttons[index]!==undefined) {
                            changedButtons = true;
                            if(index===buttonsIndexes.move)
                                $this.moveButtonChanged(button.pressed);
                            if(index===buttonsIndexes.click)
                                $this.clickButtonChanged(button.pressed);
                            if(index===buttonsIndexes.reset)
                                $this.resetButtonChanged(button.pressed);
                        }
                    }
                });
            }
            if(gamepad.axes) {
                var changedAxes = false;
                gamepad.axes.forEach(function(axe,index) {
                    if(axe!==axes[index]) {
                        axes[index] = axe;
                        changedAxes = true;
                    }
                });
                if(buttonsIndexes.move>=0 && buttons[buttonsIndexes.move]) {
                    var now = window.performance.now();
                    var last = this.lastThumbpadTimestamp;
                    var deltaT = now - last;
                    var rotation = new THREE.Matrix4().extractRotation(this.matrixWorld);
                    var direction = new THREE.Vector3(axes[0],0,-axes[1]).applyMatrix4(rotation);
                    direction.multiplyScalar(options.speed*deltaT/1000);
                    options.move(direction);
                    this.lastThumbpadTimestamp = now;
                }
                if(buttonsIndexes.move<0) {
                    var now = window.performance.now();
                    var movement = new THREE.Vector3(axes[0],0,axes[1]);
                    if(movement.length()>options.movementMin) {
                        var last = this.lastThumbpadTimestamp;
                        var deltaT = now - last;
                        // yeah i know, it could have been simpler
                        var direction = options.camera.getWorldDirection();
                        var xzDirection = new THREE.Vector3(direction.x,0,direction.z);
                        xzDirection.normalize();
                        xzDirection.applyAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/2);
                        var rotateAxis = new THREE.Vector3(xzDirection.x,0,xzDirection.z)
                        rotateAxis.normalize();
                        var rotateAxis2 = new THREE.Vector3().copy(direction);
                        rotateAxis2.applyAxisAngle(rotateAxis,Math.PI/2);
                        var angle = Math.atan2(-axes[0],-axes[1]);
                        direction.applyAxisAngle(rotateAxis2,angle);
                        direction.multiplyScalar(options.speed*deltaT/1000);
                        options.move(direction);
                    }
                    this.lastThumbpadTimestamp = now;
                }
            }

            if(this.alwaysDrag)
                this.drag();
        }

        this.getPointer = function() {
            var position = this.getWorldPosition();
            if(gamepad.pose && gamepad.pose.hasOrientation) {
                var line = this.pointerObject;
                var pos0 = new THREE.Vector3(0,0,0);
                pos0.applyMatrix4(line.matrixWorld);
                var direction = new THREE.Vector3(0,-1,0);
                direction.applyMatrix4(line.matrixWorld);
                direction.sub(pos0);
                direction.normalize();
                return {
                    position: position,
                    direction: direction
                }
            } else {
                var position = options.camera.getWorldPosition();
                var direction = options.camera.getWorldDirection();
                position.add(direction);
                return {
                    position: position,
                    direction: direction
                }
            }
        }

        this.moveButtonChanged = function(on) {
            if(on)
                this.lastThumbpadTimestamp = window.performance.now();
        }

        this.clickButtonChanged = function(on) {
            if(on)
                this.pointerObject.visible = true;
            else {
                this.pointerObject.visible = false;
                var pointer = this.getPointer();
                options.click(pointer.position,pointer.direction);
            }
        }

        this.resetButtonChanged = function(on) {

        }

        this.destroyGamepad = function() {
            if(this.parent)
                this.parent.remove(this);
            if(this.pointerObject && this.pointerObject.parent)
                this.pointerObject.parent.remove(this.pointerObject);
            if(this.progressObject && this.progressObject.parent)
                this.progressObject.parent.remove(this.progressObject);
        }

        var cache = {}

        this.createCrosshair = function() {
            var crosshair = cache["crosshair"];
            if(crosshair===undefined) {
                var geometry = new THREE.SphereGeometry(.02);
                var material = new THREE.MeshBasicMaterial( {color: 0xff0000 } );
                crosshair = new THREE.Mesh(geometry,material);
                cache["crosshair"] = crosshair;
            }
            crosshair = crosshair.clone();
            this.crosshairNeedsUpdate = true;
            this.pointerObject = crosshair;
            options.scene.add(crosshair);
            this.pointerRescale = false;
        }

        this.createProgress = function() {
            var progress = cache["progress"];
            if(progress===undefined) {
                var geometry = new THREE.SphereGeometry(.2,16,12);
                var material = new THREE.MeshBasicMaterial( {
                    color: 0xff0000,
                    opacity: .5,
                    transparent: true
                } );
                progress = new THREE.Mesh(geometry,material);
                progress.visible = false;
                cache["progress"] = progress;
            }
            progress = progress.clone();
            this.progressNeedsUpdate = true;
            this.progressObject = progress;
            options.scene.add(progress);
        }

        this.createViveControllerMesh = function() {

            var $this = this;
            // create clicking ray
            var line = cache["vive-controller-ray"];
            if(line===undefined) {
                var geometry = new THREE.CylinderGeometry(.008,.008,1,8);
                geometry.translate(0,-.5,0);
                var material = new THREE.MeshBasicMaterial( {color: 0x80ff80} );
                line = new THREE.Mesh( geometry, material );
                line.scale.set(1,100,1);
                line.rotateX(Math.PI/6);
                line.visible = false;
                cache["vive-controller-ray"] = line;
            }
            this.pointerObject = line.clone();
            this.add(this.pointerObject);
            this.pointerRescale = true;

            // create controller
            function AddController(object) {
                $this.add(object);
            }
            var controllerObject = cache["vive-controller"];
            if(controllerObject===undefined) {
                cache["vive-controller"] = [AddController];
                var loader = new THREE.JSONLoader();
                loader.load( options.resBase + 'vive-controller/vr_controller_vive_1_5.js',
                    function(geometry) {
                        var loader = new THREE.TextureLoader();
                        loader.setPath( options.resBase + 'vive-controller/' );
                        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                        material.map = loader.load( 'onepointfive_texture.png');
                        material.specularMap = loader.load( 'onepointfive_spec.png');
                        var controller = new THREE.Mesh(geometry,material);
                        var object = new THREE.Object3D();
                        object.add(controller);
                        cache["vive-controller"].forEach(function(callback) {
                            callback(object.clone());
                        });
                        cache["vive-controller"] = object;
                });
            } else if(Array.isArray(controllerObject)) {
                cache["vive-controller"].push(AddController);
            } else
                AddController(controllerObject.clone());
            options.camera.parent.add(this);
        }

        this.getAxes = function() {
            return axes;
        }

        if(/openvr/i.test(gamepad.id)) {
            this.createViveControllerMesh();
            buttonsIndexes = {
                move: 0,
                click: 1,
                reset: 3
            }
            this.isVRPad = true;
        } else if(/touch/i.test(gamepad.id)) {
            this.createViveControllerMesh();
            buttonsIndexes = {
                move: -1,
                click: 1,
                reset: 3
            }
            this.isVRPad = true;
        } else if(gamepad.id=="simulated") {
            this.createCrosshair();
            this.createProgress();
            this.alwaysDrag = true;
        } else if(gamepad.id==/gear vr/i.test(gamepad.id)) {
            this.createCrosshair();
            buttonsIndexes = {
                move: -1,
                click: 1,
                reset: 1
            }
        } else {
            this.createCrosshair();
            buttonsIndexes = {
                move: -1,
                click: 7,
                reset: 1
            }
        }
    };

    VRGamepad.prototype = Object.create( THREE.Object3D.prototype );
    VRGamepad.prototype.constructor = VRGamepad;

    var knownGamepads = [];

    function mapGamepads() {
        var newGamepads = [];
        if(typeof navigator.getGamepads=="function") {
            var gamepadsList = navigator.getGamepads();
            for(var i = 0;i<gamepadsList.length;i++) {
                var gamepad = gamepadsList[i];
                if(gamepad) {
                    var isNewGamepad = true;
                    for(var j=0;j<knownGamepads.length;j++) {
                        var knownGamepad = knownGamepads[j];
                        if(gamepad===knownGamepad.getGamepad()) {
                            newGamepads.push(knownGamepad);
                            knownGamepads.splice(j,1);
                            isNewGamepad = false;
                            break;
                        }
                    }
                    if(isNewGamepad)
                        newGamepads.push(new VRGamepad(gamepad));
                }
            }
        }
        if(newGamepads.length==0) {
            var needSimulated = true;
            for(var j=0;j<knownGamepads.length;j++) {
                var knownGamepad = knownGamepads[j];
                if(knownGamepad.getGamepad().id=="simulated") {
                    newGamepads.push(knownGamepad);
                    knownGamepads.splice(j,1);
                    needSimulated = false;
                }
            }
            if(needSimulated)
                newGamepads.push(new VRGamepad({
                    id: "simulated"
                }));
        }
        knownGamepads.forEach(function(gamepad) {
            gamepad.destroyGamepad();
        });
        knownGamepads = newGamepads;
        harborpad = null;
        var firstVRPad = null;
        for(var i=0;i<knownGamepads.length;i++) {
            var gamepad = knownGamepads[i];
            if(gamepad.isVRPad) {
                if(firstVRPad) {
                    harborpad = gamepad;
                    break;
                } else
                    firstVRPad = gamepad;
            }
        }
        if(harborpad) {
            firstVRPad.pointerObject.scale.setX(.1);
            firstVRPad.pointerObject.scale.setZ(.1);
        } else if(firstVRPad) {
            firstVRPad.pointerObject.scale.setX(1);
            firstVRPad.pointerObject.scale.setZ(1);
        }

    }

    this.getHarborPad = function() {
        return harborpad;
    }

    this.update = function() {
        mapGamepads();
        knownGamepads.forEach(function(gamepad) {
            gamepad.update();
        });
    }

    this.clearAll = function() {
        knownGamepads.forEach(function(gamepad) {
            gamepad.destroyGamepad();
        });
        knownGamepads = [];
    }

}

/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 */

THREE.VRControls = function ( object, onError ) {

	var scope = this;

	var vrDisplay, vrDisplays;

	var standingMatrix = new THREE.Matrix4();

	var frameData = null;

	if ( 'VRFrameData' in window ) {

		frameData = new VRFrameData();

	}

	function gotVRDisplays( displays ) {

		vrDisplays = displays;

		if ( displays.length > 0 ) {

			vrDisplay = displays[ 0 ];

		} else {

			if ( onError ) onError( 'VR input not available.' );

		}

	}

	if ( navigator.getVRDisplays ) {

		navigator.getVRDisplays().then( gotVRDisplays ).catch ( function () {

			console.warn( 'THREE.VRControls: Unable to get VR Displays' );

		} );

	}

	// the Rift SDK returns the position in meters
	// this scale factor allows the user to define how meters
	// are converted to scene units.

	this.scale = 1;

	// If true will use "standing space" coordinate system where y=0 is the
	// floor and x=0, z=0 is the center of the room.
	this.standing = false;

	// Distance from the users eyes to the floor in meters. Used when
	// standing=true but the VRDisplay doesn't provide stageParameters.
	this.userHeight = 1.6;

	this.getVRDisplay = function () {

		return vrDisplay;

	};

	this.setVRDisplay = function ( value ) {

		vrDisplay = value;

	};

	this.getVRDisplays = function () {

		console.warn( 'THREE.VRControls: getVRDisplays() is being deprecated.' );
		return vrDisplays;

	};

	this.getStandingMatrix = function () {

		return standingMatrix;

	};

	this.update = function () {

		if ( vrDisplay ) {

			var pose;

			if ( vrDisplay.getFrameData ) {

				vrDisplay.getFrameData( frameData );
				pose = frameData.pose;

			} else if ( vrDisplay.getPose ) {

				pose = vrDisplay.getPose();

			}

			if ( pose.orientation !== null ) {

				object.quaternion.fromArray( pose.orientation );

			}

			if ( pose.position !== null ) {

				object.position.fromArray( pose.position );

			} else {

				object.position.set( 0, 0, 0 );

			}

			if ( this.standing ) {

				if ( vrDisplay.stageParameters ) {

					object.updateMatrix();

					standingMatrix.fromArray( vrDisplay.stageParameters.sittingToStandingTransform );
					object.applyMatrix( standingMatrix );

				} else {

					object.position.setY( object.position.y + this.userHeight );

				}

			}

			object.position.multiplyScalar( scope.scale );

		}

	};

	this.resetPose = function () {

		if ( vrDisplay ) {

			vrDisplay.resetPose();

		}

	};

	this.resetSensor = function () {

		console.warn( 'THREE.VRControls: .resetSensor() is now .resetPose().' );
		this.resetPose();

	};

	this.zeroSensor = function () {

		console.warn( 'THREE.VRControls: .zeroSensor() is now .resetPose().' );
		this.resetPose();

	};

	this.dispose = function () {

		vrDisplay = null;

	};

};

/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 *
 * WebVR Spec: http://mozvr.github.io/webvr-spec/webvr.html
 *
 * Firefox: http://mozvr.com/downloads/
 * Chromium: https://webvr.info/get-chrome
 *
 */

THREE.VREffect = function( renderer, onError ) {

	var vrDisplay, vrDisplays;
	var eyeTranslationL = new THREE.Vector3();
	var eyeTranslationR = new THREE.Vector3();
	var renderRectL, renderRectR;

	var frameData = null;

	if ( 'VRFrameData' in window ) {

		frameData = new window.VRFrameData();

	}

	function gotVRDisplays( displays ) {

		vrDisplays = displays;

		if ( displays.length > 0 ) {

			vrDisplay = displays[ 0 ];

		} else {

			if ( onError ) onError( 'HMD not available' );

		}

	}

	if ( navigator.getVRDisplays ) {

		navigator.getVRDisplays().then( gotVRDisplays ).catch( function() {

			console.warn( 'THREE.VREffect: Unable to get VR Displays' );

		} );

	}

	//

	this.isPresenting = false;
	this.scale = 1;

	var scope = this;

	var rendererSize = renderer.getSize();
	var rendererUpdateStyle = false;
	var rendererPixelRatio = renderer.getPixelRatio();

	this.getVRDisplay = function() {

		return vrDisplay;

	};

	this.setVRDisplay = function( value ) {

		vrDisplay = value;

	};

	this.getVRDisplays = function() {

		console.warn( 'THREE.VREffect: getVRDisplays() is being deprecated.' );
		return vrDisplays;

	};

	this.setSize = function( width, height, updateStyle ) {

		rendererSize = { width: width, height: height };
		rendererUpdateStyle = updateStyle;

		if ( scope.isPresenting ) {

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			renderer.setPixelRatio( 1 );
			renderer.setSize( eyeParamsL.renderWidth * 2, eyeParamsL.renderHeight, false );

		} else {

			renderer.setPixelRatio( rendererPixelRatio );
			renderer.setSize( width, height, updateStyle );

		}

	};

	// VR presentation

	var canvas = renderer.domElement;
	var defaultLeftBounds = [ 0.0, 0.0, 0.5, 1.0 ];
	var defaultRightBounds = [ 0.5, 0.0, 0.5, 1.0 ];

	function onVRDisplayPresentChange() {

		var wasPresenting = scope.isPresenting;
		scope.isPresenting = vrDisplay !== undefined && vrDisplay.isPresenting;

		if ( scope.isPresenting ) {

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			var eyeWidth = eyeParamsL.renderWidth;
			var eyeHeight = eyeParamsL.renderHeight;

			if ( ! wasPresenting ) {

				rendererPixelRatio = renderer.getPixelRatio();
				rendererSize = renderer.getSize();

				renderer.setPixelRatio( 1 );
				renderer.setSize( eyeWidth * 2, eyeHeight, false );

			}

		} else if ( wasPresenting ) {

			renderer.setPixelRatio( rendererPixelRatio );
			renderer.setSize( rendererSize.width, rendererSize.height, rendererUpdateStyle );

		}

	}

	window.addEventListener( 'vrdisplaypresentchange', onVRDisplayPresentChange, false );

	this.setFullScreen = function( boolean ) {

		return new Promise( function( resolve, reject ) {

			if ( vrDisplay === undefined ) {

				reject( new Error( 'No VR hardware found.' ) );
				return;

			}

			if ( scope.isPresenting === boolean ) {

				resolve();
				return;

			}

			if ( boolean ) {

				resolve( vrDisplay.requestPresent( [ { source: canvas } ] ) );

			} else {

				resolve( vrDisplay.exitPresent() );

			}

		} );

	};

	this.requestPresent = function() {

		return this.setFullScreen( true );

	};

	this.exitPresent = function() {

		return this.setFullScreen( false );

	};

	this.requestAnimationFrame = function( f ) {

		if ( vrDisplay !== undefined ) {

			return vrDisplay.requestAnimationFrame( f );

		} else {

			return window.requestAnimationFrame( f );

		}

	};

	this.cancelAnimationFrame = function( h ) {

		if ( vrDisplay !== undefined ) {

			vrDisplay.cancelAnimationFrame( h );

		} else {

			window.cancelAnimationFrame( h );

		}

	};

	this.submitFrame = function() {

		if ( vrDisplay !== undefined && scope.isPresenting ) {

			vrDisplay.submitFrame();

		}

	};

	this.autoSubmitFrame = true;

	// render

	var cameraL = new THREE.PerspectiveCamera();
	cameraL.layers.enable( 1 );

	var cameraR = new THREE.PerspectiveCamera();
	cameraR.layers.enable( 2 );

	this.render = function( scene, camera, renderTarget, forceClear ) {

		if ( vrDisplay && scope.isPresenting ) {

			var autoUpdate = scene.autoUpdate;

			if ( autoUpdate ) {

				scene.updateMatrixWorld();
				scene.autoUpdate = false;

			}

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			var eyeParamsR = vrDisplay.getEyeParameters( 'right' );

			eyeTranslationL.fromArray( eyeParamsL.offset );
			eyeTranslationR.fromArray( eyeParamsR.offset );

			if ( Array.isArray( scene ) ) {

				console.warn( 'THREE.VREffect.render() no longer supports arrays. Use object.layers instead.' );
				scene = scene[ 0 ];

			}

			// When rendering we don't care what the recommended size is, only what the actual size
			// of the backbuffer is.
			var size = renderer.getSize();
			var layers = vrDisplay.getLayers();
			var leftBounds;
			var rightBounds;

			if ( layers.length ) {

				var layer = layers[ 0 ];

				leftBounds = layer.leftBounds !== null && layer.leftBounds.length === 4 ? layer.leftBounds : defaultLeftBounds;
				rightBounds = layer.rightBounds !== null && layer.rightBounds.length === 4 ? layer.rightBounds : defaultRightBounds;

			} else {

				leftBounds = defaultLeftBounds;
				rightBounds = defaultRightBounds;

			}

			renderRectL = {
				x: Math.round( size.width * leftBounds[ 0 ] ),
				y: Math.round( size.height * leftBounds[ 1 ] ),
				width: Math.round( size.width * leftBounds[ 2 ] ),
				height: Math.round( size.height * leftBounds[ 3 ] )
			};
			renderRectR = {
				x: Math.round( size.width * rightBounds[ 0 ] ),
				y: Math.round( size.height * rightBounds[ 1 ] ),
				width: Math.round( size.width * rightBounds[ 2 ] ),
				height: Math.round( size.height * rightBounds[ 3 ] )
			};

			if ( renderTarget ) {

				renderer.setRenderTarget( renderTarget );
				renderTarget.scissorTest = true;

			} else {

				renderer.setRenderTarget( null );
				renderer.setScissorTest( true );

			}

			if ( renderer.autoClear || forceClear ) renderer.clear();

			if ( camera.parent === null ) camera.updateMatrixWorld();

			camera.matrixWorld.decompose( cameraL.position, cameraL.quaternion, cameraL.scale );
			camera.matrixWorld.decompose( cameraR.position, cameraR.quaternion, cameraR.scale );

			var scale = this.scale;
			cameraL.translateOnAxis( eyeTranslationL, scale );
			cameraR.translateOnAxis( eyeTranslationR, scale );

			if ( vrDisplay.getFrameData ) {

				vrDisplay.depthNear = camera.near;
				vrDisplay.depthFar = camera.far;

				vrDisplay.getFrameData( frameData );

				cameraL.projectionMatrix.elements = frameData.leftProjectionMatrix;
				cameraR.projectionMatrix.elements = frameData.rightProjectionMatrix;

			} else {

				cameraL.projectionMatrix = fovToProjection( eyeParamsL.fieldOfView, true, camera.near, camera.far );
				cameraR.projectionMatrix = fovToProjection( eyeParamsR.fieldOfView, true, camera.near, camera.far );

			}

			// render left eye
			if ( renderTarget ) {

				renderTarget.viewport.set( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );
				renderTarget.scissor.set( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );

			} else {

				renderer.setViewport( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );
				renderer.setScissor( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );

			}
			renderer.render( scene, cameraL, renderTarget, forceClear );

			// render right eye
			if ( renderTarget ) {

				renderTarget.viewport.set( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );
				renderTarget.scissor.set( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );

			} else {

				renderer.setViewport( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );
				renderer.setScissor( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );

			}
			renderer.render( scene, cameraR, renderTarget, forceClear );

			if ( renderTarget ) {

				renderTarget.viewport.set( 0, 0, size.width, size.height );
				renderTarget.scissor.set( 0, 0, size.width, size.height );
				renderTarget.scissorTest = false;
				renderer.setRenderTarget( null );

			} else {

				renderer.setViewport( 0, 0, size.width, size.height );
				renderer.setScissorTest( false );

			}

			if ( autoUpdate ) {

				scene.autoUpdate = true;

			}

			if ( scope.autoSubmitFrame ) {

				scope.submitFrame();

			}

			return;

		}

		// Regular render mode if not HMD

		renderer.render( scene, camera, renderTarget, forceClear );

	};

	this.dispose = function() {

		window.removeEventListener( 'vrdisplaypresentchange', onVRDisplayPresentChange, false );

	};

	//

	function fovToNDCScaleOffset( fov ) {

		var pxscale = 2.0 / ( fov.leftTan + fov.rightTan );
		var pxoffset = ( fov.leftTan - fov.rightTan ) * pxscale * 0.5;
		var pyscale = 2.0 / ( fov.upTan + fov.downTan );
		var pyoffset = ( fov.upTan - fov.downTan ) * pyscale * 0.5;
		return { scale: [ pxscale, pyscale ], offset: [ pxoffset, pyoffset ] };

	}

	function fovPortToProjection( fov, rightHanded, zNear, zFar ) {

		rightHanded = rightHanded === undefined ? true : rightHanded;
		zNear = zNear === undefined ? 0.01 : zNear;
		zFar = zFar === undefined ? 10000.0 : zFar;

		var handednessScale = rightHanded ? - 1.0 : 1.0;

		// start with an identity matrix
		var mobj = new THREE.Matrix4();
		var m = mobj.elements;

		// and with scale/offset info for normalized device coords
		var scaleAndOffset = fovToNDCScaleOffset( fov );

		// X result, map clip edges to [-w,+w]
		m[ 0 * 4 + 0 ] = scaleAndOffset.scale[ 0 ];
		m[ 0 * 4 + 1 ] = 0.0;
		m[ 0 * 4 + 2 ] = scaleAndOffset.offset[ 0 ] * handednessScale;
		m[ 0 * 4 + 3 ] = 0.0;

		// Y result, map clip edges to [-w,+w]
		// Y offset is negated because this proj matrix transforms from world coords with Y=up,
		// but the NDC scaling has Y=down (thanks D3D?)
		m[ 1 * 4 + 0 ] = 0.0;
		m[ 1 * 4 + 1 ] = scaleAndOffset.scale[ 1 ];
		m[ 1 * 4 + 2 ] = - scaleAndOffset.offset[ 1 ] * handednessScale;
		m[ 1 * 4 + 3 ] = 0.0;

		// Z result (up to the app)
		m[ 2 * 4 + 0 ] = 0.0;
		m[ 2 * 4 + 1 ] = 0.0;
		m[ 2 * 4 + 2 ] = zFar / ( zNear - zFar ) * - handednessScale;
		m[ 2 * 4 + 3 ] = ( zFar * zNear ) / ( zNear - zFar );

		// W result (= Z in)
		m[ 3 * 4 + 0 ] = 0.0;
		m[ 3 * 4 + 1 ] = 0.0;
		m[ 3 * 4 + 2 ] = handednessScale;
		m[ 3 * 4 + 3 ] = 0.0;

		mobj.transpose();

		return mobj;

	}

	function fovToProjection( fov, rightHanded, zNear, zFar ) {

		var DEG2RAD = Math.PI / 180.0;

		var fovPort = {
			upTan: Math.tan( fov.upDegrees * DEG2RAD ),
			downTan: Math.tan( fov.downDegrees * DEG2RAD ),
			leftTan: Math.tan( fov.leftDegrees * DEG2RAD ),
			rightTan: Math.tan( fov.rightDegrees * DEG2RAD )
		};

		return fovPortToProjection( fovPort, rightHanded, zNear, zFar );

	}

};

/*    Copyright 2017 Jocly
 *
 *    This program is free software: you can redistribute it and/or  modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *    As a special exception, the copyright holders give permission to link the
 *    code of portions of this program with the OpenSSL library under certain
 *    conditions as described in each individual source file and distribute
 *    linked combinations including the program with the OpenSSL library. You
 *    must comply with the GNU Affero General Public License in all respects
 *    for all of the code used other than as permitted herein. If you modify
 *    file(s) with this exception, you may extend this exception to your
 *    version of the file(s), but you are not obligated to do so. If you do not
 *    wish to do so, delete this exception statement from your version. If you
 *    delete this exception statement from all source files in the program,
 *    then also delete it in the license file.
 */

JoclyAR = (function($) {

    var running = false;
    var videoElement = null;
    var canvas, context;
    var width = 320, height = 240;
    var modelSize = 5;
    var scale = .2;
    var threeCtx = null;
    var processing = false;
    var arWorker = null;
    var oposition = new THREE.Vector3();
    var oeuler = new THREE.Euler();

    function AnimationFrame() {
        if(!running)
            return;
        if(!processing && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
            processing = true;
            context.drawImage(videoElement,0,0,width,height);
            var imageData = context.getImageData(0, 0, width, height);
            arWorker.postMessage({
                type: "Detect",
                imageData: imageData,
                vwidth: videoElement.clientWidth,
                vheight: videoElement.clientHeight
            });
        } else
            requestAnimationFrame(AnimationFrame);
    }

    var mouseDownY = null, scale0 = scale;
    function MouseMove(event) {
        var y = event.clientY;
        var ratio = (y-mouseDownY) / event.target.clientHeight;
        scale = scale0 * (1 - ratio);
        threeCtx.animControl.trigger();
    }
    function Mouse(event) {
        switch(event.type) {
            case 'mousedown':
                if(event.button==1 || event.button==2) {
                    mouseDownY = event.clientY;
                    scale0 = scale;
                    event.target.addEventListener('mousemove',MouseMove);
                }
                break;
            case 'mouseup':
            case 'mouseout':
                event.target.removeEventListener('mousemove',MouseMove);
        }
    }

    var exports = {
        start: function() {
            JoclyPlazza.webrtc.startLocal(true,{
                video: {
                    width: { ideal: width },
                    height: { ideal: height },
                    facingMode: "environment",
                    frameRate: {ideal: 24 }
                }
            });
        },
        stop: function() {
            JoclyPlazza.webrtc.setChannel(null);
        },
        attach: function(data) {
            videoElement = data.element;
            JoclyPlazza.webrtc.attachMediaStream(data.element,data.stream);
            canvas = document.createElement("canvas");
            canvas.setAttribute("width",width);
            canvas.setAttribute("height",height);
            Object.assign(canvas.style,{
                width: width,
                height: height,
                visibility : "hidden",
                position: "absolute",
                "z-index": -2,
                top: 0,
            });
            document.body.appendChild(canvas);
            /*
            $("<canvas/>")
                .attr("width", width).attr("height",height)
                .width(width).height(height)
                .css({
                    visibility : "hidden",
                    position: "absolute",
                    "z-index": -2,
                    top: 0,
            }).appendTo("body");
            */
            context = canvas.getContext("2d");
            threeCtx = data.threeCtx;
            running = true;
            processing = false;
            threeCtx.renderer.domElement.addEventListener("mousedown",Mouse);
            threeCtx.renderer.domElement.addEventListener("mouseup",Mouse);
            threeCtx.renderer.domElement.addEventListener("mouseout",Mouse);

       		arWorker = new Worker(JoclyPlazza.config.baseURL+JoclyPlazza.config.joclyPath+'/jocly.arworker.js');
            arWorker.onmessage = function(e) {
                processing = false;
                var message = e.data;
                switch(message.type) {
                    case "Pose": 
                        var rotation = message.rotation;
                        var translation = message.translation;

                        threeCtx.body.position.set(0,0,0);
                        threeCtx.camera.lookAt(new THREE.Vector3(0,-1,0));

                        threeCtx.harbor.scale.set(modelSize*scale,modelSize*scale,modelSize*scale);

                        threeCtx.harbor.rotation.set(
                            -Math.asin(-rotation[1][2]),
                            Math.atan2(rotation[1][0], rotation[1][1]),
                            -Math.atan2(rotation[0][2], rotation[2][2])                            
                        );
                        threeCtx.harbor.position.set(
                            translation[0],
                            -translation[2],
                            -translation[1]                            
                        );
                        if(!threeCtx.harbor.position.equals(oposition) || 
                            !threeCtx.harbor.rotation.equals(oeuler))
                            threeCtx.animControl.trigger();
                        oposition.copy(threeCtx.harbor.position);
                        oeuler.copy(threeCtx.harbor.rotation);
                        break;
                    case "NoPose":
                        break;
                }
                setTimeout(AnimationFrame,20);
            }
            arWorker.postMessage({
                type: "Init",
                baseUrl: JoclyPlazza.config.baseURL+JoclyPlazza.config.joclyPath,
                modelSize: modelSize,
                width: width,
                height: height
            });
            requestAnimationFrame(AnimationFrame);
        },
        detach: function(data) {
            threeCtx.renderer.domElement.removeEventListener("mousedown",Mouse);
            threeCtx.renderer.domElement.removeEventListener("mouseup",Mouse);
            threeCtx.renderer.domElement.removeEventListener("mouseout",Mouse);
            JoclyPlazza.webrtc.detachMediaStream(data.element);
            videoElement = null;
            running = false;
            canvas.parentNode.removeChild(canvas);
            context = null;
            threeCtx = null;
            arWorker.terminate();
            arWorker = null;
        }
    }

    return exports;


})();


/*    Copyright 2017 Jocly
 *
 *    This program is free software: you can redistribute it and/or  modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *    As a special exception, the copyright holders give permission to link the
 *    code of portions of this program with the OpenSSL library under certain
 *    conditions as described in each individual source file and distribute
 *    linked combinations including the program with the OpenSSL library. You
 *    must comply with the GNU Affero General Public License in all respects
 *    for all of the code used other than as permitted herein. If you modify
 *    file(s) with this exception, you may extend this exception to your
 *    version of the file(s), but you are not obligated to do so. If you do not
 *    wish to do so, delete this exception statement from your version. If you
 *    delete this exception statement from all source files in the program,
 *    then also delete it in the license file.
 */

function JHStateMachine() {
}

JHStateMachine.prototype={}

JHStateMachine.prototype.init=function() {
	this.smState=null;
	this.smStates={};
	this.smEventQueue=[];
	this.smScheduled=false;
	this.smPauseNotified=false;
	this.smPaused=true;
	this.smHistory=[];
	this.smGroups={};
}

JHStateMachine.prototype.smDebug=function() {}
JHStateMachine.prototype.smWarning=function() {}
JHStateMachine.prototype.smError=function() {}

JHStateMachine.prototype.smTransition=function(states,events,newState,methods) {
	states=this.smSolveStates(states);
	if(typeof(events)=="string") {
		events=[events];
	}
	if(typeof(methods)=="string") {
		methods=[methods];
	}
	for(var s in states) {
		var stateName=states[s];
		if(typeof(this.smStates[stateName])=="undefined") {
			this.smStates[stateName]={
				transitions: {},
				enteringMethods: [],
				leavingMethods: []
			}
		}
		for(var e in events) {
			var eventName=events[e];
			if(typeof(this.smStates[stateName].transitions[eventName])=="undefined") {
				this.smStates[stateName].transitions[eventName]={
					state: (newState!=null)?newState:stateName,
					methods: []
				};
			}
			for(var m in methods) {
				var methodName=methods[m];
				this.smStates[stateName].transitions[eventName].methods.push(methodName);				
			}
		}
	}
	if(newState!=null && typeof(this.smStates[newState])=="undefined") {
		this.smStates[newState]={
			transitions: {},
			enteringMethods: [],
			leavingMethods: []				
		}
	}
}

JHStateMachine.prototype.smEntering=function(states,methods) {
	if(typeof(states)=="string") {
		states=[states];
	}
	if(typeof(methods)=="string") {
		methods=[methods];
	}
	for(var s in states) {
		var stateName=states[s];
		if(typeof(this.smStates[stateName])=="undefined") {
			this.smStates[stateName]={
				transitions: {},
				enteringMethods: [],
				leavingMethods: []
			}
		}
		for(var m in methods) {
			var methodName=methods[m];
			this.smStates[stateName].enteringMethods.push(methodName);				
		}
	}
}

JHStateMachine.prototype.smLeaving=function(states,methods) {
	if(typeof(states)=="string") {
		states=[states];
	}
	if(typeof(methods)=="string") {
		methods=[methods];
	}
	for(var s in states) {
		var stateName=states[s];
		if(typeof(this.smStates[stateName])=="undefined") {
			this.smStates[stateName]={
				transitions: {},
				enteringMethods: [],
				leavingMethods: []
			}
		}
		for(var m in methods) {
			var methodName=methods[m];
			this.smStates[stateName].leavingMethods.push(methodName);				
		}
	}
}

JHStateMachine.prototype.smStateGroup=function(group,states) {
	if(typeof(states)=="string")
		states=[states];
	if(typeof(this.smGroups[group])=="undefined")
		this.smGroups[group]=[];
	states=this.smSolveStates(states);
	for(var i in states) {
		var state=states[i];
		if(!this.smContained(state,this.smGroups[group]))
			this.smGroups[group].push(state);
	}
}

JHStateMachine.prototype.smSetInitialState=function(state) {
	this.smState=state;
}

JHStateMachine.prototype.smGetState=function() {
	return this.smState;
}

JHStateMachine.prototype.smHandleEvent=function(event,args) {
	
	if(typeof(this.smStates[this.smState])=="undefined") {
		console.error("Unknown state '",this.smState,"'");
		return;
	}
	var hEntry={
			date: new Date().getTime(),
			fromState: this.smState,
			event: event,
			methods: []
	}
	try {
		hEntry.args=JSON.stringify(args);
	} catch(e) {
		//console.error("handleEvent(event,...) JSON.stringify(args): ",e);
	}
	
	var transition=this.smStates[this.smState].transitions[event];
	if(typeof(transition)=="undefined") {
		console.warn("JHStateMachine: Event '",event,"' not handled in state '",this.smState,"'");
		return;
	}

	this.smCurrentEvent=event;
	
	var stateChanged=(this.smState!=transition.state);

	if(stateChanged) {
		var leavingMethods=this.smStates[this.smState].leavingMethods;
		for(var i in leavingMethods) {
			try {
				hEntry.methods.push(leavingMethods[i]);
				if(typeof leavingMethods[i]=="function")
					leavingMethods[i].call(this,args);
				else
					this['$'+leavingMethods[i]](args);
			} catch(e) {
				console.error("Exception in leaving [",this.smState,"] --> "+
						(typeof leavingMethods[i]=="function"?leavingMethods[i].name:leavingMethods[i])
				+"(",args,"): ",e);
				throw e;
			}		
		}
	}
	
	for(var i in transition.methods) {
		try {
			hEntry.methods.push(transition.methods[i]);
			if(typeof transition.methods[i]=="function")
				transition.methods[i].call(this,args);
			else
				this['$'+transition.methods[i]](args);
		} catch(e) {
			console.error("Exception in ["+this.smState+"] -- "+event+" --> "+
					(typeof transition.methods[i]=="function"?transition.methods[i].name:transition.methods[i])
				+"(",args,"): ",
					e);
			throw e;
		}
	}
	
	this.smJHStateMachineLeavingState(this.smState,event,args);


	this.smDebug("{",this.smState,"} == [",event,"] ==> {",transition.state,"}");


	this.smState=transition.state;

	if(stateChanged) {
		var enteringMethods=this.smStates[this.smState].enteringMethods;
		for(var i in enteringMethods) {
			try {
				hEntry.methods.push(enteringMethods[i]);
				if(typeof enteringMethods[i]=="function")
					enteringMethods[i].call(this,args);
				else
					this['$'+enteringMethods[i]](args);
			} catch(e) {
				console.error("Exception in entering ["+this.smState+"] --> "+
						(typeof enteringMethods[i]=="function"?enteringMethods[i].name:enteringMethods[i])
				+"(",args,"): ",e);
				throw e;
			}		
		}
	}
	
	this.smCurrentEvent=null;

	this.smJHStateMachineEnteringState(this.smState,event,args);
	
	hEntry.toState=this.smState;
	this.smHistory.splice(0,0,hEntry);
	while(this.smHistory.length>50)
		this.smHistory.pop();	
}

JHStateMachine.prototype.smPlay=function() {
	var $this=this;
	if(this.smPaused) {
		this.smPaused=false;
		setTimeout(function() {
			$this.smRun();
		},0);
	}
}

JHStateMachine.prototype.smPause=function() {
	this.smPaused=true;
}

JHStateMachine.prototype.smStep=function() {
	this.smPauseNotified=false;
	if(this.smEventQueue.length>0) {
		var eventItem=this.smEventQueue.shift();
		this.smHandleEvent(eventItem.event,eventItem.args);
	}
	this.smNotifyPause();
}

JHStateMachine.prototype.smRun=function() {
	this.smScheduled=false;

	var stepCount=0;
	while(this.smEventQueue.length>0) {
		if(this.smPaused) {
			this.smRunEnd(stepCount);
			return;
		} else {
			stepCount++;
			this.smStep();
		}
	}
	while(this.smPaused==false && this.smEventQueue.length>0) {
		stepCount++;
		this.smStep();
	}
	this.smRunEnd(stepCount);
}

JHStateMachine.prototype.smRunEnd=function() {
}

JHStateMachine.prototype.smQueueEvent=function(event,args) {
	var self=this;
	this.smEventQueue.push({event: event, args: args});
	this.smNotifyPause();
	if(!this.smScheduled) {
		this.smScheduled=true;
		setTimeout(function() {
			self.smRun();
		},0);
	}
}

JHStateMachine.prototype.smNotifyPause=function() {
	if(this.smEventQueue.length>0 && this.smPaused==true) {
		var item=this.smEventQueue[0];
		this.smJHStateMachinePaused(item.event,item.args);
	}
}

JHStateMachine.prototype.smJHStateMachineEnteringState=function(state,event,args) {
}

JHStateMachine.prototype.smJHStateMachineLeavingState=function(state,event,args) {
}

JHStateMachine.prototype.smJHStateMachinePaused=function(state,event,args) {
}

JHStateMachine.prototype.smGetTable=function() {
	var cells={}
	for(var s in this.smStates) {
		var state=this.smStates[s];
		for(var e in state.transitions) {
			var toState=state.transitions[e].state;
			var cellname=s+"/"+toState;
			if(typeof(cells[cellname])=="undefined") {
				cells[cellname]={};
			}
			cells[cellname][e]=[];
			if(s!=toState) {
				for(var m in state.leavingMethods) {
					cells[cellname][e].push(state.leavingMethods[m]);
				}
			}
			for(var m in state.transitions[e].methods) {
				cells[cellname][e].push(state.transitions[e].methods[m]);
			}
			if(s!=toState) {
				for(var m in this.smStates[toState].enteringMethods) {
					cells[cellname][e].push(this.smStates[toState].enteringMethods[m]);
				}
			}
		}
	}
	var table=["<table><tr><td></td>"];
	for(var s in this.smStates) {
		table.push("<td class='state'>"+s+"</td>");
	}
	table.push("</tr>");
	for(var s1 in this.smStates) {
		table.push("<tr><td class='state'>"+s1+"</td>");
		var state1=this.smStates[s1];
		for(var s2 in this.smStates) {
			var state2=this.smStates[s2];
			var cellname=s1+"/"+s2;
			if(typeof(cells[cellname])=="undefined") {
				table.push("<td class='empty'></td>");
			} else {
				table.push("<td class='transition'>");
				for(var e in cells[cellname]) {
					table.push("<div class='event'>");
					table.push("<div class='eventname'>"+e+"</div>");
					for(var m in cells[cellname][e]) {
						table.push("<div class='method'>"+cells[cellname][e][m]+"</div>");
					}
					table.push("</div>");
				}
				table.push("</td>");
			}
		}
		table.push("</tr>");
	}
	table.push("</table>");
	return table.join("");
}

JHStateMachine.prototype.smGetHistoryTable=function() {
	var table=["<table><tr><th>Date</th><th>To</th><th>Event</th><th>Methods</th><th>From</th></tr>"];
	for(var i in this.smHistory) {
		var hEntry=this.smHistory[i];
		table.push("<tr>");
		var date=new Date(hEntry.date);
		var timestamp=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"."+date.getMilliseconds();
		table.push("<td class='timestamp'>"+timestamp+"</td>");
		table.push("<td class='to'>"+hEntry.toState+"</td>");
		table.push("<td><div class='event'>"+hEntry.event+"</div><div class='args'>("+hEntry.args+")</div></td>");
		table.push("<td class='methods'>");
		for(var j in hEntry.methods) {
			table.push(hEntry.methods[j]+"<br/>");
		}
		table.push("</td>");
		table.push("<td class='from'>"+hEntry.fromState+"</td>");
		table.push("</tr>");		
	}
	table.push("</table>");
	return table.join("");
}

JHStateMachine.prototype.smSolveStates=function(states) {
	var states0=[];
	if(typeof(states)=="string") {
		states=[states];
	}
	for(var s in states) {
		var state=states[s];
		if(typeof(this.smGroups[state])=="undefined") {
			if(!this.smContained(state,states0))
				states0.push(state);
		} else {
			for(var s0 in this.smGroups[state])
				if(!this.smContained(this.smGroups[state][s0]),states0)
					states0.push(this.smGroups[state][s0]);
		}
	}
	return states0;
}

JHStateMachine.prototype.smContained=function(state,group) {
	for(var i in group) {
		if(state==group[i])
			return true;
	}
	return false;
}

JHStateMachine.prototype.smCheck=function() {
	var result={
		missing: [],
		unused: []
	}
	var existingFnt=[];
	for(var s in this.smStates) {
		for(var i in this.smStates[s].enteringMethods) {
			var fnt=this.smStates[s].enteringMethods[i];
			existingFnt[fnt]=true;
		}
		for(var i in this.smStates[s].leavingMethods) {
			var fnt=this.smStates[s].leavingMethods[i];
			existingFnt[fnt]=true;
		}
		for(var e in this.smStates[s].transitions) {
			var event=this.smStates[s].transitions[e];
			for(var i in event.methods) {
				var fnt=event.methods[i];
				existingFnt[fnt]=true;
			}
		}
	}
	for(var fnt in existingFnt) {
		if(typeof(this['$'+fnt])!="function") {
			result.missing.push(fnt);
			console.error("JHStateMachine: missing function $",fnt);
		}
	}
	for(var k in this) {
		try {
			if(k[0]=='$' && typeof(this[k])=="function") {
				var fnt=k.substr(1);
				if(typeof(existingFnt[fnt])=="undefined") {
					//this.warning("JHStateMachine.check "+this.target.name+": unused function "+k);
					result.unused.push(fnt);
				}
			}
		} catch(e) {}
	}
	return result;
}

/*    Copyright 2017 Jocly
 *
 *    This program is free software: you can redistribute it and/or  modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *    As a special exception, the copyright holders give permission to link the
 *    code of portions of this program with the OpenSSL library under certain
 *    conditions as described in each individual source file and distribute
 *    linked combinations including the program with the OpenSSL library. You
 *    must comply with the GNU Affero General Public License in all respects
 *    for all of the code used other than as permitted herein. If you modify
 *    file(s) with this exception, you may extend this exception to your
 *    version of the file(s), but you are not obligated to do so. If you do not
 *    wish to do so, delete this exception statement from your version. If you
 *    delete this exception statement from all source files in the program,
 *    then also delete it in the license file.
 */

exports.view = View = {
    Game: {},
    Board: {},
};

if(window.JoclyXdViewCleanup)
	window.JoclyXdViewCleanup();

(function() {

	window.JoclyXdViewCleanup = function() {
		var renderer = threeCtx && threeCtx.renderer;
		if(renderer) {
			renderer.forceContextLoss();
			renderer.context = null;
			renderer.domElement = null;
			delete threeCtx.renderer;
		}
		if(arStream)
			AR(null);

		$(document).unbind("joclyhub.webrtc",WebRTCHandler);
			
	}

	var area, currentSkin, logger, xdv, VSIZE, VHALF, htStateMachine, threeCtx = null, 
		SCALE3D = 0.001, resourcesMap = {}, resources, arStream = null;
	
	// hack to ensure mouse and touch events do not collide
	var lastTouchStart=0, lastJoclyclick=0; 
	
	/* ======================================== */
	
	var LOADING_TEXT_RESOURCE="";
	if(typeof JoclyHub!="undefined") {
		LOADING_TEXT_RESOURCE=JoclyHub.hubPath+"/res/images/loading-txt.png";
	} else if(typeof JoclyPlazza!="undefined") {
		LOADING_TEXT_RESOURCE=JoclyPlazza.config.baseURL+JoclyPlazza.config.pzPath+"/images/loading-txt.png";		
	}
	
	if(typeof CustomEvent == "undefined") {
		  function CustomEvent ( event, params ) {
			  params = params || { bubbles: false, cancelable: false };
			  var evt = document.createEvent( 'Event' );
			  evt.initEvent( event, params.bubbles, params.cancelable );
			  return evt;
		  };
		  CustomEvent.prototype = window.Event.prototype;
		  window.CustomEvent = CustomEvent;		
	}
	
	var Class = function() {
	};
	(function() {
		var initializing = false, fnTest = /xyz/.test(function() {
		}) ? /\b_super\b/ : /.*/;
		Class.extend = function(prop) {
			var _super = this.prototype;
			initializing = true;
			var prototype = new this();
			initializing = false;
			for ( var name in prop) {
				prototype[name] = typeof prop[name] == "function"
						&& typeof _super[name] == "function"
						&& fnTest.test(prop[name]) ? (function(name, fn) {
					return function() {
						var tmp = this._super;
						this._super = _super[name];
						var ret = fn.apply(this, arguments);
						this._super = tmp;
						return ret;
					};
				})(name, prop[name]) : prop[name];
			}
			function Class(args) {
				if (!initializing && this.init)
					if (arguments.length > 0 && args.jBlocksArgsList)
						this.init.apply(this, args);
					else
						this.init.apply(this, arguments);
			}
			Class.prototype = prototype;
			Class.prototype.constructor = Class;
			Class.extend = arguments.callee;
			return Class;
		};
	})();

	/* ======================================== */

	var WebRTC;
	if(typeof JoclyPlazza!="undefined") {
		logger=JoclyPlazza.getLogger("htsm","logHTSM");
		WebRTC=JoclyPlazza.webrtc;
	} else if(typeof JoclyHub!="undefined")
		WebRTC=JoclyHub.webrtc;
	var logResourcesLoad=false;

	function Log() {
		console.info.apply(console,arguments);
	}

	View.Board.Log = Log;
	View.Game.Log = Log;
	
	function HTStateMachine() {}
	HTStateMachine.prototype=new JHStateMachine();
	
	HTStateMachine.prototype.smError=function() { 
		if(typeof JoclyPlazza!="undefined" || (JoclyHub && JoclyHub.request.debughtsm)) {
			Log.apply(null,arguments); 
		};
	}
	HTStateMachine.prototype.smWarning=function() { 
		if(typeof JoclyPlazza!="undefined" || (JoclyHub && JoclyHub.request.debughtsm)) {
			Log.apply(null,arguments);
		}
	};
	HTStateMachine.prototype.smDebug=function() { 
		if(typeof JoclyPlazza!="undefined" || (typeof JoclyHub!="undefined" && JoclyHub.request.debughtsm)) {
			Log.apply(null,arguments);
		}
	}
	
	function Diff(oOld,oNew) {
		var diff={};
		var diffSet=false;
		for(var i in oNew) {
			if(oNew.hasOwnProperty(i)) {
				if(!oOld.hasOwnProperty(i)) {
					diff[i]=oNew[i];
					diffSet=true;
				} else if(typeof oNew[i]=="object") {
					var diff0=Diff(oOld[i],oNew[i]);
					if(diff0) {
						diff[i]=diff0;
						diffSet=true;
					}
				} else if(oNew[i]!=oOld[i]) {
					diff[i]=oNew[i];
					diffSet=true;					
				}
			}
		}
		return diffSet?diff:null;
	}
	
	var resLoadingMask=null;
	var resLoadingCount=0;
	function IncrementResLoading() {
		if(resLoadingCount++==0) {
			resLoadingMask=$(".jocly-res-loading-mask");
			if(resLoadingMask.length==0)
				resLoadingMask=$("<div/>").addClass("jocly-res-loading-mask").css({
					position: "absolute",
					top: 0,
					left: 0,
					width: $("body").width(),
					height: $("body").height(),
					"background-color": "rgba(0,0,0,.8)",
					"background-image": "url("+LOADING_TEXT_RESOURCE+")",
					"background-position": "center center",
					"background-repeat": "no-repeat",
					"z-index": 100000,
				}).appendTo($("body"));
			else
				resLoadingMask.show();
		}
	}
	function DecrementResLoading() {
		if(--resLoadingCount==0) {
			if(resLoadingMask)
				resLoadingMask.hide();
		}
	}
	
	var materialMaps={};
	function GetMaterialMap(map,callback) {
		var $this=this;
		if(materialMaps[map]) 
			callback(materialMaps[map]);
		else{
			var loader = new THREE.TextureLoader();
			loader.setCrossOrigin("anonymous");
			if(logResourcesLoad)
				console.log("Loading map",map);
			IncrementResLoading();
			console.info("TODO map",map);
			loader.load(
                // ressource url
                map,
                // Function when resource is loaded
                function(texture){
                    materialMaps[map]=texture;
                    if(logResourcesLoad)
                        console.log("Loaded",map);
                    DecrementResLoading();
                    threeCtx.animControl.trigger();
                    callback(materialMaps[map]);
                },
                // Function called when download progresses
                function ( xhr ) {
                    //console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
                },
                // Function called when download errors
                function ( xhr ) {
                    if(logResourcesLoad)
                        console.log("(not) Loaded",map);
                    DecrementResLoading();
                    threeCtx.animControl.trigger();
                    callback(null);
                });
			}
	}

	var pendingGetResource=[];
	function GetResource(res,callback) {
		var resource=resources[res];
		if(resource===undefined) {
			resource=resources[res]={
				pending: [callback],
				status: "loading",
			}

			var getResFnt=null;
			var m=/^(.*\|)(.*?)$/.exec(res);
			if(m) {
				var prefix=m[1];
				var url=m[2];
				for(var r in resourcesMap) {
					var m2=/^(.*\|)(.*?)$/.exec(r);
					if(m2)
						if(prefix==m[1] && url.substr(-m2[2].length)==m2[2]) {
							getResFnt=resourcesMap[r];
							break;
						}
				}			
			}
			
			if(/^image\|/.test(res)) {
				var imgSrc=/^image\|(.*)/.exec(res)[1];
				if(logResourcesLoad)
					console.log("Loading resource",res);
				function HandleImage(image) {
					resource.image=image;
					if(logResourcesLoad)
						console.log("Loaded",res);
					resource.status="loaded";
					resource.imgSrc=imgSrc;
					DecrementResLoading();
					for(var i=0;i<resource.pending.length;i++)
						resource.pending[i](resource.image,imgSrc);
					resource.pending=null;
					if(threeCtx)
						threeCtx.animControl.trigger();
				}
				IncrementResLoading();
				if(getResFnt) {
					getResFnt(function(data) {
						var image=new Image();
						image.onload=function() {
							HandleImage(image);							
						}
						image.src=data;
					});
				} else {
					var image=new Image();
					image.onload=function() {
						HandleImage(image)
					}
					image.src=imgSrc;
				}
			} else if(/^smoothedfilegeo\|/.test(res)) {
				if(logResourcesLoad)
					console.log("Loading resource",res);
				if(!threeCtx) {
					delete resources[res];
					pendingGetResource.push([res,callback]);
					return;
				}
				var m=/^smoothedfilegeo\|([^\|]*)\|(.*)$/.exec(res);
				var smooth=parseInt(m[1]);
				var file=m[2];
				IncrementResLoading();
				function HandleGeoMat( geometry , materials ) {
					if(logResourcesLoad)
						console.log("Loaded",res);

                    // not sure of the side effects here but this removes the console
                    // warnings "THREE.DirectGeometry.fromGeometry(): Undefined vertexUv"
                    for(var i = 0;i<geometry.faceVertexUvs.length;i++) {
                        for(var j=0;j<geometry.faceVertexUvs[i].length;j++) {
                            var uv = geometry.faceVertexUvs[i][j];
                            if(uv===undefined)
                                geometry.faceVertexUvs[i][j] = [{x:0,y:0},{x:0,y:0},{x:0,y:0}];
                        }
                        for(;j<geometry.faces.length;j++)
                            geometry.faceVertexUvs[i].push([{x:0,y:0},{x:0,y:0},{x:0,y:0}]);
                    }

                    if (smooth > 0){
						var modifier = new THREE.SubdivisionModifier( smooth );
						modifier.modify( geometry ); 
					}
					resource.status="loaded";
					DecrementResLoading();
					resource.geometry=geometry;
					resource.materials=materials;
					for(var i=0;i<resource.pending.length;i++)
						resource.pending[i](geometry,materials);
					resource.pending=null;
					threeCtx.animControl.trigger(3000);
				}
				if(getResFnt) {
					getResFnt(function(data) {
						try {
						var parsed=threeCtx.loader.parse(JSON.parse(data));
						HandleGeoMat(parsed.geometry,parsed.materials);
						} catch(e) {
							debugger;
						}
					});
				} else 
					threeCtx.loader.load(file , HandleGeoMat);
			} else if(/^json\|/.test(res)) {
				if(logResourcesLoad)
					console.log("Loading resource",res);
				IncrementResLoading();
				var url=/^json\|(.*)/.exec(res)[1];
				function JSONResult(event,data) {
					if(logResourcesLoad)
						console.log("Loaded",res);
					var path=/^(\.)?(.*)$/.exec(url);
					if(data.url.substr(-path[2].length)==path[2]) {
						$(document).unbind("jocly.json-resource",JSONResult);
						resource.status="loaded";
						DecrementResLoading();
						resource.data=data.data;
						for(var i=0;i<resource.pending.length;i++)
							resource.pending[i](resource.data);
						resource.pending=null;
						if(threeCtx)
							threeCtx.animControl.trigger();
					} else
						console.warn("Expecting",url,"got",data.url)
					
				}
				$(document).bind("jocly.json-resource",JSONResult);
				$("<script/>").attr("type","text/javascript").attr("jocly-type","json-resource").attr("src",url).appendTo($("head"));
			} else if(/^json2\|/.test(res)) {
				if(logResourcesLoad)
					console.log("Loading resource",res);
				IncrementResLoading();
				var url=/^json2\|(.*)/.exec(res)[1];
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        if(logResourcesLoad)
                            console.log("Loaded",res);
                        var data = JSON.parse(xhr.responseText);
                        resource.status="loaded";
                        DecrementResLoading();
                        resource.data=data;
                        for(var i=0;i<resource.pending.length;i++)
                            resource.pending[i](resource.data);
                        resource.pending=null;
                        if(threeCtx)
                            threeCtx.animControl.trigger();
                    }
                }
                xhr.open('GET', url, true);
                xhr.send(null);

			} else if(/^font\|/.test(res)) {
				if(logResourcesLoad)
                    console.info("font path",fontPath);
                var fontPath = /^font\|(.*)/.exec(res)[1];
				IncrementResLoading();
                var fontLoader = new THREE.FontLoader();
                fontLoader.load(fontPath,function(font){ 
                    DecrementResLoading();
                    resource.status="loaded";
                    resource.font = font;
                    for(var i=0;i<resource.pending.length;i++)
                        resource.pending[i](font);
                    resource.pending=null;
                    if(threeCtx)
                        threeCtx.animControl.trigger();
                });
            }
		} else if(resource.status=="loading") {
            resource.pending.push(callback);
		} else {
			if(/^image\|/.test(res)) {
				callback(resource.image,resource.imgSrc);
			} else if(/^smoothedfilegeo\|/.test(res)) {
				callback(resource.geometry,resource.materials);				
			} else if(/^json\|/.test(res)) {
				callback(resource.data);				
			} else if(/^json2\|/.test(res)) {
				callback(resource.data);
			} else if(/^font\|/.test(res)) {
				callback(resource.font);				
			}
		}
	}
	
	function ResumePendingResources() {
		if(threeCtx)
			while(pendingGetResource.length) {
				var call=pendingGetResource.shift();
				GetResource.call(null,call[0],call[1]);
			}
	}
	
		
	/* ======================================== */
	
	var XDView=Class.extend({
		init: function() {
			this.gadgets = {};
			this.resources = {};
			this.game = null;			
			this.initDone=false;
			this.ratio=0;
			this.center=null;
			this.getMaterialMap=GetMaterialMap;
		},
		createGadget: function(id, options) {
			if(this.ratio>0) {
				if(options.base===undefined)
					options.base={};
				options.base.ratio=this.ratio;
				options.base.center=this.center;
			}
			this.gadgets[id] = new Gadget(id,options);
		},
		updateGadget: function(id, options, delay, callback) {
			var gadget = this.gadgets[id];
			if (gadget) {
				if(arguments.length<3 || delay===undefined)
					delay=0;
				if(arguments.length<4 || callback===undefined)
					callback=function() {}
				gadget.update(options,delay,callback);
			}
		},
		removeGadget: function(id) {
			var gadget = this.gadgets[id];
			if (gadget) {
				gadget.unbuild();
				delete this.gadgets[id];
			}			
		},
		showGadget: function(id) {
			this.updateGadget(id,{
				base: {
					visible: true,
				},
			});
		},
		hideGadget: function(id) {
			this.updateGadget(id,{
				base: {
					visible: false,
				},
			});
		},
		updateArea: function(ratio,center) {
			this.ratio=ratio;
			this.center=center;
			for ( var gi in this.gadgets)
				this.gadgets[gi].update({
					base: {
						ratio: ratio,
						center: center,
					},
				});
		},
		redisplayGadgets: function() {
			for ( var gi in this.gadgets) {
				var gadget = this.gadgets[gi];
				gadget.update({});
			}
		},
		unbuildGadgets: function() {
			for ( var gi in this.gadgets)
				this.gadgets[gi].unbuild();
		},
		saveGadgetProps: function(id, props, saveName) {
			var gadget = this.gadgets[id];
			if (gadget)
				gadget.saveProps(props, saveName);
		},
		restoreGadgetProps: function(id, saveName, delay, callback) {
			var gadget = this.gadgets[id];
			if (gadget)
				gadget.restoreProps(saveName,delay,callback);
			else if(callback)
				callback();
		},
		listScene: function(){
			console.log("listScene:");
			var accu=[];
			accu["faces"]=0;
			//var crlf="<br>";
			var crlf=" :: ";
			var output="========= Scene summary ===========";
			var nbLights=-1;
			
			
			function getFaces(obj,nbFaces){
				if(obj.geometry){
					var gg=obj.geometry;
					if (gg.faces) nbFaces+=gg.faces.length;
				}
				if(obj.getDescendants){
					var children=obj.getDescendants();
					if (children) nbFaces+=getFaces(children,nbFaces);
				}
				return nbFaces;
			}
			if(threeCtx)if(threeCtx.scene){
				var threeScene=threeCtx.scene;
				nbLights=threeScene.__lights.length;
				console.log(threeScene);
				var obj=threeScene.getDescendants();
				for (var o in obj){
					var nbf=getFaces(obj[o],0);
					accu["faces"]+=nbf;
					//console.log(obj[o].name+" has "+nbf+" faces");
					/*if(obj[o].geometry){
						var gg=obj[o].geometry;
						if (gg.faces) accu["faces"]+=gg.faces.length;
						console.log(obj[o].name+" has "+gg.faces.length+" faces");
					}*/
				}
			}
			output+=crlf+"nb lights: "+nbLights;
			output+=crlf+"Nb faces: "+ accu["faces"];
			console.log(output);
		},
	})

	/* ======================================== */

	function InitGlobals() {
		xdv = new XDView();
		VSIZE = 12600;
		VHALF = VSIZE/2;
		htStateMachine = null;
		threeCtx = null;
		SCALE3D = 0.001;
		resourcesMap = {};
		resources={};
		area=null;
		currentSkin=null;
		logger=null;
	}
	InitGlobals();

	/* ======================================== */

	var Gadget=Class.extend({
		init: function(id, options) {
			this.id = id;
			this.options = $.extend(true, {
				base: {
					visible: false,
				}
			}, options);
			this.avatar=null;
			this.savedProps={};
		},
		mergeOptions: function() {
			return $.extend(true,
					{
						x: 0,
						y: 0,
						z: 0,
					},
					this.options.base,
					currentSkin["3d"]?this.options["3d"]:this.options["2d"],
					this.options[currentSkin.name]);
		},
		build: function(options) {
			if(this.avatar)
				return;
			if(arguments.length==0)
				options=this.mergeOptions();
		},
		unbuild: function() {
			if(this.avatar) {
				this.avatar.remove();
				this.avatar=null;
			}
		},
		canDisplay: function(options) {
			if(currentSkin===undefined || currentSkin===null)
				return false;
			if(arguments.length==0)
				options=this.mergeOptions();
			return options.visible && 
				((!currentSkin["3d"] && options.ratio!==undefined && options.center!==undefined) ||
						(currentSkin["3d"] /* && 3D requirements */)); 
		},
		update: function(options,delay,callback) {
			if(arguments.length<2 || delay===undefined)
				delay=0;
			if(arguments.length<3 || callback===undefined)
				callback=function(){};
			if(currentSkin!==undefined && currentSkin!==null) {
				var xdMap=currentSkin["3d"]?"3d":"2d";
				if(options.base)
					for(var i in options.base) {
						if(this.options[xdMap])
							delete this.options[xdMap][i];
						if(this.options[currentSkin.name])
							delete this.options[currentSkin.name][i];
					}
				if(options[xdMap])
					for(var i in options[xdMap])
						if(this.options[currentSkin.name])					
							delete this.options[currentSkin.name][i];
				$.extend(true,this.options,options);
				var aOptions=this.mergeOptions();
				if(!this.avatar && this.canDisplay(aOptions)) {
					var avatarType=avatarTypes[aOptions.type];
					if(avatarType!==undefined)
						this.avatar=new avatarType(this,aOptions);
				}
				if(typeof delay=="object") {
					if(delay[currentSkin.name]!==undefined)
						delay=delay[currentSkin.name];
					else if(delay[xdMap]!==undefined)
						delay=delay[xdMap];
					else if(delay.base!==undefined)
						delay=delay.base;
					else
						delay=0;
				}
				if(this.avatar)
					this.avatar.update(aOptions,delay,callback);
			} else
				$.extend(true,this.options,options);
		},
		saveProps: function(props, saveName) {
			var save={};
			for(var oi in this.options) {
				var optCat=this.options[oi];
				for(var i in props) {
					var prop=props[i];
					if(optCat[prop]!==undefined) {
						save[oi]=save[oi] || {};
						save[oi][prop]=optCat[prop];
					}
				}
			}
			this.savedProps[saveName]=save;
		},
		restoreProps: function(saveName,delay,callback) {
			if (this.savedProps[saveName]!==undefined)
				this.update(this.savedProps[saveName],delay,callback);
			else if(callback)
				callback();
		},
	});

	/* ======================================== */
	
	var updateOp=1;
	
	var GadgetAvatar=Class.extend({
		init: function(gadget,options) {
			this.gadget = gadget;
			this.options = options;
			this.SCALE3D = SCALE3D;
			this.animCounts={};
		},
		remove: function() {
		},
		display: function(options) {
		},
		update: function(options,delay,callback) {
			var aOptions=$.extend(true,{},this.options,options);
			aOptions.updateOp=updateOp++;
			aOptions.updateCallback=callback;
			this.display(aOptions,delay,callback);
			if(aOptions.visible)
				this.show();
			else
				this.hide();
			this.options=aOptions;
		},
		show: function() {
		},
		hide: function() {
		},
		animStart: function(options) {
			if(options===undefined) {
				console.error("animStart without options");
				debugger;
				return;
			}
			if(options.updateOp===undefined) {
				console.error("animStart without options");
				debugger;
				return;
			}
            if(this.object3d)
                this.object3d.matrixAutoUpdate = true;
			if(this.animCounts[options.updateOp]===undefined)
				this.animCounts[options.updateOp]=1;
			else
				this.animCounts[options.updateOp]++;
		},
		animEnd: function(options) {
			if(options===undefined) {
				console.error("animEnd without options");
				debugger;
				return;
			}
			if(options.updateOp===undefined) {
				console.error("animEnd without options");
				debugger;
				return;
			}
			if(this.animCounts[options.updateOp]===undefined) {
				console.error("animEnd without animCount");
				debugger;
				return;				
			}
			if(--this.animCounts[options.updateOp]==0) {
                if(this.object3d)
                    this.object3d.matrixAutoUpdate = false;
				options.updateCallback();
				delete this.animCounts[options.updateOp];
			}
		},
		getResource : GetResource,	
	});

	var GadgetElement=GadgetAvatar.extend({
		init: function(gadget,options) {
			options=$.extend(true,{
				display: function() {},
			},options);
			this._super.apply(this,arguments);
			this.options = $.extend(true, {
				x : 0,
				y : 0,
				z : 0,
				width : 1000,
				height : 1000,
				tag: "div",
				opacity : 1,
				rotate: 0,
				css: {},
			}, options);
			this.element = $("<"+this.options.tag+"/>").css({
				"position" : "absolute",
				"z-index" : this.options.z,
			}).hide().addClass("jocly-gadget").appendTo(area);
			if(this.options.initialClasses)
				this.element.addClass(this.options.initialClasses);
		},
		display: function(options,delay) {
			var $this=this;
			if(this.element) {
				this.displayElement.call(this,!this.displayCalled,options,delay);
				this.displayCalled=true;
			} else if(delay) {
				this.animStart(options);
				setTimeout(function() { $this.animEnd(options); },delay);
			}
		},
		displayElement: function(force,options,delay) {
			var $this=this;
			this.element.css($.extend(true,this.options.css,options.css));
			if(
					force ||
					this.aWidth===undefined || this.aHeight===undefined ||
					options.ratio != this.options.ratio ||
					options.center.x != this.options.center.x ||
					options.center.y != this.options.center.y ||
					options.width != this.options.width ||
					options.height != this.options.height ||
					options.x != this.options.x ||
					options.y != this.options.y ||
					options.z != this.options.z
			) {
				this.aWidth = options.width * options.ratio;
				this.aHeight = options.height * options.ratio;
				var left = options.x * options.ratio + options.center.x - this.aWidth / 2;
				var top = options.y * options.ratio + options.center.y - this.aHeight / 2;
				if(delay) {
					this.animStart(options);
					this.element.css({
						"z-index": options.z,
					}).animate({
						width : this.aWidth,
						height : this.aHeight,
						left : left,
						top : top,
					},delay,function() { $this.animEnd(options); });
				} else {
					this.element.css({
						width : this.aWidth,
						height : this.aHeight,
						left : left,
						top : top,
						"z-index": options.z,
					});
				}
				this.options.display(this.element,this.aWidth,this.aHeight);				
			}
			if(force ||
				options.classes != this.options.classes) {
				if(this.options.classes)
					this.element.removeClass(this.options.classes);
				this.element.addClass(options.classes);
			}
			if(force ||
					options.click != this.options.click) {
				//this.element.unbind(JocGame.CLICK);
				this.element.unbind(JocGame.MOUSEMOVE_EVENT);
				this.element.unbind(JocGame.MOUSEDOWN_EVENT);
				this.element.unbind(JocGame.MOUSEUP_EVENT);
				if(options.click) {
    				var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
					(function() {
						var mouseDown=false;
						var notified=false;
						var downPosition=[0,0];
						$this.element.bind(JocGame.MOUSEDOWN_EVENT,function(event) {
							event.preventDefault();
							if(iOS && event.type=="mousedown")
								return;
							if(event.type=="touchstart")
								lastTouchStart = Date.now();
							if(event.type=="mousedown" && Date.now()-lastTouchStart<500)
								return;
							mouseDown=true;
							downPosition=GetEventPosition(event);
						});
						$this.element.bind(JocGame.MOUSEUP_EVENT,function(event) {
							event.preventDefault();
							if(iOS && event.type=="mouseup")
								return;
							mouseDown=false;
							if(event.type=="joclyclick")
								lastJoclyclick = Date.now();
							if(event.type=="mouseup" && Date.now()-lastJoclyclick<500)
								return;
							if(event.type=='mouseup' || event.type=='joclyclick') {
								options.click.call($this);
							} else {
							    event.stopPropagation();
							    var newevent = new CustomEvent("joclyclick",{});
							    var x, y;
							    if(event.originalEvent.changedTouches && event.originalEvent.changedTouches.length>0) {
							    	x = event.originalEvent.changedTouches[0].pageX;
							    	y = event.originalEvent.changedTouches[0].pageY;
							    } else if(event.originalEvent.touches && event.originalEvent.touches.length>0) {
							    	x = event.originalEvent.touches[0].pageX;
							    	y = event.originalEvent.touches[0].pageY;
							    } else {
							    	console.warn("Invalid touch event");
							    	return;
							    }
							    var target = document.elementFromPoint(x, y);
						    	target.dispatchEvent(newevent);
							}
						});
						$this.element.bind(JocGame.MOUSEMOVE_EVENT,function(event) {
							event.preventDefault();
							if(iOS && event.type=="mousemove")
								return;
							if(mouseDown && !notified) {
								var position=GetEventPosition(event);
								var dx=position[0]-downPosition[0];
								var dy=position[1]-downPosition[1];
								if(dx*dx+dy*dy>100) {
									notified=true;
									options.click.call($this);
								}
							}
						});						
					})();
				}
			}
			/*
			if(force ||
					options.holdClick != this.options.holdClick) {
				this.element.unbind("holdclick");
				if(options.holdClick)
					this.element.bind("holdclick",options.holdClick);
			}
			*/
			if(force ||
					options.rotate != this.options.rotate) {
				while(options.rotate<0)
					options.rotate+=360;
				options.rotate%=360;
				var rotate=options.rotate;
				var rotate0=this.options.rotate;
				if(rotate-this.options.rotate>180)
					rotate0=360;
				else if(this.options.rotate-rotate>180)
					rotate+=360;
				if(delay) {
					this.animStart(options);
					$({deg:rotate0}).animate({deg:rotate},{
					    step: function(now) {
					        $this.element.css('transform','rotate('+now+'deg)');  
					    },
					    duration: delay,
					    complete: function() {
					    	$this.animEnd(options);					    		
					    },						
					});
				} else
					this.element.css({
						"transform": "rotate("+options.rotate+"deg)",
					});
			} else if(delay) {
				this.animStart(options);
				setTimeout(function() {
			    	$this.animEnd(options);					
				},0);
			}
			if(force ||
					options.opacity != this.options.opacity) {
				if(delay) {
					this.animStart(options);
					this.element.stop().animate({
						"opacity": options.opacity, 
					},delay,function() { $this.animEnd(options); });
				} else
					this.element.css({
						"opacity": options.opacity,
					});
			}
		},
		show: function() {
			this.element.show();
		},
		hide: function() {
			this.element.hide();
		},
		remove: function() {
			this._super.apply(this,arguments);
			this.element.unbind(JocGame.CLICK);
			//this.element.unbind("holdclick");
			this.element.remove();
		},
	});
	
	var GadgetImage=GadgetElement.extend({
		displayElement: function(force,options) {
			var $this=this;
			this._super.apply(this,arguments);
			if(force || this.options.file!=options.file) {
				this.options.file=options.file;
				GetResource("image|"+options.file, function(image,imgSrc) {
					if(imgSrc==$this.options.file)
						$this.element.css({
							"background-image" : "url(" + image.src + ")",
							"background-size" : "100% 100%",
							"background-repeat" : "no-repeat",
						});
					else
						console.log("file has changed to",$this.options.file,"(",imgSrc,")");
				});
			}
		},
	});

	var GadgetCanvas=GadgetElement.extend({
		init: function(gadget,options) {
			options=$.extend({
				tag: "canvas",
				draw: function() {},
			},options);
			this._super.call(this,gadget,options);
			this.canvasContext=this.element[0].getContext("2d");
		},
		displayElement: function(force,options) {
			this._super.apply(this,arguments);
			this.element.attr("width",this.aWidth).attr("height",this.aHeight);
			//this.canvasContext.save();
			this.canvasContext.clearRect(0,0,options.width,options.height);
			this.canvasContext.translate(this.aWidth/2,this.aHeight/2);
			this.canvasContext.scale(options.ratio,options.ratio);
			this.options.draw.call(this,this.canvasContext,1/options.ratio);
			//this.canvasContext.restore();
		}
	});

	var GadgetHexagon=GadgetCanvas.extend({
		init: function(gadget,options) {
			var $this=this;
			var R=options.radius;
			var L=R*Math.sqrt(3)/2;
			options=$.extend({
				lineWidthFactor: 1, 
			},options,{
				draw: function(ctx,pixSize) {
					ctx.lineWidth=pixSize*$this.options.lineWidthFactor;
					ctx.beginPath();
					ctx.moveTo(-L,L/2);
					ctx.lineTo(0,R);
					ctx.lineTo(L,L/2);
					ctx.lineTo(L,-L/2);
					ctx.lineTo(0,-R);
					ctx.lineTo(-L,-L/2);
					ctx.closePath();
					if($this.options.strokeStyle) {
						ctx.strokeStyle=$this.options.strokeStyle;
						ctx.stroke();
					}
					if($this.options.fillStyle) {
						ctx.fillStyle=$this.options.fillStyle;
						ctx.fill();
					}
				},
			});
			this._super.call(this,gadget,options);
			this.element.attr("width",options.width).attr("height",options.height);
			this.canvasContext=this.element[0].getContext("2d");
		},
	});

	/*
	var GadgetSprite=GadgetCanvas.extend({
		init: function(gadget,options) {
			this._super.apply(this,arguments);
			this.displayArgs=null;
		},
		displayElement: function(force,options) {
			var $this=this;
			this._super.apply(this,arguments);
			if(force || this.options.file!=options.file) {
				GetResource("image|"+options.file, function(image) {
					$this.image=image;
					if($this.displayArgs && $this.options.clipx!==undefined && $this.options.clipy!==undefined && 
							$this.options.clipwidth!==undefined && $this.options.clipheight!==undefined)
						$this.drawImage.apply($this,$this.displayArgs);
				});
			}
			if(force || this.options.clipx!=options.clipx
					|| this.options.clipy!=options.clipy
					|| this.options.clipwidth!=options.clipwidth
					|| this.options.clipheight!=options.clipheight
					) {
				if(this.image && options.clipx!==undefined && options.clipy!==undefined && 
						options.clipwidth!==undefined && options.clipheight!==undefined) {
					this.drawImage.call(this,force,options);
				} else 
					this.displayArgs=arguments;
			}
			if(this.image && options.clipx!==undefined && options.clipy!==undefined && 
					options.clipwidth!==undefined && options.clipheight!==undefined)
				this.drawImage.apply(this,arguments);
			else
				this.displayArgs=arguments;
		},
		drawImage: function(force,options) {
			this.canvasContext.save();
			var x0=parseInt(options.clipx+.5);
			var y0=parseInt(options.clipy+.5);
			var cx0=parseInt(options.clipwidth+.5);
			var cy0=parseInt(options.clipheight+.5);
			var x1=0;
			var y1=0;
			var cx1=parseInt(this.aWidth+.5);
			var cy1=parseInt(this.aHeight+.5);
			
			this.canvasContext.scale(cx1,cy1);
			this.canvasContext.imageSmoothingEnabled=true;
        	
			this.canvasContext.drawImage(this.image,x0,y0,cx0,cy0,x1,y1,1,1);
			//this.canvasContext.drawImage(this.image,x0,y0,cx0,cy0,x1,y1,cx1,cy1);
			this.canvasContext.restore();
			this.displayArgs=null;
		},
	});
	*/

	var GadgetSprite=GadgetCanvas.extend({
		init: function(gadget,options) {
			this._super.apply(this,arguments);
			this.displayArgs=null;
		},
		displayElement: function(force,options) {
			var $this=this;
			this._super.apply(this,arguments);
			if(force || this.options.file!=options.file) {
				GetResource("image|"+options.file, function(image,imgSrc) {
					if(imgSrc==$this.options.file){
						$this.image=image;
						$this.element.css({
							"background-image" : "url(" + image.src + ")",
							"background-size" : "100% 100%",
							"background-repeat" : "no-repeat",
						});
					}
					if($this.displayArgs && $this.options.clipx!==undefined && $this.options.clipy!==undefined && 
							$this.options.clipwidth!==undefined && $this.options.clipheight!==undefined)
						$this.drawImage.apply($this,$this.displayArgs);
				});
			}
			if(force || this.options.clipx!=options.clipx
					|| this.options.clipy!=options.clipy
					|| this.options.clipwidth!=options.clipwidth
					|| this.options.clipheight!=options.clipheight
					) {
				if(this.image && options.clipx!==undefined && options.clipy!==undefined && 
						options.clipwidth!==undefined && options.clipheight!==undefined) {
					this.drawImage.call(this,force,options);
				} else 
					this.displayArgs=arguments;
			}
			if(this.image && options.clipx!==undefined && options.clipy!==undefined && 
					options.clipwidth!==undefined && options.clipheight!==undefined)
				this.drawImage.apply(this,arguments);
			else
				this.displayArgs=arguments;
		},
		drawImage: function(force,options) {
			var rx=(options.clipwidth/this.aWidth);
			var ry=(options.clipheight/this.aHeight);						
			var bcx=parseInt(this.image.width/rx+.5);
			var bcy=parseInt(this.image.height/ry+.5);
			var bs=	""+bcx+"px "+bcy+"px";
			this.element.css({
				"width" : parseInt(this.aWidth+.5),
				"height" : parseInt(this.aHeight+.5),
				"background-image" : options.file,
				"background-size" : bs,
				"background-position": "-"+(parseInt(options.clipx/rx+.5))+"px -"+(parseInt(options.clipy/ry+.5))+"px",
			});
		},
	});

	var GadgetDisk=GadgetElement.extend({
		init: function(gadget,options) {
			this._super.apply(this,arguments);
		},
		displayElement: function(force,options) {
			this._super.apply(this,arguments);
			this.element.css({
				"border-radius": "50%",
			});
		},
	});

	var GadgetObject3D=GadgetAvatar.extend({
		init: function(gadget,options) {
			var $this=this;
			this._super.apply(this,arguments);
			this.displayCalled=false;
			this.options = $.extend(true, {
				x : 0.0,
				y : 0.0,
				z : 0.0,
				color: null,
				castShadow: true,
				receiveShadow: false,
                harbor: true,
			}, options);
			this.createObject();
		},
		createObject: function() {
		},
		objectReady: function(object3d) {
			var $this=this;
			this.object3d=object3d;
			object3d.castShadow=this.options.castShadow;
			object3d.receiveShadow=this.options.receiveShadow;
			object3d.name=this.gadget.id;
            object3d.matrixAutoUpdate = false;
            this.shouldUpdate = true;
			this.update(this.options);
			//object3d.visible=this.options.visible;
            if(this.options.harbor)
                threeCtx.harbor.add(object3d);
            else
                threeCtx.scene.add(object3d);
		},
		display: function(options,delay) {
			var $this=this;
			if(this.object3d) {
                this.shouldUpdate = false;
				this.displayObject3D.call(this,!this.displayCalled,options,delay);
				this.displayCalled=true;
                if(this.shouldUpdate)
                    this.object3d.updateMatrix();
			}
			if(delay) {
				$this.animStart(options);
				setTimeout(function() { $this.animEnd(options); },delay);
			}
		},
		displayObject3D: function(force,options,delay) {
			var $this=this;
			threeCtx.animControl.trigger((isNaN(delay)?0:delay)+200);
			if(force ||
					options.x != this.options.x ||
					options.y != this.options.y ||
					options.z != this.options.z
					) {
                this.shouldUpdate = true;
                if(delay) {
					this.animStart(options);
					new TWEEN.Tween(this.object3d.position).to({
						x: options.x*SCALE3D,
						y: options.z*SCALE3D,
						z: options.y*SCALE3D,
					},delay).easing(options.positionEasing?options.positionEasing:TWEEN.Easing.Cubic.EaseInOut).onComplete(function() {
						$this.animEnd(options);
					}).onUpdate(function(ratio) {
						if(options.positionEasingUpdate)
							options.positionEasingUpdate.call($this,ratio);
					}).start();
				} else {
					this.object3d.position.x=options.x*SCALE3D;
					this.object3d.position.y=options.z*SCALE3D;
					this.object3d.position.z=options.y*SCALE3D;
				}
			}
			if(force || 
					options.click != this.options.click) {
				if(this.options.click)
					this.object3d.off("mouseup");
				if(options.click) {
					//if(!threeCtx.cameraControls.hasBeenDragged())
					this.object3d.on("mouseup",function() {
						//if(!threeCtx.cameraControls.hasBeenDragged())
							options.click.call();
					});
				}
			}
			/*
			if(force || 
					options.holdClick != this.options.holdClick) {
				if(this.options.holdClick)
					this.object3d.off("holdclick");
				if(options.holdClick) {
					//if(!threeCtx.cameraControls.hasBeenDragged())
						this.object3d.on("holdclick",function(eventData){
							if(!threeCtx.cameraControls.hasBeenDragged())
								options.holdClick.call($this,eventData);
							}
						);
				}
			}
			*/
			if(force || 
					options.castShadow != this.options.castShadow) {
				this.object3d.castShadow=options.castShadow
			}
			if(force || 
					options.receiveShadow != this.options.receiveShadow) {
				this.object3d.receiveShadow=options.receiveShadow
			}
		},
		show: function() {
			if(arStream && !this.options.harbor)
				return this.hide();
			if(this.object3d){
				this.object3d.visible=true;
				if (this.object3d.children){
					for(var c=0;c<this.object3d.children.length;c++) { 
						var part=this.object3d.children[c];
						if(part.joclyVisible===undefined || part.joclyVisible)
							part.visible=true;
						else
							part.visible=false;
					}
				}
			}
		},
		hide: function() {
			if(this.object3d){
				this.object3d.visible=false;
				if (this.object3d.children){
					for(var c=0;c<this.object3d.children.length;c++) 
						this.object3d.children[c].visible=false;
				}
			}
		},
		remove: function() {
			this._super.apply(this,arguments);
			if(this.object3d) {
				if(this.options.click)
					this.object3d.off("mouseup");
				/*
				if(this.options.holdClick)
					this.object3d.off("holdclick");
				*/
                if(this.object3d.parent)
				    this.object3d.parent.remove(this.object3d);
				this.object3d=null;
			}
		},
		getMaterialMap : GetMaterialMap,
	});

	var GadgetMesh=GadgetObject3D.extend({
		init: function(gadget,options) {
			options=$.extend(true,{
				rotate: 0,
				rotateX: 0,
				rotateY: 0,
				scale: [1,1,1],
				materials: {},
				smooth: 0,
				opacity: 1,
				flatShading: false,
				morphing: [],
			},options,{
			});
			this._super.call(this,gadget,options);
		},
		displayObject3D: function(force,options,delay) {
			var $this=this;
			this._super.apply(this,arguments);
			if(force ||
					options.rotate != this.options.rotate ||
					options.rotateX != this.options.rotateX ||
					options.rotateY != this.options.rotateY
					) {
                this.shouldUpdate = true;
				var delta=options.rotate-this.options.rotate;
				if(delta>180)
					options.rotate-=360;
				else if(delta<-180)
					options.rotate+=360;
				delta=options.rotateX-this.options.rotateX;
				if(delta>180)
					options.rotateX-=360;
				else if(delta<-180)
					options.rotateX+=360;
				delta=options.rotateY-this.options.rotateY;
				if(delta>180)
					options.rotateY-=360;
				else if(delta<-180)
					options.rotateY+=360;
				if(delay) {
					this.animStart(options);
					new TWEEN.Tween(this.object3d.rotation).to({
						x: options.rotateX * (Math.PI/180),
						y: options.rotate * (Math.PI/180),
						z: options.rotateY * (Math.PI/180),
					},delay).easing(options.rotateEasing?options.rotateEasing:TWEEN.Easing.Cubic.EaseInOut).onComplete(function() {
						$this.animEnd(options);
					}).start();
				} else {
					this.object3d.rotation.x = options.rotateX * (Math.PI/180);
					this.object3d.rotation.y = options.rotate * (Math.PI/180);
					this.object3d.rotation.z = options.rotateY * (Math.PI/180);
				}
			}
			if(force ||
					options.scale[0] != this.options.scale[0] ||
					options.scale[1] != this.options.scale[1] ||
					options.scale[2] != this.options.scale[2]
					) {
                this.shouldUpdate = true;
				if(delay) {
					this.animStart(options);
					new TWEEN.Tween(this.object3d.scale).to({
						x: options.scale[0],
						y: options.scale[2],
						z: options.scale[1],
					},delay).easing(options.scaleEasing?options.scaleEasing:TWEEN.Easing.Cubic.EaseInOut).onComplete(function() {
						$this.animEnd(options);
					}).start();
				} else {
					this.object3d.scale.set(options.scale[0],options.scale[2],options.scale[1]);
					/*if ((options.scale[0] > 0) &&
						(options.scale[1] > 0) &&
						(options.scale[2] > 0)
					)
						this.object3d.scale.set(options.scale[0],options.scale[2],options.scale[1]);
					else{
						var g=this.object3d.geometry;
						g.dynamic = true;
						for(var i = 0; i<g.faces.length; i++) {
						    g.faces[i].normal.x = -1*g.faces[i].normal.x;
						    g.faces[i].normal.y = -1*g.faces[i].normal.y;
						    g.faces[i].normal.z = -1*g.faces[i].normal.z;
						}
						g.computeVertexNormals();
						g.computeFaceNormals();
						g.applyMatrix(new THREE.Matrix4().makeScale( options.scale[0], options.scale[2], options.scale[1] ) );						
					}*/
				}
			}
			if(force ||
					options.color != this.options.color
					) {
				if(this.object3d.material && this.object3d.material.color!==undefined)
					if(options.color!==null)
						this.object3d.material.color.setHex(options.color);

/*
					if(options.color===null)
						this.object3d.material.color.setHex(0xffffff);
					else 
						this.object3d.material.color.setHex(options.color);
*/
			}
			if(force ||
					options.opacity != this.options.opacity
					) {
				if(this.object3d.material && this.object3d.material.opacity!==undefined) {
					if(options.opacity===null)
						options.opacity=1;
					if(delay) {
						this.animStart(options);
						new TWEEN.Tween(this.object3d.material).to({
							opacity: options.opacity,
						},delay).easing(options.opacityEasing?options.opacityEasing:TWEEN.Easing.Cubic.EaseInOut).onComplete(function() {
							$this.animEnd(options);
						}).start();						
					} else
						this.object3d.material.opacity = options.opacity;
						
				}
			}
			if(force ||
					options.morphing.toString()!=this.options.morphing.toString()
			) {
                    this.shouldUpdate = true;
					if(options.morphing.length>0) {
						if(this.object3d.material && this.object3d.material.materials && 
								this.object3d.material.materials.length>0 && !this.object3d.material.materials[0].morphTargets) {
							for(var i=0;i<this.object3d.material.materials.length;i++)
								this.object3d.material.materials[i].morphTargets=true;
						}
						if(delay) {
							this.animStart(options);
							new TWEEN.Tween(this.object3d.morphTargetInfluences).to(options.morphing,
									delay).easing(options.morphingEasing?options.morphingEasing:TWEEN.Easing.Cubic.EaseInOut).onComplete(function() {
								$this.animEnd(options);
							}).start();												
						} else {
							for(var i=0;i<options.morphing.length && i<this.object3d.morphTargetInfluences.length;i++)
								this.object3d.morphTargetInfluences[i]=options.morphing[i];
						}
					}
			}
			if(this.object3d.material && options.materials) {
				if(force) {
					if(this.object3d.material.materials) {
						for (var m in this.object3d.material.materials) {
                            var mat=$this.object3d.material.materials[m];
                            if(options.materials[mat.name]) {
                                for(var mpi in options.materials[mat.name]) {
                                    var newMatProp=options.materials[mat.name][mpi];
                                    (function(mat,mpi) {
                                        if(mpi=="map") {
                                            GetMaterialMap(newMatProp,function(matMpi) {
                                                mat[mpi] = matMpi;
                                                mat.needsUpdate = true;
                                            });
                                        } else if(mpi=="color") {
                                            if(typeof mat["ambient"] != "undefined")
                                                mat["ambient"].setHex(newMatProp);
                                            mat[mpi].setHex(newMatProp);
                                        }
                                        else
                                            mat[mpi]=newMatProp;
                                    })(mat,mpi,m);
                                }
                            }
						}
					}
				} else {
					var diffMat=Diff(this.options.materials,options.materials);
					if(diffMat) {
						for(var mi in diffMat) {
							var newMat=diffMat[mi];
							if(this.object3d.material.materials) {
								for (var m in this.object3d.material.materials) {
                                    var mat=$this.object3d.material.materials[m];
                                    if(mat.name==mi) {
                                        if(newMat) {
                                            for(var mpi in newMat) {
                                                var newMatProp=newMat[mpi];
                                                if(newMatProp!==null) {
                                                    (function(mat,mpi) {
                                                        if(mpi=="map")
                                                            GetMaterialMap(newMatProp,function(matMpi) {
                                                                mat[mpi] = matMpi;
                                                                mat.needsUpdate = true;
                                                            });
                                                        else if(mpi=="color") {
                                                            if(typeof mat["ambient"] != "undefined")
                                                              mat["ambient"].setHex(newMatProp);
                                                            mat[mpi].setHex(newMatProp);
                                                        } else {
                                                            if(delay) {
                                                                $this.animStart(options);
                                                                if(mat[mpi]===undefined || isNaN(newMatProp)) {
                                                                    mat[mpi]=newMatProp;
                                                                    setTimeout(function() {
                                                                        $this.animEnd(options);
                                                                    });
                                                                } else {
                                                                    var change={};
                                                                    change[mpi]=newMatProp;
                                                                    new TWEEN.Tween(mat).to(change,delay).easing(options.materialEasing?options.materialEasing:
                                                                            TWEEN.Easing.Cubic.EaseInOut).onComplete(function() {
                                                                        $this.animEnd(options);
                                                                    }).start();
                                                                }
                                                            } else
                                                                mat[mpi]=newMatProp;
                                                        }
                                                    })(mat,mpi);
                                                } else
                                                    delete mat[mpi];
                                            }
                                        } else {
                                            delete mat.map;
                                            delete mat.opacity;
                                            delete mat.color;
                                        }
                                    }
								}
							}
						}
					}
				}
			}
		},
	});
	
	var GadgetCustomMesh3D=GadgetMesh.extend({
		init: function(gadget,options) {
			options=$.extend(true,{
				create: function() { return null },
				display: function() { },
			},options,{
			});
			this._super.call(this,gadget,options);
		},
		createObject: function() {
			var $this=this;
			function Callback(object3d) {
				$this.objectReady(object3d);				
			}
			var object3d=this.options.create.call(this,Callback);
			if(object3d)
				this.objectReady(object3d);
		},
		displayObject3D: function(force,options,delay) {
			this._super.apply(this,arguments);
			this.options.display.call(this,force,options,delay);
		},
		replaceMesh : function(mesh,options,delay) {
			if(this.object3d) {
				if(this.options.click)
					this.object3d.off("mouseup");
				/*
				if(this.options.holdClick)
					this.object3d.off("holdclick");
				*/
                if(this.object3d.parent)
				    this.object3d.parent.remove(this.object3d);
			}
			this.object3d=mesh;
			if(this.options.visible)
				this.show();
			else
				this.hide();
            if(this.options.harbor)
                threeCtx.harbor.add(this.object3d);
            else
                threeCtx.scene.add(this.object3d);
			if(delay) {
				this.displayObject3D(true,this.options);
				this.displayObject3D(true,options,delay);
			} else
				this.displayObject3D(true,options);
		},
	});

	var GadgetPlane3D=GadgetMesh.extend({
		init: function(gadget,options) {
			options=$.extend(true,{
				display: function() {},
				sx: 1000,
				sy: 1000,
				color:0xffffff,
				horizontal:true,
				texture: null,
				material: "basic",
				side: null,
				
			},options,{
			});
			this._super.call(this,gadget,options);
		},
		createObject: function(){
			var gg= new THREE.PlaneGeometry(this.options.sx*SCALE3D, this.options.sy*SCALE3D, 1, 1);
			var matData={
				color: this.options.data,
	            opacity: 0,
			}
			if(this.options.texture) {
				var tOptions=this.options.texture;
				if(tOptions.file) {
					GetMaterialMap(tOptions.file, function(texture) {
                        if(tOptions.wrapS!==undefined)
                            texture.wrapS=tOptions.wrapS;
                        if(tOptions.wrapT!==undefined)
                            texture.wrapT=tOptions.wrapT;
                        if(tOptions.repeat)
                            texture.repeat.set.apply(texture.repeat,tOptions.repeat);
                        matData.map=texture;                        
                    });
				}
			}
			if(this.options.side!==undefined)
				matData.side=this.options.side;
			if(this.options.transparent!==undefined)
				matData.transparent=this.options.transparent;
			var gm;
			switch(this.options.material) {
			case "phong":
				gm=new THREE.MeshPhongMaterial(matData);
				break;
			default:
				gm=new THREE.MeshBasicMaterial(matData); 				
			}
			var mesh = new THREE.Mesh( gg , gm );
			this.objectReady(mesh);		
		},
	});

	// should this class be obsoleted in favor of GadgetCustomMesh3D
	var GadgetCustom3D=GadgetObject3D.extend({
		init: function(gadget,options) {
			options=$.extend(true,{
				create: function() { return null },
				display: function() {},
			},options,{
			});
			this._super.call(this,gadget,options);
		},
		createObject: function() {
			var $this=this;
			function Callback(object3d) {
				$this.objectReady(object3d);				
			}
			var object3d=this.options.create.call(this,Callback);
			if(object3d)
				this.objectReady(object3d);
		},
		displayObject3D: function(force,options,delay) {
			this._super.apply(this,arguments);
			this.options.display.call(this,force,options,delay);
		},
	});

	var GadgetMeshFile=GadgetMesh.extend({
		init: function(gadget,options) {
			this._super.apply(this,arguments);
			this.meshFileForceDisplay=false;
		},
		createObject: function() {
			var $this=this;
			var file=this.options.file;
			var smooth=this.options.smooth;
			GetResource("smoothedfilegeo|"+this.options.smooth+"|"+file,function(geometry , materials) {
				if(file!=$this.options.file)
					return;
				var materials0=[]
				for(var i=0;i<materials.length;i++)
					materials0.push(materials[i].clone());
				materials=materials0;
				if ($this.options.flatShading)
					for ( var m=0; m < materials.length ; m++) {
						materials[m].shading=THREE.FlatShading;
					}
				var mesh = new THREE.Mesh( geometry , new THREE.MultiMaterial( materials ) ); 
				$this.objectReady(mesh);
				if($this.meshFileForceDisplay) {
					$this.displayObject3D(true,$this.meshFileForceDisplay);
					$this.meshFileForceDisplay=false;
				}				
			});
		},
		displayObject3D: function(force,options,delay) {
			var fileChange=(options.file!=this.options.file);
			if(fileChange) {
				options.click=null;
				//options.holdClick=null;
			}
			this._super.apply(this,arguments);
			if(fileChange) {
				if(this.object3d) {
					if(this.options.click)
						this.object3d.off("mouseup");
					/*
					if(this.options.holdClick)
						this.object3d.off("holdclick");
					*/
                    if(this.object3d.parent)
					   this.object3d.parent.remove(this.object3d);
					this.object3d=null;
				}
				this.options.file=options.file;
				this.meshFileForceDisplay=options;
				this.createObject();
			}
		},
	});
	
	var Gadget3DVideo = GadgetMesh.extend({
		init : function(gadget, options) {
			options = $.extend(true, {
				scale : [ 1, 1, 1 ],
				playerSide : 1,
				makeMesh : function(videoTexture,ccvVideoTexture) {
					var material = new THREE.MeshBasicMaterial({
						map : videoTexture,
						overdraw : true,
					// side:THREE.DoubleSide
					});
					var geometry = new THREE.PlaneGeometry(12, 9, 1, 1);
					var mesh = new THREE.Mesh(geometry, material);

					return mesh;
				},
				videoPlaying : function(on) {
				},
				ccvLocked : function(on) {
				},
				ccv: false,
				ccvMargin: [.10,.10,.30,.10],
				ccvWidth: 80,
				ccvHeight: 60,
				hideBeforeFirstLock: true,
			}, options);
			this._super.call(this, gadget, options);
			this.videoConnected = false;
			this.videoErrorCount = 0;
			this.videoSkipError = false;
			this.shouldBeVisible = false;
			this.gotFirstLock = false;
		},
		objectReady: function(mesh) {
			mesh.visible = false;
			for(var i=0;i<mesh.children.length;i++)
				mesh.children[i].visible = false;
			this.streamReady(Gadget3DVideo.isStreamReady(this.options.playerSide));			
			this._super.apply(this,arguments);
		},
		createObject : function() {
			Gadget3DVideo.addAvatar(this,this.options.playerSide);
			var ccvTexture=null;
			if(this.ccvContextKey)
				ccvTexture=Gadget3DVideo.getCCVVideoTexture(this.options.playerSide,this.ccvContextKey)
			var mesh = this.options.makeMesh.call(this, 
					Gadget3DVideo.getVideoTexture(this.options.playerSide),ccvTexture);
			if (mesh)
				this.objectReady(mesh);
		},
		remove : function() {
			Gadget3DVideo.removeAvatar(this,this.options.playerSide);
			this._super.apply(this, arguments);
		},
		show : function() {
			this.shouldBeVisible = true;
			if (this.videoConnected && (this.options.ccv==false || this.gotFirstLock || !this.options.hideBeforeFirstLock))
				this._super();
		},
		hide : function() {
			this.shouldBeVisible = false;
			this._super();
		},
		streamReady : function(on) {
			this.videoConnected = on;
			if(on)
				this.show();
			else
				this.hide();
		},
		ccvLocked: function(locked) {
			if(locked && this.shouldBeVisible) {
				this.gotFirstLock = true;
				this.show();
			}
			this.options.ccvLocked(locked);
		},
	});
	
	Gadget3DVideo.streams={};
	Gadget3DVideo.avatars={"1":[],"-1":[]};
	Gadget3DVideo.textures={"1":null,"-1":null};
	Gadget3DVideo.renderLoopHooked=false;
	Gadget3DVideo.ccvLibRequested=false;
	Gadget3DVideo.getStream=function(playerSide) {
		if(!this.streams[playerSide]) {
			var vStream={
				stream: null,
				avatars: this.avatars[playerSide],
				video: null,
				videoImage: null,
				videoContext: null,
				videoTexture: null,
				streamReady: false,
				ownVideoElement: false,
				errorCount: 0,
				loopCount: 0,
				local: false,
				ccvVideoImage: null,
				ccvInProgress: false,
				ccvLock: null,
				ccvContexts: {},
				ccvLastAnalyzed: null,
				ccvLastSuccess: null,
			}
			var video = $("video[joclyhub-video='" + playerSide + "']");
			if (video.length > 0) {
				vStream.video = video;
			} else {
				vStream.ownVideoElement = true;
				vStream.video = $("<video/>").attr("autoplay", "autoplay").width(
						160).height(120).css({
					visibility : "hidden",
					position: "absolute",
					"z-index": -1,
					top: 0,
				}).attr("joclyhub-video",playerSide).appendTo("body");
			}
			var canvas = $("canvas[joclyhub-video-canvas='" + playerSide + "']");
			if(canvas.length>0) {
				vStream.videoImage = canvas;
				if(this.textures[playerSide])
					vStream.videoTexture = this.textures[playerSide];
				else {
					vStream.videoTexture = new THREE.Texture(vStream.videoImage[0]);
					this.textures[playerSide]=vStream.videoTexture;					
				}
			} else {
				vStream.videoImage = this.makeCanvas(160,120).attr("joclyhub-video-canvas",playerSide);
				vStream.videoTexture = new THREE.Texture(vStream.videoImage[0]);
				this.textures[playerSide]=vStream.videoTexture;
			}
			vStream.videoTexture.minFilter = THREE.LinearFilter;
			vStream.videoTexture.magFilter = THREE.LinearFilter;
			vStream.videoImageContext = vStream.videoImage[0].getContext('2d');
			this.streams[playerSide]=vStream;
		}
		return this.streams[playerSide];
	}
	Gadget3DVideo.addStream=function(playerSide,stream,local) {
		var $this=this;
		var vStream=this.getStream(playerSide);
		vStream.stream = stream;
		vStream.local = local;
		if(threeCtx)
			threeCtx.animControl.trigger(3000);
		if(!this.renderLoopHooked) {
			this.renderLoopHooked=true;
			if(threeCtx)
				threeCtx.animateCallbacks["Gadget3DVideo"] = {
					_this : $this,
					callback : $this.animate,
				}
		}
	}
	Gadget3DVideo.removeStream=function(playerSide) {
		var vStream=this.streams[playerSide];
		if(vStream) {
			if(vStream.streamReady)
				for(var i=0;i<vStream.avatars.length;i++)
					vStream.avatars[i].streamReady(false);
			if(vStream.ccvLastSuccess)
				vStream.ccvLastSuccess.videoImage.remove();
			if(vStream.ccvLastAnalyzed)
				vStream.ccvLastAnalyzed.remove();
			delete this.streams[playerSide];
			if(this.renderLoopHooked) {
				var streamCount=0;
				for(var s in this.streams)
					streamCount++;
				if(streamCount==0) {
					if(threeCtx)
						delete threeCtx.animateCallbacks["Gadget3DVideo"];
					this.renderLoopHooked=false;
				}
			}
		}
	}
	Gadget3DVideo.addAvatar=function(avatar,playerSide) {
		this.avatars[playerSide].push(avatar);
		var vStream=this.getStream(playerSide);
		if(!avatar.ccvContextKey)
			avatar.ccvContextKey=""+avatar.options.ccvWidth+","+avatar.options.ccvHeight+","+JSON.stringify(avatar.options.ccvMargin);
		if(!vStream.ccvContexts[avatar.ccvContextKey]) {
			var ccvContext={
				width: avatar.options.ccvWidth,
				height: avatar.options.ccvHeight,
				margin: avatar.options.ccvMargin,
			}
			ccvContext.videoImage = this.makeCanvas(ccvContext.width,ccvContext.height);
			ccvContext.videoImageContext = ccvContext.videoImage[0].getContext('2d');
			ccvContext.videoImageContext.fillStyle = "rgb(0,255,0)";
			ccvContext.videoImageContext.fillRect (0, 0, ccvContext.width, ccvContext.height);
			ccvContext.videoTexture = new THREE.Texture(ccvContext.videoImage[0]);
			ccvContext.videoTexture.minFilter = THREE.LinearFilter;
			ccvContext.videoTexture.magFilter = THREE.LinearFilter;
			ccvContext.videoTexture.needsUpdate = true;
			vStream.ccvContexts[avatar.ccvContextKey]=ccvContext;
			//debugger;
		}
		return vStream.streamReady;
	}
	Gadget3DVideo.getVideoTexture=function(playerSide) {
		var vStream=this.streams[playerSide];
		if(vStream)
			return vStream.videoTexture;
		else
			return null;
	}
	Gadget3DVideo.getCCVVideoTexture=function(playerSide,contextKey) {
		var vStream=this.streams[playerSide];
		if(vStream) {
			var ccvContext=vStream.ccvContexts[contextKey];
			if(ccvContext)
				return ccvContext.videoTexture;
		}
		return null;
	}
	Gadget3DVideo.isStreamReady=function(playerSide) {
		return this.streams[playerSide] && this.streams[playerSide].streamReady;
	}
	Gadget3DVideo.isCCVLocked=function(playerSide) {
		return this.streams[playerSide] && this.streams[playerSide].ccvLock;
	}
	Gadget3DVideo.removeAvatar=function(avatar,playerSide) {
		var vStream=this.streams[playerSide];
		if(vStream)
			for(var i=0;i<vStream.avatars.length;i++)
				if(avatar==vStream.avatars[i]) {
					vStream.avatars.splice(i,1);
					break;
				}
	}
	Gadget3DVideo.animate=function() {
		for(var side in this.streams) {
			var vStream=this.streams[side];
			try {
				vStream.loopCount++;
				if (vStream.video[0].getAttribute("webrtc-attached")==="1" && 
						vStream.video[0].readyState === vStream.video[0].HAVE_ENOUGH_DATA) {
					vStream.videoImageContext.drawImage(vStream.video[0], 0, 0,
							vStream.videoImage[0].width, vStream.videoImage[0].height);
					if(vStream.videoTexture) {
						vStream.videoTexture.needsUpdate = true;
						if(!vStream.streamReady) {
							vStream.streamReady = true;
							for(var i=0;i<vStream.avatars.length;i++)
								vStream.avatars[i].streamReady(true);
						}
					}
					var ccvLocalRequested=false;
					var ccvRequested=false;
					for(var i=0;i<vStream.avatars.length;i++)
						if(vStream.avatars[i].options.ccv) {
							ccvRequested=true;
							if(vStream.local) {
								ccvLocalRequested=true;
								break;
							}
						}
					if(ccvLocalRequested) {
						if(typeof(ccv)=="undefined") { // ccv library not loaded
							if(!this.ccvLibRequested) {
								var path=null;
								if(typeof JoclyHub!="undefined")
									path=JoclyHub.hubPath+"/lib";
								else if(typeof JoclyPlazza!="undefined")
									path=JoclyPlazza.config.baseURL+JoclyPlazza.config.joclyPath+"/ccv";
								else
									console.error("No CCV path available");
								this.ccvLibRequested=true;
								if(path) {
									$("<script/>").attr("src",path+"/face.js").attr("type","text/javascript")
										.appendTo($("head"));
									$("<script/>").attr("src",path+"/ccv.js").attr("type","text/javascript")
										.appendTo($("head"));
								}
							}
						} else {
							if(!vStream.ccvInProgress)
								this.ccvPoll(vStream);
						}
					}
					if(ccvRequested)
						this.ccvAnimate(vStream);
					threeCtx.animControl.trigger();
				}
			} catch(e) {
				if(vStream.errorCount % 1000000 ==0)
					console.warn("Gadget3DVideo.animate error",vStream.errorCount,side,e);
				vStream.errorCount++;
			}
		}
	}
	Gadget3DVideo.ccvLocked=function(vStream,locking) {
		for(var i=0;i<vStream.avatars.length;i++)
			vStream.avatars[i].ccvLocked(locking);
	}
	Gadget3DVideo.ccvPoll=function(vStream) {
		vStream.ccvInProgress=true;
		var width=vStream.videoImage[0].width;
		var height=vStream.videoImage[0].height;
		var now=Date.now();
		function CCVResult(comp) {
			if(comp.length==0) {
				if(vStream.ccvLock) {
					vStream.ccvLock=null;
					Gadget3DVideo.ccvLocked(vStream,false);
					WebRTC.sendCCVMessage({
						locked: false,
					});
				}
			} else {
				var face=comp[0];
				var lock=vStream.ccvLock;
				vStream.ccvLock={
					x: face.x,
					y: face.y,
					width: face.width,
					height: face.height,
				}
				if(vStream.ccvLastSuccess)
					vStream.ccvLastSuccess.videoImage.remove();
				vStream.ccvLastSuccess=$.extend({
					videoImage: vStream.ccvLastAnalyzed,
					copied: false,
				},vStream.ccvLock);
				vStream.ccvLastAnalyzed=null;
				vStream.ccvLastAnalyzedContext=null;
				
				if(!lock)
					Gadget3DVideo.ccvLocked(vStream,true);
				WebRTC.sendCCVMessage({
					locked: true,
					x: face.x,
					y: face.y,
					width: face.width,
					height: face.height,
				});
			}
			ReschedulePoll();
		}
		function ReschedulePoll() {
			setTimeout(function() {
				vStream.ccvInProgress=false;
			},200);
		}
		if(!vStream.ccvLastAnalyzed) {
			vStream.ccvLastAnalyzed = this.makeCanvas(vStream.videoImage[0].width,vStream.videoImage[0].height);
			vStream.ccvLastAnalyzedContext = vStream.ccvLastAnalyzed[0].getContext("2d");
		}
		vStream.ccvLastAnalyzedContext.drawImage(vStream.videoImage[0],0,0,vStream.videoImage[0].width,vStream.videoImage[0].height);

		/*
		if(WebRTC.webrtcDetectedBrowser=="firefox")
			ccv.detect_objects({
				//"canvas" : ccv.grayscale(vStream.ccvLastAnalyzed[0]),
				"canvas" : ccv.grayscale(vStream.videoImage[0]),
				"cascade" : cascade,
				"interval" : 5,
				"min_neighbors" : 1,
				"async" : false,
				"async" : true,
				"worker" : 1
			})(CCVResult);
		else
		*/
			CCVResult(ccv.detect_objects({
				//"canvas" : ccv.grayscale(vStream.ccvLastAnalyzed[0]),
				"canvas" : ccv.grayscale(vStream.videoImage[0]),
				"cascade" : cascade,
				"interval" : 5,
				"min_neighbors" : 1,
				"async" : false,
				"worker" : 1
			}));
	}
	Gadget3DVideo.makeCanvas = function(width,height) {
		return $("<canvas/>").attr("width", width).attr("height",height).width(width).height(height)
				.css({
			visibility : "hidden",
			position: "absolute",
			"z-index": -1,
			top: 0,
		}).appendTo("body");
	}
	Gadget3DVideo.ccvAnimate=function(vStream) {
		function DrawImage(ccvContext,ccvLock,source) {
			var width=ccvLock.width*(1+ccvContext.margin[1]+ccvContext.margin[3]);
			var height=ccvLock.height*(1+ccvContext.margin[0]+ccvContext.margin[2]);
			var x=ccvLock.x-ccvLock.width*ccvContext.margin[3];
			var y=ccvLock.y-ccvLock.height*ccvContext.margin[0];
			if(x<0) {
				width+=x;
				x=0;
			}
			if(y<0) {
				height+=y;
				y=0;
			}
			if(x+width>source.width)
				width=source.width-x;
			if(y+height>source.height)
				height=source.height-y;
			ccvContext.videoImageContext.drawImage(source,
					x, y, width, height,
					0, 0,
					ccvContext.width, ccvContext.height);
			ccvContext.videoTexture.needsUpdate = true;			
		}

		for(var contextKey in vStream.ccvContexts) {
				var ccvContext=vStream.ccvContexts[contextKey];
				if(vStream.ccvLock)
					DrawImage(ccvContext,vStream.ccvLock,vStream.videoImage[0]);
				else if(vStream.ccvLastSuccess && !vStream.ccvLastSuccess.copied) {
					vStream.ccvLastSuccess.copied=true;
					DrawImage(ccvContext,vStream.ccvLastSuccess,vStream.ccvLastSuccess.videoImage[0]);
				}
			}
	}
	Gadget3DVideo.receiveRemoteLock=function(message) {
		for(var side in this.streams) {
			var vStream=this.streams[side];
			if(vStream.local)
				continue;
			var lock=vStream.ccvLock;
			if(message.locked) {
				vStream.ccvLock={
					x: message.x,
					y: message.y,
					width: message.width,
					height: message.height,
				};
				if(vStream.ccvLastSuccess)
					vStream.ccvLastSuccess.videoImage.remove();
				var videoImage=this.makeCanvas(vStream.videoImage[0].width,vStream.videoImage[0].height);
				var videoImageContext=videoImage[0].getContext("2d");
				videoImageContext.drawImage(vStream.videoImage[0],0,0,vStream.videoImage[0].width,vStream.videoImage[0].height);
				vStream.ccvLastSuccess=$.extend({
						videoImage: videoImage,
						copied: false,
					},vStream.ccvLock);
				if(!lock)
					Gadget3DVideo.ccvLocked(vStream,true);
			} else {
				if(lock) {
					vStream.ccvLock=null;
					Gadget3DVideo.ccvLocked(vStream,false);
				}				
			}
		}
	}

	function WebRTCHandler(event, data) {
		try {
			if (data.webrtcType == "mediaOn") {
				if(data.ar)
					AR(data.stream);
				else
					Gadget3DVideo.addStream(data.side,data.stream,data.local);
			} if (data.webrtcType == "mediaOff") {
				if(arStream) 
					AR(null);
				else
					Gadget3DVideo.removeStream(data.side);
			} if (data.webrtcType == "ccv")
				Gadget3DVideo.receiveRemoteLock(data.message);
		} catch(e) {
			console.error("xd-view webrtc error",e);
		}
	}
	$(document).bind("joclyhub.webrtc",WebRTCHandler);
	
	var Gadget3DVideoFile = GadgetCustomMesh3D.extend({
		init : function(gadget, options) {
			options = $.extend(true, {
				scale : [ 1, 1, 1 ],
				makeMesh : function(videoTexture) {
					var material = new THREE.MeshBasicMaterial({
						map : videoTexture,
						overdraw : true,
					});
					var geometry = new THREE.PlaneGeometry(this.options.width*this.SCALE3D, this.options.height*this.SCALE3D, 1, 1);
					var mesh = new THREE.Mesh(geometry, material);

					return mesh;
				},
				width: 12,
				height: 9,
			}, options);
			this.videoPlayer=Gadget3DVideoFile.GetVideoPlayer(options.src);
			this._super.call(this, gadget, options);
		},
		createObject : function() {
			var mesh = this.options.makeMesh.call(this,this.videoPlayer.texture);
			if (mesh)
				this.objectReady(mesh);
		},
		remove : function() {
			var videoPlayer=videoPlayers[this.options.src];
			if(videoPlayer) {
				videoPlayer.count--;
				if(videoPlayer.count==0) {
					delete threeCtx.animateCallbacks["Gadget3DVideoFile."+this.options.src];
					videoPlayer.tag.remove();
					videoPlayer.canvas.remove();
					delete videoPlayers[this.options.src];
				}
			}
			this._super.apply(this, arguments);
		},
	});

	var videoPlayers={};
	Gadget3DVideoFile.GetVideoPlayer=function(url) {
		var videoPlayer=videoPlayers[url];
		if(!videoPlayer) {
			var width=638;
			var height=360;
			var videoTag=$("<video/>").attr("autoplay","autoplay")./*attr("muted","muted").*/attr("loop","loop").css({
				width: width,
				height: height,
				position: "absolute",
			}).append($("<source/>").attr("src",url).attr("type","video/webm")).appendTo("body");
			videoPlayer={
				count: 1,
				tag: videoTag,
				canvas: Gadget3DVideo.makeCanvas(width,height),
			}			
			videoPlayer.context=videoPlayer.canvas[0].getContext('2d');
			videoPlayer.context.fillStyle = "rgb(0,255,0)";
			videoPlayer.context.fillRect (0, 0, width, height);

			videoPlayer.texture = new THREE.Texture(videoPlayer.canvas[0]);
			videoPlayer.texture.minFilter = THREE.LinearFilter;
			videoPlayer.texture.magFilter = THREE.LinearFilter;
			videoPlayer.texture.needsUpdate = true;
			
			function Animate() {
				var ctx=videoPlayer.context;
				ctx.drawImage(videoPlayer.tag[0], 0, 0,
					width,height);
				videoPlayer.texture.needsUpdate = true;
			}
			threeCtx.animateCallbacks["Gadget3DVideoFile."+url] = {
					_this : null,
					callback : Animate,
				}

			videoPlayers[url]=videoPlayer;
		} else
			videoPlayer.count++;
		
		return videoPlayer;
	}

	
	var GadgetCamera=GadgetObject3D.extend({
		init : function(gadget, options) {
			this._super.call(this, gadget, options);
			//this.object3d=threeCtx.camera;
			this.object3d=threeCtx.body;
            this.cameraObject = this.object3d.children[0];
			this.targetAnim=null;
			this.camTarget=threeCtx.camTarget;
		},
		displayObject3D: function(force,options,delay) {
			var $this=this;
			this.options.x=this.object3d.position.x/SCALE3D;
			this.options.y=this.object3d.position.z/SCALE3D;
			this.options.z=this.object3d.position.y/SCALE3D;
			this._super.apply(this,arguments);
			if(force ||
					options.targetX*SCALE3D != threeCtx.cameraControls.camTarget.x ||
					options.targetY*SCALE3D != threeCtx.cameraControls.camTarget.z ||
					options.targetZ*SCALE3D != threeCtx.cameraControls.camTarget.y
					) {
				if(delay) {
					var traveling=options.traveling;
					var x0=threeCtx.cameraControls.camTarget.x;
					var y0=threeCtx.cameraControls.camTarget.y;
					var z0=threeCtx.cameraControls.camTarget.z;
					
					options.traveling=false;
					if(this.targetAnim) {
						this.targetAnim.stop();
						//this.animEnd(this.targetCallback);
						this.animEnd(options);
					}
					//this.targetCallback=callback;
					this.animStart(options);
					this.targetAnim=new TWEEN.Tween(threeCtx.cameraControls.camTarget).to({
						x: options.targetX*SCALE3D,
						y: options.targetZ*SCALE3D,
						z: options.targetY*SCALE3D,
					},delay).easing(options.targetEasing?options.targetEasing:TWEEN.Easing.Cubic.EaseInOut).onComplete(function() {
						$this.targetAnim=null;
						$this.animEnd(options);
					}).onUpdate(function(ratio) {
						if(options.targetEasingUpdate)
							options.targetEasingUpdate.call($this,ratio);
						if(traveling) {
							var dx=threeCtx.cameraControls.camTarget.x-x0;
							var dy=threeCtx.cameraControls.camTarget.y-y0;
							var dz=threeCtx.cameraControls.camTarget.z-z0;
							x0=threeCtx.cameraControls.camTarget.x;
							y0=threeCtx.cameraControls.camTarget.y;
							z0=threeCtx.cameraControls.camTarget.z;
							//$this.object3d.position.add(new THREE.Vector3(dx,dy,dz));
						}
						//$this.object3d.lookAt(threeCtx.cameraControls.camTarget);
						$this.cameraObject.lookAt(threeCtx.cameraControls.camTarget);
					}).start();
				} else {
					threeCtx.cameraControls.camTarget.x=options.targetX*SCALE3D;
					threeCtx.cameraControls.camTarget.y=options.targetZ*SCALE3D;
					threeCtx.cameraControls.camTarget.z=options.targetY*SCALE3D;
				}
			}
		},
	});
	
	function CreateCameraGadget() {
		xdv.createGadget("camera",{
			"3d": {
				type: "camera3d",
				x: threeCtx.camera.position.x/SCALE3D,
				y: threeCtx.camera.position.z/SCALE3D,
				z: threeCtx.camera.position.y/SCALE3D,
				targetX: threeCtx.cameraControls.camTarget.x/SCALE3D,
				targetY: threeCtx.cameraControls.camTarget.z/SCALE3D,
				targetZ: threeCtx.cameraControls.camTarget.y/SCALE3D,
			},
		});
		xdv.saveGadgetProps("camera",["targetX","targetY","targetZ"],"initial");
		xdv.updateGadget("camera",{
			"3d": {
				visible: true,
			},
		});
	}
	
	/* ======================================== */

	var avatarTypes={
			"image": GadgetImage,
			"element": GadgetElement,
			"canvas": GadgetCanvas,
			"hexagon": GadgetHexagon,
			"sprite": GadgetSprite,
			"disk": GadgetDisk,
			"meshfile": GadgetMeshFile,
			"custom3d": GadgetCustom3D,
			"plane3d": GadgetPlane3D,
			"custommesh3d": GadgetCustomMesh3D,
			"video3d": Gadget3DVideo,
			"camera3d": GadgetCamera,
			"videofile3d": Gadget3DVideoFile,
		}

	
	/* ======================================== */
	
	var areaElements=null;
	
	View.Game.CamAnim = {
			isSupported: function() {
				return !!threeCtx;
			},
			isRunning: function() {
				return threeCtx && threeCtx.camAnim;
			},
			set: function(on) {
				if(threeCtx)
					threeCtx.setCamAnim(on);
			},
	}

	View.Game.InitView = function() {
		
		resourcesMap = this.resources || {};
		
		if (this!=xdv.game) {
			xdv.game=this;
			if(this.mWidget.find(".jocly-xdv-area").length==0) {
				area = $("<div/>").css({
					"position" : "absolute",
					"z-index" : 0,
					"overflow": "hidden",
				}).addClass("jocly-xdv-area").appendTo(this.mWidget);
			}
		}
		if(areaElements) {
			areaElements.appendTo(area);
			areaElements=null;
		}

		if(!xdv.initDone) {
			this.xdInit(xdv);
			xdv.initDone=true;
		}

		var needs3DUpdate=false;
		if(!currentSkin || this.mSkin!=currentSkin.name) {
			currentSkin=null;
			for(var i=0; i<this.mViewOptions.skins.length;i++) {
				var skin=this.mViewOptions.skins[i];
				if(skin.name==this.mSkin) {
					currentSkin=skin;
					break;
				}
			}
			if(currentSkin==null) {
				Log("!!! InitView", "skin", this.mSkin, "not found");
				return;
			}
			xdv.unbuildGadgets();
			areaElements=null;
			if(currentSkin["3d"])
				needs3DUpdate=true;
		}

		var areaWidth = Math.min(this.mGeometry.width, this.mGeometry.height
				* this.mViewOptions.preferredRatio);
		var areaHeight = Math.min(this.mGeometry.width / this.mViewOptions.preferredRatio, this.mGeometry.height);
		var areaCenter;
		if(currentSkin["3d"]) {
			area.css({
				left : 0,
				top : 0,
				width : this.mGeometry.width,
				height : this.mGeometry.height,
			});
			areaCenter={ 
				x: this.mGeometry.width/2, 
				y: this.mGeometry.height/2, 
			};
			if(!threeCtx) {
					if(!THREE.Object3D._threexDomEvent) {
						THREE.Object3D._threexDomEvent	= new THREEx.DomEvent();
					}
					threeCtx=BuildThree(this,areaWidth,areaHeight);
					CreateCameraGadget();
					threeCtx.camera.updateProjectionMatrix();
			} else {
				threeCtx.renderer.setSize(this.mGeometry.width,this.mGeometry.height);
				threeCtx.camera.aspect=this.mGeometry.width/this.mGeometry.height;
				threeCtx.camera.updateProjectionMatrix();
			}
			
			THREE.Object3D._threexDomEvent.setDOMElement(threeCtx.renderer.domElement);
			THREE.Object3D._threexDomEvent.setBoundContext(THREEx_boundContext);
			THREE.Object3D._threexDomEvent.camera(threeCtx.camera);
			
			ResumePendingResources();
			
			threeCtx.animControl.trigger();
			if(needs3DUpdate) {

				var cameraData = $.extend(true,{
					radius: 12,
					elevationAngle: 60,
					rotationAngle: 90,
					distMax : 20,
					distMin :  0,
					elevationMax: 89,
					elevationMin : 10,
					startAngle: 90,
					camAnim: false,
					limitCamMoves: true,
					enableDrag: true,
					targetBounds: [3000,3000,3000],
					target: [0,0,800],
					fov:55,
                    near: .01
				},currentSkin.camera);
				
				// update FOV
				threeCtx.camera.fov=cameraData.fov;
				threeCtx.camera.near=cameraData.near;
				threeCtx.camera.updateProjectionMatrix();
				
				$.extend(threeCtx.cameraControls,{
					minDistance: cameraData.distMin,
					maxDistance: cameraData.distMax,
					minPolarAngle: (90-cameraData.elevationMax)*Math.PI/180,
					maxPolarAngle: (90-cameraData.elevationMin)*Math.PI/180,
					enableDrag: cameraData.enableDrag,
					targetBounds: [cameraData.targetBounds[0]*SCALE3D,cameraData.targetBounds[2]*SCALE3D,cameraData.targetBounds[1]*SCALE3D],
				});

				var camPosition = {
					x: cameraData.radius * Math.cos(cameraData.elevationAngle*Math.PI/180) * Math.cos(cameraData.rotationAngle*Math.PI/180),
					z: cameraData.radius * Math.cos(cameraData.elevationAngle*Math.PI/180) * Math.sin(cameraData.rotationAngle*Math.PI/180),
					y: cameraData.radius * Math.sin(cameraData.elevationAngle*Math.PI/180),
				}

				var camTarget = {
						x: cameraData.target[0],
						y: cameraData.target[1],
						z: cameraData.target[2],
				}
				xdv.updateGadget("camera",{
					"3d": {
						x: camPosition.x/SCALE3D,
						y: camPosition.z/SCALE3D,
						z: camPosition.y/SCALE3D,
						targetX: camTarget.x,
						targetY: camTarget.y,
						targetZ: camTarget.z,
					},
				});
				threeCtx.cameraControls.camTarget.copy(camTarget);
				//threeCtx.cameraControls.camera.position.copy(camPosition);
				threeCtx.cameraControls.update();
				
				var world={
					color: 0x205D7C,
					fog: true,
					fogNear: 10,
					fogFar: 100,
					lightCastShadow: true,
					lightIntensity: 1.75,
					lightPosition: {x:-12,y:12,z:12},
					//lightShadowDarkness: 0.75,
					ambientLightColor: 0xbbbbbb,
					skyLightPosition: {x:-45,y:45,z:45},
					skyLightIntensity: 2,
				}
				$.extend(true,world,currentSkin.world);
				if(threeCtx.scene.fog) {
					threeCtx.scene.remove(threeCtx.scene.fog);
					delete threeCtx.scene.fog;
				}
				if(world.fog){
					var fogColor = world.color ;
					if (world.fogColor) fogColor = world.fogColor ;
					threeCtx.scene.fog=new THREE.Fog(fogColor,world.fogNear,world.fogFar);
				}

				threeCtx.world = world;
				threeCtx.renderer.setClearColor(new THREE.Color(world.color), 1);
				threeCtx.light.castShadow = world.lightCastShadow;
				threeCtx.light.intensity = world.lightIntensity;
				threeCtx.light.position.set(world.lightPosition.x,world.lightPosition.y,world.lightPosition.z);
				//threeCtx.light.shadowDarkness=world.lightShadowDarkness;
				threeCtx.ambientLight.color.setHex(world.ambientLightColor);
				threeCtx.skyLight.intensity=world.skyLightIntensity;
				threeCtx.skyLight.position.set(world.skyLightPosition.x,world.skyLightPosition.y,world.skyLightPosition.z);
			}
			threeCtx.renderer.domElement.style.display="block";
		} else {
			area.css({
				left : (this.mGeometry.width - areaWidth) / 2,
				top : (this.mGeometry.height - areaHeight) / 2,
				width : areaWidth,
				height : areaHeight,
			});
			areaCenter={
				x: areaWidth/2,
				y: areaHeight/2,
			}
			if(threeCtx)
				threeCtx.renderer.domElement.style.display="none";
		}

		this.xdBuildScene(xdv);
		//xdv.updateArea(Math.min(areaWidth,areaHeight)/VSIZE,areaCenter);
		xdv.updateArea(Math.max(areaWidth,areaHeight)/VSIZE,areaCenter);
	}

	View.Game.DestroyView = function() {
		if (!xdv.game) {
			Log("!!! InitView", "game already unset");
			return;
		}
		if(resLoadingMask)
			resLoadingMask.hide();
		xdv.game = null;
		areaElements=area.children().detach();
		if(threeCtx) {
			if(threeCtx.cameraControls.autoRotate)
				threeCtx.cameraControls.autoRotate=false;
		}
		//threeCtx.animControl.stop();
	}

	View.Game.CloseView = function() {
		xdv.unbuildGadgets();
		
		if(threeCtx) {
			THREE.Object3D._threexDomEvent.unsetBoundContext(THREEx_boundContext);
			threeCtx.cameraControls.destroy();
			threeCtx=null;
		}
		InitGlobals();
	}

	View.Game.xdResourceLoaded = function(res) {
		if(/^map\|/.test(res))
			return false;
		if(resources[res] && resources[res].status=="loaded")
			return true;
		else
			return false;
	}
	
	View.Game.xdLoadResources = function(ress,callback) {
		var resCount=0;
		function ResLoaded() {
			if(--resCount==0)
				callback();
		}
		for(var i=0;i<ress.length;i++) {
			resCount++;
			var m=/^map\|(.*)$/.exec(ress[i]);
			if(m)
				GetMaterialMap(m[1],function() {
                    setTimeout(ResLoaded,0);
                });
			else
				GetResource(ress[i],function() {
					setTimeout(ResLoaded,0);
				});
		}
	}

	View.Game.xdExternalCommand = function(cmd,scope) {
		switch(cmd.type) {
		case 'updateCamera':
			xdv.updateGadget("camera",{
				"3d": cmd.camera,
			},cmd.delay || 0);
			break;
		case 'getCamera':
			var resp={
				type: "camera",
				cameraId: cmd.cameraId, 
			}
			if(threeCtx) {
				resp.camera={
					x: threeCtx.camera.position.x/SCALE3D,
					y: threeCtx.camera.position.z/SCALE3D,
					z: threeCtx.camera.position.y/SCALE3D,
					targetX: threeCtx.cameraControls.camTarget.x/SCALE3D,
					targetY: threeCtx.cameraControls.camTarget.z/SCALE3D,
					targetZ: threeCtx.cameraControls.camTarget.y/SCALE3D,
				}
			} else {
				console.warn("cannot get camera without 3D context");
				resp.camera=null;
			}
			scope.sendEmbed(resp);
			break;
		case 'snapshot':
			var resp={
				type: "snapshot",
				snapshotId: cmd.snapshotId, 
			}
			if(threeCtx) {
				var renderer=threeCtx.renderer;
				var canvas=renderer.domElement;
				renderer.render( threeCtx.scene, threeCtx.camera );
				resp.image=canvas.toDataURL("image/png");
			} else {
				console.warn("cannot get snapshot without 3D context");
				resp.image=null;
			}
			scope.sendEmbed(resp);
			break;
		}
	}

	View.Board.Display = function(aGame) {
		//Log("### View.Board.Display");
		this.xdDisplay(xdv,aGame);
		//xdv.listScene();
	}

	View.Board.xdInput = function(xdv, aGame) {
		console.error("View.Board.xdInput must be overriden");
		return {
			initial: {},
			getActions: function(moves,currentInput) {
				return {};
			},
		}
	}

	View.Board.xdBuildHTStateMachine = function(xdv, htsm, aGame) {
		var $this=this;
		var inputSpec;
		var clickGadgets={},viewGadgets={},highlightGadgets=[];
		var inputStack, movesStack,actionStack;
		function Click(action,mode) {
			if(mode=="select")
				htsm.smQueueEvent("E_ACTION",{action:action});
			else if(mode=="cancel")
				htsm.smQueueEvent("E_CANCEL",{action:action});
		}
		function Init(args) {
			inputSpec=$this.xdInput(xdv,aGame);
			inputStack=[inputSpec.initial];
			// ensures moves are not duplicated
			var movesMap={};
			$this.mMoves.forEach(function(move) {
				movesMap[JSON.stringify(move)]=move;				
			});
			var moves=[];
			for(var m in movesMap)
				moves.push(movesMap[m]);
			movesStack=[moves];
			actionStack=[];
		}
		function ShowFurnitures(args) {
			if(inputSpec.furnitures)
				inputSpec.furnitures.forEach(function(gadget) {
					xdv.updateGadget(gadget,{
						base: {
							visible: true,
						},
					});					
				});
		}
		function HideFurnitures(args) {
			if(inputSpec.furnitures)
				inputSpec.furnitures.forEach(function(gadget) {
					xdv.updateGadget(gadget,{
						base: {
							visible: false,
						},
					});					
				});
		}
		function SetAction(action,mode) {
			if(mode=="select") {
				if(action.pre)
					action.pre.call($this);
				if(action.cancel)
					action.cancel.forEach(function(gid) {
						clickGadgets[gid]=true;
						xdv.updateGadget(gid,{
							base: {
								click: function() {
									Click(action,"cancel");
								},
							},
						});
					});
			}
			if(action.click)
				action.click.forEach(function(gid) {
					clickGadgets[gid]=true;
					xdv.updateGadget(gid,{
						base: {
							click: function() {
								Click(action,mode);
							},
						},
					});
				});
			if(typeof action.highlight=="function") {
				if(typeof action.unhighlight!="function")
					console.warn("No unhighlight function defined for",action);
				else
					highlightGadgets.push(function() {
						action.unhighlight.call($this,mode);									
					});
				action.highlight.call($this,mode);
			}
			if(action.view)
				action.view.forEach(function(gid) {
					viewGadgets[gid]=true;
					xdv.updateGadget(gid,{
						base: {
							visible: true,
						},
					})
				});			
		}
		function PrepareAction(args) {
			var nextActions=inputSpec.getActions.call($this,movesStack[movesStack.length-1],inputStack[inputStack.length-1]);
			if(nextActions==null) {
				htsm.smQueueEvent("E_MOVE_DONE",{move:movesStack[movesStack.length-1][0]});
				return;
			}
			var actionsCount=0;
			var action0;
			for(var action in nextActions) {
				action0=nextActions[action];
				actionsCount++;
			}
			if(actionsCount>1 || (inputStack.length==1 && !inputSpec.allowForced) || (actionsCount==1 && !aGame.mAutoComplete && !action0.skipable)) {
				for(var actId in nextActions) {
					var action=nextActions[actId];
					action.forced=false;
					SetAction(action,"select");
				}
			} else if(actionsCount==0) {
				htsm.smQueueEvent("E_MOVE_DONE",{move:actionStack[actionStack.length-1].moves[0]});
			} else {
				action0.forced=true;
				htsm.smQueueEvent("E_ACTION",{action:action0});
			}
		}
		function SendMove(args) {
			aGame.HumanMove(args.move);			
		}
		function Clean(args) {
			for(var gid in clickGadgets)
				xdv.updateGadget(gid,{
					base: {
						click: null,
					},
				});
			clickGadgets={};
			for(var gid in viewGadgets)
				xdv.updateGadget(gid,{
					base: {
						visible: false,
					},
				});
			viewGadgets={};
			for(var i=0;i<highlightGadgets.length;i++)
				highlightGadgets[i].call($this);
		}
		function Execute(action,callback) {
			if(action.execute) {
				var actions=action.execute;
				if(typeof actions=="function")
					actions=[actions];
				var actionsCount=0;
				function ActionDone(action) {
					if(--actionsCount==0)
						callback();
				}
				actions.forEach(function(action) {
					actionsCount++;
					setTimeout(function() {
						action.call($this,ActionDone);
					},0);
				});
			} else
				callback();
		}
		function Action(args) {
			movesStack.push(args.action.moves);
			Execute(args.action,function() {
				htsm.smQueueEvent("E_DONE",{ action: args.action });				
			});
		}
		function PostAction(args) {
			if(args.action.post)
				args.action.post.call($this);
		}
		function SetCancel(args) {
			if(actionStack.length>0 && !actionStack[actionStack.length-1].noAutoCancel)
				SetAction(actionStack[actionStack.length-1],"cancel");
		}
		function Validate(args) {
			inputStack.push($.extend(true,{},inputStack[inputStack.length-1],args.action.validate));
		}
		function Cancel(args) {
			while(actionStack.length>0) {
				var action=actionStack.pop();
				inputStack.pop();
				movesStack.pop();
				if(action.unexecute)
					action.unexecute.call($this);
				if(action.post)
					action.post.call($this);
				if(action.forced==false)
					break;
			}
		}
		function PushAction(args) {
			actionStack.push(args.action);
		}
		htsm.smTransition("S_INIT", "E_INIT", "S_WAIT_ACTION", [ Init, ShowFurnitures ]);
		htsm.smEntering("S_WAIT_ACTION",[ PrepareAction, SetCancel ]);
		htsm.smLeaving("S_WAIT_ACTION",[ Clean ]);
		htsm.smTransition("S_WAIT_ACTION", "E_ACTION", "S_ACTION", [ PushAction, Validate, Action ]);
		htsm.smTransition("S_WAIT_ACTION", "E_CANCEL", null, [ Cancel, Clean, PrepareAction, SetCancel]);
		htsm.smTransition("S_WAIT_ACTION", "E_MOVE_DONE", "S_DONE", [ SendMove ]);
		htsm.smTransition(["S_WAIT_ACTION","S_ACTION"], "E_END", "S_DONE", [ ]);
		htsm.smTransition("S_ACTION", "E_DONE", "S_WAIT_ACTION", [ PostAction ]);
		htsm.smTransition("S_DONE", "E_END", null, [ HideFurnitures ]);
	}

	View.Board.HumanTurn = function(aGame) {
		//Log("### View.Board.HumanTurn");
		var $this=this;
		htStateMachine=new HTStateMachine();
		htStateMachine.init();
		this.xdBuildHTStateMachine(xdv,htStateMachine,aGame);
		htStateMachine.smSetInitialState("S_INIT");
		htStateMachine.smQueueEvent("E_INIT",{});
		htStateMachine.smPlay();
	}

	View.Board.HumanTurnEnd = function(aGame) {
		//Log("### View.Board.HumanTurnEnd");
		if(htStateMachine) {
			htStateMachine.smQueueEvent("E_END",{});
			htStateMachine=null;
		}
	}

	View.Board.PlayedMove = function(aGame, aMove) {
		//Log("### View.Board.PlayedMove");
		return this.xdPlayedMove(xdv,aGame,aMove);
	}

	View.Board.xdShowEnd = function(xdv, aGame) {
		return true;
	}

	View.Board.ShowEnd=function(aGame) {
		return this.xdShowEnd(xdv,aGame);
	}

	/* ======================================== */
	
	var THREEx_boundContext=""+Math.random();
	
	function BuildThree(aGame, areaWidth,areaHeight) {

		var camera = new THREE.PerspectiveCamera( 55, (area.width()/area.height()), 1, 4000 );

		var scene = new THREE.Scene();
        
        var body = new THREE.Object3D();
		scene.add( body );
        body.add(camera);

        var harbor = new THREE.Object3D();
        scene.add( harbor );

		var ambientLight=new THREE.AmbientLight( 0xbbbbbb );
		harbor.add( ambientLight );

		var light = new THREE.SpotLight( 0xffffff, 1.75, 0, 1.05, 1, 2);  // test params here https://threejs.org/docs/?q=SpotLight#Reference/Lights/SpotLight
		light.position.set( -12, 12, 12 );
		
		light.castShadow = true;
		//light.shadowDarkness = .75;

		light.shadow.camera.near = 1;
		light.shadow.camera.far = 27;
		light.shadow.camera.fov = 90;

		light.shadow.mapSize.width = 4096;
		light.shadow.mapSize.height = 4096;

		light.target = harbor;
		
		harbor.add( light );
		
		var skylight = new THREE.PointLight( 0xcccccc, 2, 150);//, Math.PI/5, 10);
		skylight.position.set(-45,45,45);
		harbor.add(skylight);

		//light.shadowCameraVisible = false;
		// skylight.shadowCameraVisible = true; nonsens! PointLight objects don't have shadow feature
		
		var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		renderer.setSize( area.width(), area.height() );
		//renderer.setClearColor( scene.fog.color, 1 );
		
		var projector = new THREE.Projector();
		
		area.append( $(renderer.domElement) );

		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		//renderer.shadowMapEnabled = true;
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
		//renderer.physicallyBasedShading = true; // gives high level of shininess specular
		//renderer.shadowMapCascade = true;

		var stereo = false;
		var stereoEffect = new THREE.StereoEffect(renderer);
		stereoEffect.setSize( area.width(), area.height() );

        var gamepads = new VRGamepads({
            camera: camera,
            scene: scene,
            resBase: typeof JoclyPlazza!="undefined" ? JoclyPlazza.config.baseURL + JoclyPlazza.config.joclyPath + "/res/vr/" : "todo-setup-res-path",
            drag: function(position,direction,pointerObject,pointerRescale) {
                var intersectPoint = null;
                var pointedObject = null;
                VRGetIntersect(position,direction,function(object,point) {
                    intersectPoint = point;
                    pointedObject = object;
                });
                return intersectPoint ? {
                    point: intersectPoint,
                    object: pointedObject
                } : null;
            },
            click: function(position,direction) {
                VRGetIntersect(position,direction,function(object,point) {
                    if(object)
                        THREE.Object3D._threexDomEvent._notify("mouseup", object, null, point);
                });
            },
            move: function(step) {
                body.position.add(step);
            }
        });

       	var vrRay = new THREE.Raycaster();

		var camAnim=null
		
		if(typeof JoclyHub!="undefined" && JoclyHub.mode=="demo")
			camAnim=true;
		else
			camAnim=!!aGame.mViewOptions.camAnim;

		var animateCallbacks={};

        var frameBacklog = 0;
		
		function AnimControl() {
			this.animating=false;
			this.animateTimer=null;
			this.nextStop=0;
		}
		AnimControl.prototype={
			start: function() {
                body.updateMatrixWorld();
				if(this.animateTimer!=null) {
					clearTimeout(this.animateTimer);
					this.animateTimer=null;
				}
				if(this.animating==false) {
					this.animating=true;
                    this.animate();
				}
			},
			stop: function(delay) {
                if(threeCtx && vr.vrEffect && vr.vrEffect.isPresenting) {
					if(this.animateTimer!=null) {
                        clearTimeout(this.animateTimer);
                        this.animateTimer = null;
                    }
                    return;
                }
				if(delay===undefined)
					delay=200;
				var now=Date.now();
				var $this=this;
				if(this.animating) {
					if(this.animateTimer!=null) {
						if(this.nextStop<now+delay)
							clearTimeout(this.animateTimer);							
						else
							return;
					}
					this.nextStop=Math.max(this.nextStop,now+delay);
					this.animateTimer=setTimeout(function() {
						$this.animateTimer=null;
						$this.animating=false;
					},this.nextStop-now);
				}
			},
			trigger: function() {
				if(!this.animating || this.animateTimer!=null) {
					this.start();
					this.stop.apply(this,arguments);						
				}
			},
			animate: function() {
				var $this=this;
				var statsCurrentSec=0;
				var statsTic=0;
				var renderSum=0;
				var renderCount=0;
				
				function Animate(timestamp) {
                    frameBacklog--;
					var t0,t1;
					var showStats=typeof JoclyPlazza!="undefined" && JoclyPlazza.config.show3DStats;
					if(showStats) {
						var sec=Math.floor(Date.now()/1000);
						if(sec==statsCurrentSec)
							statsTic++;
						else {
							if(statsTic>0) {
								var rate=Math.round(1000*renderSum/renderCount)/1000;
                                var lag= Math.round(1000*(window.performance.now()-timestamp))/1000;
								/*
                                console.log("fps",statsTic,"render",rate,"ms","",
                                            "lag",lag,"ms","",
                                            "frame backlog",frameBacklog);
								*/
								$(statsPanel).text("fps "+statsTic);
							}
							statsTic=1;
							statsCurrentSec=sec;
						}
					}
					if($this.animating) {
                        frameBacklog++;
                        requestAnimationFrame( Animate );
                    }
					TWEEN.update();
					if(showStats)
						t0=Date.now();
                    if(vr.vrEffect && vr.vrEffect.isPresenting) {
                        gamepads.update();
                        var harborpad = gamepads.getHarborPad();
                        if(harborpad) {
                            harborpad.visible = false;
                            harborpad.getWorldPosition(ctx.harbor.position);
                            var scale = (harborpad.getAxes()[1] + 1.1) * .03;
                            ctx.harbor.scale.set(scale,scale,scale);
                            harborpad.getWorldQuaternion(ctx.harbor.quaternion);
                        } else {
                            ctx.harbor.position.set(0,0,0);
                            ctx.harbor.scale.set(1,1,1);
                            ctx.harbor.quaternion.copy(ctx.defaultHarborQuaternion);
                        }
                        vr.vrControls.update();
                        vr.vrEffect.render( scene, camera);
                    } else {
						if(!arStream) {
							ctx.harbor.position.set(0,0,0);
							ctx.harbor.scale.set(1,1,1);
							ctx.harbor.quaternion.copy(ctx.defaultHarborQuaternion);
						}
						/*
                        if(gamepads)
                            gamepads.clearAll();
						*/
						if(!arStream) {
                        	cameraControls.update();
							cameraOrientationControls.update();
						}
						if(stereo) {
							gamepads.update();
	                        stereoEffect.render( scene, camera );
						} else
                        	renderer.render( scene, camera );
                    }
					if(showStats) {
						t1=Date.now();
						renderSum+=t1-t0;
						renderCount++;
					}

					for(var cbi in animateCallbacks) {
						var cb=animateCallbacks[cbi];
						cb.callback.call(cb._this);
					}
				}
                frameBacklog++;
				Animate(window.performance.now());
			},
		}
		var animControl=new AnimControl();
        //JoclyPlazza.config.show3DStats = true;

		var statsPanel = null;
		if(typeof JoclyPlazza!="undefined" && JoclyPlazza.config.show3DStats) {
			statsPanel = document.createElement("div");
			statsPanel.id = "stats-panel";
	        Object.assign(statsPanel.style,{
				position: "absolute",
				bottom: "8px",
				left: "8px",
				zIndex: 2147483647,
				backgroundColor: "rgba(255,255,255,1)",
				padding: "4px",
			});
        	area[0].appendChild(statsPanel);
		}

		var cameraControls = new THREE.OrbitControls( camera, body, renderer.domElement);

		$.extend(cameraControls,{
			autoRotate: camAnim,
			animControl: animControl,
		});
		cameraControls.camTarget.set(0,0.8,0);

		var canOrientation = false;
		var cameraOrientationControls = new THREE.DeviceOrientationControls(body,function(controls) {
			if(typeof vr!= "undefined")
				animControl.trigger();
			if(!canOrientation && controls.enabled) {
				canOrientation = true;
				area.find(".vr-button").show();
			}
		});


		if(typeof cameraControls.addEventListener=="function")
			cameraControls.addEventListener( 'change', function() {
				animControl.trigger();
			} );

		var ctx = {
			scene: scene,
			renderer: renderer,
			light: light,
			skyLight: skylight,
			ambientLight: ambientLight,
			loader: new THREE.JSONLoader(),
			camera: camera,
			cameraControls: cameraControls,
			animateCallbacks: animateCallbacks,
			camTarget: cameraControls.camTarget,
			animControl: animControl,
            body: body,
            harbor: harbor,
            defaultHarborQuaternion: harbor.quaternion.clone(),
		};

		function VRGetIntersect(position,direction,callback) {
			var threexDomEvent = THREE.Object3D._threexDomEvent;
			vrRay.set(position,direction);
			try {
			var intersects	= vrRay.intersectObjects( threexDomEvent._boundObjs[threexDomEvent._boundContext] );
			} catch(e) {
				return callback(null,null);
			}
			if(intersects.length==0)
				return callback(null,null);
			var intersect = intersects[0];
			var object3d = threexDomEvent.getRootObject(intersect.object);
			var objectCtx = threexDomEvent._objectCtxGet(object3d);
			if(!objectCtx)
				callback(null,null);
			else
				callback(object3d,intersect.point);
		}

		function VRSetup(ctx) {

			function LookAtHarbor() {
				vr.vrControls.resetPose();
			}

			function MakeButton() {
				ctx.vrButton = document.createElement("img");
				ctx.vrButton.className = "vr-button";
				if(typeof JoclyPlazza!="undefined") {
					ctx.vrButton.setAttribute("data-vr-enter-src",JoclyPlazza.config.baseURL + JoclyPlazza.config.joclyPath + "/res/vr/vr-enter.png");
					ctx.vrButton.setAttribute("data-vr-exit-src",JoclyPlazza.config.baseURL + JoclyPlazza.config.joclyPath + "/res/vr/vr-exit.png");
				}
				ctx.vrButton.setAttribute("src",ctx.vrButton.getAttribute("data-vr-enter-src"));
				Object.assign(ctx.vrButton.style,{
					position: "absolute",
					bottom: "8px",
					right: "8px",
					cursor: "pointer",
					"z-index": 2147483647
				});
				area[0].appendChild(ctx.vrButton);
			}

			function CardboardVR() {
				MakeButton();
				ctx.vrButton.style.display = "none";
				ctx.vrButton.addEventListener("click",function() {
					if(stereo) {
						stereo = false;
						ctx.vrButton.setAttribute("src",ctx.vrButton.getAttribute("data-vr-enter-src"));
						var size = renderer.getSize();
						renderer.setViewport( 0, 0, size.width, size.height );
					} else {
						stereo = true;
						ctx.vrButton.setAttribute("src",ctx.vrButton.getAttribute("data-vr-exit-src"));
					}
					animControl.trigger();
				});
			}

			function PureVR() {
				MakeButton();
				var vrControls = new THREE.VRControls( ctx.camera );
				vr.vrControls = vrControls;
				if(window.lastVrEffect) {
					if(window.lastVrEffect.isPresenting)
						window.lastVrEffect.exitPresent();
				}
				var vrEffect = new THREE.VREffect( ctx.renderer );
				vr.vrEffect = vrEffect;
				window.lastVrEffect = vrEffect;

				window.addEventListener( 'vrdisplaypresentchange', function ( event ) {
					ctx.animControl.trigger()
				}, false );

				ctx.vrButton.addEventListener("click",function() {
					if(vrEffect.isPresenting) {
						vrEffect.exitPresent();
						ctx.vrButton.setAttribute("src",ctx.vrButton.getAttribute("data-vr-enter-src"));
					} else {
						vrEffect.requestPresent();
						ctx.vrButton.setAttribute("src",ctx.vrButton.getAttribute("data-vr-exit-src"));
						LookAtHarbor();
					}
					animControl.trigger();
				});
				
			}

			vr = {};

			if(typeof navigator.getVRDisplays != "undefined") {
				navigator.getVRDisplays()
					.then( function(displays) {
						if(displays.length==0)
							CardboardVR();
						else
							PureVR();
					} ).catch( function() {
						CardboardVR();
					});
			} else
				CardboardVR();

			return vr;
		}

        var vr = VRSetup(ctx);

        return $.extend(ctx,vr);
	}

	
	function GetEventPosition(event) {
		if(event.originalEvent)
			return GetEventPosition(event.originalEvent);
	    if(event.changedTouches && event.changedTouches.length>0) 
	    	return [event.changedTouches[0].pageX,event.changedTouches[0].pageY];
	    if(event.touches && event.touches.length>0) 
	    	return [event.touches[0].pageX,event.touches[0].pageY];
	    return [event.pageX,event.pageY];
	}

	function AR(stream) {
		if(!!arStream==!!stream) {
			console.warn("AR is already",!!stream);
			return;
		}
		arStream = stream;
		if(arStream) {
			var video = $("<video/>").addClass("ar-video").attr("autoplay", "autoplay").css({
						position: "absolute",
						top: 0,
						width: "100%",
						height: "100%",
						left: 0,
						"z-index": -1,
						backgroundColor: "#0f0",
						objectFit: "cover"
					}).appendTo(area.parent());
			JoclyAR.attach({
				element: video[0],
				stream: arStream,
				threeCtx: threeCtx
			});
			xdv.redisplayGadgets();
			threeCtx.renderer.setClearColor(new THREE.Color(threeCtx.world.color), 0);
            threeCtx.animControl.trigger();
		} else {
			var video = area.parent().find(".ar-video");
			if(video.length) {
				JoclyAR.detach({
					element: video[0]
				});
				video.remove();
			}
			xdv.redisplayGadgets();
			threeCtx.renderer.setClearColor(new THREE.Color(threeCtx.world.color), 1);
            threeCtx.animControl.trigger();
		}
	}

})();

//# sourceMappingURL=jocly-xdview.js.map
