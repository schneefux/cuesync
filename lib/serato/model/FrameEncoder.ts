export default interface FrameEncoder<T> {
  decode(buf: Buffer): T|null
  encode(frame: T): Buffer
}