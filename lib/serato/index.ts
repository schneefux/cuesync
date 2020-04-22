import { promisify } from "util"
import * as taglib from 'taglib3'
import { deserialize } from "./serializer"
import readId3Tags from "../id3"

const readTags = promisify(taglib.readTags)

/**
 * Read GEOB frames from an audio file.
 */
async function readGeobFrames(path) {
  const tags = (path.endsWith('.mp3') ? await readId3Tags(path) : await readTags(path))as { [name: string]: string[] }
  const mimetype = Buffer.from('application/octet-stream').toString('base64')

  const geobFrames = tags.GEOB || [...Object.entries(tags)]
    .filter(([name, value]) => name.startsWith('SERATO_') && value.length == 1 && value[0].startsWith(mimetype))
    .map(([name, value]) => value[0])

  return geobFrames
    .map(data => Buffer.from(data, 'base64'))
}

/**
 * Read Serato meta data from an audio file.
 */
export async function readTrack(filename) {
  const frames = await readGeobFrames(filename)
  return deserialize(frames)
}