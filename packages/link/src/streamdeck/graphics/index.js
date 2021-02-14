import jpg from '@julusian/jpeg-turbo'
const { Canvas } = require('skia-canvas')

const getBuffer = canvas => {
  return jpg
    .decompressSync(
      canvas.toBuffer(
        'jpg'
      ),
      {
        format: jpg.FORMAT_RGB
      }
    )
    .data
}

const writeTextToButton = ({
  text,
  device,
  buttonIndex,
  background,
  color
}) => {
  const font = {
    original: 'bold 8pt Menlo',
    mini: 'bold 9pt Menlo',
    xl: 'bold 11pt Menlo'
  }

  const width = device.controller.ICON_SIZE
  const height = device.controller.ICON_SIZE
  const canvas = new Canvas(width, height)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = background ?? '#0043ce'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = color ?? 'white'
  ctx.font = font[device.model]
  ctx.textAlign = 'center'
  ctx.textBaseline = 'ideographic'
  ctx.textWrap = true
  ctx.fillText(text, width / 2, height / 2, width - 6)

  device.controller.fillImage(buttonIndex, getBuffer(canvas))
  return true
}

export { writeTextToButton }
