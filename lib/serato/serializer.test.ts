import SeratoCueMarker from "./model/SeratoCueMarker"
import SeratoColorMarker from "./model/SeratoColorMarker"
import SeratoBpmLockMarker from "./model/SeratoBpmLockMarker"
import SeratoMarkers2Frame from "./model/SeratoMarkers2Frame"
import { decodeFrame, encodeFrame } from "./serializer"

const testFrameSeratoMarkers2 = Buffer.from('006170706c69636174696f6e2f6f637465742d73747265616d000053657261746f204d61726b657273320001014151464454307850556741414141414541502f2f2f304e56525141414141414e4141414141414141414d77414141414141454e56525141414141414e4141454141425a70414d79490a4141414141454e56525141414141414e41414d4141614a6a414d7a4d4141414141454a515455785051307341414141414151454100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex')

test('should decode Serato Markers 2 frame', () => {
  const frame = decodeFrame(testFrameSeratoMarkers2)

  expect(frame).toBeDefined()
  expect(frame.id).toBe('Serato Markers2')
  expect(frame.data.length).toBe(5)

  const color0 = <SeratoColorMarker> frame.data[0]
  expect(color0.color).toBe('#ffffff')

  const cue0 = <SeratoCueMarker> frame.data[1]
  expect(cue0.id).toBe('CUE')
  expect(cue0.index).toBe(0)
  expect(cue0.milliseconds).toBe(0)
  expect(cue0.color).toBe('#cc0000')

  expect(frame.data[2].id).toBe('CUE')
  expect(frame.data[3].id).toBe('CUE')
  expect(frame.data[4].id).toBe('BPMLOCK')
  expect((<SeratoBpmLockMarker> frame.data[4]).isActive).toBeTruthy()
})

test('should encode to Serato Makers 2 frame', () => {
  const frame = Object.assign(new SeratoMarkers2Frame(), {
    encoding: 0,
    mimetype: 'application/octet-stream',
    filename: '',
    id: 'Serato Markers2',
    size: 513,
    versionMajor: 1,
    versionMinor: 1,
    data: [ ],
  })

  frame.data.push(Object.assign(new SeratoColorMarker(), {
    id: 'COLOR',
    size: 4,
    color: '#ffffff',
  }))

  frame.data.push(Object.assign(new SeratoCueMarker(), {
    id: 'CUE',
    size: 13,
    index: 0,
    milliseconds: 0,
    color: '#cc0000',
  }))

  frame.data.push(Object.assign(new SeratoCueMarker(), {
    id: 'CUE',
    size: 13,
    index: 1,
    milliseconds: 5737,
    color: '#cc8800',
  }))

  frame.data.push(Object.assign(new SeratoCueMarker(), {
    id: 'CUE',
    size: 13,
    index: 3,
    milliseconds: 107107,
    color: '#cccc00',
  }))

  frame.data.push(Object.assign(new SeratoBpmLockMarker(), {
    id: 'BPMLOCK',
    size: 1,
    isActive: true,
  }))

  expect(encodeFrame(frame).toString('hex')).toBe(testFrameSeratoMarkers2.toString('hex'))
})