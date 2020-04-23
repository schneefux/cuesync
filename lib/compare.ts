import TrackInfo from "./model/TrackInfo";

/**
 * Fuzzy-compare two tracks and return true if they match.
 */
export default function fuzzyTrackInfoEqual(track1: TrackInfo, track2: TrackInfo) {
  // TODO
  if (track1.isrc !== undefined && track1.isrc == track2.isrc) {
    return true
  }

  if (track1.filename !== undefined && track1.filename == track2.filename) {
    return true
  }

  if (track1.title !== undefined && track1.title.toLowerCase() == track2.title?.toLowerCase()) {
    return true
  }

  return false
}

/**
 * Fuzzy-compare track and path and return true if they match.
 */
export function fuzzyTrackInfoMatchesPath(track: TrackInfo, path: string) {
  if (path.toLowerCase().includes(track.title?.toLowerCase())) {
    return true
  }

  return false
}