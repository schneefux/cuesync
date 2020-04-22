import { deserialize, serialize } from "./serializer"
import TrackInfo from "../model/TrackInfo"
import Cue from "../model/Cue"

const testTrack = { meta: 'the conspiracy\talbzzy, sk\t274', information: { 'song.cuePoints': [ 42.797550201416016, 0, 0, 0, 0, 0, 0, 0 ] } }

test('should deserialize track info', () => {
  const trackInfo = deserialize(testTrack.meta, testTrack.information)
  expect(trackInfo.artists[0]).toBe('albzzy')
  expect(trackInfo.artists[1]).toBe('sk')
  expect(trackInfo.title).toBe('the conspiracy')
  expect(trackInfo.cues.length).toBe(1)
  expect(trackInfo.cues[0].index).toBe(0)
  expect(trackInfo.cues[0].milliseconds).toBeCloseTo(42797.55)
  expect(trackInfo.bpm).toBeUndefined()
  expect(trackInfo.songStart).toBeUndefined()
})

test.skip('should deserialize empty cues', () => {
  const trackInfo = deserialize(testTrack.meta, { 'song.cuePoints': [ 0, 12.34, 0, 34.56, 0, 0, 0, 0 ] })
  expect(trackInfo.cues.length).toBe(4)
})

test('should serialize track info', () => {
  const trackInfo = {
    title: 'the conspiracy',
    artists: [ 'albzzy', 'sk' ],
    durationSeconds: 274,
    cues: [{ index: 0, milliseconds: 42.797550201416016 * 1000 } as Cue],
    bpm: undefined,
    songStart: undefined
  } as TrackInfo
  expect(serialize(trackInfo)).toMatchObject(testTrack)
})