import Id3Frame from "./model/id3-rs";
import TrackInfo from "../../model/TrackInfo";
import TrackSerializer from "../../model/TrackSerializer";

export default class Id3TrackSerializer implements TrackSerializer<Id3Frame[]> {
  deserialize(frames: Id3Frame[])  {
    const trackInfo = {} as TrackInfo
    const f = (id: string) => frames.find(f => f.id == id)
    trackInfo.album = f('TALB')?.text || f('TAL')?.text
    trackInfo.title = f('TIT2')?.text || f('TT2')?.text
    trackInfo.artists = (f('TPE1')?.text || f('TP1')?.text)?.split(',').map(s => s.trim())
    trackInfo.isrc = f('TSRC')?.text || f('TRC')?.text
    trackInfo.bpm = parseInt(f('TBPM')?.text || f('TBP')?.text) || undefined
    trackInfo.key = f('TKEY')?.text
    trackInfo.genre = f('TCON')?.text || f('TCO')?.text
    // trackInfo.publisher = f('TPUB')?.text || f('TPB')?.text
    // trackInfo.track = f('TRCK')?.text || f('TRK')?.text
    return trackInfo
  }

  serialize(trackInfo: TrackInfo): Id3Frame[] {
    throw new Error("Method not implemented.");
  }
}