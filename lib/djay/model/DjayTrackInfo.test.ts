import DjayTrackInfo from "./DjayTrackInfo"

const testTrack = { meta: 'the conspiracy\talbzzy, sk\t274', information: { 'song.cuePoints': [ 42.797550201416016, 0, 0, 0, 0, 0, 0, 0 ] } }

test('should deserialize track info', () => {
  const trackInfo = new DjayTrackInfo()
  trackInfo.decode(testTrack.meta, testTrack.information)
  expect(trackInfo.artists[0]).toBe('albzzy')
  expect(trackInfo.artists[1]).toBe('sk')
  expect(trackInfo.title).toBe('the conspiracy')
  expect(trackInfo.cues.length).toBe(1)
  expect(trackInfo.cues[0]).toBeCloseTo(42.79755)
  expect(trackInfo.bpmOverride).toBeUndefined()
  expect(trackInfo.songStart).toBeUndefined()
})

test.skip('should deserialize empty cues', () => {
  const trackInfo = new DjayTrackInfo()
  trackInfo.decode(testTrack.meta, { 'song.cuePoints': [ 0, 12.34, 0, 34.56, 0, 0, 0, 0 ] })
  expect(trackInfo.cues.length).toBe(4)
})

test('should serialize track info', () => {
  const trackInfo = Object.assign(new DjayTrackInfo(), {
    title: 'the conspiracy',
    artists: [ 'albzzy', 'sk' ],
    durationSeconds: 274,
    cues: [ 42.797550201416016 ],
    bpmOverride: undefined,
    songStart: undefined
  });
  expect(trackInfo.encode()).toMatchObject(testTrack)
})
