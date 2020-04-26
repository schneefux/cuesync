import * as taglib from 'taglib3'
import * as path from 'path'
import { copyFile as copyFileCb } from "fs";
import { promisify } from "util";
import SeratoLibraryManager from "./SeratoLibraryManager";

const copyFile = promisify(copyFileCb)
const fixtures = 'fixtures/'

const library = new SeratoLibraryManager(fixtures)

test('should read Serato data from mp3', async () => {
  const trackInfo = await library.readSeratoData(fixtures + 'retro_funky.mp3')

  expect(trackInfo).toMatchObject({
    cues: [
      { color: "#cc0000", index: 0, milliseconds: 27885 },
      { color: "#0000cc", index: 2, milliseconds: 88821 },
      { color: "#cccc00", index: 3, milliseconds: 162839 },
    ]
  })
})

test('should read Serato data from flac', async () => {
  const trackInfo = await library.readSeratoData(fixtures + 'retro_funky.flac')

  expect(trackInfo).toMatchObject({
    cues: [
      { color: "#cc8800", index: 1, milliseconds: 23060 },
      { color: "#cc00cc", index: 5, milliseconds: 94993 },
      { color: "#8800cc", index: 7, milliseconds: 121151 },
    ]
  })
})

test('should write Serato data to flac', async () => {
  await copyFile(fixtures + 'retro_funky.flac', fixtures + 'tmp/retro_funky.flac')

  await library.writeSeratoData(fixtures + 'tmp/retro_funky.flac', {
    cues: [
      { color: "#cc8800", index: 5, milliseconds: 23060 },
      { color: "#cc00cc", index: 6, milliseconds: 94993 },
      { color: "#8800cc", index: 7, milliseconds: 121151 },
    ]
  })

  const tags = await taglib.readTags(fixtures + 'tmp/retro_funky.flac')
  expect(tags).toMatchObject({
    "SERATO_ANALYSIS": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQW5hbHlzaXMAAgHh"],
    "SERATO_AUTOGAIN": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQXV0b3RhZ3MAAQExMTUuMDAALTMu\n" + "MjQ1ADAuMDAwAA"],
    "SERATO_BEATGRID": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQmVhdEdyaWQAAQAAAAABPoJ8yULm\n" + "AABBP"],
    "SERATO_MARKERS_V2": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gTWFya2VyczIAAABBUUZEVlVVQUFB\n" +
      "QUFEUUFGQUFCYUZBRE1pQUFBQUFCRFZVVUFBQUFBRFFBR0FBRnpFUURNQU13QUFBQkRWVVVB\n" +
      "QUFBQURRQUgKQUFIWlB3Q0lBTXdBQUFBQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
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
})

test('should write Serato data to mp3', async () => {
  await copyFile(fixtures + 'retro_funky.mp3', fixtures + 'tmp/retro_funky.mp3')

  await library.writeSeratoData(fixtures + 'tmp/retro_funky.mp3', {
    cues: [
      { index: 4, color: '#00cc00', milliseconds: 112920 },
      { index: 5, color: '#cc00cc', milliseconds: 40279 },
      { index: 7, color: '#8800cc', milliseconds: 174199 }
    ]
  })

  const tags = await taglib.readId3Tags(fixtures + 'tmp/retro_funky.mp3')
  expect(tags['Serato Markers_']).toBeUndefined()
  expect(tags).toMatchObject({
    "Serato Analysis": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQW5hbHlzaXMAAgE=",
    "Serato Autotags": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQXV0b3RhZ3MAAQExMTUuMDAALTMuMjUxADAuMDAwAA==",
    "Serato BeatGrid": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQmVhdEdyaWQAAQAAAAABPpwoOELmAAAA",
    "Serato Markers2": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gTWFya2VyczIAAABBUUZEVlVVQUFBQUFEUUFFQUFHNUdBQUF6QUFBQUFCRFZVVUFBQUFBRFFBRkFBQ2RWd0RNQU13QUFBQkRWVVVBQUFBQURRQUgKQUFLb2R3Q0lBTXdBQUFBQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    /* "Serato Offsets_": "...", */
    /* "Serato Overview": "...", */
  })
})

test('should detect crate', async () => {
  const crates = await library.listCrates(fixtures)
  expect(crates.length).toBe(1)
})

test('should parse crate', async () => {
  const songs = await library.listSongs(path.join(fixtures, '_Serato_', 'Subcrates', 'tekk.crate'))
  expect(songs[0]).toBe(path.join(path.resolve(fixtures), 'tekk', 'Bis Ich Nichts Mehr Fühle-773649382.mp3'))
})