const Jimp = require('jimp')
const sharp = require('sharp')

const textImage = ({
  text = '',
  width = 80,
  height = 80,
  background = '#0ffe62ff', // RBGA
  color
}) => {
  const image = new Jimp(width, height, background)
  return Jimp.loadFont(Jimp['FONT_SANS_' + 16 + '_' + color.toUpperCase()])
    .then(font => {
      image.print(
        font,
        0,
        (image.bitmap.height / 2) - (font.common.lineHeight / text.split('\n').length),
        {
          text: text,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
        },
        image.bitmap.width,
        image.bitmap.height
      )
    })
    .then(() => {
      return image.getBufferAsync('image/bmp')
    }).then(buffer => {
      return buffer
    })
}

const writeTextToButton = ({ text, device, buttonIndex, background, color }) => {
  textImage({
    text: text,
    width: device.controller.ICON_SIZE,
    height: device.controller.ICON_SIZE,
    background: background,
    color: color || 'white'
  })
    .then(_buffer => {
      device.controller.fillImage(buttonIndex, _buffer.slice(50, 19250))
    })
}

const writeImageToButton = (device, buttonIndex, path) => {
  sharp(path)
    .flatten()
    .resize(device.controller.ICON_SIZE, device.controller.ICON_SIZE)
    .raw()
    .toBuffer()
    .then(buffer => {
      device.controller.fillImage(buttonIndex, buffer)
    })
    .catch(err => {
      console.error(err)
    })
}

export { writeTextToButton, writeImageToButton }
