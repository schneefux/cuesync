import SeratoMarker from "./SeratoMarker"

/**
 * https://support.serato.com/hc/en-us/articles/360000067696-Cue-Points
 */
export default class SeratoCueMarker implements SeratoMarker {
  id = 'CUE'
  index: number = 0
  milliseconds: number = 0
  color: string = '#ffffff'
  name: string = ''

  get size() {
    return 1 + 1 + 4 + 1 + 3 + 2 + this.name.length + 1
  }

  decode(buf: Buffer) {
    // \x00
    this.index = buf.readUInt8(1)
    this.milliseconds = buf.readUInt32BE(2)
    // \x00
    // rgb
    this.color = '#' + buf.slice(7, 10).toString('hex')
    // \x00
    // optional:
    this.name = buf.slice(12, buf.length - 1).toString()
    // \x00
  }

  encode() {
    const buf = Buffer.alloc(this.size)
    buf.writeUInt8(this.index, 1)
    buf.writeUInt32BE(this.milliseconds, 2)
    Buffer.from(this.color.slice(1), 'hex').copy(buf, 7)
    Buffer.from(this.name).copy(buf, 11)
    return buf
  }
}
