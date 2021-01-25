/**
 * Chunk an array
 *
 * @param {!number} chunkSize
 * @param {!Array.} array
 * @return {Array.}
 *
 * @example
 *     arrayChunk(['Apple', 'Google', 'FaceBook'], 1)
 */

const arrayChunk = (array, chunkSize) => {
  var R = []
  for (var i = 0; i < array.length; i += chunkSize) {
    R.push(array.slice(i, i + chunkSize))
  }
  return R
}

/**
 * Pad an array to specified length
 *
 * @param {!number} length
 * @param {!Array.} array
 * @return {Array.}
 *
 * @example
 *     arrayChunk(['Apple', 'Google', 'FaceBook'], 1)
 */
const arrayPad = (array, length) => {
  var padding = []
  var padsToAdd = length - array.length
  for (var i = 0; i < padsToAdd; i++) {
    padding.push({ isPadding: true })
  }
  return array.concat(padding)
}

export { arrayChunk, arrayPad }