import TrackInfo from "../model/TrackInfo"
import SeratoMarkers2Frame from "./model/SeratoMarkers2Frame"
import SeratoCueMarker from "./model/SeratoCueMarker"
import TrackSerializer from "../model/TrackSerializer"
import SeratoFrameEncoder from "./SeratoFrameEncoder"
import SeratoBpmLockMarker from "./model/SeratoBpmLockMarker"
import SeratoColorMarker from "./model/SeratoColorMarker"

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
          name: cueMarker.name,
        }))

      const bpmLock = markers2.data
        .filter(d => d instanceof SeratoBpmLockMarker)[0] as SeratoBpmLockMarker
      if (bpmLock) {
        trackInfo.bpmLock = bpmLock.isActive
      }

      const color = markers2.data
        .filter(d => d instanceof SeratoColorMarker)[0] as SeratoColorMarker
      if (color) {
        trackInfo.color = color.color
      }
    }

    return trackInfo
  }

  /**
   * Serialize TrackInfo to frames.
   */
  serialize(trackInfo: TrackInfo) {
    const markers2 = new SeratoMarkers2Frame()

    if (trackInfo.color !== undefined) {
      const colorMarker = Object.assign(new SeratoColorMarker(), {
        color: trackInfo.color,
      })

      markers2.data.push(colorMarker)
    }

    trackInfo.cues?.forEach((cue, index) => {
      const cueMarker = Object.assign(new SeratoCueMarker(), {
        index: cue.index || index,
        milliseconds: cue.milliseconds,
        color: cue.color || '#ff0000',
        name: cue.name || '',
      })

      markers2.data.push(cueMarker)
    })

    if (trackInfo.bpmLock !== undefined) {
      const bpmLockMarker = Object.assign(new SeratoBpmLockMarker(), {
        isActive: trackInfo.bpmLock,
      })

      markers2.data.push(bpmLockMarker)
    }

    return {
      [markers2.id]: this.encoder.encode(markers2),
    }
  }
}
