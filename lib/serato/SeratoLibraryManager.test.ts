import * as taglib from 'taglib3'
import * as path from 'path'
import { copyFile as copyFileCb } from "fs";
import { promisify } from "util";
import SeratoLibraryManager from "./SeratoLibraryManager";

const copyFile = promisify(copyFileCb)
const fixtures = 'fixtures/'

const library = new SeratoLibraryManager(fixtures)

test('should read Serato data from mp3', async () => {
  const trackInfo = await library.readSeratoData(path.join(fixtures, 'retro_funky.mp3'))

  expect(trackInfo).toMatchObject({
    cues: [
      { color: "#cc0000", index: 0, milliseconds: 27885, name: 'start of track ♥' },
      { color: "#0000cc", index: 2, milliseconds: 88821 },
      { color: "#cccc00", index: 3, milliseconds: 162839 },
    ]
  })
})

test('should read Serato data from flac', async () => {
  const trackInfo = await library.readSeratoData(path.join(fixtures, 'retro_funky.flac'))

  expect(trackInfo).toMatchObject({
    cues: [
      { color: "#cc8800", index: 1, milliseconds: 23060 },
      { color: "#cc00cc", index: 5, milliseconds: 94993 },
      { color: "#8800cc", index: 7, milliseconds: 121151 },
    ]
  })
})

test('should write Serato data to flac', async () => {
  await copyFile(path.join(fixtures, 'retro_funky.flac'), path.join(fixtures, 'tmp', 'retro_funky.flac'))

  await library.writeSeratoData(path.join(fixtures, 'tmp', 'retro_funky.flac'), {
    cues: [
      { color: "#cc8800", index: 5, milliseconds: 23060, name: 'start of track ♥' },
      { color: "#cc00cc", index: 6, milliseconds: 94993 },
      { color: "#8800cc", index: 7, milliseconds: 121151 },
    ]
  })

  const tags = await taglib.readTags(path.join(fixtures, 'tmp', 'retro_funky.flac'))
  expect(tags).toMatchObject({
    "SERATO_ANALYSIS": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQW5hbHlzaXMAAgHh"],
    "SERATO_AUTOGAIN": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQXV0b3RhZ3MAAQExMTUuMDAALTMu\n" + "MjQ1ADAuMDAwAA"],
    "SERATO_BEATGRID": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQmVhdEdyaWQAAQAAAAABPoJ8yULm\n" + "AABBP"],
    "SERATO_MARKERS_V2": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gTWFya2VyczIAAQFBUUZEVlVVQUFB\n" +
      "QUFIUUFGQUFCYUZBRE1pQUFBYzNSaGNuUWdiMllnZEhKaFkyc2c0cG1sUTFWRkFBQUFBQTBB\n" +
      "QmdBQmN4RUEKekFETUFBQUFRMVZGQUFBQUFBMEFCd0FCMlQ4QWlBRE1BQUFBQUE9PQAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="],
    /* "SERATO_OVERVIEW": ["..."], */
    "SERATO_PLAYCOUNT": ["0"],
    "SERATO_RELVOL": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gUmVsVm9sQWQAAQEBAAAA"],
    "SERATO_VIDEO_ASSOC": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gVmlkQXNzb2MAAQEBAAAA"],
  })

  const data = await library.readSeratoData(path.join(fixtures, 'tmp', 'retro_funky.flac'))
  expect(data).toBeDefined()
})

test('should write Serato data to mp3', async () => {
  await copyFile(path.join(fixtures, 'retro_funky.mp3'), path.join(fixtures, 'tmp', 'retro_funky.mp3'))

  await library.writeSeratoData(path.join(fixtures, 'tmp', 'retro_funky.mp3'), {
    cues: [
      { index: 4, color: '#00cc00', milliseconds: 112920 },
      { index: 5, color: '#cc00cc', milliseconds: 40279 },
      { index: 7, color: '#8800cc', milliseconds: 174199 }
    ]
  })

  const tags = await taglib.readId3Tags(path.join(fixtures, 'tmp', 'retro_funky.mp3'))
  expect(tags['Serato Markers_']).toBeUndefined()
  expect(tags).toMatchObject({
    "Serato Analysis": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQW5hbHlzaXMAAgE=",
    "Serato Autotags": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQXV0b3RhZ3MAAQExMTUuMDAALTMuMjUxADAuMDAwAA==",
    "Serato BeatGrid": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQmVhdEdyaWQAAQAAAAABPpwoOELmAAAA",
    "Serato Markers2": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gTWFya2VyczIAAQFBUUZEVlVVQUFBQUFEUUFFQUFHNUdBQUF6QUFBQUFCRFZVVUFBQUFBRFFBRkFBQ2RWd0RNQU13QUFBQkRWVVVBQUFBQURRQUgKQUFLb2R3Q0lBTXdBQUFBQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    /* "Serato Offsets_": "...", */
    /* "Serato Overview": "...", */
  })

  const data = await library.readSeratoData(path.join(fixtures, 'tmp', 'retro_funky.mp3'))
  expect(data).toBeDefined()
})

test('should detect crate', async () => {
  const crates = await library.listCrates(fixtures)
  expect(crates.length).toBe(1)
})

test('should parse crate', async () => {
  const songs = await library.listSongs(path.join(fixtures, '_Serato_', 'Subcrates', 'fixtures.crate'))
  expect(songs[0]).toBe(path.join(path.resolve(fixtures), 'retro_funky.flac'))
})

test('should cache tracks', async () => {
  const library = new SeratoLibraryManager(fixtures)
  await library.load()
  const tracks = await library.list()
  expect(tracks.length).toBe(3)
  expect(tracks[0]).toMatchObject({
    path: 'P:\\cuemigrator\\fixtures\\retro_funky.flac',
    filename: 'retro_funky.flac',
  })
  expect(tracks[0].cues).not.toBe(undefined)
})

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
