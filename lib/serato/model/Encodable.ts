export default interface Encodable {
  encode(): Buffer
  decode(buf: Buffer): void
}