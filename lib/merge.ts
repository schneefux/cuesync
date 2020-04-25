import TrackInfo from "./model/TrackInfo";

/**
 * Merge track data from different sources into one object.
 */
export default function mergeTrackInfo(...tracks: TrackInfo[]) {
  tracks = tracks.filter(t => t !== undefined && t !== null)
  const cues = tracks
    .filter(t => t.cues != undefined && t.cues.length > 0)
    .map(t => t.cues)[0] || []
  // TODO don't overwrite { bpm: 80 } with { bpm: undefined }
  return Object.assign({}, ...tracks, { cues })
}