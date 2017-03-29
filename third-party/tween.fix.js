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