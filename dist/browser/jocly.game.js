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
	if(typeof jQuery!="undefined") {
		var strs=[];
		for(var i=0;i<arguments.length;i++) {
			var str=arguments[i];
			if(typeof(str)!="string")
				str=JSON.stringify(str);		
			strs.push(""+str);
		}
		jQuery("<p/>").text(strs.join(" ")).appendTo(jQuery("#jocly-log"));
	} else
		console.warn.apply(console,arguments);
}

var JocUtil = {
	JSON: JSON
}

JocUtil.reload = function() {
	window.location.reload();
}

JocUtil.setTimeout=function(fnt,timeout) {
	return setTimeout(fnt,timeout);
}

JocUtil.setInterval=function(fnt,timeout) {
	return setInterval(fnt,timeout);
}

JocUtil.clearTimeout=function(timer) {
	clearTimeout(timer);
}

JocUtil.schedule=function(target,method,args) {
	JocUtil.setTimeout(function() { target[method](args); }, 0);
}

JocUtil.setPref=function(aPrefName,aValue,options) {
	var prefName='jocly_pref';
	if(arguments.length<3)
		options={}
	if(options.appId)
		prefName+="_"+options.appId;
	if(options.game)
		prefName+="_"+options.game;
	prefName+="_"+aPrefName;
	if(typeof(aValue)=="boolean")
		aValue="$#@"+aValue;
	if(typeof(aValue)=="object" || typeof(aValue)=="array")
		aValue="$#@JSON@"+JSON.stringify(aValue);
	//alert("setPref("+prefName+","+aValue+") "+typeof(aValue));
	window.localStorage.setItem(prefName,aValue);
}

JocUtil.getPref=function(aPrefName,options) {
	var prefName='jocly_pref';
	if(arguments.length<2)
		options={}
	if(options.appId)
		prefName+="_"+options.appId;
	if(options.game)
		prefName+="_"+options.game;
	prefName+="_"+aPrefName;
	var value=window.localStorage.getItem(prefName);
	if(value=="$#@true")
		value=true;
	else if(value=="$#@false")
		value=false;
	else if(typeof(value)=="string" && value.substr(0,8)=="$#@JSON@")
		value=JSON.parse(value.substr(8));
	if(value==null && typeof options.defaultValue!="undefined")
		value=options.defaultValue;
	//alert("getPref("+prefName+") => "+value+" "+typeof(value));
	return value;
}

JocUtil.filterLevels=function(levels,maxLevel,defaultLevel) {
	function Calibrate() {
		var timer0=new Date().getTime();
		var n=1000;
		var m=100;
		var a=[];
		var b=[];
		for(var i=0;i<m;i++) {
			a.push(i);
		}
		for(var i=0;i<n;i++) {
			while(a.length>0)
				b.push(a.shift());
			var c=a;
			a=b;
			b=c;
		}
		var timer1=new Date().getTime();
		return timer1-timer0;
	}
	var calibration=parseInt(JocUtil.getPref("calibration",{defaultValue:0}));
	var calibrationDate=parseInt(JocUtil.getPref("calibrationDate",{defaultValue:0}));
	if(calibrationDate<new Date().getTime()-24*60*60*1000)
		calibration=0;
	var maxTime=60000;
	var bestDefaultMaxTime=3000;
	var levels0=[];
	if(levels) {
		var bestLevel=null;
		var bestLevelTime=0;
		var bestLevelForced=false;
		for(var k in levels) {
			var level=levels[k];
			if(level.isDefault) {
				bestLevel=level;
				bestLevelFound=true;
			}
			level.isDefault=false;
			level.fullLabel=strings["comp-level"]+" "+level.label;
			level.optionValue=k;
			if(level.calRatio) {
				if(!calibration) {
					calibration=Calibrate();
					JocLog("Calibration",calibration);
					JocUtil.setPref("calibration",calibration,{});
					JocUtil.setPref("calibrationDate",new Date().getTime(),{});
				}
				var levelTime=calibration*level.calRatio;
				if(levelTime>maxTime && levels0.length>=2)
					continue;
				if(bestLevelForced==false) {
					if(bestLevel==null || (levelTime<bestDefaultMaxTime && levelTime>bestLevelTime)) {
						bestLevel=level;
						bestLevelTime=levelTime;
					}
				}
			} else if(bestLevel==null)
				bestLevel=level;
			levels0.push(level);
		}
		if(bestLevel)
			bestLevel.isDefault=true;
	} else {
		var maxLevel0=9;
		if(maxLevel)
			maxLevel0=maxLevel;
		for(var i=0;i<=maxLevel0;i++) {
			var level={
				fullLabel: strings["comp-level"]+" "+(i+1),
				optionValue: "machine-"+i,
				isDefault: false
			};
			if(typeof(defaultLevel)!="undefined" && i==defaultLevel)
				level.isDefault=true;
			levels0.push(level);
		}
	}
	return levels0;
}

JocUtil.cookieSupportTested=false;
JocUtil.cookieSupport=true;
JocUtil.hasCookieSupport=function() {
	if(JocUtil.cookieSupportTested)
		return JocUtil.cookieSupport;
	if(document.cookie.length==0) {
		var date=new Date();
		date.setTime(date.getTime()+365*24*60*60*1000);
		document.cookie="jocly="+escape("{}")+"; path=/; expires="+date.toGMTString()+";";
		if(document.cookie.length==0)
			JocUtil.cookieSupport=false;
	}
	JocUtil.cookieSupportTested=true;
	return JocUtil.cookieSupport;	
}

JocUtil.getCookieData=function() {
	if(JocUtil.hasCookieSupport()) {
		var cookies=document.cookie.split(";");
		for(var i in cookies) {
			var c=/^ *(.*)$/.exec(cookies[i])[1];
			if(c.indexOf("jocly=")==0) {
				try {
					return JSON.parse(unescape(c.substring(6)));
				} catch(e) {
					JocLog("Unable to parse cookie",c);
				}
			}
		}
		return {};
	} else {
		var value=window.localStorage.getItem("jocly");
		if(value==null)
			return {};
		else
			return JSON.parse(value);
	}
}

JocUtil.setCookieData=function(name,value) {
	if(JocUtil.hasCookieSupport()) {
		var jocly=JocUtil.getCookieData();
		if(value==null)
			delete jocly[name];
		else
			jocly[name]=value;
		var date=new Date();
		date.setTime(date.getTime()+365*24*60*60*1000);
		var cookie="jocly="+escape(JSON.stringify(jocly))+"; path=/; expires="+date.toGMTString()+";";
		document.cookie=cookie;
	} else {
		var jocly=window.localStorage.getItem("jocly");
		if(jocly==null)
			jocly={};
		else
			jocly=JSON.parse(jocly);
		jocly[name]=value;
		window.localStorage.setItem("jocly",JSON.stringify(jocly));	
	}
}

JocUtil.extend=function(target,obj) {
	for(var i in obj)
		target[i]=obj[i];
}

JocUtil.md5=function(string) {
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}
	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}
 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }
	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};
	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	};
	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;
	string = Utf8Encode(string);
	x = ConvertToWordArray(string);
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}
	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
	return temp.toLowerCase();
}

JocUtil.sha1=function(msg) {
	function rotate_left(n,s) {
		var t4 = ( n<<s ) | (n>>>(32-s));
		return t4;
	};
	function lsb_hex(val) {
		var str="";
		var i;
		var vh;
		var vl;
		for( i=0; i<=6; i+=2 ) {
			vh = (val>>>(i*4+4))&0x0f;
			vl = (val>>>(i*4))&0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	};
	function cvt_hex(val) {
		var str="";
		var i;
		var v;
		for( i=7; i>=0; i-- ) {
			v = (val>>>(i*4))&0x0f;
			str += v.toString(16);
		}
		return str;
	};
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
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
	for( i=0; i<msg_len-3; i+=4 ) {
		j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
		msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
		word_array.push( j );
	}
	switch( msg_len % 4 ) {
		case 0:
			i = 0x080000000;
		break;
		case 1:
			i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
		break;
 
		case 2:
			i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
		break;
 
		case 3:
			i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8	| 0x80;
		break;
	}
	word_array.push( i );
	while( (word_array.length % 16) != 14 ) word_array.push( 0 );
	word_array.push( msg_len>>>29 );
	word_array.push( (msg_len<<3)&0x0ffffffff );
	for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
		for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
		for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;
		for( i= 0; i<=19; i++ ) {
			temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
		for( i=20; i<=39; i++ ) {
			temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
		for( i=40; i<=59; i++ ) {
			temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
		for( i=60; i<=79; i++ ) {
			temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;
	}
	var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
	return temp.toLowerCase();
}

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

var MersenneTwister = function(seed) {
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
	this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

	this.init_genrand(seed);
}
/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
	this.mt[0] = s >>> 0;
	for (this.mti=1; this.mti<this.N; this.mti++) {
		var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
		this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
		+ this.mti;
		/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
		/* In the previous versions, MSBs of the seed affect */
		/* only MSBs of the array mt[]. */
		/* 2002/01/09 modified by Makoto Matsumoto */
		this.mt[this.mti] >>>= 0;
		/* for >32 bit machines */
	}
}
/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
	var i, j, k;
	this.init_genrand(19650218);
	i=1; j=0;
	k = (this.N>key_length ? this.N : key_length);
	for (; k; k--) {
		var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
		+ init_key[j] + j; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++; j++;
		if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
		if (j>=key_length) j=0;
	}
	for (k=this.N-1; k; k--) {
		var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
		- i; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++;
		if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
	}

	this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
}
/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
	var y;
	var mag01 = new Array(0x0, this.MATRIX_A);
	/* mag01[x] = x * MATRIX_A for x=0,1 */

	if (this.mti >= this.N) { /* generate N words at one time */
		var kk;

		if (this.mti == this.N+1) /* if init_genrand() has not been called, */
			this.init_genrand(5489); /* a default initial seed is used */

		for (kk=0;kk<this.N-this.M;kk++) {
			y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
			this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		for (;kk<this.N-1;kk++) {
			y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
			this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
		this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

		this.mti = 0;
	}

	y = this.mt[this.mti++];

	/* Tempering */
	y ^= (y >>> 11);
	y ^= (y << 7) & 0x9d2c5680;
	y ^= (y << 15) & 0xefc60000;
	y ^= (y >>> 18);

	return y >>> 0;
}
/* generates a random number on [0,0x7fffffff]-interval */
MersenneTwister.prototype.genrand_int31 = function() {
	return (this.genrand_int32()>>>1);
}
/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.genrand_real1 = function() {
	return this.genrand_int32()*(1.0/4294967295.0);
	/* divided by 2^32-1 */
}

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
	return this.genrand_int32()*(1.0/4294967296.0);
	/* divided by 2^32 */
}
/* generates a random number on (0,1)-real-interval */
MersenneTwister.prototype.genrand_real3 = function() {
	return (this.genrand_int32() + 0.5)*(1.0/4294967296.0);
	/* divided by 2^32 */
}
/* generates a random number on [0,1) with 53-bit resolution*/
MersenneTwister.prototype.genrand_res53 = function() {
	var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
	return(a*67108864.0+b)*(1.0/9007199254740992.0);
} 

if (typeof module !== 'undefined' && module.exports) {
	exports.MersenneTwister = MersenneTwister;
	exports.JocUtil = JocUtil;
} else {
	this.MersenneTwister = MersenneTwister;
	this.JocUtil = JocUtil;
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

var JoclyUCT={};

if(typeof process!=="undefined" && process.title === "node") {
	module.exports.JoclyUCT = JoclyUCT;
	(function() {
		var r = require;
		var ju = r("./jocly.util.js");
		global.MersenneTwister = ju.MersenneTwister;
		global.JocUtil = ju.JocUtil;
	})();
} else
	this.JoclyUCT = JoclyUCT;

(function() {
	
	function Node(parent,who) {
		this.visits=1;							// number of time the node has been visited
		this.children=null;					// node children if any
		this.who=who;							// 1 = first player, 2 = second player
		this.parents=[];						// parent nodes
		if(parent)
			this.parents.push(parent);
		this.known=false;						// true if all the node and nodes below have been expanded and all leaves are terminal 
		this.evaluation=0;						// the current minimax value
		this.staticEvalSum=0;					// the sum of the normalized playouts evaluations
		this.staticEvalCount=0;				// the number of playouts evaluations
		this.depth=parent?parent.depth+1:0;		// the node depth
	}
	
	Node.prototype={
		addParent: function(parent) {
			this.parents.push(parent);
			if(parent.depth+1<this.depth)
				this.depth=parent.depth+1;
		}
	}
	
	var winnerMap={ // convert from Jocly convention (draw==2)
		"-1": -1,
		1: 1,
		2: 0,
		0: 0
	}
		
	JoclyUCT.startMachine = function(aGame,aOptions) {
		var loopCount=0;
		var nodeCount=0;
		var redundantNodeCount=0;
		var poDur=0,poCount=0;	// playout stats
		var skippedAlphaBeta=0; // alpha-beta stats
		var maxDepth=0;

		var uctParams={
				minVisitsExpand: aOptions.level.minVisitsExpand || 1,
				playoutSpread: aOptions.level.playoutSpread || 2,
				playoutDepth: (aOptions.level.playoutDepth!==undefined)?aOptions.level.playoutDepth:0,
				c: (aOptions.level.c!==undefined)?aOptions.level.c:.3,
				playoutCeil: (aOptions.level.playoutCeil!==undefined)?aOptions.level.playoutCeil:0,
				log: aOptions.level.log?true:false,
				maxDuration: (aOptions.level.maxDuration!==undefined)?aOptions.level.maxDuration:2,
				maxLoops: (aOptions.level.maxLoops!==undefined)?aOptions.level.maxLoops:0,
				maxNodes: (aOptions.level.maxNodes!==undefined)?aOptions.level.maxNodes:0,
				showMinimaxTree: aOptions.level.showMinimaxTree?true:false,
				showBestLine: aOptions.level.showBestLine?true:false,
				ignoreLeaf: aOptions.level.ignoreLeaf===undefined?false:aOptions.level.ignoreLeaf,
				propagateMultiVisits: aOptions.level.propagateMultiVisits===undefined?true:aOptions.level.propagateMultiVisits,
				propagation: aOptions.level.propagation===undefined?"mixed":aOptions.level.propagation,
				useDepthWeights: aOptions.level.useDepthWeights===undefined?false:aOptions.level.useDepthWeights,
				productRatio: aOptions.level.productRatio===undefined?0:aOptions.level.productRatio,
				useAlphaBeta: aOptions.level.useAlphaBeta===undefined?false:aOptions.level.useAlphaBeta,
				uncertaintyFactor: aOptions.level.uncertaintyFactor===undefined?0:aOptions.level.uncertaintyFactor,
				directVisits: aOptions.level.directVisits===undefined?true:aOptions.level.directVisits,
				distributeEval: aOptions.level.distributeEval===undefined?true:aOptions.level.distributeEval,
				pickMove: aOptions.level.pickMove===undefined?"besteval":aOptions.level.pickMove, // or maxvisits
				debugRawEval: aOptions.level.debugRawEval===undefined?false:aOptions.level.debugRawEval,
		};
		var uctNodes={};
		var signatures; // the array of visited board signatures

		if(uctParams.log)
			console.log("Running UCT AI - ",aOptions.level.label,"- Player",aGame.mWho==1?"A":"B");

		/*
		 * Normalize evaluations to get -1<eval<1
		 * Handle negative and positive evaluations separately so 0 remains 0 
		 */
		var evalMapPositive={
			v: 0,						// evaluation original value
			l: null,					// "less" branch (for evaluations < v)
			m: {						// "more" branch (for evaluations > v)
				v: Number.MAX_VALUE,
				l: null,
				m: null,
			},
		}
		var evalMapNegative=JSON.parse(JSON.stringify(evalMapPositive)); // deep copy for the initial negative map
		
		function NormalizeEval(evaluation) {
			var evalNode=evalMapPositive;
			var negative=false;
			var normEval=0, step=1;
			if(evaluation==0)
				return 0;
			if(evaluation<0) {
				evaluation=-evaluation;
				evalNode=evalMapNegative;
				negative=true;
			}
			while(true) {
				if(evaluation>evalNode.v) {
					normEval+=step;
					if(!evalNode.m) {
						evalNode.m={
							v: evaluation,
							l: null,
							m: null
						}
					}
					evalNode=evalNode.m;
				} else if(evaluation<evalNode.v) {
					normEval-=step;
					if(!evalNode.l) {
						evalNode.l={
							v: evaluation,
							l: null,
							m: null
						}
					}
					evalNode=evalNode.l;
				} else {	// matching evaluation
					break;
				}
				step=step/2;
			}
			if(negative)
				normEval=-normEval;
			return normEval;
		}
		
		/*
		 * Best evaluation (minimax)
		 */
		function GetMinimaxEval(node,children) {
			var evaluation=undefined;
			for(var i=0;i<children.length;i++) {
				var node1=children[i];
				if(evaluation===undefined || node1.evaluation*node1.who>evaluation*node1.who)
					evaluation=node1.evaluation;
			}
			return evaluation;
		}
		/*
		 * Minus worse opponent evaluation
		 */
		function GetMaximinEval(node,children) {
			var evaluation=undefined;
			for(var i=0;i<children.length;i++) {
				var node1=children[i];
				if(evaluation===undefined || node1.evaluation*node1.who<evaluation*node1.who)
					evaluation=node1.evaluation;
			}
			return -evaluation;
		}
		/*
		 * Probability product evaluation
		 */
		function GetProductEval(node,children) {
			var value=1;
			for(var i=0;i<children.length;i++) {
				var node1=children[i];
				value1=(node1.evaluation+1)/2;
				if(node.who==1)
					value*=1-node1.evaluation;
				else
					value*=node1.evaluation;
			}
			if(node.who==1)
				return (1-value)*2-1;
			else
				return value*2-1;
		}
		
		function PropagateEvalParent(node,visits,visited) {
			if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop && (node.sign in visited))
				return;
			var children=[];
			if(uctParams.ignoreLeaf) {
				var hasExpandedChildren=false;
				for(var i=0;i<node.children.length;i++)
					if(node.children[i].n.children) {
						hasExpandedChildren=true;
						break;
					}
				if(hasExpandedChildren) {
					for(var i=0;i<node.children.length;i++) {
						var node1=node.children[i].n;
						if(node1.known || node1.children)
							children.push(node1);
					}
				}
			}
			if(children.length==0)
				for(var i=0;i<node.children.length;i++)
					children.push(node.children[i].n);

			var evaluation;
			switch(uctParams.propagation) {
			case "maximin":
				evaluation=GetMaximinEval(node,children);
				break;
			case "minimax2min-avg":
				var evaluation1=GetMaximinEval(node,children);
				var evaluation2=GetMinimaxEval(node,children);
				evaluation=(evaluation1+evaluation2)/2;
				break;
			case "minimax2min-best":
				var evaluation1=GetMaximinEval(node,children);
				var evaluation2=GetMinimaxEval(node,children);
				if(node.who==1)
					evaluation=Math.max(evaluation1,evaluation2);
				else
					evaluation=Math.min(evaluation1,evaluation2);
				break;
			case "product":
				evaluation=GetPropabilityProductEval(node,children);
				break;
			case "minimax":
			case "mixed":
			default:
				evaluation=GetMinimaxEval(node,children);
				if(uctParams.propagation=="mixed" && uctParams.productRatio>0) {
					evaluation2=GetProductEval(node,children);
					evaluation=uctParams.productRatio*evaluation2+(1-uctParams.productRatio)*evaluation;
				}
				if(uctParams.useDepthWeights)
					evaluation=WeightEval(evaluation,node.depth+1);
			}
			if(uctParams.uncertaintyFactor) // tend to do good things now rather than later
				evaluation*=1-Math.pow(10,-uctParams.uncertaintyFactor)*Math.log(node.depth+1);
			if(node.evaluation!==evaluation) { 
				node.evaluation=evaluation;
				if(!uctParams.directVisits)
					node.visits+=visits;
				PropagateEval(node,visits,visited);
			} else if(!uctParams.directVisits)
				PropagateVisits(node,visits,visited);
		}
		function PropagateEval(node,visits,visited) {
			if(node.parents.length==0) // root node: stop here
				return;
			if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop) {
				if(!visited)
					visited={};
				visited[node.sign]=true;
			}
			for(var i=0;i<node.parents.length;i++) {
				var parent=node.parents[i];
				if(uctParams.useAlphaBeta) { // sort the parent children so alpha-beta will be more efficient
					parent.children.sort(function(c1,c2) {
						return (c2.evaluation-c1.evaluation)*node.who;
					});
				}
				PropagateEvalParent(parent,visits,visited);
			}
		}

		function PropagateVisits(node,visits,visited) {
			if(node.parents.length==0) // root node: stop here
				return;
			if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop) {
				if(!visited)
					visited={};
				visited[node.sign]=true;
			}
			for(var i=0;i<node.parents.length;i++) {
				var parent=node.parents[i];
				if(!(parent.sign in visited)) {
					parent.visits+=visits;
					visited[parent.sign]=true;
					PropagateVisits(parent,visits,visited);
				}
			}
		}
		
		/*
		 * Propagates known boolean up 
		 */
		function PropagateKnownParent(node,visited) {
			if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop && (node.sign in visited))
				return;
			var known=true;
			for(var i=0;i<node.children.length;i++) {
				var node1=node.children[i].n;
				if(node1.known==false) {
					known=false;
					break;
				}
			}
			if(known==true) {
				node.known=true;
				PropagateKnown(node,visited);
			}
		}
		function PropagateKnown(node,visited) {
			if(node.known==false || node.parents.length==0)
				return;
			if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop) {
				if(!visited)
					visited={};
				visited[node.sign]=true;
			}
			for(var i=0;i<node.parents.length;i++)
				PropagateKnownParent(node.parents[i],visited);
		}

		/*
		 * A simple 32 bits integer transformation function, so that zobrist board signatures can be XORed without side effect
		 */
		function TransformInteger(v0) {
			var ib=1;
			var v=0;
			for(var i=0;i<32;i++) {
				var b=(v0>>>i)&1;
				if(ib)
					v=(v<<1)|b;
				else
					v=(v<<1)|(1-b);
				ib=b;
			}
			return v;
		}
		
		/*
		 * Runs an iteration
		 */
		function Step() {
			loopCount++;

			// Select
			var board=new (aGame.GetBoardClass())(aGame);
			board.CopyFrom(aGame.mBoard);
			
			var pathSign=0; // keep track of the boards we've been through (order doesn't matter)
			var node=rootNode;
			var depth=0;
			var descendMaxDepth=0;
			var moves=[];
			var nodePath=[];
			var parentVisits=loopCount;
			var visited={};
			var alpha=-2;
			var beta=2;
			while(true) {
				nodePath.push(node);
				if(depth>descendMaxDepth) {
					descendMaxDepth=depth;
				}
				if(node.children===null)
					break;
				var candidateChildren;
				if(uctParams.useAlphaBeta) {
					candidateChildren=[];
					for(var i=0;i<node.children.length;i++) {
						var child1=node.children[i];
						var node1=child1.n;
						candidateChildren.push(child1);
						if(node1.who==1 && // maximizing player 
							node1.evaluation>alpha)
							alpha=node1.evaluation;
						if(node1.who==-1 && // minimizing player
							node1.evaluation<beta)
							beta=node1.evaluation;
						if(beta<alpha) {
							skippedAlphaBeta+=node.children.length-1-i;
							//console.log("alpha-beta skipped",node.children.length-1-i,"nodes");
							break;
						}
					}
					
				} else
					candidateChildren=node.children;
				if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop) {
					var candidateChildren0=[];
					for(var i=0;i<candidateChildren.length;i++)
						if(!(candidateChildren[i].n.sign in visited))
							candidateChildren0.push(candidateChildren[i]);
					candidateChildren=candidateChildren0;
				}
				var bestChildren=[], bestUCB;
				var parentVisitsLog;
				if(uctParams.directVisits)
					parentVisitsLog=Math.log(parentVisits);
				else
					parentVisitsLog=Math.log(node.visits);
				
				function PickBestChildren() {
					for(var i=0;i<candidateChildren.length;i++) {
						var child1=candidateChildren[i];
						var node1=child1.n;
						if(node1.known)
							continue;
						var value=(node1.evaluation*node1.who+1)/2; // ensures value between 0 and 1
						var ucb;
						if(uctParams.directVisits)
							ucb=value+uctParams.c*Math.sqrt(parentVisitsLog/child1.f);
						else
							ucb=value+uctParams.c*Math.sqrt(parentVisitsLog/node1.visits);
						if(bestChildren.length==0 || ucb>=bestUCB) {
							if(bestChildren.length>0 && ucb>bestUCB)
								bestChildren=[];
							bestUCB=ucb;
							bestChildren.push(child1);
						}
					}
				}
				
				/*
				 * redistribute evaluations uniformly between 0 and 1 (excluded) 
				 */
				function PickBestChildrenDistributeEval() {

					var childrenDE={};
					var values=[];
					for(var i=0;i<candidateChildren.length;i++) {
						var child1=candidateChildren[i];
						var node1=child1.n;
						if(node1.known)
							continue;
						var value=(node1.evaluation*node1.who+1)/2; // ensures value between 0 and 1
						if(childrenDE[value]===undefined) {
							childrenDE[value]=[];
							values.push(value);
						}
						childrenDE[value].push(child1);
					}
					values.sort(function(v1,v2) {
						return v1-v2;
					});
					var step=1/(values.length+1);
					var index=0;
					for(var vi=0; vi<values.length;vi++) {
						index++;
						var value0=values[vi];
						var children=childrenDE[value0];
						var value1=step*index;
						for(var i=0;i<children.length;i++) {
							var child1=children[i];
							var node1=child1.n;
							var ucb;
							if(uctParams.directVisits)
								ucb=value1+uctParams.c*Math.sqrt(parentVisitsLog/child1.f);
							else
								ucb=value1+uctParams.c*Math.sqrt(parentVisitsLog/node1.visits);
							if(bestChildren.length==0 || ucb>=bestUCB) {
								if(bestChildren.length>0 && ucb>bestUCB)
									bestChildren=[];
								bestUCB=ucb;
								bestChildren.push(child1);
							}
						}
					}
				}
				
				if(uctParams.distributeEval)
					PickBestChildrenDistributeEval();
				else
					PickBestChildren()
				
				if(bestChildren.length==0) // all child nodes are known
					return;
				var child=bestChildren[Math.floor(Math.random()*bestChildren.length)];
				if(uctParams.directVisits) {
					child.f++;
					parentVisits=child.f;
				}
				node=child.n;
				if(aGame.mOptions.uctTransposition && !aGame.mOptions.uctIgnoreLoop)
					visited[node.sign]=1;
				depth++;
				moves.push(child.m);
				board.ApplyMove(aGame,child.m);
				aGame.AddVisit(board);
				board.mMoves=[];
				signatures.push(board.GetSignature());
				if(aGame.mOptions.uctTransposition=="states")
					pathSign^=TransformInteger(board.GetSignature()); // consider the states we have been through but not their order
				board.mWho=-board.mWho;
			}
			
			// Expand
			if(node==rootNode || node.visits>=uctParams.minVisitsExpand) {
				if(!board.mMoves || board.mMoves.length==0)
					board.GenerateMoves(aGame);
				if(board.mFinished) { // in some game implementations, ending is detected while generating the moves
					node.known=true;
					node.evaluation=winnerMap[board.mWinner];
					PropagateKnown(node);
				} else {
					node.children=[];
					var bestEval=undefined;
					var known=true;
					for(var i=0;i<board.mMoves.length;i++) {
						var move=board.mMoves[i];
						var signatures1=[];
						var board1=new (aGame.GetBoardClass())(aGame);
						board1.CopyFrom(board);
						board1.ApplyMove(aGame,move);
						aGame.AddVisit(board1);
						board1.mMoves=[];
						board1.mWho=-board1.mWho;
						if(depth>maxDepth)
							maxDepth=depth;
						var signature=board1.GetSignature();
						signatures1.push(signature);
						var sign1;
						if(aGame.mOptions.uctTransposition=="states") {
							sign1=pathSign^signature; // board signature is not transformed to differentiate the leaf board
							sign1^=depth; // depth in signature
						} else if(aGame.mOptions.uctTransposition=="state")
							sign1=signature; // only final state counts
						var node1=null;
						if(aGame.mOptions.uctTransposition)
							node1=uctNodes[sign1];
						if(!node1) {
							node1=new Node(node,-node.who);
							nodeCount++;
							if(aGame.mOptions.uctTransposition) {
								uctNodes[sign1]=node1;
								node1.sign=sign1;
							}
							board1.Evaluate(aGame);
							if(board1.mFinished) {
								node1.known=true;
								node1.evaluation=winnerMap[board1.mWinner]; // 1, -1 or 0
							} else {
								if(isNaN(board1.mEvaluation))
									console.error("Evaluation in not a number !",board1.mEvaluation);
								node1.evaluation=Playout(node1,board1,signatures1);
							}
							node1.staticEvalSum=node1.evaluation;
							node1.staticEvalCount=1;
						} else {
							redundantNodeCount++;
							node1.addParent(node);
						}
						if(node1.known==false)
							known=false;
						var nodeChain={
							n: node1,
							m: (new (aGame.GetMoveClass())(move)).Strip(), // Save memory by stripping the stored move
						}
						if(uctParams.directVisits)
							nodeChain.f=1;
						node.children.push(nodeChain);
						var _eval=node1.evaluation*node1.who;
						if(bestEval===undefined || _eval>bestEval*node1.who)
							bestEval=node1.evaluation;
						for(var j=0;j<signatures1.length;j++)
							aGame.RemoveVisit(null,signatures1[j]);
					}
					node.evaluation=bestEval;
					PropagateEval(node,uctParams.propagateMultiVisits?board.mMoves.length:1);
					if(uctParams.directVisits)
						for(var i=0;i<nodePath.length;i++)
							nodePath[i].visits+=uctParams.propagateMultiVisits?board.mMoves.length:1;
					
					if(known) {
						node.known=true;
						PropagateKnown(node);
					}
				}
				return;
			}
			if(node.known)
				return;

			// Simulate
			function Playout(node,board,signatures) {
				var result=null;
				var t0=Date.now();
				for(var depth=0;depth<uctParams.playoutDepth || board.mWho==uctParams.playoutCeil*rootNode.who;depth++) {
					if(!board.mMoves || board.mMoves.length==0)
						board.GenerateMoves(aGame);
					if(board.mFinished) {
						result={
							finished: true,
							winner: winnerMap[board.mWinner],
						};
						break;
					}
					var weightedMoves=[];
					for(var i=0;i<board.mMoves.length;i++) {
						var board1=new (aGame.GetBoardClass())(aGame);
						board1.CopyFrom(board);
						board1.ApplyMove(aGame,board.mMoves[i]);
						aGame.AddVisit(board1);
						board1.mMoves=[];
						board1.Evaluate(aGame);
						var evaluation=board1.mEvaluation;
						if(board1.mFinished) {
							if(board1.mWinner==1)
								evaluation=Number.MAX_VALUE;
							else if(board1.mWinner==-1)
								evaluation=-Number.MAX_VALUE;
							else
								evaluation=0;
						} else if(isNaN(board1.mEvaluation))
							console.error("Evaluation in not a number !");

						weightedMoves.push({
							move: board.mMoves[i],
							evaluation: evaluation,
							board: board1,
						});
						aGame.RemoveVisit(board1);
					}
					weightedMoves.sort(function(a1,a2) {
						var ev1=a1.evaluation*board.mWho;
						var ev2=a2.evaluation*board.mWho;
						return ev2-ev1;
					});
					
					/*
					 * Pick the next move in the playout with a preference for the moves that seem the best.
					 * For instance, with playoutSpread=2, the probability weight to pick the best move is 1/2,
					 * the second best move 1/4, third best 1/8, ...
					 * If several moves have the same quality, they have the same probability.
					 */
					var n=weightedMoves.length;
					var r=1/uctParams.playoutSpread;
					var max=(1-Math.pow(r,n+1))/(1-r)-1;
					var rnd=Math.random()*max;
					var equalMoves, lastEval=undefined, cursor=0, reached=false;
					for(var i=0;i<n;i++) {
						var wMove=weightedMoves[i];
						var ev=wMove.evaluation;
						if(ev!==lastEval) {
							if(reached) {
								break;
							} else {
								equalMoves=[wMove];
								lastEval=ev;
							}
						} else {
							equalMoves.push(wMove);
						}
						cursor+=Math.pow(r,i+1);
						if(cursor>=rnd)
							reached=true;
					}
					var pickedMove=equalMoves[Math.floor(Math.random()*equalMoves.length)];

					board=pickedMove.board;
					aGame.AddVisit(board);
					signatures.push(board.GetSignature()); // remember the board state signature so it can be removed later 
					board.mWho=-board.mWho;
					if(board.mFinished) {
						result={
							finished: true,
							winner: winnerMap[board.mWinner],
						};
						break;
					}
				}
				if(result===null) {
					result={
						finished: false,
						eval: board.mEvaluation
					}
				}

				// update stats
				poDur+=Date.now()-t0;
				poCount++;

				var nodeEval;
				if(result.finished)
					nodeEval=result.winner; // 1, -1 or 0
				else {
					if(uctParams.debugRawEval)
						node.rawEval=result.eval;
					var normEval=NormalizeEval(result.eval);
					UpdateDepthEval(normEval,node.depth);
					nodeEval=normEval;
				}
				return nodeEval;
			}
			var evaluation=Playout(node,board,signatures);
			node.staticEvalSum+=evaluation;
			node.staticEvalCount++;
			node.evaluation=node.staticEvalSum/node.staticEvalCount; // averaging normalized evaluations might not be the best way to get an accurate result
			PropagateEval(node,1);
			if(uctParams.directVisits)
				for(var i=0;i<nodePath.length;i++)
					nodePath[i].visits++;
		}
		
		var evalWeights=[];
		/*
		 * Update the evaluation weight for the given depth in order to balance evaluation propagation
		 */
		function UpdateDepthEval(evaluation,depth) {
			while(evalWeights.length<=depth) 
				evalWeights.push({
					count: 0,
					sum: 0
				});
			var weight=evalWeights[depth];
			weight.sum+=evaluation;
			weight.count++;
		}
		/*
		 * 
		 */
		function WeightEval(evaluation,depth) {
			var weight=evalWeights[depth];
			if(weight===undefined) { // why does this happen, even if very rare ? :(
				while(evalWeights.length<depth) 
					evalWeights.push({
						count: 0,
						sum: 0
					});
				evalWeights.push({
					count: 1,
					sum: evaluation
				});
				return evaluation;
			}
			var average=weight.count>0?weight.sum/weight.count:0;
			if(evaluation>average) {
				evaluation=(evaluation-average)/(1-average);
			} else if(evaluation<average) {
				evaluation=-(average-evaluation)/(average+1);
			}
			return evaluation;
		}

		if(aGame.mBoard.mMoves.length==0)
			aGame.mBoard.GenerateMoves(aGame);
		if(aGame.mBoard.mMoves.length==1) { // only one possible move: pick it
			aGame.mBestMoves=[aGame.mBoard.mMoves[0]];
			JocUtil.schedule(aGame, "Done", {});
			return;
		}
		if(aGame.mBoard.mMoves.length==0) {
			console.error("No move available",aGame);
			debugger;
		}
		var rootNode=new Node(null,-aGame.mWho);
		nodeCount++;
		if(aGame.mOptions.uctTransposition)
			uctNodes[aGame.mBoard.GetSignature()]=rootNode;
		
		var t0=Date.now();
		var lastProgressPercent=-1;
		function Run() {
			if(aGame.mAborted) {
				aGame.mAbortCallback.call(aGame);
				return;
			}
			var now=Date.now();
			var progressPercent=0;
			if(uctParams.maxDuration>0)
				progressPercent=Math.round(100*(now-t0)/(uctParams.maxDuration*1000));
			if(uctParams.maxLoops>0)
				progressPercent=Math.max(progressPercent,100*loopCount/uctParams.maxLoops);
			if(uctParams.maxNodes>0)
				progressPercent=Math.max(progressPercent,100*nodeCount/uctParams.maxNodes);
			if(progressPercent!=lastProgressPercent) {
				lastProgressPercent=progressPercent;
				if(aGame.mProgressCallback)
					aGame.mProgressCallback(progressPercent);
			}
			if(!rootNode.children || (rootNode.known==false &&
					(uctParams.maxDuration<=0 || now<uctParams.maxDuration*1000+t0) &&
					(uctParams.maxLoops<=0 || loopCount<uctParams.maxLoops) &&
					(uctParams.maxNodes<=0 || nodeCount<uctParams.maxNodes)
				)) {
				do {
					signatures=[];
					try {
						Step();
					} catch(e) {
						console.error("UCT step",e);
						debugger;
					}
					for(var i=0;i<signatures.length;i++)
						aGame.RemoveVisit(null,signatures[i]);
				} while(Date.now()-100<now);
				setTimeout(Run,0);
			} else {
				if(uctParams.log) {
					ReportStats(rootNode);
				}
				
				var bestEval=undefined;
				aGame.mBestMoves=[];
				if(uctParams.pickMove=="maxvisits" && uctParams.directVisits) {
					for(var i=0;i<rootNode.children.length;i++) {
						var child=rootNode.children[i];
						var node=child.n;
						if(node.evaluation==node.who) {
							aGame.mBestMoves.push(child.m);
						}
					}
					if(aGame.mBestMoves.length==0) {
						for(var i=0;i<rootNode.children.length;i++) {
							var child=rootNode.children[i];
							if(bestEval===undefined || bestEval<=child.f) {
								if(bestEval===undefined || bestEval<child.f)
									aGame.mBestMoves=[];
								bestEval=child.f;
								aGame.mBestMoves.push(child.m);													
							}
						}
					}
				} else {
					var bestEval2=undefined;
					var candidateChildren=[];
					if(uctParams.pickMove=="besteval-multivisits")
						rootNode.children.forEach(function(child) {
							if(child.n.visits>1 || child.n.known==true)
								candidateChildren.push(child);
						});
					if(candidateChildren.length==0)
						candidateChildren=rootNode.children;
					for(var i=0;i<candidateChildren.length;i++) {
						var child=candidateChildren[i];
						var node=child.n;
						var staticEval=node.staticEvalSum/node.staticEvalCount;
						if(bestEval===undefined || bestEval>=node.evaluation*rootNode.who) {
							if(bestEval===undefined || bestEval>node.evaluation*rootNode.who || (
								bestEval==node.evaluation*rootNode.who && (
										bestEval2===undefined || bestEval2>rootNode.who*staticEval
										))) {
								bestEval2=staticEval;
								aGame.mBestMoves=[];
							}
							bestEval=node.evaluation*rootNode.who;
							aGame.mBestMoves.push(child.m);						
						}
					}
				}

				JocUtil.schedule(aGame, "Done", {});
			}
		}
		Run();
	
		function ReportStats(node) {
			console.log("  duration",Date.now()-t0);
			console.log("  evaluation:",node.evaluation);
			console.log("  fully explored:",node.known);
			console.log("  node count:",nodeCount);
			console.log("  redundant node count:",redundantNodeCount);
			console.log("  max depth:",maxDepth);
			console.log("  alpha-beta",uctParams.useAlphaBeta,"skipped",skippedAlphaBeta);
			console.log(" ",loopCount,"steps, per step",(Date.now()-t0)/loopCount,"ms");
			console.log(" ",poCount,"playouts",poDur,"ms, per playout",poDur/poCount,"ms");
			console.log("  UCT c",uctParams.c);
			console.log("  tree",rootNode);

			function ShowMinimax(node,depth) {
				if(uctParams.propagation!="minimax" && (uctParams.propagation!="mixed" || uctParams.productRatio>0)) {
					console.warn("Cannot display minimax tree on propagation",uctParams.propagation,"pp ratio",uctParams.productRatio);
					return;
				}
				var indent="";
				for(var i=0;i<depth;i++)
					indent+="  ";
				console.log(indent+"*",depth,"*",-node.who,"eval",node.evaluation);
				for(var i=0;i<node.children.length;i++) {
					var child1=node.children[i];
					var node1=child1.n;
					console.log(indent,"  "+(node1.evaluation==node.evaluation?"*":" ")+" move",(new (aGame.GetMoveClass())(child1.m)).ToString(),
							"visits",node1.visits,
							"eval",node1.evaluation,
							"known",node1.known,
							"sev",node1.staticEvalSum+"/"+node1.staticEvalCount,
							"who",node1.who,
							"children",node1.children?node1.children.length:"no");
					if(node1.children && node1.evaluation==node.evaluation)
						ShowMinimax(node1,depth+1);
				}
			}
			if(uctParams.showMinimaxTree) {
				console.log("Minimax tree");
				ShowMinimax(node,0);
			}
			
			if(uctParams.checkSide) {
				var checkSideNodeCount=0;
				var checkSideError=0;
				function CheckSide(node) {
					checkSideNodeCount++;
					if(node.children)
						for(var i=0;i<node.children.length;i++) {
							var child1=node.children[i];
							if(child1.n.who!=-node.who)
								checkSideError++;
							CheckSide(child1.n);
						}				
				}
				CheckSide(rootNode);
				console.log("  tree side alternance","node",checkSideNodeCount,"errors",checkSideError);
			}
		}
	}

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

try {

	exports.Game = JocGame = function() {}
	exports.Board = JocBoard = function() {}
	exports.Move = JocMove = function() {}

} catch(e) {
	global.JocGame = exports.Game = function() {};
	global.JocBoard = exports.Board = function() {};
	global.JocMove = exports.Move = function() {};

	(function() {
		var r = require;
		var ju = r("./jocly.util.js");
		global.MersenneTwister = ju.MersenneTwister;
		global.JocUtil = ju.JocUtil;
		global.JoclyUCT = r("./jocly.uct.js").JoclyUCT;
	})();
}

JocGame.PLAYER_A = 1;
JocGame.PLAYER_B = -1;
JocGame.DRAW = 2;

if(typeof document!="undefined")
	JocGame.CLICK=('ontouchstart' in document.documentElement)?"touchstart":"click";
else
	JocGame.CLICK="click";
/*
JocGame.MOUSEMOVE_EVENT=('ontouchstart' in document.documentElement)?"touchmove":"mousemove";
JocGame.MOUSEDOWN_EVENT=('ontouchstart' in document.documentElement)?"touchstart":"mousedown";
JocGame.MOUSEUP_EVENT=('ontouchstart' in document.documentElement)?"touchend":"mouseup";
*/

JocGame.MOUSEMOVE_EVENT="touchmove mousemove";
JocGame.MOUSEDOWN_EVENT="touchstart mousedown";
JocGame.MOUSEUP_EVENT="touchend mouseup joclyclick";

/* biggest integer with unit precision: 
   Math.pow(2,53)-1 < Math.pow(2,53) is true 
   Math.pow(2,54)-1 < Math.pow(2,54) is false */
JocGame.MAX_VALUE = Math.pow(2,53); 

JocGame.prototype = {}

JocGame.prototype.Init = function(aOptions) {
	this.mWho = JocGame.PLAYER_A;
	this.mViewAs = JocGame.PLAYER_A;
	this.mTopLevel = 3;
	this.mLoopMax = 300;
	this.mPreventRepeat = false;
	if(aOptions) {
		this.mOptions = aOptions.game;
		this.mViewOptions = aOptions.view;
		this.mSkin = this.mViewOptions.skins[0].name; // TODO check if 3D not supported
		this.mNotation=false;
		this.mShowMoves=this.mViewOptions.useShowMoves;
		this.mSounds=!!this.mViewOptions.sounds;
		this.mAutoComplete=false;

		if(typeof(this.mOptions.level)!="undefined")
			this.mTopLevel = this.mOptions.level;
		if (typeof(this.mOptions.loopMax)!="undefined")
			this.mLoopMax = this.mOptions.loopMax;
		this.mVisitedBoards = {};
		if(typeof(this.mOptions.viewAs)!="undefined")
			this.mViewAs = this.mOptions.viewAs;
	}
	this.mNextSchedule = null;
	this.mPlayedMoves = [];
	this.mFullPlayedMoves = [];
	this.mViewInited = false;
	this.mGameInited = false;
	if(aOptions && aOptions.initial)
		this.GameInitGame(aOptions.initial);
	else
		this.GameInitGame();
	this.mBoard = new (this.GetBoardClass())(this);
	if(this.mBoard.InitialPosition)
		this.mBoard.InitialPosition(this);
	this.mBoard.mMoves=[];
	this.mBoard.mWho = this.mWho;
	this.listeners = [];

}

JocGame.prototype.AddListener = function(listener) {
	this.listeners.push(listener);
}

JocGame.prototype.RemoveListener = function(listener) {
	for(var i=this.listeners.length-1;i>=0;i--)
		if(this.listeners[i]==listener)
			this.listeners.splice(i,1);
}

JocGame.prototype.DispatchMessage = function(message) {
	var self = this;
	this.listeners.forEach(function(listener) {
		listener.call(self,message);
	});
}

JocGame.prototype.HumanMove = function(move) {
	this.DispatchMessage({
		type: "human-move",
		move: move
	});
}

JocGame.prototype.MachineMove = function(result) {
	this.DispatchMessage({
		type: "machine-move",
		result: result
	});
}

JocGame.prototype.MachineProgress = function(progress) {
	this.DispatchMessage({
		type: "machine-progress",
		progress: progress
	});
}

JocGame.prototype.PlayMove = function(move) {
	var self = this;
	var promise = new Promise(function(resolve,reject) {
		self.mOldBoard=new (self.GetBoardClass())(self);
		self.mOldBoard.CopyFrom(self.mBoard);
		self.ApplyMove(move);
		var moveShown = self.mBoard.PlayedMove(self,move);
		if(moveShown)
			resolve();
		else
			self.MoveShown = function() {
				delete self.MoveShown;
				resolve();
			}
	});
	return promise;
}

JocGame.prototype.InvertWho = function() {
	var who = this.GetWho();
	this.SetWho(-who);
}

JocGame.prototype.AttachElement = function (element, options) {
	options = options || {};
	var game = this;
	this.widget = element;
	var promise = new Promise(function(resolve, reject) {
		if (game.gamePreAttachProto)
			reject(new Error("Game already attached"));
		else {
			var systemJSConfig = {
				meta: {
					"jocly-xdview.js": {
						globals: {
							jQuery: "jquery.js",
							THREE: "three.js"
						}
					}
				}
			}
			systemJSConfig.meta["games/" + game.module + "/" + game.name + "-view.js"] = {
				globals: {
					xdview: "jocly-xdview.js",
					jQuery: "jquery.js",
					THREE: "three.js"
				}
			}
		};
		SystemJS.config(systemJSConfig);

		Promise.all([
			SystemJS.import("jocly-xdview.js"),
			SystemJS.import("games/" + game.module + "/" + game.name + "-view.js")
		]).then(function(args) {
			var xdview = args[0], view = args[1];
			game.gamePreAttachProto = Object.getPrototypeOf(game);
			var gameProto = Object.assign({}, game.gamePreAttachProto, xdview.view.Game, view.view.Game);
			Object.setPrototypeOf(game, gameProto);

			var Board = game.mBoardClass;
			game.boardPreAttachProto = Board.prototype;
			Object.assign(Board.prototype, game.boardPreAttachProto, xdview.view.Board, view.view.Board);

			var Move = game.mMoveClass;
			game.movePreAttachProto = Move.prototype;
			Object.assign(Move.prototype, game.movePreAttachProto, view.view.Move);

			game.mGeometry = {
				width: game.widget.clientWidth,
				height: game.widget.clientHeight
			}
			game.mWidget = jQuery(game.widget);

			game.UpdateSounds();
			resolve();
		}, function(e) {
			reject(e);
		});
	});
	return promise;
}

JocGame.prototype.DetachElement = function () {
	var game = this;
	this.widget = element;
	var promise = new Promise(function(resolve, reject) {
		if (!game.gamePreAttachProto)
			reject(new Error("Game not attached"));
		else {
			// TODO
			resolve();
		}
	});
	return promise;
}

JocGame.prototype.GetBoardClass = function() {
	return this.mBoardClass;
}

JocGame.prototype.GetMoveClass = function() {
	return this.mMoveClass;
}

JocGame.prototype.CreateMove = function(args) {
	return new this.mMoveClass(args);
}

JocGame.prototype.CloneBoard = function(board) {
	var newBoard=new (this.GetBoardClass())(this);
	newBoard.CopyFrom(board);
	return newBoard;
}

JocGame.prototype.InitView = function() {
	console.log("Abstract InitView called");
}

JocGame.prototype.GameInitView = function() {
	if(this.mGeometry.width>0 && this.mGeometry.height>0) {
		this.InitView();
		this.mViewInited=true;
	}
}

JocGame.prototype.DestroyView = function() {
	if(this.mWidget)
		this.mWidget.empty();
}

JocGame.prototype.GameDestroyView = function() {
	if(this.mViewInited) {
		this.DestroyView();
		this.mViewInited=false;
	}
}

JocGame.prototype.CanPlaySound = function(tag) {
	return true;
}

JocGame.prototype.UpdateSounds = function() {
	var joclySounds = $("#jocly-sounds");
	if(joclySounds.length==0)
		joclySounds = $("<div/>").attr("id","jocly-sounds").css({display:"none"}).appendTo($("body"));
	function AddSound(tag, path, fname) {
		var audio = $("<audio/>").attr("id", "jocly-sound-" + tag).attr("preload","auto");
                $("<source/>").attr("src", path + "/res/sounds/" + fname + ".ogg").attr("type", "audio/ogg").appendTo(audio);
		$("<source/>").attr("src", path + "/res/sounds/" + fname + ".mp3").attr("type", "audio/mp3").appendTo(audio);
		audio.appendTo(joclySounds);
	}
	joclySounds.empty();
	var defaultSounds = {
		useraction: "bells1",
		usermove: "bells1",
		win: "winblues",
		loss: "lose",
		end: "draw",
	}
	for (var i in defaultSounds)
		AddSound(i, this.config.baseURL, defaultSounds[i]);
	if (this.config.view.sounds) {
		for (var i in this.config.view.sounds) {
			$("#jocly-sound-" + i).remove();
			if (this.config.view.sounds[i])
				if (this.config.view.sounds[i])
					AddSound(i, this.config.baseURL+"games/"+this.config.model.module, this.config.view.sounds[i]);
		}
	}
}

JocGame.prototype.PlaySound = function(tag) {
	if(!this.CanPlaySound(tag))
		return;
	var audio=document.getElementById("jocly-sound-"+tag);
	if(audio && this.mSounds) {
		if(typeof this.mNeedPhonegapMedia=="undefined") {
			this.mNeedPhonegapMedia=false;
			this.mNeedPhonegapMedia = window && window.cordova && (typeof Media != "undefined");
		}
		
		if(this.mNeedPhonegapMedia) {
			if(typeof this.mPhonegapMediaLib=="undefined")
				this.mPhonegapMediaLib={};
			if(typeof this.mPhonegapMediaLib[tag]=="undefined") {
				var node=audio.firstChild;
				while(node) {
					if(/source/i.test(node.nodeName) && node.getAttribute("type")=="audio/mp3")
						break;
					node=node.nextSibling;
				}
				if(node) {
					var src=node.getAttribute("src");
					
					var m=/^([^#\?]*)\/[^#\?]+/.exec(window.location.pathname);
					if(m)
						src=src.replace(/^\./,m[1]);
					src=src.replace(/%20/g," ");
					this.mPhonegapMediaLib[tag]=new Media(src, function() {
							//console.info("PlaySound: Media played "+src);
						},function(error) {
							console.warn("Jocly PlaySound: Media did not play "+error.code);
						},function(status) {
							//console.info("PlaySound: mediaStatus "+status);
						});
				} else
					this.mPhonegapMediaLib[tag]=null;
			}
			if(this.mPhonegapMediaLib[tag]) {
				this.mPhonegapMediaLib[tag].play();
			}
		} else
			audio.cloneNode(true).play();
	}
}

JocGame.prototype.InitGame = function() {
}

JocGame.prototype.GameInitGame = function() {
	if(this.mGameInited==false) {
		this.mVisitedBoards={};
		if(arguments.length>0 && arguments[0])
			this.mInitial=arguments[0];
		else
			this.mInitial=null;
		this.InitGame();
		this.mGameInited=true;
	}
}

JocGame.prototype.DestroyGame = function() {
}

JocGame.prototype.GameDestroyGame = function() {
	if(this.mGameInited) {
		this.DestroyGame();
		this.mGameInited=false;
	}
	if(this.aiWorker) {
		try {
			this.aiWorker.terminate();
			delete this.aiWorker;
		} catch(e) {
			console.warn("Cannot terminate worker",e);
		}
	}
}

JocGame.prototype.DisplayBoard = function() {
	if(this.mBoard.Display)
		this.mBoard.Display(this);
}

JocGame.prototype.SetWho = function(aWho) {
	this.mWho = aWho;
	this.mBoard.mWho = aWho;
}

JocGame.prototype.GetWho = function() {
	return this.mWho;
}

JocGame.prototype.HumanTurn = function() {
	if(this.mBoard.mMoves.length==0) {
		this.mCurrentLevel=-1; 
		this.mBoard.GenerateMoves(this);
	}
	this.mBoard.HumanTurn(this);
}

JocGame.prototype.HumanTurnEnd = function() {
	this.mBoard.HumanTurnEnd(this);
}

JocGame.prototype.PlayedMove = function(aMove, aOldBoard) {
	this.mOldBoard=aOldBoard;
	return this.mBoard.PlayedMove(this,aMove);
}

JocGame.prototype.ShowEnd = function() {
	return this.mBoard.ShowEnd(this);
}

JocGame.prototype.EvaluateBoard = function() {
	this.mBoard.mFinished=false;
	this.mBoard.mMoves=[];
	this.mCurrentLevel=-1;
	this.mBoard.GenerateMoves(this);
	if(this.mBoard.mFinished==false)
		this.mBoard.Evaluate(this,true,true);
	//JocLog("EvaluatedBoard "+JSON.stringify(this.mBoard));
}

JocGame.prototype.GetFinished = function() {
	this.SetWho(-this.mWho);
	var moves=this.mBoard.mMoves;
	this.EvaluateBoard();
	this.mBoard.mMoves=moves;
	this.SetWho(-this.mWho);
	if(this.mBoard.mFinished)
		return this.mBoard.mWinner;
	else
		return 0;
}

JocGame.prototype.IsValidMove = function(args) {
	var move = new (this.GetMoveClass())(args);
	return this.mBoard.IsValidMove(this,move);
}

JocGame.prototype.AddVisit = function(board,sign) {
	if(board)
		sign=board.GetSignature();
	var visits=this.mVisitedBoards[sign];
	if(visits===undefined)
		this.mVisitedBoards[sign]=1;
	else
		this.mVisitedBoards[sign]++;
}

JocGame.prototype.RemoveVisit = function(board,sign) {
	if(board)
		sign=board.GetSignature();
	var visits=this.mVisitedBoards[sign];
	if(visits!==undefined) {
		if(visits>1)
			this.mVisitedBoards[sign]--;
		else
			delete this.mVisitedBoards[sign];
	}
}

var engdbg_loops, engdbg_time, engdbg_t0;

JocGame.prototype.StartMachine = function(aOptions) {
	engdbg_loops=0;
	engdbg_time=0;
	engdbg_t0=Date.now();
	
	this.mDoneCallback=aOptions.Done || this.MachineMove;
	this.mProgressCallback=aOptions.Progress || this.MachineProgress;
	if(typeof(aOptions.level)!="undefined")
		this.mTopLevel=aOptions.level;
	if(typeof(aOptions.maxDepth)!="undefined")
		this.mTopLevel=aOptions.maxDepth;
	this.mStartTime = new Date().getTime();
	this.mExploredCount = 0;
	this.mPickedMoveIndex = 0;
	this.mBestMoves = [];
	this.mContexts = [];
	this.mDuration = 0;
	this.mAborted = false;
	this.mRandomSeed = 0;
	if(aOptions.randomSeed && !isNaN(parseInt(aOptions.randomSeed)))
		this.mRandomSeed = parseInt(aOptions.randomSeed);
	if(typeof this.mBoard.StaticGenerateMoves =="function") {
		var moves=this.mBoard.StaticGenerateMoves(this);
		if(moves && moves.length>0) {
			this.mBestMoves=moves;
			JocUtil.schedule(this, "Done", {});
			return;
		}
	}
	
	if(this.mOptions.levelOptions) {
		this.mOptions.levelOptionsSaved=JSON.parse(JSON.stringify(this.mOptions.levelOptions));
		if(aOptions.level)
			Object.assign(this.mOptions.levelOptions,aOptions.level);
	}
	
	var aiThread = aOptions.threaded && typeof window=="object" && window.Worker;
	if(aOptions.level && aOptions.level.ai=="uct" && JoclyUCT) {
		if(aiThread)
			this.StartThreadedMachine(aOptions,"uct");
		else
			JoclyUCT.startMachine(this,aOptions);
	}
	else { // default is legacy alpha-beta ai
		if(aiThread)
			this.StartThreadedMachine(aOptions,"alpha-beta");
		else {
			this.mSavedVisitedBoards={}
			for(var s in this.mVisitedBoards)
				this.mSavedVisitedBoards[s]=this.mVisitedBoards[s];
			this.Engine(this.mBoard, this.mTopLevel, false, 0, aOptions.potential); // start algo
			this.Run();
		}
	}
}

JocGame.prototype.StartThreadedMachine = function(aOptions,algo) {
	var $this = this;
	delete aOptions.Done;
	delete aOptions.Progress;
	var t0 = Date.now();
	if(!this.aiWorker) {
		this.aiWorker = new Worker(this.config.baseURL+'jocly.aiworker.js');
		this.aiWorker.postMessage({
			type: "Init",
			baseURL: this.config.baseURL,
			//modelURL: this.config.baseURL+"games/"+this.config.model.module+"/"+this.name+"-model.js",
			options: aOptions,
			t0: t0
		});
	}
	this.aiWorker.onmessage = function(e) {
		var message = e.data;
		switch(message.type) {
			case "Progress":
				$this.mProgressCallback(message.percent);
				break;
			case "Done":
				$this.mBestMoves = message.data.moves;
				$this.mPickedMoveIndex = message.data.moveIndex;
				$this.mExploredCount = message.data.explored;
				$this.mDuration = message.data.duration;
				$this.mBoard.evaluation = message.data.evaluation;
				$this.Done();
				break;
		}
	}
	this.aiWorker.postMessage({
		type: "Play",
		playedMoves: this.mPlayedMoves,
		gameOptions: this.mOptions,
		gameName: this.name,
		options: aOptions,
		algo: algo,
		t0: t0
	});
}

JocGame.prototype.ScheduleStep = function() {
	this.mNextSchedule = this.ExecuteStep;
}

JocGame.prototype.Random = function(roof) {
	var value;
	if(this.mRandomSeed)
		value = this.mRandomSeed % roof; 
	else
		value = Math.floor(Math.random()*roof);
	return value;
}

JocGame.prototype.ArrayShuffle = function(arr) {
	var i = arr.length;
	if (i<=0) return;
	while (--i) {
		var j;
		if(this.mRandomSeed)
			j=this.mRandomSeed%(i+1);
		else
			j=Math.floor(Math.random()*(i+1));
		var tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}

JocGame.prototype.Done = function() {
	this.mDuration = new Date().getTime() - this.mStartTime;
	if(this.mOptions.levelOptionsSaved) {
		this.mOptions.levelOptions=this.mOptions.levelOptionsSaved;
		this.mOptions.levelOptionsSaved=null;
	}
	if(this.mSavedVisitedBoards)
		this.mVisitedBoards=this.mSavedVisitedBoards;
	if (this.mDoneCallback) {
		this.mPickedMoveIndex = this.Random(this.mBestMoves.length);
		try {
			if(this.mProgressCallback) {
				this.mProgressCallback(100);
			}
			this.mDoneCallback( {
				moves : this.mBestMoves,
				move : this.mBestMoves[this.mPickedMoveIndex],
				moveIndex : this.mPickedMoveIndex,
				explored : this.mExploredCount,
				duration : this.mDuration,
				evaluation : this.mBoard.mEvaluation
			});
		} catch (e) {
			JocLog("!!! Done:" + e,e.stack?e.stack:"");
		}
	}
}

JocGame.prototype.Run = function() {
	var t0=Date.now();
	try {
		var tNow = new Date().getTime();
		while (this.mNextSchedule && new Date().getTime()-tNow<20 && this.mAborted==false) {
			var fnt = this.mNextSchedule;
			this.mNextSchedule = null;
			fnt.call(this);
		}
		if(this.mAborted) {
			this.mAbortCallback();
		} else if (this.mNextSchedule) {
			JocUtil.schedule(this, "Run", {});
		}
	} catch(e) { 
		JocLog("JocGame.Run "+e+"\n"+e.stack);
	}
	var t1=Date.now();
	engdbg_loops++;
	engdbg_time+=t1-t0;
}

JocGame.prototype.Abort = function(aAbortCallback) {
	var $this=this;
	this.mAbortCallback=function() {
		if($this.mOptions.levelOptionsSaved) {
			$this.mOptions.levelOptions=$this.mOptions.levelOptionsSaved;
			$this.mOptions.levelOptionsSaved=null;
		}
		if($this.mSavedVisitedBoards) {
			$this.mVisitedBoards=$this.mSavedVisitedBoards;
			$this.mSavedVisitedBoards=null;
		}
		aAbortCallback();
	}
	this.mAborted=true;
}

JocGame.prototype.Engine = function(aBoard, aLevel, aBAlpha, aAlpha, aPotential) {
	var context = {
		mBoard : aBoard,
		mLevel : aLevel,
		mBAlpha : aBAlpha,
		mAlpha : aAlpha,
		mBestEvaluation : 0,
		mMoveIndex : 0,
		mNextBoard : null,
		mNextBoards : null
	}
	this.mContexts.push(context);

	context.mBoard.mFinished = false;
	context.mBoard.mWinner = JocGame.DRAW;
	this.mCurrentLevel=aLevel; 
	if(context.mBoard.mMoves.length==0)
		context.mBoard.GenerateMoves(this);

	//JocLog("Level "+aLevel+" "+context.mBoard.mMoves.length+" moves");
	if (context.mBoard.mMoves.length == 0 && context.mBoard.mFinished == false) {
		context.mBoard.Evaluate(this,true,false);
		if(context.mBoard.mFinished == false) {
			JocLog("!!! No move possible while not finished - player",this.mWho,"board",context.mBoard);
			context.mBoard.mFinished=true;
		}
	}
		
	//JocLog("No possible move level "+aLevel+" from "+JSON.stringify(context.mBoard));
	if(context.mBoard.mFinished) {
		switch (context.mBoard.mWinner) {
		case JocGame.PLAYER_A:
			context.mBoard.mEvaluation = JocGame.MAX_VALUE - (this.mTopLevel - context.mLevel);
			break;
		case JocGame.PLAYER_B:
			context.mBoard.mEvaluation = -JocGame.MAX_VALUE + (this.mTopLevel - context.mLevel);
			break;
		}
		context.mBestEvaluation = context.mBoard.mEvaluation;
		this.ExecuteStep2();
		return;
	}

	context.mExploCtrl={
		exploFrom: this.mExploredCount,
		exploTo: this.mExploredCount+aPotential,
	}
	
	if(context.mBoard.QuickEvaluate) {
		var boardsMoves=[];
		for(var i in context.mBoard.mMoves) {
			var board=context.mBoard.MakeAndApply(this,i);
			var quickEval=board.QuickEvaluate(this);
			boardsMoves.push({
				move: context.mBoard.mMoves[i],
				board: board,
				evaluation: quickEval
			});
		}
		function MoveSort(bm1,bm2) {
			return (bm2.evaluation-bm1.evaluation)*context.mBoard.mWho;
		}
		boardsMoves.sort(MoveSort);
		context.mBoard.mMoves=[];
		context.mNextBoards=[];
		if(typeof this.mOptions.capMoves != "undefined")
			boardsMoves=boardsMoves.slice(0,this.mOptions.capMoves);
		for(var i in boardsMoves) {
			context.mBoard.mMoves.push(boardsMoves[i].move);
			context.mNextBoards.push(boardsMoves[i].board);
		}
	}
	this.ExecuteStep();
}

JocGame.prototype.ExecuteStep = function() {
	this.mExploredCount++;
	// JocLog("# context: "+this.mContexts.length);
	var context = this.mContexts[this.mContexts.length - 1];
	//JocLog("ExecuteStep level "+context.mLevel+" index "+context.mMoveIndex+"/"+context.mBoard.mMoves.length);
	if(context.mNextBoards) {
		context.mNextBoard = context.mNextBoards[context.mMoveIndex];
	} else {
		context.mNextBoard = context.mBoard.MakeAndApply(this,context.mMoveIndex);
	}

	if(this.mProgressCallback) {
		var percent=null;
		if(context.mLevel==this.mTopLevel)
			percent=Math.floor((context.mMoveIndex*100)/context.mBoard.mMoves.length);
		else if(context.mLevel==this.mTopLevel-1) {
			var topContext=this.mContexts[0];
			var topStep=1/topContext.mBoard.mMoves.length;
			percent=Math.floor(100*(topContext.mMoveIndex*topStep+(context.mMoveIndex*topStep/context.mBoard.mMoves.length)));
		}
		if(percent!=null) 
			try {
				this.mProgressCallback(percent);
			} catch(e) {}
	}

	var nextBoard = context.mNextBoard;
	nextBoard.mFinished = false;
	nextBoard.mWinner = 0;
	nextBoard.Evaluate(this,context.mLevel==0,false,this);
	
	if(context.mLevel<0) // random mode
		nextBoard.mEvaluation=0;
	
	// JocLog("Eval2 "+nextBoard.mFinished+"/"+nextBoard.mWinner+"/"+nextBoard.mEvaluation);
	if (nextBoard.mFinished) {
		switch (nextBoard.mWinner) {
		case JocGame.PLAYER_A:
			nextBoard.mEvaluation = JocGame.MAX_VALUE - (this.mTopLevel - context.mLevel);
			break;
		case JocGame.PLAYER_B:
			nextBoard.mEvaluation = -JocGame.MAX_VALUE + (this.mTopLevel - context.mLevel);
			break;
		case JocGame.DRAW:
			nextBoard.mEvaluation = 0;
			break;
		}
	} else if(context.mLevel==this.mTopLevel && context.mBoard.mMoves.length==1) {
		// one possible move at top level: no need to recurse
	} else if (context.mLevel > 0) {
		var potential=(context.mExploCtrl.exploTo-this.mExploredCount)/context.mBoard.mMoves.length;
		//JocLog("ExecuteStep",potential,context.mLevel,context.mExploCtrl);
		if(potential>=1) { 
			nextBoard.mWho = -nextBoard.mWho; // player changes
			this.Engine(nextBoard, context.mLevel - 1, (context.mMoveIndex != 0),
					context.mBestEvaluation,potential); // recurse algo
			return;
		}
	}
	this.ExecuteStep2();
}

JocGame.prototype.ExecuteStep2 = function() {
	var context = this.mContexts[this.mContexts.length - 1];
	//JocLog("ExecuteStep2 level "+context.mLevel+" index "+context.mMoveIndex+" "+JSON.stringify(context.mBoard.board));
	if(context.mBoard.mMoves.length>0) {
		if (context.mMoveIndex == 0) { // first evaluated move
			context.mBestEvaluation = context.mNextBoard.mEvaluation; // then it's the best one so far
			if (context.mLevel == this.mTopLevel) // if top level
				this.SetBest(context.mBoard.mMoves[0], context.mBoard); // store move
		} else { // another move evaluated
			if (context.mNextBoard.mWho > 0) { // B plays
				if (context.mNextBoard.mEvaluation > context.mBestEvaluation) { // best move ?
					context.mBestEvaluation = context.mNextBoard.mEvaluation; // remember it
					if (context.mLevel == this.mTopLevel) // if top level
						this.SetBest(context.mBoard.mMoves[context.mMoveIndex],
								context.mBoard); // then store
				} else if (context.mLevel == this.mTopLevel
						&& context.mNextBoard.mEvaluation == context.mBestEvaluation) { // top level and
																	// another best
																	// move
					this.AddBest(context.mBoard.mMoves[context.mMoveIndex],
							context.mBoard); // add to best moves
				}
			} else { // A plays
				if (context.mNextBoard.mEvaluation < context.mBestEvaluation) { // best move
					context.mBestEvaluation = context.mNextBoard.mEvaluation; // keep it
					if (context.mLevel == this.mTopLevel)
						this.SetBest(context.mBoard.mMoves[context.mMoveIndex],
								context.mBoard);
				} else if (context.mLevel == this.mTopLevel
						&& context.mNextBoard.mEvaluation == context.mBestEvaluation)
					this.AddBest(context.mBoard.mMoves[context.mMoveIndex],
							context.mBoard);
			}
		}
	}
	context.mBoard.mEvaluation = context.mBestEvaluation; // assign best eval
	if (context.mBAlpha) { // alpha-beta pruning
		if ((context.mBoard.mWho == JocGame.PLAYER_A && context.mBestEvaluation > context.mAlpha)
				|| (context.mBoard.mWho == JocGame.PLAYER_B && context.mBestEvaluation < context.mAlpha)) {
			context.mMoveIndex = context.mBoard.mMoves.length - 1; 
			//JocLog("Alpha-beta pruned level");
			// ensure no more looking for other moves at this level
		}
	}

	context.mMoveIndex++;
	if (context.mMoveIndex < context.mBoard.mMoves.length) {
		this.ScheduleStep();
	} else {
		//JocLog("BestEval level "+context.mLevel+": "+context.mBestEvaluation+" "+context.mMoveIndex+"/"+context.mBoard.mMoves.length);
		this.mContexts.pop();
		if (this.mContexts.length > 0) {
			var context = this.mContexts[this.mContexts.length - 1];
			context.mNextBoard.mWho = -context.mNextBoard.mWho;
			this.ExecuteStep2();
		} else {
			delete context.mBoard.mMoves;
			//JocLog("Best eval "+context.mBestEvaluation);
			this.Done();
		}
	}
}

JocGame.prototype.SetBest = function(aMove, aBoard) {
	var move = new (this.GetMoveClass())({});
	move.CopyFrom(aMove);
	this.mBestMoves = [ move ];
}

JocGame.prototype.AddBest = function(aMove, aBoard) {
	var move = new (this.GetMoveClass())({});
	move.CopyFrom(aMove);
	this.mBestMoves.push(move);
}

JocGame.prototype.GetRepeatOccurence = function(board) {
	if(!this.mOptions.preventRepeat)
		return -1;
	var repOcc=this.mVisitedBoards[board.GetSignature()];
	return repOcc;
}

JocGame.prototype.HandleRepeat = function(board) {
	if(this.mOptions.preventRepeat) {
		var sign=board.GetSignature(true);
		if(this.mVisitedBoards[sign]===undefined)
			this.mVisitedBoards[sign]=1;
		else
			this.mVisitedBoards[sign]++;
	}
}

JocGame.prototype.UnhandleRepeat = function(board) {
	if(this.mOptions.preventRepeat) {
		var sign=board.GetSignature(true);
		if(this.mVisitedBoards[sign]==1)
			delete this.mVisitedBoards[sign];
		else if(this.mVisitedBoards[sign]>1)
			this.mVisitedBoards[sign]--;
	}
}

JocGame.prototype.ApplyMove = function(aMove) {
	var move = new (this.GetMoveClass())({});
	move.CopyFrom(aMove);
	this.mPlayedMoves.push(move);
	if(this.mFullPlayedMoves.length<this.mPlayedMoves.length)
		this.mFullPlayedMoves.push(move);
	else if(!move.Equals(this.mFullPlayedMoves[this.mPlayedMoves.length-1])) {
		this.mFullPlayedMoves=this.mFullPlayedMoves.slice(0,this.mPlayedMoves.length-1);
		this.mFullPlayedMoves.push(move);
	}
	this.mBoard.ApplyMove(this,aMove);
	this.mBoard.mMoves=[];
	this.HandleRepeat(this.mBoard);
}

JocGame.prototype.BackTo = function(aIndex,moves) {
	if(!moves)
		moves=this.mFullPlayedMoves;
	this.mWho = JocGame.PLAYER_A;
	this.mBoard = new (this.GetBoardClass())(this);
	if(this.mBoard.InitialPosition)
		this.mBoard.InitialPosition(this);
	if(this.mInitial && this.mInitial.turn)
		this.mWho = this.mInitial.turn;
	this.mBoard.mWho = this.mWho;
	this.mBestMoves = [];
	this.mVisitedBoards={};
	this.mPlayedMoves = [];
	for(var i=0;i<aIndex;i++) {
		this.mBoard.ApplyMove(this,moves[i]);
		this.HandleRepeat(this.mBoard);
		this.mBoard.mWho=-this.mBoard.mWho;
		this.mPlayedMoves.push(moves[i]);
	}
	this.mWho=this.mBoard.mWho;
}

JocGame.prototype.Load = function(gameData) {
	this.mWho = JocGame.PLAYER_A;
	this.mBoard = new (this.GetBoardClass())(this);
	if(this.mBoard.InitialPosition)
		this.mBoard.InitialPosition(this);
	this.mBoard.mWho = this.mWho;
	var board = this.GetBoardClass();
	if(gameData.initialBoard)
		board.CopyFrom(gameData.initialBoard);
	this.mBestMoves = [];
	this.mVisitedBoards={};
	var moves=gameData.playedMoves;
	this.mPlayedMoves = [];
	this.mFullPlayedMoves = [];
	for(var i in moves) {
		var move=new (this.GetMoveClass())(moves[i]);
		if(!this.IsValidMove(move))
			throw "invalid-move";		
		this.mBoard.ApplyMove(this,move);
		this.HandleRepeat(this.mBoard);
		this.mBoard.mWho=-this.mBoard.mWho;
		this.mPlayedMoves.push(move);
		this.mFullPlayedMoves.push(move);
		this.mBoard.mMoves=[];
	}
	this.mWho=this.mBoard.mWho;
	if(this.mBoard.mFinished==false)
		this.mBoard.Evaluate(this,true,true);
}

JocGame.prototype.CloseView = function() {
}

JocMove.prototype = {}

JocMove.prototype.CopyFrom = function(aMove) {
	var fields=JSON.parse(JSON.stringify(aMove));
	for(var f in fields) {
		this[f]=fields[f];
	}
}

JocMove.prototype.Equals = function(move) {
	return JSON.stringify(this)==JSON.stringify(move);
}

JocMove.prototype.ToString = function() {
	return JSON.stringify(this);
}

JocMove.prototype.Strip = function() {
	return this;
}

JocBoard.prototype = {}

JocBoard.prototype.Init = function(aGame) {
}

JocBoard.prototype.InitBoard = function(aGame) {
	this.mDepth = 0; // no depth calc
	this.mMoves = []; // move storage
	this.mEvaluation = 0; // not evaluated yet
	this.mFinished = false;
	this.mWinner = 0;
	this.Init(aGame);
}

JocBoard.prototype.CopyFrom = function(aBoard) {
	var signature=aBoard.mSignature;
	delete(aBoard.mSignature);
	var fields=JSON.parse(JSON.stringify(aBoard));
	for(var f in fields) {
		this[f]=fields[f];
	}
	aBoard.mSignature=signature;
}

JocBoard.prototype.GetSignature = function() {
	if(arguments[0] || !this.mSignature) {
		var moves=this.mMoves;
		delete(this.mMoves);
		delete(this.mSignature);
		this.mSignature=JocUtil.md5(JSON.stringify(this));
		//JocLog("signature",this.mSignature,this);
		this.mMoves=moves;
	}
	return this.mSignature;
}

JocBoard.prototype.ApplyMove = function(aGame,aMove) {
	JocLog("Method JocBoard:ApplyMove() must be overloaded");
	// must be overloaded
}

JocBoard.prototype.GenerateMoves = function(aGame) {
	JocLog("Method JocBoard:GenerateMoves() must be overloaded");
	// must be overloaded
}

JocBoard.prototype.Evaluate = function(aGame,aFinishOnly,aTopLevel) {
	JocLog("Method JocBoard:Evaluate() must be overloaded");
	this.mEvaluation = 0; // must be overloaded
}

JocBoard.prototype.HumanTurn = function() {
}

JocBoard.prototype.HumanTurnEnd = function() {
}

JocBoard.prototype.PlayedMove = function() {
}

JocBoard.prototype.ShowEnd = function() {
}

JocBoard.prototype.MakeAndApply = function(aGame,aIndex) {
	var board = new (aGame.GetBoardClass())(aGame);	
	board.CopyFrom(this);
	board.mWho = this.mWho;
	board.mBoardClass = this.mBoardClass;
	board.ApplyMove(aGame,this.mMoves[aIndex]); // apply move
	board.mMoves=[];
	return board;
}

JocBoard.prototype.IsValidMove = function(aGame,move) {
	if(typeof move.Equals != "function")
		move=aGame.CreateMove(move);
	if(!this.mMoves || this.mMoves.length==0) {
		this.mCurrentLevel=-1;
		this.GenerateMoves(aGame);
	}
	for(var i in this.mMoves) {
		if(move.Equals(this.mMoves[i]))
			return true;
	}
	console.error("Invalid move "+JSON.stringify(move)+" in "+JSON.stringify(this.mMoves));
	return false;
}

JocBoard.prototype.PushMove = function(aGame,args) {
	this.mMoves.push(aGame.CreateMove(args));
}


JocBoard.prototype.GenerateMoveObjects = function(aGame) {
	var moves=[];
	this.mMoves=[];
	this.GenerateMoves(aGame);
	for(var i=0;i<this.mMoves.length;i++)
		moves.push(aGame.CreateMove(this.mMoves[i]));
	this.mMoves=moves;
}

JocBoard.prototype.ExportBoardState = function(aGame) {
	return JSON.stringify(this);
}

JocGame.prototype.GetBestMatchingMove = function(moveStr,candidateMoves) {
	var prettyMoves=[];
	var $this=this;
	candidateMoves.forEach(function(m) {
		if(typeof m.ToString=="function")
			prettyMoves.push(m.ToString());
		else
			prettyMoves.push($this.CreateMove(m).ToString());
	});
	var bestDist=Infinity;
	var bestMatches=[];
	candidateMoves.forEach(function(candidate,index) {
		var dist=JocGame.Levenshtein(moveStr,prettyMoves[index])/(Math.max(prettyMoves[index].length,moveStr.length)+1);
		if(dist==bestDist)
			bestMatches.push(index);
		else if(dist<bestDist) {
			bestMatches=[index];
			bestDist=dist;
		}
	});
	if(bestMatches.length==1)
		return candidateMoves[bestMatches[0]];

	var candidateIndexes=bestMatches;
	var matches=[];
	candidateIndexes.forEach(function(index) {
		var pretty=prettyMoves[index];
		if(moveStr.indexOf(pretty)>=0 || pretty.indexOf(moveStr)>=0)
			matches.push(index);
	});
	if(matches.length==1)
		return candidateMoves[matches[0]];

	bestDist=Infinity;
	bestMatches=[];
	candidateIndexes.forEach(function(index) {
		var dist=0;
		var str1=moveStr.replace(/[A-Z]/g,'');
		var str2=prettyMoves[index].replace(/[A-Z]/g,'');
		dist+=JocGame.Levenshtein(str1,str2)/(Math.max(str1.length,str2.length)+1);
		dist+=(str1.indexOf(str2)>=0 || str2.indexOf(str1)>=0)?0:1;
		str1=moveStr.replace(/[a-z]/g,'');
		str2=prettyMoves[index].replace(/[a-z]/g,'');
		dist+=JocGame.Levenshtein(str1,str2).distance/(Math.max(str1.length,str2.length)+1);
		dist+=(str1.indexOf(str2)>=0 || str2.indexOf(str1)>=0)?0:1;
		if(dist==bestDist)
			bestMatches.push(index);
		else if(dist<bestDist) {
			bestMatches=[index];
			bestDist=dist;
		}
	});
	if(bestMatches.length==1)
		return candidateMoves[bestMatches[0]];
	return null;
}

JocBoard.prototype.PickMoveFromDatabase = function(aGame,database) {
	if(!this.mMoves || this.mMoves.length==0) {
		var moves=[];
		this.mMoves=[];
		this.GenerateMoves(aGame);
		for(var i=0;i<this.mMoves.length;i++)
			moves.push(aGame.CreateMove(this.mMoves[i]));
		this.mMoves=moves;
	}
	if(this.mMoves.length==0)
		return null;
	var key=""+this.mWho+"#"+this.GetSignature();
	var dbMoves=database[key];
	if(!dbMoves)
		return null;
	var totalEval=0;
	for(var i=0;i<dbMoves.length;i++)
		totalEval+=dbMoves[i].e;
	var rnd=Math.random()*totalEval;
	var current=0;
	for(var i=0;i<dbMoves.length;i++) {
		var dbMove=dbMoves[i];
		current+=dbMove.e;
		if(current>rnd) {
			var pickedMove=aGame.GetBestMatchingMove(dbMove.m,this.mMoves);
			if(pickedMove)
				return [pickedMove];
		}
	}
	return null; // never reached
}

JocBoard.prototype.CompactMoveString = function(aGame,aMove) {
	if(typeof aMove.ToString!="function")
		aMove=aGame.CreateMove(aMove);
	return aMove.ToString();
}

/*-- Zobrist implementation --*/

JocGame.Zobrist=function(params) {
	var mt=new MersenneTwister(12345);
	var paramNames=[];
	for(var f in params)
		paramNames.push(f);
	paramNames.sort(); // ensures we walk through parameters always in same order so generated pseudo random seeds are always the same
	this.seed={};
	for(var pi=0;pi<paramNames.length;pi++) {
		var f=paramNames[pi];
		var param=params[f];
		var seed={
			values: {},
			seeds:[],
		}
		var vIndex=0;
		for(var vi=0;vi<param.values.length;vi++)
			seed.values[param.values[vi]]=vIndex++;
		switch(param.type) {
		case "array":
			for(var j=0;j<param.size;j++) {
				var seeds0=[];
				for(var i=0;i<vIndex;i++)
					seeds0.push(mt.genrand_int32());
				seed.seeds.push(seeds0);
			}
			seed.type="array";
			break;
		default:
			for(var i=0;i<vIndex;i++)
				seed.seeds.push(mt.genrand_int32());
			seed.type="simple";
		}
		this.seed[f]=seed;
	}
	//console.log("Created zobrist",this);
}

JocGame.Zobrist.prototype={
	update: function(zobrist,name) {
		//var zobrist0=zobrist;
		var seed=this.seed[name];
		if(seed===undefined) {
			console.error("Unknown Zobrist parameter",name);
			return 0;
		}
		var vIndex=seed.values[arguments[2]];
		if(vIndex===undefined) {
			console.error("Undeclared Zobrist value",arguments[2],"as param",name);
			return 0;
		}
		switch(seed.type) {
		case "simple":
			zobrist^=seed.seeds[vIndex];
			break;
		case "array":
			var seeds=seed.seeds[arguments[3]];
			if(seeds===undefined) {
				console.error("Undeclared Zobrist array index",arguments[3],"as param",name);
				return 0;				
			}
			zobrist^=seeds[vIndex];
			//console.log("Zobrist",zobrist0,"=>",name,"array[",arguments[2],"] =",arguments[3],"=>",zobrist);
			break;
		}
		return zobrist;
	},
}

/*--- Levenshtein distance implementation ---*/
JocGame.Levenshtein=function(e,f){if(e==f)return 0;var d=e.length,j=f.length;if(0===d)return j;if(0===j)return d;var b=!1;try{b=!"0"[0]}catch(m){b=!0}
b&&(e=e.split(""),f=f.split(""));for(var b=Array(d+1),g=Array(d+1),a=0,h=0,i=0,a=0;a<d+1;a++)b[a]=a;for(var c="",k="",h=1;h<=j;h++){g[0]=h;k=f[h-1];
for(a=0;a<d;a++){var c=e[a],i=c==k?0:1,c=b[a+1]+1,l=g[a]+1,i=b[a]+i;l<c&&(c=l);i<c&&(c=i);g[a+1]=c}a=b;b=g;g=a}return b[d]};


//# sourceMappingURL=jocly.game.js.map
