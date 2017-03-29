(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Jocly = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (ArrayBuffer.isView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":1,"ieee754":4}],4:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename){
/*
 * SystemJS v0.20.10 Dev
 */
!function(){"use strict";function e(e){return ut?Symbol():"@@"+e}function t(e,t){ot||(t=t.replace(at?/file:\/\/\//g:/file:\/\//g,""));var r,n=(e.message||e)+"\n  "+t;r=ft&&e.fileName?new Error(n,e.fileName,e.lineNumber):new Error(n);var o=e.originalErr?e.originalErr.stack:e.stack;return it?r.stack=n+"\n  "+o:r.stack=o,r.originalErr=e.originalErr||e,r}function r(e,t){throw new RangeError('Unable to resolve "'+e+'" to '+t)}function n(e,t){e=e.trim();var n=t&&t.substr(0,t.indexOf(":")+1),o=e[0],i=e[1];if("/"===o&&"/"===i)return n||r(e,t),n+e;if("."===o&&("/"===i||"."===i&&("/"===e[2]||2===e.length)||1===e.length)||"/"===o){var a,s=!n||"/"!==t[n.length];if(s?(void 0===t&&r(e,t),a=t):"/"===t[n.length+1]?"file:"!==n?(a=t.substr(n.length+2),a=a.substr(a.indexOf("/")+1)):a=t.substr(8):a=t.substr(n.length+1),"/"===o){if(!s)return t.substr(0,t.length-a.length-1)+e;r(e,t)}for(var u=a.substr(0,a.lastIndexOf("/")+1)+e,l=[],c=void 0,f=0;f<u.length;f++)if(void 0===c)if("."!==u[f])c=f;else{if("."!==u[f+1]||"/"!==u[f+2]&&f!==u.length-2){if("/"!==u[f+1]&&f!==u.length-1){c=f;continue}f+=1}else l.pop(),f+=2;s&&0===l.length&&r(e,t),f===u.length&&l.push("")}else"/"===u[f]&&(l.push(u.substr(c,f-c+1)),c=void 0);return void 0!==c&&l.push(u.substr(c,u.length-c)),t.substr(0,t.length-a.length)+l.join("")}var d=e.indexOf(":");return-1!==d?it&&":"===e[1]&&"\\"===e[2]&&e[0].match(/[a-z]/i)?"file:///"+e.replace(/\\/g,"/"):e:void 0}function o(e){if(e.values)return e.values();if("undefined"==typeof Symbol||!Symbol.iterator)throw new Error("Symbol.iterator not supported in this browser");var t={};return t[Symbol.iterator]=function(){var t=Object.keys(e),r=0;return{next:function(){return r<t.length?{value:e[t[r++]],done:!1}:{value:void 0,done:!0}}}},t}function i(){this.registry=new u}function a(e){if(!(e instanceof l))throw new TypeError("Module instantiation did not return a valid namespace object.");return e}function s(e){if(void 0===e)throw new RangeError("No resolution found.");return e}function u(){this[mt]={},this._registry=mt}function l(e){Object.defineProperty(this,vt,{value:e}),Object.keys(e).forEach(c,this)}function c(e){Object.defineProperty(this,e,{enumerable:!0,get:function(){return this[vt][e]}})}function f(){i.call(this);var e=this.registry.delete;this.registry.delete=function(r){var n=e.call(this,r);return t.hasOwnProperty(r)&&!t[r].linkRecord&&delete t[r],n};var t={};this[yt]={lastRegister:void 0,records:t},this.trace=!1}function d(e,t,r){return e.records[t]={key:t,registration:r,module:void 0,importerSetters:void 0,linkRecord:{instantiatePromise:void 0,dependencies:void 0,execute:void 0,executingRequire:!1,moduleObj:void 0,setters:void 0,depsInstantiatePromise:void 0,dependencyInstantiations:void 0,linked:!1,error:void 0}}}function p(e,t,r,n,o){var i=n[t];if(i)return Promise.resolve(i);var a=o.records[t];return a&&!a.module?h(e,a,a.linkRecord,n,o):e.resolve(t,r).then(function(t){if(i=n[t])return i;a=o.records[t],(!a||a.module)&&(a=d(o,t,a&&a.registration));var r=a.linkRecord;return r?h(e,a,r,n,o):a})}function g(e,t,r){return function(){var e=r.lastRegister;return e?(r.lastRegister=void 0,t.registration=e,!0):!!t.registration}}function h(e,r,n,o,i){return n.instantiatePromise||(n.instantiatePromise=(r.registration?Promise.resolve():Promise.resolve().then(function(){return i.lastRegister=void 0,e[bt](r.key,e[bt].length>1&&g(e,r,i))})).then(function(t){if(void 0!==t){if(!(t instanceof l))throw new TypeError("Instantiate did not return a valid Module object.");return delete i.records[r.key],e.trace&&v(e,r,n),o[r.key]=t}var a=r.registration;if(r.registration=void 0,!a)throw new TypeError("Module instantiation did not call an anonymous or correctly named System.register.");return n.dependencies=a[0],r.importerSetters=[],n.moduleObj={},a[2]?(n.moduleObj.default={},n.moduleObj.__useDefault=!0,n.executingRequire=a[1],n.execute=a[2]):b(e,r,n,a[1]),n.dependencies.length||(n.linked=!0,e.trace&&v(e,r,n)),r}).catch(function(e){throw n.error=t(e,"Instantiating "+r.key)}))}function m(e,t,r,n,o,i){return e.resolve(t,r).then(function(r){i&&(i[t]=r);var a=o.records[r],s=n[r];if(s&&(!a||a.module&&s!==a.module))return s;(!a||!s&&a.module)&&(a=d(o,r,a&&a.registration));var u=a.linkRecord;return u?h(e,a,u,n,o):a})}function v(e,t,r){e.loads=e.loads||{},e.loads[t.key]={key:t.key,deps:r.dependencies,dynamicDeps:[],depMap:r.depMap||{}}}function y(e,t,r){e.loads[t].dynamicDeps.push(r)}function b(e,t,r,n){var o=r.moduleObj,i=t.importerSetters,a=!1,s=n.call(st,function(e,t){if(!a){if("object"==typeof e)for(var r in e)"__useDefault"!==r&&(o[r]=e[r]);else o[e]=t;a=!0;for(var n=0;n<i.length;n++)i[n](o);return a=!1,t}},new x(e,t.key));r.setters=s.setters,r.execute=s.execute,s.exports&&(r.moduleObj=o=s.exports)}function w(e,r,n,o,i,a){return(n.depsInstantiatePromise||(n.depsInstantiatePromise=Promise.resolve().then(function(){for(var t=Array(n.dependencies.length),a=0;a<n.dependencies.length;a++)t[a]=m(e,n.dependencies[a],r.key,o,i,e.trace&&n.depMap||(n.depMap={}));return Promise.all(t)}).then(function(e){if(n.dependencyInstantiations=e,n.setters)for(var t=0;t<e.length;t++){var r=n.setters[t];if(r){var o=e[t];o instanceof l?r(o):(r(o.module||o.linkRecord.moduleObj),o.importerSetters&&o.importerSetters.push(r))}}}))).then(function(){for(var t=[],r=0;r<n.dependencies.length;r++){var s=n.dependencyInstantiations[r],u=s.linkRecord;u&&!u.linked&&-1===a.indexOf(s)&&(a.push(s),t.push(w(e,s,s.linkRecord,o,i,a)))}return Promise.all(t)}).then(function(){return n.linked=!0,e.trace&&v(e,r,n),r}).catch(function(e){throw e=t(e,"Loading "+r.key),n.error=n.error||e,e})}function k(e,t){var r=e[yt];r.records[t.key]===t&&delete r.records[t.key];var n=t.linkRecord;n&&n.dependencyInstantiations&&n.dependencyInstantiations.forEach(function(t,o){if(t&&!(t instanceof l)&&t.linkRecord&&(t.linkRecord.error&&r.records[t.key]===t&&k(e,t),n.setters&&t.importerSetters)){var i=t.importerSetters.indexOf(n.setters[o]);t.importerSetters.splice(i,1)}})}function x(e,t){this.loader=e,this.key=this.id=t}function O(e,t,r,n,o,i){if(t.module)return t.module;if(r.error)throw r.error;if(i&&-1!==i.indexOf(t))return t.linkRecord.moduleObj;var a=E(e,t,r,n,o,r.setters?[]:i||[]);if(a)throw k(e,t),a;return t.module}function S(e,t,r,n,o,i,a){return function(s){for(var u=0;u<r.length;u++)if(r[u]===s){var c,f=n[u];return c=f instanceof l?f:O(e,f,f.linkRecord,o,i,a),c.__useDefault?c.default:c}throw new Error("Module "+s+" not declared as a System.registerDynamic dependency of "+t)}}function E(e,r,n,o,i,a){a.push(r);var s;if(n.setters)for(var u,c,f=0;f<n.dependencies.length;f++)if(u=n.dependencyInstantiations[f],!(u instanceof l)&&(c=u.linkRecord,c&&-1===a.indexOf(u)&&(s=c.error?c.error:E(e,u,c,o,i,c.setters?a:[])),s))return n.error=t(s,"Evaluating "+r.key);if(n.execute)if(n.setters)s=j(n.execute);else{var d={id:r.key},p=n.moduleObj;Object.defineProperty(d,"exports",{configurable:!0,set:function(e){p.default=e},get:function(){return p.default}});var g=S(e,r.key,n.dependencies,n.dependencyInstantiations,o,i,a);if(!n.executingRequire)for(var f=0;f<n.dependencies.length;f++)g(n.dependencies[f]);s=_(n.execute,g,p.default,d),d.exports!==p.default&&(p.default=d.exports);var h=p.default;if(h&&h.__esModule){p.__useDefault&&delete p.__useDefault;for(var m in h)Object.hasOwnProperty.call(h,m)&&(p[m]=h[m]);p.__esModule=!0}}if(s)return n.error=t(s,"Evaluating "+r.key);if(o[r.key]=r.module=new l(n.moduleObj),!n.setters){if(r.importerSetters)for(var f=0;f<r.importerSetters.length;f++)r.importerSetters[f](r.module);r.importerSetters=void 0}r.linkRecord=void 0}function j(e){try{e.call(wt)}catch(e){return e}}function _(e,t,r,n){try{var o=e.call(st,t,r,n);void 0!==o&&(n.exports=o)}catch(e){return e}}function R(){}function M(e){return e instanceof l?e:new l(e&&e.__esModule?e:{default:e,__useDefault:!0})}function P(e){return void 0===kt&&(kt="undefined"!=typeof Symbol&&!!Symbol.toStringTag),e instanceof l||kt&&"[object Module]"==Object.prototype.toString.call(e)}function C(e,t){(t||this.warnings&&"undefined"!=typeof console&&console.warn)&&console.warn(e)}function L(e,t){if("."===e[0])throw new Error("Node module "+e+" can't be loaded as it is not a package require.");if(!xt){var r=this._nodeRequire("module"),n=t.substr(at?8:7);xt=new r(n),xt.paths=r._nodeModulePaths(n)}return xt.require(e)}function A(e,t){for(var r in t)Object.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}function I(e,t){for(var r in t)Object.hasOwnProperty.call(t,r)&&void 0===e[r]&&(e[r]=t[r]);return e}function F(e,t,r){for(var n in t)if(Object.hasOwnProperty.call(t,n)){var o=t[n];void 0===e[n]?e[n]=o:o instanceof Array&&e[n]instanceof Array?e[n]=[].concat(r?o:e[n]).concat(r?e[n]:o):"object"==typeof o&&null!==o&&"object"==typeof e[n]?e[n]=(r?I:A)(A({},e[n]),o):r||(e[n]=o)}}function K(e){if(!Rt&&!Mt){var t=new Image;return void(t.src=e)}var r=document.createElement("link");Rt?(r.rel="preload",r.as="script"):r.rel="prefetch",r.href=e,document.head.appendChild(r),document.head.removeChild(r)}function D(e,t,r){try{importScripts(e)}catch(e){r(e)}t()}function q(e,t,r,n,o){function i(){n(),s()}function a(t){s(),o(new Error("Fetching "+e))}function s(){for(var e=0;e<Pt.length;e++)if(Pt[e].err===a){Pt.splice(e,1);break}u.removeEventListener("load",i,!1),u.removeEventListener("error",a,!1),document.head.removeChild(u)}if(e=e.replace(/#/g,"%23"),_t)return D(e,n,o);var u=document.createElement("script");u.type="text/javascript",u.charset="utf-8",u.async=!0,t&&(u.crossOrigin=t),r&&(u.integrity=r),u.addEventListener("load",i,!1),u.addEventListener("error",a,!1),u.src=e,document.head.appendChild(u)}function T(e,t){for(var r=e.split(".");r.length;)t=t[r.shift()];return t}function U(e,t,r){var o=N(t,r);if(o){var i=t[o]+r.substr(o.length),a=n(i,nt);return void 0!==a?a:e+i}return-1!==r.indexOf(":")?r:e+r}function z(e){var t=this.name;if(t.substr(0,e.length)===e&&(t.length===e.length||"/"===t[e.length]||"/"===e[e.length-1]||":"===e[e.length-1])){var r=e.split("/").length;r>this.len&&(this.match=e,this.len=r)}}function N(e,t){if(Object.hasOwnProperty.call(e,t))return t;var r={name:t,match:void 0,len:0};return Object.keys(e).forEach(z,r),r.match}function J(e,t,r,n){if("file:///"===e.substr(0,8)){if(Ft)return $(e,t,r,n);throw new Error("Unable to fetch file URLs in this environment.")}e=e.replace(/#/g,"%23");var o={headers:{Accept:"application/x-es-module, */*"}};return r&&(o.integrity=r),t&&("string"==typeof t&&(o.headers.Authorization=t),o.credentials="include"),fetch(e,o).then(function(e){if(e.ok)return n?e.arrayBuffer():e.text();throw new Error("Fetch error: "+e.status+" "+e.statusText)})}function $(e,t,r,n){return new Promise(function(r,o){function i(){r(n?s.response:s.responseText)}function a(){o(new Error("XHR error: "+(s.status?" ("+s.status+(s.statusText?" "+s.statusText:"")+")":"")+" loading "+e))}e=e.replace(/#/g,"%23");var s=new XMLHttpRequest;n&&(s.responseType="arraybuffer"),s.onreadystatechange=function(){4===s.readyState&&(0==s.status?s.response?i():(s.addEventListener("error",a),s.addEventListener("load",i)):200===s.status?i():a())},s.open("GET",e,!0),s.setRequestHeader&&(s.setRequestHeader("Accept","application/x-es-module, */*"),t&&("string"==typeof t&&s.setRequestHeader("Authorization",t),s.withCredentials=!0)),s.send(null)})}function B(e,t,r,n){return"file:///"!=e.substr(0,8)?Promise.reject(new Error('Unable to fetch "'+e+'". Only file URLs of the form file:/// supported running in Node.')):(Lt=Lt||require("fs"),e=at?e.replace(/\//g,"\\").substr(8):e.substr(7),new Promise(function(t,r){Lt.readFile(e,function(e,o){if(e)return r(e);if(n)t(o);else{var i=o+"";"\ufeff"===i[0]&&(i=i.substr(1)),t(i)}})}))}function W(){throw new Error("No fetch method is defined for this environment.")}function G(){return{pluginKey:void 0,pluginArgument:void 0,pluginModule:void 0,packageKey:void 0,packageConfig:void 0,load:void 0}}function H(e,t,r){var n=G();if(r){var o;t.pluginFirst?-1!==(o=r.lastIndexOf("!"))&&(n.pluginArgument=n.pluginKey=r.substr(0,o)):-1!==(o=r.indexOf("!"))&&(n.pluginArgument=n.pluginKey=r.substr(o+1)),n.packageKey=N(t.packages,r),n.packageKey&&(n.packageConfig=t.packages[n.packageKey])}return n}function Z(e,t){var r=this[Et],n=G(),o=H(this,r,t),i=this;return Promise.resolve().then(function(){var r=e.lastIndexOf("#?");if(-1===r)return Promise.resolve(e);var n=he.call(i,e.substr(r+2));return me.call(i,n,t,!0).then(function(t){return t?e.substr(0,r):"@empty"})}).then(function(e){var a=ne(r.pluginFirst,e);return a?(n.pluginKey=a.plugin,Promise.all([ee.call(i,r,a.argument,o&&o.pluginArgument||t,n,o,!0),i.resolve(a.plugin,t)]).then(function(e){if(n.pluginArgument=e[0],n.pluginKey=e[1],n.pluginArgument===n.pluginKey)throw new Error("Plugin "+n.pluginArgument+" cannot load itself, make sure it is excluded from any wildcard meta configuration via a custom loader: false rule.");return oe(r.pluginFirst,e[0],e[1])})):ee.call(i,r,e,o&&o.pluginArgument||t,n,o,!1)}).then(function(e){return ve.call(i,e,t,o)}).then(function(e){return re.call(i,r,e,n),n.pluginKey||!n.load.loader?e:i.resolve(n.load.loader,e).then(function(t){return n.pluginKey=t,n.pluginArgument=e,e})}).then(function(e){return i[jt][e]=n,e})}function X(e,t){var r=ne(e.pluginFirst,t);if(r){var n=X.call(this,e,r.plugin);return oe(e.pluginFirst,Q.call(this,e,r.argument,void 0,!1,!1),n)}return Q.call(this,e,t,void 0,!1,!1)}function Y(e,t){var r=this[Et],n=G(),o=o||H(this,r,t),i=ne(r.pluginFirst,e);return i?(n.pluginKey=Y.call(this,i.plugin,t),oe(r.pluginFirst,V.call(this,r,i.argument,o.pluginArgument||t,n,o,!!n.pluginKey),n.pluginKey)):V.call(this,r,e,o.pluginArgument||t,n,o,!!n.pluginKey)}function Q(e,t,r,o,i){var a=n(t,r||nt);if(a)return U(e.baseURL,e.paths,a);if(o){var s=N(e.map,t);if(s&&(t=e.map[s]+t.substr(s.length),a=n(t,nt)))return U(e.baseURL,e.paths,a)}if(this.registry.has(t))return t;if("@node/"===t.substr(0,6))return t;var u=i&&"/"!==t[t.length-1],l=U(e.baseURL,e.paths,u?t+"/":t);return u?l.substr(0,l.length-1):l}function V(e,t,r,n,o,i){if(o&&o.packageConfig&&"."!==t[0]){var a=o.packageConfig.map,s=a&&N(a,t);if(s&&"string"==typeof a[s]){var u=ue(this,e,o.packageConfig,o.packageKey,s,t,n,i);if(u)return u}}var l=Q.call(this,e,t,r,!0,!0),c=de(e,l);if(n.packageKey=c&&c.packageKey||N(e.packages,l),!n.packageKey)return l;if(-1!==e.packageConfigKeys.indexOf(l))return n.packageKey=void 0,l;n.packageConfig=e.packages[n.packageKey]||(e.packages[n.packageKey]=Oe());var f=l.substr(n.packageKey.length+1);return ae(this,e,n.packageConfig,n.packageKey,f,n,i)}function ee(e,t,r,n,o,i){var a=this;return Ot.then(function(){if(o&&o.packageConfig&&"./"!==t.substr(0,2)){var r=o.packageConfig.map,s=r&&N(r,t);if(s)return ce(a,e,o.packageConfig,o.packageKey,s,t,n,i)}return Ot}).then(function(o){if(o)return o;var s=Q.call(a,e,t,r,!0,!0),u=de(e,s);if(n.packageKey=u&&u.packageKey||N(e.packages,s),!n.packageKey)return Promise.resolve(s);if(-1!==e.packageConfigKeys.indexOf(s))return n.packageKey=void 0,n.load=te(),n.load.format="json",n.load.loader="",Promise.resolve(s);n.packageConfig=e.packages[n.packageKey]||(e.packages[n.packageKey]=Oe());var l=u&&!n.packageConfig.configured;return(l?pe(a,e,u.configPath,n):Ot).then(function(){var t=s.substr(n.packageKey.length+1);return le(a,e,n.packageConfig,n.packageKey,t,n,i)})})}function te(){return{extension:"",deps:void 0,format:void 0,loader:void 0,scriptLoad:void 0,globals:void 0,nonce:void 0,integrity:void 0,sourceMap:void 0,exports:void 0,encapsulateGlobal:!1,crossOrigin:void 0,cjsRequireDetection:!0,cjsDeferDepsExecute:!1,esModule:!1}}function re(e,t,r){r.load=r.load||te();var n,o=0;for(var i in e.meta)if(n=i.indexOf("*"),-1!==n&&i.substr(0,n)===t.substr(0,n)&&i.substr(n+1)===t.substr(t.length-i.length+n+1)){var a=i.split("/").length;a>o&&(o=a),F(r.load,e.meta[i],o!==a)}if(e.meta[t]&&F(r.load,e.meta[t],!1),r.packageKey){var s=t.substr(r.packageKey.length+1),u={};if(r.packageConfig.meta){var o=0;ge(r.packageConfig.meta,s,function(e,t,r){r>o&&(o=r),F(u,t,r&&o>r)}),F(r.load,u,!1)}!r.packageConfig.format||r.pluginKey||r.load.loader||(r.load.format=r.load.format||r.packageConfig.format)}}function ne(e,t){var r,n,o=e?t.indexOf("!"):t.lastIndexOf("!");return-1!==o?(e?(r=t.substr(o+1),n=t.substr(0,o)):(r=t.substr(0,o),n=t.substr(o+1)||r.substr(r.lastIndexOf(".")+1)),{argument:r,plugin:n}):void 0}function oe(e,t,r){return e?r+"!"+t:t+"!"+r}function ie(e,t,r,n,o){if(!n||!t.defaultExtension||"/"===n[n.length-1]||o)return n;var i=!1;if(t.meta&&ge(t.meta,n,function(e,t,r){return 0===r||e.lastIndexOf("*")!==e.length-1?i=!0:void 0}),!i&&e.meta&&ge(e.meta,r+"/"+n,function(e,t,r){return 0===r||e.lastIndexOf("*")!==e.length-1?i=!0:void 0}),i)return n;var a="."+t.defaultExtension;return n.substr(n.length-a.length)!==a?n+a:n}function ae(e,t,r,n,o,i,a){if(!o){if(!r.main)return n;o="./"===r.main.substr(0,2)?r.main.substr(2):r.main}if(r.map){var s="./"+o,u=N(r.map,s);if(u||(s="./"+ie(e,r,n,o,a),s!=="./"+o&&(u=N(r.map,s))),u){var l=ue(e,t,r,n,u,s,i,a);if(l)return l}}return n+"/"+ie(e,r,n,o,a)}function se(e,t,r){return t.substr(0,e.length)===e&&r.length>e.length?!1:!0}function ue(e,t,r,n,o,i,a,s){"/"===i[i.length-1]&&(i=i.substr(0,i.length-1));var u=r.map[o];if("object"==typeof u)throw new Error("Synchronous conditional normalization not supported sync normalizing "+o+" in "+n);if(se(o,u,i)&&"string"==typeof u)return V.call(this,t,u+i.substr(o.length),n+"/",a,a,s)}function le(e,t,r,n,o,i,a){if(!o){if(!r.main)return Promise.resolve(n);o="./"===r.main.substr(0,2)?r.main.substr(2):r.main}var s,u;return r.map&&(s="./"+o,u=N(r.map,s),u||(s="./"+ie(e,r,n,o,a),s!=="./"+o&&(u=N(r.map,s)))),(u?ce(e,t,r,n,u,s,i,a):Ot).then(function(t){return t?Promise.resolve(t):Promise.resolve(n+"/"+ie(e,r,n,o,a))})}function ce(e,t,r,n,o,i,a,s){"/"===i[i.length-1]&&(i=i.substr(0,i.length-1));var u=r.map[o];if("string"==typeof u)return se(o,u,i)?ee.call(e,t,u+i.substr(o.length),n+"/",a,a,s).then(function(t){return ve.call(e,t,n+"/",a)}):Ot;var l=[],c=[];for(var d in u){var p=he(d);c.push({condition:p,map:u[d]}),l.push(f.prototype.import.call(e,p.module,n))}return Promise.all(l).then(function(e){for(var t=0;t<c.length;t++){var r=c[t].condition,n=T(r.prop,e[t].__useDefault?e[t].default:e[t]);if(!r.negate&&n||r.negate&&!n)return c[t].map}}).then(function(r){return r?se(o,r,i)?ee.call(e,t,r+i.substr(o.length),n+"/",a,a,s).then(function(t){return ve.call(e,t,n+"/",a)}):Ot:void 0})}function fe(e){var t=e.lastIndexOf("*"),r=Math.max(t+1,e.lastIndexOf("/"));return{length:r,regEx:new RegExp("^("+e.substr(0,r).replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/\*/g,"[^\\/]+")+")(\\/|$)"),wildcard:-1!==t}}function de(e,t){for(var r,n,o=!1,i=0;i<e.packageConfigPaths.length;i++){var a=e.packageConfigPaths[i],s=Dt[a]||(Dt[a]=fe(a));if(!(t.length<s.length)){var u=t.match(s.regEx);!u||r&&(o&&s.wildcard||!(r.length<u[1].length))||(r=u[1],o=!s.wildcard,n=r+a.substr(s.length))}}return r?{packageKey:r,configPath:n}:void 0}function pe(e,r,n,o,i){var a=e.pluginLoader||e;return-1===r.packageConfigKeys.indexOf(n)&&r.packageConfigKeys.push(n),a.import(n).then(function(e){Se(o.packageConfig,e,o.packageKey,!0,r),o.packageConfig.configured=!0}).catch(function(e){throw t(e,"Unable to fetch package configuration file "+n)})}function ge(e,t,r){var n;for(var o in e){var i="./"===o.substr(0,2)?"./":"";if(i&&(o=o.substr(2)),n=o.indexOf("*"),-1!==n&&o.substr(0,n)===t.substr(0,n)&&o.substr(n+1)===t.substr(t.length-o.length+n+1)&&r(o,e[i+o],o.split("/").length))return}var a=e[t]&&Object.hasOwnProperty.call(e,t)?e[t]:e["./"+t];a&&r(a,a,0)}function he(e){var t,r,n,n,o=e.lastIndexOf("|");return-1!==o?(t=e.substr(o+1),r=e.substr(0,o),"~"===t[0]&&(n=!0,t=t.substr(1))):(n="~"===e[0],t="default",r=e.substr(n),-1!==qt.indexOf(r)&&(t=r,r=null)),{module:r||"@system-env",prop:t,negate:n}}function me(e,t,r){return f.prototype.import.call(this,e.module,t).then(function(t){var n=T(e.prop,t);if(r&&"boolean"!=typeof n)throw new TypeError("Condition did not resolve to a boolean.");return e.negate?!n:n})}function ve(e,t,r){var n=e.match(Tt);if(!n)return Promise.resolve(e);var o=he.call(this,n[0].substr(2,n[0].length-3));return me.call(this,o,t,!1).then(function(r){if("string"!=typeof r)throw new TypeError("The condition value for "+e+" doesn't resolve to a string.");if(-1!==r.indexOf("/"))throw new TypeError("Unabled to interpolate conditional "+e+(t?" in "+t:"")+"\n	The condition value "+r+' cannot contain a "/" separator.');return e.replace(Tt,r)})}function ye(e,t,r){for(var n=0;n<Ut.length;n++){var o=Ut[n];t[o]&&Or[o.substr(0,o.length-6)]&&r(t[o])}}function be(e,t){var r={};for(var n in e){var o=e[n];t>1?o instanceof Array?r[n]=[].concat(o):"object"==typeof o?r[n]=be(o,t-1):"packageConfig"!==n&&(r[n]=o):r[n]=o}return r}function we(e,t){var r=e[t];return r instanceof Array?e[t].concat([]):"object"==typeof r?be(r,3):e[t]}function ke(e){if(e){if(-1!==Sr.indexOf(e))return we(this[Et],e);throw new Error('"'+e+'" is not a valid configuration name. Must be one of '+Sr.join(", ")+".")}for(var t={},r=0;r<Sr.length;r++){var n=Sr[r],o=we(this[Et],n);void 0!==o&&(t[n]=o)}return t}function xe(e,t){var r=this,o=this[Et];if("warnings"in e&&(o.warnings=e.warnings),"wasm"in e&&(o.wasm="undefined"!=typeof WebAssembly&&e.wasm),("production"in e||"build"in e)&&tt.call(r,!!e.production,!!(e.build||Or&&Or.build)),!t){var i;ye(r,e,function(e){i=i||e.baseURL}),i=i||e.baseURL,i&&(o.baseURL=n(i,nt)||n("./"+i,nt),"/"!==o.baseURL[o.baseURL.length-1]&&(o.baseURL+="/")),e.paths&&A(o.paths,e.paths),ye(r,e,function(e){e.paths&&A(o.paths,e.paths)});for(var a in o.paths)-1!==o.paths[a].indexOf("*")&&(C.call(o,"Path config "+a+" -> "+o.paths[a]+" is no longer supported as wildcards are deprecated."),delete o.paths[a])}if(e.defaultJSExtensions&&C.call(o,"The defaultJSExtensions configuration option is deprecated.\n  Use packages defaultExtension instead.",!0),"boolean"==typeof e.pluginFirst&&(o.pluginFirst=e.pluginFirst),e.map)for(var a in e.map){var s=e.map[a];if("string"==typeof s){var u=Q.call(r,o,s,void 0,!1,!1);"/"===u[u.length-1]&&":"!==a[a.length-1]&&"/"!==a[a.length-1]&&(u=u.substr(0,u.length-1)),o.map[a]=u}else{var l=Q.call(r,o,"/"!==a[a.length-1]?a+"/":a,void 0,!0,!0);l=l.substr(0,l.length-1);var c=o.packages[l];c||(c=o.packages[l]=Oe(),c.defaultExtension=""),Se(c,{map:s},l,!1,o)}}if(e.packageConfigPaths){for(var f=[],d=0;d<e.packageConfigPaths.length;d++){var p=e.packageConfigPaths[d],g=Math.max(p.lastIndexOf("*")+1,p.lastIndexOf("/")),h=Q.call(r,o,p.substr(0,g),void 0,!1,!1);f[d]=h+p.substr(g)}o.packageConfigPaths=f}if(e.bundles)for(var a in e.bundles){for(var m=[],d=0;d<e.bundles[a].length;d++)m.push(r.normalizeSync(e.bundles[a][d]));o.bundles[a]=m}if(e.packages)for(var a in e.packages){if(a.match(/^([^\/]+:)?\/\/$/))throw new TypeError('"'+a+'" is not a valid package name.');var l=Q.call(r,o,"/"!==a[a.length-1]?a+"/":a,void 0,!0,!0);l=l.substr(0,l.length-1),Se(o.packages[l]=o.packages[l]||Oe(),e.packages[a],l,!1,o)}if(e.depCache)for(var a in e.depCache)o.depCache[r.normalizeSync(a)]=[].concat(e.depCache[a]);if(e.meta)for(var a in e.meta)if("*"===a[0])A(o.meta[a]=o.meta[a]||{},e.meta[a]);else{var v=Q.call(r,o,a,void 0,!0,!0);A(o.meta[v]=o.meta[v]||{},e.meta[a])}"transpiler"in e&&(o.transpiler=e.transpiler);for(var y in e)-1===Sr.indexOf(y)&&-1===Ut.indexOf(y)&&(r[y]=e[y]);ye(r,e,function(e){r.config(e,!0)})}function Oe(){return{defaultExtension:void 0,main:void 0,format:void 0,meta:void 0,map:void 0,packageConfig:void 0,configured:!1}}function Se(e,t,r,n,o){for(var i in t)"main"===i||"format"===i||"defaultExtension"===i||"configured"===i?n&&void 0!==e[i]||(e[i]=t[i]):"map"===i?(n?I:A)(e.map=e.map||{},t.map):"meta"===i?(n?I:A)(e.meta=e.meta||{},t.meta):Object.hasOwnProperty.call(t,i)&&C.call(o,'"'+i+'" is not a valid package configuration option in package '+r);return void 0===e.defaultExtension&&(e.defaultExtension="js"),void 0===e.main&&e.map&&e.map["."]?(e.main=e.map["."],delete e.map["."]):"object"==typeof e.main&&(e.map=e.map||{},e.map["./@main"]=e.main,e.main.default=e.main.default||"./",e.main="@main"),e}function Ee(e){return zt?Wt+new Buffer(e).toString("base64"):"undefined"!=typeof btoa?Wt+btoa(unescape(encodeURIComponent(e))):""}function je(e,t,r,n){var o=e.lastIndexOf("\n");if(t){if("object"!=typeof t)throw new TypeError("load.metadata.sourceMap must be set to an object.");t=JSON.stringify(t)}return(n?"(function(System, SystemJS) {":"")+e+(n?"\n})(System, System);":"")+("\n//# sourceURL="!=e.substr(o,15)?"\n//# sourceURL="+r+(t?"!transpiled":""):"")+(t&&Ee(t)||"")}function _e(e,t,r,n,o){Nt||(Nt=document.head||document.body||document.documentElement);var i=document.createElement("script");i.text=je(t,r,n,!1);var a,s=window.onerror;return window.onerror=function(e){a=addToError(e,"Evaluating "+n),s&&s.apply(this,arguments)},Re(e),o&&i.setAttribute("nonce",o),Nt.appendChild(i),Nt.removeChild(i),Me(),window.onerror=s,a?a:void 0}function Re(e){0==Gt++&&(Bt=st.System),st.System=st.SystemJS=e}function Me(){0==--Gt&&(st.System=st.SystemJS=Bt)}function Pe(e,t,r,n,o,i,a){if(t){if(i&&Ht)return _e(e,t,r,n,i);try{Re(e),!Jt&&e._nodeRequire&&(Jt=e._nodeRequire("vm"),$t=Jt.runInThisContext("typeof System !== 'undefined' && System")===e),$t?Jt.runInThisContext(je(t,r,n,!a),{filename:n+(r?"!transpiled":"")}):(0,eval)(je(t,r,n,!a)),Me()}catch(e){return Me(),e}}}function Ce(e){return"file:///"===e.substr(0,8)?e.substr(7+!!at):Zt&&e.substr(0,Zt.length)===Zt?e.substr(Zt.length):e}function Le(e,t){return Ce(this.normalizeSync(e,t))}function Ae(e){var t,r=e.lastIndexOf("!");t=-1!==r?e.substr(0,r):e;var n=t.split("/");return n.pop(),n=n.join("/"),{filename:Ce(t),dirname:Ce(n)}}function Ie(e){function t(e,t){for(var r=0;r<e.length;r++)if(e[r][0]<t.index&&e[r][1]>t.index)return!0;return!1}It.lastIndex=tr.lastIndex=rr.lastIndex=0;var r,n=[],o=[],i=[];if(e.length/e.split("\n").length<200){for(;r=rr.exec(e);)o.push([r.index,r.index+r[0].length]);for(;r=tr.exec(e);)t(o,r)||i.push([r.index+r[1].length,r.index+r[0].length-1])}for(;r=It.exec(e);)if(!t(o,r)&&!t(i,r)){var a=r[1].substr(1,r[1].length-2);if(a.match(/"|'/))continue;n.push(a)}return n}function Fe(e){if(-1===nr.indexOf(e)){try{var t=st[e]}catch(t){nr.push(e)}this(e,t)}}function Ke(e){if("string"==typeof e)return T(e,st);if(!(e instanceof Array))throw new Error("Global exports must be a string or array.");for(var t={},r=0;r<e.length;r++)t[e[r].split(".").pop()]=T(e[r],st);return t}function De(e,t,r,n){var o=st.define;st.define=void 0;var i;if(r){i={};for(var a in r)i[a]=st[a],st[a]=r[a]}return t||(Yt={},Object.keys(st).forEach(Fe,function(e,t){Yt[e]=t})),function(){var e,r=t?Ke(t):{},a=!!t;if((!t||n)&&Object.keys(st).forEach(Fe,function(o,i){Yt[o]!==i&&void 0!==i&&(n&&(st[o]=void 0),t||(r[o]=i,void 0!==e?a||e===i||(a=!0):e=i))}),r=a?r:e,i)for(var s in i)st[s]=i[s];return st.define=o,r}}function qe(e,t){e=e.replace(tr,"");var r=e.match(ar),n=(r[1].split(",")[t]||"require").replace(sr,""),o=ur[n]||(ur[n]=new RegExp(or+n+ir,"g"));o.lastIndex=0;for(var i,a=[];i=o.exec(e);)a.push(i[2]||i[3]);return a}function Te(e){return function(t,r,n){e(t,r,n),r=n.exports,"object"!=typeof r&&"function"!=typeof r||"__esModule"in r||Object.defineProperty(n.exports,"__esModule",{value:!0})}}function Ue(e,t){Vt=e,cr=t,Qt=void 0,lr=!1}function ze(e){Qt?e.registerDynamic(Vt?Qt[0].concat(Vt):Qt[0],!1,cr?Te(Qt[1]):Qt[1]):lr&&e.registerDynamic([],!1,R)}function Ne(e,t){!e.load.esModule||"object"!=typeof t&&"function"!=typeof t||"__esModule"in t||Object.defineProperty(t,"__esModule",{value:!0})}function Je(e,t){var r=this,n=this[Et];return(Be(n,this,e)||Ot).then(function(){if(!t()){var o=r[jt][e];if("@node/"===e.substr(0,6)){if(!r._nodeRequire)throw new TypeError("Error loading "+e+". Can only load node core modules in Node.");return r.registerDynamic([],!1,function(){return L.call(r,e.substr(6),r.baseURL)}),void t()}return o.load.scriptLoad?(o.load.pluginKey||!fr)&&(o.load.scriptLoad=!1,C.call(n,'scriptLoad not supported for "'+e+'"')):o.load.scriptLoad!==!1&&!o.load.pluginKey&&fr&&(o.load.deps||o.load.globals||!("system"===o.load.format||"register"===o.load.format||"global"===o.load.format&&o.load.exports)||(o.load.scriptLoad=!0)),o.load.scriptLoad?new Promise(function(n,i){if("amd"===o.load.format&&st.define!==r.amdDefine)throw new Error("Loading AMD with scriptLoad requires setting the global `"+pr+".define = SystemJS.amdDefine`");q(e,o.load.crossOrigin,o.load.integrity,function(){if(!t()){o.load.format="global";var e=o.load.exports&&Ke(o.load.exports);r.registerDynamic([],!1,function(){return Ne(o,e),e}),t()}n()},i)}):$e(r,e,o).then(function(){return We(r,e,o,t,n.wasm)})}}).then(function(t){return delete r[jt][e],t})}function $e(e,t,r){return r.pluginKey?e.import(r.pluginKey).then(function(e){r.pluginModule=e,r.pluginLoad={name:t,address:r.pluginArgument,source:void 0,metadata:r.load},r.load.deps=r.load.deps||[]}):Ot}function Be(e,t,r){var n=e.depCache[r];if(n)for(var o=0;o<n.length;o++)t.normalize(n[o],r).then(K);else{var i=!1;for(var a in e.bundles){for(var o=0;o<e.bundles[a].length;o++){var s=e.bundles[a][o];if(s===r){i=!0;break}if(-1!==s.indexOf("*")){var u=s.split("*");if(2!==u.length){e.bundles[a].splice(o--,1);continue}if(r.substr(0,u[0].length)===u[0]&&r.substr(r.length-u[1].length,u[1].length)===u[1]){i=!0;break}}}if(i)return t.import(a)}}}function We(e,t,r,n,o){return r.load.exports&&!r.load.format&&(r.load.format="global"),Ot.then(function(){return r.pluginModule&&r.pluginModule.locate?Promise.resolve(r.pluginModule.locate.call(e,r.pluginLoad)).then(function(e){e&&(r.pluginLoad.address=e)}):void 0}).then(function(){return r.pluginModule?(o=!1,r.pluginModule.fetch?r.pluginModule.fetch.call(e,r.pluginLoad,function(e){return Kt(e.address,r.load.authorization,r.load.integrity,!1)}):Kt(r.pluginLoad.address,r.load.authorization,r.load.integrity,!1)):Kt(t,r.load.authorization,r.load.integrity,o)}).then(function(i){if(!o||"string"==typeof i)return Ge(e,t,i,r,n);var a=new Uint8Array(i);if(0===a[0]&&97===a[1]&&115===a[2])return WebAssembly.compile(a).then(function(t){var r=[],o=[],i={};WebAssembly.Module.imports&&WebAssembly.Module.imports(t).forEach(function(e){var t=e.module;o.push(function(e){i[t]=e}),-1===r.indexOf(t)&&r.push(t)}),e.register(r,function(e){return{setters:o,execute:function(){e(new WebAssembly.Instance(t,i).exports)}}}),n()});var s=ot?new TextDecoder("utf-8").decode(a):i.toString();return Ge(e,t,s,r,n)})}function Ge(e,t,r,n,o){return Promise.resolve(r).then(function(t){return"detect"===n.load.format&&(n.load.format=void 0),Ve(t,n),n.pluginModule&&n.pluginModule.translate?(n.pluginLoad.source=t,Promise.resolve(n.pluginModule.translate.call(e,n.pluginLoad,n.traceOpts)).then(function(e){if(n.load.sourceMap){if("object"!=typeof n.load.sourceMap)throw new Error("metadata.load.sourceMap must be set to an object.");Xe(n.pluginLoad.address,n.load.sourceMap)}return"string"==typeof e?e:n.pluginLoad.source})):t}).then(function(r){return"register"===n.load.format||!n.load.format&&He(r)?(n.load.format="register",r):"esm"===n.load.format||!n.load.format&&r.match(gr)?(n.load.format="esm",Ye(e,r,t,n,o)):r}).then(function(t){if("string"!=typeof t||!n.pluginModule||!n.pluginModule.instantiate)return t;var r=!1;return n.pluginLoad.source=t,Promise.resolve(n.pluginModule.instantiate.call(e,n.pluginLoad,function(e){if(t=e.source,n.load=e.metadata,r)throw new Error("Instantiate must only be called once.");r=!0})).then(function(e){return r?t:M(e)})}).then(function(r){if("string"!=typeof r)return r;n.load.format||(n.load.format=Ze(r));var i=!1;switch(n.load.format){case"esm":case"register":case"system":var a=Pe(e,r,n.load.sourceMap,t,n.load.integrity,n.load.nonce,!1);if(a)throw a;if(!o())return St;return;case"json":return e.newModule({default:JSON.parse(r),__useDefault:!0});case"amd":var s=st.define;st.define=e.amdDefine,Ue(n.load.deps,n.load.esModule);var a=Pe(e,r,n.load.sourceMap,t,n.load.integrity,n.load.nonce,!1);if(i=o(),i||(ze(e),i=o()),st.define=s,a)throw a;break;case"cjs":var u=n.load.deps,l=(n.load.deps||[]).concat(n.load.cjsRequireDetection?Ie(r):[]);
for(var c in n.load.globals)n.load.globals[c]&&l.push(n.load.globals[c]);e.registerDynamic(l,!0,function(o,i,a){if(o.resolve=function(t){return Le.call(e,t,a.id)},a.paths=[],a.require=o,!n.load.cjsDeferDepsExecute&&u)for(var s=0;s<u.length;s++)o(u[s]);var l=Ae(a.id),c={exports:i,args:[o,i,a,l.filename,l.dirname,st,st]},f="(function (require, exports, module, __filename, __dirname, global, GLOBAL";if(n.load.globals)for(var d in n.load.globals)c.args.push(o(n.load.globals[d])),f+=", "+d;var p=st.define;st.define=void 0,st.__cjsWrapper=c,r=f+") {"+r.replace(yr,"")+"\n}).apply(__cjsWrapper.exports, __cjsWrapper.args);";var g=Pe(e,r,n.load.sourceMap,t,n.load.integrity,n.load.nonce,!1);if(g)throw g;Ne(n,i),st.__cjsWrapper=void 0,st.define=p}),i=o();break;case"global":var l=n.load.deps||[];for(var c in n.load.globals){var f=n.load.globals[c];f&&l.push(f)}e.registerDynamic(l,!1,function(o,i,a){var s;if(n.load.globals){s={};for(var u in n.load.globals)n.load.globals[u]&&(s[u]=o(n.load.globals[u]))}var l=n.load.exports;l&&(r+="\n"+pr+'["'+l+'"] = '+l+";");var c=De(a.id,l,s,n.load.encapsulateGlobal),f=Pe(e,r,n.load.sourceMap,t,n.load.integrity,n.load.nonce,!0);if(f)throw f;var d=c();return Ne(n,d),d}),i=o();break;default:throw new TypeError('Unknown module format "'+n.load.format+'" for "'+t+'".'+("es6"===n.load.format?' Use "esm" instead here.':""))}if(!i)throw new Error("Module "+t+" detected as "+n.load.format+" but didn't execute correctly.")})}function He(e){var t=e.match(hr);return t&&"System.register"===e.substr(t[0].length,15)}function Ze(e){return e.match(mr)?"amd":(vr.lastIndex=0,It.lastIndex=0,It.exec(e)||vr.exec(e)?"cjs":"global")}function Xe(e,t){var r=e.split("!")[0];t.file&&t.file!=e||(t.file=r+"!transpiled"),(!t.sources||t.sources.length<=1&&(!t.sources[0]||t.sources[0]===e))&&(t.sources=[r])}function Ye(e,r,n,o,i){if(!e.transpiler)throw new TypeError("Unable to dynamically transpile ES module\n   A loader plugin needs to be configured via `SystemJS.config({ transpiler: 'transpiler-module' })`.");if(o.load.deps){for(var a="",s=0;s<o.load.deps.length;s++)a+='import "'+o.load.deps[s]+'"; ';r=a+r}return e.import.call(e,e.transpiler).then(function(t){if(t.__useDefault&&(t=t.default),!t.translate)throw new Error(e.transpiler+" is not a valid transpiler plugin.");return t===o.pluginModule?r:("string"==typeof o.load.sourceMap&&(o.load.sourceMap=JSON.parse(o.load.sourceMap)),o.pluginLoad=o.pluginLoad||{name:n,address:n,source:r,metadata:o.load},o.load.deps=o.load.deps||[],Promise.resolve(t.translate.call(e,o.pluginLoad,o.traceOpts)).then(function(e){var t=o.load.sourceMap;return t&&"object"==typeof t&&Xe(n,t),"esm"===o.load.format&&He(e)&&(o.load.format="register"),e}))},function(e){throw t(e,"Unable to load transpiler to transpile "+n)})}function Qe(e,t,r){for(var n,o=t.split(".");o.length>1;)n=o.shift(),e=e[n]=e[n]||{};n=o.shift(),void 0===e[n]&&(e[n]=r)}function Ve(e,t){var r=e.match(br);if(r)for(var n=r[0].match(wr),o=0;o<n.length;o++){var i=n[o],a=i.length,s=i.substr(0,1);if(";"==i.substr(a-1,1)&&a--,'"'==s||"'"==s){var u=i.substr(1,i.length-3),l=u.substr(0,u.indexOf(" "));if(l){var c=u.substr(l.length+1,u.length-l.length-1);"deps"===l&&(l="deps[]"),"[]"===l.substr(l.length-2,2)?(l=l.substr(0,l.length-2),t.load[l]=t.load[l]||[],t.load[l].push(c)):"use"!==l&&Qe(t.load,l,c)}else t.load[u]=!0}}}function et(){f.call(this),this._loader={},this[jt]={},this[Et]={baseURL:nt,paths:{},packageConfigPaths:[],packageConfigKeys:[],map:{},packages:{},depCache:{},meta:{},bundles:{},production:!1,transpiler:void 0,loadedBundles:{},warnings:!1,pluginFirst:!1,wasm:!1},this.scriptSrc=dr,this._nodeRequire=er,this.registry.set("@empty",St),tt.call(this,!1,!1),Xt(this)}function tt(e,t){this[Et].production=e,this.registry.set("@system-env",Or=this.newModule({browser:ot,node:!!this._nodeRequire,production:!t&&e,dev:t||!e,build:t,default:!0}))}function rt(e,t){C.call(e[Et],"SystemJS."+t+" is deprecated for SystemJS.registry."+t)}var nt,ot="undefined"!=typeof window&&"undefined"!=typeof document,it="undefined"!=typeof process&&process.versions&&process.versions.node,at="undefined"!=typeof process&&"string"==typeof process.platform&&process.platform.match(/^win/),st="undefined"!=typeof self?self:global,ut="undefined"!=typeof Symbol;if("undefined"!=typeof document&&document.getElementsByTagName){if(nt=document.baseURI,!nt){var lt=document.getElementsByTagName("base");nt=lt[0]&&lt[0].href||window.location.href}}else"undefined"!=typeof location&&(nt=location.href);if(nt){nt=nt.split("#")[0].split("?")[0];var ct=nt.lastIndexOf("/");-1!==ct&&(nt=nt.substr(0,ct+1))}else{if("undefined"==typeof process||!process.cwd)throw new TypeError("No environment baseURI");nt="file://"+(at?"/":"")+process.cwd(),at&&(nt=nt.replace(/\\/g,"/"))}"/"!==nt[nt.length-1]&&(nt+="/");var ft="_"==new Error(0,"_").fileName,dt=Promise.resolve();i.prototype.constructor=i,i.prototype.import=function(e,r){if("string"!=typeof e)throw new TypeError("Loader import method must be passed a module key string");var n=this;return dt.then(function(){return n[gt](e,r)}).then(a).catch(function(n){throw t(n,"Loading "+e+(r?" from "+r:""))})};var pt=i.resolve=e("resolve"),gt=i.resolveInstantiate=e("resolveInstantiate");i.prototype[gt]=function(e,t){var r=this;return r.resolve(e,t).then(function(e){return r.registry.get(e)})},i.prototype.resolve=function(e,r){var n=this;return dt.then(function(){return n[pt](e,r)}).then(s).catch(function(n){throw t(n,"Resolving "+e+(r?" to "+r:""))})};var ht="undefined"!=typeof Symbol&&Symbol.iterator,mt=e("registry");ht&&(u.prototype[Symbol.iterator]=function(){return this.entries()[Symbol.iterator]()},u.prototype.entries=function(){var e=this[mt];return o(Object.keys(e).map(function(t){return[t,e[t]]}))}),u.prototype.keys=function(){return o(Object.keys(this[mt]))},u.prototype.values=function(){var e=this[mt];return o(Object.keys(e).map(function(t){return e[t]}))},u.prototype.get=function(e){return this[mt][e]},u.prototype.set=function(e,t){if(!(t instanceof l))throw new Error("Registry must be set with an instance of Module Namespace");return this[mt][e]=t,this},u.prototype.has=function(e){return Object.hasOwnProperty.call(this[mt],e)},u.prototype.delete=function(e){return Object.hasOwnProperty.call(this[mt],e)?(delete this[mt][e],!0):!1};var vt=e("baseObject");l.prototype=Object.create(null),"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(l.prototype,Symbol.toStringTag,{value:"Module"});var yt=e("register-internal");f.prototype=Object.create(i.prototype),f.prototype.constructor=f;var bt=f.instantiate=e("instantiate");f.prototype[f.resolve=i.resolve]=function(e,t){return n(e,t||nt)},f.prototype[bt]=function(e,t){},f.prototype[i.resolveInstantiate]=function(e,t){var r=this,n=this[yt],o=r.registry[r.registry._registry];return p(r,e,t,o,n).then(function(e){return e instanceof l?e:e.module?e.module:e.linkRecord.linked?O(r,e,e.linkRecord,o,n,void 0):w(r,e,e.linkRecord,o,n,[e]).then(function(){return O(r,e,e.linkRecord,o,n,void 0)}).catch(function(t){throw k(r,e),t})})},f.prototype.register=function(e,t,r){var n=this[yt];if(void 0===r)n.lastRegister=[e,t,void 0];else{var o=n.records[e]||d(n,e,void 0);o.registration=[t,r,void 0]}},f.prototype.registerDynamic=function(e,t,r,n){var o=this[yt];if("string"!=typeof e)o.lastRegister=[e,t,r];else{var i=o.records[e]||d(o,e,void 0);i.registration=[t,r,n]}},x.prototype.import=function(e){return this.loader.trace&&y(this.loader,this.key,e),this.loader.import(e,this.key)};var wt={};Object.freeze&&Object.freeze(wt);var kt,xt,Ot=Promise.resolve(),St=new l({}),Et=e("loader-config"),jt=e("metadata"),_t="undefined"==typeof window&&"undefined"!=typeof self&&"undefined"!=typeof importScripts,Rt=!1,Mt=!1;if(ot&&function(){var e=document.createElement("link").relList;if(e&&e.supports){Mt=!0;try{Rt=e.supports("preload")}catch(e){}}}(),ot){var Pt=[],Ct=window.onerror;window.onerror=function(e,t){for(var r=0;r<Pt.length;r++)if(Pt[r].src===t)return void Pt[r].err(e);Ct&&Ct.apply(this,arguments)}}var Lt,At,It=/(?:^\uFEFF?|[^$_a-zA-Z\xA0-\uFFFF."'])require\s*\(\s*("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g,Ft="undefined"!=typeof XMLHttpRequest;At="undefined"!=typeof self&&"undefined"!=typeof self.fetch?J:Ft?$:"undefined"!=typeof require&&"undefined"!=typeof process?B:W;var Kt=At,Dt={},qt=["browser","node","dev","build","production","default"],Tt=/#\{[^\}]+\}/,Ut=["browserConfig","nodeConfig","devConfig","buildConfig","productionConfig"],zt="undefined"!=typeof Buffer;try{zt&&"YQ=="!==new Buffer("a").toString("base64")&&(zt=!1)}catch(e){zt=!1}var Nt,Jt,$t,Bt,Wt="\n//# sourceMappingURL=data:application/json;base64,",Gt=0,Ht=!1;ot&&"undefined"!=typeof document&&document.getElementsByTagName&&(window.chrome&&window.chrome.extension||navigator.userAgent.match(/^Node\.js/)||(Ht=!0));var Zt,Xt=function(e){function t(r,n,o,i){if("object"==typeof r&&!(r instanceof Array))return t.apply(null,Array.prototype.splice.call(arguments,1,arguments.length-1));if("string"==typeof r&&"function"==typeof n&&(r=[r]),!(r instanceof Array)){if("string"==typeof r){var a=e.decanonicalize(r,i),s=e.get(a);if(!s)throw new Error('Module not already loaded loading "'+r+'" as '+a+(i?' from "'+i+'".':"."));return s.__useDefault?s.default:s}throw new TypeError("Invalid require")}for(var u=[],l=0;l<r.length;l++)u.push(e.import(r[l],i));Promise.all(u).then(function(e){for(var t=0;t<e.length;t++)e[t]=e[t].__useDefault?e[t].default:e[t];n&&n.apply(null,e)},o)}function r(r,n,o){function i(r,i,l){for(var c=[],f=0;f<n.length;f++)c.push(r(n[f]));if(l.uri=l.id,l.config=R,-1!==u&&c.splice(u,0,l),-1!==s&&c.splice(s,0,i),-1!==a){var d=function(n,o,i){return"string"==typeof n&&"function"!=typeof o?r(n):t.call(e,n,o,i,l.id)};d.toUrl=function(t){return e.normalizeSync(t,l.id)},c.splice(a,0,d)}var p=st.require;st.require=t;var g=o.apply(-1===s?st:i,c);st.require=p,"undefined"!=typeof g&&(l.exports=g)}"string"!=typeof r&&(o=n,n=r,r=null),n instanceof Array||(o=n,n=["require","exports","module"].splice(0,o.length)),"function"!=typeof o&&(o=function(e){return function(){return e}}(o)),r||Vt&&(n=n.concat(Vt),Vt=void 0);var a,s,u;-1!==(a=n.indexOf("require"))&&(n.splice(a,1),r||(n=n.concat(qe(o.toString(),a)))),-1!==(s=n.indexOf("exports"))&&n.splice(s,1),-1!==(u=n.indexOf("module"))&&n.splice(u,1),r?(e.registerDynamic(r,n,!1,i),Qt?(Qt=void 0,lr=!0):lr||(Qt=[n,i])):e.registerDynamic(n,!1,cr?Te(i):i)}e.set("@@cjs-helpers",e.newModule({requireResolve:Le.bind(e),getPathVars:Ae})),e.set("@@global-helpers",e.newModule({prepareGlobal:De})),r.amd={},e.amdDefine=r,e.amdRequire=t};"undefined"!=typeof window&&"undefined"!=typeof document&&window.location&&(Zt=location.protocol+"//"+location.hostname+(location.port?":"+location.port:""));var Yt,Qt,Vt,er,tr=/(^|[^\\])(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,rr=/("[^"\\\n\r]*(\\.[^"\\\n\r]*)*"|'[^'\\\n\r]*(\\.[^'\\\n\r]*)*')/g,nr=["_g","sessionStorage","localStorage","clipboardData","frames","frameElement","external","mozAnimationStartTime","webkitStorageInfo","webkitIndexedDB","mozInnerScreenY","mozInnerScreenX"],or="(?:^|[^$_a-zA-Z\\xA0-\\uFFFF.])",ir="\\s*\\(\\s*(\"([^\"]+)\"|'([^']+)')\\s*\\)",ar=/\(([^\)]*)\)/,sr=/^\s+|\s+$/g,ur={},lr=!1,cr=!1,fr=(ot||_t)&&"undefined"!=typeof navigator&&navigator.userAgent&&!navigator.userAgent.match(/MSIE (9|10).0/);"undefined"==typeof require||"undefined"==typeof process||process.browser||(er=require);var dr,pr="undefined"!=typeof self?"self":"global",gr=/(^\s*|[}\);\n]\s*)(import\s*(['"]|(\*\s+as\s+)?[^"'\(\)\n;]+\s*from\s*['"]|\{)|export\s+\*\s+from\s+["']|export\s*(\{|default|function|class|var|const|let|async\s+function))/,hr=/^(\s*\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\s*\/\/[^\n]*|\s*"[^"]+"\s*;?|\s*'[^']+'\s*;?)*\s*/,mr=/(?:^\uFEFF?|[^$_a-zA-Z\xA0-\uFFFF.])define\s*\(\s*("[^"]+"\s*,\s*|'[^']+'\s*,\s*)?\s*(\[(\s*(("[^"]+"|'[^']+')\s*,|\/\/.*\r?\n|\/\*(.|\s)*?\*\/))*(\s*("[^"]+"|'[^']+')\s*,?)?(\s*(\/\/.*\r?\n|\/\*(.|\s)*?\*\/))*\s*\]|function\s*|{|[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*\))/,vr=/(?:^\uFEFF?|[^$_a-zA-Z\xA0-\uFFFF.])(exports\s*(\[['"]|\.)|module(\.exports|\['exports'\]|\["exports"\])\s*(\[['"]|[=,\.]))/,yr=/^\#\!.*/,br=/^(\s*\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\s*\/\/[^\n]*|\s*"[^"]+"\s*;?|\s*'[^']+'\s*;?)+/,wr=/\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\/\/[^\n]*|"[^"]+"\s*;?|'[^']+'\s*;?/g;if("undefined"==typeof Promise)throw new Error("SystemJS needs a Promise polyfill.");if("undefined"!=typeof document){var kr=document.getElementsByTagName("script"),xr=kr[kr.length-1];document.currentScript&&(xr.defer||xr.async)&&(xr=document.currentScript),dr=xr&&xr.src}else if("undefined"!=typeof importScripts)try{throw new Error("_")}catch(e){e.stack.replace(/(?:at|@).*(http.+):[\d]+:[\d]+/,function(e,t){dr=t})}else"undefined"!=typeof __filename&&(dr=__filename);var Or;et.prototype=Object.create(f.prototype),et.prototype.constructor=et,et.prototype[et.resolve=f.resolve]=et.prototype.normalize=Z,et.prototype.load=function(e,t){return C.call(this[Et],"System.load is deprecated."),this.import(e,t)},et.prototype.decanonicalize=et.prototype.normalizeSync=et.prototype.resolveSync=Y,et.prototype[et.instantiate=f.instantiate]=Je,et.prototype.config=xe,et.prototype.getConfig=ke,et.prototype.global=st,et.prototype.import=function(){return f.prototype.import.apply(this,arguments).then(function(e){return e.__useDefault?e.default:e})};for(var Sr=["baseURL","map","paths","packages","packageConfigPaths","depCache","meta","bundles","transpiler","warnings","pluginFirst","production","wasm"],Er="undefined"!=typeof Proxy,jr=0;jr<Sr.length;jr++)(function(e){Object.defineProperty(et.prototype,e,{get:function(){var t=we(this[Et],e);return Er&&"object"==typeof t&&(t=new Proxy(t,{set:function(t,r){throw new Error("Cannot set SystemJS."+e+'["'+r+'"] directly. Use SystemJS.config({ '+e+': { "'+r+'": ... } }) rather.')}})),t},set:function(t){throw new Error("Setting `SystemJS."+e+"` directly is no longer supported. Use `SystemJS.config({ "+e+": ... })`.")}})})(Sr[jr]);et.prototype.delete=function(e){rt(this,"delete"),this.registry.delete(e)},et.prototype.get=function(e){return rt(this,"get"),this.registry.get(e)},et.prototype.has=function(e){return rt(this,"has"),this.registry.has(e)},et.prototype.set=function(e,t){return rt(this,"set"),this.registry.set(e,t)},et.prototype.newModule=function(e){return new l(e)},et.prototype.isModule=P,et.prototype.register=function(e,t,r){return"string"==typeof e&&(e=X.call(this,this[Et],e)),f.prototype.register.call(this,e,t,r)},et.prototype.registerDynamic=function(e,t,r,n){return"string"==typeof e&&(e=X.call(this,this[Et],e)),f.prototype.registerDynamic.call(this,e,t,r,n)},et.prototype.version="0.20.10 Dev";var _r=new et;(ot||_t)&&(st.SystemJS=st.System=_r),"undefined"!=typeof module&&module.exports&&(module.exports=_r)}();


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/systemjs/dist/system.js")

},{"_process":5,"buffer":3,"fs":2}],7:[function(require,module,exports){
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

const SystemJS = require("../../node_modules/systemjs/dist/system.js");

function GetScriptPath() {
    var scripts= document.getElementsByTagName('script');
    var path= scripts[scripts.length-1].src.split('?')[0];
    var mydir= path.split('/').slice(0, -1).join('/')+'/';
    return new URL(mydir).pathname;
}

const joclyScriptPath = GetScriptPath();

SystemJS.config({
    baseURL: joclyScriptPath
});

function ExportFunction(fName) {
    exports[fName] = function() {
        var args = arguments;
        var promise = new Promise((resolve,reject)=>{
            SystemJS.import("jocly.core.js").then((m)=>{
                m[fName].apply(m,args).then(function() {
                    resolve.apply(null,arguments);
                },(e)=>{
                    reject(e);
                });
            },(e)=>{
                reject(e);
            });
        });
        return promise;
    }
}

["listGames","createGame","createInternalGame"].forEach((fName)=>{
    ExportFunction(fName);
});


},{"../../node_modules/systemjs/dist/system.js":6}]},{},[7])(7)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvc3lzdGVtanMvZGlzdC9zeXN0ZW0uanMiLCJzcmMvYnJvd3Nlci9qb2NseS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMXFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gcGxhY2VIb2xkZXJzQ291bnQgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcbiAgLy8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuICAvLyByZXByZXNlbnQgb25lIGJ5dGVcbiAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG4gIC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2VcbiAgcmV0dXJuIGI2NFtsZW4gLSAyXSA9PT0gJz0nID8gMiA6IGI2NFtsZW4gLSAxXSA9PT0gJz0nID8gMSA6IDBcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuICByZXR1cm4gYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzQ291bnQoYjY0KVxufVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG4gIHBsYWNlSG9sZGVycyA9IHBsYWNlSG9sZGVyc0NvdW50KGI2NClcblxuICBhcnIgPSBuZXcgQXJyKGxlbiAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgbCA9IHBsYWNlSG9sZGVycyA+IDAgPyBsZW4gLSA0IDogbGVuXG5cbiAgdmFyIEwgPSAwXG5cbiAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltMKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG52YXIgS19NQVhfTEVOR1RIID0gMHg3ZmZmZmZmZlxuZXhwb3J0cy5rTWF4TGVuZ3RoID0gS19NQVhfTEVOR1RIXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFByaW50IHdhcm5pbmcgYW5kIHJlY29tbWVuZCB1c2luZyBgYnVmZmVyYCB2NC54IHdoaWNoIGhhcyBhbiBPYmplY3RcbiAqICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIFdlIHJlcG9ydCB0aGF0IHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGlmIHRoZSBhcmUgbm90IHN1YmNsYXNzYWJsZVxuICogdXNpbmcgX19wcm90b19fLiBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YFxuICogKFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4KS4gSUUgMTAgbGFja3Mgc3VwcG9ydFxuICogZm9yIF9fcHJvdG9fXyBhbmQgaGFzIGEgYnVnZ3kgdHlwZWQgYXJyYXkgaW1wbGVtZW50YXRpb24uXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gdHlwZWRBcnJheVN1cHBvcnQoKVxuXG5pZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gIGNvbnNvbGUuZXJyb3IoXG4gICAgJ1RoaXMgYnJvd3NlciBsYWNrcyB0eXBlZCBhcnJheSAoVWludDhBcnJheSkgc3VwcG9ydCB3aGljaCBpcyByZXF1aXJlZCBieSAnICtcbiAgICAnYGJ1ZmZlcmAgdjUueC4gVXNlIGBidWZmZXJgIHY0LnggaWYgeW91IHJlcXVpcmUgb2xkIGJyb3dzZXIgc3VwcG9ydC4nXG4gIClcbn1cblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICAvLyBDYW4gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWQ/XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLl9fcHJvdG9fXyA9IHtfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLCBmb286IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH19XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDJcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIHZhciBidWYgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gIGJ1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBidWZcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKGFyZylcbiAgfVxuICByZXR1cm4gZnJvbShhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbmlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIHZhbHVlOiBudWxsLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSlcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbmZ1bmN0aW9uIGZyb20gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgcmV0dXJuIGZyb21PYmplY3QodmFsdWUpXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20odmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gTm90ZTogQ2hhbmdlIHByb3RvdHlwZSAqYWZ0ZXIqIEJ1ZmZlci5mcm9tIGlzIGRlZmluZWQgdG8gd29ya2Fyb3VuZCBDaHJvbWUgYnVnOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC8xNDhcbkJ1ZmZlci5wcm90b3R5cGUuX19wcm90b19fID0gVWludDhBcnJheS5wcm90b3R5cGVcbkJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2Moc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlIChzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZW5jb2RpbmdcIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVuY29kaW5nJylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gYnVmLndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICBidWYgPSBidWYuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlIChhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgYnVmW2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnb2Zmc2V0XFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdsZW5ndGhcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICB2YXIgYnVmXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBidWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbilcblxuICAgIGlmIChidWYubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gYnVmXG4gICAgfVxuXG4gICAgb2JqLmNvcHkoYnVmLCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIGJ1ZlxuICB9XG5cbiAgaWYgKG9iaikge1xuICAgIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcob2JqKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcigwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgQXJyYXkuaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwgS19NQVhfTEVOR1RIYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBLX01BWF9MRU5HVEgudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiBiICE9IG51bGwgJiYgYi5faXNCdWZmZXIgPT09IHRydWVcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gICAgfVxuICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoXG4gIH1cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpIHx8IHN0cmluZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhpcyBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIChhbmQgdGhlIGBpcy1idWZmZXJgIG5wbSBwYWNrYWdlKVxuLy8gdG8gZGV0ZWN0IGEgQnVmZmVyIGluc3RhbmNlLiBJdCdzIG5vdCBwb3NzaWJsZSB0byB1c2UgYGluc3RhbmNlb2YgQnVmZmVyYFxuLy8gcmVsaWFibHkgaW4gYSBicm93c2VyaWZ5IGNvbnRleHQgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBtdWx0aXBsZSBkaWZmZXJlbnRcbi8vIGNvcGllcyBvZiB0aGUgJ2J1ZmZlcicgcGFja2FnZSBpbiB1c2UuIFRoaXMgbWV0aG9kIHdvcmtzIGV2ZW4gZm9yIEJ1ZmZlclxuLy8gaW5zdGFuY2VzIHRoYXQgd2VyZSBjcmVhdGVkIGZyb20gYW5vdGhlciBjb3B5IG9mIHRoZSBgYnVmZmVyYCBwYWNrYWdlLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMTU0XG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKGlzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gbGF0aW4xV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCA+Pj4gMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIChieXRlc1tpICsgMV0gKiAyNTYpKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIHZhciBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIG5ld0J1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgKDggKiBieXRlTGVuZ3RoKSAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBCdWZmZXIuaXNCdWZmZXIodmFsKVxuICAgICAgPyB2YWxcbiAgICAgIDogbmV3IEJ1ZmZlcih2YWwsIGVuY29kaW5nKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXisvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gaXNuYW4gKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSB2YWwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cbiIsImV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qXG4gKiBTeXN0ZW1KUyB2MC4yMC4xMCBEZXZcbiAqL1xuIWZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gZShlKXtyZXR1cm4gdXQ/U3ltYm9sKCk6XCJAQFwiK2V9ZnVuY3Rpb24gdChlLHQpe290fHwodD10LnJlcGxhY2UoYXQ/L2ZpbGU6XFwvXFwvXFwvL2c6L2ZpbGU6XFwvXFwvL2csXCJcIikpO3ZhciByLG49KGUubWVzc2FnZXx8ZSkrXCJcXG4gIFwiK3Q7cj1mdCYmZS5maWxlTmFtZT9uZXcgRXJyb3IobixlLmZpbGVOYW1lLGUubGluZU51bWJlcik6bmV3IEVycm9yKG4pO3ZhciBvPWUub3JpZ2luYWxFcnI/ZS5vcmlnaW5hbEVyci5zdGFjazplLnN0YWNrO3JldHVybiBpdD9yLnN0YWNrPW4rXCJcXG4gIFwiK286ci5zdGFjaz1vLHIub3JpZ2luYWxFcnI9ZS5vcmlnaW5hbEVycnx8ZSxyfWZ1bmN0aW9uIHIoZSx0KXt0aHJvdyBuZXcgUmFuZ2VFcnJvcignVW5hYmxlIHRvIHJlc29sdmUgXCInK2UrJ1wiIHRvICcrdCl9ZnVuY3Rpb24gbihlLHQpe2U9ZS50cmltKCk7dmFyIG49dCYmdC5zdWJzdHIoMCx0LmluZGV4T2YoXCI6XCIpKzEpLG89ZVswXSxpPWVbMV07aWYoXCIvXCI9PT1vJiZcIi9cIj09PWkpcmV0dXJuIG58fHIoZSx0KSxuK2U7aWYoXCIuXCI9PT1vJiYoXCIvXCI9PT1pfHxcIi5cIj09PWkmJihcIi9cIj09PWVbMl18fDI9PT1lLmxlbmd0aCl8fDE9PT1lLmxlbmd0aCl8fFwiL1wiPT09byl7dmFyIGEscz0hbnx8XCIvXCIhPT10W24ubGVuZ3RoXTtpZihzPyh2b2lkIDA9PT10JiZyKGUsdCksYT10KTpcIi9cIj09PXRbbi5sZW5ndGgrMV0/XCJmaWxlOlwiIT09bj8oYT10LnN1YnN0cihuLmxlbmd0aCsyKSxhPWEuc3Vic3RyKGEuaW5kZXhPZihcIi9cIikrMSkpOmE9dC5zdWJzdHIoOCk6YT10LnN1YnN0cihuLmxlbmd0aCsxKSxcIi9cIj09PW8pe2lmKCFzKXJldHVybiB0LnN1YnN0cigwLHQubGVuZ3RoLWEubGVuZ3RoLTEpK2U7cihlLHQpfWZvcih2YXIgdT1hLnN1YnN0cigwLGEubGFzdEluZGV4T2YoXCIvXCIpKzEpK2UsbD1bXSxjPXZvaWQgMCxmPTA7Zjx1Lmxlbmd0aDtmKyspaWYodm9pZCAwPT09YylpZihcIi5cIiE9PXVbZl0pYz1mO2Vsc2V7aWYoXCIuXCIhPT11W2YrMV18fFwiL1wiIT09dVtmKzJdJiZmIT09dS5sZW5ndGgtMil7aWYoXCIvXCIhPT11W2YrMV0mJmYhPT11Lmxlbmd0aC0xKXtjPWY7Y29udGludWV9Zis9MX1lbHNlIGwucG9wKCksZis9MjtzJiYwPT09bC5sZW5ndGgmJnIoZSx0KSxmPT09dS5sZW5ndGgmJmwucHVzaChcIlwiKX1lbHNlXCIvXCI9PT11W2ZdJiYobC5wdXNoKHUuc3Vic3RyKGMsZi1jKzEpKSxjPXZvaWQgMCk7cmV0dXJuIHZvaWQgMCE9PWMmJmwucHVzaCh1LnN1YnN0cihjLHUubGVuZ3RoLWMpKSx0LnN1YnN0cigwLHQubGVuZ3RoLWEubGVuZ3RoKStsLmpvaW4oXCJcIil9dmFyIGQ9ZS5pbmRleE9mKFwiOlwiKTtyZXR1cm4tMSE9PWQ/aXQmJlwiOlwiPT09ZVsxXSYmXCJcXFxcXCI9PT1lWzJdJiZlWzBdLm1hdGNoKC9bYS16XS9pKT9cImZpbGU6Ly8vXCIrZS5yZXBsYWNlKC9cXFxcL2csXCIvXCIpOmU6dm9pZCAwfWZ1bmN0aW9uIG8oZSl7aWYoZS52YWx1ZXMpcmV0dXJuIGUudmFsdWVzKCk7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFN5bWJvbHx8IVN5bWJvbC5pdGVyYXRvcil0aHJvdyBuZXcgRXJyb3IoXCJTeW1ib2wuaXRlcmF0b3Igbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7dmFyIHQ9e307cmV0dXJuIHRbU3ltYm9sLml0ZXJhdG9yXT1mdW5jdGlvbigpe3ZhciB0PU9iamVjdC5rZXlzKGUpLHI9MDtyZXR1cm57bmV4dDpmdW5jdGlvbigpe3JldHVybiByPHQubGVuZ3RoP3t2YWx1ZTplW3RbcisrXV0sZG9uZTohMX06e3ZhbHVlOnZvaWQgMCxkb25lOiEwfX19fSx0fWZ1bmN0aW9uIGkoKXt0aGlzLnJlZ2lzdHJ5PW5ldyB1fWZ1bmN0aW9uIGEoZSl7aWYoIShlIGluc3RhbmNlb2YgbCkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIk1vZHVsZSBpbnN0YW50aWF0aW9uIGRpZCBub3QgcmV0dXJuIGEgdmFsaWQgbmFtZXNwYWNlIG9iamVjdC5cIik7cmV0dXJuIGV9ZnVuY3Rpb24gcyhlKXtpZih2b2lkIDA9PT1lKXRocm93IG5ldyBSYW5nZUVycm9yKFwiTm8gcmVzb2x1dGlvbiBmb3VuZC5cIik7cmV0dXJuIGV9ZnVuY3Rpb24gdSgpe3RoaXNbbXRdPXt9LHRoaXMuX3JlZ2lzdHJ5PW10fWZ1bmN0aW9uIGwoZSl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsdnQse3ZhbHVlOmV9KSxPYmplY3Qua2V5cyhlKS5mb3JFYWNoKGMsdGhpcyl9ZnVuY3Rpb24gYyhlKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxlLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzW3Z0XVtlXX19KX1mdW5jdGlvbiBmKCl7aS5jYWxsKHRoaXMpO3ZhciBlPXRoaXMucmVnaXN0cnkuZGVsZXRlO3RoaXMucmVnaXN0cnkuZGVsZXRlPWZ1bmN0aW9uKHIpe3ZhciBuPWUuY2FsbCh0aGlzLHIpO3JldHVybiB0Lmhhc093blByb3BlcnR5KHIpJiYhdFtyXS5saW5rUmVjb3JkJiZkZWxldGUgdFtyXSxufTt2YXIgdD17fTt0aGlzW3l0XT17bGFzdFJlZ2lzdGVyOnZvaWQgMCxyZWNvcmRzOnR9LHRoaXMudHJhY2U9ITF9ZnVuY3Rpb24gZChlLHQscil7cmV0dXJuIGUucmVjb3Jkc1t0XT17a2V5OnQscmVnaXN0cmF0aW9uOnIsbW9kdWxlOnZvaWQgMCxpbXBvcnRlclNldHRlcnM6dm9pZCAwLGxpbmtSZWNvcmQ6e2luc3RhbnRpYXRlUHJvbWlzZTp2b2lkIDAsZGVwZW5kZW5jaWVzOnZvaWQgMCxleGVjdXRlOnZvaWQgMCxleGVjdXRpbmdSZXF1aXJlOiExLG1vZHVsZU9iajp2b2lkIDAsc2V0dGVyczp2b2lkIDAsZGVwc0luc3RhbnRpYXRlUHJvbWlzZTp2b2lkIDAsZGVwZW5kZW5jeUluc3RhbnRpYXRpb25zOnZvaWQgMCxsaW5rZWQ6ITEsZXJyb3I6dm9pZCAwfX19ZnVuY3Rpb24gcChlLHQscixuLG8pe3ZhciBpPW5bdF07aWYoaSlyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGkpO3ZhciBhPW8ucmVjb3Jkc1t0XTtyZXR1cm4gYSYmIWEubW9kdWxlP2goZSxhLGEubGlua1JlY29yZCxuLG8pOmUucmVzb2x2ZSh0LHIpLnRoZW4oZnVuY3Rpb24odCl7aWYoaT1uW3RdKXJldHVybiBpO2E9by5yZWNvcmRzW3RdLCghYXx8YS5tb2R1bGUpJiYoYT1kKG8sdCxhJiZhLnJlZ2lzdHJhdGlvbikpO3ZhciByPWEubGlua1JlY29yZDtyZXR1cm4gcj9oKGUsYSxyLG4sbyk6YX0pfWZ1bmN0aW9uIGcoZSx0LHIpe3JldHVybiBmdW5jdGlvbigpe3ZhciBlPXIubGFzdFJlZ2lzdGVyO3JldHVybiBlPyhyLmxhc3RSZWdpc3Rlcj12b2lkIDAsdC5yZWdpc3RyYXRpb249ZSwhMCk6ISF0LnJlZ2lzdHJhdGlvbn19ZnVuY3Rpb24gaChlLHIsbixvLGkpe3JldHVybiBuLmluc3RhbnRpYXRlUHJvbWlzZXx8KG4uaW5zdGFudGlhdGVQcm9taXNlPShyLnJlZ2lzdHJhdGlvbj9Qcm9taXNlLnJlc29sdmUoKTpQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIGkubGFzdFJlZ2lzdGVyPXZvaWQgMCxlW2J0XShyLmtleSxlW2J0XS5sZW5ndGg+MSYmZyhlLHIsaSkpfSkpLnRoZW4oZnVuY3Rpb24odCl7aWYodm9pZCAwIT09dCl7aWYoISh0IGluc3RhbmNlb2YgbCkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkluc3RhbnRpYXRlIGRpZCBub3QgcmV0dXJuIGEgdmFsaWQgTW9kdWxlIG9iamVjdC5cIik7cmV0dXJuIGRlbGV0ZSBpLnJlY29yZHNbci5rZXldLGUudHJhY2UmJnYoZSxyLG4pLG9bci5rZXldPXR9dmFyIGE9ci5yZWdpc3RyYXRpb247aWYoci5yZWdpc3RyYXRpb249dm9pZCAwLCFhKXRocm93IG5ldyBUeXBlRXJyb3IoXCJNb2R1bGUgaW5zdGFudGlhdGlvbiBkaWQgbm90IGNhbGwgYW4gYW5vbnltb3VzIG9yIGNvcnJlY3RseSBuYW1lZCBTeXN0ZW0ucmVnaXN0ZXIuXCIpO3JldHVybiBuLmRlcGVuZGVuY2llcz1hWzBdLHIuaW1wb3J0ZXJTZXR0ZXJzPVtdLG4ubW9kdWxlT2JqPXt9LGFbMl0/KG4ubW9kdWxlT2JqLmRlZmF1bHQ9e30sbi5tb2R1bGVPYmouX191c2VEZWZhdWx0PSEwLG4uZXhlY3V0aW5nUmVxdWlyZT1hWzFdLG4uZXhlY3V0ZT1hWzJdKTpiKGUscixuLGFbMV0pLG4uZGVwZW5kZW5jaWVzLmxlbmd0aHx8KG4ubGlua2VkPSEwLGUudHJhY2UmJnYoZSxyLG4pKSxyfSkuY2F0Y2goZnVuY3Rpb24oZSl7dGhyb3cgbi5lcnJvcj10KGUsXCJJbnN0YW50aWF0aW5nIFwiK3Iua2V5KX0pKX1mdW5jdGlvbiBtKGUsdCxyLG4sbyxpKXtyZXR1cm4gZS5yZXNvbHZlKHQscikudGhlbihmdW5jdGlvbihyKXtpJiYoaVt0XT1yKTt2YXIgYT1vLnJlY29yZHNbcl0scz1uW3JdO2lmKHMmJighYXx8YS5tb2R1bGUmJnMhPT1hLm1vZHVsZSkpcmV0dXJuIHM7KCFhfHwhcyYmYS5tb2R1bGUpJiYoYT1kKG8scixhJiZhLnJlZ2lzdHJhdGlvbikpO3ZhciB1PWEubGlua1JlY29yZDtyZXR1cm4gdT9oKGUsYSx1LG4sbyk6YX0pfWZ1bmN0aW9uIHYoZSx0LHIpe2UubG9hZHM9ZS5sb2Fkc3x8e30sZS5sb2Fkc1t0LmtleV09e2tleTp0LmtleSxkZXBzOnIuZGVwZW5kZW5jaWVzLGR5bmFtaWNEZXBzOltdLGRlcE1hcDpyLmRlcE1hcHx8e319fWZ1bmN0aW9uIHkoZSx0LHIpe2UubG9hZHNbdF0uZHluYW1pY0RlcHMucHVzaChyKX1mdW5jdGlvbiBiKGUsdCxyLG4pe3ZhciBvPXIubW9kdWxlT2JqLGk9dC5pbXBvcnRlclNldHRlcnMsYT0hMSxzPW4uY2FsbChzdCxmdW5jdGlvbihlLHQpe2lmKCFhKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZSlmb3IodmFyIHIgaW4gZSlcIl9fdXNlRGVmYXVsdFwiIT09ciYmKG9bcl09ZVtyXSk7ZWxzZSBvW2VdPXQ7YT0hMDtmb3IodmFyIG49MDtuPGkubGVuZ3RoO24rKylpW25dKG8pO3JldHVybiBhPSExLHR9fSxuZXcgeChlLHQua2V5KSk7ci5zZXR0ZXJzPXMuc2V0dGVycyxyLmV4ZWN1dGU9cy5leGVjdXRlLHMuZXhwb3J0cyYmKHIubW9kdWxlT2JqPW89cy5leHBvcnRzKX1mdW5jdGlvbiB3KGUscixuLG8saSxhKXtyZXR1cm4obi5kZXBzSW5zdGFudGlhdGVQcm9taXNlfHwobi5kZXBzSW5zdGFudGlhdGVQcm9taXNlPVByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKXtmb3IodmFyIHQ9QXJyYXkobi5kZXBlbmRlbmNpZXMubGVuZ3RoKSxhPTA7YTxuLmRlcGVuZGVuY2llcy5sZW5ndGg7YSsrKXRbYV09bShlLG4uZGVwZW5kZW5jaWVzW2FdLHIua2V5LG8saSxlLnRyYWNlJiZuLmRlcE1hcHx8KG4uZGVwTWFwPXt9KSk7cmV0dXJuIFByb21pc2UuYWxsKHQpfSkudGhlbihmdW5jdGlvbihlKXtpZihuLmRlcGVuZGVuY3lJbnN0YW50aWF0aW9ucz1lLG4uc2V0dGVycylmb3IodmFyIHQ9MDt0PGUubGVuZ3RoO3QrKyl7dmFyIHI9bi5zZXR0ZXJzW3RdO2lmKHIpe3ZhciBvPWVbdF07byBpbnN0YW5jZW9mIGw/cihvKToocihvLm1vZHVsZXx8by5saW5rUmVjb3JkLm1vZHVsZU9iaiksby5pbXBvcnRlclNldHRlcnMmJm8uaW1wb3J0ZXJTZXR0ZXJzLnB1c2gocikpfX19KSkpLnRoZW4oZnVuY3Rpb24oKXtmb3IodmFyIHQ9W10scj0wO3I8bi5kZXBlbmRlbmNpZXMubGVuZ3RoO3IrKyl7dmFyIHM9bi5kZXBlbmRlbmN5SW5zdGFudGlhdGlvbnNbcl0sdT1zLmxpbmtSZWNvcmQ7dSYmIXUubGlua2VkJiYtMT09PWEuaW5kZXhPZihzKSYmKGEucHVzaChzKSx0LnB1c2godyhlLHMscy5saW5rUmVjb3JkLG8saSxhKSkpfXJldHVybiBQcm9taXNlLmFsbCh0KX0pLnRoZW4oZnVuY3Rpb24oKXtyZXR1cm4gbi5saW5rZWQ9ITAsZS50cmFjZSYmdihlLHIsbikscn0pLmNhdGNoKGZ1bmN0aW9uKGUpe3Rocm93IGU9dChlLFwiTG9hZGluZyBcIityLmtleSksbi5lcnJvcj1uLmVycm9yfHxlLGV9KX1mdW5jdGlvbiBrKGUsdCl7dmFyIHI9ZVt5dF07ci5yZWNvcmRzW3Qua2V5XT09PXQmJmRlbGV0ZSByLnJlY29yZHNbdC5rZXldO3ZhciBuPXQubGlua1JlY29yZDtuJiZuLmRlcGVuZGVuY3lJbnN0YW50aWF0aW9ucyYmbi5kZXBlbmRlbmN5SW5zdGFudGlhdGlvbnMuZm9yRWFjaChmdW5jdGlvbih0LG8pe2lmKHQmJiEodCBpbnN0YW5jZW9mIGwpJiZ0LmxpbmtSZWNvcmQmJih0LmxpbmtSZWNvcmQuZXJyb3ImJnIucmVjb3Jkc1t0LmtleV09PT10JiZrKGUsdCksbi5zZXR0ZXJzJiZ0LmltcG9ydGVyU2V0dGVycykpe3ZhciBpPXQuaW1wb3J0ZXJTZXR0ZXJzLmluZGV4T2Yobi5zZXR0ZXJzW29dKTt0LmltcG9ydGVyU2V0dGVycy5zcGxpY2UoaSwxKX19KX1mdW5jdGlvbiB4KGUsdCl7dGhpcy5sb2FkZXI9ZSx0aGlzLmtleT10aGlzLmlkPXR9ZnVuY3Rpb24gTyhlLHQscixuLG8saSl7aWYodC5tb2R1bGUpcmV0dXJuIHQubW9kdWxlO2lmKHIuZXJyb3IpdGhyb3cgci5lcnJvcjtpZihpJiYtMSE9PWkuaW5kZXhPZih0KSlyZXR1cm4gdC5saW5rUmVjb3JkLm1vZHVsZU9iajt2YXIgYT1FKGUsdCxyLG4sbyxyLnNldHRlcnM/W106aXx8W10pO2lmKGEpdGhyb3cgayhlLHQpLGE7cmV0dXJuIHQubW9kdWxlfWZ1bmN0aW9uIFMoZSx0LHIsbixvLGksYSl7cmV0dXJuIGZ1bmN0aW9uKHMpe2Zvcih2YXIgdT0wO3U8ci5sZW5ndGg7dSsrKWlmKHJbdV09PT1zKXt2YXIgYyxmPW5bdV07cmV0dXJuIGM9ZiBpbnN0YW5jZW9mIGw/ZjpPKGUsZixmLmxpbmtSZWNvcmQsbyxpLGEpLGMuX191c2VEZWZhdWx0P2MuZGVmYXVsdDpjfXRocm93IG5ldyBFcnJvcihcIk1vZHVsZSBcIitzK1wiIG5vdCBkZWNsYXJlZCBhcyBhIFN5c3RlbS5yZWdpc3RlckR5bmFtaWMgZGVwZW5kZW5jeSBvZiBcIit0KX19ZnVuY3Rpb24gRShlLHIsbixvLGksYSl7YS5wdXNoKHIpO3ZhciBzO2lmKG4uc2V0dGVycylmb3IodmFyIHUsYyxmPTA7ZjxuLmRlcGVuZGVuY2llcy5sZW5ndGg7ZisrKWlmKHU9bi5kZXBlbmRlbmN5SW5zdGFudGlhdGlvbnNbZl0sISh1IGluc3RhbmNlb2YgbCkmJihjPXUubGlua1JlY29yZCxjJiYtMT09PWEuaW5kZXhPZih1KSYmKHM9Yy5lcnJvcj9jLmVycm9yOkUoZSx1LGMsbyxpLGMuc2V0dGVycz9hOltdKSkscykpcmV0dXJuIG4uZXJyb3I9dChzLFwiRXZhbHVhdGluZyBcIityLmtleSk7aWYobi5leGVjdXRlKWlmKG4uc2V0dGVycylzPWoobi5leGVjdXRlKTtlbHNle3ZhciBkPXtpZDpyLmtleX0scD1uLm1vZHVsZU9iajtPYmplY3QuZGVmaW5lUHJvcGVydHkoZCxcImV4cG9ydHNcIix7Y29uZmlndXJhYmxlOiEwLHNldDpmdW5jdGlvbihlKXtwLmRlZmF1bHQ9ZX0sZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHAuZGVmYXVsdH19KTt2YXIgZz1TKGUsci5rZXksbi5kZXBlbmRlbmNpZXMsbi5kZXBlbmRlbmN5SW5zdGFudGlhdGlvbnMsbyxpLGEpO2lmKCFuLmV4ZWN1dGluZ1JlcXVpcmUpZm9yKHZhciBmPTA7ZjxuLmRlcGVuZGVuY2llcy5sZW5ndGg7ZisrKWcobi5kZXBlbmRlbmNpZXNbZl0pO3M9XyhuLmV4ZWN1dGUsZyxwLmRlZmF1bHQsZCksZC5leHBvcnRzIT09cC5kZWZhdWx0JiYocC5kZWZhdWx0PWQuZXhwb3J0cyk7dmFyIGg9cC5kZWZhdWx0O2lmKGgmJmguX19lc01vZHVsZSl7cC5fX3VzZURlZmF1bHQmJmRlbGV0ZSBwLl9fdXNlRGVmYXVsdDtmb3IodmFyIG0gaW4gaClPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChoLG0pJiYocFttXT1oW21dKTtwLl9fZXNNb2R1bGU9ITB9fWlmKHMpcmV0dXJuIG4uZXJyb3I9dChzLFwiRXZhbHVhdGluZyBcIityLmtleSk7aWYob1tyLmtleV09ci5tb2R1bGU9bmV3IGwobi5tb2R1bGVPYmopLCFuLnNldHRlcnMpe2lmKHIuaW1wb3J0ZXJTZXR0ZXJzKWZvcih2YXIgZj0wO2Y8ci5pbXBvcnRlclNldHRlcnMubGVuZ3RoO2YrKylyLmltcG9ydGVyU2V0dGVyc1tmXShyLm1vZHVsZSk7ci5pbXBvcnRlclNldHRlcnM9dm9pZCAwfXIubGlua1JlY29yZD12b2lkIDB9ZnVuY3Rpb24gaihlKXt0cnl7ZS5jYWxsKHd0KX1jYXRjaChlKXtyZXR1cm4gZX19ZnVuY3Rpb24gXyhlLHQscixuKXt0cnl7dmFyIG89ZS5jYWxsKHN0LHQscixuKTt2b2lkIDAhPT1vJiYobi5leHBvcnRzPW8pfWNhdGNoKGUpe3JldHVybiBlfX1mdW5jdGlvbiBSKCl7fWZ1bmN0aW9uIE0oZSl7cmV0dXJuIGUgaW5zdGFuY2VvZiBsP2U6bmV3IGwoZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZSxfX3VzZURlZmF1bHQ6ITB9KX1mdW5jdGlvbiBQKGUpe3JldHVybiB2b2lkIDA9PT1rdCYmKGt0PVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJiEhU3ltYm9sLnRvU3RyaW5nVGFnKSxlIGluc3RhbmNlb2YgbHx8a3QmJlwiW29iamVjdCBNb2R1bGVdXCI9PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKX1mdW5jdGlvbiBDKGUsdCl7KHR8fHRoaXMud2FybmluZ3MmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBjb25zb2xlJiZjb25zb2xlLndhcm4pJiZjb25zb2xlLndhcm4oZSl9ZnVuY3Rpb24gTChlLHQpe2lmKFwiLlwiPT09ZVswXSl0aHJvdyBuZXcgRXJyb3IoXCJOb2RlIG1vZHVsZSBcIitlK1wiIGNhbid0IGJlIGxvYWRlZCBhcyBpdCBpcyBub3QgYSBwYWNrYWdlIHJlcXVpcmUuXCIpO2lmKCF4dCl7dmFyIHI9dGhpcy5fbm9kZVJlcXVpcmUoXCJtb2R1bGVcIiksbj10LnN1YnN0cihhdD84OjcpO3h0PW5ldyByKG4pLHh0LnBhdGhzPXIuX25vZGVNb2R1bGVQYXRocyhuKX1yZXR1cm4geHQucmVxdWlyZShlKX1mdW5jdGlvbiBBKGUsdCl7Zm9yKHZhciByIGluIHQpT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodCxyKSYmKGVbcl09dFtyXSk7cmV0dXJuIGV9ZnVuY3Rpb24gSShlLHQpe2Zvcih2YXIgciBpbiB0KU9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQscikmJnZvaWQgMD09PWVbcl0mJihlW3JdPXRbcl0pO3JldHVybiBlfWZ1bmN0aW9uIEYoZSx0LHIpe2Zvcih2YXIgbiBpbiB0KWlmKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbikpe3ZhciBvPXRbbl07dm9pZCAwPT09ZVtuXT9lW25dPW86byBpbnN0YW5jZW9mIEFycmF5JiZlW25daW5zdGFuY2VvZiBBcnJheT9lW25dPVtdLmNvbmNhdChyP286ZVtuXSkuY29uY2F0KHI/ZVtuXTpvKTpcIm9iamVjdFwiPT10eXBlb2YgbyYmbnVsbCE9PW8mJlwib2JqZWN0XCI9PXR5cGVvZiBlW25dP2Vbbl09KHI/STpBKShBKHt9LGVbbl0pLG8pOnJ8fChlW25dPW8pfX1mdW5jdGlvbiBLKGUpe2lmKCFSdCYmIU10KXt2YXIgdD1uZXcgSW1hZ2U7cmV0dXJuIHZvaWQodC5zcmM9ZSl9dmFyIHI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7UnQ/KHIucmVsPVwicHJlbG9hZFwiLHIuYXM9XCJzY3JpcHRcIik6ci5yZWw9XCJwcmVmZXRjaFwiLHIuaHJlZj1lLGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQociksZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChyKX1mdW5jdGlvbiBEKGUsdCxyKXt0cnl7aW1wb3J0U2NyaXB0cyhlKX1jYXRjaChlKXtyKGUpfXQoKX1mdW5jdGlvbiBxKGUsdCxyLG4sbyl7ZnVuY3Rpb24gaSgpe24oKSxzKCl9ZnVuY3Rpb24gYSh0KXtzKCksbyhuZXcgRXJyb3IoXCJGZXRjaGluZyBcIitlKSl9ZnVuY3Rpb24gcygpe2Zvcih2YXIgZT0wO2U8UHQubGVuZ3RoO2UrKylpZihQdFtlXS5lcnI9PT1hKXtQdC5zcGxpY2UoZSwxKTticmVha311LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsaSwhMSksdS5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JcIixhLCExKSxkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKHUpfWlmKGU9ZS5yZXBsYWNlKC8jL2csXCIlMjNcIiksX3QpcmV0dXJuIEQoZSxuLG8pO3ZhciB1PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7dS50eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIsdS5jaGFyc2V0PVwidXRmLThcIix1LmFzeW5jPSEwLHQmJih1LmNyb3NzT3JpZ2luPXQpLHImJih1LmludGVncml0eT1yKSx1LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsaSwhMSksdS5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIixhLCExKSx1LnNyYz1lLGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQodSl9ZnVuY3Rpb24gVChlLHQpe2Zvcih2YXIgcj1lLnNwbGl0KFwiLlwiKTtyLmxlbmd0aDspdD10W3Iuc2hpZnQoKV07cmV0dXJuIHR9ZnVuY3Rpb24gVShlLHQscil7dmFyIG89Tih0LHIpO2lmKG8pe3ZhciBpPXRbb10rci5zdWJzdHIoby5sZW5ndGgpLGE9bihpLG50KTtyZXR1cm4gdm9pZCAwIT09YT9hOmUraX1yZXR1cm4tMSE9PXIuaW5kZXhPZihcIjpcIik/cjplK3J9ZnVuY3Rpb24geihlKXt2YXIgdD10aGlzLm5hbWU7aWYodC5zdWJzdHIoMCxlLmxlbmd0aCk9PT1lJiYodC5sZW5ndGg9PT1lLmxlbmd0aHx8XCIvXCI9PT10W2UubGVuZ3RoXXx8XCIvXCI9PT1lW2UubGVuZ3RoLTFdfHxcIjpcIj09PWVbZS5sZW5ndGgtMV0pKXt2YXIgcj1lLnNwbGl0KFwiL1wiKS5sZW5ndGg7cj50aGlzLmxlbiYmKHRoaXMubWF0Y2g9ZSx0aGlzLmxlbj1yKX19ZnVuY3Rpb24gTihlLHQpe2lmKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGUsdCkpcmV0dXJuIHQ7dmFyIHI9e25hbWU6dCxtYXRjaDp2b2lkIDAsbGVuOjB9O3JldHVybiBPYmplY3Qua2V5cyhlKS5mb3JFYWNoKHosciksci5tYXRjaH1mdW5jdGlvbiBKKGUsdCxyLG4pe2lmKFwiZmlsZTovLy9cIj09PWUuc3Vic3RyKDAsOCkpe2lmKEZ0KXJldHVybiAkKGUsdCxyLG4pO3Rocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBmZXRjaCBmaWxlIFVSTHMgaW4gdGhpcyBlbnZpcm9ubWVudC5cIil9ZT1lLnJlcGxhY2UoLyMvZyxcIiUyM1wiKTt2YXIgbz17aGVhZGVyczp7QWNjZXB0OlwiYXBwbGljYXRpb24veC1lcy1tb2R1bGUsICovKlwifX07cmV0dXJuIHImJihvLmludGVncml0eT1yKSx0JiYoXCJzdHJpbmdcIj09dHlwZW9mIHQmJihvLmhlYWRlcnMuQXV0aG9yaXphdGlvbj10KSxvLmNyZWRlbnRpYWxzPVwiaW5jbHVkZVwiKSxmZXRjaChlLG8pLnRoZW4oZnVuY3Rpb24oZSl7aWYoZS5vaylyZXR1cm4gbj9lLmFycmF5QnVmZmVyKCk6ZS50ZXh0KCk7dGhyb3cgbmV3IEVycm9yKFwiRmV0Y2ggZXJyb3I6IFwiK2Uuc3RhdHVzK1wiIFwiK2Uuc3RhdHVzVGV4dCl9KX1mdW5jdGlvbiAkKGUsdCxyLG4pe3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyLG8pe2Z1bmN0aW9uIGkoKXtyKG4/cy5yZXNwb25zZTpzLnJlc3BvbnNlVGV4dCl9ZnVuY3Rpb24gYSgpe28obmV3IEVycm9yKFwiWEhSIGVycm9yOiBcIisocy5zdGF0dXM/XCIgKFwiK3Muc3RhdHVzKyhzLnN0YXR1c1RleHQ/XCIgXCIrcy5zdGF0dXNUZXh0OlwiXCIpK1wiKVwiOlwiXCIpK1wiIGxvYWRpbmcgXCIrZSkpfWU9ZS5yZXBsYWNlKC8jL2csXCIlMjNcIik7dmFyIHM9bmV3IFhNTEh0dHBSZXF1ZXN0O24mJihzLnJlc3BvbnNlVHlwZT1cImFycmF5YnVmZmVyXCIpLHMub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7ND09PXMucmVhZHlTdGF0ZSYmKDA9PXMuc3RhdHVzP3MucmVzcG9uc2U/aSgpOihzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLGEpLHMuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixpKSk6MjAwPT09cy5zdGF0dXM/aSgpOmEoKSl9LHMub3BlbihcIkdFVFwiLGUsITApLHMuc2V0UmVxdWVzdEhlYWRlciYmKHMuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLFwiYXBwbGljYXRpb24veC1lcy1tb2R1bGUsICovKlwiKSx0JiYoXCJzdHJpbmdcIj09dHlwZW9mIHQmJnMuc2V0UmVxdWVzdEhlYWRlcihcIkF1dGhvcml6YXRpb25cIix0KSxzLndpdGhDcmVkZW50aWFscz0hMCkpLHMuc2VuZChudWxsKX0pfWZ1bmN0aW9uIEIoZSx0LHIsbil7cmV0dXJuXCJmaWxlOi8vL1wiIT1lLnN1YnN0cigwLDgpP1Byb21pc2UucmVqZWN0KG5ldyBFcnJvcignVW5hYmxlIHRvIGZldGNoIFwiJytlKydcIi4gT25seSBmaWxlIFVSTHMgb2YgdGhlIGZvcm0gZmlsZTovLy8gc3VwcG9ydGVkIHJ1bm5pbmcgaW4gTm9kZS4nKSk6KEx0PUx0fHxyZXF1aXJlKFwiZnNcIiksZT1hdD9lLnJlcGxhY2UoL1xcLy9nLFwiXFxcXFwiKS5zdWJzdHIoOCk6ZS5zdWJzdHIoNyksbmV3IFByb21pc2UoZnVuY3Rpb24odCxyKXtMdC5yZWFkRmlsZShlLGZ1bmN0aW9uKGUsbyl7aWYoZSlyZXR1cm4gcihlKTtpZihuKXQobyk7ZWxzZXt2YXIgaT1vK1wiXCI7XCJcXHVmZWZmXCI9PT1pWzBdJiYoaT1pLnN1YnN0cigxKSksdChpKX19KX0pKX1mdW5jdGlvbiBXKCl7dGhyb3cgbmV3IEVycm9yKFwiTm8gZmV0Y2ggbWV0aG9kIGlzIGRlZmluZWQgZm9yIHRoaXMgZW52aXJvbm1lbnQuXCIpfWZ1bmN0aW9uIEcoKXtyZXR1cm57cGx1Z2luS2V5OnZvaWQgMCxwbHVnaW5Bcmd1bWVudDp2b2lkIDAscGx1Z2luTW9kdWxlOnZvaWQgMCxwYWNrYWdlS2V5OnZvaWQgMCxwYWNrYWdlQ29uZmlnOnZvaWQgMCxsb2FkOnZvaWQgMH19ZnVuY3Rpb24gSChlLHQscil7dmFyIG49RygpO2lmKHIpe3ZhciBvO3QucGx1Z2luRmlyc3Q/LTEhPT0obz1yLmxhc3RJbmRleE9mKFwiIVwiKSkmJihuLnBsdWdpbkFyZ3VtZW50PW4ucGx1Z2luS2V5PXIuc3Vic3RyKDAsbykpOi0xIT09KG89ci5pbmRleE9mKFwiIVwiKSkmJihuLnBsdWdpbkFyZ3VtZW50PW4ucGx1Z2luS2V5PXIuc3Vic3RyKG8rMSkpLG4ucGFja2FnZUtleT1OKHQucGFja2FnZXMsciksbi5wYWNrYWdlS2V5JiYobi5wYWNrYWdlQ29uZmlnPXQucGFja2FnZXNbbi5wYWNrYWdlS2V5XSl9cmV0dXJuIG59ZnVuY3Rpb24gWihlLHQpe3ZhciByPXRoaXNbRXRdLG49RygpLG89SCh0aGlzLHIsdCksaT10aGlzO3JldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCl7dmFyIHI9ZS5sYXN0SW5kZXhPZihcIiM/XCIpO2lmKC0xPT09cilyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGUpO3ZhciBuPWhlLmNhbGwoaSxlLnN1YnN0cihyKzIpKTtyZXR1cm4gbWUuY2FsbChpLG4sdCwhMCkudGhlbihmdW5jdGlvbih0KXtyZXR1cm4gdD9lLnN1YnN0cigwLHIpOlwiQGVtcHR5XCJ9KX0pLnRoZW4oZnVuY3Rpb24oZSl7dmFyIGE9bmUoci5wbHVnaW5GaXJzdCxlKTtyZXR1cm4gYT8obi5wbHVnaW5LZXk9YS5wbHVnaW4sUHJvbWlzZS5hbGwoW2VlLmNhbGwoaSxyLGEuYXJndW1lbnQsbyYmby5wbHVnaW5Bcmd1bWVudHx8dCxuLG8sITApLGkucmVzb2x2ZShhLnBsdWdpbix0KV0pLnRoZW4oZnVuY3Rpb24oZSl7aWYobi5wbHVnaW5Bcmd1bWVudD1lWzBdLG4ucGx1Z2luS2V5PWVbMV0sbi5wbHVnaW5Bcmd1bWVudD09PW4ucGx1Z2luS2V5KXRocm93IG5ldyBFcnJvcihcIlBsdWdpbiBcIituLnBsdWdpbkFyZ3VtZW50K1wiIGNhbm5vdCBsb2FkIGl0c2VsZiwgbWFrZSBzdXJlIGl0IGlzIGV4Y2x1ZGVkIGZyb20gYW55IHdpbGRjYXJkIG1ldGEgY29uZmlndXJhdGlvbiB2aWEgYSBjdXN0b20gbG9hZGVyOiBmYWxzZSBydWxlLlwiKTtyZXR1cm4gb2Uoci5wbHVnaW5GaXJzdCxlWzBdLGVbMV0pfSkpOmVlLmNhbGwoaSxyLGUsbyYmby5wbHVnaW5Bcmd1bWVudHx8dCxuLG8sITEpfSkudGhlbihmdW5jdGlvbihlKXtyZXR1cm4gdmUuY2FsbChpLGUsdCxvKX0pLnRoZW4oZnVuY3Rpb24oZSl7cmV0dXJuIHJlLmNhbGwoaSxyLGUsbiksbi5wbHVnaW5LZXl8fCFuLmxvYWQubG9hZGVyP2U6aS5yZXNvbHZlKG4ubG9hZC5sb2FkZXIsZSkudGhlbihmdW5jdGlvbih0KXtyZXR1cm4gbi5wbHVnaW5LZXk9dCxuLnBsdWdpbkFyZ3VtZW50PWUsZX0pfSkudGhlbihmdW5jdGlvbihlKXtyZXR1cm4gaVtqdF1bZV09bixlfSl9ZnVuY3Rpb24gWChlLHQpe3ZhciByPW5lKGUucGx1Z2luRmlyc3QsdCk7aWYocil7dmFyIG49WC5jYWxsKHRoaXMsZSxyLnBsdWdpbik7cmV0dXJuIG9lKGUucGx1Z2luRmlyc3QsUS5jYWxsKHRoaXMsZSxyLmFyZ3VtZW50LHZvaWQgMCwhMSwhMSksbil9cmV0dXJuIFEuY2FsbCh0aGlzLGUsdCx2b2lkIDAsITEsITEpfWZ1bmN0aW9uIFkoZSx0KXt2YXIgcj10aGlzW0V0XSxuPUcoKSxvPW98fEgodGhpcyxyLHQpLGk9bmUoci5wbHVnaW5GaXJzdCxlKTtyZXR1cm4gaT8obi5wbHVnaW5LZXk9WS5jYWxsKHRoaXMsaS5wbHVnaW4sdCksb2Uoci5wbHVnaW5GaXJzdCxWLmNhbGwodGhpcyxyLGkuYXJndW1lbnQsby5wbHVnaW5Bcmd1bWVudHx8dCxuLG8sISFuLnBsdWdpbktleSksbi5wbHVnaW5LZXkpKTpWLmNhbGwodGhpcyxyLGUsby5wbHVnaW5Bcmd1bWVudHx8dCxuLG8sISFuLnBsdWdpbktleSl9ZnVuY3Rpb24gUShlLHQscixvLGkpe3ZhciBhPW4odCxyfHxudCk7aWYoYSlyZXR1cm4gVShlLmJhc2VVUkwsZS5wYXRocyxhKTtpZihvKXt2YXIgcz1OKGUubWFwLHQpO2lmKHMmJih0PWUubWFwW3NdK3Quc3Vic3RyKHMubGVuZ3RoKSxhPW4odCxudCkpKXJldHVybiBVKGUuYmFzZVVSTCxlLnBhdGhzLGEpfWlmKHRoaXMucmVnaXN0cnkuaGFzKHQpKXJldHVybiB0O2lmKFwiQG5vZGUvXCI9PT10LnN1YnN0cigwLDYpKXJldHVybiB0O3ZhciB1PWkmJlwiL1wiIT09dFt0Lmxlbmd0aC0xXSxsPVUoZS5iYXNlVVJMLGUucGF0aHMsdT90K1wiL1wiOnQpO3JldHVybiB1P2wuc3Vic3RyKDAsbC5sZW5ndGgtMSk6bH1mdW5jdGlvbiBWKGUsdCxyLG4sbyxpKXtpZihvJiZvLnBhY2thZ2VDb25maWcmJlwiLlwiIT09dFswXSl7dmFyIGE9by5wYWNrYWdlQ29uZmlnLm1hcCxzPWEmJk4oYSx0KTtpZihzJiZcInN0cmluZ1wiPT10eXBlb2YgYVtzXSl7dmFyIHU9dWUodGhpcyxlLG8ucGFja2FnZUNvbmZpZyxvLnBhY2thZ2VLZXkscyx0LG4saSk7aWYodSlyZXR1cm4gdX19dmFyIGw9US5jYWxsKHRoaXMsZSx0LHIsITAsITApLGM9ZGUoZSxsKTtpZihuLnBhY2thZ2VLZXk9YyYmYy5wYWNrYWdlS2V5fHxOKGUucGFja2FnZXMsbCksIW4ucGFja2FnZUtleSlyZXR1cm4gbDtpZigtMSE9PWUucGFja2FnZUNvbmZpZ0tleXMuaW5kZXhPZihsKSlyZXR1cm4gbi5wYWNrYWdlS2V5PXZvaWQgMCxsO24ucGFja2FnZUNvbmZpZz1lLnBhY2thZ2VzW24ucGFja2FnZUtleV18fChlLnBhY2thZ2VzW24ucGFja2FnZUtleV09T2UoKSk7dmFyIGY9bC5zdWJzdHIobi5wYWNrYWdlS2V5Lmxlbmd0aCsxKTtyZXR1cm4gYWUodGhpcyxlLG4ucGFja2FnZUNvbmZpZyxuLnBhY2thZ2VLZXksZixuLGkpfWZ1bmN0aW9uIGVlKGUsdCxyLG4sbyxpKXt2YXIgYT10aGlzO3JldHVybiBPdC50aGVuKGZ1bmN0aW9uKCl7aWYobyYmby5wYWNrYWdlQ29uZmlnJiZcIi4vXCIhPT10LnN1YnN0cigwLDIpKXt2YXIgcj1vLnBhY2thZ2VDb25maWcubWFwLHM9ciYmTihyLHQpO2lmKHMpcmV0dXJuIGNlKGEsZSxvLnBhY2thZ2VDb25maWcsby5wYWNrYWdlS2V5LHMsdCxuLGkpfXJldHVybiBPdH0pLnRoZW4oZnVuY3Rpb24obyl7aWYobylyZXR1cm4gbzt2YXIgcz1RLmNhbGwoYSxlLHQsciwhMCwhMCksdT1kZShlLHMpO2lmKG4ucGFja2FnZUtleT11JiZ1LnBhY2thZ2VLZXl8fE4oZS5wYWNrYWdlcyxzKSwhbi5wYWNrYWdlS2V5KXJldHVybiBQcm9taXNlLnJlc29sdmUocyk7aWYoLTEhPT1lLnBhY2thZ2VDb25maWdLZXlzLmluZGV4T2YocykpcmV0dXJuIG4ucGFja2FnZUtleT12b2lkIDAsbi5sb2FkPXRlKCksbi5sb2FkLmZvcm1hdD1cImpzb25cIixuLmxvYWQubG9hZGVyPVwiXCIsUHJvbWlzZS5yZXNvbHZlKHMpO24ucGFja2FnZUNvbmZpZz1lLnBhY2thZ2VzW24ucGFja2FnZUtleV18fChlLnBhY2thZ2VzW24ucGFja2FnZUtleV09T2UoKSk7dmFyIGw9dSYmIW4ucGFja2FnZUNvbmZpZy5jb25maWd1cmVkO3JldHVybihsP3BlKGEsZSx1LmNvbmZpZ1BhdGgsbik6T3QpLnRoZW4oZnVuY3Rpb24oKXt2YXIgdD1zLnN1YnN0cihuLnBhY2thZ2VLZXkubGVuZ3RoKzEpO3JldHVybiBsZShhLGUsbi5wYWNrYWdlQ29uZmlnLG4ucGFja2FnZUtleSx0LG4saSl9KX0pfWZ1bmN0aW9uIHRlKCl7cmV0dXJue2V4dGVuc2lvbjpcIlwiLGRlcHM6dm9pZCAwLGZvcm1hdDp2b2lkIDAsbG9hZGVyOnZvaWQgMCxzY3JpcHRMb2FkOnZvaWQgMCxnbG9iYWxzOnZvaWQgMCxub25jZTp2b2lkIDAsaW50ZWdyaXR5OnZvaWQgMCxzb3VyY2VNYXA6dm9pZCAwLGV4cG9ydHM6dm9pZCAwLGVuY2Fwc3VsYXRlR2xvYmFsOiExLGNyb3NzT3JpZ2luOnZvaWQgMCxjanNSZXF1aXJlRGV0ZWN0aW9uOiEwLGNqc0RlZmVyRGVwc0V4ZWN1dGU6ITEsZXNNb2R1bGU6ITF9fWZ1bmN0aW9uIHJlKGUsdCxyKXtyLmxvYWQ9ci5sb2FkfHx0ZSgpO3ZhciBuLG89MDtmb3IodmFyIGkgaW4gZS5tZXRhKWlmKG49aS5pbmRleE9mKFwiKlwiKSwtMSE9PW4mJmkuc3Vic3RyKDAsbik9PT10LnN1YnN0cigwLG4pJiZpLnN1YnN0cihuKzEpPT09dC5zdWJzdHIodC5sZW5ndGgtaS5sZW5ndGgrbisxKSl7dmFyIGE9aS5zcGxpdChcIi9cIikubGVuZ3RoO2E+byYmKG89YSksRihyLmxvYWQsZS5tZXRhW2ldLG8hPT1hKX1pZihlLm1ldGFbdF0mJkYoci5sb2FkLGUubWV0YVt0XSwhMSksci5wYWNrYWdlS2V5KXt2YXIgcz10LnN1YnN0cihyLnBhY2thZ2VLZXkubGVuZ3RoKzEpLHU9e307aWYoci5wYWNrYWdlQ29uZmlnLm1ldGEpe3ZhciBvPTA7Z2Uoci5wYWNrYWdlQ29uZmlnLm1ldGEscyxmdW5jdGlvbihlLHQscil7cj5vJiYobz1yKSxGKHUsdCxyJiZvPnIpfSksRihyLmxvYWQsdSwhMSl9IXIucGFja2FnZUNvbmZpZy5mb3JtYXR8fHIucGx1Z2luS2V5fHxyLmxvYWQubG9hZGVyfHwoci5sb2FkLmZvcm1hdD1yLmxvYWQuZm9ybWF0fHxyLnBhY2thZ2VDb25maWcuZm9ybWF0KX19ZnVuY3Rpb24gbmUoZSx0KXt2YXIgcixuLG89ZT90LmluZGV4T2YoXCIhXCIpOnQubGFzdEluZGV4T2YoXCIhXCIpO3JldHVybi0xIT09bz8oZT8ocj10LnN1YnN0cihvKzEpLG49dC5zdWJzdHIoMCxvKSk6KHI9dC5zdWJzdHIoMCxvKSxuPXQuc3Vic3RyKG8rMSl8fHIuc3Vic3RyKHIubGFzdEluZGV4T2YoXCIuXCIpKzEpKSx7YXJndW1lbnQ6cixwbHVnaW46bn0pOnZvaWQgMH1mdW5jdGlvbiBvZShlLHQscil7cmV0dXJuIGU/citcIiFcIit0OnQrXCIhXCIrcn1mdW5jdGlvbiBpZShlLHQscixuLG8pe2lmKCFufHwhdC5kZWZhdWx0RXh0ZW5zaW9ufHxcIi9cIj09PW5bbi5sZW5ndGgtMV18fG8pcmV0dXJuIG47dmFyIGk9ITE7aWYodC5tZXRhJiZnZSh0Lm1ldGEsbixmdW5jdGlvbihlLHQscil7cmV0dXJuIDA9PT1yfHxlLmxhc3RJbmRleE9mKFwiKlwiKSE9PWUubGVuZ3RoLTE/aT0hMDp2b2lkIDB9KSwhaSYmZS5tZXRhJiZnZShlLm1ldGEscitcIi9cIituLGZ1bmN0aW9uKGUsdCxyKXtyZXR1cm4gMD09PXJ8fGUubGFzdEluZGV4T2YoXCIqXCIpIT09ZS5sZW5ndGgtMT9pPSEwOnZvaWQgMH0pLGkpcmV0dXJuIG47dmFyIGE9XCIuXCIrdC5kZWZhdWx0RXh0ZW5zaW9uO3JldHVybiBuLnN1YnN0cihuLmxlbmd0aC1hLmxlbmd0aCkhPT1hP24rYTpufWZ1bmN0aW9uIGFlKGUsdCxyLG4sbyxpLGEpe2lmKCFvKXtpZighci5tYWluKXJldHVybiBuO289XCIuL1wiPT09ci5tYWluLnN1YnN0cigwLDIpP3IubWFpbi5zdWJzdHIoMik6ci5tYWlufWlmKHIubWFwKXt2YXIgcz1cIi4vXCIrbyx1PU4oci5tYXAscyk7aWYodXx8KHM9XCIuL1wiK2llKGUscixuLG8sYSkscyE9PVwiLi9cIitvJiYodT1OKHIubWFwLHMpKSksdSl7dmFyIGw9dWUoZSx0LHIsbix1LHMsaSxhKTtpZihsKXJldHVybiBsfX1yZXR1cm4gbitcIi9cIitpZShlLHIsbixvLGEpfWZ1bmN0aW9uIHNlKGUsdCxyKXtyZXR1cm4gdC5zdWJzdHIoMCxlLmxlbmd0aCk9PT1lJiZyLmxlbmd0aD5lLmxlbmd0aD8hMTohMH1mdW5jdGlvbiB1ZShlLHQscixuLG8saSxhLHMpe1wiL1wiPT09aVtpLmxlbmd0aC0xXSYmKGk9aS5zdWJzdHIoMCxpLmxlbmd0aC0xKSk7dmFyIHU9ci5tYXBbb107aWYoXCJvYmplY3RcIj09dHlwZW9mIHUpdGhyb3cgbmV3IEVycm9yKFwiU3luY2hyb25vdXMgY29uZGl0aW9uYWwgbm9ybWFsaXphdGlvbiBub3Qgc3VwcG9ydGVkIHN5bmMgbm9ybWFsaXppbmcgXCIrbytcIiBpbiBcIituKTtpZihzZShvLHUsaSkmJlwic3RyaW5nXCI9PXR5cGVvZiB1KXJldHVybiBWLmNhbGwodGhpcyx0LHUraS5zdWJzdHIoby5sZW5ndGgpLG4rXCIvXCIsYSxhLHMpfWZ1bmN0aW9uIGxlKGUsdCxyLG4sbyxpLGEpe2lmKCFvKXtpZighci5tYWluKXJldHVybiBQcm9taXNlLnJlc29sdmUobik7bz1cIi4vXCI9PT1yLm1haW4uc3Vic3RyKDAsMik/ci5tYWluLnN1YnN0cigyKTpyLm1haW59dmFyIHMsdTtyZXR1cm4gci5tYXAmJihzPVwiLi9cIitvLHU9TihyLm1hcCxzKSx1fHwocz1cIi4vXCIraWUoZSxyLG4sbyxhKSxzIT09XCIuL1wiK28mJih1PU4oci5tYXAscykpKSksKHU/Y2UoZSx0LHIsbix1LHMsaSxhKTpPdCkudGhlbihmdW5jdGlvbih0KXtyZXR1cm4gdD9Qcm9taXNlLnJlc29sdmUodCk6UHJvbWlzZS5yZXNvbHZlKG4rXCIvXCIraWUoZSxyLG4sbyxhKSl9KX1mdW5jdGlvbiBjZShlLHQscixuLG8saSxhLHMpe1wiL1wiPT09aVtpLmxlbmd0aC0xXSYmKGk9aS5zdWJzdHIoMCxpLmxlbmd0aC0xKSk7dmFyIHU9ci5tYXBbb107aWYoXCJzdHJpbmdcIj09dHlwZW9mIHUpcmV0dXJuIHNlKG8sdSxpKT9lZS5jYWxsKGUsdCx1K2kuc3Vic3RyKG8ubGVuZ3RoKSxuK1wiL1wiLGEsYSxzKS50aGVuKGZ1bmN0aW9uKHQpe3JldHVybiB2ZS5jYWxsKGUsdCxuK1wiL1wiLGEpfSk6T3Q7dmFyIGw9W10sYz1bXTtmb3IodmFyIGQgaW4gdSl7dmFyIHA9aGUoZCk7Yy5wdXNoKHtjb25kaXRpb246cCxtYXA6dVtkXX0pLGwucHVzaChmLnByb3RvdHlwZS5pbXBvcnQuY2FsbChlLHAubW9kdWxlLG4pKX1yZXR1cm4gUHJvbWlzZS5hbGwobCkudGhlbihmdW5jdGlvbihlKXtmb3IodmFyIHQ9MDt0PGMubGVuZ3RoO3QrKyl7dmFyIHI9Y1t0XS5jb25kaXRpb24sbj1UKHIucHJvcCxlW3RdLl9fdXNlRGVmYXVsdD9lW3RdLmRlZmF1bHQ6ZVt0XSk7aWYoIXIubmVnYXRlJiZufHxyLm5lZ2F0ZSYmIW4pcmV0dXJuIGNbdF0ubWFwfX0pLnRoZW4oZnVuY3Rpb24ocil7cmV0dXJuIHI/c2UobyxyLGkpP2VlLmNhbGwoZSx0LHIraS5zdWJzdHIoby5sZW5ndGgpLG4rXCIvXCIsYSxhLHMpLnRoZW4oZnVuY3Rpb24odCl7cmV0dXJuIHZlLmNhbGwoZSx0LG4rXCIvXCIsYSl9KTpPdDp2b2lkIDB9KX1mdW5jdGlvbiBmZShlKXt2YXIgdD1lLmxhc3RJbmRleE9mKFwiKlwiKSxyPU1hdGgubWF4KHQrMSxlLmxhc3RJbmRleE9mKFwiL1wiKSk7cmV0dXJue2xlbmd0aDpyLHJlZ0V4Om5ldyBSZWdFeHAoXCJeKFwiK2Uuc3Vic3RyKDAscikucmVwbGFjZSgvWy4rP14ke30oKXxbXFxdXFxcXF0vZyxcIlxcXFwkJlwiKS5yZXBsYWNlKC9cXCovZyxcIlteXFxcXC9dK1wiKStcIikoXFxcXC98JClcIiksd2lsZGNhcmQ6LTEhPT10fX1mdW5jdGlvbiBkZShlLHQpe2Zvcih2YXIgcixuLG89ITEsaT0wO2k8ZS5wYWNrYWdlQ29uZmlnUGF0aHMubGVuZ3RoO2krKyl7dmFyIGE9ZS5wYWNrYWdlQ29uZmlnUGF0aHNbaV0scz1EdFthXXx8KER0W2FdPWZlKGEpKTtpZighKHQubGVuZ3RoPHMubGVuZ3RoKSl7dmFyIHU9dC5tYXRjaChzLnJlZ0V4KTshdXx8ciYmKG8mJnMud2lsZGNhcmR8fCEoci5sZW5ndGg8dVsxXS5sZW5ndGgpKXx8KHI9dVsxXSxvPSFzLndpbGRjYXJkLG49cithLnN1YnN0cihzLmxlbmd0aCkpfX1yZXR1cm4gcj97cGFja2FnZUtleTpyLGNvbmZpZ1BhdGg6bn06dm9pZCAwfWZ1bmN0aW9uIHBlKGUscixuLG8saSl7dmFyIGE9ZS5wbHVnaW5Mb2FkZXJ8fGU7cmV0dXJuLTE9PT1yLnBhY2thZ2VDb25maWdLZXlzLmluZGV4T2YobikmJnIucGFja2FnZUNvbmZpZ0tleXMucHVzaChuKSxhLmltcG9ydChuKS50aGVuKGZ1bmN0aW9uKGUpe1NlKG8ucGFja2FnZUNvbmZpZyxlLG8ucGFja2FnZUtleSwhMCxyKSxvLnBhY2thZ2VDb25maWcuY29uZmlndXJlZD0hMH0pLmNhdGNoKGZ1bmN0aW9uKGUpe3Rocm93IHQoZSxcIlVuYWJsZSB0byBmZXRjaCBwYWNrYWdlIGNvbmZpZ3VyYXRpb24gZmlsZSBcIituKX0pfWZ1bmN0aW9uIGdlKGUsdCxyKXt2YXIgbjtmb3IodmFyIG8gaW4gZSl7dmFyIGk9XCIuL1wiPT09by5zdWJzdHIoMCwyKT9cIi4vXCI6XCJcIjtpZihpJiYobz1vLnN1YnN0cigyKSksbj1vLmluZGV4T2YoXCIqXCIpLC0xIT09biYmby5zdWJzdHIoMCxuKT09PXQuc3Vic3RyKDAsbikmJm8uc3Vic3RyKG4rMSk9PT10LnN1YnN0cih0Lmxlbmd0aC1vLmxlbmd0aCtuKzEpJiZyKG8sZVtpK29dLG8uc3BsaXQoXCIvXCIpLmxlbmd0aCkpcmV0dXJufXZhciBhPWVbdF0mJk9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGUsdCk/ZVt0XTplW1wiLi9cIit0XTthJiZyKGEsYSwwKX1mdW5jdGlvbiBoZShlKXt2YXIgdCxyLG4sbixvPWUubGFzdEluZGV4T2YoXCJ8XCIpO3JldHVybi0xIT09bz8odD1lLnN1YnN0cihvKzEpLHI9ZS5zdWJzdHIoMCxvKSxcIn5cIj09PXRbMF0mJihuPSEwLHQ9dC5zdWJzdHIoMSkpKToobj1cIn5cIj09PWVbMF0sdD1cImRlZmF1bHRcIixyPWUuc3Vic3RyKG4pLC0xIT09cXQuaW5kZXhPZihyKSYmKHQ9cixyPW51bGwpKSx7bW9kdWxlOnJ8fFwiQHN5c3RlbS1lbnZcIixwcm9wOnQsbmVnYXRlOm59fWZ1bmN0aW9uIG1lKGUsdCxyKXtyZXR1cm4gZi5wcm90b3R5cGUuaW1wb3J0LmNhbGwodGhpcyxlLm1vZHVsZSx0KS50aGVuKGZ1bmN0aW9uKHQpe3ZhciBuPVQoZS5wcm9wLHQpO2lmKHImJlwiYm9vbGVhblwiIT10eXBlb2Ygbil0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ29uZGl0aW9uIGRpZCBub3QgcmVzb2x2ZSB0byBhIGJvb2xlYW4uXCIpO3JldHVybiBlLm5lZ2F0ZT8hbjpufSl9ZnVuY3Rpb24gdmUoZSx0LHIpe3ZhciBuPWUubWF0Y2goVHQpO2lmKCFuKXJldHVybiBQcm9taXNlLnJlc29sdmUoZSk7dmFyIG89aGUuY2FsbCh0aGlzLG5bMF0uc3Vic3RyKDIsblswXS5sZW5ndGgtMykpO3JldHVybiBtZS5jYWxsKHRoaXMsbyx0LCExKS50aGVuKGZ1bmN0aW9uKHIpe2lmKFwic3RyaW5nXCIhPXR5cGVvZiByKXRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGUgY29uZGl0aW9uIHZhbHVlIGZvciBcIitlK1wiIGRvZXNuJ3QgcmVzb2x2ZSB0byBhIHN0cmluZy5cIik7aWYoLTEhPT1yLmluZGV4T2YoXCIvXCIpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmFibGVkIHRvIGludGVycG9sYXRlIGNvbmRpdGlvbmFsIFwiK2UrKHQ/XCIgaW4gXCIrdDpcIlwiKStcIlxcblx0VGhlIGNvbmRpdGlvbiB2YWx1ZSBcIityKycgY2Fubm90IGNvbnRhaW4gYSBcIi9cIiBzZXBhcmF0b3IuJyk7cmV0dXJuIGUucmVwbGFjZShUdCxyKX0pfWZ1bmN0aW9uIHllKGUsdCxyKXtmb3IodmFyIG49MDtuPFV0Lmxlbmd0aDtuKyspe3ZhciBvPVV0W25dO3Rbb10mJk9yW28uc3Vic3RyKDAsby5sZW5ndGgtNildJiZyKHRbb10pfX1mdW5jdGlvbiBiZShlLHQpe3ZhciByPXt9O2Zvcih2YXIgbiBpbiBlKXt2YXIgbz1lW25dO3Q+MT9vIGluc3RhbmNlb2YgQXJyYXk/cltuXT1bXS5jb25jYXQobyk6XCJvYmplY3RcIj09dHlwZW9mIG8/cltuXT1iZShvLHQtMSk6XCJwYWNrYWdlQ29uZmlnXCIhPT1uJiYocltuXT1vKTpyW25dPW99cmV0dXJuIHJ9ZnVuY3Rpb24gd2UoZSx0KXt2YXIgcj1lW3RdO3JldHVybiByIGluc3RhbmNlb2YgQXJyYXk/ZVt0XS5jb25jYXQoW10pOlwib2JqZWN0XCI9PXR5cGVvZiByP2JlKHIsMyk6ZVt0XX1mdW5jdGlvbiBrZShlKXtpZihlKXtpZigtMSE9PVNyLmluZGV4T2YoZSkpcmV0dXJuIHdlKHRoaXNbRXRdLGUpO3Rocm93IG5ldyBFcnJvcignXCInK2UrJ1wiIGlzIG5vdCBhIHZhbGlkIGNvbmZpZ3VyYXRpb24gbmFtZS4gTXVzdCBiZSBvbmUgb2YgJytTci5qb2luKFwiLCBcIikrXCIuXCIpfWZvcih2YXIgdD17fSxyPTA7cjxTci5sZW5ndGg7cisrKXt2YXIgbj1TcltyXSxvPXdlKHRoaXNbRXRdLG4pO3ZvaWQgMCE9PW8mJih0W25dPW8pfXJldHVybiB0fWZ1bmN0aW9uIHhlKGUsdCl7dmFyIHI9dGhpcyxvPXRoaXNbRXRdO2lmKFwid2FybmluZ3NcImluIGUmJihvLndhcm5pbmdzPWUud2FybmluZ3MpLFwid2FzbVwiaW4gZSYmKG8ud2FzbT1cInVuZGVmaW5lZFwiIT10eXBlb2YgV2ViQXNzZW1ibHkmJmUud2FzbSksKFwicHJvZHVjdGlvblwiaW4gZXx8XCJidWlsZFwiaW4gZSkmJnR0LmNhbGwociwhIWUucHJvZHVjdGlvbiwhIShlLmJ1aWxkfHxPciYmT3IuYnVpbGQpKSwhdCl7dmFyIGk7eWUocixlLGZ1bmN0aW9uKGUpe2k9aXx8ZS5iYXNlVVJMfSksaT1pfHxlLmJhc2VVUkwsaSYmKG8uYmFzZVVSTD1uKGksbnQpfHxuKFwiLi9cIitpLG50KSxcIi9cIiE9PW8uYmFzZVVSTFtvLmJhc2VVUkwubGVuZ3RoLTFdJiYoby5iYXNlVVJMKz1cIi9cIikpLGUucGF0aHMmJkEoby5wYXRocyxlLnBhdGhzKSx5ZShyLGUsZnVuY3Rpb24oZSl7ZS5wYXRocyYmQShvLnBhdGhzLGUucGF0aHMpfSk7Zm9yKHZhciBhIGluIG8ucGF0aHMpLTEhPT1vLnBhdGhzW2FdLmluZGV4T2YoXCIqXCIpJiYoQy5jYWxsKG8sXCJQYXRoIGNvbmZpZyBcIithK1wiIC0+IFwiK28ucGF0aHNbYV0rXCIgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCBhcyB3aWxkY2FyZHMgYXJlIGRlcHJlY2F0ZWQuXCIpLGRlbGV0ZSBvLnBhdGhzW2FdKX1pZihlLmRlZmF1bHRKU0V4dGVuc2lvbnMmJkMuY2FsbChvLFwiVGhlIGRlZmF1bHRKU0V4dGVuc2lvbnMgY29uZmlndXJhdGlvbiBvcHRpb24gaXMgZGVwcmVjYXRlZC5cXG4gIFVzZSBwYWNrYWdlcyBkZWZhdWx0RXh0ZW5zaW9uIGluc3RlYWQuXCIsITApLFwiYm9vbGVhblwiPT10eXBlb2YgZS5wbHVnaW5GaXJzdCYmKG8ucGx1Z2luRmlyc3Q9ZS5wbHVnaW5GaXJzdCksZS5tYXApZm9yKHZhciBhIGluIGUubWFwKXt2YXIgcz1lLm1hcFthXTtpZihcInN0cmluZ1wiPT10eXBlb2Ygcyl7dmFyIHU9US5jYWxsKHIsbyxzLHZvaWQgMCwhMSwhMSk7XCIvXCI9PT11W3UubGVuZ3RoLTFdJiZcIjpcIiE9PWFbYS5sZW5ndGgtMV0mJlwiL1wiIT09YVthLmxlbmd0aC0xXSYmKHU9dS5zdWJzdHIoMCx1Lmxlbmd0aC0xKSksby5tYXBbYV09dX1lbHNle3ZhciBsPVEuY2FsbChyLG8sXCIvXCIhPT1hW2EubGVuZ3RoLTFdP2ErXCIvXCI6YSx2b2lkIDAsITAsITApO2w9bC5zdWJzdHIoMCxsLmxlbmd0aC0xKTt2YXIgYz1vLnBhY2thZ2VzW2xdO2N8fChjPW8ucGFja2FnZXNbbF09T2UoKSxjLmRlZmF1bHRFeHRlbnNpb249XCJcIiksU2UoYyx7bWFwOnN9LGwsITEsbyl9fWlmKGUucGFja2FnZUNvbmZpZ1BhdGhzKXtmb3IodmFyIGY9W10sZD0wO2Q8ZS5wYWNrYWdlQ29uZmlnUGF0aHMubGVuZ3RoO2QrKyl7dmFyIHA9ZS5wYWNrYWdlQ29uZmlnUGF0aHNbZF0sZz1NYXRoLm1heChwLmxhc3RJbmRleE9mKFwiKlwiKSsxLHAubGFzdEluZGV4T2YoXCIvXCIpKSxoPVEuY2FsbChyLG8scC5zdWJzdHIoMCxnKSx2b2lkIDAsITEsITEpO2ZbZF09aCtwLnN1YnN0cihnKX1vLnBhY2thZ2VDb25maWdQYXRocz1mfWlmKGUuYnVuZGxlcylmb3IodmFyIGEgaW4gZS5idW5kbGVzKXtmb3IodmFyIG09W10sZD0wO2Q8ZS5idW5kbGVzW2FdLmxlbmd0aDtkKyspbS5wdXNoKHIubm9ybWFsaXplU3luYyhlLmJ1bmRsZXNbYV1bZF0pKTtvLmJ1bmRsZXNbYV09bX1pZihlLnBhY2thZ2VzKWZvcih2YXIgYSBpbiBlLnBhY2thZ2VzKXtpZihhLm1hdGNoKC9eKFteXFwvXSs6KT9cXC9cXC8kLykpdGhyb3cgbmV3IFR5cGVFcnJvcignXCInK2ErJ1wiIGlzIG5vdCBhIHZhbGlkIHBhY2thZ2UgbmFtZS4nKTt2YXIgbD1RLmNhbGwocixvLFwiL1wiIT09YVthLmxlbmd0aC0xXT9hK1wiL1wiOmEsdm9pZCAwLCEwLCEwKTtsPWwuc3Vic3RyKDAsbC5sZW5ndGgtMSksU2Uoby5wYWNrYWdlc1tsXT1vLnBhY2thZ2VzW2xdfHxPZSgpLGUucGFja2FnZXNbYV0sbCwhMSxvKX1pZihlLmRlcENhY2hlKWZvcih2YXIgYSBpbiBlLmRlcENhY2hlKW8uZGVwQ2FjaGVbci5ub3JtYWxpemVTeW5jKGEpXT1bXS5jb25jYXQoZS5kZXBDYWNoZVthXSk7aWYoZS5tZXRhKWZvcih2YXIgYSBpbiBlLm1ldGEpaWYoXCIqXCI9PT1hWzBdKUEoby5tZXRhW2FdPW8ubWV0YVthXXx8e30sZS5tZXRhW2FdKTtlbHNle3ZhciB2PVEuY2FsbChyLG8sYSx2b2lkIDAsITAsITApO0Eoby5tZXRhW3ZdPW8ubWV0YVt2XXx8e30sZS5tZXRhW2FdKX1cInRyYW5zcGlsZXJcImluIGUmJihvLnRyYW5zcGlsZXI9ZS50cmFuc3BpbGVyKTtmb3IodmFyIHkgaW4gZSktMT09PVNyLmluZGV4T2YoeSkmJi0xPT09VXQuaW5kZXhPZih5KSYmKHJbeV09ZVt5XSk7eWUocixlLGZ1bmN0aW9uKGUpe3IuY29uZmlnKGUsITApfSl9ZnVuY3Rpb24gT2UoKXtyZXR1cm57ZGVmYXVsdEV4dGVuc2lvbjp2b2lkIDAsbWFpbjp2b2lkIDAsZm9ybWF0OnZvaWQgMCxtZXRhOnZvaWQgMCxtYXA6dm9pZCAwLHBhY2thZ2VDb25maWc6dm9pZCAwLGNvbmZpZ3VyZWQ6ITF9fWZ1bmN0aW9uIFNlKGUsdCxyLG4sbyl7Zm9yKHZhciBpIGluIHQpXCJtYWluXCI9PT1pfHxcImZvcm1hdFwiPT09aXx8XCJkZWZhdWx0RXh0ZW5zaW9uXCI9PT1pfHxcImNvbmZpZ3VyZWRcIj09PWk/biYmdm9pZCAwIT09ZVtpXXx8KGVbaV09dFtpXSk6XCJtYXBcIj09PWk/KG4/STpBKShlLm1hcD1lLm1hcHx8e30sdC5tYXApOlwibWV0YVwiPT09aT8obj9JOkEpKGUubWV0YT1lLm1ldGF8fHt9LHQubWV0YSk6T2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodCxpKSYmQy5jYWxsKG8sJ1wiJytpKydcIiBpcyBub3QgYSB2YWxpZCBwYWNrYWdlIGNvbmZpZ3VyYXRpb24gb3B0aW9uIGluIHBhY2thZ2UgJytyKTtyZXR1cm4gdm9pZCAwPT09ZS5kZWZhdWx0RXh0ZW5zaW9uJiYoZS5kZWZhdWx0RXh0ZW5zaW9uPVwianNcIiksdm9pZCAwPT09ZS5tYWluJiZlLm1hcCYmZS5tYXBbXCIuXCJdPyhlLm1haW49ZS5tYXBbXCIuXCJdLGRlbGV0ZSBlLm1hcFtcIi5cIl0pOlwib2JqZWN0XCI9PXR5cGVvZiBlLm1haW4mJihlLm1hcD1lLm1hcHx8e30sZS5tYXBbXCIuL0BtYWluXCJdPWUubWFpbixlLm1haW4uZGVmYXVsdD1lLm1haW4uZGVmYXVsdHx8XCIuL1wiLGUubWFpbj1cIkBtYWluXCIpLGV9ZnVuY3Rpb24gRWUoZSl7cmV0dXJuIHp0P1d0K25ldyBCdWZmZXIoZSkudG9TdHJpbmcoXCJiYXNlNjRcIik6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGJ0b2E/V3QrYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoZSkpKTpcIlwifWZ1bmN0aW9uIGplKGUsdCxyLG4pe3ZhciBvPWUubGFzdEluZGV4T2YoXCJcXG5cIik7aWYodCl7aWYoXCJvYmplY3RcIiE9dHlwZW9mIHQpdGhyb3cgbmV3IFR5cGVFcnJvcihcImxvYWQubWV0YWRhdGEuc291cmNlTWFwIG11c3QgYmUgc2V0IHRvIGFuIG9iamVjdC5cIik7dD1KU09OLnN0cmluZ2lmeSh0KX1yZXR1cm4obj9cIihmdW5jdGlvbihTeXN0ZW0sIFN5c3RlbUpTKSB7XCI6XCJcIikrZSsobj9cIlxcbn0pKFN5c3RlbSwgU3lzdGVtKTtcIjpcIlwiKSsoXCJcXG4vLyMgc291cmNlVVJMPVwiIT1lLnN1YnN0cihvLDE1KT9cIlxcbi8vIyBzb3VyY2VVUkw9XCIrcisodD9cIiF0cmFuc3BpbGVkXCI6XCJcIik6XCJcIikrKHQmJkVlKHQpfHxcIlwiKX1mdW5jdGlvbiBfZShlLHQscixuLG8pe050fHwoTnQ9ZG9jdW1lbnQuaGVhZHx8ZG9jdW1lbnQuYm9keXx8ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO2kudGV4dD1qZSh0LHIsbiwhMSk7dmFyIGEscz13aW5kb3cub25lcnJvcjtyZXR1cm4gd2luZG93Lm9uZXJyb3I9ZnVuY3Rpb24oZSl7YT1hZGRUb0Vycm9yKGUsXCJFdmFsdWF0aW5nIFwiK24pLHMmJnMuYXBwbHkodGhpcyxhcmd1bWVudHMpfSxSZShlKSxvJiZpLnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsbyksTnQuYXBwZW5kQ2hpbGQoaSksTnQucmVtb3ZlQ2hpbGQoaSksTWUoKSx3aW5kb3cub25lcnJvcj1zLGE/YTp2b2lkIDB9ZnVuY3Rpb24gUmUoZSl7MD09R3QrKyYmKEJ0PXN0LlN5c3RlbSksc3QuU3lzdGVtPXN0LlN5c3RlbUpTPWV9ZnVuY3Rpb24gTWUoKXswPT0tLUd0JiYoc3QuU3lzdGVtPXN0LlN5c3RlbUpTPUJ0KX1mdW5jdGlvbiBQZShlLHQscixuLG8saSxhKXtpZih0KXtpZihpJiZIdClyZXR1cm4gX2UoZSx0LHIsbixpKTt0cnl7UmUoZSksIUp0JiZlLl9ub2RlUmVxdWlyZSYmKEp0PWUuX25vZGVSZXF1aXJlKFwidm1cIiksJHQ9SnQucnVuSW5UaGlzQ29udGV4dChcInR5cGVvZiBTeXN0ZW0gIT09ICd1bmRlZmluZWQnICYmIFN5c3RlbVwiKT09PWUpLCR0P0p0LnJ1bkluVGhpc0NvbnRleHQoamUodCxyLG4sIWEpLHtmaWxlbmFtZTpuKyhyP1wiIXRyYW5zcGlsZWRcIjpcIlwiKX0pOigwLGV2YWwpKGplKHQscixuLCFhKSksTWUoKX1jYXRjaChlKXtyZXR1cm4gTWUoKSxlfX19ZnVuY3Rpb24gQ2UoZSl7cmV0dXJuXCJmaWxlOi8vL1wiPT09ZS5zdWJzdHIoMCw4KT9lLnN1YnN0cig3KyEhYXQpOlp0JiZlLnN1YnN0cigwLFp0Lmxlbmd0aCk9PT1adD9lLnN1YnN0cihadC5sZW5ndGgpOmV9ZnVuY3Rpb24gTGUoZSx0KXtyZXR1cm4gQ2UodGhpcy5ub3JtYWxpemVTeW5jKGUsdCkpfWZ1bmN0aW9uIEFlKGUpe3ZhciB0LHI9ZS5sYXN0SW5kZXhPZihcIiFcIik7dD0tMSE9PXI/ZS5zdWJzdHIoMCxyKTplO3ZhciBuPXQuc3BsaXQoXCIvXCIpO3JldHVybiBuLnBvcCgpLG49bi5qb2luKFwiL1wiKSx7ZmlsZW5hbWU6Q2UodCksZGlybmFtZTpDZShuKX19ZnVuY3Rpb24gSWUoZSl7ZnVuY3Rpb24gdChlLHQpe2Zvcih2YXIgcj0wO3I8ZS5sZW5ndGg7cisrKWlmKGVbcl1bMF08dC5pbmRleCYmZVtyXVsxXT50LmluZGV4KXJldHVybiEwO3JldHVybiExfUl0Lmxhc3RJbmRleD10ci5sYXN0SW5kZXg9cnIubGFzdEluZGV4PTA7dmFyIHIsbj1bXSxvPVtdLGk9W107aWYoZS5sZW5ndGgvZS5zcGxpdChcIlxcblwiKS5sZW5ndGg8MjAwKXtmb3IoO3I9cnIuZXhlYyhlKTspby5wdXNoKFtyLmluZGV4LHIuaW5kZXgrclswXS5sZW5ndGhdKTtmb3IoO3I9dHIuZXhlYyhlKTspdChvLHIpfHxpLnB1c2goW3IuaW5kZXgrclsxXS5sZW5ndGgsci5pbmRleCtyWzBdLmxlbmd0aC0xXSl9Zm9yKDtyPUl0LmV4ZWMoZSk7KWlmKCF0KG8scikmJiF0KGkscikpe3ZhciBhPXJbMV0uc3Vic3RyKDEsclsxXS5sZW5ndGgtMik7aWYoYS5tYXRjaCgvXCJ8Jy8pKWNvbnRpbnVlO24ucHVzaChhKX1yZXR1cm4gbn1mdW5jdGlvbiBGZShlKXtpZigtMT09PW5yLmluZGV4T2YoZSkpe3RyeXt2YXIgdD1zdFtlXX1jYXRjaCh0KXtuci5wdXNoKGUpfXRoaXMoZSx0KX19ZnVuY3Rpb24gS2UoZSl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUpcmV0dXJuIFQoZSxzdCk7aWYoIShlIGluc3RhbmNlb2YgQXJyYXkpKXRocm93IG5ldyBFcnJvcihcIkdsb2JhbCBleHBvcnRzIG11c3QgYmUgYSBzdHJpbmcgb3IgYXJyYXkuXCIpO2Zvcih2YXIgdD17fSxyPTA7cjxlLmxlbmd0aDtyKyspdFtlW3JdLnNwbGl0KFwiLlwiKS5wb3AoKV09VChlW3JdLHN0KTtyZXR1cm4gdH1mdW5jdGlvbiBEZShlLHQscixuKXt2YXIgbz1zdC5kZWZpbmU7c3QuZGVmaW5lPXZvaWQgMDt2YXIgaTtpZihyKXtpPXt9O2Zvcih2YXIgYSBpbiByKWlbYV09c3RbYV0sc3RbYV09clthXX1yZXR1cm4gdHx8KFl0PXt9LE9iamVjdC5rZXlzKHN0KS5mb3JFYWNoKEZlLGZ1bmN0aW9uKGUsdCl7WXRbZV09dH0pKSxmdW5jdGlvbigpe3ZhciBlLHI9dD9LZSh0KTp7fSxhPSEhdDtpZigoIXR8fG4pJiZPYmplY3Qua2V5cyhzdCkuZm9yRWFjaChGZSxmdW5jdGlvbihvLGkpe1l0W29dIT09aSYmdm9pZCAwIT09aSYmKG4mJihzdFtvXT12b2lkIDApLHR8fChyW29dPWksdm9pZCAwIT09ZT9hfHxlPT09aXx8KGE9ITApOmU9aSkpfSkscj1hP3I6ZSxpKWZvcih2YXIgcyBpbiBpKXN0W3NdPWlbc107cmV0dXJuIHN0LmRlZmluZT1vLHJ9fWZ1bmN0aW9uIHFlKGUsdCl7ZT1lLnJlcGxhY2UodHIsXCJcIik7dmFyIHI9ZS5tYXRjaChhciksbj0oclsxXS5zcGxpdChcIixcIilbdF18fFwicmVxdWlyZVwiKS5yZXBsYWNlKHNyLFwiXCIpLG89dXJbbl18fCh1cltuXT1uZXcgUmVnRXhwKG9yK24raXIsXCJnXCIpKTtvLmxhc3RJbmRleD0wO2Zvcih2YXIgaSxhPVtdO2k9by5leGVjKGUpOylhLnB1c2goaVsyXXx8aVszXSk7cmV0dXJuIGF9ZnVuY3Rpb24gVGUoZSl7cmV0dXJuIGZ1bmN0aW9uKHQscixuKXtlKHQscixuKSxyPW4uZXhwb3J0cyxcIm9iamVjdFwiIT10eXBlb2YgciYmXCJmdW5jdGlvblwiIT10eXBlb2Ygcnx8XCJfX2VzTW9kdWxlXCJpbiByfHxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5leHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfX1mdW5jdGlvbiBVZShlLHQpe1Z0PWUsY3I9dCxRdD12b2lkIDAsbHI9ITF9ZnVuY3Rpb24gemUoZSl7UXQ/ZS5yZWdpc3RlckR5bmFtaWMoVnQ/UXRbMF0uY29uY2F0KFZ0KTpRdFswXSwhMSxjcj9UZShRdFsxXSk6UXRbMV0pOmxyJiZlLnJlZ2lzdGVyRHluYW1pYyhbXSwhMSxSKX1mdW5jdGlvbiBOZShlLHQpeyFlLmxvYWQuZXNNb2R1bGV8fFwib2JqZWN0XCIhPXR5cGVvZiB0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0fHxcIl9fZXNNb2R1bGVcImluIHR8fE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfWZ1bmN0aW9uIEplKGUsdCl7dmFyIHI9dGhpcyxuPXRoaXNbRXRdO3JldHVybihCZShuLHRoaXMsZSl8fE90KS50aGVuKGZ1bmN0aW9uKCl7aWYoIXQoKSl7dmFyIG89cltqdF1bZV07aWYoXCJAbm9kZS9cIj09PWUuc3Vic3RyKDAsNikpe2lmKCFyLl9ub2RlUmVxdWlyZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiRXJyb3IgbG9hZGluZyBcIitlK1wiLiBDYW4gb25seSBsb2FkIG5vZGUgY29yZSBtb2R1bGVzIGluIE5vZGUuXCIpO3JldHVybiByLnJlZ2lzdGVyRHluYW1pYyhbXSwhMSxmdW5jdGlvbigpe3JldHVybiBMLmNhbGwocixlLnN1YnN0cig2KSxyLmJhc2VVUkwpfSksdm9pZCB0KCl9cmV0dXJuIG8ubG9hZC5zY3JpcHRMb2FkPyhvLmxvYWQucGx1Z2luS2V5fHwhZnIpJiYoby5sb2FkLnNjcmlwdExvYWQ9ITEsQy5jYWxsKG4sJ3NjcmlwdExvYWQgbm90IHN1cHBvcnRlZCBmb3IgXCInK2UrJ1wiJykpOm8ubG9hZC5zY3JpcHRMb2FkIT09ITEmJiFvLmxvYWQucGx1Z2luS2V5JiZmciYmKG8ubG9hZC5kZXBzfHxvLmxvYWQuZ2xvYmFsc3x8IShcInN5c3RlbVwiPT09by5sb2FkLmZvcm1hdHx8XCJyZWdpc3RlclwiPT09by5sb2FkLmZvcm1hdHx8XCJnbG9iYWxcIj09PW8ubG9hZC5mb3JtYXQmJm8ubG9hZC5leHBvcnRzKXx8KG8ubG9hZC5zY3JpcHRMb2FkPSEwKSksby5sb2FkLnNjcmlwdExvYWQ/bmV3IFByb21pc2UoZnVuY3Rpb24obixpKXtpZihcImFtZFwiPT09by5sb2FkLmZvcm1hdCYmc3QuZGVmaW5lIT09ci5hbWREZWZpbmUpdGhyb3cgbmV3IEVycm9yKFwiTG9hZGluZyBBTUQgd2l0aCBzY3JpcHRMb2FkIHJlcXVpcmVzIHNldHRpbmcgdGhlIGdsb2JhbCBgXCIrcHIrXCIuZGVmaW5lID0gU3lzdGVtSlMuYW1kRGVmaW5lYFwiKTtxKGUsby5sb2FkLmNyb3NzT3JpZ2luLG8ubG9hZC5pbnRlZ3JpdHksZnVuY3Rpb24oKXtpZighdCgpKXtvLmxvYWQuZm9ybWF0PVwiZ2xvYmFsXCI7dmFyIGU9by5sb2FkLmV4cG9ydHMmJktlKG8ubG9hZC5leHBvcnRzKTtyLnJlZ2lzdGVyRHluYW1pYyhbXSwhMSxmdW5jdGlvbigpe3JldHVybiBOZShvLGUpLGV9KSx0KCl9bigpfSxpKX0pOiRlKHIsZSxvKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIFdlKHIsZSxvLHQsbi53YXNtKX0pfX0pLnRoZW4oZnVuY3Rpb24odCl7cmV0dXJuIGRlbGV0ZSByW2p0XVtlXSx0fSl9ZnVuY3Rpb24gJGUoZSx0LHIpe3JldHVybiByLnBsdWdpbktleT9lLmltcG9ydChyLnBsdWdpbktleSkudGhlbihmdW5jdGlvbihlKXtyLnBsdWdpbk1vZHVsZT1lLHIucGx1Z2luTG9hZD17bmFtZTp0LGFkZHJlc3M6ci5wbHVnaW5Bcmd1bWVudCxzb3VyY2U6dm9pZCAwLG1ldGFkYXRhOnIubG9hZH0sci5sb2FkLmRlcHM9ci5sb2FkLmRlcHN8fFtdfSk6T3R9ZnVuY3Rpb24gQmUoZSx0LHIpe3ZhciBuPWUuZGVwQ2FjaGVbcl07aWYobilmb3IodmFyIG89MDtvPG4ubGVuZ3RoO28rKyl0Lm5vcm1hbGl6ZShuW29dLHIpLnRoZW4oSyk7ZWxzZXt2YXIgaT0hMTtmb3IodmFyIGEgaW4gZS5idW5kbGVzKXtmb3IodmFyIG89MDtvPGUuYnVuZGxlc1thXS5sZW5ndGg7bysrKXt2YXIgcz1lLmJ1bmRsZXNbYV1bb107aWYocz09PXIpe2k9ITA7YnJlYWt9aWYoLTEhPT1zLmluZGV4T2YoXCIqXCIpKXt2YXIgdT1zLnNwbGl0KFwiKlwiKTtpZigyIT09dS5sZW5ndGgpe2UuYnVuZGxlc1thXS5zcGxpY2Uoby0tLDEpO2NvbnRpbnVlfWlmKHIuc3Vic3RyKDAsdVswXS5sZW5ndGgpPT09dVswXSYmci5zdWJzdHIoci5sZW5ndGgtdVsxXS5sZW5ndGgsdVsxXS5sZW5ndGgpPT09dVsxXSl7aT0hMDticmVha319fWlmKGkpcmV0dXJuIHQuaW1wb3J0KGEpfX19ZnVuY3Rpb24gV2UoZSx0LHIsbixvKXtyZXR1cm4gci5sb2FkLmV4cG9ydHMmJiFyLmxvYWQuZm9ybWF0JiYoci5sb2FkLmZvcm1hdD1cImdsb2JhbFwiKSxPdC50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIHIucGx1Z2luTW9kdWxlJiZyLnBsdWdpbk1vZHVsZS5sb2NhdGU/UHJvbWlzZS5yZXNvbHZlKHIucGx1Z2luTW9kdWxlLmxvY2F0ZS5jYWxsKGUsci5wbHVnaW5Mb2FkKSkudGhlbihmdW5jdGlvbihlKXtlJiYoci5wbHVnaW5Mb2FkLmFkZHJlc3M9ZSl9KTp2b2lkIDB9KS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIHIucGx1Z2luTW9kdWxlPyhvPSExLHIucGx1Z2luTW9kdWxlLmZldGNoP3IucGx1Z2luTW9kdWxlLmZldGNoLmNhbGwoZSxyLnBsdWdpbkxvYWQsZnVuY3Rpb24oZSl7cmV0dXJuIEt0KGUuYWRkcmVzcyxyLmxvYWQuYXV0aG9yaXphdGlvbixyLmxvYWQuaW50ZWdyaXR5LCExKX0pOkt0KHIucGx1Z2luTG9hZC5hZGRyZXNzLHIubG9hZC5hdXRob3JpemF0aW9uLHIubG9hZC5pbnRlZ3JpdHksITEpKTpLdCh0LHIubG9hZC5hdXRob3JpemF0aW9uLHIubG9hZC5pbnRlZ3JpdHksbyl9KS50aGVuKGZ1bmN0aW9uKGkpe2lmKCFvfHxcInN0cmluZ1wiPT10eXBlb2YgaSlyZXR1cm4gR2UoZSx0LGkscixuKTt2YXIgYT1uZXcgVWludDhBcnJheShpKTtpZigwPT09YVswXSYmOTc9PT1hWzFdJiYxMTU9PT1hWzJdKXJldHVybiBXZWJBc3NlbWJseS5jb21waWxlKGEpLnRoZW4oZnVuY3Rpb24odCl7dmFyIHI9W10sbz1bXSxpPXt9O1dlYkFzc2VtYmx5Lk1vZHVsZS5pbXBvcnRzJiZXZWJBc3NlbWJseS5Nb2R1bGUuaW1wb3J0cyh0KS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciB0PWUubW9kdWxlO28ucHVzaChmdW5jdGlvbihlKXtpW3RdPWV9KSwtMT09PXIuaW5kZXhPZih0KSYmci5wdXNoKHQpfSksZS5yZWdpc3RlcihyLGZ1bmN0aW9uKGUpe3JldHVybntzZXR0ZXJzOm8sZXhlY3V0ZTpmdW5jdGlvbigpe2UobmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKHQsaSkuZXhwb3J0cyl9fX0pLG4oKX0pO3ZhciBzPW90P25ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpLmRlY29kZShhKTppLnRvU3RyaW5nKCk7cmV0dXJuIEdlKGUsdCxzLHIsbil9KX1mdW5jdGlvbiBHZShlLHQscixuLG8pe3JldHVybiBQcm9taXNlLnJlc29sdmUocikudGhlbihmdW5jdGlvbih0KXtyZXR1cm5cImRldGVjdFwiPT09bi5sb2FkLmZvcm1hdCYmKG4ubG9hZC5mb3JtYXQ9dm9pZCAwKSxWZSh0LG4pLG4ucGx1Z2luTW9kdWxlJiZuLnBsdWdpbk1vZHVsZS50cmFuc2xhdGU/KG4ucGx1Z2luTG9hZC5zb3VyY2U9dCxQcm9taXNlLnJlc29sdmUobi5wbHVnaW5Nb2R1bGUudHJhbnNsYXRlLmNhbGwoZSxuLnBsdWdpbkxvYWQsbi50cmFjZU9wdHMpKS50aGVuKGZ1bmN0aW9uKGUpe2lmKG4ubG9hZC5zb3VyY2VNYXApe2lmKFwib2JqZWN0XCIhPXR5cGVvZiBuLmxvYWQuc291cmNlTWFwKXRocm93IG5ldyBFcnJvcihcIm1ldGFkYXRhLmxvYWQuc291cmNlTWFwIG11c3QgYmUgc2V0IHRvIGFuIG9iamVjdC5cIik7WGUobi5wbHVnaW5Mb2FkLmFkZHJlc3Msbi5sb2FkLnNvdXJjZU1hcCl9cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGU/ZTpuLnBsdWdpbkxvYWQuc291cmNlfSkpOnR9KS50aGVuKGZ1bmN0aW9uKHIpe3JldHVyblwicmVnaXN0ZXJcIj09PW4ubG9hZC5mb3JtYXR8fCFuLmxvYWQuZm9ybWF0JiZIZShyKT8obi5sb2FkLmZvcm1hdD1cInJlZ2lzdGVyXCIscik6XCJlc21cIj09PW4ubG9hZC5mb3JtYXR8fCFuLmxvYWQuZm9ybWF0JiZyLm1hdGNoKGdyKT8obi5sb2FkLmZvcm1hdD1cImVzbVwiLFllKGUscix0LG4sbykpOnJ9KS50aGVuKGZ1bmN0aW9uKHQpe2lmKFwic3RyaW5nXCIhPXR5cGVvZiB0fHwhbi5wbHVnaW5Nb2R1bGV8fCFuLnBsdWdpbk1vZHVsZS5pbnN0YW50aWF0ZSlyZXR1cm4gdDt2YXIgcj0hMTtyZXR1cm4gbi5wbHVnaW5Mb2FkLnNvdXJjZT10LFByb21pc2UucmVzb2x2ZShuLnBsdWdpbk1vZHVsZS5pbnN0YW50aWF0ZS5jYWxsKGUsbi5wbHVnaW5Mb2FkLGZ1bmN0aW9uKGUpe2lmKHQ9ZS5zb3VyY2Usbi5sb2FkPWUubWV0YWRhdGEscil0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YW50aWF0ZSBtdXN0IG9ubHkgYmUgY2FsbGVkIG9uY2UuXCIpO3I9ITB9KSkudGhlbihmdW5jdGlvbihlKXtyZXR1cm4gcj90Ok0oZSl9KX0pLnRoZW4oZnVuY3Rpb24ocil7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIHIpcmV0dXJuIHI7bi5sb2FkLmZvcm1hdHx8KG4ubG9hZC5mb3JtYXQ9WmUocikpO3ZhciBpPSExO3N3aXRjaChuLmxvYWQuZm9ybWF0KXtjYXNlXCJlc21cIjpjYXNlXCJyZWdpc3RlclwiOmNhc2VcInN5c3RlbVwiOnZhciBhPVBlKGUscixuLmxvYWQuc291cmNlTWFwLHQsbi5sb2FkLmludGVncml0eSxuLmxvYWQubm9uY2UsITEpO2lmKGEpdGhyb3cgYTtpZighbygpKXJldHVybiBTdDtyZXR1cm47Y2FzZVwianNvblwiOnJldHVybiBlLm5ld01vZHVsZSh7ZGVmYXVsdDpKU09OLnBhcnNlKHIpLF9fdXNlRGVmYXVsdDohMH0pO2Nhc2VcImFtZFwiOnZhciBzPXN0LmRlZmluZTtzdC5kZWZpbmU9ZS5hbWREZWZpbmUsVWUobi5sb2FkLmRlcHMsbi5sb2FkLmVzTW9kdWxlKTt2YXIgYT1QZShlLHIsbi5sb2FkLnNvdXJjZU1hcCx0LG4ubG9hZC5pbnRlZ3JpdHksbi5sb2FkLm5vbmNlLCExKTtpZihpPW8oKSxpfHwoemUoZSksaT1vKCkpLHN0LmRlZmluZT1zLGEpdGhyb3cgYTticmVhaztjYXNlXCJjanNcIjp2YXIgdT1uLmxvYWQuZGVwcyxsPShuLmxvYWQuZGVwc3x8W10pLmNvbmNhdChuLmxvYWQuY2pzUmVxdWlyZURldGVjdGlvbj9JZShyKTpbXSk7XG5mb3IodmFyIGMgaW4gbi5sb2FkLmdsb2JhbHMpbi5sb2FkLmdsb2JhbHNbY10mJmwucHVzaChuLmxvYWQuZ2xvYmFsc1tjXSk7ZS5yZWdpc3RlckR5bmFtaWMobCwhMCxmdW5jdGlvbihvLGksYSl7aWYoby5yZXNvbHZlPWZ1bmN0aW9uKHQpe3JldHVybiBMZS5jYWxsKGUsdCxhLmlkKX0sYS5wYXRocz1bXSxhLnJlcXVpcmU9bywhbi5sb2FkLmNqc0RlZmVyRGVwc0V4ZWN1dGUmJnUpZm9yKHZhciBzPTA7czx1Lmxlbmd0aDtzKyspbyh1W3NdKTt2YXIgbD1BZShhLmlkKSxjPXtleHBvcnRzOmksYXJnczpbbyxpLGEsbC5maWxlbmFtZSxsLmRpcm5hbWUsc3Qsc3RdfSxmPVwiKGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgZ2xvYmFsLCBHTE9CQUxcIjtpZihuLmxvYWQuZ2xvYmFscylmb3IodmFyIGQgaW4gbi5sb2FkLmdsb2JhbHMpYy5hcmdzLnB1c2gobyhuLmxvYWQuZ2xvYmFsc1tkXSkpLGYrPVwiLCBcIitkO3ZhciBwPXN0LmRlZmluZTtzdC5kZWZpbmU9dm9pZCAwLHN0Ll9fY2pzV3JhcHBlcj1jLHI9ZitcIikge1wiK3IucmVwbGFjZSh5cixcIlwiKStcIlxcbn0pLmFwcGx5KF9fY2pzV3JhcHBlci5leHBvcnRzLCBfX2Nqc1dyYXBwZXIuYXJncyk7XCI7dmFyIGc9UGUoZSxyLG4ubG9hZC5zb3VyY2VNYXAsdCxuLmxvYWQuaW50ZWdyaXR5LG4ubG9hZC5ub25jZSwhMSk7aWYoZyl0aHJvdyBnO05lKG4saSksc3QuX19janNXcmFwcGVyPXZvaWQgMCxzdC5kZWZpbmU9cH0pLGk9bygpO2JyZWFrO2Nhc2VcImdsb2JhbFwiOnZhciBsPW4ubG9hZC5kZXBzfHxbXTtmb3IodmFyIGMgaW4gbi5sb2FkLmdsb2JhbHMpe3ZhciBmPW4ubG9hZC5nbG9iYWxzW2NdO2YmJmwucHVzaChmKX1lLnJlZ2lzdGVyRHluYW1pYyhsLCExLGZ1bmN0aW9uKG8saSxhKXt2YXIgcztpZihuLmxvYWQuZ2xvYmFscyl7cz17fTtmb3IodmFyIHUgaW4gbi5sb2FkLmdsb2JhbHMpbi5sb2FkLmdsb2JhbHNbdV0mJihzW3VdPW8obi5sb2FkLmdsb2JhbHNbdV0pKX12YXIgbD1uLmxvYWQuZXhwb3J0cztsJiYocis9XCJcXG5cIitwcisnW1wiJytsKydcIl0gPSAnK2wrXCI7XCIpO3ZhciBjPURlKGEuaWQsbCxzLG4ubG9hZC5lbmNhcHN1bGF0ZUdsb2JhbCksZj1QZShlLHIsbi5sb2FkLnNvdXJjZU1hcCx0LG4ubG9hZC5pbnRlZ3JpdHksbi5sb2FkLm5vbmNlLCEwKTtpZihmKXRocm93IGY7dmFyIGQ9YygpO3JldHVybiBOZShuLGQpLGR9KSxpPW8oKTticmVhaztkZWZhdWx0OnRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gbW9kdWxlIGZvcm1hdCBcIicrbi5sb2FkLmZvcm1hdCsnXCIgZm9yIFwiJyt0KydcIi4nKyhcImVzNlwiPT09bi5sb2FkLmZvcm1hdD8nIFVzZSBcImVzbVwiIGluc3RlYWQgaGVyZS4nOlwiXCIpKX1pZighaSl0aHJvdyBuZXcgRXJyb3IoXCJNb2R1bGUgXCIrdCtcIiBkZXRlY3RlZCBhcyBcIituLmxvYWQuZm9ybWF0K1wiIGJ1dCBkaWRuJ3QgZXhlY3V0ZSBjb3JyZWN0bHkuXCIpfSl9ZnVuY3Rpb24gSGUoZSl7dmFyIHQ9ZS5tYXRjaChocik7cmV0dXJuIHQmJlwiU3lzdGVtLnJlZ2lzdGVyXCI9PT1lLnN1YnN0cih0WzBdLmxlbmd0aCwxNSl9ZnVuY3Rpb24gWmUoZSl7cmV0dXJuIGUubWF0Y2gobXIpP1wiYW1kXCI6KHZyLmxhc3RJbmRleD0wLEl0Lmxhc3RJbmRleD0wLEl0LmV4ZWMoZSl8fHZyLmV4ZWMoZSk/XCJjanNcIjpcImdsb2JhbFwiKX1mdW5jdGlvbiBYZShlLHQpe3ZhciByPWUuc3BsaXQoXCIhXCIpWzBdO3QuZmlsZSYmdC5maWxlIT1lfHwodC5maWxlPXIrXCIhdHJhbnNwaWxlZFwiKSwoIXQuc291cmNlc3x8dC5zb3VyY2VzLmxlbmd0aDw9MSYmKCF0LnNvdXJjZXNbMF18fHQuc291cmNlc1swXT09PWUpKSYmKHQuc291cmNlcz1bcl0pfWZ1bmN0aW9uIFllKGUscixuLG8saSl7aWYoIWUudHJhbnNwaWxlcil0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5hYmxlIHRvIGR5bmFtaWNhbGx5IHRyYW5zcGlsZSBFUyBtb2R1bGVcXG4gICBBIGxvYWRlciBwbHVnaW4gbmVlZHMgdG8gYmUgY29uZmlndXJlZCB2aWEgYFN5c3RlbUpTLmNvbmZpZyh7IHRyYW5zcGlsZXI6ICd0cmFuc3BpbGVyLW1vZHVsZScgfSlgLlwiKTtpZihvLmxvYWQuZGVwcyl7Zm9yKHZhciBhPVwiXCIscz0wO3M8by5sb2FkLmRlcHMubGVuZ3RoO3MrKylhKz0naW1wb3J0IFwiJytvLmxvYWQuZGVwc1tzXSsnXCI7ICc7cj1hK3J9cmV0dXJuIGUuaW1wb3J0LmNhbGwoZSxlLnRyYW5zcGlsZXIpLnRoZW4oZnVuY3Rpb24odCl7aWYodC5fX3VzZURlZmF1bHQmJih0PXQuZGVmYXVsdCksIXQudHJhbnNsYXRlKXRocm93IG5ldyBFcnJvcihlLnRyYW5zcGlsZXIrXCIgaXMgbm90IGEgdmFsaWQgdHJhbnNwaWxlciBwbHVnaW4uXCIpO3JldHVybiB0PT09by5wbHVnaW5Nb2R1bGU/cjooXCJzdHJpbmdcIj09dHlwZW9mIG8ubG9hZC5zb3VyY2VNYXAmJihvLmxvYWQuc291cmNlTWFwPUpTT04ucGFyc2Uoby5sb2FkLnNvdXJjZU1hcCkpLG8ucGx1Z2luTG9hZD1vLnBsdWdpbkxvYWR8fHtuYW1lOm4sYWRkcmVzczpuLHNvdXJjZTpyLG1ldGFkYXRhOm8ubG9hZH0sby5sb2FkLmRlcHM9by5sb2FkLmRlcHN8fFtdLFByb21pc2UucmVzb2x2ZSh0LnRyYW5zbGF0ZS5jYWxsKGUsby5wbHVnaW5Mb2FkLG8udHJhY2VPcHRzKSkudGhlbihmdW5jdGlvbihlKXt2YXIgdD1vLmxvYWQuc291cmNlTWFwO3JldHVybiB0JiZcIm9iamVjdFwiPT10eXBlb2YgdCYmWGUobix0KSxcImVzbVwiPT09by5sb2FkLmZvcm1hdCYmSGUoZSkmJihvLmxvYWQuZm9ybWF0PVwicmVnaXN0ZXJcIiksZX0pKX0sZnVuY3Rpb24oZSl7dGhyb3cgdChlLFwiVW5hYmxlIHRvIGxvYWQgdHJhbnNwaWxlciB0byB0cmFuc3BpbGUgXCIrbil9KX1mdW5jdGlvbiBRZShlLHQscil7Zm9yKHZhciBuLG89dC5zcGxpdChcIi5cIik7by5sZW5ndGg+MTspbj1vLnNoaWZ0KCksZT1lW25dPWVbbl18fHt9O249by5zaGlmdCgpLHZvaWQgMD09PWVbbl0mJihlW25dPXIpfWZ1bmN0aW9uIFZlKGUsdCl7dmFyIHI9ZS5tYXRjaChicik7aWYocilmb3IodmFyIG49clswXS5tYXRjaCh3ciksbz0wO288bi5sZW5ndGg7bysrKXt2YXIgaT1uW29dLGE9aS5sZW5ndGgscz1pLnN1YnN0cigwLDEpO2lmKFwiO1wiPT1pLnN1YnN0cihhLTEsMSkmJmEtLSwnXCInPT1zfHxcIidcIj09cyl7dmFyIHU9aS5zdWJzdHIoMSxpLmxlbmd0aC0zKSxsPXUuc3Vic3RyKDAsdS5pbmRleE9mKFwiIFwiKSk7aWYobCl7dmFyIGM9dS5zdWJzdHIobC5sZW5ndGgrMSx1Lmxlbmd0aC1sLmxlbmd0aC0xKTtcImRlcHNcIj09PWwmJihsPVwiZGVwc1tdXCIpLFwiW11cIj09PWwuc3Vic3RyKGwubGVuZ3RoLTIsMik/KGw9bC5zdWJzdHIoMCxsLmxlbmd0aC0yKSx0LmxvYWRbbF09dC5sb2FkW2xdfHxbXSx0LmxvYWRbbF0ucHVzaChjKSk6XCJ1c2VcIiE9PWwmJlFlKHQubG9hZCxsLGMpfWVsc2UgdC5sb2FkW3VdPSEwfX19ZnVuY3Rpb24gZXQoKXtmLmNhbGwodGhpcyksdGhpcy5fbG9hZGVyPXt9LHRoaXNbanRdPXt9LHRoaXNbRXRdPXtiYXNlVVJMOm50LHBhdGhzOnt9LHBhY2thZ2VDb25maWdQYXRoczpbXSxwYWNrYWdlQ29uZmlnS2V5czpbXSxtYXA6e30scGFja2FnZXM6e30sZGVwQ2FjaGU6e30sbWV0YTp7fSxidW5kbGVzOnt9LHByb2R1Y3Rpb246ITEsdHJhbnNwaWxlcjp2b2lkIDAsbG9hZGVkQnVuZGxlczp7fSx3YXJuaW5nczohMSxwbHVnaW5GaXJzdDohMSx3YXNtOiExfSx0aGlzLnNjcmlwdFNyYz1kcix0aGlzLl9ub2RlUmVxdWlyZT1lcix0aGlzLnJlZ2lzdHJ5LnNldChcIkBlbXB0eVwiLFN0KSx0dC5jYWxsKHRoaXMsITEsITEpLFh0KHRoaXMpfWZ1bmN0aW9uIHR0KGUsdCl7dGhpc1tFdF0ucHJvZHVjdGlvbj1lLHRoaXMucmVnaXN0cnkuc2V0KFwiQHN5c3RlbS1lbnZcIixPcj10aGlzLm5ld01vZHVsZSh7YnJvd3NlcjpvdCxub2RlOiEhdGhpcy5fbm9kZVJlcXVpcmUscHJvZHVjdGlvbjohdCYmZSxkZXY6dHx8IWUsYnVpbGQ6dCxkZWZhdWx0OiEwfSkpfWZ1bmN0aW9uIHJ0KGUsdCl7Qy5jYWxsKGVbRXRdLFwiU3lzdGVtSlMuXCIrdCtcIiBpcyBkZXByZWNhdGVkIGZvciBTeXN0ZW1KUy5yZWdpc3RyeS5cIit0KX12YXIgbnQsb3Q9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRvY3VtZW50LGl0PVwidW5kZWZpbmVkXCIhPXR5cGVvZiBwcm9jZXNzJiZwcm9jZXNzLnZlcnNpb25zJiZwcm9jZXNzLnZlcnNpb25zLm5vZGUsYXQ9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHByb2Nlc3MmJlwic3RyaW5nXCI9PXR5cGVvZiBwcm9jZXNzLnBsYXRmb3JtJiZwcm9jZXNzLnBsYXRmb3JtLm1hdGNoKC9ed2luLyksc3Q9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjpnbG9iYWwsdXQ9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbDtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgZG9jdW1lbnQmJmRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKXtpZihudD1kb2N1bWVudC5iYXNlVVJJLCFudCl7dmFyIGx0PWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYmFzZVwiKTtudD1sdFswXSYmbHRbMF0uaHJlZnx8d2luZG93LmxvY2F0aW9uLmhyZWZ9fWVsc2VcInVuZGVmaW5lZFwiIT10eXBlb2YgbG9jYXRpb24mJihudD1sb2NhdGlvbi5ocmVmKTtpZihudCl7bnQ9bnQuc3BsaXQoXCIjXCIpWzBdLnNwbGl0KFwiP1wiKVswXTt2YXIgY3Q9bnQubGFzdEluZGV4T2YoXCIvXCIpOy0xIT09Y3QmJihudD1udC5zdWJzdHIoMCxjdCsxKSl9ZWxzZXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgcHJvY2Vzc3x8IXByb2Nlc3MuY3dkKXRocm93IG5ldyBUeXBlRXJyb3IoXCJObyBlbnZpcm9ubWVudCBiYXNlVVJJXCIpO250PVwiZmlsZTovL1wiKyhhdD9cIi9cIjpcIlwiKStwcm9jZXNzLmN3ZCgpLGF0JiYobnQ9bnQucmVwbGFjZSgvXFxcXC9nLFwiL1wiKSl9XCIvXCIhPT1udFtudC5sZW5ndGgtMV0mJihudCs9XCIvXCIpO3ZhciBmdD1cIl9cIj09bmV3IEVycm9yKDAsXCJfXCIpLmZpbGVOYW1lLGR0PVByb21pc2UucmVzb2x2ZSgpO2kucHJvdG90eXBlLmNvbnN0cnVjdG9yPWksaS5wcm90b3R5cGUuaW1wb3J0PWZ1bmN0aW9uKGUscil7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIGUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkxvYWRlciBpbXBvcnQgbWV0aG9kIG11c3QgYmUgcGFzc2VkIGEgbW9kdWxlIGtleSBzdHJpbmdcIik7dmFyIG49dGhpcztyZXR1cm4gZHQudGhlbihmdW5jdGlvbigpe3JldHVybiBuW2d0XShlLHIpfSkudGhlbihhKS5jYXRjaChmdW5jdGlvbihuKXt0aHJvdyB0KG4sXCJMb2FkaW5nIFwiK2UrKHI/XCIgZnJvbSBcIityOlwiXCIpKX0pfTt2YXIgcHQ9aS5yZXNvbHZlPWUoXCJyZXNvbHZlXCIpLGd0PWkucmVzb2x2ZUluc3RhbnRpYXRlPWUoXCJyZXNvbHZlSW5zdGFudGlhdGVcIik7aS5wcm90b3R5cGVbZ3RdPWZ1bmN0aW9uKGUsdCl7dmFyIHI9dGhpcztyZXR1cm4gci5yZXNvbHZlKGUsdCkudGhlbihmdW5jdGlvbihlKXtyZXR1cm4gci5yZWdpc3RyeS5nZXQoZSl9KX0saS5wcm90b3R5cGUucmVzb2x2ZT1mdW5jdGlvbihlLHIpe3ZhciBuPXRoaXM7cmV0dXJuIGR0LnRoZW4oZnVuY3Rpb24oKXtyZXR1cm4gbltwdF0oZSxyKX0pLnRoZW4ocykuY2F0Y2goZnVuY3Rpb24obil7dGhyb3cgdChuLFwiUmVzb2x2aW5nIFwiK2UrKHI/XCIgdG8gXCIrcjpcIlwiKSl9KX07dmFyIGh0PVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5pdGVyYXRvcixtdD1lKFwicmVnaXN0cnlcIik7aHQmJih1LnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZW50cmllcygpW1N5bWJvbC5pdGVyYXRvcl0oKX0sdS5wcm90b3R5cGUuZW50cmllcz1mdW5jdGlvbigpe3ZhciBlPXRoaXNbbXRdO3JldHVybiBvKE9iamVjdC5rZXlzKGUpLm1hcChmdW5jdGlvbih0KXtyZXR1cm5bdCxlW3RdXX0pKX0pLHUucHJvdG90eXBlLmtleXM9ZnVuY3Rpb24oKXtyZXR1cm4gbyhPYmplY3Qua2V5cyh0aGlzW210XSkpfSx1LnByb3RvdHlwZS52YWx1ZXM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzW210XTtyZXR1cm4gbyhPYmplY3Qua2V5cyhlKS5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIGVbdF19KSl9LHUucHJvdG90eXBlLmdldD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpc1ttdF1bZV19LHUucHJvdG90eXBlLnNldD1mdW5jdGlvbihlLHQpe2lmKCEodCBpbnN0YW5jZW9mIGwpKXRocm93IG5ldyBFcnJvcihcIlJlZ2lzdHJ5IG11c3QgYmUgc2V0IHdpdGggYW4gaW5zdGFuY2Ugb2YgTW9kdWxlIE5hbWVzcGFjZVwiKTtyZXR1cm4gdGhpc1ttdF1bZV09dCx0aGlzfSx1LnByb3RvdHlwZS5oYXM9ZnVuY3Rpb24oZSl7cmV0dXJuIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXNbbXRdLGUpfSx1LnByb3RvdHlwZS5kZWxldGU9ZnVuY3Rpb24oZSl7cmV0dXJuIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXNbbXRdLGUpPyhkZWxldGUgdGhpc1ttdF1bZV0sITApOiExfTt2YXIgdnQ9ZShcImJhc2VPYmplY3RcIik7bC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShudWxsKSxcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wudG9TdHJpbmdUYWcmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShsLnByb3RvdHlwZSxTeW1ib2wudG9TdHJpbmdUYWcse3ZhbHVlOlwiTW9kdWxlXCJ9KTt2YXIgeXQ9ZShcInJlZ2lzdGVyLWludGVybmFsXCIpO2YucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoaS5wcm90b3R5cGUpLGYucHJvdG90eXBlLmNvbnN0cnVjdG9yPWY7dmFyIGJ0PWYuaW5zdGFudGlhdGU9ZShcImluc3RhbnRpYXRlXCIpO2YucHJvdG90eXBlW2YucmVzb2x2ZT1pLnJlc29sdmVdPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIG4oZSx0fHxudCl9LGYucHJvdG90eXBlW2J0XT1mdW5jdGlvbihlLHQpe30sZi5wcm90b3R5cGVbaS5yZXNvbHZlSW5zdGFudGlhdGVdPWZ1bmN0aW9uKGUsdCl7dmFyIHI9dGhpcyxuPXRoaXNbeXRdLG89ci5yZWdpc3RyeVtyLnJlZ2lzdHJ5Ll9yZWdpc3RyeV07cmV0dXJuIHAocixlLHQsbyxuKS50aGVuKGZ1bmN0aW9uKGUpe3JldHVybiBlIGluc3RhbmNlb2YgbD9lOmUubW9kdWxlP2UubW9kdWxlOmUubGlua1JlY29yZC5saW5rZWQ/TyhyLGUsZS5saW5rUmVjb3JkLG8sbix2b2lkIDApOncocixlLGUubGlua1JlY29yZCxvLG4sW2VdKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIE8ocixlLGUubGlua1JlY29yZCxvLG4sdm9pZCAwKX0pLmNhdGNoKGZ1bmN0aW9uKHQpe3Rocm93IGsocixlKSx0fSl9KX0sZi5wcm90b3R5cGUucmVnaXN0ZXI9ZnVuY3Rpb24oZSx0LHIpe3ZhciBuPXRoaXNbeXRdO2lmKHZvaWQgMD09PXIpbi5sYXN0UmVnaXN0ZXI9W2UsdCx2b2lkIDBdO2Vsc2V7dmFyIG89bi5yZWNvcmRzW2VdfHxkKG4sZSx2b2lkIDApO28ucmVnaXN0cmF0aW9uPVt0LHIsdm9pZCAwXX19LGYucHJvdG90eXBlLnJlZ2lzdGVyRHluYW1pYz1mdW5jdGlvbihlLHQscixuKXt2YXIgbz10aGlzW3l0XTtpZihcInN0cmluZ1wiIT10eXBlb2YgZSlvLmxhc3RSZWdpc3Rlcj1bZSx0LHJdO2Vsc2V7dmFyIGk9by5yZWNvcmRzW2VdfHxkKG8sZSx2b2lkIDApO2kucmVnaXN0cmF0aW9uPVt0LHIsbl19fSx4LnByb3RvdHlwZS5pbXBvcnQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMubG9hZGVyLnRyYWNlJiZ5KHRoaXMubG9hZGVyLHRoaXMua2V5LGUpLHRoaXMubG9hZGVyLmltcG9ydChlLHRoaXMua2V5KX07dmFyIHd0PXt9O09iamVjdC5mcmVlemUmJk9iamVjdC5mcmVlemUod3QpO3ZhciBrdCx4dCxPdD1Qcm9taXNlLnJlc29sdmUoKSxTdD1uZXcgbCh7fSksRXQ9ZShcImxvYWRlci1jb25maWdcIiksanQ9ZShcIm1ldGFkYXRhXCIpLF90PVwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgaW1wb3J0U2NyaXB0cyxSdD0hMSxNdD0hMTtpZihvdCYmZnVuY3Rpb24oKXt2YXIgZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKS5yZWxMaXN0O2lmKGUmJmUuc3VwcG9ydHMpe010PSEwO3RyeXtSdD1lLnN1cHBvcnRzKFwicHJlbG9hZFwiKX1jYXRjaChlKXt9fX0oKSxvdCl7dmFyIFB0PVtdLEN0PXdpbmRvdy5vbmVycm9yO3dpbmRvdy5vbmVycm9yPWZ1bmN0aW9uKGUsdCl7Zm9yKHZhciByPTA7cjxQdC5sZW5ndGg7cisrKWlmKFB0W3JdLnNyYz09PXQpcmV0dXJuIHZvaWQgUHRbcl0uZXJyKGUpO0N0JiZDdC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fXZhciBMdCxBdCxJdD0vKD86XlxcdUZFRkY/fFteJF9hLXpBLVpcXHhBMC1cXHVGRkZGLlwiJ10pcmVxdWlyZVxccypcXChcXHMqKFwiW15cIlxcXFxdKig/OlxcXFwuW15cIlxcXFxdKikqXCJ8J1teJ1xcXFxdKig/OlxcXFwuW14nXFxcXF0qKSonKVxccypcXCkvZyxGdD1cInVuZGVmaW5lZFwiIT10eXBlb2YgWE1MSHR0cFJlcXVlc3Q7QXQ9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmLmZldGNoP0o6RnQ/JDpcInVuZGVmaW5lZFwiIT10eXBlb2YgcmVxdWlyZSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHByb2Nlc3M/QjpXO3ZhciBLdD1BdCxEdD17fSxxdD1bXCJicm93c2VyXCIsXCJub2RlXCIsXCJkZXZcIixcImJ1aWxkXCIsXCJwcm9kdWN0aW9uXCIsXCJkZWZhdWx0XCJdLFR0PS8jXFx7W15cXH1dK1xcfS8sVXQ9W1wiYnJvd3NlckNvbmZpZ1wiLFwibm9kZUNvbmZpZ1wiLFwiZGV2Q29uZmlnXCIsXCJidWlsZENvbmZpZ1wiLFwicHJvZHVjdGlvbkNvbmZpZ1wiXSx6dD1cInVuZGVmaW5lZFwiIT10eXBlb2YgQnVmZmVyO3RyeXt6dCYmXCJZUT09XCIhPT1uZXcgQnVmZmVyKFwiYVwiKS50b1N0cmluZyhcImJhc2U2NFwiKSYmKHp0PSExKX1jYXRjaChlKXt6dD0hMX12YXIgTnQsSnQsJHQsQnQsV3Q9XCJcXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLEd0PTAsSHQ9ITE7b3QmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCYmZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUmJih3aW5kb3cuY2hyb21lJiZ3aW5kb3cuY2hyb21lLmV4dGVuc2lvbnx8bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvXk5vZGVcXC5qcy8pfHwoSHQ9ITApKTt2YXIgWnQsWHQ9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdChyLG4sbyxpKXtpZihcIm9iamVjdFwiPT10eXBlb2YgciYmIShyIGluc3RhbmNlb2YgQXJyYXkpKXJldHVybiB0LmFwcGx5KG51bGwsQXJyYXkucHJvdG90eXBlLnNwbGljZS5jYWxsKGFyZ3VtZW50cywxLGFyZ3VtZW50cy5sZW5ndGgtMSkpO2lmKFwic3RyaW5nXCI9PXR5cGVvZiByJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYocj1bcl0pLCEociBpbnN0YW5jZW9mIEFycmF5KSl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHIpe3ZhciBhPWUuZGVjYW5vbmljYWxpemUocixpKSxzPWUuZ2V0KGEpO2lmKCFzKXRocm93IG5ldyBFcnJvcignTW9kdWxlIG5vdCBhbHJlYWR5IGxvYWRlZCBsb2FkaW5nIFwiJytyKydcIiBhcyAnK2ErKGk/JyBmcm9tIFwiJytpKydcIi4nOlwiLlwiKSk7cmV0dXJuIHMuX191c2VEZWZhdWx0P3MuZGVmYXVsdDpzfXRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIHJlcXVpcmVcIil9Zm9yKHZhciB1PVtdLGw9MDtsPHIubGVuZ3RoO2wrKyl1LnB1c2goZS5pbXBvcnQocltsXSxpKSk7UHJvbWlzZS5hbGwodSkudGhlbihmdW5jdGlvbihlKXtmb3IodmFyIHQ9MDt0PGUubGVuZ3RoO3QrKyllW3RdPWVbdF0uX191c2VEZWZhdWx0P2VbdF0uZGVmYXVsdDplW3RdO24mJm4uYXBwbHkobnVsbCxlKX0sbyl9ZnVuY3Rpb24gcihyLG4sbyl7ZnVuY3Rpb24gaShyLGksbCl7Zm9yKHZhciBjPVtdLGY9MDtmPG4ubGVuZ3RoO2YrKyljLnB1c2gocihuW2ZdKSk7aWYobC51cmk9bC5pZCxsLmNvbmZpZz1SLC0xIT09dSYmYy5zcGxpY2UodSwwLGwpLC0xIT09cyYmYy5zcGxpY2UocywwLGkpLC0xIT09YSl7dmFyIGQ9ZnVuY3Rpb24obixvLGkpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBuJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBvP3Iobik6dC5jYWxsKGUsbixvLGksbC5pZCl9O2QudG9Vcmw9ZnVuY3Rpb24odCl7cmV0dXJuIGUubm9ybWFsaXplU3luYyh0LGwuaWQpfSxjLnNwbGljZShhLDAsZCl9dmFyIHA9c3QucmVxdWlyZTtzdC5yZXF1aXJlPXQ7dmFyIGc9by5hcHBseSgtMT09PXM/c3Q6aSxjKTtzdC5yZXF1aXJlPXAsXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGcmJihsLmV4cG9ydHM9Zyl9XCJzdHJpbmdcIiE9dHlwZW9mIHImJihvPW4sbj1yLHI9bnVsbCksbiBpbnN0YW5jZW9mIEFycmF5fHwobz1uLG49W1wicmVxdWlyZVwiLFwiZXhwb3J0c1wiLFwibW9kdWxlXCJdLnNwbGljZSgwLG8ubGVuZ3RoKSksXCJmdW5jdGlvblwiIT10eXBlb2YgbyYmKG89ZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGV9fShvKSkscnx8VnQmJihuPW4uY29uY2F0KFZ0KSxWdD12b2lkIDApO3ZhciBhLHMsdTstMSE9PShhPW4uaW5kZXhPZihcInJlcXVpcmVcIikpJiYobi5zcGxpY2UoYSwxKSxyfHwobj1uLmNvbmNhdChxZShvLnRvU3RyaW5nKCksYSkpKSksLTEhPT0ocz1uLmluZGV4T2YoXCJleHBvcnRzXCIpKSYmbi5zcGxpY2UocywxKSwtMSE9PSh1PW4uaW5kZXhPZihcIm1vZHVsZVwiKSkmJm4uc3BsaWNlKHUsMSkscj8oZS5yZWdpc3RlckR5bmFtaWMocixuLCExLGkpLFF0PyhRdD12b2lkIDAsbHI9ITApOmxyfHwoUXQ9W24saV0pKTplLnJlZ2lzdGVyRHluYW1pYyhuLCExLGNyP1RlKGkpOmkpfWUuc2V0KFwiQEBjanMtaGVscGVyc1wiLGUubmV3TW9kdWxlKHtyZXF1aXJlUmVzb2x2ZTpMZS5iaW5kKGUpLGdldFBhdGhWYXJzOkFlfSkpLGUuc2V0KFwiQEBnbG9iYWwtaGVscGVyc1wiLGUubmV3TW9kdWxlKHtwcmVwYXJlR2xvYmFsOkRlfSkpLHIuYW1kPXt9LGUuYW1kRGVmaW5lPXIsZS5hbWRSZXF1aXJlPXR9O1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCYmd2luZG93LmxvY2F0aW9uJiYoWnQ9bG9jYXRpb24ucHJvdG9jb2wrXCIvL1wiK2xvY2F0aW9uLmhvc3RuYW1lKyhsb2NhdGlvbi5wb3J0P1wiOlwiK2xvY2F0aW9uLnBvcnQ6XCJcIikpO3ZhciBZdCxRdCxWdCxlcix0cj0vKF58W15cXFxcXSkoXFwvXFwqKFtcXHNcXFNdKj8pXFwqXFwvfChbXjpdfF4pXFwvXFwvKC4qKSQpL2dtLHJyPS8oXCJbXlwiXFxcXFxcblxccl0qKFxcXFwuW15cIlxcXFxcXG5cXHJdKikqXCJ8J1teJ1xcXFxcXG5cXHJdKihcXFxcLlteJ1xcXFxcXG5cXHJdKikqJykvZyxucj1bXCJfZ1wiLFwic2Vzc2lvblN0b3JhZ2VcIixcImxvY2FsU3RvcmFnZVwiLFwiY2xpcGJvYXJkRGF0YVwiLFwiZnJhbWVzXCIsXCJmcmFtZUVsZW1lbnRcIixcImV4dGVybmFsXCIsXCJtb3pBbmltYXRpb25TdGFydFRpbWVcIixcIndlYmtpdFN0b3JhZ2VJbmZvXCIsXCJ3ZWJraXRJbmRleGVkREJcIixcIm1veklubmVyU2NyZWVuWVwiLFwibW96SW5uZXJTY3JlZW5YXCJdLG9yPVwiKD86XnxbXiRfYS16QS1aXFxcXHhBMC1cXFxcdUZGRkYuXSlcIixpcj1cIlxcXFxzKlxcXFwoXFxcXHMqKFxcXCIoW15cXFwiXSspXFxcInwnKFteJ10rKScpXFxcXHMqXFxcXClcIixhcj0vXFwoKFteXFwpXSopXFwpLyxzcj0vXlxccyt8XFxzKyQvZyx1cj17fSxscj0hMSxjcj0hMSxmcj0ob3R8fF90KSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG5hdmlnYXRvciYmbmF2aWdhdG9yLnVzZXJBZ2VudCYmIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgKDl8MTApLjAvKTtcInVuZGVmaW5lZFwiPT10eXBlb2YgcmVxdWlyZXx8XCJ1bmRlZmluZWRcIj09dHlwZW9mIHByb2Nlc3N8fHByb2Nlc3MuYnJvd3Nlcnx8KGVyPXJlcXVpcmUpO3ZhciBkcixwcj1cInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9cInNlbGZcIjpcImdsb2JhbFwiLGdyPS8oXlxccyp8W31cXCk7XFxuXVxccyopKGltcG9ydFxccyooWydcIl18KFxcKlxccythc1xccyspP1teXCInXFwoXFwpXFxuO10rXFxzKmZyb21cXHMqWydcIl18XFx7KXxleHBvcnRcXHMrXFwqXFxzK2Zyb21cXHMrW1wiJ118ZXhwb3J0XFxzKihcXHt8ZGVmYXVsdHxmdW5jdGlvbnxjbGFzc3x2YXJ8Y29uc3R8bGV0fGFzeW5jXFxzK2Z1bmN0aW9uKSkvLGhyPS9eKFxccypcXC9cXCpbXlxcKl0qKFxcKig/IVxcLylbXlxcKl0qKSpcXCpcXC98XFxzKlxcL1xcL1teXFxuXSp8XFxzKlwiW15cIl0rXCJcXHMqOz98XFxzKidbXiddKydcXHMqOz8pKlxccyovLG1yPS8oPzpeXFx1RkVGRj98W14kX2EtekEtWlxceEEwLVxcdUZGRkYuXSlkZWZpbmVcXHMqXFwoXFxzKihcIlteXCJdK1wiXFxzKixcXHMqfCdbXiddKydcXHMqLFxccyopP1xccyooXFxbKFxccyooKFwiW15cIl0rXCJ8J1teJ10rJylcXHMqLHxcXC9cXC8uKlxccj9cXG58XFwvXFwqKC58XFxzKSo/XFwqXFwvKSkqKFxccyooXCJbXlwiXStcInwnW14nXSsnKVxccyosPyk/KFxccyooXFwvXFwvLipcXHI/XFxufFxcL1xcKigufFxccykqP1xcKlxcLykpKlxccypcXF18ZnVuY3Rpb25cXHMqfHt8W18kYS16QS1aXFx4QTAtXFx1RkZGRl1bXyRhLXpBLVowLTlcXHhBMC1cXHVGRkZGXSpcXCkpLyx2cj0vKD86XlxcdUZFRkY/fFteJF9hLXpBLVpcXHhBMC1cXHVGRkZGLl0pKGV4cG9ydHNcXHMqKFxcW1snXCJdfFxcLil8bW9kdWxlKFxcLmV4cG9ydHN8XFxbJ2V4cG9ydHMnXFxdfFxcW1wiZXhwb3J0c1wiXFxdKVxccyooXFxbWydcIl18Wz0sXFwuXSkpLyx5cj0vXlxcI1xcIS4qLyxicj0vXihcXHMqXFwvXFwqW15cXCpdKihcXCooPyFcXC8pW15cXCpdKikqXFwqXFwvfFxccypcXC9cXC9bXlxcbl0qfFxccypcIlteXCJdK1wiXFxzKjs/fFxccyonW14nXSsnXFxzKjs/KSsvLHdyPS9cXC9cXCpbXlxcKl0qKFxcKig/IVxcLylbXlxcKl0qKSpcXCpcXC98XFwvXFwvW15cXG5dKnxcIlteXCJdK1wiXFxzKjs/fCdbXiddKydcXHMqOz8vZztpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgUHJvbWlzZSl0aHJvdyBuZXcgRXJyb3IoXCJTeXN0ZW1KUyBuZWVkcyBhIFByb21pc2UgcG9seWZpbGwuXCIpO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCl7dmFyIGtyPWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpLHhyPWtyW2tyLmxlbmd0aC0xXTtkb2N1bWVudC5jdXJyZW50U2NyaXB0JiYoeHIuZGVmZXJ8fHhyLmFzeW5jKSYmKHhyPWRvY3VtZW50LmN1cnJlbnRTY3JpcHQpLGRyPXhyJiZ4ci5zcmN9ZWxzZSBpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgaW1wb3J0U2NyaXB0cyl0cnl7dGhyb3cgbmV3IEVycm9yKFwiX1wiKX1jYXRjaChlKXtlLnN0YWNrLnJlcGxhY2UoLyg/OmF0fEApLiooaHR0cC4rKTpbXFxkXSs6W1xcZF0rLyxmdW5jdGlvbihlLHQpe2RyPXR9KX1lbHNlXCJ1bmRlZmluZWRcIiE9dHlwZW9mIF9fZmlsZW5hbWUmJihkcj1fX2ZpbGVuYW1lKTt2YXIgT3I7ZXQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZi5wcm90b3R5cGUpLGV0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1ldCxldC5wcm90b3R5cGVbZXQucmVzb2x2ZT1mLnJlc29sdmVdPWV0LnByb3RvdHlwZS5ub3JtYWxpemU9WixldC5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihlLHQpe3JldHVybiBDLmNhbGwodGhpc1tFdF0sXCJTeXN0ZW0ubG9hZCBpcyBkZXByZWNhdGVkLlwiKSx0aGlzLmltcG9ydChlLHQpfSxldC5wcm90b3R5cGUuZGVjYW5vbmljYWxpemU9ZXQucHJvdG90eXBlLm5vcm1hbGl6ZVN5bmM9ZXQucHJvdG90eXBlLnJlc29sdmVTeW5jPVksZXQucHJvdG90eXBlW2V0Lmluc3RhbnRpYXRlPWYuaW5zdGFudGlhdGVdPUplLGV0LnByb3RvdHlwZS5jb25maWc9eGUsZXQucHJvdG90eXBlLmdldENvbmZpZz1rZSxldC5wcm90b3R5cGUuZ2xvYmFsPXN0LGV0LnByb3RvdHlwZS5pbXBvcnQ9ZnVuY3Rpb24oKXtyZXR1cm4gZi5wcm90b3R5cGUuaW1wb3J0LmFwcGx5KHRoaXMsYXJndW1lbnRzKS50aGVuKGZ1bmN0aW9uKGUpe3JldHVybiBlLl9fdXNlRGVmYXVsdD9lLmRlZmF1bHQ6ZX0pfTtmb3IodmFyIFNyPVtcImJhc2VVUkxcIixcIm1hcFwiLFwicGF0aHNcIixcInBhY2thZ2VzXCIsXCJwYWNrYWdlQ29uZmlnUGF0aHNcIixcImRlcENhY2hlXCIsXCJtZXRhXCIsXCJidW5kbGVzXCIsXCJ0cmFuc3BpbGVyXCIsXCJ3YXJuaW5nc1wiLFwicGx1Z2luRmlyc3RcIixcInByb2R1Y3Rpb25cIixcIndhc21cIl0sRXI9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFByb3h5LGpyPTA7anI8U3IubGVuZ3RoO2pyKyspKGZ1bmN0aW9uKGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShldC5wcm90b3R5cGUsZSx7Z2V0OmZ1bmN0aW9uKCl7dmFyIHQ9d2UodGhpc1tFdF0sZSk7cmV0dXJuIEVyJiZcIm9iamVjdFwiPT10eXBlb2YgdCYmKHQ9bmV3IFByb3h5KHQse3NldDpmdW5jdGlvbih0LHIpe3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBzZXQgU3lzdGVtSlMuXCIrZSsnW1wiJytyKydcIl0gZGlyZWN0bHkuIFVzZSBTeXN0ZW1KUy5jb25maWcoeyAnK2UrJzogeyBcIicrcisnXCI6IC4uLiB9IH0pIHJhdGhlci4nKX19KSksdH0sc2V0OmZ1bmN0aW9uKHQpe3Rocm93IG5ldyBFcnJvcihcIlNldHRpbmcgYFN5c3RlbUpTLlwiK2UrXCJgIGRpcmVjdGx5IGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQuIFVzZSBgU3lzdGVtSlMuY29uZmlnKHsgXCIrZStcIjogLi4uIH0pYC5cIil9fSl9KShTcltqcl0pO2V0LnByb3RvdHlwZS5kZWxldGU9ZnVuY3Rpb24oZSl7cnQodGhpcyxcImRlbGV0ZVwiKSx0aGlzLnJlZ2lzdHJ5LmRlbGV0ZShlKX0sZXQucHJvdG90eXBlLmdldD1mdW5jdGlvbihlKXtyZXR1cm4gcnQodGhpcyxcImdldFwiKSx0aGlzLnJlZ2lzdHJ5LmdldChlKX0sZXQucHJvdG90eXBlLmhhcz1mdW5jdGlvbihlKXtyZXR1cm4gcnQodGhpcyxcImhhc1wiKSx0aGlzLnJlZ2lzdHJ5LmhhcyhlKX0sZXQucHJvdG90eXBlLnNldD1mdW5jdGlvbihlLHQpe3JldHVybiBydCh0aGlzLFwic2V0XCIpLHRoaXMucmVnaXN0cnkuc2V0KGUsdCl9LGV0LnByb3RvdHlwZS5uZXdNb2R1bGU9ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBsKGUpfSxldC5wcm90b3R5cGUuaXNNb2R1bGU9UCxldC5wcm90b3R5cGUucmVnaXN0ZXI9ZnVuY3Rpb24oZSx0LHIpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBlJiYoZT1YLmNhbGwodGhpcyx0aGlzW0V0XSxlKSksZi5wcm90b3R5cGUucmVnaXN0ZXIuY2FsbCh0aGlzLGUsdCxyKX0sZXQucHJvdG90eXBlLnJlZ2lzdGVyRHluYW1pYz1mdW5jdGlvbihlLHQscixuKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZSYmKGU9WC5jYWxsKHRoaXMsdGhpc1tFdF0sZSkpLGYucHJvdG90eXBlLnJlZ2lzdGVyRHluYW1pYy5jYWxsKHRoaXMsZSx0LHIsbil9LGV0LnByb3RvdHlwZS52ZXJzaW9uPVwiMC4yMC4xMCBEZXZcIjt2YXIgX3I9bmV3IGV0OyhvdHx8X3QpJiYoc3QuU3lzdGVtSlM9c3QuU3lzdGVtPV9yKSxcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPV9yKX0oKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5c3RlbS5qcy5tYXBcbiIsIi8qICAgIENvcHlyaWdodCAyMDE3IEpvY2x5XG4gKlxuICogICAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciAgbW9kaWZ5XG4gKiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSwgdmVyc2lvbiAzLFxuICogICAgYXMgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogICAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogICAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiAgICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiAgICBBcyBhIHNwZWNpYWwgZXhjZXB0aW9uLCB0aGUgY29weXJpZ2h0IGhvbGRlcnMgZ2l2ZSBwZXJtaXNzaW9uIHRvIGxpbmsgdGhlXG4gKiAgICBjb2RlIG9mIHBvcnRpb25zIG9mIHRoaXMgcHJvZ3JhbSB3aXRoIHRoZSBPcGVuU1NMIGxpYnJhcnkgdW5kZXIgY2VydGFpblxuICogICAgY29uZGl0aW9ucyBhcyBkZXNjcmliZWQgaW4gZWFjaCBpbmRpdmlkdWFsIHNvdXJjZSBmaWxlIGFuZCBkaXN0cmlidXRlXG4gKiAgICBsaW5rZWQgY29tYmluYXRpb25zIGluY2x1ZGluZyB0aGUgcHJvZ3JhbSB3aXRoIHRoZSBPcGVuU1NMIGxpYnJhcnkuIFlvdVxuICogICAgbXVzdCBjb21wbHkgd2l0aCB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGluIGFsbCByZXNwZWN0c1xuICogICAgZm9yIGFsbCBvZiB0aGUgY29kZSB1c2VkIG90aGVyIHRoYW4gYXMgcGVybWl0dGVkIGhlcmVpbi4gSWYgeW91IG1vZGlmeVxuICogICAgZmlsZShzKSB3aXRoIHRoaXMgZXhjZXB0aW9uLCB5b3UgbWF5IGV4dGVuZCB0aGlzIGV4Y2VwdGlvbiB0byB5b3VyXG4gKiAgICB2ZXJzaW9uIG9mIHRoZSBmaWxlKHMpLCBidXQgeW91IGFyZSBub3Qgb2JsaWdhdGVkIHRvIGRvIHNvLiBJZiB5b3UgZG8gbm90XG4gKiAgICB3aXNoIHRvIGRvIHNvLCBkZWxldGUgdGhpcyBleGNlcHRpb24gc3RhdGVtZW50IGZyb20geW91ciB2ZXJzaW9uLiBJZiB5b3VcbiAqICAgIGRlbGV0ZSB0aGlzIGV4Y2VwdGlvbiBzdGF0ZW1lbnQgZnJvbSBhbGwgc291cmNlIGZpbGVzIGluIHRoZSBwcm9ncmFtLFxuICogICAgdGhlbiBhbHNvIGRlbGV0ZSBpdCBpbiB0aGUgbGljZW5zZSBmaWxlLlxuICovXG5cbmNvbnN0IFN5c3RlbUpTID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9zeXN0ZW1qcy9kaXN0L3N5c3RlbS5qc1wiKTtcblxuZnVuY3Rpb24gR2V0U2NyaXB0UGF0aCgpIHtcbiAgICB2YXIgc2NyaXB0cz0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xuICAgIHZhciBwYXRoPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoLTFdLnNyYy5zcGxpdCgnPycpWzBdO1xuICAgIHZhciBteWRpcj0gcGF0aC5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5qb2luKCcvJykrJy8nO1xuICAgIHJldHVybiBuZXcgVVJMKG15ZGlyKS5wYXRobmFtZTtcbn1cblxuY29uc3Qgam9jbHlTY3JpcHRQYXRoID0gR2V0U2NyaXB0UGF0aCgpO1xuXG5TeXN0ZW1KUy5jb25maWcoe1xuICAgIGJhc2VVUkw6IGpvY2x5U2NyaXB0UGF0aFxufSk7XG5cbmZ1bmN0aW9uIEV4cG9ydEZ1bmN0aW9uKGZOYW1lKSB7XG4gICAgZXhwb3J0c1tmTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e1xuICAgICAgICAgICAgU3lzdGVtSlMuaW1wb3J0KFwiam9jbHkuY29yZS5qc1wiKS50aGVuKChtKT0+e1xuICAgICAgICAgICAgICAgIG1bZk5hbWVdLmFwcGx5KG0sYXJncykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZS5hcHBseShudWxsLGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfSwoZSk9PntcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwoZSk9PntcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbn1cblxuW1wibGlzdEdhbWVzXCIsXCJjcmVhdGVHYW1lXCIsXCJjcmVhdGVJbnRlcm5hbEdhbWVcIl0uZm9yRWFjaCgoZk5hbWUpPT57XG4gICAgRXhwb3J0RnVuY3Rpb24oZk5hbWUpO1xufSk7XG5cbiJdfQ==
