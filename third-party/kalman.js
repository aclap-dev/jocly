/**
* KalmanFilter
* @class
* @author Wouter Bulten
* @see {@link http://github.com/wouterbulten/kalmanjs}
* @version Version: 1.0.0-beta
* @copyright Copyright 2015 Wouter Bulten
* @license GNU LESSER GENERAL PUBLIC LICENSE v3
* @preserve
*/



function KalmanFilter(params) {
	/**
	* Create 1-dimensional kalman filter
	* @param  {Number} options.R Process noise
	* @param  {Number} options.Q Measurement noise
	* @param  {Number} options.A State vector
	* @param  {Number} options.B Control vector
	* @param  {Number} options.C Measurement vector
	* @return {KalmanFilter}
	*/

	this.R = typeof params.R == "undefined" ? 1 : params.R; // noise power desirable
	this.Q = typeof params.Q == "undefined" ? 1 : params.Q; // noise power estimated

	this.A = typeof params.A == "undefined" ? 1 : params.A;
	this.C = typeof params.C == "undefined" ? 1 : params.C;
	this.B = typeof params.B == "undefined" ? 0 : params.B;
	this.cov = NaN;
	this.x = NaN; // estimated signal without noise
}

/**
* Filter a new value
* @param  {Number} z Measurement
* @param  {Number} u Control
* @return {Number}
*/
KalmanFilter.prototype.filter = function (z, u) {
	if (typeof u == "undefined")
		u = 0;
	if (isNaN(this.x)) {
		this.x = (1 / this.C) * z;
		this.cov = (1 / this.C) * this.Q * (1 / this.C);
	}
	else {

		// Compute prediction
		const predX = (this.A * this.x) + (this.B * u);
		const predCov = ((this.A * this.cov) * this.A) + this.R;

		// Kalman gain
		const K = predCov * this.C * (1 / ((this.C * predCov * this.C) + this.Q));

		// Correction
		this.x = predX + K * (z - (this.C * predX));
		this.cov = predCov - (K * this.C * predCov);
	}

	return this.x;
}

/**
* Return the last filtered measurement
* @return {Number}
*/
KalmanFilter.prototype.lastMeasurement = function () {
	return this.x;
}

/**
* Set measurement noise Q
* @param {Number} noise
*/
KalmanFilter.prototype.setMeasurementNoise = function (noise) {
	this.Q = noise;
}

/**
* Set the process noise R
* @param {Number} noise
*/
KalmanFilter.prototype.setProcessNoise = function (noise) {
	this.R = noise;
}

