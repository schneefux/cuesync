import SeratoMarkers2Frame from "./model/SeratoMarkers2Frame"
import Frame from "./model/Frame"
import FrameEncoder from "./model/FrameEncoder"

export default class SeratoFrameEncoder implements FrameEncoder<SeratoMarkers2Frame> {
  /**
   * Read GEOB ID.
   */
  readFrame(buf: Buffer): Frame<Buffer> {
    let rest = buf
    const mimetype = rest.slice(0, rest.indexOf('\x00')).toString()
    rest = rest.slice(mimetype.length + 1)
    const filename = rest.slice(0, rest.indexOf('\x00')).toString()
    rest = rest.slice(filename.length + 1)
    const id = rest.slice(0, rest.indexOf('\x00')).toString()
    rest = rest.slice(id.length + 1)
    const data = rest

    return { mimetype, filename, id, data } as Frame<Buffer>
  }

  /**
   * Deserialize buffer into frames.
   */
  decode(buf: Buffer): SeratoMarkers2Frame|null {
    const frame = this.readFrame(buf)
    if (frame.id == 'Serato Markers2') {
      const markers2 = new SeratoMarkers2Frame()
      markers2.decode(frame.data)
      return markers2
    }

    return null
  }

  /**
   * Serialize frame into buffer.
   */
  encode<T>(frame: Frame<T>): Buffer {
    const buf = Buffer.alloc(frame.size)
    let cursor = 0
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