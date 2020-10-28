import jimp from 'jimp/browser/lib/jimp'

export const ref = {}

export function initImg({ front, back }) {
  jimp.read(Buffer.from(front.uri.split(',')[1], 'base64')).then(image => {
    front.image = image
  })
  jimp.read(Buffer.from(back.uri.split(',')[1], 'base64')).then(image => {
    back.image = image
  })
  front.layer = { selected: { uri: undefined }, drawn: { uri: undefined } }
  back.layer = { selected: { uri: undefined }, drawn: { uri: undefined } }

  ref.selectedLayer = { front: front.layer.selected, back: back.layer.selected, color: 0xff5599ff }
  ref.drawnLayer = { front: front.layer.drawn, back: back.layer.drawn, color: 0x9911ffff }
  ref.depth = { front, back }

  front.layer.selected.image = new jimp(front.width, front.height)
  back.layer.selected.image = new jimp(back.width, back.height)
  front.layer.drawn.image = new jimp(front.width, front.height)
  back.layer.drawn.image = new jimp(back.width, back.height)
  front.name = 'front'
  back.name = 'back'
  if (!ref.ids) ref.ids = {}
  return { front, back }
}
