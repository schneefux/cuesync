import SeratoMarker from "./SeratoMarker"
import Serializable from "./Serializable"

/**
 * If active, the user cannot modify BPM or Beatgrid.
 * Inactive by default.
 * https://support.serato.com/hc/en-us/articles/235214887-Lock-Beatgrids
 */
export default class SeratoBpmLockMarker implements SeratoMarker, Serializable {
  id = 'BPMLOCK'
  size = 1
  isActive: boolean

  decode(buf: Buffer) {
    this.isActive = buf.readUInt8() != 0
  }

  encode() {
    return Buffer.from('\x01')
  }
}