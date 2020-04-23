import TrackInfo from "./model/TrackInfo";

/**
 * Merge track data from different sources into one object.
 */
export default function mergeTrackInfo(...tracks: TrackInfo[]) {
  tracks = tracks.filter(t => t !== undefined && t !== null)
  const cues = [].concat(...tracks.map(t => t.cues || []))
  // TODO don't overwrite { bpm: 80 } with { bpm: undefined }
  return Object.assign({}, ...tracks, { cues })
}