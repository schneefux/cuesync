import TaglibTrackSerializer from "./TaglibTrackSerializer"

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
  TITLE: [ "Power To Kill (Dutta's Mix)" ],
  TRACKNUMBER: [ '2' ]
}

const serializer = new TaglibTrackSerializer()

test('should deserialize track info from FLAC', () => {
  const trackInfo = serializer.deserialize(testFlacTag)

  expect(trackInfo.album).toBe('Power To Kill')
  expect(trackInfo.bpm).toBe(88)
  expect(trackInfo.key).toBe('Gm')
  expect(trackInfo.isrc).toBe('UKK762024002')
  expect(trackInfo.artists).toMatchObject(['Mc Bassman', 'Dutta'])
  expect(trackInfo.title).toBe('Power To Kill (Dutta\'s Mix)')
})