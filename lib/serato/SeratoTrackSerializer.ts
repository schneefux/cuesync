import TrackInfo from "../model/TrackInfo"
import SeratoMarkers2Frame from "./model/SeratoMarkers2Frame"
import SeratoCueMarker from "./model/SeratoCueMarker"
import TrackSerializer from "../model/TrackSerializer"
import SeratoFrameEncoder from "./SeratoFrameEncoder"

// TODO include all tags (not just geob Buffer[])
export default class SeratoTrackSerializer implements TrackSerializer<Buffer[]> {
  encoder = new SeratoFrameEncoder()

  /**
   * Deserialize frames to TrackInfo.
   */
  deserialize(bufs: Buffer[]) {
    const trackInfo = {} as TrackInfo

    const frames = bufs
      .map(buf => this.encoder.decode(buf))
      .filter(frame => frame !== null)

    const markers2 = frames.filter(f => f instanceof SeratoMarkers2Frame)[0]
    if (markers2) {
      trackInfo.cues = markers2.data
        .filter(d => d instanceof SeratoCueMarker)
        .map((cueMarker: SeratoCueMarker) => ({
          index: cueMarker.index,
          color: cueMarker.color,
          milliseconds: cueMarker.milliseconds,
        }))
    }

    return trackInfo
  }

  /**
   * Serialize TrackInfo to frames.
   */
  serialize(trackInfo: TrackInfo) {
    // TODO
    return []
  }
}