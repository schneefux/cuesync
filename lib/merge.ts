import TrackInfo from "./model/TrackInfo";

export default function mergeTrackInfo(track1: TrackInfo, track2: TrackInfo) {
  return {
    ...track1,
    ...track2,
    cues: [].concat(track1.cues || [], track2.cues || [])
  }
}