import TrackInfo from "./model/TrackInfo";

/**
 * Fuzzy-compare two tracks and return true if they match.
 */
export default function fuzzyTrackInfoEqual(track1: TrackInfo, track2: TrackInfo) {
  // TODO
  // TODO identify as much data as possible from file names
  if (track1.isrc !== undefined && track1.isrc == track2.isrc) {
    return true
  }

  if (track1.filename !== undefined && track1.filename == track2.filename) {
    return true
  }

  if (track1.title !== undefined && track1.title.toLowerCase() == track2.title?.toLowerCase()) {
    return true
  }

  if (track1.filename !== undefined && track1.filename.toLowerCase().includes(track2.title?.toLowerCase())) {
    return true
  }
  if (track2.filename !== undefined && track2.filename.toLowerCase().includes(track1.title?.toLowerCase())) {
    return true
  }

  return false
}