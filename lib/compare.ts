import TrackInfo from "./model/TrackInfo";

/**
 * Fuzzy-compare two tracks and return true if the tracks are compatible.
 * Less strict than `fuzzyTrackInfoEqual`.
 */
export function fuzzyTrackInfoCandidate(track1: TrackInfo, track2: TrackInfo) {
  if (track1.durationSeconds !== undefined && track2.durationSeconds !== undefined
      && Math.abs(track1.durationSeconds - track2.durationSeconds) <= 1) {
    return true
  }

  return false
}

/**
 * Fuzzy-compare two tracks and return true if they match.
 */
export function fuzzyTrackInfoEqual(track1: TrackInfo, track2: TrackInfo) {
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
  if (track.title !== undefined && path.toLowerCase().includes(track.title.toLowerCase())) {
    return true
  }

  return false
}
