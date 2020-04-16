const plist = require('simple-plist');
const seratojs = require('seratojs');
const fs = require('fs');
const { promisify } = require('util');

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

async function readSeratoCues(buffer) {
  // tag name
  const tagHeader = 'SERATO_MARKERS_V2=';
  
  // tag body
  const tagBodyStart = buffer.indexOf(tagHeader) + tagHeader.length;
  const tagBodyEnd = tagBodyStart + buffer.slice(tagBodyStart).indexOf('\x00\x00');
  
  // tag body (base64 encoded)
  const tagBody = Buffer.from(buffer.slice(tagBodyStart, tagBodyEnd).toString(), 'base64');
  let rest = tagBody;
  
  // mimetype
  const geobMimetype = rest.slice(0, rest.indexOf('\x00\x00'));
  rest = rest.slice(geobMimetype.length + 2);
  console.log(geobMimetype.toString());
  
  // 'Serato Markers2'
  const geobName = rest.slice(0, rest.indexOf('\x00'));
  rest = rest.slice(geobName.length + 1);
  console.log(geobName.toString());
  
  // version
  const geobVersion = rest.slice(0, 2);
  rest = rest.slice(2);
  console.log(geobVersion.toString('hex'));
  
  // content
  const markersContent = Buffer.from(rest.toString(), 'base64');
  rest = markersContent
  
  // entries
  rest = rest.slice(2); // starts with 0101
  do {
    // name + \x00
    const kind = rest.slice(0, rest.indexOf('\x00'));
    console.log(kind.toString())
    rest = rest.slice(kind.length + 1);
  
    // size
    const length = rest.readInt32BE();
    console.log(length);
    rest = rest.slice(4);
  
    // payload
    let payload = rest.slice(0, length);
    if (kind == 'CUE') { // always length=13
      const index = payload.readUInt16BE();
      payload = payload.slice(2);
      const position = payload.readUInt32BE();
      payload = payload.slice(4);
  
      // \x00
      payload = payload.slice(1);
  
      // rgb
      const color = payload.slice(0, 3).toString('hex');
      payload = payload.slice(3);
  
      // \x00
      payload = payload.slice(1);
  
      const seconds = position / 1000;
      console.log('found cue at index ' + index + ' timestamp ' + Math.floor(seconds/60) + ':' + (seconds % 60) + ' color #' + color);
    }
    rest = rest.slice(length);
  
    if (rest.slice(0, 1) == '\x00') break;
  } while (rest.length);
}

loadLibrary('djay Preset Library.plist');
promisify(fs.readFile)('test.flac').then(readSeratoCues);
// TODO load crates, match files and write into meta data
