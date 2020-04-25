import * as taglib from 'taglib3'
import { copyFile as copyFileCb } from "fs";
import { promisify } from "util";
import FileLibraryManager from './FileLibraryManager';

const copyFile = promisify(copyFileCb)
const fixtures = 'fixtures/'

const library = new FileLibraryManager()

test('should read track info from mp3', async () => {
  const trackInfo = await library.find({ path: fixtures + 'retro_funky.mp3' })

  expect(trackInfo).toMatchObject({
    "album": "Retro Funky",
    "artists": ["Perséphone"],
    "bpm": 115,
    "genre": undefined,
    "isrc": "NLPM11407110",
    "key": "Em",
    "title": "Retro Funky (SUNDANCE Remix)",
  })
})

test('should read track info from flac', async () => {
  const trackInfo = await library.find({ path: fixtures + 'retro_funky.mp3' })

  expect(trackInfo).toMatchObject({
    "album": "Retro Funky",
    "artists": ["Perséphone"],
    "bpm": 115,
    "genre": undefined,
    "isrc": "NLPM11407110",
    "key": "Em",
    "title": "Retro Funky (SUNDANCE Remix)",
  })
})

test('should write track info to mp3', async () => {
  await copyFile(fixtures + 'retro_funky.mp3', fixtures + 'tmp/retro_funky.mp3')

  await library.update({
    path: fixtures + 'tmp/retro_funky.mp3',
    title: 'Testing 123',
  })

  const tags = await taglib.readTags(fixtures + 'tmp/retro_funky.mp3')
  expect(tags).toMatchObject({
    TITLE: ['Testing 123'],
  })
})

test('should write Serato data to flac', async () => {
  await copyFile(fixtures + 'retro_funky.flac', fixtures + 'tmp/retro_funky.flac')

  await library.update({
    path: fixtures + 'tmp/retro_funky.flac',
    title: 'Testing 123',
  })

  const tags = await taglib.readTags(fixtures + 'tmp/retro_funky.flac')
  expect(tags).toMatchObject({
    TITLE: ['Testing 123'],
  })
})
