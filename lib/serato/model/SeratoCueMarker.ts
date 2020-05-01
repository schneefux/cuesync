import SeratoMarker from "./SeratoMarker"

/**
 * https://support.serato.com/hc/en-us/articles/360000067696-Cue-Points
 */
export default class SeratoCueMarker implements SeratoMarker {
  id = 'CUE'
  size = 13
  index: number = 0
  milliseconds: number = 0
  color: string = '#ffffff'

  decode(buf: Buffer) {
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
}
