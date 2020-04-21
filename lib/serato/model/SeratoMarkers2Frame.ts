import GeobFrame from "./GeobFrame"
import SeratoMarker from "./SeratoMarker"
import SeratoCueMarker from "./SeratoCueMarker"
import SeratoBpmLockMarker from "./SeratoBpmLockMarker"
import SeratoColorMarker from "./SeratoColorMarker"

/**
 * Deserialize buffer into Serato Marker.
 */
function seratoMarkerFactory(id: string, payload: Buffer): SeratoMarker|null {
  let marker: SeratoMarker
  switch (id) {
    case 'CUE':
      marker = new SeratoCueMarker()
      marker.decode(payload)
      break
    case 'BPMLOCK':
      marker = new SeratoBpmLockMarker()
      marker.decode(payload)
      break
    case 'COLOR':
      marker = new SeratoColorMarker()
      marker.decode(payload)
      break
  }

  return marker
}

/**
 * 'Serato Markers2' tag, containing information about BPM lock, track color, cues, loops and flips.
 * https://github.com/Holzhaus/serato-tags/blob/master/docs/serato_markers2.md
 */
export default class SeratoMarkers2Frame implements GeobFrame<SeratoMarker[]> {
  encoding = 0
  mimetype = 'application/octet-stream'
  filename = ''
  id = 'Serato Markers2'
  size = 513
  versionMajor: number
  versionMinor: number
  data: SeratoMarker[]

  decode(data: Buffer) {
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