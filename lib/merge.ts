import TrackInfo from "./model/TrackInfo";

/**
 * Return the TrackInfo object needed to write updates to a track
 * and whether any of the target track's data will be overwritten.
 */
export function calculateChanges(source: TrackInfo, target: TrackInfo) {
  let overwriting = false

  const changes = {
    path: target.path,
    filename: target.filename,
    durationSeconds: target.durationSeconds,
  } as TrackInfo

  // prefer target's artist, album, title
  // TODO UI needs this - it would be better to have different interfaces for reading/writing
  changes.artists = target.artists || source.artists
  changes.album = target.album || source.album
  changes.title = target.title || source.title

  if (source.cues !== undefined && source.cues.length > 0) {
    changes.cues = source.cues
    overwriting = overwriting || (target.cues !== undefined && target.cues.length > 0)
  }

  if (source.songStart !== undefined) {
    changes.songStart = source.songStart
    overwriting = overwriting || target.songStart !== undefined
  }

  if (source.beatgridMarkers !== undefined && source.beatgridMarkers.length > 0) {
    changes.beatgridMarkers = source.beatgridMarkers
    overwriting = overwriting || (target.beatgridMarkers !== undefined && target.beatgridMarkers.length > 0)
  }

  if (source.bpm !== undefined) {
    changes.bpm = source.bpm
    overwriting = overwriting || target.bpm !== undefined
  }

  if (source.key !== undefined) {
    changes.key = source.key
    overwriting = overwriting || target.key !== undefined
  }

  return {
    changes,
    overwriting,
  }
}
