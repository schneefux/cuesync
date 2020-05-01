import * as plist from "simple-plist"
import { copyFile as copyFileCb } from "fs";
import DjayLibraryManager from "./DjayLibraryManager"
import { promisify } from "util"

const fixtures = 'fixtures/'

const copyFile = promisify(copyFileCb)
const readPlist = promisify(plist.readFile)

test('should load tracks from plist', async () => {
  const library = new DjayLibraryManager(fixtures + 'djay_library.plist')
  await library.load()

  const tracks = await library.list()
  const trackInfo = await library.find({
    artists: ['Premium'],
    title: 'Chewbacca',
  })

  expect(tracks.length).toBe(50)
  expect(trackInfo).toMatchObject({
    artists: ['premium'],
    durationSeconds: 266,
    title: 'chewbacca',
  })
  expect(trackInfo.cues.length).toBe(1)
  expect(trackInfo.cues[0].index).toBe(0)
  expect(trackInfo.cues[0].milliseconds).toBeCloseTo(42516.79)
})

test('should update track in plist', async () => {
  await copyFile(fixtures + 'djay_library.plist', fixtures + 'tmp/djay_library.plist')
  const library = new DjayLibraryManager(fixtures + '/tmp/djay_library.plist')
  await library.load()
  const trackInfo = {
    artists: ['Premium'],
    title: 'Chewbacca',
    durationSeconds: 266,
    cues: [{
      index: 0,
      milliseconds: 1234,
      color: '#ff00ff',
    }]
  }

  await library.update(trackInfo)

  const plist = await readPlist(fixtures + 'tmp/djay_library.plist')
  expect(plist['Song Entries']['chewbacca\tpremium\t266']['song.cuePoints'])
    .toMatchObject([1.234, 0, 0, 0, 0, 0, 0, 0])
})
