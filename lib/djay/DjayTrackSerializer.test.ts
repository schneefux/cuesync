import TrackInfo from "../model/TrackInfo"
import Cue from "../model/Cue"
import DjayTrackSerializer from "./DjayTrackSerializer"

const testTrack = { key: 'the conspiracy\talbzzy, sk\t274', value: { 'song.cuePoints': [ 42.797550201416016, 0, 0, 0, 0, 0, 0, 0 ] } }
const serializer = new DjayTrackSerializer()

test('should deserialize track info', () => {
  const trackInfo = serializer.deserialize(testTrack)
  expect(trackInfo.cues).toMatchObject([{ index: 0, milliseconds: 42797.550201416016 }])
  expect(trackInfo).toMatchObject({
    artists: ['albzzy', 'sk'],
    title: 'the conspiracy',
  })
})

test.skip('should deserialize empty cues', () => {
  const trackInfo = serializer.deserialize({ key: testTrack.key, value: { 'song.cuePoints': [ 0, 12.34, 0, 34.56, 0, 0, 0, 0 ] } })
  expect(trackInfo.cues!.length).toBe(4)
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
