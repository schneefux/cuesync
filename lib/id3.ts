import * as id3 from 'id3-rs'
import { promisify } from 'util'

// https://github.com/43081j/id3/blob/master/src/id3Frame.ts
const types = [
  /*
   * Textual frames
   */
  ['TALB', 'album'],
  ['TBPM', 'bpm'],
  ['TCOM', 'composer'],
  ['TCON', 'genre'],
  ['TCOP', 'copyright'],
  ['TDEN', 'encoding-time'],
  ['TDLY', 'playlist-delay'],
  ['TDOR', 'original-release-time'],
  ['TDRC', 'recording-time'],
  ['TDRL', 'release-time'],
  ['TDTG', 'tagging-time'],
  ['TENC', 'encoder'],
  ['TEXT', 'writer'],
  ['TFLT', 'file-type'],
  ['TIPL', 'involved-people'],
  ['TIT1', 'content-group'],
  ['TIT2', 'title'],
  ['TIT3', 'subtitle'],
  ['TKEY', 'initial-key'],
  ['TLAN', 'language'],
  ['TLEN', 'length'],
  ['TMCL', 'credits'],
  ['TMED', 'media-type'],
  ['TMOO', 'mood'],
  ['TOAL', 'original-album'],
  ['TOFN', 'original-filename'],
  ['TOLY', 'original-writer'],
  ['TOPE', 'original-artist'],
  ['TOWN', 'owner'],
  ['TPE1', 'artist'],
  ['TPE2', 'band'],
  ['TPE3', 'conductor'],
  ['TPE4', 'remixer'],
  ['TPOS', 'set-part'],
  ['TPRO', 'produced-notice'],
  ['TPUB', 'publisher'],
  ['TRCK', 'track'],
  ['TRSN', 'radio-name'],
  ['TRSO', 'radio-owner'],
  ['TSOA', 'album-sort'],
  ['TSOP', 'performer-sort'],
  ['TSOT', 'title-sort'],
  ['TSRC', 'isrc'],
  ['TSSE', 'encoder-settings'],
  ['TSST', 'set-subtitle'],
  /*
   * Textual frames (<=2.2)
   */
  ['TAL', 'album'],
  ['TBP', 'bpm'],
  ['TCM', 'composer'],
  ['TCO', 'genre'],
  ['TCR', 'copyright'],
  ['TDY', 'playlist-delay'],
  ['TEN', 'encoder'],
  ['TFT', 'file-type'],
  ['TKE', 'initial-key'],
  ['TLA', 'language'],
  ['TLE', 'length'],
  ['TMT', 'media-type'],
  ['TOA', 'original-artist'],
  ['TOF', 'original-filename'],
  ['TOL', 'original-writer'],
  ['TOT', 'original-album'],
  ['TP1', 'artist'],
  ['TP2', 'band'],
  ['TP3', 'conductor'],
  ['TP4', 'remixer'],
  ['TPA', 'set-part'],
  ['TPB', 'publisher'],
  ['TRC', 'isrc'],
  ['TRK', 'track'],
  ['TSS', 'encoder-settings'],
  ['TT1', 'content-group'],
  ['TT2', 'title'],
  ['TT3', 'subtitle'],
  ['TXT', 'writer'],
  /*
   * URL frames
   */
  ['WCOM', 'url-commercial'],
  ['WCOP', 'url-legal'],
  ['WOAF', 'url-file'],
  ['WOAR', 'url-artist'],
  ['WOAS', 'url-source'],
  ['WORS', 'url-radio'],
  ['WPAY', 'url-payment'],
  ['WPUB', 'url-publisher'],
  /*
   * URL frames (<=2.2)
   */
  ['WAF', 'url-file'],
  ['WAR', 'url-artist'],
  ['WAS', 'url-source'],
  ['WCM', 'url-commercial'],
  ['WCP', 'url-copyright'],
  ['WPB', 'url-publisher'],
  /*
   * Comment frame
   */
  ['COMM', 'comments'],
  /*
   * Image frame
   */
  ['APIC', 'image'],
  ['PIC', 'image'],
  /*
   * Private frames
   */
  ['PRIV', 'private']
]

/**
 * Read the ID3 tags for an audio file and return a map of { TAGNAME: [ ...values ] }.
 */
export default async function readId3Tags(path) {
  const tags = await promisify(id3.readTags)(path)
  const obj = {}
  tags.forEach(tag => {
    const type = types.find(([id, name]) => id == tag.id)
    let typeName = tag.id
    if (type !== undefined) {
      typeName = type[1].replace(/-/g, '').toUpperCase()
    }
    if (tag.id == 'TXXX') {
      typeName = tag.description
    }

    if (!(typeName in obj)) {
      obj[typeName] = []
    }
    obj[typeName].push(tag.data || tag.text || tag.value) // TODO this is a bit leaky
  })
  return obj
}