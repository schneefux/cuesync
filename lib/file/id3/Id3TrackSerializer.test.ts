import Id3TrackSerializer from "./Id3TrackSerializer"

const testId3Tags = [
  { id: 'TIT2', text: 'Bis Ich Nichts Mehr Fü̈hle' },
  { id: 'TCON', text: '' },
  { id: 'TKEY', text: 'Cm' },
  { id: 'TBPM', text: '83' },
]

const serializer = new Id3TrackSerializer()

test('should deserialize track info from ID3', () => {
  const trackInfo = serializer.deserialize(testId3Tags)

  expect(trackInfo.title).toBe('Bis Ich Nichts Mehr Fü̈hle')
  expect(trackInfo.key).toBe('Cm')
  expect(trackInfo.bpm).toBe(83)
})