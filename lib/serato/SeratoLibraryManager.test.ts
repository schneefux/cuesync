import * as taglib from 'taglib3'
import * as path from 'path'
import { copyFile as copyFileCb } from "fs";
import { promisify } from "util";
import SeratoLibraryManager from "./SeratoLibraryManager";

const copyFile = promisify(copyFileCb)
const fixtures = 'fixtures/'

const library = new SeratoLibraryManager(fixtures)

test('should read track info from mp3', async () => {
  const trackInfo = await library.loadTrack(path.join(fixtures, 'retro_funky.mp3'))

  expect(trackInfo).toMatchObject({
    "album": "Retro Funky",
    "artists": ["Perséphone"],
    "bpm": 115,
    "genre": undefined,
    "isrc": "NLPM11407110",
    "key": "Em",
    "title": "Retro Funky (SUNDANCE Remix)",
    "durationSeconds": 213,
  })
})

test('should read track info from flac', async () => {
  const trackInfo = await library.loadTrack(path.join(fixtures, 'retro_funky.flac'))

  expect(trackInfo).toMatchObject({
    "album": "Retro Funky",
    "artists": ["Perséphone"],
    "bpm": 115,
    "genre": undefined,
    "isrc": "NLPM11407110",
    "key": "Em",
    "title": "Retro Funky (SUNDANCE Remix)",
    "durationSeconds": 213,
  })
})

test('should write track info to mp3', async () => {
  await copyFile(path.join(fixtures, 'retro_funky.mp3'), path.join(fixtures, 'tmp', 'retro_funky.mp3'))

  await library.update({
    path: path.join(fixtures, 'tmp', 'retro_funky.mp3'),
    title: 'Testing 123',
  })

  const tags = await taglib.readTags(path.join(fixtures, 'tmp', 'retro_funky.mp3'))
  expect(tags).toMatchObject({
    TITLE: ['Testing 123'],
  })
})

test('should write track info to flac', async () => {
  await copyFile(path.join(fixtures, 'retro_funky.flac'), path.join(fixtures, 'tmp', 'retro_funky.flac'))

  await library.update({
    path: path.join(fixtures, 'tmp', 'retro_funky.flac'),
    title: 'Testing 123',
  })

  const tags = await taglib.readTags(path.join(fixtures, 'tmp', 'retro_funky.flac'))
  expect(tags).toMatchObject({
    TITLE: ['Testing 123'],
  })
})
