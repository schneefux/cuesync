import { promisify } from "util"
import * as taglib from 'taglib3'
import * as id3 from 'id3-rs'
import SeratoMarker from "./model/SeratoMarker"
import { decodeFrame } from "./serializer"

const readId3Tags = promisify(id3.readTags)
const readTags = promisify(taglib.readTags)

/**
 * Read the Serato Markers 2 frame from an audio file.
 */
async function readSeratoMarkers2(path): Promise<Buffer> {
  if (path.endsWith('.mp3')) {
    const tags = await readId3Tags(path);
    const header = Buffer.from('\x00application/octet-stream\x00\x00Serato Markers2\x00');
    return tags
      .filter(({ id }) => id == 'GEOB')
      .map(({ data }) => Buffer.from(data, 'base64'))
      .filter(buf => buf.indexOf(header) == 0)[0];
  }

  const tags = await readTags(path);
  return Buffer.from(tags['SERATO_MARKERS_V2'][0], 'base64');
}

/**
 * Read Serato meta data from an audio file.
 */
export async function readSeratoCues(filename): Promise<SeratoMarker[]> {
  const data = await readSeratoMarkers2(filename)
  const frame = decodeFrame(data)
  return frame.data
}