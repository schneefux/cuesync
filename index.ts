import { geobFrameFactory, encodeFrame } from "./lib/serato"
import SeratoMarkers2Frame from "./lib/serato/model/SeratoMarkers2Frame"

const plist = require('simple-plist')
const seratojs = require('seratojs')
const fs = require('fs')
const { promisify } = require('util')
const taglib = require('taglib3')
const id3 = require('id3-rs')

const readId3Tags = promisify(id3.readTags)
const readTags = promisify(taglib.readTags)

/**
 * Read the Serato Markers 2 frame.
 * @returns Buffer
 */
async function readSeratoMarkers2(path) {
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

// djay stores cues
async function loadLibrary(libraryPath) {
  const library = await promisify(plist.readFile)(libraryPath);
  Object.entries(library['Song Entries']).forEach(([meta, information]) => {
    const [title, artists, unknownNumber] = meta.split('\t');
    (information['song.cuePoints'] || []).forEach((cuePointSeconds) => {
      if (cuePointSeconds != 0) {
        const milliseconds = Math.floor(cuePointSeconds * 1000);
        console.log(title, milliseconds);
      }
    });
  })
}

// adapted from https://homepage.ruhr-uni-bochum.de/jan.holthuis/posts/reversing-seratos-geob-tags
// https://github.com/Holzhaus/serato-tags/blob/master/docs/fileformats.md
async function readSeratoCues(filename) {
  let data = await readSeratoMarkers2(filename)
  console.log(data.toString('hex'))
  const frame = geobFrameFactory(data)
  if (frame instanceof SeratoMarkers2Frame) {
    //
  }
  //console.log(data.toString('hex'))
  //console.log(encode(frame).toString('hex'))
  console.log(encodeFrame(frame).toString('hex'))
}

//taglib.writeTagsSync('./source.mp3', {
//})
// loadLibrary('djay Preset Library.plist');
readSeratoCues('./source.mp3')
// TODO load crates, match files and write into meta data
