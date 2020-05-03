import SeratoMarker from "./SeratoMarker"

/**
 * If active, the user cannot modify BPM or Beatgrid.
 * Inactive by default.
 * https://support.serato.com/hc/en-us/articles/235214887-Lock-Beatgrids
 */
export default class SeratoBpmLockMarker implements SeratoMarker {
  id = 'BPMLOCK'
  size = 1
  isActive: boolean = false

  decode(buf: Buffer) {
    this.isActive = buf.readUInt8(0) != 0
  }

  encode() {
    return Buffer.from(this.isActive ? '\x01' : '\x00')
  }
}
