import { promisify } from "util"
import * as taglib from 'taglib3'
import SeratoTrackSerializer, { FrameMap } from "./SeratoTrackSerializer"
import LibraryManager from "../model/LibraryManager"
import * as path from 'path'
import TaglibInfo, { TaglibId3Info, TaglibAudioProperties } from "./taglib/model/taglib"
import { fuzzyTrackInfoEqual } from "../compare"
import TrackInfo from "../model/TrackInfo"
import * as fs from "fs"
import TaglibTrackSerializer from "./taglib/TaglibTrackSerializer"
import SeratoCrateReader from "./SeratoCrateReader"

const readId3Tags = promisify(taglib.readId3Tags)
const writeId3Tags = promisify(taglib.writeId3Tags)
const readTaglibTags = promisify(taglib.readTags)
const writeTaglibTags = promisify(taglib.writeTags)
const readAudioProperties = promisify(taglib.readAudioProperties)

/**
 * LibraryManager that manages a single Serato crate.
 */
export default class SeratoLibraryManager implements LibraryManager {
  tracks: TrackInfo[] = []
  taglibSerializer = new TaglibTrackSerializer()
  seratoSerializer = new SeratoTrackSerializer()
  crateReader = new SeratoCrateReader()

  constructor(public cratePath: string) { }

  async load() {
    this.tracks = []
    const songPaths = await this.crateReader.listSongs(this.cratePath)
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

    const taglibTags = this.taglibSerializer.serialize(trackInfo)
    await writeTaglibTags(trackInfo.path, taglibTags)
    await this.writeSeratoData(trackInfo.path, trackInfo)
  }

  /**
   * Load a track and all its attributes from the file system.
   */
  async loadTrack(trackPath: string): Promise<TrackInfo> {
    const seratoData = await this.readSeratoData(trackPath)
    const tags = await readTaglibTags(trackPath) as TaglibInfo
    const audioProperties = await readAudioProperties(trackPath) as TaglibAudioProperties
    const taglibData = this.taglibSerializer.deserialize(tags)

    return {
      path: trackPath,
      filename: path.basename(trackPath),
      durationSeconds: parseInt(audioProperties.length),
      ...seratoData,
      ...taglibData,
    }
  }

  /**
   * Read Serato meta data from an audio file.
   */
  async readSeratoData(path: string) {
    let frames: FrameMap

    if (path.endsWith('.mp3')) {
      const info = await readId3Tags(path) as TaglibId3Info
      frames = [...Object.entries(info)]
        .filter(([name, value]) => name.toLowerCase().startsWith('serato'))
        .reduce((obj, [name, value]) => ({ ...obj, [name]: Buffer.from(value, 'base64') }), {})
    } else {
      const mimetype = Buffer.from('application/octet-stream').toString('base64')
      const info = await readTaglibTags(path) as TaglibInfo
      frames = [...Object.entries(info)]
        .filter(([name, value]) => name.startsWith('SERATO_') && value.length == 1 && value[0].startsWith(mimetype))
        .reduce((obj, [name, value]) => ({ ...obj, [name]: Buffer.from(value[0], 'base64') }), {})
    }

    return this.seratoSerializer.deserialize(frames)
  }

  /**
   * Write Serato meta data to an audio file.
   */
  async writeSeratoData(trackPath: string, trackInfo: TrackInfo) {
    const tags = this.seratoSerializer.serialize(trackInfo)

    if (trackPath.endsWith('.mp3')) {
      await writeId3Tags(trackPath, {
        'Serato Markers2': tags['Serato Markers2'].toString('base64'),
        // 'Serato Markers_' duplicates first 5 cues
        // and gets precedence over Serato Markers2 -> delete it
        'Serato Markers_': '',
      })
    } else {
      // VORBIS COMMENT has newlines every 72 characters
      await writeTaglibTags(trackPath, {
        SERATO_MARKERS_V2: [tags['Serato Markers2'].toString('base64').replace(/(.{72})/g, '$1\n')],
      })
    }
  }
}
