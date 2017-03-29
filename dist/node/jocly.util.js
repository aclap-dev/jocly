"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

function JocLog() {
	if (typeof jQuery != "undefined") {
		var strs = [];
		for (var i = 0; i < arguments.length; i++) {
			var str = arguments[i];
			if (typeof str != "string") str = JSON.stringify(str);
			strs.push("" + str);
		}
		jQuery("<p/>").text(strs.join(" ")).appendTo(jQuery("#jocly-log"));
	} else console.warn.apply(console, arguments);
}

var JocUtil = {
	JSON: JSON
};

JocUtil.reload = function () {
	window.location.reload();
};

JocUtil.setTimeout = function (fnt, timeout) {
	return setTimeout(fnt, timeout);
};

JocUtil.setInterval = function (fnt, timeout) {
	return setInterval(fnt, timeout);
};

JocUtil.clearTimeout = function (timer) {
	clearTimeout(timer);
};

JocUtil.schedule = function (target, method, args) {
	JocUtil.setTimeout(function () {
		target[method](args);
	}, 0);
};

JocUtil.setPref = function (aPrefName, aValue, options) {
	var prefName = 'jocly_pref';
	if (arguments.length < 3) options = {};
	if (options.appId) prefName += "_" + options.appId;
	if (options.game) prefName += "_" + options.game;
	prefName += "_" + aPrefName;
	if (typeof aValue == "boolean") aValue = "$#@" + aValue;
	if ((typeof aValue === "undefined" ? "undefined" : _typeof(aValue)) == "object" || typeof aValue == "array") aValue = "$#@JSON@" + JSON.stringify(aValue);
	//alert("setPref("+prefName+","+aValue+") "+typeof(aValue));
	window.localStorage.setItem(prefName, aValue);
};

JocUtil.getPref = function (aPrefName, options) {
	var prefName = 'jocly_pref';
	if (arguments.length < 2) options = {};
	if (options.appId) prefName += "_" + options.appId;
	if (options.game) prefName += "_" + options.game;
	prefName += "_" + aPrefName;
	var value = window.localStorage.getItem(prefName);
	if (value == "$#@true") value = true;else if (value == "$#@false") value = false;else if (typeof value == "string" && value.substr(0, 8) == "$#@JSON@") value = JSON.parse(value.substr(8));
	if (value == null && typeof options.defaultValue != "undefined") value = options.defaultValue;
	//alert("getPref("+prefName+") => "+value+" "+typeof(value));
	return value;
};

JocUtil.filterLevels = function (levels, maxLevel, defaultLevel) {
	function Calibrate() {
		var timer0 = new Date().getTime();
		var n = 1000;
		var m = 100;
		var a = [];
		var b = [];
		for (var i = 0; i < m; i++) {
			a.push(i);
		}
		for (var i = 0; i < n; i++) {
			while (a.length > 0) {
				b.push(a.shift());
			}var c = a;
			a = b;
			b = c;
		}
		var timer1 = new Date().getTime();
		return timer1 - timer0;
	}
	var calibration = parseInt(JocUtil.getPref("calibration", { defaultValue: 0 }));
	var calibrationDate = parseInt(JocUtil.getPref("calibrationDate", { defaultValue: 0 }));
	if (calibrationDate < new Date().getTime() - 24 * 60 * 60 * 1000) calibration = 0;
	var maxTime = 60000;
	var bestDefaultMaxTime = 3000;
	var levels0 = [];
	if (levels) {
		var bestLevel = null;
		var bestLevelTime = 0;
		var bestLevelForced = false;
		for (var k in levels) {
			var level = levels[k];
			if (level.isDefault) {
				bestLevel = level;
				bestLevelFound = true;
			}
			level.isDefault = false;
			level.fullLabel = strings["comp-level"] + " " + level.label;
			level.optionValue = k;
			if (level.calRatio) {
				if (!calibration) {
					calibration = Calibrate();
					JocLog("Calibration", calibration);
					JocUtil.setPref("calibration", calibration, {});
					JocUtil.setPref("calibrationDate", new Date().getTime(), {});
				}
				var levelTime = calibration * level.calRatio;
				if (levelTime > maxTime && levels0.length >= 2) continue;
				if (bestLevelForced == false) {
					if (bestLevel == null || levelTime < bestDefaultMaxTime && levelTime > bestLevelTime) {
						bestLevel = level;
						bestLevelTime = levelTime;
					}
				}
			} else if (bestLevel == null) bestLevel = level;
			levels0.push(level);
		}
		if (bestLevel) bestLevel.isDefault = true;
	} else {
		var maxLevel0 = 9;
		if (maxLevel) maxLevel0 = maxLevel;
		for (var i = 0; i <= maxLevel0; i++) {
			var level = {
				fullLabel: strings["comp-level"] + " " + (i + 1),
				optionValue: "machine-" + i,
				isDefault: false
			};
			if (typeof defaultLevel != "undefined" && i == defaultLevel) level.isDefault = true;
			levels0.push(level);
		}
	}
	return levels0;
};

JocUtil.cookieSupportTested = false;
JocUtil.cookieSupport = true;
JocUtil.hasCookieSupport = function () {
	if (JocUtil.cookieSupportTested) return JocUtil.cookieSupport;
	if (document.cookie.length == 0) {
		var date = new Date();
		date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
		document.cookie = "jocly=" + escape("{}") + "; path=/; expires=" + date.toGMTString() + ";";
		if (document.cookie.length == 0) JocUtil.cookieSupport = false;
	}
	JocUtil.cookieSupportTested = true;
	return JocUtil.cookieSupport;
};

JocUtil.getCookieData = function () {
	if (JocUtil.hasCookieSupport()) {
		var cookies = document.cookie.split(";");
		for (var i in cookies) {
			var c = /^ *(.*)$/.exec(cookies[i])[1];
			if (c.indexOf("jocly=") == 0) {
				try {
					return JSON.parse(unescape(c.substring(6)));
				} catch (e) {
					JocLog("Unable to parse cookie", c);
				}
			}
		}
		return {};
	} else {
		var value = window.localStorage.getItem("jocly");
		if (value == null) return {};else return JSON.parse(value);
	}
};

JocUtil.setCookieData = function (name, value) {
	if (JocUtil.hasCookieSupport()) {
		var jocly = JocUtil.getCookieData();
		if (value == null) delete jocly[name];else jocly[name] = value;
		var date = new Date();
		date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
		var cookie = "jocly=" + escape(JSON.stringify(jocly)) + "; path=/; expires=" + date.toGMTString() + ";";
		document.cookie = cookie;
	} else {
		var jocly = window.localStorage.getItem("jocly");
		if (jocly == null) jocly = {};else jocly = JSON.parse(jocly);
		jocly[name] = value;
		window.localStorage.setItem("jocly", JSON.stringify(jocly));
	}
};

JocUtil.extend = function (target, obj) {
	for (var i in obj) {
		target[i] = obj[i];
	}
};

JocUtil.md5 = function (string) {
	function RotateLeft(lValue, iShiftBits) {
		return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
	}
	function AddUnsigned(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = lX & 0x80000000;
		lY8 = lY & 0x80000000;
		lX4 = lX & 0x40000000;
		lY4 = lY & 0x40000000;
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return lResult ^ 0x80000000 ^ lX8 ^ lY8;
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
			} else {
				return lResult ^ 0x40000000 ^ lX8 ^ lY8;
			}
		} else {
			return lResult ^ lX8 ^ lY8;
		}
	}
	function F(x, y, z) {
		return x & y | ~x & z;
	}
	function G(x, y, z) {
		return x & z | y & ~z;
	}
	function H(x, y, z) {
		return x ^ y ^ z;
	}
	function I(x, y, z) {
		return y ^ (x | ~z);
	}
	function FF(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
	function GG(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
	function HH(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
	function II(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - lByteCount % 4) / 4;
			lBytePosition = lByteCount % 4 * 8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | string.charCodeAt(lByteCount) << lBytePosition;
			lByteCount++;
		}
		lWordCount = (lByteCount - lByteCount % 4) / 4;
		lBytePosition = lByteCount % 4 * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | 0x80 << lBytePosition;
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};
	function WordToHex(lValue) {
		var WordToHexValue = "",
		    WordToHexValue_temp = "",
		    lByte,
		    lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = lValue >>> lCount * 8 & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
		}
		return WordToHexValue;
	};
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if (c > 127 && c < 2048) {
				utftext += String.fromCharCode(c >> 6 | 192);
				utftext += String.fromCharCode(c & 63 | 128);
			} else {
				utftext += String.fromCharCode(c >> 12 | 224);
				utftext += String.fromCharCode(c >> 6 & 63 | 128);
				utftext += String.fromCharCode(c & 63 | 128);
			}
		}
		return utftext;
	};
	var x = Array();
	var k, AA, BB, CC, DD, a, b, c, d;
	var S11 = 7,
	    S12 = 12,
	    S13 = 17,
	    S14 = 22;
	var S21 = 5,
	    S22 = 9,
	    S23 = 14,
	    S24 = 20;
	var S31 = 4,
	    S32 = 11,
	    S33 = 16,
	    S34 = 23;
	var S41 = 6,
	    S42 = 10,
	    S43 = 15,
	    S44 = 21;
	string = Utf8Encode(string);
	x = ConvertToWordArray(string);
	a = 0x67452301;b = 0xEFCDAB89;c = 0x98BADCFE;d = 0x10325476;
	for (k = 0; k < x.length; k += 16) {
		AA = a;BB = b;CC = c;DD = d;
		a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = AddUnsigned(a, AA);
		b = AddUnsigned(b, BB);
		c = AddUnsigned(c, CC);
		d = AddUnsigned(d, DD);
	}
	var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
	return temp.toLowerCase();
};

JocUtil.sha1 = function (msg) {
	function rotate_left(n, s) {
		var t4 = n << s | n >>> 32 - s;
		return t4;
	};
	function lsb_hex(val) {
		var str = "";
		var i;
		var vh;
		var vl;
		for (i = 0; i <= 6; i += 2) {
			vh = val >>> i * 4 + 4 & 0x0f;
			vl = val >>> i * 4 & 0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	};
	function cvt_hex(val) {
		var str = "";
		var i;
		var v;
		for (i = 7; i >= 0; i--) {
			v = val >>> i * 4 & 0x0f;
			str += v.toString(16);
		}
		return str;
	};
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if (c > 127 && c < 2048) {
				utftext += String.fromCharCode(c >> 6 | 192);
				utftext += String.fromCharCode(c & 63 | 128);
			} else {
				utftext += String.fromCharCode(c >> 12 | 224);
				utftext += String.fromCharCode(c >> 6 & 63 | 128);
				utftext += String.fromCharCode(c & 63 | 128);
			}
		}
		return utftext;
	};
	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;
	msg = Utf8Encode(msg);
	var msg_len = msg.length;
	var word_array = new Array();
	for (i = 0; i < msg_len - 3; i += 4) {
		j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
		word_array.push(j);
	}
	switch (msg_len % 4) {
		case 0:
			i = 0x080000000;
			break;
		case 1:
			i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
			break;

		case 2:
			i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
			break;

		case 3:
			i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
			break;
	}
	word_array.push(i);
	while (word_array.length % 16 != 14) {
		word_array.push(0);
	}word_array.push(msg_len >>> 29);
	word_array.push(msg_len << 3 & 0x0ffffffff);
	for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
		for (i = 0; i < 16; i++) {
			W[i] = word_array[blockstart + i];
		}for (i = 16; i <= 79; i++) {
			W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
		}A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;
		for (i = 0; i <= 19; i++) {
			temp = rotate_left(A, 5) + (B & C | ~B & D) + E + W[i] + 0x5A827999 & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}
		for (i = 20; i <= 39; i++) {
			temp = rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1 & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}
		for (i = 40; i <= 59; i++) {
			temp = rotate_left(A, 5) + (B & C | B & D | C & D) + E + W[i] + 0x8F1BBCDC & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}
		for (i = 60; i <= 79; i++) {
			temp = rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6 & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}
		H0 = H0 + A & 0x0ffffffff;
		H1 = H1 + B & 0x0ffffffff;
		H2 = H2 + C & 0x0ffffffff;
		H3 = H3 + D & 0x0ffffffff;
		H4 = H4 + E & 0x0ffffffff;
	}
	var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
	return temp.toLowerCase();
};

/*
A C-program for MT19937, with initialization improved 2002/1/26.
Coded by Takuji Nishimura and Makoto Matsumoto.
Before using, initialize the state by using init_genrand(seed)
or init_by_array(init_key, key_length).
Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
All rights reserved.
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.
3. The names of its contributors may not be used to endorse or promote
products derived from this software without specific prior written
permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
Any feedback is very welcome.
http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

var MersenneTwister = function MersenneTwister(seed) {
	if (seed == undefined) {
		seed = new Date().getTime();
	}
	/* Period parameters */
	this.N = 624;
	this.M = 397;
	this.MATRIX_A = 0x9908b0df; /* constant vector a */
	this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
	this.LOWER_MASK = 0x7fffffff; /* least significant r bits */
	this.mt = new Array(this.N); /* the array for the state vector */
	this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */

	this.init_genrand(seed);
};
/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function (s) {
	this.mt[0] = s >>> 0;
	for (this.mti = 1; this.mti < this.N; this.mti++) {
		var s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
		this.mt[this.mti] = (((s & 0xffff0000) >>> 16) * 1812433253 << 16) + (s & 0x0000ffff) * 1812433253 + this.mti;
		/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
		/* In the previous versions, MSBs of the seed affect */
		/* only MSBs of the array mt[]. */
		/* 2002/01/09 modified by Makoto Matsumoto */
		this.mt[this.mti] >>>= 0;
		/* for >32 bit machines */
	}
};
/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function (init_key, key_length) {
	var i, j, k;
	this.init_genrand(19650218);
	i = 1;j = 0;
	k = this.N > key_length ? this.N : key_length;
	for (; k; k--) {
		var s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
		this.mt[i] = (this.mt[i] ^ (((s & 0xffff0000) >>> 16) * 1664525 << 16) + (s & 0x0000ffff) * 1664525) + init_key[j] + j; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++;j++;
		if (i >= this.N) {
			this.mt[0] = this.mt[this.N - 1];i = 1;
		}
		if (j >= key_length) j = 0;
	}
	for (k = this.N - 1; k; k--) {
		var s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
		this.mt[i] = (this.mt[i] ^ (((s & 0xffff0000) >>> 16) * 1566083941 << 16) + (s & 0x0000ffff) * 1566083941) - i; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++;
		if (i >= this.N) {
			this.mt[0] = this.mt[this.N - 1];i = 1;
		}
	}

	this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
};
/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function () {
	var y;
	var mag01 = new Array(0x0, this.MATRIX_A);
	/* mag01[x] = x * MATRIX_A for x=0,1 */

	if (this.mti >= this.N) {
		/* generate N words at one time */
		var kk;

		if (this.mti == this.N + 1) /* if init_genrand() has not been called, */
			this.init_genrand(5489); /* a default initial seed is used */

		for (kk = 0; kk < this.N - this.M; kk++) {
			y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
			this.mt[kk] = this.mt[kk + this.M] ^ y >>> 1 ^ mag01[y & 0x1];
		}
		for (; kk < this.N - 1; kk++) {
			y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
			this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ y >>> 1 ^ mag01[y & 0x1];
		}
		y = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK;
		this.mt[this.N - 1] = this.mt[this.M - 1] ^ y >>> 1 ^ mag01[y & 0x1];

		this.mti = 0;
	}

	y = this.mt[this.mti++];

	/* Tempering */
	y ^= y >>> 11;
	y ^= y << 7 & 0x9d2c5680;
	y ^= y << 15 & 0xefc60000;
	y ^= y >>> 18;

	return y >>> 0;
};
/* generates a random number on [0,0x7fffffff]-interval */
MersenneTwister.prototype.genrand_int31 = function () {
	return this.genrand_int32() >>> 1;
};
/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.genrand_real1 = function () {
	return this.genrand_int32() * (1.0 / 4294967295.0);
	/* divided by 2^32-1 */
};

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function () {
	return this.genrand_int32() * (1.0 / 4294967296.0);
	/* divided by 2^32 */
};
/* generates a random number on (0,1)-real-interval */
MersenneTwister.prototype.genrand_real3 = function () {
	return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
	/* divided by 2^32 */
};
/* generates a random number on [0,1) with 53-bit resolution*/
MersenneTwister.prototype.genrand_res53 = function () {
	var a = this.genrand_int32() >>> 5,
	    b = this.genrand_int32() >>> 6;
	return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
};

if (typeof module !== 'undefined' && module.exports) {
	exports.MersenneTwister = MersenneTwister;
	exports.JocUtil = JocUtil;
} else {
	undefined.MersenneTwister = MersenneTwister;
	undefined.JocUtil = JocUtil;
}
//# sourceMappingURL=jocly.util.js.map
