export default interface Serializable {
  encode(): Buffer
  decode(buf: Buffer): void
}