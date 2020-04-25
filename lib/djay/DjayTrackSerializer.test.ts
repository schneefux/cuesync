import TrackInfo from "../model/TrackInfo"
import Cue from "../model/Cue"
import DjayTrackSerializer from "./DjayTrackSerializer"

const testTrack = { key: 'the conspiracy\talbzzy, sk\t274', value: { 'song.cuePoints': [ 42.797550201416016, 0, 0, 0, 0, 0, 0, 0 ] } }
const serializer = new DjayTrackSerializer()

test('should deserialize track info', () => {
  const trackInfo = serializer.deserialize(testTrack)
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
  const trackInfo = serializer.deserialize({ key: testTrack.key, value: { 'song.cuePoints': [ 0, 12.34, 0, 34.56, 0, 0, 0, 0 ] } })
  expect(trackInfo.cues.length).toBe(4)
})

test('should serialize track info', () => {
  const trackInfo = {
    title: 'The Conspiracy',
    artists: [ 'Albzzy', 'Sk' ],
    durationSeconds: 274,
    cues: [{ index: 0, milliseconds: 42.797550201416016 * 1000 } as Cue],
    bpm: undefined,
    songStart: undefined
  } as TrackInfo

  expect(serializer.serialize(trackInfo)).toMatchObject(testTrack)
})