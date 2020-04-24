import Encodable from "./Encodable";

/**
 * https://id3.org/id3v2.4.0-frames
 * Section 4.15.
 */
export default interface Frame<T> extends Encodable {
  /* encoding: number // 1 Byte, not writing in Vorbis Comment -> handled by serializer/library manager */
  mimetype: string // terminated by \x00
  filename: string // terminated by \x00
  id: string // terminated by \x00
  size: number
  data: T
}
