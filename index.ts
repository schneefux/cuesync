import { readSeratoCues } from "./lib/serato"

const plist = require('simple-plist')
const seratojs = require('seratojs')
const fs = require('fs')
const { promisify } = require('util')

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


//taglib.writeTagsSync('./source.mp3', {
//})
// loadLibrary('djay Preset Library.plist');
readSeratoCues('./source.mp3').then(console.log)
// TODO load crates, match files and write into meta data
