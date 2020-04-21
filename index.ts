const plist = require('simple-plist')
const seratojs = require('seratojs')
const fs = require('fs')
const { promisify } = require('util')
const taglib = require('taglib3')
const id3 = require('id3-rs')

const readId3Tags = promisify(id3.readTags)
const readTags = promisify(taglib.readTags)

interface SeratoMarker {
  id: string
  size: number
  encode(): Buffer
}

function seratoMarkerFactory(id: string, payload: Buffer): SeratoMarker|null {
  if (id == 'CUE') {
    return new SeratoCueMarker(payload)
  }

  if (id == 'BPMLOCK') {
    return new SeratoBpmLockMarker(payload)
  }

  if (id == 'COLOR') {
    return new SeratoColorMarker(payload)
  }

  return null
}

class SeratoColorMarker implements SeratoMarker {
  id = 'COLOR'
  size = 4
  color: string

  constructor(buf: Buffer) {
    // \x00
    this.color = '#' + buf.slice(1, 4).toString('hex')
  }

  encode(): Buffer {
    const buf = Buffer.alloc(this.size)
    Buffer.from(this.color.slice(1), 'hex').copy(buf, 1)
    return buf
  }
}

class SeratoCueMarker implements SeratoMarker {
  id = 'CUE'
  size = 13
  index: number
  milliseconds: number
  color: string

  constructor(buf: Buffer) {
    // \x00
    this.index = buf.readUInt8(1)
    this.milliseconds = buf.readUInt32BE(2)
    // \x00
    // rgb
    this.color = '#' + buf.slice(7, 10).toString('hex')
    // \x00
  }

  encode() {
    const buf = Buffer.alloc(this.size)
    buf.writeUInt8(this.index, 1)
    buf.writeUInt32BE(this.milliseconds, 2)
    Buffer.from(this.color.slice(1), 'hex').copy(buf, 7)
    return buf
  }

  public get seconds() {
    return this.milliseconds / 1000
  }
}

class SeratoBpmLockMarker implements SeratoMarker {
  id = 'BPMLOCK'
  size = 1
  isActive: boolean

  constructor(buf: Buffer) {
    this.isActive = buf.readUInt8() != 0
  }

  encode() {
    return Buffer.from('\x01')
  }
}

interface GeobFrame<T> {
  encoding: number // 1 Byte
  mimetype: string // terminated by \x00
  filename: string // terminated by \x00
  id: string // terminated by \x00
  size: number
  data: T
  encode(): Buffer
}

function geobFrameFactory(buf: Buffer): SeratoMarkers2|null {
  let rest = buf
  const encoding = rest.readInt8()
  rest = rest.slice(1)
  const mimetype = rest.slice(0, rest.indexOf('\x00')).toString()
  rest = rest.slice(mimetype.length + 1)
  const filename = rest.slice(0, rest.indexOf('\x00')).toString()
  rest = rest.slice(filename.length + 1)
  const id = rest.slice(0, rest.indexOf('\x00')).toString()
  rest = rest.slice(id.length + 1)
  const data = rest

  const frame = { encoding, mimetype, filename, id, data } as GeobFrame<Buffer>
  if (frame.id == 'Serato Markers2') {
    return new SeratoMarkers2(frame)
  }
  return null
}

function encode<T>(frame: GeobFrame<T>): Buffer {
  const buf = Buffer.alloc(frame.size)
  let cursor = 0
  buf.writeUInt8(0, cursor)
  cursor += 1
  buf.write(frame.mimetype + '\x00', cursor)
  cursor += frame.mimetype.length + 1
  buf.write(frame.filename + '\x00', cursor)
  cursor += frame.filename.length + 1
  buf.write(frame.id + '\x00', cursor)
  cursor += frame.id.length + 1
  frame.encode().copy(buf, cursor)
  return buf
}

class SeratoMarkers2 implements GeobFrame<SeratoMarker[]> {
  encoding = 0
  mimetype = 'application/octet-stream'
  filename = ''
  id = 'Serato Markers2'
  size = 513
  versionMajor: number
  versionMinor: number
  data: SeratoMarker[]

  public constructor(frame: GeobFrame<Buffer>) {
    const data = frame.data

    // version
    this.versionMajor = data.readInt8(0)
    this.versionMinor = data.readInt8(1)

    // content
    // there is a line break every 72 chars, but the JS parser ignores it
    let buf = Buffer.from(data.slice(2).toString(), 'base64')

    this.data = []
    // entries
    buf = buf.slice(2) // starts with \x01\x01
    do {
      // name + \x00
      const id = buf.slice(0, buf.indexOf('\x00')).toString()
      buf = buf.slice(id.length + 1)

      // size
      const size = buf.readUInt32BE()
      buf = buf.slice(4)

      // payload
      let payload = buf.slice(0, size)

      this.data.push(seratoMarkerFactory(id, payload))

      buf = buf.slice(size);
    } while (buf.length && buf.slice(0, 1).toString() != '\x00')
  }

  encode(): Buffer {
    const bufSize = 2 + 1 + this.data
      .map(marker => marker.id.length + 1 + 4 + marker.size)
      .reduce((sum, s) => sum + s, 0)
    const buf = Buffer.alloc(bufSize)
    // starts with \x0101
    buf.writeUInt8(1, 0)
    buf.writeUInt8(1, 1)
    let cursor = 2
    for (const marker of this.data) {
      buf.write(marker.id + '\x00', cursor)
      cursor += marker.id.length + 1
      buf.writeUInt32BE(marker.size, cursor)
      cursor += 4
      marker.encode().copy(buf, cursor)
      cursor += marker.size
    }
    // ends with \x00
    const base = buf.toString('base64')
    // NL every 72 chars
    const content = base.replace(/(.{72})/g, '$1\n')

    let size = 0
    size += 2 // version
    size += content.length
    size += 1 // \x00
    const wrapper = Buffer.alloc(size)
    wrapper.writeUInt8(this.versionMajor, 0)
    wrapper.writeUInt8(this.versionMinor, 1)
    wrapper.write(content, 2)
    return wrapper
  }
}

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
  if (frame instanceof SeratoMarkers2) {
    //
  }
  //console.log(data.toString('hex'))
  //console.log(encode(frame).toString('hex'))
  console.log(encode(frame).toString('hex'))
}

//taglib.writeTagsSync('./source.mp3', {
//})
// loadLibrary('djay Preset Library.plist');
readSeratoCues('./source.mp3')
// TODO load crates, match files and write into meta data
