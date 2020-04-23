// https://github.com/schneefux/node-id3-rs/blob/master/native/src/lib.rs
export default interface Id3Frame {
  id: string
  text?: string
  description?: string
  value?: string
  link?: string
  lang?: string
  mime_type?: string
  data?: string
}