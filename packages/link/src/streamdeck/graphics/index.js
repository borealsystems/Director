const Jimp = require('jimp')

const textImage = ({
  text = '',
  width = 80,
  height = 80,
  background = '#0f62feff',
  color
}) => {
  const image = new Jimp(width, height, background)
  return Jimp.loadFont(Jimp['FONT_SANS_' + 16 + '_' + color.toUpperCase()])
    .then(font => {
      image
        .print(
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
        .scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, i) { // WHY IS THIS IN BGR COLOUR SPACE
          var r = this.bitmap.data[i + 0]
          var g = this.bitmap.data[i + 1]
          var b = this.bitmap.data[i + 2]
          this.bitmap.data[i + 0] = b
          this.bitmap.data[i + 1] = g
          this.bitmap.data[i + 2] = r
        })
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
    .then(buffer => {
      if (device.model === 'mini') return buffer.slice(51, 19251)
      if (device.model === 'xl') return buffer.slice(51, 27699)
      if (device.model === 'original') return buffer.slice(51, 15603)
    })
    .then(_buffer => {
      device.controller.fillImage(buttonIndex, _buffer)
    })
}

const writeImageToButton = (device, buttonIndex, path) => {
  Jimp.read(path)
    .then(image => {
      return image
        .scaleToFit(device.controller.ICON_SIZE, device.controller.ICON_SIZE, Jimp.RESIZE_NEAREST_NEIGHBOR)
        .rgba(false)
        .scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, i) { // WHY IS THIS IN BGR COLOUR SPACE
          var r = this.bitmap.data[i + 0]
          var g = this.bitmap.data[i + 1]
          var b = this.bitmap.data[i + 2]
          this.bitmap.data[i + 0] = b
          this.bitmap.data[i + 1] = g
          this.bitmap.data[i + 2] = r
        })
        .getBufferAsync('image/bmp')
    })
    .then(buffer => {
      // console.log(device)
      if (device.model === 'mini') return buffer.slice(51, 19251)
      if (device.model === 'xl') return buffer.slice(51, 27699)
      if (device.model === 'original') return buffer.slice(51, 15603)
    })
    .then(buffer => {
      device.controller.fillImage(buttonIndex, buffer)
    })
    .catch(err => {
      console.error(err)
    })
}

export { writeTextToButton, writeImageToButton }
