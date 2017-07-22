// rgba字符串转成标准格式，转换成16进制
export function rgbaTransform (backgroundColor) {
  if (!backgroundColor) {
    return false
  }
  let setColor = {
    hex: '#',
    rgba: {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    }
  }
  let rbga = ((backgroundColor.split('('))[1].split(')'))[0].split(',')
  let i = 0
  for (let attr in setColor.rgba) {
    setColor.rgba[attr] = parseFloat(rbga[i])
    if (i < rbga.length - 1) {
      setColor.hex += ('0' + Number(rbga[i]).toString(16)).slice(-2)
    }
    i++
  }

  return setColor
}

// 字符串长度校验
export function getLength (str) {
  if (str == null) return 0
  if (typeof str !== 'string') {
    str += ''
  }
  return str.replace(/[^\x00-\xff]/g, '01').length
}

// 纯英文校验
export function englishOnly (str) {
  return /^[A-Za-z]+$/.test(str)
}

// 英文数字校验
export function engAndNumber (str) {
  return /^[A-Za-z0-9]+$/.test(str)
}

// 16进制颜色格式校验
export function colorHex (str) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str)
}

// 补齐0位
export function addZero (number) {
  return number < 10 ? '0' + number : number
}

// export default {
//   getLength
// }
