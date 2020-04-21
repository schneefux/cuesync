import SeratoMarker from "./SeratoMarker"
import Serializable from "./Serializable"

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