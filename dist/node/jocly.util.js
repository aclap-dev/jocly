"use strict";function _typeof(t){"@babel/helpers - typeof";return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function JocLog(){if("undefined"!=typeof jQuery){for(var t=[],e=0;e<arguments.length;e++){var r=arguments[e];"string"!=typeof r&&(r=JSON.stringify(r)),t.push(""+r)}jQuery("<p/>").text(t.join(" ")).appendTo(jQuery("#jocly-log"))}else console.warn.apply(console,arguments)}var JocUtil={JSON:JSON};JocUtil.reload=function(){window.location.reload()},JocUtil.setTimeout=function(t,e){return setTimeout(t,e)},JocUtil.setInterval=function(t,e){return setInterval(t,e)},JocUtil.clearTimeout=function(t){clearTimeout(t)},JocUtil.schedule=function(t,e,r){JocUtil.setTimeout(function(){t[e](r)},0)},JocUtil.setPref=function(t,e,r){var i="jocly_pref";arguments.length<3&&(r={}),r.appId&&(i+="_"+r.appId),r.game&&(i+="_"+r.game),i+="_"+t,"boolean"==typeof e&&(e="$#@"+e),"object"!=_typeof(e)&&"array"!=typeof e||(e="$#@JSON@"+JSON.stringify(e)),window.localStorage.setItem(i,e)},JocUtil.getPref=function(t,e){var r="jocly_pref";arguments.length<2&&(e={}),e.appId&&(r+="_"+e.appId),e.game&&(r+="_"+e.game),r+="_"+t;var i=window.localStorage.getItem(r);return"$#@true"==i?i=!0:"$#@false"==i?i=!1:"string"==typeof i&&"$#@JSON@"==i.substr(0,8)&&(i=JSON.parse(i.substr(8))),null==i&&void 0!==e.defaultValue&&(i=e.defaultValue),i},JocUtil.filterLevels=function(t,e,r){var i=parseInt(JocUtil.getPref("calibration",{defaultValue:0}));parseInt(JocUtil.getPref("calibrationDate",{defaultValue:0}))<(new Date).getTime()-864e5&&(i=0);var o=[];if(t){var n=null,a=0;for(var s in t){var c=t[s];if(c.isDefault&&(n=c,bestLevelFound=!0),c.isDefault=!1,c.fullLabel=strings["comp-level"]+" "+c.label,c.optionValue=s,c.calRatio){i||(i=function(){for(var t=(new Date).getTime(),e=[],r=[],i=0;i<100;i++)e.push(i);for(var i=0;i<1e3;i++){for(;e.length>0;)r.push(e.shift());var o=e;e=r,r=o}return(new Date).getTime()-t}(),JocLog("Calibration",i),JocUtil.setPref("calibration",i,{}),JocUtil.setPref("calibrationDate",(new Date).getTime(),{}));var u=i*c.calRatio;if(u>6e4&&o.length>=2)continue;(null==n||u<3e3&&u>a)&&(n=c,a=u)}else null==n&&(n=c);o.push(c)}n&&(n.isDefault=!0)}else{var l=9;e&&(l=e);for(var h=0;h<=l;h++){var c={fullLabel:strings["comp-level"]+" "+(h+1),optionValue:"machine-"+h,isDefault:!1};void 0!==r&&h==r&&(c.isDefault=!0),o.push(c)}}return o},JocUtil.cookieSupportTested=!1,JocUtil.cookieSupport=!0,JocUtil.hasCookieSupport=function(){if(JocUtil.cookieSupportTested)return JocUtil.cookieSupport;if(0==document.cookie.length){var t=new Date;t.setTime(t.getTime()+31536e6),document.cookie="jocly="+escape("{}")+"; path=/; expires="+t.toGMTString()+";",0==document.cookie.length&&(JocUtil.cookieSupport=!1)}return JocUtil.cookieSupportTested=!0,JocUtil.cookieSupport},JocUtil.getCookieData=function(){if(JocUtil.hasCookieSupport()){var t=document.cookie.split(";");for(var e in t){var r=/^ *(.*)$/.exec(t[e])[1];if(0==r.indexOf("jocly="))try{return JSON.parse(unescape(r.substring(6)))}catch(t){JocLog("Unable to parse cookie",r)}}return{}}var i=window.localStorage.getItem("jocly");return null==i?{}:JSON.parse(i)},JocUtil.setCookieData=function(t,e){if(JocUtil.hasCookieSupport()){var r=JocUtil.getCookieData();null==e?delete r[t]:r[t]=e;var i=new Date;i.setTime(i.getTime()+31536e6);var o="jocly="+escape(JSON.stringify(r))+"; path=/; expires="+i.toGMTString()+";";document.cookie=o}else{var r=window.localStorage.getItem("jocly");r=null==r?{}:JSON.parse(r),r[t]=e,window.localStorage.setItem("jocly",JSON.stringify(r))}},JocUtil.extend=function(t,e){for(var r in e)t[r]=e[r]},JocUtil.md5=function(t){function e(t,e){return t<<e|t>>>32-e}function r(t,e){var r,i,o,n,a;return o=2147483648&t,n=2147483648&e,r=1073741824&t,i=1073741824&e,a=(1073741823&t)+(1073741823&e),r&i?2147483648^a^o^n:r|i?1073741824&a?3221225472^a^o^n:1073741824^a^o^n:a^o^n}function i(t,e,r){return t&e|~t&r}function o(t,e,r){return t&r|e&~r}function n(t,e,r){return t^e^r}function a(t,e,r){return e^(t|~r)}function s(t,o,n,a,s,c,u){return t=r(t,r(r(i(o,n,a),s),u)),r(e(t,c),o)}function c(t,i,n,a,s,c,u){return t=r(t,r(r(o(i,n,a),s),u)),r(e(t,c),i)}function u(t,i,o,a,s,c,u){return t=r(t,r(r(n(i,o,a),s),u)),r(e(t,c),i)}function l(t,i,o,n,s,c,u){return t=r(t,r(r(a(i,o,n),s),u)),r(e(t,c),i)}function h(t){var e,r,i="",o="";for(r=0;r<=3;r++)e=t>>>8*r&255,o="0"+e.toString(16),i+=o.substr(o.length-2,2);return i}var f,p,m,g,d,v,y,S,J,C=Array();for(t=function(t){t=t.replace(/\r\n/g,"\n");for(var e="",r=0;r<t.length;r++){var i=t.charCodeAt(r);i<128?e+=String.fromCharCode(i):i>127&&i<2048?(e+=String.fromCharCode(i>>6|192),e+=String.fromCharCode(63&i|128)):(e+=String.fromCharCode(i>>12|224),e+=String.fromCharCode(i>>6&63|128),e+=String.fromCharCode(63&i|128))}return e}(t),C=function(t){for(var e,r=t.length,i=r+8,o=(i-i%64)/64,n=16*(o+1),a=Array(n-1),s=0,c=0;c<r;)e=(c-c%4)/4,s=c%4*8,a[e]=a[e]|t.charCodeAt(c)<<s,c++;return e=(c-c%4)/4,s=c%4*8,a[e]=a[e]|128<<s,a[n-2]=r<<3,a[n-1]=r>>>29,a}(t),v=1732584193,y=4023233417,S=2562383102,J=271733878,f=0;f<C.length;f+=16)p=v,m=y,g=S,d=J,v=s(v,y,S,J,C[f+0],7,3614090360),J=s(J,v,y,S,C[f+1],12,3905402710),S=s(S,J,v,y,C[f+2],17,606105819),y=s(y,S,J,v,C[f+3],22,3250441966),v=s(v,y,S,J,C[f+4],7,4118548399),J=s(J,v,y,S,C[f+5],12,1200080426),S=s(S,J,v,y,C[f+6],17,2821735955),y=s(y,S,J,v,C[f+7],22,4249261313),v=s(v,y,S,J,C[f+8],7,1770035416),J=s(J,v,y,S,C[f+9],12,2336552879),S=s(S,J,v,y,C[f+10],17,4294925233),y=s(y,S,J,v,C[f+11],22,2304563134),v=s(v,y,S,J,C[f+12],7,1804603682),J=s(J,v,y,S,C[f+13],12,4254626195),S=s(S,J,v,y,C[f+14],17,2792965006),y=s(y,S,J,v,C[f+15],22,1236535329),v=c(v,y,S,J,C[f+1],5,4129170786),J=c(J,v,y,S,C[f+6],9,3225465664),S=c(S,J,v,y,C[f+11],14,643717713),y=c(y,S,J,v,C[f+0],20,3921069994),v=c(v,y,S,J,C[f+5],5,3593408605),J=c(J,v,y,S,C[f+10],9,38016083),S=c(S,J,v,y,C[f+15],14,3634488961),y=c(y,S,J,v,C[f+4],20,3889429448),v=c(v,y,S,J,C[f+9],5,568446438),J=c(J,v,y,S,C[f+14],9,3275163606),S=c(S,J,v,y,C[f+3],14,4107603335),y=c(y,S,J,v,C[f+8],20,1163531501),v=c(v,y,S,J,C[f+13],5,2850285829),J=c(J,v,y,S,C[f+2],9,4243563512),S=c(S,J,v,y,C[f+7],14,1735328473),y=c(y,S,J,v,C[f+12],20,2368359562),v=u(v,y,S,J,C[f+5],4,4294588738),J=u(J,v,y,S,C[f+8],11,2272392833),S=u(S,J,v,y,C[f+11],16,1839030562),y=u(y,S,J,v,C[f+14],23,4259657740),v=u(v,y,S,J,C[f+1],4,2763975236),J=u(J,v,y,S,C[f+4],11,1272893353),S=u(S,J,v,y,C[f+7],16,4139469664),y=u(y,S,J,v,C[f+10],23,3200236656),v=u(v,y,S,J,C[f+13],4,681279174),J=u(J,v,y,S,C[f+0],11,3936430074),S=u(S,J,v,y,C[f+3],16,3572445317),y=u(y,S,J,v,C[f+6],23,76029189),v=u(v,y,S,J,C[f+9],4,3654602809),J=u(J,v,y,S,C[f+12],11,3873151461),S=u(S,J,v,y,C[f+15],16,530742520),y=u(y,S,J,v,C[f+2],23,3299628645),v=l(v,y,S,J,C[f+0],6,4096336452),J=l(J,v,y,S,C[f+7],10,1126891415),S=l(S,J,v,y,C[f+14],15,2878612391),y=l(y,S,J,v,C[f+5],21,4237533241),v=l(v,y,S,J,C[f+12],6,1700485571),J=l(J,v,y,S,C[f+3],10,2399980690),S=l(S,J,v,y,C[f+10],15,4293915773),y=l(y,S,J,v,C[f+1],21,2240044497),v=l(v,y,S,J,C[f+8],6,1873313359),J=l(J,v,y,S,C[f+15],10,4264355552),S=l(S,J,v,y,C[f+6],15,2734768916),y=l(y,S,J,v,C[f+13],21,1309151649),v=l(v,y,S,J,C[f+4],6,4149444226),J=l(J,v,y,S,C[f+11],10,3174756917),S=l(S,J,v,y,C[f+2],15,718787259),y=l(y,S,J,v,C[f+9],21,3951481745),v=r(v,p),y=r(y,m),S=r(S,g),J=r(J,d);return(h(v)+h(y)+h(S)+h(J)).toLowerCase()},JocUtil.sha1=function(t){function e(t,e){return t<<e|t>>>32-e}function r(t){var e,r,i="";for(e=7;e>=0;e--)r=t>>>4*e&15,i+=r.toString(16);return i}var i,o,n,a,s,c,u,l,h,f=new Array(80),p=1732584193,m=4023233417,g=2562383102,d=271733878,v=3285377520;t=function(t){t=t.replace(/\r\n/g,"\n");for(var e="",r=0;r<t.length;r++){var i=t.charCodeAt(r);i<128?e+=String.fromCharCode(i):i>127&&i<2048?(e+=String.fromCharCode(i>>6|192),e+=String.fromCharCode(63&i|128)):(e+=String.fromCharCode(i>>12|224),e+=String.fromCharCode(i>>6&63|128),e+=String.fromCharCode(63&i|128))}return e}(t);var y=t.length,S=new Array;for(o=0;o<y-3;o+=4)n=t.charCodeAt(o)<<24|t.charCodeAt(o+1)<<16|t.charCodeAt(o+2)<<8|t.charCodeAt(o+3),S.push(n);switch(y%4){case 0:o=2147483648;break;case 1:o=t.charCodeAt(y-1)<<24|8388608;break;case 2:o=t.charCodeAt(y-2)<<24|t.charCodeAt(y-1)<<16|32768;break;case 3:o=t.charCodeAt(y-3)<<24|t.charCodeAt(y-2)<<16|t.charCodeAt(y-1)<<8|128}for(S.push(o);S.length%16!=14;)S.push(0);for(S.push(y>>>29),S.push(y<<3&4294967295),i=0;i<S.length;i+=16){for(o=0;o<16;o++)f[o]=S[i+o];for(o=16;o<=79;o++)f[o]=e(f[o-3]^f[o-8]^f[o-14]^f[o-16],1);for(a=p,s=m,c=g,u=d,l=v,o=0;o<=19;o++)h=e(a,5)+(s&c|~s&u)+l+f[o]+1518500249&4294967295,l=u,u=c,c=e(s,30),s=a,a=h;for(o=20;o<=39;o++)h=e(a,5)+(s^c^u)+l+f[o]+1859775393&4294967295,l=u,u=c,c=e(s,30),s=a,a=h;for(o=40;o<=59;o++)h=e(a,5)+(s&c|s&u|c&u)+l+f[o]+2400959708&4294967295,l=u,u=c,c=e(s,30),s=a,a=h;for(o=60;o<=79;o++)h=e(a,5)+(s^c^u)+l+f[o]+3395469782&4294967295,l=u,u=c,c=e(s,30),s=a,a=h;p=p+a&4294967295,m=m+s&4294967295,g=g+c&4294967295,d=d+u&4294967295,v=v+l&4294967295}var h=r(p)+r(m)+r(g)+r(d)+r(v);return h.toLowerCase()};var MersenneTwister=function(t){void 0==t&&(t=(new Date).getTime()),this.N=624,this.M=397,this.MATRIX_A=2567483615,this.UPPER_MASK=2147483648,this.LOWER_MASK=2147483647,this.mt=new Array(this.N),this.mti=this.N+1,this.init_genrand(t)};MersenneTwister.prototype.init_genrand=function(t){for(this.mt[0]=t>>>0,this.mti=1;this.mti<this.N;this.mti++){var t=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30;this.mt[this.mti]=(1812433253*((4294901760&t)>>>16)<<16)+1812433253*(65535&t)+this.mti,this.mt[this.mti]>>>=0}},MersenneTwister.prototype.init_by_array=function(t,e){var r,i,o;for(this.init_genrand(19650218),r=1,i=0,o=this.N>e?this.N:e;o;o--){var n=this.mt[r-1]^this.mt[r-1]>>>30;this.mt[r]=(this.mt[r]^(1664525*((4294901760&n)>>>16)<<16)+1664525*(65535&n))+t[i]+i,this.mt[r]>>>=0,r++,i++,r>=this.N&&(this.mt[0]=this.mt[this.N-1],r=1),i>=e&&(i=0)}for(o=this.N-1;o;o--){var n=this.mt[r-1]^this.mt[r-1]>>>30;this.mt[r]=(this.mt[r]^(1566083941*((4294901760&n)>>>16)<<16)+1566083941*(65535&n))-r,this.mt[r]>>>=0,r++,r>=this.N&&(this.mt[0]=this.mt[this.N-1],r=1)}this.mt[0]=2147483648},MersenneTwister.prototype.genrand_int32=function(){var t,e=new Array(0,this.MATRIX_A);if(this.mti>=this.N){var r;for(this.mti==this.N+1&&this.init_genrand(5489),r=0;r<this.N-this.M;r++)t=this.mt[r]&this.UPPER_MASK|this.mt[r+1]&this.LOWER_MASK,this.mt[r]=this.mt[r+this.M]^t>>>1^e[1&t];for(;r<this.N-1;r++)t=this.mt[r]&this.UPPER_MASK|this.mt[r+1]&this.LOWER_MASK,this.mt[r]=this.mt[r+(this.M-this.N)]^t>>>1^e[1&t];t=this.mt[this.N-1]&this.UPPER_MASK|this.mt[0]&this.LOWER_MASK,this.mt[this.N-1]=this.mt[this.M-1]^t>>>1^e[1&t],this.mti=0}return t=this.mt[this.mti++],t^=t>>>11,t^=t<<7&2636928640,t^=t<<15&4022730752,(t^=t>>>18)>>>0},MersenneTwister.prototype.genrand_int31=function(){return this.genrand_int32()>>>1},MersenneTwister.prototype.genrand_real1=function(){return this.genrand_int32()*(1/4294967295)},MersenneTwister.prototype.random=function(){return this.genrand_int32()*(1/4294967296)},MersenneTwister.prototype.genrand_real3=function(){return(this.genrand_int32()+.5)*(1/4294967296)},MersenneTwister.prototype.genrand_res53=function(){return(67108864*(this.genrand_int32()>>>5)+(this.genrand_int32()>>>6))*(1/9007199254740992)},"undefined"!=typeof module&&module.exports?(exports.MersenneTwister=MersenneTwister,exports.JocUtil=JocUtil):((void 0).MersenneTwister=MersenneTwister,(void 0).JocUtil=JocUtil);