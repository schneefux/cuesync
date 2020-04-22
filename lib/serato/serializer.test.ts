import SeratoCueMarker from "./model/SeratoCueMarker"
import SeratoColorMarker from "./model/SeratoColorMarker"
import SeratoBpmLockMarker from "./model/SeratoBpmLockMarker"
import SeratoMarkers2Frame from "./model/SeratoMarkers2Frame"
import { decodeFrame, encodeFrame, deserialize } from "./serializer"

const testFrameSeratoMarkers2 = Buffer.from('006170706c69636174696f6e2f6f637465742d73747265616d000053657261746f204d61726b657273320001014151464454307850556741414141414541502f2f2f304e56525141414141414e4141414141414141414d77414141414141454e56525141414141414e4141454141425a70414d79490a4141414141454e56525141414141414e41414d4141614a6a414d7a4d4141414141454a515455785051307341414141414151454100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex')
const testId3Tags = [
  { id: 'TIT2', text: 'Bis Ich Nichts Mehr Fühle-773649382' },
  { id: 'TCON', text: '' },
  { id: 'TKEY', text: 'Cm' },
  { id: 'TXXX', description: 'SERATO_PLAYCOUNT', value: '0' },
  { id: 'RVAD', data: 'ABAAAAAAAAAAAA==' },
  { id: 'TBPM', text: '83' },
  // Serato Overview
  // (ommitted)
  // Serato Analysis
  { id: 'GEOB', data: 'AGFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbQAAU2VyYXRvIEFuYWx5c2lzAAIB' },
  // Serato Autotags
  { id: 'GEOB', data: 'AGFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbQAAU2VyYXRvIEF1dG90YWdzAAEBODIuNTAAMC4wNjYAMC4wMDAA' },
  // Serato Markers_
  { id: 'GEOB', data: 'AGFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbQAAU2VyYXRvIE1hcmtlcnNfAAIFAAAADgAAAAAAf39/f38Af39/f38GMAAAAQAAAAAsaX9/f39/AH9/f39/BjIQAAEAf39/f39/f39/fwB/f39/fwAAAAAAAAAABkRjf39/f38Af39/f38GMxgAAQB/f39/f39/f39/AH9/f39/AAAAAAAAf39/f39/f39/fwB/f39/fwAAAAADAH9/f39/f39/f38Af39/f38AAAAAAwB/f39/f39/f39/AH9/f39/AAAAAAMAf39/f39/f39/fwB/f39/fwAAAAADAH9/f39/f39/f38Af39/f38AAAAAAwB/f39/f39/f39/AH9/f39/AAAAAAMAf39/f39/f39/fwB/f39/fwAAAAADAH9/f39/f39/f38Af39/f38AAAAAAwB/f39/f39/f39/AH9/f39/AAAAAAMAB39/fw==' },
  // Serato Markers2
  { id: 'GEOB', data: 'AGFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbQAAU2VyYXRvIE1hcmtlcnMyAAEBQVFGRFQweFBVZ0FBQUFBRUFQLy8vME5WUlFBQUFBQU5BQUFBQUFBQUFNd0FBQUFBQUVOVlJRQUFBQUFOQUFFQUFCWnBBTXlJCkFBQUFBRU5WUlFBQUFBQU5BQU1BQWFKakFNek1BQUFBQUVKUVRVeFBRMHNBQUFBQUFRRUEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
  // Serato BeatGrid
  { id: 'GEOB', data: 'AGFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbQAAU2VyYXRvIEJlYXRHcmlkAAEAAAAAAT08PoJCpQAAAA==' },
  // Serato Offsets_
  // (ommitted)
]
const testFlacTag = {
  ALBUM: [ 'Power To Kill' ],
  ALBUMARTIST: [ 'Mc Bassman' ],
  ARTIST: [ 'Mc Bassman, Dutta' ],
  BPM: [ '88' ],
  DATE: [ '2020' ],
  DISCNUMBER: [ '1' ],
  GENRE: [ 'Dance' ],
  INITIALKEY: [ 'Gm' ],
  ISRC: [ 'UKK762024002' ],
  LENGTH: [ '263' ],
  ORGANIZATION: [ 'Souped Up Records' ],
  'REPLAYGAIN_*_GAIN': [ '-3.9' ],
  SERATO_ANALYSIS: [ 'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQW5hbHlzaXMAAgEA' ],
  SERATO_AUTOGAIN: [
    'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQXV0b3RhZ3MAAQE4Ny41MAAtNi44\n' +
      'MjEAMC4wMDAAA'
  ],
  SERATO_BEATGRID: [
    'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQmVhdEdyaWQAAQAAAAABAAAAAEKv\n' +
      'AACgA'
  ],
  SERATO_MARKERS_V2: [
    'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gTWFya2VyczIAAQFBUUZEVDB4UFVn\n' +
      'QUFBQUFFQVAvLy8wTlZSUUFBQUFBTkFBQUFBQlZxQU13QUFBQUFBRU5WUlFBQUFBQU5BQUVB\n' +
      'QWt0T0FBQUEKekFBQUFFSlFUVXhQUTBzQUFBQUFBUUFBAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAA'
  ],
  // SERATO_OVERVIEW: ommitted
  SERATO_PLAYCOUNT: [ '2' ],
  SERATO_RELVOL: [
    'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gUmVsVm9sQWQAAQEBAAAA'
  ],
  SERATO_VIDEO_ASSOC: [
    'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gVmlkQXNzb2MAAQEBAAAA'
  ],
  TITLE: [ "Power To Kill (Dutta's Mix)" ],
  TRACKNUMBER: [ '2' ]
}

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

test('should deserialize track info from ID3', () => {
  const geobTags = testId3Tags
    .filter(t => t.id == 'GEOB')
    .map(t => Buffer.from(t.data, 'base64'))
  const trackInfo = deserialize(geobTags)

  expect(trackInfo.cues).toMatchObject([
    { index: 0, color: '#cc0000', milliseconds: 0 },
    { index: 1, color: '#cc8800', milliseconds: 5737 },
    { index: 3, color: '#cccc00', milliseconds: 107107 },
  ])
})

test('should deserialize track info from FLAC', () => {
  const geobTags = [
    testFlacTag['SERATO_ANALYSIS'],
    testFlacTag['SERATO_AUTOGAIN'],
    testFlacTag['SERATO_BEATGRID'],
    testFlacTag['SERATO_MARKERS_V2'],
    testFlacTag['SERATO_RELVOL'],
    testFlacTag['SERATO_VIDEO_ASSOC'],
  ].map(t => Buffer.from(t[0], 'base64'))
  const trackInfo = deserialize(geobTags)
  expect(trackInfo.cues).toMatchObject([
    { index: 0, color: '#cc0000', milliseconds: 5482 },
    { index: 1, color: '#0000cc', milliseconds: 150350 },
  ])
})