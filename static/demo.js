/**
 * Created by devinshine on 2017/6/18.
 */

// TODO: Const 你自己优化放哪
var RADIX = 256
var MODULUS = Number.MAX_VALUE

function RabinKarp2D (pattern) {
  this.pattern = pattern
  this.height = pattern.length
  this.width = pattern[0].length
  this.factors = new Array((this.height - 1) + (this.width - 1) + 1)
  this.factors[0] = 1
  for (var i = 1; i < this.factors.length; i++) {
    this.factors[i] = (RADIX * this.factors[i - 1]) % MODULUS
  }
  this.patternHash = this.hash(pattern)
}

RabinKarp2D.prototype.hash = function (data) {
  var result = 0
  for (var i = 0; i < this.height; i++) {
    var rowHash = 0
    for (var j = 0; j < this.width; j++) {
      rowHash = (RADIX * rowHash + data[i][j]) % MODULUS
    }
    result = (RADIX * result + rowHash) % MODULUS
  }
  return result
}

RabinKarp2D.prototype.check = function (text, i, j) {
  var x = i
  var y = j
  for (var a = 0; a < this.height; a++) {
    for (var b = 0; b < this.width; b++) {
      if (text[x][y] !== this.pattern[a][b]) {
        return false
      }
      y++
    }
    x++
    y = j
  }
  return true
}

RabinKarp2D.prototype.getFactors = function () {
  return this.factors
}

RabinKarp2D.prototype.search = function (text) {
  var rowStartHash = this.hash(text)
  var hash = rowStartHash
  for (var i = 0; i <= text.length - this.height/* I added the -1 here */; i++) {
    if ((hash === this.patternHash) && this.check(text, i, 0)) {
      return [i, 0]
    }
    for (var j = 0; j < text[0].length - this.width; j++) {
      hash = this.shiftRight(hash, text, i, j)
      if ((hash === this.patternHash) && this.check(text, i, j + 1)) {
        return [i, j + 1]
      }
    }
    rowStartHash = this.shiftDown(rowStartHash, text, i)
    hash = rowStartHash
  }
  return null
}

RabinKarp2D.prototype.shiftDown = function (hash, text, i) {
// compute the hash of row i
  var xI = 0
  var j = 0
  for (; j < this.width; j++) {
    xI = (RADIX * xI + text[i][j]) % MODULUS
  }
    // shift the hash of row i out of the hash of the block
  hash = (hash + MODULUS - this.factors[this.width - 1] * xI) % MODULUS
    // add the hash of row i+height to the hash of the block
  var x = 0
  for (j = 0; j < this.width; j++) {
    if (text[i + this.height] && text[i + this.height][j]) {
      x = (RADIX * x + text[i + this.height][j]) % MODULUS
    }
  }
  hash = (hash * RADIX + x) % MODULUS
  return hash
}

RabinKarp2D.prototype.shiftRight = function (hash, text, i, j) {
  var result = hash
  var degree = this.height + this.width - 2 // The exponent to keep track of.

    /** Subtracts first col */
  var xI = 0
  for (var offset = 0; offset < this.height; offset++) {
    xI = (xI + (text[i + offset][j] * this.factors[degree])) % MODULUS
    degree--
  }

  result = (result + MODULUS - xI) % MODULUS
    /** Multiply by RADIX. */
  result *= RADIX

  var x = 0
  for (var k = 0; k < this.height; k++) {
    x = (RADIX * x + text[i + k][j + this.width]) % MODULUS
  }
  result = (result + x) % MODULUS
  return result
}

// testText = [
//     ['0', '0', '1', '1'],
//     ['1', '1', '0', '0'],
//     ['1', '1', '0', '0'],
//     ['0', '0', '1', '1']
// ];
// testPattern = [
//     ['0', '0'],
//     ['0', '0']
// ];
// var rk2d = new RabinKarp2D(testPattern);
// console.log(rk2d.search(testText));

// TODO
// var FN_WIDTH = 4
// var FN_HEIGHT = 4

/**
 *
 * @param {Object} a 以JSON形式输入已存在的块，已存在的块必然不会重叠
 * @param {Object} b 当前模块的高宽位置
 * @return {*} 返回值为 null 即表示没有合适填充的位置，不是 null 则返回可填充区域的[left,top]
 */
function fn (a, b, FN_WIDTH, FN_HEIGHT) {
    // create area
  if (!a && !b && !FN_WIDTH && !FN_HEIGHT) {
    return null
  }
  var area = []
  for (var i = 0; i < FN_HEIGHT; i++) {
    var row = new Array(FN_WIDTH).fill('0')
    area.push(row)
  }
    // fill block area
  for (var index in a) {
    var item = a[index]
    var y = item.top
    var x = item.left
    for (var j = 0; j < item.h; j++) {
      for (var k = 0; k < item.w; k++) {
        area[y + j][x + k] = '1'
      }
    }
  }
  if (b.top !== undefined && b.left !== undefined) {
    y = b.top
    x = b.left
    for (j = 0; j < b.h; j++) {
      for (k = 0; k < b.w; k++) {
        if (area[y + j][x + k] === '1') {
          return null
        }
      }
    }
    return [x, y]
  } else {
        // create filled area
    var filledSize = []
    for (i = 0; i < b.h; i++) {
      row = new Array(b.w).fill('0')
      filledSize.push(row)
    }

    var rk2d = new RabinKarp2D(filledSize)
    var rk2dResult = rk2d.search(area)
    if (rk2dResult) {
      return [rk2dResult[1], rk2dResult[0]]
    } else {
      return null
    }
  }
}
export default fn
// fn()
// var result = fn([{w: 2, h: 2, top: 1, left: 0}, {w: 2, h: 1, top: 0, left: 2}, {w: 2, h: 1, top: 3, left: 2}], {w: 2, h: 2}, 4, 4)
// console.log(result)
// result = fn([{w: 2, h: 2, top: 1, left: 0}, {w: 2, h: 1, top: 0, left: 2}, {w: 2, h: 1, top: 3, left: 2}], {w: 2, h: 2, top: 1, left: 2}, 4, 4)
// console.log(result)
