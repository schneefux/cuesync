import { promisify } from "util"
import * as globCb from 'glob'
import * as taglib from 'taglib3'
import SeratoTrackSerializer, { FrameMap } from "./SeratoTrackSerializer"
import LibraryManager from "../model/LibraryManager"
import * as seratoCrater from 'serato-crater'
import * as path from 'path'
import TaglibInfo, { TaglibId3Info } from "../file/taglib/model/taglib"
import { fuzzyTrackInfoEqual } from "../compare"
import TrackInfo from "../model/TrackInfo"
import * as fs from "fs"

// TODO replace seratojs by own implementation
// or try https://github.com/Rickgg/serato-crater

const readId3Tags = promisify(taglib.readId3Tags)
const writeId3Tags = promisify(taglib.writeId3Tags)
const readTaglibTags = promisify(taglib.readTags)
const writeTaglibTags = promisify(taglib.writeTags)
const glob = promisify(globCb as any)

export default class SeratoLibraryManager implements LibraryManager {
  tracks: TrackInfo[] = []
  serializer = new SeratoTrackSerializer()

  constructor(public rootPath: string) { }

  async load() {
    this.tracks = []
    const crates = await this.listCrates(this.rootPath)
    for (const cratePath of crates) {
      const songPaths = await this.listSongs(cratePath)
      // TODO filter duplicates
      for (const songPath of songPaths) {
        try {
          await fs.promises.access(songPath)
        } catch (err) {
          console.error('file does not exist', songPath) // TODO show error / handle in UI?
          continue
        }

        try {
          const data = await this.readSeratoData(songPath)
          this.tracks.push({
            path: songPath,
            filename: path.basename(songPath),
            ...data,
          })
        } catch (err) {
          console.error('could not parse', songPath, err)
        }
      }
    }
  }

  list() {
    return this.tracks
  }

  /**
   * Find all crates under the given root path.
   */
  async listCrates(root: string) {
    const crates = await glob('**/_Serato_/Subcrates/*.crate', {
      cwd: root,
      silent: true,
      strict: false,
    })
    return crates.map(c => path.join(root, c))
  }

  /**
   * Read all songs from the crate.
   */
  async listSongs(crate: string) {
    // song paths are relative to the folder that contains the _Serato_ folder
    const crateData = await seratoCrater(crate) as { columns: string[], songs: string[] }
    const seratoParentPath = path.resolve(path.join(crate, '..', '..', '..'))
    return crateData.songs.map(song => path.join(seratoParentPath, song))
  }

  /**
   * Try to look up the file's path if it is unknown.
   * If a path is known, read Serato file data.
   */
  async find(trackInfo: TrackInfo) {
    return this.tracks.find(t => fuzzyTrackInfoEqual(trackInfo, t)) || null
  }

  async update(trackInfo: TrackInfo) {
    if (trackInfo.path === undefined) {
      throw new Error('track info path is undefined')
    }
    this.writeSeratoData(trackInfo.path, trackInfo)
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

    return this.serializer.deserialize(frames)
  }

  /**
   * Write Serato meta data to an audio file.
   */
  async writeSeratoData(trackPath: string, trackInfo: TrackInfo) {
    const tags = this.serializer.serialize(trackInfo)

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
