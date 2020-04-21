import Serializable from "./Serializable";

export default interface GeobFrame<T> extends Serializable {
  encoding: number // 1 Byte
  mimetype: string // terminated by \x00
  filename: string // terminated by \x00
  id: string // terminated by \x00
  size: number
  data: T
}
