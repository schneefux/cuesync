import TrackInfo from "../model/TrackInfo"
import SeratoMarkers2Frame from "./model/SeratoMarkers2Frame"
import SeratoCueMarker from "./model/SeratoCueMarker"
import TrackSerializer from "../model/TrackSerializer"
import SeratoFrameEncoder from "./SeratoFrameEncoder"

export interface FrameMap {
   // ID of the GEOB frame, if known
  [id: string]: Buffer
}

export default class SeratoTrackSerializer implements TrackSerializer<FrameMap> {
  encoder = new SeratoFrameEncoder()

  /**
   * Deserialize frames to TrackInfo.
   */
  deserialize(frames: FrameMap) {
    const trackInfo = {} as TrackInfo

    const markers = [...Object.values(frames)]
      .map(buf => this.encoder.decode(buf))
      .filter(frame => frame !== null)

    const markers2 = markers.filter(f => f instanceof SeratoMarkers2Frame)[0]
    if (markers2) {
      trackInfo.cues = markers2.data
        .filter(d => d instanceof SeratoCueMarker)
        .map(marker => marker as SeratoCueMarker)
        .map(cueMarker => ({
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
    const markers2 = new SeratoMarkers2Frame()
    trackInfo.cues?.forEach((cue, index) => {
      const marker = Object.assign(new SeratoCueMarker(), {
        index: cue.index || index,
        milliseconds: cue.milliseconds,
        color: cue.color || '#ff0000'
      })

      markers2.data.push(marker)
    })

    return {
      [markers2.id]: this.encoder.encode(markers2),
    }
  }
}
