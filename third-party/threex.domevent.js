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

