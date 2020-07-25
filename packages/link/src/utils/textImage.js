const Jimp = require('jimp')

const textImage = ({
  text = '',
  width = 80,
  height = 80,
  background = '#000007ff',
  color
}) => {
  const image = new Jimp(width, height, background)
  return Jimp.loadFont(Jimp['FONT_SANS_' + 16 + '_' + color.toUpperCase()])
    .then(font => {
      image.print(
        font,
        0,
        (image.bitmap.height / 2.7) - (font.common.lineHeight / 2),
        {
          text: text,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
        },
        image.bitmap.width,
        image.bitmap.height
        // Jimp.ALIGN_FONT_CENTER
      )
    })
    .then(() => {
      return image.getBufferAsync('image/bmp')
    }).then(buffer => {
      return buffer
    })
}

export { textImage }
