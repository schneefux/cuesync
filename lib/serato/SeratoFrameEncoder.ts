import SeratoMarkers2Frame from "./model/SeratoMarkers2Frame"
import GeobFrame from "./model/GeobFrame"
import FrameEncoder from "./model/FrameEncoder"

export default class SeratoFrameEncoder implements FrameEncoder<SeratoMarkers2Frame> {
  /**
   * Deserialize buffer into frames.
   */
  decode(buf: Buffer): SeratoMarkers2Frame|null {
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

    const geobFrame = { encoding, mimetype, filename, id, data } as GeobFrame<Buffer>
    if (geobFrame.id == 'Serato Markers2') {
      const frame = new SeratoMarkers2Frame()
      frame.decode(geobFrame.data)
      return frame
    }
    return null
  }

  /**
   * Serialize frame into buffer.
   */
  encode<T>(frame: GeobFrame<T>): Buffer {
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
}