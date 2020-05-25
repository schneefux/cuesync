import LibraryManager from "../model/LibraryManager"
import { fuzzyTrackInfoEqual } from "../compare"
import TrackInfo from "../model/TrackInfo"
import * as fs from "fs"
import * as parserato from "@schneefux/parserato"

/**
 * LibraryManager that manages a single Serato crate.
 */
export default class SeratoLibraryManager implements LibraryManager {
  tracks: TrackInfo[] = []

  constructor(public cratePath: string) { }

  async load() {
    this.tracks = []
    const songPaths = await parserato.crate.listSongs(this.cratePath)
    for (const songPath of songPaths) {
      try {
        await fs.promises.access(songPath)
      } catch (err) {
        console.error('file does not exist', songPath) // TODO show error / handle in UI?
        continue
      }

      if (this.tracks.find(t => t.path == songPath)) {
        // duplicate
        continue
      }

      try {
        this.tracks.push(await this.loadTrack(songPath))
      } catch (err) {
        console.error('could not parse', songPath, err)
      }
    }
  }

  list() {
    return this.tracks
  }

  attributes() {
    const keys: (keyof TrackInfo)[] = ['title', 'album', 'artists',
      'cues', 'bpm', 'bpmLock', 'color',
      'durationSeconds', 'path', 'filename',
      'isrc', 'key', 'genre']
    return keys
  }

  /**
   * Return a track from the cache.
   */
  find(trackInfo: TrackInfo) {
    return this.tracks.find(t => fuzzyTrackInfoEqual(trackInfo, t)) || null
  }

  /**
   * Write Serato and ID3 tags.
   */
  async update(trackInfo: TrackInfo) {
    if (trackInfo.path === undefined) {
      throw new Error('track info path is undefined')
    }

    // Serato first beatgrid marker position = song start
    // Djay does not store BPM (unless it's set manually)
    // so this has to be calculated here
    if (trackInfo.songStart != undefined
        && trackInfo.bpm !== undefined
        && trackInfo.beatgridMarkers?.length == 0) {
      trackInfo.beatgridMarkers = [{
        position: trackInfo.songStart,
        bpm: trackInfo.bpm,
      }]
    }

    await parserato.track.write(trackInfo)
  }

  /**
   * Load a track and all its attributes from the file system.
   */
  async loadTrack(trackPath: string): Promise<TrackInfo> {
    const trackInfo = await parserato.track.read(trackPath) as TrackInfo

    // songStart is determined by first beatgrid marker position
    if (trackInfo.beatgridMarkers !== undefined) {
      trackInfo.songStart = trackInfo.beatgridMarkers[0].position;
    }
    // if no title is set, use filename
    if (trackInfo.title === undefined) {
      trackInfo.title = trackInfo.filename
    }

    return trackInfo
  }
}
